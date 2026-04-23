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
import { async_test, handleAnyError, log_header, wait, } from "@tellescope/testing";
import { setup_tests } from "../setup";
var host = process.env.API_URL || 'http://localhost:8080';
var businessId = '60398b1131a295e64f084ff6';
// Main test function that can be called independently
export var enduser_session_invalidation_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var testEnduser, authToken, enduserSDK_1, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_header("Enduser Session Invalidation Tests");
                    return [4 /*yield*/, sdk.api.endusers.createOne({ email: "session-invalidation-test-".concat(Date.now(), "@tellescope.com") })];
                case 1:
                    testEnduser = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 10, 14]);
                    return [4 /*yield*/, sdk.api.endusers.generate_auth_token({ id: testEnduser.id })];
                case 3:
                    authToken = (_b.sent()).authToken;
                    enduserSDK_1 = new EnduserSession({ host: host, authToken: authToken, businessId: sdk.userInfo.businessId });
                    // Test 1: Enduser authenticated before invalidation
                    return [4 /*yield*/, async_test('enduser authenticated before invalidation', function () { return enduserSDK_1.test_authenticated(); }, { expectedResult: 'Authenticated!' })
                        // Wait to ensure time separation between token creation and invalidation
                    ];
                case 4:
                    // Test 1: Enduser authenticated before invalidation
                    _b.sent();
                    // Wait to ensure time separation between token creation and invalidation
                    return [4 /*yield*/, wait(undefined, 2000)
                        // Test 2: Setting invalidateSessionsBefore rejects old token (401)
                    ];
                case 5:
                    // Wait to ensure time separation between token creation and invalidation
                    _b.sent();
                    // Test 2: Setting invalidateSessionsBefore rejects old token (401)
                    return [4 /*yield*/, async_test('setting invalidateSessionsBefore rejects old token', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var e_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.endusers.updateOne(testEnduser.id, { invalidateSessionsBefore: new Date() })
                                        // Old token should now be rejected
                                    ];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2:
                                        _a.trys.push([2, 4, , 5]);
                                        return [4 /*yield*/, enduserSDK_1.test_authenticated()];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/, 'should have thrown'];
                                    case 4:
                                        e_1 = _a.sent();
                                        return [2 /*return*/, 'rejected'];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); }, { expectedResult: 'rejected' })
                        // Test 3: New token after invalidation works
                    ];
                case 6:
                    // Test 2: Setting invalidateSessionsBefore rejects old token (401)
                    _b.sent();
                    // Test 3: New token after invalidation works
                    return [4 /*yield*/, async_test('new token after invalidation works', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var newAuthToken, newEnduserSDK;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: 
                                    // Wait to ensure new token iat is after invalidateSessionsBefore
                                    return [4 /*yield*/, wait(undefined, 2000)];
                                    case 1:
                                        // Wait to ensure new token iat is after invalidateSessionsBefore
                                        _a.sent();
                                        return [4 /*yield*/, sdk.api.endusers.generate_auth_token({ id: testEnduser.id })];
                                    case 2:
                                        newAuthToken = (_a.sent()).authToken;
                                        newEnduserSDK = new EnduserSession({ host: host, authToken: newAuthToken, businessId: sdk.userInfo.businessId });
                                        return [4 /*yield*/, newEnduserSDK.test_authenticated()];
                                    case 3: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); }, { expectedResult: 'Authenticated!' })
                        // Test 4: Cannot set invalidateSessionsBefore backwards (constraint error)
                    ];
                case 7:
                    // Test 3: New token after invalidation works
                    _b.sent();
                    // Test 4: Cannot set invalidateSessionsBefore backwards (constraint error)
                    return [4 /*yield*/, async_test('cannot set invalidateSessionsBefore backwards', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var pastDate;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
                                        ;
                                        return [4 /*yield*/, sdk.api.endusers.updateOne(testEnduser.id, { invalidateSessionsBefore: pastDate })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, handleAnyError)
                        // Test 5: Deleted enduser token rejected (401)
                    ];
                case 8:
                    // Test 4: Cannot set invalidateSessionsBefore backwards (constraint error)
                    _b.sent();
                    // Test 5: Deleted enduser token rejected (401)
                    return [4 /*yield*/, async_test('deleted enduser token rejected', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var tempEnduser, tempAuthToken, tempEnduserSDK, e_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.endusers.createOne({ email: "temp-session-test-".concat(Date.now(), "@tellescope.com") })];
                                    case 1:
                                        tempEnduser = _a.sent();
                                        return [4 /*yield*/, sdk.api.endusers.generate_auth_token({ id: tempEnduser.id })];
                                    case 2:
                                        tempAuthToken = (_a.sent()).authToken;
                                        tempEnduserSDK = new EnduserSession({ host: host, authToken: tempAuthToken, businessId: sdk.userInfo.businessId });
                                        // Verify token works before deletion
                                        return [4 /*yield*/, tempEnduserSDK.test_authenticated()
                                            // Delete the enduser
                                        ];
                                    case 3:
                                        // Verify token works before deletion
                                        _a.sent();
                                        // Delete the enduser
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(tempEnduser.id)
                                            // Token should now be rejected
                                        ];
                                    case 4:
                                        // Delete the enduser
                                        _a.sent();
                                        _a.label = 5;
                                    case 5:
                                        _a.trys.push([5, 7, , 8]);
                                        return [4 /*yield*/, tempEnduserSDK.test_authenticated()];
                                    case 6:
                                        _a.sent();
                                        return [2 /*return*/, 'should have thrown'];
                                    case 7:
                                        e_2 = _a.sent();
                                        return [2 /*return*/, 'rejected'];
                                    case 8: return [2 /*return*/];
                                }
                            });
                        }); }, { expectedResult: 'rejected' })];
                case 9:
                    // Test 5: Deleted enduser token rejected (401)
                    _b.sent();
                    console.log("✅ All Enduser Session Invalidation tests passed!");
                    return [3 /*break*/, 14];
                case 10:
                    _b.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(testEnduser.id)];
                case 11:
                    _b.sent();
                    return [3 /*break*/, 13];
                case 12:
                    error_1 = _b.sent();
                    console.error('Cleanup error:', error_1);
                    return [3 /*break*/, 13];
                case 13: return [7 /*endfinally*/];
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
                    return [4 /*yield*/, enduser_session_invalidation_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Enduser session invalidation test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Enduser session invalidation test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=enduser_session_invalidation.test.js.map