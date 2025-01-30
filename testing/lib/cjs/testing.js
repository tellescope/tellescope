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
exports.wait = exports.assert = exports.async_test = exports.asPromise = exports.log_header = void 0;
var SILENT = false; // only log errors
var LOG_PASSING = true; // logs all success messages, overridden by SILENT
var EXIT_ON_FIRST_ERROR = true;
// see for console colors:
//  https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
var PASSED = 0;
var FAILED = 1;
var TS_WIDTH = 8;
var MAX_NAME_LENGTH = 70;
var DEFAULT_BENCHMARK = 20;
var log_header = function (n) {
    if (n === void 0) { n = ''; }
    return console.log("\x1b[35m", 'Test' + (n ? " (".concat(n, ")") : '') + ' '.repeat(MAX_NAME_LENGTH - n.length - 4) + 'Runtime    Benchmark' // jank based on TS_WIDTH and MAX_NAME_LENGTH
    );
};
exports.log_header = log_header;
var log_and_return = function (_a) {
    var _b = _a.r, r = _b === void 0 ? PASSED | FAILED : _b, _c = _a.m, m = _c === void 0 ? '' : _c, _d = _a.runTime, runTime = _d === void 0 ? -1 : _d, _e = _a.benchmark, benchmark = _e === void 0 ? DEFAULT_BENCHMARK : _e;
    if (r === FAILED) {
        console.error("\x1b[31m", m); // always log errors, in red
        if (EXIT_ON_FIRST_ERROR)
            process.exit(1);
        return FAILED;
    }
    var runtimeText = ' '.repeat(TS_WIDTH);
    var benchmarkText = ' '.repeat(TS_WIDTH);
    if (runTime >= 0) { // ensure default is < 0 to avoid reporting a value unless 1 is provided
        runtimeText = "(".concat(runTime, "ms)");
        if (runtimeText.length < TS_WIDTH) {
            runtimeText = runtimeText + ' '.repeat(TS_WIDTH - runtimeText.length);
        }
    }
    if (benchmark) {
        benchmarkText = "[".concat(benchmark, "ms]");
        if (benchmarkText.length < TS_WIDTH) {
            benchmarkText = ' '.repeat(TS_WIDTH - benchmarkText.length) + benchmarkText;
        }
    }
    if (runTime > benchmark)
        console.log("\x1b[33m", m, "\x1b[31m", runtimeText, "\x1b[36m", benchmarkText);
    else if (LOG_PASSING && !SILENT)
        console.log("\x1b[32m", m, '', runtimeText, '', benchmarkText); // '' added to align with if case
    return r;
};
var asPromise = function (f) { return new Promise(function (resolve, reject) {
    try {
        resolve(f());
    }
    catch (err) {
        reject(err);
    }
}); };
exports.asPromise = asPromise;
var handle_unexpected_error = function (e) {
    console.error(e);
    return false;
};
var with_title_spacing = function (name) {
    if (name === void 0) { name = ''; }
    if (name.length < MAX_NAME_LENGTH) {
        name += ' '.repeat(MAX_NAME_LENGTH - name.length);
    }
    else {
        name = name.substring(0, MAX_NAME_LENGTH - 3) + '...';
    }
    return name;
};
var async_test = function (name, run_test, options) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, expectedResult, _b, onResult, _c, onError, _d, shouldError, _e, benchmark, startTime;
    return __generator(this, function (_f) {
        _a = options, expectedResult = _a.expectedResult, _b = _a.onResult, onResult = _b === void 0 ? function (r) { return r === expectedResult; } : _b, _c = _a.onError, onError = _c === void 0 ? handle_unexpected_error : _c, _d = _a.shouldError, shouldError = _d === void 0 ? false : _d, _e = _a.benchmark, benchmark = _e === void 0 ? 50 : _e;
        startTime = Date.now();
        name = with_title_spacing(name);
        // await wait(undefined, 25) // some delay to avoid overloading server
        return [2 /*return*/, (run_test()
                .then(function (r) { return log_and_return(shouldError
                ? { r: FAILED, m: "".concat(name, " passed with result ").concat(JSON.stringify(r), " but was expecting error ").concat(expectedResult) }
                : onResult(r)
                    ? { r: PASSED, m: "".concat(name), runTime: Date.now() - startTime, benchmark: benchmark }
                    : { r: FAILED, m: "".concat(name, " failed with the wrong result. Expected ").concat(expectedResult, " but got ").concat(JSON.stringify(r, null, 2)) }); })
                .catch(function (e) { return log_and_return(!shouldError
                ? { r: FAILED, m: "".concat(name, " failed with error ").concat(JSON.stringify(e), " while expecting ").concat(expectedResult) }
                : onError(e)
                    ? { r: PASSED, m: "".concat(name), runTime: Date.now() - startTime, benchmark: benchmark }
                    : { r: FAILED, m: "".concat(name, " failed with the wrong error. Expected ").concat(expectedResult, " but got ").concat(JSON.stringify(e, null, 2)) }); }))];
    });
}); };
exports.async_test = async_test;
var assert = function (assertion, message, title) {
    if (title === void 0) { title = ''; }
    log_and_return({
        r: assertion ? PASSED : FAILED,
        m: assertion === true ? with_title_spacing(title) : message,
        runTime: 0,
        benchmark: 1,
    });
};
exports.assert = assert;
var wait = function (f, ms) {
    if (ms === void 0) { ms = 1000; }
    return new Promise(function (resolve, reject) {
        setTimeout(function () { return f ? f.then(resolve).catch(reject) : resolve(); }, ms);
    });
};
exports.wait = wait;
//# sourceMappingURL=testing.js.map