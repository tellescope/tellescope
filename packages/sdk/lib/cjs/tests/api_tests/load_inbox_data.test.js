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
exports.load_inbox_data_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.TEST_URL || 'http://localhost:8080';
// Main test function that can be called independently
// deprecated endpoint in favor of inbox threads
var load_inbox_data_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var e, e2, email, sms, groupMMS, call, thread, comment, room, updatedRoom, noAccessRole, roleTestUserEmail, roleTestUser, _b, sdkNoAccess, _c, defaultAccessRole, sdkDefaultAccess, _d, testPhone1, testPhone2, testPhone3, smsWithPhone1, smsWithPhone2, callInboundPhone1, callInboundPhone3;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    (0, testing_1.log_header)("Inbox Loading Tests (deprecated bulk endpoint)");
                    return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'Test', lname: 'Testson' })];
                case 1:
                    e = _g.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'Test2', lname: 'Testson2' })];
                case 2:
                    e2 = _g.sent();
                    return [4 /*yield*/, sdk.api.emails.createOne({
                            logOnly: true,
                            subject: 'Test Email',
                            enduserId: e.id,
                            textContent: 'This is a test email',
                            inbound: true,
                            userId: sdk.userInfo.id,
                        })];
                case 3:
                    email = _g.sent();
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            logOnly: true,
                            inbound: true,
                            enduserId: e.id,
                            message: 'This is a test SMS',
                            userId: sdk.userInfo.id,
                        })];
                case 4:
                    sms = _g.sent();
                    return [4 /*yield*/, sdk.api.group_mms_conversations.createOne({
                            enduserIds: [e.id],
                            userIds: [sdk.userInfo.id],
                            userStates: [],
                        })];
                case 5:
                    groupMMS = _g.sent();
                    return [4 /*yield*/, sdk.api.phone_calls.createOne({ enduserId: e.id, inbound: true, userId: sdk.userInfo.id })];
                case 6:
                    call = _g.sent();
                    return [4 /*yield*/, sdk.api.ticket_threads.createOne({ enduserId: e.id, subject: 'test thread' })];
                case 7:
                    thread = _g.sent();
                    return [4 /*yield*/, sdk.api.ticket_thread_comments.createOne({
                            enduserId: e.id,
                            html: '',
                            inbound: true,
                            plaintext: '',
                            public: false,
                            ticketThreadId: thread.id,
                            userId: sdk.userInfo.id,
                        })];
                case 8:
                    comment = _g.sent();
                    return [4 /*yield*/, sdk.api.chat_rooms.createOne({ enduserIds: [e.id], userIds: [], title: 'Test Chat Room' })];
                case 9:
                    room = _g.sent();
                    return [4 /*yield*/, sdk.api.chats.createOne({ roomId: room.id, message: 'test', enduserId: e.id, senderId: e.id })];
                case 10:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)]; // allow for recentEnduserTimestamp to be set to indicate inbound chat in chat room
                case 11:
                    _g.sent(); // allow for recentEnduserTimestamp to be set to indicate inbound chat in chat room
                    return [4 /*yield*/, sdk.api.chat_rooms.getOne(room.id)];
                case 12:
                    updatedRoom = _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Inbox loads messages", function () { return sdk.api.endusers.load_inbox_data({}); }, { onResult: function (r) { return (r.chat_rooms.length === 1
                                && r.emails.length === 1
                                && r.sms_messages.length === 1
                                && r.group_mms_conversations.length === 1
                                && r.phone_calls.length === 1
                                && r.ticket_thread_comments.length === 1
                                && r.endusers.length === 1); } })];
                case 13:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Inbox loads messages (lastIds)", function () { return sdk.api.endusers.load_inbox_data({
                            lastChatRoomId: room.id,
                            lastEmailId: email.id,
                            lastSMSId: sms.id,
                            lastGroupMMSId: groupMMS.id,
                            lastPhoneCallId: call.id,
                            lastTicketThreadCommentId: comment.id,
                        }); }, { onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); } })];
                case 14:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Inbox loads messages (blank lastIds)", function () { return sdk.api.endusers.load_inbox_data({
                            lastChatRoomId: '',
                            lastEmailId: '',
                            lastSMSId: '',
                            lastGroupMMSId: '',
                            lastPhoneCallId: '',
                            lastTicketThreadCommentId: '',
                        }); }, { onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); } })];
                case 15:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Inbox loads messages (lastUpdatedAt 0 date)", function () { return sdk.api.endusers.load_inbox_data({
                            lastChatRoomUpdatedAt: new Date(0),
                            lastGroupMMSUpdatedAt: new Date(0),
                        }); }, { onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 1
                                && r.sms_messages.length === 1
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 1
                                && r.ticket_thread_comments.length === 1
                                && r.endusers.length === 1); } })];
                case 16:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Inbox loads messages (lastUpdatedAt current date)", function () { return sdk.api.endusers.load_inbox_data({
                            lastChatRoomUpdatedAt: new Date(),
                            lastGroupMMSUpdatedAt: new Date(),
                        }); }, { onResult: function (r) { return (r.chat_rooms.length === 1
                                && r.emails.length === 1
                                && r.sms_messages.length === 1
                                && r.group_mms_conversations.length === 1
                                && r.phone_calls.length === 1
                                && r.ticket_thread_comments.length === 1
                                && r.endusers.length === 1); } })
                        // backend uses $lte instead of $lt in case of different convos that have the same id
                    ];
                case 17:
                    _g.sent();
                    // backend uses $lte instead of $lt in case of different convos that have the same id
                    return [4 /*yield*/, (0, testing_1.async_test)("Inbox loads messages (lastUpdatedAt initial date)", function () { return sdk.api.endusers.load_inbox_data({
                            lastChatRoomUpdatedAt: new Date(new Date(room.updatedAt).getTime() - 1),
                            lastGroupMMSUpdatedAt: new Date(new Date(groupMMS.updatedAt).getTime() - 1),
                        }); }, { onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 1
                                && r.sms_messages.length === 1
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 1
                                && r.ticket_thread_comments.length === 1
                                && r.endusers.length === 1); } })
                        // providing id but using same timestamp filters out the thread itself
                    ];
                case 18:
                    // backend uses $lte instead of $lt in case of different convos that have the same id
                    _g.sent();
                    // providing id but using same timestamp filters out the thread itself
                    return [4 /*yield*/, (0, testing_1.async_test)("Inbox loads messages (lastUpdatedAt initial date and ids provided)", function () { return sdk.api.endusers.load_inbox_data({
                            lastChatRoomId: room.id,
                            lastGroupMMSId: groupMMS.id,
                            lastChatRoomUpdatedAt: new Date(new Date(room.updatedAt).getTime()),
                            lastGroupMMSUpdatedAt: new Date(new Date(groupMMS.updatedAt).getTime()),
                        }); }, { onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 1
                                && r.sms_messages.length === 1
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 1
                                && r.ticket_thread_comments.length === 1
                                && r.endusers.length === 1); } })];
                case 19:
                    // providing id but using same timestamp filters out the thread itself
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Inbox loads messages with used enduserId", function () { return sdk.api.endusers.load_inbox_data({ enduserIds: [e.id] }); }, { onResult: function (r) { return (r.chat_rooms.length === 1
                                && r.emails.length === 1
                                && r.sms_messages.length === 1
                                && r.group_mms_conversations.length === 1
                                && r.phone_calls.length === 1
                                && r.ticket_thread_comments.length === 1
                                && r.endusers.length === 1); } })];
                case 20:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Inbox loads messages with unused enduserId", function () { return sdk.api.endusers.load_inbox_data({ enduserIds: [e2.id] }); }, { onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); } })];
                case 21:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Inbox loads no messages (filter by self when no threads are assigned)", function () { return sdk.api.endusers.load_inbox_data({ userId: sdk.userInfo.id }); }, { onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); } })];
                case 22:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Inbox loads no messages (filter by other when no threads are assigned)", function () { return sdk.api.endusers.load_inbox_data({ userId: sdkNonAdmin.userInfo.id }); }, { onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); } })];
                case 23:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('Non-admin cannot load inbox data without assignment', function () { return sdkNonAdmin.api.endusers.load_inbox_data({}); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); }
                        })];
                case 24:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('Non-admin cannot load inbox data without assignment with used enduserId', function () { return sdkNonAdmin.api.endusers.load_inbox_data({ enduserIds: [e.id] }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); }
                        })];
                case 25:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('Non-admin cannot load inbox data without assignment with unused enduserId', function () { return sdkNonAdmin.api.endusers.load_inbox_data({ enduserIds: [e2.id] }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); }
                        })];
                case 26:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('Non-admin cannot load inbox data without assignment (self as filter)', function () { return sdkNonAdmin.api.endusers.load_inbox_data({ userId: sdkNonAdmin.userInfo.id }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); }
                        })];
                case 27:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('Non-admin cannot load inbox data without assignment (other user as filter)', function () { return sdkNonAdmin.api.endusers.load_inbox_data({ userId: sdk.userInfo.id }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); }
                        })
                        // assign to Enduser
                    ];
                case 28:
                    _g.sent();
                    // assign to Enduser
                    return [4 /*yield*/, sdk.api.endusers.updateOne(e.id, { assignedTo: [sdkNonAdmin.userInfo.id] }, { replaceObjectFields: true })];
                case 29:
                    // assign to Enduser
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('Non-admin can load inbox data with assignment', function () { return sdkNonAdmin.api.endusers.load_inbox_data({}); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 1
                                && r.emails.length === 1
                                && r.sms_messages.length === 1
                                && r.group_mms_conversations.length === 1
                                && r.phone_calls.length === 1
                                && r.ticket_thread_comments.length === 1
                                && r.endusers.length === 1); }
                        })];
                case 30:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('Non-admin can load inbox data with assignment and used enduser filter', function () { return sdkNonAdmin.api.endusers.load_inbox_data({ enduserIds: [e.id] }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 1
                                && r.emails.length === 1
                                && r.sms_messages.length === 1
                                && r.group_mms_conversations.length === 1
                                && r.phone_calls.length === 1
                                && r.ticket_thread_comments.length === 1
                                && r.endusers.length === 1); }
                        })];
                case 31:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('Non-admin cant load inbox data with assignment and uused enduser filter', function () { return sdkNonAdmin.api.endusers.load_inbox_data({ enduserIds: [e2.id] }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); }
                        })];
                case 32:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('Non-admin can load inbox data with assignment (self as filter)', function () { return sdkNonAdmin.api.endusers.load_inbox_data({ userId: sdkNonAdmin.userInfo.id }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 1
                                && r.emails.length === 1
                                && r.sms_messages.length === 1
                                && r.group_mms_conversations.length === 1
                                && r.phone_calls.length === 1
                                && r.ticket_thread_comments.length === 1
                                && r.endusers.length === 1); }
                        })];
                case 33:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('Non-admin can load inbox data with assignment (other user as filter, not assigned)', function () { return sdkNonAdmin.api.endusers.load_inbox_data({ userId: sdk.userInfo.id }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); }
                        })];
                case 34:
                    _g.sent();
                    return [4 /*yield*/, sdk.api.endusers.updateOne(e.id, { assignedTo: [sdk.userInfo.id] }, {})]; // add other assignment
                case 35:
                    _g.sent(); // add other assignment
                    return [4 /*yield*/, (0, testing_1.async_test)('Non-admin can load inbox data with assignment (other user as filter, assigned)', function () { return sdkNonAdmin.api.endusers.load_inbox_data({ userId: sdk.userInfo.id }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 1
                                && r.emails.length === 1
                                && r.sms_messages.length === 1
                                && r.group_mms_conversations.length === 1
                                && r.phone_calls.length === 1
                                && r.ticket_thread_comments.length === 1
                                && r.endusers.length === 1); }
                        })
                        // assign admin to all threads
                    ];
                case 36:
                    _g.sent();
                    // assign admin to all threads
                    return [4 /*yield*/, sdk.api.emails.updateOne(email.id, { assignedTo: [sdk.userInfo.id] }, { replaceObjectFields: true })];
                case 37:
                    // assign admin to all threads
                    _g.sent();
                    return [4 /*yield*/, sdk.api.sms_messages.updateOne(sms.id, { assignedTo: [sdk.userInfo.id] }, { replaceObjectFields: true })];
                case 38:
                    _g.sent();
                    return [4 /*yield*/, sdk.api.group_mms_conversations.updateOne(groupMMS.id, { assignedTo: [sdk.userInfo.id] }, { replaceObjectFields: true })];
                case 39:
                    _g.sent();
                    return [4 /*yield*/, sdk.api.phone_calls.updateOne(call.id, { assignedTo: [sdk.userInfo.id] }, { replaceObjectFields: true })];
                case 40:
                    _g.sent();
                    return [4 /*yield*/, sdk.api.ticket_threads.updateOne(thread.id, { assignedTo: [sdk.userInfo.id] }, { replaceObjectFields: true })];
                case 41:
                    _g.sent();
                    return [4 /*yield*/, sdk.api.ticket_thread_comments.updateOne(comment.id, { assignedTo: [sdk.userInfo.id] }, { replaceObjectFields: true })];
                case 42:
                    _g.sent();
                    return [4 /*yield*/, sdk.api.chat_rooms.updateOne(room.id, { userIds: [sdk.userInfo.id] }, { replaceObjectFields: true })];
                case 43:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('admin doesnt load inbox data with assignedTo as other filter', function () { return sdk.api.endusers.load_inbox_data({ userId: sdkNonAdmin.userInfo.id }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); }
                        })];
                case 44:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('admin loads inbox data for other user as filter assignedTo', function () { return sdk.api.endusers.load_inbox_data({ userId: sdk.userInfo.id }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 1
                                && r.emails.length === 1
                                && r.sms_messages.length === 1
                                && r.group_mms_conversations.length === 1
                                && r.phone_calls.length === 1
                                && r.ticket_thread_comments.length === 1
                                && r.endusers.length === 1); }
                        })];
                case 45:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('admin loads inbox data with no user', function () { return sdk.api.endusers.load_inbox_data({}); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 1
                                && r.emails.length === 1
                                && r.sms_messages.length === 1
                                && r.group_mms_conversations.length === 1
                                && r.phone_calls.length === 1
                                && r.ticket_thread_comments.length === 1
                                && r.endusers.length === 1); }
                        })];
                case 46:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('admin loads inbox data with used enduser', function () { return sdk.api.endusers.load_inbox_data({ enduserIds: [e.id] }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 1
                                && r.emails.length === 1
                                && r.sms_messages.length === 1
                                && r.group_mms_conversations.length === 1
                                && r.phone_calls.length === 1
                                && r.ticket_thread_comments.length === 1
                                && r.endusers.length === 1); }
                        })];
                case 47:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('admin loads inbox data with unused enduser', function () { return sdk.api.endusers.load_inbox_data({ enduserIds: [e2.id] }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); }
                        })];
                case 48:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('Non-admin cant load inbox data with assignedTo as other (self as filter)', function () { return sdkNonAdmin.api.endusers.load_inbox_data({ userId: sdkNonAdmin.userInfo.id }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); }
                        })];
                case 49:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('Non-admin can load inbox data for other user as filter, assignedTo', function () { return sdkNonAdmin.api.endusers.load_inbox_data({ userId: sdk.userInfo.id }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 1
                                && r.emails.length === 1
                                && r.sms_messages.length === 1
                                && r.group_mms_conversations.length === 1
                                && r.phone_calls.length === 1
                                && r.ticket_thread_comments.length === 1
                                && r.endusers.length === 1); }
                        })];
                case 50:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('Non-admin can load inbox data with no user', function () { return sdkNonAdmin.api.endusers.load_inbox_data({}); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 1
                                && r.emails.length === 1
                                && r.sms_messages.length === 1
                                && r.group_mms_conversations.length === 1
                                && r.phone_calls.length === 1
                                && r.ticket_thread_comments.length === 1
                                && r.endusers.length === 1); }
                        })
                        // assign other user to all threads
                    ];
                case 51:
                    _g.sent();
                    // assign other user to all threads
                    return [4 /*yield*/, sdk.api.emails.updateOne(email.id, { assignedTo: [sdkNonAdmin.userInfo.id] })];
                case 52:
                    // assign other user to all threads
                    _g.sent();
                    return [4 /*yield*/, sdk.api.sms_messages.updateOne(sms.id, { assignedTo: [sdkNonAdmin.userInfo.id] })];
                case 53:
                    _g.sent();
                    return [4 /*yield*/, sdk.api.group_mms_conversations.updateOne(groupMMS.id, { assignedTo: [sdkNonAdmin.userInfo.id] })];
                case 54:
                    _g.sent();
                    return [4 /*yield*/, sdk.api.phone_calls.updateOne(call.id, { assignedTo: [sdkNonAdmin.userInfo.id] })];
                case 55:
                    _g.sent();
                    return [4 /*yield*/, sdk.api.ticket_threads.updateOne(thread.id, { assignedTo: [sdkNonAdmin.userInfo.id] })];
                case 56:
                    _g.sent();
                    return [4 /*yield*/, sdk.api.ticket_thread_comments.updateOne(comment.id, { assignedTo: [sdkNonAdmin.userInfo.id] })];
                case 57:
                    _g.sent();
                    return [4 /*yield*/, sdk.api.chat_rooms.updateOne(room.id, { assignedTo: [sdkNonAdmin.userInfo.id] })];
                case 58:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('[both assigned] admin does load inbox data with assignedTo as other filter', function () { return sdk.api.endusers.load_inbox_data({ userId: sdkNonAdmin.userInfo.id }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 1
                                && r.emails.length === 1
                                && r.sms_messages.length === 1
                                && r.group_mms_conversations.length === 1
                                && r.phone_calls.length === 1
                                && r.ticket_thread_comments.length === 1
                                && r.endusers.length === 1); }
                        })];
                case 59:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('[both assigned] admin loads inbox data for other user as filter assignedTo', function () { return sdk.api.endusers.load_inbox_data({ userId: sdk.userInfo.id }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 1
                                && r.emails.length === 1
                                && r.sms_messages.length === 1
                                && r.group_mms_conversations.length === 1
                                && r.phone_calls.length === 1
                                && r.ticket_thread_comments.length === 1
                                && r.endusers.length === 1); }
                        })];
                case 60:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('[both assigned] admin loads inbox data with no user', function () { return sdk.api.endusers.load_inbox_data({}); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 1
                                && r.emails.length === 1
                                && r.sms_messages.length === 1
                                && r.group_mms_conversations.length === 1
                                && r.phone_calls.length === 1
                                && r.ticket_thread_comments.length === 1
                                && r.endusers.length === 1); }
                        })];
                case 61:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('[both assigned] admin loads inbox data with used enduser', function () { return sdk.api.endusers.load_inbox_data({ enduserIds: [e.id] }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 1
                                && r.emails.length === 1
                                && r.sms_messages.length === 1
                                && r.group_mms_conversations.length === 1
                                && r.phone_calls.length === 1
                                && r.ticket_thread_comments.length === 1
                                && r.endusers.length === 1); }
                        })];
                case 62:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('[both assigned] admin loads inbox data with unused enduser', function () { return sdk.api.endusers.load_inbox_data({ enduserIds: [e2.id] }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); }
                        })];
                case 63:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('[both assigned] Non-admin can load inbox data with assignedTo as other (self as filter)', function () { return sdkNonAdmin.api.endusers.load_inbox_data({ userId: sdkNonAdmin.userInfo.id }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 1
                                && r.emails.length === 1
                                && r.sms_messages.length === 1
                                && r.group_mms_conversations.length === 1
                                && r.phone_calls.length === 1
                                && r.ticket_thread_comments.length === 1
                                && r.endusers.length === 1); }
                        })];
                case 64:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('[both assigned] Non-admin can load inbox data for other user as filter, assignedTo', function () { return sdkNonAdmin.api.endusers.load_inbox_data({ userId: sdk.userInfo.id }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 1
                                && r.emails.length === 1
                                && r.sms_messages.length === 1
                                && r.group_mms_conversations.length === 1
                                && r.phone_calls.length === 1
                                && r.ticket_thread_comments.length === 1
                                && r.endusers.length === 1); }
                        })];
                case 65:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('[both assigned] Non-admin can load inbox data with no user', function () { return sdkNonAdmin.api.endusers.load_inbox_data({}); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 1
                                && r.emails.length === 1
                                && r.sms_messages.length === 1
                                && r.group_mms_conversations.length === 1
                                && r.phone_calls.length === 1
                                && r.ticket_thread_comments.length === 1
                                && r.endusers.length === 1); }
                        })];
                case 66:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('[both assigned] Non-admin can load inbox data with used enduser', function () { return sdkNonAdmin.api.endusers.load_inbox_data({ enduserIds: [e.id] }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 1
                                && r.emails.length === 1
                                && r.sms_messages.length === 1
                                && r.group_mms_conversations.length === 1
                                && r.phone_calls.length === 1
                                && r.ticket_thread_comments.length === 1
                                && r.endusers.length === 1); }
                        })];
                case 67:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('[both assigned] Non-admin cant load inbox data with unused enduser', function () { return sdkNonAdmin.api.endusers.load_inbox_data({ enduserIds: [e2.id] }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); }
                        })];
                case 68:
                    _g.sent();
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.createOne({
                            role: 'No Access',
                            permissions: {
                                emails: { read: null, create: null, update: null, delete: null },
                                sms_messages: { read: null, create: null, update: null, delete: null },
                                group_mms_conversations: { read: null, create: null, update: null, delete: null },
                                phone_calls: { read: null, create: null, update: null, delete: null },
                                ticket_threads: { read: null, create: null, update: null, delete: null },
                                ticket_thread_comments: { read: null, create: null, update: null, delete: null },
                                chat_rooms: { read: null, create: null, update: null, delete: null },
                                // read must be default for endpoint to return non 403
                                endusers: { read: 'Default', create: null, update: null, delete: null },
                            },
                        })];
                case 69:
                    noAccessRole = _g.sent();
                    roleTestUserEmail = 'inbox.role.test@tellescope.com';
                    return [4 /*yield*/, sdk.api.users.getOne({ email: roleTestUserEmail }).catch(function () { return null; })]; // throws error on none found
                case 70:
                    _b = (_g.sent() // throws error on none found
                    );
                    if (_b) return [3 /*break*/, 72];
                    return [4 /*yield*/, sdk.api.users.createOne({ email: roleTestUserEmail, notificationEmailsDisabled: true })];
                case 71:
                    _b = (_g.sent());
                    _g.label = 72;
                case 72:
                    roleTestUser = _b;
                    // ensure role is set, in case GET returned a user without a role or with a different role
                    return [4 /*yield*/, sdk.api.users.updateOne(roleTestUser.id, { roles: [noAccessRole.role] }, { replaceObjectFields: true })
                        // add to care team to ensure this doesn't grant unexpected access
                    ];
                case 73:
                    // ensure role is set, in case GET returned a user without a role or with a different role
                    _g.sent();
                    // add to care team to ensure this doesn't grant unexpected access
                    return [4 /*yield*/, sdk.api.endusers.updateOne(e.id, { assignedTo: [roleTestUser.id] })];
                case 74:
                    // add to care team to ensure this doesn't grant unexpected access
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 2000)]; // role change triggers a logout
                case 75:
                    _g.sent(); // role change triggers a logout
                    _c = sdk_1.Session.bind;
                    _e = {
                        host: host
                    };
                    return [4 /*yield*/, sdk.api.users.generate_auth_token({ id: roleTestUser.id })];
                case 76:
                    sdkNoAccess = new (_c.apply(sdk_1.Session, [void 0, (_e.authToken = (_g.sent()).authToken,
                            _e)]))();
                    return [4 /*yield*/, (0, testing_1.async_test)('test_authenticated (no access)', sdkNoAccess.test_authenticated, { expectedResult: 'Authenticated!' })];
                case 77:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('verify no-read on direct API call', sdkNoAccess.api.emails.getSome, testing_1.handleAnyError)]; // ensures role is set up correctly
                case 78:
                    _g.sent(); // ensures role is set up correctly
                    return [4 /*yield*/, (0, testing_1.async_test)("No access reads nothing", function () { return sdkNoAccess.api.endusers.load_inbox_data({}); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); }
                        })];
                case 79:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("No access reads nothing for used enduser", function () { return sdkNoAccess.api.endusers.load_inbox_data({ enduserIds: [e.id] }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); }
                        })];
                case 80:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("No access reads nothing for unused enduser", function () { return sdkNoAccess.api.endusers.load_inbox_data({ enduserIds: [e2.id] }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); }
                        })];
                case 81:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("No access reads nothing (for self)", function () { return sdkNoAccess.api.endusers.load_inbox_data({ userId: roleTestUser.id }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); }
                        })];
                case 82:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("No access reads nothing (for assigned admin)", function () { return sdkNoAccess.api.endusers.load_inbox_data({ userId: sdk.userInfo.id }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); }
                        })];
                case 83:
                    _g.sent();
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.createOne({
                            role: 'Default Access',
                            permissions: {
                                emails: { read: 'Default', create: 'Default', update: 'Default', delete: 'Default' },
                                sms_messages: { read: 'Default', create: 'Default', update: 'Default', delete: 'Default' },
                                group_mms_conversations: { read: 'Default', create: 'Default', update: 'Default', delete: 'Default' },
                                phone_calls: { read: 'Default', create: 'Default', update: 'Default', delete: 'Default' },
                                ticket_threads: { read: 'Default', create: 'Default', update: 'Default', delete: 'Default' },
                                ticket_thread_comments: { read: 'Default', create: 'Default', update: 'Default', delete: 'Default' },
                                chat_rooms: { read: 'Default', create: 'Default', update: 'Default', delete: 'Default' },
                                endusers: { read: 'Default', create: 'Default', update: 'Default', delete: 'Default' },
                            },
                        })];
                case 84:
                    defaultAccessRole = _g.sent();
                    return [4 /*yield*/, sdk.api.users.updateOne(roleTestUser.id, { roles: [defaultAccessRole.role] }, { replaceObjectFields: true })];
                case 85:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 2000)]; // role change triggers a logout
                case 86:
                    _g.sent(); // role change triggers a logout
                    _d = sdk_1.Session.bind;
                    _f = {
                        host: host
                    };
                    return [4 /*yield*/, sdk.api.users.generate_auth_token({ id: roleTestUser.id })];
                case 87:
                    sdkDefaultAccess = new (_d.apply(sdk_1.Session, [void 0, (_f.authToken = (_g.sent()).authToken,
                            _f)]))();
                    return [4 /*yield*/, (0, testing_1.async_test)('test_authenticated (default access)', sdkDefaultAccess.test_authenticated, { expectedResult: 'Authenticated!' })];
                case 88:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Default access reads nothing", function () { return sdkDefaultAccess.api.endusers.load_inbox_data({}); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); }
                        })];
                case 89:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Default access reads nothing for used enduser", function () { return sdkDefaultAccess.api.endusers.load_inbox_data({ enduserIds: [e.id] }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); }
                        })];
                case 90:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Default access reads nothing for unused enduser", function () { return sdkDefaultAccess.api.endusers.load_inbox_data({ enduserIds: [e2.id] }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); }
                        })];
                case 91:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Default access reads nothing (for self)", function () { return sdkDefaultAccess.api.endusers.load_inbox_data({ userId: roleTestUser.id }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); }
                        })];
                case 92:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Default access reads nothing (for assigned admin)", function () { return sdkDefaultAccess.api.endusers.load_inbox_data({ userId: sdk.userInfo.id }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); }
                        })
                        // assign default user to the specific messages by setting userId, userIds, etc.
                    ];
                case 93:
                    _g.sent();
                    // assign default user to the specific messages by setting userId, userIds, etc.
                    return [4 /*yield*/, sdk.api.emails.updateOne(email.id, { assignedTo: [], userId: roleTestUser.id }, { replaceObjectFields: true })];
                case 94:
                    // assign default user to the specific messages by setting userId, userIds, etc.
                    _g.sent();
                    return [4 /*yield*/, sdk.api.sms_messages.updateOne(sms.id, { assignedTo: [], userId: roleTestUser.id }, { replaceObjectFields: true })];
                case 95:
                    _g.sent();
                    return [4 /*yield*/, sdk.api.group_mms_conversations.updateOne(groupMMS.id, { assignedTo: [], userIds: [roleTestUser.id] }, { replaceObjectFields: true })];
                case 96:
                    _g.sent();
                    return [4 /*yield*/, sdk.api.phone_calls.updateOne(call.id, { assignedTo: [], userId: roleTestUser.id }, { replaceObjectFields: true })];
                case 97:
                    _g.sent();
                    return [4 /*yield*/, sdk.api.ticket_thread_comments.updateOne(comment.id, { assignedTo: [], userId: roleTestUser.id }, { replaceObjectFields: true })
                        // need to replace assignedTo for userIds to take precedent
                    ];
                case 98:
                    _g.sent();
                    // need to replace assignedTo for userIds to take precedent
                    return [4 /*yield*/, sdk.api.chat_rooms.updateOne(room.id, { assignedTo: [], userIds: [roleTestUser.id] }, { replaceObjectFields: true })];
                case 99:
                    // need to replace assignedTo for userIds to take precedent
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Default access reads stuff when assigned", function () { return sdkDefaultAccess.api.endusers.load_inbox_data({}); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 1
                                && r.emails.length === 1
                                && r.sms_messages.length === 1
                                && r.group_mms_conversations.length === 1
                                && r.phone_calls.length === 1
                                && r.ticket_thread_comments.length === 1
                                && r.endusers.length === 1); }
                        })];
                case 100:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Default access reads stuff when assigned for used enduser", function () { return sdkDefaultAccess.api.endusers.load_inbox_data({ enduserIds: [e.id] }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 1
                                && r.emails.length === 1
                                && r.sms_messages.length === 1
                                && r.group_mms_conversations.length === 1
                                && r.phone_calls.length === 1
                                && r.ticket_thread_comments.length === 1
                                && r.endusers.length === 1); }
                        })];
                case 101:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Default access reads stuff when assigned for unused enduser", function () { return sdkDefaultAccess.api.endusers.load_inbox_data({ enduserIds: [e2.id] }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 0
                                && r.emails.length === 0
                                && r.sms_messages.length === 0
                                && r.group_mms_conversations.length === 0
                                && r.phone_calls.length === 0
                                && r.ticket_thread_comments.length === 0
                                && r.endusers.length === 0); }
                        })];
                case 102:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Default access reads stuff when assigned (for self)", function () { return sdkDefaultAccess.api.endusers.load_inbox_data({ userId: roleTestUser.id }); }, {
                            onResult: function (r) { return (r.chat_rooms.length === 1
                                && r.emails.length === 1
                                && r.sms_messages.length === 1
                                && r.group_mms_conversations.length === 1
                                && r.phone_calls.length === 1
                                && r.ticket_thread_comments.length === 1
                                && r.endusers.length === 1); }
                        })
                        // PhoneNumber filtering tests
                    ];
                case 103:
                    _g.sent();
                    // PhoneNumber filtering tests
                    (0, testing_1.log_header)("PhoneNumber Filtering Tests");
                    testPhone1 = '+15555555550';
                    testPhone2 = '+15555555551';
                    testPhone3 = '+15555555555';
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            logOnly: true,
                            inbound: true,
                            enduserId: e.id,
                            message: 'SMS with phone 1',
                            userId: sdk.userInfo.id,
                        })];
                case 104:
                    smsWithPhone1 = _g.sent();
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            logOnly: true,
                            inbound: true,
                            enduserId: e2.id,
                            message: 'SMS with phone 2',
                            userId: sdk.userInfo.id,
                        })
                        // Update SMS messages with phone numbers (may bypass creation validation)
                    ];
                case 105:
                    smsWithPhone2 = _g.sent();
                    // Update SMS messages with phone numbers (may bypass creation validation)
                    return [4 /*yield*/, sdk.api.sms_messages.updateOne(smsWithPhone1.id, { phoneNumber: testPhone1 })];
                case 106:
                    // Update SMS messages with phone numbers (may bypass creation validation)
                    _g.sent();
                    return [4 /*yield*/, sdk.api.sms_messages.updateOne(smsWithPhone2.id, { phoneNumber: testPhone2 })];
                case 107:
                    _g.sent();
                    return [4 /*yield*/, sdk.api.phone_calls.createOne({
                            enduserId: e.id,
                            inbound: true,
                            to: testPhone1,
                            from: '+15550000000',
                            userId: sdk.userInfo.id
                        })];
                case 108:
                    callInboundPhone1 = _g.sent();
                    return [4 /*yield*/, sdk.api.phone_calls.createOne({
                            enduserId: e2.id,
                            inbound: false,
                            to: '+15550000000',
                            from: testPhone2,
                            userId: sdk.userInfo.id
                        })];
                case 109:
                    _g.sent();
                    return [4 /*yield*/, sdk.api.phone_calls.createOne({
                            enduserId: e.id,
                            inbound: true,
                            to: testPhone3,
                            from: '+15550000000',
                            userId: sdk.userInfo.id
                        })];
                case 110:
                    callInboundPhone3 = _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("PhoneNumber filter: SMS messages filtered by phoneNumber", function () { return sdk.api.endusers.load_inbox_data({ phoneNumber: testPhone1 }); }, { onResult: function (r) { return (r.sms_messages.length === 1
                                && r.sms_messages[0].id === smsWithPhone1.id
                                && r.sms_messages[0].phoneNumber === testPhone1
                                && r.phone_calls.length === 1 // inbound call with matching 'to' field
                                && r.phone_calls[0].id === callInboundPhone1.id); } })];
                case 111:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("PhoneNumber filter: Inbound calls filtered by 'to' field", function () { return sdk.api.endusers.load_inbox_data({ phoneNumber: testPhone3 }); }, { onResult: function (r) { return (r.phone_calls.length === 1
                                && r.phone_calls[0].id === callInboundPhone3.id
                                && r.phone_calls[0].to === testPhone3
                                && r.phone_calls[0].inbound === true
                                && r.sms_messages.length === 0); } })];
                case 112:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("PhoneNumber filter: No matches returns empty results", function () { return sdk.api.endusers.load_inbox_data({ phoneNumber: '+15555555559' }); }, { onResult: function (r) { return (r.sms_messages.length === 0
                                && r.phone_calls.length === 0); } })];
                case 113:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("PhoneNumber filter: Combined with enduserIds filter", function () { return sdk.api.endusers.load_inbox_data({ phoneNumber: testPhone1, enduserIds: [e.id] }); }, { onResult: function (r) { return (r.sms_messages.length === 1
                                && r.sms_messages[0].id === smsWithPhone1.id
                                && r.phone_calls.length === 1
                                && r.phone_calls[0].id === callInboundPhone1.id); } })];
                case 114:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("PhoneNumber filter: Combined with enduserIds filter (no match)", function () { return sdk.api.endusers.load_inbox_data({ phoneNumber: testPhone1, enduserIds: [e2.id] }); }, { onResult: function (r) { return (r.sms_messages.length === 0
                                && r.phone_calls.length === 0); } })];
                case 115:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("PhoneNumber filter: SMS and phone calls filtered correctly", function () { return sdk.api.endusers.load_inbox_data({ phoneNumber: testPhone1 }); }, { onResult: function (r) { return (r.sms_messages.length === 1 // SMS correctly filtered
                                && r.phone_calls.length === 1 // Phone calls correctly filtered
                            ); } })];
                case 116:
                    _g.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("No phoneNumber filter: All messages load normally", function () { return sdk.api.endusers.load_inbox_data({}); }, { onResult: function (r) { return (
                            // Should return all messages including both original and phoneNumber test data
                            r.sms_messages.length >= 3 // original + 2 new SMS messages
                                && r.phone_calls.length >= 3 // original + 2 new inbound phone calls
                            ); } })];
                case 117:
                    _g.sent();
                    return [4 /*yield*/, Promise.all([
                            sdk.api.endusers.deleteOne(e.id),
                            sdk.api.endusers.deleteOne(e2.id),
                            sdk.api.chat_rooms.deleteOne(room.id),
                            sdk.api.role_based_access_permissions.deleteOne(noAccessRole.id),
                            sdk.api.role_based_access_permissions.deleteOne(defaultAccessRole.id),
                            sdk.api.users.deleteOne(roleTestUser.id),
                        ])];
                case 118:
                    _g.sent();
                    return [2 /*return*/];
            }
        });
    });
};
exports.load_inbox_data_tests = load_inbox_data_tests;
// Allow running this test file independently
if (require.main === module) {
    var sdk_2 = new sdk_1.Session({ host: host });
    var sdkNonAdmin_1 = new sdk_1.Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, setup_1.setup_tests)(sdk_2, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, exports.load_inbox_data_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Load inbox data test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Load inbox data test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=load_inbox_data.test.js.map