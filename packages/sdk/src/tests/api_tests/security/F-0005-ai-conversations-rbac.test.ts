require('source-map-support').install();

import { ObjectId } from 'bson'
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

/**
 * Regression test for F-0005 (security-audit/findings/F-0005-ai-conversations-bypass-rbac.md).
 *
 * Both `ai_conversations.send_message` and `ai_conversations.generate_ai_decision` are
 * registered with `noAccessPermissions: true` ([api.ts:22699, 22721](packages/private/api/api/v1/api.ts)).
 * Their only access gate is `if (req.session.type === 'enduser') throw 403`. They must ALSO
 * check `session.access?.ai_conversations?.<action>` (and `session.access?.endusers?.read`
 * for generate_ai_decision) — the standard pattern used 16 lines earlier in the same file
 * at api.ts:22680 for the background_errors handler.
 *
 * This test:
 *   1. Creates a role with explicit NO_ACCESS for ai_conversations (and endusers).
 *   2. Assigns the role to the non-admin user.
 *   3. Calls each endpoint as the non-admin.
 *   4. Asserts each endpoint returns a 403-equivalent error (not 200).
 *   5. Positive case: a role granting ai_conversations create (read/update denied) must pass
 *      the send_message gate — generating a NEW conversation requires only create access.
 *   6. But the same role must still 403 when passing a conversationId: continuing an existing
 *      conversation reads its stored history (returned in the response) and appends to it,
 *      so it requires read + update access in addition to create.
 *   7. Default-provider-permissions role (ai_conversations = Assigned): send_message must not
 *      500. Regression: the post-generation $push previously ran through the caller's
 *      access-scoped DB, where "Assigned" filters can't match the just-created conversation,
 *      returning null and crashing the handler (Cannot read properties of null '_id') after
 *      credits were consumed. bedrock.ts now persists via tenant-scoped org-wide queries.
 *
 * Pre-fix:
 *   - send_message: 200 (or some downstream error from Bedrock) — NOT 403. Test fails.
 *   - generate_ai_decision: 200 with `{}` (handler responds early before access check). Test fails.
 *
 * Post-fix: both endpoints throw 403 before any work happens. Test passes.
 */
export const ai_conversations_rbac_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("F-0005: ai_conversations RBAC bypass regression")

  const roleName = `f0005-ai-conversations-no-access-${Date.now()}`
  const grantRoleName = `f0005-ai-conversations-create-granted-${Date.now()}`
  const assignedRoleName = `f0005-ai-conversations-assigned-default-${Date.now()}`
  let rbapId: string | undefined
  let grantRbapId: string | undefined
  let assignedRbapId: string | undefined
  const originalRoles = sdkNonAdmin.userInfo.roles

  try {
    // 1. Create a role that explicitly denies ai_conversations access AND endusers access.
    //    This is the realistic configuration the bypass affects: a tenant operator
    //    deliberately restricts a role from reading AI conversations / enduser PHI.
    const rbap = await sdk.api.role_based_access_permissions.createOne({
      role: roleName,
      permissions: {
        ...PROVIDER_PERMISSIONS,
        ai_conversations: { create: null, read: null, update: null, delete: null },
        endusers:         { create: null, read: null, update: null, delete: null },
      },
    })
    rbapId = rbap.id

    // 2. Assign the role to the non-admin user and re-authenticate so the new
    //    session reflects the role's denied permissions.
    await sdk.api.users.updateOne(
      sdkNonAdmin.userInfo.id,
      { roles: [roleName] },
      { replaceObjectFields: true },
    )
    await wait(undefined, 1500)
    await sdkNonAdmin.authenticate(nonAdminEmail!, nonAdminPassword!)

    // 3a. send_message must throw 403 (or equivalent access error). Pre-fix: succeeds (or
    //     fails downstream in Bedrock without 403). Post-fix: throws before any work.
    await async_test(
      "F-0005: ai_conversations.send_message must throw 403 when role denies ai_conversations",
      () => sdkNonAdmin.api.ai_conversations.send_message({
        message: 'F-0005 regression test',
        type: 'Test',
      } as any),
      {
        shouldError: true,
        onError: (e: any) => {
          // Accept any 4xx access-denial response — handler may use 403 (recommended)
          // or 400 with "access" / "permission" in the message.
          const msg = (e?.message ?? '').toLowerCase()
          const status = e?.status ?? e?.code
          return status === 403 || status === 401
            || msg.includes('access') || msg.includes('permission') || msg.includes('forbidden')
        },
      },
    )

    // 3b. generate_ai_decision must throw 403 BEFORE the early res.json({}) response.
    //     Pre-fix: handler responds 200 with {} immediately and processes in background.
    //     Post-fix: handler throws 403 before res.json({}).
    await async_test(
      "F-0005: ai_conversations.generate_ai_decision must throw 403 when role denies endusers/ai_conversations",
      () => sdkNonAdmin.api.ai_conversations.generate_ai_decision({
        enduserId: new ObjectId().toHexString(),        // fake id — access check should fire first
        automationStepId: new ObjectId().toHexString(),  // fake id — access check should fire first
        outcomes: ['yes', 'no'],
        prompt: 'F-0005 regression test',
        sources: [{ type: 'SMS', limit: 1 }],            // non-empty so the validator passes; access check then fires
      } as any),
      {
        shouldError: true,
        onError: (e: any) => {
          const msg = (e?.message ?? '').toLowerCase()
          const status = e?.status ?? e?.code
          return status === 403 || status === 401
            || msg.includes('access') || msg.includes('permission') || msg.includes('forbidden')
        },
      },
    )

    // 4. Positive case: granting only ai_conversations create must pass the RBAC gate.
    //    send_message may still fail downstream (e.g. 400 "Organization has not set up credits"),
    //    but it must NOT be an access-denial error.
    const grantRbap = await sdk.api.role_based_access_permissions.createOne({
      role: grantRoleName,
      permissions: {
        ...PROVIDER_PERMISSIONS,
        ai_conversations: { create: 'All', read: null, update: null, delete: null },
      },
    })
    grantRbapId = grantRbap.id

    await sdk.api.users.updateOne(
      sdkNonAdmin.userInfo.id,
      { roles: [grantRoleName] },
      { replaceObjectFields: true },
    )
    await wait(undefined, 1500)
    await sdkNonAdmin.authenticate(nonAdminEmail!, nonAdminPassword!)

    await async_test(
      "F-0005: ai_conversations.send_message must NOT be access-denied when role grants create",
      () => sdkNonAdmin.api.ai_conversations.send_message({
        message: 'F-0005 positive-case test',
        type: 'Test',
        maxTokens: 1,
      } as any)
        .then(() => 'allowed' as const)
        .catch((e: any) => {
          const msg = (e?.message ?? '').toLowerCase()
          const status = e?.status ?? e?.code
          if (status === 403 || status === 401
            || msg.includes('access') || msg.includes('permission') || msg.includes('forbidden')) {
            throw e // access denial — the gate incorrectly blocked a create-granted role
          }
          return 'allowed' as const // downstream (e.g. credits) error is fine — the gate passed
        }),
      { onResult: r => r === 'allowed' },
    )

    // 5. The create-granted (read/update-denied) role must still be blocked from CONTINUING an
    //    existing conversation — send_message with conversationId returns the full stored history
    //    and appends to it. Fake id is fine: the access check must fire before any lookup.
    await async_test(
      "F-0005: ai_conversations.send_message with conversationId must 403 when role denies read/update",
      () => sdkNonAdmin.api.ai_conversations.send_message({
        message: 'F-0005 conversationId bypass test',
        type: 'Test',
        maxTokens: 1,
        conversationId: new ObjectId().toHexString(),
      } as any),
      {
        shouldError: true,
        onError: (e: any) => {
          const msg = (e?.message ?? '').toLowerCase()
          const status = e?.status ?? e?.code
          return status === 403 || status === 401
            || msg.includes('access') || msg.includes('permission') || msg.includes('forbidden')
        },
      },
    )

    // 6. Regression: a role with default provider permissions (ai_conversations = Assigned)
    //    must be able to generate a new conversation without a 500. Previously the
    //    post-generation $push ran through the access-scoped DB, matched nothing under
    //    "Assigned", and crashed the handler with "Cannot read properties of null ('_id')".
    const assignedRbap = await sdk.api.role_based_access_permissions.createOne({
      role: assignedRoleName,
      permissions: { ...PROVIDER_PERMISSIONS },
    })
    assignedRbapId = assignedRbap.id

    await sdk.api.users.updateOne(
      sdkNonAdmin.userInfo.id,
      { roles: [assignedRoleName] },
      { replaceObjectFields: true },
    )
    await wait(undefined, 1500)
    await sdkNonAdmin.authenticate(nonAdminEmail!, nonAdminPassword!)

    await async_test(
      "F-0005: ai_conversations.send_message must not 500 for Assigned-access (default provider) role",
      () => sdkNonAdmin.api.ai_conversations.send_message({
        message: 'F-0005 assigned-access regression test',
        type: 'Test',
        maxTokens: 1,
      } as any)
        .then(() => 'ok' as const)
        .catch((e: any) => {
          const msg = (e?.message ?? '').toLowerCase()
          const status = e?.status ?? e?.code
          if (status === 500 || msg.includes('internal error') || msg.includes('cannot read properties')) {
            throw e // the null-update crash — regression
          }
          if (status === 403 || status === 401
            || msg.includes('access') || msg.includes('permission') || msg.includes('forbidden')) {
            throw e // Assigned access must pass the RBAC gate
          }
          return 'ok' as const // downstream (e.g. credits) error is fine
        }),
      { onResult: r => r === 'ok' },
    )
  } finally {
    // Cleanup: restore original roles, delete the test role.
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
    if (grantRbapId) {
      try { await sdk.api.role_based_access_permissions.deleteOne(grantRbapId) } catch {}
    }
    if (assignedRbapId) {
      try { await sdk.api.role_based_access_permissions.deleteOne(assignedRbapId) } catch {}
    }
    // Re-authenticate the non-admin to drop the no-access role from their JWT
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
    await ai_conversations_rbac_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ F-0005 ai_conversations RBAC test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ F-0005 ai_conversations RBAC test suite failed:", error)
      process.exit(1)
    })
}
