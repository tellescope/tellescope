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
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulk_assignment_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || 'http://localhost:8080';
// Main test function for bulk_assignment endpoint
var bulk_assignment_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var customTypeId, user1, user2, enduserWithCustomType, enduserWithEmptyCustomType, enduserWithoutCustomType, enduserWithDifferentField;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("Bulk Assignment Tests");
                    customTypeId = '507f1f77bcf86cd799439011' // Valid MongoDB ObjectId
                    ;
                    return [4 /*yield*/, sdk.api.users.createOne({
                            email: "test-user-1-".concat(Date.now(), "@test.com"),
                            fname: 'Test',
                            lname: 'User1',
                        })];
                case 1:
                    user1 = _b.sent();
                    return [4 /*yield*/, sdk.api.users.createOne({
                            email: "test-user-2-".concat(Date.now(), "@test.com"),
                            fname: 'Test',
                            lname: 'User2',
                        })
                        // Create endusers with different customTypeId scenarios
                    ];
                case 2:
                    user2 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'Test',
                            lname: 'WithType',
                            customTypeId: customTypeId,
                            fields: { Building: ['Building A'] },
                        })];
                case 3:
                    enduserWithCustomType = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'Test',
                            lname: 'EmptyType',
                            customTypeId: '',
                            fields: { Building: ['Building A'] },
                        })];
                case 4:
                    enduserWithEmptyCustomType = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'Test',
                            lname: 'NoType',
                            // customTypeId not set (will be missing from document)
                            fields: { Building: ['Building B'] },
                        })];
                case 5:
                    enduserWithoutCustomType = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'Test',
                            lname: 'DifferentField',
                            customTypeId: '',
                            fields: { Building: ['Building C'] },
                        })
                        // Test 1: Add care team members with specific customTypeId
                    ];
                case 6:
                    enduserWithDifferentField = _b.sent();
                    // Test 1: Add care team members with specific customTypeId
                    return [4 /*yield*/, (0, testing_1.async_test)("bulk_assignment: Add care team with specific customTypeId", function () { return sdk.api.endusers.bulk_assignment({
                            customTypeId: customTypeId,
                            addIds: [user1.id],
                        }); }, {
                            onResult: function (r) {
                                var _a;
                                return (r.updated.length === 1
                                    && r.updated[0].id === enduserWithCustomType.id
                                    && !!((_a = r.updated[0].assignedTo) === null || _a === void 0 ? void 0 : _a.includes(user1.id)));
                            }
                        })
                        // Test 2: Add care team members with undefined customTypeId (should match empty string AND missing)
                    ];
                case 7:
                    // Test 1: Add care team members with specific customTypeId
                    _b.sent();
                    // Test 2: Add care team members with undefined customTypeId (should match empty string AND missing)
                    return [4 /*yield*/, (0, testing_1.async_test)("bulk_assignment: Add care team with undefined customTypeId (matches empty and missing)", function () { return sdk.api.endusers.bulk_assignment({
                            customTypeId: undefined,
                            addIds: [user2.id],
                        }); }, {
                            onResult: function (r) {
                                // Should update endusers with empty string customTypeId and missing customTypeId
                                // Should NOT update enduserWithCustomType (has actual customTypeId set)
                                var updatedIds = r.updated.map(function (e) { return e.id; }).sort();
                                var expectedIds = [enduserWithEmptyCustomType.id, enduserWithoutCustomType.id, enduserWithDifferentField.id].sort();
                                return (r.updated.length === 3
                                    && JSON.stringify(updatedIds) === JSON.stringify(expectedIds)
                                    && r.updated.every(function (e) { var _a; return !!((_a = e.assignedTo) === null || _a === void 0 ? void 0 : _a.includes(user2.id)); }));
                            }
                        })
                        // Test 3: Add care team members with empty string customTypeId
                    ];
                case 8:
                    // Test 2: Add care team members with undefined customTypeId (should match empty string AND missing)
                    _b.sent();
                    // Test 3: Add care team members with empty string customTypeId
                    return [4 /*yield*/, (0, testing_1.async_test)("bulk_assignment: Add care team with empty string customTypeId", function () { return sdk.api.endusers.bulk_assignment({
                            customTypeId: '',
                            addIds: [user1.id],
                        }); }, {
                            onResult: function (r) {
                                // Should update endusers with empty string customTypeId and missing customTypeId
                                var updatedIds = r.updated.map(function (e) { return e.id; }).sort();
                                var expectedIds = [enduserWithEmptyCustomType.id, enduserWithoutCustomType.id, enduserWithDifferentField.id].sort();
                                return (r.updated.length === 3
                                    && JSON.stringify(updatedIds) === JSON.stringify(expectedIds)
                                    && r.updated.every(function (e) { var _a; return !!((_a = e.assignedTo) === null || _a === void 0 ? void 0 : _a.includes(user1.id)); }));
                            }
                        })
                        // Test 4: Remove care team members with existingAssignment filter
                    ];
                case 9:
                    // Test 3: Add care team members with empty string customTypeId
                    _b.sent();
                    // Test 4: Remove care team members with existingAssignment filter
                    return [4 /*yield*/, (0, testing_1.async_test)("bulk_assignment: Remove care team with existingAssignment filter (All Of)", function () { return sdk.api.endusers.bulk_assignment({
                            customTypeId: undefined,
                            existingAssignment: {
                                qualifier: 'All Of',
                                values: [user1.id, user2.id],
                            },
                            removeIds: [user2.id],
                        }); }, {
                            onResult: function (r) { return (r.updated.every(function (e) {
                                var _a, _b;
                                return !((_a = e.assignedTo) === null || _a === void 0 ? void 0 : _a.includes(user2.id)) && // user2 removed
                                    !!((_b = e.assignedTo) === null || _b === void 0 ? void 0 : _b.includes(user1.id));
                            } // user1 still present
                            )); }
                        })
                        // Test 5: Add care team members with existingAssignment filter (One Of)
                    ];
                case 10:
                    // Test 4: Remove care team members with existingAssignment filter
                    _b.sent();
                    // Test 5: Add care team members with existingAssignment filter (One Of)
                    return [4 /*yield*/, (0, testing_1.async_test)("bulk_assignment: Add with existingAssignment filter (One Of)", function () { return sdk.api.endusers.bulk_assignment({
                            customTypeId: undefined,
                            existingAssignment: {
                                qualifier: 'One Of',
                                values: [user1.id],
                            },
                            addIds: [user2.id],
                        }); }, {
                            onResult: function (r) { return (r.updated.every(function (e) {
                                var _a, _b;
                                return !!((_a = e.assignedTo) === null || _a === void 0 ? void 0 : _a.includes(user1.id)) &&
                                    !!((_b = e.assignedTo) === null || _b === void 0 ? void 0 : _b.includes(user2.id));
                            })); }
                        })
                        // Test 6: Add care team members with custom field filter (array field)
                    ];
                case 11:
                    // Test 5: Add care team members with existingAssignment filter (One Of)
                    _b.sent();
                    // Test 6: Add care team members with custom field filter (array field)
                    return [4 /*yield*/, (0, testing_1.async_test)("bulk_assignment: Add with custom field filter (array value)", function () { return sdk.api.endusers.bulk_assignment({
                            customTypeId: undefined,
                            field: 'Building',
                            existingFieldValue: 'Building A',
                            addIds: [sdk.userInfo.id], // Use admin user ID
                        }); }, {
                            onResult: function (r) {
                                // Should match endusers where Building array contains 'Building A'
                                // Note: May return fewer than 2 if some already have this user assigned
                                var updatedIds = r.updated.map(function (e) { return e.id; });
                                var hasCorrectEnduser = updatedIds.includes(enduserWithEmptyCustomType.id) || updatedIds.includes(enduserWithCustomType.id);
                                return (r.updated.length >= 1
                                    && hasCorrectEnduser
                                    && r.updated.every(function (e) { var _a; return !!((_a = e.assignedTo) === null || _a === void 0 ? void 0 : _a.includes(sdk.userInfo.id)); })
                                    && r.updated.every(function (e) {
                                        var _a;
                                        var building = (_a = e.fields) === null || _a === void 0 ? void 0 : _a.Building;
                                        return Array.isArray(building) ? building.includes('Building A') : building === 'Building A';
                                    }));
                            }
                        })
                        // Test 7: Remove care team members with combined filters
                    ];
                case 12:
                    // Test 6: Add care team members with custom field filter (array field)
                    _b.sent();
                    // Test 7: Remove care team members with combined filters
                    return [4 /*yield*/, (0, testing_1.async_test)("bulk_assignment: Remove with combined filters (customTypeId + field + existingAssignment)", function () { return sdk.api.endusers.bulk_assignment({
                            customTypeId: '',
                            field: 'Building',
                            existingFieldValue: 'Building A',
                            existingAssignment: {
                                qualifier: 'All Of',
                                values: [user1.id],
                            },
                            removeIds: [user1.id],
                        }); }, {
                            onResult: function (r) {
                                var _a;
                                return (r.updated.length === 1
                                    && r.updated[0].id === enduserWithEmptyCustomType.id
                                    && !((_a = r.updated[0].assignedTo) === null || _a === void 0 ? void 0 : _a.includes(user1.id)));
                            }
                        })
                        // Test 8: Error when neither addIds nor removeIds provided
                    ];
                case 13:
                    // Test 7: Remove care team members with combined filters
                    _b.sent();
                    // Test 8: Error when neither addIds nor removeIds provided
                    return [4 /*yield*/, (0, testing_1.async_test)("bulk_assignment: Error when no addIds or removeIds", function () { return sdk.api.endusers.bulk_assignment({
                            customTypeId: customTypeId,
                        }); }, testing_1.handleAnyError)
                        // Cleanup
                    ];
                case 14:
                    // Test 8: Error when neither addIds nor removeIds provided
                    _b.sent();
                    // Cleanup
                    return [4 /*yield*/, Promise.all([
                            sdk.api.endusers.deleteOne(enduserWithCustomType.id),
                            sdk.api.endusers.deleteOne(enduserWithEmptyCustomType.id),
                            sdk.api.endusers.deleteOne(enduserWithoutCustomType.id),
                            sdk.api.endusers.deleteOne(enduserWithDifferentField.id),
                            sdk.api.users.deleteOne(user1.id),
                            sdk.api.users.deleteOne(user2.id),
                        ])];
                case 15:
                    // Cleanup
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
};
exports.bulk_assignment_tests = bulk_assignment_tests;
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
                    return [4 /*yield*/, (0, exports.bulk_assignment_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Bulk assignment test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Bulk assignment test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=bulk_assignment.test.js.map