import { Session } from "../../sdk";
/**
 * Google Calendar sync retry — integration coverage.
 *
 * ┌─ ARCHITECTURE NOTE (why the full mock-Google scenarios are gated) ──────────┐
 * │ SDK api_tests run in a SEPARATE process from the API server (they talk to    │
 * │ host = API_URL / http://localhost:8080). The retry scheduler, the Google     │
 * │ retryable-error predicates, and the google.calendar() client all live in the │
 * │ API SERVER process. A stub installed here (in the SDK test process) cannot   │
 * │ replace the server's in-process google client, so we cannot deterministically│
 * │ inject 429 / 500 / ECONNRESET responses from this test alone.                │
 * │                                                                              │
 * │ Two ways to run the full fail-429-then-succeed / exhaustion / cap scenarios: │
 * │  1. Run the API server with NODE_ENV=test and RETRY_SCHEDULER_DELAYS_MS=10,20 │
 * │     (already honored by the singleton constructor) plus a server-side        │
 * │     fault-injection hook on sdk.events.* that reads e.g.                      │
 * │     process.env.GCAL_TEST_FORCE_ERROR — that hook does not exist yet.         │
 * │  2. Drive the scheduler directly with the in-process unit tests, which DO     │
 * │     cover all retry mechanics deterministically:                             │
 * │       packages/private/api/api/modules/retry_scheduler.test.ts               │
 * │       packages/private/api/api/integrations/google.test.ts                   │
 * │                                                                              │
 * │ The scenario matrix below is recorded for when a server-side hook is added.  │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 * Scenario matrix (requires server-side Google fault injection — see note):
 *   1. create retry:   fail 429 once then succeed -> gcal reference written, NO background_errors
 *   2. exhaustion:     fail 429 on every call -> exactly one "Google Calendar Push Error" background_errors row
 *   3. non-retryable:  fail 403 -> background_errors written immediately, no retries
 *   4. create idempotency: fail ECONNRESET (network) -> NON-retryable for create (duplicate risk),
 *                          background_errors written, no retry, no duplicate insert
 *   5. update + delete: same as (1) for events.patch and events.delete
 *   6. cap exceeded:   maxOpenRetries=2, 3 events all fail retryably -> 3rd -> background_errors immediately
 *
 * The runnable assertions below cover what IS observable end-to-end without a
 * connected Google account: the refactored call sites must not regress the common
 * "user has no Google integration" path (no sync attempt, no background_errors, no retry).
 */
export declare const gcal_sync_retry_tests: ({ sdk }: {
    sdk: Session;
    sdkNonAdmin: Session;
}) => Promise<void>;
//# sourceMappingURL=gcal_sync_retry.test.d.ts.map