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
exports.eom_billing_codes_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var constants_1 = require("@tellescope/constants");
var setup_1 = require("../setup");
var host = process.env.API_URL || 'http://localhost:8080';
var eom_billing_codes_tests = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var enduser, formResponse;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("EOM FormResponse Billing Codes Tests");
                    return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'EOM', lname: 'Test' })];
                case 1:
                    enduser = _b.sent();
                    return [4 /*yield*/, sdk.api.form_responses.createOne({
                            formId: constants_1.PLACEHOLDER_ID,
                            enduserId: enduser.id,
                            formTitle: 'EOM Test Form',
                            responses: [],
                        })];
                case 2:
                    formResponse = _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('updateOne accepts billingCodes and diagnosisCodes', function () { return sdk.api.form_responses.updateOne(formResponse.id, {
                            billingCodes: [
                                {
                                    code: 'G0019',
                                    quantity: 1,
                                    totalMinutes: 70,
                                    serviceDateFrom: '2026-04-01',
                                    serviceDateTo: '2026-04-30',
                                    units: 'UN',
                                    fee: 12000,
                                    modifiers: ['25'],
                                },
                                {
                                    code: 'G0022',
                                    quantity: 0,
                                    totalMinutes: 70,
                                },
                            ],
                            diagnosisCodes: [
                                { code: 'Z71.3', description: 'Dietary counseling and surveillance' },
                            ],
                        }); }, { onResult: function (r) { return !!r && Array.isArray(r.billingCodes) && r.billingCodes.length === 2 && Array.isArray(r.diagnosisCodes) && r.diagnosisCodes.length === 1; } })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('getOne returns persisted billingCodes/diagnosisCodes', function () { return sdk.api.form_responses.getOne(formResponse.id); }, { onResult: function (r) {
                                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                                return (((_b = (_a = r.billingCodes) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.code) === 'G0019'
                                    && ((_d = (_c = r.billingCodes) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.quantity) === 1
                                    && ((_f = (_e = r.billingCodes) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.totalMinutes) === 70
                                    && ((_h = (_g = r.billingCodes) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.units) === 'UN'
                                    && ((_k = (_j = r.billingCodes) === null || _j === void 0 ? void 0 : _j[1]) === null || _k === void 0 ? void 0 : _k.code) === 'G0022'
                                    && ((_m = (_l = r.billingCodes) === null || _l === void 0 ? void 0 : _l[1]) === null || _m === void 0 ? void 0 : _m.quantity) === 0
                                    && ((_p = (_o = r.diagnosisCodes) === null || _o === void 0 ? void 0 : _o[0]) === null || _p === void 0 ? void 0 : _p.code) === 'Z71.3');
                            } })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('updateOne rejects billingCode with non-string code', function () { return sdk.api.form_responses.updateOne(formResponse.id, {
                            billingCodes: [{ code: 12345, quantity: 1 }],
                        }); }, { shouldError: true, onError: function () { return true; } })];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('updateOne rejects billingCode with negative quantity', function () { return sdk.api.form_responses.updateOne(formResponse.id, {
                            billingCodes: [{ code: 'G0019', quantity: -1 }],
                        }); }, { shouldError: true, onError: function () { return true; } })];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('updateOne rejects diagnosisCode with non-string code', function () { return sdk.api.form_responses.updateOne(formResponse.id, {
                            diagnosisCodes: [{ code: 12345 }],
                        }); }, { shouldError: true, onError: function () { return true; } })];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('updateOne can clear billingCodes/diagnosisCodes with empty arrays', function () { return sdk.api.form_responses.updateOne(formResponse.id, {
                            billingCodes: [],
                            diagnosisCodes: [],
                        }); }, { onResult: function (r) { return (Array.isArray(r.billingCodes) && r.billingCodes.length === 0
                                && Array.isArray(r.diagnosisCodes) && r.diagnosisCodes.length === 0); } })];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.form_responses.deleteOne(formResponse.id).catch(function () { })];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id).catch(function () { })];
                case 10:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
};
exports.eom_billing_codes_tests = eom_billing_codes_tests;
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
                    return [4 /*yield*/, (0, exports.eom_billing_codes_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ EOM billing codes test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ EOM billing codes test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=eom_billing_codes.test.js.map