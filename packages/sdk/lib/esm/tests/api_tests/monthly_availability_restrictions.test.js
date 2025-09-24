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
var host = process.env.API_URL || 'http://localhost:8080';
// Main test function that can be called independently
export var monthly_availability_restrictions_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var testUser, template, now, nextMonday, fromDate, toDate, regularAvailability_1, longFromDate, longToDate, firstMondayOnlyAvailability_1, firstAndThirdMondayAvailability_1, secondSaturdayAvailability_1, fifthMondayAvailability_1, pacificFromDate, pacificToDate, timezoneTestAvailability_1, easternFromDate, easternToDate, crossTimezoneTestAvailability_1, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_header("Monthly Availability Restrictions Tests");
                    return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, {
                            timezone: 'America/New_York'
                        })
                        // Create a calendar event template for testing
                    ];
                case 1:
                    testUser = _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_event_templates.createOne({
                            title: 'Monthly Restriction Test Appointment',
                            durationInMinutes: 60,
                            description: 'Test appointment for monthly restrictions',
                        })];
                case 2:
                    template = _b.sent();
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, , 25, 30]);
                    now = DateTime.now().setZone('America/New_York');
                    nextMonday = now.startOf('week').plus({ days: 1 }) // This week's Monday
                    ;
                    // If this week's Monday is in the past, use next week's Monday
                    if (nextMonday <= now) {
                        nextMonday = nextMonday.plus({ weeks: 1 });
                    }
                    return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, {
                            weeklyAvailabilities: [{
                                    dayOfWeekStartingSundayIndexedByZero: 1,
                                    startTimeInMinutes: 9 * 60,
                                    endTimeInMinutes: 17 * 60,
                                    intervalInMinutes: 60,
                                }]
                        }, { replaceObjectFields: true })
                        // Get availability for next 4 weeks to ensure we get multiple Mondays
                    ];
                case 4:
                    _b.sent();
                    fromDate = nextMonday;
                    toDate = fromDate.plus({ weeks: 4 });
                    return [4 /*yield*/, sdk.api.calendar_events.get_appointment_availability({
                            calendarEventTemplateId: template.id,
                            from: fromDate.toJSDate(),
                            to: toDate.toJSDate(),
                        })];
                case 5:
                    regularAvailability_1 = _b.sent();
                    return [4 /*yield*/, async_test('Regular availability generates blocks for all Mondays', function () { return Promise.resolve(regularAvailability_1); }, { onResult: function (r) {
                                console.log("Regular availability found ".concat(r.availabilityBlocks.length, " blocks"));
                                // Filter to only blocks for the test user
                                var testUserBlocks = r.availabilityBlocks.filter(function (block) { return block.userId === sdk.userInfo.id; });
                                console.log("Test user (".concat(sdk.userInfo.id, ") has ").concat(testUserBlocks.length, " blocks"));
                                if (testUserBlocks.length === 0) {
                                    console.log('ERROR: No availability blocks found for test user');
                                    return false;
                                }
                                // Verify that test user blocks are actually on Mondays (day 1)
                                for (var _i = 0, testUserBlocks_1 = testUserBlocks; _i < testUserBlocks_1.length; _i++) {
                                    var block = testUserBlocks_1[_i];
                                    var blockDate = DateTime.fromMillis(block.startTimeInMS).setZone('America/New_York');
                                    if (blockDate.weekday !== 1) {
                                        console.log("ERROR: Test user block not on Monday: ".concat(blockDate.toISO(), " (weekday: ").concat(blockDate.weekday, ")"));
                                        return false;
                                    }
                                }
                                console.log('✅ All test user blocks are on Mondays as expected');
                                return true;
                            } })
                        // Test 2: Monthly restriction to first Monday only
                    ];
                case 6:
                    _b.sent();
                    // Test 2: Monthly restriction to first Monday only
                    return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, {
                            weeklyAvailabilities: [{
                                    dayOfWeekStartingSundayIndexedByZero: 1,
                                    startTimeInMinutes: 9 * 60,
                                    endTimeInMinutes: 17 * 60,
                                    intervalInMinutes: 60,
                                    monthlyRestriction: {
                                        occurrences: [1] // First Monday only
                                    }
                                }]
                        }, { replaceObjectFields: true })
                        // Get availability for next 6 months to test multiple months and ensure 5th occurrence coverage
                    ];
                case 7:
                    // Test 2: Monthly restriction to first Monday only
                    _b.sent();
                    longFromDate = DateTime.now().setZone('America/New_York').plus({ days: 1 }).startOf('day') // Tomorrow
                    ;
                    longToDate = longFromDate.plus({ months: 6 }) // Extended to 6 months for better 5th occurrence testing
                    ;
                    console.log("Testing from ".concat(longFromDate.toISO(), " to ").concat(longToDate.toISO()));
                    return [4 /*yield*/, sdk.api.calendar_events.get_appointment_availability({
                            calendarEventTemplateId: template.id,
                            from: longFromDate.toJSDate(),
                            to: longToDate.toJSDate(),
                        })];
                case 8:
                    firstMondayOnlyAvailability_1 = _b.sent();
                    return [4 /*yield*/, async_test('Monthly restriction to first Monday generates fewer blocks', function () { return Promise.resolve(firstMondayOnlyAvailability_1); }, { onResult: function (r) {
                                console.log("First Monday only availability found ".concat(r.availabilityBlocks.length, " blocks"));
                                // Filter to only blocks for the test user
                                var testUserBlocks = r.availabilityBlocks.filter(function (block) { return block.userId === sdk.userInfo.id; });
                                var regularTestUserBlocks = regularAvailability_1.availabilityBlocks.filter(function (block) { return block.userId === sdk.userInfo.id; });
                                console.log("Test user has ".concat(testUserBlocks.length, " restricted blocks vs ").concat(regularTestUserBlocks.length, " regular blocks"));
                                // The test should show fewer blocks than regular availability
                                // since we're restricting to first Monday only
                                if (testUserBlocks.length >= regularTestUserBlocks.length) {
                                    console.log("ERROR: Restricted availability (".concat(testUserBlocks.length, ") should be fewer than regular (").concat(regularTestUserBlocks.length, ")"));
                                    return false;
                                }
                                // Verify each test user block is indeed a first Monday of the month
                                for (var _i = 0, testUserBlocks_2 = testUserBlocks; _i < testUserBlocks_2.length; _i++) {
                                    var block = testUserBlocks_2[_i];
                                    var blockDate = DateTime.fromMillis(block.startTimeInMS).setZone('America/New_York');
                                    // Check if it's a Monday
                                    if (blockDate.weekday !== 1) {
                                        console.log("ERROR: Block is not on Monday: ".concat(blockDate.toISO()));
                                        return false;
                                    }
                                    // Check if it's the first Monday of the month
                                    var startOfMonth = blockDate.startOf('month');
                                    var firstMonday = startOfMonth;
                                    while (firstMonday.weekday !== 1) {
                                        firstMonday = firstMonday.plus({ days: 1 });
                                    }
                                    if (blockDate.day !== firstMonday.day) {
                                        console.log("ERROR: Block is not first Monday: block=".concat(blockDate.toISO(), ", firstMonday=").concat(firstMonday.toISO()));
                                        return false;
                                    }
                                }
                                console.log('✅ All blocks are first Mondays and fewer than regular availability');
                                return true;
                            } })
                        // Test 3: Multiple occurrences (1st and 3rd Monday)
                    ];
                case 9:
                    _b.sent();
                    // Test 3: Multiple occurrences (1st and 3rd Monday)
                    return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, {
                            weeklyAvailabilities: [{
                                    dayOfWeekStartingSundayIndexedByZero: 1,
                                    startTimeInMinutes: 9 * 60,
                                    endTimeInMinutes: 17 * 60,
                                    intervalInMinutes: 60,
                                    monthlyRestriction: {
                                        occurrences: [1, 3] // First and third Monday
                                    }
                                }]
                        }, { replaceObjectFields: true })];
                case 10:
                    // Test 3: Multiple occurrences (1st and 3rd Monday)
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.get_appointment_availability({
                            calendarEventTemplateId: template.id,
                            from: longFromDate.toJSDate(),
                            to: longToDate.toJSDate(),
                        })];
                case 11:
                    firstAndThirdMondayAvailability_1 = _b.sent();
                    return [4 /*yield*/, async_test('Monthly restriction to 1st and 3rd Monday generates correct blocks', function () { return Promise.resolve(firstAndThirdMondayAvailability_1); }, { onResult: function (r) {
                                console.log("First and third Monday availability found ".concat(r.availabilityBlocks.length, " blocks"));
                                // Filter to only blocks for the test user
                                var testUserBlocks = r.availabilityBlocks.filter(function (block) { return block.userId === sdk.userInfo.id; });
                                console.log("Test user has ".concat(testUserBlocks.length, " blocks for 1st and 3rd Mondays"));
                                // Verify each test user block is either first or third Monday of the month
                                for (var _i = 0, testUserBlocks_3 = testUserBlocks; _i < testUserBlocks_3.length; _i++) {
                                    var block = testUserBlocks_3[_i];
                                    var blockDate = DateTime.fromMillis(block.startTimeInMS).setZone('America/New_York');
                                    // Check if it's a Monday
                                    if (blockDate.weekday !== 1) {
                                        console.log("Block is not on Monday: ".concat(blockDate.toISO()));
                                        return false;
                                    }
                                    // Calculate which occurrence of Monday this is in the month
                                    var startOfMonth = blockDate.startOf('month');
                                    var occurrence = 0;
                                    var currentDay = startOfMonth;
                                    while (currentDay.month === blockDate.month) {
                                        if (currentDay.weekday === 1) {
                                            occurrence++;
                                            if (currentDay.day === blockDate.day) {
                                                break;
                                            }
                                        }
                                        currentDay = currentDay.plus({ days: 1 });
                                    }
                                    if (![1, 3].includes(occurrence)) {
                                        console.log("Block is not 1st or 3rd Monday: occurrence=".concat(occurrence, ", date=").concat(blockDate.toISO()));
                                        return false;
                                    }
                                }
                                console.log('✅ All blocks are 1st or 3rd Mondays');
                                return true;
                            } })
                        // Test 4: Test with Saturday to ensure weekend days work
                    ];
                case 12:
                    _b.sent();
                    // Test 4: Test with Saturday to ensure weekend days work
                    return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, {
                            weeklyAvailabilities: [{
                                    dayOfWeekStartingSundayIndexedByZero: 6,
                                    startTimeInMinutes: 10 * 60,
                                    endTimeInMinutes: 14 * 60,
                                    intervalInMinutes: 60,
                                    monthlyRestriction: {
                                        occurrences: [2] // Second Saturday only
                                    }
                                }]
                        }, { replaceObjectFields: true })];
                case 13:
                    // Test 4: Test with Saturday to ensure weekend days work
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.get_appointment_availability({
                            calendarEventTemplateId: template.id,
                            from: longFromDate.toJSDate(),
                            to: longToDate.toJSDate(),
                        })];
                case 14:
                    secondSaturdayAvailability_1 = _b.sent();
                    return [4 /*yield*/, async_test('Monthly restriction works for weekend days (Saturday)', function () { return Promise.resolve(secondSaturdayAvailability_1); }, { onResult: function (r) {
                                console.log("Second Saturday availability found ".concat(r.availabilityBlocks.length, " blocks"));
                                // Filter to only blocks for the test user
                                var testUserBlocks = r.availabilityBlocks.filter(function (block) { return block.userId === sdk.userInfo.id; });
                                console.log("Test user has ".concat(testUserBlocks.length, " blocks for 2nd Saturdays"));
                                // Verify each test user block is the second Saturday of the month
                                for (var _i = 0, testUserBlocks_4 = testUserBlocks; _i < testUserBlocks_4.length; _i++) {
                                    var block = testUserBlocks_4[_i];
                                    var blockDate = DateTime.fromMillis(block.startTimeInMS).setZone('America/New_York');
                                    // Check if it's a Saturday
                                    if (blockDate.weekday !== 6) {
                                        console.log("Block is not on Saturday: ".concat(blockDate.toISO()));
                                        return false;
                                    }
                                    // Calculate which occurrence of Saturday this is in the month
                                    var startOfMonth = blockDate.startOf('month');
                                    var occurrence = 0;
                                    var currentDay = startOfMonth;
                                    while (currentDay.month === blockDate.month) {
                                        if (currentDay.weekday === 6) {
                                            occurrence++;
                                            if (currentDay.day === blockDate.day) {
                                                break;
                                            }
                                        }
                                        currentDay = currentDay.plus({ days: 1 });
                                    }
                                    if (occurrence !== 2) {
                                        console.log("Block is not 2nd Saturday: occurrence=".concat(occurrence, ", date=").concat(blockDate.toISO()));
                                        return false;
                                    }
                                }
                                console.log('✅ All blocks are 2nd Saturdays');
                                return true;
                            } })
                        // Test 5: Edge case - 5th occurrence that doesn't exist in some months
                    ];
                case 15:
                    _b.sent();
                    // Test 5: Edge case - 5th occurrence that doesn't exist in some months
                    return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, {
                            weeklyAvailabilities: [{
                                    dayOfWeekStartingSundayIndexedByZero: 1,
                                    startTimeInMinutes: 9 * 60,
                                    endTimeInMinutes: 17 * 60,
                                    intervalInMinutes: 60,
                                    monthlyRestriction: {
                                        occurrences: [5] // Fifth Monday only (doesn't exist in all months)
                                    }
                                }]
                        }, { replaceObjectFields: true })];
                case 16:
                    // Test 5: Edge case - 5th occurrence that doesn't exist in some months
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.get_appointment_availability({
                            calendarEventTemplateId: template.id,
                            from: longFromDate.toJSDate(),
                            to: longToDate.toJSDate(),
                        })];
                case 17:
                    fifthMondayAvailability_1 = _b.sent();
                    return [4 /*yield*/, async_test('Monthly restriction handles 5th occurrence gracefully', function () { return Promise.resolve(fifthMondayAvailability_1); }, { onResult: function (r) {
                                console.log("Fifth Monday availability found ".concat(r.availabilityBlocks.length, " blocks"));
                                // Filter to only blocks for the test user
                                var testUserBlocks = r.availabilityBlocks.filter(function (block) { return block.userId === sdk.userInfo.id; });
                                console.log("Test user has ".concat(testUserBlocks.length, " blocks for 5th Mondays"));
                                // Verify that test user blocks only exist for months that have a 5th Monday
                                for (var _i = 0, testUserBlocks_5 = testUserBlocks; _i < testUserBlocks_5.length; _i++) {
                                    var block = testUserBlocks_5[_i];
                                    var blockDate = DateTime.fromMillis(block.startTimeInMS).setZone('America/New_York');
                                    // Check if it's a Monday
                                    if (blockDate.weekday !== 1) {
                                        console.log("Block is not on Monday: ".concat(blockDate.toISO()));
                                        return false;
                                    }
                                    // Verify it's actually the 5th Monday
                                    var startOfMonth = blockDate.startOf('month');
                                    var mondayCount = 0;
                                    var currentDay = startOfMonth;
                                    while (currentDay.month === blockDate.month) {
                                        if (currentDay.weekday === 1) {
                                            mondayCount++;
                                            if (currentDay.day === blockDate.day) {
                                                if (mondayCount !== 5) {
                                                    console.log("Block is not 5th Monday: count=".concat(mondayCount, ", date=").concat(blockDate.toISO()));
                                                    return false;
                                                }
                                                break;
                                            }
                                        }
                                        currentDay = currentDay.plus({ days: 1 });
                                    }
                                }
                                console.log('✅ All blocks are valid 5th Mondays');
                                // 5th Mondays are rare, so any number of blocks (including 0) is valid
                                return true;
                            } })
                        // Test 6: Timezone-agnostic testing (West Coast)
                    ];
                case 18:
                    _b.sent();
                    // Test 6: Timezone-agnostic testing (West Coast)
                    return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, {
                            timezone: 'America/Los_Angeles',
                            weeklyAvailabilities: [{
                                    dayOfWeekStartingSundayIndexedByZero: 2,
                                    startTimeInMinutes: 14 * 60,
                                    endTimeInMinutes: 16 * 60,
                                    intervalInMinutes: 60,
                                    monthlyRestriction: {
                                        occurrences: [1, 4] // First and fourth Tuesday
                                    }
                                }]
                        }, { replaceObjectFields: true })
                        // Test with Pacific timezone dates
                    ];
                case 19:
                    // Test 6: Timezone-agnostic testing (West Coast)
                    _b.sent();
                    pacificFromDate = DateTime.now().setZone('America/Los_Angeles').plus({ days: 1 }).startOf('day');
                    pacificToDate = pacificFromDate.plus({ months: 4 });
                    return [4 /*yield*/, sdk.api.calendar_events.get_appointment_availability({
                            calendarEventTemplateId: template.id,
                            from: pacificFromDate.toJSDate(),
                            to: pacificToDate.toJSDate(),
                        })];
                case 20:
                    timezoneTestAvailability_1 = _b.sent();
                    return [4 /*yield*/, async_test('Monthly restriction works correctly across different timezones', function () { return Promise.resolve(timezoneTestAvailability_1); }, { onResult: function (r) {
                                console.log("Timezone test availability found ".concat(r.availabilityBlocks.length, " blocks"));
                                // Filter to only blocks for the test user
                                var testUserBlocks = r.availabilityBlocks.filter(function (block) { return block.userId === sdk.userInfo.id; });
                                console.log("Test user has ".concat(testUserBlocks.length, " blocks for 1st and 4th Tuesdays (Pacific time)"));
                                // Verify each test user block is either first or fourth Tuesday of the month
                                for (var _i = 0, testUserBlocks_6 = testUserBlocks; _i < testUserBlocks_6.length; _i++) {
                                    var block = testUserBlocks_6[_i];
                                    var blockDate = DateTime.fromMillis(block.startTimeInMS).setZone('America/Los_Angeles');
                                    // Check if it's a Tuesday (day 2)
                                    if (blockDate.weekday !== 2) {
                                        console.log("ERROR: Block not on Tuesday: ".concat(blockDate.toISO(), " (weekday: ").concat(blockDate.weekday, ")"));
                                        return false;
                                    }
                                    // Calculate which occurrence of Tuesday this is in the month
                                    var startOfMonth = blockDate.startOf('month');
                                    var occurrence = 0;
                                    var currentDay = startOfMonth;
                                    while (currentDay.month === blockDate.month) {
                                        if (currentDay.weekday === 2) {
                                            occurrence++;
                                            if (currentDay.day === blockDate.day) {
                                                break;
                                            }
                                        }
                                        currentDay = currentDay.plus({ days: 1 });
                                    }
                                    if (![1, 4].includes(occurrence)) {
                                        console.log("ERROR: Block not 1st or 4th Tuesday: occurrence=".concat(occurrence, ", date=").concat(blockDate.toISO()));
                                        return false;
                                    }
                                }
                                console.log('✅ All blocks are 1st or 4th Tuesdays in Pacific timezone');
                                return true;
                            } })
                        // Test 7: Cross-timezone validation (ensure calculation consistency)
                        // Test the same restriction in Eastern time to verify consistency
                    ];
                case 21:
                    _b.sent();
                    // Test 7: Cross-timezone validation (ensure calculation consistency)
                    // Test the same restriction in Eastern time to verify consistency
                    return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, {
                            timezone: 'America/New_York',
                            weeklyAvailabilities: [{
                                    dayOfWeekStartingSundayIndexedByZero: 2,
                                    startTimeInMinutes: 14 * 60,
                                    endTimeInMinutes: 16 * 60,
                                    intervalInMinutes: 60,
                                    monthlyRestriction: {
                                        occurrences: [1, 4] // Same: first and fourth Tuesday
                                    }
                                }]
                        }, { replaceObjectFields: true })
                        // Use Eastern timezone dates for same period
                    ];
                case 22:
                    // Test 7: Cross-timezone validation (ensure calculation consistency)
                    // Test the same restriction in Eastern time to verify consistency
                    _b.sent();
                    easternFromDate = DateTime.now().setZone('America/New_York').plus({ days: 1 }).startOf('day');
                    easternToDate = easternFromDate.plus({ months: 4 });
                    return [4 /*yield*/, sdk.api.calendar_events.get_appointment_availability({
                            calendarEventTemplateId: template.id,
                            from: easternFromDate.toJSDate(),
                            to: easternToDate.toJSDate(),
                        })];
                case 23:
                    crossTimezoneTestAvailability_1 = _b.sent();
                    return [4 /*yield*/, async_test('Monthly restriction calculations are consistent across timezones', function () { return Promise.resolve(crossTimezoneTestAvailability_1); }, { onResult: function (r) {
                                var testUserBlocks = r.availabilityBlocks.filter(function (block) { return block.userId === sdk.userInfo.id; });
                                var pacificUserBlocks = timezoneTestAvailability_1.availabilityBlocks.filter(function (block) { return block.userId === sdk.userInfo.id; });
                                console.log("Eastern: ".concat(testUserBlocks.length, " blocks, Pacific: ").concat(pacificUserBlocks.length, " blocks"));
                                // Both should have the same number of qualifying blocks
                                // (within a reasonable range due to different date windows)
                                var blockCountDifference = Math.abs(testUserBlocks.length - pacificUserBlocks.length);
                                if (blockCountDifference > 2) {
                                    console.log("ERROR: Significant block count difference between timezones: ".concat(blockCountDifference));
                                    return false;
                                }
                                // Verify Eastern timezone blocks are also correct
                                for (var _i = 0, testUserBlocks_7 = testUserBlocks; _i < testUserBlocks_7.length; _i++) {
                                    var block = testUserBlocks_7[_i];
                                    var blockDate = DateTime.fromMillis(block.startTimeInMS).setZone('America/New_York');
                                    if (blockDate.weekday !== 2) {
                                        console.log("ERROR: Eastern block not on Tuesday: ".concat(blockDate.toISO()));
                                        return false;
                                    }
                                    // Calculate occurrence in Eastern timezone
                                    var startOfMonth = blockDate.startOf('month');
                                    var occurrence = 0;
                                    var currentDay = startOfMonth;
                                    while (currentDay.month === blockDate.month) {
                                        if (currentDay.weekday === 2) {
                                            occurrence++;
                                            if (currentDay.day === blockDate.day) {
                                                break;
                                            }
                                        }
                                        currentDay = currentDay.plus({ days: 1 });
                                    }
                                    if (![1, 4].includes(occurrence)) {
                                        console.log("ERROR: Eastern block not 1st or 4th Tuesday: occurrence=".concat(occurrence));
                                        return false;
                                    }
                                }
                                console.log('✅ Monthly restriction calculations are consistent across timezones');
                                return true;
                            } })];
                case 24:
                    _b.sent();
                    return [3 /*break*/, 30];
                case 25:
                    _b.trys.push([25, 28, , 29]);
                    return [4 /*yield*/, sdk.api.calendar_event_templates.deleteOne(template.id)
                        // Reset user availability
                    ];
                case 26:
                    _b.sent();
                    // Reset user availability
                    return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, {
                            weeklyAvailabilities: []
                        }, { replaceObjectFields: true })];
                case 27:
                    // Reset user availability
                    _b.sent();
                    return [3 /*break*/, 29];
                case 28:
                    error_1 = _b.sent();
                    console.error('Cleanup error:', error_1);
                    return [3 /*break*/, 29];
                case 29: return [7 /*endfinally*/];
                case 30: return [2 /*return*/];
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
                    return [4 /*yield*/, monthly_availability_restrictions_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Monthly availability restrictions test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Monthly availability restrictions test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=monthly_availability_restrictions.test.js.map