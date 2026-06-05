require('source-map-support').install();

import { Session, EnduserSession } from "../../sdk"
import {
  assert,
  async_test,
  handleAnyError,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const
const businessId = '60398b1131a295e64f084ff6'

// Main test function that can be called independently
export const user_portal_settings_tests = async ({ sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("User portalSettings Tests")

  // Operate on a throwaway user so we never mutate existing users' records.
  const testUser = await sdk.api.users.createOne({
    email: `portal_settings_test_${Date.now()}@test.tellescope.com`,
  })

  // throwaway enduser used to confirm enduser-visibility of portalSettings
  let testEnduserId: string | undefined
  let enduserSDK: EnduserSession | undefined

  try {
    // ===== Valid: string values =====
    await async_test(
      'portalSettings - string values accepted',
      async () => {
        await sdk.api.users.updateOne(testUser.id, { portalSettings: { theme: 'dark' } }, { replaceObjectFields: true })
        const updated = await sdk.api.users.getOne(testUser.id)
        return updated.portalSettings?.theme
      },
      { onResult: (r) => r === 'dark' }
    )

    // ===== Valid: boolean values + round-trip as real booleans =====
    await async_test(
      'portalSettings - boolean values accepted and round-trip as booleans',
      async () => {
        await sdk.api.users.updateOne(
          testUser.id,
          { portalSettings: { showNameInSecureMessaging: true, showAvatar: false } },
          { replaceObjectFields: true }
        )
        const updated = await sdk.api.users.getOne(testUser.id)
        return updated.portalSettings
      },
      {
        onResult: (r) =>
          r?.showNameInSecureMessaging === true &&
          r?.showAvatar === false &&
          // assert real booleans, not coerced strings
          typeof r?.showNameInSecureMessaging === 'boolean' &&
          typeof r?.showAvatar === 'boolean',
      }
    )

    // ===== Valid: mixed string + boolean values, strings stay strings =====
    await async_test(
      'portalSettings - mixed string and boolean values',
      async () => {
        await sdk.api.users.updateOne(
          testUser.id,
          { portalSettings: { theme: 'light', showAvatar: true } },
          { replaceObjectFields: true }
        )
        const updated = await sdk.api.users.getOne(testUser.id)
        return updated.portalSettings
      },
      {
        onResult: (r) =>
          r?.theme === 'light' &&
          typeof r?.theme === 'string' &&
          r?.showAvatar === true &&
          typeof r?.showAvatar === 'boolean',
      }
    )

    // ===== Valid: empty object (zero-iteration loop passes) =====
    await async_test(
      'portalSettings - empty object accepted',
      async () => {
        await sdk.api.users.updateOne(testUser.id, { portalSettings: {} }, { replaceObjectFields: true })
        const updated = await sdk.api.users.getOne(testUser.id)
        return updated.portalSettings
      },
      { onResult: (r) => !!r && typeof r === 'object' && Object.keys(r).length === 0 }
    )

    // ===== Invalid: value string > 250 chars =====
    await async_test(
      'portalSettings - value string > 250 chars rejected',
      () => sdk.api.users.updateOne(
        testUser.id,
        { portalSettings: { tooLong: 'a'.repeat(251) } },
        { replaceObjectFields: true }
      ),
      handleAnyError
    )

    // ===== Invalid: key > 250 chars =====
    await async_test(
      'portalSettings - key > 250 chars rejected',
      () => sdk.api.users.updateOne(
        testUser.id,
        { portalSettings: { ['a'.repeat(251)]: 'x' } },
        { replaceObjectFields: true }
      ),
      handleAnyError
    )

    // ===== Invalid: nested object value (disallowed type) =====
    await async_test(
      'portalSettings - nested object value rejected',
      () => sdk.api.users.updateOne(
        testUser.id,
        { portalSettings: { k: { nested: 1 } as any } },
        { replaceObjectFields: true }
      ),
      handleAnyError
    )

    // ===== Invalid: array value (disallowed type) =====
    await async_test(
      'portalSettings - array value rejected',
      () => sdk.api.users.updateOne(
        testUser.id,
        { portalSettings: { k: [1, 2] as any } },
        { replaceObjectFields: true }
      ),
      handleAnyError
    )

    // ===== Number value (secondary): orValidator tries boolean then string;
    // stringValidator250's escapeString throws on non-strings, so a number is
    // rejected by both branches => API validation error. =====
    await async_test(
      'portalSettings - number value rejected',
      () => sdk.api.users.updateOne(
        testUser.id,
        { portalSettings: { k: 1 as any } },
        { replaceObjectFields: true }
      ),
      handleAnyError
    )

    // ===== Enduser visibility: portalSettings readable by endusers, un-redacted =====
    await async_test(
      'portalSettings - readable by enduser (un-redacted)',
      async () => {
        // set a known value on the throwaway user
        await sdk.api.users.updateOne(
          testUser.id,
          { portalSettings: { showNameInSecureMessaging: true, theme: 'dark' } },
          { replaceObjectFields: true }
        )

        // create + authenticate a throwaway enduser to read as a patient
        const testEnduser = await sdk.api.endusers.createOne({
          email: `portal_settings_enduser_${Date.now()}@test.tellescope.com`,
        })
        testEnduserId = testEnduser.id
        await sdk.api.endusers.set_password({ id: testEnduser.id, password: 'TestPassword123!' })

        enduserSDK = new EnduserSession({ host, businessId })
        await enduserSDK.authenticate(testEnduser.email!, 'TestPassword123!')

        const asEnduser = await enduserSDK.api.users.getOne(testUser.id)
        return asEnduser.portalSettings
      },
      {
        onResult: (r) =>
          // field is present and un-redacted for endusers
          r?.showNameInSecureMessaging === true && r?.theme === 'dark',
      }
    )

    console.log("✅ All User portalSettings tests passed!")
  } finally {
    try {
      if (enduserSDK) {
        await enduserSDK.api.endusers.logout().catch(() => {})
      }
      if (testEnduserId) {
        await sdk.api.endusers.deleteOne(testEnduserId)
      }
    } finally {
      await sdk.api.users.deleteOne(testUser.id)
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
    await user_portal_settings_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ User portalSettings test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ User portalSettings test suite failed:", error)
      process.exit(1)
    })
}
