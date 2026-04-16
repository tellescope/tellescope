require('source-map-support').install();

import { Session } from "../../sdk"
import {
  async_test,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

export const organization_settings_duplicates_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Organization Settings Duplicate Validation Tests")

  const orgId = sdk.userInfo.businessId

  // === A. replaceObjectFields: false (merge/push behavior) ===

  // A1. Duplicate tags via merge
  await sdk.api.organizations.updateOne(orgId, {
    settings: { endusers: { tags: ['tag1', 'tag2'] } }
  }, { replaceObjectFields: true })

  await async_test(
    "Merge tags rejects duplicates (tag2 appears in both old and new)",
    () => sdk.api.organizations.updateOne(orgId, {
      settings: { endusers: { tags: ['tag2', 'tag3'] } }
    }),
    { shouldError: true, onError: (e: { message: string }) => e.message.includes('Duplicate value in settings.endusers.tags') }
  )

  // A2. Duplicate customFields via merge
  await sdk.api.organizations.updateOne(orgId, {
    settings: { endusers: { customFields: [{ type: 'Text' as const, field: 'myField', info: {} }] } }
  }, { replaceObjectFields: true })

  await async_test(
    "Merge customFields rejects duplicate field name",
    () => sdk.api.organizations.updateOne(orgId, {
      settings: { endusers: { customFields: [{ type: 'Text' as const, field: 'myField', info: {} }] } }
    }),
    { shouldError: true, onError: (e: { message: string }) => e.message.includes('Duplicate field in settings.endusers.customFields') }
  )

  // A3. Duplicate builtinFields via merge
  await sdk.api.organizations.updateOne(orgId, {
    settings: { endusers: { builtinFields: [{ field: 'fname', label: 'First Name' }] } }
  }, { replaceObjectFields: true })

  await async_test(
    "Merge builtinFields rejects duplicate field name",
    () => sdk.api.organizations.updateOne(orgId, {
      settings: { endusers: { builtinFields: [{ field: 'fname', label: 'First Name Copy' }] } }
    }),
    { shouldError: true, onError: (e: { message: string }) => e.message.includes('Duplicate field in settings.endusers.builtinFields') }
  )

  // A4. Duplicate dontRecordCallsToPhone via merge
  await sdk.api.organizations.updateOne(orgId, {
    settings: { endusers: { dontRecordCallsToPhone: ['+15551234567'] } }
  }, { replaceObjectFields: true })

  await async_test(
    "Merge dontRecordCallsToPhone rejects duplicates",
    () => sdk.api.organizations.updateOne(orgId, {
      settings: { endusers: { dontRecordCallsToPhone: ['+15551234567'] } }
    }),
    { shouldError: true, onError: (e: { message: string }) => e.message.includes('Duplicate value in settings.endusers.dontRecordCallsToPhone') }
  )

  // A5. Duplicate cancelReasons via merge
  await sdk.api.organizations.updateOne(orgId, {
    settings: { calendar: { cancelReasons: ['No show'] } }
  }, { replaceObjectFields: true })

  await async_test(
    "Merge cancelReasons rejects duplicates",
    () => sdk.api.organizations.updateOne(orgId, {
      settings: { calendar: { cancelReasons: ['No show'] } }
    }),
    { shouldError: true, onError: (e: { message: string }) => e.message.includes('Duplicate value in settings.calendar.cancelReasons') }
  )

  // === B. replaceObjectFields: true (full replacement) ===

  // B1. Replace that grows the array with dupes should be rejected
  await sdk.api.organizations.updateOne(orgId, {
    settings: { endusers: { tags: ['tag1'] } }
  }, { replaceObjectFields: true })

  await async_test(
    "Replace tags rejects duplicates when array grows",
    () => sdk.api.organizations.updateOne(orgId, {
      settings: { endusers: { tags: ['tag1', 'tag1', 'tag2'] } }
    }, { replaceObjectFields: true }),
    { shouldError: true, onError: (e: { message: string }) => e.message.includes('Duplicate value in settings.endusers.tags') }
  )

  // B2. Replace with dupes that shrinks the array should be allowed
  await sdk.api.organizations.updateOne(orgId, {
    settings: { endusers: { tags: ['a', 'b', 'c'] } }
  }, { replaceObjectFields: true })

  await async_test(
    "Replace with dupes that shrinks array succeeds",
    () => sdk.api.organizations.updateOne(orgId, {
      settings: { endusers: { tags: ['a', 'a'] } }
    }, { replaceObjectFields: true }),
    { shouldError: false, onResult: () => true }
  )

  // B3. Replace with unique values always succeeds
  await async_test(
    "Replace tags succeeds with unique values",
    () => sdk.api.organizations.updateOne(orgId, {
      settings: { endusers: { tags: ['tag1', 'tag2'] } }
    }, { replaceObjectFields: true }),
    { shouldError: false, onResult: () => true }
  )

  // === C. Non-duplicate updates still succeed ===

  // C1. Set initial tags then add different tags via merge
  await sdk.api.organizations.updateOne(orgId, {
    settings: { endusers: { tags: ['tagA', 'tagB'] } }
  }, { replaceObjectFields: true })

  await async_test(
    "Merge with unique new tags succeeds",
    () => sdk.api.organizations.updateOne(orgId, {
      settings: { endusers: { tags: ['tagC', 'tagD'] } }
    }),
    { shouldError: false, onResult: () => true }
  )

  // C2. Replace with unique values
  await async_test(
    "Replace customFields with unique values succeeds",
    () => sdk.api.organizations.updateOne(orgId, {
      settings: { endusers: { customFields: [
        { type: 'Text' as const, field: 'field1', info: {} },
        { type: 'Text' as const, field: 'field2', info: {} },
      ] } }
    }, { replaceObjectFields: true }),
    { shouldError: false, onResult: () => true }
  )

  // C3. Updating another settings field preserves pre-existing duplicates
  // First set tags to a longer array, then shrink to a dupe array (shrinking is allowed)
  await sdk.api.organizations.updateOne(orgId, {
    settings: { endusers: { tags: ['dupeTag', 'otherTag', 'anotherTag'] } }
  }, { replaceObjectFields: true })
  await sdk.api.organizations.updateOne(orgId, {
    settings: { endusers: { tags: ['dupeTag', 'dupeTag'] } }
  }, { replaceObjectFields: true })

  await async_test(
    "Updating cancelReasons succeeds even when tags has pre-existing duplicates",
    () => sdk.api.organizations.updateOne(orgId, {
      settings: { calendar: { cancelReasons: ['new reason'] } }
    }, { replaceObjectFields: true }),
    { shouldError: false, onResult: () => true }
  )

  // Clean up settings to avoid affecting other tests
  await sdk.api.organizations.updateOne(orgId, {
    settings: {
      endusers: {
        tags: [],
        customFields: [],
        builtinFields: [],
        dontRecordCallsToPhone: [],
      },
      calendar: {
        cancelReasons: [],
      },
    }
  }, { replaceObjectFields: true })
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await organization_settings_duplicates_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Organization settings duplicate validation tests completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Organization settings duplicate validation tests failed:", error)
      process.exit(1)
    })
}
