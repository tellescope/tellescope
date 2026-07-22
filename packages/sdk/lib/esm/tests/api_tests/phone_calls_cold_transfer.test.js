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
import { async_test, handleAnyError, log_header, } from "@tellescope/testing";
import { setup_tests } from "../setup";
var host = process.env.API_URL || 'http://localhost:8080';
var NONEXISTENT_MONGO_ID = '60398b1131a295e64f084fff';
// Validation-path tests for the cold transfer endpoint. All assertions below hit
// validations that run before any Twilio access, so no Twilio config is needed.
export var phone_calls_cold_transfer_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var enduser, targetUsers, inboundCall_1, outboundCall_1, disabledTargetUser_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_header("Phone Calls Cold Transfer Tests");
                    return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'Cold', lname: 'Transfer' })];
                case 1:
                    enduser = _b.sent();
                    targetUsers = [];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 12, 14]);
                    return [4 /*yield*/, sdk.api.phone_calls.createOne({
                            enduserId: enduser.id,
                            inbound: true,
                            externalId: 'CAcoldtransfertestinbound000000001',
                            from: '+15550001111',
                            to: '+15550002222',
                            userId: sdk.userInfo.id,
                        })];
                case 3:
                    inboundCall_1 = _b.sent();
                    return [4 /*yield*/, sdk.api.phone_calls.createOne({
                            enduserId: enduser.id,
                            inbound: false,
                            externalId: 'CAcoldtransfertestoutbound00000001',
                            from: '+15550002222',
                            to: '+15550001111',
                            userId: sdk.userInfo.id,
                        })
                        // throwaway target users (never modify existing users' roles)
                    ];
                case 4:
                    outboundCall_1 = _b.sent();
                    return [4 /*yield*/, sdk.api.users.createOne({
                            email: 'cold.transfer.disabled@tellescope.com',
                            verifiedEmail: true,
                            notificationEmailsDisabled: true,
                            disableIncomingPhoneCalls: true,
                        })];
                case 5:
                    disabledTargetUser_1 = _b.sent();
                    targetUsers.push(disabledTargetUser_1);
                    return [4 /*yield*/, async_test("cold_transfer: cannot transfer to yourself", function () { return sdk.api.phone_calls.cold_transfer({ callSid: inboundCall_1.externalId, targetUserId: sdk.userInfo.id }); }, { shouldError: true, onError: function (e) { return e.message === "Cannot transfer a call to yourself"; } })];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, async_test("cold_transfer: bogus callSid rejected", function () { return sdk.api.phone_calls.cold_transfer({ callSid: 'CAdoesnotexist0000000000000000000', targetUserId: disabledTargetUser_1.id }); }, { shouldError: true, onError: function (e) { return e.message === "Call not found"; } })];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, async_test("cold_transfer: outbound calls rejected", function () { return sdk.api.phone_calls.cold_transfer({ callSid: outboundCall_1.externalId, targetUserId: disabledTargetUser_1.id }); }, { shouldError: true, onError: function (e) { return e.message === "Only inbound calls can be transferred"; } })
                        // conferenceId is not settable via the public API (only set internally by conference webhooks),
                        // so the "Conference calls cannot be transferred" branch is covered by manual E2E testing only
                    ];
                case 8:
                    _b.sent();
                    // conferenceId is not settable via the public API (only set internally by conference webhooks),
                    // so the "Conference calls cannot be transferred" branch is covered by manual E2E testing only
                    return [4 /*yield*/, async_test("cold_transfer: nonexistent target user rejected", function () { return sdk.api.phone_calls.cold_transfer({ callSid: inboundCall_1.externalId, targetUserId: NONEXISTENT_MONGO_ID }); }, { shouldError: true, onError: function (e) { return e.message === "Target user not found"; } })];
                case 9:
                    // conferenceId is not settable via the public API (only set internally by conference webhooks),
                    // so the "Conference calls cannot be transferred" branch is covered by manual E2E testing only
                    _b.sent();
                    return [4 /*yield*/, async_test("cold_transfer: target user with incoming calls disabled rejected", function () { return sdk.api.phone_calls.cold_transfer({ callSid: inboundCall_1.externalId, targetUserId: disabledTargetUser_1.id }); }, { shouldError: true, onError: function (e) { return e.message === "Target user has incoming calls disabled"; } })
                        // non-admin either can't see the call (Call not found) or is stopped by a later
                        // validation (target has incoming calls disabled) — errors on every path
                    ];
                case 10:
                    _b.sent();
                    // non-admin either can't see the call (Call not found) or is stopped by a later
                    // validation (target has incoming calls disabled) — errors on every path
                    return [4 /*yield*/, async_test("cold_transfer: non-admin cannot transfer an inaccessible call", function () { return sdkNonAdmin.api.phone_calls.cold_transfer({ callSid: inboundCall_1.externalId, targetUserId: disabledTargetUser_1.id }); }, handleAnyError)];
                case 11:
                    // non-admin either can't see the call (Call not found) or is stopped by a later
                    // validation (target has incoming calls disabled) — errors on every path
                    _b.sent();
                    return [3 /*break*/, 14];
                case 12: 
                // deleting the enduser cascades deletion of its phone_calls records
                return [4 /*yield*/, Promise.all(__spreadArray([
                        sdk.api.endusers.deleteOne(enduser.id)
                    ], targetUsers.map(function (u) { return sdk.api.users.deleteOne(u.id); }), true)).catch(console.error)];
                case 13:
                    // deleting the enduser cascades deletion of its phone_calls records
                    _b.sent();
                    return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
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
                    return [4 /*yield*/, phone_calls_cold_transfer_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Phone calls cold transfer test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Phone calls cold transfer test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=phone_calls_cold_transfer.test.js.map