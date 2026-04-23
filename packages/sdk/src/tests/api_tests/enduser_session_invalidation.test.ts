require('source-map-support').install();

import { Session, EnduserSession } from "../../sdk"
import {
  async_test,
  handleAnyError,
  log_header,
  wait,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const
const businessId = '60398b1131a295e64f084ff6'

// Main test function that can be called independently
export const enduser_session_invalidation_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Enduser Session Invalidation Tests")

  // Create test enduser
  const testEnduser = await sdk.api.endusers.createOne({ email: `session-invalidation-test-${Date.now()}@tellescope.com` })

  try {
    // Generate auth token for the enduser
    const { authToken } = await sdk.api.endusers.generate_auth_token({ id: testEnduser.id })
    const enduserSDK = new EnduserSession({ host, authToken, businessId: sdk.userInfo.businessId })

    // Test 1: Enduser authenticated before invalidation
    await async_test(
      'enduser authenticated before invalidation',
      () => enduserSDK.test_authenticated(),
      { expectedResult: 'Authenticated!' }
    )

    // Wait to ensure time separation between token creation and invalidation
    await wait(undefined, 2000)

    // Test 2: Setting invalidateSessionsBefore rejects old token (401)
    await async_test(
      'setting invalidateSessionsBefore rejects old token',
      async () => {
        await sdk.api.endusers.updateOne(testEnduser.id, { invalidateSessionsBefore: new Date() })

        // Old token should now be rejected
        try {
          await enduserSDK.test_authenticated()
          return 'should have thrown'
        } catch (e) {
          return 'rejected'
        }
      },
      { expectedResult: 'rejected' }
    )

    // Test 3: New token after invalidation works
    await async_test(
      'new token after invalidation works',
      async () => {
        // Wait to ensure new token iat is after invalidateSessionsBefore
        await wait(undefined, 2000)

        const { authToken: newAuthToken } = await sdk.api.endusers.generate_auth_token({ id: testEnduser.id })
        const newEnduserSDK = new EnduserSession({ host, authToken: newAuthToken, businessId: sdk.userInfo.businessId })

        return await newEnduserSDK.test_authenticated()
      },
      { expectedResult: 'Authenticated!' }
    )

    // Test 4: Cannot set invalidateSessionsBefore backwards (constraint error)
    await async_test(
      'cannot set invalidateSessionsBefore backwards',
      async () => {
        // Try to set invalidateSessionsBefore to a date in the past (before current value)
        const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
        await sdk.api.endusers.updateOne(testEnduser.id, { invalidateSessionsBefore: pastDate })
      },
      handleAnyError
    )

    // Test 5: Deleted enduser token rejected (401)
    await async_test(
      'deleted enduser token rejected',
      async () => {
        // Create a separate enduser, get token, then delete enduser
        const tempEnduser = await sdk.api.endusers.createOne({ email: `temp-session-test-${Date.now()}@tellescope.com` })
        const { authToken: tempAuthToken } = await sdk.api.endusers.generate_auth_token({ id: tempEnduser.id })
        const tempEnduserSDK = new EnduserSession({ host, authToken: tempAuthToken, businessId: sdk.userInfo.businessId })

        // Verify token works before deletion
        await tempEnduserSDK.test_authenticated()

        // Delete the enduser
        await sdk.api.endusers.deleteOne(tempEnduser.id)

        // Token should now be rejected
        try {
          await tempEnduserSDK.test_authenticated()
          return 'should have thrown'
        } catch (e) {
          return 'rejected'
        }
      },
      { expectedResult: 'rejected' }
    )

    console.log("✅ All Enduser Session Invalidation tests passed!")

  } finally {
    // Cleanup: Delete test enduser
    try {
      await sdk.api.endusers.deleteOne(testEnduser.id)
    } catch (error) {
      console.error('Cleanup error:', error)
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
    await enduser_session_invalidation_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Enduser session invalidation test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Enduser session invalidation test suite failed:", error)
      process.exit(1)
    })
}
