require('source-map-support').install();

import { Session } from "../../sdk"
import {
  async_test,
  log_header,
  wait,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

export const load_team_chat_tests = async ({ sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Load Team Chat Tests")

  // Create test endusers for care team scenarios
  const enduserForCareTeam = await sdk.api.endusers.createOne({
    fname: 'CareTeam',
    lname: 'TestPatient',
    assignedTo: [sdkNonAdmin.userInfo.id], // Non-admin is on care team
  })

  const enduserNotOnCareTeam = await sdk.api.endusers.createOne({
    fname: 'NoCareTeam',
    lname: 'TestPatient',
  })

  // Create various team chat rooms for testing
  // Room 1: Non-admin is in userIds
  const roomWithUserInIds = await sdk.api.chat_rooms.createOne({
    type: 'internal',
    userIds: [sdkNonAdmin.userInfo.id],
    title: 'Room with user in userIds',
  })

  // Room 2: Non-admin is creator
  const roomWhereUserIsCreator = await sdkNonAdmin.api.chat_rooms.createOne({
    type: 'internal',
    userIds: [],
    title: 'Room where user is creator',
  })

  // Room 3: aboutEnduserId with care team access
  const roomWithCareTeamAccess = await sdk.api.chat_rooms.createOne({
    type: 'internal',
    userIds: [],
    aboutEnduserId: enduserForCareTeam.id,
    title: 'Room with care team access',
  })

  // Room 4: No access for non-admin (different creator, not in userIds, no care team)
  const roomNoAccessForNonAdmin = await sdk.api.chat_rooms.createOne({
    type: 'internal',
    userIds: [],
    title: 'Room with no access for non-admin',
  })

  // Room 4b: No access for admin (non-admin is creator, admin not in userIds, not on care team)
  const roomNoAccessForAdmin = await sdkNonAdmin.api.chat_rooms.createOne({
    type: 'internal',
    userIds: [],
    title: 'Room with no access for admin',
  })

  // Room 5: aboutEnduserId but non-admin NOT on care team
  const roomNoCareTeamAccess = await sdk.api.chat_rooms.createOne({
    type: 'internal',
    userIds: [],
    aboutEnduserId: enduserNotOnCareTeam.id,
    title: 'Room without care team access',
  })

  // Room 6: Closed room (has endedAt)
  const closedRoom = await sdk.api.chat_rooms.createOne({
    type: 'internal',
    userIds: [sdkNonAdmin.userInfo.id],
    title: 'Closed room',
    endedAt: new Date(),
  })

  // Room 7: External type (should be excluded)
  const externalRoom = await sdk.api.chat_rooms.createOne({
    type: 'external',
    userIds: [sdkNonAdmin.userInfo.id],
    title: 'External room',
  })

  // Room 8: Room with enduserIds (should be excluded - not a team chat)
  const roomWithEndusers = await sdk.api.chat_rooms.createOne({
    type: 'internal',
    userIds: [sdkNonAdmin.userInfo.id],
    enduserIds: [enduserForCareTeam.id],
    title: 'Room with endusers',
  })

  // Room 9: Room with empty string aboutEnduserId (should not crash, user in userIds can see it)
  const roomWithEmptyAboutEnduserId = await sdk.api.chat_rooms.createOne({
    type: 'internal',
    userIds: [sdkNonAdmin.userInfo.id],
    aboutEnduserId: '' as any, // Empty string should be handled gracefully
    title: 'Room with empty aboutEnduserId',
  })

  // Wait for timestamps to settle
  await wait(undefined, 500)

  // Test 1: Basic loading - rooms where user is in userIds
  await async_test(
    "Loads room where user is in userIds",
    () => sdkNonAdmin.api.chat_rooms.load_team_chat({}),
    {
      onResult: r => r.chat_rooms.some(room => room.id === roomWithUserInIds.id)
    }
  )

  // Test 2: Creator access
  await async_test(
    "Loads room where user is creator",
    () => sdkNonAdmin.api.chat_rooms.load_team_chat({}),
    {
      onResult: r => r.chat_rooms.some(room => room.id === roomWhereUserIsCreator.id)
    }
  )

  // Test 3: Care team access
  await async_test(
    "Loads room where user is on care team for aboutEnduserId",
    () => sdkNonAdmin.api.chat_rooms.load_team_chat({}),
    {
      onResult: r => r.chat_rooms.some(room => room.id === roomWithCareTeamAccess.id)
    }
  )

  // Test 4: Returns endusers for aboutEnduserId
  await async_test(
    "Returns endusers for aboutEnduserId display",
    () => sdkNonAdmin.api.chat_rooms.load_team_chat({}),
    {
      onResult: r => r.endusers.some(e => e.id === enduserForCareTeam.id)
    }
  )

  // Test 5: Access exclusion - no access room should be excluded for non-admin
  await async_test(
    "Excludes rooms user has no access to",
    () => sdkNonAdmin.api.chat_rooms.load_team_chat({}),
    {
      onResult: r => !r.chat_rooms.some(room => room.id === roomNoAccessForNonAdmin.id)
    }
  )

  // Test 6: No care team access exclusion
  await async_test(
    "Excludes rooms where user is not on care team for aboutEnduserId",
    () => sdkNonAdmin.api.chat_rooms.load_team_chat({}),
    {
      onResult: r => !r.chat_rooms.some(room => room.id === roomNoCareTeamAccess.id)
    }
  )

  // Test 7: Closed rooms excluded by default
  await async_test(
    "Excludes closed rooms by default",
    () => sdkNonAdmin.api.chat_rooms.load_team_chat({}),
    {
      onResult: r => !r.chat_rooms.some(room => room.id === closedRoom.id)
    }
  )

  // Test 8: Closed rooms included with showClosed=true
  await async_test(
    "Includes closed rooms when showClosed=true",
    () => sdkNonAdmin.api.chat_rooms.load_team_chat({ showClosed: true }),
    {
      onResult: r => r.chat_rooms.some(room => room.id === closedRoom.id)
    }
  )

  // Test 9: External type excluded
  await async_test(
    "Excludes external type rooms",
    () => sdkNonAdmin.api.chat_rooms.load_team_chat({}),
    {
      onResult: r => !r.chat_rooms.some(room => room.id === externalRoom.id)
    }
  )

  // Test 10: Rooms with enduserIds excluded
  await async_test(
    "Excludes rooms with enduserIds (not team chats)",
    () => sdkNonAdmin.api.chat_rooms.load_team_chat({}),
    {
      onResult: r => !r.chat_rooms.some(room => room.id === roomWithEndusers.id)
    }
  )

  // Test 10b: Room with empty string aboutEnduserId works (doesn't crash)
  await async_test(
    "Handles room with empty string aboutEnduserId gracefully",
    () => sdkNonAdmin.api.chat_rooms.load_team_chat({}),
    {
      onResult: r => r.chat_rooms.some(room => room.id === roomWithEmptyAboutEnduserId.id)
    }
  )

  // Test 11: Admin also filtered to rooms they're involved in
  // (Admins who need all rooms can use standard GET endpoints)
  await async_test(
    "Admin does NOT see rooms they're not involved in",
    () => sdk.api.chat_rooms.load_team_chat({}),
    {
      onResult: r => !r.chat_rooms.some(room => room.id === roomNoAccessForAdmin.id)
    }
  )

  // Test 12: Pagination with limit
  await async_test(
    "Respects limit parameter",
    () => sdk.api.chat_rooms.load_team_chat({ limit: 2 }),
    {
      onResult: r => r.chat_rooms.length <= 2
    }
  )

  // Test 13: Pagination with lastUpdatedAt cursor
  const firstBatch = await sdk.api.chat_rooms.load_team_chat({ limit: 2 })
  if (firstBatch.chat_rooms.length === 2) {
    const lastRoom = firstBatch.chat_rooms[firstBatch.chat_rooms.length - 1]
    await async_test(
      "Pagination with lastUpdatedAt returns older rooms",
      () => sdk.api.chat_rooms.load_team_chat({ lastUpdatedAt: new Date(lastRoom.updatedAt!) }),
      {
        onResult: r => {
          // Should not contain any rooms from first batch
          const firstBatchIds = firstBatch.chat_rooms.map(room => room.id)
          return !r.chat_rooms.some(room => firstBatchIds.includes(room.id))
        }
      }
    )
  }

  // Test 14: Sorted by updatedAt descending
  await async_test(
    "Results sorted by updatedAt descending",
    () => sdk.api.chat_rooms.load_team_chat({}),
    {
      onResult: r => {
        for (let i = 1; i < r.chat_rooms.length; i++) {
          const prev = new Date(r.chat_rooms[i - 1].updatedAt!).getTime()
          const curr = new Date(r.chat_rooms[i].updatedAt!).getTime()
          if (prev < curr) return false
        }
        return true
      }
    }
  )

  // ============================================
  // Enduser Access Control Tests
  // ============================================

  // Create a role with "Assigned" enduser access and chat_rooms access
  const assignedEnduserAccessRole = await sdk.api.role_based_access_permissions.createOne({
    role: 'Assigned Enduser Access',
    permissions: {
      chat_rooms: { read: 'Default', create: 'Default', update: 'Default', delete: 'Default' },
      endusers: { read: 'Assigned', create: null, update: null, delete: null },
    },
  })

  // Create a role with no enduser access but chat_rooms access
  const noEnduserAccessRole = await sdk.api.role_based_access_permissions.createOne({
    role: 'No Enduser Access',
    permissions: {
      chat_rooms: { read: 'Default', create: 'Default', update: 'Default', delete: 'Default' },
      endusers: { read: null, create: null, update: null, delete: null },
    },
  })

  // Create test user for enduser access tests
  const enduserAccessTestEmail = 'team.chat.enduser.access.test@tellescope.com'
  const enduserAccessTestUser = (
    await sdk.api.users.getOne({ email: enduserAccessTestEmail }).catch(() => null)
  ) || (
    await sdk.api.users.createOne({ email: enduserAccessTestEmail, notificationEmailsDisabled: true, verifiedEmail: true })
  )

  // Create an additional enduser that this user is NOT assigned to
  const enduserNotAssignedToTestUser = await sdk.api.endusers.createOne({
    fname: 'NotAssigned',
    lname: 'ToTestUser',
  })

  // Create a room aboutEnduserId pointing to the unassigned enduser, but add test user to userIds
  const roomWithUnassignedEnduser = await sdk.api.chat_rooms.createOne({
    type: 'internal',
    userIds: [enduserAccessTestUser.id],
    aboutEnduserId: enduserNotAssignedToTestUser.id,
    title: 'Room with unassigned enduser',
  })

  await wait(undefined, 500)

  // Test 15: User with "Assigned" enduser access - only sees endusers they're assigned to
  await sdk.api.users.updateOne(enduserAccessTestUser.id, { roles: [assignedEnduserAccessRole.role] }, { replaceObjectFields: true })
  await wait(undefined, 2000) // role change triggers logout

  const sdkAssignedAccess = new Session({
    host,
    authToken: (await sdk.api.users.generate_auth_token({ id: enduserAccessTestUser.id })).authToken,
  })

  // User can see the chat room (via userIds) but should NOT see the enduser (not assigned)
  await async_test(
    "Assigned enduser access: sees room but not unassigned enduser",
    () => sdkAssignedAccess.api.chat_rooms.load_team_chat({}),
    {
      onResult: r => {
        const hasRoom = r.chat_rooms.some(room => room.id === roomWithUnassignedEnduser.id)
        const hasUnassignedEnduser = r.endusers.some(e => e.id === enduserNotAssignedToTestUser.id)
        return hasRoom && !hasUnassignedEnduser
      }
    }
  )

  // Now assign user to an enduser and verify they CAN see that enduser
  await sdk.api.endusers.updateOne(enduserForCareTeam.id, {
    assignedTo: [...(enduserForCareTeam.assignedTo || []), enduserAccessTestUser.id]
  })

  await async_test(
    "Assigned enduser access: sees enduser when assigned",
    () => sdkAssignedAccess.api.chat_rooms.load_team_chat({}),
    {
      onResult: r => {
        // Should see enduserForCareTeam (now assigned) but not enduserNotAssignedToTestUser
        const hasAssignedEnduser = r.endusers.some(e => e.id === enduserForCareTeam.id)
        const hasUnassignedEnduser = r.endusers.some(e => e.id === enduserNotAssignedToTestUser.id)
        return hasAssignedEnduser && !hasUnassignedEnduser
      }
    }
  )

  // Test 16: User with no enduser access - sees no endusers
  await sdk.api.users.updateOne(enduserAccessTestUser.id, { roles: [noEnduserAccessRole.role] }, { replaceObjectFields: true })
  await wait(undefined, 2000) // role change triggers logout

  const sdkNoEnduserAccess = new Session({
    host,
    authToken: (await sdk.api.users.generate_auth_token({ id: enduserAccessTestUser.id })).authToken,
  })

  await async_test(
    "No enduser access: sees rooms but no endusers",
    () => sdkNoEnduserAccess.api.chat_rooms.load_team_chat({}),
    {
      onResult: r => {
        const hasRoom = r.chat_rooms.some(room => room.id === roomWithUnassignedEnduser.id)
        const hasAnyEnduser = r.endusers.length > 0
        return hasRoom && !hasAnyEnduser
      }
    }
  )

  // Test 17: Admin (All access) sees all endusers
  await async_test(
    "Admin (All access): sees all endusers",
    () => sdk.api.chat_rooms.load_team_chat({}),
    {
      onResult: r => {
        // Admin should see both endusers
        const hasEnduserForCareTeam = r.endusers.some(e => e.id === enduserForCareTeam.id)
        const hasEnduserNotAssigned = r.endusers.some(e => e.id === enduserNotAssignedToTestUser.id)
        return hasEnduserForCareTeam && hasEnduserNotAssigned
      }
    }
  )

  // Test 18: Access tags grant enduser visibility (not on care team, but matching access tag)
  const accessTagTestTag = 'access-tag-test-team-chat'

  // Enable access tags at the organization level
  await sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
    settings: { endusers: { enableAccessTags: true } }
  })

  // Create a role with Assigned enduser access (which uses access tags)
  const accessTagRole = await sdk.api.role_based_access_permissions.createOne({
    role: 'Access Tag Enduser Access',
    permissions: {
      chat_rooms: { read: 'Default', create: 'Default', update: 'Default', delete: 'Default' },
      endusers: { read: 'Assigned', create: null, update: null, delete: null },
    },
  })

  // Create a user with the access tag
  const accessTagTestEmail = 'team.chat.access.tag.test@tellescope.com'
  const accessTagTestUser = (
    await sdk.api.users.getOne({ email: accessTagTestEmail }).catch(() => null)
  ) || (
    await sdk.api.users.createOne({
      email: accessTagTestEmail,
      notificationEmailsDisabled: true,
      verifiedEmail: true,
      tags: [accessTagTestTag],
    })
  )
  // Ensure user has the tag and role
  await sdk.api.users.updateOne(accessTagTestUser.id, {
    tags: [accessTagTestTag],
    roles: [accessTagRole.role]
  }, { replaceObjectFields: true })

  // Create an enduser with matching access tag (but user is NOT in assignedTo)
  const enduserWithAccessTag = await sdk.api.endusers.createOne({
    fname: 'AccessTag',
    lname: 'TestEnduser',
    accessTags: [accessTagTestTag],
    // Note: NOT assigning accessTagTestUser to this enduser
  })

  // Create a room about the enduser with access tag, add user to userIds
  const roomWithAccessTagEnduser = await sdk.api.chat_rooms.createOne({
    type: 'internal',
    userIds: [accessTagTestUser.id],
    aboutEnduserId: enduserWithAccessTag.id,
    title: 'Room with access tag enduser',
  })

  await wait(undefined, 2000) // role change triggers logout

  // Re-authenticate to get the updated JWT with eat (enableAccessTags) flag
  const sdkAccessTagUser = new Session({
    host,
    authToken: (await sdk.api.users.generate_auth_token({ id: accessTagTestUser.id })).authToken,
  })

  await async_test(
    "Access tags: user sees enduser via matching access tag (not assigned)",
    () => sdkAccessTagUser.api.chat_rooms.load_team_chat({}),
    {
      onResult: r => {
        const hasRoom = r.chat_rooms.some(room => room.id === roomWithAccessTagEnduser.id)
        const hasEnduserViaAccessTag = r.endusers.some(e => e.id === enduserWithAccessTag.id)
        // User should NOT see enduserNotAssignedToTestUser (no access tag match, not assigned)
        const hasUnrelatedEnduser = r.endusers.some(e => e.id === enduserNotAssignedToTestUser.id)
        return hasRoom && hasEnduserViaAccessTag && !hasUnrelatedEnduser
      }
    }
  )

  // Cleanup - disable access tags before deleting test data
  await sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
    settings: { endusers: { enableAccessTags: false } }
  })

  await Promise.all([
    sdk.api.chat_rooms.deleteOne(roomWithUserInIds.id),
    sdk.api.chat_rooms.deleteOne(roomWhereUserIsCreator.id),
    sdk.api.chat_rooms.deleteOne(roomWithCareTeamAccess.id),
    sdk.api.chat_rooms.deleteOne(roomNoAccessForNonAdmin.id),
    sdk.api.chat_rooms.deleteOne(roomNoAccessForAdmin.id),
    sdk.api.chat_rooms.deleteOne(roomNoCareTeamAccess.id),
    sdk.api.chat_rooms.deleteOne(closedRoom.id),
    sdk.api.chat_rooms.deleteOne(externalRoom.id),
    sdk.api.chat_rooms.deleteOne(roomWithEndusers.id),
    sdk.api.chat_rooms.deleteOne(roomWithEmptyAboutEnduserId.id),
    sdk.api.chat_rooms.deleteOne(roomWithUnassignedEnduser.id),
    sdk.api.chat_rooms.deleteOne(roomWithAccessTagEnduser.id),
    sdk.api.endusers.deleteOne(enduserForCareTeam.id),
    sdk.api.endusers.deleteOne(enduserNotOnCareTeam.id),
    sdk.api.endusers.deleteOne(enduserNotAssignedToTestUser.id),
    sdk.api.endusers.deleteOne(enduserWithAccessTag.id),
    sdk.api.role_based_access_permissions.deleteOne(assignedEnduserAccessRole.id),
    sdk.api.role_based_access_permissions.deleteOne(noEnduserAccessRole.id),
    sdk.api.role_based_access_permissions.deleteOne(accessTagRole.id),
    sdk.api.users.deleteOne(enduserAccessTestUser.id),
    sdk.api.users.deleteOne(accessTagTestUser.id),
  ])
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await load_team_chat_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Load team chat test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Load team chat test suite failed:", error)
      process.exit(1)
    })
}
