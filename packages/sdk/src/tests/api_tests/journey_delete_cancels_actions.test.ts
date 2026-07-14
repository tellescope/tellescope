import { Session } from '../../sdk'
import { log_header, wait } from "@tellescope/testing"
import { AUTOMATED_ACTION_CANCEL_REASONS } from "@tellescope/constants"

const host = process.env.API_URL || 'http://localhost:8080'

export const journey_delete_cancels_actions_tests = async ({ sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Journey Delete Cancels Pending Actions Tests")

  let journeyId: string | undefined
  let enduserId: string | undefined
  let stepId: string | undefined

  try {
    // Create a journey + an automation_step
    const journey = await sdk.api.journeys.createOne({ title: "Cascade Cancel Journey " + Date.now() })
    journeyId = journey.id

    const step = await sdk.api.automation_steps.createOne({
      journeyId: journey.id,
      action: { type: 'setEnduserStatus', info: { status: 'Test Status' } },
      events: [{ type: 'onJourneyStart', info: {} }],
    })
    stepId = step.id

    // Create an enduser
    const enduser = await sdk.api.endusers.createOne({
      fname: 'Cascade',
      lname: 'Cancel',
      email: 'test-cascade-cancel-' + Date.now() + '@example.com',
    })
    enduserId = enduser.id

    // Create an active action with a far-future processAfter so the worker won't process it during the test
    const activeAction = await sdk.api.automated_actions.createOne({
      journeyId: journey.id,
      automationStepId: step.id,
      enduserId: enduser.id,
      processAfter: Date.now() + 1000000, // far future so the worker won't process it
      status: 'active',
      event: { type: 'onJourneyStart', info: {} },
      action: { type: 'setEnduserStatus', info: { status: 'Test Status' } },
    })

    // Create a finished action to confirm it is left untouched by the cascade
    const finishedAction = await sdk.api.automated_actions.createOne({
      journeyId: journey.id,
      automationStepId: step.id,
      enduserId: enduser.id,
      processAfter: Date.now() + 1000000,
      status: 'finished',
      event: { type: 'onJourneyStart', info: {} },
      action: { type: 'setEnduserStatus', info: { status: 'Test Status' } },
    })

    // Assert the action starts active
    const before = await sdk.api.automated_actions.getOne(activeAction.id)
    if (before.status !== 'active') {
      throw new Error(`Expected action to start 'active', got '${before.status}'`)
    }
    console.log("✓ Action is active before journey deletion")

    // Delete the journey — this should cascade cancel the pending action
    await sdk.api.journeys.deleteOne(journey.id)
    journeyId = undefined // already deleted, skip in cleanup

    // Poll until the active action transitions to cancelled with the Journey Deleted reason,
    // attributed to the deleting user via cancelledBy
    const expectedReason = AUTOMATED_ACTION_CANCEL_REASONS.indexOf('Journey Deleted')
    await pollForResults(
      async () => {
        const actions = await sdk.api.automated_actions.getSome({ filter: { enduserId: enduser.id } })
        const active = actions.find(a => a.id === activeAction.id)
        const finished = actions.find(a => a.id === finishedAction.id)
        return { active, finished }
      },
      ({ active }) => (
        active?.status === 'cancelled'
        && active?.cancelReason === expectedReason
        && active?.cancelledBy === sdk.userInfo.id
      ),
      'Active action should be cancelled with Journey Deleted reason and cancelledBy after journey deletion',
    )
    console.log("✓ Active action cancelled with Journey Deleted reason and cancelledBy set to deleting user")

    // Not covered here: journey deletion also removes outstanding_froms_trackers. Creating a tracker
    // requires an automation to actually send an email/SMS with multiple form links, and the collection
    // is internal-only (no API read access), so it can't be verified from an SDK test.

    // Confirm the finished action was left untouched
    const finishedAfter = await sdk.api.automated_actions.getOne(finishedAction.id)
    if (finishedAfter.status !== 'finished') {
      throw new Error(`Expected finished action to remain 'finished', got '${finishedAfter.status}'`)
    }
    console.log("✓ Finished action left untouched")

    console.log("✅ Journey Delete Cancels Pending Actions tests completed successfully")
  } finally {
    // Cleanup — journey is already deleted if the flow completed
    await Promise.all([
      enduserId ? sdk.api.endusers.deleteOne(enduserId).catch(() => {}) : undefined,
      stepId ? sdk.api.automation_steps.deleteOne(stepId).catch(() => {}) : undefined,
      journeyId ? sdk.api.journeys.deleteOne(journeyId).catch(() => {}) : undefined,
    ])
  }
}

const pollForResults = async <T>(
  fetchFn: () => Promise<T>,
  evaluateFn: (result: T) => boolean,
  description: string,
  intervalMs = 500,
  maxIterations = 30,
): Promise<void> => {
  let lastResult: T | undefined

  for (let i = 0; i < maxIterations; i++) {
    await wait(undefined, intervalMs)

    lastResult = await fetchFn()
    if (evaluateFn(lastResult)) {
      console.log(`✓ ${description} - completed after ${(i + 1) * intervalMs}ms`)
      return
    }
  }

  console.log('Final polling result:', lastResult)
  throw new Error(`Polling timeout: ${description} - waited ${maxIterations * intervalMs}ms`)
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    const { setup_tests } = await import("../setup")
    await setup_tests(sdk, sdkNonAdmin)
    await journey_delete_cancels_actions_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Journey Delete Cancels Pending Actions test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Journey Delete Cancels Pending Actions test suite failed:", error)
      process.exit(1)
    })
}
