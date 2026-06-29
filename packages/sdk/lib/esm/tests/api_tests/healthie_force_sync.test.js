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
require('source-map-support').install();
import { Session } from "../../sdk";
import { async_test, log_header, } from "@tellescope/testing";
import { HEALTHIE_FORCE_SYNC_FIELD } from "@tellescope/constants";
import { setup_tests } from "../setup";
var host = process.env.API_URL || 'http://localhost:8080';
// Main test function that can be called independently
//
// Note: the full outbound re-push to Healthie requires a live Healthie sandbox and a linked
// patient, so this test only exercises the deterministic gating logic — that the designated
// incrementer field (HEALTHIE_FORCE_SYNC_FIELD) can be set and incremented on an enduser
// without error. The handle_updated_enduser side-effect detects the value change and forces
// a full demographic re-push; that behavior is verified manually against a Healthie sandbox.
export var healthie_force_sync_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var enduserId, enduser_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_header("Healthie Force Sync Field Tests");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 5, 8]);
                    return [4 /*yield*/, sdk.api.endusers.createOne({})];
                case 2:
                    enduser_1 = _b.sent();
                    enduserId = enduser_1.id;
                    // Test 1: setting the force-sync field for the first time succeeds (undefined -> value)
                    return [4 /*yield*/, async_test('force sync field - initial set succeeds', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var updated;
                            var _a;
                            var _b, _c, _d;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0: return [4 /*yield*/, sdk.api.endusers.updateOne(enduser_1.id, {
                                            fields: __assign(__assign({}, ((_b = enduser_1.fields) !== null && _b !== void 0 ? _b : {})), (_a = {}, _a[HEALTHIE_FORCE_SYNC_FIELD] = 1, _a)),
                                        })];
                                    case 1:
                                        updated = _e.sent();
                                        return [2 /*return*/, (_d = (_c = updated.fields) === null || _c === void 0 ? void 0 : _c[HEALTHIE_FORCE_SYNC_FIELD]) === null || _d === void 0 ? void 0 : _d.toString()];
                                }
                            });
                        }); }, { onResult: function (result) { return result === '1'; } })
                        // Test 2: incrementing the force-sync field succeeds (value -> new value)
                    ];
                case 3:
                    // Test 1: setting the force-sync field for the first time succeeds (undefined -> value)
                    _b.sent();
                    // Test 2: incrementing the force-sync field succeeds (value -> new value)
                    return [4 /*yield*/, async_test('force sync field - increment succeeds', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var current, updated;
                            var _a;
                            var _b, _c, _d;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0: return [4 /*yield*/, sdk.api.endusers.getOne(enduser_1.id)];
                                    case 1:
                                        current = _e.sent();
                                        return [4 /*yield*/, sdk.api.endusers.updateOne(enduser_1.id, {
                                                fields: __assign(__assign({}, ((_b = current.fields) !== null && _b !== void 0 ? _b : {})), (_a = {}, _a[HEALTHIE_FORCE_SYNC_FIELD] = 2, _a)),
                                            })];
                                    case 2:
                                        updated = _e.sent();
                                        return [2 /*return*/, (_d = (_c = updated.fields) === null || _c === void 0 ? void 0 : _c[HEALTHIE_FORCE_SYNC_FIELD]) === null || _d === void 0 ? void 0 : _d.toString()];
                                }
                            });
                        }); }, { onResult: function (result) { return result === '2'; } })];
                case 4:
                    // Test 2: incrementing the force-sync field succeeds (value -> new value)
                    _b.sent();
                    console.log("✅ All Healthie Force Sync field tests passed!");
                    return [3 /*break*/, 8];
                case 5:
                    if (!enduserId) return [3 /*break*/, 7];
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduserId)];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7: return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
};
// Allow running this test file independently
if (require.main === module) {
    console.log("\uD83C\uDF10 Using API URL: ".concat(host));
    var sdk_1 = new Session({ host: host });
    var sdkNonAdmin_1 = new Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setup_tests(sdk_1, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, healthie_force_sync_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Healthie force sync test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Healthie force sync test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=healthie_force_sync.test.js.map