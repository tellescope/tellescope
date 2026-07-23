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
import axios from "axios";
import { Session } from "../../sdk";
import { assert, async_test, log_header, wait, } from "@tellescope/testing";
import { setup_tests } from "../setup";
import { FORM_INGESTION_API_KEY_SCOPE } from "@tellescope/types-models";
var host = process.env.API_URL || "http://localhost:8080";
var TEST_EMAIL = "scoped-api-keys@tellescope.com";
export var scoped_api_keys_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var form, buildUrl, bodyFor, keyIds, formResponseIds, throwawayUserId, throwawayRoleId, scoped_1, headerResult, pathResult, apiKeysRole, throwawayUser, _b, otherSdk_1, _c, nonAdminKey, unscoped_1, unscopedKeyValue_1, apiKeys, _i, keyIds_1, id, _d, formResponseIds_1, id, enduser, err_1;
        var _e;
        var _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    log_header("Scoped API Keys (form-ingestion)");
                    return [4 /*yield*/, sdk.api.forms.createOne({ title: "Scoped API Key Test Form" })];
                case 1:
                    form = _k.sent();
                    buildUrl = function (pathSegment) {
                        var url = new URL("".concat(host, "/v1/webhooks/form-ingestion/").concat(pathSegment));
                        url.searchParams.set('formId', form.id);
                        url.searchParams.set('returnJSON', 'true');
                        return url.toString();
                    };
                    bodyFor = function (responder_uuid) { return ({
                        answers: [{ key: 'email', value: TEST_EMAIL }],
                        responder_uuid: responder_uuid,
                        finalized: true,
                    }); };
                    keyIds = [];
                    formResponseIds = [];
                    _k.label = 2;
                case 2:
                    _k.trys.push([2, , 26, 44]);
                    return [4 /*yield*/, sdk.api.api_keys.createOne({ scopes: [FORM_INGESTION_API_KEY_SCOPE] })];
                case 3:
                    scoped_1 = _k.sent();
                    keyIds.push(scoped_1.id);
                    assert(!!scoped_1.id && !!scoped_1.key, "scoped key create returned no id/key", "admin creates a form-ingestion-scoped key");
                    // record reflects the scope for its creator (CREATOR_ONLY_ACCESS read)
                    return [4 /*yield*/, async_test("scoped key record stores scopes", function () { return sdk.api.api_keys.getOne(scoped_1.id); }, { onResult: function (k) { return JSON.stringify(k.scopes) === JSON.stringify([FORM_INGESTION_API_KEY_SCOPE]); } })
                        // =============================================
                        // (b) Scoped key is rejected on all general /v1 auth
                        // =============================================
                    ];
                case 4:
                    // record reflects the scope for its creator (CREATOR_ONLY_ACCESS read)
                    _k.sent();
                    // =============================================
                    // (b) Scoped key is rejected on all general /v1 auth
                    // =============================================
                    return [4 /*yield*/, async_test("scoped key rejected on /v1/test-authenticated", function () { return new Session({ host: host, apiKey: scoped_1.key }).test_authenticated(); }, 
                        // SDK parseError surfaces a raw 401 body as the string 'Unauthenticated'
                        { shouldError: true, onError: function (e) { return e === 'Unauthenticated' || (e === null || e === void 0 ? void 0 : e.statusCode) === 401 || /unauthenticated/i.test((e === null || e === void 0 ? void 0 : e.message) || ''); } })];
                case 5:
                    // =============================================
                    // (b) Scoped key is rejected on all general /v1 auth
                    // =============================================
                    _k.sent();
                    return [4 /*yield*/, async_test("scoped key rejected on GET /v1/endusers", function () { return axios.get("".concat(host, "/v1/endusers"), { headers: { Authorization: "API_KEY ".concat(scoped_1.key) } }); }, { shouldError: true, onError: function (e) { var _a; return ((_a = e.response) === null || _a === void 0 ? void 0 : _a.status) === 401; } })];
                case 6:
                    _k.sent();
                    return [4 /*yield*/, async_test("scoped key rejected on cross-org targeting (x-tellescope-organization)", function () { return axios.get("".concat(host, "/v1/endusers"), {
                            headers: {
                                Authorization: "API_KEY ".concat(scoped_1.key),
                                'x-tellescope-organization': sdk.userInfo.businessId,
                            },
                        }); }, { shouldError: true, onError: function (e) { var _a; return ((_a = e.response) === null || _a === void 0 ? void 0 : _a.status) === 401; } })
                        // =============================================
                        // (c) Scoped key IS accepted by the form-ingestion webhook
                        // =============================================
                    ];
                case 7:
                    _k.sent();
                    return [4 /*yield*/, axios.post(buildUrl('key-in-header'), bodyFor("scoped-1"), { headers: { Authorization: "API_KEY ".concat(scoped_1.key) } })];
                case 8:
                    headerResult = _k.sent();
                    assert(headerResult.status === 200 && !!((_f = headerResult.data) === null || _f === void 0 ? void 0 : _f.formResponseId), "scoped key header auth failed: ".concat(headerResult.status, " ").concat(JSON.stringify(headerResult.data)), "scoped key authenticates the form-ingestion webhook via header");
                    if ((_g = headerResult.data) === null || _g === void 0 ? void 0 : _g.formResponseId)
                        formResponseIds.push(headerResult.data.formResponseId);
                    return [4 /*yield*/, axios.post(buildUrl(scoped_1.key), bodyFor("scoped-2"))];
                case 9:
                    pathResult = _k.sent();
                    assert(pathResult.status === 200 && !!((_h = pathResult.data) === null || _h === void 0 ? void 0 : _h.formResponseId), "scoped key path auth failed: ".concat(pathResult.status, " ").concat(JSON.stringify(pathResult.data)), "scoped key authenticates the form-ingestion webhook via path segment");
                    if ((_j = pathResult.data) === null || _j === void 0 ? void 0 : _j.formResponseId)
                        formResponseIds.push(pathResult.data.formResponseId);
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.createOne({
                            role: 'scoped-api-keys-test-role',
                            permissions: { api_keys: { create: 'All', read: 'All', update: 'All', delete: 'All' } },
                        })];
                case 10:
                    apiKeysRole = _k.sent();
                    throwawayRoleId = apiKeysRole.id;
                    return [4 /*yield*/, sdk.api.users.getOne({ email: 'scoped.api.keys.user@tellescope.com' }).catch(function () { return null; })];
                case 11:
                    _b = (_k.sent());
                    if (_b) return [3 /*break*/, 13];
                    return [4 /*yield*/, sdk.api.users.createOne({ email: 'scoped.api.keys.user@tellescope.com', notificationEmailsDisabled: true, verifiedEmail: true })];
                case 12:
                    _b = (_k.sent());
                    _k.label = 13;
                case 13:
                    throwawayUser = _b;
                    throwawayUserId = throwawayUser.id;
                    return [4 /*yield*/, sdk.api.users.updateOne(throwawayUser.id, { roles: [apiKeysRole.role] }, { replaceObjectFields: true })];
                case 14:
                    _k.sent();
                    return [4 /*yield*/, wait(undefined, 2000)]; // wait for the role change to propagate before authenticating
                case 15:
                    _k.sent(); // wait for the role change to propagate before authenticating
                    _c = Session.bind;
                    _e = {
                        host: host
                    };
                    return [4 /*yield*/, sdk.api.users.generate_auth_token({ id: throwawayUser.id })];
                case 16:
                    otherSdk_1 = new (_c.apply(Session, [void 0, (_e.authToken = (_k.sent()).authToken,
                            _e)]))();
                    return [4 /*yield*/, async_test("non-admin cannot create a scoped key (401)", function () { return otherSdk_1.api.api_keys.createOne({ scopes: [FORM_INGESTION_API_KEY_SCOPE] }); }, { shouldError: true, onError: function (e) { return e === 'Unauthenticated' || (e === null || e === void 0 ? void 0 : e.statusCode) === 401 || /admin/i.test((e === null || e === void 0 ? void 0 : e.message) || ''); } })
                        // ...but CAN still create an unscoped key; an empty scopes list is rejected by validation (fail closed)
                    ];
                case 17:
                    _k.sent();
                    return [4 /*yield*/, otherSdk_1.api.api_keys.createOne({})];
                case 18:
                    nonAdminKey = _k.sent();
                    return [4 /*yield*/, async_test("empty scopes list rejected by validation", function () { return otherSdk_1.api.api_keys.createOne({ scopes: [] }); }, { shouldError: true, onError: function (e) { return (e === null || e === void 0 ? void 0 : e.statusCode) === 400 || /empty|not valid|invalid/i.test((e === null || e === void 0 ? void 0 : e.message) || ''); } })
                        // creator-only cleanup for the throwaway user's key before the user is deleted
                    ];
                case 19:
                    _k.sent();
                    // creator-only cleanup for the throwaway user's key before the user is deleted
                    return [4 /*yield*/, otherSdk_1.api.api_keys.deleteOne(nonAdminKey.id).catch(function () { })
                        // =============================================
                        // (e) Unscoped keys are unchanged (no regression)
                        // =============================================
                    ];
                case 20:
                    // creator-only cleanup for the throwaway user's key before the user is deleted
                    _k.sent();
                    return [4 /*yield*/, sdk.api.api_keys.createOne({})];
                case 21:
                    unscoped_1 = _k.sent();
                    unscopedKeyValue_1 = unscoped_1.key;
                    keyIds.push(unscoped_1.id);
                    return [4 /*yield*/, async_test("unscoped key still authenticates general /v1", function () { return new Session({ host: host, apiKey: unscopedKeyValue_1 }).test_authenticated(); }, { onResult: function (r) { return !!r; } })
                        // Frozen pre-existing behavior: unscoped /v1-created keys store a utf8-encoded hashedKey, which the
                        // webhook's hex lookup never matches — only legacy plaintext keys and hex-stored scoped keys work there.
                        // (Legacy-key webhook auth is covered by formsort_header_auth.test.ts.)
                    ];
                case 22:
                    _k.sent();
                    // Frozen pre-existing behavior: unscoped /v1-created keys store a utf8-encoded hashedKey, which the
                    // webhook's hex lookup never matches — only legacy plaintext keys and hex-stored scoped keys work there.
                    // (Legacy-key webhook auth is covered by formsort_header_auth.test.ts.)
                    return [4 /*yield*/, async_test("unscoped /v1-created key still does NOT authenticate the webhook (frozen encoding quirk)", function () { return axios.post(buildUrl('key-in-header'), bodyFor("scoped-3"), { headers: { Authorization: "API_KEY ".concat(unscopedKeyValue_1) } }); }, { shouldError: true, onError: function (e) { var _a; return ((_a = e.response) === null || _a === void 0 ? void 0 : _a.status) === 401; } })
                        // =============================================
                        // (f) Admin org-wide list includes scopes (and still never leaks secrets)
                        // =============================================
                    ];
                case 23:
                    // Frozen pre-existing behavior: unscoped /v1-created keys store a utf8-encoded hashedKey, which the
                    // webhook's hex lookup never matches — only legacy plaintext keys and hex-stored scoped keys work there.
                    // (Legacy-key webhook auth is covered by formsort_header_auth.test.ts.)
                    _k.sent();
                    return [4 /*yield*/, sdk.api.api_keys.get_organization_api_keys()];
                case 24:
                    apiKeys = (_k.sent()).apiKeys;
                    assert(!!apiKeys.find(function (k) { return k.id === scoped_1.id && JSON.stringify(k.scopes) === JSON.stringify([FORM_INGESTION_API_KEY_SCOPE]); }), "org list did not report scopes on the scoped key", "get_organization_api_keys reports scopes on scoped keys");
                    assert(!!apiKeys.find(function (k) { return k.id === unscoped_1.id && k.scopes === undefined; }), "org list reported scopes on an unscoped key", "get_organization_api_keys omits scopes on unscoped keys");
                    assert(apiKeys.every(function (k) { return k.key === undefined && k.hashedKey === undefined; }), "org list leaked key material", "get_organization_api_keys still never returns key/hashedKey");
                    // =============================================
                    // Validation: unknown scope values are rejected
                    // =============================================
                    return [4 /*yield*/, async_test("unknown scope value rejected by validation", function () { return sdk.api.api_keys.createOne({ scopes: ['not-a-real-scope'] }); }, { shouldError: true, onError: function (e) { return (e === null || e === void 0 ? void 0 : e.statusCode) === 400 || /must match|not valid|invalid/i.test((e === null || e === void 0 ? void 0 : e.message) || ''); } })];
                case 25:
                    // =============================================
                    // Validation: unknown scope values are rejected
                    // =============================================
                    _k.sent();
                    return [3 /*break*/, 44];
                case 26:
                    _i = 0, keyIds_1 = keyIds;
                    _k.label = 27;
                case 27:
                    if (!(_i < keyIds_1.length)) return [3 /*break*/, 30];
                    id = keyIds_1[_i];
                    return [4 /*yield*/, sdk.api.api_keys.deleteOne(id).catch(function () { })];
                case 28:
                    _k.sent();
                    _k.label = 29;
                case 29:
                    _i++;
                    return [3 /*break*/, 27];
                case 30:
                    _d = 0, formResponseIds_1 = formResponseIds;
                    _k.label = 31;
                case 31:
                    if (!(_d < formResponseIds_1.length)) return [3 /*break*/, 34];
                    id = formResponseIds_1[_d];
                    return [4 /*yield*/, sdk.api.form_responses.deleteOne(id).catch(function () { })];
                case 32:
                    _k.sent();
                    _k.label = 33;
                case 33:
                    _d++;
                    return [3 /*break*/, 31];
                case 34:
                    _k.trys.push([34, 37, , 38]);
                    return [4 /*yield*/, sdk.api.endusers.getOne({ email: TEST_EMAIL })];
                case 35:
                    enduser = _k.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id)];
                case 36:
                    _k.sent();
                    return [3 /*break*/, 38];
                case 37:
                    err_1 = _k.sent();
                    return [3 /*break*/, 38];
                case 38: return [4 /*yield*/, sdk.api.forms.deleteOne(form.id).catch(function () { })];
                case 39:
                    _k.sent();
                    if (!throwawayUserId) return [3 /*break*/, 41];
                    return [4 /*yield*/, sdk.api.users.deleteOne(throwawayUserId).catch(function () { })];
                case 40:
                    _k.sent();
                    _k.label = 41;
                case 41:
                    if (!throwawayRoleId) return [3 /*break*/, 43];
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.deleteOne(throwawayRoleId).catch(function () { })];
                case 42:
                    _k.sent();
                    _k.label = 43;
                case 43: return [7 /*endfinally*/];
                case 44: return [2 /*return*/];
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
                    return [4 /*yield*/, scoped_api_keys_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Scoped API keys test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Scoped API keys test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=scoped_api_keys.test.js.map