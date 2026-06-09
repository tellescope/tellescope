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
import { Session } from "../../sdk";
import { assert, log_header, } from "@tellescope/testing";
import { setup_tests } from "../setup";
var host = process.env.API_URL || 'http://localhost:8080';
var mdiUrl = "".concat(host, "/v1/webhooks/mdi");
/**
 * POST a JSON payload to the MDI webhook endpoint with optional auth/signature headers.
 */
var postMDI = function (body, headers) {
    if (headers === void 0) { headers = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var res, data, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fetch(mdiUrl, {
                        method: 'POST',
                        headers: __assign({ 'Content-Type': 'application/json' }, headers),
                        body: JSON.stringify(body),
                    })];
                case 1:
                    res = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, res.text()];
                case 3:
                    data = _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _a = _b.sent();
                    data = null;
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, { status: res.status, data: data }];
            }
        });
    });
};
/**
 * MD Integrations Webhooks Tests
 *
 * The inbound endpoint is security-first: it authenticates the tenant via the
 * static Authorization token BEFORE any DB write or side effect. These tests
 * assert those rejection paths, which don't require a configured MDI integration.
 *
 * NOTE: a full event round-trip (case_approved -> mdiStatus, offering_submitted
 * -> enduser_medications, message_created -> chat, etc.) requires an MDI
 * integration row carrying the Authorization token in webhooksSecret.
 * That row can only be created through the connect flow against valid MDI
 * Sandbox credentials (add_api_key_integration validates client creds via a live
 * MDI API call), so the end-to-end path is exercised in the Sandbox per the task
 * plan rather than here.
 */
export var mdi_webhooks_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var status_1, status_2, status_3, status_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_header("MD Integrations Webhooks Tests");
                    return [4 /*yield*/, postMDI({ event_type: 'case_approved', case_id: 'mdi-case-test-1' })];
                case 1:
                    status_1 = (_b.sent()).status;
                    assert(status_1 === 401, "missing Authorization should 401 (got ".concat(status_1, ")"), "MDI webhook rejects missing Authorization");
                    return [4 /*yield*/, postMDI({ event_type: 'case_approved', case_id: 'mdi-case-test-1' }, { 'Authorization': "Bearer not-a-real-mdi-token-".concat(Date.now()) })];
                case 2:
                    status_2 = (_b.sent()).status;
                    assert(status_2 === 401, "unknown Authorization should 401 (got ".concat(status_2, ")"), "MDI webhook rejects unknown Authorization");
                    return [4 /*yield*/, postMDI({ case_id: 'mdi-case-test-1' }, { 'Authorization': "Bearer not-a-real-mdi-token-".concat(Date.now()) })];
                case 3:
                    status_3 = (_b.sent()).status;
                    assert(status_3 === 400 || status_3 === 401, "missing event_type should 400/401 (got ".concat(status_3, ")"), "MDI webhook rejects payload without event_type");
                    return [4 /*yield*/, postMDI({ event_type: 'message_created', patient_id: 'mdi-patient-x', message_id: 'm-1', user_type: 'App\\Models\\User' }, { 'Authorization': "Bearer not-a-real-mdi-token-".concat(Date.now()) })];
                case 4:
                    status_4 = (_b.sent()).status;
                    assert(status_4 === 401, "message_created with bad auth should 401 (got ".concat(status_4, ")"), "MDI webhook authenticates before patient lookup");
                    return [2 /*return*/];
            }
        });
    });
};
// Allow running this test file independently
if (require.main === module) {
    var sdk_1 = new Session({ host: host });
    var sdkNonAdmin_1 = new Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setup_tests(sdk_1, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, mdi_webhooks_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ MD Integrations webhooks test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ MD Integrations webhooks test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=mdi_webhooks.test.js.map