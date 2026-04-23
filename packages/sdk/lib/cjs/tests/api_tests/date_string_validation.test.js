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
exports.date_string_validation_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var validation_1 = require("@tellescope/validation");
var host = process.env.API_URL || 'http://localhost:8080';
var date_string_validation_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            (0, testing_1.log_header)("Date String Validation Tests (is_valid_mm_dd_yyyy)");
            // --- Valid standard dates ---
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('01-15-1990') === true, 'Expected 01-15-1990 to be valid', 'valid: 01-15-1990');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('12-31-2024') === true, 'Expected 12-31-2024 to be valid', 'valid: 12-31-2024');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('06-15-2000') === true, 'Expected 06-15-2000 to be valid', 'valid: 06-15-2000');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('01-01-2000') === true, 'Expected 01-01-2000 to be valid', 'valid: 01-01-2000');
            // --- Leap year: Feb 29 accepted ---
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('02-29-2024') === true, 'Expected 02-29-2024 to be valid (2024 is leap year, div by 4)', 'valid: 02-29-2024 (leap year)');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('02-29-2000') === true, 'Expected 02-29-2000 to be valid (2000 is leap year, div by 400)', 'valid: 02-29-2000 (leap year)');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('02-29-2400') === true, 'Expected 02-29-2400 to be valid (2400 is leap year, div by 400)', 'valid: 02-29-2400 (leap year)');
            // --- Non-leap year: Feb 29 rejected ---
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('02-29-2023') === false, 'Expected 02-29-2023 to be invalid (2023 is not a leap year)', 'invalid: 02-29-2023 (not leap year)');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('02-29-1900') === false, 'Expected 02-29-1900 to be invalid (1900 div by 100 but not 400)', 'invalid: 02-29-1900 (not leap year)');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('02-29-2100') === false, 'Expected 02-29-2100 to be invalid (2100 div by 100 but not 400)', 'invalid: 02-29-2100 (not leap year)');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('02-29-2025') === false, 'Expected 02-29-2025 to be invalid (2025 is not a leap year)', 'invalid: 02-29-2025 (not leap year)');
            // --- Feb 30 and Feb 31 always rejected (the original bug) ---
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('02-30-2024') === false, 'Expected 02-30-2024 to be invalid (Feb never has 30 days)', 'invalid: 02-30-2024 (Feb 30 leap year)');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('02-31-2024') === false, 'Expected 02-31-2024 to be invalid (Feb never has 31 days)', 'invalid: 02-31-2024 (Feb 31 leap year)');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('02-30-2023') === false, 'Expected 02-30-2023 to be invalid (Feb never has 30 days)', 'invalid: 02-30-2023 (Feb 30 non-leap)');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('02-31-2023') === false, 'Expected 02-31-2023 to be invalid (Feb never has 31 days)', 'invalid: 02-31-2023 (Feb 31 non-leap)');
            // --- Feb 28 always valid ---
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('02-28-2024') === true, 'Expected 02-28-2024 to be valid', 'valid: 02-28-2024');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('02-28-2023') === true, 'Expected 02-28-2023 to be valid', 'valid: 02-28-2023');
            // --- 30-day months: day 31 rejected ---
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('04-31-2024') === false, 'Expected 04-31-2024 to be invalid (April has 30 days)', 'invalid: 04-31 (April)');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('06-31-2024') === false, 'Expected 06-31-2024 to be invalid (June has 30 days)', 'invalid: 06-31 (June)');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('09-31-2024') === false, 'Expected 09-31-2024 to be invalid (September has 30 days)', 'invalid: 09-31 (September)');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('11-31-2024') === false, 'Expected 11-31-2024 to be invalid (November has 30 days)', 'invalid: 11-31 (November)');
            // --- 30-day months: day 30 accepted ---
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('04-30-2024') === true, 'Expected 04-30-2024 to be valid', 'valid: 04-30 (April)');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('06-30-2024') === true, 'Expected 06-30-2024 to be valid', 'valid: 06-30 (June)');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('09-30-2024') === true, 'Expected 09-30-2024 to be valid', 'valid: 09-30 (September)');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('11-30-2024') === true, 'Expected 11-30-2024 to be valid', 'valid: 11-30 (November)');
            // --- 31-day months: day 31 accepted ---
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('01-31-2024') === true, 'Expected 01-31-2024 to be valid', 'valid: 01-31 (January)');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('03-31-2024') === true, 'Expected 03-31-2024 to be valid', 'valid: 03-31 (March)');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('05-31-2024') === true, 'Expected 05-31-2024 to be valid', 'valid: 05-31 (May)');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('07-31-2024') === true, 'Expected 07-31-2024 to be valid', 'valid: 07-31 (July)');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('08-31-2024') === true, 'Expected 08-31-2024 to be valid', 'valid: 08-31 (August)');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('10-31-2024') === true, 'Expected 10-31-2024 to be valid', 'valid: 10-31 (October)');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('12-31-2024') === true, 'Expected 12-31-2024 to be valid', 'valid: 12-31 (December)');
            // --- Invalid month values ---
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('00-15-2024') === false, 'Expected month 00 to be invalid', 'invalid: month 00');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('13-15-2024') === false, 'Expected month 13 to be invalid', 'invalid: month 13');
            // --- Invalid day values ---
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('01-00-2024') === false, 'Expected day 00 to be invalid', 'invalid: day 00');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('01-32-2024') === false, 'Expected day 32 to be invalid', 'invalid: day 32');
            // --- Malformed strings ---
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('') === false, 'Expected empty string to be invalid', 'invalid: empty string');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('not-a-date') === false, 'Expected text to be invalid', 'invalid: text');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('2024-01-15') === false, 'Expected YYYY-MM-DD to be invalid', 'invalid: YYYY-MM-DD format');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('1-15-2024') === false, 'Expected single-digit month to be invalid', 'invalid: single-digit month');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('01/15/2024') === false, 'Expected slashes to be invalid', 'invalid: slashes');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('01-15-24') === false, 'Expected 2-digit year to be invalid', 'invalid: 2-digit year');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('01-5-2024') === false, 'Expected single-digit day to be invalid', 'invalid: single-digit day');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('01-15-20240') === false, 'Expected 5-digit year to be invalid', 'invalid: 5-digit year');
            // --- Whitespace trimming ---
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)(' 01-15-1990 ') === true, 'Expected trimmed whitespace to be valid', 'valid: whitespace trimmed');
            (0, testing_1.assert)((0, validation_1.is_valid_mm_dd_yyyy)('  02-28-2024  ') === true, 'Expected trimmed whitespace to be valid', 'valid: whitespace trimmed (2)');
            return [2 /*return*/];
        });
    });
};
exports.date_string_validation_tests = date_string_validation_tests;
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
                    return [4 /*yield*/, (0, exports.date_string_validation_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("Date string validation test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("Date string validation test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=date_string_validation.test.js.map