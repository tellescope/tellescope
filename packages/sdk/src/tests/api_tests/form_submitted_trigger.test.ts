require('source-map-support').install();

import { Session } from "../../sdk"
import { log_header, wait, async_test } from "@tellescope/testing"
import { Enduser } from "@tellescope/types-client"
import { setup_tests } from "../setup"

const host = process.env.API_URL || "http://localhost:8080"

export const form_submitted_trigger_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Form Submitted Trigger Tests (Multi-Form & Per-Form Conditions)")

  // Setup: two forms with one string field each
  const formA = await sdk.api.forms.createOne({ title: 'Form Submitted Trigger Test A' })
  const fieldA = await sdk.api.form_fields.createOne({
    formId: formA.id,
    type: 'string',
    title: 'FieldA',
    previousFields: [{ type: 'root', info: {} }],
  })

  const formB = await sdk.api.forms.createOne({ title: 'Form Submitted Trigger Test B' })
  const fieldB = await sdk.api.form_fields.createOne({
    formId: formB.id,
    type: 'string',
    title: 'FieldB',
    previousFields: [{ type: 'root', info: {} }],
  })

  // Helper to prepare and submit a form response
  const submitForm = async (formId: string, enduserId: string, responses: { fieldId: string, fieldTitle: string, answer: { type: 'string', value: string } }[]) => {
    const { accessCode } = await sdk.api.form_responses.prepare_form_response({ enduserId, formId })
    await sdk.api.form_responses.submit_form_response({ accessCode, responses })
  }

  // Pre-create endusers for each scenario to avoid throttle
  const enduserA1 = await sdk.api.endusers.createOne({ fname: 'fst-a1' })
  const enduserB1 = await sdk.api.endusers.createOne({ fname: 'fst-b1' })
  const enduserA2 = await sdk.api.endusers.createOne({ fname: 'fst-a2' })
  const enduserB2 = await sdk.api.endusers.createOne({ fname: 'fst-b2' })
  const enduserB3 = await sdk.api.endusers.createOne({ fname: 'fst-b3' })
  const enduserA3 = await sdk.api.endusers.createOne({ fname: 'fst-a3' })
  const enduserA4 = await sdk.api.endusers.createOne({ fname: 'fst-a4' })

  const allEndusers = [enduserA1, enduserB1, enduserA2, enduserB2, enduserB3, enduserA3, enduserA4]
  const allTriggers: { id: string }[] = []

  try {
    // ── Scenario 1: Backwards compatibility — global conditions on primary form ──
    const trigger1 = await sdk.api.automation_triggers.createOne({
      event: {
        type: 'Form Submitted',
        info: { formId: formA.id },
        conditions: {
          "$and": [{ "condition": { [fieldA.id]: "match-value" } }]
        },
      },
      action: { type: 'Add Tags', info: { tags: ['global-cond-primary'] } },
      status: 'Active',
      title: "Scenario 1: Global conditions backwards compat",
    })
    allTriggers.push(trigger1)

    await submitForm(formA.id, enduserA1.id, [{
      fieldId: fieldA.id, fieldTitle: 'FieldA',
      answer: { type: 'string', value: 'match-value' },
    }])
    await wait(undefined, 1000)

    await async_test(
      "Scenario 1: Global conditions on primary form still work (backwards compat)",
      () => sdk.api.endusers.getOne(enduserA1.id),
      { onResult: (e: Enduser) => !!e.tags?.includes('global-cond-primary') }
    )

    await sdk.api.automation_triggers.deleteOne(trigger1.id)

    // ── Scenario 2: Multi-form trigger fires on secondary form submission ──
    const trigger2 = await sdk.api.automation_triggers.createOne({
      event: {
        type: 'Form Submitted',
        info: { formId: formA.id, otherFormIds: [formB.id] },
      },
      action: { type: 'Add Tags', info: { tags: ['multi-form-secondary'] } },
      status: 'Active',
      title: "Scenario 2: Multi-form fires on secondary",
    })
    allTriggers.push(trigger2)

    await submitForm(formB.id, enduserB1.id, [{
      fieldId: fieldB.id, fieldTitle: 'FieldB',
      answer: { type: 'string', value: 'anything' },
    }])
    await wait(undefined, 1000)

    await async_test(
      "Scenario 2: Trigger fires when secondary form (otherFormIds) is submitted",
      () => sdk.api.endusers.getOne(enduserB1.id),
      { onResult: (e: Enduser) => !!e.tags?.includes('multi-form-secondary') }
    )

    await sdk.api.automation_triggers.deleteOne(trigger2.id)

    // ── Scenario 3: Per-form conditions match on primary form ──
    const trigger3 = await sdk.api.automation_triggers.createOne({
      event: {
        type: 'Form Submitted',
        info: {
          formId: formA.id,
          otherFormIds: [formB.id],
          conditionsByFormId: {
            [formA.id]: { "$and": [{ "condition": { [fieldA.id]: "primary-match" } }] },
          },
        },
      },
      action: { type: 'Add Tags', info: { tags: ['per-form-primary'] } },
      status: 'Active',
      title: "Scenario 3: Per-form conditions on primary",
    })
    allTriggers.push(trigger3)

    await submitForm(formA.id, enduserA2.id, [{
      fieldId: fieldA.id, fieldTitle: 'FieldA',
      answer: { type: 'string', value: 'primary-match' },
    }])
    await wait(undefined, 1000)

    await async_test(
      "Scenario 3: Per-form conditions match on primary form",
      () => sdk.api.endusers.getOne(enduserA2.id),
      { onResult: (e: Enduser) => !!e.tags?.includes('per-form-primary') }
    )

    await sdk.api.automation_triggers.deleteOne(trigger3.id)

    // ── Scenario 4: Per-form conditions match on secondary form ──
    const trigger4 = await sdk.api.automation_triggers.createOne({
      event: {
        type: 'Form Submitted',
        info: {
          formId: formA.id,
          otherFormIds: [formB.id],
          conditionsByFormId: {
            [formB.id]: { "$and": [{ "condition": { [fieldB.id]: "secondary-match" } }] },
          },
        },
      },
      action: { type: 'Add Tags', info: { tags: ['per-form-secondary'] } },
      status: 'Active',
      title: "Scenario 4: Per-form conditions on secondary",
    })
    allTriggers.push(trigger4)

    await submitForm(formB.id, enduserB2.id, [{
      fieldId: fieldB.id, fieldTitle: 'FieldB',
      answer: { type: 'string', value: 'secondary-match' },
    }])
    await wait(undefined, 1000)

    await async_test(
      "Scenario 4: Per-form conditions match on secondary form",
      () => sdk.api.endusers.getOne(enduserB2.id),
      { onResult: (e: Enduser) => !!e.tags?.includes('per-form-secondary') }
    )

    await sdk.api.automation_triggers.deleteOne(trigger4.id)

    // ── Scenario 5: Per-form conditions on one form don't block a different form ──
    const trigger5 = await sdk.api.automation_triggers.createOne({
      event: {
        type: 'Form Submitted',
        info: {
          formId: formA.id,
          otherFormIds: [formB.id],
          conditionsByFormId: {
            [formA.id]: { "$and": [{ "condition": { [fieldA.id]: "strict-value" } }] },
          },
        },
      },
      action: { type: 'Add Tags', info: { tags: ['no-cross-block'] } },
      status: 'Active',
      title: "Scenario 5: No cross-form condition blocking",
    })
    allTriggers.push(trigger5)

    await submitForm(formB.id, enduserB3.id, [{
      fieldId: fieldB.id, fieldTitle: 'FieldB',
      answer: { type: 'string', value: 'anything' },
    }])
    await wait(undefined, 1000)

    await async_test(
      "Scenario 5: Conditions on FormA do not block FormB (no cross-form blocking)",
      () => sdk.api.endusers.getOne(enduserB3.id),
      { onResult: (e: Enduser) => !!e.tags?.includes('no-cross-block') }
    )

    await sdk.api.automation_triggers.deleteOne(trigger5.id)

    // ── Scenario 6: conditionsByFormId overrides global conditions ──
    const trigger6 = await sdk.api.automation_triggers.createOne({
      event: {
        type: 'Form Submitted',
        info: {
          formId: formA.id,
          conditionsByFormId: {
            [formA.id]: { "$and": [{ "condition": { [fieldA.id]: "per-form-value" } }] },
          },
        },
        conditions: {
          "$and": [{ "condition": { [fieldA.id]: "global-value" } }]
        },
      },
      action: { type: 'Add Tags', info: { tags: ['override-test'] } },
      status: 'Active',
      title: "Scenario 6: conditionsByFormId overrides global",
    })
    allTriggers.push(trigger6)

    // 6a: Submit with per-form matching value — should fire
    await submitForm(formA.id, enduserA3.id, [{
      fieldId: fieldA.id, fieldTitle: 'FieldA',
      answer: { type: 'string', value: 'per-form-value' },
    }])
    await wait(undefined, 1000)

    await async_test(
      "Scenario 6a: conditionsByFormId match fires trigger (overrides global)",
      () => sdk.api.endusers.getOne(enduserA3.id),
      { onResult: (e: Enduser) => !!e.tags?.includes('override-test') }
    )

    // 6b: Submit with global matching value — should NOT fire (per-form takes precedence)
    await submitForm(formA.id, enduserA4.id, [{
      fieldId: fieldA.id, fieldTitle: 'FieldA',
      answer: { type: 'string', value: 'global-value' },
    }])
    await wait(undefined, 1000)

    await async_test(
      "Scenario 6b: Global conditions ignored when conditionsByFormId exists",
      () => sdk.api.endusers.getOne(enduserA4.id),
      { onResult: (e: Enduser) => !e.tags?.includes('override-test') }
    )

    await sdk.api.automation_triggers.deleteOne(trigger6.id)

  } finally {
    // Cleanup
    for (const e of allEndusers) {
      try { await sdk.api.endusers.deleteOne(e.id) } catch (err) { /* may already be deleted */ }
    }
    for (const t of allTriggers) {
      try { await sdk.api.automation_triggers.deleteOne(t.id) } catch (err) { /* may already be deleted */ }
    }
    try { await sdk.api.forms.deleteOne(formA.id) } catch (err) { /* ignore */ }
    try { await sdk.api.forms.deleteOne(formB.id) } catch (err) { /* ignore */ }
  }
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await form_submitted_trigger_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Form Submitted trigger tests completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Form Submitted trigger tests failed:", error)
      process.exit(1)
    })
}
