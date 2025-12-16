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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inbox_thread_mdb_filter_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || 'http://localhost:8080';
var inbox_thread_mdb_filter_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var timestamp, testUser, testUser2, testEnduser, testEnduser2, baseTimestamp, oldTimestamp, emailThread, smsThread, chatThread, phoneThread, createdThreadIds, emailOnly, foundEmail, foundSmsInEmail, emailAndSms, foundEmailIn, foundSmsIn, foundChatIn, assignedToUser1, foundAssigned1, foundAssigned2, foundAssigned3, urgentTags, foundUrgent1, foundUrgent2, foundUrgent3, urgentAndVip, foundBoth1, foundBoth2, recentOnly, foundRecent1, foundRecent2, foundRecent3, readThreads, foundRead1, foundRead2, unreadThreads, foundUnread1, foundUnread2, combined, foundCombined1, foundCombined2, foundCombined3, countResult, withEnduserFilter, foundWithEnduser, emptyFilter, err_1;
        var _b, _c, _d, _e;
        var _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    (0, testing_1.log_header)("InboxThread mdbFilter Tests");
                    timestamp = Date.now();
                    return [4 /*yield*/, sdk.api.users.createOne({
                            fname: "Test",
                            lname: "MdbFilter",
                            email: "test-mdbfilter-".concat(timestamp, "@test.com"),
                            notificationEmailsDisabled: true
                        })];
                case 1:
                    testUser = _g.sent();
                    return [4 /*yield*/, sdk.api.users.createOne({
                            fname: "Test",
                            lname: "MdbFilter2",
                            email: "test-mdbfilter2-".concat(timestamp, "@test.com"),
                            notificationEmailsDisabled: true
                        })];
                case 2:
                    testUser2 = _g.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: "Test",
                            lname: "Patient",
                            email: "test-patient-mdbfilter-".concat(timestamp, "@test.com")
                        })];
                case 3:
                    testEnduser = _g.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: "Test",
                            lname: "Patient2",
                            email: "test-patient-mdbfilter2-".concat(timestamp, "@test.com")
                        })
                        // Create test threads with different properties for filtering
                    ];
                case 4:
                    testEnduser2 = _g.sent();
                    baseTimestamp = new Date();
                    oldTimestamp = new Date(baseTimestamp.getTime() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
                    ;
                    return [4 /*yield*/, sdk.api.inbox_threads.createOne({
                            type: "Email",
                            title: "Email Thread for Filter Test",
                            threadId: "email-filter-test-".concat(timestamp),
                            assignedTo: [testUser.id],
                            enduserIds: [testEnduser.id],
                            userIds: [sdk.userInfo.id],
                            inboxStatus: 'New',
                            preview: 'Email preview',
                            timestamp: baseTimestamp,
                            tags: ['urgent', 'vip'],
                            readBy: (_b = {}, _b[sdk.userInfo.id] = new Date(), _b),
                        })
                        // Thread 2: SMS, unassigned, no tags, unread
                    ];
                case 5:
                    emailThread = _g.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.createOne({
                            type: "SMS",
                            title: "SMS Thread for Filter Test",
                            threadId: "sms-filter-test-".concat(timestamp),
                            phoneNumber: "+15555551111",
                            enduserPhoneNumber: "+15555552222",
                            assignedTo: [],
                            enduserIds: [testEnduser.id],
                            userIds: [sdk.userInfo.id],
                            inboxStatus: 'New',
                            preview: 'SMS preview',
                            timestamp: oldTimestamp,
                        })
                        // Thread 3: Chat, assigned to testUser2, has different tags
                    ];
                case 6:
                    smsThread = _g.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.createOne({
                            type: "Chat",
                            title: "Chat Thread for Filter Test",
                            threadId: "chat-filter-test-".concat(timestamp),
                            assignedTo: [testUser2.id],
                            enduserIds: [testEnduser2.id],
                            userIds: [sdk.userInfo.id],
                            inboxStatus: 'In Progress',
                            preview: 'Chat preview',
                            timestamp: baseTimestamp,
                            tags: ['follow-up'],
                            outboundTimestamp: new Date(),
                        })
                        // Thread 4: Phone, multiple assignees
                    ];
                case 7:
                    chatThread = _g.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.createOne({
                            type: "Phone",
                            title: "Phone Thread for Filter Test",
                            threadId: "phone-filter-test-".concat(timestamp),
                            phoneNumber: "+15555553333",
                            enduserPhoneNumber: "+15555554444",
                            assignedTo: [testUser.id, testUser2.id],
                            enduserIds: [testEnduser.id],
                            userIds: [sdk.userInfo.id],
                            inboxStatus: 'New',
                            preview: 'Phone preview',
                            timestamp: oldTimestamp,
                            tags: ['urgent'],
                        })];
                case 8:
                    phoneThread = _g.sent();
                    createdThreadIds = [emailThread.id, smsThread.id, chatThread.id, phoneThread.id];
                    _g.label = 9;
                case 9:
                    _g.trys.push([9, , 22, 26]);
                    // Test 1: Filter by channel type (single)
                    console.log("Test 1: Filter by single channel type");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            mdbFilter: { type: 'Email' }
                        })];
                case 10:
                    emailOnly = _g.sent();
                    foundEmail = emailOnly.threads.find(function (t) { return t.id === emailThread.id; });
                    foundSmsInEmail = emailOnly.threads.find(function (t) { return t.id === smsThread.id; });
                    (0, testing_1.assert)(!!foundEmail, 'Email thread should be found when filtering by Email type');
                    (0, testing_1.assert)(!foundSmsInEmail, 'SMS thread should not be found when filtering by Email type');
                    // Test 2: Filter by multiple channel types ($in)
                    console.log("Test 2: Filter by multiple channel types");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            mdbFilter: { type: { $in: ['Email', 'SMS'] } }
                        })];
                case 11:
                    emailAndSms = _g.sent();
                    foundEmailIn = emailAndSms.threads.find(function (t) { return t.id === emailThread.id; });
                    foundSmsIn = emailAndSms.threads.find(function (t) { return t.id === smsThread.id; });
                    foundChatIn = emailAndSms.threads.find(function (t) { return t.id === chatThread.id; });
                    (0, testing_1.assert)(!!foundEmailIn, 'Email thread should be found');
                    (0, testing_1.assert)(!!foundSmsIn, 'SMS thread should be found');
                    (0, testing_1.assert)(!foundChatIn, 'Chat thread should not be found');
                    // Test 3: Filter by assignee
                    console.log("Test 3: Filter by assignee");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            mdbFilter: { assignedTo: testUser.id }
                        })];
                case 12:
                    assignedToUser1 = _g.sent();
                    foundAssigned1 = assignedToUser1.threads.find(function (t) { return t.id === emailThread.id; });
                    foundAssigned2 = assignedToUser1.threads.find(function (t) { return t.id === phoneThread.id; });
                    foundAssigned3 = assignedToUser1.threads.find(function (t) { return t.id === chatThread.id; });
                    (0, testing_1.assert)(!!foundAssigned1, 'Email thread should be found (assigned to testUser)');
                    (0, testing_1.assert)(!!foundAssigned2, 'Phone thread should be found (assigned to testUser)');
                    (0, testing_1.assert)(!foundAssigned3, 'Chat thread should not be found (assigned to testUser2)');
                    // Test 4: Filter by tags ($in - any match)
                    console.log("Test 4: Filter by tags (any match)");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            mdbFilter: { tags: { $in: ['urgent'] } }
                        })];
                case 13:
                    urgentTags = _g.sent();
                    foundUrgent1 = urgentTags.threads.find(function (t) { return t.id === emailThread.id; });
                    foundUrgent2 = urgentTags.threads.find(function (t) { return t.id === phoneThread.id; });
                    foundUrgent3 = urgentTags.threads.find(function (t) { return t.id === smsThread.id; });
                    (0, testing_1.assert)(!!foundUrgent1, 'Email thread should be found (has urgent tag)');
                    (0, testing_1.assert)(!!foundUrgent2, 'Phone thread should be found (has urgent tag)');
                    (0, testing_1.assert)(!foundUrgent3, 'SMS thread should not be found (no tags)');
                    // Test 5: Filter by tags ($all - all must match)
                    console.log("Test 5: Filter by tags (all must match)");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            mdbFilter: { tags: { $all: ['urgent', 'vip'] } }
                        })];
                case 14:
                    urgentAndVip = _g.sent();
                    foundBoth1 = urgentAndVip.threads.find(function (t) { return t.id === emailThread.id; });
                    foundBoth2 = urgentAndVip.threads.find(function (t) { return t.id === phoneThread.id; });
                    (0, testing_1.assert)(!!foundBoth1, 'Email thread should be found (has both urgent and vip)');
                    (0, testing_1.assert)(!foundBoth2, 'Phone thread should not be found (only has urgent)');
                    // Test 6: Filter by timestamp range
                    console.log("Test 6: Filter by timestamp range");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            mdbFilter: {
                                timestamp: {
                                    $gte: new Date(baseTimestamp.getTime() - 1000),
                                    $lte: new Date(baseTimestamp.getTime() + 1000) // 1 second after base
                                }
                            }
                        })];
                case 15:
                    recentOnly = _g.sent();
                    foundRecent1 = recentOnly.threads.find(function (t) { return t.id === emailThread.id; });
                    foundRecent2 = recentOnly.threads.find(function (t) { return t.id === chatThread.id; });
                    foundRecent3 = recentOnly.threads.find(function (t) { return t.id === smsThread.id; });
                    (0, testing_1.assert)(!!foundRecent1, 'Email thread should be found (recent timestamp)');
                    (0, testing_1.assert)(!!foundRecent2, 'Chat thread should be found (recent timestamp)');
                    (0, testing_1.assert)(!foundRecent3, 'SMS thread should not be found (old timestamp)');
                    // Test 7: Filter by read status (read)
                    console.log("Test 7: Filter by read status (read)");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            mdbFilter: (_c = {}, _c["readBy.".concat(sdk.userInfo.id)] = { $exists: true, $ne: '' }, _c)
                        })];
                case 16:
                    readThreads = _g.sent();
                    foundRead1 = readThreads.threads.find(function (t) { return t.id === emailThread.id; });
                    foundRead2 = readThreads.threads.find(function (t) { return t.id === smsThread.id; });
                    (0, testing_1.assert)(!!foundRead1, 'Email thread should be found (marked as read)');
                    (0, testing_1.assert)(!foundRead2, 'SMS thread should not be found (not read)');
                    // Test 8: Filter by read status (unread)
                    console.log("Test 8: Filter by read status (unread)");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            mdbFilter: {
                                $or: [
                                    (_d = {}, _d["readBy.".concat(sdk.userInfo.id)] = { $exists: false }, _d),
                                    (_e = {}, _e["readBy.".concat(sdk.userInfo.id)] = '', _e)
                                ]
                            }
                        })];
                case 17:
                    unreadThreads = _g.sent();
                    foundUnread1 = unreadThreads.threads.find(function (t) { return t.id === smsThread.id; });
                    foundUnread2 = unreadThreads.threads.find(function (t) { return t.id === emailThread.id; });
                    (0, testing_1.assert)(!!foundUnread1, 'SMS thread should be found (unread)');
                    (0, testing_1.assert)(!foundUnread2, 'Email thread should not be found (already read)');
                    // Test 9: Combined filters
                    console.log("Test 9: Combined filters (type + tags)");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            mdbFilter: {
                                type: { $in: ['Email', 'Phone'] },
                                tags: { $in: ['urgent'] }
                            }
                        })];
                case 18:
                    combined = _g.sent();
                    foundCombined1 = combined.threads.find(function (t) { return t.id === emailThread.id; });
                    foundCombined2 = combined.threads.find(function (t) { return t.id === phoneThread.id; });
                    foundCombined3 = combined.threads.find(function (t) { return t.id === chatThread.id; });
                    (0, testing_1.assert)(!!foundCombined1, 'Email thread should be found (Email type + urgent tag)');
                    (0, testing_1.assert)(!!foundCombined2, 'Phone thread should be found (Phone type + urgent tag)');
                    (0, testing_1.assert)(!foundCombined3, 'Chat thread should not be found (Chat type, no urgent)');
                    // Test 10: mdbFilter with returnCount
                    console.log("Test 10: mdbFilter with returnCount");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            mdbFilter: { type: 'Email' },
                            returnCount: true
                        })];
                case 19:
                    countResult = _g.sent();
                    (0, testing_1.assert)(((_f = countResult.count) !== null && _f !== void 0 ? _f : 0) >= 1, 'Count should be at least 1 for Email threads');
                    (0, testing_1.assert)(countResult.threads.length === 0, 'Threads array should be empty when returnCount is true');
                    // Test 11: mdbFilter combined with existing params
                    console.log("Test 11: mdbFilter combined with enduserIds param");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            enduserIds: [testEnduser.id],
                            mdbFilter: { type: 'Email' }
                        })];
                case 20:
                    withEnduserFilter = _g.sent();
                    foundWithEnduser = withEnduserFilter.threads.find(function (t) { return t.id === emailThread.id; });
                    (0, testing_1.assert)(!!foundWithEnduser, 'Email thread should be found with combined filters');
                    // Test 12: Empty mdbFilter should return all accessible threads
                    console.log("Test 12: Empty mdbFilter");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            mdbFilter: {}
                        })];
                case 21:
                    emptyFilter = _g.sent();
                    (0, testing_1.assert)(emptyFilter.threads.length > 0, 'Should return threads with empty mdbFilter');
                    console.log("All mdbFilter tests passed!");
                    return [3 /*break*/, 26];
                case 22:
                    _g.trys.push([22, 24, , 25]);
                    return [4 /*yield*/, Promise.all(__spreadArray(__spreadArray([], createdThreadIds.map(function (id) { return sdk.api.inbox_threads.deleteOne(id); }), true), [
                            sdk.api.users.deleteOne(testUser.id),
                            sdk.api.users.deleteOne(testUser2.id),
                            sdk.api.endusers.deleteOne(testEnduser.id),
                            sdk.api.endusers.deleteOne(testEnduser2.id),
                        ], false))];
                case 23:
                    _g.sent();
                    return [3 /*break*/, 25];
                case 24:
                    err_1 = _g.sent();
                    console.error("Cleanup error:", err_1);
                    return [3 /*break*/, 25];
                case 25: return [7 /*endfinally*/];
                case 26: return [2 /*return*/];
            }
        });
    });
};
exports.inbox_thread_mdb_filter_tests = inbox_thread_mdb_filter_tests;
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
                    return [4 /*yield*/, (0, exports.inbox_thread_mdb_filter_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ InboxThread mdbFilter test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ InboxThread mdbFilter test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=inbox_thread_mdb_filter.test.js.map