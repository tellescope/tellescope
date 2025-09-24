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
exports.appointment_completed_trigger_tests = void 0;
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || "http://localhost:8080";
var appointment_completed_trigger_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var t1, t2, template, t3, enduser1, enduser2, enduser3, enduser4, enduser5, enduser6, enduser7, enduser8, updateEnduser1, updateEnduser2, updateEnduser3, updateEnduser4, updateEnduser5, event1, event2, event3, event4, event5, event6, event7, event8, updateEvent1, updateEvent2, updateEvent3, updateEvent4, updateEvent5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("Automation Trigger Tests (Appointment Completed)");
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Appointment Completed', info: {} },
                            action: { type: 'Add Tags', info: { tags: ['Completed - Any'] } },
                            status: 'Active',
                            title: "Completed - Any"
                        })];
                case 1:
                    t1 = _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Appointment Completed', info: { titles: ['Test Appointment'] } },
                            action: { type: 'Add Tags', info: { tags: ['Completed - By Title'] } },
                            status: 'Active',
                            title: "Completed - By Title"
                        })];
                case 2:
                    t2 = _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_event_templates.createOne({
                            title: 'Test Template',
                            durationInMinutes: 30,
                        })];
                case 3:
                    template = _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Appointment Completed', info: { templateIds: [template.id] } },
                            action: { type: 'Add Tags', info: { tags: ['Completed - By Template'] } },
                            status: 'Active',
                            title: "Completed - By Template"
                        })
                        // Create separate endusers to avoid trigger throttling (1 minute per trigger per enduser)
                    ];
                case 4:
                    t3 = _b.sent();
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
                    return [4 /*yield*/, sdk.api.endusers.createOne({})
                        // Update test endusers for consistency
                    ];
                case 12:
                    enduser8 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 13:
                    updateEnduser1 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 14:
                    updateEnduser2 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 15:
                    updateEnduser3 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 16:
                    updateEnduser4 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})
                        // Test 1: Appointment created as completed (should trigger)
                    ];
                case 17:
                    updateEnduser5 = _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Test Appointment',
                            durationInMinutes: 30,
                            startTimeInMS: Date.now(),
                            attendees: [{ type: 'enduser', id: enduser1.id }],
                            completedAt: new Date(),
                            completedBy: sdk.userInfo.id // Track who completed it
                        })];
                case 18:
                    event1 = _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)]; // allow triggers to happen
                case 19:
                    _b.sent(); // allow triggers to happen
                    return [4 /*yield*/, (0, testing_1.async_test)("Appointment created as completed triggers automation", function () { return sdk.api.endusers.getOne(enduser1.id); }, { onResult: function (e) {
                                var _a;
                                return ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 2
                                    && e.tags.includes('Completed - Any')
                                    && e.tags.includes('Completed - By Title');
                            }
                        })
                        // Test 2: Appointment created as cancelled and completed (should NOT trigger)
                    ];
                case 20:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Test Appointment',
                            durationInMinutes: 30,
                            startTimeInMS: Date.now(),
                            attendees: [{ type: 'enduser', id: enduser2.id }],
                            completedAt: new Date(),
                            completedBy: sdk.userInfo.id,
                            cancelledAt: new Date() // Both completed and cancelled
                        })];
                case 21:
                    event2 = _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)]; // allow triggers to happen
                case 22:
                    _b.sent(); // allow triggers to happen
                    return [4 /*yield*/, (0, testing_1.async_test)("Cancelled appointment with completedAt does NOT trigger automation", function () { return sdk.api.endusers.getOne(enduser2.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } } // No tags should be added
                        )
                        // Test 3: Appointment created as rescheduled and completed (should NOT trigger)
                    ];
                case 23:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Test Appointment',
                            durationInMinutes: 30,
                            startTimeInMS: Date.now(),
                            attendees: [{ type: 'enduser', id: enduser3.id }],
                            completedAt: new Date(),
                            completedBy: sdk.userInfo.id,
                            rescheduledAt: new Date() // Both completed and rescheduled
                        })];
                case 24:
                    event3 = _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)]; // allow triggers to happen
                case 25:
                    _b.sent(); // allow triggers to happen
                    return [4 /*yield*/, (0, testing_1.async_test)("Rescheduled appointment with completedAt does NOT trigger automation", function () { return sdk.api.endusers.getOne(enduser3.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } } // No tags should be added
                        )
                        // Test 4: Appointment created as no-show and completed (should NOT trigger)
                    ];
                case 26:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Test Appointment',
                            durationInMinutes: 30,
                            startTimeInMS: Date.now(),
                            attendees: [{ type: 'enduser', id: enduser4.id }],
                            completedAt: new Date(),
                            completedBy: sdk.userInfo.id,
                            noShowedAt: new Date() // Both completed and no-show
                        })];
                case 27:
                    event4 = _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)]; // allow triggers to happen
                case 28:
                    _b.sent(); // allow triggers to happen
                    return [4 /*yield*/, (0, testing_1.async_test)("No-show appointment with completedAt does NOT trigger automation", function () { return sdk.api.endusers.getOne(enduser4.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } } // No tags should be added
                        )
                        // Test 5: Template-based trigger
                    ];
                case 29:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Template Test',
                            durationInMinutes: 30,
                            startTimeInMS: Date.now(),
                            attendees: [{ type: 'enduser', id: enduser5.id }],
                            templateId: template.id,
                            completedAt: new Date(),
                            completedBy: sdk.userInfo.id // Track who completed it
                        })];
                case 30:
                    event5 = _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)]; // allow triggers to happen
                case 31:
                    _b.sent(); // allow triggers to happen
                    return [4 /*yield*/, (0, testing_1.async_test)("Template-based completed appointment triggers automation", function () { return sdk.api.endusers.getOne(enduser5.id); }, { onResult: function (e) {
                                var _a;
                                return ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 2
                                    && e.tags.includes('Completed - Any')
                                    && e.tags.includes('Completed - By Template');
                            }
                        })
                        // Test 6: Template-based trigger with cancelled status (should NOT trigger)
                    ];
                case 32:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Template Test',
                            durationInMinutes: 30,
                            startTimeInMS: Date.now(),
                            attendees: [{ type: 'enduser', id: enduser6.id }],
                            templateId: template.id,
                            completedAt: new Date(),
                            completedBy: sdk.userInfo.id,
                            cancelledAt: new Date()
                        })];
                case 33:
                    event6 = _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)]; // allow triggers to happen
                case 34:
                    _b.sent(); // allow triggers to happen
                    return [4 /*yield*/, (0, testing_1.async_test)("Template-based cancelled appointment with completedAt does NOT trigger automation", function () { return sdk.api.endusers.getOne(enduser6.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } } // No tags should be added
                        )
                        // Test 7: Multiple conflicting statuses (all should NOT trigger)
                    ];
                case 35:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Test Appointment',
                            durationInMinutes: 30,
                            startTimeInMS: Date.now(),
                            attendees: [{ type: 'enduser', id: enduser7.id }],
                            completedAt: new Date(),
                            completedBy: sdk.userInfo.id,
                            cancelledAt: new Date(),
                            rescheduledAt: new Date(),
                            noShowedAt: new Date()
                        })];
                case 36:
                    event7 = _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)]; // allow triggers to happen
                case 37:
                    _b.sent(); // allow triggers to happen
                    return [4 /*yield*/, (0, testing_1.async_test)("Appointment with all status flags does NOT trigger automation", function () { return sdk.api.endusers.getOne(enduser7.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } } // No tags should be added
                        )
                        // Test 8: Only completed status (should trigger)
                    ];
                case 38:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Test Appointment',
                            durationInMinutes: 30,
                            startTimeInMS: Date.now(),
                            attendees: [{ type: 'enduser', id: enduser8.id }],
                            completedAt: new Date(),
                            completedBy: sdk.userInfo.id // Track who completed it
                            // No other status flags
                        })];
                case 39:
                    event8 = _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)]; // allow triggers to happen
                case 40:
                    _b.sent(); // allow triggers to happen
                    return [4 /*yield*/, (0, testing_1.async_test)("Clean completed appointment triggers automation", function () { return sdk.api.endusers.getOne(enduser8.id); }, { onResult: function (e) {
                                var _a;
                                return ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 2
                                    && e.tags.includes('Completed - Any')
                                    && e.tags.includes('Completed - By Title');
                            }
                        })
                        // ===== UPDATE SCENARIO TESTS =====
                    ];
                case 41:
                    _b.sent();
                    // ===== UPDATE SCENARIO TESTS =====
                    (0, testing_1.log_header)("Update Scenario Tests");
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Test Appointment',
                            durationInMinutes: 30,
                            startTimeInMS: Date.now(),
                            attendees: [{ type: 'enduser', id: updateEnduser1.id }]
                            // Created without completedAt
                        })];
                case 42:
                    updateEvent1 = _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)]; // ensure no initial triggers
                case 43:
                    _b.sent(); // ensure no initial triggers
                    return [4 /*yield*/, (0, testing_1.async_test)("No initial triggers for incomplete appointment", function () { return sdk.api.endusers.getOne(updateEnduser1.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } })
                        // Now update to mark as completed
                    ];
                case 44:
                    _b.sent();
                    // Now update to mark as completed
                    return [4 /*yield*/, sdk.api.calendar_events.updateOne(updateEvent1.id, {
                            completedAt: new Date(),
                            completedBy: sdk.userInfo.id
                        })];
                case 45:
                    // Now update to mark as completed
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)]; // allow update triggers to happen
                case 46:
                    _b.sent(); // allow update triggers to happen
                    return [4 /*yield*/, (0, testing_1.async_test)("Update to completed triggers automation", function () { return sdk.api.endusers.getOne(updateEnduser1.id); }, { onResult: function (e) {
                                var _a;
                                return ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 2
                                    && e.tags.includes('Completed - Any')
                                    && e.tags.includes('Completed - By Title');
                            }
                        })
                        // Test 10: Update cancelled event to add completedAt (should NOT trigger)
                    ];
                case 47:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Test Appointment',
                            durationInMinutes: 30,
                            startTimeInMS: Date.now(),
                            attendees: [{ type: 'enduser', id: updateEnduser2.id }],
                            cancelledAt: new Date()
                        })];
                case 48:
                    updateEvent2 = _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)
                        // Update to add completedAt to cancelled event
                    ];
                case 49:
                    _b.sent();
                    // Update to add completedAt to cancelled event
                    return [4 /*yield*/, sdk.api.calendar_events.updateOne(updateEvent2.id, {
                            completedAt: new Date(),
                            completedBy: sdk.userInfo.id
                        })];
                case 50:
                    // Update to add completedAt to cancelled event
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)]; // allow update triggers to happen
                case 51:
                    _b.sent(); // allow update triggers to happen
                    return [4 /*yield*/, (0, testing_1.async_test)("Update cancelled event to completed does NOT trigger automation", function () { return sdk.api.endusers.getOne(updateEnduser2.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } })
                        // Test 11: Update rescheduled event to add completedAt (should NOT trigger)
                    ];
                case 52:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Test Appointment',
                            durationInMinutes: 30,
                            startTimeInMS: Date.now(),
                            attendees: [{ type: 'enduser', id: updateEnduser3.id }],
                            rescheduledAt: new Date()
                        })];
                case 53:
                    updateEvent3 = _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)
                        // Update to add completedAt to rescheduled event
                    ];
                case 54:
                    _b.sent();
                    // Update to add completedAt to rescheduled event
                    return [4 /*yield*/, sdk.api.calendar_events.updateOne(updateEvent3.id, {
                            completedAt: new Date(),
                            completedBy: sdk.userInfo.id
                        })];
                case 55:
                    // Update to add completedAt to rescheduled event
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)]; // allow update triggers to happen
                case 56:
                    _b.sent(); // allow update triggers to happen
                    return [4 /*yield*/, (0, testing_1.async_test)("Update rescheduled event to completed does NOT trigger automation", function () { return sdk.api.endusers.getOne(updateEnduser3.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } })
                        // Test 12: Update no-show event to add completedAt (should NOT trigger)
                    ];
                case 57:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Test Appointment',
                            durationInMinutes: 30,
                            startTimeInMS: Date.now(),
                            attendees: [{ type: 'enduser', id: updateEnduser4.id }],
                            noShowedAt: new Date()
                        })];
                case 58:
                    updateEvent4 = _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)
                        // Update to add completedAt to no-show event
                    ];
                case 59:
                    _b.sent();
                    // Update to add completedAt to no-show event
                    return [4 /*yield*/, sdk.api.calendar_events.updateOne(updateEvent4.id, {
                            completedAt: new Date(),
                            completedBy: sdk.userInfo.id
                        })];
                case 60:
                    // Update to add completedAt to no-show event
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)]; // allow update triggers to happen
                case 61:
                    _b.sent(); // allow update triggers to happen
                    return [4 /*yield*/, (0, testing_1.async_test)("Update no-show event to completed does NOT trigger automation", function () { return sdk.api.endusers.getOne(updateEnduser4.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } })
                        // Test 13: Update event to add both completedAt and cancelledAt (should NOT trigger)
                    ];
                case 62:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Test Appointment',
                            durationInMinutes: 30,
                            startTimeInMS: Date.now(),
                            attendees: [{ type: 'enduser', id: updateEnduser5.id }]
                        })];
                case 63:
                    updateEvent5 = _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)
                        // Update to add both completedAt and cancelledAt
                    ];
                case 64:
                    _b.sent();
                    // Update to add both completedAt and cancelledAt
                    return [4 /*yield*/, sdk.api.calendar_events.updateOne(updateEvent5.id, {
                            completedAt: new Date(),
                            completedBy: sdk.userInfo.id,
                            cancelledAt: new Date()
                        })];
                case 65:
                    // Update to add both completedAt and cancelledAt
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)]; // allow update triggers to happen
                case 66:
                    _b.sent(); // allow update triggers to happen
                    return [4 /*yield*/, (0, testing_1.async_test)("Update to add both completed and cancelled does NOT trigger automation", function () { return sdk.api.endusers.getOne(updateEnduser5.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } })
                        // Cleanup
                    ];
                case 67:
                    _b.sent();
                    // Cleanup
                    return [4 /*yield*/, Promise.all([
                            sdk.api.automation_triggers.deleteOne(t1.id),
                            sdk.api.automation_triggers.deleteOne(t2.id),
                            sdk.api.automation_triggers.deleteOne(t3.id),
                            sdk.api.calendar_event_templates.deleteOne(template.id),
                            sdk.api.endusers.deleteOne(enduser1.id),
                            sdk.api.endusers.deleteOne(enduser2.id),
                            sdk.api.endusers.deleteOne(enduser3.id),
                            sdk.api.endusers.deleteOne(enduser4.id),
                            sdk.api.endusers.deleteOne(enduser5.id),
                            sdk.api.endusers.deleteOne(enduser6.id),
                            sdk.api.endusers.deleteOne(enduser7.id),
                            sdk.api.endusers.deleteOne(enduser8.id),
                            sdk.api.endusers.deleteOne(updateEnduser1.id),
                            sdk.api.endusers.deleteOne(updateEnduser2.id),
                            sdk.api.endusers.deleteOne(updateEnduser3.id),
                            sdk.api.endusers.deleteOne(updateEnduser4.id),
                            sdk.api.endusers.deleteOne(updateEnduser5.id),
                            sdk.api.calendar_events.deleteOne(event1.id),
                            sdk.api.calendar_events.deleteOne(event2.id),
                            sdk.api.calendar_events.deleteOne(event3.id),
                            sdk.api.calendar_events.deleteOne(event4.id),
                            sdk.api.calendar_events.deleteOne(event5.id),
                            sdk.api.calendar_events.deleteOne(event6.id),
                            sdk.api.calendar_events.deleteOne(event7.id),
                            sdk.api.calendar_events.deleteOne(event8.id),
                            sdk.api.calendar_events.deleteOne(updateEvent1.id),
                            sdk.api.calendar_events.deleteOne(updateEvent2.id),
                            sdk.api.calendar_events.deleteOne(updateEvent3.id),
                            sdk.api.calendar_events.deleteOne(updateEvent4.id),
                            sdk.api.calendar_events.deleteOne(updateEvent5.id),
                        ])];
                case 68:
                    // Cleanup
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
};
exports.appointment_completed_trigger_tests = appointment_completed_trigger_tests;
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
                    return [4 /*yield*/, (0, exports.appointment_completed_trigger_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Appointment Completed trigger tests completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Appointment Completed trigger tests failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=appointment_completed_trigger.test.js.map