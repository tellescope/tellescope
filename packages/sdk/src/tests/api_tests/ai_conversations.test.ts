require('source-map-support').install();

import { Session } from "../../sdk"
import {
  async_test,
  handleAnyError,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

// Main test function that can be called independently or as part of the main test suite
export const ai_conversations_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("AI Conversations Tests")

  // Use unique identifiers per test run to avoid collisions (since delete is not enabled)
  const testRunId = Date.now().toString()
  const testOrchestrationId = `test-orchestration-${testRunId}`

  // Test 1: Create an AIConversation
  const testMessage = {
    role: 'user' as const,
    text: 'Hello, this is a test message',
    timestamp: new Date(),
    tokens: 10,
  }

  const conversation = await sdk.api.ai_conversations.createOne({
    type: 'test-conversation',
    modelName: 'test-model',
    messages: [testMessage],
  })

  await async_test(
    "AIConversation created successfully",
    async () => conversation,
    { onResult: c => (
         c.id !== undefined
      && c.type === 'test-conversation'
      && c.modelName === 'test-model'
      && c.messages.length === 1
      && c.messages[0].text === testMessage.text
    ) }
  )

  // Test 2: Read the created AIConversation
  await async_test(
    "AIConversation can be read",
    () => sdk.api.ai_conversations.getOne(conversation.id),
    { onResult: c => (
         c.id === conversation.id
      && c.type === 'test-conversation'
      && c.messages.length === 1
    ) }
  )

  // Test 3: Update by appending messages (without replaceObjectFields)
  const appendedMessage = {
    role: 'assistant' as const,
    text: 'This is an appended response',
    timestamp: new Date(),
    tokens: 15,
  }

  await async_test(
    "AIConversation update appends messages (without replaceObjectFields)",
    async () => {
      await sdk.api.ai_conversations.updateOne(conversation.id, {
        messages: [appendedMessage],
      })
      return sdk.api.ai_conversations.getOne(conversation.id)
    },
    { onResult: c => (
         c.messages.length === 2
      && c.messages[0].text === testMessage.text
      && c.messages[1].text === appendedMessage.text
    ) }
  )

  // Test 4: Verify replaceObjectFields: true is blocked
  await async_test(
    "AIConversation update with replaceObjectFields: true is blocked",
    () => sdk.api.ai_conversations.updateOne(
      conversation.id,
      { messages: [appendedMessage] },
      { replaceObjectFields: true }
    ),
    {
      shouldError: true,
      onError: (e: any) => (
        e.message?.includes('replaceObjectFields: true are not allowed')
        || e.message?.includes('replaceObjectFields')
      )
    }
  )

  // Test 5: Verify messages are still intact after blocked update attempt
  await async_test(
    "AIConversation messages preserved after blocked replaceObjectFields attempt",
    () => sdk.api.ai_conversations.getOne(conversation.id),
    { onResult: c => (
         c.messages.length === 2
      && c.messages[0].text === testMessage.text
      && c.messages[1].text === appendedMessage.text
    ) }
  )

  // Test 6: Can set orchestrationId via update
  await async_test(
    "AIConversation orchestrationId can be set via update",
    async () => {
      await sdk.api.ai_conversations.updateOne(conversation.id, {
        orchestrationId: testOrchestrationId,
      })
      return sdk.api.ai_conversations.getOne(conversation.id)
    },
    { onResult: c => c.orchestrationId === testOrchestrationId }
  )

  // Test 7: Multiple conversations with same orchestrationId can be queried
  const conversation2 = await sdk.api.ai_conversations.createOne({
    type: 'test-conversation-2',
    modelName: 'test-model',
    messages: [testMessage],
    orchestrationId: testOrchestrationId,
  })

  await async_test(
    "AIConversations can be queried by orchestrationId",
    () => sdk.api.ai_conversations.getSome({ filter: { orchestrationId: testOrchestrationId } }),
    { onResult: conversations => (
         conversations.length === 2
      && conversations.some(c => c.id === conversation.id)
      && conversations.some(c => c.id === conversation2.id)
    ) }
  )

  // Note: delete is not enabled for ai_conversations, so no cleanup is performed
  // Test data will persist but is identifiable by 'test-' prefixes
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await ai_conversations_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ AI Conversations test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ AI Conversations test suite failed:", error)
      process.exit(1)
    })
}
