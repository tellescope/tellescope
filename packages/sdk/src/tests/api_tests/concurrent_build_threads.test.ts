require('source-map-support').install();

import { Session } from "../../sdk"
import {
  assert,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

export const concurrent_build_threads_tests = async ({ sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Concurrent Build Threads Test")

  const timestamp = Date.now()
  const from = new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago

  // Create a test enduser with a phone number
  const testEnduser = await sdk.api.endusers.createOne({
    fname: "ConcurrentTest",
    lname: "Patient",
    email: `concurrent-test-${timestamp}@test.com`,
    phone: "+15555550101",
  })

  const phoneNumber = "+15555550102"
  const enduserPhoneNumber = "+15555550101"

  // Create a test SMS message for the enduser
  const sms = await sdk.api.sms_messages.createOne({
    enduserId: testEnduser.id,
    phoneNumber,
    enduserPhoneNumber,
    message: 'Test message for concurrent build test',
    inbound: true,
    logOnly: true,
  })

  try {
    // Reset threads first to ensure clean state
    await sdk.api.inbox_threads.reset_threads()

    // Fire 3 concurrent load_threads requests with autobuild: true
    console.log("Firing 3 concurrent load_threads requests with autobuild: true...")
    const results = await Promise.all([
      sdk.api.inbox_threads.load_threads({ autobuild: true }),
      sdk.api.inbox_threads.load_threads({ autobuild: true }),
      sdk.api.inbox_threads.load_threads({ autobuild: true }),
    ])

    // Also fetch all threads to see if duplicates were created
    const allThreadsResult = await sdk.api.inbox_threads.load_threads({})
    const allThreads = allThreadsResult.threads

    // Filter for threads belonging to our test enduser
    const enduserThreads = allThreads.filter(t =>
      t.enduserIds?.includes(testEnduser.id) && t.type === 'SMS'
    )

    console.log(`Found ${enduserThreads.length} SMS threads for test enduser`)

    // Assert: should only have 1 thread, not duplicates
    assert(
      enduserThreads.length === 1,
      `Expected 1 SMS thread for enduser, found ${enduserThreads.length}. ` +
      `Thread IDs: ${enduserThreads.map(t => t.id).join(', ')}`
    )

    console.log("✅ Concurrent build test passed - no duplicate threads created")
  } finally {
    // Cleanup
    console.log("Cleaning up test data...")
    await sdk.api.sms_messages.deleteOne(sms.id)
    await sdk.api.endusers.deleteOne(testEnduser.id)
    // Clean up any threads created for this enduser
    const cleanupThreads = await sdk.api.inbox_threads.load_threads({})
    for (const thread of cleanupThreads.threads) {
      if (thread.enduserIds?.includes(testEnduser.id)) {
        await sdk.api.inbox_threads.deleteOne(thread.id)
      }
    }
  }
}

if (require.main === module) {
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await concurrent_build_threads_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Concurrent build threads test completed")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Concurrent build threads test failed:", error)
      process.exit(1)
    })
}
