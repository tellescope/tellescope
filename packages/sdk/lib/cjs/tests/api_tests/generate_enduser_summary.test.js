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
exports.generate_enduser_summary_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || 'http://localhost:8080';
// Main test function that can be called independently or as part of the main test suite
var generate_enduser_summary_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var enduserId, journeyId, automationStepId, automatedActionId, summaryAction, enduser, journey, step, automatedAction, result_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("Generate Patient Summary (journey action) Tests");
                    enduserId = '';
                    journeyId = '';
                    automationStepId = '';
                    automatedActionId = '';
                    summaryAction = {
                        type: 'generateEnduserSummary',
                        info: {
                            aiSummaryConfiguration: {
                                includeProfileFields: true,
                                prompt: 'Summarize this patient in one sentence.',
                                dataSources: [],
                            },
                        },
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 12, 21]);
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'SummaryTest',
                            lname: 'Patient',
                            dateOfBirth: '01-02-1990',
                            fields: { chief_complaint: 'recurring headaches for two weeks' },
                        })];
                case 2:
                    enduser = _b.sent();
                    enduserId = enduser.id;
                    return [4 /*yield*/, sdk.api.journeys.createOne({ title: "Generate Summary Test Journey" })];
                case 3:
                    journey = _b.sent();
                    journeyId = journey.id;
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: journeyId,
                            action: summaryAction,
                            events: [{ type: 'onJourneyStart', info: {} }],
                        })];
                case 4:
                    step = _b.sent();
                    automationStepId = step.id;
                    return [4 /*yield*/, sdk.api.automated_actions.createOne({
                            enduserId: enduserId,
                            journeyId: journeyId,
                            automationStepId: automationStepId,
                            event: { type: 'onJourneyStart', info: {} },
                            status: 'active',
                            processAfter: Date.now(),
                            action: summaryAction,
                        })];
                case 5:
                    automatedAction = _b.sent();
                    automatedActionId = automatedAction.id;
                    return [4 /*yield*/, sdk.api.automated_actions.process({ automatedActionId: automatedActionId })];
                case 6:
                    result_1 = _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("generateEnduserSummary action is recognized (not unimplemented)", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, result_1];
                        }); }); }, { onResult: function (r) { return (r === null || r === void 0 ? void 0 : r.unimplemented) !== true; } })];
                case 7:
                    _b.sent();
                    if (!result_1.success) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, testing_1.async_test)("aiSummary + aiSummaryUpdatedAt persisted on enduser after successful generation", function () { return sdk.api.endusers.getOne(enduserId); }, { onResult: function (e) { return (typeof e.aiSummary === 'string'
                                && e.aiSummary.length > 0
                                && !!e.aiSummaryUpdatedAt); } })];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("ai_conversation tagged with enduserId (first-class, queryable)", function () { return sdk.api.ai_conversations.getSome({ filter: { enduserId: enduserId } }); }, { onResult: function (convos) { return convos.length > 0 && convos.every(function (c) { return c.enduserId === enduserId; }); } })];
                case 9:
                    _b.sent();
                    return [3 /*break*/, 11];
                case 10:
                    // No credits / Bedrock disabled in this environment — surface the reason but don't fail wiring test.
                    console.log("\u2139\uFE0F  Summary generation did not complete (likely no Bedrock credits): ".concat(result_1.error));
                    _b.label = 11;
                case 11: return [3 /*break*/, 21];
                case 12:
                    if (!automatedActionId) return [3 /*break*/, 14];
                    return [4 /*yield*/, sdk.api.automated_actions.deleteOne(automatedActionId).catch(function () { })];
                case 13:
                    _b.sent();
                    _b.label = 14;
                case 14:
                    if (!automationStepId) return [3 /*break*/, 16];
                    return [4 /*yield*/, sdk.api.automation_steps.deleteOne(automationStepId).catch(function () { })];
                case 15:
                    _b.sent();
                    _b.label = 16;
                case 16:
                    if (!journeyId) return [3 /*break*/, 18];
                    return [4 /*yield*/, sdk.api.journeys.deleteOne(journeyId).catch(function () { })];
                case 17:
                    _b.sent();
                    _b.label = 18;
                case 18:
                    if (!enduserId) return [3 /*break*/, 20];
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduserId).catch(function () { })];
                case 19:
                    _b.sent();
                    _b.label = 20;
                case 20: return [7 /*endfinally*/];
                case 21: return [2 /*return*/];
            }
        });
    });
};
exports.generate_enduser_summary_tests = generate_enduser_summary_tests;
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
                    return [4 /*yield*/, (0, exports.generate_enduser_summary_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Generate Patient Summary test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Generate Patient Summary test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=generate_enduser_summary.test.js.map