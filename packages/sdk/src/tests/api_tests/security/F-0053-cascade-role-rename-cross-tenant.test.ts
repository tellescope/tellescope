require('source-map-support').install();

import { Session } from "../../../sdk"
import {
  assert,
  log_header,
  wait,
} from "@tellescope/testing"
import { setup_tests } from "../../setup"
import { PROVIDER_PERMISSIONS } from "@tellescope/constants"

const host = process.env.API_URL || 'http://localhost:8080' as const

// Separate tenant (different businessId), reusing the same hardcoded apiKey that
// multi_tenant_tests relies on in tests.ts.
const OTHER_TENANT_API_KEY = "ba745e25162bb95a795c5fa1af70df188d93c4d3aac9c48b34a5c8c9dd7b80f7"

/**
 * Tenant-boundary guard for cascade_role_rename (relates to security-audit finding F-0053,
 * which was investigated and closed as a FALSE POSITIVE — see that file for the code trace).
 *
 * The `cascade_role_rename` side-effect handler
 * ([event_handlers_v2/role_based_access_permissions.ts](packages/private/api/api/v1/event_handlers_v2/role_based_access_permissions.ts))
 * runs when a `role_based_access_permissions` doc's `role` field changes. It finds every user
 * with the old role name (via `DBUnrestricted.users`) and rewrites their `roles` array, then
 * deauthenticates them. F-0053 hypothesized this query was globally cross-tenant. It is NOT:
 * `DBUnrestricted` bypasses per-user/per-role RBAC but is STILL scoped to the acting session's
 * `businessId` (see `modifyFilterForAccessConstraint` injecting `{ businessId }` at
 * database.ts:1761-1763, reached via the `unrestricted: true` branch at database.ts:2137-2144).
 *
 * This test locks that boundary in place so a future refactor of `DBUnrestricted` semantics
 * can't silently turn the cascade into a cross-tenant write:
 *   1. Tenant A creates a role `ROLE_OLD` and assigns it to a Tenant A user (positive control).
 *   2. Tenant B (separate businessId) has a user whose roles include the SAME `ROLE_OLD`.
 *   3. Tenant A renames the role `ROLE_OLD` -> `ROLE_NEW`.
 *   4. Assert the Tenant B user's roles are UNCHANGED (still `[ROLE_OLD]`)  <-- guards the tenant boundary.
 *   5. Assert the Tenant A user's roles ARE renamed to `[ROLE_NEW]`         <-- same-tenant cascade works.
 *
 * Expected on current (correct) code: BOTH assertions pass. A regression that drops the
 * `businessId` scoping would flip assertion #4 to red (Tenant B user becomes `[ROLE_NEW]`).
 *
 * A collision-proof unique role name (timestamped) is used so the test never touches real roles.
 */
export const cascade_role_rename_cross_tenant_tests = async ({ sdk } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("F-0053: cascade role rename cross-tenant regression")

  const stamp = Date.now()
  const ROLE_OLD = `XTenantRename_${stamp}`
  const ROLE_NEW = `${ROLE_OLD}_renamed`

  // Tenant B = a genuinely separate businessId (the apiKey's org). admin is required to create /
  // set roles on users, so the apiKey user must be an Admin in its org.
  const sdkOther = new Session({ host, apiKey: OTHER_TENANT_API_KEY })

  let rbapId: string | undefined
  // We create dedicated throwaway users in BOTH tenants and delete them in `finally`. We never
  // mutate any pre-existing user (an earlier version of this test clobbered the apiKey's own
  // admin user via getSome+replaceObjectFields — see F-0053 finding notes). controlUser lives in
  // Tenant A and SHOULD be renamed by the same-tenant cascade; victimUser lives in Tenant B and
  // must be UNTOUCHED.
  let controlUserId: string | undefined
  let victimUserId: string | undefined

  try {
    const tenantABusinessId = sdk.userInfo.businessId

    // 1. Tenant A: create the role to be renamed.
    const rbap = await sdk.api.role_based_access_permissions.createOne({
      role: ROLE_OLD,
      permissions: { ...PROVIDER_PERMISSIONS },
    })
    rbapId = rbap.id

    // 2. Tenant A: create a throwaway control user holding ROLE_OLD (notification emails off).
    const controlUser = await sdk.api.users.createOne({
      email: `f0053-control-${stamp}@example.com`,
      notificationEmailsDisabled: true,
    } as any)
    controlUserId = controlUser.id
    await sdk.api.users.updateOne(controlUserId, { roles: [ROLE_OLD] }, { replaceObjectFields: true })

    // 3. Tenant B: create a throwaway victim user holding the SAME ROLE_OLD.
    const victimUser = await sdkOther.api.users.createOne({
      email: `f0053-victim-${stamp}@example.com`,
      notificationEmailsDisabled: true,
    } as any)
    victimUserId = victimUser.id
    await sdkOther.api.users.updateOne(victimUserId, { roles: [ROLE_OLD] }, { replaceObjectFields: true })

    // 4. Setup sanity: tenants are distinct and both users actually hold ROLE_OLD before the rename.
    //    (Distinguishes a setup failure from the security assertion below.)
    assert(
      victimUser.businessId !== tenantABusinessId,
      `Victim user shares businessId with Tenant A (${victimUser.businessId}) — not a cross-tenant scenario`,
      'F-0053 setup: tenants are distinct',
    )
    const victimBefore = await sdkOther.api.users.getOne(victimUserId)
    const controlBefore = await sdk.api.users.getOne(controlUserId)
    assert(
      JSON.stringify(victimBefore.roles) === JSON.stringify([ROLE_OLD])
        && JSON.stringify(controlBefore.roles) === JSON.stringify([ROLE_OLD]),
      `Setup failed: expected both users to hold [${ROLE_OLD}] (victim=${JSON.stringify(victimBefore.roles)}, control=${JSON.stringify(controlBefore.roles)})`,
      'F-0053 setup: both users hold ROLE_OLD',
    )

    // 5. Tenant A renames the role. This triggers cascade_role_rename.
    await sdk.api.role_based_access_permissions.updateOne(rbapId, { role: ROLE_NEW })
    await wait(undefined, 1500) // let the side effect run

    // 6. SECURITY ASSERTION — the Tenant B victim must be untouched by Tenant A's rename.
    const victimAfter = await sdkOther.api.users.getOne(victimUserId)
    assert(
      JSON.stringify(victimAfter.roles) === JSON.stringify([ROLE_OLD]),
      `CROSS-TENANT LEAK: Tenant B victim roles changed to ${JSON.stringify(victimAfter.roles)} `
        + `after Tenant A renamed its role. Expected [${ROLE_OLD}].`,
      'F-0053: Tenant B user roles unaffected by other-tenant role rename',
    )

    // 7. POSITIVE CONTROL — the Tenant A control user SHOULD be renamed (same-tenant cascade intact).
    const controlAfter = await sdk.api.users.getOne(controlUserId)
    assert(
      JSON.stringify(controlAfter.roles) === JSON.stringify([ROLE_NEW]),
      `Same-tenant cascade broken: Tenant A control roles are ${JSON.stringify(controlAfter.roles)}, `
        + `expected [${ROLE_NEW}].`,
      'F-0053: Tenant A user roles renamed by same-tenant cascade',
    )
  } finally {
    // Cleanup: delete both throwaway users and the role doc. Never touches pre-existing users.
    if (victimUserId) {
      try { await sdkOther.api.users.deleteOne(victimUserId) } catch {}
    }
    if (controlUserId) {
      try { await sdk.api.users.deleteOne(controlUserId) } catch {}
    }
    if (rbapId) {
      try { await sdk.api.role_based_access_permissions.deleteOne(rbapId) } catch {}
    }
  }
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await cascade_role_rename_cross_tenant_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ F-0053 cascade role rename cross-tenant test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ F-0053 cascade role rename cross-tenant test suite failed:", error)
      process.exit(1)
    })
}
