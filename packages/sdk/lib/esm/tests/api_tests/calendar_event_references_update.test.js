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
import { Session, EnduserSession } from "../../sdk";
import { async_test, log_header, } from "@tellescope/testing";
import { setup_tests, authenticate_enduser_via_token } from "../setup";
var host = process.env.API_URL || 'http://localhost:8080';
var businessId = '60398b1131a295e64f084ff6';
/**
 * CU-86e2dvrn9: calendar_events.references switched from updatesDisabled to
 * enduserUpdatesDisabled (schema.ts), mirroring the Enduser references behavior:
 *   - staff / API-key sessions may update references (e.g. to set or clear
 *     external appointment IDs like stale Elation references)
 *   - enduser (patient) sessions remain blocked — required because endusers DO
 *     have update access on calendar_events they attend (for cancelling)
 */
export var calendar_event_references_update_tests = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var enduserId, eventId, enduser, event_1, enduserSDK_1, staffReferences_1, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    log_header("Calendar Event References Update (enduserUpdatesDisabled)");
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, , 10, 19]);
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            email: "references-update-".concat(Date.now(), "@example.com"),
                            fname: 'References',
                            lname: 'UpdateTest',
                        })];
                case 2:
                    enduser = _d.sent();
                    enduserId = enduser.id;
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: "References Update Test Event",
                            durationInMinutes: 30,
                            startTimeInMS: Date.now(),
                            attendees: [{ id: enduser.id, type: 'enduser' }],
                        })];
                case 3:
                    event_1 = _d.sent();
                    eventId = event_1.id;
                    enduserSDK_1 = new EnduserSession({ host: host, businessId: businessId });
                    return [4 /*yield*/, authenticate_enduser_via_token(sdk, enduserSDK_1, { id: enduser.id })
                        // ---- Staff/API session can update references ----
                    ];
                case 4:
                    _d.sent();
                    staffReferences_1 = [{ type: 'Elation', id: 'elation-appointment-123' }];
                    return [4 /*yield*/, async_test('staff can update calendar_events.references', function () { return sdk.api.calendar_events.updateOne(event_1.id, { references: staffReferences_1 }); }, { onResult: function (e) { var _a; return ((_a = e.references) === null || _a === void 0 ? void 0 : _a.length) === 1 && e.references[0].type === 'Elation' && e.references[0].id === 'elation-appointment-123'; } })];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, async_test('staff references update persisted', function () { return sdk.api.calendar_events.getOne(event_1.id); }, { onResult: function (e) { var _a; return ((_a = e.references) === null || _a === void 0 ? void 0 : _a.length) === 1 && e.references[0].type === 'Elation' && e.references[0].id === 'elation-appointment-123'; } })
                        // ---- Enduser session (attendee with update access) is still blocked on references ----
                    ];
                case 6:
                    _d.sent();
                    // ---- Enduser session (attendee with update access) is still blocked on references ----
                    return [4 /*yield*/, async_test('enduser cannot update calendar_events.references', function () { return enduserSDK_1.api.calendar_events.updateOne(event_1.id, { references: [{ type: 'Attacker', id: 'attacker-reference' }] }); }, { shouldError: true, onError: function (e) { return e.message === "references cannot be updated by endusers"; } })];
                case 7:
                    // ---- Enduser session (attendee with update access) is still blocked on references ----
                    _d.sent();
                    return [4 /*yield*/, async_test('rejected enduser references update did not persist', function () { return sdk.api.calendar_events.getOne(event_1.id); }, { onResult: function (e) { var _a; return ((_a = e.references) === null || _a === void 0 ? void 0 : _a.length) === 1 && e.references[0].type === 'Elation' && e.references[0].id === 'elation-appointment-123'; } })
                        // ---- Positive control: the guard is field-scoped — enduser can still cancel the event ----
                    ];
                case 8:
                    _d.sent();
                    // ---- Positive control: the guard is field-scoped — enduser can still cancel the event ----
                    return [4 /*yield*/, async_test('enduser can still perform allowed update (cancelledAt)', function () { return enduserSDK_1.api.calendar_events.updateOne(event_1.id, { cancelledAt: new Date() }); }, { onResult: function (e) { return !!e.cancelledAt; } })];
                case 9:
                    // ---- Positive control: the guard is field-scoped — enduser can still cancel the event ----
                    _d.sent();
                    return [3 /*break*/, 19];
                case 10:
                    if (!eventId) return [3 /*break*/, 14];
                    _d.label = 11;
                case 11:
                    _d.trys.push([11, 13, , 14]);
                    return [4 /*yield*/, sdk.api.calendar_events.deleteOne(eventId)];
                case 12:
                    _d.sent();
                    return [3 /*break*/, 14];
                case 13:
                    _b = _d.sent();
                    return [3 /*break*/, 14];
                case 14:
                    if (!enduserId) return [3 /*break*/, 18];
                    _d.label = 15;
                case 15:
                    _d.trys.push([15, 17, , 18]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduserId)];
                case 16:
                    _d.sent();
                    return [3 /*break*/, 18];
                case 17:
                    _c = _d.sent();
                    return [3 /*break*/, 18];
                case 18: return [7 /*endfinally*/];
                case 19: return [2 /*return*/];
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
                    return [4 /*yield*/, calendar_event_references_update_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Calendar event references update test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Calendar event references update test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=calendar_event_references_update.test.js.map