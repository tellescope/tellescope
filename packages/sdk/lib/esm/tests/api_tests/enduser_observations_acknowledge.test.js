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
import { async_test, handleAnyError, log_header, } from "@tellescope/testing";
import { setup_tests } from "../setup";
var host = process.env.TEST_URL || 'http://localhost:8080';
// Main test function that can be called independently
export var enduser_observations_acknowledge_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var testEnduser, vitalConfigId, triggerId, oldObservationIds, triggerTestEndusers, testObservations, observationIds_1, loadResult, mixedObservations, mixedLoadResult, excludedObs, includedObs, undefinedObs, _i, triggerTestEndusers_1, enduserId, error_1, _b, triggerTestEndusers_2, enduserId, deleteError_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    log_header("Enduser Observations Acknowledge Tests");
                    return [4 /*yield*/, sdk.api.endusers.createOne({})
                        // Variables for test resource management
                    ];
                case 1:
                    testEnduser = _c.sent();
                    oldObservationIds = [];
                    triggerTestEndusers = [] // Track endusers created for trigger tests
                    ;
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, , 21, 40]);
                    return [4 /*yield*/, sdk.api.enduser_observations.createSome([
                            {
                                category: 'vital-signs',
                                status: 'final',
                                enduserId: testEnduser.id,
                                measurement: { unit: 'lbs', value: 150 },
                                timestamp: new Date(),
                            },
                            {
                                category: 'vital-signs',
                                status: 'final',
                                enduserId: testEnduser.id,
                                measurement: { unit: 'mg/dL', value: 120 },
                                timestamp: new Date(),
                            },
                            {
                                category: 'vital-signs',
                                status: 'final',
                                enduserId: testEnduser.id,
                                measurement: { unit: 'mmHg', value: 80 },
                                timestamp: new Date(),
                            }
                        ])];
                case 3:
                    testObservations = _c.sent();
                    observationIds_1 = testObservations.created.map(function (obs) { return obs.id; });
                    // Test 1: Original acknowledge functionality (mark as reviewed)
                    return [4 /*yield*/, async_test('acknowledge - original functionality (mark as reviewed)', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var observation;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.enduser_observations.acknowledge({
                                            ids: [observationIds_1[0]]
                                        })
                                        // Verify observation was marked as reviewed
                                    ];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, sdk.api.enduser_observations.getOne(observationIds_1[0])];
                                    case 2:
                                        observation = _a.sent();
                                        return [2 /*return*/, !!observation.reviewedAt && !!observation.reviewedBy];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 2: Set exclusion flag to true
                    ];
                case 4:
                    // Test 1: Original acknowledge functionality (mark as reviewed)
                    _c.sent();
                    // Test 2: Set exclusion flag to true
                    return [4 /*yield*/, async_test('acknowledge - set excludeFromVitalCountLookback to true', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var observation;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.enduser_observations.acknowledge({
                                            ids: [observationIds_1[1]],
                                            excludeFromVitalCountLookback: true
                                        })
                                        // Verify exclusion flag was set
                                    ];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, sdk.api.enduser_observations.getOne(observationIds_1[1])];
                                    case 2:
                                        observation = _a.sent();
                                        return [2 /*return*/, observation.excludeFromVitalCountLookback === true];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 3: Set exclusion flag to false
                    ];
                case 5:
                    // Test 2: Set exclusion flag to true
                    _c.sent();
                    // Test 3: Set exclusion flag to false
                    return [4 /*yield*/, async_test('acknowledge - set excludeFromVitalCountLookback to false', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var observation;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.enduser_observations.acknowledge({
                                            ids: [observationIds_1[2]],
                                            excludeFromVitalCountLookback: false
                                        })
                                        // Verify exclusion flag was set to false
                                    ];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, sdk.api.enduser_observations.getOne(observationIds_1[2])];
                                    case 2:
                                        observation = _a.sent();
                                        return [2 /*return*/, observation.excludeFromVitalCountLookback === false];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 4: Bulk operations - set multiple observations exclusion flag
                    ];
                case 6:
                    // Test 3: Set exclusion flag to false
                    _c.sent();
                    // Test 4: Bulk operations - set multiple observations exclusion flag
                    return [4 /*yield*/, async_test('acknowledge - bulk set exclusion flag', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var observations;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.enduser_observations.acknowledge({
                                            ids: observationIds_1,
                                            excludeFromVitalCountLookback: true
                                        })
                                        // Verify all observations have exclusion flag set
                                    ];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, Promise.all(observationIds_1.map(function (id) { return sdk.api.enduser_observations.getOne(id); }))];
                                    case 2:
                                        observations = _a.sent();
                                        return [2 /*return*/, observations.every(function (obs) { return obs.excludeFromVitalCountLookback === true; })];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 5: Bulk operations - remove exclusion flag from multiple observations
                    ];
                case 7:
                    // Test 4: Bulk operations - set multiple observations exclusion flag
                    _c.sent();
                    // Test 5: Bulk operations - remove exclusion flag from multiple observations
                    return [4 /*yield*/, async_test('acknowledge - bulk remove exclusion flag', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var observations;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.enduser_observations.acknowledge({
                                            ids: observationIds_1,
                                            excludeFromVitalCountLookback: false
                                        })
                                        // Verify all observations have exclusion flag removed
                                    ];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, Promise.all(observationIds_1.map(function (id) { return sdk.api.enduser_observations.getOne(id); }))];
                                    case 2:
                                        observations = _a.sent();
                                        return [2 /*return*/, observations.every(function (obs) { return obs.excludeFromVitalCountLookback === false; })];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 6: Empty ids array should fail with validation error
                    ];
                case 8:
                    // Test 5: Bulk operations - remove exclusion flag from multiple observations
                    _c.sent();
                    // Test 6: Empty ids array should fail with validation error
                    return [4 /*yield*/, async_test('acknowledge - empty ids array validation error', function () { return sdk.api.enduser_observations.acknowledge({
                            ids: [],
                            excludeFromVitalCountLookback: true
                        }); }, handleAnyError)
                        // Test 7: Verify original acknowledge doesn't affect exclusion flag
                    ];
                case 9:
                    // Test 6: Empty ids array should fail with validation error
                    _c.sent();
                    // Test 7: Verify original acknowledge doesn't affect exclusion flag
                    return [4 /*yield*/, async_test('acknowledge - original functionality preserves exclusion flag', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var observation;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: 
                                    // First set exclusion flag
                                    return [4 /*yield*/, sdk.api.enduser_observations.acknowledge({
                                            ids: [observationIds_1[0]],
                                            excludeFromVitalCountLookback: true
                                        })
                                        // Then use original acknowledge (without exclusion parameter)
                                    ];
                                    case 1:
                                        // First set exclusion flag
                                        _a.sent();
                                        // Then use original acknowledge (without exclusion parameter)
                                        return [4 /*yield*/, sdk.api.enduser_observations.acknowledge({
                                                ids: [observationIds_1[0]]
                                            })
                                            // Verify exclusion flag is preserved and observation is reviewed
                                        ];
                                    case 2:
                                        // Then use original acknowledge (without exclusion parameter)
                                        _a.sent();
                                        return [4 /*yield*/, sdk.api.enduser_observations.getOne(observationIds_1[0])];
                                    case 3:
                                        observation = _a.sent();
                                        return [2 /*return*/, observation.excludeFromVitalCountLookback === true &&
                                                !!observation.reviewedAt &&
                                                !!observation.reviewedBy];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // ===== VITAL COUNT TRIGGER INTEGRATION TESTS =====
                        // Test 8: Setup vital configuration and test data BEFORE creating trigger
                    ];
                case 10:
                    // Test 7: Verify original acknowledge doesn't affect exclusion flag
                    _c.sent();
                    // ===== VITAL COUNT TRIGGER INTEGRATION TESTS =====
                    // Test 8: Setup vital configuration and test data BEFORE creating trigger
                    return [4 /*yield*/, async_test('vital count trigger - setup configuration and test endusers with observations', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var vitalConfig, shouldTriggerEnduser, oldTimestamp, shouldNotTriggerEnduser, excludedObservations, excludedObsIds, noObservationsEnduser, recentObservationsEnduser, recentTimestamp;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.vital_configurations.createOne({
                                            title: "Test BP Config ".concat(Date.now()),
                                            unit: 'mmHg',
                                            ranges: [
                                                {
                                                    classification: 'Normal',
                                                    comparison: { type: 'Less Than', value: 120 },
                                                    trendIntervalInMS: 0
                                                }
                                            ]
                                        })];
                                    case 1:
                                        vitalConfig = _a.sent();
                                        vitalConfigId = vitalConfig.id;
                                        return [4 /*yield*/, sdk.api.endusers.createOne({})];
                                    case 2:
                                        shouldTriggerEnduser = _a.sent();
                                        triggerTestEndusers.push(shouldTriggerEnduser.id);
                                        oldTimestamp = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
                                        ;
                                        return [4 /*yield*/, sdk.api.enduser_observations.createSome([
                                                {
                                                    category: 'vital-signs',
                                                    status: 'final',
                                                    enduserId: shouldTriggerEnduser.id,
                                                    measurement: { unit: 'mmHg', value: 110 },
                                                    timestamp: oldTimestamp,
                                                },
                                                {
                                                    category: 'vital-signs',
                                                    status: 'final',
                                                    enduserId: shouldTriggerEnduser.id,
                                                    measurement: { unit: 'mmHg', value: 115 },
                                                    timestamp: oldTimestamp,
                                                }
                                            ])
                                            // Create Test Case 2: Enduser with excluded observations that should NOT trigger
                                        ];
                                    case 3:
                                        _a.sent();
                                        return [4 /*yield*/, sdk.api.endusers.createOne({})];
                                    case 4:
                                        shouldNotTriggerEnduser = _a.sent();
                                        triggerTestEndusers.push(shouldNotTriggerEnduser.id);
                                        return [4 /*yield*/, sdk.api.enduser_observations.createSome([
                                                {
                                                    category: 'vital-signs',
                                                    status: 'final',
                                                    enduserId: shouldNotTriggerEnduser.id,
                                                    measurement: { unit: 'mmHg', value: 120 },
                                                    timestamp: oldTimestamp,
                                                },
                                                {
                                                    category: 'vital-signs',
                                                    status: 'final',
                                                    enduserId: shouldNotTriggerEnduser.id,
                                                    measurement: { unit: 'mmHg', value: 125 },
                                                    timestamp: oldTimestamp,
                                                }
                                            ])
                                            // Immediately set exclusion flags on these observations
                                        ];
                                    case 5:
                                        excludedObservations = _a.sent();
                                        excludedObsIds = excludedObservations.created.map(function (obs) { return obs.id; });
                                        return [4 /*yield*/, sdk.api.enduser_observations.acknowledge({
                                                ids: excludedObsIds,
                                                excludeFromVitalCountLookback: true
                                            })
                                            // Create Test Case 3: Enduser with NO observations at all (should NOT trigger)
                                        ];
                                    case 6:
                                        _a.sent();
                                        return [4 /*yield*/, sdk.api.endusers.createOne({})];
                                    case 7:
                                        noObservationsEnduser = _a.sent();
                                        triggerTestEndusers.push(noObservationsEnduser.id);
                                        return [4 /*yield*/, sdk.api.endusers.createOne({})];
                                    case 8:
                                        recentObservationsEnduser = _a.sent();
                                        triggerTestEndusers.push(recentObservationsEnduser.id);
                                        recentTimestamp = new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago (within 24h)
                                        ;
                                        return [4 /*yield*/, sdk.api.enduser_observations.createSome([
                                                {
                                                    category: 'vital-signs',
                                                    status: 'final',
                                                    enduserId: recentObservationsEnduser.id,
                                                    measurement: { unit: 'mmHg', value: 135 },
                                                    timestamp: recentTimestamp,
                                                },
                                                {
                                                    category: 'vital-signs',
                                                    status: 'final',
                                                    enduserId: recentObservationsEnduser.id,
                                                    measurement: { unit: 'mmHg', value: 140 },
                                                    timestamp: recentTimestamp,
                                                }
                                            ])];
                                    case 9:
                                        _a.sent();
                                        return [2 /*return*/, !!vitalConfig.id && triggerTestEndusers.length === 4];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 9: Create trigger AFTER all test data is set up
                    ];
                case 11:
                    // ===== VITAL COUNT TRIGGER INTEGRATION TESTS =====
                    // Test 8: Setup vital configuration and test data BEFORE creating trigger
                    _c.sent();
                    // Test 9: Create trigger AFTER all test data is set up
                    return [4 /*yield*/, async_test('vital count trigger - create trigger after test data setup', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var trigger;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                                            title: "Test Vital Count Trigger __BYPASS_ENDUSER_CUTOFF__ ".concat(Date.now()),
                                            status: 'Active',
                                            triggerNextAt: new Date(),
                                            event: {
                                                type: 'Vital Count',
                                                info: {
                                                    periodInMS: 24 * 60 * 60 * 1000,
                                                    minutes: 24 * 60,
                                                    comparison: { type: 'Less Than', value: 1 },
                                                    units: ['mmHg']
                                                }
                                            },
                                            action: {
                                                type: 'Add Tags',
                                                info: { tags: ['No-Vitals-Detected'] }
                                            }
                                        })];
                                    case 1:
                                        trigger = _a.sent();
                                        triggerId = trigger.id;
                                        return [2 /*return*/, !!trigger.id];
                                }
                            });
                        }); }, { onResult: function (result) { return result === true; } })
                        // Test 10: Validate trigger processes and SHOULD fire for enduser without exclusions
                    ];
                case 12:
                    // Test 9: Create trigger AFTER all test data is set up
                    _c.sent();
                    // Test 10: Validate trigger processes and SHOULD fire for enduser without exclusions
                    return [4 /*yield*/, async_test('vital count trigger - should fire for enduser without exclusion flags', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var shouldTriggerEnduserId, initialTrigger, initialTriggerNextAt, triggerProcessed, endUserTagged, i, currentTrigger, enduser, finalEnduser, finalTrigger;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        shouldTriggerEnduserId = triggerTestEndusers[0];
                                        return [4 /*yield*/, sdk.api.automation_triggers.getOne(triggerId)];
                                    case 1:
                                        initialTrigger = _b.sent();
                                        initialTriggerNextAt = initialTrigger.triggerNextAt;
                                        console.log("Initial triggerNextAt: ".concat(initialTriggerNextAt));
                                        triggerProcessed = false;
                                        endUserTagged = false;
                                        i = 0;
                                        _b.label = 2;
                                    case 2:
                                        if (!(i < 20)) return [3 /*break*/, 7];
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })
                                            // Check if trigger processed (triggerNextAt changed)
                                        ];
                                    case 3:
                                        _b.sent();
                                        return [4 /*yield*/, sdk.api.automation_triggers.getOne(triggerId)];
                                    case 4:
                                        currentTrigger = _b.sent();
                                        if (currentTrigger.triggerNextAt !== initialTriggerNextAt && !triggerProcessed) {
                                            triggerProcessed = true;
                                            console.log("\u2713 Trigger processed after ".concat(i + 1, " seconds - triggerNextAt changed from ").concat(initialTriggerNextAt, " to ").concat(currentTrigger.triggerNextAt));
                                        }
                                        return [4 /*yield*/, sdk.api.endusers.getOne(shouldTriggerEnduserId)];
                                    case 5:
                                        enduser = _b.sent();
                                        if (((_a = enduser.tags) === null || _a === void 0 ? void 0 : _a.includes('No-Vitals-Detected')) && !endUserTagged) {
                                            endUserTagged = true;
                                            console.log("\u2713 Should-trigger enduser tagged after ".concat(i + 1, " seconds"));
                                        }
                                        // If both happened, we're done
                                        if (triggerProcessed && endUserTagged) {
                                            return [2 /*return*/, true];
                                        }
                                        // Log progress every 5 seconds
                                        if (i % 5 === 0 && i > 0) {
                                            console.log("Still waiting... ".concat(i, "s elapsed. Processed: ").concat(triggerProcessed, ", Tagged: ").concat(endUserTagged));
                                        }
                                        _b.label = 6;
                                    case 6:
                                        i++;
                                        return [3 /*break*/, 2];
                                    case 7: return [4 /*yield*/, sdk.api.endusers.getOne(shouldTriggerEnduserId)];
                                    case 8:
                                        finalEnduser = _b.sent();
                                        return [4 /*yield*/, sdk.api.automation_triggers.getOne(triggerId)];
                                    case 9:
                                        finalTrigger = _b.sent();
                                        console.log("Final results after 20s:");
                                        console.log("- Trigger processed: ".concat(triggerProcessed, " (triggerNextAt: ").concat(finalTrigger.triggerNextAt, ")"));
                                        console.log("- Should-trigger enduser tagged: ".concat(endUserTagged, " (tags: ").concat(JSON.stringify(finalEnduser.tags), ")"));
                                        // Test passes if trigger processed AND enduser was tagged (no exclusions)
                                        return [2 /*return*/, triggerProcessed && endUserTagged];
                                }
                            });
                        }); }, { onResult: function (result) {
                                console.log("Should-fire trigger result: ".concat(result));
                                return result === true;
                            } })
                        // Test 11: Validate trigger processes but SHOULD NOT fire for enduser with exclusions
                    ];
                case 13:
                    // Test 10: Validate trigger processes and SHOULD fire for enduser without exclusions
                    _c.sent();
                    // Test 11: Validate trigger processes but SHOULD NOT fire for enduser with exclusions
                    return [4 /*yield*/, async_test('vital count trigger - should NOT fire for enduser with exclusion flags', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var shouldNotTriggerEnduserId, wasTagged, i, enduser, finalEnduser;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        shouldNotTriggerEnduserId = triggerTestEndusers[1];
                                        // Wait a bit after the first trigger processing to avoid rate limiting
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                                    case 1:
                                        // Wait a bit after the first trigger processing to avoid rate limiting
                                        _b.sent();
                                        wasTagged = false;
                                        i = 0;
                                        _b.label = 2;
                                    case 2:
                                        if (!(i < 20)) return [3 /*break*/, 6];
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })
                                            // Check if should-not-trigger enduser was tagged (shouldn't happen)
                                        ];
                                    case 3:
                                        _b.sent();
                                        return [4 /*yield*/, sdk.api.endusers.getOne(shouldNotTriggerEnduserId)];
                                    case 4:
                                        enduser = _b.sent();
                                        if ((_a = enduser.tags) === null || _a === void 0 ? void 0 : _a.includes('No-Vitals-Detected')) {
                                            wasTagged = true;
                                            console.log("! Should-not-trigger enduser was tagged at ".concat(i + 1, " seconds despite exclusion flags"));
                                            return [3 /*break*/, 6];
                                        }
                                        if (i % 5 === 0 && i > 0) {
                                            console.log("Checking excluded enduser... ".concat(i, "s elapsed, still no tag (good)"));
                                        }
                                        _b.label = 5;
                                    case 5:
                                        i++;
                                        return [3 /*break*/, 2];
                                    case 6: return [4 /*yield*/, sdk.api.endusers.getOne(shouldNotTriggerEnduserId)];
                                    case 7:
                                        finalEnduser = _b.sent();
                                        console.log("Final exclusion test results:");
                                        console.log("- Should-not-trigger enduser tagged: ".concat(wasTagged, " (should be false, tags: ").concat(JSON.stringify(finalEnduser.tags), ")"));
                                        // Test passes if enduser was NOT tagged (exclusion worked)
                                        return [2 /*return*/, !wasTagged];
                                }
                            });
                        }); }, { onResult: function (result) {
                                console.log("Exclusion prevention result: ".concat(result));
                                return result === true;
                            } })
                        // Test 12: Validate enduser with NO observations should NOT trigger  
                    ];
                case 14:
                    // Test 11: Validate trigger processes but SHOULD NOT fire for enduser with exclusions
                    _c.sent();
                    // Test 12: Validate enduser with NO observations should NOT trigger  
                    return [4 /*yield*/, async_test('vital count trigger - enduser with no observations should NOT trigger', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var noObservationsEnduserId, wasTagged, i, enduser, finalEnduser;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        noObservationsEnduserId = triggerTestEndusers[2];
                                        // Wait a bit to avoid overlapping with previous trigger processing
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                                    case 1:
                                        // Wait a bit to avoid overlapping with previous trigger processing
                                        _b.sent();
                                        wasTagged = false;
                                        i = 0;
                                        _b.label = 2;
                                    case 2:
                                        if (!(i < 10)) return [3 /*break*/, 6];
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                                    case 3:
                                        _b.sent();
                                        return [4 /*yield*/, sdk.api.endusers.getOne(noObservationsEnduserId)];
                                    case 4:
                                        enduser = _b.sent();
                                        if ((_a = enduser.tags) === null || _a === void 0 ? void 0 : _a.includes('No-Vitals-Detected')) {
                                            wasTagged = true;
                                            console.log("! No-observations enduser was tagged at ".concat(i + 1, " seconds (should NOT happen)"));
                                            return [3 /*break*/, 6];
                                        }
                                        if (i % 3 === 0) {
                                            console.log("Checking no-observations enduser... ".concat(i + 1, "s elapsed, still no tag (good)"));
                                        }
                                        _b.label = 5;
                                    case 5:
                                        i++;
                                        return [3 /*break*/, 2];
                                    case 6: return [4 /*yield*/, sdk.api.endusers.getOne(noObservationsEnduserId)];
                                    case 7:
                                        finalEnduser = _b.sent();
                                        console.log("No-observations test: tagged=".concat(wasTagged, " (should be false, tags: ").concat(JSON.stringify(finalEnduser.tags), ")"));
                                        return [2 /*return*/, !wasTagged];
                                }
                            });
                        }); }, { onResult: function (result) {
                                console.log("No-observations prevention result: ".concat(result));
                                return result === true;
                            } })
                        // Test 13: Validate enduser with RECENT observations should NOT trigger
                    ];
                case 15:
                    // Test 12: Validate enduser with NO observations should NOT trigger  
                    _c.sent();
                    // Test 13: Validate enduser with RECENT observations should NOT trigger
                    return [4 /*yield*/, async_test('vital count trigger - enduser with recent observations should NOT trigger', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var recentObservationsEnduserId, wasTagged, i, enduser, finalEnduser;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        recentObservationsEnduserId = triggerTestEndusers[3];
                                        // Wait a bit to avoid overlapping with previous trigger processing  
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                                    case 1:
                                        // Wait a bit to avoid overlapping with previous trigger processing  
                                        _b.sent();
                                        wasTagged = false;
                                        i = 0;
                                        _b.label = 2;
                                    case 2:
                                        if (!(i < 10)) return [3 /*break*/, 6];
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                                    case 3:
                                        _b.sent();
                                        return [4 /*yield*/, sdk.api.endusers.getOne(recentObservationsEnduserId)];
                                    case 4:
                                        enduser = _b.sent();
                                        if ((_a = enduser.tags) === null || _a === void 0 ? void 0 : _a.includes('No-Vitals-Detected')) {
                                            wasTagged = true;
                                            console.log("! Recent-observations enduser was tagged at ".concat(i + 1, " seconds (should NOT happen)"));
                                            return [3 /*break*/, 6];
                                        }
                                        if (i % 3 === 0) {
                                            console.log("Checking recent-observations enduser... ".concat(i + 1, "s elapsed, still no tag (good)"));
                                        }
                                        _b.label = 5;
                                    case 5:
                                        i++;
                                        return [3 /*break*/, 2];
                                    case 6: return [4 /*yield*/, sdk.api.endusers.getOne(recentObservationsEnduserId)];
                                    case 7:
                                        finalEnduser = _b.sent();
                                        console.log("Recent-observations test: tagged=".concat(wasTagged, " (should be false, tags: ").concat(JSON.stringify(finalEnduser.tags), ")"));
                                        return [2 /*return*/, !wasTagged];
                                }
                            });
                        }); }, { onResult: function (result) {
                                console.log("Recent-observations prevention result: ".concat(result));
                                return result === true;
                            } })
                        // Test 14: Verify normal cutoff behavior (without bypass keyword)
                    ];
                case 16:
                    // Test 13: Validate enduser with RECENT observations should NOT trigger
                    _c.sent();
                    // Test 14: Verify normal cutoff behavior (without bypass keyword)
                    return [4 /*yield*/, async_test('vital count trigger - normal cutoff prevents triggering for new endusers', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var newEnduser, oldTimestamp, normalTrigger, triggerProcessed, endUserTagged, i, currentTrigger, currentEnduser;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, sdk.api.endusers.createOne({})];
                                    case 1:
                                        newEnduser = _b.sent();
                                        triggerTestEndusers.push(newEnduser.id);
                                        oldTimestamp = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
                                        return [4 /*yield*/, sdk.api.enduser_observations.createSome([
                                                {
                                                    category: 'vital-signs',
                                                    status: 'final',
                                                    enduserId: newEnduser.id,
                                                    measurement: { unit: 'mmHg', value: 130 },
                                                    timestamp: oldTimestamp,
                                                }
                                            ])
                                            // Create trigger WITHOUT bypass keyword
                                        ];
                                    case 2:
                                        _b.sent();
                                        return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                                                title: "Normal Cutoff Trigger ".concat(Date.now()),
                                                status: 'Active',
                                                triggerNextAt: new Date(),
                                                event: {
                                                    type: 'Vital Count',
                                                    info: {
                                                        periodInMS: 24 * 60 * 60 * 1000,
                                                        minutes: 24 * 60,
                                                        comparison: { type: 'Less Than', value: 1 },
                                                        units: ['mmHg']
                                                    }
                                                },
                                                action: {
                                                    type: 'Add Tags',
                                                    info: { tags: ['Normal-Cutoff-Test'] }
                                                }
                                            })];
                                    case 3:
                                        normalTrigger = _b.sent();
                                        triggerProcessed = false;
                                        endUserTagged = false;
                                        i = 0;
                                        _b.label = 4;
                                    case 4:
                                        if (!(i < 15)) return [3 /*break*/, 9];
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                                    case 5:
                                        _b.sent();
                                        return [4 /*yield*/, sdk.api.automation_triggers.getOne(normalTrigger.id)];
                                    case 6:
                                        currentTrigger = _b.sent();
                                        return [4 /*yield*/, sdk.api.endusers.getOne(newEnduser.id)];
                                    case 7:
                                        currentEnduser = _b.sent();
                                        if (currentTrigger.triggerNextAt !== normalTrigger.triggerNextAt && !triggerProcessed) {
                                            triggerProcessed = true;
                                            console.log("\u2713 Normal trigger processed after ".concat(i + 1, " seconds"));
                                        }
                                        if ((_a = currentEnduser.tags) === null || _a === void 0 ? void 0 : _a.includes('Normal-Cutoff-Test')) {
                                            endUserTagged = true;
                                            console.log("! Normal trigger tagged new enduser (should NOT happen)");
                                            return [3 /*break*/, 9];
                                        }
                                        if (triggerProcessed && i > 5)
                                            return [3 /*break*/, 9]; // Give it a few extra seconds after processing
                                        _b.label = 8;
                                    case 8:
                                        i++;
                                        return [3 /*break*/, 4];
                                    case 9:
                                        console.log("Normal cutoff test: processed=".concat(triggerProcessed, ", tagged=").concat(endUserTagged));
                                        // Clean up the normal trigger
                                        return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(normalTrigger.id)
                                            // Test passes if trigger processed but didn't tag (cutoff worked)
                                        ];
                                    case 10:
                                        // Clean up the normal trigger
                                        _b.sent();
                                        // Test passes if trigger processed but didn't tag (cutoff worked)
                                        return [2 /*return*/, triggerProcessed && !endUserTagged];
                                }
                            });
                        }); }, { onResult: function (result) {
                                console.log("Normal cutoff behavior result: ".concat(result));
                                return result === true;
                            } })];
                case 17:
                    // Test 14: Verify normal cutoff behavior (without bypass keyword)
                    _c.sent();
                    console.log("✅ All Enduser Observations Acknowledge tests passed!");
                    console.log("✅ Vital Count trigger integration tests completed!");
                    // Test load endpoint with exclusion flags
                    console.log("\n🧪 Testing load endpoint with excludeFromVitalCountLookback...");
                    // Test 17: Load endpoint returns excludeFromVitalCountLookback field
                    console.log("17. Load endpoint returns excludeFromVitalCountLookback field");
                    return [4 /*yield*/, sdk.api.enduser_observations.load({
                            enduserId: testEnduser.id,
                            from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                            to: new Date()
                        })];
                case 18:
                    loadResult = _c.sent();
                    if (loadResult.observations.length === 0) {
                        throw new Error("Expected at least one observation in load result");
                    }
                    // Check that all observations have excludeFromVitalCountLookback field (even if undefined/null)
                    loadResult.observations.forEach(function (obs) {
                        if (!('excludeFromVitalCountLookback' in obs)) {
                            throw new Error("excludeFromVitalCountLookback field missing from load response");
                        }
                    });
                    console.log("\u2705 Load endpoint returned ".concat(loadResult.observations.length, " observations, all with excludeFromVitalCountLookback field"));
                    // Test 18: Load endpoint shows mixed exclusion states correctly
                    console.log("18. Load endpoint shows mixed exclusion states correctly");
                    return [4 /*yield*/, sdk.api.enduser_observations.createSome([
                            {
                                category: 'vital-signs',
                                status: 'final',
                                enduserId: testEnduser.id,
                                measurement: { unit: 'mmHg', value: 140 },
                                timestamp: new Date(Date.now() - 1000),
                                excludeFromVitalCountLookback: true // This one excluded
                            },
                            {
                                category: 'vital-signs',
                                status: 'final',
                                enduserId: testEnduser.id,
                                measurement: { unit: 'mmHg', value: 120 },
                                timestamp: new Date(Date.now() - 2000),
                                // This one not excluded (undefined)
                            },
                            {
                                category: 'vital-signs',
                                status: 'final',
                                enduserId: testEnduser.id,
                                measurement: { unit: 'mmHg', value: 110 },
                                timestamp: new Date(Date.now() - 3000),
                                excludeFromVitalCountLookback: false // This one explicitly included
                            }
                        ])];
                case 19:
                    mixedObservations = _c.sent();
                    return [4 /*yield*/, sdk.api.enduser_observations.load({
                            enduserId: testEnduser.id,
                            from: new Date(Date.now() - 24 * 60 * 60 * 1000),
                            to: new Date()
                        })];
                case 20:
                    mixedLoadResult = _c.sent();
                    excludedObs = mixedLoadResult.observations.find(function (obs) { return obs.excludeFromVitalCountLookback === true; });
                    includedObs = mixedLoadResult.observations.find(function (obs) { return obs.excludeFromVitalCountLookback === false; });
                    undefinedObs = mixedLoadResult.observations.find(function (obs) { return obs.excludeFromVitalCountLookback === undefined; });
                    if (!excludedObs) {
                        throw new Error("Could not find observation with excludeFromVitalCountLookback=true in load result");
                    }
                    if (!includedObs) {
                        throw new Error("Could not find observation with excludeFromVitalCountLookback=false in load result");
                    }
                    console.log("\u2705 Load endpoint correctly returned mixed exclusion states: excluded=".concat(excludedObs.excludeFromVitalCountLookback, ", included=").concat(includedObs.excludeFromVitalCountLookback, ", undefined=").concat(undefinedObs === null || undefinedObs === void 0 ? void 0 : undefinedObs.excludeFromVitalCountLookback));
                    console.log("✅ All load endpoint tests passed!");
                    return [3 /*break*/, 40];
                case 21:
                    _c.trys.push([21, 31, , 39]);
                    if (!triggerId) return [3 /*break*/, 23];
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(triggerId)];
                case 22:
                    _c.sent();
                    _c.label = 23;
                case 23:
                    if (!vitalConfigId) return [3 /*break*/, 25];
                    return [4 /*yield*/, sdk.api.vital_configurations.deleteOne(vitalConfigId)];
                case 24:
                    _c.sent();
                    _c.label = 25;
                case 25: 
                // Delete main test enduser (this will cascade delete related observations)
                return [4 /*yield*/, sdk.api.endusers.deleteOne(testEnduser.id)
                    // Delete all trigger test endusers (cascade deletes their observations too)
                ];
                case 26:
                    // Delete main test enduser (this will cascade delete related observations)
                    _c.sent();
                    _i = 0, triggerTestEndusers_1 = triggerTestEndusers;
                    _c.label = 27;
                case 27:
                    if (!(_i < triggerTestEndusers_1.length)) return [3 /*break*/, 30];
                    enduserId = triggerTestEndusers_1[_i];
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduserId)];
                case 28:
                    _c.sent();
                    _c.label = 29;
                case 29:
                    _i++;
                    return [3 /*break*/, 27];
                case 30: return [3 /*break*/, 39];
                case 31:
                    error_1 = _c.sent();
                    console.error('Cleanup error:', error_1);
                    // Still delete all endusers even if other cleanup fails
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(testEnduser.id)];
                case 32:
                    // Still delete all endusers even if other cleanup fails
                    _c.sent();
                    _b = 0, triggerTestEndusers_2 = triggerTestEndusers;
                    _c.label = 33;
                case 33:
                    if (!(_b < triggerTestEndusers_2.length)) return [3 /*break*/, 38];
                    enduserId = triggerTestEndusers_2[_b];
                    _c.label = 34;
                case 34:
                    _c.trys.push([34, 36, , 37]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduserId)];
                case 35:
                    _c.sent();
                    return [3 /*break*/, 37];
                case 36:
                    deleteError_1 = _c.sent();
                    console.error("Failed to delete trigger test enduser ".concat(enduserId, ":"), deleteError_1);
                    return [3 /*break*/, 37];
                case 37:
                    _b++;
                    return [3 /*break*/, 33];
                case 38: return [3 /*break*/, 39];
                case 39: return [7 /*endfinally*/];
                case 40: return [2 /*return*/];
            }
        });
    });
};
// Allow running this test file independently
if (require.main === module) {
    var sdk_1 = new Session({ host: host });
    var sdkNonAdmin_1 = new Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setup_tests(sdk_1, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, enduser_observations_acknowledge_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Enduser observations acknowledge test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Enduser observations acknowledge test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=enduser_observations_acknowledge.test.js.map