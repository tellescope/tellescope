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
import { assert, log_header, wait, } from "@tellescope/testing";
import { setup_tests } from "../setup";
var host = process.env.API_URL || 'http://localhost:8080';
export var inbox_thread_draft_scheduled_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var timestamp, from, testUser, testEnduser, resetAndBuildThreads, phoneNumber_1, enduserPhoneNumber_1, sentSMS, draftSMS, loadedThreads, smsThread, futureDate, scheduledSMS, loadedThreads2, threadWithScheduled, emailSubject_1, sentEmail, draftEmail, loadedThreads3, emailThread, scheduledEmail, loadedThreads4, emailThreadWithScheduled, draftOnlyEnduserPhoneNumber_1, draftOnlySMS, loadedThreads5, draftOnlyThread, draftOnlyEmailSubject_1, draftOnlyEmail, loadedThreads5b, draftOnlyEmailThread, sentOnlyPhoneNumber_1, sentOnlyEnduserPhoneNumber_1, loadedThreads6, sentOnlyThread, chatRoom, farFuture, draftChat, loadedThreads7, chatThreadBefore_1, loadedThreads7b, chatThreadWithDraft, loadedThreads8, chatThreadAfter, deleteTestPhoneNumber_1, deleteTestEnduserPhoneNumber_1, draftSmsToDelete, loadedThreads9a, smsDeleteThread_1, loadedThreads9b, smsDeleteThreadAfter, deleteEmailSubject_1, draftEmailToDelete, loadedThreads10a, emailDeleteThread_1, loadedThreads10b, emailDeleteThreadAfter, chatRoomForDeletion, farFuture2, draftChatToDelete, loadedThreads11a, chatDeleteThread_1, loadedThreads11b, chatDeleteThreadWithDraft, loadedThreads11c, chatDeleteThreadAfter, attachmentTestRoom_1, loadedThreads12, attachmentThread;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        return __generator(this, function (_x) {
            switch (_x.label) {
                case 0:
                    log_header("InboxThread Draft and Scheduled Message Tests");
                    timestamp = Date.now();
                    from = new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
                    ;
                    return [4 /*yield*/, sdk.api.users.createOne({
                            fname: "Test",
                            lname: "User",
                            email: "test-draft-scheduled-".concat(timestamp, "@test.com"),
                            notificationEmailsDisabled: true
                        })];
                case 1:
                    testUser = _x.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: "Test",
                            lname: "Patient",
                            email: "test-patient-draft-".concat(timestamp, "@test.com"),
                            phone: "+15555555555", // Required for SMS tests
                        })
                        // Helper to reset and rebuild threads
                    ];
                case 2:
                    testEnduser = _x.sent();
                    resetAndBuildThreads = function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, sdk.api.inbox_threads.reset_threads()];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, sdk.api.inbox_threads.build_threads({ from: from, to: new Date() })];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    _x.label = 3;
                case 3:
                    _x.trys.push([3, , 72, 76]);
                    // ===== SMS Draft/Scheduled Tests =====
                    log_header("SMS Draft and Scheduled Tests");
                    // Test 1: Draft SMS should be tracked in draftMessageIds but excluded from preview
                    console.log("Testing draft SMS tracking...");
                    phoneNumber_1 = "+15555555550";
                    enduserPhoneNumber_1 = "+15555555551";
                    // Create an inbound SMS to establish the thread with proper phone numbers
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "Inbound message to establish thread",
                            enduserId: testEnduser.id,
                            userId: testUser.id,
                            inbound: true,
                            phoneNumber: phoneNumber_1,
                            enduserPhoneNumber: enduserPhoneNumber_1,
                            logOnly: true,
                        })
                        // Create a regular outbound SMS
                    ];
                case 4:
                    // Create an inbound SMS to establish the thread with proper phone numbers
                    _x.sent();
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "This is a sent message",
                            enduserId: testEnduser.id,
                            userId: testUser.id,
                            inbound: false,
                            phoneNumber: phoneNumber_1,
                            enduserPhoneNumber: enduserPhoneNumber_1,
                            logOnly: true,
                        })
                        // Create a draft SMS
                    ];
                case 5:
                    sentSMS = _x.sent();
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "This is a draft message",
                            enduserId: testEnduser.id,
                            userId: testUser.id,
                            inbound: false,
                            phoneNumber: phoneNumber_1,
                            enduserPhoneNumber: enduserPhoneNumber_1,
                            isDraft: true,
                            logOnly: true,
                        })
                        // Build threads from messages
                    ];
                case 6:
                    draftSMS = _x.sent();
                    // Build threads from messages
                    return [4 /*yield*/, resetAndBuildThreads()
                        // Load the thread and verify
                    ];
                case 7:
                    // Build threads from messages
                    _x.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 8:
                    loadedThreads = _x.sent();
                    smsThread = loadedThreads.threads.find(function (t) {
                        return t.type === 'SMS' && t.phoneNumber === phoneNumber_1 && t.enduserPhoneNumber === enduserPhoneNumber_1;
                    });
                    assert(!!smsThread, "SMS thread should be found");
                    assert(((_b = smsThread.draftMessageIds) === null || _b === void 0 ? void 0 : _b.includes(draftSMS.id)) === true, "Draft SMS ID should be in draftMessageIds. Got: ".concat(JSON.stringify(smsThread.draftMessageIds)));
                    assert(((_c = smsThread.preview) === null || _c === void 0 ? void 0 : _c.includes("This is a sent message")) === true, "Preview should be from sent message, not draft. Got: ".concat(smsThread.preview));
                    assert(!smsThread.isDraftOnlyThread, "isDraftOnlyThread should be falsy for threads with sent messages. Got: ".concat(smsThread.isDraftOnlyThread));
                    console.log("✅ Draft SMS tracking test passed");
                    // Test 2: Scheduled SMS (future sendAt) should be tracked in scheduledMessageIds
                    console.log("Testing scheduled SMS tracking...");
                    futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
                    ;
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "This is a scheduled message",
                            enduserId: testEnduser.id,
                            userId: testUser.id,
                            inbound: false,
                            phoneNumber: phoneNumber_1,
                            enduserPhoneNumber: enduserPhoneNumber_1,
                            sendAt: futureDate,
                            logOnly: true,
                        })
                        // Rebuild threads
                    ];
                case 9:
                    scheduledSMS = _x.sent();
                    // Rebuild threads
                    return [4 /*yield*/, resetAndBuildThreads()];
                case 10:
                    // Rebuild threads
                    _x.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 11:
                    loadedThreads2 = _x.sent();
                    threadWithScheduled = loadedThreads2.threads.find(function (t) {
                        return t.type === 'SMS' && t.phoneNumber === phoneNumber_1 && t.enduserPhoneNumber === enduserPhoneNumber_1;
                    });
                    assert(!!threadWithScheduled, "SMS thread should be found");
                    assert(((_d = threadWithScheduled.scheduledMessageIds) === null || _d === void 0 ? void 0 : _d.includes(scheduledSMS.id)) === true, "Scheduled SMS ID should be in scheduledMessageIds. Got: ".concat(JSON.stringify(threadWithScheduled.scheduledMessageIds)));
                    assert(((_e = threadWithScheduled.preview) === null || _e === void 0 ? void 0 : _e.includes("This is a scheduled message")) !== true, "Preview should NOT be from scheduled message. Got: ".concat(threadWithScheduled.preview));
                    console.log("✅ Scheduled SMS tracking test passed");
                    // ===== Email Draft/Scheduled Tests =====
                    log_header("Email Draft and Scheduled Tests");
                    // Test 3: Draft email should be tracked in draftMessageIds
                    console.log("Testing draft email tracking...");
                    emailSubject_1 = "Draft Test Email ".concat(timestamp);
                    return [4 /*yield*/, sdk.api.emails.createOne({
                            subject: emailSubject_1,
                            textContent: "This is a sent email",
                            enduserId: testEnduser.id,
                            userId: testUser.id,
                            messageId: "sent-email-".concat(timestamp),
                            logOnly: true,
                        })
                        // Create a draft email
                    ];
                case 12:
                    sentEmail = _x.sent();
                    return [4 /*yield*/, sdk.api.emails.createOne({
                            subject: emailSubject_1,
                            textContent: "This is a draft email",
                            enduserId: testEnduser.id,
                            userId: testUser.id,
                            messageId: "draft-email-".concat(timestamp),
                            isDraft: true,
                            logOnly: true,
                        })
                        // Rebuild threads
                    ];
                case 13:
                    draftEmail = _x.sent();
                    // Rebuild threads
                    return [4 /*yield*/, resetAndBuildThreads()];
                case 14:
                    // Rebuild threads
                    _x.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 15:
                    loadedThreads3 = _x.sent();
                    emailThread = loadedThreads3.threads.find(function (t) { return t.type === 'Email' && t.title === emailSubject_1; });
                    assert(!!emailThread, "Email thread should be found");
                    assert(((_f = emailThread.draftMessageIds) === null || _f === void 0 ? void 0 : _f.includes(draftEmail.id)) === true, "Draft Email ID should be in draftMessageIds. Got: ".concat(JSON.stringify(emailThread.draftMessageIds)));
                    assert(((_g = emailThread.preview) === null || _g === void 0 ? void 0 : _g.includes("This is a sent email")) === true, "Preview should be from sent email, not draft. Got: ".concat(emailThread.preview));
                    assert(!emailThread.isDraftOnlyThread, "isDraftOnlyThread should be falsy for threads with sent messages. Got: ".concat(emailThread.isDraftOnlyThread));
                    console.log("✅ Draft email tracking test passed");
                    // Test 4: Scheduled email (future sendAt) should be tracked in scheduledMessageIds
                    console.log("Testing scheduled email tracking...");
                    return [4 /*yield*/, sdk.api.emails.createOne({
                            subject: emailSubject_1,
                            textContent: "This is a scheduled email",
                            enduserId: testEnduser.id,
                            userId: testUser.id,
                            messageId: "scheduled-email-".concat(timestamp),
                            sendAt: futureDate,
                            logOnly: true,
                        })
                        // Rebuild threads
                    ];
                case 16:
                    scheduledEmail = _x.sent();
                    // Rebuild threads
                    return [4 /*yield*/, resetAndBuildThreads()];
                case 17:
                    // Rebuild threads
                    _x.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 18:
                    loadedThreads4 = _x.sent();
                    emailThreadWithScheduled = loadedThreads4.threads.find(function (t) { return t.type === 'Email' && t.title === emailSubject_1; });
                    assert(!!emailThreadWithScheduled, "Email thread should be found");
                    assert(((_h = emailThreadWithScheduled.scheduledMessageIds) === null || _h === void 0 ? void 0 : _h.includes(scheduledEmail.id)) === true, "Scheduled Email ID should be in scheduledMessageIds. Got: ".concat(JSON.stringify(emailThreadWithScheduled.scheduledMessageIds)));
                    assert(((_j = emailThreadWithScheduled.preview) === null || _j === void 0 ? void 0 : _j.includes("This is a scheduled email")) !== true, "Preview should NOT be from scheduled email. Got: ".concat(emailThreadWithScheduled.preview));
                    console.log("✅ Scheduled email tracking test passed");
                    // Test 5: Thread with ONLY drafts should still have a preview from the drafts
                    console.log("Testing thread with only draft messages...");
                    draftOnlyEnduserPhoneNumber_1 = "+15555555561";
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "This is the only message and it is a draft",
                            enduserId: testEnduser.id,
                            userId: testUser.id,
                            inbound: false,
                            phoneNumber: "+15555555560",
                            enduserPhoneNumber: draftOnlyEnduserPhoneNumber_1,
                            isDraft: true,
                            logOnly: true,
                        })
                        // Rebuild threads
                    ];
                case 19:
                    draftOnlySMS = _x.sent();
                    // Rebuild threads
                    return [4 /*yield*/, resetAndBuildThreads()];
                case 20:
                    // Rebuild threads
                    _x.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})
                        // Match only on enduserPhoneNumber since there's no inbound to set phoneNumber
                    ];
                case 21:
                    loadedThreads5 = _x.sent();
                    draftOnlyThread = loadedThreads5.threads.find(function (t) {
                        return t.type === 'SMS' && t.enduserPhoneNumber === draftOnlyEnduserPhoneNumber_1;
                    });
                    assert(!!draftOnlyThread, "Draft-only thread should be found");
                    assert(((_k = draftOnlyThread.draftMessageIds) === null || _k === void 0 ? void 0 : _k.includes(draftOnlySMS.id)) === true, "Draft SMS ID should be in draftMessageIds");
                    // When only drafts exist, the draft is used as fallback for preview
                    assert(((_l = draftOnlyThread.preview) === null || _l === void 0 ? void 0 : _l.includes("only message")) === true, "Preview should fall back to draft when no sent messages exist. Got: ".concat(draftOnlyThread.preview));
                    assert(draftOnlyThread.isDraftOnlyThread === true, "isDraftOnlyThread should be true for draft-only threads. Got: ".concat(draftOnlyThread.isDraftOnlyThread));
                    console.log("✅ Thread with only draft messages test passed");
                    // Test 5b: Thread with ONLY draft email should create placeholder thread
                    console.log("Testing thread with only draft email messages...");
                    draftOnlyEmailSubject_1 = "Draft-Only Email Test ".concat(timestamp);
                    return [4 /*yield*/, sdk.api.emails.createOne({
                            subject: draftOnlyEmailSubject_1,
                            textContent: "This is a draft-only email, no sent messages exist",
                            enduserId: testEnduser.id,
                            userId: testUser.id,
                            messageId: "draft-only-email-".concat(timestamp),
                            isDraft: true,
                            logOnly: true,
                        })
                        // Rebuild threads
                    ];
                case 22:
                    draftOnlyEmail = _x.sent();
                    // Rebuild threads
                    return [4 /*yield*/, resetAndBuildThreads()];
                case 23:
                    // Rebuild threads
                    _x.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 24:
                    loadedThreads5b = _x.sent();
                    draftOnlyEmailThread = loadedThreads5b.threads.find(function (t) {
                        return t.type === 'Email' && t.title === draftOnlyEmailSubject_1;
                    });
                    assert(!!draftOnlyEmailThread, "Draft-only email thread should be found");
                    assert(((_m = draftOnlyEmailThread.draftMessageIds) === null || _m === void 0 ? void 0 : _m.includes(draftOnlyEmail.id)) === true, "Draft Email ID should be in draftMessageIds. Got: ".concat(JSON.stringify(draftOnlyEmailThread.draftMessageIds)));
                    // When only drafts exist, the draft is used as fallback for preview
                    assert(((_o = draftOnlyEmailThread.preview) === null || _o === void 0 ? void 0 : _o.includes("draft-only email")) === true, "Preview should fall back to draft when no sent messages exist. Got: ".concat(draftOnlyEmailThread.preview));
                    assert(draftOnlyEmailThread.isDraftOnlyThread === true, "isDraftOnlyThread should be true for draft-only threads. Got: ".concat(draftOnlyEmailThread.isDraftOnlyThread));
                    console.log("✅ Thread with only draft email messages test passed");
                    // Test 6: Verify fields are correctly typed as arrays
                    console.log("Testing field types...");
                    assert(Array.isArray(smsThread.draftMessageIds), "draftMessageIds should be an array");
                    assert(Array.isArray(threadWithScheduled.scheduledMessageIds), "scheduledMessageIds should be an array");
                    console.log("✅ Field types test passed");
                    // Test 7: Threads with NO drafts/scheduled should have empty arrays (not undefined)
                    console.log("Testing empty array defaults for threads with only sent messages...");
                    sentOnlyPhoneNumber_1 = "+15555555570";
                    sentOnlyEnduserPhoneNumber_1 = "+15555555571";
                    // Create an inbound message to establish the thread with proper phone numbers
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "Inbound message",
                            enduserId: testEnduser.id,
                            userId: testUser.id,
                            inbound: true,
                            phoneNumber: sentOnlyPhoneNumber_1,
                            enduserPhoneNumber: sentOnlyEnduserPhoneNumber_1,
                            logOnly: true,
                        })
                        // Create an outbound sent message (no draft, no scheduled)
                    ];
                case 25:
                    // Create an inbound message to establish the thread with proper phone numbers
                    _x.sent();
                    // Create an outbound sent message (no draft, no scheduled)
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "This is a sent message only",
                            enduserId: testEnduser.id,
                            userId: testUser.id,
                            inbound: false,
                            phoneNumber: sentOnlyPhoneNumber_1,
                            enduserPhoneNumber: sentOnlyEnduserPhoneNumber_1,
                            logOnly: true,
                        })
                        // Rebuild threads
                    ];
                case 26:
                    // Create an outbound sent message (no draft, no scheduled)
                    _x.sent();
                    // Rebuild threads
                    return [4 /*yield*/, resetAndBuildThreads()];
                case 27:
                    // Rebuild threads
                    _x.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 28:
                    loadedThreads6 = _x.sent();
                    sentOnlyThread = loadedThreads6.threads.find(function (t) {
                        return t.type === 'SMS' && t.phoneNumber === sentOnlyPhoneNumber_1 && t.enduserPhoneNumber === sentOnlyEnduserPhoneNumber_1;
                    });
                    assert(!!sentOnlyThread, "Sent-only thread should be found");
                    assert(Array.isArray(sentOnlyThread.draftMessageIds) && sentOnlyThread.draftMessageIds.length === 0, "draftMessageIds should be an empty array when no drafts exist. Got: ".concat(JSON.stringify(sentOnlyThread.draftMessageIds)));
                    assert(Array.isArray(sentOnlyThread.scheduledMessageIds) && sentOnlyThread.scheduledMessageIds.length === 0, "scheduledMessageIds should be an empty array when no scheduled messages exist. Got: ".concat(JSON.stringify(sentOnlyThread.scheduledMessageIds)));
                    assert(!sentOnlyThread.isDraftOnlyThread, "isDraftOnlyThread should be falsy for threads with sent messages. Got: ".concat(sentOnlyThread.isDraftOnlyThread));
                    console.log("✅ Empty array defaults test passed");
                    // ===== Chat Draft Cleanup on Send Tests =====
                    log_header("Chat Draft Cleanup on Send Tests");
                    // Test 8: Verify draftMessageIds is cleaned up when a draft chat is sent
                    // Note: Chat threads don't auto-populate draftMessageIds during build_threads,
                    // so we manually set it up to test the cleanup logic in the event handler
                    console.log("Testing draft chat cleanup on send...");
                    return [4 /*yield*/, sdk.api.chat_rooms.createOne({
                            userIds: [testUser.id],
                            enduserIds: [testEnduser.id],
                        })
                        // Create a non-draft message first to establish the room (sets recentMessageSentAt)
                        // This is required for the room to be included in build_threads
                    ];
                case 29:
                    chatRoom = _x.sent();
                    // Create a non-draft message first to establish the room (sets recentMessageSentAt)
                    // This is required for the room to be included in build_threads
                    return [4 /*yield*/, sdk.api.chats.createOne({
                            roomId: chatRoom.id,
                            message: "Initial message to establish room",
                            senderId: testEnduser.id,
                        })
                        // Create a draft chat message (isDraft: true, sendAt far in future like webapp does)
                    ];
                case 30:
                    // Create a non-draft message first to establish the room (sets recentMessageSentAt)
                    // This is required for the room to be included in build_threads
                    _x.sent();
                    farFuture = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000) // 100 years
                    ;
                    return [4 /*yield*/, sdk.api.chats.createOne({
                            roomId: chatRoom.id,
                            message: "This is a draft chat message",
                            senderId: testUser.id,
                            isDraft: true,
                            sendAt: farFuture,
                        })
                        // Build threads to create the Chat thread
                    ];
                case 31:
                    draftChat = _x.sent();
                    // Build threads to create the Chat thread
                    return [4 /*yield*/, resetAndBuildThreads()];
                case 32:
                    // Build threads to create the Chat thread
                    _x.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 33:
                    loadedThreads7 = _x.sent();
                    chatThreadBefore_1 = loadedThreads7.threads.find(function (t) { var _a; return t.type === 'Chat' && ((_a = t.enduserIds) === null || _a === void 0 ? void 0 : _a.includes(testEnduser.id)); });
                    assert(!!chatThreadBefore_1, "Chat thread should be found");
                    assert(!chatThreadBefore_1.isDraftOnlyThread, "isDraftOnlyThread should be falsy for chat threads with sent messages. Got: ".concat(chatThreadBefore_1.isDraftOnlyThread));
                    // Manually add the draft ID to draftMessageIds to simulate the setup
                    // (Chat thread building doesn't auto-populate this, but the cleanup should still work)
                    return [4 /*yield*/, sdk.api.inbox_threads.updateOne(chatThreadBefore_1.id, {
                            draftMessageIds: [draftChat.id],
                        })
                        // Verify manual setup worked
                    ];
                case 34:
                    // Manually add the draft ID to draftMessageIds to simulate the setup
                    // (Chat thread building doesn't auto-populate this, but the cleanup should still work)
                    _x.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 35:
                    loadedThreads7b = _x.sent();
                    chatThreadWithDraft = loadedThreads7b.threads.find(function (t) { return t.id === chatThreadBefore_1.id; });
                    assert(((_p = chatThreadWithDraft.draftMessageIds) === null || _p === void 0 ? void 0 : _p.includes(draftChat.id)) === true, "Draft chat ID should be in draftMessageIds after manual setup. Got: ".concat(JSON.stringify(chatThreadWithDraft.draftMessageIds)));
                    console.log("✅ Draft chat manually added to draftMessageIds");
                    // "Send" the draft by updating isDraft to false and sendAt to now
                    // This mimics what the webapp does when user clicks send
                    return [4 /*yield*/, sdk.api.chats.updateOne(draftChat.id, {
                            isDraft: false,
                            sendAt: new Date(), // Now - triggers the scheduled chat handler
                        })
                        // Wait for the side effect to process
                    ];
                case 36:
                    // "Send" the draft by updating isDraft to false and sendAt to now
                    // This mimics what the webapp does when user clicks send
                    _x.sent();
                    // Wait for the side effect to process
                    return [4 /*yield*/, wait(undefined, 500)
                        // Reload the thread and verify cleanup happened
                    ];
                case 37:
                    // Wait for the side effect to process
                    _x.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 38:
                    loadedThreads8 = _x.sent();
                    chatThreadAfter = loadedThreads8.threads.find(function (t) { return t.id === chatThreadBefore_1.id; });
                    assert(!!chatThreadAfter, "Chat thread should be found after send");
                    assert(((_q = chatThreadAfter.draftMessageIds) === null || _q === void 0 ? void 0 : _q.includes(draftChat.id)) === false, "Draft chat ID should be REMOVED from draftMessageIds after send. Got: ".concat(JSON.stringify(chatThreadAfter.draftMessageIds)));
                    console.log("✅ Draft chat cleanup on send test passed");
                    // Cleanup chat room
                    return [4 /*yield*/, sdk.api.chat_rooms.deleteOne(chatRoom.id).catch(console.error)
                        // ===== Message Deletion Cleanup Tests =====
                    ];
                case 39:
                    // Cleanup chat room
                    _x.sent();
                    // ===== Message Deletion Cleanup Tests =====
                    log_header("Message Deletion Cleanup Tests");
                    // Test 9: SMS draft deletion should remove ID from draftMessageIds
                    console.log("Testing SMS draft deletion cleanup...");
                    deleteTestPhoneNumber_1 = "+15555555580";
                    deleteTestEnduserPhoneNumber_1 = "+15555555581";
                    // Create an inbound SMS to establish the thread
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "Inbound message to establish thread for deletion test",
                            enduserId: testEnduser.id,
                            userId: testUser.id,
                            inbound: true,
                            phoneNumber: deleteTestPhoneNumber_1,
                            enduserPhoneNumber: deleteTestEnduserPhoneNumber_1,
                            logOnly: true,
                        })
                        // Create a draft SMS
                    ];
                case 40:
                    // Create an inbound SMS to establish the thread
                    _x.sent();
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "This draft will be deleted",
                            enduserId: testEnduser.id,
                            userId: testUser.id,
                            inbound: false,
                            phoneNumber: deleteTestPhoneNumber_1,
                            enduserPhoneNumber: deleteTestEnduserPhoneNumber_1,
                            isDraft: true,
                            logOnly: true,
                        })
                        // Build threads to populate draftMessageIds
                    ];
                case 41:
                    draftSmsToDelete = _x.sent();
                    // Build threads to populate draftMessageIds
                    return [4 /*yield*/, resetAndBuildThreads()
                        // Verify the draft ID is in the thread
                    ];
                case 42:
                    // Build threads to populate draftMessageIds
                    _x.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 43:
                    loadedThreads9a = _x.sent();
                    smsDeleteThread_1 = loadedThreads9a.threads.find(function (t) {
                        return t.type === 'SMS' && t.phoneNumber === deleteTestPhoneNumber_1 && t.enduserPhoneNumber === deleteTestEnduserPhoneNumber_1;
                    });
                    assert(!!smsDeleteThread_1, "SMS thread for deletion test should be found");
                    assert(((_r = smsDeleteThread_1.draftMessageIds) === null || _r === void 0 ? void 0 : _r.includes(draftSmsToDelete.id)) === true, "Draft SMS ID should be in draftMessageIds before deletion. Got: ".concat(JSON.stringify(smsDeleteThread_1.draftMessageIds)));
                    // Delete the draft SMS
                    return [4 /*yield*/, sdk.api.sms_messages.deleteOne(draftSmsToDelete.id)
                        // Wait for the delete side effect to process
                    ];
                case 44:
                    // Delete the draft SMS
                    _x.sent();
                    // Wait for the delete side effect to process
                    return [4 /*yield*/, wait(undefined, 500)
                        // Verify the draft ID has been removed
                    ];
                case 45:
                    // Wait for the delete side effect to process
                    _x.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 46:
                    loadedThreads9b = _x.sent();
                    smsDeleteThreadAfter = loadedThreads9b.threads.find(function (t) { return t.id === smsDeleteThread_1.id; });
                    assert(!!smsDeleteThreadAfter, "SMS thread should still exist after draft deletion");
                    assert(((_s = smsDeleteThreadAfter.draftMessageIds) === null || _s === void 0 ? void 0 : _s.includes(draftSmsToDelete.id)) === false, "Draft SMS ID should be REMOVED from draftMessageIds after deletion. Got: ".concat(JSON.stringify(smsDeleteThreadAfter.draftMessageIds)));
                    console.log("✅ SMS draft deletion cleanup test passed");
                    // Test 10: Email draft deletion should remove ID from draftMessageIds
                    console.log("Testing email draft deletion cleanup...");
                    deleteEmailSubject_1 = "Delete Test Email ".concat(timestamp);
                    // Create a sent email first to establish the thread
                    return [4 /*yield*/, sdk.api.emails.createOne({
                            subject: deleteEmailSubject_1,
                            textContent: "Sent email to establish thread for deletion test",
                            enduserId: testEnduser.id,
                            userId: testUser.id,
                            messageId: "sent-email-delete-test-".concat(timestamp),
                            logOnly: true,
                        })
                        // Create a draft email
                    ];
                case 47:
                    // Create a sent email first to establish the thread
                    _x.sent();
                    return [4 /*yield*/, sdk.api.emails.createOne({
                            subject: deleteEmailSubject_1,
                            textContent: "This draft email will be deleted",
                            enduserId: testEnduser.id,
                            userId: testUser.id,
                            messageId: "draft-email-delete-test-".concat(timestamp),
                            isDraft: true,
                            logOnly: true,
                        })
                        // Build threads to populate draftMessageIds
                    ];
                case 48:
                    draftEmailToDelete = _x.sent();
                    // Build threads to populate draftMessageIds
                    return [4 /*yield*/, resetAndBuildThreads()
                        // Verify the draft ID is in the thread
                    ];
                case 49:
                    // Build threads to populate draftMessageIds
                    _x.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 50:
                    loadedThreads10a = _x.sent();
                    emailDeleteThread_1 = loadedThreads10a.threads.find(function (t) { return t.type === 'Email' && t.title === deleteEmailSubject_1; });
                    assert(!!emailDeleteThread_1, "Email thread for deletion test should be found");
                    assert(((_t = emailDeleteThread_1.draftMessageIds) === null || _t === void 0 ? void 0 : _t.includes(draftEmailToDelete.id)) === true, "Draft Email ID should be in draftMessageIds before deletion. Got: ".concat(JSON.stringify(emailDeleteThread_1.draftMessageIds)));
                    // Delete the draft email
                    return [4 /*yield*/, sdk.api.emails.deleteOne(draftEmailToDelete.id)
                        // Wait for the delete side effect to process
                    ];
                case 51:
                    // Delete the draft email
                    _x.sent();
                    // Wait for the delete side effect to process
                    return [4 /*yield*/, wait(undefined, 500)
                        // Verify the draft ID has been removed
                    ];
                case 52:
                    // Wait for the delete side effect to process
                    _x.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 53:
                    loadedThreads10b = _x.sent();
                    emailDeleteThreadAfter = loadedThreads10b.threads.find(function (t) { return t.id === emailDeleteThread_1.id; });
                    assert(!!emailDeleteThreadAfter, "Email thread should still exist after draft deletion");
                    assert(((_u = emailDeleteThreadAfter.draftMessageIds) === null || _u === void 0 ? void 0 : _u.includes(draftEmailToDelete.id)) === false, "Draft Email ID should be REMOVED from draftMessageIds after deletion. Got: ".concat(JSON.stringify(emailDeleteThreadAfter.draftMessageIds)));
                    console.log("✅ Email draft deletion cleanup test passed");
                    // Test 11: Chat draft deletion should remove ID from draftMessageIds
                    console.log("Testing chat draft deletion cleanup...");
                    return [4 /*yield*/, sdk.api.chat_rooms.createOne({
                            userIds: [testUser.id],
                            enduserIds: [testEnduser.id],
                        })
                        // Create a non-draft message first to establish the room
                    ];
                case 54:
                    chatRoomForDeletion = _x.sent();
                    // Create a non-draft message first to establish the room
                    return [4 /*yield*/, sdk.api.chats.createOne({
                            roomId: chatRoomForDeletion.id,
                            message: "Initial message to establish room for deletion test",
                            senderId: testEnduser.id,
                        })
                        // Create a draft chat message
                    ];
                case 55:
                    // Create a non-draft message first to establish the room
                    _x.sent();
                    farFuture2 = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000);
                    return [4 /*yield*/, sdk.api.chats.createOne({
                            roomId: chatRoomForDeletion.id,
                            message: "This draft chat will be deleted",
                            senderId: testUser.id,
                            isDraft: true,
                            sendAt: farFuture2,
                        })
                        // Build threads to create the Chat thread
                    ];
                case 56:
                    draftChatToDelete = _x.sent();
                    // Build threads to create the Chat thread
                    return [4 /*yield*/, resetAndBuildThreads()];
                case 57:
                    // Build threads to create the Chat thread
                    _x.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 58:
                    loadedThreads11a = _x.sent();
                    chatDeleteThread_1 = loadedThreads11a.threads.find(function (t) { var _a; return t.type === 'Chat' && ((_a = t.enduserIds) === null || _a === void 0 ? void 0 : _a.includes(testEnduser.id)); });
                    assert(!!chatDeleteThread_1, "Chat thread for deletion test should be found");
                    // Manually add the draft ID to draftMessageIds (since chat threads don't auto-populate this)
                    return [4 /*yield*/, sdk.api.inbox_threads.updateOne(chatDeleteThread_1.id, {
                            draftMessageIds: [draftChatToDelete.id],
                        })
                        // Verify manual setup worked
                    ];
                case 59:
                    // Manually add the draft ID to draftMessageIds (since chat threads don't auto-populate this)
                    _x.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 60:
                    loadedThreads11b = _x.sent();
                    chatDeleteThreadWithDraft = loadedThreads11b.threads.find(function (t) { return t.id === chatDeleteThread_1.id; });
                    assert(((_v = chatDeleteThreadWithDraft.draftMessageIds) === null || _v === void 0 ? void 0 : _v.includes(draftChatToDelete.id)) === true, "Draft chat ID should be in draftMessageIds after manual setup. Got: ".concat(JSON.stringify(chatDeleteThreadWithDraft.draftMessageIds)));
                    // Delete the draft chat
                    return [4 /*yield*/, sdk.api.chats.deleteOne(draftChatToDelete.id)
                        // Wait for the delete side effect to process
                    ];
                case 61:
                    // Delete the draft chat
                    _x.sent();
                    // Wait for the delete side effect to process
                    return [4 /*yield*/, wait(undefined, 500)
                        // Verify the draft ID has been removed
                    ];
                case 62:
                    // Wait for the delete side effect to process
                    _x.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 63:
                    loadedThreads11c = _x.sent();
                    chatDeleteThreadAfter = loadedThreads11c.threads.find(function (t) { return t.id === chatDeleteThread_1.id; });
                    assert(!!chatDeleteThreadAfter, "Chat thread should still exist after draft deletion");
                    assert(((_w = chatDeleteThreadAfter.draftMessageIds) === null || _w === void 0 ? void 0 : _w.includes(draftChatToDelete.id)) === false, "Draft Chat ID should be REMOVED from draftMessageIds after deletion. Got: ".concat(JSON.stringify(chatDeleteThreadAfter.draftMessageIds)));
                    console.log("✅ Chat draft deletion cleanup test passed");
                    // Cleanup deletion test chat room
                    return [4 /*yield*/, sdk.api.chat_rooms.deleteOne(chatRoomForDeletion.id).catch(console.error)
                        // ===== Attachment-Only Preview Tests =====
                    ];
                case 64:
                    // Cleanup deletion test chat room
                    _x.sent();
                    // ===== Attachment-Only Preview Tests =====
                    log_header("Attachment-Only Preview Tests");
                    // Test 12: Chat message with only attachments should show "[Attachment]" preview
                    console.log("Testing attachment-only chat preview...");
                    return [4 /*yield*/, sdk.api.chat_rooms.createOne({
                            userIds: [testUser.id],
                            enduserIds: [testEnduser.id],
                        })
                        // Create an initial message to establish the room
                    ];
                case 65:
                    attachmentTestRoom_1 = _x.sent();
                    // Create an initial message to establish the room
                    return [4 /*yield*/, sdk.api.chats.createOne({
                            roomId: attachmentTestRoom_1.id,
                            message: "Initial message to establish room",
                            senderId: testEnduser.id,
                        })
                        // Create a chat message with only attachments (empty message, but has attachment)
                    ];
                case 66:
                    // Create an initial message to establish the room
                    _x.sent();
                    // Create a chat message with only attachments (empty message, but has attachment)
                    return [4 /*yield*/, sdk.api.chats.createOne({
                            roomId: attachmentTestRoom_1.id,
                            message: "",
                            senderId: testEnduser.id,
                            attachments: [{ secureName: "test-file.pdf", type: "application/pdf", name: "test-file.pdf" }],
                        })
                        // Wait for the side effect to update the room
                    ];
                case 67:
                    // Create a chat message with only attachments (empty message, but has attachment)
                    _x.sent();
                    // Wait for the side effect to update the room
                    return [4 /*yield*/, wait(undefined, 500)
                        // Rebuild threads
                    ];
                case 68:
                    // Wait for the side effect to update the room
                    _x.sent();
                    // Rebuild threads
                    return [4 /*yield*/, resetAndBuildThreads()
                        // Load the thread and verify preview
                    ];
                case 69:
                    // Rebuild threads
                    _x.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 70:
                    loadedThreads12 = _x.sent();
                    attachmentThread = loadedThreads12.threads.find(function (t) {
                        return t.type === 'Chat' && t.threadId === attachmentTestRoom_1.id;
                    });
                    assert(!!attachmentThread, "Attachment test chat thread should be found");
                    assert(attachmentThread.preview === '[Attachment]', "Preview should be \"[Attachment]\" for attachment-only messages. Got: \"".concat(attachmentThread.preview, "\""));
                    console.log("✅ Attachment-only chat preview test passed");
                    // Cleanup attachment test chat room
                    return [4 /*yield*/, sdk.api.chat_rooms.deleteOne(attachmentTestRoom_1.id).catch(console.error)];
                case 71:
                    // Cleanup attachment test chat room
                    _x.sent();
                    console.log("🎉 All InboxThread draft/scheduled tests passed!");
                    return [3 /*break*/, 76];
                case 72: 
                // Cleanup
                return [4 /*yield*/, sdk.api.inbox_threads.reset_threads().catch(console.error)];
                case 73:
                    // Cleanup
                    _x.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(testEnduser.id).catch(console.error)];
                case 74:
                    _x.sent();
                    return [4 /*yield*/, sdk.api.users.deleteOne(testUser.id).catch(console.error)];
                case 75:
                    _x.sent();
                    return [7 /*endfinally*/];
                case 76: return [2 /*return*/];
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
                    return [4 /*yield*/, inbox_thread_draft_scheduled_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ InboxThread draft/scheduled test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ InboxThread draft/scheduled test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=inbox_thread_draft_scheduled.test.js.map