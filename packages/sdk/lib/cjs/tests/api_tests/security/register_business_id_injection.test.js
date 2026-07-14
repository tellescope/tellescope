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
exports.register_business_id_injection_tests = void 0;
require('source-map-support').install();
var axios_1 = __importDefault(require("axios"));
var sdk_1 = require("../../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../../setup");
var host = process.env.API_URL || 'http://localhost:8080';
var post = function (path, body, headers) {
    if (headers === void 0) { headers = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var res, err_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.post("".concat(host).concat(path), body, {
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
 * Reproduction + regression test for the reported vulnerability:
 *
 *   A @wearehackerone.com email "joined" a customer's organization without being invited, and
 *   duplicate user records existed for that email — each bound to a different businessId.
 *
 * Root cause: the public `POST /v1/users/register` endpoint. `addPublicEndpoint` accepts an
 * OPTIONAL, caller-supplied `businessId` (routing.ts) and bakes it into the handler's DB. The
 * register handler's only duplicate guard (`DB.users.findOne({ email })`) is therefore scoped to
 * whatever org the caller named, and the subsequent `DB.users.insertOne(...)` stamps that
 * caller-supplied businessId onto a new `accountType: 'Business'` user — bypassing the
 * globalUnique: ['email'] enforcement that only runs in the generic create route.
 *
 * The "victim org" here is the test admin's own org (sdk.userInfo.businessId): an org the
 * anonymous caller was never invited to. The admin is used purely to OBSERVE whether an
 * uninvited user record materialized inside their org (getOne({ email }) is org-scoped and
 * throws when the email is absent from the caller's tenant).
 *
 * Expected results:
 *   - VULNERABLE code: the assertions FAIL — the planted user appears inside the victim org,
 *     proving the exploit ("EXPLOIT CONFIRMED" in the failure message).
 *   - FIXED code: register ignores the caller-supplied businessId (self-signups are created
 *     org-less and duplicates are rejected globally), so nothing appears in the victim org and
 *     the assertions PASS.
 *
 * Uses unique emails per run (Date.now()) so re-runs never collide on the platform-wide unique
 * email constraint. NOTE: on the FIXED path these registrations create org-less user records
 * that an org-scoped admin cannot delete — harmless residue (unique emails), inherent to the
 * legitimate "root register, no org" signup behavior.
 */
var register_business_id_injection_tests = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var victimBusinessId, password, termsVersion, email1, before, res1, planted1, injectedIntoVictimOrg, email2, resRoot, resDup, planted2, duplicateInVictimOrg;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("register businessId injection");
                    victimBusinessId = sdk.userInfo.businessId;
                    password = 'testpassword123!';
                    termsVersion = '1';
                    email1 = "security+reg-inject-".concat(Date.now(), "@wearehackerone.com");
                    return [4 /*yield*/, sdk.api.users.getOne({ email: email1 }).catch(function () { return null; })];
                case 1:
                    before = _b.sent();
                    (0, testing_1.assert)(before === null, "precondition failed: ".concat(email1, " already present in victim org"), 'precondition: victim org has no such user');
                    return [4 /*yield*/, post('/v1/users/register', { email: email1, password: password, termsVersion: termsVersion, businessId: victimBusinessId })];
                case 2:
                    res1 = _b.sent();
                    console.log("   register(businessId=victim) -> HTTP ".concat(res1.status));
                    return [4 /*yield*/, sdk.api.users.getOne({ email: email1 }).catch(function () { return null; })];
                case 3:
                    planted1 = _b.sent();
                    injectedIntoVictimOrg = !!planted1 && planted1.businessId === victimBusinessId;
                    if (!(planted1 === null || planted1 === void 0 ? void 0 : planted1.id)) return [3 /*break*/, 5];
                    return [4 /*yield*/, sdk.api.users.deleteOne(planted1.id).catch(function () { })];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    (0, testing_1.assert)(!injectedIntoVictimOrg, "\u274C EXPLOIT CONFIRMED: anonymous POST /v1/users/register with businessId=".concat(victimBusinessId, " created user ")
                        + "".concat(email1, " (accountType=").concat(planted1 === null || planted1 === void 0 ? void 0 : planted1.accountType, ") inside the victim org \u2014 no invite required"), '✅ register ignores caller-supplied businessId — no user injected into victim org');
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1200)
                        // ==================================================================================
                        // Scenario 2 — cross-org duplicate for the same email
                        // First register with NO businessId (the legitimate "root register, no org" record —
                        // the "oldest" account in the report). Then register the SAME email WITH the victim
                        // businessId. On vulnerable code the scoped duplicate check misses the org-less record,
                        // so a SECOND user record for the same email is created inside the victim org.
                        // ==================================================================================
                    ]; // register endpoint rate-limits ~1/sec per IP
                case 6:
                    _b.sent(); // register endpoint rate-limits ~1/sec per IP
                    email2 = "security+reg-dup-".concat(Date.now(), "@wearehackerone.com");
                    return [4 /*yield*/, post('/v1/users/register', { email: email2, password: password, termsVersion: termsVersion })];
                case 7:
                    resRoot = _b.sent();
                    console.log("   register(no businessId) -> HTTP ".concat(resRoot.status));
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1200)];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, post('/v1/users/register', { email: email2, password: password, termsVersion: termsVersion, businessId: victimBusinessId })];
                case 9:
                    resDup = _b.sent();
                    console.log("   register(same email, businessId=victim) -> HTTP ".concat(resDup.status));
                    return [4 /*yield*/, sdk.api.users.getOne({ email: email2 }).catch(function () { return null; })];
                case 10:
                    planted2 = _b.sent();
                    duplicateInVictimOrg = !!planted2 && planted2.businessId === victimBusinessId;
                    if (!(planted2 === null || planted2 === void 0 ? void 0 : planted2.id)) return [3 /*break*/, 12];
                    return [4 /*yield*/, sdk.api.users.deleteOne(planted2.id).catch(function () { })];
                case 11:
                    _b.sent();
                    _b.label = 12;
                case 12:
                    (0, testing_1.assert)(!duplicateInVictimOrg, "\u274C EXPLOIT CONFIRMED: same email ".concat(email2, " registered into a second org \u2014 duplicate user ")
                        + "(accountType=".concat(planted2 === null || planted2 === void 0 ? void 0 : planted2.accountType, ") created in victim org ").concat(victimBusinessId), '✅ register enforces global email uniqueness — no cross-org duplicate created');
                    return [2 /*return*/];
            }
        });
    });
};
exports.register_business_id_injection_tests = register_business_id_injection_tests;
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
                    return [4 /*yield*/, (0, exports.register_business_id_injection_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ register businessId injection test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ register businessId injection test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=register_business_id_injection.test.js.map