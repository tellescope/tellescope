import { Session } from "../../../sdk";
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
export declare const ai_conversations_rbac_tests: ({ sdk, sdkNonAdmin }: {
    sdk: Session;
    sdkNonAdmin: Session;
}) => Promise<void>;
//# sourceMappingURL=F-0005-ai-conversations-rbac.test.d.ts.map