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
import { Session, EnduserSession } from "../../sdk";
import { async_test, handleAnyError, log_header, } from "@tellescope/testing";
import { setup_tests } from "../setup";
var host = process.env.API_URL || 'http://localhost:8080';
var businessId = '60398b1131a295e64f084ff6';
// Main test function that can be called independently
export var user_portal_settings_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var testUser, testEnduserId, enduserSDK, orgId, originalOnboardingStatus;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_header("User portalSettings Tests");
                    return [4 /*yield*/, sdk.api.users.createOne({
                            email: "portal_settings_test_".concat(Date.now(), "@test.tellescope.com"),
                        })
                        // throwaway enduser used to confirm enduser-visibility of portalSettings
                    ];
                case 1:
                    testUser = _b.sent();
                    orgId = sdk.userInfo.businessId;
                    return [4 /*yield*/, sdk.api.organizations.getOne(orgId)];
                case 2:
                    originalOnboardingStatus = (_b.sent()).onboardingStatus;
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, , 18, 29]);
                    // ===== Valid: string values =====
                    return [4 /*yield*/, async_test('portalSettings - string values accepted', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var updated;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, sdk.api.users.updateOne(testUser.id, { portalSettings: { theme: 'dark' } }, { replaceObjectFields: true })];
                                    case 1:
                                        _b.sent();
                                        return [4 /*yield*/, sdk.api.users.getOne(testUser.id)];
                                    case 2:
                                        updated = _b.sent();
                                        return [2 /*return*/, (_a = updated.portalSettings) === null || _a === void 0 ? void 0 : _a.theme];
                                }
                            });
                        }); }, { onResult: function (r) { return r === 'dark'; } })
                        // ===== Valid: boolean values + round-trip as real booleans =====
                    ];
                case 4:
                    // ===== Valid: string values =====
                    _b.sent();
                    // ===== Valid: boolean values + round-trip as real booleans =====
                    return [4 /*yield*/, async_test('portalSettings - boolean values accepted and round-trip as booleans', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var updated;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.users.updateOne(testUser.id, { portalSettings: { showNameInSecureMessaging: true, showAvatar: false } }, { replaceObjectFields: true })];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, sdk.api.users.getOne(testUser.id)];
                                    case 2:
                                        updated = _a.sent();
                                        return [2 /*return*/, updated.portalSettings];
                                }
                            });
                        }); }, {
                            onResult: function (r) {
                                return (r === null || r === void 0 ? void 0 : r.showNameInSecureMessaging) === true &&
                                    (r === null || r === void 0 ? void 0 : r.showAvatar) === false &&
                                    // assert real booleans, not coerced strings
                                    typeof (r === null || r === void 0 ? void 0 : r.showNameInSecureMessaging) === 'boolean' &&
                                    typeof (r === null || r === void 0 ? void 0 : r.showAvatar) === 'boolean';
                            },
                        })
                        // ===== Valid: mixed string + boolean values, strings stay strings =====
                    ];
                case 5:
                    // ===== Valid: boolean values + round-trip as real booleans =====
                    _b.sent();
                    // ===== Valid: mixed string + boolean values, strings stay strings =====
                    return [4 /*yield*/, async_test('portalSettings - mixed string and boolean values', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var updated;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.users.updateOne(testUser.id, { portalSettings: { theme: 'light', showAvatar: true } }, { replaceObjectFields: true })];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, sdk.api.users.getOne(testUser.id)];
                                    case 2:
                                        updated = _a.sent();
                                        return [2 /*return*/, updated.portalSettings];
                                }
                            });
                        }); }, {
                            onResult: function (r) {
                                return (r === null || r === void 0 ? void 0 : r.theme) === 'light' &&
                                    typeof (r === null || r === void 0 ? void 0 : r.theme) === 'string' &&
                                    (r === null || r === void 0 ? void 0 : r.showAvatar) === true &&
                                    typeof (r === null || r === void 0 ? void 0 : r.showAvatar) === 'boolean';
                            },
                        })
                        // ===== Valid: empty object (zero-iteration loop passes) =====
                    ];
                case 6:
                    // ===== Valid: mixed string + boolean values, strings stay strings =====
                    _b.sent();
                    // ===== Valid: empty object (zero-iteration loop passes) =====
                    return [4 /*yield*/, async_test('portalSettings - empty object accepted', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var updated;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.users.updateOne(testUser.id, { portalSettings: {} }, { replaceObjectFields: true })];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, sdk.api.users.getOne(testUser.id)];
                                    case 2:
                                        updated = _a.sent();
                                        return [2 /*return*/, updated.portalSettings];
                                }
                            });
                        }); }, { onResult: function (r) { return !!r && typeof r === 'object' && Object.keys(r).length === 0; } })
                        // ===== Invalid: value string > 250 chars =====
                    ];
                case 7:
                    // ===== Valid: empty object (zero-iteration loop passes) =====
                    _b.sent();
                    // ===== Invalid: value string > 250 chars =====
                    return [4 /*yield*/, async_test('portalSettings - value string > 250 chars rejected', function () { return sdk.api.users.updateOne(testUser.id, { portalSettings: { tooLong: 'a'.repeat(251) } }, { replaceObjectFields: true }); }, handleAnyError)
                        // ===== Invalid: key > 250 chars =====
                    ];
                case 8:
                    // ===== Invalid: value string > 250 chars =====
                    _b.sent();
                    // ===== Invalid: key > 250 chars =====
                    return [4 /*yield*/, async_test('portalSettings - key > 250 chars rejected', function () {
                            var _a;
                            return sdk.api.users.updateOne(testUser.id, { portalSettings: (_a = {}, _a['a'.repeat(251)] = 'x', _a) }, { replaceObjectFields: true });
                        }, handleAnyError)
                        // ===== Invalid: nested object value (disallowed type) =====
                    ];
                case 9:
                    // ===== Invalid: key > 250 chars =====
                    _b.sent();
                    // ===== Invalid: nested object value (disallowed type) =====
                    return [4 /*yield*/, async_test('portalSettings - nested object value rejected', function () { return sdk.api.users.updateOne(testUser.id, { portalSettings: { k: { nested: 1 } } }, { replaceObjectFields: true }); }, handleAnyError)
                        // ===== Invalid: array value (disallowed type) =====
                    ];
                case 10:
                    // ===== Invalid: nested object value (disallowed type) =====
                    _b.sent();
                    // ===== Invalid: array value (disallowed type) =====
                    return [4 /*yield*/, async_test('portalSettings - array value rejected', function () { return sdk.api.users.updateOne(testUser.id, { portalSettings: { k: [1, 2] } }, { replaceObjectFields: true }); }, handleAnyError)
                        // ===== Number value (secondary): orValidator tries boolean then string;
                        // stringValidator250's escapeString throws on non-strings, so a number is
                        // rejected by both branches => API validation error. =====
                    ];
                case 11:
                    // ===== Invalid: array value (disallowed type) =====
                    _b.sent();
                    // ===== Number value (secondary): orValidator tries boolean then string;
                    // stringValidator250's escapeString throws on non-strings, so a number is
                    // rejected by both branches => API validation error. =====
                    return [4 /*yield*/, async_test('portalSettings - number value rejected', function () { return sdk.api.users.updateOne(testUser.id, { portalSettings: { k: 1 } }, { replaceObjectFields: true }); }, handleAnyError)
                        // ===== Enduser visibility: portalSettings readable by endusers, un-redacted =====
                    ];
                case 12:
                    // ===== Number value (secondary): orValidator tries boolean then string;
                    // stringValidator250's escapeString throws on non-strings, so a number is
                    // rejected by both branches => API validation error. =====
                    _b.sent();
                    // ===== Enduser visibility: portalSettings readable by endusers, un-redacted =====
                    return [4 /*yield*/, async_test('portalSettings - readable by enduser (un-redacted)', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var testEnduser, asEnduser;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: 
                                    // set a known value on the throwaway user
                                    return [4 /*yield*/, sdk.api.users.updateOne(testUser.id, { portalSettings: { showNameInSecureMessaging: true, theme: 'dark' } }, { replaceObjectFields: true })
                                        // create + authenticate a throwaway enduser to read as a patient
                                    ];
                                    case 1:
                                        // set a known value on the throwaway user
                                        _a.sent();
                                        return [4 /*yield*/, sdk.api.endusers.createOne({
                                                email: "portal_settings_enduser_".concat(Date.now(), "@test.tellescope.com"),
                                            })];
                                    case 2:
                                        testEnduser = _a.sent();
                                        testEnduserId = testEnduser.id;
                                        return [4 /*yield*/, sdk.api.endusers.set_password({ id: testEnduser.id, password: 'TestPassword123!' })];
                                    case 3:
                                        _a.sent();
                                        enduserSDK = new EnduserSession({ host: host, businessId: businessId });
                                        return [4 /*yield*/, enduserSDK.authenticate(testEnduser.email, 'TestPassword123!')];
                                    case 4:
                                        _a.sent();
                                        return [4 /*yield*/, enduserSDK.api.users.getOne(testUser.id)];
                                    case 5:
                                        asEnduser = _a.sent();
                                        return [2 /*return*/, asEnduser.portalSettings];
                                }
                            });
                        }); }, {
                            onResult: function (r) {
                                // field is present and un-redacted for endusers
                                return (r === null || r === void 0 ? void 0 : r.showNameInSecureMessaging) === true && (r === null || r === void 0 ? void 0 : r.theme) === 'dark';
                            },
                        })
                        // ===== Organization.onboardingStatus: same key-value shape as portalSettings =====
                    ];
                case 13:
                    // ===== Enduser visibility: portalSettings readable by endusers, un-redacted =====
                    _b.sent();
                    // ===== Organization.onboardingStatus: same key-value shape as portalSettings =====
                    return [4 /*yield*/, async_test('onboardingStatus - mixed string and boolean values round-trip', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var updated;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.organizations.updateOne(orgId, { onboardingStatus: { completedIntro: true, currentStep: 'billing', skippedTour: false } }, { replaceObjectFields: true })];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, sdk.api.organizations.getOne(orgId)];
                                    case 2:
                                        updated = _a.sent();
                                        return [2 /*return*/, updated.onboardingStatus];
                                }
                            });
                        }); }, {
                            onResult: function (r) {
                                return (r === null || r === void 0 ? void 0 : r.completedIntro) === true &&
                                    typeof (r === null || r === void 0 ? void 0 : r.completedIntro) === 'boolean' &&
                                    (r === null || r === void 0 ? void 0 : r.currentStep) === 'billing' &&
                                    typeof (r === null || r === void 0 ? void 0 : r.currentStep) === 'string' &&
                                    (r === null || r === void 0 ? void 0 : r.skippedTour) === false &&
                                    typeof (r === null || r === void 0 ? void 0 : r.skippedTour) === 'boolean';
                            },
                        })];
                case 14:
                    // ===== Organization.onboardingStatus: same key-value shape as portalSettings =====
                    _b.sent();
                    return [4 /*yield*/, async_test('onboardingStatus - empty object accepted', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var updated;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.organizations.updateOne(orgId, { onboardingStatus: {} }, { replaceObjectFields: true })];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, sdk.api.organizations.getOne(orgId)];
                                    case 2:
                                        updated = _a.sent();
                                        return [2 /*return*/, updated.onboardingStatus];
                                }
                            });
                        }); }, { onResult: function (r) { return !!r && typeof r === 'object' && Object.keys(r).length === 0; } })
                        // breaking change: the previous string shape must no longer be accepted
                    ];
                case 15:
                    _b.sent();
                    // breaking change: the previous string shape must no longer be accepted
                    return [4 /*yield*/, async_test('onboardingStatus - plain string (old shape) rejected', function () { return sdk.api.organizations.updateOne(orgId, { onboardingStatus: 'started' }, { replaceObjectFields: true }); }, handleAnyError)
                        // representative validator rejection, confirming the indexable validator is
                        // enforced on the organizations route (full coverage lives in the
                        // portalSettings cases above, which use the same validator)
                    ];
                case 16:
                    // breaking change: the previous string shape must no longer be accepted
                    _b.sent();
                    // representative validator rejection, confirming the indexable validator is
                    // enforced on the organizations route (full coverage lives in the
                    // portalSettings cases above, which use the same validator)
                    return [4 /*yield*/, async_test('onboardingStatus - number value rejected', function () { return sdk.api.organizations.updateOne(orgId, { onboardingStatus: { k: 1 } }, { replaceObjectFields: true }); }, handleAnyError)];
                case 17:
                    // representative validator rejection, confirming the indexable validator is
                    // enforced on the organizations route (full coverage lives in the
                    // portalSettings cases above, which use the same validator)
                    _b.sent();
                    console.log("✅ All User portalSettings tests passed!");
                    return [3 /*break*/, 29];
                case 18:
                    _b.trys.push([18, , 23, 28]);
                    if (!enduserSDK) return [3 /*break*/, 20];
                    return [4 /*yield*/, enduserSDK.api.endusers.logout().catch(function () { })];
                case 19:
                    _b.sent();
                    _b.label = 20;
                case 20:
                    if (!testEnduserId) return [3 /*break*/, 22];
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(testEnduserId)];
                case 21:
                    _b.sent();
                    _b.label = 22;
                case 22: return [3 /*break*/, 28];
                case 23:
                    _b.trys.push([23, , 25, 27]);
                    return [4 /*yield*/, sdk.api.organizations.updateOne(orgId, { onboardingStatus: originalOnboardingStatus !== null && originalOnboardingStatus !== void 0 ? originalOnboardingStatus : {} }, { replaceObjectFields: true })];
                case 24:
                    _b.sent();
                    return [3 /*break*/, 27];
                case 25: return [4 /*yield*/, sdk.api.users.deleteOne(testUser.id)];
                case 26:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 27: return [7 /*endfinally*/];
                case 28: return [7 /*endfinally*/];
                case 29: return [2 /*return*/];
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
                    return [4 /*yield*/, user_portal_settings_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ User portalSettings test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ User portalSettings test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=user_portal_settings.test.js.map