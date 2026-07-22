require('source-map-support').install();

import { Session, EnduserSession } from "../../sdk"
import {
  async_test,
  log_header,
} from "@tellescope/testing"
import { setup_tests, authenticate_enduser_via_token } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const
const businessId = '60398b1131a295e64f084ff6'

/**
 * CU-86e2dvrn9: calendar_events.references switched from updatesDisabled to
 * enduserUpdatesDisabled (schema.ts), mirroring the Enduser references behavior:
 *   - staff / API-key sessions may update references (e.g. to set or clear
 *     external appointment IDs like stale Elation references)
 *   - enduser (patient) sessions remain blocked — required because endusers DO
 *     have update access on calendar_events they attend (for cancelling)
 */
export const calendar_event_references_update_tests = async ({ sdk } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Calendar Event References Update (enduserUpdatesDisabled)")

  let enduserId: string | undefined
  let eventId: string | undefined

  try {
    // Setup: enduser attending a calendar event, so the enduser session has update access to it
    const enduser = await sdk.api.endusers.createOne({
      email: `references-update-${Date.now()}@example.com`,
      fname: 'References',
      lname: 'UpdateTest',
    })
    enduserId = enduser.id

    const event = await sdk.api.calendar_events.createOne({
      title: "References Update Test Event",
      durationInMinutes: 30,
      startTimeInMS: Date.now(),
      attendees: [{ id: enduser.id, type: 'enduser' }],
    })
    eventId = event.id

    const enduserSDK = new EnduserSession({ host, businessId })
    await authenticate_enduser_via_token(sdk, enduserSDK, { id: enduser.id })

    // ---- Staff/API session can update references ----
    const staffReferences = [{ type: 'Elation', id: 'elation-appointment-123' }]
    await async_test(
      'staff can update calendar_events.references',
      () => sdk.api.calendar_events.updateOne(event.id, { references: staffReferences }),
      { onResult: e => e.references?.length === 1 && e.references[0].type === 'Elation' && e.references[0].id === 'elation-appointment-123' },
    )
    await async_test(
      'staff references update persisted',
      () => sdk.api.calendar_events.getOne(event.id),
      { onResult: e => e.references?.length === 1 && e.references[0].type === 'Elation' && e.references[0].id === 'elation-appointment-123' },
    )

    // ---- Enduser session (attendee with update access) is still blocked on references ----
    await async_test(
      'enduser cannot update calendar_events.references',
      () => enduserSDK.api.calendar_events.updateOne(event.id, { references: [{ type: 'Attacker', id: 'attacker-reference' }] } as any),
      { shouldError: true, onError: e => e.message === "references cannot be updated by endusers" },
    )
    await async_test(
      'rejected enduser references update did not persist',
      () => sdk.api.calendar_events.getOne(event.id),
      { onResult: e => e.references?.length === 1 && e.references[0].type === 'Elation' && e.references[0].id === 'elation-appointment-123' },
    )

    // ---- Positive control: the guard is field-scoped — enduser can still cancel the event ----
    await async_test(
      'enduser can still perform allowed update (cancelledAt)',
      () => enduserSDK.api.calendar_events.updateOne(event.id, { cancelledAt: new Date() }),
      { onResult: e => !!e.cancelledAt },
    )
  } finally {
    if (eventId) {
      try { await sdk.api.calendar_events.deleteOne(eventId) } catch {}
    }
    if (enduserId) {
      try { await sdk.api.endusers.deleteOne(enduserId) } catch {}
    }
  }
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await calendar_event_references_update_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Calendar event references update test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Calendar event references update test suite failed:", error)
      process.exit(1)
    })
}
