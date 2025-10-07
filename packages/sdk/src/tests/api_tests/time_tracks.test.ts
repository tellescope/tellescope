require('source-map-support').install();

import { Session } from "../../sdk"
import { assert, log_header, wait } from "@tellescope/testing"
import { setup_tests } from "../setup"

const log = console.log

const host = process.env.REACT_APP_TELLESCOPE_API_URL || 'http://localhost:8080'

// Unit tests for calculateTimeTrackDuration
const test_calculateTimeTrackDuration = () => {
  log_header("calculateTimeTrackDuration Unit Tests")

  const { calculateTimeTrackDuration } = require('@tellescope/utilities')

  // Test 1: Single start-pause interval
  const test1 = calculateTimeTrackDuration([
    { type: 'start', timestamp: new Date('2024-01-01T10:00:00Z') },
    { type: 'pause', timestamp: new Date('2024-01-01T10:05:00Z') },
  ])
  assert(test1 === 300000, `Single 5-minute interval should be 300000 ms, got ${test1}`)

  // Test 2: Start-pause-resume-pause
  const test2 = calculateTimeTrackDuration([
    { type: 'start', timestamp: new Date('2024-01-01T10:00:00Z') },
    { type: 'pause', timestamp: new Date('2024-01-01T10:05:00Z') },
    { type: 'resume', timestamp: new Date('2024-01-01T10:10:00Z') },
    { type: 'pause', timestamp: new Date('2024-01-01T10:20:00Z') },
  ])
  assert(test2 === 900000, `Two intervals (5min + 10min) should be 900000 ms, got ${test2}`)

  // Test 3: Start with closedAt (not paused before close)
  const test3 = calculateTimeTrackDuration([
    { type: 'start', timestamp: new Date('2024-01-01T10:00:00Z') },
  ], new Date('2024-01-01T10:15:00Z'))
  assert(test3 === 900000, `Running for 15 minutes should be 900000 ms, got ${test3}`)

  // Test 4: Start-pause with closedAt (paused, should not add time after pause)
  const test4 = calculateTimeTrackDuration([
    { type: 'start', timestamp: new Date('2024-01-01T10:00:00Z') },
    { type: 'pause', timestamp: new Date('2024-01-01T10:05:00Z') },
  ], new Date('2024-01-01T10:30:00Z'))
  assert(test4 === 300000, `Paused at 5 minutes should still be 300000 ms even with later closedAt, got ${test4}`)

  // Test 5: Start-resume without initial pause (resume should act as continuation)
  const test5 = calculateTimeTrackDuration([
    { type: 'start', timestamp: new Date('2024-01-01T10:00:00Z') },
    { type: 'pause', timestamp: new Date('2024-01-01T10:05:00Z') },
    { type: 'resume', timestamp: new Date('2024-01-01T10:05:00Z') },
  ], new Date('2024-01-01T10:10:00Z'))
  assert(test5 === 600000, `5min paused + 5min resumed should be 600000 ms, got ${test5}`)

  // Test 6: Empty timestamps
  const test6 = calculateTimeTrackDuration([])
  assert(test6 === 0, `Empty timestamps should be 0 ms, got ${test6}`)

  // Test 7: Multiple pause/resume cycles
  const test7 = calculateTimeTrackDuration([
    { type: 'start', timestamp: new Date('2024-01-01T10:00:00Z') },
    { type: 'pause', timestamp: new Date('2024-01-01T10:10:00Z') }, // 10 min
    { type: 'resume', timestamp: new Date('2024-01-01T11:00:00Z') },
    { type: 'pause', timestamp: new Date('2024-01-01T11:30:00Z') }, // 30 min
    { type: 'resume', timestamp: new Date('2024-01-01T12:00:00Z') },
    { type: 'pause', timestamp: new Date('2024-01-01T12:05:00Z') }, // 5 min
  ])
  assert(test7 === 2700000, `Three intervals (10+30+5 min) should be 2700000 ms, got ${test7}`)

  log("✅ All calculateTimeTrackDuration unit tests passed")
}

// API tests for time_tracks CRUD operations
export const time_tracks_tests = async ({ sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Time Tracks API Tests")

  const userId = sdk.userInfo.id
  let createdTimeTrackId: string | undefined
  let enduserId: string | undefined

  try {
    // Test 1: Create a time track
    log("Creating time track...")
    const timeTrack = await sdk.api.time_tracks.createOne({
      title: "Test Time Track",
    } as any)
    createdTimeTrackId = timeTrack.id

    assert(timeTrack.title === "Test Time Track", "Title should match")
    assert(timeTrack.userId === userId, `userId should be auto-set to current user ${userId}, got ${timeTrack.userId}`)
    assert(Array.isArray(timeTrack.timestamps), "timestamps should be an array")
    assert(timeTrack.timestamps?.length === 1, `timestamps should have 1 initial start event, got ${timeTrack.timestamps?.length}`)
    assert(timeTrack.timestamps?.[0].type === 'start', `First timestamp should be 'start', got ${timeTrack.timestamps?.[0].type}`)
    assert(!timeTrack.closedAt, "closedAt should not be set initially")
    assert(!timeTrack.totalDurationInMS, "totalDurationInMS should not be set initially")
    log("✅ Time track created with auto-set userId and initial timestamp")

    // Test 2: Read the time track
    log("Reading time track...")
    const fetchedTimeTrack = await sdk.api.time_tracks.getOne(timeTrack.id)
    assert(fetchedTimeTrack.id === timeTrack.id, "Fetched time track should have same id")
    assert(fetchedTimeTrack.title === "Test Time Track", "Fetched title should match")
    log("✅ Time track retrieved successfully")

    // Test 3: Get all time tracks for current user
    log("Getting all time tracks for current user...")
    const allTimeTracks = await sdk.api.time_tracks.getSome({ filter: { userId } })
    assert(allTimeTracks.length >= 1, `Should have at least 1 time track, got ${allTimeTracks.length}`)
    assert(!!allTimeTracks.find(t => t.id === timeTrack.id), "Should find our created time track")
    log("✅ Retrieved all time tracks for user")

    // Test 4: Create enduser and link time track
    log("Creating enduser for time track linkage...")
    const enduser = await sdk.api.endusers.createOne({
      email: `timetrack-test-${Date.now()}@test.com`,
      fname: "Time",
      lname: "Track",
    })
    enduserId = enduser.id
    log("✅ Enduser created")

    // Test 5: Create time track with enduserId
    log("Creating time track linked to enduser...")
    const linkedTimeTrack = await sdk.api.time_tracks.createOne({
      title: "Client Meeting",
      enduserId: enduser.id,
    } as any)
    assert(linkedTimeTrack.enduserId === enduser.id, `enduserId should be set to ${enduser.id}, got ${linkedTimeTrack.enduserId}`)
    log("✅ Time track linked to enduser")

    // Test 6: Update time track - add pause timestamp
    log("Adding pause timestamp...")
    const pauseTime = new Date()
    const pausedTimeTrack = await sdk.api.time_tracks.updateOne(timeTrack.id, {
      timestamps: [
        ...(timeTrack.timestamps || []),
        { type: 'pause', timestamp: pauseTime },
      ]
    }, { replaceObjectFields: true })
    assert(pausedTimeTrack.timestamps?.length === 2, `Should have 2 timestamps after pause, got ${pausedTimeTrack.timestamps?.length}`)
    assert(pausedTimeTrack.timestamps?.[1].type === 'pause', `Second timestamp should be 'pause', got ${pausedTimeTrack.timestamps?.[1].type}`)
    log("✅ Pause timestamp added")

    // Test 7: Update time track - add resume timestamp
    log("Adding resume timestamp...")
    const resumeTime = new Date()
    const resumedTimeTrack = await sdk.api.time_tracks.updateOne(timeTrack.id, {
      timestamps: [
        ...(pausedTimeTrack.timestamps || []),
        { type: 'resume', timestamp: resumeTime },
      ]
    }, { replaceObjectFields: true })
    assert(resumedTimeTrack.timestamps?.length === 3, `Should have 3 timestamps after resume, got ${resumedTimeTrack.timestamps?.length}`)
    assert(resumedTimeTrack.timestamps?.[2].type === 'resume', `Third timestamp should be 'resume', got ${resumedTimeTrack.timestamps?.[2].type}`)
    log("✅ Resume timestamp added")

    // Test 8: Close time track and verify auto-calculation
    log("Closing time track with closedAt...")
    const closedAt = new Date()
    const closedTimeTrack = await sdk.api.time_tracks.updateOne(timeTrack.id, {
      closedAt,
    })

    // Wait a moment for the event handler to process
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Fetch again to see if totalDurationInMS was calculated
    const finalTimeTrack = await sdk.api.time_tracks.getOne(timeTrack.id)
    assert(!!finalTimeTrack.closedAt, "closedAt should be set")
    assert(typeof finalTimeTrack.totalDurationInMS === 'number', `totalDurationInMS should be a number, got ${typeof finalTimeTrack.totalDurationInMS}`)
    assert(finalTimeTrack.totalDurationInMS! > 0, `totalDurationInMS should be > 0, got ${finalTimeTrack.totalDurationInMS}`)
    log(`✅ Time track closed with auto-calculated duration: ${finalTimeTrack.totalDurationInMS} ms`)

    // Test 9: Update title
    log("Updating time track title...")
    const updatedTimeTrack = await sdk.api.time_tracks.updateOne(timeTrack.id, {
      title: "Updated Time Track Title",
    })
    assert(updatedTimeTrack.title === "Updated Time Track Title", "Title should be updated")
    log("✅ Time track title updated")

    // Test 10: Filter by closedAt (get active time tracks)
    log("Filtering for active time tracks (no closedAt)...")
    const allUserTimeTracks = await sdk.api.time_tracks.getSome({
      filter: { userId }
    })
    const activeTimeTracks = allUserTimeTracks.filter(t => !t.closedAt)
    assert(!activeTimeTracks.find(t => t.id === timeTrack.id), "Closed time track should not appear in active filter")
    assert(!!activeTimeTracks.find(t => t.id === linkedTimeTrack.id), "Unclosed time track should appear in active filter")
    log("✅ Active time tracks filtered correctly")

    // Test 11: Access control - non-admin user should only see their own time tracks
    log("Testing access control with non-admin user...")
    const nonAdminTimeTracks = await sdkNonAdmin.api.time_tracks.getSome({})
    const hasOtherUserTimeTrack = nonAdminTimeTracks.find(t => t.userId !== sdkNonAdmin.userInfo.id)
    assert(!hasOtherUserTimeTrack, "Non-admin user should not see other users' time tracks")
    log("✅ Access control working correctly")

    // Test 12: Delete time tracks
    log("Deleting time tracks...")
    await sdk.api.time_tracks.deleteOne(timeTrack.id)
    await sdk.api.time_tracks.deleteOne(linkedTimeTrack.id)

    const deletedCheck = await sdk.api.time_tracks.getSome({})
    const stillExists = deletedCheck.filter(t => t.id === timeTrack.id || t.id === linkedTimeTrack.id)
    assert(stillExists.length === 0, "Time tracks should be deleted")
    log("✅ Time tracks deleted successfully")

    log("✅ All time tracks API tests passed!")

  } finally {
    // Cleanup
    if (createdTimeTrackId) {
      try {
        await sdk.api.time_tracks.deleteOne(createdTimeTrackId)
      } catch (e) {
        // Already deleted or doesn't exist
      }
    }
    if (enduserId) {
      try {
        await sdk.api.endusers.deleteOne(enduserId)
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }
}

// Allow running this test file independently
if (require.main === module) {
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    // First run unit tests
    test_calculateTimeTrackDuration()

    // Then run API tests
    await setup_tests(sdk, sdkNonAdmin)
    await time_tracks_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Time tracks test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Time tracks test suite failed:", error)
      process.exit(1)
    })
}
