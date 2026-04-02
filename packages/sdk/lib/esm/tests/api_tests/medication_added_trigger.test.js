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
import { Session } from "../../sdk";
import { log_header, wait, async_test } from "@tellescope/testing";
import { PLACEHOLDER_ID } from "@tellescope/constants";
import { setup_tests } from "../setup";
var host = process.env.API_URL || "http://localhost:8080";
export var medication_added_trigger_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var t1, t2, t3, t4, t5, enduser1, enduser2, enduser3, enduser4, enduser5, enduser6, med1, med2, med3, med4, med5, med6, belugaForm, belugaEnduser, belugaFormResponse, belugaTrigger, webhookResponse, _b, _c, _d, belugaMeds, belugaMed, setFieldsTrigger, setFieldsEnduser, setFieldsMed, setFieldsTriggerFiltered, setFieldsEnduser2, setFieldsMed2;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    log_header("Automation Trigger Tests (Medication Added)");
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Medication Added', info: { titles: [], protocols: [] } },
                            action: { type: 'Add Tags', info: { tags: ['Med-Any'] } },
                            status: 'Active',
                            title: "Medication - Any"
                        })
                        // T2: Title filter only
                    ];
                case 1:
                    t1 = _e.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Medication Added', info: { titles: ['Lisinopril'], protocols: [] } },
                            action: { type: 'Add Tags', info: { tags: ['Med-Title-Match'] } },
                            status: 'Active',
                            title: "Medication - Title Match"
                        })
                        // T3: Protocol filter only
                    ];
                case 2:
                    t2 = _e.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Medication Added', info: { titles: [], protocols: ['Weight Loss'] } },
                            action: { type: 'Add Tags', info: { tags: ['Med-Protocol-Match'] } },
                            status: 'Active',
                            title: "Medication - Protocol Match"
                        })
                        // T4: Title + protocol filter
                    ];
                case 3:
                    t3 = _e.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Medication Added', info: { titles: ['Metformin'], protocols: ['Diabetes'] } },
                            action: { type: 'Add Tags', info: { tags: ['Med-Title-And-Protocol'] } },
                            status: 'Active',
                            title: "Medication - Title and Protocol"
                        })
                        // T5: Protocol filter that won't match
                    ];
                case 4:
                    t4 = _e.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Medication Added', info: { titles: [], protocols: ['Dermatology'] } },
                            action: { type: 'Add Tags', info: { tags: ['Med-Derm-Protocol'] } },
                            status: 'Active',
                            title: "Medication - Dermatology Protocol"
                        })
                        // Create separate endusers to avoid trigger throttling (1 minute per trigger per enduser)
                    ];
                case 5:
                    t5 = _e.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 6:
                    enduser1 = _e.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 7:
                    enduser2 = _e.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 8:
                    enduser3 = _e.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 9:
                    enduser4 = _e.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 10:
                    enduser5 = _e.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})
                        // Test 1: Any medication — empty titles + empty protocols → fires for any medication
                    ];
                case 11:
                    enduser6 = _e.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({
                            enduserId: enduser1.id,
                            title: 'Aspirin',
                        })];
                case 12:
                    med1 = _e.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 13:
                    _e.sent();
                    return [4 /*yield*/, async_test("Medication Added - Any medication (no filters)", function () { return sdk.api.endusers.getOne(enduser1.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Med-Any')); } })
                        // Test 2: Title filter only — matching title, no protocol filter → fires
                    ];
                case 14:
                    _e.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({
                            enduserId: enduser2.id,
                            title: 'Lisinopril',
                        })];
                case 15:
                    med2 = _e.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 16:
                    _e.sent();
                    return [4 /*yield*/, async_test("Medication Added - Title filter match", function () { return sdk.api.endusers.getOne(enduser2.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Med-Title-Match')); } })
                        // Test 3: Protocol filter only — matching protocol, no title filter → fires
                    ];
                case 17:
                    _e.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({
                            enduserId: enduser3.id,
                            title: 'Semaglutide',
                            protocol: 'Weight Loss',
                        })];
                case 18:
                    med3 = _e.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 19:
                    _e.sent();
                    return [4 /*yield*/, async_test("Medication Added - Protocol filter match", function () { return sdk.api.endusers.getOne(enduser3.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Med-Protocol-Match')); } })
                        // Test 4: Title + protocol filter — both match → fires
                    ];
                case 20:
                    _e.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({
                            enduserId: enduser4.id,
                            title: 'Metformin',
                            protocol: 'Diabetes',
                        })];
                case 21:
                    med4 = _e.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 22:
                    _e.sent();
                    return [4 /*yield*/, async_test("Medication Added - Title and protocol filter match", function () { return sdk.api.endusers.getOne(enduser4.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Med-Title-And-Protocol')); } })
                        // Test 5: Non-matching protocol — protocol filter doesn't match → does NOT fire
                    ];
                case 23:
                    _e.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({
                            enduserId: enduser5.id,
                            title: 'Ibuprofen',
                            protocol: 'Pain Management',
                        })];
                case 24:
                    med5 = _e.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 25:
                    _e.sent();
                    return [4 /*yield*/, async_test("Medication Added - Non-matching protocol does NOT fire", function () { return sdk.api.endusers.getOne(enduser5.id); }, { onResult: function (e) { var _a, _b; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Med-Any')) && !((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('Med-Derm-Protocol')); } })
                        // Test 6: No protocol on medication — trigger has protocol filter, medication has no protocol → does NOT fire
                    ];
                case 26:
                    _e.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({
                            enduserId: enduser6.id,
                            title: 'Amoxicillin',
                        })];
                case 27:
                    med6 = _e.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 28:
                    _e.sent();
                    return [4 /*yield*/, async_test("Medication Added - No protocol on med, protocol filter does NOT fire", function () { return sdk.api.endusers.getOne(enduser6.id); }, { onResult: function (e) { var _a, _b, _c; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Med-Any')) && !((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('Med-Protocol-Match')) && !((_c = e.tags) === null || _c === void 0 ? void 0 : _c.includes('Med-Derm-Protocol')); } })];
                case 29:
                    _e.sent();
                    _e.label = 30;
                case 30:
                    _e.trys.push([30, , 42, 43]);
                    // Clean up test data - triggers first
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(t1.id)];
                case 31:
                    // Clean up test data - triggers first
                    _e.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(t2.id)];
                case 32:
                    _e.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(t3.id)];
                case 33:
                    _e.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(t4.id)];
                case 34:
                    _e.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(t5.id)
                        // Clean up endusers (also cleans up medications)
                    ];
                case 35:
                    _e.sent();
                    // Clean up endusers (also cleans up medications)
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser1.id)];
                case 36:
                    // Clean up endusers (also cleans up medications)
                    _e.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser2.id)];
                case 37:
                    _e.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser3.id)];
                case 38:
                    _e.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser4.id)];
                case 39:
                    _e.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser5.id)];
                case 40:
                    _e.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser6.id)];
                case 41:
                    _e.sent();
                    return [3 /*break*/, 43];
                case 42: return [7 /*endfinally*/];
                case 43:
                    // ---- Beluga Webhook Integration Test ----
                    log_header("Beluga RX_WRITTEN Webhook Integration Test (Protocol)");
                    return [4 /*yield*/, sdk.api.forms.createOne({
                            title: 'Beluga Protocol Test Form',
                            belugaVisitType: 'Weight Loss',
                        })];
                case 44:
                    belugaForm = _e.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})
                        // Create a form response that the webhook can look up by masterId
                    ];
                case 45:
                    belugaEnduser = _e.sent();
                    return [4 /*yield*/, sdk.api.form_responses.createOne({
                            formId: belugaForm.id,
                            enduserId: belugaEnduser.id,
                            formTitle: belugaForm.title,
                            responses: [{
                                    fieldId: PLACEHOLDER_ID,
                                    fieldTitle: 'placeholder',
                                    answer: { type: 'string', value: 'test' },
                                }],
                        })
                        // Create a trigger that filters on protocol 'Weight Loss'
                    ];
                case 46:
                    belugaFormResponse = _e.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Medication Added', info: { titles: [], protocols: ['Weight Loss'] } },
                            action: { type: 'Add Tags', info: { tags: ['Med-Beluga-Protocol'] } },
                            status: 'Active',
                            title: "Medication - Beluga Protocol Test"
                        })
                        // Simulate the Beluga RX_WRITTEN webhook
                    ];
                case 47:
                    belugaTrigger = _e.sent();
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
                                    }],
                            }),
                        })];
                case 48:
                    webhookResponse = _e.sent();
                    if (!!webhookResponse.ok) return [3 /*break*/, 50];
                    _b = Error.bind;
                    _d = (_c = "Beluga webhook failed with status ".concat(webhookResponse.status, ": ")).concat;
                    return [4 /*yield*/, webhookResponse.text()];
                case 49: throw new (_b.apply(Error, [void 0, _d.apply(_c, [_e.sent()])]))();
                case 50: return [4 /*yield*/, wait(undefined, 500)
                    // Verify the trigger fired (enduser got the tag)
                ];
                case 51:
                    _e.sent();
                    // Verify the trigger fired (enduser got the tag)
                    return [4 /*yield*/, async_test("Beluga RX_WRITTEN - Protocol trigger fires", function () { return sdk.api.endusers.getOne(belugaEnduser.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Med-Beluga-Protocol')); } })
                        // Verify the medication was created with correct protocol and source
                    ];
                case 52:
                    // Verify the trigger fired (enduser got the tag)
                    _e.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.getSome({ filter: { enduserId: belugaEnduser.id } })];
                case 53:
                    belugaMeds = _e.sent();
                    belugaMed = belugaMeds[0];
                    return [4 /*yield*/, async_test("Beluga RX_WRITTEN - Medication has protocol from form belugaVisitType", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, belugaMed];
                        }); }); }, { onResult: function (m) { return m.protocol === 'Weight Loss' && m.source === 'Beluga' && m.title === 'Semaglutide'; } })];
                case 54:
                    _e.sent();
                    _e.label = 55;
                case 55:
                    _e.trys.push([55, , 59, 60]);
                    // Clean up Beluga test data
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(belugaTrigger.id)];
                case 56:
                    // Clean up Beluga test data
                    _e.sent();
                    return [4 /*yield*/, sdk.api.forms.deleteOne(belugaForm.id)];
                case 57:
                    _e.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(belugaEnduser.id)]; // also cleans up form response and medications
                case 58:
                    _e.sent(); // also cleans up form response and medications
                    return [3 /*break*/, 60];
                case 59: return [7 /*endfinally*/];
                case 60:
                    // ---- Set Fields with {{medication.name}} Test ----
                    log_header("Medication Added - Set Fields with {{medication.name}}");
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Medication Added', info: { titles: [], protocols: [] } },
                            action: { type: 'Set Fields', info: { fields: [{ name: 'Medication Name', type: 'Custom Value', value: '{{medication.name}}' }] } },
                            status: 'Active',
                            title: "Medication - Set Fields medication.name"
                        })];
                case 61:
                    setFieldsTrigger = _e.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 62:
                    setFieldsEnduser = _e.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({
                            enduserId: setFieldsEnduser.id,
                            title: 'Lisinopril 10mg',
                        })];
                case 63:
                    setFieldsMed = _e.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 64:
                    _e.sent();
                    return [4 /*yield*/, async_test("Medication Added - Set Fields copies medication.name to enduser field", function () { return sdk.api.endusers.getOne(setFieldsEnduser.id); }, { onResult: function (e) { var _a; return ((_a = e.fields) === null || _a === void 0 ? void 0 : _a['Medication Name']) === 'Lisinopril 10mg'; } })
                        // Test with title-filtered trigger to verify medication context is passed correctly
                    ];
                case 65:
                    _e.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Medication Added', info: { titles: ['Metformin 500mg'], protocols: [] } },
                            action: { type: 'Set Fields', info: { fields: [{ name: 'Specific Med', type: 'Custom Value', value: '{{medication.name}}' }] } },
                            status: 'Active',
                            title: "Medication - Set Fields filtered"
                        })];
                case 66:
                    setFieldsTriggerFiltered = _e.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 67:
                    setFieldsEnduser2 = _e.sent();
                    return [4 /*yield*/, sdk.api.enduser_medications.createOne({
                            enduserId: setFieldsEnduser2.id,
                            title: 'Metformin 500mg',
                        })];
                case 68:
                    setFieldsMed2 = _e.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 69:
                    _e.sent();
                    return [4 /*yield*/, async_test("Medication Added - Set Fields with title filter copies medication.name", function () { return sdk.api.endusers.getOne(setFieldsEnduser2.id); }, { onResult: function (e) { var _a; return ((_a = e.fields) === null || _a === void 0 ? void 0 : _a['Specific Med']) === 'Metformin 500mg'; } })];
                case 70:
                    _e.sent();
                    _e.label = 71;
                case 71:
                    _e.trys.push([71, , 76, 77]);
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(setFieldsTrigger.id)];
                case 72:
                    _e.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(setFieldsTriggerFiltered.id)];
                case 73:
                    _e.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(setFieldsEnduser.id)];
                case 74:
                    _e.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(setFieldsEnduser2.id)];
                case 75:
                    _e.sent();
                    return [3 /*break*/, 77];
                case 76: return [7 /*endfinally*/];
                case 77: return [2 /*return*/];
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
                    return [4 /*yield*/, medication_added_trigger_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
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