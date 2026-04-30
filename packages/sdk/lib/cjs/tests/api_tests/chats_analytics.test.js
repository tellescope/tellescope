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
exports.chats_analytics_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || 'http://localhost:8080';
var totalFromValues = function (r) { var _a; return ((_a = r.values) !== null && _a !== void 0 ? _a : []).reduce(function (sum, v) { return sum + v.value; }, 0); };
var chats_analytics_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var testEnduser, chatRoom, inboundChat, outboundChat, bothTagsChat, now, dayStart, dayEnd, baseQuery, createdRange;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("Chats Analytics Tests");
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'ChatsAnalytics',
                            lname: 'TestUser',
                            email: 'chats-analytics-test@example.com',
                        })];
                case 1:
                    testEnduser = _b.sent();
                    return [4 /*yield*/, sdk.api.chat_rooms.createOne({
                            enduserIds: [testEnduser.id],
                        })
                        // Inbound chat (senderId === enduserId), tagged with 'tag-a'
                    ];
                case 2:
                    chatRoom = _b.sent();
                    return [4 /*yield*/, sdk.api.chats.createOne({
                            roomId: chatRoom.id,
                            message: "Inbound message from enduser",
                            senderId: testEnduser.id,
                            enduserId: testEnduser.id,
                            tags: ['tag-a'],
                        })
                        // Outbound chat (senderId !== enduserId), tagged with 'tag-b'
                    ];
                case 3:
                    inboundChat = _b.sent();
                    return [4 /*yield*/, sdk.api.chats.createOne({
                            roomId: chatRoom.id,
                            message: "Outbound message from provider",
                            senderId: sdk.userInfo.id,
                            enduserId: testEnduser.id,
                            tags: ['tag-b'],
                        })
                        // Inbound chat with both tags
                    ];
                case 4:
                    outboundChat = _b.sent();
                    return [4 /*yield*/, sdk.api.chats.createOne({
                            roomId: chatRoom.id,
                            message: "Inbound message with both tags",
                            senderId: testEnduser.id,
                            enduserId: testEnduser.id,
                            tags: ['tag-a', 'tag-b'],
                        })];
                case 5:
                    bothTagsChat = _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 1000)];
                case 6:
                    _b.sent();
                    now = new Date();
                    dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
                    baseQuery = {
                        resource: 'Chats',
                        info: { method: 'Total', parameters: undefined },
                        range: { interval: 'Daily', key: 'Created At' },
                    };
                    createdRange = { from: dayStart, to: dayEnd };
                    _b.label = 7;
                case 7:
                    _b.trys.push([7, , 15, 21]);
                    // Test 1: Total count with no filter
                    return [4 /*yield*/, (0, testing_1.async_test)("Chats analytics - total count (no filter)", function () { return sdk.api.analytics_frames.get_result_for_query({
                            query: __assign({}, baseQuery),
                            createdRange: createdRange,
                        }); }, { onResult: function (r) { return totalFromValues(r) === 3; } })
                        // Test 2: Direction = Inbound (senderId === enduserId)
                    ];
                case 8:
                    // Test 1: Total count with no filter
                    _b.sent();
                    // Test 2: Direction = Inbound (senderId === enduserId)
                    return [4 /*yield*/, (0, testing_1.async_test)("Chats analytics - direction Inbound", function () { return sdk.api.analytics_frames.get_result_for_query({
                            query: __assign(__assign({}, baseQuery), { filter: { direction: 'Inbound' } }),
                            createdRange: createdRange,
                        }); }, { onResult: function (r) { return totalFromValues(r) === 2; } })
                        // Test 3: Direction = Outbound (senderId !== enduserId)
                    ];
                case 9:
                    // Test 2: Direction = Inbound (senderId === enduserId)
                    _b.sent();
                    // Test 3: Direction = Outbound (senderId !== enduserId)
                    return [4 /*yield*/, (0, testing_1.async_test)("Chats analytics - direction Outbound", function () { return sdk.api.analytics_frames.get_result_for_query({
                            query: __assign(__assign({}, baseQuery), { filter: { direction: 'Outbound' } }),
                            createdRange: createdRange,
                        }); }, { onResult: function (r) { return totalFromValues(r) === 1; } })
                        // Test 4: Chat Tags - One Of qualifier
                    ];
                case 10:
                    // Test 3: Direction = Outbound (senderId !== enduserId)
                    _b.sent();
                    // Test 4: Chat Tags - One Of qualifier
                    return [4 /*yield*/, (0, testing_1.async_test)("Chats analytics - Chat Tags One Of", function () { return sdk.api.analytics_frames.get_result_for_query({
                            query: __assign(__assign({}, baseQuery), { filter: { 'Chat Tags': { qualifier: 'One Of', values: ['tag-a'] } } }),
                            createdRange: createdRange,
                        }); }, { onResult: function (r) { return totalFromValues(r) === 2; } })
                        // Test 5: Chat Tags - All Of qualifier
                    ];
                case 11:
                    // Test 4: Chat Tags - One Of qualifier
                    _b.sent();
                    // Test 5: Chat Tags - All Of qualifier
                    return [4 /*yield*/, (0, testing_1.async_test)("Chats analytics - Chat Tags All Of", function () { return sdk.api.analytics_frames.get_result_for_query({
                            query: __assign(__assign({}, baseQuery), { filter: { 'Chat Tags': { qualifier: 'All Of', values: ['tag-a', 'tag-b'] } } }),
                            createdRange: createdRange,
                        }); }, { onResult: function (r) { return totalFromValues(r) === 1; } })
                        // Test 6: Combined direction + tags filter
                    ];
                case 12:
                    // Test 5: Chat Tags - All Of qualifier
                    _b.sent();
                    // Test 6: Combined direction + tags filter
                    return [4 /*yield*/, (0, testing_1.async_test)("Chats analytics - Inbound + Chat Tags", function () { return sdk.api.analytics_frames.get_result_for_query({
                            query: __assign(__assign({}, baseQuery), { filter: {
                                    direction: 'Inbound',
                                    'Chat Tags': { qualifier: 'One Of', values: ['tag-b'] },
                                } }),
                            createdRange: createdRange,
                        }); }, { onResult: function (r) { return totalFromValues(r) === 1; } })
                        // Test 7: Chat Tags grouping
                    ];
                case 13:
                    // Test 6: Combined direction + tags filter
                    _b.sent();
                    // Test 7: Chat Tags grouping
                    return [4 /*yield*/, (0, testing_1.async_test)("Chats analytics - Chat Tags grouping", function () { return sdk.api.analytics_frames.get_result_for_query({
                            query: __assign(__assign({}, baseQuery), { grouping: { 'Chat Tags': true, Enduser: '' } }),
                            createdRange: createdRange,
                        }); }, { onResult: function (r) {
                                var _a;
                                if (!((_a = r.values) === null || _a === void 0 ? void 0 : _a.length))
                                    return false;
                                // Grouping by tags returns entries keyed by the full tags array on each chat
                                // We expect entries for each unique tag combination, with total values summing to 3
                                var total = r.values.reduce(function (sum, v) { return sum + v.value; }, 0);
                                var hasGroupKeys = r.values.some(function (v) { return v.key !== undefined; });
                                return total === 3 && hasGroupKeys;
                            } })];
                case 14:
                    // Test 7: Chat Tags grouping
                    _b.sent();
                    console.log("All chats analytics tests passed");
                    return [3 /*break*/, 21];
                case 15: return [4 /*yield*/, sdk.api.chats.deleteOne(inboundChat.id)];
                case 16:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.chats.deleteOne(outboundChat.id)];
                case 17:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.chats.deleteOne(bothTagsChat.id)];
                case 18:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.chat_rooms.deleteOne(chatRoom.id)];
                case 19:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(testEnduser.id)];
                case 20:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 21: return [2 /*return*/];
            }
        });
    });
};
exports.chats_analytics_tests = chats_analytics_tests;
if (require.main === module) {
    console.log("Using API URL: ".concat(host));
    var sdk_2 = new sdk_1.Session({ host: host });
    var sdkNonAdmin_1 = new sdk_1.Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, setup_1.setup_tests)(sdk_2, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, exports.chats_analytics_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("Chats analytics test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("Chats analytics test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=chats_analytics.test.js.map