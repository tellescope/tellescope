import { Session } from "../../sdk"
import { log_header, wait, async_test } from "@tellescope/testing"
import { Enduser } from "@tellescope/types-client"
import { setup_tests } from "../setup"

const host = process.env.API_URL || "http://localhost:8080"

// Covers the event-wide "Appointment No-Showed" trigger path (handle_no_showed_event), which had
// no dedicated test. Mirrors appointment_completed_trigger.test.ts.
export const appointment_no_showed_trigger_tests = async ({ sdk } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Automation Trigger Tests (Appointment No-Showed)")

  const t1 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Appointment No-Showed', info: {} },
    action: { type: 'Add Tags', info: { tags: ['No-Show - Any'] } },
    status: 'Active',
    title: "No-Show - Any",
  })
  const t2 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Appointment No-Showed', info: { titles: ['Test Appointment'] } },
    action: { type: 'Add Tags', info: { tags: ['No-Show - By Title'] } },
    status: 'Active',
    title: "No-Show - By Title",
  })
  const template = await sdk.api.calendar_event_templates.createOne({
    title: 'No-Show Template',
    durationInMinutes: 30,
  })
  const t3 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Appointment No-Showed', info: { templateIds: [template.id] } },
    action: { type: 'Add Tags', info: { tags: ['No-Show - By Template'] } },
    status: 'Active',
    title: "No-Show - By Template",
  })

  // Separate endusers to avoid per-trigger throttling (1 min per trigger per enduser)
  const enduser1 = await sdk.api.endusers.createOne({})
  const enduser2 = await sdk.api.endusers.createOne({})
  const enduser3 = await sdk.api.endusers.createOne({})

  // Note: the "Appointment No-Showed" trigger fires only on UPDATE (handle_no_showed_event);
  // there is no create-time no-show path, so every case creates a normal event then updates it.

  // Test 1: Update to no-showed by title (should trigger Any + By Title)
  const event1 = await sdk.api.calendar_events.createOne({
    title: 'Test Appointment',
    durationInMinutes: 30,
    startTimeInMS: Date.now(),
    attendees: [{ type: 'enduser', id: enduser1.id }],
  })
  await wait(undefined, 500)
  await async_test(
    "No initial triggers before no-show",
    () => sdk.api.endusers.getOne(enduser1.id),
    { onResult: (e: Enduser) => !e.tags?.length }
  )
  await sdk.api.calendar_events.updateOne(event1.id, { noShowedAt: new Date() })
  await wait(undefined, 500)
  await async_test(
    "Update to no-showed triggers automation (Any + By Title)",
    () => sdk.api.endusers.getOne(enduser1.id),
    { onResult: (e: Enduser) =>
        e.tags?.length === 2
     && e.tags.includes('No-Show - Any')
     && e.tags.includes('No-Show - By Title')
    }
  )

  // Test 2: Template-based no-show (should trigger Any + By Template)
  const event2 = await sdk.api.calendar_events.createOne({
    title: 'Template Test',
    durationInMinutes: 30,
    startTimeInMS: Date.now(),
    attendees: [{ type: 'enduser', id: enduser2.id }],
    templateId: template.id,
  })
  await wait(undefined, 500)
  await sdk.api.calendar_events.updateOne(event2.id, { noShowedAt: new Date() })
  await wait(undefined, 500)
  await async_test(
    "Template-based no-showed appointment triggers automation (Any + By Template)",
    () => sdk.api.endusers.getOne(enduser2.id),
    { onResult: (e: Enduser) =>
        e.tags?.length === 2
     && e.tags.includes('No-Show - Any')
     && e.tags.includes('No-Show - By Template')
    }
  )

  // Test 3: Non-matching title only fires the "Any" trigger
  const event3 = await sdk.api.calendar_events.createOne({
    title: 'Other Title',
    durationInMinutes: 30,
    startTimeInMS: Date.now(),
    attendees: [{ type: 'enduser', id: enduser3.id }],
  })
  await wait(undefined, 500)
  await sdk.api.calendar_events.updateOne(event3.id, { noShowedAt: new Date() })
  await wait(undefined, 500)
  await async_test(
    "No-show with non-matching title fires only the Any trigger",
    () => sdk.api.endusers.getOne(enduser3.id),
    { onResult: (e: Enduser) =>
        e.tags?.length === 1
     && e.tags.includes('No-Show - Any')
    }
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
    sdk.api.calendar_events.deleteOne(event1.id),
    sdk.api.calendar_events.deleteOne(event2.id),
    sdk.api.calendar_events.deleteOne(event3.id),
  ])
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await appointment_no_showed_trigger_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Appointment No-Showed trigger tests completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Appointment No-Showed trigger tests failed:", error)
      process.exit(1)
    })
}
