require('source-map-support').install();

import { Session } from "../../sdk"
import {
  assert,
  async_test,
  handleAnyError,
  log_header,
} from "@tellescope/testing"
import { PhoneTreeNode } from "@tellescope/types-models"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

const SPLIT_NODE_ID = 'enduser-condition-split-node'
const VIP_NODE_ID = 'vip-play-message-node'
const ELSE_NODE_ID = 'else-play-message-node'

const valid_condition_split_nodes: PhoneTreeNode[] = [
  {
    id: SPLIT_NODE_ID,
    action: {
      type: 'Enduser Condition Split',
      info: {
        branches: [
          { name: 'VIP', enduserCondition: { $and: [{ condition: { tags: 'VIP' } }] } },
          { name: 'Everyone Else' }, // no condition — catch-all
        ],
      },
    },
    events: [{ type: 'Start', parentId: SPLIT_NODE_ID, info: {} }],
    flowchartUI: { x: 0, y: 0 },
  },
  {
    id: VIP_NODE_ID,
    action: {
      type: 'Play Message',
      info: { playback: { type: 'Say', info: { script: 'Welcome, VIP caller' } } },
    },
    events: [{ type: 'On Condition Branch', parentId: SPLIT_NODE_ID, info: { branch: 'VIP' } }],
    flowchartUI: { x: -100, y: 100 },
  },
  {
    id: ELSE_NODE_ID,
    action: {
      type: 'Play Message',
      info: { playback: { type: 'Say', info: { script: 'Welcome' } } },
    },
    events: [{ type: 'On Condition Branch', parentId: SPLIT_NODE_ID, info: { branch: 'Everyone Else' } }],
    flowchartUI: { x: 100, y: 100 },
  },
]

export const phone_tree_enduser_condition_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Phone Tree Enduser Condition Split Tests")

  const treeIds: string[] = []
  try {
    // valid Enduser Condition Split node with On Condition Branch children saves
    const tree = await sdk.api.phone_trees.createOne({
      number: '+15005550006',
      isActive: false,
      nodes: valid_condition_split_nodes,
    })
    treeIds.push(tree.id)
    assert(!!tree.id, 'failed to create tree with Enduser Condition Split', 'create tree with Enduser Condition Split')

    const loaded = await sdk.api.phone_trees.getOne(tree.id)
    const loadedSplit = loaded.nodes.find(n => n.action.type === 'Enduser Condition Split')
    assert(
      loadedSplit?.action.type === 'Enduser Condition Split'
      && loadedSplit.action.info.branches.length === 2
      && loadedSplit.action.info.branches[0].name === 'VIP'
      && !!loadedSplit.action.info.branches[0].enduserCondition
      && loadedSplit.action.info.branches[1].enduserCondition === undefined,
      'branches did not round-trip',
      'branches (conditions + catch-all) round-trip on read',
    )

    // regression: existing Conditional Split shape is unaffected
    const conditionalSplitTree = await sdk.api.phone_trees.createOne({
      number: '+15005550006',
      isActive: false,
      nodes: [{
        id: 'conditional-split-node',
        // timezone + weeklyAvailabilities included to match the webapp's default Conditional Split shape
        action: { type: 'Conditional Split', info: { timezone: 'US/Eastern', weeklyAvailabilities: [], hasCareTeam: true } },
        events: [{ type: 'Start', parentId: 'conditional-split-node', info: {} }],
        flowchartUI: { x: 0, y: 0 },
      }],
    })
    treeIds.push(conditionalSplitTree.id)
    assert(!!conditionalSplitTree.id, 'failed to create Conditional Split tree', 'existing Conditional Split still saves (regression)')

    // invalid: enduserCondition must be an object
    await async_test(
      "non-object enduserCondition is rejected",
      () => sdk.api.phone_trees.createOne({
        number: '+15005550006',
        isActive: false,
        nodes: [{
          id: SPLIT_NODE_ID,
          action: {
            type: 'Enduser Condition Split',
            info: { branches: [{ name: 'Bad', enduserCondition: "not-an-object" as any }] },
          },
          events: [{ type: 'Start', parentId: SPLIT_NODE_ID, info: {} }],
          flowchartUI: { x: 0, y: 0 },
        }],
      }).then(t => { treeIds.push(t.id); return t }), // cleanup if it unexpectedly passes
      handleAnyError,
    )

    // invalid: branches must include a name
    await async_test(
      "branch without a name is rejected",
      () => sdk.api.phone_trees.createOne({
        number: '+15005550006',
        isActive: false,
        nodes: [{
          id: SPLIT_NODE_ID,
          action: {
            type: 'Enduser Condition Split',
            info: { branches: [{ enduserCondition: {} } as any] },
          },
          events: [{ type: 'Start', parentId: SPLIT_NODE_ID, info: {} }],
          flowchartUI: { x: 0, y: 0 },
        }],
      }).then(t => { treeIds.push(t.id); return t }),
      handleAnyError,
    )

    // invalid: On Condition Branch events must include a branch value
    await async_test(
      "On Condition Branch event without branch is rejected",
      () => sdk.api.phone_trees.createOne({
        number: '+15005550006',
        isActive: false,
        nodes: valid_condition_split_nodes.map(n => (
          n.id !== VIP_NODE_ID
            ? n
            : { ...n, events: [{ type: 'On Condition Branch', parentId: SPLIT_NODE_ID, info: {} as any }] }
        )),
      }).then(t => { treeIds.push(t.id); return t }),
      handleAnyError,
    )
  } finally {
    for (const id of treeIds) {
      await sdk.api.phone_trees.deleteOne(id).catch(console.error)
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
    await phone_tree_enduser_condition_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Phone tree enduser condition test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Phone tree enduser condition test suite failed:", error)
      process.exit(1)
    })
}
