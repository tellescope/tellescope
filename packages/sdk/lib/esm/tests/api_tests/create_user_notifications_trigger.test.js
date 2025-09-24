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
export var create_user_notifications_trigger_tests = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var testEnduser, triggerId, formId, error_1, testNotifications, _i, testNotifications_1, notification, cleanupError_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_header("Create User Notifications Trigger Tests");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, 6, 21]);
                    // Test 1: Setup - Create enduser assigned to the authenticated user
                    return [4 /*yield*/, async_test('setup - create test enduser assigned to authenticated user', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, sdk.api.endusers.createOne({
                                            assignedTo: [sdk.userInfo.id]
                                        })];
                                    case 1:
                                        testEnduser = _b.sent();
                                        return [2 /*return*/, ((_a = testEnduser.assignedTo) === null || _a === void 0 ? void 0 : _a.length) === 1 && testEnduser.assignedTo[0] === sdk.userInfo.id];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // set up trigger
                    ];
                case 2:
                    // Test 1: Setup - Create enduser assigned to the authenticated user
                    _b.sent();
                    // set up trigger
                    return [4 /*yield*/, async_test('create trigger - field equals event', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var trigger;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                                            title: "User Notification Test ".concat(Date.now()),
                                            status: 'Active',
                                            event: {
                                                type: 'Field Equals',
                                                info: {
                                                    field: '0',
                                                    value: 'trigger-test'
                                                }
                                            },
                                            action: {
                                                type: 'Create User Notifications',
                                                info: {
                                                    message: 'Field equals notification',
                                                    notificationType: 'field-equals-notification',
                                                    careTeamOnly: true,
                                                    maxUsers: 1
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
                        // Test 4: Submit form and verify notification
                    ];
                case 3:
                    // set up trigger
                    _b.sent();
                    // Test 4: Submit form and verify notification
                    return [4 /*yield*/, async_test('submit form - verify notification created', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var i, notifications, notification, hasCorrectEnduser;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, sdk.api.endusers.updateOne(testEnduser.id, {
                                            fields: {
                                                '0': 'trigger-test'
                                            }
                                        })
                                        // Wait up to 10 seconds for notification
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
                                        return [4 /*yield*/, sdk.api.user_notifications.getSome({ filter: {
                                                    type: 'field-equals-notification',
                                                    userId: sdk.userInfo.id
                                                } })];
                                    case 4:
                                        notifications = _b.sent();
                                        if (notifications.length > 0) {
                                            console.log("\u2713 Found notification after ".concat(i + 1, " seconds"));
                                            notification = notifications[0];
                                            // Verify notification structure and relatedRecords
                                            console.log("Notification details:");
                                            console.log("  - Type: ".concat(notification.type));
                                            console.log("  - User ID: ".concat(notification.userId));
                                            console.log("  - Message: ".concat(notification.message));
                                            console.log("  - Related Records: ".concat(JSON.stringify(notification.relatedRecords)));
                                            hasCorrectEnduser = (_a = notification.relatedRecords) === null || _a === void 0 ? void 0 : _a.some(function (record) {
                                                return record.type === 'enduser' && record.id === testEnduser.id;
                                            });
                                            if (!hasCorrectEnduser) {
                                                console.log("\u274C Notification does not contain correct enduser ID");
                                                console.log("   Expected enduser ID: ".concat(testEnduser.id));
                                                console.log("   Found related records: ".concat(JSON.stringify(notification.relatedRecords)));
                                                return [2 /*return*/, false];
                                            }
                                            console.log("\u2713 Notification correctly associated with enduser ".concat(testEnduser.id));
                                            return [2 /*return*/, true];
                                        }
                                        _b.label = 5;
                                    case 5:
                                        i++;
                                        return [3 /*break*/, 2];
                                    case 6:
                                        console.log("\u274C No notification found after 10 seconds");
                                        return [2 /*return*/, false];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })];
                case 4:
                    // Test 4: Submit form and verify notification
                    _b.sent();
                    console.log("✅ Create User Notifications trigger test passed!");
                    return [3 /*break*/, 21];
                case 5:
                    error_1 = _b.sent();
                    console.error('Test execution error:', error_1);
                    throw error_1;
                case 6:
                    // Cleanup
                    console.log("🧹 Cleaning up test resources...");
                    _b.label = 7;
                case 7:
                    _b.trys.push([7, 19, , 20]);
                    if (!triggerId) return [3 /*break*/, 9];
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(triggerId)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9:
                    if (!formId) return [3 /*break*/, 11];
                    return [4 /*yield*/, sdk.api.forms.deleteOne(formId)];
                case 10:
                    _b.sent();
                    _b.label = 11;
                case 11:
                    if (!(testEnduser === null || testEnduser === void 0 ? void 0 : testEnduser.id)) return [3 /*break*/, 13];
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(testEnduser.id)];
                case 12:
                    _b.sent();
                    _b.label = 13;
                case 13: return [4 /*yield*/, sdk.api.user_notifications.getSome({})];
                case 14:
                    testNotifications = (_b.sent())
                        .filter(function (n) { return n.type === 'field-equals-notification'; });
                    _i = 0, testNotifications_1 = testNotifications;
                    _b.label = 15;
                case 15:
                    if (!(_i < testNotifications_1.length)) return [3 /*break*/, 18];
                    notification = testNotifications_1[_i];
                    return [4 /*yield*/, sdk.api.user_notifications.deleteOne(notification.id)];
                case 16:
                    _b.sent();
                    _b.label = 17;
                case 17:
                    _i++;
                    return [3 /*break*/, 15];
                case 18: return [3 /*break*/, 20];
                case 19:
                    cleanupError_1 = _b.sent();
                    console.error('Cleanup error (non-fatal):', cleanupError_1);
                    return [3 /*break*/, 20];
                case 20: return [7 /*endfinally*/];
                case 21: return [2 /*return*/];
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
                    return [4 /*yield*/, create_user_notifications_trigger_tests({ sdk: sdk_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Create User Notifications trigger test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Create User Notifications trigger test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=create_user_notifications_trigger.test.js.map