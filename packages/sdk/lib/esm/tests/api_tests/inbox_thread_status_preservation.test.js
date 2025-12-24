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
export var inbox_thread_status_preservation_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var timestamp, from, testEnduser, resetAndBuildThreads, inboundSMS1, threadsAfterInbound, smsThread, threadAfterStatusUpdate, outboundSMS1, threadAfterOutbound, emailSubject, inboundEmail, threadsAfterEmail, emailThread, outboundEmail, emailThreadAfterOutbound, inboundSMS3a, threadsForTest3, smsThread3, threadBeforeNewInbound, inboundSMS3b, threadAfterNewInbound, outboundOnlyEnduser_1, outboundOnly1, threadsForTest4, outboundOnlyThread, outboundOnly2, outboundThreadAfterSecond, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_header("InboxThread Status Preservation Tests");
                    timestamp = Date.now();
                    from = new Date(Date.now() - 60000) // 1 minute ago
                    ;
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: "Test",
                            lname: "Patient",
                            email: "test-inbox-status-".concat(timestamp, "@test.com"),
                            phone: "+1555".concat(timestamp.toString().slice(-7)),
                        })
                        // Helper to reset and rebuild threads (same pattern as inbox_thread_draft_scheduled.test.ts)
                    ];
                case 1:
                    testEnduser = _b.sent();
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
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 39, 43]);
                    // Test 1: Outbound SMS should NOT reset inboxStatus
                    console.log("Test 1: Outbound SMS should NOT reset inboxStatus...");
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "Inbound test message",
                            enduserId: testEnduser.id,
                            inbound: true,
                            phoneNumber: "+15550001111",
                            enduserPhoneNumber: testEnduser.phone,
                            logOnly: true,
                        })
                        // Build initial threads
                    ];
                case 3:
                    inboundSMS1 = _b.sent();
                    // Build initial threads
                    return [4 /*yield*/, resetAndBuildThreads()
                        // Find the created thread
                    ];
                case 4:
                    // Build initial threads
                    _b.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 5:
                    threadsAfterInbound = _b.sent();
                    smsThread = threadsAfterInbound.threads.find(function (t) {
                        return t.type === 'SMS' && t.enduserIds.includes(testEnduser.id) && t.phoneNumber === "+15550001111";
                    });
                    assert(!!smsThread, "SMS thread should be created from inbound message");
                    assert(smsThread.inboxStatus === 'New', "Initial status should be 'New', got '".concat(smsThread.inboxStatus, "'"));
                    // Update thread status to "Resolved"
                    return [4 /*yield*/, sdk.api.inbox_threads.updateOne(smsThread.id, { inboxStatus: "Resolved" })
                        // Verify status was updated
                    ];
                case 6:
                    // Update thread status to "Resolved"
                    _b.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({ ids: [smsThread.id] })];
                case 7:
                    threadAfterStatusUpdate = (_b.sent()).threads[0];
                    assert(threadAfterStatusUpdate.inboxStatus === 'Resolved', "Status should be 'Resolved' after update, got '".concat(threadAfterStatusUpdate.inboxStatus, "'"));
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "Outbound reply message",
                            enduserId: testEnduser.id,
                            inbound: false,
                            phoneNumber: "+15550001111",
                            enduserPhoneNumber: testEnduser.phone,
                            logOnly: true,
                        })
                        // Rebuild threads - status should remain "Resolved"
                    ];
                case 8:
                    outboundSMS1 = _b.sent();
                    // Rebuild threads - status should remain "Resolved"
                    return [4 /*yield*/, sdk.api.inbox_threads.build_threads({ from: from, to: new Date() })
                        // Verify status was NOT reset
                    ];
                case 9:
                    // Rebuild threads - status should remain "Resolved"
                    _b.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({ ids: [smsThread.id] })];
                case 10:
                    threadAfterOutbound = (_b.sent()).threads[0];
                    assert(threadAfterOutbound.inboxStatus === 'Resolved', "Status should remain 'Resolved' after outbound message, got '".concat(threadAfterOutbound.inboxStatus, "'"));
                    assert(!!threadAfterOutbound.outboundTimestamp, "outboundTimestamp should be set after outbound message");
                    assert(threadAfterOutbound.outboundPreview === "Outbound reply message", "outboundPreview should be updated, got '".concat(threadAfterOutbound.outboundPreview, "'"));
                    console.log("Test 1 passed: Outbound SMS does NOT reset inboxStatus");
                    // Clean up test 1 resources
                    return [4 /*yield*/, Promise.all([
                            sdk.api.sms_messages.deleteOne(inboundSMS1.id),
                            sdk.api.sms_messages.deleteOne(outboundSMS1.id),
                            sdk.api.inbox_threads.deleteOne(smsThread.id),
                        ])
                        // Test 2: Outbound Email should NOT reset inboxStatus
                    ];
                case 11:
                    // Clean up test 1 resources
                    _b.sent();
                    // Test 2: Outbound Email should NOT reset inboxStatus
                    console.log("Test 2: Outbound Email should NOT reset inboxStatus...");
                    emailSubject = "Test Email Status ".concat(timestamp);
                    return [4 /*yield*/, sdk.api.emails.createOne({
                            subject: emailSubject,
                            textContent: "Inbound test email content",
                            enduserId: testEnduser.id,
                            messageId: "inbound-email-".concat(timestamp),
                            inbound: true,
                            logOnly: true,
                        })
                        // Build threads
                    ];
                case 12:
                    inboundEmail = _b.sent();
                    // Build threads
                    return [4 /*yield*/, resetAndBuildThreads()
                        // Find the created email thread
                    ];
                case 13:
                    // Build threads
                    _b.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 14:
                    threadsAfterEmail = _b.sent();
                    emailThread = threadsAfterEmail.threads.find(function (t) {
                        return t.type === 'Email' && t.enduserIds.includes(testEnduser.id);
                    });
                    assert(!!emailThread, "Email thread should be created from inbound email");
                    // Update thread status to "In Progress"
                    return [4 /*yield*/, sdk.api.inbox_threads.updateOne(emailThread.id, { inboxStatus: "In Progress" })
                        // Create outbound email reply (should NOT reset status)
                    ];
                case 15:
                    // Update thread status to "In Progress"
                    _b.sent();
                    return [4 /*yield*/, sdk.api.emails.createOne({
                            subject: "Re: ".concat(emailSubject),
                            textContent: "Outbound reply email content",
                            enduserId: testEnduser.id,
                            messageId: "outbound-email-".concat(timestamp),
                            inbound: false,
                            logOnly: true,
                        })
                        // Rebuild threads - status should remain "In Progress"
                    ];
                case 16:
                    outboundEmail = _b.sent();
                    // Rebuild threads - status should remain "In Progress"
                    return [4 /*yield*/, sdk.api.inbox_threads.build_threads({ from: from, to: new Date() })
                        // Verify status was NOT reset
                    ];
                case 17:
                    // Rebuild threads - status should remain "In Progress"
                    _b.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({ ids: [emailThread.id] })];
                case 18:
                    emailThreadAfterOutbound = (_b.sent()).threads[0];
                    assert(emailThreadAfterOutbound.inboxStatus === 'In Progress', "Email status should remain 'In Progress' after outbound, got '".concat(emailThreadAfterOutbound.inboxStatus, "'"));
                    console.log("Test 2 passed: Outbound Email does NOT reset inboxStatus");
                    // Clean up test 2 resources
                    return [4 /*yield*/, Promise.all([
                            sdk.api.emails.deleteOne(inboundEmail.id),
                            sdk.api.emails.deleteOne(outboundEmail.id),
                            sdk.api.inbox_threads.deleteOne(emailThread.id),
                        ])
                        // Test 3: Inbound SMS SHOULD update inboxStatus
                    ];
                case 19:
                    // Clean up test 2 resources
                    _b.sent();
                    // Test 3: Inbound SMS SHOULD update inboxStatus
                    console.log("Test 3: New inbound SMS SHOULD update inboxStatus...");
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "First inbound message",
                            enduserId: testEnduser.id,
                            inbound: true,
                            phoneNumber: "+15550003333",
                            enduserPhoneNumber: testEnduser.phone,
                            logOnly: true,
                        })
                        // Build threads
                    ];
                case 20:
                    inboundSMS3a = _b.sent();
                    // Build threads
                    return [4 /*yield*/, resetAndBuildThreads()
                        // Find the thread
                    ];
                case 21:
                    // Build threads
                    _b.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 22:
                    threadsForTest3 = _b.sent();
                    smsThread3 = threadsForTest3.threads.find(function (t) {
                        return t.type === 'SMS' && t.enduserIds.includes(testEnduser.id) && t.phoneNumber === "+15550003333";
                    });
                    assert(!!smsThread3, "SMS thread should be created");
                    // Update thread status to "Resolved"
                    return [4 /*yield*/, sdk.api.inbox_threads.updateOne(smsThread3.id, { inboxStatus: "Resolved" })
                        // Verify status was updated
                    ];
                case 23:
                    // Update thread status to "Resolved"
                    _b.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({ ids: [smsThread3.id] })];
                case 24:
                    threadBeforeNewInbound = (_b.sent()).threads[0];
                    assert(threadBeforeNewInbound.inboxStatus === 'Resolved', "Status should be 'Resolved' before new inbound");
                    // Create NEW inbound SMS with default "New" status
                    // Wait to ensure ObjectId timestamps are in different seconds (MongoDB ObjectIds have second-level precision)
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1100); })];
                case 25:
                    // Create NEW inbound SMS with default "New" status
                    // Wait to ensure ObjectId timestamps are in different seconds (MongoDB ObjectIds have second-level precision)
                    _b.sent();
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "Second inbound message - should reset status",
                            enduserId: testEnduser.id,
                            inbound: true,
                            phoneNumber: "+15550003333",
                            enduserPhoneNumber: testEnduser.phone,
                            inboxStatus: "New",
                            logOnly: true,
                        })
                        // Rebuild threads - status SHOULD be updated from new inbound
                    ];
                case 26:
                    inboundSMS3b = _b.sent();
                    // Rebuild threads - status SHOULD be updated from new inbound
                    return [4 /*yield*/, sdk.api.inbox_threads.build_threads({ from: from, to: new Date() })
                        // Verify status WAS updated from new inbound
                    ];
                case 27:
                    // Rebuild threads - status SHOULD be updated from new inbound
                    _b.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({ ids: [smsThread3.id] })];
                case 28:
                    threadAfterNewInbound = (_b.sent()).threads[0];
                    assert(threadAfterNewInbound.inboxStatus === 'New', "Status SHOULD be 'New' after new inbound message, got '".concat(threadAfterNewInbound.inboxStatus, "'"));
                    console.log("Test 3 passed: New inbound SMS DOES update inboxStatus");
                    // Clean up test 3 resources
                    return [4 /*yield*/, Promise.all([
                            sdk.api.sms_messages.deleteOne(inboundSMS3a.id),
                            sdk.api.sms_messages.deleteOne(inboundSMS3b.id),
                            sdk.api.inbox_threads.deleteOne(smsThread3.id),
                        ])
                        // Test 4: Outbound-only thread should keep default status
                    ];
                case 29:
                    // Clean up test 3 resources
                    _b.sent();
                    // Test 4: Outbound-only thread should keep default status
                    console.log("Test 4: Outbound-only thread should keep default status...");
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: "Outbound",
                            lname: "Only",
                            email: "outbound-only-".concat(timestamp, "@test.com"),
                            phone: "+1555".concat((timestamp + 1).toString().slice(-7)),
                        })
                        // Create outbound-only SMS (no prior inbound)
                    ];
                case 30:
                    outboundOnlyEnduser_1 = _b.sent();
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "First outbound message",
                            enduserId: outboundOnlyEnduser_1.id,
                            inbound: false,
                            phoneNumber: "+15550004444",
                            enduserPhoneNumber: outboundOnlyEnduser_1.phone,
                            logOnly: true,
                        })
                        // Build threads - should create thread with default "New" status
                    ];
                case 31:
                    outboundOnly1 = _b.sent();
                    // Build threads - should create thread with default "New" status
                    return [4 /*yield*/, resetAndBuildThreads()
                        // Find the thread
                    ];
                case 32:
                    // Build threads - should create thread with default "New" status
                    _b.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 33:
                    threadsForTest4 = _b.sent();
                    outboundOnlyThread = threadsForTest4.threads.find(function (t) {
                        return t.type === 'SMS' && t.enduserIds.includes(outboundOnlyEnduser_1.id) && t.phoneNumber === "+15550004444";
                    });
                    assert(!!outboundOnlyThread, "Outbound-only thread should be created");
                    assert(outboundOnlyThread.inboxStatus === 'New', "Outbound-only thread should have 'New' status, got '".concat(outboundOnlyThread.inboxStatus, "'"));
                    // Create another outbound SMS
                    // Wait to ensure ObjectId timestamps are in different seconds (MongoDB ObjectIds have second-level precision)
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1100); })];
                case 34:
                    // Create another outbound SMS
                    // Wait to ensure ObjectId timestamps are in different seconds (MongoDB ObjectIds have second-level precision)
                    _b.sent();
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            message: "Second outbound message",
                            enduserId: outboundOnlyEnduser_1.id,
                            inbound: false,
                            phoneNumber: "+15550004444",
                            enduserPhoneNumber: outboundOnlyEnduser_1.phone,
                            logOnly: true,
                        })
                        // Rebuild threads - status should remain "New" (not reset, just unchanged)
                    ];
                case 35:
                    outboundOnly2 = _b.sent();
                    // Rebuild threads - status should remain "New" (not reset, just unchanged)
                    return [4 /*yield*/, sdk.api.inbox_threads.build_threads({ from: from, to: new Date() })
                        // Verify status remains "New"
                    ];
                case 36:
                    // Rebuild threads - status should remain "New" (not reset, just unchanged)
                    _b.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({ ids: [outboundOnlyThread.id] })];
                case 37:
                    outboundThreadAfterSecond = (_b.sent()).threads[0];
                    assert(outboundThreadAfterSecond.inboxStatus === 'New', "Outbound-only thread status should remain 'New', got '".concat(outboundThreadAfterSecond.inboxStatus, "'"));
                    console.log("Test 4 passed: Outbound-only thread keeps default status");
                    // Clean up test 4 resources
                    return [4 /*yield*/, Promise.all([
                            sdk.api.sms_messages.deleteOne(outboundOnly1.id),
                            sdk.api.sms_messages.deleteOne(outboundOnly2.id),
                            sdk.api.inbox_threads.deleteOne(outboundOnlyThread.id),
                            sdk.api.endusers.deleteOne(outboundOnlyEnduser_1.id),
                        ])];
                case 38:
                    // Clean up test 4 resources
                    _b.sent();
                    console.log("All InboxThread status preservation tests passed!");
                    return [3 /*break*/, 43];
                case 39:
                    _b.trys.push([39, 41, , 42]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(testEnduser.id)];
                case 40:
                    _b.sent();
                    return [3 /*break*/, 42];
                case 41:
                    err_1 = _b.sent();
                    console.error("Cleanup error:", err_1);
                    return [3 /*break*/, 42];
                case 42: return [7 /*endfinally*/];
                case 43: return [2 /*return*/];
            }
        });
    });
};
// Allow running this test file independently
if (require.main === module) {
    console.log("Using API URL: ".concat(host));
    var sdk_1 = new Session({ host: host });
    var sdkNonAdmin_1 = new Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setup_tests(sdk_1, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, inbox_thread_status_preservation_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("InboxThread status preservation test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("InboxThread status preservation test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=inbox_thread_status_preservation.test.js.map