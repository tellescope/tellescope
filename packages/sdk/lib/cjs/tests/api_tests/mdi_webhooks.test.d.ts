import { Session } from "../../sdk";
/**
 * MD Integrations Webhooks Tests
 *
 * The inbound endpoint is security-first: it authenticates the tenant via the
 * static Authorization token BEFORE any DB write or side effect. These tests
 * assert those rejection paths, which don't require a configured MDI integration.
 *
 * NOTE: a full event round-trip (case_approved -> mdiStatus, offering_submitted
 * -> enduser_medications, message_created -> chat, etc.) requires an MDI
 * integration row carrying the Authorization token in webhooksSecret.
 * That row can only be created through the connect flow against valid MDI
 * Sandbox credentials (add_api_key_integration validates client creds via a live
 * MDI API call), so the end-to-end path is exercised in the Sandbox per the task
 * plan rather than here.
 */
export declare const mdi_webhooks_tests: ({ sdk, sdkNonAdmin }: {
    sdk: Session;
    sdkNonAdmin: Session;
}) => Promise<void>;
//# sourceMappingURL=mdi_webhooks.test.d.ts.map