require('source-map-support').install();

import { Session } from "../../sdk"
import {
  async_test,
  log_header,
  wait,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

const totalFromValues = (r: { values?: { value: number }[] }) =>
  (r.values ?? []).reduce((sum, v) => sum + v.value, 0)

export const chats_analytics_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Chats Analytics Tests")

  const testEnduser = await sdk.api.endusers.createOne({
    fname: 'ChatsAnalytics',
    lname: 'TestUser',
    email: 'chats-analytics-test@example.com',
  })

  const chatRoom = await sdk.api.chat_rooms.createOne({
    enduserIds: [testEnduser.id],
  })

  // Inbound chat (senderId === enduserId), tagged with 'tag-a'
  const inboundChat = await sdk.api.chats.createOne({
    roomId: chatRoom.id,
    message: "Inbound message from enduser",
    senderId: testEnduser.id,
    enduserId: testEnduser.id,
    tags: ['tag-a'],
  })

  // Outbound chat (senderId !== enduserId), tagged with 'tag-b'
  const outboundChat = await sdk.api.chats.createOne({
    roomId: chatRoom.id,
    message: "Outbound message from provider",
    senderId: sdk.userInfo.id,
    enduserId: testEnduser.id,
    tags: ['tag-b'],
  })

  // Inbound chat with both tags
  const bothTagsChat = await sdk.api.chats.createOne({
    roomId: chatRoom.id,
    message: "Inbound message with both tags",
    senderId: testEnduser.id,
    enduserId: testEnduser.id,
    tags: ['tag-a', 'tag-b'],
  })

  await wait(undefined, 1000)

  const now = new Date()
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)

  const baseQuery = {
    resource: 'Chats' as const,
    info: { method: 'Total' as const, parameters: undefined },
    range: { interval: 'Daily' as const, key: 'Created At' as const },
  }
  const createdRange = { from: dayStart, to: dayEnd }

  try {
    // Test 1: Total count with no filter
    await async_test(
      "Chats analytics - total count (no filter)",
      () => sdk.api.analytics_frames.get_result_for_query({
        query: { ...baseQuery },
        createdRange,
      }),
      { onResult: r => totalFromValues(r) === 3 }
    )

    // Test 2: Direction = Inbound (senderId === enduserId)
    await async_test(
      "Chats analytics - direction Inbound",
      () => sdk.api.analytics_frames.get_result_for_query({
        query: { ...baseQuery, filter: { direction: 'Inbound' } },
        createdRange,
      }),
      { onResult: r => totalFromValues(r) === 2 }
    )

    // Test 3: Direction = Outbound (senderId !== enduserId)
    await async_test(
      "Chats analytics - direction Outbound",
      () => sdk.api.analytics_frames.get_result_for_query({
        query: { ...baseQuery, filter: { direction: 'Outbound' } },
        createdRange,
      }),
      { onResult: r => totalFromValues(r) === 1 }
    )

    // Test 4: Chat Tags - One Of qualifier
    await async_test(
      "Chats analytics - Chat Tags One Of",
      () => sdk.api.analytics_frames.get_result_for_query({
        query: { ...baseQuery, filter: { 'Chat Tags': { qualifier: 'One Of', values: ['tag-a'] } } },
        createdRange,
      }),
      { onResult: r => totalFromValues(r) === 2 }
    )

    // Test 5: Chat Tags - All Of qualifier
    await async_test(
      "Chats analytics - Chat Tags All Of",
      () => sdk.api.analytics_frames.get_result_for_query({
        query: { ...baseQuery, filter: { 'Chat Tags': { qualifier: 'All Of', values: ['tag-a', 'tag-b'] } } },
        createdRange,
      }),
      { onResult: r => totalFromValues(r) === 1 }
    )

    // Test 6: Combined direction + tags filter
    await async_test(
      "Chats analytics - Inbound + Chat Tags",
      () => sdk.api.analytics_frames.get_result_for_query({
        query: {
          ...baseQuery,
          filter: {
            direction: 'Inbound',
            'Chat Tags': { qualifier: 'One Of', values: ['tag-b'] },
          },
        },
        createdRange,
      }),
      { onResult: r => totalFromValues(r) === 1 }
    )

    // Test 7: Chat Tags grouping
    await async_test(
      "Chats analytics - Chat Tags grouping",
      () => sdk.api.analytics_frames.get_result_for_query({
        query: { ...baseQuery, grouping: { 'Chat Tags': true, Enduser: '' } },
        createdRange,
      }),
      { onResult: r => {
        if (!r.values?.length) return false
        // Grouping by tags returns entries keyed by the full tags array on each chat
        // We expect entries for each unique tag combination, with total values summing to 3
        const total = r.values.reduce((sum, v) => sum + v.value, 0)
        const hasGroupKeys = r.values.some(v => v.key !== undefined)
        return total === 3 && hasGroupKeys
      }}
    )

    console.log("All chats analytics tests passed")
  } finally {
    await sdk.api.chats.deleteOne(inboundChat.id)
    await sdk.api.chats.deleteOne(outboundChat.id)
    await sdk.api.chats.deleteOne(bothTagsChat.id)
    await sdk.api.chat_rooms.deleteOne(chatRoom.id)
    await sdk.api.endusers.deleteOne(testEnduser.id)
  }
}

if (require.main === module) {
  console.log(`Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await chats_analytics_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("Chats analytics test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Chats analytics test suite failed:", error)
      process.exit(1)
    })
}
