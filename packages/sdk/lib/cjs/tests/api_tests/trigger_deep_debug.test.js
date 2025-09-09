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
exports.trigger_deep_debug_tests = void 0;
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
// Deep debug of trigger logic
var trigger_deep_debug_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var triggerId, enduserId, testEnduser, oldTimestamp, observations, currentPeriodVitals, last24Hours_1, recentVitals, oldVitals, hasHistoricalReadings, hasRecentReadings, trigger, i, currentTrigger, currentEnduser;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                (0, testing_1.log_header)("Deep Trigger Debug Tests");
                return [4 /*yield*/, sdk.authenticate(email, password)];
            case 1:
                _c.sent();
                _c.label = 2;
            case 2:
                _c.trys.push([2, , 13, 18]);
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 3:
                testEnduser = _c.sent();
                enduserId = testEnduser.id;
                console.log("Created enduser:", testEnduser.id);
                oldTimestamp = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
                ;
                console.log("Old timestamp (2 days ago):", oldTimestamp.toISOString());
                console.log("Current time:", new Date().toISOString());
                console.log("24 hours ago:", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
                return [4 /*yield*/, sdk.api.enduser_observations.createSome([
                        {
                            category: 'vital-signs',
                            status: 'final',
                            enduserId: testEnduser.id,
                            measurement: { unit: 'mmHg', value: 110 },
                            timestamp: oldTimestamp,
                        },
                        {
                            category: 'vital-signs',
                            status: 'final',
                            enduserId: testEnduser.id,
                            measurement: { unit: 'mmHg', value: 115 },
                            timestamp: oldTimestamp,
                        }
                    ])];
            case 4:
                observations = _c.sent();
                console.log("Created observations:", observations.created.map(function (obs) {
                    var _a, _b;
                    return ({
                        id: obs.id,
                        unit: (_a = obs.measurement) === null || _a === void 0 ? void 0 : _a.unit,
                        value: (_b = obs.measurement) === null || _b === void 0 ? void 0 : _b.value,
                        timestamp: obs.timestamp,
                        excludeFromVitalCountLookback: obs.excludeFromVitalCountLookback
                    });
                }));
                return [4 /*yield*/, sdk.api.enduser_observations.getSome({
                        filter: {
                            enduserId: testEnduser.id,
                            category: 'vital-signs'
                        }
                    })];
            case 5:
                currentPeriodVitals = _c.sent();
                last24Hours_1 = new Date(Date.now() - 24 * 60 * 60 * 1000);
                recentVitals = currentPeriodVitals.filter(function (obs) { return new Date(obs.timestamp) >= last24Hours_1; });
                oldVitals = currentPeriodVitals.filter(function (obs) { return new Date(obs.timestamp) < last24Hours_1; });
                console.log("\n=== QUERY ANALYSIS ===");
                console.log("Recent vitals (last 24h): ".concat(recentVitals.length));
                console.log("Old vitals (2+ days ago): ".concat(oldVitals.length));
                console.log("Total vitals for enduser: ".concat(currentPeriodVitals.length));
                // This simulates the first query - endusers with readings in current period
                console.log("\nFirst query result: enduser ".concat(recentVitals.length > 0 ? 'WOULD' : 'would NOT', " be found (has recent vitals)"));
                hasHistoricalReadings = oldVitals.length > 0;
                hasRecentReadings = recentVitals.length > 0;
                console.log("Second query result: enduser ".concat(!hasRecentReadings && hasHistoricalReadings ? 'SHOULD' : 'should NOT', " be found (no recent but has historical)"));
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        title: "Deep Debug Trigger ".concat(Date.now()),
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
                            info: { tags: ['Deep-Debug-No-Vitals'] }
                        }
                    })];
            case 6:
                trigger = _c.sent();
                triggerId = trigger.id;
                console.log("\nCreated trigger: ".concat(trigger.id));
                console.log("Trigger comparison: Less Than 1 (looking for 0 readings)");
                console.log("Trigger units: mmHg");
                console.log("Trigger period: 24 hours");
                // Wait and monitor
                console.log("\n=== MONITORING TRIGGER ===");
                i = 0;
                _c.label = 7;
            case 7:
                if (!(i < 25)) return [3 /*break*/, 12];
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
            case 8:
                _c.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.getOne(triggerId)];
            case 9:
                currentTrigger = _c.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne(enduserId)];
            case 10:
                currentEnduser = _c.sent();
                console.log("[".concat(i + 1, "s] triggerNextAt: ").concat(currentTrigger.triggerNextAt, ", tags: ").concat(JSON.stringify(currentEnduser.tags)));
                if (currentTrigger.triggerNextAt !== trigger.triggerNextAt) {
                    console.log("✅ Trigger processed!");
                    if ((_a = currentEnduser.tags) === null || _a === void 0 ? void 0 : _a.includes('Deep-Debug-No-Vitals')) {
                        console.log("✅ Tag applied! Trigger worked correctly!");
                        return [2 /*return*/];
                    }
                    else {
                        console.log("❌ Trigger processed but no tag applied - this indicates a bug!");
                        console.log("Expected behavior: enduser should be tagged since they have 0 mmHg readings in last 24h but DO have historical readings");
                        return [2 /*return*/];
                    }
                }
                if ((_b = currentEnduser.tags) === null || _b === void 0 ? void 0 : _b.includes('Deep-Debug-No-Vitals')) {
                    console.log("✅ Tag applied!");
                    return [2 /*return*/];
                }
                _c.label = 11;
            case 11:
                i++;
                return [3 /*break*/, 7];
            case 12:
                console.log("❌ No trigger processing or tagging detected in 25 seconds");
                return [3 /*break*/, 18];
            case 13:
                if (!triggerId) return [3 /*break*/, 15];
                return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(triggerId)];
            case 14:
                _c.sent();
                _c.label = 15;
            case 15:
                if (!enduserId) return [3 /*break*/, 17];
                return [4 /*yield*/, sdk.api.endusers.deleteOne(enduserId)];
            case 16:
                _c.sent();
                _c.label = 17;
            case 17: return [7 /*endfinally*/];
            case 18: return [2 /*return*/];
        }
    });
}); };
exports.trigger_deep_debug_tests = trigger_deep_debug_tests;
if (require.main === module) {
    (0, exports.trigger_deep_debug_tests)()
        .then(function () { return process.exit(0); })
        .catch(function (error) {
        console.error("❌ Debug failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=trigger_deep_debug.test.js.map