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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
require('source-map-support').install();
import { Session } from "../../sdk";
import { async_test, log_header, assert, wait, } from "@tellescope/testing";
import { setup_tests } from "../setup";
var host = process.env.API_URL || 'http://localhost:8080';
var RAND = function () { return Math.random().toString(36).slice(2, 10); };
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
var passOnAnyResult = { shouldError: false, onResult: function () { return true; } };
export var account_switcher_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var adminId, nonAdminId, adminEmail, nonAdminEmail, nonAdminBusinessId, adminBusinessId, NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD, get_user, __lac_resetCounter, sanitize_marker_tags, set_linkedAccountAccess, clear_linkedAccountAccess, cleanup_marker_tags, ensureOrgToggleEnabled, emailRejectMatcher, seedEmail, createdSeedUserId, _b, adminAfterRequest, pendingFromNonAdmin, fakeEntry, validatorRejectMatcher, mutations, _loop_1, _i, mutations_1, _c, label, mutated, adminWithPending, seededPending, unauthedSdk, is401Rejection, unverifiedEmail, unverifiedUserId, created, _d, _e, adminPre, preLen, adminBeforeAccept, pendingEntry, adminWithReq, pendingForNonAdmin, nonAdminAfterReq, pendingFromAdmin, i, _f, adminForF, pendingForF, _g, adminPendingState, pendingNA, switchedToken, switchedUser, decoded, switchedSdk, originalAdminFname, g6EnduserId, ce, e_1, _h, state, newPending, oSeedState, oPending, oBefore, oBeforeLen, i4State, i4Pending, i4Accepted, i4Entry, kSeedState, kPending, kSwitchedToken, kSwitchedUser, kSwitchedSdk, kBackToken, kBackDecoded, kBackSdk, userCEmail, userCRecord, userCId, userCToken, sdkC, userCState, pendingForC, aAsBResp, aAsBSdk, aAsBDecoded, chainedToken, chainedDecoded, chainedSdk, _j, lSeedState, lPending, lSwitchResp, lSwitchedSdk, lBackResp, lBackSdk, enduserEmail, enduserRec, enduserAuthToken, sdkAsEnduser, isEnduserRejection, _k, i, _l, _m;
        var _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
        return __generator(this, function (_5) {
            switch (_5.label) {
                case 0:
                    log_header("Account Switcher Tests");
                    adminId = sdk.userInfo.id;
                    nonAdminId = sdkNonAdmin.userInfo.id;
                    adminEmail = sdk.userInfo.email;
                    nonAdminEmail = sdkNonAdmin.userInfo.email;
                    nonAdminBusinessId = sdkNonAdmin.userInfo.businessId;
                    adminBusinessId = sdk.userInfo.businessId;
                    NON_ADMIN_EMAIL = process.env.NON_ADMIN_EMAIL;
                    NON_ADMIN_PASSWORD = process.env.NON_ADMIN_PASSWORD;
                    if (!(NON_ADMIN_EMAIL && NON_ADMIN_PASSWORD)) {
                        throw new Error("NON_ADMIN_EMAIL and NON_ADMIN_PASSWORD must be set to run account_switcher_tests");
                    }
                    get_user = function (s, id) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, s.api.users.getOne(id)
                            // The standard CRUD update path rate-limits identical updates to the same record at
                            // 3/30s (routing.ts:2631). Cleanup PATCHes between sections all carry the same
                            // { linkedAccountAccess: [] } payload and would trip it. Workaround: include a rotating
                            // marker tag so every write has a unique JSON payload. Markers are stripped at end of run.
                        ];
                    }); }); };
                    __lac_resetCounter = 0;
                    sanitize_marker_tags = function (tags) {
                        if (tags === void 0) { tags = []; }
                        return tags.filter(function (t) { return typeof t === 'string' && !t.startsWith('__lac_'); });
                    };
                    set_linkedAccountAccess = function (s, ownerId, entries) { return __awaiter(void 0, void 0, void 0, function () {
                        var me, newTags;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    __lac_resetCounter++;
                                    return [4 /*yield*/, s.api.users.getOne(ownerId)];
                                case 1:
                                    me = _b.sent();
                                    newTags = __spreadArray(__spreadArray([], sanitize_marker_tags((_a = me === null || me === void 0 ? void 0 : me.tags) !== null && _a !== void 0 ? _a : []), true), ["__lac_".concat(__lac_resetCounter)], false);
                                    return [4 /*yield*/, s.api.users.updateOne(ownerId, {
                                            linkedAccountAccess: entries,
                                            tags: newTags,
                                        }, { replaceObjectFields: true })];
                                case 2:
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    clear_linkedAccountAccess = function (s, ownerId) { return __awaiter(void 0, void 0, void 0, function () {
                        var me;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, s.api.users.getOne(ownerId)];
                                case 1:
                                    me = _b.sent();
                                    if (!(((_a = me === null || me === void 0 ? void 0 : me.linkedAccountAccess) !== null && _a !== void 0 ? _a : []).length))
                                        return [2 /*return*/];
                                    return [4 /*yield*/, set_linkedAccountAccess(s, ownerId, [])];
                                case 2:
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    cleanup_marker_tags = function (s, ownerId) { return __awaiter(void 0, void 0, void 0, function () {
                        var me, cleaned, _a;
                        var _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _d.trys.push([0, 4, , 5]);
                                    return [4 /*yield*/, s.api.users.getOne(ownerId)];
                                case 1:
                                    me = _d.sent();
                                    cleaned = sanitize_marker_tags((_b = me === null || me === void 0 ? void 0 : me.tags) !== null && _b !== void 0 ? _b : []);
                                    if (!(((_c = me === null || me === void 0 ? void 0 : me.tags) !== null && _c !== void 0 ? _c : []).length !== cleaned.length)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, s.api.users.updateOne(ownerId, { tags: cleaned }, { replaceObjectFields: true })];
                                case 2:
                                    _d.sent();
                                    _d.label = 3;
                                case 3: return [3 /*break*/, 5];
                                case 4:
                                    _a = _d.sent();
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, clear_linkedAccountAccess(sdk, adminId)];
                case 1:
                    _5.sent();
                    return [4 /*yield*/, clear_linkedAccountAccess(sdkNonAdmin, nonAdminId)
                        // The feature is opt-in per org. Enable it on the test business so the rest of the suite
                        // exercises the feature (the O section below explicitly toggles it off to verify gating).
                    ];
                case 2:
                    _5.sent();
                    ensureOrgToggleEnabled = function () { return __awaiter(void 0, void 0, void 0, function () {
                        var org;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, sdk.api.organizations.getOne(adminBusinessId)];
                                case 1:
                                    org = _a.sent();
                                    if (!((org === null || org === void 0 ? void 0 : org.accountSwitchingEnabled) !== true)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, sdk.api.organizations.updateOne(adminBusinessId, { accountSwitchingEnabled: true })];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, wait(undefined, 250)];
                                case 3:
                                    _a.sent();
                                    _a.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, ensureOrgToggleEnabled()
                        // ============================================================
                        // A. Email immutability
                        // ============================================================
                    ];
                case 3:
                    _5.sent();
                    // ============================================================
                    // A. Email immutability
                    // ============================================================
                    log_header("A. Email immutability");
                    emailRejectMatcher = function (e) { return (e.statusCode === 400
                        || /(updates|disabled|readonly|cannot)/i.test(e.message || '')); };
                    return [4 /*yield*/, async_test('A1. Self PATCH of own email rejected', function () { return sdkNonAdmin.api.users.updateOne(nonAdminId, { email: "evil-".concat(RAND(), "@tellescope.com") }); }, { shouldError: true, onError: emailRejectMatcher })];
                case 4:
                    _5.sent();
                    return [4 /*yield*/, async_test('A2. Admin PATCH of another user email rejected', function () { return sdk.api.users.updateOne(nonAdminId, { email: "admin-rename-".concat(RAND(), "@tellescope.com") }); }, { shouldError: true, onError: emailRejectMatcher })];
                case 5:
                    _5.sent();
                    return [4 /*yield*/, async_test('A3. Admin PATCH of own email rejected', function () { return sdk.api.users.updateOne(adminId, { email: "admin-self-".concat(RAND(), "@tellescope.com") }); }, { shouldError: true, onError: emailRejectMatcher })];
                case 6:
                    _5.sent();
                    return [4 /*yield*/, async_test('A4. verifiedEmail/email unchanged after rejected updates', function () { return get_user(sdk, nonAdminId); }, { shouldError: false, onResult: function (u) { return u.verifiedEmail === true && u.email === nonAdminEmail; } })
                        // A5: email IS settable on user creation
                    ];
                case 7:
                    _5.sent();
                    seedEmail = "seed-".concat(RAND(), "@tellescope.com");
                    createdSeedUserId = '';
                    return [4 /*yield*/, async_test('A5. Admin can set email on user creation', function () { return sdk.api.users.createOne({ email: seedEmail, fname: 'Seed', lname: 'User' }); }, { shouldError: false, onResult: function (u) { createdSeedUserId = u.id; return u.email === seedEmail; } })];
                case 8:
                    _5.sent();
                    if (!createdSeedUserId) return [3 /*break*/, 12];
                    _5.label = 9;
                case 9:
                    _5.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, sdk.api.users.deleteOne(createdSeedUserId)];
                case 10:
                    _5.sent();
                    return [3 /*break*/, 12];
                case 11:
                    _b = _5.sent();
                    return [3 /*break*/, 12];
                case 12:
                    // ============================================================
                    // B. linkedAccountAccess PATCH-self validator
                    // ============================================================
                    log_header("B. linkedAccountAccess PATCH-self validator");
                    // Seed: nonAdmin requests access to admin
                    return [4 /*yield*/, sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })];
                case 13:
                    // Seed: nonAdmin requests access to admin
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 14:
                    _5.sent();
                    return [4 /*yield*/, get_user(sdk, adminId)];
                case 15:
                    adminAfterRequest = _5.sent();
                    pendingFromNonAdmin = ((_o = adminAfterRequest.linkedAccountAccess) !== null && _o !== void 0 ? _o : []).find(function (e) { return e.userId === nonAdminId; });
                    assert(!!pendingFromNonAdmin && pendingFromNonAdmin.status === 'pending', 'no pending entry seeded for B tests', 'B-seed pending entry present');
                    // B14: PATCH self with array unchanged is a no-op
                    return [4 /*yield*/, async_test('B14. PATCH self with linkedAccountAccess unchanged succeeds', function () { return sdk.api.users.updateOne(adminId, { linkedAccountAccess: adminAfterRequest.linkedAccountAccess }, { replaceObjectFields: true }); }, passOnAnyResult)
                        // B5/B6: cannot add entries
                    ];
                case 16:
                    // B14: PATCH self with array unchanged is a no-op
                    _5.sent();
                    fakeEntry = {
                        userId: '000000000000000000000099',
                        email: 'fake@tellescope.com',
                        fname: 'Fake', lname: 'User', orgName: 'Fake Org',
                        status: 'accepted',
                        createdAt: new Date(),
                        requestExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    };
                    validatorRejectMatcher = function (e) { return (e.statusCode === 400
                        || e.statusCode === 404
                        // "No updates provided" fires when unknown fields (e.g. the removed accountAccessGrantedTo) get
                        // stripped by the schema and nothing valid remains — that's a legitimate rejection mechanism.
                        || /(linkedAccountAccess|owner|add entries|mutate|immutable|status can only|legacy|accountAccessGrantedTo|replaced|Could not find|No updates provided)/i.test(e.message || '')); };
                    return [4 /*yield*/, async_test('B5. Cannot add accepted entry via PATCH', function () { var _a; return sdk.api.users.updateOne(adminId, { linkedAccountAccess: __spreadArray(__spreadArray([], ((_a = adminAfterRequest.linkedAccountAccess) !== null && _a !== void 0 ? _a : []), true), [fakeEntry], false) }, { replaceObjectFields: true }); }, { shouldError: true, onError: validatorRejectMatcher })];
                case 17:
                    _5.sent();
                    return [4 /*yield*/, async_test('B6. Cannot add pending entry via PATCH', function () { var _a; return sdk.api.users.updateOne(adminId, { linkedAccountAccess: __spreadArray(__spreadArray([], ((_a = adminAfterRequest.linkedAccountAccess) !== null && _a !== void 0 ? _a : []), true), [__assign(__assign({}, fakeEntry), { status: 'pending' })], false) }, { replaceObjectFields: true }); }, { shouldError: true, onError: validatorRejectMatcher })
                        // B7-B13: cannot mutate immutable fields
                    ];
                case 18:
                    _5.sent();
                    mutations = [
                        ['userId', __assign(__assign({}, pendingFromNonAdmin), { userId: '000000000000000000000099' })],
                        ['email', __assign(__assign({}, pendingFromNonAdmin), { email: 'mutated@tellescope.com' })],
                        ['fname', __assign(__assign({}, pendingFromNonAdmin), { fname: 'MutatedF' })],
                        ['lname', __assign(__assign({}, pendingFromNonAdmin), { lname: 'MutatedL' })],
                        ['orgName', __assign(__assign({}, pendingFromNonAdmin), { orgName: 'MutatedOrg' })],
                        ['createdAt', __assign(__assign({}, pendingFromNonAdmin), { createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) })],
                        ['requestExpiresAt', __assign(__assign({}, pendingFromNonAdmin), { requestExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) })],
                    ];
                    _loop_1 = function (label, mutated) {
                        return __generator(this, function (_6) {
                            switch (_6.label) {
                                case 0: return [4 /*yield*/, async_test("B7-13. Cannot mutate linkedAccountAccess entry ".concat(label), function () { return sdk.api.users.updateOne(adminId, { linkedAccountAccess: [mutated] }, { replaceObjectFields: true }); }, { shouldError: true, onError: validatorRejectMatcher })];
                                case 1:
                                    _6.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, mutations_1 = mutations;
                    _5.label = 19;
                case 19:
                    if (!(_i < mutations_1.length)) return [3 /*break*/, 22];
                    _c = mutations_1[_i], label = _c[0], mutated = _c[1];
                    return [5 /*yield**/, _loop_1(label, mutated)];
                case 20:
                    _5.sent();
                    _5.label = 21;
                case 21:
                    _i++;
                    return [3 /*break*/, 19];
                case 22: 
                // B3: pending -> accepted allowed
                return [4 /*yield*/, async_test('B3. Owner can flip pending -> accepted', function () { return set_linkedAccountAccess(sdk, adminId, [__assign(__assign({}, pendingFromNonAdmin), { status: 'accepted' })]); }, passOnAnyResult)
                    // B4: accepted -> pending rejected
                ];
                case 23:
                    // B3: pending -> accepted allowed
                    _5.sent();
                    // B4: accepted -> pending rejected
                    return [4 /*yield*/, async_test('B4. Cannot flip accepted -> pending', function () { return set_linkedAccountAccess(sdk, adminId, [__assign(__assign({}, pendingFromNonAdmin), { status: 'pending' })]); }, { shouldError: true, onError: validatorRejectMatcher })
                        // B11/B12: non-owner PATCH of another user's linkedAccountAccess. Use a NON-empty
                        // payload so the rate-limit key is unique from later admin-owned `[]` clears.
                    ];
                case 24:
                    // B4: accepted -> pending rejected
                    _5.sent();
                    // B11/B12: non-owner PATCH of another user's linkedAccountAccess. Use a NON-empty
                    // payload so the rate-limit key is unique from later admin-owned `[]` clears.
                    return [4 /*yield*/, async_test('B11/B12. Non-owner PATCH of another user linkedAccountAccess rejected', function () { return sdkNonAdmin.api.users.updateOne(adminId, { linkedAccountAccess: [__assign(__assign({}, pendingFromNonAdmin), { status: 'accepted' })] }, { replaceObjectFields: true }); }, { shouldError: true, onError: validatorRejectMatcher })
                        // B15: legacy field no longer accepted
                    ];
                case 25:
                    // B11/B12: non-owner PATCH of another user's linkedAccountAccess. Use a NON-empty
                    // payload so the rate-limit key is unique from later admin-owned `[]` clears.
                    _5.sent();
                    // B15: legacy field no longer accepted
                    return [4 /*yield*/, async_test('B15. Legacy accountAccessGrantedTo PATCH is rejected', function () { return sdk.api.users.updateOne(adminId, { accountAccessGrantedTo: [nonAdminId] }); }, { shouldError: true, onError: validatorRejectMatcher })
                        // B1: Owner can remove a pending entry (re-seed first)
                    ];
                case 26:
                    // B15: legacy field no longer accepted
                    _5.sent();
                    // B1: Owner can remove a pending entry (re-seed first)
                    return [4 /*yield*/, clear_linkedAccountAccess(sdk, adminId)];
                case 27:
                    // B1: Owner can remove a pending entry (re-seed first)
                    _5.sent();
                    return [4 /*yield*/, sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })];
                case 28:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 29:
                    _5.sent();
                    return [4 /*yield*/, async_test('B1. Owner can remove a pending entry', function () { return set_linkedAccountAccess(sdk, adminId, []); }, passOnAnyResult)
                        // B2: Owner can remove an accepted entry
                    ];
                case 30:
                    _5.sent();
                    // B2: Owner can remove an accepted entry
                    return [4 /*yield*/, sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })];
                case 31:
                    // B2: Owner can remove an accepted entry
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 32:
                    _5.sent();
                    return [4 /*yield*/, get_user(sdk, adminId)];
                case 33:
                    adminWithPending = _5.sent();
                    seededPending = ((_p = adminWithPending.linkedAccountAccess) !== null && _p !== void 0 ? _p : []).find(function (e) { return e.userId === nonAdminId; });
                    return [4 /*yield*/, set_linkedAccountAccess(sdk, adminId, [__assign(__assign({}, seededPending), { status: 'accepted' })])];
                case 34:
                    _5.sent();
                    return [4 /*yield*/, async_test('B2. Owner can remove an accepted entry', function () { return set_linkedAccountAccess(sdk, adminId, []); }, passOnAnyResult)
                        // ============================================================
                        // C. request_linked_account_access
                        // ============================================================
                    ];
                case 35:
                    _5.sent();
                    // ============================================================
                    // C. request_linked_account_access
                    // ============================================================
                    log_header("C. request_linked_account_access");
                    unauthedSdk = new Session({ host: host });
                    is401Rejection = function (e) { return ((e === null || e === void 0 ? void 0 : e.statusCode) === 401
                        || (typeof e === 'string' && /^unauthenticated$/i.test(e))
                        || /^unauthenticated$/i.test((e === null || e === void 0 ? void 0 : e.message) || '')); };
                    return [4 /*yield*/, async_test('C1. Unauthenticated request returns 401', function () { return unauthedSdk.api.users.request_linked_account_access({ targetEmail: adminEmail }); }, { shouldError: true, onError: is401Rejection })];
                case 36:
                    _5.sent();
                    return [4 /*yield*/, async_test('C2. Non-existent email returns {} (no error)', function () { return sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: "nobody-".concat(RAND(), "@tellescope.example") }); }, passOnAnyResult)];
                case 37:
                    _5.sent();
                    return [4 /*yield*/, async_test('C2. No record written for non-existent email', function () { return get_user(sdk, adminId); }, { shouldError: false, onResult: function (u) { var _a; return ((_a = u.linkedAccountAccess) !== null && _a !== void 0 ? _a : []).length === 0; } })
                        // C3: unverified email -> treated as no-match. Verify via admin-created user.
                    ];
                case 38:
                    _5.sent();
                    unverifiedEmail = "unverified-".concat(RAND(), "@tellescope.com");
                    unverifiedUserId = '';
                    _5.label = 39;
                case 39:
                    _5.trys.push([39, 41, , 42]);
                    return [4 /*yield*/, sdk.api.users.createOne({ email: unverifiedEmail, fname: 'Unv', lname: 'User' })];
                case 40:
                    created = _5.sent();
                    unverifiedUserId = created.id;
                    return [3 /*break*/, 42];
                case 41:
                    _d = _5.sent();
                    return [3 /*break*/, 42];
                case 42: return [4 /*yield*/, async_test('C3. Unverified email treated as no-match', function () { return sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: unverifiedEmail }); }, passOnAnyResult)];
                case 43:
                    _5.sent();
                    if (!unverifiedUserId) return [3 /*break*/, 48];
                    return [4 /*yield*/, async_test('C3. No record written on unverified target', function () { return get_user(sdk, unverifiedUserId); }, { shouldError: false, onResult: function (u) { var _a; return ((_a = u.linkedAccountAccess) !== null && _a !== void 0 ? _a : []).length === 0; } })];
                case 44:
                    _5.sent();
                    _5.label = 45;
                case 45:
                    _5.trys.push([45, 47, , 48]);
                    return [4 /*yield*/, sdk.api.users.deleteOne(unverifiedUserId)];
                case 46:
                    _5.sent();
                    return [3 /*break*/, 48];
                case 47:
                    _e = _5.sent();
                    return [3 /*break*/, 48];
                case 48: 
                // C5: self-request
                return [4 /*yield*/, async_test('C5. Self-request returns {} and writes nothing', function () { return sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: nonAdminEmail }); }, passOnAnyResult)];
                case 49:
                    // C5: self-request
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 50:
                    _5.sent();
                    return [4 /*yield*/, async_test('C5. No record written on self-request', function () { return get_user(sdkNonAdmin, nonAdminId); }, { shouldError: false, onResult: function (u) { var _a; return ((_a = u.linkedAccountAccess) !== null && _a !== void 0 ? _a : []).length === 0; } })
                        // C4: valid match
                    ];
                case 51:
                    _5.sent();
                    // C4: valid match
                    return [4 /*yield*/, async_test('C4. Valid email request returns {}', function () { return sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail }); }, passOnAnyResult)];
                case 52:
                    // C4: valid match
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 53:
                    _5.sent();
                    return [4 /*yield*/, async_test('C4. Pending entry written with requester snapshot', function () { return get_user(sdk, adminId); }, { shouldError: false, onResult: function (u) {
                                var _a;
                                var e = ((_a = u.linkedAccountAccess) !== null && _a !== void 0 ? _a : []).find(function (x) { return x.userId === nonAdminId; });
                                if (!e)
                                    return false;
                                var expiresOk = (new Date(e.requestExpiresAt).getTime() - Date.now()) > 6 * 24 * 60 * 60 * 1000;
                                return e.status === 'pending' && e.email === nonAdminEmail && !!e.createdAt && expiresOk;
                            } })
                        // C6: idempotent
                    ];
                case 54:
                    _5.sent();
                    return [4 /*yield*/, get_user(sdk, adminId)];
                case 55:
                    adminPre = _5.sent();
                    preLen = ((_q = adminPre.linkedAccountAccess) !== null && _q !== void 0 ? _q : []).length;
                    return [4 /*yield*/, sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })];
                case 56:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 57:
                    _5.sent();
                    return [4 /*yield*/, async_test('C6. Duplicate request inside window does not duplicate the entry', function () { return get_user(sdk, adminId); }, { shouldError: false, onResult: function (u) { var _a; return ((_a = u.linkedAccountAccess) !== null && _a !== void 0 ? _a : []).length === preLen; } })
                        // C7: existing accepted -> no-op
                    ];
                case 58:
                    _5.sent();
                    return [4 /*yield*/, get_user(sdk, adminId)];
                case 59:
                    adminBeforeAccept = _5.sent();
                    pendingEntry = ((_r = adminBeforeAccept.linkedAccountAccess) !== null && _r !== void 0 ? _r : []).find(function (e) { return e.userId === nonAdminId; });
                    return [4 /*yield*/, set_linkedAccountAccess(sdk, adminId, [__assign(__assign({}, pendingEntry), { status: 'accepted' })])];
                case 60:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 61:
                    _5.sent();
                    return [4 /*yield*/, sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })];
                case 62:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 63:
                    _5.sent();
                    return [4 /*yield*/, async_test('C7. Re-requesting on accepted entry is a no-op', function () { return get_user(sdk, adminId); }, { shouldError: false, onResult: function (u) {
                                var _a;
                                var entries = ((_a = u.linkedAccountAccess) !== null && _a !== void 0 ? _a : []);
                                var e = entries.find(function (x) { return x.userId === nonAdminId; });
                                return entries.length === 1 && (e === null || e === void 0 ? void 0 : e.status) === 'accepted';
                            } })
                        // Reset
                    ];
                case 64:
                    _5.sent();
                    // Reset
                    return [4 /*yield*/, clear_linkedAccountAccess(sdk, adminId)
                        // C9: email case-insensitivity (whitespace is rejected at the schema validator;
                        // case-insensitive matching happens after emailValidator lowercases the input).
                    ];
                case 65:
                    // Reset
                    _5.sent();
                    // C9: email case-insensitivity (whitespace is rejected at the schema validator;
                    // case-insensitive matching happens after emailValidator lowercases the input).
                    return [4 /*yield*/, sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail.toUpperCase() })];
                case 66:
                    // C9: email case-insensitivity (whitespace is rejected at the schema validator;
                    // case-insensitive matching happens after emailValidator lowercases the input).
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 67:
                    _5.sent();
                    return [4 /*yield*/, async_test('C9. Email case-insensitive matching', function () { return get_user(sdk, adminId); }, { shouldError: false, onResult: function (u) { var _a; return ((_a = u.linkedAccountAccess) !== null && _a !== void 0 ? _a : []).some(function (e) { return e.userId === nonAdminId; }); } })
                        // C10 is the request_linked_account_access rate-limit test. Because it exhausts admin's
                        // `request-linked-${adminId}` counter for 60s, and E5/E6/E7 setup needs admin to send a
                        // single request_linked_account_access (to be the source-side in the role-flipped lockout
                        // tests), C10 is intentionally relocated to the bottom of the suite (after I4) so no
                        // downstream test depends on admin's request_linked quota.
                        // ============================================================
                        // D. get_linked_accounts
                        // ============================================================
                    ];
                case 68:
                    _5.sent();
                    // C10 is the request_linked_account_access rate-limit test. Because it exhausts admin's
                    // `request-linked-${adminId}` counter for 60s, and E5/E6/E7 setup needs admin to send a
                    // single request_linked_account_access (to be the source-side in the role-flipped lockout
                    // tests), C10 is intentionally relocated to the bottom of the suite (after I4) so no
                    // downstream test depends on admin's request_linked quota.
                    // ============================================================
                    // D. get_linked_accounts
                    // ============================================================
                    log_header("D. get_linked_accounts");
                    return [4 /*yield*/, clear_linkedAccountAccess(sdk, adminId)];
                case 69:
                    _5.sent();
                    return [4 /*yield*/, sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })];
                case 70:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 71:
                    _5.sent();
                    return [4 /*yield*/, get_user(sdk, adminId)];
                case 72:
                    adminWithReq = _5.sent();
                    pendingForNonAdmin = ((_s = adminWithReq.linkedAccountAccess) !== null && _s !== void 0 ? _s : []).find(function (e) { return e.userId === nonAdminId; });
                    return [4 /*yield*/, async_test('D2. Pending entry not returned', function () { return sdkNonAdmin.api.users.get_linked_accounts(); }, { shouldError: false, onResult: function (r) { var _a; return !((_a = r.linkedAccounts) !== null && _a !== void 0 ? _a : []).some(function (a) { return a.id === adminId; }); } })];
                case 73:
                    _5.sent();
                    return [4 /*yield*/, set_linkedAccountAccess(sdk, adminId, [__assign(__assign({}, pendingForNonAdmin), { status: 'accepted' })])];
                case 74:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 75:
                    _5.sent();
                    return [4 /*yield*/, async_test('D1. Accepted entry is returned', function () { return sdkNonAdmin.api.users.get_linked_accounts(); }, { shouldError: false, onResult: function (r) { var _a; return ((_a = r.linkedAccounts) !== null && _a !== void 0 ? _a : []).some(function (a) { return a.id === adminId; }); } })];
                case 76:
                    _5.sent();
                    return [4 /*yield*/, async_test('D5. Returned row has expected identity fields', function () { return sdkNonAdmin.api.users.get_linked_accounts(); }, { shouldError: false, onResult: function (r) {
                                var _a;
                                var row = ((_a = r.linkedAccounts) !== null && _a !== void 0 ? _a : []).find(function (a) { return a.id === adminId; });
                                return !!row && typeof row.email === 'string' && row.email.length > 0 && typeof row.orgName === 'string' && typeof row.requiresMFA === 'boolean';
                            } })];
                case 77:
                    _5.sent();
                    return [4 /*yield*/, async_test('D3. Self is excluded', function () { return sdkNonAdmin.api.users.get_linked_accounts(); }, { shouldError: false, onResult: function (r) { var _a; return !((_a = r.linkedAccounts) !== null && _a !== void 0 ? _a : []).some(function (a) { return a.id === nonAdminId; }); } })];
                case 78:
                    _5.sent();
                    return [4 /*yield*/, async_test('D6. Empty result for caller with no grants directed at them', function () { return sdk.api.users.get_linked_accounts(); }, { shouldError: false, onResult: function (r) { return Array.isArray(r.linkedAccounts) && r.linkedAccounts.length === 0; } })
                        // ============================================================
                        // E. switch_account — grant + accessibility
                        // ============================================================
                    ];
                case 79:
                    _5.sent();
                    // ============================================================
                    // E. switch_account — grant + accessibility
                    // ============================================================
                    log_header("E. switch_account — grant + accessibility");
                    return [4 /*yield*/, clear_linkedAccountAccess(sdk, adminId)];
                case 80:
                    _5.sent();
                    return [4 /*yield*/, async_test('E1. No entry -> 403', function () { return sdkNonAdmin.api.users.switch_account({ targetUserId: adminId }); }, { shouldError: true, onError: function (e) { return e.statusCode === 403 || (e.message || '').includes('not granted'); } })];
                case 81:
                    _5.sent();
                    return [4 /*yield*/, sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })];
                case 82:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 83:
                    _5.sent();
                    return [4 /*yield*/, async_test('E2. Only pending -> 403', function () { return sdkNonAdmin.api.users.switch_account({ targetUserId: adminId }); }, { shouldError: true, onError: function (e) { return e.statusCode === 403 || (e.message || '').includes('not granted'); } })];
                case 84:
                    _5.sent();
                    return [4 /*yield*/, async_test('E3. Self-switch -> 400', function () { return sdkNonAdmin.api.users.switch_account({ targetUserId: nonAdminId }); }, { shouldError: true, onError: function (e) { return e.statusCode === 400 || (e.message || '').includes('own account'); } })];
                case 85:
                    _5.sent();
                    return [4 /*yield*/, async_test('E4. Nonexistent target -> 404', function () { return sdkNonAdmin.api.users.switch_account({ targetUserId: '000000000000000000000000' }); }, { shouldError: true, onError: function (e) { return e.statusCode === 404 || (e.message || '').includes('not found'); } })
                        // E9. Malformed targetUserId -> 400 (mongoIdStringRequired schema validator)
                    ];
                case 86:
                    _5.sent();
                    // E9. Malformed targetUserId -> 400 (mongoIdStringRequired schema validator)
                    return [4 /*yield*/, async_test('E9. Malformed targetUserId -> 400', function () { return sdkNonAdmin.api.users.switch_account({ targetUserId: 'not-a-mongo-id' }); }, { shouldError: true, onError: function (e) { return e.statusCode === 400 || /(invalid|mongoId|parsing|format)/i.test(e.message || ''); } })
                        // E5/E6/E7. Locked target -> 401. Flip roles: admin (only user who can write locked* fields) is the
                        // SOURCE, nonAdmin is the TARGET. nonAdmin grants admin access first.
                        // Run BEFORE E10's rate-limit exhaustion so admin's switch counter is still fresh here.
                    ];
                case 87:
                    // E9. Malformed targetUserId -> 400 (mongoIdStringRequired schema validator)
                    _5.sent();
                    // E5/E6/E7. Locked target -> 401. Flip roles: admin (only user who can write locked* fields) is the
                    // SOURCE, nonAdmin is the TARGET. nonAdmin grants admin access first.
                    // Run BEFORE E10's rate-limit exhaustion so admin's switch counter is still fresh here.
                    return [4 /*yield*/, clear_linkedAccountAccess(sdkNonAdmin, nonAdminId)];
                case 88:
                    // E5/E6/E7. Locked target -> 401. Flip roles: admin (only user who can write locked* fields) is the
                    // SOURCE, nonAdmin is the TARGET. nonAdmin grants admin access first.
                    // Run BEFORE E10's rate-limit exhaustion so admin's switch counter is still fresh here.
                    _5.sent();
                    return [4 /*yield*/, sdk.api.users.request_linked_account_access({ targetEmail: nonAdminEmail })];
                case 89:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 90:
                    _5.sent();
                    return [4 /*yield*/, get_user(sdkNonAdmin, nonAdminId)];
                case 91:
                    nonAdminAfterReq = _5.sent();
                    pendingFromAdmin = ((_t = nonAdminAfterReq.linkedAccountAccess) !== null && _t !== void 0 ? _t : []).find(function (e) { return e.userId === adminId; });
                    if (!pendingFromAdmin) return [3 /*break*/, 94];
                    return [4 /*yield*/, set_linkedAccountAccess(sdkNonAdmin, nonAdminId, [__assign(__assign({}, pendingFromAdmin), { status: 'accepted' })])];
                case 92:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 93:
                    _5.sent();
                    _5.label = 94;
                case 94: 
                // E5: lockedOutUntil in the future
                return [4 /*yield*/, sdk.api.users.updateOne(nonAdminId, { lockedOutUntil: Date.now() + 60000 })];
                case 95:
                    // E5: lockedOutUntil in the future
                    _5.sent();
                    return [4 /*yield*/, async_test('E5. Target with lockedOutUntil > now -> 401', function () { return sdk.api.users.switch_account({ targetUserId: nonAdminId }); }, { shouldError: true, onError: function (e) { return e.statusCode === 401 || /(locked|not accessible)/i.test(e.message || ''); } })
                        // E6: lockedOutUntil === 0 (indefinite lock)
                    ];
                case 96:
                    _5.sent();
                    // E6: lockedOutUntil === 0 (indefinite lock)
                    return [4 /*yield*/, sdk.api.users.updateOne(nonAdminId, { lockedOutUntil: 0 })];
                case 97:
                    // E6: lockedOutUntil === 0 (indefinite lock)
                    _5.sent();
                    return [4 /*yield*/, async_test('E6. Target with lockedOutUntil === 0 -> 401', function () { return sdk.api.users.switch_account({ targetUserId: nonAdminId }); }, { shouldError: true, onError: function (e) { return e.statusCode === 401 || /(locked|not accessible)/i.test(e.message || ''); } })
                        // E7: failedLoginAttempts >= 10
                    ];
                case 98:
                    _5.sent();
                    // E7: failedLoginAttempts >= 10
                    return [4 /*yield*/, sdk.api.users.updateOne(nonAdminId, { lockedOutUntil: -1, failedLoginAttempts: 10 })];
                case 99:
                    // E7: failedLoginAttempts >= 10
                    _5.sent();
                    return [4 /*yield*/, async_test('E7. Target with failedLoginAttempts >= 10 -> 401', function () { return sdk.api.users.switch_account({ targetUserId: nonAdminId }); }, { shouldError: true, onError: function (e) { return e.statusCode === 401 || /(locked|not accessible|failed login)/i.test(e.message || ''); } })
                        // Restore nonAdmin to a healthy state. Setting lockedOutUntil to 0/future in E5/E6 triggered
                        // deauthenticate_user(nonAdminId) via routing.ts:2742-2752, writing `deauthenticated-${id}`
                        // to cache with the current timestamp. is_logged_in rejects any token whose iat falls within
                        // the 1s slack window after that timestamp — so a re-auth too quickly afterward produces a
                        // token that gets immediately invalidated. Wait > 1s past E6's deauth before re-authing.
                    ];
                case 100:
                    _5.sent();
                    // Restore nonAdmin to a healthy state. Setting lockedOutUntil to 0/future in E5/E6 triggered
                    // deauthenticate_user(nonAdminId) via routing.ts:2742-2752, writing `deauthenticated-${id}`
                    // to cache with the current timestamp. is_logged_in rejects any token whose iat falls within
                    // the 1s slack window after that timestamp — so a re-auth too quickly afterward produces a
                    // token that gets immediately invalidated. Wait > 1s past E6's deauth before re-authing.
                    return [4 /*yield*/, sdk.api.users.updateOne(nonAdminId, { lockedOutUntil: -1, failedLoginAttempts: 0 })];
                case 101:
                    // Restore nonAdmin to a healthy state. Setting lockedOutUntil to 0/future in E5/E6 triggered
                    // deauthenticate_user(nonAdminId) via routing.ts:2742-2752, writing `deauthenticated-${id}`
                    // to cache with the current timestamp. is_logged_in rejects any token whose iat falls within
                    // the 1s slack window after that timestamp — so a re-auth too quickly afterward produces a
                    // token that gets immediately invalidated. Wait > 1s past E6's deauth before re-authing.
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 1500)];
                case 102:
                    _5.sent();
                    return [4 /*yield*/, sdkNonAdmin.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)];
                case 103:
                    _5.sent();
                    return [4 /*yield*/, clear_linkedAccountAccess(sdkNonAdmin, nonAdminId)
                        // E10. switch_account rate limit (20/min). Each failed switch consumes a quota slot
                        // (rate-limit check runs first; source token not invalidated). E5-E7 above already burned
                        // 3 slots from admin's switch-account counter, so prime 17 more to reach the limit, then
                        // assert the next call is 429. Keep this LAST in E — exhausts admin's switch counter.
                    ];
                case 104:
                    _5.sent();
                    i = 0;
                    _5.label = 105;
                case 105:
                    if (!(i < 17)) return [3 /*break*/, 110];
                    _5.label = 106;
                case 106:
                    _5.trys.push([106, 108, , 109]);
                    return [4 /*yield*/, sdk.api.users.switch_account({ targetUserId: '000000000000000000000000' })];
                case 107:
                    _5.sent();
                    return [3 /*break*/, 109];
                case 108:
                    _f = _5.sent();
                    return [3 /*break*/, 109];
                case 109:
                    i++;
                    return [3 /*break*/, 105];
                case 110: return [4 /*yield*/, async_test('E10. Switch beyond 20/min is rate-limited (429)', function () { return sdk.api.users.switch_account({ targetUserId: '000000000000000000000000' }); }, { shouldError: true, onError: function (e) { return e.statusCode === 429 || (e.message || '').toLowerCase().includes('rate'); } })
                    // ============================================================
                    // F. switch_account — enforceMFA gap
                    // ============================================================
                ];
                case 111:
                    _5.sent();
                    // ============================================================
                    // F. switch_account — enforceMFA gap
                    // ============================================================
                    log_header("F. switch_account — enforceMFA gap");
                    // Set up accepted grant: nonAdmin requests, admin accepts. (E section cleared admin's array.)
                    return [4 /*yield*/, clear_linkedAccountAccess(sdk, adminId)];
                case 112:
                    // Set up accepted grant: nonAdmin requests, admin accepts. (E section cleared admin's array.)
                    _5.sent();
                    return [4 /*yield*/, sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })];
                case 113:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 114:
                    _5.sent();
                    return [4 /*yield*/, get_user(sdk, adminId)];
                case 115:
                    adminForF = _5.sent();
                    pendingForF = ((_u = adminForF.linkedAccountAccess) !== null && _u !== void 0 ? _u : []).find(function (e) { return e.userId === nonAdminId; });
                    if (!pendingForF) return [3 /*break*/, 118];
                    return [4 /*yield*/, set_linkedAccountAccess(sdk, adminId, [__assign(__assign({}, pendingForF), { status: 'accepted' })])];
                case 116:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 117:
                    _5.sent();
                    _5.label = 118;
                case 118: 
                // Enable enforceMFA on the test business; admin (target) currently has no MFA configured.
                return [4 /*yield*/, sdk.api.organizations.updateOne(adminBusinessId, { enforceMFA: true })];
                case 119:
                    // Enable enforceMFA on the test business; admin (target) currently has no MFA configured.
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)
                        // F1: target with no MFA but org enforces -> 403
                    ];
                case 120:
                    _5.sent();
                    // F1: target with no MFA but org enforces -> 403
                    return [4 /*yield*/, async_test('F1. enforceMFA on org + target MFA not configured -> 403', function () { return sdkNonAdmin.api.users.switch_account({ targetUserId: adminId }); }, { shouldError: true, onError: function (e) { return e.statusCode === 403 || /(MFA configuration|enforceMFA)/i.test(e.message || ''); } })
                        // F2: admin configures MFA, switch now succeeds — but the switched JWT has requiresMFA: true.
                    ];
                case 121:
                    // F1: target with no MFA but org enforces -> 403
                    _5.sent();
                    // F2: admin configures MFA, switch now succeeds — but the switched JWT has requiresMFA: true.
                    return [4 /*yield*/, sdk.api.users.configure_MFA({ disable: false })];
                case 122:
                    // F2: admin configures MFA, switch now succeeds — but the switched JWT has requiresMFA: true.
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 123:
                    _5.sent();
                    return [4 /*yield*/, async_test('F2. After target configures MFA, switch succeeds and switched JWT has requiresMFA: true', function () { return sdkNonAdmin.api.users.switch_account({ targetUserId: adminId }); }, { shouldError: false, onResult: function (r) {
                                var decoded = decode_jwt(r.authToken);
                                return !!r.authToken && (decoded === null || decoded === void 0 ? void 0 : decoded.requiresMFA) === true;
                            } })
                        // Teardown F: revert enforceMFA first (configure_MFA(disable=true) refuses while enforced),
                        // then disable MFA on admin. Re-auth nonAdmin since its source token was invalidated by F2's switch.
                    ];
                case 124:
                    _5.sent();
                    // Teardown F: revert enforceMFA first (configure_MFA(disable=true) refuses while enforced),
                    // then disable MFA on admin. Re-auth nonAdmin since its source token was invalidated by F2's switch.
                    return [4 /*yield*/, sdk.api.organizations.updateOne(adminBusinessId, { enforceMFA: false })];
                case 125:
                    // Teardown F: revert enforceMFA first (configure_MFA(disable=true) refuses while enforced),
                    // then disable MFA on admin. Re-auth nonAdmin since its source token was invalidated by F2's switch.
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 126:
                    _5.sent();
                    _5.label = 127;
                case 127:
                    _5.trys.push([127, 129, , 130]);
                    return [4 /*yield*/, sdk.api.users.configure_MFA({ disable: true })];
                case 128:
                    _5.sent();
                    return [3 /*break*/, 130];
                case 129:
                    _g = _5.sent();
                    return [3 /*break*/, 130];
                case 130: return [4 /*yield*/, sdkNonAdmin.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)
                    // ============================================================
                    // G. switch_account — JWT + audit
                    // ============================================================
                ];
                case 131:
                    _5.sent();
                    // ============================================================
                    // G. switch_account — JWT + audit
                    // ============================================================
                    log_header("G. switch_account — JWT + audit");
                    // Set up an accepted grant. clear_linkedAccountAccess removes F's accepted entry, which
                    // writes the `grant-revoked-${adminId}-${nonAdminId}` cache key. is_logged_in compares that
                    // key against the new JWT's iat with a 1s slack (accounts for JWT iat second-rounding), so
                    // we must ensure the new grant is minted well past that window or the freshly-switched
                    // token gets rejected as if it were a pre-revocation token. Wait > 1s between the cleanup
                    // and the new switch.
                    return [4 /*yield*/, clear_linkedAccountAccess(sdk, adminId)];
                case 132:
                    // Set up an accepted grant. clear_linkedAccountAccess removes F's accepted entry, which
                    // writes the `grant-revoked-${adminId}-${nonAdminId}` cache key. is_logged_in compares that
                    // key against the new JWT's iat with a 1s slack (accounts for JWT iat second-rounding), so
                    // we must ensure the new grant is minted well past that window or the freshly-switched
                    // token gets rejected as if it were a pre-revocation token. Wait > 1s between the cleanup
                    // and the new switch.
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 1500)];
                case 133:
                    _5.sent();
                    return [4 /*yield*/, sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })];
                case 134:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 135:
                    _5.sent();
                    return [4 /*yield*/, get_user(sdk, adminId)];
                case 136:
                    adminPendingState = _5.sent();
                    pendingNA = ((_v = adminPendingState.linkedAccountAccess) !== null && _v !== void 0 ? _v : []).find(function (e) { return e.userId === nonAdminId; });
                    return [4 /*yield*/, set_linkedAccountAccess(sdk, adminId, [__assign(__assign({}, pendingNA), { status: 'accepted' })])];
                case 137:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 138:
                    _5.sent();
                    switchedToken = '';
                    switchedUser = null;
                    return [4 /*yield*/, async_test('G0. Switch succeeds when accepted grant exists', function () { return sdkNonAdmin.api.users.switch_account({ targetUserId: adminId }); }, { shouldError: false, onResult: function (r) {
                                var _a;
                                switchedToken = r.authToken;
                                switchedUser = r.user;
                                return typeof r.authToken === 'string' && r.authToken.length > 0 && ((_a = r.user) === null || _a === void 0 ? void 0 : _a.id) === adminId;
                            } })];
                case 139:
                    _5.sent();
                    decoded = decode_jwt(switchedToken);
                    assert(!!decoded, 'JWT decode failed', 'G1. JWT decoded');
                    assert((decoded === null || decoded === void 0 ? void 0 : decoded.id) === adminId, "JWT.id ".concat(decoded === null || decoded === void 0 ? void 0 : decoded.id, " != expected ").concat(adminId), 'G1. JWT.id == target');
                    assert((decoded === null || decoded === void 0 ? void 0 : decoded.actorUserId) === nonAdminId, "JWT.actorUserId mismatch", 'G1. JWT.actorUserId == source');
                    assert((decoded === null || decoded === void 0 ? void 0 : decoded.actorEmail) === nonAdminEmail, "JWT.actorEmail mismatch", 'G1. JWT.actorEmail');
                    assert((decoded === null || decoded === void 0 ? void 0 : decoded.actorBusinessId) === nonAdminBusinessId, "JWT.actorBusinessId mismatch", 'G1. JWT.actorBusinessId');
                    return [4 /*yield*/, async_test('G2. Pre-switch nonAdmin token is invalidated', function () { return sdkNonAdmin.test_authenticated(); }, { shouldError: true, onError: function () { return true; } })];
                case 140:
                    _5.sent();
                    switchedSdk = new Session({ host: host });
                    switchedSdk.setAuthToken(switchedToken);
                    switchedSdk.setUserInfo(switchedUser);
                    return [4 /*yield*/, async_test('G3. Switched token authenticates', function () { return switchedSdk.test_authenticated(); }, { shouldError: false, onResult: function (r) { return r === 'Authenticated!'; } })];
                case 141:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 142:
                    _5.sent();
                    return [4 /*yield*/, async_test('G4. user_logs has account_switch event with full info', function () { return sdk.api.user_logs.getOne({ resourceId: adminId, resource: 'users', action: 'update' }); }, { shouldError: false, onResult: function (log) {
                                var _a;
                                var info = (_a = log === null || log === void 0 ? void 0 : log.info) !== null && _a !== void 0 ? _a : {};
                                return (log === null || log === void 0 ? void 0 : log.userId) === nonAdminId
                                    && info.event === 'account_switch'
                                    && info.sourceUserId === nonAdminId
                                    && info.sourceEmail === nonAdminEmail
                                    && info.sourceBusinessId === nonAdminBusinessId
                                    && info.targetUserId === adminId
                                    && info.targetEmail === adminEmail
                                    && info.targetBusinessId === adminBusinessId;
                            } })
                        // G5: downstream user_log under switched session carries actorUserId.
                        // Capture original fname so we can restore it during cleanup — downstream tests
                        // (e.g. Calendar RSVPs) compare userInfo.fname against server-side values.
                    ];
                case 143:
                    _5.sent();
                    originalAdminFname = sdk.userInfo.fname;
                    return [4 /*yield*/, switchedSdk.api.users.updateOne(adminId, { fname: "Switched-".concat(RAND()) })];
                case 144:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 145:
                    _5.sent();
                    return [4 /*yield*/, async_test('G5. Downstream user_log under switched session has actorUserId', function () { return sdk.api.user_logs.getSome({ filter: { resourceId: adminId, resource: 'users', action: 'update' } }); }, { shouldError: false, onResult: function (logs) { return (logs !== null && logs !== void 0 ? logs : []).some(function (l) { return l.actorUserId === nonAdminId && l.userId === adminId; }); } })
                        // G6. PHI-adjacent collection: create an enduser through the switched session and assert
                        // the auto-emitted CRUD user_log carries actorUserId (exercises routing.ts inline insert
                        // path, not just storeUserLog or the users-collection update path).
                    ];
                case 146:
                    _5.sent();
                    g6EnduserId = '';
                    _5.label = 147;
                case 147:
                    _5.trys.push([147, 149, , 150]);
                    return [4 /*yield*/, switchedSdk.api.endusers.createOne({ fname: 'Switch', lname: 'Test', email: "switch-test-".concat(RAND(), "@tellescope.example") })];
                case 148:
                    ce = _5.sent();
                    g6EnduserId = ce.id;
                    return [3 /*break*/, 150];
                case 149:
                    e_1 = _5.sent();
                    return [3 /*break*/, 150];
                case 150: return [4 /*yield*/, wait(undefined, 500)];
                case 151:
                    _5.sent();
                    return [4 /*yield*/, async_test('G6. Downstream enduser create under switched session has actorUserId', function () { return sdk.api.user_logs.getSome({ filter: { resource: 'endusers', action: 'create' } }); }, { shouldError: false, onResult: function (logs) { return (logs !== null && logs !== void 0 ? logs : []).some(function (l) { return l.actorUserId === nonAdminId && l.userId === adminId && (g6EnduserId ? l.resourceId === g6EnduserId : true); }); } })];
                case 152:
                    _5.sent();
                    if (!g6EnduserId) return [3 /*break*/, 156];
                    _5.label = 153;
                case 153:
                    _5.trys.push([153, 155, , 156]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(g6EnduserId)];
                case 154:
                    _5.sent();
                    return [3 /*break*/, 156];
                case 155:
                    _h = _5.sent();
                    return [3 /*break*/, 156];
                case 156:
                    // G7. Cross-org boundary assertion: the switched JWT operates in the TARGET's business.
                    // If a future change ever gates cross-org switching, this assertion will fire.
                    assert((decoded === null || decoded === void 0 ? void 0 : decoded.businessId) === adminBusinessId, "JWT.businessId mismatch (got ".concat(decoded === null || decoded === void 0 ? void 0 : decoded.businessId, ", expected ").concat(adminBusinessId, ")"), 'G7. JWT.businessId == target businessId');
                    // ============================================================
                    // H. Real-time revocation
                    // ============================================================
                    log_header("H. Real-time revocation");
                    return [4 /*yield*/, async_test('H1. Baseline: switched session reads OK', function () { return switchedSdk.test_authenticated(); }, { shouldError: false, onResult: function (r) { return r === 'Authenticated!'; } })
                        // Revoke
                    ];
                case 157:
                    _5.sent();
                    // Revoke
                    return [4 /*yield*/, clear_linkedAccountAccess(sdk, adminId)];
                case 158:
                    // Revoke
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 750)];
                case 159:
                    _5.sent();
                    return [4 /*yield*/, async_test('H2. Switched session 401 after revoke', function () { return switchedSdk.test_authenticated(); }, { shouldError: true, onError: is401Rejection })];
                case 160:
                    _5.sent();
                    return [4 /*yield*/, async_test('H3. Owner own session still works (no over-broad invalidation)', function () { return sdk.test_authenticated(); }, { shouldError: false, onResult: function (r) { return r === 'Authenticated!'; } })
                        // H6. After revoke, a brand-new switch_account attempt is also rejected (covers the
                        // net-new path, complementing H2 which covers the already-minted session path).
                        // nonAdmin's source token from G0 was invalidated by that successful switch; re-auth first.
                    ];
                case 161:
                    _5.sent();
                    // H6. After revoke, a brand-new switch_account attempt is also rejected (covers the
                    // net-new path, complementing H2 which covers the already-minted session path).
                    // nonAdmin's source token from G0 was invalidated by that successful switch; re-auth first.
                    return [4 /*yield*/, sdkNonAdmin.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)];
                case 162:
                    // H6. After revoke, a brand-new switch_account attempt is also rejected (covers the
                    // net-new path, complementing H2 which covers the already-minted session path).
                    // nonAdmin's source token from G0 was invalidated by that successful switch; re-auth first.
                    _5.sent();
                    return [4 /*yield*/, async_test('H6. New switch_account after revoke -> 403', function () { return sdkNonAdmin.api.users.switch_account({ targetUserId: adminId }); }, { shouldError: true, onError: function (e) { return e.statusCode === 403 || (e.message || '').includes('not granted'); } })
                        // H5: reject of pending entry does not write a stale revocation key
                    ];
                case 163:
                    _5.sent();
                    // H5: reject of pending entry does not write a stale revocation key
                    return [4 /*yield*/, sdkNonAdmin.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)];
                case 164:
                    // H5: reject of pending entry does not write a stale revocation key
                    _5.sent();
                    return [4 /*yield*/, sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })];
                case 165:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 166:
                    _5.sent();
                    return [4 /*yield*/, clear_linkedAccountAccess(sdk, adminId)]; // reject pending
                case 167:
                    _5.sent(); // reject pending
                    return [4 /*yield*/, wait(undefined, 250)];
                case 168:
                    _5.sent();
                    return [4 /*yield*/, sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })];
                case 169:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 170:
                    _5.sent();
                    return [4 /*yield*/, get_user(sdk, adminId)];
                case 171:
                    state = _5.sent();
                    newPending = ((_w = state.linkedAccountAccess) !== null && _w !== void 0 ? _w : []).find(function (e) { return e.userId === nonAdminId; });
                    return [4 /*yield*/, set_linkedAccountAccess(sdk, adminId, [__assign(__assign({}, newPending), { status: 'accepted' })])];
                case 172:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 173:
                    _5.sent();
                    return [4 /*yield*/, async_test('H5. New switched session works after a prior reject (no stale revocation)', function () { return sdkNonAdmin.api.users.switch_account({ targetUserId: adminId }); }, { shouldError: false, onResult: function (r) { return typeof r.authToken === 'string' && r.authToken.length > 0; } })];
                case 174:
                    _5.sent();
                    return [4 /*yield*/, sdkNonAdmin.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)
                        // ============================================================
                        // O. Org-toggle gating (accountSwitchingEnabled)
                        // ============================================================
                    ];
                case 175:
                    _5.sent();
                    // ============================================================
                    // O. Org-toggle gating (accountSwitchingEnabled)
                    // ============================================================
                    log_header("O. Org-toggle gating");
                    // Pre-stage an accepted entry while the toggle is ON (it currently is).
                    // Wait > 1s after the cleanup so the (adminId, nonAdminId) revocation key from H sits
                    // clearly before the new switch's iat — is_logged_in's 1s slack would otherwise reject
                    // freshly minted tokens as if they were pre-revocation.
                    return [4 /*yield*/, clear_linkedAccountAccess(sdk, adminId)];
                case 176:
                    // Pre-stage an accepted entry while the toggle is ON (it currently is).
                    // Wait > 1s after the cleanup so the (adminId, nonAdminId) revocation key from H sits
                    // clearly before the new switch's iat — is_logged_in's 1s slack would otherwise reject
                    // freshly minted tokens as if they were pre-revocation.
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 1500)];
                case 177:
                    _5.sent();
                    return [4 /*yield*/, sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })];
                case 178:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 179:
                    _5.sent();
                    return [4 /*yield*/, get_user(sdk, adminId)];
                case 180:
                    oSeedState = _5.sent();
                    oPending = ((_x = oSeedState.linkedAccountAccess) !== null && _x !== void 0 ? _x : []).find(function (e) { return e.userId === nonAdminId; });
                    if (!oPending) return [3 /*break*/, 183];
                    return [4 /*yield*/, set_linkedAccountAccess(sdk, adminId, [__assign(__assign({}, oPending), { status: 'accepted' })])];
                case 181:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 182:
                    _5.sent();
                    _5.label = 183;
                case 183: 
                // Toggle OFF.
                return [4 /*yield*/, sdk.api.organizations.updateOne(adminBusinessId, { accountSwitchingEnabled: false })];
                case 184:
                    // Toggle OFF.
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)
                        // O1. request_linked_account_access silently no-ops while toggle is off.
                    ];
                case 185:
                    _5.sent();
                    return [4 /*yield*/, get_user(sdk, adminId)];
                case 186:
                    oBefore = _5.sent();
                    oBeforeLen = ((_y = oBefore.linkedAccountAccess) !== null && _y !== void 0 ? _y : []).length;
                    return [4 /*yield*/, async_test('O1. request_linked_account_access returns {} while toggle is off', function () { return sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail }); }, { shouldError: false, onResult: function () { return true; } })];
                case 187:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 188:
                    _5.sent();
                    return [4 /*yield*/, async_test('O1. No new record written while toggle is off', function () { return get_user(sdk, adminId); }, { shouldError: false, onResult: function (u) { var _a; return ((_a = u.linkedAccountAccess) !== null && _a !== void 0 ? _a : []).length === oBeforeLen; } })
                        // O2. switch_account on a pre-existing accepted grant -> 403 while toggle is off.
                    ];
                case 189:
                    _5.sent();
                    // O2. switch_account on a pre-existing accepted grant -> 403 while toggle is off.
                    return [4 /*yield*/, async_test('O2. switch_account -> 403 while target org has toggle off', function () { return sdkNonAdmin.api.users.switch_account({ targetUserId: adminId }); }, { shouldError: true, onError: function (e) { return e.statusCode === 403 || /(organization has not enabled|switching)/i.test(e.message || ''); } })
                        // O5. With the toggle off, the SOURCE-org check fires first (before the target check),
                        // so switch_account responds with "Your organization has not enabled..." rather than
                        // "Target organization has not enabled...". Single-org fixture means source==target here;
                        // the error-message assertion is what proves the source-side gate is actually firing
                        // (without it, O2 would have passed under the old target-only implementation too).
                    ];
                case 190:
                    // O2. switch_account on a pre-existing accepted grant -> 403 while toggle is off.
                    _5.sent();
                    // O5. With the toggle off, the SOURCE-org check fires first (before the target check),
                    // so switch_account responds with "Your organization has not enabled..." rather than
                    // "Target organization has not enabled...". Single-org fixture means source==target here;
                    // the error-message assertion is what proves the source-side gate is actually firing
                    // (without it, O2 would have passed under the old target-only implementation too).
                    return [4 /*yield*/, async_test('O5. switch_account error message names the actor org (source-side check fires)', function () { return sdkNonAdmin.api.users.switch_account({ targetUserId: adminId }); }, { shouldError: true, onError: function (e) { return /your organization/i.test(e.message || ''); } })
                        // Toggle ON again.
                    ];
                case 191:
                    // O5. With the toggle off, the SOURCE-org check fires first (before the target check),
                    // so switch_account responds with "Your organization has not enabled..." rather than
                    // "Target organization has not enabled...". Single-org fixture means source==target here;
                    // the error-message assertion is what proves the source-side gate is actually firing
                    // (without it, O2 would have passed under the old target-only implementation too).
                    _5.sent();
                    // Toggle ON again.
                    return [4 /*yield*/, sdk.api.organizations.updateOne(adminBusinessId, { accountSwitchingEnabled: true })];
                case 192:
                    // Toggle ON again.
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)
                        // O3. switch_account now succeeds (same accepted grant as before).
                    ];
                case 193:
                    _5.sent();
                    // O3. switch_account now succeeds (same accepted grant as before).
                    return [4 /*yield*/, async_test('O3. switch_account succeeds once toggle is re-enabled', function () { return sdkNonAdmin.api.users.switch_account({ targetUserId: adminId }); }, { shouldError: false, onResult: function (r) { return typeof r.authToken === 'string' && r.authToken.length > 0; } })
                        // nonAdmin's source token was invalidated by the switch; re-auth for subsequent tests.
                    ];
                case 194:
                    // O3. switch_account now succeeds (same accepted grant as before).
                    _5.sent();
                    // nonAdmin's source token was invalidated by the switch; re-auth for subsequent tests.
                    return [4 /*yield*/, sdkNonAdmin.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)
                        // O4. request_linked_account_access writes a record once toggle is re-enabled.
                    ];
                case 195:
                    // nonAdmin's source token was invalidated by the switch; re-auth for subsequent tests.
                    _5.sent();
                    // O4. request_linked_account_access writes a record once toggle is re-enabled.
                    return [4 /*yield*/, clear_linkedAccountAccess(sdk, adminId)];
                case 196:
                    // O4. request_linked_account_access writes a record once toggle is re-enabled.
                    _5.sent();
                    return [4 /*yield*/, sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })];
                case 197:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 198:
                    _5.sent();
                    return [4 /*yield*/, async_test('O4. request_linked_account_access writes a pending entry once toggle is on', function () { return get_user(sdk, adminId); }, { shouldError: false, onResult: function (u) { var _a; return ((_a = u.linkedAccountAccess) !== null && _a !== void 0 ? _a : []).some(function (e) { return e.userId === nonAdminId && e.status === 'pending'; }); } })
                        // ============================================================
                        // I. Cross-cutting / regressions
                        // ============================================================
                    ];
                case 199:
                    _5.sent();
                    // ============================================================
                    // I. Cross-cutting / regressions
                    // ============================================================
                    log_header("I. Cross-cutting / regressions");
                    return [4 /*yield*/, async_test('I1. Legacy users.updateOne({ accountAccessGrantedTo: [...] }) rejected', function () { return sdk.api.users.updateOne(adminId, { accountAccessGrantedTo: [nonAdminId] }); }, { shouldError: true, onError: function (e) { return e.statusCode === 400 || /(accountAccessGrantedTo|legacy|replaced|No updates provided)/i.test(e.message || ''); } })];
                case 200:
                    _5.sent();
                    return [4 /*yield*/, async_test('I2. After full revoke, get_linked_accounts no longer shows A', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var r;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, clear_linkedAccountAccess(sdk, adminId)];
                                    case 1:
                                        _b.sent();
                                        return [4 /*yield*/, wait(undefined, 250)];
                                    case 2:
                                        _b.sent();
                                        return [4 /*yield*/, sdkNonAdmin.api.users.get_linked_accounts()];
                                    case 3:
                                        r = _b.sent();
                                        return [2 /*return*/, ((_a = r.linkedAccounts) !== null && _a !== void 0 ? _a : []).find(function (a) { return a.id === adminId; })];
                                }
                            });
                        }); }, { shouldError: false, onResult: function (r) { return r === undefined; } })
                        // I4. Accepted-grant expiration semantics — lock in the chosen behavior.
                        // The switch handler does NOT check requestExpiresAt for accepted entries: that field
                        // only governs the *pending* TTL. If this changes, this test will fail; that's the
                        // signal to make the behavior choice deliberately. (Simulating an actually-expired
                        // accepted grant requires either waiting 7 days or mutating requestExpiresAt — the
                        // schema validator blocks the latter, so we lock in the behavior by inspection.)
                        // I2 above did clear_linkedAccountAccess → wait > 1s past the resulting revocation key
                        // before re-granting; otherwise is_logged_in's 1s slack rejects the new switched token.
                    ];
                case 201:
                    _5.sent();
                    // I4. Accepted-grant expiration semantics — lock in the chosen behavior.
                    // The switch handler does NOT check requestExpiresAt for accepted entries: that field
                    // only governs the *pending* TTL. If this changes, this test will fail; that's the
                    // signal to make the behavior choice deliberately. (Simulating an actually-expired
                    // accepted grant requires either waiting 7 days or mutating requestExpiresAt — the
                    // schema validator blocks the latter, so we lock in the behavior by inspection.)
                    // I2 above did clear_linkedAccountAccess → wait > 1s past the resulting revocation key
                    // before re-granting; otherwise is_logged_in's 1s slack rejects the new switched token.
                    return [4 /*yield*/, wait(undefined, 1500)];
                case 202:
                    // I4. Accepted-grant expiration semantics — lock in the chosen behavior.
                    // The switch handler does NOT check requestExpiresAt for accepted entries: that field
                    // only governs the *pending* TTL. If this changes, this test will fail; that's the
                    // signal to make the behavior choice deliberately. (Simulating an actually-expired
                    // accepted grant requires either waiting 7 days or mutating requestExpiresAt — the
                    // schema validator blocks the latter, so we lock in the behavior by inspection.)
                    // I2 above did clear_linkedAccountAccess → wait > 1s past the resulting revocation key
                    // before re-granting; otherwise is_logged_in's 1s slack rejects the new switched token.
                    _5.sent();
                    return [4 /*yield*/, sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })];
                case 203:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 204:
                    _5.sent();
                    return [4 /*yield*/, get_user(sdk, adminId)];
                case 205:
                    i4State = _5.sent();
                    i4Pending = ((_z = i4State.linkedAccountAccess) !== null && _z !== void 0 ? _z : []).find(function (e) { return e.userId === nonAdminId; });
                    if (!i4Pending) return [3 /*break*/, 208];
                    return [4 /*yield*/, set_linkedAccountAccess(sdk, adminId, [__assign(__assign({}, i4Pending), { status: 'accepted' })])];
                case 206:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 207:
                    _5.sent();
                    _5.label = 208;
                case 208: return [4 /*yield*/, get_user(sdk, adminId)];
                case 209:
                    i4Accepted = _5.sent();
                    i4Entry = ((_0 = i4Accepted.linkedAccountAccess) !== null && _0 !== void 0 ? _0 : []).find(function (e) { return e.userId === nonAdminId; });
                    return [4 /*yield*/, async_test('I4. Switch succeeds on a future-dated accepted grant (expiration-ignored semantics locked in by inspection)', function () { return sdkNonAdmin.api.users.switch_account({ targetUserId: adminId }); }, { shouldError: false, onResult: function (r) { return (typeof r.authToken === 'string'
                                && r.authToken.length > 0
                                && !!i4Entry
                                && new Date(i4Entry.requestExpiresAt).getTime() > Date.now()); } })
                        // Re-auth nonAdmin since the switch invalidated its source token
                    ];
                case 210:
                    _5.sent();
                    // Re-auth nonAdmin since the switch invalidated its source token
                    return [4 /*yield*/, sdkNonAdmin.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)
                        // ============================================================
                        // K. Actor-identity model (chained-switch + switch-back semantics)
                        // ============================================================
                        // Premise: the real operator is always the actor (session.actorUserId || session.id).
                        // Grant checks, audit attribution, and request authorship all derive from realActor —
                        // never from the proxy identity. Verified here via:
                        //   - get_linked_accounts returns the actor's grants + the actor's own account (switch-back).
                        //   - Validator rejects ALL linkedAccountAccess writes from switched sessions.
                        //   - request_linked_account_access uses actor's email for self-check (proxy-email no-op
                        //     would otherwise create a self-targeted pending entry).
                        //   - switch_account back to the actor mints a JWT with actor* claims cleared.
                        //   - Audit log for switch-back records event=account_switch_back with proxySessionId.
                    ];
                case 211:
                    // Re-auth nonAdmin since the switch invalidated its source token
                    _5.sent();
                    // ============================================================
                    // K. Actor-identity model (chained-switch + switch-back semantics)
                    // ============================================================
                    // Premise: the real operator is always the actor (session.actorUserId || session.id).
                    // Grant checks, audit attribution, and request authorship all derive from realActor —
                    // never from the proxy identity. Verified here via:
                    //   - get_linked_accounts returns the actor's grants + the actor's own account (switch-back).
                    //   - Validator rejects ALL linkedAccountAccess writes from switched sessions.
                    //   - request_linked_account_access uses actor's email for self-check (proxy-email no-op
                    //     would otherwise create a self-targeted pending entry).
                    //   - switch_account back to the actor mints a JWT with actor* claims cleared.
                    //   - Audit log for switch-back records event=account_switch_back with proxySessionId.
                    log_header("K. Actor-identity model");
                    // Seed an accepted grant so nonAdmin can switch into admin. Wait > 1s past the prior
                    // clear_linkedAccountAccess so is_logged_in's iat-vs-revoked-key slack doesn't trip.
                    return [4 /*yield*/, clear_linkedAccountAccess(sdk, adminId)];
                case 212:
                    // Seed an accepted grant so nonAdmin can switch into admin. Wait > 1s past the prior
                    // clear_linkedAccountAccess so is_logged_in's iat-vs-revoked-key slack doesn't trip.
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 1500)];
                case 213:
                    _5.sent();
                    return [4 /*yield*/, sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })];
                case 214:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 215:
                    _5.sent();
                    return [4 /*yield*/, get_user(sdk, adminId)];
                case 216:
                    kSeedState = _5.sent();
                    kPending = ((_1 = kSeedState.linkedAccountAccess) !== null && _1 !== void 0 ? _1 : []).find(function (e) { return e.userId === nonAdminId; });
                    return [4 /*yield*/, set_linkedAccountAccess(sdk, adminId, [__assign(__assign({}, kPending), { status: 'accepted' })])];
                case 217:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)
                        // K1. Establish a switched session: nonAdmin → admin.
                    ];
                case 218:
                    _5.sent();
                    kSwitchedToken = '';
                    kSwitchedUser = null;
                    return [4 /*yield*/, async_test('K1. nonAdmin switches into admin (sets up actor-identity scenario)', function () { return sdkNonAdmin.api.users.switch_account({ targetUserId: adminId }); }, { shouldError: false, onResult: function (r) {
                                var _a;
                                kSwitchedToken = r.authToken;
                                kSwitchedUser = r.user;
                                return typeof r.authToken === 'string' && r.authToken.length > 0 && ((_a = r.user) === null || _a === void 0 ? void 0 : _a.id) === adminId;
                            } })];
                case 219:
                    _5.sent();
                    kSwitchedSdk = new Session({ host: host });
                    kSwitchedSdk.setAuthToken(kSwitchedToken);
                    kSwitchedSdk.setUserInfo(kSwitchedUser);
                    // K2. get_linked_accounts from a switched session returns the actor's own account first
                    // (the switch-back entry) and excludes the current proxy identity (admin) — querying
                    // against realActor=nonAdmin would normally surface admin (it has nonAdmin: accepted),
                    // but the caller IS already admin so switching there would no-op. K8b separately covers
                    // the case where the list DOES include actor-grants that aren't the current proxy.
                    return [4 /*yield*/, async_test('K2. get_linked_accounts from switched session: actor first, current proxy excluded', function () { return kSwitchedSdk.api.users.get_linked_accounts(); }, { shouldError: false, onResult: function (r) {
                                var _a;
                                var accounts = ((_a = r === null || r === void 0 ? void 0 : r.linkedAccounts) !== null && _a !== void 0 ? _a : []);
                                if (accounts.length === 0)
                                    return false;
                                if (accounts[0].id !== nonAdminId)
                                    return false;
                                // Current proxy (admin) must NOT appear, even though admin granted nonAdmin.
                                var hasSelfProxy = accounts.some(function (a) { return a.id === adminId; });
                                return !hasSelfProxy;
                            } })
                        // K3. Validator rejects ALL linkedAccountAccess PATCHes from a switched session — even
                        // ones the proxy identity (admin = ownerId) would normally be authorized to make. Closes
                        // the self-approval / silent-revoke hole. Use the marker-tag helper to ensure a unique
                        // payload (avoid the 3/30s identical-update rate limit colliding with this case).
                    ];
                case 220:
                    // K2. get_linked_accounts from a switched session returns the actor's own account first
                    // (the switch-back entry) and excludes the current proxy identity (admin) — querying
                    // against realActor=nonAdmin would normally surface admin (it has nonAdmin: accepted),
                    // but the caller IS already admin so switching there would no-op. K8b separately covers
                    // the case where the list DOES include actor-grants that aren't the current proxy.
                    _5.sent();
                    // K3. Validator rejects ALL linkedAccountAccess PATCHes from a switched session — even
                    // ones the proxy identity (admin = ownerId) would normally be authorized to make. Closes
                    // the self-approval / silent-revoke hole. Use the marker-tag helper to ensure a unique
                    // payload (avoid the 3/30s identical-update rate limit colliding with this case).
                    return [4 /*yield*/, async_test('K3. Validator rejects linkedAccountAccess PATCH from switched session', function () { return set_linkedAccountAccess(kSwitchedSdk, adminId, [__assign(__assign({}, kPending), { status: 'accepted' })]); }, { shouldError: true, onError: function (e) { return (e.statusCode === 400
                                || /(switched session|actorUserId|while acting)/i.test(e.message || '')); } })
                        // K4. request_linked_account_access from switched session uses the actor's email for the
                        // self-check. Calling with targetEmail = nonAdminEmail (the actor's own email) → silent
                        // {} and NO write. Old behavior would have used session.email=adminEmail for the self-
                        // check, mismatched, looked up nonAdmin, and created a pending entry on nonAdmin.
                    ];
                case 221:
                    // K3. Validator rejects ALL linkedAccountAccess PATCHes from a switched session — even
                    // ones the proxy identity (admin = ownerId) would normally be authorized to make. Closes
                    // the self-approval / silent-revoke hole. Use the marker-tag helper to ensure a unique
                    // payload (avoid the 3/30s identical-update rate limit colliding with this case).
                    _5.sent();
                    // K4. request_linked_account_access from switched session uses the actor's email for the
                    // self-check. Calling with targetEmail = nonAdminEmail (the actor's own email) → silent
                    // {} and NO write. Old behavior would have used session.email=adminEmail for the self-
                    // check, mismatched, looked up nonAdmin, and created a pending entry on nonAdmin.
                    return [4 /*yield*/, async_test('K4. request_linked_account_access from switched session uses actor email for self-check', function () { return kSwitchedSdk.api.users.request_linked_account_access({ targetEmail: nonAdminEmail }); }, passOnAnyResult)];
                case 222:
                    // K4. request_linked_account_access from switched session uses the actor's email for the
                    // self-check. Calling with targetEmail = nonAdminEmail (the actor's own email) → silent
                    // {} and NO write. Old behavior would have used session.email=adminEmail for the self-
                    // check, mismatched, looked up nonAdmin, and created a pending entry on nonAdmin.
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 223:
                    _5.sent();
                    return [4 /*yield*/, async_test('K4. No pending entry created on actor record (actor identity is the requester)', function () { return get_user(sdk, nonAdminId); }, { shouldError: false, onResult: function (u) { var _a; return !((_a = u.linkedAccountAccess) !== null && _a !== void 0 ? _a : []).length; } })
                        // K5. switch-back: nonAdmin (acting as admin) returns to nonAdmin. No grant lookup
                        // (target === realActor); resulting JWT has all actor* claims cleared.
                    ];
                case 224:
                    _5.sent();
                    kBackToken = '';
                    return [4 /*yield*/, async_test('K5. Switch-back to actor succeeds (no grant lookup required)', function () { return kSwitchedSdk.api.users.switch_account({ targetUserId: nonAdminId }); }, { shouldError: false, onResult: function (r) {
                                var _a;
                                kBackToken = r.authToken;
                                return typeof r.authToken === 'string' && r.authToken.length > 0 && ((_a = r.user) === null || _a === void 0 ? void 0 : _a.id) === nonAdminId;
                            } })];
                case 225:
                    _5.sent();
                    kBackDecoded = decode_jwt(kBackToken);
                    assert((kBackDecoded === null || kBackDecoded === void 0 ? void 0 : kBackDecoded.id) === nonAdminId, "JWT.id ".concat(kBackDecoded === null || kBackDecoded === void 0 ? void 0 : kBackDecoded.id, " != ").concat(nonAdminId), 'K5. JWT.id == actor');
                    assert(!(kBackDecoded === null || kBackDecoded === void 0 ? void 0 : kBackDecoded.actorUserId), "JWT still carries actorUserId=".concat(kBackDecoded === null || kBackDecoded === void 0 ? void 0 : kBackDecoded.actorUserId, " after switch-back"), 'K5. JWT.actorUserId cleared');
                    assert(!(kBackDecoded === null || kBackDecoded === void 0 ? void 0 : kBackDecoded.actorEmail), "JWT still carries actorEmail after switch-back", 'K5. JWT.actorEmail cleared');
                    assert(!(kBackDecoded === null || kBackDecoded === void 0 ? void 0 : kBackDecoded.actorBusinessId), "JWT still carries actorBusinessId after switch-back", 'K5. JWT.actorBusinessId cleared');
                    kBackSdk = new Session({ host: host });
                    kBackSdk.setAuthToken(kBackToken);
                    return [4 /*yield*/, async_test('K5b. Switched-back token authenticates', function () { return kBackSdk.test_authenticated(); }, { shouldError: false, onResult: function (r) { return r === 'Authenticated!'; } })
                        // K6. Audit log for the switch-back: event=account_switch_back, userId=realActor (nonAdmin),
                        // proxySessionId=admin (the proxy identity that issued the request).
                    ];
                case 226:
                    _5.sent();
                    // K6. Audit log for the switch-back: event=account_switch_back, userId=realActor (nonAdmin),
                    // proxySessionId=admin (the proxy identity that issued the request).
                    return [4 /*yield*/, wait(undefined, 500)];
                case 227:
                    // K6. Audit log for the switch-back: event=account_switch_back, userId=realActor (nonAdmin),
                    // proxySessionId=admin (the proxy identity that issued the request).
                    _5.sent();
                    return [4 /*yield*/, async_test('K6. user_logs has account_switch_back event with realActor as userId + proxySessionId', function () { return sdk.api.user_logs.getSome({ filter: { resourceId: nonAdminId, resource: 'users', action: 'update' } }); }, { shouldError: false, onResult: function (logs) { return (logs !== null && logs !== void 0 ? logs : []).some(function (l) {
                                var _a;
                                var info = (_a = l === null || l === void 0 ? void 0 : l.info) !== null && _a !== void 0 ? _a : {};
                                return (l === null || l === void 0 ? void 0 : l.userId) === nonAdminId
                                    && info.event === 'account_switch_back'
                                    && info.sourceUserId === nonAdminId
                                    && info.proxySessionId === adminId
                                    && info.targetUserId === nonAdminId;
                            }); } })
                        // K7. From the now-clean nonAdmin session (kBackSdk, minted by the K5 switch-back),
                        // switching back INTO admin works normally — grant unchanged, chain restarted with no
                        // leftover actor* state. Use kBackSdk because sdkNonAdmin's original token was invalidated
                        // by the K1 switch and we haven't re-authed it yet.
                    ];
                case 228:
                    _5.sent();
                    // K7. From the now-clean nonAdmin session (kBackSdk, minted by the K5 switch-back),
                    // switching back INTO admin works normally — grant unchanged, chain restarted with no
                    // leftover actor* state. Use kBackSdk because sdkNonAdmin's original token was invalidated
                    // by the K1 switch and we haven't re-authed it yet.
                    return [4 /*yield*/, async_test('K7. Clean nonAdmin session can mint a fresh switch into admin (chain restarted)', function () { return kBackSdk.api.users.switch_account({ targetUserId: adminId }); }, { shouldError: false, onResult: function (r) { return typeof r.authToken === 'string' && r.authToken.length > 0; } })
                        // Re-auth nonAdmin: its original token died in K1, and kBackSdk's token died in K7.
                    ];
                case 229:
                    // K7. From the now-clean nonAdmin session (kBackSdk, minted by the K5 switch-back),
                    // switching back INTO admin works normally — grant unchanged, chain restarted with no
                    // leftover actor* state. Use kBackSdk because sdkNonAdmin's original token was invalidated
                    // by the K1 switch and we haven't re-authed it yet.
                    _5.sent();
                    // Re-auth nonAdmin: its original token died in K1, and kBackSdk's token died in K7.
                    return [4 /*yield*/, sdkNonAdmin.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)
                        // ============================================================
                        // K8. Chained switch A→B→C preserves the original actor (not the proxy)
                        // ============================================================
                        // Spec: from a switched A-as-B session, switching to C must mint a JWT with
                        // actorUserId=A — never actorUserId=B. The B hop is a UI affordance and must not become
                        // the new "actor" on subsequent switches. Requires a third user C with a direct grant
                        // from C to A; admin creates C and uses generate_auth_token to bootstrap a C-session
                        // for accepting the grant.
                    ];
                case 230:
                    // Re-auth nonAdmin: its original token died in K1, and kBackSdk's token died in K7.
                    _5.sent();
                    // ============================================================
                    // K8. Chained switch A→B→C preserves the original actor (not the proxy)
                    // ============================================================
                    // Spec: from a switched A-as-B session, switching to C must mint a JWT with
                    // actorUserId=A — never actorUserId=B. The B hop is a UI affordance and must not become
                    // the new "actor" on subsequent switches. Requires a third user C with a direct grant
                    // from C to A; admin creates C and uses generate_auth_token to bootstrap a C-session
                    // for accepting the grant.
                    log_header("K8. Chained switching preserves original actor");
                    userCEmail = "switch-c-".concat(RAND(), "@tellescope.example");
                    return [4 /*yield*/, sdk.api.users.createOne({
                            email: userCEmail,
                            fname: 'Chained',
                            lname: 'Target',
                            notificationEmailsDisabled: true,
                            verifiedEmail: true,
                        })];
                case 231:
                    userCRecord = _5.sent();
                    userCId = userCRecord.id;
                    return [4 /*yield*/, sdk.api.users.generate_auth_token({ id: userCId })];
                case 232:
                    userCToken = (_5.sent()).authToken;
                    sdkC = new Session({ host: host });
                    sdkC.setAuthToken(userCToken);
                    // A (nonAdmin) requests access to C; C accepts (validator requires session.id === ownerId).
                    return [4 /*yield*/, sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: userCEmail })];
                case 233:
                    // A (nonAdmin) requests access to C; C accepts (validator requires session.id === ownerId).
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 234:
                    _5.sent();
                    return [4 /*yield*/, get_user(sdkC, userCId)];
                case 235:
                    userCState = _5.sent();
                    pendingForC = ((_2 = userCState.linkedAccountAccess) !== null && _2 !== void 0 ? _2 : []).find(function (e) { return e.userId === nonAdminId; });
                    assert(!!pendingForC, 'K8 setup: pending entry should exist on C from nonAdmin', 'K8 setup: pending on C');
                    return [4 /*yield*/, set_linkedAccountAccess(sdkC, userCId, [__assign(__assign({}, pendingForC), { status: 'accepted' })])];
                case 236:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)
                        // Establish the A-as-B switched session. The admin→nonAdmin accepted grant from K1 is
                        // still in place (K7's switch consumed a slot but didn't remove the grant).
                    ];
                case 237:
                    _5.sent();
                    return [4 /*yield*/, sdkNonAdmin.api.users.switch_account({ targetUserId: adminId })];
                case 238:
                    aAsBResp = _5.sent();
                    aAsBSdk = new Session({ host: host });
                    aAsBSdk.setAuthToken(aAsBResp.authToken);
                    aAsBSdk.setUserInfo(aAsBResp.user);
                    aAsBDecoded = decode_jwt(aAsBResp.authToken);
                    assert((aAsBDecoded === null || aAsBDecoded === void 0 ? void 0 : aAsBDecoded.id) === adminId && (aAsBDecoded === null || aAsBDecoded === void 0 ? void 0 : aAsBDecoded.actorUserId) === nonAdminId, "K8 setup: A-as-B token should carry id=admin, actorUserId=nonAdmin (got id=".concat(aAsBDecoded === null || aAsBDecoded === void 0 ? void 0 : aAsBDecoded.id, ", actorUserId=").concat(aAsBDecoded === null || aAsBDecoded === void 0 ? void 0 : aAsBDecoded.actorUserId, ")"), 'K8 setup: A-as-B JWT confirmed');
                    chainedToken = '';
                    return [4 /*yield*/, async_test('K8. Chained switch A→B→C succeeds when C granted access to the actor', function () { return aAsBSdk.api.users.switch_account({ targetUserId: userCId }); }, { shouldError: false, onResult: function (r) {
                                var _a;
                                chainedToken = r.authToken;
                                return typeof r.authToken === 'string' && r.authToken.length > 0 && ((_a = r.user) === null || _a === void 0 ? void 0 : _a.id) === userCId;
                            } })];
                case 239:
                    _5.sent();
                    chainedDecoded = decode_jwt(chainedToken);
                    assert((chainedDecoded === null || chainedDecoded === void 0 ? void 0 : chainedDecoded.id) === userCId, "chained JWT.id ".concat(chainedDecoded === null || chainedDecoded === void 0 ? void 0 : chainedDecoded.id, " != ").concat(userCId), 'K8. chained JWT.id == C');
                    assert((chainedDecoded === null || chainedDecoded === void 0 ? void 0 : chainedDecoded.actorUserId) === nonAdminId, "chained JWT.actorUserId is ".concat(chainedDecoded === null || chainedDecoded === void 0 ? void 0 : chainedDecoded.actorUserId, " \u2014 must remain nonAdmin (the original actor), NOT admin (the proxy hop)"), 'K8. chained JWT.actorUserId == A (original actor preserved, NOT B)');
                    assert((chainedDecoded === null || chainedDecoded === void 0 ? void 0 : chainedDecoded.actorEmail) === nonAdminEmail, "chained JWT.actorEmail ".concat(chainedDecoded === null || chainedDecoded === void 0 ? void 0 : chainedDecoded.actorEmail, " != ").concat(nonAdminEmail), 'K8. chained JWT.actorEmail preserved');
                    assert((chainedDecoded === null || chainedDecoded === void 0 ? void 0 : chainedDecoded.actorBusinessId) === nonAdminBusinessId, "chained JWT.actorBusinessId mismatch", 'K8. chained JWT.actorBusinessId preserved');
                    // Audit log: the chained switch's user_log must attribute to the original actor (nonAdmin),
                    // and record proxySessionId=adminId so the B-hop is reconstructable.
                    return [4 /*yield*/, wait(undefined, 500)];
                case 240:
                    // Audit log: the chained switch's user_log must attribute to the original actor (nonAdmin),
                    // and record proxySessionId=adminId so the B-hop is reconstructable.
                    _5.sent();
                    return [4 /*yield*/, async_test('K8. Chained switch audit log attributes to actor with proxySessionId=B', function () { return sdk.api.user_logs.getSome({ filter: { resourceId: userCId, resource: 'users', action: 'update' } }); }, { shouldError: false, onResult: function (logs) { return (logs !== null && logs !== void 0 ? logs : []).some(function (l) {
                                var _a;
                                var info = (_a = l === null || l === void 0 ? void 0 : l.info) !== null && _a !== void 0 ? _a : {};
                                return (l === null || l === void 0 ? void 0 : l.userId) === nonAdminId
                                    && info.event === 'account_switch'
                                    && info.sourceUserId === nonAdminId
                                    && info.proxySessionId === adminId
                                    && info.targetUserId === userCId;
                            }); } })
                        // K8b. From the chained C-session, get_linked_accounts must reflect the ACTOR's
                        // perspective: actor's own account first (switch-back), plus all accounts that have
                        // granted access to the actor (B/admin). The current proxy identity (C) must NOT appear
                        // — caller is already in that session.
                    ];
                case 241:
                    _5.sent();
                    chainedSdk = new Session({ host: host });
                    chainedSdk.setAuthToken(chainedToken);
                    return [4 /*yield*/, async_test('K8b. get_linked_accounts from chained C-session reflects actor + actor-grants, excludes current proxy', function () { return chainedSdk.api.users.get_linked_accounts(); }, { shouldError: false, onResult: function (r) {
                                var _a;
                                var accounts = ((_a = r === null || r === void 0 ? void 0 : r.linkedAccounts) !== null && _a !== void 0 ? _a : []);
                                if (accounts.length === 0)
                                    return false;
                                // Switch-back entry (actor's own account) is first.
                                if (accounts[0].id !== nonAdminId)
                                    return false;
                                // Admin appears because admin has nonAdmin: accepted in linkedAccountAccess.
                                var hasAdmin = accounts.some(function (a) { return a.id === adminId; });
                                // The current proxy identity (userC) must NOT appear — it's not switchable from itself.
                                var hasSelfProxy = accounts.some(function (a) { return a.id === userCId; });
                                return hasAdmin && !hasSelfProxy;
                            } })
                        // Cleanup K8: delete C (also clears the linkedAccountAccess that the chained switch
                        // consumed), and re-auth nonAdmin since the K8 setup switch invalidated its token.
                    ];
                case 242:
                    _5.sent();
                    _5.label = 243;
                case 243:
                    _5.trys.push([243, 245, , 246]);
                    return [4 /*yield*/, sdk.api.users.deleteOne(userCId)];
                case 244:
                    _5.sent();
                    return [3 /*break*/, 246];
                case 245:
                    _j = _5.sent();
                    return [3 /*break*/, 246];
                case 246: return [4 /*yield*/, sdkNonAdmin.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)
                    // ============================================================
                    // L. linkedAccountAccess read-side redaction (owner-only metadata)
                    // ============================================================
                    // The grant list reveals who's been requesting access to whom. Only the owner needs to
                    // see it (to act on pending requests / inspect accepted grants). Cross-user reads,
                    // switched-session reads, and the switch_account response.user must all redact the field.
                ];
                case 247:
                    _5.sent();
                    // ============================================================
                    // L. linkedAccountAccess read-side redaction (owner-only metadata)
                    // ============================================================
                    // The grant list reveals who's been requesting access to whom. Only the owner needs to
                    // see it (to act on pending requests / inspect accepted grants). Cross-user reads,
                    // switched-session reads, and the switch_account response.user must all redact the field.
                    log_header("L. linkedAccountAccess read-side redaction");
                    // Seed an accepted grant so admin's record has a non-empty linkedAccountAccess for the
                    // redaction assertions to be meaningful (a missing field is indistinguishable from a
                    // redacted-empty field otherwise).
                    return [4 /*yield*/, clear_linkedAccountAccess(sdk, adminId)];
                case 248:
                    // Seed an accepted grant so admin's record has a non-empty linkedAccountAccess for the
                    // redaction assertions to be meaningful (a missing field is indistinguishable from a
                    // redacted-empty field otherwise).
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 1500)];
                case 249:
                    _5.sent();
                    return [4 /*yield*/, sdkNonAdmin.api.users.request_linked_account_access({ targetEmail: adminEmail })];
                case 250:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)];
                case 251:
                    _5.sent();
                    return [4 /*yield*/, get_user(sdk, adminId)];
                case 252:
                    lSeedState = _5.sent();
                    lPending = ((_3 = lSeedState.linkedAccountAccess) !== null && _3 !== void 0 ? _3 : []).find(function (e) { return e.userId === nonAdminId; });
                    return [4 /*yield*/, set_linkedAccountAccess(sdk, adminId, [__assign(__assign({}, lPending), { status: 'accepted' })])];
                case 253:
                    _5.sent();
                    return [4 /*yield*/, wait(undefined, 250)
                        // L1. Owner reading own record from a non-switched session: field IS visible.
                    ];
                case 254:
                    _5.sent();
                    // L1. Owner reading own record from a non-switched session: field IS visible.
                    return [4 /*yield*/, async_test('L1. Owner reading own record sees linkedAccountAccess', function () { return get_user(sdk, adminId); }, { shouldError: false, onResult: function (u) { return Array.isArray(u === null || u === void 0 ? void 0 : u.linkedAccountAccess) && u.linkedAccountAccess.length > 0; } })
                        // L2. Cross-user read (non-admin reads admin): field is redacted.
                    ];
                case 255:
                    // L1. Owner reading own record from a non-switched session: field IS visible.
                    _5.sent();
                    // L2. Cross-user read (non-admin reads admin): field is redacted.
                    return [4 /*yield*/, async_test('L2. Cross-user read (nonAdmin reads admin) redacts linkedAccountAccess', function () { return get_user(sdkNonAdmin, adminId); }, { shouldError: false, onResult: function (u) { return (u === null || u === void 0 ? void 0 : u.linkedAccountAccess) === undefined; } })
                        // L3. Switched session reading the proxy's own record: still redacted (session.actorUserId
                        // is set, so callerIsRealOwner is false even though value.id === session.id).
                    ];
                case 256:
                    // L2. Cross-user read (non-admin reads admin): field is redacted.
                    _5.sent();
                    return [4 /*yield*/, sdkNonAdmin.api.users.switch_account({ targetUserId: adminId })];
                case 257:
                    lSwitchResp = _5.sent();
                    lSwitchedSdk = new Session({ host: host });
                    lSwitchedSdk.setAuthToken(lSwitchResp.authToken);
                    return [4 /*yield*/, async_test('L3. Switched session reading proxy record (admin) redacts linkedAccountAccess', function () { return get_user(lSwitchedSdk, adminId); }, { shouldError: false, onResult: function (u) { return (u === null || u === void 0 ? void 0 : u.linkedAccountAccess) === undefined; } })
                        // L4. switch_account response.user does NOT include linkedAccountAccess (the response
                        // bypasses applyRedactions, so the handler strips the field explicitly).
                    ];
                case 258:
                    _5.sent();
                    // L4. switch_account response.user does NOT include linkedAccountAccess (the response
                    // bypasses applyRedactions, so the handler strips the field explicitly).
                    assert((lSwitchResp === null || lSwitchResp === void 0 ? void 0 : lSwitchResp.user) && lSwitchResp.user.id === adminId && lSwitchResp.user.linkedAccountAccess === undefined, "switch_account response.user.linkedAccountAccess should be undefined; got ".concat(JSON.stringify((_4 = lSwitchResp === null || lSwitchResp === void 0 ? void 0 : lSwitchResp.user) === null || _4 === void 0 ? void 0 : _4.linkedAccountAccess)), 'L4. switch_account response.user has linkedAccountAccess redacted');
                    return [4 /*yield*/, lSwitchedSdk.api.users.switch_account({ targetUserId: nonAdminId })];
                case 259:
                    lBackResp = _5.sent();
                    lBackSdk = new Session({ host: host });
                    lBackSdk.setAuthToken(lBackResp.authToken);
                    return [4 /*yield*/, async_test('L5. Owner-in-real-session can read their own linkedAccountAccess after switch-back', function () { return get_user(lBackSdk, nonAdminId); }, { shouldError: false, onResult: function (u) { return Array.isArray(u === null || u === void 0 ? void 0 : u.linkedAccountAccess); } })
                        // L cleanup: re-auth nonAdmin (lBackSdk's token wasn't invalidated, but we want a clean
                        // sdkNonAdmin for the remaining sections).
                    ];
                case 260:
                    _5.sent();
                    // L cleanup: re-auth nonAdmin (lBackSdk's token wasn't invalidated, but we want a clean
                    // sdkNonAdmin for the remaining sections).
                    return [4 /*yield*/, sdkNonAdmin.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)
                        // ============================================================
                        // M. Enduser sessions are rejected on user-only endpoints
                        // ============================================================
                        // The three new endpoints are registered as customActions on the `users` model with no
                        // `allowEnduser` and no `enduserAction` declared. With only the user-type auth path active,
                        // is_logged_in's type check (authentication.ts:587 — `if (userInfo.type !== type) return false`)
                        // rejects the enduser JWT and checkAccess returns 401 "Unauthenticated" before businessOnly
                        // even runs. Tests here are negative assertions guarding against future drift — e.g. if
                        // someone adds `allowEnduser` to a custom action by accident.
                    ];
                case 261:
                    // L cleanup: re-auth nonAdmin (lBackSdk's token wasn't invalidated, but we want a clean
                    // sdkNonAdmin for the remaining sections).
                    _5.sent();
                    // ============================================================
                    // M. Enduser sessions are rejected on user-only endpoints
                    // ============================================================
                    // The three new endpoints are registered as customActions on the `users` model with no
                    // `allowEnduser` and no `enduserAction` declared. With only the user-type auth path active,
                    // is_logged_in's type check (authentication.ts:587 — `if (userInfo.type !== type) return false`)
                    // rejects the enduser JWT and checkAccess returns 401 "Unauthenticated" before businessOnly
                    // even runs. Tests here are negative assertions guarding against future drift — e.g. if
                    // someone adds `allowEnduser` to a custom action by accident.
                    log_header("M. Enduser sessions rejected on user endpoints");
                    enduserEmail = "switch-enduser-".concat(RAND(), "@tellescope.example");
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            email: enduserEmail,
                            fname: 'Switch',
                            lname: 'Enduser',
                        })];
                case 262:
                    enduserRec = _5.sent();
                    return [4 /*yield*/, sdk.api.endusers.generate_auth_token({ id: enduserRec.id })
                        // Use a plain Session with the enduser token so we can hit the user-only routes. The
                        // EnduserSession's .api shape doesn't include these methods, but the underlying HTTP
                        // routes do exist server-side — we want to confirm the server-side rejection fires
                        // regardless of what client SDK is used.
                    ];
                case 263:
                    enduserAuthToken = (_5.sent()).authToken;
                    sdkAsEnduser = new Session({ host: host });
                    sdkAsEnduser.setAuthToken(enduserAuthToken);
                    isEnduserRejection = is401Rejection;
                    return [4 /*yield*/, async_test('M1. Enduser session is rejected on get_linked_accounts', function () { return sdkAsEnduser.api.users.get_linked_accounts(); }, { shouldError: true, onError: isEnduserRejection })];
                case 264:
                    _5.sent();
                    return [4 /*yield*/, async_test('M2. Enduser session is rejected on switch_account', function () { return sdkAsEnduser.api.users.switch_account({ targetUserId: adminId }); }, { shouldError: true, onError: isEnduserRejection })];
                case 265:
                    _5.sent();
                    return [4 /*yield*/, async_test('M3. Enduser session is rejected on request_linked_account_access', function () { return sdkAsEnduser.api.users.request_linked_account_access({ targetEmail: adminEmail }); }, { shouldError: true, onError: isEnduserRejection })
                        // Cleanup the inline enduser.
                    ];
                case 266:
                    _5.sent();
                    _5.label = 267;
                case 267:
                    _5.trys.push([267, 269, , 270]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduserRec.id)];
                case 268:
                    _5.sent();
                    return [3 /*break*/, 270];
                case 269:
                    _k = _5.sent();
                    return [3 /*break*/, 270];
                case 270:
                    // ============================================================
                    // C10. request_linked_account_access rate limit (placed last — exhausts admin's quota for 60s)
                    // ============================================================
                    log_header("C10. request_linked_account_access rate limit (placed last)");
                    i = 0;
                    _5.label = 271;
                case 271:
                    if (!(i < 30)) return [3 /*break*/, 276];
                    _5.label = 272;
                case 272:
                    _5.trys.push([272, 274, , 275]);
                    return [4 /*yield*/, sdk.api.users.request_linked_account_access({ targetEmail: "rl-".concat(RAND(), "@tellescope.example") })];
                case 273:
                    _5.sent();
                    return [3 /*break*/, 275];
                case 274:
                    _l = _5.sent();
                    return [3 /*break*/, 275];
                case 275:
                    i++;
                    return [3 /*break*/, 271];
                case 276: return [4 /*yield*/, async_test('C10. 31st request inside one minute is rate-limited (429)', function () { return sdk.api.users.request_linked_account_access({ targetEmail: "rl-".concat(RAND(), "@tellescope.example") }); }, { shouldError: true, onError: function (e) { return e.statusCode === 429 || (e.message || '').toLowerCase().includes('rate'); } })
                    // ============================================================
                    // J. Cleanup
                    // ============================================================
                ];
                case 277:
                    _5.sent();
                    // ============================================================
                    // J. Cleanup
                    // ============================================================
                    log_header("J. Cleanup");
                    return [4 /*yield*/, clear_linkedAccountAccess(sdk, adminId)];
                case 278:
                    _5.sent();
                    return [4 /*yield*/, clear_linkedAccountAccess(sdkNonAdmin, nonAdminId)];
                case 279:
                    _5.sent();
                    return [4 /*yield*/, cleanup_marker_tags(sdk, adminId)];
                case 280:
                    _5.sent();
                    return [4 /*yield*/, cleanup_marker_tags(sdkNonAdmin, nonAdminId)
                        // Restore admin's fname (G5 mutated it server-side; downstream tests compare userInfo.fname to the server value).
                    ];
                case 281:
                    _5.sent();
                    if (!originalAdminFname) return [3 /*break*/, 285];
                    _5.label = 282;
                case 282:
                    _5.trys.push([282, 284, , 285]);
                    return [4 /*yield*/, sdk.api.users.updateOne(adminId, { fname: originalAdminFname })];
                case 283:
                    _5.sent();
                    return [3 /*break*/, 285];
                case 284:
                    _m = _5.sent();
                    return [3 /*break*/, 285];
                case 285: return [2 /*return*/];
            }
        });
    });
};
// Allow running this test file independently
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
                    return [4 /*yield*/, account_switcher_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("Account switcher test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("Account switcher test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=account_switcher.test.js.map