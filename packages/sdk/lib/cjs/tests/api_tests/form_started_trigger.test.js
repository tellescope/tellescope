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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.form_started_trigger_tests = void 0;
require('source-map-support').install();
var axios_1 = __importDefault(require("axios"));
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || "http://localhost:8080";
var form_started_trigger_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var form, field, postToFormsort, startPublicForm, triggerDefault, enduserId1, enduser2, enduserForPrepare1, triggerWithSources, enduserForPrepare2, triggerPublic, enduserId3, triggerFormsort, enduserId4, enduser5, triggerBoth, enduserId7, enduser8, triggerOnce, enduser9, triggerFinalized, enduser10, enduserEmails, _i, enduserEmails_1, email, e, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("Form Started Trigger Tests (Sources)");
                    return [4 /*yield*/, sdk.api.forms.createOne({ title: "Form Started Trigger Test", allowPublicURL: true })];
                case 1:
                    form = _b.sent();
                    return [4 /*yield*/, sdk.api.form_fields.createOne({
                            formId: form.id,
                            title: 'test_field',
                            type: 'string',
                            previousFields: [{ type: 'root', info: {} }],
                        })];
                case 2:
                    field = _b.sent();
                    postToFormsort = function (o) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    url = new URL("".concat(host, "/v1/webhooks/formsort/9d4f9dff00f60df2690a16da2cb848f289b447614ad9bef850e54af09a1fbf7a"));
                                    url.searchParams.set('formId', form.id);
                                    return [4 /*yield*/, axios_1.default.post(url.toString(), o)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); };
                    startPublicForm = function (email) { return __awaiter(void 0, void 0, void 0, function () {
                        var enduserSDK;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    enduserSDK = new sdk_1.EnduserSession({ host: host, businessId: form.businessId });
                                    return [4 /*yield*/, enduserSDK.api.form_responses.session_for_public_form({
                                            formId: form.id,
                                            businessId: form.businessId,
                                            email: email,
                                            skipMatch: true,
                                        })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); };
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Form Started', info: { formIds: [form.id] } },
                            action: { type: 'Add Tags', info: { tags: ['default-trigger'] } },
                            status: 'Active',
                            title: "Default (no sources)",
                        })
                        // Fire via public form (session_for_public_form)
                    ];
                case 3:
                    triggerDefault = _b.sent();
                    return [4 /*yield*/, startPublicForm('fst-test1@tellescope.com')];
                case 4:
                    enduserId1 = (_b.sent()).enduserId;
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Default trigger fires on public form start", function () { return sdk.api.endusers.getOne(enduserId1); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('default-trigger')); } })
                        // Fire via formsort draft - should NOT trigger (default = Public Form only)
                    ];
                case 6:
                    _b.sent();
                    // Fire via formsort draft - should NOT trigger (default = Public Form only)
                    return [4 /*yield*/, postToFormsort({
                            answers: [{ key: 'email', value: 'fst-test2@tellescope.com' }],
                            responder_uuid: "fst-default-1",
                            finalized: false,
                        })];
                case 7:
                    // Fire via formsort draft - should NOT trigger (default = Public Form only)
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.getOne({ email: 'fst-test2@tellescope.com' })];
                case 9:
                    enduser2 = _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Default trigger does NOT fire on formsort draft", function () { return sdk.api.endusers.getOne(enduser2.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('default-trigger')); } })
                        // Fire via prepare_form_response - should NOT trigger (only session_for_public_form triggers)
                        // Test with trigger that has NO sources field (backward compatibility)
                    ];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'fst-test-prepare1@tellescope.com' })];
                case 11:
                    enduserForPrepare1 = _b.sent();
                    return [4 /*yield*/, sdk.api.form_responses.prepare_form_response({
                            formId: form.id,
                            enduserId: enduserForPrepare1.id,
                        })];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 13:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("prepare_form_response does NOT trigger Form Started (no sources field)", function () { return sdk.api.endusers.getOne(enduserForPrepare1.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('default-trigger')); } })];
                case 14:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(triggerDefault.id)
                        // Test with trigger that HAS sources: ['Public Form'] set
                    ];
                case 15:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Form Started', info: { formIds: [form.id], sources: ['Public Form'] } },
                            action: { type: 'Add Tags', info: { tags: ['prepare-sources-trigger'] } },
                            status: 'Active',
                            title: "Prepare test with sources",
                        })];
                case 16:
                    triggerWithSources = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'fst-test-prepare2@tellescope.com' })];
                case 17:
                    enduserForPrepare2 = _b.sent();
                    return [4 /*yield*/, sdk.api.form_responses.prepare_form_response({
                            formId: form.id,
                            enduserId: enduserForPrepare2.id,
                        })];
                case 18:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 19:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("prepare_form_response does NOT trigger Form Started (with sources field)", function () { return sdk.api.endusers.getOne(enduserForPrepare2.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('prepare-sources-trigger')); } })];
                case 20:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(triggerWithSources.id)
                        // Test 2: sources: ['Public Form'] - same as default
                    ];
                case 21:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Form Started', info: { formIds: [form.id], sources: ['Public Form'] } },
                            action: { type: 'Add Tags', info: { tags: ['public-only-trigger'] } },
                            status: 'Active',
                            title: "Public Form only",
                        })];
                case 22:
                    triggerPublic = _b.sent();
                    return [4 /*yield*/, startPublicForm('fst-test3@tellescope.com')];
                case 23:
                    enduserId3 = (_b.sent()).enduserId;
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 24:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Public Form source trigger fires on public form start", function () { return sdk.api.endusers.getOne(enduserId3); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('public-only-trigger')); } })];
                case 25:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(triggerPublic.id)
                        // Test 3: sources: ['Formsort'] - trigger fires only on formsort draft
                    ];
                case 26:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Form Started', info: { formIds: [form.id], sources: ['Formsort'] } },
                            action: { type: 'Add Tags', info: { tags: ['formsort-trigger'] } },
                            status: 'Active',
                            title: "Formsort only",
                        })
                        // Public form should NOT fire this trigger
                    ];
                case 27:
                    triggerFormsort = _b.sent();
                    return [4 /*yield*/, startPublicForm('fst-test4@tellescope.com')];
                case 28:
                    enduserId4 = (_b.sent()).enduserId;
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 29:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Formsort source trigger does NOT fire on public form start", function () { return sdk.api.endusers.getOne(enduserId4); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('formsort-trigger')); } })
                        // Formsort draft should fire this trigger
                    ];
                case 30:
                    _b.sent();
                    // Formsort draft should fire this trigger
                    return [4 /*yield*/, postToFormsort({
                            answers: [{ key: 'email', value: 'fst-test5@tellescope.com' }],
                            responder_uuid: "fst-formsort-1",
                            finalized: false,
                        })];
                case 31:
                    // Formsort draft should fire this trigger
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 32:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.getOne({ email: 'fst-test5@tellescope.com' })];
                case 33:
                    enduser5 = _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Formsort source trigger fires on formsort draft", function () { return sdk.api.endusers.getOne(enduser5.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('formsort-trigger')); } })];
                case 34:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(triggerFormsort.id)
                        // Test 4: sources: ['Public Form', 'Formsort'] - trigger fires on both
                    ];
                case 35:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Form Started', info: { formIds: [form.id], sources: ['Public Form', 'Formsort'] } },
                            action: { type: 'Add Tags', info: { tags: ['both-trigger'] } },
                            status: 'Active',
                            title: "Both sources",
                        })
                        // Public form should fire
                    ];
                case 36:
                    triggerBoth = _b.sent();
                    return [4 /*yield*/, startPublicForm('fst-test7@tellescope.com')];
                case 37:
                    enduserId7 = (_b.sent()).enduserId;
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 38:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Both sources trigger fires on public form start", function () { return sdk.api.endusers.getOne(enduserId7); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('both-trigger')); } })
                        // Formsort draft should fire
                    ];
                case 39:
                    _b.sent();
                    // Formsort draft should fire
                    return [4 /*yield*/, postToFormsort({
                            answers: [{ key: 'email', value: 'fst-test8@tellescope.com' }],
                            responder_uuid: "fst-both-1",
                            finalized: false,
                        })];
                case 40:
                    // Formsort draft should fire
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 41:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.getOne({ email: 'fst-test8@tellescope.com' })];
                case 42:
                    enduser8 = _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Both sources trigger fires on formsort draft", function () { return sdk.api.endusers.getOne(enduser8.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('both-trigger')); } })];
                case 43:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(triggerBoth.id)
                        // Test 5: Formsort fires once per draft (subsequent updates should not re-trigger)
                    ];
                case 44:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Form Started', info: { formIds: [form.id], sources: ['Formsort'] } },
                            action: { type: 'Add Tags', info: { tags: ['once-trigger'] } },
                            status: 'Active',
                            title: "Once trigger",
                        })
                        // First draft - should trigger
                    ];
                case 45:
                    triggerOnce = _b.sent();
                    // First draft - should trigger
                    return [4 /*yield*/, postToFormsort({
                            answers: [{ key: 'email', value: 'fst-test9@tellescope.com' }],
                            responder_uuid: "fst-once-1",
                            finalized: false,
                        })];
                case 46:
                    // First draft - should trigger
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 47:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.getOne({ email: 'fst-test9@tellescope.com' })];
                case 48:
                    enduser9 = _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Formsort trigger fires on first draft", function () { return sdk.api.endusers.getOne(enduser9.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('once-trigger')); } })
                        // Remove tag to detect if trigger fires again
                    ];
                case 49:
                    _b.sent();
                    // Remove tag to detect if trigger fires again
                    return [4 /*yield*/, sdk.api.endusers.updateOne(enduser9.id, { tags: [] }, { replaceObjectFields: true })
                        // Second draft update (same responder_uuid) - should NOT trigger again (existingResponse is not null)
                    ];
                case 50:
                    // Remove tag to detect if trigger fires again
                    _b.sent();
                    // Second draft update (same responder_uuid) - should NOT trigger again (existingResponse is not null)
                    return [4 /*yield*/, postToFormsort({
                            answers: [{ key: 'email', value: 'fst-test9@tellescope.com' }, { key: 'test_field', value: 'updated' }],
                            responder_uuid: "fst-once-1",
                            finalized: false,
                        })];
                case 51:
                    // Second draft update (same responder_uuid) - should NOT trigger again (existingResponse is not null)
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 52:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Formsort trigger does NOT fire on subsequent draft update", function () { return sdk.api.endusers.getOne(enduser9.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('once-trigger')); } })];
                case 53:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(triggerOnce.id)
                        // Test 6: Immediately finalized formsort does NOT trigger Form Started
                    ];
                case 54:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Form Started', info: { formIds: [form.id], sources: ['Formsort'] } },
                            action: { type: 'Add Tags', info: { tags: ['finalized-trigger'] } },
                            status: 'Active',
                            title: "Finalized trigger",
                        })
                        // Submit immediately finalized form via formsort (never unfinalized)
                    ];
                case 55:
                    triggerFinalized = _b.sent();
                    // Submit immediately finalized form via formsort (never unfinalized)
                    return [4 /*yield*/, postToFormsort({
                            answers: [{ key: 'email', value: 'fst-test10@tellescope.com' }],
                            responder_uuid: "fst-finalized-1",
                            finalized: true,
                        })];
                case 56:
                    // Submit immediately finalized form via formsort (never unfinalized)
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 57:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.getOne({ email: 'fst-test10@tellescope.com' })];
                case 58:
                    enduser10 = _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Immediately finalized formsort does NOT trigger Form Started", function () { return sdk.api.endusers.getOne(enduser10.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('finalized-trigger')); } })];
                case 59:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(triggerFinalized.id)
                        // Cleanup - delete all endusers created during test
                    ];
                case 60:
                    _b.sent();
                    enduserEmails = [
                        'fst-test1@tellescope.com', 'fst-test2@tellescope.com', 'fst-test3@tellescope.com',
                        'fst-test4@tellescope.com', 'fst-test5@tellescope.com', 'fst-test7@tellescope.com',
                        'fst-test8@tellescope.com', 'fst-test9@tellescope.com', 'fst-test10@tellescope.com',
                        'fst-test-prepare1@tellescope.com', 'fst-test-prepare2@tellescope.com',
                    ];
                    _i = 0, enduserEmails_1 = enduserEmails;
                    _b.label = 61;
                case 61:
                    if (!(_i < enduserEmails_1.length)) return [3 /*break*/, 67];
                    email = enduserEmails_1[_i];
                    _b.label = 62;
                case 62:
                    _b.trys.push([62, 65, , 66]);
                    return [4 /*yield*/, sdk.api.endusers.getOne({ email: email })];
                case 63:
                    e = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(e.id)];
                case 64:
                    _b.sent();
                    return [3 /*break*/, 66];
                case 65:
                    err_1 = _b.sent();
                    return [3 /*break*/, 66];
                case 66:
                    _i++;
                    return [3 /*break*/, 61];
                case 67: return [4 /*yield*/, sdk.api.forms.deleteOne(form.id)];
                case 68:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
};
exports.form_started_trigger_tests = form_started_trigger_tests;
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
                    return [4 /*yield*/, (0, exports.form_started_trigger_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Form Started trigger tests completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Form Started trigger tests failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=form_started_trigger.test.js.map