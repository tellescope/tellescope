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
var HEALTHIE_TITLE = 'Healthie'; // mirror @tellescope/constants HEALTHIE_TITLE
// Unreachable webhook target — the request will fail quickly but the API still writes
// the resolved payload to webhook_logs, which is what we're verifying.
var WEBHOOK_TARGET_URL = 'http://127.0.0.1:9';
var find_log_for_url = function (sdk, url, expectedHealthieId) { return __awaiter(void 0, void 0, void 0, function () {
    var start, logs, match;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                start = Date.now();
                _a.label = 1;
            case 1:
                if (!(Date.now() - start < 10000)) return [3 /*break*/, 4];
                return [4 /*yield*/, sdk.api.webhook_logs.getSome({ limit: 50, sort: 'newFirst' })];
            case 2:
                logs = _a.sent();
                match = logs.find(function (l) { var _a; return l.url === url && ((_a = l.payload) === null || _a === void 0 ? void 0 : _a.healthieId) === expectedHealthieId; });
                if (match)
                    return [2 /*return*/, match];
                return [4 /*yield*/, wait(undefined, 500)];
            case 3:
                _a.sent();
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, null];
        }
    });
}); };
// Main test function that can be called independently
export var calendar_event_webhook_template_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var enduser, externalIdEvent, referencesEvent, journey, step, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    log_header("Calendar Event Webhook Template Tests");
                    return [4 /*yield*/, sdk.api.endusers.createOne({})
                        // Case 1: Healthie ID resolved via source + externalId
                    ];
                case 1:
                    enduser = _g.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'External ID Calendar Event',
                            durationInMinutes: 30,
                            startTimeInMS: Date.now(),
                            attendees: [{ type: 'enduser', id: enduser.id }],
                            source: HEALTHIE_TITLE,
                            externalId: 'evt_HEALTHIE_123',
                        })
                        // Case 2: Healthie ID resolved via references
                    ];
                case 2:
                    externalIdEvent = _g.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'References Calendar Event',
                            durationInMinutes: 30,
                            startTimeInMS: Date.now(),
                            attendees: [{ type: 'enduser', id: enduser.id }],
                            references: [{ type: HEALTHIE_TITLE, id: 'evt_REF_456' }],
                        })
                        // create an automation step to satisfy schema validation (automationStepId is required)
                    ];
                case 3:
                    referencesEvent = _g.sent();
                    return [4 /*yield*/, sdk.api.journeys.createOne({
                            title: 'Calendar Event Webhook Template Tests',
                            defaultState: 'State 1',
                        })];
                case 4:
                    journey = _g.sent();
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: journey.id,
                            events: [{ type: 'onJourneyStart', info: {} }],
                            action: {
                                type: 'sendWebhook',
                                info: {
                                    message: 'placeholder',
                                    url: WEBHOOK_TARGET_URL,
                                },
                            },
                        })];
                case 5:
                    step = _g.sent();
                    _g.label = 6;
                case 6:
                    _g.trys.push([6, , 10, 26]);
                    return [4 /*yield*/, async_test('Send Webhook resolves {{calendar_event.Healthie ID}} from source+externalId', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var url, log, payload;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        url = "".concat(WEBHOOK_TARGET_URL, "/external/").concat(externalIdEvent.id);
                                        return [4 /*yield*/, sdk.api.webhooks.send_automation_webhook({
                                                message: 'placeholder',
                                                enduserId: enduser.id,
                                                automationStepId: step.id,
                                                action: {
                                                    type: 'sendWebhook',
                                                    info: {
                                                        message: 'placeholder',
                                                        url: url,
                                                        fields: [
                                                            { field: 'healthieId', value: '{{calendar_event.Healthie ID}}' },
                                                            { field: 'title', value: '{{calendar_event.title}}' },
                                                        ],
                                                    },
                                                },
                                                context: { calendarEventId: externalIdEvent.id },
                                            }).catch(function () { })]; // the unreachable URL is expected to error after logging
                                    case 1:
                                        _a.sent(); // the unreachable URL is expected to error after logging
                                        return [4 /*yield*/, find_log_for_url(sdk, url, 'evt_HEALTHIE_123')];
                                    case 2:
                                        log = _a.sent();
                                        if (!log)
                                            return [2 /*return*/, false];
                                        payload = log.payload;
                                        return [2 /*return*/, (payload === null || payload === void 0 ? void 0 : payload.healthieId) === 'evt_HEALTHIE_123'
                                                && (payload === null || payload === void 0 ? void 0 : payload.title) === externalIdEvent.title];
                                }
                            });
                        }); }, { onResult: function (r) { return r === true; } })];
                case 7:
                    _g.sent();
                    return [4 /*yield*/, async_test('Send Webhook resolves {{calendar_event.Healthie ID}} from references', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var url, log, payload;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        url = "".concat(WEBHOOK_TARGET_URL, "/refs/").concat(referencesEvent.id);
                                        return [4 /*yield*/, sdk.api.webhooks.send_automation_webhook({
                                                message: 'placeholder',
                                                enduserId: enduser.id,
                                                automationStepId: step.id,
                                                action: {
                                                    type: 'sendWebhook',
                                                    info: {
                                                        message: 'placeholder',
                                                        url: url,
                                                        fields: [
                                                            { field: 'healthieId', value: '{{calendar_event.Healthie ID}}' },
                                                            { field: 'title', value: '{{calendar_event.title}}' },
                                                        ],
                                                    },
                                                },
                                                context: { calendarEventId: referencesEvent.id },
                                            }).catch(function () { })];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, find_log_for_url(sdk, url, 'evt_REF_456')];
                                    case 2:
                                        log = _a.sent();
                                        if (!log)
                                            return [2 /*return*/, false];
                                        payload = log.payload;
                                        return [2 /*return*/, (payload === null || payload === void 0 ? void 0 : payload.healthieId) === 'evt_REF_456'
                                                && (payload === null || payload === void 0 ? void 0 : payload.title) === referencesEvent.title];
                                }
                            });
                        }); }, { onResult: function (r) { return r === true; } })];
                case 8:
                    _g.sent();
                    return [4 /*yield*/, async_test('Send Webhook leaves {{calendar_event.Healthie ID}} blank when no calendarEventId in context', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var url, start, logs, match, payload;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        url = "".concat(WEBHOOK_TARGET_URL, "/nocontext");
                                        return [4 /*yield*/, sdk.api.webhooks.send_automation_webhook({
                                                message: 'placeholder',
                                                enduserId: enduser.id,
                                                automationStepId: step.id,
                                                action: {
                                                    type: 'sendWebhook',
                                                    info: {
                                                        message: 'placeholder',
                                                        url: url,
                                                        fields: [
                                                            { field: 'healthieId', value: '{{calendar_event.Healthie ID}}' },
                                                        ],
                                                    },
                                                },
                                                // no calendarEventId
                                            }).catch(function () { })
                                            // Without a calendar event in context, the templating helper returns the input
                                            // unchanged, so the literal template string remains in the payload.
                                        ];
                                    case 1:
                                        _a.sent();
                                        start = Date.now();
                                        _a.label = 2;
                                    case 2:
                                        if (!(Date.now() - start < 10000)) return [3 /*break*/, 5];
                                        return [4 /*yield*/, sdk.api.webhook_logs.getSome({ limit: 50, sort: 'newFirst' })];
                                    case 3:
                                        logs = _a.sent();
                                        match = logs.find(function (l) { return l.url === url; });
                                        if (match) {
                                            payload = match.payload;
                                            return [2 /*return*/, (payload === null || payload === void 0 ? void 0 : payload.healthieId) === '{{calendar_event.Healthie ID}}'];
                                        }
                                        return [4 /*yield*/, wait(undefined, 500)];
                                    case 4:
                                        _a.sent();
                                        return [3 /*break*/, 2];
                                    case 5: return [2 /*return*/, false];
                                }
                            });
                        }); }, { onResult: function (r) { return r === true; } })];
                case 9:
                    _g.sent();
                    return [3 /*break*/, 26];
                case 10:
                    _g.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, sdk.api.calendar_events.deleteOne(externalIdEvent.id)];
                case 11:
                    _g.sent();
                    return [3 /*break*/, 13];
                case 12:
                    _b = _g.sent();
                    return [3 /*break*/, 13];
                case 13:
                    _g.trys.push([13, 15, , 16]);
                    return [4 /*yield*/, sdk.api.calendar_events.deleteOne(referencesEvent.id)];
                case 14:
                    _g.sent();
                    return [3 /*break*/, 16];
                case 15:
                    _c = _g.sent();
                    return [3 /*break*/, 16];
                case 16:
                    _g.trys.push([16, 18, , 19]);
                    return [4 /*yield*/, sdk.api.automation_steps.deleteOne(step.id)];
                case 17:
                    _g.sent();
                    return [3 /*break*/, 19];
                case 18:
                    _d = _g.sent();
                    return [3 /*break*/, 19];
                case 19:
                    _g.trys.push([19, 21, , 22]);
                    return [4 /*yield*/, sdk.api.journeys.deleteOne(journey.id)];
                case 20:
                    _g.sent();
                    return [3 /*break*/, 22];
                case 21:
                    _e = _g.sent();
                    return [3 /*break*/, 22];
                case 22:
                    _g.trys.push([22, 24, , 25]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id)];
                case 23:
                    _g.sent();
                    return [3 /*break*/, 25];
                case 24:
                    _f = _g.sent();
                    return [3 /*break*/, 25];
                case 25: return [7 /*endfinally*/];
                case 26: return [2 /*return*/];
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
                    return [4 /*yield*/, calendar_event_webhook_template_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Calendar event webhook template test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Calendar event webhook template test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=calendar_event_webhook_template.test.js.map