import { Session } from "../../../sdk";
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
export declare const data_sync_redaction_bypass_tests: ({ sdk, sdkNonAdmin }: {
    sdk: Session;
    sdkNonAdmin: Session;
}) => Promise<void>;
//# sourceMappingURL=F-0001-data-sync-redaction-bypass.test.d.ts.map