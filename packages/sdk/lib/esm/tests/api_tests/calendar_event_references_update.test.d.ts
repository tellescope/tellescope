import { Session } from "../../sdk";
/**
 * CU-86e2dvrn9: calendar_events.references switched from updatesDisabled to
 * enduserUpdatesDisabled (schema.ts), mirroring the Enduser references behavior:
 *   - staff / API-key sessions may update references (e.g. to set or clear
 *     external appointment IDs like stale Elation references)
 *   - enduser (patient) sessions remain blocked — required because endusers DO
 *     have update access on calendar_events they attend (for cancelling)
 */
export declare const calendar_event_references_update_tests: ({ sdk }: {
    sdk: Session;
    sdkNonAdmin: Session;
}) => Promise<void>;
//# sourceMappingURL=calendar_event_references_update.test.d.ts.map