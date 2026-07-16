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
exports.enduser_cross_access_isolation_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var schema_1 = require("@tellescope/schema");
var setup_1 = require("../setup");
var host = process.env.API_URL || 'http://localhost:8080';
var businessId = '60398b1131a295e64f084ff6';
var buildAttendees = function (enduserId) { return [{ id: enduserId, type: 'enduser' }]; };
// Per-model coverage of every enduser-scoped read / ownership-mutation endpoint.
// New enduser-scoped models added with a FilterAccessConstraint on enduserId,
// enduserIds, or attendees.id MUST be added here (or to EXEMPT_MODELS) — the
// schema drift guard below will fail the test until coverage is added.
var MODEL_CASES = [
    {
        model: 'tickets',
        ownerField: 'enduserId',
        buildPayload: function (enduserBId) { return ({ enduserId: enduserBId, title: 'isolation: ticket' }); },
    },
    {
        model: 'engagement_events',
        ownerField: 'enduserId',
        buildPayload: function (enduserBId) { return ({ enduserId: enduserBId, type: 'isolation', significance: 1 }); },
    },
    {
        model: 'enduser_observations',
        ownerField: 'enduserId',
        buildPayload: function (enduserBId) { return ({
            enduserId: enduserBId,
            status: 'final',
            category: 'vital-signs',
            measurement: { unit: 'mmHg', value: 120 },
        }); },
    },
    {
        model: 'enduser_tasks',
        ownerField: 'enduserId',
        buildPayload: function (enduserBId) { return ({ enduserId: enduserBId, title: 'isolation: task' }); },
    },
    {
        model: 'care_plans',
        ownerField: 'enduserId',
        buildPayload: function (enduserBId) { return ({ enduserId: enduserBId, title: 'isolation: care plan' }); },
    },
    {
        model: 'enduser_medications',
        ownerField: 'enduserId',
        buildPayload: function (enduserBId) { return ({ enduserId: enduserBId, title: 'isolation: medication' }); },
    },
    {
        model: 'enduser_orders',
        ownerField: 'enduserId',
        buildPayload: function (enduserBId) { return ({
            enduserId: enduserBId,
            title: 'isolation: order',
            status: 'pending',
            source: 'isolation-test',
            externalId: "iso-".concat(Date.now()),
        }); },
    },
    {
        model: 'enduser_problems',
        ownerField: 'enduserId',
        buildPayload: function (enduserBId) { return ({
            enduserId: enduserBId,
            title: 'isolation: problem',
        }); },
    },
    {
        model: 'managed_content_record_assignments',
        ownerField: 'enduserId',
        setup: function (sdk, _enduserBId) { return __awaiter(void 0, void 0, void 0, function () {
            var content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sdk.api.managed_content_records.createOne({
                            title: "isolation content ".concat(Date.now()),
                            textContent: 'isolation',
                            htmlContent: '<p>isolation</p>',
                        })];
                    case 1:
                        content = _a.sent();
                        return [2 /*return*/, {
                                payloadOverride: { contentId: content.id },
                                cleanup: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, sdk.api.managed_content_records.deleteOne(content.id).catch(function () { })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                }); }); },
                            }];
                }
            });
        }); },
        buildPayload: function (enduserBId) { return ({ enduserId: enduserBId }); },
    },
    {
        model: 'purchases',
        ownerField: 'enduserId',
        buildPayload: function (enduserBId) { return ({
            enduserId: enduserBId,
            title: 'isolation: purchase',
            cost: { amount: 100, currency: 'USD' },
            processor: 'Stripe',
        }); },
    },
    {
        model: 'purchase_credits',
        ownerField: 'enduserId',
        buildPayload: function (enduserBId) { return ({
            enduserId: enduserBId,
            title: 'isolation: credit',
            value: { type: 'Credit', info: { amount: 50, currency: 'USD' } },
        }); },
    },
    {
        model: 'chat_rooms',
        ownerField: 'enduserIds',
        buildPayload: function (enduserBId) { return ({
            type: 'internal',
            userIds: [],
            enduserIds: [enduserBId],
            title: 'isolation: chat_room',
        }); },
    },
    {
        model: 'chats',
        ownerField: 'enduserId',
        setup: function (sdk, enduserBId) { return __awaiter(void 0, void 0, void 0, function () {
            var room;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sdk.api.chat_rooms.createOne({
                            type: 'internal',
                            userIds: [],
                            enduserIds: [enduserBId],
                            title: 'isolation: chats parent',
                        })];
                    case 1:
                        room = _a.sent();
                        return [2 /*return*/, {
                                payloadOverride: { roomId: room.id, senderId: enduserBId },
                                cleanup: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, sdk.api.chat_rooms.deleteOne(room.id).catch(function () { })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                }); }); },
                            }];
                }
            });
        }); },
        buildPayload: function (enduserBId) { return ({ message: 'isolation chat', enduserId: enduserBId }); },
    },
    {
        model: 'calendar_events',
        ownerField: 'attendees.id',
        buildPayload: function (enduserBId) { return ({
            title: 'isolation: calendar_event',
            durationInMinutes: 30,
            startTimeInMS: Date.now() + 86400000,
            attendees: buildAttendees(enduserBId),
        }); },
    },
    {
        model: 'ticket_threads',
        ownerField: 'enduserId',
        buildPayload: function (enduserBId) { return ({
            enduserId: enduserBId,
            subject: 'isolation: thread',
        }); },
    },
    {
        model: 'ticket_thread_comments',
        ownerField: 'enduserId',
        setup: function (sdk, enduserBId) { return __awaiter(void 0, void 0, void 0, function () {
            var thread;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sdk.api.ticket_threads.createOne({
                            enduserId: enduserBId,
                            subject: 'isolation: thread comments parent',
                        })];
                    case 1:
                        thread = _a.sent();
                        return [2 /*return*/, {
                                payloadOverride: { ticketThreadId: thread.id },
                                cleanup: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, sdk.api.ticket_threads.deleteOne(thread.id).catch(function () { })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                }); }); },
                            }];
                }
            });
        }); },
        buildPayload: function (enduserBId) { return ({
            enduserId: enduserBId,
            ticketThreadId: '',
            html: '<p>isolation</p>',
            plaintext: 'isolation',
            inbound: true,
            public: false,
        }); },
    },
    {
        model: 'form_responses',
        ownerField: 'enduserId',
        setup: function (sdk, _enduserBId) { return __awaiter(void 0, void 0, void 0, function () {
            var form;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sdk.api.forms.createOne({ title: "isolation form ".concat(Date.now()) })];
                    case 1:
                        form = _a.sent();
                        return [2 /*return*/, {
                                payloadOverride: { formId: form.id },
                                cleanup: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, sdk.api.forms.deleteOne(form.id).catch(function () { })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                }); }); },
                            }];
                }
            });
        }); },
        buildPayload: function (enduserBId) { return ({
            enduserId: enduserBId,
            formId: '',
            formTitle: 'isolation form',
        }); },
    },
    {
        model: 'enduser_eligibility_results',
        ownerField: 'enduserId',
        buildPayload: function (enduserBId) { return ({
            enduserId: enduserBId,
            title: 'isolation: eligibility',
            type: 'Prescription',
            externalId: "iso-".concat(Date.now()),
            source: 'isolation-test',
            status: 'Pending',
        }); },
    },
];
var COVERED_MODELS = new Set(MODEL_CASES.map(function (c) { return c.model; }));
// Models that have a FilterAccessConstraint on enduserId / enduserIds /
// attendees.id but are intentionally NOT exercised here. Each entry must
// include a one-line reason. Empty by default; add only with justification.
var EXEMPT_MODELS = [
    {
        model: 'meetings',
        reason: 'No default CRUD ops — created via admin-only start_meeting and read by endusers via custom my_meetings/read/join_meeting_for_event actions, which do not match this fixture pattern.',
    },
];
var RELEVANT_OWNER_FIELDS = new Set(['enduserId', 'enduserIds', 'attendees.id']);
var discoverEnduserScopedModels = function () {
    var _a;
    var found = [];
    for (var _i = 0, _b = Object.keys(schema_1.schema); _i < _b.length; _i++) {
        var name_1 = _b[_i];
        var model = schema_1.schema[name_1];
        var access = (_a = model === null || model === void 0 ? void 0 : model.constraints) === null || _a === void 0 ? void 0 : _a.access;
        if (!access)
            continue;
        var hasFilter = access.some(function (c) { return (c === null || c === void 0 ? void 0 : c.type) === 'filter' && typeof c.field === 'string' && RELEVANT_OWNER_FIELDS.has(c.field); });
        if (hasFilter)
            found.push(name_1);
    }
    return found;
};
var assertNotPresent = function (records, id, label) {
    (0, testing_1.assert)(!records.find(function (r) { return r.id === id; }), "".concat(label, " returned record owned by other enduser (id=").concat(id, ")"), label);
};
var expectForbidden = function (label, run) { return (0, testing_1.async_test)(label, run, testing_1.handleAnyError); };
var expectEmptyOrForbidden = function (label, run) { return (0, testing_1.async_test)(label, function () { return __awaiter(void 0, void 0, void 0, function () {
    var r, _e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, run()];
            case 1:
                r = _a.sent();
                return [2 /*return*/, { rejected: false, length: r.length }];
            case 2:
                _e_1 = _a.sent();
                return [2 /*return*/, { rejected: true, length: 0 }];
            case 3: return [2 /*return*/];
        }
    });
}); }, { onResult: function (r) { return r.rejected || r.length === 0; } }); };
var expectMatchesEmptyOrForbidden = function (label, run) { return (0, testing_1.async_test)(label, function () { return __awaiter(void 0, void 0, void 0, function () {
    var r, _e_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, run()];
            case 1:
                r = _b.sent();
                return [2 /*return*/, { rejected: false, length: ((_a = r === null || r === void 0 ? void 0 : r.matches) !== null && _a !== void 0 ? _a : []).length }];
            case 2:
                _e_2 = _b.sent();
                return [2 /*return*/, { rejected: true, length: 0 }];
            case 3: return [2 /*return*/];
        }
    });
}); }, { onResult: function (r) { return r.rejected || r.length === 0; } }); };
var expectGetOneFails = function (label, run) { return (0, testing_1.async_test)(label, function () { return __awaiter(void 0, void 0, void 0, function () {
    var r, _e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, run()
                    // some models may return undefined on no-match; that's also acceptable
                ];
            case 1:
                r = _a.sent();
                // some models may return undefined on no-match; that's also acceptable
                return [2 /*return*/, { rejected: false, found: !!r }];
            case 2:
                _e_3 = _a.sent();
                return [2 /*return*/, { rejected: true, found: false }];
            case 3: return [2 /*return*/];
        }
    });
}); }, { onResult: function (r) { return r.rejected || !r.found; } }); };
var recordHasOwner = function (record, ownerField, enduserId) {
    if (!record)
        return false;
    if (ownerField === 'enduserId')
        return record.enduserId === enduserId;
    if (ownerField === 'enduserIds')
        return Array.isArray(record.enduserIds) && record.enduserIds.includes(enduserId);
    if (ownerField === 'attendees.id')
        return Array.isArray(record.attendees) && record.attendees.some(function (a) { return (a === null || a === void 0 ? void 0 : a.id) === enduserId; });
    return false;
};
var enduser_cross_access_isolation_tests = function (_a) {
    var sdk = _a.sdk, _sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var discovered, exemptSet, missing, password, ts, enduserA, enduserB, sdkA, sdkB, selfUpdateResponse, adminUpdateResponse, _loop_1, _i, MODEL_CASES_1, c;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    (0, testing_1.log_header)("Enduser cross-access isolation");
                    discovered = discoverEnduserScopedModels();
                    exemptSet = new Set(EXEMPT_MODELS.map(function (e) { return e.model; }));
                    missing = discovered.filter(function (m) { return !COVERED_MODELS.has(m) && !exemptSet.has(m); });
                    (0, testing_1.assert)(missing.length === 0, "Missing isolation coverage for enduser-scoped models: ".concat(missing.join(', '), ". ") +
                        "Add to MODEL_CASES or EXEMPT_MODELS in enduser_cross_access_isolation.test.ts.", 'schema drift guard: every FilterAccessConstraint on enduserId/enduserIds/attendees.id is covered');
                    password = 'IsolationTestPassword123!';
                    ts = Date.now();
                    return [4 /*yield*/, sdk.api.endusers.createOne({ email: "iso_a_".concat(ts, "@test.tellescope.com") })];
                case 1:
                    enduserA = _c.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({ email: "iso_b_".concat(ts, "@test.tellescope.com") })];
                case 2:
                    enduserB = _c.sent();
                    return [4 /*yield*/, sdk.api.endusers.set_password({ id: enduserA.id, password: password })];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, sdk.api.endusers.set_password({ id: enduserB.id, password: password })];
                case 4:
                    _c.sent();
                    sdkA = new sdk_1.EnduserSession({ host: host, businessId: businessId });
                    sdkB = new sdk_1.EnduserSession({ host: host, businessId: businessId });
                    _c.label = 5;
                case 5:
                    _c.trys.push([5, , 14, 17]);
                    // Sanity check: each enduser session can be established. We only use sdkA
                    // for negative assertions, but a failed sdkB session would mean the test
                    // data setup itself is malformed. (Token-based to spare the IP-rate-limited /login-enduser.)
                    return [4 /*yield*/, (0, setup_1.authenticate_enduser_via_token)(sdk, sdkA, { id: enduserA.id })];
                case 6:
                    // Sanity check: each enduser session can be established. We only use sdkA
                    // for negative assertions, but a failed sdkB session would mean the test
                    // data setup itself is malformed. (Token-based to spare the IP-rate-limited /login-enduser.)
                    _c.sent();
                    return [4 /*yield*/, (0, setup_1.authenticate_enduser_via_token)(sdk, sdkB, { id: enduserB.id })
                        // Regression guard: hashedPassword must never appear in updateOne responses,
                        // for either enduser self-update or admin-side update of an enduser.
                    ];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, sdkA.api.endusers.updateOne(enduserA.id, { fname: 'RedactionProbe' })];
                case 8:
                    selfUpdateResponse = _c.sent();
                    (0, testing_1.assert)(!!selfUpdateResponse && selfUpdateResponse.fname === 'RedactionProbe', 'enduser self-update: response should reflect the applied update', 'enduser self-update: update applied (sanity)');
                    (0, testing_1.assert)(selfUpdateResponse.hashedPassword === undefined, 'enduser self-update: hashedPassword leaked in response', 'enduser self-update: hashedPassword redacted from response');
                    return [4 /*yield*/, sdk.api.endusers.updateOne(enduserA.id, { fname: 'AdminProbe' })];
                case 9:
                    adminUpdateResponse = _c.sent();
                    (0, testing_1.assert)(!!adminUpdateResponse && adminUpdateResponse.fname === 'AdminProbe', 'admin update of enduser: response should reflect the applied update', 'admin update of enduser: update applied (sanity)');
                    (0, testing_1.assert)(adminUpdateResponse.hashedPassword === undefined, 'admin update of enduser: hashedPassword leaked in response', 'admin update of enduser: hashedPassword redacted from response');
                    _loop_1 = function (c) {
                        var sublog, setupResult, e_1, payload, createdId, created, e_2, enduserApi, _d;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    sublog = function (variant) { return "".concat(c.model, ": ").concat(variant); };
                                    setupResult = void 0;
                                    if (!c.setup) return [3 /*break*/, 4];
                                    _f.label = 1;
                                case 1:
                                    _f.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, c.setup(sdk, enduserB.id)];
                                case 2:
                                    setupResult = _f.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    e_1 = _f.sent();
                                    (0, testing_1.assert)(false, "".concat(c.model, ": setup hook failed: ").concat(e_1.message), sublog('setup'));
                                    return [2 /*return*/, "continue"];
                                case 4:
                                    payload = __assign(__assign({}, c.buildPayload(enduserB.id)), ((_b = setupResult === null || setupResult === void 0 ? void 0 : setupResult.payloadOverride) !== null && _b !== void 0 ? _b : {}));
                                    _f.label = 5;
                                case 5:
                                    _f.trys.push([5, 7, , 10]);
                                    return [4 /*yield*/, sdk.api[c.model].createOne(payload)];
                                case 6:
                                    created = _f.sent();
                                    createdId = created === null || created === void 0 ? void 0 : created.id;
                                    return [3 /*break*/, 10];
                                case 7:
                                    e_2 = _f.sent();
                                    (0, testing_1.assert)(false, "".concat(c.model, ": admin createOne failed: ").concat(e_2.message), sublog('admin createOne'));
                                    if (!setupResult) return [3 /*break*/, 9];
                                    return [4 /*yield*/, setupResult.cleanup().catch(function () { })];
                                case 8:
                                    _f.sent();
                                    _f.label = 9;
                                case 9: return [2 /*return*/, "continue"];
                                case 10:
                                    if (!!createdId) return [3 /*break*/, 13];
                                    (0, testing_1.assert)(false, "".concat(c.model, ": admin createOne did not return an id"), sublog('admin createOne'));
                                    if (!setupResult) return [3 /*break*/, 12];
                                    return [4 /*yield*/, setupResult.cleanup().catch(function () { })];
                                case 11:
                                    _f.sent();
                                    _f.label = 12;
                                case 12: return [2 /*return*/, "continue"];
                                case 13:
                                    enduserApi = sdkA.api[c.model];
                                    _f.label = 14;
                                case 14:
                                    _f.trys.push([14, , 27, 33]);
                                    // 0a. Fixture sanity: admin can re-fetch the record AND its owner
                                    // field is actually set to enduser B. Without this, A's negative
                                    // assertions could pass trivially (e.g. if createOne silently
                                    // dropped the ownership field, no enduser would ever match).
                                    return [4 /*yield*/, (0, testing_1.async_test)(sublog('fixture: admin re-fetch confirms ownership set to enduser B'), function () { return __awaiter(void 0, void 0, void 0, function () {
                                            var fetched;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, sdk.api[c.model].getOne(createdId)];
                                                    case 1:
                                                        fetched = _a.sent();
                                                        return [2 /*return*/, { fetched: fetched, owned: recordHasOwner(fetched, c.ownerField, enduserB.id) }];
                                                }
                                            });
                                        }); }, { onResult: function (r) { return !!r.fetched && r.owned === true; } })
                                        // 0b. Fixture sanity: enduser B (the legitimate owner) can see the
                                        // record via getOne. Models that block all enduser reads (empty
                                        // enduserActions) will reject — that's accepted. The check fails
                                        // only if B is "found" returns a different record id.
                                    ];
                                case 15:
                                    // 0a. Fixture sanity: admin can re-fetch the record AND its owner
                                    // field is actually set to enduser B. Without this, A's negative
                                    // assertions could pass trivially (e.g. if createOne silently
                                    // dropped the ownership field, no enduser would ever match).
                                    _f.sent();
                                    // 0b. Fixture sanity: enduser B (the legitimate owner) can see the
                                    // record via getOne. Models that block all enduser reads (empty
                                    // enduserActions) will reject — that's accepted. The check fails
                                    // only if B is "found" returns a different record id.
                                    return [4 /*yield*/, (0, testing_1.async_test)(sublog('fixture: owner enduser B can fetch own record (or model blocks endusers)'), function () { return __awaiter(void 0, void 0, void 0, function () {
                                            var fetched, _e_4;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        _a.trys.push([0, 2, , 3]);
                                                        return [4 /*yield*/, sdkB.api[c.model].getOne(createdId)];
                                                    case 1:
                                                        fetched = _a.sent();
                                                        return [2 /*return*/, { rejected: false, matched: !!fetched && fetched.id === createdId }];
                                                    case 2:
                                                        _e_4 = _a.sent();
                                                        return [2 /*return*/, { rejected: true, matched: false }];
                                                    case 3: return [2 /*return*/];
                                                }
                                            });
                                        }); }, { onResult: function (r) { return r.rejected || r.matched; } })
                                        // 1. getOne by id — expect throw or undefined
                                    ];
                                case 16:
                                    // 0b. Fixture sanity: enduser B (the legitimate owner) can see the
                                    // record via getOne. Models that block all enduser reads (empty
                                    // enduserActions) will reject — that's accepted. The check fails
                                    // only if B is "found" returns a different record id.
                                    _f.sent();
                                    // 1. getOne by id — expect throw or undefined
                                    return [4 /*yield*/, expectGetOneFails(sublog('getOne by id rejects or returns nothing'), function () { return enduserApi.getOne(createdId); })
                                        // 2. getOne by ownership filter — expect throw or undefined
                                    ];
                                case 17:
                                    // 1. getOne by id — expect throw or undefined
                                    _f.sent();
                                    // 2. getOne by ownership filter — expect throw or undefined
                                    return [4 /*yield*/, expectGetOneFails(sublog('getOne by owner filter rejects or returns nothing'), function () {
                                            var _a;
                                            return enduserApi.getOne((_a = {}, _a[c.ownerField] = enduserB.id, _a));
                                        })
                                        // 3. getSome (no filter) — record must not appear (or call rejected)
                                    ];
                                case 18:
                                    // 2. getOne by ownership filter — expect throw or undefined
                                    _f.sent();
                                    // 3. getSome (no filter) — record must not appear (or call rejected)
                                    return [4 /*yield*/, (0, testing_1.async_test)(sublog('getSome (no filter) excludes other-enduser record'), function () { return __awaiter(void 0, void 0, void 0, function () {
                                            var records, _e_5;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        _a.trys.push([0, 2, , 3]);
                                                        return [4 /*yield*/, enduserApi.getSome({})];
                                                    case 1:
                                                        records = _a.sent();
                                                        return [2 /*return*/, { rejected: false, hasRecord: !!records.find(function (r) { return r.id === createdId; }) }];
                                                    case 2:
                                                        _e_5 = _a.sent();
                                                        return [2 /*return*/, { rejected: true, hasRecord: false }];
                                                    case 3: return [2 /*return*/];
                                                }
                                            });
                                        }); }, { onResult: function (r) { return r.rejected || !r.hasRecord; } })
                                        // 4. getSome (owner filter) — must be empty (or rejected)
                                    ];
                                case 19:
                                    // 3. getSome (no filter) — record must not appear (or call rejected)
                                    _f.sent();
                                    // 4. getSome (owner filter) — must be empty (or rejected)
                                    return [4 /*yield*/, expectEmptyOrForbidden(sublog('getSome (owner filter) returns empty or rejects'), function () {
                                            var _a;
                                            return enduserApi.getSome({ filter: (_a = {}, _a[c.ownerField] = enduserB.id, _a) });
                                        })
                                        // 5. getByIds — matches must be empty (or rejected)
                                    ];
                                case 20:
                                    // 4. getSome (owner filter) — must be empty (or rejected)
                                    _f.sent();
                                    // 5. getByIds — matches must be empty (or rejected)
                                    return [4 /*yield*/, expectMatchesEmptyOrForbidden(sublog('getByIds returns no matches or rejects'), function () { return enduserApi.getByIds({ ids: [createdId] }); })
                                        // 6. /bulk-actions/read with owner filter
                                    ];
                                case 21:
                                    // 5. getByIds — matches must be empty (or rejected)
                                    _f.sent();
                                    // 6. /bulk-actions/read with owner filter
                                    return [4 /*yield*/, (0, testing_1.async_test)(sublog('bulk_load (owner filter) returns null or empty for other-enduser data'), function () { return __awaiter(void 0, void 0, void 0, function () {
                                            var r, result, _e_6;
                                            var _a;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0:
                                                        _b.trys.push([0, 2, , 3]);
                                                        return [4 /*yield*/, sdkA.bulk_load({
                                                                load: [{
                                                                        model: c.model,
                                                                        options: { filter: (_a = {}, _a[c.ownerField] = enduserB.id, _a) },
                                                                    }],
                                                            })];
                                                    case 1:
                                                        r = _b.sent();
                                                        result = r.results[0];
                                                        if (result === null)
                                                            return [2 /*return*/, { ok: true }];
                                                        return [2 /*return*/, { ok: result.records.length === 0, count: result.records.length }];
                                                    case 2:
                                                        _e_6 = _b.sent();
                                                        return [2 /*return*/, { ok: true }]; // rejection is also safe
                                                    case 3: return [2 /*return*/];
                                                }
                                            });
                                        }); }, { onResult: function (r) { return r.ok === true; } })
                                        // 7. /bulk-actions/read with no filter — record must not appear
                                    ];
                                case 22:
                                    // 6. /bulk-actions/read with owner filter
                                    _f.sent();
                                    // 7. /bulk-actions/read with no filter — record must not appear
                                    return [4 /*yield*/, (0, testing_1.async_test)(sublog('bulk_load (no filter) excludes other-enduser record'), function () { return __awaiter(void 0, void 0, void 0, function () {
                                            var r, result, _e_7;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        _a.trys.push([0, 2, , 3]);
                                                        return [4 /*yield*/, sdkA.bulk_load({
                                                                load: [{ model: c.model, options: {} }],
                                                            })];
                                                    case 1:
                                                        r = _a.sent();
                                                        result = r.results[0];
                                                        if (result === null)
                                                            return [2 /*return*/, { ok: true }];
                                                        return [2 /*return*/, { ok: !result.records.find(function (rec) { return rec.id === createdId; }) }];
                                                    case 2:
                                                        _e_7 = _a.sent();
                                                        return [2 /*return*/, { ok: true }];
                                                    case 3: return [2 /*return*/];
                                                }
                                            });
                                        }); }, { onResult: function (r) { return r.ok === true; } })
                                        // 8. updateOne — expect throw
                                    ];
                                case 23:
                                    // 7. /bulk-actions/read with no filter — record must not appear
                                    _f.sent();
                                    // 8. updateOne — expect throw
                                    return [4 /*yield*/, expectForbidden(sublog('updateOne rejects'), function () { return enduserApi.updateOne(createdId, { /* no-op-ish update */}); })
                                        // 9. deleteOne — expect throw
                                    ];
                                case 24:
                                    // 8. updateOne — expect throw
                                    _f.sent();
                                    // 9. deleteOne — expect throw
                                    return [4 /*yield*/, expectForbidden(sublog('deleteOne rejects'), function () { return enduserApi.deleteOne(createdId); })
                                        // After all attempted writes, confirm the record still exists when
                                        // fetched as admin — i.e. enduser A's failed update/delete were no-ops.
                                    ];
                                case 25:
                                    // 9. deleteOne — expect throw
                                    _f.sent();
                                    // After all attempted writes, confirm the record still exists when
                                    // fetched as admin — i.e. enduser A's failed update/delete were no-ops.
                                    return [4 /*yield*/, (0, testing_1.async_test)(sublog('record still exists after failed enduser writes (admin verify)'), function () { return __awaiter(void 0, void 0, void 0, function () {
                                            var found, _a;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0:
                                                        _b.trys.push([0, 2, , 3]);
                                                        return [4 /*yield*/, sdk.api[c.model].getOne(createdId)];
                                                    case 1:
                                                        found = _b.sent();
                                                        return [2 /*return*/, !!found && found.id === createdId];
                                                    case 2:
                                                        _a = _b.sent();
                                                        return [2 /*return*/, false];
                                                    case 3: return [2 /*return*/];
                                                }
                                            });
                                        }); }, { onResult: function (r) { return r === true; } })];
                                case 26:
                                    // After all attempted writes, confirm the record still exists when
                                    // fetched as admin — i.e. enduser A's failed update/delete were no-ops.
                                    _f.sent();
                                    return [3 /*break*/, 33];
                                case 27:
                                    _f.trys.push([27, 29, , 30]);
                                    return [4 /*yield*/, sdk.api[c.model].deleteOne(createdId).catch(function () { })];
                                case 28:
                                    _f.sent();
                                    return [3 /*break*/, 30];
                                case 29:
                                    _d = _f.sent();
                                    return [3 /*break*/, 30];
                                case 30:
                                    if (!setupResult) return [3 /*break*/, 32];
                                    return [4 /*yield*/, setupResult.cleanup().catch(function () { })];
                                case 31:
                                    _f.sent();
                                    _f.label = 32;
                                case 32: return [7 /*endfinally*/];
                                case 33: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, MODEL_CASES_1 = MODEL_CASES;
                    _c.label = 10;
                case 10:
                    if (!(_i < MODEL_CASES_1.length)) return [3 /*break*/, 13];
                    c = MODEL_CASES_1[_i];
                    return [5 /*yield**/, _loop_1(c)];
                case 11:
                    _c.sent();
                    _c.label = 12;
                case 12:
                    _i++;
                    return [3 /*break*/, 10];
                case 13: return [3 /*break*/, 17];
                case 14: return [4 /*yield*/, sdk.api.endusers.deleteOne(enduserA.id).catch(function () { })];
                case 15:
                    _c.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduserB.id).catch(function () { })];
                case 16:
                    _c.sent();
                    return [7 /*endfinally*/];
                case 17: return [2 /*return*/];
            }
        });
    });
};
exports.enduser_cross_access_isolation_tests = enduser_cross_access_isolation_tests;
if (require.main === module) {
    console.log("Using API URL: ".concat(host));
    var sdk_2 = new sdk_1.Session({ host: host });
    var sdkNonAdmin_1 = new sdk_1.Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, setup_1.setup_tests)(sdk_2, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, exports.enduser_cross_access_isolation_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("Enduser cross-access isolation test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("Enduser cross-access isolation test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=enduser_cross_access_isolation.test.js.map