require('source-map-support').install();

import { Session } from "../../../sdk"
import {
  async_test,
  log_header,
  wait,
} from "@tellescope/testing"
import { setup_tests } from "../../setup"
import { PROVIDER_PERMISSIONS } from "@tellescope/constants"

const host = process.env.API_URL || 'http://localhost:8080' as const
const [nonAdminEmail, nonAdminPassword] = [process.env.NON_ADMIN_EMAIL, process.env.NON_ADMIN_PASSWORD]

const FULL_ACCESS = { create: 'All' as const, read: 'All' as const, update: 'All' as const, delete: 'All' as const }

// Schema fields tagged `redactions: ['all']` that must never appear in
// `/v1/data-sync` results. See packages/public/schema/src/schema.ts.
const REDACTABLE_FIELDS_BY_MODEL: Record<string, string[]> = {
  users:    ['hashedPass', 'hashedInviteCode'],
  endusers: ['hashedPassword'],
}

type Violation = { modelName: string, recordId: string, leakedField: string }

const collectViolations = (results: { modelName: string, recordId: string, data: string }[]): Violation[] => {
  const violations: Violation[] = []
  for (const record of results) {
    if (!record.data || record.data === 'deleted') continue
    const fields = REDACTABLE_FIELDS_BY_MODEL[record.modelName]
    if (!fields) continue
    let parsed: any
    try { parsed = JSON.parse(record.data) } catch { continue }
    for (const f of fields) {
      if (f in parsed && parsed[f] !== undefined && parsed[f] !== null && parsed[f] !== '') {
        violations.push({ modelName: record.modelName, recordId: record.recordId, leakedField: f })
      }
    }
  }
  return violations
}

/**
 * Regression test for F-0001 (security-audit/findings/F-0001-data-sync-bypasses-applyRedactions.md).
 *
 * The /v1/data-sync handler must apply the central applyRedactions() pipeline to
 * every non-deleted record. The original bug: redactions were gated behind
 *   `if (session.fieldRedactions && session.fieldRedactions[record.modelName])`
 * which meant any session without role-based field redactions (including all
 * admins) received raw records — leaking schema-level `redactions: ['all']`
 * fields (hashedPass, hashedPassword, hashedInviteCode).
 *
 * This test:
 *   1. Configures a non-admin user with broad read access on users + endusers
 *      and NO fieldRedactions — the realistic "regular user with read access"
 *      condition that triggers the bypass.
 *   2. Creates an enduser with a password to populate the sync stream.
 *   3. Calls /v1/data-sync as the non-admin.
 *   4. Asserts no returned record contains hashedPass / hashedPassword /
 *      hashedInviteCode.
 *
 * Pre-fix: assertion fails with leaked records.
 * Post-fix: assertion passes.
 */
export const data_sync_redaction_bypass_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("F-0001: /v1/data-sync field-redaction bypass regression")

  const roleName = `f0001-data-sync-bypass-${Date.now()}`
  let testEnduserId: string | undefined
  let rbapId: string | undefined
  const originalRoles = sdkNonAdmin.userInfo.roles

  try {
    // 1. Create a role with broad read access but NO fieldRedactions.
    //    This is the realistic "regular user with read access" condition
    //    that triggers the bypass in the pre-fix handler.
    const rbap = await sdk.api.role_based_access_permissions.createOne({
      role: roleName,
      permissions: {
        ...PROVIDER_PERMISSIONS,
        users: FULL_ACCESS,
        endusers: FULL_ACCESS,
      },
      // intentionally NO fieldRedactions — this is the exploit condition.
    })
    rbapId = rbap.id

    // 2. Assign role to the non-admin user and re-authenticate so the new
    //    session reflects the role's permissions.
    await sdk.api.users.updateOne(
      sdkNonAdmin.userInfo.id,
      { roles: [roleName] },
      { replaceObjectFields: true },
    )
    await wait(undefined, 1500)
    await sdkNonAdmin.authenticate(nonAdminEmail!, nonAdminPassword!)

    // 3. Create a test enduser and set a password — this populates
    //    `hashedPassword` on the enduser record and writes a data_sync_records
    //    row for it.
    const testEnduser = await sdk.api.endusers.createOne({
      fname: 'F0001Target',
      lname: 'Patient',
      email: `f0001-target-${Date.now()}@example.com`,
    })
    testEnduserId = testEnduser.id
    await sdk.api.endusers.set_password({ id: testEnduser.id, password: 'F0001TestPassword!123' })

    // The non-admin user's own `hashedPass` is set from login and refreshed
    // on every write to their user record (e.g., the role-assignment update
    // above). No extra setup needed for users.hashedPass to be in the stream.

    await wait(undefined, 500)

    // 4. As the non-admin, call /v1/data-sync from epoch zero to capture all
    //    sync records the role can see.
    const sync = await sdkNonAdmin.sync({ from: new Date(0) })

    // 5. Walk every record. Fail if any contains a `redactions: ['all']` field.
    const violations = collectViolations(sync.results)

    // Belt-and-suspenders: at least one user record SHOULD be in the stream
    // (the non-admin's own record). If the stream is empty, the assertion below
    // would pass vacuously — guard against that.
    const userRecordsInStream = sync.results.filter(r => r.modelName === 'users').length
    await async_test(
      "F-0001 guard: /v1/data-sync sync stream contains at least one user record",
      async () => ({ userRecords: userRecordsInStream, totalRecords: sync.results.length }),
      { onResult: r => r.userRecords >= 1 },
    )

    await async_test(
      "F-0001: /v1/data-sync must NOT return hashedPass / hashedPassword / hashedInviteCode (see security-audit/findings/F-0001)",
      async () => ({
        violationCount: violations.length,
        violations: violations.slice(0, 10),
        affectedModels: Array.from(new Set(violations.map(v => v.modelName))),
        affectedFields: Array.from(new Set(violations.map(v => v.leakedField))),
      }),
      { onResult: r => r.violationCount === 0 },
    )

    // ========================================================================
    // Additional coverage for applyRedactions code paths reachable via /v1/data-sync.
    // Each of these is a distinct branch in applyRedactions (routing.ts:1165-1238)
    // and could regress independently of the F-0001 fix.
    // ========================================================================

    // Case A: schema-level `redactions: ['all']` must apply to ADMIN sessions too.
    // Admins have no session.fieldRedactions, but `redactions: ['all']` is universal.
    // Pre-fix: admin saw hashedPass via data-sync because applyRedactions was skipped entirely.
    // Post-fix: applyRedactions always runs and `redactions: ['all']` strips for everyone.
    const adminSync = await sdk.sync({ from: new Date(0) })
    const adminViolations = collectViolations(adminSync.results)
    await async_test(
      "F-0001 coverage A: admin /v1/data-sync also strips redactions:['all'] fields (hashedPass etc.)",
      async () => ({
        violationCount: adminViolations.length,
        violations: adminViolations.slice(0, 10),
      }),
      { onResult: r => r.violationCount === 0 },
    )

    // Case B: `linkedAccountAccess` on users must be stripped when the caller is NOT
    // the record's owner. This is a separate branch in applyRedactions (routing.ts:1220-1225)
    // and protects against cross-user enumeration of who-requested-access-to-whom.
    // The non-admin user reads other user records via data-sync; if any of those
    // records have linkedAccountAccess set, it must be stripped on read.
    const otherUsersInStream = sync.results.filter(
      r => r.modelName === 'users' && r.recordId !== sdkNonAdmin.userInfo.id
    )
    const linkedAccountLeaks: { recordId: string }[] = []
    for (const record of otherUsersInStream) {
      if (!record.data || record.data === 'deleted') continue
      try {
        const parsed = JSON.parse(record.data)
        if ('linkedAccountAccess' in parsed && parsed.linkedAccountAccess !== undefined) {
          linkedAccountLeaks.push({ recordId: record.recordId })
        }
      } catch {}
    }
    await async_test(
      "F-0001 coverage B: /v1/data-sync strips linkedAccountAccess from other users' records",
      async () => ({
        otherUserRecords: otherUsersInStream.length,
        leakCount: linkedAccountLeaks.length,
        leaks: linkedAccountLeaks.slice(0, 5),
      }),
      { onResult: r => r.leakCount === 0 },
    )
  } finally {
    // Cleanup: restore non-admin's original roles, delete role and test enduser.
    try {
      await sdk.api.users.updateOne(
        sdkNonAdmin.userInfo.id,
        { roles: originalRoles ?? [] },
        { replaceObjectFields: true },
      )
    } catch {}
    if (rbapId) {
      try { await sdk.api.role_based_access_permissions.deleteOne(rbapId) } catch {}
    }
    if (testEnduserId) {
      try { await sdk.api.endusers.deleteOne(testEnduserId) } catch {}
    }
    // Re-authenticate the non-admin to drop the exploit role from their JWT
    // before subsequent tests run.
    // Role restore above re-triggers deauthenticate_user; wait > 1s so the freshly minted
    // token's (second-floored) iat lands after the deauth timestamp and isn't permanently
    // rejected by is_logged_in's iat-slack check. Matches the in-test re-auth above.
    await wait(undefined, 1500)
    try { await sdkNonAdmin.authenticate(nonAdminEmail!, nonAdminPassword!) } catch {}
  }
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await data_sync_redaction_bypass_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ F-0001 data-sync redaction-bypass test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ F-0001 data-sync redaction-bypass test suite failed:", error)
      process.exit(1)
    })
}
