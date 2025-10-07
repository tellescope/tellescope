require('source-map-support').install();

import { Session, EnduserSession } from "../../sdk"
import {
  async_test,
  handleAnyError,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"
import { DateTime } from "luxon"
import { slot_violates_calendar_event_limits } from "@tellescope/utilities"
import { CalendarEventLimit } from "@tellescope/types-models"

const host = process.env.API_URL || 'http://localhost:8080' as const
const password = process.env.TEST_PASSWORD || ''
const businessId = process.env.BUSINESS_ID || ''

// === UNIT TESTS ===
// Pure function tests for slot_violates_calendar_event_limits logic

const TEMPLATE_ID = "template123"
const USER_ID = "user456"

const createEvent = (startTimeInMS: number, templateId = TEMPLATE_ID, userId = USER_ID) => ({
  startTimeInMS,
  templateId,
  attendees: [{ id: userId, type: 'user' as const }],
})

const assertEqual = (actual: any, expected: any, message: string) => {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected} but got ${actual}`)
  }
}

export const calendar_event_limits_unit_tests = () => {
  const tests: Array<{ name: string, fn: () => void }> = []

  // Test 1: No limits configured
  tests.push({
    name: 'No limits - should allow all slots',
    fn: () => {
      const result = slot_violates_calendar_event_limits({
        slotStartTimeInMS: Date.now(),
        templateId: TEMPLATE_ID,
        userId: USER_ID,
        calendarEventLimits: [],
        existingEvents: [],
        timezone: 'America/New_York',
      })
      assertEqual(result, false, 'Should allow slot when no limits configured')
    }
  })

  // Test 2: Limits for different template
  tests.push({
    name: 'Different template - should allow slot',
    fn: () => {
      const limits: CalendarEventLimit[] = [{
        templateId: 'different-template',
        period: 7,
        limit: 2,
      }]

      const result = slot_violates_calendar_event_limits({
        slotStartTimeInMS: Date.now(),
        templateId: TEMPLATE_ID,
        userId: USER_ID,
        calendarEventLimits: limits,
        existingEvents: [],
        timezone: 'America/New_York',
      })

      assertEqual(result, false, 'Should allow when limit is for different template')
    }
  })

  // Test 3: Calendar day limit - different days should allow
  tests.push({
    name: 'Different calendar days - should allow slot',
    fn: () => {
      // Oct 1, 2025 at 2pm ET
      const oct1_2pm = new Date('2025-10-01T18:00:00.000Z').getTime()
      // Oct 2, 2025 at 9am ET
      const oct2_9am = new Date('2025-10-02T13:00:00.000Z').getTime()

      const limits: CalendarEventLimit[] = [{
        templateId: TEMPLATE_ID,
        period: 1, // 1 calendar day
        limit: 1, // max 1 per day
      }]

      const existingEvents = [
        createEvent(oct1_2pm), // Event on Oct 1
      ]

      const result = slot_violates_calendar_event_limits({
        slotStartTimeInMS: oct2_9am, // Slot on Oct 2
        templateId: TEMPLATE_ID,
        userId: USER_ID,
        calendarEventLimits: limits,
        existingEvents,
        timezone: 'America/New_York',
      })

      assertEqual(result, false, 'Should allow when events are on different calendar days')
    }
  })

  // Test 4: Calendar day limit - same day should block
  tests.push({
    name: 'Same calendar day - should exclude slot',
    fn: () => {
      // Oct 1, 2025 at 9am ET
      const oct1_9am = new Date('2025-10-01T13:00:00.000Z').getTime()
      // Oct 1, 2025 at 2pm ET
      const oct1_2pm = new Date('2025-10-01T18:00:00.000Z').getTime()

      const limits: CalendarEventLimit[] = [{
        templateId: TEMPLATE_ID,
        period: 1, // 1 calendar day
        limit: 1, // max 1 per day
      }]

      const existingEvents = [
        createEvent(oct1_2pm), // Event later on Oct 1
      ]

      const result = slot_violates_calendar_event_limits({
        slotStartTimeInMS: oct1_9am, // Earlier slot on same day
        templateId: TEMPLATE_ID,
        userId: USER_ID,
        calendarEventLimits: limits,
        existingEvents,
        timezone: 'America/New_York',
      })

      assertEqual(result, true, 'Should exclude when on same calendar day')
    }
  })

  // Test 5: Calendar day limit - under limit allows slot
  tests.push({
    name: 'Under daily limit - should allow slot',
    fn: () => {
      // Oct 1, 2025 at 9am ET
      const oct1_9am = new Date('2025-10-01T13:00:00.000Z').getTime()
      // Oct 1, 2025 at 2pm ET
      const oct1_2pm = new Date('2025-10-01T18:00:00.000Z').getTime()

      const limits: CalendarEventLimit[] = [{
        templateId: TEMPLATE_ID,
        period: 1, // 1 calendar day
        limit: 2, // max 2 per day
      }]

      const existingEvents = [
        createEvent(oct1_9am), // 1 event on Oct 1
      ]

      const result = slot_violates_calendar_event_limits({
        slotStartTimeInMS: oct1_2pm, // Another slot on same day
        templateId: TEMPLATE_ID,
        userId: USER_ID,
        calendarEventLimits: limits,
        existingEvents,
        timezone: 'America/New_York',
      })

      assertEqual(result, false, 'Should allow when under daily limit')
    }
  })

  // Test 6: Weekly limit reached
  tests.push({
    name: 'Weekly limit reached - should exclude slot',
    fn: () => {
      // Oct 1, 2025 at 2pm ET
      const oct1 = new Date('2025-10-01T18:00:00.000Z').getTime()
      // Oct 3, 2025 at 2pm ET
      const oct3 = new Date('2025-10-03T18:00:00.000Z').getTime()
      // Oct 5, 2025 at 9am ET
      const oct5 = new Date('2025-10-05T13:00:00.000Z').getTime()

      const limits: CalendarEventLimit[] = [{
        templateId: TEMPLATE_ID,
        period: 7, // 7 days
        limit: 2, // max 2 per week
      }]

      const existingEvents = [
        createEvent(oct1),
        createEvent(oct3),
      ]

      const result = slot_violates_calendar_event_limits({
        slotStartTimeInMS: oct5, // Would be 3rd in the week
        templateId: TEMPLATE_ID,
        userId: USER_ID,
        calendarEventLimits: limits,
        existingEvents,
        timezone: 'America/New_York',
      })

      assertEqual(result, true, 'Should exclude when weekly limit reached')
    }
  })

  // Test 7: Events outside window don't count
  tests.push({
    name: 'Events outside window - should allow slot',
    fn: () => {
      // Sept 20, 2025
      const sept20 = new Date('2025-09-20T18:00:00.000Z').getTime()
      // Sept 22, 2025
      const sept22 = new Date('2025-09-22T18:00:00.000Z').getTime()
      // Oct 1, 2025
      const oct1 = new Date('2025-10-01T13:00:00.000Z').getTime()

      const limits: CalendarEventLimit[] = [{
        templateId: TEMPLATE_ID,
        period: 7, // 7 days
        limit: 2,
      }]

      const existingEvents = [
        createEvent(sept20), // More than 7 days ago
        createEvent(sept22), // More than 7 days ago
      ]

      const result = slot_violates_calendar_event_limits({
        slotStartTimeInMS: oct1,
        templateId: TEMPLATE_ID,
        userId: USER_ID,
        calendarEventLimits: limits,
        existingEvents,
        timezone: 'America/New_York',
      })

      assertEqual(result, false, 'Should allow when events are outside window')
    }
  })

  // Test 8: Different user's events don't count
  tests.push({
    name: 'Different user - should allow slot',
    fn: () => {
      const oct1 = new Date('2025-10-01T18:00:00.000Z').getTime()

      const limits: CalendarEventLimit[] = [{
        templateId: TEMPLATE_ID,
        period: 1,
        limit: 1,
      }]

      const existingEvents = [
        createEvent(oct1, TEMPLATE_ID, 'different-user'),
      ]

      const result = slot_violates_calendar_event_limits({
        slotStartTimeInMS: oct1,
        templateId: TEMPLATE_ID,
        userId: USER_ID,
        calendarEventLimits: limits,
        existingEvents,
        timezone: 'America/New_York',
      })

      assertEqual(result, false, 'Should allow when events are from different user')
    }
  })

  // Test 9: Different template events don't count
  tests.push({
    name: 'Different template - should allow slot',
    fn: () => {
      const oct1 = new Date('2025-10-01T18:00:00.000Z').getTime()

      const limits: CalendarEventLimit[] = [{
        templateId: TEMPLATE_ID,
        period: 1,
        limit: 1,
      }]

      const existingEvents = [
        createEvent(oct1, 'different-template', USER_ID),
      ]

      const result = slot_violates_calendar_event_limits({
        slotStartTimeInMS: oct1,
        templateId: TEMPLATE_ID,
        userId: USER_ID,
        calendarEventLimits: limits,
        existingEvents,
        timezone: 'America/New_York',
      })

      assertEqual(result, false, 'Should allow when events are from different template')
    }
  })

  // Test 10: Multiple limits - all must be satisfied
  tests.push({
    name: 'Multiple limits - should allow when all satisfied',
    fn: () => {
      // Oct 1, 2025 at 9am ET
      const oct1_9am = new Date('2025-10-01T13:00:00.000Z').getTime()
      // Oct 1, 2025 at 2pm ET
      const oct1_2pm = new Date('2025-10-01T18:00:00.000Z').getTime()

      const limits: CalendarEventLimit[] = [
        {
          templateId: TEMPLATE_ID,
          period: 1, // 1 day
          limit: 2,  // max 2 per day
        },
        {
          templateId: TEMPLATE_ID,
          period: 7, // 7 days
          limit: 3,  // max 3 per week
        }
      ]

      const existingEvents = [
        createEvent(oct1_9am),
      ]

      const result = slot_violates_calendar_event_limits({
        slotStartTimeInMS: oct1_2pm,
        templateId: TEMPLATE_ID,
        userId: USER_ID,
        calendarEventLimits: limits,
        existingEvents,
        timezone: 'America/New_York',
      })

      assertEqual(result, false, 'Should allow when all limits satisfied')
    }
  })

  // Test 11: Multiple limits - any violation blocks
  tests.push({
    name: 'Multiple limits - should exclude when any violated',
    fn: () => {
      // Oct 1, 2025 at 9am ET
      const oct1_9am = new Date('2025-10-01T13:00:00.000Z').getTime()
      // Oct 1, 2025 at 2pm ET
      const oct1_2pm = new Date('2025-10-01T18:00:00.000Z').getTime()

      const limits: CalendarEventLimit[] = [
        {
          templateId: TEMPLATE_ID,
          period: 1, // 1 day
          limit: 1,  // max 1 per day - THIS WILL BE VIOLATED
        },
        {
          templateId: TEMPLATE_ID,
          period: 7, // 7 days
          limit: 10, // max 10 per week - this is fine
        }
      ]

      const existingEvents = [
        createEvent(oct1_9am), // Already 1 event today
      ]

      const result = slot_violates_calendar_event_limits({
        slotStartTimeInMS: oct1_2pm, // Would be 2nd today
        templateId: TEMPLATE_ID,
        userId: USER_ID,
        calendarEventLimits: limits,
        existingEvents,
        timezone: 'America/New_York',
      })

      assertEqual(result, true, 'Should exclude when any limit violated')
    }
  })

  // Test 12: Timezone boundary test
  tests.push({
    name: 'Timezone boundaries - same day in user timezone',
    fn: () => {
      // Oct 2, 2025 at 12:30 AM ET = Oct 2, 2025 at 4:30 AM UTC
      const oct2_1230am_ET = new Date('2025-10-02T04:30:00.000Z').getTime()
      // Oct 2, 2025 at 11:30 PM ET = Oct 3, 2025 at 3:30 AM UTC
      const oct2_1130pm_ET = new Date('2025-10-03T03:30:00.000Z').getTime()

      const limits: CalendarEventLimit[] = [{
        templateId: TEMPLATE_ID,
        period: 1,
        limit: 1,
      }]

      const existingEvents = [
        createEvent(oct2_1230am_ET), // Oct 2 in ET (and UTC)
      ]

      const result = slot_violates_calendar_event_limits({
        slotStartTimeInMS: oct2_1130pm_ET, // Oct 2 in ET, Oct 3 in UTC
        templateId: TEMPLATE_ID,
        userId: USER_ID,
        calendarEventLimits: limits,
        existingEvents,
        timezone: 'America/New_York',
      })

      // Should exclude because both are Oct 2 in ET timezone (even though different days in UTC)
      assertEqual(result, true, 'Should use timezone for calendar day calculation')
    }
  })

  // Test 13: EDGE CASE - 7-day window exactly 7 days later (should allow)
  tests.push({
    name: '7-day window: exactly 7 days later - should allow',
    fn: () => {
      // Monday Oct 6, 2025 at 2pm ET (2 events on this Monday)
      const mon1_event1 = new Date('2025-10-06T18:00:00.000Z').getTime()
      const mon1_event2 = new Date('2025-10-06T19:00:00.000Z').getTime()
      // Monday Oct 13, 2025 at 9am ET (exactly 7 days later)
      const mon2_slot = new Date('2025-10-13T13:00:00.000Z').getTime()

      const limits: CalendarEventLimit[] = [{
        templateId: TEMPLATE_ID,
        period: 7, // 7 days
        limit: 2, // max 2 per 7 days
      }]

      const existingEvents = [
        createEvent(mon1_event1),
        createEvent(mon1_event2),
      ]

      const result = slot_violates_calendar_event_limits({
        slotStartTimeInMS: mon2_slot,
        templateId: TEMPLATE_ID,
        userId: USER_ID,
        calendarEventLimits: limits,
        existingEvents,
        timezone: 'America/New_York',
      })

      // Window for Mon Oct 13 = Oct 7-13 (7 days). Events on Oct 6 are OUTSIDE, should allow
      assertEqual(result, false, 'Should allow when events are exactly 7 days ago')
    }
  })

  // Test 14: EDGE CASE - 7-day window 6 days later (should block)
  tests.push({
    name: '7-day window: 6 days later - should exclude',
    fn: () => {
      // Monday Oct 6, 2025 at 2pm ET (2 events on this Monday)
      const mon_event1 = new Date('2025-10-06T18:00:00.000Z').getTime()
      const mon_event2 = new Date('2025-10-06T19:00:00.000Z').getTime()
      // Sunday Oct 12, 2025 at 9am ET (6 days later)
      const sun_slot = new Date('2025-10-12T13:00:00.000Z').getTime()

      const limits: CalendarEventLimit[] = [{
        templateId: TEMPLATE_ID,
        period: 7, // 7 days
        limit: 2, // max 2 per 7 days
      }]

      const existingEvents = [
        createEvent(mon_event1),
        createEvent(mon_event2),
      ]

      const result = slot_violates_calendar_event_limits({
        slotStartTimeInMS: sun_slot,
        templateId: TEMPLATE_ID,
        userId: USER_ID,
        calendarEventLimits: limits,
        existingEvents,
        timezone: 'America/New_York',
      })

      // Window for Sun Oct 12 = Oct 6-12 (7 days). Events on Oct 6 are INSIDE, should block
      assertEqual(result, true, 'Should exclude when events are within 7-day window')
    }
  })

  // Test 15: EDGE CASE - 7-day window with events spread across the period
  tests.push({
    name: '7-day window: events spread across period - should block correctly',
    fn: () => {
      // Oct 6 (Monday) - 1 event
      const oct6 = new Date('2025-10-06T18:00:00.000Z').getTime()
      // Oct 10 (Friday) - 1 event
      const oct10 = new Date('2025-10-10T18:00:00.000Z').getTime()
      // Oct 12 (Sunday) - checking slot
      const oct12 = new Date('2025-10-12T13:00:00.000Z').getTime()

      const limits: CalendarEventLimit[] = [{
        templateId: TEMPLATE_ID,
        period: 7,
        limit: 2,
      }]

      const existingEvents = [
        createEvent(oct6),
        createEvent(oct10),
      ]

      const result = slot_violates_calendar_event_limits({
        slotStartTimeInMS: oct12,
        templateId: TEMPLATE_ID,
        userId: USER_ID,
        calendarEventLimits: limits,
        existingEvents,
        timezone: 'America/New_York',
      })

      // Window for Oct 12 = Oct 6-12. Both Oct 6 and Oct 10 are in window, limit reached
      assertEqual(result, true, 'Should exclude when limit reached with events spread across window')
    }
  })

  // Test 16: EDGE CASE - Event on day 8 should not count in 7-day window
  tests.push({
    name: '7-day window: event on day 8 should not count',
    fn: () => {
      // Oct 5 (Sunday) - 2 events
      const oct5_event1 = new Date('2025-10-05T18:00:00.000Z').getTime()
      const oct5_event2 = new Date('2025-10-05T19:00:00.000Z').getTime()
      // Oct 13 (Monday) - checking slot (8 days after Oct 5)
      const oct13 = new Date('2025-10-13T13:00:00.000Z').getTime()

      const limits: CalendarEventLimit[] = [{
        templateId: TEMPLATE_ID,
        period: 7,
        limit: 2,
      }]

      const existingEvents = [
        createEvent(oct5_event1),
        createEvent(oct5_event2),
      ]

      const result = slot_violates_calendar_event_limits({
        slotStartTimeInMS: oct13,
        templateId: TEMPLATE_ID,
        userId: USER_ID,
        calendarEventLimits: limits,
        existingEvents,
        timezone: 'America/New_York',
      })

      // Window for Oct 13 = Oct 7-13. Events on Oct 5 (8 days ago) are OUTSIDE, should allow
      assertEqual(result, false, 'Should allow when events are 8 days ago (outside 7-day window)')
    }
  })

  // Test 17: EDGE CASE - Same day event should count in multi-day window
  tests.push({
    name: '7-day window: same day events count',
    fn: () => {
      // Oct 13 - 2 existing events
      const oct13_event1 = new Date('2025-10-13T14:00:00.000Z').getTime() // 10am ET
      const oct13_event2 = new Date('2025-10-13T18:00:00.000Z').getTime() // 2pm ET
      // Oct 13 - checking slot at 5pm ET
      const oct13_slot = new Date('2025-10-13T21:00:00.000Z').getTime()

      const limits: CalendarEventLimit[] = [{
        templateId: TEMPLATE_ID,
        period: 7,
        limit: 2,
      }]

      const existingEvents = [
        createEvent(oct13_event1),
        createEvent(oct13_event2),
      ]

      const result = slot_violates_calendar_event_limits({
        slotStartTimeInMS: oct13_slot,
        templateId: TEMPLATE_ID,
        userId: USER_ID,
        calendarEventLimits: limits,
        existingEvents,
        timezone: 'America/New_York',
      })

      // Window includes current day, both events on same day count toward limit
      assertEqual(result, true, 'Should exclude when limit reached with events on same day')
    }
  })

  // Test 18: EDGE CASE - Limit at exact boundary (1 event at 6 days ago)
  tests.push({
    name: '7-day window: boundary at day 6 - should count',
    fn: () => {
      // Oct 7 - 1 event
      const oct7 = new Date('2025-10-07T18:00:00.000Z').getTime()
      // Oct 13 - checking slot (6 days later)
      const oct13 = new Date('2025-10-13T13:00:00.000Z').getTime()

      const limits: CalendarEventLimit[] = [{
        templateId: TEMPLATE_ID,
        period: 7,
        limit: 1,
      }]

      const existingEvents = [
        createEvent(oct7),
      ]

      const result = slot_violates_calendar_event_limits({
        slotStartTimeInMS: oct13,
        templateId: TEMPLATE_ID,
        userId: USER_ID,
        calendarEventLimits: limits,
        existingEvents,
        timezone: 'America/New_York',
      })

      // Window for Oct 13 = Oct 7-13. Event on Oct 7 is at boundary (day 6 back), should count
      assertEqual(result, true, 'Should exclude when event is at 6-day boundary (within window)')
    }
  })

  // Test 19: EDGE CASE - 2-day period should include current day + 1 day back
  tests.push({
    name: '2-day window: includes current day and 1 day back',
    fn: () => {
      // Oct 12 - 1 event
      const oct12 = new Date('2025-10-12T18:00:00.000Z').getTime()
      // Oct 13 - checking slot (1 day later)
      const oct13 = new Date('2025-10-13T13:00:00.000Z').getTime()

      const limits: CalendarEventLimit[] = [{
        templateId: TEMPLATE_ID,
        period: 2, // 2 days = current day + 1 day back
        limit: 1,
      }]

      const existingEvents = [
        createEvent(oct12),
      ]

      const result = slot_violates_calendar_event_limits({
        slotStartTimeInMS: oct13,
        templateId: TEMPLATE_ID,
        userId: USER_ID,
        calendarEventLimits: limits,
        existingEvents,
        timezone: 'America/New_York',
      })

      // Window for Oct 13 = Oct 12-13 (2 days). Event on Oct 12 is in window, should block
      assertEqual(result, true, 'Should exclude for 2-day period with event 1 day ago')
    }
  })

  // Test 20: EDGE CASE - 2-day period, event 2 days ago should not count
  tests.push({
    name: '2-day window: event 2 days ago should not count',
    fn: () => {
      // Oct 11 - 1 event
      const oct11 = new Date('2025-10-11T18:00:00.000Z').getTime()
      // Oct 13 - checking slot (2 days later)
      const oct13 = new Date('2025-10-13T13:00:00.000Z').getTime()

      const limits: CalendarEventLimit[] = [{
        templateId: TEMPLATE_ID,
        period: 2, // 2 days = current day + 1 day back
        limit: 1,
      }]

      const existingEvents = [
        createEvent(oct11),
      ]

      const result = slot_violates_calendar_event_limits({
        slotStartTimeInMS: oct13,
        templateId: TEMPLATE_ID,
        userId: USER_ID,
        calendarEventLimits: limits,
        existingEvents,
        timezone: 'America/New_York',
      })

      // Window for Oct 13 = Oct 12-13 (2 days). Event on Oct 11 is OUTSIDE, should allow
      assertEqual(result, false, 'Should allow for 2-day period with event 2 days ago')
    }
  })

  return tests
}

// === INTEGRATION TESTS ===

// Main test function that can be called independently
export const calendar_event_limits_tests = async ({ sdk, sdkNonAdmin } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Calendar Event Limits Tests")

  // Run unit tests first
  log_header("Calendar Event Limits - Unit Tests")
  const unitTests = calendar_event_limits_unit_tests()
  for (const test of unitTests) {
    await async_test(test.name, () => Promise.resolve(test.fn()), {})
  }

  log_header("Calendar Event Limits - Integration Tests")

  // Create a calendar event template for testing (disable notifications)
  const template = await sdk.api.calendar_event_templates.createOne({
    title: 'Event Limit Test Appointment',
    durationInMinutes: 60,
    description: 'Test appointment for event limits',
    confirmationEmailDisabled: true,
    confirmationSMSDisabled: true,
    reminders: [], // No reminders
  })

  // Create test enduser without phone to prevent SMS notifications
  const testEnduser = await sdk.api.endusers.createOne({
    fname: 'Test',
    lname: 'Enduser Limits',
    email: 'test-limits-enduser@tellescope.com',
    // No phone to prevent SMS
  })
  await sdk.api.endusers.set_password({ id: testEnduser.id, password })

  try {
    // Setup: User has weekly availability Monday-Friday 9am-5pm
    await sdk.api.users.updateOne(sdk.userInfo.id, {
      weeklyAvailabilities: [
        {
          dayOfWeekStartingSundayIndexedByZero: 1, // Monday
          startTimeInMinutes: 9 * 60,
          endTimeInMinutes: 17 * 60,
          intervalInMinutes: 60,
        },
        {
          dayOfWeekStartingSundayIndexedByZero: 2, // Tuesday
          startTimeInMinutes: 9 * 60,
          endTimeInMinutes: 17 * 60,
          intervalInMinutes: 60,
        },
        {
          dayOfWeekStartingSundayIndexedByZero: 3, // Wednesday
          startTimeInMinutes: 9 * 60,
          endTimeInMinutes: 17 * 60,
          intervalInMinutes: 60,
        },
        {
          dayOfWeekStartingSundayIndexedByZero: 4, // Thursday
          startTimeInMinutes: 9 * 60,
          endTimeInMinutes: 17 * 60,
          intervalInMinutes: 60,
        },
        {
          dayOfWeekStartingSundayIndexedByZero: 5, // Friday
          startTimeInMinutes: 9 * 60,
          endTimeInMinutes: 17 * 60,
          intervalInMinutes: 60,
        },
      ],
      calendarEventLimits: [] // Start with no limits
    }, { replaceObjectFields: true })

    const now = DateTime.now().setZone('America/New_York')
    let nextMonday = now.startOf('week').plus({ days: 1 })

    if (nextMonday <= now) {
      nextMonday = nextMonday.plus({ weeks: 1 })
    }

    const fromDate = nextMonday
    const toDate = fromDate.plus({ weeks: 2 })

    // Test 1: No limits - should get full availability
    const noLimitsAvailability = await sdk.api.calendar_events.get_appointment_availability({
      calendarEventTemplateId: template.id,
      from: fromDate.toJSDate(),
      to: toDate.toJSDate(),
    })

    await async_test(
      'No limits - full availability returned',
      () => Promise.resolve(noLimitsAvailability),
      { onResult: r => {
        const userBlocks = r.availabilityBlocks.filter(b => b.userId === sdk.userInfo.id)
        console.log(`No limits: ${userBlocks.length} availability blocks`)

        if (userBlocks.length === 0) {
          console.log('ERROR: Expected some availability blocks with no limits')
          return false
        }

        return true
      }}
    )

    const baselineBlockCount = noLimitsAvailability.availabilityBlocks.filter(b => b.userId === sdk.userInfo.id).length

    // Test 2: Set limit to 1 per day - should restrict availability
    await sdk.api.users.updateOne(sdk.userInfo.id, {
      calendarEventLimits: [{
        templateId: template.id,
        period: 1, // 1 day
        limit: 1,
      }]
    }, { replaceObjectFields: true })

    const oneLimitAvailability = await sdk.api.calendar_events.get_appointment_availability({
      calendarEventTemplateId: template.id,
      from: fromDate.toJSDate(),
      to: toDate.toJSDate(),
    })

    await async_test(
      'Limit of 1 per day - availability still present before any bookings',
      () => Promise.resolve(oneLimitAvailability),
      { onResult: r => {
        const userBlocks = r.availabilityBlocks.filter(b => b.userId === sdk.userInfo.id)
        console.log(`With 1/day limit (no bookings): ${userBlocks.length} availability blocks`)

        // Should still have availability since no events are booked yet
        if (userBlocks.length === 0) {
          console.log('ERROR: Expected availability blocks before any bookings')
          return false
        }

        // Should have same availability as baseline before any bookings
        if (userBlocks.length !== baselineBlockCount) {
          console.log(`WARNING: Expected ${baselineBlockCount} blocks, got ${userBlocks.length}`)
        }

        return true
      }}
    )

    // Test 3: Book an event on Monday at 9am, then check availability
    const mondayNineAm = nextMonday.set({ hour: 9, minute: 0 })

    const bookedEvent = await sdk.api.calendar_events.createOne({
      title: 'Test Booking',
      startTimeInMS: mondayNineAm.toMillis(),
      durationInMinutes: 60,
      attendees: [{ type: 'user' as const, id: sdk.userInfo.id }],
      templateId: template.id,
    })

    // Small delay to ensure event is indexed
    await new Promise(resolve => setTimeout(resolve, 100))

    const availabilityAfterBooking = await sdk.api.calendar_events.get_appointment_availability({
      calendarEventTemplateId: template.id,
      from: fromDate.toJSDate(),
      to: toDate.toJSDate(),
    })

    await async_test(
      'After booking 1 event with 1/day limit - Monday availability removed',
      () => Promise.resolve(availabilityAfterBooking),
      { onResult: r => {
        const userBlocks = r.availabilityBlocks.filter(b => b.userId === sdk.userInfo.id)
        console.log(`After booking 1 event: ${userBlocks.length} availability blocks`)

        // Check that Monday slots are gone
        const mondayBlocks = userBlocks.filter(b => {
          const blockDate = DateTime.fromMillis(b.startTimeInMS).setZone('America/New_York')
          return blockDate.weekday === 1 && blockDate.hasSame(mondayNineAm, 'day')
        })

        if (mondayBlocks.length > 0) {
          console.log(`ERROR: Expected no Monday blocks after hitting limit, but found ${mondayBlocks.length}`)
          return false
        }

        // Should still have availability on other days
        const tuesdayBlocks = userBlocks.filter(b => {
          const blockDate = DateTime.fromMillis(b.startTimeInMS).setZone('America/New_York')
          return blockDate.weekday === 2
        })

        if (tuesdayBlocks.length === 0) {
          console.log('ERROR: Expected Tuesday availability to remain')
          return false
        }

        console.log('✅ Monday availability correctly removed, other days remain')
        return true
      }}
    )

    // Clean up the test event
    await sdk.api.calendar_events.deleteOne(bookedEvent.id)

    // Test 4: Weekly limit (7 days, limit 2)
    await sdk.api.users.updateOne(sdk.userInfo.id, {
      calendarEventLimits: [{
        templateId: template.id,
        period: 7, // 7 days (week)
        limit: 2,
      }]
    }, { replaceObjectFields: true })

    // Book two events in the same week
    const mondayEvent = await sdk.api.calendar_events.createOne({
      title: 'Monday Event',
      startTimeInMS: mondayNineAm.toMillis(),
      durationInMinutes: 60,
      attendees: [{ type: 'user' as const, id: sdk.userInfo.id }],
      templateId: template.id,
    })

    const tuesdayEvent = await sdk.api.calendar_events.createOne({
      title: 'Tuesday Event',
      startTimeInMS: mondayNineAm.plus({ days: 1 }).toMillis(),
      durationInMinutes: 60,
      attendees: [{ type: 'user' as const, id: sdk.userInfo.id }],
      templateId: template.id,
    })

    await new Promise(resolve => setTimeout(resolve, 100))

    const weeklyLimitAvailability = await sdk.api.calendar_events.get_appointment_availability({
      calendarEventTemplateId: template.id,
      from: fromDate.toJSDate(),
      to: toDate.toJSDate(),
    })

    await async_test(
      'Weekly limit (2/week) - availability removed after 2 bookings in the same week',
      () => Promise.resolve(weeklyLimitAvailability),
      { onResult: r => {
        const userBlocks = r.availabilityBlocks.filter(b => b.userId === sdk.userInfo.id)
        console.log(`After booking 2 events with 2/week limit: ${userBlocks.length} availability blocks`)

        // Find blocks in the first week (Monday-Sunday where events were booked)
        const firstWeekEnd = mondayNineAm.plus({ days: 7 })
        const firstWeekBlocks = userBlocks.filter(b => {
          const blockDate = DateTime.fromMillis(b.startTimeInMS).setZone('America/New_York')
          // Only check Wednesday onwards (Monday and Tuesday are booked)
          const wednesdayNineAm = mondayNineAm.plus({ days: 2 })
          return blockDate >= wednesdayNineAm && blockDate < firstWeekEnd
        })

        console.log(`First week (Wed-Sun): ${firstWeekBlocks.length} blocks`)

        // Wednesday-Friday of the first week should have NO availability
        // because Monday+Tuesday events are within the 7-day lookback window
        if (firstWeekBlocks.length > 0) {
          console.log(`ERROR: Expected no availability Wed-Sun of first week, but found ${firstWeekBlocks.length} blocks`)
          return false
        }

        // Should have availability in the next week (events are now 7+ days old)
        const nextWeekStart = mondayNineAm.plus({ weeks: 1 })
        const nextWeekBlocks = userBlocks.filter(b => {
          const blockDate = DateTime.fromMillis(b.startTimeInMS).setZone('America/New_York')
          return blockDate >= nextWeekStart
        })

        console.log(`Second week: ${nextWeekBlocks.length} blocks`)

        if (nextWeekBlocks.length === 0) {
          console.log('ERROR: Expected availability in second week (events are 7+ days old)')
          return false
        }

        console.log('✅ Weekly limit correctly enforced')
        return true
      }}
    )

    // Clean up
    await sdk.api.calendar_events.deleteOne(mondayEvent.id)
    await sdk.api.calendar_events.deleteOne(tuesdayEvent.id)

    // Test 5: Multiple limits - both daily and weekly
    await sdk.api.users.updateOne(sdk.userInfo.id, {
      calendarEventLimits: [
        {
          templateId: template.id,
          period: 1, // 1 day
          limit: 1,
        },
        {
          templateId: template.id,
          period: 7, // 7 days
          limit: 3,
        }
      ]
    }, { replaceObjectFields: true })

    // Book 3 events across 3 days
    const event1 = await sdk.api.calendar_events.createOne({
      title: 'Event 1',
      startTimeInMS: mondayNineAm.toMillis(),
      durationInMinutes: 60,
      attendees: [{ type: 'user' as const, id: sdk.userInfo.id }],
      templateId: template.id,
    })

    const event2 = await sdk.api.calendar_events.createOne({
      title: 'Event 2',
      startTimeInMS: mondayNineAm.plus({ days: 1 }).toMillis(),
      durationInMinutes: 60,
      attendees: [{ type: 'user' as const, id: sdk.userInfo.id }],
      templateId: template.id,
    })

    const event3 = await sdk.api.calendar_events.createOne({
      title: 'Event 3',
      startTimeInMS: mondayNineAm.plus({ days: 2 }).toMillis(),
      durationInMinutes: 60,
      attendees: [{ type: 'user' as const, id: sdk.userInfo.id }],
      templateId: template.id,
    })

    await new Promise(resolve => setTimeout(resolve, 100))

    const multipleLimitsAvailability = await sdk.api.calendar_events.get_appointment_availability({
      calendarEventTemplateId: template.id,
      from: fromDate.toJSDate(),
      to: toDate.toJSDate(),
    })

    await async_test(
      'Multiple limits (1/day and 3/week) - both constraints enforced',
      () => Promise.resolve(multipleLimitsAvailability),
      { onResult: r => {
        const userBlocks = r.availabilityBlocks.filter(b => b.userId === sdk.userInfo.id)
        console.log(`With multiple limits after 3 bookings: ${userBlocks.length} availability blocks`)

        // Find blocks in the same week as the bookings
        const sameWeekBlocks = userBlocks.filter(b => {
          const blockDate = DateTime.fromMillis(b.startTimeInMS).setZone('America/New_York')
          return blockDate >= mondayNineAm && blockDate < mondayNineAm.plus({ days: 7 })
        })

        // Should have no availability in the booking week (weekly limit of 3 hit)
        if (sameWeekBlocks.length > 0) {
          console.log(`ERROR: Expected no availability in week with 3 bookings, found ${sameWeekBlocks.length}`)
          return false
        }

        // Should have availability in the next week
        const nextWeekStart = mondayNineAm.plus({ weeks: 1 })
        const nextWeekBlocks = userBlocks.filter(b => {
          const blockDate = DateTime.fromMillis(b.startTimeInMS).setZone('America/New_York')
          return blockDate >= nextWeekStart
        })

        if (nextWeekBlocks.length === 0) {
          console.log('ERROR: Expected availability in next week')
          return false
        }

        console.log('✅ Multiple limits correctly enforced')
        return true
      }}
    )

    // Clean up
    await sdk.api.calendar_events.deleteOne(event1.id)
    await sdk.api.calendar_events.deleteOne(event2.id)
    await sdk.api.calendar_events.deleteOne(event3.id)

    // ========================================
    // NEW TESTS: book_appointment endpoint
    // ========================================
    log_header("Calendar Event Limits - book_appointment Integration Tests")

    // Reset user limits for book_appointment tests
    await sdk.api.users.updateOne(sdk.userInfo.id, {
      calendarEventLimits: [{
        templateId: template.id,
        period: 1, // 1 day
        limit: 2, // max 2 per day
      }]
    }, { replaceObjectFields: true })

    // Authenticate enduser for booking
    const enduserSession = new EnduserSession({ host, businessId })
    await enduserSession.authenticate('test-limits-enduser@tellescope.com', password)

    // Get next available Monday
    const nowForBooking = DateTime.now().setZone('America/New_York')
    let bookingMonday = nowForBooking.startOf('week').plus({ days: 1 })
    if (bookingMonday <= nowForBooking) {
      bookingMonday = bookingMonday.plus({ weeks: 1 })
    }
    const bookingFromDate = bookingMonday
    const bookingToDate = bookingFromDate.plus({ days: 1 }) // Just Monday

    // Test 6: book_appointment - first booking should succeed
    const availabilityBeforeBooking = await enduserSession.api.calendar_events.get_appointment_availability({
      calendarEventTemplateId: template.id,
      userId: sdk.userInfo.id,
      from: bookingFromDate.toJSDate(),
      to: bookingToDate.toJSDate(),
    })

    await async_test(
      'book_appointment: availability shows slots before any bookings',
      () => Promise.resolve(availabilityBeforeBooking),
      { onResult: r => {
        const userBlocks = r.availabilityBlocks.filter(b => b.userId === sdk.userInfo.id)
        console.log(`Availability before booking: ${userBlocks.length} blocks`)

        if (userBlocks.length === 0) {
          console.log('ERROR: Expected availability blocks for booking')
          return false
        }

        return true
      }}
    )

    const firstSlot = availabilityBeforeBooking.availabilityBlocks.find(b => b.userId === sdk.userInfo.id)!
    const firstSlotTime = bookingMonday.set({ hour: 9, minute: 0 })

    const booking1Response = await enduserSession.api.calendar_events.book_appointment({
      userId: sdk.userInfo.id,
      calendarEventTemplateId: template.id,
      startTime: firstSlotTime.toJSDate(),
      timezone: 'America/New_York',
    })
    await async_test(
      'book_appointment: first booking succeeds with calendarEventLimits',
      () => Promise.resolve(booking1Response),
      { onResult: r => {
        if (!r || !r.createdEvent?.id) {
          console.log('ERROR: First booking should succeed')
          return false
        }
        console.log('✅ First booking succeeded:', r.createdEvent.id)
        return true
      }}
    )
    const booking1 = booking1Response.createdEvent

    // Small delay to ensure event is indexed
    await new Promise(resolve => setTimeout(resolve, 100))

    // Test 7: book_appointment - second booking on same day should succeed (limit is 2)
    const secondSlotTime = firstSlotTime.plus({ hours: 1 })

    const booking2Response = await enduserSession.api.calendar_events.book_appointment({
      userId: sdk.userInfo.id,
      calendarEventTemplateId: template.id,
      startTime: secondSlotTime.toJSDate(),
      timezone: 'America/New_York',
    })
    await async_test(
      'book_appointment: second booking on same day succeeds (under limit of 2)',
      () => Promise.resolve(booking2Response),
      { onResult: r => {
        if (!r || !r.createdEvent?.id) {
          console.log('ERROR: Second booking should succeed (limit is 2/day)')
          return false
        }
        console.log('✅ Second booking succeeded:', r.createdEvent.id)
        return true
      }}
    )
    const booking2 = booking2Response.createdEvent

    await new Promise(resolve => setTimeout(resolve, 100))

    // Test 8: book_appointment - third booking on same day should fail (limit reached)
    const thirdSlotTime = secondSlotTime.plus({ hours: 1 })

    await async_test(
      'book_appointment: third booking on same day fails (limit of 2 reached)',
      () => enduserSession.api.calendar_events.book_appointment({
        userId: sdk.userInfo.id,
        calendarEventTemplateId: template.id,
        startTime: thirdSlotTime.toJSDate(),
        timezone: 'America/New_York',
      }),
      handleAnyError
    )

    // Test 9: book_appointment - booking on different day should succeed
    const tuesdaySlotTime = firstSlotTime.plus({ days: 1 })

    const booking3Response = await enduserSession.api.calendar_events.book_appointment({
      userId: sdk.userInfo.id,
      calendarEventTemplateId: template.id,
      startTime: tuesdaySlotTime.toJSDate(),
      timezone: 'America/New_York',
    })
    await async_test(
      'book_appointment: booking on different day succeeds (new daily limit)',
      () => Promise.resolve(booking3Response),
      { onResult: r => {
        if (!r || !r.createdEvent?.id) {
          console.log('ERROR: Tuesday booking should succeed (new day, new limit)')
          return false
        }
        console.log('✅ Tuesday booking succeeded:', r.createdEvent.id)
        return true
      }}
    )
    const booking3 = booking3Response.createdEvent

    // Clean up book_appointment test events
    if (booking1?.id) await sdk.api.calendar_events.deleteOne(booking1.id).catch(() => {})
    if (booking2?.id) await sdk.api.calendar_events.deleteOne(booking2.id).catch(() => {})
    if (booking3?.id) await sdk.api.calendar_events.deleteOne(booking3.id).catch(() => {})

    // Test 10: Weekly limit with book_appointment
    await sdk.api.users.updateOne(sdk.userInfo.id, {
      calendarEventLimits: [{
        templateId: template.id,
        period: 7, // 7 days
        limit: 2, // max 2 per week
      }]
    }, { replaceObjectFields: true })

    const weeklyMonday = bookingMonday.plus({ weeks: 2 }) // Use a fresh week
    const weeklyMondaySlot1 = weeklyMonday.set({ hour: 9, minute: 0 })
    const weeklyMondaySlot2 = weeklyMonday.set({ hour: 10, minute: 0 })
    const weeklyTuesdaySlot = weeklyMonday.plus({ days: 1 }).set({ hour: 9, minute: 0 })

    const weeklyBooking1Response = await enduserSession.api.calendar_events.book_appointment({
      userId: sdk.userInfo.id,
      calendarEventTemplateId: template.id,
      startTime: weeklyMondaySlot1.toJSDate(),
      timezone: 'America/New_York',
    })
    await async_test(
      'book_appointment: weekly limit - first booking succeeds',
      () => Promise.resolve(weeklyBooking1Response),
      { onResult: r => {
        if (!r?.createdEvent?.id) {
          console.log('ERROR: First weekly booking should succeed')
          return false
        }
        console.log('✅ First weekly booking succeeded')
        return true
      }}
    )
    const weeklyBooking1 = weeklyBooking1Response.createdEvent

    await new Promise(resolve => setTimeout(resolve, 100))

    const weeklyBooking2Response = await enduserSession.api.calendar_events.book_appointment({
      userId: sdk.userInfo.id,
      calendarEventTemplateId: template.id,
      startTime: weeklyMondaySlot2.toJSDate(),
      timezone: 'America/New_York',
    })
    await async_test(
      'book_appointment: weekly limit - second booking in same week succeeds',
      () => Promise.resolve(weeklyBooking2Response),
      { onResult: r => {
        if (!r?.createdEvent?.id) {
          console.log('ERROR: Second weekly booking should succeed (limit is 2/week)')
          return false
        }
        console.log('✅ Second weekly booking succeeded')
        return true
      }}
    )
    const weeklyBooking2 = weeklyBooking2Response.createdEvent

    await new Promise(resolve => setTimeout(resolve, 100))

    await async_test(
      'book_appointment: weekly limit - third booking in same week fails',
      () => enduserSession.api.calendar_events.book_appointment({
        userId: sdk.userInfo.id,
        calendarEventTemplateId: template.id,
        startTime: weeklyTuesdaySlot.toJSDate(),
        timezone: 'America/New_York',
      }),
      handleAnyError
    )

    // Clean up weekly test events
    if (weeklyBooking1?.id) await sdk.api.calendar_events.deleteOne(weeklyBooking1.id).catch(() => {})
    if (weeklyBooking2?.id) await sdk.api.calendar_events.deleteOne(weeklyBooking2.id).catch(() => {})

  } finally {
    // Cleanup
    try {
      await sdk.api.calendar_event_templates.deleteOne(template.id)
      await sdk.api.endusers.deleteOne(testEnduser.id)
      await sdk.api.users.updateOne(sdk.userInfo.id, {
        weeklyAvailabilities: [],
        calendarEventLimits: []
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
    await calendar_event_limits_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Calendar event limits test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Calendar event limits test suite failed:", error)
      process.exit(1)
    })
}
