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
var host = process.env.TEST_URL || 'http://localhost:8080';
// Simple test function that can be called independently
export var create_user_notifications_trigger_simple_tests = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var testEnduser, triggerId, formId, error_1, testNotifications, _i, testNotifications_1, notification, cleanupError_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_header("Create User Notifications Trigger - Simple Test");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 22]);
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
                        // Test 2: Create form and field
                    ];
                case 2:
                    // Test 1: Setup - Create enduser assigned to the authenticated user
                    _b.sent();
                    // Test 2: Create form and field
                    return [4 /*yield*/, async_test('setup - create test form and field', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var form;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.forms.createOne({
                                            title: "Simple Notification Test Form ".concat(Date.now())
                                        })];
                                    case 1:
                                        form = _a.sent();
                                        formId = form.id;
                                        return [4 /*yield*/, sdk.api.form_fields.createOne({
                                                formId: form.id,
                                                title: 'Test Field',
                                                type: 'string',
                                                previousFields: [{ type: 'root', info: {} }]
                                            })];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/, !!form.id];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 3: Create trigger for care team notifications
                    ];
                case 3:
                    // Test 2: Create form and field
                    _b.sent();
                    // Test 3: Create trigger for care team notifications
                    return [4 /*yield*/, async_test('create trigger - care team notification', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var trigger;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                                            title: "Simple User Notification Test ".concat(Date.now()),
                                            status: 'Active',
                                            event: {
                                                type: 'Form Submitted',
                                                info: { formId: formId }
                                            },
                                            action: {
                                                type: 'Create User Notifications',
                                                info: {
                                                    message: 'Simple test notification',
                                                    notificationType: 'simple-test-notification',
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
                case 4:
                    // Test 3: Create trigger for care team notifications
                    _b.sent();
                    // Test 4: Submit form and verify notification
                    return [4 /*yield*/, async_test('submit form - verify notification created', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var i, notifications;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.form_responses.createOne({
                                            formId: formId,
                                            formTitle: 'Simple Notification Test Form',
                                            enduserId: testEnduser.id,
                                            responses: [
                                                {
                                                    fieldId: '0',
                                                    fieldTitle: 'Test Field',
                                                    answer: { type: 'string', value: 'Simple test submission' }
                                                }
                                            ]
                                        })
                                        // Wait up to 10 seconds for notification
                                    ];
                                    case 1:
                                        _a.sent();
                                        i = 0;
                                        _a.label = 2;
                                    case 2:
                                        if (!(i < 10)) return [3 /*break*/, 6];
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                                    case 3:
                                        _a.sent();
                                        return [4 /*yield*/, sdk.api.user_notifications.getSome({ filter: {
                                                    type: 'simple-test-notification',
                                                    userId: sdk.userInfo.id
                                                } })];
                                    case 4:
                                        notifications = _a.sent();
                                        if (notifications.length > 0) {
                                            console.log("\u2713 Found notification after ".concat(i + 1, " seconds"));
                                            return [2 /*return*/, true];
                                        }
                                        _a.label = 5;
                                    case 5:
                                        i++;
                                        return [3 /*break*/, 2];
                                    case 6:
                                        console.log("\u274C No notification found after 10 seconds");
                                        return [2 /*return*/, false];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })];
                case 5:
                    // Test 4: Submit form and verify notification
                    _b.sent();
                    console.log("✅ Simple Create User Notifications trigger test passed!");
                    return [3 /*break*/, 22];
                case 6:
                    error_1 = _b.sent();
                    console.error('Test execution error:', error_1);
                    throw error_1;
                case 7:
                    // Cleanup
                    console.log("🧹 Cleaning up test resources...");
                    _b.label = 8;
                case 8:
                    _b.trys.push([8, 20, , 21]);
                    if (!triggerId) return [3 /*break*/, 10];
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(triggerId)];
                case 9:
                    _b.sent();
                    _b.label = 10;
                case 10:
                    if (!formId) return [3 /*break*/, 12];
                    return [4 /*yield*/, sdk.api.forms.deleteOne(formId)];
                case 11:
                    _b.sent();
                    _b.label = 12;
                case 12:
                    if (!(testEnduser === null || testEnduser === void 0 ? void 0 : testEnduser.id)) return [3 /*break*/, 14];
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(testEnduser.id)];
                case 13:
                    _b.sent();
                    _b.label = 14;
                case 14: return [4 /*yield*/, sdk.api.user_notifications.getSome({})];
                case 15:
                    testNotifications = (_b.sent())
                        .filter(function (n) { return n.type === 'simple-test-notification'; });
                    _i = 0, testNotifications_1 = testNotifications;
                    _b.label = 16;
                case 16:
                    if (!(_i < testNotifications_1.length)) return [3 /*break*/, 19];
                    notification = testNotifications_1[_i];
                    return [4 /*yield*/, sdk.api.user_notifications.deleteOne(notification.id)];
                case 17:
                    _b.sent();
                    _b.label = 18;
                case 18:
                    _i++;
                    return [3 /*break*/, 16];
                case 19: return [3 /*break*/, 21];
                case 20:
                    cleanupError_1 = _b.sent();
                    console.error('Cleanup error (non-fatal):', cleanupError_1);
                    return [3 /*break*/, 21];
                case 21: return [7 /*endfinally*/];
                case 22: return [2 /*return*/];
            }
        });
    });
};
// Allow running this test file independently
if (require.main === module) {
    var sdk_1 = new Session({ host: host });
    var sdkNonAdmin_1 = new Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setup_tests(sdk_1, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, create_user_notifications_trigger_simple_tests({ sdk: sdk_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Simple Create User Notifications trigger test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Simple Create User Notifications trigger test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=create_user_notifications_trigger_simple.test.js.map