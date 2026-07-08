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
exports.medication_added_trigger_tests = void 0;
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var constants_1 = require("@tellescope/constants");
var setup_1 = require("../setup");
var host = process.env.API_URL || "http://localhost:8080";
var medication_added_trigger_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var t1, t2, t3, t4, t5, enduser1, enduser2, enduser3, enduser4, enduser5, enduser6, med1, med2, med3, med4, med5, med6, belugaForm, belugaEnduser, belugaFormResponse, belugaTrigger, webhookResponse, _b, _c, _d, belugaMeds, belugaMedSemaglutide, belugaMedMetformin, belugaFormNoCategory, belugaEnduserNoCategory, belugaFormResponseNoCategory, webhookResponseNoCategory, _e, _f, _g, belugaMedsNoCategory, belugaMedNoCategory, setFieldsTrigger, setFieldsEnduser, setFieldsMed, setFieldsTriggerFiltered, setFieldsEnduser2, setFieldsMed2, setFieldsCategoryTrigger, setFieldsCategoryEnduser, setFieldsCategoryMed, setFieldsCategoryEnduserEmpty, setFieldsCategoryMedEmpty, setFieldsPharmacyNotesTrigger, setFieldsPharmacyNotesEnduser, setFieldsPharmacyNotesMed, setFieldsPharmacyNotesEnduserEmpty, setFieldsPharmacyNotesMedEmpty, c1Trigger, c1MatchEnduser, c1MissEnduser, c2Trigger, c2MatchEnduser, c2MissEnduser, c3Trigger, c3MatchEnduser, c3MissEnduser, c4Trigger, c4MatchA, c4MatchB, c4Miss, c5Trigger, c5Match, c5Miss, c6Trigger, c6Match;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    (0, testing_1.log_header)("Automation Trigger Tests (Medication Added)");
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Medication Added', info: { titles: [], protocols: [] } },
                            action: { type: 'Add Tags', info: { tags: ['Med-Any'] } },
                            status: 'Active',
                            title: "Medication - Any"
                        })
                        // T2: Title filter only
                    ];
                case 1:
                    t1 = _h.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Medication Added', info: { titles: ['Lisinopril'], protocols: [] } },
                            action: { type: 'Add Tags', info: { tags: ['Med-Title-Match'] } },
                            status: 'Active',
                            title: "Medication - Title Match"
                        })
                        // T3: Protocol filter only
                    ];
                case 2:
                    t2 = _h.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Medication Added', info: { titles: [], protocols: ['Weight Loss'] } },
                            action: { type: 'Add Tags', info: { tags: ['Med-Protocol-Match'] } },
                            status: 'Active',
                            title: "Medication - Protocol Match"
                        })
                        // T4: Title + protocol filter
                    ];
                case 3:
                    t3 = _h.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Medication Added', info: { titles: ['Metformin'], protocols: ['Diabetes'] } },
                            action: { type: 'Add Tags', info: { tags: ['Med-Title-And-Protocol'] } },
                            status: 'Active',
                            title: "Medication - Title and Protocol"
                        })
                        // T5: Protocol filter that won't match
                    ];
                case 4:
                    t4 = _h.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Medication Added', info: { titles: [], protocols: ['Dermatology'] } },
                            action: { type: 'Add Tags', info: { tags: ['Med-Derm-Protocol'] } },
                            status: 'Active',
                            title: "Medication - Dermatology Protocol"
                        })
                        // Create separate endusers to avoid trigger throttling (1 minute per trigger per enduser)
                    ];
                case 5:
                    t5 = _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 6:
                    enduser1 = _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 7:
                    enduser2 = _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 8:
                    enduser3 = _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 9:
                    enduser4 = _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 10:
                    enduser5 = _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})
                        // Test 1: Any medication — empty titles + empty protocols → fires for any medication
                    ];
                case 11:
                    enduser6 = _h.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({
                            enduserId: enduser1.id,
                            title: 'Aspirin',
                        })];
                case 12:
                    med1 = _h.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 13:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Medication Added - Any medication (no filters)", function () { return sdk.api.endusers.getOne(enduser1.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Med-Any')); } })
                        // Test 2: Title filter only — matching title, no protocol filter → fires
                    ];
                case 14:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({
                            enduserId: enduser2.id,
                            title: 'Lisinopril',
                        })];
                case 15:
                    med2 = _h.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 16:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Medication Added - Title filter match", function () { return sdk.api.endusers.getOne(enduser2.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Med-Title-Match')); } })
                        // Test 3: Protocol filter only — matching protocol, no title filter → fires
                    ];
                case 17:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({
                            enduserId: enduser3.id,
                            title: 'Semaglutide',
                            protocol: 'Weight Loss',
                        })];
                case 18:
                    med3 = _h.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 19:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Medication Added - Protocol filter match", function () { return sdk.api.endusers.getOne(enduser3.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Med-Protocol-Match')); } })
                        // Test 4: Title + protocol filter — both match → fires
                    ];
                case 20:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({
                            enduserId: enduser4.id,
                            title: 'Metformin',
                            protocol: 'Diabetes',
                        })];
                case 21:
                    med4 = _h.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 22:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Medication Added - Title and protocol filter match", function () { return sdk.api.endusers.getOne(enduser4.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Med-Title-And-Protocol')); } })
                        // Test 5: Non-matching protocol — protocol filter doesn't match → does NOT fire
                    ];
                case 23:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({
                            enduserId: enduser5.id,
                            title: 'Ibuprofen',
                            protocol: 'Pain Management',
                        })];
                case 24:
                    med5 = _h.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 25:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Medication Added - Non-matching protocol does NOT fire", function () { return sdk.api.endusers.getOne(enduser5.id); }, { onResult: function (e) { var _a, _b; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Med-Any')) && !((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('Med-Derm-Protocol')); } })
                        // Test 6: No protocol on medication — trigger has protocol filter, medication has no protocol → does NOT fire
                    ];
                case 26:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({
                            enduserId: enduser6.id,
                            title: 'Amoxicillin',
                        })];
                case 27:
                    med6 = _h.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 28:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Medication Added - No protocol on med, protocol filter does NOT fire", function () { return sdk.api.endusers.getOne(enduser6.id); }, { onResult: function (e) { var _a, _b, _c; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Med-Any')) && !((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('Med-Protocol-Match')) && !((_c = e.tags) === null || _c === void 0 ? void 0 : _c.includes('Med-Derm-Protocol')); } })];
                case 29:
                    _h.sent();
                    _h.label = 30;
                case 30:
                    _h.trys.push([30, , 42, 43]);
                    // Clean up test data - triggers first
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(t1.id)];
                case 31:
                    // Clean up test data - triggers first
                    _h.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(t2.id)];
                case 32:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(t3.id)];
                case 33:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(t4.id)];
                case 34:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(t5.id)
                        // Clean up endusers (also cleans up medications)
                    ];
                case 35:
                    _h.sent();
                    // Clean up endusers (also cleans up medications)
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser1.id)];
                case 36:
                    // Clean up endusers (also cleans up medications)
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser2.id)];
                case 37:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser3.id)];
                case 38:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser4.id)];
                case 39:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser5.id)];
                case 40:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser6.id)];
                case 41:
                    _h.sent();
                    return [3 /*break*/, 43];
                case 42: return [7 /*endfinally*/];
                case 43:
                    // ---- Beluga Webhook Integration Test ----
                    (0, testing_1.log_header)("Beluga RX_WRITTEN Webhook Integration Test (Protocol)");
                    return [4 /*yield*/, sdk.api.forms.createOne({
                            title: 'Beluga Protocol Test Form',
                            belugaVisitType: 'Weight Loss',
                        })];
                case 44:
                    belugaForm = _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})
                        // Create a form response that the webhook can look up by masterId
                    ];
                case 45:
                    belugaEnduser = _h.sent();
                    return [4 /*yield*/, sdk.api.form_responses.createOne({
                            formId: belugaForm.id,
                            enduserId: belugaEnduser.id,
                            formTitle: belugaForm.title,
                            responses: [{
                                    fieldId: constants_1.PLACEHOLDER_ID,
                                    fieldTitle: 'placeholder',
                                    answer: { type: 'string', value: 'test' },
                                }],
                        })
                        // Create a trigger that filters on protocol 'Weight Loss'
                    ];
                case 46:
                    belugaFormResponse = _h.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Medication Added', info: { titles: [], protocols: ['Weight Loss'] } },
                            action: { type: 'Add Tags', info: { tags: ['Med-Beluga-Protocol'] } },
                            status: 'Active',
                            title: "Medication - Beluga Protocol Test"
                        })
                        // Simulate the Beluga RX_WRITTEN webhook with two meds covering category/pharmacyNotes present (typical) and "N/A"/absent
                    ];
                case 47:
                    belugaTrigger = _h.sent();
                    return [4 /*yield*/, fetch("".concat(host, "/v1/webhooks/beluga"), {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                masterId: "tellescope_".concat(belugaFormResponse.id),
                                event: 'RX_WRITTEN',
                                docName: 'Dr. Test',
                                medsPrescribed: [{
                                        name: 'Semaglutide',
                                        strength: '0.25mg',
                                        refills: '3',
                                        quantity: '1',
                                        medId: 'test-ndc-123',
                                        rxId: 'test-rx-456',
                                        category: 'weightloss1',
                                        pharmacyNotes: 'Dispense with syringes',
                                    }, {
                                        name: 'Metformin',
                                        strength: '500mg',
                                        refills: '2',
                                        quantity: '1',
                                        medId: 'test-ndc-789',
                                        rxId: 'test-rx-789',
                                        category: 'N/A',
                                    }],
                            }),
                        })];
                case 48:
                    webhookResponse = _h.sent();
                    if (!!webhookResponse.ok) return [3 /*break*/, 50];
                    _b = Error.bind;
                    _d = (_c = "Beluga webhook failed with status ".concat(webhookResponse.status, ": ")).concat;
                    return [4 /*yield*/, webhookResponse.text()];
                case 49: throw new (_b.apply(Error, [void 0, _d.apply(_c, [_h.sent()])]))();
                case 50: return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)
                    // Verify the trigger fired (enduser got the tag)
                ];
                case 51:
                    _h.sent();
                    // Verify the trigger fired (enduser got the tag)
                    return [4 /*yield*/, (0, testing_1.async_test)("Beluga RX_WRITTEN - Protocol trigger fires", function () { return sdk.api.endusers.getOne(belugaEnduser.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Med-Beluga-Protocol')); } })
                        // Verify the medication was created with correct protocol and source
                    ];
                case 52:
                    // Verify the trigger fired (enduser got the tag)
                    _h.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.getSome({ filter: { enduserId: belugaEnduser.id } })];
                case 53:
                    belugaMeds = _h.sent();
                    belugaMedSemaglutide = belugaMeds.find(function (m) { return m.title === 'Semaglutide'; });
                    belugaMedMetformin = belugaMeds.find(function (m) { return m.title === 'Metformin'; });
                    if (!belugaMedSemaglutide || !belugaMedMetformin) {
                        throw new Error("Beluga RX_WRITTEN - expected medications missing. Got: ".concat(belugaMeds.map(function (m) { return m.title; }).join(', ')));
                    }
                    return [4 /*yield*/, (0, testing_1.async_test)("Beluga RX_WRITTEN - Medication has protocol from form belugaVisitType", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, belugaMedSemaglutide];
                        }); }); }, { onResult: function (m) { return (m === null || m === void 0 ? void 0 : m.protocol) === 'Weight Loss' && (m === null || m === void 0 ? void 0 : m.source) === 'Beluga' && (m === null || m === void 0 ? void 0 : m.title) === 'Semaglutide'; } })];
                case 54:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Beluga RX_WRITTEN - Medication has category from webhook", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, belugaMedSemaglutide];
                        }); }); }, { onResult: function (m) { return (m === null || m === void 0 ? void 0 : m.category) === 'weightloss1'; } })];
                case 55:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Beluga RX_WRITTEN - Medication preserves N/A category verbatim", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, belugaMedMetformin];
                        }); }); }, { onResult: function (m) { return (m === null || m === void 0 ? void 0 : m.category) === 'N/A'; } })];
                case 56:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Beluga RX_WRITTEN - Medication has notes from webhook pharmacyNotes", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, belugaMedSemaglutide];
                        }); }); }, { onResult: function (m) { return (m === null || m === void 0 ? void 0 : m.notes) === 'Dispense with syringes'; } })];
                case 57:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Beluga RX_WRITTEN - Medication omits notes when pharmacyNotes not provided on med", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, belugaMedMetformin];
                        }); }); }, { onResult: function (m) { return (m === null || m === void 0 ? void 0 : m.notes) === undefined || (m === null || m === void 0 ? void 0 : m.notes) === null; } })
                        // Backwards-compatibility: a webhook with no category on any med should result in undefined category
                    ];
                case 58:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.forms.createOne({
                            title: 'Beluga Protocol Test Form (no category)',
                            belugaVisitType: 'Weight Loss',
                        })];
                case 59:
                    belugaFormNoCategory = _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 60:
                    belugaEnduserNoCategory = _h.sent();
                    return [4 /*yield*/, sdk.api.form_responses.createOne({
                            formId: belugaFormNoCategory.id,
                            enduserId: belugaEnduserNoCategory.id,
                            formTitle: belugaFormNoCategory.title,
                            responses: [{
                                    fieldId: constants_1.PLACEHOLDER_ID,
                                    fieldTitle: 'placeholder',
                                    answer: { type: 'string', value: 'test' },
                                }],
                        })];
                case 61:
                    belugaFormResponseNoCategory = _h.sent();
                    return [4 /*yield*/, fetch("".concat(host, "/v1/webhooks/beluga"), {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                masterId: "tellescope_".concat(belugaFormResponseNoCategory.id),
                                event: 'RX_WRITTEN',
                                docName: 'Dr. Test',
                                medsPrescribed: [{
                                        name: 'Ibuprofen',
                                        strength: '200mg',
                                        refills: '1',
                                        quantity: '1',
                                        medId: 'test-ndc-nocat',
                                        rxId: 'test-rx-nocat',
                                    }],
                            }),
                        })];
                case 62:
                    webhookResponseNoCategory = _h.sent();
                    if (!!webhookResponseNoCategory.ok) return [3 /*break*/, 64];
                    _e = Error.bind;
                    _g = (_f = "Beluga webhook (no category) failed with status ".concat(webhookResponseNoCategory.status, ": ")).concat;
                    return [4 /*yield*/, webhookResponseNoCategory.text()];
                case 63: throw new (_e.apply(Error, [void 0, _g.apply(_f, [_h.sent()])]))();
                case 64: return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 65:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.getSome({ filter: { enduserId: belugaEnduserNoCategory.id } })];
                case 66:
                    belugaMedsNoCategory = _h.sent();
                    belugaMedNoCategory = belugaMedsNoCategory[0];
                    return [4 /*yield*/, (0, testing_1.async_test)("Beluga RX_WRITTEN - Medication omits category when not provided", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, belugaMedNoCategory];
                        }); }); }, { onResult: function (m) { return (m === null || m === void 0 ? void 0 : m.category) === undefined || (m === null || m === void 0 ? void 0 : m.category) === null; } })];
                case 67:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Beluga RX_WRITTEN - Medication omits notes when pharmacyNotes not provided", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, belugaMedNoCategory];
                        }); }); }, { onResult: function (m) { return (m === null || m === void 0 ? void 0 : m.notes) === undefined || (m === null || m === void 0 ? void 0 : m.notes) === null; } })];
                case 68:
                    _h.sent();
                    _h.label = 69;
                case 69:
                    _h.trys.push([69, , 75, 76]);
                    // Clean up Beluga test data
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(belugaTrigger.id)];
                case 70:
                    // Clean up Beluga test data
                    _h.sent();
                    return [4 /*yield*/, sdk.api.forms.deleteOne(belugaForm.id)];
                case 71:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.forms.deleteOne(belugaFormNoCategory.id)];
                case 72:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(belugaEnduser.id)]; // also cleans up form response and medications
                case 73:
                    _h.sent(); // also cleans up form response and medications
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(belugaEnduserNoCategory.id)]; // also cleans up form response and medications
                case 74:
                    _h.sent(); // also cleans up form response and medications
                    return [3 /*break*/, 76];
                case 75: return [7 /*endfinally*/];
                case 76:
                    // ---- Set Fields with {{medication.name}} Test ----
                    (0, testing_1.log_header)("Medication Added - Set Fields with {{medication.name}}");
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Medication Added', info: { titles: [], protocols: [] } },
                            action: { type: 'Set Fields', info: { fields: [{ name: 'Medication Name', type: 'Custom Value', value: '{{medication.name}}' }] } },
                            status: 'Active',
                            title: "Medication - Set Fields medication.name"
                        })];
                case 77:
                    setFieldsTrigger = _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 78:
                    setFieldsEnduser = _h.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({
                            enduserId: setFieldsEnduser.id,
                            title: 'Lisinopril 10mg',
                        })];
                case 79:
                    setFieldsMed = _h.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 80:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Medication Added - Set Fields copies medication.name to enduser field", function () { return sdk.api.endusers.getOne(setFieldsEnduser.id); }, { onResult: function (e) { var _a; return ((_a = e.fields) === null || _a === void 0 ? void 0 : _a['Medication Name']) === 'Lisinopril 10mg'; } })
                        // Test with title-filtered trigger to verify medication context is passed correctly
                    ];
                case 81:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Medication Added', info: { titles: ['Metformin 500mg'], protocols: [] } },
                            action: { type: 'Set Fields', info: { fields: [{ name: 'Specific Med', type: 'Custom Value', value: '{{medication.name}}' }] } },
                            status: 'Active',
                            title: "Medication - Set Fields filtered"
                        })];
                case 82:
                    setFieldsTriggerFiltered = _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 83:
                    setFieldsEnduser2 = _h.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({
                            enduserId: setFieldsEnduser2.id,
                            title: 'Metformin 500mg',
                        })];
                case 84:
                    setFieldsMed2 = _h.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 85:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Medication Added - Set Fields with title filter copies medication.name", function () { return sdk.api.endusers.getOne(setFieldsEnduser2.id); }, { onResult: function (e) { var _a; return ((_a = e.fields) === null || _a === void 0 ? void 0 : _a['Specific Med']) === 'Metformin 500mg'; } })
                        // ---- Set Fields with {{medication.category}} Test ----
                    ];
                case 86:
                    _h.sent();
                    // ---- Set Fields with {{medication.category}} Test ----
                    (0, testing_1.log_header)("Medication Added - Set Fields with {{medication.category}}");
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Medication Added', info: { titles: [], protocols: [] } },
                            action: { type: 'Set Fields', info: { fields: [{ name: 'Medication Category', type: 'Custom Value', value: '{{medication.category}}' }] } },
                            status: 'Active',
                            title: "Medication - Set Fields medication.category"
                        })];
                case 87:
                    setFieldsCategoryTrigger = _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 88:
                    setFieldsCategoryEnduser = _h.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({
                            enduserId: setFieldsCategoryEnduser.id,
                            title: 'Ozempic 0.5mg',
                            category: 'weightloss1',
                        })];
                case 89:
                    setFieldsCategoryMed = _h.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 90:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Medication Added - Set Fields copies medication.category to enduser field", function () { return sdk.api.endusers.getOne(setFieldsCategoryEnduser.id); }, { onResult: function (e) { var _a; return ((_a = e.fields) === null || _a === void 0 ? void 0 : _a['Medication Category']) === 'weightloss1'; } })
                        // Category absent on medication → placeholder resolves to empty string
                    ];
                case 91:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 92:
                    setFieldsCategoryEnduserEmpty = _h.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({
                            enduserId: setFieldsCategoryEnduserEmpty.id,
                            title: 'Lisinopril 20mg',
                        })];
                case 93:
                    setFieldsCategoryMedEmpty = _h.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 94:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Medication Added - Set Fields with no category resolves to empty string", function () { return sdk.api.endusers.getOne(setFieldsCategoryEnduserEmpty.id); }, { onResult: function (e) { var _a; return ((_a = e.fields) === null || _a === void 0 ? void 0 : _a['Medication Category']) === ''; } })
                        // ---- Set Fields with {{medication.notes}} Test ----
                    ];
                case 95:
                    _h.sent();
                    // ---- Set Fields with {{medication.notes}} Test ----
                    (0, testing_1.log_header)("Medication Added - Set Fields with {{medication.notes}}");
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Medication Added', info: { titles: [], protocols: [] } },
                            action: { type: 'Set Fields', info: { fields: [{ name: 'Medication Notes', type: 'Custom Value', value: '{{medication.notes}}' }] } },
                            status: 'Active',
                            title: "Medication - Set Fields medication.notes"
                        })];
                case 96:
                    setFieldsPharmacyNotesTrigger = _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 97:
                    setFieldsPharmacyNotesEnduser = _h.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({
                            enduserId: setFieldsPharmacyNotesEnduser.id,
                            title: 'Ozempic 1mg',
                            notes: 'Dispense with syringes',
                        })];
                case 98:
                    setFieldsPharmacyNotesMed = _h.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 99:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Medication Added - Set Fields copies medication.notes to enduser field", function () { return sdk.api.endusers.getOne(setFieldsPharmacyNotesEnduser.id); }, { onResult: function (e) { var _a; return ((_a = e.fields) === null || _a === void 0 ? void 0 : _a['Medication Notes']) === 'Dispense with syringes'; } })
                        // notes absent on medication → placeholder resolves to empty string
                    ];
                case 100:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 101:
                    setFieldsPharmacyNotesEnduserEmpty = _h.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({
                            enduserId: setFieldsPharmacyNotesEnduserEmpty.id,
                            title: 'Lisinopril 40mg',
                        })];
                case 102:
                    setFieldsPharmacyNotesMedEmpty = _h.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 103:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Medication Added - Set Fields with no notes resolves to empty string", function () { return sdk.api.endusers.getOne(setFieldsPharmacyNotesEnduserEmpty.id); }, { onResult: function (e) { var _a; return ((_a = e.fields) === null || _a === void 0 ? void 0 : _a['Medication Notes']) === ''; } })];
                case 104:
                    _h.sent();
                    _h.label = 105;
                case 105:
                    _h.trys.push([105, , 116, 117]);
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(setFieldsTrigger.id)];
                case 106:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(setFieldsTriggerFiltered.id)];
                case 107:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(setFieldsCategoryTrigger.id)];
                case 108:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(setFieldsPharmacyNotesTrigger.id)];
                case 109:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(setFieldsEnduser.id)];
                case 110:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(setFieldsEnduser2.id)];
                case 111:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(setFieldsCategoryEnduser.id)];
                case 112:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(setFieldsCategoryEnduserEmpty.id)];
                case 113:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(setFieldsPharmacyNotesEnduser.id)];
                case 114:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(setFieldsPharmacyNotesEnduserEmpty.id)];
                case 115:
                    _h.sent();
                    return [3 /*break*/, 117];
                case 116: return [7 /*endfinally*/];
                case 117:
                    // ---- titleCondition (compound conditional logic on title) ----
                    (0, testing_1.log_header)("Medication Added - titleCondition compound logic");
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: {
                                type: 'Medication Added',
                                info: {
                                    titles: [],
                                    protocols: [],
                                    titleCondition: { condition: { title: { $contains: 'GLP' } } },
                                },
                            },
                            action: { type: 'Add Tags', info: { tags: ['Med-Cond-Contains-GLP'] } },
                            status: 'Active',
                            title: "Medication - titleCondition contains GLP"
                        })];
                case 118:
                    c1Trigger = _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 119:
                    c1MatchEnduser = _h.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({ enduserId: c1MatchEnduser.id, title: 'Semaglutide GLP-1' })];
                case 120:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 121:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("titleCondition $contains - matching medication fires", function () { return sdk.api.endusers.getOne(c1MatchEnduser.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Med-Cond-Contains-GLP')); } })];
                case 122:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 123:
                    c1MissEnduser = _h.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({ enduserId: c1MissEnduser.id, title: 'Aspirin' })];
                case 124:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 125:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("titleCondition $contains - non-matching medication does NOT fire", function () { return sdk.api.endusers.getOne(c1MissEnduser.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Med-Cond-Contains-GLP')); } })
                        // C2: $ne — fires for everything except 'Placebo'
                    ];
                case 126:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: {
                                type: 'Medication Added',
                                info: {
                                    titles: [],
                                    protocols: [],
                                    titleCondition: { condition: { title: { $ne: 'Placebo' } } },
                                },
                            },
                            action: { type: 'Add Tags', info: { tags: ['Med-Cond-Ne-Placebo'] } },
                            status: 'Active',
                            title: "Medication - titleCondition ne Placebo"
                        })];
                case 127:
                    c2Trigger = _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 128:
                    c2MatchEnduser = _h.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({ enduserId: c2MatchEnduser.id, title: 'Metformin' })];
                case 129:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 130:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("titleCondition $ne - non-Placebo medication fires", function () { return sdk.api.endusers.getOne(c2MatchEnduser.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Med-Cond-Ne-Placebo')); } })];
                case 131:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 132:
                    c2MissEnduser = _h.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({ enduserId: c2MissEnduser.id, title: 'Placebo' })];
                case 133:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 134:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("titleCondition $ne - Placebo medication does NOT fire", function () { return sdk.api.endusers.getOne(c2MissEnduser.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Med-Cond-Ne-Placebo')); } })
                        // C3: compound $and — contains 'mg' AND does not contain 'Placebo' (case-sensitive)
                    ];
                case 135:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: {
                                type: 'Medication Added',
                                info: {
                                    titles: [],
                                    protocols: [],
                                    titleCondition: {
                                        $and: [
                                            { condition: { title: { $contains: 'mg' } } },
                                            { condition: { title: { $doesNotContain: 'Placebo' } } },
                                        ],
                                    },
                                },
                            },
                            action: { type: 'Add Tags', info: { tags: ['Med-Cond-And'] } },
                            status: 'Active',
                            title: "Medication - titleCondition compound AND"
                        })];
                case 136:
                    c3Trigger = _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 137:
                    c3MatchEnduser = _h.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({ enduserId: c3MatchEnduser.id, title: 'Lisinopril 10mg' })];
                case 138:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 139:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("titleCondition $and - both pass fires", function () { return sdk.api.endusers.getOne(c3MatchEnduser.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Med-Cond-And')); } })];
                case 140:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 141:
                    c3MissEnduser = _h.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({ enduserId: c3MissEnduser.id, title: 'Placebo 5mg' })];
                case 142:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 143:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("titleCondition $and - second branch fails does NOT fire", function () { return sdk.api.endusers.getOne(c3MissEnduser.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Med-Cond-And')); } })
                        // C4: compound $or — equals 'Aspirin' OR contains 'pril'
                    ];
                case 144:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: {
                                type: 'Medication Added',
                                info: {
                                    titles: [],
                                    protocols: [],
                                    titleCondition: {
                                        $or: [
                                            { condition: { title: 'Aspirin' } },
                                            { condition: { title: { $contains: 'pril' } } },
                                        ],
                                    },
                                },
                            },
                            action: { type: 'Add Tags', info: { tags: ['Med-Cond-Or'] } },
                            status: 'Active',
                            title: "Medication - titleCondition compound OR"
                        })];
                case 145:
                    c4Trigger = _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 146:
                    c4MatchA = _h.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({ enduserId: c4MatchA.id, title: 'Aspirin' })];
                case 147:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 148:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("titleCondition $or - first branch matches fires", function () { return sdk.api.endusers.getOne(c4MatchA.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Med-Cond-Or')); } })];
                case 149:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 150:
                    c4MatchB = _h.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({ enduserId: c4MatchB.id, title: 'Lisinopril' })];
                case 151:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 152:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("titleCondition $or - second branch matches fires", function () { return sdk.api.endusers.getOne(c4MatchB.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Med-Cond-Or')); } })];
                case 153:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 154:
                    c4Miss = _h.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({ enduserId: c4Miss.id, title: 'Metformin' })];
                case 155:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 156:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("titleCondition $or - neither branch matches does NOT fire", function () { return sdk.api.endusers.getOne(c4Miss.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Med-Cond-Or')); } })
                        // C5: backwards compatibility — no titleCondition, titles array still works
                    ];
                case 157:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Medication Added', info: { titles: ['Atorvastatin'], protocols: [] } },
                            action: { type: 'Add Tags', info: { tags: ['Med-Cond-BackCompat'] } },
                            status: 'Active',
                            title: "Medication - titles array back-compat"
                        })];
                case 158:
                    c5Trigger = _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 159:
                    c5Match = _h.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({ enduserId: c5Match.id, title: 'Atorvastatin' })];
                case 160:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 161:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("titles back-compat - title match still fires without titleCondition", function () { return sdk.api.endusers.getOne(c5Match.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Med-Cond-BackCompat')); } })];
                case 162:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 163:
                    c5Miss = _h.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({ enduserId: c5Miss.id, title: 'Aspirin' })];
                case 164:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 165:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("titles back-compat - non-match does NOT fire without titleCondition", function () { return sdk.api.endusers.getOne(c5Miss.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Med-Cond-BackCompat')); } })
                        // C6: combined — titles array AND titleCondition compose (both must pass)
                    ];
                case 166:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: {
                                type: 'Medication Added',
                                info: {
                                    titles: ['Lisinopril'],
                                    protocols: [],
                                    titleCondition: { condition: { title: { $contains: 'Lisin' } } },
                                },
                            },
                            action: { type: 'Add Tags', info: { tags: ['Med-Cond-Combined'] } },
                            status: 'Active',
                            title: "Medication - titles + titleCondition combined"
                        })];
                case 167:
                    c6Trigger = _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 168:
                    c6Match = _h.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({ enduserId: c6Match.id, title: 'Lisinopril' })];
                case 169:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 170:
                    _h.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("titleCondition combined - both pass fires", function () { return sdk.api.endusers.getOne(c6Match.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Med-Cond-Combined')); } })];
                case 171:
                    _h.sent();
                    _h.label = 172;
                case 172:
                    _h.trys.push([172, , 191, 192]);
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(c1Trigger.id)];
                case 173:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(c2Trigger.id)];
                case 174:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(c3Trigger.id)];
                case 175:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(c4Trigger.id)];
                case 176:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(c5Trigger.id)];
                case 177:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(c6Trigger.id)];
                case 178:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(c1MatchEnduser.id)];
                case 179:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(c1MissEnduser.id)];
                case 180:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(c2MatchEnduser.id)];
                case 181:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(c2MissEnduser.id)];
                case 182:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(c3MatchEnduser.id)];
                case 183:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(c3MissEnduser.id)];
                case 184:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(c4MatchA.id)];
                case 185:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(c4MatchB.id)];
                case 186:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(c4Miss.id)];
                case 187:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(c5Match.id)];
                case 188:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(c5Miss.id)];
                case 189:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(c6Match.id)];
                case 190:
                    _h.sent();
                    return [3 /*break*/, 192];
                case 191: return [7 /*endfinally*/];
                case 192: return [2 /*return*/];
            }
        });
    });
};
exports.medication_added_trigger_tests = medication_added_trigger_tests;
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
                    return [4 /*yield*/, (0, exports.medication_added_trigger_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Medication Added trigger tests completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Medication Added trigger tests failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=medication_added_trigger.test.js.map