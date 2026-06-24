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
exports.ai_decision_summary_config_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || 'http://localhost:8080';
/**
 * Exercises generate_ai_decision with the new `aiSummaryConfiguration` payload (CU-86e1h0j7f).
 *
 * The handler responds early with `{}` and then builds context + calls Bedrock in the background,
 * so the deterministic, Bedrock-independent assertions here are:
 *   1. A valid `aiSummaryConfiguration` payload is accepted (schema + validator wiring) → resolves.
 *   2. The legacy `{ prompt, sources }` payload still validates (back-compat) → resolves.
 *   3. A malformed `aiSummaryConfiguration` (invalid data source type) is rejected by the validator
 *      BEFORE the early response → throws.
 */
var ai_decision_summary_config_tests = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var enduser, journey, decisionStep;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("AI Decision — aiSummaryConfiguration payload");
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'AIDecision',
                            lname: 'Config',
                            email: "ai-decision-config-".concat(Date.now(), "@example.com"),
                        })];
                case 1:
                    enduser = _b.sent();
                    return [4 /*yield*/, sdk.api.journeys.createOne({ title: "AI Decision Config Journey ".concat(Date.now()) })
                        // a real aiDecision step using the new shared config shape
                    ];
                case 2:
                    journey = _b.sent();
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: journey.id,
                            action: {
                                type: 'aiDecision',
                                info: {
                                    outcomes: ['needs_followup', 'no_action'],
                                    aiSummaryConfiguration: {
                                        prompt: 'Decide whether the patient needs a follow-up based on recent activity.',
                                        dataSources: [
                                            { type: 'sms_messages', limit: 5, lookbackMS: 30 * 24 * 60 * 60 * 1000 },
                                            { type: 'chats', limit: 5 },
                                            { type: 'form_responses', limit: 3 },
                                        ],
                                    },
                                },
                            },
                            events: [{ type: 'onJourneyStart', info: {} }],
                        })];
                case 3:
                    decisionStep = _b.sent();
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, , 8, 10]);
                    // 1. valid new-shape payload — handler accepts and returns early with {}
                    return [4 /*yield*/, (0, testing_1.async_test)("generate_ai_decision accepts aiSummaryConfiguration payload", function () { return sdk.api.ai_conversations.generate_ai_decision({
                            enduserId: enduser.id,
                            automationStepId: decisionStep.id,
                            outcomes: ['needs_followup', 'no_action'],
                            aiSummaryConfiguration: {
                                prompt: 'Decide whether the patient needs a follow-up based on recent activity.',
                                dataSources: [
                                    { type: 'sms_messages', limit: 5, lookbackMS: 30 * 24 * 60 * 60 * 1000 },
                                    { type: 'chats', limit: 5 },
                                ],
                                maxOutputTokens: 50,
                            },
                        }); }, { onResult: function () { return true; } })
                        // 2. legacy payload still validates (back-compat)
                    ];
                case 5:
                    // 1. valid new-shape payload — handler accepts and returns early with {}
                    _b.sent();
                    // 2. legacy payload still validates (back-compat)
                    return [4 /*yield*/, (0, testing_1.async_test)("generate_ai_decision still accepts legacy prompt/sources payload", function () { return sdk.api.ai_conversations.generate_ai_decision({
                            enduserId: enduser.id,
                            automationStepId: decisionStep.id,
                            outcomes: ['needs_followup', 'no_action'],
                            prompt: 'Legacy decision prompt',
                            sources: [{ type: 'SMS', limit: 3 }],
                        }); }, { onResult: function () { return true; } })
                        // 3. malformed aiSummaryConfiguration (invalid data source type) rejected by the validator
                    ];
                case 6:
                    // 2. legacy payload still validates (back-compat)
                    _b.sent();
                    // 3. malformed aiSummaryConfiguration (invalid data source type) rejected by the validator
                    return [4 /*yield*/, (0, testing_1.async_test)("generate_ai_decision rejects an invalid aiSummaryConfiguration data source", function () { return sdk.api.ai_conversations.generate_ai_decision({
                            enduserId: enduser.id,
                            automationStepId: decisionStep.id,
                            outcomes: ['needs_followup', 'no_action'],
                            aiSummaryConfiguration: {
                                prompt: 'bad config',
                                dataSources: [{ type: 'not_a_real_source', limit: 1 }],
                            },
                        }); }, { shouldError: true, onError: function () { return true; } })];
                case 7:
                    // 3. malformed aiSummaryConfiguration (invalid data source type) rejected by the validator
                    _b.sent();
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, Promise.all([
                        sdk.api.journeys.deleteOne(journey.id).catch(function () { }),
                        sdk.api.endusers.deleteOne(enduser.id).catch(function () { }),
                    ])];
                case 9:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 10:
                    console.log("✅ AI Decision aiSummaryConfiguration tests completed successfully");
                    return [2 /*return*/];
            }
        });
    });
};
exports.ai_decision_summary_config_tests = ai_decision_summary_config_tests;
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
                    return [4 /*yield*/, (0, exports.ai_decision_summary_config_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ AI Decision aiSummaryConfiguration test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ AI Decision aiSummaryConfiguration test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=ai_decision_summary_config.test.js.map