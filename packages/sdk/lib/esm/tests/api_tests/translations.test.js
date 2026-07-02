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
import { assert, log_header, } from "@tellescope/testing";
import { setup_tests } from "../setup";
var host = process.env.API_URL || 'http://localhost:8080';
// Modular test for the translations framework.
// Validates that a model's `translations` field (nested { field: { language: text } }) is accepted by
// schema validation, persists, and accumulates multiple languages (uses phone_calls as the MVP model).
//
// NOTE: this test deliberately does NOT invoke the AI translation endpoint (ai_conversations.send_message).
// That path consumes AI credits and belongs in an eval, not a regularly-run test. The endpoint itself is
// already covered by the AI Summary feature, and the translation-specific logic (the system-prompt
// builder in @tellescope/utilities) is a pure function verified at compile time.
export var translations_tests = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var enduser, callId, call, translations, updated, merged, updated2;
        var _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    log_header("Translations Framework Tests");
                    return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'Translation', lname: 'Tester' })];
                case 1:
                    enduser = _j.sent();
                    _j.label = 2;
                case 2:
                    _j.trys.push([2, , 8, 12]);
                    return [4 /*yield*/, sdk.api.phone_calls.createOne({
                            enduserId: enduser.id,
                            inbound: true,
                            userId: sdk.userInfo.id,
                            transcription: 'Hola, por favor devuélvame la llamada cuando pueda.',
                        })];
                case 3:
                    call = _j.sent();
                    callId = call.id;
                    translations = { transcription: { en: 'Hi, please call me back when you can.' } };
                    return [4 /*yield*/, sdk.api.phone_calls.updateOne(call.id, { translations: translations }, { replaceObjectFields: true })];
                case 4:
                    _j.sent();
                    return [4 /*yield*/, sdk.api.phone_calls.getOne(call.id)];
                case 5:
                    updated = _j.sent();
                    assert(((_c = (_b = updated.translations) === null || _b === void 0 ? void 0 : _b.transcription) === null || _c === void 0 ? void 0 : _c.en) === translations.transcription.en, "translations not persisted: ".concat(JSON.stringify(updated.translations)), 'translations field persisted correctly');
                    merged = __assign(__assign({}, updated.translations), { transcription: __assign(__assign({}, (_d = updated.translations) === null || _d === void 0 ? void 0 : _d.transcription), { es: 'Hola de nuevo.' }) });
                    return [4 /*yield*/, sdk.api.phone_calls.updateOne(call.id, { translations: merged }, { replaceObjectFields: true })];
                case 6:
                    _j.sent();
                    return [4 /*yield*/, sdk.api.phone_calls.getOne(call.id)];
                case 7:
                    updated2 = _j.sent();
                    assert(!!((_f = (_e = updated2.translations) === null || _e === void 0 ? void 0 : _e.transcription) === null || _f === void 0 ? void 0 : _f.en) && !!((_h = (_g = updated2.translations) === null || _g === void 0 ? void 0 : _g.transcription) === null || _h === void 0 ? void 0 : _h.es), "translations did not accumulate: ".concat(JSON.stringify(updated2.translations)), 'multiple language translations accumulate under one field');
                    return [3 /*break*/, 12];
                case 8:
                    if (!callId) return [3 /*break*/, 10];
                    return [4 /*yield*/, sdk.api.phone_calls.deleteOne(callId).catch(function () { })];
                case 9:
                    _j.sent();
                    _j.label = 10;
                case 10: return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id).catch(function () { })];
                case 11:
                    _j.sent();
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
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
                    return [4 /*yield*/, translations_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Translations test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Translations test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=translations.test.js.map