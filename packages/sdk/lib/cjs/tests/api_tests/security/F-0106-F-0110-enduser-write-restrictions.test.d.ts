import { Session } from "../../../sdk";
/**
 * Regression test for F-0106 and F-0110
 * (security-audit/findings/F-0106-enduser-self-update-admin-only-fields.md,
 *  security-audit/findings/F-0110-form-responses-enduser-update-admin-only-fields.md).
 *
 * Endusers could PATCH admin-only / access-bearing / attribution-bearing fields on
 * their own endusers record (assignedTo, tags, references, ...) and their own
 * form_responses (procedureCodes, submittedBy, markedAsSubmitted, ...). The fix adds
 * the `enduserUpdatesDisabled` field option (schema.ts ModelFieldInfo), enforced for
 * enduser sessions in the generic update handler (routing.ts createDefaultEndpoints).
 *
 * This test asserts, for every flagged field on both models:
 *   - an enduser session updating its OWN record gets a 400 "<field> cannot be updated by endusers"
 *   - nothing persists (spot-checked on assignedTo, the highest-impact field)
 *   - enduser self-updates of allowed fields still work (fname, hideFromEnduserPortal)
 *   - staff sessions can still update the restricted fields
 */
export declare const enduser_write_restrictions_tests: ({ sdk }: {
    sdk: Session;
    sdkNonAdmin: Session;
}) => Promise<void>;
//# sourceMappingURL=F-0106-F-0110-enduser-write-restrictions.test.d.ts.map