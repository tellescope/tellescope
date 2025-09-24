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
exports.setup_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../sdk");
var testing_1 = require("@tellescope/testing");
var host = process.env.API_URL || 'http://localhost:8080';
var _a = [process.env.TEST_EMAIL, process.env.TEST_PASSWORD], email = _a[0], password = _a[1];
var _b = [process.env.NON_ADMIN_EMAIL, process.env.NON_ADMIN_PASSWORD], nonAdminEmail = _b[0], nonAdminPassword = _b[1];
var businessId = '60398b1131a295e64f084ff6';
if (!(email && password)) {
    console.error("Set TEST_EMAIL and TEST_PASSWORD");
    process.exit();
}
if (!(nonAdminEmail && nonAdminPassword)) {
    console.error("Set NON_ADMIN_EMAIL and NON_ADMIN_PASSWORD");
    process.exit();
}
var passOnAnyResult = { shouldError: false, onResult: function () { return true; } };
var voidResult = function () { return true; };
var passOnVoid = { shouldError: false, onResult: voidResult };
// Reusable setup function that can be called independently
var setup_tests = function (sdk, sdkNonAdmin) { return __awaiter(void 0, void 0, void 0, function () {
    var badSDK, badEnduserSDK, uInfo, originalAuthToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, testing_1.log_header)("Setup");
                console.log("\uD83C\uDF10 Using API URL: ".concat(host));
                return [4 /*yield*/, (0, testing_1.async_test)('test_online', sdk.test_online, { expectedResult: 'API V1 Online' })
                    // Authenticate the SDKs first
                ];
            case 1:
                _a.sent();
                // Authenticate the SDKs first
                return [4 /*yield*/, sdk.authenticate(email, password)];
            case 2:
                // Authenticate the SDKs first
                _a.sent();
                return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('test_authenticated', sdk.test_authenticated, { expectedResult: 'Authenticated!' })];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('test_authenticated (with API Key)', (new sdk_1.Session({ host: host, apiKey: '3n5q0SCBT_iUvZz-b9BJtX7o7HQUVJ9v132PgHJNJsg.' /* local test key */ })).test_authenticated, { expectedResult: 'Authenticated!' })
                    // login rate limit tests
                ];
            case 5:
                _a.sent();
                badSDK = new sdk_1.Session({ host: host });
                return [4 /*yield*/, badSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)];
            case 6:
                _a.sent();
                return [4 /*yield*/, badSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)];
            case 7:
                _a.sent();
                return [4 /*yield*/, badSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)];
            case 8:
                _a.sent();
                return [4 /*yield*/, badSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)];
            case 9:
                _a.sent();
                return [4 /*yield*/, badSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)];
            case 10:
                _a.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('login rate limited', function () { return badSDK.authenticate('bademail@tellescope.com', 'badpassword@tellescope.com'); }, { shouldError: true, onError: function (e) { return e.message === 'Too many login attempts'; } })];
            case 11:
                _a.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('login not rate limited for other user', function () { return sdk.authenticate(email, password); }, passOnAnyResult)];
            case 12:
                _a.sent();
                badEnduserSDK = new sdk_1.EnduserSession({ host: host, businessId: businessId });
                return [4 /*yield*/, badEnduserSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)];
            case 13:
                _a.sent();
                return [4 /*yield*/, badEnduserSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)];
            case 14:
                _a.sent();
                return [4 /*yield*/, badEnduserSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)];
            case 15:
                _a.sent();
                return [4 /*yield*/, badEnduserSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)];
            case 16:
                _a.sent();
                return [4 /*yield*/, badEnduserSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)];
            case 17:
                _a.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('login rate limited', function () { return badEnduserSDK.authenticate('bademail@tellescope.com', 'badpassword@tellescope.com'); }, { shouldError: true, onError: function (e) { return e.message === 'Too many login attempts'; } })];
            case 18:
                _a.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('login not rate limited for other enduser', function () { return badEnduserSDK.authenticate('otherbademail@tellescope.com', 'badpassword@tellescope.com'); }, { shouldError: true, onError: function (e) { return e.message !== 'Too many login attempts'; } })
                    // prevent additional login throttling
                ];
            case 19:
                _a.sent();
                // prevent additional login throttling
                return [4 /*yield*/, (0, testing_1.async_test)('reset_db', function () { return sdk.reset_db(); }, passOnVoid)];
            case 20:
                // prevent additional login throttling
                _a.sent();
                return [4 /*yield*/, sdk.logout()];
            case 21:
                _a.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('test_authenticated - (logout invalidates jwt)', sdk.test_authenticated, { shouldError: true, onError: function (e) { return e === 'Unauthenticated'; } })];
            case 22:
                _a.sent();
                return [4 /*yield*/, sdk.authenticate(email, password)];
            case 23:
                _a.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('test_authenticated (re-authenticated)', sdk.test_authenticated, { expectedResult: 'Authenticated!' })];
            case 24:
                _a.sent();
                uInfo = sdk.userInfo;
                originalAuthToken = sdk.authToken;
                return [4 /*yield*/, sdk.refresh_session()];
            case 25:
                _a.sent();
                (0, testing_1.assert)(uInfo.id === sdk.userInfo.id, 'userInfo mismatch', 'userInfo id preserved after refresh');
                (0, testing_1.assert)(!!originalAuthToken && !!sdk.authToken && sdk.authToken !== originalAuthToken, 'same authToken after refresh', 'authToken refresh');
                return [4 /*yield*/, (0, testing_1.async_test)('role change by non-admin prevented (admin)', function () { return sdkNonAdmin.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: ['Admin'] }, { replaceObjectFields: true }); }, testing_1.handleAnyError)];
            case 26:
                _a.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('email change by non-admin prevented (admin)', function () { return sdkNonAdmin.api.users.updateOne(sdkNonAdmin.userInfo.id, { email: 'otheremail@tellescope.com' }, { replaceObjectFields: true }); }, testing_1.handleAnyError)];
            case 27:
                _a.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('role change by non-admin prevented (non-admin)', function () { return sdkNonAdmin.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: ['Not Admin'] }, { replaceObjectFields: true }); }, testing_1.handleAnyError)
                    // would assign default non-admin role, which could grant additional permissions than currently-defined non-admin role, should block
                ];
            case 28:
                _a.sent();
                // would assign default non-admin role, which could grant additional permissions than currently-defined non-admin role, should block
                return [4 /*yield*/, (0, testing_1.async_test)('role change by non-admin prevented (empty)', function () { return sdkNonAdmin.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [] }, { replaceObjectFields: true }); }, testing_1.handleAnyError)
                    // ensure that going to "Non-Admin" triggers a role change
                ];
            case 29:
                // would assign default non-admin role, which could grant additional permissions than currently-defined non-admin role, should block
                _a.sent();
                // ensure that going to "Non-Admin" triggers a role change
                return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: ['Test'] }, { replaceObjectFields: true })];
            case 30:
                // ensure that going to "Non-Admin" triggers a role change
                _a.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, 2000)]; // wait for role change to propagate so authenticate does fail next
            case 31:
                _a.sent(); // wait for role change to propagate so authenticate does fail next
                return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)];
            case 32:
                _a.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('non admin authenticated', sdkNonAdmin.test_authenticated, { expectedResult: 'Authenticated!' })
                    // reset nonAdmin role to a default non-admin
                ];
            case 33:
                _a.sent();
                // reset nonAdmin role to a default non-admin
                return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: ['Non-Admin'] }, { replaceObjectFields: true })];
            case 34:
                // reset nonAdmin role to a default non-admin
                _a.sent();
                // should be unauthenticated due to role change
                return [4 /*yield*/, (0, testing_1.wait)(undefined, 100)];
            case 35:
                // reset nonAdmin role to a default non-admin
                // should be unauthenticated due to role change
                _a.sent();
                return [4 /*yield*/, (0, testing_1.async_test)('role change causes deauthentication', sdkNonAdmin.test_authenticated, testing_1.handleAnyError)
                    // reauthenticate
                ];
            case 36:
                _a.sent();
                // reauthenticate
                return [4 /*yield*/, (0, testing_1.wait)(undefined, 1000)];
            case 37:
                // reauthenticate
                _a.sent();
                return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)
                    // may do some stuff in background after returning
                ];
            case 38:
                _a.sent();
                // may do some stuff in background after returning
                return [4 /*yield*/, (0, testing_1.async_test)('reset_db', function () { return sdk.reset_db(); }, passOnVoid)];
            case 39:
                // may do some stuff in background after returning
                _a.sent();
                return [4 /*yield*/, (0, testing_1.wait)(undefined, 250)];
            case 40:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.setup_tests = setup_tests;
//# sourceMappingURL=setup.js.map