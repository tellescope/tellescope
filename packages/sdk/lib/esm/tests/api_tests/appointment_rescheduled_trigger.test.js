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
import { Session } from "../../sdk";
import { log_header, wait, async_test } from "@tellescope/testing";
import { setup_tests } from "../setup";
var host = process.env.TEST_HOST || "http://localhost:8080";
export var appointment_rescheduled_trigger_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var t1, t2, t3, t4, enduser1, enduser2, enduser3, enduser4, enduser5, enduser6, enduser7, enduser8, enduser9, enduser10, enduser11, enduser12, event1, event2, event3, originalTime, newTime, event4, event5, event6, event7, event8, event9, event10, event11a, event11b;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_header("Automation Trigger Tests (Appointment Rescheduled)");
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Appointment Rescheduled', info: {} },
                            action: { type: 'Add Tags', info: { tags: ['Rescheduled - Any'] } },
                            status: 'Active',
                            title: "Rescheduled - Any"
                        })];
                case 1:
                    t1 = _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Appointment Rescheduled', info: { titles: ['Test Appointment'] } },
                            action: { type: 'Add Tags', info: { tags: ['Rescheduled - By Title'] } },
                            status: 'Active',
                            title: "Rescheduled - By Title"
                        })
                        // Create trigger for manual reschedule detection (off by default)
                    ];
                case 2:
                    t2 = _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Appointment Rescheduled', info: { detectManualReschedules: true } },
                            action: { type: 'Add Tags', info: { tags: ['Manual Reschedule - Any'] } },
                            status: 'Active',
                            title: "Manual Reschedule - Any"
                        })
                        // Create trigger for manual reschedule detection with title filter
                    ];
                case 3:
                    t3 = _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Appointment Rescheduled', info: { titles: ['Test Appointment'], detectManualReschedules: true } },
                            action: { type: 'Add Tags', info: { tags: ['Manual Reschedule - By Title'] } },
                            status: 'Active',
                            title: "Manual Reschedule - By Title"
                        })
                        // Create separate endusers to avoid trigger throttling (1 minute per trigger per enduser)
                    ];
                case 4:
                    t4 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 5:
                    enduser1 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 6:
                    enduser2 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 7:
                    enduser3 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 8:
                    enduser4 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 9:
                    enduser5 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 10:
                    enduser6 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 11:
                    enduser7 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 12:
                    enduser8 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 13:
                    enduser9 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 14:
                    enduser10 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 15:
                    enduser11 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})
                        // ===== TRADITIONAL RESCHEDULE TESTS (with rescheduledAt) =====
                    ];
                case 16:
                    enduser12 = _b.sent();
                    // ===== TRADITIONAL RESCHEDULE TESTS (with rescheduledAt) =====
                    log_header("Traditional Reschedule Tests (rescheduledAt)");
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Test Appointment',
                            durationInMinutes: 30,
                            startTimeInMS: Date.now(),
                            attendees: [{ type: 'enduser', id: enduser1.id }]
                        })];
                case 17:
                    event1 = _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)]; // ensure no initial triggers
                case 18:
                    _b.sent(); // ensure no initial triggers
                    return [4 /*yield*/, async_test("No initial triggers for normal appointment", function () { return sdk.api.endusers.getOne(enduser1.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } })
                        // Now update to mark as rescheduled
                    ];
                case 19:
                    _b.sent();
                    // Now update to mark as rescheduled
                    return [4 /*yield*/, sdk.api.calendar_events.updateOne(event1.id, { rescheduledAt: new Date() })];
                case 20:
                    // Now update to mark as rescheduled
                    _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)]; // allow update triggers to happen
                case 21:
                    _b.sent(); // allow update triggers to happen
                    return [4 /*yield*/, async_test("Update to rescheduled triggers automation", function () { return sdk.api.endusers.getOne(enduser1.id); }, { onResult: function (e) {
                                var _a;
                                return ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 4
                                    && e.tags.includes('Rescheduled - Any')
                                    && e.tags.includes('Rescheduled - By Title')
                                    && e.tags.includes('Manual Reschedule - Any')
                                    && e.tags.includes('Manual Reschedule - By Title');
                            }
                        })
                        // Test 2: Update cancelled event to add rescheduledAt (should still trigger)
                    ];
                case 22:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Test Appointment',
                            durationInMinutes: 30,
                            startTimeInMS: Date.now(),
                            attendees: [{ type: 'enduser', id: enduser2.id }],
                            cancelledAt: new Date() // Start with cancelled appointment
                        })];
                case 23:
                    event2 = _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)
                        // Now update to mark as rescheduled (cancelled + rescheduled is valid)
                    ];
                case 24:
                    _b.sent();
                    // Now update to mark as rescheduled (cancelled + rescheduled is valid)
                    return [4 /*yield*/, sdk.api.calendar_events.updateOne(event2.id, { rescheduledAt: new Date() })];
                case 25:
                    // Now update to mark as rescheduled (cancelled + rescheduled is valid)
                    _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)]; // allow update triggers to happen
                case 26:
                    _b.sent(); // allow update triggers to happen
                    return [4 /*yield*/, async_test("Cancelled + rescheduled appointment triggers automation", function () { return sdk.api.endusers.getOne(enduser2.id); }, { onResult: function (e) {
                                var _a;
                                return ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 4
                                    && e.tags.includes('Rescheduled - Any')
                                    && e.tags.includes('Rescheduled - By Title')
                                    && e.tags.includes('Manual Reschedule - Any')
                                    && e.tags.includes('Manual Reschedule - By Title');
                            }
                        })
                        // Test 3: Update with different title (should only trigger 'Any' automation)
                    ];
                case 27:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Different Title',
                            durationInMinutes: 30,
                            startTimeInMS: Date.now(),
                            attendees: [{ type: 'enduser', id: enduser3.id }]
                        })];
                case 28:
                    event3 = _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)
                        // Update to mark as rescheduled
                    ];
                case 29:
                    _b.sent();
                    // Update to mark as rescheduled
                    return [4 /*yield*/, sdk.api.calendar_events.updateOne(event3.id, { rescheduledAt: new Date() })];
                case 30:
                    // Update to mark as rescheduled
                    _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 31:
                    _b.sent();
                    return [4 /*yield*/, async_test("Traditional reschedule with different title only triggers 'Any' automation", function () { return sdk.api.endusers.getOne(enduser3.id); }, { onResult: function (e) {
                                var _a;
                                return ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 2
                                    && e.tags.includes('Rescheduled - Any')
                                    && e.tags.includes('Manual Reschedule - Any')
                                    && !e.tags.includes('Rescheduled - By Title') // title doesn't match
                                    && !e.tags.includes('Manual Reschedule - By Title');
                            } // title doesn't match
                        })
                        // ===== MANUAL RESCHEDULE TESTS (startTimeInMS changes) =====
                    ];
                case 32:
                    _b.sent();
                    // ===== MANUAL RESCHEDULE TESTS (startTimeInMS changes) =====
                    log_header("Manual Reschedule Tests (startTimeInMS changes)");
                    originalTime = Date.now() + 86400000 // 1 day from now
                    ;
                    newTime = originalTime + 3600000 // 1 hour later
                    ;
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Test Appointment',
                            durationInMinutes: 30,
                            startTimeInMS: originalTime,
                            attendees: [{ type: 'enduser', id: enduser4.id }]
                        })];
                case 33:
                    event4 = _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)]; // ensure no initial triggers
                case 34:
                    _b.sent(); // ensure no initial triggers
                    return [4 /*yield*/, async_test("No initial triggers for normal appointment", function () { return sdk.api.endusers.getOne(enduser4.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } })
                        // Now update startTimeInMS to trigger manual reschedule detection
                    ];
                case 35:
                    _b.sent();
                    // Now update startTimeInMS to trigger manual reschedule detection
                    return [4 /*yield*/, sdk.api.calendar_events.updateOne(event4.id, { startTimeInMS: newTime })];
                case 36:
                    // Now update startTimeInMS to trigger manual reschedule detection
                    _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)]; // allow update triggers to happen
                case 37:
                    _b.sent(); // allow update triggers to happen
                    return [4 /*yield*/, async_test("Manual reschedule (startTimeInMS change) triggers automation", function () { return sdk.api.endusers.getOne(enduser4.id); }, { onResult: function (e) {
                                var _a;
                                return ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 2
                                    && e.tags.includes('Manual Reschedule - Any')
                                    && e.tags.includes('Manual Reschedule - By Title');
                            }
                        })
                        // Test 5: Regular trigger should NOT fire for manual reschedule (no detectManualReschedules)
                    ];
                case 38:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Different Title',
                            durationInMinutes: 30,
                            startTimeInMS: originalTime,
                            attendees: [{ type: 'enduser', id: enduser5.id }]
                        })];
                case 39:
                    event5 = _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)
                        // Update startTimeInMS - should only trigger manual reschedule triggers
                    ];
                case 40:
                    _b.sent();
                    // Update startTimeInMS - should only trigger manual reschedule triggers
                    return [4 /*yield*/, sdk.api.calendar_events.updateOne(event5.id, { startTimeInMS: newTime })];
                case 41:
                    // Update startTimeInMS - should only trigger manual reschedule triggers
                    _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 42:
                    _b.sent();
                    return [4 /*yield*/, async_test("Manual reschedule with different title only triggers 'Any' automation", function () { return sdk.api.endusers.getOne(enduser5.id); }, { onResult: function (e) {
                                var _a;
                                return ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 1
                                    && e.tags.includes('Manual Reschedule - Any')
                                    && !e.tags.includes('Manual Reschedule - By Title') // title doesn't match
                                    && !e.tags.includes('Rescheduled - Any') // no detectManualReschedules
                                    && !e.tags.includes('Rescheduled - By Title');
                            } // no detectManualReschedules
                        })
                        // Test 6: Manual reschedule with rescheduledAt already set (should NOT trigger manual reschedule)
                    ];
                case 43:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Test Appointment',
                            durationInMinutes: 30,
                            startTimeInMS: originalTime,
                            attendees: [{ type: 'enduser', id: enduser6.id }]
                        })];
                case 44:
                    event6 = _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)
                        // First, mark as rescheduled (traditional reschedule)
                    ];
                case 45:
                    _b.sent();
                    // First, mark as rescheduled (traditional reschedule)
                    return [4 /*yield*/, sdk.api.calendar_events.updateOne(event6.id, { rescheduledAt: new Date() })];
                case 46:
                    // First, mark as rescheduled (traditional reschedule)
                    _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 47:
                    _b.sent();
                    return [4 /*yield*/, async_test("Traditional reschedule triggers all automation", function () { return sdk.api.endusers.getOne(enduser6.id); }, { onResult: function (e) {
                                var _a;
                                return ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 4
                                    && e.tags.includes('Rescheduled - Any')
                                    && e.tags.includes('Rescheduled - By Title')
                                    && e.tags.includes('Manual Reschedule - Any')
                                    && e.tags.includes('Manual Reschedule - By Title');
                            }
                        })
                        // Clear tags for next test
                    ];
                case 48:
                    _b.sent();
                    // Clear tags for next test
                    return [4 /*yield*/, sdk.api.endusers.updateOne(enduser6.id, { tags: [] }, { replaceObjectFields: true })];
                case 49:
                    // Clear tags for next test
                    _b.sent();
                    return [4 /*yield*/, wait(undefined, 100)
                        // Now update startTimeInMS - should NOT trigger manual reschedule (already has rescheduledAt)
                    ];
                case 50:
                    _b.sent();
                    // Now update startTimeInMS - should NOT trigger manual reschedule (already has rescheduledAt)
                    return [4 /*yield*/, sdk.api.calendar_events.updateOne(event6.id, { startTimeInMS: newTime })];
                case 51:
                    // Now update startTimeInMS - should NOT trigger manual reschedule (already has rescheduledAt)
                    _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 52:
                    _b.sent();
                    return [4 /*yield*/, async_test("Manual reschedule with existing rescheduledAt does NOT trigger manual automation", function () { return sdk.api.endusers.getOne(enduser6.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } } // No tags should be added
                        )
                        // Test 7: Manual reschedule with cancelled event (should NOT trigger)
                    ];
                case 53:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Test Appointment',
                            durationInMinutes: 30,
                            startTimeInMS: originalTime,
                            attendees: [{ type: 'enduser', id: enduser7.id }],
                            cancelledAt: new Date() // Cancelled appointment
                        })];
                case 54:
                    event7 = _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)
                        // Update startTimeInMS - should NOT trigger (cancelled)
                    ];
                case 55:
                    _b.sent();
                    // Update startTimeInMS - should NOT trigger (cancelled)
                    return [4 /*yield*/, sdk.api.calendar_events.updateOne(event7.id, { startTimeInMS: newTime })];
                case 56:
                    // Update startTimeInMS - should NOT trigger (cancelled)
                    _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 57:
                    _b.sent();
                    return [4 /*yield*/, async_test("Manual reschedule of cancelled appointment does NOT trigger automation", function () { return sdk.api.endusers.getOne(enduser7.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } })
                        // Test 8: Manual reschedule with no-show event (should NOT trigger)
                    ];
                case 58:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Test Appointment',
                            durationInMinutes: 30,
                            startTimeInMS: originalTime,
                            attendees: [{ type: 'enduser', id: enduser8.id }],
                            noShowedAt: new Date() // No-show appointment
                        })];
                case 59:
                    event8 = _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)
                        // Update startTimeInMS - should NOT trigger (no-show)
                    ];
                case 60:
                    _b.sent();
                    // Update startTimeInMS - should NOT trigger (no-show)
                    return [4 /*yield*/, sdk.api.calendar_events.updateOne(event8.id, { startTimeInMS: newTime })];
                case 61:
                    // Update startTimeInMS - should NOT trigger (no-show)
                    _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 62:
                    _b.sent();
                    return [4 /*yield*/, async_test("Manual reschedule of no-show appointment does NOT trigger automation", function () { return sdk.api.endusers.getOne(enduser8.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } })
                        // Test 9: Same startTimeInMS update (should NOT trigger)
                    ];
                case 63:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Test Appointment',
                            durationInMinutes: 30,
                            startTimeInMS: originalTime,
                            attendees: [{ type: 'enduser', id: enduser9.id }]
                        })];
                case 64:
                    event9 = _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)
                        // Update with same startTimeInMS - should NOT trigger
                    ];
                case 65:
                    _b.sent();
                    // Update with same startTimeInMS - should NOT trigger
                    return [4 /*yield*/, sdk.api.calendar_events.updateOne(event9.id, { startTimeInMS: originalTime })];
                case 66:
                    // Update with same startTimeInMS - should NOT trigger
                    _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 67:
                    _b.sent();
                    return [4 /*yield*/, async_test("Same startTimeInMS update does NOT trigger automation", function () { return sdk.api.endusers.getOne(enduser9.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } })
                        // Test 10: Duration change without time change (should NOT trigger manual reschedule)
                    ];
                case 68:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Test Appointment',
                            durationInMinutes: 30,
                            startTimeInMS: originalTime,
                            attendees: [{ type: 'enduser', id: enduser10.id }]
                        })];
                case 69:
                    event10 = _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)
                        // Update only duration - should NOT trigger manual reschedule
                    ];
                case 70:
                    _b.sent();
                    // Update only duration - should NOT trigger manual reschedule
                    return [4 /*yield*/, sdk.api.calendar_events.updateOne(event10.id, { durationInMinutes: 60 })];
                case 71:
                    // Update only duration - should NOT trigger manual reschedule
                    _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 72:
                    _b.sent();
                    return [4 /*yield*/, async_test("Duration change without time change does NOT trigger manual reschedule", function () { return sdk.api.endusers.getOne(enduser10.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } })
                        // Test 11: Multiple time changes (should trigger multiple times due to different endusers)
                    ];
                case 73:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Test Appointment',
                            durationInMinutes: 30,
                            startTimeInMS: originalTime,
                            attendees: [{ type: 'enduser', id: enduser11.id }]
                        })];
                case 74:
                    event11a = _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Test Appointment',
                            durationInMinutes: 30,
                            startTimeInMS: originalTime,
                            attendees: [{ type: 'enduser', id: enduser12.id }]
                        })];
                case 75:
                    event11b = _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)
                        // Update both - should trigger for both endusers
                    ];
                case 76:
                    _b.sent();
                    // Update both - should trigger for both endusers
                    return [4 /*yield*/, Promise.all([
                            sdk.api.calendar_events.updateOne(event11a.id, { startTimeInMS: newTime }),
                            sdk.api.calendar_events.updateOne(event11b.id, { startTimeInMS: newTime + 1800000 }) // 30 minutes later
                        ])];
                case 77:
                    // Update both - should trigger for both endusers
                    _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 78:
                    _b.sent();
                    return [4 /*yield*/, async_test("Multiple manual reschedules trigger automation for each enduser", function () { return Promise.all([
                            sdk.api.endusers.getOne(enduser11.id),
                            sdk.api.endusers.getOne(enduser12.id)
                        ]); }, { onResult: function (_a) {
                                var _b, _c;
                                var e11 = _a[0], e12 = _a[1];
                                return ((_b = e11.tags) === null || _b === void 0 ? void 0 : _b.length) === 2
                                    && e11.tags.includes('Manual Reschedule - Any')
                                    && e11.tags.includes('Manual Reschedule - By Title')
                                    && ((_c = e12.tags) === null || _c === void 0 ? void 0 : _c.length) === 2
                                    && e12.tags.includes('Manual Reschedule - Any')
                                    && e12.tags.includes('Manual Reschedule - By Title');
                            }
                        })
                        // Cleanup
                    ];
                case 79:
                    _b.sent();
                    // Cleanup
                    return [4 /*yield*/, Promise.all([
                            sdk.api.automation_triggers.deleteOne(t1.id),
                            sdk.api.automation_triggers.deleteOne(t2.id),
                            sdk.api.automation_triggers.deleteOne(t3.id),
                            sdk.api.automation_triggers.deleteOne(t4.id),
                            sdk.api.endusers.deleteOne(enduser1.id),
                            sdk.api.endusers.deleteOne(enduser2.id),
                            sdk.api.endusers.deleteOne(enduser3.id),
                            sdk.api.endusers.deleteOne(enduser4.id),
                            sdk.api.endusers.deleteOne(enduser5.id),
                            sdk.api.endusers.deleteOne(enduser6.id),
                            sdk.api.endusers.deleteOne(enduser7.id),
                            sdk.api.endusers.deleteOne(enduser8.id),
                            sdk.api.endusers.deleteOne(enduser9.id),
                            sdk.api.endusers.deleteOne(enduser10.id),
                            sdk.api.endusers.deleteOne(enduser11.id),
                            sdk.api.endusers.deleteOne(enduser12.id),
                            sdk.api.calendar_events.deleteOne(event1.id),
                            sdk.api.calendar_events.deleteOne(event2.id),
                            sdk.api.calendar_events.deleteOne(event3.id),
                            sdk.api.calendar_events.deleteOne(event4.id),
                            sdk.api.calendar_events.deleteOne(event5.id),
                            sdk.api.calendar_events.deleteOne(event6.id),
                            sdk.api.calendar_events.deleteOne(event7.id),
                            sdk.api.calendar_events.deleteOne(event8.id),
                            sdk.api.calendar_events.deleteOne(event9.id),
                            sdk.api.calendar_events.deleteOne(event10.id),
                            sdk.api.calendar_events.deleteOne(event11a.id),
                            sdk.api.calendar_events.deleteOne(event11b.id),
                        ])];
                case 80:
                    // Cleanup
                    _b.sent();
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
                    return [4 /*yield*/, appointment_rescheduled_trigger_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Appointment Rescheduled trigger tests completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Appointment Rescheduled trigger tests failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=appointment_rescheduled_trigger.test.js.map