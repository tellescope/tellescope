import { Session } from '../../sdk'
import { log_header, wait } from "@tellescope/testing"
import { setup_tests } from "../setup"
import { DateTime } from "luxon"

const host = process.env.API_URL || 'http://localhost:8080'

export const afteraction_day_of_month_delay_tests = async ({ sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("AfterAction Day of Month Delay Tests")

  await day_of_month_delay_tests({ sdk, sdkNonAdmin })
  await office_hours_delay_tests({ sdk, sdkNonAdmin })
}

const day_of_month_delay_tests = async ({ sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Day of Month Delay Tests")

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

const office_hours_delay_tests = async ({ sdk }: { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Office Hours Delay Tests")

  let createdJourneyIds: string[] = []
  let createdEnduserIds: string[] = []
  let createdAutomatedActionIds: string[] = []
  let createdAvailabilityBlockIds: string[] = []

  // Save original organization state to restore later
  const originalOrg = (await sdk.api.organizations.getSome()).find(o => o.id === sdk.userInfo.businessId)
  if (!originalOrg) { throw new Error("Organization not found") }
  const originalOutOfOfficeHours = originalOrg.outOfOfficeHours || []

  try {
    // Test 1: officeHoursOnly with availability blocks (currently out of office)
    console.log("Testing officeHoursOnly delay when currently out of office hours...")

    // Clear any existing out-of-office blocks first
    await sdk.api.organizations.updateOne(
      sdk.userInfo.businessId,
      { outOfOfficeHours: [] },
      { replaceObjectFields: true }
    )

    // Set up availability blocks that don't include "now" (e.g., only available tomorrow)
    const tomorrow = DateTime.now().setZone('America/New_York').plus({ days: 1 })
    const tomorrowDayOfWeek = tomorrow.weekday === 7 ? 0 : tomorrow.weekday

    const availabilityBlock = await sdk.api.availability_blocks.createOne({
      entity: 'organization',
      entityId: sdk.userInfo.businessId,
      dayOfWeekStartingSundayIndexedByZero: tomorrowDayOfWeek,
      startTimeInMinutes: 9 * 60, // 9 AM
      endTimeInMinutes: 17 * 60, // 5 PM
      index: 0, // Required field for ordering blocks
    })
    createdAvailabilityBlockIds.push(availabilityBlock.id)

    // Verify businessId is set (should be automatic)
    if (!availabilityBlock.businessId) {
      throw new Error('Availability block missing businessId')
    }
    if (availabilityBlock.businessId !== sdk.userInfo.businessId) {
      throw new Error(`Availability block has wrong businessId: ${availabilityBlock.businessId} vs ${sdk.userInfo.businessId}`)
    }

    // Verify we can query the block back immediately (to confirm it's persisted)
    const queriedBlocks = await sdk.api.availability_blocks.getSome({
      filter: {
        businessId: sdk.userInfo.businessId,
        entity: 'organization',
        entityId: sdk.userInfo.businessId,
      }
    })
    const foundBlock = queriedBlocks.find(b => b.id === availabilityBlock.id)
    if (!foundBlock) {
      throw new Error(`Created availability block ${availabilityBlock.id} not found in query - possible persistence issue`)
    }
    console.log(`✓ Verified availability block is queryable with businessId=${foundBlock.businessId}, entity=${foundBlock.entity}, entityId=${foundBlock.entityId}`)

    // Wait for database consistency and worker polling cycle
    await wait(undefined, 2000) // 2 seconds to ensure worker sees the blocks

    const journey1 = await sdk.api.journeys.createOne({
      title: "Office Hours Delay Test - Availability Blocks"
    })
    createdJourneyIds.push(journey1.id)

    const firstStep1 = await sdk.api.automation_steps.createOne({
      journeyId: journey1.id,
      action: { type: 'addEnduserTags', info: { tags: ['office-hours-step-1'] } },
      events: [{ type: 'onJourneyStart', info: {} }]
    })

    const officeHoursStep1 = await sdk.api.automation_steps.createOne({
      journeyId: journey1.id,
      action: { type: 'addEnduserTags', info: { tags: ['delayed-for-office-hours'] } },
      events: [{
        type: 'afterAction',
        info: {
          automationStepId: firstStep1.id,
          delayInMS: 0, // 0 second base delay - should be delayed to office hours
          delay: 0,
          unit: 'Minutes',
          officeHoursOnly: true, // This should cause a delay
        }
      }]
    })

    const enduser1 = await sdk.api.endusers.createOne({
      fname: 'OfficeHours',
      lname: 'Test1',
      email: 'officehours1@example.com'
    })
    createdEnduserIds.push(enduser1.id)

    await sdk.api.endusers.add_to_journey({
      enduserIds: [enduser1.id],
      journeyId: journey1.id
    })

    // First wait for the initial onJourneyStart action to finish
    console.log("Waiting for first step (onJourneyStart) to finish...")
    await pollForAutomationProcessing(
      async () => {
        const automatedActions = await sdk.api.automated_actions.getSome({
          filter: { enduserId: enduser1.id, journeyId: journey1.id }
        })
        const firstAction = automatedActions.find((a: any) =>
          a.automationStepId === firstStep1.id && a.status === 'finished'
        )
        return firstAction
      },
      (result): result is any => !!result,
      'First step (onJourneyStart) should finish',
      500,
      20
    )
    console.log("✓ First step finished")

    // Now poll for the second step (with office hours delay) to be created and processed
    // The worker runs every few seconds, so we need to wait for it to:
    // 1. Create the afterAction (triggered by first step completion)
    // 2. Process the office hours delay (may take a few seconds)
    const delayedAction1 = await pollForAutomationProcessing(
      async () => {
        const automatedActions = await sdk.api.automated_actions.getSome({
          filter: { enduserId: enduser1.id, journeyId: journey1.id }
        })
        console.log(`  Found ${automatedActions.length} automated actions for enduser ${enduser1.id}`)

        const action = automatedActions.find((a: any) =>
          a.automationStepId === officeHoursStep1.id && a.status === 'active'
        )
        // Return the action only if it has been processed for office hours delay
        // (either delayed with flag set, or not delayed if in office hours)
        if (!action) {
          console.log(`  No action found for step ${officeHoursStep1.id}`)
          return undefined
        }

        console.log(`  Action found: processAfter=${new Date(action.processAfter).toISOString()}, didDelayForOutOfOffice=${action.didDelayForOutOfOffice}`)
        console.log(`  Action event type: ${action.event?.type}, officeHoursOnly: ${(action.event?.info as any)?.officeHoursOnly}`)

        // Check if worker has processed this action
        // If didDelayForOutOfOffice is true, it's been delayed
        // If processAfter is more than 5 hours away, it's been delayed
        // Otherwise, keep polling for worker to process it
        const minExpectedDelay = Date.now() + 1000 * 60 * 60 * 5 // 5 hours from now
        if (action.didDelayForOutOfOffice || action.processAfter > minExpectedDelay) {
          return action
        }

        console.log(`  Action not yet delayed, continuing to poll...`)
        // Action exists but hasn't been delayed yet, keep polling
        return undefined
      },
      (result): result is any => !!result,
      'Office hours delayed action should be created and processed',
      500, // Check every 500ms
      20  // For up to 10 seconds
    )

    createdAutomatedActionIds.push(delayedAction1.id)

    // Verify the action was delayed significantly beyond the base delay (tomorrow at 9 AM)
    // Base delay would be ~1 minute from when action was created
    // Office hours delay should push it to tomorrow at 9 AM (many hours away)
    const minExpectedDelay = Date.now() + 1000 * 60 * 60 * 6 // At least 6 hours from now
    if (delayedAction1.processAfter <= minExpectedDelay) {
      throw new Error(`Action should be delayed to tomorrow's office hours (at least 6 hours). ProcessAfter: ${new Date(delayedAction1.processAfter).toISOString()}, Expected beyond: ${new Date(minExpectedDelay).toISOString()}`)
    }

    // Verify didDelayForOutOfOffice flag is set
    if (!delayedAction1.didDelayForOutOfOffice) {
      throw new Error('didDelayForOutOfOffice flag should be set to true')
    }

    console.log(`✅ Action correctly delayed for office hours. ProcessAfter: ${new Date(delayedAction1.processAfter).toISOString()}, didDelayForOutOfOffice: ${delayedAction1.didDelayForOutOfOffice}`)

    // Test 2: officeHoursOnly with outOfOfficeHours date range (new feature)
    console.log("Testing officeHoursOnly delay with outOfOfficeHours date range...")

    // Delete availability blocks from Test 1
    // This test uses ONLY outOfOfficeHours (no availability blocks)
    // to verify that outOfOfficeHours works independently
    for (const blockId of createdAvailabilityBlockIds) {
      try {
        await sdk.api.availability_blocks.deleteOne(blockId)
      } catch (e) {
        console.warn(`Failed to delete availability block ${blockId}:`, e)
      }
    }
    createdAvailabilityBlockIds = [] // Clear the array

    // Set organization outOfOfficeHours
    await sdk.api.organizations.updateOne(
      sdk.userInfo.businessId,
      {
        outOfOfficeHours: [{
          from: new Date(Date.now() - 1000 * 60 * 60), // Started 1 hour ago
          to: new Date(Date.now() + 1000 * 60 * 60 * 48), // Ends in 48 hours
          autoreplyText: 'Out of office for testing'
        }]
      },
      { replaceObjectFields: true }
    )

    // Wait for database consistency
    console.log("Waiting for database updates to propagate...")
    await wait(undefined, 2000)

    const journey2 = await sdk.api.journeys.createOne({
      title: "Office Hours Delay Test - OutOfOfficeHours"
    })
    createdJourneyIds.push(journey2.id)

    const firstStep2 = await sdk.api.automation_steps.createOne({
      journeyId: journey2.id,
      action: { type: 'addEnduserTags', info: { tags: ['ooo-step-1'] } },
      events: [{ type: 'onJourneyStart', info: {} }]
    })

    const officeHoursStep2 = await sdk.api.automation_steps.createOne({
      journeyId: journey2.id,
      action: { type: 'addEnduserTags', info: { tags: ['delayed-for-ooo'] } },
      events: [{
        type: 'afterAction',
        info: {
          automationStepId: firstStep2.id,
          delayInMS: 0, // 0 second base delay - should be delayed for OOO
          delay: 0,
          unit: 'Minutes',
          officeHoursOnly: true, // Should delay due to outOfOfficeHours
        }
      }]
    })

    const enduser2 = await sdk.api.endusers.createOne({
      fname: 'OutOfOffice',
      lname: 'Test2',
      email: 'ooo2@example.com'
    })
    createdEnduserIds.push(enduser2.id)

    await sdk.api.endusers.add_to_journey({
      enduserIds: [enduser2.id],
      journeyId: journey2.id
    })

    // First wait for the initial onJourneyStart action to finish
    console.log("Waiting for first step (onJourneyStart) to finish...")
    await pollForAutomationProcessing(
      async () => {
        const automatedActions = await sdk.api.automated_actions.getSome({
          filter: { enduserId: enduser2.id, journeyId: journey2.id }
        })
        const firstAction = automatedActions.find((a: any) =>
          a.automationStepId === firstStep2.id && a.status === 'finished'
        )
        return firstAction
      },
      (result): result is any => !!result,
      'First step (onJourneyStart) should finish',
      500,
      20
    )
    console.log("✓ First step finished")

    // Poll for automated action creation and OOO delay processing
    const delayedAction2 = await pollForAutomationProcessing(
      async () => {
        const automatedActions = await sdk.api.automated_actions.getSome({
          filter: { enduserId: enduser2.id, journeyId: journey2.id }
        })
        console.log(`  Found ${automatedActions.length} automated actions for enduser ${enduser2.id}`)
        console.log(`  Action statuses: ${automatedActions.map(a => `${a.automationStepId.substring(0,8)}:${a.status}`).join(', ')}`)

        const action = automatedActions.find((a: any) =>
          a.automationStepId === officeHoursStep2.id
        )
        if (!action) {
          console.log(`  No action found for step ${officeHoursStep2.id}`)
          return undefined
        }

        console.log(`  Action found: status=${action.status}, processAfter=${new Date(action.processAfter).toISOString()}, didDelayForOutOfOffice=${action.didDelayForOutOfOffice}`)

        // Only accept active or finished actions (not cancelled)
        if (action.status === 'cancelled') {
          console.log(`  Action was cancelled, aborting test`)
          throw new Error('Action was cancelled - office hours delay logic may have failed')
        }

        // Check if worker has processed the OOO delay
        // Should be delayed at least 48 hours (beyond OOO period)
        // Accept action if it's active (waiting to be processed) with delay set
        if (action.status === 'active') {
          const minExpectedDelay = Date.now() + 1000 * 60 * 60 * 47 // At least 47 hours
          if (action.didDelayForOutOfOffice || action.processAfter > minExpectedDelay) {
            return action
          }
          console.log(`  Action active but not yet delayed, continuing to poll...`)
          return undefined
        }

        // If action is finished/other status, it wasn't delayed properly
        console.log(`  Action has status ${action.status} - wasn't delayed for office hours`)
        return undefined
      },
      (result): result is any => !!result,
      'OutOfOfficeHours delayed action should be created and processed',
      500, // Check every 500ms
      20  // For up to 10 seconds
    )

    createdAutomatedActionIds.push(delayedAction2.id)

    // Verify didDelayForOutOfOffice flag is set
    if (!delayedAction2.didDelayForOutOfOffice) {
      throw new Error('didDelayForOutOfOffice flag should be set to true for OOO delay')
    }

    // Verify the action was delayed significantly (at least 24 hours)
    // OOO period is 48 hours, so action should be delayed at least 24 hours from now
    const minExpectedDelay2 = Date.now() + 1000 * 60 * 60 * 24 // 24 hours
    if (delayedAction2.processAfter <= minExpectedDelay2) {
      throw new Error(`Action should be delayed at least 24 hours for OOO. ProcessAfter: ${new Date(delayedAction2.processAfter).toISOString()}, Expected beyond: ${new Date(minExpectedDelay2).toISOString()}`)
    }

    console.log(`✅ Action correctly delayed for outOfOfficeHours. ProcessAfter: ${new Date(delayedAction2.processAfter).toISOString()}, didDelayForOutOfOffice: ${delayedAction2.didDelayForOutOfOffice}`)

    // Test 3: officeHoursOnly when currently IN office hours (should not delay beyond base)
    console.log("Testing officeHoursOnly when currently IN office hours...")

    // Clear outOfOfficeHours
    await sdk.api.organizations.updateOne(
      sdk.userInfo.businessId,
      { outOfOfficeHours: [] },
      { replaceObjectFields: true }
    )

    // Create availability block for "right now"
    const now = DateTime.now().setZone('America/New_York')
    const currentDayOfWeek = now.weekday === 7 ? 0 : now.weekday
    const currentMinutes = now.hour * 60 + now.minute

    const currentAvailabilityBlock = await sdk.api.availability_blocks.createOne({
      entity: 'organization',
      entityId: sdk.userInfo.businessId,
      dayOfWeekStartingSundayIndexedByZero: currentDayOfWeek,
      startTimeInMinutes: Math.max(0, currentMinutes - 30), // 30 minutes ago
      endTimeInMinutes: Math.min(24 * 60 - 1, currentMinutes + 120), // 2 hours from now
      index: 0, // Required field for ordering blocks
    })
    createdAvailabilityBlockIds.push(currentAvailabilityBlock.id)

    // Verify businessId is set (should be automatic)
    if (!currentAvailabilityBlock.businessId) {
      throw new Error('Availability block missing businessId')
    }

    // Wait for database consistency before triggering journey
    await wait(undefined, 1000) // 1 second for DB to fully persist and index

    const journey3 = await sdk.api.journeys.createOne({
      title: "Office Hours Delay Test - In Office"
    })
    createdJourneyIds.push(journey3.id)

    const firstStep3 = await sdk.api.automation_steps.createOne({
      journeyId: journey3.id,
      action: { type: 'addEnduserTags', info: { tags: ['in-office-step-1'] } },
      events: [{ type: 'onJourneyStart', info: {} }]
    })

    const officeHoursStep3 = await sdk.api.automation_steps.createOne({
      journeyId: journey3.id,
      action: { type: 'addEnduserTags', info: { tags: ['not-delayed-in-office'] } },
      events: [{
        type: 'afterAction',
        info: {
          automationStepId: firstStep3.id,
          delayInMS: 0, // 0 second base delay - should NOT be delayed (in office)
          delay: 0,
          unit: 'Minutes',
          officeHoursOnly: true, // Should NOT add extra delay
        }
      }]
    })

    const enduser3 = await sdk.api.endusers.createOne({
      fname: 'InOffice',
      lname: 'Test3',
      email: 'inoffice3@example.com'
    })
    createdEnduserIds.push(enduser3.id)

    await sdk.api.endusers.add_to_journey({
      enduserIds: [enduser3.id],
      journeyId: journey3.id
    })

    // First wait for the initial onJourneyStart action to finish
    console.log("Waiting for first step (onJourneyStart) to finish...")
    await pollForAutomationProcessing(
      async () => {
        const automatedActions = await sdk.api.automated_actions.getSome({
          filter: { enduserId: enduser3.id, journeyId: journey3.id }
        })
        const firstAction = automatedActions.find((a: any) =>
          a.automationStepId === firstStep3.id && a.status === 'finished'
        )
        return firstAction
      },
      (result): result is any => !!result,
      'First step (onJourneyStart) should finish',
      500,
      20
    )
    console.log("✓ First step finished")

    // Poll for automated action creation
    const delayedAction3 = await pollForAutomationProcessing(
      async () => {
        const automatedActions = await sdk.api.automated_actions.getSome({
          filter: { enduserId: enduser3.id, journeyId: journey3.id }
        })
        return automatedActions.find((a: any) =>
          a.automationStepId === officeHoursStep3.id && a.status === 'active'
        )
      },
      (result): result is any => !!result,
      'In-office action should be created without extra delay'
    )

    createdAutomatedActionIds.push(delayedAction3.id)

    // Verify the action was NOT delayed beyond base delay (should be immediate, within 5 seconds tolerance)
    const expectedProcessAfter = Date.now()
    const timeDiff = Math.abs(delayedAction3.processAfter - expectedProcessAfter)
    if (timeDiff > 5000) {
      throw new Error(`Action should not be delayed when in office hours (base delay is 0). ProcessAfter: ${new Date(delayedAction3.processAfter).toISOString()}, Expected around: ${new Date(expectedProcessAfter).toISOString()}, Diff: ${timeDiff}ms`)
    }

    // didDelayForOutOfOffice should NOT be set since we didn't delay
    if (delayedAction3.didDelayForOutOfOffice) {
      throw new Error('didDelayForOutOfOffice should not be set when in office hours')
    }

    console.log(`✅ Action correctly NOT delayed when in office hours. ProcessAfter: ${new Date(delayedAction3.processAfter).toISOString()}, didDelayForOutOfOffice: ${delayedAction3.didDelayForOutOfOffice}`)

    // Test 4: Both availability blocks AND outOfOfficeHours (OOO should take precedence)
    console.log("Testing officeHoursOnly with BOTH availability blocks and outOfOfficeHours...")

    // Keep the current availability block from Test 3 (for "right now")
    // Add a short outOfOfficeHours period that overlaps with the availability block
    // This tests that OOO takes precedence even when we're technically "in office hours"
    await sdk.api.organizations.updateOne(
      sdk.userInfo.businessId,
      {
        outOfOfficeHours: [{
          from: new Date(Date.now() - 1000 * 60 * 5), // Started 5 minutes ago
          to: new Date(Date.now() + 1000 * 60 * 60 * 2), // Ends in 2 hours
          autoreplyText: 'Emergency out of office'
        }]
      },
      { replaceObjectFields: true }
    )

    // Wait for database consistency
    console.log("Waiting for database updates to propagate...")
    await wait(undefined, 2000)

    const journey4 = await sdk.api.journeys.createOne({
      title: "Office Hours Delay Test - OOO Precedence"
    })
    createdJourneyIds.push(journey4.id)

    const firstStep4 = await sdk.api.automation_steps.createOne({
      journeyId: journey4.id,
      action: { type: 'addEnduserTags', info: { tags: ['ooo-precedence-step-1'] } },
      events: [{ type: 'onJourneyStart', info: {} }]
    })

    const officeHoursStep4 = await sdk.api.automation_steps.createOne({
      journeyId: journey4.id,
      action: { type: 'addEnduserTags', info: { tags: ['delayed-for-ooo-precedence'] } },
      events: [{
        type: 'afterAction',
        info: {
          automationStepId: firstStep4.id,
          delayInMS: 0, // 0 second base delay
          delay: 0,
          unit: 'Minutes',
          officeHoursOnly: true, // Should delay due to OOO taking precedence
        }
      }]
    })

    const enduser4 = await sdk.api.endusers.createOne({
      fname: 'OOOPrecedence',
      lname: 'Test4',
      email: 'precedence4@example.com'
    })
    createdEnduserIds.push(enduser4.id)

    await sdk.api.endusers.add_to_journey({
      enduserIds: [enduser4.id],
      journeyId: journey4.id
    })

    // First wait for the initial onJourneyStart action to finish
    console.log("Waiting for first step (onJourneyStart) to finish...")
    await pollForAutomationProcessing(
      async () => {
        const automatedActions = await sdk.api.automated_actions.getSome({
          filter: { enduserId: enduser4.id, journeyId: journey4.id }
        })
        const firstAction = automatedActions.find((a: any) =>
          a.automationStepId === firstStep4.id && a.status === 'finished'
        )
        return firstAction
      },
      (result): result is any => !!result,
      'First step (onJourneyStart) should finish',
      500,
      20
    )
    console.log("✓ First step finished")

    // Poll for automated action with OOO delay
    const delayedAction4 = await pollForAutomationProcessing(
      async () => {
        const automatedActions = await sdk.api.automated_actions.getSome({
          filter: { enduserId: enduser4.id, journeyId: journey4.id }
        })

        const action = automatedActions.find((a: any) =>
          a.automationStepId === officeHoursStep4.id
        )
        if (!action) {
          return undefined
        }

        // Accept action if it has been delayed for OOO (flag set or delayed at least 1 hour)
        const minExpectedDelay4 = Date.now() + 1000 * 60 * 60 // 1 hour
        if (action.didDelayForOutOfOffice || action.processAfter > minExpectedDelay4) {
          return action
        }

        return undefined
      },
      (result): result is any => !!result,
      'OOO precedence action should be delayed',
      500,
      20
    )

    createdAutomatedActionIds.push(delayedAction4.id)

    // Verify didDelayForOutOfOffice flag is set
    if (!delayedAction4.didDelayForOutOfOffice) {
      throw new Error('didDelayForOutOfOffice flag should be set when OOO takes precedence over availability blocks')
    }

    // Verify the action was delayed at least 1 hour (OOO is 2 hours)
    const minExpectedDelay4 = Date.now() + 1000 * 60 * 60 // 1 hour
    if (delayedAction4.processAfter <= minExpectedDelay4) {
      throw new Error(`Action should be delayed for OOO even with availability blocks. ProcessAfter: ${new Date(delayedAction4.processAfter).toISOString()}, Expected beyond: ${new Date(minExpectedDelay4).toISOString()}`)
    }

    console.log(`✅ outOfOfficeHours correctly takes precedence over availability blocks. ProcessAfter: ${new Date(delayedAction4.processAfter).toISOString()}, didDelayForOutOfOffice: ${delayedAction4.didDelayForOutOfOffice}`)

    console.log("✅ All office hours delay tests passed successfully!")

  } finally {
    // Clean up created resources
    console.log("Cleaning up office hours test resources...")

    try {
      // Restore original outOfOfficeHours
      await sdk.api.organizations.updateOne(
        sdk.userInfo.businessId,
        { outOfOfficeHours: originalOutOfOfficeHours },
        { replaceObjectFields: true }
      )

      // Delete availability blocks
      for (const blockId of createdAvailabilityBlockIds) {
        try {
          await sdk.api.availability_blocks.deleteOne(blockId)
        } catch (e) {
          console.warn(`Failed to delete availability block ${blockId}:`, e)
        }
      }

      // Delete automated actions
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