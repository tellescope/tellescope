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
import { log_header, async_test, assert } from "@tellescope/testing";
import { setup_tests } from "../setup";
var host = process.env.API_URL || "http://localhost:8080";
// same seeded test API key used by formsort_tests (tests.ts)
var TEST_API_KEY = "9d4f9dff00f60df2690a16da2cb848f289b447614ad9bef850e54af09a1fbf7a";
// seeded second-tenant key (sdkOther in tests.ts) — valid, but for a different organization
var OTHER_TENANT_API_KEY = "ba745e25162bb95a795c5fa1af70df188d93c4d3aac9c48b34a5c8c9dd7b80f7";
var TEST_EMAIL = "formsort-header-auth@tellescope.com";
export var formsort_header_auth_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var form, buildUrl, bodyFor, formResponseIds, headerAuthResult_1, pathAuthResult, bearerFallthroughResult, aliasResult, emptyValueResult, singleTokenResult, _i, formResponseIds_1, id, err_1, enduser, err_2, err_3;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    log_header("FormSort Header Auth Tests");
                    return [4 /*yield*/, sdk.api.forms.createOne({ title: "FormSort Header Auth" })];
                case 1:
                    form = _q.sent();
                    buildUrl = function (route, pathSegment) {
                        var url = new URL("".concat(host, "/v1/webhooks/").concat(route, "/").concat(pathSegment));
                        url.searchParams.set('formId', form.id);
                        url.searchParams.set('returnJSON', 'true');
                        return url.toString();
                    };
                    bodyFor = function (responder_uuid) { return ({
                        answers: [{ key: 'email', value: TEST_EMAIL }],
                        responder_uuid: responder_uuid,
                        finalized: true,
                    }); };
                    formResponseIds = [];
                    _q.label = 2;
                case 2:
                    _q.trys.push([2, , 13, 27]);
                    return [4 /*yield*/, axios.post(buildUrl('formsort', 'key-in-header'), bodyFor("fha-1"), { headers: { Authorization: "API_KEY ".concat(TEST_API_KEY) } })];
                case 3:
                    headerAuthResult_1 = _q.sent();
                    assert(headerAuthResult_1.status === 200 && !!((_b = headerAuthResult_1.data) === null || _b === void 0 ? void 0 : _b.formResponseId) && !!((_c = headerAuthResult_1.data) === null || _c === void 0 ? void 0 : _c.enduserId), "Header auth failed: ".concat(headerAuthResult_1.status, " ").concat(JSON.stringify(headerAuthResult_1.data)), "Valid API_KEY header authenticates");
                    if ((_d = headerAuthResult_1.data) === null || _d === void 0 ? void 0 : _d.formResponseId)
                        formResponseIds.push(headerAuthResult_1.data.formResponseId);
                    return [4 /*yield*/, async_test("Form response created via header auth is retrievable", function () { return sdk.api.form_responses.getOne(headerAuthResult_1.data.formResponseId); }, { onResult: function (fr) { return fr.formId === form.id && fr.source === 'Formsort' && !!fr.submittedAt; } })
                        // 2. Invalid key in header rejected, even with a valid key in the path (header takes precedence)
                    ];
                case 4:
                    _q.sent();
                    // 2. Invalid key in header rejected, even with a valid key in the path (header takes precedence)
                    return [4 /*yield*/, async_test("Invalid API_KEY header rejected despite valid key in path", function () { return axios.post(buildUrl('formsort', TEST_API_KEY), bodyFor("fha-2"), { headers: { Authorization: "API_KEY not-a-real-key" } }); }, { shouldError: true, onError: function (e) { var _a; return ((_a = e.response) === null || _a === void 0 ? void 0 : _a.status) === 401; } })
                        // 3. Back-compat: valid key in path, no Authorization header
                    ];
                case 5:
                    // 2. Invalid key in header rejected, even with a valid key in the path (header takes precedence)
                    _q.sent();
                    return [4 /*yield*/, axios.post(buildUrl('formsort', TEST_API_KEY), bodyFor("fha-3"))];
                case 6:
                    pathAuthResult = _q.sent();
                    assert(pathAuthResult.status === 200 && !!((_e = pathAuthResult.data) === null || _e === void 0 ? void 0 : _e.formResponseId), "Path auth failed: ".concat(pathAuthResult.status, " ").concat(JSON.stringify(pathAuthResult.data)), "Path-segment API key still authenticates (no header)");
                    if ((_f = pathAuthResult.data) === null || _f === void 0 ? void 0 : _f.formResponseId)
                        formResponseIds.push(pathAuthResult.data.formResponseId);
                    return [4 /*yield*/, axios.post(buildUrl('formsort', TEST_API_KEY), bodyFor("fha-4"), { headers: { Authorization: 'Bearer unrelated-token' } })];
                case 7:
                    bearerFallthroughResult = _q.sent();
                    assert(bearerFallthroughResult.status === 200 && !!((_g = bearerFallthroughResult.data) === null || _g === void 0 ? void 0 : _g.formResponseId), "Bearer fallthrough failed: ".concat(bearerFallthroughResult.status, " ").concat(JSON.stringify(bearerFallthroughResult.data)), "Non-API_KEY Authorization scheme falls through to path key");
                    if ((_h = bearerFallthroughResult.data) === null || _h === void 0 ? void 0 : _h.formResponseId)
                        formResponseIds.push(bearerFallthroughResult.data.formResponseId);
                    // 5. No valid key in header or path
                    return [4 /*yield*/, async_test("No valid key anywhere rejected", function () { return axios.post(buildUrl('formsort', 'not-a-real-key'), bodyFor("fha-5")); }, { shouldError: true, onError: function (e) { var _a; return ((_a = e.response) === null || _a === void 0 ? void 0 : _a.status) === 401; } })
                        // 6. Alias route accepts header auth too
                    ];
                case 8:
                    // 5. No valid key in header or path
                    _q.sent();
                    return [4 /*yield*/, axios.post(buildUrl('form-ingestion', 'key-in-header'), bodyFor("fha-6"), { headers: { Authorization: "API_KEY ".concat(TEST_API_KEY) } })];
                case 9:
                    aliasResult = _q.sent();
                    assert(aliasResult.status === 200 && !!((_j = aliasResult.data) === null || _j === void 0 ? void 0 : _j.formResponseId), "form-ingestion header auth failed: ".concat(aliasResult.status, " ").concat(JSON.stringify(aliasResult.data)), "form-ingestion alias accepts API_KEY header");
                    if ((_k = aliasResult.data) === null || _k === void 0 ? void 0 : _k.formResponseId)
                        formResponseIds.push(aliasResult.data.formResponseId);
                    return [4 /*yield*/, axios.post(buildUrl('formsort', TEST_API_KEY), bodyFor("fha-7"), { headers: { Authorization: 'API_KEY' } })];
                case 10:
                    emptyValueResult = _q.sent();
                    assert(emptyValueResult.status === 200 && !!((_l = emptyValueResult.data) === null || _l === void 0 ? void 0 : _l.formResponseId), "Empty-value header fallthrough failed: ".concat(emptyValueResult.status, " ").concat(JSON.stringify(emptyValueResult.data)), "API_KEY scheme without value falls through to path key");
                    if ((_m = emptyValueResult.data) === null || _m === void 0 ? void 0 : _m.formResponseId)
                        formResponseIds.push(emptyValueResult.data.formResponseId);
                    return [4 /*yield*/, axios.post(buildUrl('formsort', TEST_API_KEY), bodyFor("fha-8"), { headers: { Authorization: 'some-opaque-token' } })];
                case 11:
                    singleTokenResult = _q.sent();
                    assert(singleTokenResult.status === 200 && !!((_o = singleTokenResult.data) === null || _o === void 0 ? void 0 : _o.formResponseId), "Single-token header fallthrough failed: ".concat(singleTokenResult.status, " ").concat(JSON.stringify(singleTokenResult.data)), "Schemeless Authorization header falls through to path key");
                    if ((_p = singleTokenResult.data) === null || _p === void 0 ? void 0 : _p.formResponseId)
                        formResponseIds.push(singleTokenResult.data.formResponseId);
                    // 9. When header and path both hold VALID keys, the header key's organization scopes the request:
                    // the formId belongs to the primary tenant, so an other-tenant header key must fail form lookup (400),
                    // proving the path key's org is not used
                    return [4 /*yield*/, async_test("Valid other-tenant header key overrides valid path key (org scoping)", function () { return axios.post(buildUrl('formsort', TEST_API_KEY), bodyFor("fha-9"), { headers: { Authorization: "API_KEY ".concat(OTHER_TENANT_API_KEY) } }); }, { shouldError: true, onError: function (e) { var _a, _b; return ((_a = e.response) === null || _a === void 0 ? void 0 : _a.status) === 400 && ((_b = e.response) === null || _b === void 0 ? void 0 : _b.data) === 'formId Invalid'; } })];
                case 12:
                    // 9. When header and path both hold VALID keys, the header key's organization scopes the request:
                    // the formId belongs to the primary tenant, so an other-tenant header key must fail form lookup (400),
                    // proving the path key's org is not used
                    _q.sent();
                    return [3 /*break*/, 27];
                case 13:
                    _i = 0, formResponseIds_1 = formResponseIds;
                    _q.label = 14;
                case 14:
                    if (!(_i < formResponseIds_1.length)) return [3 /*break*/, 19];
                    id = formResponseIds_1[_i];
                    _q.label = 15;
                case 15:
                    _q.trys.push([15, 17, , 18]);
                    return [4 /*yield*/, sdk.api.form_responses.deleteOne(id)];
                case 16:
                    _q.sent();
                    return [3 /*break*/, 18];
                case 17:
                    err_1 = _q.sent();
                    return [3 /*break*/, 18];
                case 18:
                    _i++;
                    return [3 /*break*/, 14];
                case 19:
                    _q.trys.push([19, 22, , 23]);
                    return [4 /*yield*/, sdk.api.endusers.getOne({ email: TEST_EMAIL })];
                case 20:
                    enduser = _q.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id)];
                case 21:
                    _q.sent();
                    return [3 /*break*/, 23];
                case 22:
                    err_2 = _q.sent();
                    return [3 /*break*/, 23];
                case 23:
                    _q.trys.push([23, 25, , 26]);
                    return [4 /*yield*/, sdk.api.forms.deleteOne(form.id)];
                case 24:
                    _q.sent();
                    return [3 /*break*/, 26];
                case 25:
                    err_3 = _q.sent();
                    return [3 /*break*/, 26];
                case 26: return [7 /*endfinally*/];
                case 27: return [2 /*return*/];
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
                    return [4 /*yield*/, formsort_header_auth_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ FormSort header auth tests completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ FormSort header auth tests failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=formsort_header_auth.test.js.map