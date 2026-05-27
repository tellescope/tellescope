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
exports.push_forms_to_portal_group_completion_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || "http://localhost:8080";
var pollFor = function (fetchFn, evaluateFn, description, intervalMs, maxIterations) {
    if (intervalMs === void 0) { intervalMs = 500; }
    if (maxIterations === void 0) { maxIterations = 30; }
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
                    if (evaluateFn(lastResult))
                        return [2 /*return*/, lastResult];
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 1];
                case 5: throw new Error("Polling timeout: ".concat(description, " - waited ").concat(maxIterations * intervalMs, "ms"));
            }
        });
    });
};
var push_forms_to_portal_group_completion_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var createdEnduserIds, createdJourneyIds, createdFormIds, createdFormGroupIds, createdTriggerIds, formA_1, fieldA_1, formB, fieldB_1, formGroup_1, runFlow, _i, createdTriggerIds_1, id, e_1, _b, createdEnduserIds_1, id, e_2, _c, createdJourneyIds_1, id, e_3, _d, createdFormGroupIds_1, id, e_4, _e, createdFormIds_1, id, e_5;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    (0, testing_1.log_header)("Push Forms To Portal - Form Group Completed Trigger Tests");
                    createdEnduserIds = [];
                    createdJourneyIds = [];
                    createdFormIds = [];
                    createdFormGroupIds = [];
                    createdTriggerIds = [];
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, , 9, 40]);
                    return [4 /*yield*/, sdk.api.forms.createOne({ title: 'Push To Portal Form A' })];
                case 2:
                    formA_1 = _f.sent();
                    createdFormIds.push(formA_1.id);
                    return [4 /*yield*/, sdk.api.form_fields.createOne({
                            formId: formA_1.id,
                            type: 'string',
                            title: 'FieldA',
                            previousFields: [{ type: 'root', info: {} }],
                        })];
                case 3:
                    fieldA_1 = _f.sent();
                    return [4 /*yield*/, sdk.api.forms.createOne({ title: 'Push To Portal Form B' })];
                case 4:
                    formB = _f.sent();
                    createdFormIds.push(formB.id);
                    return [4 /*yield*/, sdk.api.form_fields.createOne({
                            formId: formB.id,
                            type: 'string',
                            title: 'FieldB',
                            previousFields: [{ type: 'root', info: {} }],
                        })
                        // 2. Create a form group containing both forms (shared across both submission flows)
                    ];
                case 5:
                    fieldB_1 = _f.sent();
                    return [4 /*yield*/, sdk.api.form_groups.createOne({
                            title: 'Push To Portal Test Group',
                            formIds: [formA_1.id, formB.id],
                        })];
                case 6:
                    formGroup_1 = _f.sent();
                    createdFormGroupIds.push(formGroup_1.id);
                    runFlow = function (_a) {
                        var label = _a.label, tag = _a.tag, submitAsEnduser = _a.submitAsEnduser;
                        return __awaiter(void 0, void 0, void 0, function () {
                            var trigger, journey, pushStep, enduser, pushedResponses, _i, pushedResponses_1, fr, submitterApi, authToken, enduserSDK, _b, pushedResponses_2, fr, isFormA, targetFieldId, targetFieldTitle;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                                            event: { type: 'Form Group Completed', info: { groupId: formGroup_1.id } },
                                            action: { type: 'Add Tags', info: { tags: [tag] } },
                                            status: 'Active',
                                            title: "Form Group Completed - Push to Portal (".concat(label, ")"),
                                        })];
                                    case 1:
                                        trigger = _c.sent();
                                        createdTriggerIds.push(trigger.id);
                                        return [4 /*yield*/, sdk.api.journeys.createOne({
                                                title: "Push To Portal Trigger Journey (".concat(label, ")"),
                                            })];
                                    case 2:
                                        journey = _c.sent();
                                        createdJourneyIds.push(journey.id);
                                        return [4 /*yield*/, sdk.api.automation_steps.createOne({
                                                journeyId: journey.id,
                                                action: { type: 'pushFormsToPortal', info: { formGroupIds: [formGroup_1.id] } },
                                                events: [{ type: 'onJourneyStart', info: {} }],
                                            })];
                                    case 3:
                                        pushStep = _c.sent();
                                        return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'PushPortal', lname: label })];
                                    case 4:
                                        enduser = _c.sent();
                                        createdEnduserIds.push(enduser.id);
                                        return [4 /*yield*/, sdk.api.endusers.add_to_journey({
                                                enduserIds: [enduser.id],
                                                journeyId: journey.id,
                                            })];
                                    case 5:
                                        _c.sent();
                                        return [4 /*yield*/, pollFor(function () { return __awaiter(void 0, void 0, void 0, function () {
                                                var responses, pushed;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, sdk.api.form_responses.getSome({
                                                                filter: { enduserId: enduser.id },
                                                            })];
                                                        case 1:
                                                            responses = _a.sent();
                                                            pushed = responses.filter(function (r) { return !!r.pushedToPortalAt; });
                                                            return [2 /*return*/, pushed.length >= 2 ? pushed : undefined];
                                                    }
                                                });
                                            }); }, function (result) { return Array.isArray(result) && result.length >= 2; }, "pushed-to-portal form_responses to be created by worker (".concat(label, ")"), 500, 40)];
                                    case 6:
                                        pushedResponses = _c.sent();
                                        for (_i = 0, pushedResponses_1 = pushedResponses; _i < pushedResponses_1.length; _i++) {
                                            fr = pushedResponses_1[_i];
                                            if (!fr.pushedToPortalAt) {
                                                throw new Error("Expected pushedToPortalAt to be set on form_response ".concat(fr.id, " (").concat(label, ")"));
                                            }
                                            if (fr.groupId !== pushStep.id) {
                                                throw new Error("Expected form_response.groupId (".concat(fr.groupId, ") to equal automation step id (").concat(pushStep.id, ") (").concat(label, ")"));
                                            }
                                            if (fr.automationStepId !== pushStep.id) {
                                                throw new Error("Expected form_response.automationStepId (".concat(fr.automationStepId, ") to equal automation step id (").concat(pushStep.id, ") (").concat(label, ")"));
                                            }
                                        }
                                        return [4 /*yield*/, (0, testing_1.async_test)("Worker writes groupId === automationStepId and pushedToPortalAt set (".concat(label, ")"), function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                                return [2 /*return*/, true];
                                            }); }); }, { onResult: function (r) { return r === true; } })
                                            // Build the submitter session
                                        ];
                                    case 7:
                                        _c.sent();
                                        if (!submitAsEnduser) return [3 /*break*/, 9];
                                        return [4 /*yield*/, sdk.api.endusers.generate_auth_token({ id: enduser.id })];
                                    case 8:
                                        authToken = (_c.sent()).authToken;
                                        enduserSDK = new sdk_1.EnduserSession({ host: host, authToken: authToken, businessId: sdk.userInfo.businessId });
                                        submitterApi = enduserSDK.api;
                                        return [3 /*break*/, 10];
                                    case 9:
                                        submitterApi = sdk.api;
                                        _c.label = 10;
                                    case 10:
                                        _b = 0, pushedResponses_2 = pushedResponses;
                                        _c.label = 11;
                                    case 11:
                                        if (!(_b < pushedResponses_2.length)) return [3 /*break*/, 14];
                                        fr = pushedResponses_2[_b];
                                        isFormA = fr.formId === formA_1.id;
                                        targetFieldId = isFormA ? fieldA_1.id : fieldB_1.id;
                                        targetFieldTitle = isFormA ? 'FieldA' : 'FieldB';
                                        return [4 /*yield*/, submitterApi.form_responses.submit_form_response({
                                                accessCode: fr.accessCode,
                                                responses: [{
                                                        fieldId: targetFieldId,
                                                        fieldTitle: targetFieldTitle,
                                                        answer: { type: 'string', value: 'pushed-portal-answer' },
                                                    }],
                                            })];
                                    case 12:
                                        _c.sent();
                                        _c.label = 13;
                                    case 13:
                                        _b++;
                                        return [3 /*break*/, 11];
                                    case 14: return [4 /*yield*/, pollFor(function () { return __awaiter(void 0, void 0, void 0, function () {
                                            var e;
                                            var _a;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0: return [4 /*yield*/, sdk.api.endusers.getOne(enduser.id)];
                                                    case 1:
                                                        e = _b.sent();
                                                        return [2 /*return*/, ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes(tag)) ? e : undefined];
                                                }
                                            });
                                        }); }, function (result) { return !!result; }, "Form Group Completed trigger to apply tag after push-to-portal submissions (".concat(label, ")"), 500, 30)];
                                    case 15:
                                        _c.sent();
                                        return [4 /*yield*/, (0, testing_1.async_test)("Form Group Completed trigger fires for push-to-portal completion (".concat(label, ")"), function () { return sdk.api.endusers.getOne(enduser.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes(tag)); } })];
                                    case 16:
                                        _c.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    };
                    // Admin submitter: simulates a staff user filling in the form on behalf of the patient
                    // (uses a user-scoped DB in submit_form_response).
                    return [4 /*yield*/, runFlow({
                            label: 'admin-submit',
                            tag: 'form-group-completed-push-admin',
                            submitAsEnduser: false,
                        })
                        // Enduser submitter: simulates the patient submitting via the portal
                        // (uses an enduser-scoped DB in submit_form_response — exercises the path QA caught).
                    ];
                case 7:
                    // Admin submitter: simulates a staff user filling in the form on behalf of the patient
                    // (uses a user-scoped DB in submit_form_response).
                    _f.sent();
                    // Enduser submitter: simulates the patient submitting via the portal
                    // (uses an enduser-scoped DB in submit_form_response — exercises the path QA caught).
                    return [4 /*yield*/, runFlow({
                            label: 'enduser-submit',
                            tag: 'form-group-completed-push-enduser',
                            submitAsEnduser: true,
                        })];
                case 8:
                    // Enduser submitter: simulates the patient submitting via the portal
                    // (uses an enduser-scoped DB in submit_form_response — exercises the path QA caught).
                    _f.sent();
                    return [3 /*break*/, 40];
                case 9:
                    _i = 0, createdTriggerIds_1 = createdTriggerIds;
                    _f.label = 10;
                case 10:
                    if (!(_i < createdTriggerIds_1.length)) return [3 /*break*/, 15];
                    id = createdTriggerIds_1[_i];
                    _f.label = 11;
                case 11:
                    _f.trys.push([11, 13, , 14]);
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(id)];
                case 12:
                    _f.sent();
                    return [3 /*break*/, 14];
                case 13:
                    e_1 = _f.sent();
                    return [3 /*break*/, 14];
                case 14:
                    _i++;
                    return [3 /*break*/, 10];
                case 15:
                    _b = 0, createdEnduserIds_1 = createdEnduserIds;
                    _f.label = 16;
                case 16:
                    if (!(_b < createdEnduserIds_1.length)) return [3 /*break*/, 21];
                    id = createdEnduserIds_1[_b];
                    _f.label = 17;
                case 17:
                    _f.trys.push([17, 19, , 20]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(id)];
                case 18:
                    _f.sent();
                    return [3 /*break*/, 20];
                case 19:
                    e_2 = _f.sent();
                    return [3 /*break*/, 20];
                case 20:
                    _b++;
                    return [3 /*break*/, 16];
                case 21:
                    _c = 0, createdJourneyIds_1 = createdJourneyIds;
                    _f.label = 22;
                case 22:
                    if (!(_c < createdJourneyIds_1.length)) return [3 /*break*/, 27];
                    id = createdJourneyIds_1[_c];
                    _f.label = 23;
                case 23:
                    _f.trys.push([23, 25, , 26]);
                    return [4 /*yield*/, sdk.api.journeys.deleteOne(id)];
                case 24:
                    _f.sent();
                    return [3 /*break*/, 26];
                case 25:
                    e_3 = _f.sent();
                    return [3 /*break*/, 26];
                case 26:
                    _c++;
                    return [3 /*break*/, 22];
                case 27:
                    _d = 0, createdFormGroupIds_1 = createdFormGroupIds;
                    _f.label = 28;
                case 28:
                    if (!(_d < createdFormGroupIds_1.length)) return [3 /*break*/, 33];
                    id = createdFormGroupIds_1[_d];
                    _f.label = 29;
                case 29:
                    _f.trys.push([29, 31, , 32]);
                    return [4 /*yield*/, sdk.api.form_groups.deleteOne(id)];
                case 30:
                    _f.sent();
                    return [3 /*break*/, 32];
                case 31:
                    e_4 = _f.sent();
                    return [3 /*break*/, 32];
                case 32:
                    _d++;
                    return [3 /*break*/, 28];
                case 33:
                    _e = 0, createdFormIds_1 = createdFormIds;
                    _f.label = 34;
                case 34:
                    if (!(_e < createdFormIds_1.length)) return [3 /*break*/, 39];
                    id = createdFormIds_1[_e];
                    _f.label = 35;
                case 35:
                    _f.trys.push([35, 37, , 38]);
                    return [4 /*yield*/, sdk.api.forms.deleteOne(id)];
                case 36:
                    _f.sent();
                    return [3 /*break*/, 38];
                case 37:
                    e_5 = _f.sent();
                    return [3 /*break*/, 38];
                case 38:
                    _e++;
                    return [3 /*break*/, 34];
                case 39: return [7 /*endfinally*/];
                case 40: return [2 /*return*/];
            }
        });
    });
};
exports.push_forms_to_portal_group_completion_tests = push_forms_to_portal_group_completion_tests;
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
                    return [4 /*yield*/, (0, exports.push_forms_to_portal_group_completion_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Push forms to portal group completion test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Push forms to portal group completion test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=push_forms_to_portal_group_completion.test.js.map