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
exports.ai_conversations_rbac_tests = void 0;
require('source-map-support').install();
var bson_1 = require("bson");
var sdk_1 = require("../../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../../setup");
var constants_1 = require("@tellescope/constants");
var host = process.env.API_URL || 'http://localhost:8080';
var _a = [process.env.NON_ADMIN_EMAIL, process.env.NON_ADMIN_PASSWORD], nonAdminEmail = _a[0], nonAdminPassword = _a[1];
/**
 * Regression test for F-0005 (security-audit/findings/F-0005-ai-conversations-bypass-rbac.md).
 *
 * Both `ai_conversations.send_message` and `ai_conversations.generate_ai_decision` are
 * registered with `noAccessPermissions: true` ([api.ts:22699, 22721](packages/private/api/api/v1/api.ts)).
 * Their only access gate is `if (req.session.type === 'enduser') throw 403`. They must ALSO
 * check `session.access?.ai_conversations?.<action>` (and `session.access?.endusers?.read`
 * for generate_ai_decision) — the standard pattern used 16 lines earlier in the same file
 * at api.ts:22680 for the background_errors handler.
 *
 * This test:
 *   1. Creates a role with explicit NO_ACCESS for ai_conversations (and endusers).
 *   2. Assigns the role to the non-admin user.
 *   3. Calls each endpoint as the non-admin.
 *   4. Asserts each endpoint returns a 403-equivalent error (not 200).
 *   5. Positive case: a role granting ai_conversations create (read/update denied) must pass
 *      the send_message gate — generating a NEW conversation requires only create access.
 *   6. But the same role must still 403 when passing a conversationId: continuing an existing
 *      conversation reads its stored history (returned in the response) and appends to it,
 *      so it requires read + update access in addition to create.
 *   7. Default-provider-permissions role (ai_conversations = Assigned): send_message must not
 *      500. Regression: the post-generation $push previously ran through the caller's
 *      access-scoped DB, where "Assigned" filters can't match the just-created conversation,
 *      returning null and crashing the handler (Cannot read properties of null '_id') after
 *      credits were consumed. bedrock.ts now persists via tenant-scoped org-wide queries.
 *
 * Pre-fix:
 *   - send_message: 200 (or some downstream error from Bedrock) — NOT 403. Test fails.
 *   - generate_ai_decision: 200 with `{}` (handler responds early before access check). Test fails.
 *
 * Post-fix: both endpoints throw 403 before any work happens. Test passes.
 */
var ai_conversations_rbac_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var roleName, grantRoleName, assignedRoleName, rbapId, grantRbapId, assignedRbapId, originalRoles, rbap, grantRbap, assignedRbap, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    (0, testing_1.log_header)("F-0005: ai_conversations RBAC bypass regression");
                    roleName = "f0005-ai-conversations-no-access-".concat(Date.now());
                    grantRoleName = "f0005-ai-conversations-create-granted-".concat(Date.now());
                    assignedRoleName = "f0005-ai-conversations-assigned-default-".concat(Date.now());
                    originalRoles = sdkNonAdmin.userInfo.roles;
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, , 19, 40]);
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.createOne({
                            role: roleName,
                            permissions: __assign(__assign({}, constants_1.PROVIDER_PERMISSIONS), { ai_conversations: { create: null, read: null, update: null, delete: null }, endusers: { create: null, read: null, update: null, delete: null } }),
                        })];
                case 2:
                    rbap = _g.sent();
                    rbapId = rbap.id;
                    // 2. Assign the role to the non-admin user and re-authenticate so the new
                    //    session reflects the role's denied permissions.
                    return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [roleName] }, { replaceObjectFields: true })];
                case 3:
                    // 2. Assign the role to the non-admin user and re-authenticate so the new
                    //    session reflects the role's denied permissions.
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1500)];
                case 4:
                    _g.sent();
                    return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)
                        // 3a. send_message must throw 403 (or equivalent access error). Pre-fix: succeeds (or
                        //     fails downstream in Bedrock without 403). Post-fix: throws before any work.
                    ];
                case 5:
                    _g.sent();
                    // 3a. send_message must throw 403 (or equivalent access error). Pre-fix: succeeds (or
                    //     fails downstream in Bedrock without 403). Post-fix: throws before any work.
                    return [4 /*yield*/, (0, testing_1.async_test)("F-0005: ai_conversations.send_message must throw 403 when role denies ai_conversations", function () { return sdkNonAdmin.api.ai_conversations.send_message({
                            message: 'F-0005 regression test',
                            type: 'Test',
                        }); }, {
                            shouldError: true,
                            onError: function (e) {
                                var _a, _b;
                                // Accept any 4xx access-denial response — handler may use 403 (recommended)
                                // or 400 with "access" / "permission" in the message.
                                var msg = ((_a = e === null || e === void 0 ? void 0 : e.message) !== null && _a !== void 0 ? _a : '').toLowerCase();
                                var status = (_b = e === null || e === void 0 ? void 0 : e.status) !== null && _b !== void 0 ? _b : e === null || e === void 0 ? void 0 : e.code;
                                return status === 403 || status === 401
                                    || msg.includes('access') || msg.includes('permission') || msg.includes('forbidden');
                            },
                        })
                        // 3b. generate_ai_decision must throw 403 BEFORE the early res.json({}) response.
                        //     Pre-fix: handler responds 200 with {} immediately and processes in background.
                        //     Post-fix: handler throws 403 before res.json({}).
                    ];
                case 6:
                    // 3a. send_message must throw 403 (or equivalent access error). Pre-fix: succeeds (or
                    //     fails downstream in Bedrock without 403). Post-fix: throws before any work.
                    _g.sent();
                    // 3b. generate_ai_decision must throw 403 BEFORE the early res.json({}) response.
                    //     Pre-fix: handler responds 200 with {} immediately and processes in background.
                    //     Post-fix: handler throws 403 before res.json({}).
                    return [4 /*yield*/, (0, testing_1.async_test)("F-0005: ai_conversations.generate_ai_decision must throw 403 when role denies endusers/ai_conversations", function () { return sdkNonAdmin.api.ai_conversations.generate_ai_decision({
                            enduserId: new bson_1.ObjectId().toHexString(),
                            automationStepId: new bson_1.ObjectId().toHexString(),
                            outcomes: ['yes', 'no'],
                            prompt: 'F-0005 regression test',
                            sources: [{ type: 'SMS', limit: 1 }], // non-empty so the validator passes; access check then fires
                        }); }, {
                            shouldError: true,
                            onError: function (e) {
                                var _a, _b;
                                var msg = ((_a = e === null || e === void 0 ? void 0 : e.message) !== null && _a !== void 0 ? _a : '').toLowerCase();
                                var status = (_b = e === null || e === void 0 ? void 0 : e.status) !== null && _b !== void 0 ? _b : e === null || e === void 0 ? void 0 : e.code;
                                return status === 403 || status === 401
                                    || msg.includes('access') || msg.includes('permission') || msg.includes('forbidden');
                            },
                        })
                        // 4. Positive case: granting only ai_conversations create must pass the RBAC gate.
                        //    send_message may still fail downstream (e.g. 400 "Organization has not set up credits"),
                        //    but it must NOT be an access-denial error.
                    ];
                case 7:
                    // 3b. generate_ai_decision must throw 403 BEFORE the early res.json({}) response.
                    //     Pre-fix: handler responds 200 with {} immediately and processes in background.
                    //     Post-fix: handler throws 403 before res.json({}).
                    _g.sent();
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.createOne({
                            role: grantRoleName,
                            permissions: __assign(__assign({}, constants_1.PROVIDER_PERMISSIONS), { ai_conversations: { create: 'All', read: null, update: null, delete: null } }),
                        })];
                case 8:
                    grantRbap = _g.sent();
                    grantRbapId = grantRbap.id;
                    return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [grantRoleName] }, { replaceObjectFields: true })];
                case 9:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1500)];
                case 10:
                    _g.sent();
                    return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)];
                case 11:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("F-0005: ai_conversations.send_message must NOT be access-denied when role grants create", function () { return sdkNonAdmin.api.ai_conversations.send_message({
                            message: 'F-0005 positive-case test',
                            type: 'Test',
                            maxTokens: 1,
                        })
                            .then(function () { return 'allowed'; })
                            .catch(function (e) {
                            var _a, _b;
                            var msg = ((_a = e === null || e === void 0 ? void 0 : e.message) !== null && _a !== void 0 ? _a : '').toLowerCase();
                            var status = (_b = e === null || e === void 0 ? void 0 : e.status) !== null && _b !== void 0 ? _b : e === null || e === void 0 ? void 0 : e.code;
                            if (status === 403 || status === 401
                                || msg.includes('access') || msg.includes('permission') || msg.includes('forbidden')) {
                                throw e; // access denial — the gate incorrectly blocked a create-granted role
                            }
                            return 'allowed'; // downstream (e.g. credits) error is fine — the gate passed
                        }); }, { onResult: function (r) { return r === 'allowed'; } })
                        // 5. The create-granted (read/update-denied) role must still be blocked from CONTINUING an
                        //    existing conversation — send_message with conversationId returns the full stored history
                        //    and appends to it. Fake id is fine: the access check must fire before any lookup.
                    ];
                case 12:
                    _g.sent();
                    // 5. The create-granted (read/update-denied) role must still be blocked from CONTINUING an
                    //    existing conversation — send_message with conversationId returns the full stored history
                    //    and appends to it. Fake id is fine: the access check must fire before any lookup.
                    return [4 /*yield*/, (0, testing_1.async_test)("F-0005: ai_conversations.send_message with conversationId must 403 when role denies read/update", function () { return sdkNonAdmin.api.ai_conversations.send_message({
                            message: 'F-0005 conversationId bypass test',
                            type: 'Test',
                            maxTokens: 1,
                            conversationId: new bson_1.ObjectId().toHexString(),
                        }); }, {
                            shouldError: true,
                            onError: function (e) {
                                var _a, _b;
                                var msg = ((_a = e === null || e === void 0 ? void 0 : e.message) !== null && _a !== void 0 ? _a : '').toLowerCase();
                                var status = (_b = e === null || e === void 0 ? void 0 : e.status) !== null && _b !== void 0 ? _b : e === null || e === void 0 ? void 0 : e.code;
                                return status === 403 || status === 401
                                    || msg.includes('access') || msg.includes('permission') || msg.includes('forbidden');
                            },
                        })
                        // 6. Regression: a role with default provider permissions (ai_conversations = Assigned)
                        //    must be able to generate a new conversation without a 500. Previously the
                        //    post-generation $push ran through the access-scoped DB, matched nothing under
                        //    "Assigned", and crashed the handler with "Cannot read properties of null ('_id')".
                    ];
                case 13:
                    // 5. The create-granted (read/update-denied) role must still be blocked from CONTINUING an
                    //    existing conversation — send_message with conversationId returns the full stored history
                    //    and appends to it. Fake id is fine: the access check must fire before any lookup.
                    _g.sent();
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.createOne({
                            role: assignedRoleName,
                            permissions: __assign({}, constants_1.PROVIDER_PERMISSIONS),
                        })];
                case 14:
                    assignedRbap = _g.sent();
                    assignedRbapId = assignedRbap.id;
                    return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [assignedRoleName] }, { replaceObjectFields: true })];
                case 15:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1500)];
                case 16:
                    _g.sent();
                    return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)];
                case 17:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("F-0005: ai_conversations.send_message must not 500 for Assigned-access (default provider) role", function () { return sdkNonAdmin.api.ai_conversations.send_message({
                            message: 'F-0005 assigned-access regression test',
                            type: 'Test',
                            maxTokens: 1,
                        })
                            .then(function () { return 'ok'; })
                            .catch(function (e) {
                            var _a, _b;
                            var msg = ((_a = e === null || e === void 0 ? void 0 : e.message) !== null && _a !== void 0 ? _a : '').toLowerCase();
                            var status = (_b = e === null || e === void 0 ? void 0 : e.status) !== null && _b !== void 0 ? _b : e === null || e === void 0 ? void 0 : e.code;
                            if (status === 500 || msg.includes('internal error') || msg.includes('cannot read properties')) {
                                throw e; // the null-update crash — regression
                            }
                            if (status === 403 || status === 401
                                || msg.includes('access') || msg.includes('permission') || msg.includes('forbidden')) {
                                throw e; // Assigned access must pass the RBAC gate
                            }
                            return 'ok'; // downstream (e.g. credits) error is fine
                        }); }, { onResult: function (r) { return r === 'ok'; } })];
                case 18:
                    _g.sent();
                    return [3 /*break*/, 40];
                case 19:
                    _g.trys.push([19, 21, , 22]);
                    return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: originalRoles !== null && originalRoles !== void 0 ? originalRoles : [] }, { replaceObjectFields: true })];
                case 20:
                    _g.sent();
                    return [3 /*break*/, 22];
                case 21:
                    _b = _g.sent();
                    return [3 /*break*/, 22];
                case 22:
                    if (!rbapId) return [3 /*break*/, 26];
                    _g.label = 23;
                case 23:
                    _g.trys.push([23, 25, , 26]);
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.deleteOne(rbapId)];
                case 24:
                    _g.sent();
                    return [3 /*break*/, 26];
                case 25:
                    _c = _g.sent();
                    return [3 /*break*/, 26];
                case 26:
                    if (!grantRbapId) return [3 /*break*/, 30];
                    _g.label = 27;
                case 27:
                    _g.trys.push([27, 29, , 30]);
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.deleteOne(grantRbapId)];
                case 28:
                    _g.sent();
                    return [3 /*break*/, 30];
                case 29:
                    _d = _g.sent();
                    return [3 /*break*/, 30];
                case 30:
                    if (!assignedRbapId) return [3 /*break*/, 34];
                    _g.label = 31;
                case 31:
                    _g.trys.push([31, 33, , 34]);
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.deleteOne(assignedRbapId)];
                case 32:
                    _g.sent();
                    return [3 /*break*/, 34];
                case 33:
                    _e = _g.sent();
                    return [3 /*break*/, 34];
                case 34: 
                // Re-authenticate the non-admin to drop the no-access role from their JWT
                // before subsequent tests run.
                // Role restore above re-triggers deauthenticate_user; wait > 1s so the freshly minted
                // token's (second-floored) iat lands after the deauth timestamp and isn't permanently
                // rejected by is_logged_in's iat-slack check. Matches the in-test re-auth above.
                return [4 /*yield*/, (0, testing_1.wait)(undefined, 1500)];
                case 35:
                    // Re-authenticate the non-admin to drop the no-access role from their JWT
                    // before subsequent tests run.
                    // Role restore above re-triggers deauthenticate_user; wait > 1s so the freshly minted
                    // token's (second-floored) iat lands after the deauth timestamp and isn't permanently
                    // rejected by is_logged_in's iat-slack check. Matches the in-test re-auth above.
                    _g.sent();
                    _g.label = 36;
                case 36:
                    _g.trys.push([36, 38, , 39]);
                    return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)];
                case 37:
                    _g.sent();
                    return [3 /*break*/, 39];
                case 38:
                    _f = _g.sent();
                    return [3 /*break*/, 39];
                case 39: return [7 /*endfinally*/];
                case 40: return [2 /*return*/];
            }
        });
    });
};
exports.ai_conversations_rbac_tests = ai_conversations_rbac_tests;
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
                    return [4 /*yield*/, (0, exports.ai_conversations_rbac_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ F-0005 ai_conversations RBAC test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ F-0005 ai_conversations RBAC test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=F-0005-ai-conversations-rbac.test.js.map