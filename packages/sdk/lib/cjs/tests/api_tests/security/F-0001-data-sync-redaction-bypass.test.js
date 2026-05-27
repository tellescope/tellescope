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
Object.defineProperty(exports, "__esModule", { value: true });
exports.data_sync_redaction_bypass_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../../setup");
var constants_1 = require("@tellescope/constants");
var host = process.env.API_URL || 'http://localhost:8080';
var _a = [process.env.NON_ADMIN_EMAIL, process.env.NON_ADMIN_PASSWORD], nonAdminEmail = _a[0], nonAdminPassword = _a[1];
var FULL_ACCESS = { create: 'All', read: 'All', update: 'All', delete: 'All' };
// Schema fields tagged `redactions: ['all']` that must never appear in
// `/v1/data-sync` results. See packages/public/schema/src/schema.ts.
var REDACTABLE_FIELDS_BY_MODEL = {
    users: ['hashedPass', 'hashedInviteCode'],
    endusers: ['hashedPassword'],
};
var collectViolations = function (results) {
    var violations = [];
    for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
        var record = results_1[_i];
        if (!record.data || record.data === 'deleted')
            continue;
        var fields = REDACTABLE_FIELDS_BY_MODEL[record.modelName];
        if (!fields)
            continue;
        var parsed = void 0;
        try {
            parsed = JSON.parse(record.data);
        }
        catch (_a) {
            continue;
        }
        for (var _b = 0, fields_1 = fields; _b < fields_1.length; _b++) {
            var f = fields_1[_b];
            if (f in parsed && parsed[f] !== undefined && parsed[f] !== null && parsed[f] !== '') {
                violations.push({ modelName: record.modelName, recordId: record.recordId, leakedField: f });
            }
        }
    }
    return violations;
};
/**
 * Regression test for F-0001 (security-audit/findings/F-0001-data-sync-bypasses-applyRedactions.md).
 *
 * The /v1/data-sync handler must apply the central applyRedactions() pipeline to
 * every non-deleted record. The original bug: redactions were gated behind
 *   `if (session.fieldRedactions && session.fieldRedactions[record.modelName])`
 * which meant any session without role-based field redactions (including all
 * admins) received raw records — leaking schema-level `redactions: ['all']`
 * fields (hashedPass, hashedPassword, hashedInviteCode).
 *
 * This test:
 *   1. Configures a non-admin user with broad read access on users + endusers
 *      and NO fieldRedactions — the realistic "regular user with read access"
 *      condition that triggers the bypass.
 *   2. Creates an enduser with a password to populate the sync stream.
 *   3. Calls /v1/data-sync as the non-admin.
 *   4. Asserts no returned record contains hashedPass / hashedPassword /
 *      hashedInviteCode.
 *
 * Pre-fix: assertion fails with leaked records.
 * Post-fix: assertion passes.
 */
var data_sync_redaction_bypass_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var roleName, testEnduserId, rbapId, originalRoles, rbap, testEnduser, sync_1, violations_1, userRecordsInStream_1, adminSync, adminViolations_1, otherUsersInStream_2, linkedAccountLeaks_1, _i, otherUsersInStream_1, record, parsed, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    (0, testing_1.log_header)("F-0001: /v1/data-sync field-redaction bypass regression");
                    roleName = "f0001-data-sync-bypass-".concat(Date.now());
                    originalRoles = sdkNonAdmin.userInfo.roles;
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, , 15, 32]);
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.createOne({
                            role: roleName,
                            permissions: __assign(__assign({}, constants_1.PROVIDER_PERMISSIONS), { users: FULL_ACCESS, endusers: FULL_ACCESS }),
                            // intentionally NO fieldRedactions — this is the exploit condition.
                        })];
                case 2:
                    rbap = _f.sent();
                    rbapId = rbap.id;
                    // 2. Assign role to the non-admin user and re-authenticate so the new
                    //    session reflects the role's permissions.
                    return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [roleName] }, { replaceObjectFields: true })];
                case 3:
                    // 2. Assign role to the non-admin user and re-authenticate so the new
                    //    session reflects the role's permissions.
                    _f.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1500)];
                case 4:
                    _f.sent();
                    return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)
                        // 3. Create a test enduser and set a password — this populates
                        //    `hashedPassword` on the enduser record and writes a data_sync_records
                        //    row for it.
                    ];
                case 5:
                    _f.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'F0001Target',
                            lname: 'Patient',
                            email: "f0001-target-".concat(Date.now(), "@example.com"),
                        })];
                case 6:
                    testEnduser = _f.sent();
                    testEnduserId = testEnduser.id;
                    return [4 /*yield*/, sdk.api.endusers.set_password({ id: testEnduser.id, password: 'F0001TestPassword!123' })
                        // The non-admin user's own `hashedPass` is set from login and refreshed
                        // on every write to their user record (e.g., the role-assignment update
                        // above). No extra setup needed for users.hashedPass to be in the stream.
                    ];
                case 7:
                    _f.sent();
                    // The non-admin user's own `hashedPass` is set from login and refreshed
                    // on every write to their user record (e.g., the role-assignment update
                    // above). No extra setup needed for users.hashedPass to be in the stream.
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)
                        // 4. As the non-admin, call /v1/data-sync from epoch zero to capture all
                        //    sync records the role can see.
                    ];
                case 8:
                    // The non-admin user's own `hashedPass` is set from login and refreshed
                    // on every write to their user record (e.g., the role-assignment update
                    // above). No extra setup needed for users.hashedPass to be in the stream.
                    _f.sent();
                    return [4 /*yield*/, sdkNonAdmin.sync({ from: new Date(0) })
                        // 5. Walk every record. Fail if any contains a `redactions: ['all']` field.
                    ];
                case 9:
                    sync_1 = _f.sent();
                    violations_1 = collectViolations(sync_1.results);
                    userRecordsInStream_1 = sync_1.results.filter(function (r) { return r.modelName === 'users'; }).length;
                    return [4 /*yield*/, (0, testing_1.async_test)("F-0001 guard: /v1/data-sync sync stream contains at least one user record", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ userRecords: userRecordsInStream_1, totalRecords: sync_1.results.length })];
                        }); }); }, { onResult: function (r) { return r.userRecords >= 1; } })];
                case 10:
                    _f.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("F-0001: /v1/data-sync must NOT return hashedPass / hashedPassword / hashedInviteCode (see security-audit/findings/F-0001)", function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, ({
                                        violationCount: violations_1.length,
                                        violations: violations_1.slice(0, 10),
                                        affectedModels: Array.from(new Set(violations_1.map(function (v) { return v.modelName; }))),
                                        affectedFields: Array.from(new Set(violations_1.map(function (v) { return v.leakedField; }))),
                                    })];
                            });
                        }); }, { onResult: function (r) { return r.violationCount === 0; } })
                        // ========================================================================
                        // Additional coverage for applyRedactions code paths reachable via /v1/data-sync.
                        // Each of these is a distinct branch in applyRedactions (routing.ts:1165-1238)
                        // and could regress independently of the F-0001 fix.
                        // ========================================================================
                        // Case A: schema-level `redactions: ['all']` must apply to ADMIN sessions too.
                        // Admins have no session.fieldRedactions, but `redactions: ['all']` is universal.
                        // Pre-fix: admin saw hashedPass via data-sync because applyRedactions was skipped entirely.
                        // Post-fix: applyRedactions always runs and `redactions: ['all']` strips for everyone.
                    ];
                case 11:
                    _f.sent();
                    return [4 /*yield*/, sdk.sync({ from: new Date(0) })];
                case 12:
                    adminSync = _f.sent();
                    adminViolations_1 = collectViolations(adminSync.results);
                    return [4 /*yield*/, (0, testing_1.async_test)("F-0001 coverage A: admin /v1/data-sync also strips redactions:['all'] fields (hashedPass etc.)", function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, ({
                                        violationCount: adminViolations_1.length,
                                        violations: adminViolations_1.slice(0, 10),
                                    })];
                            });
                        }); }, { onResult: function (r) { return r.violationCount === 0; } })
                        // Case B: `linkedAccountAccess` on users must be stripped when the caller is NOT
                        // the record's owner. This is a separate branch in applyRedactions (routing.ts:1220-1225)
                        // and protects against cross-user enumeration of who-requested-access-to-whom.
                        // The non-admin user reads other user records via data-sync; if any of those
                        // records have linkedAccountAccess set, it must be stripped on read.
                    ];
                case 13:
                    _f.sent();
                    otherUsersInStream_2 = sync_1.results.filter(function (r) { return r.modelName === 'users' && r.recordId !== sdkNonAdmin.userInfo.id; });
                    linkedAccountLeaks_1 = [];
                    for (_i = 0, otherUsersInStream_1 = otherUsersInStream_2; _i < otherUsersInStream_1.length; _i++) {
                        record = otherUsersInStream_1[_i];
                        if (!record.data || record.data === 'deleted')
                            continue;
                        try {
                            parsed = JSON.parse(record.data);
                            if ('linkedAccountAccess' in parsed && parsed.linkedAccountAccess !== undefined) {
                                linkedAccountLeaks_1.push({ recordId: record.recordId });
                            }
                        }
                        catch (_g) { }
                    }
                    return [4 /*yield*/, (0, testing_1.async_test)("F-0001 coverage B: /v1/data-sync strips linkedAccountAccess from other users' records", function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, ({
                                        otherUserRecords: otherUsersInStream_2.length,
                                        leakCount: linkedAccountLeaks_1.length,
                                        leaks: linkedAccountLeaks_1.slice(0, 5),
                                    })];
                            });
                        }); }, { onResult: function (r) { return r.leakCount === 0; } })];
                case 14:
                    _f.sent();
                    return [3 /*break*/, 32];
                case 15:
                    _f.trys.push([15, 17, , 18]);
                    return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: originalRoles !== null && originalRoles !== void 0 ? originalRoles : [] }, { replaceObjectFields: true })];
                case 16:
                    _f.sent();
                    return [3 /*break*/, 18];
                case 17:
                    _b = _f.sent();
                    return [3 /*break*/, 18];
                case 18:
                    if (!rbapId) return [3 /*break*/, 22];
                    _f.label = 19;
                case 19:
                    _f.trys.push([19, 21, , 22]);
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.deleteOne(rbapId)];
                case 20:
                    _f.sent();
                    return [3 /*break*/, 22];
                case 21:
                    _c = _f.sent();
                    return [3 /*break*/, 22];
                case 22:
                    if (!testEnduserId) return [3 /*break*/, 26];
                    _f.label = 23;
                case 23:
                    _f.trys.push([23, 25, , 26]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(testEnduserId)];
                case 24:
                    _f.sent();
                    return [3 /*break*/, 26];
                case 25:
                    _d = _f.sent();
                    return [3 /*break*/, 26];
                case 26: 
                // Re-authenticate the non-admin to drop the exploit role from their JWT
                // before subsequent tests run.
                // Role restore above re-triggers deauthenticate_user; wait > 1s so the freshly minted
                // token's (second-floored) iat lands after the deauth timestamp and isn't permanently
                // rejected by is_logged_in's iat-slack check. Matches the in-test re-auth above.
                return [4 /*yield*/, (0, testing_1.wait)(undefined, 1500)];
                case 27:
                    // Re-authenticate the non-admin to drop the exploit role from their JWT
                    // before subsequent tests run.
                    // Role restore above re-triggers deauthenticate_user; wait > 1s so the freshly minted
                    // token's (second-floored) iat lands after the deauth timestamp and isn't permanently
                    // rejected by is_logged_in's iat-slack check. Matches the in-test re-auth above.
                    _f.sent();
                    _f.label = 28;
                case 28:
                    _f.trys.push([28, 30, , 31]);
                    return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)];
                case 29:
                    _f.sent();
                    return [3 /*break*/, 31];
                case 30:
                    _e = _f.sent();
                    return [3 /*break*/, 31];
                case 31: return [7 /*endfinally*/];
                case 32: return [2 /*return*/];
            }
        });
    });
};
exports.data_sync_redaction_bypass_tests = data_sync_redaction_bypass_tests;
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
                    return [4 /*yield*/, (0, exports.data_sync_redaction_bypass_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ F-0001 data-sync redaction-bypass test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ F-0001 data-sync redaction-bypass test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=F-0001-data-sync-redaction-bypass.test.js.map