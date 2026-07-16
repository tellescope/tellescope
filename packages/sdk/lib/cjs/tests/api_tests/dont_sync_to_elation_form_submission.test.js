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
exports.dont_sync_to_elation_form_submission_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || "http://localhost:8080";
var dont_sync_to_elation_form_submission_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var form, field, enduser, responses, accessCodeSkip_1, accessCodeDefault_1, err_1, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("Submit Form Response dontSyncToElation Tests");
                    return [4 /*yield*/, sdk.api.forms.createOne({
                            title: 'dontSyncToElation Test Form',
                            isNonVisitElationNote: true,
                        })];
                case 1:
                    form = _b.sent();
                    return [4 /*yield*/, sdk.api.form_fields.createOne({
                            formId: form.id,
                            type: 'string',
                            title: 'Consent',
                            previousFields: [{ type: 'root', info: {} }],
                        })];
                case 2:
                    field = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'dont-sync-elation' })];
                case 3:
                    enduser = _b.sent();
                    responses = [{
                            fieldId: field.id, fieldTitle: 'Consent',
                            answer: { type: 'string', value: 'verbal consent recorded' },
                        }];
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, , 9, 16]);
                    return [4 /*yield*/, sdk.api.form_responses.prepare_form_response({
                            enduserId: enduser.id, formId: form.id,
                        })];
                case 5:
                    accessCodeSkip_1 = (_b.sent()).accessCode;
                    return [4 /*yield*/, (0, testing_1.async_test)("submit_form_response accepts dontSyncToElation: true", function () { return sdk.api.form_responses.submit_form_response({
                            accessCode: accessCodeSkip_1,
                            responses: responses,
                            dontSyncToElation: true,
                        }); }, { onResult: function (_a) {
                                var _b;
                                var formResponse = _a.formResponse;
                                return (!!formResponse.submittedAt
                                    && ((_b = formResponse.responses) === null || _b === void 0 ? void 0 : _b.length) === 1);
                            } })
                        // ── Regression: submission without the flag still succeeds ──
                    ];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.form_responses.prepare_form_response({
                            enduserId: enduser.id, formId: form.id,
                        })];
                case 7:
                    accessCodeDefault_1 = (_b.sent()).accessCode;
                    return [4 /*yield*/, (0, testing_1.async_test)("submit_form_response without dontSyncToElation still succeeds", function () { return sdk.api.form_responses.submit_form_response({
                            accessCode: accessCodeDefault_1,
                            responses: responses,
                        }); }, { onResult: function (_a) {
                                var _b;
                                var formResponse = _a.formResponse;
                                return (!!formResponse.submittedAt
                                    && ((_b = formResponse.responses) === null || _b === void 0 ? void 0 : _b.length) === 1);
                            } })];
                case 8:
                    _b.sent();
                    return [3 /*break*/, 16];
                case 9:
                    _b.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id)];
                case 10:
                    _b.sent();
                    return [3 /*break*/, 12];
                case 11:
                    err_1 = _b.sent();
                    return [3 /*break*/, 12];
                case 12:
                    _b.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, sdk.api.forms.deleteOne(form.id)];
                case 13:
                    _b.sent();
                    return [3 /*break*/, 15];
                case 14:
                    err_2 = _b.sent();
                    return [3 /*break*/, 15];
                case 15: return [7 /*endfinally*/];
                case 16: return [2 /*return*/];
            }
        });
    });
};
exports.dont_sync_to_elation_form_submission_tests = dont_sync_to_elation_form_submission_tests;
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
                    return [4 /*yield*/, (0, exports.dont_sync_to_elation_form_submission_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ dontSyncToElation form submission tests completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ dontSyncToElation form submission tests failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=dont_sync_to_elation_form_submission.test.js.map