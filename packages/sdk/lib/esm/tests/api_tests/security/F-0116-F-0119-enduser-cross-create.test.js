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
import { Session, EnduserSession } from "../../../sdk";
import { async_test, log_header, } from "@tellescope/testing";
import { setup_tests } from "../../setup";
var host = process.env.API_URL || 'http://localhost:8080';
var businessId = '60398b1131a295e64f084ff6';
var ENDUSER_PASSWORD = 'F0116TestPassword!123';
var CROSS_ENDUSER_MESSAGE = "enduserId does not match creator id for enduser session";
/**
 * Regression test for the enduser cross-enduser CREATE gating gaps:
 *   F-0116 enduser_observations  (security-audit/findings/F-0116-*.md)
 *   F-0117 enduser_orders        (security-audit/findings/F-0117-*.md)
 *   F-0119 managed_content_records (security-audit/findings/F-0119-*.md)
 *   F-0118 chat_rooms (enduserIds-only gate; staff userIds targeting is by-design)
 *
 * Each model exposed enduserActions.create with an `enduserId`/`enduserIds` field that
 * lacked a write-side gate, letting an authenticated enduser create records bound to a
 * DIFFERENT enduser in the same tenant. The fix adds a `constraints.relationship`
 * evaluator mirroring the canonical `tickets` pattern (schema.ts).
 *
 * Methodology: each section asserts BOTH the exploit-is-blocked case AND that the
 * legitimate path (self-create + staff-create) still works.
 */
export var enduser_cross_create_tests = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var attackerId, victimId, createdObservationIds, createdOrderIds, createdContentIds, createdRoomIds, attackerEmail, victimEmail, attacker, victim, attackerSDK_1, orderPayload_1, staffId_1, _i, createdRoomIds_1, id, _b, _c, createdContentIds_1, id, _d, _e, createdObservationIds_1, id, _f, _g, createdOrderIds_1, id, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    log_header("F-0116/F-0117/F-0118/F-0119: enduser cross-enduser create gates");
                    createdObservationIds = [];
                    createdOrderIds = [];
                    createdContentIds = [];
                    createdRoomIds = [];
                    _l.label = 1;
                case 1:
                    _l.trys.push([1, , 21, 54]);
                    attackerEmail = "f0116-attacker-".concat(Date.now(), "@example.com");
                    victimEmail = "f0116-victim-".concat(Date.now(), "@example.com");
                    return [4 /*yield*/, sdk.api.endusers.createOne({ email: attackerEmail, fname: 'F0116', lname: 'Attacker' })];
                case 2:
                    attacker = _l.sent();
                    attackerId = attacker.id;
                    return [4 /*yield*/, sdk.api.endusers.createOne({ email: victimEmail, fname: 'F0116', lname: 'Victim' })];
                case 3:
                    victim = _l.sent();
                    victimId = victim.id;
                    return [4 /*yield*/, sdk.api.endusers.set_password({ id: attacker.id, password: ENDUSER_PASSWORD })];
                case 4:
                    _l.sent();
                    attackerSDK_1 = new EnduserSession({ host: host, businessId: businessId });
                    return [4 /*yield*/, attackerSDK_1.authenticate(attackerEmail, ENDUSER_PASSWORD)
                        // ============================================================
                        // F-0116 — enduser_observations
                        // ============================================================
                    ];
                case 5:
                    _l.sent();
                    // ============================================================
                    // F-0116 — enduser_observations
                    // ============================================================
                    return [4 /*yield*/, async_test("F-0116: enduser cannot create observation on another enduser (createOne)", function () { return attackerSDK_1.api.enduser_observations.createOne({
                            enduserId: victimId, category: 'vital-signs', status: 'final',
                            measurement: { unit: 'mmHg', value: 220 },
                        }); }, { shouldError: true, onError: function (e) { return e.message === CROSS_ENDUSER_MESSAGE; } })];
                case 6:
                    // ============================================================
                    // F-0116 — enduser_observations
                    // ============================================================
                    _l.sent();
                    return [4 /*yield*/, async_test("F-0116: enduser cannot create observation on another enduser (createMany)", function () { return attackerSDK_1.api.enduser_observations.createSome([{
                                enduserId: victimId, category: 'vital-signs', status: 'final',
                                measurement: { unit: 'mmHg', value: 220 },
                            }]); }, { shouldError: true, onError: function (e) { return e.message === CROSS_ENDUSER_MESSAGE; } })
                        // Positive control: enduser CAN create an observation on their OWN record
                    ];
                case 7:
                    _l.sent();
                    // Positive control: enduser CAN create an observation on their OWN record
                    return [4 /*yield*/, async_test("F-0116: enduser can still create observation on own record", function () { return attackerSDK_1.api.enduser_observations.createOne({
                            enduserId: attackerId, category: 'vital-signs', status: 'final',
                            measurement: { unit: 'mmHg', value: 120 },
                        }); }, { onResult: function (o) { if (o === null || o === void 0 ? void 0 : o.id)
                                createdObservationIds.push(o.id); return (o === null || o === void 0 ? void 0 : o.enduserId) === attackerId; } })
                        // Positive control: staff CAN create an observation on any tenant enduser
                    ];
                case 8:
                    // Positive control: enduser CAN create an observation on their OWN record
                    _l.sent();
                    // Positive control: staff CAN create an observation on any tenant enduser
                    return [4 /*yield*/, async_test("F-0116: staff can still create observation on any enduser", function () { return sdk.api.enduser_observations.createOne({
                            enduserId: victimId, category: 'vital-signs', status: 'final',
                            measurement: { unit: 'mmHg', value: 118 },
                        }); }, { onResult: function (o) { if (o === null || o === void 0 ? void 0 : o.id)
                                createdObservationIds.push(o.id); return (o === null || o === void 0 ? void 0 : o.enduserId) === victimId; } })
                        // ============================================================
                        // F-0117 — enduser_orders
                        // ============================================================
                    ];
                case 9:
                    // Positive control: staff CAN create an observation on any tenant enduser
                    _l.sent();
                    orderPayload_1 = function (enduserId) { return ({
                        enduserId: enduserId,
                        externalId: "f0117-".concat(Date.now()), source: 'f0117-source',
                        title: 'f0117 order', status: 'pending',
                    }); };
                    return [4 /*yield*/, async_test("F-0117: enduser cannot create order on another enduser", function () { return attackerSDK_1.api.enduser_orders.createOne(orderPayload_1(victimId)); }, { shouldError: true, onError: function (e) { return e.message === CROSS_ENDUSER_MESSAGE; } })];
                case 10:
                    _l.sent();
                    return [4 /*yield*/, async_test("F-0117: enduser can still create order on own record", function () { return attackerSDK_1.api.enduser_orders.createOne(orderPayload_1(attackerId)); }, { onResult: function (o) { if (o === null || o === void 0 ? void 0 : o.id)
                                createdOrderIds.push(o.id); return (o === null || o === void 0 ? void 0 : o.enduserId) === attackerId; } })];
                case 11:
                    _l.sent();
                    return [4 /*yield*/, async_test("F-0117: staff can still create order on any enduser", function () { return sdk.api.enduser_orders.createOne(orderPayload_1(victimId)); }, { onResult: function (o) { if (o === null || o === void 0 ? void 0 : o.id)
                                createdOrderIds.push(o.id); return (o === null || o === void 0 ? void 0 : o.enduserId) === victimId; } })
                        // ============================================================
                        // F-0119 — managed_content_records
                        // ============================================================
                    ];
                case 12:
                    _l.sent();
                    // ============================================================
                    // F-0119 — managed_content_records
                    // ============================================================
                    return [4 /*yield*/, async_test("F-0119: enduser cannot create content with allowUnauthenticatedAccess", function () { return attackerSDK_1.api.managed_content_records.createOne({
                            title: 'f0119 phishing', textContent: 'x', allowUnauthenticatedAccess: true,
                        }); }, { shouldError: true, onError: function (e) { return e.message === "allowUnauthenticatedAccess cannot be set by endusers"; } })];
                case 13:
                    // ============================================================
                    // F-0119 — managed_content_records
                    // ============================================================
                    _l.sent();
                    return [4 /*yield*/, async_test("F-0119: enduser cannot create content with publicRead", function () { return attackerSDK_1.api.managed_content_records.createOne({
                            title: 'f0119 broadcast', textContent: 'x', publicRead: true,
                        }); }, { shouldError: true, onError: function (e) { return e.message === "publicRead cannot be set by endusers"; } })];
                case 14:
                    _l.sent();
                    return [4 /*yield*/, async_test("F-0119: enduser cannot create content bound to another enduser", function () { return attackerSDK_1.api.managed_content_records.createOne({
                            title: 'f0119 cross', textContent: 'x', enduserId: victimId,
                        }); }, { shouldError: true, onError: function (e) { return e.message === CROSS_ENDUSER_MESSAGE; } })];
                case 15:
                    _l.sent();
                    return [4 /*yield*/, async_test("F-0119: enduser can still create ordinary content", function () { return attackerSDK_1.api.managed_content_records.createOne({
                            title: 'f0119 ok', textContent: 'hello',
                        }); }, { onResult: function (o) { if (o === null || o === void 0 ? void 0 : o.id)
                                createdContentIds.push(o.id); return !(o === null || o === void 0 ? void 0 : o.publicRead) && !(o === null || o === void 0 ? void 0 : o.allowUnauthenticatedAccess); } })];
                case 16:
                    _l.sent();
                    return [4 /*yield*/, async_test("F-0119: staff can still create public content", function () { return sdk.api.managed_content_records.createOne({
                            title: 'f0119 staff public', textContent: 'x', publicRead: true,
                        }); }, { onResult: function (o) { if (o === null || o === void 0 ? void 0 : o.id)
                                createdContentIds.push(o.id); return (o === null || o === void 0 ? void 0 : o.publicRead) === true; } })
                        // ============================================================
                        // F-0118 — chat_rooms (enduserIds-only gate; staff userIds targeting is by-design)
                        // ============================================================
                    ];
                case 17:
                    _l.sent();
                    staffId_1 = sdk.userInfo.id;
                    return [4 /*yield*/, async_test("F-0118: enduser cannot add another patient to a chat room (enduserIds)", function () { return attackerSDK_1.api.chat_rooms.createOne({
                            type: 'internal', enduserIds: [attackerId, victimId], userIds: [staffId_1],
                        }); }, { shouldError: true, onError: function (e) { return e.message === "enduserIds may only contain your own id for enduser session"; } })
                        // Positive control: patient CAN create a room with care-team staff + self (intended feature)
                    ];
                case 18:
                    _l.sent();
                    // Positive control: patient CAN create a room with care-team staff + self (intended feature)
                    return [4 /*yield*/, async_test("F-0118: enduser can still create a room with staff + self", function () { return attackerSDK_1.api.chat_rooms.createOne({
                            type: 'internal', enduserIds: [attackerId], userIds: [staffId_1],
                        }); }, { onResult: function (o) { var _a, _b; if (o === null || o === void 0 ? void 0 : o.id)
                                createdRoomIds.push(o.id); return ((_a = o === null || o === void 0 ? void 0 : o.enduserIds) === null || _a === void 0 ? void 0 : _a.length) === 1 && ((_b = o === null || o === void 0 ? void 0 : o.userIds) === null || _b === void 0 ? void 0 : _b.includes(staffId_1)); } })
                        // Positive control: staff can still create multi-patient rooms
                    ];
                case 19:
                    // Positive control: patient CAN create a room with care-team staff + self (intended feature)
                    _l.sent();
                    // Positive control: staff can still create multi-patient rooms
                    return [4 /*yield*/, async_test("F-0118: staff can still create a room with multiple endusers", function () { return sdk.api.chat_rooms.createOne({
                            type: 'internal', enduserIds: [attackerId, victimId], userIds: [staffId_1],
                        }); }, { onResult: function (o) { var _a; if (o === null || o === void 0 ? void 0 : o.id)
                                createdRoomIds.push(o.id); return ((_a = o === null || o === void 0 ? void 0 : o.enduserIds) === null || _a === void 0 ? void 0 : _a.length) === 2; } })];
                case 20:
                    // Positive control: staff can still create multi-patient rooms
                    _l.sent();
                    return [3 /*break*/, 54];
                case 21:
                    _i = 0, createdRoomIds_1 = createdRoomIds;
                    _l.label = 22;
                case 22:
                    if (!(_i < createdRoomIds_1.length)) return [3 /*break*/, 27];
                    id = createdRoomIds_1[_i];
                    _l.label = 23;
                case 23:
                    _l.trys.push([23, 25, , 26]);
                    return [4 /*yield*/, sdk.api.chat_rooms.deleteOne(id)];
                case 24:
                    _l.sent();
                    return [3 /*break*/, 26];
                case 25:
                    _b = _l.sent();
                    return [3 /*break*/, 26];
                case 26:
                    _i++;
                    return [3 /*break*/, 22];
                case 27:
                    _c = 0, createdContentIds_1 = createdContentIds;
                    _l.label = 28;
                case 28:
                    if (!(_c < createdContentIds_1.length)) return [3 /*break*/, 33];
                    id = createdContentIds_1[_c];
                    _l.label = 29;
                case 29:
                    _l.trys.push([29, 31, , 32]);
                    return [4 /*yield*/, sdk.api.managed_content_records.deleteOne(id)];
                case 30:
                    _l.sent();
                    return [3 /*break*/, 32];
                case 31:
                    _d = _l.sent();
                    return [3 /*break*/, 32];
                case 32:
                    _c++;
                    return [3 /*break*/, 28];
                case 33:
                    _e = 0, createdObservationIds_1 = createdObservationIds;
                    _l.label = 34;
                case 34:
                    if (!(_e < createdObservationIds_1.length)) return [3 /*break*/, 39];
                    id = createdObservationIds_1[_e];
                    _l.label = 35;
                case 35:
                    _l.trys.push([35, 37, , 38]);
                    return [4 /*yield*/, sdk.api.enduser_observations.deleteOne(id)];
                case 36:
                    _l.sent();
                    return [3 /*break*/, 38];
                case 37:
                    _f = _l.sent();
                    return [3 /*break*/, 38];
                case 38:
                    _e++;
                    return [3 /*break*/, 34];
                case 39:
                    _g = 0, createdOrderIds_1 = createdOrderIds;
                    _l.label = 40;
                case 40:
                    if (!(_g < createdOrderIds_1.length)) return [3 /*break*/, 45];
                    id = createdOrderIds_1[_g];
                    _l.label = 41;
                case 41:
                    _l.trys.push([41, 43, , 44]);
                    return [4 /*yield*/, sdk.api.enduser_orders.deleteOne(id)];
                case 42:
                    _l.sent();
                    return [3 /*break*/, 44];
                case 43:
                    _h = _l.sent();
                    return [3 /*break*/, 44];
                case 44:
                    _g++;
                    return [3 /*break*/, 40];
                case 45:
                    if (!attackerId) return [3 /*break*/, 49];
                    _l.label = 46;
                case 46:
                    _l.trys.push([46, 48, , 49]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(attackerId)];
                case 47:
                    _l.sent();
                    return [3 /*break*/, 49];
                case 48:
                    _j = _l.sent();
                    return [3 /*break*/, 49];
                case 49:
                    if (!victimId) return [3 /*break*/, 53];
                    _l.label = 50;
                case 50:
                    _l.trys.push([50, 52, , 53]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(victimId)];
                case 51:
                    _l.sent();
                    return [3 /*break*/, 53];
                case 52:
                    _k = _l.sent();
                    return [3 /*break*/, 53];
                case 53: return [7 /*endfinally*/];
                case 54: return [2 /*return*/];
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
                    return [4 /*yield*/, enduser_cross_create_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ F-0116/F-0117/F-0118/F-0119 enduser cross-create test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ enduser cross-create test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=F-0116-F-0119-enduser-cross-create.test.js.map