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
        var createdEnduserIds, createdJourneyIds, createdFormIds, createdFormGroupIds, createdTriggerIds, formA, fieldA, formB, fieldB, formGroup, trigger, journey, pushStep, enduser_1, pushedResponses, _i, pushedResponses_1, fr, _b, pushedResponses_2, fr, isFormA, targetFieldId, targetFieldTitle, _c, createdTriggerIds_1, id, e_1, _d, createdEnduserIds_1, id, e_2, _e, createdJourneyIds_1, id, e_3, _f, createdFormGroupIds_1, id, e_4, _g, createdFormIds_1, id, e_5;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    (0, testing_1.log_header)("Push Forms To Portal - Form Group Completed Trigger Tests");
                    createdEnduserIds = [];
                    createdJourneyIds = [];
                    createdFormIds = [];
                    createdFormGroupIds = [];
                    createdTriggerIds = [];
                    _h.label = 1;
                case 1:
                    _h.trys.push([1, , 20, 51]);
                    return [4 /*yield*/, sdk.api.forms.createOne({ title: 'Push To Portal Form A' })];
                case 2:
                    formA = _h.sent();
                    createdFormIds.push(formA.id);
                    return [4 /*yield*/, sdk.api.form_fields.createOne({
                            formId: formA.id,
                            type: 'string',
                            title: 'FieldA',
                            previousFields: [{ type: 'root', info: {} }],
                        })];
                case 3:
                    fieldA = _h.sent();
                    return [4 /*yield*/, sdk.api.forms.createOne({ title: 'Push To Portal Form B' })];
                case 4:
                    formB = _h.sent();
                    createdFormIds.push(formB.id);
                    return [4 /*yield*/, sdk.api.form_fields.createOne({
                            formId: formB.id,
                            type: 'string',
                            title: 'FieldB',
                            previousFields: [{ type: 'root', info: {} }],
                        })
                        // 2. Create a form group containing both forms
                    ];
                case 5:
                    fieldB = _h.sent();
                    return [4 /*yield*/, sdk.api.form_groups.createOne({
                            title: 'Push To Portal Test Group',
                            formIds: [formA.id, formB.id],
                        })];
                case 6:
                    formGroup = _h.sent();
                    createdFormGroupIds.push(formGroup.id);
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Form Group Completed', info: { groupId: formGroup.id } },
                            action: { type: 'Add Tags', info: { tags: ['form-group-completed-push'] } },
                            status: 'Active',
                            title: 'Form Group Completed - Push to Portal',
                        })];
                case 7:
                    trigger = _h.sent();
                    createdTriggerIds.push(trigger.id);
                    return [4 /*yield*/, sdk.api.journeys.createOne({
                            title: 'Push To Portal Trigger Journey',
                        })];
                case 8:
                    journey = _h.sent();
                    createdJourneyIds.push(journey.id);
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: journey.id,
                            action: { type: 'pushFormsToPortal', info: { formGroupIds: [formGroup.id] } },
                            events: [{ type: 'onJourneyStart', info: {} }],
                        })
                        // 5. Create enduser and add to journey
                    ];
                case 9:
                    pushStep = _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'PushPortal', lname: 'Tester' })];
                case 10:
                    enduser_1 = _h.sent();
                    createdEnduserIds.push(enduser_1.id);
                    return [4 /*yield*/, sdk.api.endusers.add_to_journey({
                            enduserIds: [enduser_1.id],
                            journeyId: journey.id,
                        })
                        // 6. Poll for the worker to create the push-to-portal form_responses
                    ];
                case 11:
                    _h.sent();
                    return [4 /*yield*/, pollFor(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var responses, pushed;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.form_responses.getSome({
                                            filter: { enduserId: enduser_1.id },
                                        })];
                                    case 1:
                                        responses = _a.sent();
                                        pushed = responses.filter(function (r) { return !!r.pushedToPortalAt; });
                                        return [2 /*return*/, pushed.length >= 2 ? pushed : undefined];
                                }
                            });
                        }); }, function (result) { return Array.isArray(result) && result.length >= 2; }, 'pushed-to-portal form_responses to be created by worker', 500, 40)
                        // 7. Assert worker behavior: groupId === automationStepId and pushedToPortalAt is set
                    ];
                case 12:
                    pushedResponses = _h.sent();
                    // 7. Assert worker behavior: groupId === automationStepId and pushedToPortalAt is set
                    for (_i = 0, pushedResponses_1 = pushedResponses; _i < pushedResponses_1.length; _i++) {
                        fr = pushedResponses_1[_i];
                        if (!fr.pushedToPortalAt) {
                            throw new Error("Expected pushedToPortalAt to be set on form_response ".concat(fr.id));
                        }
                        if (fr.groupId !== pushStep.id) {
                            throw new Error("Expected form_response.groupId (".concat(fr.groupId, ") to equal automation step id (").concat(pushStep.id, ")"));
                        }
                        if (fr.automationStepId !== pushStep.id) {
                            throw new Error("Expected form_response.automationStepId (".concat(fr.automationStepId, ") to equal automation step id (").concat(pushStep.id, ")"));
                        }
                    }
                    return [4 /*yield*/, (0, testing_1.async_test)("Worker writes groupId === automationStepId and pushedToPortalAt set", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, true];
                        }); }); }, { onResult: function (r) { return r === true; } })
                        // 8. Submit every form_response on behalf of the enduser
                        // Identify which form_response corresponds to formA / formB via formId
                    ];
                case 13:
                    _h.sent();
                    _b = 0, pushedResponses_2 = pushedResponses;
                    _h.label = 14;
                case 14:
                    if (!(_b < pushedResponses_2.length)) return [3 /*break*/, 17];
                    fr = pushedResponses_2[_b];
                    isFormA = fr.formId === formA.id;
                    targetFieldId = isFormA ? fieldA.id : fieldB.id;
                    targetFieldTitle = isFormA ? 'FieldA' : 'FieldB';
                    return [4 /*yield*/, sdk.api.form_responses.submit_form_response({
                            accessCode: fr.accessCode,
                            responses: [{
                                    fieldId: targetFieldId,
                                    fieldTitle: targetFieldTitle,
                                    answer: { type: 'string', value: 'pushed-portal-answer' },
                                }],
                        })];
                case 15:
                    _h.sent();
                    _h.label = 16;
                case 16:
                    _b++;
                    return [3 /*break*/, 14];
                case 17: 
                // 9. Poll for the trigger's side-effect (tag on enduser)
                return [4 /*yield*/, pollFor(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var e;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, sdk.api.endusers.getOne(enduser_1.id)];
                                case 1:
                                    e = _b.sent();
                                    return [2 /*return*/, ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('form-group-completed-push')) ? e : undefined];
                            }
                        });
                    }); }, function (result) { return !!result; }, 'Form Group Completed trigger to apply tag after push-to-portal submissions', 500, 30)];
                case 18:
                    // 9. Poll for the trigger's side-effect (tag on enduser)
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Form Group Completed trigger fires for push-to-portal completion", function () { return sdk.api.endusers.getOne(enduser_1.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('form-group-completed-push')); } })];
                case 19:
                    _h.sent();
                    return [3 /*break*/, 51];
                case 20:
                    _c = 0, createdTriggerIds_1 = createdTriggerIds;
                    _h.label = 21;
                case 21:
                    if (!(_c < createdTriggerIds_1.length)) return [3 /*break*/, 26];
                    id = createdTriggerIds_1[_c];
                    _h.label = 22;
                case 22:
                    _h.trys.push([22, 24, , 25]);
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(id)];
                case 23:
                    _h.sent();
                    return [3 /*break*/, 25];
                case 24:
                    e_1 = _h.sent();
                    return [3 /*break*/, 25];
                case 25:
                    _c++;
                    return [3 /*break*/, 21];
                case 26:
                    _d = 0, createdEnduserIds_1 = createdEnduserIds;
                    _h.label = 27;
                case 27:
                    if (!(_d < createdEnduserIds_1.length)) return [3 /*break*/, 32];
                    id = createdEnduserIds_1[_d];
                    _h.label = 28;
                case 28:
                    _h.trys.push([28, 30, , 31]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(id)];
                case 29:
                    _h.sent();
                    return [3 /*break*/, 31];
                case 30:
                    e_2 = _h.sent();
                    return [3 /*break*/, 31];
                case 31:
                    _d++;
                    return [3 /*break*/, 27];
                case 32:
                    _e = 0, createdJourneyIds_1 = createdJourneyIds;
                    _h.label = 33;
                case 33:
                    if (!(_e < createdJourneyIds_1.length)) return [3 /*break*/, 38];
                    id = createdJourneyIds_1[_e];
                    _h.label = 34;
                case 34:
                    _h.trys.push([34, 36, , 37]);
                    return [4 /*yield*/, sdk.api.journeys.deleteOne(id)];
                case 35:
                    _h.sent();
                    return [3 /*break*/, 37];
                case 36:
                    e_3 = _h.sent();
                    return [3 /*break*/, 37];
                case 37:
                    _e++;
                    return [3 /*break*/, 33];
                case 38:
                    _f = 0, createdFormGroupIds_1 = createdFormGroupIds;
                    _h.label = 39;
                case 39:
                    if (!(_f < createdFormGroupIds_1.length)) return [3 /*break*/, 44];
                    id = createdFormGroupIds_1[_f];
                    _h.label = 40;
                case 40:
                    _h.trys.push([40, 42, , 43]);
                    return [4 /*yield*/, sdk.api.form_groups.deleteOne(id)];
                case 41:
                    _h.sent();
                    return [3 /*break*/, 43];
                case 42:
                    e_4 = _h.sent();
                    return [3 /*break*/, 43];
                case 43:
                    _f++;
                    return [3 /*break*/, 39];
                case 44:
                    _g = 0, createdFormIds_1 = createdFormIds;
                    _h.label = 45;
                case 45:
                    if (!(_g < createdFormIds_1.length)) return [3 /*break*/, 50];
                    id = createdFormIds_1[_g];
                    _h.label = 46;
                case 46:
                    _h.trys.push([46, 48, , 49]);
                    return [4 /*yield*/, sdk.api.forms.deleteOne(id)];
                case 47:
                    _h.sent();
                    return [3 /*break*/, 49];
                case 48:
                    e_5 = _h.sent();
                    return [3 /*break*/, 49];
                case 49:
                    _g++;
                    return [3 /*break*/, 45];
                case 50: return [7 /*endfinally*/];
                case 51: return [2 /*return*/];
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