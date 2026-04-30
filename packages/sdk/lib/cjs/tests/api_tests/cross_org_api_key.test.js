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
exports.cross_org_api_key_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || 'http://localhost:8080';
var CROSS_ORG_API_KEY = process.env.CROSS_ORG_API_KEY;
var CROSS_ORG_TARGET_BUSINESS_ID = process.env.CROSS_ORG_TARGET_BUSINESS_ID;
var CROSS_ORG_UNAPPROVED_BUSINESS_ID = process.env.CROSS_ORG_UNAPPROVED_BUSINESS_ID;
var NON_ADMIN_EMAIL = process.env.NON_ADMIN_EMAIL;
var NON_ADMIN_PASSWORD = process.env.NON_ADMIN_PASSWORD;
var cross_org_api_key_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var sdkDefault, sdkCrossOrg, sdkUnapproved, sdkInvalidOrg, homeBusinessId, regularApiKeyRecord, regularApiKey, sdkRegularApiKey, sdkOwnOrgExplicit_1, crossOrgEnduserId_1, homeOrgEnduserId_1, sdkMalformedOrg_1, sdkEmptyHeader_1, sdkRegularKeyWithHeader_1, testKeyId_1, newKey, nonAdminKeyRecord_1, isolationIds, targetOrgEnduser_1, homeOrgEnduser_1, _i, isolationIds_1, _b, id, inTargetOrg, session, creatorTestId_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    (0, testing_1.log_header)("Cross-Organization API Key Tests");
                    if (!(CROSS_ORG_API_KEY && CROSS_ORG_TARGET_BUSINESS_ID && CROSS_ORG_UNAPPROVED_BUSINESS_ID)) {
                        console.log("Skipping cross-org API key tests — env vars not set");
                        return [2 /*return*/];
                    }
                    sdkDefault = new sdk_1.Session({ host: host, apiKey: CROSS_ORG_API_KEY });
                    sdkCrossOrg = new sdk_1.Session({
                        host: host,
                        apiKey: CROSS_ORG_API_KEY,
                        headers: { 'x-tellescope-organization': CROSS_ORG_TARGET_BUSINESS_ID },
                    });
                    sdkUnapproved = new sdk_1.Session({
                        host: host,
                        apiKey: CROSS_ORG_API_KEY,
                        headers: { 'x-tellescope-organization': CROSS_ORG_UNAPPROVED_BUSINESS_ID },
                    });
                    sdkInvalidOrg = new sdk_1.Session({
                        host: host,
                        apiKey: CROSS_ORG_API_KEY,
                        headers: { 'x-tellescope-organization': '000000000000000000000000' },
                    });
                    homeBusinessId = sdk.userInfo.businessId;
                    return [4 /*yield*/, sdk.api.api_keys.createOne({})];
                case 1:
                    regularApiKeyRecord = _c.sent();
                    regularApiKey = regularApiKeyRecord.key;
                    sdkRegularApiKey = new sdk_1.Session({ host: host, apiKey: regularApiKey });
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, , 108, 110]);
                    // =============================================
                    // AUTHORIZED ACCESS TESTS
                    // =============================================
                    // 1. Default behavior (no header) still works — backward compatibility
                    return [4 /*yield*/, (0, testing_1.async_test)("API key without org header authenticates to home org", function () { return sdkDefault.test_authenticated(); }, { expectedResult: 'Authenticated!' })
                        // 2. Cross-org header with approved org works
                    ];
                case 3:
                    // =============================================
                    // AUTHORIZED ACCESS TESTS
                    // =============================================
                    // 1. Default behavior (no header) still works — backward compatibility
                    _c.sent();
                    // 2. Cross-org header with approved org works
                    return [4 /*yield*/, (0, testing_1.async_test)("API key with approved org header authenticates successfully", function () { return sdkCrossOrg.test_authenticated(); }, { expectedResult: 'Authenticated!' })
                        // 3. Targeting own org explicitly via header (should work as a no-op)
                    ];
                case 4:
                    // 2. Cross-org header with approved org works
                    _c.sent();
                    sdkOwnOrgExplicit_1 = new sdk_1.Session({
                        host: host,
                        apiKey: CROSS_ORG_API_KEY,
                        headers: { 'x-tellescope-organization': homeBusinessId },
                    });
                    return [4 /*yield*/, (0, testing_1.async_test)("API key targeting its own org explicitly via header still works", function () { return sdkOwnOrgExplicit_1.test_authenticated(); }, { expectedResult: 'Authenticated!' })
                        // 4. Can read data from target org
                    ];
                case 5:
                    _c.sent();
                    // 4. Can read data from target org
                    return [4 /*yield*/, (0, testing_1.async_test)("Can read endusers from target org", function () { return sdkCrossOrg.api.endusers.getSome(); }, { onResult: function (r) { return Array.isArray(r); } })
                        // 5-9. Full CRUD in target org + cross-direction isolation
                    ];
                case 6:
                    // 4. Can read data from target org
                    _c.sent();
                    _c.label = 7;
                case 7:
                    _c.trys.push([7, , 16, 21]);
                    // 5. Create in target org — verify record gets target org's businessId
                    return [4 /*yield*/, (0, testing_1.async_test)("Can create enduser in target org with correct businessId", function () { return sdkCrossOrg.api.endusers.createOne({ fname: 'CrossOrgTest', lname: 'Enduser' }); }, { onResult: function (e) {
                                crossOrgEnduserId_1 = e.id;
                                return e.fname === 'CrossOrgTest' && e.businessId === CROSS_ORG_TARGET_BUSINESS_ID;
                            } })
                        // 6. Record created in target org is NOT visible from home org (data isolation)
                    ];
                case 8:
                    // 5. Create in target org — verify record gets target org's businessId
                    _c.sent();
                    if (!crossOrgEnduserId_1) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, testing_1.async_test)("Cross-org record is NOT visible from home org session", function () { return sdkDefault.api.endusers.getOne(crossOrgEnduserId_1); }, testing_1.handleAnyError)];
                case 9:
                    _c.sent();
                    _c.label = 10;
                case 10: 
                // 7. Create a record in home org and verify it's NOT visible from cross-org session
                return [4 /*yield*/, (0, testing_1.async_test)("Home org record is NOT visible from cross-org session", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var homeEnduser;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, sdkDefault.api.endusers.createOne({ fname: 'HomeOrgTest', lname: 'Enduser' })];
                                case 1:
                                    homeEnduser = _a.sent();
                                    homeOrgEnduserId_1 = homeEnduser.id;
                                    return [2 /*return*/, sdkCrossOrg.api.endusers.getOne(homeEnduser.id)];
                            }
                        });
                    }); }, testing_1.handleAnyError)
                    // 8. Update record in target org (full CRUD — update)
                ];
                case 11:
                    // 7. Create a record in home org and verify it's NOT visible from cross-org session
                    _c.sent();
                    if (!crossOrgEnduserId_1) return [3 /*break*/, 13];
                    return [4 /*yield*/, (0, testing_1.async_test)("Can update enduser in target org", function () { return sdkCrossOrg.api.endusers.updateOne(crossOrgEnduserId_1, { fname: 'CrossOrgUpdated' }); }, { onResult: function () { return true; } })];
                case 12:
                    _c.sent();
                    _c.label = 13;
                case 13:
                    if (!crossOrgEnduserId_1) return [3 /*break*/, 15];
                    return [4 /*yield*/, (0, testing_1.async_test)("Can delete enduser in target org", function () { return sdkCrossOrg.api.endusers.deleteOne(crossOrgEnduserId_1); }, { onResult: function () { return true; } })];
                case 14:
                    _c.sent();
                    crossOrgEnduserId_1 = undefined; // already deleted
                    _c.label = 15;
                case 15: return [3 /*break*/, 21];
                case 16:
                    if (!crossOrgEnduserId_1) return [3 /*break*/, 18];
                    return [4 /*yield*/, sdkCrossOrg.api.endusers.deleteOne(crossOrgEnduserId_1).catch(console.error)];
                case 17:
                    _c.sent();
                    _c.label = 18;
                case 18:
                    if (!homeOrgEnduserId_1) return [3 /*break*/, 20];
                    return [4 /*yield*/, sdkDefault.api.endusers.deleteOne(homeOrgEnduserId_1).catch(console.error)];
                case 19:
                    _c.sent();
                    _c.label = 20;
                case 20: return [7 /*endfinally*/];
                case 21: 
                // =============================================
                // UNAUTHORIZED ACCESS TESTS
                // =============================================
                // 10. Unapproved org ID is rejected
                return [4 /*yield*/, (0, testing_1.async_test)("API key with unapproved org header is rejected", function () { return sdkUnapproved.test_authenticated(); }, testing_1.handleAnyError)
                    // 11. Nonexistent org ID is rejected
                ];
                case 22:
                    // =============================================
                    // UNAUTHORIZED ACCESS TESTS
                    // =============================================
                    // 10. Unapproved org ID is rejected
                    _c.sent();
                    // 11. Nonexistent org ID is rejected
                    return [4 /*yield*/, (0, testing_1.async_test)("API key with nonexistent org header is rejected", function () { return sdkInvalidOrg.test_authenticated(); }, testing_1.handleAnyError)
                        // 12. Malformed (non-ObjectId) org header is rejected
                    ];
                case 23:
                    // 11. Nonexistent org ID is rejected
                    _c.sent();
                    sdkMalformedOrg_1 = new sdk_1.Session({
                        host: host,
                        apiKey: CROSS_ORG_API_KEY,
                        headers: { 'x-tellescope-organization': 'not-a-valid-id' },
                    });
                    return [4 /*yield*/, (0, testing_1.async_test)("API key with malformed org header is rejected", function () { return sdkMalformedOrg_1.test_authenticated(); }, testing_1.handleAnyError)
                        // 13. Empty string org header falls back to home org
                    ];
                case 24:
                    _c.sent();
                    sdkEmptyHeader_1 = new sdk_1.Session({
                        host: host,
                        apiKey: CROSS_ORG_API_KEY,
                        headers: { 'x-tellescope-organization': '' },
                    });
                    return [4 /*yield*/, (0, testing_1.async_test)("API key with empty org header falls back to home org", function () { return sdkEmptyHeader_1.test_authenticated(); }, { expectedResult: 'Authenticated!' })
                        // 14. Regular API key (no approvedBusinessIds) with org header is rejected
                    ];
                case 25:
                    _c.sent();
                    sdkRegularKeyWithHeader_1 = new sdk_1.Session({
                        host: host,
                        apiKey: regularApiKey,
                        headers: { 'x-tellescope-organization': CROSS_ORG_TARGET_BUSINESS_ID },
                    });
                    return [4 /*yield*/, (0, testing_1.async_test)("Regular API key (no approvedBusinessIds) with org header is rejected", function () { return sdkRegularKeyWithHeader_1.test_authenticated(); }, testing_1.handleAnyError)
                        // 15. Password-auth session with org header is rejected
                    ];
                case 26:
                    _c.sent();
                    // 15. Password-auth session with org header is rejected
                    return [4 /*yield*/, (0, testing_1.async_test)("Password-auth session with org header is rejected", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var sdkPasswordWithOrgHeader;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        sdkPasswordWithOrgHeader = new sdk_1.Session({
                                            host: host,
                                            headers: { 'x-tellescope-organization': CROSS_ORG_TARGET_BUSINESS_ID },
                                        });
                                        return [4 /*yield*/, sdkPasswordWithOrgHeader.authenticate(process.env.TEST_EMAIL, process.env.TEST_PASSWORD)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/, sdkPasswordWithOrgHeader.test_authenticated()];
                                }
                            });
                        }); }, testing_1.handleAnyError)
                        // =============================================
                        // READONLY ENFORCEMENT TESTS
                        // =============================================
                        // 16. approvedBusinessIds cannot be set when creating a new API key
                    ];
                case 27:
                    // 15. Password-auth session with org header is rejected
                    _c.sent();
                    // =============================================
                    // READONLY ENFORCEMENT TESTS
                    // =============================================
                    // 16. approvedBusinessIds cannot be set when creating a new API key
                    return [4 /*yield*/, (0, testing_1.async_test)("Cannot set approvedBusinessIds on API key creation", function () { return sdk.api.api_keys.createOne({ approvedBusinessIds: [CROSS_ORG_TARGET_BUSINESS_ID] }); }, testing_1.handleAnyError)
                        // 18. approvedBusinessIds cannot be set via bulk create
                    ];
                case 28:
                    // =============================================
                    // READONLY ENFORCEMENT TESTS
                    // =============================================
                    // 16. approvedBusinessIds cannot be set when creating a new API key
                    _c.sent();
                    // 18. approvedBusinessIds cannot be set via bulk create
                    return [4 /*yield*/, (0, testing_1.async_test)("Cannot set approvedBusinessIds via bulk create (createSome)", function () { return sdk.api.api_keys.createSome([{ approvedBusinessIds: [CROSS_ORG_TARGET_BUSINESS_ID] }]); }, testing_1.handleAnyError)
                        // 17a-c. approvedBusinessIds cannot be updated via API — all replaceObjectFields variants
                    ];
                case 29:
                    // 18. approvedBusinessIds cannot be set via bulk create
                    _c.sent();
                    _c.label = 30;
                case 30:
                    _c.trys.push([30, , 35, 38]);
                    return [4 /*yield*/, sdk.api.api_keys.createOne({})];
                case 31:
                    newKey = _c.sent();
                    testKeyId_1 = newKey.id;
                    return [4 /*yield*/, (0, testing_1.async_test)("Cannot update approvedBusinessIds on existing API key (no replaceObjectFields)", function () { return sdk.api.api_keys.updateOne(testKeyId_1, { approvedBusinessIds: [CROSS_ORG_TARGET_BUSINESS_ID] }); }, testing_1.handleAnyError)];
                case 32:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Cannot update approvedBusinessIds on existing API key (replaceObjectFields: false)", function () { return sdk.api.api_keys.updateOne(testKeyId_1, { approvedBusinessIds: [CROSS_ORG_TARGET_BUSINESS_ID] }, { replaceObjectFields: false }); }, testing_1.handleAnyError)];
                case 33:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Cannot update approvedBusinessIds on existing API key (replaceObjectFields: true)", function () { return sdk.api.api_keys.updateOne(testKeyId_1, { approvedBusinessIds: [CROSS_ORG_TARGET_BUSINESS_ID] }, { replaceObjectFields: true }); }, testing_1.handleAnyError)];
                case 34:
                    _c.sent();
                    return [3 /*break*/, 38];
                case 35:
                    if (!testKeyId_1) return [3 /*break*/, 37];
                    return [4 /*yield*/, sdk.api.api_keys.deleteOne(testKeyId_1).catch(console.error)];
                case 36:
                    _c.sent();
                    _c.label = 37;
                case 37: return [7 /*endfinally*/];
                case 38: 
                // API key listing isolation — cross-org API key must not be visible to target org sessions,
                // and target org's keys must not be visible to home org sessions
                return [4 /*yield*/, (0, testing_1.async_test)("Cross-org session cannot list home org API keys", function () { return sdkCrossOrg.api.api_keys.getSome(); }, { onResult: function (keys) { return keys.every(function (k) { return k.businessId !== homeBusinessId; }); } })];
                case 39:
                    // API key listing isolation — cross-org API key must not be visible to target org sessions,
                    // and target org's keys must not be visible to home org sessions
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Home org session cannot list target org API keys", function () { return sdkDefault.api.api_keys.getSome(); }, { onResult: function (keys) { return keys.every(function (k) { return k.businessId !== CROSS_ORG_TARGET_BUSINESS_ID; }); } })];
                case 40:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Regular API key session cannot list target org API keys", function () { return sdkRegularApiKey.api.api_keys.getSome(); }, { onResult: function (keys) { return keys.every(function (k) { return k.businessId !== CROSS_ORG_TARGET_BUSINESS_ID; }); } })
                        // Direct ID lookup isolation — cross-org session cannot access home org API keys by specific ID.
                        // Distinct code path from getSome: a creator-only check firing before org-scope could expose home org keys.
                    ];
                case 41:
                    _c.sent();
                    // Direct ID lookup isolation — cross-org session cannot access home org API keys by specific ID.
                    // Distinct code path from getSome: a creator-only check firing before org-scope could expose home org keys.
                    return [4 /*yield*/, (0, testing_1.async_test)("Cross-org session cannot getOne a home org API key by ID", function () { return sdkCrossOrg.api.api_keys.getOne(regularApiKeyRecord.id); }, testing_1.handleAnyError)];
                case 42:
                    // Direct ID lookup isolation — cross-org session cannot access home org API keys by specific ID.
                    // Distinct code path from getSome: a creator-only check firing before org-scope could expose home org keys.
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Cross-org session getByIds returns no matches for a home org API key", function () { return sdkCrossOrg.api.api_keys.getByIds({ ids: [regularApiKeyRecord.id] }); }, { onResult: function (r) { return r.matches.length === 0; } })];
                case 43:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Cross-org session bulk_load contains no home org API keys", function () { return sdkCrossOrg.bulk_load({ load: [{ model: 'api_keys' }] }); }, { onResult: function (r) { var _a, _b; return ((_b = (_a = r.results[0]) === null || _a === void 0 ? void 0 : _a.records) !== null && _b !== void 0 ? _b : []).every(function (k) { return k.id !== regularApiKeyRecord.id; }); } })
                        // Creator-only access: only the user who created an API key can read it (intra-org isolation).
                        // Elevate sdkNonAdmin to Admin (full read permissions) so any test failure is clearly due to
                        // creator-only enforcement, not missing role permissions.
                    ];
                case 44:
                    _c.sent();
                    // Creator-only access: only the user who created an API key can read it (intra-org isolation).
                    // Elevate sdkNonAdmin to Admin (full read permissions) so any test failure is clearly due to
                    // creator-only enforcement, not missing role permissions.
                    return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: ['Admin'] }, { replaceObjectFields: true })];
                case 45:
                    // Creator-only access: only the user who created an API key can read it (intra-org isolation).
                    // Elevate sdkNonAdmin to Admin (full read permissions) so any test failure is clearly due to
                    // creator-only enforcement, not missing role permissions.
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 2000)]; // wait for role change to propagate
                case 46:
                    _c.sent(); // wait for role change to propagate
                    return [4 /*yield*/, sdkNonAdmin.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)];
                case 47:
                    _c.sent();
                    return [4 /*yield*/, sdkNonAdmin.api.api_keys.createOne({})];
                case 48:
                    nonAdminKeyRecord_1 = _c.sent();
                    _c.label = 49;
                case 49:
                    _c.trys.push([49, , 62, 67]);
                    // sdkNonAdmin (Admin) cannot read sdk's key
                    return [4 /*yield*/, (0, testing_1.async_test)("Admin user cannot getOne another admin's API key", function () { return sdkNonAdmin.api.api_keys.getOne(regularApiKeyRecord.id); }, testing_1.handleAnyError)];
                case 50:
                    // sdkNonAdmin (Admin) cannot read sdk's key
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Admin user getSome excludes another admin's API key", function () { return sdkNonAdmin.api.api_keys.getSome(); }, { onResult: function (keys) { return keys.every(function (k) { return k.id !== regularApiKeyRecord.id; }); } })];
                case 51:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Admin user getByIds returns no matches for another admin's API key", function () { return sdkNonAdmin.api.api_keys.getByIds({ ids: [regularApiKeyRecord.id] }); }, { onResult: function (r) { return r.matches.length === 0; } })];
                case 52:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Admin user bulk_load excludes another admin's API key", function () { return sdkNonAdmin.bulk_load({ load: [{ model: 'api_keys' }] }); }, { onResult: function (r) { var _a, _b; return ((_b = (_a = r.results[0]) === null || _a === void 0 ? void 0 : _a.records) !== null && _b !== void 0 ? _b : []).every(function (k) { return k.id !== regularApiKeyRecord.id; }); } })
                        // sdk (Admin) cannot read sdkNonAdmin's key
                    ];
                case 53:
                    _c.sent();
                    // sdk (Admin) cannot read sdkNonAdmin's key
                    return [4 /*yield*/, (0, testing_1.async_test)("Admin cannot getOne a key created by a different admin user", function () { return sdk.api.api_keys.getOne(nonAdminKeyRecord_1.id); }, testing_1.handleAnyError)];
                case 54:
                    // sdk (Admin) cannot read sdkNonAdmin's key
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Admin getSome excludes keys created by a different admin user", function () { return sdk.api.api_keys.getSome(); }, { onResult: function (keys) { return keys.every(function (k) { return k.id !== nonAdminKeyRecord_1.id; }); } })];
                case 55:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Admin getByIds returns no matches for a key created by a different admin user", function () { return sdk.api.api_keys.getByIds({ ids: [nonAdminKeyRecord_1.id] }); }, { onResult: function (r) { return r.matches.length === 0; } })];
                case 56:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Admin bulk_load excludes keys created by a different admin user", function () { return sdk.bulk_load({ load: [{ model: 'api_keys' }] }); }, { onResult: function (r) { var _a, _b; return ((_b = (_a = r.results[0]) === null || _a === void 0 ? void 0 : _a.records) !== null && _b !== void 0 ? _b : []).every(function (k) { return k.id !== nonAdminKeyRecord_1.id; }); } })
                        // Write isolation: neither admin can mutate the other's key.
                        // Use a non-empty body with a readonly field (hashedKey) so the test exercises a real payload,
                        // not just an empty-object rejection.
                    ];
                case 57:
                    _c.sent();
                    // Write isolation: neither admin can mutate the other's key.
                    // Use a non-empty body with a readonly field (hashedKey) so the test exercises a real payload,
                    // not just an empty-object rejection.
                    return [4 /*yield*/, (0, testing_1.async_test)("Admin user cannot updateOne another admin's API key", function () { return sdkNonAdmin.api.api_keys.updateOne(regularApiKeyRecord.id, { hashedKey: 'attack' }); }, testing_1.handleAnyError)];
                case 58:
                    // Write isolation: neither admin can mutate the other's key.
                    // Use a non-empty body with a readonly field (hashedKey) so the test exercises a real payload,
                    // not just an empty-object rejection.
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Admin user cannot deleteOne another admin's API key", function () { return sdkNonAdmin.api.api_keys.deleteOne(regularApiKeyRecord.id); }, testing_1.handleAnyError)];
                case 59:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Admin cannot updateOne a key created by a different admin user", function () { return sdk.api.api_keys.updateOne(nonAdminKeyRecord_1.id, { hashedKey: 'attack' }); }, testing_1.handleAnyError)];
                case 60:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Admin cannot deleteOne a key created by a different admin user", function () { return sdk.api.api_keys.deleteOne(nonAdminKeyRecord_1.id); }, testing_1.handleAnyError)];
                case 61:
                    _c.sent();
                    return [3 /*break*/, 67];
                case 62: return [4 /*yield*/, sdkNonAdmin.api.api_keys.deleteOne(nonAdminKeyRecord_1.id).catch(console.error)
                    // Restore sdkNonAdmin to Non-Admin and reauthenticate so subsequent tests are unaffected
                ];
                case 63:
                    _c.sent();
                    // Restore sdkNonAdmin to Non-Admin and reauthenticate so subsequent tests are unaffected
                    return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: ['Non-Admin'] }, { replaceObjectFields: true })];
                case 64:
                    // Restore sdkNonAdmin to Non-Admin and reauthenticate so subsequent tests are unaffected
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1000)];
                case 65:
                    _c.sent();
                    return [4 /*yield*/, sdkNonAdmin.authenticate(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD)];
                case 66:
                    _c.sent();
                    return [7 /*endfinally*/];
                case 67:
                    isolationIds = [];
                    _c.label = 68;
                case 68:
                    _c.trys.push([68, , 93, 98]);
                    return [4 /*yield*/, sdkCrossOrg.api.endusers.createOne({ fname: 'IsolationTest', lname: 'TargetOrg' })];
                case 69:
                    targetOrgEnduser_1 = _c.sent();
                    isolationIds.push({ id: targetOrgEnduser_1.id, inTargetOrg: true });
                    return [4 /*yield*/, sdkDefault.api.endusers.createOne({ fname: 'IsolationTest', lname: 'HomeOrg' })];
                case 70:
                    homeOrgEnduser_1 = _c.sent();
                    isolationIds.push({ id: homeOrgEnduser_1.id, inTargetOrg: false });
                    // --- getOne isolation ---
                    // 18. Password-auth session cannot getOne a record from another org by ID
                    return [4 /*yield*/, (0, testing_1.async_test)("Password-auth session cannot getOne a target org record by ID", function () { return sdk.api.endusers.getOne(targetOrgEnduser_1.id); }, testing_1.handleAnyError)
                        // 19. Regular API key session cannot getOne a record from another org by ID
                    ];
                case 71:
                    // --- getOne isolation ---
                    // 18. Password-auth session cannot getOne a record from another org by ID
                    _c.sent();
                    // 19. Regular API key session cannot getOne a record from another org by ID
                    return [4 /*yield*/, (0, testing_1.async_test)("Regular API key session cannot getOne a target org record by ID", function () { return sdkRegularApiKey.api.endusers.getOne(targetOrgEnduser_1.id); }, testing_1.handleAnyError)
                        // 20. Cross-org session cannot getOne a home org record by ID (reverse direction)
                    ];
                case 72:
                    // 19. Regular API key session cannot getOne a record from another org by ID
                    _c.sent();
                    // 20. Cross-org session cannot getOne a home org record by ID (reverse direction)
                    return [4 /*yield*/, (0, testing_1.async_test)("Cross-org session cannot getOne a home org record by ID", function () { return sdkCrossOrg.api.endusers.getOne(homeOrgEnduser_1.id); }, testing_1.handleAnyError)
                        // --- getSome isolation ---
                        // 21. getSome from home org (password-auth) never returns records belonging to the target org
                    ];
                case 73:
                    // 20. Cross-org session cannot getOne a home org record by ID (reverse direction)
                    _c.sent();
                    // --- getSome isolation ---
                    // 21. getSome from home org (password-auth) never returns records belonging to the target org
                    return [4 /*yield*/, (0, testing_1.async_test)("Password-auth session getSome contains no target org records", function () { return sdk.api.endusers.getSome(); }, { onResult: function (endusers) {
                                return endusers.every(function (e) { return e.businessId !== CROSS_ORG_TARGET_BUSINESS_ID && e.id !== targetOrgEnduser_1.id; });
                            }
                        })
                        // 22. getSome via regular API key never returns records belonging to the target org
                    ];
                case 74:
                    // --- getSome isolation ---
                    // 21. getSome from home org (password-auth) never returns records belonging to the target org
                    _c.sent();
                    // 22. getSome via regular API key never returns records belonging to the target org
                    return [4 /*yield*/, (0, testing_1.async_test)("Regular API key getSome contains no target org records", function () { return sdkRegularApiKey.api.endusers.getSome(); }, { onResult: function (endusers) {
                                return endusers.every(function (e) { return e.businessId !== CROSS_ORG_TARGET_BUSINESS_ID && e.id !== targetOrgEnduser_1.id; });
                            }
                        })
                        // 23. getSome from target org session never returns records belonging to the home org
                    ];
                case 75:
                    // 22. getSome via regular API key never returns records belonging to the target org
                    _c.sent();
                    // 23. getSome from target org session never returns records belonging to the home org
                    return [4 /*yield*/, (0, testing_1.async_test)("Cross-org session getSome contains no home org records", function () { return sdkCrossOrg.api.endusers.getSome(); }, { onResult: function (endusers) {
                                return endusers.every(function (e) { return e.businessId !== homeBusinessId && e.id !== homeOrgEnduser_1.id; });
                            }
                        })
                        // --- getSome filter injection ---
                        // 24. Passing an explicit businessId filter cannot expose cross-tenant records
                    ];
                case 76:
                    // 23. getSome from target org session never returns records belonging to the home org
                    _c.sent();
                    // --- getSome filter injection ---
                    // 24. Passing an explicit businessId filter cannot expose cross-tenant records
                    return [4 /*yield*/, (0, testing_1.async_test)("Regular API key getSome with explicit businessId filter cannot expose target org records", function () { return sdkRegularApiKey.api.endusers.getSome({ filter: { businessId: CROSS_ORG_TARGET_BUSINESS_ID } }); }, { onResult: function (endusers) {
                                return endusers.every(function (e) { return e.businessId !== CROSS_ORG_TARGET_BUSINESS_ID && e.id !== targetOrgEnduser_1.id; });
                            }
                        })
                        // 25. Cross-org session cannot use businessId filter to expose home org records
                    ];
                case 77:
                    // --- getSome filter injection ---
                    // 24. Passing an explicit businessId filter cannot expose cross-tenant records
                    _c.sent();
                    // 25. Cross-org session cannot use businessId filter to expose home org records
                    return [4 /*yield*/, (0, testing_1.async_test)("Cross-org session getSome with explicit businessId filter cannot expose home org records", function () { return sdkCrossOrg.api.endusers.getSome({ filter: { businessId: homeBusinessId } }); }, { onResult: function (endusers) {
                                return endusers.every(function (e) { return e.businessId !== homeBusinessId && e.id !== homeOrgEnduser_1.id; });
                            }
                        })
                        // --- getByIds isolation ---
                    ];
                case 78:
                    // 25. Cross-org session cannot use businessId filter to expose home org records
                    _c.sent();
                    // --- getByIds isolation ---
                    return [4 /*yield*/, (0, testing_1.async_test)("Password-auth session getByIds returns no matches for target org record", function () { return sdk.api.endusers.getByIds({ ids: [targetOrgEnduser_1.id] }); }, { onResult: function (r) { return r.matches.length === 0; } })];
                case 79:
                    // --- getByIds isolation ---
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Regular API key session getByIds returns no matches for target org record", function () { return sdkRegularApiKey.api.endusers.getByIds({ ids: [targetOrgEnduser_1.id] }); }, { onResult: function (r) { return r.matches.length === 0; } })];
                case 80:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Cross-org session getByIds returns no matches for home org record", function () { return sdkCrossOrg.api.endusers.getByIds({ ids: [homeOrgEnduser_1.id] }); }, { onResult: function (r) { return r.matches.length === 0; } })
                        // --- bulk_load isolation ---
                    ];
                case 81:
                    _c.sent();
                    // --- bulk_load isolation ---
                    return [4 /*yield*/, (0, testing_1.async_test)("Password-auth session bulk_load contains no target org endusers", function () { return sdk.bulk_load({ load: [{ model: 'endusers' }] }); }, { onResult: function (r) { var _a, _b; return ((_b = (_a = r.results[0]) === null || _a === void 0 ? void 0 : _a.records) !== null && _b !== void 0 ? _b : []).every(function (e) { return e.id !== targetOrgEnduser_1.id; }); } })];
                case 82:
                    // --- bulk_load isolation ---
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Regular API key session bulk_load contains no target org endusers", function () { return sdkRegularApiKey.bulk_load({ load: [{ model: 'endusers' }] }); }, { onResult: function (r) { var _a, _b; return ((_b = (_a = r.results[0]) === null || _a === void 0 ? void 0 : _a.records) !== null && _b !== void 0 ? _b : []).every(function (e) { return e.id !== targetOrgEnduser_1.id; }); } })];
                case 83:
                    _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Cross-org session bulk_load contains no home org endusers", function () { return sdkCrossOrg.bulk_load({ load: [{ model: 'endusers' }] }); }, { onResult: function (r) { var _a, _b; return ((_b = (_a = r.results[0]) === null || _a === void 0 ? void 0 : _a.records) !== null && _b !== void 0 ? _b : []).every(function (e) { return e.id !== homeOrgEnduser_1.id; }); } })
                        // --- updateOne isolation ---
                        // 26. Password-auth session cannot updateOne a record from another org
                    ];
                case 84:
                    _c.sent();
                    // --- updateOne isolation ---
                    // 26. Password-auth session cannot updateOne a record from another org
                    return [4 /*yield*/, (0, testing_1.async_test)("Password-auth session cannot updateOne a target org record", function () { return sdk.api.endusers.updateOne(targetOrgEnduser_1.id, { fname: 'ShouldNotUpdate' }); }, testing_1.handleAnyError)
                        // 27. Regular API key session cannot updateOne a record from another org
                    ];
                case 85:
                    // --- updateOne isolation ---
                    // 26. Password-auth session cannot updateOne a record from another org
                    _c.sent();
                    // 27. Regular API key session cannot updateOne a record from another org
                    return [4 /*yield*/, (0, testing_1.async_test)("Regular API key session cannot updateOne a target org record", function () { return sdkRegularApiKey.api.endusers.updateOne(targetOrgEnduser_1.id, { fname: 'ShouldNotUpdate' }); }, testing_1.handleAnyError)
                        // 28. Cross-org session cannot updateOne a home org record
                    ];
                case 86:
                    // 27. Regular API key session cannot updateOne a record from another org
                    _c.sent();
                    // 28. Cross-org session cannot updateOne a home org record
                    return [4 /*yield*/, (0, testing_1.async_test)("Cross-org session cannot updateOne a home org record", function () { return sdkCrossOrg.api.endusers.updateOne(homeOrgEnduser_1.id, { fname: 'ShouldNotUpdate' }); }, testing_1.handleAnyError)
                        // --- deleteOne isolation ---
                        // Records still exist at this point (prior deletes should have failed);
                        // cleanup in finally handles actual deletion via the correct sessions
                        // 29. Password-auth session cannot deleteOne a record from another org
                    ];
                case 87:
                    // 28. Cross-org session cannot updateOne a home org record
                    _c.sent();
                    // --- deleteOne isolation ---
                    // Records still exist at this point (prior deletes should have failed);
                    // cleanup in finally handles actual deletion via the correct sessions
                    // 29. Password-auth session cannot deleteOne a record from another org
                    return [4 /*yield*/, (0, testing_1.async_test)("Password-auth session cannot deleteOne a target org record", function () { return sdk.api.endusers.deleteOne(targetOrgEnduser_1.id); }, testing_1.handleAnyError)
                        // 30. Regular API key session cannot deleteOne a record from another org
                    ];
                case 88:
                    // --- deleteOne isolation ---
                    // Records still exist at this point (prior deletes should have failed);
                    // cleanup in finally handles actual deletion via the correct sessions
                    // 29. Password-auth session cannot deleteOne a record from another org
                    _c.sent();
                    // 30. Regular API key session cannot deleteOne a record from another org
                    return [4 /*yield*/, (0, testing_1.async_test)("Regular API key session cannot deleteOne a target org record", function () { return sdkRegularApiKey.api.endusers.deleteOne(targetOrgEnduser_1.id); }, testing_1.handleAnyError)
                        // 31. Cross-org session cannot deleteOne a home org record
                    ];
                case 89:
                    // 30. Regular API key session cannot deleteOne a record from another org
                    _c.sent();
                    // 31. Cross-org session cannot deleteOne a home org record
                    return [4 /*yield*/, (0, testing_1.async_test)("Cross-org session cannot deleteOne a home org record", function () { return sdkCrossOrg.api.endusers.deleteOne(homeOrgEnduser_1.id); }, testing_1.handleAnyError)
                        // --- businessId spoofing on create ---
                        // 32. Cross-org session cannot plant a record in the home org by passing an explicit businessId
                    ];
                case 90:
                    // 31. Cross-org session cannot deleteOne a home org record
                    _c.sent();
                    // --- businessId spoofing on create ---
                    // 32. Cross-org session cannot plant a record in the home org by passing an explicit businessId
                    return [4 /*yield*/, (0, testing_1.async_test)("Cross-org create with explicit home org businessId is rejected", function () { return sdkCrossOrg.api.endusers.createOne({ fname: 'SpoofTest', lname: 'CrossOrg', businessId: homeBusinessId }); }, testing_1.handleAnyError)
                        // 33. Home org session cannot plant a record in the target org by passing an explicit businessId
                    ];
                case 91:
                    // --- businessId spoofing on create ---
                    // 32. Cross-org session cannot plant a record in the home org by passing an explicit businessId
                    _c.sent();
                    // 33. Home org session cannot plant a record in the target org by passing an explicit businessId
                    return [4 /*yield*/, (0, testing_1.async_test)("Home org create with explicit target org businessId is rejected", function () { return sdkDefault.api.endusers.createOne({ fname: 'SpoofTest', lname: 'HomeOrg', businessId: CROSS_ORG_TARGET_BUSINESS_ID }); }, testing_1.handleAnyError)];
                case 92:
                    // 33. Home org session cannot plant a record in the target org by passing an explicit businessId
                    _c.sent();
                    return [3 /*break*/, 98];
                case 93:
                    _i = 0, isolationIds_1 = isolationIds;
                    _c.label = 94;
                case 94:
                    if (!(_i < isolationIds_1.length)) return [3 /*break*/, 97];
                    _b = isolationIds_1[_i], id = _b.id, inTargetOrg = _b.inTargetOrg;
                    session = inTargetOrg ? sdkCrossOrg : sdkDefault;
                    return [4 /*yield*/, session.api.endusers.deleteOne(id).catch(console.error)];
                case 95:
                    _c.sent();
                    _c.label = 96;
                case 96:
                    _i++;
                    return [3 /*break*/, 94];
                case 97: return [7 /*endfinally*/];
                case 98: 
                // =============================================
                // ENDUSER SESSION TESTS
                // =============================================
                // 34. EnduserSession with org header is rejected
                return [4 /*yield*/, (0, testing_1.async_test)("EnduserSession with org header is rejected", function () { return (new sdk_1.EnduserSession({
                        host: host,
                        businessId: homeBusinessId,
                        cacheKey: 'cross_org_test_enduser',
                        headers: { 'x-tellescope-organization': CROSS_ORG_TARGET_BUSINESS_ID },
                    })).test_authenticated(); }, testing_1.handleAnyError)
                    // =============================================
                    // USERS (STAFF) RESOURCE ISOLATION TESTS
                    // =============================================
                    // 35. Cross-org session getSome users contains no home org users
                ];
                case 99:
                    // =============================================
                    // ENDUSER SESSION TESTS
                    // =============================================
                    // 34. EnduserSession with org header is rejected
                    _c.sent();
                    // =============================================
                    // USERS (STAFF) RESOURCE ISOLATION TESTS
                    // =============================================
                    // 35. Cross-org session getSome users contains no home org users
                    return [4 /*yield*/, (0, testing_1.async_test)("Cross-org session getSome users contains no home org users", function () { return sdkCrossOrg.api.users.getSome(); }, { onResult: function (users) { return users.every(function (u) { return u.businessId !== homeBusinessId; }); } })
                        // 36. Regular API key getSome users contains no target org users
                    ];
                case 100:
                    // =============================================
                    // USERS (STAFF) RESOURCE ISOLATION TESTS
                    // =============================================
                    // 35. Cross-org session getSome users contains no home org users
                    _c.sent();
                    // 36. Regular API key getSome users contains no target org users
                    return [4 /*yield*/, (0, testing_1.async_test)("Regular API key getSome users contains no target org users", function () { return sdkRegularApiKey.api.users.getSome(); }, { onResult: function (users) { return users.every(function (u) { return u.businessId !== CROSS_ORG_TARGET_BUSINESS_ID; }); } })
                        // =============================================
                        // CREATOR FIELD BEHAVIOR (CROSS-ORG)
                        // =============================================
                        // 37. Record created via cross-org session has creator set to home org user, not a target org user
                    ];
                case 101:
                    // 36. Regular API key getSome users contains no target org users
                    _c.sent();
                    _c.label = 102;
                case 102:
                    _c.trys.push([102, , 104, 107]);
                    return [4 /*yield*/, (0, testing_1.async_test)("Cross-org created record has a creator from the home org, not the target org", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var created, targetOrgUserIds, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, sdkCrossOrg.api.endusers.createOne({ fname: 'CreatorTest', lname: 'CrossOrg' })];
                                    case 1:
                                        created = _b.sent();
                                        creatorTestId_1 = created.id;
                                        _a = Set.bind;
                                        return [4 /*yield*/, sdkCrossOrg.api.users.getSome()];
                                    case 2:
                                        targetOrgUserIds = new (_a.apply(Set, [void 0, (_b.sent()).map(function (u) { return u.id; })]))();
                                        return [2 /*return*/, created.creator !== undefined && !targetOrgUserIds.has(created.creator)];
                                }
                            });
                        }); }, { onResult: function (r) { return r === true; } })];
                case 103:
                    _c.sent();
                    return [3 /*break*/, 107];
                case 104:
                    if (!creatorTestId_1) return [3 /*break*/, 106];
                    return [4 /*yield*/, sdkCrossOrg.api.endusers.deleteOne(creatorTestId_1).catch(console.error)];
                case 105:
                    _c.sent();
                    _c.label = 106;
                case 106: return [7 /*endfinally*/];
                case 107: return [3 /*break*/, 110];
                case 108: return [4 /*yield*/, sdk.api.api_keys.deleteOne(regularApiKeyRecord.id).catch(console.error)];
                case 109:
                    _c.sent();
                    return [7 /*endfinally*/];
                case 110: return [2 /*return*/];
            }
        });
    });
};
exports.cross_org_api_key_tests = cross_org_api_key_tests;
// Allow running independently
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
                    return [4 /*yield*/, (0, exports.cross_org_api_key_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("Cross-org API key test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("Cross-org API key test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=cross_org_api_key.test.js.map