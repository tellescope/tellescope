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
exports.enduser_session_invalidation_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || 'http://localhost:8080';
var businessId = '60398b1131a295e64f084ff6';
// Main test function that can be called independently
var enduser_session_invalidation_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var testEnduser, authToken, enduserSDK_1, error_1, resetOTPSettings;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("Enduser Session Invalidation Tests");
                    return [4 /*yield*/, sdk.api.endusers.createOne({ email: "session-invalidation-test-".concat(Date.now(), "@tellescope.com") })];
                case 1:
                    testEnduser = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 10, 14]);
                    return [4 /*yield*/, sdk.api.endusers.generate_auth_token({ id: testEnduser.id })];
                case 3:
                    authToken = (_b.sent()).authToken;
                    enduserSDK_1 = new sdk_1.EnduserSession({ host: host, authToken: authToken, businessId: sdk.userInfo.businessId });
                    // Test 1: Enduser authenticated before invalidation
                    return [4 /*yield*/, (0, testing_1.async_test)('enduser authenticated before invalidation', function () { return enduserSDK_1.test_authenticated(); }, { expectedResult: 'Authenticated!' })
                        // Wait to ensure time separation between token creation and invalidation
                    ];
                case 4:
                    // Test 1: Enduser authenticated before invalidation
                    _b.sent();
                    // Wait to ensure time separation between token creation and invalidation
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 2000)
                        // Test 2: Setting invalidateSessionsBefore rejects old token (401)
                    ];
                case 5:
                    // Wait to ensure time separation between token creation and invalidation
                    _b.sent();
                    // Test 2: Setting invalidateSessionsBefore rejects old token (401)
                    return [4 /*yield*/, (0, testing_1.async_test)('setting invalidateSessionsBefore rejects old token', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var e_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.endusers.updateOne(testEnduser.id, { invalidateSessionsBefore: new Date() })
                                        // Old token should now be rejected
                                    ];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2:
                                        _a.trys.push([2, 4, , 5]);
                                        return [4 /*yield*/, enduserSDK_1.test_authenticated()];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/, 'should have thrown'];
                                    case 4:
                                        e_1 = _a.sent();
                                        return [2 /*return*/, 'rejected'];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); }, { expectedResult: 'rejected' })
                        // Test 3: New token after invalidation works
                    ];
                case 6:
                    // Test 2: Setting invalidateSessionsBefore rejects old token (401)
                    _b.sent();
                    // Test 3: New token after invalidation works
                    return [4 /*yield*/, (0, testing_1.async_test)('new token after invalidation works', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var newAuthToken, newEnduserSDK;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: 
                                    // Wait to ensure new token iat is after invalidateSessionsBefore
                                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 2000)];
                                    case 1:
                                        // Wait to ensure new token iat is after invalidateSessionsBefore
                                        _a.sent();
                                        return [4 /*yield*/, sdk.api.endusers.generate_auth_token({ id: testEnduser.id })];
                                    case 2:
                                        newAuthToken = (_a.sent()).authToken;
                                        newEnduserSDK = new sdk_1.EnduserSession({ host: host, authToken: newAuthToken, businessId: sdk.userInfo.businessId });
                                        return [4 /*yield*/, newEnduserSDK.test_authenticated()];
                                    case 3: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); }, { expectedResult: 'Authenticated!' })
                        // Test 4: Cannot set invalidateSessionsBefore backwards (constraint error)
                    ];
                case 7:
                    // Test 3: New token after invalidation works
                    _b.sent();
                    // Test 4: Cannot set invalidateSessionsBefore backwards (constraint error)
                    return [4 /*yield*/, (0, testing_1.async_test)('cannot set invalidateSessionsBefore backwards', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var pastDate;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
                                        ;
                                        return [4 /*yield*/, sdk.api.endusers.updateOne(testEnduser.id, { invalidateSessionsBefore: pastDate })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, testing_1.handleAnyError)
                        // Test 5: Deleted enduser token rejected (401)
                    ];
                case 8:
                    // Test 4: Cannot set invalidateSessionsBefore backwards (constraint error)
                    _b.sent();
                    // Test 5: Deleted enduser token rejected (401)
                    return [4 /*yield*/, (0, testing_1.async_test)('deleted enduser token rejected', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var tempEnduser, tempAuthToken, tempEnduserSDK, e_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.endusers.createOne({ email: "temp-session-test-".concat(Date.now(), "@tellescope.com") })];
                                    case 1:
                                        tempEnduser = _a.sent();
                                        return [4 /*yield*/, sdk.api.endusers.generate_auth_token({ id: tempEnduser.id })];
                                    case 2:
                                        tempAuthToken = (_a.sent()).authToken;
                                        tempEnduserSDK = new sdk_1.EnduserSession({ host: host, authToken: tempAuthToken, businessId: sdk.userInfo.businessId });
                                        // Verify token works before deletion
                                        return [4 /*yield*/, tempEnduserSDK.test_authenticated()
                                            // Delete the enduser
                                        ];
                                    case 3:
                                        // Verify token works before deletion
                                        _a.sent();
                                        // Delete the enduser
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(tempEnduser.id)
                                            // Token should now be rejected
                                        ];
                                    case 4:
                                        // Delete the enduser
                                        _a.sent();
                                        _a.label = 5;
                                    case 5:
                                        _a.trys.push([5, 7, , 8]);
                                        return [4 /*yield*/, tempEnduserSDK.test_authenticated()];
                                    case 6:
                                        _a.sent();
                                        return [2 /*return*/, 'should have thrown'];
                                    case 7:
                                        e_2 = _a.sent();
                                        return [2 /*return*/, 'rejected'];
                                    case 8: return [2 /*return*/];
                                }
                            });
                        }); }, { expectedResult: 'rejected' })];
                case 9:
                    // Test 5: Deleted enduser token rejected (401)
                    _b.sent();
                    console.log("✅ All Enduser Session Invalidation tests passed!");
                    return [3 /*break*/, 14];
                case 10:
                    _b.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(testEnduser.id)];
                case 11:
                    _b.sent();
                    return [3 /*break*/, 13];
                case 12:
                    error_1 = _b.sent();
                    console.error('Cleanup error:', error_1);
                    return [3 /*break*/, 13];
                case 13: return [7 /*endfinally*/];
                case 14:
                    // --- OTP enablement invalidation tests ---
                    (0, testing_1.log_header)("OTP Enablement Session Invalidation Tests");
                    resetOTPSettings = function (s) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, s.api.organizations.updateOne(s.userInfo.businessId, {
                                        portalSettings: { authentication: { requireOTP: false, requireOTPAfterPassword: false } },
                                    }, { replaceObjectFields: true })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    // Ensure OTP is off and db is clean before starting
                    return [4 /*yield*/, sdk.reset_db()];
                case 15:
                    // Ensure OTP is off and db is clean before starting
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 16:
                    _b.sent();
                    return [4 /*yield*/, resetOTPSettings(sdk)];
                case 17:
                    _b.sent();
                    _b.label = 18;
                case 18:
                    _b.trys.push([18, , 25, 27]);
                    // Test 6: Enabling requireOTP invalidates multiple enduser sessions at once
                    return [4 /*yield*/, (0, testing_1.async_test)('enabling requireOTP invalidates multiple enduser sessions', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var endusers, tokens, sessions, _i, sessions_1, s, _a, sessions_2, s, e_3, _b, endusers_1, e, newToken, newSession, _c, endusers_2, e;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0: return [4 /*yield*/, Promise.all([
                                            sdk.api.endusers.createOne({ email: "otp-bulk-1-".concat(Date.now(), "@tellescope.com") }),
                                            sdk.api.endusers.createOne({ email: "otp-bulk-2-".concat(Date.now(), "@tellescope.com") }),
                                            sdk.api.endusers.createOne({ email: "otp-bulk-3-".concat(Date.now(), "@tellescope.com") }),
                                        ])];
                                    case 1:
                                        endusers = _d.sent();
                                        _d.label = 2;
                                    case 2:
                                        _d.trys.push([2, , 23, 29]);
                                        return [4 /*yield*/, Promise.all(endusers.map(function (e) { return sdk.api.endusers.generate_auth_token({ id: e.id, overrideOTP: true }); }))];
                                    case 3:
                                        tokens = _d.sent();
                                        sessions = tokens.map(function (t) { return new sdk_1.EnduserSession({ host: host, authToken: t.authToken, businessId: sdk.userInfo.businessId }); });
                                        _i = 0, sessions_1 = sessions;
                                        _d.label = 4;
                                    case 4:
                                        if (!(_i < sessions_1.length)) return [3 /*break*/, 7];
                                        s = sessions_1[_i];
                                        return [4 /*yield*/, s.test_authenticated()];
                                    case 5:
                                        _d.sent();
                                        _d.label = 6;
                                    case 6:
                                        _i++;
                                        return [3 /*break*/, 4];
                                    case 7: return [4 /*yield*/, (0, testing_1.wait)(undefined, 2000)
                                        // Enable OTP
                                    ];
                                    case 8:
                                        _d.sent();
                                        // Enable OTP
                                        return [4 /*yield*/, sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
                                                portalSettings: { authentication: { requireOTP: true } },
                                            })
                                            // Wait for side effect to process
                                        ];
                                    case 9:
                                        // Enable OTP
                                        _d.sent();
                                        // Wait for side effect to process
                                        return [4 /*yield*/, (0, testing_1.wait)(undefined, 1000)
                                            // All old tokens should be rejected
                                        ];
                                    case 10:
                                        // Wait for side effect to process
                                        _d.sent();
                                        _a = 0, sessions_2 = sessions;
                                        _d.label = 11;
                                    case 11:
                                        if (!(_a < sessions_2.length)) return [3 /*break*/, 16];
                                        s = sessions_2[_a];
                                        _d.label = 12;
                                    case 12:
                                        _d.trys.push([12, 14, , 15]);
                                        return [4 /*yield*/, s.test_authenticated()];
                                    case 13:
                                        _d.sent();
                                        return [2 /*return*/, 'should have thrown'];
                                    case 14:
                                        e_3 = _d.sent();
                                        return [3 /*break*/, 15];
                                    case 15:
                                        _a++;
                                        return [3 /*break*/, 11];
                                    case 16: 
                                    // New tokens should work
                                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 2000)];
                                    case 17:
                                        // New tokens should work
                                        _d.sent();
                                        _b = 0, endusers_1 = endusers;
                                        _d.label = 18;
                                    case 18:
                                        if (!(_b < endusers_1.length)) return [3 /*break*/, 22];
                                        e = endusers_1[_b];
                                        return [4 /*yield*/, sdk.api.endusers.generate_auth_token({ id: e.id, overrideOTP: true })];
                                    case 19:
                                        newToken = (_d.sent()).authToken;
                                        newSession = new sdk_1.EnduserSession({ host: host, authToken: newToken, businessId: sdk.userInfo.businessId });
                                        return [4 /*yield*/, newSession.test_authenticated()];
                                    case 20:
                                        _d.sent();
                                        _d.label = 21;
                                    case 21:
                                        _b++;
                                        return [3 /*break*/, 18];
                                    case 22: return [2 /*return*/, 'passed'];
                                    case 23: return [4 /*yield*/, resetOTPSettings(sdk)];
                                    case 24:
                                        _d.sent();
                                        _c = 0, endusers_2 = endusers;
                                        _d.label = 25;
                                    case 25:
                                        if (!(_c < endusers_2.length)) return [3 /*break*/, 28];
                                        e = endusers_2[_c];
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(e.id).catch(console.error)];
                                    case 26:
                                        _d.sent();
                                        _d.label = 27;
                                    case 27:
                                        _c++;
                                        return [3 /*break*/, 25];
                                    case 28: return [7 /*endfinally*/];
                                    case 29: return [2 /*return*/];
                                }
                            });
                        }); }, { expectedResult: 'passed' })
                        // Test 7: Enabling requireOTPAfterPassword invalidates multiple enduser sessions
                    ];
                case 19:
                    // Test 6: Enabling requireOTP invalidates multiple enduser sessions at once
                    _b.sent();
                    // Test 7: Enabling requireOTPAfterPassword invalidates multiple enduser sessions
                    return [4 /*yield*/, (0, testing_1.async_test)('enabling requireOTPAfterPassword invalidates multiple enduser sessions', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var endusers, tokens, sessions, _i, sessions_3, s, _a, sessions_4, s, e_4, _b, endusers_3, e, newToken, newSession, _c, endusers_4, e;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0: return [4 /*yield*/, Promise.all([
                                            sdk.api.endusers.createOne({ email: "otp-mfa-1-".concat(Date.now(), "@tellescope.com") }),
                                            sdk.api.endusers.createOne({ email: "otp-mfa-2-".concat(Date.now(), "@tellescope.com") }),
                                        ])];
                                    case 1:
                                        endusers = _d.sent();
                                        _d.label = 2;
                                    case 2:
                                        _d.trys.push([2, , 23, 29]);
                                        return [4 /*yield*/, Promise.all(endusers.map(function (e) { return sdk.api.endusers.generate_auth_token({ id: e.id, overrideOTP: true }); }))];
                                    case 3:
                                        tokens = _d.sent();
                                        sessions = tokens.map(function (t) { return new sdk_1.EnduserSession({ host: host, authToken: t.authToken, businessId: sdk.userInfo.businessId }); });
                                        _i = 0, sessions_3 = sessions;
                                        _d.label = 4;
                                    case 4:
                                        if (!(_i < sessions_3.length)) return [3 /*break*/, 7];
                                        s = sessions_3[_i];
                                        return [4 /*yield*/, s.test_authenticated()];
                                    case 5:
                                        _d.sent();
                                        _d.label = 6;
                                    case 6:
                                        _i++;
                                        return [3 /*break*/, 4];
                                    case 7: return [4 /*yield*/, (0, testing_1.wait)(undefined, 2000)];
                                    case 8:
                                        _d.sent();
                                        return [4 /*yield*/, sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
                                                portalSettings: { authentication: { requireOTPAfterPassword: true } },
                                            })];
                                    case 9:
                                        _d.sent();
                                        return [4 /*yield*/, (0, testing_1.wait)(undefined, 1000)];
                                    case 10:
                                        _d.sent();
                                        _a = 0, sessions_4 = sessions;
                                        _d.label = 11;
                                    case 11:
                                        if (!(_a < sessions_4.length)) return [3 /*break*/, 16];
                                        s = sessions_4[_a];
                                        _d.label = 12;
                                    case 12:
                                        _d.trys.push([12, 14, , 15]);
                                        return [4 /*yield*/, s.test_authenticated()];
                                    case 13:
                                        _d.sent();
                                        return [2 /*return*/, 'should have thrown'];
                                    case 14:
                                        e_4 = _d.sent();
                                        return [3 /*break*/, 15];
                                    case 15:
                                        _a++;
                                        return [3 /*break*/, 11];
                                    case 16: 
                                    // New tokens work
                                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 2000)];
                                    case 17:
                                        // New tokens work
                                        _d.sent();
                                        _b = 0, endusers_3 = endusers;
                                        _d.label = 18;
                                    case 18:
                                        if (!(_b < endusers_3.length)) return [3 /*break*/, 22];
                                        e = endusers_3[_b];
                                        return [4 /*yield*/, sdk.api.endusers.generate_auth_token({ id: e.id, overrideOTP: true })];
                                    case 19:
                                        newToken = (_d.sent()).authToken;
                                        newSession = new sdk_1.EnduserSession({ host: host, authToken: newToken, businessId: sdk.userInfo.businessId });
                                        return [4 /*yield*/, newSession.test_authenticated()];
                                    case 20:
                                        _d.sent();
                                        _d.label = 21;
                                    case 21:
                                        _b++;
                                        return [3 /*break*/, 18];
                                    case 22: return [2 /*return*/, 'passed'];
                                    case 23: return [4 /*yield*/, resetOTPSettings(sdk)];
                                    case 24:
                                        _d.sent();
                                        _c = 0, endusers_4 = endusers;
                                        _d.label = 25;
                                    case 25:
                                        if (!(_c < endusers_4.length)) return [3 /*break*/, 28];
                                        e = endusers_4[_c];
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(e.id).catch(console.error)];
                                    case 26:
                                        _d.sent();
                                        _d.label = 27;
                                    case 27:
                                        _c++;
                                        return [3 /*break*/, 25];
                                    case 28: return [7 /*endfinally*/];
                                    case 29: return [2 /*return*/];
                                }
                            });
                        }); }, { expectedResult: 'passed' })
                        // Reset rate limiting state before continuing
                    ];
                case 20:
                    // Test 7: Enabling requireOTPAfterPassword invalidates multiple enduser sessions
                    _b.sent();
                    // Reset rate limiting state before continuing
                    return [4 /*yield*/, sdk.reset_db()];
                case 21:
                    // Reset rate limiting state before continuing
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)
                        // Test 8: Disabling OTP does NOT invalidate sessions
                    ];
                case 22:
                    _b.sent();
                    // Test 8: Disabling OTP does NOT invalidate sessions
                    return [4 /*yield*/, (0, testing_1.async_test)('disabling OTP does not invalidate sessions', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var enduser, authToken, enduserSession;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: 
                                    // Enable OTP first
                                    return [4 /*yield*/, sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
                                            portalSettings: { authentication: { requireOTP: true } },
                                        })];
                                    case 1:
                                        // Enable OTP first
                                        _a.sent();
                                        return [4 /*yield*/, (0, testing_1.wait)(undefined, 2000)
                                            // Create enduser and token AFTER OTP is enabled (so token is valid)
                                        ];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, sdk.api.endusers.createOne({ email: "otp-disable-".concat(Date.now(), "@tellescope.com") })];
                                    case 3:
                                        enduser = _a.sent();
                                        _a.label = 4;
                                    case 4:
                                        _a.trys.push([4, , 11, 14]);
                                        return [4 /*yield*/, sdk.api.endusers.generate_auth_token({ id: enduser.id, overrideOTP: true })];
                                    case 5:
                                        authToken = (_a.sent()).authToken;
                                        enduserSession = new sdk_1.EnduserSession({ host: host, authToken: authToken, businessId: sdk.userInfo.businessId });
                                        return [4 /*yield*/, enduserSession.test_authenticated()];
                                    case 6:
                                        _a.sent();
                                        return [4 /*yield*/, (0, testing_1.wait)(undefined, 2000)
                                            // Disable OTP
                                        ];
                                    case 7:
                                        _a.sent();
                                        // Disable OTP
                                        return [4 /*yield*/, sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
                                                portalSettings: { authentication: { requireOTP: false } },
                                            }, { replaceObjectFields: true })];
                                    case 8:
                                        // Disable OTP
                                        _a.sent();
                                        return [4 /*yield*/, (0, testing_1.wait)(undefined, 1000)
                                            // Old token should still work (disabling OTP should not invalidate)
                                        ];
                                    case 9:
                                        _a.sent();
                                        return [4 /*yield*/, enduserSession.test_authenticated()];
                                    case 10: 
                                    // Old token should still work (disabling OTP should not invalidate)
                                    return [2 /*return*/, _a.sent()];
                                    case 11: return [4 /*yield*/, resetOTPSettings(sdk)];
                                    case 12:
                                        _a.sent();
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id).catch(console.error)];
                                    case 13:
                                        _a.sent();
                                        return [7 /*endfinally*/];
                                    case 14: return [2 /*return*/];
                                }
                            });
                        }); }, { expectedResult: 'Authenticated!' })
                        // Test 9: OTP invalidation is scoped to the updated organization only (multi-tenant)
                    ];
                case 23:
                    // Test 8: Disabling OTP does NOT invalidate sessions
                    _b.sent();
                    // Test 9: OTP invalidation is scoped to the updated organization only (multi-tenant)
                    return [4 /*yield*/, (0, testing_1.async_test)('OTP invalidation is scoped to the updated organization only', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var sdkOther, otherEnduser, mainEnduser, otherToken, otherEnduserSession, mainToken, mainEnduserSession, e_5;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        sdkOther = new sdk_1.Session({ host: host, apiKey: "ba745e25162bb95a795c5fa1af70df188d93c4d3aac9c48b34a5c8c9dd7b80f7" });
                                        return [4 /*yield*/, sdkOther.api.endusers.createOne({ email: "otp-other-tenant-".concat(Date.now(), "@tellescope.com") })];
                                    case 1:
                                        otherEnduser = _a.sent();
                                        return [4 /*yield*/, sdk.api.endusers.createOne({ email: "otp-main-tenant-".concat(Date.now(), "@tellescope.com") })];
                                    case 2:
                                        mainEnduser = _a.sent();
                                        _a.label = 3;
                                    case 3:
                                        _a.trys.push([3, , 16, 20]);
                                        return [4 /*yield*/, sdkOther.api.endusers.generate_auth_token({ id: otherEnduser.id, overrideOTP: true })];
                                    case 4:
                                        otherToken = (_a.sent()).authToken;
                                        otherEnduserSession = new sdk_1.EnduserSession({ host: host, authToken: otherToken, businessId: sdkOther.userInfo.businessId });
                                        return [4 /*yield*/, sdk.api.endusers.generate_auth_token({ id: mainEnduser.id, overrideOTP: true })];
                                    case 5:
                                        mainToken = (_a.sent()).authToken;
                                        mainEnduserSession = new sdk_1.EnduserSession({ host: host, authToken: mainToken, businessId: sdk.userInfo.businessId });
                                        // Both tokens work
                                        return [4 /*yield*/, otherEnduserSession.test_authenticated()];
                                    case 6:
                                        // Both tokens work
                                        _a.sent();
                                        return [4 /*yield*/, mainEnduserSession.test_authenticated()];
                                    case 7:
                                        _a.sent();
                                        return [4 /*yield*/, (0, testing_1.wait)(undefined, 2000)
                                            // Enable OTP on main tenant only
                                        ];
                                    case 8:
                                        _a.sent();
                                        // Enable OTP on main tenant only
                                        return [4 /*yield*/, sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
                                                portalSettings: { authentication: { requireOTP: true } },
                                            })];
                                    case 9:
                                        // Enable OTP on main tenant only
                                        _a.sent();
                                        return [4 /*yield*/, (0, testing_1.wait)(undefined, 1000)
                                            // Main tenant enduser's old token should be rejected
                                        ];
                                    case 10:
                                        _a.sent();
                                        _a.label = 11;
                                    case 11:
                                        _a.trys.push([11, 13, , 14]);
                                        return [4 /*yield*/, mainEnduserSession.test_authenticated()];
                                    case 12:
                                        _a.sent();
                                        return [2 /*return*/, 'should have thrown'];
                                    case 13:
                                        e_5 = _a.sent();
                                        return [3 /*break*/, 14];
                                    case 14: 
                                    // Other tenant enduser's token should still work
                                    return [4 /*yield*/, otherEnduserSession.test_authenticated()];
                                    case 15:
                                        // Other tenant enduser's token should still work
                                        _a.sent();
                                        return [2 /*return*/, 'passed'];
                                    case 16: return [4 /*yield*/, resetOTPSettings(sdk)];
                                    case 17:
                                        _a.sent();
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(mainEnduser.id).catch(console.error)];
                                    case 18:
                                        _a.sent();
                                        return [4 /*yield*/, sdkOther.api.endusers.deleteOne(otherEnduser.id).catch(console.error)];
                                    case 19:
                                        _a.sent();
                                        return [7 /*endfinally*/];
                                    case 20: return [2 /*return*/];
                                }
                            });
                        }); }, { expectedResult: 'passed' })];
                case 24:
                    // Test 9: OTP invalidation is scoped to the updated organization only (multi-tenant)
                    _b.sent();
                    console.log("✅ All OTP Enablement Session Invalidation tests passed!");
                    return [3 /*break*/, 27];
                case 25: 
                // Always reset OTP settings to prevent impacting other tests
                return [4 /*yield*/, resetOTPSettings(sdk).catch(console.error)];
                case 26:
                    // Always reset OTP settings to prevent impacting other tests
                    _b.sent();
                    return [7 /*endfinally*/];
                case 27: return [2 /*return*/];
            }
        });
    });
};
exports.enduser_session_invalidation_tests = enduser_session_invalidation_tests;
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
                    return [4 /*yield*/, (0, exports.enduser_session_invalidation_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Enduser session invalidation test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Enduser session invalidation test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=enduser_session_invalidation.test.js.map