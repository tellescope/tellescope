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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mdb_sort_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || 'http://localhost:8080';
// Main test function that can be called independently
var mdb_sort_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var testEndusers, enduserIds, _i, enduserIds_1, enduserId, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("mdbSort Custom Sorting Support");
                    return [4 /*yield*/, Promise.all([
                            sdk.api.endusers.createOne({ fname: 'Alice', lname: 'Smith', email: 'alice-mdbsort@tellescope.com' }),
                            sdk.api.endusers.createOne({ fname: 'Bob', lname: 'Jones', email: 'bob-mdbsort@tellescope.com' }),
                            sdk.api.endusers.createOne({ fname: 'Charlie', lname: 'Adams', email: 'charlie-mdbsort@tellescope.com' }),
                            sdk.api.endusers.createOne({ fname: 'Alice', lname: 'Zeta', email: 'alice2-mdbsort@tellescope.com' }), // Same fname for multi-field test
                        ])];
                case 1:
                    testEndusers = _b.sent();
                    enduserIds = testEndusers.map(function (e) { return e.id; });
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 11, 18]);
                    // Test 1: Sort by fname ascending (alphabetical order)
                    return [4 /*yield*/, (0, testing_1.async_test)('mdbSort-fname-ascending', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var results;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.endusers.getSome({
                                            filter: { id: { _in: enduserIds } },
                                            mdbSort: { fname: 1 },
                                        })];
                                    case 1:
                                        results = _a.sent();
                                        (0, testing_1.assert)(results.length === 4, 'Expected 4 endusers', "Got ".concat(results.length));
                                        // Verify alphabetical order: Alice, Alice, Bob, Charlie
                                        (0, testing_1.assert)(results[0].fname === 'Alice', 'First should be Alice');
                                        (0, testing_1.assert)(results[1].fname === 'Alice', 'Second should be Alice');
                                        (0, testing_1.assert)(results[2].fname === 'Bob', 'Third should be Bob');
                                        (0, testing_1.assert)(results[3].fname === 'Charlie', 'Fourth should be Charlie');
                                        return [2 /*return*/, results];
                                }
                            });
                        }); }, { onResult: function () { return true; } })
                        // Test 2: Sort by fname descending (reverse alphabetical order)
                    ];
                case 3:
                    // Test 1: Sort by fname ascending (alphabetical order)
                    _b.sent();
                    // Test 2: Sort by fname descending (reverse alphabetical order)
                    return [4 /*yield*/, (0, testing_1.async_test)('mdbSort-fname-descending', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var results;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.endusers.getSome({
                                            filter: { id: { _in: enduserIds } },
                                            mdbSort: { fname: -1 },
                                        })];
                                    case 1:
                                        results = _a.sent();
                                        (0, testing_1.assert)(results.length === 4, 'Expected 4 endusers');
                                        // Verify reverse alphabetical order: Charlie, Bob, Alice, Alice
                                        (0, testing_1.assert)(results[0].fname === 'Charlie', 'First should be Charlie');
                                        (0, testing_1.assert)(results[1].fname === 'Bob', 'Second should be Bob');
                                        (0, testing_1.assert)(results[2].fname === 'Alice', 'Third should be Alice');
                                        (0, testing_1.assert)(results[3].fname === 'Alice', 'Fourth should be Alice');
                                        return [2 /*return*/, results];
                                }
                            });
                        }); }, { onResult: function () { return true; } })
                        // Test 3: Multi-field sort (fname ascending, then lname ascending for ties)
                    ];
                case 4:
                    // Test 2: Sort by fname descending (reverse alphabetical order)
                    _b.sent();
                    // Test 3: Multi-field sort (fname ascending, then lname ascending for ties)
                    return [4 /*yield*/, (0, testing_1.async_test)('mdbSort-multi-field', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var results;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.endusers.getSome({
                                            filter: { id: { _in: enduserIds } },
                                            mdbSort: { fname: 1, lname: 1 },
                                        })];
                                    case 1:
                                        results = _a.sent();
                                        (0, testing_1.assert)(results.length === 4, 'Expected 4 endusers');
                                        // Verify multi-field sort:
                                        // Alice Smith (fname: Alice, lname: Smith)
                                        // Alice Zeta  (fname: Alice, lname: Zeta)
                                        // Bob Jones   (fname: Bob)
                                        // Charlie Adams (fname: Charlie)
                                        (0, testing_1.assert)(results[0].fname === 'Alice' && results[0].lname === 'Smith', 'First should be Alice Smith');
                                        (0, testing_1.assert)(results[1].fname === 'Alice' && results[1].lname === 'Zeta', 'Second should be Alice Zeta');
                                        (0, testing_1.assert)(results[2].fname === 'Bob', 'Third should be Bob');
                                        (0, testing_1.assert)(results[3].fname === 'Charlie', 'Fourth should be Charlie');
                                        return [2 /*return*/, results];
                                }
                            });
                        }); }, { onResult: function () { return true; } })
                        // Test 4: mdbSort combined with mdbFilter
                    ];
                case 5:
                    // Test 3: Multi-field sort (fname ascending, then lname ascending for ties)
                    _b.sent();
                    // Test 4: mdbSort combined with mdbFilter
                    return [4 /*yield*/, (0, testing_1.async_test)('mdbSort-with-mdbFilter', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var results;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.endusers.getSome({
                                            mdbFilter: {
                                                email: { $in: ['alice-mdbsort@tellescope.com', 'alice2-mdbsort@tellescope.com'] },
                                                fname: 'Alice', // Only get Alice endusers
                                            },
                                            mdbSort: { lname: 1 }, // Sort by last name
                                        })];
                                    case 1:
                                        results = _a.sent();
                                        (0, testing_1.assert)(results.length === 2, 'Expected 2 Alice endusers', "Got ".concat(results.length));
                                        // Verify both are Alice and sorted by lname: Smith, then Zeta
                                        (0, testing_1.assert)(results[0].fname === 'Alice' && results[0].lname === 'Smith', 'First Alice should be Smith');
                                        (0, testing_1.assert)(results[1].fname === 'Alice' && results[1].lname === 'Zeta', 'Second Alice should be Zeta');
                                        return [2 /*return*/, results];
                                }
                            });
                        }); }, { onResult: function () { return true; } })
                        // Test 5: mdbSort keyset pagination via mdbFilter $or
                        // Note: filter is ignored when mdbFilter is present, so both id scoping and keyset cursor
                        // must be expressed in mdbFilter.
                    ];
                case 6:
                    // Test 4: mdbSort combined with mdbFilter
                    _b.sent();
                    // Test 5: mdbSort keyset pagination via mdbFilter $or
                    // Note: filter is ignored when mdbFilter is present, so both id scoping and keyset cursor
                    // must be expressed in mdbFilter.
                    return [4 /*yield*/, (0, testing_1.async_test)('mdbSort-keyset-pagination', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var testEmails, page1, lastFname, page2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        testEmails = [
                                            'alice-mdbsort@tellescope.com',
                                            'alice2-mdbsort@tellescope.com',
                                            'bob-mdbsort@tellescope.com',
                                            'charlie-mdbsort@tellescope.com',
                                        ];
                                        return [4 /*yield*/, sdk.api.endusers.getSome({
                                                mdbFilter: { email: { $in: testEmails } },
                                                mdbSort: { fname: 1 },
                                                limit: 2,
                                            })];
                                    case 1:
                                        page1 = _a.sent();
                                        (0, testing_1.assert)(page1.length === 2, 'Expected 2 endusers on page 1');
                                        (0, testing_1.assert)(page1[0].fname === 'Alice', 'Page 1 first should be Alice');
                                        (0, testing_1.assert)(page1[1].fname === 'Alice', 'Page 1 second should be Alice');
                                        lastFname = page1[page1.length - 1].fname;
                                        return [4 /*yield*/, sdk.api.endusers.getSome({
                                                mdbFilter: {
                                                    email: { $in: testEmails },
                                                    fname: { $gt: lastFname },
                                                },
                                                mdbSort: { fname: 1 },
                                                limit: 2,
                                            })];
                                    case 2:
                                        page2 = _a.sent();
                                        (0, testing_1.assert)(page2.length === 2, 'Expected 2 endusers on page 2');
                                        (0, testing_1.assert)(page2[0].fname === 'Bob', 'Page 2 first should be Bob');
                                        (0, testing_1.assert)(page2[1].fname === 'Charlie', 'Page 2 second should be Charlie');
                                        return [2 /*return*/, __spreadArray(__spreadArray([], page1, true), page2, true)];
                                }
                            });
                        }); }, { onResult: function () { return true; } })
                        // Test 6: mdbSort with projection (ensure both work together)
                    ];
                case 7:
                    // Test 5: mdbSort keyset pagination via mdbFilter $or
                    // Note: filter is ignored when mdbFilter is present, so both id scoping and keyset cursor
                    // must be expressed in mdbFilter.
                    _b.sent();
                    // Test 6: mdbSort with projection (ensure both work together)
                    return [4 /*yield*/, (0, testing_1.async_test)('mdbSort-with-projection', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var results;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.endusers.getSome({
                                            filter: { id: { _in: enduserIds } },
                                            mdbSort: { fname: -1 },
                                            projection: { fname: 1, lname: 1 },
                                        })];
                                    case 1:
                                        results = _a.sent();
                                        (0, testing_1.assert)(results.length === 4, 'Expected 4 endusers');
                                        // Verify sort order (descending)
                                        (0, testing_1.assert)(results[0].fname === 'Charlie', 'First should be Charlie');
                                        // Verify projection (only fname, lname, plus id and createdAt)
                                        (0, testing_1.assert)(results[0].fname !== undefined, 'fname should be present');
                                        (0, testing_1.assert)(results[0].lname !== undefined, 'lname should be present');
                                        (0, testing_1.assert)(results[0].email === undefined, 'email should NOT be present');
                                        return [2 /*return*/, results];
                                }
                            });
                        }); }, { onResult: function () { return true; } })
                        // Test 7: Non-admin access with mdbSort (RBA still applies)
                    ];
                case 8:
                    // Test 6: mdbSort with projection (ensure both work together)
                    _b.sent();
                    // Test 7: Non-admin access with mdbSort (RBA still applies)
                    return [4 /*yield*/, (0, testing_1.async_test)('non-admin-mdbSort', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var results, fnames;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdkNonAdmin.api.endusers.getSome({
                                            filter: { id: { _in: enduserIds } },
                                            mdbSort: { fname: 1 },
                                        })
                                        // Non-admin should still get results (RBA should apply)
                                    ];
                                    case 1:
                                        results = _a.sent();
                                        // Non-admin should still get results (RBA should apply)
                                        (0, testing_1.assert)(Array.isArray(results), 'Non-admin should receive an array response');
                                        // Verify sort order
                                        if (results.length >= 2) {
                                            fnames = results.map(function (e) { return e.fname; });
                                            // Should be sorted alphabetically
                                            (0, testing_1.assert)(fnames[0] <= fnames[1], 'Non-admin results should be sorted');
                                        }
                                        return [2 /*return*/, results];
                                }
                            });
                        }); }, { onResult: function () { return true; } })
                        // Test 8: mdbSort fallback behavior (no mdbSort uses sortBy default)
                    ];
                case 9:
                    // Test 7: Non-admin access with mdbSort (RBA still applies)
                    _b.sent();
                    // Test 8: mdbSort fallback behavior (no mdbSort uses sortBy default)
                    return [4 /*yield*/, (0, testing_1.async_test)('no-mdbSort-fallback', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var results;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.endusers.getSome({
                                            filter: { id: { _in: enduserIds } },
                                            sortBy: 'updatedAt',
                                            sort: 'oldFirst',
                                        })];
                                    case 1:
                                        results = _a.sent();
                                        (0, testing_1.assert)(results.length === 4, 'Expected 4 endusers');
                                        // Verify traditional sortBy still works when mdbSort not provided
                                        (0, testing_1.assert)(results[0].id !== undefined, 'Should return valid endusers');
                                        return [2 /*return*/, results];
                                }
                            });
                        }); }, { onResult: function () { return true; } })];
                case 10:
                    // Test 8: mdbSort fallback behavior (no mdbSort uses sortBy default)
                    _b.sent();
                    return [3 /*break*/, 18];
                case 11:
                    _b.trys.push([11, 16, , 17]);
                    _i = 0, enduserIds_1 = enduserIds;
                    _b.label = 12;
                case 12:
                    if (!(_i < enduserIds_1.length)) return [3 /*break*/, 15];
                    enduserId = enduserIds_1[_i];
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduserId)];
                case 13:
                    _b.sent();
                    _b.label = 14;
                case 14:
                    _i++;
                    return [3 /*break*/, 12];
                case 15: return [3 /*break*/, 17];
                case 16:
                    error_1 = _b.sent();
                    console.error('Cleanup error:', error_1);
                    return [3 /*break*/, 17];
                case 17: return [7 /*endfinally*/];
                case 18: return [2 /*return*/];
            }
        });
    });
};
exports.mdb_sort_tests = mdb_sort_tests;
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
                    return [4 /*yield*/, (0, exports.mdb_sort_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ mdbSort test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ mdbSort test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=mdb_sort.test.js.map