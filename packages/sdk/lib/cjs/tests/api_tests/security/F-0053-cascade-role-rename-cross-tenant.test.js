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
exports.cascade_role_rename_cross_tenant_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../../setup");
var constants_1 = require("@tellescope/constants");
var host = process.env.API_URL || 'http://localhost:8080';
// Separate tenant (different businessId), reusing the same hardcoded apiKey that
// multi_tenant_tests relies on in tests.ts.
var OTHER_TENANT_API_KEY = "ba745e25162bb95a795c5fa1af70df188d93c4d3aac9c48b34a5c8c9dd7b80f7";
/**
 * Tenant-boundary guard for cascade_role_rename (relates to security-audit finding F-0053,
 * which was investigated and closed as a FALSE POSITIVE — see that file for the code trace).
 *
 * The `cascade_role_rename` side-effect handler
 * ([event_handlers_v2/role_based_access_permissions.ts](packages/private/api/api/v1/event_handlers_v2/role_based_access_permissions.ts))
 * runs when a `role_based_access_permissions` doc's `role` field changes. It finds every user
 * with the old role name (via `DBUnrestricted.users`) and rewrites their `roles` array, then
 * deauthenticates them. F-0053 hypothesized this query was globally cross-tenant. It is NOT:
 * `DBUnrestricted` bypasses per-user/per-role RBAC but is STILL scoped to the acting session's
 * `businessId` (see `modifyFilterForAccessConstraint` injecting `{ businessId }` at
 * database.ts:1761-1763, reached via the `unrestricted: true` branch at database.ts:2137-2144).
 *
 * This test locks that boundary in place so a future refactor of `DBUnrestricted` semantics
 * can't silently turn the cascade into a cross-tenant write:
 *   1. Tenant A creates a role `ROLE_OLD` and assigns it to a Tenant A user (positive control).
 *   2. Tenant B (separate businessId) has a user whose roles include the SAME `ROLE_OLD`.
 *   3. Tenant A renames the role `ROLE_OLD` -> `ROLE_NEW`.
 *   4. Assert the Tenant B user's roles are UNCHANGED (still `[ROLE_OLD]`)  <-- guards the tenant boundary.
 *   5. Assert the Tenant A user's roles ARE renamed to `[ROLE_NEW]`         <-- same-tenant cascade works.
 *
 * Expected on current (correct) code: BOTH assertions pass. A regression that drops the
 * `businessId` scoping would flip assertion #4 to red (Tenant B user becomes `[ROLE_NEW]`).
 *
 * A collision-proof unique role name (timestamped) is used so the test never touches real roles.
 */
var cascade_role_rename_cross_tenant_tests = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var stamp, ROLE_OLD, ROLE_NEW, sdkOther, rbapId, controlUserId, victimUserId, tenantABusinessId, rbap, controlUser, victimUser, victimBefore, controlBefore, victimAfter, controlAfter, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    (0, testing_1.log_header)("F-0053: cascade role rename cross-tenant regression");
                    stamp = Date.now();
                    ROLE_OLD = "XTenantRename_".concat(stamp);
                    ROLE_NEW = "".concat(ROLE_OLD, "_renamed");
                    sdkOther = new sdk_1.Session({ host: host, apiKey: OTHER_TENANT_API_KEY });
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, , 13, 26]);
                    tenantABusinessId = sdk.userInfo.businessId;
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.createOne({
                            role: ROLE_OLD,
                            permissions: __assign({}, constants_1.PROVIDER_PERMISSIONS),
                        })];
                case 2:
                    rbap = _e.sent();
                    rbapId = rbap.id;
                    return [4 /*yield*/, sdk.api.users.createOne({
                            email: "f0053-control-".concat(stamp, "@example.com"),
                            notificationEmailsDisabled: true,
                        })];
                case 3:
                    controlUser = _e.sent();
                    controlUserId = controlUser.id;
                    return [4 /*yield*/, sdk.api.users.updateOne(controlUserId, { roles: [ROLE_OLD] }, { replaceObjectFields: true })
                        // 3. Tenant B: create a throwaway victim user holding the SAME ROLE_OLD.
                    ];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, sdkOther.api.users.createOne({
                            email: "f0053-victim-".concat(stamp, "@example.com"),
                            notificationEmailsDisabled: true,
                        })];
                case 5:
                    victimUser = _e.sent();
                    victimUserId = victimUser.id;
                    return [4 /*yield*/, sdkOther.api.users.updateOne(victimUserId, { roles: [ROLE_OLD] }, { replaceObjectFields: true })
                        // 4. Setup sanity: tenants are distinct and both users actually hold ROLE_OLD before the rename.
                        //    (Distinguishes a setup failure from the security assertion below.)
                    ];
                case 6:
                    _e.sent();
                    // 4. Setup sanity: tenants are distinct and both users actually hold ROLE_OLD before the rename.
                    //    (Distinguishes a setup failure from the security assertion below.)
                    (0, testing_1.assert)(victimUser.businessId !== tenantABusinessId, "Victim user shares businessId with Tenant A (".concat(victimUser.businessId, ") \u2014 not a cross-tenant scenario"), 'F-0053 setup: tenants are distinct');
                    return [4 /*yield*/, sdkOther.api.users.getOne(victimUserId)];
                case 7:
                    victimBefore = _e.sent();
                    return [4 /*yield*/, sdk.api.users.getOne(controlUserId)];
                case 8:
                    controlBefore = _e.sent();
                    (0, testing_1.assert)(JSON.stringify(victimBefore.roles) === JSON.stringify([ROLE_OLD])
                        && JSON.stringify(controlBefore.roles) === JSON.stringify([ROLE_OLD]), "Setup failed: expected both users to hold [".concat(ROLE_OLD, "] (victim=").concat(JSON.stringify(victimBefore.roles), ", control=").concat(JSON.stringify(controlBefore.roles), ")"), 'F-0053 setup: both users hold ROLE_OLD');
                    // 5. Tenant A renames the role. This triggers cascade_role_rename.
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.updateOne(rbapId, { role: ROLE_NEW })];
                case 9:
                    // 5. Tenant A renames the role. This triggers cascade_role_rename.
                    _e.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1500)
                        // 6. SECURITY ASSERTION — the Tenant B victim must be untouched by Tenant A's rename.
                    ]; // let the side effect run
                case 10:
                    _e.sent(); // let the side effect run
                    return [4 /*yield*/, sdkOther.api.users.getOne(victimUserId)];
                case 11:
                    victimAfter = _e.sent();
                    (0, testing_1.assert)(JSON.stringify(victimAfter.roles) === JSON.stringify([ROLE_OLD]), "CROSS-TENANT LEAK: Tenant B victim roles changed to ".concat(JSON.stringify(victimAfter.roles), " ")
                        + "after Tenant A renamed its role. Expected [".concat(ROLE_OLD, "]."), 'F-0053: Tenant B user roles unaffected by other-tenant role rename');
                    return [4 /*yield*/, sdk.api.users.getOne(controlUserId)];
                case 12:
                    controlAfter = _e.sent();
                    (0, testing_1.assert)(JSON.stringify(controlAfter.roles) === JSON.stringify([ROLE_NEW]), "Same-tenant cascade broken: Tenant A control roles are ".concat(JSON.stringify(controlAfter.roles), ", ")
                        + "expected [".concat(ROLE_NEW, "]."), 'F-0053: Tenant A user roles renamed by same-tenant cascade');
                    return [3 /*break*/, 26];
                case 13:
                    if (!victimUserId) return [3 /*break*/, 17];
                    _e.label = 14;
                case 14:
                    _e.trys.push([14, 16, , 17]);
                    return [4 /*yield*/, sdkOther.api.users.deleteOne(victimUserId)];
                case 15:
                    _e.sent();
                    return [3 /*break*/, 17];
                case 16:
                    _b = _e.sent();
                    return [3 /*break*/, 17];
                case 17:
                    if (!controlUserId) return [3 /*break*/, 21];
                    _e.label = 18;
                case 18:
                    _e.trys.push([18, 20, , 21]);
                    return [4 /*yield*/, sdk.api.users.deleteOne(controlUserId)];
                case 19:
                    _e.sent();
                    return [3 /*break*/, 21];
                case 20:
                    _c = _e.sent();
                    return [3 /*break*/, 21];
                case 21:
                    if (!rbapId) return [3 /*break*/, 25];
                    _e.label = 22;
                case 22:
                    _e.trys.push([22, 24, , 25]);
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.deleteOne(rbapId)];
                case 23:
                    _e.sent();
                    return [3 /*break*/, 25];
                case 24:
                    _d = _e.sent();
                    return [3 /*break*/, 25];
                case 25: return [7 /*endfinally*/];
                case 26: return [2 /*return*/];
            }
        });
    });
};
exports.cascade_role_rename_cross_tenant_tests = cascade_role_rename_cross_tenant_tests;
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
                    return [4 /*yield*/, (0, exports.cascade_role_rename_cross_tenant_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ F-0053 cascade role rename cross-tenant test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ F-0053 cascade role rename cross-tenant test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=F-0053-cascade-role-rename-cross-tenant.test.js.map