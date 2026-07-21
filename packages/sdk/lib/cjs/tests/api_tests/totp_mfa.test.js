"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.totp_mfa_tests = void 0;
require('source-map-support').install();
var crypto_1 = __importDefault(require("crypto"));
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || 'http://localhost:8080';
var decode_jwt = function (token) {
    try {
        var part = token.split('.')[1];
        var json = Buffer.from(part.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
        return JSON.parse(json);
    }
    catch (_a) {
        return null;
    }
};
// Client-side TOTP mirror (RFC 6238, HMAC-SHA1, 6 digits, 30s period) so the test can
// compute valid codes from the secret returned by begin_TOTP_configuration
var TOTP_PERIOD_MS = 30000;
var BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
var base32_decode = function (s) {
    var bits = 0, value = 0;
    var bytes = [];
    for (var _i = 0, _a = s.toUpperCase().replace(/=+$/, ''); _i < _a.length; _i++) {
        var char = _a[_i];
        var index = BASE32_ALPHABET.indexOf(char);
        if (index === -1)
            throw new Error("Invalid base32 character");
        value = (value << 5) | index;
        bits += 5;
        if (bits >= 8) {
            bytes.push((value >>> (bits - 8)) & 255);
            bits -= 8;
        }
    }
    return Buffer.from(bytes);
};
var current_timestep = function () { return Math.floor(Date.now() / TOTP_PERIOD_MS); };
var compute_totp_code = function (secret, timestep) {
    if (timestep === void 0) { timestep = current_timestep(); }
    var counter = Buffer.alloc(8);
    counter.writeBigUInt64BE(BigInt(timestep));
    var hmac = crypto_1.default.createHmac('sha1', base32_decode(secret)).update(counter).digest();
    var offset = hmac[hmac.length - 1] & 0xf;
    var binary = (((hmac[offset] & 0x7f) << 24)
        | ((hmac[offset + 1] & 0xff) << 16)
        | ((hmac[offset + 2] & 0xff) << 8)
        | (hmac[offset + 3] & 0xff));
    return (binary % 1000000).toString().padStart(6, '0');
};
// a syntactically-valid 6-digit code guaranteed not to match the current/adjacent timesteps
var wrong_totp_code = function (secret) {
    var step = current_timestep();
    var valid = new Set([step - 1, step, step + 1].map(function (s) { return compute_totp_code(secret, s); }));
    var candidate = (parseInt(compute_totp_code(secret, step)) + 1) % 1000000;
    while (valid.has(candidate.toString().padStart(6, '0'))) {
        candidate = (candidate + 1) % 1000000;
    }
    return candidate.toString().padStart(6, '0');
};
var totp_mfa_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD, nonAdminId, businessId, totpSecret, lastVerifiedStep, wait_for_fresh_totp_step, set_allowed_mfa_methods, clear_allowed_mfa_methods, reset_mfa_state, otpauthURL_1, challengeSession_1, challengeCode_1, replaySession_1, saw429, i, e_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    (0, testing_1.log_header)("TOTP MFA Tests");
                    NON_ADMIN_EMAIL = process.env.NON_ADMIN_EMAIL;
                    NON_ADMIN_PASSWORD = process.env.NON_ADMIN_PASSWORD;
                    if (!(NON_ADMIN_EMAIL && NON_ADMIN_PASSWORD)) {
                        throw new Error("NON_ADMIN_EMAIL and NON_ADMIN_PASSWORD must be set to run totp_mfa_tests");
                    }
                    nonAdminId = sdkNonAdmin.userInfo.id;
                    businessId = sdk.userInfo.businessId;
                    totpSecret = '';
                    lastVerifiedStep = 0;
                    wait_for_fresh_totp_step = function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(current_timestep() <= lastVerifiedStep)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1000)];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 0];
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); };
                    set_allowed_mfa_methods = function (methods) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, sdk.api.users.updateOne(nonAdminId, { allowedMFAMethods: methods }, { replaceObjectFields: true })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 250)];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    clear_allowed_mfa_methods = function () { return __awaiter(void 0, void 0, void 0, function () {
                        var u;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, sdk.api.users.getOne(nonAdminId)];
                                case 1:
                                    u = _b.sent();
                                    if (!((_a = u.allowedMFAMethods) !== null && _a !== void 0 ? _a : []).length)
                                        return [2 /*return*/];
                                    return [4 /*yield*/, set_allowed_mfa_methods([])];
                                case 2:
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    reset_mfa_state = function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b, _c, authToken, user, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    _e.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, sdk.api.organizations.updateOne(businessId, { enforceMFA: false })];
                                case 1:
                                    _e.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    _a = _e.sent();
                                    return [3 /*break*/, 3];
                                case 3: return [4 /*yield*/, (0, testing_1.wait)(undefined, 250)];
                                case 4:
                                    _e.sent();
                                    _e.label = 5;
                                case 5:
                                    _e.trys.push([5, 7, , 8]);
                                    return [4 /*yield*/, clear_allowed_mfa_methods()];
                                case 6:
                                    _e.sent();
                                    return [3 /*break*/, 8];
                                case 7:
                                    _b = _e.sent();
                                    return [3 /*break*/, 8];
                                case 8:
                                    _e.trys.push([8, 11, , 12]);
                                    return [4 /*yield*/, sdkNonAdmin.api.users.configure_MFA({ disable: true })];
                                case 9:
                                    _c = _e.sent(), authToken = _c.authToken, user = _c.user;
                                    return [4 /*yield*/, sdkNonAdmin.handle_new_session(__assign(__assign({}, user), { authToken: authToken }))];
                                case 10:
                                    _e.sent();
                                    return [3 /*break*/, 12];
                                case 11:
                                    _d = _e.sent();
                                    return [3 /*break*/, 12];
                                case 12: return [4 /*yield*/, (0, testing_1.wait)(undefined, 250)];
                                case 13:
                                    _e.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, reset_mfa_state()];
                case 1:
                    _c.sent();
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, , 49, 51]);
                    // ============================================================
                    // A. Enrollment
                    // ============================================================
                    (0, testing_1.log_header)("A. TOTP Enrollment");
                    otpauthURL_1 = '';
                    return [4 /*yield*/, (0, testing_1.async_test)('A1. begin_TOTP_configuration returns otpauthURL + secret', function () { return sdkNonAdmin.api.users.begin_TOTP_configuration({}); }, { shouldError: false, onResult: function (r) {
                                totpSecret = r.secret;
                                otpauthURL_1 = r.otpauthURL;
                                return typeof r.secret === 'string' && r.secret.length >= 16 && /^[A-Z2-7]+$/.test(r.secret);
                            } })];
                case 3:
                    _c.sent();
                    (0, testing_1.assert)(otpauthURL_1.includes(totpSecret), 'otpauthURL missing secret', 'A2. otpauthURL contains secret');
                    (0, testing_1.assert)(otpauthURL_1.startsWith('otpauth://totp/'), 'unexpected otpauth scheme', 'A3. otpauth scheme');
                    (0, testing_1.assert)(otpauthURL_1.includes('issuer=Tellescope'), 'otpauthURL missing issuer', 'A4. otpauthURL issuer');
                    return [4 /*yield*/, (0, testing_1.async_test)('A5. confirm with wrong code -> 401', function () { return sdkNonAdmin.api.users.confirm_TOTP_configuration({ code: wrong_totp_code(totpSecret) }); }, { shouldError: true, onError: function (e) { return e.statusCode === 401 || /invalid/i.test(e.message || ''); } })];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 600)]; // confirm rate limit is 1/500ms
                case 5:
                    _c.sent(); // confirm rate limit is 1/500ms
                    return [4 /*yield*/, (0, testing_1.async_test)('A6. confirm with correct code -> enabled, 10 recovery codes, requiresMFA false', function () { return sdkNonAdmin.api.users.confirm_TOTP_configuration({ code: compute_totp_code(totpSecret) }); }, { shouldError: false, onResult: function (r) {
                                var _a, _b, _c, _d;
                                if (r.authToken)
                                    sdkNonAdmin.handle_new_session(__assign(__assign({}, r.user), { authToken: r.authToken }));
                                return (((_a = r.recoveryCodes) === null || _a === void 0 ? void 0 : _a.length) === 10
                                    && ((_c = (_b = r.user) === null || _b === void 0 ? void 0 : _b.mfa) === null || _c === void 0 ? void 0 : _c.authenticator) === true
                                    && ((_d = decode_jwt(r.authToken)) === null || _d === void 0 ? void 0 : _d.requiresMFA) === false);
                            } })];
                case 6:
                    _c.sent();
                    lastVerifiedStep = current_timestep();
                    return [4 /*yield*/, (0, testing_1.async_test)('A7. user record has mfa.authenticator === true', function () { return sdk.api.users.getOne(nonAdminId); }, { shouldError: false, onResult: function (u) { var _a, _b; return ((_a = u.mfa) === null || _a === void 0 ? void 0 : _a.authenticator) === true && !((_b = u.mfa) === null || _b === void 0 ? void 0 : _b.email); } })];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('A8. begin again while enrolled -> 400', function () { return sdkNonAdmin.api.users.begin_TOTP_configuration({}); }, { shouldError: true, onError: function (e) { return e.statusCode === 400 || /already configured/i.test(e.message || ''); } })
                        // ============================================================
                        // B. Login challenge + replay protection
                        // ============================================================
                    ];
                case 8:
                    _c.sent();
                    // ============================================================
                    // B. Login challenge + replay protection
                    // ============================================================
                    (0, testing_1.log_header)("B. TOTP Challenge + Replay");
                    challengeSession_1 = new sdk_1.Session({ host: host });
                    return [4 /*yield*/, challengeSession_1.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)];
                case 9:
                    _c.sent();
                    (0, testing_1.assert)(!!challengeSession_1.userInfo.requiresMFA || ((_b = decode_jwt(challengeSession_1.authToken)) === null || _b === void 0 ? void 0 : _b.requiresMFA) === true, 'expected requiresMFA session after password login with TOTP enabled', 'B1. password login yields requiresMFA session');
                    return [4 /*yield*/, wait_for_fresh_totp_step()];
                case 10:
                    _c.sent();
                    challengeCode_1 = compute_totp_code(totpSecret);
                    return [4 /*yield*/, (0, testing_1.async_test)('B2. submit_MFA_challenge with TOTP code -> full session', function () { return challengeSession_1.api.users.submit_MFA_challenge({ code: challengeCode_1 }); }, { shouldError: false, onResult: function (r) { var _a; return ((_a = decode_jwt(r.authToken)) === null || _a === void 0 ? void 0 : _a.requiresMFA) === false; } })];
                case 11:
                    _c.sent();
                    lastVerifiedStep = current_timestep();
                    replaySession_1 = new sdk_1.Session({ host: host });
                    return [4 /*yield*/, replaySession_1.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)];
                case 12:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 600)]; // submit rate limit is 1/500ms
                case 13:
                    _c.sent(); // submit rate limit is 1/500ms
                    return [4 /*yield*/, (0, testing_1.async_test)('B3. replaying the same TOTP code -> 401', function () { return replaySession_1.api.users.submit_MFA_challenge({ code: challengeCode_1 }); }, { shouldError: true, onError: function (e) { return e.statusCode === 401 || /invalid/i.test(e.message || ''); } })
                        // ============================================================
                        // C. Recovery-code interplay with a second method
                        // ============================================================
                    ];
                case 14:
                    _c.sent();
                    // ============================================================
                    // C. Recovery-code interplay with a second method
                    // ============================================================
                    (0, testing_1.log_header)("C. Recovery-code interplay");
                    return [4 /*yield*/, (0, testing_1.async_test)('C1. enabling email MFA when TOTP already configured -> recoveryCodes []', function () { return sdkNonAdmin.api.users.configure_MFA({}); }, { shouldError: false, onResult: function (r) {
                                var _a, _b, _c, _d, _e;
                                if (r.authToken)
                                    sdkNonAdmin.handle_new_session(__assign(__assign({}, r.user), { authToken: r.authToken }));
                                return ((_a = r.recoveryCodes) === null || _a === void 0 ? void 0 : _a.length) === 0 && ((_c = (_b = r.user) === null || _b === void 0 ? void 0 : _b.mfa) === null || _c === void 0 ? void 0 : _c.email) === true && ((_e = (_d = r.user) === null || _d === void 0 ? void 0 : _d.mfa) === null || _e === void 0 ? void 0 : _e.authenticator) === true;
                            } })
                        // ============================================================
                        // D. Method-scoped disable + enforceMFA last-method rule
                        // ============================================================
                    ];
                case 15:
                    _c.sent();
                    // ============================================================
                    // D. Method-scoped disable + enforceMFA last-method rule
                    // ============================================================
                    (0, testing_1.log_header)("D. Method-scoped disable");
                    return [4 /*yield*/, sdk.api.organizations.updateOne(businessId, { enforceMFA: true })];
                case 16:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 250)];
                case 17:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('D1. disable email (other method remains) succeeds under enforceMFA', function () { return sdkNonAdmin.api.users.configure_MFA({ disable: true, method: 'email' }); }, { shouldError: false, onResult: function (r) {
                                var _a, _b, _c, _d;
                                if (r.authToken)
                                    sdkNonAdmin.handle_new_session(__assign(__assign({}, r.user), { authToken: r.authToken }));
                                return !((_b = (_a = r.user) === null || _a === void 0 ? void 0 : _a.mfa) === null || _b === void 0 ? void 0 : _b.email) && ((_d = (_c = r.user) === null || _c === void 0 ? void 0 : _c.mfa) === null || _d === void 0 ? void 0 : _d.authenticator) === true;
                            } })];
                case 18:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('D2. disabling last method under enforceMFA -> 400', function () { return sdkNonAdmin.api.users.configure_MFA({ disable: true, method: 'authenticator' }); }, { shouldError: true, onError: function (e) { return e.statusCode === 400 || /at least one/i.test(e.message || ''); } })];
                case 19:
                    _c.sent();
                    return [4 /*yield*/, sdk.api.organizations.updateOne(businessId, { enforceMFA: false })];
                case 20:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 250)];
                case 21:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('D3. disable authenticator (enforceMFA off) succeeds', function () { return sdkNonAdmin.api.users.configure_MFA({ disable: true, method: 'authenticator' }); }, { shouldError: false, onResult: function (r) {
                                var _a, _b, _c, _d;
                                if (r.authToken)
                                    sdkNonAdmin.handle_new_session(__assign(__assign({}, r.user), { authToken: r.authToken }));
                                return !((_b = (_a = r.user) === null || _a === void 0 ? void 0 : _a.mfa) === null || _b === void 0 ? void 0 : _b.authenticator) && !((_d = (_c = r.user) === null || _c === void 0 ? void 0 : _c.mfa) === null || _d === void 0 ? void 0 : _d.email);
                            } })];
                case 22:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('D4. user record mfa cleared', function () { return sdk.api.users.getOne(nonAdminId); }, { shouldError: false, onResult: function (u) { var _a, _b; return !((_a = u.mfa) === null || _a === void 0 ? void 0 : _a.authenticator) && !((_b = u.mfa) === null || _b === void 0 ? void 0 : _b.email); } })
                        // TOTP secret deleted with the method: a still-valid-looking code must no longer verify
                    ];
                case 23:
                    _c.sent();
                    // TOTP secret deleted with the method: a still-valid-looking code must no longer verify
                    return [4 /*yield*/, wait_for_fresh_totp_step()];
                case 24:
                    // TOTP secret deleted with the method: a still-valid-looking code must no longer verify
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 600)]; // submit rate limit is 1/500ms
                case 25:
                    _c.sent(); // submit rate limit is 1/500ms
                    return [4 /*yield*/, (0, testing_1.async_test)('D5. TOTP submit after disable -> 401 (secret deleted)', function () { return sdkNonAdmin.api.users.submit_MFA_challenge({ code: compute_totp_code(totpSecret) }); }, { shouldError: true, onError: function (e) { return e.statusCode === 401 || /invalid/i.test(e.message || ''); } })
                        // ============================================================
                        // E. allowedMFAMethods restriction gating + grace
                        // ============================================================
                    ];
                case 26:
                    _c.sent();
                    // ============================================================
                    // E. allowedMFAMethods restriction gating + grace
                    // ============================================================
                    (0, testing_1.log_header)("E. allowedMFAMethods gating");
                    return [4 /*yield*/, set_allowed_mfa_methods(['authenticator'])];
                case 27:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('E1. restricted to authenticator: enabling email MFA -> 403', function () { return sdkNonAdmin.api.users.configure_MFA({}); }, { shouldError: true, onError: function (e) { return e.statusCode === 403 || /not permitted/i.test(e.message || ''); } })];
                case 28:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('E2. restricted to authenticator + email unconfigured: email challenge -> 403', function () { return sdkNonAdmin.api.users.generate_MFA_challenge({ method: 'email' }); }, { shouldError: true, onError: function (e) { return e.statusCode === 403 || /not permitted/i.test(e.message || ''); } })];
                case 29:
                    _c.sent();
                    return [4 /*yield*/, set_allowed_mfa_methods(['email'])];
                case 30:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('E3. restricted to email: begin_TOTP_configuration -> 403', function () { return sdkNonAdmin.api.users.begin_TOTP_configuration({}); }, { shouldError: true, onError: function (e) { return e.statusCode === 403 || /not permitted/i.test(e.message || ''); } })];
                case 31:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('E4. restricted to email: enabling email MFA succeeds (first method -> 10 recovery codes)', function () { return sdkNonAdmin.api.users.configure_MFA({}); }, { shouldError: false, onResult: function (r) {
                                var _a, _b, _c;
                                if (r.authToken)
                                    sdkNonAdmin.handle_new_session(__assign(__assign({}, r.user), { authToken: r.authToken }));
                                return ((_a = r.recoveryCodes) === null || _a === void 0 ? void 0 : _a.length) === 10 && ((_c = (_b = r.user) === null || _b === void 0 ? void 0 : _b.mfa) === null || _c === void 0 ? void 0 : _c.email) === true;
                            } })
                        // grace: email is configured, then the user is restricted to authenticator-only —
                        // the already-configured email method must keep working (no lockout)
                    ];
                case 32:
                    _c.sent();
                    // grace: email is configured, then the user is restricted to authenticator-only —
                    // the already-configured email method must keep working (no lockout)
                    return [4 /*yield*/, set_allowed_mfa_methods(['authenticator'])];
                case 33:
                    // grace: email is configured, then the user is restricted to authenticator-only —
                    // the already-configured email method must keep working (no lockout)
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('E5. grace: configured email challenge still works after restriction', function () { return sdkNonAdmin.api.users.generate_MFA_challenge({ method: 'email' }); }, { shouldError: false, onResult: function () { return true; } })
                        // cleanup E: clear restriction + disable email
                    ];
                case 34:
                    _c.sent();
                    // cleanup E: clear restriction + disable email
                    return [4 /*yield*/, clear_allowed_mfa_methods()];
                case 35:
                    // cleanup E: clear restriction + disable email
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('E6. cleanup: disable email', function () { return sdkNonAdmin.api.users.configure_MFA({ disable: true, method: 'email' }); }, { shouldError: false, onResult: function (r) {
                                if (r.authToken)
                                    sdkNonAdmin.handle_new_session(__assign(__assign({}, r.user), { authToken: r.authToken }));
                                return true;
                            } })
                        // ============================================================
                        // F. allowedMFAMethods is admin-only
                        // ============================================================
                    ];
                case 36:
                    _c.sent();
                    // ============================================================
                    // F. allowedMFAMethods is admin-only
                    // ============================================================
                    (0, testing_1.log_header)("F. allowedMFAMethods admin gate");
                    return [4 /*yield*/, (0, testing_1.async_test)('F1. non-admin cannot update allowedMFAMethods', function () { return sdkNonAdmin.api.users.updateOne(nonAdminId, { allowedMFAMethods: ['email'] }, { replaceObjectFields: true }); }, { shouldError: true, onError: function (e) { return /admin/i.test(e.message || '') || e.statusCode === 400 || e.statusCode === 403; } })];
                case 37:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('F2. admin can update allowedMFAMethods', function () { return sdk.api.users.updateOne(nonAdminId, { allowedMFAMethods: ['email'] }, { replaceObjectFields: true }); }, { shouldError: false, onResult: function () { return true; } })];
                case 38:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 250)];
                case 39:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('F3. allowedMFAMethods persisted', function () { return sdk.api.users.getOne(nonAdminId); }, { shouldError: false, onResult: function (u) { return JSON.stringify(u.allowedMFAMethods) === JSON.stringify(['email']); } })];
                case 40:
                    _c.sent();
                    return [4 /*yield*/, clear_allowed_mfa_methods()
                        // ============================================================
                        // G. Brute-force rate limit (runs last: exhausts the 10/10min submit bucket)
                        // ============================================================
                    ];
                case 41:
                    _c.sent();
                    // ============================================================
                    // G. Brute-force rate limit (runs last: exhausts the 10/10min submit bucket)
                    // ============================================================
                    (0, testing_1.log_header)("G. Brute-force rate limit");
                    saw429 = false;
                    i = 0;
                    _c.label = 42;
                case 42:
                    if (!(i < 12 && !saw429)) return [3 /*break*/, 48];
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 600)]; // stay under the 1/500ms bucket so only the 10/10min bucket trips
                case 43:
                    _c.sent(); // stay under the 1/500ms bucket so only the 10/10min bucket trips
                    _c.label = 44;
                case 44:
                    _c.trys.push([44, 46, , 47]);
                    return [4 /*yield*/, sdkNonAdmin.api.users.submit_MFA_challenge({ code: '123456' })];
                case 45:
                    _c.sent();
                    return [3 /*break*/, 47];
                case 46:
                    e_1 = _c.sent();
                    if (e_1.statusCode === 429 || /rate limit/i.test(e_1.message || ''))
                        saw429 = true;
                    return [3 /*break*/, 47];
                case 47:
                    i++;
                    return [3 /*break*/, 42];
                case 48:
                    (0, testing_1.assert)(saw429, 'expected 429 from repeated bad MFA submissions', 'G1. repeated bad codes hit 10/10min rate limit');
                    return [3 /*break*/, 51];
                case 49: return [4 /*yield*/, reset_mfa_state()];
                case 50:
                    _c.sent();
                    return [7 /*endfinally*/];
                case 51: return [2 /*return*/];
            }
        });
    });
};
exports.totp_mfa_tests = totp_mfa_tests;
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
                    return [4 /*yield*/, (0, exports.totp_mfa_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ TOTP MFA test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ TOTP MFA test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=totp_mfa.test.js.map