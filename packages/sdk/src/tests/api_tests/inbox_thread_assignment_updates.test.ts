require('source-map-support').install();

import { Session } from "../../sdk"
import { 
  assert,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.TEST_URL || 'http://localhost:8080' as const

export const inbox_thread_assignment_updates_tests = async ({ sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("InboxThread Assignment Update Tests")

  // Create unique identifiers to avoid conflicts
  const timestamp = Date.now()
  
  // Test data setup 
  const testUser = await sdk.api.users.createOne({
    fname: "Test",
    lname: "User", 
    email: `test-inbox-assignment-${timestamp}@test.com`,
    notificationEmailsDisabled: true
  })

  const testEnduser = await sdk.api.endusers.createOne({
    fname: "Test",
    lname: "Patient",
    email: `test-patient-inbox-${timestamp}@test.com`
  })

  // Default thread fields following the test pattern
  const defaultThreadFields = {
    assignedTo: [], 
    enduserIds: [testEnduser.id], 
    userIds: [], 
    inboxStatus: 'New', 
    preview: 'Test', 
    timestamp: new Date(), 
  }

  // Create test threads and messages  
  const emailSubject = `Test Email Subject ${timestamp}`
  const emailThreadId = emailSubject.toLowerCase().replaceAll("re:", "").replaceAll(" ", "")
  
  const emailThread = await sdk.api.inbox_threads.createOne({
    ...defaultThreadFields,
    type: "Email",
    title: "Test Email Assignment",
    threadId: emailThreadId,
  })

  const testEmail = await sdk.api.emails.createOne({
    subject: emailSubject, 
    textContent: "Test email content",
    enduserId: testEnduser.id,
    messageId: `test-message-${timestamp}`,
    userId: testUser.id,
    logOnly: true,
  })

  const smsThread = await sdk.api.inbox_threads.createOne({
    ...defaultThreadFields,
    type: "SMS",
    title: "Test SMS Assignment",
    threadId: `test-sms-thread-${timestamp}`,
    phoneNumber: "+15555555555",
    enduserPhoneNumber: "+15555555556",
  })

  const testSMS = await sdk.api.sms_messages.createOne({
    message: "Test SMS message",
    enduserId: testEnduser.id,
    userId: testUser.id,
    inbound: false,
    phoneNumber: "+15555555555",
    enduserPhoneNumber: "+15555555556",
    logOnly: true,
  })

  const testChatRoom = await sdk.api.chat_rooms.createOne({
    title: "Test Assignment Room",
    userIds: [testUser.id],
    enduserIds: [testEnduser.id]
  })

  // Create chat thread AFTER the chat message so timestamps align
  const chatThread = await sdk.api.inbox_threads.createOne({
    ...defaultThreadFields,
    type: "Chat",
    title: "Test Chat Assignment", 
    threadId: testChatRoom.id,
    timestamp: new Date(), // Use current timestamp after chat message
  })

  // Add a chat message to make the room show up in threads (requires recentMessageSentAt)
  await sdk.api.chats.createOne({
    roomId: testChatRoom.id,
    message: "Test chat message for thread building",
    enduserId: testEnduser.id,
    senderId: testEnduser.id
  })
  
  // Wait for the recentMessageSentAt to be set
  await new Promise(resolve => setTimeout(resolve, 500))


  try {
    // Test 1: Email Assignment Updates
    console.log("Testing email assignment updates...")
    
    // Update email assignment
    await sdk.api.emails.updateOne(testEmail.id, {
      assignedTo: [testUser.id]
    }, { replaceObjectFields: true })

    // Wait for side effects to process
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Verify thread assignment was updated
    const loadedThreads = await sdk.api.inbox_threads.load_threads({ })
    const updatedEmailThread = loadedThreads.threads.find(t => t.id === emailThread.id)
    assert(!!updatedEmailThread, "Email thread should be found")
    assert(JSON.stringify(updatedEmailThread!.assignedTo) === JSON.stringify([testUser.id]), "Email thread assignment should be updated")

    console.log("✅ Email assignment update test passed")

    // Test 2: SMS Assignment Updates  
    console.log("Testing SMS assignment updates...")
    
    await sdk.api.sms_messages.updateOne(testSMS.id, {
      assignedTo: [testUser.id]
    }, { replaceObjectFields: true })

    await new Promise(resolve => setTimeout(resolve, 1500))

    const loadedThreads2 = await sdk.api.inbox_threads.load_threads({ })
    const updatedSMSThread = loadedThreads2.threads.find(t => t.id === smsThread.id)
    assert(!!updatedSMSThread, "SMS thread should be found")
    assert(JSON.stringify(updatedSMSThread!.assignedTo) === JSON.stringify([testUser.id]), "SMS thread assignment should be updated")

    console.log("✅ SMS assignment update test passed")

    // Test 3: Chat Room Assignment Updates
    console.log("Testing chat room assignment updates...")

    await sdk.api.chat_rooms.updateOne(testChatRoom.id, {
      assignedTo: [testUser.id]
    }, { replaceObjectFields: true })

    await new Promise(resolve => setTimeout(resolve, 1500))

    const loadedThreads3 = await sdk.api.inbox_threads.load_threads({ })
    const updatedChatThread = loadedThreads3.threads.find(t => t.id === chatThread.id)
    assert(!!updatedChatThread, "Chat thread should be found")
    assert(JSON.stringify(updatedChatThread!.assignedTo) === JSON.stringify([testUser.id]), "Chat thread assignment should be updated")

    console.log("✅ Chat assignment update test passed")

    // Test 4: No Update When Assignment Unchanged
    console.log("Testing no update when assignment unchanged...")

    // Update email with same assignment (should not trigger thread update)
    await sdk.api.emails.updateOne(testEmail.id, {
      assignedTo: [testUser.id], // Same assignment
      subject: "Updated subject" // Different field
    }, { replaceObjectFields: true })

    await new Promise(resolve => setTimeout(resolve, 1500))

    // Verify thread assignment still correct (function should early return)
    const loadedThreads4 = await sdk.api.inbox_threads.load_threads({ })
    const unchangedThread = loadedThreads4.threads.find(t => t.id === emailThread.id)
    assert(!!unchangedThread, "Email thread should still be found")
    assert(JSON.stringify(unchangedThread!.assignedTo) === JSON.stringify([testUser.id]), "Thread assignment should remain unchanged")
    
    console.log("✅ No update when assignment unchanged test passed")

    // Test 5: Clear Assignment
    console.log("Testing assignment clearing...")

    await sdk.api.emails.updateOne(testEmail.id, {
      assignedTo: []
    }, { replaceObjectFields: true })

    await new Promise(resolve => setTimeout(resolve, 1500))

    const loadedThreads5 = await sdk.api.inbox_threads.load_threads({ })
    const clearedAssignThread = loadedThreads5.threads.find(t => t.id === emailThread.id)
    assert(!!clearedAssignThread, "Email thread should still be found") 
    assert(JSON.stringify(clearedAssignThread!.assignedTo) === JSON.stringify([]), "Thread assignment should be cleared")

    console.log("✅ Assignment clearing test passed")

    // Test 6: Same Timestamp Edge Case - Email
    console.log("Testing email assignment update with matching timestamps...")

    // Create a specific timestamp to use for both thread and message
    const fixedTimestamp = new Date('2023-01-01T10:00:00Z')

    // Generate threadId the same way buildEmailThreads does (get_insensitive_subject)
    const matchingTimestampSubject = "Matching Timestamp Test"
    const matchingTimestampThreadId = matchingTimestampSubject.toLowerCase().replaceAll("re:", "").replaceAll(" ", "")
    
    const matchingTimestampEmailThread = await sdk.api.inbox_threads.createOne({
      ...defaultThreadFields,
      type: "Email",
      title: "Matching Timestamp Email Test",
      threadId: matchingTimestampThreadId,
      timestamp: fixedTimestamp // Same timestamp we'll use for message
    })

    const matchingTimestampEmail = await sdk.api.emails.createOne({
      subject: matchingTimestampSubject, // Use the same subject for threadId consistency
      textContent: "Test email with matching timestamp", 
      enduserId: testEnduser.id,
      messageId: `matching-timestamp-email-${timestamp}`,
      userId: testUser.id,
      timestamp: fixedTimestamp, // Same timestamp as thread
      inbound: true, // Ensure this is treated as inbound for timestamp logic
      logOnly: true,
    })

    // Update email assignment - should work even with matching timestamps
    await sdk.api.emails.updateOne(matchingTimestampEmail.id, {
      assignedTo: [testUser.id]
    }, { replaceObjectFields: true })

    await new Promise(resolve => setTimeout(resolve, 1500))

    const loadedThreads6 = await sdk.api.inbox_threads.load_threads({})
    const matchingTimestampUpdatedThread = loadedThreads6.threads.find(t => t.id === matchingTimestampEmailThread.id)
    assert(!!matchingTimestampUpdatedThread, "Matching timestamp email thread should be found")
    assert(JSON.stringify(matchingTimestampUpdatedThread!.assignedTo) === JSON.stringify([testUser.id]), "Email thread assignment should update even with matching timestamps")

    console.log("✅ Email assignment with matching timestamps test passed")

    // Test 7: Same Timestamp Edge Case - SMS  
    console.log("Testing SMS assignment update with matching timestamps...")

    const matchingTimestampSMSThread = await sdk.api.inbox_threads.createOne({
      ...defaultThreadFields,
      type: "SMS",
      title: "Matching Timestamp SMS Test",
      threadId: `matching-timestamp-sms-${timestamp}`,
      phoneNumber: "+15555555557",
      enduserPhoneNumber: "+15555555558",
      timestamp: fixedTimestamp // Same timestamp we'll use for message
    })

    const matchingTimestampSMS = await sdk.api.sms_messages.createOne({
      message: "Matching timestamp SMS test",
      enduserId: testEnduser.id,
      userId: testUser.id,
      inbound: true, // Ensure this is treated as inbound for timestamp logic
      phoneNumber: "+15555555557",
      enduserPhoneNumber: "+15555555558",
      timestamp: fixedTimestamp, // Same timestamp as thread
      logOnly: true,
    })

    // Update SMS assignment - should work even with matching timestamps
    await sdk.api.sms_messages.updateOne(matchingTimestampSMS.id, {
      assignedTo: [testUser.id]
    }, { replaceObjectFields: true })

    await new Promise(resolve => setTimeout(resolve, 1500))

    const loadedThreads7 = await sdk.api.inbox_threads.load_threads({})
    const matchingTimestampSMSUpdatedThread = loadedThreads7.threads.find(t => t.id === matchingTimestampSMSThread.id)
    assert(!!matchingTimestampSMSUpdatedThread, "Matching timestamp SMS thread should be found")
    assert(JSON.stringify(matchingTimestampSMSUpdatedThread!.assignedTo) === JSON.stringify([testUser.id]), "SMS thread assignment should update even with matching timestamps")

    console.log("✅ SMS assignment with matching timestamps test passed")

    // Cleanup additional test resources
    await Promise.all([
      sdk.api.inbox_threads.deleteOne(matchingTimestampEmailThread.id),
      sdk.api.inbox_threads.deleteOne(matchingTimestampSMSThread.id),
      sdk.api.emails.deleteOne(matchingTimestampEmail.id),
      sdk.api.sms_messages.deleteOne(matchingTimestampSMS.id),
    ])

    // Test 8: Non-Existent Thread Case - Should NOT Create New Thread
    console.log("Testing behavior when no matching thread exists...")

    // Create an email without a pre-existing matching thread
    const orphanEmail = await sdk.api.emails.createOne({
      subject: "Orphan Email Test",
      textContent: "Email without matching thread",
      enduserId: testEnduser.id,
      messageId: `orphan-email-${timestamp}`,
      userId: testUser.id,
      logOnly: true,
    })

    // Count existing threads before update
    const threadsBeforeOrphanUpdate = await sdk.api.inbox_threads.load_threads({})
    const threadCountBefore = threadsBeforeOrphanUpdate.threads.length

    // Update assignment on email that has no matching thread
    await sdk.api.emails.updateOne(orphanEmail.id, {
      assignedTo: [testUser.id]
    }, { replaceObjectFields: true })

    await new Promise(resolve => setTimeout(resolve, 1500))

    // Verify no new thread was created (current expected behavior)
    const threadsAfterOrphanUpdate = await sdk.api.inbox_threads.load_threads({})
    const threadCountAfter = threadsAfterOrphanUpdate.threads.length
    
    assert(threadCountAfter === threadCountBefore, "No new thread should be created when no matching thread exists")

    console.log("✅ Non-existent thread test passed - no thread created as expected")

    // Test 9: Upsert Capability Test - Create Thread When None Exists
    console.log("Testing potential upsert capability...")

    // Create an SMS without a pre-existing matching thread
    const upsertSMS = await sdk.api.sms_messages.createOne({
      message: "Upsert SMS test",
      enduserId: testEnduser.id,
      userId: testUser.id,
      inbound: false,
      phoneNumber: "+15555555559", // Different phone number - won't match existing threads
      enduserPhoneNumber: "+15555555560",
      assignedTo: [testUser.id], // Assign immediately
      logOnly: true,
    })

    await new Promise(resolve => setTimeout(resolve, 1500))

    // Check if a new thread was created (would indicate upsert capability)
    const threadsAfterUpsertTest = await sdk.api.inbox_threads.load_threads({})
    const upsertedThread = threadsAfterUpsertTest.threads.find(t => 
      t.type === "SMS" && 
      t.phoneNumber === "+15555555559" && 
      t.enduserPhoneNumber === "+15555555560"
    )

    if (upsertedThread) {
      console.log("✅ Upsert capability detected - thread was created automatically")
      assert(JSON.stringify(upsertedThread.assignedTo) === JSON.stringify([testUser.id]), "Upserted thread should have correct assignment")
      
      // Cleanup the upserted thread
      await sdk.api.inbox_threads.deleteOne(upsertedThread.id)
    } else {
      console.log("✅ No upsert capability - thread was not created (current behavior)")
    }

    // Cleanup orphan email and upsert SMS
    await Promise.all([
      sdk.api.emails.deleteOne(orphanEmail.id),
      sdk.api.sms_messages.deleteOne(upsertSMS.id),
    ])

    console.log("🎉 All InboxThread assignment update tests passed!")

  } finally {
    // Cleanup
    try {
      await Promise.all([
        sdk.api.inbox_threads.deleteOne(emailThread.id),
        sdk.api.inbox_threads.deleteOne(smsThread.id), 
        sdk.api.inbox_threads.deleteOne(chatThread.id),
        sdk.api.emails.deleteOne(testEmail.id),
        sdk.api.sms_messages.deleteOne(testSMS.id),
        sdk.api.chat_rooms.deleteOne(testChatRoom.id),
        sdk.api.endusers.deleteOne(testEnduser.id),
        sdk.api.users.deleteOne(testUser.id),
      ])
    } catch (err) {
      console.error("Cleanup error:", err)
    }
  }
}

// Allow running this test file independently
if (require.main === module) {
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })
  
  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await inbox_thread_assignment_updates_tests({ sdk, sdkNonAdmin })
  }
  
  runTests()
    .then(() => {
      console.log("✅ InboxThread assignment update test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ InboxThread assignment update test suite failed:", error)
      process.exit(1)
    })
}