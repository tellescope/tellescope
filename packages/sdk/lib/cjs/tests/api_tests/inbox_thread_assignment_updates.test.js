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
        var timestamp, testUser, testEnduser, defaultThreadFields, emailSubject, emailThreadId, emailThread, testEmail, smsThread, testSMS, testChatRoom, chatThread, loadedThreads, updatedEmailThread, loadedThreads2, updatedSMSThread, loadedThreads3, updatedChatThread, loadedThreads4, unchangedThread, loadedThreads5, clearedAssignThread, fixedTimestamp, matchingTimestampSubject, matchingTimestampThreadId, matchingTimestampEmailThread_1, matchingTimestampEmail, loadedThreads6, matchingTimestampUpdatedThread, matchingTimestampSMSThread_1, matchingTimestampSMS, loadedThreads7, matchingTimestampSMSUpdatedThread, orphanEmail, threadsBeforeOrphanUpdate, threadCountBefore, threadsAfterOrphanUpdate, threadCountAfter, upsertSMS, threadsAfterUpsertTest, upsertedThread, countResult, allThreads, filteredThreads, filteredCount, nonMatchingCount, emailTypeFilter, foundEmailByType, foundSmsByType, multiTypeFilter, foundEmailMulti, foundSmsMulti, foundChatMulti, assigneeFilter, foundAssigned, combinedFilter, foundCombined, mdbFilterCount, emptyMdbFilter, idsFilterResult, foundEmailById, foundSmsById, foundChatById, singleIdResult, idsCombinedResult, idsCountResult, emptyIdsResult, sortTestBaseTime, sortThread1, sortThread2, sortThread3, defaultSortResult, timestampSortResult, outboundSortResult, statusTestSMS1, statusTestFrom, statusTestThreads, statusTestThread, statusTestSMS2, threadAfterOutbound, statusTestSMS3, threadAfterNewInbound, readByTestSMS1, readByTestFrom, readByTestThreads, readByTestThread, threadAfterRead, readByTestSMS2, smsThreadAfterOutbound, readByTestSMS3, smsThreadAfterNewInbound, readByTestEmail1, readByEmailTestFrom, readByEmailTestThreads, readByEmailTestThread, emailThreadAfterRead, readByTestEmail2, emailThreadAfterOutbound, readByTestEmail3, emailThreadAfterNewInbound, err_1;
        var _b, _c;
        var _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
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
                    testUser = _l.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: "Test",
                            lname: "Patient",
                            email: "test-patient-inbox-".concat(timestamp, "@test.com")
                        })
                        // Default thread fields following the test pattern
                    ];
                case 2:
                    testEnduser = _l.sent();
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
                    emailThread = _l.sent();
                    return [4 /*yield*/, sdk.api.emails.createOne({
                            subject: emailSubject,
                            textContent: "Test email content",
                            enduserId: testEnduser.id,
                            messageId: "test-message-".concat(timestamp),
                            userId: testUser.id,
                            logOnly: true,
                        })];
                case 4:
                    testEmail = _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.createOne(__assign(__assign({}, defaultThreadFields), { type: "SMS", title: "Test SMS Assignment", threadId: "test-sms-thread-".concat(timestamp), phoneNumber: "+15555555555", enduserPhoneNumber: "+15555555556" }))];
                case 5:
                    smsThread = _l.sent();
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
                    testSMS = _l.sent();
                    return [4 /*yield*/, sdk.api.chat_rooms.createOne({
                            title: "Test Assignment Room",
                            userIds: [testUser.id],
                            enduserIds: [testEnduser.id]
                        })
                        // Create chat thread AFTER the chat message so timestamps align
                    ];
                case 7:
                    testChatRoom = _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.createOne(__assign(__assign({}, defaultThreadFields), { type: "Chat", title: "Test Chat Assignment", threadId: testChatRoom.id, timestamp: new Date() }))
                        // Add a chat message to make the room show up in threads (requires recentMessageSentAt)
                    ];
                case 8:
                    chatThread = _l.sent();
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
                    _l.sent();
                    // Wait for the recentMessageSentAt to be set
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 10:
                    // Wait for the recentMessageSentAt to be set
                    _l.sent();
                    _l.label = 11;
                case 11:
                    _l.trys.push([11, , 115, 119]);
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
                    _l.sent();
                    // Wait for side effects to process
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })
                        // Verify thread assignment was updated
                    ];
                case 13:
                    // Wait for side effects to process
                    _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 14:
                    loadedThreads = _l.sent();
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
                    _l.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })];
                case 16:
                    _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 17:
                    loadedThreads2 = _l.sent();
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
                    _l.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })];
                case 19:
                    _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 20:
                    loadedThreads3 = _l.sent();
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
                    _l.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })
                        // Verify thread assignment still correct (function should early return)
                    ];
                case 22:
                    _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 23:
                    loadedThreads4 = _l.sent();
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
                    _l.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })];
                case 25:
                    _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 26:
                    loadedThreads5 = _l.sent();
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
                    matchingTimestampEmailThread_1 = _l.sent();
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
                    matchingTimestampEmail = _l.sent();
                    // Update email assignment - should work even with matching timestamps
                    return [4 /*yield*/, sdk.api.emails.updateOne(matchingTimestampEmail.id, {
                            assignedTo: [testUser.id]
                        }, { replaceObjectFields: true })];
                case 29:
                    // Update email assignment - should work even with matching timestamps
                    _l.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })];
                case 30:
                    _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 31:
                    loadedThreads6 = _l.sent();
                    matchingTimestampUpdatedThread = loadedThreads6.threads.find(function (t) { return t.id === matchingTimestampEmailThread_1.id; });
                    (0, testing_1.assert)(!!matchingTimestampUpdatedThread, "Matching timestamp email thread should be found");
                    (0, testing_1.assert)(JSON.stringify(matchingTimestampUpdatedThread.assignedTo) === JSON.stringify([testUser.id]), "Email thread assignment should update even with matching timestamps");
                    console.log("✅ Email assignment with matching timestamps test passed");
                    // Test 7: Same Timestamp Edge Case - SMS  
                    console.log("Testing SMS assignment update with matching timestamps...");
                    return [4 /*yield*/, sdk.api.inbox_threads.createOne(__assign(__assign({}, defaultThreadFields), { type: "SMS", title: "Matching Timestamp SMS Test", threadId: "matching-timestamp-sms-".concat(timestamp), phoneNumber: "+15555555557", enduserPhoneNumber: "+15555555558", timestamp: fixedTimestamp // Same timestamp we'll use for message
                         }))];
                case 32:
                    matchingTimestampSMSThread_1 = _l.sent();
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
                    matchingTimestampSMS = _l.sent();
                    // Update SMS assignment - should work even with matching timestamps
                    return [4 /*yield*/, sdk.api.sms_messages.updateOne(matchingTimestampSMS.id, {
                            assignedTo: [testUser.id]
                        }, { replaceObjectFields: true })];
                case 34:
                    // Update SMS assignment - should work even with matching timestamps
                    _l.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })];
                case 35:
                    _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 36:
                    loadedThreads7 = _l.sent();
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
                    _l.sent();
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
                    orphanEmail = _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 39:
                    threadsBeforeOrphanUpdate = _l.sent();
                    threadCountBefore = threadsBeforeOrphanUpdate.threads.length;
                    // Update assignment on email that has no matching thread
                    return [4 /*yield*/, sdk.api.emails.updateOne(orphanEmail.id, {
                            assignedTo: [testUser.id]
                        }, { replaceObjectFields: true })];
                case 40:
                    // Update assignment on email that has no matching thread
                    _l.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })
                        // Verify no new thread was created (current expected behavior)
                    ];
                case 41:
                    _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 42:
                    threadsAfterOrphanUpdate = _l.sent();
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
                    upsertSMS = _l.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })
                        // Check if a new thread was created (would indicate upsert capability)
                    ];
                case 44:
                    _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 45:
                    threadsAfterUpsertTest = _l.sent();
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
                    _l.sent();
                    return [3 /*break*/, 48];
                case 47:
                    console.log("✅ No upsert capability - thread was not created (current behavior)");
                    _l.label = 48;
                case 48: 
                // Cleanup orphan email and upsert SMS
                return [4 /*yield*/, Promise.all([
                        sdk.api.emails.deleteOne(orphanEmail.id),
                        sdk.api.sms_messages.deleteOne(upsertSMS.id),
                    ])
                    // Test 10: returnCount parameter - basic count
                ];
                case 49:
                    // Cleanup orphan email and upsert SMS
                    _l.sent();
                    // Test 10: returnCount parameter - basic count
                    console.log("Testing load_threads returnCount parameter...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({ returnCount: true })];
                case 50:
                    countResult = _l.sent();
                    (0, testing_1.assert)(typeof countResult.count === 'number', "returnCount should return a count field with a number");
                    (0, testing_1.assert)(countResult.threads === undefined, "returnCount should not return threads array");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 51:
                    allThreads = _l.sent();
                    (0, testing_1.assert)(countResult.count === allThreads.threads.length, "Count (".concat(countResult.count, ") should match threads length (").concat(allThreads.threads.length, ")"));
                    console.log("✅ returnCount basic test passed");
                    // Test 11: returnCount with enduserIds filter
                    console.log("Testing returnCount with enduserIds filter...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({ enduserIds: [testEnduser.id] })];
                case 52:
                    filteredThreads = _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({ enduserIds: [testEnduser.id], returnCount: true })];
                case 53:
                    filteredCount = _l.sent();
                    (0, testing_1.assert)(typeof filteredCount.count === 'number', "Filtered returnCount should return a count");
                    (0, testing_1.assert)(filteredCount.count === filteredThreads.threads.length, "Filtered count (".concat(filteredCount.count, ") should match filtered threads length (").concat(filteredThreads.threads.length, ")"));
                    console.log("✅ returnCount with enduserIds filter test passed");
                    // Test 12: returnCount returns 0 for non-matching filters
                    console.log("Testing returnCount returns 0 for non-matching filters...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            enduserIds: ['000000000000000000000000'],
                            returnCount: true
                        })];
                case 54:
                    nonMatchingCount = _l.sent();
                    (0, testing_1.assert)(nonMatchingCount.count === 0, "Non-matching filter count should be 0, got ".concat(nonMatchingCount.count));
                    console.log("✅ returnCount with non-matching filter test passed");
                    // Test 13: mdbFilter - filter by type
                    console.log("Testing mdbFilter - filter by type...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            mdbFilter: { type: 'Email' }
                        })];
                case 55:
                    emailTypeFilter = _l.sent();
                    foundEmailByType = emailTypeFilter.threads.find(function (t) { return t.id === emailThread.id; });
                    foundSmsByType = emailTypeFilter.threads.find(function (t) { return t.id === smsThread.id; });
                    (0, testing_1.assert)(!!foundEmailByType, 'Email thread should be found when filtering by Email type');
                    (0, testing_1.assert)(!foundSmsByType, 'SMS thread should not be found when filtering by Email type');
                    console.log("✅ mdbFilter type filter test passed");
                    // Test 14: mdbFilter - filter by multiple types ($in)
                    console.log("Testing mdbFilter - filter by multiple types...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            mdbFilter: { type: { $in: ['Email', 'SMS'] } }
                        })];
                case 56:
                    multiTypeFilter = _l.sent();
                    foundEmailMulti = multiTypeFilter.threads.find(function (t) { return t.id === emailThread.id; });
                    foundSmsMulti = multiTypeFilter.threads.find(function (t) { return t.id === smsThread.id; });
                    foundChatMulti = multiTypeFilter.threads.find(function (t) { return t.id === chatThread.id; });
                    (0, testing_1.assert)(!!foundEmailMulti, 'Email thread should be found');
                    (0, testing_1.assert)(!!foundSmsMulti, 'SMS thread should be found');
                    (0, testing_1.assert)(!foundChatMulti, 'Chat thread should not be found when filtering Email/SMS');
                    console.log("✅ mdbFilter multiple types filter test passed");
                    // Test 15: mdbFilter - filter by assignedTo
                    console.log("Testing mdbFilter - filter by assignedTo...");
                    // First assign the email thread (may already be assigned from earlier tests)
                    return [4 /*yield*/, sdk.api.inbox_threads.updateOne(emailThread.id, { assignedTo: [testUser.id] })];
                case 57:
                    // First assign the email thread (may already be assigned from earlier tests)
                    _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            mdbFilter: { assignedTo: testUser.id }
                        })];
                case 58:
                    assigneeFilter = _l.sent();
                    foundAssigned = assigneeFilter.threads.find(function (t) { return t.id === emailThread.id; });
                    (0, testing_1.assert)(!!foundAssigned, 'Email thread should be found when filtering by assignee');
                    console.log("✅ mdbFilter assignedTo filter test passed");
                    // Test 16: mdbFilter - combined with existing params
                    console.log("Testing mdbFilter combined with enduserIds...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            enduserIds: [testEnduser.id],
                            mdbFilter: { type: 'Email' }
                        })];
                case 59:
                    combinedFilter = _l.sent();
                    foundCombined = combinedFilter.threads.find(function (t) { return t.id === emailThread.id; });
                    (0, testing_1.assert)(!!foundCombined, 'Email thread should be found with combined filters');
                    console.log("✅ mdbFilter combined filter test passed");
                    // Test 17: mdbFilter with returnCount
                    console.log("Testing mdbFilter with returnCount...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            mdbFilter: { type: 'Email' },
                            returnCount: true
                        })];
                case 60:
                    mdbFilterCount = _l.sent();
                    (0, testing_1.assert)(typeof mdbFilterCount.count === 'number', 'mdbFilter with returnCount should return count');
                    (0, testing_1.assert)(((_d = mdbFilterCount.count) !== null && _d !== void 0 ? _d : 0) >= 1, 'Count should be at least 1 for Email type');
                    console.log("✅ mdbFilter with returnCount test passed");
                    // Test 18: mdbFilter with empty object (should return all)
                    console.log("Testing mdbFilter with empty object...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            mdbFilter: {}
                        })];
                case 61:
                    emptyMdbFilter = _l.sent();
                    (0, testing_1.assert)(emptyMdbFilter.threads.length > 0, 'Empty mdbFilter should return threads');
                    console.log("✅ mdbFilter empty object test passed");
                    // Test 19: ids filter - filter by specific thread ids
                    console.log("Testing ids filter - filter by specific thread ids...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            ids: [emailThread.id, smsThread.id]
                        })];
                case 62:
                    idsFilterResult = _l.sent();
                    (0, testing_1.assert)(idsFilterResult.threads.length === 2, "ids filter should return exactly 2 threads, got ".concat(idsFilterResult.threads.length));
                    foundEmailById = idsFilterResult.threads.find(function (t) { return t.id === emailThread.id; });
                    foundSmsById = idsFilterResult.threads.find(function (t) { return t.id === smsThread.id; });
                    foundChatById = idsFilterResult.threads.find(function (t) { return t.id === chatThread.id; });
                    (0, testing_1.assert)(!!foundEmailById, 'Email thread should be found when filtering by ids');
                    (0, testing_1.assert)(!!foundSmsById, 'SMS thread should be found when filtering by ids');
                    (0, testing_1.assert)(!foundChatById, 'Chat thread should not be found when not in ids list');
                    console.log("✅ ids filter test passed");
                    // Test 20: ids filter - single id
                    console.log("Testing ids filter - single id...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            ids: [emailThread.id]
                        })];
                case 63:
                    singleIdResult = _l.sent();
                    (0, testing_1.assert)(singleIdResult.threads.length === 1, "Single id filter should return exactly 1 thread, got ".concat(singleIdResult.threads.length));
                    (0, testing_1.assert)(singleIdResult.threads[0].id === emailThread.id, 'Should return the correct thread');
                    console.log("✅ ids filter single id test passed");
                    // Test 21: ids filter combined with other filters
                    console.log("Testing ids filter combined with mdbFilter...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            ids: [emailThread.id, smsThread.id],
                            mdbFilter: { type: 'Email' }
                        })];
                case 64:
                    idsCombinedResult = _l.sent();
                    (0, testing_1.assert)(idsCombinedResult.threads.length === 1, "Combined ids + mdbFilter should return 1 thread, got ".concat(idsCombinedResult.threads.length));
                    (0, testing_1.assert)(idsCombinedResult.threads[0].id === emailThread.id, 'Should return only the email thread');
                    console.log("✅ ids filter combined with mdbFilter test passed");
                    // Test 22: ids filter with returnCount
                    console.log("Testing ids filter with returnCount...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            ids: [emailThread.id, smsThread.id, chatThread.id],
                            returnCount: true
                        })];
                case 65:
                    idsCountResult = _l.sent();
                    (0, testing_1.assert)(idsCountResult.count === 3, "ids filter with returnCount should return 3, got ".concat(idsCountResult.count));
                    console.log("✅ ids filter with returnCount test passed");
                    // Test 23: ids filter with empty array (should return all)
                    console.log("Testing ids filter with empty array...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            ids: []
                        })];
                case 66:
                    emptyIdsResult = _l.sent();
                    (0, testing_1.assert)(emptyIdsResult.threads.length >= 3, 'Empty ids array should not filter (return all threads)');
                    console.log("✅ ids filter empty array test passed");
                    // Test 24: sortBy parameter - default behavior (timestamp)
                    console.log("Testing sortBy parameter - default behavior...");
                    sortTestBaseTime = Date.now();
                    return [4 /*yield*/, sdk.api.inbox_threads.createOne(__assign(__assign({}, defaultThreadFields), { type: "SMS", title: "Sort Test Thread 1", threadId: "sort-test-1-".concat(timestamp), phoneNumber: "+15555550001", enduserPhoneNumber: "+15555550002", timestamp: new Date(sortTestBaseTime - 3000), outboundTimestamp: new Date(sortTestBaseTime) }))];
                case 67:
                    sortThread1 = _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.createOne(__assign(__assign({}, defaultThreadFields), { type: "SMS", title: "Sort Test Thread 2", threadId: "sort-test-2-".concat(timestamp), phoneNumber: "+15555550003", enduserPhoneNumber: "+15555550004", timestamp: new Date(sortTestBaseTime - 1000), outboundTimestamp: new Date(sortTestBaseTime - 3000) }))];
                case 68:
                    sortThread2 = _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.createOne(__assign(__assign({}, defaultThreadFields), { type: "SMS", title: "Sort Test Thread 3", threadId: "sort-test-3-".concat(timestamp), phoneNumber: "+15555550005", enduserPhoneNumber: "+15555550006", timestamp: new Date(sortTestBaseTime - 2000), outboundTimestamp: new Date(sortTestBaseTime - 2000) }))
                        // Test default sort (should be by timestamp descending)
                    ];
                case 69:
                    sortThread3 = _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            ids: [sortThread1.id, sortThread2.id, sortThread3.id]
                        })];
                case 70:
                    defaultSortResult = _l.sent();
                    (0, testing_1.assert)(defaultSortResult.threads.length === 3, 'Should return 3 sort test threads');
                    (0, testing_1.assert)(defaultSortResult.threads[0].id === sortThread2.id, 'Default sort: newest timestamp should be first');
                    (0, testing_1.assert)(defaultSortResult.threads[1].id === sortThread3.id, 'Default sort: middle timestamp should be second');
                    (0, testing_1.assert)(defaultSortResult.threads[2].id === sortThread1.id, 'Default sort: oldest timestamp should be last');
                    console.log("✅ sortBy default behavior test passed");
                    // Test 25: sortBy='timestamp' explicit
                    console.log("Testing sortBy='timestamp' explicit...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            ids: [sortThread1.id, sortThread2.id, sortThread3.id],
                            sortBy: 'timestamp'
                        })];
                case 71:
                    timestampSortResult = _l.sent();
                    (0, testing_1.assert)(timestampSortResult.threads[0].id === sortThread2.id, 'Explicit timestamp sort: newest should be first');
                    (0, testing_1.assert)(timestampSortResult.threads[1].id === sortThread3.id, 'Explicit timestamp sort: middle should be second');
                    (0, testing_1.assert)(timestampSortResult.threads[2].id === sortThread1.id, 'Explicit timestamp sort: oldest should be last');
                    console.log("✅ sortBy='timestamp' test passed");
                    // Test 26: sortBy='outboundTimestamp'
                    console.log("Testing sortBy='outboundTimestamp'...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            ids: [sortThread1.id, sortThread2.id, sortThread3.id],
                            sortBy: 'outboundTimestamp'
                        })];
                case 72:
                    outboundSortResult = _l.sent();
                    (0, testing_1.assert)(outboundSortResult.threads[0].id === sortThread1.id, 'OutboundTimestamp sort: newest outbound should be first');
                    (0, testing_1.assert)(outboundSortResult.threads[1].id === sortThread3.id, 'OutboundTimestamp sort: middle outbound should be second');
                    (0, testing_1.assert)(outboundSortResult.threads[2].id === sortThread2.id, 'OutboundTimestamp sort: oldest outbound should be last');
                    console.log("✅ sortBy='outboundTimestamp' test passed");
                    // Cleanup sort test threads
                    return [4 /*yield*/, Promise.all([
                            sdk.api.inbox_threads.deleteOne(sortThread1.id),
                            sdk.api.inbox_threads.deleteOne(sortThread2.id),
                            sdk.api.inbox_threads.deleteOne(sortThread3.id),
                        ])
                        // ========== InboxStatus Preservation Tests ==========
                        // These tests verify that outbound messages do NOT reset inboxStatus
                        // Test 27: Outbound SMS should NOT reset inboxStatus
                    ];
                case 73:
                    // Cleanup sort test threads
                    _l.sent();
                    // ========== InboxStatus Preservation Tests ==========
                    // These tests verify that outbound messages do NOT reset inboxStatus
                    // Test 27: Outbound SMS should NOT reset inboxStatus
                    console.log("Testing outbound SMS should NOT reset inboxStatus...");
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "Inbound test message for status test",
                            enduserId: testEnduser.id,
                            inbound: true,
                            phoneNumber: "+15555559999",
                            enduserPhoneNumber: "+15555559876",
                            logOnly: true,
                        })
                        // Build threads using reset_threads + build_threads pattern
                    ];
                case 74:
                    statusTestSMS1 = _l.sent();
                    statusTestFrom = new Date(Date.now() - 60000);
                    return [4 /*yield*/, sdk.api.inbox_threads.reset_threads()];
                case 75:
                    _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.build_threads({ from: statusTestFrom, to: new Date() })];
                case 76:
                    _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 77:
                    statusTestThreads = _l.sent();
                    statusTestThread = statusTestThreads.threads.find(function (t) {
                        return t.type === 'SMS' && t.enduserIds.includes(testEnduser.id) && t.phoneNumber === "+15555559999";
                    });
                    (0, testing_1.assert)(!!statusTestThread, "Status test SMS thread should be created");
                    (0, testing_1.assert)(statusTestThread.inboxStatus === 'New', "Initial status should be 'New', got '".concat(statusTestThread.inboxStatus, "'"));
                    // Update thread status to "Resolved"
                    return [4 /*yield*/, sdk.api.inbox_threads.updateOne(statusTestThread.id, { inboxStatus: "Resolved" })
                        // Create outbound SMS (should NOT reset status)
                    ];
                case 78:
                    // Update thread status to "Resolved"
                    _l.sent();
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "Outbound reply - should not reset status",
                            enduserId: testEnduser.id,
                            inbound: false,
                            phoneNumber: "+15555559999",
                            enduserPhoneNumber: "+15555559876",
                            logOnly: true,
                        })
                        // Rebuild threads - status should remain "Resolved"
                    ];
                case 79:
                    statusTestSMS2 = _l.sent();
                    // Rebuild threads - status should remain "Resolved"
                    return [4 /*yield*/, sdk.api.inbox_threads.build_threads({ from: statusTestFrom, to: new Date() })];
                case 80:
                    // Rebuild threads - status should remain "Resolved"
                    _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({ ids: [statusTestThread.id] })];
                case 81:
                    threadAfterOutbound = (_l.sent()).threads[0];
                    (0, testing_1.assert)(threadAfterOutbound.inboxStatus === 'Resolved', "Status should remain 'Resolved' after outbound message, got '".concat(threadAfterOutbound.inboxStatus, "'"));
                    (0, testing_1.assert)(!!threadAfterOutbound.outboundTimestamp, "outboundTimestamp should be set after outbound message");
                    console.log("✅ Outbound SMS does NOT reset inboxStatus test passed");
                    // Test 28: New inbound SMS SHOULD update inboxStatus
                    console.log("Testing new inbound SMS SHOULD update inboxStatus...");
                    // Wait to ensure ObjectId timestamps are in different seconds (MongoDB ObjectIds have second-level precision)
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1100); })];
                case 82:
                    // Wait to ensure ObjectId timestamps are in different seconds (MongoDB ObjectIds have second-level precision)
                    _l.sent();
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "New inbound - should update status",
                            enduserId: testEnduser.id,
                            inbound: true,
                            phoneNumber: "+15555559999",
                            enduserPhoneNumber: "+15555559876",
                            inboxStatus: "New",
                            logOnly: true,
                        })
                        // Rebuild threads - status SHOULD be updated from new inbound
                    ];
                case 83:
                    statusTestSMS3 = _l.sent();
                    // Rebuild threads - status SHOULD be updated from new inbound
                    return [4 /*yield*/, sdk.api.inbox_threads.build_threads({ from: statusTestFrom, to: new Date() })];
                case 84:
                    // Rebuild threads - status SHOULD be updated from new inbound
                    _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({ ids: [statusTestThread.id] })];
                case 85:
                    threadAfterNewInbound = (_l.sent()).threads[0];
                    (0, testing_1.assert)(threadAfterNewInbound.inboxStatus === 'New', "Status SHOULD be 'New' after new inbound message, got '".concat(threadAfterNewInbound.inboxStatus, "'"));
                    console.log("✅ New inbound SMS DOES update inboxStatus test passed");
                    // Cleanup status preservation test resources
                    return [4 /*yield*/, Promise.all([
                            sdk.api.sms_messages.deleteOne(statusTestSMS1.id),
                            sdk.api.sms_messages.deleteOne(statusTestSMS2.id),
                            sdk.api.sms_messages.deleteOne(statusTestSMS3.id),
                            sdk.api.inbox_threads.deleteOne(statusTestThread.id),
                        ])
                        // ========== ReadBy Preservation Tests ==========
                        // These tests verify that outbound messages do NOT reset readBy
                        // Test 29: Outbound SMS should NOT reset readBy
                    ];
                case 86:
                    // Cleanup status preservation test resources
                    _l.sent();
                    // ========== ReadBy Preservation Tests ==========
                    // These tests verify that outbound messages do NOT reset readBy
                    // Test 29: Outbound SMS should NOT reset readBy
                    console.log("Testing outbound SMS should NOT reset readBy...");
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "Inbound test message for readBy test",
                            enduserId: testEnduser.id,
                            inbound: true,
                            phoneNumber: "+15555558888",
                            enduserPhoneNumber: "+15555558765",
                            logOnly: true,
                        })
                        // Build threads
                    ];
                case 87:
                    readByTestSMS1 = _l.sent();
                    readByTestFrom = new Date(Date.now() - 60000);
                    return [4 /*yield*/, sdk.api.inbox_threads.reset_threads()];
                case 88:
                    _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.build_threads({ from: readByTestFrom, to: new Date() })];
                case 89:
                    _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 90:
                    readByTestThreads = _l.sent();
                    readByTestThread = readByTestThreads.threads.find(function (t) {
                        return t.type === 'SMS' && t.enduserIds.includes(testEnduser.id) && t.phoneNumber === "+15555558888";
                    });
                    (0, testing_1.assert)(!!readByTestThread, "readBy test SMS thread should be created");
                    // Mark thread as read
                    return [4 /*yield*/, sdk.api.inbox_threads.updateOne(readByTestThread.id, {
                            readBy: (_b = {}, _b[sdk.userInfo.id] = new Date(), _b)
                        })
                        // Verify thread is marked as read
                    ];
                case 91:
                    // Mark thread as read
                    _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({ ids: [readByTestThread.id] })];
                case 92:
                    threadAfterRead = (_l.sent()).threads[0];
                    (0, testing_1.assert)(!!((_e = threadAfterRead.readBy) === null || _e === void 0 ? void 0 : _e[sdk.userInfo.id]), "Thread should be marked as read");
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "Outbound reply - should not reset readBy",
                            enduserId: testEnduser.id,
                            inbound: false,
                            phoneNumber: "+15555558888",
                            enduserPhoneNumber: "+15555558765",
                            logOnly: true,
                        })
                        // Rebuild threads - readBy should remain set
                    ];
                case 93:
                    readByTestSMS2 = _l.sent();
                    // Rebuild threads - readBy should remain set
                    return [4 /*yield*/, sdk.api.inbox_threads.build_threads({ from: readByTestFrom, to: new Date() })];
                case 94:
                    // Rebuild threads - readBy should remain set
                    _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({ ids: [readByTestThread.id] })];
                case 95:
                    smsThreadAfterOutbound = (_l.sent()).threads[0];
                    (0, testing_1.assert)(!!((_f = smsThreadAfterOutbound.readBy) === null || _f === void 0 ? void 0 : _f[sdk.userInfo.id]), "readBy should remain set after outbound message, got ".concat(JSON.stringify(smsThreadAfterOutbound.readBy)));
                    (0, testing_1.assert)(!!smsThreadAfterOutbound.outboundTimestamp, "outboundTimestamp should be set after outbound message");
                    console.log("✅ Outbound SMS does NOT reset readBy test passed");
                    // Test 30: New inbound SMS SHOULD clear readBy
                    console.log("Testing new inbound SMS SHOULD clear readBy...");
                    // Wait for different timestamp
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1100); })];
                case 96:
                    // Wait for different timestamp
                    _l.sent();
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "New inbound - should clear readBy",
                            enduserId: testEnduser.id,
                            inbound: true,
                            phoneNumber: "+15555558888",
                            enduserPhoneNumber: "+15555558765",
                            logOnly: true,
                        })
                        // Rebuild threads - readBy SHOULD be cleared
                    ];
                case 97:
                    readByTestSMS3 = _l.sent();
                    // Rebuild threads - readBy SHOULD be cleared
                    return [4 /*yield*/, sdk.api.inbox_threads.build_threads({ from: readByTestFrom, to: new Date() })];
                case 98:
                    // Rebuild threads - readBy SHOULD be cleared
                    _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({ ids: [readByTestThread.id] })];
                case 99:
                    smsThreadAfterNewInbound = (_l.sent()).threads[0];
                    (0, testing_1.assert)(!((_g = smsThreadAfterNewInbound.readBy) === null || _g === void 0 ? void 0 : _g[sdk.userInfo.id]), "readBy SHOULD be cleared after new inbound message, got ".concat(JSON.stringify(smsThreadAfterNewInbound.readBy)));
                    console.log("✅ New inbound SMS DOES clear readBy test passed");
                    // Cleanup SMS readBy tests
                    return [4 /*yield*/, Promise.all([
                            sdk.api.sms_messages.deleteOne(readByTestSMS1.id),
                            sdk.api.sms_messages.deleteOne(readByTestSMS2.id),
                            sdk.api.sms_messages.deleteOne(readByTestSMS3.id),
                            sdk.api.inbox_threads.deleteOne(readByTestThread.id),
                        ])
                        // Test 31: Outbound Email should NOT reset readBy
                    ];
                case 100:
                    // Cleanup SMS readBy tests
                    _l.sent();
                    // Test 31: Outbound Email should NOT reset readBy
                    console.log("Testing outbound Email should NOT reset readBy...");
                    return [4 /*yield*/, sdk.api.emails.createOne({
                            subject: "Inbound test email for readBy test",
                            textContent: "Test inbound email content",
                            enduserId: testEnduser.id,
                            inbound: true,
                            logOnly: true,
                        })
                        // Build threads
                    ];
                case 101:
                    readByTestEmail1 = _l.sent();
                    readByEmailTestFrom = new Date(Date.now() - 60000);
                    return [4 /*yield*/, sdk.api.inbox_threads.reset_threads()];
                case 102:
                    _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.build_threads({ from: readByEmailTestFrom, to: new Date() })];
                case 103:
                    _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 104:
                    readByEmailTestThreads = _l.sent();
                    readByEmailTestThread = readByEmailTestThreads.threads.find(function (t) {
                        return t.type === 'Email' && t.enduserIds.includes(testEnduser.id);
                    });
                    (0, testing_1.assert)(!!readByEmailTestThread, "readBy test Email thread should be created");
                    // Mark thread as read
                    return [4 /*yield*/, sdk.api.inbox_threads.updateOne(readByEmailTestThread.id, {
                            readBy: (_c = {}, _c[sdk.userInfo.id] = new Date(), _c)
                        })
                        // Verify thread is marked as read
                    ];
                case 105:
                    // Mark thread as read
                    _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({ ids: [readByEmailTestThread.id] })];
                case 106:
                    emailThreadAfterRead = (_l.sent()).threads[0];
                    (0, testing_1.assert)(!!((_h = emailThreadAfterRead.readBy) === null || _h === void 0 ? void 0 : _h[sdk.userInfo.id]), "Email thread should be marked as read");
                    return [4 /*yield*/, sdk.api.emails.createOne({
                            subject: "Re: Inbound test email for readBy test",
                            textContent: "Outbound reply - should not reset readBy",
                            enduserId: testEnduser.id,
                            inbound: false,
                            logOnly: true,
                        })
                        // Rebuild threads - readBy should remain set
                    ];
                case 107:
                    readByTestEmail2 = _l.sent();
                    // Rebuild threads - readBy should remain set
                    return [4 /*yield*/, sdk.api.inbox_threads.build_threads({ from: readByEmailTestFrom, to: new Date() })];
                case 108:
                    // Rebuild threads - readBy should remain set
                    _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({ ids: [readByEmailTestThread.id] })];
                case 109:
                    emailThreadAfterOutbound = (_l.sent()).threads[0];
                    (0, testing_1.assert)(!!((_j = emailThreadAfterOutbound.readBy) === null || _j === void 0 ? void 0 : _j[sdk.userInfo.id]), "Email readBy should remain set after outbound message, got ".concat(JSON.stringify(emailThreadAfterOutbound.readBy)));
                    (0, testing_1.assert)(!!emailThreadAfterOutbound.outboundTimestamp, "outboundTimestamp should be set after outbound email");
                    console.log("✅ Outbound Email does NOT reset readBy test passed");
                    // Test 32: New inbound Email SHOULD clear readBy
                    console.log("Testing new inbound Email SHOULD clear readBy...");
                    // Wait for different timestamp
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1100); })];
                case 110:
                    // Wait for different timestamp
                    _l.sent();
                    return [4 /*yield*/, sdk.api.emails.createOne({
                            subject: "Re: Inbound test email for readBy test",
                            textContent: "New inbound - should clear readBy",
                            enduserId: testEnduser.id,
                            inbound: true,
                            logOnly: true,
                        })
                        // Rebuild threads - readBy SHOULD be cleared
                    ];
                case 111:
                    readByTestEmail3 = _l.sent();
                    // Rebuild threads - readBy SHOULD be cleared
                    return [4 /*yield*/, sdk.api.inbox_threads.build_threads({ from: readByEmailTestFrom, to: new Date() })];
                case 112:
                    // Rebuild threads - readBy SHOULD be cleared
                    _l.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({ ids: [readByEmailTestThread.id] })];
                case 113:
                    emailThreadAfterNewInbound = (_l.sent()).threads[0];
                    (0, testing_1.assert)(!((_k = emailThreadAfterNewInbound.readBy) === null || _k === void 0 ? void 0 : _k[sdk.userInfo.id]), "Email readBy SHOULD be cleared after new inbound message, got ".concat(JSON.stringify(emailThreadAfterNewInbound.readBy)));
                    console.log("✅ New inbound Email DOES clear readBy test passed");
                    // Cleanup Email readBy tests
                    return [4 /*yield*/, Promise.all([
                            sdk.api.emails.deleteOne(readByTestEmail1.id),
                            sdk.api.emails.deleteOne(readByTestEmail2.id),
                            sdk.api.emails.deleteOne(readByTestEmail3.id),
                            sdk.api.inbox_threads.deleteOne(readByEmailTestThread.id),
                        ])];
                case 114:
                    // Cleanup Email readBy tests
                    _l.sent();
                    console.log("🎉 All InboxThread assignment update tests passed!");
                    return [3 /*break*/, 119];
                case 115:
                    _l.trys.push([115, 117, , 118]);
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
                case 116:
                    _l.sent();
                    return [3 /*break*/, 118];
                case 117:
                    err_1 = _l.sent();
                    console.error("Cleanup error:", err_1);
                    return [3 /*break*/, 118];
                case 118: return [7 /*endfinally*/];
                case 119: return [2 /*return*/];
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