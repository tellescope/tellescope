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
exports.integrations_redacted_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var constants_1 = require("@tellescope/constants");
var host = process.env.API_URL || 'http://localhost:8080';
var hasNoSensitiveFields = function (integration) {
    for (var _i = 0, INTEGRATION_SENSITIVE_FIELDS_1 = constants_1.INTEGRATION_SENSITIVE_FIELDS; _i < INTEGRATION_SENSITIVE_FIELDS_1.length; _i++) {
        var field = INTEGRATION_SENSITIVE_FIELDS_1[_i];
        if (field in integration)
            return false;
    }
    return true;
};
var integrations_redacted_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var integrationId, sensitiveIntegrationId, created, sensitiveIntegration, error_1, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("Integrations Redacted Endpoints Tests");
                    integrationId = '';
                    sensitiveIntegrationId = '';
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 27, 36]);
                    return [4 /*yield*/, sdk.api.integrations.createOne({
                            title: 'Test Redacted Integration',
                            authentication: { type: 'oauth2', info: { access_token: 'test-access-token', refresh_token: 'test-refresh-token', scope: '', token_type: 'Bearer', expiry_date: new Date().getTime() } },
                            webhooksSecret: 'super-secret-webhook',
                            emailDisabled: false,
                        })];
                case 2:
                    created = _b.sent();
                    integrationId = created.id;
                    // load_redacted as creator — verify integration is returned, no sensitive fields present
                    return [4 /*yield*/, (0, testing_1.async_test)("load_redacted as creator returns redacted integrations", function () { return sdk.api.integrations.load_redacted({}); }, { onResult: function (r) {
                                var found = r.integrations.find(function (i) { return i.id === integrationId; });
                                return !!found && hasNoSensitiveFields(found) && found.title === 'Test Redacted Integration';
                            } })
                        // load_redacted as non-creator — verify same integration visible and redacted
                    ];
                case 3:
                    // load_redacted as creator — verify integration is returned, no sensitive fields present
                    _b.sent();
                    // load_redacted as non-creator — verify same integration visible and redacted
                    return [4 /*yield*/, (0, testing_1.async_test)("load_redacted as non-creator returns redacted integrations (bypasses CREATOR_ONLY)", function () { return sdkNonAdmin.api.integrations.load_redacted({}); }, { onResult: function (r) {
                                var found = r.integrations.find(function (i) { return i.id === integrationId; });
                                return !!found && hasNoSensitiveFields(found) && found.title === 'Test Redacted Integration';
                            } })
                        // Standard load endpoints enforce CREATOR_ONLY — creator gets full object, non-creator gets nothing.
                        // webhooksSecret has schema-level redactions: ['all'] (added with MDI webhooks support),
                        // so it never goes over the wire on any read — even for the creator.
                    ];
                case 4:
                    // load_redacted as non-creator — verify same integration visible and redacted
                    _b.sent();
                    // Standard load endpoints enforce CREATOR_ONLY — creator gets full object, non-creator gets nothing.
                    // webhooksSecret has schema-level redactions: ['all'] (added with MDI webhooks support),
                    // so it never goes over the wire on any read — even for the creator.
                    return [4 /*yield*/, (0, testing_1.async_test)("getOne as creator returns integration with authentication, webhooksSecret always redacted", function () { return sdk.api.integrations.getOne(integrationId); }, { onResult: function (i) { return !!i && 'authentication' in i && !('webhooksSecret' in i); } })];
                case 5:
                    // Standard load endpoints enforce CREATOR_ONLY — creator gets full object, non-creator gets nothing.
                    // webhooksSecret has schema-level redactions: ['all'] (added with MDI webhooks support),
                    // so it never goes over the wire on any read — even for the creator.
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("getOne as non-creator returns 404 (CREATOR_ONLY access control)", function () { return sdkNonAdmin.api.integrations.getOne(integrationId); }, { shouldError: true, onError: function () { return true; } })];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("getSome as non-creator returns empty list (CREATOR_ONLY access control)", function () { return sdkNonAdmin.api.integrations.getSome(); }, { onResult: function (r) { return Array.isArray(r) && r.find(function (i) { return i.id === integrationId; }) === undefined; } })
                        // update_settings as creator — update a non-sensitive field
                    ];
                case 7:
                    _b.sent();
                    // update_settings as creator — update a non-sensitive field
                    return [4 /*yield*/, (0, testing_1.async_test)("update_settings as creator updates non-sensitive field", function () { return sdk.api.integrations.update_settings({ id: integrationId, updates: { emailDisabled: true } }); }, { onResult: function (r) {
                                return !!r.integration && r.integration.emailDisabled === true && hasNoSensitiveFields(r.integration);
                            } })
                        // update_settings as non-creator — update another field
                    ];
                case 8:
                    // update_settings as creator — update a non-sensitive field
                    _b.sent();
                    // update_settings as non-creator — update another field
                    return [4 /*yield*/, (0, testing_1.async_test)("update_settings as non-creator updates non-sensitive field", function () { return sdkNonAdmin.api.integrations.update_settings({ id: integrationId, updates: { disableEnduserAutoSync: true } }); }, { onResult: function (r) {
                                return !!r.integration && r.integration.disableEnduserAutoSync === true && hasNoSensitiveFields(r.integration);
                            } })
                        // update_settings rejects sensitive fields
                    ];
                case 9:
                    // update_settings as non-creator — update another field
                    _b.sent();
                    // update_settings rejects sensitive fields
                    return [4 /*yield*/, (0, testing_1.async_test)("update_settings rejects authentication update", function () { return sdkNonAdmin.api.integrations.update_settings({ id: integrationId, updates: { authentication: { type: 'apiKey', info: { api_key: 'hacked' } } } }); }, { shouldError: true, onError: function () { return true; } })];
                case 10:
                    // update_settings rejects sensitive fields
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("update_settings rejects webhooksSecret update", function () { return sdkNonAdmin.api.integrations.update_settings({ id: integrationId, updates: { webhooksSecret: 'hacked' } }); }, { shouldError: true, onError: function () { return true; } })];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("update_settings rejects fhirClientSecret update", function () { return sdkNonAdmin.api.integrations.update_settings({ id: integrationId, updates: { fhirClientSecret: 'hacked' } }); }, { shouldError: true, onError: function () { return true; } })
                        // Group 1: Dot-notation bypass tests (validates the allowlist fix)
                    ];
                case 12:
                    _b.sent();
                    // Group 1: Dot-notation bypass tests (validates the allowlist fix)
                    return [4 /*yield*/, (0, testing_1.async_test)("update_settings rejects dot-notation authentication.info.api_key update", function () { return sdk.api.integrations.update_settings({ id: integrationId, updates: { "authentication.info.api_key": "hacked" } }); }, { shouldError: true, onError: function () { return true; } })];
                case 13:
                    // Group 1: Dot-notation bypass tests (validates the allowlist fix)
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("update_settings rejects dot-notation authentication.type update", function () { return sdk.api.integrations.update_settings({ id: integrationId, updates: { "authentication.type": "hacked" } }); }, { shouldError: true, onError: function () { return true; } })
                        // Group 2: Remaining sensitive field rejections
                    ];
                case 14:
                    _b.sent();
                    // Group 2: Remaining sensitive field rejections
                    return [4 /*yield*/, (0, testing_1.async_test)("update_settings rejects fhirClientId update", function () { return sdk.api.integrations.update_settings({ id: integrationId, updates: { fhirClientId: 'hacked' } }); }, { shouldError: true, onError: function () { return true; } })];
                case 15:
                    // Group 2: Remaining sensitive field rejections
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("update_settings rejects fhirAccessToken update", function () { return sdk.api.integrations.update_settings({ id: integrationId, updates: { fhirAccessToken: 'hacked' } }); }, { shouldError: true, onError: function () { return true; } })
                        // Group 3: Non-allowlisted field rejections
                    ];
                case 16:
                    _b.sent();
                    // Group 3: Non-allowlisted field rejections
                    return [4 /*yield*/, (0, testing_1.async_test)("update_settings rejects title update (not in allowlist)", function () { return sdk.api.integrations.update_settings({ id: integrationId, updates: { title: 'hacked' } }); }, { shouldError: true, onError: function () { return true; } })];
                case 17:
                    // Group 3: Non-allowlisted field rejections
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("update_settings rejects environment update (not in allowlist)", function () { return sdk.api.integrations.update_settings({ id: integrationId, updates: { environment: 'hacked' } }); }, { shouldError: true, onError: function () { return true; } })];
                case 18:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("update_settings rejects unknown field update", function () { return sdk.api.integrations.update_settings({ id: integrationId, updates: { unknownField: 'hacked' } }); }, { shouldError: true, onError: function () { return true; } })
                        // Group 4: Verify additional allowlisted fields can be updated
                    ];
                case 19:
                    _b.sent();
                    // Group 4: Verify additional allowlisted fields can be updated
                    return [4 /*yield*/, (0, testing_1.async_test)("update_settings allows syncUnrecognizedSenders update", function () { return sdk.api.integrations.update_settings({ id: integrationId, updates: { syncUnrecognizedSenders: true } }); }, { onResult: function (r) { return !!r.integration && r.integration.syncUnrecognizedSenders === true && hasNoSensitiveFields(r.integration); } })];
                case 20:
                    // Group 4: Verify additional allowlisted fields can be updated
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("update_settings allows pushCalendarDetails update", function () { return sdk.api.integrations.update_settings({ id: integrationId, updates: { pushCalendarDetails: true } }); }, { onResult: function (r) { return !!r.integration && r.integration.pushCalendarDetails === true && hasNoSensitiveFields(r.integration); } })
                        // Group 5: Explicit per-field redaction verification
                        // Note: fhirClientId/fhirClientSecret/fhirAccessToken are set server-side via OAuth flows only,
                        // so we test redaction of the fields that can be set via createOne (authentication, webhooksSecret)
                    ];
                case 21:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.integrations.createOne({
                            title: 'Test All Sensitive Fields',
                            authentication: { type: 'oauth2', info: { access_token: 'secret-access-token', refresh_token: 'secret-refresh-token', scope: '', token_type: 'Bearer', expiry_date: new Date().getTime() } },
                            webhooksSecret: 'super-secret-webhook-456',
                            emailDisabled: true,
                        })];
                case 22:
                    sensitiveIntegration = _b.sent();
                    sensitiveIntegrationId = sensitiveIntegration.id;
                    return [4 /*yield*/, (0, testing_1.async_test)("load_redacted omits authentication field individually", function () { return sdk.api.integrations.load_redacted({}); }, { onResult: function (r) {
                                var found = r.integrations.find(function (i) { return i.id === sensitiveIntegrationId; });
                                return !!found && !('authentication' in found);
                            } })];
                case 23:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("load_redacted omits webhooksSecret field individually", function () { return sdk.api.integrations.load_redacted({}); }, { onResult: function (r) {
                                var found = r.integrations.find(function (i) { return i.id === sensitiveIntegrationId; });
                                return !!found && !('webhooksSecret' in found);
                            } })];
                case 24:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("load_redacted still returns non-sensitive fields", function () { return sdk.api.integrations.load_redacted({}); }, { onResult: function (r) {
                                var found = r.integrations.find(function (i) { return i.id === sensitiveIntegrationId; });
                                return !!found && found.emailDisabled === true && found.title === 'Test All Sensitive Fields';
                            } })
                        // F-0049: connect_stripe must reject caller-supplied accountId (Stripe-account-spoofing defense).
                        // Stripe Connect is deprecated in Tellescope; accountId was a test shortcut, kept rejected to preserve SDK shape.
                    ];
                case 25:
                    _b.sent();
                    // F-0049: connect_stripe must reject caller-supplied accountId (Stripe-account-spoofing defense).
                    // Stripe Connect is deprecated in Tellescope; accountId was a test shortcut, kept rejected to preserve SDK shape.
                    return [4 /*yield*/, (0, testing_1.async_test)("connect_stripe rejects caller-supplied accountId", function () { return sdk.api.integrations.connect_stripe({ countryCode: 'US', accountId: 'acct_someoneElsesAccount' }); }, { shouldError: true, onError: function (e) { return /accountId is not supported/i.test((e === null || e === void 0 ? void 0 : e.message) || (e === null || e === void 0 ? void 0 : e.toString()) || ''); } })];
                case 26:
                    // F-0049: connect_stripe must reject caller-supplied accountId (Stripe-account-spoofing defense).
                    // Stripe Connect is deprecated in Tellescope; accountId was a test shortcut, kept rejected to preserve SDK shape.
                    _b.sent();
                    return [3 /*break*/, 36];
                case 27:
                    if (!integrationId) return [3 /*break*/, 31];
                    _b.label = 28;
                case 28:
                    _b.trys.push([28, 30, , 31]);
                    return [4 /*yield*/, sdk.api.integrations.deleteOne(integrationId)];
                case 29:
                    _b.sent();
                    return [3 /*break*/, 31];
                case 30:
                    error_1 = _b.sent();
                    console.error('Cleanup error:', error_1);
                    return [3 /*break*/, 31];
                case 31:
                    if (!sensitiveIntegrationId) return [3 /*break*/, 35];
                    _b.label = 32;
                case 32:
                    _b.trys.push([32, 34, , 35]);
                    return [4 /*yield*/, sdk.api.integrations.deleteOne(sensitiveIntegrationId)];
                case 33:
                    _b.sent();
                    return [3 /*break*/, 35];
                case 34:
                    error_2 = _b.sent();
                    console.error('Cleanup error (sensitive integration):', error_2);
                    return [3 /*break*/, 35];
                case 35: return [7 /*endfinally*/];
                case 36: return [2 /*return*/];
            }
        });
    });
};
exports.integrations_redacted_tests = integrations_redacted_tests;
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
                    return [4 /*yield*/, (0, exports.integrations_redacted_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("Integrations redacted test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("Integrations redacted test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=integrations_redacted.test.js.map