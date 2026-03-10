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
exports.concurrent_build_threads_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var setup_1 = require("../setup");
var host = process.env.API_URL || 'http://localhost:8080';
var concurrent_build_threads_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var timestamp, from, testEnduser, phoneNumber, enduserPhoneNumber, sms, results, allThreadsResult, allThreads, enduserThreads, cleanupThreads, _i, _b, thread;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    (0, testing_1.log_header)("Concurrent Build Threads Test");
                    timestamp = Date.now();
                    from = new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
                    ;
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            fname: "ConcurrentTest",
                            lname: "Patient",
                            email: "concurrent-test-".concat(timestamp, "@test.com"),
                            phone: "+15555550101",
                        })];
                case 1:
                    testEnduser = _d.sent();
                    phoneNumber = "+15555550102";
                    enduserPhoneNumber = "+15555550101";
                    return [4 /*yield*/, sdk.api.sms_messages.createOne({
                            enduserId: testEnduser.id,
                            phoneNumber: phoneNumber,
                            enduserPhoneNumber: enduserPhoneNumber,
                            message: 'Test message for concurrent build test',
                            inbound: true,
                            logOnly: true,
                        })];
                case 2:
                    sms = _d.sent();
                    _d.label = 3;
                case 3:
                    _d.trys.push([3, , 7, 15]);
                    // Reset threads first to ensure clean state
                    return [4 /*yield*/, sdk.api.inbox_threads.reset_threads()
                        // Fire 3 concurrent load_threads requests with autobuild: true
                    ];
                case 4:
                    // Reset threads first to ensure clean state
                    _d.sent();
                    // Fire 3 concurrent load_threads requests with autobuild: true
                    console.log("Firing 3 concurrent load_threads requests with autobuild: true...");
                    return [4 /*yield*/, Promise.all([
                            sdk.api.inbox_threads.load_threads({ autobuild: true }),
                            sdk.api.inbox_threads.load_threads({ autobuild: true }),
                            sdk.api.inbox_threads.load_threads({ autobuild: true }),
                        ])
                        // Also fetch all threads to see if duplicates were created
                    ];
                case 5:
                    results = _d.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 6:
                    allThreadsResult = _d.sent();
                    allThreads = allThreadsResult.threads;
                    enduserThreads = allThreads.filter(function (t) { var _a; return ((_a = t.enduserIds) === null || _a === void 0 ? void 0 : _a.includes(testEnduser.id)) && t.type === 'SMS'; });
                    console.log("Found ".concat(enduserThreads.length, " SMS threads for test enduser"));
                    // Assert: should only have 1 thread, not duplicates
                    (0, testing_1.assert)(enduserThreads.length === 1, "Expected 1 SMS thread for enduser, found ".concat(enduserThreads.length, ". ") +
                        "Thread IDs: ".concat(enduserThreads.map(function (t) { return t.id; }).join(', ')));
                    console.log("✅ Concurrent build test passed - no duplicate threads created");
                    return [3 /*break*/, 15];
                case 7:
                    // Cleanup
                    console.log("Cleaning up test data...");
                    return [4 /*yield*/, sdk.api.sms_messages.deleteOne(sms.id)];
                case 8:
                    _d.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(testEnduser.id)
                        // Clean up any threads created for this enduser
                    ];
                case 9:
                    _d.sent();
                    return [4 /*yield*/, sdk.api.inbox_threads.load_threads({})];
                case 10:
                    cleanupThreads = _d.sent();
                    _i = 0, _b = cleanupThreads.threads;
                    _d.label = 11;
                case 11:
                    if (!(_i < _b.length)) return [3 /*break*/, 14];
                    thread = _b[_i];
                    if (!((_c = thread.enduserIds) === null || _c === void 0 ? void 0 : _c.includes(testEnduser.id))) return [3 /*break*/, 13];
                    return [4 /*yield*/, sdk.api.inbox_threads.deleteOne(thread.id)];
                case 12:
                    _d.sent();
                    _d.label = 13;
                case 13:
                    _i++;
                    return [3 /*break*/, 11];
                case 14: return [7 /*endfinally*/];
                case 15: return [2 /*return*/];
            }
        });
    });
};
exports.concurrent_build_threads_tests = concurrent_build_threads_tests;
if (require.main === module) {
    var sdk_2 = new sdk_1.Session({ host: host });
    var sdkNonAdmin_1 = new sdk_1.Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, setup_1.setup_tests)(sdk_2, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, exports.concurrent_build_threads_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Concurrent build threads test completed");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Concurrent build threads test failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=concurrent_build_threads.test.js.map