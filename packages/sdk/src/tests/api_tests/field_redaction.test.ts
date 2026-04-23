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

const RECORDING_FIELDS = ['recordingURI', 'recordingId', 'recordingDurationInSeconds'] as const
const ALL_REDACTABLE_FIELDS = [...RECORDING_FIELDS, 'transcription', 'recordingTranscriptionData', 'aiSummary'] as const

const hasFields = (record: any, fields: readonly string[]) =>
  fields.every(f => f in record && record[f] !== undefined)

const lacksFields = (record: any, fields: readonly string[]) =>
  fields.every(f => !(f in record) || record[f] === undefined)

/**
 * Tests for role-based field redactions on phone_calls.
 *
 * Verifies that fieldRedactions configured on a RoleBasedAccessPermission
 * properly hide specified fields from API responses across all read paths
 * (getOne, getSome) and write responses (updateOne).
 */
export const field_redaction_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Field Redaction Tests")

  // Create test data
  const testEnduser = await sdk.api.endusers.createOne({
    fname: 'FieldRedactionTest',
    lname: 'User',
    email: 'field-redaction-test@example.com',
  })

  const testPhoneCall = await sdk.api.phone_calls.createOne({
    enduserId: testEnduser.id,
    inbound: true,
    from: '+15551234567',
    to: '+15559876543',
    isVoicemail: true,
    recordingURI: 'https://example.com/recording.wav',
    recordingId: 'rec_test_123',
    recordingDurationInSeconds: 45,
    transcription: 'Hello, this is a voicemail transcription.',
    recordingTranscriptionData: '{"results":{"transcripts":[{"transcript":"full call transcription data"}]}}',
    aiSummary: 'Patient called about prescription refill.',
  })

  // Create role with full field redactions for phone_calls
  const FULL_ACCESS = { create: 'All' as const, read: 'All' as const, update: 'All' as const, delete: 'All' as const }

  const fullRedactionRole = 'full-redaction-test-role'
  const rbapFull = await sdk.api.role_based_access_permissions.createOne({
    role: fullRedactionRole,
    permissions: { ...PROVIDER_PERMISSIONS, phone_calls: FULL_ACCESS, endusers: FULL_ACCESS },
    fieldRedactions: {
      phone_calls: [...ALL_REDACTABLE_FIELDS],
    },
  })

  const originalRoles = sdkNonAdmin.userInfo.roles

  try {
    // Assign full-redaction role to non-admin
    await sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [fullRedactionRole] }, { replaceObjectFields: true })
    await wait(undefined, 1500)
    await sdkNonAdmin.authenticate(nonAdminEmail!, nonAdminPassword!)

    // ========================================
    // Test 1: Full redaction on getOne
    // ========================================
    log_header("Test 1: Full redaction on getOne")

    await async_test(
      "getOne - all redactable fields should be absent for redacted role",
      () => sdkNonAdmin.api.phone_calls.getOne(testPhoneCall.id),
      {
        onResult: (r: any) => {
          const redacted = lacksFields(r, [...ALL_REDACTABLE_FIELDS])
          const corePresent = hasFields(r, ['enduserId', 'inbound', 'from', 'to'])
          if (!redacted) {
            const leaked = ALL_REDACTABLE_FIELDS.filter(f => f in r && r[f] !== undefined)
            console.log(`  ❌ VULNERABILITY: getOne leaked redacted fields: ${leaked.join(', ')}`)
          } else {
            console.log("  ✅ SAFE: all redactable fields properly redacted on getOne")
          }
          if (!corePresent) {
            console.log("  ❌ ERROR: core fields (enduserId, inbound, from, to) are missing")
          }
          return redacted && corePresent
        }
      }
    )

    // ========================================
    // Test 2: Admin sees all fields
    // ========================================
    log_header("Test 2: Admin sees all fields")

    await async_test(
      "getOne (admin) - all fields should be visible",
      () => sdk.api.phone_calls.getOne(testPhoneCall.id),
      {
        onResult: (r: any) => {
          const allPresent = hasFields(r, [...ALL_REDACTABLE_FIELDS])
          if (!allPresent) {
            const missing = ALL_REDACTABLE_FIELDS.filter(f => !(f in r) || r[f] === undefined)
            console.log(`  ❌ ERROR: admin is missing fields: ${missing.join(', ')}`)
          } else {
            console.log("  ✅ Admin can see all fields")
          }
          return allPresent
        }
      }
    )

    // ========================================
    // Test 3: Partial redaction (recordings only)
    // ========================================
    log_header("Test 3: Partial redaction (recordings only)")

    const partialRedactionRole = 'partial-redaction-test-role'
    const rbapPartial = await sdk.api.role_based_access_permissions.createOne({
      role: partialRedactionRole,
      permissions: { ...PROVIDER_PERMISSIONS, phone_calls: FULL_ACCESS, endusers: FULL_ACCESS },
      fieldRedactions: {
        phone_calls: [...RECORDING_FIELDS],
      },
    })

    try {
      await sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [partialRedactionRole] }, { replaceObjectFields: true })
      await wait(undefined, 1500)
      await sdkNonAdmin.authenticate(nonAdminEmail!, nonAdminPassword!)

      await async_test(
        "getOne - only recording fields should be redacted, transcription/summary visible",
        () => sdkNonAdmin.api.phone_calls.getOne(testPhoneCall.id),
        {
          onResult: (r: any) => {
            const recordingRedacted = lacksFields(r, [...RECORDING_FIELDS])
            const nonRecordingPresent = hasFields(r, ['transcription', 'recordingTranscriptionData', 'aiSummary'])
            if (!recordingRedacted) {
              const leaked = RECORDING_FIELDS.filter(f => f in r && r[f] !== undefined)
              console.log(`  ❌ VULNERABILITY: recording fields leaked: ${leaked.join(', ')}`)
            }
            if (!nonRecordingPresent) {
              const missing = ['transcription', 'recordingTranscriptionData', 'aiSummary'].filter(f => !(f in r) || r[f] === undefined)
              console.log(`  ❌ ERROR: non-redacted fields missing: ${missing.join(', ')}`)
            }
            if (recordingRedacted && nonRecordingPresent) {
              console.log("  ✅ SAFE: partial redaction works correctly")
            }
            return recordingRedacted && nonRecordingPresent
          }
        }
      )
    } finally {
      // Restore full-redaction role and clean up partial role
      await sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [fullRedactionRole] }, { replaceObjectFields: true })
      await wait(undefined, 1500)
      await sdkNonAdmin.authenticate(nonAdminEmail!, nonAdminPassword!)
      await sdk.api.role_based_access_permissions.deleteOne(rbapPartial.id)
    }

    // ========================================
    // Test 4: getSome/readMany consistency
    // ========================================
    log_header("Test 4: getSome/readMany consistency")

    await async_test(
      "getSome - redacted fields should be absent on readMany results",
      () => sdkNonAdmin.api.phone_calls.getSome(),
      {
        onResult: (r: any) => {
          const matches = r.filter((pc: any) => pc.id === testPhoneCall.id)
          if (matches.length === 0) {
            console.log("  ⚠️ SKIPPED: test phone call not found in getSome results")
            return true
          }
          const record = matches[0]
          const redacted = lacksFields(record, [...ALL_REDACTABLE_FIELDS])
          if (!redacted) {
            const leaked = ALL_REDACTABLE_FIELDS.filter(f => f in record && record[f] !== undefined)
            console.log(`  ❌ VULNERABILITY: getSome leaked redacted fields: ${leaked.join(', ')}`)
          } else {
            console.log("  ✅ SAFE: getSome properly redacts fields")
          }
          return redacted
        }
      }
    )

    await async_test(
      "getSome (admin) - all fields should be visible",
      () => sdk.api.phone_calls.getSome(),
      {
        onResult: (r: any) => {
          const match = r.find((pc: any) => pc.id === testPhoneCall.id)
          if (!match) {
            console.log("  ⚠️ SKIPPED: test phone call not found in admin getSome results")
            return true
          }
          const allPresent = hasFields(match, [...ALL_REDACTABLE_FIELDS])
          if (!allPresent) {
            const missing = ALL_REDACTABLE_FIELDS.filter(f => !(f in match) || match[f] === undefined)
            console.log(`  ❌ FALSE POSITIVE: admin getSome missing fields: ${missing.join(', ')}`)
          } else {
            console.log("  ✅ Admin getSome sees all fields")
          }
          return allPresent
        }
      }
    )

    // ========================================
    // Test 5: Update response doesn't leak
    // ========================================
    log_header("Test 5: Update response doesn't leak redacted fields")

    await async_test(
      "updateOne - response should not contain redacted fields",
      () => sdkNonAdmin.api.phone_calls.updateOne(testPhoneCall.id, { note: 'updated by redaction test' }),
      {
        onResult: (r: any) => {
          const redacted = lacksFields(r, [...ALL_REDACTABLE_FIELDS])
          if (!redacted) {
            const leaked = ALL_REDACTABLE_FIELDS.filter(f => f in r && r[f] !== undefined)
            console.log(`  ❌ VULNERABILITY: updateOne response leaked redacted fields: ${leaked.join(', ')}`)
          } else {
            console.log("  ✅ SAFE: updateOne response does not contain redacted fields")
          }
          return redacted
        }
      }
    )

    await async_test(
      "updateOne (admin) - all fields should be visible in response",
      () => sdk.api.phone_calls.updateOne(testPhoneCall.id, { note: 'admin update test' }),
      {
        onResult: (r: any) => {
          const allPresent = hasFields(r, [...ALL_REDACTABLE_FIELDS])
          if (!allPresent) {
            const missing = ALL_REDACTABLE_FIELDS.filter(f => !(f in r) || r[f] === undefined)
            console.log(`  ❌ FALSE POSITIVE: admin updateOne missing fields: ${missing.join(', ')}`)
          } else {
            console.log("  ✅ Admin updateOne sees all fields")
          }
          return allPresent
        }
      }
    )

    // ========================================
    // Test 6: Create response doesn't leak
    // ========================================
    log_header("Test 6: Create response doesn't leak redacted fields")

    let createdPhoneCallId: string | undefined
    await async_test(
      "createOne - response should not contain redacted fields",
      () => sdkNonAdmin.api.phone_calls.createOne({
        enduserId: testEnduser.id,
        inbound: false,
        from: '+15551111111',
        to: '+15552222222',
        recordingURI: 'https://example.com/leak-test.wav',
        recordingId: 'rec_leak_test',
        recordingDurationInSeconds: 10,
        transcription: 'Leak test transcription.',
        recordingTranscriptionData: '{"test":"data"}',
        aiSummary: 'Leak test summary.',
      }),
      {
        onResult: (r: any) => {
          createdPhoneCallId = r.id
          const redacted = lacksFields(r, [...ALL_REDACTABLE_FIELDS])
          if (!redacted) {
            const leaked = ALL_REDACTABLE_FIELDS.filter(f => f in r && r[f] !== undefined)
            console.log(`  ❌ VULNERABILITY: createOne response leaked redacted fields: ${leaked.join(', ')}`)
          } else {
            console.log("  ✅ SAFE: createOne response does not contain redacted fields")
          }
          return redacted
        }
      }
    )
    // Cleanup the created phone call
    if (createdPhoneCallId) {
      try { await sdk.api.phone_calls.deleteOne(createdPhoneCallId) } catch(e) {}
    }

    let adminCreatedPhoneCallId: string | undefined
    await async_test(
      "createOne (admin) - all fields should be visible in response",
      () => sdk.api.phone_calls.createOne({
        enduserId: testEnduser.id,
        inbound: false,
        from: '+15553333333',
        to: '+15554444444',
        recordingURI: 'https://example.com/admin-test.wav',
        recordingId: 'rec_admin_test',
        recordingDurationInSeconds: 20,
        transcription: 'Admin create test transcription.',
        recordingTranscriptionData: '{"admin":"test"}',
        aiSummary: 'Admin create test summary.',
      }),
      {
        onResult: (r: any) => {
          adminCreatedPhoneCallId = r.id
          const allPresent = hasFields(r, [...ALL_REDACTABLE_FIELDS])
          if (!allPresent) {
            const missing = ALL_REDACTABLE_FIELDS.filter(f => !(f in r) || r[f] === undefined)
            console.log(`  ❌ FALSE POSITIVE: admin createOne missing fields: ${missing.join(', ')}`)
          } else {
            console.log("  ✅ Admin createOne sees all fields")
          }
          return allPresent
        }
      }
    )
    if (adminCreatedPhoneCallId) {
      try { await sdk.api.phone_calls.deleteOne(adminCreatedPhoneCallId) } catch(e) {}
    }

    // ========================================
    // Test 7: bulk_load redaction
    // ========================================
    log_header("Test 7: bulk_load redaction")

    await async_test(
      "bulk_load - redacted fields should be absent",
      () => sdkNonAdmin.bulk_load({ load: [{ model: 'phone_calls' as any, options: { limit: 100 } }] }),
      {
        onResult: (r: any) => {
          const phoneCallResult = r.results[0]
          if (!phoneCallResult || phoneCallResult.records.length === 0) {
            console.log("  ⚠️ SKIPPED: no phone_calls returned from bulk_load")
            return true
          }
          const match = phoneCallResult.records.find((pc: any) => pc.id === testPhoneCall.id)
          if (!match) {
            console.log("  ⚠️ SKIPPED: test phone call not found in bulk_load results")
            return true
          }
          const redacted = lacksFields(match, [...ALL_REDACTABLE_FIELDS])
          if (!redacted) {
            const leaked = ALL_REDACTABLE_FIELDS.filter(f => f in match && match[f] !== undefined)
            console.log(`  ❌ VULNERABILITY: bulk_load leaked redacted fields: ${leaked.join(', ')}`)
          } else {
            console.log("  ✅ SAFE: bulk_load properly redacts fields")
          }
          return redacted
        }
      }
    )

    await async_test(
      "bulk_load (admin) - all fields should be visible",
      () => sdk.bulk_load({ load: [{ model: 'phone_calls' as any, options: { limit: 100 } }] }),
      {
        onResult: (r: any) => {
          const phoneCallResult = r.results[0]
          if (!phoneCallResult || phoneCallResult.records.length === 0) {
            console.log("  ⚠️ SKIPPED: no phone_calls returned from admin bulk_load")
            return true
          }
          const match = phoneCallResult.records.find((pc: any) => pc.id === testPhoneCall.id)
          if (!match) {
            console.log("  ⚠️ SKIPPED: test phone call not found in admin bulk_load results")
            return true
          }
          const allPresent = hasFields(match, [...ALL_REDACTABLE_FIELDS])
          if (!allPresent) {
            const missing = ALL_REDACTABLE_FIELDS.filter(f => !(f in match) || match[f] === undefined)
            console.log(`  ❌ FALSE POSITIVE: admin bulk_load missing fields: ${missing.join(', ')}`)
          } else {
            console.log("  ✅ Admin bulk_load sees all fields")
          }
          return allPresent
        }
      }
    )

    // ========================================
    // Test 7b: bulk-read (getByIds) redaction
    // ========================================
    log_header("Test 7b: bulk-read (getByIds) redaction")

    await async_test(
      "getByIds - redacted fields should be absent",
      () => sdkNonAdmin.api.phone_calls.getByIds({ ids: [testPhoneCall.id] }),
      {
        onResult: (r: any) => {
          if (!r.matches || r.matches.length === 0) {
            console.log("  ⚠️ SKIPPED: no phone_calls returned from getByIds")
            return true
          }
          const match = r.matches.find((pc: any) => pc.id === testPhoneCall.id)
          if (!match) {
            console.log("  ⚠️ SKIPPED: test phone call not found in getByIds results")
            return true
          }
          const redacted = lacksFields(match, [...ALL_REDACTABLE_FIELDS])
          if (!redacted) {
            const leaked = ALL_REDACTABLE_FIELDS.filter(f => f in match && match[f] !== undefined)
            console.log(`  ❌ VULNERABILITY: getByIds leaked redacted fields: ${leaked.join(', ')}`)
          } else {
            console.log("  ✅ SAFE: getByIds properly redacts fields")
          }
          return redacted
        }
      }
    )

    await async_test(
      "getByIds (admin) - all fields should be visible",
      () => sdk.api.phone_calls.getByIds({ ids: [testPhoneCall.id] }),
      {
        onResult: (r: any) => {
          if (!r.matches || r.matches.length === 0) {
            console.log("  ⚠️ SKIPPED: no phone_calls returned from admin getByIds")
            return true
          }
          const match = r.matches.find((pc: any) => pc.id === testPhoneCall.id)
          if (!match) {
            console.log("  ⚠️ SKIPPED: test phone call not found in admin getByIds results")
            return true
          }
          const allPresent = hasFields(match, [...ALL_REDACTABLE_FIELDS])
          if (!allPresent) {
            const missing = ALL_REDACTABLE_FIELDS.filter(f => !(f in match) || match[f] === undefined)
            console.log(`  ❌ FALSE POSITIVE: admin getByIds missing fields: ${missing.join(', ')}`)
          } else {
            console.log("  ✅ Admin getByIds sees all fields")
          }
          return allPresent
        }
      }
    )

    // ========================================
    // Test 8: load_inbox_data redaction
    // ========================================
    log_header("Test 8: load_inbox_data redaction")

    await async_test(
      "load_inbox_data - phone_calls should have redacted fields absent",
      () => sdkNonAdmin.api.endusers.load_inbox_data({ enduserIds: [testEnduser.id] }),
      {
        onResult: (r: any) => {
          if (!r.phone_calls || r.phone_calls.length === 0) {
            console.log("  ⚠️ SKIPPED: no phone_calls returned from load_inbox_data")
            return true
          }
          const match = r.phone_calls.find((pc: any) => pc.id === testPhoneCall.id)
          if (!match) {
            console.log("  ⚠️ SKIPPED: test phone call not found in load_inbox_data results")
            return true
          }
          const redacted = lacksFields(match, [...ALL_REDACTABLE_FIELDS])
          if (!redacted) {
            const leaked = ALL_REDACTABLE_FIELDS.filter(f => f in match && match[f] !== undefined)
            console.log(`  ❌ VULNERABILITY: load_inbox_data leaked redacted fields: ${leaked.join(', ')}`)
          } else {
            console.log("  ✅ SAFE: load_inbox_data properly redacts phone_call fields")
          }
          return redacted
        }
      }
    )

    await async_test(
      "load_inbox_data (admin) - all phone_call fields should be visible",
      () => sdk.api.endusers.load_inbox_data({ enduserIds: [testEnduser.id] }),
      {
        onResult: (r: any) => {
          if (!r.phone_calls || r.phone_calls.length === 0) {
            console.log("  ⚠️ SKIPPED: no phone_calls returned from admin load_inbox_data")
            return true
          }
          const match = r.phone_calls.find((pc: any) => pc.id === testPhoneCall.id)
          if (!match) {
            console.log("  ⚠️ SKIPPED: test phone call not found in admin load_inbox_data results")
            return true
          }
          const allPresent = hasFields(match, [...ALL_REDACTABLE_FIELDS])
          if (!allPresent) {
            const missing = ALL_REDACTABLE_FIELDS.filter(f => !(f in match) || match[f] === undefined)
            console.log(`  ❌ FALSE POSITIVE: admin load_inbox_data missing fields: ${missing.join(', ')}`)
          } else {
            console.log("  ✅ Admin load_inbox_data sees all phone_call fields")
          }
          return allPresent
        }
      }
    )

    // ========================================
    // Test 9: No-redaction role sees all fields
    // ========================================
    log_header("Test 9: Role without fieldRedactions sees all fields")

    const noRedactionRole = 'no-redaction-test-role'
    const rbapNoRedaction = await sdk.api.role_based_access_permissions.createOne({
      role: noRedactionRole,
      permissions: { ...PROVIDER_PERMISSIONS, phone_calls: FULL_ACCESS, endusers: FULL_ACCESS },
      // No fieldRedactions
    })

    try {
      await sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [noRedactionRole] }, { replaceObjectFields: true })
      await wait(undefined, 1500)
      await sdkNonAdmin.authenticate(nonAdminEmail!, nonAdminPassword!)

      await async_test(
        "getOne - role without fieldRedactions should see all fields",
        () => sdkNonAdmin.api.phone_calls.getOne(testPhoneCall.id),
        {
          onResult: (r: any) => {
            const allPresent = hasFields(r, [...ALL_REDACTABLE_FIELDS])
            if (!allPresent) {
              const missing = ALL_REDACTABLE_FIELDS.filter(f => !(f in r) || r[f] === undefined)
              console.log(`  ❌ ERROR: no-redaction role is missing fields: ${missing.join(', ')}`)
            } else {
              console.log("  ✅ No-redaction role can see all fields")
            }
            return allPresent
          }
        }
      )
    } finally {
      await sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [fullRedactionRole] }, { replaceObjectFields: true })
      await wait(undefined, 1500)
      await sdkNonAdmin.authenticate(nonAdminEmail!, nonAdminPassword!)
      await sdk.api.role_based_access_permissions.deleteOne(rbapNoRedaction.id)
    }

    // ========================================
    // Test 10: Redaction scoped to model
    // ========================================
    log_header("Test 10: phone_calls redaction doesn't affect other models")

    await async_test(
      "enduser read - phone_calls fieldRedactions should not affect enduser fields",
      () => sdkNonAdmin.api.endusers.getOne(testEnduser.id),
      {
        onResult: (r: any) => {
          const corePresent = hasFields(r, ['fname', 'lname', 'email'])
          if (!corePresent) {
            console.log("  ❌ ERROR: enduser fields missing — phone_calls redaction may be leaking across models")
          } else {
            console.log("  ✅ SAFE: phone_calls redaction does not affect enduser fields")
          }
          return corePresent
        }
      }
    )

    // ========================================
    // Test 11: data-sync redaction
    // ========================================
    log_header("Test 11: data-sync redaction")

    const syncFrom = new Date(0) // far enough back to capture the test phone call

    await async_test(
      "data-sync - redacted fields should be absent in parsed data",
      () => sdkNonAdmin.sync({ from: syncFrom }),
      {
        onResult: (r: any) => {
          const match = r.results.find((rec: any) => rec.recordId === testPhoneCall.id && rec.modelName === 'phone_calls')
          if (!match) {
            console.log("  ⚠️ SKIPPED: test phone call not found in data-sync results")
            return true
          }
          if (match.data === 'deleted') {
            console.log("  ⚠️ SKIPPED: test phone call marked as deleted in data-sync")
            return true
          }
          const parsed = JSON.parse(match.data)
          const redacted = lacksFields(parsed, [...ALL_REDACTABLE_FIELDS])
          const corePresent = hasFields(parsed, ['enduserId', 'inbound', 'from', 'to'])
          if (!redacted) {
            const leaked = ALL_REDACTABLE_FIELDS.filter(f => f in parsed && parsed[f] !== undefined)
            console.log(`  ❌ VULNERABILITY: data-sync leaked redacted fields: ${leaked.join(', ')}`)
          } else {
            console.log("  ✅ SAFE: data-sync properly redacts fields in parsed data")
          }
          if (!corePresent) {
            console.log("  ❌ ERROR: core fields (enduserId, inbound, from, to) are missing from data-sync record")
          }
          return redacted && corePresent
        }
      }
    )

    await async_test(
      "data-sync (admin) - all fields should be visible in parsed data",
      () => sdk.sync({ from: syncFrom }),
      {
        onResult: (r: any) => {
          const match = r.results.find((rec: any) => rec.recordId === testPhoneCall.id && rec.modelName === 'phone_calls')
          if (!match) {
            console.log("  ⚠️ SKIPPED: test phone call not found in admin data-sync results")
            return true
          }
          if (match.data === 'deleted') {
            console.log("  ⚠️ SKIPPED: test phone call marked as deleted in admin data-sync")
            return true
          }
          const parsed = JSON.parse(match.data)
          const allPresent = hasFields(parsed, [...ALL_REDACTABLE_FIELDS])
          if (!allPresent) {
            const missing = ALL_REDACTABLE_FIELDS.filter(f => !(f in parsed) || parsed[f] === undefined)
            console.log(`  ❌ FALSE POSITIVE: admin data-sync missing fields: ${missing.join(', ')}`)
          } else {
            console.log("  ✅ Admin data-sync sees all fields")
          }
          return allPresent
        }
      }
    )

    console.log("\n" + "=".repeat(60))
    console.log("Field Redaction Tests Complete")
    console.log("=".repeat(60))

  } finally {
    // Restore original roles
    await sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: originalRoles }, { replaceObjectFields: true })
    await wait(undefined, 1000)
    await sdkNonAdmin.authenticate(nonAdminEmail!, nonAdminPassword!)

    // Cleanup test data
    try { await sdk.api.role_based_access_permissions.deleteOne(rbapFull.id) } catch(e) { console.error('Cleanup error (rbap):', e) }
    try { await sdk.api.phone_calls.deleteOne(testPhoneCall.id) } catch(e) { console.error('Cleanup error (phone_call):', e) }
    try { await sdk.api.endusers.deleteOne(testEnduser.id) } catch(e) { console.error('Cleanup error (enduser):', e) }
  }
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await field_redaction_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Field redaction test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Field redaction test suite failed:", error)
      process.exit(1)
    })
}
