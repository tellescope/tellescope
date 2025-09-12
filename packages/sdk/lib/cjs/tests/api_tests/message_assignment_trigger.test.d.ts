import { Session } from "../../sdk";
/**
 * Tests for the "Assign to Incoming Message" trigger action
 * Verifies assignment works for all incoming message types: Email, SMS, and ChatRoom
 */
export declare const message_assignment_trigger_tests: ({ sdk }: {
    sdk: Session;
}) => Promise<{
    success: boolean;
    results: {
        emailAssigned: true;
        smsAssigned: true;
        chatAssigned: true;
        outboundNotAssigned: true;
    };
}>;
//# sourceMappingURL=message_assignment_trigger.test.d.ts.map