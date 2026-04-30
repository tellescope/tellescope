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

  // --- OTP enablement invalidation tests ---

  log_header("OTP Enablement Session Invalidation Tests")

  // Helper to reset OTP settings
  const resetOTPSettings = async (s: Session) => {
    await s.api.organizations.updateOne(s.userInfo.businessId, {
      portalSettings: { authentication: { requireOTP: false, requireOTPAfterPassword: false } },
    }, { replaceObjectFields: true })
  }

  // Ensure OTP is off and db is clean before starting
  await sdk.reset_db()
  await wait(undefined, 500)
  await resetOTPSettings(sdk)

  try {

  // Test 6: Enabling requireOTP invalidates multiple enduser sessions at once
  await async_test(
    'enabling requireOTP invalidates multiple enduser sessions',
    async () => {
      const endusers = await Promise.all([
        sdk.api.endusers.createOne({ email: `otp-bulk-1-${Date.now()}@tellescope.com` }),
        sdk.api.endusers.createOne({ email: `otp-bulk-2-${Date.now()}@tellescope.com` }),
        sdk.api.endusers.createOne({ email: `otp-bulk-3-${Date.now()}@tellescope.com` }),
      ])
      try {
        const tokens = await Promise.all(
          endusers.map(e => sdk.api.endusers.generate_auth_token({ id: e.id, overrideOTP: true }))
        )
        const sessions = tokens.map(t => new EnduserSession({ host, authToken: t.authToken, businessId: sdk.userInfo.businessId }))

        // Verify all tokens work
        for (const s of sessions) {
          await s.test_authenticated()
        }

        await wait(undefined, 2000)

        // Enable OTP
        await sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
          portalSettings: { authentication: { requireOTP: true } },
        })

        // Wait for side effect to process
        await wait(undefined, 1000)

        // All old tokens should be rejected
        for (const s of sessions) {
          try {
            await s.test_authenticated()
            return 'should have thrown'
          } catch (e) { /* expected */ }
        }

        // New tokens should work
        await wait(undefined, 2000)
        for (const e of endusers) {
          const { authToken: newToken } = await sdk.api.endusers.generate_auth_token({ id: e.id, overrideOTP: true })
          const newSession = new EnduserSession({ host, authToken: newToken, businessId: sdk.userInfo.businessId })
          await newSession.test_authenticated()
        }

        return 'passed'
      } finally {
        await resetOTPSettings(sdk)
        for (const e of endusers) {
          await sdk.api.endusers.deleteOne(e.id).catch(console.error)
        }
      }
    },
    { expectedResult: 'passed' }
  )

  // Test 7: Enabling requireOTPAfterPassword invalidates multiple enduser sessions
  await async_test(
    'enabling requireOTPAfterPassword invalidates multiple enduser sessions',
    async () => {
      const endusers = await Promise.all([
        sdk.api.endusers.createOne({ email: `otp-mfa-1-${Date.now()}@tellescope.com` }),
        sdk.api.endusers.createOne({ email: `otp-mfa-2-${Date.now()}@tellescope.com` }),
      ])
      try {
        const tokens = await Promise.all(
          endusers.map(e => sdk.api.endusers.generate_auth_token({ id: e.id, overrideOTP: true }))
        )
        const sessions = tokens.map(t => new EnduserSession({ host, authToken: t.authToken, businessId: sdk.userInfo.businessId }))

        for (const s of sessions) {
          await s.test_authenticated()
        }

        await wait(undefined, 2000)

        await sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
          portalSettings: { authentication: { requireOTPAfterPassword: true } },
        })

        await wait(undefined, 1000)

        for (const s of sessions) {
          try {
            await s.test_authenticated()
            return 'should have thrown'
          } catch (e) { /* expected */ }
        }

        // New tokens work
        await wait(undefined, 2000)
        for (const e of endusers) {
          const { authToken: newToken } = await sdk.api.endusers.generate_auth_token({ id: e.id, overrideOTP: true })
          const newSession = new EnduserSession({ host, authToken: newToken, businessId: sdk.userInfo.businessId })
          await newSession.test_authenticated()
        }

        return 'passed'
      } finally {
        await resetOTPSettings(sdk)
        for (const e of endusers) {
          await sdk.api.endusers.deleteOne(e.id).catch(console.error)
        }
      }
    },
    { expectedResult: 'passed' }
  )

  // Reset rate limiting state before continuing
  await sdk.reset_db()
  await wait(undefined, 500)

  // Test 8: Disabling OTP does NOT invalidate sessions
  await async_test(
    'disabling OTP does not invalidate sessions',
    async () => {
      // Enable OTP first
      await sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
        portalSettings: { authentication: { requireOTP: true } },
      })

      await wait(undefined, 2000)

      // Create enduser and token AFTER OTP is enabled (so token is valid)
      const enduser = await sdk.api.endusers.createOne({ email: `otp-disable-${Date.now()}@tellescope.com` })
      try {
        const { authToken } = await sdk.api.endusers.generate_auth_token({ id: enduser.id, overrideOTP: true })
        const enduserSession = new EnduserSession({ host, authToken, businessId: sdk.userInfo.businessId })
        await enduserSession.test_authenticated()

        await wait(undefined, 2000)

        // Disable OTP
        await sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
          portalSettings: { authentication: { requireOTP: false } },
        }, { replaceObjectFields: true })

        await wait(undefined, 1000)

        // Old token should still work (disabling OTP should not invalidate)
        return await enduserSession.test_authenticated()
      } finally {
        await resetOTPSettings(sdk)
        await sdk.api.endusers.deleteOne(enduser.id).catch(console.error)
      }
    },
    { expectedResult: 'Authenticated!' }
  )

  // Test 9: OTP invalidation is scoped to the updated organization only (multi-tenant)
  await async_test(
    'OTP invalidation is scoped to the updated organization only',
    async () => {
      const sdkOther = new Session({ host, apiKey: "ba745e25162bb95a795c5fa1af70df188d93c4d3aac9c48b34a5c8c9dd7b80f7" })

      const otherEnduser = await sdkOther.api.endusers.createOne({ email: `otp-other-tenant-${Date.now()}@tellescope.com` })
      const mainEnduser = await sdk.api.endusers.createOne({ email: `otp-main-tenant-${Date.now()}@tellescope.com` })

      try {
        const { authToken: otherToken } = await sdkOther.api.endusers.generate_auth_token({ id: otherEnduser.id, overrideOTP: true })
        const otherEnduserSession = new EnduserSession({ host, authToken: otherToken, businessId: sdkOther.userInfo.businessId })

        const { authToken: mainToken } = await sdk.api.endusers.generate_auth_token({ id: mainEnduser.id, overrideOTP: true })
        const mainEnduserSession = new EnduserSession({ host, authToken: mainToken, businessId: sdk.userInfo.businessId })

        // Both tokens work
        await otherEnduserSession.test_authenticated()
        await mainEnduserSession.test_authenticated()

        await wait(undefined, 2000)

        // Enable OTP on main tenant only
        await sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
          portalSettings: { authentication: { requireOTP: true } },
        })

        await wait(undefined, 1000)

        // Main tenant enduser's old token should be rejected
        try {
          await mainEnduserSession.test_authenticated()
          return 'should have thrown'
        } catch (e) { /* expected */ }

        // Other tenant enduser's token should still work
        await otherEnduserSession.test_authenticated()

        return 'passed'
      } finally {
        await resetOTPSettings(sdk)
        await sdk.api.endusers.deleteOne(mainEnduser.id).catch(console.error)
        await sdkOther.api.endusers.deleteOne(otherEnduser.id).catch(console.error)
      }
    },
    { expectedResult: 'passed' }
  )

  console.log("✅ All OTP Enablement Session Invalidation tests passed!")

  } finally {
    // Always reset OTP settings to prevent impacting other tests
    await resetOTPSettings(sdk).catch(console.error)
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
