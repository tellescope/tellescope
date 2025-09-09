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
exports.enduser_observations_acknowledge_basic_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var host = process.env.TEST_URL || 'http://localhost:8080';
var _a = [process.env.TEST_EMAIL, process.env.TEST_PASSWORD], email = _a[0], password = _a[1];
if (!(email && password)) {
    console.error("Set TEST_EMAIL and TEST_PASSWORD");
    process.exit();
}
var sdk = new sdk_1.Session({ host: host });
// Test just the basic acknowledge functionality
var enduser_observations_acknowledge_basic_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var testEnduser, testObservations, observationIds_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, testing_1.log_header)("Enduser Observations Acknowledge Basic Tests");
                // Authenticate
                return [4 /*yield*/, sdk.authenticate(email, password)
                    // Create test enduser
                ];
            case 1:
                // Authenticate
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 2:
                testEnduser = _a.sent();
                _a.label = 3;
            case 3:
                _a.trys.push([3, , 8, 10]);
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
                        }
                    ])];
            case 4:
                testObservations = _a.sent();
                observationIds_1 = testObservations.created.map(function (obs) { return obs.id; });
                // Test 1: Set exclusion flag to true
                return [4 /*yield*/, (0, testing_1.async_test)('acknowledge - set excludeFromVitalCountLookback to true', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var observation;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, sdk.api.enduser_observations.acknowledge({
                                        ids: [observationIds_1[0]],
                                        excludeFromVitalCountLookback: true
                                    })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, sdk.api.enduser_observations.getOne(observationIds_1[0])];
                                case 2:
                                    observation = _a.sent();
                                    return [2 /*return*/, observation.excludeFromVitalCountLookback === true];
                            }
                        });
                    }); }, { onResult: function (result) { return result === true; } })
                    // Test 2: Set exclusion flag to false
                ];
            case 5:
                // Test 1: Set exclusion flag to true
                _a.sent();
                // Test 2: Set exclusion flag to false
                return [4 /*yield*/, (0, testing_1.async_test)('acknowledge - set excludeFromVitalCountLookback to false', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var observation;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, sdk.api.enduser_observations.acknowledge({
                                        ids: [observationIds_1[1]],
                                        excludeFromVitalCountLookback: false
                                    })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, sdk.api.enduser_observations.getOne(observationIds_1[1])];
                                case 2:
                                    observation = _a.sent();
                                    return [2 /*return*/, observation.excludeFromVitalCountLookback === false];
                            }
                        });
                    }); }, { onResult: function (result) { return result === true; } })
                    // Test 3: Bulk set exclusion flags
                ];
            case 6:
                // Test 2: Set exclusion flag to false
                _a.sent();
                // Test 3: Bulk set exclusion flags
                return [4 /*yield*/, (0, testing_1.async_test)('acknowledge - bulk set exclusion flags', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var observations;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, sdk.api.enduser_observations.acknowledge({
                                        ids: observationIds_1,
                                        excludeFromVitalCountLookback: true
                                    })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, Promise.all(observationIds_1.map(function (id) { return sdk.api.enduser_observations.getOne(id); }))];
                                case 2:
                                    observations = _a.sent();
                                    return [2 /*return*/, observations.every(function (obs) { return obs.excludeFromVitalCountLookback === true; })];
                            }
                        });
                    }); }, { onResult: function (result) { return result === true; } })];
            case 7:
                // Test 3: Bulk set exclusion flags
                _a.sent();
                console.log("✅ All basic acknowledge tests passed!");
                return [3 /*break*/, 10];
            case 8: 
            // Cleanup
            return [4 /*yield*/, sdk.api.endusers.deleteOne(testEnduser.id)];
            case 9:
                // Cleanup
                _a.sent();
                return [7 /*endfinally*/];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.enduser_observations_acknowledge_basic_tests = enduser_observations_acknowledge_basic_tests;
if (require.main === module) {
    (0, exports.enduser_observations_acknowledge_basic_tests)()
        .then(function () {
        console.log("✅ Basic test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Basic test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=enduser_observations_acknowledge_basic.test.js.map