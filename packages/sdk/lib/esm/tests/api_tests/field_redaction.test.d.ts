import { Session } from "../../sdk";
/**
 * Tests for role-based field redactions on phone_calls.
 *
 * Verifies that fieldRedactions configured on a RoleBasedAccessPermission
 * properly hide specified fields from API responses across all read paths
 * (getOne, getSome) and write responses (updateOne).
 */
export declare const field_redaction_tests: ({ sdk, sdkNonAdmin }: {
    sdk: Session;
    sdkNonAdmin: Session;
}) => Promise<void>;
//# sourceMappingURL=field_redaction.test.d.ts.map