require('source-map-support').install();

import { Session } from "../../sdk"
import {
  async_test,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

// Test function that can be called independently
export const trigger_set_fields_date_difference_tests = async ({ sdk } : { sdk: Session }) => {
  log_header("Trigger Set Fields Date Difference Tests")

  // Test resource tracking
  let testEnduser: any
  let triggerId: string | undefined

  try {
    // Test 1: Setup - Create enduser with date fields
    await async_test(
      'setup - create test enduser with date fields',
      async () => {
        testEnduser = await sdk.api.endusers.createOne({
          fields: {
            startDate: '2024-01-15T10:00:00Z', // ISO format
            endDate: '01-25-2024', // MM-DD-YYYY format (10 days after startDate)
          }
        })

        return !!testEnduser.id && !!testEnduser.fields?.startDate && !!testEnduser.fields?.endDate
      },
      { onResult: (result) => result === true }
    )

    // Test 2: Create trigger with Date Difference - ISO to MM-DD-YYYY
    await async_test(
      'create trigger - date difference between two custom fields',
      async () => {
        const trigger = await sdk.api.automation_triggers.createOne({
          title: `Date Difference Test ${Date.now()}`,
          status: 'Active',
          event: {
            type: 'Field Equals',
            info: {
              field: 'triggerTest',
              value: 'calculate-days'
            }
          },
          action: {
            type: 'Set Fields',
            info: {
              fields: [{
                name: 'daysBetween',
                type: 'Date Difference',
                value: '', // Not used for Date Difference type
                dateDifferenceOptions: {
                  date1: 'startDate', // Reference to field containing ISO string
                  date2: 'endDate', // Reference to field containing MM-DD-YYYY
                }
              }]
            }
          }
        })
        triggerId = trigger.id
        return !!trigger.id
      },
      { onResult: (result) => result === true }
    )

    // Test 3: Trigger the action and verify calculation
    await async_test(
      'trigger action - verify date difference is calculated correctly',
      async () => {
        await sdk.api.endusers.updateOne(testEnduser.id, {
          fields: {
            ...testEnduser.fields,
            triggerTest: 'calculate-days'
          }
        })

        // Wait up to 10 seconds for trigger to process
        for (let i = 0; i < 10; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000))

          const updatedEnduser = await sdk.api.endusers.getOne(testEnduser.id)

          if (updatedEnduser.fields?.daysBetween !== undefined) {
            console.log(`✓ Found daysBetween field after ${i + 1} seconds: ${updatedEnduser.fields.daysBetween}`)

            // Should be 10 days between 2024-01-15 and 2024-01-25
            const daysBetween = Number(updatedEnduser.fields.daysBetween)
            if (daysBetween === 10) {
              console.log(`✓ Date difference calculated correctly: ${daysBetween} days`)
              return true
            } else {
              console.log(`❌ Unexpected date difference: ${daysBetween} (expected 10)`)
              return false
            }
          }
        }

        console.log(`❌ daysBetween field not set after 10 seconds`)
        return false
      },
      { onResult: (result) => result === true }
    )

    // Test 4: Test with $now
    await async_test(
      'create trigger - date difference with $now',
      async () => {
        // Delete previous trigger
        if (triggerId) {
          await sdk.api.automation_triggers.deleteOne(triggerId)
        }

        const trigger = await sdk.api.automation_triggers.createOne({
          title: `Date Difference $now Test ${Date.now()}`,
          status: 'Active',
          event: {
            type: 'Field Equals',
            info: {
              field: 'triggerTest2',
              value: 'calculate-days-now'
            }
          },
          action: {
            type: 'Set Fields',
            info: {
              fields: [{
                name: 'daysSinceStart',
                type: 'Date Difference',
                value: '',
                dateDifferenceOptions: {
                  date1: 'startDate',
                  date2: '$now',
                }
              }]
            }
          }
        })
        triggerId = trigger.id
        return !!trigger.id
      },
      { onResult: (result) => result === true }
    )

    // Test 5: Trigger with $now and verify
    await async_test(
      'trigger action - verify $now works correctly',
      async () => {
        await sdk.api.endusers.updateOne(testEnduser.id, {
          fields: {
            ...testEnduser.fields,
            triggerTest2: 'calculate-days-now'
          }
        })

        // Wait up to 10 seconds for trigger to process
        for (let i = 0; i < 10; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000))

          const updatedEnduser = await sdk.api.endusers.getOne(testEnduser.id)

          if (updatedEnduser.fields?.daysSinceStart !== undefined) {
            const daysSinceStart = Number(updatedEnduser.fields.daysSinceStart)
            console.log(`✓ Found daysSinceStart field after ${i + 1} seconds: ${daysSinceStart}`)

            // Should be approximately 680+ days from 2024-01-15 to 2025-09-30 (current test date)
            // We'll accept any reasonable value > 600 days
            if (daysSinceStart > 600) {
              console.log(`✓ Date difference with $now calculated correctly: ${daysSinceStart} days`)
              return true
            } else {
              console.log(`❌ Unexpected date difference with $now: ${daysSinceStart}`)
              return false
            }
          }
        }

        console.log(`❌ daysSinceStart field not set after 10 seconds`)
        return false
      },
      { onResult: (result) => result === true }
    )

    // Test 6: Test with hardcoded date strings
    await async_test(
      'create trigger - date difference with hardcoded dates',
      async () => {
        // Delete previous trigger
        if (triggerId) {
          await sdk.api.automation_triggers.deleteOne(triggerId)
        }

        const trigger = await sdk.api.automation_triggers.createOne({
          title: `Date Difference Hardcoded Test ${Date.now()}`,
          status: 'Active',
          event: {
            type: 'Field Equals',
            info: {
              field: 'triggerTest3',
              value: 'calculate-days-hardcoded'
            }
          },
          action: {
            type: 'Set Fields',
            info: {
              fields: [{
                name: 'hardcodedDays',
                type: 'Date Difference',
                value: '',
                dateDifferenceOptions: {
                  date1: '2024-01-01T00:00:00Z', // ISO string
                  date2: '01-31-2024', // MM-DD-YYYY (30 days later)
                }
              }]
            }
          }
        })
        triggerId = trigger.id
        return !!trigger.id
      },
      { onResult: (result) => result === true }
    )

    // Test 7: Trigger with hardcoded dates and verify
    await async_test(
      'trigger action - verify hardcoded dates work correctly',
      async () => {
        await sdk.api.endusers.updateOne(testEnduser.id, {
          fields: {
            ...testEnduser.fields,
            triggerTest3: 'calculate-days-hardcoded'
          }
        })

        // Wait up to 10 seconds for trigger to process
        for (let i = 0; i < 10; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000))

          const updatedEnduser = await sdk.api.endusers.getOne(testEnduser.id)

          if (updatedEnduser.fields?.hardcodedDays !== undefined) {
            const hardcodedDays = Number(updatedEnduser.fields.hardcodedDays)
            console.log(`✓ Found hardcodedDays field after ${i + 1} seconds: ${hardcodedDays}`)

            // Should be 30 days between 2024-01-01 and 2024-01-31
            if (hardcodedDays === 30) {
              console.log(`✓ Date difference with hardcoded dates calculated correctly: ${hardcodedDays} days`)
              return true
            } else {
              console.log(`❌ Unexpected date difference: ${hardcodedDays} (expected 30)`)
              return false
            }
          }
        }

        console.log(`❌ hardcodedDays field not set after 10 seconds`)
        return false
      },
      { onResult: (result) => result === true }
    )

    console.log("✅ All trigger set fields date difference tests passed!")

  } catch (error) {
    console.error('Test execution error:', error)
    throw error
  } finally {
    // Cleanup
    console.log("🧹 Cleaning up test resources...")

    try {
      if (triggerId) {
        await sdk.api.automation_triggers.deleteOne(triggerId)
      }

      if (testEnduser?.id) {
        await sdk.api.endusers.deleteOne(testEnduser.id)
      }

    } catch (cleanupError) {
      console.error('Cleanup error (non-fatal):', cleanupError)
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
    await trigger_set_fields_date_difference_tests({ sdk })
  }

  runTests()
    .then(() => {
      console.log("✅ Trigger set fields date difference test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Trigger set fields date difference test suite failed:", error)
      process.exit(1)
    })
}