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
import { log_header, wait, async_test } from "@tellescope/testing";
import { setup_tests } from "../setup";
var host = process.env.API_URL || "http://localhost:8080";
export var form_submitted_trigger_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var formA, fieldA, formB, fieldB, submitForm, enduserA1, enduserB1, enduserA2, enduserB2, enduserB3, enduserA3, enduserA4, allEndusers, allTriggers, trigger1, trigger2, trigger3, trigger4, trigger5, trigger6, _i, allEndusers_1, e, err_1, _b, allTriggers_1, t, err_2, err_3, err_4;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    log_header("Form Submitted Trigger Tests (Multi-Form & Per-Form Conditions)");
                    return [4 /*yield*/, sdk.api.forms.createOne({ title: 'Form Submitted Trigger Test A' })];
                case 1:
                    formA = _o.sent();
                    return [4 /*yield*/, sdk.api.form_fields.createOne({
                            formId: formA.id,
                            type: 'string',
                            title: 'FieldA',
                            previousFields: [{ type: 'root', info: {} }],
                        })];
                case 2:
                    fieldA = _o.sent();
                    return [4 /*yield*/, sdk.api.forms.createOne({ title: 'Form Submitted Trigger Test B' })];
                case 3:
                    formB = _o.sent();
                    return [4 /*yield*/, sdk.api.form_fields.createOne({
                            formId: formB.id,
                            type: 'string',
                            title: 'FieldB',
                            previousFields: [{ type: 'root', info: {} }],
                        })
                        // Helper to prepare and submit a form response
                    ];
                case 4:
                    fieldB = _o.sent();
                    submitForm = function (formId, enduserId, responses) { return __awaiter(void 0, void 0, void 0, function () {
                        var accessCode;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, sdk.api.form_responses.prepare_form_response({ enduserId: enduserId, formId: formId })];
                                case 1:
                                    accessCode = (_a.sent()).accessCode;
                                    return [4 /*yield*/, sdk.api.form_responses.submit_form_response({ accessCode: accessCode, responses: responses })];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'fst-a1' })];
                case 5:
                    enduserA1 = _o.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'fst-b1' })];
                case 6:
                    enduserB1 = _o.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'fst-a2' })];
                case 7:
                    enduserA2 = _o.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'fst-b2' })];
                case 8:
                    enduserB2 = _o.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'fst-b3' })];
                case 9:
                    enduserB3 = _o.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'fst-a3' })];
                case 10:
                    enduserA3 = _o.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'fst-a4' })];
                case 11:
                    enduserA4 = _o.sent();
                    allEndusers = [enduserA1, enduserB1, enduserA2, enduserB2, enduserB3, enduserA3, enduserA4];
                    allTriggers = [];
                    _o.label = 12;
                case 12:
                    _o.trys.push([12, , 46, 65]);
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: {
                                type: 'Form Submitted',
                                info: { formId: formA.id },
                                conditions: {
                                    "$and": [{ "condition": (_c = {}, _c[fieldA.id] = "match-value", _c) }]
                                },
                            },
                            action: { type: 'Add Tags', info: { tags: ['global-cond-primary'] } },
                            status: 'Active',
                            title: "Scenario 1: Global conditions backwards compat",
                        })];
                case 13:
                    trigger1 = _o.sent();
                    allTriggers.push(trigger1);
                    return [4 /*yield*/, submitForm(formA.id, enduserA1.id, [{
                                fieldId: fieldA.id, fieldTitle: 'FieldA',
                                answer: { type: 'string', value: 'match-value' },
                            }])];
                case 14:
                    _o.sent();
                    return [4 /*yield*/, wait(undefined, 1000)];
                case 15:
                    _o.sent();
                    return [4 /*yield*/, async_test("Scenario 1: Global conditions on primary form still work (backwards compat)", function () { return sdk.api.endusers.getOne(enduserA1.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('global-cond-primary')); } })];
                case 16:
                    _o.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(trigger1.id)
                        // ── Scenario 2: Multi-form trigger fires on secondary form submission ──
                    ];
                case 17:
                    _o.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: {
                                type: 'Form Submitted',
                                info: { formId: formA.id, otherFormIds: [formB.id] },
                            },
                            action: { type: 'Add Tags', info: { tags: ['multi-form-secondary'] } },
                            status: 'Active',
                            title: "Scenario 2: Multi-form fires on secondary",
                        })];
                case 18:
                    trigger2 = _o.sent();
                    allTriggers.push(trigger2);
                    return [4 /*yield*/, submitForm(formB.id, enduserB1.id, [{
                                fieldId: fieldB.id, fieldTitle: 'FieldB',
                                answer: { type: 'string', value: 'anything' },
                            }])];
                case 19:
                    _o.sent();
                    return [4 /*yield*/, wait(undefined, 1000)];
                case 20:
                    _o.sent();
                    return [4 /*yield*/, async_test("Scenario 2: Trigger fires when secondary form (otherFormIds) is submitted", function () { return sdk.api.endusers.getOne(enduserB1.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('multi-form-secondary')); } })];
                case 21:
                    _o.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(trigger2.id)
                        // ── Scenario 3: Per-form conditions match on primary form ──
                    ];
                case 22:
                    _o.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: {
                                type: 'Form Submitted',
                                info: {
                                    formId: formA.id,
                                    otherFormIds: [formB.id],
                                    conditionsByFormId: (_d = {},
                                        _d[formA.id] = { "$and": [{ "condition": (_e = {}, _e[fieldA.id] = "primary-match", _e) }] },
                                        _d),
                                },
                            },
                            action: { type: 'Add Tags', info: { tags: ['per-form-primary'] } },
                            status: 'Active',
                            title: "Scenario 3: Per-form conditions on primary",
                        })];
                case 23:
                    trigger3 = _o.sent();
                    allTriggers.push(trigger3);
                    return [4 /*yield*/, submitForm(formA.id, enduserA2.id, [{
                                fieldId: fieldA.id, fieldTitle: 'FieldA',
                                answer: { type: 'string', value: 'primary-match' },
                            }])];
                case 24:
                    _o.sent();
                    return [4 /*yield*/, wait(undefined, 1000)];
                case 25:
                    _o.sent();
                    return [4 /*yield*/, async_test("Scenario 3: Per-form conditions match on primary form", function () { return sdk.api.endusers.getOne(enduserA2.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('per-form-primary')); } })];
                case 26:
                    _o.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(trigger3.id)
                        // ── Scenario 4: Per-form conditions match on secondary form ──
                    ];
                case 27:
                    _o.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: {
                                type: 'Form Submitted',
                                info: {
                                    formId: formA.id,
                                    otherFormIds: [formB.id],
                                    conditionsByFormId: (_f = {},
                                        _f[formB.id] = { "$and": [{ "condition": (_g = {}, _g[fieldB.id] = "secondary-match", _g) }] },
                                        _f),
                                },
                            },
                            action: { type: 'Add Tags', info: { tags: ['per-form-secondary'] } },
                            status: 'Active',
                            title: "Scenario 4: Per-form conditions on secondary",
                        })];
                case 28:
                    trigger4 = _o.sent();
                    allTriggers.push(trigger4);
                    return [4 /*yield*/, submitForm(formB.id, enduserB2.id, [{
                                fieldId: fieldB.id, fieldTitle: 'FieldB',
                                answer: { type: 'string', value: 'secondary-match' },
                            }])];
                case 29:
                    _o.sent();
                    return [4 /*yield*/, wait(undefined, 1000)];
                case 30:
                    _o.sent();
                    return [4 /*yield*/, async_test("Scenario 4: Per-form conditions match on secondary form", function () { return sdk.api.endusers.getOne(enduserB2.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('per-form-secondary')); } })];
                case 31:
                    _o.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(trigger4.id)
                        // ── Scenario 5: Per-form conditions on one form don't block a different form ──
                    ];
                case 32:
                    _o.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: {
                                type: 'Form Submitted',
                                info: {
                                    formId: formA.id,
                                    otherFormIds: [formB.id],
                                    conditionsByFormId: (_h = {},
                                        _h[formA.id] = { "$and": [{ "condition": (_j = {}, _j[fieldA.id] = "strict-value", _j) }] },
                                        _h),
                                },
                            },
                            action: { type: 'Add Tags', info: { tags: ['no-cross-block'] } },
                            status: 'Active',
                            title: "Scenario 5: No cross-form condition blocking",
                        })];
                case 33:
                    trigger5 = _o.sent();
                    allTriggers.push(trigger5);
                    return [4 /*yield*/, submitForm(formB.id, enduserB3.id, [{
                                fieldId: fieldB.id, fieldTitle: 'FieldB',
                                answer: { type: 'string', value: 'anything' },
                            }])];
                case 34:
                    _o.sent();
                    return [4 /*yield*/, wait(undefined, 1000)];
                case 35:
                    _o.sent();
                    return [4 /*yield*/, async_test("Scenario 5: Conditions on FormA do not block FormB (no cross-form blocking)", function () { return sdk.api.endusers.getOne(enduserB3.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('no-cross-block')); } })];
                case 36:
                    _o.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(trigger5.id)
                        // ── Scenario 6: conditionsByFormId overrides global conditions ──
                    ];
                case 37:
                    _o.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: {
                                type: 'Form Submitted',
                                info: {
                                    formId: formA.id,
                                    conditionsByFormId: (_k = {},
                                        _k[formA.id] = { "$and": [{ "condition": (_l = {}, _l[fieldA.id] = "per-form-value", _l) }] },
                                        _k),
                                },
                                conditions: {
                                    "$and": [{ "condition": (_m = {}, _m[fieldA.id] = "global-value", _m) }]
                                },
                            },
                            action: { type: 'Add Tags', info: { tags: ['override-test'] } },
                            status: 'Active',
                            title: "Scenario 6: conditionsByFormId overrides global",
                        })];
                case 38:
                    trigger6 = _o.sent();
                    allTriggers.push(trigger6);
                    // 6a: Submit with per-form matching value — should fire
                    return [4 /*yield*/, submitForm(formA.id, enduserA3.id, [{
                                fieldId: fieldA.id, fieldTitle: 'FieldA',
                                answer: { type: 'string', value: 'per-form-value' },
                            }])];
                case 39:
                    // 6a: Submit with per-form matching value — should fire
                    _o.sent();
                    return [4 /*yield*/, wait(undefined, 1000)];
                case 40:
                    _o.sent();
                    return [4 /*yield*/, async_test("Scenario 6a: conditionsByFormId match fires trigger (overrides global)", function () { return sdk.api.endusers.getOne(enduserA3.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('override-test')); } })
                        // 6b: Submit with global matching value — should NOT fire (per-form takes precedence)
                    ];
                case 41:
                    _o.sent();
                    // 6b: Submit with global matching value — should NOT fire (per-form takes precedence)
                    return [4 /*yield*/, submitForm(formA.id, enduserA4.id, [{
                                fieldId: fieldA.id, fieldTitle: 'FieldA',
                                answer: { type: 'string', value: 'global-value' },
                            }])];
                case 42:
                    // 6b: Submit with global matching value — should NOT fire (per-form takes precedence)
                    _o.sent();
                    return [4 /*yield*/, wait(undefined, 1000)];
                case 43:
                    _o.sent();
                    return [4 /*yield*/, async_test("Scenario 6b: Global conditions ignored when conditionsByFormId exists", function () { return sdk.api.endusers.getOne(enduserA4.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('override-test')); } })];
                case 44:
                    _o.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(trigger6.id)];
                case 45:
                    _o.sent();
                    return [3 /*break*/, 65];
                case 46:
                    _i = 0, allEndusers_1 = allEndusers;
                    _o.label = 47;
                case 47:
                    if (!(_i < allEndusers_1.length)) return [3 /*break*/, 52];
                    e = allEndusers_1[_i];
                    _o.label = 48;
                case 48:
                    _o.trys.push([48, 50, , 51]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(e.id)];
                case 49:
                    _o.sent();
                    return [3 /*break*/, 51];
                case 50:
                    err_1 = _o.sent();
                    return [3 /*break*/, 51];
                case 51:
                    _i++;
                    return [3 /*break*/, 47];
                case 52:
                    _b = 0, allTriggers_1 = allTriggers;
                    _o.label = 53;
                case 53:
                    if (!(_b < allTriggers_1.length)) return [3 /*break*/, 58];
                    t = allTriggers_1[_b];
                    _o.label = 54;
                case 54:
                    _o.trys.push([54, 56, , 57]);
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(t.id)];
                case 55:
                    _o.sent();
                    return [3 /*break*/, 57];
                case 56:
                    err_2 = _o.sent();
                    return [3 /*break*/, 57];
                case 57:
                    _b++;
                    return [3 /*break*/, 53];
                case 58:
                    _o.trys.push([58, 60, , 61]);
                    return [4 /*yield*/, sdk.api.forms.deleteOne(formA.id)];
                case 59:
                    _o.sent();
                    return [3 /*break*/, 61];
                case 60:
                    err_3 = _o.sent();
                    return [3 /*break*/, 61];
                case 61:
                    _o.trys.push([61, 63, , 64]);
                    return [4 /*yield*/, sdk.api.forms.deleteOne(formB.id)];
                case 62:
                    _o.sent();
                    return [3 /*break*/, 64];
                case 63:
                    err_4 = _o.sent();
                    return [3 /*break*/, 64];
                case 64: return [7 /*endfinally*/];
                case 65: return [2 /*return*/];
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
                    return [4 /*yield*/, form_submitted_trigger_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Form Submitted trigger tests completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Form Submitted trigger tests failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=form_submitted_trigger.test.js.map