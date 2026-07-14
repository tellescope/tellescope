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
import { Session } from '../../sdk';
import { log_header, wait } from "@tellescope/testing";
import { AUTOMATED_ACTION_CANCEL_REASONS } from "@tellescope/constants";
var host = process.env.API_URL || 'http://localhost:8080';
export var journey_delete_cancels_actions_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var journeyId, enduserId, stepId, journey, step, enduser_1, activeAction_1, finishedAction_1, before, expectedReason_1, finishedAfter;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_header("Journey Delete Cancels Pending Actions Tests");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 11, 13]);
                    return [4 /*yield*/, sdk.api.journeys.createOne({ title: "Cascade Cancel Journey " + Date.now() })];
                case 2:
                    journey = _b.sent();
                    journeyId = journey.id;
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: journey.id,
                            action: { type: 'setEnduserStatus', info: { status: 'Test Status' } },
                            events: [{ type: 'onJourneyStart', info: {} }],
                        })];
                case 3:
                    step = _b.sent();
                    stepId = step.id;
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'Cascade',
                            lname: 'Cancel',
                            email: 'test-cascade-cancel-' + Date.now() + '@example.com',
                        })];
                case 4:
                    enduser_1 = _b.sent();
                    enduserId = enduser_1.id;
                    return [4 /*yield*/, sdk.api.automated_actions.createOne({
                            journeyId: journey.id,
                            automationStepId: step.id,
                            enduserId: enduser_1.id,
                            processAfter: Date.now() + 1000000,
                            status: 'active',
                            event: { type: 'onJourneyStart', info: {} },
                            action: { type: 'setEnduserStatus', info: { status: 'Test Status' } },
                        })
                        // Create a finished action to confirm it is left untouched by the cascade
                    ];
                case 5:
                    activeAction_1 = _b.sent();
                    return [4 /*yield*/, sdk.api.automated_actions.createOne({
                            journeyId: journey.id,
                            automationStepId: step.id,
                            enduserId: enduser_1.id,
                            processAfter: Date.now() + 1000000,
                            status: 'finished',
                            event: { type: 'onJourneyStart', info: {} },
                            action: { type: 'setEnduserStatus', info: { status: 'Test Status' } },
                        })
                        // Assert the action starts active
                    ];
                case 6:
                    finishedAction_1 = _b.sent();
                    return [4 /*yield*/, sdk.api.automated_actions.getOne(activeAction_1.id)];
                case 7:
                    before = _b.sent();
                    if (before.status !== 'active') {
                        throw new Error("Expected action to start 'active', got '".concat(before.status, "'"));
                    }
                    console.log("✓ Action is active before journey deletion");
                    // Delete the journey — this should cascade cancel the pending action
                    return [4 /*yield*/, sdk.api.journeys.deleteOne(journey.id)];
                case 8:
                    // Delete the journey — this should cascade cancel the pending action
                    _b.sent();
                    journeyId = undefined; // already deleted, skip in cleanup
                    expectedReason_1 = AUTOMATED_ACTION_CANCEL_REASONS.indexOf('Journey Deleted');
                    return [4 /*yield*/, pollForResults(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var actions, active, finished;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.automated_actions.getSome({ filter: { enduserId: enduser_1.id } })];
                                    case 1:
                                        actions = _a.sent();
                                        active = actions.find(function (a) { return a.id === activeAction_1.id; });
                                        finished = actions.find(function (a) { return a.id === finishedAction_1.id; });
                                        return [2 /*return*/, { active: active, finished: finished }];
                                }
                            });
                        }); }, function (_a) {
                            var active = _a.active;
                            return ((active === null || active === void 0 ? void 0 : active.status) === 'cancelled'
                                && (active === null || active === void 0 ? void 0 : active.cancelReason) === expectedReason_1
                                && (active === null || active === void 0 ? void 0 : active.cancelledBy) === sdk.userInfo.id);
                        }, 'Active action should be cancelled with Journey Deleted reason and cancelledBy after journey deletion')];
                case 9:
                    _b.sent();
                    console.log("✓ Active action cancelled with Journey Deleted reason and cancelledBy set to deleting user");
                    return [4 /*yield*/, sdk.api.automated_actions.getOne(finishedAction_1.id)];
                case 10:
                    finishedAfter = _b.sent();
                    if (finishedAfter.status !== 'finished') {
                        throw new Error("Expected finished action to remain 'finished', got '".concat(finishedAfter.status, "'"));
                    }
                    console.log("✓ Finished action left untouched");
                    console.log("✅ Journey Delete Cancels Pending Actions tests completed successfully");
                    return [3 /*break*/, 13];
                case 11: 
                // Cleanup — journey is already deleted if the flow completed
                return [4 /*yield*/, Promise.all([
                        enduserId ? sdk.api.endusers.deleteOne(enduserId).catch(function () { }) : undefined,
                        stepId ? sdk.api.automation_steps.deleteOne(stepId).catch(function () { }) : undefined,
                        journeyId ? sdk.api.journeys.deleteOne(journeyId).catch(function () { }) : undefined,
                    ])];
                case 12:
                    // Cleanup — journey is already deleted if the flow completed
                    _b.sent();
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    });
};
var pollForResults = function (fetchFn, evaluateFn, description, intervalMs, maxIterations) {
    if (intervalMs === void 0) { intervalMs = 500; }
    if (maxIterations === void 0) { maxIterations = 30; }
    return __awaiter(void 0, void 0, void 0, function () {
        var lastResult, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < maxIterations)) return [3 /*break*/, 5];
                    return [4 /*yield*/, wait(undefined, intervalMs)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fetchFn()];
                case 3:
                    lastResult = _a.sent();
                    if (evaluateFn(lastResult)) {
                        console.log("\u2713 ".concat(description, " - completed after ").concat((i + 1) * intervalMs, "ms"));
                        return [2 /*return*/];
                    }
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 1];
                case 5:
                    console.log('Final polling result:', lastResult);
                    throw new Error("Polling timeout: ".concat(description, " - waited ").concat(maxIterations * intervalMs, "ms"));
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
        var setup_tests;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, import("../setup")];
                case 1:
                    setup_tests = (_a.sent()).setup_tests;
                    return [4 /*yield*/, setup_tests(sdk_1, sdkNonAdmin_1)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, journey_delete_cancels_actions_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Journey Delete Cancels Pending Actions test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Journey Delete Cancels Pending Actions test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=journey_delete_cancels_actions.test.js.map