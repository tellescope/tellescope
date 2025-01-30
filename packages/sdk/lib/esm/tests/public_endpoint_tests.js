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
import { async_test, log_header, } from "@tellescope/testing";
import { Session, /* APIQuery */ } from "../sdk";
import { PublicEndpoints } from "../public";
var host = process.env.TEST_URL || 'http://localhost:8080';
var _a = [process.env.TEST_EMAIL, process.env.TEST_PASSWORD], email = _a[0], password = _a[1];
var sdk = new Session({ host: host });
var sdkPub = PublicEndpoints({ host: host });
if (!(email && password)) {
    console.error("Set TEST_EMAIL and TEST_PASSWORD");
    process.exit();
}
var enduser_login_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var e, password, authToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, sdk.api.endusers.createOne({ email: "test@tellescope.com" })];
            case 1:
                e = _a.sent();
                password = 'testpassword';
                return [4 /*yield*/, async_test('login-enduser (no password set)', function () { return sdkPub.login_enduser({ id: e.id, password: password }); }, { shouldError: true, onError: function (_) { return true; } })];
            case 2:
                _a.sent();
                return [4 /*yield*/, async_test('setPassword', function () { return sdk.api.endusers.set_password({ id: e.id, password: password }); }, { onResult: function (_) { return true; } })];
            case 3:
                _a.sent();
                authToken = 'placeholder';
                return [4 /*yield*/, async_test('isAuthenticated (no)', function () { return sdk.api.endusers.is_authenticated({ id: e.id, authToken: authToken }); }, { onResult: function (_a) {
                            var isAuthenticated = _a.isAuthenticated, enduser = _a.enduser;
                            return isAuthenticated === false && enduser === null;
                        } })];
            case 4:
                _a.sent();
                return [4 /*yield*/, async_test('login-enduser', function () { return sdkPub.login_enduser({ id: e.id, password: password }); }, { onResult: function (r) { return !!(authToken = r.authToken); } })];
            case 5:
                _a.sent();
                return [4 /*yield*/, async_test('isAuthenticated (yes)', function () { return sdk.api.endusers.is_authenticated({ id: e.id, authToken: authToken }); }, { onResult: function (_a) {
                            var isAuthenticated = _a.isAuthenticated, enduser = _a.enduser;
                            return isAuthenticated === true && (enduser === null || enduser === void 0 ? void 0 : enduser.id) === e.id;
                        } })];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Public Endpoints");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, sdk.authenticate(email, password)];
            case 2:
                _a.sent();
                return [4 /*yield*/, sdk.reset_db()];
            case 3:
                _a.sent();
                return [4 /*yield*/, enduser_login_tests()];
            case 4:
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                console.error(err_1);
                return [3 /*break*/, 6];
            case 6:
                process.exit();
                return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=public_endpoint_tests.js.map