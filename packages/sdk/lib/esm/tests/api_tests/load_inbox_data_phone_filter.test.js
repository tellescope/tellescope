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
import { async_test, log_header, } from "@tellescope/testing";
var host = process.env.TEST_URL || 'http://localhost:8080';
var _a = [process.env.TEST_EMAIL, process.env.TEST_PASSWORD], email = _a[0], password = _a[1];
if (!(email && password)) {
    console.error("Set TEST_EMAIL and TEST_PASSWORD");
    process.exit();
}
var sdk = new Session({ host: host });
// Main test function that can be called independently
export var load_inbox_data_phone_filter_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var testEnduser, testPhone1, testPhone2, createdRecords, smsWithPhone1_1, smsWithPhone2_1, smsViaEnduserPhone_1, inboundCallToPhone1_1, inboundCallToPhone2_1, outboundCallFromPhone1_1, outboundCallFromPhone2_1, testEmail_1, testChatRoom_1, _i, _a, smsId, _b, _c, callId, error_1, deleteError_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                log_header("Load Inbox Data Phone Number Filter Tests");
                // Authenticate
                return [4 /*yield*/, sdk.authenticate(email, password)
                    // Create test enduser
                ];
            case 1:
                // Authenticate
                _d.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({})
                    // Test phone numbers
                ];
            case 2:
                testEnduser = _d.sent();
                testPhone1 = '+15555555551';
                testPhone2 = '+15555555552';
                createdRecords = { sms: [], calls: [] };
                _d.label = 3;
            case 3:
                _d.trys.push([3, , 23, 39]);
                return [4 /*yield*/, sdk.api.sms_messages.createOne({
                        logOnly: true,
                        inbound: true,
                        enduserId: testEnduser.id,
                        message: 'SMS with phone1',
                        phoneNumber: testPhone1,
                        enduserPhoneNumber: testPhone1,
                    })];
            case 4:
                smsWithPhone1_1 = _d.sent();
                createdRecords.sms.push(smsWithPhone1_1.id);
                return [4 /*yield*/, sdk.api.sms_messages.createOne({
                        logOnly: true,
                        inbound: true,
                        enduserId: testEnduser.id,
                        message: 'SMS with phone2',
                        phoneNumber: testPhone2,
                        enduserPhoneNumber: testPhone2,
                    })];
            case 5:
                smsWithPhone2_1 = _d.sent();
                createdRecords.sms.push(smsWithPhone2_1.id);
                return [4 /*yield*/, sdk.api.sms_messages.createOne({
                        logOnly: true,
                        inbound: true,
                        enduserId: testEnduser.id,
                        message: 'SMS with different phoneNumber but same enduserPhoneNumber',
                        phoneNumber: '+15555555999',
                        enduserPhoneNumber: testPhone1, // same enduserPhoneNumber
                    })];
            case 6:
                smsViaEnduserPhone_1 = _d.sent();
                createdRecords.sms.push(smsViaEnduserPhone_1.id);
                return [4 /*yield*/, sdk.api.phone_calls.createOne({
                        enduserId: testEnduser.id,
                        inbound: true,
                        from: '+15555555999',
                        to: testPhone1
                    })];
            case 7:
                inboundCallToPhone1_1 = _d.sent();
                createdRecords.calls.push(inboundCallToPhone1_1.id);
                return [4 /*yield*/, sdk.api.phone_calls.createOne({
                        enduserId: testEnduser.id,
                        inbound: true,
                        from: '+15555555999',
                        to: testPhone2
                    })];
            case 8:
                inboundCallToPhone2_1 = _d.sent();
                createdRecords.calls.push(inboundCallToPhone2_1.id);
                return [4 /*yield*/, sdk.api.phone_calls.createOne({
                        enduserId: testEnduser.id,
                        inbound: false,
                        from: testPhone1,
                        to: '+15555555888'
                    })];
            case 9:
                outboundCallFromPhone1_1 = _d.sent();
                createdRecords.calls.push(outboundCallFromPhone1_1.id);
                return [4 /*yield*/, sdk.api.phone_calls.createOne({
                        enduserId: testEnduser.id,
                        inbound: false,
                        from: testPhone2,
                        to: '+15555555888'
                    })];
            case 10:
                outboundCallFromPhone2_1 = _d.sent();
                createdRecords.calls.push(outboundCallFromPhone2_1.id);
                return [4 /*yield*/, sdk.api.emails.createOne({
                        logOnly: true,
                        inbound: true,
                        enduserId: testEnduser.id,
                        subject: 'Test email for phone filter test',
                        textContent: 'Should not be filtered by phoneNumber'
                    })];
            case 11:
                testEmail_1 = _d.sent();
                return [4 /*yield*/, sdk.api.chat_rooms.createOne({
                        enduserIds: [testEnduser.id],
                        userIds: [],
                        title: 'Test Chat Room for phone filter'
                    })
                    // Test 1: SMS filtering by phoneNumber (phoneNumber field)
                ];
            case 12:
                testChatRoom_1 = _d.sent();
                // Test 1: SMS filtering by phoneNumber (phoneNumber field)
                return [4 /*yield*/, async_test('Inbox filters SMS messages by phoneNumber field', function () { return sdk.api.endusers.load_inbox_data({ phoneNumber: testPhone1 }); }, { onResult: function (r) { return (r.sms_messages.length === 2 // both smsWithPhone1 and smsViaEnduserPhone should match
                            && r.sms_messages.some(function (sms) { return sms.id === smsWithPhone1_1.id; })
                            && r.sms_messages.some(function (sms) { return sms.id === smsViaEnduserPhone_1.id; })
                            && !r.sms_messages.some(function (sms) { return sms.id === smsWithPhone2_1.id; })); } })
                    // Test 2: SMS filtering by phoneNumber (enduserPhoneNumber field)  
                ];
            case 13:
                // Test 1: SMS filtering by phoneNumber (phoneNumber field)
                _d.sent();
                // Test 2: SMS filtering by phoneNumber (enduserPhoneNumber field)  
                return [4 /*yield*/, async_test('Inbox filters SMS messages by enduserPhoneNumber field', function () { return sdk.api.endusers.load_inbox_data({ phoneNumber: testPhone2 }); }, { onResult: function (r) { return (r.sms_messages.length === 1
                            && r.sms_messages[0].id === smsWithPhone2_1.id
                            && !r.sms_messages.some(function (sms) { return sms.id === smsWithPhone1_1.id; })
                            && !r.sms_messages.some(function (sms) { return sms.id === smsViaEnduserPhone_1.id; })); } })
                    // Test 3: Phone call filtering by phoneNumber (inbound calls by 'to' field)
                ];
            case 14:
                // Test 2: SMS filtering by phoneNumber (enduserPhoneNumber field)  
                _d.sent();
                // Test 3: Phone call filtering by phoneNumber (inbound calls by 'to' field)
                return [4 /*yield*/, async_test('Inbox filters inbound phone calls by to field', function () { return sdk.api.endusers.load_inbox_data({ phoneNumber: testPhone1 }); }, { onResult: function (r) { return (r.phone_calls.some(function (c) { return c.id === inboundCallToPhone1_1.id && c.inbound === true; })
                            && !r.phone_calls.some(function (c) { return c.id === inboundCallToPhone2_1.id; })); } })
                    // Test 4: Phone call filtering by phoneNumber (outbound calls by 'from' field)
                ];
            case 15:
                // Test 3: Phone call filtering by phoneNumber (inbound calls by 'to' field)
                _d.sent();
                // Test 4: Phone call filtering by phoneNumber (outbound calls by 'from' field)
                return [4 /*yield*/, async_test('Inbox filters outbound phone calls by from field', function () { return sdk.api.endusers.load_inbox_data({ phoneNumber: testPhone1 }); }, { onResult: function (r) { return (r.phone_calls.some(function (c) { return c.id === outboundCallFromPhone1_1.id && c.inbound === false; })
                            && !r.phone_calls.some(function (c) { return c.id === outboundCallFromPhone2_1.id; })); } })
                    // Test 5: Phone filtering returns both inbound and outbound calls for same number
                ];
            case 16:
                // Test 4: Phone call filtering by phoneNumber (outbound calls by 'from' field)
                _d.sent();
                // Test 5: Phone filtering returns both inbound and outbound calls for same number
                return [4 /*yield*/, async_test('Inbox returns both inbound and outbound calls for phoneNumber', function () { return sdk.api.endusers.load_inbox_data({ phoneNumber: testPhone1 }); }, { onResult: function (r) { return (r.phone_calls.length === 2 // both inbound to phone1 and outbound from phone1
                            && r.phone_calls.some(function (c) { return c.id === inboundCallToPhone1_1.id; })
                            && r.phone_calls.some(function (c) { return c.id === outboundCallFromPhone1_1.id; })); } })
                    // Test 6: phoneNumber filter does not affect other communication types
                ];
            case 17:
                // Test 5: Phone filtering returns both inbound and outbound calls for same number
                _d.sent();
                // Test 6: phoneNumber filter does not affect other communication types
                return [4 /*yield*/, async_test('Inbox phoneNumber filter does not affect emails and chat rooms', function () { return sdk.api.endusers.load_inbox_data({ phoneNumber: testPhone1 }); }, { onResult: function (r) { return (r.emails.some(function (email) { return email.id === testEmail_1.id; }) // emails should not be filtered
                            && r.chat_rooms.some(function (room) { return room.id === testChatRoom_1.id; }) // chat rooms should not be filtered
                        ); } })
                    // Test 7: Nonexistent phoneNumber returns no SMS or phone calls
                ];
            case 18:
                // Test 6: phoneNumber filter does not affect other communication types
                _d.sent();
                // Test 7: Nonexistent phoneNumber returns no SMS or phone calls
                return [4 /*yield*/, async_test('Inbox with nonexistent phoneNumber returns no SMS or phone calls', function () { return sdk.api.endusers.load_inbox_data({ phoneNumber: '+15555559999' }); }, { onResult: function (r) { return (r.sms_messages.length === 0
                            && r.phone_calls.length === 0
                            && r.emails.some(function (email) { return email.id === testEmail_1.id; }) // other types should still be returned
                        ); } })
                    // Test 8: No phoneNumber parameter returns all records (backward compatibility)
                ];
            case 19:
                // Test 7: Nonexistent phoneNumber returns no SMS or phone calls
                _d.sent();
                // Test 8: No phoneNumber parameter returns all records (backward compatibility)
                return [4 /*yield*/, async_test('Inbox without phoneNumber parameter returns all records', function () { return sdk.api.endusers.load_inbox_data({}); }, { onResult: function (r) { return (r.sms_messages.length >= 3 // all SMS messages should be returned
                            && r.phone_calls.length >= 4 // all phone calls should be returned
                            && r.emails.some(function (email) { return email.id === testEmail_1.id; })
                            && r.chat_rooms.some(function (room) { return room.id === testChatRoom_1.id; })); } })
                    // Test 9: phoneNumber filter works with other filters (enduserIds)
                ];
            case 20:
                // Test 8: No phoneNumber parameter returns all records (backward compatibility)
                _d.sent();
                // Test 9: phoneNumber filter works with other filters (enduserIds)
                return [4 /*yield*/, async_test('Inbox phoneNumber filter works with enduserIds filter', function () { return sdk.api.endusers.load_inbox_data({
                        phoneNumber: testPhone1,
                        enduserIds: [testEnduser.id]
                    }); }, { onResult: function (r) { return (r.sms_messages.length === 2 // SMS messages for testPhone1
                            && r.phone_calls.length === 2 // Phone calls for testPhone1
                            && r.endusers.length === 1 // Only one enduser
                            && r.endusers[0].id === testEnduser.id); } })
                    // Test 10: Empty phoneNumber string behaves like no filter
                ];
            case 21:
                // Test 9: phoneNumber filter works with other filters (enduserIds)
                _d.sent();
                // Test 10: Empty phoneNumber string behaves like no filter
                return [4 /*yield*/, async_test('Inbox with empty phoneNumber string returns all records', function () { return sdk.api.endusers.load_inbox_data({ phoneNumber: '' }); }, { onResult: function (r) { return (r.sms_messages.length >= 3 // all SMS messages should be returned
                            && r.phone_calls.length >= 4 // all phone calls should be returned
                        ); } })];
            case 22:
                // Test 10: Empty phoneNumber string behaves like no filter
                _d.sent();
                console.log("✅ All Load Inbox Data Phone Number Filter tests passed!");
                return [3 /*break*/, 39];
            case 23:
                _d.trys.push([23, 33, , 38]);
                _i = 0, _a = createdRecords.sms;
                _d.label = 24;
            case 24:
                if (!(_i < _a.length)) return [3 /*break*/, 27];
                smsId = _a[_i];
                return [4 /*yield*/, sdk.api.sms_messages.deleteOne(smsId)];
            case 25:
                _d.sent();
                _d.label = 26;
            case 26:
                _i++;
                return [3 /*break*/, 24];
            case 27:
                _b = 0, _c = createdRecords.calls;
                _d.label = 28;
            case 28:
                if (!(_b < _c.length)) return [3 /*break*/, 31];
                callId = _c[_b];
                return [4 /*yield*/, sdk.api.phone_calls.deleteOne(callId)];
            case 29:
                _d.sent();
                _d.label = 30;
            case 30:
                _b++;
                return [3 /*break*/, 28];
            case 31: 
            // Delete enduser (this will cascade delete related records)
            return [4 /*yield*/, sdk.api.endusers.deleteOne(testEnduser.id)];
            case 32:
                // Delete enduser (this will cascade delete related records)
                _d.sent();
                return [3 /*break*/, 38];
            case 33:
                error_1 = _d.sent();
                console.error('Cleanup error:', error_1);
                _d.label = 34;
            case 34:
                _d.trys.push([34, 36, , 37]);
                return [4 /*yield*/, sdk.api.endusers.deleteOne(testEnduser.id)];
            case 35:
                _d.sent();
                return [3 /*break*/, 37];
            case 36:
                deleteError_1 = _d.sent();
                console.error("Failed to delete test enduser ".concat(testEnduser.id, ":"), deleteError_1);
                return [3 /*break*/, 37];
            case 37: return [3 /*break*/, 38];
            case 38: return [7 /*endfinally*/];
            case 39: return [2 /*return*/];
        }
    });
}); };
// Allow running this test file independently
if (require.main === module) {
    load_inbox_data_phone_filter_tests()
        .then(function () {
        console.log("✅ Phone number filter test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Phone number filter test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=load_inbox_data_phone_filter.test.js.map