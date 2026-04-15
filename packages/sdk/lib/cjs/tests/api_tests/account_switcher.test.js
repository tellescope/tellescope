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
exports.account_switcher_tests = void 0;
require('source-map-support').install();
var crypto_1 = __importDefault(require("crypto"));
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var utilities_1 = require("@tellescope/utilities");
var setup_1 = require("../setup");
var host = process.env.API_URL || 'http://localhost:8080';
var TEST_EMAIL = process.env.TEST_EMAIL;
var TEST_PASSWORD = process.env.TEST_PASSWORD;
var NON_ADMIN_EMAIL = process.env.NON_ADMIN_EMAIL;
var NON_ADMIN_PASSWORD = process.env.NON_ADMIN_PASSWORD;
// matches the API key used in tests.ts for the secondary org
var SDK_OTHER_API_KEY = "ba745e25162bb95a795c5fa1af70df188d93c4d3aac9c48b34a5c8c9dd7b80f7";
var account_switcher_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var sdkOther, adminBaseEmail, _b, adminLocal, adminDomain, naBaseEmail, _c, naLocal, naDomain, suffix, emailPlusA, emailPlusB, emailPlusLocked, emailPlusUppercase, emailPlusInjection, emailReadOnly, emailOtherBase, emailPrefixSwitcher, emailNonAdminPlus, emailUnverifTarget, emailCrossOrg, userPlusA, userPlusB, userPlusLocked, userPlusUppercase, userPlusInjection, userReadOnly, userOtherBase, userPrefixSwitcher, userNonAdminPlus, userCrossOrg, userUnverifTarget, restrictiveRole, linkedFromAdmin, linkedIds, sample, preSwitchTokenSession_1, switchResult, switchedSession_1, meAfterSwitch, newLinkedFromSwitched, newLinkedIds, xorgSwitch, xorgSession_1, xorgMe, downgradeSwitch, downgradedSession_1, noAuthSession_1, allLogs, logsArr, switchLog, beforeUnverif, afterUnverif, rateLimitTripped, lastError, i, e_1, msg, cleanup;
        var _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    (0, testing_1.log_header)("Account Switcher Tests");
                    sdkOther = new sdk_1.Session({ host: host, apiKey: SDK_OTHER_API_KEY });
                    adminBaseEmail = (0, utilities_1.getBaseEmail)(sdk.userInfo.email);
                    _b = adminBaseEmail.split('@'), adminLocal = _b[0], adminDomain = _b[1];
                    naBaseEmail = (0, utilities_1.getBaseEmail)(sdkNonAdmin.userInfo.email);
                    _c = naBaseEmail.split('@'), naLocal = _c[0], naDomain = _c[1];
                    suffix = crypto_1.default.randomBytes(4).toString('hex');
                    emailPlusA = "".concat(adminLocal, "+acctsw_a_").concat(suffix, "@").concat(adminDomain);
                    emailPlusB = "".concat(adminLocal, "+acctsw_b_").concat(suffix, "@").concat(adminDomain);
                    emailPlusLocked = "".concat(adminLocal, "+acctsw_locked_").concat(suffix, "@").concat(adminDomain);
                    emailPlusUppercase = "".concat(adminLocal.toUpperCase(), "+AcctSwCaps_").concat(suffix, "@").concat(adminDomain);
                    emailPlusInjection = "".concat(adminLocal, "+acctsw.x.y_").concat(suffix, "@").concat(adminDomain);
                    emailReadOnly = "".concat(adminLocal, "+acctsw_ro_").concat(suffix, "@").concat(adminDomain);
                    emailOtherBase = "acctsw_unrelated_".concat(suffix, "@").concat(adminDomain);
                    emailPrefixSwitcher = "prefix".concat(adminLocal, "+acctsw_pfx_").concat(suffix, "@").concat(adminDomain);
                    emailNonAdminPlus = "".concat(naLocal, "+acctsw_na_").concat(suffix, "@").concat(naDomain);
                    emailUnverifTarget = "".concat(adminLocal, "+acctsw_unvrf_").concat(suffix, "@").concat(adminDomain);
                    emailCrossOrg = "".concat(adminLocal, "+acctsw_xorg_").concat(suffix, "@").concat(adminDomain);
                    _l.label = 1;
                case 1:
                    _l.trys.push([1, , 56, 58]);
                    return [4 /*yield*/, sdk.api.users.createOne({ email: emailPlusA, fname: 'A', verifiedEmail: true })];
                case 2:
                    // ------------------------------ Fixtures ------------------------------
                    userPlusA = _l.sent();
                    return [4 /*yield*/, sdk.api.users.createOne({ email: emailPlusB, fname: 'B', verifiedEmail: true })];
                case 3:
                    userPlusB = _l.sent();
                    return [4 /*yield*/, sdk.api.users.createOne({ email: emailPlusUppercase, verifiedEmail: true })];
                case 4:
                    userPlusUppercase = _l.sent();
                    return [4 /*yield*/, sdk.api.users.createOne({ email: emailPlusInjection, verifiedEmail: true })];
                case 5:
                    userPlusInjection = _l.sent();
                    return [4 /*yield*/, sdk.api.users.createOne({ email: emailOtherBase, verifiedEmail: true })];
                case 6:
                    userOtherBase = _l.sent();
                    return [4 /*yield*/, sdk.api.users.createOne({ email: emailPrefixSwitcher, verifiedEmail: true })];
                case 7:
                    userPrefixSwitcher = _l.sent();
                    return [4 /*yield*/, sdk.api.users.createOne({ email: emailNonAdminPlus, verifiedEmail: true })
                        // Created with verifiedEmail: false so we can observe propagation from a verified source
                    ];
                case 8:
                    userNonAdminPlus = _l.sent();
                    return [4 /*yield*/, sdk.api.users.createOne({ email: emailUnverifTarget, verifiedEmail: false })
                        // Locked sibling (lockedOutUntil = 0 => indefinite lockout per types-models)
                    ];
                case 9:
                    // Created with verifiedEmail: false so we can observe propagation from a verified source
                    userUnverifTarget = _l.sent();
                    return [4 /*yield*/, sdk.api.users.createOne({ email: emailPlusLocked, verifiedEmail: true })];
                case 10:
                    // Locked sibling (lockedOutUntil = 0 => indefinite lockout per types-models)
                    userPlusLocked = _l.sent();
                    return [4 /*yield*/, sdk.api.users.updateOne(userPlusLocked.id, { lockedOutUntil: 0 })
                        // Restrictive role + user assigned to that role (used to verify no privilege escalation)
                    ];
                case 11:
                    _l.sent();
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.createOne({
                            role: "acctsw_restrictive_".concat(suffix),
                            permissions: {
                                users: { read: null, create: null, update: null, delete: null },
                                endusers: { read: null, create: null, update: null, delete: null },
                            },
                        })];
                case 12:
                    // Restrictive role + user assigned to that role (used to verify no privilege escalation)
                    restrictiveRole = _l.sent();
                    return [4 /*yield*/, sdk.api.users.createOne({ email: emailReadOnly, verifiedEmail: true })];
                case 13:
                    userReadOnly = _l.sent();
                    return [4 /*yield*/, sdk.api.users.updateOne(userReadOnly.id, { roles: [restrictiveRole.role] }, { replaceObjectFields: true })
                        // Cross-org sibling (different org via API key)
                    ];
                case 14:
                    _l.sent();
                    return [4 /*yield*/, sdkOther.api.users.createOne({ email: emailCrossOrg, verifiedEmail: true })];
                case 15:
                    // Cross-org sibling (different org via API key)
                    userCrossOrg = _l.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 250)
                        // ====================== A. get_linked_accounts ======================
                    ]; // small settle for created records
                case 16:
                    _l.sent(); // small settle for created records
                    return [4 /*yield*/, sdk.api.users.get_linked_accounts()];
                case 17:
                    linkedFromAdmin = _l.sent();
                    linkedIds = (linkedFromAdmin.linkedAccounts || []).map(function (a) { return a.id; });
                    (0, testing_1.assert)(linkedIds.includes(userPlusA.id), 'userPlusA missing from linked accounts', 'get_linked_accounts: includes plus sibling A');
                    (0, testing_1.assert)(linkedIds.includes(userPlusB.id), 'userPlusB missing from linked accounts', 'get_linked_accounts: includes plus sibling B');
                    (0, testing_1.assert)(linkedIds.includes(userPlusUppercase.id), 'uppercase plus variant missing from linked accounts', 'get_linked_accounts: case-insensitive base match');
                    (0, testing_1.assert)(linkedIds.includes(userPlusInjection.id), 'regex-special plus variant missing from linked accounts', 'get_linked_accounts: regex special chars do not break matching');
                    (0, testing_1.assert)(linkedIds.includes(userCrossOrg.id), 'cross-org sibling missing from linked accounts', 'get_linked_accounts: includes cross-org plus sibling');
                    (0, testing_1.assert)(!linkedIds.includes(sdk.userInfo.id), 'caller present in linked accounts', 'get_linked_accounts: excludes caller');
                    (0, testing_1.assert)(!linkedIds.includes(userOtherBase.id), 'unrelated-base user present in linked accounts', 'get_linked_accounts: excludes unrelated base email');
                    (0, testing_1.assert)(!linkedIds.includes(userPrefixSwitcher.id), 'prefix-extended user present in linked accounts (anchored regex broken?)', 'get_linked_accounts: anchored regex excludes prefix-extended local part');
                    (0, testing_1.assert)(!linkedIds.includes(userPlusLocked.id), 'locked user present in linked accounts', 'get_linked_accounts: excludes locked target');
                    sample = (linkedFromAdmin.linkedAccounts || []).find(function (a) { return a.id === userPlusB.id; });
                    (0, testing_1.assert)(!!sample
                        && typeof sample.email === 'string'
                        && typeof sample.orgName === 'string'
                        && typeof sample.requiresMFA === 'boolean', 'linked account entry missing required fields', 'get_linked_accounts: entries have id, email, orgName, requiresMFA');
                    // noAccessPermissions: non-admin can call without 403
                    return [4 /*yield*/, (0, testing_1.async_test)('get_linked_accounts callable by non-admin (noAccessPermissions)', function () { return sdkNonAdmin.api.users.get_linked_accounts(); }, { onResult: function (r) { return Array.isArray(r.linkedAccounts); } })
                        // ====================== B. switch_account ======================
                        // 1. Same-org happy path: sdk (admin) → userPlusB
                        // Capture the source token in a separate Session BEFORE the switch so we can verify
                        // the original JWT is invalidated (Step 13) without losing access via `sdk` itself.
                    ];
                case 18:
                    // noAccessPermissions: non-admin can call without 403
                    _l.sent();
                    preSwitchTokenSession_1 = new sdk_1.Session({ host: host, authToken: sdk.authToken });
                    return [4 /*yield*/, (0, testing_1.async_test)('switch_account: pre-switch source token is valid', function () { return preSwitchTokenSession_1.test_authenticated(); }, { expectedResult: 'Authenticated!' })];
                case 19:
                    _l.sent();
                    return [4 /*yield*/, sdk.api.users.switch_account({ targetUserId: userPlusB.id })];
                case 20:
                    switchResult = _l.sent();
                    (0, testing_1.assert)(!!switchResult.authToken, 'no authToken returned from switch_account', 'switch_account: returns authToken');
                    (0, testing_1.assert)(((_d = switchResult.user) === null || _d === void 0 ? void 0 : _d.id) === userPlusB.id, 'switch_account returned wrong user id', 'switch_account: returns target user record');
                    (0, testing_1.assert)((((_e = switchResult.user) === null || _e === void 0 ? void 0 : _e.email) || '').toLowerCase() === emailPlusB.toLowerCase(), 'switch_account returned wrong email', 'switch_account: returns target email');
                    // User model stores password hash in `hashedPass` (not `hashedPassword` — that's Enduser).
                    // Both are asserted as belt-and-suspenders in case field names drift.
                    (0, testing_1.assert)(!((_f = switchResult.user) === null || _f === void 0 ? void 0 : _f.hashedPass), "switch_account response leaked hashedPass: ".concat(JSON.stringify(switchResult.user.hashedPass)), 'switch_account: response redacts hashedPass');
                    (0, testing_1.assert)(!((_g = switchResult.user) === null || _g === void 0 ? void 0 : _g.hashedPassword), "switch_account response leaked hashedPassword: ".concat(JSON.stringify(switchResult.user.hashedPassword)), 'switch_account: response has no hashedPassword (defense-in-depth)');
                    switchedSession_1 = new sdk_1.Session({ host: host, authToken: switchResult.authToken });
                    return [4 /*yield*/, (0, testing_1.async_test)('switch_account: new token authenticates', function () { return switchedSession_1.test_authenticated(); }, { expectedResult: 'Authenticated!' })];
                case 21:
                    _l.sent();
                    return [4 /*yield*/, switchedSession_1.api.users.getOne(userPlusB.id)];
                case 22:
                    meAfterSwitch = _l.sent();
                    (0, testing_1.assert)((meAfterSwitch.email || '').toLowerCase() === emailPlusB.toLowerCase(), 'switched session does not resolve to target user', 'switch_account: new session authenticates as target user');
                    return [4 /*yield*/, switchedSession_1.api.users.get_linked_accounts()];
                case 23:
                    newLinkedFromSwitched = _l.sent();
                    newLinkedIds = (newLinkedFromSwitched.linkedAccounts || []).map(function (a) { return a.id; });
                    (0, testing_1.assert)(!newLinkedIds.includes(userPlusB.id), 'post-switch linked accounts include the new caller', 'post-switch get_linked_accounts: excludes new caller');
                    (0, testing_1.assert)(newLinkedIds.includes(userPlusA.id), 'post-switch linked accounts missing other sibling', 'post-switch get_linked_accounts: includes other plus siblings');
                    (0, testing_1.assert)(newLinkedIds.includes(sdk.userInfo.id), 'post-switch linked accounts missing original caller', 'post-switch get_linked_accounts: includes original caller');
                    // JWT invalidation (Step 13): the source token captured pre-switch must now be rejected.
                    return [4 /*yield*/, (0, testing_1.async_test)('switch_account: source JWT invalidated after switch', function () { return preSwitchTokenSession_1.test_authenticated(); }, { shouldError: true, onError: function (e) { var _a; return /unauth|expired|invalid/i.test((e === null || e === void 0 ? void 0 : e.message) || ((_a = e === null || e === void 0 ? void 0 : e.toString) === null || _a === void 0 ? void 0 : _a.call(e)) || String(e)); } })
                        // Re-authenticate sdk so subsequent tests in this suite work (its prior token is now expired).
                    ];
                case 24:
                    // JWT invalidation (Step 13): the source token captured pre-switch must now be rejected.
                    _l.sent();
                    // Re-authenticate sdk so subsequent tests in this suite work (its prior token is now expired).
                    return [4 /*yield*/, sdk.authenticate(TEST_EMAIL, TEST_PASSWORD)
                        // 2. Cross-org happy path: sdk (admin) → userCrossOrg (in sdkOther's org)
                    ];
                case 25:
                    // Re-authenticate sdk so subsequent tests in this suite work (its prior token is now expired).
                    _l.sent();
                    return [4 /*yield*/, sdk.api.users.switch_account({ targetUserId: userCrossOrg.id })];
                case 26:
                    xorgSwitch = _l.sent();
                    (0, testing_1.assert)(((_h = xorgSwitch.user) === null || _h === void 0 ? void 0 : _h.id) === userCrossOrg.id, 'cross-org switch returned wrong user', 'switch_account: cross-org switch returns target');
                    xorgSession_1 = new sdk_1.Session({ host: host, authToken: xorgSwitch.authToken });
                    return [4 /*yield*/, xorgSession_1.api.users.getOne(userCrossOrg.id)];
                case 27:
                    xorgMe = _l.sent();
                    (0, testing_1.assert)((xorgMe.email || '').toLowerCase() === emailCrossOrg.toLowerCase(), 'cross-org session not scoped correctly', 'switch_account: cross-org session resolves to target user');
                    // Multi-tenant isolation: cross-org session must NOT see source-org users
                    return [4 /*yield*/, (0, testing_1.async_test)('switch_account: cross-org session cannot see source-org user (tenant isolation)', function () { return xorgSession_1.api.users.getOne(sdk.userInfo.id); }, testing_1.handleAnyError)
                        // Re-auth sdk: previous switch invalidated its token (Step 13)
                    ];
                case 28:
                    // Multi-tenant isolation: cross-org session must NOT see source-org users
                    _l.sent();
                    // Re-auth sdk: previous switch invalidated its token (Step 13)
                    return [4 /*yield*/, sdk.authenticate(TEST_EMAIL, TEST_PASSWORD)
                        // 3. Permission scoping (no privilege escalation): sdk (admin) → userReadOnly,
                        //    then attempt an admin-only operation with the new token. Must fail.
                    ];
                case 29:
                    // Re-auth sdk: previous switch invalidated its token (Step 13)
                    _l.sent();
                    return [4 /*yield*/, sdk.api.users.switch_account({ targetUserId: userReadOnly.id })];
                case 30:
                    downgradeSwitch = _l.sent();
                    downgradedSession_1 = new sdk_1.Session({ host: host, authToken: downgradeSwitch.authToken });
                    return [4 /*yield*/, (0, testing_1.async_test)('switch_account: downgraded session cannot perform admin op (no privilege escalation)', function () { return downgradedSession_1.api.users.updateOne(userPlusA.id, { roles: ['Admin'] }, { replaceObjectFields: true }); }, testing_1.handleAnyError)
                        // Re-auth sdk: previous switch invalidated its token (Step 13)
                    ];
                case 31:
                    _l.sent();
                    // Re-auth sdk: previous switch invalidated its token (Step 13)
                    return [4 /*yield*/, sdk.authenticate(TEST_EMAIL, TEST_PASSWORD)
                        // 3b. Self-switch attempt MUST be rejected (Step 12): no-op that wastes rate-limit budget
                        //     and creates spurious audit logs.
                    ];
                case 32:
                    // Re-auth sdk: previous switch invalidated its token (Step 13)
                    _l.sent();
                    // 3b. Self-switch attempt MUST be rejected (Step 12): no-op that wastes rate-limit budget
                    //     and creates spurious audit logs.
                    return [4 /*yield*/, (0, testing_1.async_test)('switch_account: rejects self-switch', function () { return sdk.api.users.switch_account({ targetUserId: sdk.userInfo.id }); }, { shouldError: true, onError: function (e) { var _a; return /own account/i.test((e === null || e === void 0 ? void 0 : e.message) || ((_a = e === null || e === void 0 ? void 0 : e.toString) === null || _a === void 0 ? void 0 : _a.call(e)) || String(e)); } })
                        // 4. Cross-base attack: sdk (admin) → userOtherBase (different base) MUST be rejected.
                    ];
                case 33:
                    // 3b. Self-switch attempt MUST be rejected (Step 12): no-op that wastes rate-limit budget
                    //     and creates spurious audit logs.
                    _l.sent();
                    // 4. Cross-base attack: sdk (admin) → userOtherBase (different base) MUST be rejected.
                    return [4 /*yield*/, (0, testing_1.async_test)('switch_account: rejects cross-base target', function () { return sdk.api.users.switch_account({ targetUserId: userOtherBase.id }); }, testing_1.handleAnyError)];
                case 34:
                    // 4. Cross-base attack: sdk (admin) → userOtherBase (different base) MUST be rejected.
                    _l.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('switch_account: source session unaffected after rejected cross-base attempt', function () { return sdk.test_authenticated(); }, { expectedResult: 'Authenticated!' })
                        // 5. Locked target: must reject
                    ];
                case 35:
                    _l.sent();
                    // 5. Locked target: must reject
                    return [4 /*yield*/, (0, testing_1.async_test)('switch_account: rejects locked target', function () { return sdk.api.users.switch_account({ targetUserId: userPlusLocked.id }); }, testing_1.handleAnyError)
                        // 6. Nonexistent target: must reject without leaking existence
                    ];
                case 36:
                    // 5. Locked target: must reject
                    _l.sent();
                    // 6. Nonexistent target: must reject without leaking existence
                    return [4 /*yield*/, (0, testing_1.async_test)('switch_account: rejects nonexistent target', function () { return sdk.api.users.switch_account({ targetUserId: '000000000000000000000000' }); }, testing_1.handleAnyError)
                        // 7. Malformed targetUserId: validation error (does not reach handler / rate limit)
                    ];
                case 37:
                    // 6. Nonexistent target: must reject without leaking existence
                    _l.sent();
                    // 7. Malformed targetUserId: validation error (does not reach handler / rate limit)
                    return [4 /*yield*/, (0, testing_1.async_test)('switch_account: rejects malformed targetUserId', function () { return sdk.api.users.switch_account({ targetUserId: 'not-an-objectid' }); }, testing_1.handleAnyError)
                        // 8. noAccessPermissions on switch: non-admin can switch to its own plus sibling
                    ];
                case 38:
                    // 7. Malformed targetUserId: validation error (does not reach handler / rate limit)
                    _l.sent();
                    // 8. noAccessPermissions on switch: non-admin can switch to its own plus sibling
                    return [4 /*yield*/, (0, testing_1.async_test)('switch_account: callable by non-admin (noAccessPermissions)', function () { return sdkNonAdmin.api.users.switch_account({ targetUserId: userNonAdminPlus.id }); }, { onResult: function (r) { var _a; return ((_a = r.user) === null || _a === void 0 ? void 0 : _a.id) === userNonAdminPlus.id && !!r.authToken; } })
                        // Re-auth sdkNonAdmin: previous switch invalidated its token (Step 13)
                    ];
                case 39:
                    // 8. noAccessPermissions on switch: non-admin can switch to its own plus sibling
                    _l.sent();
                    // Re-auth sdkNonAdmin: previous switch invalidated its token (Step 13)
                    return [4 /*yield*/, sdkNonAdmin.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)
                        // 9. Unauthenticated request: must reject before reaching handler
                    ];
                case 40:
                    // Re-auth sdkNonAdmin: previous switch invalidated its token (Step 13)
                    _l.sent();
                    noAuthSession_1 = new sdk_1.Session({ host: host });
                    return [4 /*yield*/, (0, testing_1.async_test)('switch_account: rejects unauthenticated caller', function () { return noAuthSession_1.api.users.switch_account({ targetUserId: userPlusA.id }); }, testing_1.handleAnyError)
                        // 10. Audit log written for the same-org switch performed in step 1
                    ];
                case 41:
                    _l.sent();
                    // 10. Audit log written for the same-org switch performed in step 1
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)];
                case 42:
                    // 10. Audit log written for the same-org switch performed in step 1
                    _l.sent();
                    return [4 /*yield*/, sdk.api.user_logs.getSome({ limit: 1000 })];
                case 43:
                    allLogs = _l.sent();
                    logsArr = Array.isArray(allLogs) ? allLogs : ((allLogs === null || allLogs === void 0 ? void 0 : allLogs.user_logs) || []);
                    switchLog = logsArr.find(function (l) {
                        var _a, _b, _c;
                        return ((_a = l === null || l === void 0 ? void 0 : l.info) === null || _a === void 0 ? void 0 : _a.event) === 'account_switch'
                            && ((_b = l === null || l === void 0 ? void 0 : l.info) === null || _b === void 0 ? void 0 : _b.targetUserId) === userPlusB.id
                            && ((_c = l === null || l === void 0 ? void 0 : l.info) === null || _c === void 0 ? void 0 : _c.sourceUserId) === sdk.userInfo.id;
                    });
                    (0, testing_1.assert)(!!switchLog, 'no account_switch audit log found for sdk → userPlusB', 'switch_account: HIPAA audit log written');
                    if (switchLog) {
                        (0, testing_1.assert)(!!switchLog.info.sourceBusinessId && !!switchLog.info.targetBusinessId, 'audit log missing businessIds', 'switch_account: audit log captures both businessIds');
                        (0, testing_1.assert)((switchLog.info.targetEmail || '').toLowerCase() === emailPlusB.toLowerCase(), 'audit log targetEmail mismatch', 'switch_account: audit log captures targetEmail');
                    }
                    return [4 /*yield*/, sdk.api.users.getOne(userUnverifTarget.id)];
                case 44:
                    beforeUnverif = _l.sent();
                    (0, testing_1.assert)(beforeUnverif.verifiedEmail !== true, "test fixture userUnverifTarget was unexpectedly already verified", 'verifiedEmail propagation fixture: target starts unverified');
                    return [4 /*yield*/, sdk.api.users.switch_account({ targetUserId: userUnverifTarget.id })];
                case 45:
                    _l.sent();
                    return [4 /*yield*/, sdk.authenticate(TEST_EMAIL, TEST_PASSWORD)];
                case 46:
                    _l.sent();
                    return [4 /*yield*/, sdk.api.users.getOne(userUnverifTarget.id)];
                case 47:
                    afterUnverif = _l.sent();
                    (0, testing_1.assert)(afterUnverif.verifiedEmail === true, "target verifiedEmail did not propagate from verified source", 'switch_account: verified source propagates verifiedEmail to target');
                    rateLimitTripped = false;
                    lastError = null;
                    i = 0;
                    _l.label = 48;
                case 48:
                    if (!(i < 15)) return [3 /*break*/, 54];
                    _l.label = 49;
                case 49:
                    _l.trys.push([49, 52, , 53]);
                    return [4 /*yield*/, sdk.authenticate(TEST_EMAIL, TEST_PASSWORD)];
                case 50:
                    _l.sent();
                    return [4 /*yield*/, sdk.api.users.switch_account({ targetUserId: userPlusA.id })];
                case 51:
                    _l.sent();
                    return [3 /*break*/, 53];
                case 52:
                    e_1 = _l.sent();
                    lastError = e_1;
                    msg = (e_1 === null || e_1 === void 0 ? void 0 : e_1.message) || ((_j = e_1 === null || e_1 === void 0 ? void 0 : e_1.toString) === null || _j === void 0 ? void 0 : _j.call(e_1)) || String(e_1);
                    if (/too many|rate/i.test(msg)) {
                        rateLimitTripped = true;
                        return [3 /*break*/, 54];
                    }
                    return [3 /*break*/, 53];
                case 53:
                    i++;
                    return [3 /*break*/, 48];
                case 54:
                    (0, testing_1.assert)(rateLimitTripped, "rate limit never tripped after 15 attempts (last error: ".concat((_k = lastError === null || lastError === void 0 ? void 0 : lastError.message) !== null && _k !== void 0 ? _k : 'none', ")"), 'switch_account: rate limit enforced');
                    // Best-effort re-auth so cleanup below can use sdk
                    return [4 /*yield*/, sdk.authenticate(TEST_EMAIL, TEST_PASSWORD).catch(function () { return null; })];
                case 55:
                    // Best-effort re-auth so cleanup below can use sdk
                    _l.sent();
                    return [3 /*break*/, 58];
                case 56:
                    cleanup = function (fn) { return fn().catch(function () { return null; }); };
                    return [4 /*yield*/, Promise.all([
                            userPlusA && cleanup(function () { return sdk.api.users.deleteOne(userPlusA.id); }),
                            userPlusB && cleanup(function () { return sdk.api.users.deleteOne(userPlusB.id); }),
                            userPlusLocked && cleanup(function () { return sdk.api.users.deleteOne(userPlusLocked.id); }),
                            userPlusUppercase && cleanup(function () { return sdk.api.users.deleteOne(userPlusUppercase.id); }),
                            userPlusInjection && cleanup(function () { return sdk.api.users.deleteOne(userPlusInjection.id); }),
                            userReadOnly && cleanup(function () { return sdk.api.users.deleteOne(userReadOnly.id); }),
                            userOtherBase && cleanup(function () { return sdk.api.users.deleteOne(userOtherBase.id); }),
                            userPrefixSwitcher && cleanup(function () { return sdk.api.users.deleteOne(userPrefixSwitcher.id); }),
                            userNonAdminPlus && cleanup(function () { return sdk.api.users.deleteOne(userNonAdminPlus.id); }),
                            userUnverifTarget && cleanup(function () { return sdk.api.users.deleteOne(userUnverifTarget.id); }),
                            userCrossOrg && cleanup(function () { return sdkOther.api.users.deleteOne(userCrossOrg.id); }),
                            restrictiveRole && cleanup(function () { return sdk.api.role_based_access_permissions.deleteOne(restrictiveRole.id); }),
                        ])];
                case 57:
                    _l.sent();
                    return [7 /*endfinally*/];
                case 58: return [2 /*return*/];
            }
        });
    });
};
exports.account_switcher_tests = account_switcher_tests;
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
                    return [4 /*yield*/, (0, exports.account_switcher_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Account switcher test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Account switcher test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=account_switcher.test.js.map