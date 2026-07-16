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
exports.nutrition_tracking_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || 'http://localhost:8080';
var businessId = '60398b1131a295e64f084ff6';
var ENDUSER_PASSWORD = 'NutritionTestPassword!123';
var NUTRITION_TARGETS = {
    dailyCalorieTarget: 2200,
    dailyProteinTarget: 150,
    dailyCarbTarget: 250,
    dailyFatTarget: 70,
    dailyFiberTarget: 30,
    dailyWaterTarget: 2500,
};
var MACRO_COMPONENTS = [
    { code: { text: 'Calories' }, valueQuantity: { value: 450, unit: 'kcal' } },
    { code: { text: 'Protein' }, valueQuantity: { value: 42, unit: 'g' } },
    { code: { text: 'Carbohydrates' }, valueQuantity: { value: 30, unit: 'g' } },
    { code: { text: 'Fat' }, valueQuantity: { value: 18, unit: 'g' } },
    {
        code: {
            text: 'Cheddar cheese',
            coding: [{ system: 'https://fdc.nal.usda.gov', code: '328637', display: 'Cheese, cheddar' }],
        },
        valueQuantity: { value: 100, unit: 'g' },
    },
];
var USDA_NOT_CONFIGURED_MESSAGE = 'USDA food search is not configured';
// contract shape returned by the USDA proxy — nothing else may leak through
var EXPECTED_FOOD_KEYS = ['fdcId', 'description', 'calories', 'protein', 'carbs', 'fat', 'fiber'];
var MACRO_KEYS = ['calories', 'protein', 'carbs', 'fat', 'fiber'];
var is_valid_food_summary = function (f) { return (typeof (f === null || f === void 0 ? void 0 : f.fdcId) === 'number' && Number.isInteger(f.fdcId) && f.fdcId > 0
    && typeof (f === null || f === void 0 ? void 0 : f.description) === 'string' && f.description.length > 0
    && Object.keys(f).every(function (k) { return EXPECTED_FOOD_KEYS.includes(k); })
    && MACRO_KEYS.every(function (m) { return f[m] === undefined || (typeof f[m] === 'number' && isFinite(f[m]) && f[m] >= 0); })); };
// values are per 100g: grams of a macro can't exceed 100, energy tops out near pure fat (~900 kcal)
var is_plausible_per_100g = function (f) { return ((f.calories === undefined || f.calories <= 950)
    && ['protein', 'carbs', 'fat', 'fiber'].every(function (m) { return f[m] === undefined || f[m] <= 100; })); };
// same food fetched via different USDA response shapes should yield the same numbers
var approx_equal = function (a, b) { return ((a === undefined && b === undefined)
    || (typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) <= Math.max(1, 0.1 * Math.max(a, b)))); };
var usda_proxy_tests = function (_a) {
    var sdk = _a.sdk, enduserSDK = _a.enduserSDK;
    return __awaiter(void 0, void 0, void 0, function () {
        var searchResult, err_1, firstFood, fullFatCheddar;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    (0, testing_1.log_header)("USDA Food Search Proxy");
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, enduserSDK.api.integrations.proxy_read({
                            integration: 'USDA',
                            type: 'search',
                            query: JSON.stringify({ keywords: 'cheddar cheese' }),
                        })];
                case 2:
                    searchResult = _d.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _d.sent();
                    if ((_c = (_b = err_1 === null || err_1 === void 0 ? void 0 : err_1.message) === null || _b === void 0 ? void 0 : _b.includes) === null || _c === void 0 ? void 0 : _c.call(_b, USDA_NOT_CONFIGURED_MESSAGE)) {
                        console.log("⏭️  Skipping USDA proxy tests (no { type: 'usda' } zz_secrets doc configured)");
                        return [2 /*return*/];
                    }
                    throw err_1;
                case 4: return [4 /*yield*/, (0, testing_1.async_test)('USDA search (enduser): non-empty foods with fdcId/description, totalHits > 0', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, searchResult];
                    }); }); }, { onResult: function (r) {
                            var _a;
                            return (Array.isArray((_a = r === null || r === void 0 ? void 0 : r.data) === null || _a === void 0 ? void 0 : _a.foods)
                                && r.data.foods.length > 0
                                && r.data.foods.every(function (f) { return typeof f.fdcId === 'number' && typeof f.description === 'string'; })
                                && r.data.foods.every(function (f) { return ['calories', 'protein', 'carbs', 'fat', 'fiber'].every(function (macro) { return f[macro] === undefined || typeof f[macro] === 'number'; }); })
                                && r.data.totalHits > 0);
                        } })];
                case 5:
                    _d.sent();
                    firstFood = searchResult.data.foods[0];
                    return [4 /*yield*/, (0, testing_1.async_test)('USDA food detail (enduser): matching single food by fdcId', function () { return enduserSDK.api.integrations.proxy_read({
                            integration: 'USDA',
                            type: 'food',
                            id: String(firstFood.fdcId),
                        }); }, { onResult: function (r) {
                                var _a;
                                return (((_a = r === null || r === void 0 ? void 0 : r.data) === null || _a === void 0 ? void 0 : _a.fdcId) === firstFood.fdcId
                                    && typeof r.data.description === 'string');
                            } })];
                case 6:
                    _d.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('USDA search (staff session) also succeeds', function () { return sdk.api.integrations.proxy_read({
                            integration: 'USDA',
                            type: 'search',
                            query: JSON.stringify({ keywords: 'cheddar cheese' }),
                        }); }, { onResult: function (r) { var _a; return Array.isArray((_a = r === null || r === void 0 ? void 0 : r.data) === null || _a === void 0 ? void 0 : _a.foods) && r.data.foods.length > 0; } })];
                case 7:
                    _d.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('USDA search: missing keywords rejected', function () { return enduserSDK.api.integrations.proxy_read({
                            integration: 'USDA',
                            type: 'search',
                            query: JSON.stringify({}),
                        }); }, { shouldError: true, onError: function () { return true; } })];
                case 8:
                    _d.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('USDA search: 1-char keywords rejected', function () { return enduserSDK.api.integrations.proxy_read({
                            integration: 'USDA',
                            type: 'search',
                            query: JSON.stringify({ keywords: 'c' }),
                        }); }, { shouldError: true, onError: function () { return true; } })
                        // ---- rigorous output-format validation ----
                    ];
                case 9:
                    _d.sent();
                    // ---- rigorous output-format validation ----
                    return [4 /*yield*/, (0, testing_1.async_test)('USDA format: every search result matches the contract shape exactly (no extra fields)', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, searchResult];
                        }); }); }, { onResult: function (r) { return r.data.foods.every(function (f) { return is_valid_food_summary(f) && is_plausible_per_100g(f); }); } })];
                case 10:
                    // ---- rigorous output-format validation ----
                    _d.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('USDA format: no api_key or raw USDA payload fields leak into the response', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, searchResult];
                        }); }); }, { onResult: function (r) {
                                var serialized = JSON.stringify(r.data);
                                return !serialized.includes('api_key') && !serialized.includes('foodNutrients') && !serialized.includes('nutrientNumber');
                            } })
                        // extraction must actually populate macros across the result set (catches a broken
                        // nutrient-number mapping, which the undefined-tolerant shape checks above would miss)
                    ];
                case 11:
                    _d.sent();
                    // extraction must actually populate macros across the result set (catches a broken
                    // nutrient-number mapping, which the undefined-tolerant shape checks above would miss)
                    return [4 /*yield*/, (0, testing_1.async_test)('USDA format: macro extraction populated for nearly all results', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, searchResult];
                        }); }); }, { onResult: function (r) {
                                var foods = r.data.foods;
                                var fullyPopulated = foods.filter(function (f) { return MACRO_KEYS.every(function (m) { return typeof f[m] === 'number'; }); });
                                return foods.length > 0 && fullyPopulated.length >= foods.length * 0.8;
                            } })
                        // at least one result must match full-fat cheddar's real per-100g profile
                        // (search includes reduced-fat branded variants, so assert existence rather than checking an arbitrary pick)
                    ];
                case 12:
                    // extraction must actually populate macros across the result set (catches a broken
                    // nutrient-number mapping, which the undefined-tolerant shape checks above would miss)
                    _d.sent();
                    fullFatCheddar = searchResult.data.foods.find(function (f) {
                        var _a;
                        return (((_a = f.description) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes('cheddar'))
                            && f.calories >= 300 && f.calories <= 500
                            && f.protein >= 15 && f.protein <= 35
                            && f.fat >= 25 && f.fat <= 45
                            && f.carbs >= 0 && f.carbs <= 15
                            && (f.fiber === undefined || (f.fiber >= 0 && f.fiber <= 5)));
                    });
                    return [4 /*yield*/, (0, testing_1.async_test)('USDA format: a result matches full-fat cheddar\'s realistic per-100g values', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, fullFatCheddar];
                        }); }); }, { onResult: function (f) { return !!f; } })];
                case 13:
                    _d.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('USDA format: food detail (abridged shape) yields same values as search (search shape) for same fdcId', function () { return enduserSDK.api.integrations.proxy_read({
                            integration: 'USDA',
                            type: 'food',
                            id: String(fullFatCheddar === null || fullFatCheddar === void 0 ? void 0 : fullFatCheddar.fdcId),
                        }); }, { onResult: function (r) { return (is_valid_food_summary(r === null || r === void 0 ? void 0 : r.data)
                                && r.data.fdcId === (fullFatCheddar === null || fullFatCheddar === void 0 ? void 0 : fullFatCheddar.fdcId)
                                && MACRO_KEYS.every(function (m) { return approx_equal(r.data[m], fullFatCheddar === null || fullFatCheddar === void 0 ? void 0 : fullFatCheddar[m]); })); } })];
                case 14:
                    _d.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('USDA format: pageSize honored (5 -> exactly 5 valid foods)', function () { return enduserSDK.api.integrations.proxy_read({
                            integration: 'USDA',
                            type: 'search',
                            query: JSON.stringify({ keywords: 'apple', pageSize: 5 }),
                        }); }, { onResult: function (r) {
                                var _a, _b;
                                return (((_b = (_a = r === null || r === void 0 ? void 0 : r.data) === null || _a === void 0 ? void 0 : _a.foods) === null || _b === void 0 ? void 0 : _b.length) === 5
                                    && r.data.totalHits >= 5
                                    && r.data.foods.every(function (f) { return is_valid_food_summary(f) && is_plausible_per_100g(f); }));
                            } })];
                case 15:
                    _d.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('USDA format: oversized pageSize clamped to at most 50', function () { return enduserSDK.api.integrations.proxy_read({
                            integration: 'USDA',
                            type: 'search',
                            query: JSON.stringify({ keywords: 'banana', pageSize: 10000 }),
                        }); }, { onResult: function (r) { var _a, _b; return ((_b = (_a = r === null || r === void 0 ? void 0 : r.data) === null || _a === void 0 ? void 0 : _a.foods) === null || _b === void 0 ? void 0 : _b.length) > 0 && r.data.foods.length <= 50; } })];
                case 16:
                    _d.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('USDA format: non-numeric food id rejected', function () { return enduserSDK.api.integrations.proxy_read({
                            integration: 'USDA',
                            type: 'food',
                            id: '../foods/search',
                        }); }, { shouldError: true, onError: function () { return true; } })];
                case 17:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    });
};
var nutrition_tracking_tests = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var enduserAId, enduserBId, ts, enduserAEmail, enduserBEmail, enduserA_1, enduserB, enduserSDK_1, enduserSDKB_1, withComponents_1, withoutComponents_1, staffCreated_1, enduserACreated_1, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    (0, testing_1.log_header)("Nutrition Tracking (weight & macro backend support)");
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, , 30, 39]);
                    ts = Date.now();
                    enduserAEmail = "nutrition-a-".concat(ts, "@test.tellescope.com");
                    enduserBEmail = "nutrition-b-".concat(ts, "@test.tellescope.com");
                    return [4 /*yield*/, sdk.api.endusers.createOne({ email: enduserAEmail, fname: 'Nutrition', lname: 'TesterA' })];
                case 2:
                    enduserA_1 = _d.sent();
                    enduserAId = enduserA_1.id;
                    return [4 /*yield*/, sdk.api.endusers.set_password({ id: enduserA_1.id, password: ENDUSER_PASSWORD })];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({ email: enduserBEmail, fname: 'Nutrition', lname: 'TesterB' })];
                case 4:
                    enduserB = _d.sent();
                    enduserBId = enduserB.id;
                    return [4 /*yield*/, sdk.api.endusers.set_password({ id: enduserB.id, password: ENDUSER_PASSWORD })];
                case 5:
                    _d.sent();
                    enduserSDK_1 = new sdk_1.EnduserSession({ host: host, businessId: businessId });
                    return [4 /*yield*/, (0, setup_1.authenticate_enduser_via_token)(sdk, enduserSDK_1, { email: enduserAEmail })];
                case 6:
                    _d.sent();
                    enduserSDKB_1 = new sdk_1.EnduserSession({ host: host, businessId: businessId });
                    return [4 /*yield*/, (0, setup_1.authenticate_enduser_via_token)(sdk, enduserSDKB_1, { email: enduserBEmail })
                        // ---- Requirement 3: daily nutrition targets (enduser-readable and -writable) ----
                    ];
                case 7:
                    _d.sent();
                    // ---- Requirement 3: daily nutrition targets (enduser-readable and -writable) ----
                    return [4 /*yield*/, (0, testing_1.async_test)('targets: enduser sets all six daily nutrition targets on own record', function () { return enduserSDK_1.api.endusers.updateOne(enduserA_1.id, __assign({}, NUTRITION_TARGETS)); }, { onResult: function (e) { return Object.entries(NUTRITION_TARGETS).every(function (_a) {
                                var field = _a[0], value = _a[1];
                                return e[field] === value;
                            }); } })];
                case 8:
                    // ---- Requirement 3: daily nutrition targets (enduser-readable and -writable) ----
                    _d.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('targets: enduser reads all six targets back (no redaction)', function () { return enduserSDK_1.api.endusers.getOne(enduserA_1.id); }, { onResult: function (e) { return Object.entries(NUTRITION_TARGETS).every(function (_a) {
                                var field = _a[0], value = _a[1];
                                return e[field] === value;
                            }); } })];
                case 9:
                    _d.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('targets: staff can read targets', function () { return sdk.api.endusers.getOne(enduserA_1.id); }, { onResult: function (e) { return Object.entries(NUTRITION_TARGETS).every(function (_a) {
                                var field = _a[0], value = _a[1];
                                return e[field] === value;
                            }); } })];
                case 10:
                    _d.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('targets: staff can write targets', function () { return sdk.api.endusers.updateOne(enduserA_1.id, { dailyCalorieTarget: 2000, dailyWaterTarget: 3000 }); }, { onResult: function (e) { return e.dailyCalorieTarget === 2000 && e.dailyWaterTarget === 3000; } })];
                case 11:
                    _d.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('targets: negative values rejected', function () { return enduserSDK_1.api.endusers.updateOne(enduserA_1.id, { dailyProteinTarget: -10 }); }, { shouldError: true, onError: function () { return true; } })
                        // ---- Requirement 2: EnduserObservation.components round-trip ----
                    ];
                case 12:
                    _d.sent();
                    return [4 /*yield*/, enduserSDK_1.api.enduser_observations.createOne({
                            enduserId: enduserA_1.id,
                            status: 'final',
                            category: 'vital-signs',
                            type: 'food',
                            measurement: { value: 450, unit: 'kcal' },
                            components: MACRO_COMPONENTS,
                        })];
                case 13:
                    withComponents_1 = _d.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('components: enduser round-trips observation with macros + coded food item', function () { return enduserSDK_1.api.enduser_observations.getOne(withComponents_1.id); }, { onResult: function (o) {
                                var _a, _b, _c, _d, _e, _f, _g;
                                return (((_a = o.components) === null || _a === void 0 ? void 0 : _a.length) === MACRO_COMPONENTS.length
                                    && o.components[1].code.text === 'Protein'
                                    && o.components[1].valueQuantity.value === 42
                                    && o.components[1].valueQuantity.unit === 'g'
                                    && ((_c = (_b = o.components[4].code.coding) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.system) === 'https://fdc.nal.usda.gov'
                                    && ((_e = (_d = o.components[4].code.coding) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.code) === '328637'
                                    && ((_g = (_f = o.components[4].code.coding) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.display) === 'Cheese, cheddar'
                                    && o.measurement.value === 450);
                            } })];
                case 14:
                    _d.sent();
                    return [4 /*yield*/, enduserSDK_1.api.enduser_observations.createOne({
                            enduserId: enduserA_1.id,
                            status: 'final',
                            category: 'vital-signs',
                            type: 'weight',
                            measurement: { value: 180, unit: 'lbs' },
                        })];
                case 15:
                    withoutComponents_1 = _d.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('components: observation without components still works (back-compat)', function () { return enduserSDK_1.api.enduser_observations.getOne(withoutComponents_1.id); }, { onResult: function (o) { return o.components === undefined && o.measurement.value === 180; } })
                        // ---- Requirement 4: creatorOnly update/delete ----
                    ];
                case 16:
                    _d.sent();
                    // ---- Requirement 4: creatorOnly update/delete ----
                    return [4 /*yield*/, (0, testing_1.async_test)('creatorOnly: enduser updates own observation', function () { return enduserSDK_1.api.enduser_observations.updateOne(withoutComponents_1.id, { measurement: { value: 178, unit: 'lbs' } }); }, { onResult: function (o) { return o.measurement.value === 178; } })];
                case 17:
                    // ---- Requirement 4: creatorOnly update/delete ----
                    _d.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('creatorOnly: enduser deletes own observation', function () { return enduserSDK_1.api.enduser_observations.deleteOne(withoutComponents_1.id); }, { shouldError: false, onResult: function () { return true; } })
                        // Negative: staff-created observation for the enduser remains locked
                    ];
                case 18:
                    _d.sent();
                    return [4 /*yield*/, sdk.api.enduser_observations.createOne({
                            enduserId: enduserA_1.id,
                            status: 'final',
                            category: 'vital-signs',
                            type: 'weight',
                            measurement: { value: 182, unit: 'lbs' },
                        })];
                case 19:
                    staffCreated_1 = _d.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('creatorOnly: enduser cannot update staff-created observation', function () { return enduserSDK_1.api.enduser_observations.updateOne(staffCreated_1.id, { measurement: { value: 1, unit: 'lbs' } }); }, { shouldError: true, onError: function () { return true; } })];
                case 20:
                    _d.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('creatorOnly: enduser cannot delete staff-created observation', function () { return enduserSDK_1.api.enduser_observations.deleteOne(staffCreated_1.id); }, { shouldError: true, onError: function () { return true; } })];
                case 21:
                    _d.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('creatorOnly: enduser can still read staff-created observation', function () { return enduserSDK_1.api.enduser_observations.getOne(staffCreated_1.id); }, { onResult: function (o) { return o.id === staffCreated_1.id && o.measurement.value === 182; } })
                        // Staff sessions unaffected by creatorOnly (applies to enduser sessions only)
                    ];
                case 22:
                    _d.sent();
                    // Staff sessions unaffected by creatorOnly (applies to enduser sessions only)
                    return [4 /*yield*/, (0, testing_1.async_test)('staff unchanged: staff updates enduser-created observation', function () { return sdk.api.enduser_observations.updateOne(withComponents_1.id, { measurement: { value: 500, unit: 'kcal' } }); }, { onResult: function (o) { return o.measurement.value === 500; } })];
                case 23:
                    // Staff sessions unaffected by creatorOnly (applies to enduser sessions only)
                    _d.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)('staff unchanged: staff deletes enduser-created observation', function () { return sdk.api.enduser_observations.deleteOne(withComponents_1.id); }, { shouldError: false, onResult: function () { return true; } })
                        // Cross-enduser: B cannot update/delete A's observation
                    ];
                case 24:
                    _d.sent();
                    return [4 /*yield*/, enduserSDK_1.api.enduser_observations.createOne({
                            enduserId: enduserA_1.id,
                            status: 'final',
                            category: 'vital-signs',
                            type: 'weight',
                            measurement: { value: 179, unit: 'lbs' },
                        })];
                case 25:
                    enduserACreated_1 = _d.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("cross-enduser: enduser B cannot update enduser A's observation", function () { return enduserSDKB_1.api.enduser_observations.updateOne(enduserACreated_1.id, { measurement: { value: 1, unit: 'lbs' } }); }, { shouldError: true, onError: function () { return true; } })];
                case 26:
                    _d.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("cross-enduser: enduser B cannot delete enduser A's observation", function () { return enduserSDKB_1.api.enduser_observations.deleteOne(enduserACreated_1.id); }, { shouldError: true, onError: function () { return true; } })];
                case 27:
                    _d.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("cross-enduser: enduser A's observation still exists (admin verify)", function () { return sdk.api.enduser_observations.getOne(enduserACreated_1.id); }, { onResult: function (o) { return o.id === enduserACreated_1.id && o.measurement.value === 179; } })
                        // ---- Requirement 1: USDA food search proxy (behavioral skip when not configured) ----
                    ];
                case 28:
                    _d.sent();
                    // ---- Requirement 1: USDA food search proxy (behavioral skip when not configured) ----
                    return [4 /*yield*/, usda_proxy_tests({ sdk: sdk, enduserSDK: enduserSDK_1 })];
                case 29:
                    // ---- Requirement 1: USDA food search proxy (behavioral skip when not configured) ----
                    _d.sent();
                    return [3 /*break*/, 39];
                case 30:
                    if (!enduserAId) return [3 /*break*/, 34];
                    _d.label = 31;
                case 31:
                    _d.trys.push([31, 33, , 34]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduserAId)];
                case 32:
                    _d.sent();
                    return [3 /*break*/, 34];
                case 33:
                    _b = _d.sent();
                    return [3 /*break*/, 34];
                case 34:
                    if (!enduserBId) return [3 /*break*/, 38];
                    _d.label = 35;
                case 35:
                    _d.trys.push([35, 37, , 38]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduserBId)];
                case 36:
                    _d.sent();
                    return [3 /*break*/, 38];
                case 37:
                    _c = _d.sent();
                    return [3 /*break*/, 38];
                case 38: return [7 /*endfinally*/];
                case 39: return [2 /*return*/];
            }
        });
    });
};
exports.nutrition_tracking_tests = nutrition_tracking_tests;
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
                    return [4 /*yield*/, (0, exports.nutrition_tracking_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Nutrition tracking test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Nutrition tracking test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=nutrition_tracking.test.js.map