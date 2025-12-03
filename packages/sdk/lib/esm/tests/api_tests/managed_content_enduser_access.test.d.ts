import { Session } from "../../sdk";
/**
 * Tests for managed_content_records enduser access filtering.
 * Validates that the backend correctly filters content based on:
 * 1. assignmentType: 'All' - visible to all endusers
 * 2. enduserId match - direct individual assignment
 * 3. ManagedContentRecordAssignment - manual assignments
 * 4. assignmentType: 'By Tags' + tag overlap - tag-based assignment
 * 5. CalendarEvent.sharedContentIds - content shared via events
 *
 * Also verifies that filtering does NOT apply to user sessions.
 */
export declare const managed_content_enduser_access_tests: ({ sdk, sdkNonAdmin }: {
    sdk: Session;
    sdkNonAdmin: Session;
}) => Promise<void>;
//# sourceMappingURL=managed_content_enduser_access.test.d.ts.map