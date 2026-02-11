require('source-map-support').install();

import { Session } from "../../sdk"
import {
  assert,
  log_header,
  wait,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

export const inbox_thread_draft_scheduled_tests = async ({ sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("InboxThread Draft and Scheduled Message Tests")

  const timestamp = Date.now()
  const from = new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago

  // Test data setup
  const testUser = await sdk.api.users.createOne({
    fname: "Test",
    lname: "User",
    email: `test-draft-scheduled-${timestamp}@test.com`,
    notificationEmailsDisabled: true
  })

  const testEnduser = await sdk.api.endusers.createOne({
    fname: "Test",
    lname: "Patient",
    email: `test-patient-draft-${timestamp}@test.com`,
    phone: "+15555555555", // Required for SMS tests
  })

  // Helper to reset and rebuild threads
  const resetAndBuildThreads = async () => {
    await sdk.api.inbox_threads.reset_threads()
    await sdk.api.inbox_threads.build_threads({ from, to: new Date() })
  }

  try {
    // ===== SMS Draft/Scheduled Tests =====
    log_header("SMS Draft and Scheduled Tests")

    // Test 1: Draft SMS should be tracked in draftMessageIds but excluded from preview
    console.log("Testing draft SMS tracking...")

    const phoneNumber = "+15555555550"
    const enduserPhoneNumber = "+15555555551"

    // Create an inbound SMS to establish the thread with proper phone numbers
    await sdk.api.sms_messages.createOne({
      message: "Inbound message to establish thread",
      enduserId: testEnduser.id,
      userId: testUser.id,
      inbound: true,
      phoneNumber,
      enduserPhoneNumber,
      logOnly: true,
    })

    // Create a regular outbound SMS
    const sentSMS = await sdk.api.sms_messages.createOne({
      message: "This is a sent message",
      enduserId: testEnduser.id,
      userId: testUser.id,
      inbound: false,
      phoneNumber,
      enduserPhoneNumber,
      logOnly: true,
    })

    // Create a draft SMS
    const draftSMS = await sdk.api.sms_messages.createOne({
      message: "This is a draft message",
      enduserId: testEnduser.id,
      userId: testUser.id,
      inbound: false,
      phoneNumber,
      enduserPhoneNumber,
      isDraft: true,
      logOnly: true,
    })

    // Build threads from messages
    await resetAndBuildThreads()

    // Load the thread and verify
    const loadedThreads = await sdk.api.inbox_threads.load_threads({})
    const smsThread = loadedThreads.threads.find(t =>
      t.type === 'SMS' && t.phoneNumber === phoneNumber && t.enduserPhoneNumber === enduserPhoneNumber
    )

    assert(!!smsThread, "SMS thread should be found")
    assert(
      smsThread!.draftMessageIds?.includes(draftSMS.id) === true,
      `Draft SMS ID should be in draftMessageIds. Got: ${JSON.stringify(smsThread!.draftMessageIds)}`
    )
    assert(
      smsThread!.preview?.includes("This is a sent message") === true,
      `Preview should be from sent message, not draft. Got: ${smsThread!.preview}`
    )
    assert(
      !smsThread!.isDraftOnlyThread,
      `isDraftOnlyThread should be falsy for threads with sent messages. Got: ${smsThread!.isDraftOnlyThread}`
    )

    console.log("✅ Draft SMS tracking test passed")

    // Test 2: Scheduled SMS (future sendAt) should be tracked in scheduledMessageIds
    console.log("Testing scheduled SMS tracking...")

    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now

    const scheduledSMS = await sdk.api.sms_messages.createOne({
      message: "This is a scheduled message",
      enduserId: testEnduser.id,
      userId: testUser.id,
      inbound: false,
      phoneNumber,
      enduserPhoneNumber,
      sendAt: futureDate,
      logOnly: true,
    })

    // Rebuild threads
    await resetAndBuildThreads()

    const loadedThreads2 = await sdk.api.inbox_threads.load_threads({})
    const threadWithScheduled = loadedThreads2.threads.find(t =>
      t.type === 'SMS' && t.phoneNumber === phoneNumber && t.enduserPhoneNumber === enduserPhoneNumber
    )

    assert(!!threadWithScheduled, "SMS thread should be found")
    assert(
      threadWithScheduled!.scheduledMessageIds?.includes(scheduledSMS.id) === true,
      `Scheduled SMS ID should be in scheduledMessageIds. Got: ${JSON.stringify(threadWithScheduled!.scheduledMessageIds)}`
    )
    assert(
      threadWithScheduled!.preview?.includes("This is a scheduled message") !== true,
      `Preview should NOT be from scheduled message. Got: ${threadWithScheduled!.preview}`
    )

    console.log("✅ Scheduled SMS tracking test passed")

    // ===== Email Draft/Scheduled Tests =====
    log_header("Email Draft and Scheduled Tests")

    // Test 3: Draft email should be tracked in draftMessageIds
    console.log("Testing draft email tracking...")

    const emailSubject = `Draft Test Email ${timestamp}`

    // Create a regular email first
    const sentEmail = await sdk.api.emails.createOne({
      subject: emailSubject,
      textContent: "This is a sent email",
      enduserId: testEnduser.id,
      userId: testUser.id,
      messageId: `sent-email-${timestamp}`,
      logOnly: true,
    })

    // Create a draft email
    const draftEmail = await sdk.api.emails.createOne({
      subject: emailSubject,
      textContent: "This is a draft email",
      enduserId: testEnduser.id,
      userId: testUser.id,
      messageId: `draft-email-${timestamp}`,
      isDraft: true,
      logOnly: true,
    })

    // Rebuild threads
    await resetAndBuildThreads()

    const loadedThreads3 = await sdk.api.inbox_threads.load_threads({})
    const emailThread = loadedThreads3.threads.find(t => t.type === 'Email' && t.title === emailSubject)

    assert(!!emailThread, "Email thread should be found")
    assert(
      emailThread!.draftMessageIds?.includes(draftEmail.id) === true,
      `Draft Email ID should be in draftMessageIds. Got: ${JSON.stringify(emailThread!.draftMessageIds)}`
    )
    assert(
      emailThread!.preview?.includes("This is a sent email") === true,
      `Preview should be from sent email, not draft. Got: ${emailThread!.preview}`
    )
    assert(
      !emailThread!.isDraftOnlyThread,
      `isDraftOnlyThread should be falsy for threads with sent messages. Got: ${emailThread!.isDraftOnlyThread}`
    )

    console.log("✅ Draft email tracking test passed")

    // Test 4: Scheduled email (future sendAt) should be tracked in scheduledMessageIds
    console.log("Testing scheduled email tracking...")

    const scheduledEmail = await sdk.api.emails.createOne({
      subject: emailSubject,
      textContent: "This is a scheduled email",
      enduserId: testEnduser.id,
      userId: testUser.id,
      messageId: `scheduled-email-${timestamp}`,
      sendAt: futureDate,
      logOnly: true,
    })

    // Rebuild threads
    await resetAndBuildThreads()

    const loadedThreads4 = await sdk.api.inbox_threads.load_threads({})
    const emailThreadWithScheduled = loadedThreads4.threads.find(t => t.type === 'Email' && t.title === emailSubject)

    assert(!!emailThreadWithScheduled, "Email thread should be found")
    assert(
      emailThreadWithScheduled!.scheduledMessageIds?.includes(scheduledEmail.id) === true,
      `Scheduled Email ID should be in scheduledMessageIds. Got: ${JSON.stringify(emailThreadWithScheduled!.scheduledMessageIds)}`
    )
    assert(
      emailThreadWithScheduled!.preview?.includes("This is a scheduled email") !== true,
      `Preview should NOT be from scheduled email. Got: ${emailThreadWithScheduled!.preview}`
    )

    console.log("✅ Scheduled email tracking test passed")

    // Test 5: Thread with ONLY drafts should still have a preview from the drafts
    console.log("Testing thread with only draft messages...")

    const draftOnlyEnduserPhoneNumber = "+15555555561"

    // Only create a draft - no inbound message, so phoneNumber will be placeholder
    const draftOnlySMS = await sdk.api.sms_messages.createOne({
      message: "This is the only message and it is a draft",
      enduserId: testEnduser.id,
      userId: testUser.id,
      inbound: false,
      phoneNumber: "+15555555560",
      enduserPhoneNumber: draftOnlyEnduserPhoneNumber,
      isDraft: true,
      logOnly: true,
    })

    // Rebuild threads
    await resetAndBuildThreads()

    const loadedThreads5 = await sdk.api.inbox_threads.load_threads({})
    // Match only on enduserPhoneNumber since there's no inbound to set phoneNumber
    const draftOnlyThread = loadedThreads5.threads.find(t =>
      t.type === 'SMS' && t.enduserPhoneNumber === draftOnlyEnduserPhoneNumber
    )

    assert(!!draftOnlyThread, "Draft-only thread should be found")
    assert(
      draftOnlyThread!.draftMessageIds?.includes(draftOnlySMS.id) === true,
      `Draft SMS ID should be in draftMessageIds`
    )
    // When only drafts exist, the draft is used as fallback for preview
    assert(
      draftOnlyThread!.preview?.includes("only message") === true,
      `Preview should fall back to draft when no sent messages exist. Got: ${draftOnlyThread!.preview}`
    )
    assert(
      draftOnlyThread!.isDraftOnlyThread === true,
      `isDraftOnlyThread should be true for draft-only threads. Got: ${draftOnlyThread!.isDraftOnlyThread}`
    )

    console.log("✅ Thread with only draft messages test passed")

    // Test 5b: Thread with ONLY draft email should create placeholder thread
    console.log("Testing thread with only draft email messages...")

    const draftOnlyEmailSubject = `Draft-Only Email Test ${timestamp}`

    // Only create a draft email - no inbound message
    const draftOnlyEmail = await sdk.api.emails.createOne({
      subject: draftOnlyEmailSubject,
      textContent: "This is a draft-only email, no sent messages exist",
      enduserId: testEnduser.id,
      userId: testUser.id,
      messageId: `draft-only-email-${timestamp}`,
      isDraft: true,
      logOnly: true,
    })

    // Rebuild threads
    await resetAndBuildThreads()

    const loadedThreads5b = await sdk.api.inbox_threads.load_threads({})
    const draftOnlyEmailThread = loadedThreads5b.threads.find(t =>
      t.type === 'Email' && t.title === draftOnlyEmailSubject
    )

    assert(!!draftOnlyEmailThread, "Draft-only email thread should be found")
    assert(
      draftOnlyEmailThread!.draftMessageIds?.includes(draftOnlyEmail.id) === true,
      `Draft Email ID should be in draftMessageIds. Got: ${JSON.stringify(draftOnlyEmailThread!.draftMessageIds)}`
    )
    // When only drafts exist, the draft is used as fallback for preview
    assert(
      draftOnlyEmailThread!.preview?.includes("draft-only email") === true,
      `Preview should fall back to draft when no sent messages exist. Got: ${draftOnlyEmailThread!.preview}`
    )
    assert(
      draftOnlyEmailThread!.isDraftOnlyThread === true,
      `isDraftOnlyThread should be true for draft-only threads. Got: ${draftOnlyEmailThread!.isDraftOnlyThread}`
    )

    console.log("✅ Thread with only draft email messages test passed")

    // Test 6: Verify fields are correctly typed as arrays
    console.log("Testing field types...")

    assert(
      Array.isArray(smsThread!.draftMessageIds),
      "draftMessageIds should be an array"
    )
    assert(
      Array.isArray(threadWithScheduled!.scheduledMessageIds),
      "scheduledMessageIds should be an array"
    )

    console.log("✅ Field types test passed")

    // Test 7: Threads with NO drafts/scheduled should have empty arrays (not undefined)
    console.log("Testing empty array defaults for threads with only sent messages...")

    const sentOnlyPhoneNumber = "+15555555570"
    const sentOnlyEnduserPhoneNumber = "+15555555571"

    // Create an inbound message to establish the thread with proper phone numbers
    await sdk.api.sms_messages.createOne({
      message: "Inbound message",
      enduserId: testEnduser.id,
      userId: testUser.id,
      inbound: true,
      phoneNumber: sentOnlyPhoneNumber,
      enduserPhoneNumber: sentOnlyEnduserPhoneNumber,
      logOnly: true,
    })

    // Create an outbound sent message (no draft, no scheduled)
    await sdk.api.sms_messages.createOne({
      message: "This is a sent message only",
      enduserId: testEnduser.id,
      userId: testUser.id,
      inbound: false,
      phoneNumber: sentOnlyPhoneNumber,
      enduserPhoneNumber: sentOnlyEnduserPhoneNumber,
      logOnly: true,
    })

    // Rebuild threads
    await resetAndBuildThreads()

    const loadedThreads6 = await sdk.api.inbox_threads.load_threads({})
    const sentOnlyThread = loadedThreads6.threads.find(t =>
      t.type === 'SMS' && t.phoneNumber === sentOnlyPhoneNumber && t.enduserPhoneNumber === sentOnlyEnduserPhoneNumber
    )

    assert(!!sentOnlyThread, "Sent-only thread should be found")
    assert(
      Array.isArray(sentOnlyThread!.draftMessageIds) && sentOnlyThread!.draftMessageIds.length === 0,
      `draftMessageIds should be an empty array when no drafts exist. Got: ${JSON.stringify(sentOnlyThread!.draftMessageIds)}`
    )
    assert(
      Array.isArray(sentOnlyThread!.scheduledMessageIds) && sentOnlyThread!.scheduledMessageIds.length === 0,
      `scheduledMessageIds should be an empty array when no scheduled messages exist. Got: ${JSON.stringify(sentOnlyThread!.scheduledMessageIds)}`
    )
    assert(
      !sentOnlyThread!.isDraftOnlyThread,
      `isDraftOnlyThread should be falsy for threads with sent messages. Got: ${sentOnlyThread!.isDraftOnlyThread}`
    )

    console.log("✅ Empty array defaults test passed")

    // ===== Chat Draft Cleanup on Send Tests =====
    log_header("Chat Draft Cleanup on Send Tests")

    // Test 8: Verify draftMessageIds is cleaned up when a draft chat is sent
    // Note: Chat threads don't auto-populate draftMessageIds during build_threads,
    // so we manually set it up to test the cleanup logic in the event handler
    console.log("Testing draft chat cleanup on send...")

    // Create a chat room for testing
    const chatRoom = await sdk.api.chat_rooms.createOne({
      userIds: [testUser.id],
      enduserIds: [testEnduser.id],
    })

    // Create a non-draft message first to establish the room (sets recentMessageSentAt)
    // This is required for the room to be included in build_threads
    await sdk.api.chats.createOne({
      roomId: chatRoom.id,
      message: "Initial message to establish room",
      senderId: testEnduser.id,
    })

    // Create a draft chat message (isDraft: true, sendAt far in future like webapp does)
    const farFuture = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000) // 100 years
    const draftChat = await sdk.api.chats.createOne({
      roomId: chatRoom.id,
      message: "This is a draft chat message",
      senderId: testUser.id,
      isDraft: true,
      sendAt: farFuture,
    })

    // Build threads to create the Chat thread
    await resetAndBuildThreads()

    const loadedThreads7 = await sdk.api.inbox_threads.load_threads({})
    const chatThreadBefore = loadedThreads7.threads.find(t =>
      t.type === 'Chat' && t.enduserIds?.includes(testEnduser.id)
    )

    assert(!!chatThreadBefore, "Chat thread should be found")
    assert(
      !chatThreadBefore!.isDraftOnlyThread,
      `isDraftOnlyThread should be falsy for chat threads with sent messages. Got: ${chatThreadBefore!.isDraftOnlyThread}`
    )

    // Manually add the draft ID to draftMessageIds to simulate the setup
    // (Chat thread building doesn't auto-populate this, but the cleanup should still work)
    await sdk.api.inbox_threads.updateOne(chatThreadBefore!.id, {
      draftMessageIds: [draftChat.id],
    })

    // Verify manual setup worked
    const loadedThreads7b = await sdk.api.inbox_threads.load_threads({})
    const chatThreadWithDraft = loadedThreads7b.threads.find(t => t.id === chatThreadBefore!.id)
    assert(
      chatThreadWithDraft!.draftMessageIds?.includes(draftChat.id) === true,
      `Draft chat ID should be in draftMessageIds after manual setup. Got: ${JSON.stringify(chatThreadWithDraft!.draftMessageIds)}`
    )

    console.log("✅ Draft chat manually added to draftMessageIds")

    // "Send" the draft by updating isDraft to false and sendAt to now
    // This mimics what the webapp does when user clicks send
    await sdk.api.chats.updateOne(draftChat.id, {
      isDraft: false,
      sendAt: new Date(), // Now - triggers the scheduled chat handler
    })

    // Wait for the side effect to process
    await wait(undefined, 500)

    // Reload the thread and verify cleanup happened
    const loadedThreads8 = await sdk.api.inbox_threads.load_threads({})
    const chatThreadAfter = loadedThreads8.threads.find(t => t.id === chatThreadBefore!.id)

    assert(!!chatThreadAfter, "Chat thread should be found after send")
    assert(
      chatThreadAfter!.draftMessageIds?.includes(draftChat.id) === false,
      `Draft chat ID should be REMOVED from draftMessageIds after send. Got: ${JSON.stringify(chatThreadAfter!.draftMessageIds)}`
    )

    console.log("✅ Draft chat cleanup on send test passed")

    // Cleanup chat room
    await sdk.api.chat_rooms.deleteOne(chatRoom.id).catch(console.error)

    // ===== Message Deletion Cleanup Tests =====
    log_header("Message Deletion Cleanup Tests")

    // Test 9: SMS draft deletion should remove ID from draftMessageIds
    console.log("Testing SMS draft deletion cleanup...")

    const deleteTestPhoneNumber = "+15555555580"
    const deleteTestEnduserPhoneNumber = "+15555555581"

    // Create an inbound SMS to establish the thread
    await sdk.api.sms_messages.createOne({
      message: "Inbound message to establish thread for deletion test",
      enduserId: testEnduser.id,
      userId: testUser.id,
      inbound: true,
      phoneNumber: deleteTestPhoneNumber,
      enduserPhoneNumber: deleteTestEnduserPhoneNumber,
      logOnly: true,
    })

    // Create a draft SMS
    const draftSmsToDelete = await sdk.api.sms_messages.createOne({
      message: "This draft will be deleted",
      enduserId: testEnduser.id,
      userId: testUser.id,
      inbound: false,
      phoneNumber: deleteTestPhoneNumber,
      enduserPhoneNumber: deleteTestEnduserPhoneNumber,
      isDraft: true,
      logOnly: true,
    })

    // Build threads to populate draftMessageIds
    await resetAndBuildThreads()

    // Verify the draft ID is in the thread
    const loadedThreads9a = await sdk.api.inbox_threads.load_threads({})
    const smsDeleteThread = loadedThreads9a.threads.find(t =>
      t.type === 'SMS' && t.phoneNumber === deleteTestPhoneNumber && t.enduserPhoneNumber === deleteTestEnduserPhoneNumber
    )

    assert(!!smsDeleteThread, "SMS thread for deletion test should be found")
    assert(
      smsDeleteThread!.draftMessageIds?.includes(draftSmsToDelete.id) === true,
      `Draft SMS ID should be in draftMessageIds before deletion. Got: ${JSON.stringify(smsDeleteThread!.draftMessageIds)}`
    )

    // Delete the draft SMS
    await sdk.api.sms_messages.deleteOne(draftSmsToDelete.id)

    // Wait for the delete side effect to process
    await wait(undefined, 500)

    // Verify the draft ID has been removed
    const loadedThreads9b = await sdk.api.inbox_threads.load_threads({})
    const smsDeleteThreadAfter = loadedThreads9b.threads.find(t => t.id === smsDeleteThread!.id)

    assert(!!smsDeleteThreadAfter, "SMS thread should still exist after draft deletion")
    assert(
      smsDeleteThreadAfter!.draftMessageIds?.includes(draftSmsToDelete.id) === false,
      `Draft SMS ID should be REMOVED from draftMessageIds after deletion. Got: ${JSON.stringify(smsDeleteThreadAfter!.draftMessageIds)}`
    )

    console.log("✅ SMS draft deletion cleanup test passed")

    // Test 10: Email draft deletion should remove ID from draftMessageIds
    console.log("Testing email draft deletion cleanup...")

    const deleteEmailSubject = `Delete Test Email ${timestamp}`

    // Create a sent email first to establish the thread
    await sdk.api.emails.createOne({
      subject: deleteEmailSubject,
      textContent: "Sent email to establish thread for deletion test",
      enduserId: testEnduser.id,
      userId: testUser.id,
      messageId: `sent-email-delete-test-${timestamp}`,
      logOnly: true,
    })

    // Create a draft email
    const draftEmailToDelete = await sdk.api.emails.createOne({
      subject: deleteEmailSubject,
      textContent: "This draft email will be deleted",
      enduserId: testEnduser.id,
      userId: testUser.id,
      messageId: `draft-email-delete-test-${timestamp}`,
      isDraft: true,
      logOnly: true,
    })

    // Build threads to populate draftMessageIds
    await resetAndBuildThreads()

    // Verify the draft ID is in the thread
    const loadedThreads10a = await sdk.api.inbox_threads.load_threads({})
    const emailDeleteThread = loadedThreads10a.threads.find(t => t.type === 'Email' && t.title === deleteEmailSubject)

    assert(!!emailDeleteThread, "Email thread for deletion test should be found")
    assert(
      emailDeleteThread!.draftMessageIds?.includes(draftEmailToDelete.id) === true,
      `Draft Email ID should be in draftMessageIds before deletion. Got: ${JSON.stringify(emailDeleteThread!.draftMessageIds)}`
    )

    // Delete the draft email
    await sdk.api.emails.deleteOne(draftEmailToDelete.id)

    // Wait for the delete side effect to process
    await wait(undefined, 500)

    // Verify the draft ID has been removed
    const loadedThreads10b = await sdk.api.inbox_threads.load_threads({})
    const emailDeleteThreadAfter = loadedThreads10b.threads.find(t => t.id === emailDeleteThread!.id)

    assert(!!emailDeleteThreadAfter, "Email thread should still exist after draft deletion")
    assert(
      emailDeleteThreadAfter!.draftMessageIds?.includes(draftEmailToDelete.id) === false,
      `Draft Email ID should be REMOVED from draftMessageIds after deletion. Got: ${JSON.stringify(emailDeleteThreadAfter!.draftMessageIds)}`
    )

    console.log("✅ Email draft deletion cleanup test passed")

    // Test 11: Chat draft deletion should remove ID from draftMessageIds
    console.log("Testing chat draft deletion cleanup...")

    // Create a chat room for testing
    const chatRoomForDeletion = await sdk.api.chat_rooms.createOne({
      userIds: [testUser.id],
      enduserIds: [testEnduser.id],
    })

    // Create a non-draft message first to establish the room
    await sdk.api.chats.createOne({
      roomId: chatRoomForDeletion.id,
      message: "Initial message to establish room for deletion test",
      senderId: testEnduser.id,
    })

    // Create a draft chat message
    const farFuture2 = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000)
    const draftChatToDelete = await sdk.api.chats.createOne({
      roomId: chatRoomForDeletion.id,
      message: "This draft chat will be deleted",
      senderId: testUser.id,
      isDraft: true,
      sendAt: farFuture2,
    })

    // Build threads to create the Chat thread
    await resetAndBuildThreads()

    const loadedThreads11a = await sdk.api.inbox_threads.load_threads({})
    const chatDeleteThread = loadedThreads11a.threads.find(t =>
      t.type === 'Chat' && t.enduserIds?.includes(testEnduser.id)
    )

    assert(!!chatDeleteThread, "Chat thread for deletion test should be found")

    // Manually add the draft ID to draftMessageIds (since chat threads don't auto-populate this)
    await sdk.api.inbox_threads.updateOne(chatDeleteThread!.id, {
      draftMessageIds: [draftChatToDelete.id],
    })

    // Verify manual setup worked
    const loadedThreads11b = await sdk.api.inbox_threads.load_threads({})
    const chatDeleteThreadWithDraft = loadedThreads11b.threads.find(t => t.id === chatDeleteThread!.id)
    assert(
      chatDeleteThreadWithDraft!.draftMessageIds?.includes(draftChatToDelete.id) === true,
      `Draft chat ID should be in draftMessageIds after manual setup. Got: ${JSON.stringify(chatDeleteThreadWithDraft!.draftMessageIds)}`
    )

    // Delete the draft chat
    await sdk.api.chats.deleteOne(draftChatToDelete.id)

    // Wait for the delete side effect to process
    await wait(undefined, 500)

    // Verify the draft ID has been removed
    const loadedThreads11c = await sdk.api.inbox_threads.load_threads({})
    const chatDeleteThreadAfter = loadedThreads11c.threads.find(t => t.id === chatDeleteThread!.id)

    assert(!!chatDeleteThreadAfter, "Chat thread should still exist after draft deletion")
    assert(
      chatDeleteThreadAfter!.draftMessageIds?.includes(draftChatToDelete.id) === false,
      `Draft Chat ID should be REMOVED from draftMessageIds after deletion. Got: ${JSON.stringify(chatDeleteThreadAfter!.draftMessageIds)}`
    )

    console.log("✅ Chat draft deletion cleanup test passed")

    // Cleanup deletion test chat room
    await sdk.api.chat_rooms.deleteOne(chatRoomForDeletion.id).catch(console.error)

    // ===== Attachment-Only Preview Tests =====
    log_header("Attachment-Only Preview Tests")

    // Test 12: Chat message with only attachments should show "[Attachment]" preview
    console.log("Testing attachment-only chat preview...")

    // Create a chat room for testing
    const attachmentTestRoom = await sdk.api.chat_rooms.createOne({
      userIds: [testUser.id],
      enduserIds: [testEnduser.id],
    })

    // Create an initial message to establish the room
    await sdk.api.chats.createOne({
      roomId: attachmentTestRoom.id,
      message: "Initial message to establish room",
      senderId: testEnduser.id,
    })

    // Create a chat message with only attachments (empty message, but has attachment)
    await sdk.api.chats.createOne({
      roomId: attachmentTestRoom.id,
      message: "", // Empty message
      senderId: testEnduser.id,
      attachments: [{ secureName: "test-file.pdf", type: "application/pdf", name: "test-file.pdf" }],
    })

    // Wait for the side effect to update the room
    await wait(undefined, 500)

    // Rebuild threads
    await resetAndBuildThreads()

    // Load the thread and verify preview
    const loadedThreads12 = await sdk.api.inbox_threads.load_threads({})
    const attachmentThread = loadedThreads12.threads.find(t =>
      t.type === 'Chat' && t.threadId === attachmentTestRoom.id
    )

    assert(!!attachmentThread, "Attachment test chat thread should be found")
    assert(
      attachmentThread!.preview === '[Attachment]',
      `Preview should be "[Attachment]" for attachment-only messages. Got: "${attachmentThread!.preview}"`
    )

    console.log("✅ Attachment-only chat preview test passed")

    // Cleanup attachment test chat room
    await sdk.api.chat_rooms.deleteOne(attachmentTestRoom.id).catch(console.error)

    console.log("🎉 All InboxThread draft/scheduled tests passed!")

  } finally {
    // Cleanup
    await sdk.api.inbox_threads.reset_threads().catch(console.error)
    await sdk.api.endusers.deleteOne(testEnduser.id).catch(console.error)
    await sdk.api.users.deleteOne(testUser.id).catch(console.error)
  }
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await inbox_thread_draft_scheduled_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ InboxThread draft/scheduled test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ InboxThread draft/scheduled test suite failed:", error)
      process.exit(1)
    })
}
