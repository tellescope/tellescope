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
var host = process.env.API_URL || "http://localhost:8080";
// Tags applied by the four per-status triggers. Distinct so we can prove exactly which trigger
// fired against which attendee (no false positives / no false negatives).
var TAG = {
    'Completed': 'Group Attendee: Completed',
    'No-showed': 'Group Attendee: No-showed',
    'Rescheduled': 'Group Attendee: Rescheduled',
    'Cancelled': 'Group Attendee: Cancelled',
};
var ALL_STATUSES = ['Completed', 'No-showed', 'Rescheduled', 'Cancelled'];
export var group_event_attendee_status_triggers_tests = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var createdTriggerIds, createdEnduserIds, createdEventIds, createEnduser, createGroupEvent, setAttendeeStatuses, tagsOf, _i, ALL_STATUSES_1, status_1, t, _loop_1, _b, ALL_STATUSES_2, status_2, aCompleted_1, bNoShow_1, cCancelled_1, dUnset_1, mixedEvent, transA_1, transABystander_1, transAEvent, transB_1, transBBystander_1, transBEvent, byUserTrigger, byEnduserTrigger, byTarget_1, byBystander_1, byEvent, bulkTarget_1, bulkBystander_1, now, DAY, rootEvent, childEvent, confirmEnduser_1, clearEnduser_1, noopEvent, _c, createdEventIds_1, id, _1, _d, createdEnduserIds_1, id, _2, _e, createdTriggerIds_1, id, _3;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    log_header("Automation Trigger Tests (Group Event Per-Attendee Status)");
                    createdTriggerIds = [];
                    createdEnduserIds = [];
                    createdEventIds = [];
                    createEnduser = function () { return __awaiter(void 0, void 0, void 0, function () {
                        var e;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, sdk.api.endusers.createOne({})];
                                case 1:
                                    e = _a.sent();
                                    createdEnduserIds.push(e.id);
                                    return [2 /*return*/, e];
                            }
                        });
                    }); };
                    createGroupEvent = function (attendeeIds) { return __awaiter(void 0, void 0, void 0, function () {
                        var event;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, sdk.api.calendar_events.createOne({
                                        title: 'Group Status Test',
                                        durationInMinutes: 30,
                                        startTimeInMS: Date.now() + Math.floor(Math.random() * 100000),
                                        attendees: attendeeIds.map(function (id) { return ({ type: 'enduser', id: id }); }),
                                    })];
                                case 1:
                                    event = _a.sent();
                                    createdEventIds.push(event.id);
                                    return [2 /*return*/, event];
                            }
                        });
                    }); };
                    setAttendeeStatuses = function (eventId, statuses) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, (sdk.api.calendar_events.updateOne(eventId, {
                                    attendeeStatuses: statuses.map(function (s) { return ({ id: s.id, at: new Date(), status: s.status }); }),
                                    cancelledGroupAttendees: (statuses
                                        .filter(function (s) { return s.status === 'Cancelled' || s.status === 'No-showed' || s.status === 'Rescheduled'; })
                                        .map(function (s) { return ({ id: s.id, at: new Date() }); })),
                                }, { replaceObjectFields: true }))];
                        });
                    }); };
                    tagsOf = function (enduserId) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, sdk.api.endusers.getOne(enduserId)];
                            case 1: return [2 /*return*/, (_a.sent()).tags || []];
                        }
                    }); }); };
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, , 68, 87]);
                    _i = 0, ALL_STATUSES_1 = ALL_STATUSES;
                    _f.label = 2;
                case 2:
                    if (!(_i < ALL_STATUSES_1.length)) return [3 /*break*/, 5];
                    status_1 = ALL_STATUSES_1[_i];
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: {
                                type: status_1 === 'No-showed' ? 'Appointment No-Showed'
                                    : status_1 === 'Completed' ? 'Appointment Completed'
                                        : status_1 === 'Rescheduled' ? 'Appointment Rescheduled'
                                            : 'Appointment Cancelled',
                                info: {},
                            },
                            action: { type: 'Add Tags', info: { tags: [TAG[status_1]] } },
                            status: 'Active',
                            title: "Group Attendee ".concat(status_1),
                        })];
                case 3:
                    t = _f.sent();
                    createdTriggerIds.push(t.id);
                    _f.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    _loop_1 = function (status_2) {
                        var target, bystander1, bystander2, event_1;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    log_header("Per-attendee '".concat(status_2, "' in a group event"));
                                    return [4 /*yield*/, createEnduser()];
                                case 1:
                                    target = _g.sent();
                                    return [4 /*yield*/, createEnduser()];
                                case 2:
                                    bystander1 = _g.sent();
                                    return [4 /*yield*/, createEnduser()];
                                case 3:
                                    bystander2 = _g.sent();
                                    return [4 /*yield*/, createGroupEvent([target.id, bystander1.id, bystander2.id])];
                                case 4:
                                    event_1 = _g.sent();
                                    return [4 /*yield*/, setAttendeeStatuses(event_1.id, [{ id: target.id, status: status_2 }])];
                                case 5:
                                    _g.sent();
                                    return [4 /*yield*/, wait(undefined, 750)
                                        // 1 + 2. True positive / no false negative: target has the correct tag
                                    ]; // allow trigger to fire
                                case 6:
                                    _g.sent(); // allow trigger to fire
                                    // 1 + 2. True positive / no false negative: target has the correct tag
                                    return [4 /*yield*/, async_test("'".concat(status_2, "' fires its trigger for the target attendee"), function () { return tagsOf(target.id); }, { onResult: function (tags) { return tags.includes(TAG[status_2]); } })
                                        // 3. No false positive (wrong trigger): target has none of the other status tags
                                    ];
                                case 7:
                                    // 1 + 2. True positive / no false negative: target has the correct tag
                                    _g.sent();
                                    // 3. No false positive (wrong trigger): target has none of the other status tags
                                    return [4 /*yield*/, async_test("'".concat(status_2, "' does NOT fire any other status trigger for the target"), function () { return tagsOf(target.id); }, { onResult: function (tags) { return ALL_STATUSES.every(function (s) { return s === status_2 || !tags.includes(TAG[s]); }); } })
                                        // 4. No false positive (collateral): bystanders received zero tags
                                    ];
                                case 8:
                                    // 3. No false positive (wrong trigger): target has none of the other status tags
                                    _g.sent();
                                    // 4. No false positive (collateral): bystanders received zero tags
                                    return [4 /*yield*/, async_test("'".concat(status_2, "' does NOT fire for bystander attendee #1"), function () { return sdk.api.endusers.getOne(bystander1.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } })];
                                case 9:
                                    // 4. No false positive (collateral): bystanders received zero tags
                                    _g.sent();
                                    return [4 /*yield*/, async_test("'".concat(status_2, "' does NOT fire for bystander attendee #2"), function () { return sdk.api.endusers.getOne(bystander2.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } })];
                                case 10:
                                    _g.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _b = 0, ALL_STATUSES_2 = ALL_STATUSES;
                    _f.label = 6;
                case 6:
                    if (!(_b < ALL_STATUSES_2.length)) return [3 /*break*/, 9];
                    status_2 = ALL_STATUSES_2[_b];
                    return [5 /*yield**/, _loop_1(status_2)];
                case 7:
                    _f.sent();
                    _f.label = 8;
                case 8:
                    _b++;
                    return [3 /*break*/, 6];
                case 9:
                    // ============================================================
                    // Multiple distinct statuses set in one group event — no cross-talk.
                    // ============================================================
                    log_header("Multiple distinct per-attendee statuses in one group event");
                    return [4 /*yield*/, createEnduser()];
                case 10:
                    aCompleted_1 = _f.sent();
                    return [4 /*yield*/, createEnduser()];
                case 11:
                    bNoShow_1 = _f.sent();
                    return [4 /*yield*/, createEnduser()];
                case 12:
                    cCancelled_1 = _f.sent();
                    return [4 /*yield*/, createEnduser()];
                case 13:
                    dUnset_1 = _f.sent();
                    return [4 /*yield*/, createGroupEvent([aCompleted_1.id, bNoShow_1.id, cCancelled_1.id, dUnset_1.id])];
                case 14:
                    mixedEvent = _f.sent();
                    return [4 /*yield*/, setAttendeeStatuses(mixedEvent.id, [
                            { id: aCompleted_1.id, status: 'Completed' },
                            { id: bNoShow_1.id, status: 'No-showed' },
                            { id: cCancelled_1.id, status: 'Cancelled' },
                            // dUnset intentionally left without a status
                        ])];
                case 15:
                    _f.sent();
                    return [4 /*yield*/, wait(undefined, 1000)]; // allow all triggers to fire
                case 16:
                    _f.sent(); // allow all triggers to fire
                    return [4 /*yield*/, async_test("mixed: Completed attendee gets only the Completed tag", function () { return tagsOf(aCompleted_1.id); }, { onResult: function (tags) { return tags.includes(TAG['Completed']) && ALL_STATUSES.every(function (s) { return s === 'Completed' || !tags.includes(TAG[s]); }); } })];
                case 17:
                    _f.sent();
                    return [4 /*yield*/, async_test("mixed: No-showed attendee gets only the No-showed tag", function () { return tagsOf(bNoShow_1.id); }, { onResult: function (tags) { return tags.includes(TAG['No-showed']) && ALL_STATUSES.every(function (s) { return s === 'No-showed' || !tags.includes(TAG[s]); }); } })];
                case 18:
                    _f.sent();
                    return [4 /*yield*/, async_test("mixed: Cancelled attendee gets only the Cancelled tag", function () { return tagsOf(cCancelled_1.id); }, { onResult: function (tags) { return tags.includes(TAG['Cancelled']) && ALL_STATUSES.every(function (s) { return s === 'Cancelled' || !tags.includes(TAG[s]); }); } })];
                case 19:
                    _f.sent();
                    return [4 /*yield*/, async_test("mixed: unset attendee receives no tags", function () { return sdk.api.endusers.getOne(dUnset_1.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } })
                        // ============================================================
                        // Status transitions (A -> B): changing an attendee's status fires the NEW status's trigger.
                        // Exercises both directions of the cancelledGroupAttendees mirroring:
                        //   - mirrored -> unmirrored (No-showed -> Completed)
                        //   - unmirrored -> mirrored (Completed -> No-showed)
                        // The prior status's tag remains (it fired at its own transition); no spurious Cancelled fires
                        // from the cancelledGroupAttendees add/remove, and bystanders never fire.
                        // ============================================================
                    ];
                case 20:
                    _f.sent();
                    // ============================================================
                    // Status transitions (A -> B): changing an attendee's status fires the NEW status's trigger.
                    // Exercises both directions of the cancelledGroupAttendees mirroring:
                    //   - mirrored -> unmirrored (No-showed -> Completed)
                    //   - unmirrored -> mirrored (Completed -> No-showed)
                    // The prior status's tag remains (it fired at its own transition); no spurious Cancelled fires
                    // from the cancelledGroupAttendees add/remove, and bystanders never fire.
                    // ============================================================
                    log_header("Per-attendee status transitions fire the new status only");
                    return [4 /*yield*/, createEnduser()];
                case 21:
                    transA_1 = _f.sent();
                    return [4 /*yield*/, createEnduser()];
                case 22:
                    transABystander_1 = _f.sent();
                    return [4 /*yield*/, createGroupEvent([transA_1.id, transABystander_1.id])];
                case 23:
                    transAEvent = _f.sent();
                    return [4 /*yield*/, setAttendeeStatuses(transAEvent.id, [{ id: transA_1.id, status: 'No-showed' }])];
                case 24:
                    _f.sent();
                    return [4 /*yield*/, wait(undefined, 750)];
                case 25:
                    _f.sent();
                    return [4 /*yield*/, async_test("transition step 1: No-showed fires No-showed", function () { return tagsOf(transA_1.id); }, { onResult: function (tags) { return tags.includes(TAG['No-showed']); } })];
                case 26:
                    _f.sent();
                    return [4 /*yield*/, setAttendeeStatuses(transAEvent.id, [{ id: transA_1.id, status: 'Completed' }])];
                case 27:
                    _f.sent();
                    return [4 /*yield*/, wait(undefined, 750)];
                case 28:
                    _f.sent();
                    return [4 /*yield*/, async_test("transition No-showed -> Completed fires Completed (No-showed tag retained, no Cancelled)", function () { return tagsOf(transA_1.id); }, { onResult: function (tags) {
                                return tags.includes(TAG['Completed'])
                                    && tags.includes(TAG['No-showed'])
                                    && !tags.includes(TAG['Cancelled'])
                                    && !tags.includes(TAG['Rescheduled']);
                            }
                        })];
                case 29:
                    _f.sent();
                    return [4 /*yield*/, async_test("transition (mirrored->unmirrored): bystander never fires", function () { return sdk.api.endusers.getOne(transABystander_1.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } })
                        // unmirrored -> mirrored
                    ];
                case 30:
                    _f.sent();
                    return [4 /*yield*/, createEnduser()];
                case 31:
                    transB_1 = _f.sent();
                    return [4 /*yield*/, createEnduser()];
                case 32:
                    transBBystander_1 = _f.sent();
                    return [4 /*yield*/, createGroupEvent([transB_1.id, transBBystander_1.id])];
                case 33:
                    transBEvent = _f.sent();
                    return [4 /*yield*/, setAttendeeStatuses(transBEvent.id, [{ id: transB_1.id, status: 'Completed' }])];
                case 34:
                    _f.sent();
                    return [4 /*yield*/, wait(undefined, 750)];
                case 35:
                    _f.sent();
                    return [4 /*yield*/, setAttendeeStatuses(transBEvent.id, [{ id: transB_1.id, status: 'No-showed' }])];
                case 36:
                    _f.sent();
                    return [4 /*yield*/, wait(undefined, 750)];
                case 37:
                    _f.sent();
                    return [4 /*yield*/, async_test("transition Completed -> No-showed fires No-showed (Completed tag retained, no Cancelled)", function () { return tagsOf(transB_1.id); }, { onResult: function (tags) {
                                return tags.includes(TAG['No-showed'])
                                    && tags.includes(TAG['Completed'])
                                    && !tags.includes(TAG['Cancelled'])
                                    && !tags.includes(TAG['Rescheduled']);
                            }
                        })];
                case 38:
                    _f.sent();
                    return [4 /*yield*/, async_test("transition (unmirrored->mirrored): bystander never fires", function () { return sdk.api.endusers.getOne(transBBystander_1.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } })
                        // ============================================================
                        // 'by' filter on the per-attendee Cancelled path. The AttendeeStatusEditor update does not set
                        // statusChangeSource, so handle_cancelled_event's by-filter (which requires statusChangeSource
                        // to match 'user'/'enduser') excludes by-filtered triggers. Only the unfiltered (by: undefined)
                        // Cancelled trigger fires for a per-attendee cancellation. This pins current behavior; see the
                        // note returned with this change about whether by:'user' SHOULD fire here.
                        // ============================================================
                    ];
                case 39:
                    _f.sent();
                    // ============================================================
                    // 'by' filter on the per-attendee Cancelled path. The AttendeeStatusEditor update does not set
                    // statusChangeSource, so handle_cancelled_event's by-filter (which requires statusChangeSource
                    // to match 'user'/'enduser') excludes by-filtered triggers. Only the unfiltered (by: undefined)
                    // Cancelled trigger fires for a per-attendee cancellation. This pins current behavior; see the
                    // note returned with this change about whether by:'user' SHOULD fire here.
                    // ============================================================
                    log_header("Per-attendee Cancelled respects 'by' filter");
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Appointment Cancelled', info: { by: 'user' } },
                            action: { type: 'Add Tags', info: { tags: ['Group Attendee Cancelled by:user'] } },
                            status: 'Active',
                            title: "Group Attendee Cancelled by user",
                        })];
                case 40:
                    byUserTrigger = _f.sent();
                    createdTriggerIds.push(byUserTrigger.id);
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Appointment Cancelled', info: { by: 'enduser' } },
                            action: { type: 'Add Tags', info: { tags: ['Group Attendee Cancelled by:enduser'] } },
                            status: 'Active',
                            title: "Group Attendee Cancelled by enduser",
                        })];
                case 41:
                    byEnduserTrigger = _f.sent();
                    createdTriggerIds.push(byEnduserTrigger.id);
                    return [4 /*yield*/, createEnduser()];
                case 42:
                    byTarget_1 = _f.sent();
                    return [4 /*yield*/, createEnduser()];
                case 43:
                    byBystander_1 = _f.sent();
                    return [4 /*yield*/, createGroupEvent([byTarget_1.id, byBystander_1.id])];
                case 44:
                    byEvent = _f.sent();
                    return [4 /*yield*/, setAttendeeStatuses(byEvent.id, [{ id: byTarget_1.id, status: 'Cancelled' }])];
                case 45:
                    _f.sent();
                    return [4 /*yield*/, wait(undefined, 750)];
                case 46:
                    _f.sent();
                    return [4 /*yield*/, async_test("per-attendee cancel fires the unfiltered (by: undefined) Cancelled trigger", function () { return tagsOf(byTarget_1.id); }, { onResult: function (tags) { return tags.includes(TAG['Cancelled']); } })];
                case 47:
                    _f.sent();
                    return [4 /*yield*/, async_test("per-attendee cancel does NOT fire by:'enduser' Cancelled trigger", function () { return tagsOf(byTarget_1.id); }, { onResult: function (tags) { return !tags.includes('Group Attendee Cancelled by:enduser'); } })];
                case 48:
                    _f.sent();
                    return [4 /*yield*/, async_test("per-attendee cancel does NOT fire by:'user' Cancelled trigger (statusChangeSource unset)", function () { return tagsOf(byTarget_1.id); }, { onResult: function (tags) { return !tags.includes('Group Attendee Cancelled by:user'); } })];
                case 49:
                    _f.sent();
                    return [4 /*yield*/, async_test("'by' filter case: bystander never fires", function () { return sdk.api.endusers.getOne(byBystander_1.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } })
                        // ============================================================
                        // bulk_update cancel_for_attendee fires Cancelled exactly once (via the new handler;
                        // the legacy cancelledGroupAttendees branch is suppressed by the attendeeStatuses filter).
                        // ============================================================
                    ];
                case 50:
                    _f.sent();
                    // ============================================================
                    // bulk_update cancel_for_attendee fires Cancelled exactly once (via the new handler;
                    // the legacy cancelledGroupAttendees branch is suppressed by the attendeeStatuses filter).
                    // ============================================================
                    log_header("bulk_update cancel_for_attendee fires Cancelled for attendee");
                    return [4 /*yield*/, createEnduser()];
                case 51:
                    bulkTarget_1 = _f.sent();
                    return [4 /*yield*/, createEnduser()];
                case 52:
                    bulkBystander_1 = _f.sent();
                    now = Date.now();
                    DAY = 24 * 60 * 60 * 1000;
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Group Status Test',
                            durationInMinutes: 30,
                            startTimeInMS: now,
                            attendees: [{ type: 'enduser', id: bulkTarget_1.id }, { type: 'enduser', id: bulkBystander_1.id }],
                        })];
                case 53:
                    rootEvent = _f.sent();
                    createdEventIds.push(rootEvent.id);
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Group Status Test',
                            durationInMinutes: 30,
                            startTimeInMS: now + DAY,
                            copiedFrom: rootEvent.id,
                            attendees: [{ type: 'enduser', id: bulkTarget_1.id }, { type: 'enduser', id: bulkBystander_1.id }],
                        })];
                case 54:
                    childEvent = _f.sent();
                    createdEventIds.push(childEvent.id);
                    return [4 /*yield*/, sdk.api.calendar_events.bulk_update({
                            recurringEventId: rootEvent.id,
                            action: 'cancel_for_attendee',
                            scope: 'all',
                            enduserId: bulkTarget_1.id,
                        })];
                case 55:
                    _f.sent();
                    return [4 /*yield*/, wait(undefined, 750)];
                case 56:
                    _f.sent();
                    return [4 /*yield*/, async_test("cancel_for_attendee fires Cancelled trigger for the target", function () { return tagsOf(bulkTarget_1.id); }, { onResult: function (tags) { return tags.includes(TAG['Cancelled']); } })];
                case 57:
                    _f.sent();
                    return [4 /*yield*/, async_test("cancel_for_attendee does NOT fire for the bystander", function () { return sdk.api.endusers.getOne(bulkBystander_1.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } })
                        // ============================================================
                        // 'Confirmed' and clearing a status fire nothing.
                        // ============================================================
                    ];
                case 58:
                    _f.sent();
                    // ============================================================
                    // 'Confirmed' and clearing a status fire nothing.
                    // ============================================================
                    log_header("Confirmed / cleared statuses fire no triggers");
                    return [4 /*yield*/, createEnduser()];
                case 59:
                    confirmEnduser_1 = _f.sent();
                    return [4 /*yield*/, createEnduser()];
                case 60:
                    clearEnduser_1 = _f.sent();
                    return [4 /*yield*/, createGroupEvent([confirmEnduser_1.id, clearEnduser_1.id])
                        // set clearEnduser to No-showed, then clear it; set confirmEnduser to Confirmed
                    ];
                case 61:
                    noopEvent = _f.sent();
                    // set clearEnduser to No-showed, then clear it; set confirmEnduser to Confirmed
                    return [4 /*yield*/, setAttendeeStatuses(noopEvent.id, [{ id: clearEnduser_1.id, status: 'No-showed' }])];
                case 62:
                    // set clearEnduser to No-showed, then clear it; set confirmEnduser to Confirmed
                    _f.sent();
                    return [4 /*yield*/, wait(undefined, 750)];
                case 63:
                    _f.sent();
                    return [4 /*yield*/, setAttendeeStatuses(noopEvent.id, [{ id: confirmEnduser_1.id, status: 'Confirmed' }])]; // also clears clearEnduser
                case 64:
                    _f.sent(); // also clears clearEnduser
                    return [4 /*yield*/, wait(undefined, 750)];
                case 65:
                    _f.sent();
                    return [4 /*yield*/, async_test("'Confirmed' status fires no trigger", function () { return sdk.api.endusers.getOne(confirmEnduser_1.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } })
                        // clearEnduser previously got the No-showed tag (that firing is expected); clearing must not
                        // add anything new. Assert it still has exactly the one No-showed tag and nothing else.
                    ];
                case 66:
                    _f.sent();
                    // clearEnduser previously got the No-showed tag (that firing is expected); clearing must not
                    // add anything new. Assert it still has exactly the one No-showed tag and nothing else.
                    return [4 /*yield*/, async_test("clearing a status fires no additional trigger", function () { return tagsOf(clearEnduser_1.id); }, { onResult: function (tags) { return tags.length === 1 && tags.includes(TAG['No-showed']); } })];
                case 67:
                    // clearEnduser previously got the No-showed tag (that firing is expected); clearing must not
                    // add anything new. Assert it still has exactly the one No-showed tag and nothing else.
                    _f.sent();
                    return [3 /*break*/, 87];
                case 68:
                    _c = 0, createdEventIds_1 = createdEventIds;
                    _f.label = 69;
                case 69:
                    if (!(_c < createdEventIds_1.length)) return [3 /*break*/, 74];
                    id = createdEventIds_1[_c];
                    _f.label = 70;
                case 70:
                    _f.trys.push([70, 72, , 73]);
                    return [4 /*yield*/, sdk.api.calendar_events.deleteOne(id)];
                case 71:
                    _f.sent();
                    return [3 /*break*/, 73];
                case 72:
                    _1 = _f.sent();
                    return [3 /*break*/, 73];
                case 73:
                    _c++;
                    return [3 /*break*/, 69];
                case 74:
                    _d = 0, createdEnduserIds_1 = createdEnduserIds;
                    _f.label = 75;
                case 75:
                    if (!(_d < createdEnduserIds_1.length)) return [3 /*break*/, 80];
                    id = createdEnduserIds_1[_d];
                    _f.label = 76;
                case 76:
                    _f.trys.push([76, 78, , 79]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(id)];
                case 77:
                    _f.sent();
                    return [3 /*break*/, 79];
                case 78:
                    _2 = _f.sent();
                    return [3 /*break*/, 79];
                case 79:
                    _d++;
                    return [3 /*break*/, 75];
                case 80:
                    _e = 0, createdTriggerIds_1 = createdTriggerIds;
                    _f.label = 81;
                case 81:
                    if (!(_e < createdTriggerIds_1.length)) return [3 /*break*/, 86];
                    id = createdTriggerIds_1[_e];
                    _f.label = 82;
                case 82:
                    _f.trys.push([82, 84, , 85]);
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(id)];
                case 83:
                    _f.sent();
                    return [3 /*break*/, 85];
                case 84:
                    _3 = _f.sent();
                    return [3 /*break*/, 85];
                case 85:
                    _e++;
                    return [3 /*break*/, 81];
                case 86: return [7 /*endfinally*/];
                case 87: return [2 /*return*/];
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
                    return [4 /*yield*/, group_event_attendee_status_triggers_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Group event per-attendee status trigger tests completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Group event per-attendee status trigger tests failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=group_event_attendee_status_triggers.test.js.map