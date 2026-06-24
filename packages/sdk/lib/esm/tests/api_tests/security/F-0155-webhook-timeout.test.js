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
import http from "http";
import { Session } from "../../../sdk";
import { async_test, log_header, } from "@tellescope/testing";
import { setup_tests } from "../../setup";
var host = process.env.API_URL || 'http://localhost:8080';
// The server-side axios timeout is 15s (F-0155 fix). We bound our own wait above that.
var CLIENT_WAIT_MS = 20000;
/**
 * Regression test for F-0155
 * (security-audit/findings/F-0155-outbound-webhook-no-timeout-slow-loris.md).
 *
 * Outbound webhook delivery used axios.post(url, ...) with no `timeout` (axios default = infinite).
 * A tenant-controlled receiver that accepts the connection and never responds hangs the awaited
 * request indefinitely (slow-loris → worker exhaustion). Fix: timeout: 15_000 on the axios calls.
 *
 * Repro: stand up a local HTTP server that accepts the connection but NEVER responds, point
 * send_automation_webhook (which awaits the axios call) at it, and race the call against a 20s
 * client timer.
 *   - green (fixed):  server times out at ~15s → handler returns 400 → SDK call rejects < 20s
 *   - red  (unfixed): the call is still pending at 20s → client timer wins
 */
export var webhook_timeout_tests = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var enduserId, slowServer, port, blackholeUrl_1, enduser_1, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    log_header("F-0155: outbound webhook timeout");
                    slowServer = http.createServer(function () { });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, , 5, 10]);
                    return [4 /*yield*/, new Promise(function (resolve) { return slowServer.listen(0, '127.0.0.1', function () { return resolve(); }); })];
                case 2:
                    _c.sent();
                    port = slowServer.address().port;
                    blackholeUrl_1 = "http://127.0.0.1:".concat(port, "/hook");
                    return [4 /*yield*/, sdk.api.endusers.createOne({ email: "f0155-".concat(Date.now(), "@example.com"), fname: 'F0155', lname: 'Webhook' })];
                case 3:
                    enduser_1 = _c.sent();
                    enduserId = enduser_1.id;
                    return [4 /*yield*/, async_test('F-0155: outbound webhook to a non-responding receiver times out server-side (does not hang)', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var start, outcome;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        start = Date.now();
                                        return [4 /*yield*/, Promise.race([
                                                sdk.api.webhooks.send_automation_webhook({
                                                    enduserId: enduser_1.id,
                                                    action: { info: { url: blackholeUrl_1 } },
                                                }).then(function () { return 'completed'; }).catch(function () { return 'errored'; }),
                                                new Promise(function (r) { return setTimeout(function () { return r('client-timeout'); }, CLIENT_WAIT_MS); }),
                                            ])];
                                    case 1:
                                        outcome = _a.sent();
                                        return [2 /*return*/, { outcome: outcome, elapsed: Date.now() - start }];
                                }
                            });
                        }); }, 
                        // green: the server-side axios timeout fired (call settled) before our 20s client wait
                        { onResult: function (r) { return r.outcome !== 'client-timeout' && r.elapsed < CLIENT_WAIT_MS; } })];
                case 4:
                    _c.sent();
                    return [3 /*break*/, 10];
                case 5:
                    slowServer.close();
                    if (!enduserId) return [3 /*break*/, 9];
                    _c.label = 6;
                case 6:
                    _c.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduserId)];
                case 7:
                    _c.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _b = _c.sent();
                    return [3 /*break*/, 9];
                case 9: return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    });
};
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
                    return [4 /*yield*/, webhook_timeout_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ F-0155 webhook timeout test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ F-0155 webhook timeout test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=F-0155-webhook-timeout.test.js.map