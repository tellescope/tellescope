require('source-map-support').install();

import { Session, EnduserSession } from "../../sdk"
import {
  assert,
  async_test,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const
const businessId = '60398b1131a295e64f084ff6'

/**
 * Tests for managed_content_records enduser access filtering.
 * Validates that the backend correctly filters content based on:
 * 1. assignmentType: 'All' - visible to all endusers
 * 2. enduserId match - direct individual assignment
 * 3. ManagedContentRecordAssignment - manual assignments
 * 4. assignmentType: 'By Tags' + tag overlap - tag-based assignment
 * 5. CalendarEvent.sharedContentIds - content shared via events
 *
 * Also verifies that filtering does NOT apply to user sessions.
 */
export const managed_content_enduser_access_tests = async ({ sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Managed Content Enduser Access Tests")

  // Track resources for cleanup
  const contentRecordIds: string[] = []
  const assignmentIds: string[] = []
  const calendarEventIds: string[] = []
  let testEnduserId: string | undefined
  let otherEnduserId: string | undefined
  let enduserSDK: EnduserSession | undefined
  let otherEnduserSDK: EnduserSession | undefined

  try {
    // ===== SETUP =====
    console.log("Setting up test data...")

    // Create two test endusers
    const testEnduser = await sdk.api.endusers.createOne({
      email: `mcr_access_test_${Date.now()}@test.tellescope.com`,
      tags: ['premium', 'diabetes-management']
    })
    testEnduserId = testEnduser.id
    await sdk.api.endusers.set_password({ id: testEnduser.id, password: 'TestPassword123!' })

    const otherEnduser = await sdk.api.endusers.createOne({
      email: `mcr_access_other_${Date.now()}@test.tellescope.com`,
      tags: ['basic'] // Different tags
    })
    otherEnduserId = otherEnduser.id
    await sdk.api.endusers.set_password({ id: otherEnduser.id, password: 'TestPassword123!' })

    // Create and authenticate enduser sessions
    enduserSDK = new EnduserSession({ host, businessId })
    await enduserSDK.authenticate(testEnduser.email!, 'TestPassword123!')

    otherEnduserSDK = new EnduserSession({ host, businessId })
    await otherEnduserSDK.authenticate(otherEnduser.email!, 'TestPassword123!')

    // Create managed content records with different assignment types

    // 1. Content with assignmentType: 'All'
    const contentAll = await sdk.api.managed_content_records.createOne({
      title: 'Content for All',
      htmlContent: '<p>All users</p>',
      textContent: 'All users',
      assignmentType: 'All',
      publicRead: true,
    })
    contentRecordIds.push(contentAll.id)

    // 2. Content with direct enduserId assignment (to testEnduser)
    const contentDirect = await sdk.api.managed_content_records.createOne({
      title: 'Content Direct Assignment',
      htmlContent: '<p>Direct</p>',
      textContent: 'Direct',
      enduserId: testEnduser.id,
      publicRead: true,
    })
    contentRecordIds.push(contentDirect.id)

    // 3. Content with By Tags assignment (matching testEnduser tags)
    const contentByTagsMatch = await sdk.api.managed_content_records.createOne({
      title: 'Content By Tags Match',
      htmlContent: '<p>Tags</p>',
      textContent: 'Tags',
      assignmentType: 'By Tags',
      tags: ['diabetes-management'], // Matches testEnduser
      publicRead: true,
    })
    contentRecordIds.push(contentByTagsMatch.id)

    // 4. Content with By Tags assignment (NOT matching testEnduser tags)
    const contentByTagsNoMatch = await sdk.api.managed_content_records.createOne({
      title: 'Content By Tags No Match',
      htmlContent: '<p>Tags No Match</p>',
      textContent: 'Tags No Match',
      assignmentType: 'By Tags',
      tags: ['cardiac-care'], // Does NOT match testEnduser
      publicRead: true,
    })
    contentRecordIds.push(contentByTagsNoMatch.id)

    // 5. Content without any assignment criteria (should NOT be visible)
    const contentNoAssignment = await sdk.api.managed_content_records.createOne({
      title: 'Content No Assignment',
      htmlContent: '<p>No assignment</p>',
      textContent: 'No assignment',
      publicRead: true,
      // No assignmentType, no enduserId, no tags
    })
    contentRecordIds.push(contentNoAssignment.id)

    // 6. Content for manual assignment (via ManagedContentRecordAssignment)
    const contentManualAssignment = await sdk.api.managed_content_records.createOne({
      title: 'Content Manual Assignment',
      htmlContent: '<p>Manual</p>',
      textContent: 'Manual',
      publicRead: true,
    })
    contentRecordIds.push(contentManualAssignment.id)

    // Create manual assignment
    const assignment = await sdk.api.managed_content_record_assignments.createOne({
      contentId: contentManualAssignment.id,
      enduserId: testEnduser.id,
    })
    assignmentIds.push(assignment.id)

    // 7. Content shared via CalendarEvent
    const contentViaEvent = await sdk.api.managed_content_records.createOne({
      title: 'Content Via Event',
      htmlContent: '<p>Event</p>',
      textContent: 'Event',
      publicRead: true,
    })
    contentRecordIds.push(contentViaEvent.id)

    // Create calendar event with testEnduser as attendee and sharedContentIds
    const calendarEvent = await sdk.api.calendar_events.createOne({
      title: 'Test Event with Shared Content',
      startTimeInMS: Date.now() + 86400000, // Tomorrow
      durationInMinutes: 60,
      attendees: [{ id: testEnduser.id, type: 'enduser' }],
      sharedContentIds: [contentViaEvent.id],
    })
    calendarEventIds.push(calendarEvent.id)

    console.log("Test data created successfully")
    console.log(`- Created ${contentRecordIds.length} content records`)
    console.log(`- Created ${assignmentIds.length} manual assignments`)
    console.log(`- Created ${calendarEventIds.length} calendar events`)

    // ===== TEST CASES =====

    // Test 1: Content with assignmentType: 'All' visible to enduser
    await async_test(
      'assignmentType All - visible to enduser',
      async () => {
        const results = await enduserSDK!.api.managed_content_records.getSome({
          filter: { title: 'Content for All' }
        })
        return results.length === 1 && results[0].id === contentAll.id
      },
      { onResult: (result) => result === true }
    )

    // Test 2: Direct enduserId assignment - visible to assigned enduser
    await async_test(
      'direct enduserId - visible to assigned enduser',
      async () => {
        const results = await enduserSDK!.api.managed_content_records.getSome({
          filter: { title: 'Content Direct Assignment' }
        })
        return results.length === 1 && results[0].id === contentDirect.id
      },
      { onResult: (result) => result === true }
    )

    // Test 3: Direct enduserId assignment - NOT visible to other enduser
    await async_test(
      'direct enduserId - NOT visible to other enduser',
      async () => {
        const results = await otherEnduserSDK!.api.managed_content_records.getSome({
          filter: { title: 'Content Direct Assignment' }
        })
        return results.length === 0
      },
      { onResult: (result) => result === true }
    )

    // Test 4: By Tags with matching tags - visible to enduser
    await async_test(
      'By Tags match - visible to enduser',
      async () => {
        const results = await enduserSDK!.api.managed_content_records.getSome({
          filter: { title: 'Content By Tags Match' }
        })
        return results.length === 1 && results[0].id === contentByTagsMatch.id
      },
      { onResult: (result) => result === true }
    )

    // Test 5: By Tags with non-matching tags - NOT visible to enduser
    await async_test(
      'By Tags no match - NOT visible to enduser',
      async () => {
        const results = await enduserSDK!.api.managed_content_records.getSome({
          filter: { title: 'Content By Tags No Match' }
        })
        return results.length === 0
      },
      { onResult: (result) => result === true }
    )

    // Test 6: Content without assignment criteria - NOT visible to enduser
    await async_test(
      'no assignment criteria - NOT visible to enduser',
      async () => {
        const results = await enduserSDK!.api.managed_content_records.getSome({
          filter: { title: 'Content No Assignment' }
        })
        return results.length === 0
      },
      { onResult: (result) => result === true }
    )

    // Test 7: Manual assignment via ManagedContentRecordAssignment - visible to enduser
    await async_test(
      'manual assignment - visible to assigned enduser',
      async () => {
        const results = await enduserSDK!.api.managed_content_records.getSome({
          filter: { title: 'Content Manual Assignment' }
        })
        return results.length === 1 && results[0].id === contentManualAssignment.id
      },
      { onResult: (result) => result === true }
    )

    // Test 8: Manual assignment - NOT visible to other enduser
    await async_test(
      'manual assignment - NOT visible to other enduser',
      async () => {
        const results = await otherEnduserSDK!.api.managed_content_records.getSome({
          filter: { title: 'Content Manual Assignment' }
        })
        return results.length === 0
      },
      { onResult: (result) => result === true }
    )

    // Test 9: Content shared via CalendarEvent - visible to event attendee
    await async_test(
      'event sharedContentIds - visible to attendee',
      async () => {
        const results = await enduserSDK!.api.managed_content_records.getSome({
          filter: { title: 'Content Via Event' }
        })
        return results.length === 1 && results[0].id === contentViaEvent.id
      },
      { onResult: (result) => result === true }
    )

    // Test 10: Content shared via CalendarEvent - NOT visible to non-attendee
    await async_test(
      'event sharedContentIds - NOT visible to non-attendee',
      async () => {
        const results = await otherEnduserSDK!.api.managed_content_records.getSome({
          filter: { title: 'Content Via Event' }
        })
        return results.length === 0
      },
      { onResult: (result) => result === true }
    )

    // Test 11: User session can see ALL content (no filtering applied)
    await async_test(
      'user session - sees all content (no filtering)',
      async () => {
        const results = await sdk.api.managed_content_records.getSome({})
        // Filter to only our test content by checking IDs
        const testRecords = results.filter(r => contentRecordIds.includes(r.id))
        return testRecords.length === 7
      },
      { onResult: (result) => result === true }
    )

    // Test 12: Count total visible records for enduser
    await async_test(
      'enduser - correct total visible count',
      async () => {
        // Should see: All, Direct, By Tags Match, Manual Assignment, Via Event = 5 records
        const results = await enduserSDK!.api.managed_content_records.getSome({})
        // Filter to only our test content by checking IDs
        const testRecords = results.filter(r => contentRecordIds.includes(r.id))
        console.log(`Enduser can see ${testRecords.length} out of 7 content records`)
        console.log(`Visible: ${testRecords.map(r => r.title).join(', ')}`)
        return testRecords.length === 5
      },
      { onResult: (result) => result === true }
    )

    // Test 13: Other enduser sees only assignmentType: 'All'
    await async_test(
      'other enduser - sees only All assignment type',
      async () => {
        const results = await otherEnduserSDK!.api.managed_content_records.getSome({})
        // Filter to only our test content by checking IDs
        const testRecords = results.filter(r => contentRecordIds.includes(r.id))
        console.log(`Other enduser can see ${testRecords.length} content records`)
        console.log(`Visible: ${testRecords.map(r => r.title).join(', ')}`)
        // Only "Content for All" should be visible
        return testRecords.length === 1 && testRecords[0].title === 'Content for All'
      },
      { onResult: (result) => result === true }
    )

    console.log("All Managed Content Enduser Access tests passed!")

  } finally {
    // Cleanup
    console.log("Cleaning up test data...")

    try {
      // Delete calendar events
      for (const eventId of calendarEventIds) {
        await sdk.api.calendar_events.deleteOne(eventId).catch(() => {})
      }

      // Delete assignments
      for (const assignmentId of assignmentIds) {
        await sdk.api.managed_content_record_assignments.deleteOne(assignmentId).catch(() => {})
      }

      // Delete content records
      for (const recordId of contentRecordIds) {
        await sdk.api.managed_content_records.deleteOne(recordId).catch(() => {})
      }

      // Delete endusers
      if (testEnduserId) {
        await sdk.api.endusers.deleteOne(testEnduserId).catch(() => {})
      }
      if (otherEnduserId) {
        await sdk.api.endusers.deleteOne(otherEnduserId).catch(() => {})
      }

      console.log("Cleanup completed")
    } catch (error) {
      console.error('Cleanup error:', error)
    }
  }
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await managed_content_enduser_access_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("Managed content enduser access test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Managed content enduser access test suite failed:", error)
      process.exit(1)
    })
}
