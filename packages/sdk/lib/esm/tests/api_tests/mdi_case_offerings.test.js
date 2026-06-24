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
import { evaluate_conditional_logic, evaluate_string_field_comparison } from "@tellescope/utilities";
var host = process.env.API_URL || 'http://localhost:8080';
// Local replica of the API's resolve_case_offerings (md_integrations.ts), built
// from the same shared @tellescope/utilities helpers it uses, so we can assert
// the resolution behavior from the SDK test harness.
var is_empty_conditions = function (conditions) {
    if (!conditions || !Object.keys(conditions).length)
        return true;
    var condition = conditions.condition;
    if (condition !== undefined)
        return !Object.keys(condition).length;
    return false;
};
var resolve_case_offerings = function (offerings, responses) { return (offerings.filter(function (o) {
    if (!o.conditions || is_empty_conditions(o.conditions))
        return true;
    return evaluate_conditional_logic(o.conditions, function (key, value) { var _a; return evaluate_string_field_comparison((_a = responses.find(function (r) { return r.externalId === key; })) === null || _a === void 0 ? void 0 : _a.value, value); });
})); };
var to_number = function (v) {
    var n = typeof v === 'number' ? v : parseFloat(String(v !== null && v !== void 0 ? v : ''));
    return Number.isFinite(n) ? n : undefined;
};
var enduser_height_to_cm = function (h) {
    var inches = to_number(h === null || h === void 0 ? void 0 : h.value);
    if (inches === undefined)
        return undefined;
    return Math.round(inches * 2.54);
};
var enduser_weight_to_kg = function (w) {
    var lbs = to_number(w === null || w === void 0 ? void 0 : w.value);
    if (lbs === undefined)
        return undefined;
    return Math.round(lbs * 0.45359237 * 100) / 100;
};
var PATIENT_MAPPED_EXTERNAL_IDS = new Set([
    'fname', 'first_name', 'lname', 'last_name',
    'email', 'dateOfBirth', 'gender', 'phone', 'address',
    'height', 'weight',
    'allergies', 'current_medications', 'medical_conditions', 'special_necessities', 'pregnancy',
    'intro_video_id',
]);
// Mirrors the externalId exclusion step in form_response_to_case_questions:
// patient-mapped fields are dropped, everything else survives.
var case_question_external_ids = function (responses) { return (responses
    .filter(function (r) { return !(r.externalId && PATIENT_MAPPED_EXTERNAL_IDS.has(r.externalId)); })
    .map(function (r) { return r.externalId; })
    .filter(function (id) { return id !== undefined; })); };
var resolve_displayed_options = function (response, formFields) {
    var _a, _b;
    if (formFields === void 0) { formFields = []; }
    var field = (formFields.find(function (f) { return f._id.toString() === response.fieldId; })
        || formFields.find(function (f) { return response.externalId && f.externalId === response.externalId; }));
    return ((response.answer.type === 'multiple_choice' || response.answer.type === 'Dropdown')
        && ((_b = (_a = field === null || field === void 0 ? void 0 : field.options) === null || _a === void 0 ? void 0 : _a.choices) === null || _b === void 0 ? void 0 : _b.length)) ? field.options.choices : undefined;
};
export var mdi_case_offerings_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var testFormId, MIXED_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_header("MDI Case Offerings Tests");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 18, 21]);
                    // --- Schema round-trip tests ---
                    return [4 /*yield*/, async_test("Create form with mdiCaseOfferings mixing unconditional and conditional entries", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var offerings, form, fetched;
                            var _a, _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        offerings = [
                                            { offering_id: "offering-always" },
                                            { offering_id: "offering-ca", conditions: { condition: { state: "CA" } } },
                                            {
                                                offering_id: "offering-ca-glp",
                                                conditions: { $and: [{ condition: { state: "CA" } }, { condition: { med_type: "weightLoss" } }] },
                                            },
                                        ];
                                        return [4 /*yield*/, sdk.api.forms.createOne({
                                                title: 'MDI Case Offerings Test Form',
                                                mdiCaseOfferings: offerings,
                                            })];
                                    case 1:
                                        form = _d.sent();
                                        testFormId = form.id;
                                        return [4 /*yield*/, sdk.api.forms.getOne(form.id)];
                                    case 2:
                                        fetched = _d.sent();
                                        return [2 /*return*/, (((_a = fetched.mdiCaseOfferings) === null || _a === void 0 ? void 0 : _a.length) === 3
                                                && fetched.mdiCaseOfferings[0].offering_id === "offering-always"
                                                && fetched.mdiCaseOfferings[0].conditions === undefined
                                                && !!((_b = fetched.mdiCaseOfferings[1].conditions) === null || _b === void 0 ? void 0 : _b.condition)
                                                && !!((_c = fetched.mdiCaseOfferings[2].conditions) === null || _c === void 0 ? void 0 : _c.$and))];
                                }
                            });
                        }); }, { expectedResult: true })];
                case 2:
                    // --- Schema round-trip tests ---
                    _b.sent();
                    return [4 /*yield*/, async_test("Backwards-compat: existing flat { offering_id } config still validates", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var flat, fetched;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!testFormId)
                                            throw new Error("No test form");
                                        flat = [
                                            { offering_id: "legacy-1" },
                                            { offering_id: "legacy-2" },
                                        ];
                                        return [4 /*yield*/, sdk.api.forms.updateOne(testFormId, { mdiCaseOfferings: flat }, { replaceObjectFields: true })];
                                    case 1:
                                        _b.sent();
                                        return [4 /*yield*/, sdk.api.forms.getOne(testFormId)];
                                    case 2:
                                        fetched = _b.sent();
                                        return [2 /*return*/, (((_a = fetched.mdiCaseOfferings) === null || _a === void 0 ? void 0 : _a.length) === 2
                                                && fetched.mdiCaseOfferings.every(function (o) { return o.conditions === undefined; }))];
                                }
                            });
                        }); }, { expectedResult: true })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, async_test("Save nested CompoundFilter conditions on an offering and read back", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var nested, fetched;
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        if (!testFormId)
                                            throw new Error("No test form");
                                        nested = [
                                            {
                                                offering_id: "offering-nested",
                                                conditions: {
                                                    $and: [
                                                        { $or: [{ condition: { state: "CA" } }, { condition: { state: "NY" } }] },
                                                        { condition: { med_type: "weightLoss" } },
                                                    ],
                                                },
                                            },
                                        ];
                                        return [4 /*yield*/, sdk.api.forms.updateOne(testFormId, { mdiCaseOfferings: nested }, { replaceObjectFields: true })];
                                    case 1:
                                        _c.sent();
                                        return [4 /*yield*/, sdk.api.forms.getOne(testFormId)];
                                    case 2:
                                        fetched = _c.sent();
                                        return [2 /*return*/, (((_a = fetched.mdiCaseOfferings) === null || _a === void 0 ? void 0 : _a.length) === 1
                                                && !!((_b = fetched.mdiCaseOfferings[0].conditions) === null || _b === void 0 ? void 0 : _b.$and))];
                                }
                            });
                        }); }, { expectedResult: true })
                        // --- resolve_case_offerings behavior tests ---
                    ];
                case 4:
                    _b.sent();
                    MIXED_1 = [
                        { offering_id: "always" },
                        { offering_id: "ca-only", conditions: { condition: { state: "CA" } } },
                        { offering_id: "ny-only", conditions: { condition: { state: "NY" } } },
                    ];
                    return [4 /*yield*/, async_test("Resolver returns exactly the matching subset plus unconditional offerings", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var resolved;
                            return __generator(this, function (_a) {
                                resolved = resolve_case_offerings(MIXED_1, [{ externalId: "state", value: "CA" }]);
                                return [2 /*return*/, (resolved.length === 2
                                        && resolved.some(function (o) { return o.offering_id === "always"; })
                                        && resolved.some(function (o) { return o.offering_id === "ca-only"; })
                                        && !resolved.some(function (o) { return o.offering_id === "ny-only"; }))];
                            });
                        }); }, { expectedResult: true })];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, async_test("Send none: when conditions match nothing, only unconditional offerings remain", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var allConditional, resolved;
                            return __generator(this, function (_a) {
                                allConditional = [
                                    { offering_id: "ca-only", conditions: { condition: { state: "CA" } } },
                                    { offering_id: "ny-only", conditions: { condition: { state: "NY" } } },
                                ];
                                resolved = resolve_case_offerings(allConditional, [{ externalId: "state", value: "TX" }]);
                                return [2 /*return*/, resolved.length === 0];
                            });
                        }); }, { expectedResult: true })];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, async_test("Backwards compat: all-unconditional config sends everything", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var allUnconditional, resolved;
                            return __generator(this, function (_a) {
                                allUnconditional = [
                                    { offering_id: "a" },
                                    { offering_id: "b" },
                                    { offering_id: "c" },
                                ];
                                resolved = resolve_case_offerings(allUnconditional, [{ externalId: "state", value: "TX" }]);
                                return [2 /*return*/, resolved.length === 3];
                            });
                        }); }, { expectedResult: true })];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, async_test("Empty/blank conditions object is treated as unconditional (always sent)", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var withBlank, resolved;
                            return __generator(this, function (_a) {
                                withBlank = [
                                    { offering_id: "blank", conditions: { condition: {} } },
                                ];
                                resolved = resolve_case_offerings(withBlank, []);
                                return [2 /*return*/, resolved.length === 1 && resolved[0].offering_id === "blank"];
                            });
                        }); }, { expectedResult: true })];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, async_test("$or conditions: offering sent when any branch matches", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var offerings, resolved;
                            return __generator(this, function (_a) {
                                offerings = [
                                    { offering_id: "ca-or-ny", conditions: { $or: [{ condition: { state: "CA" } }, { condition: { state: "NY" } }] } },
                                ];
                                resolved = resolve_case_offerings(offerings, [{ externalId: "state", value: "NY" }]);
                                return [2 /*return*/, resolved.length === 1];
                            });
                        }); }, { expectedResult: true })];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, async_test("$contains operator narrows offerings by substring match", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var offerings, matches, misses;
                            return __generator(this, function (_a) {
                                offerings = [
                                    { offering_id: "glp", conditions: { condition: { meds: { $contains: "GLP" } } } },
                                ];
                                matches = resolve_case_offerings(offerings, [{ externalId: "meds", value: "GLP-1 agonist" }]);
                                misses = resolve_case_offerings(offerings, [{ externalId: "meds", value: "Semaglutide" }]);
                                return [2 /*return*/, matches.length === 1 && misses.length === 0];
                            });
                        }); }, { expectedResult: true })
                        // --- height/weight conversion tests ---
                    ];
                case 10:
                    _b.sent();
                    // --- height/weight conversion tests ---
                    return [4 /*yield*/, async_test("enduser_height_to_cm converts Inches → integer centimeters", function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, (enduser_height_to_cm({ value: 70, unit: 'Inches' }) === 178
                                        && enduser_height_to_cm({ value: '70', unit: 'Inches' }) === 178 // string value parsed
                                        && enduser_height_to_cm(undefined) === undefined // absent → omitted
                                        && enduser_height_to_cm({ value: '', unit: 'Inches' }) === undefined)];
                            });
                        }); }, { expectedResult: true })];
                case 11:
                    // --- height/weight conversion tests ---
                    _b.sent();
                    return [4 /*yield*/, async_test("enduser_weight_to_kg converts Pounds → kilograms (float, 2dp)", function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, (enduser_weight_to_kg({ value: 200, unit: 'Pounds' }) === 90.72
                                        && enduser_weight_to_kg({ value: '200', unit: 'Pounds' }) === 90.72 // string value parsed
                                        && enduser_weight_to_kg(undefined) === undefined // absent → omitted
                                        && enduser_weight_to_kg({ value: 'not-a-number', unit: 'Pounds' }) === undefined)];
                            });
                        }); }, { expectedResult: true })
                        // --- case_questions exclusion tests ---
                    ];
                case 12:
                    _b.sent();
                    // --- case_questions exclusion tests ---
                    return [4 /*yield*/, async_test("case_questions exclude patient-mapped fields but keep non-mapped clinical answers", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var responses, kept, excluded;
                            return __generator(this, function (_a) {
                                responses = [
                                    { externalId: 'fname' },
                                    { externalId: 'email' },
                                    { externalId: 'dateOfBirth' },
                                    { externalId: 'gender' },
                                    { externalId: 'phone' },
                                    { externalId: 'address' },
                                    { externalId: 'height' },
                                    { externalId: 'weight' },
                                    { externalId: 'allergies' },
                                    { externalId: 'special_necessities' },
                                    { externalId: 'symptoms' },
                                    { externalId: 'duration' }, // non-mapped clinical field → survives
                                ];
                                kept = case_question_external_ids(responses);
                                excluded = ['fname', 'email', 'dateOfBirth', 'gender', 'phone', 'address', 'height', 'weight', 'allergies', 'special_necessities'];
                                return [2 /*return*/, (kept.length === 2
                                        && kept.includes('symptoms')
                                        && kept.includes('duration')
                                        && excluded.every(function (id) { return !kept.includes(id); }))];
                            });
                        }); }, { expectedResult: true })
                        // --- displayed_options tests ---
                    ];
                case 13:
                    // --- case_questions exclusion tests ---
                    _b.sent();
                    // --- displayed_options tests ---
                    return [4 /*yield*/, async_test("multiple_choice response + matching field by _id → displayed_options equals field choices", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var fields, response, opts;
                            return __generator(this, function (_a) {
                                fields = [
                                    { _id: 'field-1', options: { choices: ['Yes', 'No', 'Maybe'] } },
                                ];
                                response = { fieldId: 'field-1', answer: { type: 'multiple_choice' } };
                                opts = resolve_displayed_options(response, fields);
                                return [2 /*return*/, (!!opts
                                        && opts.length === 3
                                        && opts[0] === 'Yes' && opts[1] === 'No' && opts[2] === 'Maybe')];
                            });
                        }); }, { expectedResult: true })];
                case 14:
                    // --- displayed_options tests ---
                    _b.sent();
                    return [4 /*yield*/, async_test("Dropdown response + matching field by externalId → displayed_options equals field choices", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var fields, response, opts;
                            return __generator(this, function (_a) {
                                fields = [
                                    { _id: 'field-2', externalId: 'state', options: { choices: ['CA', 'NY', 'TX'] } },
                                ];
                                response = { fieldId: '', externalId: 'state', answer: { type: 'Dropdown' } };
                                opts = resolve_displayed_options(response, fields);
                                return [2 /*return*/, !!opts && opts.length === 3 && opts.join(',') === 'CA,NY,TX'];
                            });
                        }); }, { expectedResult: true })];
                case 15:
                    _b.sent();
                    return [4 /*yield*/, async_test("string/number response → displayed_options undefined even with field choices present", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var fields, stringResponse, numberResponse;
                            return __generator(this, function (_a) {
                                fields = [
                                    { _id: 'field-3', options: { choices: ['Yes', 'No'] } },
                                ];
                                stringResponse = { fieldId: 'field-3', answer: { type: 'string' } };
                                numberResponse = { fieldId: 'field-3', answer: { type: 'number' } };
                                return [2 /*return*/, (resolve_displayed_options(stringResponse, fields) === undefined
                                        && resolve_displayed_options(numberResponse, fields) === undefined)];
                            });
                        }); }, { expectedResult: true })];
                case 16:
                    _b.sent();
                    return [4 /*yield*/, async_test("multiple_choice response with no matching field → displayed_options undefined (question still kept)", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var fields, noMatch, emptyChoices, fieldsEmpty;
                            return __generator(this, function (_a) {
                                fields = [
                                    { _id: 'field-4', externalId: 'other', options: { choices: ['A', 'B'] } },
                                ];
                                noMatch = { fieldId: 'field-unknown', externalId: 'unknown', answer: { type: 'multiple_choice' } };
                                emptyChoices = { fieldId: 'field-5', answer: { type: 'multiple_choice' } };
                                fieldsEmpty = [{ _id: 'field-5', options: { choices: [] } }];
                                return [2 /*return*/, (resolve_displayed_options(noMatch, fields) === undefined
                                        && resolve_displayed_options(emptyChoices, fieldsEmpty) === undefined)];
                            });
                        }); }, { expectedResult: true })];
                case 17:
                    _b.sent();
                    return [3 /*break*/, 21];
                case 18:
                    if (!testFormId) return [3 /*break*/, 20];
                    return [4 /*yield*/, sdk.api.forms.deleteOne(testFormId).catch(console.error)];
                case 19:
                    _b.sent();
                    _b.label = 20;
                case 20: return [7 /*endfinally*/];
                case 21: return [2 /*return*/];
            }
        });
    });
};
if (require.main === module) {
    console.log("Using API URL: ".concat(host));
    var sdk_1 = new Session({ host: host });
    var sdkNonAdmin_1 = new Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setup_tests(sdk_1, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, mdi_case_offerings_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("MDI case offerings test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("MDI case offerings test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=mdi_case_offerings.test.js.map