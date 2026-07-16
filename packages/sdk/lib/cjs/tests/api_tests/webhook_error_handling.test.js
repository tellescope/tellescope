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
exports.webhook_error_handling_tests = void 0;
require('source-map-support').install();
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var crypto_1 = __importDefault(require("crypto"));
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || 'http://localhost:8080';
var TEST_SECRET = "this is a test secret for verifying integrity of web hooks";
var sha256 = function (s) { return crypto_1.default.createHash('sha256').update(s).digest('hex'); };
// DNS resolution for the reserved .invalid TLD always fails => axios ENOTFOUND (no err.response)
var ENOTFOUND_URL = "http://webhook-error-handling-test.invalid/hook";
var POLL_TIMEOUT_MS = 10000;
var POLL_INTERVAL_MS = 500;
var find_log_for_url = function (sdk, url) { return __awaiter(void 0, void 0, void 0, function () {
    var start, logs, match;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                start = Date.now();
                _a.label = 1;
            case 1:
                if (!(Date.now() - start < POLL_TIMEOUT_MS)) return [3 /*break*/, 4];
                return [4 /*yield*/, sdk.api.webhook_logs.getSome({ limit: 50, sort: 'newFirst' })];
            case 2:
                logs = _a.sent();
                match = logs.find(function (l) { return l.url === url; });
                if (match)
                    return [2 /*return*/, match];
                return [4 /*yield*/, (0, testing_1.wait)(undefined, POLL_INTERVAL_MS)];
            case 3:
                _a.sent();
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, null];
        }
    });
}); };
var get_failure_count = function (sdk) { return __awaiter(void 0, void 0, void 0, function () {
    var configs;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, sdk.api.webhooks.getSome()];
            case 1:
                configs = _c.sent();
                return [2 /*return*/, ((_b = (_a = configs[0]) === null || _a === void 0 ? void 0 : _a.deliveryFailureCount) !== null && _b !== void 0 ? _b : 0)];
        }
    });
}); };
// the $inc on the webhook config is fire-and-forget — poll until it lands
var wait_for_failure_count = function (sdk, expected) { return __awaiter(void 0, void 0, void 0, function () {
    var start, count;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                start = Date.now();
                count = -1;
                _a.label = 1;
            case 1:
                if (!(Date.now() - start < POLL_TIMEOUT_MS)) return [3 /*break*/, 4];
                return [4 /*yield*/, get_failure_count(sdk)];
            case 2:
                count = _a.sent();
                if (count === expected)
                    return [2 /*return*/, count];
                return [4 /*yield*/, (0, testing_1.wait)(undefined, POLL_INTERVAL_MS)];
            case 3:
                _a.sent();
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, count];
        }
    });
}); };
// Main test function that can be called independently
var webhook_error_handling_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var app, successIntegrityVerified, server, receiverBase, enduserIds, trigger_delivery, initialCount, enotfoundLog, _b, log400, _c, log500, _d, successLog, _e, configs, webhookId, _f, _i, enduserIds_1, id, _g;
        var _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    (0, testing_1.log_header)("Webhook Error Handling Tests");
                    app = (0, express_1.default)();
                    app.use(body_parser_1.default.json({ limit: '25mb' }));
                    successIntegrityVerified = false;
                    app.post('/fail-400', function (_, res) { res.status(400).json({ error: 'bad request' }); });
                    app.post('/fail-500', function (_, res) { res.status(500).json({ error: 'server error' }); });
                    app.post('/success', function (req, res) {
                        var _a = req.body, records = _a.records, timestamp = _a.timestamp, integrity = _a.integrity;
                        successIntegrityVerified = (sha256((records !== null && records !== void 0 ? records : []).map(function (r) { return r.id; }).join('') + timestamp + TEST_SECRET) === integrity);
                        res.status(200).json({});
                    });
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var s = app.listen(0, '127.0.0.1', function () { return resolve(s); });
                        })];
                case 1:
                    server = _j.sent();
                    receiverBase = "http://127.0.0.1:".concat(server.address().port);
                    enduserIds = [];
                    trigger_delivery = function (label) { return __awaiter(void 0, void 0, void 0, function () {
                        var enduser;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, sdk.api.endusers.createOne({ email: "webhook-error-".concat(label, "-").concat(Date.now(), "@tellescope.com") })];
                                case 1:
                                    enduser = _a.sent();
                                    enduserIds.push(enduser.id);
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    _j.label = 2;
                case 2:
                    _j.trys.push([2, , 25, 33]);
                    return [4 /*yield*/, (0, testing_1.async_test)('configure webhook', function () { return sdk.api.webhooks.configure({ url: ENOTFOUND_URL, secret: TEST_SECRET }); }, { shouldError: false, onResult: function () { return true; } })];
                case 3:
                    _j.sent();
                    return [4 /*yield*/, sdk.api.webhooks.update({ subscriptionUpdates: { endusers: { create: true, update: false, delete: false } } })];
                case 4:
                    _j.sent();
                    return [4 /*yield*/, get_failure_count(sdk)
                        // Scenario 1: ENOTFOUND — no HTTP response at all
                    ];
                case 5:
                    initialCount = _j.sent();
                    // Scenario 1: ENOTFOUND — no HTTP response at all
                    return [4 /*yield*/, trigger_delivery('enotfound')];
                case 6:
                    // Scenario 1: ENOTFOUND — no HTTP response at all
                    _j.sent();
                    return [4 /*yield*/, find_log_for_url(sdk, ENOTFOUND_URL)];
                case 7:
                    enotfoundLog = _j.sent();
                    (0, testing_1.assert)(!!enotfoundLog, 'no webhook_logs entry for ENOTFOUND delivery', 'ENOTFOUND failure logged to webhook_logs');
                    (0, testing_1.assert)(typeof (enotfoundLog === null || enotfoundLog === void 0 ? void 0 : enotfoundLog.response) === 'string' && enotfoundLog.response.length > 0, "expected string error message response, got: ".concat(JSON.stringify(enotfoundLog === null || enotfoundLog === void 0 ? void 0 : enotfoundLog.response)), 'ENOTFOUND log has error message as response');
                    (0, testing_1.assert)((enotfoundLog === null || enotfoundLog === void 0 ? void 0 : enotfoundLog.responseCode) === undefined, 'unexpected responseCode for ENOTFOUND', 'ENOTFOUND log has no responseCode');
                    _b = testing_1.assert;
                    return [4 /*yield*/, wait_for_failure_count(sdk, initialCount + 1)];
                case 8:
                    _b.apply(void 0, [(_j.sent()) === initialCount + 1,
                        'deliveryFailureCount not incremented after ENOTFOUND',
                        'deliveryFailureCount incremented after ENOTFOUND']);
                    // Scenario 2a: HTTP 400 from the receiver
                    return [4 /*yield*/, sdk.api.webhooks.update({ url: "".concat(receiverBase, "/fail-400") })];
                case 9:
                    // Scenario 2a: HTTP 400 from the receiver
                    _j.sent();
                    return [4 /*yield*/, trigger_delivery('http400')];
                case 10:
                    _j.sent();
                    return [4 /*yield*/, find_log_for_url(sdk, "".concat(receiverBase, "/fail-400"))];
                case 11:
                    log400 = _j.sent();
                    (0, testing_1.assert)((log400 === null || log400 === void 0 ? void 0 : log400.responseCode) === 400, "expected responseCode 400, got ".concat(log400 === null || log400 === void 0 ? void 0 : log400.responseCode), 'HTTP 400 responseCode recorded');
                    _c = testing_1.assert;
                    return [4 /*yield*/, wait_for_failure_count(sdk, initialCount + 2)];
                case 12:
                    _c.apply(void 0, [(_j.sent()) === initialCount + 2,
                        'deliveryFailureCount not incremented after HTTP 400',
                        'deliveryFailureCount incremented after HTTP 400']);
                    // Scenario 2b: HTTP 500 from the receiver
                    return [4 /*yield*/, sdk.api.webhooks.update({ url: "".concat(receiverBase, "/fail-500") })];
                case 13:
                    // Scenario 2b: HTTP 500 from the receiver
                    _j.sent();
                    return [4 /*yield*/, trigger_delivery('http500')];
                case 14:
                    _j.sent();
                    return [4 /*yield*/, find_log_for_url(sdk, "".concat(receiverBase, "/fail-500"))];
                case 15:
                    log500 = _j.sent();
                    (0, testing_1.assert)((log500 === null || log500 === void 0 ? void 0 : log500.responseCode) === 500, "expected responseCode 500, got ".concat(log500 === null || log500 === void 0 ? void 0 : log500.responseCode), 'HTTP 500 responseCode recorded');
                    _d = testing_1.assert;
                    return [4 /*yield*/, wait_for_failure_count(sdk, initialCount + 3)];
                case 16:
                    _d.apply(void 0, [(_j.sent()) === initialCount + 3,
                        'deliveryFailureCount not incremented after HTTP 500',
                        'deliveryFailureCount incremented after HTTP 500']);
                    // Scenario 3 (timeout): skipped — WEBHOOK_TIMEOUT_MS is a constant (15s), not env-overridable,
                    // and a 15s+ non-responding receiver would make this suite unacceptably slow.
                    // Covered by security/F-0155-webhook-timeout.test.ts via send_automation_webhook.
                    // Scenario 4: success path unchanged — 200 logged, counter untouched
                    return [4 /*yield*/, sdk.api.webhooks.update({ url: "".concat(receiverBase, "/success") })];
                case 17:
                    // Scenario 3 (timeout): skipped — WEBHOOK_TIMEOUT_MS is a constant (15s), not env-overridable,
                    // and a 15s+ non-responding receiver would make this suite unacceptably slow.
                    // Covered by security/F-0155-webhook-timeout.test.ts via send_automation_webhook.
                    // Scenario 4: success path unchanged — 200 logged, counter untouched
                    _j.sent();
                    return [4 /*yield*/, trigger_delivery('success')];
                case 18:
                    _j.sent();
                    return [4 /*yield*/, find_log_for_url(sdk, "".concat(receiverBase, "/success"))];
                case 19:
                    successLog = _j.sent();
                    (0, testing_1.assert)((successLog === null || successLog === void 0 ? void 0 : successLog.responseCode) === 200, "expected responseCode 200, got ".concat(successLog === null || successLog === void 0 ? void 0 : successLog.responseCode), 'success responseCode recorded');
                    (0, testing_1.assert)(successIntegrityVerified, 'integrity check failed on success delivery', 'success delivery integrity verified');
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1000)]; // allow any (erroneous) counter update to land before checking
                case 20:
                    _j.sent(); // allow any (erroneous) counter update to land before checking
                    _e = testing_1.assert;
                    return [4 /*yield*/, get_failure_count(sdk)];
                case 21:
                    _e.apply(void 0, [(_j.sent()) === initialCount + 3,
                        'deliveryFailureCount changed on successful delivery',
                        'deliveryFailureCount untouched on success']);
                    return [4 /*yield*/, sdk.api.webhooks.getSome()];
                case 22:
                    configs = _j.sent();
                    webhookId = (_h = configs[0]) === null || _h === void 0 ? void 0 : _h.id;
                    return [4 /*yield*/, sdk.api.webhooks.updateOne(webhookId, { deliveryFailureCount: 9999 }).catch(function () { })]; // may reject (readonly)
                case 23:
                    _j.sent(); // may reject (readonly)
                    _f = testing_1.assert;
                    return [4 /*yield*/, get_failure_count(sdk)];
                case 24:
                    _f.apply(void 0, [(_j.sent()) === initialCount + 3,
                        'customer was able to overwrite deliveryFailureCount',
                        'deliveryFailureCount not customer-settable']);
                    return [3 /*break*/, 33];
                case 25: 
                // stop deliveries for subsequent tests and shut down the local receiver
                return [4 /*yield*/, sdk.api.webhooks.update({ subscriptionUpdates: { endusers: { create: false, update: false, delete: false } } }).catch(function () { })];
                case 26:
                    // stop deliveries for subsequent tests and shut down the local receiver
                    _j.sent();
                    server.close();
                    _i = 0, enduserIds_1 = enduserIds;
                    _j.label = 27;
                case 27:
                    if (!(_i < enduserIds_1.length)) return [3 /*break*/, 32];
                    id = enduserIds_1[_i];
                    _j.label = 28;
                case 28:
                    _j.trys.push([28, 30, , 31]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(id)];
                case 29:
                    _j.sent();
                    return [3 /*break*/, 31];
                case 30:
                    _g = _j.sent();
                    return [3 /*break*/, 31];
                case 31:
                    _i++;
                    return [3 /*break*/, 27];
                case 32: return [7 /*endfinally*/];
                case 33: return [2 /*return*/];
            }
        });
    });
};
exports.webhook_error_handling_tests = webhook_error_handling_tests;
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
                    return [4 /*yield*/, (0, exports.webhook_error_handling_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Webhook error handling test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Webhook error handling test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=webhook_error_handling.test.js.map