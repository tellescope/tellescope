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

  // Simulate the Beluga RX_WRITTEN webhook with two meds covering category/pharmacyNotes present (typical) and "N/A"/absent
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
        category: 'weightloss1',
        pharmacyNotes: 'Dispense with syringes',
      }, {
        name: 'Metformin',
        strength: '500mg',
        refills: '2',
        quantity: '1',
        medId: 'test-ndc-789',
        rxId: 'test-rx-789',
        category: 'N/A',
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
  const belugaMedSemaglutide = belugaMeds.find(m => m.title === 'Semaglutide')
  const belugaMedMetformin = belugaMeds.find(m => m.title === 'Metformin')
  if (!belugaMedSemaglutide || !belugaMedMetformin) {
    throw new Error(`Beluga RX_WRITTEN - expected medications missing. Got: ${belugaMeds.map(m => m.title).join(', ')}`)
  }
  await async_test(
    "Beluga RX_WRITTEN - Medication has protocol from form belugaVisitType",
    async () => belugaMedSemaglutide,
    { onResult: (m: EnduserMedication) => m?.protocol === 'Weight Loss' && m?.source === 'Beluga' && m?.title === 'Semaglutide' }
  )
  await async_test(
    "Beluga RX_WRITTEN - Medication has category from webhook",
    async () => belugaMedSemaglutide,
    { onResult: (m: EnduserMedication) => m?.category === 'weightloss1' }
  )
  await async_test(
    "Beluga RX_WRITTEN - Medication preserves N/A category verbatim",
    async () => belugaMedMetformin,
    { onResult: (m: EnduserMedication) => m?.category === 'N/A' }
  )
  await async_test(
    "Beluga RX_WRITTEN - Medication has notes from webhook pharmacyNotes",
    async () => belugaMedSemaglutide,
    { onResult: (m: EnduserMedication) => m?.notes === 'Dispense with syringes' }
  )
  await async_test(
    "Beluga RX_WRITTEN - Medication omits notes when pharmacyNotes not provided on med",
    async () => belugaMedMetformin,
    { onResult: (m: EnduserMedication) => m?.notes === undefined || m?.notes === null }
  )

  // Backwards-compatibility: a webhook with no category on any med should result in undefined category
  const belugaFormNoCategory = await sdk.api.forms.createOne({
    title: 'Beluga Protocol Test Form (no category)',
    belugaVisitType: 'Weight Loss',
  })
  const belugaEnduserNoCategory = await sdk.api.endusers.createOne({})
  const belugaFormResponseNoCategory = await sdk.api.form_responses.createOne({
    formId: belugaFormNoCategory.id,
    enduserId: belugaEnduserNoCategory.id,
    formTitle: belugaFormNoCategory.title,
    responses: [{
      fieldId: PLACEHOLDER_ID,
      fieldTitle: 'placeholder',
      answer: { type: 'string', value: 'test' },
    }],
  })

  const webhookResponseNoCategory = await fetch(`${host}/v1/webhooks/beluga`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      masterId: `tellescope_${belugaFormResponseNoCategory.id}`,
      event: 'RX_WRITTEN',
      docName: 'Dr. Test',
      medsPrescribed: [{
        name: 'Ibuprofen',
        strength: '200mg',
        refills: '1',
        quantity: '1',
        medId: 'test-ndc-nocat',
        rxId: 'test-rx-nocat',
      }],
    }),
  })

  if (!webhookResponseNoCategory.ok) {
    throw new Error(`Beluga webhook (no category) failed with status ${webhookResponseNoCategory.status}: ${await webhookResponseNoCategory.text()}`)
  }

  await wait(undefined, 500)

  const belugaMedsNoCategory = await sdk.api.enduser_medications.getSome({ filter: { enduserId: belugaEnduserNoCategory.id } })
  const belugaMedNoCategory = belugaMedsNoCategory[0]
  await async_test(
    "Beluga RX_WRITTEN - Medication omits category when not provided",
    async () => belugaMedNoCategory,
    { onResult: (m: EnduserMedication) => m?.category === undefined || m?.category === null }
  )
  await async_test(
    "Beluga RX_WRITTEN - Medication omits notes when pharmacyNotes not provided",
    async () => belugaMedNoCategory,
    { onResult: (m: EnduserMedication) => m?.notes === undefined || m?.notes === null }
  )

  try {
    // Clean up Beluga test data
    await sdk.api.automation_triggers.deleteOne(belugaTrigger.id)
    await sdk.api.forms.deleteOne(belugaForm.id)
    await sdk.api.forms.deleteOne(belugaFormNoCategory.id)
    await sdk.api.endusers.deleteOne(belugaEnduser.id) // also cleans up form response and medications
    await sdk.api.endusers.deleteOne(belugaEnduserNoCategory.id) // also cleans up form response and medications
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

  // ---- Set Fields with {{medication.category}} Test ----
  log_header("Medication Added - Set Fields with {{medication.category}}")

  const setFieldsCategoryTrigger = await sdk.api.automation_triggers.createOne({
    event: { type: 'Medication Added', info: { titles: [], protocols: [] } },
    action: { type: 'Set Fields', info: { fields: [{ name: 'Medication Category', type: 'Custom Value' as const, value: '{{medication.category}}' }] }},
    status: 'Active',
    title: "Medication - Set Fields medication.category"
  })

  const setFieldsCategoryEnduser = await sdk.api.endusers.createOne({})

  const setFieldsCategoryMed = await sdk.api.enduser_medications.createOne({
    enduserId: setFieldsCategoryEnduser.id,
    title: 'Ozempic 0.5mg',
    category: 'weightloss1',
  })
  await wait(undefined, 500)

  await async_test(
    "Medication Added - Set Fields copies medication.category to enduser field",
    () => sdk.api.endusers.getOne(setFieldsCategoryEnduser.id),
    { onResult: (e: Enduser) => e.fields?.['Medication Category'] === 'weightloss1' }
  )

  // Category absent on medication → placeholder resolves to empty string
  const setFieldsCategoryEnduserEmpty = await sdk.api.endusers.createOne({})
  const setFieldsCategoryMedEmpty = await sdk.api.enduser_medications.createOne({
    enduserId: setFieldsCategoryEnduserEmpty.id,
    title: 'Lisinopril 20mg',
  })
  await wait(undefined, 500)

  await async_test(
    "Medication Added - Set Fields with no category resolves to empty string",
    () => sdk.api.endusers.getOne(setFieldsCategoryEnduserEmpty.id),
    { onResult: (e: Enduser) => e.fields?.['Medication Category'] === '' }
  )

  // ---- Set Fields with {{medication.notes}} Test ----
  log_header("Medication Added - Set Fields with {{medication.notes}}")

  const setFieldsPharmacyNotesTrigger = await sdk.api.automation_triggers.createOne({
    event: { type: 'Medication Added', info: { titles: [], protocols: [] } },
    action: { type: 'Set Fields', info: { fields: [{ name: 'Medication Notes', type: 'Custom Value' as const, value: '{{medication.notes}}' }] }},
    status: 'Active',
    title: "Medication - Set Fields medication.notes"
  })

  const setFieldsPharmacyNotesEnduser = await sdk.api.endusers.createOne({})

  const setFieldsPharmacyNotesMed = await sdk.api.enduser_medications.createOne({
    enduserId: setFieldsPharmacyNotesEnduser.id,
    title: 'Ozempic 1mg',
    notes: 'Dispense with syringes',
  })
  await wait(undefined, 500)

  await async_test(
    "Medication Added - Set Fields copies medication.notes to enduser field",
    () => sdk.api.endusers.getOne(setFieldsPharmacyNotesEnduser.id),
    { onResult: (e: Enduser) => e.fields?.['Medication Notes'] === 'Dispense with syringes' }
  )

  // notes absent on medication → placeholder resolves to empty string
  const setFieldsPharmacyNotesEnduserEmpty = await sdk.api.endusers.createOne({})
  const setFieldsPharmacyNotesMedEmpty = await sdk.api.enduser_medications.createOne({
    enduserId: setFieldsPharmacyNotesEnduserEmpty.id,
    title: 'Lisinopril 40mg',
  })
  await wait(undefined, 500)

  await async_test(
    "Medication Added - Set Fields with no notes resolves to empty string",
    () => sdk.api.endusers.getOne(setFieldsPharmacyNotesEnduserEmpty.id),
    { onResult: (e: Enduser) => e.fields?.['Medication Notes'] === '' }
  )

  try {
    await sdk.api.automation_triggers.deleteOne(setFieldsTrigger.id)
    await sdk.api.automation_triggers.deleteOne(setFieldsTriggerFiltered.id)
    await sdk.api.automation_triggers.deleteOne(setFieldsCategoryTrigger.id)
    await sdk.api.automation_triggers.deleteOne(setFieldsPharmacyNotesTrigger.id)
    await sdk.api.endusers.deleteOne(setFieldsEnduser.id)
    await sdk.api.endusers.deleteOne(setFieldsEnduser2.id)
    await sdk.api.endusers.deleteOne(setFieldsCategoryEnduser.id)
    await sdk.api.endusers.deleteOne(setFieldsCategoryEnduserEmpty.id)
    await sdk.api.endusers.deleteOne(setFieldsPharmacyNotesEnduser.id)
    await sdk.api.endusers.deleteOne(setFieldsPharmacyNotesEnduserEmpty.id)
  } finally {}

  // ---- titleCondition (compound conditional logic on title) ----
  log_header("Medication Added - titleCondition compound logic")

  // C1: simple $contains — fires for medications whose title contains 'GLP' (case-sensitive)
  const c1Trigger = await sdk.api.automation_triggers.createOne({
    event: {
      type: 'Medication Added',
      info: {
        titles: [],
        protocols: [],
        titleCondition: { condition: { title: { $contains: 'GLP' } } },
      },
    },
    action: { type: 'Add Tags', info: { tags: ['Med-Cond-Contains-GLP'] }},
    status: 'Active',
    title: "Medication - titleCondition contains GLP"
  })

  const c1MatchEnduser = await sdk.api.endusers.createOne({})
  await sdk.api.enduser_medications.createOne({ enduserId: c1MatchEnduser.id, title: 'Semaglutide GLP-1' })
  await wait(undefined, 500)
  await async_test(
    "titleCondition $contains - matching medication fires",
    () => sdk.api.endusers.getOne(c1MatchEnduser.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Med-Cond-Contains-GLP') }
  )

  const c1MissEnduser = await sdk.api.endusers.createOne({})
  await sdk.api.enduser_medications.createOne({ enduserId: c1MissEnduser.id, title: 'Aspirin' })
  await wait(undefined, 500)
  await async_test(
    "titleCondition $contains - non-matching medication does NOT fire",
    () => sdk.api.endusers.getOne(c1MissEnduser.id),
    { onResult: (e: Enduser) => !e.tags?.includes('Med-Cond-Contains-GLP') }
  )

  // C2: $ne — fires for everything except 'Placebo'
  const c2Trigger = await sdk.api.automation_triggers.createOne({
    event: {
      type: 'Medication Added',
      info: {
        titles: [],
        protocols: [],
        titleCondition: { condition: { title: { $ne: 'Placebo' } } },
      },
    },
    action: { type: 'Add Tags', info: { tags: ['Med-Cond-Ne-Placebo'] }},
    status: 'Active',
    title: "Medication - titleCondition ne Placebo"
  })

  const c2MatchEnduser = await sdk.api.endusers.createOne({})
  await sdk.api.enduser_medications.createOne({ enduserId: c2MatchEnduser.id, title: 'Metformin' })
  await wait(undefined, 500)
  await async_test(
    "titleCondition $ne - non-Placebo medication fires",
    () => sdk.api.endusers.getOne(c2MatchEnduser.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Med-Cond-Ne-Placebo') }
  )

  const c2MissEnduser = await sdk.api.endusers.createOne({})
  await sdk.api.enduser_medications.createOne({ enduserId: c2MissEnduser.id, title: 'Placebo' })
  await wait(undefined, 500)
  await async_test(
    "titleCondition $ne - Placebo medication does NOT fire",
    () => sdk.api.endusers.getOne(c2MissEnduser.id),
    { onResult: (e: Enduser) => !e.tags?.includes('Med-Cond-Ne-Placebo') }
  )

  // C3: compound $and — contains 'mg' AND does not contain 'Placebo' (case-sensitive)
  const c3Trigger = await sdk.api.automation_triggers.createOne({
    event: {
      type: 'Medication Added',
      info: {
        titles: [],
        protocols: [],
        titleCondition: {
          $and: [
            { condition: { title: { $contains: 'mg' } } },
            { condition: { title: { $doesNotContain: 'Placebo' } } },
          ],
        },
      },
    },
    action: { type: 'Add Tags', info: { tags: ['Med-Cond-And'] }},
    status: 'Active',
    title: "Medication - titleCondition compound AND"
  })

  const c3MatchEnduser = await sdk.api.endusers.createOne({})
  await sdk.api.enduser_medications.createOne({ enduserId: c3MatchEnduser.id, title: 'Lisinopril 10mg' })
  await wait(undefined, 500)
  await async_test(
    "titleCondition $and - both pass fires",
    () => sdk.api.endusers.getOne(c3MatchEnduser.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Med-Cond-And') }
  )

  const c3MissEnduser = await sdk.api.endusers.createOne({})
  await sdk.api.enduser_medications.createOne({ enduserId: c3MissEnduser.id, title: 'Placebo 5mg' })
  await wait(undefined, 500)
  await async_test(
    "titleCondition $and - second branch fails does NOT fire",
    () => sdk.api.endusers.getOne(c3MissEnduser.id),
    { onResult: (e: Enduser) => !e.tags?.includes('Med-Cond-And') }
  )

  // C4: compound $or — equals 'Aspirin' OR contains 'pril'
  const c4Trigger = await sdk.api.automation_triggers.createOne({
    event: {
      type: 'Medication Added',
      info: {
        titles: [],
        protocols: [],
        titleCondition: {
          $or: [
            { condition: { title: 'Aspirin' } },
            { condition: { title: { $contains: 'pril' } } },
          ],
        },
      },
    },
    action: { type: 'Add Tags', info: { tags: ['Med-Cond-Or'] }},
    status: 'Active',
    title: "Medication - titleCondition compound OR"
  })

  const c4MatchA = await sdk.api.endusers.createOne({})
  await sdk.api.enduser_medications.createOne({ enduserId: c4MatchA.id, title: 'Aspirin' })
  await wait(undefined, 500)
  await async_test(
    "titleCondition $or - first branch matches fires",
    () => sdk.api.endusers.getOne(c4MatchA.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Med-Cond-Or') }
  )

  const c4MatchB = await sdk.api.endusers.createOne({})
  await sdk.api.enduser_medications.createOne({ enduserId: c4MatchB.id, title: 'Lisinopril' })
  await wait(undefined, 500)
  await async_test(
    "titleCondition $or - second branch matches fires",
    () => sdk.api.endusers.getOne(c4MatchB.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Med-Cond-Or') }
  )

  const c4Miss = await sdk.api.endusers.createOne({})
  await sdk.api.enduser_medications.createOne({ enduserId: c4Miss.id, title: 'Metformin' })
  await wait(undefined, 500)
  await async_test(
    "titleCondition $or - neither branch matches does NOT fire",
    () => sdk.api.endusers.getOne(c4Miss.id),
    { onResult: (e: Enduser) => !e.tags?.includes('Med-Cond-Or') }
  )

  // C5: backwards compatibility — no titleCondition, titles array still works
  const c5Trigger = await sdk.api.automation_triggers.createOne({
    event: { type: 'Medication Added', info: { titles: ['Atorvastatin'], protocols: [] } },
    action: { type: 'Add Tags', info: { tags: ['Med-Cond-BackCompat'] }},
    status: 'Active',
    title: "Medication - titles array back-compat"
  })

  const c5Match = await sdk.api.endusers.createOne({})
  await sdk.api.enduser_medications.createOne({ enduserId: c5Match.id, title: 'Atorvastatin' })
  await wait(undefined, 500)
  await async_test(
    "titles back-compat - title match still fires without titleCondition",
    () => sdk.api.endusers.getOne(c5Match.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Med-Cond-BackCompat') }
  )

  const c5Miss = await sdk.api.endusers.createOne({})
  await sdk.api.enduser_medications.createOne({ enduserId: c5Miss.id, title: 'Aspirin' })
  await wait(undefined, 500)
  await async_test(
    "titles back-compat - non-match does NOT fire without titleCondition",
    () => sdk.api.endusers.getOne(c5Miss.id),
    { onResult: (e: Enduser) => !e.tags?.includes('Med-Cond-BackCompat') }
  )

  // C6: combined — titles array AND titleCondition compose (both must pass)
  const c6Trigger = await sdk.api.automation_triggers.createOne({
    event: {
      type: 'Medication Added',
      info: {
        titles: ['Lisinopril'],
        protocols: [],
        titleCondition: { condition: { title: { $contains: 'Lisin' } } },
      },
    },
    action: { type: 'Add Tags', info: { tags: ['Med-Cond-Combined'] }},
    status: 'Active',
    title: "Medication - titles + titleCondition combined"
  })

  const c6Match = await sdk.api.endusers.createOne({})
  await sdk.api.enduser_medications.createOne({ enduserId: c6Match.id, title: 'Lisinopril' })
  await wait(undefined, 500)
  await async_test(
    "titleCondition combined - both pass fires",
    () => sdk.api.endusers.getOne(c6Match.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Med-Cond-Combined') }
  )

  try {
    await sdk.api.automation_triggers.deleteOne(c1Trigger.id)
    await sdk.api.automation_triggers.deleteOne(c2Trigger.id)
    await sdk.api.automation_triggers.deleteOne(c3Trigger.id)
    await sdk.api.automation_triggers.deleteOne(c4Trigger.id)
    await sdk.api.automation_triggers.deleteOne(c5Trigger.id)
    await sdk.api.automation_triggers.deleteOne(c6Trigger.id)
    await sdk.api.endusers.deleteOne(c1MatchEnduser.id)
    await sdk.api.endusers.deleteOne(c1MissEnduser.id)
    await sdk.api.endusers.deleteOne(c2MatchEnduser.id)
    await sdk.api.endusers.deleteOne(c2MissEnduser.id)
    await sdk.api.endusers.deleteOne(c3MatchEnduser.id)
    await sdk.api.endusers.deleteOne(c3MissEnduser.id)
    await sdk.api.endusers.deleteOne(c4MatchA.id)
    await sdk.api.endusers.deleteOne(c4MatchB.id)
    await sdk.api.endusers.deleteOne(c4Miss.id)
    await sdk.api.endusers.deleteOne(c5Match.id)
    await sdk.api.endusers.deleteOne(c5Miss.id)
    await sdk.api.endusers.deleteOne(c6Match.id)
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
