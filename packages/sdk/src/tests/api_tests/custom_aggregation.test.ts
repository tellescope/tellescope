require('source-map-support').install();

import { Session } from "../../sdk"
import {
  async_test,
  log_header,
  wait,
} from "@tellescope/testing"
import { setup_tests } from "../setup"
import { PROVIDER_PERMISSIONS } from "@tellescope/constants"

const host = process.env.API_URL || 'http://localhost:8080' as const
const [nonAdminEmail, nonAdminPassword] = [process.env.NON_ADMIN_EMAIL, process.env.NON_ADMIN_PASSWORD]

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

    // ===== Role-Based Access Permission Tests =====
    log_header("Custom Aggregation - Role-Based Access Tests")

    // Create a role with No Access for engagement_events but full access for endusers
    const noEngagementAccessRole = 'no-engagement-access-test'
    const rbap = await sdk.api.role_based_access_permissions.createOne({
      role: noEngagementAccessRole,
      permissions: {
        ...PROVIDER_PERMISSIONS,
        // Override endusers to have full read access so we can test aggregation
        endusers: {
          create: 'All',
          read: 'All',
          update: 'All',
          delete: 'All',
        },
        engagement_events: {
          create: null,
          read: null,
          update: null,
          delete: null,
        },
      },
    })

    // Save original role to restore later
    const originalRoles = sdkNonAdmin.userInfo.roles

    try {
      // Assign the restricted role to non-admin user
      await sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [noEngagementAccessRole] }, { replaceObjectFields: true })
      await wait(undefined, 1500) // wait for role change to propagate
      await sdkNonAdmin.authenticate(nonAdminEmail!, nonAdminPassword!)

      // Test 6: Non-admin can still aggregate models they have access to (endusers)
      await async_test(
        "Custom aggregation - non-admin can access permitted models",
        () => sdkNonAdmin.api.analytics_frames.custom_aggregation({
          modelName: 'endusers',
          aggregation: [
            { $match: { fname: 'CustomAgg' } },
            { $count: 'total' }
          ]
        }),
        { onResult: r => r.result[0]?.total === 1 }
      )

      // Test 7: Non-admin is blocked from aggregating models with No Access
      await async_test(
        "Custom aggregation - non-admin blocked from No Access models",
        () => sdkNonAdmin.api.analytics_frames.custom_aggregation({
          modelName: 'engagement_events',
          aggregation: [
            { $match: {} },
            { $count: 'total' }
          ]
        }),
        { shouldError: true, onError: (e: any) => e.message === "You do not have access to this resource" }
      )

      console.log("✅ All custom aggregation role-based access tests passed")
    } finally {
      // Restore original role
      await sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: originalRoles }, { replaceObjectFields: true })
      await wait(undefined, 1000)
      await sdkNonAdmin.authenticate(nonAdminEmail!, nonAdminPassword!)

      // Cleanup role
      await sdk.api.role_based_access_permissions.deleteOne(rbap.id)
    }

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
