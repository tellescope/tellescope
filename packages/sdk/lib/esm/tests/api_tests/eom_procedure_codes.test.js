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
import { async_test, log_header } from "@tellescope/testing";
import { setup_tests } from "../setup";
var host = process.env.API_URL || 'http://localhost:8080';
var sampleProcedureCodes = [
    {
        code: 'G0019',
        units: 1,
        feeCents: 12000,
        modifiers: ['25'],
    },
    {
        code: 'G0022',
        units: 0,
    },
];
var sampleDiagnosisCodes = [
    { code: 'Z71.3', description: 'Dietary counseling and surveillance' },
];
export var eom_procedure_codes_tests = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var enduser, createdFormIds, createdFormResponseIds, baseForm, formResponse_1, formWithCodes_1, preparedFromFormResponseId_1, overrideProcedureCodes_1, overrideDiagnosisCodes_1, overridePreparedResponseId_1, formWithoutCodes_1, _i, createdFormResponseIds_1, id, _b, createdFormIds_1, id;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    log_header("EOM FormResponse Procedure Codes Tests");
                    return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'EOM', lname: 'Test' })];
                case 1:
                    enduser = _c.sent();
                    createdFormIds = [];
                    createdFormResponseIds = [];
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, , 25, 35]);
                    return [4 /*yield*/, sdk.api.forms.createOne({ title: 'EOM Procedure Codes Base Form' })];
                case 3:
                    baseForm = _c.sent();
                    createdFormIds.push(baseForm.id);
                    return [4 /*yield*/, sdk.api.form_responses.prepare_form_response({
                            formId: baseForm.id,
                            enduserId: enduser.id,
                        })];
                case 4:
                    formResponse_1 = (_c.sent()).response;
                    createdFormResponseIds.push(formResponse_1.id);
                    // ---------- FormResponse-level field tests (existing behavior) ----------
                    return [4 /*yield*/, async_test('updateOne accepts procedureCodes and diagnosisCodes on FormResponse', function () { return sdk.api.form_responses.updateOne(formResponse_1.id, {
                            procedureCodes: sampleProcedureCodes,
                            diagnosisCodes: sampleDiagnosisCodes,
                        }); }, { onResult: function (r) { return !!r && Array.isArray(r.procedureCodes) && r.procedureCodes.length === 2 && Array.isArray(r.diagnosisCodes) && r.diagnosisCodes.length === 1; } })];
                case 5:
                    // ---------- FormResponse-level field tests (existing behavior) ----------
                    _c.sent();
                    return [4 /*yield*/, async_test('getOne returns persisted procedureCodes/diagnosisCodes', function () { return sdk.api.form_responses.getOne(formResponse_1.id); }, { onResult: function (r) {
                                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                                return (((_b = (_a = r.procedureCodes) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.code) === 'G0019'
                                    && ((_d = (_c = r.procedureCodes) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.units) === 1
                                    && ((_f = (_e = r.procedureCodes) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.feeCents) === 12000
                                    && ((_h = (_g = r.procedureCodes) === null || _g === void 0 ? void 0 : _g[1]) === null || _h === void 0 ? void 0 : _h.code) === 'G0022'
                                    && ((_k = (_j = r.procedureCodes) === null || _j === void 0 ? void 0 : _j[1]) === null || _k === void 0 ? void 0 : _k.units) === 0
                                    && ((_m = (_l = r.diagnosisCodes) === null || _l === void 0 ? void 0 : _l[0]) === null || _m === void 0 ? void 0 : _m.code) === 'Z71.3');
                            } })];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, async_test('updateOne rejects FormResponse procedureCode with non-string code', function () { return sdk.api.form_responses.updateOne(formResponse_1.id, {
                            procedureCodes: [{ code: 12345, units: 1 }],
                        }); }, { shouldError: true, onError: function () { return true; } })];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, async_test('updateOne rejects FormResponse procedureCode with negative units', function () { return sdk.api.form_responses.updateOne(formResponse_1.id, {
                            procedureCodes: [{ code: 'G0019', units: -1 }],
                        }); }, { shouldError: true, onError: function () { return true; } })];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, async_test('updateOne rejects FormResponse diagnosisCode with non-string code', function () { return sdk.api.form_responses.updateOne(formResponse_1.id, {
                            diagnosisCodes: [{ code: 12345 }],
                        }); }, { shouldError: true, onError: function () { return true; } })];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, async_test('updateOne can clear procedureCodes/diagnosisCodes with empty arrays via replaceObjectFields', function () { return sdk.api.form_responses.updateOne(formResponse_1.id, {
                            procedureCodes: [],
                            diagnosisCodes: [],
                        }, { replaceObjectFields: true }); }, { onResult: function (r) { return (Array.isArray(r.procedureCodes) && r.procedureCodes.length === 0
                                && Array.isArray(r.diagnosisCodes) && r.diagnosisCodes.length === 0); } })
                        // ---------- Form-level field validators ----------
                    ];
                case 10:
                    _c.sent();
                    // ---------- Form-level field validators ----------
                    return [4 /*yield*/, async_test('forms.createOne accepts valid procedureCodes/diagnosisCodes', function () { return sdk.api.forms.createOne({
                            title: 'EOM Procedure Codes Form (valid codes)',
                            procedureCodes: sampleProcedureCodes,
                            diagnosisCodes: sampleDiagnosisCodes,
                        }); }, { onResult: function (f) {
                                var _a, _b, _c, _d, _e;
                                createdFormIds.push(f.id);
                                return ((_a = f.procedureCodes) === null || _a === void 0 ? void 0 : _a.length) === 2
                                    && ((_c = (_b = f.procedureCodes) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.code) === 'G0019'
                                    && ((_e = (_d = f.diagnosisCodes) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.code) === 'Z71.3';
                            } })];
                case 11:
                    // ---------- Form-level field validators ----------
                    _c.sent();
                    return [4 /*yield*/, async_test('forms.createOne rejects procedureCode with non-string code', function () { return sdk.api.forms.createOne({
                            title: 'EOM Bad Form',
                            procedureCodes: [{ code: 12345, units: 1 }],
                        }); }, { shouldError: true, onError: function () { return true; } })];
                case 12:
                    _c.sent();
                    return [4 /*yield*/, async_test('forms.createOne rejects procedureCode with negative units', function () { return sdk.api.forms.createOne({
                            title: 'EOM Bad Form',
                            procedureCodes: [{ code: 'G0019', units: -1 }],
                        }); }, { shouldError: true, onError: function () { return true; } })];
                case 13:
                    _c.sent();
                    return [4 /*yield*/, async_test('forms.createOne rejects diagnosisCode with non-string code', function () { return sdk.api.forms.createOne({
                            title: 'EOM Bad Form',
                            diagnosisCodes: [{ code: 12345 }],
                        }); }, { shouldError: true, onError: function () { return true; } })
                        // ---------- prepare_form_response copy-on-prepare from Form ----------
                    ];
                case 14:
                    _c.sent();
                    return [4 /*yield*/, sdk.api.forms.createOne({
                            title: 'EOM Procedure Codes Form (with codes)',
                            procedureCodes: sampleProcedureCodes,
                            diagnosisCodes: sampleDiagnosisCodes,
                        })];
                case 15:
                    formWithCodes_1 = _c.sent();
                    createdFormIds.push(formWithCodes_1.id);
                    preparedFromFormResponseId_1 = '';
                    return [4 /*yield*/, async_test('prepare_form_response copies procedureCodes/diagnosisCodes from Form when no args', function () { return sdk.api.form_responses.prepare_form_response({
                            formId: formWithCodes_1.id,
                            enduserId: enduser.id,
                        }); }, { onResult: function (r) {
                                var _a, _b, _c, _d, _e;
                                preparedFromFormResponseId_1 = r.response.id;
                                createdFormResponseIds.push(r.response.id);
                                return ((_a = r.response.procedureCodes) === null || _a === void 0 ? void 0 : _a.length) === 2
                                    && ((_c = (_b = r.response.procedureCodes) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.code) === 'G0019'
                                    && ((_e = (_d = r.response.diagnosisCodes) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.code) === 'Z71.3';
                            } })];
                case 16:
                    _c.sent();
                    return [4 /*yield*/, async_test('persisted FormResponse retains Form codes after prepare', function () { return sdk.api.form_responses.getOne(preparedFromFormResponseId_1); }, { onResult: function (r) {
                                var _a, _b, _c, _d, _e;
                                return (((_a = r.procedureCodes) === null || _a === void 0 ? void 0 : _a.length) === 2
                                    && ((_c = (_b = r.procedureCodes) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.code) === 'G0019'
                                    && ((_e = (_d = r.diagnosisCodes) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.code) === 'Z71.3');
                            } })
                        // ---------- prepare args override Form defaults ----------
                    ];
                case 17:
                    _c.sent();
                    overrideProcedureCodes_1 = [{ code: '99213', units: 1 }];
                    overrideDiagnosisCodes_1 = [{ code: 'E11.9', description: 'Type 2 diabetes' }];
                    overridePreparedResponseId_1 = '';
                    return [4 /*yield*/, async_test('prepare_form_response args override Form defaults', function () { return sdk.api.form_responses.prepare_form_response({
                            formId: formWithCodes_1.id,
                            enduserId: enduser.id,
                            procedureCodes: overrideProcedureCodes_1,
                            diagnosisCodes: overrideDiagnosisCodes_1,
                        }); }, { onResult: function (r) {
                                var _a, _b, _c, _d, _e, _f;
                                overridePreparedResponseId_1 = r.response.id;
                                createdFormResponseIds.push(r.response.id);
                                return ((_a = r.response.procedureCodes) === null || _a === void 0 ? void 0 : _a.length) === 1
                                    && ((_c = (_b = r.response.procedureCodes) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.code) === '99213'
                                    && ((_d = r.response.diagnosisCodes) === null || _d === void 0 ? void 0 : _d.length) === 1
                                    && ((_f = (_e = r.response.diagnosisCodes) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.code) === 'E11.9';
                            } })];
                case 18:
                    _c.sent();
                    return [4 /*yield*/, async_test('persisted overridden FormResponse retains override codes', function () { return sdk.api.form_responses.getOne(overridePreparedResponseId_1); }, { onResult: function (r) {
                                var _a, _b, _c, _d;
                                return (((_b = (_a = r.procedureCodes) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.code) === '99213'
                                    && ((_d = (_c = r.diagnosisCodes) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.code) === 'E11.9');
                            } })
                        // ---------- prepare with no Form defaults ----------
                    ];
                case 19:
                    _c.sent();
                    return [4 /*yield*/, sdk.api.forms.createOne({
                            title: 'EOM Procedure Codes Form (no codes)',
                        })];
                case 20:
                    formWithoutCodes_1 = _c.sent();
                    createdFormIds.push(formWithoutCodes_1.id);
                    return [4 /*yield*/, async_test('prepare_form_response with args on a Form lacking codes uses the args', function () { return sdk.api.form_responses.prepare_form_response({
                            formId: formWithoutCodes_1.id,
                            enduserId: enduser.id,
                            procedureCodes: overrideProcedureCodes_1,
                            diagnosisCodes: overrideDiagnosisCodes_1,
                        }); }, { onResult: function (r) {
                                var _a, _b, _c, _d;
                                createdFormResponseIds.push(r.response.id);
                                return ((_b = (_a = r.response.procedureCodes) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.code) === '99213'
                                    && ((_d = (_c = r.response.diagnosisCodes) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.code) === 'E11.9';
                            } })
                        // ---------- prepare with no defaults and no args yields no codes ----------
                    ];
                case 21:
                    _c.sent();
                    // ---------- prepare with no defaults and no args yields no codes ----------
                    return [4 /*yield*/, async_test('prepare_form_response with no codes anywhere produces FormResponse without codes', function () { return sdk.api.form_responses.prepare_form_response({
                            formId: formWithoutCodes_1.id,
                            enduserId: enduser.id,
                        }); }, { onResult: function (r) {
                                createdFormResponseIds.push(r.response.id);
                                return !r.response.procedureCodes && !r.response.diagnosisCodes;
                            } })
                        // ---------- prepare rejects bad code shapes ----------
                    ];
                case 22:
                    // ---------- prepare with no defaults and no args yields no codes ----------
                    _c.sent();
                    // ---------- prepare rejects bad code shapes ----------
                    return [4 /*yield*/, async_test('prepare_form_response rejects procedureCode with non-string code', function () { return sdk.api.form_responses.prepare_form_response({
                            formId: formWithoutCodes_1.id,
                            enduserId: enduser.id,
                            procedureCodes: [{ code: 12345, units: 1 }],
                        }); }, { shouldError: true, onError: function () { return true; } })];
                case 23:
                    // ---------- prepare rejects bad code shapes ----------
                    _c.sent();
                    return [4 /*yield*/, async_test('prepare_form_response rejects procedureCode with negative units', function () { return sdk.api.form_responses.prepare_form_response({
                            formId: formWithoutCodes_1.id,
                            enduserId: enduser.id,
                            procedureCodes: [{ code: 'G0019', units: -1 }],
                        }); }, { shouldError: true, onError: function () { return true; } })];
                case 24:
                    _c.sent();
                    return [3 /*break*/, 35];
                case 25:
                    _i = 0, createdFormResponseIds_1 = createdFormResponseIds;
                    _c.label = 26;
                case 26:
                    if (!(_i < createdFormResponseIds_1.length)) return [3 /*break*/, 29];
                    id = createdFormResponseIds_1[_i];
                    return [4 /*yield*/, sdk.api.form_responses.deleteOne(id).catch(function () { })];
                case 27:
                    _c.sent();
                    _c.label = 28;
                case 28:
                    _i++;
                    return [3 /*break*/, 26];
                case 29:
                    _b = 0, createdFormIds_1 = createdFormIds;
                    _c.label = 30;
                case 30:
                    if (!(_b < createdFormIds_1.length)) return [3 /*break*/, 33];
                    id = createdFormIds_1[_b];
                    return [4 /*yield*/, sdk.api.forms.deleteOne(id).catch(function () { })];
                case 31:
                    _c.sent();
                    _c.label = 32;
                case 32:
                    _b++;
                    return [3 /*break*/, 30];
                case 33: return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id).catch(function () { })];
                case 34:
                    _c.sent();
                    return [7 /*endfinally*/];
                case 35: return [2 /*return*/];
            }
        });
    });
};
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
                    return [4 /*yield*/, eom_procedure_codes_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ EOM procedure codes test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ EOM procedure codes test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=eom_procedure_codes.test.js.map