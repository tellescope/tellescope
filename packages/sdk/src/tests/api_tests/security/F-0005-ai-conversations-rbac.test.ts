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
  let rbapId: string | undefined
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
