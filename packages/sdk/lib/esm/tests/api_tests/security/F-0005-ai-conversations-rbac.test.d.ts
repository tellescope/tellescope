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
export declare const ai_conversations_rbac_tests: ({ sdk, sdkNonAdmin }: {
    sdk: Session;
    sdkNonAdmin: Session;
}) => Promise<void>;
//# sourceMappingURL=F-0005-ai-conversations-rbac.test.d.ts.map