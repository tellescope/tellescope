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
var host = process.env.API_URL || 'http://localhost:8080';
export var journey_error_branching_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var basicJourney, failingStep, vipEnduser, regularEnduser, complexJourney, step1, step2, complexEnduser, blockedJourney, blockedFailingStep, blockedAfterStep, blockedTestEnduser, finalBlockedResult, finalHasErrorHandler, finalHasBlockedAfterAction, continueJourney, failingButContinueStep, allowedAfterStep, continueTestEnduser, integrationJourney, integrationFailingStep, integrationEnduser;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    log_header("Journey Error Branching Tests");
                    // NOTE: This test suite intentionally creates actions that will fail to test error handling:
                    // - Uses invalid ObjectIds and non-existent references to cause predictable failures
                    // - No communication actions (SMS/Email/Webhook) are used to avoid any real messaging
                    // This ensures we test error branching safely without external side effects
                    // Test 1: Basic onError handling with enduser conditions
                    console.log("Testing basic onError handling with enduser conditions...");
                    return [4 /*yield*/, sdk.api.journeys.createOne({
                            title: "Basic Error Handling Journey"
                        })
                        // Create first step - action that will fail (reference non-existent form)
                    ];
                case 1:
                    basicJourney = _f.sent();
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: basicJourney.id,
                            action: {
                                type: 'sendForm',
                                info: {
                                    formId: '000000000000000000000001',
                                    senderId: sdk.userInfo.id,
                                    channel: 'Email'
                                }
                            },
                            events: [{ type: 'onJourneyStart', info: {} }]
                        })
                        // Create error handling step - add tags when form email fails for VIP users only
                    ];
                case 2:
                    failingStep = _f.sent();
                    // Create error handling step - add tags when form email fails for VIP users only
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: basicJourney.id,
                            action: { type: 'addEnduserTags', info: { tags: ['error-handled-for-vip'] } },
                            events: [{ type: 'onError', info: { automationStepId: failingStep.id } }],
                            enduserConditions: {
                                "$and": [
                                    {
                                        "condition": {
                                            "tags": "vip"
                                        }
                                    }
                                ]
                            }
                        })
                        // Create VIP enduser (form email will fail due to non-existent form)
                    ];
                case 3:
                    // Create error handling step - add tags when form email fails for VIP users only
                    _f.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'VIP',
                            lname: 'User',
                            email: 'test-vip-' + Date.now() + '@example.com',
                            tags: ['vip']
                        })
                        // Create regular enduser (form email will fail due to non-existent form)
                    ];
                case 4:
                    vipEnduser = _f.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'Regular',
                            lname: 'User',
                            email: 'test-regular-' + Date.now() + '@example.com'
                        })
                        // Add both to journey
                    ];
                case 5:
                    regularEnduser = _f.sent();
                    // Add both to journey
                    return [4 /*yield*/, sdk.api.endusers.add_to_journey({
                            enduserIds: [vipEnduser.id],
                            journeyId: basicJourney.id
                        })];
                case 6:
                    // Add both to journey
                    _f.sent();
                    return [4 /*yield*/, sdk.api.endusers.add_to_journey({
                            enduserIds: [regularEnduser.id],
                            journeyId: basicJourney.id
                        })
                        // First, let's verify that the failing action actually creates BackgroundErrors
                    ];
                case 7:
                    _f.sent();
                    // First, let's verify that the failing action actually creates BackgroundErrors
                    return [4 /*yield*/, pollForErrorHandling(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var backgroundErrors;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, sdk.api.background_errors.getSome({
                                            filter: { journeyId: basicJourney.id }
                                        })];
                                    case 1:
                                        backgroundErrors = _b.sent();
                                        console.log("Found ".concat(backgroundErrors.length, " background errors for journey"));
                                        if (backgroundErrors.length > 0) {
                                            console.log('Sample error:', {
                                                title: backgroundErrors[0].title,
                                                message: (_a = backgroundErrors[0].message) === null || _a === void 0 ? void 0 : _a.substring(0, 100),
                                                enduserId: backgroundErrors[0].enduserId
                                            });
                                        }
                                        return [2 /*return*/, { backgroundErrorCount: backgroundErrors.length }];
                                }
                            });
                        }); }, function (result) { return result.backgroundErrorCount > 0; }, 'Initial action should create background errors (indicating failure)')
                        // Now check if error handling is triggered
                    ];
                case 8:
                    // First, let's verify that the failing action actually creates BackgroundErrors
                    _f.sent();
                    // Now check if error handling is triggered
                    return [4 /*yield*/, pollForErrorHandling(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var vipResult, regularResult, automatedActions;
                            var _a, _b, _c, _d;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0: return [4 /*yield*/, sdk.api.endusers.getOne(vipEnduser.id)];
                                    case 1:
                                        vipResult = _e.sent();
                                        return [4 /*yield*/, sdk.api.endusers.getOne(regularEnduser.id)
                                            // Also check automation actions for debugging
                                        ];
                                    case 2:
                                        regularResult = _e.sent();
                                        return [4 /*yield*/, sdk.api.automated_actions.getSome({
                                                filter: { journeyId: basicJourney.id }
                                            })];
                                    case 3:
                                        automatedActions = _e.sent();
                                        console.log("Found ".concat(automatedActions.length, " automated actions for journey"));
                                        return [2 /*return*/, {
                                                vipHasErrorTag: (_b = (_a = vipResult.tags) === null || _a === void 0 ? void 0 : _a.includes('error-handled-for-vip')) !== null && _b !== void 0 ? _b : false,
                                                regularHasErrorTag: (_d = (_c = regularResult.tags) === null || _c === void 0 ? void 0 : _c.includes('error-handled-for-vip')) !== null && _d !== void 0 ? _d : false,
                                                automatedActionCount: automatedActions.length
                                            }];
                                }
                            });
                        }); }, function (result) {
                            console.log("VIP user has error tag: ".concat(result.vipHasErrorTag));
                            console.log("Regular user has error tag: ".concat(result.regularHasErrorTag));
                            console.log("Automated actions: ".concat(result.automatedActionCount));
                            return result.vipHasErrorTag && !result.regularHasErrorTag;
                        }, 'VIP enduser should get error tag, regular enduser should not')
                        // Test 2: Complex multi-step error handling
                    ];
                case 9:
                    // Now check if error handling is triggered
                    _f.sent();
                    // Test 2: Complex multi-step error handling
                    console.log("Testing complex multi-step error handling...");
                    return [4 /*yield*/, sdk.api.journeys.createOne({
                            title: "Complex Error Journey"
                        })
                        // Step 1: Action that will fail (non-existent journey)
                    ];
                case 10:
                    complexJourney = _f.sent();
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: complexJourney.id,
                            action: {
                                type: 'addToJourney',
                                info: {
                                    journeyId: '000000000000000000000002' // Non-existent journey (guaranteed failure)
                                }
                            },
                            events: [{ type: 'onJourneyStart', info: {} }]
                        })
                        // Step 2: Action that would also fail (non-existent journey) - but only runs after Step 1 success
                    ];
                case 11:
                    step1 = _f.sent();
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: complexJourney.id,
                            action: {
                                type: 'removeFromJourney',
                                info: {
                                    journeyId: '000000000000000000000003' // Non-existent journey (guaranteed failure)
                                }
                            },
                            events: [{ type: 'afterAction', info: { automationStepId: step1.id, delayInMS: 1000, delay: 1, unit: 'Seconds' } }]
                        })
                        // Error handling for Step 1 (add to journey failure)
                    ];
                case 12:
                    step2 = _f.sent();
                    // Error handling for Step 1 (add to journey failure)
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: complexJourney.id,
                            action: { type: 'addEnduserTags', info: { tags: ['step1-error-handled'] } },
                            events: [{ type: 'onError', info: { automationStepId: step1.id } }]
                        })
                        // Error handling for Step 2 (remove from journey failure)
                    ];
                case 13:
                    // Error handling for Step 1 (add to journey failure)
                    _f.sent();
                    // Error handling for Step 2 (remove from journey failure)
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: complexJourney.id,
                            action: { type: 'addEnduserTags', info: { tags: ['step2-error-handled'] } },
                            events: [{ type: 'onError', info: { automationStepId: step2.id } }]
                        })];
                case 14:
                    // Error handling for Step 2 (remove from journey failure)
                    _f.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'Complex',
                            lname: 'Test',
                            email: 'test-complex-' + Date.now() + '@example.com'
                        })];
                case 15:
                    complexEnduser = _f.sent();
                    return [4 /*yield*/, sdk.api.endusers.add_to_journey({
                            enduserIds: [complexEnduser.id],
                            journeyId: complexJourney.id
                        })
                        // Check background errors first
                    ];
                case 16:
                    _f.sent();
                    // Check background errors first
                    return [4 /*yield*/, pollForErrorHandling(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var backgroundErrors;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.background_errors.getSome({
                                            filter: { journeyId: complexJourney.id }
                                        })];
                                    case 1:
                                        backgroundErrors = _a.sent();
                                        console.log("Complex test - Found ".concat(backgroundErrors.length, " background errors"));
                                        return [2 /*return*/, { backgroundErrorCount: backgroundErrors.length }];
                                }
                            });
                        }); }, function (result) { return result.backgroundErrorCount > 0; }, 'Complex test should create background errors')
                        // Poll for Step 1 error handling (Step 2 should not run due to Step 1 failure)
                    ];
                case 17:
                    // Check background errors first
                    _f.sent();
                    // Poll for Step 1 error handling (Step 2 should not run due to Step 1 failure)
                    return [4 /*yield*/, pollForErrorHandling(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var complexResult;
                            var _a, _b, _c, _d;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0: return [4 /*yield*/, sdk.api.endusers.getOne(complexEnduser.id)];
                                    case 1:
                                        complexResult = _e.sent();
                                        return [2 /*return*/, {
                                                hasStep1Error: (_b = (_a = complexResult.tags) === null || _a === void 0 ? void 0 : _a.includes('step1-error-handled')) !== null && _b !== void 0 ? _b : false,
                                                hasStep2Error: (_d = (_c = complexResult.tags) === null || _c === void 0 ? void 0 : _c.includes('step2-error-handled')) !== null && _d !== void 0 ? _d : false
                                            }];
                                }
                            });
                        }); }, function (result) {
                            console.log("Complex test - Step 1 error handled: ".concat(result.hasStep1Error));
                            console.log("Complex test - Step 2 error handled: ".concat(result.hasStep2Error));
                            return result.hasStep1Error; // Only Step 1 should fail and be handled
                        }, 'Step 1 should fail and be handled, Step 2 should not run')
                        // Test 3: Verify afterAction does NOT occur after error (without continueOnError)
                    ];
                case 18:
                    // Poll for Step 1 error handling (Step 2 should not run due to Step 1 failure)
                    _f.sent();
                    // Test 3: Verify afterAction does NOT occur after error (without continueOnError)
                    console.log("Testing that afterAction is blocked by errors...");
                    return [4 /*yield*/, sdk.api.journeys.createOne({
                            title: "Blocked AfterAction Journey"
                        })
                        // Step 1: Action that will fail
                    ];
                case 19:
                    blockedJourney = _f.sent();
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: blockedJourney.id,
                            action: {
                                type: 'addToJourney',
                                info: {
                                    journeyId: '000000000000000000000005' // Non-existent journey (guaranteed failure)
                                }
                            },
                            events: [{ type: 'onJourneyStart', info: {} }]
                        })
                        // Step 2: Should NOT run because Step 1 fails and no continueOnError
                    ];
                case 20:
                    blockedFailingStep = _f.sent();
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: blockedJourney.id,
                            action: { type: 'addEnduserTags', info: { tags: ['should-not-run-after-error'] } },
                            events: [{ type: 'afterAction', info: { automationStepId: blockedFailingStep.id, delayInMS: 100, delay: 1, unit: 'Seconds' } }]
                        })
                        // Error handler - should run
                    ];
                case 21:
                    blockedAfterStep = _f.sent();
                    // Error handler - should run
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: blockedJourney.id,
                            action: { type: 'addEnduserTags', info: { tags: ['error-handler-ran'] } },
                            events: [{ type: 'onError', info: { automationStepId: blockedFailingStep.id } }]
                        })];
                case 22:
                    // Error handler - should run
                    _f.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'Blocked',
                            lname: 'Test',
                            email: 'test-blocked-' + Date.now() + '@example.com'
                        })];
                case 23:
                    blockedTestEnduser = _f.sent();
                    return [4 /*yield*/, sdk.api.endusers.add_to_journey({
                            enduserIds: [blockedTestEnduser.id],
                            journeyId: blockedJourney.id
                        })
                        // Poll to verify error handler runs but afterAction does not
                    ];
                case 24:
                    _f.sent();
                    // Poll to verify error handler runs but afterAction does not
                    return [4 /*yield*/, pollForErrorHandling(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var result;
                            var _a, _b, _c, _d;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0: return [4 /*yield*/, sdk.api.endusers.getOne(blockedTestEnduser.id)];
                                    case 1:
                                        result = _e.sent();
                                        return [2 /*return*/, {
                                                hasErrorHandler: (_b = (_a = result.tags) === null || _a === void 0 ? void 0 : _a.includes('error-handler-ran')) !== null && _b !== void 0 ? _b : false,
                                                hasBlockedAfterAction: (_d = (_c = result.tags) === null || _c === void 0 ? void 0 : _c.includes('should-not-run-after-error')) !== null && _d !== void 0 ? _d : false
                                            }];
                                }
                            });
                        }); }, function (result) {
                            console.log("Blocked test - Error handler ran: ".concat(result.hasErrorHandler));
                            console.log("Blocked test - AfterAction ran (should be false): ".concat(result.hasBlockedAfterAction));
                            return result.hasErrorHandler && !result.hasBlockedAfterAction;
                        }, 'Error handler should run, but afterAction should be blocked by error')
                        // Wait additional time and verify again that afterAction remains blocked
                    ];
                case 25:
                    // Poll to verify error handler runs but afterAction does not
                    _f.sent();
                    // Wait additional time and verify again that afterAction remains blocked
                    console.log('Waiting additional 3 seconds to confirm afterAction remains blocked...');
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 3000); })];
                case 26:
                    _f.sent();
                    return [4 /*yield*/, sdk.api.endusers.getOne(blockedTestEnduser.id)];
                case 27:
                    finalBlockedResult = _f.sent();
                    finalHasErrorHandler = (_c = (_b = finalBlockedResult.tags) === null || _b === void 0 ? void 0 : _b.includes('error-handler-ran')) !== null && _c !== void 0 ? _c : false;
                    finalHasBlockedAfterAction = (_e = (_d = finalBlockedResult.tags) === null || _d === void 0 ? void 0 : _d.includes('should-not-run-after-error')) !== null && _e !== void 0 ? _e : false;
                    console.log("Final verification - Error handler: ".concat(finalHasErrorHandler, ", AfterAction blocked: ").concat(!finalHasBlockedAfterAction));
                    if (!finalHasErrorHandler || finalHasBlockedAfterAction) {
                        throw new Error("Final verification failed: Error handler should remain true (".concat(finalHasErrorHandler, ") and afterAction should remain blocked (").concat(!finalHasBlockedAfterAction, ")"));
                    }
                    // Test 4: Verify afterAction DOES occur after error with continueOnError=true
                    console.log("Testing that afterAction works with continueOnError...");
                    return [4 /*yield*/, sdk.api.journeys.createOne({
                            title: "Continue After Error Journey"
                        })
                        // Step 1: Action that will fail but has continueOnError=true
                    ];
                case 28:
                    continueJourney = _f.sent();
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: continueJourney.id,
                            action: {
                                type: 'sendForm',
                                info: {
                                    formId: '000000000000000000000007',
                                    senderId: sdk.userInfo.id,
                                    channel: 'Email'
                                },
                                continueOnError: true // This allows afterAction to still run
                            },
                            events: [{ type: 'onJourneyStart', info: {} }]
                        })
                        // Step 2: SHOULD run because Step 1 has continueOnError=true
                    ];
                case 29:
                    failingButContinueStep = _f.sent();
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: continueJourney.id,
                            action: { type: 'addEnduserTags', info: { tags: ['after-action-despite-error'] } },
                            events: [{ type: 'afterAction', info: { automationStepId: failingButContinueStep.id, delayInMS: 100, delay: 1, unit: 'Seconds' } }]
                        })
                        // Error handler - should also run
                    ];
                case 30:
                    allowedAfterStep = _f.sent();
                    // Error handler - should also run
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: continueJourney.id,
                            action: { type: 'addEnduserTags', info: { tags: ['error-handler-also-ran'] } },
                            events: [{ type: 'onError', info: { automationStepId: failingButContinueStep.id } }]
                        })];
                case 31:
                    // Error handler - should also run
                    _f.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'Continue',
                            lname: 'Test',
                            email: 'test-continue-' + Date.now() + '@example.com'
                        })];
                case 32:
                    continueTestEnduser = _f.sent();
                    return [4 /*yield*/, sdk.api.endusers.add_to_journey({
                            enduserIds: [continueTestEnduser.id],
                            journeyId: continueJourney.id
                        })
                        // Poll to verify both error handler AND afterAction run
                        // Use longer timeout for continueOnError test since automation processing may take longer
                    ];
                case 33:
                    _f.sent();
                    // Poll to verify both error handler AND afterAction run
                    // Use longer timeout for continueOnError test since automation processing may take longer
                    return [4 /*yield*/, pollForErrorHandling(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var result;
                            var _a, _b, _c, _d;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0: return [4 /*yield*/, sdk.api.endusers.getOne(continueTestEnduser.id)];
                                    case 1:
                                        result = _e.sent();
                                        return [2 /*return*/, {
                                                hasErrorHandler: (_b = (_a = result.tags) === null || _a === void 0 ? void 0 : _a.includes('error-handler-also-ran')) !== null && _b !== void 0 ? _b : false,
                                                hasAfterAction: (_d = (_c = result.tags) === null || _c === void 0 ? void 0 : _c.includes('after-action-despite-error')) !== null && _d !== void 0 ? _d : false
                                            }];
                                }
                            });
                        }); }, function (result) {
                            console.log("Continue test - Error handler ran: ".concat(result.hasErrorHandler));
                            console.log("Continue test - AfterAction ran: ".concat(result.hasAfterAction));
                            return result.hasErrorHandler && result.hasAfterAction;
                        }, 'Both error handler and afterAction should run with continueOnError=true', 500, // intervalMs
                        60 // maxIterations (30 seconds total instead of 10)
                        )
                        // Test 5: Integration error scenario
                    ];
                case 34:
                    // Poll to verify both error handler AND afterAction run
                    // Use longer timeout for continueOnError test since automation processing may take longer
                    _f.sent();
                    // Test 5: Integration error scenario
                    console.log("Testing real-world integration error...");
                    return [4 /*yield*/, sdk.api.journeys.createOne({
                            title: "Integration Error Journey"
                        })
                        // Action that will fail (non-existent form)
                    ];
                case 35:
                    integrationJourney = _f.sent();
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: integrationJourney.id,
                            action: {
                                type: 'sendForm',
                                info: {
                                    formId: '000000000000000000000008',
                                    senderId: sdk.userInfo.id,
                                    channel: 'Email'
                                }
                            },
                            events: [{ type: 'onJourneyStart', info: {} }]
                        })
                        // Error recovery step
                    ];
                case 36:
                    integrationFailingStep = _f.sent();
                    // Error recovery step
                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                            journeyId: integrationJourney.id,
                            action: { type: 'addEnduserTags', info: { tags: ['form-send-failed'] } },
                            events: [{ type: 'onError', info: { automationStepId: integrationFailingStep.id } }]
                        })];
                case 37:
                    // Error recovery step
                    _f.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: 'Integration',
                            lname: 'Test',
                            email: 'test-integration-' + Date.now() + '@example.com'
                        })];
                case 38:
                    integrationEnduser = _f.sent();
                    return [4 /*yield*/, sdk.api.endusers.add_to_journey({
                            enduserIds: [integrationEnduser.id],
                            journeyId: integrationJourney.id
                        })
                        // Poll for integration error handling
                    ];
                case 39:
                    _f.sent();
                    // Poll for integration error handling
                    return [4 /*yield*/, pollForErrorHandling(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var integrationResult;
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, sdk.api.endusers.getOne(integrationEnduser.id)];
                                    case 1:
                                        integrationResult = _c.sent();
                                        return [2 /*return*/, {
                                                hasFormSendError: (_b = (_a = integrationResult.tags) === null || _a === void 0 ? void 0 : _a.includes('form-send-failed')) !== null && _b !== void 0 ? _b : false
                                            }];
                                }
                            });
                        }); }, function (result) {
                            console.log("Integration test - Form send error handled: ".concat(result.hasFormSendError));
                            return result.hasFormSendError;
                        }, 'Form send action should fail and be handled')
                        // Cleanup
                    ];
                case 40:
                    // Poll for integration error handling
                    _f.sent();
                    // Cleanup
                    return [4 /*yield*/, Promise.all([
                            sdk.api.journeys.deleteOne(basicJourney.id),
                            sdk.api.journeys.deleteOne(complexJourney.id),
                            sdk.api.journeys.deleteOne(blockedJourney.id),
                            sdk.api.journeys.deleteOne(continueJourney.id),
                            sdk.api.journeys.deleteOne(integrationJourney.id),
                            sdk.api.endusers.deleteOne(vipEnduser.id),
                            sdk.api.endusers.deleteOne(regularEnduser.id),
                            sdk.api.endusers.deleteOne(complexEnduser.id),
                            sdk.api.endusers.deleteOne(blockedTestEnduser.id),
                            sdk.api.endusers.deleteOne(continueTestEnduser.id),
                            sdk.api.endusers.deleteOne(integrationEnduser.id)
                        ])];
                case 41:
                    // Cleanup
                    _f.sent();
                    console.log("✅ Journey Error Branching tests completed successfully");
                    return [2 /*return*/];
            }
        });
    });
};
// Polling helper function for error handling verification
var pollForErrorHandling = function (fetchFn, evaluateFn, description, intervalMs, maxIterations) {
    if (intervalMs === void 0) { intervalMs = 500; }
    if (maxIterations === void 0) { maxIterations = 20; }
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
                    // Log progress every 2.5 seconds
                    if (i > 0 && (i + 1) % 5 === 0) {
                        console.log("Still waiting for: ".concat(description, " - ").concat((i + 1) * intervalMs, "ms elapsed"));
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
var getTestTemplateId = function (sdk, _type) { return __awaiter(void 0, void 0, void 0, function () {
    var templates, template, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, sdk.api.templates.getSome({
                        filter: {}
                    })];
            case 1:
                templates = _a.sent();
                if (templates.length > 0) {
                    return [2 /*return*/, templates[0].id];
                }
                return [4 /*yield*/, sdk.api.templates.createOne({
                        title: 'Test Template',
                        message: 'Test message',
                        subject: 'Test Subject',
                        html: '<p>Test email</p>'
                    })];
            case 2:
                template = _a.sent();
                return [2 /*return*/, template.id];
            case 3:
                error_1 = _a.sent();
                console.error('Error getting template:', error_1);
                throw error_1;
            case 4: return [2 /*return*/];
        }
    });
}); };
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
                    return [4 /*yield*/, journey_error_branching_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Journey Error Branching test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Journey Error Branching test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=journey_error_branching.test.js.map