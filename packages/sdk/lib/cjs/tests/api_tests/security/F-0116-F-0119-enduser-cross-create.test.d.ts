import { Session } from "../../../sdk";
/**
 * Regression test for the enduser cross-enduser CREATE gating gaps:
 *   F-0116 enduser_observations  (security-audit/findings/F-0116-*.md)
 *   F-0117 enduser_orders        (security-audit/findings/F-0117-*.md)
 *   F-0119 managed_content_records (security-audit/findings/F-0119-*.md)
 *   F-0118 chat_rooms (enduserIds-only gate; staff userIds targeting is by-design)
 *
 * Each model exposed enduserActions.create with an `enduserId`/`enduserIds` field that
 * lacked a write-side gate, letting an authenticated enduser create records bound to a
 * DIFFERENT enduser in the same tenant. The fix adds a `constraints.relationship`
 * evaluator mirroring the canonical `tickets` pattern (schema.ts).
 *
 * Methodology: each section asserts BOTH the exploit-is-blocked case AND that the
 * legitimate path (self-create + staff-create) still works.
 */
export declare const enduser_cross_create_tests: ({ sdk }: {
    sdk: Session;
    sdkNonAdmin: Session;
}) => Promise<void>;
//# sourceMappingURL=F-0116-F-0119-enduser-cross-create.test.d.ts.map