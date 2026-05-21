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
import axios from "axios";
import { Session } from "../../sdk";
import { async_test, log_header, } from "@tellescope/testing";
import { setup_tests } from "../setup";
var host = process.env.API_URL || 'http://localhost:8080';
// Coverage for the /v1/login-enduser response surface:
// - When an enduser has no password set, the error response must not include
//   enduser fields (PHI, hashedPassword, etc.).
// - The "enduser not found" and "wrong password" cases must be indistinguishable
//   (same status code, same message) to prevent account enumeration.
// - verify_otp invalid-code error must not include enduser fields.
var post_login = function (body) { return __awaiter(void 0, void 0, void 0, function () {
    var res, err_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios.post("".concat(host, "/v1/login-enduser"), body, { validateStatus: function () { return true; } })];
            case 1:
                res = _c.sent();
                return [2 /*return*/, { status: res.status, data: res.data }];
            case 2:
                err_1 = _c.sent();
                return [2 /*return*/, { status: (_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _a === void 0 ? void 0 : _a.status, data: (_b = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _b === void 0 ? void 0 : _b.data }];
            case 3: return [2 /*return*/];
        }
    });
}); };
export var enduser_login_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var ts, MARKER_FNAME, MARKER_ADDRESS, MARKER_DOB, noPasswordEnduser, withPasswordEnduser, noPasswordResp_1, noPasswordBody_1, _loop_1, _i, _b, sensitiveKey, wrongPasswordResp_1, unknownEmailResp_1, verifyOtpInvalidResp, verifyOtpBody_1, duplicateError_1, err_2;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    log_header("Enduser Login Tests");
                    ts = Date.now();
                    MARKER_FNAME = "LoginTestFname".concat(ts);
                    MARKER_ADDRESS = "".concat(ts, " Test Way");
                    MARKER_DOB = '01-01-1990';
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: MARKER_FNAME,
                            lname: 'LoginTest',
                            email: "login-test-no-password-".concat(ts, "@tellescope.com"),
                            dateOfBirth: MARKER_DOB,
                            addressLineOne: MARKER_ADDRESS,
                            addressLineTwo: 'Apt 4B',
                            city: 'Springfield',
                            state: 'IL',
                            zipCode: '62701',
                            gender: 'Female',
                            assignedTo: [sdk.userInfo.id],
                            fields: { secretField: "should-not-leak-".concat(ts) },
                            tags: ['vip', 'sensitive'],
                        })];
                case 1:
                    noPasswordEnduser = _e.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'PasswordedEnduser',
                            lname: 'LoginTest',
                            email: "login-test-with-password-".concat(ts, "@tellescope.com"),
                        })];
                case 2:
                    withPasswordEnduser = _e.sent();
                    return [4 /*yield*/, sdk.api.endusers.set_password({ id: withPasswordEnduser.id, password: 'CorrectPassword123!' })];
                case 3:
                    _e.sent();
                    _e.label = 4;
                case 4:
                    _e.trys.push([4, , 27, 29]);
                    return [4 /*yield*/, post_login({
                            email: noPasswordEnduser.email,
                            password: 'arbitrary-password',
                            businessId: sdk.userInfo.businessId,
                        })];
                case 5:
                    noPasswordResp_1 = _e.sent();
                    noPasswordBody_1 = JSON.stringify((_c = noPasswordResp_1.data) !== null && _c !== void 0 ? _c : {});
                    return [4 /*yield*/, async_test('No-password login response does not include fname marker', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, noPasswordBody_1.includes(MARKER_FNAME) ? 'leaked' : 'safe'];
                        }); }); }, { expectedResult: 'safe' })];
                case 6:
                    _e.sent();
                    return [4 /*yield*/, async_test('No-password login response does not include dateOfBirth', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, noPasswordBody_1.includes(MARKER_DOB) ? 'leaked' : 'safe'];
                        }); }); }, { expectedResult: 'safe' })];
                case 7:
                    _e.sent();
                    return [4 /*yield*/, async_test('No-password login response does not include addressLineOne marker', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, noPasswordBody_1.includes(MARKER_ADDRESS) ? 'leaked' : 'safe'];
                        }); }); }, { expectedResult: 'safe' })];
                case 8:
                    _e.sent();
                    _loop_1 = function (sensitiveKey) {
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0: return [4 /*yield*/, async_test("No-password login response does not include \"".concat(sensitiveKey, "\" key"), function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, noPasswordBody_1.includes("\"".concat(sensitiveKey, "\"")) ? 'leaked' : 'safe'];
                                    }); }); }, { expectedResult: 'safe' })];
                                case 1:
                                    _f.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, _b = ['hashedPassword', 'assignedTo', 'fields', 'tags', 'insurance', 'customFields'];
                    _e.label = 9;
                case 9:
                    if (!(_i < _b.length)) return [3 /*break*/, 12];
                    sensitiveKey = _b[_i];
                    return [5 /*yield**/, _loop_1(sensitiveKey)];
                case 10:
                    _e.sent();
                    _e.label = 11;
                case 11:
                    _i++;
                    return [3 /*break*/, 9];
                case 12: return [4 /*yield*/, async_test('No-password login response info field is absent or empty', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var info;
                        var _a;
                        return __generator(this, function (_b) {
                            info = ((_a = noPasswordResp_1.data) !== null && _a !== void 0 ? _a : {}).info;
                            if (info === undefined)
                                return [2 /*return*/, 'safe'];
                            if (typeof info === 'object' && info !== null && Object.keys(info).length === 0)
                                return [2 /*return*/, 'safe'];
                            return [2 /*return*/, 'leaked'];
                        });
                    }); }, { expectedResult: 'safe' })
                    // All three failure modes (no-password-set, wrong-password, unknown-email)
                    // must return an identical 401 + identical message — no enumeration of
                    // which case actually applies.
                ];
                case 13:
                    _e.sent();
                    return [4 /*yield*/, post_login({
                            email: withPasswordEnduser.email,
                            password: 'WrongPassword!2025',
                            businessId: sdk.userInfo.businessId,
                        })];
                case 14:
                    wrongPasswordResp_1 = _e.sent();
                    return [4 /*yield*/, post_login({
                            email: "does-not-exist-".concat(ts, "@tellescope.com"),
                            password: 'AnyPassword!2025',
                            businessId: sdk.userInfo.businessId,
                        })];
                case 15:
                    unknownEmailResp_1 = _e.sent();
                    return [4 /*yield*/, async_test('Login returns 401 for no-password account (indistinguishable from wrong password)', function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                            return [2 /*return*/, "".concat(noPasswordResp_1.status, ":").concat((_b = (_a = noPasswordResp_1.data) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : '')];
                        }); }); }, { expectedResult: '401:Login details are invalid' })];
                case 16:
                    _e.sent();
                    return [4 /*yield*/, async_test('Login returns same status for no-password vs wrong-password vs unknown-email', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var statuses, allSame;
                            return __generator(this, function (_a) {
                                statuses = [noPasswordResp_1.status, wrongPasswordResp_1.status, unknownEmailResp_1.status];
                                allSame = statuses.every(function (s) { return s === statuses[0]; });
                                return [2 /*return*/, allSame ? "same:".concat(statuses[0]) : "diff:".concat(statuses.join(','))];
                            });
                        }); }, { expectedResult: 'same:401' })];
                case 17:
                    _e.sent();
                    return [4 /*yield*/, async_test('Login returns same message for no-password vs wrong-password vs unknown-email', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var messages, allSame;
                            var _a, _b, _c;
                            return __generator(this, function (_d) {
                                messages = [(_a = noPasswordResp_1.data) === null || _a === void 0 ? void 0 : _a.message, (_b = wrongPasswordResp_1.data) === null || _b === void 0 ? void 0 : _b.message, (_c = unknownEmailResp_1.data) === null || _c === void 0 ? void 0 : _c.message];
                                allSame = messages.every(function (m) { return m === messages[0]; });
                                return [2 /*return*/, allSame ? 'same' : "diff:".concat(JSON.stringify(messages))];
                            });
                        }); }, { expectedResult: 'same' })
                        // verify_otp invalid-code response must not include enduser fields.
                    ];
                case 18:
                    _e.sent();
                    return [4 /*yield*/, axios.post("".concat(host, "/v1/verify-otp-code"), { token: 'not-a-real-token', code: '000000', businessId: sdk.userInfo.businessId }, { validateStatus: function () { return true; } })];
                case 19:
                    verifyOtpInvalidResp = _e.sent();
                    verifyOtpBody_1 = JSON.stringify((_d = verifyOtpInvalidResp.data) !== null && _d !== void 0 ? _d : {});
                    return [4 /*yield*/, async_test('verify_otp invalid-code response does not include any enduser fields', function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, (verifyOtpBody_1.includes('"hashedPassword"')
                                        || verifyOtpBody_1.includes('"assignedTo"')
                                        || verifyOtpBody_1.includes(MARKER_FNAME)
                                        ? 'leaked' : 'safe')];
                            });
                        }); }, { expectedResult: 'safe' })
                        // Regression: admin creating a duplicate enduser (same email) must still
                        // receive the existing record's id in the error info — this is an
                        // authenticated, intentional API-aid pattern via uniquenessError and must
                        // not be regressed by the public-endpoint sanitizer.
                    ];
                case 20:
                    _e.sent();
                    duplicateError_1 = null;
                    _e.label = 21;
                case 21:
                    _e.trys.push([21, 23, , 24]);
                    return [4 /*yield*/, sdk.api.endusers.createOne({ email: noPasswordEnduser.email })];
                case 22:
                    _e.sent();
                    return [3 /*break*/, 24];
                case 23:
                    err_2 = _e.sent();
                    duplicateError_1 = err_2;
                    return [3 /*break*/, 24];
                case 24: return [4 /*yield*/, async_test('Admin duplicate enduser create rejects with 409 Uniqueness Violation', function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, (_a = duplicateError_1 === null || duplicateError_1 === void 0 ? void 0 : duplicateError_1.message) !== null && _a !== void 0 ? _a : 'no-error'];
                    }); }); }, { expectedResult: 'Uniqueness Violation' })];
                case 25:
                    _e.sent();
                    return [4 /*yield*/, async_test('Admin duplicate enduser create returns the existing record id in info', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var info, existing, existingId;
                            var _a, _b;
                            return __generator(this, function (_c) {
                                info = duplicateError_1 === null || duplicateError_1 === void 0 ? void 0 : duplicateError_1.info;
                                if (!Array.isArray(info) || info.length === 0)
                                    return [2 /*return*/, "no-info:".concat(JSON.stringify(info))];
                                existing = (_a = info[0]) === null || _a === void 0 ? void 0 : _a.existingRecord;
                                existingId = (_b = existing === null || existing === void 0 ? void 0 : existing._id) !== null && _b !== void 0 ? _b : existing === null || existing === void 0 ? void 0 : existing.id;
                                return [2 /*return*/, existingId === noPasswordEnduser.id ? 'matched' : "mismatched:".concat(existingId)];
                            });
                        }); }, { expectedResult: 'matched' })];
                case 26:
                    _e.sent();
                    return [3 /*break*/, 29];
                case 27: return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(noPasswordEnduser.id).catch(function () { return null; }),
                        sdk.api.endusers.deleteOne(withPasswordEnduser.id).catch(function () { return null; }),
                    ])];
                case 28:
                    _e.sent();
                    return [7 /*endfinally*/];
                case 29: return [2 /*return*/];
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
                    return [4 /*yield*/, enduser_login_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Enduser login test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Enduser login test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=enduser_login.test.js.map