import { Session } from "../../../sdk";
/**
 * Regression test for F-0151
 * (security-audit/findings/F-0151-load-inbox-data-endusers-unredacted.md).
 *
 * load_inbox_data serialized $lookup'ed endusers via convert_id_name only (NOT applyRedactions),
 * so endusers.hashedPassword (redactions:['all']) leaked to staff sessions — while the sibling
 * phone_calls in the same response correctly went through applyRedactions.
 *
 * Repro: create an enduser, set their portal password (→ hashedPassword), seed an inbound
 * (logOnly) email so the enduser appears in the inbox join, then load_inbox_data as staff and
 * assert the returned enduser entry has NO hashedPassword.
 */
export declare const load_inbox_redaction_tests: ({ sdk }: {
    sdk: Session;
    sdkNonAdmin: Session;
}) => Promise<void>;
//# sourceMappingURL=F-0151-load-inbox-redaction.test.d.ts.map