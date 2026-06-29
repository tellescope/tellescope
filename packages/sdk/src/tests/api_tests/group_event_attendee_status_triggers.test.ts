import { Session } from "../../sdk"
import { log_header, wait, async_test } from "@tellescope/testing"
import { Enduser } from "@tellescope/types-client"
import { AttendeeStatus } from "@tellescope/types-models"
import { setup_tests } from "../setup"

const host = process.env.API_URL || "http://localhost:8080"

// Tags applied by the four per-status triggers. Distinct so we can prove exactly which trigger
// fired against which attendee (no false positives / no false negatives).
const TAG = {
  'Completed': 'Group Attendee: Completed',
  'No-showed': 'Group Attendee: No-showed',
  'Rescheduled': 'Group Attendee: Rescheduled',
  'Cancelled': 'Group Attendee: Cancelled',
} as const

type TrackableStatus = keyof typeof TAG
const ALL_STATUSES: TrackableStatus[] = ['Completed', 'No-showed', 'Rescheduled', 'Cancelled']

export const group_event_attendee_status_triggers_tests = async ({ sdk } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Automation Trigger Tests (Group Event Per-Attendee Status)")

  const createdTriggerIds: string[] = []
  const createdEnduserIds: string[] = []
  const createdEventIds: string[] = []

  const createEnduser = async () => {
    const e = await sdk.api.endusers.createOne({})
    createdEnduserIds.push(e.id)
    return e
  }
  const createGroupEvent = async (attendeeIds: string[]) => {
    const event = await sdk.api.calendar_events.createOne({
      title: 'Group Status Test',
      durationInMinutes: 30,
      startTimeInMS: Date.now() + Math.floor(Math.random() * 100000),
      attendees: attendeeIds.map(id => ({ type: 'enduser' as const, id })),
    })
    createdEventIds.push(event.id)
    return event
  }

  // Replicates the webapp AttendeeStatusEditor save: writes attendeeStatuses, and mirrors statuses
  // into cancelledGroupAttendees for Cancelled/No-showed/Rescheduled (to suppress reminders).
  const setAttendeeStatuses = async (eventId: string, statuses: { id: string, status: AttendeeStatus['status'] }[]) => (
    sdk.api.calendar_events.updateOne(eventId, {
      attendeeStatuses: statuses.map(s => ({ id: s.id, at: new Date(), status: s.status })),
      cancelledGroupAttendees: (
        statuses
        .filter(s => s.status === 'Cancelled' || s.status === 'No-showed' || s.status === 'Rescheduled')
        .map(s => ({ id: s.id, at: new Date() }))
      ),
    }, { replaceObjectFields: true })
  )

  const tagsOf = async (enduserId: string) => (await sdk.api.endusers.getOne(enduserId)).tags || []

  try {
    // One "Add Tags" trigger per status, matching any appointment (info: {})
    for (const status of ALL_STATUSES) {
      const t = await sdk.api.automation_triggers.createOne({
        event: {
          type: status === 'No-showed' ? 'Appointment No-Showed'
              : status === 'Completed' ? 'Appointment Completed'
              : status === 'Rescheduled' ? 'Appointment Rescheduled'
              : 'Appointment Cancelled',
          info: {},
        },
        action: { type: 'Add Tags', info: { tags: [TAG[status]] } },
        status: 'Active',
        title: `Group Attendee ${status}`,
      })
      createdTriggerIds.push(t.id)
    }

    // ============================================================
    // For each status: target gets exactly its tag; bystanders get nothing.
    // ============================================================
    for (const status of ALL_STATUSES) {
      log_header(`Per-attendee '${status}' in a group event`)

      const target = await createEnduser()
      const bystander1 = await createEnduser()
      const bystander2 = await createEnduser()
      const event = await createGroupEvent([target.id, bystander1.id, bystander2.id])

      await setAttendeeStatuses(event.id, [{ id: target.id, status }])
      await wait(undefined, 750) // allow trigger to fire

      // 1 + 2. True positive / no false negative: target has the correct tag
      await async_test(
        `'${status}' fires its trigger for the target attendee`,
        () => tagsOf(target.id),
        { onResult: (tags: string[]) => tags.includes(TAG[status]) }
      )

      // 3. No false positive (wrong trigger): target has none of the other status tags
      await async_test(
        `'${status}' does NOT fire any other status trigger for the target`,
        () => tagsOf(target.id),
        { onResult: (tags: string[]) => ALL_STATUSES.every(s => s === status || !tags.includes(TAG[s])) }
      )

      // 4. No false positive (collateral): bystanders received zero tags
      await async_test(
        `'${status}' does NOT fire for bystander attendee #1`,
        () => sdk.api.endusers.getOne(bystander1.id),
        { onResult: (e: Enduser) => !e.tags?.length }
      )
      await async_test(
        `'${status}' does NOT fire for bystander attendee #2`,
        () => sdk.api.endusers.getOne(bystander2.id),
        { onResult: (e: Enduser) => !e.tags?.length }
      )
    }

    // ============================================================
    // Multiple distinct statuses set in one group event — no cross-talk.
    // ============================================================
    log_header("Multiple distinct per-attendee statuses in one group event")

    const aCompleted = await createEnduser()
    const bNoShow = await createEnduser()
    const cCancelled = await createEnduser()
    const dUnset = await createEnduser()
    const mixedEvent = await createGroupEvent([aCompleted.id, bNoShow.id, cCancelled.id, dUnset.id])

    await setAttendeeStatuses(mixedEvent.id, [
      { id: aCompleted.id, status: 'Completed' },
      { id: bNoShow.id, status: 'No-showed' },
      { id: cCancelled.id, status: 'Cancelled' },
      // dUnset intentionally left without a status
    ])
    await wait(undefined, 1000) // allow all triggers to fire

    await async_test(
      "mixed: Completed attendee gets only the Completed tag",
      () => tagsOf(aCompleted.id),
      { onResult: (tags: string[]) => tags.includes(TAG['Completed']) && ALL_STATUSES.every(s => s === 'Completed' || !tags.includes(TAG[s])) }
    )
    await async_test(
      "mixed: No-showed attendee gets only the No-showed tag",
      () => tagsOf(bNoShow.id),
      { onResult: (tags: string[]) => tags.includes(TAG['No-showed']) && ALL_STATUSES.every(s => s === 'No-showed' || !tags.includes(TAG[s])) }
    )
    await async_test(
      "mixed: Cancelled attendee gets only the Cancelled tag",
      () => tagsOf(cCancelled.id),
      { onResult: (tags: string[]) => tags.includes(TAG['Cancelled']) && ALL_STATUSES.every(s => s === 'Cancelled' || !tags.includes(TAG[s])) }
    )
    await async_test(
      "mixed: unset attendee receives no tags",
      () => sdk.api.endusers.getOne(dUnset.id),
      { onResult: (e: Enduser) => !e.tags?.length }
    )

    // ============================================================
    // Status transitions (A -> B): changing an attendee's status fires the NEW status's trigger.
    // Exercises both directions of the cancelledGroupAttendees mirroring:
    //   - mirrored -> unmirrored (No-showed -> Completed)
    //   - unmirrored -> mirrored (Completed -> No-showed)
    // The prior status's tag remains (it fired at its own transition); no spurious Cancelled fires
    // from the cancelledGroupAttendees add/remove, and bystanders never fire.
    // ============================================================
    log_header("Per-attendee status transitions fire the new status only")

    // mirrored -> unmirrored
    const transA = await createEnduser()
    const transABystander = await createEnduser()
    const transAEvent = await createGroupEvent([transA.id, transABystander.id])

    await setAttendeeStatuses(transAEvent.id, [{ id: transA.id, status: 'No-showed' }])
    await wait(undefined, 750)
    await async_test(
      "transition step 1: No-showed fires No-showed",
      () => tagsOf(transA.id),
      { onResult: (tags: string[]) => tags.includes(TAG['No-showed']) }
    )
    await setAttendeeStatuses(transAEvent.id, [{ id: transA.id, status: 'Completed' }])
    await wait(undefined, 750)
    await async_test(
      "transition No-showed -> Completed fires Completed (No-showed tag retained, no Cancelled)",
      () => tagsOf(transA.id),
      { onResult: (tags: string[]) =>
          tags.includes(TAG['Completed'])
       && tags.includes(TAG['No-showed'])
       && !tags.includes(TAG['Cancelled'])
       && !tags.includes(TAG['Rescheduled'])
      }
    )
    await async_test(
      "transition (mirrored->unmirrored): bystander never fires",
      () => sdk.api.endusers.getOne(transABystander.id),
      { onResult: (e: Enduser) => !e.tags?.length }
    )

    // unmirrored -> mirrored
    const transB = await createEnduser()
    const transBBystander = await createEnduser()
    const transBEvent = await createGroupEvent([transB.id, transBBystander.id])

    await setAttendeeStatuses(transBEvent.id, [{ id: transB.id, status: 'Completed' }])
    await wait(undefined, 750)
    await setAttendeeStatuses(transBEvent.id, [{ id: transB.id, status: 'No-showed' }])
    await wait(undefined, 750)
    await async_test(
      "transition Completed -> No-showed fires No-showed (Completed tag retained, no Cancelled)",
      () => tagsOf(transB.id),
      { onResult: (tags: string[]) =>
          tags.includes(TAG['No-showed'])
       && tags.includes(TAG['Completed'])
       && !tags.includes(TAG['Cancelled'])
       && !tags.includes(TAG['Rescheduled'])
      }
    )
    await async_test(
      "transition (unmirrored->mirrored): bystander never fires",
      () => sdk.api.endusers.getOne(transBBystander.id),
      { onResult: (e: Enduser) => !e.tags?.length }
    )

    // ============================================================
    // 'by' filter on the per-attendee Cancelled path. The AttendeeStatusEditor update does not set
    // statusChangeSource, so handle_cancelled_event's by-filter (which requires statusChangeSource
    // to match 'user'/'enduser') excludes by-filtered triggers. Only the unfiltered (by: undefined)
    // Cancelled trigger fires for a per-attendee cancellation. This pins current behavior; see the
    // note returned with this change about whether by:'user' SHOULD fire here.
    // ============================================================
    log_header("Per-attendee Cancelled respects 'by' filter")

    const byUserTrigger = await sdk.api.automation_triggers.createOne({
      event: { type: 'Appointment Cancelled', info: { by: 'user' } },
      action: { type: 'Add Tags', info: { tags: ['Group Attendee Cancelled by:user'] } },
      status: 'Active',
      title: "Group Attendee Cancelled by user",
    })
    createdTriggerIds.push(byUserTrigger.id)
    const byEnduserTrigger = await sdk.api.automation_triggers.createOne({
      event: { type: 'Appointment Cancelled', info: { by: 'enduser' } },
      action: { type: 'Add Tags', info: { tags: ['Group Attendee Cancelled by:enduser'] } },
      status: 'Active',
      title: "Group Attendee Cancelled by enduser",
    })
    createdTriggerIds.push(byEnduserTrigger.id)

    const byTarget = await createEnduser()
    const byBystander = await createEnduser()
    const byEvent = await createGroupEvent([byTarget.id, byBystander.id])

    await setAttendeeStatuses(byEvent.id, [{ id: byTarget.id, status: 'Cancelled' }])
    await wait(undefined, 750)

    await async_test(
      "per-attendee cancel fires the unfiltered (by: undefined) Cancelled trigger",
      () => tagsOf(byTarget.id),
      { onResult: (tags: string[]) => tags.includes(TAG['Cancelled']) }
    )
    await async_test(
      "per-attendee cancel does NOT fire by:'enduser' Cancelled trigger",
      () => tagsOf(byTarget.id),
      { onResult: (tags: string[]) => !tags.includes('Group Attendee Cancelled by:enduser') }
    )
    await async_test(
      "per-attendee cancel does NOT fire by:'user' Cancelled trigger (statusChangeSource unset)",
      () => tagsOf(byTarget.id),
      { onResult: (tags: string[]) => !tags.includes('Group Attendee Cancelled by:user') }
    )
    await async_test(
      "'by' filter case: bystander never fires",
      () => sdk.api.endusers.getOne(byBystander.id),
      { onResult: (e: Enduser) => !e.tags?.length }
    )

    // ============================================================
    // bulk_update cancel_for_attendee fires Cancelled exactly once (via the new handler;
    // the legacy cancelledGroupAttendees branch is suppressed by the attendeeStatuses filter).
    // ============================================================
    log_header("bulk_update cancel_for_attendee fires Cancelled for attendee")

    const bulkTarget = await createEnduser()
    const bulkBystander = await createEnduser()
    const now = Date.now()
    const DAY = 24 * 60 * 60 * 1000
    const rootEvent = await sdk.api.calendar_events.createOne({
      title: 'Group Status Test',
      durationInMinutes: 30,
      startTimeInMS: now,
      attendees: [{ type: 'enduser', id: bulkTarget.id }, { type: 'enduser', id: bulkBystander.id }],
    })
    createdEventIds.push(rootEvent.id)
    const childEvent = await sdk.api.calendar_events.createOne({
      title: 'Group Status Test',
      durationInMinutes: 30,
      startTimeInMS: now + DAY,
      copiedFrom: rootEvent.id,
      attendees: [{ type: 'enduser', id: bulkTarget.id }, { type: 'enduser', id: bulkBystander.id }],
    })
    createdEventIds.push(childEvent.id)

    await sdk.api.calendar_events.bulk_update({
      recurringEventId: rootEvent.id,
      action: 'cancel_for_attendee',
      scope: 'all',
      enduserId: bulkTarget.id,
    })
    await wait(undefined, 750)

    await async_test(
      "cancel_for_attendee fires Cancelled trigger for the target",
      () => tagsOf(bulkTarget.id),
      { onResult: (tags: string[]) => tags.includes(TAG['Cancelled']) }
    )
    await async_test(
      "cancel_for_attendee does NOT fire for the bystander",
      () => sdk.api.endusers.getOne(bulkBystander.id),
      { onResult: (e: Enduser) => !e.tags?.length }
    )

    // ============================================================
    // 'Confirmed' and clearing a status fire nothing.
    // ============================================================
    log_header("Confirmed / cleared statuses fire no triggers")

    const confirmEnduser = await createEnduser()
    const clearEnduser = await createEnduser()
    const noopEvent = await createGroupEvent([confirmEnduser.id, clearEnduser.id])

    // set clearEnduser to No-showed, then clear it; set confirmEnduser to Confirmed
    await setAttendeeStatuses(noopEvent.id, [{ id: clearEnduser.id, status: 'No-showed' }])
    await wait(undefined, 750)
    await setAttendeeStatuses(noopEvent.id, [{ id: confirmEnduser.id, status: 'Confirmed' }]) // also clears clearEnduser
    await wait(undefined, 750)

    await async_test(
      "'Confirmed' status fires no trigger",
      () => sdk.api.endusers.getOne(confirmEnduser.id),
      { onResult: (e: Enduser) => !e.tags?.length }
    )
    // clearEnduser previously got the No-showed tag (that firing is expected); clearing must not
    // add anything new. Assert it still has exactly the one No-showed tag and nothing else.
    await async_test(
      "clearing a status fires no additional trigger",
      () => tagsOf(clearEnduser.id),
      { onResult: (tags: string[]) => tags.length === 1 && tags.includes(TAG['No-showed']) }
    )

  } finally {
    for (const id of createdEventIds) {
      try { await sdk.api.calendar_events.deleteOne(id) } catch (_) {}
    }
    for (const id of createdEnduserIds) {
      try { await sdk.api.endusers.deleteOne(id) } catch (_) {}
    }
    for (const id of createdTriggerIds) {
      try { await sdk.api.automation_triggers.deleteOne(id) } catch (_) {}
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
    await group_event_attendee_status_triggers_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Group event per-attendee status trigger tests completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Group event per-attendee status trigger tests failed:", error)
      process.exit(1)
    })
}
