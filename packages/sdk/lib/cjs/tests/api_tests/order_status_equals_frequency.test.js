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
exports.order_status_equals_frequency_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || 'http://localhost:8080';
// Focused coverage for the optional `frequencies` exact-match filter on the
// "Order Status Equals" automation trigger. Mirrors the fills/skus/protocols
// array-filter pattern: blank/absent -> fires for all, otherwise the order's
// frequency must exactly match one of the listed values.
var order_status_equals_frequency_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var tf1, tf2, tf3, tf4, tf5, ef;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("Order Status Equals - Frequency Filter Tests");
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Order Status Equals', info: { source: 'FreqSource', status: "FreqStatus" } },
                            action: { type: 'Add Tags', info: { tags: ['Freq No Filter'] } },
                            status: 'Active',
                            title: "Frequency - no filter (backward compat)"
                        })];
                case 1:
                    tf1 = _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Order Status Equals', info: { source: 'FreqSource', status: "FreqStatus", frequencies: ['4', '12'] } },
                            action: { type: 'Add Tags', info: { tags: ['Freq Match'] } },
                            status: 'Active',
                            title: "Frequency - multi-value match"
                        })];
                case 2:
                    tf2 = _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Order Status Equals', info: { source: 'FreqSource', status: "FreqStatus", frequencies: [] } },
                            action: { type: 'Add Tags', info: { tags: ['Freq Empty All'] } },
                            status: 'Active',
                            title: "Frequency - empty array means all"
                        })];
                case 3:
                    tf3 = _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Order Status Equals', info: { source: 'FreqSource', status: "FreqShipped", frequencies: ['4'] } },
                            action: { type: 'Add Tags', info: { tags: ['Freq Status Combo'] } },
                            status: 'Active',
                            title: "Frequency + status combination (AND semantics)"
                        })];
                case 4:
                    tf4 = _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Order Status Equals', info: { source: 'FreqSource', status: "FreqStatus", frequencies: ['12'] } },
                            action: { type: 'Add Tags', info: { tags: ['Freq Match 12'] } },
                            status: 'Active',
                            title: "Frequency - second listed value"
                        })];
                case 5:
                    tf5 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 6:
                    ef = _b.sent();
                    _b.label = 7;
                case 7:
                    _b.trys.push([7, , 26, 28]);
                    // Order with NO frequency: no-filter trigger (tf1) and empty-array trigger (tf3) both fire;
                    // populated-filter trigger (tf2) does NOT (missing frequency must never match a populated filter).
                    return [4 /*yield*/, sdk.api.enduser_orders.createOne({ status: 'FreqStatus', source: 'FreqSource', externalId: 'f1', enduserId: ef.id, title: "Freq No Frequency" })];
                case 8:
                    // Order with NO frequency: no-filter trigger (tf1) and empty-array trigger (tf3) both fire;
                    // populated-filter trigger (tf2) does NOT (missing frequency must never match a populated filter).
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)]; // allow triggers to happen
                case 9:
                    _b.sent(); // allow triggers to happen
                    return [4 /*yield*/, (0, testing_1.async_test)("Frequency: no-filter + empty-array fire for order with no frequency (backward compat)", function () { return sdk.api.endusers.getOne(ef.id); }, { onResult: function (e) {
                                var _a, _b, _c, _d;
                                return !!(((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 2
                                    && ((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('Freq No Filter'))
                                    && ((_c = e.tags) === null || _c === void 0 ? void 0 : _c.includes('Freq Empty All'))
                                    && !((_d = e.tags) === null || _d === void 0 ? void 0 : _d.includes('Freq Match')));
                            } })
                        // Order with a frequency NOT in ['4','12'] -> populated-filter trigger still does not fire.
                    ];
                case 10:
                    _b.sent();
                    // Order with a frequency NOT in ['4','12'] -> populated-filter trigger still does not fire.
                    return [4 /*yield*/, sdk.api.enduser_orders.createOne({ status: 'FreqStatus', source: 'FreqSource', externalId: 'f2', enduserId: ef.id, title: "Freq 8", frequency: '8' })];
                case 11:
                    // Order with a frequency NOT in ['4','12'] -> populated-filter trigger still does not fire.
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)]; // allow triggers to happen
                case 12:
                    _b.sent(); // allow triggers to happen
                    return [4 /*yield*/, (0, testing_1.async_test)("Frequency: no match (order frequency '8' not in ['4','12'])", function () { return sdk.api.endusers.getOne(ef.id); }, { onResult: function (e) {
                                var _a, _b;
                                return !!(((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 2
                                    && !((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('Freq Match')));
                            } })
                        // Order with frequency '4' -> ['4','12'] trigger fires.
                    ];
                case 13:
                    _b.sent();
                    // Order with frequency '4' -> ['4','12'] trigger fires.
                    return [4 /*yield*/, sdk.api.enduser_orders.createOne({ status: 'FreqStatus', source: 'FreqSource', externalId: 'f3', enduserId: ef.id, title: "Freq 4", frequency: '4' })];
                case 14:
                    // Order with frequency '4' -> ['4','12'] trigger fires.
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)]; // allow triggers to happen
                case 15:
                    _b.sent(); // allow triggers to happen
                    return [4 /*yield*/, (0, testing_1.async_test)("Frequency: match (order frequency '4' is in ['4','12'])", function () { return sdk.api.endusers.getOne(ef.id); }, { onResult: function (e) {
                                var _a, _b, _c;
                                return !!(((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 3
                                    && ((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('Freq Match'))
                                    && !((_c = e.tags) === null || _c === void 0 ? void 0 : _c.includes('Freq Match 12')));
                            } })
                        // Order with frequency '12' -> the second listed value also matches (tf5 frequencies: ['12']).
                    ];
                case 16:
                    _b.sent();
                    // Order with frequency '12' -> the second listed value also matches (tf5 frequencies: ['12']).
                    return [4 /*yield*/, sdk.api.enduser_orders.createOne({ status: 'FreqStatus', source: 'FreqSource', externalId: 'f4', enduserId: ef.id, title: "Freq 12", frequency: '12' })];
                case 17:
                    // Order with frequency '12' -> the second listed value also matches (tf5 frequencies: ['12']).
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)]; // allow triggers to happen
                case 18:
                    _b.sent(); // allow triggers to happen
                    return [4 /*yield*/, (0, testing_1.async_test)("Frequency: second listed value '12' also matches", function () { return sdk.api.endusers.getOne(ef.id); }, { onResult: function (e) {
                                var _a, _b;
                                return !!(((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 4
                                    && ((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('Freq Match 12')));
                            } })
                        // AND semantics: frequency + status must BOTH match. Right status, wrong frequency -> no fire.
                    ];
                case 19:
                    _b.sent();
                    // AND semantics: frequency + status must BOTH match. Right status, wrong frequency -> no fire.
                    return [4 /*yield*/, sdk.api.enduser_orders.createOne({ status: 'FreqShipped', source: 'FreqSource', externalId: 'f5', enduserId: ef.id, title: "Freq Combo Wrong Freq", frequency: '8' })];
                case 20:
                    // AND semantics: frequency + status must BOTH match. Right status, wrong frequency -> no fire.
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)]; // allow triggers to happen
                case 21:
                    _b.sent(); // allow triggers to happen
                    return [4 /*yield*/, (0, testing_1.async_test)("Frequency + status combo: status matches but frequency does not -> no fire", function () { return sdk.api.endusers.getOne(ef.id); }, { onResult: function (e) {
                                var _a, _b;
                                return !!(((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 4
                                    && !((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('Freq Status Combo')));
                            } })
                        // AND semantics: right status AND right frequency -> fires.
                    ];
                case 22:
                    _b.sent();
                    // AND semantics: right status AND right frequency -> fires.
                    return [4 /*yield*/, sdk.api.enduser_orders.createOne({ status: 'FreqShipped', source: 'FreqSource', externalId: 'f6', enduserId: ef.id, title: "Freq Combo Match", frequency: '4' })];
                case 23:
                    // AND semantics: right status AND right frequency -> fires.
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 500)]; // allow triggers to happen
                case 24:
                    _b.sent(); // allow triggers to happen
                    return [4 /*yield*/, (0, testing_1.async_test)("Frequency + status combo: both match -> fires (AND semantics)", function () { return sdk.api.endusers.getOne(ef.id); }, { onResult: function (e) {
                                var _a, _b;
                                return !!(((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 5
                                    && ((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('Freq Status Combo')));
                            } })];
                case 25:
                    _b.sent();
                    return [3 /*break*/, 28];
                case 26: return [4 /*yield*/, Promise.all([
                        sdk.api.automation_triggers.deleteOne(tf1.id),
                        sdk.api.automation_triggers.deleteOne(tf2.id),
                        sdk.api.automation_triggers.deleteOne(tf3.id),
                        sdk.api.automation_triggers.deleteOne(tf4.id),
                        sdk.api.automation_triggers.deleteOne(tf5.id),
                        sdk.api.endusers.deleteOne(ef.id),
                    ])];
                case 27:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 28: return [2 /*return*/];
            }
        });
    });
};
exports.order_status_equals_frequency_tests = order_status_equals_frequency_tests;
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
                    return [4 /*yield*/, (0, exports.order_status_equals_frequency_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Order Status Equals frequency test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Order Status Equals frequency test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=order_status_equals_frequency.test.js.map