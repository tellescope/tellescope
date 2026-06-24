require('source-map-support').install();

import { Session } from "../../sdk"
import {
  async_test,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"
import { evaluate_conditional_logic, evaluate_string_field_comparison } from "@tellescope/utilities"
import { CompoundFilter } from "@tellescope/types-models"

const host = process.env.API_URL || 'http://localhost:8080' as const

type MDIOffering = { offering_id: string, conditions?: CompoundFilter<string> }

// Local replica of the API's resolve_case_offerings (md_integrations.ts), built
// from the same shared @tellescope/utilities helpers it uses, so we can assert
// the resolution behavior from the SDK test harness.
const is_empty_conditions = (conditions: CompoundFilter<string>): boolean => {
  if (!conditions || !Object.keys(conditions).length) return true
  const condition = (conditions as { condition?: Record<string, unknown> }).condition
  if (condition !== undefined) return !Object.keys(condition).length
  return false
}

const resolve_case_offerings = (
  offerings: MDIOffering[],
  responses: { externalId?: string, value?: string }[],
): MDIOffering[] => (
  offerings.filter(o => {
    if (!o.conditions || is_empty_conditions(o.conditions)) return true
    return evaluate_conditional_logic(o.conditions, (key, value) =>
      evaluate_string_field_comparison(responses.find(r => r.externalId === key)?.value, value)
    )
  })
)

// Local replicas of the API's patient-mapping helpers (md_integrations.ts).
// SDK tests cannot import the private API package, so we mirror the conversion
// helpers + exclusion set here to assert the same behavior.
type GenericQuantityWithUnit = { value: number | string, unit: string }

const to_number = (v: unknown): number | undefined => {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? ''))
  return Number.isFinite(n) ? n : undefined
}
const enduser_height_to_cm = (h?: GenericQuantityWithUnit): number | undefined => {
  const inches = to_number(h?.value); if (inches === undefined) return undefined
  return Math.round(inches * 2.54)
}
const enduser_weight_to_kg = (w?: GenericQuantityWithUnit): number | undefined => {
  const lbs = to_number(w?.value); if (lbs === undefined) return undefined
  return Math.round(lbs * 0.45359237 * 100) / 100
}

const PATIENT_MAPPED_EXTERNAL_IDS = new Set([
  'fname', 'first_name', 'lname', 'last_name',
  'email', 'dateOfBirth', 'gender', 'phone', 'address',
  'height', 'weight',
  'allergies', 'current_medications', 'medical_conditions', 'special_necessities', 'pregnancy',
  'intro_video_id',
])

// Mirrors the externalId exclusion step in form_response_to_case_questions:
// patient-mapped fields are dropped, everything else survives.
const case_question_external_ids = (responses: { externalId?: string }[]): string[] => (
  responses
    .filter(r => !(r.externalId && PATIENT_MAPPED_EXTERNAL_IDS.has(r.externalId)))
    .map(r => r.externalId)
    .filter((id): id is string => id !== undefined)
)

// Local replica of form_response_to_case_questions' displayed_options logic
// (md_integrations.ts). SDK tests cannot import the private API package, so we
// mirror the field lookup (_id first, externalId fallback) + the multiple_choice
// / Dropdown gate, and assert displayed_options is populated only when applicable.
type ReplicaField = { _id: string, externalId?: string, options?: { choices?: string[] } }
type ReplicaResponse = { fieldId?: string, externalId?: string, answer: { type?: string } }

const resolve_displayed_options = (
  response: ReplicaResponse,
  formFields: ReplicaField[] = [],
): string[] | undefined => {
  const field = (
       formFields.find(f => f._id.toString() === response.fieldId)
    || formFields.find(f => response.externalId && f.externalId === response.externalId)
  )
  return (
    (response.answer.type === 'multiple_choice' || response.answer.type === 'Dropdown')
    && field?.options?.choices?.length
  ) ? field.options.choices : undefined
}

export const mdi_case_offerings_tests = async ({ sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("MDI Case Offerings Tests")

  let testFormId: string | undefined

  try {
    // --- Schema round-trip tests ---

    await async_test(
      "Create form with mdiCaseOfferings mixing unconditional and conditional entries",
      async () => {
        const offerings: MDIOffering[] = [
          { offering_id: "offering-always" }, // unconditional
          { offering_id: "offering-ca", conditions: { condition: { state: "CA" } } },
          {
            offering_id: "offering-ca-glp",
            conditions: { $and: [{ condition: { state: "CA" } }, { condition: { med_type: "weightLoss" } }] },
          },
        ]

        const form = await sdk.api.forms.createOne({
          title: 'MDI Case Offerings Test Form',
          mdiCaseOfferings: offerings,
        })
        testFormId = form.id

        const fetched = await sdk.api.forms.getOne(form.id)
        return (
          fetched.mdiCaseOfferings?.length === 3
          && fetched.mdiCaseOfferings[0].offering_id === "offering-always"
          && fetched.mdiCaseOfferings[0].conditions === undefined
          && !!fetched.mdiCaseOfferings[1].conditions?.condition
          && !!fetched.mdiCaseOfferings[2].conditions?.$and
        )
      },
      { expectedResult: true }
    )

    await async_test(
      "Backwards-compat: existing flat { offering_id } config still validates",
      async () => {
        if (!testFormId) throw new Error("No test form")

        // mirrors a pre-existing config with no conditions
        const flat: MDIOffering[] = [
          { offering_id: "legacy-1" },
          { offering_id: "legacy-2" },
        ]
        await sdk.api.forms.updateOne(testFormId, { mdiCaseOfferings: flat }, { replaceObjectFields: true })
        const fetched = await sdk.api.forms.getOne(testFormId)
        return (
          fetched.mdiCaseOfferings?.length === 2
          && fetched.mdiCaseOfferings.every(o => o.conditions === undefined)
        )
      },
      { expectedResult: true }
    )

    await async_test(
      "Save nested CompoundFilter conditions on an offering and read back",
      async () => {
        if (!testFormId) throw new Error("No test form")

        const nested: MDIOffering[] = [
          {
            offering_id: "offering-nested",
            conditions: {
              $and: [
                { $or: [{ condition: { state: "CA" } }, { condition: { state: "NY" } }] },
                { condition: { med_type: "weightLoss" } },
              ],
            },
          },
        ]
        await sdk.api.forms.updateOne(testFormId, { mdiCaseOfferings: nested }, { replaceObjectFields: true })
        const fetched = await sdk.api.forms.getOne(testFormId)
        return (
          fetched.mdiCaseOfferings?.length === 1
          && !!fetched.mdiCaseOfferings[0].conditions?.$and
        )
      },
      { expectedResult: true }
    )

    // --- resolve_case_offerings behavior tests ---

    const MIXED: MDIOffering[] = [
      { offering_id: "always" }, // unconditional → always sent
      { offering_id: "ca-only", conditions: { condition: { state: "CA" } } },
      { offering_id: "ny-only", conditions: { condition: { state: "NY" } } },
    ]

    await async_test(
      "Resolver returns exactly the matching subset plus unconditional offerings",
      async () => {
        const resolved = resolve_case_offerings(MIXED, [{ externalId: "state", value: "CA" }])
        return (
          resolved.length === 2
          && resolved.some(o => o.offering_id === "always")
          && resolved.some(o => o.offering_id === "ca-only")
          && !resolved.some(o => o.offering_id === "ny-only")
        )
      },
      { expectedResult: true }
    )

    await async_test(
      "Send none: when conditions match nothing, only unconditional offerings remain",
      async () => {
        // a config where every offering carries a condition that fails
        const allConditional: MDIOffering[] = [
          { offering_id: "ca-only", conditions: { condition: { state: "CA" } } },
          { offering_id: "ny-only", conditions: { condition: { state: "NY" } } },
        ]
        const resolved = resolve_case_offerings(allConditional, [{ externalId: "state", value: "TX" }])
        return resolved.length === 0
      },
      { expectedResult: true }
    )

    await async_test(
      "Backwards compat: all-unconditional config sends everything",
      async () => {
        const allUnconditional: MDIOffering[] = [
          { offering_id: "a" },
          { offering_id: "b" },
          { offering_id: "c" },
        ]
        const resolved = resolve_case_offerings(allUnconditional, [{ externalId: "state", value: "TX" }])
        return resolved.length === 3
      },
      { expectedResult: true }
    )

    await async_test(
      "Empty/blank conditions object is treated as unconditional (always sent)",
      async () => {
        const withBlank: MDIOffering[] = [
          { offering_id: "blank", conditions: { condition: {} } },
        ]
        // even with no matching response, the blank-condition offering is sent
        const resolved = resolve_case_offerings(withBlank, [])
        return resolved.length === 1 && resolved[0].offering_id === "blank"
      },
      { expectedResult: true }
    )

    await async_test(
      "$or conditions: offering sent when any branch matches",
      async () => {
        const offerings: MDIOffering[] = [
          { offering_id: "ca-or-ny", conditions: { $or: [{ condition: { state: "CA" } }, { condition: { state: "NY" } }] } },
        ]
        const resolved = resolve_case_offerings(offerings, [{ externalId: "state", value: "NY" }])
        return resolved.length === 1
      },
      { expectedResult: true }
    )

    await async_test(
      "$contains operator narrows offerings by substring match",
      async () => {
        const offerings: MDIOffering[] = [
          { offering_id: "glp", conditions: { condition: { meds: { $contains: "GLP" } as any } } },
        ]
        const matches = resolve_case_offerings(offerings, [{ externalId: "meds", value: "GLP-1 agonist" }])
        const misses = resolve_case_offerings(offerings, [{ externalId: "meds", value: "Semaglutide" }])
        return matches.length === 1 && misses.length === 0
      },
      { expectedResult: true }
    )

    // --- height/weight conversion tests ---

    await async_test(
      "enduser_height_to_cm converts Inches → integer centimeters",
      async () => (
        enduser_height_to_cm({ value: 70, unit: 'Inches' }) === 178
        && enduser_height_to_cm({ value: '70', unit: 'Inches' }) === 178 // string value parsed
        && enduser_height_to_cm(undefined) === undefined // absent → omitted
        && enduser_height_to_cm({ value: '', unit: 'Inches' }) === undefined
      ),
      { expectedResult: true }
    )

    await async_test(
      "enduser_weight_to_kg converts Pounds → kilograms (float, 2dp)",
      async () => (
        enduser_weight_to_kg({ value: 200, unit: 'Pounds' }) === 90.72
        && enduser_weight_to_kg({ value: '200', unit: 'Pounds' }) === 90.72 // string value parsed
        && enduser_weight_to_kg(undefined) === undefined // absent → omitted
        && enduser_weight_to_kg({ value: 'not-a-number', unit: 'Pounds' }) === undefined
      ),
      { expectedResult: true }
    )

    // --- case_questions exclusion tests ---

    await async_test(
      "case_questions exclude patient-mapped fields but keep non-mapped clinical answers",
      async () => {
        const responses = [
          { externalId: 'fname' },
          { externalId: 'email' },
          { externalId: 'dateOfBirth' },
          { externalId: 'gender' },
          { externalId: 'phone' },
          { externalId: 'address' },
          { externalId: 'height' },
          { externalId: 'weight' },
          { externalId: 'allergies' },
          { externalId: 'special_necessities' },
          { externalId: 'symptoms' }, // non-mapped clinical field → survives
          { externalId: 'duration' }, // non-mapped clinical field → survives
        ]
        const kept = case_question_external_ids(responses)
        const excluded = ['fname', 'email', 'dateOfBirth', 'gender', 'phone', 'address', 'height', 'weight', 'allergies', 'special_necessities']
        return (
          kept.length === 2
          && kept.includes('symptoms')
          && kept.includes('duration')
          && excluded.every(id => !kept.includes(id))
        )
      },
      { expectedResult: true }
    )

    // --- displayed_options tests ---

    await async_test(
      "multiple_choice response + matching field by _id → displayed_options equals field choices",
      async () => {
        const fields: ReplicaField[] = [
          { _id: 'field-1', options: { choices: ['Yes', 'No', 'Maybe'] } },
        ]
        const response: ReplicaResponse = { fieldId: 'field-1', answer: { type: 'multiple_choice' } }
        const opts = resolve_displayed_options(response, fields)
        return (
          !!opts
          && opts.length === 3
          && opts[0] === 'Yes' && opts[1] === 'No' && opts[2] === 'Maybe'
        )
      },
      { expectedResult: true }
    )

    await async_test(
      "Dropdown response + matching field by externalId → displayed_options equals field choices",
      async () => {
        const fields: ReplicaField[] = [
          { _id: 'field-2', externalId: 'state', options: { choices: ['CA', 'NY', 'TX'] } },
        ]
        // fieldId does not match any field; externalId fallback resolves the field
        const response: ReplicaResponse = { fieldId: '', externalId: 'state', answer: { type: 'Dropdown' } }
        const opts = resolve_displayed_options(response, fields)
        return !!opts && opts.length === 3 && opts.join(',') === 'CA,NY,TX'
      },
      { expectedResult: true }
    )

    await async_test(
      "string/number response → displayed_options undefined even with field choices present",
      async () => {
        const fields: ReplicaField[] = [
          { _id: 'field-3', options: { choices: ['Yes', 'No'] } },
        ]
        const stringResponse: ReplicaResponse = { fieldId: 'field-3', answer: { type: 'string' } }
        const numberResponse: ReplicaResponse = { fieldId: 'field-3', answer: { type: 'number' } }
        return (
          resolve_displayed_options(stringResponse, fields) === undefined
          && resolve_displayed_options(numberResponse, fields) === undefined
        )
      },
      { expectedResult: true }
    )

    await async_test(
      "multiple_choice response with no matching field → displayed_options undefined (question still kept)",
      async () => {
        const fields: ReplicaField[] = [
          { _id: 'field-4', externalId: 'other', options: { choices: ['A', 'B'] } },
        ]
        // neither fieldId nor externalId matches any field
        const noMatch: ReplicaResponse = { fieldId: 'field-unknown', externalId: 'unknown', answer: { type: 'multiple_choice' } }
        // matching field but empty choices → also undefined
        const emptyChoices: ReplicaResponse = { fieldId: 'field-5', answer: { type: 'multiple_choice' } }
        const fieldsEmpty: ReplicaField[] = [{ _id: 'field-5', options: { choices: [] } }]
        return (
          resolve_displayed_options(noMatch, fields) === undefined
          && resolve_displayed_options(emptyChoices, fieldsEmpty) === undefined
        )
      },
      { expectedResult: true }
    )
  } finally {
    if (testFormId) {
      await sdk.api.forms.deleteOne(testFormId).catch(console.error)
    }
  }
}

if (require.main === module) {
  console.log(`Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await mdi_case_offerings_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("MDI case offerings test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("MDI case offerings test suite failed:", error)
      process.exit(1)
    })
}
