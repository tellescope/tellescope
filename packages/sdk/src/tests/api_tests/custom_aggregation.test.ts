require('source-map-support').install();

import { Session } from "../../sdk"
import {
  async_test,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

// Main test function that can be called independently
export const custom_aggregation_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Custom Aggregation Tests")

  // Create test data: an enduser with a password to ensure hashedPassword gets set
  const testEnduser = await sdk.api.endusers.createOne({
    fname: 'CustomAgg',
    lname: 'TestUser',
    email: 'custom-agg-test@example.com',
  })

  // Set a password on the enduser (this creates a hashedPassword field)
  await sdk.api.endusers.set_password({
    id: testEnduser.id,
    password: 'TestPassword123!',
  })

  try {
    // Test 1: Basic aggregation works
    await async_test(
      "Custom aggregation - basic query works",
      () => sdk.api.analytics_frames.custom_aggregation({
        modelName: 'endusers',
        aggregation: [
          { $match: { fname: 'CustomAgg' } },
          { $count: 'total' }
        ]
      }),
      { onResult: r => r.result[0]?.total === 1 }
    )

    // Test 2: Aggregation returns enduser data
    await async_test(
      "Custom aggregation - returns enduser fields",
      () => sdk.api.analytics_frames.custom_aggregation({
        modelName: 'endusers',
        aggregation: [
          { $match: { fname: 'CustomAgg' } },
          { $project: { fname: 1, lname: 1, email: 1 } }
        ]
      }),
      { onResult: r => {
        const user = r.result[0]
        return user.fname === 'CustomAgg'
          && user.lname === 'TestUser'
          && user.email === 'custom-agg-test@example.com'
      }}
    )

    // Test 3: CRITICAL - hashedPassword is redacted even if requested
    await async_test(
      "Custom aggregation - hashedPassword is redacted (explicit project)",
      () => sdk.api.analytics_frames.custom_aggregation({
        modelName: 'endusers',
        aggregation: [
          { $match: { fname: 'CustomAgg' } },
          { $project: { fname: 1, hashedPassword: 1 } } // Explicitly request password
        ]
      }),
      { onResult: r => {
        const user = r.result[0]
        // Should have fname but NOT hashedPassword
        return user.fname === 'CustomAgg' && user.hashedPassword === undefined
      }}
    )

    // Test 4: hashedPassword is redacted even without explicit project
    await async_test(
      "Custom aggregation - hashedPassword is redacted (no project)",
      () => sdk.api.analytics_frames.custom_aggregation({
        modelName: 'endusers',
        aggregation: [
          { $match: { fname: 'CustomAgg' } },
          { $limit: 1 }
        ]
      }),
      { onResult: r => {
        const user = r.result[0]
        // Should return user data but NOT hashedPassword
        return user.fname === 'CustomAgg' && user.hashedPassword === undefined
      }}
    )

    // Test 5: Aggregation with grouping doesn't leak hashedPassword
    await async_test(
      "Custom aggregation - hashedPassword redacted in grouped results",
      () => sdk.api.analytics_frames.custom_aggregation({
        modelName: 'endusers',
        aggregation: [
          { $match: { fname: 'CustomAgg' } },
          { $group: { _id: '$fname', count: { $sum: 1 }, data: { $push: '$$ROOT' } } }
        ]
      }),
      { onResult: r => {
        const group = r.result[0]
        const user = group.data[0]
        // Even in grouped results, hashedPassword should not be present
        return group.count === 1 && user.hashedPassword === undefined
      }}
    )

    console.log("✅ All custom aggregation tests passed")
  } finally {
    // Cleanup
    await sdk.api.endusers.deleteOne(testEnduser.id)
  }
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await custom_aggregation_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Custom aggregation test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Custom aggregation test suite failed:", error)
      process.exit(1)
    })
}
