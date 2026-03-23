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
import { async_test, handleAnyError, log_header, } from "@tellescope/testing";
import { setup_tests } from "../setup";
var host = process.env.API_URL || 'http://localhost:8080';
export var elation_user_id_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var randomElationUserId;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_header("Elation User ID Tests");
                    randomElationUserId = Math.floor(Math.random() * 1000000);
                    // Admin can set elationUserId
                    return [4 /*yield*/, async_test("admin can update elationUserId", function () { return sdk.api.users.updateOne(sdk.userInfo.id, { elationUserId: randomElationUserId }); }, { shouldError: false, onResult: function (u) { return u.elationUserId === randomElationUserId; } })
                        // Verify the value persists on read
                    ];
                case 1:
                    // Admin can set elationUserId
                    _b.sent();
                    // Verify the value persists on read
                    return [4 /*yield*/, async_test("elationUserId persists after update", function () { return sdk.api.users.getOne(sdk.userInfo.id); }, { shouldError: false, onResult: function (u) { return u.elationUserId === randomElationUserId; } })
                        // Non-admin cannot update elationUserId
                    ];
                case 2:
                    // Verify the value persists on read
                    _b.sent();
                    // Non-admin cannot update elationUserId
                    return [4 /*yield*/, async_test("non-admin cannot update elationUserId", function () { return sdkNonAdmin.api.users.updateOne(sdkNonAdmin.userInfo.id, { elationUserId: 999999 }); }, handleAnyError)];
                case 3:
                    // Non-admin cannot update elationUserId
                    _b.sent();
                    return [2 /*return*/];
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
                    return [4 /*yield*/, elation_user_id_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Elation User ID test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Elation User ID test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=elation_user_id.test.js.map