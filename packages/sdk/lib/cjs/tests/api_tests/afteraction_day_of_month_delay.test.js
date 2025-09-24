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
        var createdJourneyIds, createdEnduserIds, createdAutomatedActionIds, calculateExpectedDelayTime, journey1_1, firstStep, dayOfMonthStep_1, enduser1_1, delayedAction, expectedDelayTime, actualDelayTime, timeDiff, journey2_1, firstStep2, dayOfMonthStep2_1, enduser2_1, delayedAction2, expectedDelayTime2, actualDelayTime2, timeDiff2, journey3_1, firstStep3, regularDelayStep_1, enduser3_1, regularDelayedAction, expectedRegularDelayTime, actualRegularDelayTime, regularTimeDiff, journey4_1, firstStep4, defaultsStep_1, enduser4_1, defaultsAction, expectedDefaultsTime, actualDefaultsTime, defaultsTimeDiff, _i, createdAutomatedActionIds_1, actionId, e_1, _b, createdEnduserIds_1, enduserId, e_2, _c, createdJourneyIds_1, journeyId, e_3, e_4;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    (0, testing_1.log_header)("AfterAction Day of Month Delay Tests");
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
exports.afteraction_day_of_month_delay_tests = afteraction_day_of_month_delay_tests;
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