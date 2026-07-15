require('source-map-support').install();

import { Session } from "../../sdk"
import {
  async_test,
  log_header,
  wait,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

export const custom_dashboards_tests = async ({ sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Custom Dashboards")

  // Test 1: Create basic dashboard with minimal fields
  const basicDashboard = await sdk.api.custom_dashboards.createOne({
    title: "Test Dashboard",
    blocks: [{ type: "Inbox", colSpan: 4 }],
  })

  await async_test(
    "Basic dashboard created correctly",
    async () => basicDashboard,
    {
      onResult: r => (
        r.title === "Test Dashboard"
        && r.blocks.length === 1
        && r.blocks[0].type === "Inbox"
        && r.blocks[0].colSpan === 4
      )
    }
  )

  // Test 1b: Duplicate titles are allowed
  const duplicateTitleDashboard = await sdk.api.custom_dashboards.createOne({
    title: "Test Dashboard",
    blocks: [{ type: "Tickets", colSpan: 6 }],
  })

  await async_test(
    "Duplicate title dashboard created successfully",
    async () => duplicateTitleDashboard,
    {
      onResult: r => (
        r.title === "Test Dashboard"
        && r.id !== basicDashboard.id
      )
    }
  )

  // Test 2: Create dashboard with all fields
  const fullDashboard = await sdk.api.custom_dashboards.createOne({
    title: "Full Dashboard",
    description: "A complete dashboard with all options",
    blocks: [
      { type: "Inbox", info: { showUnread: true }, colSpan: 4, rowSpan: 2 },
      { type: "Tickets", info: { status: "open" }, colSpan: 4, rowSpan: 1 },
      {
        type: "CustomWidget",
        info: { widgetId: "xyz", nestedConfig: { foo: "bar" } },
        colSpan: 4,
        responsive: {
          sm: { colSpan: 12, hidden: false },
          md: { colSpan: 6 },
          lg: { colSpan: 4 }
        },
        style: { backgroundColor: "#ffffff", borderRadius: 8 }
      },
    ],
    defaultForRoles: ["Admin", "Manager"],
    hiddenFromRoles: ["Guest"],
    defaultForUserIds: [],
    gridConfig: { columns: 12, gap: 16, rowHeight: 100 },
  })

  await async_test(
    "Full dashboard with all fields created correctly",
    async () => fullDashboard,
    {
      onResult: r => (
        r.blocks.length === 3
        && r.gridConfig !== undefined && r.gridConfig.columns === 12
        && r.gridConfig !== undefined && r.gridConfig.gap === 16
        && r.defaultForRoles !== undefined && r.defaultForRoles.includes("Admin")
        && r.blocks[2].responsive !== undefined && r.blocks[2].responsive.sm !== undefined && r.blocks[2].responsive.sm.colSpan === 12
        && r.blocks[0].info !== undefined && r.blocks[0].info.showUnread === true
      )
    }
  )

  // Test 2b: Create dashboard with userIds
  const dashboardWithUserIds = await sdk.api.custom_dashboards.createOne({
    title: "Dashboard With UserIds",
    blocks: [{ type: "Inbox", colSpan: 12 }],
    userIds: [sdk.userInfo.id],
  })

  await async_test(
    "Dashboard with userIds created correctly",
    async () => dashboardWithUserIds,
    {
      onResult: r => (
        r.userIds !== undefined
        && r.userIds.length === 1
        && r.userIds[0] === sdk.userInfo.id
      )
    }
  )

  // Test 3: Update dashboard title only (blocks array updates append by default)
  const updatedTitle = await sdk.api.custom_dashboards.updateOne(basicDashboard.id, {
    title: "Updated Dashboard",
  })

  await async_test(
    "Dashboard title updated correctly",
    async () => updatedTitle,
    {
      onResult: r => (
        r.title === "Updated Dashboard"
        && r.blocks.length === 1
        && r.blocks[0].type === "Inbox"
      )
    }
  )

  // Test 3b: Create a new dashboard to test blocks with new block types
  const dashboardWithNewTypes = await sdk.api.custom_dashboards.createOne({
    title: "Dashboard With Custom Types",
    blocks: [
      { type: "Inbox", colSpan: 6 },
      { type: "NewBlockType", info: { custom: "data", nested: { value: 123 } }, colSpan: 6 },
    ],
  })

  await async_test(
    "Dashboard with new block types created correctly",
    async () => dashboardWithNewTypes,
    {
      onResult: r => (
        r.blocks.length === 2
        && r.blocks[1].type === "NewBlockType"
        && r.blocks[1].info !== undefined && r.blocks[1].info.custom === "data"
      )
    }
  )

  // Test 4: Read dashboard by ID
  const read = await sdk.api.custom_dashboards.getOne(dashboardWithNewTypes.id)

  await async_test(
    "Dashboard read by ID correctly",
    async () => read,
    {
      onResult: r => (
        r.id === dashboardWithNewTypes.id
        && r.title === "Dashboard With Custom Types"
      )
    }
  )

  // Test 5: List dashboards
  const list = await sdk.api.custom_dashboards.getSome({ filter: {} })

  await async_test(
    "Dashboard list returned",
    async () => list,
    { onResult: r => r.length >= 2 }
  )

  // Test 6: Create dashboard with complex/arbitrary block info to verify permissive validation
  const dashboardWithComplexBlocks = await sdk.api.custom_dashboards.createOne({
    title: "Complex Blocks Dashboard",
    blocks: [
      {
        type: "ChartWidget",
        info: {
          chartType: "bar",
          dataSource: "appointments",
          dateRange: "30d",
          colors: ["#ff0000", "#00ff00"],
          aggregation: { field: "status", method: "count" }
        },
        colSpan: 8,
        rowSpan: 2,
      },
    ],
  })

  await async_test(
    "Dashboard with complex block info created correctly",
    async () => dashboardWithComplexBlocks,
    {
      onResult: r => (
        r.blocks[0].type === "ChartWidget"
        && r.blocks[0].info !== undefined && r.blocks[0].info.chartType === "bar"
        && r.blocks[0].info !== undefined && Array.isArray(r.blocks[0].info.colors) && r.blocks[0].info.colors.length === 2
      )
    }
  )

  // Test 6b: Create dashboard with every built-in block type (legacy renderer set)
  const dashboardWithBuiltInTypes = await sdk.api.custom_dashboards.createOne({
    title: "Built-In Block Types Dashboard",
    blocks: [
      { type: "Inbox" },
      { type: "Tickets" },
      { type: "Team Chats" },
      { type: "Upcoming Events" },
      { type: "To-Dos" },
      { type: "Database", info: { databaseId: "60398b0231a295e64f084fd9" } },
    ],
  })

  await async_test(
    "Dashboard with all built-in block types created correctly",
    async () => dashboardWithBuiltInTypes,
    {
      onResult: r => (
        r.blocks.length === 6
        && r.blocks[0].type === "Inbox"
        && r.blocks[1].type === "Tickets"
        && r.blocks[2].type === "Team Chats"
        && r.blocks[3].type === "Upcoming Events"
        && r.blocks[4].type === "To-Dos"
        && r.blocks[5].type === "Database"
        && r.blocks[5].info !== undefined && r.blocks[5].info.databaseId === "60398b0231a295e64f084fd9"
      )
    }
  )

  // Test 6c: Unknown top-level block fields are stripped on save (params belong in info)
  const dashboardWithUnknownBlockField = await sdk.api.custom_dashboards.createOne({
    title: "Unknown Block Field Dashboard",
    blocks: [
      { type: "Inbox", customTopLevel: "x", info: { kept: true } } as any,
    ],
  })

  await async_test(
    "Unknown top-level block fields stripped, info preserved",
    async () => dashboardWithUnknownBlockField,
    {
      onResult: r => (
        r.blocks.length === 1
        && (r.blocks[0] as any).customTopLevel === undefined
        && r.blocks[0].info !== undefined && r.blocks[0].info.kept === true
      )
    }
  )

  // Test 7: Update gridConfig only
  const updatedGridConfig = await sdk.api.custom_dashboards.updateOne(dashboardWithNewTypes.id, {
    gridConfig: { columns: 24, gap: 8 },
  })

  await async_test(
    "GridConfig updated correctly",
    async () => updatedGridConfig,
    {
      onResult: r => (
        r.gridConfig !== undefined && r.gridConfig.columns === 24
        && r.gridConfig !== undefined && r.gridConfig.gap === 8
      )
    }
  )

  // Test 7b: Create dashboard with top-level type field
  const typedDashboard = await sdk.api.custom_dashboards.createOne({
    title: "Typed Dashboard",
    type: "home",
    blocks: [{ type: "Inbox", colSpan: 12 }],
  })

  await async_test(
    "Dashboard with top-level type created correctly",
    async () => typedDashboard,
    { onResult: r => r.type === "home" }
  )

  // Test 7c: Dashboards without type still work (backwards compatibility)
  await async_test(
    "Dashboard without type has undefined type",
    async () => sdk.api.custom_dashboards.getOne(basicDashboard.id),
    { onResult: r => r.type === undefined }
  )

  // Test 7d: Update top-level type
  const updatedType = await sdk.api.custom_dashboards.updateOne(typedDashboard.id, {
    type: "clinical",
  })

  await async_test(
    "Dashboard type updated correctly",
    async () => updatedType,
    { onResult: r => r.type === "clinical" }
  )

  // Test 7e: Filter dashboards by type
  const secondTypedDashboard = await sdk.api.custom_dashboards.createOne({
    title: "Second Typed Dashboard",
    type: "clinical",
    blocks: [{ type: "Tickets", colSpan: 12 }],
  })

  await async_test(
    "Dashboards filtered by type via filter",
    async () => sdk.api.custom_dashboards.getSome({ filter: { type: "clinical" } }),
    {
      onResult: r => (
        r.length === 2
        && r.every(d => d.type === "clinical")
      )
    }
  )

  // Test 7f: Filter dashboards by type via mdbFilter
  await async_test(
    "Dashboards filtered by type via mdbFilter",
    async () => sdk.api.custom_dashboards.getSome({ mdbFilter: { type: "clinical" } }),
    {
      onResult: r => (
        r.length === 2
        && r.every(d => d.type === "clinical")
      )
    }
  )

  // Test 8: Non-admin can read all dashboards by default
  const nonAdminList = await sdkNonAdmin.api.custom_dashboards.getSome({ filter: {} })

  await async_test(
    "Non-admin can read all dashboards",
    async () => nonAdminList,
    { onResult: r => r.length >= 2 }
  )

  // Test 9: visibleToAllUsers grants org-wide access to users without full read access
  const restrictedRole = await sdk.api.role_based_access_permissions.createOne({
    role: 'Dashboard Default Access',
    permissions: {
      custom_dashboards: { read: 'Default', create: null, update: null, delete: null },
    },
  })

  const restrictedUserEmail = 'dashboard.restricted.test@tellescope.com'
  let restrictedUser = await sdk.api.users.getOne({ email: restrictedUserEmail }).catch(() => null) // throws error on none found
  if (restrictedUser && !restrictedUser.verifiedEmail) { // verifiedEmail can only be set on create, so recreate stale users
    await sdk.api.users.deleteOne(restrictedUser.id)
    restrictedUser = null
  }
  if (!restrictedUser) {
    restrictedUser = await sdk.api.users.createOne({ email: restrictedUserEmail, notificationEmailsDisabled: true, verifiedEmail: true })
  }
  // ensure role is set, in case GET returned a user without a role or with a different role
  await sdk.api.users.updateOne(restrictedUser.id, { roles: [restrictedRole.role] }, { replaceObjectFields: true })
  await wait(undefined, 2000) // role change triggers a logout

  const sdkRestricted = new Session({
    host,
    authToken: (await sdk.api.users.generate_auth_token({ id: restrictedUser.id })).authToken,
  })
  await async_test('test_authenticated (restricted dashboard user)', sdkRestricted.test_authenticated, { expectedResult: 'Authenticated!' })

  const hiddenDashboard = await sdk.api.custom_dashboards.createOne({
    title: "Hidden From Restricted",
    blocks: [{ type: "Inbox", colSpan: 12 }],
  })
  const orgWideDashboard = await sdk.api.custom_dashboards.createOne({
    title: "Org-Wide Dashboard",
    visibleToAllUsers: true,
    blocks: [{ type: "Inbox", colSpan: 12 }],
  })
  const explicitFalseDashboard = await sdk.api.custom_dashboards.createOne({
    title: "Explicit False Dashboard",
    visibleToAllUsers: false,
    blocks: [{ type: "Inbox", colSpan: 12 }],
  })
  const assignedDashboard = await sdk.api.custom_dashboards.createOne({
    title: "Assigned To Restricted",
    userIds: [restrictedUser.id],
    blocks: [{ type: "Inbox", colSpan: 12 }],
  })

  await async_test(
    "Restricted user sees org-wide and assigned dashboards only",
    () => sdkRestricted.api.custom_dashboards.getSome({ filter: {} }),
    {
      onResult: r => (
        !!r.find(d => d.id === orgWideDashboard.id)
        && !!r.find(d => d.id === assignedDashboard.id)
        && !r.find(d => d.id === hiddenDashboard.id)
        && !r.find(d => d.id === explicitFalseDashboard.id)
      )
    }
  )

  await async_test(
    "Restricted user can read org-wide dashboard by id",
    () => sdkRestricted.api.custom_dashboards.getOne(orgWideDashboard.id),
    { onResult: r => r.id === orgWideDashboard.id && r.visibleToAllUsers === true }
  )

  await async_test(
    "Restricted user cannot read unshared dashboard by id",
    () => sdkRestricted.api.custom_dashboards.getOne(hiddenDashboard.id),
    { shouldError: true, onError: () => true }
  )

  // Toggling the flag on takes effect for the restricted user
  await sdk.api.custom_dashboards.updateOne(hiddenDashboard.id, { visibleToAllUsers: true })

  await async_test(
    "Restricted user can read dashboard after visibleToAllUsers enabled",
    () => sdkRestricted.api.custom_dashboards.getOne(hiddenDashboard.id),
    { onResult: r => r.id === hiddenDashboard.id }
  )

  // Admin continues to see everything, including unshared dashboards
  await async_test(
    "Admin still sees explicit-false dashboard",
    () => sdk.api.custom_dashboards.getOne(explicitFalseDashboard.id),
    { onResult: r => r.id === explicitFalseDashboard.id }
  )

  // Cleanup
  await Promise.all([
    sdk.api.custom_dashboards.deleteOne(hiddenDashboard.id),
    sdk.api.custom_dashboards.deleteOne(orgWideDashboard.id),
    sdk.api.custom_dashboards.deleteOne(explicitFalseDashboard.id),
    sdk.api.custom_dashboards.deleteOne(assignedDashboard.id),
    sdk.api.custom_dashboards.deleteOne(basicDashboard.id),
    sdk.api.custom_dashboards.deleteOne(duplicateTitleDashboard.id),
    sdk.api.custom_dashboards.deleteOne(fullDashboard.id),
    sdk.api.custom_dashboards.deleteOne(dashboardWithUserIds.id),
    sdk.api.custom_dashboards.deleteOne(dashboardWithNewTypes.id),
    sdk.api.custom_dashboards.deleteOne(dashboardWithComplexBlocks.id),
    sdk.api.custom_dashboards.deleteOne(dashboardWithBuiltInTypes.id),
    sdk.api.custom_dashboards.deleteOne(dashboardWithUnknownBlockField.id),
    sdk.api.custom_dashboards.deleteOne(typedDashboard.id),
    sdk.api.custom_dashboards.deleteOne(secondTypedDashboard.id),
  ])
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await custom_dashboards_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Custom dashboards test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Custom dashboards test suite failed:", error)
      process.exit(1)
    })
}
