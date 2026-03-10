require('source-map-support').install();

import { Session } from "../../sdk"
import {
  async_test,
  log_header,
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

  // Test 8: Non-admin can read all dashboards by default
  const nonAdminList = await sdkNonAdmin.api.custom_dashboards.getSome({ filter: {} })

  await async_test(
    "Non-admin can read all dashboards",
    async () => nonAdminList,
    { onResult: r => r.length >= 2 }
  )

  // Cleanup
  await Promise.all([
    sdk.api.custom_dashboards.deleteOne(basicDashboard.id),
    sdk.api.custom_dashboards.deleteOne(duplicateTitleDashboard.id),
    sdk.api.custom_dashboards.deleteOne(fullDashboard.id),
    sdk.api.custom_dashboards.deleteOne(dashboardWithUserIds.id),
    sdk.api.custom_dashboards.deleteOne(dashboardWithNewTypes.id),
    sdk.api.custom_dashboards.deleteOne(dashboardWithComplexBlocks.id),
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
