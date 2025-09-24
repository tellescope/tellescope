import { Session } from "../../sdk"
import { log_header, wait, async_test } from "@tellescope/testing"
import { Enduser } from "@tellescope/types-client"
import { setup_tests } from "../setup"

const host = process.env.API_URL || "http://localhost:8080"

export const appointment_completed_trigger_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Automation Trigger Tests (Appointment Completed)")

  // Create automation triggers for different scenarios
  const t1 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Appointment Completed', info: { } },
    action: { type: 'Add Tags', info: { tags: ['Completed - Any'] }},
    status: 'Active',
    title: "Completed - Any"
  })
  
  const t2 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Appointment Completed', info: { titles: ['Test Appointment']  } },
    action: { type: 'Add Tags', info: { tags: ['Completed - By Title'] }},
    status: 'Active',
    title: "Completed - By Title"
  })

  const template = await sdk.api.calendar_event_templates.createOne({
    title: 'Test Template',
    durationInMinutes: 30,
  })

  const t3 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Appointment Completed', info: { templateIds: [template.id] } },
    action: { type: 'Add Tags', info: { tags: ['Completed - By Template'] }},
    status: 'Active',
    title: "Completed - By Template"
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
  
  // Update test endusers for consistency
  const updateEnduser1 = await sdk.api.endusers.createOne({})
  const updateEnduser2 = await sdk.api.endusers.createOne({})
  const updateEnduser3 = await sdk.api.endusers.createOne({})
  const updateEnduser4 = await sdk.api.endusers.createOne({})
  const updateEnduser5 = await sdk.api.endusers.createOne({})

  // Test 1: Appointment created as completed (should trigger)
  const event1 = await sdk.api.calendar_events.createOne({
    title: 'Test Appointment',
    durationInMinutes: 30,
    startTimeInMS: Date.now(),
    attendees: [{ type: 'enduser', id: enduser1.id }],
    completedAt: new Date(), // Created as completed
    completedBy: sdk.userInfo.id // Track who completed it
  })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "Appointment created as completed triggers automation",
    () => sdk.api.endusers.getOne(enduser1.id),
    { onResult: (e: Enduser) => 
        e.tags?.length === 2
     && e.tags.includes('Completed - Any')
     && e.tags.includes('Completed - By Title')
    }
  )

  // Test 2: Appointment created as cancelled and completed (should NOT trigger)
  const event2 = await sdk.api.calendar_events.createOne({
    title: 'Test Appointment',
    durationInMinutes: 30,
    startTimeInMS: Date.now(),
    attendees: [{ type: 'enduser', id: enduser2.id }],
    completedAt: new Date(),
    completedBy: sdk.userInfo.id, // Track who completed it
    cancelledAt: new Date() // Both completed and cancelled
  })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "Cancelled appointment with completedAt does NOT trigger automation",
    () => sdk.api.endusers.getOne(enduser2.id),
    { onResult: (e: Enduser) => !e.tags?.length } // No tags should be added
  )

  // Test 3: Appointment created as rescheduled and completed (should NOT trigger)
  const event3 = await sdk.api.calendar_events.createOne({
    title: 'Test Appointment',
    durationInMinutes: 30,
    startTimeInMS: Date.now(),
    attendees: [{ type: 'enduser', id: enduser3.id }],
    completedAt: new Date(),
    completedBy: sdk.userInfo.id, // Track who completed it
    rescheduledAt: new Date() // Both completed and rescheduled
  })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "Rescheduled appointment with completedAt does NOT trigger automation",
    () => sdk.api.endusers.getOne(enduser3.id),
    { onResult: (e: Enduser) => !e.tags?.length } // No tags should be added
  )

  // Test 4: Appointment created as no-show and completed (should NOT trigger)
  const event4 = await sdk.api.calendar_events.createOne({
    title: 'Test Appointment',
    durationInMinutes: 30,
    startTimeInMS: Date.now(),
    attendees: [{ type: 'enduser', id: enduser4.id }],
    completedAt: new Date(),
    completedBy: sdk.userInfo.id, // Track who completed it
    noShowedAt: new Date() // Both completed and no-show
  })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "No-show appointment with completedAt does NOT trigger automation",
    () => sdk.api.endusers.getOne(enduser4.id),
    { onResult: (e: Enduser) => !e.tags?.length } // No tags should be added
  )

  // Test 5: Template-based trigger
  const event5 = await sdk.api.calendar_events.createOne({
    title: 'Template Test',
    durationInMinutes: 30,
    startTimeInMS: Date.now(),
    attendees: [{ type: 'enduser', id: enduser5.id }],
    templateId: template.id,
    completedAt: new Date(),
    completedBy: sdk.userInfo.id // Track who completed it
  })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "Template-based completed appointment triggers automation",
    () => sdk.api.endusers.getOne(enduser5.id),
    { onResult: (e: Enduser) => 
        e.tags?.length === 2
     && e.tags.includes('Completed - Any')
     && e.tags.includes('Completed - By Template')
    }
  )

  // Test 6: Template-based trigger with cancelled status (should NOT trigger)
  const event6 = await sdk.api.calendar_events.createOne({
    title: 'Template Test',
    durationInMinutes: 30,
    startTimeInMS: Date.now(),
    attendees: [{ type: 'enduser', id: enduser6.id }],
    templateId: template.id,
    completedAt: new Date(),
    completedBy: sdk.userInfo.id, // Track who completed it
    cancelledAt: new Date()
  })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "Template-based cancelled appointment with completedAt does NOT trigger automation",
    () => sdk.api.endusers.getOne(enduser6.id),
    { onResult: (e: Enduser) => !e.tags?.length } // No tags should be added
  )

  // Test 7: Multiple conflicting statuses (all should NOT trigger)
  const event7 = await sdk.api.calendar_events.createOne({
    title: 'Test Appointment',
    durationInMinutes: 30,
    startTimeInMS: Date.now(),
    attendees: [{ type: 'enduser', id: enduser7.id }],
    completedAt: new Date(),
    completedBy: sdk.userInfo.id, // Track who completed it
    cancelledAt: new Date(),
    rescheduledAt: new Date(),
    noShowedAt: new Date()
  })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "Appointment with all status flags does NOT trigger automation",
    () => sdk.api.endusers.getOne(enduser7.id),
    { onResult: (e: Enduser) => !e.tags?.length } // No tags should be added
  )

  // Test 8: Only completed status (should trigger)
  const event8 = await sdk.api.calendar_events.createOne({
    title: 'Test Appointment',
    durationInMinutes: 30,
    startTimeInMS: Date.now(),
    attendees: [{ type: 'enduser', id: enduser8.id }],
    completedAt: new Date(),
    completedBy: sdk.userInfo.id // Track who completed it
    // No other status flags
  })
  await wait(undefined, 500) // allow triggers to happen
  await async_test(
    "Clean completed appointment triggers automation",
    () => sdk.api.endusers.getOne(enduser8.id),
    { onResult: (e: Enduser) => 
        e.tags?.length === 2
     && e.tags.includes('Completed - Any')
     && e.tags.includes('Completed - By Title')
    }
  )

  // ===== UPDATE SCENARIO TESTS =====
  log_header("Update Scenario Tests")

  // Test 9: Update event to add completedAt (should trigger)
  const updateEvent1 = await sdk.api.calendar_events.createOne({ 
    title: 'Test Appointment', 
    durationInMinutes: 30, 
    startTimeInMS: Date.now(), 
    attendees: [{ type: 'enduser', id: updateEnduser1.id }]
    // Created without completedAt
  })
  await wait(undefined, 500) // ensure no initial triggers
  await async_test(
    "No initial triggers for incomplete appointment",
    () => sdk.api.endusers.getOne(updateEnduser1.id),
    { onResult: (e: Enduser) => !e.tags?.length }
  )
  
  // Now update to mark as completed
  await sdk.api.calendar_events.updateOne(updateEvent1.id, {
    completedAt: new Date(),
    completedBy: sdk.userInfo.id
  })
  await wait(undefined, 500) // allow update triggers to happen
  await async_test(
    "Update to completed triggers automation",
    () => sdk.api.endusers.getOne(updateEnduser1.id),
    { onResult: (e: Enduser) => 
        e.tags?.length === 2
     && e.tags.includes('Completed - Any')
     && e.tags.includes('Completed - By Title')
    }
  )

  // Test 10: Update cancelled event to add completedAt (should NOT trigger)
  const updateEvent2 = await sdk.api.calendar_events.createOne({ 
    title: 'Test Appointment', 
    durationInMinutes: 30, 
    startTimeInMS: Date.now(), 
    attendees: [{ type: 'enduser', id: updateEnduser2.id }],
    cancelledAt: new Date()
  })
  await wait(undefined, 500)
  
  // Update to add completedAt to cancelled event
  await sdk.api.calendar_events.updateOne(updateEvent2.id, {
    completedAt: new Date(),
    completedBy: sdk.userInfo.id
  })
  await wait(undefined, 500) // allow update triggers to happen
  await async_test(
    "Update cancelled event to completed does NOT trigger automation",
    () => sdk.api.endusers.getOne(updateEnduser2.id),
    { onResult: (e: Enduser) => !e.tags?.length }
  )

  // Test 11: Update rescheduled event to add completedAt (should NOT trigger)
  const updateEvent3 = await sdk.api.calendar_events.createOne({ 
    title: 'Test Appointment', 
    durationInMinutes: 30, 
    startTimeInMS: Date.now(), 
    attendees: [{ type: 'enduser', id: updateEnduser3.id }],
    rescheduledAt: new Date()
  })
  await wait(undefined, 500)
  
  // Update to add completedAt to rescheduled event
  await sdk.api.calendar_events.updateOne(updateEvent3.id, {
    completedAt: new Date(),
    completedBy: sdk.userInfo.id
  })
  await wait(undefined, 500) // allow update triggers to happen
  await async_test(
    "Update rescheduled event to completed does NOT trigger automation",
    () => sdk.api.endusers.getOne(updateEnduser3.id),
    { onResult: (e: Enduser) => !e.tags?.length }
  )

  // Test 12: Update no-show event to add completedAt (should NOT trigger)
  const updateEvent4 = await sdk.api.calendar_events.createOne({ 
    title: 'Test Appointment', 
    durationInMinutes: 30, 
    startTimeInMS: Date.now(), 
    attendees: [{ type: 'enduser', id: updateEnduser4.id }],
    noShowedAt: new Date()
  })
  await wait(undefined, 500)
  
  // Update to add completedAt to no-show event
  await sdk.api.calendar_events.updateOne(updateEvent4.id, {
    completedAt: new Date(),
    completedBy: sdk.userInfo.id
  })
  await wait(undefined, 500) // allow update triggers to happen
  await async_test(
    "Update no-show event to completed does NOT trigger automation",
    () => sdk.api.endusers.getOne(updateEnduser4.id),
    { onResult: (e: Enduser) => !e.tags?.length }
  )

  // Test 13: Update event to add both completedAt and cancelledAt (should NOT trigger)
  const updateEvent5 = await sdk.api.calendar_events.createOne({ 
    title: 'Test Appointment', 
    durationInMinutes: 30, 
    startTimeInMS: Date.now(), 
    attendees: [{ type: 'enduser', id: updateEnduser5.id }]
  })
  await wait(undefined, 500)
  
  // Update to add both completedAt and cancelledAt
  await sdk.api.calendar_events.updateOne(updateEvent5.id, {
    completedAt: new Date(),
    completedBy: sdk.userInfo.id,
    cancelledAt: new Date()
  })
  await wait(undefined, 500) // allow update triggers to happen
  await async_test(
    "Update to add both completed and cancelled does NOT trigger automation",
    () => sdk.api.endusers.getOne(updateEnduser5.id),
    { onResult: (e: Enduser) => !e.tags?.length }
  )

  // Cleanup
  await Promise.all([
    sdk.api.automation_triggers.deleteOne(t1.id),
    sdk.api.automation_triggers.deleteOne(t2.id),
    sdk.api.automation_triggers.deleteOne(t3.id),
    sdk.api.calendar_event_templates.deleteOne(template.id),
    sdk.api.endusers.deleteOne(enduser1.id),
    sdk.api.endusers.deleteOne(enduser2.id),
    sdk.api.endusers.deleteOne(enduser3.id),
    sdk.api.endusers.deleteOne(enduser4.id),
    sdk.api.endusers.deleteOne(enduser5.id),
    sdk.api.endusers.deleteOne(enduser6.id),
    sdk.api.endusers.deleteOne(enduser7.id),
    sdk.api.endusers.deleteOne(enduser8.id),
    sdk.api.endusers.deleteOne(updateEnduser1.id),
    sdk.api.endusers.deleteOne(updateEnduser2.id),
    sdk.api.endusers.deleteOne(updateEnduser3.id),
    sdk.api.endusers.deleteOne(updateEnduser4.id),
    sdk.api.endusers.deleteOne(updateEnduser5.id),
    sdk.api.calendar_events.deleteOne(event1.id),
    sdk.api.calendar_events.deleteOne(event2.id),
    sdk.api.calendar_events.deleteOne(event3.id),
    sdk.api.calendar_events.deleteOne(event4.id),
    sdk.api.calendar_events.deleteOne(event5.id),
    sdk.api.calendar_events.deleteOne(event6.id),
    sdk.api.calendar_events.deleteOne(event7.id),
    sdk.api.calendar_events.deleteOne(event8.id),
    sdk.api.calendar_events.deleteOne(updateEvent1.id),
    sdk.api.calendar_events.deleteOne(updateEvent2.id),
    sdk.api.calendar_events.deleteOne(updateEvent3.id),
    sdk.api.calendar_events.deleteOne(updateEvent4.id),
    sdk.api.calendar_events.deleteOne(updateEvent5.id),
  ])
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await appointment_completed_trigger_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Appointment Completed trigger tests completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Appointment Completed trigger tests failed:", error)
      process.exit(1)
    })
}