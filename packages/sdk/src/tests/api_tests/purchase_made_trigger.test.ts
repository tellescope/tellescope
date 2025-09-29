import { Session } from "../../sdk"
import { log_header, wait, async_test } from "@tellescope/testing"
import { Enduser } from "@tellescope/types-client"
import { setup_tests } from "../setup"

const host = process.env.API_URL || "http://localhost:8080"

export const purchase_made_trigger_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Automation Trigger Tests (Purchase Made)")

  // Create products for testing
  const product1 = await sdk.api.products.createOne({
    title: 'Premium Course Package',
    cost: { amount: 9999, currency: 'USD' }, // $99.99
    processor: 'Stripe'
  })

  const product2 = await sdk.api.products.createOne({
    title: 'Basic Training Module',
    cost: { amount: 4999, currency: 'USD' }, // $49.99
    processor: 'Stripe'
  })

  const product3 = await sdk.api.products.createOne({
    title: 'Advanced Analytics Suite',
    cost: { amount: 14999, currency: 'USD' }, // $149.99
    processor: 'Stripe'
  })

  // Create automation triggers for different scenarios
  const t1 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Purchase Made', info: { } },
    action: { type: 'Add Tags', info: { tags: ['Purchase-Any'] }},
    status: 'Active',
    title: "Purchase - Any"
  })

  const t2 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Purchase Made', info: { titles: ['Premium Course Package'] } },
    action: { type: 'Add Tags', info: { tags: ['Purchase-Exact-Title'] }},
    status: 'Active',
    title: "Purchase - Exact Title"
  })

  const t3 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Purchase Made', info: { productIds: [product2.id] } },
    action: { type: 'Add Tags', info: { tags: ['Purchase-Product-ID'] }},
    status: 'Active',
    title: "Purchase - Product ID"
  })

  // Test the new titlePartialMatches functionality
  const t4 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Purchase Made', info: { titlePartialMatches: ['course'] } },
    action: { type: 'Add Tags', info: { tags: ['Purchase-Partial-Course'] }},
    status: 'Active',
    title: "Purchase - Partial Match Course"
  })

  const t5 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Purchase Made', info: { titlePartialMatches: ['ANALYTICS'] } },
    action: { type: 'Add Tags', info: { tags: ['Purchase-Partial-Analytics'] }},
    status: 'Active',
    title: "Purchase - Partial Match Analytics (Case Insensitive)"
  })

  const t6 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Purchase Made', info: { titlePartialMatches: ['premium', 'advanced', 'pro'] } },
    action: { type: 'Add Tags', info: { tags: ['Purchase-Multiple-Partial'] }},
    status: 'Active',
    title: "Purchase - Multiple Partial Matches"
  })

  // Comprehensive case-insensitivity test trigger
  const t7 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Purchase Made', info: { titlePartialMatches: ['MiXeD', 'UPPER', 'lower'] } },
    action: { type: 'Add Tags', info: { tags: ['Purchase-Case-Test'] }},
    status: 'Active',
    title: "Purchase - Comprehensive Case Insensitivity Test"
  })

  // Empty titlePartialMatches array test trigger
  const t8 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Purchase Made', info: { titlePartialMatches: [] } },
    action: { type: 'Add Tags', info: { tags: ['Purchase-Empty-Array'] }},
    status: 'Active',
    title: "Purchase - Empty titlePartialMatches Array Test"
  })

  // No title test trigger
  const t9 = await sdk.api.automation_triggers.createOne({
    event: { type: 'Purchase Made', info: { titlePartialMatches: ['test', 'example'] } },
    action: { type: 'Add Tags', info: { tags: ['Purchase-No-Title-Test'] }},
    status: 'Active',
    title: "Purchase - No Title Test"
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
  const enduser13 = await sdk.api.endusers.createOne({})
  const enduser14 = await sdk.api.endusers.createOne({})

  // Test 1: Purchase without specific filters (should trigger t1 for any purchase)
  const purchase1 = await sdk.api.purchases.createOne({
    enduserId: enduser1.id,
    productId: product1.id,
    title: 'Premium Course Package',
    cost: { amount: 9999, currency: 'USD' },
    processor: 'Stripe'
  })
  await wait(undefined, 500) // Brief wait for trigger processing
  await async_test(
    "Purchase Made - Any Purchase",
    () => sdk.api.endusers.getOne(enduser1.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Purchase-Any') }
  )

  // Test 2: Purchase with exact title match
  const purchase2 = await sdk.api.purchases.createOne({
    enduserId: enduser2.id,
    productId: product1.id,
    title: 'Premium Course Package',
    cost: { amount: 9999, currency: 'USD' },
    processor: 'Stripe'
  })
  await wait(undefined, 500)
  await async_test(
    "Purchase Made - Exact Title Match",
    () => sdk.api.endusers.getOne(enduser2.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Purchase-Exact-Title') }
  )

  // Test 3: Purchase with product ID match
  const purchase3 = await sdk.api.purchases.createOne({
    enduserId: enduser3.id,
    productId: product2.id,
    title: 'Basic Training Module',
    cost: { amount: 4999, currency: 'USD' },
    processor: 'Stripe'
  })
  await wait(undefined, 500)
  await async_test(
    "Purchase Made - Product ID Match",
    () => sdk.api.endusers.getOne(enduser3.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Purchase-Product-ID') }
  )

  // Test 4: Purchase with case-insensitive partial title match - "course"
  const purchase4 = await sdk.api.purchases.createOne({
    enduserId: enduser4.id,
    productId: product1.id,
    title: 'Premium Course Package',
    cost: { amount: 9999, currency: 'USD' },
    processor: 'Stripe'
  })
  await wait(undefined, 500)
  await async_test(
    "Purchase Made - Partial Title Match (case insensitive 'course')",
    () => sdk.api.endusers.getOne(enduser4.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Purchase-Partial-Course') }
  )

  // Test 5: Purchase with case-insensitive partial title match - "ANALYTICS" (uppercase)
  const purchase5 = await sdk.api.purchases.createOne({
    enduserId: enduser5.id,
    productId: product3.id,
    title: 'Advanced Analytics Suite',
    cost: { amount: 14999, currency: 'USD' },
    processor: 'Stripe'
  })
  await wait(undefined, 500)
  await async_test(
    "Purchase Made - Partial Title Match (case insensitive 'ANALYTICS')",
    () => sdk.api.endusers.getOne(enduser5.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Purchase-Partial-Analytics') }
  )

  // Test 6: Purchase that should NOT match partial filter
  const purchase6 = await sdk.api.purchases.createOne({
    enduserId: enduser6.id,
    productId: product2.id,
    title: 'Basic Training Module',
    cost: { amount: 4999, currency: 'USD' },
    processor: 'Stripe'
  })
  await wait(undefined, 500)
  await async_test(
    "Purchase Made - No Partial Title Match",
    () => sdk.api.endusers.getOne(enduser6.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Purchase-Any') && !e.tags?.includes('Purchase-Partial-Course') && !e.tags?.includes('Purchase-Partial-Analytics') }
  )

  // Test 7: Purchase with mixed case partial match
  const purchase7 = await sdk.api.purchases.createOne({
    enduserId: enduser7.id,
    productId: product1.id,
    title: 'Ultimate COURSE Experience',
    cost: { amount: 9999, currency: 'USD' },
    processor: 'Stripe'
  })
  await wait(undefined, 500)
  await async_test(
    "Purchase Made - Mixed Case Partial Title Match",
    () => sdk.api.endusers.getOne(enduser7.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Purchase-Partial-Course') }
  )

  // Test 8: Purchase with multiple partial matches - should match 'premium'
  const purchase8 = await sdk.api.purchases.createOne({
    enduserId: enduser8.id,
    productId: product1.id,
    title: 'Premium Course Package',
    cost: { amount: 9999, currency: 'USD' },
    processor: 'Stripe'
  })
  await wait(undefined, 500)
  await async_test(
    "Purchase Made - Multiple Partial Matches (matches 'premium')",
    () => sdk.api.endusers.getOne(enduser8.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Purchase-Multiple-Partial') }
  )

  // Test 9: Purchase with multiple partial matches - should match 'advanced'
  const purchase9 = await sdk.api.purchases.createOne({
    enduserId: enduser9.id,
    productId: product3.id,
    title: 'Advanced Analytics Suite',
    cost: { amount: 14999, currency: 'USD' },
    processor: 'Stripe'
  })
  await wait(undefined, 500)
  await async_test(
    "Purchase Made - Multiple Partial Matches (matches 'advanced')",
    () => sdk.api.endusers.getOne(enduser9.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Purchase-Multiple-Partial') }
  )

  // Test 10: Comprehensive case-insensitivity - lowercase filter 'mixed' matches title 'MIXED Case'
  const purchase10 = await sdk.api.purchases.createOne({
    enduserId: enduser10.id,
    productId: product1.id,
    title: 'Some MIXED Case Product Title',
    cost: { amount: 9999, currency: 'USD' },
    processor: 'Stripe'
  })
  await wait(undefined, 500)
  await async_test(
    "Purchase Made - Case Insensitive (lowercase filter 'mixed' matches 'MIXED')",
    () => sdk.api.endusers.getOne(enduser10.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Purchase-Case-Test') }
  )

  // Test 11: Comprehensive case-insensitivity - uppercase filter 'UPPER' matches title 'upper'
  const purchase11 = await sdk.api.purchases.createOne({
    enduserId: enduser11.id,
    productId: product2.id,
    title: 'Something with upper case word',
    cost: { amount: 4999, currency: 'USD' },
    processor: 'Stripe'
  })
  await wait(undefined, 500)
  await async_test(
    "Purchase Made - Case Insensitive (uppercase filter 'UPPER' matches 'upper')",
    () => sdk.api.endusers.getOne(enduser11.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Purchase-Case-Test') }
  )

  // Test 12: Comprehensive case-insensitivity - mixed case filter 'MiXeD' matches title 'MiXeD'
  const purchase12 = await sdk.api.purchases.createOne({
    enduserId: enduser12.id,
    productId: product3.id,
    title: 'Another MiXeD case example here',
    cost: { amount: 14999, currency: 'USD' },
    processor: 'Stripe'
  })
  await wait(undefined, 500)
  await async_test(
    "Purchase Made - Case Insensitive (mixed case filter 'MiXeD' matches 'MiXeD')",
    () => sdk.api.endusers.getOne(enduser12.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Purchase-Case-Test') }
  )

  // Test 13: Empty titlePartialMatches array - should behave like no filter
  const purchase13 = await sdk.api.purchases.createOne({
    enduserId: enduser13.id,
    productId: product1.id,
    title: 'Any Title Here',
    cost: { amount: 9999, currency: 'USD' },
    processor: 'Stripe'
  })
  await wait(undefined, 500)
  await async_test(
    "Purchase Made - Empty titlePartialMatches Array (should trigger like any purchase)",
    () => sdk.api.endusers.getOne(enduser13.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Purchase-Empty-Array') && !!e.tags?.includes('Purchase-Any') }
  )

  // Test 14: Purchase with empty title - should NOT trigger partial match filters
  const purchase14 = await sdk.api.purchases.createOne({
    enduserId: enduser14.id,
    productId: product2.id,
    title: '', // Empty title to test the no title scenario
    cost: { amount: 4999, currency: 'USD' },
    processor: 'Stripe'
  })
  await wait(undefined, 500)
  await async_test(
    "Purchase Made - Empty Title (should not trigger partial match filters)",
    () => sdk.api.endusers.getOne(enduser14.id),
    { onResult: (e: Enduser) => !!e.tags?.includes('Purchase-Any') && !e.tags?.includes('Purchase-No-Title-Test') }
  )

  try {
    // Clean up test data - triggers first
    await sdk.api.automation_triggers.deleteOne(t1.id)
    await sdk.api.automation_triggers.deleteOne(t2.id)
    await sdk.api.automation_triggers.deleteOne(t3.id)
    await sdk.api.automation_triggers.deleteOne(t4.id)
    await sdk.api.automation_triggers.deleteOne(t5.id)
    await sdk.api.automation_triggers.deleteOne(t6.id)
    await sdk.api.automation_triggers.deleteOne(t7.id)
    await sdk.api.automation_triggers.deleteOne(t8.id)
    await sdk.api.automation_triggers.deleteOne(t9.id)

    // Clean up products
    await sdk.api.products.deleteOne(product1.id)
    await sdk.api.products.deleteOne(product2.id)
    await sdk.api.products.deleteOne(product3.id)

    // Clean up endusers to prevent interference with other tests
    await sdk.api.endusers.deleteOne(enduser1.id)
    await sdk.api.endusers.deleteOne(enduser2.id)
    await sdk.api.endusers.deleteOne(enduser3.id)
    await sdk.api.endusers.deleteOne(enduser4.id)
    await sdk.api.endusers.deleteOne(enduser5.id)
    await sdk.api.endusers.deleteOne(enduser6.id)
    await sdk.api.endusers.deleteOne(enduser7.id)
    await sdk.api.endusers.deleteOne(enduser8.id)
    await sdk.api.endusers.deleteOne(enduser9.id)
    await sdk.api.endusers.deleteOne(enduser10.id)
    await sdk.api.endusers.deleteOne(enduser11.id)
    await sdk.api.endusers.deleteOne(enduser12.id)
    await sdk.api.endusers.deleteOne(enduser13.id)
    await sdk.api.endusers.deleteOne(enduser14.id)
  } finally {}
}

// Allow running this test file independently
if (require.main === module) {
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await purchase_made_trigger_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Purchase Made trigger tests completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Purchase Made trigger tests failed:", error)
      process.exit(1)
    })
}