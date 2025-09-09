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
import { log_header } from "@tellescope/testing";
var host = process.env.TEST_URL || 'http://localhost:8080';
var _a = [process.env.TEST_EMAIL, process.env.TEST_PASSWORD], email = _a[0], password = _a[1];
if (!(email && password)) {
    console.error("Set TEST_EMAIL and TEST_PASSWORD");
    process.exit();
}
var sdk = new Session({ host: host });
// Debug trigger creation and inspection
export var trigger_debug_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var triggerId, enduserId, testEnduser, oldTimestamp, observations, last24Hours_1, allVitals, recentVitals, trigger, i, currentTrigger, currentEnduser;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                log_header("Trigger Debug Tests");
                return [4 /*yield*/, sdk.authenticate(email, password)];
            case 1:
                _b.sent();
                _b.label = 2;
            case 2:
                _b.trys.push([2, , 13, 18]);
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 3:
                testEnduser = _b.sent();
                enduserId = testEnduser.id;
                oldTimestamp = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
                ;
                return [4 /*yield*/, sdk.api.enduser_observations.createSome([
                        {
                            category: 'vital-signs',
                            status: 'final',
                            enduserId: testEnduser.id,
                            measurement: { unit: 'mmHg', value: 110 },
                            timestamp: oldTimestamp,
                        }
                    ])];
            case 4:
                observations = _b.sent();
                console.log("Created observations:", observations.created.map(function (obs) {
                    var _a;
                    return ({
                        id: obs.id,
                        unit: (_a = obs.measurement) === null || _a === void 0 ? void 0 : _a.unit,
                        timestamp: obs.timestamp,
                        excludeFromVitalCountLookback: obs.excludeFromVitalCountLookback
                    });
                }));
                last24Hours_1 = new Date(Date.now() - 24 * 60 * 60 * 1000);
                return [4 /*yield*/, sdk.api.enduser_observations.getSome({
                        filter: {
                            enduserId: testEnduser.id,
                            category: 'vital-signs'
                        }
                    })];
            case 5:
                allVitals = _b.sent();
                recentVitals = allVitals.filter(function (obs) { return new Date(obs.timestamp) >= last24Hours_1; });
                console.log("Recent vitals (last 24h): ".concat(recentVitals.length, " observations"));
                console.log("Recent vitals details:", recentVitals.map(function (obs) {
                    var _a;
                    return ({
                        unit: (_a = obs.measurement) === null || _a === void 0 ? void 0 : _a.unit,
                        timestamp: obs.timestamp
                    });
                }));
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        title: "Debug Trigger ".concat(Date.now()),
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
                            info: { tags: ['Debug-No-Vitals'] }
                        }
                    })];
            case 6:
                trigger = _b.sent();
                triggerId = trigger.id;
                console.log("Created trigger:", {
                    id: trigger.id,
                    title: trigger.title,
                    status: trigger.status,
                    triggerNextAt: trigger.triggerNextAt,
                    event: trigger.event,
                    action: trigger.action
                });
                i = 0;
                _b.label = 7;
            case 7:
                if (!(i < 30)) return [3 /*break*/, 12];
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
            case 8:
                _b.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.getOne(triggerId)];
            case 9:
                currentTrigger = _b.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne(enduserId)];
            case 10:
                currentEnduser = _b.sent();
                console.log("[".concat(i + 1, "s] triggerNextAt: ").concat(currentTrigger.triggerNextAt, ", enduser tags: ").concat(JSON.stringify(currentEnduser.tags)));
                if (currentTrigger.triggerNextAt !== trigger.triggerNextAt) {
                    console.log("✅ Trigger processed!");
                    return [3 /*break*/, 12];
                }
                if ((_a = currentEnduser.tags) === null || _a === void 0 ? void 0 : _a.includes('Debug-No-Vitals')) {
                    console.log("✅ Enduser tagged!");
                    return [3 /*break*/, 12];
                }
                _b.label = 11;
            case 11:
                i++;
                return [3 /*break*/, 7];
            case 12: return [3 /*break*/, 18];
            case 13:
                if (!triggerId) return [3 /*break*/, 15];
                return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(triggerId)];
            case 14:
                _b.sent();
                _b.label = 15;
            case 15:
                if (!enduserId) return [3 /*break*/, 17];
                return [4 /*yield*/, sdk.api.endusers.deleteOne(enduserId)];
            case 16:
                _b.sent();
                _b.label = 17;
            case 17: return [7 /*endfinally*/];
            case 18: return [2 /*return*/];
        }
    });
}); };
if (require.main === module) {
    trigger_debug_tests()
        .then(function () { return process.exit(0); })
        .catch(function (error) {
        console.error("❌ Debug failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=trigger_debug.test.js.map