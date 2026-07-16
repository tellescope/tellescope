require('source-map-support').install();

import { Session, EnduserSession } from "../../sdk"
import {
  async_test,
  log_header,
} from "@tellescope/testing"
import { ObservationComponent } from "@tellescope/types-models"
import { authenticate_enduser_via_token, setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const
const businessId = '60398b1131a295e64f084ff6'

const ENDUSER_PASSWORD = 'NutritionTestPassword!123'

const NUTRITION_TARGETS = {
  dailyCalorieTarget: 2200,
  dailyProteinTarget: 150,
  dailyCarbTarget: 250,
  dailyFatTarget: 70,
  dailyFiberTarget: 30,
  dailyWaterTarget: 2500,
}

const MACRO_COMPONENTS: ObservationComponent[] = [
  { code: { text: 'Calories' }, valueQuantity: { value: 450, unit: 'kcal' } },
  { code: { text: 'Protein' }, valueQuantity: { value: 42, unit: 'g' } },
  { code: { text: 'Carbohydrates' }, valueQuantity: { value: 30, unit: 'g' } },
  { code: { text: 'Fat' }, valueQuantity: { value: 18, unit: 'g' } },
  {
    code: {
      text: 'Cheddar cheese',
      coding: [{ system: 'https://fdc.nal.usda.gov', code: '328637', display: 'Cheese, cheddar' }],
    },
    valueQuantity: { value: 100, unit: 'g' },
  },
]

const USDA_NOT_CONFIGURED_MESSAGE = 'USDA food search is not configured'

// contract shape returned by the USDA proxy — nothing else may leak through
const EXPECTED_FOOD_KEYS = ['fdcId', 'description', 'calories', 'protein', 'carbs', 'fat', 'fiber']
const MACRO_KEYS = ['calories', 'protein', 'carbs', 'fat', 'fiber'] as const

const is_valid_food_summary = (f: any) => (
  typeof f?.fdcId === 'number' && Number.isInteger(f.fdcId) && f.fdcId > 0
  && typeof f?.description === 'string' && f.description.length > 0
  && Object.keys(f).every(k => EXPECTED_FOOD_KEYS.includes(k))
  && MACRO_KEYS.every(m => f[m] === undefined || (typeof f[m] === 'number' && isFinite(f[m]) && f[m] >= 0))
)

// values are per 100g: grams of a macro can't exceed 100, energy tops out near pure fat (~900 kcal)
const is_plausible_per_100g = (f: any) => (
  (f.calories === undefined || f.calories <= 950)
  && (['protein', 'carbs', 'fat', 'fiber'] as const).every(m => f[m] === undefined || f[m] <= 100)
)

// same food fetched via different USDA response shapes should yield the same numbers
const approx_equal = (a?: number, b?: number) => (
  (a === undefined && b === undefined)
  || (typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) <= Math.max(1, 0.1 * Math.max(a, b)))
)

const usda_proxy_tests = async ({ sdk, enduserSDK }: { sdk: Session, enduserSDK: EnduserSession }) => {
  log_header("USDA Food Search Proxy")

  // The USDA key lives in the server's zz_secrets - not visible to this process.
  // Skip-detection is behavioral: attempt the search, skip on "not configured".
  let searchResult: { data: any }
  try {
    searchResult = await enduserSDK.api.integrations.proxy_read({
      integration: 'USDA',
      type: 'search',
      query: JSON.stringify({ keywords: 'cheddar cheese' }),
    })
  } catch (err: any) {
    if (err?.message?.includes?.(USDA_NOT_CONFIGURED_MESSAGE)) {
      console.log("⏭️  Skipping USDA proxy tests (no { type: 'usda' } zz_secrets doc configured)")
      return
    }
    throw err
  }

  await async_test(
    'USDA search (enduser): non-empty foods with fdcId/description, totalHits > 0',
    async () => searchResult,
    { onResult: (r: any) => (
      Array.isArray(r?.data?.foods)
      && r.data.foods.length > 0
      && r.data.foods.every((f: any) => typeof f.fdcId === 'number' && typeof f.description === 'string')
      && r.data.foods.every((f: any) => (
        ['calories', 'protein', 'carbs', 'fat', 'fiber'] as const
      ).every(macro => f[macro] === undefined || typeof f[macro] === 'number'))
      && r.data.totalHits > 0
    ) },
  )

  const firstFood = searchResult.data.foods[0]
  await async_test(
    'USDA food detail (enduser): matching single food by fdcId',
    () => enduserSDK.api.integrations.proxy_read({
      integration: 'USDA',
      type: 'food',
      id: String(firstFood.fdcId),
    }),
    { onResult: (r: any) => (
      r?.data?.fdcId === firstFood.fdcId
      && typeof r.data.description === 'string'
    ) },
  )

  await async_test(
    'USDA search (staff session) also succeeds',
    () => sdk.api.integrations.proxy_read({
      integration: 'USDA',
      type: 'search',
      query: JSON.stringify({ keywords: 'cheddar cheese' }),
    }),
    { onResult: (r: any) => Array.isArray(r?.data?.foods) && r.data.foods.length > 0 },
  )

  await async_test(
    'USDA search: missing keywords rejected',
    () => enduserSDK.api.integrations.proxy_read({
      integration: 'USDA',
      type: 'search',
      query: JSON.stringify({}),
    }),
    { shouldError: true, onError: () => true },
  )
  await async_test(
    'USDA search: 1-char keywords rejected',
    () => enduserSDK.api.integrations.proxy_read({
      integration: 'USDA',
      type: 'search',
      query: JSON.stringify({ keywords: 'c' }),
    }),
    { shouldError: true, onError: () => true },
  )

  // ---- rigorous output-format validation ----
  await async_test(
    'USDA format: every search result matches the contract shape exactly (no extra fields)',
    async () => searchResult,
    { onResult: (r: any) => r.data.foods.every((f: any) => is_valid_food_summary(f) && is_plausible_per_100g(f)) },
  )
  await async_test(
    'USDA format: no api_key or raw USDA payload fields leak into the response',
    async () => searchResult,
    { onResult: (r: any) => {
      const serialized = JSON.stringify(r.data)
      return !serialized.includes('api_key') && !serialized.includes('foodNutrients') && !serialized.includes('nutrientNumber')
    } },
  )

  // extraction must actually populate macros across the result set (catches a broken
  // nutrient-number mapping, which the undefined-tolerant shape checks above would miss)
  await async_test(
    'USDA format: macro extraction populated for nearly all results',
    async () => searchResult,
    { onResult: (r: any) => {
      const foods = r.data.foods
      const fullyPopulated = foods.filter((f: any) => MACRO_KEYS.every(m => typeof f[m] === 'number'))
      return foods.length > 0 && fullyPopulated.length >= foods.length * 0.8
    } },
  )

  // at least one result must match full-fat cheddar's real per-100g profile
  // (search includes reduced-fat branded variants, so assert existence rather than checking an arbitrary pick)
  const fullFatCheddar = searchResult.data.foods.find((f: any) => (
    f.description?.toLowerCase().includes('cheddar')
    && f.calories >= 300 && f.calories <= 500
    && f.protein >= 15 && f.protein <= 35
    && f.fat >= 25 && f.fat <= 45
    && f.carbs >= 0 && f.carbs <= 15
    && (f.fiber === undefined || (f.fiber >= 0 && f.fiber <= 5))
  ))
  await async_test(
    'USDA format: a result matches full-fat cheddar\'s realistic per-100g values',
    async () => fullFatCheddar,
    { onResult: (f: any) => !!f },
  )
  await async_test(
    'USDA format: food detail (abridged shape) yields same values as search (search shape) for same fdcId',
    () => enduserSDK.api.integrations.proxy_read({
      integration: 'USDA',
      type: 'food',
      id: String(fullFatCheddar?.fdcId),
    }),
    { onResult: (r: any) => (
      is_valid_food_summary(r?.data)
      && r.data.fdcId === fullFatCheddar?.fdcId
      && MACRO_KEYS.every(m => approx_equal(r.data[m], fullFatCheddar?.[m]))
    ) },
  )

  await async_test(
    'USDA format: pageSize honored (5 -> exactly 5 valid foods)',
    () => enduserSDK.api.integrations.proxy_read({
      integration: 'USDA',
      type: 'search',
      query: JSON.stringify({ keywords: 'apple', pageSize: 5 }),
    }),
    { onResult: (r: any) => (
      r?.data?.foods?.length === 5
      && r.data.totalHits >= 5
      && r.data.foods.every((f: any) => is_valid_food_summary(f) && is_plausible_per_100g(f))
    ) },
  )
  await async_test(
    'USDA format: oversized pageSize clamped to at most 50',
    () => enduserSDK.api.integrations.proxy_read({
      integration: 'USDA',
      type: 'search',
      query: JSON.stringify({ keywords: 'banana', pageSize: 10000 }),
    }),
    { onResult: (r: any) => r?.data?.foods?.length > 0 && r.data.foods.length <= 50 },
  )
  await async_test(
    'USDA format: non-numeric food id rejected',
    () => enduserSDK.api.integrations.proxy_read({
      integration: 'USDA',
      type: 'food',
      id: '../foods/search',
    }),
    { shouldError: true, onError: () => true },
  )
}

export const nutrition_tracking_tests = async ({ sdk } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Nutrition Tracking (weight & macro backend support)")

  let enduserAId: string | undefined
  let enduserBId: string | undefined

  try {
    // Setup: throwaway endusers with portal credentials
    const ts = Date.now()
    const enduserAEmail = `nutrition-a-${ts}@test.tellescope.com`
    const enduserBEmail = `nutrition-b-${ts}@test.tellescope.com`

    const enduserA = await sdk.api.endusers.createOne({ email: enduserAEmail, fname: 'Nutrition', lname: 'TesterA' })
    enduserAId = enduserA.id
    await sdk.api.endusers.set_password({ id: enduserA.id, password: ENDUSER_PASSWORD })

    const enduserB = await sdk.api.endusers.createOne({ email: enduserBEmail, fname: 'Nutrition', lname: 'TesterB' })
    enduserBId = enduserB.id
    await sdk.api.endusers.set_password({ id: enduserB.id, password: ENDUSER_PASSWORD })

    const enduserSDK = new EnduserSession({ host, businessId })
    await authenticate_enduser_via_token(sdk, enduserSDK, { email: enduserAEmail })

    const enduserSDKB = new EnduserSession({ host, businessId })
    await authenticate_enduser_via_token(sdk, enduserSDKB, { email: enduserBEmail })

    // ---- Requirement 3: daily nutrition targets (enduser-readable and -writable) ----
    await async_test(
      'targets: enduser sets all six daily nutrition targets on own record',
      () => enduserSDK.api.endusers.updateOne(enduserA.id, { ...NUTRITION_TARGETS }),
      { onResult: e => Object.entries(NUTRITION_TARGETS).every(([field, value]) => (e as any)[field] === value) },
    )
    await async_test(
      'targets: enduser reads all six targets back (no redaction)',
      () => enduserSDK.api.endusers.getOne(enduserA.id),
      { onResult: e => Object.entries(NUTRITION_TARGETS).every(([field, value]) => (e as any)[field] === value) },
    )
    await async_test(
      'targets: staff can read targets',
      () => sdk.api.endusers.getOne(enduserA.id),
      { onResult: e => Object.entries(NUTRITION_TARGETS).every(([field, value]) => (e as any)[field] === value) },
    )
    await async_test(
      'targets: staff can write targets',
      () => sdk.api.endusers.updateOne(enduserA.id, { dailyCalorieTarget: 2000, dailyWaterTarget: 3000 }),
      { onResult: e => e.dailyCalorieTarget === 2000 && e.dailyWaterTarget === 3000 },
    )
    await async_test(
      'targets: negative values rejected',
      () => enduserSDK.api.endusers.updateOne(enduserA.id, { dailyProteinTarget: -10 }),
      { shouldError: true, onError: () => true },
    )

    // ---- Requirement 2: EnduserObservation.components round-trip ----
    const withComponents = await enduserSDK.api.enduser_observations.createOne({
      enduserId: enduserA.id,
      status: 'final',
      category: 'vital-signs',
      type: 'food',
      measurement: { value: 450, unit: 'kcal' },
      components: MACRO_COMPONENTS,
    })
    await async_test(
      'components: enduser round-trips observation with macros + coded food item',
      () => enduserSDK.api.enduser_observations.getOne(withComponents.id),
      { onResult: o => (
        o.components?.length === MACRO_COMPONENTS.length
        && o.components[1].code.text === 'Protein'
        && o.components[1].valueQuantity.value === 42
        && o.components[1].valueQuantity.unit === 'g'
        && o.components[4].code.coding?.[0]?.system === 'https://fdc.nal.usda.gov'
        && o.components[4].code.coding?.[0]?.code === '328637'
        && o.components[4].code.coding?.[0]?.display === 'Cheese, cheddar'
        && o.measurement.value === 450
      ) },
    )

    const withoutComponents = await enduserSDK.api.enduser_observations.createOne({
      enduserId: enduserA.id,
      status: 'final',
      category: 'vital-signs',
      type: 'weight',
      measurement: { value: 180, unit: 'lbs' },
    })
    await async_test(
      'components: observation without components still works (back-compat)',
      () => enduserSDK.api.enduser_observations.getOne(withoutComponents.id),
      { onResult: o => o.components === undefined && o.measurement.value === 180 },
    )

    // ---- Requirement 4: creatorOnly update/delete ----
    await async_test(
      'creatorOnly: enduser updates own observation',
      () => enduserSDK.api.enduser_observations.updateOne(withoutComponents.id, { measurement: { value: 178, unit: 'lbs' } }),
      { onResult: o => o.measurement.value === 178 },
    )
    await async_test(
      'creatorOnly: enduser deletes own observation',
      () => enduserSDK.api.enduser_observations.deleteOne(withoutComponents.id),
      { shouldError: false, onResult: () => true },
    )

    // Negative: staff-created observation for the enduser remains locked
    const staffCreated = await sdk.api.enduser_observations.createOne({
      enduserId: enduserA.id,
      status: 'final',
      category: 'vital-signs',
      type: 'weight',
      measurement: { value: 182, unit: 'lbs' },
    })
    await async_test(
      'creatorOnly: enduser cannot update staff-created observation',
      () => enduserSDK.api.enduser_observations.updateOne(staffCreated.id, { measurement: { value: 1, unit: 'lbs' } }),
      { shouldError: true, onError: () => true },
    )
    await async_test(
      'creatorOnly: enduser cannot delete staff-created observation',
      () => enduserSDK.api.enduser_observations.deleteOne(staffCreated.id),
      { shouldError: true, onError: () => true },
    )
    await async_test(
      'creatorOnly: enduser can still read staff-created observation',
      () => enduserSDK.api.enduser_observations.getOne(staffCreated.id),
      { onResult: o => o.id === staffCreated.id && o.measurement.value === 182 },
    )

    // Staff sessions unaffected by creatorOnly (applies to enduser sessions only)
    await async_test(
      'staff unchanged: staff updates enduser-created observation',
      () => sdk.api.enduser_observations.updateOne(withComponents.id, { measurement: { value: 500, unit: 'kcal' } }),
      { onResult: o => o.measurement.value === 500 },
    )
    await async_test(
      'staff unchanged: staff deletes enduser-created observation',
      () => sdk.api.enduser_observations.deleteOne(withComponents.id),
      { shouldError: false, onResult: () => true },
    )

    // Cross-enduser: B cannot update/delete A's observation
    const enduserACreated = await enduserSDK.api.enduser_observations.createOne({
      enduserId: enduserA.id,
      status: 'final',
      category: 'vital-signs',
      type: 'weight',
      measurement: { value: 179, unit: 'lbs' },
    })
    await async_test(
      "cross-enduser: enduser B cannot update enduser A's observation",
      () => enduserSDKB.api.enduser_observations.updateOne(enduserACreated.id, { measurement: { value: 1, unit: 'lbs' } }),
      { shouldError: true, onError: () => true },
    )
    await async_test(
      "cross-enduser: enduser B cannot delete enduser A's observation",
      () => enduserSDKB.api.enduser_observations.deleteOne(enduserACreated.id),
      { shouldError: true, onError: () => true },
    )
    await async_test(
      "cross-enduser: enduser A's observation still exists (admin verify)",
      () => sdk.api.enduser_observations.getOne(enduserACreated.id),
      { onResult: o => o.id === enduserACreated.id && o.measurement.value === 179 },
    )

    // ---- Requirement 1: USDA food search proxy (behavioral skip when not configured) ----
    await usda_proxy_tests({ sdk, enduserSDK })
  } finally {
    // observations cascade-delete with their enduser
    if (enduserAId) {
      try { await sdk.api.endusers.deleteOne(enduserAId) } catch {}
    }
    if (enduserBId) {
      try { await sdk.api.endusers.deleteOne(enduserBId) } catch {}
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
    await nutrition_tracking_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Nutrition tracking test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Nutrition tracking test suite failed:", error)
      process.exit(1)
    })
}
