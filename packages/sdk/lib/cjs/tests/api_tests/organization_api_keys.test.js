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
exports.organization_api_keys_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || 'http://localhost:8080';
// fields that the admin org-wide list endpoint is allowed to return
var ALLOWED_FIELDS = ['id', 'creator', 'businessId', 'updatedAt'].sort();
var organization_api_keys_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var adminKeyIds, otherKeyId, otherUserId, apiKeysRoleId, apiKeysRole, otherUser_1, _b, otherSdk_1, _c, adminKey_1, otherKey, apiKeys, offending, afterGating, afterDelete, afterNoop, _i, adminKeyIds_1, id;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    (0, testing_1.log_header)("Organization API Keys (admin org-wide management)");
                    adminKeyIds = [];
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, , 19, 30]);
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.createOne({
                            role: 'api-keys-test-role',
                            permissions: { api_keys: { create: 'All', read: 'All', update: 'All', delete: 'All' } },
                        })];
                case 2:
                    apiKeysRole = _e.sent();
                    apiKeysRoleId = apiKeysRole.id;
                    return [4 /*yield*/, sdk.api.users.getOne({ email: 'api.keys.other.user@tellescope.com' }).catch(function () { return null; })];
                case 3:
                    _b = (_e.sent());
                    if (_b) return [3 /*break*/, 5];
                    return [4 /*yield*/, sdk.api.users.createOne({ email: 'api.keys.other.user@tellescope.com', notificationEmailsDisabled: true, verifiedEmail: true })];
                case 4:
                    _b = (_e.sent());
                    _e.label = 5;
                case 5:
                    otherUser_1 = _b;
                    otherUserId = otherUser_1.id;
                    return [4 /*yield*/, sdk.api.users.updateOne(otherUser_1.id, { roles: [apiKeysRole.role] }, { replaceObjectFields: true })];
                case 6:
                    _e.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 2000)]; // wait for the role change to propagate before authenticating
                case 7:
                    _e.sent(); // wait for the role change to propagate before authenticating
                    _c = sdk_1.Session.bind;
                    _d = {
                        host: host
                    };
                    return [4 /*yield*/, sdk.api.users.generate_auth_token({ id: otherUser_1.id })];
                case 8:
                    otherSdk_1 = new (_c.apply(sdk_1.Session, [void 0, (_d.authToken = (_e.sent()).authToken,
                            _d)]))();
                    return [4 /*yield*/, sdk.api.api_keys.createOne({})];
                case 9:
                    adminKey_1 = _e.sent();
                    adminKeyIds.push(adminKey_1.id);
                    return [4 /*yield*/, otherSdk_1.api.api_keys.createOne({})];
                case 10:
                    otherKey = _e.sent();
                    otherKeyId = otherKey.id;
                    return [4 /*yield*/, sdk.api.api_keys.get_organization_api_keys()];
                case 11:
                    apiKeys = (_e.sent()).apiKeys;
                    (0, testing_1.assert)(apiKeys.some(function (k) { return k.id === otherKeyId; }), "admin list did not include another user's key ".concat(otherKeyId), "admin get_organization_api_keys returns keys created by other users in the org");
                    (0, testing_1.assert)(apiKeys.some(function (k) { return k.id === adminKey_1.id; }), "admin list did not include the admin's own key", "admin get_organization_api_keys returns the admin's own keys");
                    (0, testing_1.assert)(!!apiKeys.find(function (k) { return k.id === otherKeyId && k.creator === otherUser_1.id; }), "creator on the other user's key did not match", "returned key reports the correct creator");
                    // =============================================
                    // SECRET REDACTION (server-side, allowlist)
                    // =============================================
                    (0, testing_1.assert)(apiKeys.every(function (k) { return k.key === undefined; }), "a returned record exposed a plaintext `key`", "no returned record exposes a plaintext key (legacy field)");
                    (0, testing_1.assert)(apiKeys.every(function (k) { return k.hashedKey === undefined; }), "a returned record exposed `hashedKey`", "no returned record exposes hashedKey");
                    offending = apiKeys
                        .map(function (k) { return Object.keys(k).filter(function (key) { return !ALLOWED_FIELDS.includes(key); }); })
                        .find(function (extra) { return extra.length > 0; });
                    (0, testing_1.assert)(offending === undefined, "a returned record exposed non-allowlisted fields: ".concat(JSON.stringify(offending)), "returned records contain only allowlisted fields (subset of id, creator, businessId, updatedAt)");
                    // =============================================
                    // CROSS-ORG ISOLATION (no leakage across businesses)
                    // =============================================
                    (0, testing_1.assert)(apiKeys.every(function (k) { return k.businessId === sdk.userInfo.businessId; }), "a returned key belonged to a different business", "all returned keys are scoped to the admin's businessId");
                    // =============================================
                    // ADMIN GATING (negative tests)
                    // =============================================
                    return [4 /*yield*/, (0, testing_1.async_test)("non-admin get_organization_api_keys is rejected (401)", function () { return otherSdk_1.api.api_keys.get_organization_api_keys(); }, { shouldError: true, onError: function (e) { return e.statusCode === 401 || /admin access only/i.test(e.message || ''); } })];
                case 12:
                    // =============================================
                    // ADMIN GATING (negative tests)
                    // =============================================
                    _e.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("non-admin delete_organization_api_key is rejected (401)", function () { return otherSdk_1.api.api_keys.delete_organization_api_key({ id: adminKey_1.id }); }, { shouldError: true, onError: function (e) { return e.statusCode === 401 || /admin access only/i.test(e.message || ''); } })
                        // confirm the gating did not delete the key
                    ];
                case 13:
                    _e.sent();
                    return [4 /*yield*/, sdk.api.api_keys.get_organization_api_keys()];
                case 14:
                    afterGating = _e.sent();
                    (0, testing_1.assert)(afterGating.apiKeys.some(function (k) { return k.id === adminKey_1.id; }), "rejected non-admin delete still removed the key", "rejected non-admin delete left the key intact");
                    // =============================================
                    // ADMIN DELETE another user's key
                    // =============================================
                    return [4 /*yield*/, (0, testing_1.async_test)("admin delete_organization_api_key deletes another user's key", function () { return sdk.api.api_keys.delete_organization_api_key({ id: otherKeyId }); }, { shouldError: false, onResult: function () { return true; } })];
                case 15:
                    // =============================================
                    // ADMIN DELETE another user's key
                    // =============================================
                    _e.sent();
                    return [4 /*yield*/, sdk.api.api_keys.get_organization_api_keys()];
                case 16:
                    afterDelete = _e.sent();
                    (0, testing_1.assert)(!afterDelete.apiKeys.some(function (k) { return k.id === otherKeyId; }), "deleted key still present in org-wide list", "deleted key no longer appears in the org-wide list");
                    otherKeyId = undefined; // successfully deleted; nothing to clean up
                    // deleting a key in a different org (fabricated id) must be a no-op for our org
                    return [4 /*yield*/, (0, testing_1.async_test)("admin delete of a non-existent/cross-org key id is a safe no-op", function () { return sdk.api.api_keys.delete_organization_api_key({ id: '000000000000000000000000' }); }, { shouldError: false, onResult: function () { return true; } })];
                case 17:
                    // deleting a key in a different org (fabricated id) must be a no-op for our org
                    _e.sent();
                    return [4 /*yield*/, sdk.api.api_keys.get_organization_api_keys()];
                case 18:
                    afterNoop = _e.sent();
                    (0, testing_1.assert)(afterNoop.apiKeys.some(function (k) { return k.id === adminKey_1.id; }), "no-op delete removed an unrelated key", "no-op cross-org delete left our org's keys intact");
                    return [3 /*break*/, 30];
                case 19:
                    _i = 0, adminKeyIds_1 = adminKeyIds;
                    _e.label = 20;
                case 20:
                    if (!(_i < adminKeyIds_1.length)) return [3 /*break*/, 23];
                    id = adminKeyIds_1[_i];
                    return [4 /*yield*/, sdk.api.api_keys.deleteOne(id).catch(function () { })];
                case 21:
                    _e.sent();
                    _e.label = 22;
                case 22:
                    _i++;
                    return [3 /*break*/, 20];
                case 23:
                    if (!otherKeyId) return [3 /*break*/, 25];
                    return [4 /*yield*/, sdk.api.api_keys.delete_organization_api_key({ id: otherKeyId }).catch(function () { })];
                case 24:
                    _e.sent();
                    _e.label = 25;
                case 25:
                    if (!otherUserId) return [3 /*break*/, 27];
                    return [4 /*yield*/, sdk.api.users.deleteOne(otherUserId).catch(function () { })];
                case 26:
                    _e.sent();
                    _e.label = 27;
                case 27:
                    if (!apiKeysRoleId) return [3 /*break*/, 29];
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.deleteOne(apiKeysRoleId).catch(function () { })];
                case 28:
                    _e.sent();
                    _e.label = 29;
                case 29: return [7 /*endfinally*/];
                case 30: return [2 /*return*/];
            }
        });
    });
};
exports.organization_api_keys_tests = organization_api_keys_tests;
// Allow running this test file independently
if (require.main === module) {
    var sdk_2 = new sdk_1.Session({ host: host });
    var sdkNonAdmin_1 = new sdk_1.Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, setup_1.setup_tests)(sdk_2, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, exports.organization_api_keys_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Organization API keys test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Organization API keys test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=organization_api_keys.test.js.map