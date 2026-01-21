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
exports.load_threads_autobuild_tests = void 0;
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var load_threads_autobuild_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var testEnduser, testUser, sms1, result1, result2, testEnduser2, sms2, result3, result4, result5, allThreads, oldestThread, result6, result6b, result7, draftSms, result8, threadWithDraft;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    (0, testing_1.log_header)("Load Threads with Autobuild Tests");
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, , 21, 27]);
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            email: "autobuild-test-".concat(Date.now(), "@test.com"),
                            fname: "Autobuild",
                            lname: "Test"
                        })];
                case 2:
                    // Setup test data
                    testEnduser = _c.sent();
                    return [4 /*yield*/, sdk.api.users.createOne({
                            email: "autobuild-user-".concat(Date.now(), "@test.com"),
                            fname: "Test",
                            lname: "User"
                        })
                        // Reset threads before testing
                    ];
                case 3:
                    testUser = _c.sent();
                    // Reset threads before testing
                    return [4 /*yield*/, sdk.api.inbox_threads.reset_threads()
                        // Test 1: Autobuild with no existing threads (bootstrap case)
                    ];
                case 4:
                    // Reset threads before testing
                    _c.sent();
                    // Test 1: Autobuild with no existing threads (bootstrap case)
                    (0, testing_1.log_header)("Test 1: Basic autobuild from scratch (bootstrap)");
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "Test message for autobuild",
                            enduserId: testEnduser.id,
                            userId: testUser.id,
                            inbound: true,
                            phoneNumber: "+15555555555",
                            enduserPhoneNumber: "+15555555556",
                            logOnly: true,
                        })];
                case 5:
                    sms1 = _c.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            autobuild: true
                        })];
                case 6:
                    result1 = _c.sent();
                    (0, testing_1.assert)(result1.threads.length === 1, "Should load 1 thread after autobuild");
                    (0, testing_1.assert)(result1.threads[0].type === 'SMS', "Thread should be SMS type");
                    // Test 2: Idempotency - calling autobuild again doesn't duplicate
                    (0, testing_1.log_header)("Test 2: Autobuild idempotency");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            autobuild: true
                        })];
                case 7:
                    result2 = _c.sent();
                    (0, testing_1.assert)(result2.threads.length === 1, "Should still have 1 thread (no duplicates)");
                    // Test 3: Autobuild with filters
                    (0, testing_1.log_header)("Test 3: Autobuild combined with enduserIds filter");
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            email: "autobuild-test2-".concat(Date.now(), "@test.com"),
                            fname: "Autobuild2",
                            lname: "Test2"
                        })];
                case 8:
                    testEnduser2 = _c.sent();
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "Second test message",
                            enduserId: testEnduser2.id,
                            userId: testUser.id,
                            inbound: true,
                            phoneNumber: "+15555555557",
                            enduserPhoneNumber: "+15555555558",
                            logOnly: true,
                        })];
                case 9:
                    sms2 = _c.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            autobuild: true,
                            enduserIds: [testEnduser.id]
                        })];
                case 10:
                    result3 = _c.sent();
                    (0, testing_1.assert)(result3.threads.length === 1, "Should filter to only 1 enduser's thread");
                    (0, testing_1.assert)(result3.threads[0].enduserIds.includes(testEnduser.id), "Should be first enduser's thread");
                    // Test 4: Autobuild with phoneNumber filter
                    (0, testing_1.log_header)("Test 4: Autobuild with phoneNumber filter");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            autobuild: true,
                            phoneNumber: "+15555555555"
                        })];
                case 11:
                    result4 = _c.sent();
                    (0, testing_1.assert)(result4.threads.length === 1, "Should filter by phone number");
                    (0, testing_1.assert)(result4.threads[0].phoneNumber === '+15555555555', "Should match phone number");
                    // Test 5: Autobuild with returnCount
                    (0, testing_1.log_header)("Test 5: Autobuild with returnCount");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            autobuild: true,
                            returnCount: true
                        })];
                case 12:
                    result5 = _c.sent();
                    (0, testing_1.assert)(result5.count === 2, "Should return count of 2 threads");
                    (0, testing_1.assert)(!result5.threads || result5.threads.length === 0, "Should not return threads when returnCount=true");
                    // Test 6: Autobuild with pagination (backwards paging)
                    (0, testing_1.log_header)("Test 6: Autobuild with pagination (paging backwards)");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            autobuild: false
                        })];
                case 13:
                    allThreads = _c.sent();
                    oldestThread = allThreads.threads[allThreads.threads.length - 1];
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            autobuild: true,
                            lastTimestamp: oldestThread.timestamp
                        })
                        // Should still return threads (may include older ones if any exist)
                    ];
                case 14:
                    result6 = _c.sent();
                    // Should still return threads (may include older ones if any exist)
                    (0, testing_1.assert)(Array.isArray(result6.threads), "Should return threads when paging backwards");
                    // Test 6b: Autobuild without lastTimestamp (loading current/newer data)
                    (0, testing_1.log_header)("Test 6b: Autobuild loads newer data when no lastTimestamp");
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            autobuild: true
                        })];
                case 15:
                    result6b = _c.sent();
                    (0, testing_1.assert)(result6b.threads.length >= 2, "Should load current threads");
                    // Test 7: Non-admin user can use autobuild but sees filtered threads
                    (0, testing_1.log_header)("Test 7: Non-admin autobuild with access control");
                    return [4 /*yield*/, sdkNonAdmin.api.inbox_threads.load_threads({
                            autobuild: true
                        })
                        // Non-admin should only see threads they have access to
                        // (Exact assertion depends on role setup in setup_tests)
                    ];
                case 16:
                    result7 = _c.sent();
                    // Non-admin should only see threads they have access to
                    // (Exact assertion depends on role setup in setup_tests)
                    (0, testing_1.assert)(Array.isArray(result7.threads), "Non-admin should get threads array");
                    // Test 8: Autobuild with draft and scheduled messages
                    (0, testing_1.log_header)("Test 8: Autobuild includes draft messages");
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "Draft message",
                            enduserId: testEnduser.id,
                            userId: testUser.id,
                            inbound: false,
                            phoneNumber: "+15555555555",
                            enduserPhoneNumber: "+15555555556",
                            isDraft: true,
                            logOnly: true,
                        })
                        // Wait to ensure message ObjectId timestamp is in the past before building
                    ];
                case 17:
                    draftSms = _c.sent();
                    // Wait to ensure message ObjectId timestamp is in the past before building
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 2000)];
                case 18:
                    // Wait to ensure message ObjectId timestamp is in the past before building
                    _c.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({
                            autobuild: true,
                            enduserIds: [testEnduser.id]
                        })];
                case 19:
                    result8 = _c.sent();
                    threadWithDraft = result8.threads.find(function (t) {
                        return t.phoneNumber === '+15555555555' && t.enduserPhoneNumber === '+15555555556';
                    });
                    (0, testing_1.assert)(!!threadWithDraft, "Should find thread with draft");
                    (0, testing_1.assert)(!!((_b = threadWithDraft === null || threadWithDraft === void 0 ? void 0 : threadWithDraft.draftMessageIds) === null || _b === void 0 ? void 0 : _b.includes(draftSms.id)), "Should include draft message ID");
                    console.log("✅ All autobuild tests passed!");
                    // Cleanup
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(testEnduser2.id)];
                case 20:
                    // Cleanup
                    _c.sent();
                    return [3 /*break*/, 27];
                case 21:
                    if (!testEnduser) return [3 /*break*/, 23];
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(testEnduser.id).catch(console.error)];
                case 22:
                    _c.sent();
                    _c.label = 23;
                case 23:
                    if (!testUser) return [3 /*break*/, 25];
                    return [4 /*yield*/, sdk.api.users.deleteOne(testUser.id).catch(console.error)];
                case 24:
                    _c.sent();
                    _c.label = 25;
                case 25: return [4 /*yield*/, sdk.api.inbox_threads.reset_threads().catch(console.error)];
                case 26:
                    _c.sent();
                    return [7 /*endfinally*/];
                case 27: return [2 /*return*/];
            }
        });
    });
};
exports.load_threads_autobuild_tests = load_threads_autobuild_tests;
// Allow running this test independently
if (require.main === module) {
    var host = process.env.API_URL || 'http://localhost:8080';
    var sdk_2 = new sdk_1.Session({ host: host });
    var sdkNonAdmin_1 = new sdk_1.Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, setup_1.setup_tests)(sdk_2, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, exports.load_threads_autobuild_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Load threads autobuild test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Load threads autobuild test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=load_threads_autobuild.test.js.map