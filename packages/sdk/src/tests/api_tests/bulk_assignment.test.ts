require('source-map-support').install();

import { Session } from "../../sdk"
import {
  async_test,
  handleAnyError,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

// Main test function for bulk_assignment endpoint
export const bulk_assignment_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Bulk Assignment Tests")

  // Use a hardcoded custom type ID for testing (we'll use empty string for most tests)
  const customTypeId = '507f1f77bcf86cd799439011' // Valid MongoDB ObjectId

  // Create test users for care team assignments
  const user1 = await sdk.api.users.createOne({
    email: `test-user-1-${Date.now()}@test.com`,
    fname: 'Test',
    lname: 'User1',
  })
  const user2 = await sdk.api.users.createOne({
    email: `test-user-2-${Date.now()}@test.com`,
    fname: 'Test',
    lname: 'User2',
  })

  // Create endusers with different customTypeId scenarios
  const enduserWithCustomType = await sdk.api.endusers.createOne({
    fname: 'Test',
    lname: 'WithType',
    customTypeId: customTypeId,
    fields: { Building: ['Building A'] },
  })

  const enduserWithEmptyCustomType = await sdk.api.endusers.createOne({
    fname: 'Test',
    lname: 'EmptyType',
    customTypeId: '',
    fields: { Building: ['Building A'] },
  })

  const enduserWithoutCustomType = await sdk.api.endusers.createOne({
    fname: 'Test',
    lname: 'NoType',
    // customTypeId not set (will be missing from document)
    fields: { Building: ['Building B'] },
  })

  const enduserWithDifferentField = await sdk.api.endusers.createOne({
    fname: 'Test',
    lname: 'DifferentField',
    customTypeId: '',
    fields: { Building: ['Building C'] },
  })

  // Test 1: Add care team members with specific customTypeId
  await async_test(
    "bulk_assignment: Add care team with specific customTypeId",
    () => sdk.api.endusers.bulk_assignment({
      customTypeId: customTypeId,
      addIds: [user1.id],
    }),
    {
      onResult: r => (
        r.updated.length === 1
        && r.updated[0].id === enduserWithCustomType.id
        && !!r.updated[0].assignedTo?.includes(user1.id)
      )
    }
  )

  // Test 2: Add care team members with undefined customTypeId (should match empty string AND missing)
  await async_test(
    "bulk_assignment: Add care team with undefined customTypeId (matches empty and missing)",
    () => sdk.api.endusers.bulk_assignment({
      customTypeId: undefined,
      addIds: [user2.id],
    }),
    {
      onResult: r => {
        // Should update endusers with empty string customTypeId and missing customTypeId
        // Should NOT update enduserWithCustomType (has actual customTypeId set)
        const updatedIds = r.updated.map(e => e.id).sort()
        const expectedIds = [enduserWithEmptyCustomType.id, enduserWithoutCustomType.id, enduserWithDifferentField.id].sort()

        return (
          r.updated.length === 3
          && JSON.stringify(updatedIds) === JSON.stringify(expectedIds)
          && r.updated.every(e => !!e.assignedTo?.includes(user2.id))
        )
      }
    }
  )

  // Test 3: Add care team members with empty string customTypeId
  await async_test(
    "bulk_assignment: Add care team with empty string customTypeId",
    () => sdk.api.endusers.bulk_assignment({
      customTypeId: '',
      addIds: [user1.id],
    }),
    {
      onResult: r => {
        // Should update endusers with empty string customTypeId and missing customTypeId
        const updatedIds = r.updated.map(e => e.id).sort()
        const expectedIds = [enduserWithEmptyCustomType.id, enduserWithoutCustomType.id, enduserWithDifferentField.id].sort()

        return (
          r.updated.length === 3
          && JSON.stringify(updatedIds) === JSON.stringify(expectedIds)
          && r.updated.every(e => !!e.assignedTo?.includes(user1.id))
        )
      }
    }
  )

  // Test 4: Remove care team members with existingAssignment filter
  await async_test(
    "bulk_assignment: Remove care team with existingAssignment filter (All Of)",
    () => sdk.api.endusers.bulk_assignment({
      customTypeId: undefined,
      existingAssignment: {
        qualifier: 'All Of',
        values: [user1.id, user2.id],
      },
      removeIds: [user2.id],
    }),
    {
      onResult: r => (
        r.updated.every(e =>
          !e.assignedTo?.includes(user2.id) && // user2 removed
          !!e.assignedTo?.includes(user1.id)   // user1 still present
        )
      )
    }
  )

  // Test 5: Add care team members with existingAssignment filter (One Of)
  await async_test(
    "bulk_assignment: Add with existingAssignment filter (One Of)",
    () => sdk.api.endusers.bulk_assignment({
      customTypeId: undefined,
      existingAssignment: {
        qualifier: 'One Of',
        values: [user1.id],
      },
      addIds: [user2.id],
    }),
    {
      onResult: r => (
        r.updated.every(e =>
          !!e.assignedTo?.includes(user1.id) &&
          !!e.assignedTo?.includes(user2.id)
        )
      )
    }
  )

  // Test 6: Add care team members with custom field filter (array field)
  await async_test(
    "bulk_assignment: Add with custom field filter (array value)",
    () => sdk.api.endusers.bulk_assignment({
      customTypeId: undefined,
      field: 'Building',
      existingFieldValue: 'Building A',
      addIds: [sdk.userInfo.id], // Use admin user ID
    }),
    {
      onResult: r => {
        // Should match endusers where Building array contains 'Building A'
        // Note: May return fewer than 2 if some already have this user assigned
        const updatedIds = r.updated.map(e => e.id)
        const hasCorrectEnduser = updatedIds.includes(enduserWithEmptyCustomType.id) || updatedIds.includes(enduserWithCustomType.id)

        return (
          r.updated.length >= 1
          && hasCorrectEnduser
          && r.updated.every(e => !!e.assignedTo?.includes(sdk.userInfo.id))
          && r.updated.every(e => {
            const building = e.fields?.Building
            return Array.isArray(building) ? building.includes('Building A') : building === 'Building A'
          })
        )
      }
    }
  )

  // Test 7: Remove care team members with combined filters
  await async_test(
    "bulk_assignment: Remove with combined filters (customTypeId + field + existingAssignment)",
    () => sdk.api.endusers.bulk_assignment({
      customTypeId: '',
      field: 'Building',
      existingFieldValue: 'Building A',
      existingAssignment: {
        qualifier: 'All Of',
        values: [user1.id],
      },
      removeIds: [user1.id],
    }),
    {
      onResult: r => (
        r.updated.length === 1
        && r.updated[0].id === enduserWithEmptyCustomType.id
        && !r.updated[0].assignedTo?.includes(user1.id)
      )
    }
  )

  // Test 8: Error when neither addIds nor removeIds provided
  await async_test(
    "bulk_assignment: Error when no addIds or removeIds",
    () => sdk.api.endusers.bulk_assignment({
      customTypeId: customTypeId,
    }),
    handleAnyError
  )

  // Cleanup
  await Promise.all([
    sdk.api.endusers.deleteOne(enduserWithCustomType.id),
    sdk.api.endusers.deleteOne(enduserWithEmptyCustomType.id),
    sdk.api.endusers.deleteOne(enduserWithoutCustomType.id),
    sdk.api.endusers.deleteOne(enduserWithDifferentField.id),
    sdk.api.users.deleteOne(user1.id),
    sdk.api.users.deleteOne(user2.id),
  ])
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await bulk_assignment_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Bulk assignment test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Bulk assignment test suite failed:", error)
      process.exit(1)
    })
}
