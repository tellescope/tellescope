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
import { setup_tests } from "../setup";
var host = process.env.API_URL || 'http://localhost:8080';
export var organization_settings_duplicates_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var orgId;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_header("Organization Settings Duplicate Validation Tests");
                    orgId = sdk.userInfo.businessId;
                    // === A. replaceObjectFields: false (merge/push behavior) ===
                    // A1. Duplicate tags via merge
                    return [4 /*yield*/, sdk.api.organizations.updateOne(orgId, {
                            settings: { endusers: { tags: ['tag1', 'tag2'] } }
                        }, { replaceObjectFields: true })];
                case 1:
                    // === A. replaceObjectFields: false (merge/push behavior) ===
                    // A1. Duplicate tags via merge
                    _b.sent();
                    return [4 /*yield*/, async_test("Merge tags rejects duplicates (tag2 appears in both old and new)", function () { return sdk.api.organizations.updateOne(orgId, {
                            settings: { endusers: { tags: ['tag2', 'tag3'] } }
                        }); }, { shouldError: true, onError: function (e) { return e.message.includes('Duplicate value in settings.endusers.tags'); } })
                        // A2. Duplicate customFields via merge
                    ];
                case 2:
                    _b.sent();
                    // A2. Duplicate customFields via merge
                    return [4 /*yield*/, sdk.api.organizations.updateOne(orgId, {
                            settings: { endusers: { customFields: [{ type: 'Text', field: 'myField', info: {} }] } }
                        }, { replaceObjectFields: true })];
                case 3:
                    // A2. Duplicate customFields via merge
                    _b.sent();
                    return [4 /*yield*/, async_test("Merge customFields rejects duplicate field name", function () { return sdk.api.organizations.updateOne(orgId, {
                            settings: { endusers: { customFields: [{ type: 'Text', field: 'myField', info: {} }] } }
                        }); }, { shouldError: true, onError: function (e) { return e.message.includes('Duplicate field in settings.endusers.customFields'); } })
                        // A3. Duplicate builtinFields via merge
                    ];
                case 4:
                    _b.sent();
                    // A3. Duplicate builtinFields via merge
                    return [4 /*yield*/, sdk.api.organizations.updateOne(orgId, {
                            settings: { endusers: { builtinFields: [{ field: 'fname', label: 'First Name' }] } }
                        }, { replaceObjectFields: true })];
                case 5:
                    // A3. Duplicate builtinFields via merge
                    _b.sent();
                    return [4 /*yield*/, async_test("Merge builtinFields rejects duplicate field name", function () { return sdk.api.organizations.updateOne(orgId, {
                            settings: { endusers: { builtinFields: [{ field: 'fname', label: 'First Name Copy' }] } }
                        }); }, { shouldError: true, onError: function (e) { return e.message.includes('Duplicate field in settings.endusers.builtinFields'); } })
                        // A4. Duplicate dontRecordCallsToPhone via merge
                    ];
                case 6:
                    _b.sent();
                    // A4. Duplicate dontRecordCallsToPhone via merge
                    return [4 /*yield*/, sdk.api.organizations.updateOne(orgId, {
                            settings: { endusers: { dontRecordCallsToPhone: ['+15551234567'] } }
                        }, { replaceObjectFields: true })];
                case 7:
                    // A4. Duplicate dontRecordCallsToPhone via merge
                    _b.sent();
                    return [4 /*yield*/, async_test("Merge dontRecordCallsToPhone rejects duplicates", function () { return sdk.api.organizations.updateOne(orgId, {
                            settings: { endusers: { dontRecordCallsToPhone: ['+15551234567'] } }
                        }); }, { shouldError: true, onError: function (e) { return e.message.includes('Duplicate value in settings.endusers.dontRecordCallsToPhone'); } })
                        // A5. Duplicate cancelReasons via merge
                    ];
                case 8:
                    _b.sent();
                    // A5. Duplicate cancelReasons via merge
                    return [4 /*yield*/, sdk.api.organizations.updateOne(orgId, {
                            settings: { calendar: { cancelReasons: ['No show'] } }
                        }, { replaceObjectFields: true })];
                case 9:
                    // A5. Duplicate cancelReasons via merge
                    _b.sent();
                    return [4 /*yield*/, async_test("Merge cancelReasons rejects duplicates", function () { return sdk.api.organizations.updateOne(orgId, {
                            settings: { calendar: { cancelReasons: ['No show'] } }
                        }); }, { shouldError: true, onError: function (e) { return e.message.includes('Duplicate value in settings.calendar.cancelReasons'); } })
                        // === B. replaceObjectFields: true (full replacement) ===
                        // B1. Replace that grows the array with dupes should be rejected
                    ];
                case 10:
                    _b.sent();
                    // === B. replaceObjectFields: true (full replacement) ===
                    // B1. Replace that grows the array with dupes should be rejected
                    return [4 /*yield*/, sdk.api.organizations.updateOne(orgId, {
                            settings: { endusers: { tags: ['tag1'] } }
                        }, { replaceObjectFields: true })];
                case 11:
                    // === B. replaceObjectFields: true (full replacement) ===
                    // B1. Replace that grows the array with dupes should be rejected
                    _b.sent();
                    return [4 /*yield*/, async_test("Replace tags rejects duplicates when array grows", function () { return sdk.api.organizations.updateOne(orgId, {
                            settings: { endusers: { tags: ['tag1', 'tag1', 'tag2'] } }
                        }, { replaceObjectFields: true }); }, { shouldError: true, onError: function (e) { return e.message.includes('Duplicate value in settings.endusers.tags'); } })
                        // B2. Replace with dupes that shrinks the array should be allowed
                    ];
                case 12:
                    _b.sent();
                    // B2. Replace with dupes that shrinks the array should be allowed
                    return [4 /*yield*/, sdk.api.organizations.updateOne(orgId, {
                            settings: { endusers: { tags: ['a', 'b', 'c'] } }
                        }, { replaceObjectFields: true })];
                case 13:
                    // B2. Replace with dupes that shrinks the array should be allowed
                    _b.sent();
                    return [4 /*yield*/, async_test("Replace with dupes that shrinks array succeeds", function () { return sdk.api.organizations.updateOne(orgId, {
                            settings: { endusers: { tags: ['a', 'a'] } }
                        }, { replaceObjectFields: true }); }, { shouldError: false, onResult: function () { return true; } })
                        // B3. Replace with unique values always succeeds
                    ];
                case 14:
                    _b.sent();
                    // B3. Replace with unique values always succeeds
                    return [4 /*yield*/, async_test("Replace tags succeeds with unique values", function () { return sdk.api.organizations.updateOne(orgId, {
                            settings: { endusers: { tags: ['tag1', 'tag2'] } }
                        }, { replaceObjectFields: true }); }, { shouldError: false, onResult: function () { return true; } })
                        // === C. Non-duplicate updates still succeed ===
                        // C1. Set initial tags then add different tags via merge
                    ];
                case 15:
                    // B3. Replace with unique values always succeeds
                    _b.sent();
                    // === C. Non-duplicate updates still succeed ===
                    // C1. Set initial tags then add different tags via merge
                    return [4 /*yield*/, sdk.api.organizations.updateOne(orgId, {
                            settings: { endusers: { tags: ['tagA', 'tagB'] } }
                        }, { replaceObjectFields: true })];
                case 16:
                    // === C. Non-duplicate updates still succeed ===
                    // C1. Set initial tags then add different tags via merge
                    _b.sent();
                    return [4 /*yield*/, async_test("Merge with unique new tags succeeds", function () { return sdk.api.organizations.updateOne(orgId, {
                            settings: { endusers: { tags: ['tagC', 'tagD'] } }
                        }); }, { shouldError: false, onResult: function () { return true; } })
                        // C2. Replace with unique values
                    ];
                case 17:
                    _b.sent();
                    // C2. Replace with unique values
                    return [4 /*yield*/, async_test("Replace customFields with unique values succeeds", function () { return sdk.api.organizations.updateOne(orgId, {
                            settings: { endusers: { customFields: [
                                        { type: 'Text', field: 'field1', info: {} },
                                        { type: 'Text', field: 'field2', info: {} },
                                    ] } }
                        }, { replaceObjectFields: true }); }, { shouldError: false, onResult: function () { return true; } })
                        // C3. Updating another settings field preserves pre-existing duplicates
                        // First set tags to a longer array, then shrink to a dupe array (shrinking is allowed)
                    ];
                case 18:
                    // C2. Replace with unique values
                    _b.sent();
                    // C3. Updating another settings field preserves pre-existing duplicates
                    // First set tags to a longer array, then shrink to a dupe array (shrinking is allowed)
                    return [4 /*yield*/, sdk.api.organizations.updateOne(orgId, {
                            settings: { endusers: { tags: ['dupeTag', 'otherTag', 'anotherTag'] } }
                        }, { replaceObjectFields: true })];
                case 19:
                    // C3. Updating another settings field preserves pre-existing duplicates
                    // First set tags to a longer array, then shrink to a dupe array (shrinking is allowed)
                    _b.sent();
                    return [4 /*yield*/, sdk.api.organizations.updateOne(orgId, {
                            settings: { endusers: { tags: ['dupeTag', 'dupeTag'] } }
                        }, { replaceObjectFields: true })];
                case 20:
                    _b.sent();
                    return [4 /*yield*/, async_test("Updating cancelReasons succeeds even when tags has pre-existing duplicates", function () { return sdk.api.organizations.updateOne(orgId, {
                            settings: { calendar: { cancelReasons: ['new reason'] } }
                        }, { replaceObjectFields: true }); }, { shouldError: false, onResult: function () { return true; } })
                        // Clean up settings to avoid affecting other tests
                    ];
                case 21:
                    _b.sent();
                    // Clean up settings to avoid affecting other tests
                    return [4 /*yield*/, sdk.api.organizations.updateOne(orgId, {
                            settings: {
                                endusers: {
                                    tags: [],
                                    customFields: [],
                                    builtinFields: [],
                                    dontRecordCallsToPhone: [],
                                },
                                calendar: {
                                    cancelReasons: [],
                                },
                            }
                        }, { replaceObjectFields: true })];
                case 22:
                    // Clean up settings to avoid affecting other tests
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
};
// Allow running this test file independently
if (require.main === module) {
    console.log("Using API URL: ".concat(host));
    var sdk_1 = new Session({ host: host });
    var sdkNonAdmin_1 = new Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setup_tests(sdk_1, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, organization_settings_duplicates_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Organization settings duplicate validation tests completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Organization settings duplicate validation tests failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=organization_settings_duplicates.test.js.map