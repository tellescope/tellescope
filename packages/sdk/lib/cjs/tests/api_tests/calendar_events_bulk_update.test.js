"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.calendar_events_bulk_update_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || 'http://localhost:8080';
var calendar_events_bulk_update_tests = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var createdEventIds, createdEnduserIds, createEvent, createEnduser, validationEvent_1, validationEnduser_1, _b, ev1_1, ev2_1, ev3, ev3After, _c, delEv1_1, delEv2_1, now, DAY, enduser_1, rootEvent_1, childEvent1_1, childEvent2_1, childEvent3_1, rootAfter, child1After, _i, _d, id, idx, _e, createdEventIds_1, id, _1, _f, createdEnduserIds_1, id, _2;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    (0, testing_1.log_header)("Calendar Events Bulk Update Tests");
                    createdEventIds = [];
                    createdEnduserIds = [];
                    createEvent = function (overrides) {
                        if (overrides === void 0) { overrides = {}; }
                        return __awaiter(void 0, void 0, void 0, function () {
                            var event;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.calendar_events.createOne(__assign({ title: "Bulk Update Test Event", durationInMinutes: 30, startTimeInMS: Date.now() + Math.random() * 100000 }, overrides))];
                                    case 1:
                                        event = _a.sent();
                                        createdEventIds.push(event.id);
                                        return [2 /*return*/, event];
                                }
                            });
                        });
                    };
                    createEnduser = function () { return __awaiter(void 0, void 0, void 0, function () {
                        var enduser;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, sdk.api.endusers.createOne({})];
                                case 1:
                                    enduser = _a.sent();
                                    createdEnduserIds.push(enduser.id);
                                    return [2 /*return*/, enduser];
                            }
                        });
                    }); };
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, , 34, 47]);
                    // ============================================================
                    // SECTION 1: Validation / Error Cases
                    // ============================================================
                    (0, testing_1.log_header)("Bulk Update - Validation");
                    return [4 /*yield*/, (0, testing_1.async_test)("bulk_update errors when neither recurringEventId nor ids provided", function () { return sdk.api.calendar_events.bulk_update({ action: 'cancel' }); }, { shouldError: true, onError: function (e) { return e.message.includes("Either recurringEventId or ids is required"); } })];
                case 2:
                    _g.sent();
                    return [4 /*yield*/, createEvent()];
                case 3:
                    validationEvent_1 = _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("bulk_update errors when both recurringEventId and ids provided", function () { return sdk.api.calendar_events.bulk_update({
                            recurringEventId: validationEvent_1.id,
                            ids: [validationEvent_1.id],
                            action: 'cancel',
                        }); }, { shouldError: true, onError: function (e) { return e.message.includes("Provide either recurringEventId or ids, not both"); } })];
                case 4:
                    _g.sent();
                    return [4 /*yield*/, createEnduser()];
                case 5:
                    validationEnduser_1 = _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("bulk_update errors when attendee-level action used with ids", function () { return sdk.api.calendar_events.bulk_update({
                            ids: [validationEvent_1.id],
                            action: 'cancel_for_attendee',
                            enduserId: validationEnduser_1.id,
                        }); }, { shouldError: true, onError: function (e) { return e.message.includes("only supported with recurringEventId"); } })];
                case 6:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("bulk_update errors when attendee action missing enduserId", function () { return sdk.api.calendar_events.bulk_update({
                            recurringEventId: validationEvent_1.id,
                            action: 'cancel_for_attendee',
                        }); }, { shouldError: true, onError: function (e) { return e.message.includes("enduserId is required"); } })
                        // ============================================================
                        // SECTION 2: ID-based bulk operations (new feature)
                        // ============================================================
                    ];
                case 7:
                    _g.sent();
                    // ============================================================
                    // SECTION 2: ID-based bulk operations (new feature)
                    // ============================================================
                    (0, testing_1.log_header)("Bulk Update - ID-based Cancel");
                    return [4 /*yield*/, Promise.all([createEvent(), createEvent(), createEvent()])];
                case 8:
                    _b = _g.sent(), ev1_1 = _b[0], ev2_1 = _b[1], ev3 = _b[2];
                    return [4 /*yield*/, (0, testing_1.async_test)("bulk cancel by IDs cancels selected events", function () { return sdk.api.calendar_events.bulk_update({
                            ids: [ev1_1.id, ev2_1.id],
                            action: 'cancel',
                            cancelReason: 'Testing bulk cancel',
                        }); }, {
                            onResult: function (r) { return (r.updated.length === 2
                                && r.updated.every(function (e) { return !!e.cancelledAt; })
                                && r.updated.every(function (e) { return e.cancelReason === 'Testing bulk cancel'; })); }
                        })
                        // Verify third event is unchanged
                    ];
                case 9:
                    _g.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.getOne(ev3.id)];
                case 10:
                    ev3After = _g.sent();
                    (0, testing_1.assert)(!ev3After.cancelledAt, 'Third event should not be cancelled', 'Third event remains uncancelled');
                    // --- Uncancel ---
                    (0, testing_1.log_header)("Bulk Update - ID-based Uncancel");
                    return [4 /*yield*/, (0, testing_1.async_test)("bulk uncancel by IDs restores cancelled events", function () { return sdk.api.calendar_events.bulk_update({
                            ids: [ev1_1.id, ev2_1.id],
                            action: 'uncancel',
                        }); }, {
                            onResult: function (r) { return (r.updated.length === 2
                                && r.updated.every(function (e) { return !e.cancelledAt; })); }
                        })
                        // --- Confirm ---
                    ];
                case 11:
                    _g.sent();
                    // --- Confirm ---
                    (0, testing_1.log_header)("Bulk Update - ID-based Confirm");
                    return [4 /*yield*/, (0, testing_1.async_test)("bulk confirm by IDs sets confirmedAt", function () { return sdk.api.calendar_events.bulk_update({
                            ids: [ev1_1.id, ev2_1.id],
                            action: 'confirm',
                        }); }, {
                            onResult: function (r) { return (r.updated.length === 2
                                && r.updated.every(function (e) { return !!e.confirmedAt; })); }
                        })
                        // --- Idempotency: confirm already-confirmed ---
                    ];
                case 12:
                    _g.sent();
                    // --- Idempotency: confirm already-confirmed ---
                    return [4 /*yield*/, (0, testing_1.async_test)("bulk confirm on already-confirmed events returns empty updated", function () { return sdk.api.calendar_events.bulk_update({
                            ids: [ev1_1.id, ev2_1.id],
                            action: 'confirm',
                        }); }, { onResult: function (r) { return r.updated.length === 0; } })
                        // --- No Show ---
                    ];
                case 13:
                    // --- Idempotency: confirm already-confirmed ---
                    _g.sent();
                    // --- No Show ---
                    (0, testing_1.log_header)("Bulk Update - ID-based No Show");
                    return [4 /*yield*/, (0, testing_1.async_test)("bulk no_show by IDs sets noShowedAt", function () { return sdk.api.calendar_events.bulk_update({
                            ids: [ev1_1.id, ev2_1.id],
                            action: 'no_show',
                        }); }, {
                            onResult: function (r) { return (r.updated.length === 2
                                && r.updated.every(function (e) { return !!e.noShowedAt; })); }
                        })
                        // --- Un-No-Show ---
                    ];
                case 14:
                    _g.sent();
                    // --- Un-No-Show ---
                    (0, testing_1.log_header)("Bulk Update - ID-based Un-No-Show");
                    return [4 /*yield*/, (0, testing_1.async_test)("bulk un_no_show by IDs clears noShowedAt", function () { return sdk.api.calendar_events.bulk_update({
                            ids: [ev1_1.id, ev2_1.id],
                            action: 'un_no_show',
                        }); }, {
                            onResult: function (r) { return (r.updated.length === 2
                                && r.updated.every(function (e) { return !e.noShowedAt; })); }
                        })
                        // --- Delete by IDs ---
                    ];
                case 15:
                    _g.sent();
                    // --- Delete by IDs ---
                    (0, testing_1.log_header)("Bulk Update - ID-based Delete");
                    return [4 /*yield*/, Promise.all([createEvent(), createEvent()])];
                case 16:
                    _c = _g.sent(), delEv1_1 = _c[0], delEv2_1 = _c[1];
                    return [4 /*yield*/, (0, testing_1.async_test)("bulk delete by IDs removes events", function () { return sdk.api.calendar_events.bulk_update({
                            ids: [delEv1_1.id, delEv2_1.id],
                            action: 'delete',
                        }); }, { onResult: function (r) { return r.deleted.length === 2; } })
                        // Verify deleted events are gone
                    ];
                case 17:
                    _g.sent();
                    // Verify deleted events are gone
                    return [4 /*yield*/, (0, testing_1.async_test)("deleted events are no longer accessible", function () { return sdk.api.calendar_events.getOne(delEv1_1.id); }, { shouldError: true, onError: function (e) { return e.message.includes("Could not find"); } })
                        // Remove from cleanup tracking since already deleted
                    ];
                case 18:
                    // Verify deleted events are gone
                    _g.sent();
                    // Remove from cleanup tracking since already deleted
                    createdEventIds.splice(createdEventIds.indexOf(delEv1_1.id), 1);
                    createdEventIds.splice(createdEventIds.indexOf(delEv2_1.id), 1);
                    // ============================================================
                    // SECTION 3: Recurring series operations
                    // ============================================================
                    (0, testing_1.log_header)("Bulk Update - Recurring Series");
                    now = Date.now();
                    DAY = 24 * 60 * 60 * 1000;
                    return [4 /*yield*/, createEnduser()
                        // Create a "recurring series": root event + child events with copiedFrom
                    ];
                case 19:
                    enduser_1 = _g.sent();
                    return [4 /*yield*/, createEvent({
                            title: "Recurring Root",
                            startTimeInMS: now - 2 * DAY,
                            attendees: [{ id: enduser_1.id, type: 'enduser' }],
                        })];
                case 20:
                    rootEvent_1 = _g.sent();
                    return [4 /*yield*/, createEvent({
                            title: "Recurring Child 1",
                            startTimeInMS: now - 1 * DAY,
                            copiedFrom: rootEvent_1.id,
                            attendees: [{ id: enduser_1.id, type: 'enduser' }],
                        })];
                case 21:
                    childEvent1_1 = _g.sent();
                    return [4 /*yield*/, createEvent({
                            title: "Recurring Child 2",
                            startTimeInMS: now + 1 * DAY,
                            copiedFrom: rootEvent_1.id,
                            attendees: [{ id: enduser_1.id, type: 'enduser' }],
                        })];
                case 22:
                    childEvent2_1 = _g.sent();
                    return [4 /*yield*/, createEvent({
                            title: "Recurring Child 3",
                            startTimeInMS: now + 2 * DAY,
                            copiedFrom: rootEvent_1.id,
                            attendees: [{ id: enduser_1.id, type: 'enduser' }],
                        })
                        // --- Cancel with scope 'this_and_future' ---
                    ];
                case 23:
                    childEvent3_1 = _g.sent();
                    // --- Cancel with scope 'this_and_future' ---
                    (0, testing_1.log_header)("Bulk Update - Recurring Cancel this_and_future");
                    return [4 /*yield*/, (0, testing_1.async_test)("recurring cancel this_and_future cancels anchor and future events", function () { return sdk.api.calendar_events.bulk_update({
                            recurringEventId: childEvent2_1.id,
                            action: 'cancel',
                            scope: 'this_and_future',
                        }); }, {
                            onResult: function (r) { return (r.updated.length === 2
                                && r.updated.every(function (e) { return !!e.cancelledAt; })
                                && r.updated.some(function (e) { return e.id === childEvent2_1.id; })
                                && r.updated.some(function (e) { return e.id === childEvent3_1.id; })); }
                        })
                        // Verify earlier events were NOT cancelled
                    ];
                case 24:
                    _g.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.getOne(rootEvent_1.id)];
                case 25:
                    rootAfter = _g.sent();
                    (0, testing_1.assert)(!rootAfter.cancelledAt, 'Root should not be cancelled', 'Root event not cancelled by this_and_future');
                    return [4 /*yield*/, sdk.api.calendar_events.getOne(childEvent1_1.id)];
                case 26:
                    child1After = _g.sent();
                    (0, testing_1.assert)(!child1After.cancelledAt, 'Child 1 should not be cancelled', 'Child 1 not cancelled by this_and_future');
                    // --- Uncancel with scope 'all' to reset ---
                    return [4 /*yield*/, sdk.api.calendar_events.bulk_update({
                            recurringEventId: rootEvent_1.id,
                            action: 'uncancel',
                            scope: 'all',
                        })
                        // --- Cancel with scope 'all' ---
                    ];
                case 27:
                    // --- Uncancel with scope 'all' to reset ---
                    _g.sent();
                    // --- Cancel with scope 'all' ---
                    (0, testing_1.log_header)("Bulk Update - Recurring Cancel All");
                    return [4 /*yield*/, (0, testing_1.async_test)("recurring cancel all cancels entire series", function () { return sdk.api.calendar_events.bulk_update({
                            recurringEventId: childEvent1_1.id,
                            action: 'cancel',
                            scope: 'all',
                        }); }, {
                            onResult: function (r) { return (r.updated.length === 4
                                && r.updated.every(function (e) { return !!e.cancelledAt; })); }
                        })
                        // Reset: uncancel all
                    ];
                case 28:
                    _g.sent();
                    // Reset: uncancel all
                    return [4 /*yield*/, sdk.api.calendar_events.bulk_update({
                            recurringEventId: rootEvent_1.id,
                            action: 'uncancel',
                            scope: 'all',
                        })
                        // --- Cancel for attendee ---
                    ];
                case 29:
                    // Reset: uncancel all
                    _g.sent();
                    // --- Cancel for attendee ---
                    (0, testing_1.log_header)("Bulk Update - Recurring Cancel for Attendee");
                    return [4 /*yield*/, (0, testing_1.async_test)("cancel_for_attendee adds enduser to cancelledGroupAttendees across series", function () { return sdk.api.calendar_events.bulk_update({
                            recurringEventId: rootEvent_1.id,
                            action: 'cancel_for_attendee',
                            scope: 'all',
                            enduserId: enduser_1.id,
                        }); }, {
                            onResult: function (r) { return (r.updated.length === 4
                                && r.updated.every(function (e) { var _a; return (_a = e.cancelledGroupAttendees) === null || _a === void 0 ? void 0 : _a.some(function (c) { return c.id === enduser_1.id; }); })); }
                        })
                        // --- Uncancel for attendee ---
                    ];
                case 30:
                    _g.sent();
                    // --- Uncancel for attendee ---
                    (0, testing_1.log_header)("Bulk Update - Recurring Uncancel for Attendee");
                    return [4 /*yield*/, (0, testing_1.async_test)("uncancel_for_attendee removes enduser from cancelledGroupAttendees", function () { return sdk.api.calendar_events.bulk_update({
                            recurringEventId: rootEvent_1.id,
                            action: 'uncancel_for_attendee',
                            scope: 'all',
                            enduserId: enduser_1.id,
                        }); }, {
                            onResult: function (r) { return (r.updated.length === 4
                                && r.updated.every(function (e) { var _a; return !((_a = e.cancelledGroupAttendees) === null || _a === void 0 ? void 0 : _a.some(function (c) { return c.id === enduser_1.id; })); })); }
                        })
                        // --- Remove attendee ---
                    ];
                case 31:
                    _g.sent();
                    // --- Remove attendee ---
                    (0, testing_1.log_header)("Bulk Update - Recurring Remove Attendee");
                    return [4 /*yield*/, (0, testing_1.async_test)("remove_attendee removes enduser from attendees across series", function () { return sdk.api.calendar_events.bulk_update({
                            recurringEventId: rootEvent_1.id,
                            action: 'remove_attendee',
                            scope: 'all',
                            enduserId: enduser_1.id,
                        }); }, {
                            onResult: function (r) { return (r.updated.length === 4
                                && r.updated.every(function (e) { var _a; return !((_a = e.attendees) === null || _a === void 0 ? void 0 : _a.some(function (a) { return a.id === enduser_1.id; })); })); }
                        })
                        // --- Recurring delete ---
                    ];
                case 32:
                    _g.sent();
                    // --- Recurring delete ---
                    (0, testing_1.log_header)("Bulk Update - Recurring Delete");
                    return [4 /*yield*/, (0, testing_1.async_test)("recurring delete removes all events in series", function () { return sdk.api.calendar_events.bulk_update({
                            recurringEventId: rootEvent_1.id,
                            action: 'delete',
                            scope: 'all',
                        }); }, { onResult: function (r) { return r.deleted.length === 4; } })
                        // Remove from cleanup tracking since already deleted
                    ];
                case 33:
                    _g.sent();
                    // Remove from cleanup tracking since already deleted
                    for (_i = 0, _d = [rootEvent_1.id, childEvent1_1.id, childEvent2_1.id, childEvent3_1.id]; _i < _d.length; _i++) {
                        id = _d[_i];
                        idx = createdEventIds.indexOf(id);
                        if (idx !== -1)
                            createdEventIds.splice(idx, 1);
                    }
                    return [3 /*break*/, 47];
                case 34:
                    _e = 0, createdEventIds_1 = createdEventIds;
                    _g.label = 35;
                case 35:
                    if (!(_e < createdEventIds_1.length)) return [3 /*break*/, 40];
                    id = createdEventIds_1[_e];
                    _g.label = 36;
                case 36:
                    _g.trys.push([36, 38, , 39]);
                    return [4 /*yield*/, sdk.api.calendar_events.deleteOne(id)];
                case 37:
                    _g.sent();
                    return [3 /*break*/, 39];
                case 38:
                    _1 = _g.sent();
                    return [3 /*break*/, 39];
                case 39:
                    _e++;
                    return [3 /*break*/, 35];
                case 40:
                    _f = 0, createdEnduserIds_1 = createdEnduserIds;
                    _g.label = 41;
                case 41:
                    if (!(_f < createdEnduserIds_1.length)) return [3 /*break*/, 46];
                    id = createdEnduserIds_1[_f];
                    _g.label = 42;
                case 42:
                    _g.trys.push([42, 44, , 45]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(id)];
                case 43:
                    _g.sent();
                    return [3 /*break*/, 45];
                case 44:
                    _2 = _g.sent();
                    return [3 /*break*/, 45];
                case 45:
                    _f++;
                    return [3 /*break*/, 41];
                case 46: return [7 /*endfinally*/];
                case 47: return [2 /*return*/];
            }
        });
    });
};
exports.calendar_events_bulk_update_tests = calendar_events_bulk_update_tests;
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
                    return [4 /*yield*/, (0, exports.calendar_events_bulk_update_tests)({ sdk: sdk_2 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Calendar events bulk update test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Calendar events bulk update test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=calendar_events_bulk_update.test.js.map