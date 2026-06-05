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
// Reproduces CU-86e1q4e51: clearing Canvas codings (sending an all-empty-string
// coding object with replaceObjectFields) on a template/event that previously had
// them saved must succeed. Pre-fix the backend rejected '' with a 400
// ("Expecting non-empty string") because the fields used canvasCodingValidator.
var POPULATED_CODING = { system: 'http://snomed.info/sct', code: '12345', display: 'Example Coding' };
var EMPTY_CODING = { system: '', code: '', display: '' };
export var calendar_canvas_coding_clear_tests = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var template, event, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    log_header("Calendar Canvas Coding Clear Tests");
                    return [4 /*yield*/, sdk.api.calendar_event_templates.createOne({
                            title: 'Canvas Coding Clear Template',
                            durationInMinutes: 30,
                            canvasCoding: POPULATED_CODING,
                            canvasReasonCoding: POPULATED_CODING,
                        })];
                case 1:
                    template = _d.sent();
                    return [4 /*yield*/, sdk.api.calendar_events.createOne({
                            title: 'Canvas Coding Clear Event',
                            durationInMinutes: 30,
                            startTimeInMS: Date.now(),
                            canvasCoding: POPULATED_CODING,
                            canvasReasonCoding: POPULATED_CODING,
                        })];
                case 2:
                    event = _d.sent();
                    _d.label = 3;
                case 3:
                    _d.trys.push([3, , 6, 13]);
                    return [4 /*yield*/, async_test('Clearing Canvas codings on a calendar_event_template saves successfully', function () { return sdk.api.calendar_event_templates.updateOne(template.id, { canvasCoding: EMPTY_CODING, canvasReasonCoding: EMPTY_CODING }, { replaceObjectFields: true }); }, { onResult: function (t) { var _a, _b; return !((_a = t.canvasCoding) === null || _a === void 0 ? void 0 : _a.code) && !((_b = t.canvasReasonCoding) === null || _b === void 0 ? void 0 : _b.code); } })];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, async_test('Clearing Canvas codings on a calendar_event saves successfully', function () { return sdk.api.calendar_events.updateOne(event.id, { canvasCoding: EMPTY_CODING, canvasReasonCoding: EMPTY_CODING }, { replaceObjectFields: true }); }, { onResult: function (e) { var _a, _b; return !((_a = e.canvasCoding) === null || _a === void 0 ? void 0 : _a.code) && !((_b = e.canvasReasonCoding) === null || _b === void 0 ? void 0 : _b.code); } })];
                case 5:
                    _d.sent();
                    return [3 /*break*/, 13];
                case 6:
                    _d.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, sdk.api.calendar_event_templates.deleteOne(template.id)];
                case 7:
                    _d.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _b = _d.sent();
                    return [3 /*break*/, 9];
                case 9:
                    _d.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, sdk.api.calendar_events.deleteOne(event.id)];
                case 10:
                    _d.sent();
                    return [3 /*break*/, 12];
                case 11:
                    _c = _d.sent();
                    return [3 /*break*/, 12];
                case 12: return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
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
                    return [4 /*yield*/, calendar_canvas_coding_clear_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Calendar canvas coding clear test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Calendar canvas coding clear test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=calendar_canvas_coding_clear.test.js.map