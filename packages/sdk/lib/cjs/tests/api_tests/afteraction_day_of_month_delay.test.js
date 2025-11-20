"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.afteraction_day_of_month_delay_tests = void 0;
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var luxon_1 = require("luxon");
var host = process.env.API_URL || 'http://localhost:8080';
var afteraction_day_of_month_delay_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("AfterAction Day of Month Delay Tests");
                    return [4 /*yield*/, day_of_month_delay_tests({ sdk: sdk, sdkNonAdmin: sdkNonAdmin })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, office_hours_delay_tests({ sdk: sdk, sdkNonAdmin: sdkNonAdmin })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
};
exports.afteraction_day_of_month_delay_tests = afteraction_day_of_month_delay_tests;
var day_of_month_delay_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var createdJourneyIds, createdEnduserIds, createdAutomatedActionIds, calculateExpectedDelayTime, journey1_1, firstStep, dayOfMonthStep_1, enduser1_1, delayedAction, expectedDelayTime, actualDelayTime, timeDiff, journey2_1, firstStep2, dayOfMonthStep2_1, enduser2_1, delayedAction2, expectedDelayTime2, actualDelayTime2, timeDiff2, journey3_1, firstStep3, regularDelayStep_1, enduser3_1, regularDelayedAction, expectedRegularDelayTime, actualRegularDelayTime, regularTimeDiff, journey4_1, firstStep4, defaultsStep_1, enduser4_1, defaultsAction, expectedDefaultsTime, actualDefaultsTime, defaultsTimeDiff, _i, createdAutomatedActionIds_1, actionId, e_1, _b, createdEnduserIds_1, enduserId, e_2, _c, createdJourneyIds_1, journeyId, e_3, e_4;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    (0, testing_1.log_header)("Day of Month Delay Tests");
                    createdJourneyIds = [];
                    createdEnduserIds = [];
                    createdAutomatedActionIds = [];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, , 26, 48]);
                    calculateExpectedDelayTime = function (dayOfMonth, hour, minute) {
                        if (hour === void 0) { hour = 9; }
                        if (minute === void 0) { minute = 0; }
                        // Use US/Eastern timezone for consistent scheduling behavior
                        // This ensures that "9 AM" means 9 AM Eastern Time regardless of test location
                        var now = luxon_1.DateTime.now().setZone('America/New_York');
                        // Create target date for this month in Eastern timezone
                        var targetDate = luxon_1.DateTime.fromObject({
                            year: now.year,
                            month: now.month,
                            day: dayOfMonth,
                            hour: hour,
                            minute: minute,
                            second: 0,
                            millisecond: 0
                        }, { zone: 'America/New_York' });
                        // If the target date has already passed this month, use next month
                        if (targetDate <= now) {
                            targetDate = targetDate.plus({ months: 1 });
                        }
                        return targetDate.toMillis();
                    };
                    // Test 1: Basic day-of-month delay (next 1st at 9 AM)
                    console.log("Testing basic day-of-month delay for 1st of month at 9 AM...");
                    return [4 /*yield*/, sdk.api.journeys.createOne({
                            title: "Day of Month Delay Test - 1st at 9 AM"
                        })];
                case 2:
                    journey1_1 = _d.sent();
                    createdJourneyIds.push(journey1_1.id);
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: journey1_1.id,
                            action: { type: 'addEnduserTags', info: { tags: ['first-step-completed'] } },
                            events: [{ type: 'onJourneyStart', info: {} }]
                        })];
                case 3:
                    firstStep = _d.sent();
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: journey1_1.id,
                            action: { type: 'addEnduserTags', info: { tags: ['delayed-until-1st'] } },
                            events: [{
                                    type: 'afterAction',
                                    info: {
                                        automationStepId: firstStep.id,
                                        delayInMS: 0,
                                        delay: 0,
                                        unit: 'Minutes',
                                        dayOfMonthCondition: {
                                            dayOfMonth: 1,
                                            hour: 9,
                                            minute: 0
                                        }
                                    }
                                }]
                        })];
                case 4:
                    dayOfMonthStep_1 = _d.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'Test',
                            lname: 'User1',
                            email: 'testuser1@example.com'
                        })];
                case 5:
                    enduser1_1 = _d.sent();
                    createdEnduserIds.push(enduser1_1.id);
                    return [4 /*yield*/, sdk.api.endusers.add_to_journey({
                            enduserIds: [enduser1_1.id],
                            journeyId: journey1_1.id
                        })
                        // Poll for automated action creation
                    ];
                case 6:
                    _d.sent();
                    return [4 /*yield*/, pollForAutomationProcessing(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var automatedActions;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.automated_actions.getSome({
                                            filter: { enduserId: enduser1_1.id, journeyId: journey1_1.id }
                                        })];
                                    case 1:
                                        automatedActions = _a.sent();
                                        return [2 /*return*/, automatedActions.find(function (a) {
                                                return a.automationStepId === dayOfMonthStep_1.id && a.status === 'active';
                                            })];
                                }
                            });
                        }); }, function (result) { return !!result; }, 'Day-of-month delay action should be created and scheduled')];
                case 7:
                    delayedAction = _d.sent();
                    createdAutomatedActionIds.push(delayedAction.id);
                    expectedDelayTime = calculateExpectedDelayTime(1, 9, 0);
                    actualDelayTime = delayedAction.processAfter;
                    timeDiff = Math.abs(actualDelayTime - expectedDelayTime);
                    if (timeDiff > 60000) { // 1 minute tolerance for processing time
                        throw new Error("Day-of-month delay time mismatch. Expected: ".concat(new Date(expectedDelayTime).toISOString(), ", Got: ").concat(new Date(actualDelayTime).toISOString(), ", Diff: ").concat(timeDiff, "ms"));
                    }
                    console.log("\u2705 Day-of-month delay correctly calculated for 1st at 9 AM. Scheduled for: ".concat(new Date(actualDelayTime).toISOString()));
                    // Test 2: Day-of-month delay with custom time (15th at 2:30 PM)
                    console.log("Testing day-of-month delay for 15th at 2:30 PM...");
                    return [4 /*yield*/, sdk.api.journeys.createOne({
                            title: "Day of Month Delay Test - 15th at 2:30 PM"
                        })];
                case 8:
                    journey2_1 = _d.sent();
                    createdJourneyIds.push(journey2_1.id);
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: journey2_1.id,
                            action: { type: 'addEnduserTags', info: { tags: ['second-first-step'] } },
                            events: [{ type: 'onJourneyStart', info: {} }]
                        })];
                case 9:
                    firstStep2 = _d.sent();
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: journey2_1.id,
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
                                            hour: 14,
                                            minute: 30
                                        }
                                    }
                                }]
                        })];
                case 10:
                    dayOfMonthStep2_1 = _d.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'Test',
                            lname: 'User2',
                            email: 'testuser2@example.com'
                        })];
                case 11:
                    enduser2_1 = _d.sent();
                    createdEnduserIds.push(enduser2_1.id);
                    return [4 /*yield*/, sdk.api.endusers.add_to_journey({
                            enduserIds: [enduser2_1.id],
                            journeyId: journey2_1.id
                        })
                        // Poll for automated action creation
                    ];
                case 12:
                    _d.sent();
                    return [4 /*yield*/, pollForAutomationProcessing(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var automatedActions;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.automated_actions.getSome({
                                            filter: { enduserId: enduser2_1.id, journeyId: journey2_1.id }
                                        })];
                                    case 1:
                                        automatedActions = _a.sent();
                                        return [2 /*return*/, automatedActions.find(function (a) {
                                                return a.automationStepId === dayOfMonthStep2_1.id && a.status === 'active';
                                            })];
                                }
                            });
                        }); }, function (result) { return !!result; }, '15th day-of-month delay action should be created and scheduled')];
                case 13:
                    delayedAction2 = _d.sent();
                    createdAutomatedActionIds.push(delayedAction2.id);
                    expectedDelayTime2 = calculateExpectedDelayTime(15, 14, 30);
                    actualDelayTime2 = delayedAction2.processAfter;
                    timeDiff2 = Math.abs(actualDelayTime2 - expectedDelayTime2);
                    if (timeDiff2 > 60000) { // 1 minute tolerance for processing time
                        throw new Error("Day-of-month delay time mismatch for 15th. Expected: ".concat(new Date(expectedDelayTime2).toISOString(), ", Got: ").concat(new Date(actualDelayTime2).toISOString(), ", Diff: ").concat(timeDiff2, "ms"));
                    }
                    console.log("\u2705 Day-of-month delay correctly calculated for 15th at 2:30 PM. Scheduled for: ".concat(new Date(actualDelayTime2).toISOString()));
                    // Test 3: Regular delay still works (backward compatibility)
                    console.log("Testing backward compatibility - regular delay still works...");
                    return [4 /*yield*/, sdk.api.journeys.createOne({
                            title: "Regular Delay Test"
                        })];
                case 14:
                    journey3_1 = _d.sent();
                    createdJourneyIds.push(journey3_1.id);
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: journey3_1.id,
                            action: { type: 'addEnduserTags', info: { tags: ['regular-first-step'] } },
                            events: [{ type: 'onJourneyStart', info: {} }]
                        })];
                case 15:
                    firstStep3 = _d.sent();
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: journey3_1.id,
                            action: { type: 'addEnduserTags', info: { tags: ['regular-delay-complete'] } },
                            events: [{
                                    type: 'afterAction',
                                    info: {
                                        automationStepId: firstStep3.id,
                                        delayInMS: 300000,
                                        delay: 5,
                                        unit: 'Minutes'
                                        // No dayOfMonthCondition - should use regular delay
                                    }
                                }]
                        })];
                case 16:
                    regularDelayStep_1 = _d.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'Test',
                            lname: 'User3',
                            email: 'testuser3@example.com'
                        })];
                case 17:
                    enduser3_1 = _d.sent();
                    createdEnduserIds.push(enduser3_1.id);
                    return [4 /*yield*/, sdk.api.endusers.add_to_journey({
                            enduserIds: [enduser3_1.id],
                            journeyId: journey3_1.id
                        })
                        // Poll for automated action creation
                    ];
                case 18:
                    _d.sent();
                    return [4 /*yield*/, pollForAutomationProcessing(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var automatedActions;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.automated_actions.getSome({
                                            filter: { enduserId: enduser3_1.id, journeyId: journey3_1.id }
                                        })];
                                    case 1:
                                        automatedActions = _a.sent();
                                        return [2 /*return*/, automatedActions.find(function (a) {
                                                return a.automationStepId === regularDelayStep_1.id && a.status === 'active';
                                            })];
                                }
                            });
                        }); }, function (result) { return !!result; }, 'Regular delay action should be created and scheduled')];
                case 19:
                    regularDelayedAction = _d.sent();
                    createdAutomatedActionIds.push(regularDelayedAction.id);
                    expectedRegularDelayTime = Date.now() + 300000 // 5 minutes from now
                    ;
                    actualRegularDelayTime = regularDelayedAction.processAfter;
                    regularTimeDiff = Math.abs(actualRegularDelayTime - expectedRegularDelayTime);
                    if (regularTimeDiff > 10000) {
                        throw new Error("Regular delay time mismatch. Expected around: ".concat(new Date(expectedRegularDelayTime).toISOString(), ", Got: ").concat(new Date(actualRegularDelayTime).toISOString(), ", Diff: ").concat(regularTimeDiff, "ms"));
                    }
                    console.log("\u2705 Regular delay still works correctly. Scheduled for: ".concat(new Date(actualRegularDelayTime).toISOString()));
                    // Test 4: Day defaults (hour defaults to 9, minute defaults to 0)
                    console.log("Testing day-of-month delay with default hour and minute...");
                    return [4 /*yield*/, sdk.api.journeys.createOne({
                            title: "Day of Month Delay Test - Defaults"
                        })];
                case 20:
                    journey4_1 = _d.sent();
                    createdJourneyIds.push(journey4_1.id);
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: journey4_1.id,
                            action: { type: 'addEnduserTags', info: { tags: ['defaults-first-step'] } },
                            events: [{ type: 'onJourneyStart', info: {} }]
                        })];
                case 21:
                    firstStep4 = _d.sent();
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: journey4_1.id,
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
                        })];
                case 22:
                    defaultsStep_1 = _d.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'Test',
                            lname: 'User4',
                            email: 'testuser4@example.com'
                        })];
                case 23:
                    enduser4_1 = _d.sent();
                    createdEnduserIds.push(enduser4_1.id);
                    return [4 /*yield*/, sdk.api.endusers.add_to_journey({
                            enduserIds: [enduser4_1.id],
                            journeyId: journey4_1.id
                        })
                        // Poll for automated action creation
                    ];
                case 24:
                    _d.sent();
                    return [4 /*yield*/, pollForAutomationProcessing(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var automatedActions;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.automated_actions.getSome({
                                            filter: { enduserId: enduser4_1.id, journeyId: journey4_1.id }
                                        })];
                                    case 1:
                                        automatedActions = _a.sent();
                                        return [2 /*return*/, automatedActions.find(function (a) {
                                                return a.automationStepId === defaultsStep_1.id && a.status === 'active';
                                            })];
                                }
                            });
                        }); }, function (result) { return !!result; }, 'Defaults day-of-month delay action should be created and scheduled')];
                case 25:
                    defaultsAction = _d.sent();
                    createdAutomatedActionIds.push(defaultsAction.id);
                    expectedDefaultsTime = calculateExpectedDelayTime(28, 9, 0) // Should use defaults
                    ;
                    actualDefaultsTime = defaultsAction.processAfter;
                    defaultsTimeDiff = Math.abs(actualDefaultsTime - expectedDefaultsTime);
                    if (defaultsTimeDiff > 60000) { // 1 minute tolerance for processing time
                        throw new Error("Defaults delay time mismatch. Expected: ".concat(new Date(expectedDefaultsTime).toISOString(), ", Got: ").concat(new Date(actualDefaultsTime).toISOString(), ", Diff: ").concat(defaultsTimeDiff, "ms"));
                    }
                    console.log("\u2705 Day-of-month delay with defaults works correctly. Scheduled for: ".concat(new Date(actualDefaultsTime).toISOString()));
                    console.log("✅ All day-of-month delay tests passed successfully!");
                    return [3 /*break*/, 48];
                case 26:
                    // Clean up created resources
                    console.log("Cleaning up test resources...");
                    _d.label = 27;
                case 27:
                    _d.trys.push([27, 46, , 47]);
                    _i = 0, createdAutomatedActionIds_1 = createdAutomatedActionIds;
                    _d.label = 28;
                case 28:
                    if (!(_i < createdAutomatedActionIds_1.length)) return [3 /*break*/, 33];
                    actionId = createdAutomatedActionIds_1[_i];
                    _d.label = 29;
                case 29:
                    _d.trys.push([29, 31, , 32]);
                    return [4 /*yield*/, sdk.api.automated_actions.deleteOne(actionId)];
                case 30:
                    _d.sent();
                    return [3 /*break*/, 32];
                case 31:
                    e_1 = _d.sent();
                    console.warn("Failed to delete automated action ".concat(actionId, ":"), e_1);
                    return [3 /*break*/, 32];
                case 32:
                    _i++;
                    return [3 /*break*/, 28];
                case 33:
                    _b = 0, createdEnduserIds_1 = createdEnduserIds;
                    _d.label = 34;
                case 34:
                    if (!(_b < createdEnduserIds_1.length)) return [3 /*break*/, 39];
                    enduserId = createdEnduserIds_1[_b];
                    _d.label = 35;
                case 35:
                    _d.trys.push([35, 37, , 38]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduserId)];
                case 36:
                    _d.sent();
                    return [3 /*break*/, 38];
                case 37:
                    e_2 = _d.sent();
                    console.warn("Failed to delete enduser ".concat(enduserId, ":"), e_2);
                    return [3 /*break*/, 38];
                case 38:
                    _b++;
                    return [3 /*break*/, 34];
                case 39:
                    _c = 0, createdJourneyIds_1 = createdJourneyIds;
                    _d.label = 40;
                case 40:
                    if (!(_c < createdJourneyIds_1.length)) return [3 /*break*/, 45];
                    journeyId = createdJourneyIds_1[_c];
                    _d.label = 41;
                case 41:
                    _d.trys.push([41, 43, , 44]);
                    return [4 /*yield*/, sdk.api.journeys.deleteOne(journeyId)];
                case 42:
                    _d.sent();
                    return [3 /*break*/, 44];
                case 43:
                    e_3 = _d.sent();
                    console.warn("Failed to delete journey ".concat(journeyId, ":"), e_3);
                    return [3 /*break*/, 44];
                case 44:
                    _c++;
                    return [3 /*break*/, 40];
                case 45: return [3 /*break*/, 47];
                case 46:
                    e_4 = _d.sent();
                    console.warn("Some cleanup operations failed:", e_4);
                    return [3 /*break*/, 47];
                case 47: return [7 /*endfinally*/];
                case 48: return [2 /*return*/];
            }
        });
    });
};
var office_hours_delay_tests = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var createdJourneyIds, createdEnduserIds, createdAutomatedActionIds, createdAvailabilityBlockIds, originalOrg, originalOutOfOfficeHours, tomorrow, tomorrowDayOfWeek, availabilityBlock_1, queriedBlocks, foundBlock, journey1_2, firstStep1_1, officeHoursStep1_1, enduser1_2, delayedAction1, minExpectedDelay, _i, createdAvailabilityBlockIds_1, blockId, e_5, journey2_2, firstStep2_1, officeHoursStep2_1, enduser2_2, delayedAction2, minExpectedDelay2, now, currentDayOfWeek, currentMinutes, currentAvailabilityBlock, journey3_2, firstStep3_1, officeHoursStep3_1, enduser3_2, delayedAction3, expectedProcessAfter, timeDiff, journey4_2, firstStep4_1, officeHoursStep4_1, enduser4_2, delayedAction4, minExpectedDelay4, _b, createdAvailabilityBlockIds_2, blockId, e_6, _c, createdAutomatedActionIds_2, actionId, e_7, _d, createdEnduserIds_2, enduserId, e_8, _e, createdJourneyIds_2, journeyId, e_9, e_10;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    (0, testing_1.log_header)("Office Hours Delay Tests");
                    createdJourneyIds = [];
                    createdEnduserIds = [];
                    createdAutomatedActionIds = [];
                    createdAvailabilityBlockIds = [];
                    return [4 /*yield*/, sdk.api.organizations.getSome()];
                case 1:
                    originalOrg = (_f.sent()).find(function (o) { return o.id === sdk.userInfo.businessId; });
                    if (!originalOrg) {
                        throw new Error("Organization not found");
                    }
                    originalOutOfOfficeHours = originalOrg.outOfOfficeHours || [];
                    _f.label = 2;
                case 2:
                    _f.trys.push([2, , 48, 77]);
                    // Test 1: officeHoursOnly with availability blocks (currently out of office)
                    console.log("Testing officeHoursOnly delay when currently out of office hours...");
                    // Clear any existing out-of-office blocks first
                    return [4 /*yield*/, sdk.api.organizations.updateOne(sdk.userInfo.businessId, { outOfOfficeHours: [] }, { replaceObjectFields: true })
                        // Set up availability blocks that don't include "now" (e.g., only available tomorrow)
                    ];
                case 3:
                    // Clear any existing out-of-office blocks first
                    _f.sent();
                    tomorrow = luxon_1.DateTime.now().setZone('America/New_York').plus({ days: 1 });
                    tomorrowDayOfWeek = tomorrow.weekday === 7 ? 0 : tomorrow.weekday;
                    return [4 /*yield*/, sdk.api.availability_blocks.createOne({
                            entity: 'organization',
                            entityId: sdk.userInfo.businessId,
                            dayOfWeekStartingSundayIndexedByZero: tomorrowDayOfWeek,
                            startTimeInMinutes: 9 * 60,
                            endTimeInMinutes: 17 * 60,
                            index: 0, // Required field for ordering blocks
                        })];
                case 4:
                    availabilityBlock_1 = _f.sent();
                    createdAvailabilityBlockIds.push(availabilityBlock_1.id);
                    // Verify businessId is set (should be automatic)
                    if (!availabilityBlock_1.businessId) {
                        throw new Error('Availability block missing businessId');
                    }
                    if (availabilityBlock_1.businessId !== sdk.userInfo.businessId) {
                        throw new Error("Availability block has wrong businessId: ".concat(availabilityBlock_1.businessId, " vs ").concat(sdk.userInfo.businessId));
                    }
                    return [4 /*yield*/, sdk.api.availability_blocks.getSome({
                            filter: {
                                businessId: sdk.userInfo.businessId,
                                entity: 'organization',
                                entityId: sdk.userInfo.businessId,
                            }
                        })];
                case 5:
                    queriedBlocks = _f.sent();
                    foundBlock = queriedBlocks.find(function (b) { return b.id === availabilityBlock_1.id; });
                    if (!foundBlock) {
                        throw new Error("Created availability block ".concat(availabilityBlock_1.id, " not found in query - possible persistence issue"));
                    }
                    console.log("\u2713 Verified availability block is queryable with businessId=".concat(foundBlock.businessId, ", entity=").concat(foundBlock.entity, ", entityId=").concat(foundBlock.entityId));
                    // Wait for database consistency and worker polling cycle
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 2000)]; // 2 seconds to ensure worker sees the blocks
                case 6:
                    // Wait for database consistency and worker polling cycle
                    _f.sent(); // 2 seconds to ensure worker sees the blocks
                    return [4 /*yield*/, sdk.api.journeys.createOne({
                            title: "Office Hours Delay Test - Availability Blocks"
                        })];
                case 7:
                    journey1_2 = _f.sent();
                    createdJourneyIds.push(journey1_2.id);
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: journey1_2.id,
                            action: { type: 'addEnduserTags', info: { tags: ['office-hours-step-1'] } },
                            events: [{ type: 'onJourneyStart', info: {} }]
                        })];
                case 8:
                    firstStep1_1 = _f.sent();
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: journey1_2.id,
                            action: { type: 'addEnduserTags', info: { tags: ['delayed-for-office-hours'] } },
                            events: [{
                                    type: 'afterAction',
                                    info: {
                                        automationStepId: firstStep1_1.id,
                                        delayInMS: 0,
                                        delay: 0,
                                        unit: 'Minutes',
                                        officeHoursOnly: true, // This should cause a delay
                                    }
                                }]
                        })];
                case 9:
                    officeHoursStep1_1 = _f.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'OfficeHours',
                            lname: 'Test1',
                            email: 'officehours1@example.com'
                        })];
                case 10:
                    enduser1_2 = _f.sent();
                    createdEnduserIds.push(enduser1_2.id);
                    return [4 /*yield*/, sdk.api.endusers.add_to_journey({
                            enduserIds: [enduser1_2.id],
                            journeyId: journey1_2.id
                        })
                        // First wait for the initial onJourneyStart action to finish
                    ];
                case 11:
                    _f.sent();
                    // First wait for the initial onJourneyStart action to finish
                    console.log("Waiting for first step (onJourneyStart) to finish...");
                    return [4 /*yield*/, pollForAutomationProcessing(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var automatedActions, firstAction;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.automated_actions.getSome({
                                            filter: { enduserId: enduser1_2.id, journeyId: journey1_2.id }
                                        })];
                                    case 1:
                                        automatedActions = _a.sent();
                                        firstAction = automatedActions.find(function (a) {
                                            return a.automationStepId === firstStep1_1.id && a.status === 'finished';
                                        });
                                        return [2 /*return*/, firstAction];
                                }
                            });
                        }); }, function (result) { return !!result; }, 'First step (onJourneyStart) should finish', 500, 20)];
                case 12:
                    _f.sent();
                    console.log("✓ First step finished");
                    return [4 /*yield*/, pollForAutomationProcessing(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var automatedActions, action, minExpectedDelay;
                            var _a, _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0: return [4 /*yield*/, sdk.api.automated_actions.getSome({
                                            filter: { enduserId: enduser1_2.id, journeyId: journey1_2.id }
                                        })];
                                    case 1:
                                        automatedActions = _d.sent();
                                        console.log("  Found ".concat(automatedActions.length, " automated actions for enduser ").concat(enduser1_2.id));
                                        action = automatedActions.find(function (a) {
                                            return a.automationStepId === officeHoursStep1_1.id && a.status === 'active';
                                        });
                                        // Return the action only if it has been processed for office hours delay
                                        // (either delayed with flag set, or not delayed if in office hours)
                                        if (!action) {
                                            console.log("  No action found for step ".concat(officeHoursStep1_1.id));
                                            return [2 /*return*/, undefined];
                                        }
                                        console.log("  Action found: processAfter=".concat(new Date(action.processAfter).toISOString(), ", didDelayForOutOfOffice=").concat(action.didDelayForOutOfOffice));
                                        console.log("  Action event type: ".concat((_a = action.event) === null || _a === void 0 ? void 0 : _a.type, ", officeHoursOnly: ").concat((_c = (_b = action.event) === null || _b === void 0 ? void 0 : _b.info) === null || _c === void 0 ? void 0 : _c.officeHoursOnly));
                                        minExpectedDelay = Date.now() + 1000 * 60 * 60 * 5 // 5 hours from now
                                        ;
                                        if (action.didDelayForOutOfOffice || action.processAfter > minExpectedDelay) {
                                            return [2 /*return*/, action];
                                        }
                                        console.log("  Action not yet delayed, continuing to poll...");
                                        // Action exists but hasn't been delayed yet, keep polling
                                        return [2 /*return*/, undefined];
                                }
                            });
                        }); }, function (result) { return !!result; }, 'Office hours delayed action should be created and processed', 500, // Check every 500ms
                        20 // For up to 10 seconds
                        )];
                case 13:
                    delayedAction1 = _f.sent();
                    createdAutomatedActionIds.push(delayedAction1.id);
                    minExpectedDelay = Date.now() + 1000 * 60 * 60 * 6 // At least 6 hours from now
                    ;
                    if (delayedAction1.processAfter <= minExpectedDelay) {
                        throw new Error("Action should be delayed to tomorrow's office hours (at least 6 hours). ProcessAfter: ".concat(new Date(delayedAction1.processAfter).toISOString(), ", Expected beyond: ").concat(new Date(minExpectedDelay).toISOString()));
                    }
                    // Verify didDelayForOutOfOffice flag is set
                    if (!delayedAction1.didDelayForOutOfOffice) {
                        throw new Error('didDelayForOutOfOffice flag should be set to true');
                    }
                    console.log("\u2705 Action correctly delayed for office hours. ProcessAfter: ".concat(new Date(delayedAction1.processAfter).toISOString(), ", didDelayForOutOfOffice: ").concat(delayedAction1.didDelayForOutOfOffice));
                    // Test 2: officeHoursOnly with outOfOfficeHours date range (new feature)
                    console.log("Testing officeHoursOnly delay with outOfOfficeHours date range...");
                    _i = 0, createdAvailabilityBlockIds_1 = createdAvailabilityBlockIds;
                    _f.label = 14;
                case 14:
                    if (!(_i < createdAvailabilityBlockIds_1.length)) return [3 /*break*/, 19];
                    blockId = createdAvailabilityBlockIds_1[_i];
                    _f.label = 15;
                case 15:
                    _f.trys.push([15, 17, , 18]);
                    return [4 /*yield*/, sdk.api.availability_blocks.deleteOne(blockId)];
                case 16:
                    _f.sent();
                    return [3 /*break*/, 18];
                case 17:
                    e_5 = _f.sent();
                    console.warn("Failed to delete availability block ".concat(blockId, ":"), e_5);
                    return [3 /*break*/, 18];
                case 18:
                    _i++;
                    return [3 /*break*/, 14];
                case 19:
                    createdAvailabilityBlockIds = []; // Clear the array
                    // Set organization outOfOfficeHours
                    return [4 /*yield*/, sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
                            outOfOfficeHours: [{
                                    from: new Date(Date.now() - 1000 * 60 * 60),
                                    to: new Date(Date.now() + 1000 * 60 * 60 * 48),
                                    autoreplyText: 'Out of office for testing'
                                }]
                        }, { replaceObjectFields: true })
                        // Wait for database consistency
                    ];
                case 20:
                    // Set organization outOfOfficeHours
                    _f.sent();
                    // Wait for database consistency
                    console.log("Waiting for database updates to propagate...");
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 2000)];
                case 21:
                    _f.sent();
                    return [4 /*yield*/, sdk.api.journeys.createOne({
                            title: "Office Hours Delay Test - OutOfOfficeHours"
                        })];
                case 22:
                    journey2_2 = _f.sent();
                    createdJourneyIds.push(journey2_2.id);
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: journey2_2.id,
                            action: { type: 'addEnduserTags', info: { tags: ['ooo-step-1'] } },
                            events: [{ type: 'onJourneyStart', info: {} }]
                        })];
                case 23:
                    firstStep2_1 = _f.sent();
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: journey2_2.id,
                            action: { type: 'addEnduserTags', info: { tags: ['delayed-for-ooo'] } },
                            events: [{
                                    type: 'afterAction',
                                    info: {
                                        automationStepId: firstStep2_1.id,
                                        delayInMS: 0,
                                        delay: 0,
                                        unit: 'Minutes',
                                        officeHoursOnly: true, // Should delay due to outOfOfficeHours
                                    }
                                }]
                        })];
                case 24:
                    officeHoursStep2_1 = _f.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'OutOfOffice',
                            lname: 'Test2',
                            email: 'ooo2@example.com'
                        })];
                case 25:
                    enduser2_2 = _f.sent();
                    createdEnduserIds.push(enduser2_2.id);
                    return [4 /*yield*/, sdk.api.endusers.add_to_journey({
                            enduserIds: [enduser2_2.id],
                            journeyId: journey2_2.id
                        })
                        // First wait for the initial onJourneyStart action to finish
                    ];
                case 26:
                    _f.sent();
                    // First wait for the initial onJourneyStart action to finish
                    console.log("Waiting for first step (onJourneyStart) to finish...");
                    return [4 /*yield*/, pollForAutomationProcessing(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var automatedActions, firstAction;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.automated_actions.getSome({
                                            filter: { enduserId: enduser2_2.id, journeyId: journey2_2.id }
                                        })];
                                    case 1:
                                        automatedActions = _a.sent();
                                        firstAction = automatedActions.find(function (a) {
                                            return a.automationStepId === firstStep2_1.id && a.status === 'finished';
                                        });
                                        return [2 /*return*/, firstAction];
                                }
                            });
                        }); }, function (result) { return !!result; }, 'First step (onJourneyStart) should finish', 500, 20)];
                case 27:
                    _f.sent();
                    console.log("✓ First step finished");
                    return [4 /*yield*/, pollForAutomationProcessing(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var automatedActions, action, minExpectedDelay_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.automated_actions.getSome({
                                            filter: { enduserId: enduser2_2.id, journeyId: journey2_2.id }
                                        })];
                                    case 1:
                                        automatedActions = _a.sent();
                                        console.log("  Found ".concat(automatedActions.length, " automated actions for enduser ").concat(enduser2_2.id));
                                        console.log("  Action statuses: ".concat(automatedActions.map(function (a) { return "".concat(a.automationStepId.substring(0, 8), ":").concat(a.status); }).join(', ')));
                                        action = automatedActions.find(function (a) {
                                            return a.automationStepId === officeHoursStep2_1.id;
                                        });
                                        if (!action) {
                                            console.log("  No action found for step ".concat(officeHoursStep2_1.id));
                                            return [2 /*return*/, undefined];
                                        }
                                        console.log("  Action found: status=".concat(action.status, ", processAfter=").concat(new Date(action.processAfter).toISOString(), ", didDelayForOutOfOffice=").concat(action.didDelayForOutOfOffice));
                                        // Only accept active or finished actions (not cancelled)
                                        if (action.status === 'cancelled') {
                                            console.log("  Action was cancelled, aborting test");
                                            throw new Error('Action was cancelled - office hours delay logic may have failed');
                                        }
                                        // Check if worker has processed the OOO delay
                                        // Should be delayed at least 48 hours (beyond OOO period)
                                        // Accept action if it's active (waiting to be processed) with delay set
                                        if (action.status === 'active') {
                                            minExpectedDelay_1 = Date.now() + 1000 * 60 * 60 * 47 // At least 47 hours
                                            ;
                                            if (action.didDelayForOutOfOffice || action.processAfter > minExpectedDelay_1) {
                                                return [2 /*return*/, action];
                                            }
                                            console.log("  Action active but not yet delayed, continuing to poll...");
                                            return [2 /*return*/, undefined];
                                        }
                                        // If action is finished/other status, it wasn't delayed properly
                                        console.log("  Action has status ".concat(action.status, " - wasn't delayed for office hours"));
                                        return [2 /*return*/, undefined];
                                }
                            });
                        }); }, function (result) { return !!result; }, 'OutOfOfficeHours delayed action should be created and processed', 500, // Check every 500ms
                        20 // For up to 10 seconds
                        )];
                case 28:
                    delayedAction2 = _f.sent();
                    createdAutomatedActionIds.push(delayedAction2.id);
                    // Verify didDelayForOutOfOffice flag is set
                    if (!delayedAction2.didDelayForOutOfOffice) {
                        throw new Error('didDelayForOutOfOffice flag should be set to true for OOO delay');
                    }
                    minExpectedDelay2 = Date.now() + 1000 * 60 * 60 * 24 // 24 hours
                    ;
                    if (delayedAction2.processAfter <= minExpectedDelay2) {
                        throw new Error("Action should be delayed at least 24 hours for OOO. ProcessAfter: ".concat(new Date(delayedAction2.processAfter).toISOString(), ", Expected beyond: ").concat(new Date(minExpectedDelay2).toISOString()));
                    }
                    console.log("\u2705 Action correctly delayed for outOfOfficeHours. ProcessAfter: ".concat(new Date(delayedAction2.processAfter).toISOString(), ", didDelayForOutOfOffice: ").concat(delayedAction2.didDelayForOutOfOffice));
                    // Test 3: officeHoursOnly when currently IN office hours (should not delay beyond base)
                    console.log("Testing officeHoursOnly when currently IN office hours...");
                    // Clear outOfOfficeHours
                    return [4 /*yield*/, sdk.api.organizations.updateOne(sdk.userInfo.businessId, { outOfOfficeHours: [] }, { replaceObjectFields: true })
                        // Create availability block for "right now"
                    ];
                case 29:
                    // Clear outOfOfficeHours
                    _f.sent();
                    now = luxon_1.DateTime.now().setZone('America/New_York');
                    currentDayOfWeek = now.weekday === 7 ? 0 : now.weekday;
                    currentMinutes = now.hour * 60 + now.minute;
                    return [4 /*yield*/, sdk.api.availability_blocks.createOne({
                            entity: 'organization',
                            entityId: sdk.userInfo.businessId,
                            dayOfWeekStartingSundayIndexedByZero: currentDayOfWeek,
                            startTimeInMinutes: Math.max(0, currentMinutes - 30),
                            endTimeInMinutes: Math.min(24 * 60 - 1, currentMinutes + 120),
                            index: 0, // Required field for ordering blocks
                        })];
                case 30:
                    currentAvailabilityBlock = _f.sent();
                    createdAvailabilityBlockIds.push(currentAvailabilityBlock.id);
                    // Verify businessId is set (should be automatic)
                    if (!currentAvailabilityBlock.businessId) {
                        throw new Error('Availability block missing businessId');
                    }
                    // Wait for database consistency before triggering journey
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1000)]; // 1 second for DB to fully persist and index
                case 31:
                    // Wait for database consistency before triggering journey
                    _f.sent(); // 1 second for DB to fully persist and index
                    return [4 /*yield*/, sdk.api.journeys.createOne({
                            title: "Office Hours Delay Test - In Office"
                        })];
                case 32:
                    journey3_2 = _f.sent();
                    createdJourneyIds.push(journey3_2.id);
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: journey3_2.id,
                            action: { type: 'addEnduserTags', info: { tags: ['in-office-step-1'] } },
                            events: [{ type: 'onJourneyStart', info: {} }]
                        })];
                case 33:
                    firstStep3_1 = _f.sent();
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: journey3_2.id,
                            action: { type: 'addEnduserTags', info: { tags: ['not-delayed-in-office'] } },
                            events: [{
                                    type: 'afterAction',
                                    info: {
                                        automationStepId: firstStep3_1.id,
                                        delayInMS: 0,
                                        delay: 0,
                                        unit: 'Minutes',
                                        officeHoursOnly: true, // Should NOT add extra delay
                                    }
                                }]
                        })];
                case 34:
                    officeHoursStep3_1 = _f.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'InOffice',
                            lname: 'Test3',
                            email: 'inoffice3@example.com'
                        })];
                case 35:
                    enduser3_2 = _f.sent();
                    createdEnduserIds.push(enduser3_2.id);
                    return [4 /*yield*/, sdk.api.endusers.add_to_journey({
                            enduserIds: [enduser3_2.id],
                            journeyId: journey3_2.id
                        })
                        // First wait for the initial onJourneyStart action to finish
                    ];
                case 36:
                    _f.sent();
                    // First wait for the initial onJourneyStart action to finish
                    console.log("Waiting for first step (onJourneyStart) to finish...");
                    return [4 /*yield*/, pollForAutomationProcessing(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var automatedActions, firstAction;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.automated_actions.getSome({
                                            filter: { enduserId: enduser3_2.id, journeyId: journey3_2.id }
                                        })];
                                    case 1:
                                        automatedActions = _a.sent();
                                        firstAction = automatedActions.find(function (a) {
                                            return a.automationStepId === firstStep3_1.id && a.status === 'finished';
                                        });
                                        return [2 /*return*/, firstAction];
                                }
                            });
                        }); }, function (result) { return !!result; }, 'First step (onJourneyStart) should finish', 500, 20)];
                case 37:
                    _f.sent();
                    console.log("✓ First step finished");
                    return [4 /*yield*/, pollForAutomationProcessing(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var automatedActions;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.automated_actions.getSome({
                                            filter: { enduserId: enduser3_2.id, journeyId: journey3_2.id }
                                        })];
                                    case 1:
                                        automatedActions = _a.sent();
                                        return [2 /*return*/, automatedActions.find(function (a) {
                                                return a.automationStepId === officeHoursStep3_1.id && a.status === 'active';
                                            })];
                                }
                            });
                        }); }, function (result) { return !!result; }, 'In-office action should be created without extra delay')];
                case 38:
                    delayedAction3 = _f.sent();
                    createdAutomatedActionIds.push(delayedAction3.id);
                    expectedProcessAfter = Date.now();
                    timeDiff = Math.abs(delayedAction3.processAfter - expectedProcessAfter);
                    if (timeDiff > 5000) {
                        throw new Error("Action should not be delayed when in office hours (base delay is 0). ProcessAfter: ".concat(new Date(delayedAction3.processAfter).toISOString(), ", Expected around: ").concat(new Date(expectedProcessAfter).toISOString(), ", Diff: ").concat(timeDiff, "ms"));
                    }
                    // didDelayForOutOfOffice should NOT be set since we didn't delay
                    if (delayedAction3.didDelayForOutOfOffice) {
                        throw new Error('didDelayForOutOfOffice should not be set when in office hours');
                    }
                    console.log("\u2705 Action correctly NOT delayed when in office hours. ProcessAfter: ".concat(new Date(delayedAction3.processAfter).toISOString(), ", didDelayForOutOfOffice: ").concat(delayedAction3.didDelayForOutOfOffice));
                    // Test 4: Both availability blocks AND outOfOfficeHours (OOO should take precedence)
                    console.log("Testing officeHoursOnly with BOTH availability blocks and outOfOfficeHours...");
                    // Keep the current availability block from Test 3 (for "right now")
                    // Add a short outOfOfficeHours period that overlaps with the availability block
                    // This tests that OOO takes precedence even when we're technically "in office hours"
                    return [4 /*yield*/, sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
                            outOfOfficeHours: [{
                                    from: new Date(Date.now() - 1000 * 60 * 5),
                                    to: new Date(Date.now() + 1000 * 60 * 60 * 2),
                                    autoreplyText: 'Emergency out of office'
                                }]
                        }, { replaceObjectFields: true })
                        // Wait for database consistency
                    ];
                case 39:
                    // Keep the current availability block from Test 3 (for "right now")
                    // Add a short outOfOfficeHours period that overlaps with the availability block
                    // This tests that OOO takes precedence even when we're technically "in office hours"
                    _f.sent();
                    // Wait for database consistency
                    console.log("Waiting for database updates to propagate...");
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 2000)];
                case 40:
                    _f.sent();
                    return [4 /*yield*/, sdk.api.journeys.createOne({
                            title: "Office Hours Delay Test - OOO Precedence"
                        })];
                case 41:
                    journey4_2 = _f.sent();
                    createdJourneyIds.push(journey4_2.id);
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: journey4_2.id,
                            action: { type: 'addEnduserTags', info: { tags: ['ooo-precedence-step-1'] } },
                            events: [{ type: 'onJourneyStart', info: {} }]
                        })];
                case 42:
                    firstStep4_1 = _f.sent();
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: journey4_2.id,
                            action: { type: 'addEnduserTags', info: { tags: ['delayed-for-ooo-precedence'] } },
                            events: [{
                                    type: 'afterAction',
                                    info: {
                                        automationStepId: firstStep4_1.id,
                                        delayInMS: 0,
                                        delay: 0,
                                        unit: 'Minutes',
                                        officeHoursOnly: true, // Should delay due to OOO taking precedence
                                    }
                                }]
                        })];
                case 43:
                    officeHoursStep4_1 = _f.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'OOOPrecedence',
                            lname: 'Test4',
                            email: 'precedence4@example.com'
                        })];
                case 44:
                    enduser4_2 = _f.sent();
                    createdEnduserIds.push(enduser4_2.id);
                    return [4 /*yield*/, sdk.api.endusers.add_to_journey({
                            enduserIds: [enduser4_2.id],
                            journeyId: journey4_2.id
                        })
                        // First wait for the initial onJourneyStart action to finish
                    ];
                case 45:
                    _f.sent();
                    // First wait for the initial onJourneyStart action to finish
                    console.log("Waiting for first step (onJourneyStart) to finish...");
                    return [4 /*yield*/, pollForAutomationProcessing(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var automatedActions, firstAction;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.automated_actions.getSome({
                                            filter: { enduserId: enduser4_2.id, journeyId: journey4_2.id }
                                        })];
                                    case 1:
                                        automatedActions = _a.sent();
                                        firstAction = automatedActions.find(function (a) {
                                            return a.automationStepId === firstStep4_1.id && a.status === 'finished';
                                        });
                                        return [2 /*return*/, firstAction];
                                }
                            });
                        }); }, function (result) { return !!result; }, 'First step (onJourneyStart) should finish', 500, 20)];
                case 46:
                    _f.sent();
                    console.log("✓ First step finished");
                    return [4 /*yield*/, pollForAutomationProcessing(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var automatedActions, action, minExpectedDelay4;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.automated_actions.getSome({
                                            filter: { enduserId: enduser4_2.id, journeyId: journey4_2.id }
                                        })];
                                    case 1:
                                        automatedActions = _a.sent();
                                        action = automatedActions.find(function (a) {
                                            return a.automationStepId === officeHoursStep4_1.id;
                                        });
                                        if (!action) {
                                            return [2 /*return*/, undefined];
                                        }
                                        minExpectedDelay4 = Date.now() + 1000 * 60 * 60 // 1 hour
                                        ;
                                        if (action.didDelayForOutOfOffice || action.processAfter > minExpectedDelay4) {
                                            return [2 /*return*/, action];
                                        }
                                        return [2 /*return*/, undefined];
                                }
                            });
                        }); }, function (result) { return !!result; }, 'OOO precedence action should be delayed', 500, 20)];
                case 47:
                    delayedAction4 = _f.sent();
                    createdAutomatedActionIds.push(delayedAction4.id);
                    // Verify didDelayForOutOfOffice flag is set
                    if (!delayedAction4.didDelayForOutOfOffice) {
                        throw new Error('didDelayForOutOfOffice flag should be set when OOO takes precedence over availability blocks');
                    }
                    minExpectedDelay4 = Date.now() + 1000 * 60 * 60 // 1 hour
                    ;
                    if (delayedAction4.processAfter <= minExpectedDelay4) {
                        throw new Error("Action should be delayed for OOO even with availability blocks. ProcessAfter: ".concat(new Date(delayedAction4.processAfter).toISOString(), ", Expected beyond: ").concat(new Date(minExpectedDelay4).toISOString()));
                    }
                    console.log("\u2705 outOfOfficeHours correctly takes precedence over availability blocks. ProcessAfter: ".concat(new Date(delayedAction4.processAfter).toISOString(), ", didDelayForOutOfOffice: ").concat(delayedAction4.didDelayForOutOfOffice));
                    console.log("✅ All office hours delay tests passed successfully!");
                    return [3 /*break*/, 77];
                case 48:
                    // Clean up created resources
                    console.log("Cleaning up office hours test resources...");
                    _f.label = 49;
                case 49:
                    _f.trys.push([49, 75, , 76]);
                    // Restore original outOfOfficeHours
                    return [4 /*yield*/, sdk.api.organizations.updateOne(sdk.userInfo.businessId, { outOfOfficeHours: originalOutOfOfficeHours }, { replaceObjectFields: true })
                        // Delete availability blocks
                    ];
                case 50:
                    // Restore original outOfOfficeHours
                    _f.sent();
                    _b = 0, createdAvailabilityBlockIds_2 = createdAvailabilityBlockIds;
                    _f.label = 51;
                case 51:
                    if (!(_b < createdAvailabilityBlockIds_2.length)) return [3 /*break*/, 56];
                    blockId = createdAvailabilityBlockIds_2[_b];
                    _f.label = 52;
                case 52:
                    _f.trys.push([52, 54, , 55]);
                    return [4 /*yield*/, sdk.api.availability_blocks.deleteOne(blockId)];
                case 53:
                    _f.sent();
                    return [3 /*break*/, 55];
                case 54:
                    e_6 = _f.sent();
                    console.warn("Failed to delete availability block ".concat(blockId, ":"), e_6);
                    return [3 /*break*/, 55];
                case 55:
                    _b++;
                    return [3 /*break*/, 51];
                case 56:
                    _c = 0, createdAutomatedActionIds_2 = createdAutomatedActionIds;
                    _f.label = 57;
                case 57:
                    if (!(_c < createdAutomatedActionIds_2.length)) return [3 /*break*/, 62];
                    actionId = createdAutomatedActionIds_2[_c];
                    _f.label = 58;
                case 58:
                    _f.trys.push([58, 60, , 61]);
                    return [4 /*yield*/, sdk.api.automated_actions.deleteOne(actionId)];
                case 59:
                    _f.sent();
                    return [3 /*break*/, 61];
                case 60:
                    e_7 = _f.sent();
                    console.warn("Failed to delete automated action ".concat(actionId, ":"), e_7);
                    return [3 /*break*/, 61];
                case 61:
                    _c++;
                    return [3 /*break*/, 57];
                case 62:
                    _d = 0, createdEnduserIds_2 = createdEnduserIds;
                    _f.label = 63;
                case 63:
                    if (!(_d < createdEnduserIds_2.length)) return [3 /*break*/, 68];
                    enduserId = createdEnduserIds_2[_d];
                    _f.label = 64;
                case 64:
                    _f.trys.push([64, 66, , 67]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduserId)];
                case 65:
                    _f.sent();
                    return [3 /*break*/, 67];
                case 66:
                    e_8 = _f.sent();
                    console.warn("Failed to delete enduser ".concat(enduserId, ":"), e_8);
                    return [3 /*break*/, 67];
                case 67:
                    _d++;
                    return [3 /*break*/, 63];
                case 68:
                    _e = 0, createdJourneyIds_2 = createdJourneyIds;
                    _f.label = 69;
                case 69:
                    if (!(_e < createdJourneyIds_2.length)) return [3 /*break*/, 74];
                    journeyId = createdJourneyIds_2[_e];
                    _f.label = 70;
                case 70:
                    _f.trys.push([70, 72, , 73]);
                    return [4 /*yield*/, sdk.api.journeys.deleteOne(journeyId)];
                case 71:
                    _f.sent();
                    return [3 /*break*/, 73];
                case 72:
                    e_9 = _f.sent();
                    console.warn("Failed to delete journey ".concat(journeyId, ":"), e_9);
                    return [3 /*break*/, 73];
                case 73:
                    _e++;
                    return [3 /*break*/, 69];
                case 74: return [3 /*break*/, 76];
                case 75:
                    e_10 = _f.sent();
                    console.warn("Some cleanup operations failed:", e_10);
                    return [3 /*break*/, 76];
                case 76: return [7 /*endfinally*/];
                case 77: return [2 /*return*/];
            }
        });
    });
};
// Polling helper function for automation processing verification
var pollForAutomationProcessing = function (fetchFn, evaluateFn, description, intervalMs, maxIterations) {
    if (intervalMs === void 0) { intervalMs = 500; }
    if (maxIterations === void 0) { maxIterations = 20; }
    return __awaiter(void 0, void 0, void 0, function () {
        var lastResult, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < maxIterations)) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, intervalMs)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fetchFn()];
                case 3:
                    lastResult = _a.sent();
                    if (evaluateFn(lastResult)) {
                        console.log("\u2713 ".concat(description, " - completed after ").concat((i + 1) * intervalMs, "ms"));
                        return [2 /*return*/, lastResult];
                    }
                    // Log progress every 2.5 seconds
                    if (i > 0 && (i + 1) % 5 === 0) {
                        console.log("Still waiting for: ".concat(description, " - ").concat((i + 1) * intervalMs, "ms elapsed"));
                    }
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 1];
                case 5:
                    console.log('Final polling result:', lastResult);
                    throw new Error("Polling timeout: ".concat(description, " - waited ").concat(maxIterations * intervalMs, "ms"));
            }
        });
    });
};
// Allow running this test file independently
if (require.main === module) {
    console.log("\uD83C\uDF10 Using API URL: ".concat(host));
    var sdk_2 = new sdk_1.Session({ host: host });
    var sdkNonAdmin_1 = new sdk_1.Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, setup_1.setup_tests)(sdk_2, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, exports.afteraction_day_of_month_delay_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Day-of-month delay test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Day-of-month delay test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=afteraction_day_of_month_delay.test.js.map