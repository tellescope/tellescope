require('source-map-support').install();

import { Session } from "../../../sdk"
import {
  assert,
  log_header,
  wait,
} from "@tellescope/testing"
import { setup_tests } from "../../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

/**
 * Self-role privilege-escalation guard (relates to security-audit finding F-0076, which was
 * investigated and closed as a FALSE POSITIVE — see that file for the full code trace).
 *
 * F-0076 hypothesized that a non-admin staff user could `PATCH /v1/users/{their-own-id}` with
 * `{ roles: ['Admin'] }` and self-promote to Admin, because the FIRST `users` relationship
 * constraint ("Only admin users can set the admin role",
 * [schema.ts:3446](packages/public/schema/src/schema.ts#L3446)) has a self-exception
 * (`if (_id === session.id) return`).
 *
 * That analysis missed the SECOND constraint, "Only admin users can update user roles"
 * ([schema.ts:3486](packages/public/schema/src/schema.ts#L3486)), which has NO self-exception.
 * Relationship constraints are AND-evaluated — `validateRelationshipConstraints`
 * ([routing.ts:1240-1252](packages/private/api/api/modules/routing.ts#L1240)) loops the whole
 * array and throws 400 on the FIRST evaluator that returns a string. So a non-admin self-update
 * that includes `roles` passes constraint #1 (self-exception) but is rejected by constraint #2.
 * The self-promotion is blocked.
 *
 * This test locks that boundary in place so a future refactor of the role constraints can't
 * silently reintroduce the escalation. A dedicated throwaway non-admin user is used as the
 * "attacker" (we never mutate the shared sdkNonAdmin's roles):
 *   1. Admin creates a throwaway user and assigns it a non-admin role (`['Provider']`).
 *   2. Authenticate AS that user via a freshly-minted auth token.
 *   3. As the attacker, attempt four self-role mutations — ['Admin'], ['Provider','Admin'],
 *      an arbitrary role, and [] — and assert EACH is blocked.       <-- the security assertions
 *   4. Confirm (as admin) the attacker's roles are still ['Provider'] — nothing slipped through.
 *   5. Positive control: admin CAN update the throwaway user's roles. <-- guards against an
 *      over-restrictive regression that would block legitimate admin role management.
 *
 * Expected on current (correct) code: all assertions pass. A regression that made the self-update
 * path role-writable by non-admins would flip the step-3/step-4 assertions to red.
 */
export const self_admin_role_assignment_tests = async ({ sdk } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("F-0076: self-admin role assignment privilege-escalation regression")

  const stamp = Date.now()
  const NON_ADMIN_ROLE = 'Provider'

  // Assert that a self-role-update attempt is rejected by the relationship constraints.
  const expect_blocked = async (fn: () => Promise<any>, description: string) => {
    try {
      await fn()
      assert(false, `${description} - SELF-ROLE ESCALATION SUCCEEDED (expected it to be blocked)`)
    } catch (e: any) {
      // CRUD relationship-constraint failures surface as 400 { message, info } via SDK parseError.
      assert(
        e?.code === 400 || e?.statusCode === 400 || typeof e?.message === 'string',
        `${description} - expected a block error, got: ${JSON.stringify(e)}`,
        description,
      )
    }
  }

  let attackerId: string | undefined

  try {
    // 1. Admin creates a throwaway non-admin user (notification emails off, timestamped email).
    //    verifiedEmail is set at creation (admin-only, updatesDisabled after) so the attacker can
    //    drive an authenticated session — otherwise actions are blocked on email-verification, not
    //    on the role constraint we're actually testing.
    const attacker = await sdk.api.users.createOne({
      email: `f0076-attacker-${stamp}@example.com`,
      notificationEmailsDisabled: true,
      verifiedEmail: true,
    } as any)
    attackerId = attacker.id
    await sdk.api.users.updateOne(attackerId, { roles: [NON_ADMIN_ROLE] }, { replaceObjectFields: true })
    await wait(undefined, 2000) // role change triggers a logout; let it propagate before minting a token

    // Setup sanity: the attacker holds exactly the non-admin role and is NOT an admin.
    const attackerBefore = await sdk.api.users.getOne(attackerId)
    assert(
      JSON.stringify(attackerBefore.roles) === JSON.stringify([NON_ADMIN_ROLE]),
      `Setup failed: expected attacker to hold [${NON_ADMIN_ROLE}], got ${JSON.stringify(attackerBefore.roles)}`,
      'F-0076 setup: attacker holds a non-admin role',
    )

    // 2. Authenticate AS the attacker (no password needed — admin mints an auth token).
    const sdkAttacker = new Session({
      host,
      authToken: (await sdk.api.users.generate_auth_token({ id: attackerId })).authToken,
    })
    await sdkAttacker.refresh_session() // populate userInfo from the freshly-minted token
    assert(
      sdkAttacker.userInfo.id === attackerId && !(sdkAttacker.userInfo.roles ?? []).includes('Admin'),
      `Setup failed: attacker session is not the expected non-admin user`,
      'F-0076 setup: authenticated as the non-admin attacker',
    )

    // 3. SECURITY ASSERTIONS — every self-role mutation by the non-admin must be blocked.
    await expect_blocked(
      () => sdkAttacker.api.users.updateOne(attackerId!, { roles: ['Admin'] }, { replaceObjectFields: true }),
      'F-0076: non-admin self-update to [Admin] is blocked',
    )
    await expect_blocked(
      () => sdkAttacker.api.users.updateOne(attackerId!, { roles: [NON_ADMIN_ROLE, 'Admin'] }, { replaceObjectFields: true }),
      'F-0076: non-admin self-update to [Provider, Admin] is blocked',
    )
    await expect_blocked(
      () => sdkAttacker.api.users.updateOne(attackerId!, { roles: [`Arbitrary_${stamp}`] }, { replaceObjectFields: true }),
      'F-0076: non-admin self-update to an arbitrary role is blocked',
    )
    await expect_blocked(
      () => sdkAttacker.api.users.updateOne(attackerId!, { roles: [] }, { replaceObjectFields: true }),
      'F-0076: non-admin self-update to [] (would grant defaults) is blocked',
    )

    // 4. STATE ASSERTION — nothing slipped through; roles are still the original non-admin role.
    const attackerAfter = await sdk.api.users.getOne(attackerId)
    assert(
      JSON.stringify(attackerAfter.roles) === JSON.stringify([NON_ADMIN_ROLE]),
      `ESCALATION LEAK: attacker roles changed to ${JSON.stringify(attackerAfter.roles)} `
        + `after self-update attempts. Expected [${NON_ADMIN_ROLE}].`,
      'F-0076: attacker roles unchanged after all self-escalation attempts',
    )

    // 5. POSITIVE CONTROL — an Admin CAN update the user's roles (mechanism is not over-restricted).
    await sdk.api.users.updateOne(attackerId, { roles: [NON_ADMIN_ROLE] }, { replaceObjectFields: true })
    const afterAdminUpdate = await sdk.api.users.getOne(attackerId)
    assert(
      JSON.stringify(afterAdminUpdate.roles) === JSON.stringify([NON_ADMIN_ROLE]),
      `Admin role update failed: roles are ${JSON.stringify(afterAdminUpdate.roles)}, expected [${NON_ADMIN_ROLE}]`,
      'F-0076: admin can manage user roles (positive control)',
    )
  } finally {
    // Cleanup: delete the throwaway attacker. Never touches pre-existing users.
    if (attackerId) {
      try { await sdk.api.users.deleteOne(attackerId) } catch {}
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
    await self_admin_role_assignment_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ F-0076 self-admin role assignment test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ F-0076 self-admin role assignment test suite failed:", error)
      process.exit(1)
    })
}
