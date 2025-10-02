var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
require('source-map-support').install();
import { Session } from "../../sdk";
import { async_test, log_header, } from "@tellescope/testing";
import { setup_tests } from "../setup";
import { DateTime } from "luxon";
import { slot_violates_calendar_event_limits } from "@tellescope/utilities";
var host = process.env.API_URL || 'http://localhost:8080';
// === UNIT TESTS ===
// Pure function tests for slot_violates_calendar_event_limits logic
var TEMPLATE_ID = "template123";
var USER_ID = "user456";
var createEvent = function (startTimeInMS, templateId, userId) {
    if (templateId === void 0) { templateId = TEMPLATE_ID; }
    if (userId === void 0) { userId = USER_ID; }
    return ({
        startTimeInMS: startTimeInMS,
        templateId: templateId,
        attendees: [{ id: userId, type: 'user' }],
    });
};
var assertEqual = function (actual, expected, message) {
    if (actual !== expected) {
        throw new Error("".concat(message, ": expected ").concat(expected, " but got ").concat(actual));
    }
};
export var calendar_event_limits_unit_tests = function () {
    var tests = [];
    // Test 1: No limits configured
    tests.push({
        name: 'No limits - should allow all slots',
        fn: function () {
            var result = slot_violates_calendar_event_limits({
                slotStartTimeInMS: Date.now(),
                templateId: TEMPLATE_ID,
                userId: USER_ID,
                calendarEventLimits: [],
                existingEvents: [],
                timezone: 'America/New_York',
            });
            assertEqual(result, false, 'Should allow slot when no limits configured');
        }
    });
    // Test 2: Limits for different template
    tests.push({
        name: 'Different template - should allow slot',
        fn: function () {
            var limits = [{
                    templateId: 'different-template',
                    period: 7,
                    limit: 2,
                }];
            var result = slot_violates_calendar_event_limits({
                slotStartTimeInMS: Date.now(),
                templateId: TEMPLATE_ID,
                userId: USER_ID,
                calendarEventLimits: limits,
                existingEvents: [],
                timezone: 'America/New_York',
            });
            assertEqual(result, false, 'Should allow when limit is for different template');
        }
    });
    // Test 3: Calendar day limit - different days should allow
    tests.push({
        name: 'Different calendar days - should allow slot',
        fn: function () {
            // Oct 1, 2025 at 2pm ET
            var oct1_2pm = new Date('2025-10-01T18:00:00.000Z').getTime();
            // Oct 2, 2025 at 9am ET
            var oct2_9am = new Date('2025-10-02T13:00:00.000Z').getTime();
            var limits = [{
                    templateId: TEMPLATE_ID,
                    period: 1,
                    limit: 1, // max 1 per day
                }];
            var existingEvents = [
                createEvent(oct1_2pm), // Event on Oct 1
            ];
            var result = slot_violates_calendar_event_limits({
                slotStartTimeInMS: oct2_9am,
                templateId: TEMPLATE_ID,
                userId: USER_ID,
                calendarEventLimits: limits,
                existingEvents: existingEvents,
                timezone: 'America/New_York',
            });
            assertEqual(result, false, 'Should allow when events are on different calendar days');
        }
    });
    // Test 4: Calendar day limit - same day should block
    tests.push({
        name: 'Same calendar day - should exclude slot',
        fn: function () {
            // Oct 1, 2025 at 9am ET
            var oct1_9am = new Date('2025-10-01T13:00:00.000Z').getTime();
            // Oct 1, 2025 at 2pm ET
            var oct1_2pm = new Date('2025-10-01T18:00:00.000Z').getTime();
            var limits = [{
                    templateId: TEMPLATE_ID,
                    period: 1,
                    limit: 1, // max 1 per day
                }];
            var existingEvents = [
                createEvent(oct1_2pm), // Event later on Oct 1
            ];
            var result = slot_violates_calendar_event_limits({
                slotStartTimeInMS: oct1_9am,
                templateId: TEMPLATE_ID,
                userId: USER_ID,
                calendarEventLimits: limits,
                existingEvents: existingEvents,
                timezone: 'America/New_York',
            });
            assertEqual(result, true, 'Should exclude when on same calendar day');
        }
    });
    // Test 5: Calendar day limit - under limit allows slot
    tests.push({
        name: 'Under daily limit - should allow slot',
        fn: function () {
            // Oct 1, 2025 at 9am ET
            var oct1_9am = new Date('2025-10-01T13:00:00.000Z').getTime();
            // Oct 1, 2025 at 2pm ET
            var oct1_2pm = new Date('2025-10-01T18:00:00.000Z').getTime();
            var limits = [{
                    templateId: TEMPLATE_ID,
                    period: 1,
                    limit: 2, // max 2 per day
                }];
            var existingEvents = [
                createEvent(oct1_9am), // 1 event on Oct 1
            ];
            var result = slot_violates_calendar_event_limits({
                slotStartTimeInMS: oct1_2pm,
                templateId: TEMPLATE_ID,
                userId: USER_ID,
                calendarEventLimits: limits,
                existingEvents: existingEvents,
                timezone: 'America/New_York',
            });
            assertEqual(result, false, 'Should allow when under daily limit');
        }
    });
    // Test 6: Weekly limit reached
    tests.push({
        name: 'Weekly limit reached - should exclude slot',
        fn: function () {
            // Oct 1, 2025 at 2pm ET
            var oct1 = new Date('2025-10-01T18:00:00.000Z').getTime();
            // Oct 3, 2025 at 2pm ET
            var oct3 = new Date('2025-10-03T18:00:00.000Z').getTime();
            // Oct 5, 2025 at 9am ET
            var oct5 = new Date('2025-10-05T13:00:00.000Z').getTime();
            var limits = [{
                    templateId: TEMPLATE_ID,
                    period: 7,
                    limit: 2, // max 2 per week
                }];
            var existingEvents = [
                createEvent(oct1),
                createEvent(oct3),
            ];
            var result = slot_violates_calendar_event_limits({
                slotStartTimeInMS: oct5,
                templateId: TEMPLATE_ID,
                userId: USER_ID,
                calendarEventLimits: limits,
                existingEvents: existingEvents,
                timezone: 'America/New_York',
            });
            assertEqual(result, true, 'Should exclude when weekly limit reached');
        }
    });
    // Test 7: Events outside window don't count
    tests.push({
        name: 'Events outside window - should allow slot',
        fn: function () {
            // Sept 20, 2025
            var sept20 = new Date('2025-09-20T18:00:00.000Z').getTime();
            // Sept 22, 2025
            var sept22 = new Date('2025-09-22T18:00:00.000Z').getTime();
            // Oct 1, 2025
            var oct1 = new Date('2025-10-01T13:00:00.000Z').getTime();
            var limits = [{
                    templateId: TEMPLATE_ID,
                    period: 7,
                    limit: 2,
                }];
            var existingEvents = [
                createEvent(sept20),
                createEvent(sept22), // More than 7 days ago
            ];
            var result = slot_violates_calendar_event_limits({
                slotStartTimeInMS: oct1,
                templateId: TEMPLATE_ID,
                userId: USER_ID,
                calendarEventLimits: limits,
                existingEvents: existingEvents,
                timezone: 'America/New_York',
            });
            assertEqual(result, false, 'Should allow when events are outside window');
        }
    });
    // Test 8: Different user's events don't count
    tests.push({
        name: 'Different user - should allow slot',
        fn: function () {
            var oct1 = new Date('2025-10-01T18:00:00.000Z').getTime();
            var limits = [{
                    templateId: TEMPLATE_ID,
                    period: 1,
                    limit: 1,
                }];
            var existingEvents = [
                createEvent(oct1, TEMPLATE_ID, 'different-user'),
            ];
            var result = slot_violates_calendar_event_limits({
                slotStartTimeInMS: oct1,
                templateId: TEMPLATE_ID,
                userId: USER_ID,
                calendarEventLimits: limits,
                existingEvents: existingEvents,
                timezone: 'America/New_York',
            });
            assertEqual(result, false, 'Should allow when events are from different user');
        }
    });
    // Test 9: Different template events don't count
    tests.push({
        name: 'Different template - should allow slot',
        fn: function () {
            var oct1 = new Date('2025-10-01T18:00:00.000Z').getTime();
            var limits = [{
                    templateId: TEMPLATE_ID,
                    period: 1,
                    limit: 1,
                }];
            var existingEvents = [
                createEvent(oct1, 'different-template', USER_ID),
            ];
            var result = slot_violates_calendar_event_limits({
                slotStartTimeInMS: oct1,
                templateId: TEMPLATE_ID,
                userId: USER_ID,
                calendarEventLimits: limits,
                existingEvents: existingEvents,
                timezone: 'America/New_York',
            });
            assertEqual(result, false, 'Should allow when events are from different template');
        }
    });
    // Test 10: Multiple limits - all must be satisfied
    tests.push({
        name: 'Multiple limits - should allow when all satisfied',
        fn: function () {
            // Oct 1, 2025 at 9am ET
            var oct1_9am = new Date('2025-10-01T13:00:00.000Z').getTime();
            // Oct 1, 2025 at 2pm ET
            var oct1_2pm = new Date('2025-10-01T18:00:00.000Z').getTime();
            var limits = [
                {
                    templateId: TEMPLATE_ID,
                    period: 1,
                    limit: 2, // max 2 per day
                },
                {
                    templateId: TEMPLATE_ID,
                    period: 7,
                    limit: 3, // max 3 per week
                }
            ];
            var existingEvents = [
                createEvent(oct1_9am),
            ];
            var result = slot_violates_calendar_event_limits({
                slotStartTimeInMS: oct1_2pm,
                templateId: TEMPLATE_ID,
                userId: USER_ID,
                calendarEventLimits: limits,
                existingEvents: existingEvents,
                timezone: 'America/New_York',
            });
            assertEqual(result, false, 'Should allow when all limits satisfied');
        }
    });
    // Test 11: Multiple limits - any violation blocks
    tests.push({
        name: 'Multiple limits - should exclude when any violated',
        fn: function () {
            // Oct 1, 2025 at 9am ET
            var oct1_9am = new Date('2025-10-01T13:00:00.000Z').getTime();
            // Oct 1, 2025 at 2pm ET
            var oct1_2pm = new Date('2025-10-01T18:00:00.000Z').getTime();
            var limits = [
                {
                    templateId: TEMPLATE_ID,
                    period: 1,
                    limit: 1, // max 1 per day - THIS WILL BE VIOLATED
                },
                {
                    templateId: TEMPLATE_ID,
                    period: 7,
                    limit: 10, // max 10 per week - this is fine
                }
            ];
            var existingEvents = [
                createEvent(oct1_9am), // Already 1 event today
            ];
            var result = slot_violates_calendar_event_limits({
                slotStartTimeInMS: oct1_2pm,
                templateId: TEMPLATE_ID,
                userId: USER_ID,
                calendarEventLimits: limits,
                existingEvents: existingEvents,
                timezone: 'America/New_York',
            });
            assertEqual(result, true, 'Should exclude when any limit violated');
        }
    });
    // Test 12: Timezone boundary test
    tests.push({
        name: 'Timezone boundaries - same day in user timezone',
        fn: function () {
            // Oct 2, 2025 at 12:30 AM ET = Oct 2, 2025 at 4:30 AM UTC
            var oct2_1230am_ET = new Date('2025-10-02T04:30:00.000Z').getTime();
            // Oct 2, 2025 at 11:30 PM ET = Oct 3, 2025 at 3:30 AM UTC
            var oct2_1130pm_ET = new Date('2025-10-03T03:30:00.000Z').getTime();
            var limits = [{
                    templateId: TEMPLATE_ID,
                    period: 1,
                    limit: 1,
                }];
            var existingEvents = [
                createEvent(oct2_1230am_ET), // Oct 2 in ET (and UTC)
            ];
            var result = slot_violates_calendar_event_limits({
                slotStartTimeInMS: oct2_1130pm_ET,
                templateId: TEMPLATE_ID,
                userId: USER_ID,
                calendarEventLimits: limits,
                existingEvents: existingEvents,
                timezone: 'America/New_York',
            });
            // Should exclude because both are Oct 2 in ET timezone (even though different days in UTC)
            assertEqual(result, true, 'Should use timezone for calendar day calculation');
        }
    });
    // Test 13: EDGE CASE - 7-day window exactly 7 days later (should allow)
    tests.push({
        name: '7-day window: exactly 7 days later - should allow',
        fn: function () {
            // Monday Oct 6, 2025 at 2pm ET (2 events on this Monday)
            var mon1_event1 = new Date('2025-10-06T18:00:00.000Z').getTime();
            var mon1_event2 = new Date('2025-10-06T19:00:00.000Z').getTime();
            // Monday Oct 13, 2025 at 9am ET (exactly 7 days later)
            var mon2_slot = new Date('2025-10-13T13:00:00.000Z').getTime();
            var limits = [{
                    templateId: TEMPLATE_ID,
                    period: 7,
                    limit: 2, // max 2 per 7 days
                }];
            var existingEvents = [
                createEvent(mon1_event1),
                createEvent(mon1_event2),
            ];
            var result = slot_violates_calendar_event_limits({
                slotStartTimeInMS: mon2_slot,
                templateId: TEMPLATE_ID,
                userId: USER_ID,
                calendarEventLimits: limits,
                existingEvents: existingEvents,
                timezone: 'America/New_York',
            });
            // Window for Mon Oct 13 = Oct 7-13 (7 days). Events on Oct 6 are OUTSIDE, should allow
            assertEqual(result, false, 'Should allow when events are exactly 7 days ago');
        }
    });
    // Test 14: EDGE CASE - 7-day window 6 days later (should block)
    tests.push({
        name: '7-day window: 6 days later - should exclude',
        fn: function () {
            // Monday Oct 6, 2025 at 2pm ET (2 events on this Monday)
            var mon_event1 = new Date('2025-10-06T18:00:00.000Z').getTime();
            var mon_event2 = new Date('2025-10-06T19:00:00.000Z').getTime();
            // Sunday Oct 12, 2025 at 9am ET (6 days later)
            var sun_slot = new Date('2025-10-12T13:00:00.000Z').getTime();
            var limits = [{
                    templateId: TEMPLATE_ID,
                    period: 7,
                    limit: 2, // max 2 per 7 days
                }];
            var existingEvents = [
                createEvent(mon_event1),
                createEvent(mon_event2),
            ];
            var result = slot_violates_calendar_event_limits({
                slotStartTimeInMS: sun_slot,
                templateId: TEMPLATE_ID,
                userId: USER_ID,
                calendarEventLimits: limits,
                existingEvents: existingEvents,
                timezone: 'America/New_York',
            });
            // Window for Sun Oct 12 = Oct 6-12 (7 days). Events on Oct 6 are INSIDE, should block
            assertEqual(result, true, 'Should exclude when events are within 7-day window');
        }
    });
    // Test 15: EDGE CASE - 7-day window with events spread across the period
    tests.push({
        name: '7-day window: events spread across period - should block correctly',
        fn: function () {
            // Oct 6 (Monday) - 1 event
            var oct6 = new Date('2025-10-06T18:00:00.000Z').getTime();
            // Oct 10 (Friday) - 1 event
            var oct10 = new Date('2025-10-10T18:00:00.000Z').getTime();
            // Oct 12 (Sunday) - checking slot
            var oct12 = new Date('2025-10-12T13:00:00.000Z').getTime();
            var limits = [{
                    templateId: TEMPLATE_ID,
                    period: 7,
                    limit: 2,
                }];
            var existingEvents = [
                createEvent(oct6),
                createEvent(oct10),
            ];
            var result = slot_violates_calendar_event_limits({
                slotStartTimeInMS: oct12,
                templateId: TEMPLATE_ID,
                userId: USER_ID,
                calendarEventLimits: limits,
                existingEvents: existingEvents,
                timezone: 'America/New_York',
            });
            // Window for Oct 12 = Oct 6-12. Both Oct 6 and Oct 10 are in window, limit reached
            assertEqual(result, true, 'Should exclude when limit reached with events spread across window');
        }
    });
    // Test 16: EDGE CASE - Event on day 8 should not count in 7-day window
    tests.push({
        name: '7-day window: event on day 8 should not count',
        fn: function () {
            // Oct 5 (Sunday) - 2 events
            var oct5_event1 = new Date('2025-10-05T18:00:00.000Z').getTime();
            var oct5_event2 = new Date('2025-10-05T19:00:00.000Z').getTime();
            // Oct 13 (Monday) - checking slot (8 days after Oct 5)
            var oct13 = new Date('2025-10-13T13:00:00.000Z').getTime();
            var limits = [{
                    templateId: TEMPLATE_ID,
                    period: 7,
                    limit: 2,
                }];
            var existingEvents = [
                createEvent(oct5_event1),
                createEvent(oct5_event2),
            ];
            var result = slot_violates_calendar_event_limits({
                slotStartTimeInMS: oct13,
                templateId: TEMPLATE_ID,
                userId: USER_ID,
                calendarEventLimits: limits,
                existingEvents: existingEvents,
                timezone: 'America/New_York',
            });
            // Window for Oct 13 = Oct 7-13. Events on Oct 5 (8 days ago) are OUTSIDE, should allow
            assertEqual(result, false, 'Should allow when events are 8 days ago (outside 7-day window)');
        }
    });
    // Test 17: EDGE CASE - Same day event should count in multi-day window
    tests.push({
        name: '7-day window: same day events count',
        fn: function () {
            // Oct 13 - 2 existing events
            var oct13_event1 = new Date('2025-10-13T14:00:00.000Z').getTime(); // 10am ET
            var oct13_event2 = new Date('2025-10-13T18:00:00.000Z').getTime(); // 2pm ET
            // Oct 13 - checking slot at 5pm ET
            var oct13_slot = new Date('2025-10-13T21:00:00.000Z').getTime();
            var limits = [{
                    templateId: TEMPLATE_ID,
                    period: 7,
                    limit: 2,
                }];
            var existingEvents = [
                createEvent(oct13_event1),
                createEvent(oct13_event2),
            ];
            var result = slot_violates_calendar_event_limits({
                slotStartTimeInMS: oct13_slot,
                templateId: TEMPLATE_ID,
                userId: USER_ID,
                calendarEventLimits: limits,
                existingEvents: existingEvents,
                timezone: 'America/New_York',
            });
            // Window includes current day, both events on same day count toward limit
            assertEqual(result, true, 'Should exclude when limit reached with events on same day');
        }
    });
    // Test 18: EDGE CASE - Limit at exact boundary (1 event at 6 days ago)
    tests.push({
        name: '7-day window: boundary at day 6 - should count',
        fn: function () {
            // Oct 7 - 1 event
            var oct7 = new Date('2025-10-07T18:00:00.000Z').getTime();
            // Oct 13 - checking slot (6 days later)
            var oct13 = new Date('2025-10-13T13:00:00.000Z').getTime();
            var limits = [{
                    templateId: TEMPLATE_ID,
                    period: 7,
                    limit: 1,
                }];
            var existingEvents = [
                createEvent(oct7),
            ];
            var result = slot_violates_calendar_event_limits({
                slotStartTimeInMS: oct13,
                templateId: TEMPLATE_ID,
                userId: USER_ID,
                calendarEventLimits: limits,
                existingEvents: existingEvents,
                timezone: 'America/New_York',
            });
            // Window for Oct 13 = Oct 7-13. Event on Oct 7 is at boundary (day 6 back), should count
            assertEqual(result, true, 'Should exclude when event is at 6-day boundary (within window)');
        }
    });
    // Test 19: EDGE CASE - 2-day period should include current day + 1 day back
    tests.push({
        name: '2-day window: includes current day and 1 day back',
        fn: function () {
            // Oct 12 - 1 event
            var oct12 = new Date('2025-10-12T18:00:00.000Z').getTime();
            // Oct 13 - checking slot (1 day later)
            var oct13 = new Date('2025-10-13T13:00:00.000Z').getTime();
            var limits = [{
                    templateId: TEMPLATE_ID,
                    period: 2,
                    limit: 1,
                }];
            var existingEvents = [
                createEvent(oct12),
            ];
            var result = slot_violates_calendar_event_limits({
                slotStartTimeInMS: oct13,
                templateId: TEMPLATE_ID,
                userId: USER_ID,
                calendarEventLimits: limits,
                existingEvents: existingEvents,
                timezone: 'America/New_York',
            });
            // Window for Oct 13 = Oct 12-13 (2 days). Event on Oct 12 is in window, should block
            assertEqual(result, true, 'Should exclude for 2-day period with event 1 day ago');
        }
    });
    // Test 20: EDGE CASE - 2-day period, event 2 days ago should not count
    tests.push({
        name: '2-day window: event 2 days ago should not count',
        fn: function () {
            // Oct 11 - 1 event
            var oct11 = new Date('2025-10-11T18:00:00.000Z').getTime();
            // Oct 13 - checking slot (2 days later)
            var oct13 = new Date('2025-10-13T13:00:00.000Z').getTime();
            var limits = [{
                    templateId: TEMPLATE_ID,
                    period: 2,
                    limit: 1,
                }];
            var existingEvents = [
                createEvent(oct11),
            ];
            var result = slot_violates_calendar_event_limits({
                slotStartTimeInMS: oct13,
                templateId: TEMPLATE_ID,
                userId: USER_ID,
                calendarEventLimits: limits,
                existingEvents: existingEvents,
                timezone: 'America/New_York',
            });
            // Window for Oct 13 = Oct 12-13 (2 days). Event on Oct 11 is OUTSIDE, should allow
            assertEqual(result, false, 'Should allow for 2-day period with event 2 days ago');
        }
    });
    return tests;
};
// === INTEGRATION TESTS ===
// Main test function that can be called independently
export var calendar_event_limits_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var unitTests, _loop_1, _i, unitTests_1, test_1, template, now, nextMonday, fromDate, toDate, noLimitsAvailability_1, baselineBlockCount_1, oneLimitAvailability_1, mondayNineAm_1, bookedEvent, availabilityAfterBooking_1, mondayEvent, tuesdayEvent, weeklyLimitAvailability_1, event1, event2, event3, multipleLimitsAvailability_1, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_header("Calendar Event Limits Tests");
                    // Run unit tests first
                    log_header("Calendar Event Limits - Unit Tests");
                    unitTests = calendar_event_limits_unit_tests();
                    _loop_1 = function (test_1) {
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, async_test(test_1.name, function () { return Promise.resolve(test_1.fn()); }, {})];
                                case 1:
                                    _c.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, unitTests_1 = unitTests;
                    _b.label = 1;
                case 1:
                    if (!(_i < unitTests_1.length)) return [3 /*break*/, 4];
                    test_1 = unitTests_1[_i];
                    return [5 /*yield**/, _loop_1(test_1)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    log_header("Calendar Event Limits - Integration Tests");
                    return [4 /*yield*/, sdk.api.calendar_event_templates.createOne({
                            title: 'Event Limit Test Appointment',
                            durationInMinutes: 60,
                            description: 'Test appointment for event limits',
                        })];
                case 5:
                    template = _b.sent();
                    _b.label = 6;
                case 6:
                    _b.trys.push([6, , 36, 41]);
                    // Setup: User has weekly availability Monday-Friday 9am-5pm
                    return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, {
                            weeklyAvailabilities: [
                                {
                                    dayOfWeekStartingSundayIndexedByZero: 1,
                                    startTimeInMinutes: 9 * 60,
                                    endTimeInMinutes: 17 * 60,
                                    intervalInMinutes: 60,
                                },
                                {
                                    dayOfWeekStartingSundayIndexedByZero: 2,
                                    startTimeInMinutes: 9 * 60,
                                    endTimeInMinutes: 17 * 60,
                                    intervalInMinutes: 60,
                                },
                                {
                                    dayOfWeekStartingSundayIndexedByZero: 3,
                                    startTimeInMinutes: 9 * 60,
                                    endTimeInMinutes: 17 * 60,
                                    intervalInMinutes: 60,
                                },
                                {
                                    dayOfWeekStartingSundayIndexedByZero: 4,
                                    startTimeInMinutes: 9 * 60,
                                    endTimeInMinutes: 17 * 60,
                                    intervalInMinutes: 60,
                                },
                                {
                                    dayOfWeekStartingSundayIndexedByZero: 5,
                                    startTimeInMinutes: 9 * 60,
                                    endTimeInMinutes: 17 * 60,
                                    intervalInMinutes: 60,
                                },
                            ],
                            calendarEventLimits: [] // Start with no limits
                        }, { replaceObjectFields: true })];
                case 7:
                    // Setup: User has weekly availability Monday-Friday 9am-5pm
                    _b.sent();
                    now = DateTime.now().setZone('America/New_York');
                    nextMonday = now.startOf('week').plus({ days: 1 });
                    if (nextMonday <= now) {
                        nextMonday = nextMonday.plus({ weeks: 1 });
                    }
                    fromDate = nextMonday;
                    toDate = fromDate.plus({ weeks: 2 });
                    return [4 /*yield*/, sdk.api.calendar_events.get_appointment_availability({
                            calendarEventTemplateId: template.id,
                            from: fromDate.toJSDate(),
                            to: toDate.toJSDate(),
                        })];
                case 8:
                    noLimitsAvailability_1 = _b.sent();
                    return [4 /*yield*/, async_test('No limits - full availability returned', function () { return Promise.resolve(noLimitsAvailability_1); }, { onResult: function (r) {
                                var userBlocks = r.availabilityBlocks.filter(function (b) { return b.userId === sdk.userInfo.id; });
                                console.log("No limits: ".concat(userBlocks.length, " availability blocks"));
                                if (userBlocks.length === 0) {
                                    console.log('ERROR: Expected some availability blocks with no limits');
                                    return false;
                                }
                                return true;
                            } })];
                case 9:
                    _b.sent();
                    baselineBlockCount_1 = noLimitsAvailability_1.availabilityBlocks.filter(function (b) { return b.userId === sdk.userInfo.id; }).length;
                    // Test 2: Set limit to 1 per day - should restrict availability
                    return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, {
                            calendarEventLimits: [{
                                    templateId: template.id,
                                    period: 1,
                                    limit: 1,
                                }]
                        }, { replaceObjectFields: true })];
                case 10:
                    // Test 2: Set limit to 1 per day - should restrict availability
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.get_appointment_availability({
                            calendarEventTemplateId: template.id,
                            from: fromDate.toJSDate(),
                            to: toDate.toJSDate(),
                        })];
                case 11:
                    oneLimitAvailability_1 = _b.sent();
                    return [4 /*yield*/, async_test('Limit of 1 per day - availability still present before any bookings', function () { return Promise.resolve(oneLimitAvailability_1); }, { onResult: function (r) {
                                var userBlocks = r.availabilityBlocks.filter(function (b) { return b.userId === sdk.userInfo.id; });
                                console.log("With 1/day limit (no bookings): ".concat(userBlocks.length, " availability blocks"));
                                // Should still have availability since no events are booked yet
                                if (userBlocks.length === 0) {
                                    console.log('ERROR: Expected availability blocks before any bookings');
                                    return false;
                                }
                                // Should have same availability as baseline before any bookings
                                if (userBlocks.length !== baselineBlockCount_1) {
                                    console.log("WARNING: Expected ".concat(baselineBlockCount_1, " blocks, got ").concat(userBlocks.length));
                                }
                                return true;
                            } })
                        // Test 3: Book an event on Monday at 9am, then check availability
                    ];
                case 12:
                    _b.sent();
                    mondayNineAm_1 = nextMonday.set({ hour: 9, minute: 0 });
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Test Booking',
                            startTimeInMS: mondayNineAm_1.toMillis(),
                            durationInMinutes: 60,
                            attendees: [{ type: 'user', id: sdk.userInfo.id }],
                            templateId: template.id,
                        })
                        // Small delay to ensure event is indexed
                    ];
                case 13:
                    bookedEvent = _b.sent();
                    // Small delay to ensure event is indexed
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                case 14:
                    // Small delay to ensure event is indexed
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.get_appointment_availability({
                            calendarEventTemplateId: template.id,
                            from: fromDate.toJSDate(),
                            to: toDate.toJSDate(),
                        })];
                case 15:
                    availabilityAfterBooking_1 = _b.sent();
                    return [4 /*yield*/, async_test('After booking 1 event with 1/day limit - Monday availability removed', function () { return Promise.resolve(availabilityAfterBooking_1); }, { onResult: function (r) {
                                var userBlocks = r.availabilityBlocks.filter(function (b) { return b.userId === sdk.userInfo.id; });
                                console.log("After booking 1 event: ".concat(userBlocks.length, " availability blocks"));
                                // Check that Monday slots are gone
                                var mondayBlocks = userBlocks.filter(function (b) {
                                    var blockDate = DateTime.fromMillis(b.startTimeInMS).setZone('America/New_York');
                                    return blockDate.weekday === 1 && blockDate.hasSame(mondayNineAm_1, 'day');
                                });
                                if (mondayBlocks.length > 0) {
                                    console.log("ERROR: Expected no Monday blocks after hitting limit, but found ".concat(mondayBlocks.length));
                                    return false;
                                }
                                // Should still have availability on other days
                                var tuesdayBlocks = userBlocks.filter(function (b) {
                                    var blockDate = DateTime.fromMillis(b.startTimeInMS).setZone('America/New_York');
                                    return blockDate.weekday === 2;
                                });
                                if (tuesdayBlocks.length === 0) {
                                    console.log('ERROR: Expected Tuesday availability to remain');
                                    return false;
                                }
                                console.log('✅ Monday availability correctly removed, other days remain');
                                return true;
                            } })
                        // Clean up the test event
                    ];
                case 16:
                    _b.sent();
                    // Clean up the test event
                    return [4 /*yield*/, sdk.api.calendar_events.deleteOne(bookedEvent.id)
                        // Test 4: Weekly limit (7 days, limit 2)
                    ];
                case 17:
                    // Clean up the test event
                    _b.sent();
                    // Test 4: Weekly limit (7 days, limit 2)
                    return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, {
                            calendarEventLimits: [{
                                    templateId: template.id,
                                    period: 7,
                                    limit: 2,
                                }]
                        }, { replaceObjectFields: true })
                        // Book two events in the same week
                    ];
                case 18:
                    // Test 4: Weekly limit (7 days, limit 2)
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Monday Event',
                            startTimeInMS: mondayNineAm_1.toMillis(),
                            durationInMinutes: 60,
                            attendees: [{ type: 'user', id: sdk.userInfo.id }],
                            templateId: template.id,
                        })];
                case 19:
                    mondayEvent = _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Tuesday Event',
                            startTimeInMS: mondayNineAm_1.plus({ days: 1 }).toMillis(),
                            durationInMinutes: 60,
                            attendees: [{ type: 'user', id: sdk.userInfo.id }],
                            templateId: template.id,
                        })];
                case 20:
                    tuesdayEvent = _b.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                case 21:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.get_appointment_availability({
                            calendarEventTemplateId: template.id,
                            from: fromDate.toJSDate(),
                            to: toDate.toJSDate(),
                        })];
                case 22:
                    weeklyLimitAvailability_1 = _b.sent();
                    return [4 /*yield*/, async_test('Weekly limit (2/week) - availability removed after 2 bookings in the same week', function () { return Promise.resolve(weeklyLimitAvailability_1); }, { onResult: function (r) {
                                var userBlocks = r.availabilityBlocks.filter(function (b) { return b.userId === sdk.userInfo.id; });
                                console.log("After booking 2 events with 2/week limit: ".concat(userBlocks.length, " availability blocks"));
                                // Find blocks in the first week (Monday-Sunday where events were booked)
                                var firstWeekEnd = mondayNineAm_1.plus({ days: 7 });
                                var firstWeekBlocks = userBlocks.filter(function (b) {
                                    var blockDate = DateTime.fromMillis(b.startTimeInMS).setZone('America/New_York');
                                    // Only check Wednesday onwards (Monday and Tuesday are booked)
                                    var wednesdayNineAm = mondayNineAm_1.plus({ days: 2 });
                                    return blockDate >= wednesdayNineAm && blockDate < firstWeekEnd;
                                });
                                console.log("First week (Wed-Sun): ".concat(firstWeekBlocks.length, " blocks"));
                                // Wednesday-Friday of the first week should have NO availability
                                // because Monday+Tuesday events are within the 7-day lookback window
                                if (firstWeekBlocks.length > 0) {
                                    console.log("ERROR: Expected no availability Wed-Sun of first week, but found ".concat(firstWeekBlocks.length, " blocks"));
                                    return false;
                                }
                                // Should have availability in the next week (events are now 7+ days old)
                                var nextWeekStart = mondayNineAm_1.plus({ weeks: 1 });
                                var nextWeekBlocks = userBlocks.filter(function (b) {
                                    var blockDate = DateTime.fromMillis(b.startTimeInMS).setZone('America/New_York');
                                    return blockDate >= nextWeekStart;
                                });
                                console.log("Second week: ".concat(nextWeekBlocks.length, " blocks"));
                                if (nextWeekBlocks.length === 0) {
                                    console.log('ERROR: Expected availability in second week (events are 7+ days old)');
                                    return false;
                                }
                                console.log('✅ Weekly limit correctly enforced');
                                return true;
                            } })
                        // Clean up
                    ];
                case 23:
                    _b.sent();
                    // Clean up
                    return [4 /*yield*/, sdk.api.calendar_events.deleteOne(mondayEvent.id)];
                case 24:
                    // Clean up
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.deleteOne(tuesdayEvent.id)
                        // Test 5: Multiple limits - both daily and weekly
                    ];
                case 25:
                    _b.sent();
                    // Test 5: Multiple limits - both daily and weekly
                    return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, {
                            calendarEventLimits: [
                                {
                                    templateId: template.id,
                                    period: 1,
                                    limit: 1,
                                },
                                {
                                    templateId: template.id,
                                    period: 7,
                                    limit: 3,
                                }
                            ]
                        }, { replaceObjectFields: true })
                        // Book 3 events across 3 days
                    ];
                case 26:
                    // Test 5: Multiple limits - both daily and weekly
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Event 1',
                            startTimeInMS: mondayNineAm_1.toMillis(),
                            durationInMinutes: 60,
                            attendees: [{ type: 'user', id: sdk.userInfo.id }],
                            templateId: template.id,
                        })];
                case 27:
                    event1 = _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Event 2',
                            startTimeInMS: mondayNineAm_1.plus({ days: 1 }).toMillis(),
                            durationInMinutes: 60,
                            attendees: [{ type: 'user', id: sdk.userInfo.id }],
                            templateId: template.id,
                        })];
                case 28:
                    event2 = _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Event 3',
                            startTimeInMS: mondayNineAm_1.plus({ days: 2 }).toMillis(),
                            durationInMinutes: 60,
                            attendees: [{ type: 'user', id: sdk.userInfo.id }],
                            templateId: template.id,
                        })];
                case 29:
                    event3 = _b.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                case 30:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.get_appointment_availability({
                            calendarEventTemplateId: template.id,
                            from: fromDate.toJSDate(),
                            to: toDate.toJSDate(),
                        })];
                case 31:
                    multipleLimitsAvailability_1 = _b.sent();
                    return [4 /*yield*/, async_test('Multiple limits (1/day and 3/week) - both constraints enforced', function () { return Promise.resolve(multipleLimitsAvailability_1); }, { onResult: function (r) {
                                var userBlocks = r.availabilityBlocks.filter(function (b) { return b.userId === sdk.userInfo.id; });
                                console.log("With multiple limits after 3 bookings: ".concat(userBlocks.length, " availability blocks"));
                                // Find blocks in the same week as the bookings
                                var sameWeekBlocks = userBlocks.filter(function (b) {
                                    var blockDate = DateTime.fromMillis(b.startTimeInMS).setZone('America/New_York');
                                    return blockDate >= mondayNineAm_1 && blockDate < mondayNineAm_1.plus({ days: 7 });
                                });
                                // Should have no availability in the booking week (weekly limit of 3 hit)
                                if (sameWeekBlocks.length > 0) {
                                    console.log("ERROR: Expected no availability in week with 3 bookings, found ".concat(sameWeekBlocks.length));
                                    return false;
                                }
                                // Should have availability in the next week
                                var nextWeekStart = mondayNineAm_1.plus({ weeks: 1 });
                                var nextWeekBlocks = userBlocks.filter(function (b) {
                                    var blockDate = DateTime.fromMillis(b.startTimeInMS).setZone('America/New_York');
                                    return blockDate >= nextWeekStart;
                                });
                                if (nextWeekBlocks.length === 0) {
                                    console.log('ERROR: Expected availability in next week');
                                    return false;
                                }
                                console.log('✅ Multiple limits correctly enforced');
                                return true;
                            } })
                        // Clean up
                    ];
                case 32:
                    _b.sent();
                    // Clean up
                    return [4 /*yield*/, sdk.api.calendar_events.deleteOne(event1.id)];
                case 33:
                    // Clean up
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.deleteOne(event2.id)];
                case 34:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.deleteOne(event3.id)];
                case 35:
                    _b.sent();
                    return [3 /*break*/, 41];
                case 36:
                    _b.trys.push([36, 39, , 40]);
                    return [4 /*yield*/, sdk.api.calendar_event_templates.deleteOne(template.id)];
                case 37:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, {
                            weeklyAvailabilities: [],
                            calendarEventLimits: []
                        }, { replaceObjectFields: true })];
                case 38:
                    _b.sent();
                    return [3 /*break*/, 40];
                case 39:
                    error_1 = _b.sent();
                    console.error('Cleanup error:', error_1);
                    return [3 /*break*/, 40];
                case 40: return [7 /*endfinally*/];
                case 41: return [2 /*return*/];
            }
        });
    });
};
// Allow running this test file independently
if (require.main === module) {
    console.log("\uD83C\uDF10 Using API URL: ".concat(host));
    var sdk_1 = new Session({ host: host });
    var sdkNonAdmin_1 = new Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setup_tests(sdk_1, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, calendar_event_limits_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Calendar event limits test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Calendar event limits test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=calendar_event_limits.test.js.map