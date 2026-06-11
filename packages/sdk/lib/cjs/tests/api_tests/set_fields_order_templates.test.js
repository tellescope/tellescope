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
exports.set_fields_order_templates_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || 'http://localhost:8080';
var TRIGGER_TITLE_BLOCK_A = "Order Templates: Block A";
var TRIGGER_TITLE_BLOCK_B = "Order Templates: Block B";
var buildSetFieldsAction = function (prefix) { return ({
    type: 'Set Fields',
    info: {
        fields: [
            { name: "".concat(prefix, "_status"), value: '{{order.status}}', type: 'Custom Value' },
            { name: "".concat(prefix, "_tracking"), value: '{{order.tracking}}', type: 'Custom Value' },
            { name: "".concat(prefix, "_carrier"), value: '{{order.carrier}}', type: 'Custom Value' },
            { name: "".concat(prefix, "_sku"), value: '{{order.sku}}', type: 'Custom Value' },
            { name: "".concat(prefix, "_externalId"), value: '{{order.externalId}}', type: 'Custom Value' },
            { name: "".concat(prefix, "_id"), value: '{{order.id}}', type: 'Custom Value' },
            { name: "".concat(prefix, "_protocol"), value: '{{order.protocol}}', type: 'Custom Value' },
        ],
    },
}); };
// Block A: Direct EnduserOrder creation path
var direct_order_creation_block = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var enduser, trigger, createdOrderId, nonMatchingOrderId, order_1, beforeNonMatch, snapshot_1, nonMatching;
        var _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    (0, testing_1.log_header)("Block A: Direct EnduserOrder creation -> {{order.*}} in Set Fields");
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 1:
                    enduser = _j.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            title: TRIGGER_TITLE_BLOCK_A,
                            status: 'Active',
                            event: { type: 'Order Status Equals', info: { source: 'Beluga', status: 'Shipped' } },
                            action: buildSetFieldsAction('pharmacy'),
                        })];
                case 2:
                    trigger = _j.sent();
                    _j.label = 3;
                case 3:
                    _j.trys.push([3, , 11, 18]);
                    return [4 /*yield*/, sdk.api.enduser_orders.createOne({
                            enduserId: enduser.id,
                            source: 'Beluga',
                            status: 'Shipped',
                            title: 'Beluga Pharmacy Order',
                            externalId: 'EXT-A-123',
                            tracking: '1Z-AAA',
                            carrier: 'UPS',
                            sku: 'SKU-A',
                            protocol: 'wl1',
                        })];
                case 4:
                    order_1 = _j.sent();
                    createdOrderId = order_1.id;
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 250)]; // allow trigger + Set Fields to run
                case 5:
                    _j.sent(); // allow trigger + Set Fields to run
                    return [4 /*yield*/, (0, testing_1.async_test)("Block A: {{order.*}} templates resolve to literal values", function () { return sdk.api.endusers.getOne(enduser.id); }, { onResult: function (e) {
                                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                                return !!(((_a = e.fields) === null || _a === void 0 ? void 0 : _a.pharmacy_status) === 'Shipped'
                                    && ((_b = e.fields) === null || _b === void 0 ? void 0 : _b.pharmacy_tracking) === '1Z-AAA'
                                    && ((_c = e.fields) === null || _c === void 0 ? void 0 : _c.pharmacy_carrier) === 'UPS'
                                    && ((_d = e.fields) === null || _d === void 0 ? void 0 : _d.pharmacy_sku) === 'SKU-A'
                                    && ((_e = e.fields) === null || _e === void 0 ? void 0 : _e.pharmacy_externalId) === 'EXT-A-123'
                                    && ((_f = e.fields) === null || _f === void 0 ? void 0 : _f.pharmacy_protocol) === 'wl1'
                                    && typeof ((_g = e.fields) === null || _g === void 0 ? void 0 : _g.pharmacy_id) === 'string'
                                    && ((_h = e.fields) === null || _h === void 0 ? void 0 : _h.pharmacy_id).length > 0
                                    && ((_j = e.fields) === null || _j === void 0 ? void 0 : _j.pharmacy_id) === order_1.id);
                            } })
                        // Negative case: status that doesn't match the trigger should NOT alter fields
                    ];
                case 6:
                    _j.sent();
                    return [4 /*yield*/, sdk.api.endusers.getOne(enduser.id)];
                case 7:
                    beforeNonMatch = _j.sent();
                    snapshot_1 = {
                        pharmacy_status: (_b = beforeNonMatch.fields) === null || _b === void 0 ? void 0 : _b.pharmacy_status,
                        pharmacy_tracking: (_c = beforeNonMatch.fields) === null || _c === void 0 ? void 0 : _c.pharmacy_tracking,
                        pharmacy_carrier: (_d = beforeNonMatch.fields) === null || _d === void 0 ? void 0 : _d.pharmacy_carrier,
                        pharmacy_sku: (_e = beforeNonMatch.fields) === null || _e === void 0 ? void 0 : _e.pharmacy_sku,
                        pharmacy_externalId: (_f = beforeNonMatch.fields) === null || _f === void 0 ? void 0 : _f.pharmacy_externalId,
                        pharmacy_id: (_g = beforeNonMatch.fields) === null || _g === void 0 ? void 0 : _g.pharmacy_id,
                        pharmacy_protocol: (_h = beforeNonMatch.fields) === null || _h === void 0 ? void 0 : _h.pharmacy_protocol,
                    };
                    return [4 /*yield*/, sdk.api.enduser_orders.createOne({
                            enduserId: enduser.id,
                            source: 'Beluga',
                            status: 'In Fulfillment',
                            title: 'Beluga Pharmacy Order (other status)',
                            externalId: 'EXT-A-NOMATCH',
                            tracking: 'NOPE',
                            carrier: 'NoCarrier',
                            sku: 'SKU-NOPE',
                            protocol: 'nope',
                        })];
                case 8:
                    nonMatching = _j.sent();
                    nonMatchingOrderId = nonMatching.id;
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 250)];
                case 9:
                    _j.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Block A: non-matching status leaves fields unchanged", function () { return sdk.api.endusers.getOne(enduser.id); }, { onResult: function (e) {
                                var _a, _b, _c, _d, _e, _f, _g;
                                return !!(((_a = e.fields) === null || _a === void 0 ? void 0 : _a.pharmacy_status) === snapshot_1.pharmacy_status
                                    && ((_b = e.fields) === null || _b === void 0 ? void 0 : _b.pharmacy_tracking) === snapshot_1.pharmacy_tracking
                                    && ((_c = e.fields) === null || _c === void 0 ? void 0 : _c.pharmacy_carrier) === snapshot_1.pharmacy_carrier
                                    && ((_d = e.fields) === null || _d === void 0 ? void 0 : _d.pharmacy_sku) === snapshot_1.pharmacy_sku
                                    && ((_e = e.fields) === null || _e === void 0 ? void 0 : _e.pharmacy_externalId) === snapshot_1.pharmacy_externalId
                                    && ((_f = e.fields) === null || _f === void 0 ? void 0 : _f.pharmacy_id) === snapshot_1.pharmacy_id
                                    && ((_g = e.fields) === null || _g === void 0 ? void 0 : _g.pharmacy_protocol) === snapshot_1.pharmacy_protocol);
                            } })];
                case 10:
                    _j.sent();
                    return [3 /*break*/, 18];
                case 11:
                    if (!createdOrderId) return [3 /*break*/, 13];
                    return [4 /*yield*/, sdk.api.enduser_orders.deleteOne(createdOrderId).catch(console.error)];
                case 12:
                    _j.sent();
                    _j.label = 13;
                case 13:
                    if (!nonMatchingOrderId) return [3 /*break*/, 15];
                    return [4 /*yield*/, sdk.api.enduser_orders.deleteOne(nonMatchingOrderId).catch(console.error)];
                case 14:
                    _j.sent();
                    _j.label = 15;
                case 15: return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(trigger.id).catch(console.error)];
                case 16:
                    _j.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id).catch(console.error)];
                case 17:
                    _j.sent();
                    return [7 /*endfinally*/];
                case 18: return [2 /*return*/];
            }
        });
    });
};
// Block B: Beluga webhook integration path
var beluga_webhook_block = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var webhookUrl, externalOrderId, enduser, form, formResponse, trigger, deliveredTrigger, shippedRes, deliveredRes, orders, _i, orders_1, o, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("Block B: Beluga webhook -> {{order.*}} in Set Fields");
                    webhookUrl = "".concat(host, "/v1/webhooks/beluga");
                    externalOrderId = "EXT-B-".concat(Date.now());
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 1:
                    enduser = _b.sent();
                    return [4 /*yield*/, sdk.api.forms.createOne({ title: 'Order Templates Beluga Form' })];
                case 2:
                    form = _b.sent();
                    return [4 /*yield*/, sdk.api.form_responses.createOne({
                            formId: form.id,
                            enduserId: enduser.id,
                            formTitle: form.title,
                        })];
                case 3:
                    formResponse = _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            title: TRIGGER_TITLE_BLOCK_B,
                            status: 'Active',
                            event: { type: 'Order Status Equals', info: { source: 'Beluga', status: 'Shipped' } },
                            action: buildSetFieldsAction('pharmacy'),
                        })];
                case 4:
                    trigger = _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            title: "".concat(TRIGGER_TITLE_BLOCK_B, " (Delivered)"),
                            status: 'Active',
                            event: { type: 'Order Status Equals', info: { source: 'Beluga', status: 'Delivered' } },
                            action: buildSetFieldsAction('pharmacy'),
                        })];
                case 5:
                    deliveredTrigger = _b.sent();
                    _b.label = 6;
                case 6:
                    _b.trys.push([6, , 13, 26]);
                    return [4 /*yield*/, fetch(webhookUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                masterId: "tellescope_".concat(formResponse.id),
                                event: 'PHARMACY_ORDER_SHIPPED',
                                orderId: externalOrderId,
                                info: { carrier: 'FedEx', tracking: '7777-BBB' },
                            }),
                        })];
                case 7:
                    shippedRes = _b.sent();
                    (0, testing_1.assert)(shippedRes.status === 200, "Beluga webhook (shipped) expected 200, got ".concat(shippedRes.status));
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 250)]; // webhook upsert + trigger + Set Fields
                case 8:
                    _b.sent(); // webhook upsert + trigger + Set Fields
                    return [4 /*yield*/, (0, testing_1.async_test)("Block B: Beluga PHARMACY_ORDER_SHIPPED resolves {{order.*}} into enduser fields", function () { return sdk.api.endusers.getOne(enduser.id); }, { onResult: function (e) {
                                var _a, _b, _c, _d, _e, _f, _g, _h;
                                return !!(((_a = e.fields) === null || _a === void 0 ? void 0 : _a.pharmacy_status) === 'Shipped'
                                    && ((_b = e.fields) === null || _b === void 0 ? void 0 : _b.pharmacy_tracking) === '7777-BBB'
                                    && ((_c = e.fields) === null || _c === void 0 ? void 0 : _c.pharmacy_carrier) === 'FedEx'
                                    && ((_d = e.fields) === null || _d === void 0 ? void 0 : _d.pharmacy_externalId) === externalOrderId
                                    && typeof ((_e = e.fields) === null || _e === void 0 ? void 0 : _e.pharmacy_id) === 'string'
                                    && ((_f = e.fields) === null || _f === void 0 ? void 0 : _f.pharmacy_id).length > 0
                                    // Webhook does not set sku/protocol -> default branch in helper -> ''
                                    && ((_g = e.fields) === null || _g === void 0 ? void 0 : _g.pharmacy_sku) === ''
                                    && ((_h = e.fields) === null || _h === void 0 ? void 0 : _h.pharmacy_protocol) === '');
                            } })
                        // Step 2: PHARMACY_ORDER_DELIVERED for the same order
                    ];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, fetch(webhookUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                masterId: "tellescope_".concat(formResponse.id),
                                event: 'PHARMACY_ORDER_DELIVERED',
                                orderId: externalOrderId,
                            }),
                        })];
                case 10:
                    deliveredRes = _b.sent();
                    (0, testing_1.assert)(deliveredRes.status === 200, "Beluga webhook (delivered) expected 200, got ".concat(deliveredRes.status));
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 250)];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Block B: PHARMACY_ORDER_DELIVERED flips pharmacy_status to 'Delivered'", function () { return sdk.api.endusers.getOne(enduser.id); }, { onResult: function (e) {
                                var _a, _b;
                                return !!(((_a = e.fields) === null || _a === void 0 ? void 0 : _a.pharmacy_status) === 'Delivered'
                                    && ((_b = e.fields) === null || _b === void 0 ? void 0 : _b.pharmacy_externalId) === externalOrderId);
                            } })];
                case 12:
                    _b.sent();
                    return [3 /*break*/, 26];
                case 13:
                    _b.trys.push([13, 19, , 20]);
                    return [4 /*yield*/, sdk.api.enduser_orders.getSome({
                            filter: { source: 'Beluga', externalId: externalOrderId },
                        })];
                case 14:
                    orders = _b.sent();
                    _i = 0, orders_1 = orders;
                    _b.label = 15;
                case 15:
                    if (!(_i < orders_1.length)) return [3 /*break*/, 18];
                    o = orders_1[_i];
                    return [4 /*yield*/, sdk.api.enduser_orders.deleteOne(o.id).catch(console.error)];
                case 16:
                    _b.sent();
                    _b.label = 17;
                case 17:
                    _i++;
                    return [3 /*break*/, 15];
                case 18: return [3 /*break*/, 20];
                case 19:
                    err_1 = _b.sent();
                    console.error(err_1);
                    return [3 /*break*/, 20];
                case 20: return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(trigger.id).catch(console.error)];
                case 21:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(deliveredTrigger.id).catch(console.error)];
                case 22:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.form_responses.deleteOne(formResponse.id).catch(console.error)];
                case 23:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.forms.deleteOne(form.id).catch(console.error)];
                case 24:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id).catch(console.error)];
                case 25:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 26: return [2 /*return*/];
            }
        });
    });
};
// Block C: Beluga tracking status update events (PACKAGE_*)
var beluga_tracking_status_block = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var webhookUrl, externalOrderId, trackingUrl, enduser, form, formResponse, inTransitTrigger, postEvent, getOrder, deliveredDate_1, orders, _i, orders_2, o, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("Block C: Beluga tracking status updates (PACKAGE_* events)");
                    webhookUrl = "".concat(host, "/v1/webhooks/beluga");
                    externalOrderId = "EXT-C-".concat(Date.now());
                    trackingUrl = 'https://tools.usps.com/go/TrackConfirmAction?tLabels=9400-CCC';
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 1:
                    enduser = _b.sent();
                    return [4 /*yield*/, sdk.api.forms.createOne({ title: 'Tracking Status Beluga Form' })];
                case 2:
                    form = _b.sent();
                    return [4 /*yield*/, sdk.api.form_responses.createOne({
                            formId: form.id,
                            enduserId: enduser.id,
                            formTitle: form.title,
                        })];
                case 3:
                    formResponse = _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            title: "".concat(TRIGGER_TITLE_BLOCK_B, " (In Transit)"),
                            status: 'Active',
                            event: { type: 'Order Status Equals', info: { source: 'Beluga', status: 'In Transit' } },
                            action: buildSetFieldsAction('pharmacy'),
                        })];
                case 4:
                    inTransitTrigger = _b.sent();
                    postEvent = function (event, info) { return __awaiter(void 0, void 0, void 0, function () {
                        var res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, fetch(webhookUrl, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(__assign({ masterId: "tellescope_".concat(formResponse.id), event: event, orderId: externalOrderId }, info ? { info: info } : {})),
                                    })];
                                case 1:
                                    res = _a.sent();
                                    (0, testing_1.assert)(res.status === 200, "Beluga webhook (".concat(event, ") expected 200, got ").concat(res.status));
                                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 250)]; // webhook upsert + trigger + Set Fields
                                case 2:
                                    _a.sent(); // webhook upsert + trigger + Set Fields
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    getOrder = function () { return __awaiter(void 0, void 0, void 0, function () {
                        var orders;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, sdk.api.enduser_orders.getSome({
                                        filter: { source: 'Beluga', externalId: externalOrderId },
                                    })];
                                case 1:
                                    orders = _a.sent();
                                    return [2 /*return*/, orders[0]];
                            }
                        });
                    }); };
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, , 15, 27]);
                    // Order ships first, then tracking updates arrive
                    return [4 /*yield*/, postEvent('PHARMACY_ORDER_SHIPPED', { carrier: 'USPS', tracking: '9400-CCC' })];
                case 6:
                    // Order ships first, then tracking updates arrive
                    _b.sent();
                    return [4 /*yield*/, postEvent('PACKAGE_IN_TRANSIT', {
                            trackerStatus: 'in_transit',
                            trackerId: 'trk_123',
                            trackingUrl: trackingUrl,
                            tracking: '9400-CCC',
                            carrier: 'USPS',
                        })];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Block C: PACKAGE_IN_TRANSIT fires 'In Transit' trigger with trackingUrl preferred over tracking", function () { return sdk.api.endusers.getOne(enduser.id); }, { onResult: function (e) {
                                var _a, _b, _c, _d;
                                return !!(((_a = e.fields) === null || _a === void 0 ? void 0 : _a.pharmacy_status) === 'In Transit'
                                    && ((_b = e.fields) === null || _b === void 0 ? void 0 : _b.pharmacy_tracking) === trackingUrl
                                    && ((_c = e.fields) === null || _c === void 0 ? void 0 : _c.pharmacy_carrier) === 'USPS'
                                    && ((_d = e.fields) === null || _d === void 0 ? void 0 : _d.pharmacy_externalId) === externalOrderId);
                            } })];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, postEvent('PACKAGE_OUT_FOR_DELIVERY', {
                            trackerStatus: 'out_for_delivery',
                            trackingUrl: trackingUrl,
                            carrier: 'USPS',
                        })];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Block C: PACKAGE_OUT_FOR_DELIVERY sets order status 'Out for Delivery'", getOrder, { onResult: function (o) { return (o === null || o === void 0 ? void 0 : o.status) === 'Out for Delivery'; } })];
                case 10:
                    _b.sent();
                    deliveredDate_1 = new Date().toISOString();
                    return [4 /*yield*/, postEvent('PACKAGE_DELIVERED', {
                            trackerStatus: 'delivered',
                            trackingUrl: trackingUrl,
                            carrier: 'USPS',
                            deliveredDate: deliveredDate_1,
                        })];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Block C: PACKAGE_DELIVERED sets status 'Delivered' and stores deliveredDate", getOrder, { onResult: function (o) { return !!((o === null || o === void 0 ? void 0 : o.status) === 'Delivered'
                                && (o === null || o === void 0 ? void 0 : o.deliveredDate) === deliveredDate_1); } })];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, postEvent('PACKAGE_DELIVERY_FAILED', { trackerStatus: 'failure' })];
                case 13:
                    _b.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("Block C: PACKAGE_DELIVERY_FAILED sets order status 'Delivery Failed'", getOrder, { onResult: function (o) { return (o === null || o === void 0 ? void 0 : o.status) === 'Delivery Failed'; } })];
                case 14:
                    _b.sent();
                    return [3 /*break*/, 27];
                case 15:
                    _b.trys.push([15, 21, , 22]);
                    return [4 /*yield*/, sdk.api.enduser_orders.getSome({
                            filter: { source: 'Beluga', externalId: externalOrderId },
                        })];
                case 16:
                    orders = _b.sent();
                    _i = 0, orders_2 = orders;
                    _b.label = 17;
                case 17:
                    if (!(_i < orders_2.length)) return [3 /*break*/, 20];
                    o = orders_2[_i];
                    return [4 /*yield*/, sdk.api.enduser_orders.deleteOne(o.id).catch(console.error)];
                case 18:
                    _b.sent();
                    _b.label = 19;
                case 19:
                    _i++;
                    return [3 /*break*/, 17];
                case 20: return [3 /*break*/, 22];
                case 21:
                    err_2 = _b.sent();
                    console.error(err_2);
                    return [3 /*break*/, 22];
                case 22: return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(inTransitTrigger.id).catch(console.error)];
                case 23:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.form_responses.deleteOne(formResponse.id).catch(console.error)];
                case 24:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.forms.deleteOne(form.id).catch(console.error)];
                case 25:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id).catch(console.error)];
                case 26:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 27: return [2 /*return*/];
            }
        });
    });
};
var set_fields_order_templates_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, testing_1.log_header)("Set Fields: {{order.*}} template resolution");
                    return [4 /*yield*/, direct_order_creation_block({ sdk: sdk })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, beluga_webhook_block({ sdk: sdk })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, beluga_tracking_status_block({ sdk: sdk })];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
};
exports.set_fields_order_templates_tests = set_fields_order_templates_tests;
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
                    return [4 /*yield*/, (0, exports.set_fields_order_templates_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("set_fields_order_templates test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("set_fields_order_templates test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=set_fields_order_templates.test.js.map