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
exports.test_basic_trigger_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.TEST_URL || 'http://localhost:8080';
// Test basic trigger functionality first
var test_basic_trigger_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var testEnduser, triggerId, formId, error_1, cleanupError_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("Basic Trigger Test - Add Tags Action");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 17]);
                    // Test 1: Setup - Create enduser
                    return [4 /*yield*/, (0, testing_1.async_test)('setup - create test enduser', function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.endusers.createOne({})];
                                    case 1:
                                        testEnduser = _a.sent();
                                        return [2 /*return*/, !!testEnduser.id];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 2: Create form and field
                    ];
                case 2:
                    // Test 1: Setup - Create enduser
                    _b.sent();
                    // Test 2: Create form and field
                    return [4 /*yield*/, (0, testing_1.async_test)('setup - create test form and field', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var form;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.forms.createOne({
                                            title: "Basic Trigger Test Form ".concat(Date.now())
                                        })];
                                    case 1:
                                        form = _a.sent();
                                        formId = form.id;
                                        // Create form field
                                        return [4 /*yield*/, sdk.api.form_fields.createOne({
                                                formId: form.id,
                                                title: 'Test Field',
                                                type: 'string',
                                                previousFields: [{ type: 'root', info: {} }]
                                            })];
                                    case 2:
                                        // Create form field
                                        _a.sent();
                                        return [2 /*return*/, !!form.id];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 3: Create trigger with Add Tags action (known working action)
                    ];
                case 3:
                    // Test 2: Create form and field
                    _b.sent();
                    // Test 3: Create trigger with Add Tags action (known working action)
                    return [4 /*yield*/, (0, testing_1.async_test)('create trigger - add tags action', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var trigger;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                                            title: "Basic Trigger Test ".concat(Date.now()),
                                            status: 'Active',
                                            event: {
                                                type: 'Form Submitted',
                                                info: { formId: formId }
                                            },
                                            action: {
                                                type: 'Add Tags',
                                                info: { tags: ['basic-trigger-test'] }
                                            }
                                        })];
                                    case 1:
                                        trigger = _a.sent();
                                        triggerId = trigger.id;
                                        return [2 /*return*/, !!trigger.id];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 4: Submit form and verify tag is added
                    ];
                case 4:
                    // Test 3: Create trigger with Add Tags action (known working action)
                    _b.sent();
                    // Test 4: Submit form and verify tag is added
                    return [4 /*yield*/, (0, testing_1.async_test)('submit form - verify tag added to enduser', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var i, updatedEnduser, finalEnduser;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: 
                                    // Submit form to trigger the action
                                    return [4 /*yield*/, sdk.api.form_responses.createOne({
                                            formId: formId,
                                            formTitle: 'Basic Trigger Test Form',
                                            enduserId: testEnduser.id,
                                            responses: [
                                                {
                                                    fieldId: '0',
                                                    fieldTitle: 'Test Field',
                                                    answer: { type: 'string', value: 'Basic test submission' }
                                                }
                                            ]
                                        })
                                        // Wait for trigger to process - check every second for up to 10 seconds
                                    ];
                                    case 1:
                                        // Submit form to trigger the action
                                        _a.sent();
                                        i = 0;
                                        _a.label = 2;
                                    case 2:
                                        if (!(i < 10)) return [3 /*break*/, 6];
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })
                                            // Check if tag was added to enduser
                                        ];
                                    case 3:
                                        _a.sent();
                                        return [4 /*yield*/, sdk.api.endusers.getOne(testEnduser.id)];
                                    case 4:
                                        updatedEnduser = _a.sent();
                                        if (updatedEnduser.tags && updatedEnduser.tags.includes('basic-trigger-test')) {
                                            console.log("\u2713 Found 'basic-trigger-test' tag on enduser after ".concat(i + 1, " seconds"));
                                            console.log("Enduser tags: ".concat(JSON.stringify(updatedEnduser.tags)));
                                            return [2 /*return*/, true];
                                        }
                                        _a.label = 5;
                                    case 5:
                                        i++;
                                        return [3 /*break*/, 2];
                                    case 6: return [4 /*yield*/, sdk.api.endusers.getOne(testEnduser.id)];
                                    case 7:
                                        finalEnduser = _a.sent();
                                        console.log("\u274C Tag not found after 10 seconds. Final tags: ".concat(JSON.stringify(finalEnduser.tags || [])));
                                        return [2 /*return*/, false];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })];
                case 5:
                    // Test 4: Submit form and verify tag is added
                    _b.sent();
                    console.log("✅ Basic trigger test passed!");
                    return [3 /*break*/, 17];
                case 6:
                    error_1 = _b.sent();
                    console.error('Test execution error:', error_1);
                    throw error_1;
                case 7:
                    // Cleanup test resources
                    console.log("🧹 Cleaning up test resources...");
                    _b.label = 8;
                case 8:
                    _b.trys.push([8, 15, , 16]);
                    if (!triggerId) return [3 /*break*/, 10];
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(triggerId)];
                case 9:
                    _b.sent();
                    console.log("✓ Deleted test trigger");
                    _b.label = 10;
                case 10:
                    if (!formId) return [3 /*break*/, 12];
                    return [4 /*yield*/, sdk.api.forms.deleteOne(formId)];
                case 11:
                    _b.sent();
                    console.log("✓ Deleted test form");
                    _b.label = 12;
                case 12:
                    if (!(testEnduser === null || testEnduser === void 0 ? void 0 : testEnduser.id)) return [3 /*break*/, 14];
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(testEnduser.id)];
                case 13:
                    _b.sent();
                    console.log("✓ Deleted test enduser");
                    _b.label = 14;
                case 14: return [3 /*break*/, 16];
                case 15:
                    cleanupError_1 = _b.sent();
                    console.error('Cleanup error (non-fatal):', cleanupError_1);
                    return [3 /*break*/, 16];
                case 16: return [7 /*endfinally*/];
                case 17: return [2 /*return*/];
            }
        });
    });
};
exports.test_basic_trigger_tests = test_basic_trigger_tests;
// Allow running this test file independently
if (require.main === module) {
    var sdk_2 = new sdk_1.Session({ host: host });
    var sdkNonAdmin_1 = new sdk_1.Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, setup_1.setup_tests)(sdk_2, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, exports.test_basic_trigger_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Basic trigger test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Basic trigger test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=test_basic_trigger.test.js.map