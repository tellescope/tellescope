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
import { Session } from "../../../sdk";
import { assert, log_header, wait, } from "@tellescope/testing";
import { setup_tests } from "../../setup";
var host = process.env.API_URL || 'http://localhost:8080';
/**
 * Self-role privilege-escalation guard (relates to security-audit finding F-0076, which was
 * investigated and closed as a FALSE POSITIVE — see that file for the full code trace).
 *
 * F-0076 hypothesized that a non-admin staff user could `PATCH /v1/users/{their-own-id}` with
 * `{ roles: ['Admin'] }` and self-promote to Admin, because the FIRST `users` relationship
 * constraint ("Only admin users can set the admin role",
 * [schema.ts:3446](packages/public/schema/src/schema.ts#L3446)) has a self-exception
 * (`if (_id === session.id) return`).
 *
 * That analysis missed the SECOND constraint, "Only admin users can update user roles"
 * ([schema.ts:3486](packages/public/schema/src/schema.ts#L3486)), which has NO self-exception.
 * Relationship constraints are AND-evaluated — `validateRelationshipConstraints`
 * ([routing.ts:1240-1252](packages/private/api/api/modules/routing.ts#L1240)) loops the whole
 * array and throws 400 on the FIRST evaluator that returns a string. So a non-admin self-update
 * that includes `roles` passes constraint #1 (self-exception) but is rejected by constraint #2.
 * The self-promotion is blocked.
 *
 * This test locks that boundary in place so a future refactor of the role constraints can't
 * silently reintroduce the escalation. A dedicated throwaway non-admin user is used as the
 * "attacker" (we never mutate the shared sdkNonAdmin's roles):
 *   1. Admin creates a throwaway user and assigns it a non-admin role (`['Provider']`).
 *   2. Authenticate AS that user via a freshly-minted auth token.
 *   3. As the attacker, attempt four self-role mutations — ['Admin'], ['Provider','Admin'],
 *      an arbitrary role, and [] — and assert EACH is blocked.       <-- the security assertions
 *   4. Confirm (as admin) the attacker's roles are still ['Provider'] — nothing slipped through.
 *   5. Positive control: admin CAN update the throwaway user's roles. <-- guards against an
 *      over-restrictive regression that would block legitimate admin role management.
 *
 * Expected on current (correct) code: all assertions pass. A regression that made the self-update
 * path role-writable by non-admins would flip the step-3/step-4 assertions to red.
 */
export var self_admin_role_assignment_tests = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var stamp, NON_ADMIN_ROLE, expect_blocked, attackerId, attacker, attackerBefore, sdkAttacker_1, _b, attackerAfter, afterAdminUpdate, _c;
        var _d;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    log_header("F-0076: self-admin role assignment privilege-escalation regression");
                    stamp = Date.now();
                    NON_ADMIN_ROLE = 'Provider';
                    expect_blocked = function (fn, description) { return __awaiter(void 0, void 0, void 0, function () {
                        var e_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, fn()];
                                case 1:
                                    _a.sent();
                                    assert(false, "".concat(description, " - SELF-ROLE ESCALATION SUCCEEDED (expected it to be blocked)"));
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_1 = _a.sent();
                                    // CRUD relationship-constraint failures surface as 400 { message, info } via SDK parseError.
                                    assert((e_1 === null || e_1 === void 0 ? void 0 : e_1.code) === 400 || (e_1 === null || e_1 === void 0 ? void 0 : e_1.statusCode) === 400 || typeof (e_1 === null || e_1 === void 0 ? void 0 : e_1.message) === 'string', "".concat(description, " - expected a block error, got: ").concat(JSON.stringify(e_1)), description);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); };
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, , 15, 20]);
                    return [4 /*yield*/, sdk.api.users.createOne({
                            email: "f0076-attacker-".concat(stamp, "@example.com"),
                            notificationEmailsDisabled: true,
                            verifiedEmail: true,
                        })];
                case 2:
                    attacker = _f.sent();
                    attackerId = attacker.id;
                    return [4 /*yield*/, sdk.api.users.updateOne(attackerId, { roles: [NON_ADMIN_ROLE] }, { replaceObjectFields: true })];
                case 3:
                    _f.sent();
                    return [4 /*yield*/, wait(undefined, 2000)
                        // Setup sanity: the attacker holds exactly the non-admin role and is NOT an admin.
                    ]; // role change triggers a logout; let it propagate before minting a token
                case 4:
                    _f.sent(); // role change triggers a logout; let it propagate before minting a token
                    return [4 /*yield*/, sdk.api.users.getOne(attackerId)];
                case 5:
                    attackerBefore = _f.sent();
                    assert(JSON.stringify(attackerBefore.roles) === JSON.stringify([NON_ADMIN_ROLE]), "Setup failed: expected attacker to hold [".concat(NON_ADMIN_ROLE, "], got ").concat(JSON.stringify(attackerBefore.roles)), 'F-0076 setup: attacker holds a non-admin role');
                    _b = Session.bind;
                    _d = {
                        host: host
                    };
                    return [4 /*yield*/, sdk.api.users.generate_auth_token({ id: attackerId })];
                case 6:
                    sdkAttacker_1 = new (_b.apply(Session, [void 0, (_d.authToken = (_f.sent()).authToken,
                            _d)]))();
                    return [4 /*yield*/, sdkAttacker_1.refresh_session()]; // populate userInfo from the freshly-minted token
                case 7:
                    _f.sent(); // populate userInfo from the freshly-minted token
                    assert(sdkAttacker_1.userInfo.id === attackerId && !((_e = sdkAttacker_1.userInfo.roles) !== null && _e !== void 0 ? _e : []).includes('Admin'), "Setup failed: attacker session is not the expected non-admin user", 'F-0076 setup: authenticated as the non-admin attacker');
                    // 3. SECURITY ASSERTIONS — every self-role mutation by the non-admin must be blocked.
                    return [4 /*yield*/, expect_blocked(function () { return sdkAttacker_1.api.users.updateOne(attackerId, { roles: ['Admin'] }, { replaceObjectFields: true }); }, 'F-0076: non-admin self-update to [Admin] is blocked')];
                case 8:
                    // 3. SECURITY ASSERTIONS — every self-role mutation by the non-admin must be blocked.
                    _f.sent();
                    return [4 /*yield*/, expect_blocked(function () { return sdkAttacker_1.api.users.updateOne(attackerId, { roles: [NON_ADMIN_ROLE, 'Admin'] }, { replaceObjectFields: true }); }, 'F-0076: non-admin self-update to [Provider, Admin] is blocked')];
                case 9:
                    _f.sent();
                    return [4 /*yield*/, expect_blocked(function () { return sdkAttacker_1.api.users.updateOne(attackerId, { roles: ["Arbitrary_".concat(stamp)] }, { replaceObjectFields: true }); }, 'F-0076: non-admin self-update to an arbitrary role is blocked')];
                case 10:
                    _f.sent();
                    return [4 /*yield*/, expect_blocked(function () { return sdkAttacker_1.api.users.updateOne(attackerId, { roles: [] }, { replaceObjectFields: true }); }, 'F-0076: non-admin self-update to [] (would grant defaults) is blocked')
                        // 4. STATE ASSERTION — nothing slipped through; roles are still the original non-admin role.
                    ];
                case 11:
                    _f.sent();
                    return [4 /*yield*/, sdk.api.users.getOne(attackerId)];
                case 12:
                    attackerAfter = _f.sent();
                    assert(JSON.stringify(attackerAfter.roles) === JSON.stringify([NON_ADMIN_ROLE]), "ESCALATION LEAK: attacker roles changed to ".concat(JSON.stringify(attackerAfter.roles), " ")
                        + "after self-update attempts. Expected [".concat(NON_ADMIN_ROLE, "]."), 'F-0076: attacker roles unchanged after all self-escalation attempts');
                    // 5. POSITIVE CONTROL — an Admin CAN update the user's roles (mechanism is not over-restricted).
                    return [4 /*yield*/, sdk.api.users.updateOne(attackerId, { roles: [NON_ADMIN_ROLE] }, { replaceObjectFields: true })];
                case 13:
                    // 5. POSITIVE CONTROL — an Admin CAN update the user's roles (mechanism is not over-restricted).
                    _f.sent();
                    return [4 /*yield*/, sdk.api.users.getOne(attackerId)];
                case 14:
                    afterAdminUpdate = _f.sent();
                    assert(JSON.stringify(afterAdminUpdate.roles) === JSON.stringify([NON_ADMIN_ROLE]), "Admin role update failed: roles are ".concat(JSON.stringify(afterAdminUpdate.roles), ", expected [").concat(NON_ADMIN_ROLE, "]"), 'F-0076: admin can manage user roles (positive control)');
                    return [3 /*break*/, 20];
                case 15:
                    if (!attackerId) return [3 /*break*/, 19];
                    _f.label = 16;
                case 16:
                    _f.trys.push([16, 18, , 19]);
                    return [4 /*yield*/, sdk.api.users.deleteOne(attackerId)];
                case 17:
                    _f.sent();
                    return [3 /*break*/, 19];
                case 18:
                    _c = _f.sent();
                    return [3 /*break*/, 19];
                case 19: return [7 /*endfinally*/];
                case 20: return [2 /*return*/];
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
                    return [4 /*yield*/, self_admin_role_assignment_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ F-0076 self-admin role assignment test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ F-0076 self-admin role assignment test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=F-0076-self-admin-role-assignment.test.js.map