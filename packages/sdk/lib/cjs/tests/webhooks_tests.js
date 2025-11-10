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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var crypto_1 = __importDefault(require("crypto"));
var testing_1 = require("@tellescope/testing");
var utilities_1 = require("@tellescope/utilities");
var types_models_1 = require("@tellescope/types-models");
var sdk_1 = require("../sdk");
var _a = [process.env.TEST_EMAIL, process.env.TEST_PASSWORD], email = _a[0], password = _a[1];
var _b = [process.env.TEST_EMAIL_2, process.env.TEST_PASSWORD_2], email2 = _b[0], password2 = _b[1];
var _c = [process.env.NON_ADMIN_EMAIL, process.env.NON_ADMIN_PASSWORD], nonAdminEmail = _c[0], nonAdminPassword = _c[1];
var subUserEmail = process.env.SUB_EMAIL;
var host = process.env.API_URL || 'http://localhost:8080';
var businessId = '60398b1131a295e64f084ff6';
var enduserSDK = new sdk_1.EnduserSession({ host: host, businessId: businessId });
if (!(email && subUserEmail && password && email2 && password2 && nonAdminEmail && nonAdminPassword)) {
    console.error("Set TEST_EMAIL and TEST_PASSWORD");
    process.exit(1);
}
var sdk = new sdk_1.Session({ host: 'http://localhost:8080' });
var sdkSub = new sdk_1.Session({ host: 'http://localhost:8080' });
var nonAdminSdk = new sdk_1.Session({ host: 'http://localhost:8080' });
var app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: true, limit: '25mb' }));
app.use(body_parser_1.default.json({ limit: "25mb" }));
var PORT = 3999;
var TEST_SECRET = "this is a test secret for verifying integrity of web hooks";
var webhookEndpoint = '/handle-webhook';
var webhookURL = "http://127.0.0.1:".concat(PORT).concat(webhookEndpoint);
var sha256 = function (s) { return crypto_1.default.createHash('sha256').update(s).digest('hex'); };
var verify_integrity = function (_a) {
    var type = _a.type, message = _a.message, event = _a.event, records = _a.records, timestamp = _a.timestamp, integrity = _a.integrity;
    return (sha256(type === "automation"
        ? message + timestamp + TEST_SECRET
        : type === 'calendar_event_reminder'
            ? (event === null || event === void 0 ? void 0 : event.id) + timestamp + TEST_SECRET
            : records.map(function (r) { return r.id; }).join('') + timestamp + TEST_SECRET) === integrity);
};
var handledEvents = [];
app.post(webhookEndpoint, function (req, res) {
    var body = req.body;
    // console.log('got hook', body.records, body.timestamp, body.integrity)
    if (!verify_integrity(body)) {
        console.error("Integrity check failed for request", JSON.stringify(body, null, 2));
        process.exit(1);
    }
    handledEvents.push(req.body);
    res.status(204).end();
});
var fullSubscription = {};
var emptySubscription = {};
for (var model in types_models_1.WEBHOOK_MODELS) {
    fullSubscription[model] = { create: true, update: true, delete: true };
    emptySubscription[model] = { create: false, update: false, delete: false };
}
var CHECK_WEBHOOK_DELAY_MS = 75;
var webhookIndex = 0;
var check_next_webhook = function (evaluate, name, error, isSubscribed, noHookExpected) { return __awaiter(void 0, void 0, void 0, function () {
    var event, success;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (isSubscribed === false)
                    return [2 /*return*/];
                return [4 /*yield*/, (0, testing_1.wait)(undefined, CHECK_WEBHOOK_DELAY_MS)]; // wait for hook to post
            case 1:
                _a.sent(); // wait for hook to post
                event = handledEvents[webhookIndex];
                if (noHookExpected) {
                    (0, testing_1.assert)(!event, error, name);
                }
                else {
                    (0, testing_1.assert)(!!event, (error || '') + ' (did not get hook)', name || 'got hook');
                }
                if (!event)
                    return [2 /*return*/]; // ensure webhookIndex not incremented
                success = evaluate(event);
                (0, testing_1.assert)(success, error, name);
                if (!success) {
                    console.error('Got', event);
                }
                webhookIndex++;
                return [2 /*return*/];
        }
    });
}); };
var chats_tests = function (isSubscribed) { return __awaiter(void 0, void 0, void 0, function () {
    var enduser, room, chat;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, testing_1.log_header)("Chats Tests, isSubscribed=".concat(isSubscribed));
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'chatwebhooktest@tellescope.com' })];
            case 1:
                enduser = _a.sent();
                return [4 /*yield*/, sdk.api.chat_rooms.createOne({
                        userIds: [sdk.userInfo.id, nonAdminSdk.userInfo.id],
                        enduserIds: [enduser.id]
                    })];
            case 2:
                room = _a.sent();
                return [4 /*yield*/, sdk.api.chats.createOne({ roomId: room.id, message: "Hello hello hi hello" })];
            case 3:
                chat = _a.sent();
                return [4 /*yield*/, check_next_webhook(function (_a) {
                        var _b, _c, _d, _e, _f, _g, _h;
                        var records = _a.records, relatedRecords = _a.relatedRecords;
                        var record = records[0];
                        return ((0, utilities_1.objects_equivalent)(record, chat) &&
                            relatedRecords[record.roomId] !== undefined &&
                            relatedRecords[record.senderId] !== undefined &&
                            relatedRecords[nonAdminSdk.userInfo.id] !== undefined &&
                            relatedRecords[enduser.id] !== undefined &&
                            ((_b = relatedRecords[record.roomId]) === null || _b === void 0 ? void 0 : _b.id) === room.id &&
                            ((_c = relatedRecords[record.senderId]) === null || _c === void 0 ? void 0 : _c.id) === ((_d = room.userIds) === null || _d === void 0 ? void 0 : _d[0]) &&
                            ((_e = relatedRecords[nonAdminSdk.userInfo.id]) === null || _e === void 0 ? void 0 : _e.id) === ((_f = room.userIds) === null || _f === void 0 ? void 0 : _f[1]) &&
                            ((_g = relatedRecords[enduser.id]) === null || _g === void 0 ? void 0 : _g.id) === ((_h = room.enduserIds) === null || _h === void 0 ? void 0 : _h[0]));
                    }, 'Create chat error', 'Create chat webhook', isSubscribed)
                    // cleanup
                ];
            case 4:
                _a.sent();
                // cleanup
                return [4 /*yield*/, Promise.all([
                        sdk.api.chat_rooms.deleteOne(room.id),
                        sdk.api.endusers.deleteOne(enduser.id)
                    ])
                    // when chatroom support added for webhooks, check deletion here
                    // await check_next_webhook(a => objects_equivalent(a.records, [chat_room]), 'Delete chat room error', 'Delete chat room webhook', isSubscribed)
                ];
            case 5:
                // cleanup
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var meetings_tests = function (isSubscribed) { return __awaiter(void 0, void 0, void 0, function () {
    var enduser, meeting, meetings, endedMeeting, meetingWithAttendees;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, testing_1.log_header)("Meetings Tests, isSubscribed=".concat(isSubscribed));
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'deleteme@tellescope.com' })];
            case 1:
                enduser = _a.sent();
                return [4 /*yield*/, sdk.api.meetings.start_meeting()];
            case 2:
                meeting = _a.sent();
                return [4 /*yield*/, check_next_webhook(function (a) {
                        var _a, _b;
                        return (
                        // objects_equivalent(a.records[0]?.meetingInfo, meeting.meeting)
                        ((_a = a.records[0].attendees) === null || _a === void 0 ? void 0 : _a.length) === 1
                            && ((_b = a.records[0].attendees) === null || _b === void 0 ? void 0 : _b[0].id) === sdk.userInfo.id);
                    }, 'Create meeting error', 'Create meeting webhook', isSubscribed)];
            case 3:
                _a.sent();
                return [4 /*yield*/, sdk.api.meetings.add_attendees_to_meeting({ id: meeting.id, attendees: [{ type: 'enduser', id: enduser.id }] })];
            case 4:
                _a.sent();
                return [4 /*yield*/, check_next_webhook(function (a) { return (a.records[0].id === meeting.id
                        && a.type === 'update'
                        && a.records[0].attendees.length === 2
                        && !!a.records[0].attendees.find(function (a) { return a.id === enduser.id; })); }, 'Add attendees webhook error', 'add attendees webhook', isSubscribed)
                    // cleanup
                ];
            case 5:
                _a.sent();
                // cleanup
                return [4 /*yield*/, sdk.api.meetings.end_meeting({ id: meeting.id })]; // also cleans up messages
            case 6:
                // cleanup
                _a.sent(); // also cleans up messages
                return [4 /*yield*/, check_next_webhook(function (a) { return (a.records[0].id === meeting.id && a.records[0].status === 'ended' && a.type === 'update'); }, 'End meeting error', 'end meeting webhook', isSubscribed)];
            case 7:
                _a.sent();
                return [4 /*yield*/, sdk.api.meetings.my_meetings()];
            case 8:
                meetings = _a.sent();
                endedMeeting = meetings.find(function (m) { return m.id === meeting.id; });
                (0, testing_1.assert)(!!endedMeeting && endedMeeting.status === 'ended' && !!endedMeeting.endedAt, 'Meeting missing updated values on end', 'Meeting ended correctly');
                return [4 /*yield*/, sdk.api.meetings.start_meeting({ attendees: [{ id: enduser.id, type: 'enduser' }] })];
            case 9:
                meetingWithAttendees = _a.sent();
                return [4 /*yield*/, check_next_webhook((function (a) {
                        var _a;
                        return ((_a = a.records[0].attendees) === null || _a === void 0 ? void 0 : _a.length) === 2;
                    }), 'Create meeting with attendees error', 'Create meeting with attendees webhook', isSubscribed)];
            case 10:
                _a.sent();
                return [4 /*yield*/, sdk.api.meetings.end_meeting({ id: meetingWithAttendees.id })]; // also cleans up messages
            case 11:
                _a.sent(); // also cleans up messages
                return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id)];
            case 12:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var endusers_tests = function (isSubscribed) { return __awaiter(void 0, void 0, void 0, function () {
    var enduser, update;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, testing_1.log_header)("Endusers Tests, isSubscribed=".concat(isSubscribed));
                if (!isSubscribed) return [3 /*break*/, 2];
                return [4 /*yield*/, sdk.api.webhooks.update({ subscriptionUpdates: __assign(__assign({}, emptySubscription), { chats: { create: true }, meetings: { create: true, update: true, delete: false }, endusers: { create: false, update: true, delete: false } }) })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'deleteme@tellescope.com' })];
            case 3:
                enduser = _a.sent();
                update = { assignedTo: [sdk.userInfo.id] };
                return [4 /*yield*/, sdk.api.endusers.updateOne(enduser.id, update)];
            case 4:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.updateOne(enduser.id, { fields: { 'dontIncludeInWebhook': true } }, { dontSendWebhook: true })];
            case 5:
                _a.sent();
                return [4 /*yield*/, check_next_webhook(function (a) {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                        (_b = (_a = a.updates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? true : delete _b.recordBeforeUpdate.humanReadableId;
                        (_d = (_c = a.updates) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? true : delete _d.recordBeforeUpdate.lockId;
                        (_f = (_e = a.updates) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? true : delete _f.recordBeforeUpdate.updatedAt;
                        delete enduser.updatedAt;
                        delete enduser.___didInsert;
                        return ((0, utilities_1.objects_equivalent)((_h = (_g = a.updates) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.recordBeforeUpdate, enduser)
                            && (0, utilities_1.objects_equivalent)((_k = (_j = a.updates) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.update, update));
                    }, 'Enduser update error', 'Update enduser webhook', isSubscribed)];
            case 6:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.set_password({ id: enduser.id, password: 'initialPassword' })];
            case 7:
                _a.sent();
                return [4 /*yield*/, check_next_webhook(function (a) { var _a, _b; return !((_b = (_a = a.records) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.password); }, 'Enduser set password error', 'Set enduser password webhook', isSubscribed)
                    // cleanup
                ];
            case 8:
                _a.sent();
                if (!isSubscribed) return [3 /*break*/, 10];
                return [4 /*yield*/, sdk.api.webhooks.update({ subscriptionUpdates: __assign(__assign({}, emptySubscription), { chats: { create: true, update: false, delete: false }, meetings: { create: true, update: true, delete: false } }) })];
            case 9:
                _a.sent();
                _a.label = 10;
            case 10: return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id)];
            case 11:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var sub_organization_tests = function (isSubscribed) { return __awaiter(void 0, void 0, void 0, function () {
    var enduserSub;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, testing_1.log_header)("Sub organization Tests, isSubscribed=".concat(isSubscribed));
                if (!isSubscribed) return [3 /*break*/, 2];
                return [4 /*yield*/, sdk.api.webhooks.update({ subscriptionUpdates: __assign(__assign({}, emptySubscription), { endusers: { create: true, update: false, delete: false } }) })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'deleteme@tellescope.com' })];
            case 3:
                enduserSub = _a.sent();
                return [4 /*yield*/, check_next_webhook(function (a) {
                        var webhookEnduser = a.records[0];
                        delete webhookEnduser.humanReadableId;
                        delete webhookEnduser.lockId;
                        delete webhookEnduser.updatedAt;
                        delete enduserSub.updatedAt;
                        return ((0, utilities_1.objects_equivalent)(webhookEnduser, enduserSub));
                    }, 'Enduser create sub error', 'Create enduser sub webhook', isSubscribed)
                    // cleanup
                ];
            case 4:
                _a.sent();
                if (!isSubscribed) return [3 /*break*/, 6];
                return [4 /*yield*/, sdk.api.webhooks.update({ subscriptionUpdates: __assign(__assign({}, emptySubscription), { chats: { create: true }, meetings: { create: true, update: true, delete: false } }) })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [4 /*yield*/, sdk.api.endusers.deleteOne(enduserSub.id)];
            case 7:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var form_response_tests = function (isSubscribed) { return __awaiter(void 0, void 0, void 0, function () {
    var form, field, enduser, accessCode, formResponse, medicationForm, medicationField, medicationEnduser, medAccessCode, testMedications;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, testing_1.log_header)("Form Response Tests, isSubscribed=".concat(isSubscribed));
                if (!isSubscribed) return [3 /*break*/, 2];
                return [4 /*yield*/, sdk.api.webhooks.update({ subscriptionUpdates: __assign(__assign({}, emptySubscription), { form_responses: { create: true } }) })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [4 /*yield*/, sdk.api.forms.createOne({ title: 'test form' })];
            case 3:
                form = _a.sent();
                return [4 /*yield*/, sdk.api.form_fields.createOne({
                        title: 'test',
                        formId: form.id,
                        type: 'string',
                        previousFields: [],
                    })];
            case 4:
                field = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'deleteme@tellescope.com' })];
            case 5:
                enduser = _a.sent();
                return [4 /*yield*/, sdk.api.form_responses.prepare_form_response({
                        enduserId: enduser.id,
                        formId: form.id,
                    })];
            case 6:
                accessCode = (_a.sent()).accessCode;
                return [4 /*yield*/, sdk.api.form_responses.submit_form_response({
                        accessCode: accessCode,
                        responses: [
                            {
                                fieldId: field.id,
                                fieldTitle: 'test',
                                answer: {
                                    type: 'string',
                                    value: 'testing value',
                                }
                            }
                        ]
                    })];
            case 7:
                formResponse = (_a.sent()).formResponse;
                return [4 /*yield*/, check_next_webhook(function (a) {
                        var hook = a.records[0];
                        return (hook.id === formResponse.id
                            && hook.businessId === formResponse.businessId
                            && hook.enduserId === formResponse.enduserId
                            && (0, utilities_1.objects_equivalent)(formResponse.responses, hook.responses));
                    }, 'Form response on submit error', 'Form response on submit', isSubscribed)
                    // Test medications created from form submission
                ];
            case 8:
                _a.sent();
                if (!isSubscribed) return [3 /*break*/, 10];
                return [4 /*yield*/, sdk.api.webhooks.update({ subscriptionUpdates: __assign(__assign({}, emptySubscription), { enduser_medications: { create: true } }) })];
            case 9:
                _a.sent();
                _a.label = 10;
            case 10: return [4 /*yield*/, sdk.api.forms.createOne({ title: 'medication form' })];
            case 11:
                medicationForm = _a.sent();
                return [4 /*yield*/, sdk.api.form_fields.createOne({
                        title: 'medications',
                        formId: medicationForm.id,
                        type: 'Medications',
                        previousFields: [],
                    })];
            case 12:
                medicationField = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'med-test@tellescope.com' })];
            case 13:
                medicationEnduser = _a.sent();
                return [4 /*yield*/, sdk.api.form_responses.prepare_form_response({
                        enduserId: medicationEnduser.id,
                        formId: medicationForm.id,
                    })];
            case 14:
                medAccessCode = (_a.sent()).accessCode;
                testMedications = [
                    {
                        displayTerm: 'Aspirin 81 MG Oral Tablet',
                        drugName: 'Aspirin',
                        rxNormCode: '1191',
                        dosage: { value: '81', unit: 'mg', quantity: '1', frequency: 'Once Daily', frequencyDescriptor: 'Day' },
                        reasonForTaking: 'Heart health',
                    },
                    {
                        displayTerm: 'Lisinopril 10 MG Oral Tablet',
                        drugName: 'Lisinopril',
                        rxNormCode: '29046',
                        dosage: { value: '10', unit: 'mg', quantity: '1', frequency: 'Once Daily', frequencyDescriptor: 'Day' },
                        reasonForTaking: 'Blood pressure',
                    }
                ];
                return [4 /*yield*/, sdk.api.form_responses.submit_form_response({
                        accessCode: medAccessCode,
                        responses: [
                            {
                                fieldId: medicationField.id,
                                fieldTitle: 'medications',
                                answer: {
                                    type: 'Medications',
                                    value: testMedications,
                                }
                            }
                        ]
                    })];
            case 15:
                _a.sent();
                return [4 /*yield*/, check_next_webhook(function (a) {
                        return (a.model === 'enduser_medications'
                            && a.type === 'create'
                            && a.records.length === 2
                            && a.records[0].title === 'Aspirin'
                            && a.records[1].title === 'Lisinopril'
                            && a.records[0].enduserId === medicationEnduser.id
                            && a.records[1].enduserId === medicationEnduser.id
                            && a.records[0].source === 'Tellescope Form Response'
                            && a.records[1].source === 'Tellescope Form Response'
                            && a.description === 'Medications created from form submission');
                    }, 'Medications webhook on form submit error', 'Medications webhook on form submit', isSubscribed)
                    // cleanup
                ];
            case 16:
                _a.sent();
                if (!isSubscribed) return [3 /*break*/, 18];
                return [4 /*yield*/, sdk.api.webhooks.update({ subscriptionUpdates: __assign(__assign({}, emptySubscription), { chats: { create: true }, meetings: { create: true, update: true, delete: false } }) })];
            case 17:
                _a.sent();
                _a.label = 18;
            case 18: return [4 /*yield*/, Promise.all([
                    sdk.api.endusers.deleteOne(enduser.id),
                    sdk.api.endusers.deleteOne(medicationEnduser.id),
                    sdk.api.forms.deleteOne(form.id),
                    sdk.api.forms.deleteOne(medicationForm.id),
                ])];
            case 19:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var AUTOMATION_POLLING_DELAY_MS = 3000 - CHECK_WEBHOOK_DELAY_MS;
var test_automation_webhooks = function () { return __awaiter(void 0, void 0, void 0, function () {
    var state1, state2, testMessage, journey, testAction, enduser;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                (0, testing_1.log_header)("Automation Events");
                state1 = "State 1", state2 = "State 2";
                testMessage = 'Test webhook from automation';
                return [4 /*yield*/, sdk.api.journeys.createOne({
                        title: "Automations Test",
                        defaultState: state1,
                    })];
            case 1:
                journey = _b.sent();
                testAction = {
                    type: 'sendWebhook',
                    info: { message: testMessage }
                };
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [{ type: "onJourneyStart", info: {} }],
                        action: testAction,
                    })
                    // trigger a1 on create
                ];
            case 2:
                _b.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({
                        email: "automations@tellescope.com",
                        journeys: (_a = {}, _a[journey.id] = journey.defaultState, _a)
                    })
                    // wait long enough for automation to process and send webhook
                ];
            case 3:
                enduser = _b.sent();
                // wait long enough for automation to process and send webhook
                return [4 /*yield*/, (0, testing_1.wait)(undefined, 7000)];
            case 4:
                // wait long enough for automation to process and send webhook
                _b.sent();
                return [4 /*yield*/, check_next_webhook(function (_a) {
                        var message = _a.message, rest = __rest(_a, ["message"]);
                        return message === testMessage;
                    }, 'Automation webhook received', 'Automation webhook error', true, false)
                    // cleanup
                ];
            case 5:
                _b.sent();
                // cleanup
                return [4 /*yield*/, sdk.api.journeys.deleteOne(journey.id)]; // automation events deleted as side effect
            case 6:
                // cleanup
                _b.sent(); // automation events deleted as side effect
                return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id)];
            case 7:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
var CALENDAR_EVENT_WEBHOOK_COUNT = 0; // 
var calendar_event_reminders_tests = function (isSubscribed) { return __awaiter(void 0, void 0, void 0, function () {
    var firstRemindAt, secondRemindAt, thirdRemindAt, sampleCalendarEventReminders, calendarEvent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, testing_1.log_header)("Calendar Event Reminders, isSubscribed=".concat(isSubscribed));
                firstRemindAt = AUTOMATION_POLLING_DELAY_MS * 4;
                secondRemindAt = AUTOMATION_POLLING_DELAY_MS * 2;
                thirdRemindAt = AUTOMATION_POLLING_DELAY_MS * 0;
                sampleCalendarEventReminders = [
                    {
                        msBeforeStartTime: firstRemindAt,
                        type: 'webhook',
                        info: {},
                    },
                    {
                        msBeforeStartTime: thirdRemindAt,
                        type: 'webhook',
                        info: {},
                    },
                    {
                        didRemind: false,
                        msBeforeStartTime: secondRemindAt,
                        type: 'webhook',
                        info: {},
                    }
                ];
                return [4 /*yield*/, sdk.api.calendar_events.createOne({
                        durationInMinutes: 10,
                        startTimeInMS: Date.now() + firstRemindAt,
                        title: "Test Notifications",
                        reminders: sampleCalendarEventReminders,
                    })];
            case 1:
                calendarEvent = _a.sent();
                CALENDAR_EVENT_WEBHOOK_COUNT = sampleCalendarEventReminders.length;
                // wait long enough for automation to process and send webhook
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AUTOMATION_POLLING_DELAY_MS * 2)];
            case 2:
                // wait long enough for automation to process and send webhook
                _a.sent();
                return [4 /*yield*/, check_next_webhook(function (_a) {
                        var _b;
                        var event = _a.event;
                        return ((event === null || event === void 0 ? void 0 : event.id) === calendarEvent.id &&
                            !!((_b = event === null || event === void 0 ? void 0 : event.reminders) === null || _b === void 0 ? void 0 : _b.find(function (r) { return r.msBeforeStartTime === firstRemindAt; })));
                    }, 'Calendar event successful webhook error', 'First calendar event reminder received', true)];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('First reminder progress', function () { return sdk.api.calendar_events.getOne(calendarEvent.id); }, { onResult: function (c) {
                            var _a;
                            return (c.nextReminderInMS === c.startTimeInMS - secondRemindAt
                                && ((_a = c.reminders) === null || _a === void 0 ? void 0 : _a.filter(function (r) { return r.didRemind; }).length) === 1
                                && c.startTimeInMS === calendarEvent.startTimeInMS // ensure this isn't changed in background
                            );
                        }
                    })];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AUTOMATION_POLLING_DELAY_MS)];
            case 5:
                _a.sent();
                return [4 /*yield*/, check_next_webhook(function () { return true; }, "Correctly didn't get webhook yet", 'Got calendar event webhook too early', true, true)];
            case 6:
                _a.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('First reminder progress pending', function () { return sdk.api.calendar_events.getOne(calendarEvent.id); }, { onResult: function (c) {
                            var _a;
                            return (c.nextReminderInMS === c.startTimeInMS - secondRemindAt
                                && ((_a = c.reminders) === null || _a === void 0 ? void 0 : _a.filter(function (r) { return r.didRemind; }).length) === 1
                                && c.startTimeInMS === calendarEvent.startTimeInMS // ensure this isn't changed in background
                            );
                        }
                    })];
            case 7:
                _a.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AUTOMATION_POLLING_DELAY_MS)];
            case 8:
                _a.sent();
                return [4 /*yield*/, check_next_webhook(function (_a) {
                        var _b, _c;
                        var event = _a.event;
                        return ((event === null || event === void 0 ? void 0 : event.id) === calendarEvent.id &&
                            !!((_b = event === null || event === void 0 ? void 0 : event.reminders) === null || _b === void 0 ? void 0 : _b.find(function (r) { return r.msBeforeStartTime === secondRemindAt; })) &&
                            !!((_c = event === null || event === void 0 ? void 0 : event.reminders) === null || _c === void 0 ? void 0 : _c.find(function (r) { return r.msBeforeStartTime === firstRemindAt && r.didRemind === true; })));
                    }, 'Calendar event successful webhook error', 'First calendar event reminder received', true)];
            case 9:
                _a.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('Second reminder progress', function () { return sdk.api.calendar_events.getOne(calendarEvent.id); }, { onResult: function (c) {
                            var _a;
                            return (c.nextReminderInMS === c.startTimeInMS - thirdRemindAt
                                && ((_a = c.reminders) === null || _a === void 0 ? void 0 : _a.filter(function (r) { return r.didRemind; }).length) === 2
                                && c.startTimeInMS === calendarEvent.startTimeInMS // ensure this isn't changed in background
                            );
                        }
                    })];
            case 10:
                _a.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AUTOMATION_POLLING_DELAY_MS)];
            case 11:
                _a.sent();
                return [4 /*yield*/, check_next_webhook(function () { return true; }, "Correctly didn't get webhook yet", 'Got calendar event webhook too early', true, true)];
            case 12:
                _a.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('Second reminder progress pending', function () { return sdk.api.calendar_events.getOne(calendarEvent.id); }, { onResult: function (c) {
                            var _a;
                            return (c.nextReminderInMS === c.startTimeInMS - thirdRemindAt
                                && ((_a = c.reminders) === null || _a === void 0 ? void 0 : _a.filter(function (r) { return r.didRemind; }).length) === 2
                                && c.startTimeInMS === calendarEvent.startTimeInMS // ensure this isn't changed in background
                            );
                        }
                    })];
            case 13:
                _a.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AUTOMATION_POLLING_DELAY_MS)];
            case 14:
                _a.sent();
                return [4 /*yield*/, check_next_webhook(function (_a) {
                        var _b, _c, _d;
                        var event = _a.event;
                        return ((event === null || event === void 0 ? void 0 : event.id) === calendarEvent.id &&
                            !!((_b = event === null || event === void 0 ? void 0 : event.reminders) === null || _b === void 0 ? void 0 : _b.find(function (r) { return r.msBeforeStartTime === thirdRemindAt; })) &&
                            !!((_c = event === null || event === void 0 ? void 0 : event.reminders) === null || _c === void 0 ? void 0 : _c.find(function (r) { return r.msBeforeStartTime === secondRemindAt && r.didRemind === true; })) &&
                            !!((_d = event === null || event === void 0 ? void 0 : event.reminders) === null || _d === void 0 ? void 0 : _d.find(function (r) { return r.msBeforeStartTime === firstRemindAt && r.didRemind === true; })));
                    }, 'Calendar event successful webhook error', 'First calendar event reminder received', true)];
            case 15:
                _a.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, AUTOMATION_POLLING_DELAY_MS)];
            case 16:
                _a.sent();
                return [4 /*yield*/, check_next_webhook(function () { return true; }, "Correctly didn't get webhook yet", 'Got calendar event webhook too early', true, true)];
            case 17:
                _a.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('Reminders are done processing', function () { return sdk.api.calendar_events.getOne(calendarEvent.id); }, { onResult: function (c) {
                            var _a, _b;
                            return (c.nextReminderInMS === -1
                                && c.startTimeInMS === calendarEvent.startTimeInMS // ensure this isn't changed in background
                                && !((_a = c.reminders) === null || _a === void 0 ? void 0 : _a.find(function (r) { return !r.didRemind; }))
                                && ((_b = c.reminders) === null || _b === void 0 ? void 0 : _b.filter(function (r) { return r.didRemind; }).length) === 3);
                        } })
                    // cleanup
                ];
            case 18:
                _a.sent();
                // cleanup
                return [4 /*yield*/, sdk.api.calendar_events.deleteOne(calendarEvent.id)];
            case 19:
                // cleanup
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var self_serve_appointment_booking_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var e1, event30min, dayOfWeekStartingSundayIndexedByZero, slots, toCancel, toReschedule, rescheduledAppointment;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, testing_1.log_header)("Self Serve Appointment Booking");
                return [4 /*yield*/, sdk.api.webhooks.update({ subscriptionUpdates: __assign(__assign({}, emptySubscription), { calendar_events: { create: true, update: true, delete: false } })
                    })];
            case 1:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'sebass+selfserve@tellescope.com' })];
            case 2:
                e1 = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.set_password({ id: e1.id, password: password })];
            case 3:
                _a.sent();
                return [4 /*yield*/, enduserSDK.authenticate('sebass+selfserve@tellescope.com', password)];
            case 4:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_event_templates.createOne({
                        title: 'test 1', durationInMinutes: 30, confirmationEmailDisabled: true, confirmationSMSDisabled: true,
                    })
                    // ensure it doesn't match current day, to avoid errors on testing
                ];
            case 5:
                event30min = _a.sent();
                dayOfWeekStartingSundayIndexedByZero = (new Date().getDay() + 1) % 7;
                return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, {
                        weeklyAvailabilities: [
                            {
                                dayOfWeekStartingSundayIndexedByZero: dayOfWeekStartingSundayIndexedByZero,
                                startTimeInMinutes: 60 * 12,
                                endTimeInMinutes: 60 * 14, // 2pm,
                            },
                        ],
                        timezone: 'America/New_York',
                    }, {
                        replaceObjectFields: true,
                    })];
            case 6:
                _a.sent();
                return [4 /*yield*/, enduserSDK.api.calendar_events.get_appointment_availability({
                        calendarEventTemplateId: event30min.id,
                        from: new Date(),
                    })];
            case 7:
                slots = _a.sent();
                return [4 /*yield*/, enduserSDK.api.calendar_events.book_appointment({
                        calendarEventTemplateId: event30min.id,
                        startTime: new Date(slots.availabilityBlocks[0].startTimeInMS),
                        userId: slots.availabilityBlocks[0].userId,
                    })];
            case 8:
                toCancel = (_a.sent()).createdEvent;
                return [4 /*yield*/, check_next_webhook(function (a) { return (a.type === 'create' && a.records[0].id === toCancel.id); }, 'book-appointment webhook', 'book-appointment webhook error', true)];
            case 9:
                _a.sent();
                return [4 /*yield*/, enduserSDK.api.calendar_events.updateOne(toCancel.id, { cancelledAt: new Date() })];
            case 10:
                _a.sent();
                return [4 /*yield*/, check_next_webhook(function (a) { return (a.records[0].id === toCancel.id
                        && a.type === 'update'); }, 'cancel appointment webhook', 'cancel appointment webhook error', true)];
            case 11:
                _a.sent();
                return [4 /*yield*/, enduserSDK.api.calendar_events.book_appointment({
                        calendarEventTemplateId: event30min.id,
                        startTime: new Date(slots.availabilityBlocks[0].startTimeInMS),
                        userId: slots.availabilityBlocks[0].userId,
                    })];
            case 12:
                toReschedule = (_a.sent()).createdEvent;
                return [4 /*yield*/, check_next_webhook(function (a) { return (a.records[0].id === toReschedule.id); }, 'to reschedule webhook', 'to reschedule webhook error', true)];
            case 13:
                _a.sent();
                return [4 /*yield*/, enduserSDK.api.calendar_events.book_appointment({
                        calendarEventTemplateId: event30min.id,
                        rescheduledCalendarEventId: toReschedule.id,
                        startTime: new Date(slots.availabilityBlocks[1].startTimeInMS),
                        userId: slots.availabilityBlocks[1].userId,
                    })];
            case 14:
                rescheduledAppointment = (_a.sent()).createdEvent;
                return [4 /*yield*/, (0, testing_1.wait)(undefined, 250)
                    // should get two webhooks on reschedule, and order may not be guaranteed
                ];
            case 15:
                _a.sent();
                // should get two webhooks on reschedule, and order may not be guaranteed
                return [4 /*yield*/, check_next_webhook(function (a) { return ((a.type === 'create' && a.records[0].id === rescheduledAppointment.id)
                        || (a.type === 'update' && a.records[0].id === toReschedule.id && a.description === 'calendar event rescheduled')); }, 'reschedule webhook', 'reschedule webhook error', true)];
            case 16:
                // should get two webhooks on reschedule, and order may not be guaranteed
                _a.sent();
                return [4 /*yield*/, check_next_webhook(function (a) { return ((a.type === 'create' && a.records[0].id === rescheduledAppointment.id)
                        || (a.type === 'update' && a.records[0].id === toReschedule.id && a.description === 'calendar event rescheduled')); }, 'reschedule webhook', 'reschedule webhook error', true)];
            case 17:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(e1.id),
                        sdk.api.calendar_event_templates.deleteOne(event30min.id),
                        sdk.api.calendar_events.deleteOne(toCancel.id),
                        sdk.api.calendar_events.deleteOne(toReschedule.id),
                        sdk.api.calendar_events.deleteOne(rescheduledAppointment.id),
                        sdk.api.users.updateOne(sdk.userInfo.id, { weeklyAvailabilities: [] }, { replaceObjectFields: true }),
                        sdk.api.webhooks.update({ subscriptionUpdates: emptySubscription })
                    ])];
            case 18:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var tests = {
    form_responses: form_response_tests,
    sub: sub_organization_tests,
    endusers: endusers_tests,
    chats: chats_tests,
    calendarEventReminders: calendar_event_reminders_tests,
    meetings: meetings_tests,
};
var run_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, _i, t, finalLength, _d, _e, _f, _g, t;
    var _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                (0, testing_1.log_header)("Webhooks Tests");
                return [4 /*yield*/, sdk.authenticate(email, password)];
            case 1:
                _k.sent();
                return [4 /*yield*/, sdkSub.authenticate(subUserEmail, password)];
            case 2:
                _k.sent();
                return [4 /*yield*/, sdk.reset_db()];
            case 3:
                _k.sent();
                return [4 /*yield*/, nonAdminSdk.authenticate(nonAdminEmail, nonAdminPassword)];
            case 4:
                _k.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('configure webhook is admin only', function () { return nonAdminSdk.api.webhooks.configure({ url: webhookURL, secret: TEST_SECRET }); }, { shouldError: true, onError: function (e) { return e.message === "Inaccessible" || e.message === "Admin access only"; } })];
            case 5:
                _k.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('update webhook is admin only', function () { return nonAdminSdk.api.webhooks.update({ subscriptionUpdates: fullSubscription }); }, { shouldError: true, onError: function (e) { return e.message === "Inaccessible" || e.message === "Admin access only"; } })];
            case 6:
                _k.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('configure webhook', function () { return sdk.api.webhooks.configure({ url: webhookURL, secret: TEST_SECRET }); }, { onResult: function (_) { return true; } })];
            case 7:
                _k.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('configure webhook (overwrite)', function () { return sdk.api.webhooks.configure({ url: webhookURL, secret: TEST_SECRET }); }, { onResult: function () { return true; } }
                    // { shouldError: true, onError: e => e.message === "Only one webhook configuration is supported per organization. Use /update-webooks to update your configuration." }
                    )];
            case 8:
                _k.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('get initial webhook configuration', function () { return sdk.api.webhooks.get_configuration({}); }, { onResult: function (r) { var _a; return r.url === webhookURL && (0, utilities_1.object_is_empty)((_a = r.subscriptions) !== null && _a !== void 0 ? _a : {}); } })];
            case 9:
                _k.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('update webhook (set empty subscription)', function () { return sdk.api.webhooks.update({ subscriptionUpdates: {} }); }, { onResult: function (_) { return true; } })];
            case 10:
                _k.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('update webhook (set partial subscription)', function () { return sdk.api.webhooks.update({ subscriptionUpdates: { chats: { create: true } } }); }, { onResult: function (_) { return true; } })];
            case 11:
                _k.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('update webhook (set subscriptions)', function () { return sdk.api.webhooks.update({ subscriptionUpdates: fullSubscription }); }, { onResult: function (_) { return true; } })];
            case 12:
                _k.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('update webhook invalid model', function () { return sdk.api.webhooks.update({ subscriptionUpdates: { notAModel: { create: false } } }); }, { shouldError: true, onError: function (e) { return e.message === "Error parsing field subscriptionUpdates: Got unexpected field(s) [notAModel]"; } })];
            case 13:
                _k.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('get initial webhook configuration after updates', function () { return sdk.api.webhooks.get_configuration({}); }, { onResult: function (r) { return r.url === webhookURL && (0, utilities_1.objects_equivalent)(r.subscriptions, fullSubscription); } })];
            case 14:
                _k.sent();
                return [4 /*yield*/, self_serve_appointment_booking_tests()
                    // reset to only poartial / testing fields
                    // todo: subscribe in individual tests to avoid issues in ordering of tests / subscriptions
                ];
            case 15:
                _k.sent();
                // reset to only poartial / testing fields
                // todo: subscribe in individual tests to avoid issues in ordering of tests / subscriptions
                return [4 /*yield*/, sdk.api.webhooks.update({ subscriptionUpdates: __assign(__assign({}, emptySubscription), { chats: { create: true }, meetings: { create: true, update: true, delete: false } })
                    })];
            case 16:
                // reset to only poartial / testing fields
                // todo: subscribe in individual tests to avoid issues in ordering of tests / subscriptions
                _k.sent();
                (0, testing_1.log_header)("Webhooks Tests with Subscriptions");
                return [4 /*yield*/, test_automation_webhooks()];
            case 17:
                _k.sent();
                _a = tests;
                _b = [];
                for (_c in _a)
                    _b.push(_c);
                _i = 0;
                _k.label = 18;
            case 18:
                if (!(_i < _b.length)) return [3 /*break*/, 21];
                _c = _b[_i];
                if (!(_c in _a)) return [3 /*break*/, 20];
                t = _c;
                return [4 /*yield*/, ((_h = tests[t]) === null || _h === void 0 ? void 0 : _h.call(tests, true))];
            case 19:
                _k.sent();
                _k.label = 20;
            case 20:
                _i++;
                return [3 /*break*/, 18];
            case 21:
                finalLength = handledEvents.length;
                return [4 /*yield*/, (0, testing_1.async_test)('update webhook (set subscriptions empty)', function () { return sdk.api.webhooks.update({ subscriptionUpdates: __assign({}, emptySubscription) }); }, { onResult: function (_) { return true; } })];
            case 22:
                _k.sent();
                (0, testing_1.log_header)("Webhooks Tests without Subscriptions");
                _d = tests;
                _e = [];
                for (_f in _d)
                    _e.push(_f);
                _g = 0;
                _k.label = 23;
            case 23:
                if (!(_g < _e.length)) return [3 /*break*/, 26];
                _f = _e[_g];
                if (!(_f in _d)) return [3 /*break*/, 25];
                t = _f;
                if (tests[t] === tests.calendarEventReminders) {
                    return [3 /*break*/, 25]; // don't require subscription / can't unsubscribe
                }
                return [4 /*yield*/, ((_j = tests[t]) === null || _j === void 0 ? void 0 : _j.call(tests, false))];
            case 24:
                _k.sent();
                _k.label = 25;
            case 25:
                _g++;
                return [3 /*break*/, 23];
            case 26:
                (0, testing_1.assert)(finalLength === handledEvents.length, 'length changed after subscriptions', 'No webhooks posted when no subscription');
                return [2 /*return*/];
        }
    });
}); };
app.listen(PORT, function () { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, run_tests()];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.error(err_1);
                return [3 /*break*/, 3];
            case 3:
                process.exit();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=webhooks_tests.js.map