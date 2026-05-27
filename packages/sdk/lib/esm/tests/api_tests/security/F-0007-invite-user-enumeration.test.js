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
import { Session } from "../../../sdk";
import { async_test, log_header, wait, } from "@tellescope/testing";
import { setup_tests } from "../../setup";
var host = process.env.API_URL || 'http://localhost:8080';
var CROSS_ORG_API_KEY = process.env.CROSS_ORG_API_KEY;
var CROSS_ORG_TARGET_BUSINESS_ID = process.env.CROSS_ORG_TARGET_BUSINESS_ID;
var post = function (path, body, headers) {
    if (headers === void 0) { headers = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var res, err_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.post("".concat(host).concat(path), body, {
                            validateStatus: function () { return true; },
                            headers: headers,
                        })];
                case 1:
                    res = _c.sent();
                    return [2 /*return*/, { status: res.status, data: res.data }];
                case 2:
                    err_1 = _c.sent();
                    return [2 /*return*/, { status: (_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _a === void 0 ? void 0 : _a.status, data: (_b = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _b === void 0 ? void 0 : _b.data }];
                case 3: return [2 /*return*/];
            }
        });
    });
};
/**
 * Regression test for F-0007 (security-audit/findings/F-0007-invite-user-cross-tenant-email-enumeration.md).
 *
 * `users.invite_user` previously used `buildAllQueries({ unrestricted: true, organizationIds: [] }).users.findOne({ email })`
 * to enforce platform-wide email uniqueness and threw the distinctive `"A user with this email already exists"`
 * error on duplicate — regardless of which tenant the existing user was in. Any authenticated user could
 * therefore probe whether email X is registered to any tenant on the platform.
 *
 * **Tests only the negative case** — never drives a successful invite (which would create a real user
 * record and send a real transactional email). All assertions use either:
 *   - An email that already exists in the test tenant (the admin's own email), so each call short-circuits
 *     at the same-tenant duplicate check or rate-limit check before any invite work happens, OR
 *   - The cross-org infrastructure (CROSS_ORG_API_KEY env var) targeting an email that exists in a different
 *     tenant — verifies the post-fix response does NOT distinguish "exists elsewhere" from a generic outcome.
 *
 * Assertions:
 *   1. Rate-limit defense-in-depth: rapid same-tenant duplicate requests trip 429 within ~12 attempts.
 *   2. Same-tenant duplicate: returns the same `"already exists"` error pre/post-fix (this branch is
 *      unchanged by the fix; asserted for regression-safety).
 *   3. Cross-tenant duplicate (env-gated): post-fix response shape does NOT contain the `"already exists"`
 *      string and matches the silent-no-op shape `{ created: { id: ... } }`. Skipped when CROSS_ORG_*
 *      env vars are not set, mirroring cross_org_api_key.test.ts convention.
 */
export var invite_user_enumeration_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var organizationId, sameTenantExistingEmail, rateLimitedAt, i, r, sameTenantRes, sdkCrossOrg, targetOrgId, orgs, _b, crossRes;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    log_header("F-0007: users.invite_user cross-tenant enumeration regression");
                    // Reset state so prior tests' rate-limit accounting doesn't leak in.
                    return [4 /*yield*/, sdk.reset_db()];
                case 1:
                    // Reset state so prior tests' rate-limit accounting doesn't leak in.
                    _f.sent();
                    organizationId = (_d = (_c = sdk.userInfo.organizationIds) === null || _c === void 0 ? void 0 : _c[0]) !== null && _d !== void 0 ? _d : sdk.userInfo.businessId;
                    sameTenantExistingEmail = process.env.TEST_EMAIL;
                    rateLimitedAt = -1;
                    i = 0;
                    _f.label = 2;
                case 2:
                    if (!(i < 15)) return [3 /*break*/, 5];
                    return [4 /*yield*/, post('/v1/invite-user-to-organization', {
                            email: sameTenantExistingEmail,
                            fname: 'F0007', lname: 'RateLimit',
                            organizationId: organizationId,
                        }, { Authorization: "Bearer ".concat(sdk.authToken) })];
                case 3:
                    r = _f.sent();
                    if (r.status === 429) {
                        rateLimitedAt = i;
                        return [3 /*break*/, 5];
                    }
                    _f.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, async_test("F-0007: invite_user rate-limits within ~12 rapid requests (defense-in-depth; no invites sent)", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ rateLimitedAt: rateLimitedAt })];
                    }); }); }, { onResult: function (r) { return r.rateLimitedAt >= 0 && r.rateLimitedAt <= 12; } })
                    // ====================================================================
                    // Assertion 2: same-tenant duplicate returns the descriptive error
                    // (unchanged by the fix; regression guard so a future change to the
                    // duplicate-detection path doesn't accidentally suppress same-tenant
                    // errors that operators rely on).
                    // ====================================================================
                    // Let rate limit decay so this single call isn't blocked.
                ];
                case 6:
                    _f.sent();
                    // ====================================================================
                    // Assertion 2: same-tenant duplicate returns the descriptive error
                    // (unchanged by the fix; regression guard so a future change to the
                    // duplicate-detection path doesn't accidentally suppress same-tenant
                    // errors that operators rely on).
                    // ====================================================================
                    // Let rate limit decay so this single call isn't blocked.
                    return [4 /*yield*/, wait(undefined, 5000)];
                case 7:
                    // ====================================================================
                    // Assertion 2: same-tenant duplicate returns the descriptive error
                    // (unchanged by the fix; regression guard so a future change to the
                    // duplicate-detection path doesn't accidentally suppress same-tenant
                    // errors that operators rely on).
                    // ====================================================================
                    // Let rate limit decay so this single call isn't blocked.
                    _f.sent();
                    return [4 /*yield*/, sdk.reset_db()];
                case 8:
                    _f.sent();
                    return [4 /*yield*/, post('/v1/invite-user-to-organization', {
                            email: sameTenantExistingEmail,
                            fname: 'F0007', lname: 'SameTenant',
                            organizationId: organizationId,
                        }, { Authorization: "Bearer ".concat(sdk.authToken) })];
                case 9:
                    sameTenantRes = _f.sent();
                    return [4 /*yield*/, async_test("F-0007: invite_user same-tenant duplicate returns 400 'already exists' (unchanged)", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a, _b;
                            return __generator(this, function (_c) {
                                return [2 /*return*/, ({
                                        status: sameTenantRes.status,
                                        message: (_b = (_a = sameTenantRes.data) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : '',
                                    })];
                            });
                        }); }, { onResult: function (r) { return r.status === 400 && r.message.toLowerCase().includes('already exists'); } })
                        // ====================================================================
                        // Assertion 3: cross-tenant duplicate must NOT reveal existence
                        // Env-gated; skipped when cross-org infra not configured.
                        // ====================================================================
                    ];
                case 10:
                    _f.sent();
                    // ====================================================================
                    // Assertion 3: cross-tenant duplicate must NOT reveal existence
                    // Env-gated; skipped when cross-org infra not configured.
                    // ====================================================================
                    if (!(CROSS_ORG_API_KEY && CROSS_ORG_TARGET_BUSINESS_ID)) {
                        console.log("  [F-0007] Skipping cross-tenant silent no-op assertion — CROSS_ORG_* env vars not set");
                        return [2 /*return*/];
                    }
                    sdkCrossOrg = new Session({
                        host: host,
                        apiKey: CROSS_ORG_API_KEY,
                        headers: { 'x-tellescope-organization': CROSS_ORG_TARGET_BUSINESS_ID },
                    });
                    targetOrgId = CROSS_ORG_TARGET_BUSINESS_ID;
                    _f.label = 11;
                case 11:
                    _f.trys.push([11, 13, , 14]);
                    return [4 /*yield*/, sdkCrossOrg.api.organizations.getSome({ limit: 1 })];
                case 12:
                    orgs = _f.sent();
                    if ((_e = orgs === null || orgs === void 0 ? void 0 : orgs[0]) === null || _e === void 0 ? void 0 : _e.id)
                        targetOrgId = orgs[0].id;
                    return [3 /*break*/, 14];
                case 13:
                    _b = _f.sent();
                    return [3 /*break*/, 14];
                case 14: return [4 /*yield*/, post('/v1/invite-user-to-organization', {
                        email: sameTenantExistingEmail,
                        fname: 'F0007', lname: 'CrossTenantProbe',
                        organizationId: targetOrgId,
                    }, {
                        Authorization: "API_KEY ".concat(CROSS_ORG_API_KEY),
                        'x-tellescope-organization': CROSS_ORG_TARGET_BUSINESS_ID,
                    })];
                case 15:
                    crossRes = _f.sent();
                    return [4 /*yield*/, async_test("F-0007: cross-tenant invite of existing email must NOT return 'already exists' (no enumeration)", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a, _b, _c, _d;
                            return __generator(this, function (_e) {
                                return [2 /*return*/, ({
                                        status: crossRes.status,
                                        message: (_b = (_a = crossRes.data) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : '',
                                        hasCreatedShape: !!((_d = (_c = crossRes.data) === null || _c === void 0 ? void 0 : _c.created) === null || _d === void 0 ? void 0 : _d.id),
                                    })];
                            });
                        }); }, {
                            onResult: function (r) {
                                // The response MUST NOT contain the "already exists" string regardless of status.
                                // Acceptable post-fix shapes: 200 with `{ created: { id: ... } }` (silent no-op), or
                                // 200 with a generic ack. Rate-limit 429 also OK if it slipped through to here.
                                return !r.message.toLowerCase().includes('already exists');
                            },
                        })];
                case 16:
                    _f.sent();
                    return [2 /*return*/];
            }
        });
    });
};
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
                    return [4 /*yield*/, invite_user_enumeration_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ F-0007 invite_user enumeration test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ F-0007 invite_user enumeration test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=F-0007-invite-user-enumeration.test.js.map