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
require('source-map-support').install();
import axios from "axios";
import { Session } from "../../sdk";
import { assert, async_test, log_header, wait, } from "@tellescope/testing";
import { evaluate_conditional_logic_for_enduser_fields } from "@tellescope/utilities";
import { setup_tests } from "../setup";
import { BUILT_INS_FOR_SET_FIELDS, HEALTHIE_TITLE } from "@tellescope/constants";
var host = process.env.API_URL || 'http://localhost:8080';
var TAG = 'clinic-two';
var FORMSORT_TEST_KEY = '9d4f9dff00f60df2690a16da2cb848f289b447614ad9bef850e54af09a1fbf7a';
export var healthie_multi_integration_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var businessId, primaryIntegrationId, taggedIntegrationId, enduserId, formsortEnduserId, formId, conditionPlaceholders, taggedForConditions, untaggedForConditions, primary, tagged, enduser, form_1, formsortEmail_1, postToFormsort, _i, _b, id;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    log_header("Multiple Healthie Integrations Tests");
                    businessId = sdk.userInfo.businessId;
                    primaryIntegrationId = '';
                    taggedIntegrationId = '';
                    enduserId = '';
                    formsortEnduserId = '';
                    formId = '';
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, , 33, 44]);
                    // ── Set Fields support ────────────────────────────────────────────────────────────────────
                    if (!BUILT_INS_FOR_SET_FIELDS.includes('healthieIntegrationId')) {
                        throw new Error("healthieIntegrationId missing from BUILT_INS_FOR_SET_FIELDS");
                    }
                    console.log("✅ healthieIntegrationId exposed in BUILT_INS_FOR_SET_FIELDS");
                    conditionPlaceholders = {
                        businessId: '', creator: '', hashedPassword: '', lastActive: '', lastLogout: '', updatedAt: new Date(),
                    };
                    taggedForConditions = __assign(__assign({}, conditionPlaceholders), { healthieIntegrationId: TAG });
                    untaggedForConditions = __assign({}, conditionPlaceholders);
                    assert(evaluate_conditional_logic_for_enduser_fields(taggedForConditions, { $and: [{ condition: { healthieIntegrationId: TAG } }] }), 'Conditional logic error', 'healthieIntegrationId equality matches a tagged patient');
                    assert(!evaluate_conditional_logic_for_enduser_fields(taggedForConditions, { $and: [{ condition: { healthieIntegrationId: 'other-clinic' } }] }), 'Conditional logic error', 'healthieIntegrationId equality rejects a different id');
                    assert(!evaluate_conditional_logic_for_enduser_fields(untaggedForConditions, { $and: [{ condition: { healthieIntegrationId: TAG } }] }), 'Conditional logic error', 'healthieIntegrationId equality rejects an unset (primary) patient');
                    assert(evaluate_conditional_logic_for_enduser_fields(taggedForConditions, { $and: [{ condition: { healthieIntegrationId: { $isSet: true } } }] }), 'Conditional logic error', 'healthieIntegrationId $isSet matches a tagged patient');
                    assert(evaluate_conditional_logic_for_enduser_fields(untaggedForConditions, { $and: [{ condition: { healthieIntegrationId: { $isNotSet: true } } }] }), 'Conditional logic error', 'healthieIntegrationId $isNotSet matches an unset (primary) patient');
                    assert(!evaluate_conditional_logic_for_enduser_fields(taggedForConditions, { $and: [{ condition: { healthieIntegrationId: { $ne: TAG } } }] }), 'Conditional logic error', 'healthieIntegrationId $ne rejects the matching tag');
                    assert(evaluate_conditional_logic_for_enduser_fields(untaggedForConditions, { $and: [{ condition: { healthieIntegrationId: { $ne: TAG } } }] }), 'Conditional logic error', 'healthieIntegrationId $ne matches an unset (primary) patient');
                    console.log("✅ healthieIntegrationId evaluates in conditional logic (equality, $isSet/$isNotSet, $ne)");
                    return [4 /*yield*/, sdk.api.integrations.createOne({
                            title: HEALTHIE_TITLE,
                            disableEnduserAutoSync: true,
                            disableTicketAutoSync: true,
                            authentication: {
                                type: 'apiKey',
                                info: { access_token: 'gh_sbox_fake_primary_key', refresh_token: 'unused', scope: '', token_type: 'Bearer', expiry_date: 0 },
                            },
                        })];
                case 2:
                    primary = _c.sent();
                    primaryIntegrationId = primary.id;
                    return [4 /*yield*/, sdk.api.integrations.createOne({
                            title: HEALTHIE_TITLE,
                            tenantId: TAG,
                            disableEnduserAutoSync: true,
                            disableTicketAutoSync: true,
                            authentication: {
                                type: 'apiKey',
                                info: { access_token: 'fake_production_key', refresh_token: 'unused', scope: '', token_type: 'Bearer', expiry_date: 0 },
                            },
                        })];
                case 3:
                    tagged = _c.sent();
                    taggedIntegrationId = tagged.id;
                    if (tagged.tenantId !== TAG) {
                        throw new Error("tenantId not persisted on create (got \"".concat(tagged.tenantId, "\")"));
                    }
                    console.log("✅ tenantId persists via standard integrations create");
                    // ── Per-connection settings: update_settings works against a tagged integration ──
                    return [4 /*yield*/, async_test("update_settings updates a tagged integration", function () { return sdk.api.integrations.update_settings({ id: taggedIntegrationId, updates: { pushAddedTags: true } }); }, { onResult: function (r) { var _a; return ((_a = r.integration) === null || _a === void 0 ? void 0 : _a.pushAddedTags) === true; } })];
                case 4:
                    // ── Per-connection settings: update_settings works against a tagged integration ──
                    _c.sent();
                    return [4 /*yield*/, async_test("tagged integration settings persist independently", function () { return sdk.api.integrations.getOne(taggedIntegrationId); }, { onResult: function (i) { return i.pushAddedTags === true && i.tenantId === TAG; } })];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, async_test("primary integration unaffected by tagged settings update", function () { return sdk.api.integrations.getOne(primaryIntegrationId); }, { onResult: function (i) { return !i.pushAddedTags; } })
                        // ── Invalid API key surfaces as an actionable 400 (fake key → Healthie rejects the request) ──
                    ];
                case 6:
                    _c.sent();
                    // ── Invalid API key surfaces as an actionable 400 (fake key → Healthie rejects the request) ──
                    return [4 /*yield*/, async_test("proxy_read webhooks with an invalid API key returns a clear error", function () { return sdk.api.integrations.proxy_read({
                            integration: HEALTHIE_TITLE, type: 'webhooks', healthieIntegrationId: TAG,
                        }); }, { shouldError: true, onError: function (e) { return ((e === null || e === void 0 ? void 0 : e.message) || '').includes('API Key is Invalid'); } })
                        // ── Organization.healthieIntegrationIds pushed by create side effect ──
                    ];
                case 7:
                    // ── Invalid API key surfaces as an actionable 400 (fake key → Healthie rejects the request) ──
                    _c.sent();
                    // ── Organization.healthieIntegrationIds pushed by create side effect ──
                    return [4 /*yield*/, wait(undefined, 2000)]; // side effects are async
                case 8:
                    // ── Organization.healthieIntegrationIds pushed by create side effect ──
                    _c.sent(); // side effects are async
                    return [4 /*yield*/, async_test("organization.healthieIntegrationIds includes tag after create", function () { return sdk.api.organizations.getOne(businessId); }, { onResult: function (o) { var _a; return !!((_a = o.healthieIntegrationIds) === null || _a === void 0 ? void 0 : _a.includes(TAG)); } })
                        // ── Inbound webhook resolution (help page proves the integration lookup without network) ──
                    ];
                case 9:
                    _c.sent();
                    // ── Inbound webhook resolution (help page proves the integration lookup without network) ──
                    return [4 /*yield*/, async_test("webhook help page resolves primary (sandbox) without query param", function () { return axios.get("".concat(host, "/v1/webhooks/healthie/").concat(businessId)); }, { onResult: function (r) { return typeof r.data === 'string' && r.data.startsWith('Sandbox'); } })];
                case 10:
                    // ── Inbound webhook resolution (help page proves the integration lookup without network) ──
                    _c.sent();
                    return [4 /*yield*/, async_test("webhook help page resolves tagged (production) integration via healthieIntegrationId param", function () { return axios.get("".concat(host, "/v1/webhooks/healthie/").concat(businessId, "?healthieIntegrationId=").concat(TAG)); }, { onResult: function (r) { return typeof r.data === 'string' && r.data.startsWith('Production'); } })];
                case 11:
                    _c.sent();
                    return [4 /*yield*/, async_test("webhook help page rejects unknown healthieIntegrationId", function () { return axios.get("".concat(host, "/v1/webhooks/healthie/").concat(businessId, "?healthieIntegrationId=not-a-real-id")); }, { shouldError: true, onError: function (e) { var _a; return ((_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.status) === 400; } })
                        // ── Enduser field + one-org-per-patient lock (relationship constraint) ──
                    ];
                case 12:
                    _c.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            email: 'multi-healthie-test@tellescope.com',
                            healthieIntegrationId: TAG,
                        })];
                case 13:
                    enduser = _c.sent();
                    enduserId = enduser.id;
                    if (enduser.healthieIntegrationId !== TAG) {
                        throw new Error("healthieIntegrationId not persisted on enduser create");
                    }
                    return [4 /*yield*/, async_test("healthieIntegrationId freely changeable while unlinked", function () { return sdk.api.endusers.updateOne(enduserId, { healthieIntegrationId: '' }); }, { onResult: function (e) { return !e.healthieIntegrationId; } })];
                case 14:
                    _c.sent();
                    return [4 /*yield*/, async_test("healthieIntegrationId re-set while unlinked", function () { return sdk.api.endusers.updateOne(enduserId, { healthieIntegrationId: TAG }); }, { onResult: function (e) { return e.healthieIntegrationId === TAG; } })
                        // link the patient to Healthie (reference with a Healthie patient id)
                    ];
                case 15:
                    _c.sent();
                    // link the patient to Healthie (reference with a Healthie patient id)
                    return [4 /*yield*/, sdk.api.endusers.updateOne(enduserId, { references: [{ type: HEALTHIE_TITLE, id: '12345' }] }, { replaceObjectFields: true })
                        // no lock: linked patients stay editable so customers can self-serve fix or migrate them
                    ];
                case 16:
                    // link the patient to Healthie (reference with a Healthie patient id)
                    _c.sent();
                    // no lock: linked patients stay editable so customers can self-serve fix or migrate them
                    return [4 /*yield*/, async_test("healthieIntegrationId changeable while linked (self-serve fix/migrate)", function () { return sdk.api.endusers.updateOne(enduserId, { healthieIntegrationId: 'somewhere-else' }); }, { onResult: function (e) { return e.healthieIntegrationId === 'somewhere-else'; } })];
                case 17:
                    // no lock: linked patients stay editable so customers can self-serve fix or migrate them
                    _c.sent();
                    return [4 /*yield*/, async_test("healthieIntegrationId revertible while linked", function () { return sdk.api.endusers.updateOne(enduserId, { healthieIntegrationId: TAG }); }, { onResult: function (e) { return e.healthieIntegrationId === TAG; } })];
                case 18:
                    _c.sent();
                    return [4 /*yield*/, sdk.api.endusers.updateOne(enduserId, { references: [] }, { replaceObjectFields: true })];
                case 19:
                    _c.sent();
                    return [4 /*yield*/, async_test("healthieIntegrationId clearable", function () { return sdk.api.endusers.updateOne(enduserId, { healthieIntegrationId: '' }); }, { onResult: function (e) { return !e.healthieIntegrationId; } })
                        // ── Formsort mapping ──
                    ];
                case 20:
                    _c.sent();
                    return [4 /*yield*/, sdk.api.forms.createOne({ title: "Multi Healthie FormSort" })];
                case 21:
                    form_1 = _c.sent();
                    formId = form_1.id;
                    formsortEmail_1 = 'multi-healthie-formsort@tellescope.com';
                    postToFormsort = function (answers, responder_uuid) {
                        var url = new URL("".concat(host, "/v1/webhooks/formsort/").concat(FORMSORT_TEST_KEY));
                        url.searchParams.set('formId', form_1.id);
                        return axios.post(url.toString(), { answers: answers, responder_uuid: responder_uuid, finalized: true });
                    };
                    return [4 /*yield*/, postToFormsort([
                            { key: 'email', value: formsortEmail_1 },
                            { key: 'healthieIntegrationId', value: TAG },
                        ], "multi-healthie-1")];
                case 22:
                    _c.sent();
                    return [4 /*yield*/, async_test("formsort sets healthieIntegrationId on unlinked enduser", function () { return sdk.api.endusers.getSome({ filter: { email: formsortEmail_1 } }); }, { onResult: function (es) {
                                var e = es.find(function (e) { return e.email === formsortEmail_1; });
                                formsortEnduserId = (e === null || e === void 0 ? void 0 : e.id) || '';
                                return (e === null || e === void 0 ? void 0 : e.healthieIntegrationId) === TAG;
                            } })
                        // linked endusers are re-routable via formsort too (self-serve fix/migrate)
                    ];
                case 23:
                    _c.sent();
                    // linked endusers are re-routable via formsort too (self-serve fix/migrate)
                    return [4 /*yield*/, sdk.api.endusers.updateOne(formsortEnduserId, { references: [{ type: HEALTHIE_TITLE, id: '6789' }] }, { replaceObjectFields: true })];
                case 24:
                    // linked endusers are re-routable via formsort too (self-serve fix/migrate)
                    _c.sent();
                    return [4 /*yield*/, postToFormsort([
                            { key: 'email', value: formsortEmail_1 },
                            { key: 'healthieIntegrationId', value: 'somewhere-else' },
                        ], "multi-healthie-2")];
                case 25:
                    _c.sent();
                    return [4 /*yield*/, wait(undefined, 1000)];
                case 26:
                    _c.sent();
                    return [4 /*yield*/, async_test("formsort updates healthieIntegrationId on a linked enduser", function () { return sdk.api.endusers.getOne(formsortEnduserId); }, { onResult: function (e) { return e.healthieIntegrationId === 'somewhere-else'; } })
                        // ── Removing the primary must not affect the tagged integration; org list recomputes on delete ──
                    ];
                case 27:
                    _c.sent();
                    // ── Removing the primary must not affect the tagged integration; org list recomputes on delete ──
                    return [4 /*yield*/, sdk.api.integrations.deleteOne(primaryIntegrationId)];
                case 28:
                    // ── Removing the primary must not affect the tagged integration; org list recomputes on delete ──
                    _c.sent();
                    primaryIntegrationId = '';
                    return [4 /*yield*/, async_test("tagged integration survives primary deletion", function () { return sdk.api.integrations.getOne(taggedIntegrationId); }, { onResult: function (i) { return i.tenantId === TAG; } })];
                case 29:
                    _c.sent();
                    return [4 /*yield*/, sdk.api.integrations.deleteOne(taggedIntegrationId)];
                case 30:
                    _c.sent();
                    taggedIntegrationId = '';
                    return [4 /*yield*/, wait(undefined, 2000)]; // delete side effect is async
                case 31:
                    _c.sent(); // delete side effect is async
                    return [4 /*yield*/, async_test("organization.healthieIntegrationIds recomputed (emptied) after delete", function () { return sdk.api.organizations.getOne(businessId); }, { onResult: function (o) { var _a; return !((_a = o.healthieIntegrationIds) === null || _a === void 0 ? void 0 : _a.includes(TAG)); } })];
                case 32:
                    _c.sent();
                    return [3 /*break*/, 44];
                case 33:
                    _i = 0, _b = [primaryIntegrationId, taggedIntegrationId];
                    _c.label = 34;
                case 34:
                    if (!(_i < _b.length)) return [3 /*break*/, 37];
                    id = _b[_i];
                    if (!id)
                        return [3 /*break*/, 36];
                    return [4 /*yield*/, sdk.api.integrations.deleteOne(id).catch(console.error)];
                case 35:
                    _c.sent();
                    _c.label = 36;
                case 36:
                    _i++;
                    return [3 /*break*/, 34];
                case 37:
                    if (!enduserId) return [3 /*break*/, 39];
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduserId).catch(console.error)];
                case 38:
                    _c.sent();
                    _c.label = 39;
                case 39:
                    if (!formsortEnduserId) return [3 /*break*/, 41];
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(formsortEnduserId).catch(console.error)];
                case 40:
                    _c.sent();
                    _c.label = 41;
                case 41:
                    if (!formId) return [3 /*break*/, 43];
                    return [4 /*yield*/, sdk.api.forms.deleteOne(formId).catch(console.error)];
                case 42:
                    _c.sent();
                    _c.label = 43;
                case 43: return [7 /*endfinally*/];
                case 44: return [2 /*return*/];
            }
        });
    });
};
if (require.main === module) {
    console.log("Using API URL: ".concat(host));
    var sdk_1 = new Session({ host: host });
    var sdkNonAdmin_1 = new Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setup_tests(sdk_1, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, healthie_multi_integration_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Multiple Healthie integrations test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Multiple Healthie integrations test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=healthie_multi_integration.test.js.map