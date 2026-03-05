import { Session } from "../../sdk";
/**
 * Security tests for endpoints with noAccessPermissions: true
 *
 * These tests verify that endpoints which bypass the standard middleware access check
 * still properly enforce NO_ACCESS restrictions in their handlers.
 *
 * Test approach:
 * 1. Create a role with NO_ACCESS (null) for a specific model
 * 2. Assign that role to a non-admin user
 * 3. Attempt to call the endpoint
 * 4. Verify whether access is properly denied
 *
 * If a test shows data is returned when it shouldn't be, that endpoint needs a fix.
 */
export declare const no_access_permission_checks_tests: ({ sdk, sdkNonAdmin }: {
    sdk: Session;
    sdkNonAdmin: Session;
}) => Promise<void>;
//# sourceMappingURL=no_access_permission_checks.test.d.ts.map