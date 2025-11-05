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
import { Session } from "../../sdk";
import { async_test, log_header, } from "@tellescope/testing";
import { setup_tests } from "../setup";
var host = process.env.API_URL || 'http://localhost:8080';
// Main test function that can be called independently
export var custom_aggregation_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var testEnduser;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_header("Custom Aggregation Tests");
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'CustomAgg',
                            lname: 'TestUser',
                            email: 'custom-agg-test@example.com',
                        })
                        // Set a password on the enduser (this creates a hashedPassword field)
                    ];
                case 1:
                    testEnduser = _b.sent();
                    // Set a password on the enduser (this creates a hashedPassword field)
                    return [4 /*yield*/, sdk.api.endusers.set_password({
                            id: testEnduser.id,
                            password: 'TestPassword123!',
                        })];
                case 2:
                    // Set a password on the enduser (this creates a hashedPassword field)
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, , 9, 11]);
                    // Test 1: Basic aggregation works
                    return [4 /*yield*/, async_test("Custom aggregation - basic query works", function () { return sdk.api.analytics_frames.custom_aggregation({
                            modelName: 'endusers',
                            aggregation: [
                                { $match: { fname: 'CustomAgg' } },
                                { $count: 'total' }
                            ]
                        }); }, { onResult: function (r) { var _a; return ((_a = r.result[0]) === null || _a === void 0 ? void 0 : _a.total) === 1; } })
                        // Test 2: Aggregation returns enduser data
                    ];
                case 4:
                    // Test 1: Basic aggregation works
                    _b.sent();
                    // Test 2: Aggregation returns enduser data
                    return [4 /*yield*/, async_test("Custom aggregation - returns enduser fields", function () { return sdk.api.analytics_frames.custom_aggregation({
                            modelName: 'endusers',
                            aggregation: [
                                { $match: { fname: 'CustomAgg' } },
                                { $project: { fname: 1, lname: 1, email: 1 } }
                            ]
                        }); }, { onResult: function (r) {
                                var user = r.result[0];
                                return user.fname === 'CustomAgg'
                                    && user.lname === 'TestUser'
                                    && user.email === 'custom-agg-test@example.com';
                            } })
                        // Test 3: CRITICAL - hashedPassword is redacted even if requested
                    ];
                case 5:
                    // Test 2: Aggregation returns enduser data
                    _b.sent();
                    // Test 3: CRITICAL - hashedPassword is redacted even if requested
                    return [4 /*yield*/, async_test("Custom aggregation - hashedPassword is redacted (explicit project)", function () { return sdk.api.analytics_frames.custom_aggregation({
                            modelName: 'endusers',
                            aggregation: [
                                { $match: { fname: 'CustomAgg' } },
                                { $project: { fname: 1, hashedPassword: 1 } } // Explicitly request password
                            ]
                        }); }, { onResult: function (r) {
                                var user = r.result[0];
                                // Should have fname but NOT hashedPassword
                                return user.fname === 'CustomAgg' && user.hashedPassword === undefined;
                            } })
                        // Test 4: hashedPassword is redacted even without explicit project
                    ];
                case 6:
                    // Test 3: CRITICAL - hashedPassword is redacted even if requested
                    _b.sent();
                    // Test 4: hashedPassword is redacted even without explicit project
                    return [4 /*yield*/, async_test("Custom aggregation - hashedPassword is redacted (no project)", function () { return sdk.api.analytics_frames.custom_aggregation({
                            modelName: 'endusers',
                            aggregation: [
                                { $match: { fname: 'CustomAgg' } },
                                { $limit: 1 }
                            ]
                        }); }, { onResult: function (r) {
                                var user = r.result[0];
                                // Should return user data but NOT hashedPassword
                                return user.fname === 'CustomAgg' && user.hashedPassword === undefined;
                            } })
                        // Test 5: Aggregation with grouping doesn't leak hashedPassword
                    ];
                case 7:
                    // Test 4: hashedPassword is redacted even without explicit project
                    _b.sent();
                    // Test 5: Aggregation with grouping doesn't leak hashedPassword
                    return [4 /*yield*/, async_test("Custom aggregation - hashedPassword redacted in grouped results", function () { return sdk.api.analytics_frames.custom_aggregation({
                            modelName: 'endusers',
                            aggregation: [
                                { $match: { fname: 'CustomAgg' } },
                                { $group: { _id: '$fname', count: { $sum: 1 }, data: { $push: '$$ROOT' } } }
                            ]
                        }); }, { onResult: function (r) {
                                var group = r.result[0];
                                var user = group.data[0];
                                // Even in grouped results, hashedPassword should not be present
                                return group.count === 1 && user.hashedPassword === undefined;
                            } })];
                case 8:
                    // Test 5: Aggregation with grouping doesn't leak hashedPassword
                    _b.sent();
                    console.log("✅ All custom aggregation tests passed");
                    return [3 /*break*/, 11];
                case 9: 
                // Cleanup
                return [4 /*yield*/, sdk.api.endusers.deleteOne(testEnduser.id)];
                case 10:
                    // Cleanup
                    _b.sent();
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
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
                    return [4 /*yield*/, custom_aggregation_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Custom aggregation test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Custom aggregation test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=custom_aggregation.test.js.map