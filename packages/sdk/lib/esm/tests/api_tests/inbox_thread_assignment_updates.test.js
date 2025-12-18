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
require('source-map-support').install();
import { Session } from "../../sdk";
import { assert, log_header, } from "@tellescope/testing";
import { setup_tests } from "../setup";
var host = process.env.API_URL || 'http://localhost:8080';
export var inbox_thread_assignment_updates_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var timestamp, testUser, testEnduser, defaultThreadFields, emailSubject, emailThreadId, emailThread, testEmail, smsThread, testSMS, testChatRoom, chatThread, loadedThreads, updatedEmailThread, loadedThreads2, updatedSMSThread, loadedThreads3, updatedChatThread, loadedThreads4, unchangedThread, loadedThreads5, clearedAssignThread, fixedTimestamp, matchingTimestampSubject, matchingTimestampThreadId, matchingTimestampEmailThread_1, matchingTimestampEmail, loadedThreads6, matchingTimestampUpdatedThread, matchingTimestampSMSThread_1, matchingTimestampSMS, loadedThreads7, matchingTimestampSMSUpdatedThread, orphanEmail, threadsBeforeOrphanUpdate, threadCountBefore, threadsAfterOrphanUpdate, threadCountAfter, upsertSMS, threadsAfterUpsertTest, upsertedThread, countResult, allThreads, filteredThreads, filteredCount, nonMatchingCount, emailTypeFilter, foundEmailByType, foundSmsByType, multiTypeFilter, foundEmailMulti, foundSmsMulti, foundChatMulti, assigneeFilter, foundAssigned, combinedFilter, foundCombined, mdbFilterCount, emptyMdbFilter, idsFilterResult, foundEmailById, foundSmsById, foundChatById, singleIdResult, idsCombinedResult, idsCountResult, emptyIdsResult, err_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    log_header("InboxThread Assignment Update Tests");
                    timestamp = Date.now();
                    return [4 /*yield*/, sdk.api.users.createOne({
                            fname: "Test",
                            lname: "User",
                            email: "test-inbox-assignment-".concat(timestamp, "@test.com"),
                            notificationEmailsDisabled: true
                        })];
                case 1:
                    testUser = _c.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: "Test",
                            lname: "Patient",
                            email: "test-patient-inbox-".concat(timestamp, "@test.com")
                        })
                        // Default thread fields following the test pattern
                    ];
                case 2:
                    testEnduser = _c.sent();
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
                    emailThread = _c.sent();
                    return [4 /*yield*/, sdk.api.emails.createOne({
                            subject: emailSubject,
                            textContent: "Test email content",
                            enduserId: testEnduser.id,
                            messageId: "test-message-".concat(timestamp),
                            userId: testUser.id,
                            logOnly: true,
                        })];
                case 4:
                    testEmail = _c.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.createOne(__assign(__assign({}, defaultThreadFields), { type: "SMS", title: "Test SMS Assignment", threadId: "test-sms-thread-".concat(timestamp), phoneNumber: "+15555555555", enduserPhoneNumber: "+15555555556" }))];
                case 5:
                    smsThread = _c.sent();
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
                    testSMS = _c.sent();
                    return [4 /*yield*/, sdk.api.chat_rooms.createOne({
                            title: "Test Assignment Room",
                            userIds: [testUser.id],
                            enduserIds: [testEnduser.id]
                        })
                        // Create chat thread AFTER the chat message so timestamps align
                    ];
                case 7:
                    testChatRoom = _c.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.createOne(__assign(__assign({}, defaultThreadFields), { type: "Chat", title: "Test Chat Assignment", threadId: testChatRoom.id, timestamp: new Date() }))
                        // Add a chat message to make the room show up in threads (requires recentMessageSentAt)
                    ];
                case 8:
                    chatThread = _c.sent();
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
                    _c.sent();
                    // Wait for the recentMessageSentAt to be set
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 10:
                    // Wait for the recentMessageSentAt to be set
                    _c.sent();
                    _c.label = 11;
                case 11:
                    _c.trys.push([11, , 67, 71]);
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
                    _c.sent();
                    // Wait for side effects to process
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })
                        // Verify thread assignment was updated
                    ];
                case 13:
                    // Wait for side effects to process
                    _c.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 14:
                    loadedThreads = _c.sent();
                    updatedEmailThread = loadedThreads.threads.find(function (t) { return t.id === emailThread.id; });
                    assert(!!updatedEmailThread, "Email thread should be found");
                    assert(JSON.stringify(updatedEmailThread.assignedTo) === JSON.stringify([testUser.id]), "Email thread assignment should be updated");
                    console.log("✅ Email assignment update test passed");
                    // Test 2: SMS Assignment Updates  
                    console.log("Testing SMS assignment updates...");
                    return [4 /*yield*/, sdk.api.sms_messages.updateOne(testSMS.id, {
                            assignedTo: [testUser.id]
                        }, { replaceObjectFields: true })];
                case 15:
                    _c.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })];
                case 16:
                    _c.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 17:
                    loadedThreads2 = _c.sent();
                    updatedSMSThread = loadedThreads2.threads.find(function (t) { return t.id === smsThread.id; });
                    assert(!!updatedSMSThread, "SMS thread should be found");
                    assert(JSON.stringify(updatedSMSThread.assignedTo) === JSON.stringify([testUser.id]), "SMS thread assignment should be updated");
                    console.log("✅ SMS assignment update test passed");
                    // Test 3: Chat Room Assignment Updates
                    console.log("Testing chat room assignment updates...");
                    return [4 /*yield*/, sdk.api.chat_rooms.updateOne(testChatRoom.id, {
                            assignedTo: [testUser.id]
                        }, { replaceObjectFields: true })];
                case 18:
                    _c.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })];
                case 19:
                    _c.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 20:
                    loadedThreads3 = _c.sent();
                    updatedChatThread = loadedThreads3.threads.find(function (t) { return t.id === chatThread.id; });
                    assert(!!updatedChatThread, "Chat thread should be found");
                    assert(JSON.stringify(updatedChatThread.assignedTo) === JSON.stringify([testUser.id]), "Chat thread assignment should be updated");
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
                    _c.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })
                        // Verify thread assignment still correct (function should early return)
                    ];
                case 22:
                    _c.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 23:
                    loadedThreads4 = _c.sent();
                    unchangedThread = loadedThreads4.threads.find(function (t) { return t.id === emailThread.id; });
                    assert(!!unchangedThread, "Email thread should still be found");
                    assert(JSON.stringify(unchangedThread.assignedTo) === JSON.stringify([testUser.id]), "Thread assignment should remain unchanged");
                    console.log("✅ No update when assignment unchanged test passed");
                    // Test 5: Clear Assignment
                    console.log("Testing assignment clearing...");
                    return [4 /*yield*/, sdk.api.emails.updateOne(testEmail.id, {
                            assignedTo: []
                        }, { replaceObjectFields: true })];
                case 24:
                    _c.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })];
                case 25:
                    _c.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 26:
                    loadedThreads5 = _c.sent();
                    clearedAssignThread = loadedThreads5.threads.find(function (t) { return t.id === emailThread.id; });
                    assert(!!clearedAssignThread, "Email thread should still be found");
                    assert(JSON.stringify(clearedAssignThread.assignedTo) === JSON.stringify([]), "Thread assignment should be cleared");
                    console.log("✅ Assignment clearing test passed");
                    // Test 6: Same Timestamp Edge Case - Email
                    console.log("Testing email assignment update with matching timestamps...");
                    fixedTimestamp = new Date('2023-01-01T10:00:00Z');
                    matchingTimestampSubject = "Matching Timestamp Test";
                    matchingTimestampThreadId = matchingTimestampSubject.toLowerCase().replaceAll("re:", "").replaceAll(" ", "");
                    return [4 /*yield*/, sdk.api.inbox_threads.createOne(__assign(__assign({}, defaultThreadFields), { type: "Email", title: "Matching Timestamp Email Test", threadId: matchingTimestampThreadId, timestamp: fixedTimestamp // Same timestamp we'll use for message
                         }))];
                case 27:
                    matchingTimestampEmailThread_1 = _c.sent();
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
                    matchingTimestampEmail = _c.sent();
                    // Update email assignment - should work even with matching timestamps
                    return [4 /*yield*/, sdk.api.emails.updateOne(matchingTimestampEmail.id, {
                            assignedTo: [testUser.id]
                        }, { replaceObjectFields: true })];
                case 29:
                    // Update email assignment - should work even with matching timestamps
                    _c.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })];
                case 30:
                    _c.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 31:
                    loadedThreads6 = _c.sent();
                    matchingTimestampUpdatedThread = loadedThreads6.threads.find(function (t) { return t.id === matchingTimestampEmailThread_1.id; });
                    assert(!!matchingTimestampUpdatedThread, "Matching timestamp email thread should be found");
                    assert(JSON.stringify(matchingTimestampUpdatedThread.assignedTo) === JSON.stringify([testUser.id]), "Email thread assignment should update even with matching timestamps");
                    console.log("✅ Email assignment with matching timestamps test passed");
                    // Test 7: Same Timestamp Edge Case - SMS  
                    console.log("Testing SMS assignment update with matching timestamps...");
                    return [4 /*yield*/, sdk.api.inbox_threads.createOne(__assign(__assign({}, defaultThreadFields), { type: "SMS", title: "Matching Timestamp SMS Test", threadId: "matching-timestamp-sms-".concat(timestamp), phoneNumber: "+15555555557", enduserPhoneNumber: "+15555555558", timestamp: fixedTimestamp // Same timestamp we'll use for message
                         }))];
                case 32:
                    matchingTimestampSMSThread_1 = _c.sent();
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
                    matchingTimestampSMS = _c.sent();
                    // Update SMS assignment - should work even with matching timestamps
                    return [4 /*yield*/, sdk.api.sms_messages.updateOne(matchingTimestampSMS.id, {
                            assignedTo: [testUser.id]
                        }, { replaceObjectFields: true })];
                case 34:
                    // Update SMS assignment - should work even with matching timestamps
                    _c.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })];
                case 35:
                    _c.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 36:
                    loadedThreads7 = _c.sent();
                    matchingTimestampSMSUpdatedThread = loadedThreads7.threads.find(function (t) { return t.id === matchingTimestampSMSThread_1.id; });
                    assert(!!matchingTimestampSMSUpdatedThread, "Matching timestamp SMS thread should be found");
                    assert(JSON.stringify(matchingTimestampSMSUpdatedThread.assignedTo) === JSON.stringify([testUser.id]), "SMS thread assignment should update even with matching timestamps");
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
                    _c.sent();
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
                    orphanEmail = _c.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 39:
                    threadsBeforeOrphanUpdate = _c.sent();
                    threadCountBefore = threadsBeforeOrphanUpdate.threads.length;
                    // Update assignment on email that has no matching thread
                    return [4 /*yield*/, sdk.api.emails.updateOne(orphanEmail.id, {
                            assignedTo: [testUser.id]
                        }, { replaceObjectFields: true })];
                case 40:
                    // Update assignment on email that has no matching thread
                    _c.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })
                        // Verify no new thread was created (current expected behavior)
                    ];
                case 41:
                    _c.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 42:
                    threadsAfterOrphanUpdate = _c.sent();
                    threadCountAfter = threadsAfterOrphanUpdate.threads.length;
                    assert(threadCountAfter === threadCountBefore, "No new thread should be created when no matching thread exists");
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
                    upsertSMS = _c.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })
                        // Check if a new thread was created (would indicate upsert capability)
                    ];
                case 44:
                    _c.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 45:
                    threadsAfterUpsertTest = _c.sent();
                    upsertedThread = threadsAfterUpsertTest.threads.find(function (t) {
                        return t.type === "SMS" &&
                            t.phoneNumber === "+15555555559" &&
                            t.enduserPhoneNumber === "+15555555560";
                    });
                    if (!upsertedThread) return [3 /*break*/, 47];
                    console.log("✅ Upsert capability detected - thread was created automatically");
                    assert(JSON.stringify(upsertedThread.assignedTo) === JSON.stringify([testUser.id]), "Upserted thread should have correct assignment");
                    // Cleanup the upserted thread
                    return [4 /*yield*/, sdk.api.inbox_threads.deleteOne(upsertedThread.id)];
                case 46:
                    // Cleanup the upserted thread
                    _c.sent();
                    return [3 /*break*/, 48];
                case 47:
                    console.log("✅ No upsert capability - thread was not created (current behavior)");
                    _c.label = 48;
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
                    _c.sent();
                    // Test 10: returnCount parameter - basic count
                    console.log("Testing load_threads returnCount parameter...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({ returnCount: true })];
                case 50:
                    countResult = _c.sent();
                    assert(typeof countResult.count === 'number', "returnCount should return a count field with a number");
                    assert(countResult.threads === undefined, "returnCount should not return threads array");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 51:
                    allThreads = _c.sent();
                    assert(countResult.count === allThreads.threads.length, "Count (".concat(countResult.count, ") should match threads length (").concat(allThreads.threads.length, ")"));
                    console.log("✅ returnCount basic test passed");
                    // Test 11: returnCount with enduserIds filter
                    console.log("Testing returnCount with enduserIds filter...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({ enduserIds: [testEnduser.id] })];
                case 52:
                    filteredThreads = _c.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({ enduserIds: [testEnduser.id], returnCount: true })];
                case 53:
                    filteredCount = _c.sent();
                    assert(typeof filteredCount.count === 'number', "Filtered returnCount should return a count");
                    assert(filteredCount.count === filteredThreads.threads.length, "Filtered count (".concat(filteredCount.count, ") should match filtered threads length (").concat(filteredThreads.threads.length, ")"));
                    console.log("✅ returnCount with enduserIds filter test passed");
                    // Test 12: returnCount returns 0 for non-matching filters
                    console.log("Testing returnCount returns 0 for non-matching filters...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            enduserIds: ['000000000000000000000000'],
                            returnCount: true
                        })];
                case 54:
                    nonMatchingCount = _c.sent();
                    assert(nonMatchingCount.count === 0, "Non-matching filter count should be 0, got ".concat(nonMatchingCount.count));
                    console.log("✅ returnCount with non-matching filter test passed");
                    // Test 13: mdbFilter - filter by type
                    console.log("Testing mdbFilter - filter by type...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            mdbFilter: { type: 'Email' }
                        })];
                case 55:
                    emailTypeFilter = _c.sent();
                    foundEmailByType = emailTypeFilter.threads.find(function (t) { return t.id === emailThread.id; });
                    foundSmsByType = emailTypeFilter.threads.find(function (t) { return t.id === smsThread.id; });
                    assert(!!foundEmailByType, 'Email thread should be found when filtering by Email type');
                    assert(!foundSmsByType, 'SMS thread should not be found when filtering by Email type');
                    console.log("✅ mdbFilter type filter test passed");
                    // Test 14: mdbFilter - filter by multiple types ($in)
                    console.log("Testing mdbFilter - filter by multiple types...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            mdbFilter: { type: { $in: ['Email', 'SMS'] } }
                        })];
                case 56:
                    multiTypeFilter = _c.sent();
                    foundEmailMulti = multiTypeFilter.threads.find(function (t) { return t.id === emailThread.id; });
                    foundSmsMulti = multiTypeFilter.threads.find(function (t) { return t.id === smsThread.id; });
                    foundChatMulti = multiTypeFilter.threads.find(function (t) { return t.id === chatThread.id; });
                    assert(!!foundEmailMulti, 'Email thread should be found');
                    assert(!!foundSmsMulti, 'SMS thread should be found');
                    assert(!foundChatMulti, 'Chat thread should not be found when filtering Email/SMS');
                    console.log("✅ mdbFilter multiple types filter test passed");
                    // Test 15: mdbFilter - filter by assignedTo
                    console.log("Testing mdbFilter - filter by assignedTo...");
                    // First assign the email thread (may already be assigned from earlier tests)
                    return [4 /*yield*/, sdk.api.inbox_threads.updateOne(emailThread.id, { assignedTo: [testUser.id] })];
                case 57:
                    // First assign the email thread (may already be assigned from earlier tests)
                    _c.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            mdbFilter: { assignedTo: testUser.id }
                        })];
                case 58:
                    assigneeFilter = _c.sent();
                    foundAssigned = assigneeFilter.threads.find(function (t) { return t.id === emailThread.id; });
                    assert(!!foundAssigned, 'Email thread should be found when filtering by assignee');
                    console.log("✅ mdbFilter assignedTo filter test passed");
                    // Test 16: mdbFilter - combined with existing params
                    console.log("Testing mdbFilter combined with enduserIds...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            enduserIds: [testEnduser.id],
                            mdbFilter: { type: 'Email' }
                        })];
                case 59:
                    combinedFilter = _c.sent();
                    foundCombined = combinedFilter.threads.find(function (t) { return t.id === emailThread.id; });
                    assert(!!foundCombined, 'Email thread should be found with combined filters');
                    console.log("✅ mdbFilter combined filter test passed");
                    // Test 17: mdbFilter with returnCount
                    console.log("Testing mdbFilter with returnCount...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            mdbFilter: { type: 'Email' },
                            returnCount: true
                        })];
                case 60:
                    mdbFilterCount = _c.sent();
                    assert(typeof mdbFilterCount.count === 'number', 'mdbFilter with returnCount should return count');
                    assert(((_b = mdbFilterCount.count) !== null && _b !== void 0 ? _b : 0) >= 1, 'Count should be at least 1 for Email type');
                    console.log("✅ mdbFilter with returnCount test passed");
                    // Test 18: mdbFilter with empty object (should return all)
                    console.log("Testing mdbFilter with empty object...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            mdbFilter: {}
                        })];
                case 61:
                    emptyMdbFilter = _c.sent();
                    assert(emptyMdbFilter.threads.length > 0, 'Empty mdbFilter should return threads');
                    console.log("✅ mdbFilter empty object test passed");
                    // Test 19: ids filter - filter by specific thread ids
                    console.log("Testing ids filter - filter by specific thread ids...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            ids: [emailThread.id, smsThread.id]
                        })];
                case 62:
                    idsFilterResult = _c.sent();
                    assert(idsFilterResult.threads.length === 2, "ids filter should return exactly 2 threads, got ".concat(idsFilterResult.threads.length));
                    foundEmailById = idsFilterResult.threads.find(function (t) { return t.id === emailThread.id; });
                    foundSmsById = idsFilterResult.threads.find(function (t) { return t.id === smsThread.id; });
                    foundChatById = idsFilterResult.threads.find(function (t) { return t.id === chatThread.id; });
                    assert(!!foundEmailById, 'Email thread should be found when filtering by ids');
                    assert(!!foundSmsById, 'SMS thread should be found when filtering by ids');
                    assert(!foundChatById, 'Chat thread should not be found when not in ids list');
                    console.log("✅ ids filter test passed");
                    // Test 20: ids filter - single id
                    console.log("Testing ids filter - single id...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            ids: [emailThread.id]
                        })];
                case 63:
                    singleIdResult = _c.sent();
                    assert(singleIdResult.threads.length === 1, "Single id filter should return exactly 1 thread, got ".concat(singleIdResult.threads.length));
                    assert(singleIdResult.threads[0].id === emailThread.id, 'Should return the correct thread');
                    console.log("✅ ids filter single id test passed");
                    // Test 21: ids filter combined with other filters
                    console.log("Testing ids filter combined with mdbFilter...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            ids: [emailThread.id, smsThread.id],
                            mdbFilter: { type: 'Email' }
                        })];
                case 64:
                    idsCombinedResult = _c.sent();
                    assert(idsCombinedResult.threads.length === 1, "Combined ids + mdbFilter should return 1 thread, got ".concat(idsCombinedResult.threads.length));
                    assert(idsCombinedResult.threads[0].id === emailThread.id, 'Should return only the email thread');
                    console.log("✅ ids filter combined with mdbFilter test passed");
                    // Test 22: ids filter with returnCount
                    console.log("Testing ids filter with returnCount...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            ids: [emailThread.id, smsThread.id, chatThread.id],
                            returnCount: true
                        })];
                case 65:
                    idsCountResult = _c.sent();
                    assert(idsCountResult.count === 3, "ids filter with returnCount should return 3, got ".concat(idsCountResult.count));
                    console.log("✅ ids filter with returnCount test passed");
                    // Test 23: ids filter with empty array (should return all)
                    console.log("Testing ids filter with empty array...");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            ids: []
                        })];
                case 66:
                    emptyIdsResult = _c.sent();
                    assert(emptyIdsResult.threads.length >= 3, 'Empty ids array should not filter (return all threads)');
                    console.log("✅ ids filter empty array test passed");
                    console.log("🎉 All InboxThread assignment update tests passed!");
                    return [3 /*break*/, 71];
                case 67:
                    _c.trys.push([67, 69, , 70]);
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
                case 68:
                    _c.sent();
                    return [3 /*break*/, 70];
                case 69:
                    err_1 = _c.sent();
                    console.error("Cleanup error:", err_1);
                    return [3 /*break*/, 70];
                case 70: return [7 /*endfinally*/];
                case 71: return [2 /*return*/];
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
                    return [4 /*yield*/, inbox_thread_assignment_updates_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
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