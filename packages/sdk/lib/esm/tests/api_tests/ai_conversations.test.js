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
import { setup_tests } from "../setup";
var host = process.env.API_URL || 'http://localhost:8080';
// Main test function that can be called independently or as part of the main test suite
export var ai_conversations_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var testRunId, testOrchestrationId, testMessage, conversation, appendedMessage, conversation2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_header("AI Conversations Tests");
                    testRunId = Date.now().toString();
                    testOrchestrationId = "test-orchestration-".concat(testRunId);
                    testMessage = {
                        role: 'user',
                        text: 'Hello, this is a test message',
                        timestamp: new Date(),
                        tokens: 10,
                    };
                    return [4 /*yield*/, sdk.api.ai_conversations.createOne({
                            type: 'test-conversation',
                            modelName: 'test-model',
                            messages: [testMessage],
                        })];
                case 1:
                    conversation = _b.sent();
                    return [4 /*yield*/, async_test("AIConversation created successfully", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, conversation];
                        }); }); }, { onResult: function (c) { return (c.id !== undefined
                                && c.type === 'test-conversation'
                                && c.modelName === 'test-model'
                                && c.messages.length === 1
                                && c.messages[0].text === testMessage.text); } })
                        // Test 2: Read the created AIConversation
                    ];
                case 2:
                    _b.sent();
                    // Test 2: Read the created AIConversation
                    return [4 /*yield*/, async_test("AIConversation can be read", function () { return sdk.api.ai_conversations.getOne(conversation.id); }, { onResult: function (c) { return (c.id === conversation.id
                                && c.type === 'test-conversation'
                                && c.messages.length === 1); } })
                        // Test 3: Update by appending messages (without replaceObjectFields)
                    ];
                case 3:
                    // Test 2: Read the created AIConversation
                    _b.sent();
                    appendedMessage = {
                        role: 'assistant',
                        text: 'This is an appended response',
                        timestamp: new Date(),
                        tokens: 15,
                    };
                    return [4 /*yield*/, async_test("AIConversation update appends messages (without replaceObjectFields)", function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.ai_conversations.updateOne(conversation.id, {
                                            messages: [appendedMessage],
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/, sdk.api.ai_conversations.getOne(conversation.id)];
                                }
                            });
                        }); }, { onResult: function (c) { return (c.messages.length === 2
                                && c.messages[0].text === testMessage.text
                                && c.messages[1].text === appendedMessage.text); } })
                        // Test 4: Verify replaceObjectFields: true is blocked
                    ];
                case 4:
                    _b.sent();
                    // Test 4: Verify replaceObjectFields: true is blocked
                    return [4 /*yield*/, async_test("AIConversation update with replaceObjectFields: true is blocked", function () { return sdk.api.ai_conversations.updateOne(conversation.id, { messages: [appendedMessage] }, { replaceObjectFields: true }); }, {
                            shouldError: true,
                            onError: function (e) {
                                var _a, _b;
                                return (((_a = e.message) === null || _a === void 0 ? void 0 : _a.includes('replaceObjectFields: true are not allowed'))
                                    || ((_b = e.message) === null || _b === void 0 ? void 0 : _b.includes('replaceObjectFields')));
                            }
                        })
                        // Test 5: Verify messages are still intact after blocked update attempt
                    ];
                case 5:
                    // Test 4: Verify replaceObjectFields: true is blocked
                    _b.sent();
                    // Test 5: Verify messages are still intact after blocked update attempt
                    return [4 /*yield*/, async_test("AIConversation messages preserved after blocked replaceObjectFields attempt", function () { return sdk.api.ai_conversations.getOne(conversation.id); }, { onResult: function (c) { return (c.messages.length === 2
                                && c.messages[0].text === testMessage.text
                                && c.messages[1].text === appendedMessage.text); } })
                        // Test 6: Can set orchestrationId via update
                    ];
                case 6:
                    // Test 5: Verify messages are still intact after blocked update attempt
                    _b.sent();
                    // Test 6: Can set orchestrationId via update
                    return [4 /*yield*/, async_test("AIConversation orchestrationId can be set via update", function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.ai_conversations.updateOne(conversation.id, {
                                            orchestrationId: testOrchestrationId,
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/, sdk.api.ai_conversations.getOne(conversation.id)];
                                }
                            });
                        }); }, { onResult: function (c) { return c.orchestrationId === testOrchestrationId; } })
                        // Test 7: Multiple conversations with same orchestrationId can be queried
                    ];
                case 7:
                    // Test 6: Can set orchestrationId via update
                    _b.sent();
                    return [4 /*yield*/, sdk.api.ai_conversations.createOne({
                            type: 'test-conversation-2',
                            modelName: 'test-model',
                            messages: [testMessage],
                            orchestrationId: testOrchestrationId,
                        })];
                case 8:
                    conversation2 = _b.sent();
                    return [4 /*yield*/, async_test("AIConversations can be queried by orchestrationId", function () { return sdk.api.ai_conversations.getSome({ filter: { orchestrationId: testOrchestrationId } }); }, { onResult: function (conversations) { return (conversations.length === 2
                                && conversations.some(function (c) { return c.id === conversation.id; })
                                && conversations.some(function (c) { return c.id === conversation2.id; })); } })
                        // Note: delete is not enabled for ai_conversations, so no cleanup is performed
                        // Test data will persist but is identifiable by 'test-' prefixes
                    ];
                case 9:
                    _b.sent();
                    return [2 /*return*/];
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
                    return [4 /*yield*/, ai_conversations_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ AI Conversations test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ AI Conversations test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=ai_conversations.test.js.map