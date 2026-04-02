import { Session } from "../../sdk"
import { log_header, wait, async_test } from "@tellescope/testing"
import { Enduser, EnduserMedication } from "@tellescope/types-client"
import { PLACEHOLDER_ID } from "@tellescope/constants"
import { setup_tests } from "../setup"

const host = process.env.API_URL || "http://localhost:8080"

export const medication_added_trigger_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Automation Trigger Tests (Medication Added)")

  // Create automation triggers for different scenarios

  // T1: No filters — fires for any medication
  const t1 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Medication Added', info: { titles: [], protocols: [] } },
    action: { type: 'Add Tags', info: { tags: ['Med-Any'] }},
    status: 'Active',
    title: "Medication - Any"
  })

  // T2: Title filter only
  const t2 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Medication Added', info: { titles: ['Lisinopril'], protocols: [] } },
    action: { type: 'Add Tags', info: { tags: ['Med-Title-Match'] }},
    status: 'Active',
    title: "Medication - Title Match"
  })

  // T3: Protocol filter only
  const t3 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Medication Added', info: { titles: [], protocols: ['Weight Loss'] } },
    action: { type: 'Add Tags', info: { tags: ['Med-Protocol-Match'] }},
    status: 'Active',
    title: "Medication - Protocol Match"
  })

  // T4: Title + protocol filter
  const t4 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Medication Added', info: { titles: ['Metformin'], protocols: ['Diabetes'] } },
    action: { type: 'Add Tags', info: { tags: ['Med-Title-And-Protocol'] }},
    status: 'Active',
    title: "Medication - Title and Protocol"
  })

  // T5: Protocol filter that won't match
  const t5 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Medication Added', info: { titles: [], protocols: ['Dermatology'] } },
    action: { type: 'Add Tags', info: { tags: ['Med-Derm-Protocol'] }},
    status: 'Active',
    title: "Medication - Dermatology Protocol"
  })

  // Create separate endusers to avoid trigger throttling (1 minute per trigger per enduser)
  const enduser1 = await sdk.api.endusers.createOne({})
  const enduser2 = await sdk.api.endusers.createOne({})
  const enduser3 = await sdk.api.endusers.createOne({})
  const enduser4 = await sdk.api.endusers.createOne({})
  const enduser5 = await sdk.api.endusers.createOne({})
  const enduser6 = await sdk.api.endusers.createOne({})

  // Test 1: Any medication — empty titles + empty protocols → fires for any medication
  const med1 = await sdk.api.enduser_medications.createOne({
    enduserId: enduser1.id,
    title: 'Aspirin',
  })
  await wait(undefined, 500)
  await async_test(
    "Medication Added - Any medication (no filters)",
    () => sdk.api.endusers.getOne(enduser1.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Med-Any') }
  )

  // Test 2: Title filter only — matching title, no protocol filter → fires
  const med2 = await sdk.api.enduser_medications.createOne({
    enduserId: enduser2.id,
    title: 'Lisinopril',
  })
  await wait(undefined, 500)
  await async_test(
    "Medication Added - Title filter match",
    () => sdk.api.endusers.getOne(enduser2.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Med-Title-Match') }
  )

  // Test 3: Protocol filter only — matching protocol, no title filter → fires
  const med3 = await sdk.api.enduser_medications.createOne({
    enduserId: enduser3.id,
    title: 'Semaglutide',
    protocol: 'Weight Loss',
  })
  await wait(undefined, 500)
  await async_test(
    "Medication Added - Protocol filter match",
    () => sdk.api.endusers.getOne(enduser3.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Med-Protocol-Match') }
  )

  // Test 4: Title + protocol filter — both match → fires
  const med4 = await sdk.api.enduser_medications.createOne({
    enduserId: enduser4.id,
    title: 'Metformin',
    protocol: 'Diabetes',
  })
  await wait(undefined, 500)
  await async_test(
    "Medication Added - Title and protocol filter match",
    () => sdk.api.endusers.getOne(enduser4.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Med-Title-And-Protocol') }
  )

  // Test 5: Non-matching protocol — protocol filter doesn't match → does NOT fire
  const med5 = await sdk.api.enduser_medications.createOne({
    enduserId: enduser5.id,
    title: 'Ibuprofen',
    protocol: 'Pain Management',
  })
  await wait(undefined, 500)
  await async_test(
    "Medication Added - Non-matching protocol does NOT fire",
    () => sdk.api.endusers.getOne(enduser5.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Med-Any') && !e.tags?.includes('Med-Derm-Protocol') }
  )

  // Test 6: No protocol on medication — trigger has protocol filter, medication has no protocol → does NOT fire
  const med6 = await sdk.api.enduser_medications.createOne({
    enduserId: enduser6.id,
    title: 'Amoxicillin',
  })
  await wait(undefined, 500)
  await async_test(
    "Medication Added - No protocol on med, protocol filter does NOT fire",
    () => sdk.api.endusers.getOne(enduser6.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Med-Any') && !e.tags?.includes('Med-Protocol-Match') && !e.tags?.includes('Med-Derm-Protocol') }
  )

  try {
    // Clean up test data - triggers first
    await sdk.api.automation_triggers.deleteOne(t1.id)
    await sdk.api.automation_triggers.deleteOne(t2.id)
    await sdk.api.automation_triggers.deleteOne(t3.id)
    await sdk.api.automation_triggers.deleteOne(t4.id)
    await sdk.api.automation_triggers.deleteOne(t5.id)

    // Clean up endusers (also cleans up medications)
    await sdk.api.endusers.deleteOne(enduser1.id)
    await sdk.api.endusers.deleteOne(enduser2.id)
    await sdk.api.endusers.deleteOne(enduser3.id)
    await sdk.api.endusers.deleteOne(enduser4.id)
    await sdk.api.endusers.deleteOne(enduser5.id)
    await sdk.api.endusers.deleteOne(enduser6.id)
  } finally {}

  // ---- Beluga Webhook Integration Test ----
  log_header("Beluga RX_WRITTEN Webhook Integration Test (Protocol)")

  // Create a form with belugaVisitType set (this becomes the protocol)
  const belugaForm = await sdk.api.forms.createOne({
    title: 'Beluga Protocol Test Form',
    belugaVisitType: 'Weight Loss',
  })

  const belugaEnduser = await sdk.api.endusers.createOne({})

  // Create a form response that the webhook can look up by masterId
  const belugaFormResponse = await sdk.api.form_responses.createOne({
    formId: belugaForm.id,
    enduserId: belugaEnduser.id,
    formTitle: belugaForm.title,
    responses: [{
      fieldId: PLACEHOLDER_ID,
      fieldTitle: 'placeholder',
      answer: { type: 'string', value: 'test' },
    }],
  })

  // Create a trigger that filters on protocol 'Weight Loss'
  const belugaTrigger = await sdk.api.automation_triggers.createOne({
    event: { type: 'Medication Added', info: { titles: [], protocols: ['Weight Loss'] } },
    action: { type: 'Add Tags', info: { tags: ['Med-Beluga-Protocol'] }},
    status: 'Active',
    title: "Medication - Beluga Protocol Test"
  })

  // Simulate the Beluga RX_WRITTEN webhook
  const webhookResponse = await fetch(`${host}/v1/webhooks/beluga`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      masterId: `tellescope_${belugaFormResponse.id}`,
      event: 'RX_WRITTEN',
      docName: 'Dr. Test',
      medsPrescribed: [{
        name: 'Semaglutide',
        strength: '0.25mg',
        refills: '3',
        quantity: '1',
        medId: 'test-ndc-123',
        rxId: 'test-rx-456',
      }],
    }),
  })

  if (!webhookResponse.ok) {
    throw new Error(`Beluga webhook failed with status ${webhookResponse.status}: ${await webhookResponse.text()}`)
  }

  await wait(undefined, 500)

  // Verify the trigger fired (enduser got the tag)
  await async_test(
    "Beluga RX_WRITTEN - Protocol trigger fires",
    () => sdk.api.endusers.getOne(belugaEnduser.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Med-Beluga-Protocol') }
  )

  // Verify the medication was created with correct protocol and source
  const belugaMeds = await sdk.api.enduser_medications.getSome({ filter: { enduserId: belugaEnduser.id } })
  const belugaMed = belugaMeds[0]
  await async_test(
    "Beluga RX_WRITTEN - Medication has protocol from form belugaVisitType",
    async () => belugaMed,
    { onResult: (m: EnduserMedication) => m.protocol === 'Weight Loss' && m.source === 'Beluga' && m.title === 'Semaglutide' }
  )

  try {
    // Clean up Beluga test data
    await sdk.api.automation_triggers.deleteOne(belugaTrigger.id)
    await sdk.api.forms.deleteOne(belugaForm.id)
    await sdk.api.endusers.deleteOne(belugaEnduser.id) // also cleans up form response and medications
  } finally {}

  // ---- Set Fields with {{medication.name}} Test ----
  log_header("Medication Added - Set Fields with {{medication.name}}")

  const setFieldsTrigger = await sdk.api.automation_triggers.createOne({
    event: { type: 'Medication Added', info: { titles: [], protocols: [] } },
    action: { type: 'Set Fields', info: { fields: [{ name: 'Medication Name', type: 'Custom Value' as const, value: '{{medication.name}}' }] }},
    status: 'Active',
    title: "Medication - Set Fields medication.name"
  })

  const setFieldsEnduser = await sdk.api.endusers.createOne({})

  const setFieldsMed = await sdk.api.enduser_medications.createOne({
    enduserId: setFieldsEnduser.id,
    title: 'Lisinopril 10mg',
  })
  await wait(undefined, 500)

  await async_test(
    "Medication Added - Set Fields copies medication.name to enduser field",
    () => sdk.api.endusers.getOne(setFieldsEnduser.id),
    { onResult: (e: Enduser) => e.fields?.['Medication Name'] === 'Lisinopril 10mg' }
  )

  // Test with title-filtered trigger to verify medication context is passed correctly
  const setFieldsTriggerFiltered = await sdk.api.automation_triggers.createOne({
    event: { type: 'Medication Added', info: { titles: ['Metformin 500mg'], protocols: [] } },
    action: { type: 'Set Fields', info: { fields: [{ name: 'Specific Med', type: 'Custom Value' as const, value: '{{medication.name}}' }] }},
    status: 'Active',
    title: "Medication - Set Fields filtered"
  })

  const setFieldsEnduser2 = await sdk.api.endusers.createOne({})

  const setFieldsMed2 = await sdk.api.enduser_medications.createOne({
    enduserId: setFieldsEnduser2.id,
    title: 'Metformin 500mg',
  })
  await wait(undefined, 500)

  await async_test(
    "Medication Added - Set Fields with title filter copies medication.name",
    () => sdk.api.endusers.getOne(setFieldsEnduser2.id),
    { onResult: (e: Enduser) => e.fields?.['Specific Med'] === 'Metformin 500mg' }
  )

  try {
    await sdk.api.automation_triggers.deleteOne(setFieldsTrigger.id)
    await sdk.api.automation_triggers.deleteOne(setFieldsTriggerFiltered.id)
    await sdk.api.endusers.deleteOne(setFieldsEnduser.id)
    await sdk.api.endusers.deleteOne(setFieldsEnduser2.id)
  } finally {}
}

// Allow running this test file independently
if (require.main === module) {
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await medication_added_trigger_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Medication Added trigger tests completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Medication Added trigger tests failed:", error)
      process.exit(1)
    })
}
