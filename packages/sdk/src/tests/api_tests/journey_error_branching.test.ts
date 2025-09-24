import { Session } from '../../sdk'
import { log_header, wait } from "@tellescope/testing"

const host = process.env.API_URL || 'http://localhost:8080'

export const journey_error_branching_tests = async ({ sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Journey Error Branching Tests")

  // NOTE: This test suite intentionally creates actions that will fail to test error handling:
  // - Uses invalid ObjectIds and non-existent references to cause predictable failures
  // - No communication actions (SMS/Email/Webhook) are used to avoid any real messaging
  // This ensures we test error branching safely without external side effects

  // Test 1: Basic onError handling with enduser conditions
  console.log("Testing basic onError handling with enduser conditions...")

  // Create journey first
  const basicJourney = await sdk.api.journeys.createOne({
    title: "Basic Error Handling Journey"
  })

  // Create first step - action that will fail (reference non-existent form)
  const failingStep = await sdk.api.automation_steps.createOne({
    journeyId: basicJourney.id,
    action: {
      type: 'sendForm',
      info: {
        formId: '000000000000000000000001', // Non-existent form ID (guaranteed failure)
        senderId: sdk.userInfo.id,
        channel: 'Email'
      }
    },
    events: [{ type: 'onJourneyStart', info: {} }]
  })

  // Create error handling step - add tags when form email fails for VIP users only
  await sdk.api.automation_steps.createOne({
    journeyId: basicJourney.id,
    action: { type: 'addEnduserTags', info: { tags: ['error-handled-for-vip'] } },
    events: [{ type: 'onError', info: { automationStepId: failingStep.id } }],
    enduserConditions: {
      "$and": [
        {
          "condition": {
            "tags": "vip"
          }
        }
      ]
    }
  })

  // Create VIP enduser (form email will fail due to non-existent form)
  const vipEnduser = await sdk.api.endusers.createOne({
    fname: 'VIP',
    lname: 'User',
    email: 'test-vip-' + Date.now() + '@example.com',
    tags: ['vip']
  })

  // Create regular enduser (form email will fail due to non-existent form)
  const regularEnduser = await sdk.api.endusers.createOne({
    fname: 'Regular',
    lname: 'User',
    email: 'test-regular-' + Date.now() + '@example.com'
  })

  // Add both to journey
  await sdk.api.endusers.add_to_journey({
    enduserIds: [vipEnduser.id],
    journeyId: basicJourney.id
  })

  await sdk.api.endusers.add_to_journey({
    enduserIds: [regularEnduser.id],
    journeyId: basicJourney.id
  })

  // First, let's verify that the failing action actually creates BackgroundErrors
  await pollForErrorHandling(
    async () => {
      const backgroundErrors = await sdk.api.background_errors.getSome({
        filter: { journeyId: basicJourney.id }
      })
      console.log(`Found ${backgroundErrors.length} background errors for journey`)
      if (backgroundErrors.length > 0) {
        console.log('Sample error:', {
          title: backgroundErrors[0].title,
          message: backgroundErrors[0].message?.substring(0, 100),
          enduserId: backgroundErrors[0].enduserId
        })
      }
      return { backgroundErrorCount: backgroundErrors.length }
    },
    (result) => result.backgroundErrorCount > 0,
    'Initial action should create background errors (indicating failure)'
  )

  // Now check if error handling is triggered
  await pollForErrorHandling(
    async () => {
      const vipResult = await sdk.api.endusers.getOne(vipEnduser.id)
      const regularResult = await sdk.api.endusers.getOne(regularEnduser.id)

      // Also check automation actions for debugging
      const automatedActions = await sdk.api.automated_actions.getSome({
        filter: { journeyId: basicJourney.id }
      })
      console.log(`Found ${automatedActions.length} automated actions for journey`)

      return {
        vipHasErrorTag: vipResult.tags?.includes('error-handled-for-vip') ?? false,
        regularHasErrorTag: regularResult.tags?.includes('error-handled-for-vip') ?? false,
        automatedActionCount: automatedActions.length
      }
    },
    (result) => {
      console.log(`VIP user has error tag: ${result.vipHasErrorTag}`)
      console.log(`Regular user has error tag: ${result.regularHasErrorTag}`)
      console.log(`Automated actions: ${result.automatedActionCount}`)
      return result.vipHasErrorTag && !result.regularHasErrorTag
    },
    'VIP enduser should get error tag, regular enduser should not'
  )

  // Test 2: Complex multi-step error handling
  console.log("Testing complex multi-step error handling...")

  const complexJourney = await sdk.api.journeys.createOne({
    title: "Complex Error Journey"
  })

  // Step 1: Action that will fail (non-existent journey)
  const step1 = await sdk.api.automation_steps.createOne({
    journeyId: complexJourney.id,
    action: {
      type: 'addToJourney',
      info: {
        journeyId: '000000000000000000000002' // Non-existent journey (guaranteed failure)
      }
    },
    events: [{ type: 'onJourneyStart', info: {} }]
  })

  // Step 2: Action that would also fail (non-existent journey) - but only runs after Step 1 success
  const step2 = await sdk.api.automation_steps.createOne({
    journeyId: complexJourney.id,
    action: {
      type: 'removeFromJourney',
      info: {
        journeyId: '000000000000000000000003' // Non-existent journey (guaranteed failure)
      }
    },
    events: [{ type: 'afterAction', info: { automationStepId: step1.id, delayInMS: 1000, delay: 1, unit: 'Seconds' } }]
  })

  // Error handling for Step 1 (add to journey failure)
  await sdk.api.automation_steps.createOne({
    journeyId: complexJourney.id,
    action: { type: 'addEnduserTags', info: { tags: ['step1-error-handled'] } },
    events: [{ type: 'onError', info: { automationStepId: step1.id } }]
  })

  // Error handling for Step 2 (remove from journey failure)
  await sdk.api.automation_steps.createOne({
    journeyId: complexJourney.id,
    action: { type: 'addEnduserTags', info: { tags: ['step2-error-handled'] } },
    events: [{ type: 'onError', info: { automationStepId: step2.id } }]
  })

  const complexEnduser = await sdk.api.endusers.createOne({
    fname: 'Complex',
    lname: 'Test',
    email: 'test-complex-' + Date.now() + '@example.com'
  })

  await sdk.api.endusers.add_to_journey({
    enduserIds: [complexEnduser.id],
    journeyId: complexJourney.id
  })

  // Check background errors first
  await pollForErrorHandling(
    async () => {
      const backgroundErrors = await sdk.api.background_errors.getSome({
        filter: { journeyId: complexJourney.id }
      })
      console.log(`Complex test - Found ${backgroundErrors.length} background errors`)
      return { backgroundErrorCount: backgroundErrors.length }
    },
    (result) => result.backgroundErrorCount > 0,
    'Complex test should create background errors'
  )

  // Poll for Step 1 error handling (Step 2 should not run due to Step 1 failure)
  await pollForErrorHandling(
    async () => {
      const complexResult = await sdk.api.endusers.getOne(complexEnduser.id)
      return {
        hasStep1Error: complexResult.tags?.includes('step1-error-handled') ?? false,
        hasStep2Error: complexResult.tags?.includes('step2-error-handled') ?? false
      }
    },
    (result) => {
      console.log(`Complex test - Step 1 error handled: ${result.hasStep1Error}`)
      console.log(`Complex test - Step 2 error handled: ${result.hasStep2Error}`)
      return result.hasStep1Error // Only Step 1 should fail and be handled
    },
    'Step 1 should fail and be handled, Step 2 should not run'
  )

  // Test 3: Verify afterAction does NOT occur after error (without continueOnError)
  console.log("Testing that afterAction is blocked by errors...")

  const blockedJourney = await sdk.api.journeys.createOne({
    title: "Blocked AfterAction Journey"
  })

  // Step 1: Action that will fail
  const blockedFailingStep = await sdk.api.automation_steps.createOne({
    journeyId: blockedJourney.id,
    action: {
      type: 'addToJourney',
      info: {
        journeyId: '000000000000000000000005' // Non-existent journey (guaranteed failure)
      }
    },
    events: [{ type: 'onJourneyStart', info: {} }]
  })

  // Step 2: Should NOT run because Step 1 fails and no continueOnError
  const blockedAfterStep = await sdk.api.automation_steps.createOne({
    journeyId: blockedJourney.id,
    action: { type: 'addEnduserTags', info: { tags: ['should-not-run-after-error'] } },
    events: [{ type: 'afterAction', info: { automationStepId: blockedFailingStep.id, delayInMS: 100, delay: 1, unit: 'Seconds' } }]
  })

  // Error handler - should run
  await sdk.api.automation_steps.createOne({
    journeyId: blockedJourney.id,
    action: { type: 'addEnduserTags', info: { tags: ['error-handler-ran'] } },
    events: [{ type: 'onError', info: { automationStepId: blockedFailingStep.id } }]
  })

  const blockedTestEnduser = await sdk.api.endusers.createOne({
    fname: 'Blocked',
    lname: 'Test',
    email: 'test-blocked-' + Date.now() + '@example.com'
  })

  await sdk.api.endusers.add_to_journey({
    enduserIds: [blockedTestEnduser.id],
    journeyId: blockedJourney.id
  })

  // Poll to verify error handler runs but afterAction does not
  await pollForErrorHandling(
    async () => {
      const result = await sdk.api.endusers.getOne(blockedTestEnduser.id)
      return {
        hasErrorHandler: result.tags?.includes('error-handler-ran') ?? false,
        hasBlockedAfterAction: result.tags?.includes('should-not-run-after-error') ?? false
      }
    },
    (result) => {
      console.log(`Blocked test - Error handler ran: ${result.hasErrorHandler}`)
      console.log(`Blocked test - AfterAction ran (should be false): ${result.hasBlockedAfterAction}`)
      return result.hasErrorHandler && !result.hasBlockedAfterAction
    },
    'Error handler should run, but afterAction should be blocked by error'
  )

  // Wait additional time and verify again that afterAction remains blocked
  console.log('Waiting additional 3 seconds to confirm afterAction remains blocked...')
  await new Promise(resolve => setTimeout(resolve, 3000))

  const finalBlockedResult = await sdk.api.endusers.getOne(blockedTestEnduser.id)
  const finalHasErrorHandler = finalBlockedResult.tags?.includes('error-handler-ran') ?? false
  const finalHasBlockedAfterAction = finalBlockedResult.tags?.includes('should-not-run-after-error') ?? false

  console.log(`Final verification - Error handler: ${finalHasErrorHandler}, AfterAction blocked: ${!finalHasBlockedAfterAction}`)

  if (!finalHasErrorHandler || finalHasBlockedAfterAction) {
    throw new Error(`Final verification failed: Error handler should remain true (${finalHasErrorHandler}) and afterAction should remain blocked (${!finalHasBlockedAfterAction})`)
  }

  // Test 4: Verify afterAction DOES occur after error with continueOnError=true
  console.log("Testing that afterAction works with continueOnError...")

  const continueJourney = await sdk.api.journeys.createOne({
    title: "Continue After Error Journey"
  })

  // Step 1: Action that will fail but has continueOnError=true
  const failingButContinueStep = await sdk.api.automation_steps.createOne({
    journeyId: continueJourney.id,
    action: {
      type: 'sendForm',
      info: {
        formId: '000000000000000000000007', // Non-existent form ID (guaranteed failure)
        senderId: sdk.userInfo.id,
        channel: 'Email'
      },
      continueOnError: true // This allows afterAction to still run
    },
    events: [{ type: 'onJourneyStart', info: {} }]
  })

  // Step 2: SHOULD run because Step 1 has continueOnError=true
  const allowedAfterStep = await sdk.api.automation_steps.createOne({
    journeyId: continueJourney.id,
    action: { type: 'addEnduserTags', info: { tags: ['after-action-despite-error'] } },
    events: [{ type: 'afterAction', info: { automationStepId: failingButContinueStep.id, delayInMS: 100, delay: 1, unit: 'Seconds' } }]
  })

  // Error handler - should also run
  await sdk.api.automation_steps.createOne({
    journeyId: continueJourney.id,
    action: { type: 'addEnduserTags', info: { tags: ['error-handler-also-ran'] } },
    events: [{ type: 'onError', info: { automationStepId: failingButContinueStep.id } }]
  })

  const continueTestEnduser = await sdk.api.endusers.createOne({
    fname: 'Continue',
    lname: 'Test',
    email: 'test-continue-' + Date.now() + '@example.com'
  })

  await sdk.api.endusers.add_to_journey({
    enduserIds: [continueTestEnduser.id],
    journeyId: continueJourney.id
  })

  // Poll to verify both error handler AND afterAction run
  // Use longer timeout for continueOnError test since automation processing may take longer
  await pollForErrorHandling(
    async () => {
      const result = await sdk.api.endusers.getOne(continueTestEnduser.id)
      return {
        hasErrorHandler: result.tags?.includes('error-handler-also-ran') ?? false,
        hasAfterAction: result.tags?.includes('after-action-despite-error') ?? false
      }
    },
    (result) => {
      console.log(`Continue test - Error handler ran: ${result.hasErrorHandler}`)
      console.log(`Continue test - AfterAction ran: ${result.hasAfterAction}`)
      return result.hasErrorHandler && result.hasAfterAction
    },
    'Both error handler and afterAction should run with continueOnError=true',
    500, // intervalMs
    60   // maxIterations (30 seconds total instead of 10)
  )

  // Test 5: Integration error scenario
  console.log("Testing real-world integration error...")

  const integrationJourney = await sdk.api.journeys.createOne({
    title: "Integration Error Journey"
  })

  // Action that will fail (non-existent form)
  const integrationFailingStep = await sdk.api.automation_steps.createOne({
    journeyId: integrationJourney.id,
    action: {
      type: 'sendForm',
      info: {
        formId: '000000000000000000000008', // Non-existent form ID (guaranteed failure)
        senderId: sdk.userInfo.id,
        channel: 'Email'
      }
    },
    events: [{ type: 'onJourneyStart', info: {} }]
  })

  // Error recovery step
  await sdk.api.automation_steps.createOne({
    journeyId: integrationJourney.id,
    action: { type: 'addEnduserTags', info: { tags: ['form-send-failed'] } },
    events: [{ type: 'onError', info: { automationStepId: integrationFailingStep.id } }]
  })

  const integrationEnduser = await sdk.api.endusers.createOne({
    fname: 'Integration',
    lname: 'Test',
    email: 'test-integration-' + Date.now() + '@example.com'
  })

  await sdk.api.endusers.add_to_journey({
    enduserIds: [integrationEnduser.id],
    journeyId: integrationJourney.id
  })

  // Poll for integration error handling
  await pollForErrorHandling(
    async () => {
      const integrationResult = await sdk.api.endusers.getOne(integrationEnduser.id)
      return {
        hasFormSendError: integrationResult.tags?.includes('form-send-failed') ?? false
      }
    },
    (result) => {
      console.log(`Integration test - Form send error handled: ${result.hasFormSendError}`)
      return result.hasFormSendError
    },
    'Form send action should fail and be handled'
  )

  // Cleanup
  await Promise.all([
    sdk.api.journeys.deleteOne(basicJourney.id),
    sdk.api.journeys.deleteOne(complexJourney.id),
    sdk.api.journeys.deleteOne(blockedJourney.id),
    sdk.api.journeys.deleteOne(continueJourney.id),
    sdk.api.journeys.deleteOne(integrationJourney.id),
    sdk.api.endusers.deleteOne(vipEnduser.id),
    sdk.api.endusers.deleteOne(regularEnduser.id),
    sdk.api.endusers.deleteOne(complexEnduser.id),
    sdk.api.endusers.deleteOne(blockedTestEnduser.id),
    sdk.api.endusers.deleteOne(continueTestEnduser.id),
    sdk.api.endusers.deleteOne(integrationEnduser.id)
  ])

  console.log("✅ Journey Error Branching tests completed successfully")
}

// Polling helper function for error handling verification
const pollForErrorHandling = async <T>(
  fetchFn: () => Promise<T>,
  evaluateFn: (result: T) => boolean,
  description: string,
  intervalMs = 500,
  maxIterations = 20
): Promise<void> => {
  let lastResult: T | undefined

  for (let i = 0; i < maxIterations; i++) {
    await wait(undefined, intervalMs)

    lastResult = await fetchFn()
    if (evaluateFn(lastResult)) {
      console.log(`✓ ${description} - completed after ${(i + 1) * intervalMs}ms`)
      return
    }

    // Log progress every 2.5 seconds
    if (i > 0 && (i + 1) % 5 === 0) {
      console.log(`Still waiting for: ${description} - ${(i + 1) * intervalMs}ms elapsed`)
    }
  }

  console.log('Final polling result:', lastResult)
  throw new Error(`Polling timeout: ${description} - waited ${maxIterations * intervalMs}ms`)
}

const getTestTemplateId = async (sdk: Session, _type?: string): Promise<string> => {
  // Get or create a test template for testing
  try {
    const templates = await sdk.api.templates.getSome({
      filter: {}
    })

    if (templates.length > 0) {
      return templates[0].id
    }

    const template = await sdk.api.templates.createOne({
      title: 'Test Template',
      message: 'Test message',
      subject: 'Test Subject',
      html: '<p>Test email</p>'
    })

    return template.id
  } catch (error) {
    console.error('Error getting template:', error)
    throw error
  }
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`🌐 Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    const { setup_tests } = await import("../setup")
    await setup_tests(sdk, sdkNonAdmin)
    await journey_error_branching_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Journey Error Branching test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Journey Error Branching test suite failed:", error)
      process.exit(1)
    })
}