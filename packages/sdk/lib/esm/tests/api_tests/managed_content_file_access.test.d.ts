import { Session } from "../../sdk";
/**
 * Tests for file_download_URL enduser access via managed content fallback.
 *
 * Verifies the backend fallback logic that allows endusers to access files
 * attached to managed content records they have access to, even when the
 * file itself does not have enduserId set or publicRead: true.
 */
export declare const managed_content_file_access_tests: ({ sdk, sdkNonAdmin }: {
    sdk: Session;
    sdkNonAdmin: Session;
}) => Promise<void>;
//# sourceMappingURL=managed_content_file_access.test.d.ts.map