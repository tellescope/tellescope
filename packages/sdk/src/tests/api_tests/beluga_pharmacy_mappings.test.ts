require('source-map-support').install();

import { Session } from "../../sdk"
import {
  async_test,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"
import { evaluate_conditional_logic } from "@tellescope/utilities"
import { CompoundFilter, BelugaPharmacyMapping } from "@tellescope/types-models"

const host = process.env.API_URL || 'http://localhost:8080' as const

// Helper mimicking resolve_beluga_pharmacy_mapping evaluator
const evaluate_mapping_conditions = (
  conditions: CompoundFilter<string>,
  responses: { externalId?: string, value?: string }[]
) => evaluate_conditional_logic(conditions, (key, value) => {
  const responseValue = responses.find(r => r.externalId === key)?.value

  if (typeof value === 'string') {
    return responseValue === value
  }
  if (typeof value === 'object' && value !== null) {
    const operator = Object.keys(value)[0]
    const operand = Object.values(value)[0]

    if (operator === '$contains') {
      return typeof responseValue === 'string' && responseValue.includes(String(operand))
    }
    if (operator === '$doesNotContain') {
      return typeof responseValue === 'string' && !responseValue.includes(String(operand))
    }
    if (operator === '$exists') {
      return operand ? responseValue !== undefined : responseValue === undefined
    }
    if (operator === '$ne') {
      return responseValue !== String(operand)
    }
  }

  return false
})

// Helper to resolve first matching mapping
const resolve_mapping = (
  mappings: BelugaPharmacyMapping[],
  responses: { externalId?: string, value?: string }[]
): BelugaPharmacyMapping | undefined => {
  for (const mapping of mappings) {
    if (!mapping.conditions) continue
    if (evaluate_mapping_conditions(mapping.conditions, responses)) {
      return mapping
    }
  }
  return undefined
}

export const beluga_pharmacy_mappings_tests = async ({ sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Beluga Pharmacy Mappings Tests")

  // --- 6a. CRUD Tests ---

  let testFormId: string | undefined

  try {
    await async_test(
      "Create form with belugaPharmacyMappings",
      async () => {
        const mappings: BelugaPharmacyMapping[] = [
          {
            pharmacyId: "pharmacy-001",
            patientPreference: JSON.stringify([{ name: "Med A", strength: "10mg", quantity: "30", refills: "3", daysSupply: "30", sig: "Take once daily", dispenseUnit: "Tablet", medId: "med-001" }]),
            conditions: { $and: [{ condition: { "state": "CA" } }, { condition: { "med_type": "weightLoss" } }] },
          },
        ]

        const form = await sdk.api.forms.createOne({
          title: 'Beluga Pharmacy Mappings Test Form',
          belugaPharmacyMappings: mappings,
        })
        testFormId = form.id

        const fetched = await sdk.api.forms.getOne(form.id)
        return (
          fetched.belugaPharmacyMappings?.length === 1
          && fetched.belugaPharmacyMappings[0].pharmacyId === "pharmacy-001"
          && !!fetched.belugaPharmacyMappings[0].conditions?.$and
        )
      },
      { expectedResult: true }
    )

    await async_test(
      "Update belugaPharmacyMappings on existing form",
      async () => {
        if (!testFormId) throw new Error("No test form")

        const updatedMappings: BelugaPharmacyMapping[] = [
          {
            pharmacyId: "pharmacy-002",
            patientPreference: JSON.stringify([{ name: "Med B", strength: "20mg", quantity: "60", refills: "2", daysSupply: "30", sig: "Take twice daily", dispenseUnit: "Capsule", medId: "med-002" }]),
            conditions: { condition: { "state": "NY" } },
          },
          {
            pharmacyId: "pharmacy-003",
            patientPreference: "[]",
            conditions: { $or: [{ condition: { "state": "TX" } }, { condition: { "state": "FL" } }] },
          },
        ]

        await sdk.api.forms.updateOne(testFormId, { belugaPharmacyMappings: updatedMappings }, { replaceObjectFields: true })
        const fetched = await sdk.api.forms.getOne(testFormId)
        return (
          fetched.belugaPharmacyMappings?.length === 2
          && fetched.belugaPharmacyMappings[0].pharmacyId === "pharmacy-002"
          && fetched.belugaPharmacyMappings[1].pharmacyId === "pharmacy-003"
        )
      },
      { expectedResult: true }
    )

    await async_test(
      "Save with nested CompoundFilter structure",
      async () => {
        if (!testFormId) throw new Error("No test form")

        const nestedMappings: BelugaPharmacyMapping[] = [
          {
            pharmacyId: "pharmacy-nested",
            patientPreference: "[]",
            conditions: {
              $and: [
                { $or: [{ condition: { "state": "CA" } }, { condition: { "state": "NY" } }] },
                { condition: { "med_type": "weightLoss" } },
              ]
            },
          },
        ]

        await sdk.api.forms.updateOne(testFormId, { belugaPharmacyMappings: nestedMappings }, { replaceObjectFields: true })
        const fetched = await sdk.api.forms.getOne(testFormId)
        return (
          fetched.belugaPharmacyMappings?.length === 1
          && fetched.belugaPharmacyMappings[0].pharmacyId === "pharmacy-nested"
          && !!fetched.belugaPharmacyMappings[0].conditions?.$and
        )
      },
      { expectedResult: true }
    )

    // --- 6b. Conditional logic evaluation tests ---

    await async_test(
      "Simple equality: condition matches response",
      async () => {
        return evaluate_mapping_conditions(
          { condition: { "state": "CA" } },
          [{ externalId: "state", value: "CA" }]
        )
      },
      { expectedResult: true }
    )

    await async_test(
      "Simple equality miss: condition does not match response",
      async () => {
        return evaluate_mapping_conditions(
          { condition: { "state": "CA" } },
          [{ externalId: "state", value: "NY" }]
        )
      },
      { expectedResult: false }
    )

    await async_test(
      "$and: two conditions, both match",
      async () => {
        return evaluate_mapping_conditions(
          { $and: [{ condition: { "state": "CA" } }, { condition: { "med_type": "weightLoss" } }] },
          [{ externalId: "state", value: "CA" }, { externalId: "med_type", value: "weightLoss" }]
        )
      },
      { expectedResult: true }
    )

    await async_test(
      "$and: two conditions, one misses",
      async () => {
        return evaluate_mapping_conditions(
          { $and: [{ condition: { "state": "CA" } }, { condition: { "med_type": "weightLoss" } }] },
          [{ externalId: "state", value: "CA" }, { externalId: "med_type", value: "skincare" }]
        )
      },
      { expectedResult: false }
    )

    await async_test(
      "$or: two conditions, one matches",
      async () => {
        return evaluate_mapping_conditions(
          { $or: [{ condition: { "state": "CA" } }, { condition: { "state": "NY" } }] },
          [{ externalId: "state", value: "NY" }]
        )
      },
      { expectedResult: true }
    )

    await async_test(
      "$or: two conditions, neither matches",
      async () => {
        return evaluate_mapping_conditions(
          { $or: [{ condition: { "state": "CA" } }, { condition: { "state": "NY" } }] },
          [{ externalId: "state", value: "TX" }]
        )
      },
      { expectedResult: false }
    )

    await async_test(
      "$contains: value includes substring",
      async () => {
        return evaluate_mapping_conditions(
          { condition: { "meds": { $contains: "GLP" } as any } },
          [{ externalId: "meds", value: "GLP-1 agonist" }]
        )
      },
      { expectedResult: true }
    )

    await async_test(
      "$ne: value does not equal",
      async () => {
        return evaluate_mapping_conditions(
          { condition: { "state": { $ne: "CA" } as any } },
          [{ externalId: "state", value: "NY" }]
        )
      },
      { expectedResult: true }
    )

    await async_test(
      "$exists: field present",
      async () => {
        return evaluate_mapping_conditions(
          { condition: { "pharmacyOverride": { $exists: true } as any } },
          [{ externalId: "pharmacyOverride", value: "some-value" }]
        )
      },
      { expectedResult: true }
    )

    await async_test(
      "$exists: field absent",
      async () => {
        return evaluate_mapping_conditions(
          { condition: { "pharmacyOverride": { $exists: true } as any } },
          [{ externalId: "other_field", value: "some-value" }]
        )
      },
      { expectedResult: false }
    )

    await async_test(
      "Nested compound: $and with $or",
      async () => {
        return evaluate_mapping_conditions(
          {
            $and: [
              { $or: [{ condition: { "state": "CA" } }, { condition: { "state": "NY" } }] },
              { condition: { "med_type": "weightLoss" } },
            ]
          },
          [{ externalId: "state", value: "NY" }, { externalId: "med_type", value: "weightLoss" }]
        )
      },
      { expectedResult: true }
    )

    await async_test(
      "First-match-wins: multiple mappings, first matching returned",
      async () => {
        const mappings: BelugaPharmacyMapping[] = [
          {
            pharmacyId: "pharmacy-first",
            patientPreference: "[]",
            conditions: { condition: { "state": "CA" } },
          },
          {
            pharmacyId: "pharmacy-second",
            patientPreference: "[]",
            conditions: { condition: { "state": "CA" } },
          },
        ]

        const result = resolve_mapping(
          mappings,
          [{ externalId: "state", value: "CA" }]
        )
        return result?.pharmacyId === "pharmacy-first"
      },
      { expectedResult: true }
    )

    await async_test(
      "No match: no mappings match, returns undefined",
      async () => {
        const mappings: BelugaPharmacyMapping[] = [
          {
            pharmacyId: "pharmacy-ca",
            patientPreference: "[]",
            conditions: { condition: { "state": "CA" } },
          },
        ]

        const result = resolve_mapping(
          mappings,
          [{ externalId: "state", value: "TX" }]
        )
        return result === undefined
      },
      { expectedResult: true }
    )
  } finally {
    // Cleanup
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
    await beluga_pharmacy_mappings_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("Beluga pharmacy mappings test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Beluga pharmacy mappings test suite failed:", error)
      process.exit(1)
    })
}
