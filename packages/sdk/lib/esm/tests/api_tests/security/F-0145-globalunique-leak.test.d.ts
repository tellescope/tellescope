import { Session } from "../../../sdk";
/**
 * Regression test for F-0145
 * (security-audit/findings/F-0145-globalunique-conflict-leaks-cross-tenant-record.md).
 *
 * The create endpoint generator's unconditional globalUnique-enforcement block
 * (routing.ts, "globalUnique should be enforced even if _overrideUnique is true")
 * threw uniquenessError([{ existingRecord: matches[0] }]) with the RAW matched record.
 * `findSomeByMatchAny_Global` deletes businessId, so the match is global; for `users`
 * (globalUnique: ['email','phone']) the 409 body leaked the full record incl. hashedPass.
 *
 * Fix: redact existingRecord to { _id, businessId } like the safe validateUniquenessConstraints
 * path. This reproduces the leak with a same-tenant collision (same code path) and asserts the
 * 409 body's existingRecord exposes nothing beyond _id + businessId.
 */
export declare const globalunique_leak_tests: ({ sdk }: {
    sdk: Session;
    sdkNonAdmin: Session;
}) => Promise<void>;
//# sourceMappingURL=F-0145-globalunique-leak.test.d.ts.map