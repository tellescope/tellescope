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
exports.load_inbox_redaction_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../../setup");
var host = process.env.API_URL || 'http://localhost:8080';
var ENDUSER_PASSWORD = 'F0151TestPassword!123';
/**
 * Regression test for F-0151
 * (security-audit/findings/F-0151-load-inbox-data-endusers-unredacted.md).
 *
 * load_inbox_data serialized $lookup'ed endusers via convert_id_name only (NOT applyRedactions),
 * so endusers.hashedPassword (redactions:['all']) leaked to staff sessions — while the sibling
 * phone_calls in the same response correctly went through applyRedactions.
 *
 * Repro: create an enduser, set their portal password (→ hashedPassword), seed an inbound
 * (logOnly) email so the enduser appears in the inbox join, then load_inbox_data as staff and
 * assert the returned enduser entry has NO hashedPassword.
 */
var load_inbox_redaction_tests = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var enduserId, emailId, email, enduser_1, seeded, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    (0, testing_1.log_header)("F-0151: load_inbox_data enduser redaction");
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, , 6, 15]);
                    email = "f0151-enduser-".concat(Date.now(), "@example.com");
                    return [4 /*yield*/, sdk.api.endusers.createOne({ email: email, fname: 'F0151', lname: 'Inbox' })];
                case 2:
                    enduser_1 = _d.sent();
                    enduserId = enduser_1.id;
                    return [4 /*yield*/, sdk.api.endusers.set_password({ id: enduser_1.id, password: ENDUSER_PASSWORD })
                        // Seed an inbound logOnly email so the enduser is joined into the inbox payload
                    ];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, sdk.api.emails.createOne({
                            enduserId: enduser_1.id, subject: 'F0151 seed', textContent: 'seed',
                            logOnly: true, inbound: true,
                        })];
                case 4:
                    seeded = _d.sent();
                    emailId = seeded.id;
                    return [4 /*yield*/, (0, testing_1.async_test)('F-0151: load_inbox_data does not leak enduser.hashedPassword to staff', function () { return sdk.api.endusers.load_inbox_data({ enduserIds: [enduser_1.id] }); }, {
                            onResult: function (r) {
                                var _a;
                                var returned = ((_a = r === null || r === void 0 ? void 0 : r.endusers) !== null && _a !== void 0 ? _a : []).find(function (e) { var _a; return ((_a = (e.id || e._id)) === null || _a === void 0 ? void 0 : _a.toString()) === enduserId; });
                                // require that the enduser actually came back (so the assertion is meaningful),
                                // and that hashedPassword is absent
                                return !!returned && !('hashedPassword' in returned);
                            },
                        })];
                case 5:
                    _d.sent();
                    return [3 /*break*/, 15];
                case 6:
                    if (!emailId) return [3 /*break*/, 10];
                    _d.label = 7;
                case 7:
                    _d.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, sdk.api.emails.deleteOne(emailId)];
                case 8:
                    _d.sent();
                    return [3 /*break*/, 10];
                case 9:
                    _b = _d.sent();
                    return [3 /*break*/, 10];
                case 10:
                    if (!enduserId) return [3 /*break*/, 14];
                    _d.label = 11;
                case 11:
                    _d.trys.push([11, 13, , 14]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduserId)];
                case 12:
                    _d.sent();
                    return [3 /*break*/, 14];
                case 13:
                    _c = _d.sent();
                    return [3 /*break*/, 14];
                case 14: return [7 /*endfinally*/];
                case 15: return [2 /*return*/];
            }
        });
    });
};
exports.load_inbox_redaction_tests = load_inbox_redaction_tests;
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
                    return [4 /*yield*/, (0, exports.load_inbox_redaction_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ F-0151 load_inbox_data redaction test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ F-0151 load_inbox_data redaction test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=F-0151-load-inbox-redaction.test.js.map