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
import { assert, async_test, log_header, } from "@tellescope/testing";
import { setup_tests } from "../setup";
var host = process.env.API_URL || 'http://localhost:8080';
// Main test function that can be called independently
export var get_some_projection_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var testEnduser, observationIds, obs1, obs2, obs3, _i, observationIds_1, obsId, error_1, deleteError_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_header("getSome Projection Support");
                    return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'ProjectionTest', lname: 'User', email: 'projection-test@tellescope.com' })];
                case 1:
                    testEnduser = _b.sent();
                    observationIds = [];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 13, 25]);
                    return [4 /*yield*/, sdk.api.enduser_observations.createOne({
                            enduserId: testEnduser.id,
                            status: 'final',
                            category: 'vital-signs',
                            measurement: { value: 120, unit: 'mmHg' },
                        })];
                case 3:
                    obs1 = _b.sent();
                    return [4 /*yield*/, sdk.api.enduser_observations.createOne({
                            enduserId: testEnduser.id,
                            status: 'final',
                            category: 'vital-signs',
                            measurement: { value: 80, unit: 'mmHg' },
                        })];
                case 4:
                    obs2 = _b.sent();
                    return [4 /*yield*/, sdk.api.enduser_observations.createOne({
                            enduserId: testEnduser.id,
                            status: 'final',
                            category: 'vital-signs',
                            measurement: { value: 98, unit: 'bpm' },
                        })];
                case 5:
                    obs3 = _b.sent();
                    observationIds = [obs1.id, obs2.id, obs3.id];
                    // Test 1: Inclusion projection returns only specified fields
                    return [4 /*yield*/, async_test('projection-inclusion', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var results, _i, results_1, r;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.enduser_observations.getSome({
                                            filter: { enduserId: testEnduser.id },
                                            projection: { timestamp: 1, measurement: 1, enduserId: 1 },
                                        })];
                                    case 1:
                                        results = _a.sent();
                                        assert(results.length === 3, 'Expected 3 observations with projection', 'Got correct count with projection');
                                        for (_i = 0, results_1 = results; _i < results_1.length; _i++) {
                                            r = results_1[_i];
                                            assert(r.id !== undefined, 'id should always be present');
                                            assert(r.createdAt !== undefined, 'createdAt should always be present');
                                            assert(r.measurement !== undefined, 'measurement should be present in projection');
                                            assert(r.enduserId !== undefined, 'enduserId should be present in projection');
                                            assert(r.timestamp !== undefined, 'timestamp should be present in projection');
                                            // Fields NOT in projection should be excluded
                                            assert(r.status === undefined, 'status should NOT be present when not in projection');
                                            assert(r.category === undefined, 'category should NOT be present when not in projection');
                                        }
                                        return [2 /*return*/, results];
                                }
                            });
                        }); }, { onResult: function () { return true; } })
                        // Test 2: No projection returns all fields (backward compatibility)
                    ];
                case 6:
                    // Test 1: Inclusion projection returns only specified fields
                    _b.sent();
                    // Test 2: No projection returns all fields (backward compatibility)
                    return [4 /*yield*/, async_test('no-projection-returns-all-fields', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var results, _i, results_2, r;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.enduser_observations.getSome({
                                            filter: { enduserId: testEnduser.id },
                                        })];
                                    case 1:
                                        results = _a.sent();
                                        assert(results.length === 3, 'Expected 3 observations without projection');
                                        for (_i = 0, results_2 = results; _i < results_2.length; _i++) {
                                            r = results_2[_i];
                                            assert(r.id !== undefined, 'id should be present');
                                            assert(r.status !== undefined, 'status should be present without projection');
                                            assert(r.category !== undefined, 'category should be present without projection');
                                            assert(r.measurement !== undefined, 'measurement should be present without projection');
                                            assert(r.enduserId !== undefined, 'enduserId should be present without projection');
                                        }
                                        return [2 /*return*/, results];
                                }
                            });
                        }); }, { onResult: function () { return true; } })
                        // Test 3: Projection with other filters (filter, limit, sortBy)
                    ];
                case 7:
                    // Test 2: No projection returns all fields (backward compatibility)
                    _b.sent();
                    // Test 3: Projection with other filters (filter, limit, sortBy)
                    return [4 /*yield*/, async_test('projection-with-filters', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var results, _i, results_3, r;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.enduser_observations.getSome({
                                            filter: { enduserId: testEnduser.id },
                                            projection: { measurement: 1 },
                                            limit: 2,
                                            sortBy: 'timestamp',
                                        })];
                                    case 1:
                                        results = _a.sent();
                                        assert(results.length === 2, 'Expected 2 observations with limit=2', "Got ".concat(results.length));
                                        for (_i = 0, results_3 = results; _i < results_3.length; _i++) {
                                            r = results_3[_i];
                                            assert(r.measurement !== undefined, 'measurement should be present in projection');
                                            assert(r.status === undefined, 'status should NOT be present when not in projection');
                                        }
                                        return [2 /*return*/, results];
                                }
                            });
                        }); }, { onResult: function () { return true; } })
                        // Test 4: Projection works across different models (endusers)
                    ];
                case 8:
                    // Test 3: Projection with other filters (filter, limit, sortBy)
                    _b.sent();
                    // Test 4: Projection works across different models (endusers)
                    return [4 /*yield*/, async_test('projection-on-endusers', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var results, enduser;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.endusers.getSome({
                                            filter: { email: 'projection-test@tellescope.com' },
                                            projection: { fname: 1, email: 1 },
                                        })];
                                    case 1:
                                        results = _a.sent();
                                        assert(results.length >= 1, 'Expected at least 1 enduser');
                                        enduser = results[0];
                                        assert(enduser.id !== undefined, 'id should always be present');
                                        assert(enduser.fname !== undefined, 'fname should be present in projection');
                                        assert(enduser.email !== undefined, 'email should be present in projection');
                                        assert(enduser.lname === undefined, 'lname should NOT be present when not in projection');
                                        return [2 /*return*/, results];
                                }
                            });
                        }); }, { onResult: function () { return true; } })
                        // Test 5: Projection with pagination (lastId)
                    ];
                case 9:
                    // Test 4: Projection works across different models (endusers)
                    _b.sent();
                    // Test 5: Projection with pagination (lastId)
                    return [4 /*yield*/, async_test('projection-with-pagination', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var page1, lastId, page2, _i, _a, r;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, sdk.api.enduser_observations.getSome({
                                            filter: { enduserId: testEnduser.id },
                                            projection: { measurement: 1, enduserId: 1 },
                                            limit: 2,
                                            sort: 'oldFirst',
                                        })];
                                    case 1:
                                        page1 = _b.sent();
                                        assert(page1.length === 2, 'Expected 2 observations on first page');
                                        lastId = page1[page1.length - 1].id;
                                        return [4 /*yield*/, sdk.api.enduser_observations.getSome({
                                                filter: { enduserId: testEnduser.id },
                                                projection: { measurement: 1, enduserId: 1 },
                                                limit: 2,
                                                sort: 'oldFirst',
                                                lastId: lastId,
                                            })];
                                    case 2:
                                        page2 = _b.sent();
                                        assert(page2.length === 1, 'Expected 1 observation on second page');
                                        // Verify consistent fields across pages
                                        for (_i = 0, _a = __spreadArray(__spreadArray([], page1, true), page2, true); _i < _a.length; _i++) {
                                            r = _a[_i];
                                            assert(r.measurement !== undefined, 'measurement should be present across pages');
                                            assert(r.enduserId !== undefined, 'enduserId should be present across pages');
                                            assert(r.status === undefined, 'status should NOT be present across pages');
                                        }
                                        return [2 /*return*/, __spreadArray(__spreadArray([], page1, true), page2, true)];
                                }
                            });
                        }); }, { onResult: function () { return true; } })
                        // Test 6: Empty projection returns all fields (no crash)
                    ];
                case 10:
                    // Test 5: Projection with pagination (lastId)
                    _b.sent();
                    // Test 6: Empty projection returns all fields (no crash)
                    return [4 /*yield*/, async_test('empty-projection', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var results, _i, results_4, r;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.enduser_observations.getSome({
                                            filter: { enduserId: testEnduser.id },
                                            projection: {},
                                        })];
                                    case 1:
                                        results = _a.sent();
                                        assert(results.length === 3, 'Expected 3 observations with empty projection');
                                        for (_i = 0, results_4 = results; _i < results_4.length; _i++) {
                                            r = results_4[_i];
                                            assert(r.status !== undefined, 'status should be present with empty projection');
                                            assert(r.category !== undefined, 'category should be present with empty projection');
                                            assert(r.measurement !== undefined, 'measurement should be present with empty projection');
                                        }
                                        return [2 /*return*/, results];
                                }
                            });
                        }); }, { onResult: function () { return true; } })
                        // Test 7: Non-admin access with projection (RBA still applies)
                    ];
                case 11:
                    // Test 6: Empty projection returns all fields (no crash)
                    _b.sent();
                    // Test 7: Non-admin access with projection (RBA still applies)
                    return [4 /*yield*/, async_test('non-admin-projection', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var results, _i, results_5, r;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdkNonAdmin.api.enduser_observations.getSome({
                                            filter: { enduserId: testEnduser.id },
                                            projection: { measurement: 1, enduserId: 1 },
                                        })
                                        // Non-admin should still get results (RBA should apply)
                                    ];
                                    case 1:
                                        results = _a.sent();
                                        // Non-admin should still get results (RBA should apply)
                                        assert(Array.isArray(results), 'Non-admin should receive an array response');
                                        for (_i = 0, results_5 = results; _i < results_5.length; _i++) {
                                            r = results_5[_i];
                                            assert(r.measurement !== undefined, 'measurement should be present for non-admin projection');
                                            assert(r.enduserId !== undefined, 'enduserId should be present for non-admin projection');
                                        }
                                        return [2 /*return*/, results];
                                }
                            });
                        }); }, { onResult: function () { return true; } })];
                case 12:
                    // Test 7: Non-admin access with projection (RBA still applies)
                    _b.sent();
                    return [3 /*break*/, 25];
                case 13:
                    _b.trys.push([13, 19, , 24]);
                    _i = 0, observationIds_1 = observationIds;
                    _b.label = 14;
                case 14:
                    if (!(_i < observationIds_1.length)) return [3 /*break*/, 17];
                    obsId = observationIds_1[_i];
                    return [4 /*yield*/, sdk.api.enduser_observations.deleteOne(obsId)];
                case 15:
                    _b.sent();
                    _b.label = 16;
                case 16:
                    _i++;
                    return [3 /*break*/, 14];
                case 17: return [4 /*yield*/, sdk.api.endusers.deleteOne(testEnduser.id)];
                case 18:
                    _b.sent();
                    return [3 /*break*/, 24];
                case 19:
                    error_1 = _b.sent();
                    console.error('Cleanup error:', error_1);
                    _b.label = 20;
                case 20:
                    _b.trys.push([20, 22, , 23]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(testEnduser.id)];
                case 21:
                    _b.sent();
                    return [3 /*break*/, 23];
                case 22:
                    deleteError_1 = _b.sent();
                    console.error('Failed to delete test enduser:', deleteError_1);
                    return [3 /*break*/, 23];
                case 23: return [3 /*break*/, 24];
                case 24: return [7 /*endfinally*/];
                case 25: return [2 /*return*/];
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
                    return [4 /*yield*/, get_some_projection_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ getSome projection test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ getSome projection test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=get_some_projection.test.js.map