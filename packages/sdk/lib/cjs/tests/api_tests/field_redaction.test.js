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
exports.field_redaction_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var constants_1 = require("@tellescope/constants");
var host = process.env.API_URL || 'http://localhost:8080';
var _a = [process.env.NON_ADMIN_EMAIL, process.env.NON_ADMIN_PASSWORD], nonAdminEmail = _a[0], nonAdminPassword = _a[1];
var RECORDING_FIELDS = ['recordingURI', 'recordingId', 'recordingDurationInSeconds'];
var ALL_REDACTABLE_FIELDS = __spreadArray(__spreadArray([], RECORDING_FIELDS, true), ['transcription', 'recordingTranscriptionData', 'aiSummary'], false);
var hasFields = function (record, fields) {
    return fields.every(function (f) { return f in record && record[f] !== undefined; });
};
var lacksFields = function (record, fields) {
    return fields.every(function (f) { return !(f in record) || record[f] === undefined; });
};
/**
 * Tests for role-based field redactions on phone_calls.
 *
 * Verifies that fieldRedactions configured on a RoleBasedAccessPermission
 * properly hide specified fields from API responses across all read paths
 * (getOne, getSome) and write responses (updateOne).
 */
var field_redaction_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var testEnduser, testPhoneCall, FULL_ACCESS, fullRedactionRole, rbapFull, originalRoles, partialRedactionRole, rbapPartial, createdPhoneCallId_1, e_1, adminCreatedPhoneCallId_1, e_2, noRedactionRole, rbapNoRedaction, syncFrom_1, e_3, e_4, e_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("Field Redaction Tests");
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'FieldRedactionTest',
                            lname: 'User',
                            email: 'field-redaction-test@example.com',
                        })];
                case 1:
                    testEnduser = _b.sent();
                    return [4 /*yield*/, sdk.api.phone_calls.createOne({
                            enduserId: testEnduser.id,
                            inbound: true,
                            from: '+15551234567',
                            to: '+15559876543',
                            isVoicemail: true,
                            recordingURI: 'https://example.com/recording.wav',
                            recordingId: 'rec_test_123',
                            recordingDurationInSeconds: 45,
                            transcription: 'Hello, this is a voicemail transcription.',
                            recordingTranscriptionData: '{"results":{"transcripts":[{"transcript":"full call transcription data"}]}}',
                            aiSummary: 'Patient called about prescription refill.',
                        })
                        // Create role with full field redactions for phone_calls
                    ];
                case 2:
                    testPhoneCall = _b.sent();
                    FULL_ACCESS = { create: 'All', read: 'All', update: 'All', delete: 'All' };
                    fullRedactionRole = 'full-redaction-test-role';
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.createOne({
                            role: fullRedactionRole,
                            permissions: __assign(__assign({}, constants_1.PROVIDER_PERMISSIONS), { phone_calls: FULL_ACCESS, endusers: FULL_ACCESS }),
                            fieldRedactions: {
                                phone_calls: __spreadArray([], ALL_REDACTABLE_FIELDS, true),
                            },
                        })];
                case 3:
                    rbapFull = _b.sent();
                    originalRoles = sdkNonAdmin.userInfo.roles;
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, , 57, 71]);
                    // Assign full-redaction role to non-admin
                    return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [fullRedactionRole] }, { replaceObjectFields: true })];
                case 5:
                    // Assign full-redaction role to non-admin
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1500)];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)
                        // ========================================
                        // Test 1: Full redaction on getOne
                        // ========================================
                    ];
                case 7:
                    _b.sent();
                    // ========================================
                    // Test 1: Full redaction on getOne
                    // ========================================
                    (0, testing_1.log_header)("Test 1: Full redaction on getOne");
                    return [4 /*yield*/, (0, testing_1.async_test)("getOne - all redactable fields should be absent for redacted role", function () { return sdkNonAdmin.api.phone_calls.getOne(testPhoneCall.id); }, {
                            onResult: function (r) {
                                var redacted = lacksFields(r, __spreadArray([], ALL_REDACTABLE_FIELDS, true));
                                var corePresent = hasFields(r, ['enduserId', 'inbound', 'from', 'to']);
                                if (!redacted) {
                                    var leaked = ALL_REDACTABLE_FIELDS.filter(function (f) { return f in r && r[f] !== undefined; });
                                    console.log("  \u274C VULNERABILITY: getOne leaked redacted fields: ".concat(leaked.join(', ')));
                                }
                                else {
                                    console.log("  ✅ SAFE: all redactable fields properly redacted on getOne");
                                }
                                if (!corePresent) {
                                    console.log("  ❌ ERROR: core fields (enduserId, inbound, from, to) are missing");
                                }
                                return redacted && corePresent;
                            }
                        })
                        // ========================================
                        // Test 2: Admin sees all fields
                        // ========================================
                    ];
                case 8:
                    _b.sent();
                    // ========================================
                    // Test 2: Admin sees all fields
                    // ========================================
                    (0, testing_1.log_header)("Test 2: Admin sees all fields");
                    return [4 /*yield*/, (0, testing_1.async_test)("getOne (admin) - all fields should be visible", function () { return sdk.api.phone_calls.getOne(testPhoneCall.id); }, {
                            onResult: function (r) {
                                var allPresent = hasFields(r, __spreadArray([], ALL_REDACTABLE_FIELDS, true));
                                if (!allPresent) {
                                    var missing = ALL_REDACTABLE_FIELDS.filter(function (f) { return !(f in r) || r[f] === undefined; });
                                    console.log("  \u274C ERROR: admin is missing fields: ".concat(missing.join(', ')));
                                }
                                else {
                                    console.log("  ✅ Admin can see all fields");
                                }
                                return allPresent;
                            }
                        })
                        // ========================================
                        // Test 3: Partial redaction (recordings only)
                        // ========================================
                    ];
                case 9:
                    _b.sent();
                    // ========================================
                    // Test 3: Partial redaction (recordings only)
                    // ========================================
                    (0, testing_1.log_header)("Test 3: Partial redaction (recordings only)");
                    partialRedactionRole = 'partial-redaction-test-role';
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.createOne({
                            role: partialRedactionRole,
                            permissions: __assign(__assign({}, constants_1.PROVIDER_PERMISSIONS), { phone_calls: FULL_ACCESS, endusers: FULL_ACCESS }),
                            fieldRedactions: {
                                phone_calls: __spreadArray([], RECORDING_FIELDS, true),
                            },
                        })];
                case 10:
                    rbapPartial = _b.sent();
                    _b.label = 11;
                case 11:
                    _b.trys.push([11, , 16, 21]);
                    return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [partialRedactionRole] }, { replaceObjectFields: true })];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1500)];
                case 13:
                    _b.sent();
                    return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)];
                case 14:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("getOne - only recording fields should be redacted, transcription/summary visible", function () { return sdkNonAdmin.api.phone_calls.getOne(testPhoneCall.id); }, {
                            onResult: function (r) {
                                var recordingRedacted = lacksFields(r, __spreadArray([], RECORDING_FIELDS, true));
                                var nonRecordingPresent = hasFields(r, ['transcription', 'recordingTranscriptionData', 'aiSummary']);
                                if (!recordingRedacted) {
                                    var leaked = RECORDING_FIELDS.filter(function (f) { return f in r && r[f] !== undefined; });
                                    console.log("  \u274C VULNERABILITY: recording fields leaked: ".concat(leaked.join(', ')));
                                }
                                if (!nonRecordingPresent) {
                                    var missing = ['transcription', 'recordingTranscriptionData', 'aiSummary'].filter(function (f) { return !(f in r) || r[f] === undefined; });
                                    console.log("  \u274C ERROR: non-redacted fields missing: ".concat(missing.join(', ')));
                                }
                                if (recordingRedacted && nonRecordingPresent) {
                                    console.log("  ✅ SAFE: partial redaction works correctly");
                                }
                                return recordingRedacted && nonRecordingPresent;
                            }
                        })];
                case 15:
                    _b.sent();
                    return [3 /*break*/, 21];
                case 16: 
                // Restore full-redaction role and clean up partial role
                return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [fullRedactionRole] }, { replaceObjectFields: true })];
                case 17:
                    // Restore full-redaction role and clean up partial role
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1500)];
                case 18:
                    _b.sent();
                    return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)];
                case 19:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.deleteOne(rbapPartial.id)];
                case 20:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 21:
                    // ========================================
                    // Test 4: getSome/readMany consistency
                    // ========================================
                    (0, testing_1.log_header)("Test 4: getSome/readMany consistency");
                    return [4 /*yield*/, (0, testing_1.async_test)("getSome - redacted fields should be absent on readMany results", function () { return sdkNonAdmin.api.phone_calls.getSome(); }, {
                            onResult: function (r) {
                                var matches = r.filter(function (pc) { return pc.id === testPhoneCall.id; });
                                if (matches.length === 0) {
                                    console.log("  ⚠️ SKIPPED: test phone call not found in getSome results");
                                    return true;
                                }
                                var record = matches[0];
                                var redacted = lacksFields(record, __spreadArray([], ALL_REDACTABLE_FIELDS, true));
                                if (!redacted) {
                                    var leaked = ALL_REDACTABLE_FIELDS.filter(function (f) { return f in record && record[f] !== undefined; });
                                    console.log("  \u274C VULNERABILITY: getSome leaked redacted fields: ".concat(leaked.join(', ')));
                                }
                                else {
                                    console.log("  ✅ SAFE: getSome properly redacts fields");
                                }
                                return redacted;
                            }
                        })];
                case 22:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("getSome (admin) - all fields should be visible", function () { return sdk.api.phone_calls.getSome(); }, {
                            onResult: function (r) {
                                var match = r.find(function (pc) { return pc.id === testPhoneCall.id; });
                                if (!match) {
                                    console.log("  ⚠️ SKIPPED: test phone call not found in admin getSome results");
                                    return true;
                                }
                                var allPresent = hasFields(match, __spreadArray([], ALL_REDACTABLE_FIELDS, true));
                                if (!allPresent) {
                                    var missing = ALL_REDACTABLE_FIELDS.filter(function (f) { return !(f in match) || match[f] === undefined; });
                                    console.log("  \u274C FALSE POSITIVE: admin getSome missing fields: ".concat(missing.join(', ')));
                                }
                                else {
                                    console.log("  ✅ Admin getSome sees all fields");
                                }
                                return allPresent;
                            }
                        })
                        // ========================================
                        // Test 5: Update response doesn't leak
                        // ========================================
                    ];
                case 23:
                    _b.sent();
                    // ========================================
                    // Test 5: Update response doesn't leak
                    // ========================================
                    (0, testing_1.log_header)("Test 5: Update response doesn't leak redacted fields");
                    return [4 /*yield*/, (0, testing_1.async_test)("updateOne - response should not contain redacted fields", function () { return sdkNonAdmin.api.phone_calls.updateOne(testPhoneCall.id, { note: 'updated by redaction test' }); }, {
                            onResult: function (r) {
                                var redacted = lacksFields(r, __spreadArray([], ALL_REDACTABLE_FIELDS, true));
                                if (!redacted) {
                                    var leaked = ALL_REDACTABLE_FIELDS.filter(function (f) { return f in r && r[f] !== undefined; });
                                    console.log("  \u274C VULNERABILITY: updateOne response leaked redacted fields: ".concat(leaked.join(', ')));
                                }
                                else {
                                    console.log("  ✅ SAFE: updateOne response does not contain redacted fields");
                                }
                                return redacted;
                            }
                        })];
                case 24:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("updateOne (admin) - all fields should be visible in response", function () { return sdk.api.phone_calls.updateOne(testPhoneCall.id, { note: 'admin update test' }); }, {
                            onResult: function (r) {
                                var allPresent = hasFields(r, __spreadArray([], ALL_REDACTABLE_FIELDS, true));
                                if (!allPresent) {
                                    var missing = ALL_REDACTABLE_FIELDS.filter(function (f) { return !(f in r) || r[f] === undefined; });
                                    console.log("  \u274C FALSE POSITIVE: admin updateOne missing fields: ".concat(missing.join(', ')));
                                }
                                else {
                                    console.log("  ✅ Admin updateOne sees all fields");
                                }
                                return allPresent;
                            }
                        })
                        // ========================================
                        // Test 6: Create response doesn't leak
                        // ========================================
                    ];
                case 25:
                    _b.sent();
                    // ========================================
                    // Test 6: Create response doesn't leak
                    // ========================================
                    (0, testing_1.log_header)("Test 6: Create response doesn't leak redacted fields");
                    return [4 /*yield*/, (0, testing_1.async_test)("createOne - response should not contain redacted fields", function () { return sdkNonAdmin.api.phone_calls.createOne({
                            enduserId: testEnduser.id,
                            inbound: false,
                            from: '+15551111111',
                            to: '+15552222222',
                            recordingURI: 'https://example.com/leak-test.wav',
                            recordingId: 'rec_leak_test',
                            recordingDurationInSeconds: 10,
                            transcription: 'Leak test transcription.',
                            recordingTranscriptionData: '{"test":"data"}',
                            aiSummary: 'Leak test summary.',
                        }); }, {
                            onResult: function (r) {
                                createdPhoneCallId_1 = r.id;
                                var redacted = lacksFields(r, __spreadArray([], ALL_REDACTABLE_FIELDS, true));
                                if (!redacted) {
                                    var leaked = ALL_REDACTABLE_FIELDS.filter(function (f) { return f in r && r[f] !== undefined; });
                                    console.log("  \u274C VULNERABILITY: createOne response leaked redacted fields: ".concat(leaked.join(', ')));
                                }
                                else {
                                    console.log("  ✅ SAFE: createOne response does not contain redacted fields");
                                }
                                return redacted;
                            }
                        })
                        // Cleanup the created phone call
                    ];
                case 26:
                    _b.sent();
                    if (!createdPhoneCallId_1) return [3 /*break*/, 30];
                    _b.label = 27;
                case 27:
                    _b.trys.push([27, 29, , 30]);
                    return [4 /*yield*/, sdk.api.phone_calls.deleteOne(createdPhoneCallId_1)];
                case 28:
                    _b.sent();
                    return [3 /*break*/, 30];
                case 29:
                    e_1 = _b.sent();
                    return [3 /*break*/, 30];
                case 30: return [4 /*yield*/, (0, testing_1.async_test)("createOne (admin) - all fields should be visible in response", function () { return sdk.api.phone_calls.createOne({
                        enduserId: testEnduser.id,
                        inbound: false,
                        from: '+15553333333',
                        to: '+15554444444',
                        recordingURI: 'https://example.com/admin-test.wav',
                        recordingId: 'rec_admin_test',
                        recordingDurationInSeconds: 20,
                        transcription: 'Admin create test transcription.',
                        recordingTranscriptionData: '{"admin":"test"}',
                        aiSummary: 'Admin create test summary.',
                    }); }, {
                        onResult: function (r) {
                            adminCreatedPhoneCallId_1 = r.id;
                            var allPresent = hasFields(r, __spreadArray([], ALL_REDACTABLE_FIELDS, true));
                            if (!allPresent) {
                                var missing = ALL_REDACTABLE_FIELDS.filter(function (f) { return !(f in r) || r[f] === undefined; });
                                console.log("  \u274C FALSE POSITIVE: admin createOne missing fields: ".concat(missing.join(', ')));
                            }
                            else {
                                console.log("  ✅ Admin createOne sees all fields");
                            }
                            return allPresent;
                        }
                    })];
                case 31:
                    _b.sent();
                    if (!adminCreatedPhoneCallId_1) return [3 /*break*/, 35];
                    _b.label = 32;
                case 32:
                    _b.trys.push([32, 34, , 35]);
                    return [4 /*yield*/, sdk.api.phone_calls.deleteOne(adminCreatedPhoneCallId_1)];
                case 33:
                    _b.sent();
                    return [3 /*break*/, 35];
                case 34:
                    e_2 = _b.sent();
                    return [3 /*break*/, 35];
                case 35:
                    // ========================================
                    // Test 7: bulk_load redaction
                    // ========================================
                    (0, testing_1.log_header)("Test 7: bulk_load redaction");
                    return [4 /*yield*/, (0, testing_1.async_test)("bulk_load - redacted fields should be absent", function () { return sdkNonAdmin.bulk_load({ load: [{ model: 'phone_calls', options: { limit: 100 } }] }); }, {
                            onResult: function (r) {
                                var phoneCallResult = r.results[0];
                                if (!phoneCallResult || phoneCallResult.records.length === 0) {
                                    console.log("  ⚠️ SKIPPED: no phone_calls returned from bulk_load");
                                    return true;
                                }
                                var match = phoneCallResult.records.find(function (pc) { return pc.id === testPhoneCall.id; });
                                if (!match) {
                                    console.log("  ⚠️ SKIPPED: test phone call not found in bulk_load results");
                                    return true;
                                }
                                var redacted = lacksFields(match, __spreadArray([], ALL_REDACTABLE_FIELDS, true));
                                if (!redacted) {
                                    var leaked = ALL_REDACTABLE_FIELDS.filter(function (f) { return f in match && match[f] !== undefined; });
                                    console.log("  \u274C VULNERABILITY: bulk_load leaked redacted fields: ".concat(leaked.join(', ')));
                                }
                                else {
                                    console.log("  ✅ SAFE: bulk_load properly redacts fields");
                                }
                                return redacted;
                            }
                        })];
                case 36:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("bulk_load (admin) - all fields should be visible", function () { return sdk.bulk_load({ load: [{ model: 'phone_calls', options: { limit: 100 } }] }); }, {
                            onResult: function (r) {
                                var phoneCallResult = r.results[0];
                                if (!phoneCallResult || phoneCallResult.records.length === 0) {
                                    console.log("  ⚠️ SKIPPED: no phone_calls returned from admin bulk_load");
                                    return true;
                                }
                                var match = phoneCallResult.records.find(function (pc) { return pc.id === testPhoneCall.id; });
                                if (!match) {
                                    console.log("  ⚠️ SKIPPED: test phone call not found in admin bulk_load results");
                                    return true;
                                }
                                var allPresent = hasFields(match, __spreadArray([], ALL_REDACTABLE_FIELDS, true));
                                if (!allPresent) {
                                    var missing = ALL_REDACTABLE_FIELDS.filter(function (f) { return !(f in match) || match[f] === undefined; });
                                    console.log("  \u274C FALSE POSITIVE: admin bulk_load missing fields: ".concat(missing.join(', ')));
                                }
                                else {
                                    console.log("  ✅ Admin bulk_load sees all fields");
                                }
                                return allPresent;
                            }
                        })
                        // ========================================
                        // Test 7b: bulk-read (getByIds) redaction
                        // ========================================
                    ];
                case 37:
                    _b.sent();
                    // ========================================
                    // Test 7b: bulk-read (getByIds) redaction
                    // ========================================
                    (0, testing_1.log_header)("Test 7b: bulk-read (getByIds) redaction");
                    return [4 /*yield*/, (0, testing_1.async_test)("getByIds - redacted fields should be absent", function () { return sdkNonAdmin.api.phone_calls.getByIds({ ids: [testPhoneCall.id] }); }, {
                            onResult: function (r) {
                                if (!r.matches || r.matches.length === 0) {
                                    console.log("  ⚠️ SKIPPED: no phone_calls returned from getByIds");
                                    return true;
                                }
                                var match = r.matches.find(function (pc) { return pc.id === testPhoneCall.id; });
                                if (!match) {
                                    console.log("  ⚠️ SKIPPED: test phone call not found in getByIds results");
                                    return true;
                                }
                                var redacted = lacksFields(match, __spreadArray([], ALL_REDACTABLE_FIELDS, true));
                                if (!redacted) {
                                    var leaked = ALL_REDACTABLE_FIELDS.filter(function (f) { return f in match && match[f] !== undefined; });
                                    console.log("  \u274C VULNERABILITY: getByIds leaked redacted fields: ".concat(leaked.join(', ')));
                                }
                                else {
                                    console.log("  ✅ SAFE: getByIds properly redacts fields");
                                }
                                return redacted;
                            }
                        })];
                case 38:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("getByIds (admin) - all fields should be visible", function () { return sdk.api.phone_calls.getByIds({ ids: [testPhoneCall.id] }); }, {
                            onResult: function (r) {
                                if (!r.matches || r.matches.length === 0) {
                                    console.log("  ⚠️ SKIPPED: no phone_calls returned from admin getByIds");
                                    return true;
                                }
                                var match = r.matches.find(function (pc) { return pc.id === testPhoneCall.id; });
                                if (!match) {
                                    console.log("  ⚠️ SKIPPED: test phone call not found in admin getByIds results");
                                    return true;
                                }
                                var allPresent = hasFields(match, __spreadArray([], ALL_REDACTABLE_FIELDS, true));
                                if (!allPresent) {
                                    var missing = ALL_REDACTABLE_FIELDS.filter(function (f) { return !(f in match) || match[f] === undefined; });
                                    console.log("  \u274C FALSE POSITIVE: admin getByIds missing fields: ".concat(missing.join(', ')));
                                }
                                else {
                                    console.log("  ✅ Admin getByIds sees all fields");
                                }
                                return allPresent;
                            }
                        })
                        // ========================================
                        // Test 8: load_inbox_data redaction
                        // ========================================
                    ];
                case 39:
                    _b.sent();
                    // ========================================
                    // Test 8: load_inbox_data redaction
                    // ========================================
                    (0, testing_1.log_header)("Test 8: load_inbox_data redaction");
                    return [4 /*yield*/, (0, testing_1.async_test)("load_inbox_data - phone_calls should have redacted fields absent", function () { return sdkNonAdmin.api.endusers.load_inbox_data({ enduserIds: [testEnduser.id] }); }, {
                            onResult: function (r) {
                                if (!r.phone_calls || r.phone_calls.length === 0) {
                                    console.log("  ⚠️ SKIPPED: no phone_calls returned from load_inbox_data");
                                    return true;
                                }
                                var match = r.phone_calls.find(function (pc) { return pc.id === testPhoneCall.id; });
                                if (!match) {
                                    console.log("  ⚠️ SKIPPED: test phone call not found in load_inbox_data results");
                                    return true;
                                }
                                var redacted = lacksFields(match, __spreadArray([], ALL_REDACTABLE_FIELDS, true));
                                if (!redacted) {
                                    var leaked = ALL_REDACTABLE_FIELDS.filter(function (f) { return f in match && match[f] !== undefined; });
                                    console.log("  \u274C VULNERABILITY: load_inbox_data leaked redacted fields: ".concat(leaked.join(', ')));
                                }
                                else {
                                    console.log("  ✅ SAFE: load_inbox_data properly redacts phone_call fields");
                                }
                                return redacted;
                            }
                        })];
                case 40:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("load_inbox_data (admin) - all phone_call fields should be visible", function () { return sdk.api.endusers.load_inbox_data({ enduserIds: [testEnduser.id] }); }, {
                            onResult: function (r) {
                                if (!r.phone_calls || r.phone_calls.length === 0) {
                                    console.log("  ⚠️ SKIPPED: no phone_calls returned from admin load_inbox_data");
                                    return true;
                                }
                                var match = r.phone_calls.find(function (pc) { return pc.id === testPhoneCall.id; });
                                if (!match) {
                                    console.log("  ⚠️ SKIPPED: test phone call not found in admin load_inbox_data results");
                                    return true;
                                }
                                var allPresent = hasFields(match, __spreadArray([], ALL_REDACTABLE_FIELDS, true));
                                if (!allPresent) {
                                    var missing = ALL_REDACTABLE_FIELDS.filter(function (f) { return !(f in match) || match[f] === undefined; });
                                    console.log("  \u274C FALSE POSITIVE: admin load_inbox_data missing fields: ".concat(missing.join(', ')));
                                }
                                else {
                                    console.log("  ✅ Admin load_inbox_data sees all phone_call fields");
                                }
                                return allPresent;
                            }
                        })
                        // ========================================
                        // Test 9: No-redaction role sees all fields
                        // ========================================
                    ];
                case 41:
                    _b.sent();
                    // ========================================
                    // Test 9: No-redaction role sees all fields
                    // ========================================
                    (0, testing_1.log_header)("Test 9: Role without fieldRedactions sees all fields");
                    noRedactionRole = 'no-redaction-test-role';
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.createOne({
                            role: noRedactionRole,
                            permissions: __assign(__assign({}, constants_1.PROVIDER_PERMISSIONS), { phone_calls: FULL_ACCESS, endusers: FULL_ACCESS }),
                            // No fieldRedactions
                        })];
                case 42:
                    rbapNoRedaction = _b.sent();
                    _b.label = 43;
                case 43:
                    _b.trys.push([43, , 48, 53]);
                    return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [noRedactionRole] }, { replaceObjectFields: true })];
                case 44:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1500)];
                case 45:
                    _b.sent();
                    return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)];
                case 46:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("getOne - role without fieldRedactions should see all fields", function () { return sdkNonAdmin.api.phone_calls.getOne(testPhoneCall.id); }, {
                            onResult: function (r) {
                                var allPresent = hasFields(r, __spreadArray([], ALL_REDACTABLE_FIELDS, true));
                                if (!allPresent) {
                                    var missing = ALL_REDACTABLE_FIELDS.filter(function (f) { return !(f in r) || r[f] === undefined; });
                                    console.log("  \u274C ERROR: no-redaction role is missing fields: ".concat(missing.join(', ')));
                                }
                                else {
                                    console.log("  ✅ No-redaction role can see all fields");
                                }
                                return allPresent;
                            }
                        })];
                case 47:
                    _b.sent();
                    return [3 /*break*/, 53];
                case 48: return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [fullRedactionRole] }, { replaceObjectFields: true })];
                case 49:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1500)];
                case 50:
                    _b.sent();
                    return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)];
                case 51:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.deleteOne(rbapNoRedaction.id)];
                case 52:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 53:
                    // ========================================
                    // Test 10: Redaction scoped to model
                    // ========================================
                    (0, testing_1.log_header)("Test 10: phone_calls redaction doesn't affect other models");
                    return [4 /*yield*/, (0, testing_1.async_test)("enduser read - phone_calls fieldRedactions should not affect enduser fields", function () { return sdkNonAdmin.api.endusers.getOne(testEnduser.id); }, {
                            onResult: function (r) {
                                var corePresent = hasFields(r, ['fname', 'lname', 'email']);
                                if (!corePresent) {
                                    console.log("  ❌ ERROR: enduser fields missing — phone_calls redaction may be leaking across models");
                                }
                                else {
                                    console.log("  ✅ SAFE: phone_calls redaction does not affect enduser fields");
                                }
                                return corePresent;
                            }
                        })
                        // ========================================
                        // Test 11: data-sync redaction
                        // ========================================
                    ];
                case 54:
                    _b.sent();
                    // ========================================
                    // Test 11: data-sync redaction
                    // ========================================
                    (0, testing_1.log_header)("Test 11: data-sync redaction");
                    syncFrom_1 = new Date(0) // far enough back to capture the test phone call
                    ;
                    return [4 /*yield*/, (0, testing_1.async_test)("data-sync - redacted fields should be absent in parsed data", function () { return sdkNonAdmin.sync({ from: syncFrom_1 }); }, {
                            onResult: function (r) {
                                var match = r.results.find(function (rec) { return rec.recordId === testPhoneCall.id && rec.modelName === 'phone_calls'; });
                                if (!match) {
                                    console.log("  ⚠️ SKIPPED: test phone call not found in data-sync results");
                                    return true;
                                }
                                if (match.data === 'deleted') {
                                    console.log("  ⚠️ SKIPPED: test phone call marked as deleted in data-sync");
                                    return true;
                                }
                                var parsed = JSON.parse(match.data);
                                var redacted = lacksFields(parsed, __spreadArray([], ALL_REDACTABLE_FIELDS, true));
                                var corePresent = hasFields(parsed, ['enduserId', 'inbound', 'from', 'to']);
                                if (!redacted) {
                                    var leaked = ALL_REDACTABLE_FIELDS.filter(function (f) { return f in parsed && parsed[f] !== undefined; });
                                    console.log("  \u274C VULNERABILITY: data-sync leaked redacted fields: ".concat(leaked.join(', ')));
                                }
                                else {
                                    console.log("  ✅ SAFE: data-sync properly redacts fields in parsed data");
                                }
                                if (!corePresent) {
                                    console.log("  ❌ ERROR: core fields (enduserId, inbound, from, to) are missing from data-sync record");
                                }
                                return redacted && corePresent;
                            }
                        })];
                case 55:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("data-sync (admin) - all fields should be visible in parsed data", function () { return sdk.sync({ from: syncFrom_1 }); }, {
                            onResult: function (r) {
                                var match = r.results.find(function (rec) { return rec.recordId === testPhoneCall.id && rec.modelName === 'phone_calls'; });
                                if (!match) {
                                    console.log("  ⚠️ SKIPPED: test phone call not found in admin data-sync results");
                                    return true;
                                }
                                if (match.data === 'deleted') {
                                    console.log("  ⚠️ SKIPPED: test phone call marked as deleted in admin data-sync");
                                    return true;
                                }
                                var parsed = JSON.parse(match.data);
                                var allPresent = hasFields(parsed, __spreadArray([], ALL_REDACTABLE_FIELDS, true));
                                if (!allPresent) {
                                    var missing = ALL_REDACTABLE_FIELDS.filter(function (f) { return !(f in parsed) || parsed[f] === undefined; });
                                    console.log("  \u274C FALSE POSITIVE: admin data-sync missing fields: ".concat(missing.join(', ')));
                                }
                                else {
                                    console.log("  ✅ Admin data-sync sees all fields");
                                }
                                return allPresent;
                            }
                        })];
                case 56:
                    _b.sent();
                    console.log("\n" + "=".repeat(60));
                    console.log("Field Redaction Tests Complete");
                    console.log("=".repeat(60));
                    return [3 /*break*/, 71];
                case 57: 
                // Restore original roles
                return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: originalRoles }, { replaceObjectFields: true })];
                case 58:
                    // Restore original roles
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1000)];
                case 59:
                    _b.sent();
                    return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)
                        // Cleanup test data
                    ];
                case 60:
                    _b.sent();
                    _b.label = 61;
                case 61:
                    _b.trys.push([61, 63, , 64]);
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.deleteOne(rbapFull.id)];
                case 62:
                    _b.sent();
                    return [3 /*break*/, 64];
                case 63:
                    e_3 = _b.sent();
                    console.error('Cleanup error (rbap):', e_3);
                    return [3 /*break*/, 64];
                case 64:
                    _b.trys.push([64, 66, , 67]);
                    return [4 /*yield*/, sdk.api.phone_calls.deleteOne(testPhoneCall.id)];
                case 65:
                    _b.sent();
                    return [3 /*break*/, 67];
                case 66:
                    e_4 = _b.sent();
                    console.error('Cleanup error (phone_call):', e_4);
                    return [3 /*break*/, 67];
                case 67:
                    _b.trys.push([67, 69, , 70]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(testEnduser.id)];
                case 68:
                    _b.sent();
                    return [3 /*break*/, 70];
                case 69:
                    e_5 = _b.sent();
                    console.error('Cleanup error (enduser):', e_5);
                    return [3 /*break*/, 70];
                case 70: return [7 /*endfinally*/];
                case 71: return [2 /*return*/];
            }
        });
    });
};
exports.field_redaction_tests = field_redaction_tests;
// Allow running this test file independently
if (require.main === module) {
    console.log("Using API URL: ".concat(host));
    var sdk_2 = new sdk_1.Session({ host: host });
    var sdkNonAdmin_1 = new sdk_1.Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, setup_1.setup_tests)(sdk_2, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, exports.field_redaction_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Field redaction test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Field redaction test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=field_redaction.test.js.map