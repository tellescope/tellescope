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
exports.beluga_pharmacy_mappings_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var utilities_1 = require("@tellescope/utilities");
var host = process.env.API_URL || 'http://localhost:8080';
// Helper mimicking resolve_beluga_pharmacy_mapping evaluator
var evaluate_mapping_conditions = function (conditions, responses) { return (0, utilities_1.evaluate_conditional_logic)(conditions, function (key, value) {
    var _a;
    var responseValue = (_a = responses.find(function (r) { return r.externalId === key; })) === null || _a === void 0 ? void 0 : _a.value;
    if (typeof value === 'string') {
        return responseValue === value;
    }
    if (typeof value === 'object' && value !== null) {
        var operator = Object.keys(value)[0];
        var operand = Object.values(value)[0];
        if (operator === '$contains') {
            return typeof responseValue === 'string' && responseValue.includes(String(operand));
        }
        if (operator === '$doesNotContain') {
            return typeof responseValue === 'string' && !responseValue.includes(String(operand));
        }
        if (operator === '$exists') {
            return operand ? responseValue !== undefined : responseValue === undefined;
        }
        if (operator === '$ne') {
            return responseValue !== String(operand);
        }
    }
    return false;
}); };
// Helper to resolve first matching mapping
var resolve_mapping = function (mappings, responses) {
    for (var _i = 0, mappings_1 = mappings; _i < mappings_1.length; _i++) {
        var mapping = mappings_1[_i];
        if (!mapping.conditions)
            continue;
        if (evaluate_mapping_conditions(mapping.conditions, responses)) {
            return mapping;
        }
    }
    return undefined;
};
var beluga_pharmacy_mappings_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var testFormId;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("Beluga Pharmacy Mappings Tests");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 18, 21]);
                    return [4 /*yield*/, (0, testing_1.async_test)("Create form with belugaPharmacyMappings", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var mappings, form, fetched;
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        mappings = [
                                            {
                                                pharmacyId: "pharmacy-001",
                                                patientPreference: JSON.stringify([{ name: "Med A", strength: "10mg", quantity: "30", refills: "3", daysSupply: "30", sig: "Take once daily", dispenseUnit: "Tablet", medId: "med-001" }]),
                                                conditions: { $and: [{ condition: { "state": "CA" } }, { condition: { "med_type": "weightLoss" } }] },
                                            },
                                        ];
                                        return [4 /*yield*/, sdk.api.forms.createOne({
                                                title: 'Beluga Pharmacy Mappings Test Form',
                                                belugaPharmacyMappings: mappings,
                                            })];
                                    case 1:
                                        form = _c.sent();
                                        testFormId = form.id;
                                        return [4 /*yield*/, sdk.api.forms.getOne(form.id)];
                                    case 2:
                                        fetched = _c.sent();
                                        return [2 /*return*/, (((_a = fetched.belugaPharmacyMappings) === null || _a === void 0 ? void 0 : _a.length) === 1
                                                && fetched.belugaPharmacyMappings[0].pharmacyId === "pharmacy-001"
                                                && !!((_b = fetched.belugaPharmacyMappings[0].conditions) === null || _b === void 0 ? void 0 : _b.$and))];
                                }
                            });
                        }); }, { expectedResult: true })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Update belugaPharmacyMappings on existing form", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var updatedMappings, fetched;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!testFormId)
                                            throw new Error("No test form");
                                        updatedMappings = [
                                            {
                                                pharmacyId: "pharmacy-002",
                                                patientPreference: JSON.stringify([{ name: "Med B", strength: "20mg", quantity: "60", refills: "2", daysSupply: "30", sig: "Take twice daily", dispenseUnit: "Capsule", medId: "med-002" }]),
                                                conditions: { condition: { "state": "NY" } },
                                            },
                                            {
                                                pharmacyId: "pharmacy-003",
                                                patientPreference: "[]",
                                                conditions: { $or: [{ condition: { "state": "TX" } }, { condition: { "state": "FL" } }] },
                                            },
                                        ];
                                        return [4 /*yield*/, sdk.api.forms.updateOne(testFormId, { belugaPharmacyMappings: updatedMappings }, { replaceObjectFields: true })];
                                    case 1:
                                        _b.sent();
                                        return [4 /*yield*/, sdk.api.forms.getOne(testFormId)];
                                    case 2:
                                        fetched = _b.sent();
                                        return [2 /*return*/, (((_a = fetched.belugaPharmacyMappings) === null || _a === void 0 ? void 0 : _a.length) === 2
                                                && fetched.belugaPharmacyMappings[0].pharmacyId === "pharmacy-002"
                                                && fetched.belugaPharmacyMappings[1].pharmacyId === "pharmacy-003")];
                                }
                            });
                        }); }, { expectedResult: true })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Save with nested CompoundFilter structure", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var nestedMappings, fetched;
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        if (!testFormId)
                                            throw new Error("No test form");
                                        nestedMappings = [
                                            {
                                                pharmacyId: "pharmacy-nested",
                                                patientPreference: "[]",
                                                conditions: {
                                                    $and: [
                                                        { $or: [{ condition: { "state": "CA" } }, { condition: { "state": "NY" } }] },
                                                        { condition: { "med_type": "weightLoss" } },
                                                    ]
                                                },
                                            },
                                        ];
                                        return [4 /*yield*/, sdk.api.forms.updateOne(testFormId, { belugaPharmacyMappings: nestedMappings }, { replaceObjectFields: true })];
                                    case 1:
                                        _c.sent();
                                        return [4 /*yield*/, sdk.api.forms.getOne(testFormId)];
                                    case 2:
                                        fetched = _c.sent();
                                        return [2 /*return*/, (((_a = fetched.belugaPharmacyMappings) === null || _a === void 0 ? void 0 : _a.length) === 1
                                                && fetched.belugaPharmacyMappings[0].pharmacyId === "pharmacy-nested"
                                                && !!((_b = fetched.belugaPharmacyMappings[0].conditions) === null || _b === void 0 ? void 0 : _b.$and))];
                                }
                            });
                        }); }, { expectedResult: true })
                        // --- 6b. Conditional logic evaluation tests ---
                    ];
                case 4:
                    _b.sent();
                    // --- 6b. Conditional logic evaluation tests ---
                    return [4 /*yield*/, (0, testing_1.async_test)("Simple equality: condition matches response", function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, evaluate_mapping_conditions({ condition: { "state": "CA" } }, [{ externalId: "state", value: "CA" }])];
                            });
                        }); }, { expectedResult: true })];
                case 5:
                    // --- 6b. Conditional logic evaluation tests ---
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Simple equality miss: condition does not match response", function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, evaluate_mapping_conditions({ condition: { "state": "CA" } }, [{ externalId: "state", value: "NY" }])];
                            });
                        }); }, { expectedResult: false })];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("$and: two conditions, both match", function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, evaluate_mapping_conditions({ $and: [{ condition: { "state": "CA" } }, { condition: { "med_type": "weightLoss" } }] }, [{ externalId: "state", value: "CA" }, { externalId: "med_type", value: "weightLoss" }])];
                            });
                        }); }, { expectedResult: true })];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("$and: two conditions, one misses", function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, evaluate_mapping_conditions({ $and: [{ condition: { "state": "CA" } }, { condition: { "med_type": "weightLoss" } }] }, [{ externalId: "state", value: "CA" }, { externalId: "med_type", value: "skincare" }])];
                            });
                        }); }, { expectedResult: false })];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("$or: two conditions, one matches", function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, evaluate_mapping_conditions({ $or: [{ condition: { "state": "CA" } }, { condition: { "state": "NY" } }] }, [{ externalId: "state", value: "NY" }])];
                            });
                        }); }, { expectedResult: true })];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("$or: two conditions, neither matches", function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, evaluate_mapping_conditions({ $or: [{ condition: { "state": "CA" } }, { condition: { "state": "NY" } }] }, [{ externalId: "state", value: "TX" }])];
                            });
                        }); }, { expectedResult: false })];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("$contains: value includes substring", function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, evaluate_mapping_conditions({ condition: { "meds": { $contains: "GLP" } } }, [{ externalId: "meds", value: "GLP-1 agonist" }])];
                            });
                        }); }, { expectedResult: true })];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("$ne: value does not equal", function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, evaluate_mapping_conditions({ condition: { "state": { $ne: "CA" } } }, [{ externalId: "state", value: "NY" }])];
                            });
                        }); }, { expectedResult: true })];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("$exists: field present", function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, evaluate_mapping_conditions({ condition: { "pharmacyOverride": { $exists: true } } }, [{ externalId: "pharmacyOverride", value: "some-value" }])];
                            });
                        }); }, { expectedResult: true })];
                case 13:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("$exists: field absent", function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, evaluate_mapping_conditions({ condition: { "pharmacyOverride": { $exists: true } } }, [{ externalId: "other_field", value: "some-value" }])];
                            });
                        }); }, { expectedResult: false })];
                case 14:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Nested compound: $and with $or", function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, evaluate_mapping_conditions({
                                        $and: [
                                            { $or: [{ condition: { "state": "CA" } }, { condition: { "state": "NY" } }] },
                                            { condition: { "med_type": "weightLoss" } },
                                        ]
                                    }, [{ externalId: "state", value: "NY" }, { externalId: "med_type", value: "weightLoss" }])];
                            });
                        }); }, { expectedResult: true })];
                case 15:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("First-match-wins: multiple mappings, first matching returned", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var mappings, result;
                            return __generator(this, function (_a) {
                                mappings = [
                                    {
                                        pharmacyId: "pharmacy-first",
                                        patientPreference: "[]",
                                        conditions: { condition: { "state": "CA" } },
                                    },
                                    {
                                        pharmacyId: "pharmacy-second",
                                        patientPreference: "[]",
                                        conditions: { condition: { "state": "CA" } },
                                    },
                                ];
                                result = resolve_mapping(mappings, [{ externalId: "state", value: "CA" }]);
                                return [2 /*return*/, (result === null || result === void 0 ? void 0 : result.pharmacyId) === "pharmacy-first"];
                            });
                        }); }, { expectedResult: true })];
                case 16:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("No match: no mappings match, returns undefined", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var mappings, result;
                            return __generator(this, function (_a) {
                                mappings = [
                                    {
                                        pharmacyId: "pharmacy-ca",
                                        patientPreference: "[]",
                                        conditions: { condition: { "state": "CA" } },
                                    },
                                ];
                                result = resolve_mapping(mappings, [{ externalId: "state", value: "TX" }]);
                                return [2 /*return*/, result === undefined];
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
exports.beluga_pharmacy_mappings_tests = beluga_pharmacy_mappings_tests;
if (require.main === module) {
    console.log("Using API URL: ".concat(host));
    var sdk_2 = new sdk_1.Session({ host: host });
    var sdkNonAdmin_1 = new sdk_1.Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, setup_1.setup_tests)(sdk_2, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, exports.beluga_pharmacy_mappings_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("Beluga pharmacy mappings test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("Beluga pharmacy mappings test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=beluga_pharmacy_mappings.test.js.map