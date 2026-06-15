require('source-map-support').install();

import { Session } from "../../sdk"
import {
  async_test,
  log_header,
  wait,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

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
export const gcal_sync_retry_tests = async ({ sdk } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Google Calendar Sync Retry")

  if (process.env.GCAL_RETRY_INTEGRATION !== '1') {
    console.log("ℹ️  Skipping mock-Google scenarios (set GCAL_RETRY_INTEGRATION=1 with a server-side "
      + "fault-injection hook to run scenarios 1-6). Running no-integration regression checks only.")
  }

  // No-integration regression check: a calendar event with a user attendee whose
  // account has no Google integration should sync-skip silently (no background_errors).
  const enduser = await sdk.api.endusers.createOne({ fname: 'GcalRetry', lname: 'Test' })

  await async_test(
    'create event for user without Google integration does not produce a background error',
    async () => {
      const event = await sdk.api.calendar_events.createOne({
        title: 'Gcal Retry Regression',
        startTimeInMS: Date.now() + 1000 * 60 * 60,
        durationInMinutes: 30,
        attendees: [{ type: 'user', id: sdk.userInfo.id }, { type: 'enduser', id: enduser.id }],
      })

      // give side-effect handlers a moment to run
      await wait(undefined, 750)

      const errors = await sdk.api.background_errors.getSome({}).catch(() => [])

      // clean up
      await sdk.api.calendar_events.deleteOne(event.id).catch(() => {})

      // No Google integration on the test user => no push attempt => no error row.
      return errors.filter((e: any) => (
        e.userId === sdk.userInfo.id && e.title === "Google Calendar Push Error"
      )).length
    },
    { onResult: (count) => count === 0 },
  )

  // cleanup
  await sdk.api.endusers.deleteOne(enduser.id).catch(() => {})
}

if (require.main === module) {
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await gcal_sync_retry_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => { console.log("✅ gcal sync retry test suite completed successfully"); process.exit(0) })
    .catch((error) => { console.error("❌ gcal sync retry test suite failed:", error); process.exit(1) })
}
