import { Session } from '../../sdk'
import { log_header, wait } from "@tellescope/testing"
import { setup_tests } from "../setup"
import { DateTime } from "luxon"

const host = process.env.API_URL || 'http://localhost:8080'

export const afteraction_day_of_month_delay_tests = async ({ sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("AfterAction Day of Month Delay Tests")

  let createdJourneyIds: string[] = []
  let createdEnduserIds: string[] = []
  let createdAutomatedActionIds: string[] = []

  try {
    // Helper function to calculate expected delay time for day of month
    // This uses the EXACT same logic as the worker for perfect consistency
    const calculateExpectedDelayTime = (dayOfMonth: number, hour: number = 9, minute: number = 0): number => {
      // Use US/Eastern timezone for consistent scheduling behavior
      // This ensures that "9 AM" means 9 AM Eastern Time regardless of test location
      const now = DateTime.now().setZone('America/New_York')

      // Create target date for this month in Eastern timezone
      let targetDate = DateTime.fromObject({
        year: now.year,
        month: now.month,
        day: dayOfMonth,
        hour,
        minute,
        second: 0,
        millisecond: 0
      }, { zone: 'America/New_York' })

      // If the target date has already passed this month, use next month
      if (targetDate <= now) {
        targetDate = targetDate.plus({ months: 1 })
      }

      return targetDate.toMillis()
    }

    // Test 1: Basic day-of-month delay (next 1st at 9 AM)
    console.log("Testing basic day-of-month delay for 1st of month at 9 AM...")

    const journey1 = await sdk.api.journeys.createOne({
      title: "Day of Month Delay Test - 1st at 9 AM"
    })
    createdJourneyIds.push(journey1.id)

    const firstStep = await sdk.api.automation_steps.createOne({
      journeyId: journey1.id,
      action: { type: 'addEnduserTags', info: { tags: ['first-step-completed'] } },
      events: [{ type: 'onJourneyStart', info: {} }]
    })

    const dayOfMonthStep = await sdk.api.automation_steps.createOne({
      journeyId: journey1.id,
      action: { type: 'addEnduserTags', info: { tags: ['delayed-until-1st'] } },
      events: [{
        type: 'afterAction',
        info: {
          automationStepId: firstStep.id,
          delayInMS: 0, // Not used for day-of-month condition
          delay: 0,
          unit: 'Minutes',
          dayOfMonthCondition: {
            dayOfMonth: 1,
            hour: 9,
            minute: 0
          }
        }
      }]
    })

    const enduser1 = await sdk.api.endusers.createOne({
      fname: 'Test',
      lname: 'User1',
      email: 'testuser1@example.com'
    })
    createdEnduserIds.push(enduser1.id)

    await sdk.api.endusers.add_to_journey({
      enduserIds: [enduser1.id],
      journeyId: journey1.id
    })

    // Poll for automated action creation
    const delayedAction = await pollForAutomationProcessing(
      async () => {
        const automatedActions = await sdk.api.automated_actions.getSome({
          filter: { enduserId: enduser1.id, journeyId: journey1.id }
        })
        return automatedActions.find((a: any) =>
          a.automationStepId === dayOfMonthStep.id && a.status === 'active'
        )
      },
      (result): result is any => !!result,
      'Day-of-month delay action should be created and scheduled'
    )

    createdAutomatedActionIds.push(delayedAction.id)

    const expectedDelayTime = calculateExpectedDelayTime(1, 9, 0)
    const actualDelayTime = delayedAction.processAfter

    // Allow for small differences due to processing time
    // Test helper now properly accounts for Eastern Time (EDT/EST)
    const timeDiff = Math.abs(actualDelayTime - expectedDelayTime)
    if (timeDiff > 60000) { // 1 minute tolerance for processing time
      throw new Error(`Day-of-month delay time mismatch. Expected: ${new Date(expectedDelayTime).toISOString()}, Got: ${new Date(actualDelayTime).toISOString()}, Diff: ${timeDiff}ms`)
    }

    console.log(`✅ Day-of-month delay correctly calculated for 1st at 9 AM. Scheduled for: ${new Date(actualDelayTime).toISOString()}`)

    // Test 2: Day-of-month delay with custom time (15th at 2:30 PM)
    console.log("Testing day-of-month delay for 15th at 2:30 PM...")

    const journey2 = await sdk.api.journeys.createOne({
      title: "Day of Month Delay Test - 15th at 2:30 PM"
    })
    createdJourneyIds.push(journey2.id)

    const firstStep2 = await sdk.api.automation_steps.createOne({
      journeyId: journey2.id,
      action: { type: 'addEnduserTags', info: { tags: ['second-first-step'] } },
      events: [{ type: 'onJourneyStart', info: {} }]
    })

    const dayOfMonthStep2 = await sdk.api.automation_steps.createOne({
      journeyId: journey2.id,
      action: { type: 'addEnduserTags', info: { tags: ['delayed-until-15th'] } },
      events: [{
        type: 'afterAction',
        info: {
          automationStepId: firstStep2.id,
          delayInMS: 0,
          delay: 0,
          unit: 'Minutes',
          dayOfMonthCondition: {
            dayOfMonth: 15,
            hour: 14, // 2 PM
            minute: 30
          }
        }
      }]
    })

    const enduser2 = await sdk.api.endusers.createOne({
      fname: 'Test',
      lname: 'User2',
      email: 'testuser2@example.com'
    })
    createdEnduserIds.push(enduser2.id)

    await sdk.api.endusers.add_to_journey({
      enduserIds: [enduser2.id],
      journeyId: journey2.id
    })

    // Poll for automated action creation
    const delayedAction2 = await pollForAutomationProcessing(
      async () => {
        const automatedActions = await sdk.api.automated_actions.getSome({
          filter: { enduserId: enduser2.id, journeyId: journey2.id }
        })
        return automatedActions.find((a: any) =>
          a.automationStepId === dayOfMonthStep2.id && a.status === 'active'
        )
      },
      (result): result is any => !!result,
      '15th day-of-month delay action should be created and scheduled'
    )

    createdAutomatedActionIds.push(delayedAction2.id)

    const expectedDelayTime2 = calculateExpectedDelayTime(15, 14, 30)
    const actualDelayTime2 = delayedAction2.processAfter

    const timeDiff2 = Math.abs(actualDelayTime2 - expectedDelayTime2)
    if (timeDiff2 > 60000) { // 1 minute tolerance for processing time
      throw new Error(`Day-of-month delay time mismatch for 15th. Expected: ${new Date(expectedDelayTime2).toISOString()}, Got: ${new Date(actualDelayTime2).toISOString()}, Diff: ${timeDiff2}ms`)
    }

    console.log(`✅ Day-of-month delay correctly calculated for 15th at 2:30 PM. Scheduled for: ${new Date(actualDelayTime2).toISOString()}`)

    // Test 3: Regular delay still works (backward compatibility)
    console.log("Testing backward compatibility - regular delay still works...")

    const journey3 = await sdk.api.journeys.createOne({
      title: "Regular Delay Test"
    })
    createdJourneyIds.push(journey3.id)

    const firstStep3 = await sdk.api.automation_steps.createOne({
      journeyId: journey3.id,
      action: { type: 'addEnduserTags', info: { tags: ['regular-first-step'] } },
      events: [{ type: 'onJourneyStart', info: {} }]
    })

    const regularDelayStep = await sdk.api.automation_steps.createOne({
      journeyId: journey3.id,
      action: { type: 'addEnduserTags', info: { tags: ['regular-delay-complete'] } },
      events: [{
        type: 'afterAction',
        info: {
          automationStepId: firstStep3.id,
          delayInMS: 300000, // 5 minutes
          delay: 5,
          unit: 'Minutes'
          // No dayOfMonthCondition - should use regular delay
        }
      }]
    })

    const enduser3 = await sdk.api.endusers.createOne({
      fname: 'Test',
      lname: 'User3',
      email: 'testuser3@example.com'
    })
    createdEnduserIds.push(enduser3.id)

    await sdk.api.endusers.add_to_journey({
      enduserIds: [enduser3.id],
      journeyId: journey3.id
    })

    // Poll for automated action creation
    const regularDelayedAction = await pollForAutomationProcessing(
      async () => {
        const automatedActions = await sdk.api.automated_actions.getSome({
          filter: { enduserId: enduser3.id, journeyId: journey3.id }
        })
        return automatedActions.find((a: any) =>
          a.automationStepId === regularDelayStep.id && a.status === 'active'
        )
      },
      (result): result is any => !!result,
      'Regular delay action should be created and scheduled'
    )

    createdAutomatedActionIds.push(regularDelayedAction.id)

    const expectedRegularDelayTime = Date.now() + 300000 // 5 minutes from now
    const actualRegularDelayTime = regularDelayedAction.processAfter

    // Allow for processing time variance (up to 10 seconds)
    const regularTimeDiff = Math.abs(actualRegularDelayTime - expectedRegularDelayTime)
    if (regularTimeDiff > 10000) {
      throw new Error(`Regular delay time mismatch. Expected around: ${new Date(expectedRegularDelayTime).toISOString()}, Got: ${new Date(actualRegularDelayTime).toISOString()}, Diff: ${regularTimeDiff}ms`)
    }

    console.log(`✅ Regular delay still works correctly. Scheduled for: ${new Date(actualRegularDelayTime).toISOString()}`)

    // Test 4: Day defaults (hour defaults to 9, minute defaults to 0)
    console.log("Testing day-of-month delay with default hour and minute...")

    const journey4 = await sdk.api.journeys.createOne({
      title: "Day of Month Delay Test - Defaults"
    })
    createdJourneyIds.push(journey4.id)

    const firstStep4 = await sdk.api.automation_steps.createOne({
      journeyId: journey4.id,
      action: { type: 'addEnduserTags', info: { tags: ['defaults-first-step'] } },
      events: [{ type: 'onJourneyStart', info: {} }]
    })

    const defaultsStep = await sdk.api.automation_steps.createOne({
      journeyId: journey4.id,
      action: { type: 'addEnduserTags', info: { tags: ['defaults-delay-complete'] } },
      events: [{
        type: 'afterAction',
        info: {
          automationStepId: firstStep4.id,
          delayInMS: 0,
          delay: 0,
          unit: 'Minutes',
          dayOfMonthCondition: {
            dayOfMonth: 28
            // hour and minute should default to 9 and 0
          }
        }
      }]
    })

    const enduser4 = await sdk.api.endusers.createOne({
      fname: 'Test',
      lname: 'User4',
      email: 'testuser4@example.com'
    })
    createdEnduserIds.push(enduser4.id)

    await sdk.api.endusers.add_to_journey({
      enduserIds: [enduser4.id],
      journeyId: journey4.id
    })

    // Poll for automated action creation
    const defaultsAction = await pollForAutomationProcessing(
      async () => {
        const automatedActions = await sdk.api.automated_actions.getSome({
          filter: { enduserId: enduser4.id, journeyId: journey4.id }
        })
        return automatedActions.find((a: any) =>
          a.automationStepId === defaultsStep.id && a.status === 'active'
        )
      },
      (result): result is any => !!result,
      'Defaults day-of-month delay action should be created and scheduled'
    )

    createdAutomatedActionIds.push(defaultsAction.id)

    const expectedDefaultsTime = calculateExpectedDelayTime(28, 9, 0) // Should use defaults
    const actualDefaultsTime = defaultsAction.processAfter

    const defaultsTimeDiff = Math.abs(actualDefaultsTime - expectedDefaultsTime)
    if (defaultsTimeDiff > 60000) { // 1 minute tolerance for processing time
      throw new Error(`Defaults delay time mismatch. Expected: ${new Date(expectedDefaultsTime).toISOString()}, Got: ${new Date(actualDefaultsTime).toISOString()}, Diff: ${defaultsTimeDiff}ms`)
    }

    console.log(`✅ Day-of-month delay with defaults works correctly. Scheduled for: ${new Date(actualDefaultsTime).toISOString()}`)

    console.log("✅ All day-of-month delay tests passed successfully!")

  } finally {
    // Clean up created resources
    console.log("Cleaning up test resources...")

    try {
      // Delete automated actions first
      for (const actionId of createdAutomatedActionIds) {
        try {
          await sdk.api.automated_actions.deleteOne(actionId)
        } catch (e) {
          console.warn(`Failed to delete automated action ${actionId}:`, e)
        }
      }

      // Delete endusers
      for (const enduserId of createdEnduserIds) {
        try {
          await sdk.api.endusers.deleteOne(enduserId)
        } catch (e) {
          console.warn(`Failed to delete enduser ${enduserId}:`, e)
        }
      }

      // Delete journeys (this will cascade delete automation steps)
      for (const journeyId of createdJourneyIds) {
        try {
          await sdk.api.journeys.deleteOne(journeyId)
        } catch (e) {
          console.warn(`Failed to delete journey ${journeyId}:`, e)
        }
      }
    } catch (e) {
      console.warn("Some cleanup operations failed:", e)
    }
  }
}

// Polling helper function for automation processing verification
const pollForAutomationProcessing = async <T>(
  fetchFn: () => Promise<T | undefined>,
  evaluateFn: (result: T | undefined) => result is T,
  description: string,
  intervalMs = 500,
  maxIterations = 20
): Promise<T> => {
  let lastResult: T | undefined

  for (let i = 0; i < maxIterations; i++) {
    await wait(undefined, intervalMs)

    lastResult = await fetchFn()
    if (evaluateFn(lastResult)) {
      console.log(`✓ ${description} - completed after ${(i + 1) * intervalMs}ms`)
      return lastResult
    }

    // Log progress every 2.5 seconds
    if (i > 0 && (i + 1) % 5 === 0) {
      console.log(`Still waiting for: ${description} - ${(i + 1) * intervalMs}ms elapsed`)
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
    await setup_tests(sdk, sdkNonAdmin)
    await afteraction_day_of_month_delay_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Day-of-month delay test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Day-of-month delay test suite failed:", error)
      process.exit(1)
    })
}