require('source-map-support').install();

import { Session } from "../../sdk"
import {
  async_test,
  handleAnyError,
  log_header,
  wait,
} from "@tellescope/testing"
import { setup_tests } from "../setup"
import { DateTime } from "luxon"

const host = process.env.API_URL || 'http://localhost:8080' as const

// Main test function that can be called independently
export const monthly_availability_restrictions_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Monthly Availability Restrictions Tests")

  // Create a test user with specific timezone
  const testUser = await sdk.api.users.updateOne(sdk.userInfo.id, {
    timezone: 'America/New_York'
  })

  // Create a calendar event template for testing
  const template = await sdk.api.calendar_event_templates.createOne({
    title: 'Monthly Restriction Test Appointment',
    durationInMinutes: 60,
    description: 'Test appointment for monthly restrictions',
  })

  try {
    // Test 1: Regular weekly availability without restrictions
    // Use next Monday to ensure we get consistent day-of-week testing
    const now = DateTime.now().setZone('America/New_York')
    let nextMonday = now.startOf('week').plus({ days: 1 }) // This week's Monday

    // If this week's Monday is in the past, use next week's Monday
    if (nextMonday <= now) {
      nextMonday = nextMonday.plus({ weeks: 1 })
    }

    await sdk.api.users.updateOne(sdk.userInfo.id, {
      weeklyAvailabilities: [{
        dayOfWeekStartingSundayIndexedByZero: 1, // Monday
        startTimeInMinutes: 9 * 60, // 9 AM
        endTimeInMinutes: 17 * 60, // 5 PM
        intervalInMinutes: 60,
      }]
    }, { replaceObjectFields: true })

    // Get availability for next 4 weeks to ensure we get multiple Mondays
    const fromDate = nextMonday
    const toDate = fromDate.plus({ weeks: 4 })

    const regularAvailability = await sdk.api.calendar_events.get_appointment_availability({
      calendarEventTemplateId: template.id,
      from: fromDate.toJSDate(),
      to: toDate.toJSDate(),
    })

    await async_test(
      'Regular availability generates blocks for all Mondays',
      () => Promise.resolve(regularAvailability),
      { onResult: r => {
        console.log(`Regular availability found ${r.availabilityBlocks.length} blocks`)

        // Filter to only blocks for the test user
        const testUserBlocks = r.availabilityBlocks.filter(block => block.userId === sdk.userInfo.id)
        console.log(`Test user (${sdk.userInfo.id}) has ${testUserBlocks.length} blocks`)

        if (testUserBlocks.length === 0) {
          console.log('ERROR: No availability blocks found for test user')
          return false
        }

        // Verify that test user blocks are actually on Mondays (day 1)
        for (const block of testUserBlocks) {
          const blockDate = DateTime.fromMillis(block.startTimeInMS).setZone('America/New_York')
          if (blockDate.weekday !== 1) {
            console.log(`ERROR: Test user block not on Monday: ${blockDate.toISO()} (weekday: ${blockDate.weekday})`)
            return false
          }
        }

        console.log('✅ All test user blocks are on Mondays as expected')
        return true
      }}
    )

    // Test 2: Monthly restriction to first Monday only
    await sdk.api.users.updateOne(sdk.userInfo.id, {
      weeklyAvailabilities: [{
        dayOfWeekStartingSundayIndexedByZero: 1, // Monday
        startTimeInMinutes: 9 * 60, // 9 AM
        endTimeInMinutes: 17 * 60, // 5 PM
        intervalInMinutes: 60,
        monthlyRestriction: {
          occurrences: [1] // First Monday only
        }
      }]
    }, { replaceObjectFields: true })

    // Get availability for next 6 months to test multiple months and ensure 5th occurrence coverage
    const longFromDate = DateTime.now().setZone('America/New_York').plus({ days: 1 }).startOf('day') // Tomorrow
    const longToDate = longFromDate.plus({ months: 6 }) // Extended to 6 months for better 5th occurrence testing

    console.log(`Testing from ${longFromDate.toISO()} to ${longToDate.toISO()}`)

    const firstMondayOnlyAvailability = await sdk.api.calendar_events.get_appointment_availability({
      calendarEventTemplateId: template.id,
      from: longFromDate.toJSDate(),
      to: longToDate.toJSDate(),
    })

    await async_test(
      'Monthly restriction to first Monday generates fewer blocks',
      () => Promise.resolve(firstMondayOnlyAvailability),
      { onResult: r => {
        console.log(`First Monday only availability found ${r.availabilityBlocks.length} blocks`)

        // Filter to only blocks for the test user
        const testUserBlocks = r.availabilityBlocks.filter(block => block.userId === sdk.userInfo.id)
        const regularTestUserBlocks = regularAvailability.availabilityBlocks.filter(block => block.userId === sdk.userInfo.id)

        console.log(`Test user has ${testUserBlocks.length} restricted blocks vs ${regularTestUserBlocks.length} regular blocks`)

        // The test should show fewer blocks than regular availability
        // since we're restricting to first Monday only
        if (testUserBlocks.length >= regularTestUserBlocks.length) {
          console.log(`ERROR: Restricted availability (${testUserBlocks.length}) should be fewer than regular (${regularTestUserBlocks.length})`)
          return false
        }

        // Verify each test user block is indeed a first Monday of the month
        for (const block of testUserBlocks) {
          const blockDate = DateTime.fromMillis(block.startTimeInMS).setZone('America/New_York')

          // Check if it's a Monday
          if (blockDate.weekday !== 1) {
            console.log(`ERROR: Block is not on Monday: ${blockDate.toISO()}`)
            return false
          }

          // Check if it's the first Monday of the month
          const startOfMonth = blockDate.startOf('month')
          let firstMonday = startOfMonth
          while (firstMonday.weekday !== 1) {
            firstMonday = firstMonday.plus({ days: 1 })
          }

          if (blockDate.day !== firstMonday.day) {
            console.log(`ERROR: Block is not first Monday: block=${blockDate.toISO()}, firstMonday=${firstMonday.toISO()}`)
            return false
          }
        }

        console.log('✅ All blocks are first Mondays and fewer than regular availability')
        return true
      }}
    )

    // Test 3: Multiple occurrences (1st and 3rd Monday)
    await sdk.api.users.updateOne(sdk.userInfo.id, {
      weeklyAvailabilities: [{
        dayOfWeekStartingSundayIndexedByZero: 1, // Monday
        startTimeInMinutes: 9 * 60, // 9 AM
        endTimeInMinutes: 17 * 60, // 5 PM
        intervalInMinutes: 60,
        monthlyRestriction: {
          occurrences: [1, 3] // First and third Monday
        }
      }]
    }, { replaceObjectFields: true })

    const firstAndThirdMondayAvailability = await sdk.api.calendar_events.get_appointment_availability({
      calendarEventTemplateId: template.id,
      from: longFromDate.toJSDate(),
      to: longToDate.toJSDate(),
    })

    await async_test(
      'Monthly restriction to 1st and 3rd Monday generates correct blocks',
      () => Promise.resolve(firstAndThirdMondayAvailability),
      { onResult: r => {
        console.log(`First and third Monday availability found ${r.availabilityBlocks.length} blocks`)

        // Filter to only blocks for the test user
        const testUserBlocks = r.availabilityBlocks.filter(block => block.userId === sdk.userInfo.id)
        console.log(`Test user has ${testUserBlocks.length} blocks for 1st and 3rd Mondays`)

        // Verify each test user block is either first or third Monday of the month
        for (const block of testUserBlocks) {
          const blockDate = DateTime.fromMillis(block.startTimeInMS).setZone('America/New_York')

          // Check if it's a Monday
          if (blockDate.weekday !== 1) {
            console.log(`Block is not on Monday: ${blockDate.toISO()}`)
            return false
          }

          // Calculate which occurrence of Monday this is in the month
          const startOfMonth = blockDate.startOf('month')
          let occurrence = 0
          let currentDay = startOfMonth

          while (currentDay.month === blockDate.month) {
            if (currentDay.weekday === 1) {
              occurrence++
              if (currentDay.day === blockDate.day) {
                break
              }
            }
            currentDay = currentDay.plus({ days: 1 })
          }

          if (![1, 3].includes(occurrence)) {
            console.log(`Block is not 1st or 3rd Monday: occurrence=${occurrence}, date=${blockDate.toISO()}`)
            return false
          }
        }

        console.log('✅ All blocks are 1st or 3rd Mondays')
        return true
      }}
    )

    // Test 4: Test with Saturday to ensure weekend days work
    await sdk.api.users.updateOne(sdk.userInfo.id, {
      weeklyAvailabilities: [{
        dayOfWeekStartingSundayIndexedByZero: 6, // Saturday
        startTimeInMinutes: 10 * 60, // 10 AM
        endTimeInMinutes: 14 * 60, // 2 PM
        intervalInMinutes: 60,
        monthlyRestriction: {
          occurrences: [2] // Second Saturday only
        }
      }]
    }, { replaceObjectFields: true })

    const secondSaturdayAvailability = await sdk.api.calendar_events.get_appointment_availability({
      calendarEventTemplateId: template.id,
      from: longFromDate.toJSDate(),
      to: longToDate.toJSDate(),
    })

    await async_test(
      'Monthly restriction works for weekend days (Saturday)',
      () => Promise.resolve(secondSaturdayAvailability),
      { onResult: r => {
        console.log(`Second Saturday availability found ${r.availabilityBlocks.length} blocks`)

        // Filter to only blocks for the test user
        const testUserBlocks = r.availabilityBlocks.filter(block => block.userId === sdk.userInfo.id)
        console.log(`Test user has ${testUserBlocks.length} blocks for 2nd Saturdays`)

        // Verify each test user block is the second Saturday of the month
        for (const block of testUserBlocks) {
          const blockDate = DateTime.fromMillis(block.startTimeInMS).setZone('America/New_York')

          // Check if it's a Saturday
          if (blockDate.weekday !== 6) {
            console.log(`Block is not on Saturday: ${blockDate.toISO()}`)
            return false
          }

          // Calculate which occurrence of Saturday this is in the month
          const startOfMonth = blockDate.startOf('month')
          let occurrence = 0
          let currentDay = startOfMonth

          while (currentDay.month === blockDate.month) {
            if (currentDay.weekday === 6) {
              occurrence++
              if (currentDay.day === blockDate.day) {
                break
              }
            }
            currentDay = currentDay.plus({ days: 1 })
          }

          if (occurrence !== 2) {
            console.log(`Block is not 2nd Saturday: occurrence=${occurrence}, date=${blockDate.toISO()}`)
            return false
          }
        }

        console.log('✅ All blocks are 2nd Saturdays')
        return true
      }}
    )

    // Test 5: Edge case - 5th occurrence that doesn't exist in some months
    await sdk.api.users.updateOne(sdk.userInfo.id, {
      weeklyAvailabilities: [{
        dayOfWeekStartingSundayIndexedByZero: 1, // Monday
        startTimeInMinutes: 9 * 60, // 9 AM
        endTimeInMinutes: 17 * 60, // 5 PM
        intervalInMinutes: 60,
        monthlyRestriction: {
          occurrences: [5] // Fifth Monday only (doesn't exist in all months)
        }
      }]
    }, { replaceObjectFields: true })

    const fifthMondayAvailability = await sdk.api.calendar_events.get_appointment_availability({
      calendarEventTemplateId: template.id,
      from: longFromDate.toJSDate(),
      to: longToDate.toJSDate(),
    })

    await async_test(
      'Monthly restriction handles 5th occurrence gracefully',
      () => Promise.resolve(fifthMondayAvailability),
      { onResult: r => {
        console.log(`Fifth Monday availability found ${r.availabilityBlocks.length} blocks`)

        // Filter to only blocks for the test user
        const testUserBlocks = r.availabilityBlocks.filter(block => block.userId === sdk.userInfo.id)
        console.log(`Test user has ${testUserBlocks.length} blocks for 5th Mondays`)

        // Verify that test user blocks only exist for months that have a 5th Monday
        for (const block of testUserBlocks) {
          const blockDate = DateTime.fromMillis(block.startTimeInMS).setZone('America/New_York')

          // Check if it's a Monday
          if (blockDate.weekday !== 1) {
            console.log(`Block is not on Monday: ${blockDate.toISO()}`)
            return false
          }

          // Verify it's actually the 5th Monday
          const startOfMonth = blockDate.startOf('month')
          let mondayCount = 0
          let currentDay = startOfMonth

          while (currentDay.month === blockDate.month) {
            if (currentDay.weekday === 1) {
              mondayCount++
              if (currentDay.day === blockDate.day) {
                if (mondayCount !== 5) {
                  console.log(`Block is not 5th Monday: count=${mondayCount}, date=${blockDate.toISO()}`)
                  return false
                }
                break
              }
            }
            currentDay = currentDay.plus({ days: 1 })
          }
        }

        console.log('✅ All blocks are valid 5th Mondays')
        // 5th Mondays are rare, so any number of blocks (including 0) is valid
        return true
      }}
    )

    // Test 6: Timezone-agnostic testing (West Coast)
    await sdk.api.users.updateOne(sdk.userInfo.id, {
      timezone: 'America/Los_Angeles', // Change to Pacific timezone
      weeklyAvailabilities: [{
        dayOfWeekStartingSundayIndexedByZero: 2, // Tuesday
        startTimeInMinutes: 14 * 60, // 2 PM
        endTimeInMinutes: 16 * 60, // 4 PM
        intervalInMinutes: 60,
        monthlyRestriction: {
          occurrences: [1, 4] // First and fourth Tuesday
        }
      }]
    }, { replaceObjectFields: true })

    // Test with Pacific timezone dates
    const pacificFromDate = DateTime.now().setZone('America/Los_Angeles').plus({ days: 1 }).startOf('day')
    const pacificToDate = pacificFromDate.plus({ months: 4 })

    const timezoneTestAvailability = await sdk.api.calendar_events.get_appointment_availability({
      calendarEventTemplateId: template.id,
      from: pacificFromDate.toJSDate(),
      to: pacificToDate.toJSDate(),
    })

    await async_test(
      'Monthly restriction works correctly across different timezones',
      () => Promise.resolve(timezoneTestAvailability),
      { onResult: r => {
        console.log(`Timezone test availability found ${r.availabilityBlocks.length} blocks`)

        // Filter to only blocks for the test user
        const testUserBlocks = r.availabilityBlocks.filter(block => block.userId === sdk.userInfo.id)
        console.log(`Test user has ${testUserBlocks.length} blocks for 1st and 4th Tuesdays (Pacific time)`)

        // Verify each test user block is either first or fourth Tuesday of the month
        for (const block of testUserBlocks) {
          const blockDate = DateTime.fromMillis(block.startTimeInMS).setZone('America/Los_Angeles')

          // Check if it's a Tuesday (day 2)
          if (blockDate.weekday !== 2) {
            console.log(`ERROR: Block not on Tuesday: ${blockDate.toISO()} (weekday: ${blockDate.weekday})`)
            return false
          }

          // Calculate which occurrence of Tuesday this is in the month
          const startOfMonth = blockDate.startOf('month')
          let occurrence = 0
          let currentDay = startOfMonth

          while (currentDay.month === blockDate.month) {
            if (currentDay.weekday === 2) {
              occurrence++
              if (currentDay.day === blockDate.day) {
                break
              }
            }
            currentDay = currentDay.plus({ days: 1 })
          }

          if (![1, 4].includes(occurrence)) {
            console.log(`ERROR: Block not 1st or 4th Tuesday: occurrence=${occurrence}, date=${blockDate.toISO()}`)
            return false
          }
        }

        console.log('✅ All blocks are 1st or 4th Tuesdays in Pacific timezone')
        return true
      }}
    )

    // Test 7: Cross-timezone validation (ensure calculation consistency)
    // Test the same restriction in Eastern time to verify consistency
    await sdk.api.users.updateOne(sdk.userInfo.id, {
      timezone: 'America/New_York', // Back to Eastern timezone
      weeklyAvailabilities: [{
        dayOfWeekStartingSundayIndexedByZero: 2, // Tuesday
        startTimeInMinutes: 14 * 60, // 2 PM
        endTimeInMinutes: 16 * 60, // 4 PM
        intervalInMinutes: 60,
        monthlyRestriction: {
          occurrences: [1, 4] // Same: first and fourth Tuesday
        }
      }]
    }, { replaceObjectFields: true })

    // Use Eastern timezone dates for same period
    const easternFromDate = DateTime.now().setZone('America/New_York').plus({ days: 1 }).startOf('day')
    const easternToDate = easternFromDate.plus({ months: 4 })

    const crossTimezoneTestAvailability = await sdk.api.calendar_events.get_appointment_availability({
      calendarEventTemplateId: template.id,
      from: easternFromDate.toJSDate(),
      to: easternToDate.toJSDate(),
    })

    await async_test(
      'Monthly restriction calculations are consistent across timezones',
      () => Promise.resolve(crossTimezoneTestAvailability),
      { onResult: r => {
        const testUserBlocks = r.availabilityBlocks.filter(block => block.userId === sdk.userInfo.id)
        const pacificUserBlocks = timezoneTestAvailability.availabilityBlocks.filter(block => block.userId === sdk.userInfo.id)

        console.log(`Eastern: ${testUserBlocks.length} blocks, Pacific: ${pacificUserBlocks.length} blocks`)

        // Both should have the same number of qualifying blocks
        // (within a reasonable range due to different date windows)
        const blockCountDifference = Math.abs(testUserBlocks.length - pacificUserBlocks.length)
        if (blockCountDifference > 2) {
          console.log(`ERROR: Significant block count difference between timezones: ${blockCountDifference}`)
          return false
        }

        // Verify Eastern timezone blocks are also correct
        for (const block of testUserBlocks) {
          const blockDate = DateTime.fromMillis(block.startTimeInMS).setZone('America/New_York')

          if (blockDate.weekday !== 2) {
            console.log(`ERROR: Eastern block not on Tuesday: ${blockDate.toISO()}`)
            return false
          }

          // Calculate occurrence in Eastern timezone
          const startOfMonth = blockDate.startOf('month')
          let occurrence = 0
          let currentDay = startOfMonth

          while (currentDay.month === blockDate.month) {
            if (currentDay.weekday === 2) {
              occurrence++
              if (currentDay.day === blockDate.day) {
                break
              }
            }
            currentDay = currentDay.plus({ days: 1 })
          }

          if (![1, 4].includes(occurrence)) {
            console.log(`ERROR: Eastern block not 1st or 4th Tuesday: occurrence=${occurrence}`)
            return false
          }
        }

        console.log('✅ Monthly restriction calculations are consistent across timezones')
        return true
      }}
    )

  } finally {
    // Cleanup
    try {
      await sdk.api.calendar_event_templates.deleteOne(template.id)
      // Reset user availability
      await sdk.api.users.updateOne(sdk.userInfo.id, {
        weeklyAvailabilities: []
      }, { replaceObjectFields: true })
    } catch (error) {
      console.error('Cleanup error:', error)
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
    await monthly_availability_restrictions_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Monthly availability restrictions test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Monthly availability restrictions test suite failed:", error)
      process.exit(1)
    })
}