"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.openloop_webhooks_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || 'http://localhost:8080';
var businessId = '60398b1131a295e64f084ff6';
var v1Url = "".concat(host, "/v1/webhooks/openloop/").concat(businessId);
var v2Url = "".concat(host, "/v1/webhooks/openloop-v2/").concat(businessId);
var postJSON = function (url, body) { return __awaiter(void 0, void 0, void 0, function () {
    var res, data, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                })];
            case 1:
                res = _b.sent();
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, res.json()];
            case 3:
                data = _b.sent();
                return [3 /*break*/, 5];
            case 4:
                _a = _b.sent();
                data = null;
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/, { status: res.status, data: data }];
        }
    });
}); };
var postV1 = function (body) { return postJSON(v1Url, body); };
var postV2 = function (body) { return postJSON(v2Url, body); };
var counter = 0;
var uid = function () { return "".concat(Date.now(), "-").concat(++counter); };
var makeV1Confirmation = function (overrides) {
    if (overrides === void 0) { overrides = {}; }
    return (__assign({ type: 'order_confirmation', patientID: 'test-healthie-ol-1', pharmacy: 'Test Pharmacy', medication_instructions: 'Take once daily', shipping_address: '123 Test St', orderNumber: "ol-conf-".concat(uid()), weeksOrdered: 'w4', fill: '1', medicationSKU: 'SKU-100', sku_med: 'Test Medication 10mg' }, overrides));
};
var makeV1Shipped = function (overrides) {
    if (overrides === void 0) { overrides = {}; }
    return (__assign({ type: 'order_shipped', patientID: 'test-healthie-ol-1', pharmacy: 'Test Pharmacy', shipped_date: '2024-07-09', track_number: 'TRACK123', status: 'shipped', order_date: '2024-07-09', orderNumber: "ol-ship-".concat(uid()), fill: '1', medicationSKU: 'SKU-200', sku_med: 'Shipped Med 20mg' }, overrides));
};
var makeV2Payload = function (eventType, overrides) {
    if (overrides === void 0) { overrides = {}; }
    return (__assign({ id: "v2-".concat(uid()), client: 'test-client', eventId: "evt-".concat(uid()), eventType: eventType, chartId: 'chart-1', patientId: 'test-healthie-ol-1', providerId: 'provider-1', medication: 'V2 Test Med', medicationSku: 'v2-sku-001', fill: '1', prescriptionCreatedDate: '2024-01-15' }, overrides));
};
var openloop_webhooks_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var healthieId1, healthieId2, enduser1, enduser2, confOrderNumber_1, shipOrderNumber_1, v2OrderId_1, v2CancelId_1, v2RefundId_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("OpenLoop Webhooks Tests");
                    healthieId1 = 'test-healthie-ol-1';
                    healthieId2 = 'test-healthie-ol-2';
                    return [4 /*yield*/, sdk.api.endusers.createOne({ source: 'Healthie', externalId: healthieId1 })];
                case 1:
                    enduser1 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({ source: 'Healthie', externalId: healthieId2 })];
                case 2:
                    enduser2 = _b.sent();
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, , 25, 28]);
                    // ===== SECTION A: V1 Validation =====
                    (0, testing_1.log_header)("V1 Validation");
                    return [4 /*yield*/, (0, testing_1.async_test)('V1: missing patientID returns 400', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var res;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, postV1({ type: 'order_confirmation', pharmacy: 'x', orderNumber: 'x' })];
                                    case 1:
                                        res = _a.sent();
                                        return [2 /*return*/, res.status];
                                }
                            });
                        }); }, { onResult: function (s) { return s === 400; } })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('V1: unknown patient returns 404', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var res;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, postV1(makeV1Confirmation({ patientID: 'nonexistent-patient-id' }))];
                                    case 1:
                                        res = _a.sent();
                                        return [2 /*return*/, res.status];
                                }
                            });
                        }); }, { onResult: function (s) { return s === 404; } })
                        // ===== SECTION B: V1 order_confirmation =====
                    ];
                case 5:
                    _b.sent();
                    // ===== SECTION B: V1 order_confirmation =====
                    (0, testing_1.log_header)("V1 order_confirmation");
                    confOrderNumber_1 = "ol-conf-fields-".concat(uid());
                    return [4 /*yield*/, (0, testing_1.async_test)('V1: order_confirmation creates EnduserOrder with correct fields', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var res, orders, order;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, postV1(makeV1Confirmation({
                                            patientID: healthieId1,
                                            orderNumber: confOrderNumber_1,
                                            sku_med: 'Test Med 10mg',
                                            pharmacy: 'PharmaCo',
                                            medication_instructions: 'Take daily with food',
                                            shipping_address: '456 Oak Ave',
                                            weeksOrdered: 'w12',
                                            fill: '2',
                                            medicationSKU: 'SKU-ABC',
                                        }))];
                                    case 1:
                                        res = _a.sent();
                                        (0, testing_1.assert)(res.status === 200, "Expected 200, got ".concat(res.status));
                                        return [4 /*yield*/, sdk.api.enduser_orders.getSome({
                                                filter: { source: 'OpenLoop', externalId: confOrderNumber_1 }
                                            })];
                                    case 2:
                                        orders = _a.sent();
                                        (0, testing_1.assert)(orders.length === 1, "Expected 1 order, got ".concat(orders.length));
                                        order = orders[0];
                                        (0, testing_1.assert)(order.enduserId === enduser1.id, 'enduserId mismatch');
                                        (0, testing_1.assert)(order.title === 'Test Med 10mg', "title mismatch: ".concat(order.title));
                                        (0, testing_1.assert)(order.status === 'confirmed', "status mismatch: ".concat(order.status));
                                        (0, testing_1.assert)(order.description === '456 Oak Ave', "description mismatch: ".concat(order.description));
                                        (0, testing_1.assert)(order.instructions === 'Take daily with food', "instructions mismatch: ".concat(order.instructions));
                                        (0, testing_1.assert)(order.frequency === 'w12', "frequency mismatch: ".concat(order.frequency));
                                        (0, testing_1.assert)(order.fill === '2', "fill mismatch: ".concat(order.fill));
                                        (0, testing_1.assert)(order.sku === 'sku-abc', "sku mismatch (should be lowercased): ".concat(order.sku));
                                        return [2 /*return*/, true];
                                }
                            });
                        }); }, { onResult: function (r) { return r === true; } })];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('V1: order_confirmation idempotency - same order not duplicated', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var res, orders;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, postV1(makeV1Confirmation({
                                            patientID: healthieId1,
                                            orderNumber: confOrderNumber_1,
                                            sku_med: 'Different Title',
                                            fill: '99',
                                        }))];
                                    case 1:
                                        res = _a.sent();
                                        (0, testing_1.assert)(res.status === 200, "Expected 200, got ".concat(res.status));
                                        return [4 /*yield*/, sdk.api.enduser_orders.getSome({
                                                filter: { source: 'OpenLoop', externalId: confOrderNumber_1 }
                                            })];
                                    case 2:
                                        orders = _a.sent();
                                        (0, testing_1.assert)(orders.length === 1, "Expected 1 order after duplicate, got ".concat(orders.length));
                                        // $setOnInsert means fields should NOT have changed
                                        (0, testing_1.assert)(orders[0].title === 'Test Med 10mg', "title should not change on duplicate: ".concat(orders[0].title));
                                        (0, testing_1.assert)(orders[0].fill === '2', "fill should not change on duplicate: ".concat(orders[0].fill));
                                        return [2 /*return*/, true];
                                }
                            });
                        }); }, { onResult: function (r) { return r === true; } })];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('V1: order_confirmation without sku_med falls back to pharmacy name', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var orderNum, res, orders;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        orderNum = "ol-conf-fallback-".concat(uid());
                                        return [4 /*yield*/, postV1(makeV1Confirmation({
                                                patientID: healthieId1,
                                                orderNumber: orderNum,
                                                sku_med: undefined,
                                                pharmacy: 'FallbackPharmacy',
                                            }))];
                                    case 1:
                                        res = _a.sent();
                                        (0, testing_1.assert)(res.status === 200, "Expected 200, got ".concat(res.status));
                                        return [4 /*yield*/, sdk.api.enduser_orders.getSome({
                                                filter: { source: 'OpenLoop', externalId: orderNum }
                                            })];
                                    case 2:
                                        orders = _a.sent();
                                        (0, testing_1.assert)(orders.length === 1, "Expected 1 order, got ".concat(orders.length));
                                        (0, testing_1.assert)(orders[0].title === 'OpenLoop: FallbackPharmacy', "title mismatch: ".concat(orders[0].title));
                                        return [2 /*return*/, true];
                                }
                            });
                        }); }, { onResult: function (r) { return r === true; } })
                        // ===== SECTION C: V1 order_shipped =====
                    ];
                case 8:
                    _b.sent();
                    // ===== SECTION C: V1 order_shipped =====
                    (0, testing_1.log_header)("V1 order_shipped");
                    shipOrderNumber_1 = "ol-ship-update-".concat(uid());
                    return [4 /*yield*/, (0, testing_1.async_test)('V1: order_shipped updates existing confirmed order', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var res, orders, order;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: 
                                    // First create a confirmed order
                                    return [4 /*yield*/, postV1(makeV1Confirmation({
                                            patientID: healthieId1,
                                            orderNumber: shipOrderNumber_1,
                                        }))
                                        // Now ship it
                                    ];
                                    case 1:
                                        // First create a confirmed order
                                        _a.sent();
                                        return [4 /*yield*/, postV1(makeV1Shipped({
                                                patientID: healthieId1,
                                                orderNumber: shipOrderNumber_1,
                                                track_number: 'TRACK-ABC',
                                                shipped_date: '2024-07-09',
                                            }))];
                                    case 2:
                                        res = _a.sent();
                                        (0, testing_1.assert)(res.status === 200, "Expected 200, got ".concat(res.status));
                                        return [4 /*yield*/, sdk.api.enduser_orders.getSome({
                                                filter: { source: 'OpenLoop', externalId: shipOrderNumber_1 }
                                            })];
                                    case 3:
                                        orders = _a.sent();
                                        (0, testing_1.assert)(orders.length === 1, "Expected 1 order, got ".concat(orders.length));
                                        order = orders[0];
                                        (0, testing_1.assert)(order.status === 'shipped', "status mismatch: ".concat(order.status));
                                        (0, testing_1.assert)(order.tracking === 'TRACK-ABC', "tracking mismatch: ".concat(order.tracking));
                                        (0, testing_1.assert)(order.shippedDate === '07-09-2024', "shippedDate mismatch (expected MM-DD-YYYY): ".concat(order.shippedDate));
                                        return [2 /*return*/, true];
                                }
                            });
                        }); }, { onResult: function (r) { return r === true; } })];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('V1: order_shipped updates title and sku when provided', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var res, orders, order;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, postV1(makeV1Shipped({
                                            patientID: healthieId1,
                                            orderNumber: shipOrderNumber_1,
                                            sku_med: 'Updated Title From Ship',
                                            medicationSKU: 'NEW-SKU-123',
                                            track_number: 'TRACK-DEF',
                                            shipped_date: '2024-08-15',
                                        }))];
                                    case 1:
                                        res = _a.sent();
                                        (0, testing_1.assert)(res.status === 200, "Expected 200, got ".concat(res.status));
                                        return [4 /*yield*/, sdk.api.enduser_orders.getSome({
                                                filter: { source: 'OpenLoop', externalId: shipOrderNumber_1 }
                                            })];
                                    case 2:
                                        orders = _a.sent();
                                        (0, testing_1.assert)(orders.length === 1, "Expected 1 order, got ".concat(orders.length));
                                        order = orders[0];
                                        (0, testing_1.assert)(order.title === 'Updated Title From Ship', "title mismatch: ".concat(order.title));
                                        (0, testing_1.assert)(order.sku === 'new-sku-123', "sku mismatch (should be lowercased): ".concat(order.sku));
                                        return [2 /*return*/, true];
                                }
                            });
                        }); }, { onResult: function (r) { return r === true; } })];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('V1: order_shipped creates new order if none exists', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var newOrderNum, res, orders, order;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        newOrderNum = "ol-ship-new-".concat(uid());
                                        return [4 /*yield*/, postV1(makeV1Shipped({
                                                patientID: healthieId1,
                                                orderNumber: newOrderNum,
                                                sku_med: 'Direct Ship Med',
                                                track_number: 'TRACK-NEW',
                                                shipped_date: '2024-09-01',
                                                fill: '3',
                                                medicationSKU: 'DIRECT-SKU',
                                            }))];
                                    case 1:
                                        res = _a.sent();
                                        (0, testing_1.assert)(res.status === 200, "Expected 200, got ".concat(res.status));
                                        return [4 /*yield*/, sdk.api.enduser_orders.getSome({
                                                filter: { source: 'OpenLoop', externalId: newOrderNum }
                                            })];
                                    case 2:
                                        orders = _a.sent();
                                        (0, testing_1.assert)(orders.length === 1, "Expected 1 order, got ".concat(orders.length));
                                        order = orders[0];
                                        (0, testing_1.assert)(order.status === 'shipped', "status mismatch: ".concat(order.status));
                                        (0, testing_1.assert)(order.title === 'Direct Ship Med', "title mismatch: ".concat(order.title));
                                        (0, testing_1.assert)(order.tracking === 'TRACK-NEW', "tracking mismatch: ".concat(order.tracking));
                                        (0, testing_1.assert)(order.fill === '3', "fill mismatch: ".concat(order.fill));
                                        (0, testing_1.assert)(order.sku === 'direct-sku', "sku mismatch: ".concat(order.sku));
                                        return [2 /*return*/, true];
                                }
                            });
                        }); }, { onResult: function (r) { return r === true; } })];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('V1: order_shipped can re-ship with updated tracking', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var reshipOrderNum, res, orders;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        reshipOrderNum = "ol-reship-".concat(uid());
                                        // Create and ship
                                        return [4 /*yield*/, postV1(makeV1Confirmation({ patientID: healthieId1, orderNumber: reshipOrderNum }))];
                                    case 1:
                                        // Create and ship
                                        _a.sent();
                                        return [4 /*yield*/, postV1(makeV1Shipped({
                                                patientID: healthieId1,
                                                orderNumber: reshipOrderNum,
                                                track_number: 'TRACK-FIRST',
                                                shipped_date: '2024-07-01',
                                            }))
                                            // Re-ship with new tracking
                                        ];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, postV1(makeV1Shipped({
                                                patientID: healthieId1,
                                                orderNumber: reshipOrderNum,
                                                track_number: 'TRACK-SECOND',
                                                shipped_date: '2024-07-15',
                                            }))];
                                    case 3:
                                        res = _a.sent();
                                        (0, testing_1.assert)(res.status === 200, "Expected 200, got ".concat(res.status));
                                        return [4 /*yield*/, sdk.api.enduser_orders.getSome({
                                                filter: { source: 'OpenLoop', externalId: reshipOrderNum }
                                            })];
                                    case 4:
                                        orders = _a.sent();
                                        (0, testing_1.assert)(orders.length === 1, "Expected 1 order, got ".concat(orders.length));
                                        (0, testing_1.assert)(orders[0].tracking === 'TRACK-SECOND', "tracking should be updated: ".concat(orders[0].tracking));
                                        (0, testing_1.assert)(orders[0].shippedDate === '07-15-2024', "shippedDate should be updated: ".concat(orders[0].shippedDate));
                                        return [2 /*return*/, true];
                                }
                            });
                        }); }, { onResult: function (r) { return r === true; } })
                        // ===== SECTION D: V1 enduserId Isolation =====
                    ];
                case 12:
                    _b.sent();
                    // ===== SECTION D: V1 enduserId Isolation =====
                    (0, testing_1.log_header)("V1 enduserId Isolation");
                    return [4 /*yield*/, (0, testing_1.async_test)('V1: same orderNumber for different endusers creates separate orders', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var sharedOrderNum, res1, res2, orders, enduserIds, expected;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        sharedOrderNum = "ol-shared-".concat(uid());
                                        return [4 /*yield*/, postV1(makeV1Confirmation({
                                                patientID: healthieId1,
                                                orderNumber: sharedOrderNum,
                                            }))];
                                    case 1:
                                        res1 = _a.sent();
                                        (0, testing_1.assert)(res1.status === 200, "enduser1 confirm failed: ".concat(res1.status));
                                        return [4 /*yield*/, postV1(makeV1Confirmation({
                                                patientID: healthieId2,
                                                orderNumber: sharedOrderNum,
                                            }))];
                                    case 2:
                                        res2 = _a.sent();
                                        (0, testing_1.assert)(res2.status === 200, "enduser2 confirm failed: ".concat(res2.status));
                                        return [4 /*yield*/, sdk.api.enduser_orders.getSome({
                                                filter: { source: 'OpenLoop', externalId: sharedOrderNum }
                                            })];
                                    case 3:
                                        orders = _a.sent();
                                        (0, testing_1.assert)(orders.length === 2, "Expected 2 separate orders, got ".concat(orders.length));
                                        enduserIds = orders.map(function (o) { return o.enduserId; }).sort();
                                        expected = [enduser1.id, enduser2.id].sort();
                                        (0, testing_1.assert)(enduserIds[0] === expected[0] && enduserIds[1] === expected[1], "Orders should belong to different endusers: ".concat(JSON.stringify(enduserIds), " vs ").concat(JSON.stringify(expected)));
                                        return [2 /*return*/, true];
                                }
                            });
                        }); }, { onResult: function (r) { return r === true; } })
                        // ===== SECTION E: V2 Validation =====
                    ];
                case 13:
                    _b.sent();
                    // ===== SECTION E: V2 Validation =====
                    (0, testing_1.log_header)("V2 Validation");
                    return [4 /*yield*/, (0, testing_1.async_test)('V2: missing patientId returns 400', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var res;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, postV2({
                                            id: 'test', eventType: 'prescription-created', medication: 'x',
                                            medicationSku: 'x', fill: '1', prescriptionCreatedDate: '2024-01-01',
                                        })];
                                    case 1:
                                        res = _a.sent();
                                        return [2 /*return*/, res.status];
                                }
                            });
                        }); }, { onResult: function (s) { return s === 400; } })];
                case 14:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('V2: invalid eventType returns 400', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var res;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, postV2(makeV2Payload('invalid-event-type'))];
                                    case 1:
                                        res = _a.sent();
                                        return [2 /*return*/, res.status];
                                }
                            });
                        }); }, { onResult: function (s) { return s === 400; } })];
                case 15:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('V2: unknown patient returns 404', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var res;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, postV2(makeV2Payload('prescription-created', { patientId: 'nonexistent-v2' }))];
                                    case 1:
                                        res = _a.sent();
                                        return [2 /*return*/, res.status];
                                }
                            });
                        }); }, { onResult: function (s) { return s === 404; } })
                        // ===== SECTION F: V2 Order Lifecycle =====
                    ];
                case 16:
                    _b.sent();
                    // ===== SECTION F: V2 Order Lifecycle =====
                    (0, testing_1.log_header)("V2 Order Lifecycle");
                    v2OrderId_1 = "v2-lifecycle-".concat(uid());
                    return [4 /*yield*/, (0, testing_1.async_test)('V2: prescription-created creates order with correct fields', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var res, orders, order;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, postV2(makeV2Payload('prescription-created', {
                                            id: v2OrderId_1,
                                            patientId: healthieId1,
                                            medication: 'Lisinopril 10mg',
                                            medicationSku: 'LIS-010',
                                            fill: '2',
                                        }))];
                                    case 1:
                                        res = _a.sent();
                                        (0, testing_1.assert)(res.status === 200, "Expected 200, got ".concat(res.status));
                                        return [4 /*yield*/, sdk.api.enduser_orders.getSome({
                                                filter: { source: 'OpenLoop', externalId: v2OrderId_1 }
                                            })];
                                    case 2:
                                        orders = _a.sent();
                                        (0, testing_1.assert)(orders.length === 1, "Expected 1 order, got ".concat(orders.length));
                                        order = orders[0];
                                        (0, testing_1.assert)(order.enduserId === enduser1.id, 'enduserId mismatch');
                                        (0, testing_1.assert)(order.status === 'created', "status mismatch: ".concat(order.status));
                                        (0, testing_1.assert)(order.title === 'Lisinopril 10mg', "title mismatch: ".concat(order.title));
                                        (0, testing_1.assert)(order.fill === '2', "fill mismatch: ".concat(order.fill));
                                        (0, testing_1.assert)(order.sku === 'lis-010', "sku mismatch (should be lowercased): ".concat(order.sku));
                                        return [2 /*return*/, true];
                                }
                            });
                        }); }, { onResult: function (r) { return r === true; } })];
                case 17:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('V2: prescription-shipped updates with carrier and tracking', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var res, orders, order;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, postV2(makeV2Payload('prescription-shipped', {
                                            id: v2OrderId_1,
                                            patientId: healthieId1,
                                            carrier: 'USPS',
                                            carrierTrackingId: 'V2-TRACK-001',
                                            prescriptionCarrierDate: '2024-02-20',
                                            pharmacy: 'CVS',
                                        }))];
                                    case 1:
                                        res = _a.sent();
                                        (0, testing_1.assert)(res.status === 200, "Expected 200, got ".concat(res.status));
                                        return [4 /*yield*/, sdk.api.enduser_orders.getSome({
                                                filter: { source: 'OpenLoop', externalId: v2OrderId_1 }
                                            })];
                                    case 2:
                                        orders = _a.sent();
                                        (0, testing_1.assert)(orders.length === 1, "Expected 1 order, got ".concat(orders.length));
                                        order = orders[0];
                                        (0, testing_1.assert)(order.status === 'shipped', "status mismatch: ".concat(order.status));
                                        (0, testing_1.assert)(order.carrier === 'USPS', "carrier mismatch: ".concat(order.carrier));
                                        (0, testing_1.assert)(order.tracking === 'V2-TRACK-001', "tracking mismatch: ".concat(order.tracking));
                                        (0, testing_1.assert)(order.shippedDate === '2024-02-20', "shippedDate mismatch: ".concat(order.shippedDate));
                                        (0, testing_1.assert)(order.pharmacy === 'CVS', "pharmacy mismatch: ".concat(order.pharmacy));
                                        return [2 /*return*/, true];
                                }
                            });
                        }); }, { onResult: function (r) { return r === true; } })];
                case 18:
                    _b.sent();
                    v2CancelId_1 = "v2-cancel-".concat(uid());
                    return [4 /*yield*/, (0, testing_1.async_test)('V2: prescription-cancelled sets cancelledDate and reason', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var res, orders, order;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: 
                                    // Create first
                                    return [4 /*yield*/, postV2(makeV2Payload('prescription-created', {
                                            id: v2CancelId_1,
                                            patientId: healthieId1,
                                        }))
                                        // Cancel
                                    ];
                                    case 1:
                                        // Create first
                                        _a.sent();
                                        return [4 /*yield*/, postV2(makeV2Payload('prescription-cancelled', {
                                                id: v2CancelId_1,
                                                patientId: healthieId1,
                                                prescriptionCancelledDate: '2024-03-01',
                                                prescriptionCancellationReason: 'Patient request',
                                            }))];
                                    case 2:
                                        res = _a.sent();
                                        (0, testing_1.assert)(res.status === 200, "Expected 200, got ".concat(res.status));
                                        return [4 /*yield*/, sdk.api.enduser_orders.getSome({
                                                filter: { source: 'OpenLoop', externalId: v2CancelId_1 }
                                            })];
                                    case 3:
                                        orders = _a.sent();
                                        (0, testing_1.assert)(orders.length === 1, "Expected 1 order, got ".concat(orders.length));
                                        order = orders[0];
                                        (0, testing_1.assert)(order.status === 'cancelled', "status mismatch: ".concat(order.status));
                                        (0, testing_1.assert)(order.cancelledDate === '2024-03-01', "cancelledDate mismatch: ".concat(order.cancelledDate));
                                        (0, testing_1.assert)(order.cancellationReason === 'Patient request', "cancellationReason mismatch: ".concat(order.cancellationReason));
                                        return [2 /*return*/, true];
                                }
                            });
                        }); }, { onResult: function (r) { return r === true; } })];
                case 19:
                    _b.sent();
                    v2RefundId_1 = "v2-refund-".concat(uid());
                    return [4 /*yield*/, (0, testing_1.async_test)('V2: prescription-refunded sets status', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var res, orders;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, postV2(makeV2Payload('prescription-created', {
                                            id: v2RefundId_1,
                                            patientId: healthieId1,
                                        }))];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, postV2(makeV2Payload('prescription-refunded', {
                                                id: v2RefundId_1,
                                                patientId: healthieId1,
                                                prescriptionRefundedDate: '2024-04-01',
                                            }))];
                                    case 2:
                                        res = _a.sent();
                                        (0, testing_1.assert)(res.status === 200, "Expected 200, got ".concat(res.status));
                                        return [4 /*yield*/, sdk.api.enduser_orders.getSome({
                                                filter: { source: 'OpenLoop', externalId: v2RefundId_1 }
                                            })];
                                    case 3:
                                        orders = _a.sent();
                                        (0, testing_1.assert)(orders.length === 1, "Expected 1 order, got ".concat(orders.length));
                                        (0, testing_1.assert)(orders[0].status === 'refunded', "status mismatch: ".concat(orders[0].status));
                                        return [2 /*return*/, true];
                                }
                            });
                        }); }, { onResult: function (r) { return r === true; } })
                        // ===== SECTION G: V2 Idempotency & Isolation =====
                    ];
                case 20:
                    _b.sent();
                    // ===== SECTION G: V2 Idempotency & Isolation =====
                    (0, testing_1.log_header)("V2 Idempotency & Isolation");
                    return [4 /*yield*/, (0, testing_1.async_test)('V2: idempotency - same id and patientId does not create duplicate', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var idempotentId, orders;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        idempotentId = "v2-idemp-".concat(uid());
                                        return [4 /*yield*/, postV2(makeV2Payload('prescription-created', {
                                                id: idempotentId,
                                                patientId: healthieId1,
                                            }))];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, postV2(makeV2Payload('prescription-created', {
                                                id: idempotentId,
                                                patientId: healthieId1,
                                            }))];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, sdk.api.enduser_orders.getSome({
                                                filter: { source: 'OpenLoop', externalId: idempotentId }
                                            })];
                                    case 3:
                                        orders = _a.sent();
                                        (0, testing_1.assert)(orders.length === 1, "Expected 1 order after duplicate, got ".concat(orders.length));
                                        return [2 /*return*/, true];
                                }
                            });
                        }); }, { onResult: function (r) { return r === true; } })];
                case 21:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('V2: same id for different patients creates separate orders', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var sharedV2Id, res1, res2, orders, enduserIds, expected;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        sharedV2Id = "v2-shared-".concat(uid());
                                        return [4 /*yield*/, postV2(makeV2Payload('prescription-created', {
                                                id: sharedV2Id,
                                                patientId: healthieId1,
                                            }))];
                                    case 1:
                                        res1 = _a.sent();
                                        (0, testing_1.assert)(res1.status === 200, "enduser1 create failed: ".concat(res1.status));
                                        return [4 /*yield*/, postV2(makeV2Payload('prescription-created', {
                                                id: sharedV2Id,
                                                patientId: healthieId2,
                                            }))];
                                    case 2:
                                        res2 = _a.sent();
                                        (0, testing_1.assert)(res2.status === 200, "enduser2 create failed: ".concat(res2.status));
                                        return [4 /*yield*/, sdk.api.enduser_orders.getSome({
                                                filter: { source: 'OpenLoop', externalId: sharedV2Id }
                                            })];
                                    case 3:
                                        orders = _a.sent();
                                        (0, testing_1.assert)(orders.length === 2, "Expected 2 separate orders, got ".concat(orders.length));
                                        enduserIds = orders.map(function (o) { return o.enduserId; }).sort();
                                        expected = [enduser1.id, enduser2.id].sort();
                                        (0, testing_1.assert)(enduserIds[0] === expected[0] && enduserIds[1] === expected[1], "Orders should belong to different endusers");
                                        return [2 /*return*/, true];
                                }
                            });
                        }); }, { onResult: function (r) { return r === true; } })
                        // ===== SECTION H: V2 Full Lifecycle =====
                    ];
                case 22:
                    _b.sent();
                    // ===== SECTION H: V2 Full Lifecycle =====
                    (0, testing_1.log_header)("V2 Full Lifecycle");
                    return [4 /*yield*/, (0, testing_1.async_test)('V2: sequential status progression through full lifecycle', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var lifecycleId, base, steps, _i, steps_1, step, res, orders;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        lifecycleId = "v2-full-".concat(uid());
                                        base = { id: lifecycleId, patientId: healthieId1 };
                                        steps = [
                                            { eventType: 'prescription-created', expectedStatus: 'created' },
                                            { eventType: 'prescription-invoiced', expectedStatus: 'invoiced' },
                                            { eventType: 'prescription-paid', expectedStatus: 'paid' },
                                            { eventType: 'prescription-ordered', expectedStatus: 'ordered' },
                                            { eventType: 'prescription-shipped', expectedStatus: 'shipped', extras: { carrier: 'FedEx', carrierTrackingId: 'FX-999' } },
                                        ];
                                        _i = 0, steps_1 = steps;
                                        _a.label = 1;
                                    case 1:
                                        if (!(_i < steps_1.length)) return [3 /*break*/, 5];
                                        step = steps_1[_i];
                                        return [4 /*yield*/, postV2(makeV2Payload(step.eventType, __assign(__assign({}, base), (step.extras || {}))))];
                                    case 2:
                                        res = _a.sent();
                                        (0, testing_1.assert)(res.status === 200, "".concat(step.eventType, " failed: ").concat(res.status));
                                        return [4 /*yield*/, sdk.api.enduser_orders.getSome({
                                                filter: { source: 'OpenLoop', externalId: lifecycleId }
                                            })];
                                    case 3:
                                        orders = _a.sent();
                                        (0, testing_1.assert)(orders.length === 1, "Expected 1 order at ".concat(step.eventType, ", got ").concat(orders.length));
                                        (0, testing_1.assert)(orders[0].status === step.expectedStatus, "After ".concat(step.eventType, ": expected status '").concat(step.expectedStatus, "', got '").concat(orders[0].status, "'"));
                                        _a.label = 4;
                                    case 4:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 5: return [2 /*return*/, true];
                                }
                            });
                        }); }, { onResult: function (r) { return r === true; } })
                        // ===== SECTION I: V2 Undefined Field Handling =====
                    ];
                case 23:
                    _b.sent();
                    // ===== SECTION I: V2 Undefined Field Handling =====
                    (0, testing_1.log_header)("V2 Undefined Field Handling");
                    return [4 /*yield*/, (0, testing_1.async_test)('V2: optional fields not written when absent', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var minimalId, res, orders, order;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        minimalId = "v2-minimal-".concat(uid());
                                        return [4 /*yield*/, postV2({
                                                id: minimalId,
                                                client: 'test',
                                                eventId: "evt-".concat(uid()),
                                                eventType: 'prescription-created',
                                                chartId: 'chart-1',
                                                patientId: healthieId1,
                                                providerId: 'prov-1',
                                                medication: 'Minimal Med',
                                                medicationSku: 'min-sku',
                                                fill: '1',
                                                prescriptionCreatedDate: '2024-01-01',
                                                // Intentionally omitting: pharmacy, carrier, carrierTrackingId,
                                                // prescriptionCancelledDate, prescriptionCancellationReason, etc.
                                            })];
                                    case 1:
                                        res = _a.sent();
                                        (0, testing_1.assert)(res.status === 200, "Expected 200, got ".concat(res.status));
                                        return [4 /*yield*/, sdk.api.enduser_orders.getSome({
                                                filter: { source: 'OpenLoop', externalId: minimalId }
                                            })];
                                    case 2:
                                        orders = _a.sent();
                                        (0, testing_1.assert)(orders.length === 1, "Expected 1 order, got ".concat(orders.length));
                                        order = orders[0];
                                        (0, testing_1.assert)(order.carrier === undefined, "carrier should be undefined, got: ".concat(order.carrier));
                                        (0, testing_1.assert)(order.tracking === undefined, "tracking should be undefined, got: ".concat(order.tracking));
                                        (0, testing_1.assert)(order.pharmacy === undefined, "pharmacy should be undefined, got: ".concat(order.pharmacy));
                                        (0, testing_1.assert)(order.cancelledDate === undefined, "cancelledDate should be undefined, got: ".concat(order.cancelledDate));
                                        (0, testing_1.assert)(order.cancellationReason === undefined, "cancellationReason should be undefined, got: ".concat(order.cancellationReason));
                                        return [2 /*return*/, true];
                                }
                            });
                        }); }, { onResult: function (r) { return r === true; } })];
                case 24:
                    _b.sent();
                    console.log("All OpenLoop webhook tests passed!");
                    return [3 /*break*/, 28];
                case 25: return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser1.id).catch(console.error)];
                case 26:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser2.id).catch(console.error)];
                case 27:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 28: return [2 /*return*/];
            }
        });
    });
};
exports.openloop_webhooks_tests = openloop_webhooks_tests;
// Allow running this test file independently
if (require.main === module) {
    console.log("Using API URL: ".concat(host));
    var sdk_2 = new sdk_1.Session({ host: host });
    var sdkNonAdmin_1 = new sdk_1.Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, setup_1.setup_tests)(sdk_2, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, exports.openloop_webhooks_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("OpenLoop webhooks test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("OpenLoop webhooks test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=openloop_webhooks.test.js.map