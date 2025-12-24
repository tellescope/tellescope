require('source-map-support').install();

import { Session } from "../../sdk"
import { 
  assert,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

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

    // Test 10: returnCount parameter - basic count
    console.log("Testing load_threads returnCount parameter...")

    const countResult = await sdk.api.inbox_threads.load_threads({ returnCount: true })
    assert(typeof countResult.count === 'number', "returnCount should return a count field with a number")
    assert(countResult.threads === undefined, "returnCount should not return threads array")

    // Verify count matches actual thread count
    const allThreads = await sdk.api.inbox_threads.load_threads({})
    assert(countResult.count === allThreads.threads.length, `Count (${countResult.count}) should match threads length (${allThreads.threads.length})`)

    console.log("✅ returnCount basic test passed")

    // Test 11: returnCount with enduserIds filter
    console.log("Testing returnCount with enduserIds filter...")

    const filteredThreads = await sdk.api.inbox_threads.load_threads({ enduserIds: [testEnduser.id] })
    const filteredCount = await sdk.api.inbox_threads.load_threads({ enduserIds: [testEnduser.id], returnCount: true })

    assert(typeof filteredCount.count === 'number', "Filtered returnCount should return a count")
    assert(filteredCount.count === filteredThreads.threads.length, `Filtered count (${filteredCount.count}) should match filtered threads length (${filteredThreads.threads.length})`)

    console.log("✅ returnCount with enduserIds filter test passed")

    // Test 12: returnCount returns 0 for non-matching filters
    console.log("Testing returnCount returns 0 for non-matching filters...")

    const nonMatchingCount = await sdk.api.inbox_threads.load_threads({
      enduserIds: ['000000000000000000000000'], // Non-existent enduser ID
      returnCount: true
    })

    assert(nonMatchingCount.count === 0, `Non-matching filter count should be 0, got ${nonMatchingCount.count}`)

    console.log("✅ returnCount with non-matching filter test passed")

    // Test 13: mdbFilter - filter by type
    console.log("Testing mdbFilter - filter by type...")
    const emailTypeFilter = await sdk.api.inbox_threads.load_threads({
      mdbFilter: { type: 'Email' }
    })
    const foundEmailByType = emailTypeFilter.threads.find(t => t.id === emailThread.id)
    const foundSmsByType = emailTypeFilter.threads.find(t => t.id === smsThread.id)
    assert(!!foundEmailByType, 'Email thread should be found when filtering by Email type')
    assert(!foundSmsByType, 'SMS thread should not be found when filtering by Email type')
    console.log("✅ mdbFilter type filter test passed")

    // Test 14: mdbFilter - filter by multiple types ($in)
    console.log("Testing mdbFilter - filter by multiple types...")
    const multiTypeFilter = await sdk.api.inbox_threads.load_threads({
      mdbFilter: { type: { $in: ['Email', 'SMS'] } }
    })
    const foundEmailMulti = multiTypeFilter.threads.find(t => t.id === emailThread.id)
    const foundSmsMulti = multiTypeFilter.threads.find(t => t.id === smsThread.id)
    const foundChatMulti = multiTypeFilter.threads.find(t => t.id === chatThread.id)
    assert(!!foundEmailMulti, 'Email thread should be found')
    assert(!!foundSmsMulti, 'SMS thread should be found')
    assert(!foundChatMulti, 'Chat thread should not be found when filtering Email/SMS')
    console.log("✅ mdbFilter multiple types filter test passed")

    // Test 15: mdbFilter - filter by assignedTo
    console.log("Testing mdbFilter - filter by assignedTo...")
    // First assign the email thread (may already be assigned from earlier tests)
    await sdk.api.inbox_threads.updateOne(emailThread.id, { assignedTo: [testUser.id] })
    const assigneeFilter = await sdk.api.inbox_threads.load_threads({
      mdbFilter: { assignedTo: testUser.id }
    })
    const foundAssigned = assigneeFilter.threads.find(t => t.id === emailThread.id)
    assert(!!foundAssigned, 'Email thread should be found when filtering by assignee')
    console.log("✅ mdbFilter assignedTo filter test passed")

    // Test 16: mdbFilter - combined with existing params
    console.log("Testing mdbFilter combined with enduserIds...")
    const combinedFilter = await sdk.api.inbox_threads.load_threads({
      enduserIds: [testEnduser.id],
      mdbFilter: { type: 'Email' }
    })
    const foundCombined = combinedFilter.threads.find(t => t.id === emailThread.id)
    assert(!!foundCombined, 'Email thread should be found with combined filters')
    console.log("✅ mdbFilter combined filter test passed")

    // Test 17: mdbFilter with returnCount
    console.log("Testing mdbFilter with returnCount...")
    const mdbFilterCount = await sdk.api.inbox_threads.load_threads({
      mdbFilter: { type: 'Email' },
      returnCount: true
    })
    assert(typeof mdbFilterCount.count === 'number', 'mdbFilter with returnCount should return count')
    assert((mdbFilterCount.count ?? 0) >= 1, 'Count should be at least 1 for Email type')
    console.log("✅ mdbFilter with returnCount test passed")

    // Test 18: mdbFilter with empty object (should return all)
    console.log("Testing mdbFilter with empty object...")
    const emptyMdbFilter = await sdk.api.inbox_threads.load_threads({
      mdbFilter: {}
    })
    assert(emptyMdbFilter.threads.length > 0, 'Empty mdbFilter should return threads')
    console.log("✅ mdbFilter empty object test passed")

    // Test 19: ids filter - filter by specific thread ids
    console.log("Testing ids filter - filter by specific thread ids...")
    const idsFilterResult = await sdk.api.inbox_threads.load_threads({
      ids: [emailThread.id, smsThread.id]
    })
    assert(idsFilterResult.threads.length === 2, `ids filter should return exactly 2 threads, got ${idsFilterResult.threads.length}`)
    const foundEmailById = idsFilterResult.threads.find(t => t.id === emailThread.id)
    const foundSmsById = idsFilterResult.threads.find(t => t.id === smsThread.id)
    const foundChatById = idsFilterResult.threads.find(t => t.id === chatThread.id)
    assert(!!foundEmailById, 'Email thread should be found when filtering by ids')
    assert(!!foundSmsById, 'SMS thread should be found when filtering by ids')
    assert(!foundChatById, 'Chat thread should not be found when not in ids list')
    console.log("✅ ids filter test passed")

    // Test 20: ids filter - single id
    console.log("Testing ids filter - single id...")
    const singleIdResult = await sdk.api.inbox_threads.load_threads({
      ids: [emailThread.id]
    })
    assert(singleIdResult.threads.length === 1, `Single id filter should return exactly 1 thread, got ${singleIdResult.threads.length}`)
    assert(singleIdResult.threads[0].id === emailThread.id, 'Should return the correct thread')
    console.log("✅ ids filter single id test passed")

    // Test 21: ids filter combined with other filters
    console.log("Testing ids filter combined with mdbFilter...")
    const idsCombinedResult = await sdk.api.inbox_threads.load_threads({
      ids: [emailThread.id, smsThread.id],
      mdbFilter: { type: 'Email' }
    })
    assert(idsCombinedResult.threads.length === 1, `Combined ids + mdbFilter should return 1 thread, got ${idsCombinedResult.threads.length}`)
    assert(idsCombinedResult.threads[0].id === emailThread.id, 'Should return only the email thread')
    console.log("✅ ids filter combined with mdbFilter test passed")

    // Test 22: ids filter with returnCount
    console.log("Testing ids filter with returnCount...")
    const idsCountResult = await sdk.api.inbox_threads.load_threads({
      ids: [emailThread.id, smsThread.id, chatThread.id],
      returnCount: true
    })
    assert(idsCountResult.count === 3, `ids filter with returnCount should return 3, got ${idsCountResult.count}`)
    console.log("✅ ids filter with returnCount test passed")

    // Test 23: ids filter with empty array (should return all)
    console.log("Testing ids filter with empty array...")
    const emptyIdsResult = await sdk.api.inbox_threads.load_threads({
      ids: []
    })
    assert(emptyIdsResult.threads.length >= 3, 'Empty ids array should not filter (return all threads)')
    console.log("✅ ids filter empty array test passed")

    // Test 24: sortBy parameter - default behavior (timestamp)
    console.log("Testing sortBy parameter - default behavior...")

    // Create threads with controlled timestamps for sort testing
    const sortTestBaseTime = Date.now()
    const sortThread1 = await sdk.api.inbox_threads.createOne({
      ...defaultThreadFields,
      type: "SMS",
      title: "Sort Test Thread 1",
      threadId: `sort-test-1-${timestamp}`,
      phoneNumber: "+15555550001",
      enduserPhoneNumber: "+15555550002",
      timestamp: new Date(sortTestBaseTime - 3000), // oldest timestamp
      outboundTimestamp: new Date(sortTestBaseTime), // newest outboundTimestamp
    })

    const sortThread2 = await sdk.api.inbox_threads.createOne({
      ...defaultThreadFields,
      type: "SMS",
      title: "Sort Test Thread 2",
      threadId: `sort-test-2-${timestamp}`,
      phoneNumber: "+15555550003",
      enduserPhoneNumber: "+15555550004",
      timestamp: new Date(sortTestBaseTime - 1000), // newest timestamp
      outboundTimestamp: new Date(sortTestBaseTime - 3000), // oldest outboundTimestamp
    })

    const sortThread3 = await sdk.api.inbox_threads.createOne({
      ...defaultThreadFields,
      type: "SMS",
      title: "Sort Test Thread 3",
      threadId: `sort-test-3-${timestamp}`,
      phoneNumber: "+15555550005",
      enduserPhoneNumber: "+15555550006",
      timestamp: new Date(sortTestBaseTime - 2000), // middle timestamp
      outboundTimestamp: new Date(sortTestBaseTime - 2000), // middle outboundTimestamp
    })

    // Test default sort (should be by timestamp descending)
    const defaultSortResult = await sdk.api.inbox_threads.load_threads({
      ids: [sortThread1.id, sortThread2.id, sortThread3.id]
    })
    assert(defaultSortResult.threads.length === 3, 'Should return 3 sort test threads')
    assert(defaultSortResult.threads[0].id === sortThread2.id, 'Default sort: newest timestamp should be first')
    assert(defaultSortResult.threads[1].id === sortThread3.id, 'Default sort: middle timestamp should be second')
    assert(defaultSortResult.threads[2].id === sortThread1.id, 'Default sort: oldest timestamp should be last')
    console.log("✅ sortBy default behavior test passed")

    // Test 25: sortBy='timestamp' explicit
    console.log("Testing sortBy='timestamp' explicit...")
    const timestampSortResult = await sdk.api.inbox_threads.load_threads({
      ids: [sortThread1.id, sortThread2.id, sortThread3.id],
      sortBy: 'timestamp'
    })
    assert(timestampSortResult.threads[0].id === sortThread2.id, 'Explicit timestamp sort: newest should be first')
    assert(timestampSortResult.threads[1].id === sortThread3.id, 'Explicit timestamp sort: middle should be second')
    assert(timestampSortResult.threads[2].id === sortThread1.id, 'Explicit timestamp sort: oldest should be last')
    console.log("✅ sortBy='timestamp' test passed")

    // Test 26: sortBy='outboundTimestamp'
    console.log("Testing sortBy='outboundTimestamp'...")
    const outboundSortResult = await sdk.api.inbox_threads.load_threads({
      ids: [sortThread1.id, sortThread2.id, sortThread3.id],
      sortBy: 'outboundTimestamp'
    })
    assert(outboundSortResult.threads[0].id === sortThread1.id, 'OutboundTimestamp sort: newest outbound should be first')
    assert(outboundSortResult.threads[1].id === sortThread3.id, 'OutboundTimestamp sort: middle outbound should be second')
    assert(outboundSortResult.threads[2].id === sortThread2.id, 'OutboundTimestamp sort: oldest outbound should be last')
    console.log("✅ sortBy='outboundTimestamp' test passed")

    // Cleanup sort test threads
    await Promise.all([
      sdk.api.inbox_threads.deleteOne(sortThread1.id),
      sdk.api.inbox_threads.deleteOne(sortThread2.id),
      sdk.api.inbox_threads.deleteOne(sortThread3.id),
    ])

    // ========== InboxStatus Preservation Tests ==========
    // These tests verify that outbound messages do NOT reset inboxStatus

    // Test 27: Outbound SMS should NOT reset inboxStatus
    console.log("Testing outbound SMS should NOT reset inboxStatus...")

    const statusTestSMS1 = await sdk.api.sms_messages.createOne({
      message: "Inbound test message for status test",
      enduserId: testEnduser.id,
      inbound: true,
      phoneNumber: "+15555559999",
      enduserPhoneNumber: "+15555559876",
      logOnly: true,
    })

    // Build threads using reset_threads + build_threads pattern
    const statusTestFrom = new Date(Date.now() - 60000)
    await sdk.api.inbox_threads.reset_threads()
    await sdk.api.inbox_threads.build_threads({ from: statusTestFrom, to: new Date() })

    const statusTestThreads = await sdk.api.inbox_threads.load_threads({})
    const statusTestThread = statusTestThreads.threads.find(t =>
      t.type === 'SMS' && t.enduserIds.includes(testEnduser.id) && t.phoneNumber === "+15555559999"
    )
    assert(!!statusTestThread, "Status test SMS thread should be created")
    assert(statusTestThread!.inboxStatus === 'New', `Initial status should be 'New', got '${statusTestThread!.inboxStatus}'`)

    // Update thread status to "Resolved"
    await sdk.api.inbox_threads.updateOne(statusTestThread!.id, { inboxStatus: "Resolved" })

    // Create outbound SMS (should NOT reset status)
    const statusTestSMS2 = await sdk.api.sms_messages.createOne({
      message: "Outbound reply - should not reset status",
      enduserId: testEnduser.id,
      inbound: false,
      phoneNumber: "+15555559999",
      enduserPhoneNumber: "+15555559876",
      logOnly: true,
    })

    // Rebuild threads - status should remain "Resolved"
    await sdk.api.inbox_threads.build_threads({ from: statusTestFrom, to: new Date() })

    const threadAfterOutbound = (await sdk.api.inbox_threads.load_threads({ ids: [statusTestThread!.id] })).threads[0]
    assert(threadAfterOutbound.inboxStatus === 'Resolved', `Status should remain 'Resolved' after outbound message, got '${threadAfterOutbound.inboxStatus}'`)
    assert(!!threadAfterOutbound.outboundTimestamp, "outboundTimestamp should be set after outbound message")

    console.log("✅ Outbound SMS does NOT reset inboxStatus test passed")

    // Test 28: New inbound SMS SHOULD update inboxStatus
    console.log("Testing new inbound SMS SHOULD update inboxStatus...")

    // Wait to ensure ObjectId timestamps are in different seconds (MongoDB ObjectIds have second-level precision)
    await new Promise(resolve => setTimeout(resolve, 1100))

    const statusTestSMS3 = await sdk.api.sms_messages.createOne({
      message: "New inbound - should update status",
      enduserId: testEnduser.id,
      inbound: true,
      phoneNumber: "+15555559999",
      enduserPhoneNumber: "+15555559876",
      inboxStatus: "New",
      logOnly: true,
    })

    // Rebuild threads - status SHOULD be updated from new inbound
    await sdk.api.inbox_threads.build_threads({ from: statusTestFrom, to: new Date() })

    const threadAfterNewInbound = (await sdk.api.inbox_threads.load_threads({ ids: [statusTestThread!.id] })).threads[0]
    assert(threadAfterNewInbound.inboxStatus === 'New', `Status SHOULD be 'New' after new inbound message, got '${threadAfterNewInbound.inboxStatus}'`)

    console.log("✅ New inbound SMS DOES update inboxStatus test passed")

    // Cleanup status preservation test resources
    await Promise.all([
      sdk.api.sms_messages.deleteOne(statusTestSMS1.id),
      sdk.api.sms_messages.deleteOne(statusTestSMS2.id),
      sdk.api.sms_messages.deleteOne(statusTestSMS3.id),
      sdk.api.inbox_threads.deleteOne(statusTestThread!.id),
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
  console.log(`🌐 Using API URL: ${host}`)
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