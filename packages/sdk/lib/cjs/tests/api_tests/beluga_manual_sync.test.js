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
exports.beluga_manual_sync_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var constants_1 = require("@tellescope/constants");
var host = process.env.API_URL || 'http://localhost:8080';
// Manual Beluga re-sync guard tests (CU-86e1uxz1n).
//   - form_responses.push_to_EHR with target === BELUGA_TITLE
//   - files.push with destination === BELUGA_TITLE
//
// Fast / no-upload: this only verifies the bad-input / guard branches that reject before any
// Beluga call. It performs NO S3 file uploads and triggers NO actual sync (both slow and require
// live Beluga sandbox credentials). File records are created via prepare_file_upload alone — that
// inserts the DB record, which is all the guards need.
var beluga_manual_sync_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var errorMessage, enduserId, belugaFormId, plainFormId, fileIds, createdBelugaIntegrationId, enduser_1, belugaForm, plainForm, plainField_1, submitForm, createFileRecord, draft_1, plainResponseId_1, belugaIntegrationAvailable, existing, _b, created, e_1, unlinkedFile_1, _i, fileIds_1, id;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    (0, testing_1.log_header)("Beluga Manual Sync Guard Tests (FormResponses & Files)");
                    errorMessage = function (e) { var _a; return ((e === null || e === void 0 ? void 0 : e.message) || ((_a = e === null || e === void 0 ? void 0 : e.toString) === null || _a === void 0 ? void 0 : _a.call(e)) || JSON.stringify(e)); };
                    fileIds = [];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, , 22, 35]);
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'beluga-sync',
                            email: "beluga_manual_sync_".concat(Date.now(), "@test.tellescope.com"),
                        })];
                case 2:
                    enduser_1 = _c.sent();
                    enduserId = enduser_1.id;
                    return [4 /*yield*/, sdk.api.forms.createOne({ title: 'Beluga Manual Sync Form', belugaVisitType: 'sync' })];
                case 3:
                    belugaForm = _c.sent();
                    belugaFormId = belugaForm.id;
                    return [4 /*yield*/, sdk.api.forms.createOne({ title: 'Non-Beluga Manual Sync Form' })];
                case 4:
                    plainForm = _c.sent();
                    plainFormId = plainForm.id;
                    return [4 /*yield*/, sdk.api.form_fields.createOne({
                            formId: plainForm.id, type: 'string', title: 'Field', previousFields: [{ type: 'root', info: {} }],
                        })];
                case 5:
                    plainField_1 = _c.sent();
                    submitForm = function (formId) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, accessCode, response;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, sdk.api.form_responses.prepare_form_response({ enduserId: enduser_1.id, formId: formId })];
                                case 1:
                                    _a = _b.sent(), accessCode = _a.accessCode, response = _a.response;
                                    return [4 /*yield*/, sdk.api.form_responses.submit_form_response({
                                            accessCode: accessCode,
                                            responses: [{ fieldId: plainField_1.id, fieldTitle: 'Field', answer: { type: 'string', value: 'x' } }],
                                        })];
                                case 2:
                                    _b.sent();
                                    return [2 /*return*/, response.id];
                            }
                        });
                    }); };
                    createFileRecord = function (name) { return __awaiter(void 0, void 0, void 0, function () {
                        var file;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, sdk.api.files.prepare_file_upload({
                                        name: name,
                                        type: 'text/plain', size: 1, enduserId: enduser_1.id,
                                    })];
                                case 1:
                                    file = (_a.sent()).file;
                                    fileIds.push(file.id);
                                    return [2 /*return*/, file];
                            }
                        });
                    }); };
                    return [4 /*yield*/, sdk.api.form_responses.prepare_form_response({ enduserId: enduser_1.id, formId: belugaForm.id })];
                case 6:
                    draft_1 = (_c.sent()).response;
                    return [4 /*yield*/, (0, testing_1.async_test)("push_to_EHR(target=BELUGA) rejects an unsubmitted form response", function () { return sdk.api.form_responses.push_to_EHR({ id: draft_1.id, target: constants_1.BELUGA_TITLE }); }, { shouldError: true, onError: function (e) { return /has not been submitted/i.test(errorMessage(e)); } })
                        // Submitted, but the form has no belugaVisitType → rejected as not configured
                    ];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, submitForm(plainForm.id)];
                case 8:
                    plainResponseId_1 = _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("push_to_EHR(target=BELUGA) rejects a form not configured for Beluga", function () { return sdk.api.form_responses.push_to_EHR({ id: plainResponseId_1, target: constants_1.BELUGA_TITLE }); }, { shouldError: true, onError: function (e) { return /not configured for Beluga/i.test(errorMessage(e)); } })
                        // ──────────────────────────────────────────────────────────────────────────
                        // 2. files.push(destination=BELUGA) guard — the endpoint resolves the destination
                        //    integration first, so a Beluga integration must exist for the branch to be reached.
                        //    Create a placeholder if the org has none; skip gracefully if that's not permitted.
                        // ──────────────────────────────────────────────────────────────────────────
                    ];
                case 9:
                    _c.sent();
                    belugaIntegrationAvailable = false;
                    _c.label = 10;
                case 10:
                    _c.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, sdk.api.integrations.load_redacted({})];
                case 11:
                    existing = _c.sent();
                    belugaIntegrationAvailable = !!existing.integrations.find(function (i) { return i.title === constants_1.BELUGA_TITLE; });
                    return [3 /*break*/, 13];
                case 12:
                    _b = _c.sent();
                    return [3 /*break*/, 13];
                case 13:
                    if (!!belugaIntegrationAvailable) return [3 /*break*/, 17];
                    _c.label = 14;
                case 14:
                    _c.trys.push([14, 16, , 17]);
                    return [4 /*yield*/, sdk.api.integrations.createOne({
                            title: constants_1.BELUGA_TITLE,
                            authentication: {
                                type: 'oauth2',
                                info: { access_token: 'test-access-token', refresh_token: 'test-refresh-token', scope: '', token_type: 'Bearer', expiry_date: new Date().getTime() },
                            },
                        })];
                case 15:
                    created = _c.sent();
                    createdBelugaIntegrationId = created.id;
                    belugaIntegrationAvailable = true;
                    return [3 /*break*/, 17];
                case 16:
                    e_1 = _c.sent();
                    console.log("Could not create a Beluga integration for testing; skipping files.push guard:", errorMessage(e_1));
                    return [3 /*break*/, 17];
                case 17:
                    if (!belugaIntegrationAvailable) return [3 /*break*/, 20];
                    return [4 /*yield*/, createFileRecord('beluga-unlinked.txt')];
                case 18:
                    unlinkedFile_1 = _c.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("files.push(destination=BELUGA) rejects a file with no associated form response", function () { return sdk.api.files.push({ id: unlinkedFile_1.id, destination: constants_1.BELUGA_TITLE }); }, { shouldError: true, onError: function (e) { return /not associated with a form response/i.test(errorMessage(e)); } })];
                case 19:
                    _c.sent();
                    return [3 /*break*/, 21];
                case 20:
                    console.log("⏭️  Skipping files.push(destination=BELUGA) guard (no Beluga integration available)");
                    _c.label = 21;
                case 21: return [3 /*break*/, 35];
                case 22:
                    _i = 0, fileIds_1 = fileIds;
                    _c.label = 23;
                case 23:
                    if (!(_i < fileIds_1.length)) return [3 /*break*/, 26];
                    id = fileIds_1[_i];
                    return [4 /*yield*/, sdk.api.files.deleteOne(id).catch(console.error)];
                case 24:
                    _c.sent();
                    _c.label = 25;
                case 25:
                    _i++;
                    return [3 /*break*/, 23];
                case 26:
                    if (!belugaFormId) return [3 /*break*/, 28];
                    return [4 /*yield*/, sdk.api.forms.deleteOne(belugaFormId).catch(console.error)];
                case 27:
                    _c.sent();
                    _c.label = 28;
                case 28:
                    if (!plainFormId) return [3 /*break*/, 30];
                    return [4 /*yield*/, sdk.api.forms.deleteOne(plainFormId).catch(console.error)];
                case 29:
                    _c.sent();
                    _c.label = 30;
                case 30:
                    if (!enduserId) return [3 /*break*/, 32];
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduserId).catch(console.error)];
                case 31:
                    _c.sent();
                    _c.label = 32;
                case 32:
                    if (!createdBelugaIntegrationId) return [3 /*break*/, 34];
                    return [4 /*yield*/, sdk.api.integrations.deleteOne(createdBelugaIntegrationId).catch(console.error)];
                case 33:
                    _c.sent();
                    _c.label = 34;
                case 34: return [7 /*endfinally*/];
                case 35: return [2 /*return*/];
            }
        });
    });
};
exports.beluga_manual_sync_tests = beluga_manual_sync_tests;
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
                    return [4 /*yield*/, (0, exports.beluga_manual_sync_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Beluga manual sync test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Beluga manual sync test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=beluga_manual_sync.test.js.map