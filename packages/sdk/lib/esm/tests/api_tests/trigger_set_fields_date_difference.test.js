var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var host = process.env.API_URL || 'http://localhost:8080';
// Test function that can be called independently
export var trigger_set_fields_date_difference_tests = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var testEnduser, triggerId, error_1, cleanupError_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_header("Trigger Set Fields Date Difference Tests");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 9, 10, 18]);
                    // Test 1: Setup - Create enduser with date fields
                    return [4 /*yield*/, async_test('setup - create test enduser with date fields', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, sdk.api.endusers.createOne({
                                            fields: {
                                                startDate: '2024-01-15T10:00:00Z',
                                                endDate: '01-25-2024', // MM-DD-YYYY format (10 days after startDate)
                                            }
                                        })];
                                    case 1:
                                        testEnduser = _c.sent();
                                        return [2 /*return*/, !!testEnduser.id && !!((_a = testEnduser.fields) === null || _a === void 0 ? void 0 : _a.startDate) && !!((_b = testEnduser.fields) === null || _b === void 0 ? void 0 : _b.endDate)];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 2: Create trigger with Date Difference - ISO to MM-DD-YYYY
                    ];
                case 2:
                    // Test 1: Setup - Create enduser with date fields
                    _b.sent();
                    // Test 2: Create trigger with Date Difference - ISO to MM-DD-YYYY
                    return [4 /*yield*/, async_test('create trigger - date difference between two custom fields', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var trigger;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                                            title: "Date Difference Test ".concat(Date.now()),
                                            status: 'Active',
                                            event: {
                                                type: 'Field Equals',
                                                info: {
                                                    field: 'triggerTest',
                                                    value: 'calculate-days'
                                                }
                                            },
                                            action: {
                                                type: 'Set Fields',
                                                info: {
                                                    fields: [{
                                                            name: 'daysBetween',
                                                            type: 'Date Difference',
                                                            value: '',
                                                            dateDifferenceOptions: {
                                                                date1: 'startDate',
                                                                date2: 'endDate', // Reference to field containing MM-DD-YYYY
                                                            }
                                                        }]
                                                }
                                            }
                                        })];
                                    case 1:
                                        trigger = _a.sent();
                                        triggerId = trigger.id;
                                        return [2 /*return*/, !!trigger.id];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 3: Trigger the action and verify calculation
                    ];
                case 3:
                    // Test 2: Create trigger with Date Difference - ISO to MM-DD-YYYY
                    _b.sent();
                    // Test 3: Trigger the action and verify calculation
                    return [4 /*yield*/, async_test('trigger action - verify date difference is calculated correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var i, updatedEnduser, daysBetween;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, sdk.api.endusers.updateOne(testEnduser.id, {
                                            fields: __assign(__assign({}, testEnduser.fields), { triggerTest: 'calculate-days' })
                                        })
                                        // Wait up to 10 seconds for trigger to process
                                    ];
                                    case 1:
                                        _b.sent();
                                        i = 0;
                                        _b.label = 2;
                                    case 2:
                                        if (!(i < 10)) return [3 /*break*/, 6];
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                                    case 3:
                                        _b.sent();
                                        return [4 /*yield*/, sdk.api.endusers.getOne(testEnduser.id)];
                                    case 4:
                                        updatedEnduser = _b.sent();
                                        if (((_a = updatedEnduser.fields) === null || _a === void 0 ? void 0 : _a.daysBetween) !== undefined) {
                                            console.log("\u2713 Found daysBetween field after ".concat(i + 1, " seconds: ").concat(updatedEnduser.fields.daysBetween));
                                            daysBetween = Number(updatedEnduser.fields.daysBetween);
                                            if (daysBetween === 10) {
                                                console.log("\u2713 Date difference calculated correctly: ".concat(daysBetween, " days"));
                                                return [2 /*return*/, true];
                                            }
                                            else {
                                                console.log("\u274C Unexpected date difference: ".concat(daysBetween, " (expected 10)"));
                                                return [2 /*return*/, false];
                                            }
                                        }
                                        _b.label = 5;
                                    case 5:
                                        i++;
                                        return [3 /*break*/, 2];
                                    case 6:
                                        console.log("\u274C daysBetween field not set after 10 seconds");
                                        return [2 /*return*/, false];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 4: Test with $now
                    ];
                case 4:
                    // Test 3: Trigger the action and verify calculation
                    _b.sent();
                    // Test 4: Test with $now
                    return [4 /*yield*/, async_test('create trigger - date difference with $now', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var trigger;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!triggerId) return [3 /*break*/, 2];
                                        return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(triggerId)];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                                            title: "Date Difference $now Test ".concat(Date.now()),
                                            status: 'Active',
                                            event: {
                                                type: 'Field Equals',
                                                info: {
                                                    field: 'triggerTest2',
                                                    value: 'calculate-days-now'
                                                }
                                            },
                                            action: {
                                                type: 'Set Fields',
                                                info: {
                                                    fields: [{
                                                            name: 'daysSinceStart',
                                                            type: 'Date Difference',
                                                            value: '',
                                                            dateDifferenceOptions: {
                                                                date1: 'startDate',
                                                                date2: '$now',
                                                            }
                                                        }]
                                                }
                                            }
                                        })];
                                    case 3:
                                        trigger = _a.sent();
                                        triggerId = trigger.id;
                                        return [2 /*return*/, !!trigger.id];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 5: Trigger with $now and verify
                    ];
                case 5:
                    // Test 4: Test with $now
                    _b.sent();
                    // Test 5: Trigger with $now and verify
                    return [4 /*yield*/, async_test('trigger action - verify $now works correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var i, updatedEnduser, daysSinceStart;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, sdk.api.endusers.updateOne(testEnduser.id, {
                                            fields: __assign(__assign({}, testEnduser.fields), { triggerTest2: 'calculate-days-now' })
                                        })
                                        // Wait up to 10 seconds for trigger to process
                                    ];
                                    case 1:
                                        _b.sent();
                                        i = 0;
                                        _b.label = 2;
                                    case 2:
                                        if (!(i < 10)) return [3 /*break*/, 6];
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                                    case 3:
                                        _b.sent();
                                        return [4 /*yield*/, sdk.api.endusers.getOne(testEnduser.id)];
                                    case 4:
                                        updatedEnduser = _b.sent();
                                        if (((_a = updatedEnduser.fields) === null || _a === void 0 ? void 0 : _a.daysSinceStart) !== undefined) {
                                            daysSinceStart = Number(updatedEnduser.fields.daysSinceStart);
                                            console.log("\u2713 Found daysSinceStart field after ".concat(i + 1, " seconds: ").concat(daysSinceStart));
                                            // Should be approximately 680+ days from 2024-01-15 to 2025-09-30 (current test date)
                                            // We'll accept any reasonable value > 600 days
                                            if (daysSinceStart > 600) {
                                                console.log("\u2713 Date difference with $now calculated correctly: ".concat(daysSinceStart, " days"));
                                                return [2 /*return*/, true];
                                            }
                                            else {
                                                console.log("\u274C Unexpected date difference with $now: ".concat(daysSinceStart));
                                                return [2 /*return*/, false];
                                            }
                                        }
                                        _b.label = 5;
                                    case 5:
                                        i++;
                                        return [3 /*break*/, 2];
                                    case 6:
                                        console.log("\u274C daysSinceStart field not set after 10 seconds");
                                        return [2 /*return*/, false];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 6: Test with hardcoded date strings
                    ];
                case 6:
                    // Test 5: Trigger with $now and verify
                    _b.sent();
                    // Test 6: Test with hardcoded date strings
                    return [4 /*yield*/, async_test('create trigger - date difference with hardcoded dates', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var trigger;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!triggerId) return [3 /*break*/, 2];
                                        return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(triggerId)];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                                            title: "Date Difference Hardcoded Test ".concat(Date.now()),
                                            status: 'Active',
                                            event: {
                                                type: 'Field Equals',
                                                info: {
                                                    field: 'triggerTest3',
                                                    value: 'calculate-days-hardcoded'
                                                }
                                            },
                                            action: {
                                                type: 'Set Fields',
                                                info: {
                                                    fields: [{
                                                            name: 'hardcodedDays',
                                                            type: 'Date Difference',
                                                            value: '',
                                                            dateDifferenceOptions: {
                                                                date1: '2024-01-01T00:00:00Z',
                                                                date2: '01-31-2024', // MM-DD-YYYY (30 days later)
                                                            }
                                                        }]
                                                }
                                            }
                                        })];
                                    case 3:
                                        trigger = _a.sent();
                                        triggerId = trigger.id;
                                        return [2 /*return*/, !!trigger.id];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 7: Trigger with hardcoded dates and verify
                    ];
                case 7:
                    // Test 6: Test with hardcoded date strings
                    _b.sent();
                    // Test 7: Trigger with hardcoded dates and verify
                    return [4 /*yield*/, async_test('trigger action - verify hardcoded dates work correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var i, updatedEnduser, hardcodedDays;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, sdk.api.endusers.updateOne(testEnduser.id, {
                                            fields: __assign(__assign({}, testEnduser.fields), { triggerTest3: 'calculate-days-hardcoded' })
                                        })
                                        // Wait up to 10 seconds for trigger to process
                                    ];
                                    case 1:
                                        _b.sent();
                                        i = 0;
                                        _b.label = 2;
                                    case 2:
                                        if (!(i < 10)) return [3 /*break*/, 6];
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                                    case 3:
                                        _b.sent();
                                        return [4 /*yield*/, sdk.api.endusers.getOne(testEnduser.id)];
                                    case 4:
                                        updatedEnduser = _b.sent();
                                        if (((_a = updatedEnduser.fields) === null || _a === void 0 ? void 0 : _a.hardcodedDays) !== undefined) {
                                            hardcodedDays = Number(updatedEnduser.fields.hardcodedDays);
                                            console.log("\u2713 Found hardcodedDays field after ".concat(i + 1, " seconds: ").concat(hardcodedDays));
                                            // Should be 30 days between 2024-01-01 and 2024-01-31
                                            if (hardcodedDays === 30) {
                                                console.log("\u2713 Date difference with hardcoded dates calculated correctly: ".concat(hardcodedDays, " days"));
                                                return [2 /*return*/, true];
                                            }
                                            else {
                                                console.log("\u274C Unexpected date difference: ".concat(hardcodedDays, " (expected 30)"));
                                                return [2 /*return*/, false];
                                            }
                                        }
                                        _b.label = 5;
                                    case 5:
                                        i++;
                                        return [3 /*break*/, 2];
                                    case 6:
                                        console.log("\u274C hardcodedDays field not set after 10 seconds");
                                        return [2 /*return*/, false];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })];
                case 8:
                    // Test 7: Trigger with hardcoded dates and verify
                    _b.sent();
                    console.log("✅ All trigger set fields date difference tests passed!");
                    return [3 /*break*/, 18];
                case 9:
                    error_1 = _b.sent();
                    console.error('Test execution error:', error_1);
                    throw error_1;
                case 10:
                    // Cleanup
                    console.log("🧹 Cleaning up test resources...");
                    _b.label = 11;
                case 11:
                    _b.trys.push([11, 16, , 17]);
                    if (!triggerId) return [3 /*break*/, 13];
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(triggerId)];
                case 12:
                    _b.sent();
                    _b.label = 13;
                case 13:
                    if (!(testEnduser === null || testEnduser === void 0 ? void 0 : testEnduser.id)) return [3 /*break*/, 15];
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(testEnduser.id)];
                case 14:
                    _b.sent();
                    _b.label = 15;
                case 15: return [3 /*break*/, 17];
                case 16:
                    cleanupError_1 = _b.sent();
                    console.error('Cleanup error (non-fatal):', cleanupError_1);
                    return [3 /*break*/, 17];
                case 17: return [7 /*endfinally*/];
                case 18: return [2 /*return*/];
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
                    return [4 /*yield*/, trigger_set_fields_date_difference_tests({ sdk: sdk_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Trigger set fields date difference test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Trigger set fields date difference test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=trigger_set_fields_date_difference.test.js.map