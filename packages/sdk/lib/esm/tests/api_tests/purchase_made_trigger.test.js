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
import { Session } from "../../sdk";
import { log_header, wait, async_test } from "@tellescope/testing";
import { setup_tests } from "../setup";
var host = process.env.API_URL || "http://localhost:8080";
export var purchase_made_trigger_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var product1, product2, product3, t1, t2, t3, t4, t5, t6, t7, t8, t9, enduser1, enduser2, enduser3, enduser4, enduser5, enduser6, enduser7, enduser8, enduser9, enduser10, enduser11, enduser12, enduser13, enduser14, purchase1, purchase2, purchase3, purchase4, purchase5, purchase6, purchase7, purchase8, purchase9, purchase10, purchase11, purchase12, purchase13, purchase14;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_header("Automation Trigger Tests (Purchase Made)");
                    return [4 /*yield*/, sdk.api.products.createOne({
                            title: 'Premium Course Package',
                            cost: { amount: 9999, currency: 'USD' },
                            processor: 'Stripe'
                        })];
                case 1:
                    product1 = _b.sent();
                    return [4 /*yield*/, sdk.api.products.createOne({
                            title: 'Basic Training Module',
                            cost: { amount: 4999, currency: 'USD' },
                            processor: 'Stripe'
                        })];
                case 2:
                    product2 = _b.sent();
                    return [4 /*yield*/, sdk.api.products.createOne({
                            title: 'Advanced Analytics Suite',
                            cost: { amount: 14999, currency: 'USD' },
                            processor: 'Stripe'
                        })
                        // Create automation triggers for different scenarios
                    ];
                case 3:
                    product3 = _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Purchase Made', info: {} },
                            action: { type: 'Add Tags', info: { tags: ['Purchase-Any'] } },
                            status: 'Active',
                            title: "Purchase - Any"
                        })];
                case 4:
                    t1 = _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Purchase Made', info: { titles: ['Premium Course Package'] } },
                            action: { type: 'Add Tags', info: { tags: ['Purchase-Exact-Title'] } },
                            status: 'Active',
                            title: "Purchase - Exact Title"
                        })];
                case 5:
                    t2 = _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Purchase Made', info: { productIds: [product2.id] } },
                            action: { type: 'Add Tags', info: { tags: ['Purchase-Product-ID'] } },
                            status: 'Active',
                            title: "Purchase - Product ID"
                        })
                        // Test the new titlePartialMatches functionality
                    ];
                case 6:
                    t3 = _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Purchase Made', info: { titlePartialMatches: ['course'] } },
                            action: { type: 'Add Tags', info: { tags: ['Purchase-Partial-Course'] } },
                            status: 'Active',
                            title: "Purchase - Partial Match Course"
                        })];
                case 7:
                    t4 = _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Purchase Made', info: { titlePartialMatches: ['ANALYTICS'] } },
                            action: { type: 'Add Tags', info: { tags: ['Purchase-Partial-Analytics'] } },
                            status: 'Active',
                            title: "Purchase - Partial Match Analytics (Case Insensitive)"
                        })];
                case 8:
                    t5 = _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Purchase Made', info: { titlePartialMatches: ['premium', 'advanced', 'pro'] } },
                            action: { type: 'Add Tags', info: { tags: ['Purchase-Multiple-Partial'] } },
                            status: 'Active',
                            title: "Purchase - Multiple Partial Matches"
                        })
                        // Comprehensive case-insensitivity test trigger
                    ];
                case 9:
                    t6 = _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Purchase Made', info: { titlePartialMatches: ['MiXeD', 'UPPER', 'lower'] } },
                            action: { type: 'Add Tags', info: { tags: ['Purchase-Case-Test'] } },
                            status: 'Active',
                            title: "Purchase - Comprehensive Case Insensitivity Test"
                        })
                        // Empty titlePartialMatches array test trigger
                    ];
                case 10:
                    t7 = _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Purchase Made', info: { titlePartialMatches: [] } },
                            action: { type: 'Add Tags', info: { tags: ['Purchase-Empty-Array'] } },
                            status: 'Active',
                            title: "Purchase - Empty titlePartialMatches Array Test"
                        })
                        // No title test trigger
                    ];
                case 11:
                    t8 = _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                            event: { type: 'Purchase Made', info: { titlePartialMatches: ['test', 'example'] } },
                            action: { type: 'Add Tags', info: { tags: ['Purchase-No-Title-Test'] } },
                            status: 'Active',
                            title: "Purchase - No Title Test"
                        })
                        // Create separate endusers to avoid trigger throttling (1 minute per trigger per enduser)
                    ];
                case 12:
                    t9 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 13:
                    enduser1 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 14:
                    enduser2 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 15:
                    enduser3 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 16:
                    enduser4 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 17:
                    enduser5 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 18:
                    enduser6 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 19:
                    enduser7 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 20:
                    enduser8 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 21:
                    enduser9 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 22:
                    enduser10 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 23:
                    enduser11 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 24:
                    enduser12 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 25:
                    enduser13 = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({})
                        // Test 1: Purchase without specific filters (should trigger t1 for any purchase)
                    ];
                case 26:
                    enduser14 = _b.sent();
                    return [4 /*yield*/, sdk.api.purchases.createOne({
                            enduserId: enduser1.id,
                            productId: product1.id,
                            title: 'Premium Course Package',
                            cost: { amount: 9999, currency: 'USD' },
                            processor: 'Stripe'
                        })];
                case 27:
                    purchase1 = _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)]; // Brief wait for trigger processing
                case 28:
                    _b.sent(); // Brief wait for trigger processing
                    return [4 /*yield*/, async_test("Purchase Made - Any Purchase", function () { return sdk.api.endusers.getOne(enduser1.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Purchase-Any')); } })
                        // Test 2: Purchase with exact title match
                    ];
                case 29:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.purchases.createOne({
                            enduserId: enduser2.id,
                            productId: product1.id,
                            title: 'Premium Course Package',
                            cost: { amount: 9999, currency: 'USD' },
                            processor: 'Stripe'
                        })];
                case 30:
                    purchase2 = _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 31:
                    _b.sent();
                    return [4 /*yield*/, async_test("Purchase Made - Exact Title Match", function () { return sdk.api.endusers.getOne(enduser2.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Purchase-Exact-Title')); } })
                        // Test 3: Purchase with product ID match
                    ];
                case 32:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.purchases.createOne({
                            enduserId: enduser3.id,
                            productId: product2.id,
                            title: 'Basic Training Module',
                            cost: { amount: 4999, currency: 'USD' },
                            processor: 'Stripe'
                        })];
                case 33:
                    purchase3 = _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 34:
                    _b.sent();
                    return [4 /*yield*/, async_test("Purchase Made - Product ID Match", function () { return sdk.api.endusers.getOne(enduser3.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Purchase-Product-ID')); } })
                        // Test 4: Purchase with case-insensitive partial title match - "course"
                    ];
                case 35:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.purchases.createOne({
                            enduserId: enduser4.id,
                            productId: product1.id,
                            title: 'Premium Course Package',
                            cost: { amount: 9999, currency: 'USD' },
                            processor: 'Stripe'
                        })];
                case 36:
                    purchase4 = _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 37:
                    _b.sent();
                    return [4 /*yield*/, async_test("Purchase Made - Partial Title Match (case insensitive 'course')", function () { return sdk.api.endusers.getOne(enduser4.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Purchase-Partial-Course')); } })
                        // Test 5: Purchase with case-insensitive partial title match - "ANALYTICS" (uppercase)
                    ];
                case 38:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.purchases.createOne({
                            enduserId: enduser5.id,
                            productId: product3.id,
                            title: 'Advanced Analytics Suite',
                            cost: { amount: 14999, currency: 'USD' },
                            processor: 'Stripe'
                        })];
                case 39:
                    purchase5 = _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 40:
                    _b.sent();
                    return [4 /*yield*/, async_test("Purchase Made - Partial Title Match (case insensitive 'ANALYTICS')", function () { return sdk.api.endusers.getOne(enduser5.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Purchase-Partial-Analytics')); } })
                        // Test 6: Purchase that should NOT match partial filter
                    ];
                case 41:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.purchases.createOne({
                            enduserId: enduser6.id,
                            productId: product2.id,
                            title: 'Basic Training Module',
                            cost: { amount: 4999, currency: 'USD' },
                            processor: 'Stripe'
                        })];
                case 42:
                    purchase6 = _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 43:
                    _b.sent();
                    return [4 /*yield*/, async_test("Purchase Made - No Partial Title Match", function () { return sdk.api.endusers.getOne(enduser6.id); }, { onResult: function (e) { var _a, _b, _c; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Purchase-Any')) && !((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('Purchase-Partial-Course')) && !((_c = e.tags) === null || _c === void 0 ? void 0 : _c.includes('Purchase-Partial-Analytics')); } })
                        // Test 7: Purchase with mixed case partial match
                    ];
                case 44:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.purchases.createOne({
                            enduserId: enduser7.id,
                            productId: product1.id,
                            title: 'Ultimate COURSE Experience',
                            cost: { amount: 9999, currency: 'USD' },
                            processor: 'Stripe'
                        })];
                case 45:
                    purchase7 = _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 46:
                    _b.sent();
                    return [4 /*yield*/, async_test("Purchase Made - Mixed Case Partial Title Match", function () { return sdk.api.endusers.getOne(enduser7.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Purchase-Partial-Course')); } })
                        // Test 8: Purchase with multiple partial matches - should match 'premium'
                    ];
                case 47:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.purchases.createOne({
                            enduserId: enduser8.id,
                            productId: product1.id,
                            title: 'Premium Course Package',
                            cost: { amount: 9999, currency: 'USD' },
                            processor: 'Stripe'
                        })];
                case 48:
                    purchase8 = _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 49:
                    _b.sent();
                    return [4 /*yield*/, async_test("Purchase Made - Multiple Partial Matches (matches 'premium')", function () { return sdk.api.endusers.getOne(enduser8.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Purchase-Multiple-Partial')); } })
                        // Test 9: Purchase with multiple partial matches - should match 'advanced'
                    ];
                case 50:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.purchases.createOne({
                            enduserId: enduser9.id,
                            productId: product3.id,
                            title: 'Advanced Analytics Suite',
                            cost: { amount: 14999, currency: 'USD' },
                            processor: 'Stripe'
                        })];
                case 51:
                    purchase9 = _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 52:
                    _b.sent();
                    return [4 /*yield*/, async_test("Purchase Made - Multiple Partial Matches (matches 'advanced')", function () { return sdk.api.endusers.getOne(enduser9.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Purchase-Multiple-Partial')); } })
                        // Test 10: Comprehensive case-insensitivity - lowercase filter 'mixed' matches title 'MIXED Case'
                    ];
                case 53:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.purchases.createOne({
                            enduserId: enduser10.id,
                            productId: product1.id,
                            title: 'Some MIXED Case Product Title',
                            cost: { amount: 9999, currency: 'USD' },
                            processor: 'Stripe'
                        })];
                case 54:
                    purchase10 = _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 55:
                    _b.sent();
                    return [4 /*yield*/, async_test("Purchase Made - Case Insensitive (lowercase filter 'mixed' matches 'MIXED')", function () { return sdk.api.endusers.getOne(enduser10.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Purchase-Case-Test')); } })
                        // Test 11: Comprehensive case-insensitivity - uppercase filter 'UPPER' matches title 'upper'
                    ];
                case 56:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.purchases.createOne({
                            enduserId: enduser11.id,
                            productId: product2.id,
                            title: 'Something with upper case word',
                            cost: { amount: 4999, currency: 'USD' },
                            processor: 'Stripe'
                        })];
                case 57:
                    purchase11 = _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 58:
                    _b.sent();
                    return [4 /*yield*/, async_test("Purchase Made - Case Insensitive (uppercase filter 'UPPER' matches 'upper')", function () { return sdk.api.endusers.getOne(enduser11.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Purchase-Case-Test')); } })
                        // Test 12: Comprehensive case-insensitivity - mixed case filter 'MiXeD' matches title 'MiXeD'
                    ];
                case 59:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.purchases.createOne({
                            enduserId: enduser12.id,
                            productId: product3.id,
                            title: 'Another MiXeD case example here',
                            cost: { amount: 14999, currency: 'USD' },
                            processor: 'Stripe'
                        })];
                case 60:
                    purchase12 = _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 61:
                    _b.sent();
                    return [4 /*yield*/, async_test("Purchase Made - Case Insensitive (mixed case filter 'MiXeD' matches 'MiXeD')", function () { return sdk.api.endusers.getOne(enduser12.id); }, { onResult: function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Purchase-Case-Test')); } })
                        // Test 13: Empty titlePartialMatches array - should behave like no filter
                    ];
                case 62:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.purchases.createOne({
                            enduserId: enduser13.id,
                            productId: product1.id,
                            title: 'Any Title Here',
                            cost: { amount: 9999, currency: 'USD' },
                            processor: 'Stripe'
                        })];
                case 63:
                    purchase13 = _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 64:
                    _b.sent();
                    return [4 /*yield*/, async_test("Purchase Made - Empty titlePartialMatches Array (should trigger like any purchase)", function () { return sdk.api.endusers.getOne(enduser13.id); }, { onResult: function (e) { var _a, _b; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Purchase-Empty-Array')) && !!((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('Purchase-Any')); } })
                        // Test 14: Purchase with empty title - should NOT trigger partial match filters
                    ];
                case 65:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.purchases.createOne({
                            enduserId: enduser14.id,
                            productId: product2.id,
                            title: '',
                            cost: { amount: 4999, currency: 'USD' },
                            processor: 'Stripe'
                        })];
                case 66:
                    purchase14 = _b.sent();
                    return [4 /*yield*/, wait(undefined, 500)];
                case 67:
                    _b.sent();
                    return [4 /*yield*/, async_test("Purchase Made - Empty Title (should not trigger partial match filters)", function () { return sdk.api.endusers.getOne(enduser14.id); }, { onResult: function (e) { var _a, _b; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Purchase-Any')) && !((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('Purchase-No-Title-Test')); } })];
                case 68:
                    _b.sent();
                    _b.label = 69;
                case 69:
                    _b.trys.push([69, , 96, 97]);
                    // Clean up test data - triggers first
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(t1.id)];
                case 70:
                    // Clean up test data - triggers first
                    _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(t2.id)];
                case 71:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(t3.id)];
                case 72:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(t4.id)];
                case 73:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(t5.id)];
                case 74:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(t6.id)];
                case 75:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(t7.id)];
                case 76:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(t8.id)];
                case 77:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.automation_triggers.deleteOne(t9.id)
                        // Clean up products
                    ];
                case 78:
                    _b.sent();
                    // Clean up products
                    return [4 /*yield*/, sdk.api.products.deleteOne(product1.id)];
                case 79:
                    // Clean up products
                    _b.sent();
                    return [4 /*yield*/, sdk.api.products.deleteOne(product2.id)];
                case 80:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.products.deleteOne(product3.id)
                        // Clean up endusers to prevent interference with other tests
                    ];
                case 81:
                    _b.sent();
                    // Clean up endusers to prevent interference with other tests
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser1.id)];
                case 82:
                    // Clean up endusers to prevent interference with other tests
                    _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser2.id)];
                case 83:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser3.id)];
                case 84:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser4.id)];
                case 85:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser5.id)];
                case 86:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser6.id)];
                case 87:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser7.id)];
                case 88:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser8.id)];
                case 89:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser9.id)];
                case 90:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser10.id)];
                case 91:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser11.id)];
                case 92:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser12.id)];
                case 93:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser13.id)];
                case 94:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser14.id)];
                case 95:
                    _b.sent();
                    return [3 /*break*/, 97];
                case 96: return [7 /*endfinally*/];
                case 97: return [2 /*return*/];
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
                    return [4 /*yield*/, purchase_made_trigger_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Purchase Made trigger tests completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Purchase Made trigger tests failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=purchase_made_trigger.test.js.map