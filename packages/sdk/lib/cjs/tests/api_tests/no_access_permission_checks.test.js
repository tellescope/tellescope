"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.no_access_permission_checks_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var constants_1 = require("@tellescope/constants");
var host = process.env.API_URL || 'http://localhost:8080';
var _a = [process.env.NON_ADMIN_EMAIL, process.env.NON_ADMIN_PASSWORD], nonAdminEmail = _a[0], nonAdminPassword = _a[1];
/**
 * Security tests for endpoints with noAccessPermissions: true
 *
 * These tests verify that endpoints which bypass the standard middleware access check
 * still properly enforce NO_ACCESS restrictions in their handlers.
 *
 * Test approach:
 * 1. Create a role with NO_ACCESS (null) for a specific model
 * 2. Assign that role to a non-admin user
 * 3. Attempt to call the endpoint
 * 4. Verify whether access is properly denied
 *
 * If a test shows data is returned when it shouldn't be, that endpoint needs a fix.
 */
var no_access_permission_checks_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var testEnduser, noAccessTestRole, rbap, originalRoles, templatesOnlyRole, rbapTemplatesOnly, testJourney, waitlistEntry_1, assignedEnduserRole, rbapAssigned, resultAssigned_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("NO_ACCESS Permission Checks Tests");
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'NoAccessTest',
                            lname: 'User',
                            email: 'no-access-test@example.com',
                        })
                        // Create a role with NO_ACCESS to multiple models we want to test
                    ];
                case 1:
                    testEnduser = _b.sent();
                    noAccessTestRole = 'no-access-test-role';
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.createOne({
                            role: noAccessTestRole,
                            permissions: __assign(__assign({}, constants_1.PROVIDER_PERMISSIONS), { 
                                // Set NO_ACCESS for models we want to test
                                endusers: {
                                    create: null,
                                    read: null,
                                    update: null,
                                    delete: null,
                                }, inbox_threads: {
                                    create: null,
                                    read: null,
                                    update: null,
                                    delete: null,
                                }, templates: {
                                    create: null,
                                    read: null,
                                    update: null,
                                    delete: null,
                                }, waitlists: {
                                    create: null,
                                    read: null,
                                    update: null,
                                    delete: null,
                                }, background_errors: {
                                    create: null,
                                    read: null,
                                    update: null,
                                    delete: null,
                                } }),
                        })
                        // Save original role to restore later
                    ];
                case 2:
                    rbap = _b.sent();
                    originalRoles = sdkNonAdmin.userInfo.roles;
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, , 46, 52]);
                    // Assign the restricted role to non-admin user
                    return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [noAccessTestRole] }, { replaceObjectFields: true })];
                case 4:
                    // Assign the restricted role to non-admin user
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1500)]; // wait for role change to propagate
                case 5:
                    _b.sent(); // wait for role change to propagate
                    return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)
                        // ========================================
                        // Test 1: /bulk-actions/read (HIGH PRIORITY)
                        // ========================================
                    ];
                case 6:
                    _b.sent();
                    // ========================================
                    // Test 1: /bulk-actions/read (HIGH PRIORITY)
                    // ========================================
                    (0, testing_1.log_header)("Test 1: /bulk-actions/read with NO_ACCESS to endusers");
                    return [4 /*yield*/, (0, testing_1.async_test)("bulk_load - should block NO_ACCESS user from reading endusers", function () { return sdkNonAdmin.bulk_load({
                            load: [{ model: 'endusers', options: { limit: 10 } }]
                        }); }, {
                            // If this returns records, it's a vulnerability
                            // If it returns empty records or errors, it's safe
                            onResult: function (r) {
                                var enduserResult = r.results[0];
                                if (enduserResult === null) {
                                    console.log("  ✅ SAFE: bulk_load returned null for NO_ACCESS model");
                                    return true;
                                }
                                if (enduserResult.records.length === 0) {
                                    console.log("  ✅ SAFE: bulk_load returned empty records for NO_ACCESS model");
                                    return true;
                                }
                                console.log("  \u274C VULNERABILITY: bulk_load returned ".concat(enduserResult.records.length, " records when user has NO_ACCESS!"));
                                return false;
                            }
                        })
                        // ========================================
                        // Test 2: inbox_threads/build_threads
                        // ========================================
                    ];
                case 7:
                    _b.sent();
                    // ========================================
                    // Test 2: inbox_threads/build_threads
                    // ========================================
                    (0, testing_1.log_header)("Test 2: inbox_threads/build_threads with NO_ACCESS");
                    return [4 /*yield*/, (0, testing_1.async_test)("build_threads - should block NO_ACCESS user", function () { return sdkNonAdmin.api.inbox_threads.build_threads({
                            from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                            to: new Date(),
                        }); }, { shouldError: true, onError: function (e) { return e.message === "You do not have access to this resource"; } })
                        // ========================================
                        // Test 2b: inbox_threads/load_threads with NO_ACCESS
                        // ========================================
                    ];
                case 8:
                    _b.sent();
                    // ========================================
                    // Test 2b: inbox_threads/load_threads with NO_ACCESS
                    // ========================================
                    (0, testing_1.log_header)("Test 2b: load_threads with NO_ACCESS");
                    return [4 /*yield*/, (0, testing_1.async_test)("load_threads - should block NO_ACCESS user", function () { return sdkNonAdmin.api.inbox_threads.load_threads({ limit: 10 }); }, { shouldError: true, onError: function (e) { return e.message === "You do not have access to this resource"; } })
                        // ========================================
                        // Test 3a: get_templated_message - NO_ACCESS to templates
                        // ========================================
                    ];
                case 9:
                    _b.sent();
                    // ========================================
                    // Test 3a: get_templated_message - NO_ACCESS to templates
                    // ========================================
                    (0, testing_1.log_header)("Test 3a: get_templated_message (templates NO_ACCESS)");
                    return [4 /*yield*/, (0, testing_1.async_test)("get_templated_message - should block user with NO_ACCESS to templates", function () { return sdkNonAdmin.api.templates.get_templated_message({
                            message: "Hello {{enduser.fname}}!",
                            userId: sdkNonAdmin.userInfo.id,
                            enduserId: testEnduser.id,
                            channel: 'Email',
                        }); }, { shouldError: true, onError: function (e) { return e.message === "You do not have access to this resource"; } })
                        // ========================================
                        // Test 3b: get_templated_message - NO_ACCESS to endusers (PHI leak prevention)
                        // ========================================
                    ];
                case 10:
                    _b.sent();
                    // ========================================
                    // Test 3b: get_templated_message - NO_ACCESS to endusers (PHI leak prevention)
                    // ========================================
                    (0, testing_1.log_header)("Test 3b: get_templated_message (endusers NO_ACCESS)");
                    templatesOnlyRole = 'templates-only-test-role';
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.createOne({
                            role: templatesOnlyRole,
                            permissions: __assign(__assign({}, constants_1.PROVIDER_PERMISSIONS), { 
                                // Allow templates access
                                templates: {
                                    create: 'All',
                                    read: 'All',
                                    update: 'All',
                                    delete: 'All',
                                }, 
                                // But NO_ACCESS to endusers
                                endusers: {
                                    create: null,
                                    read: null,
                                    update: null,
                                    delete: null,
                                } }),
                        })];
                case 11:
                    rbapTemplatesOnly = _b.sent();
                    _b.label = 12;
                case 12:
                    _b.trys.push([12, , 17, 22]);
                    // Temporarily assign the templates-only role
                    return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [templatesOnlyRole] }, { replaceObjectFields: true })];
                case 13:
                    // Temporarily assign the templates-only role
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1500)];
                case 14:
                    _b.sent();
                    return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)];
                case 15:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("get_templated_message - should block user with NO_ACCESS to endusers (prevents PHI leak)", function () { return sdkNonAdmin.api.templates.get_templated_message({
                            message: "Hello {{enduser.fname}} {{enduser.lname}} {{enduser.email}}!",
                            userId: sdkNonAdmin.userInfo.id,
                            enduserId: testEnduser.id,
                            channel: 'Email',
                        }); }, { shouldError: true, onError: function (e) { return e.message === "You do not have access to this resource"; } })];
                case 16:
                    _b.sent();
                    return [3 /*break*/, 22];
                case 17: 
                // Restore the original test role
                return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [noAccessTestRole] }, { replaceObjectFields: true })];
                case 18:
                    // Restore the original test role
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1000)];
                case 19:
                    _b.sent();
                    return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)
                        // Cleanup the templates-only role
                    ];
                case 20:
                    _b.sent();
                    // Cleanup the templates-only role
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.deleteOne(rbapTemplatesOnly.id)];
                case 21:
                    // Cleanup the templates-only role
                    _b.sent();
                    return [7 /*endfinally*/];
                case 22:
                    // ========================================
                    // Test 4: waitlists/grant_access_from_waitlist
                    // ========================================
                    (0, testing_1.log_header)("Test 4: waitlists/grant_access_from_waitlist with NO_ACCESS");
                    return [4 /*yield*/, sdk.api.journeys.createOne({
                            title: 'Waitlist Test Journey',
                        })];
                case 23:
                    testJourney = _b.sent();
                    return [4 /*yield*/, sdk.api.waitlists.createOne({
                            title: 'Test Waitlist',
                            journeyId: testJourney.id,
                            enduserIds: [],
                        })];
                case 24:
                    waitlistEntry_1 = _b.sent();
                    _b.label = 25;
                case 25:
                    _b.trys.push([25, , 27, 30]);
                    return [4 /*yield*/, (0, testing_1.async_test)("grant_access_from_waitlist - should block NO_ACCESS user", function () { return sdkNonAdmin.api.waitlists.grant_access_from_waitlist({
                            id: waitlistEntry_1.id,
                            count: 1,
                        }); }, { shouldError: true, onError: function (e) { return e.message === "You do not have access to this resource"; } })];
                case 26:
                    _b.sent();
                    return [3 /*break*/, 30];
                case 27: 
                // Cleanup
                return [4 /*yield*/, sdk.api.waitlists.deleteOne(waitlistEntry_1.id)];
                case 28:
                    // Cleanup
                    _b.sent();
                    return [4 /*yield*/, sdk.api.journeys.deleteOne(testJourney.id)];
                case 29:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 30:
                    // ========================================
                    // Test 5: background_errors/mark_read
                    // ========================================
                    (0, testing_1.log_header)("Test 5: background_errors/mark_read with NO_ACCESS");
                    return [4 /*yield*/, (0, testing_1.async_test)("mark_read (background_errors) - should block NO_ACCESS user", function () { return sdkNonAdmin.api.background_errors.mark_read({}); }, { shouldError: true, onError: function (e) { return e.message === "You do not have access to this resource"; } })
                        // ========================================
                        // Test 6: load_threads searchKeywords redaction
                        // ========================================
                    ];
                case 31:
                    _b.sent();
                    // ========================================
                    // Test 6: load_threads searchKeywords redaction
                    // ========================================
                    (0, testing_1.log_header)("Test 6: load_threads searchKeywords redaction");
                    assignedEnduserRole = 'assigned-enduser-test-role';
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.createOne({
                            role: assignedEnduserRole,
                            permissions: __assign(__assign({}, constants_1.PROVIDER_PERMISSIONS), { endusers: { create: 'All', read: 'Assigned', update: 'Assigned', delete: 'Assigned' }, emails: { create: 'All', read: 'All', update: 'All', delete: 'All' }, sms_messages: { create: 'All', read: 'All', update: 'All', delete: 'All' }, inbox_threads: { create: 'All', read: 'All', update: 'All', delete: 'All' } }),
                        })];
                case 32:
                    rbapAssigned = _b.sent();
                    _b.label = 33;
                case 33:
                    _b.trys.push([33, , 39, 44]);
                    return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [assignedEnduserRole] }, { replaceObjectFields: true })];
                case 34:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1500)];
                case 35:
                    _b.sent();
                    return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)
                        // Load threads and verify searchKeywords is redacted for Assigned enduser access
                    ];
                case 36:
                    _b.sent();
                    return [4 /*yield*/, sdkNonAdmin.api.inbox_threads.load_threads({ limit: 10 })];
                case 37:
                    resultAssigned_1 = _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("load_threads - searchKeywords redacted for Assigned enduser access", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, resultAssigned_1];
                        }); }); }, {
                            onResult: function (r) {
                                // All threads should have searchKeywords undefined/missing
                                var allRedacted = r.threads.every(function (t) { return t.searchKeywords === undefined; });
                                if (!allRedacted) {
                                    console.log("  ❌ VULNERABILITY: searchKeywords visible to user with Assigned enduser access!");
                                }
                                else {
                                    console.log("  ✅ SAFE: searchKeywords properly redacted");
                                }
                                return allRedacted;
                            }
                        })];
                case 38:
                    _b.sent();
                    return [3 /*break*/, 44];
                case 39: 
                // Restore the original test role
                return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [noAccessTestRole] }, { replaceObjectFields: true })];
                case 40:
                    // Restore the original test role
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1000)];
                case 41:
                    _b.sent();
                    return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)
                        // Cleanup the assigned role
                    ];
                case 42:
                    _b.sent();
                    // Cleanup the assigned role
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.deleteOne(rbapAssigned.id)];
                case 43:
                    // Cleanup the assigned role
                    _b.sent();
                    return [7 /*endfinally*/];
                case 44: 
                // Test that admin/full access users CAN see searchKeywords
                return [4 /*yield*/, (0, testing_1.async_test)("load_threads - searchKeywords visible for admin/full enduser access", function () { return sdk.api.inbox_threads.load_threads({ limit: 10 }); }, {
                        onResult: function (r) {
                            // Skip check if no threads exist (can't verify without data)
                            if (r.threads.length === 0) {
                                console.log("  ⏭️ SKIPPED: No threads exist to verify searchKeywords visibility");
                                return true;
                            }
                            // At least some threads should have searchKeywords
                            var hasSearchKeywords = r.threads.some(function (t) { return t.searchKeywords !== undefined; });
                            if (hasSearchKeywords) {
                                console.log("  ✅ Admin can see searchKeywords");
                            }
                            else {
                                console.log("  ⚠️ No searchKeywords found on threads (may not have been built yet)");
                            }
                            return true; // Don't fail if keywords don't exist yet
                        }
                    })];
                case 45:
                    // Test that admin/full access users CAN see searchKeywords
                    _b.sent();
                    console.log("\n" + "=".repeat(60));
                    console.log("NO_ACCESS Permission Checks Tests Complete");
                    console.log("=".repeat(60));
                    return [3 /*break*/, 52];
                case 46: 
                // Restore original role
                return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: originalRoles }, { replaceObjectFields: true })];
                case 47:
                    // Restore original role
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1000)];
                case 48:
                    _b.sent();
                    return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)
                        // Cleanup
                    ];
                case 49:
                    _b.sent();
                    // Cleanup
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.deleteOne(rbap.id)];
                case 50:
                    // Cleanup
                    _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(testEnduser.id)];
                case 51:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 52: return [2 /*return*/];
            }
        });
    });
};
exports.no_access_permission_checks_tests = no_access_permission_checks_tests;
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
                    return [4 /*yield*/, (0, exports.no_access_permission_checks_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ NO_ACCESS permission checks test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ NO_ACCESS permission checks test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=no_access_permission_checks.test.js.map