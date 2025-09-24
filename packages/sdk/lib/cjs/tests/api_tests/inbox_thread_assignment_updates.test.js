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
exports.inbox_thread_assignment_updates_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || 'http://localhost:8080';
var inbox_thread_assignment_updates_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var timestamp, testUser, testEnduser, defaultThreadFields, emailSubject, emailThreadId, emailThread, testEmail, smsThread, testSMS, testChatRoom, chatThread, loadedThreads, updatedEmailThread, loadedThreads2, updatedSMSThread, loadedThreads3, updatedChatThread, loadedThreads4, unchangedThread, loadedThreads5, clearedAssignThread, fixedTimestamp, matchingTimestampSubject, matchingTimestampThreadId, matchingTimestampEmailThread_1, matchingTimestampEmail, loadedThreads6, matchingTimestampUpdatedThread, matchingTimestampSMSThread_1, matchingTimestampSMS, loadedThreads7, matchingTimestampSMSUpdatedThread, orphanEmail, threadsBeforeOrphanUpdate, threadCountBefore, threadsAfterOrphanUpdate, threadCountAfter, upsertSMS, threadsAfterUpsertTest, upsertedThread, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("InboxThread Assignment Update Tests");
                    timestamp = Date.now();
                    return [4 /*yield*/, sdk.api.users.createOne({
                            fname: "Test",
                            lname: "User",
                            email: "test-inbox-assignment-".concat(timestamp, "@test.com"),
                            notificationEmailsDisabled: true
                        })];
                case 1:
                    testUser = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: "Test",
                            lname: "Patient",
                            email: "test-patient-inbox-".concat(timestamp, "@test.com")
                        })
                        // Default thread fields following the test pattern
                    ];
                case 2:
                    testEnduser = _b.sent();
                    defaultThreadFields = {
                        assignedTo: [],
                        enduserIds: [testEnduser.id],
                        userIds: [],
                        inboxStatus: 'New',
                        preview: 'Test',
                        timestamp: new Date(),
                    };
                    emailSubject = "Test Email Subject ".concat(timestamp);
                    emailThreadId = emailSubject.toLowerCase().replaceAll("re:", "").replaceAll(" ", "");
                    return [4 /*yield*/, sdk.api.inbox_threads.createOne(__assign(__assign({}, defaultThreadFields), { type: "Email", title: "Test Email Assignment", threadId: emailThreadId }))];
                case 3:
                    emailThread = _b.sent();
                    return [4 /*yield*/, sdk.api.emails.createOne({
                            subject: emailSubject,
                            textContent: "Test email content",
                            enduserId: testEnduser.id,
                            messageId: "test-message-".concat(timestamp),
                            userId: testUser.id,
                            logOnly: true,
                        })];
                case 4:
                    testEmail = _b.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.createOne(__assign(__assign({}, defaultThreadFields), { type: "SMS", title: "Test SMS Assignment", threadId: "test-sms-thread-".concat(timestamp), phoneNumber: "+15555555555", enduserPhoneNumber: "+15555555556" }))];
                case 5:
                    smsThread = _b.sent();
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "Test SMS message",
                            enduserId: testEnduser.id,
                            userId: testUser.id,
                            inbound: false,
                            phoneNumber: "+15555555555",
                            enduserPhoneNumber: "+15555555556",
                            logOnly: true,
                        })];
                case 6:
                    testSMS = _b.sent();
                    return [4 /*yield*/, sdk.api.chat_rooms.createOne({
                            title: "Test Assignment Room",
                            userIds: [testUser.id],
                            enduserIds: [testEnduser.id]
                        })
                        // Create chat thread AFTER the chat message so timestamps align
                    ];
                case 7:
                    testChatRoom = _b.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.createOne(__assign(__assign({}, defaultThreadFields), { type: "Chat", title: "Test Chat Assignment", threadId: testChatRoom.id, timestamp: new Date() }))
                        // Add a chat message to make the room show up in threads (requires recentMessageSentAt)
                    ];
                case 8:
                    chatThread = _b.sent();
                    // Add a chat message to make the room show up in threads (requires recentMessageSentAt)
                    return [4 /*yield*/, sdk.api.chats.createOne({
                            roomId: testChatRoom.id,
                            message: "Test chat message for thread building",
                            enduserId: testEnduser.id,
                            senderId: testEnduser.id
                        })
                        // Wait for the recentMessageSentAt to be set
                    ];
                case 9:
                    // Add a chat message to make the room show up in threads (requires recentMessageSentAt)
                    _b.sent();
                    // Wait for the recentMessageSentAt to be set
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 10:
                    // Wait for the recentMessageSentAt to be set
                    _b.sent();
                    _b.label = 11;
                case 11:
                    _b.trys.push([11, , 50, 54]);
                    // Test 1: Email Assignment Updates
                    console.log("Testing email assignment updates...");
                    // Update email assignment
                    return [4 /*yield*/, sdk.api.emails.updateOne(testEmail.id, {
                            assignedTo: [testUser.id]
                        }, { replaceObjectFields: true })
                        // Wait for side effects to process
                    ];
                case 12:
                    // Update email assignment
                    _b.sent();
                    // Wait for side effects to process
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })
                        // Verify thread assignment was updated
                    ];
                case 13:
                    // Wait for side effects to process
                    _b.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 14:
                    loadedThreads = _b.sent();
                    updatedEmailThread = loadedThreads.threads.find(function (t) { return t.id === emailThread.id; });
                    (0, testing_1.assert)(!!updatedEmailThread, "Email thread should be found");
                    (0, testing_1.assert)(JSON.stringify(updatedEmailThread.assignedTo) === JSON.stringify([testUser.id]), "Email thread assignment should be updated");
                    console.log("✅ Email assignment update test passed");
                    // Test 2: SMS Assignment Updates  
                    console.log("Testing SMS assignment updates...");
                    return [4 /*yield*/, sdk.api.sms_messages.updateOne(testSMS.id, {
                            assignedTo: [testUser.id]
                        }, { replaceObjectFields: true })];
                case 15:
                    _b.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })];
                case 16:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 17:
                    loadedThreads2 = _b.sent();
                    updatedSMSThread = loadedThreads2.threads.find(function (t) { return t.id === smsThread.id; });
                    (0, testing_1.assert)(!!updatedSMSThread, "SMS thread should be found");
                    (0, testing_1.assert)(JSON.stringify(updatedSMSThread.assignedTo) === JSON.stringify([testUser.id]), "SMS thread assignment should be updated");
                    console.log("✅ SMS assignment update test passed");
                    // Test 3: Chat Room Assignment Updates
                    console.log("Testing chat room assignment updates...");
                    return [4 /*yield*/, sdk.api.chat_rooms.updateOne(testChatRoom.id, {
                            assignedTo: [testUser.id]
                        }, { replaceObjectFields: true })];
                case 18:
                    _b.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })];
                case 19:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 20:
                    loadedThreads3 = _b.sent();
                    updatedChatThread = loadedThreads3.threads.find(function (t) { return t.id === chatThread.id; });
                    (0, testing_1.assert)(!!updatedChatThread, "Chat thread should be found");
                    (0, testing_1.assert)(JSON.stringify(updatedChatThread.assignedTo) === JSON.stringify([testUser.id]), "Chat thread assignment should be updated");
                    console.log("✅ Chat assignment update test passed");
                    // Test 4: No Update When Assignment Unchanged
                    console.log("Testing no update when assignment unchanged...");
                    // Update email with same assignment (should not trigger thread update)
                    return [4 /*yield*/, sdk.api.emails.updateOne(testEmail.id, {
                            assignedTo: [testUser.id],
                            subject: "Updated subject" // Different field
                        }, { replaceObjectFields: true })];
                case 21:
                    // Update email with same assignment (should not trigger thread update)
                    _b.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })
                        // Verify thread assignment still correct (function should early return)
                    ];
                case 22:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 23:
                    loadedThreads4 = _b.sent();
                    unchangedThread = loadedThreads4.threads.find(function (t) { return t.id === emailThread.id; });
                    (0, testing_1.assert)(!!unchangedThread, "Email thread should still be found");
                    (0, testing_1.assert)(JSON.stringify(unchangedThread.assignedTo) === JSON.stringify([testUser.id]), "Thread assignment should remain unchanged");
                    console.log("✅ No update when assignment unchanged test passed");
                    // Test 5: Clear Assignment
                    console.log("Testing assignment clearing...");
                    return [4 /*yield*/, sdk.api.emails.updateOne(testEmail.id, {
                            assignedTo: []
                        }, { replaceObjectFields: true })];
                case 24:
                    _b.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })];
                case 25:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 26:
                    loadedThreads5 = _b.sent();
                    clearedAssignThread = loadedThreads5.threads.find(function (t) { return t.id === emailThread.id; });
                    (0, testing_1.assert)(!!clearedAssignThread, "Email thread should still be found");
                    (0, testing_1.assert)(JSON.stringify(clearedAssignThread.assignedTo) === JSON.stringify([]), "Thread assignment should be cleared");
                    console.log("✅ Assignment clearing test passed");
                    // Test 6: Same Timestamp Edge Case - Email
                    console.log("Testing email assignment update with matching timestamps...");
                    fixedTimestamp = new Date('2023-01-01T10:00:00Z');
                    matchingTimestampSubject = "Matching Timestamp Test";
                    matchingTimestampThreadId = matchingTimestampSubject.toLowerCase().replaceAll("re:", "").replaceAll(" ", "");
                    return [4 /*yield*/, sdk.api.inbox_threads.createOne(__assign(__assign({}, defaultThreadFields), { type: "Email", title: "Matching Timestamp Email Test", threadId: matchingTimestampThreadId, timestamp: fixedTimestamp // Same timestamp we'll use for message
                         }))];
                case 27:
                    matchingTimestampEmailThread_1 = _b.sent();
                    return [4 /*yield*/, sdk.api.emails.createOne({
                            subject: matchingTimestampSubject,
                            textContent: "Test email with matching timestamp",
                            enduserId: testEnduser.id,
                            messageId: "matching-timestamp-email-".concat(timestamp),
                            userId: testUser.id,
                            timestamp: fixedTimestamp,
                            inbound: true,
                            logOnly: true,
                        })
                        // Update email assignment - should work even with matching timestamps
                    ];
                case 28:
                    matchingTimestampEmail = _b.sent();
                    // Update email assignment - should work even with matching timestamps
                    return [4 /*yield*/, sdk.api.emails.updateOne(matchingTimestampEmail.id, {
                            assignedTo: [testUser.id]
                        }, { replaceObjectFields: true })];
                case 29:
                    // Update email assignment - should work even with matching timestamps
                    _b.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })];
                case 30:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 31:
                    loadedThreads6 = _b.sent();
                    matchingTimestampUpdatedThread = loadedThreads6.threads.find(function (t) { return t.id === matchingTimestampEmailThread_1.id; });
                    (0, testing_1.assert)(!!matchingTimestampUpdatedThread, "Matching timestamp email thread should be found");
                    (0, testing_1.assert)(JSON.stringify(matchingTimestampUpdatedThread.assignedTo) === JSON.stringify([testUser.id]), "Email thread assignment should update even with matching timestamps");
                    console.log("✅ Email assignment with matching timestamps test passed");
                    // Test 7: Same Timestamp Edge Case - SMS  
                    console.log("Testing SMS assignment update with matching timestamps...");
                    return [4 /*yield*/, sdk.api.inbox_threads.createOne(__assign(__assign({}, defaultThreadFields), { type: "SMS", title: "Matching Timestamp SMS Test", threadId: "matching-timestamp-sms-".concat(timestamp), phoneNumber: "+15555555557", enduserPhoneNumber: "+15555555558", timestamp: fixedTimestamp // Same timestamp we'll use for message
                         }))];
                case 32:
                    matchingTimestampSMSThread_1 = _b.sent();
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "Matching timestamp SMS test",
                            enduserId: testEnduser.id,
                            userId: testUser.id,
                            inbound: true,
                            phoneNumber: "+15555555557",
                            enduserPhoneNumber: "+15555555558",
                            timestamp: fixedTimestamp,
                            logOnly: true,
                        })
                        // Update SMS assignment - should work even with matching timestamps
                    ];
                case 33:
                    matchingTimestampSMS = _b.sent();
                    // Update SMS assignment - should work even with matching timestamps
                    return [4 /*yield*/, sdk.api.sms_messages.updateOne(matchingTimestampSMS.id, {
                            assignedTo: [testUser.id]
                        }, { replaceObjectFields: true })];
                case 34:
                    // Update SMS assignment - should work even with matching timestamps
                    _b.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })];
                case 35:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 36:
                    loadedThreads7 = _b.sent();
                    matchingTimestampSMSUpdatedThread = loadedThreads7.threads.find(function (t) { return t.id === matchingTimestampSMSThread_1.id; });
                    (0, testing_1.assert)(!!matchingTimestampSMSUpdatedThread, "Matching timestamp SMS thread should be found");
                    (0, testing_1.assert)(JSON.stringify(matchingTimestampSMSUpdatedThread.assignedTo) === JSON.stringify([testUser.id]), "SMS thread assignment should update even with matching timestamps");
                    console.log("✅ SMS assignment with matching timestamps test passed");
                    // Cleanup additional test resources
                    return [4 /*yield*/, Promise.all([
                            sdk.api.inbox_threads.deleteOne(matchingTimestampEmailThread_1.id),
                            sdk.api.inbox_threads.deleteOne(matchingTimestampSMSThread_1.id),
                            sdk.api.emails.deleteOne(matchingTimestampEmail.id),
                            sdk.api.sms_messages.deleteOne(matchingTimestampSMS.id),
                        ])
                        // Test 8: Non-Existent Thread Case - Should NOT Create New Thread
                    ];
                case 37:
                    // Cleanup additional test resources
                    _b.sent();
                    // Test 8: Non-Existent Thread Case - Should NOT Create New Thread
                    console.log("Testing behavior when no matching thread exists...");
                    return [4 /*yield*/, sdk.api.emails.createOne({
                            subject: "Orphan Email Test",
                            textContent: "Email without matching thread",
                            enduserId: testEnduser.id,
                            messageId: "orphan-email-".concat(timestamp),
                            userId: testUser.id,
                            logOnly: true,
                        })
                        // Count existing threads before update
                    ];
                case 38:
                    orphanEmail = _b.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 39:
                    threadsBeforeOrphanUpdate = _b.sent();
                    threadCountBefore = threadsBeforeOrphanUpdate.threads.length;
                    // Update assignment on email that has no matching thread
                    return [4 /*yield*/, sdk.api.emails.updateOne(orphanEmail.id, {
                            assignedTo: [testUser.id]
                        }, { replaceObjectFields: true })];
                case 40:
                    // Update assignment on email that has no matching thread
                    _b.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })
                        // Verify no new thread was created (current expected behavior)
                    ];
                case 41:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 42:
                    threadsAfterOrphanUpdate = _b.sent();
                    threadCountAfter = threadsAfterOrphanUpdate.threads.length;
                    (0, testing_1.assert)(threadCountAfter === threadCountBefore, "No new thread should be created when no matching thread exists");
                    console.log("✅ Non-existent thread test passed - no thread created as expected");
                    // Test 9: Upsert Capability Test - Create Thread When None Exists
                    console.log("Testing potential upsert capability...");
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "Upsert SMS test",
                            enduserId: testEnduser.id,
                            userId: testUser.id,
                            inbound: false,
                            phoneNumber: "+15555555559",
                            enduserPhoneNumber: "+15555555560",
                            assignedTo: [testUser.id],
                            logOnly: true,
                        })];
                case 43:
                    upsertSMS = _b.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })
                        // Check if a new thread was created (would indicate upsert capability)
                    ];
                case 44:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 45:
                    threadsAfterUpsertTest = _b.sent();
                    upsertedThread = threadsAfterUpsertTest.threads.find(function (t) {
                        return t.type === "SMS" &&
                            t.phoneNumber === "+15555555559" &&
                            t.enduserPhoneNumber === "+15555555560";
                    });
                    if (!upsertedThread) return [3 /*break*/, 47];
                    console.log("✅ Upsert capability detected - thread was created automatically");
                    (0, testing_1.assert)(JSON.stringify(upsertedThread.assignedTo) === JSON.stringify([testUser.id]), "Upserted thread should have correct assignment");
                    // Cleanup the upserted thread
                    return [4 /*yield*/, sdk.api.inbox_threads.deleteOne(upsertedThread.id)];
                case 46:
                    // Cleanup the upserted thread
                    _b.sent();
                    return [3 /*break*/, 48];
                case 47:
                    console.log("✅ No upsert capability - thread was not created (current behavior)");
                    _b.label = 48;
                case 48: 
                // Cleanup orphan email and upsert SMS
                return [4 /*yield*/, Promise.all([
                        sdk.api.emails.deleteOne(orphanEmail.id),
                        sdk.api.sms_messages.deleteOne(upsertSMS.id),
                    ])];
                case 49:
                    // Cleanup orphan email and upsert SMS
                    _b.sent();
                    console.log("🎉 All InboxThread assignment update tests passed!");
                    return [3 /*break*/, 54];
                case 50:
                    _b.trys.push([50, 52, , 53]);
                    return [4 /*yield*/, Promise.all([
                            sdk.api.inbox_threads.deleteOne(emailThread.id),
                            sdk.api.inbox_threads.deleteOne(smsThread.id),
                            sdk.api.inbox_threads.deleteOne(chatThread.id),
                            sdk.api.emails.deleteOne(testEmail.id),
                            sdk.api.sms_messages.deleteOne(testSMS.id),
                            sdk.api.chat_rooms.deleteOne(testChatRoom.id),
                            sdk.api.endusers.deleteOne(testEnduser.id),
                            sdk.api.users.deleteOne(testUser.id),
                        ])];
                case 51:
                    _b.sent();
                    return [3 /*break*/, 53];
                case 52:
                    err_1 = _b.sent();
                    console.error("Cleanup error:", err_1);
                    return [3 /*break*/, 53];
                case 53: return [7 /*endfinally*/];
                case 54: return [2 /*return*/];
            }
        });
    });
};
exports.inbox_thread_assignment_updates_tests = inbox_thread_assignment_updates_tests;
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
                    return [4 /*yield*/, (0, exports.inbox_thread_assignment_updates_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ InboxThread assignment update test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ InboxThread assignment update test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=inbox_thread_assignment_updates.test.js.map