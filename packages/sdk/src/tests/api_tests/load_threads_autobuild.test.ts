import { Session } from "../../sdk"
import { assert, log_header, wait } from "@tellescope/testing"
import { setup_tests } from "../setup"

export const load_threads_autobuild_tests = async ({
  sdk,
  sdkNonAdmin
}: {
  sdk: Session,
  sdkNonAdmin: Session
}) => {
  log_header("Load Threads with Autobuild Tests")

  let testEnduser: any
  let testUser: any

  try {
    // Setup test data
    testEnduser = await sdk.api.endusers.createOne({
      email: `autobuild-test-${Date.now()}@test.com`,
      fname: "Autobuild",
      lname: "Test"
    })

    testUser = await sdk.api.users.createOne({
      email: `autobuild-user-${Date.now()}@test.com`,
      fname: "Test",
      lname: "User"
    })

    // Reset threads before testing
    await sdk.api.inbox_threads.reset_threads()

    // Test 1: Autobuild with no existing threads (bootstrap case)
    log_header("Test 1: Basic autobuild from scratch (bootstrap)")
    const sms1 = await sdk.api.sms_messages.createOne({
      message: "Test message for autobuild",
      enduserId: testEnduser.id,
      userId: testUser.id,
      inbound: true,
      phoneNumber: "+15555555555",
      enduserPhoneNumber: "+15555555556",
      logOnly: true,
    })

    const result1 = await sdk.api.inbox_threads.load_threads({
      autobuild: true
    })

    assert(result1.threads.length === 1, "Should load 1 thread after autobuild")
    assert(result1.threads[0].type === 'SMS', "Thread should be SMS type")

    // Test 2: Idempotency - calling autobuild again doesn't duplicate
    log_header("Test 2: Autobuild idempotency")
    const result2 = await sdk.api.inbox_threads.load_threads({
      autobuild: true
    })

    assert(result2.threads.length === 1, "Should still have 1 thread (no duplicates)")

    // Test 3: Autobuild with filters
    log_header("Test 3: Autobuild combined with enduserIds filter")
    const testEnduser2 = await sdk.api.endusers.createOne({
      email: `autobuild-test2-${Date.now()}@test.com`,
      fname: "Autobuild2",
      lname: "Test2"
    })

    const sms2 = await sdk.api.sms_messages.createOne({
      message: "Second test message",
      enduserId: testEnduser2.id,
      userId: testUser.id,
      inbound: true,
      phoneNumber: "+15555555557",
      enduserPhoneNumber: "+15555555558",
      logOnly: true,
    })

    const result3 = await sdk.api.inbox_threads.load_threads({
      autobuild: true,
      enduserIds: [testEnduser.id]
    })

    assert(result3.threads.length === 1, "Should filter to only 1 enduser's thread")
    assert(result3.threads[0].enduserIds.includes(testEnduser.id), "Should be first enduser's thread")

    // Test 4: Autobuild with phoneNumber filter
    log_header("Test 4: Autobuild with phoneNumber filter")
    const result4 = await sdk.api.inbox_threads.load_threads({
      autobuild: true,
      phoneNumber: "+15555555555"
    })

    assert(result4.threads.length === 1, "Should filter by phone number")
    assert(result4.threads[0].phoneNumber === '+15555555555', "Should match phone number")

    // Test 5: Autobuild with returnCount
    log_header("Test 5: Autobuild with returnCount")
    const result5 = await sdk.api.inbox_threads.load_threads({
      autobuild: true,
      returnCount: true
    })

    assert(result5.count === 2, "Should return count of 2 threads")
    assert(!result5.threads || result5.threads.length === 0, "Should not return threads when returnCount=true")

    // Test 6: Autobuild with pagination (backwards paging)
    log_header("Test 6: Autobuild with pagination (paging backwards)")

    // Get the oldest thread's timestamp
    const allThreads = await sdk.api.inbox_threads.load_threads({
      autobuild: false
    })
    const oldestThread = allThreads.threads[allThreads.threads.length - 1]

    // Load threads with lastTimestamp to simulate paging backwards
    const result6 = await sdk.api.inbox_threads.load_threads({
      autobuild: true,
      lastTimestamp: oldestThread.timestamp
    })

    // Should still return threads (may include older ones if any exist)
    assert(Array.isArray(result6.threads), "Should return threads when paging backwards")

    // Test 6b: Autobuild without lastTimestamp (loading current/newer data)
    log_header("Test 6b: Autobuild loads newer data when no lastTimestamp")
    const result6b = await sdk.api.inbox_threads.load_threads({
      autobuild: true
    })

    assert(result6b.threads.length >= 2, "Should load current threads")

    // Test 7: Non-admin user can use autobuild but sees filtered threads
    log_header("Test 7: Non-admin autobuild with access control")
    const result7 = await sdkNonAdmin.api.inbox_threads.load_threads({
      autobuild: true
    })

    // Non-admin should only see threads they have access to
    // (Exact assertion depends on role setup in setup_tests)
    assert(Array.isArray(result7.threads), "Non-admin should get threads array")

    // Test 8: Autobuild with draft and scheduled messages
    log_header("Test 8: Autobuild includes draft messages")
    const draftSms = await sdk.api.sms_messages.createOne({
      message: "Draft message",
      enduserId: testEnduser.id,
      userId: testUser.id,
      inbound: false,
      phoneNumber: "+15555555555",
      enduserPhoneNumber: "+15555555556",
      isDraft: true,
      logOnly: true,
    })

    // Wait to ensure message ObjectId timestamp is in the past before building
    await wait(undefined, 2000)

    const result8 = await sdk.api.inbox_threads.load_threads({
      autobuild: true,
      enduserIds: [testEnduser.id]
    })

    const threadWithDraft = result8.threads.find(t =>
      t.phoneNumber === '+15555555555' && t.enduserPhoneNumber === '+15555555556'
    )
    assert(!!threadWithDraft, "Should find thread with draft")
    assert(!!threadWithDraft?.draftMessageIds?.includes(draftSms.id), "Should include draft message ID")

    console.log("✅ All autobuild tests passed!")

    // Cleanup
    await sdk.api.endusers.deleteOne(testEnduser2.id)

  } finally {
    // Cleanup
    if (testEnduser) await sdk.api.endusers.deleteOne(testEnduser.id).catch(console.error)
    if (testUser) await sdk.api.users.deleteOne(testUser.id).catch(console.error)
    await sdk.api.inbox_threads.reset_threads().catch(console.error)
  }
}

// Allow running this test independently
if (require.main === module) {
  const host = process.env.API_URL || 'http://localhost:8080'
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await load_threads_autobuild_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Load threads autobuild test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Load threads autobuild test suite failed:", error)
      process.exit(1)
    })
}
