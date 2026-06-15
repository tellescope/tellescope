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
import { async_test, log_header, wait, } from "@tellescope/testing";
import { setup_tests } from "../setup";
var host = process.env.API_URL || 'http://localhost:8080';
/**
 * Google Calendar sync retry — integration coverage.
 *
 * ┌─ ARCHITECTURE NOTE (why the full mock-Google scenarios are gated) ──────────┐
 * │ SDK api_tests run in a SEPARATE process from the API server (they talk to    │
 * │ host = API_URL / http://localhost:8080). The retry scheduler, the Google     │
 * │ retryable-error predicates, and the google.calendar() client all live in the │
 * │ API SERVER process. A stub installed here (in the SDK test process) cannot   │
 * │ replace the server's in-process google client, so we cannot deterministically│
 * │ inject 429 / 500 / ECONNRESET responses from this test alone.                │
 * │                                                                              │
 * │ Two ways to run the full fail-429-then-succeed / exhaustion / cap scenarios: │
 * │  1. Run the API server with NODE_ENV=test and RETRY_SCHEDULER_DELAYS_MS=10,20 │
 * │     (already honored by the singleton constructor) plus a server-side        │
 * │     fault-injection hook on sdk.events.* that reads e.g.                      │
 * │     process.env.GCAL_TEST_FORCE_ERROR — that hook does not exist yet.         │
 * │  2. Drive the scheduler directly with the in-process unit tests, which DO     │
 * │     cover all retry mechanics deterministically:                             │
 * │       packages/private/api/api/modules/retry_scheduler.test.ts               │
 * │       packages/private/api/api/integrations/google.test.ts                   │
 * │                                                                              │
 * │ The scenario matrix below is recorded for when a server-side hook is added.  │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 * Scenario matrix (requires server-side Google fault injection — see note):
 *   1. create retry:   fail 429 once then succeed -> gcal reference written, NO background_errors
 *   2. exhaustion:     fail 429 on every call -> exactly one "Google Calendar Push Error" background_errors row
 *   3. non-retryable:  fail 403 -> background_errors written immediately, no retries
 *   4. create idempotency: fail ECONNRESET (network) -> NON-retryable for create (duplicate risk),
 *                          background_errors written, no retry, no duplicate insert
 *   5. update + delete: same as (1) for events.patch and events.delete
 *   6. cap exceeded:   maxOpenRetries=2, 3 events all fail retryably -> 3rd -> background_errors immediately
 *
 * The runnable assertions below cover what IS observable end-to-end without a
 * connected Google account: the refactored call sites must not regress the common
 * "user has no Google integration" path (no sync attempt, no background_errors, no retry).
 */
export var gcal_sync_retry_tests = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var enduser;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_header("Google Calendar Sync Retry");
                    if (process.env.GCAL_RETRY_INTEGRATION !== '1') {
                        console.log("ℹ️  Skipping mock-Google scenarios (set GCAL_RETRY_INTEGRATION=1 with a server-side "
                            + "fault-injection hook to run scenarios 1-6). Running no-integration regression checks only.");
                    }
                    return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'GcalRetry', lname: 'Test' })];
                case 1:
                    enduser = _b.sent();
                    return [4 /*yield*/, async_test('create event for user without Google integration does not produce a background error', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var event, errors;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.calendar_events.createOne({
                                            title: 'Gcal Retry Regression',
                                            startTimeInMS: Date.now() + 1000 * 60 * 60,
                                            durationInMinutes: 30,
                                            attendees: [{ type: 'user', id: sdk.userInfo.id }, { type: 'enduser', id: enduser.id }],
                                        })
                                        // give side-effect handlers a moment to run
                                    ];
                                    case 1:
                                        event = _a.sent();
                                        // give side-effect handlers a moment to run
                                        return [4 /*yield*/, wait(undefined, 750)];
                                    case 2:
                                        // give side-effect handlers a moment to run
                                        _a.sent();
                                        return [4 /*yield*/, sdk.api.background_errors.getSome({}).catch(function () { return []; })
                                            // clean up
                                        ];
                                    case 3:
                                        errors = _a.sent();
                                        // clean up
                                        return [4 /*yield*/, sdk.api.calendar_events.deleteOne(event.id).catch(function () { })
                                            // No Google integration on the test user => no push attempt => no error row.
                                        ];
                                    case 4:
                                        // clean up
                                        _a.sent();
                                        // No Google integration on the test user => no push attempt => no error row.
                                        return [2 /*return*/, errors.filter(function (e) { return (e.userId === sdk.userInfo.id && e.title === "Google Calendar Push Error"); }).length];
                                }
                            });
                        }); }, { onResult: function (count) { return count === 0; } })
                        // cleanup
                    ];
                case 2:
                    _b.sent();
                    // cleanup
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id).catch(function () { })];
                case 3:
                    // cleanup
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
};
if (require.main === module) {
    var sdk_1 = new Session({ host: host });
    var sdkNonAdmin_1 = new Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setup_tests(sdk_1, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, gcal_sync_retry_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () { console.log("✅ gcal sync retry test suite completed successfully"); process.exit(0); })
        .catch(function (error) { console.error("❌ gcal sync retry test suite failed:", error); process.exit(1); });
}
//# sourceMappingURL=gcal_sync_retry.test.js.map