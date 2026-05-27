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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enduser_login_rate_limits_tests = void 0;
require('source-map-support').install();
var axios_1 = __importDefault(require("axios"));
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || 'http://localhost:8080';
// Per-IP rate limits applied to enduser public endpoints:
//   POST /v1/login-enduser              20 / min, 100 / hour
//   POST /v1/begin-enduser-login-flow   10 / min,  50 / hour
//   POST /v1/endusers/send-otp-code      5 / min,  30 / hour
// Plus a per-identifier limit on begin_login_flow: 5 / 10 min per email|phone.
var post = function (path, body) { return __awaiter(void 0, void 0, void 0, function () {
    var res, err_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.post("".concat(host).concat(path), body, { validateStatus: function () { return true; } })];
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
var fire_until_429 = function (cap, send) { return __awaiter(void 0, void 0, void 0, function () {
    var triggeredAt, i, status_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                triggeredAt = -1;
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < cap + 5)) return [3 /*break*/, 4];
                return [4 /*yield*/, send(i)];
            case 2:
                status_1 = (_a.sent()).status;
                if (status_1 === 429) {
                    triggeredAt = i;
                    return [3 /*break*/, 4];
                }
                _a.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, triggeredAt];
        }
    });
}); };
var enduser_login_rate_limits_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var businessId, loginTrip, beginIpTrip, fixedEmail, beginIdTrip, fakeToken, sendOtpTrip, tripped, ts, enduser, goodLogin_1, goodLoginRetry_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("Enduser Login Rate Limit Tests");
                    businessId = sdk.userInfo.businessId;
                    // Ensure throttled_events from prior tests don't bleed in.
                    return [4 /*yield*/, sdk.reset_db()
                        // ---- /v1/login-enduser per-IP cap (20/min) ----
                        // Bogus emails ensure we never reach the actual DB lookup / login work.
                    ];
                case 1:
                    // Ensure throttled_events from prior tests don't bleed in.
                    _b.sent();
                    return [4 /*yield*/, fire_until_429(20, function (i) { return post('/v1/login-enduser', {
                            email: "rl-login-".concat(Date.now(), "-").concat(i, "@tellescope.com"),
                            password: 'NotARealPassword!2025',
                            businessId: businessId,
                        }); })];
                case 2:
                    loginTrip = _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('login per-IP throttle trips within first 21 requests', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, (loginTrip >= 0 && loginTrip <= 20) ? 'tripped' : "not-tripped:".concat(loginTrip)];
                        }); }); }, { expectedResult: 'tripped' })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, sdk.reset_db()
                        // ---- /v1/begin-enduser-login-flow per-IP cap (10/min) ----
                        // Use distinct emails so the per-identifier limit (5/10min) does NOT trip first;
                        // we want the IP cap to be the first thing to fire.
                    ];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, fire_until_429(10, function (i) { return post('/v1/begin-enduser-login-flow', {
                            email: "rl-begin-ip-".concat(Date.now(), "-").concat(i, "@tellescope.com"),
                            businessId: businessId,
                        }); })];
                case 5:
                    beginIpTrip = _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('begin_login_flow per-IP throttle trips within first 11 requests', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, (beginIpTrip >= 0 && beginIpTrip <= 10) ? 'tripped' : "not-tripped:".concat(beginIpTrip)];
                        }); }); }, { expectedResult: 'tripped' })];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, sdk.reset_db()
                        // ---- /v1/begin-enduser-login-flow per-identifier cap (5 / 10 min per email) ----
                        // Hit a single email below the per-IP cap.
                    ];
                case 7:
                    _b.sent();
                    fixedEmail = "rl-begin-id-".concat(Date.now(), "@tellescope.com");
                    return [4 /*yield*/, fire_until_429(5, function () { return post('/v1/begin-enduser-login-flow', {
                            email: fixedEmail,
                            businessId: businessId,
                        }); })];
                case 8:
                    beginIdTrip = _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('begin_login_flow per-identifier throttle trips within first 6 requests', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, (beginIdTrip >= 0 && beginIdTrip <= 5) ? 'tripped' : "not-tripped:".concat(beginIdTrip)];
                        }); }); }, { expectedResult: 'tripped' })];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, sdk.reset_db()
                        // ---- /v1/endusers/send-otp-code per-IP cap (5/min) ----
                        // Use a bogus JWT-shaped token so we trip the IP guard first (it runs before any DB work).
                    ];
                case 10:
                    _b.sent();
                    fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCJ9.sig';
                    return [4 /*yield*/, fire_until_429(5, function () { return post('/v1/endusers/send-otp-code', {
                            token: fakeToken,
                            method: 'email',
                        }); })];
                case 11:
                    sendOtpTrip = _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('send_otp per-IP throttle trips within first 6 requests', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, (sendOtpTrip >= 0 && sendOtpTrip <= 5) ? 'tripped' : "not-tripped:".concat(sendOtpTrip)];
                        }); }); }, { expectedResult: 'tripped' })
                        // Confirm 429 response does not leak the keying strategy (no mention of "ip" or "address").
                    ];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, post('/v1/endusers/send-otp-code', { token: fakeToken, method: 'email' })];
                case 13:
                    tripped = _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('429 response does not mention "ip" or "address"', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var msg;
                            var _a, _b;
                            return __generator(this, function (_c) {
                                msg = ((_b = (_a = tripped.data) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : '').toLowerCase();
                                return [2 /*return*/, (msg.includes('ip') || msg.includes('address')) ? 'leaked' : 'safe'];
                            });
                        }); }, { expectedResult: 'safe' })
                        // ---- Legitimate-login regression: a single successful login should still go through ----
                        // Reset state, then create a real enduser with a password and confirm one login succeeds.
                    ];
                case 14:
                    _b.sent();
                    // ---- Legitimate-login regression: a single successful login should still go through ----
                    // Reset state, then create a real enduser with a password and confirm one login succeeds.
                    return [4 /*yield*/, sdk.reset_db()];
                case 15:
                    // ---- Legitimate-login regression: a single successful login should still go through ----
                    // Reset state, then create a real enduser with a password and confirm one login succeeds.
                    _b.sent();
                    ts = Date.now();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'RateLimitOk', lname: 'Enduser',
                            email: "rl-legit-".concat(ts, "@tellescope.com"),
                        })];
                case 16:
                    enduser = _b.sent();
                    _b.label = 17;
                case 17:
                    _b.trys.push([17, , 23, 26]);
                    return [4 /*yield*/, sdk.api.endusers.set_password({ id: enduser.id, password: 'CorrectPassword123!' })];
                case 18:
                    _b.sent();
                    return [4 /*yield*/, post('/v1/login-enduser', {
                            email: enduser.email,
                            password: 'CorrectPassword123!',
                            businessId: businessId,
                        })];
                case 19:
                    goodLogin_1 = _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('legitimate login still succeeds (returns authToken, not 429)', function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                            return [2 /*return*/, goodLogin_1.status === 200 && !!((_a = goodLogin_1.data) === null || _a === void 0 ? void 0 : _a.authToken) ? 'ok' : "failed:".concat(goodLogin_1.status)];
                        }); }); }, { expectedResult: 'ok' })
                        // A subsequent successful login by the same user/IP should also succeed —
                        // a single legitimate user retrying must not trip the per-IP cap.
                    ];
                case 20:
                    _b.sent();
                    return [4 /*yield*/, post('/v1/login-enduser', {
                            email: enduser.email,
                            password: 'CorrectPassword123!',
                            businessId: businessId,
                        })];
                case 21:
                    goodLoginRetry_1 = _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('legitimate login retry still succeeds', function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                            return [2 /*return*/, goodLoginRetry_1.status === 200 && !!((_a = goodLoginRetry_1.data) === null || _a === void 0 ? void 0 : _a.authToken) ? 'ok' : "failed:".concat(goodLoginRetry_1.status)];
                        }); }); }, { expectedResult: 'ok' })];
                case 22:
                    _b.sent();
                    return [3 /*break*/, 26];
                case 23: return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id).catch(function () { return null; })];
                case 24:
                    _b.sent();
                    return [4 /*yield*/, sdk.reset_db().catch(function () { return null; })];
                case 25:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 26: return [2 /*return*/];
            }
        });
    });
};
exports.enduser_login_rate_limits_tests = enduser_login_rate_limits_tests;
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
                    return [4 /*yield*/, (0, exports.enduser_login_rate_limits_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Enduser login rate limit test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Enduser login rate limit test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=enduser_login_rate_limits.test.js.map