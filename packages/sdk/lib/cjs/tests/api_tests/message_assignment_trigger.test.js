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
exports.message_assignment_trigger_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
/**
 * Tests for the "Assign to Incoming Message" trigger action
 * Verifies assignment works for all incoming message types: Email, SMS, and ChatRoom
 */
var message_assignment_trigger_tests = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var _b, emailPatient, smsPatient, chatPatient, emailTrigger, smsTrigger, chatTrigger, emailMessage, smsMessage, chatRoom, chatMessage, updatedEmail, emailAssigned, updatedSMS, smsAssigned, updatedChatRoom, chatAssigned, outboundSMS, unchangedOutboundSMS, outboundNotAssigned, allTestsPassed, cleanupPromises, error_1;
        var _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    (0, testing_1.log_header)("Message Assignment Trigger Tests");
                    return [4 /*yield*/, sdk.api.endusers.createSome([
                            { fname: 'Email', lname: 'Patient', assignedTo: [sdk.userInfo.id] },
                            { fname: 'SMS', lname: 'Patient', assignedTo: [sdk.userInfo.id] },
                            { fname: 'Chat', lname: 'Patient', assignedTo: [sdk.userInfo.id] }, // Assign to care team
                        ])];
                case 1:
                    _b = (_j.sent()).created, emailPatient = _b[0], smsPatient = _b[1], chatPatient = _b[2];
                    console.log("Created test patients:");
                    console.log("  Email: ".concat(emailPatient.id));
                    console.log("  SMS: ".concat(smsPatient.id));
                    console.log("  Chat: ".concat(chatPatient.id));
                    _j.label = 2;
                case 2:
                    _j.trys.push([2, , 21, 25]);
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            title: "Email Message Assignment Test ".concat(Date.now()),
                            status: 'Active',
                            event: {
                                type: 'Incoming Message',
                                info: {
                                    channels: ['Email'], // Only trigger for email messages
                                }
                            },
                            action: {
                                type: 'Assign to Incoming Message',
                                info: {
                                    careTeamOnly: true,
                                    maxUsers: 3
                                }
                            }
                        })];
                case 3:
                    // Create triggers using the "Incoming Message" event type
                    emailTrigger = _j.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            title: "SMS Message Assignment Test ".concat(Date.now()),
                            status: 'Active',
                            event: {
                                type: 'Incoming Message',
                                info: {
                                    channels: ['SMS'], // Only trigger for SMS messages
                                }
                            },
                            action: {
                                type: 'Assign to Incoming Message',
                                info: {
                                    careTeamOnly: true,
                                    maxUsers: 3
                                }
                            }
                        })];
                case 4:
                    smsTrigger = _j.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            title: "Chat Message Assignment Test ".concat(Date.now()),
                            status: 'Active',
                            event: {
                                type: 'Incoming Message',
                                info: {
                                    channels: ['Chat'], // Only trigger for chat messages
                                }
                            },
                            action: {
                                type: 'Assign to Incoming Message',
                                info: {
                                    careTeamOnly: true,
                                    maxUsers: 3
                                }
                            }
                        })];
                case 5:
                    chatTrigger = _j.sent();
                    console.log("Created triggers:");
                    console.log("  Email Trigger: ".concat(emailTrigger.id));
                    console.log("  SMS Trigger: ".concat(smsTrigger.id));
                    console.log("  Chat Trigger: ".concat(chatTrigger.id));
                    // Test 1: Email Message Assignment
                    console.log("\n=== Testing Email Message Assignment ===");
                    return [4 /*yield*/, sdk.api.emails.createOne({
                            logOnly: true,
                            enduserId: emailPatient.id,
                            subject: 'Test Incoming Email __TELLESCOPE_TEST_INCOMING_EMAIL_AUTOMATION__',
                            textContent: 'This is a test incoming email for assignment __TELLESCOPE_TEST_INCOMING_EMAIL_AUTOMATION__',
                        })];
                case 6:
                    // Create email with logOnly: true to prevent actual sending
                    // Note: In real scenarios, emails have source fields added by the system
                    // For testing purposes, we'll create the email and test the assignment logic
                    emailMessage = _j.sent();
                    console.log("Created email message: ".concat(emailMessage.id));
                    console.log("Note: In production, creating an inbound email would automatically trigger the Incoming Message event");
                    console.log("For testing, we rely on the trigger system to process the created email");
                    // Wait for trigger processing
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1000)
                        // Check if email was assigned
                    ];
                case 7:
                    // Wait for trigger processing
                    _j.sent();
                    return [4 /*yield*/, sdk.api.emails.getOne(emailMessage.id)];
                case 8:
                    updatedEmail = _j.sent();
                    console.log("Email assignment result:");
                    console.log("  assignedTo: ".concat(JSON.stringify(updatedEmail.assignedTo)));
                    console.log("  Expected user: ".concat(sdk.userInfo.id));
                    emailAssigned = (_d = (_c = updatedEmail.assignedTo) === null || _c === void 0 ? void 0 : _c.includes(sdk.userInfo.id)) !== null && _d !== void 0 ? _d : false;
                    if (emailAssigned) {
                        console.log("\u2705 Email message successfully assigned to user");
                    }
                    else {
                        console.log("\u274C Email message assignment failed");
                    }
                    // Test 2: SMS Message Assignment  
                    console.log("\n=== Testing SMS Message Assignment ===");
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            logOnly: true,
                            inbound: true,
                            enduserId: smsPatient.id,
                            message: 'This is a test incoming SMS for assignment __TELLESCOPE_TEST_INCOMING_SMS_AUTOMATION__',
                        })];
                case 9:
                    // Create inbound SMS with logOnly: true and inbound: true
                    smsMessage = _j.sent();
                    console.log("Created SMS message: ".concat(smsMessage.id));
                    console.log("Note: In production, creating an inbound SMS would automatically trigger the Incoming Message event");
                    console.log("For testing, we rely on the trigger system to process the created SMS");
                    // Wait for trigger processing
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1000)
                        // Check if SMS was assigned
                    ];
                case 10:
                    // Wait for trigger processing
                    _j.sent();
                    return [4 /*yield*/, sdk.api.sms_messages.getOne(smsMessage.id)];
                case 11:
                    updatedSMS = _j.sent();
                    console.log("SMS assignment result:");
                    console.log("  assignedTo: ".concat(JSON.stringify(updatedSMS.assignedTo)));
                    console.log("  Expected user: ".concat(sdk.userInfo.id));
                    smsAssigned = (_f = (_e = updatedSMS.assignedTo) === null || _e === void 0 ? void 0 : _e.includes(sdk.userInfo.id)) !== null && _f !== void 0 ? _f : false;
                    if (smsAssigned) {
                        console.log("\u2705 SMS message successfully assigned to user");
                    }
                    else {
                        console.log("\u274C SMS message assignment failed");
                    }
                    // Test 3: Chat Room Assignment
                    console.log("\n=== Testing Chat Room Assignment ===");
                    return [4 /*yield*/, sdk.api.chat_rooms.createOne({
                            aboutEnduserId: chatPatient.id,
                            userIds: [sdk.userInfo.id],
                            enduserIds: [chatPatient.id],
                        })];
                case 12:
                    // Create a chat room for the patient
                    chatRoom = _j.sent();
                    console.log("Created chat room: ".concat(chatRoom.id));
                    return [4 /*yield*/, sdk.api.chats.createOne({
                            roomId: chatRoom.id,
                            message: 'This is a test incoming chat message for assignment',
                            senderId: chatPatient.id, // Message from patient (incoming)
                        })];
                case 13:
                    // Create a chat message in the room (this represents an incoming message)
                    chatMessage = _j.sent();
                    console.log("Created chat message: ".concat(chatMessage.id));
                    console.log("Note: In production, creating an inbound chat would automatically trigger the Incoming Message event");
                    console.log("For testing, we rely on the trigger system to process the created chat message");
                    // Wait for trigger processing
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1000)
                        // Check if chat room was assigned
                    ];
                case 14:
                    // Wait for trigger processing
                    _j.sent();
                    return [4 /*yield*/, sdk.api.chat_rooms.getOne(chatRoom.id)];
                case 15:
                    updatedChatRoom = _j.sent();
                    console.log("Chat room assignment result:");
                    console.log("  assignedTo: ".concat(JSON.stringify(updatedChatRoom.assignedTo)));
                    console.log("  Expected user: ".concat(sdk.userInfo.id));
                    chatAssigned = (_h = (_g = updatedChatRoom.assignedTo) === null || _g === void 0 ? void 0 : _g.includes(sdk.userInfo.id)) !== null && _h !== void 0 ? _h : false;
                    if (chatAssigned) {
                        console.log("\u2705 Chat room successfully assigned to user");
                    }
                    else {
                        console.log("\u274C Chat room assignment failed");
                    }
                    // Test 4: Verify outbound messages don't trigger assignment
                    console.log("\n=== Testing Outbound Message Exclusion ===");
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            logOnly: true,
                            inbound: false,
                            enduserId: smsPatient.id,
                            message: 'This is an outbound SMS that should not trigger assignment __TELLESCOPE_TEST_INCOMING_SMS_AUTOMATION__',
                        })];
                case 16:
                    outboundSMS = _j.sent();
                    console.log("Created outbound SMS: ".concat(outboundSMS.id));
                    console.log("Outbound SMS created for verification that it should NOT be assigned");
                    console.log("The Incoming Message trigger should only activate for inbound: true messages");
                    // Wait for potential trigger processing
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1000)
                        // Verify outbound SMS was NOT assigned (should still be null/undefined)
                    ];
                case 17:
                    // Wait for potential trigger processing
                    _j.sent();
                    return [4 /*yield*/, sdk.api.sms_messages.getOne(outboundSMS.id)];
                case 18:
                    unchangedOutboundSMS = _j.sent();
                    outboundNotAssigned = !unchangedOutboundSMS.assignedTo || unchangedOutboundSMS.assignedTo.length === 0;
                    if (outboundNotAssigned) {
                        console.log("\u2705 Outbound SMS correctly NOT assigned (as expected)");
                    }
                    else {
                        console.log("\u274C Outbound SMS was incorrectly assigned: ".concat(JSON.stringify(unchangedOutboundSMS.assignedTo)));
                    }
                    // Summary
                    console.log("\n=== Test Results Summary ===");
                    console.log("Email Assignment: ".concat(emailAssigned ? '✅ PASSED' : '❌ FAILED'));
                    console.log("SMS Assignment: ".concat(smsAssigned ? '✅ PASSED' : '❌ FAILED'));
                    console.log("Chat Assignment: ".concat(chatAssigned ? '✅ PASSED' : '❌ FAILED'));
                    console.log("Outbound Exclusion: ".concat(outboundNotAssigned ? '✅ PASSED' : '❌ FAILED'));
                    allTestsPassed = emailAssigned && smsAssigned && chatAssigned && outboundNotAssigned;
                    console.log("\nOverall Result: ".concat(allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'));
                    if (!allTestsPassed) {
                        throw new Error('Message assignment trigger tests failed');
                    }
                    // Cleanup test triggers
                    return [4 /*yield*/, Promise.all([
                            sdk.api.automation_triggers.deleteOne(emailTrigger.id),
                            sdk.api.automation_triggers.deleteOne(smsTrigger.id),
                            sdk.api.automation_triggers.deleteOne(chatTrigger.id),
                        ])];
                case 19:
                    // Cleanup test triggers
                    _j.sent();
                    console.log("Cleaned up test triggers");
                    // Cleanup test patients  
                    return [4 /*yield*/, Promise.all([
                            sdk.api.endusers.deleteOne(emailPatient.id),
                            sdk.api.endusers.deleteOne(smsPatient.id),
                            sdk.api.endusers.deleteOne(chatPatient.id),
                        ])];
                case 20:
                    // Cleanup test patients  
                    _j.sent();
                    console.log("Cleaned up test patients");
                    return [2 /*return*/, { success: true, results: { emailAssigned: emailAssigned, smsAssigned: smsAssigned, chatAssigned: chatAssigned, outboundNotAssigned: outboundNotAssigned } }];
                case 21:
                    _j.trys.push([21, 23, , 24]);
                    cleanupPromises = [];
                    if (emailTrigger === null || emailTrigger === void 0 ? void 0 : emailTrigger.id)
                        cleanupPromises.push(sdk.api.automation_triggers.deleteOne(emailTrigger.id).catch(function () { }));
                    if (smsTrigger === null || smsTrigger === void 0 ? void 0 : smsTrigger.id)
                        cleanupPromises.push(sdk.api.automation_triggers.deleteOne(smsTrigger.id).catch(function () { }));
                    if (chatTrigger === null || chatTrigger === void 0 ? void 0 : chatTrigger.id)
                        cleanupPromises.push(sdk.api.automation_triggers.deleteOne(chatTrigger.id).catch(function () { }));
                    if (emailPatient === null || emailPatient === void 0 ? void 0 : emailPatient.id)
                        cleanupPromises.push(sdk.api.endusers.deleteOne(emailPatient.id).catch(function () { }));
                    if (smsPatient === null || smsPatient === void 0 ? void 0 : smsPatient.id)
                        cleanupPromises.push(sdk.api.endusers.deleteOne(smsPatient.id).catch(function () { }));
                    if (chatPatient === null || chatPatient === void 0 ? void 0 : chatPatient.id)
                        cleanupPromises.push(sdk.api.endusers.deleteOne(chatPatient.id).catch(function () { }));
                    return [4 /*yield*/, Promise.all(cleanupPromises)];
                case 22:
                    _j.sent();
                    console.log("Final cleanup completed");
                    return [3 /*break*/, 24];
                case 23:
                    error_1 = _j.sent();
                    console.error("Cleanup error: ".concat(error_1));
                    return [3 /*break*/, 24];
                case 24: return [7 /*endfinally*/];
                case 25: return [2 /*return*/];
            }
        });
    });
};
exports.message_assignment_trigger_tests = message_assignment_trigger_tests;
// Allow running this test file independently
if (require.main === module) {
    var host = process.env.API_URL || 'http://localhost:8080';
    console.log("\uD83C\uDF10 Using API URL: ".concat(host));
    var sdk_2 = new sdk_1.Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, setup_1.setup_tests)(sdk_2, sdk_2)]; // Use same SDK for both admin and non-admin (simplified for this test)
                case 1:
                    _a.sent(); // Use same SDK for both admin and non-admin (simplified for this test)
                    return [4 /*yield*/, (0, exports.message_assignment_trigger_tests)({ sdk: sdk_2 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Message assignment trigger tests completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Message assignment trigger tests failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=message_assignment_trigger.test.js.map