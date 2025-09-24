import { Session } from "../../sdk"
import { log_header, wait, async_test } from "@tellescope/testing"
import { Enduser } from "@tellescope/types-client"
import { setup_tests } from "../setup"

const host = process.env.TEST_HOST || "http://localhost:8080"

export const appointment_rescheduled_trigger_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Automation Trigger Tests (Appointment Rescheduled)")

  // Create automation triggers for different scenarios
  const t1 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Appointment Rescheduled', info: { } },
    action: { type: 'Add Tags', info: { tags: ['Rescheduled - Any'] }},
    status: 'Active',
    title: "Rescheduled - Any"
  })

  const t2 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Appointment Rescheduled', info: { titles: ['Test Appointment'] } },
    action: { type: 'Add Tags', info: { tags: ['Rescheduled - By Title'] }},
    status: 'Active',
    title: "Rescheduled - By Title"
  })

  // Create trigger for manual reschedule detection (off by default)
  const t3 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Appointment Rescheduled', info: { detectManualReschedules: true } },
    action: { type: 'Add Tags', info: { tags: ['Manual Reschedule - Any'] }},
    status: 'Active',
    title: "Manual Reschedule - Any"
  })

  // Create trigger for manual reschedule detection with title filter
  const t4 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Appointment Rescheduled', info: { titles: ['Test Appointment'], detectManualReschedules: true } },
    action: { type: 'Add Tags', info: { tags: ['Manual Reschedule - By Title'] }},
    status: 'Active',
    title: "Manual Reschedule - By Title"
  })

  // Create separate endusers to avoid trigger throttling (1 minute per trigger per enduser)
  const enduser1 = await sdk.api.endusers.createOne({})
  const enduser2 = await sdk.api.endusers.createOne({})
  const enduser3 = await sdk.api.endusers.createOne({})
  const enduser4 = await sdk.api.endusers.createOne({})
  const enduser5 = await sdk.api.endusers.createOne({})
  const enduser6 = await sdk.api.endusers.createOne({})
  const enduser7 = await sdk.api.endusers.createOne({})
  const enduser8 = await sdk.api.endusers.createOne({})
  const enduser9 = await sdk.api.endusers.createOne({})
  const enduser10 = await sdk.api.endusers.createOne({})
  const enduser11 = await sdk.api.endusers.createOne({})
  const enduser12 = await sdk.api.endusers.createOne({})

  // ===== TRADITIONAL RESCHEDULE TESTS (with rescheduledAt) =====
  log_header("Traditional Reschedule Tests (rescheduledAt)")

  // Test 1: Update event to add rescheduledAt (should trigger)
  const event1 = await sdk.api.calendar_events.createOne({
    title: 'Test Appointment',
    durationInMinutes: 30,
    startTimeInMS: Date.now(),
    attendees: [{ type: 'enduser', id: enduser1.id }]
  })
  await wait(undefined, 500) // ensure no initial triggers
  await async_test(
    "No initial triggers for normal appointment",
    () => sdk.api.endusers.getOne(enduser1.id),
    { onResult: (e: Enduser) => !e.tags?.length }
  )

  // Now update to mark as rescheduled
  await sdk.api.calendar_events.updateOne(event1.id, { rescheduledAt: new Date() })
  await wait(undefined, 500) // allow update triggers to happen
  await async_test(
    "Update to rescheduled triggers automation",
    () => sdk.api.endusers.getOne(enduser1.id),
    { onResult: (e: Enduser) =>
        e.tags?.length === 4
     && e.tags.includes('Rescheduled - Any')
     && e.tags.includes('Rescheduled - By Title')
     && e.tags.includes('Manual Reschedule - Any')
     && e.tags.includes('Manual Reschedule - By Title')
    }
  )

  // Test 2: Update cancelled event to add rescheduledAt (should still trigger)
  const event2 = await sdk.api.calendar_events.createOne({
    title: 'Test Appointment',
    durationInMinutes: 30,
    startTimeInMS: Date.now(),
    attendees: [{ type: 'enduser', id: enduser2.id }],
    cancelledAt: new Date() // Start with cancelled appointment
  })
  await wait(undefined, 500)

  // Now update to mark as rescheduled (cancelled + rescheduled is valid)
  await sdk.api.calendar_events.updateOne(event2.id, { rescheduledAt: new Date() })
  await wait(undefined, 500) // allow update triggers to happen
  await async_test(
    "Cancelled + rescheduled appointment triggers automation",
    () => sdk.api.endusers.getOne(enduser2.id),
    { onResult: (e: Enduser) =>
        e.tags?.length === 4
     && e.tags.includes('Rescheduled - Any')
     && e.tags.includes('Rescheduled - By Title')
     && e.tags.includes('Manual Reschedule - Any')
     && e.tags.includes('Manual Reschedule - By Title')
    }
  )

  // Test 3: Update with different title (should only trigger 'Any' automation)
  const event3 = await sdk.api.calendar_events.createOne({
    title: 'Different Title',
    durationInMinutes: 30,
    startTimeInMS: Date.now(),
    attendees: [{ type: 'enduser', id: enduser3.id }]
  })
  await wait(undefined, 500)

  // Update to mark as rescheduled
  await sdk.api.calendar_events.updateOne(event3.id, { rescheduledAt: new Date() })
  await wait(undefined, 500)
  await async_test(
    "Traditional reschedule with different title only triggers 'Any' automation",
    () => sdk.api.endusers.getOne(enduser3.id),
    { onResult: (e: Enduser) =>
        e.tags?.length === 2
     && e.tags.includes('Rescheduled - Any')
     && e.tags.includes('Manual Reschedule - Any')
     && !e.tags.includes('Rescheduled - By Title') // title doesn't match
     && !e.tags.includes('Manual Reschedule - By Title') // title doesn't match
    }
  )

  // ===== MANUAL RESCHEDULE TESTS (startTimeInMS changes) =====
  log_header("Manual Reschedule Tests (startTimeInMS changes)")

  const originalTime = Date.now() + 86400000 // 1 day from now
  const newTime = originalTime + 3600000 // 1 hour later

  // Test 4: Appointment with startTimeInMS change (should trigger manual reschedule)
  const event4 = await sdk.api.calendar_events.createOne({
    title: 'Test Appointment',
    durationInMinutes: 30,
    startTimeInMS: originalTime,
    attendees: [{ type: 'enduser', id: enduser4.id }]
  })
  await wait(undefined, 500) // ensure no initial triggers
  await async_test(
    "No initial triggers for normal appointment",
    () => sdk.api.endusers.getOne(enduser4.id),
    { onResult: (e: Enduser) => !e.tags?.length }
  )

  // Now update startTimeInMS to trigger manual reschedule detection
  await sdk.api.calendar_events.updateOne(event4.id, { startTimeInMS: newTime })
  await wait(undefined, 500) // allow update triggers to happen
  await async_test(
    "Manual reschedule (startTimeInMS change) triggers automation",
    () => sdk.api.endusers.getOne(enduser4.id),
    { onResult: (e: Enduser) =>
        e.tags?.length === 2
     && e.tags.includes('Manual Reschedule - Any')
     && e.tags.includes('Manual Reschedule - By Title')
    }
  )

  // Test 5: Regular trigger should NOT fire for manual reschedule (no detectManualReschedules)
  const event5 = await sdk.api.calendar_events.createOne({
    title: 'Different Title', // Won't match title filter, so only "Any" triggers should fire
    durationInMinutes: 30,
    startTimeInMS: originalTime,
    attendees: [{ type: 'enduser', id: enduser5.id }]
  })
  await wait(undefined, 500)

  // Update startTimeInMS - should only trigger manual reschedule triggers
  await sdk.api.calendar_events.updateOne(event5.id, { startTimeInMS: newTime })
  await wait(undefined, 500)
  await async_test(
    "Manual reschedule with different title only triggers 'Any' automation",
    () => sdk.api.endusers.getOne(enduser5.id),
    { onResult: (e: Enduser) =>
        e.tags?.length === 1
     && e.tags.includes('Manual Reschedule - Any')
     && !e.tags.includes('Manual Reschedule - By Title') // title doesn't match
     && !e.tags.includes('Rescheduled - Any') // no detectManualReschedules
     && !e.tags.includes('Rescheduled - By Title') // no detectManualReschedules
    }
  )

  // Test 6: Manual reschedule with rescheduledAt already set (should NOT trigger manual reschedule)
  const event6 = await sdk.api.calendar_events.createOne({
    title: 'Test Appointment',
    durationInMinutes: 30,
    startTimeInMS: originalTime,
    attendees: [{ type: 'enduser', id: enduser6.id }]
  })
  await wait(undefined, 500)

  // First, mark as rescheduled (traditional reschedule)
  await sdk.api.calendar_events.updateOne(event6.id, { rescheduledAt: new Date() })
  await wait(undefined, 500)
  await async_test(
    "Traditional reschedule triggers all automation",
    () => sdk.api.endusers.getOne(enduser6.id),
    { onResult: (e: Enduser) =>
        e.tags?.length === 4
     && e.tags.includes('Rescheduled - Any')
     && e.tags.includes('Rescheduled - By Title')
     && e.tags.includes('Manual Reschedule - Any')
     && e.tags.includes('Manual Reschedule - By Title')
    }
  )

  // Clear tags for next test
  await sdk.api.endusers.updateOne(enduser6.id, { tags: [] }, { replaceObjectFields: true })
  await wait(undefined, 100)

  // Now update startTimeInMS - should NOT trigger manual reschedule (already has rescheduledAt)
  await sdk.api.calendar_events.updateOne(event6.id, { startTimeInMS: newTime })
  await wait(undefined, 500)
  await async_test(
    "Manual reschedule with existing rescheduledAt does NOT trigger manual automation",
    () => sdk.api.endusers.getOne(enduser6.id),
    { onResult: (e: Enduser) => !e.tags?.length } // No tags should be added
  )

  // Test 7: Manual reschedule with cancelled event (should NOT trigger)
  const event7 = await sdk.api.calendar_events.createOne({
    title: 'Test Appointment',
    durationInMinutes: 30,
    startTimeInMS: originalTime,
    attendees: [{ type: 'enduser', id: enduser7.id }],
    cancelledAt: new Date() // Cancelled appointment
  })
  await wait(undefined, 500)

  // Update startTimeInMS - should NOT trigger (cancelled)
  await sdk.api.calendar_events.updateOne(event7.id, { startTimeInMS: newTime })
  await wait(undefined, 500)
  await async_test(
    "Manual reschedule of cancelled appointment does NOT trigger automation",
    () => sdk.api.endusers.getOne(enduser7.id),
    { onResult: (e: Enduser) => !e.tags?.length }
  )

  // Test 8: Manual reschedule with no-show event (should NOT trigger)
  const event8 = await sdk.api.calendar_events.createOne({
    title: 'Test Appointment',
    durationInMinutes: 30,
    startTimeInMS: originalTime,
    attendees: [{ type: 'enduser', id: enduser8.id }],
    noShowedAt: new Date() // No-show appointment
  })
  await wait(undefined, 500)

  // Update startTimeInMS - should NOT trigger (no-show)
  await sdk.api.calendar_events.updateOne(event8.id, { startTimeInMS: newTime })
  await wait(undefined, 500)
  await async_test(
    "Manual reschedule of no-show appointment does NOT trigger automation",
    () => sdk.api.endusers.getOne(enduser8.id),
    { onResult: (e: Enduser) => !e.tags?.length }
  )

  // Test 9: Same startTimeInMS update (should NOT trigger)
  const event9 = await sdk.api.calendar_events.createOne({
    title: 'Test Appointment',
    durationInMinutes: 30,
    startTimeInMS: originalTime,
    attendees: [{ type: 'enduser', id: enduser9.id }]
  })
  await wait(undefined, 500)

  // Update with same startTimeInMS - should NOT trigger
  await sdk.api.calendar_events.updateOne(event9.id, { startTimeInMS: originalTime })
  await wait(undefined, 500)
  await async_test(
    "Same startTimeInMS update does NOT trigger automation",
    () => sdk.api.endusers.getOne(enduser9.id),
    { onResult: (e: Enduser) => !e.tags?.length }
  )

  // Test 10: Duration change without time change (should NOT trigger manual reschedule)
  const event10 = await sdk.api.calendar_events.createOne({
    title: 'Test Appointment',
    durationInMinutes: 30,
    startTimeInMS: originalTime,
    attendees: [{ type: 'enduser', id: enduser10.id }]
  })
  await wait(undefined, 500)

  // Update only duration - should NOT trigger manual reschedule
  await sdk.api.calendar_events.updateOne(event10.id, { durationInMinutes: 60 })
  await wait(undefined, 500)
  await async_test(
    "Duration change without time change does NOT trigger manual reschedule",
    () => sdk.api.endusers.getOne(enduser10.id),
    { onResult: (e: Enduser) => !e.tags?.length }
  )

  // Test 11: Multiple time changes (should trigger multiple times due to different endusers)
  const event11a = await sdk.api.calendar_events.createOne({
    title: 'Test Appointment',
    durationInMinutes: 30,
    startTimeInMS: originalTime,
    attendees: [{ type: 'enduser', id: enduser11.id }]
  })

  const event11b = await sdk.api.calendar_events.createOne({
    title: 'Test Appointment',
    durationInMinutes: 30,
    startTimeInMS: originalTime,
    attendees: [{ type: 'enduser', id: enduser12.id }]
  })
  await wait(undefined, 500)

  // Update both - should trigger for both endusers
  await Promise.all([
    sdk.api.calendar_events.updateOne(event11a.id, { startTimeInMS: newTime }),
    sdk.api.calendar_events.updateOne(event11b.id, { startTimeInMS: newTime + 1800000 }) // 30 minutes later
  ])
  await wait(undefined, 500)
  await async_test(
    "Multiple manual reschedules trigger automation for each enduser",
    () => Promise.all([
      sdk.api.endusers.getOne(enduser11.id),
      sdk.api.endusers.getOne(enduser12.id)
    ]),
    { onResult: ([e11, e12]: Enduser[]) =>
        e11.tags?.length === 2
     && e11.tags.includes('Manual Reschedule - Any')
     && e11.tags.includes('Manual Reschedule - By Title')
     && e12.tags?.length === 2
     && e12.tags.includes('Manual Reschedule - Any')
     && e12.tags.includes('Manual Reschedule - By Title')
    }
  )

  // Cleanup
  await Promise.all([
    sdk.api.automation_triggers.deleteOne(t1.id),
    sdk.api.automation_triggers.deleteOne(t2.id),
    sdk.api.automation_triggers.deleteOne(t3.id),
    sdk.api.automation_triggers.deleteOne(t4.id),
    sdk.api.endusers.deleteOne(enduser1.id),
    sdk.api.endusers.deleteOne(enduser2.id),
    sdk.api.endusers.deleteOne(enduser3.id),
    sdk.api.endusers.deleteOne(enduser4.id),
    sdk.api.endusers.deleteOne(enduser5.id),
    sdk.api.endusers.deleteOne(enduser6.id),
    sdk.api.endusers.deleteOne(enduser7.id),
    sdk.api.endusers.deleteOne(enduser8.id),
    sdk.api.endusers.deleteOne(enduser9.id),
    sdk.api.endusers.deleteOne(enduser10.id),
    sdk.api.endusers.deleteOne(enduser11.id),
    sdk.api.endusers.deleteOne(enduser12.id),
    sdk.api.calendar_events.deleteOne(event1.id),
    sdk.api.calendar_events.deleteOne(event2.id),
    sdk.api.calendar_events.deleteOne(event3.id),
    sdk.api.calendar_events.deleteOne(event4.id),
    sdk.api.calendar_events.deleteOne(event5.id),
    sdk.api.calendar_events.deleteOne(event6.id),
    sdk.api.calendar_events.deleteOne(event7.id),
    sdk.api.calendar_events.deleteOne(event8.id),
    sdk.api.calendar_events.deleteOne(event9.id),
    sdk.api.calendar_events.deleteOne(event10.id),
    sdk.api.calendar_events.deleteOne(event11a.id),
    sdk.api.calendar_events.deleteOne(event11b.id),
  ])
}

// Allow running this test file independently
if (require.main === module) {
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await appointment_rescheduled_trigger_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Appointment Rescheduled trigger tests completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Appointment Rescheduled trigger tests failed:", error)
      process.exit(1)
    })
}