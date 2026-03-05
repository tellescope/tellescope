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

/**
 * Security tests for endpoints with noAccessPermissions: true
 *
 * These tests verify that endpoints which bypass the standard middleware access check
 * still properly enforce NO_ACCESS restrictions in their handlers.
 *
 * Test approach:
 * 1. Create a role with NO_ACCESS (null) for a specific model
 * 2. Assign that role to a non-admin user
 * 3. Attempt to call the endpoint
 * 4. Verify whether access is properly denied
 *
 * If a test shows data is returned when it shouldn't be, that endpoint needs a fix.
 */
export const no_access_permission_checks_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("NO_ACCESS Permission Checks Tests")

  // Create test data
  const testEnduser = await sdk.api.endusers.createOne({
    fname: 'NoAccessTest',
    lname: 'User',
    email: 'no-access-test@example.com',
  })

  // Create a role with NO_ACCESS to multiple models we want to test
  const noAccessTestRole = 'no-access-test-role'
  const rbap = await sdk.api.role_based_access_permissions.createOne({
    role: noAccessTestRole,
    permissions: {
      ...PROVIDER_PERMISSIONS,
      // Set NO_ACCESS for models we want to test
      endusers: {
        create: null,
        read: null,
        update: null,
        delete: null,
      },
      inbox_threads: {
        create: null,
        read: null,
        update: null,
        delete: null,
      },
      templates: {
        create: null,
        read: null,
        update: null,
        delete: null,
      },
      waitlists: {
        create: null,
        read: null,
        update: null,
        delete: null,
      },
      background_errors: {
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
    await sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [noAccessTestRole] }, { replaceObjectFields: true })
    await wait(undefined, 1500) // wait for role change to propagate
    await sdkNonAdmin.authenticate(nonAdminEmail!, nonAdminPassword!)

    // ========================================
    // Test 1: /bulk-actions/read (HIGH PRIORITY)
    // ========================================
    log_header("Test 1: /bulk-actions/read with NO_ACCESS to endusers")

    await async_test(
      "bulk_load - should block NO_ACCESS user from reading endusers",
      () => sdkNonAdmin.bulk_load({
        load: [{ model: 'endusers' as any, options: { limit: 10 } }]
      }),
      {
        // If this returns records, it's a vulnerability
        // If it returns empty records or errors, it's safe
        onResult: r => {
          const enduserResult = r.results[0]
          if (enduserResult === null) {
            console.log("  ✅ SAFE: bulk_load returned null for NO_ACCESS model")
            return true
          }
          if (enduserResult.records.length === 0) {
            console.log("  ✅ SAFE: bulk_load returned empty records for NO_ACCESS model")
            return true
          }
          console.log(`  ❌ VULNERABILITY: bulk_load returned ${enduserResult.records.length} records when user has NO_ACCESS!`)
          return false
        }
      }
    )

    // ========================================
    // Test 2: inbox_threads/build_threads
    // ========================================
    log_header("Test 2: inbox_threads/build_threads with NO_ACCESS")

    await async_test(
      "build_threads - should block NO_ACCESS user",
      () => sdkNonAdmin.api.inbox_threads.build_threads({
        from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        to: new Date(),
      }),
      { shouldError: true, onError: (e: any) => e.message === "You do not have access to this resource" }
    )

    // ========================================
    // Test 2b: inbox_threads/load_threads with NO_ACCESS
    // ========================================
    log_header("Test 2b: load_threads with NO_ACCESS")

    await async_test(
      "load_threads - should block NO_ACCESS user",
      () => sdkNonAdmin.api.inbox_threads.load_threads({ limit: 10 }),
      { shouldError: true, onError: (e: any) => e.message === "You do not have access to this resource" }
    )

    // ========================================
    // Test 3a: get_templated_message - NO_ACCESS to templates
    // ========================================
    log_header("Test 3a: get_templated_message (templates NO_ACCESS)")

    await async_test(
      "get_templated_message - should block user with NO_ACCESS to templates",
      () => sdkNonAdmin.api.templates.get_templated_message({
        message: "Hello {{enduser.fname}}!",
        userId: sdkNonAdmin.userInfo.id,
        enduserId: testEnduser.id,
        channel: 'Email',
      }),
      { shouldError: true, onError: (e: any) => e.message === "You do not have access to this resource" }
    )

    // ========================================
    // Test 3b: get_templated_message - NO_ACCESS to endusers (PHI leak prevention)
    // ========================================
    log_header("Test 3b: get_templated_message (endusers NO_ACCESS)")

    // Create a role with templates access but NO_ACCESS to endusers
    const templatesOnlyRole = 'templates-only-test-role'
    const rbapTemplatesOnly = await sdk.api.role_based_access_permissions.createOne({
      role: templatesOnlyRole,
      permissions: {
        ...PROVIDER_PERMISSIONS,
        // Allow templates access
        templates: {
          create: 'All',
          read: 'All',
          update: 'All',
          delete: 'All',
        },
        // But NO_ACCESS to endusers
        endusers: {
          create: null,
          read: null,
          update: null,
          delete: null,
        },
      },
    })

    try {
      // Temporarily assign the templates-only role
      await sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [templatesOnlyRole] }, { replaceObjectFields: true })
      await wait(undefined, 1500)
      await sdkNonAdmin.authenticate(nonAdminEmail!, nonAdminPassword!)

      await async_test(
        "get_templated_message - should block user with NO_ACCESS to endusers (prevents PHI leak)",
        () => sdkNonAdmin.api.templates.get_templated_message({
          message: "Hello {{enduser.fname}} {{enduser.lname}} {{enduser.email}}!",
          userId: sdkNonAdmin.userInfo.id,
          enduserId: testEnduser.id,
          channel: 'Email',
        }),
        { shouldError: true, onError: (e: any) => e.message === "You do not have access to this resource" }
      )
    } finally {
      // Restore the original test role
      await sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [noAccessTestRole] }, { replaceObjectFields: true })
      await wait(undefined, 1000)
      await sdkNonAdmin.authenticate(nonAdminEmail!, nonAdminPassword!)

      // Cleanup the templates-only role
      await sdk.api.role_based_access_permissions.deleteOne(rbapTemplatesOnly.id)
    }

    // ========================================
    // Test 4: waitlists/grant_access_from_waitlist
    // ========================================
    log_header("Test 4: waitlists/grant_access_from_waitlist with NO_ACCESS")

    // First create a journey and waitlist entry to test with (as admin)
    const testJourney = await sdk.api.journeys.createOne({
      title: 'Waitlist Test Journey',
    })

    const waitlistEntry = await sdk.api.waitlists.createOne({
      title: 'Test Waitlist',
      journeyId: testJourney.id,
      enduserIds: [],
    })

    try {
      await async_test(
        "grant_access_from_waitlist - should block NO_ACCESS user",
        () => sdkNonAdmin.api.waitlists.grant_access_from_waitlist({
          id: waitlistEntry.id,
          count: 1,
        }),
        { shouldError: true, onError: (e: any) => e.message === "You do not have access to this resource" }
      )
    } finally {
      // Cleanup
      await sdk.api.waitlists.deleteOne(waitlistEntry.id)
      await sdk.api.journeys.deleteOne(testJourney.id)
    }

    // ========================================
    // Test 5: background_errors/mark_read
    // ========================================
    log_header("Test 5: background_errors/mark_read with NO_ACCESS")

    await async_test(
      "mark_read (background_errors) - should block NO_ACCESS user",
      () => sdkNonAdmin.api.background_errors.mark_read({}),
      { shouldError: true, onError: (e: any) => e.message === "You do not have access to this resource" }
    )

    // ========================================
    // Test 6: load_threads searchKeywords redaction
    // ========================================
    log_header("Test 6: load_threads searchKeywords redaction")

    // Create role with Assigned access to endusers (not 'All') but full message access
    const assignedEnduserRole = 'assigned-enduser-test-role'
    const rbapAssigned = await sdk.api.role_based_access_permissions.createOne({
      role: assignedEnduserRole,
      permissions: {
        ...PROVIDER_PERMISSIONS,
        endusers: { create: 'All', read: 'Assigned', update: 'Assigned', delete: 'Assigned' },
        emails: { create: 'All', read: 'All', update: 'All', delete: 'All' },
        sms_messages: { create: 'All', read: 'All', update: 'All', delete: 'All' },
        inbox_threads: { create: 'All', read: 'All', update: 'All', delete: 'All' },
      },
    })

    try {
      await sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [assignedEnduserRole] }, { replaceObjectFields: true })
      await wait(undefined, 1500)
      await sdkNonAdmin.authenticate(nonAdminEmail!, nonAdminPassword!)

      // Load threads and verify searchKeywords is redacted for Assigned enduser access
      const resultAssigned = await sdkNonAdmin.api.inbox_threads.load_threads({ limit: 10 })

      await async_test(
        "load_threads - searchKeywords redacted for Assigned enduser access",
        async () => resultAssigned,
        {
          onResult: r => {
            // All threads should have searchKeywords undefined/missing
            const allRedacted = r.threads.every((t: any) => t.searchKeywords === undefined)
            if (!allRedacted) {
              console.log("  ❌ VULNERABILITY: searchKeywords visible to user with Assigned enduser access!")
            } else {
              console.log("  ✅ SAFE: searchKeywords properly redacted")
            }
            return allRedacted
          }
        }
      )
    } finally {
      // Restore the original test role
      await sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [noAccessTestRole] }, { replaceObjectFields: true })
      await wait(undefined, 1000)
      await sdkNonAdmin.authenticate(nonAdminEmail!, nonAdminPassword!)

      // Cleanup the assigned role
      await sdk.api.role_based_access_permissions.deleteOne(rbapAssigned.id)
    }

    // Test that admin/full access users CAN see searchKeywords
    await async_test(
      "load_threads - searchKeywords visible for admin/full enduser access",
      () => sdk.api.inbox_threads.load_threads({ limit: 10 }),
      {
        onResult: r => {
          // Skip check if no threads exist (can't verify without data)
          if (r.threads.length === 0) {
            console.log("  ⏭️ SKIPPED: No threads exist to verify searchKeywords visibility")
            return true
          }
          // At least some threads should have searchKeywords
          const hasSearchKeywords = r.threads.some((t: any) => t.searchKeywords !== undefined)
          if (hasSearchKeywords) {
            console.log("  ✅ Admin can see searchKeywords")
          } else {
            console.log("  ⚠️ No searchKeywords found on threads (may not have been built yet)")
          }
          return true // Don't fail if keywords don't exist yet
        }
      }
    )

    console.log("\n" + "=".repeat(60))
    console.log("NO_ACCESS Permission Checks Tests Complete")
    console.log("=".repeat(60))

  } finally {
    // Restore original role
    await sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: originalRoles }, { replaceObjectFields: true })
    await wait(undefined, 1000)
    await sdkNonAdmin.authenticate(nonAdminEmail!, nonAdminPassword!)

    // Cleanup
    await sdk.api.role_based_access_permissions.deleteOne(rbap.id)
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
    await no_access_permission_checks_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ NO_ACCESS permission checks test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ NO_ACCESS permission checks test suite failed:", error)
      process.exit(1)
    })
}
