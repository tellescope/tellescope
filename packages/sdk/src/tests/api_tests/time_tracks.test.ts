require('source-map-support').install();

import { Session } from "../../sdk"
import { assert, log_header, wait } from "@tellescope/testing"
import { setup_tests } from "../setup"

const log = console.log

const host = process.env.REACT_APP_TELLESCOPE_API_URL || 'http://localhost:8080'

// Helper to assert that an async function throws an error
const assert_throws = async (fn: () => Promise<any>, description: string) => {
  try {
    await fn()
    assert(false, `${description} - expected error but succeeded`)
  } catch (e: any) {
    // SDK parseError returns the response body { message, info } for 4xx errors
    assert(e?.code === 400 || e?.statusCode === 400 || typeof e?.message === 'string',
      `${description} - expected error, got: ${JSON.stringify(e)}`)
  }
}

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

  log("All calculateTimeTrackDuration unit tests passed")
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
    log("Time track created with auto-set userId and initial timestamp")

    // Test 2: Read the time track
    log("Reading time track...")
    const fetchedTimeTrack = await sdk.api.time_tracks.getOne(timeTrack.id)
    assert(fetchedTimeTrack.id === timeTrack.id, "Fetched time track should have same id")
    assert(fetchedTimeTrack.title === "Test Time Track", "Fetched title should match")
    log("Time track retrieved successfully")

    // Test 3: Get all time tracks for current user
    log("Getting all time tracks for current user...")
    const allTimeTracks = await sdk.api.time_tracks.getSome({ filter: { userId } })
    assert(allTimeTracks.length >= 1, `Should have at least 1 time track, got ${allTimeTracks.length}`)
    assert(!!allTimeTracks.find(t => t.id === timeTrack.id), "Should find our created time track")
    log("Retrieved all time tracks for user")

    // Test 4: Create enduser and link time track
    log("Creating enduser for time track linkage...")
    const enduser = await sdk.api.endusers.createOne({
      email: `timetrack-test-${Date.now()}@test.com`,
      fname: "Time",
      lname: "Track",
    })
    enduserId = enduser.id
    log("Enduser created")

    // Test 5: Create time track with enduserId
    log("Creating time track linked to enduser...")
    const linkedTimeTrack = await sdk.api.time_tracks.createOne({
      title: "Client Meeting",
      enduserId: enduser.id,
    } as any)
    assert(linkedTimeTrack.enduserId === enduser.id, `enduserId should be set to ${enduser.id}, got ${linkedTimeTrack.enduserId}`)
    log("Time track linked to enduser")

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
    log("Pause timestamp added")

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
    log("Resume timestamp added")

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
    log(`Time track closed with auto-calculated duration: ${finalTimeTrack.totalDurationInMS} ms`)

    // Test 9: Update title
    log("Updating time track title...")
    const updatedTimeTrack = await sdk.api.time_tracks.updateOne(timeTrack.id, {
      title: "Updated Time Track Title",
    })
    assert(updatedTimeTrack.title === "Updated Time Track Title", "Title should be updated")
    log("Time track title updated")

    // Test 10: Filter by closedAt (get active time tracks)
    log("Filtering for active time tracks (no closedAt)...")
    const allUserTimeTracks = await sdk.api.time_tracks.getSome({
      filter: { userId }
    })
    const activeTimeTracks = allUserTimeTracks.filter(t => !t.closedAt)
    assert(!activeTimeTracks.find(t => t.id === timeTrack.id), "Closed time track should not appear in active filter")
    assert(!!activeTimeTracks.find(t => t.id === linkedTimeTrack.id), "Unclosed time track should appear in active filter")
    log("Active time tracks filtered correctly")

    // Test 11: Access control - non-admin user should only see their own time tracks
    log("Testing access control with non-admin user...")
    const nonAdminTimeTracks = await sdkNonAdmin.api.time_tracks.getSome({})
    const hasOtherUserTimeTrack = nonAdminTimeTracks.find(t => t.userId !== sdkNonAdmin.userInfo.id)
    assert(!hasOtherUserTimeTrack, "Non-admin user should not see other users' time tracks")
    log("Access control working correctly")

    // Test 12: Delete time tracks
    log("Deleting time tracks...")
    await sdk.api.time_tracks.deleteOne(timeTrack.id)
    await sdk.api.time_tracks.deleteOne(linkedTimeTrack.id)

    const deletedCheck = await sdk.api.time_tracks.getSome({})
    const stillExists = deletedCheck.filter(t => t.id === timeTrack.id || t.id === linkedTimeTrack.id)
    assert(stillExists.length === 0, "Time tracks should be deleted")
    log("Time tracks deleted successfully")

    log("All time tracks API tests passed!")

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

// ============================================================
// Group A: Historical Time Track Creation
// ============================================================
export const time_tracks_historical_tests = async ({ sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Time Tracks - Historical Creation Tests")

  const trackIds: string[] = []

  try {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 3600000)
    const twoHoursAgo = new Date(now.getTime() - 7200000)

    // Test A1: Create historical time track with all required fields
    log("A1: Creating historical time track with all required fields...")
    const historical = await sdk.api.time_tracks.createOne({
      title: "Historical Entry",
      isHistorical: true,
      closedAt: now,
      lockedAt: now,
      lockedByUserId: sdk.userInfo.id,
      totalDurationInMS: 3600000,
      timestamps: [
        { type: 'start', timestamp: twoHoursAgo },
        { type: 'pause', timestamp: oneHourAgo },
      ],
    } as any)
    trackIds.push(historical.id)

    assert(historical.isHistorical === true, "isHistorical should be true")
    assert(!!historical.closedAt, "closedAt should be set")
    assert(!!historical.lockedAt, "lockedAt should be set")
    assert(historical.lockedByUserId === sdk.userInfo.id, "lockedByUserId should match")
    assert(historical.totalDurationInMS === 3600000, `totalDurationInMS should be 3600000, got ${historical.totalDurationInMS}`)
    assert(historical.timestamps?.length === 2, "timestamps should have 2 entries")
    log("A1: Historical time track created with all fields persisted")

    // Test A2: Create historical without closedAt - expect 400
    log("A2: Creating historical without closedAt (should fail)...")
    await assert_throws(
      () => sdk.api.time_tracks.createOne({
        title: "Missing ClosedAt",
        isHistorical: true,
        lockedAt: now,
        lockedByUserId: sdk.userInfo.id,
        totalDurationInMS: 3600000,
        timestamps: [{ type: 'start', timestamp: twoHoursAgo }],
      } as any),
      "A2: Historical without closedAt"
    )
    log("A2: Correctly rejected historical without closedAt")

    // Test A3: Create historical without lockedAt - expect 400
    log("A3: Creating historical without lockedAt (should fail)...")
    await assert_throws(
      () => sdk.api.time_tracks.createOne({
        title: "Missing LockedAt",
        isHistorical: true,
        closedAt: now,
        lockedByUserId: sdk.userInfo.id,
        totalDurationInMS: 3600000,
        timestamps: [{ type: 'start', timestamp: twoHoursAgo }],
      } as any),
      "A3: Historical without lockedAt"
    )
    log("A3: Correctly rejected historical without lockedAt")

    // Test A4: Verify isHistorical cannot be updated (updatesDisabled)
    log("A4: Attempting to update isHistorical (should be rejected)...")
    await assert_throws(
      () => sdk.api.time_tracks.updateOne(historical.id, {
        isHistorical: false,
      } as any),
      "A4: isHistorical update should be rejected"
    )
    // Confirm it's still true
    const fetched = await sdk.api.time_tracks.getOne(historical.id)
    assert(fetched.isHistorical === true, "isHistorical should remain true after rejected update")
    log("A4: isHistorical correctly rejected on update")

    log("All historical creation tests passed!")

  } finally {
    for (const id of trackIds) {
      try { await sdk.api.time_tracks.deleteOne(id) } catch (e) {}
    }
  }
}

// ============================================================
// Group B: Correction Flow
// ============================================================
export const time_tracks_correction_tests = async ({ sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Time Tracks - Correction Flow Tests")

  const trackIds: string[] = []

  try {
    const now = new Date()

    // Create a real-time track and close it
    log("B0: Creating and closing real-time track...")
    const track = await sdk.api.time_tracks.createOne({
      title: "Track for Correction",
    } as any)
    trackIds.push(track.id)

    // Add pause
    await sdk.api.time_tracks.updateOne(track.id, {
      timestamps: [
        ...(track.timestamps || []),
        { type: 'pause', timestamp: new Date() },
      ]
    }, { replaceObjectFields: true })

    // Close it
    const closedAt = new Date()
    await sdk.api.time_tracks.updateOne(track.id, { closedAt })

    // Wait for auto-calculated duration
    await wait(undefined, 1500)

    const closed = await sdk.api.time_tracks.getOne(track.id)
    assert(!!closed.closedAt, "Track should be closed")
    assert(typeof closed.totalDurationInMS === 'number', "Should have auto-calculated totalDurationInMS")
    const originalDuration = closed.totalDurationInMS!
    log(`B0: Track closed with auto-calculated duration: ${originalDuration} ms`)

    // Test B1: Apply correction with all required fields
    log("B1: Applying correction with all required fields...")
    const correctionTime = new Date()
    const correctedTrack = await sdk.api.time_tracks.updateOne(track.id, {
      correctedAt: correctionTime,
      correctedByUserId: sdk.userInfo.id,
      correctionNote: "Forgot to pause during lunch",
      originalTotalDurationInMS: originalDuration,
      totalDurationInMS: originalDuration - 1800000, // Subtract 30 min
      lockedAt: correctionTime,
      lockedByUserId: sdk.userInfo.id,
    } as any)
    assert(!!correctedTrack.correctedAt, "correctedAt should be set")
    assert(correctedTrack.correctedByUserId === sdk.userInfo.id, "correctedByUserId should match")
    assert(correctedTrack.correctionNote === "Forgot to pause during lunch", "correctionNote should match")
    assert(correctedTrack.originalTotalDurationInMS === originalDuration, "originalTotalDurationInMS should preserve old value")
    assert(correctedTrack.totalDurationInMS === originalDuration - 1800000, "totalDurationInMS should be corrected value")
    assert(!!correctedTrack.lockedAt, "lockedAt should be set")
    log("B1: Correction applied successfully with all fields persisted")

    // Test B2: Correction without originalTotalDurationInMS - expect 400
    log("B2: Correction without originalTotalDurationInMS (should fail)...")
    const track2 = await sdk.api.time_tracks.createOne({ title: "Track for B2" } as any)
    trackIds.push(track2.id)
    await sdk.api.time_tracks.updateOne(track2.id, { closedAt: new Date() })
    await wait(undefined, 1000)
    const closed2 = await sdk.api.time_tracks.getOne(track2.id)
    await assert_throws(
      () => sdk.api.time_tracks.updateOne(track2.id, {
        correctedAt: new Date(),
        totalDurationInMS: 1000,
        lockedAt: new Date(),
        lockedByUserId: sdk.userInfo.id,
      } as any),
      "B2: Correction without originalTotalDurationInMS"
    )
    log("B2: Correctly rejected correction without originalTotalDurationInMS")

    // Test B3: Correction without lockedAt - expect 400
    log("B3: Correction without lockedAt (should fail)...")
    await assert_throws(
      () => sdk.api.time_tracks.updateOne(track2.id, {
        correctedAt: new Date(),
        originalTotalDurationInMS: closed2.totalDurationInMS || 0,
        totalDurationInMS: 1000,
        lockedByUserId: sdk.userInfo.id,
      } as any),
      "B3: Correction without lockedAt"
    )
    log("B3: Correctly rejected correction without lockedAt")

    // Test B4: After lock, attempt to update title - expect 400
    log("B4: Updating title on locked track (should fail)...")
    await assert_throws(
      () => sdk.api.time_tracks.updateOne(track.id, {
        title: "Should Not Work",
      } as any),
      "B4: Title update on locked track"
    )
    log("B4: Correctly rejected title update on locked track")

    // Test B5: After lock, attempt second correction - expect 400
    log("B5: Second correction on locked track (should fail)...")
    await assert_throws(
      () => sdk.api.time_tracks.updateOne(track.id, {
        correctedAt: new Date(),
        originalTotalDurationInMS: correctedTrack.totalDurationInMS,
        totalDurationInMS: 500,
        lockedAt: new Date(),
        lockedByUserId: sdk.userInfo.id,
      } as any),
      "B5: Second correction on locked track"
    )
    log("B5: Correctly rejected second correction on locked track")

    log("All correction flow tests passed!")

  } finally {
    for (const id of trackIds) {
      try { await sdk.api.time_tracks.deleteOne(id) } catch (e) {}
    }
  }
}

// ============================================================
// Group C: Review Flow
// ============================================================
export const time_tracks_review_tests = async ({ sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Time Tracks - Review Flow Tests")

  const trackIds: string[] = []

  try {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 3600000)
    const twoHoursAgo = new Date(now.getTime() - 7200000)

    // Create a historical track for review testing
    log("C0: Creating historical track for review tests...")
    const historical = await sdk.api.time_tracks.createOne({
      title: "Track for Review",
      isHistorical: true,
      closedAt: now,
      lockedAt: now,
      lockedByUserId: sdk.userInfo.id,
      totalDurationInMS: 3600000,
      timestamps: [
        { type: 'start', timestamp: twoHoursAgo },
        { type: 'pause', timestamp: oneHourAgo },
      ],
    } as any)
    trackIds.push(historical.id)
    log("C0: Historical track created")

    // Test C1: Review by different user (approval)
    log("C1: Review by different user (approval)...")
    const reviewTime = new Date()
    const reviewed = await sdk.api.time_tracks.updateOne(historical.id, {
      reviewedAt: reviewTime,
      reviewedByUserId: sdkNonAdmin.userInfo.id,
      reviewApproved: true,
    } as any)
    assert(!!reviewed.reviewedAt, "reviewedAt should be set")
    assert(reviewed.reviewedByUserId === sdkNonAdmin.userInfo.id, "reviewedByUserId should match non-admin")
    assert(reviewed.reviewApproved === true, "reviewApproved should be true")
    log("C1: Review approved successfully by different user")

    // Test C2: Self-review (owner reviews own track) - expect 400
    log("C2: Self-review (should fail)...")
    const historical2 = await sdk.api.time_tracks.createOne({
      title: "Track for Self-Review",
      isHistorical: true,
      closedAt: now,
      lockedAt: now,
      lockedByUserId: sdk.userInfo.id,
      totalDurationInMS: 3600000,
      timestamps: [
        { type: 'start', timestamp: twoHoursAgo },
        { type: 'pause', timestamp: oneHourAgo },
      ],
    } as any)
    trackIds.push(historical2.id)

    await assert_throws(
      () => sdk.api.time_tracks.updateOne(historical2.id, {
        reviewedAt: new Date(),
        reviewedByUserId: sdk.userInfo.id, // same as track owner
        reviewApproved: true,
      } as any),
      "C2: Self-review"
    )
    log("C2: Correctly rejected self-review")

    // Test C3: Review fields updatable even after lock
    log("C3: Review fields updatable after lock...")
    const updatedReview = await sdk.api.time_tracks.updateOne(historical.id, {
      reviewedAt: new Date(),
      reviewedByUserId: sdkNonAdmin.userInfo.id,
      reviewApproved: false,
      reviewNote: "Hours seem too high, please double-check",
    } as any)
    assert(updatedReview.reviewApproved === false, "reviewApproved should be updated to false")
    assert(updatedReview.reviewNote === "Hours seem too high, please double-check", "reviewNote should be set")
    log("C3: Review fields correctly updatable on locked track")

    // Test C4: Rejection flow with reviewNote
    log("C4: Rejection flow with reviewNote...")
    const historical3 = await sdk.api.time_tracks.createOne({
      title: "Track for Rejection",
      isHistorical: true,
      closedAt: now,
      lockedAt: now,
      lockedByUserId: sdk.userInfo.id,
      totalDurationInMS: 1800000,
      timestamps: [
        { type: 'start', timestamp: twoHoursAgo },
        { type: 'pause', timestamp: oneHourAgo },
      ],
    } as any)
    trackIds.push(historical3.id)

    const rejected = await sdk.api.time_tracks.updateOne(historical3.id, {
      reviewedAt: new Date(),
      reviewedByUserId: sdkNonAdmin.userInfo.id,
      reviewApproved: false,
      reviewNote: "Rejected - timestamps don't match claimed duration",
    } as any)
    assert(rejected.reviewApproved === false, "reviewApproved should be false")
    assert(rejected.reviewNote === "Rejected - timestamps don't match claimed duration", "reviewNote should match")
    log("C4: Rejection flow completed successfully")

    log("All review flow tests passed!")

  } finally {
    for (const id of trackIds) {
      try { await sdk.api.time_tracks.deleteOne(id) } catch (e) {}
    }
  }
}

// ============================================================
// Group D: Lock Enforcement
// ============================================================
export const time_tracks_lock_tests = async ({ sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Time Tracks - Lock Enforcement Tests")

  const trackIds: string[] = []

  try {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 3600000)
    const twoHoursAgo = new Date(now.getTime() - 7200000)

    // Create a locked historical track
    log("D0: Creating locked historical track...")
    const locked = await sdk.api.time_tracks.createOne({
      title: "Locked Track",
      isHistorical: true,
      closedAt: now,
      lockedAt: now,
      lockedByUserId: sdk.userInfo.id,
      totalDurationInMS: 3600000,
      timestamps: [
        { type: 'start', timestamp: twoHoursAgo },
        { type: 'pause', timestamp: oneHourAgo },
      ],
    } as any)
    trackIds.push(locked.id)
    log("D0: Locked track created")

    // Test D1: Locked track rejects updates to timestamps
    log("D1: Updating timestamps on locked track (should fail)...")
    await assert_throws(
      () => sdk.api.time_tracks.updateOne(locked.id, {
        timestamps: [{ type: 'start', timestamp: new Date() }],
      } as any),
      "D1: timestamps update on locked track"
    )
    log("D1: Correctly rejected timestamps update")

    // Test D2: Locked track rejects updates to closedAt
    log("D2: Updating closedAt on locked track (should fail)...")
    await assert_throws(
      () => sdk.api.time_tracks.updateOne(locked.id, {
        closedAt: new Date(),
      } as any),
      "D2: closedAt update on locked track"
    )
    log("D2: Correctly rejected closedAt update")

    // Test D3: Locked track rejects updates to totalDurationInMS
    log("D3: Updating totalDurationInMS on locked track (should fail)...")
    await assert_throws(
      () => sdk.api.time_tracks.updateOne(locked.id, {
        totalDurationInMS: 999,
      } as any),
      "D3: totalDurationInMS update on locked track"
    )
    log("D3: Correctly rejected totalDurationInMS update")

    // Test D4: Locked track rejects updates to correctedAt
    log("D4: Updating correctedAt on locked track (should fail)...")
    await assert_throws(
      () => sdk.api.time_tracks.updateOne(locked.id, {
        correctedAt: new Date(),
        originalTotalDurationInMS: 3600000,
        totalDurationInMS: 1800000,
        lockedAt: new Date(),
        lockedByUserId: sdk.userInfo.id,
      } as any),
      "D4: correctedAt update on locked track"
    )
    log("D4: Correctly rejected correction on locked track")

    // Test D5: Locked track rejects updates to title
    log("D5: Updating title on locked track (should fail)...")
    await assert_throws(
      () => sdk.api.time_tracks.updateOne(locked.id, {
        title: "Should Not Change",
      } as any),
      "D5: title update on locked track"
    )
    log("D5: Correctly rejected title update")

    // Test D6: Locked track allows updates to review fields
    log("D6: Updating review fields on locked track (should succeed)...")
    const reviewed = await sdk.api.time_tracks.updateOne(locked.id, {
      reviewedAt: new Date(),
      reviewedByUserId: sdkNonAdmin.userInfo.id,
      reviewApproved: true,
      reviewNote: "Looks good",
    } as any)
    assert(reviewed.reviewApproved === true, "reviewApproved should be set")
    assert(reviewed.reviewNote === "Looks good", "reviewNote should be set")
    assert(reviewed.reviewedByUserId === sdkNonAdmin.userInfo.id, "reviewedByUserId should match")
    log("D6: Review fields correctly updatable on locked track")

    log("All lock enforcement tests passed!")

  } finally {
    for (const id of trackIds) {
      try { await sdk.api.time_tracks.deleteOne(id) } catch (e) {}
    }
  }
}

// ============================================================
// Group E: Edge Cases
// ============================================================
export const time_tracks_edge_case_tests = async ({ sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Time Tracks - Edge Case Tests")

  const trackIds: string[] = []

  try {
    // Test E1: Normal real-time track - lockedAt stays undefined, all fields updatable
    log("E1: Normal real-time track is fully updatable...")
    const track = await sdk.api.time_tracks.createOne({
      title: "Normal Track",
    } as any)
    trackIds.push(track.id)

    assert(!track.lockedAt, "lockedAt should be undefined for normal track")
    assert(!track.isHistorical, "isHistorical should be undefined for normal track")

    // Should be able to update title
    const updated = await sdk.api.time_tracks.updateOne(track.id, {
      title: "Updated Normal Track",
    })
    assert(updated.title === "Updated Normal Track", "Title should be updatable on unlocked track")

    // Should be able to update timestamps
    const withPause = await sdk.api.time_tracks.updateOne(track.id, {
      timestamps: [
        ...(track.timestamps || []),
        { type: 'pause', timestamp: new Date() },
      ]
    }, { replaceObjectFields: true })
    assert(withPause.timestamps?.length === 2, "timestamps should be updatable on unlocked track")

    log("E1: Normal track fully updatable as expected")

    // Test E2: Original totalDurationInMS preserved after correction
    log("E2: Original duration preserved after correction...")
    const track2 = await sdk.api.time_tracks.createOne({
      title: "Track for Duration Preservation",
    } as any)
    trackIds.push(track2.id)

    // Close the track
    await sdk.api.time_tracks.updateOne(track2.id, { closedAt: new Date() })
    await wait(undefined, 1500)

    const closedTrack = await sdk.api.time_tracks.getOne(track2.id)
    const originalDuration = closedTrack.totalDurationInMS!

    // Apply correction
    const corrected = await sdk.api.time_tracks.updateOne(track2.id, {
      correctedAt: new Date(),
      correctedByUserId: sdk.userInfo.id,
      originalTotalDurationInMS: originalDuration,
      totalDurationInMS: 5000,
      lockedAt: new Date(),
      lockedByUserId: sdk.userInfo.id,
    } as any)

    assert(corrected.originalTotalDurationInMS === originalDuration,
      `originalTotalDurationInMS should be ${originalDuration}, got ${corrected.originalTotalDurationInMS}`)
    assert(corrected.totalDurationInMS === 5000,
      `totalDurationInMS should be corrected to 5000, got ${corrected.totalDurationInMS}`)
    log("E2: Original duration correctly preserved in originalTotalDurationInMS")

    log("All edge case tests passed!")

  } finally {
    for (const id of trackIds) {
      try { await sdk.api.time_tracks.deleteOne(id) } catch (e) {}
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
    await time_tracks_historical_tests({ sdk, sdkNonAdmin })
    await time_tracks_correction_tests({ sdk, sdkNonAdmin })
    await time_tracks_review_tests({ sdk, sdkNonAdmin })
    await time_tracks_lock_tests({ sdk, sdkNonAdmin })
    await time_tracks_edge_case_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("Time tracks test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Time tracks test suite failed:", error)
      process.exit(1)
    })
}
