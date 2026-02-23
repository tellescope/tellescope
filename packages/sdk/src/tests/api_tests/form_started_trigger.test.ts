require('source-map-support').install();

import axios from "axios"
import { Session, EnduserSession } from "../../sdk"
import { log_header, wait, async_test } from "@tellescope/testing"
import { Enduser } from "@tellescope/types-client"
import { setup_tests } from "../setup"

const host = process.env.API_URL || "http://localhost:8080"

export const form_started_trigger_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Form Started Trigger Tests (Sources)")

  const form = await sdk.api.forms.createOne({ title: "Form Started Trigger Test", allowPublicURL: true })
  const field = await sdk.api.form_fields.createOne({
    formId: form.id,
    title: 'test_field',
    type: 'string',
    previousFields: [{ type: 'root', info: {} }],
  })

  const postToFormsort = async (o: {
    answers: { key: string, value: any }[],
    responder_uuid: string,
    finalized: boolean,
  }) => {
    const url = new URL(`${host}/v1/webhooks/formsort/9d4f9dff00f60df2690a16da2cb848f289b447614ad9bef850e54af09a1fbf7a`)
    url.searchParams.set('formId', form.id)
    return await axios.post(url.toString(), o)
  }

  // Helper to start a public form session (this triggers Form Started)
  const startPublicForm = async (email: string) => {
    const enduserSDK = new EnduserSession({ host, businessId: form.businessId })
    return await enduserSDK.api.form_responses.session_for_public_form({
      formId: form.id,
      businessId: form.businessId,
      email,
      skipMatch: true,
    })
  }

  // Test 1: Default behavior (no sources) - trigger fires only on public form start
  const triggerDefault = await sdk.api.automation_triggers.createOne({
    event: { type: 'Form Started', info: { formIds: [form.id] } },
    action: { type: 'Add Tags', info: { tags: ['default-trigger'] } },
    status: 'Active',
    title: "Default (no sources)",
  })

  // Fire via public form (session_for_public_form)
  const { enduserId: enduserId1 } = await startPublicForm('fst-test1@tellescope.com')
  await wait(undefined, 500)
  await async_test(
    "Default trigger fires on public form start",
    () => sdk.api.endusers.getOne(enduserId1),
    { onResult: (e: Enduser) => !!e.tags?.includes('default-trigger') }
  )

  // Fire via formsort draft - should NOT trigger (default = Public Form only)
  await postToFormsort({
    answers: [{ key: 'email', value: 'fst-test2@tellescope.com' }],
    responder_uuid: "fst-default-1",
    finalized: false,
  })
  await wait(undefined, 500)
  const enduser2 = await sdk.api.endusers.getOne({ email: 'fst-test2@tellescope.com' })
  await async_test(
    "Default trigger does NOT fire on formsort draft",
    () => sdk.api.endusers.getOne(enduser2.id),
    { onResult: (e: Enduser) => !e.tags?.includes('default-trigger') }
  )

  // Fire via prepare_form_response - should NOT trigger (only session_for_public_form triggers)
  // Test with trigger that has NO sources field (backward compatibility)
  const enduserForPrepare1 = await sdk.api.endusers.createOne({ email: 'fst-test-prepare1@tellescope.com' })
  await sdk.api.form_responses.prepare_form_response({
    formId: form.id,
    enduserId: enduserForPrepare1.id,
  })
  await wait(undefined, 500)
  await async_test(
    "prepare_form_response does NOT trigger Form Started (no sources field)",
    () => sdk.api.endusers.getOne(enduserForPrepare1.id),
    { onResult: (e: Enduser) => !e.tags?.includes('default-trigger') }
  )

  await sdk.api.automation_triggers.deleteOne(triggerDefault.id)

  // Test with trigger that HAS sources: ['Public Form'] set
  const triggerWithSources = await sdk.api.automation_triggers.createOne({
    event: { type: 'Form Started', info: { formIds: [form.id], sources: ['Public Form'] } },
    action: { type: 'Add Tags', info: { tags: ['prepare-sources-trigger'] } },
    status: 'Active',
    title: "Prepare test with sources",
  })

  const enduserForPrepare2 = await sdk.api.endusers.createOne({ email: 'fst-test-prepare2@tellescope.com' })
  await sdk.api.form_responses.prepare_form_response({
    formId: form.id,
    enduserId: enduserForPrepare2.id,
  })
  await wait(undefined, 500)
  await async_test(
    "prepare_form_response does NOT trigger Form Started (with sources field)",
    () => sdk.api.endusers.getOne(enduserForPrepare2.id),
    { onResult: (e: Enduser) => !e.tags?.includes('prepare-sources-trigger') }
  )

  await sdk.api.automation_triggers.deleteOne(triggerWithSources.id)

  // Test 2: sources: ['Public Form'] - same as default
  const triggerPublic = await sdk.api.automation_triggers.createOne({
    event: { type: 'Form Started', info: { formIds: [form.id], sources: ['Public Form'] } },
    action: { type: 'Add Tags', info: { tags: ['public-only-trigger'] } },
    status: 'Active',
    title: "Public Form only",
  })

  const { enduserId: enduserId3 } = await startPublicForm('fst-test3@tellescope.com')
  await wait(undefined, 500)
  await async_test(
    "Public Form source trigger fires on public form start",
    () => sdk.api.endusers.getOne(enduserId3),
    { onResult: (e: Enduser) => !!e.tags?.includes('public-only-trigger') }
  )

  await sdk.api.automation_triggers.deleteOne(triggerPublic.id)

  // Test 3: sources: ['Formsort'] - trigger fires only on formsort draft
  const triggerFormsort = await sdk.api.automation_triggers.createOne({
    event: { type: 'Form Started', info: { formIds: [form.id], sources: ['Formsort'] } },
    action: { type: 'Add Tags', info: { tags: ['formsort-trigger'] } },
    status: 'Active',
    title: "Formsort only",
  })

  // Public form should NOT fire this trigger
  const { enduserId: enduserId4 } = await startPublicForm('fst-test4@tellescope.com')
  await wait(undefined, 500)
  await async_test(
    "Formsort source trigger does NOT fire on public form start",
    () => sdk.api.endusers.getOne(enduserId4),
    { onResult: (e: Enduser) => !e.tags?.includes('formsort-trigger') }
  )

  // Formsort draft should fire this trigger
  await postToFormsort({
    answers: [{ key: 'email', value: 'fst-test5@tellescope.com' }],
    responder_uuid: "fst-formsort-1",
    finalized: false,
  })
  await wait(undefined, 500)
  const enduser5 = await sdk.api.endusers.getOne({ email: 'fst-test5@tellescope.com' })
  await async_test(
    "Formsort source trigger fires on formsort draft",
    () => sdk.api.endusers.getOne(enduser5.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('formsort-trigger') }
  )

  await sdk.api.automation_triggers.deleteOne(triggerFormsort.id)

  // Test 4: sources: ['Public Form', 'Formsort'] - trigger fires on both
  const triggerBoth = await sdk.api.automation_triggers.createOne({
    event: { type: 'Form Started', info: { formIds: [form.id], sources: ['Public Form', 'Formsort'] } },
    action: { type: 'Add Tags', info: { tags: ['both-trigger'] } },
    status: 'Active',
    title: "Both sources",
  })

  // Public form should fire
  const { enduserId: enduserId7 } = await startPublicForm('fst-test7@tellescope.com')
  await wait(undefined, 500)
  await async_test(
    "Both sources trigger fires on public form start",
    () => sdk.api.endusers.getOne(enduserId7),
    { onResult: (e: Enduser) => !!e.tags?.includes('both-trigger') }
  )

  // Formsort draft should fire
  await postToFormsort({
    answers: [{ key: 'email', value: 'fst-test8@tellescope.com' }],
    responder_uuid: "fst-both-1",
    finalized: false,
  })
  await wait(undefined, 500)
  const enduser8 = await sdk.api.endusers.getOne({ email: 'fst-test8@tellescope.com' })
  await async_test(
    "Both sources trigger fires on formsort draft",
    () => sdk.api.endusers.getOne(enduser8.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('both-trigger') }
  )

  await sdk.api.automation_triggers.deleteOne(triggerBoth.id)

  // Test 5: Formsort fires once per draft (subsequent updates should not re-trigger)
  const triggerOnce = await sdk.api.automation_triggers.createOne({
    event: { type: 'Form Started', info: { formIds: [form.id], sources: ['Formsort'] } },
    action: { type: 'Add Tags', info: { tags: ['once-trigger'] } },
    status: 'Active',
    title: "Once trigger",
  })

  // First draft - should trigger
  await postToFormsort({
    answers: [{ key: 'email', value: 'fst-test9@tellescope.com' }],
    responder_uuid: "fst-once-1",
    finalized: false,
  })
  await wait(undefined, 500)
  const enduser9 = await sdk.api.endusers.getOne({ email: 'fst-test9@tellescope.com' })
  await async_test(
    "Formsort trigger fires on first draft",
    () => sdk.api.endusers.getOne(enduser9.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('once-trigger') }
  )

  // Remove tag to detect if trigger fires again
  await sdk.api.endusers.updateOne(enduser9.id, { tags: [] }, { replaceObjectFields: true })

  // Second draft update (same responder_uuid) - should NOT trigger again (existingResponse is not null)
  await postToFormsort({
    answers: [{ key: 'email', value: 'fst-test9@tellescope.com' }, { key: 'test_field', value: 'updated' }],
    responder_uuid: "fst-once-1",
    finalized: false,
  })
  await wait(undefined, 500)
  await async_test(
    "Formsort trigger does NOT fire on subsequent draft update",
    () => sdk.api.endusers.getOne(enduser9.id),
    { onResult: (e: Enduser) => !e.tags?.includes('once-trigger') }
  )

  await sdk.api.automation_triggers.deleteOne(triggerOnce.id)

  // Test 6: Immediately finalized formsort does NOT trigger Form Started
  const triggerFinalized = await sdk.api.automation_triggers.createOne({
    event: { type: 'Form Started', info: { formIds: [form.id], sources: ['Formsort'] } },
    action: { type: 'Add Tags', info: { tags: ['finalized-trigger'] } },
    status: 'Active',
    title: "Finalized trigger",
  })

  // Submit immediately finalized form via formsort (never unfinalized)
  await postToFormsort({
    answers: [{ key: 'email', value: 'fst-test10@tellescope.com' }],
    responder_uuid: "fst-finalized-1",
    finalized: true,
  })
  await wait(undefined, 500)
  const enduser10 = await sdk.api.endusers.getOne({ email: 'fst-test10@tellescope.com' })
  await async_test(
    "Immediately finalized formsort does NOT trigger Form Started",
    () => sdk.api.endusers.getOne(enduser10.id),
    { onResult: (e: Enduser) => !e.tags?.includes('finalized-trigger') }
  )

  await sdk.api.automation_triggers.deleteOne(triggerFinalized.id)

  // Cleanup - delete all endusers created during test
  const enduserEmails = [
    'fst-test1@tellescope.com', 'fst-test2@tellescope.com', 'fst-test3@tellescope.com',
    'fst-test4@tellescope.com', 'fst-test5@tellescope.com', 'fst-test7@tellescope.com',
    'fst-test8@tellescope.com', 'fst-test9@tellescope.com', 'fst-test10@tellescope.com',
    'fst-test-prepare1@tellescope.com', 'fst-test-prepare2@tellescope.com',
  ]
  for (const email of enduserEmails) {
    try {
      const e = await sdk.api.endusers.getOne({ email })
      await sdk.api.endusers.deleteOne(e.id)
    } catch (err) { /* may not exist */ }
  }
  await sdk.api.forms.deleteOne(form.id)
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await form_started_trigger_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Form Started trigger tests completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Form Started trigger tests failed:", error)
      process.exit(1)
    })
}
