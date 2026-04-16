require('source-map-support').install();

import { Session } from "../../sdk"
import {
  async_test,
  assert,
  handleAnyError,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

export const calendar_events_bulk_update_tests = async ({ sdk }: { sdk: Session }) => {
  log_header("Calendar Events Bulk Update Tests")

  // Track all created resources for cleanup
  const createdEventIds: string[] = []
  const createdEnduserIds: string[] = []

  const createEvent = async (overrides: Record<string, any> = {}) => {
    const event = await sdk.api.calendar_events.createOne({
      title: "Bulk Update Test Event",
      durationInMinutes: 30,
      startTimeInMS: Date.now() + Math.random() * 100000,
      ...overrides,
    })
    createdEventIds.push(event.id)
    return event
  }

  const createEnduser = async () => {
    const enduser = await sdk.api.endusers.createOne({})
    createdEnduserIds.push(enduser.id)
    return enduser
  }

  try {
    // ============================================================
    // SECTION 1: Validation / Error Cases
    // ============================================================
    log_header("Bulk Update - Validation")

    await async_test(
      "bulk_update errors when neither recurringEventId nor ids provided",
      () => sdk.api.calendar_events.bulk_update({ action: 'cancel' } as any),
      { shouldError: true, onError: (e: any) => e.message.includes("Either recurringEventId or ids is required") }
    )

    const validationEvent = await createEvent()

    await async_test(
      "bulk_update errors when both recurringEventId and ids provided",
      () => sdk.api.calendar_events.bulk_update({
        recurringEventId: validationEvent.id,
        ids: [validationEvent.id],
        action: 'cancel',
      }),
      { shouldError: true, onError: (e: any) => e.message.includes("Provide either recurringEventId or ids, not both") }
    )

    const validationEnduser = await createEnduser()

    await async_test(
      "bulk_update errors when attendee-level action used with ids",
      () => sdk.api.calendar_events.bulk_update({
        ids: [validationEvent.id],
        action: 'cancel_for_attendee',
        enduserId: validationEnduser.id,
      }),
      { shouldError: true, onError: (e: any) => e.message.includes("only supported with recurringEventId") }
    )

    await async_test(
      "bulk_update errors when attendee action missing enduserId",
      () => sdk.api.calendar_events.bulk_update({
        recurringEventId: validationEvent.id,
        action: 'cancel_for_attendee',
      }),
      { shouldError: true, onError: (e: any) => e.message.includes("enduserId is required") }
    )

    // ============================================================
    // SECTION 2: ID-based bulk operations (new feature)
    // ============================================================
    log_header("Bulk Update - ID-based Cancel")

    const [ev1, ev2, ev3] = await Promise.all([createEvent(), createEvent(), createEvent()])

    await async_test(
      "bulk cancel by IDs cancels selected events",
      () => sdk.api.calendar_events.bulk_update({
        ids: [ev1.id, ev2.id],
        action: 'cancel',
        cancelReason: 'Testing bulk cancel',
      }),
      {
        onResult: (r: any) => (
          r.updated.length === 2
          && r.updated.every((e: any) => !!e.cancelledAt)
          && r.updated.every((e: any) => e.cancelReason === 'Testing bulk cancel')
        )
      }
    )

    // Verify third event is unchanged
    const ev3After = await sdk.api.calendar_events.getOne(ev3.id)
    assert(!ev3After.cancelledAt, 'Third event should not be cancelled', 'Third event remains uncancelled')

    // --- Uncancel ---
    log_header("Bulk Update - ID-based Uncancel")

    await async_test(
      "bulk uncancel by IDs restores cancelled events",
      () => sdk.api.calendar_events.bulk_update({
        ids: [ev1.id, ev2.id],
        action: 'uncancel',
      }),
      {
        onResult: (r: any) => (
          r.updated.length === 2
          && r.updated.every((e: any) => !e.cancelledAt)
        )
      }
    )

    // --- Confirm ---
    log_header("Bulk Update - ID-based Confirm")

    await async_test(
      "bulk confirm by IDs sets confirmedAt",
      () => sdk.api.calendar_events.bulk_update({
        ids: [ev1.id, ev2.id],
        action: 'confirm',
      }),
      {
        onResult: (r: any) => (
          r.updated.length === 2
          && r.updated.every((e: any) => !!e.confirmedAt)
        )
      }
    )

    // --- Idempotency: confirm already-confirmed ---
    await async_test(
      "bulk confirm on already-confirmed events returns empty updated",
      () => sdk.api.calendar_events.bulk_update({
        ids: [ev1.id, ev2.id],
        action: 'confirm',
      }),
      { onResult: (r: any) => r.updated.length === 0 }
    )

    // --- No Show ---
    log_header("Bulk Update - ID-based No Show")

    await async_test(
      "bulk no_show by IDs sets noShowedAt",
      () => sdk.api.calendar_events.bulk_update({
        ids: [ev1.id, ev2.id],
        action: 'no_show',
      }),
      {
        onResult: (r: any) => (
          r.updated.length === 2
          && r.updated.every((e: any) => !!e.noShowedAt)
        )
      }
    )

    // --- Un-No-Show ---
    log_header("Bulk Update - ID-based Un-No-Show")

    await async_test(
      "bulk un_no_show by IDs clears noShowedAt",
      () => sdk.api.calendar_events.bulk_update({
        ids: [ev1.id, ev2.id],
        action: 'un_no_show',
      }),
      {
        onResult: (r: any) => (
          r.updated.length === 2
          && r.updated.every((e: any) => !e.noShowedAt)
        )
      }
    )

    // --- Delete by IDs ---
    log_header("Bulk Update - ID-based Delete")

    const [delEv1, delEv2] = await Promise.all([createEvent(), createEvent()])

    await async_test(
      "bulk delete by IDs removes events",
      () => sdk.api.calendar_events.bulk_update({
        ids: [delEv1.id, delEv2.id],
        action: 'delete',
      }),
      { onResult: (r: any) => r.deleted.length === 2 }
    )

    // Verify deleted events are gone
    await async_test(
      "deleted events are no longer accessible",
      () => sdk.api.calendar_events.getOne(delEv1.id),
      { shouldError: true, onError: (e: any) => e.message.includes("Could not find") }
    )

    // Remove from cleanup tracking since already deleted
    createdEventIds.splice(createdEventIds.indexOf(delEv1.id), 1)
    createdEventIds.splice(createdEventIds.indexOf(delEv2.id), 1)

    // ============================================================
    // SECTION 3: Recurring series operations
    // ============================================================
    log_header("Bulk Update - Recurring Series")

    const now = Date.now()
    const DAY = 24 * 60 * 60 * 1000
    const enduser = await createEnduser()

    // Create a "recurring series": root event + child events with copiedFrom
    const rootEvent = await createEvent({
      title: "Recurring Root",
      startTimeInMS: now - 2 * DAY, // 2 days ago
      attendees: [{ id: enduser.id, type: 'enduser' }],
    })
    const childEvent1 = await createEvent({
      title: "Recurring Child 1",
      startTimeInMS: now - 1 * DAY, // 1 day ago
      copiedFrom: rootEvent.id,
      attendees: [{ id: enduser.id, type: 'enduser' }],
    })
    const childEvent2 = await createEvent({
      title: "Recurring Child 2",
      startTimeInMS: now + 1 * DAY, // tomorrow
      copiedFrom: rootEvent.id,
      attendees: [{ id: enduser.id, type: 'enduser' }],
    })
    const childEvent3 = await createEvent({
      title: "Recurring Child 3",
      startTimeInMS: now + 2 * DAY, // 2 days from now
      copiedFrom: rootEvent.id,
      attendees: [{ id: enduser.id, type: 'enduser' }],
    })

    // --- Cancel with scope 'this_and_future' ---
    log_header("Bulk Update - Recurring Cancel this_and_future")

    await async_test(
      "recurring cancel this_and_future cancels anchor and future events",
      () => sdk.api.calendar_events.bulk_update({
        recurringEventId: childEvent2.id,
        action: 'cancel',
        scope: 'this_and_future',
      }),
      {
        onResult: (r: any) => (
          r.updated.length === 2
          && r.updated.every((e: any) => !!e.cancelledAt)
          && r.updated.some((e: any) => e.id === childEvent2.id)
          && r.updated.some((e: any) => e.id === childEvent3.id)
        )
      }
    )

    // Verify earlier events were NOT cancelled
    const rootAfter = await sdk.api.calendar_events.getOne(rootEvent.id)
    assert(!rootAfter.cancelledAt, 'Root should not be cancelled', 'Root event not cancelled by this_and_future')
    const child1After = await sdk.api.calendar_events.getOne(childEvent1.id)
    assert(!child1After.cancelledAt, 'Child 1 should not be cancelled', 'Child 1 not cancelled by this_and_future')

    // --- Uncancel with scope 'all' to reset ---
    await sdk.api.calendar_events.bulk_update({
      recurringEventId: rootEvent.id,
      action: 'uncancel',
      scope: 'all',
    })

    // --- Cancel with scope 'all' ---
    log_header("Bulk Update - Recurring Cancel All")

    await async_test(
      "recurring cancel all cancels entire series",
      () => sdk.api.calendar_events.bulk_update({
        recurringEventId: childEvent1.id,
        action: 'cancel',
        scope: 'all',
      }),
      {
        onResult: (r: any) => (
          r.updated.length === 4
          && r.updated.every((e: any) => !!e.cancelledAt)
        )
      }
    )

    // Reset: uncancel all
    await sdk.api.calendar_events.bulk_update({
      recurringEventId: rootEvent.id,
      action: 'uncancel',
      scope: 'all',
    })

    // --- Cancel for attendee ---
    log_header("Bulk Update - Recurring Cancel for Attendee")

    await async_test(
      "cancel_for_attendee adds enduser to cancelledGroupAttendees across series",
      () => sdk.api.calendar_events.bulk_update({
        recurringEventId: rootEvent.id,
        action: 'cancel_for_attendee',
        scope: 'all',
        enduserId: enduser.id,
      }),
      {
        onResult: (r: any) => (
          r.updated.length === 4
          && r.updated.every((e: any) =>
            e.cancelledGroupAttendees?.some((c: any) => c.id === enduser.id)
          )
        )
      }
    )

    // --- Uncancel for attendee ---
    log_header("Bulk Update - Recurring Uncancel for Attendee")

    await async_test(
      "uncancel_for_attendee removes enduser from cancelledGroupAttendees",
      () => sdk.api.calendar_events.bulk_update({
        recurringEventId: rootEvent.id,
        action: 'uncancel_for_attendee',
        scope: 'all',
        enduserId: enduser.id,
      }),
      {
        onResult: (r: any) => (
          r.updated.length === 4
          && r.updated.every((e: any) =>
            !e.cancelledGroupAttendees?.some((c: any) => c.id === enduser.id)
          )
        )
      }
    )

    // --- Remove attendee ---
    log_header("Bulk Update - Recurring Remove Attendee")

    await async_test(
      "remove_attendee removes enduser from attendees across series",
      () => sdk.api.calendar_events.bulk_update({
        recurringEventId: rootEvent.id,
        action: 'remove_attendee',
        scope: 'all',
        enduserId: enduser.id,
      }),
      {
        onResult: (r: any) => (
          r.updated.length === 4
          && r.updated.every((e: any) =>
            !e.attendees?.some((a: any) => a.id === enduser.id)
          )
        )
      }
    )

    // --- Recurring delete ---
    log_header("Bulk Update - Recurring Delete")

    await async_test(
      "recurring delete removes all events in series",
      () => sdk.api.calendar_events.bulk_update({
        recurringEventId: rootEvent.id,
        action: 'delete',
        scope: 'all',
      }),
      { onResult: (r: any) => r.deleted.length === 4 }
    )

    // Remove from cleanup tracking since already deleted
    for (const id of [rootEvent.id, childEvent1.id, childEvent2.id, childEvent3.id]) {
      const idx = createdEventIds.indexOf(id)
      if (idx !== -1) createdEventIds.splice(idx, 1)
    }

  } finally {
    // Cleanup remaining resources
    for (const id of createdEventIds) {
      try { await sdk.api.calendar_events.deleteOne(id) } catch (_) {}
    }
    for (const id of createdEnduserIds) {
      try { await sdk.api.endusers.deleteOne(id) } catch (_) {}
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
    await calendar_events_bulk_update_tests({ sdk })
  }

  runTests()
    .then(() => {
      console.log("✅ Calendar events bulk update test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Calendar events bulk update test suite failed:", error)
      process.exit(1)
    })
}
