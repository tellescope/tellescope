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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoped_api_keys_tests = void 0;
require('source-map-support').install();
var axios_1 = __importDefault(require("axios"));
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var types_models_1 = require("@tellescope/types-models");
var host = process.env.API_URL || "http://localhost:8080";
var TEST_EMAIL = "scoped-api-keys@tellescope.com";
var scoped_api_keys_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var form, buildUrl, bodyFor, keyIds, formResponseIds, fileIds, throwawayUserId, throwawayRoleId, scoped_1, headerResult, pathResult, scopedSession_1, uploadedFile_1, blockedFileEndpoints, _i, blockedFileEndpoints_1, _b, label, call, apiKeysRole, throwawayUser, _c, otherSdk_1, _d, nonAdminKey, unscoped_1, unscopedKeyValue_1, apiKeys, _e, keyIds_1, id, _f, formResponseIds_1, id, _g, fileIds_1, id, enduser, err_1;
        var _h;
        var _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    (0, testing_1.log_header)("Scoped API Keys (form-ingestion)");
                    return [4 /*yield*/, sdk.api.forms.createOne({ title: "Scoped API Key Test Form" })];
                case 1:
                    form = _o.sent();
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
                    fileIds = [];
                    _o.label = 2;
                case 2:
                    _o.trys.push([2, , 37, 59]);
                    return [4 /*yield*/, sdk.api.api_keys.createOne({ scopes: [types_models_1.FORM_INGESTION_API_KEY_SCOPE] })];
                case 3:
                    scoped_1 = _o.sent();
                    keyIds.push(scoped_1.id);
                    (0, testing_1.assert)(!!scoped_1.id && !!scoped_1.key, "scoped key create returned no id/key", "admin creates a form-ingestion-scoped key");
                    // record reflects the scope for its creator (CREATOR_ONLY_ACCESS read)
                    return [4 /*yield*/, (0, testing_1.async_test)("scoped key record stores scopes", function () { return sdk.api.api_keys.getOne(scoped_1.id); }, { onResult: function (k) { return JSON.stringify(k.scopes) === JSON.stringify([types_models_1.FORM_INGESTION_API_KEY_SCOPE]); } })
                        // =============================================
                        // (b) Scoped key is rejected on all general /v1 auth
                        // =============================================
                    ];
                case 4:
                    // record reflects the scope for its creator (CREATOR_ONLY_ACCESS read)
                    _o.sent();
                    // =============================================
                    // (b) Scoped key is rejected on all general /v1 auth
                    // =============================================
                    return [4 /*yield*/, (0, testing_1.async_test)("scoped key rejected on /v1/test-authenticated", function () { return new sdk_1.Session({ host: host, apiKey: scoped_1.key }).test_authenticated(); }, 
                        // SDK parseError surfaces a raw 401 body as the string 'Unauthenticated'
                        { shouldError: true, onError: function (e) { return e === 'Unauthenticated' || (e === null || e === void 0 ? void 0 : e.statusCode) === 401 || /unauthenticated/i.test((e === null || e === void 0 ? void 0 : e.message) || ''); } })];
                case 5:
                    // =============================================
                    // (b) Scoped key is rejected on all general /v1 auth
                    // =============================================
                    _o.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("scoped key rejected on GET /v1/endusers", function () { return axios_1.default.get("".concat(host, "/v1/endusers"), { headers: { Authorization: "API_KEY ".concat(scoped_1.key) } }); }, { shouldError: true, onError: function (e) { var _a; return ((_a = e.response) === null || _a === void 0 ? void 0 : _a.status) === 401; } })];
                case 6:
                    _o.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("scoped key rejected on cross-org targeting (x-tellescope-organization)", function () { return axios_1.default.get("".concat(host, "/v1/endusers"), {
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
                    _o.sent();
                    return [4 /*yield*/, axios_1.default.post(buildUrl('key-in-header'), bodyFor("scoped-1"), { headers: { Authorization: "API_KEY ".concat(scoped_1.key) } })];
                case 8:
                    headerResult = _o.sent();
                    (0, testing_1.assert)(headerResult.status === 200 && !!((_j = headerResult.data) === null || _j === void 0 ? void 0 : _j.formResponseId), "scoped key header auth failed: ".concat(headerResult.status, " ").concat(JSON.stringify(headerResult.data)), "scoped key authenticates the form-ingestion webhook via header");
                    if ((_k = headerResult.data) === null || _k === void 0 ? void 0 : _k.formResponseId)
                        formResponseIds.push(headerResult.data.formResponseId);
                    return [4 /*yield*/, axios_1.default.post(buildUrl(scoped_1.key), bodyFor("scoped-2"))];
                case 9:
                    pathResult = _o.sent();
                    (0, testing_1.assert)(pathResult.status === 200 && !!((_l = pathResult.data) === null || _l === void 0 ? void 0 : _l.formResponseId), "scoped key path auth failed: ".concat(pathResult.status, " ").concat(JSON.stringify(pathResult.data)), "scoped key authenticates the form-ingestion webhook via path segment");
                    if ((_m = pathResult.data) === null || _m === void 0 ? void 0 : _m.formResponseId)
                        formResponseIds.push(pathResult.data.formResponseId);
                    scopedSession_1 = new sdk_1.Session({ host: host, apiKey: scoped_1.key });
                    return [4 /*yield*/, scopedSession_1.api.files.prepare_file_upload({
                            name: 'scoped-intake-file.txt', size: 12, type: 'text/plain',
                        })];
                case 10:
                    uploadedFile_1 = (_o.sent()).file;
                    (0, testing_1.assert)(!!(uploadedFile_1 === null || uploadedFile_1 === void 0 ? void 0 : uploadedFile_1.id), "scoped key prepare_file_upload returned no file", "scoped key can call POST /prepare-file-upload");
                    if (uploadedFile_1 === null || uploadedFile_1 === void 0 ? void 0 : uploadedFile_1.id)
                        fileIds.push(uploadedFile_1.id);
                    return [4 /*yield*/, (0, testing_1.async_test)("scoped key can call POST /files/confirm-upload", function () { return scopedSession_1.api.files.confirm_file_upload({ id: uploadedFile_1.id }); }, { onResult: function () { return true; } })
                        // ...but is blocked from EVERY other endpoint in the files domain — proving the two allowed paths are the
                        // ONLY files access, and that the '/files/confirm-upload' allow-prefix does not open the '/files/*' namespace.
                    ];
                case 11:
                    _o.sent();
                    blockedFileEndpoints = [
                        ['GET /v1/files (readMany)', function () { return axios_1.default.get("".concat(host, "/v1/files"), { headers: { Authorization: "API_KEY ".concat(scoped_1.key) } }); }],
                        ['GET /v1/file/:id (read one)', function () { return axios_1.default.get("".concat(host, "/v1/file/000000000000000000000000"), { headers: { Authorization: "API_KEY ".concat(scoped_1.key) } }); }],
                        ['DELETE /v1/file/:id (destructive)', function () { return axios_1.default.delete("".concat(host, "/v1/file/000000000000000000000000"), { headers: { Authorization: "API_KEY ".concat(scoped_1.key) } }); }],
                        ['POST /v1/files/send-fax (/files/* sibling)', function () { return axios_1.default.post("".concat(host, "/v1/files/send-fax"), {}, { headers: { Authorization: "API_KEY ".concat(scoped_1.key) } }); }],
                        ['POST /v1/files/ocr (/files/* sibling)', function () { return axios_1.default.post("".concat(host, "/v1/files/ocr"), {}, { headers: { Authorization: "API_KEY ".concat(scoped_1.key) } }); }],
                        ['POST /v1/files/push (/files/* sibling)', function () { return axios_1.default.post("".concat(host, "/v1/files/push"), {}, { headers: { Authorization: "API_KEY ".concat(scoped_1.key) } }); }],
                    ];
                    _i = 0, blockedFileEndpoints_1 = blockedFileEndpoints;
                    _o.label = 12;
                case 12:
                    if (!(_i < blockedFileEndpoints_1.length)) return [3 /*break*/, 15];
                    _b = blockedFileEndpoints_1[_i], label = _b[0], call = _b[1];
                    return [4 /*yield*/, (0, testing_1.async_test)("scoped key blocked on ".concat(label), call, { shouldError: true, onError: function (e) { var _a, _b; return ((_a = e.response) === null || _a === void 0 ? void 0 : _a.status) === 401 || ((_b = e.response) === null || _b === void 0 ? void 0 : _b.status) === 403; } })];
                case 13:
                    _o.sent();
                    _o.label = 14;
                case 14:
                    _i++;
                    return [3 /*break*/, 12];
                case 15: return [4 /*yield*/, sdk.api.role_based_access_permissions.createOne({
                        role: 'scoped-api-keys-test-role',
                        permissions: { api_keys: { create: 'All', read: 'All', update: 'All', delete: 'All' } },
                    })];
                case 16:
                    apiKeysRole = _o.sent();
                    throwawayRoleId = apiKeysRole.id;
                    return [4 /*yield*/, sdk.api.users.getOne({ email: 'scoped.api.keys.user@tellescope.com' }).catch(function () { return null; })];
                case 17:
                    _c = (_o.sent());
                    if (_c) return [3 /*break*/, 19];
                    return [4 /*yield*/, sdk.api.users.createOne({ email: 'scoped.api.keys.user@tellescope.com', notificationEmailsDisabled: true, verifiedEmail: true })];
                case 18:
                    _c = (_o.sent());
                    _o.label = 19;
                case 19:
                    throwawayUser = _c;
                    throwawayUserId = throwawayUser.id;
                    return [4 /*yield*/, sdk.api.users.updateOne(throwawayUser.id, { roles: [apiKeysRole.role] }, { replaceObjectFields: true })];
                case 20:
                    _o.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 2000)]; // wait for the role change to propagate before authenticating
                case 21:
                    _o.sent(); // wait for the role change to propagate before authenticating
                    _d = sdk_1.Session.bind;
                    _h = {
                        host: host
                    };
                    return [4 /*yield*/, sdk.api.users.generate_auth_token({ id: throwawayUser.id })];
                case 22:
                    otherSdk_1 = new (_d.apply(sdk_1.Session, [void 0, (_h.authToken = (_o.sent()).authToken,
                            _h)]))();
                    return [4 /*yield*/, (0, testing_1.async_test)("non-admin cannot create a scoped key (401)", function () { return otherSdk_1.api.api_keys.createOne({ scopes: [types_models_1.FORM_INGESTION_API_KEY_SCOPE] }); }, { shouldError: true, onError: function (e) { return e === 'Unauthenticated' || (e === null || e === void 0 ? void 0 : e.statusCode) === 401 || /admin/i.test((e === null || e === void 0 ? void 0 : e.message) || ''); } })
                        // ...but CAN still create an unscoped key; an empty scopes list is rejected by validation (fail closed)
                    ];
                case 23:
                    _o.sent();
                    return [4 /*yield*/, otherSdk_1.api.api_keys.createOne({})];
                case 24:
                    nonAdminKey = _o.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("empty scopes list rejected by validation", function () { return otherSdk_1.api.api_keys.createOne({ scopes: [] }); }, { shouldError: true, onError: function (e) { return (e === null || e === void 0 ? void 0 : e.statusCode) === 400 || /empty|not valid|invalid/i.test((e === null || e === void 0 ? void 0 : e.message) || ''); } })
                        // creator-only cleanup for the throwaway user's key before the user is deleted
                    ];
                case 25:
                    _o.sent();
                    // creator-only cleanup for the throwaway user's key before the user is deleted
                    return [4 /*yield*/, otherSdk_1.api.api_keys.deleteOne(nonAdminKey.id).catch(function () { })
                        // =============================================
                        // (e) Unscoped keys are unchanged (no regression)
                        // =============================================
                    ];
                case 26:
                    // creator-only cleanup for the throwaway user's key before the user is deleted
                    _o.sent();
                    return [4 /*yield*/, sdk.api.api_keys.createOne({})];
                case 27:
                    unscoped_1 = _o.sent();
                    unscopedKeyValue_1 = unscoped_1.key;
                    keyIds.push(unscoped_1.id);
                    return [4 /*yield*/, (0, testing_1.async_test)("unscoped key still authenticates general /v1", function () { return new sdk_1.Session({ host: host, apiKey: unscopedKeyValue_1 }).test_authenticated(); }, { onResult: function (r) { return !!r; } })
                        // Frozen pre-existing behavior: unscoped /v1-created keys store a utf8-encoded hashedKey, which the
                        // webhook's hex lookup never matches — only legacy plaintext keys and hex-stored scoped keys work there.
                        // (Legacy-key webhook auth is covered by formsort_header_auth.test.ts.)
                    ];
                case 28:
                    _o.sent();
                    // Frozen pre-existing behavior: unscoped /v1-created keys store a utf8-encoded hashedKey, which the
                    // webhook's hex lookup never matches — only legacy plaintext keys and hex-stored scoped keys work there.
                    // (Legacy-key webhook auth is covered by formsort_header_auth.test.ts.)
                    return [4 /*yield*/, (0, testing_1.async_test)("unscoped /v1-created key still does NOT authenticate the webhook (frozen encoding quirk)", function () { return axios_1.default.post(buildUrl('key-in-header'), bodyFor("scoped-3"), { headers: { Authorization: "API_KEY ".concat(unscopedKeyValue_1) } }); }, { shouldError: true, onError: function (e) { var _a; return ((_a = e.response) === null || _a === void 0 ? void 0 : _a.status) === 401; } })
                        // =============================================
                        // (f) Admin org-wide list includes scopes (and still never leaks secrets)
                        // =============================================
                    ];
                case 29:
                    // Frozen pre-existing behavior: unscoped /v1-created keys store a utf8-encoded hashedKey, which the
                    // webhook's hex lookup never matches — only legacy plaintext keys and hex-stored scoped keys work there.
                    // (Legacy-key webhook auth is covered by formsort_header_auth.test.ts.)
                    _o.sent();
                    return [4 /*yield*/, sdk.api.api_keys.get_organization_api_keys()];
                case 30:
                    apiKeys = (_o.sent()).apiKeys;
                    (0, testing_1.assert)(!!apiKeys.find(function (k) { return k.id === scoped_1.id && JSON.stringify(k.scopes) === JSON.stringify([types_models_1.FORM_INGESTION_API_KEY_SCOPE]); }), "org list did not report scopes on the scoped key", "get_organization_api_keys reports scopes on scoped keys");
                    (0, testing_1.assert)(!!apiKeys.find(function (k) { return k.id === unscoped_1.id && k.scopes === undefined; }), "org list reported scopes on an unscoped key", "get_organization_api_keys omits scopes on unscoped keys");
                    (0, testing_1.assert)(apiKeys.every(function (k) { return k.key === undefined && k.hashedKey === undefined; }), "org list leaked key material", "get_organization_api_keys still never returns key/hashedKey");
                    // =============================================
                    // (g) Legacy non-/v1 funnel (app.js requireLoginAndAccess → is_logged_in_API_key with NO requestPath).
                    // Proves scoped keys fail closed on every non-/v1 caller (also stands in for the Medplum webhook path),
                    // and that unscoped keys still authenticate the legacy funnel after this work.
                    // NOTE: the legacy middleware reads the key from ?apiKey= / body only (never the Authorization header).
                    // =============================================
                    return [4 /*yield*/, (0, testing_1.async_test)("unscoped key authenticates a legacy non-/v1 route", function () { return axios_1.default.get("".concat(host, "/API-keys-for-user?apiKey=").concat(encodeURIComponent(unscopedKeyValue_1))); }, { onResult: function (r) { return r.status === 200; } })];
                case 31:
                    // =============================================
                    // (g) Legacy non-/v1 funnel (app.js requireLoginAndAccess → is_logged_in_API_key with NO requestPath).
                    // Proves scoped keys fail closed on every non-/v1 caller (also stands in for the Medplum webhook path),
                    // and that unscoped keys still authenticate the legacy funnel after this work.
                    // NOTE: the legacy middleware reads the key from ?apiKey= / body only (never the Authorization header).
                    // =============================================
                    _o.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("scoped key rejected on a legacy non-/v1 route (fail closed, no requestPath)", function () { return axios_1.default.get("".concat(host, "/API-keys-for-user?apiKey=").concat(encodeURIComponent(scoped_1.key))); }, { shouldError: true, onError: function (e) { var _a; return ((_a = e.response) === null || _a === void 0 ? void 0 : _a.status) === 401; } })
                        // =============================================
                        // (h) Data-egress adjacency: the scope's allowed paths must NOT leak to the file DOWNLOAD endpoint.
                        // =============================================
                    ];
                case 32:
                    _o.sent();
                    // =============================================
                    // (h) Data-egress adjacency: the scope's allowed paths must NOT leak to the file DOWNLOAD endpoint.
                    // =============================================
                    return [4 /*yield*/, (0, testing_1.async_test)("scoped key cannot call file_download_URL (no PHI egress)", function () { return axios_1.default.get("".concat(host, "/v1/file-download-URL?secureName=nonexistent"), { headers: { Authorization: "API_KEY ".concat(scoped_1.key) } }); }, { shouldError: true, onError: function (e) { var _a, _b; return ((_a = e.response) === null || _a === void 0 ? void 0 : _a.status) === 401 || ((_b = e.response) === null || _b === void 0 ? void 0 : _b.status) === 403; } })
                        // =============================================
                        // (i) Transport independence: the scope gate applies whether the key is in the header or the ?apiKey= query.
                        // =============================================
                    ];
                case 33:
                    // =============================================
                    // (h) Data-egress adjacency: the scope's allowed paths must NOT leak to the file DOWNLOAD endpoint.
                    // =============================================
                    _o.sent();
                    // =============================================
                    // (i) Transport independence: the scope gate applies whether the key is in the header or the ?apiKey= query.
                    // =============================================
                    return [4 /*yield*/, (0, testing_1.async_test)("scoped key via ?apiKey= query param still rejected on a disallowed /v1 endpoint", function () { return axios_1.default.get("".concat(host, "/v1/endusers?apiKey=").concat(encodeURIComponent(scoped_1.key))); }, { shouldError: true, onError: function (e) { var _a, _b; return ((_a = e.response) === null || _a === void 0 ? void 0 : _a.status) === 401 || ((_b = e.response) === null || _b === void 0 ? void 0 : _b.status) === 403; } })];
                case 34:
                    // =============================================
                    // (i) Transport independence: the scope gate applies whether the key is in the header or the ?apiKey= query.
                    // =============================================
                    _o.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("unscoped key via ?apiKey= query param still authenticates /v1 (regression)", function () { return axios_1.default.get("".concat(host, "/v1/test-authenticated?apiKey=").concat(encodeURIComponent(unscopedKeyValue_1))); }, { onResult: function (r) { return r.status === 200; } })
                        // =============================================
                        // Validation: unknown scope values are rejected
                        // =============================================
                    ];
                case 35:
                    _o.sent();
                    // =============================================
                    // Validation: unknown scope values are rejected
                    // =============================================
                    return [4 /*yield*/, (0, testing_1.async_test)("unknown scope value rejected by validation", function () { return sdk.api.api_keys.createOne({ scopes: ['not-a-real-scope'] }); }, { shouldError: true, onError: function (e) { return (e === null || e === void 0 ? void 0 : e.statusCode) === 400 || /must match|not valid|invalid/i.test((e === null || e === void 0 ? void 0 : e.message) || ''); } })];
                case 36:
                    // =============================================
                    // Validation: unknown scope values are rejected
                    // =============================================
                    _o.sent();
                    return [3 /*break*/, 59];
                case 37:
                    _e = 0, keyIds_1 = keyIds;
                    _o.label = 38;
                case 38:
                    if (!(_e < keyIds_1.length)) return [3 /*break*/, 41];
                    id = keyIds_1[_e];
                    return [4 /*yield*/, sdk.api.api_keys.deleteOne(id).catch(function () { })];
                case 39:
                    _o.sent();
                    _o.label = 40;
                case 40:
                    _e++;
                    return [3 /*break*/, 38];
                case 41:
                    _f = 0, formResponseIds_1 = formResponseIds;
                    _o.label = 42;
                case 42:
                    if (!(_f < formResponseIds_1.length)) return [3 /*break*/, 45];
                    id = formResponseIds_1[_f];
                    return [4 /*yield*/, sdk.api.form_responses.deleteOne(id).catch(function () { })];
                case 43:
                    _o.sent();
                    _o.label = 44;
                case 44:
                    _f++;
                    return [3 /*break*/, 42];
                case 45:
                    _g = 0, fileIds_1 = fileIds;
                    _o.label = 46;
                case 46:
                    if (!(_g < fileIds_1.length)) return [3 /*break*/, 49];
                    id = fileIds_1[_g];
                    return [4 /*yield*/, sdk.api.files.deleteOne(id).catch(function () { })];
                case 47:
                    _o.sent();
                    _o.label = 48;
                case 48:
                    _g++;
                    return [3 /*break*/, 46];
                case 49:
                    _o.trys.push([49, 52, , 53]);
                    return [4 /*yield*/, sdk.api.endusers.getOne({ email: TEST_EMAIL })];
                case 50:
                    enduser = _o.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id)];
                case 51:
                    _o.sent();
                    return [3 /*break*/, 53];
                case 52:
                    err_1 = _o.sent();
                    return [3 /*break*/, 53];
                case 53: return [4 /*yield*/, sdk.api.forms.deleteOne(form.id).catch(function () { })];
                case 54:
                    _o.sent();
                    if (!throwawayUserId) return [3 /*break*/, 56];
                    return [4 /*yield*/, sdk.api.users.deleteOne(throwawayUserId).catch(function () { })];
                case 55:
                    _o.sent();
                    _o.label = 56;
                case 56:
                    if (!throwawayRoleId) return [3 /*break*/, 58];
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.deleteOne(throwawayRoleId).catch(function () { })];
                case 57:
                    _o.sent();
                    _o.label = 58;
                case 58: return [7 /*endfinally*/];
                case 59: return [2 /*return*/];
            }
        });
    });
};
exports.scoped_api_keys_tests = scoped_api_keys_tests;
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
                    return [4 /*yield*/, (0, exports.scoped_api_keys_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
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