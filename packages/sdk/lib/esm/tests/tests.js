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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
require('source-map-support').install();
import axios from "axios";
import crypto from "crypto";
import * as buffer from "buffer"; // only node >=15.7.0
import { fieldsToValidationOld, mongoIdStringRequired, } from "@tellescope/validation";
import { Session, EnduserSession } from "../sdk";
import { FORM_LOGIC_CALCULATED_FIELDS, get_flattened_fields, responses_satisfy_conditions, weighted_round_robin, YYYY_MM_DD_to_MM_DD_YYYY } from "@tellescope/utilities";
import { DEFAULT_OPERATIONS, PLACEHOLDER_ID, ZOOM_TITLE } from "@tellescope/constants";
import { schema, } from "@tellescope/schema";
import { assert, async_test, log_header, wait, } from "@tellescope/testing";
import { objects_equivalent, url_safe_path, } from "@tellescope/utilities";
import fs from "fs";
var UniquenessViolationMessage = 'Uniqueness Violation';
var host = process.env.TEST_URL || 'http://localhost:8080';
var _a = [process.env.TEST_EMAIL, process.env.TEST_PASSWORD], email = _a[0], password = _a[1];
var _b = [process.env.MFA_EMAIL, process.env.TEST_PASSWORD], mfaEmail = _b[0], mfaPassword = _b[1];
// email2 should not be a @tellescope.com domain in order to validate access for agent_records
var _c = [process.env.TEST_EMAIL_2, process.env.TEST_PASSWORD_2], email2 = _c[0], password2 = _c[1];
var _d = [process.env.NON_ADMIN_EMAIL, process.env.NON_ADMIN_PASSWORD], nonAdminEmail = _d[0], nonAdminPassword = _d[1];
var subUserEmail = process.env.SUB_EMAIL;
var otherSubUserEmail = process.env.OTHER_SUB_EMAIL;
var subSubUserEmail = process.env.SUB_SUB_EMAIL;
var userId = '60398b0231a295e64f084fd9';
var businessId = '60398b1131a295e64f084ff6';
// const example_SDK_usage = async () => {
//   // initialize SDK and authenticate a user
//   const sdk = new Session()
//   await sdk.authenticate("user-email", 'user-password')
//   // create a record, using Enduser model as example
//   const enduser = await sdk.api.endusers.createOne({ email: "enduser1@tellescope.com" })
//   // update an existing record
//   await sdk.api.endusers.updateOne(enduser.id, { phone: "+15555555555" })
//   // fetch a record by id, or a list of recent records
//   const existingEnduser: Enduser = await sdk.api.endusers.getOne(enduser.id)  
//   const existingEndusers: Enduser[] = await sdk.api.endusers.getSome({ limit: 5, lastId: enduser.id })  
//   // delete an individual record
//   await sdk.api.endusers.deleteOne(enduser.id)
// }
// const migrate_enduser_names = async () => {
//   const sdk = new Session({ apiKey: 'API_KEY_HERE'})
//   const endusers = await sdk.api.endusers.getSome({ limit: 1000 }) // 1000 is max
//   for (const e of endusers) {
//     await sdk.api.endusers.updateOne(e.id, { 
//       unredactedFields: {
//         fname: e.fname || '',
//         lname: e.lname || '',
//       }
//     })
//   }
// }
var sdk = new Session({ host: host });
var sdkSub = new Session({ host: host });
var sdkOtherSub = new Session({ host: host });
var sdkSubSub = new Session({ host: host });
var sdkOther = new Session({ host: host, apiKey: "ba745e25162bb95a795c5fa1af70df188d93c4d3aac9c48b34a5c8c9dd7b80f7" });
var sdkMfa = new Session({ host: host });
var sdkMfaApiKey = new Session({ host: host, apiKey: "9d4f9dff00f60df2690a16da2cb848f289b447614ad9bef850e54af09a1fbf7a" });
var sdkNonAdmin = new Session({ host: host });
var enduserSDK = new EnduserSession({ host: host, businessId: businessId });
var subEnduserSDK = new EnduserSession({ host: host, businessId: businessId, "organizationIds": ["636d3c230067fc6b4c92c59c"] });
var enduserSDKDifferentBusinessId = new EnduserSession({ host: host, businessId: '80398b1131a295e64f084ff6' });
// const sdkOtherEmail = "sebass@tellescope.com"
if (!(email && mfaEmail && mfaPassword && subUserEmail && otherSubUserEmail && subSubUserEmail && password && email2 && password2 && nonAdminEmail && nonAdminPassword)) {
    console.error("Set TEST_EMAIL and TEST_PASSWORD");
    process.exit();
}
var recordNotFound = { shouldError: true, onError: function (e) { return e.message === 'Could not find a record for the given id'; } };
var voidResult = function () { return true; };
var passOnVoid = { shouldError: false, onResult: voidResult };
// const isNull = (d: any) => d === null
var setup_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var badSDK, badEnduserSDK, uInfo, originalAuthToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Setup");
                return [4 /*yield*/, async_test('test_online', sdk.test_online, { expectedResult: 'API V1 Online' })];
            case 1:
                _a.sent();
                return [4 /*yield*/, async_test('test_authenticated', sdk.test_authenticated, { expectedResult: 'Authenticated!' })];
            case 2:
                _a.sent();
                return [4 /*yield*/, async_test('test_authenticated (with API Key)', (new Session({ host: host, apiKey: '3n5q0SCBT_iUvZz-b9BJtX7o7HQUVJ9v132PgHJNJsg.' /* local test key */ })).test_authenticated, { expectedResult: 'Authenticated!' })
                    // login rate limit tests
                ];
            case 3:
                _a.sent();
                badSDK = new Session({ host: host });
                return [4 /*yield*/, badSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)];
            case 4:
                _a.sent();
                return [4 /*yield*/, badSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)];
            case 5:
                _a.sent();
                return [4 /*yield*/, badSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)];
            case 6:
                _a.sent();
                return [4 /*yield*/, badSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)];
            case 7:
                _a.sent();
                return [4 /*yield*/, badSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)];
            case 8:
                _a.sent();
                return [4 /*yield*/, async_test('login rate limited', function () { return badSDK.authenticate('bademail@tellescope.com', 'badpassword@tellescope.com'); }, { shouldError: true, onError: function (e) { return e.message === 'Too many login attempts'; } })];
            case 9:
                _a.sent();
                return [4 /*yield*/, async_test('login not rate limited for other user', function () { return sdk.authenticate(email, password); }, passOnAnyResult)];
            case 10:
                _a.sent();
                badEnduserSDK = new EnduserSession({ host: host, businessId: businessId });
                return [4 /*yield*/, badEnduserSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)];
            case 11:
                _a.sent();
                return [4 /*yield*/, badEnduserSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)];
            case 12:
                _a.sent();
                return [4 /*yield*/, badEnduserSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)];
            case 13:
                _a.sent();
                return [4 /*yield*/, badEnduserSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)];
            case 14:
                _a.sent();
                return [4 /*yield*/, badEnduserSDK.authenticate('bademail@tellescope.com', 'badpassword').catch(console.error)];
            case 15:
                _a.sent();
                return [4 /*yield*/, async_test('login rate limited', function () { return badEnduserSDK.authenticate('bademail@tellescope.com', 'badpassword@tellescope.com'); }, { shouldError: true, onError: function (e) { return e.message === 'Too many login attempts'; } })];
            case 16:
                _a.sent();
                return [4 /*yield*/, async_test('login not rate limited for other enduser', function () { return badEnduserSDK.authenticate('otherbademail@tellescope.com', 'badpassword@tellescope.com'); }, { shouldError: true, onError: function (e) { return e.message !== 'Too many login attempts'; } })
                    // prevent additional login throttling
                ];
            case 17:
                _a.sent();
                // prevent additional login throttling
                return [4 /*yield*/, async_test('reset_db', function () { return sdk.reset_db(); }, passOnVoid)];
            case 18:
                // prevent additional login throttling
                _a.sent();
                return [4 /*yield*/, sdk.logout()];
            case 19:
                _a.sent();
                return [4 /*yield*/, async_test('test_authenticated - (logout invalidates jwt)', sdk.test_authenticated, { shouldError: true, onError: function (e) { return e === 'Unauthenticated'; } })];
            case 20:
                _a.sent();
                return [4 /*yield*/, sdk.authenticate(email, password)];
            case 21:
                _a.sent();
                return [4 /*yield*/, async_test('test_authenticated (re-authenticated)', sdk.test_authenticated, { expectedResult: 'Authenticated!' })];
            case 22:
                _a.sent();
                uInfo = sdk.userInfo;
                originalAuthToken = sdk.authToken;
                return [4 /*yield*/, sdk.refresh_session()];
            case 23:
                _a.sent();
                assert(uInfo.id === sdk.userInfo.id, 'userInfo mismatch', 'userInfo id preserved after refresh');
                assert(!!originalAuthToken && !!sdk.authToken && sdk.authToken !== originalAuthToken, 'same authToken after refresh', 'authToken refresh');
                return [4 /*yield*/, async_test('role change by non-admin prevented (admin)', function () { return sdkNonAdmin.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: ['Admin'] }, { replaceObjectFields: true }); }, handleAnyError)];
            case 24:
                _a.sent();
                return [4 /*yield*/, async_test('email change by non-admin prevented (admin)', function () { return sdkNonAdmin.api.users.updateOne(sdkNonAdmin.userInfo.id, { email: 'otheremail@tellescope.com' }, { replaceObjectFields: true }); }, handleAnyError)];
            case 25:
                _a.sent();
                return [4 /*yield*/, async_test('role change by non-admin prevented (non-admin)', function () { return sdkNonAdmin.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: ['Not Admin'] }, { replaceObjectFields: true }); }, handleAnyError)
                    // would assign default non-admin role, which could grant additional permissions than currently-defined non-admin role, should block
                ];
            case 26:
                _a.sent();
                // would assign default non-admin role, which could grant additional permissions than currently-defined non-admin role, should block
                return [4 /*yield*/, async_test('role change by non-admin prevented (empty)', function () { return sdkNonAdmin.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: [] }, { replaceObjectFields: true }); }, handleAnyError)
                    // ensure that going to "Non-Admin" triggers a role change
                ];
            case 27:
                // would assign default non-admin role, which could grant additional permissions than currently-defined non-admin role, should block
                _a.sent();
                // ensure that going to "Non-Admin" triggers a role change
                return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: ['Test'] }, { replaceObjectFields: true })];
            case 28:
                // ensure that going to "Non-Admin" triggers a role change
                _a.sent();
                return [4 /*yield*/, wait(undefined, 1000)]; // wait for role change to propagate so authenticate does fail next
            case 29:
                _a.sent(); // wait for role change to propagate so authenticate does fail next
                return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)];
            case 30:
                _a.sent();
                return [4 /*yield*/, async_test('non admin authenticated', sdkNonAdmin.test_authenticated, { expectedResult: 'Authenticated!' })
                    // reset nonAdmin role to a default non-admin
                ];
            case 31:
                _a.sent();
                // reset nonAdmin role to a default non-admin
                return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { roles: ['Non-Admin'] }, { replaceObjectFields: true })];
            case 32:
                // reset nonAdmin role to a default non-admin
                _a.sent();
                // should be unauthenticated due to role change
                return [4 /*yield*/, wait(undefined, 100)];
            case 33:
                // reset nonAdmin role to a default non-admin
                // should be unauthenticated due to role change
                _a.sent();
                return [4 /*yield*/, async_test('role change causes deauthentication', sdkNonAdmin.test_authenticated, handleAnyError)
                    // reauthenticate
                ];
            case 34:
                _a.sent();
                // reauthenticate
                return [4 /*yield*/, wait(undefined, 1000)];
            case 35:
                // reauthenticate
                _a.sent();
                return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)
                    // may do some stuff in background after returning
                ];
            case 36:
                _a.sent();
                // may do some stuff in background after returning
                return [4 /*yield*/, async_test('reset_db', function () { return sdk.reset_db(); }, passOnVoid)];
            case 37:
                // may do some stuff in background after returning
                _a.sent();
                return [4 /*yield*/, wait(undefined, 250)];
            case 38:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var multi_tenant_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var e1, e2, update;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Multi Tenant");
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: "hi@tellescope.com" })];
            case 1:
                e1 = _a.sent();
                return [4 /*yield*/, sdkOther.api.endusers.createOne({ email: "hi@tellescope.com" })];
            case 2:
                e2 = _a.sent();
                if (!e1)
                    process.exit();
                if (!e2)
                    process.exit();
                /* Test global uniqueness, create must be enabled for users model */
                // await sdk.api.users.createOne({ email }).catch(console.error)
                // await sdk.api.users.createSome([{ email }, { email }]).catch(console.error)
                // await sdkOther.users.createOne({ email }).catch(console.error)
                // await sdkOther.users.createSome([{ email }, { email }]).catch(console.error)
                // await sdk.api.users.updateOne(userId, { email: sdkOtherEmail }).catch(console.error)
                return [4 /*yield*/, async_test("o1 get o2", function () { return sdk.api.endusers.getOne(e2.id); }, recordNotFound)];
            case 3:
                /* Test global uniqueness, create must be enabled for users model */
                // await sdk.api.users.createOne({ email }).catch(console.error)
                // await sdk.api.users.createSome([{ email }, { email }]).catch(console.error)
                // await sdkOther.users.createOne({ email }).catch(console.error)
                // await sdkOther.users.createSome([{ email }, { email }]).catch(console.error)
                // await sdk.api.users.updateOne(userId, { email: sdkOtherEmail }).catch(console.error)
                _a.sent();
                return [4 /*yield*/, async_test("o2 get o1", function () { return sdkOther.api.endusers.getOne(e1.id); }, recordNotFound)];
            case 4:
                _a.sent();
                return [4 /*yield*/, async_test("o1 get many", function () { return sdk.api.endusers.getSome(); }, { onResult: function (es) { return es.length === 1; } })];
            case 5:
                _a.sent();
                return [4 /*yield*/, async_test("o2 get many", function () { return sdkOther.api.endusers.getSome(); }, { onResult: function (es) { return es.length === 1; } })];
            case 6:
                _a.sent();
                update = { fname: "billy" };
                return [4 /*yield*/, async_test("o1 update o2", function () { return sdk.api.endusers.updateOne(e2.id, update); }, recordNotFound)];
            case 7:
                _a.sent();
                return [4 /*yield*/, async_test("o2 update o1", function () { return sdkOther.api.endusers.updateOne(e1.id, update); }, recordNotFound)];
            case 8:
                _a.sent();
                return [4 /*yield*/, async_test("o1 delete o2", function () { return sdk.api.endusers.deleteOne(e2.id); }, recordNotFound)];
            case 9:
                _a.sent();
                return [4 /*yield*/, async_test("o2 delete o1", function () { return sdkOther.api.endusers.deleteOne(e1.id); }, recordNotFound)];
            case 10:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.deleteOne(e1.id)];
            case 11:
                _a.sent();
                return [4 /*yield*/, sdkOther.api.endusers.deleteOne(e2.id)];
            case 12:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var sub_organization_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var rootEnduser, subEnduser, subSubEnduser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Sub Organizations");
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'root@tellescope.com' })];
            case 1:
                rootEnduser = _a.sent();
                return [4 /*yield*/, sdkSub.api.endusers.createOne({ email: 'sub@tellescope.com' })];
            case 2:
                subEnduser = _a.sent();
                return [4 /*yield*/, sdkSubSub.api.endusers.createOne({ email: 'subsub@tellescope.com' })];
            case 3:
                subSubEnduser = _a.sent();
                return [4 /*yield*/, async_test("root get root", function () { return sdk.api.endusers.getOne(rootEnduser.id); }, passOnAnyResult)];
            case 4:
                _a.sent();
                return [4 /*yield*/, async_test("sub get root error", function () { return sdkSub.api.endusers.getOne(rootEnduser.id); }, handleAnyError)];
            case 5:
                _a.sent();
                return [4 /*yield*/, async_test("other sub get root error", function () { return sdkOtherSub.api.endusers.getOne(rootEnduser.id); }, handleAnyError)];
            case 6:
                _a.sent();
                return [4 /*yield*/, async_test("subsub get root error", function () { return sdkSubSub.api.endusers.getOne(rootEnduser.id); }, handleAnyError)];
            case 7:
                _a.sent();
                return [4 /*yield*/, async_test("root get sub", function () { return sdk.api.endusers.getOne(subEnduser.id); }, passOnAnyResult)];
            case 8:
                _a.sent();
                return [4 /*yield*/, async_test("sub get sub", function () { return sdkSub.api.endusers.getOne(subEnduser.id); }, passOnAnyResult)];
            case 9:
                _a.sent();
                return [4 /*yield*/, async_test("other sub get sub error", function () { return sdkOtherSub.api.endusers.getOne(subEnduser.id); }, handleAnyError)];
            case 10:
                _a.sent();
                return [4 /*yield*/, async_test("subsub get sub error", function () { return sdkSubSub.api.endusers.getOne(subEnduser.id); }, handleAnyError)];
            case 11:
                _a.sent();
                return [4 /*yield*/, async_test("root get subsub", function () { return sdk.api.endusers.getOne(subSubEnduser.id); }, passOnAnyResult)];
            case 12:
                _a.sent();
                return [4 /*yield*/, async_test("sub get subsub", function () { return sdkSub.api.endusers.getOne(subSubEnduser.id); }, passOnAnyResult)];
            case 13:
                _a.sent();
                return [4 /*yield*/, async_test("other sub get sub sub error", function () { return sdkOtherSub.api.endusers.getOne(subSubEnduser.id); }, handleAnyError)];
            case 14:
                _a.sent();
                return [4 /*yield*/, async_test("subsub get subsub", function () { return sdkSubSub.api.endusers.getOne(subSubEnduser.id); }, passOnAnyResult)];
            case 15:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.set_password({ id: rootEnduser.id, password: password })];
            case 16:
                _a.sent();
                return [4 /*yield*/, enduserSDK.authenticate(rootEnduser.email, password)];
            case 17:
                _a.sent();
                return [4 /*yield*/, async_test("root enduser create", function () { return enduserSDK.api.engagement_events.createOne({ significance: 1, type: 'test', enduserId: rootEnduser.id }); }, { onResult: function (t) { var _a; return t.businessId === rootEnduser.businessId && !((_a = t.organizationIds) === null || _a === void 0 ? void 0 : _a.length); } })];
            case 18:
                _a.sent();
                return [4 /*yield*/, async_test("enduser cannot update organizationIds", function () { return enduserSDK.api.endusers.updateOne(enduserSDK.userInfo.id, { organizationIds: [] }); }, handleAnyError)];
            case 19:
                _a.sent();
                return [4 /*yield*/, async_test("users cannot update organizationIds", function () { return sdk.api.users.updateOne(sdk.userInfo.id, { organizationIds: [] }); }, handleAnyError)];
            case 20:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.set_password({ id: subEnduser.id, password: password })];
            case 21:
                _a.sent();
                return [4 /*yield*/, enduserSDK.authenticate(subEnduser.email, password)];
            case 22:
                _a.sent();
                return [4 /*yield*/, async_test("sub enduser create", function () { return enduserSDK.api.engagement_events.createOne({ significance: 1, type: 'test', enduserId: subEnduser.id }); }, { onResult: function (t) { var _a; return t.businessId === rootEnduser.businessId && ((_a = t.organizationIds) === null || _a === void 0 ? void 0 : _a.length) === 1; } })];
            case 23:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.set_password({ id: subSubEnduser.id, password: password })];
            case 24:
                _a.sent();
                return [4 /*yield*/, enduserSDK.authenticate(subSubEnduser.email, password)];
            case 25:
                _a.sent();
                return [4 /*yield*/, async_test("subSub enduser create", function () { return enduserSDK.api.engagement_events.createOne({ significance: 1, type: 'test', enduserId: subSubEnduser.id }); }, { onResult: function (t) { var _a; return t.businessId === rootEnduser.businessId && ((_a = t.organizationIds) === null || _a === void 0 ? void 0 : _a.length) === 2; } })];
            case 26:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.updateOne(rootEnduser.id, { organizationIds: subEnduser.organizationIds })];
            case 27:
                _a.sent();
                return [4 /*yield*/, async_test("root get sub adjusted", function () { return sdk.api.endusers.getOne(rootEnduser.id); }, passOnAnyResult)];
            case 28:
                _a.sent();
                return [4 /*yield*/, async_test("sub get sub adjusted", function () { return sdkSub.api.endusers.getOne(rootEnduser.id); }, passOnAnyResult)];
            case 29:
                _a.sent();
                return [4 /*yield*/, async_test("other sub get sub adjusted error", function () { return sdkOtherSub.api.endusers.getOne(rootEnduser.id); }, handleAnyError)];
            case 30:
                _a.sent();
                return [4 /*yield*/, async_test("subsub get sub adjusted error", function () { return sdkSubSub.api.endusers.getOne(rootEnduser.id); }, handleAnyError)];
            case 31:
                _a.sent();
                return [4 /*yield*/, async_test("push behavior for organization ids (don't push by default)", function () { return sdk.api.endusers.updateOne(rootEnduser.id, { organizationIds: subEnduser.organizationIds }); }, { onResult: function (e) { var _a, _b; return ((_a = e.organizationIds) === null || _a === void 0 ? void 0 : _a.length) === ((_b = subEnduser.organizationIds) === null || _b === void 0 ? void 0 : _b.length); } })];
            case 32:
                _a.sent();
                return [4 /*yield*/, async_test("push behavior for organization ids (replace working)", function () { return sdk.api.endusers.updateOne(rootEnduser.id, { organizationIds: subEnduser.organizationIds }, { replaceObjectFields: true }); }, { onResult: function (e) { var _a, _b; return ((_a = e.organizationIds) === null || _a === void 0 ? void 0 : _a.length) === ((_b = subEnduser.organizationIds) === null || _b === void 0 ? void 0 : _b.length); } })];
            case 33:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(rootEnduser.id),
                        sdk.api.endusers.deleteOne(subEnduser.id),
                        sdk.api.endusers.deleteOne(subSubEnduser.id),
                    ])];
            case 34:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var sub_organization_enduser_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var rootTicket, rootTicketAfterUpdate;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                log_header("Sub Organizations (Enduser-Facing Tests)");
                return [4 /*yield*/, enduserSDK.register({ email: 'root@tellescope.com', password: password })];
            case 1:
                _d.sent();
                return [4 /*yield*/, wait(undefined, 1000)]; // avoid rate limiting error
            case 2:
                _d.sent(); // avoid rate limiting error
                return [4 /*yield*/, subEnduserSDK.register({ email: 'sub@tellescope.com', password: password })];
            case 3:
                _d.sent();
                return [4 /*yield*/, wait(undefined, 1000)]; // avoid rate limiting error
            case 4:
                _d.sent(); // avoid rate limiting error
                return [4 /*yield*/, enduserSDK.authenticate('root@tellescope.com', password)];
            case 5:
                _d.sent();
                return [4 /*yield*/, wait(undefined, 1000)]; // avoid rate limiting error
            case 6:
                _d.sent(); // avoid rate limiting error
                return [4 /*yield*/, subEnduserSDK.authenticate('sub@tellescope.com', password)];
            case 7:
                _d.sent();
                assert(!((_a = enduserSDK.userInfo.organizationIds) === null || _a === void 0 ? void 0 : _a.length), 'bad root organizationIds', 'root auth org ids');
                assert(((_b = subEnduserSDK.userInfo.organizationIds) === null || _b === void 0 ? void 0 : _b.length) === 1, 'bad sub organizationIds', 'sub auth org ids');
                return [4 /*yield*/, enduserSDK.api.tickets.createOne({ title: 'root', enduserId: enduserSDK.userInfo.id })];
            case 8:
                rootTicket = _d.sent();
                return [4 /*yield*/, async_test("root get root", function () { return sdk.api.endusers.getOne(enduserSDK.userInfo.id); }, passOnAnyResult)];
            case 9:
                _d.sent();
                return [4 /*yield*/, async_test("sub get root error", function () { return sdkSub.api.endusers.getOne(enduserSDK.userInfo.id); }, handleAnyError)];
            case 10:
                _d.sent();
                return [4 /*yield*/, async_test("root get sub", function () { return sdk.api.endusers.getOne(subEnduserSDK.userInfo.id); }, passOnAnyResult)];
            case 11:
                _d.sent();
                return [4 /*yield*/, async_test("sub get sub", function () { return sdkSub.api.endusers.getOne(subEnduserSDK.userInfo.id); }, passOnAnyResult)];
            case 12:
                _d.sent();
                return [4 /*yield*/, async_test("root get root ticket", function () { return sdk.api.tickets.getOne(rootTicket.id); }, passOnAnyResult)];
            case 13:
                _d.sent();
                return [4 /*yield*/, async_test("sub get root ticket error", function () { return sdkSub.api.tickets.getOne(rootTicket.id); }, handleAnyError)];
            case 14:
                _d.sent();
                return [4 /*yield*/, sdk.api.endusers.updateOne(enduserSDK.userInfo.id, { sharedWithOrganizations: [(_c = sdkSub.userInfo.organizationIds) !== null && _c !== void 0 ? _c : []] })];
            case 15:
                _d.sent();
                return [4 /*yield*/, enduserSDK.refresh_session()]; // ensure updated session includes new sharedWithOrganizations
            case 16:
                _d.sent(); // ensure updated session includes new sharedWithOrganizations
                return [4 /*yield*/, enduserSDK.api.tickets.createOne({ title: 'root with shared', enduserId: enduserSDK.userInfo.id })];
            case 17:
                rootTicketAfterUpdate = _d.sent();
                return [4 /*yield*/, async_test("root get root", function () { return sdk.api.endusers.getOne(enduserSDK.userInfo.id); }, passOnAnyResult)];
            case 18:
                _d.sent();
                return [4 /*yield*/, async_test("sub get root after update", function () { return sdkSub.api.endusers.getOne(enduserSDK.userInfo.id); }, passOnAnyResult)];
            case 19:
                _d.sent();
                return [4 /*yield*/, async_test("root get sub", function () { return sdk.api.endusers.getOne(subEnduserSDK.userInfo.id); }, passOnAnyResult)];
            case 20:
                _d.sent();
                return [4 /*yield*/, async_test("sub get sub", function () { return sdkSub.api.endusers.getOne(subEnduserSDK.userInfo.id); }, passOnAnyResult)];
            case 21:
                _d.sent();
                return [4 /*yield*/, async_test("root get root ticket after update", function () { return sdk.api.tickets.getOne(rootTicketAfterUpdate.id); }, passOnAnyResult)];
            case 22:
                _d.sent();
                return [4 /*yield*/, async_test("sub get root ticket after update", function () { return sdkSub.api.tickets.getOne(rootTicketAfterUpdate.id); }, passOnAnyResult)];
            case 23:
                _d.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(enduserSDK.userInfo.id),
                        sdk.api.endusers.deleteOne(subEnduserSDK.userInfo.id),
                        sdk.api.tickets.deleteOne(rootTicket.id),
                        sdk.api.tickets.deleteOne(rootTicketAfterUpdate.id),
                    ])];
            case 24:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); };
var threadKeyTests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var enduser, _a, e1, e2, e3, _b, e4, e5, e6, es;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                log_header("threadKey");
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'threadkeytests@tellescope.com' })];
            case 1:
                enduser = _c.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.engagement_events.createOne({ enduserId: enduser.id, type: 'Type 1', significance: 5 }),
                        sdk.api.engagement_events.createOne({ enduserId: enduser.id, type: 'Type 2', significance: 5 }),
                        sdk.api.engagement_events.createOne({ enduserId: enduser.id, type: 'Type 3', significance: 5 }),
                    ])];
            case 2:
                _a = _c.sent(), e1 = _a[0], e2 = _a[1], e3 = _a[2];
                return [4 /*yield*/, wait(undefined, 1000)]; // sort struggles when all 6 documents created in the same second
            case 3:
                _c.sent(); // sort struggles when all 6 documents created in the same second
                return [4 /*yield*/, Promise.all([
                        sdk.api.engagement_events.createOne({ enduserId: enduser.id, type: 'Type 1', significance: 5 }),
                        sdk.api.engagement_events.createOne({ enduserId: enduser.id, type: 'Type 2', significance: 5 }),
                        sdk.api.engagement_events.createOne({ enduserId: enduser.id, type: 'Type 3', significance: 5 }),
                    ])];
            case 4:
                _b = _c.sent(), e4 = _b[0], e5 = _b[1], e6 = _b[2];
                return [4 /*yield*/, sdk.api.engagement_events.getSome({ threadKey: 'type', sort: 'oldFirst' })];
            case 5:
                es = _c.sent();
                assert(es.length === 3, 'threadKey got duplicates', 'threadKey no duplicates (length, old)');
                assert(new Set(es.map(function (e) { return e.type; })).size === 3, 'threadKey got duplicates', 'threadKey no duplicates explicit');
                assert(es.find(function (e) { return e.id === e1.id; }) !== undefined, 'threadKey got duplicates', 'threadKey no duplicates (key 1, old)');
                assert(es.find(function (e) { return e.id === e2.id; }) !== undefined, 'threadKey got duplicates', 'threadKey no duplicates (key 2, old)');
                assert(es.find(function (e) { return e.id === e3.id; }) !== undefined, 'threadKey got duplicates', 'threadKey no duplicates (key 3, old)');
                return [4 /*yield*/, sdk.api.engagement_events.getSome({ threadKey: 'type', sort: 'newFirst' })];
            case 6:
                es = _c.sent();
                assert(es.length === 3, 'threadKey got duplicates', 'threadKey no duplicates (length, new)');
                assert(new Set(es.map(function (e) { return e.type; })).size === 3, 'threadKey got duplicates', 'threadKey no duplicates explicit');
                assert(es.find(function (e) { return e.id === e4.id; }) !== undefined, 'threadKey got duplicates', 'threadKey no duplicates (key 1, new)');
                assert(es.find(function (e) { return e.id === e5.id; }) !== undefined, 'threadKey got duplicates', 'threadKey no duplicates (key 2, new)');
                assert(es.find(function (e) { return e.id === e6.id; }) !== undefined, 'threadKey got duplicates', 'threadKey no duplicates (key 3, new)');
                // cleanup
                return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id)]; // cleans up automatin events too
            case 7:
                // cleanup
                _c.sent(); // cleans up automatin events too
                return [2 /*return*/];
        }
    });
}); };
var badInputTests = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Bad Input");
                return [4 /*yield*/, async_test("_-prefixed fields are not allowed", function () { return sdk.api.endusers.createOne({ email: 'failure@tellescope.com', fields: { "_notallowed": 'hello' } }); }, { shouldError: true, onError: function (e) { return e.message === "Error parsing field fields: Fields that start with '_' are not allowed"; } })];
            case 1:
                _a.sent();
                return [4 /*yield*/, async_test("_-prefixed fields are not allowed", function () { return sdk.api.notes.createOne({ enduserId: PLACEHOLDER_ID, fields: { "_notallowed": 'hello' } }); }, { shouldError: true, onError: function (e) { return e.message === "Error parsing field fields: Fields that start with '_' are not allowed"; } })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var filterTests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var enduser, otherEnduser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Filter Tests");
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'filtertests@tellescope.com', fname: 'test', fields: { field1: 'value1', field2: 'value2' } })];
            case 1:
                enduser = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'other@tellescope.com' })];
            case 2:
                otherEnduser = _a.sent();
                return [4 /*yield*/, async_test("find enduser by filter", function () { return sdk.api.endusers.getSome({ filter: { email: 'filtertests@tellescope.com' } }); }, { onResult: function (es) { return es.length === 1 && es[0].id === enduser.id; } })];
            case 3:
                _a.sent();
                return [4 /*yield*/, async_test("find enduser by _exists filter", function () { return sdk.api.endusers.getSome({ filter: { fname: { _exists: true } } }); }, { onResult: function (es) { return es.length === 1 && es[0].id === enduser.id; } })];
            case 4:
                _a.sent();
                return [4 /*yield*/, async_test("find enduser by _exists filter (findOne)", 
                    // () => sdk.api.endusers.getOne({ fname: { _exists: true } }), 
                    function () { return sdk.api.endusers.getOne({ fname: { _exists: true } }); }, { onResult: function (e) { return e.id === enduser.id; } })];
            case 5:
                _a.sent();
                return [4 /*yield*/, async_test("find enduser by compound filter", function () { return sdk.api.endusers.getSome({ filter: { email: 'filtertests@tellescope.com', fname: 'test' } }); }, { onResult: function (es) { return es.length === 1 && es[0].id === enduser.id; } })];
            case 6:
                _a.sent();
                return [4 /*yield*/, async_test("nothing found by invalid compound filter", function () { return sdk.api.endusers.getSome({ filter: { email: 'filtertests@tellescope.com', fname: 'nottest' } }); }, { onResult: function (es) { return es.length === 0; } })];
            case 7:
                _a.sent();
                return [4 /*yield*/, async_test("nothing found for invalid filter", function () { return sdk.api.endusers.getSome({ filter: { email: 'doesnotexist@tellescope.com' } }); }, { onResult: function (es) { return es.length === 0; } })];
            case 8:
                _a.sent();
                return [4 /*yield*/, async_test("find enduser by nested filter", function () { return sdk.api.endusers.getSome({ filter: { fields: { field1: 'value1' } } }); }, { onResult: function (es) { return es.length === 1 && es[0].id === enduser.id; } })];
            case 9:
                _a.sent();
                return [4 /*yield*/, async_test("nothing found by invalid nested filter", function () { return sdk.api.endusers.getSome({ filter: { fields: { field1: 'not a nested field value' } } }); }, { onResult: function (es) { return es.length === 0; } })];
            case 10:
                _a.sent();
                return [4 /*yield*/, async_test("find enduser by compound nested filter", function () { return sdk.api.endusers.getSome({ filter: { fields: { field1: 'value1', field2: 'value2' } } }); }, { onResult: function (es) { return es.length === 1 && es[0].id === enduser.id; } })];
            case 11:
                _a.sent();
                return [4 /*yield*/, async_test("nothing found by compound invalid nested filter", function () { return sdk.api.endusers.getSome({ filter: { fields: { field1: 'not a nested field value', field2: 'value2' } } }); }, { onResult: function (es) { return es.length === 0; } })];
            case 12:
                _a.sent();
                return [4 /*yield*/, async_test("find enduser by compound nested filter with non-nested field as well", function () { return sdk.api.endusers.getSome({ filter: { email: 'filtertests@tellescope.com', fields: { field1: 'value1', field2: 'value2' } } }); }, { onResult: function (es) { return es.length === 1 && es[0].id === enduser.id; } })];
            case 13:
                _a.sent();
                return [4 /*yield*/, async_test("nothing found for compound nested filter with non-nested field as well", function () { return sdk.api.endusers.getSome({ filter: { email: 'doesnotexist@tellescope.com', fields: { field1: 'value1', field2: 'value2' } } }); }, { onResult: function (es) { return es.length === 0; } })];
            case 14:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id)];
            case 15:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.deleteOne(otherEnduser.id)];
            case 16:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var updatesTests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var enduser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Updates Tests");
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'test@tellescope.com', phone: '+15555555555' })];
            case 1:
                enduser = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.updateOne(enduser.id, { phone: '+15555555552' })]; // update to new phone number 
            case 2:
                _a.sent(); // update to new phone number 
                return [4 /*yield*/, sdk.api.endusers.updateOne(enduser.id, { phone: '+15555555552' })]; // update to same phone number
            case 3:
                _a.sent(); // update to same phone number
                assert(!!enduser, '', 'Updated phone number');
                return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id)];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var generate_user_auth_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var info, externalId, e, _a, authToken, enduser, isAuthenticated, _b, withDurationResult, _c, authTokenUID, enduser2, _d;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                log_header("Generated User/Enduser authToken");
                return [4 /*yield*/, sdk.api.users.generate_auth_token({ id: sdk.userInfo.id })];
            case 1:
                info = _f.sent();
                sdk.authToken = info.authToken;
                sdk.userInfo = info.user;
                externalId = '1029f9v9sjd0as';
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'generated@tellescope.com', phone: '+15555555555', externalId: externalId })];
            case 2:
                e = _f.sent();
                return [4 /*yield*/, sdk.api.users.generate_auth_token({ id: e.id })];
            case 3:
                _a = _f.sent(), authToken = _a.authToken, enduser = _a.enduser;
                if (!enduser)
                    throw new Error("Didn't get enduser when generate_auth_token called");
                assert(!!authToken && !!enduser, 'invalid returned values', 'Generate authTokea and get enduser');
                return [4 /*yield*/, sdk.api.endusers.is_authenticated({ id: enduser.id, authToken: authToken })];
            case 4:
                isAuthenticated = (_f.sent()).isAuthenticated;
                assert(isAuthenticated, 'invalid authToken generated for enduser', 'Generate authToken for enduser is valid');
                _b = assert;
                return [4 /*yield*/, sdk.api.endusers.is_authenticated({ authToken: authToken })];
            case 5:
                _b.apply(void 0, [(_f.sent()).isAuthenticated,
                    'id omitted results in failed authentication',
                    'id optional for is_authenticated']);
                return [4 /*yield*/, sdk.api.endusers.generate_auth_token({ id: e.id, durationInSeconds: 1000 })];
            case 6:
                withDurationResult = _f.sent();
                assert(!!withDurationResult, 'no result for id with duration', 'id with duration');
                return [4 /*yield*/, sdk.api.endusers.generate_auth_token({ externalId: externalId })];
            case 7:
                _c = _f.sent(), authTokenUID = _c.authToken, enduser2 = _c.enduser;
                assert(!!authTokenUID && !!enduser2, 'invalid returned values eid', 'Generate authToken and get enduser eid');
                _d = assert;
                return [4 /*yield*/, sdk.api.endusers.is_authenticated({ id: enduser2.id, authToken: authTokenUID })];
            case 8:
                _d.apply(void 0, [(_f.sent()).isAuthenticated,
                    'invalid authToken generated for enduser', 'Generate authToken for enduser is valid']);
                return [4 /*yield*/, sdk.api.endusers.generate_auth_token({ externalId: externalId, durationInSeconds: 1000 })];
            case 9:
                withDurationResult = _f.sent();
                assert(!!withDurationResult, 'no result for externalId with duration', 'externalId with duration');
                return [4 /*yield*/, async_test("auth by externalId", function () { return sdk.api.endusers.generate_auth_token({ externalId: e.externalId }); }, passOnVoid)];
            case 10:
                _f.sent();
                return [4 /*yield*/, async_test("auth by email", function () { return sdk.api.endusers.generate_auth_token({ email: e.email }); }, passOnVoid)];
            case 11:
                _f.sent();
                return [4 /*yield*/, async_test("auth by phone", function () { return sdk.api.endusers.generate_auth_token({ phone: e.phone }); }, passOnVoid)];
            case 12:
                _f.sent();
                return [4 /*yield*/, async_test("auth by nothing throws error", function () { return sdk.api.endusers.generate_auth_token({ phone: undefined }); }, { shouldError: true, onError: function (e) { return e.message === "One of id, externalId, email, or phone is required"; } })];
            case 13:
                _f.sent();
                return [4 /*yield*/, async_test("auth by bad field throws error", function () { return sdk.api.endusers.generate_auth_token({ email: "notavalidemail@tellescope.com" }); }, { shouldError: true, onError: function (e) { return e.message === "Could not find a corresponding enduser"; } })];
            case 14:
                _f.sent();
                return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id)];
            case 15:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); };
var generateEnduserAuthTests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var externalId, e, _a, authToken, enduser, isAuthenticated, _b, withDurationResult, _c, authTokenUID, enduser2, _d;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                log_header("Generated Enduser authToken");
                externalId = '1029f9v9sjd0as';
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'generated@tellescope.com', phone: '+15555555555', externalId: externalId })];
            case 1:
                e = _f.sent();
                return [4 /*yield*/, sdk.api.endusers.generate_auth_token({ id: e.id })];
            case 2:
                _a = _f.sent(), authToken = _a.authToken, enduser = _a.enduser;
                assert(!!authToken && !!enduser, 'invalid returned values', 'Generate authToken and get enduser');
                return [4 /*yield*/, sdk.api.endusers.is_authenticated({ id: enduser.id, authToken: authToken })];
            case 3:
                isAuthenticated = (_f.sent()).isAuthenticated;
                assert(isAuthenticated, 'invalid authToken generated for enduser', 'Generate authToken for enduser is valid');
                _b = assert;
                return [4 /*yield*/, sdk.api.endusers.is_authenticated({ authToken: authToken })];
            case 4:
                _b.apply(void 0, [(_f.sent()).isAuthenticated,
                    'id omitted results in failed authentication',
                    'id optional for is_authenticated']);
                return [4 /*yield*/, sdk.api.endusers.generate_auth_token({ id: e.id, durationInSeconds: 1000 })];
            case 5:
                withDurationResult = _f.sent();
                assert(!!withDurationResult, 'no result for id with duration', 'id with duration');
                return [4 /*yield*/, sdk.api.endusers.generate_auth_token({ externalId: externalId })];
            case 6:
                _c = _f.sent(), authTokenUID = _c.authToken, enduser2 = _c.enduser;
                assert(!!authTokenUID && !!enduser2, 'invalid returned values eid', 'Generate authToken and get enduser eid');
                _d = assert;
                return [4 /*yield*/, sdk.api.endusers.is_authenticated({ id: enduser2.id, authToken: authTokenUID })];
            case 7:
                _d.apply(void 0, [(_f.sent()).isAuthenticated,
                    'invalid authToken generated for enduser', 'Generate authToken for enduser is valid']);
                return [4 /*yield*/, sdk.api.endusers.generate_auth_token({ externalId: externalId, durationInSeconds: 1000 })];
            case 8:
                withDurationResult = _f.sent();
                assert(!!withDurationResult, 'no result for externalId with duration', 'externalId with duration');
                return [4 /*yield*/, async_test("auth by externalId", function () { return sdk.api.endusers.generate_auth_token({ externalId: e.externalId }); }, passOnVoid)];
            case 9:
                _f.sent();
                return [4 /*yield*/, async_test("auth by email", function () { return sdk.api.endusers.generate_auth_token({ email: e.email }); }, passOnVoid)];
            case 10:
                _f.sent();
                return [4 /*yield*/, async_test("auth by phone", function () { return sdk.api.endusers.generate_auth_token({ phone: e.phone }); }, passOnVoid)];
            case 11:
                _f.sent();
                return [4 /*yield*/, async_test("auth by nothing throws error", function () { return sdk.api.endusers.generate_auth_token({ phone: undefined }); }, { shouldError: true, onError: function (e) { return e.message === "One of id, externalId, email, or phone is required"; } })];
            case 12:
                _f.sent();
                return [4 /*yield*/, async_test("auth by bad field throws error", function () { return sdk.api.endusers.generate_auth_token({ email: "notavalidemail@tellescope.com" }); }, { shouldError: true, onError: function (e) { return e.message === "Could not find a corresponding enduser"; } })];
            case 13:
                _f.sent();
                return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id)];
            case 14:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); };
var instanceForModel = function (model, i) {
    var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l, _m;
    if (i === void 0) { i = 0; }
    var instance = {};
    var updates = {};
    var filter = {};
    for (var k in model.fields) {
        if (model.fields[k].readonly)
            continue;
        if (((_c = (_b = (_a = model.fields[k]) === null || _a === void 0 ? void 0 : _a.examples) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) > i) {
            instance[k] = (_f = (_d = model.fields[k]) === null || _d === void 0 ? void 0 : _d.examples) === null || _f === void 0 ? void 0 : _f[i];
            if ((_g = model === null || model === void 0 ? void 0 : model.readFilter) === null || _g === void 0 ? void 0 : _g[k]) {
                filter[k] = (_j = (_h = model.fields[k]) === null || _h === void 0 ? void 0 : _h.examples) === null || _j === void 0 ? void 0 : _j[i];
            }
            if (((_k = model === null || model === void 0 ? void 0 : model.fields) === null || _k === void 0 ? void 0 : _k[k].updatesDisabled) !== true) {
                updates[k] = (_m = (_l = model.fields[k]) === null || _l === void 0 ? void 0 : _l.examples) === null || _m === void 0 ? void 0 : _m[i];
            }
        }
    }
    return { instance: instance, updates: updates, filter: filter };
};
var has_required_field = function (fields) { return Object.values(fields).find(function (f) { return f.required === true; }) !== undefined; };
var verify_missing_defaults = function (_a) {
    var queries = _a.queries, model = _a.model, name = _a.name;
    return __awaiter(void 0, void 0, void 0, function () {
        var queryForOperation, o, _b, _c, _d, _i;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    queryForOperation = {
                        create: function () { return queries.createOne({}); },
                        createMany: function () { return queries.createSome([{}, {}]); },
                        read: function () { return queries.getOne('fakeid'); },
                        readMany: function () { return queries.getSome(); },
                        update: function () { return queries.updateOne('fakeid', {}); },
                        delete: function () { return queries.deleteOne('fakeid'); },
                    };
                    _b = DEFAULT_OPERATIONS;
                    _c = [];
                    for (_d in _b)
                        _c.push(_d);
                    _i = 0;
                    _f.label = 1;
                case 1:
                    if (!(_i < _c.length)) return [3 /*break*/, 4];
                    _d = _c[_i];
                    if (!(_d in _b)) return [3 /*break*/, 3];
                    o = _d;
                    if (Object.keys(model.defaultActions).includes(o) || model.customActions[o])
                        return [3 /*break*/, 3]; // action is implemented
                    return [4 /*yield*/, async_test("".concat(o, " unavailable for ").concat(name), function () { return queryForOperation[o](); }, { shouldError: true, onError: function (e) { return e.message === 'This action is not allowed' || e.message === 'Inaccessible'; } })];
                case 2:
                    _f.sent();
                    _f.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var validateReturnType = function (fs, r, d) {
    var validation = fieldsToValidationOld(fs !== null && fs !== void 0 ? fs : {});
    try {
        for (var f in r) {
            (validation[f] || d._default)(r[f]);
        }
        return true;
    }
    catch (err) {
        console.error(err);
        return false;
    }
};
var defaultEnduser = undefined;
var run_generated_tests = function (_a) {
    var queries = _a.queries, model = _a.model, name = _a.name, returns = _a.returns;
    return __awaiter(void 0, void 0, void 0, function () {
        var _b, instance, updates, filter, _id, safeName, singularName, defaultValidation;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (name === 'post_likes'
                        || name === 'users'
                        || name === 'integrations'
                        || name === 'databases'
                        || name === 'database_records'
                        || name === 'phone_calls'
                        || name === 'analytics_frames'
                        || name === 'superbills'
                        || name === 'webhooks'
                        || name === 'integration_logs' // readonly
                        || name === 'automated_actions' // might process in background and cause false failure
                        || name === 'waitlists' // while waitlist updates are not stored in logs
                    )
                        return [2 /*return*/];
                    if (!!defaultEnduser) return [3 /*break*/, 2];
                    return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'default@tellescope.com', phone: "5555555555" })];
                case 1:
                    defaultEnduser = _c.sent();
                    _c.label = 2;
                case 2:
                    _b = instanceForModel(model), instance = _b.instance, updates = _b.updates, filter = _b.filter;
                    if (instance.enduserId)
                        instance.enduserId = defaultEnduser.id;
                    if (updates.enduserId)
                        updates.enduserId = defaultEnduser.id;
                    _id = '';
                    safeName = url_safe_path(name);
                    singularName = safeName.substring(0, safeName.length - 1);
                    return [4 /*yield*/, verify_missing_defaults({ queries: queries, model: model, name: name, returns: returns })
                        // only validate id for general objects, for now
                    ];
                case 3:
                    _c.sent();
                    defaultValidation = {
                        id: mongoIdStringRequired.validate(), _default: function (x) { return x; },
                    };
                    // If no create, cannot test get, update, or delete
                    if (!(model.defaultActions.create || model.customActions.create))
                        return [2 /*return*/];
                    if (!has_required_field(model.fields)) return [3 /*break*/, 5];
                    return [4 /*yield*/, async_test("create-".concat(singularName, " (missing a required field)"), function () { return queries.createOne({}); }, { shouldError: true, onError: function (e) { return e.message.endsWith('is required') || e.message.includes('Value not provided'); } })];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5: return [4 /*yield*/, async_test("create-".concat(singularName), function () { return queries.createOne(instance); }, { onResult: function (r) { return !!(_id = r.id) && (name === 'api_keys' || !!r.creator) && validateReturnType(returns.create, r, defaultValidation); } })];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, wait(undefined, 25)];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, async_test("log-".concat(singularName, " create"), function () { return sdk.api.user_logs.getOne({ resourceId: _id, resource: name, action: 'create' }); }, { onResult: function (r) { return r && r.userId === sdk.userInfo.id; } })];
                case 8:
                    _c.sent();
                    if (!model.defaultActions.update) return [3 /*break*/, 12];
                    return [4 /*yield*/, async_test("update-".concat(singularName), function () { return queries.updateOne(_id, updates, { replaceObjectFields: true }); }, { onResult: function (u) { return typeof u === 'object' && u.id === _id; } })];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, wait(undefined, 25)];
                case 10:
                    _c.sent();
                    return [4 /*yield*/, async_test("log-".concat(singularName, " update"), function () { return sdk.api.user_logs.getOne({ resourceId: _id, resource: name, action: 'update' }); }, { onResult: function (r) { return r && r.userId === sdk.userInfo.id; } })];
                case 11:
                    _c.sent();
                    _c.label = 12;
                case 12: return [4 /*yield*/, async_test("get-".concat(singularName), function () { return queries.getOne(_id); }, { onResult: function (d) {
                            if (!(d === null || d === void 0 ? void 0 : d.id))
                                return false;
                            for (var k in instance) {
                                // @ts-ignore
                                if (!objects_equivalent(instance[k], d[k]))
                                    return false;
                            }
                            return true;
                        }
                    })];
                case 13:
                    _c.sent();
                    return [4 /*yield*/, async_test("get-".concat(safeName), function () { return queries.getSome({ filter: filter }); }, { onResult: function (_a) {
                                var d = _a[0];
                                // if (others.length !== 0) return false // some collections are not reset during testing, like API keys
                                if (!(d === null || d === void 0 ? void 0 : d.id))
                                    return false;
                                for (var k in instance) {
                                    // @ts-ignore
                                    if (!objects_equivalent(instance[k], d[k]))
                                        return false;
                                }
                                return true;
                            }
                        })];
                case 14:
                    _c.sent();
                    return [4 /*yield*/, async_test("delete-".concat(singularName), function () { return queries.deleteOne(_id); }, passOnVoid)];
                case 15:
                    _c.sent();
                    return [4 /*yield*/, wait(undefined, 25)];
                case 16:
                    _c.sent();
                    return [4 /*yield*/, async_test("get-".concat(singularName, " (verify delete)"), function () { return queries.getOne(_id); }, { shouldError: true, onError: function (e) { return e.message === 'Could not find a record for the given id'; } })
                        // lots of side effects
                    ];
                case 17:
                    _c.sent();
                    if (!(name === 'endusers')) return [3 /*break*/, 19];
                    return [4 /*yield*/, wait(undefined, 100)];
                case 18:
                    _c.sent();
                    return [3 /*break*/, 21];
                case 19: return [4 /*yield*/, wait(undefined, 50)];
                case 20:
                    _c.sent();
                    _c.label = 21;
                case 21: return [4 /*yield*/, async_test("log-".concat(singularName, " delete"), function () { return sdk.api.user_logs.getOne({ resourceId: _id, resource: name, action: 'delete' }); }, { onResult: function (r) { return r && r.userId === sdk.userInfo.id; } })];
                case 22:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
};
var enduser_tests = function (queries) {
    if (queries === void 0) { queries = sdk.api.endusers; }
    return __awaiter(void 0, void 0, void 0, function () {
        var e1, e2, eToDup1, eToDup2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_header("Enduser");
                    return [4 /*yield*/, queries.createOne({ email: 'test1@gmail.com', phone: '+14155555500' })];
                case 1:
                    e1 = _a.sent();
                    return [4 /*yield*/, queries.createOne({ email: 'test2@gmail.com', phone: '+14155555501' })];
                case 2:
                    e2 = _a.sent();
                    return [4 /*yield*/, enduserSDK.register({ email: 'test3@gmail.com', password: "testenduserpassword" })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, async_test("get-enduser registered", function () { return queries.getOne({ email: 'test3@gmail.com' }); }, { onResult: function (e) { return !!e; } })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, async_test("enduser registered can log in", function () { return enduserSDK.authenticate('test3@gmail.com', 'testenduserpassword'); }, { onResult: function (e) { return !!e.authToken && e.enduser.email === 'test3@gmail.com'; } })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, async_test("update-enduser email conflict", function () { var _a; return queries.updateOne((_a = e1.id) !== null && _a !== void 0 ? _a : '', { email: e2.email }); }, { shouldError: true, onError: function () { return true; } })
                        // no longer restricted
                        // await async_test(
                        //   `update-enduser phone conflict`, 
                        //   () => queries.updateOne(e1.id ?? '', { phone: e2.phone }), 
                        //   { shouldError: true, onError: () => true }
                        // )
                    ];
                case 6:
                    _a.sent();
                    // no longer restricted
                    // await async_test(
                    //   `update-enduser phone conflict`, 
                    //   () => queries.updateOne(e1.id ?? '', { phone: e2.phone }), 
                    //   { shouldError: true, onError: () => true }
                    // )
                    return [4 /*yield*/, async_test("update-enduser email and phone conflict", function () { var _a; return queries.updateOne((_a = e1.id) !== null && _a !== void 0 ? _a : '', { email: e2.email, phone: e2.phone }); }, { shouldError: true, onError: function () { return true; } })];
                case 7:
                    // no longer restricted
                    // await async_test(
                    //   `update-enduser phone conflict`, 
                    //   () => queries.updateOne(e1.id ?? '', { phone: e2.phone }), 
                    //   { shouldError: true, onError: () => true }
                    // )
                    _a.sent();
                    return [4 /*yield*/, async_test("update-enduser working", function () { var _a; return queries.updateOne((_a = e1.id) !== null && _a !== void 0 ? _a : '', { email: 'edited' + e1.email }); }, passOnVoid)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, async_test("update-enduser test replaceObjectFields 1", function () { var _a; return queries.updateOne((_a = e1.id) !== null && _a !== void 0 ? _a : '', { fields: { field1: '1' } }); }, passOnVoid)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, async_test("get-enduser test replaceObjectFields verify 1", function () { var _a; return queries.getOne((_a = e1.id) !== null && _a !== void 0 ? _a : ''); }, { onResult: function (e) { var _a; return ((_a = e.fields) === null || _a === void 0 ? void 0 : _a.field1) === '1'; } })];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, async_test("update-enduser test replaceObjectFields 2", function () { var _a; return queries.updateOne((_a = e1.id) !== null && _a !== void 0 ? _a : '', { fields: { field2: '2' } }); }, passOnVoid)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, async_test("get-enduser test replaceObjectFields verify 2", function () { var _a; return queries.getOne((_a = e1.id) !== null && _a !== void 0 ? _a : ''); }, { onResult: function (e) { var _a, _b; return ((_a = e.fields) === null || _a === void 0 ? void 0 : _a.field1) === '1' && ((_b = e.fields) === null || _b === void 0 ? void 0 : _b.field2) === '2'; } })];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, async_test("update-enduser test replaceObjectFields true 1", function () { var _a; return queries.updateOne((_a = e1.id) !== null && _a !== void 0 ? _a : '', { fields: { field2: '_2' } }, { replaceObjectFields: true }); }, passOnVoid)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, async_test("get-enduser test replaceObjectFields verify true 1", function () { var _a; return queries.getOne((_a = e1.id) !== null && _a !== void 0 ? _a : ''); }, { onResult: function (e) { var _a, _b; return ((_a = e.fields) === null || _a === void 0 ? void 0 : _a.field1) === undefined && ((_b = e.fields) === null || _b === void 0 ? void 0 : _b.field2) === '_2'; } })];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, async_test("update-enduser test replaceObjectFields true unset", function () { var _a; return queries.updateOne((_a = e1.id) !== null && _a !== void 0 ? _a : '', { fields: {} }, { replaceObjectFields: true }); }, passOnVoid)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, async_test("get-enduser test replaceObjectFields verify true unset", function () { var _a; return queries.getOne((_a = e1.id) !== null && _a !== void 0 ? _a : ''); }, { onResult: function (e) { return objects_equivalent(e.fields, {}); } })];
                case 16:
                    _a.sent();
                    eToDup1 = { email: 'dup1@tellescope.com' };
                    eToDup2 = { email: 'dup2@tellescope.com' };
                    return [4 /*yield*/, queries.createOne(eToDup1)];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, queries.createOne(eToDup2)];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, async_test("create-many-endusers - all conflict (1)", function () { return queries.createSome([eToDup1]); }, { shouldError: true, onError: function (e) { return e.message === 'Uniqueness Violation'; } })];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, async_test("create-many-endusers - all conflict (2)", function () { return queries.createSome([eToDup1, eToDup2]); }, { shouldError: true, onError: function (e) { return e.message === 'Uniqueness Violation'; } })];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, async_test("create-many-endusers - multiple email conflict", function () { return queries.createSome([eToDup1, eToDup2, { email: "unique@tellescope.com" }]); }, { onResult: function (_a) {
                                var created = _a.created, errors = _a.errors;
                                return created.length === 1 && errors.length === 2;
                            } })];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, async_test("create-many-endusers - create conflict, one unique", function () { return queries.createSome([{ email: 'd1@tellescope.com' }, { email: 'd1@tellescope.com' }, { email: 'd1@tellescope.com' }]); }, { onResult: function (_a) {
                                var created = _a.created, errors = _a.errors;
                                return created.length === 1 && errors.length === 2;
                            } })];
                case 22:
                    _a.sent();
                    return [4 /*yield*/, async_test("create-many-endusers - create conflict, two unique", function () { return queries.createSome([{ email: 'd2@tellescope.com' }, { email: 'd2@tellescope.com' }, { email: 'createme@tellescope.com' }]); }, { onResult: function (_a) {
                                var created = _a.created, errors = _a.errors;
                                return created.length === 2 && errors.length === 1;
                            } })];
                case 23:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
var api_key_tests = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); };
var engagement_tests = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); };
var journey_tests = function (queries) {
    if (queries === void 0) { queries = sdk.api.journeys; }
    return __awaiter(void 0, void 0, void 0, function () {
        var journey, journey2, updated, fetchAfterDeletion, withAddedState, e1, e2, engagement, es;
        var _a, _b, _c, _d, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, async_test("create-journey - states missing defaultState", function () { return queries.createOne({ title: 'Error', defaultState: 'default', states: [{ name: 'not-default', priority: 'N/A' }] }); }, { shouldError: true, onError: function (e) { return e.message === 'defaultState does not exist in states'; } })];
                case 1:
                    _h.sent();
                    return [4 /*yield*/, async_test("create-journey - duplicate states", function () { return queries.createOne({ title: 'Error', defaultState: 'default', states: [{ name: 'default', priority: 'N/A' }, { name: 'default', priority: 'N/A' }] }); }, { shouldError: true, onError: function (e) { return e.message === 'Uniqueness Violation'; } })];
                case 2:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.journeys.createOne({ title: 'Test Journey' })];
                case 3:
                    journey = _h.sent();
                    return [4 /*yield*/, sdk.api.journeys.createOne({ title: 'Test Journey 2' })];
                case 4:
                    journey2 = _h.sent();
                    return [4 /*yield*/, sdk.api.journeys.updateOne(journey.id, {
                            states: [
                                { name: 'Delete Me 1', priority: 'N/A' },
                                { name: 'Delete Me 2', priority: 'N/A' },
                            ]
                        })];
                case 5:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.journeys.delete_states({ id: journey.id, states: ['Delete Me 1', 'Delete Me 2'] })];
                case 6:
                    updated = (_h.sent()).updated;
                    assert(!!updated.id && updated.states.length === 1 && updated.states[0].name === 'New', 'delete states fail on returned update', 'delete states returns updated value');
                    return [4 /*yield*/, sdk.api.journeys.getOne(journey.id)];
                case 7:
                    fetchAfterDeletion = _h.sent();
                    assert(fetchAfterDeletion.states.length === 1 && fetchAfterDeletion.states[0].name === 'New', 'delete states fail', 'delete states worked');
                    assert(journey.defaultState === 'New', 'defaultState not set on create', 'journey-create - defaultState initialized');
                    assert(journey.states[0].name === 'New', 'defaultState not set on create', 'journey-create - states initialized');
                    return [4 /*yield*/, sdk.api.journeys.updateOne(journey.id, { states: [{ name: 'ToDuplicate', priority: "N/A" }] })];
                case 8:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.journeys.getOne(journey.id)];
                case 9:
                    withAddedState = _h.sent();
                    assert(withAddedState.states.length === 2 && withAddedState.states.find(function (s) { return s.name === 'ToDuplicate'; }) !== undefined, 'new state added', 'journey-update - push state change');
                    return [4 /*yield*/, async_test("create-journey - add duplicate state", function () { return sdk.api.journeys.updateOne(journey.id, { states: [{ name: 'ToDuplicate', priority: "N/A" }] }); }, { shouldError: true, onError: function (e) { return e.message === 'Uniqueness Violation'; } })];
                case 10:
                    _h.sent();
                    return [4 /*yield*/, async_test("create-journey - add duplicate states in update", function () { return sdk.api.journeys.updateOne(journey.id, { states: [{ name: 'DuplicateUpdate', priority: "N/A" }, { name: 'DuplicateUpdate', priority: "N/A" }] }); }, { shouldError: true, onError: function (e) { return e.message === 'Uniqueness Violation'; } })];
                case 11:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.journeys.updateOne(journey.id, { defaultState: 'Added', states: [{ name: 'Added', priority: "N/A" }, { name: "Other", priority: "N/A" }] }, { replaceObjectFields: true })];
                case 12:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.journeys.getOne(journey.id)];
                case 13:
                    withAddedState = _h.sent();
                    assert(withAddedState.states.length === 2 && withAddedState.states.find(function (s) { return s.name === 'Added'; }) !== undefined
                        && withAddedState.defaultState === 'Added', 'duplicate state not added', 'journey-update - replace states');
                    return [4 /*yield*/, async_test("journey-update - states replace with missing default", function () { return queries.updateOne(journey.id, { states: [{ name: 'Not Default', priority: "N/A" }] }, { replaceObjectFields: true }); }, { shouldError: true, onError: function (e) { return e.message === 'defaultState does not exist in states'; } })];
                case 14:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'journeyunset1@tellescope.com', journeys: (_a = {}, _a[journey.id] = 'Added', _a) })];
                case 15:
                    e1 = _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'journeyunset2@tellescope.com', journeys: (_b = {}, _b[journey.id] = 'Added', _b[journey2.id] = 'New', _b) })];
                case 16:
                    e2 = _h.sent();
                    return [4 /*yield*/, async_test("create-enduser - invalid journey id", function () {
                            var _a;
                            return sdk.api.endusers.createOne({ email: 'journeyunset3@tellescope.com', journeys: (_a = {}, _a[e1.id] = 'Added', _a) });
                        }, { shouldError: true, onError: function (e) { return e.message === 'Could not find a related record for the given id(s)'; } })];
                case 17:
                    _h.sent();
                    return [4 /*yield*/, async_test("update-enduser - invalid journey id", function () {
                            var _a;
                            return sdk.api.endusers.updateOne(e1.id, { journeys: (_a = {}, _a[e1.id] = 'Added', _a) });
                        }, { shouldError: true, onError: function (e) { return e.message === 'Could not find a related record for the given id(s)'; } })];
                case 18:
                    _h.sent();
                    return [4 /*yield*/, async_test("update-enduser - one invalid journey id", function () {
                            var _a;
                            return sdk.api.endusers.updateOne(e1.id, { journeys: (_a = {}, _a[journey.id] = 'Added', _a[e1.id] = 'Added', _a) });
                        }, { shouldError: true, onError: function (e) { return e.message === 'Could not find a related record for the given id(s)'; } })];
                case 19:
                    _h.sent();
                    return [4 /*yield*/, sdk.api.endusers.updateOne(e1.id, { journeys: (_c = {}, _c[journey.id] = 'Other', _c) })]; // valid state change
                case 20:
                    _h.sent(); // valid state change
                    return [4 /*yield*/, sdk.api.endusers.updateOne(e1.id, { journeys: (_d = {}, _d[journey.id] = 'Added', _d) })]; // change back
                case 21:
                    _h.sent(); // change back
                    return [4 /*yield*/, wait(undefined, 25)]; // wait for side effects to add engagement
                case 22:
                    _h.sent(); // wait for side effects to add engagement
                    return [4 /*yield*/, sdk.api.engagement_events.getSome()];
                case 23:
                    engagement = _h.sent();
                    assert(engagement.filter(function (e) { return e.enduserId === e1.id && e.type === "STATE_CHANGE"; }).length === 2, 'STATE_CHANGE engagement not tracked', 'Update enduser tracks state changes');
                    return [4 /*yield*/, sdk.api.endusers.createSome([{ email: "1@tellescope.com", journeys: (_f = {}, _f[journey.id] = 'Added', _f) }, { email: "2@tellescope.com", journeys: (_g = {}, _g[journey.id] = 'Added', _g) }])];
                case 24:
                    es = (_h.sent()).created;
                    return [4 /*yield*/, sdk.api.engagement_events.getSome()];
                case 25:
                    engagement = _h.sent();
                    assert(engagement.filter(function (e) { return e.enduserId === es[0].id && e.type === "JOURNEY_SET"; }).length === 1, 'JOURNEY_SET engagement not tracked', 'Create endusers tracks engagement events (1)');
                    assert(engagement.filter(function (e) { return e.enduserId === es[1].id && e.type === "JOURNEY_SET"; }).length === 1, 'JOURNEY_SET engagement not tracked', 'Create endusers tracks engagement events (2)');
                    return [4 /*yield*/, queries.updateOne(journey.id, { states: [{ name: 'First', priority: "N/A" }, { name: 'Added', priority: "N/A" }] }, { replaceObjectFields: true })];
                case 26:
                    _h.sent();
                    return [4 /*yield*/, async_test("journey-update - insert new state at front", function () { return queries.getOne(journey.id); }, { onResult: function (j) { return objects_equivalent(j.states, [{ name: 'First', priority: "N/A" }, { name: 'Added', priority: "N/A" }]); } })
                        // removed
                        // await async_test(
                        //   `journey-updateState`, 
                        //   () => queries.update_state({ id: journey.id, name: 'Added', updates: { name: 'Updated', priority: 'N/A' }}),
                        //   passOnVoid,
                        // )
                        // await wait(undefined, 25) // wait for side effects to update endusers
                        // await async_test(
                        //   `journey-updateState verify propagation to enduser 1`, 
                        //   () => sdk.api.endusers.getOne(e1.id),
                        //   { onResult: e => objects_equivalent(e.journeys, { [journey.id]: 'Updated' })},
                        // )
                        // await async_test(
                        //   `journey-updateState verify propagation to enduser 2`, 
                        //   () => sdk.api.endusers.getOne(e2.id),
                        //   { onResult: e => objects_equivalent(e.journeys, { [journey.id]: 'Updated', [journey2.id]: 'New' })},
                        // )
                    ];
                case 27:
                    _h.sent();
                    // removed
                    // await async_test(
                    //   `journey-updateState`, 
                    //   () => queries.update_state({ id: journey.id, name: 'Added', updates: { name: 'Updated', priority: 'N/A' }}),
                    //   passOnVoid,
                    // )
                    // await wait(undefined, 25) // wait for side effects to update endusers
                    // await async_test(
                    //   `journey-updateState verify propagation to enduser 1`, 
                    //   () => sdk.api.endusers.getOne(e1.id),
                    //   { onResult: e => objects_equivalent(e.journeys, { [journey.id]: 'Updated' })},
                    // )
                    // await async_test(
                    //   `journey-updateState verify propagation to enduser 2`, 
                    //   () => sdk.api.endusers.getOne(e2.id),
                    //   { onResult: e => objects_equivalent(e.journeys, { [journey.id]: 'Updated', [journey2.id]: 'New' })},
                    // )
                    return [4 /*yield*/, queries.deleteOne(journey.id)];
                case 28:
                    // removed
                    // await async_test(
                    //   `journey-updateState`, 
                    //   () => queries.update_state({ id: journey.id, name: 'Added', updates: { name: 'Updated', priority: 'N/A' }}),
                    //   passOnVoid,
                    // )
                    // await wait(undefined, 25) // wait for side effects to update endusers
                    // await async_test(
                    //   `journey-updateState verify propagation to enduser 1`, 
                    //   () => sdk.api.endusers.getOne(e1.id),
                    //   { onResult: e => objects_equivalent(e.journeys, { [journey.id]: 'Updated' })},
                    // )
                    // await async_test(
                    //   `journey-updateState verify propagation to enduser 2`, 
                    //   () => sdk.api.endusers.getOne(e2.id),
                    //   { onResult: e => objects_equivalent(e.journeys, { [journey.id]: 'Updated', [journey2.id]: 'New' })},
                    // )
                    _h.sent();
                    return [4 /*yield*/, wait(undefined, 25)]; // wait for side effects to update endusers
                case 29:
                    _h.sent(); // wait for side effects to update endusers
                    return [4 /*yield*/, async_test("journey-delete - corresponding enduser journeys are unset 1", function () { return sdk.api.endusers.getOne(e1.id); }, { onResult: function (e) { return objects_equivalent(e.journeys, {}); } })];
                case 30:
                    _h.sent();
                    return [4 /*yield*/, async_test("journey-delete - corresponding enduser journeys are unset, others left", function () { return sdk.api.endusers.getOne(e2.id); }, { onResult: function (e) {
                                var _a;
                                return objects_equivalent(e.journeys, (_a = {}, _a[journey2.id] = 'New', _a));
                            } })];
                case 31:
                    _h.sent();
                    return [2 /*return*/];
            }
        });
    });
};
var email_tests = function (queries) {
    if (queries === void 0) { queries = sdk.api.emails; }
    return __awaiter(void 0, void 0, void 0, function () {
        var me, meNoEmail, meNoConsent, testEmail;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'sebass@tellescope.com' })];
                case 1:
                    me = _a.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({ phone: "4444444444" })];
                case 2:
                    meNoEmail = _a.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'sebass22@tellescope.com', emailConsent: false })];
                case 3:
                    meNoConsent = _a.sent();
                    testEmail = {
                        logOnly: true,
                        enduserId: me.id,
                        subject: "Test Email",
                        textContent: "This is at est email"
                    };
                    return [4 /*yield*/, async_test("send-email - missing email", function () { return queries.createOne(__assign(__assign({}, testEmail), { enduserId: meNoEmail.id, logOnly: false })); }, // constraint ignored when logOnly is true
                        { shouldError: true, onError: function (e) { return e.message === "Missing email"; } })
                        // await async_test(
                        //   `send-email - missing consent`, 
                        //   () => queries.createOne({ ...testEmail, enduserId: meNoConsent.id, logOnly: false }), // constraint ignored when logOnly is true
                        //   { shouldError: true, onError: e => e.message === "Missing email consent" }
                        // )
                        // await async_test(
                        //   `send-email - missing consent (multiple)`, 
                        //   () => queries.createSome([{ ...testEmail, enduserId: meNoConsent.id, logOnly: false }, { ...testEmail, enduserId: meNoConsent.id, logOnly: false }]), // constraint ignored when logOnly is true
                        //   { shouldError: true, onError: e => e.message === "Missing email consent" }
                        // )
                    ];
                case 4:
                    _a.sent();
                    // await async_test(
                    //   `send-email - missing consent`, 
                    //   () => queries.createOne({ ...testEmail, enduserId: meNoConsent.id, logOnly: false }), // constraint ignored when logOnly is true
                    //   { shouldError: true, onError: e => e.message === "Missing email consent" }
                    // )
                    // await async_test(
                    //   `send-email - missing consent (multiple)`, 
                    //   () => queries.createSome([{ ...testEmail, enduserId: meNoConsent.id, logOnly: false }, { ...testEmail, enduserId: meNoConsent.id, logOnly: false }]), // constraint ignored when logOnly is true
                    //   { shouldError: true, onError: e => e.message === "Missing email consent" }
                    // )
                    return [4 /*yield*/, async_test("send-email", function () { return queries.createOne(testEmail); }, { onResult: function (t) { return !!t; } })];
                case 5:
                    // await async_test(
                    //   `send-email - missing consent`, 
                    //   () => queries.createOne({ ...testEmail, enduserId: meNoConsent.id, logOnly: false }), // constraint ignored when logOnly is true
                    //   { shouldError: true, onError: e => e.message === "Missing email consent" }
                    // )
                    // await async_test(
                    //   `send-email - missing consent (multiple)`, 
                    //   () => queries.createSome([{ ...testEmail, enduserId: meNoConsent.id, logOnly: false }, { ...testEmail, enduserId: meNoConsent.id, logOnly: false }]), // constraint ignored when logOnly is true
                    //   { shouldError: true, onError: e => e.message === "Missing email consent" }
                    // )
                    _a.sent();
                    testEmail.subject = "Test Email (Multi-Send)";
                    testEmail.textContent = "Multiple content";
                    return [4 /*yield*/, async_test("send-email (multiple)", function () { return queries.createSome([testEmail, testEmail, testEmail]); }, { onResult: function (t) { return !!t; } })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(me.id)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(meNoEmail.id)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(meNoConsent.id)];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
var sms_tests = function (queries) {
    if (queries === void 0) { queries = sdk.api.sms_messages; }
    return __awaiter(void 0, void 0, void 0, function () {
        var me, meNoPhone, meNoConsent, testSMS;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sdk.api.endusers.createOne({ phone: '14152618149' })];
                case 1:
                    me = _a.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({ email: "sebassss@tellescope.com" })];
                case 2:
                    meNoPhone = _a.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({ phone: '4444444444', phoneConsent: false })];
                case 3:
                    meNoConsent = _a.sent();
                    testSMS = {
                        logOnly: true,
                        enduserId: me.id,
                        message: "Test SMS",
                    };
                    // await async_test(
                    //   `send-sms - blank message`, 
                    //   () => queries.createOne({ ...testSMS, message: '' }), // constraint ignored when logOnly is true
                    //   { shouldError: true, onError: e => e.message === "message must not be blank" }
                    // )
                    return [4 /*yield*/, async_test("send-sms - missing phone", function () { return queries.createOne(__assign(__assign({}, testSMS), { enduserId: meNoPhone.id, logOnly: false })); }, // constraint ignored when logOnly is true
                        { shouldError: true, onError: function (e) { return e.message === "Missing phone"; } })
                        // await async_test(
                        //   `send-sms - missing phone consent`, 
                        //   () => queries.createOne({ ...testSMS, enduserId: meNoConsent.id, logOnly: false }), // constraint ignored when logOnly is true
                        //   { shouldError: true, onError: e => e.message === "Missing phone consent" }
                        // )
                        // await async_test(
                        //   `send-sms - missing phone (multiple)`, 
                        //   () => queries.createSome([{ ...testSMS, enduserId: meNoPhone.id, logOnly: false }, { ...testSMS, enduserId: meNoPhone.id, logOnly: false }]),
                        //   { shouldError: true, onError: e => e.message === "Missing phone" }
                        // )
                    ];
                case 4:
                    // await async_test(
                    //   `send-sms - blank message`, 
                    //   () => queries.createOne({ ...testSMS, message: '' }), // constraint ignored when logOnly is true
                    //   { shouldError: true, onError: e => e.message === "message must not be blank" }
                    // )
                    _a.sent();
                    // await async_test(
                    //   `send-sms - missing phone consent`, 
                    //   () => queries.createOne({ ...testSMS, enduserId: meNoConsent.id, logOnly: false }), // constraint ignored when logOnly is true
                    //   { shouldError: true, onError: e => e.message === "Missing phone consent" }
                    // )
                    // await async_test(
                    //   `send-sms - missing phone (multiple)`, 
                    //   () => queries.createSome([{ ...testSMS, enduserId: meNoPhone.id, logOnly: false }, { ...testSMS, enduserId: meNoPhone.id, logOnly: false }]),
                    //   { shouldError: true, onError: e => e.message === "Missing phone" }
                    // )
                    return [4 /*yield*/, async_test("send-sms", function () { return queries.createOne(testSMS); }, { onResult: function (t) { return !!t; } })];
                case 5:
                    // await async_test(
                    //   `send-sms - missing phone consent`, 
                    //   () => queries.createOne({ ...testSMS, enduserId: meNoConsent.id, logOnly: false }), // constraint ignored when logOnly is true
                    //   { shouldError: true, onError: e => e.message === "Missing phone consent" }
                    // )
                    // await async_test(
                    //   `send-sms - missing phone (multiple)`, 
                    //   () => queries.createSome([{ ...testSMS, enduserId: meNoPhone.id, logOnly: false }, { ...testSMS, enduserId: meNoPhone.id, logOnly: false }]),
                    //   { shouldError: true, onError: e => e.message === "Missing phone" }
                    // )
                    _a.sent();
                    testSMS.message = "(Multi-Send)"; // sending 3 or more will exceed rate limit of 3-per-3 seconds
                    return [4 /*yield*/, async_test("send-sms (multiple)", function () { return queries.createSome([testSMS, testSMS]); }, { onResult: function (t) { return !!t; } })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(me.id)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(meNoPhone.id)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(meNoConsent.id)];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
var chat_room_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sdk2, email, password, enduser, enduserLoggedIn, room, roomWithMessage, verifyRoomDisplayInfo, emptyRoom, loggedOutEnduser;
    var _a;
    var _b, _c, _d, _f, _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                log_header("Chat Room Tests");
                sdk2 = new Session({ host: host });
                return [4 /*yield*/, sdk2.authenticate(nonAdminEmail, nonAdminPassword)]; // non-admin has access restrictions we want to test 
            case 1:
                _k.sent(); // non-admin has access restrictions we want to test 
                return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)];
            case 2:
                _k.sent();
                email = 'enduser@tellescope.com', password = 'enduserPassword!';
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: email })];
            case 3:
                enduser = _k.sent();
                return [4 /*yield*/, sdk.api.endusers.set_password({ id: enduser.id, password: password }).catch(console.error)];
            case 4:
                _k.sent();
                return [4 /*yield*/, enduserSDK.authenticate(email, password).catch(console.error)];
            case 5:
                _k.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne(enduser.id)];
            case 6:
                enduserLoggedIn = _k.sent();
                assert(new Date(enduserLoggedIn.lastActive).getTime() > Date.now() - 100, 'lastActive fail for enduser', 'lastActive for enduser');
                return [4 /*yield*/, sdk.api.chat_rooms.createOne({ type: 'internal', userIds: [userId], enduserIds: [enduserSDK.userInfo.id] })];
            case 7:
                room = _k.sent();
                assert(room.numMessages === 0, 'num mesages no update', 'num messages on creation');
                return [4 /*yield*/, async_test("get-chat-room (not a user)", function () { return sdk2.api.chat_rooms.getOne(room.id); }, { shouldError: true, onError: function (e) { return e.message === "Could not find a record for the given id"; } })
                    // await async_test(
                    //   `user_display_info for room (not a user)`, 
                    //   () => sdk2.api.chat_rooms.display_info({ id: room.id }), 
                    //   { shouldError: true, onError: e => e.message === "Could not find a record for the given id" }
                    // )
                ];
            case 8:
                _k.sent();
                // await async_test(
                //   `user_display_info for room (not a user)`, 
                //   () => sdk2.api.chat_rooms.display_info({ id: room.id }), 
                //   { shouldError: true, onError: e => e.message === "Could not find a record for the given id" }
                // )
                return [4 /*yield*/, sdk.api.chats.createOne({ roomId: room.id, message: 'test message', attachments: [{ type: 'file', secureName: 'testsecurename' }] })];
            case 9:
                // await async_test(
                //   `user_display_info for room (not a user)`, 
                //   () => sdk2.api.chat_rooms.display_info({ id: room.id }), 
                //   { shouldError: true, onError: e => e.message === "Could not find a record for the given id" }
                // )
                _k.sent();
                return [4 /*yield*/, sdk.api.chat_rooms.getOne(room.id)];
            case 10:
                roomWithMessage = _k.sent();
                assert(roomWithMessage.numMessages === 1, 'num mesages no update', 'num messages on send message');
                assert(((_b = roomWithMessage === null || roomWithMessage === void 0 ? void 0 : roomWithMessage.recentMessageSentAt) !== null && _b !== void 0 ? _b : 0) > Date.now() - 1000, 'recent message timestamp bad', 'recent message timestamp');
                assert(!((_d = (_c = roomWithMessage === null || roomWithMessage === void 0 ? void 0 : roomWithMessage.infoForUser) === null || _c === void 0 ? void 0 : _c[userId]) === null || _d === void 0 ? void 0 : _d.unreadCount), 'bad unread count for user', 'unread count for user');
                assert(((_g = (_f = roomWithMessage === null || roomWithMessage === void 0 ? void 0 : roomWithMessage.infoForUser) === null || _f === void 0 ? void 0 : _f[enduserSDK.userInfo.id]) === null || _g === void 0 ? void 0 : _g.unreadCount) === 1, 'bad unread count for enduser', 'unread count for enduser');
                return [4 /*yield*/, sdk.api.chat_rooms.updateOne(roomWithMessage.id, { infoForUser: (_a = {}, _a[userId] = { unreadCount: 0 }, _a) })];
            case 11:
                roomWithMessage = _k.sent();
                assert(((_j = (_h = roomWithMessage === null || roomWithMessage === void 0 ? void 0 : roomWithMessage.infoForUser) === null || _h === void 0 ? void 0 : _h[userId]) === null || _j === void 0 ? void 0 : _j.unreadCount) === 0, 'bad reset unread count for user', 'reset unread count for user');
                verifyRoomDisplayInfo = function (info) {
                    if (!info)
                        return false;
                    if (typeof info !== 'object')
                        return false;
                    if (Object.keys(info).length !== 2)
                        return false;
                    if (!info[sdk.userInfo.id])
                        return false;
                    if (!info[enduserSDK.userInfo.id])
                        return false;
                    var _a = [info[sdk.userInfo.id], info[enduserSDK.userInfo.id]], user = _a[0], enduser = _a[1];
                    if (!(user.id === sdk.userInfo.id &&
                        user.fname === sdk.userInfo.fname &&
                        user.lname === sdk.userInfo.lname &&
                        user.avatar === sdk.userInfo.avatar &&
                        !!user.createdAt &&
                        !!user.lastActive &&
                        !!user.lastLogout))
                        return false;
                    if (!(enduser.id === enduserSDK.userInfo.id &&
                        enduser.fname === enduserSDK.userInfo.fname &&
                        enduser.lname === enduserSDK.userInfo.lname &&
                        enduser.avatar === enduserSDK.userInfo.avatar &&
                        !!enduser.createdAt &&
                        !!enduser.lastActive &&
                        !!enduser.lastLogout))
                        return false;
                    return true;
                };
                return [4 /*yield*/, async_test("user_display_info for room (for user)", function () { return sdk.api.chat_rooms.display_info({ id: room.id }); }, { onResult: function (r) { return r.id === room.id && verifyRoomDisplayInfo(r.display_info); } })];
            case 12:
                _k.sent();
                return [4 /*yield*/, async_test("user_display_info for room (for enduser)", function () { return enduserSDK.api.chat_rooms.display_info({ id: room.id }); }, { onResult: function (r) { return r.id === room.id && verifyRoomDisplayInfo(r.display_info); } })];
            case 13:
                _k.sent();
                return [4 /*yield*/, async_test("non admin can't get room without enduser", function () { return sdkNonAdmin.api.chat_rooms.getOne({ id: room.id }); }, handleAnyError)];
            case 14:
                _k.sent();
                return [4 /*yield*/, async_test("non admin can't get chats from room without enduser", function () { return sdkNonAdmin.api.chats.getSome({ filter: { roomId: room.id } }); }, handleAnyError)];
            case 15:
                _k.sent();
                return [4 /*yield*/, sdk.api.endusers.updateOne(enduser.id, { assignedTo: [sdkNonAdmin.userInfo.id] })];
            case 16:
                _k.sent();
                return [4 /*yield*/, async_test("non admin can get room with enduser", function () { return sdkNonAdmin.api.chat_rooms.getOne(room.id); }, passOnAnyResult)];
            case 17:
                _k.sent();
                return [4 /*yield*/, async_test("non admin can get chats from room with enduser", function () { return sdkNonAdmin.api.chats.getSome({ filter: { roomId: room.id } }); }, passOnAnyResult)];
            case 18:
                _k.sent();
                return [4 /*yield*/, sdk.api.chat_rooms.deleteOne(room.id)];
            case 19:
                _k.sent();
                return [4 /*yield*/, sdk.api.chat_rooms.createOne({})];
            case 20:
                emptyRoom = _k.sent();
                return [4 /*yield*/, async_test("get-chat-room (creator can access, even when not in userIds)", function () { return sdk.api.chat_rooms.getOne(emptyRoom.id); }, { onResult: function (r) { return r.id === emptyRoom.id; } })];
            case 21:
                _k.sent();
                return [4 /*yield*/, async_test("get-chat-room (not in empty room)", function () { return sdk2.api.chat_rooms.getOne(emptyRoom.id); }, { shouldError: true, onError: function (e) { return e.message === "Could not find a record for the given id"; } })];
            case 22:
                _k.sent();
                return [4 /*yield*/, async_test("join-room", function () { return sdk2.api.chat_rooms.join_room({ id: emptyRoom.id }); }, { onResult: function (_a) {
                            var room = _a.room;
                            return room.id === emptyRoom.id;
                        } })];
            case 23:
                _k.sent();
                return [4 /*yield*/, async_test("get-chat-room (join successful)", function () { return sdk2.api.chat_rooms.getOne(emptyRoom.id); }, { onResult: function (r) { return r.id === emptyRoom.id; } })];
            case 24:
                _k.sent();
                return [4 /*yield*/, async_test("create-chat (join successful)", function () { return sdk2.api.chats.createOne({ roomId: emptyRoom.id, message: 'test' }); }, passOnAnyResult)];
            case 25:
                _k.sent();
                return [4 /*yield*/, async_test("get-chat (join successful)", function () { return sdk2.api.chats.getSome({ filter: { roomId: emptyRoom.id } }); }, { onResult: function (r) { return r.length > 0; } })];
            case 26:
                _k.sent();
                return [4 /*yield*/, async_test("[bulk] get-chat-room (join successful)", function () { return sdk2.bulk_load({ load: [{ model: 'chat_rooms' }] }); }, { onResult: function (r) { var _a, _b, _c; return (_c = (_b = (_a = r.results) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.records) === null || _c === void 0 ? void 0 : _c.find(function (r) { return r.id === emptyRoom.id; }); } })];
            case 27:
                _k.sent();
                return [4 /*yield*/, enduserSDK.logout()];
            case 28:
                _k.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne(enduser.id)];
            case 29:
                loggedOutEnduser = _k.sent();
                assert(new Date(loggedOutEnduser.lastLogout).getTime() > Date.now() - 100, 'lastLogout fail for enduser', 'lastLogout for enduser');
                return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id)];
            case 30:
                _k.sent();
                return [4 /*yield*/, sdk.api.chat_rooms.deleteOne(emptyRoom.id)];
            case 31:
                _k.sent();
                return [2 /*return*/];
        }
    });
}); };
var chat_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sdk2, enduser, room, chat, chat2, enduserRoom, sharedRoom, sharedChat, sharedChat2, roomNull, chatNull, chat2Null, chatScheduled;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Chat");
                sdk2 = new Session({ host: host });
                return [4 /*yield*/, sdk2.authenticate(nonAdminEmail, nonAdminPassword)]; // non-admin has access restrictions we want to test 
            case 1:
                _a.sent(); // non-admin has access restrictions we want to test 
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: email })];
            case 2:
                enduser = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.set_password({ id: enduser.id, password: password }).catch(console.error)];
            case 3:
                _a.sent();
                return [4 /*yield*/, enduserSDK.authenticate(email, password).catch(console.error)];
            case 4:
                _a.sent();
                return [4 /*yield*/, sdk.api.chat_rooms.createOne({ type: 'internal', userIds: [userId] })];
            case 5:
                room = _a.sent();
                return [4 /*yield*/, sdk.api.chats.createOne({ roomId: room.id, message: "Hello!" })];
            case 6:
                chat = _a.sent();
                return [4 /*yield*/, sdk.api.chats.createOne({ roomId: room.id, message: "Hello..." })];
            case 7:
                chat2 = _a.sent();
                return [4 /*yield*/, sdk.api.chat_rooms.createOne({ type: 'internal', userIds: [userId], enduserIds: [enduser.id] })];
            case 8:
                enduserRoom = _a.sent();
                return [4 /*yield*/, sdk.api.chats.createOne({ roomId: enduserRoom.id, message: 'enduser' })];
            case 9:
                _a.sent();
                return [4 /*yield*/, enduserSDK.api.chats.createOne({ roomId: enduserRoom.id, message: 'enduser' })];
            case 10:
                _a.sent();
                return [4 /*yield*/, async_test("get-chats for enduser", function () { return enduserSDK.api.chats.getSome({ filter: { roomId: enduserRoom.id } }); }, { onResult: function (c) { return (c === null || c === void 0 ? void 0 : c.length) === 2; } })
                    // this is allowed now
                    // await async_test(
                    //   `get-chat (without filter)`, 
                    //   () => sdk.api.chats.getOne(chat.id), 
                    //   { shouldError: true, onError: () => true }
                    // )
                    // this is allowed now
                    // await async_test(
                    //   `get-chats (without filter)`, 
                    //   () => sdk.api.chats.getSome({}), 
                    //   { shouldError: true, onError: () => true }
                    // )
                ];
            case 11:
                _a.sent();
                // this is allowed now
                // await async_test(
                //   `get-chat (without filter)`, 
                //   () => sdk.api.chats.getOne(chat.id), 
                //   { shouldError: true, onError: () => true }
                // )
                // this is allowed now
                // await async_test(
                //   `get-chats (without filter)`, 
                //   () => sdk.api.chats.getSome({}), 
                //   { shouldError: true, onError: () => true }
                // )
                return [4 /*yield*/, async_test("get-chats (with filter)", function () { return sdk.api.chats.getSome({ filter: { roomId: room.id } }); }, { onResult: function (c) { return (c === null || c === void 0 ? void 0 : c.length) === 2; } })];
            case 12:
                // this is allowed now
                // await async_test(
                //   `get-chat (without filter)`, 
                //   () => sdk.api.chats.getOne(chat.id), 
                //   { shouldError: true, onError: () => true }
                // )
                // this is allowed now
                // await async_test(
                //   `get-chats (without filter)`, 
                //   () => sdk.api.chats.getSome({}), 
                //   { shouldError: true, onError: () => true }
                // )
                _a.sent();
                return [4 /*yield*/, async_test("get-chats not allowed", function () { return sdk2.api.chats.getSome({ filter: { roomId: room.id } }); }, { shouldError: true, onError: function (e) { return e.message === 'You do not have permission to access this resource'; } })];
            case 13:
                _a.sent();
                return [4 /*yield*/, async_test("get-chats admin", function () { return sdk.api.chats.getSome({ filter: { roomId: room.id } }); }, { onResult: function () { return true; } })
                    // currently disabled endpoint altogether
                    // await async_test(
                    //   `update-chat not allowed`, 
                    //   () => sdk2.api.chats.updateOne(chat.id, { message: 'Hi' }), 
                    //   { shouldError: true, onError: e => e.message === 'You do not have permission to access this resource' }
                    // )
                ];
            case 14:
                _a.sent();
                // currently disabled endpoint altogether
                // await async_test(
                //   `update-chat not allowed`, 
                //   () => sdk2.api.chats.updateOne(chat.id, { message: 'Hi' }), 
                //   { shouldError: true, onError: e => e.message === 'You do not have permission to access this resource' }
                // )
                return [4 /*yield*/, async_test("delete-chat not allowed", function () { return sdk2.api.chats.deleteOne(chat.id); }, handleAnyError)
                    // currently disabled endpoint altogether
                    // await async_test(
                    //   `update-chat can't update roomId`, 
                    //   () => sdk.api.chats.updateOne(chat.id, { roomId: room.id } as any), // cast to any to allow calling with bad argument, but typing should catch this too
                    //   { shouldError: true, onError: e => e.message === 'Error parsing field updates: roomId is not valid for updates' }
                    // )
                ];
            case 15:
                // currently disabled endpoint altogether
                // await async_test(
                //   `update-chat not allowed`, 
                //   () => sdk2.api.chats.updateOne(chat.id, { message: 'Hi' }), 
                //   { shouldError: true, onError: e => e.message === 'You do not have permission to access this resource' }
                // )
                _a.sent();
                // currently disabled endpoint altogether
                // await async_test(
                //   `update-chat can't update roomId`, 
                //   () => sdk.api.chats.updateOne(chat.id, { roomId: room.id } as any), // cast to any to allow calling with bad argument, but typing should catch this too
                //   { shouldError: true, onError: e => e.message === 'Error parsing field updates: roomId is not valid for updates' }
                // )
                return [4 /*yield*/, sdk.api.chat_rooms.deleteOne(room.id)];
            case 16:
                // currently disabled endpoint altogether
                // await async_test(
                //   `update-chat can't update roomId`, 
                //   () => sdk.api.chats.updateOne(chat.id, { roomId: room.id } as any), // cast to any to allow calling with bad argument, but typing should catch this too
                //   { shouldError: true, onError: e => e.message === 'Error parsing field updates: roomId is not valid for updates' }
                // )
                _a.sent();
                return [4 /*yield*/, wait(undefined, 25)];
            case 17:
                _a.sent();
                return [4 /*yield*/, async_test("get-chat (deleted as dependency of room 1)", function () { return sdk.api.chats.getOne(chat.id); }, { shouldError: true, onError: function (e) { return e.message === 'Could not find a record for the given id'; } })];
            case 18:
                _a.sent();
                return [4 /*yield*/, async_test("get-chat (deleted as dependency of room 2)", function () { return sdk.api.chats.getOne(chat2.id); }, { shouldError: true, onError: function (e) { return e.message === 'Could not find a record for the given id'; } })];
            case 19:
                _a.sent();
                return [4 /*yield*/, sdk.api.chat_rooms.createOne({ type: 'internal', userIds: [userId, sdk2.userInfo.id] })];
            case 20:
                sharedRoom = _a.sent();
                return [4 /*yield*/, sdk.api.chats.createOne({ roomId: sharedRoom.id, message: "Hello!", })];
            case 21:
                sharedChat = _a.sent();
                return [4 /*yield*/, sdk2.api.chats.createOne({ roomId: sharedRoom.id, message: "Hello there!", })];
            case 22:
                sharedChat2 = _a.sent();
                return [4 /*yield*/, async_test("get-chat (shared, user1)", function () { return sdk.api.chats.getOne(sharedChat.id); }, { onResult: function (r) { return r.id === sharedChat.id; } })];
            case 23:
                _a.sent();
                return [4 /*yield*/, async_test("get-chat (shared, user2)", function () { return sdk2.api.chats.getOne(sharedChat.id); }, { onResult: function (r) { return r.id === sharedChat.id; } })];
            case 24:
                _a.sent();
                return [4 /*yield*/, async_test("get-chats (shared, user1)", function () { return sdk.api.chats.getSome({ filter: { roomId: sharedRoom.id } }); }, { onResult: function (cs) { return cs.length === 2 && !!cs.find(function (c) { return c.id === sharedChat.id; }) && !!cs.find(function (c) { return c.id === sharedChat2.id; }); } })];
            case 25:
                _a.sent();
                return [4 /*yield*/, async_test("get-chats (shared, user2)", function () { return sdk2.api.chats.getSome({ filter: { roomId: sharedRoom.id } }); }, { onResult: function (cs) { return cs.length === 2 && !!cs.find(function (c) { return c.id === sharedChat.id; }) && !!cs.find(function (c) { return c.id === sharedChat2.id; }); } })
                    // test setNull dependency
                ];
            case 26:
                _a.sent();
                return [4 /*yield*/, sdk.api.chat_rooms.createOne({ type: 'internal', userIds: [userId] })];
            case 27:
                roomNull = _a.sent();
                return [4 /*yield*/, sdk.api.chats.createOne({ roomId: roomNull.id, message: "Hello!" })];
            case 28:
                chatNull = _a.sent();
                return [4 /*yield*/, sdk.api.chats.createOne({ roomId: roomNull.id, message: "Hello...", replyId: chatNull.id })];
            case 29:
                chat2Null = _a.sent();
                return [4 /*yield*/, sdk.api.chats.createOne({ roomId: roomNull.id, message: "Scheduled", sendAt: new Date(Date.now() + 1000 * 60 * 60 * 24) })];
            case 30:
                chatScheduled = _a.sent();
                return [4 /*yield*/, wait(undefined, 2000)]; // should be greater than 1s
            case 31:
                _a.sent(); // should be greater than 1s
                return [4 /*yield*/, sdk.api.chats.updateOne(chatScheduled.id, { sendAt: new Date(0) })]; // trigger scheduled send
            case 32:
                _a.sent(); // trigger scheduled send
                return [4 /*yield*/, wait(undefined, 250)];
            case 33:
                _a.sent();
                return [4 /*yield*/, async_test("Scheduled chat timestamps", function () { return sdk.api.chats.getOne(chatScheduled.id); }, { onResult: function (c) {
                            return !!c.sendAt && new Date(c.sendAt).getTime() === 0
                                && !!c.timestamp && new Date(c.timestamp).getTime() < Date.now()
                                && !!c.timestamp && new Date(c.timestamp).getTime() > Date.now() - 1000 // should be less than delay after chatScheduled
                                // createdAt is only precise to the second but should be different than timestamp
                                && Math.floor(new Date(c.timestamp).getTime() / 1000) !== Math.floor(new Date(c.createdAt).getTime() / 1000);
                        }
                    })];
            case 34:
                _a.sent();
                return [4 /*yield*/, sdk.api.chats.deleteOne(chatNull.id)];
            case 35:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 250)];
            case 36:
                _a.sent();
                return [4 /*yield*/, async_test("get-chat (setNull working)", function () { return sdk.api.chats.getOne(chat2Null.id); }, { onResult: function (c) { return c.replyId === null; } })];
            case 37:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(enduser.id),
                        sdk.api.chat_rooms.deleteOne(enduserRoom.id),
                    ])];
            case 38:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var enduserAccessTests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var email, password, enduser, enduser2, uInfo, originalAuthToken, _loop_1, _a, _b, _c, _i, n, ticketAccessible, ticketInaccessible, hiddenTemplate, shownTemplate, hiddenForm, shownForm, hiddenEvent, shownEvent, attendedEvent, hiddenForum, shownForum;
    var _d, _f, _g, _h, _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                log_header("Enduser Access");
                email = 'enduser@tellescope.com';
                password = 'testpassword';
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: email })];
            case 1:
                enduser = _l.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'hi' + email })];
            case 2:
                enduser2 = _l.sent();
                return [4 /*yield*/, sdk.api.endusers.set_password({ id: enduser.id, password: password }).catch(console.error)];
            case 3:
                _l.sent();
                return [4 /*yield*/, enduserSDK.authenticate(email, password).catch(console.error)];
            case 4:
                _l.sent();
                return [4 /*yield*/, wait(undefined, 1000)]; // wait so that refresh_session generates a new authToken (different timestamp)
            case 5:
                _l.sent(); // wait so that refresh_session generates a new authToken (different timestamp)
                uInfo = enduserSDK.userInfo;
                originalAuthToken = enduserSDK.authToken;
                return [4 /*yield*/, enduserSDK.refresh_session()];
            case 6:
                _l.sent();
                assert(uInfo.id === enduserSDK.userInfo.id, 'userInfo mismatch', 'userInfo id preserved after refresh');
                assert(!!originalAuthToken && !!enduserSDK.authToken && enduserSDK.authToken !== originalAuthToken, 'same authToken after refresh', 'authToken refresh');
                return [4 /*yield*/, async_test("no-enduser-access for different businessId", function () { return enduserSDKDifferentBusinessId.authenticate(email, password); }, { shouldError: true, onError: function (e) { return (e === null || e === void 0 ? void 0 : e.message) === "Login details are invalid"; } })];
            case 7:
                _l.sent();
                _loop_1 = function (n) {
                    var endpoint, model;
                    return __generator(this, function (_m) {
                        switch (_m.label) {
                            case 0:
                                endpoint = url_safe_path(n);
                                model = schema[n];
                                if (n === 'webhooks')
                                    return [2 /*return*/, "continue"]; // no default endpoints implemented
                                if (n === 'form_groups')
                                    return [2 /*return*/, "continue"];
                                if (!(!((_d = model === null || model === void 0 ? void 0 : model.enduserActions) === null || _d === void 0 ? void 0 : _d.read) && (model.defaultActions.read || model.customActions.read))) return [3 /*break*/, 2];
                                return [4 /*yield*/, async_test("no-enduser-access getOne (".concat(endpoint, ")"), function () { return enduserSDK.GET("/v1/".concat(endpoint.substring(0, endpoint.length - 1), "/:id")); }, { shouldError: true, onError: function (e) { return e === 'Unauthenticated' || (e === null || e === void 0 ? void 0 : e.message) === 'This action is not allowed'; } })];
                            case 1:
                                _m.sent();
                                _m.label = 2;
                            case 2:
                                if (!(!((_f = model.enduserActions) === null || _f === void 0 ? void 0 : _f.readMany) && (model.defaultActions.readMany || model.customActions.readMany))) return [3 /*break*/, 4];
                                return [4 /*yield*/, async_test("no-enduser-access getSome (".concat(endpoint, ")"), function () { return enduserSDK.GET("/v1/".concat(endpoint)); }, { shouldError: true, onError: function (e) { return e === 'Unauthenticated' || (e === null || e === void 0 ? void 0 : e.message) === 'This action is not allowed'; } })];
                            case 3:
                                _m.sent();
                                _m.label = 4;
                            case 4:
                                if (!(!((_g = model.enduserActions) === null || _g === void 0 ? void 0 : _g.create) && (model.defaultActions.create || model.customActions.create))) return [3 /*break*/, 6];
                                return [4 /*yield*/, async_test("no-enduser-access createOne (".concat(endpoint, ")"), function () { return enduserSDK.POST("/v1/".concat(endpoint.substring(0, endpoint.length - 1))); }, { shouldError: true, onError: function (e) { return e === 'Unauthenticated' || (e === null || e === void 0 ? void 0 : e.message) === 'This action is not allowed'; } })];
                            case 5:
                                _m.sent();
                                _m.label = 6;
                            case 6:
                                if (!(!((_h = model.enduserActions) === null || _h === void 0 ? void 0 : _h.createMany) && (model.defaultActions.createMany || model.customActions.createMany))) return [3 /*break*/, 8];
                                return [4 /*yield*/, async_test("no-enduser-access createMany (".concat(endpoint, ")"), function () { return enduserSDK.POST("/v1/".concat(endpoint)); }, { shouldError: true, onError: function (e) { return e === 'Unauthenticated' || (e === null || e === void 0 ? void 0 : e.message) === 'This action is not allowed'; } })];
                            case 7:
                                _m.sent();
                                _m.label = 8;
                            case 8:
                                if (!(!((_j = model.enduserActions) === null || _j === void 0 ? void 0 : _j.update) && (model.defaultActions.update || model.customActions.update))) return [3 /*break*/, 10];
                                return [4 /*yield*/, async_test("no-enduser-access update (".concat(endpoint, ")"), function () { return enduserSDK.PATCH("/v1/".concat(endpoint.substring(0, endpoint.length - 1), "/:id")); }, { shouldError: true, onError: function (e) { return e === 'Unauthenticated' || (e === null || e === void 0 ? void 0 : e.message) === 'This action is not allowed'; } })];
                            case 9:
                                _m.sent();
                                _m.label = 10;
                            case 10:
                                if (!(!((_k = model.enduserActions) === null || _k === void 0 ? void 0 : _k.delete) && (model.defaultActions.delete || model.customActions.delete))) return [3 /*break*/, 12];
                                return [4 /*yield*/, async_test("no-enduser-access delete (".concat(endpoint, ")"), function () { return enduserSDK.DELETE("/v1/".concat(endpoint.substring(0, endpoint.length - 1), "/:id")); }, { shouldError: true, onError: function (e) { return e === 'Unauthenticated' || (e === null || e === void 0 ? void 0 : e.message) === 'This action is not allowed'; } })];
                            case 11:
                                _m.sent();
                                _m.label = 12;
                            case 12: return [2 /*return*/];
                        }
                    });
                };
                _a = schema;
                _b = [];
                for (_c in _a)
                    _b.push(_c);
                _i = 0;
                _l.label = 8;
            case 8:
                if (!(_i < _b.length)) return [3 /*break*/, 11];
                _c = _b[_i];
                if (!(_c in _a)) return [3 /*break*/, 10];
                n = _c;
                return [5 /*yield**/, _loop_1(n)];
            case 9:
                _l.sent();
                _l.label = 10;
            case 10:
                _i++;
                return [3 /*break*/, 8];
            case 11: return [4 /*yield*/, async_test("enduser can find self", function () { return enduserSDK.api.endusers.getOne(enduser.id); }, { onResult: function (e) { return e.id === enduser.id; } })];
            case 12:
                _l.sent();
                return [4 /*yield*/, async_test("enduser can update self", function () { return enduserSDK.api.endusers.updateOne(enduser.id, { fname: "Sebastian", lname: "Coates" }); }, { onResult: function (e) { return e.id === enduser.id && e.fname === 'Sebastian' && e.lname === "Coates"; } })];
            case 13:
                _l.sent();
                return [4 /*yield*/, async_test("enduser can't update other enduser", function () { return enduserSDK.api.endusers.updateOne(enduser2.id, { fname: "Shouldn't Work" }); }, { shouldError: true, onError: function (e) { return e.message === "Endusers may only update their own profile"; } })];
            case 14:
                _l.sent();
                return [4 /*yield*/, sdk.api.tickets.createOne({ enduserId: enduser.id, title: "Accessible ticket" })];
            case 15:
                ticketAccessible = _l.sent();
                return [4 /*yield*/, sdk.api.tickets.createOne({ enduserId: enduser2.id, title: "Inaccessible ticket" })];
            case 16:
                ticketInaccessible = _l.sent();
                return [4 /*yield*/, async_test("enduser cannot create ticket for another enduser", function () { return enduserSDK.api.tickets.createOne({ enduserId: sdk.userInfo.id, title: "Error on Creation" }); }, { shouldError: true, onError: function (e) { return !!e.message; } })];
            case 17:
                _l.sent();
                return [4 /*yield*/, async_test("enduser-access default, no access constraints, matching enduserId", function () { return enduserSDK.api.tickets.getOne(ticketAccessible.id); }, { onResult: function (t) { return t.id === ticketAccessible.id; } })];
            case 18:
                _l.sent();
                return [4 /*yield*/, async_test("no-enduser-access default, no access constraints, non-matching enduserId", function () { return enduserSDK.api.tickets.getOne(ticketInaccessible.id); }, { shouldError: true, onError: function (e) { return e.message.startsWith("Could not find"); } })];
            case 19:
                _l.sent();
                return [4 /*yield*/, async_test("no-enduser-access default, no access constraints, get many", function () { return enduserSDK.api.tickets.getSome(); }, { onResult: function (ts) { return ts.length === 1; } })];
            case 20:
                _l.sent();
                return [4 /*yield*/, sdk.api.calendar_event_templates.createOne({
                        title: "hidden", durationInMinutes: 5,
                        enableSelfScheduling: false,
                    })];
            case 21:
                hiddenTemplate = _l.sent();
                return [4 /*yield*/, sdk.api.calendar_event_templates.createOne({
                        title: "shown", durationInMinutes: 5,
                        enableSelfScheduling: true,
                    })];
            case 22:
                shownTemplate = _l.sent();
                return [4 /*yield*/, async_test("Filter calendar event templates", function () { return enduserSDK.api.calendar_event_templates.getSome(); }, { onResult: function (vs) { return vs.length === 1 && !vs.find(function (v) { return v.id === hiddenTemplate.id; }); } })];
            case 23:
                _l.sent();
                return [4 /*yield*/, sdk.api.forms.createOne({
                        title: "hidden", allowPortalSubmission: false,
                    })];
            case 24:
                hiddenForm = _l.sent();
                return [4 /*yield*/, sdk.api.forms.createOne({
                        title: "shown", allowPortalSubmission: true,
                    })];
            case 25:
                shownForm = _l.sent();
                return [4 /*yield*/, async_test("Filter forms", function () { return enduserSDK.api.forms.getSome(); }, { onResult: function (vs) { return vs.length === 1 && !vs.find(function (v) { return v.id === hiddenForm.id; }); } })];
            case 26:
                _l.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({
                        title: "hidden", startTimeInMS: Date.now(), durationInMinutes: 5,
                    })];
            case 27:
                hiddenEvent = _l.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({
                        title: "shown", startTimeInMS: Date.now(), durationInMinutes: 5,
                        publicRead: true,
                    })];
            case 28:
                shownEvent = _l.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({
                        title: "shown", startTimeInMS: Date.now(), durationInMinutes: 5,
                        attendees: [{ id: enduser.id, type: 'enduser' }],
                    })];
            case 29:
                attendedEvent = _l.sent();
                return [4 /*yield*/, async_test("Filter calendar events", function () { return enduserSDK.api.calendar_events.getSome(); }, { onResult: function (vs) { return vs.length === 2 && !vs.find(function (v) { return v.id === hiddenEvent.id; }); } })];
            case 30:
                _l.sent();
                return [4 /*yield*/, sdk.api.forums.createOne({ title: "Hidden Forum", publicRead: false })];
            case 31:
                hiddenForum = _l.sent();
                return [4 /*yield*/, sdk.api.forums.createOne({ title: "Forum", publicRead: true })];
            case 32:
                shownForum = _l.sent();
                return [4 /*yield*/, async_test("Filter forums", function () { return enduserSDK.api.forums.getSome(); }, { onResult: function (vs) { return vs.length === 1 && !vs.find(function (v) { return v.id === hiddenForum.id; }); } })];
            case 33:
                _l.sent();
                return [4 /*yield*/, sdk.api.tickets.deleteOne(ticketAccessible.id)];
            case 34:
                _l.sent();
                return [4 /*yield*/, sdk.api.tickets.deleteOne(ticketInaccessible.id)];
            case 35:
                _l.sent();
                return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id)];
            case 36:
                _l.sent();
                return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser2.id)];
            case 37:
                _l.sent();
                return [4 /*yield*/, sdk.api.calendar_event_templates.deleteOne(hiddenTemplate.id)];
            case 38:
                _l.sent();
                return [4 /*yield*/, sdk.api.calendar_event_templates.deleteOne(shownTemplate.id)];
            case 39:
                _l.sent();
                return [4 /*yield*/, sdk.api.forms.deleteOne(hiddenForm.id)];
            case 40:
                _l.sent();
                return [4 /*yield*/, sdk.api.forms.deleteOne(shownForm.id)];
            case 41:
                _l.sent();
                return [4 /*yield*/, sdk.api.calendar_events.deleteOne(hiddenEvent.id)];
            case 42:
                _l.sent();
                return [4 /*yield*/, sdk.api.calendar_events.deleteOne(shownEvent.id)];
            case 43:
                _l.sent();
                return [4 /*yield*/, sdk.api.calendar_events.deleteOne(attendedEvent.id)];
            case 44:
                _l.sent();
                return [4 /*yield*/, sdk.api.forums.deleteOne(hiddenForum.id)];
            case 45:
                _l.sent();
                return [4 /*yield*/, sdk.api.forums.deleteOne(shownForum.id)];
            case 46:
                _l.sent();
                return [2 /*return*/];
        }
    });
}); };
var files_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var enduser, buff, _a, presignedUpload, file, _b, presignedNonEnduser, fileNonEnduser, presigned2, downloadURL, downloaded, cachedURL, urlForEnduser;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                log_header("Files");
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: email })];
            case 1:
                enduser = _c.sent();
                return [4 /*yield*/, sdk.api.endusers.set_password({ id: enduser.id, password: password }).catch(console.error)];
            case 2:
                _c.sent();
                return [4 /*yield*/, enduserSDK.authenticate(email, password).catch(console.error)];
            case 3:
                _c.sent();
                return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)]; // to use new role, handle logout on role change
            case 4:
                _c.sent(); // to use new role, handle logout on role change
                buff = buffer.Buffer.from('test file data');
                return [4 /*yield*/, async_test("non admin can prepare file upload", function () { return sdkNonAdmin.api.files.prepare_file_upload({
                        name: 'Test File', size: buff.byteLength, type: 'text/plain'
                    }); }, { onResult: function (t) { return true; } })];
            case 5:
                _c.sent();
                return [4 /*yield*/, sdk.api.files.prepare_file_upload({
                        name: 'Test Private', size: buff.byteLength, type: 'text/plain', enduserId: enduser.id,
                    })];
            case 6:
                _a = _c.sent(), presignedUpload = _a.presignedUpload, file = _a.file;
                return [4 /*yield*/, sdk.api.files.prepare_file_upload({
                        name: 'Test Private (no enduser)', size: buff.byteLength, type: 'text/plain',
                    })];
            case 7:
                _b = _c.sent(), presignedNonEnduser = _b.presignedUpload, fileNonEnduser = _b.file;
                return [4 /*yield*/, sdk.api.files.prepare_file_upload({
                        name: 'Test Public', size: buff.byteLength, type: 'text/plain',
                        enduserId: enduser.id,
                        publicRead: true,
                        publicName: 'public',
                    })];
            case 8:
                presigned2 = (_c.sent()).presignedUpload;
                return [4 /*yield*/, sdk.UPLOAD(
                    // @ts-ignore
                    presignedUpload, buff)];
            case 9:
                _c.sent();
                return [4 /*yield*/, sdk.UPLOAD(
                    // @ts-ignore
                    presignedNonEnduser, buff)];
            case 10:
                _c.sent();
                return [4 /*yield*/, sdk.UPLOAD(
                    // @ts-ignore
                    presigned2, buff)];
            case 11:
                _c.sent();
                return [4 /*yield*/, async_test("Files associated with enduser on prepare_file_upload", function () { return sdk.api.files.getSome({ filter: { enduserId: enduser.id } }); }, { onResult: function (fs) { return fs.length === 2; } })];
            case 12:
                _c.sent();
                return [4 /*yield*/, sdk.api.files.file_download_URL({ secureName: file.secureName })];
            case 13:
                downloadURL = (_c.sent()).downloadURL;
                return [4 /*yield*/, sdk.DOWNLOAD(downloadURL)];
            case 14:
                downloaded = _c.sent();
                assert(downloaded === buff.toString(), 'downloaded file does not match uploaded file', 'upload, download comparison');
                return [4 /*yield*/, sdk.api.files.file_download_URL({ secureName: file.secureName })];
            case 15:
                cachedURL = (_c.sent()).downloadURL;
                assert(downloadURL === cachedURL, 'cache download url failed', 'download url cache');
                return [4 /*yield*/, enduserSDK.api.files.file_download_URL({ secureName: file.secureName })];
            case 16:
                urlForEnduser = (_c.sent()).downloadURL;
                assert(downloadURL === urlForEnduser, 'failed to get download url for enduser', 'download url for enduser');
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(enduser.id),
                    ])];
            case 17:
                _c.sent();
                return [4 /*yield*/, wait(undefined, 2000)]; // wait for files to be deleted as side effect
            case 18:
                _c.sent(); // wait for files to be deleted as side effect
                return [4 /*yield*/, async_test("Files cleaned up as side effect of deleting enduser", function () { return sdk.api.files.getSome({ filter: { enduserId: enduser.id } }); }, { onResult: function (fs) { return fs.length === 0; } })];
            case 19:
                _c.sent();
                return [4 /*yield*/, async_test("Non-enduser file is left", function () { return sdk.api.files.getSome(); }, { onResult: function (fs) { return fs.length > 0; } })
                    // cleanup other file
                ];
            case 20:
                _c.sent();
                // cleanup other file
                return [4 /*yield*/, Promise.all([
                        sdk.api.files.deleteOne(fileNonEnduser.id),
                    ])];
            case 21:
                // cleanup other file
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
var enduser_session_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var email, password, enduser, users, form, formSession, formEnduserSession, template, bookingSession, bookingEnduserSession;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Enduser Session");
                email = 'enduser@tellescope.com';
                password = 'testpassword';
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: email })];
            case 1:
                enduser = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.set_password({ id: enduser.id, password: password }).catch(console.error)];
            case 2:
                _a.sent();
                return [4 /*yield*/, enduserSDK.authenticate(email, password).catch(console.error)];
            case 3:
                _a.sent();
                return [4 /*yield*/, enduserSDK.api.users.display_info()];
            case 4:
                users = _a.sent();
                assert(users && users.length > 0, 'No users returned', 'Get user display info for enduser');
                return [4 /*yield*/, async_test("Enduser session refresh on authenticated session includes enduser info", function () { return enduserSDK.refresh_session(); }, { onResult: function (_a) {
                            var authToken = _a.authToken, enduser = _a.enduser;
                            return !!authToken && !!enduser.email;
                        } })];
            case 5:
                _a.sent();
                return [4 /*yield*/, async_test("Enduser session refresh on authenticated session includes enduser info (2x)", function () { return enduserSDK.refresh_session(); }, { onResult: function (_a) {
                            var authToken = _a.authToken, enduser = _a.enduser;
                            return !!authToken && !!enduser.email;
                        } })];
            case 6:
                _a.sent();
                return [4 /*yield*/, sdk.api.forms.createOne({ title: 'session test', allowPublicURL: true })];
            case 7:
                form = _a.sent();
                return [4 /*yield*/, sdk.api.form_fields.createOne({ formId: form.id, previousFields: [{ type: 'root', info: {} }], title: 'session test', type: 'string' })];
            case 8:
                _a.sent();
                return [4 /*yield*/, new EnduserSession({ businessId: form.businessId, host: host }).api.form_responses.session_for_public_form({
                        formId: form.id,
                        businessId: form.businessId,
                        email: enduser.email,
                        phone: '5555555555',
                        fname: 'session',
                        lname: 'test',
                    })];
            case 9:
                formSession = _a.sent();
                formEnduserSession = new EnduserSession({ authToken: formSession.authToken, businessId: form.businessId, host: host });
                return [4 /*yield*/, async_test("Enduser session refresh does not leak info for public form session", function () { return formEnduserSession.refresh_session(); }, { onResult: function (_a) {
                            var authToken = _a.authToken, enduser = _a.enduser;
                            return !!authToken && !enduser.email;
                        } })];
            case 10:
                _a.sent();
                return [4 /*yield*/, async_test("2x Enduser session refresh does not leak info for public form session", function () { return formEnduserSession.refresh_session(); }, { onResult: function (_a) {
                            var authToken = _a.authToken, enduser = _a.enduser;
                            return !!authToken && !enduser.email;
                        } })];
            case 11:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_event_templates.createOne({ title: 'session test', durationInMinutes: 15 })];
            case 12:
                template = _a.sent();
                return [4 /*yield*/, new EnduserSession({ businessId: form.businessId, host: host }).api.calendar_events.session_for_public_appointment_booking({
                        businessId: form.businessId,
                        email: enduser.email,
                        phone: '5555555555',
                        calendarEventTemplateId: template.id,
                        dateOfBirth: '12-20-1997',
                        fname: 'session',
                        lname: 'test',
                    })];
            case 13:
                bookingSession = _a.sent();
                bookingEnduserSession = new EnduserSession({ authToken: bookingSession.authToken, businessId: form.businessId, host: host });
                return [4 /*yield*/, async_test("Enduser session refresh does not leak info for public booking session", function () { return bookingEnduserSession.refresh_session(); }, { onResult: function (_a) {
                            var authToken = _a.authToken, enduser = _a.enduser;
                            return !!authToken && !enduser.email;
                        } })];
            case 14:
                _a.sent();
                return [4 /*yield*/, async_test("2x Enduser session refresh does not leak info for public booking session", function () { return bookingEnduserSession.refresh_session(); }, { onResult: function (_a) {
                            var authToken = _a.authToken, enduser = _a.enduser;
                            return !!authToken && !enduser.email;
                        } })];
            case 15:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(enduser.id),
                        sdk.api.forms.deleteOne(form.id),
                        sdk.api.calendar_event_templates.deleteOne(template.id),
                    ])];
            case 16:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var users_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var randomFieldValue, randomFieldNumber, created;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Users Tests");
                randomFieldValue = crypto.randomBytes(32).toString('hex').toUpperCase() // uppercase so name parsing doesn't cause case change
                ;
                randomFieldNumber = Math.random();
                return [4 /*yield*/, sdk.api.users.createOne({ email: 'created@tellescope.com', verifiedEmail: true })];
            case 1:
                created = _a.sent();
                assert(created.verifiedEmail, 'user not created with verified email', 'user created, with verifiedEmail');
                return [4 /*yield*/, sdk.api.users.deleteOne(created.id)
                    /* Update user tests */
                ];
            case 2:
                _a.sent();
                /* Update user tests */
                return [4 /*yield*/, async_test("update user (non-admin, other user)", function () { return sdkNonAdmin.api.users.updateOne(sdk.userInfo.id, { fname: randomFieldValue }); }, handleAnyError)];
            case 3:
                /* Update user tests */
                _a.sent();
                return [4 /*yield*/, async_test("verify no update", function () { return sdk.api.users.getOne(sdk.userInfo.id); }, { onResult: function (u) { return u.fname !== randomFieldValue; } })];
            case 4:
                _a.sent();
                return [4 /*yield*/, async_test("update user (non-admin, self)", function () { return sdkNonAdmin.api.users.updateOne(sdkNonAdmin.userInfo.id, { fname: 'Updated' }); }, { onResult: function (u) { return u.id === sdkNonAdmin.userInfo.id && u.fname === "Updated"; } })];
            case 5:
                _a.sent();
                return [4 /*yield*/, async_test("verify user update with admin get", function () { return sdk.api.users.getOne(sdkNonAdmin.userInfo.id); }, { onResult: function (u) { return u.id === sdkNonAdmin.userInfo.id && u.fname === "Updated"; } })
                    // reset fname to "Non" if this test throws, otherwise will falsely pass on next run
                    // NOT Supported behavior any more
                    // assert(sdkNonAdmin.userInfo.fname === 'Updated', 'refresh_session not called on self after update', 'sdk updated on user update')
                ];
            case 6:
                _a.sent();
                // reset fname to "Non" if this test throws, otherwise will falsely pass on next run
                // NOT Supported behavior any more
                // assert(sdkNonAdmin.userInfo.fname === 'Updated', 'refresh_session not called on self after update', 'sdk updated on user update')
                return [4 /*yield*/, async_test("update user (admin, other user)", function () { return sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { fname: 'Non' }); }, // change back
                    { onResult: function (u) { return u.id === sdkNonAdmin.userInfo.id && u.fname === "Non"; } })
                    // sdkNonAdmin.userInfo.fname = 'Non' // update back in sdk instance as well
                ];
            case 7:
                // reset fname to "Non" if this test throws, otherwise will falsely pass on next run
                // NOT Supported behavior any more
                // assert(sdkNonAdmin.userInfo.fname === 'Updated', 'refresh_session not called on self after update', 'sdk updated on user update')
                _a.sent();
                // sdkNonAdmin.userInfo.fname = 'Non' // update back in sdk instance as well
                return [4 /*yield*/, async_test("verify user update with admin get", function () { return sdk.api.users.getOne(sdkNonAdmin.userInfo.id); }, { onResult: function (u) { return u.id === sdkNonAdmin.userInfo.id && u.fname === "Non"; } })];
            case 8:
                // sdkNonAdmin.userInfo.fname = 'Non' // update back in sdk instance as well
                _a.sent();
                return [4 /*yield*/, async_test("update user (custom fields)", function () { return sdk.api.users.updateOne(sdk.userInfo.id, { fields: { boolean: true, f1: randomFieldValue, f2: randomFieldNumber, f3: { object: randomFieldValue } } }); }, // change back
                    { onResult: function (u) { var _a, _b, _c; return u.id === sdk.userInfo.id && ((_a = u.fields) === null || _a === void 0 ? void 0 : _a.f1) === randomFieldValue && ((_b = u.fields) === null || _b === void 0 ? void 0 : _b.f2) === randomFieldNumber && ((_c = u.fields) === null || _c === void 0 ? void 0 : _c.f3).object == randomFieldValue; } })
                    // sdkNonAdmin.userInfo.fname = 'Non' // update back in sdk instance as well
                ];
            case 9:
                _a.sent();
                // sdkNonAdmin.userInfo.fname = 'Non' // update back in sdk instance as well
                return [4 /*yield*/, async_test("verify user update (custom fields)", function () { return sdk.api.users.getOne(sdk.userInfo.id); }, { onResult: function (u) { var _a, _b, _c; return u.id === sdk.userInfo.id && ((_a = u.fields) === null || _a === void 0 ? void 0 : _a.f1) === randomFieldValue && ((_b = u.fields) === null || _b === void 0 ? void 0 : _b.f2) === randomFieldNumber && ((_c = u.fields) === null || _c === void 0 ? void 0 : _c.f3).object == randomFieldValue; } })];
            case 10:
                // sdkNonAdmin.userInfo.fname = 'Non' // update back in sdk instance as well
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var calendar_events_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, authToken, enduser, enduserSDK, event, eventWithEnduser, publicEvent;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                log_header("Calendar Events");
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: email })];
            case 1:
                id = (_b.sent()).id;
                return [4 /*yield*/, sdk.api.endusers.generate_auth_token({ id: id })];
            case 2:
                _a = _b.sent(), authToken = _a.authToken, enduser = _a.enduser;
                enduserSDK = new EnduserSession({ host: host, authToken: authToken, enduser: enduser, businessId: sdk.userInfo.businessId });
                return [4 /*yield*/, sdk.api.calendar_events.createOne({
                        title: "Event", durationInMinutes: 30, startTimeInMS: Date.now()
                    })];
            case 3:
                event = _b.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({
                        title: "Event with Enduser", durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ id: id, type: 'enduser' }]
                    })];
            case 4:
                eventWithEnduser = _b.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({
                        title: "Event", durationInMinutes: 30, startTimeInMS: Date.now(), publicRead: true,
                    })];
            case 5:
                publicEvent = _b.sent();
                return [4 /*yield*/, async_test("user can access own event", function () { return sdk.api.calendar_events.getOne(event.id); }, { onResult: function (e) { return e && e.id === event.id; } })];
            case 6:
                _b.sent();
                return [4 /*yield*/, async_test("user can access public event", function () { return sdk.api.calendar_events.getOne(publicEvent.id); }, { onResult: function (e) { return e && e.id === publicEvent.id; } })
                    // TODO: implement support for publicRead for users, 
                    // await async_test(
                    //   `non-creator, non-admin user can access public event`,
                    //   () => sdkNonAdmin.api.calendar_events.getOne(publicEvent.id),
                    //   { onResult: e => e && e.id === event.id }
                    // ) 
                ];
            case 7:
                _b.sent();
                // TODO: implement support for publicRead for users, 
                // await async_test(
                //   `non-creator, non-admin user can access public event`,
                //   () => sdkNonAdmin.api.calendar_events.getOne(publicEvent.id),
                //   { onResult: e => e && e.id === event.id }
                // ) 
                return [4 /*yield*/, async_test("user can access own events and public events", function () { return sdk.api.calendar_events.getSome(); }, { onResult: function (es) { return es && es.length === 3; } })];
            case 8:
                // TODO: implement support for publicRead for users, 
                // await async_test(
                //   `non-creator, non-admin user can access public event`,
                //   () => sdkNonAdmin.api.calendar_events.getOne(publicEvent.id),
                //   { onResult: e => e && e.id === event.id }
                // ) 
                _b.sent();
                return [4 /*yield*/, async_test("user can access own event with enduser attendee", function () { return sdk.api.calendar_events.getOne(eventWithEnduser.id); }, { onResult: function (e) { return e && e.id === eventWithEnduser.id; } })];
            case 9:
                _b.sent();
                return [4 /*yield*/, async_test("enduser can't access uninvited event", function () { return enduserSDK.api.calendar_events.getOne(event.id); }, { shouldError: true, onError: function (e) { return e.message === "Could not find a record for the given id"; } })];
            case 10:
                _b.sent();
                return [4 /*yield*/, async_test("enduser can access event as attendee", function () { return enduserSDK.api.calendar_events.getOne(eventWithEnduser.id); }, { onResult: function (e) { return e && e.id === eventWithEnduser.id; } })];
            case 11:
                _b.sent();
                return [4 /*yield*/, async_test("enduser can access public event", function () { return enduserSDK.api.calendar_events.getOne(publicEvent.id); }, { onResult: function (e) { return e && e.id === publicEvent.id; } })];
            case 12:
                _b.sent();
                return [4 /*yield*/, async_test("enduser can access own events and public events", function () { return enduserSDK.api.calendar_events.getSome(); }, { onResult: function (es) { return es && es.length === 2; } })];
            case 13:
                _b.sent();
                return [4 /*yield*/, async_test("enduser cannot update publicEvent ", function () { return enduserSDK.api.calendar_events.updateOne(publicEvent.id, { title: "CHANGED " }); }, handleAnyError)];
            case 14:
                _b.sent();
                return [4 /*yield*/, async_test("enduser cannot delete publicEvent", function () { return enduserSDK.api.calendar_events.deleteOne(publicEvent.id); }, handleAnyError)];
            case 15:
                _b.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(enduser.id),
                        sdk.api.calendar_events.deleteOne(event.id),
                        sdk.api.calendar_events.deleteOne(eventWithEnduser.id),
                        sdk.api.calendar_events.deleteOne(publicEvent.id),
                    ])];
            case 16:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
var formEventTests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var enduser, journey, form, field, triggerStep, acNoStep, acStep, testResponse, formResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Form Events");
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'deletemeee@tellescope.com' })];
            case 1:
                enduser = _a.sent();
                return [4 /*yield*/, sdk.api.journeys.createOne({ title: 'test journey ' })];
            case 2:
                journey = _a.sent();
                return [4 /*yield*/, sdk.api.forms.createOne({ title: 'test form' })];
            case 3:
                form = _a.sent();
                return [4 /*yield*/, sdk.api.form_fields.createOne({
                        formId: form.id,
                        title: 'question',
                        type: 'string',
                        previousFields: [{ type: 'root', info: {} }]
                    })];
            case 4:
                field = _a.sent();
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [{ type: 'onJourneyStart', info: {} }],
                        // in practice, this would send a form, so that the next step(s) could handle the response
                        // but we don't want to send emails in testing, and can still attach this Id to a form response to test a trigger
                        action: {
                            type: 'setEnduserStatus',
                            info: { status: 'placeholder' },
                        },
                    })];
            case 5:
                triggerStep = _a.sent();
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [{
                                type: 'formResponse',
                                info: { automationStepId: triggerStep.id }
                            }],
                        action: {
                            type: 'setEnduserStatus',
                            info: { status: 'placeholder' },
                        },
                    })];
            case 6:
                _a.sent();
                return [4 /*yield*/, sdk.api.form_responses.prepare_form_response({ formId: form.id, enduserId: enduser.id })];
            case 7:
                acNoStep = (_a.sent()).accessCode;
                return [4 /*yield*/, sdk.api.form_responses.prepare_form_response({ formId: form.id, enduserId: enduser.id })];
            case 8:
                acStep = (_a.sent()).accessCode;
                testResponse = {
                    answer: {
                        type: 'string',
                        value: 'answer'
                    },
                    fieldId: field.id,
                    fieldTitle: field.title,
                };
                return [4 /*yield*/, sdk.api.form_responses.submit_form_response({ accessCode: acNoStep, responses: [testResponse] })];
            case 9:
                formResponse = (_a.sent()).formResponse;
                assert(objects_equivalent(formResponse.responses, [testResponse]), 'bad form resonse returned', 'form response returned correctly');
                return [4 /*yield*/, sdk.api.form_responses.submit_form_response({ accessCode: acStep, automationStepId: triggerStep.id, responses: [testResponse] })];
            case 10:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 250)]; // allow background creation with generous pause
            case 11:
                _a.sent(); // allow background creation with generous pause
                return [4 /*yield*/, async_test("Without automation stepId, form response handler is not triggered", function () { return sdk.api.automated_actions.getSome(); }, { onResult: function (steps) { return steps.length === 1; } /* NOT 2 or more */ })];
            case 12:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.forms.deleteOne(form.id),
                        sdk.api.journeys.deleteOne(journey.id),
                        sdk.api.endusers.deleteOne(enduser.id)
                    ])];
            case 13:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var ticketEventTests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var testCloseReasons, enduser, enduserWithTeam, journey, nullJourney, root, nullRoot, createStep, ticket, ticketNull;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                log_header("Ticket Events");
                testCloseReasons = ['Yes', 'No', 'Maybe'];
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'deletemeee@tellescope.com' })];
            case 1:
                enduser = _c.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'deleteme2@tellescope.com', assignedTo: [sdkNonAdmin.userInfo.id] })];
            case 2:
                enduserWithTeam = _c.sent();
                return [4 /*yield*/, sdk.api.journeys.createOne({ title: 'test journey with completion options' })];
            case 3:
                journey = _c.sent();
                return [4 /*yield*/, sdk.api.journeys.createOne({ title: 'test journey null' })];
            case 4:
                nullJourney = _c.sent();
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [{ type: 'onJourneyStart', info: {} }],
                        action: {
                            type: 'createTicket',
                            info: {
                                title: 'close reasons tests',
                                assignmentStrategy: {
                                    type: 'care-team-random',
                                    info: {},
                                },
                                closeReasons: testCloseReasons,
                                defaultAssignee: sdk.userInfo.id,
                            },
                        },
                    })];
            case 5:
                root = _c.sent();
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        journeyId: nullJourney.id,
                        events: [{ type: 'onJourneyStart', info: {} }],
                        action: {
                            type: 'createTicket',
                            info: {
                                title: 'null test',
                                assignmentStrategy: {
                                    type: 'care-team-random',
                                    info: {},
                                },
                                closeReasons: [],
                                defaultAssignee: sdk.userInfo.id,
                            },
                        },
                    })];
            case 6:
                nullRoot = _c.sent();
                createStep = function (journeyId, automationStepId, closedForReason) { return (sdk.api.automation_steps.createOne({
                    journeyId: journeyId,
                    events: [{ type: 'ticketCompleted', info: { automationStepId: automationStepId, closedForReason: closedForReason, } }],
                    action: { type: 'setEnduserStatus', info: { status: closedForReason !== null && closedForReason !== void 0 ? closedForReason : 'Null' }, },
                })); };
                return [4 /*yield*/, createStep(nullJourney.id, nullRoot.id)];
            case 7:
                _c.sent();
                return [4 /*yield*/, createStep(nullJourney.id, nullRoot.id, testCloseReasons[0])];
            case 8:
                _c.sent();
                return [4 /*yield*/, createStep(nullJourney.id, nullRoot.id, testCloseReasons[1])];
            case 9:
                _c.sent();
                return [4 /*yield*/, createStep(nullJourney.id, nullRoot.id, testCloseReasons[2])];
            case 10:
                _c.sent();
                return [4 /*yield*/, createStep(journey.id, root.id)];
            case 11:
                _c.sent();
                return [4 /*yield*/, createStep(journey.id, root.id, testCloseReasons[0])];
            case 12:
                _c.sent();
                return [4 /*yield*/, createStep(journey.id, root.id, testCloseReasons[1])];
            case 13:
                _c.sent();
                return [4 /*yield*/, createStep(journey.id, root.id, testCloseReasons[2])];
            case 14:
                _c.sent();
                return [4 /*yield*/, sdk.api.endusers.updateOne(enduser.id, { journeys: (_a = {}, _a[journey.id] = 'Added', _a) })];
            case 15:
                _c.sent();
                return [4 /*yield*/, sdk.api.endusers.updateOne(enduserWithTeam.id, { journeys: (_b = {}, _b[nullJourney.id] = 'Added (Null)', _b) })];
            case 16:
                _c.sent();
                return [4 /*yield*/, async_test("Tickets automatically created", function () { return pollForResults(sdk.api.tickets.getSome, function (tickets) { return (tickets === null || tickets === void 0 ? void 0 : tickets.length) === 2; }, 500, 15); }, passOnAnyResult)];
            case 17:
                _c.sent();
                return [4 /*yield*/, async_test("Ticket for enduser, default assignment, testCloseReasons", function () { return sdk.api.tickets.getSome({ filter: { enduserId: enduser.id } }); }, { onResult: function (tickets) {
                            var _a;
                            return (tickets.length === 1
                                && ((_a = tickets[0].closeReasons) === null || _a === void 0 ? void 0 : _a.length) === 3
                                && tickets[0].owner === sdk.userInfo.id);
                        } })];
            case 18:
                _c.sent();
                return [4 /*yield*/, sdk.api.tickets.getOne({ enduserId: enduser.id })];
            case 19:
                ticket = _c.sent();
                return [4 /*yield*/, async_test("Ticket for enduser, care team assignment, no reasons", function () { return sdk.api.tickets.getSome({ filter: { enduserId: enduserWithTeam.id } }); }, { onResult: function (tickets) {
                            var _a;
                            return tickets.length === 1
                                && ((_a = tickets[0].closeReasons) === null || _a === void 0 ? void 0 : _a.length) === 0
                                && tickets[0].owner === sdkNonAdmin.userInfo.id;
                        }
                    })];
            case 20:
                _c.sent();
                return [4 /*yield*/, sdk.api.tickets.getOne({ enduserId: enduserWithTeam.id })];
            case 21:
                ticketNull = _c.sent();
                return [4 /*yield*/, sdk.api.tickets.updateOne(ticket.id, { closedForReason: 'Maybe', closedAt: new Date() })];
            case 22:
                _c.sent();
                return [4 /*yield*/, sdk.api.tickets.updateOne(ticketNull.id, { closedAt: new Date() })];
            case 23:
                _c.sent();
                return [4 /*yield*/, wait(undefined, 250)]; // wait for actions to be automatically created
            case 24:
                _c.sent(); // wait for actions to be automatically created
                return [4 /*yield*/, async_test("Automated actions for handle ticket created", function () { return sdk.api.automated_actions.getSome(); }, { onResult: (function (actions) { return (actions === null || actions === void 0 ? void 0 : actions.length) === 4 // ticket creations + ticket completions = 2 + 2
                            && (!!actions.find(function (a) {
                                return a.event.type === 'ticketCompleted'
                                    && a.enduserId === enduser.id
                                    && a.action.type === 'setEnduserStatus'
                                    && a.action.info.status === 'Maybe';
                            } // maybe branch
                            ))
                            && (!!actions.find(function (a) {
                                return a.event.type === 'ticketCompleted'
                                    && a.enduserId === enduserWithTeam.id
                                    && a.action.type === 'setEnduserStatus'
                                    && a.action.info.status === 'Null';
                            } // null branch when completed without closedForReason
                            )); }) })];
            case 25:
                _c.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.journeys.deleteOne(journey.id),
                        sdk.api.journeys.deleteOne(nullJourney.id),
                        sdk.api.endusers.deleteOne(enduser.id),
                        sdk.api.endusers.deleteOne(enduserWithTeam.id),
                    ])];
            case 26:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
var removeFromJourneyTests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var journey, enduser, TEST_DELAY, step;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                log_header("Remove from Journey");
                return [4 /*yield*/, sdk.api.journeys.createOne({ title: 'test journey' })];
            case 1:
                journey = _b.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'test@tellescope.com' })];
            case 2:
                enduser = _b.sent();
                TEST_DELAY = 1000;
                return [4 /*yield*/, (sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [{ type: 'onJourneyStart', info: {} }],
                        action: { type: 'setEnduserStatus', info: { status: 'Root' }, },
                    }))];
            case 3:
                step = _b.sent();
                return [4 /*yield*/, (sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [{ type: 'afterAction', info: {
                                    automationStepId: step.id,
                                    delay: TEST_DELAY / 1000,
                                    delayInMS: TEST_DELAY,
                                    unit: 'Seconds',
                                } }],
                        action: { type: 'setEnduserStatus', info: { status: 'Delayed Step' }, },
                    }))
                    // test empty events step doesn't get triggered or cause errors
                ];
            case 4:
                _b.sent();
                // test empty events step doesn't get triggered or cause errors
                return [4 /*yield*/, (sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [],
                        action: { type: 'setEnduserStatus', info: { status: 'INVARIANT_VIOLATION' }, },
                    }))
                    // add to journey to trigger initial action
                ];
            case 5:
                // test empty events step doesn't get triggered or cause errors
                _b.sent();
                // add to journey to trigger initial action
                return [4 /*yield*/, sdk.api.endusers.updateOne(enduser.id, { journeys: (_a = {}, _a[journey.id] = 'New', _a) }, { replaceObjectFields: true })];
            case 6:
                // add to journey to trigger initial action
                _b.sent();
                return [4 /*yield*/, wait(undefined, 250)];
            case 7:
                _b.sent();
                return [4 /*yield*/, async_test("Root action triggered (only root)", function () { return sdk.api.automated_actions.getSome({ filter: { enduserId: enduser.id } }); }, { onResult: function (es) { return es.length === 1; } })];
            case 8:
                _b.sent();
                return [4 /*yield*/, wait(undefined, 250)];
            case 9:
                _b.sent();
                return [4 /*yield*/, async_test("Next step not trigged early", function () { return sdk.api.endusers.getOne(enduser.id); }, { onResult: function (e) { var _a; return ((_a = e.journeys) === null || _a === void 0 ? void 0 : _a[journey.id]) !== 'Delayed Step'; } })];
            case 10:
                _b.sent();
                return [4 /*yield*/, async_test("Sequenced action triggered", function () { return pollForResults(function () { return sdk.api.endusers.getOne(enduser.id); }, function (e) { var _a; return ((_a = e.journeys) === null || _a === void 0 ? void 0 : _a[journey.id]) === 'Delayed Step'; }, TEST_DELAY, 15); }, passOnAnyResult)];
            case 11:
                _b.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.journeys.deleteOne(journey.id),
                        sdk.api.endusers.deleteOne(enduser.id),
                    ])];
            case 12:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
var sequenceTests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var journey, journey2, enduser, enduser2, step, step2, createAction, numberOfActions, i;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                log_header("Automation Sequencing");
                return [4 /*yield*/, sdk.api.journeys.createOne({ title: 'test journey' })];
            case 1:
                journey = _b.sent();
                return [4 /*yield*/, sdk.api.journeys.createOne({ title: 'other journey' })];
            case 2:
                journey2 = _b.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'test@tellescope.com' })];
            case 3:
                enduser = _b.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'test2@tellescope.com' })];
            case 4:
                enduser2 = _b.sent();
                return [4 /*yield*/, sdk.api.endusers.updateOne(enduser.id, { journeys: (_a = {}, _a[journey.id] = 'Added', _a[journey2.id] = 'Added2', _a) })];
            case 5:
                _b.sent();
                return [4 /*yield*/, (sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [{ type: 'onJourneyStart', info: {} }],
                        action: { type: 'setEnduserStatus', info: { status: 'Root' }, },
                    }))];
            case 6:
                step = _b.sent();
                return [4 /*yield*/, (sdk.api.automation_steps.createOne({
                        journeyId: journey2.id,
                        events: [{ type: 'onJourneyStart', info: {} }],
                        action: { type: 'setEnduserStatus', info: { status: 'Root' }, },
                    }))];
            case 7:
                step2 = _b.sent();
                createAction = function (journeyId, step, enduserId) { return (sdk.api.automated_actions.createOne({
                    journeyId: journeyId,
                    automationStepId: step.id,
                    enduserId: enduserId !== null && enduserId !== void 0 ? enduserId : enduser.id,
                    processAfter: Date.now() + 1000000,
                    status: 'active',
                    event: { type: 'onJourneyStart', info: {} },
                    action: { type: 'setEnduserStatus', info: { status: 'Test Status' }, },
                })); };
                numberOfActions = 4;
                i = 0;
                _b.label = 8;
            case 8:
                if (!(i < numberOfActions)) return [3 /*break*/, 13];
                return [4 /*yield*/, createAction(journey.id, step)];
            case 9:
                _b.sent();
                return [4 /*yield*/, createAction(journey2.id, step2)];
            case 10:
                _b.sent();
                return [4 /*yield*/, createAction(journey.id, step, enduser2.id)];
            case 11:
                _b.sent();
                _b.label = 12;
            case 12:
                i++;
                return [3 /*break*/, 8];
            case 13: 
            // remove from journey, should set all statuses to cancelled
            return [4 /*yield*/, sdk.api.endusers.updateOne(enduser.id, { journeys: {} }, { replaceObjectFields: true })];
            case 14:
                // remove from journey, should set all statuses to cancelled
                _b.sent();
                return [4 /*yield*/, wait(undefined, 250)];
            case 15:
                _b.sent();
                return [4 /*yield*/, async_test("Automated actions for handle ticket created", function () { return sdk.api.automated_actions.getSome(); }, { onResult: (function (actions) { return (
                        // enduser removed from multiple journeys
                        actions.filter(function (a) { return a.status === 'cancelled'; }).length === numberOfActions * 2
                            // other enduser is unaffected
                            && actions.filter(function (a) { return a.status === 'active'; }).length === numberOfActions); }) })];
            case 16:
                _b.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.journeys.deleteOne(journey.id),
                        sdk.api.journeys.deleteOne(journey2.id),
                        sdk.api.endusers.deleteOne(enduser.id),
                        sdk.api.endusers.deleteOne(enduser2.id),
                    ])];
            case 17:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
export var formUnsubmittedCancelConditionTest = function () { return __awaiter(void 0, void 0, void 0, function () {
    var enduser, journey, form, field, triggerStep, unsub, fastFollowup, accessCode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("formUnsubmitted Cancel Condition Tests");
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'deletemeee@tellescope.com' })];
            case 1:
                enduser = _a.sent();
                return [4 /*yield*/, sdk.api.journeys.createOne({ title: 'test journey ' })];
            case 2:
                journey = _a.sent();
                return [4 /*yield*/, sdk.api.forms.createOne({ title: 'test form' })];
            case 3:
                form = _a.sent();
                return [4 /*yield*/, sdk.api.form_fields.createOne({
                        formId: form.id, title: 'question', type: 'string',
                        previousFields: [{ type: 'root', info: {} }]
                    })
                    // this action won't be fired, because patient isn't added to journey as part of tests
                ];
            case 4:
                field = _a.sent();
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [{ type: 'onJourneyStart', info: {} }],
                        // in practice, this would send a form, so that the next step(s) could handle the response
                        // but we don't want to send emails in testing, and can still attach this Id to a form response to test a trigger
                        action: {
                            type: 'setEnduserStatus',
                            info: { status: 'start' },
                        },
                    })];
            case 5:
                triggerStep = _a.sent();
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [{
                                type: 'formUnsubmitted',
                                info: {
                                    automationStepId: triggerStep.id,
                                    delayInMS: 0,
                                    delay: 0, unit: 'Seconds', // don't matter
                                    // this cancelCondition is now added automatically, does not need to be part of step
                                    // cancelConditions: [{ type: 'formResponse', info: { automationStepId: triggerStep.id }}]
                                }
                            }],
                        action: {
                            type: 'setEnduserStatus',
                            info: { status: 'triggered' },
                        },
                    })
                    // should occur right after unsub
                ];
            case 6:
                unsub = _a.sent();
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [{
                                type: 'afterAction',
                                info: {
                                    automationStepId: unsub.id,
                                    delayInMS: 0,
                                    delay: 0, unit: 'Seconds', // don't matter
                                    // this cancelCondition is now added automatically, does not need to be part of step
                                    // cancelConditions: [{ type: 'formResponse', info: { automationStepId: triggerStep.id }}]
                                }
                            }],
                        action: {
                            type: 'setEnduserStatus',
                            info: { status: 'triggered again' },
                        },
                    })
                    // should be cancelled after unsub
                ];
            case 7:
                fastFollowup = _a.sent();
                // should be cancelled after unsub
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [{
                                type: 'afterAction',
                                info: {
                                    automationStepId: unsub.id,
                                    delayInMS: 1000000,
                                    delay: 0, unit: 'Seconds', // don't matter
                                    // this cancelCondition is now added automatically, passed down from unsub
                                    // cancelConditions: [{ type: 'formResponse', info: { automationStepId: triggerStep.id }}]
                                }
                            }],
                        action: {
                            type: 'setEnduserStatus',
                            info: { status: 'violation 1' },
                        },
                    })
                    // should be cancelled after unsub
                    // a second followup to the unsub event (to create example of two actions with same cancel condition)
                ];
            case 8:
                // should be cancelled after unsub
                _a.sent();
                // should be cancelled after unsub
                // a second followup to the unsub event (to create example of two actions with same cancel condition)
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [{
                                type: 'afterAction',
                                info: {
                                    automationStepId: unsub.id,
                                    delayInMS: 1000000,
                                    delay: 0, unit: 'Seconds', // don't matter
                                    // this cancelCondition is now added automatically, does not need to be part of step
                                    // cancelConditions: [{ type: 'formResponse', info: { automationStepId: triggerStep.id }}]
                                }
                            }],
                        action: {
                            type: 'setEnduserStatus',
                            info: { status: 'violation 2' },
                        },
                    })];
            case 9:
                // should be cancelled after unsub
                // a second followup to the unsub event (to create example of two actions with same cancel condition)
                _a.sent();
                return [4 /*yield*/, sdk.api.form_responses.prepare_form_response({
                        formId: form.id,
                        automationStepId: triggerStep.id,
                        enduserId: enduser.id
                    })
                    // allow fast followup to trigger
                ];
            case 10:
                accessCode = (_a.sent()).accessCode;
                // allow fast followup to trigger
                return [4 /*yield*/, async_test("formUnsubmitted event with short delay is triggered", function () { return pollForResults(function () { return sdk.api.endusers.getOne(enduser.id); }, function (e) { var _a; return ((_a = e === null || e === void 0 ? void 0 : e.journeys) === null || _a === void 0 ? void 0 : _a[journey.id]) === 'triggered again'; }, 1000, 20); }, passOnAnyResult)
                    // trigger cancel conditions
                ];
            case 11:
                // allow fast followup to trigger
                _a.sent();
                // trigger cancel conditions
                return [4 /*yield*/, sdk.api.form_responses.submit_form_response({ accessCode: accessCode, automationStepId: triggerStep.id, responses: [{
                                answer: {
                                    type: 'string',
                                    value: 'answer'
                                },
                                fieldId: field.id,
                                fieldTitle: field.title,
                            }] })];
            case 12:
                // trigger cancel conditions
                _a.sent();
                return [4 /*yield*/, wait(undefined, 1500)]; // allow background creation with generous pause
            case 13:
                _a.sent(); // allow background creation with generous pause
                return [4 /*yield*/, async_test("Cancel conditions work for followup", function () { return sdk.api.automated_actions.getSome(); }, { onResult: function (as) {
                            var _a, _b;
                            return as.length === 4
                                && ((_a = as.find(function (a) { return a.automationStepId === unsub.id; })) === null || _a === void 0 ? void 0 : _a.status) === 'finished'
                                && ((_b = as.find(function (a) { return a.automationStepId === fastFollowup.id; })) === null || _b === void 0 ? void 0 : _b.status) === 'finished'
                                && as.filter(function (a) { return a.status === 'cancelled'; }).length === 2;
                        }
                    })];
            case 14:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.forms.deleteOne(form.id),
                        sdk.api.journeys.deleteOne(journey.id),
                        sdk.api.endusers.deleteOne(enduser.id)
                    ])];
            case 15:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
export var formsUnsubmittedCancelConditionTest = function () { return __awaiter(void 0, void 0, void 0, function () {
    var enduser, journey, form, field, triggerStep, unsub, form_responses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("formsUnsubmitted Cancel Condition Tests");
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'deletemeee@tellescope.com' })];
            case 1:
                enduser = _a.sent();
                return [4 /*yield*/, sdk.api.journeys.createOne({ title: 'test journey ' })];
            case 2:
                journey = _a.sent();
                return [4 /*yield*/, sdk.api.forms.createOne({ title: 'test form' })];
            case 3:
                form = _a.sent();
                return [4 /*yield*/, sdk.api.form_fields.createOne({
                        formId: form.id, title: 'question', type: 'string',
                        previousFields: [{ type: 'root', info: {} }]
                    })
                    // this action won't be fired, because patient isn't added to journey as part of tests
                ];
            case 4:
                field = _a.sent();
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [{ type: 'onJourneyStart', info: {} }],
                        // in practice, this would send a form, so that the next step(s) could handle the response
                        // but we don't want to send emails in testing, and can still attach this Id to a form response to test a trigger
                        action: {
                            type: 'setEnduserStatus',
                            info: { status: 'start' },
                        },
                    })];
            case 5:
                triggerStep = _a.sent();
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [{
                                type: 'formsUnsubmitted',
                                info: {
                                    automationStepId: triggerStep.id,
                                    delayInMS: 10000,
                                    delay: 0, unit: 'Seconds',
                                    cancelConditions: [
                                    // { type: 'formResponse', info: { automationStepId: triggerStep.id }}
                                    ]
                                }
                            }],
                        action: {
                            type: 'setEnduserStatus',
                            info: { status: 'triggered' },
                        },
                    })
                    // test for all forms submitted triggering update
                ];
            case 6:
                unsub = _a.sent();
                // test for all forms submitted triggering update
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [{
                                type: 'formResponses',
                                info: { automationStepId: triggerStep.id }
                            }],
                        action: {
                            type: 'setEnduserStatus',
                            info: { status: 'formsSubmitted' },
                        },
                    })
                    // triggers formsUnsubmitted automated actions to be created when forms generated in templated message
                ];
            case 7:
                // test for all forms submitted triggering update
                _a.sent();
                // triggers formsUnsubmitted automated actions to be created when forms generated in templated message
                return [4 /*yield*/, sdk.api.templates.get_templated_message({
                        channel: 'Email',
                        enduserId: enduser.id,
                        message: "{{forms.".concat(form.id, ".link:title}} {{forms.").concat(form.id, ".link:title}}"),
                        userId: sdk.userInfo.id,
                        automationStepId: triggerStep.id,
                    })];
            case 8:
                // triggers formsUnsubmitted automated actions to be created when forms generated in templated message
                _a.sent();
                return [4 /*yield*/, sdk.api.form_responses.getSome()
                    // allow fast followup to trigger
                ];
            case 9:
                form_responses = _a.sent();
                // allow fast followup to trigger
                return [4 /*yield*/, wait(undefined, 2500)]; // allow background creation with generous pause
            case 10:
                // allow fast followup to trigger
                _a.sent(); // allow background creation with generous pause
                return [4 /*yield*/, async_test("FormsUnsubmitted action created with cancel conditions", function () { return sdk.api.automated_actions.getSome(); }, { onResult: function (as) {
                            var _a;
                            var match = as.find(function (a) { return a.automationStepId === unsub.id; });
                            return !!(as.length === 1
                                && (match === null || match === void 0 ? void 0 : match.status) === 'active'
                                && (match === null || match === void 0 ? void 0 : match.event.type) === 'formsUnsubmitted'
                                && ((_a = match.event.info.cancelConditions) === null || _a === void 0 ? void 0 : _a.find(function (c) {
                                    return c.type === 'formResponses'
                                        && c.info.automationStepId === triggerStep.id
                                        && c.info.unsubmittedFormCount === 2;
                                })));
                        } })];
            case 11:
                _a.sent();
                return [4 /*yield*/, async_test("formResponses not triggered with all forms unsubmitted", function () { return sdk.api.endusers.getOne(enduser.id); }, { onResult: function (e) { var _a; return ((_a = e === null || e === void 0 ? void 0 : e.journeys) === null || _a === void 0 ? void 0 : _a[journey.id]) !== 'formsSubmitted'; } })
                    // trigger cancel conditions
                ];
            case 12:
                _a.sent();
                // trigger cancel conditions
                return [4 /*yield*/, sdk.api.form_responses.submit_form_response({ accessCode: form_responses[0].accessCode, automationStepId: triggerStep.id, responses: [{
                                answer: {
                                    type: 'string',
                                    value: 'answer'
                                },
                                fieldId: field.id,
                                fieldTitle: field.title,
                            }] })];
            case 13:
                // trigger cancel conditions
                _a.sent();
                return [4 /*yield*/, wait(undefined, 2500)]; // allow background creation with generous pause
            case 14:
                _a.sent(); // allow background creation with generous pause
                return [4 /*yield*/, async_test("FormsUnsubmitted cancel conditions working", function () { return sdk.api.automated_actions.getSome(); }, { onResult: function (as) {
                            var _a;
                            var match = as.find(function (a) { return a.automationStepId === unsub.id; });
                            return !!(as.length === 1
                                && (match === null || match === void 0 ? void 0 : match.status) === 'active'
                                && (match === null || match === void 0 ? void 0 : match.event.type) === 'formsUnsubmitted'
                                && ((_a = match.event.info.cancelConditions) === null || _a === void 0 ? void 0 : _a.find(function (c) {
                                    return c.type === 'formResponses'
                                        && c.info.automationStepId === triggerStep.id
                                        && c.info.unsubmittedFormCount === 1;
                                })));
                        } })];
            case 15:
                _a.sent();
                return [4 /*yield*/, async_test("formResponses not triggered yet after 1 form remaining", function () { return sdk.api.endusers.getOne(enduser.id); }, { onResult: function (e) { var _a; return ((_a = e === null || e === void 0 ? void 0 : e.journeys) === null || _a === void 0 ? void 0 : _a[journey.id]) !== 'formsSubmitted'; } })];
            case 16:
                _a.sent();
                return [4 /*yield*/, sdk.api.form_responses.submit_form_response({ accessCode: form_responses[1].accessCode, automationStepId: triggerStep.id, responses: [{
                                answer: {
                                    type: 'string',
                                    value: 'answer'
                                },
                                fieldId: field.id,
                                fieldTitle: field.title,
                            }] })];
            case 17:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 4000)]; // allow background creation with generous pause
            case 18:
                _a.sent(); // allow background creation with generous pause
                return [4 /*yield*/, async_test("FormsUnsubmitted cancel conditions work", function () { return sdk.api.automated_actions.getSome(); }, { onResult: function (as) {
                            var _a;
                            var match = as.find(function (a) { return a.automationStepId === unsub.id; });
                            return !!(as.length === 2 // this now includes formResponses event as well, which we test has worked in the next test
                                && (match === null || match === void 0 ? void 0 : match.status) === 'cancelled'
                                && (match === null || match === void 0 ? void 0 : match.event.type) === 'formsUnsubmitted'
                                && ((_a = match.event.info.cancelConditions) === null || _a === void 0 ? void 0 : _a.find(function (c) {
                                    return c.type === 'formResponses'
                                        && c.info.automationStepId === triggerStep.id
                                        && c.info.unsubmittedFormCount === 0;
                                })));
                        } })];
            case 19:
                _a.sent();
                return [4 /*yield*/, async_test("formResponses triggered after both forms submitted", function () { return pollForResults(function () { return sdk.api.endusers.getOne(enduser.id); }, function (e) { var _a; return ((_a = e === null || e === void 0 ? void 0 : e.journeys) === null || _a === void 0 ? void 0 : _a[journey.id]) === 'formsSubmitted'; }, 500, 10); }, passOnAnyResult)];
            case 20:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.forms.deleteOne(form.id),
                        sdk.api.journeys.deleteOne(journey.id),
                        sdk.api.endusers.deleteOne(enduser.id)
                    ])];
            case 21:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// to ensure that unsubmitted branch can complete and then complete form still triggers next branch
export var formsUnsubmittedTest = function () { return __awaiter(void 0, void 0, void 0, function () {
    var enduser, journey, form, field, triggerStep, form_responses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("formsUnsubmitted Tests");
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'deletemeee@tellescope.com' })];
            case 1:
                enduser = _a.sent();
                return [4 /*yield*/, sdk.api.journeys.createOne({ title: 'test journey ' })];
            case 2:
                journey = _a.sent();
                return [4 /*yield*/, sdk.api.forms.createOne({ title: 'test form' })];
            case 3:
                form = _a.sent();
                return [4 /*yield*/, sdk.api.form_fields.createOne({
                        formId: form.id, title: 'question', type: 'string',
                        previousFields: [{ type: 'root', info: {} }]
                    })
                    // this action won't be fired, because patient isn't added to journey as part of tests
                ];
            case 4:
                field = _a.sent();
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [{ type: 'onJourneyStart', info: {} }],
                        // in practice, this would send a form, so that the next step(s) could handle the response
                        // but we don't want to send emails in testing, and can still attach this Id to a form response to test a trigger
                        action: {
                            type: 'setEnduserStatus',
                            info: { status: 'start' },
                        },
                    })];
            case 5:
                triggerStep = _a.sent();
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [{
                                type: 'formsUnsubmitted',
                                info: {
                                    automationStepId: triggerStep.id,
                                    delayInMS: 0,
                                    delay: 0, unit: 'Seconds',
                                    cancelConditions: [
                                    // { type: 'formResponse', info: { automationStepId: triggerStep.id }}
                                    ]
                                }
                            }],
                        action: {
                            type: 'setEnduserStatus',
                            info: { status: 'triggered' },
                        },
                    })
                    // test for all forms submitted triggering update
                ];
            case 6:
                _a.sent();
                // test for all forms submitted triggering update
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [{
                                type: 'formResponses',
                                info: { automationStepId: triggerStep.id }
                            }],
                        action: {
                            type: 'setEnduserStatus',
                            info: { status: 'formsSubmitted' },
                        },
                    })
                    // triggers formsUnsubmitted automated actions to be created when forms generated in templated message
                ];
            case 7:
                // test for all forms submitted triggering update
                _a.sent();
                // triggers formsUnsubmitted automated actions to be created when forms generated in templated message
                return [4 /*yield*/, sdk.api.templates.get_templated_message({
                        channel: 'Email',
                        enduserId: enduser.id,
                        message: "{{forms.".concat(form.id, ".link:title}} {{forms.").concat(form.id, ".link:title}}"),
                        userId: sdk.userInfo.id,
                        automationStepId: triggerStep.id,
                    })];
            case 8:
                // triggers formsUnsubmitted automated actions to be created when forms generated in templated message
                _a.sent();
                return [4 /*yield*/, sdk.api.form_responses.getSome()];
            case 9:
                form_responses = _a.sent();
                return [4 /*yield*/, async_test("formsUnsubmitted handler worked", function () { return pollForResults(function () { return sdk.api.endusers.getOne(enduser.id); }, function (e) { var _a; return ((_a = e === null || e === void 0 ? void 0 : e.journeys) === null || _a === void 0 ? void 0 : _a[journey.id]) === 'triggered'; }, 1000, 10); }, passOnAnyResult)
                    // trigger cancel conditions
                ];
            case 10:
                _a.sent();
                // trigger cancel conditions
                return [4 /*yield*/, sdk.api.form_responses.submit_form_response({ accessCode: form_responses[0].accessCode, automationStepId: triggerStep.id, responses: [{
                                answer: {
                                    type: 'string',
                                    value: 'answer'
                                },
                                fieldId: field.id,
                                fieldTitle: field.title,
                            }] })];
            case 11:
                // trigger cancel conditions
                _a.sent();
                return [4 /*yield*/, wait(undefined, 5000)]; // allow background creation with generous pause
            case 12:
                _a.sent(); // allow background creation with generous pause
                return [4 /*yield*/, async_test("formResponses not triggered yet after 1 form remaining", function () { return sdk.api.endusers.getOne(enduser.id); }, { onResult: function (e) { var _a; return ((_a = e === null || e === void 0 ? void 0 : e.journeys) === null || _a === void 0 ? void 0 : _a[journey.id]) !== 'formsSubmitted'; } })];
            case 13:
                _a.sent();
                return [4 /*yield*/, sdk.api.form_responses.submit_form_response({ accessCode: form_responses[1].accessCode, automationStepId: triggerStep.id, responses: [{
                                answer: {
                                    type: 'string',
                                    value: 'answer'
                                },
                                fieldId: field.id,
                                fieldTitle: field.title,
                            }] })];
            case 14:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 5000)]; // allow background creation with generous pause
            case 15:
                _a.sent(); // allow background creation with generous pause
                return [4 /*yield*/, async_test("formResponses triggered after both forms submitted", function () { return sdk.api.endusers.getOne(enduser.id); }, { onResult: function (e) { var _a; return ((_a = e === null || e === void 0 ? void 0 : e.journeys) === null || _a === void 0 ? void 0 : _a[journey.id]) === 'formsSubmitted'; } })];
            case 16:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.forms.deleteOne(form.id),
                        sdk.api.journeys.deleteOne(journey.id),
                        sdk.api.endusers.deleteOne(enduser.id)
                    ])];
            case 17:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
export var formsSubmittedNoUnsubmittedTest = function () { return __awaiter(void 0, void 0, void 0, function () {
    var enduser, journey, form, field, triggerStep, form_responses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("formsSubmitted, with no unsubmitted branch, Tests");
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'deletemeee@tellescope.com' })];
            case 1:
                enduser = _a.sent();
                return [4 /*yield*/, sdk.api.journeys.createOne({ title: 'test journey ' })];
            case 2:
                journey = _a.sent();
                return [4 /*yield*/, sdk.api.forms.createOne({ title: 'test form' })];
            case 3:
                form = _a.sent();
                return [4 /*yield*/, sdk.api.form_fields.createOne({
                        formId: form.id, title: 'question', type: 'string',
                        previousFields: [{ type: 'root', info: {} }]
                    })
                    // this action won't be fired, because patient isn't added to journey as part of tests
                ];
            case 4:
                field = _a.sent();
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [{ type: 'onJourneyStart', info: {} }],
                        // in practice, this would send a form, so that the next step(s) could handle the response
                        // but we don't want to send emails in testing, and can still attach this Id to a form response to test a trigger
                        action: {
                            type: 'setEnduserStatus',
                            info: { status: 'start' },
                        },
                    })
                    // test for all forms submitted triggering update
                ];
            case 5:
                triggerStep = _a.sent();
                // test for all forms submitted triggering update
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [{
                                type: 'formResponses',
                                info: { automationStepId: triggerStep.id }
                            }],
                        action: {
                            type: 'setEnduserStatus',
                            info: { status: 'formsSubmitted' },
                        },
                    })
                    // simulates sending 2 outstanding forms to pt with expected follow-up
                ];
            case 6:
                // test for all forms submitted triggering update
                _a.sent();
                // simulates sending 2 outstanding forms to pt with expected follow-up
                return [4 /*yield*/, sdk.api.templates.get_templated_message({
                        channel: 'Email',
                        enduserId: enduser.id,
                        message: "{{forms.".concat(form.id, ".link:title}} {{forms.").concat(form.id, ".link:title}}"),
                        userId: sdk.userInfo.id,
                        automationStepId: triggerStep.id,
                    })];
            case 7:
                // simulates sending 2 outstanding forms to pt with expected follow-up
                _a.sent();
                return [4 /*yield*/, sdk.api.form_responses.getSome()
                    // trigger submission
                ];
            case 8:
                form_responses = _a.sent();
                // trigger submission
                return [4 /*yield*/, sdk.api.form_responses.submit_form_response({ accessCode: form_responses[0].accessCode, automationStepId: triggerStep.id, responses: [{
                                answer: {
                                    type: 'string',
                                    value: 'answer'
                                },
                                fieldId: field.id,
                                fieldTitle: field.title,
                            }] })];
            case 9:
                // trigger submission
                _a.sent();
                return [4 /*yield*/, wait(undefined, 5000)]; // allow background creation with generous pause
            case 10:
                _a.sent(); // allow background creation with generous pause
                return [4 /*yield*/, async_test("formResponses not triggered yet after 1 form remaining", function () { return sdk.api.endusers.getOne(enduser.id); }, { onResult: function (e) { var _a; return ((_a = e === null || e === void 0 ? void 0 : e.journeys) === null || _a === void 0 ? void 0 : _a[journey.id]) !== 'formsSubmitted'; } })];
            case 11:
                _a.sent();
                return [4 /*yield*/, sdk.api.form_responses.submit_form_response({ accessCode: form_responses[1].accessCode, automationStepId: triggerStep.id, responses: [{
                                answer: {
                                    type: 'string',
                                    value: 'answer'
                                },
                                fieldId: field.id,
                                fieldTitle: field.title,
                            }] })];
            case 12:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 5000)]; // allow background creation with generous pause
            case 13:
                _a.sent(); // allow background creation with generous pause
                return [4 /*yield*/, async_test("formResponses triggered after both forms submitted", function () { return sdk.api.endusers.getOne(enduser.id); }, { onResult: function (e) { var _a; return ((_a = e === null || e === void 0 ? void 0 : e.journeys) === null || _a === void 0 ? void 0 : _a[journey.id]) === 'formsSubmitted'; } })];
            case 14:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.forms.deleteOne(form.id),
                        sdk.api.journeys.deleteOne(journey.id),
                        sdk.api.endusers.deleteOne(enduser.id)
                    ])];
            case 15:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// ensure child steps come from the same journey
export var automationSameJourneyTests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var journey, journey2, badRoot;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("automationSameJourney");
                return [4 /*yield*/, sdk.api.journeys.createOne({ title: 'test journey' })];
            case 1:
                journey = _a.sent();
                return [4 /*yield*/, sdk.api.journeys.createOne({ title: 'test other journey' })
                    // this action won't be fired, because patient isn't added to journey as part of tests
                ];
            case 2:
                journey2 = _a.sent();
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [{ type: 'onJourneyStart', info: {} }],
                        // in practice, this would send a form, so that the next step(s) could handle the response
                        // but we don't want to send emails in testing, and can still attach this Id to a form response to test a trigger
                        action: {
                            type: 'setEnduserStatus',
                            info: { status: 'start' },
                        },
                    })];
            case 3:
                badRoot = _a.sent();
                return [4 /*yield*/, async_test("can't create child of other journey", function () { return (sdk.api.automation_steps.createOne({
                        journeyId: journey2.id,
                        events: [{
                                type: 'afterAction',
                                info: { automationStepId: badRoot.id, delay: 0, delayInMS: 0, unit: 'Days' }
                            }],
                        action: { type: 'setEnduserStatus', info: { status: 'irrelevant' } },
                    })); }, handleAnyError)];
            case 4:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.journeys.deleteOne(journey.id),
                        sdk.api.journeys.deleteOne(journey2.id)
                    ])];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var addToJourneyTests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var journey, enduser, root, follow;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Add / Re-add to Journey");
                return [4 /*yield*/, sdk.api.journeys.createOne({ title: 'test journey' })];
            case 1:
                journey = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'test@tellescope.com' })];
            case 2:
                enduser = _a.sent();
                return [4 /*yield*/, (sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [{ type: 'onJourneyStart', info: {} }],
                        action: { type: 'setEnduserStatus', info: { status: 'Root' }, },
                    }))];
            case 3:
                root = _a.sent();
                return [4 /*yield*/, (sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [{ type: 'afterAction', info: {
                                    automationStepId: root.id,
                                    delay: 100000,
                                    delayInMS: 100000,
                                    unit: 'Seconds',
                                } }],
                        action: { type: 'setEnduserStatus', info: { status: 'Delayed Step' }, },
                    }))
                    // add to journey and re-add
                ];
            case 4:
                follow = _a.sent();
                // add to journey and re-add
                return [4 /*yield*/, sdk.api.endusers.add_to_journey({ enduserIds: [enduser.id], journeyId: journey.id })];
            case 5:
                // add to journey and re-add
                _a.sent();
                return [4 /*yield*/, async_test("Journey state correctly set by add_to_journey (to default state)", function () { return sdk.api.endusers.getOne(enduser.id); }, { onResult: function (e) { var _a, _b; return ((_a = e.journeys) === null || _a === void 0 ? void 0 : _a[journey.id]) === '' || ((_b = e.journeys) === null || _b === void 0 ? void 0 : _b[journey.id]) === 'Root'; } })
                    // ensure that second step is generated before first is cancelled
                ];
            case 6:
                _a.sent();
                // ensure that second step is generated before first is cancelled
                return [4 /*yield*/, pollForResults(sdk.api.automated_actions.getSome, function (es) { return es.length === 2; }, 100, 100)];
            case 7:
                // ensure that second step is generated before first is cancelled
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.add_to_journey({ enduserIds: [enduser.id], journeyId: journey.id })];
            case 8:
                // ensure that second step is generated before first is cancelled
                _a.sent();
                return [4 /*yield*/, async_test("Enduser correctly added and re-added", function () { return pollForResults(sdk.api.automated_actions.getSome, function (es) { return (es.length === 4
                        && es.filter(function (e) { return e.status === 'cancelled' && e.automationStepId === follow.id; }).length === 1 // one afterAction is cancelled
                        && es.filter(function (e) { return e.status === 'active' && e.automationStepId === follow.id; }).length === 1 // one afterAction is still active
                        && es.filter(function (e) { return e.status === 'finished' && e.automationStepId === root.id; }).length === 2 // two initial onJourneyStart
                    ); }, 250, 40); }, passOnAnyResult)];
            case 9:
                _a.sent();
                return [4 /*yield*/, async_test("Enduser throttle journey add working", function () { return sdk.api.endusers.add_to_journey({ enduserIds: [enduser.id], journeyId: journey.id, throttle: true }); }, handleAnyError)];
            case 10:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.journeys.deleteOne(journey.id),
                        sdk.api.endusers.deleteOne(enduser.id),
                    ])];
            case 11:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var directAutomatedActionTest = function () { return __awaiter(void 0, void 0, void 0, function () {
    var enduser, action;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Manual Action Tests");
                return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'test' })];
            case 1:
                enduser = _a.sent();
                return [4 /*yield*/, sdk.api.automated_actions.createOne({
                        event: {
                            type: 'onJourneyStart',
                            info: {}
                        },
                        action: {
                            type: 'setEnduserStatus',
                            info: { status: "Working" }
                        },
                        enduserId: enduser.id,
                        processAfter: 0,
                        status: 'active',
                        automationStepId: PLACEHOLDER_ID,
                        journeyId: PLACEHOLDER_ID,
                    })];
            case 2:
                action = _a.sent();
                return [4 /*yield*/, async_test("Enduser status set by manual automated action", function () { return pollForResults(function () { return sdk.api.endusers.getOne(enduser.id); }, function (e) { var _a; return ((_a = e.journeys) === null || _a === void 0 ? void 0 : _a[PLACEHOLDER_ID]) === 'Working'; }, 1000, 10); }, passOnAnyResult)];
            case 3:
                _a.sent();
                return [4 /*yield*/, async_test("Automated action is finished", function () { return sdk.api.automated_actions.getOne(action.id); }, { onResult: function (e) { return e.status === 'finished'; } })];
            case 4:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(enduser.id),
                        sdk.api.automated_actions.deleteOne(action.id),
                    ])];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var automation_events_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Automation Events");
                return [4 /*yield*/, directAutomatedActionTest()];
            case 1:
                _a.sent();
                return [4 /*yield*/, formsSubmittedNoUnsubmittedTest()];
            case 2:
                _a.sent();
                return [4 /*yield*/, automationSameJourneyTests()];
            case 3:
                _a.sent();
                return [4 /*yield*/, formsUnsubmittedTest()];
            case 4:
                _a.sent();
                return [4 /*yield*/, formsUnsubmittedCancelConditionTest()];
            case 5:
                _a.sent();
                return [4 /*yield*/, formUnsubmittedCancelConditionTest()];
            case 6:
                _a.sent();
                return [4 /*yield*/, addToJourneyTests()];
            case 7:
                _a.sent();
                return [4 /*yield*/, sequenceTests()];
            case 8:
                _a.sent();
                return [4 /*yield*/, formEventTests()];
            case 9:
                _a.sent();
                return [4 /*yield*/, ticketEventTests()];
            case 10:
                _a.sent();
                return [4 /*yield*/, removeFromJourneyTests()];
            case 11:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var formSubmittedTriggerTests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var enduser, journey1, journey2, journey3, form, field, active, dupActive, inactive, noConditions, equals, equalsFalse, existsTrue, existsFalse, doesNotContainTrue, doesNotContainFalse, containFalse, containTrue, accessCode;
    var _a, _b, _c, _d, _f, _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                log_header("Automation Trigger: Form Response --> Add To Journey");
                return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'test' })];
            case 1:
                enduser = _k.sent();
                return [4 /*yield*/, sdk.api.journeys.createOne({ title: 'journey' })];
            case 2:
                journey1 = _k.sent();
                return [4 /*yield*/, sdk.api.journeys.createOne({ title: 'journey2' })];
            case 3:
                journey2 = _k.sent();
                return [4 /*yield*/, sdk.api.journeys.createOne({ title: 'journey3' })];
            case 4:
                journey3 = _k.sent();
                return [4 /*yield*/, sdk.api.forms.createOne({ title: 'form' })];
            case 5:
                form = _k.sent();
                return [4 /*yield*/, sdk.api.form_fields.createOne({
                        formId: form.id,
                        type: 'string',
                        title: 'Test',
                        previousFields: [
                            {
                                type: 'root',
                                info: {},
                            }
                        ],
                    })];
            case 6:
                field = _k.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Form Submitted', info: { formId: form.id } },
                        action: { type: 'Add To Journey', info: { journeyId: journey1.id } },
                        status: 'Active',
                        title: "Active"
                    })];
            case 7:
                active = _k.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Form Submitted', info: { formId: form.id } },
                        action: { type: 'Add To Journey', info: { journeyId: journey2.id } },
                        status: 'Active',
                        title: "Dup Active"
                    })];
            case 8:
                dupActive = _k.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Form Submitted', info: { formId: form.id } },
                        action: { type: 'Add To Journey', info: { journeyId: journey3.id } },
                        status: 'Inactive',
                        title: "Inactive"
                    })];
            case 9:
                inactive = _k.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: {
                            type: 'Form Submitted',
                            info: {
                                formId: form.id,
                            },
                        },
                        action: { type: 'Add Tags', info: { tags: ['No Conditions'] } },
                        status: 'Active',
                        title: "No Conditions"
                    })];
            case 10:
                noConditions = _k.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: {
                            type: 'Form Submitted',
                            info: {
                                formId: form.id,
                            },
                            conditions: {
                                "$and": [
                                    {
                                        "condition": (_a = {},
                                            _a[field.id] = "trigger 2",
                                            _a)
                                    }
                                ]
                            },
                        },
                        action: { type: 'Add Tags', info: { tags: ['Equals'] } },
                        status: 'Active',
                        title: "Equals"
                    })];
            case 11:
                equals = _k.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: {
                            type: 'Form Submitted',
                            info: {
                                formId: form.id,
                            },
                            conditions: {
                                "$and": [
                                    {
                                        "condition": (_b = {},
                                            _b[field.id] = "tri",
                                            _b)
                                    }
                                ]
                            },
                        },
                        action: { type: 'Add Tags', info: { tags: ['No'] } },
                        status: 'Active',
                        title: "Equals False"
                    })];
            case 12:
                equalsFalse = _k.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: {
                            type: 'Form Submitted',
                            info: {
                                formId: form.id,
                            },
                            conditions: {
                                "$and": [
                                    {
                                        "condition": (_c = {},
                                            _c[field.id] = { $exists: true },
                                            _c)
                                    }
                                ]
                            },
                        },
                        action: { type: 'Add Tags', info: { tags: ['exists'] } },
                        status: 'Active',
                        title: "Exists true"
                    })];
            case 13:
                existsTrue = _k.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: {
                            type: 'Form Submitted',
                            info: {
                                formId: form.id,
                            },
                            conditions: {
                                "$and": [
                                    {
                                        "condition": (_d = {},
                                            _d[field.id] = { $exists: false },
                                            _d)
                                    }
                                ]
                            },
                        },
                        action: { type: 'Add Tags', info: { tags: ['No'] } },
                        status: 'Active',
                        title: "Exists False"
                    })];
            case 14:
                existsFalse = _k.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: {
                            type: 'Form Submitted',
                            info: {
                                formId: form.id,
                            },
                            conditions: {
                                "$and": [
                                    {
                                        "condition": (_f = {},
                                            _f[field.id] = {
                                                "$doesNotContain": "tri2"
                                            },
                                            _f)
                                    }
                                ]
                            },
                        },
                        action: { type: 'Add Tags', info: { tags: ['doesNotContain'] } },
                        status: 'Active',
                        title: "doesNotContainTrue"
                    })];
            case 15:
                doesNotContainTrue = _k.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: {
                            type: 'Form Submitted',
                            info: {
                                formId: form.id,
                            },
                            conditions: {
                                "$and": [
                                    {
                                        "condition": (_g = {},
                                            _g[field.id] = {
                                                "$doesNotContain": "tri"
                                            },
                                            _g)
                                    }
                                ]
                            },
                        },
                        action: { type: 'Add Tags', info: { tags: ['No'] } },
                        status: 'Active',
                        title: "doesNotContainFalse"
                    })];
            case 16:
                doesNotContainFalse = _k.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: {
                            type: 'Form Submitted',
                            info: {
                                formId: form.id,
                            },
                            conditions: {
                                "$and": [
                                    {
                                        "condition": (_h = {},
                                            _h[field.id] = {
                                                "$contains": "tri2"
                                            },
                                            _h)
                                    }
                                ]
                            },
                        },
                        action: { type: 'Add Tags', info: { tags: ['No'] } },
                        status: 'Active',
                        title: "containFalse"
                    })];
            case 17:
                containFalse = _k.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: {
                            type: 'Form Submitted',
                            info: {
                                formId: form.id,
                            },
                            conditions: {
                                "$and": [
                                    {
                                        "condition": (_j = {},
                                            _j[field.id] = {
                                                "$contains": "tri"
                                            },
                                            _j)
                                    }
                                ]
                            },
                        },
                        action: { type: 'Add Tags', info: { tags: ['contains'] } },
                        status: 'Active',
                        title: "containTrue"
                    })];
            case 18:
                containTrue = _k.sent();
                return [4 /*yield*/, sdk.api.form_responses.prepare_form_response({
                        enduserId: enduser.id,
                        formId: form.id,
                    })];
            case 19:
                accessCode = (_k.sent()).accessCode;
                return [4 /*yield*/, sdk.api.form_responses.submit_form_response({
                        accessCode: accessCode,
                        responses: [
                            {
                                fieldId: field.id,
                                fieldTitle: field.title,
                                answer: {
                                    type: 'string',
                                    value: 'trigger 2',
                                },
                            },
                        ],
                    })
                    // allow triggers to happen
                ];
            case 20:
                _k.sent();
                // allow triggers to happen
                return [4 /*yield*/, wait(undefined, 1000)];
            case 21:
                // allow triggers to happen
                _k.sent();
                return [4 /*yield*/, async_test("Triggers with conditional works", function () { return sdk.api.endusers.getOne(enduser.id); }, { onResult: function (e) {
                            var _a, _b, _c, _d, _f, _g;
                            return !!(((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Equals'))
                                && ((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('contains'))
                                && ((_c = e.tags) === null || _c === void 0 ? void 0 : _c.includes('exists'))
                                && ((_d = e.tags) === null || _d === void 0 ? void 0 : _d.includes('No Conditions'))
                                && ((_f = e.tags) === null || _f === void 0 ? void 0 : _f.includes('doesNotContain'))
                                && !((_g = e.tags) === null || _g === void 0 ? void 0 : _g.includes('No')));
                        } })];
            case 22:
                _k.sent();
                return [4 /*yield*/, async_test("Automated triggers work", function () { return sdk.api.endusers.getOne(enduser.id); }, { onResult: function (e) {
                            var _a, _b, _c;
                            return !!(((_a = e.journeys) === null || _a === void 0 ? void 0 : _a[journey1.id]) === ''
                                && ((_b = e.journeys) === null || _b === void 0 ? void 0 : _b[journey2.id]) === ''
                                && ((_c = e.journeys) === null || _c === void 0 ? void 0 : _c[journey3.id]) === undefined);
                        } })];
            case 23:
                _k.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.journeys.deleteOne(journey1.id),
                        sdk.api.journeys.deleteOne(journey2.id),
                        sdk.api.journeys.deleteOne(journey3.id),
                        sdk.api.endusers.deleteOne(enduser.id),
                        sdk.api.forms.deleteOne(form.id),
                        sdk.api.automation_triggers.deleteOne(active.id),
                        sdk.api.automation_triggers.deleteOne(dupActive.id),
                        sdk.api.automation_triggers.deleteOne(inactive.id),
                        sdk.api.automation_triggers.deleteOne(equals.id),
                        sdk.api.automation_triggers.deleteOne(doesNotContainTrue.id),
                        sdk.api.automation_triggers.deleteOne(containTrue.id),
                        sdk.api.automation_triggers.deleteOne(noConditions.id),
                        sdk.api.automation_triggers.deleteOne(existsTrue.id),
                        sdk.api.automation_triggers.deleteOne(existsFalse.id),
                        sdk.api.automation_triggers.deleteOne(containFalse.id),
                        sdk.api.automation_triggers.deleteOne(equalsFalse.id),
                        sdk.api.automation_triggers.deleteOne(doesNotContainFalse.id),
                    ])];
            case 24:
                _k.sent();
                return [2 /*return*/];
        }
    });
}); };
var order_created_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var t1, t2, t3, t4, e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Automation Trigger Tests (Order Created)");
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Order Created', info: {} },
                        action: { type: 'Add Tags', info: { tags: ['No conditions'] } },
                        status: 'Active',
                        title: "No conditions"
                    })];
            case 1:
                t1 = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Order Created', info: { titles: ['Title'] } },
                        action: { type: 'Add Tags', info: { tags: ['Title'] } },
                        status: 'Active',
                        title: "Title Condition"
                    })];
            case 2:
                t2 = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Order Created', info: { fills: ['Fill'] } },
                        action: { type: 'Add Tags', info: { tags: ['Fill'] } },
                        status: 'Active',
                        title: "Fill Condition"
                    })];
            case 3:
                t3 = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Order Created', info: { partialFrequency: 'freq' } },
                        action: { type: 'Add Tags', info: { tags: ['Frequency'] } },
                        status: 'Active',
                        title: "Frequency Condition"
                    })];
            case 4:
                t4 = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 5:
                e = _a.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.createOne({ status: 'test', source: 'test', title: 'nomatch', fill: 'nomatch', frequency: 'nomatch', externalId: '1', enduserId: e.id })];
            case 6:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 7:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("First tag is added", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a, _b, _c, _d, _f;
                            return !!(((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 1
                                && ((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('No conditions'))
                                && !((_c = e.tags) === null || _c === void 0 ? void 0 : _c.includes('Title'))
                                && !((_d = e.tags) === null || _d === void 0 ? void 0 : _d.includes('Fill'))
                                && !((_f = e.tags) === null || _f === void 0 ? void 0 : _f.includes('Frequency')));
                        } })];
            case 8:
                _a.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.createOne({ status: 'test', source: 'test', externalId: '2', enduserId: e.id, title: "Title" })];
            case 9:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 10:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("Second tag is added", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a, _b, _c, _d, _f;
                            return !!(((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 2
                                && ((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('No conditions'))
                                && ((_c = e.tags) === null || _c === void 0 ? void 0 : _c.includes('Title'))
                                && !((_d = e.tags) === null || _d === void 0 ? void 0 : _d.includes('Fill'))
                                && !((_f = e.tags) === null || _f === void 0 ? void 0 : _f.includes('Frequency')));
                        } })];
            case 11:
                _a.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.createOne({ status: 'test', source: 'test', externalId: '3', enduserId: e.id, title: "Title", fill: "Fill" })];
            case 12:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 13:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("Third tag is added", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a, _b, _c, _d, _f;
                            return !!(((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 3
                                && ((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('No conditions'))
                                && ((_c = e.tags) === null || _c === void 0 ? void 0 : _c.includes('Title'))
                                && ((_d = e.tags) === null || _d === void 0 ? void 0 : _d.includes('Fill'))
                                && !((_f = e.tags) === null || _f === void 0 ? void 0 : _f.includes('Frequency')));
                        } })];
            case 14:
                _a.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.createOne({ status: 'test', source: 'test', externalId: '4', enduserId: e.id, title: "Title", fill: "Fill", frequency: '1029freq--29' })];
            case 15:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 16:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("Fourth tag is added", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a, _b, _c, _d, _f;
                            return !!(((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 4
                                && ((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('No conditions'))
                                && ((_c = e.tags) === null || _c === void 0 ? void 0 : _c.includes('Title'))
                                && ((_d = e.tags) === null || _d === void 0 ? void 0 : _d.includes('Fill'))
                                && ((_f = e.tags) === null || _f === void 0 ? void 0 : _f.includes('Frequency')));
                        } })];
            case 17:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.automation_triggers.deleteOne(t1.id),
                        sdk.api.automation_triggers.deleteOne(t2.id),
                        sdk.api.automation_triggers.deleteOne(t3.id),
                        sdk.api.automation_triggers.deleteOne(t4.id),
                        sdk.api.endusers.deleteOne(e.id),
                    ])];
            case 18:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var order_status_equals_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var t1, t2, t3, t4, t5, t6, e, u;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Automation Trigger Tests (Order Status Equals)");
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Order Status Equals', info: { source: 'Source', status: "Status", } },
                        action: { type: 'Add Tags', info: { tags: ['Source'] } },
                        status: 'Active',
                        title: "No conditions"
                    })];
            case 1:
                t1 = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Order Status Equals', info: { source: 'Source', status: "Filled", fills: ['Fill'] } },
                        action: { type: 'Add Tags', info: { tags: ['Fill'] } },
                        status: 'Active',
                        title: "Fill Condition"
                    })];
            case 2:
                t2 = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Order Status Equals', info: { source: 'Source', status: "Update" } },
                        action: { type: 'Add Tags', info: { tags: ['Status Update'] } },
                        status: 'Active',
                        title: "No conditions"
                    })];
            case 3:
                t3 = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Order Status Equals', info: { source: 'Source', status: "Update", fills: ['Update'] } },
                        action: { type: 'Add Tags', info: { tags: ['Fill Update'] } },
                        status: 'Active',
                        title: "Fill Condition"
                    })];
            case 4:
                t4 = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Order Status Equals', info: { source: 'Source', status: "Update", skus: ['SKU'] } },
                        action: { type: 'Add Tags', info: { tags: ['SKU Update'] } },
                        status: 'Active',
                        title: "SKU Condition"
                    })];
            case 5:
                t5 = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Order Status Equals', info: { source: 'Source', status: "Update", skuPartials: ['SKU-PARTIAL'] } },
                        action: { type: 'Add Tags', info: { tags: ['SKU Partial Update'] } },
                        status: 'Active',
                        title: "SKU Partial Condition"
                    })];
            case 6:
                t6 = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 7:
                e = _a.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.createOne({ status: 'Nooo', source: 'Source', title: 'nomatch', externalId: '1', enduserId: e.id })];
            case 8:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 9:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("No tag is added (no fill)", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } })];
            case 10:
                _a.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.createOne({ status: 'Filled', source: 'Source', title: 'nomatch', externalId: '2', enduserId: e.id, fill: 'nomatch' })];
            case 11:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 12:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("No tag is added (fill mistmatch)", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } })];
            case 13:
                _a.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.createOne({ status: 'Status', source: 'Source', externalId: '3', enduserId: e.id, title: "Title" })];
            case 14:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 15:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("First tag is added", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a, _b;
                            return !!(((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 1
                                && ((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('Source')));
                        } })];
            case 16:
                _a.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.createOne({ status: 'Status', source: 'Source', externalId: '4', enduserId: e.id, title: "Title", fill: '1' })];
            case 17:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 18:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("Fill tag not added yet (mismatch)", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a, _b, _c;
                            return !!(((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 1
                                && ((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('Source'))
                                && !((_c = e.tags) === null || _c === void 0 ? void 0 : _c.includes('Fill')));
                        } })];
            case 19:
                _a.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.createOne({ status: 'Filled', source: 'Source', externalId: '5', enduserId: e.id, title: "Title", fill: "Fill" })];
            case 20:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 21:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("Fill tag added", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a, _b, _c;
                            return !!(((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 2
                                && ((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('Source'))
                                && ((_c = e.tags) === null || _c === void 0 ? void 0 : _c.includes('Fill')));
                        } })];
            case 22:
                _a.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.createOne({ status: 'Status', source: 'Source', externalId: '6', enduserId: e.id, title: "Title" })];
            case 23:
                u = _a.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.updateOne(u.id, { status: 'Update' })];
            case 24:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 25:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("Status update tag added", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a, _b, _c, _d;
                            return !!(((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 3
                                && ((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('Source'))
                                && ((_c = e.tags) === null || _c === void 0 ? void 0 : _c.includes('Fill'))
                                && ((_d = e.tags) === null || _d === void 0 ? void 0 : _d.includes('Status Update')));
                        } })];
            case 26:
                _a.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.updateOne(u.id, { status: 'Toggle' })];
            case 27:
                _a.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.updateOne(u.id, { status: "Update", fill: 'Update' })];
            case 28:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 29:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("Fill update tag added", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a, _b, _c, _d, _f;
                            return !!(((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 4
                                && ((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('Source'))
                                && ((_c = e.tags) === null || _c === void 0 ? void 0 : _c.includes('Fill'))
                                && ((_d = e.tags) === null || _d === void 0 ? void 0 : _d.includes('Status Update'))
                                && ((_f = e.tags) === null || _f === void 0 ? void 0 : _f.includes('Fill Update')));
                        } })];
            case 30:
                _a.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.updateOne(u.id, { status: 'Toggle' })];
            case 31:
                _a.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.updateOne(u.id, { status: "Update", sku: 'SK' })];
            case 32:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 33:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("SKU update no match", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a, _b, _c, _d, _f;
                            return !!(((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 4
                                && ((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('Source'))
                                && ((_c = e.tags) === null || _c === void 0 ? void 0 : _c.includes('Fill'))
                                && ((_d = e.tags) === null || _d === void 0 ? void 0 : _d.includes('Status Update'))
                                && ((_f = e.tags) === null || _f === void 0 ? void 0 : _f.includes('Fill Update')));
                        } })];
            case 34:
                _a.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.updateOne(u.id, { status: 'Toggle' })];
            case 35:
                _a.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.updateOne(u.id, { status: "Update", sku: 'SKU' })];
            case 36:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 37:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("SKU update tag added", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a, _b, _c, _d, _f, _g;
                            return !!(((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 5
                                && ((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('Source'))
                                && ((_c = e.tags) === null || _c === void 0 ? void 0 : _c.includes('Fill'))
                                && ((_d = e.tags) === null || _d === void 0 ? void 0 : _d.includes('Status Update'))
                                && ((_f = e.tags) === null || _f === void 0 ? void 0 : _f.includes('Fill Update'))
                                && ((_g = e.tags) === null || _g === void 0 ? void 0 : _g.includes('SKU Update')));
                        } })];
            case 38:
                _a.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.updateOne(u.id, { status: 'Toggle' })];
            case 39:
                _a.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.updateOne(u.id, { status: "Update", sku: '___SKU-PARTIAL--_' })];
            case 40:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 41:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("SKU partial update tag added", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a, _b, _c, _d, _f, _g, _h;
                            return !!(((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 6
                                && ((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('Source'))
                                && ((_c = e.tags) === null || _c === void 0 ? void 0 : _c.includes('Fill'))
                                && ((_d = e.tags) === null || _d === void 0 ? void 0 : _d.includes('Status Update'))
                                && ((_f = e.tags) === null || _f === void 0 ? void 0 : _f.includes('Fill Update'))
                                && ((_g = e.tags) === null || _g === void 0 ? void 0 : _g.includes('SKU Update'))
                                && ((_h = e.tags) === null || _h === void 0 ? void 0 : _h.includes('SKU Partial Update')));
                        } })];
            case 42:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.automation_triggers.deleteOne(t1.id),
                        sdk.api.automation_triggers.deleteOne(t2.id),
                        sdk.api.automation_triggers.deleteOne(t3.id),
                        sdk.api.automation_triggers.deleteOne(t4.id),
                        sdk.api.automation_triggers.deleteOne(t5.id),
                        sdk.api.automation_triggers.deleteOne(t6.id),
                        sdk.api.endusers.deleteOne(e.id),
                    ])];
            case 43:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var tag_added_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var t1, t2, t3, e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Automation Trigger Tests (Tag Added)");
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Tag Added', info: { tag: "1" } },
                        action: { type: 'Add Tags', info: { tags: ['1 Added'] } },
                        status: 'Active',
                        title: "No conditions"
                    })];
            case 1:
                t1 = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Tag Added', info: { tag: "2" } },
                        action: { type: 'Add Tags', info: { tags: ['2 Added'] } },
                        status: 'Active',
                        title: "Title Condition"
                    })];
            case 2:
                t2 = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Tag Added', info: { tag: "3" } },
                        action: { type: 'Add Tags', info: { tags: ['3 Added'] } },
                        status: 'Active',
                        title: "Fill Condition"
                    })];
            case 3:
                t3 = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 4:
                e = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.updateOne(e.id, { fname: 'no tags added' })];
            case 5:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 6:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("No tags added", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } })];
            case 7:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.updateOne(e.id, { tags: ['1'] })];
            case 8:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 9:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("Tag 1 added", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a;
                            return !!(((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 2
                                && e.tags.includes('1')
                                && e.tags.includes('1 Added'));
                        } })];
            case 10:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.updateOne(e.id, { tags: ['4'] })];
            case 11:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 12:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test('Unrecognized tag added', function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a;
                            return !!(((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 3
                                && e.tags.includes('1')
                                && e.tags.includes('1 Added')
                                && e.tags.includes('4'));
                        } })];
            case 13:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.updateOne(e.id, { tags: ['2', '3'] })];
            case 14:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 15:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("Tag 2 and 3 added", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a;
                            return !!(((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 7
                                && e.tags.includes('1')
                                && e.tags.includes('1 Added')
                                && e.tags.includes('4')
                                && e.tags.includes('2')
                                && e.tags.includes('3')
                                && e.tags.includes('2 Added')
                                && e.tags.includes('3 Added'));
                        } })];
            case 16:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.automation_triggers.deleteOne(t1.id),
                        sdk.api.automation_triggers.deleteOne(t2.id),
                        sdk.api.automation_triggers.deleteOne(t3.id),
                        sdk.api.endusers.deleteOne(e.id),
                    ])];
            case 17:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var appointment_cancelled_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var t1, t2, t3, t4, t5, e, event1, event2, event3, event4, event5, event6, t6, event7, event8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Automation Trigger Tests (Appointment Cancelled)");
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Appointment Cancelled', info: {} },
                        action: { type: 'Add Tags', info: { tags: ['By Any'] } },
                        status: 'Active',
                        title: "By Any"
                    })];
            case 1:
                t1 = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Appointment Cancelled', info: { titles: ['Title'] } },
                        action: { type: 'Add Tags', info: { tags: ['By Title'] } },
                        status: 'Active',
                        title: "By Title"
                    })];
            case 2:
                t2 = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Appointment Cancelled', info: { templateIds: [PLACEHOLDER_ID] } },
                        action: { type: 'Add Tags', info: { tags: ['By templateId'] } },
                        status: 'Active',
                        title: "By templateId"
                    })];
            case 3:
                t3 = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Appointment Cancelled', info: { by: 'enduser' } },
                        action: { type: 'Add Tags', info: { tags: ['By enduser'] } },
                        status: 'Active',
                        title: "By enduser"
                    })];
            case 4:
                t4 = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Appointment Cancelled', info: { by: 'user' } },
                        action: { type: 'Add Tags', info: { tags: ['By user'] } },
                        status: 'Active',
                        title: "By user"
                    })];
            case 5:
                t5 = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 6:
                e = _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({ title: 'Test', durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e.id }] })];
            case 7:
                event1 = _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen (nothing should trigger til cancelled)
            case 8:
                _a.sent(); // allow triggers to happen (nothing should trigger til cancelled)
                return [4 /*yield*/, async_test("No tags added", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) { var _a; return !((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length); } })];
            case 9:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({ title: 'Test 2', durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e.id }] })];
            case 10:
                event2 = _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.updateOne(event2.id, { cancelledAt: new Date() })];
            case 11:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 12:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("Any cancel", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a;
                            return ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 1
                                && e.tags.includes('By Any');
                        }
                    })];
            case 13:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({ title: 'Title', durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e.id }] })];
            case 14:
                event3 = _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.updateOne(event3.id, { cancelledAt: new Date() })];
            case 15:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 16:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("By title", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a;
                            return ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 2
                                && e.tags.includes('By Any')
                                && e.tags.includes('By Title');
                        }
                    })];
            case 17:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({ title: 'Title', templateId: PLACEHOLDER_ID, durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e.id }] })];
            case 18:
                event4 = _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.updateOne(event4.id, { cancelledAt: new Date() })];
            case 19:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 20:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("By templateId", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a;
                            return ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 3
                                && e.tags.includes('By Any')
                                && e.tags.includes('By Title')
                                && e.tags.includes('By templateId');
                        }
                    })];
            case 21:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({ title: 'Title', durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e.id }] })];
            case 22:
                event5 = _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.updateOne(event5.id, { cancelledAt: new Date(), statusChangeSource: { source: 'enduser', identifier: 'Tellescope' } })];
            case 23:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 24:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("By enduser", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a;
                            return ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 4
                                && e.tags.includes('By Any')
                                && e.tags.includes('By Title')
                                && e.tags.includes('By templateId')
                                && e.tags.includes('By enduser');
                        }
                    })];
            case 25:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({ title: 'Title', durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e.id }] })];
            case 26:
                event6 = _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.updateOne(event6.id, { cancelledAt: new Date(), statusChangeSource: { source: 'user', identifier: 'Tellescope' } })];
            case 27:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 28:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("By user", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a;
                            return ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 5
                                && e.tags.includes('By Any')
                                && e.tags.includes('By Title')
                                && e.tags.includes('By templateId')
                                && e.tags.includes('By enduser')
                                && e.tags.includes('By user');
                        }
                    })];
            case 29:
                _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Appointment Cancelled', info: { excludeTemplateIds: [PLACEHOLDER_ID] } },
                        action: { type: 'Add Tags', info: { tags: ['By excluded templateId'] } },
                        status: 'Active',
                        title: "By excluded templateId"
                    })];
            case 30:
                t6 = _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({ title: 'Title', templateId: PLACEHOLDER_ID, durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e.id }] })];
            case 31:
                event7 = _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.updateOne(event7.id, { cancelledAt: new Date() })];
            case 32:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 33:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("Dont trigger when excluded templateId is provided", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a;
                            return ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 5
                                && e.tags.includes('By Any')
                                && e.tags.includes('By Title')
                                && e.tags.includes('By templateId')
                                && e.tags.includes('By enduser')
                                && e.tags.includes('By user');
                        }
                    })];
            case 34:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({ title: 'Title', durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e.id }] })];
            case 35:
                event8 = _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.updateOne(event8.id, { cancelledAt: new Date() })];
            case 36:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 37:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("Do trigger when excluded templateId is not provided", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a;
                            return ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 6
                                && e.tags.includes('By Any')
                                && e.tags.includes('By Title')
                                && e.tags.includes('By templateId')
                                && e.tags.includes('By enduser')
                                && e.tags.includes('By user')
                                && e.tags.includes('By excluded templateId');
                        }
                    })];
            case 38:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.automation_triggers.deleteOne(t1.id),
                        sdk.api.automation_triggers.deleteOne(t2.id),
                        sdk.api.automation_triggers.deleteOne(t3.id),
                        sdk.api.automation_triggers.deleteOne(t4.id),
                        sdk.api.automation_triggers.deleteOne(t5.id),
                        sdk.api.automation_triggers.deleteOne(t6.id),
                        sdk.api.endusers.deleteOne(e.id),
                        sdk.api.calendar_events.deleteOne(event1.id),
                        sdk.api.calendar_events.deleteOne(event2.id),
                        sdk.api.calendar_events.deleteOne(event3.id),
                        sdk.api.calendar_events.deleteOne(event4.id),
                        sdk.api.calendar_events.deleteOne(event5.id),
                        sdk.api.calendar_events.deleteOne(event6.id),
                        sdk.api.calendar_events.deleteOne(event7.id),
                        sdk.api.calendar_events.deleteOne(event8.id),
                    ])];
            case 39:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var appointment_created_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var t1, t2, t3, e, event1, event2, event3, t4, event4, event5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Automation Trigger Tests (Appointment Created)");
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Appointment Created', info: {} },
                        action: { type: 'Add Tags', info: { tags: ['By Any'] } },
                        status: 'Active',
                        title: "By Any"
                    })];
            case 1:
                t1 = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Appointment Created', info: { titles: ['Title'] } },
                        action: { type: 'Add Tags', info: { tags: ['By Title'] } },
                        status: 'Active',
                        title: "By Title"
                    })];
            case 2:
                t2 = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Appointment Created', info: { templateIds: [PLACEHOLDER_ID] } },
                        action: { type: 'Add Tags', info: { tags: ['By templateId'] } },
                        status: 'Active',
                        title: "By templateId"
                    })];
            case 3:
                t3 = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 4:
                e = _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({ title: 'Test 2', durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e.id }] })];
            case 5:
                event1 = _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 6:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("Any cancel", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a;
                            return ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 1
                                && e.tags.includes('By Any');
                        }
                    })];
            case 7:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({ title: 'Title', durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e.id }] })];
            case 8:
                event2 = _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 9:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("By title", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a;
                            return ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 2
                                && e.tags.includes('By Any')
                                && e.tags.includes('By Title');
                        }
                    })];
            case 10:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({ title: 'Title', templateId: PLACEHOLDER_ID, durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e.id }] })];
            case 11:
                event3 = _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 12:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("By templateId", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a;
                            return ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 3
                                && e.tags.includes('By Any')
                                && e.tags.includes('By Title')
                                && e.tags.includes('By templateId');
                        }
                    })];
            case 13:
                _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Appointment Created', info: { excludeTemplateIds: [PLACEHOLDER_ID] } },
                        action: { type: 'Add Tags', info: { tags: ['By excluded templateId'] } },
                        status: 'Active',
                        title: "By excluded templateId"
                    })];
            case 14:
                t4 = _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({ title: 'Title', templateId: PLACEHOLDER_ID, durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e.id }] })];
            case 15:
                event4 = _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 16:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("Dont trigger when excluded templateId is provided", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a;
                            return ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 3
                                && e.tags.includes('By Any')
                                && e.tags.includes('By Title')
                                && e.tags.includes('By templateId');
                        }
                    })];
            case 17:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({ title: 'Title', durationInMinutes: 30, startTimeInMS: Date.now(), attendees: [{ type: 'enduser', id: e.id }] })];
            case 18:
                event5 = _a.sent();
                return [4 /*yield*/, wait(undefined, 500)]; // allow triggers to happen
            case 19:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("Do trigger when excluded templateId is not provided", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a;
                            return ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 4
                                && e.tags.includes('By Any')
                                && e.tags.includes('By Title')
                                && e.tags.includes('By templateId')
                                && e.tags.includes('By excluded templateId');
                        }
                    })];
            case 20:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.automation_triggers.deleteOne(t1.id),
                        sdk.api.automation_triggers.deleteOne(t2.id),
                        sdk.api.automation_triggers.deleteOne(t3.id),
                        sdk.api.automation_triggers.deleteOne(t4.id),
                        sdk.api.endusers.deleteOne(e.id),
                        sdk.api.calendar_events.deleteOne(event1.id),
                        sdk.api.calendar_events.deleteOne(event2.id),
                        sdk.api.calendar_events.deleteOne(event3.id),
                        sdk.api.calendar_events.deleteOne(event4.id),
                        sdk.api.calendar_events.deleteOne(event5.id),
                    ])];
            case 21:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var contact_created_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var t1, t2, t3, t4, t5, e, e2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Automation Trigger Tests (Contact Created)");
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Contact Created', info: {} },
                        action: { type: 'Add Tags', info: { tags: ['No Filter'] } },
                        status: 'Active',
                        title: "1"
                    })];
            case 1:
                t1 = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Contact Created', info: { entityTypes: [] } },
                        action: { type: 'Add Tags', info: { tags: ['Empty Filter'] } },
                        status: 'Active',
                        title: "2"
                    })];
            case 2:
                t2 = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Contact Created', info: { entityTypes: ["Default"] } },
                        action: { type: 'Add Tags', info: { tags: ['Default in Filter'] } },
                        status: 'Active',
                        title: "3"
                    })];
            case 3:
                t3 = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Contact Created', info: { entityTypes: [PLACEHOLDER_ID] } },
                        action: { type: 'Add Tags', info: { tags: ['ID in Filter'] } },
                        status: 'Active',
                        title: "4"
                    })];
            case 4:
                t4 = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Contact Created', info: { entityTypes: [PLACEHOLDER_ID, 'Default'] } },
                        action: { type: 'Add Tags', info: { tags: ['Both'] } },
                        status: 'Active',
                        title: "5"
                    })];
            case 5:
                t5 = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 6:
                e = _a.sent();
                return [4 /*yield*/, wait(undefined, 250)]; // allow triggers to happen
            case 7:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("Default type", function () { return sdk.api.endusers.getOne(e.id); }, {
                        onResult: function (e) {
                            var _a, _b, _c, _d, _f;
                            return !!(((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 4
                                && ((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('No Filter')) && ((_c = e.tags) === null || _c === void 0 ? void 0 : _c.includes('Empty Filter')) && ((_d = e.tags) === null || _d === void 0 ? void 0 : _d.includes('Both'))
                                && ((_f = e.tags) === null || _f === void 0 ? void 0 : _f.includes('Default in Filter')));
                        }
                    })];
            case 8:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ customTypeId: PLACEHOLDER_ID })];
            case 9:
                e2 = _a.sent();
                return [4 /*yield*/, wait(undefined, 250)]; // allow triggers to happen
            case 10:
                _a.sent(); // allow triggers to happen
                return [4 /*yield*/, async_test("Custom type", function () { return sdk.api.endusers.getOne(e2.id); }, {
                        onResult: function (e) {
                            var _a, _b, _c, _d, _f;
                            return !!(((_a = e.tags) === null || _a === void 0 ? void 0 : _a.length) === 4
                                && ((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('No Filter')) && ((_c = e.tags) === null || _c === void 0 ? void 0 : _c.includes('Empty Filter')) && ((_d = e.tags) === null || _d === void 0 ? void 0 : _d.includes('Both'))
                                && ((_f = e.tags) === null || _f === void 0 ? void 0 : _f.includes('ID in Filter')));
                        }
                    })];
            case 11:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.automation_triggers.deleteOne(t1.id),
                        sdk.api.automation_triggers.deleteOne(t2.id),
                        sdk.api.automation_triggers.deleteOne(t3.id),
                        sdk.api.automation_triggers.deleteOne(t4.id),
                        sdk.api.automation_triggers.deleteOne(t5.id),
                        sdk.api.endusers.deleteOne(e.id),
                        sdk.api.endusers.deleteOne(e2.id),
                    ])];
            case 12:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var automation_trigger_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Automation Trigger Tests");
                return [4 /*yield*/, contact_created_tests()];
            case 1:
                _a.sent();
                return [4 /*yield*/, appointment_cancelled_tests()];
            case 2:
                _a.sent();
                return [4 /*yield*/, appointment_created_tests()];
            case 3:
                _a.sent();
                return [4 /*yield*/, order_status_equals_tests()];
            case 4:
                _a.sent();
                return [4 /*yield*/, tag_added_tests()];
            case 5:
                _a.sent();
                return [4 /*yield*/, order_created_tests()];
            case 6:
                _a.sent();
                return [4 /*yield*/, formSubmittedTriggerTests()];
            case 7:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var form_response_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var stringResponse, stringIntakeField, stringTitle, enduser, form, field, field2, accessCode, enduserWithUpdate, recordedResponse;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                log_header("Form Responses");
                stringResponse = 'Test Response Value';
                stringIntakeField = 'testIntakeField';
                stringTitle = 'Test';
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: "formresponse@tellescope.com" })];
            case 1:
                enduser = _d.sent();
                return [4 /*yield*/, sdk.api.forms.createOne({
                        title: 'test form',
                    })];
            case 2:
                form = _d.sent();
                assert(form.numFields === 0, 'numFields bad init', 'num fields on init');
                return [4 /*yield*/, sdk.api.form_fields.createOne({
                        formId: form.id,
                        title: stringTitle,
                        description: 'Enter a string',
                        type: 'string',
                        isOptional: false,
                        intakeField: stringIntakeField,
                        previousFields: [{ type: 'root', info: {} }]
                    })];
            case 3:
                field = _d.sent();
                return [4 /*yield*/, sdk.api.form_fields.createOne({
                        formId: form.id,
                        title: stringTitle,
                        description: 'Enter a string',
                        type: 'string',
                        isOptional: false,
                        intakeField: stringIntakeField,
                        previousFields: [{ type: 'root', info: {} }]
                    })];
            case 4:
                field2 = _d.sent();
                return [4 /*yield*/, wait(undefined, 250)];
            case 5:
                _d.sent();
                return [4 /*yield*/, async_test("numFields incremented on new field", function () { return sdk.api.forms.getOne(form.id); }, { onResult: function (f) { return f.numFields === 2; } })];
            case 6:
                _d.sent();
                return [4 /*yield*/, sdk.api.form_fields.deleteOne(field2.id)];
            case 7:
                _d.sent();
                return [4 /*yield*/, wait(undefined, 250)];
            case 8:
                _d.sent();
                return [4 /*yield*/, async_test("numFields decremented after delete", function () { return sdk.api.forms.getOne(form.id); }, { onResult: function (f) { return f.numFields === 1; } })
                    // await sdk.api.automation_steps.createOne({
                    //   event: { type: "formResponse", info: { formId: form.id } },
                    //   action: { type: 'sendWebhook', info: { message: 'test' } },
                    // })
                ];
            case 9:
                _d.sent();
                return [4 /*yield*/, sdk.api.form_responses.prepare_form_response({ formId: form.id, enduserId: enduser.id })];
            case 10:
                accessCode = (_d.sent()).accessCode;
                return [4 /*yield*/, sdk.api.form_responses.submit_form_response({ accessCode: accessCode, responses: [
                            {
                                fieldTitle: 'doesnot matter',
                                fieldId: field.id,
                                answer: {
                                    type: 'string',
                                    value: stringResponse,
                                },
                            }
                        ] })
                    // const [triggeredAutomation] = await sdk.api.automated_actions.getSome()
                ];
            case 11:
                _d.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne(enduser.id)];
            case 12:
                enduserWithUpdate = _d.sent();
                return [4 /*yield*/, sdk.api.form_responses.getOne({ accessCode: accessCode })
                    // assert(triggeredAutomation?.event?.type === 'formResponse', 'no form response event', 'form response event triggered')
                ];
            case 13:
                recordedResponse = _d.sent();
                // assert(triggeredAutomation?.event?.type === 'formResponse', 'no form response event', 'form response event triggered')
                assert(((_a = enduserWithUpdate === null || enduserWithUpdate === void 0 ? void 0 : enduserWithUpdate.fields) === null || _a === void 0 ? void 0 : _a[stringIntakeField]) === stringResponse, 'no enduser update', 'enduser updated');
                assert(((_b = recordedResponse === null || recordedResponse === void 0 ? void 0 : recordedResponse.responses) === null || _b === void 0 ? void 0 : _b.length) === 1 && ((_c = recordedResponse.responses[0]) === null || _c === void 0 ? void 0 : _c.answer.value) === stringResponse, 'response not recorded', 'response recorded');
                return [4 /*yield*/, async_test("Can set lockedAt field on form response", function () { return sdk.api.form_responses.updateOne(recordedResponse.id, { lockedAt: new Date() }); }, { onResult: function (r) { return !!r.lockedAt; } })];
            case 14:
                _d.sent();
                return [4 /*yield*/, async_test("Can unset lockedAt", function () { return sdk.api.form_responses.updateOne(recordedResponse.id, { lockedAt: '' }); }, { onResult: function (r) { return !r.lockedAt; } })];
            case 15:
                _d.sent();
                return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id)];
            case 16:
                _d.sent();
                return [4 /*yield*/, sdk.api.forms.deleteOne(form.id)];
            case 17:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); };
export var meetings_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var enduser, privateMeeting, publicMeeting;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Meetings");
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: email })];
            case 1:
                enduser = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.set_password({ id: enduser.id, password: password }).catch(console.error)];
            case 2:
                _a.sent();
                return [4 /*yield*/, enduserSDK.authenticate(email, password).catch(console.error)];
            case 3:
                _a.sent();
                return [4 /*yield*/, sdk.api.meetings.start_meeting({})];
            case 4:
                privateMeeting = _a.sent();
                return [4 /*yield*/, sdk.api.meetings.start_meeting({ publicRead: true })];
            case 5:
                publicMeeting = _a.sent();
                return [4 /*yield*/, async_test("Admin can get meetings", sdk.api.meetings.getSome, { onResult: function () { return true; } })];
            case 6:
                _a.sent();
                return [4 /*yield*/, async_test("Non-Admin can't get meetings", sdkNonAdmin.api.meetings.getSome, { shouldError: true, onError: function (e) { return e.message === "Admin access only"; } })];
            case 7:
                _a.sent();
                return [4 /*yield*/, async_test("Enduser can access public meeting, not private meeting", enduserSDK.api.meetings.my_meetings, { onResult: function (ms) { return ms.length === 1 && !!ms.find(function (m) { return m.id === publicMeeting.id; }); } })];
            case 8:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.meetings.end_meeting({ id: publicMeeting.id }),
                        sdk.api.meetings.end_meeting({ id: privateMeeting.id }),
                        sdk.api.endusers.deleteOne(enduser.id),
                    ])
                    // await Promise.all([
                    //   sdk.api.meetings.deleteOne(publicMeeting.id),
                    //   sdk.api.meetings.deleteOne(privateMeeting.id),
                    // ])
                ];
            case 9:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var search_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var e1, e2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Search");
                return [4 /*yield*/, async_test("user_logs earch disabled", function () { return sdk.api.user_logs.getSome({ search: { query: 'john' } }); }, handleAnyError)];
            case 1:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'e1_search@tellescope.com', fname: 'JoHn', lname: "strauss" })];
            case 2:
                e1 = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'e2_search@tellescope.com', fname: 'sebastian', lname: "coates" })];
            case 3:
                e2 = _a.sent();
                return [4 /*yield*/, async_test("Search error message", function () { return sdk.api.endusers.getSome({ search: "alert(1)" }); }, {
                        shouldError: true,
                        onError: function (e) { return !e.message.includes('script') && e.message.startsWith("Error parsing field search: Expecting an object but got alert(1)"); }
                    })];
            case 4:
                _a.sent();
                return [4 /*yield*/, async_test("Search error does not return script tags ", function () { return sdk.api.endusers.getSome({ search: "<script>alert(1)</script>" }); }, {
                        shouldError: true,
                        onError: function (e) { return !e.message.includes('script') && e.message.startsWith("Error parsing field search: Expecting an object but got"); }
                    })];
            case 5:
                _a.sent();
                return [4 /*yield*/, async_test("Search full fname case insensitive", function () { return sdk.api.endusers.getSome({ search: { query: 'john' } }); }, { onResult: function (es) { return es.length === 1 && es[0].id === e1.id; } })];
            case 6:
                _a.sent();
                return [4 /*yield*/, async_test("Search start fname case insensitive", function () { return sdk.api.endusers.getSome({ search: { query: 'joh' } }); }, { onResult: function (es) { return es.length === 1 && es[0].id === e1.id; } })];
            case 7:
                _a.sent();
                return [4 /*yield*/, async_test("Search end fname case insensitive", function () { return sdk.api.endusers.getSome({ search: { query: 'ohn' } }); }, { onResult: function (es) { return es.length === 1 && es[0].id === e1.id; } })];
            case 8:
                _a.sent();
                return [4 /*yield*/, async_test("Search by email", function () { return sdk.api.endusers.getSome({ search: { query: 'search@tellescope' } }); }, { onResult: function (es) { return es.length === 2; } })];
            case 9:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(e1.id),
                        sdk.api.endusers.deleteOne(e2.id),
                    ])];
            case 10:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var notifications_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var room, chat, ticket, ticketNotifications, chatNotifications;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Notifications");
                return [4 /*yield*/, sdk.api.chat_rooms.createOne({ type: 'internal', userIds: [sdk.userInfo.id, sdkNonAdmin.userInfo.id] })];
            case 1:
                room = _a.sent();
                return [4 /*yield*/, sdk.api.chats.createOne({ message: 'test', roomId: room.id, })];
            case 2:
                chat = _a.sent();
                return [4 /*yield*/, sdk.api.tickets.createOne({ title: 'Ticket for notification', owner: sdkNonAdmin.userInfo.id })];
            case 3:
                ticket = _a.sent();
                return [4 /*yield*/, wait(undefined, 250)
                    // neither should throw error
                ]; // notifications may be created in background
            case 4:
                _a.sent(); // notifications may be created in background
                return [4 /*yield*/, sdk.api.user_notifications.getSome({ filter: { type: 'newTicket' } })];
            case 5:
                ticketNotifications = _a.sent();
                return [4 /*yield*/, sdk.api.user_notifications.getSome({ filter: { type: 'newTeamChatMessage' } })];
            case 6:
                chatNotifications = _a.sent();
                assert(!!ticketNotifications.find(function (n) { var _a; return (_a = n.relatedRecords) === null || _a === void 0 ? void 0 : _a.find(function (r) { return r.id === ticket.id; }); }), 'No ticket notification', 'Got notification for new new ticket');
                assert(!!chatNotifications.find(function (notification) { var _a; return (_a = notification.relatedRecords) === null || _a === void 0 ? void 0 : _a.find(function (r) { return r.id === chat.id; }); }), 'No chat notification', 'Got notification for new chat');
                return [4 /*yield*/, Promise.all(__spreadArray([
                        sdk.api.chat_rooms.deleteOne(room.id),
                        sdk.api.tickets.deleteOne(ticket.id),
                        sdk.api.user_notifications.deleteOne(ticketNotifications.find(function (n) { var _a; return (_a = n.relatedRecords) === null || _a === void 0 ? void 0 : _a.find(function (r) { return r.id === ticket.id; }); }).id)
                    ], chatNotifications.map(function (n) {
                        return sdk.api.user_notifications.deleteOne(n.id);
                    }), true))];
            case 7:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var handleAnyError = { shouldError: true, onError: function () { return true; } };
var passOnAnyResult = { onResult: function () { return true; } };
var role_based_access_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var adminId, e, adminTicket, ticketCreatedByNonAdmin, email, sms, calendarEvent, chatRoom, chatMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Role Based Access Tests");
                adminId = sdk.userInfo.id;
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'roletest@gmail.com' })];
            case 1:
                e = _a.sent();
                return [4 /*yield*/, sdk.api.tickets.createOne({ title: 'ticket', enduserId: e.id, owner: adminId })];
            case 2:
                adminTicket = _a.sent();
                return [4 /*yield*/, sdkNonAdmin.api.tickets.createOne({ title: 'ticket' })];
            case 3:
                ticketCreatedByNonAdmin = _a.sent();
                return [4 /*yield*/, sdk.api.emails.createOne({ enduserId: e.id, logOnly: true, subject: 'blah', textContent: 'blah blah' })];
            case 4:
                email = _a.sent();
                return [4 /*yield*/, sdk.api.sms_messages.createOne({ enduserId: e.id, logOnly: true, message: 'blah blah' })];
            case 5:
                sms = _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({
                        attendees: [{ id: e.id, type: 'enduser' }],
                        durationInMinutes: 50,
                        startTimeInMS: 2000000,
                        title: 'Access Test'
                    })];
            case 6:
                calendarEvent = _a.sent();
                return [4 /*yield*/, sdk.api.chat_rooms.createOne({ enduserIds: [e.id] })];
            case 7:
                chatRoom = _a.sent();
                return [4 /*yield*/, sdk.api.chats.createOne({ roomId: chatRoom.id, message: 'test chat access' })];
            case 8:
                chatMessage = _a.sent();
                return [4 /*yield*/, sdk.api.chats.createOne({ roomId: chatRoom.id, message: 'test chat access 2' })
                    // unassigned to enduser access tests
                ];
            case 9:
                _a.sent();
                // unassigned to enduser access tests
                return [4 /*yield*/, async_test("Admin / creator can access enduser without being assigned", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) { return !!e; } })];
            case 10:
                // unassigned to enduser access tests
                _a.sent();
                return [4 /*yield*/, async_test("Unassigned non-admin can't access enduser without being assigned", function () { return sdkNonAdmin.api.endusers.getOne(e.id); }, handleAnyError)];
            case 11:
                _a.sent();
                return [4 /*yield*/, async_test("non-admin for enduser ticket bad", function () { return sdkNonAdmin.api.tickets.getOne(adminTicket.id); }, handleAnyError)];
            case 12:
                _a.sent();
                return [4 /*yield*/, async_test("[bulkd] Admin / creator can access enduser without being assigned", function () { return sdk.bulk_load({ load: [{ model: 'endusers' }] }); }, { onResult: function (r) { var _a, _b; return ((_a = r.results[0]) === null || _a === void 0 ? void 0 : _a.records) !== undefined && ((_b = r.results[0].records) === null || _b === void 0 ? void 0 : _b.find(function (r) { return r.id === e.id; })); } })];
            case 13:
                _a.sent();
                return [4 /*yield*/, async_test("[bulk] Unassigned non-admin can't access enduser without being assigned", function () { return sdkNonAdmin.bulk_load({ load: [{ model: 'endusers' }] }); }, { onResult: function (r) { var _a, _b; return ((_a = r.results[0]) === null || _a === void 0 ? void 0 : _a.records) !== undefined && !((_b = r.results[0].records) === null || _b === void 0 ? void 0 : _b.find(function (r) { return r.id === e.id; })); } })];
            case 14:
                _a.sent();
                return [4 /*yield*/, async_test("non-admin for enduser ticket bad", function () { return sdkNonAdmin.bulk_load({ load: [{ model: 'tickets' }] }); }, { onResult: function (r) { var _a, _b; return ((_a = r.results[0]) === null || _a === void 0 ? void 0 : _a.records) !== undefined && !((_b = r.results[0].records) === null || _b === void 0 ? void 0 : _b.find(function (r) { return r.id === adminTicket.id; })); } })];
            case 15:
                _a.sent();
                return [4 /*yield*/, async_test("Non-admin for own ticket", function () { return sdkNonAdmin.api.tickets.getOne(ticketCreatedByNonAdmin.id); }, passOnAnyResult)];
            case 16:
                _a.sent();
                return [4 /*yield*/, async_test("Non-admin for tickets", function () { return sdkNonAdmin.api.tickets.getSome(); }, { onResult: function (ts) { return ts.length === 1; } })];
            case 17:
                _a.sent();
                return [4 /*yield*/, async_test("[bulk] Non-admin for tickets", function () { return sdkNonAdmin.bulk_load({ load: [{ model: 'tickets' }] }); }, { onResult: function (r) { var _a, _b, _c; return ((_c = (_b = (_a = r.results) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.records) === null || _c === void 0 ? void 0 : _c.length) === 1; } })];
            case 18:
                _a.sent();
                return [4 /*yield*/, async_test("non-admin for email bad", function () { return sdkNonAdmin.api.emails.getOne(email.id); }, handleAnyError)];
            case 19:
                _a.sent();
                return [4 /*yield*/, async_test("[bulk] non-admin for email bad", function () { return sdkNonAdmin.bulk_load({ load: [{ model: 'emails' }] }); }, { onResult: function (r) { var _a, _b, _c; return ((_c = (_b = (_a = r.results) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.records) === null || _c === void 0 ? void 0 : _c.length) === 0; } })];
            case 20:
                _a.sent();
                return [4 /*yield*/, async_test("non-admin for sms bad", function () { return sdkNonAdmin.api.sms_messages.getOne(sms.id); }, handleAnyError)];
            case 21:
                _a.sent();
                return [4 /*yield*/, async_test("admin for calendar", function () { return sdk.api.calendar_events.getOne(calendarEvent.id); }, passOnAnyResult)];
            case 22:
                _a.sent();
                return [4 /*yield*/, async_test("non-admin for calendar bad", function () { return sdkNonAdmin.api.calendar_events.getOne(calendarEvent.id); }, handleAnyError)];
            case 23:
                _a.sent();
                return [4 /*yield*/, async_test("[bulk] non-admin for calendar bad", function () { return sdkNonAdmin.bulk_load({ load: [{ model: 'calendar_events' }] }); }, { onResult: function (r) { var _a, _b, _c; return ((_c = (_b = (_a = r.results) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.records) === null || _c === void 0 ? void 0 : _c.length) === 0; } })];
            case 24:
                _a.sent();
                return [4 /*yield*/, async_test("non-admin for chat room bad", function () { return sdkNonAdmin.api.chat_rooms.getOne(chatRoom.id); }, handleAnyError)];
            case 25:
                _a.sent();
                return [4 /*yield*/, async_test("[bulk] non-admin for chat room bad", function () { return sdkNonAdmin.bulk_load({ load: [{ model: 'chat_rooms' }] }); }, { onResult: function (r) { var _a, _b, _c; return ((_c = (_b = (_a = r.results) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.records) === null || _c === void 0 ? void 0 : _c.length) === 0; } })];
            case 26:
                _a.sent();
                return [4 /*yield*/, async_test("non-admin for chat message bad", function () { return sdkNonAdmin.api.chats.getOne(chatMessage.id); }, handleAnyError)];
            case 27:
                _a.sent();
                return [4 /*yield*/, async_test("[bulk] non-admin for chat message bad", function () { return sdkNonAdmin.bulk_load({ load: [{ model: 'chats' }] }); }, 
                    // { onResult: result => result.results.flatMap(r => r?.records || []).length === 0 }
                    handleAnyError // throws error in this case in enforceForeignAccessConstraints because there are no accessible chats
                    )];
            case 28:
                _a.sent();
                return [4 /*yield*/, async_test("Non-admin for chats", function () { return sdkNonAdmin.api.chats.getSome({ filter: { roomId: chatRoom.id } }); }, handleAnyError)];
            case 29:
                _a.sent();
                return [4 /*yield*/, async_test("Non-admin for tickets with enduserId in filter", function () { return sdkNonAdmin.api.tickets.getSome({ filter: { enduserId: e.id } }); }, { onResult: function (r) { return !r.find(function (t) { return t.id === adminTicket.id; }); } })
                    // unassigned update / delete coverage
                ];
            case 30:
                _a.sent();
                // unassigned update / delete coverage
                return [4 /*yield*/, async_test("non-admin for enduser ticket update bad", function () { return sdkNonAdmin.api.tickets.updateOne(adminTicket.id, { title: 'updated' }); }, handleAnyError)];
            case 31:
                // unassigned update / delete coverage
                _a.sent();
                return [4 /*yield*/, async_test("non-admin for enduser ticket delete bad", function () { return sdkNonAdmin.api.tickets.deleteOne(adminTicket.id); }, handleAnyError)
                    // set assignees
                ];
            case 32:
                _a.sent();
                // set assignees
                return [4 /*yield*/, sdk.api.endusers.updateOne(e.id, { assignedTo: [sdk.userInfo.id, sdkNonAdmin.userInfo.id] })
                    // assigned access tests
                ];
            case 33:
                // set assignees
                _a.sent();
                // assigned access tests
                return [4 /*yield*/, async_test("Admin / creator can access enduser while assigned", function () { return sdk.api.endusers.getOne(e.id); }, passOnAnyResult)];
            case 34:
                // assigned access tests
                _a.sent();
                return [4 /*yield*/, async_test("Unassigned non-admin can access enduser while assigned", function () { return sdkNonAdmin.api.endusers.getOne(e.id); }, passOnAnyResult)];
            case 35:
                _a.sent();
                return [4 /*yield*/, async_test("non-admin for enduser ticket", function () { return sdkNonAdmin.api.tickets.getOne(adminTicket.id); }, passOnAnyResult)];
            case 36:
                _a.sent();
                return [4 /*yield*/, async_test("[bulk] non-admin for enduser ticket", function () { return sdkNonAdmin.bulk_load({ load: [{ model: 'tickets' }] }); }, { onResult: function (r) { var _a, _b, _c; return (_c = (_b = (_a = r.results) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.records) === null || _c === void 0 ? void 0 : _c.find(function (r) { return r.id === adminTicket.id; }); } })];
            case 37:
                _a.sent();
                return [4 /*yield*/, async_test("Non-admin for tickets", function () { return sdkNonAdmin.api.tickets.getSome(); }, { onResult: function (ts) { return ts.length === 2; } })];
            case 38:
                _a.sent();
                return [4 /*yield*/, async_test("non-admin for email", function () { return sdkNonAdmin.api.emails.getOne(email.id); }, passOnAnyResult)];
            case 39:
                _a.sent();
                return [4 /*yield*/, async_test("[bulk] non-admin for email", function () { return sdkNonAdmin.bulk_load({ load: [{ model: 'emails' }] }); }, { onResult: function (r) { var _a, _b, _c; return (_c = (_b = (_a = r.results) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.records) === null || _c === void 0 ? void 0 : _c.find(function (r) { return r.id === email.id; }); } })];
            case 40:
                _a.sent();
                return [4 /*yield*/, async_test("non-admin for sms", function () { return sdkNonAdmin.api.sms_messages.getOne(sms.id); }, passOnAnyResult)];
            case 41:
                _a.sent();
                return [4 /*yield*/, async_test("non-admin for calendar", function () { return sdkNonAdmin.api.calendar_events.getOne(calendarEvent.id); }, passOnAnyResult)];
            case 42:
                _a.sent();
                return [4 /*yield*/, async_test("[bulk] non-admin for calendar", function () { return sdkNonAdmin.bulk_load({ load: [{ model: 'calendar_events' }] }); }, { onResult: function (r) { var _a, _b, _c; return (_c = (_b = (_a = r.results) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.records) === null || _c === void 0 ? void 0 : _c.find(function (r) { return r.id === calendarEvent.id; }); } })];
            case 43:
                _a.sent();
                return [4 /*yield*/, async_test("non-admin for chat room", function () { return sdkNonAdmin.api.chat_rooms.getOne(chatRoom.id); }, passOnAnyResult)];
            case 44:
                _a.sent();
                return [4 /*yield*/, async_test("[bulk] non-admin for chat room", function () { return sdkNonAdmin.bulk_load({ load: [{ model: 'chat_rooms' }] }); }, { onResult: function (r) { var _a, _b, _c; return (_c = (_b = (_a = r.results) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.records) === null || _c === void 0 ? void 0 : _c.find(function (r) { return r.id === chatRoom.id; }); } })];
            case 45:
                _a.sent();
                return [4 /*yield*/, async_test("non-admin for chat message", function () { return sdkNonAdmin.api.chats.getOne(chatMessage.id); }, passOnAnyResult)];
            case 46:
                _a.sent();
                return [4 /*yield*/, async_test("[bulk] non-admin for chat message", function () { return sdkNonAdmin.bulk_load({ load: [{ model: 'chats' }] }); }, { onResult: function (r) { var _a, _b, _c; return (_c = (_b = (_a = r.results) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.records) === null || _c === void 0 ? void 0 : _c.find(function (r) { return r.id === chatMessage.id; }); } })];
            case 47:
                _a.sent();
                return [4 /*yield*/, async_test("Non-admin for chats", function () { return sdkNonAdmin.api.chats.getSome({ filter: { roomId: chatRoom.id } }); }, { onResult: function (cs) { return cs.length === 2; } })
                    // update / delete coverage for assigned tickets
                ];
            case 48:
                _a.sent();
                // update / delete coverage for assigned tickets
                return [4 /*yield*/, async_test("non-admin assigned enduser ticket update find", function () { return sdkNonAdmin.api.tickets.updateOne(adminTicket.id, { title: 'updated' }); }, passOnAnyResult)];
            case 49:
                // update / delete coverage for assigned tickets
                _a.sent();
                return [4 /*yield*/, async_test("non-admin for enduser ticket delete still bad", function () { return sdkNonAdmin.api.tickets.deleteOne(adminTicket.id); }, handleAnyError)
                    // cleanup
                ];
            case 50:
                _a.sent();
                // cleanup
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(e.id),
                        sdk.api.calendar_events.deleteOne(calendarEvent.id),
                        sdk.api.chat_rooms.deleteOne(chatRoom.id),
                        sdk.api.tickets.deleteOne(ticketCreatedByNonAdmin.id), // not associated with enduser, needs own cleanup
                    ])];
            case 51:
                // cleanup
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var status_update_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var journey, enduser, status;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Enduser Status Updates");
                return [4 /*yield*/, sdk.api.journeys.createOne({ title: 'test' })];
            case 1:
                journey = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'delete@tellescope.com' })];
            case 2:
                enduser = _a.sent();
                return [4 /*yield*/, sdk.api.enduser_status_updates.createOne({ enduserId: enduser.id, journeyId: journey.id, status: "Working" })
                    // status update on enduser is a side effect
                ];
            case 3:
                status = _a.sent();
                // status update on enduser is a side effect
                return [4 /*yield*/, wait(undefined, 100)];
            case 4:
                // status update on enduser is a side effect
                _a.sent();
                return [4 /*yield*/, async_test("status update", function () { return sdk.api.endusers.getOne(enduser.id); }, {
                        onResult: function (e) { var _a; return ((_a = e.journeys) === null || _a === void 0 ? void 0 : _a[journey.id]) === status.status; }
                    })];
            case 5:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.journeys.deleteOne(journey.id),
                        sdk.api.endusers.deleteOne(enduser.id), // status deleted as side effect
                    ])];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var community_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var enduser, forum, privateForum, enduserPost, userPost, enduserSelfComment, userComment, userSelfPost, userSelfPostComment, _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                log_header("Community");
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: email })];
            case 1:
                enduser = _d.sent();
                return [4 /*yield*/, sdk.api.endusers.set_password({ id: enduser.id, password: password }).catch(console.error)];
            case 2:
                _d.sent();
                return [4 /*yield*/, enduserSDK.authenticate(email, password).catch(console.error)];
            case 3:
                _d.sent();
                return [4 /*yield*/, sdk.api.forums.createOne({ title: 'test', publicRead: true })];
            case 4:
                forum = _d.sent();
                return [4 /*yield*/, sdk.api.forums.createOne({ title: 'test 2', publicRead: false })];
            case 5:
                privateForum = _d.sent();
                return [4 /*yield*/, async_test("enduser access forum", function () { return enduserSDK.api.forums.getOne(forum.id); }, { onResult: function (f) { return f.id === forum.id; } })];
            case 6:
                _d.sent();
                return [4 /*yield*/, async_test("enduser access privateForum error", function () { return enduserSDK.api.forums.getOne(privateForum.id); }, handleAnyError)];
            case 7:
                _d.sent();
                return [4 /*yield*/, enduserSDK.api.forum_posts.createOne({ title: 'title', forumId: forum.id, htmlContent: 'enduser', textContent: 'enduser' })];
            case 8:
                enduserPost = _d.sent();
                assert(!!enduserPost, 'enduser post failed', 'enduser post successful');
                return [4 /*yield*/, sdk.api.forum_posts.createOne({ title: 'title', forumId: forum.id, htmlContent: 'user', textContent: 'user' })];
            case 9:
                userPost = _d.sent();
                assert(!!userPost, 'user post failed', 'user post successful');
                assert(enduserPost.numComments === 0 && enduserPost.numLikes === 0, 'counts not initialized', 'counts initialized at 0');
                return [4 /*yield*/, async_test("enduser post private\u00A0errors", function () { return enduserSDK.api.forum_posts.createOne({ title: 'title', forumId: privateForum.id, htmlContent: 'enduser', textContent: 'enduser' }); }, handleAnyError)];
            case 10:
                _d.sent();
                return [4 /*yield*/, async_test("enduser can access single post for forumId", function () { return enduserSDK.api.forum_posts.getOne({ forumId: forum.id }); }, passOnAnyResult)];
            case 11:
                _d.sent();
                return [4 /*yield*/, async_test("enduser can access self post by id", function () { return enduserSDK.api.forum_posts.getOne(enduserPost.id); }, passOnAnyResult)];
            case 12:
                _d.sent();
                return [4 /*yield*/, async_test("enduser can access other post by id", function () { return enduserSDK.api.forum_posts.getOne(userPost.id); }, passOnAnyResult)];
            case 13:
                _d.sent();
                return [4 /*yield*/, async_test("enduser can access posts", function () { return enduserSDK.api.forum_posts.getSome({ filter: { forumId: forum.id } }); }, { onResult: function (r) { return r.length === 2; } })];
            case 14:
                _d.sent();
                return [4 /*yield*/, enduserSDK.api.post_comments.createOne({ forumId: forum.id, postId: enduserPost.id, htmlContent: 'enduser', textContent: 'enduser' })];
            case 15:
                enduserSelfComment = _d.sent();
                return [4 /*yield*/, sdk.api.post_comments.createOne({ forumId: forum.id, postId: enduserPost.id, htmlContent: 'user', textContent: 'user' })];
            case 16:
                userComment = _d.sent();
                assert(!!enduserSelfComment, 'enduser comment failed', 'enduser comment successful');
                assert(!!userComment, 'user comment failed', 'user comment successful');
                return [4 /*yield*/, async_test("enduser can access post comments", function () { return enduserSDK.api.post_comments.getSome({ filter: { forumId: forum.id, postId: enduserPost.id } }); }, { onResult: function (r) { return r.length === 2; } })];
            case 17:
                _d.sent();
                return [4 /*yield*/, enduserSDK.api.post_likes.createOne({ forumId: forum.id, postId: enduserPost.id })];
            case 18:
                _d.sent();
                return [4 /*yield*/, async_test("double-like not allowed", function () { return enduserSDK.api.post_likes.createOne({ forumId: forum.id, postId: enduserPost.id }); }, handleAnyError)];
            case 19:
                _d.sent();
                return [4 /*yield*/, wait(undefined, 50)];
            case 20:
                _d.sent();
                return [4 /*yield*/, async_test("post and like counts on create", function () { return sdk.api.forum_posts.getOne(enduserPost.id); }, { onResult: function (p) { return p.numComments === 2 && p.numLikes === 1; } })];
            case 21:
                _d.sent();
                return [4 /*yield*/, enduserSDK.api.post_likes.unlike_post({ postId: enduserPost.id, forumId: enduserPost.forumId })];
            case 22:
                _d.sent();
                return [4 /*yield*/, wait(undefined, 50)];
            case 23:
                _d.sent();
                return [4 /*yield*/, async_test("post and like counts after unlike", function () { return sdk.api.forum_posts.getOne(enduserPost.id); }, { onResult: function (p) { return p.numComments === 2 && p.numLikes === 0; } })];
            case 24:
                _d.sent();
                return [4 /*yield*/, sdk.api.forum_posts.createOne({ title: 'title', forumId: privateForum.id, htmlContent: 'user', textContent: 'user' })];
            case 25:
                userSelfPost = _d.sent();
                assert(!!userSelfPost, 'user private post failed', 'user private post successful');
                return [4 /*yield*/, sdk.api.post_comments.createOne({ forumId: privateForum.id, postId: userSelfPost.id, htmlContent: 'user', textContent: 'user' })];
            case 26:
                userSelfPostComment = _d.sent();
                assert(!!userSelfPostComment, 'user private post comment failed', 'user private post comment successful');
                return [4 /*yield*/, async_test("enduser comment private\u00A0errors", function () { return enduserSDK.api.post_comments.createOne({ forumId: privateForum.id, postId: userSelfPost.id, htmlContent: 'enduser', textContent: 'enduser' }); }, handleAnyError)];
            case 27:
                _d.sent();
                return [4 /*yield*/, async_test('enduser cannot access private post by id', function () { return enduserSDK.api.forum_posts.getOne(userSelfPost.id); }, handleAnyError)];
            case 28:
                _d.sent();
                return [4 /*yield*/, async_test('enduser cannot access private post by filter', function () { return enduserSDK.api.forum_posts.getOne({ forumId: privateForum.id }); }, handleAnyError)];
            case 29:
                _d.sent();
                return [4 /*yield*/, async_test('enduser cannot access private comment by id', function () { return enduserSDK.api.post_comments.getOne(userSelfPostComment.id); }, handleAnyError)];
            case 30:
                _d.sent();
                return [4 /*yield*/, async_test('enduser cannot access private comment by filter (forum id)', function () { return enduserSDK.api.post_comments.getOne({ forumId: privateForum.id }); }, handleAnyError)];
            case 31:
                _d.sent();
                return [4 /*yield*/, async_test('enduser cannot access private comment by filter (post id)', function () { return enduserSDK.api.post_comments.getOne({ postId: userSelfPost.id }); }, handleAnyError)];
            case 32:
                _d.sent();
                return [4 /*yield*/, async_test('enduser cannot access private comment by filter (forum and post id)', function () { return enduserSDK.api.post_comments.getOne({ forumId: privateForum.id, postId: userSelfPost.id }); }, handleAnyError)];
            case 33:
                _d.sent();
                return [4 /*yield*/, async_test('enduser cannot access private posts', function () { return enduserSDK.api.forum_posts.getSome({ filter: { forumId: privateForum.id } }); }, handleAnyError)];
            case 34:
                _d.sent();
                return [4 /*yield*/, async_test('enduser cannot access private comments', function () { return enduserSDK.api.post_comments.getSome({ filter: { forumId: privateForum.id } }); }, handleAnyError)];
            case 35:
                _d.sent();
                _b = (_a = Promise).all;
                return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id)];
            case 36:
                _c = [
                    _d.sent()
                ];
                return [4 /*yield*/, sdk.api.forums.deleteOne(forum.id)];
            case 37:
                _c = _c.concat([
                    _d.sent()
                ]);
                return [4 /*yield*/, sdk.api.forums.deleteOne(privateForum.id)];
            case 38: return [4 /*yield*/, _b.apply(_a, [_c.concat([
                        _d.sent()
                    ])])];
            case 39:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); };
var redaction_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var enduser, enduserOther, endusers, forUser, redactedFields, zoomIntegration, notZoomIntegration;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Redaction");
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: email })];
            case 1:
                enduser = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'otherenduser@tellescope.com' })];
            case 2:
                enduserOther = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.set_password({ id: enduser.id, password: password }).catch(console.error)];
            case 3:
                _a.sent();
                return [4 /*yield*/, enduserSDK.authenticate(email, password).catch(console.error)];
            case 4:
                _a.sent();
                return [4 /*yield*/, enduserSDK.api.endusers.getSome()];
            case 5:
                endusers = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.getSome()];
            case 6:
                forUser = _a.sent();
                assert(endusers.length > 0, "enduser can't fetch others", "enduser get others successful");
                redactedFields = (Object.keys(schema.endusers.fields)
                    .filter(function (f) {
                    var _a, _b, _c, _d;
                    return ((_b = (_a = schema.endusers.fields[f]) === null || _a === void 0 ? void 0 : _a.redactions) === null || _b === void 0 ? void 0 : _b.includes('enduser'))
                        || ((_d = (_c = schema.endusers.fields[f]) === null || _c === void 0 ? void 0 : _c.redactions) === null || _d === void 0 ? void 0 : _d.includes('all'));
                }));
                assert(redactedFields.length > 0, 'no redacted fields', 'redacted fields exists');
                assert(endusers.find(function (e) { return redactedFields.filter(function (f) { return !!e[f]; }).length > 0; }) === undefined, 'got redacted data', 'data correctly redacted');
                assert(!forUser.find(function (u) { return u.hashedPassword; }), 'got redacted data', 'hashed password redacted, even for admin user');
                return [4 /*yield*/, sdk.api.integrations.createOne({
                        title: ZOOM_TITLE,
                        authentication: {
                            type: 'oauth2',
                            info: {
                                access_token: 'token',
                                expiry_date: new Date().getTime(),
                                refresh_token: 'refresh_token',
                                scope: '',
                                token_type: 'Bearer',
                            }
                        }
                    })];
            case 7:
                zoomIntegration = _a.sent();
                return [4 /*yield*/, sdk.api.integrations.createOne({
                        title: "Not Zoom",
                        authentication: {
                            type: 'oauth2',
                            info: {
                                access_token: 'token',
                                expiry_date: new Date().getTime(),
                                refresh_token: 'refresh_token',
                                scope: '',
                                token_type: 'Bearer',
                            }
                        }
                    })];
            case 8:
                notZoomIntegration = _a.sent();
                return [4 /*yield*/, async_test('Zoom integration redacts authentication info', function () { return sdk.api.integrations.getOne(zoomIntegration); }, { onResult: function (i) { return !i.authentication; } })];
            case 9:
                _a.sent();
                return [4 /*yield*/, async_test('Generic integration includes authentication info (for now, while used in front-end for some integrations like Zendesk)', function () { return sdk.api.integrations.getOne(notZoomIntegration); }, { onResult: function (i) { return !!i.authentication; } })];
            case 10:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(enduser.id),
                        sdk.api.endusers.deleteOne(enduserOther.id),
                        sdk.api.integrations.deleteOne(zoomIntegration.id),
                        sdk.api.integrations.deleteOne(notZoomIntegration.id),
                    ])];
            case 11:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var public_form_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var journey, nonPublicForm, form, submitInfo, submitInfoNonPublic, field, testResponse, responseInfo, enduser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Public Form");
                return [4 /*yield*/, sdk.api.journeys.createOne({ title: 'test journey ' })];
            case 1:
                journey = _a.sent();
                return [4 /*yield*/, sdk.api.forms.createOne({
                        title: 'test form',
                        intakePhone: 'optional',
                    })];
            case 2:
                nonPublicForm = _a.sent();
                return [4 /*yield*/, sdk.api.forms.createOne({
                        title: 'test form',
                        allowPublicURL: true,
                        intakePhone: 'optional',
                    })];
            case 3:
                form = _a.sent();
                submitInfo = {
                    businessId: form.businessId,
                    email: 'publicformtest@tellescope.com',
                    formId: form.id,
                    fname: 'sebastian',
                    lname: 'coates',
                };
                submitInfoNonPublic = __assign(__assign({}, submitInfo), { formId: nonPublicForm.id });
                return [4 /*yield*/, async_test('non-public form blocked', function () { return enduserSDK.api.form_responses.session_for_public_form(submitInfoNonPublic); }, handleAnyError)];
            case 4:
                _a.sent();
                return [4 /*yield*/, async_test('no questions form blocked', function () { return enduserSDK.api.form_responses.session_for_public_form(submitInfo); }, handleAnyError)];
            case 5:
                _a.sent();
                return [4 /*yield*/, sdk.api.form_fields.createOne({
                        formId: form.id,
                        title: 'question',
                        type: 'string',
                        previousFields: [{ type: 'root', info: {} }]
                    })];
            case 6:
                field = _a.sent();
                testResponse = {
                    answer: {
                        type: 'string',
                        value: 'answer'
                    },
                    fieldId: field.id,
                    fieldTitle: field.title,
                };
                return [4 /*yield*/, enduserSDK.api.form_responses.session_for_public_form(submitInfo)
                    // verify enduser is actually upserted
                ];
            case 7:
                responseInfo = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne({ email: 'publicformtest@tellescope.com' })
                    // test case for existing enduser
                ];
            case 8:
                enduser = _a.sent();
                // test case for existing enduser
                return [4 /*yield*/, enduserSDK.api.form_responses.session_for_public_form(submitInfo)];
            case 9:
                // test case for existing enduser
                _a.sent();
                enduserSDK.setAuthToken(responseInfo.authToken);
                return [4 /*yield*/, enduserSDK.refresh_session()
                    // assert((enduserSDK.userInfo as any).allowedPaths.length === 3, 'allowed paths not preserved', 'allowed paths preserved after refresh')
                ]; // should be allowed
            case 10:
                _a.sent(); // should be allowed
                // assert((enduserSDK.userInfo as any).allowedPaths.length === 3, 'allowed paths not preserved', 'allowed paths preserved after refresh')
                return [4 /*yield*/, async_test('enduser cannot use non-allowed path', function () { return enduserSDK.api.endusers.updateOne(enduserSDK.userInfo.id, { fields: { testFiedl: 'testValue' } }); }, handleAnyError)];
            case 11:
                // assert((enduserSDK.userInfo as any).allowedPaths.length === 3, 'allowed paths not preserved', 'allowed paths preserved after refresh')
                _a.sent();
                return [4 /*yield*/, async_test('enduser can submit public form', function () { return enduserSDK.api.form_responses.submit_form_response({ accessCode: responseInfo.accessCode, responses: [testResponse] }); }, passOnAnyResult)];
            case 12:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.forms.deleteOne(form.id),
                        sdk.api.journeys.deleteOne(journey.id),
                        sdk.api.endusers.deleteOne(enduser.id),
                    ])];
            case 13:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
export var managed_content_records_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var record, record2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Managed Content Records");
                return [4 /*yield*/, enduserSDK.register({ email: 'content@tellescope.com', password: "testenduserpassword" })];
            case 1:
                _a.sent();
                return [4 /*yield*/, enduserSDK.authenticate('content@tellescope.com', "testenduserpassword")];
            case 2:
                _a.sent();
                return [4 /*yield*/, sdk.api.managed_content_records.createOne({
                        title: "title", htmlContent: '<br />', textContent: 'content',
                        publicRead: true,
                    })];
            case 3:
                record = _a.sent();
                return [4 /*yield*/, sdk.api.managed_content_records.createOne({
                        title: "title 2", htmlContent: '<br />', textContent: 'content',
                        publicRead: false,
                    })];
            case 4:
                record2 = _a.sent();
                return [4 /*yield*/, async_test('enduser can access content by default (1)', function () { return enduserSDK.api.managed_content_records.getOne(record.id); }, passOnAnyResult)];
            case 5:
                _a.sent();
                return [4 /*yield*/, async_test('enduser can access content by default (many)', function () { return enduserSDK.api.managed_content_records.getSome(); }, { onResult: function (rs) { return rs.length === 1; } })];
            case 6:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(enduserSDK.userInfo.id),
                        sdk.api.managed_content_records.deleteOne(record.id),
                        sdk.api.managed_content_records.deleteOne(record2.id),
                    ])];
            case 7:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
export var calendar_event_RSVPs_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var event, event2, userRSVP, enduserRSVP;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Calendar Event RSVPs");
                return [4 /*yield*/, enduserSDK.register({ email: 'rsvps@tellescope.com', password: "testenduserpassword" })];
            case 1:
                _a.sent();
                return [4 /*yield*/, enduserSDK.authenticate('rsvps@tellescope.com', "testenduserpassword")];
            case 2:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({
                        title: "RSVP Event",
                        startTimeInMS: Date.now(),
                        durationInMinutes: 60,
                    })];
            case 3:
                event = _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({
                        title: "RSVP Event 2",
                        startTimeInMS: Date.now(),
                        durationInMinutes: 60,
                    })];
            case 4:
                event2 = _a.sent();
                return [4 /*yield*/, sdk.api.calendar_event_RSVPs.createOne({ eventId: event.id })];
            case 5:
                userRSVP = _a.sent();
                assert(userRSVP.displayName === sdk.userInfo.fname, 'display name init bad', 'display name init');
                return [4 /*yield*/, sdk.api.calendar_event_RSVPs.createOne({ eventId: event2.id })]; // can create second event for non-match
            case 6:
                _a.sent(); // can create second event for non-match
                return [4 /*yield*/, enduserSDK.api.calendar_event_RSVPs.createOne({ eventId: event.id })];
            case 7:
                enduserRSVP = _a.sent();
                return [4 /*yield*/, async_test('user cannot create duplicate RSVP', function () { return sdk.api.calendar_event_RSVPs.createOne({ eventId: event.id }); }, { shouldError: true, onError: function (e) { return e.message === UniquenessViolationMessage; } })];
            case 8:
                _a.sent();
                return [4 /*yield*/, async_test('enduser cannot create duplicate RSVP', function () { return enduserSDK.api.calendar_event_RSVPs.createOne({ eventId: event.id }); }, { shouldError: true, onError: function (e) { return e.message === UniquenessViolationMessage; } })];
            case 9:
                _a.sent();
                return [4 /*yield*/, async_test('enduser cannot delete user RSVP', function () { return enduserSDK.api.calendar_event_RSVPs.deleteOne(userRSVP.id); }, handleAnyError)];
            case 10:
                _a.sent();
                return [4 /*yield*/, async_test('user cannot delete enduser RSVP', function () { return sdk.api.calendar_event_RSVPs.deleteOne(enduserRSVP.id); }, handleAnyError)];
            case 11:
                _a.sent();
                return [4 /*yield*/, async_test('enduser cannot update user RSVP', function () { return enduserSDK.api.calendar_event_RSVPs.updateOne(userRSVP.id, { status: 'Maybe' }); }, handleAnyError)];
            case 12:
                _a.sent();
                return [4 /*yield*/, async_test('user cannot update enduser RSVP', function () { return sdk.api.calendar_event_RSVPs.updateOne(enduserRSVP.id, { status: 'Maybe' }); }, handleAnyError)];
            case 13:
                _a.sent();
                return [4 /*yield*/, async_test('RSVPs incremented', function () { return sdk.api.calendar_events.getOne(event.id); }, { onResult: function (c) { return c.numRSVPs === 2; } })];
            case 14:
                _a.sent();
                return [4 /*yield*/, async_test('enduser can delete own RSVP', function () { return enduserSDK.api.calendar_event_RSVPs.deleteOne(enduserRSVP.id); }, passOnAnyResult)];
            case 15:
                _a.sent();
                return [4 /*yield*/, async_test('user can delete own RSVP', function () { return sdk.api.calendar_event_RSVPs.deleteOne(userRSVP.id); }, passOnAnyResult)];
            case 16:
                _a.sent();
                return [4 /*yield*/, async_test('RSVPs decremented', function () { return sdk.api.calendar_events.getOne(event.id); }, { onResult: function (c) { return c.numRSVPs === 0; } })];
            case 17:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(enduserSDK.userInfo.id),
                        sdk.api.calendar_events.deleteOne(event.id),
                        sdk.api.calendar_events.deleteOne(event2.id),
                    ])];
            case 18:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var post_comments_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var forumId, postId, userComment, enduserCommentInReply, userLike, enduserLike;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Post Comments");
                return [4 /*yield*/, enduserSDK.register({ email: 'rsvps@tellescope.com', password: "testenduserpassword" })];
            case 1:
                _a.sent();
                return [4 /*yield*/, enduserSDK.authenticate('rsvps@tellescope.com', "testenduserpassword")];
            case 2:
                _a.sent();
                return [4 /*yield*/, sdk.api.forums.createOne({ title: "RSVP Event", publicRead: true })];
            case 3:
                forumId = (_a.sent()).id;
                return [4 /*yield*/, sdk.api.forum_posts.createOne({ forumId: forumId, title: 'Post', htmlContent: '', textContent: '', })];
            case 4:
                postId = (_a.sent()).id;
                return [4 /*yield*/, sdk.api.post_comments.createOne({
                        forumId: forumId,
                        postId: postId,
                        htmlContent: '', textContent: '',
                    })];
            case 5:
                userComment = _a.sent();
                return [4 /*yield*/, enduserSDK.api.post_comments.createOne({
                        forumId: forumId,
                        postId: postId,
                        htmlContent: '', textContent: '',
                        threadId: userComment.id, replyTo: userComment.id,
                    })];
            case 6:
                enduserCommentInReply = _a.sent();
                return [4 /*yield*/, wait(undefined, 500)];
            case 7:
                _a.sent();
                return [4 /*yield*/, async_test('num replies incremented', function () { return sdk.api.post_comments.getOne({ id: postId, forumId: forumId }); }, { onResult: function (c) { return c.numReplies === 1; } })];
            case 8:
                _a.sent();
                return [4 /*yield*/, sdk.api.comment_likes.createOne({
                        forumId: forumId,
                        postId: postId,
                        commentId: userComment.id,
                    })];
            case 9:
                userLike = _a.sent();
                return [4 /*yield*/, enduserSDK.api.comment_likes.createOne({
                        forumId: forumId,
                        postId: postId,
                        commentId: userComment.id,
                    })];
            case 10:
                enduserLike = _a.sent();
                return [4 /*yield*/, async_test('num likes incremented', function () { return sdk.api.post_comments.getOne({ id: postId, forumId: forumId }); }, { onResult: function (c) { return c.numLikes === 2; } })];
            case 11:
                _a.sent();
                return [4 /*yield*/, async_test('user cannot create duplicate comment like', function () { return sdk.api.comment_likes.createOne({ forumId: forumId, postId: postId, commentId: userComment.id }); }, { shouldError: true, onError: function (e) { return e.message === UniquenessViolationMessage; } })];
            case 12:
                _a.sent();
                return [4 /*yield*/, async_test('enduser cannot create duplicate comment like', function () { return enduserSDK.api.comment_likes.createOne({ forumId: forumId, postId: postId, commentId: userComment.id }); }, { shouldError: true, onError: function (e) { return e.message === UniquenessViolationMessage; } })];
            case 13:
                _a.sent();
                return [4 /*yield*/, enduserSDK.api.post_comments.deleteOne(enduserCommentInReply.id)];
            case 14:
                _a.sent();
                return [4 /*yield*/, async_test('num comments decrementted', function () { return sdk.api.post_comments.getOne({ id: postId, forumId: forumId }); }, { onResult: function (c) { return c.numReplies === 0; } })];
            case 15:
                _a.sent();
                return [4 /*yield*/, sdk.api.comment_likes.deleteOne(userLike.id)];
            case 16:
                _a.sent();
                return [4 /*yield*/, enduserSDK.api.comment_likes.deleteOne(enduserLike.id)];
            case 17:
                _a.sent();
                return [4 /*yield*/, async_test('num likes decremented', function () { return sdk.api.post_comments.getOne({ id: postId, forumId: forumId }); }, { onResult: function (c) { return c.numLikes === 0; } })];
            case 18:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(enduserSDK.userInfo.id),
                        sdk.api.forums.deleteOne(forumId)
                    ])];
            case 19:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
export var databases_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var database, databaseNoRead, databaseRecord;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Databases");
                return [4 /*yield*/, sdk.api.databases.createOne({
                        title: "__Test__Database",
                        fields: [{ type: 'Text', label: "String" }],
                        // organizationRead: true,
                    })];
            case 1:
                database = (_a.sent());
                return [4 /*yield*/, sdk.api.databases.createOne({
                        title: "__Test__Database No Read",
                        fields: [{ type: 'Text', label: "String" }],
                        // organizationRead: false,
                    })];
            case 2:
                databaseNoRead = (_a.sent());
                return [4 /*yield*/, sdk.api.database_records.createOne({
                        databaseId: database.id,
                        values: [{ type: 'Text', value: 'value', label: 'label' }],
                    })];
            case 3:
                databaseRecord = _a.sent();
                return [4 /*yield*/, wait(undefined, 250)];
            case 4:
                _a.sent();
                return [4 /*yield*/, async_test('numRecords incremented', function () { return sdk.api.databases.getOne(database.id); }, { onResult: function (c) { return c.numRecords === 1; } })];
            case 5:
                _a.sent();
                return [4 /*yield*/, async_test('Non admin can access correctly', function () { return sdkNonAdmin.api.databases.getOne(database.id); }, passOnAnyResult)
                    // await async_test(
                    //   'Non admin cannot access correctly',
                    //   () => sdkNonAdmin.api.databases.getOne(databaseNoRead.id),
                    //   handleAnyError,
                    // )
                    // cleanup and test cache
                ];
            case 6:
                _a.sent();
                // await async_test(
                //   'Non admin cannot access correctly',
                //   () => sdkNonAdmin.api.databases.getOne(databaseNoRead.id),
                //   handleAnyError,
                // )
                // cleanup and test cache
                return [4 /*yield*/, sdk.api.database_records.deleteOne(databaseRecord.id)];
            case 7:
                // await async_test(
                //   'Non admin cannot access correctly',
                //   () => sdkNonAdmin.api.databases.getOne(databaseNoRead.id),
                //   handleAnyError,
                // )
                // cleanup and test cache
                _a.sent();
                return [4 /*yield*/, wait(undefined, 250)];
            case 8:
                _a.sent();
                return [4 /*yield*/, async_test('numRecords decremented', function () { return sdk.api.databases.getOne(database.id); }, { onResult: function (c) { return c.numRecords === 0; } })];
            case 9:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.databases.deleteOne(database.id),
                        sdk.api.databases.deleteOne(databaseNoRead.id),
                    ])];
            case 10:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
export var filter_by_date_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var enduser1, now, enduser2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Filter by Dates");
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'deleteme@tellescope.com' })];
            case 1:
                enduser1 = _a.sent();
                return [4 /*yield*/, wait(undefined, 2000)]; // ensure meaningful delay in createdAt timestamp
            case 2:
                _a.sent(); // ensure meaningful delay in createdAt timestamp
                now = new Date();
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'deleteme2@tellescope.com' })];
            case 3:
                enduser2 = _a.sent();
                return [4 /*yield*/, async_test('Filtered by from', function () { return sdk.api.endusers.getSome({ from: now }); }, { onResult: function (es) { return (es.length === 1
                            && es[0].email === enduser2.email); } })];
            case 4:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(enduser1.id),
                        sdk.api.endusers.deleteOne(enduser2.id),
                    ])];
            case 5: return [2 /*return*/, _a.sent()];
        }
    });
}); };
export var self_serve_appointment_booking_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var e1, e2, e3, event15min, event30min, event30minGroup, dayOfWeekStartingSundayIndexedByZero, enduserSDK2, enduserSDK3, nySlots, bookedAppointment, conflict, groupEvent, multiSlots, bookedMultiAppointment, conflict2, conflict3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Self Serve Appointment Booking");
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'sebass+ny@tellescope.com', state: 'NY' })];
            case 1:
                e1 = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'sebass+ca@tellescope.com', state: 'CA' })];
            case 2:
                e2 = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'sebass+3@tellescope.com' })];
            case 3:
                e3 = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.set_password({ id: e1.id, password: password })];
            case 4:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.set_password({ id: e2.id, password: password })];
            case 5:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.set_password({ id: e3.id, password: password })];
            case 6:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_event_templates.createOne({
                        title: 'test 2', durationInMinutes: 15,
                        confirmationEmailDisabled: true,
                        confirmationSMSDisabled: true,
                    })];
            case 7:
                event15min = _a.sent();
                return [4 /*yield*/, sdk.api.calendar_event_templates.createOne({
                        title: 'test 1', durationInMinutes: 30,
                        confirmationEmailDisabled: true,
                        confirmationSMSDisabled: true,
                    })];
            case 8:
                event30min = _a.sent();
                return [4 /*yield*/, sdk.api.calendar_event_templates.createOne({
                        title: 'test group', durationInMinutes: 30,
                        confirmationEmailDisabled: true,
                        confirmationSMSDisabled: true,
                        enduserAttendeeLimit: 2,
                    })
                    // ensure it doesn't match current day, to avoid errors on testing
                ];
            case 9:
                event30minGroup = _a.sent();
                dayOfWeekStartingSundayIndexedByZero = (new Date().getDay() + 1) % 7;
                return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, {
                        weeklyAvailabilities: [
                            {
                                dayOfWeekStartingSundayIndexedByZero: dayOfWeekStartingSundayIndexedByZero,
                                startTimeInMinutes: 60 * 12,
                                endTimeInMinutes: 60 * 13, // 1pm,
                            },
                            {
                                dayOfWeekStartingSundayIndexedByZero: dayOfWeekStartingSundayIndexedByZero,
                                startTimeInMinutes: 60 * 12,
                                endTimeInMinutes: 60 * 13, // 1pm,
                            },
                        ],
                        credentialedStates: [{ state: 'NY' }, { state: "CA" }],
                        timezone: 'America/New_York',
                    }, {
                        replaceObjectFields: true,
                    })];
            case 10:
                _a.sent();
                return [4 /*yield*/, sdkNonAdmin.api.users.updateOne(sdkNonAdmin.userInfo.id, {
                        weeklyAvailabilities: [
                            {
                                dayOfWeekStartingSundayIndexedByZero: dayOfWeekStartingSundayIndexedByZero,
                                startTimeInMinutes: 60 * 12,
                                endTimeInMinutes: 60 * 13, // 1pm,
                            },
                        ],
                        credentialedStates: [{ state: "CA" }],
                        timezone: 'America/Los_Angeles',
                    }, {
                        replaceObjectFields: true,
                    })];
            case 11:
                _a.sent();
                enduserSDK2 = new EnduserSession({ host: host, businessId: businessId });
                return [4 /*yield*/, enduserSDK2.authenticate('sebass+ca@tellescope.com', password).catch(console.error)];
            case 12:
                _a.sent();
                enduserSDK3 = new EnduserSession({ host: host, businessId: businessId });
                return [4 /*yield*/, enduserSDK3.authenticate('sebass+3@tellescope.com', password).catch(console.error)
                    // NY Enduser Tests
                ];
            case 13:
                _a.sent();
                // NY Enduser Tests
                return [4 /*yield*/, enduserSDK.authenticate('sebass+ny@tellescope.com', password).catch(console.error)];
            case 14:
                // NY Enduser Tests
                _a.sent();
                return [4 /*yield*/, async_test('30 minute slots for state restriction', function () { return enduserSDK.api.calendar_events.get_appointment_availability({
                        calendarEventTemplateId: event30min.id,
                        from: new Date(Date.now() - 10000),
                        to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                        restrictedByState: true,
                    }); }, { onResult: function (r) { return r.availabilityBlocks.length === 2; } })];
            case 15:
                _a.sent();
                return [4 /*yield*/, async_test('30 minute slots for state restriction (called as user)', function () { return sdk.api.calendar_events.get_appointment_availability({
                        calendarEventTemplateId: event30min.id,
                        from: new Date(Date.now() - 10000),
                        to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                        restrictedByState: true,
                        state: "NY", // same state as enduserSDK
                    }); }, { onResult: function (r) { return r.availabilityBlocks.length === 2; } })];
            case 16:
                _a.sent();
                return [4 /*yield*/, async_test('30 minute slots for state restriction with 15 min interval', function () { return enduserSDK.api.calendar_events.get_appointment_availability({
                        calendarEventTemplateId: event30min.id,
                        from: new Date(Date.now() - 10000),
                        to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                        restrictedByState: true,
                        intervalInMinutes: 15,
                    }); }, { onResult: function (r) { return r.availabilityBlocks.length === 3; } })];
            case 17:
                _a.sent();
                return [4 /*yield*/, async_test('30 minute slots for state restriction with 10 min interval', function () { return enduserSDK.api.calendar_events.get_appointment_availability({
                        calendarEventTemplateId: event30min.id,
                        from: new Date(Date.now() - 10000),
                        to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                        restrictedByState: true,
                        intervalInMinutes: 10,
                    }); }, { onResult: function (r) { return r.availabilityBlocks.length === 4; } })];
            case 18:
                _a.sent();
                return [4 /*yield*/, async_test('30 minute slots for no state restrictions', function () { return enduserSDK.api.calendar_events.get_appointment_availability({
                        calendarEventTemplateId: event30min.id,
                        from: new Date(Date.now() - 10000),
                        to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                        restrictedByState: false,
                    }); }, { onResult: function (r) {
                            if (r.availabilityBlocks.length !== 4)
                                return false; // 2 providers with 1 hour availability for 30 minute meetings
                            var user1block1_ET = r.availabilityBlocks.find(function (b) { return b.userId === sdk.userInfo.id; });
                            var user2block1_PT = r.availabilityBlocks.find(function (b) { return b.userId === sdkNonAdmin.userInfo.id; });
                            if (!(user1block1_ET && user2block1_PT))
                                return false; // should be slots for both users
                            if (user2block1_PT.startTimeInMS - user1block1_ET.startTimeInMS !== 1000 * 60 * 60 * 3) {
                                return false; // difference should be three hours, since same availability in different timezones
                            }
                            return true;
                        } })];
            case 19:
                _a.sent();
                return [4 /*yield*/, enduserSDK.api.calendar_events.get_appointment_availability({
                        calendarEventTemplateId: event30min.id,
                        from: new Date(Date.now() - 10000),
                        to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                        restrictedByState: true,
                    })];
            case 20:
                nySlots = _a.sent();
                return [4 /*yield*/, enduserSDK.api.calendar_events.book_appointment({
                        calendarEventTemplateId: event30min.id,
                        startTime: new Date(nySlots.availabilityBlocks[0].startTimeInMS),
                        userId: nySlots.availabilityBlocks[0].userId,
                        fields: {
                            test: "Custom",
                            fields: "Test",
                        }
                    })];
            case 21:
                bookedAppointment = (_a.sent()).createdEvent;
                assert(bookedAppointment.attendees.length === 2, 'did not get 2 attendees', '2 attendees fo non-multi-event');
                return [4 /*yield*/, async_test('double-booking prevented', function () { return enduserSDK.api.calendar_events.book_appointment({
                        calendarEventTemplateId: event30min.id,
                        startTime: new Date(nySlots.availabilityBlocks[0].startTimeInMS),
                        userId: nySlots.availabilityBlocks[0].userId,
                    }); }, handleAnyError)];
            case 22:
                _a.sent();
                return [4 /*yield*/, async_test('30 minute slots for state restriction with 1 overlapping conflict', function () { return enduserSDK.api.calendar_events.get_appointment_availability({
                        calendarEventTemplateId: event30min.id,
                        from: new Date(Date.now() - 10000),
                        to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                        restrictedByState: true,
                    }); }, { onResult: function (r) {
                            return r.availabilityBlocks.length === 1
                                && r.availabilityBlocks[0].startTimeInMS === nySlots.availabilityBlocks[1].startTimeInMS;
                        } // the first slot of nySlots is booked
                    })];
            case 23:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({
                        title: 'conflict',
                        startTimeInMS: nySlots.availabilityBlocks[1].startTimeInMS,
                        durationInMinutes: nySlots.availabilityBlocks[1].durationInMinutes,
                        attendees: [{ type: 'user', id: sdk.userInfo.id }]
                    })];
            case 24:
                conflict = _a.sent();
                return [4 /*yield*/, async_test('30 minute slots for state restriction with 2 overlapping conflict', function () { return enduserSDK.api.calendar_events.get_appointment_availability({
                        calendarEventTemplateId: event30min.id,
                        from: new Date(Date.now() - 10000),
                        to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                        restrictedByState: true,
                    }); }, { onResult: function (r) { return r.availabilityBlocks.length === 0; } })];
            case 25:
                _a.sent();
                return [4 /*yield*/, async_test('booking against conflict prevented', function () { return enduserSDK.api.calendar_events.book_appointment({
                        calendarEventTemplateId: event30min.id,
                        startTime: new Date(nySlots.availabilityBlocks[1].startTimeInMS),
                        userId: nySlots.availabilityBlocks[1].userId,
                    }); }, handleAnyError)
                    // test group bookings
                ];
            case 26:
                _a.sent();
                // test group bookings
                return [4 /*yield*/, sdk.api.calendar_events.updateOne(conflict.id, { enduserAttendeeLimit: 2 })];
            case 27:
                // test group bookings
                _a.sent();
                return [4 /*yield*/, async_test('[group booking] different event type conflict as group still blocks availability', function () { return enduserSDK.api.calendar_events.get_appointment_availability({
                        calendarEventTemplateId: event30minGroup.id,
                        from: new Date(Date.now() - 10000),
                        to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                    }); }, { onResult: function (r) { return r.availabilityBlocks.length === 2; } })];
            case 28:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.deleteOne(conflict.id)];
            case 29:
                _a.sent();
                return [4 /*yield*/, async_test('[group booking] availability', function () { return enduserSDK.api.calendar_events.get_appointment_availability({
                        calendarEventTemplateId: event30minGroup.id,
                        from: new Date(Date.now() - 10000),
                        to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                    }); }, { onResult: function (r) { return r.availabilityBlocks.length === 3; } })];
            case 30:
                _a.sent();
                return [4 /*yield*/, enduserSDK.api.calendar_events.book_appointment({
                        calendarEventTemplateId: event30minGroup.id,
                        startTime: new Date(nySlots.availabilityBlocks[1].startTimeInMS),
                        userId: nySlots.availabilityBlocks[1].userId,
                    })];
            case 31:
                groupEvent = (_a.sent()).createdEvent;
                return [4 /*yield*/, async_test('[group booking] more booking allowed', function () { return enduserSDK.api.calendar_events.get_appointment_availability({
                        calendarEventTemplateId: event30minGroup.id,
                        from: new Date(Date.now() - 10000),
                        to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                    }); }, { onResult: function (r) { return r.availabilityBlocks.length === 3; } })];
            case 32:
                _a.sent();
                return [4 /*yield*/, async_test('[group booking] prevent double-book same-enduser', function () { return enduserSDK.api.calendar_events.book_appointment({
                        calendarEventTemplateId: event30minGroup.id,
                        startTime: new Date(nySlots.availabilityBlocks[1].startTimeInMS),
                        userId: nySlots.availabilityBlocks[1].userId,
                    }); }, handleAnyError)];
            case 33:
                _a.sent();
                return [4 /*yield*/, async_test('[group booking] allow other enduser to book', function () { return enduserSDK2.api.calendar_events.book_appointment({
                        calendarEventTemplateId: event30minGroup.id,
                        startTime: new Date(nySlots.availabilityBlocks[1].startTimeInMS),
                        userId: nySlots.availabilityBlocks[1].userId,
                    }); }, passOnAnyResult)];
            case 34:
                _a.sent();
                return [4 /*yield*/, async_test('[group booking] no more booking allowed', function () { return enduserSDK.api.calendar_events.get_appointment_availability({
                        calendarEventTemplateId: event30minGroup.id,
                        from: new Date(Date.now() - 10000),
                        to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                    }); }, { onResult: function (r) { return r.availabilityBlocks.length === 2; } })];
            case 35:
                _a.sent();
                return [4 /*yield*/, async_test('[group booking] other enduser cant book over capacity', function () { return enduserSDK3.api.calendar_events.book_appointment({
                        calendarEventTemplateId: event30minGroup.id,
                        startTime: new Date(nySlots.availabilityBlocks[1].startTimeInMS),
                        userId: nySlots.availabilityBlocks[1].userId,
                    }); }, handleAnyError)
                    // test 'multi' flag for booking multiple providers for a given patient
                ];
            case 36:
                _a.sent();
                // test 'multi' flag for booking multiple providers for a given patient
                return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, {
                        weeklyAvailabilities: [
                            {
                                dayOfWeekStartingSundayIndexedByZero: 0,
                                startTimeInMinutes: 60 * 12,
                                endTimeInMinutes: 60 * 13, // 1pm,
                            },
                        ],
                        timezone: 'America/New_York',
                    }, {
                        replaceObjectFields: true,
                    })];
            case 37:
                // test 'multi' flag for booking multiple providers for a given patient
                _a.sent();
                return [4 /*yield*/, sdkNonAdmin.api.users.updateOne(sdkNonAdmin.userInfo.id, {
                        weeklyAvailabilities: [
                            {
                                dayOfWeekStartingSundayIndexedByZero: 0,
                                startTimeInMinutes: 60 * 12,
                                endTimeInMinutes: 60 * 14, // 2pm,
                            },
                        ],
                        timezone: 'America/New_York',
                    }, {
                        replaceObjectFields: true,
                    })];
            case 38:
                _a.sent();
                return [4 /*yield*/, enduserSDK.api.calendar_events.get_appointment_availability({
                        calendarEventTemplateId: event30min.id,
                        from: new Date(Date.now()),
                        to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                        multi: true,
                        userIds: [sdk.userInfo.id, sdkNonAdmin.userInfo.id]
                    })];
            case 39:
                multiSlots = _a.sent();
                assert(multiSlots.availabilityBlocks.length === 2, 'expected 2 slots', 'multi slots are intersection of availability');
                return [4 /*yield*/, enduserSDK.api.calendar_events.book_appointment({
                        calendarEventTemplateId: event30min.id,
                        startTime: new Date(multiSlots.availabilityBlocks[0].startTimeInMS),
                        userId: sdk.userInfo.id,
                        otherUserIds: [sdkNonAdmin.userInfo.id]
                    })];
            case 40:
                bookedMultiAppointment = (_a.sent()).createdEvent;
                assert((bookedMultiAppointment.attendees.length === 3
                    && bookedMultiAppointment.attendees.filter(function (a) { return a.type === 'enduser'; }).length === 1), 'did not get valid attendees', 'Multi attendees fo multi-event');
                return [4 /*yield*/, async_test('booking against conflict prevented 1 user', function () { return enduserSDK.api.calendar_events.book_appointment({
                        calendarEventTemplateId: event30min.id,
                        startTime: new Date(multiSlots.availabilityBlocks[0].startTimeInMS),
                        userId: sdk.userInfo.id,
                    }); }, handleAnyError)];
            case 41:
                _a.sent();
                return [4 /*yield*/, async_test('booking against conflict prevented other user', function () { return enduserSDK.api.calendar_events.book_appointment({
                        calendarEventTemplateId: event30min.id,
                        startTime: new Date(multiSlots.availabilityBlocks[0].startTimeInMS),
                        userId: sdkNonAdmin.userInfo.id,
                    }); }, handleAnyError)];
            case 42:
                _a.sent();
                return [4 /*yield*/, async_test('booking against conflict prevented 2 users', function () { return enduserSDK.api.calendar_events.book_appointment({
                        calendarEventTemplateId: event30min.id,
                        startTime: new Date(multiSlots.availabilityBlocks[0].startTimeInMS),
                        userId: sdk.userInfo.id,
                        otherUserIds: [sdkNonAdmin.userInfo.id],
                    }); }, handleAnyError)];
            case 43:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({
                        title: 'conflict',
                        startTimeInMS: nySlots.availabilityBlocks[0].startTimeInMS,
                        durationInMinutes: nySlots.availabilityBlocks[0].durationInMinutes,
                        attendees: [{ type: 'user', id: sdk.userInfo.id }]
                    })];
            case 44:
                conflict2 = _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.updateOne(conflict2.id, { bufferEndMinutes: 30 })];
            case 45:
                _a.sent();
                return [4 /*yield*/, async_test('Event buffer end prevents booking', function () { return enduserSDK.api.calendar_events.book_appointment({
                        calendarEventTemplateId: event30min.id,
                        startTime: new Date(nySlots.availabilityBlocks[1].startTimeInMS),
                        userId: nySlots.availabilityBlocks[1].userId,
                    }); }, handleAnyError)];
            case 46:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.updateOne(conflict2.id, { bufferEndMinutes: 0 })];
            case 47:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_event_templates.updateOne(event30min.id, { bufferStartMinutes: 30 })];
            case 48:
                _a.sent();
                return [4 /*yield*/, async_test('Template buffer start prevents booking', function () { return enduserSDK.api.calendar_events.book_appointment({
                        calendarEventTemplateId: event30min.id,
                        startTime: new Date(nySlots.availabilityBlocks[1].startTimeInMS),
                        userId: nySlots.availabilityBlocks[1].userId,
                    }); }, handleAnyError)];
            case 49:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_event_templates.updateOne(event30min.id, { bufferStartMinutes: 0 })];
            case 50:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.deleteOne(conflict2.id)];
            case 51:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({
                        title: 'conflict',
                        startTimeInMS: nySlots.availabilityBlocks[1].startTimeInMS,
                        durationInMinutes: nySlots.availabilityBlocks[1].durationInMinutes,
                        attendees: [{ type: 'user', id: sdk.userInfo.id }]
                    })];
            case 52:
                conflict3 = _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.updateOne(conflict3.id, { bufferStartMinutes: 30 })];
            case 53:
                _a.sent();
                return [4 /*yield*/, async_test('Event buffer start prevents booking', function () { return enduserSDK.api.calendar_events.book_appointment({
                        calendarEventTemplateId: event30min.id,
                        startTime: new Date(nySlots.availabilityBlocks[0].startTimeInMS),
                        userId: nySlots.availabilityBlocks[0].userId,
                    }); }, handleAnyError)];
            case 54:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.updateOne(conflict3.id, { bufferStartMinutes: 0 })];
            case 55:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_event_templates.updateOne(event30min.id, { bufferEndMinutes: 30 })];
            case 56:
                _a.sent();
                return [4 /*yield*/, async_test('Template buffer end prevents booking', function () { return enduserSDK.api.calendar_events.book_appointment({
                        calendarEventTemplateId: event30min.id,
                        startTime: new Date(nySlots.availabilityBlocks[0].startTimeInMS),
                        userId: nySlots.availabilityBlocks[0].userId,
                    }); }, handleAnyError)];
            case 57:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(e1.id),
                        sdk.api.endusers.deleteOne(e2.id),
                        sdk.api.endusers.deleteOne(e3.id),
                        sdk.api.calendar_event_templates.deleteOne(event30min.id),
                        sdk.api.calendar_event_templates.deleteOne(event30minGroup.id),
                        sdk.api.calendar_event_templates.deleteOne(event15min.id),
                        sdk.api.calendar_events.deleteOne(bookedAppointment.id),
                        sdk.api.calendar_events.deleteOne(bookedMultiAppointment.id),
                        sdk.api.calendar_events.deleteOne(groupEvent.id),
                        sdk.api.calendar_events.deleteOne(conflict3.id),
                    ])];
            case 58:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
export var role_based_access_permissions_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var noEnduserAccessRole, rbap, sdkNonAdminId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Role Based Access Permission (Custom Roles)");
                noEnduserAccessRole = 'no-enduser-access';
                return [4 /*yield*/, sdk.api.role_based_access_permissions.createOne({
                        role: noEnduserAccessRole,
                        permissions: {
                            endusers: {
                                create: null,
                                read: null,
                                delete: null,
                                update: null,
                            }
                        }
                    })];
            case 1:
                rbap = _a.sent();
                sdkNonAdminId = sdkNonAdmin.userInfo.id;
                return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdminId, { roles: [noEnduserAccessRole] }, { replaceObjectFields: true })];
            case 2:
                _a.sent();
                return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)]; // to use new role, handle logout on role change
            case 3:
                _a.sent(); // to use new role, handle logout on role change
                return [4 /*yield*/, async_test('non-root admin can read', function () { return sdkSub.api.role_based_access_permissions.getOne(rbap.id); }, passOnAnyResult)];
            case 4:
                _a.sent();
                return [4 /*yield*/, async_test('non-root admin can read many', function () { return sdkSub.api.role_based_access_permissions.getSome(); }, { onResult: function (rs) { return rs.length > 0; } })];
            case 5:
                _a.sent();
                return [4 /*yield*/, async_test('non-root admin blocked create', function () { return sdkSub.api.role_based_access_permissions.createOne({
                        role: noEnduserAccessRole,
                        permissions: {
                            endusers: {
                                create: null,
                                read: null,
                                delete: null,
                                update: null,
                            }
                        }
                    }); }, handleAnyError)];
            case 6:
                _a.sent();
                return [4 /*yield*/, async_test('non-root admin blocked update', function () { return sdkSub.api.role_based_access_permissions.updateOne(rbap.id, { role: 'updated' }); }, handleAnyError)];
            case 7:
                _a.sent();
                return [4 /*yield*/, async_test('non-root admin blocked delete', function () { return sdkSub.api.role_based_access_permissions.deleteOne(rbap.id); }, handleAnyError)];
            case 8:
                _a.sent();
                return [4 /*yield*/, async_test('enduser read access restriction working', function () { return sdkNonAdmin.api.endusers.getSome(); }, handleAnyError)
                    // cleanup
                ];
            case 9:
                _a.sent();
                // cleanup
                return [4 /*yield*/, sdk.api.role_based_access_permissions.deleteOne(rbap.id)];
            case 10:
                // cleanup
                _a.sent();
                return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdminId, { roles: ['Non-Admin'] }, { replaceObjectFields: true })];
            case 11:
                _a.sent();
                return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)]; // to use new role, handle logout on role change
            case 12:
                _a.sent(); // to use new role, handle logout on role change
                return [2 /*return*/];
        }
    });
}); };
// runs tests and resets availability afterwards
// creates a new enduser (to avoid duplicate autoreply)
var run_autoreply_test = function (title, _a) {
    var expectingAutoreply = _a.expectingAutoreply;
    return __awaiter(void 0, void 0, void 0, function () {
        var enduser, room, blocks;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_header("Autoreply: ".concat(title));
                    return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'Autoreply', lname: "Test", email: "autoreply@tellescope.com" })];
                case 1:
                    enduser = _b.sent();
                    return [4 /*yield*/, sdk.api.endusers.set_password({ id: enduser.id, password: password })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, enduserSDK.authenticate(enduser.email, password)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.chat_rooms.createOne({
                            userIds: [sdk.userInfo.id],
                            enduserIds: [enduser.id]
                        })];
                case 4:
                    room = _b.sent();
                    return [4 /*yield*/, sdk.api.chats.createOne({ roomId: room.id, message: 'user' })];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, wait(undefined, 50)];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, async_test('User/outbound chat does not trigger autoreply', function () { return sdk.api.chats.getSome({ filter: { roomId: room.id } }); }, { onResult: function (cs) { return cs.length === 1; } })];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, enduserSDK.api.chats.createOne({ roomId: room.id, message: 'enduser' })];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, async_test('Main test', function () { return pollForResults(function () { return sdk.api.chats.getSome({ filter: { roomId: room.id } }); }, function (cs) { return (expectingAutoreply
                            ? cs.length === 3
                            : cs.length === 2); }, 25, 10); }, passOnAnyResult)];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, enduserSDK.api.chats.createOne({ roomId: room.id, message: 'enduser again' })];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, wait(undefined, 50)];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, async_test("Duplicate autoreply avoided", function () { return sdk.api.chats.getSome({ filter: { roomId: room.id } }); }, { onResult: function (cs) { return (expectingAutoreply
                                ? cs.length === 4
                                : cs.length === 3); } })
                        // cleanup, including any availability blocks
                    ];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, sdk.api.availability_blocks.getSome()];
                case 13:
                    blocks = _b.sent();
                    return [4 /*yield*/, Promise.all(__spreadArray([
                            sdk.api.endusers.deleteOne(enduser.id),
                            sdk.api.chat_rooms.deleteOne(room.id),
                            // cleanup availabilities
                            sdk.api.users.updateOne(sdk.userInfo.id, {
                                weeklyAvailabilities: []
                            }, {
                                replaceObjectFields: true
                            })
                        ], blocks.map(function (b) { return (sdk.api.availability_blocks.deleteOne(b.id)); }), true))];
                case 14:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
};
var auto_reply_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var today, activeBlockInfo, activeWithRange, inactiveEarly, inactiveLate, wrongDayBlockInfo, wrongEntityTypeBlockInfo, wrongEntityIdInfo, wrongTimeBlockInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // cleanup user availabilities / autoReplyEnabled to avoid conflicts
            return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, {
                    autoReplyEnabled: false,
                    weeklyAvailabilities: [],
                }, { replaceObjectFields: true })];
            case 1:
                // cleanup user availabilities / autoReplyEnabled to avoid conflicts
                _a.sent();
                log_header("Autoreply (Organization-wide)");
                return [4 /*yield*/, run_autoreply_test('No availabilities', { expectingAutoreply: false })];
            case 2:
                _a.sent();
                today = new Date();
                activeBlockInfo = {
                    dayOfWeekStartingSundayIndexedByZero: today.getDay(),
                    startTimeInMinutes: 0,
                    endTimeInMinutes: 60 * 24,
                    entity: 'organization',
                    entityId: sdk.userInfo.businessId,
                    index: 0,
                };
                activeWithRange = __assign(__assign({}, activeBlockInfo), { active: {
                        from: new Date(Date.now() - 1000000),
                        to: new Date(Date.now() + 1000000),
                    } });
                inactiveEarly = __assign(__assign({}, activeBlockInfo), { active: { from: new Date(Date.now() + 1000000) } });
                inactiveLate = __assign(__assign({}, activeBlockInfo), { active: { to: new Date(Date.now() - 1000000) } });
                wrongDayBlockInfo = __assign(__assign({}, activeBlockInfo), { dayOfWeekStartingSundayIndexedByZero: (today.getDay() + 1) % 7 });
                wrongEntityTypeBlockInfo = __assign(__assign({}, activeBlockInfo), { entity: 'user' });
                wrongEntityIdInfo = __assign(__assign({}, activeBlockInfo), { entityId: sdk.userInfo.id });
                wrongTimeBlockInfo = __assign(__assign({}, activeBlockInfo), { endTimeInMinutes: 0 });
                return [4 /*yield*/, sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
                        settings: { endusers: { autoReplyEnabled: false } }
                    })];
            case 3:
                _a.sent();
                return [4 /*yield*/, sdk.api.availability_blocks.createSome([wrongTimeBlockInfo])];
            case 4:
                _a.sent();
                return [4 /*yield*/, run_autoreply_test('Autoreply disabled', { expectingAutoreply: false })];
            case 5:
                _a.sent();
                return [4 /*yield*/, sdk.api.organizations.updateOne(sdk.userInfo.businessId, {
                        settings: { endusers: { autoReplyEnabled: true } }
                    })];
            case 6:
                _a.sent();
                return [4 /*yield*/, sdk.api.availability_blocks.createSome([wrongTimeBlockInfo])];
            case 7:
                _a.sent();
                return [4 /*yield*/, run_autoreply_test('One bad', { expectingAutoreply: true })];
            case 8:
                _a.sent();
                return [4 /*yield*/, sdk.api.availability_blocks.createSome([
                        inactiveEarly,
                        inactiveLate,
                        wrongDayBlockInfo,
                        wrongEntityIdInfo,
                        wrongEntityTypeBlockInfo,
                        wrongTimeBlockInfo,
                    ])];
            case 9:
                _a.sent();
                return [4 /*yield*/, run_autoreply_test('Multiple bad blocks', { expectingAutoreply: true })];
            case 10:
                _a.sent();
                return [4 /*yield*/, sdk.api.availability_blocks.createSome([activeBlockInfo])];
            case 11:
                _a.sent();
                return [4 /*yield*/, run_autoreply_test('One active block', { expectingAutoreply: false })];
            case 12:
                _a.sent();
                return [4 /*yield*/, sdk.api.availability_blocks.createSome([activeWithRange])];
            case 13:
                _a.sent();
                return [4 /*yield*/, run_autoreply_test('One active with range', { expectingAutoreply: false })];
            case 14:
                _a.sent();
                return [4 /*yield*/, sdk.api.availability_blocks.createSome([activeBlockInfo, activeWithRange, activeBlockInfo, activeWithRange])];
            case 15:
                _a.sent();
                return [4 /*yield*/, run_autoreply_test('Multiple active blocks', { expectingAutoreply: false })];
            case 16:
                _a.sent();
                log_header("Autoreply (User)");
                return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, {
                        autoReplyEnabled: false,
                    })];
            case 17:
                _a.sent();
                return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, {
                        weeklyAvailabilities: [wrongTimeBlockInfo]
                    })];
            case 18:
                _a.sent();
                return [4 /*yield*/, run_autoreply_test('User: Autoreply disabled', { expectingAutoreply: false })];
            case 19:
                _a.sent();
                return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, {
                        autoReplyEnabled: true,
                    })];
            case 20:
                _a.sent();
                return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, { weeklyAvailabilities: [wrongTimeBlockInfo] })];
            case 21:
                _a.sent();
                return [4 /*yield*/, run_autoreply_test('User: One bad', { expectingAutoreply: true })];
            case 22:
                _a.sent();
                return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, {
                        weeklyAvailabilities: [
                            inactiveEarly,
                            inactiveLate,
                            wrongDayBlockInfo,
                        ]
                    })];
            case 23:
                _a.sent();
                return [4 /*yield*/, run_autoreply_test('User: Multiple bad blocks', { expectingAutoreply: true })];
            case 24:
                _a.sent();
                return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, { weeklyAvailabilities: [activeBlockInfo] })];
            case 25:
                _a.sent();
                return [4 /*yield*/, run_autoreply_test('User: One active block', { expectingAutoreply: false })];
            case 26:
                _a.sent();
                return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, { weeklyAvailabilities: [activeWithRange] })];
            case 27:
                _a.sent();
                return [4 /*yield*/, run_autoreply_test('User: One active with range', { expectingAutoreply: false })];
            case 28:
                _a.sent();
                return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, { weeklyAvailabilities: [activeBlockInfo, activeWithRange, activeBlockInfo, activeWithRange] })];
            case 29:
                _a.sent();
                return [4 /*yield*/, run_autoreply_test('User: Multiple active blocks', { expectingAutoreply: false })];
            case 30:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var merge_enduser_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var stripeCustomerId, stripeKey, _a, source, destination, otherEnduser, _b, emailToMove, email, _c, eventToMove, event, _d, roomToMove, room, chatToMove, chat;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                log_header("Merge Endusers");
                stripeCustomerId = 'example_cu_id';
                stripeKey = 'example_stripe_key';
                return [4 /*yield*/, sdk.api.endusers.createSome([
                        {
                            email: 'source@tellescope.com', fname: 'source', lname: 'enduser',
                            references: [{ type: '2', id: '2.2' }, { type: '3', id: '3.2' }, { type: '4', id: '4.2' }],
                            // @ts-ignore
                            stripeCustomerId: stripeCustomerId,
                            stripeKey: stripeKey,
                        },
                        { email: 'destination@tellescope.com', source: '4', externalId: "4", references: [{ type: '1', id: '1' }, { type: '2', id: '2' }] },
                        { email: 'other@tellescope.com' },
                    ])];
            case 1:
                _a = (_f.sent()).created, source = _a[0], destination = _a[1], otherEnduser = _a[2];
                return [4 /*yield*/, sdk.api.emails.createSome([
                        { enduserId: source.id, subject: 'subject', logOnly: true, textContent: 'email' },
                        { enduserId: otherEnduser.id, subject: 'subject', logOnly: true, textContent: 'email' },
                    ])];
            case 2:
                _b = (_f.sent()).created, emailToMove = _b[0], email = _b[1];
                return [4 /*yield*/, sdk.api.calendar_events.createSome([
                        { attendees: [{ type: 'enduser', id: source.id }], durationInMinutes: 5, startTimeInMS: Date.now(), title: 'title' },
                        { attendees: [{ type: 'enduser', id: otherEnduser.id }], durationInMinutes: 5, startTimeInMS: Date.now(), title: 'title' },
                    ])];
            case 3:
                _c = (_f.sent()).created, eventToMove = _c[0], event = _c[1];
                return [4 /*yield*/, sdk.api.chat_rooms.createSome([
                        { enduserIds: [source.id], title: 'title' },
                        { enduserIds: [otherEnduser.id], title: 'title' },
                    ])];
            case 4:
                _d = (_f.sent()).created, roomToMove = _d[0], room = _d[1];
                return [4 /*yield*/, sdk.api.chats.createOne({ roomId: roomToMove.id, senderId: source.id, message: 'test' })];
            case 5:
                chatToMove = _f.sent();
                return [4 /*yield*/, sdk.api.chats.createOne({
                        roomId: room.id, senderId: otherEnduser.id, message: 'test'
                    })];
            case 6:
                chat = _f.sent();
                return [4 /*yield*/, sdk.api.endusers.merge({ sourceEnduserId: source.id, destinationEnduserId: destination.id })];
            case 7:
                _f.sent();
                return [4 /*yield*/, async_test("Source is deleted", function () { return sdk.api.endusers.getOne(source.id); }, handleAnyError)];
            case 8:
                _f.sent();
                return [4 /*yield*/, async_test("Destination merged", function () { return sdk.api.endusers.getOne(destination.id); }, { onResult: function (e) {
                            var _a, _b, _c, _d, _f, _g, _h, _j;
                            return (e.email === destination.email
                                && e.fname === source.fname
                                && e.lname === source.lname
                                && e.stripeKey === stripeKey
                                && e.stripeCustomerId === stripeCustomerId
                                && e.source === '4' && e.externalId === '4' // should prevent 4 from syncing to references at all
                                && ((_b = (_a = e.references) === null || _a === void 0 ? void 0 : _a.find(function (r) { return r.type === '1'; })) === null || _b === void 0 ? void 0 : _b.id) === '1'
                                && ((_d = (_c = e.references) === null || _c === void 0 ? void 0 : _c.find(function (r) { return r.type === '2'; })) === null || _d === void 0 ? void 0 : _d.id) === '2'
                                && ((_g = (_f = e.references) === null || _f === void 0 ? void 0 : _f.find(function (r) { return r.type === '3'; })) === null || _g === void 0 ? void 0 : _g.id) === '3.2'
                                && !((_j = (_h = e.references) === null || _h === void 0 ? void 0 : _h.find(function (r) { return r.type === '4'; })) === null || _j === void 0 ? void 0 : _j.id));
                        } })];
            case 9:
                _f.sent();
                return [4 /*yield*/, async_test("Other email is unchanged", function () { return sdk.api.emails.getOne(email.id); }, { onResult: function (e) { return e.enduserId === otherEnduser.id; } })];
            case 10:
                _f.sent();
                return [4 /*yield*/, async_test("Other event is unchanged", function () { return sdk.api.calendar_events.getOne(event.id); }, { onResult: function (e) { var _a; return ((_a = e.attendees) === null || _a === void 0 ? void 0 : _a.length) === 1 && !!e.attendees.find(function (e) { return e.id === otherEnduser.id; }); } })];
            case 11:
                _f.sent();
                return [4 /*yield*/, async_test("Other room is unchanged", function () { return sdk.api.chat_rooms.getOne(room.id); }, { onResult: function (e) { var _a, _b; return ((_a = room.enduserIds) === null || _a === void 0 ? void 0 : _a.length) === 1 && !!((_b = e.enduserIds) === null || _b === void 0 ? void 0 : _b.find(function (id) { return id === otherEnduser.id; })); } })];
            case 12:
                _f.sent();
                return [4 /*yield*/, async_test("Other chat is unchanged", function () { return sdk.api.chats.getOne(chat.id); }, { onResult: function (e) { return e.senderId === otherEnduser.id; } })];
            case 13:
                _f.sent();
                return [4 /*yield*/, async_test("Email moved", function () { return sdk.api.emails.getOne(emailToMove.id); }, { onResult: function (e) { return e.enduserId === destination.id; } })];
            case 14:
                _f.sent();
                return [4 /*yield*/, async_test("Chat moved", function () { return sdk.api.chats.getOne(chatToMove.id); }, { onResult: function (e) { return e.senderId === destination.id; } })];
            case 15:
                _f.sent();
                return [4 /*yield*/, async_test("Room moved", function () { return sdk.api.chat_rooms.getOne(roomToMove.id); }, { onResult: function (e) { var _a, _b; return ((_a = e.enduserIds) === null || _a === void 0 ? void 0 : _a.length) === 1 && !!((_b = e.enduserIds) === null || _b === void 0 ? void 0 : _b.includes(destination.id)); } })];
            case 16:
                _f.sent();
                return [4 /*yield*/, async_test("Event moved", function () { return sdk.api.calendar_events.getOne(eventToMove.id); }, { onResult: function (e) { var _a; return e.attendees.length === 1 && !!((_a = e.attendees) === null || _a === void 0 ? void 0 : _a.find(function (a) { return a.id === destination.id; })); } })];
            case 17:
                _f.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(destination.id),
                        sdk.api.endusers.deleteOne(otherEnduser.id),
                        sdk.api.calendar_events.deleteOne(event.id),
                        sdk.api.calendar_events.deleteOne(eventToMove.id),
                    ])];
            case 18:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); };
var wait_for_trigger_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, eTrigger, eNoTrigger, journey, start, trigger;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                log_header("Wait for Trigger");
                return [4 /*yield*/, sdk.api.endusers.createSome([
                        { fname: 'Trigger' },
                        { fname: 'No Trigger' },
                    ])];
            case 1:
                _a = (_b.sent()).created, eTrigger = _a[0], eNoTrigger = _a[1];
                return [4 /*yield*/, sdk.api.journeys.createOne({
                        title: "Trigger test",
                    })];
            case 2:
                journey = _b.sent();
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        events: [{ type: 'onJourneyStart', info: {} }],
                        action: { type: 'setEnduserStatus', info: { status: 'Started' } },
                        journeyId: journey.id,
                    })];
            case 3:
                start = _b.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Field Equals', info: { field: 'Test', value: "Trigger" } },
                        action: { type: "Move To Step", info: {} },
                        status: 'Active',
                        title: 'In-Journey Trigger',
                        journeyId: journey.id,
                    })];
            case 4:
                trigger = _b.sent();
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        events: [{ type: 'waitForTrigger', info: { triggerId: trigger.id, automationStepId: start.id } }],
                        action: { type: 'setEnduserStatus', info: { status: 'Triggered' } },
                        journeyId: journey.id,
                    })];
            case 5:
                _b.sent();
                return [4 /*yield*/, sdk.api.endusers.add_to_journey({ enduserIds: [eTrigger.id], journeyId: journey.id })];
            case 6:
                _b.sent();
                return [4 /*yield*/, wait(undefined, 8000)];
            case 7:
                _b.sent();
                return [4 /*yield*/, async_test("Journey started", function () { return sdk.api.endusers.getOne(eTrigger.id); }, { onResult: function (e) { var _a; return ((_a = e.journeys) === null || _a === void 0 ? void 0 : _a[journey.id]) === 'Started'; } })];
            case 8:
                _b.sent();
                return [4 /*yield*/, sdk.api.endusers.updateOne(eTrigger.id, { fields: { Test: 'Trigger' } })];
            case 9:
                _b.sent();
                return [4 /*yield*/, sdk.api.endusers.updateOne(eNoTrigger.id, { fields: { Test: 'Trigger' } })];
            case 10:
                _b.sent();
                return [4 /*yield*/, wait(undefined, 8000)
                    // TODO - Test a delayed action which comes after the triggered action
                ];
            case 11:
                _b.sent();
                // TODO - Test a delayed action which comes after the triggered action
                return [4 /*yield*/, async_test("Trigger worked while in journey", function () { return sdk.api.endusers.getOne(eTrigger.id); }, { onResult: function (e) { var _a; return ((_a = e.journeys) === null || _a === void 0 ? void 0 : _a[journey.id]) === 'Triggered'; } })];
            case 12:
                // TODO - Test a delayed action which comes after the triggered action
                _b.sent();
                return [4 /*yield*/, async_test("Trigger did not fire while not journey", function () { return sdk.api.endusers.getOne(eNoTrigger.id); }, { onResult: function (e) { var _a; return !((_a = e.journeys) === null || _a === void 0 ? void 0 : _a[journey.id]); } })
                    // cleanup
                ];
            case 13:
                _b.sent();
                // cleanup
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(eTrigger.id),
                        sdk.api.endusers.deleteOne(eNoTrigger.id),
                        sdk.api.journeys.deleteOne(journey.id),
                    ])
                    // test trigger cleaned up on journey delete
                ];
            case 14:
                // cleanup
                _b.sent();
                // test trigger cleaned up on journey delete
                return [4 /*yield*/, async_test("Trigger cleaned up by journey deletion", function () { return pollForResults(sdk.api.automation_triggers.getSome, function (results) { return !results.find(function (r) { return r.id === trigger.id; }); }, 100, 10); }, passOnAnyResult)
                    // double-check that wait for trigger step triggers were deleted
                ];
            case 15:
                // test trigger cleaned up on journey delete
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
var handleRateLimitError = { shouldError: true, onError: function (e) { return e.message === 'Rate limit exceeded'; } };
var rate_limit_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, e1, e2, e3, _b, email1, email2, _c, sms1, sms2;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                log_header("Rate Limits");
                return [4 /*yield*/, sdk.api.endusers.createSome([
                        { fname: '1', email: 'dontsend@tellescope.com', phone: '+15555555555' },
                        { fname: '2', email: 'dontsend2@tellescope.com', phone: '+15555555555' },
                        { fname: 'Logonly', email: 'dontsend3@tellescope.com', phone: '+15555555555' },
                    ])];
            case 1:
                _a = (_d.sent()).created, e1 = _a[0], e2 = _a[1], e3 = _a[2];
                return [4 /*yield*/, async_test("Same template email rate limit 1-per-minute", function () { return sdk.api.emails.createSome([
                        { enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', templateId: PLACEHOLDER_ID },
                        { enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', templateId: PLACEHOLDER_ID },
                    ]); }, handleRateLimitError)
                    // these should work, as 1 each is safe
                ];
            case 2:
                _d.sent();
                return [4 /*yield*/, sdk.api.emails.createSome([
                        { enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', templateId: PLACEHOLDER_ID },
                        { enduserId: e2.id, subject: 'ratelimit', textContent: 'rate limit', templateId: PLACEHOLDER_ID },
                    ])];
            case 3:
                _b = (_d.sent()).created, email1 = _b[0], email2 = _b[1];
                // already has 1 created 
                return [4 /*yield*/, async_test("Same enduser rate limit 5 per 5 seconds", function () { return sdk.api.emails.createSome([
                        { enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', },
                        { enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', },
                        { enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', },
                        { enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', },
                        { enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit' },
                    ]); }, handleRateLimitError)];
            case 4:
                // already has 1 created 
                _d.sent();
                return [4 /*yield*/, async_test("Same enduser rate limit 5 per 5 seconds not for log only", function () { return sdk.api.emails.createSome([
                        { logOnly: true, enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', },
                        { logOnly: true, enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', },
                        { logOnly: true, enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', },
                        { logOnly: true, enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', },
                        { logOnly: true, enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit' },
                    ]); }, passOnAnyResult)];
            case 5:
                _d.sent();
                return [4 /*yield*/, wait(undefined, 2500)]; // give it some time before trying again, to ensure still blocked after 2.5 < 60 seconds
            case 6:
                _d.sent(); // give it some time before trying again, to ensure still blocked after 2.5 < 60 seconds
                return [4 /*yield*/, async_test("Same template email rate limit 1-per-minute after creating", function () { return sdk.api.emails.createOne({
                        enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', templateId: PLACEHOLDER_ID
                    }); }, handleRateLimitError)];
            case 7:
                _d.sent();
                return [4 /*yield*/, async_test("Same template email rate limit 1-per-minute not for logOnly 1", function () { return sdk.api.emails.createOne({
                        logOnly: true, enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', templateId: PLACEHOLDER_ID
                    }); }, passOnAnyResult)];
            case 8:
                _d.sent();
                return [4 /*yield*/, async_test("Same template email rate limit 1-per-minute not for logOnly 2", function () { return sdk.api.emails.createOne({
                        logOnly: true, enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit', templateId: PLACEHOLDER_ID
                    }); }, passOnAnyResult)];
            case 9:
                _d.sent();
                return [4 /*yield*/, async_test("Same template sms rate limit 1-per-minute", function () { return sdk.api.sms_messages.createSome([
                        { enduserId: e1.id, templateId: PLACEHOLDER_ID, message: 'hi' },
                        { enduserId: e1.id, templateId: PLACEHOLDER_ID, message: 'hi' },
                    ]); }, handleRateLimitError)
                    // these should work, as 1 each is safe
                ];
            case 10:
                _d.sent();
                return [4 /*yield*/, sdk.api.sms_messages.createSome([
                        { enduserId: e1.id, templateId: PLACEHOLDER_ID, message: 'hi' },
                        { enduserId: e2.id, templateId: PLACEHOLDER_ID, message: 'hi' },
                    ])];
            case 11:
                _c = (_d.sent()).created, sms1 = _c[0], sms2 = _c[1];
                // already has 1 created, so 3 new should error (4 > 3)
                return [4 /*yield*/, async_test("Same enduser sms rate limit 3 per 3 seconds", function () { return sdk.api.sms_messages.createSome([
                        { enduserId: e1.id, message: 'hi' },
                        { enduserId: e1.id, message: 'hi' },
                        { enduserId: e1.id, message: 'hi' },
                    ]); }, handleRateLimitError)];
            case 12:
                // already has 1 created, so 3 new should error (4 > 3)
                _d.sent();
                return [4 /*yield*/, async_test("Same enduser sms rate limit not applied on logOnly 3 per 3 seconds", function () { return sdk.api.sms_messages.createSome([
                        { logOnly: true, enduserId: e3.id, message: 'hi' },
                        { logOnly: true, enduserId: e3.id, message: 'hi' },
                        { logOnly: true, enduserId: e3.id, message: 'hi' },
                        { logOnly: true, enduserId: e3.id, message: 'hi' },
                        { logOnly: true, enduserId: e3.id, message: 'hi' },
                    ]); }, passOnAnyResult)];
            case 13:
                _d.sent();
                return [4 /*yield*/, wait(undefined, 2500)]; // give it some time before trying again, to ensure still blocked after 2.5 < 60 seconds
            case 14:
                _d.sent(); // give it some time before trying again, to ensure still blocked after 2.5 < 60 seconds
                return [4 /*yield*/, async_test("Same template sms rate limit 1-per-minute after creating", function () { return sdk.api.sms_messages.createOne({
                        enduserId: e2.id, templateId: PLACEHOLDER_ID, message: 'hi'
                    }); }, handleRateLimitError)];
            case 15:
                _d.sent();
                return [4 /*yield*/, async_test("Same template sms rate limit 1-per-minute logonly does not apply 1", function () { return sdk.api.sms_messages.createOne({
                        logOnly: true, enduserId: e2.id, templateId: PLACEHOLDER_ID, message: 'hi'
                    }); }, passOnAnyResult)];
            case 16:
                _d.sent();
                return [4 /*yield*/, async_test("Same template sms rate limit 1-per-minute logonly does not apply 2", function () { return sdk.api.sms_messages.createOne({
                        logOnly: true, enduserId: e2.id, templateId: PLACEHOLDER_ID, message: 'hi'
                    }); }, passOnAnyResult)
                    // these should work, as they do not have the same template
                ];
            case 17:
                _d.sent();
                // these should work, as they do not have the same template
                return [4 /*yield*/, sdk.api.emails.createSome([
                        { enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit' },
                        { enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit' },
                        { enduserId: e1.id, subject: 'ratelimit', textContent: 'rate limit' },
                    ])];
            case 18:
                // these should work, as they do not have the same template
                _d.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(e1.id),
                        sdk.api.endusers.deleteOne(e2.id),
                        sdk.api.endusers.deleteOne(e3.id),
                    ])];
            case 19:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); };
var remove_from_journey_on_incoming_comms_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, e1, e2, _b, jRemove, jDontRemove, removeStep1, removeStep2, dontRemoveStep1, dontRemoveStep2, room;
    var _c, _d;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                log_header("Remove From Journey (Incoming Comms)");
                return [4 /*yield*/, sdk.api.endusers.createSome([
                        { fname: '1', email: 'e1@tellescope.com', phone: '+15555555555' },
                        { fname: '2', email: 'e2@tellescope.com', phone: '+15555555555' },
                    ])];
            case 1:
                _a = (_f.sent()).created, e1 = _a[0], e2 = _a[1];
                return [4 /*yield*/, sdk.api.journeys.createSome([
                        { title: "j1", onIncomingEnduserCommunication: 'Remove' },
                        { title: "j2" },
                    ])];
            case 2:
                _b = (_f.sent()).created, jRemove = _b[0], jDontRemove = _b[1];
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        journeyId: jRemove.id,
                        events: [{ type: 'onJourneyStart', info: {} }],
                        action: { type: 'setEnduserStatus', info: { status: 'Started' } },
                    })];
            case 3:
                removeStep1 = _f.sent();
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        journeyId: jRemove.id,
                        events: [{ type: 'afterAction', info: { automationStepId: removeStep1.id, delay: 0, delayInMS: 1000000, unit: 'Days' } }],
                        action: { type: 'setEnduserStatus', info: { status: 'Continued' } },
                    })];
            case 4:
                removeStep2 = _f.sent();
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        journeyId: jDontRemove.id,
                        events: [{ type: 'onJourneyStart', info: {} }],
                        action: { type: 'setEnduserStatus', info: { status: 'Started' } },
                    })];
            case 5:
                dontRemoveStep1 = _f.sent();
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        journeyId: jDontRemove.id,
                        events: [{ type: 'afterAction', info: { automationStepId: dontRemoveStep1.id, delay: 0, delayInMS: 1000000, unit: 'Days' } }],
                        action: { type: 'setEnduserStatus', info: { status: 'Continued' } },
                    })];
            case 6:
                dontRemoveStep2 = _f.sent();
                return [4 /*yield*/, sdk.api.endusers.updateOne(e1.id, { journeys: (_c = {}, _c[jRemove.id] = '', _c[jDontRemove.id] = '', _c) })];
            case 7:
                _f.sent();
                return [4 /*yield*/, sdk.api.endusers.updateOne(e2.id, { journeys: (_d = {}, _d[jRemove.id] = '', _d[jDontRemove.id] = '', _d) })];
            case 8:
                _f.sent();
                return [4 /*yield*/, wait(undefined, 100)];
            case 9:
                _f.sent();
                return [4 /*yield*/, sdk.api.chat_rooms.createOne({})];
            case 10:
                room = _f.sent();
                return [4 /*yield*/, sdk.api.chats.createOne({ roomId: room.id, senderId: e1.id, message: 'cancel' })];
            case 11:
                _f.sent();
                return [4 /*yield*/, async_test("Appropriate Automated Actions are cancelled on incoming message", function () { return pollForResults(sdk.api.automated_actions.getSome, function (actions) { return (!!actions.find(function (a) {
                        return a.journeyId === jRemove.id
                            && a.automationStepId === removeStep1.id
                            && a.enduserId === e1.id
                            && a.status === 'cancelled';
                    })
                        && !!actions.find(function (a) {
                            return a.journeyId === jRemove.id
                                && a.automationStepId === removeStep1.id
                                && a.enduserId === e2.id
                                && a.status === 'active';
                        })
                        && !!actions.find(function (a) {
                            return a.journeyId === jDontRemove.id
                                && a.automationStepId === dontRemoveStep1.id
                                && a.enduserId === e1.id
                                && a.status === 'active';
                        })
                        && !!actions.find(function (a) {
                            return a.journeyId === jDontRemove.id
                                && a.automationStepId === dontRemoveStep1.id
                                && a.enduserId === e2.id
                                && a.status === 'active';
                        })); }, 50, 400); }, passOnAnyResult)];
            case 12:
                _f.sent();
                return [4 /*yield*/, sdk.api.journeys.handle_incoming_communication({ enduserId: e2.id })];
            case 13:
                _f.sent();
                return [4 /*yield*/, async_test("handle_incoming_communication test for other enduser", function () { return pollForResults(sdk.api.automated_actions.getSome, function (actions) { return (!!actions.find(function (a) {
                        return a.journeyId === jRemove.id
                            && a.automationStepId === removeStep1.id
                            && a.enduserId === e2.id
                            && a.status === 'cancelled';
                    })); }, 100, 25); }, passOnAnyResult)];
            case 14:
                _f.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(e1.id),
                        sdk.api.endusers.deleteOne(e2.id),
                        sdk.api.journeys.deleteOne(jRemove.id),
                        sdk.api.journeys.deleteOne(jDontRemove.id),
                        sdk.api.chat_rooms.deleteOne(room.id),
                    ])];
            case 15:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); };
var pdf_generation = function () { return __awaiter(void 0, void 0, void 0, function () {
    var e, responses, i, fr;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("pdf_generation Tests");
                return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'test' })
                    // include lots of answers to ensure PDF height doesn't produce any cut-off
                ];
            case 1:
                e = _a.sent();
                responses = [];
                for (i = 0; i < 3; i++) {
                    responses.push({
                        fieldId: PLACEHOLDER_ID, fieldTitle: 'test', answer: {
                            type: 'string',
                            value: "Answer ".concat(i, " \uD83D\uDE05 _-!@#$%^&*()+<>?{}|[] \u00E1cc\u00E9\u00F1t test")
                        },
                    });
                }
                return [4 /*yield*/, sdk.api.form_responses.createOne({
                        formId: PLACEHOLDER_ID,
                        enduserId: e.id,
                        formTitle: 'Form Title',
                        responses: responses
                    })];
            case 2:
                fr = _a.sent();
                axios.get("http://localhost:8080/v1/form-responses/generate-pdf?id=".concat(fr.id), {
                    responseType: 'arraybuffer',
                    headers: {
                        Authorization: "Bearer ".concat(sdk.authToken)
                    }
                })
                    .then(function (d) { return (fs.writeFileSync('test_generated.pdf', d.data)); });
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(e.id),
                    ])];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var mfa_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var enduser, _a, _b, e;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                log_header("MFA Tests");
                return [4 /*yield*/, sdkMfa.authenticate(mfaEmail, mfaPassword)];
            case 1:
                _c.sent();
                return [4 /*yield*/, async_test("MFA must be handled before sdk works", function () { return sdkMfa.api.endusers.createOne({ fname: 'wont work' }); }, { shouldError: true, onError: function (e) { return e === 'Unauthenticated'; } })];
            case 2:
                _c.sent();
                return [4 /*yield*/, sdkMfaApiKey.api.endusers.createOne({ fname: 'will work' })];
            case 3:
                enduser = _c.sent();
                return [4 /*yield*/, async_test("API Key Auth does not require MFA", function () { return sdkMfaApiKey.api.endusers.deleteOne(enduser.id); }, passOnAnyResult)];
            case 4:
                _c.sent();
                _b = (_a = sdkMfa).setAuthToken;
                return [4 /*yield*/, sdkMfaApiKey.api.users.generate_auth_token({ email: mfaEmail })];
            case 5:
                _b.apply(_a, [(_c.sent()).authToken]);
                return [4 /*yield*/, sdkMfa.api.endusers.createOne({ fname: 'will work' })];
            case 6:
                e = _c.sent();
                return [4 /*yield*/, async_test("API-key generated token does not require MFA", function () { return sdkMfa.api.endusers.deleteOne(e.id); }, passOnAnyResult)];
            case 7:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
var nextReminderInMS_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var startTimeInMS, durationInMinutes, eNoReminders, eOneReminder, eOneReminderDidRemind, eOneReminderDidRemindWithValid, eMultipleReminders;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("nextReminderInMS Tests");
                startTimeInMS = Date.now() + 1000 * 60 * 60 * 24 * 7;
                durationInMinutes = 60;
                return [4 /*yield*/, sdk.api.calendar_events.createOne({ title: 'eNoReminders', startTimeInMS: startTimeInMS, durationInMinutes: durationInMinutes })];
            case 1:
                eNoReminders = _a.sent();
                return [4 /*yield*/, wait(undefined, 100)];
            case 2:
                _a.sent();
                return [4 /*yield*/, async_test("Create no reminders", function () { return sdk.api.calendar_events.getOne(eNoReminders.id); }, { onResult: function (e) { return e.nextReminderInMS === -1; } })];
            case 3:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.updateOne(eNoReminders.id, { title: 'updated title' })];
            case 4:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 100)];
            case 5:
                _a.sent();
                return [4 /*yield*/, async_test("Update title, no change", function () { return sdk.api.calendar_events.getOne(eNoReminders.id); }, { onResult: function (e) { return e.nextReminderInMS === -1; } })];
            case 6:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({
                        title: 'eOneReminder',
                        startTimeInMS: startTimeInMS,
                        durationInMinutes: durationInMinutes,
                        reminders: [{ type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: 1000 }]
                    })];
            case 7:
                eOneReminder = _a.sent();
                return [4 /*yield*/, wait(undefined, 100)];
            case 8:
                _a.sent();
                return [4 /*yield*/, async_test("Create one reminder", function () { return sdk.api.calendar_events.getOne(eOneReminder.id); }, { onResult: function (e) { return e.nextReminderInMS === startTimeInMS - 1000; } })];
            case 9:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.updateOne(eOneReminder.id, { startTimeInMS: startTimeInMS - 1000 })];
            case 10:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 100)];
            case 11:
                _a.sent();
                return [4 /*yield*/, async_test("Update startTimeInMS", function () { return sdk.api.calendar_events.getOne(eOneReminder.id); }, { onResult: function (e) { return e.nextReminderInMS === startTimeInMS - 1000 - 1000; } })];
            case 12:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.updateOne(eOneReminder.id, {
                        reminders: [{ type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: 5000 }]
                    }, { replaceObjectFields: true })];
            case 13:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 100)];
            case 14:
                _a.sent();
                return [4 /*yield*/, async_test("Update earliest reminder", function () { return sdk.api.calendar_events.getOne(eOneReminder.id); }, { onResult: function (e) { return e.nextReminderInMS === startTimeInMS - 5000 - 1000; } })];
            case 15:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.updateOne(eOneReminder.id, {
                        reminders: [{ type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: 1000 }]
                    })];
            case 16:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 100)];
            case 17:
                _a.sent();
                return [4 /*yield*/, async_test("Later reminder added", function () { return sdkMfaApiKey.api.calendar_events.getOne(eOneReminder.id); }, { onResult: function (e) { return e.nextReminderInMS === startTimeInMS - 5000 - 1000; } })];
            case 18:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.updateOne(eOneReminder.id, {
                        reminders: [{ type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: 7500 }]
                    })];
            case 19:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 100)];
            case 20:
                _a.sent();
                return [4 /*yield*/, async_test("Earlier reminder added", function () { return sdk.api.calendar_events.getOne(eOneReminder.id); }, { onResult: function (e) { return e.nextReminderInMS === startTimeInMS - 7500 - 1000; } })];
            case 21:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({
                        title: 'eOneReminderDidRemind',
                        startTimeInMS: startTimeInMS,
                        durationInMinutes: durationInMinutes,
                        reminders: [{ type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: 1000, didRemind: true }]
                    })];
            case 22:
                eOneReminderDidRemind = _a.sent();
                return [4 /*yield*/, wait(undefined, 100)];
            case 23:
                _a.sent();
                return [4 /*yield*/, async_test("One reminder with didRemind: true", function () { return sdk.api.calendar_events.getOne(eOneReminderDidRemind.id); }, { onResult: function (e) { return e.nextReminderInMS === -1; } })];
            case 24:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({
                        title: 'eOneReminderDidRemindWithValid',
                        startTimeInMS: startTimeInMS,
                        durationInMinutes: durationInMinutes,
                        reminders: [
                            { type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: 1000, didRemind: true },
                            { type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: 0 },
                        ]
                    })];
            case 25:
                eOneReminderDidRemindWithValid = _a.sent();
                return [4 /*yield*/, wait(undefined, 100)];
            case 26:
                _a.sent();
                return [4 /*yield*/, async_test("Multiple reminders with one didRemind: true", function () { return sdk.api.calendar_events.getOne(eOneReminderDidRemindWithValid.id); }, { onResult: function (e) { return e.nextReminderInMS === startTimeInMS; } })];
            case 27:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({
                        title: 'eMultipleReminders',
                        startTimeInMS: startTimeInMS,
                        durationInMinutes: durationInMinutes,
                        reminders: [
                            { type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: 1000 },
                            { type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: 5000 },
                            { type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: -3000 },
                        ]
                    })];
            case 28:
                eMultipleReminders = _a.sent();
                return [4 /*yield*/, wait(undefined, 100)];
            case 29:
                _a.sent();
                return [4 /*yield*/, async_test("Create multiple reminders", function () { return sdk.api.calendar_events.getOne(eMultipleReminders.id); }, { onResult: function (e) { return e.nextReminderInMS === startTimeInMS - 5000; } })
                    // changing far out reminders shouldn't change nextReminderInMS
                ];
            case 30:
                _a.sent();
                // changing far out reminders shouldn't change nextReminderInMS
                return [4 /*yield*/, sdk.api.calendar_events.updateOne(eMultipleReminders.id, {
                        reminders: [
                            { type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: -1000 },
                            { type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: 5000 },
                            { type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: -8000 },
                        ]
                    }, { replaceObjectFields: true })];
            case 31:
                // changing far out reminders shouldn't change nextReminderInMS
                _a.sent();
                return [4 /*yield*/, wait(undefined, 100)];
            case 32:
                _a.sent();
                return [4 /*yield*/, async_test("Later reminders changed", function () { return sdk.api.calendar_events.getOne(eMultipleReminders.id); }, { onResult: function (e) { return e.nextReminderInMS === startTimeInMS - 5000; } })
                    // changing nearest reminder shouldn change nextReminderInMS
                ];
            case 33:
                _a.sent();
                // changing nearest reminder shouldn change nextReminderInMS
                return [4 /*yield*/, sdk.api.calendar_events.updateOne(eMultipleReminders.id, {
                        reminders: [
                            { type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: 6000 },
                            { type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: 7000 },
                            { type: 'create-ticket', info: { title: 'title' }, msBeforeStartTime: 5000 },
                        ]
                    }, { replaceObjectFields: true })];
            case 34:
                // changing nearest reminder shouldn change nextReminderInMS
                _a.sent();
                return [4 /*yield*/, wait(undefined, 100)];
            case 35:
                _a.sent();
                return [4 /*yield*/, async_test("Earlier reminders changed", function () { return sdkMfaApiKey.api.calendar_events.getOne(eMultipleReminders.id); }, { onResult: function (e) { return e.nextReminderInMS === startTimeInMS - 7000; } })];
            case 36:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.updateOne(eMultipleReminders.id, {
                        startTimeInMS: startTimeInMS - 3000
                    })];
            case 37:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 100)];
            case 38:
                _a.sent();
                return [4 /*yield*/, async_test("startTimeInMS changed for multiple reminders", function () { return sdk.api.calendar_events.getOne(eMultipleReminders.id); }, { onResult: function (e) { return e.nextReminderInMS === startTimeInMS - 7000 - 3000; } })];
            case 39:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.calendar_events.deleteOne(eNoReminders.id),
                        sdk.api.calendar_events.deleteOne(eMultipleReminders.id),
                        sdk.api.calendar_events.deleteOne(eOneReminderDidRemindWithValid.id),
                        sdk.api.calendar_events.deleteOne(eOneReminderDidRemind.id),
                        sdk.api.calendar_events.deleteOne(eOneReminder.id),
                    ])];
            case 40:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var pollForResults = function (f, evaluate, intervalInMS, iterations, shouldError) {
    if (intervalInMS === void 0) { intervalInMS = 500; }
    if (iterations === void 0) { iterations = 20; }
    if (shouldError === void 0) { shouldError = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var lastResult, i, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lastResult = undefined;
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < iterations)) return [3 /*break*/, 5];
                    return [4 /*yield*/, wait(undefined, intervalInMS)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, f()];
                case 3:
                    result = _a.sent();
                    lastResult = result;
                    if (evaluate(result))
                        return [2 /*return*/, result];
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 1];
                case 5:
                    if (shouldError)
                        return [2 /*return*/, lastResult];
                    console.log(lastResult);
                    throw new Error("failed pollForResults");
            }
        });
    });
};
var test_ticket_automation_assignment_and_optimization = function () { return __awaiter(void 0, void 0, void 0, function () {
    var users, journey, queue, foregroundTestCounter, testForegroundTicket, backgroundTestCounter, testBackgroundTicket, enduser, _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                log_header("Ticket Automation / Assignment Tests");
                return [4 /*yield*/, sdk.api.users.getSome()];
            case 1:
                users = _d.sent();
                if (users.length < 3)
                    throw new Error("Must have at least 3 users to detect invalid assignment");
                return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, { tags: ['tag1', 'tag2'] })];
            case 2:
                _d.sent();
                return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { tags: ['tag1', 'tag3'] })];
            case 3:
                _d.sent();
                return [4 /*yield*/, sdk.api.journeys.createOne({ title: "Testing" })];
            case 4:
                journey = _d.sent();
                return [4 /*yield*/, sdk.api.ticket_queues.createOne({ title: 'test queue', userIds: [] })];
            case 5:
                queue = _d.sent();
                foregroundTestCounter = 0;
                testForegroundTicket = function (_a) {
                    var assignedTo = _a.assignedTo, info = _a.info, validOwners = _a.validOwners, enduser = _a.enduser, closedForReason = _a.closedForReason, testDelayedChild = _a.testDelayedChild;
                    return __awaiter(void 0, void 0, void 0, function () {
                        var e, _b, step, statusStep, child, ticket;
                        var _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _b = enduser;
                                    if (_b) return [3 /*break*/, 2];
                                    return [4 /*yield*/, sdk.api.endusers.createOne({ assignedTo: assignedTo, journeys: (_c = {}, _c[journey.id] = '', _c), fields: { Tag: "tag3" } })];
                                case 1:
                                    _b = (_d.sent());
                                    _d.label = 2;
                                case 2:
                                    e = _b;
                                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                                            action: { type: 'createTicket', info: __assign(__assign({}, info), { title: 'background ticket' }) },
                                            events: [{
                                                    type: 'ticketCompleted',
                                                    info: closedForReason ? { automationStepId: PLACEHOLDER_ID, closedForReason: closedForReason } : { automationStepId: PLACEHOLDER_ID }
                                                }],
                                            journeyId: journey.id,
                                        })];
                                case 3:
                                    step = _d.sent();
                                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                                            action: { type: 'setEnduserStatus', info: { status: 'Test Status' } },
                                            events: [{
                                                    type: 'ticketCompleted',
                                                    info: closedForReason ? { automationStepId: PLACEHOLDER_ID, closedForReason: closedForReason } : { automationStepId: PLACEHOLDER_ID }
                                                }],
                                            journeyId: journey.id,
                                        })];
                                case 4:
                                    statusStep = _d.sent();
                                    return [4 /*yield*/, sdk.api.automation_steps.createOne({
                                            action: { type: 'setEnduserStatus', info: { status: 'Test Status' } },
                                            events: [{
                                                    type: 'afterAction',
                                                    info: {
                                                        automationStepId: step.id,
                                                        delay: 0, delayInMS: 0, unit: 'Days',
                                                    }
                                                }],
                                            journeyId: journey.id,
                                        })];
                                case 5:
                                    child = _d.sent();
                                    return [4 /*yield*/, sdk.api.tickets.createOne({
                                            title: 'foreground ticket',
                                            enduserId: e.id,
                                            automationStepId: PLACEHOLDER_ID,
                                            journeyId: journey.id,
                                            owner: validOwners[0],
                                            closedForReason: closedForReason,
                                        })];
                                case 6:
                                    ticket = _d.sent();
                                    return [4 /*yield*/, async_test("Foreground ticket assignment ".concat(++foregroundTestCounter), function () { return sdk.api.tickets.close_ticket({ ticketId: ticket.id, closedForReason: closedForReason }); }, { onResult: function (_a) {
                                                var generated = _a.generated;
                                                return (validOwners.length === 0 && (generated === null || generated === void 0 ? void 0 : generated.queueId) === queue.id && !generated.owner)
                                                    || (!!(generated === null || generated === void 0 ? void 0 : generated.owner) && validOwners.includes(generated.owner));
                                            }
                                        })];
                                case 7:
                                    _d.sent();
                                    return [4 /*yield*/, async_test("Foreground ticket nop, no duplicates", function () { return sdk.api.automated_actions.getSome({ filter: { automationStepId: step.id } }); }, { onResult: function (steps) { return steps.length === 1 && !!steps[0].isNOP; } })];
                                case 8:
                                    _d.sent();
                                    return [4 /*yield*/, async_test("Background action queued, no duplicates", function () { return sdk.api.automated_actions.getSome({ filter: { automationStepId: statusStep.id } }); }, {
                                            onResult: function (steps) { return steps.length === 1 && !steps[0].isNOP; }
                                        })
                                        // verify that ticket generated by close_ticket goes on to generate its own delayed actions
                                    ];
                                case 9:
                                    _d.sent();
                                    if (!testDelayedChild) return [3 /*break*/, 11];
                                    return [4 /*yield*/, async_test("Delayed child ticket", function () { return pollForResults(function () { return sdk.api.automated_actions.getSome({ filter: { automationStepId: child.id } }); }, function (t) { return !!t.length; }); }, { onResult: function (steps) { return steps.length === 1 && !steps[0].isNOP; } })];
                                case 10:
                                    _d.sent();
                                    _d.label = 11;
                                case 11: return [4 /*yield*/, Promise.all([
                                        sdk.api.endusers.deleteOne(e.id),
                                        sdk.api.automation_steps.deleteOne(step.id),
                                        sdk.api.automation_steps.deleteOne(statusStep.id),
                                        sdk.api.automation_steps.deleteOne(child.id),
                                    ])];
                                case 12:
                                    _d.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                return [4 /*yield*/, testForegroundTicket({
                        assignedTo: [],
                        info: {
                            assignmentStrategy: { type: 'queue', info: { queueId: queue.id } },
                            defaultAssignee: sdk.userInfo.id
                        },
                        validOwners: [],
                        testDelayedChild: true,
                    })];
            case 6:
                _d.sent();
                return [4 /*yield*/, testForegroundTicket({
                        assignedTo: [],
                        info: {
                            assignmentStrategy: { type: 'default', info: {} },
                            defaultAssignee: sdk.userInfo.id
                        },
                        validOwners: [sdk.userInfo.id],
                        testDelayedChild: true,
                    })];
            case 7:
                _d.sent();
                return [4 /*yield*/, testForegroundTicket({
                        assignedTo: [],
                        info: {
                            assignmentStrategy: { type: 'default', info: {} },
                            defaultAssignee: sdk.userInfo.id
                        },
                        validOwners: [sdk.userInfo.id],
                        closedForReason: "closedForReason test",
                        testDelayedChild: true,
                    })];
            case 8:
                _d.sent();
                return [4 /*yield*/, testForegroundTicket({
                        assignedTo: [],
                        info: {
                            assignmentStrategy: { type: 'default', info: {} },
                            defaultAssignee: sdkNonAdmin.userInfo.id
                        },
                        validOwners: [sdkNonAdmin.userInfo.id],
                    })];
            case 9:
                _d.sent();
                return [4 /*yield*/, testForegroundTicket({
                        assignedTo: [],
                        info: {
                            assignmentStrategy: { type: 'previous-owner', info: {} },
                            defaultAssignee: sdk.userInfo.id
                        },
                        validOwners: [sdkNonAdmin.userInfo.id],
                    })];
            case 10:
                _d.sent();
                return [4 /*yield*/, testForegroundTicket({
                        assignedTo: [sdkNonAdmin.userInfo.id, sdk.userInfo.id],
                        info: {
                            assignmentStrategy: { type: 'care-team-primary', info: {} },
                            defaultAssignee: sdk.userInfo.id
                        },
                        validOwners: [sdkNonAdmin.userInfo.id],
                    })];
            case 11:
                _d.sent();
                return [4 /*yield*/, testForegroundTicket({
                        assignedTo: [sdkNonAdmin.userInfo.id, sdk.userInfo.id],
                        info: {
                            assignmentStrategy: { type: 'care-team-random', info: {} },
                            defaultAssignee: sdk.userInfo.id
                        },
                        validOwners: [sdkNonAdmin.userInfo.id, sdk.userInfo.id],
                    })];
            case 12:
                _d.sent();
                return [4 /*yield*/, testForegroundTicket({
                        assignedTo: [sdkNonAdmin.userInfo.id, sdk.userInfo.id],
                        info: {
                            assignmentStrategy: { type: 'by-tags', info: { qualifier: 'One Of', values: ['tag1'] } },
                            defaultAssignee: sdkNonAdmin.userInfo.id,
                        },
                        validOwners: [sdk.userInfo.id, sdkNonAdmin.userInfo.id,],
                    })];
            case 13:
                _d.sent();
                return [4 /*yield*/, testForegroundTicket({
                        assignedTo: [sdkNonAdmin.userInfo.id, sdk.userInfo.id],
                        info: {
                            assignmentStrategy: { type: 'by-tags', info: { qualifier: 'One Of', values: ['tag2'] } },
                            defaultAssignee: sdkNonAdmin.userInfo.id
                        },
                        validOwners: [sdk.userInfo.id],
                    })];
            case 14:
                _d.sent();
                return [4 /*yield*/, testForegroundTicket({
                        assignedTo: [],
                        info: {
                            assignmentStrategy: { type: 'by-tags', info: { qualifier: 'One Of', values: ['{{enduser.Tag}}'] } },
                            defaultAssignee: sdk.userInfo.id
                        },
                        validOwners: [sdkNonAdmin.userInfo.id],
                    })];
            case 15:
                _d.sent();
                backgroundTestCounter = 0;
                testBackgroundTicket = function (_a) {
                    var assignedTo = _a.assignedTo, info = _a.info, validOwners = _a.validOwners, enduser = _a.enduser;
                    return __awaiter(void 0, void 0, void 0, function () {
                        var e, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _b = enduser;
                                    if (_b) return [3 /*break*/, 2];
                                    return [4 /*yield*/, sdk.api.endusers.createOne({ assignedTo: assignedTo, fields: { Tag: 'tag3' } })];
                                case 1:
                                    _b = (_c.sent());
                                    _c.label = 2;
                                case 2:
                                    e = _b;
                                    return [4 /*yield*/, sdk.api.automated_actions.createOne({
                                            action: { type: 'createTicket', info: __assign(__assign({}, info), { title: 'background ticket' }) },
                                            automationStepId: PLACEHOLDER_ID,
                                            enduserId: e.id,
                                            event: { type: 'afterAction', info: { automationStepId: PLACEHOLDER_ID, delay: 0, delayInMS: 0, unit: 'Days' } },
                                            journeyId: journey.id,
                                            status: 'active',
                                            processAfter: Date.now(),
                                        })];
                                case 3:
                                    _c.sent();
                                    return [4 /*yield*/, async_test("Background ticket assignment ".concat(++backgroundTestCounter), function () { return pollForResults(function () { return sdk.api.tickets.getSome({ filter: { enduserId: e.id, title: 'background ticket' } }); }, function (t) { return !!t.length; }, 500, 20); }, {
                                            onResult: function (ts) { return (ts.length === 1 && ((validOwners.length === 0 && ts[0].queueId === queue.id && !ts[0].owner)
                                                || (!!ts[0].owner && validOwners.includes(ts[0].owner)))); }
                                        })];
                                case 4:
                                    _c.sent();
                                    return [4 /*yield*/, sdk.api.endusers.deleteOne(e.id)];
                                case 5:
                                    _c.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                return [4 /*yield*/, testBackgroundTicket({
                        assignedTo: [],
                        info: {
                            assignmentStrategy: { type: 'queue', info: { queueId: queue.id } },
                            defaultAssignee: sdk.userInfo.id
                        },
                        validOwners: [],
                    })];
            case 16:
                _d.sent();
                return [4 /*yield*/, testBackgroundTicket({
                        assignedTo: [],
                        info: {
                            assignmentStrategy: { type: 'default', info: {} },
                            defaultAssignee: sdk.userInfo.id
                        },
                        validOwners: [sdk.userInfo.id],
                    })];
            case 17:
                _d.sent();
                return [4 /*yield*/, testBackgroundTicket({
                        assignedTo: [],
                        info: {
                            assignmentStrategy: { type: 'default', info: {} },
                            defaultAssignee: sdkNonAdmin.userInfo.id
                        },
                        validOwners: [sdkNonAdmin.userInfo.id],
                    })
                    // ticket needs existing enduser, previous owner for test to work
                ];
            case 18:
                _d.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'previous-owner-test' })];
            case 19:
                enduser = _d.sent();
                return [4 /*yield*/, sdk.api.tickets.createOne({
                        // title should be different than 'background test' so it doesn't create false positive test
                        title: 'previous-owner-test', enduserId: enduser.id, journeyId: journey.id, owner: sdkNonAdmin.userInfo.id
                    })];
            case 20:
                _d.sent();
                return [4 /*yield*/, testBackgroundTicket({
                        assignedTo: [],
                        enduser: enduser,
                        info: {
                            assignmentStrategy: { type: 'previous-owner', info: {} },
                            defaultAssignee: sdk.userInfo.id
                        },
                        validOwners: [sdkNonAdmin.userInfo.id],
                    })];
            case 21:
                _d.sent();
                return [4 /*yield*/, testBackgroundTicket({
                        assignedTo: [sdkNonAdmin.userInfo.id, sdk.userInfo.id],
                        info: {
                            assignmentStrategy: { type: 'care-team-primary', info: {} },
                            defaultAssignee: sdk.userInfo.id
                        },
                        validOwners: [sdkNonAdmin.userInfo.id],
                    })];
            case 22:
                _d.sent();
                return [4 /*yield*/, testBackgroundTicket({
                        assignedTo: [sdkNonAdmin.userInfo.id, sdk.userInfo.id],
                        info: {
                            assignmentStrategy: { type: 'care-team-random', info: {} },
                            defaultAssignee: sdk.userInfo.id
                        },
                        validOwners: [sdkNonAdmin.userInfo.id, sdk.userInfo.id],
                    })];
            case 23:
                _d.sent();
                return [4 /*yield*/, testBackgroundTicket({
                        assignedTo: [sdkNonAdmin.userInfo.id, sdk.userInfo.id],
                        info: {
                            assignmentStrategy: { type: 'by-tags', info: { qualifier: 'One Of', values: ['tag1'] } },
                            defaultAssignee: sdkNonAdmin.userInfo.id,
                        },
                        validOwners: [sdk.userInfo.id, sdkNonAdmin.userInfo.id,],
                    })];
            case 24:
                _d.sent();
                return [4 /*yield*/, testBackgroundTicket({
                        assignedTo: [sdkNonAdmin.userInfo.id, sdk.userInfo.id],
                        info: {
                            assignmentStrategy: { type: 'by-tags', info: { qualifier: 'One Of', values: ['tag2'] } },
                            defaultAssignee: sdkNonAdmin.userInfo.id
                        },
                        validOwners: [sdk.userInfo.id],
                    })];
            case 25:
                _d.sent();
                return [4 /*yield*/, testBackgroundTicket({
                        assignedTo: [],
                        info: {
                            assignmentStrategy: { type: 'by-tags', info: { qualifier: 'One Of', values: ['{{enduser.Tag}}'] } },
                            defaultAssignee: sdk.userInfo.id
                        },
                        validOwners: [sdkNonAdmin.userInfo.id],
                    })];
            case 26:
                _d.sent();
                _b = (_a = Promise).all;
                return [4 /*yield*/, sdk.api.journeys.deleteOne(journey.id)];
            case 27:
                _c = [
                    _d.sent()
                ];
                return [4 /*yield*/, sdk.api.ticket_queues.deleteOne(queue.id)];
            case 28: return [2 /*return*/, _b.apply(_a, [_c.concat([
                        _d.sent()
                    ])])];
        }
    });
}); };
var field_equals_trigger_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var journey, step, existsTriggerTags, existsTriggerAddToJourney, equalsTriggerTags, equalsTriggerAddToJourney, conditionalTriggerTags, conditionalTriggerAddToJourney, endusers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Field Equals / Trigger Tests");
                return [4 /*yield*/, sdk.api.journeys.createOne({ title: 'test' })];
            case 1:
                journey = _a.sent();
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [{
                                type: 'onJourneyStart',
                                info: {}
                            }],
                        action: {
                            type: 'addEnduserTags',
                            info: { tags: ['Journey Tag'] }
                        },
                    })];
            case 2:
                step = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Field Equals', info: { field: 'fname', value: "$exists" } },
                        action: { type: 'Add Tags', info: { tags: ["Tag"] } },
                        status: "Active",
                        title: 'existsTriggerTags',
                    })];
            case 3:
                existsTriggerTags = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Field Equals', info: { field: 'fname', value: "$exists" } },
                        action: { type: 'Add To Journey', info: { journeyId: journey.id } },
                        status: "Active",
                        title: 'existsTriggerAddToJourney',
                    })];
            case 4:
                existsTriggerAddToJourney = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Field Equals', info: { field: 'lname', value: "Explicit" } },
                        action: { type: 'Add Tags', info: { tags: ["Tag"] } },
                        status: "Active",
                        title: 'equalsTriggerTags',
                    })];
            case 5:
                equalsTriggerTags = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Field Equals', info: { field: 'lname', value: "Explicit" } },
                        action: { type: 'Add To Journey', info: { journeyId: journey.id } },
                        enduserCondition: { $and: [{ condition: { lname: 'Explicit' } }] },
                        status: "Active",
                        title: 'equalsTriggerAddToJourney',
                    })];
            case 6:
                equalsTriggerAddToJourney = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Field Equals', info: { field: 'mname', value: "$exists" } },
                        action: { type: 'Add Tags', info: { tags: ["Tag"] } },
                        status: "Active",
                        enduserCondition: { $and: [{ condition: { lname: 'Conditional' } }] },
                        title: 'conditionalTriggerTags',
                    })];
            case 7:
                conditionalTriggerTags = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        event: { type: 'Field Equals', info: { field: 'mname', value: "$exists" } },
                        action: { type: 'Add To Journey', info: { journeyId: journey.id } },
                        enduserCondition: { $and: [{ condition: { lname: 'Conditional' } }] },
                        status: "Active",
                        title: 'conditionalTriggerAddToJourney',
                    })
                    // names are capitalized automatically, so make sure that is reflected in conditions
                ];
            case 8:
                conditionalTriggerAddToJourney = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createSome([
                        { fname: 'Test' },
                        { fname: 'Test' },
                        { lname: 'Test' },
                        { lname: 'Explicit' },
                        { mname: 'Test' },
                        { mname: 'Test' },
                        { mname: 'Test', lname: 'Nonconditional' },
                        { mname: 'Test', lname: 'Conditional' },
                    ])];
            case 9:
                endusers = (_a.sent()).created;
                return [4 /*yield*/, async_test("Journey and tags set", function () { return pollForResults(sdk.api.endusers.getSome, function (es) { return (es.filter(function (e) { var _a, _b; return ((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Tag')) && ((_b = e.journeys) === null || _b === void 0 ? void 0 : _b[journey.id]) !== undefined; }).length === 4); }, 200, 25); }, passOnAnyResult)];
            case 10:
                _a.sent();
                return [4 /*yield*/, async_test("Background action queued for journey", function () { return pollForResults(sdk.api.automated_actions.getSome, function (as) { return (as.filter(function (a) { return a.automationStepId === step.id && endusers.find(function (e) { return e.id === a.enduserId; }); }).length === 4); }, 200, 25); }, passOnAnyResult)];
            case 11:
                _a.sent();
                return [4 /*yield*/, async_test("Endusers have trigger ids", sdk.api.endusers.getSome, { onResult: function (es) { return es.filter(function (e) { var _a; return ((_a = e.triggerIds) === null || _a === void 0 ? void 0 : _a.length) === 2; }).length === 4; } })];
            case 12:
                _a.sent();
                return [4 /*yield*/, Promise.all(__spreadArray([
                        sdk.api.journeys.deleteOne(journey.id),
                        sdk.api.automation_triggers.deleteOne(existsTriggerTags.id),
                        sdk.api.automation_triggers.deleteOne(existsTriggerAddToJourney.id),
                        sdk.api.automation_triggers.deleteOne(equalsTriggerAddToJourney.id),
                        sdk.api.automation_triggers.deleteOne(equalsTriggerTags.id),
                        sdk.api.automation_triggers.deleteOne(conditionalTriggerTags.id),
                        sdk.api.automation_triggers.deleteOne(conditionalTriggerAddToJourney.id)
                    ], endusers.map(function (e) { return sdk.api.endusers.deleteOne(e.id); }), true))];
            case 13: return [2 /*return*/, _a.sent()];
        }
    });
}); };
export var no_chained_triggers_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var t1, t2, enduser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("No Chained Triggers Tests");
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        title: 't1', status: 'Active',
                        event: {
                            type: 'Field Equals',
                            info: {
                                field: 'fname',
                                value: 'Trigger'
                            },
                        },
                        action: {
                            type: 'Add Tags',
                            info: { tags: ['t1', '{{enduser.fname}}'] }
                        }
                    })];
            case 1:
                t1 = _a.sent();
                return [4 /*yield*/, sdk.api.automation_triggers.createOne({
                        title: 't2', status: 'Active',
                        event: {
                            type: 'Field Equals',
                            info: {
                                field: 'fname',
                                value: '$exists'
                            },
                        },
                        action: {
                            type: 'Add Tags',
                            info: { tags: ['t2'] }
                        },
                        enduserCondition: { $and: [{ condition: { tags: 't1' } }] },
                    })
                    // should only trigger t1, t1 would trigger t2 if allowed, but should not
                ];
            case 2:
                t2 = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'Trigger' })];
            case 3:
                enduser = _a.sent();
                return [4 /*yield*/, wait(undefined, 250)];
            case 4:
                _a.sent();
                return [4 /*yield*/, async_test("Trigger not activated by other trigger update", function () { return sdk.api.endusers.getOne(enduser.id); }, { onResult: function (e) { var _a, _b, _c; return !!(!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('t2')) && ((_b = e.tags) === null || _b === void 0 ? void 0 : _b.includes('t1')) && ((_c = e.tags) === null || _c === void 0 ? void 0 : _c.includes('Trigger'))); } })
                    // should cover both triggers now, which results in adding only the second tag
                ];
            case 5:
                _a.sent();
                // should cover both triggers now, which results in adding only the second tag
                return [4 /*yield*/, sdk.api.endusers.updateOne(enduser.id, { fname: "Updated" })];
            case 6:
                // should cover both triggers now, which results in adding only the second tag
                _a.sent();
                return [4 /*yield*/, wait(undefined, 250)];
            case 7:
                _a.sent();
                return [4 /*yield*/, async_test("Trigger activated directly", function () { return sdk.api.endusers.getOne(enduser.id); }, { onResult: function (e) { var _a; return !!(((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('t1')) && e.tags.includes('t2')); } })];
            case 8:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.automation_triggers.deleteOne(t1.id),
                        sdk.api.automation_triggers.deleteOne(t2.id),
                        sdk.api.endusers.deleteOne(enduser.id)
                    ])];
            case 9:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
export var ticket_queue_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var queue, queueUnshared, enduser, ticket, ticketUnshared, ticketToPull, stateTicket, allTagsTicket, oneTagTicket;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Ticket Queue Tests");
                return [4 /*yield*/, sdk.api.ticket_queues.createOne({ title: 'queue', userIds: [sdkNonAdmin.userInfo.id] })];
            case 1:
                queue = _a.sent();
                return [4 /*yield*/, sdk.api.ticket_queues.createOne({ title: 'queue unshared', userIds: [] })];
            case 2:
                queueUnshared = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'ticket' })];
            case 3:
                enduser = _a.sent();
                return [4 /*yield*/, async_test("Ticket queue empty on general pull", function () { return sdk.api.tickets.assign_from_queue({ queueId: queue.id }); }, { shouldError: true, onError: function (e) { return e.message === "Queue is empty"; } })];
            case 4:
                _a.sent();
                return [4 /*yield*/, sdk.api.tickets.createOne({ title: 'ticket in queue', queueId: queue.id, enduserId: enduser.id })];
            case 5:
                ticket = _a.sent();
                return [4 /*yield*/, sdk.api.tickets.createOne({ title: 'ticket no access', queueId: queueUnshared.id })];
            case 6:
                ticketUnshared = _a.sent();
                return [4 /*yield*/, async_test("Admin ticket access", sdk.api.tickets.getSome, { onResult: function (ts) { return ts.length === 2; } })];
            case 7:
                _a.sent();
                return [4 /*yield*/, async_test("Admin ticket access (specified queue)", function () { return sdk.api.tickets.getSome({ filter: { queueId: queue.id } }); }, { onResult: function (ts) { return ts.length === 1; } })];
            case 8:
                _a.sent();
                return [4 /*yield*/, async_test("Admin ticket access (specified queue, other)", function () { return sdk.api.tickets.getSome({ filter: { queueId: queueUnshared.id } }); }, { onResult: function (ts) { return ts.length === 1; } })];
            case 9:
                _a.sent();
                return [4 /*yield*/, async_test("Non-Admin ticket access (unspecified queue)", sdkNonAdmin.api.tickets.getSome, { onResult: function (ts) { return ts.length === 0; } })];
            case 10:
                _a.sent();
                return [4 /*yield*/, async_test("Non-Admin ticket access (specified queue)", function () { return sdkNonAdmin.api.tickets.getSome({ filter: { queueId: queue.id } }); }, { onResult: function (ts) { return ts.length === 1; } })];
            case 11:
                _a.sent();
                return [4 /*yield*/, async_test("Non-Admin ticket access (specified queue, no access)", function () { return sdkNonAdmin.api.tickets.getSome({ filter: { queueId: queueUnshared.id } }); }, handleAnyError)];
            case 12:
                _a.sent();
                return [4 /*yield*/, async_test("Queue caches number of tickets on add", function () { return sdk.api.ticket_queues.getOne(queue.id); }, { onResult: function (q) { return q.count === 1; } })];
            case 13:
                _a.sent();
                return [4 /*yield*/, async_test("Non-Admin can assign ticket to self", function () { return sdkNonAdmin.api.tickets.assign_from_queue({ ticketId: ticket.id }); }, { onResult: function (_a) {
                            var ticket = _a.ticket;
                            return ticket.owner === sdkNonAdmin.userInfo.id && !ticket.queueId && !!ticket.dequeuedAt;
                        } })];
            case 14:
                _a.sent();
                return [4 /*yield*/, async_test("Ticket can't be double-assigned ticket to self", function () { return sdk.api.tickets.assign_from_queue({ ticketId: ticket.id }); }, handleAnyError)];
            case 15:
                _a.sent();
                return [4 /*yield*/, async_test("Non-Admin ticket cannot assign ticket to self when can't access queue", function () { return sdkNonAdmin.api.tickets.assign_from_queue({ ticketId: ticketUnshared.id }); }, handleAnyError)];
            case 16:
                _a.sent();
                return [4 /*yield*/, async_test("Non-Admin can access ticket after assignment", function () { return sdkNonAdmin.api.tickets.getOne(ticket.id); }, { onResult: function (ticket) { return ticket.owner === sdkNonAdmin.userInfo.id && !ticket.queueId && !!ticket; } })];
            case 17:
                _a.sent();
                return [4 /*yield*/, async_test("Queue caches number of tickets on assignment", function () { return pollForResults(function () { return sdk.api.ticket_queues.getOne(queue.id); }, function (q) { return q.count === 0; }, 50, 10); }, passOnAnyResult)];
            case 18:
                _a.sent();
                return [4 /*yield*/, async_test("Added to care team after queue pull", function () { return sdkNonAdmin.api.endusers.getOne(enduser.id); }, { onResult: function (e) { var _a; return !!((_a = e.assignedTo) === null || _a === void 0 ? void 0 : _a.includes(sdkNonAdmin.userInfo.id)); } })];
            case 19:
                _a.sent();
                return [4 /*yield*/, sdk.api.tickets.createOne({ title: 'ticket to pull without id', queueId: queue.id })];
            case 20:
                ticketToPull = _a.sent();
                return [4 /*yield*/, async_test("Ticket queue general pull", function () { return sdk.api.tickets.assign_from_queue({ queueId: queue.id }); }, { onResult: function (r) { return r.ticket.id === ticketToPull.id; } })];
            case 21:
                _a.sent();
                return [4 /*yield*/, async_test("Ticket queue empty on general pull again", function () { return sdk.api.tickets.assign_from_queue({ queueId: queue.id }); }, { shouldError: true, onError: function (e) { return e.message === "Queue is empty"; } })];
            case 22:
                _a.sent();
                return [4 /*yield*/, sdk.api.tickets.createOne({ title: 'ticket in queue', queueId: queue.id, enduserId: enduser.id, restrictByState: 'AK' })];
            case 23:
                stateTicket = _a.sent();
                return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, { credentialedStates: [] }, { replaceObjectFields: true })];
            case 24:
                _a.sent();
                return [4 /*yield*/, async_test("Ticket queue empty for no state match", function () { return sdk.api.tickets.assign_from_queue({ queueId: queue.id }); }, { shouldError: true, onError: function (e) { return e.message === "Queue is empty"; } })];
            case 25:
                _a.sent();
                return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, { credentialedStates: [{ state: 'AK' }] })];
            case 26:
                _a.sent();
                return [4 /*yield*/, async_test("Ticket restricted by state", function () { return sdk.api.tickets.assign_from_queue({ queueId: queue.id }); }, { onResult: function (r) { return r.ticket.id === stateTicket.id; } })];
            case 27:
                _a.sent();
                return [4 /*yield*/, sdk.api.tickets.createOne({ title: 'all tags', queueId: queue.id, enduserId: enduser.id, restrictByTagsQualifier: 'All Of', restrictByTags: ['A', 'B'] })];
            case 28:
                allTagsTicket = _a.sent();
                return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, { tags: [] }, { replaceObjectFields: true })];
            case 29:
                _a.sent();
                return [4 /*yield*/, async_test("Ticket queue empty for no tags match", function () { return sdk.api.tickets.assign_from_queue({ queueId: queue.id }); }, { shouldError: true, onError: function (e) { return e.message === "Queue is empty"; } })];
            case 30:
                _a.sent();
                return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, { tags: ['A'] }, { replaceObjectFields: true })];
            case 31:
                _a.sent();
                return [4 /*yield*/, async_test("Ticket queue empty for partial tags match", function () { return sdk.api.tickets.assign_from_queue({ queueId: queue.id }); }, { shouldError: true, onError: function (e) { return e.message === "Queue is empty"; } })];
            case 32:
                _a.sent();
                return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, { tags: ['A', 'B'] }, { replaceObjectFields: true })];
            case 33:
                _a.sent();
                return [4 /*yield*/, async_test("Ticket by all of tags", function () { return sdk.api.tickets.assign_from_queue({ queueId: queue.id }); }, { onResult: function (r) { return r.ticket.id === allTagsTicket.id; } })];
            case 34:
                _a.sent();
                return [4 /*yield*/, sdk.api.tickets.createOne({ title: 'one tag', queueId: queue.id, enduserId: enduser.id, restrictByTagsQualifier: 'One Of', restrictByTags: ['A', 'B'] })];
            case 35:
                oneTagTicket = _a.sent();
                return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, { tags: [] }, { replaceObjectFields: true })];
            case 36:
                _a.sent();
                return [4 /*yield*/, async_test("Ticket queue empty for no tags match", function () { return sdk.api.tickets.assign_from_queue({ queueId: queue.id }); }, { shouldError: true, onError: function (e) { return e.message === "Queue is empty"; } })];
            case 37:
                _a.sent();
                return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, { tags: ['C'] }, { replaceObjectFields: true })];
            case 38:
                _a.sent();
                return [4 /*yield*/, async_test("Ticket queue empty for no tags match", function () { return sdk.api.tickets.assign_from_queue({ queueId: queue.id }); }, { shouldError: true, onError: function (e) { return e.message === "Queue is empty"; } })];
            case 39:
                _a.sent();
                return [4 /*yield*/, sdk.api.users.updateOne(sdk.userInfo.id, { tags: ['A'] }, { replaceObjectFields: true })];
            case 40:
                _a.sent();
                return [4 /*yield*/, async_test("Ticket by all of tags", function () { return sdk.api.tickets.assign_from_queue({ queueId: queue.id }); }, { onResult: function (r) { return r.ticket.id === oneTagTicket.id; } })];
            case 41:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.ticket_queues.deleteOne(queue.id),
                        sdk.api.ticket_queues.deleteOne(queueUnshared.id),
                        sdk.api.endusers.deleteOne(enduser.id),
                        sdk.api.tickets.deleteOne(ticketUnshared.id),
                        sdk.api.tickets.deleteOne(ticketToPull.id),
                    ])];
            case 42:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
export var alternate_phones_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var createPhone, updatePhone, e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Alternate Phones Tests");
                createPhone = "+15555555554";
                updatePhone = "+15555555555";
                return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'test', fields: { createPhone: createPhone, notAPhone: 'hi' } })];
            case 1:
                e = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.updateOne(e.id, { fields: { updatePhone: updatePhone, stillNotAPhone: 'hi' } })];
            case 2:
                _a.sent();
                return [4 /*yield*/, async_test("alternatePhones automatically populated with custom fields on create and update", function () { return pollForResults(function () { return sdk.api.endusers.getOne(e.id); }, function (e) {
                        var _a, _b, _c;
                        return (((_a = e.fields) === null || _a === void 0 ? void 0 : _a.createPhone) === createPhone
                            && ((_b = e.fields) === null || _b === void 0 ? void 0 : _b.updatePhone) === updatePhone
                            && ((_c = e.alternatePhones) === null || _c === void 0 ? void 0 : _c.length) === 2
                            && e.alternatePhones.includes(createPhone)
                            && e.alternatePhones.includes(updatePhone));
                    }, 50, 20); }, passOnAnyResult)];
            case 3:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.deleteOne(e.id)];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
export var switch_to_related_contacts_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var parent, child, journey, step1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                log_header("Switch to Related Contacts Tests");
                return [4 /*yield*/, sdk.api.endusers.createOne({ fname: "Parent" })];
            case 1:
                parent = _b.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ relationships: [{ type: 'Parent', id: parent.id }] })];
            case 2:
                child = _b.sent();
                return [4 /*yield*/, sdk.api.journeys.createOne({ title: "Parent Child Switch Test" })];
            case 3:
                journey = _b.sent();
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [{ type: 'onJourneyStart', info: {} }],
                        action: {
                            type: 'switchToRelatedContact',
                            info: { type: 'Parent' },
                        }
                    })];
            case 4:
                step1 = _b.sent();
                return [4 /*yield*/, sdk.api.automation_steps.createOne({
                        journeyId: journey.id,
                        events: [{ type: 'afterAction', info: { automationStepId: step1.id, delay: 0, delayInMS: 0, unit: 'Seconds' } }],
                        action: {
                            type: 'addEnduserTags',
                            info: { tags: ['Success'] },
                        }
                    })];
            case 5:
                _b.sent();
                return [4 /*yield*/, sdk.api.endusers.updateOne(child.id, { journeys: (_a = {}, _a[journey.id] = '', _a) })];
            case 6:
                _b.sent();
                return [4 /*yield*/, async_test("Related contact got tags", function () { return pollForResults(function () { return sdk.api.endusers.getOne(parent.id); }, function (e) { var _a; return !!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('Success')); }, 50, 100); }, passOnAnyResult)];
            case 7:
                _b.sent();
                return [2 /*return*/, Promise.all([
                        sdk.api.endusers.deleteOne(parent.id),
                        sdk.api.endusers.deleteOne(child.id),
                        sdk.api.journeys.deleteOne(journey.id),
                    ])];
        }
    });
}); };
export var formsort_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var form, postToFormsort, postToFormsortGeneric, emailAnswer, nameAnswers, answersEmail, address, answers, submissionEnduser, validateResponse, endusers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("FormSort Tests");
                return [4 /*yield*/, sdk.api.forms.createOne({ title: "FormSort" })];
            case 1:
                form = _a.sent();
                postToFormsort = function (_a) { return __awaiter(void 0, void 0, void 0, function () {
                    var _b = _a.matchByName, matchByName = _b === void 0 ? false : _b, o = __rest(_a, ["matchByName"]);
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, axios.post("".concat(host, "/v1/webhooks/formsort/9d4f9dff00f60df2690a16da2cb848f289b447614ad9bef850e54af09a1fbf7a?formId=").concat(form.id, "&matchByName=").concat(matchByName), o)];
                            case 1:
                                _c.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                postToFormsortGeneric = function (_a) { return __awaiter(void 0, void 0, void 0, function () {
                    var _b = _a.matchByName, matchByName = _b === void 0 ? false : _b, o = __rest(_a, ["matchByName"]);
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, axios.post("".concat(host, "/v1/webhooks/form-ingestion/9d4f9dff00f60df2690a16da2cb848f289b447614ad9bef850e54af09a1fbf7a?formId=").concat(form.id, "&matchByName=").concat(matchByName), o)];
                            case 1:
                                _c.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                emailAnswer = { key: 'email', value: 'test@tellescope.com' };
                nameAnswers = [{ key: 'fname', value: 'First' }, { key: 'lname', value: 'Last' }];
                return [4 /*yield*/, postToFormsort({ answers: [{ key: 'test', value: 'test' }], responder_uuid: "1", finalized: false })];
            case 2:
                _a.sent();
                return [4 /*yield*/, async_test("Partial no contact", sdk.api.form_responses.getSome, { onResult: function (r) { return r.length === 0; } })];
            case 3:
                _a.sent();
                return [4 /*yield*/, async_test("Partial no contact", sdk.api.endusers.getSome, { onResult: function (r) { return r.length === 0; } })];
            case 4:
                _a.sent();
                return [4 /*yield*/, postToFormsort({ answers: [{ key: 'test', value: 'test' }, { key: 'termsVersion', value: '1.0' }], responder_uuid: "1", finalized: true })];
            case 5:
                _a.sent();
                return [4 /*yield*/, async_test("Submitted no contact", sdk.api.form_responses.getSome, { onResult: function (r) { return r.length === 1; } })];
            case 6:
                _a.sent();
                return [4 /*yield*/, async_test("Submitted no contact", sdk.api.endusers.getSome, {
                        onResult: function (r) { return r.length === 1 && r[0].termsVersion === '1.0' && !!r[0].termsSigned; }
                    })];
            case 7:
                _a.sent();
                return [4 /*yield*/, postToFormsort({ answers: [emailAnswer], responder_uuid: "2", finalized: false })];
            case 8:
                _a.sent();
                return [4 /*yield*/, async_test("Partial email", sdk.api.form_responses.getSome, { onResult: function (r) { return r.length === 2; } })];
            case 9:
                _a.sent();
                return [4 /*yield*/, async_test("Partial email", sdk.api.endusers.getSome, { onResult: function (r) { return r.length === 2; } })];
            case 10:
                _a.sent();
                return [4 /*yield*/, postToFormsort({ answers: [emailAnswer], responder_uuid: "2", finalized: true })];
            case 11:
                _a.sent();
                return [4 /*yield*/, async_test("Submitted email", sdk.api.form_responses.getSome, { onResult: function (r) { return r.length === 2; } })];
            case 12:
                _a.sent();
                return [4 /*yield*/, async_test("Submitted email", sdk.api.endusers.getSome, { onResult: function (r) { return r.length === 2; } })];
            case 13:
                _a.sent();
                return [4 /*yield*/, postToFormsort({ answers: [emailAnswer], responder_uuid: "3", finalized: true })];
            case 14:
                _a.sent();
                return [4 /*yield*/, async_test("Matched email", sdk.api.form_responses.getSome, { onResult: function (r) { return r.length === 3; } })];
            case 15:
                _a.sent();
                return [4 /*yield*/, async_test("Matched email", sdk.api.endusers.getSome, { onResult: function (r) { return r.length === 2; } })];
            case 16:
                _a.sent();
                return [4 /*yield*/, postToFormsort({ answers: [emailAnswer], responder_uuid: "4", finalized: false, matchByName: true })];
            case 17:
                _a.sent();
                return [4 /*yield*/, async_test("Email no name partial", sdk.api.form_responses.getSome, { onResult: function (r) { return r.length === 3; } })];
            case 18:
                _a.sent();
                return [4 /*yield*/, async_test("Email no name partial", sdk.api.endusers.getSome, { onResult: function (r) { return r.length === 2; } })];
            case 19:
                _a.sent();
                return [4 /*yield*/, postToFormsort({ answers: __spreadArray([emailAnswer], nameAnswers, true), responder_uuid: "4", finalized: false, matchByName: true })];
            case 20:
                _a.sent();
                return [4 /*yield*/, async_test("Email with name partial", sdk.api.form_responses.getSome, { onResult: function (r) { return r.length === 4; } })];
            case 21:
                _a.sent();
                return [4 /*yield*/, async_test("Email with name partial", sdk.api.endusers.getSome, { onResult: function (r) { return r.length === 3; } })];
            case 22:
                _a.sent();
                return [4 /*yield*/, postToFormsortGeneric({ answers: __spreadArray([emailAnswer], nameAnswers, true), responder_uuid: "5", finalized: false, matchByName: true })];
            case 23:
                _a.sent();
                return [4 /*yield*/, async_test("Email with name match partial", sdk.api.form_responses.getSome, { onResult: function (r) { return r.length === 5; } })];
            case 24:
                _a.sent();
                return [4 /*yield*/, async_test("Email with name match partial", sdk.api.endusers.getSome, { onResult: function (r) { return r.length === 3; } })];
            case 25:
                _a.sent();
                return [4 /*yield*/, postToFormsort({ answers: __spreadArray([emailAnswer], nameAnswers, true), responder_uuid: "5", finalized: true, matchByName: true })];
            case 26:
                _a.sent();
                return [4 /*yield*/, async_test("Email with name match", sdk.api.form_responses.getSome, { onResult: function (r) { return r.length === 5; } })];
            case 27:
                _a.sent();
                return [4 /*yield*/, async_test("Email with name match", sdk.api.endusers.getSome, { onResult: function (r) { return r.length === 3; } })];
            case 28:
                _a.sent();
                answersEmail = "formsortanswers@tellescope.com";
                address = {
                    address_1: 'Address 1',
                    address_2: 'Address 2',
                    city: 'City',
                    state: 'State',
                    postal_code: 'ZIP',
                };
                answers = [
                    { key: 'email', value: answersEmail },
                    { key: 'phone', value: "+15555555555" },
                    { key: 'fname', value: 'Fname' },
                    { key: 'lname', value: 'Lname' },
                    { key: 'gender', value: 'Male' },
                    { key: 'defaultFromEmail', value: 'from@tellescope.com' },
                    { key: 'useDefaultFromEmailInAutomations', value: true },
                    { key: 'defaultFromPhone', value: '+15555555555' },
                    { key: 'useDefaultFromPhoneInAutomations', value: true },
                    { key: 'language', value: 'Spanish' },
                    { key: 'timezone', value: 'US/Eastern' },
                    { key: 'healthie_dietitian_id', value: 'test_id' },
                    { key: 'height', value: 10 },
                    { key: 'weight', value: 20 },
                    { key: 'address', value: address },
                    { key: 'dateOfBirth', value: '2000-12-20' },
                    { key: 'insurance.payerId', value: 'insurance 1' },
                    { key: 'insuranceSecondary.payerId', value: 'insurance 2' },
                    { key: 'ts_enduser_custom', value: 'Custom' },
                    { key: 'ts_enduser_custom2', value: 'Custom 2' },
                    { key: 'multiple_choice', value: ['multiple choice'] },
                ];
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: answersEmail })];
            case 29:
                _a.sent();
                return [4 /*yield*/, postToFormsort({
                        answers: answers,
                        responder_uuid: "6",
                        finalized: false,
                        matchByName: false,
                    })];
            case 30:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne({ email: answersEmail })];
            case 31:
                submissionEnduser = _a.sent();
                validateResponse = function (fr, key, value) {
                    var _a, _b, _c;
                    var answer = (_c = (_b = (_a = fr.responses) === null || _a === void 0 ? void 0 : _a.find(function (r) { return r.externalId === key; })) === null || _b === void 0 ? void 0 : _b.answer) === null || _c === void 0 ? void 0 : _c.value;
                    if (typeof value === 'object') {
                        return objects_equivalent(answer, value);
                    }
                    return answer === value;
                };
                // EXISTING ENDUSER FIELDS ARE CURRENTLY ONLY UPDATED ON SUBMISSION
                return [4 /*yield*/, async_test("Answers and fields (unfinalized)", function () { return sdk.api.form_responses.getOne({ externalId: '6' }); }, {
                        onResult: function (r) {
                            var _a, _b;
                            if (!r) {
                                return false;
                            }
                            if (r.submittedAt) {
                                return false;
                            }
                            if (!((_a = r.formsort) === null || _a === void 0 ? void 0 : _a.length)) {
                                return false;
                            }
                            if (!((_b = r.responses) === null || _b === void 0 ? void 0 : _b.length)) {
                                return false;
                            }
                            if (r.responses.length !== answers.length) {
                                return false;
                            }
                            if (!validateResponse(r, 'address', JSON.stringify(address, null, 2))) {
                                return false;
                            }
                            if (!validateResponse(r, 'email', answersEmail)) {
                                return false;
                            }
                            if (!validateResponse(r, 'phone', "+15555555555")) {
                                return false;
                            }
                            if (!validateResponse(r, 'fname', "Fname")) {
                                return false;
                            }
                            if (!validateResponse(r, 'lname', "Lname")) {
                                return false;
                            }
                            if (!validateResponse(r, 'gender', "Male")) {
                                return false;
                            }
                            if (!validateResponse(r, 'defaultFromEmail', "from@tellescope.com")) {
                                return false;
                            }
                            if (!validateResponse(r, 'useDefaultFromEmailInAutomations', "true")) {
                                return false;
                            }
                            if (!validateResponse(r, 'defaultFromPhone', "+15555555555")) {
                                return false;
                            }
                            if (!validateResponse(r, 'useDefaultFromPhoneInAutomations', "true")) {
                                return false;
                            }
                            if (!validateResponse(r, 'language', "Spanish")) {
                                return false;
                            }
                            if (!validateResponse(r, 'timezone', "US/Eastern")) {
                                return false;
                            }
                            if (!validateResponse(r, 'healthie_dietitian_id', "test_id")) {
                                return false;
                            }
                            if (!validateResponse(r, 'height', "10")) {
                                return false;
                            }
                            if (!validateResponse(r, 'weight', "20")) {
                                return false;
                            }
                            if (!validateResponse(r, 'dateOfBirth', "2000-12-20")) {
                                return false;
                            }
                            if (!validateResponse(r, 'insurance.payerId', "insurance 1")) {
                                return false;
                            }
                            if (!validateResponse(r, 'insuranceSecondary.payerId', "insurance 2")) {
                                return false;
                            }
                            if (!validateResponse(r, 'ts_enduser_custom', "Custom")) {
                                return false;
                            }
                            if (!validateResponse(r, 'ts_enduser_custom2', "Custom 2")) {
                                return false;
                            }
                            if (!validateResponse(r, 'multiple_choice', ['multiple choice'])) {
                                return false;
                            }
                            return true;
                        }
                    })];
            case 32:
                // EXISTING ENDUSER FIELDS ARE CURRENTLY ONLY UPDATED ON SUBMISSION
                _a.sent();
                return [4 /*yield*/, postToFormsort({
                        answers: answers,
                        responder_uuid: "6",
                        finalized: true,
                        matchByName: false,
                    })];
            case 33:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne({ email: answersEmail })
                    // EXISTING ENDUSER FIELDS ARE CURRENTLY ONLY UPDATED ON SUBMISSION
                ];
            case 34:
                submissionEnduser = _a.sent();
                // EXISTING ENDUSER FIELDS ARE CURRENTLY ONLY UPDATED ON SUBMISSION
                return [4 /*yield*/, async_test("Answers and fields (finalized)", function () { return sdk.api.form_responses.getOne({ externalId: '6' }); }, {
                        onResult: function (r) {
                            var _a, _b, _c, _d, _f, _g, _h, _j, _k;
                            if (!r) {
                                return false;
                            }
                            if (!r.submittedAt) {
                                return false;
                            }
                            if (!((_a = r.formsort) === null || _a === void 0 ? void 0 : _a.length)) {
                                return false;
                            }
                            if (!((_b = r.responses) === null || _b === void 0 ? void 0 : _b.length)) {
                                return false;
                            }
                            if (r.responses.length !== answers.length) {
                                return false;
                            }
                            if (!validateResponse(r, 'address', JSON.stringify(address, null, 2))) {
                                return false;
                            }
                            if (!validateResponse(r, 'email', answersEmail)) {
                                return false;
                            }
                            if (!validateResponse(r, 'phone', "+15555555555")) {
                                return false;
                            }
                            if (!validateResponse(r, 'fname', "Fname")) {
                                return false;
                            }
                            if (!validateResponse(r, 'lname', "Lname")) {
                                return false;
                            }
                            if (!validateResponse(r, 'gender', "Male")) {
                                return false;
                            }
                            if (!validateResponse(r, 'defaultFromEmail', "from@tellescope.com")) {
                                return false;
                            }
                            if (!validateResponse(r, 'useDefaultFromEmailInAutomations', "true")) {
                                return false;
                            }
                            if (!validateResponse(r, 'defaultFromPhone', "+15555555555")) {
                                return false;
                            }
                            if (!validateResponse(r, 'useDefaultFromPhoneInAutomations', "true")) {
                                return false;
                            }
                            if (!validateResponse(r, 'language', "Spanish")) {
                                return false;
                            }
                            if (!validateResponse(r, 'timezone', "US/Eastern")) {
                                return false;
                            }
                            if (!validateResponse(r, 'healthie_dietitian_id', "test_id")) {
                                return false;
                            }
                            if (!validateResponse(r, 'height', "10")) {
                                return false;
                            }
                            if (!validateResponse(r, 'weight', "20")) {
                                return false;
                            }
                            if (!validateResponse(r, 'dateOfBirth', "2000-12-20")) {
                                return false;
                            }
                            if (!validateResponse(r, 'insurance.payerId', "insurance 1")) {
                                return false;
                            }
                            if (!validateResponse(r, 'insuranceSecondary.payerId', "insurance 2")) {
                                return false;
                            }
                            if (!validateResponse(r, 'ts_enduser_custom', "Custom")) {
                                return false;
                            }
                            if (!validateResponse(r, 'ts_enduser_custom2', "Custom 2")) {
                                return false;
                            }
                            if (!validateResponse(r, 'multiple_choice', ['multiple choice'])) {
                                return false;
                            }
                            if (submissionEnduser.email !== answersEmail) {
                                return false;
                            }
                            if (submissionEnduser.fname !== 'Fname') {
                                return false;
                            }
                            if (submissionEnduser.lname !== 'Lname') {
                                return false;
                            }
                            if (submissionEnduser.gender !== 'Male') {
                                return false;
                            }
                            if (submissionEnduser.phone !== '+15555555555') {
                                return false;
                            }
                            if (submissionEnduser.defaultFromEmail !== 'from@tellescope.com') {
                                return false;
                            }
                            if (submissionEnduser.useDefaultFromEmailInAutomations !== true) {
                                return false;
                            }
                            if (submissionEnduser.defaultFromPhone !== '+15555555555') {
                                return false;
                            }
                            if (submissionEnduser.useDefaultFromPhoneInAutomations !== true) {
                                return false;
                            }
                            if (((_c = submissionEnduser.language) === null || _c === void 0 ? void 0 : _c.displayName) !== "Spanish") {
                                return false;
                            }
                            if (submissionEnduser.timezone !== "US/Eastern") {
                                return false;
                            }
                            if (submissionEnduser.healthie_dietitian_id !== "test_id") {
                                return false;
                            }
                            if (((_d = submissionEnduser.height) === null || _d === void 0 ? void 0 : _d.value) !== 10) {
                                return false;
                            }
                            if (((_f = submissionEnduser.weight) === null || _f === void 0 ? void 0 : _f.value) !== 20) {
                                return false;
                            }
                            if (submissionEnduser.addressLineOne !== 'Address 1') {
                                return false;
                            }
                            if (submissionEnduser.addressLineTwo !== 'Address 2') {
                                return false;
                            }
                            if (submissionEnduser.city !== 'City') {
                                return false;
                            }
                            if (submissionEnduser.state !== 'State') {
                                return false;
                            }
                            if (submissionEnduser.zipCode !== 'ZIP') {
                                return false;
                            }
                            if (submissionEnduser.dateOfBirth !== '12-20-2000') {
                                return false;
                            }
                            if (((_g = submissionEnduser.insurance) === null || _g === void 0 ? void 0 : _g.payerId) !== 'insurance 1') {
                                return false;
                            }
                            if (((_h = submissionEnduser.insuranceSecondary) === null || _h === void 0 ? void 0 : _h.payerId) !== 'insurance 2') {
                                return false;
                            }
                            if (((_j = submissionEnduser.fields) === null || _j === void 0 ? void 0 : _j.custom) !== 'Custom') {
                                return false;
                            }
                            if (((_k = submissionEnduser.fields) === null || _k === void 0 ? void 0 : _k.custom2) !== 'Custom 2') {
                                return false;
                            }
                            return true;
                        }
                    })
                    // cleanup
                ];
            case 35:
                // EXISTING ENDUSER FIELDS ARE CURRENTLY ONLY UPDATED ON SUBMISSION
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.getSome()];
            case 36:
                endusers = _a.sent();
                return [4 /*yield*/, Promise.all(__spreadArray([
                        sdk.api.forms.deleteOne(form.id)
                    ], endusers.map(function (e) { return sdk.api.endusers.deleteOne(e.id); }), true))];
            case 37:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// initially added to validate items can be added via API
export var enduser_orders_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var orders;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("EnduserOrders Tests");
                return [4 /*yield*/, async_test("Items are optional", function () { return sdk.api.enduser_orders.createOne({ title: 'test', status: 'test', externalId: '1', source: 'test', enduserId: PLACEHOLDER_ID }); }, { onResult: function (r) { return !!r.enduserId; } })];
            case 1:
                _a.sent();
                return [4 /*yield*/, async_test("Items are allowed (singleton)", function () { return sdk.api.enduser_orders.createOne({ title: 'test', status: 'test', externalId: '2', source: 'test', enduserId: PLACEHOLDER_ID, items: [{ title: 'item 1' }] }); }, { onResult: function (r) { var _a; return ((_a = r.items) === null || _a === void 0 ? void 0 : _a.length) === 1; } })];
            case 2:
                _a.sent();
                return [4 /*yield*/, async_test("Items are allowed (multiple)", function () { return sdk.api.enduser_orders.createOne({ title: 'test', status: 'test', externalId: '3', source: 'test', enduserId: PLACEHOLDER_ID, items: [{ title: 'item 1' }, { title: 'item 2', tracking: 'tracking' }] }); }, { onResult: function (r) { var _a; return ((_a = r.items) === null || _a === void 0 ? void 0 : _a.length) === 2 && r.items[0].title === 'item 1' && !r.items[0].tracking && r.items[1].title === 'item 2' && r.items[1].tracking === 'tracking'; } })];
            case 3:
                _a.sent();
                return [4 /*yield*/, sdk.api.enduser_orders.getSome()];
            case 4:
                orders = _a.sent();
                return [2 /*return*/, Promise.all(orders.map(function (o) { return sdk.api.enduser_orders.deleteOne(o.id); }))];
        }
    });
}); };
var agent_record_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var r1, _a, r2, r3, sdkOther;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                log_header("AgentRecord Tests");
                return [4 /*yield*/, sdk.api.agent_records.createOne({ title: 'test', description: '', type: 'Article' })];
            case 1:
                r1 = _b.sent();
                return [4 /*yield*/, sdk.api.agent_records.updateOne(r1.id, { title: 'updated' })];
            case 2:
                _b.sent();
                return [4 /*yield*/, sdk.api.agent_records.createSome([{ title: 'test 2', description: '', type: 'Article' }, { title: 'test 3', description: '', type: 'Article' }])];
            case 3:
                _a = (_b.sent()).created, r2 = _a[0], r3 = _a[1];
                sdkOther = new Session({ host: host });
                return [4 /*yield*/, sdkOther.authenticate(email2, password2)];
            case 4:
                _b.sent();
                return [4 /*yield*/, async_test("AgentRecord create blocked", function () { return sdkOther.api.agent_records.createOne({ title: 'test', description: '', type: 'Article' }); }, { shouldError: true, onError: function (e) { return true; } })];
            case 5:
                _b.sent();
                return [4 /*yield*/, async_test("AgentRecord create many blocked", function () { return sdkOther.api.agent_records.createSome([{ title: 'test', description: '', type: 'Article' }, { title: 'test', description: '', type: 'Article' }]); }, { shouldError: true, onError: function (e) { return true; } })];
            case 6:
                _b.sent();
                return [4 /*yield*/, async_test("AgentRecord update blocked", function () { return sdkOther.api.agent_records.updateOne(r1.id, { title: 'updated' }); }, { shouldError: true, onError: function (e) { return true; } })];
            case 7:
                _b.sent();
                return [4 /*yield*/, async_test("AgentRecord delete blocked", function () { return sdkOther.api.agent_records.deleteOne(r1.id); }, { shouldError: true, onError: function (e) { return true; } })];
            case 8:
                _b.sent();
                return [4 /*yield*/, async_test("AgentRecord read access allowed in a different organizatino", function () { return sdkSub.api.agent_records.getSome(); }, { onResult: function (r) { return !!r.find(function (r) { return r.businessId !== sdkSub.userInfo.businessId; }); } })];
            case 9:
                _b.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.agent_records.deleteOne(r1.id),
                        sdk.api.agent_records.deleteOne(r2.id),
                        sdk.api.agent_records.deleteOne(r3.id),
                    ])];
            case 10:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
var waitlist_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var e1, e2, e3, e4, e5, j, list;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Waitlist Tests");
                return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'test1' })];
            case 1:
                e1 = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'test2' })];
            case 2:
                e2 = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'test3' })];
            case 3:
                e3 = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'test4' })];
            case 4:
                e4 = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'test5' })];
            case 5:
                e5 = _a.sent();
                return [4 /*yield*/, sdk.api.journeys.createOne({ title: 'test' })];
            case 6:
                j = _a.sent();
                return [4 /*yield*/, sdk.api.waitlists.createOne({ title: 'test', journeyId: j.id, enduserIds: [e1.id, e2.id, e3.id, e4.id, e5.id] })];
            case 7:
                list = _a.sent();
                return [4 /*yield*/, sdk.api.waitlists.grant_access_from_waitlist({ id: list.id, count: 2 })];
            case 8:
                _a.sent();
                return [4 /*yield*/, async_test("Waitlist remove updates enduserids", function () { return sdk.api.waitlists.getOne(list.id); }, { onResult: function (l) { return l.enduserIds.length === 3 && l.enduserIds[0] === e3.id; } })];
            case 9:
                _a.sent();
                return [4 /*yield*/, async_test("Waitlist adds to Journey", function () { return pollForResults(function () { return sdk.api.endusers.getSome(); }, function (es) {
                        var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l;
                        return (((_b = (_a = es.find(function (e) { return e.id === e1.id; })) === null || _a === void 0 ? void 0 : _a.journeys) === null || _b === void 0 ? void 0 : _b[j.id]) !== undefined
                            && ((_d = (_c = es.find(function (e) { return e.id === e2.id; })) === null || _c === void 0 ? void 0 : _c.journeys) === null || _d === void 0 ? void 0 : _d[j.id]) !== undefined
                            && ((_g = (_f = es.find(function (e) { return e.id === e3.id; })) === null || _f === void 0 ? void 0 : _f.journeys) === null || _g === void 0 ? void 0 : _g[j.id]) === undefined
                            && ((_j = (_h = es.find(function (e) { return e.id === e4.id; })) === null || _h === void 0 ? void 0 : _h.journeys) === null || _j === void 0 ? void 0 : _j[j.id]) === undefined
                            && ((_l = (_k = es.find(function (e) { return e.id === e5.id; })) === null || _k === void 0 ? void 0 : _k.journeys) === null || _l === void 0 ? void 0 : _l[j.id]) === undefined);
                    }, 25, 10); }, passOnAnyResult)];
            case 10:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.deleteOne(e3.id)];
            case 11:
                _a.sent();
                return [4 /*yield*/, async_test("Deleting enduser removes from Waitlist", function () { return pollForResults(function () { return sdk.api.waitlists.getOne(list.id); }, function (w) { return w.enduserIds.length === 2; }, 25, 10); }, passOnAnyResult)];
            case 12:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.merge({ sourceEnduserId: e4.id, destinationEnduserId: e5.id })];
            case 13:
                _a.sent();
                return [4 /*yield*/, async_test("Deleting enduser via merge removes from Waitlist", function () { return pollForResults(function () { return sdk.api.waitlists.getOne(list.id); }, function (w) { return w.enduserIds.length === 1; }, 25, 10); }, passOnAnyResult)];
            case 14:
                _a.sent();
                return [2 /*return*/, (Promise.all([
                        sdk.api.waitlists.deleteOne(list.id),
                        sdk.api.endusers.deleteOne(e1.id),
                        sdk.api.endusers.deleteOne(e2.id),
                        sdk.api.endusers.deleteOne(e5.id),
                        sdk.api.journeys.deleteOne(j.id),
                    ]))];
        }
    });
}); };
var configurations_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var c;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Configurations Tests");
                return [4 /*yield*/, sdk.api.configurations.createOne({ type: 'testing', value: '<script>hello</script>!!!' })];
            case 1:
                c = _a.sent();
                return [4 /*yield*/, async_test("Configurations strips html tags", function () { return sdk.api.configurations.getOne(c.id); }, { onResult: function (r) { return r.value === '!!!'; } })];
            case 2:
                _a.sent();
                return [4 /*yield*/, sdk.api.configurations.deleteOne(c.id)];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var NO_TEST = function () { };
var tests = {
    agent_records: agent_record_tests,
    enduser_eligibility_results: NO_TEST,
    diagnosis_codes: NO_TEST,
    allergy_codes: NO_TEST,
    suggested_contacts: NO_TEST,
    call_hold_queues: NO_TEST,
    fax_logs: NO_TEST,
    form_groups: NO_TEST,
    webhook_logs: NO_TEST,
    flowchart_notes: NO_TEST,
    enduser_problems: NO_TEST,
    vital_configurations: NO_TEST,
    enduser_encounters: NO_TEST,
    enduser_orders: enduser_orders_tests,
    ticket_queues: NO_TEST,
    phone_trees: NO_TEST,
    enduser_medications: NO_TEST,
    automation_triggers: NO_TEST,
    automation_steps: automation_events_tests,
    background_errors: NO_TEST,
    enduser_views: NO_TEST,
    availability_blocks: NO_TEST,
    analytics_frames: NO_TEST,
    products: NO_TEST,
    purchase_credits: NO_TEST,
    purchases: NO_TEST,
    appointment_locations: NO_TEST,
    appointment_booking_pages: NO_TEST,
    role_based_access_permissions: role_based_access_permissions_tests,
    chat_rooms: chat_room_tests,
    files: files_tests,
    enduser_tasks: NO_TEST,
    care_plans: NO_TEST,
    portal_customizations: NO_TEST,
    calendar_event_templates: NO_TEST,
    databases: databases_tests,
    database_records: NO_TEST,
    post_comments: NO_TEST,
    journeys: journey_tests,
    calendar_event_RSVPs: calendar_event_RSVPs_tests,
    chats: chat_tests,
    endusers: enduser_tests,
    api_keys: api_key_tests,
    engagement_events: engagement_tests,
    emails: email_tests,
    sms_messages: sms_tests,
    users: users_tests,
    templates: NO_TEST,
    tickets: NO_TEST,
    meetings: meetings_tests,
    notes: NO_TEST,
    forms: NO_TEST,
    form_fields: NO_TEST,
    form_responses: form_response_tests,
    calendar_events: calendar_events_tests,
    webhooks: NO_TEST,
    automated_actions: NO_TEST,
    enduser_status_updates: status_update_tests,
    user_logs: NO_TEST,
    user_notifications: notifications_tests,
    enduser_observations: NO_TEST,
    forum_posts: NO_TEST,
    forums: community_tests,
    managed_content_records: managed_content_records_tests,
    managed_content_record_assignments: NO_TEST,
    post_likes: NO_TEST,
    comment_likes: NO_TEST,
    organizations: NO_TEST,
    integrations: NO_TEST,
    phone_calls: NO_TEST,
    superbill_providers: NO_TEST,
    superbills: NO_TEST,
    enduser_profile_views: NO_TEST,
    enduser_custom_types: NO_TEST,
    table_views: NO_TEST,
    email_sync_denials: NO_TEST,
    ticket_threads: NO_TEST,
    ticket_thread_comments: NO_TEST,
    configurations: configurations_tests,
    group_mms_conversations: NO_TEST,
    blocked_phones: NO_TEST,
    prescription_routes: NO_TEST,
    portal_brandings: NO_TEST,
    message_template_snippets: NO_TEST,
    integration_logs: NO_TEST,
    waitlists: waitlist_tests,
};
var TRACK_OPEN_IMAGE = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", 'base64');
var validate_schema = function () {
    var _a;
    log_header("Validate Schema");
    var endpoints = new Set([]);
    var modelName = undefined;
    for (modelName in schema) {
        for (var endpointName in schema[modelName].customActions) {
            var path = schema[modelName].customActions[endpointName].path || '';
            if (path === '' && endpointName === 'create')
                continue; // uses default
            if (endpoints.has(path)) {
                throw new Error("Duplicate path: ".concat(path, ", ").concat(endpointName));
            }
            endpoints.add(path);
        }
        for (var endpointName in (_a = schema[modelName].publicActions) !== null && _a !== void 0 ? _a : {}) {
            var path = schema[modelName].publicActions[endpointName].path || '';
            if (endpoints.has(path)) {
                throw new Error("Duplicate path: ".concat(path, ", ").concat(endpointName));
            }
            endpoints.add(path);
        }
    }
    console.log("Schema validated");
};
var test_weighted_round_robin = function () { return __awaiter(void 0, void 0, void 0, function () {
    var testUsers, userIds, testAssignments, run_assignment_simulation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Test validate_weighted_round_robin");
                testUsers = [
                    { id: '0', ticketAssignmentPriority: undefined },
                    { id: '1', ticketAssignmentPriority: 1 },
                    { id: '2', ticketAssignmentPriority: 2 },
                    { id: '3', ticketAssignmentPriority: 3 },
                ];
                userIds = testUsers.map(function (u) { return u.id; });
                testAssignments = testUsers.map(function (u, i) { return ({
                    id: i.toString(),
                    key: 'test',
                    timestamp: Date.now() - 1000,
                    userId: u.id,
                }); });
                return [4 /*yield*/, async_test("Both empty", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, weighted_round_robin({ assignments: [], users: [] })];
                    }); }); }, { onResult: function (r) { return r.selected === undefined; } })];
            case 1:
                _a.sent();
                return [4 /*yield*/, async_test("Single user, empty assignment", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, weighted_round_robin({ assignments: [], users: [testUsers[0]] })];
                    }); }); }, { onResult: function (r) { return r.selected === testUsers[0].id; } })];
            case 2:
                _a.sent();
                return [4 /*yield*/, async_test("Both singletons", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, weighted_round_robin({ assignments: [testAssignments[0]], users: [testUsers[0]] })];
                    }); }); }, { onResult: function (r) { return r.selected === testUsers[0].id; } })];
            case 3:
                _a.sent();
                run_assignment_simulation = function (_a) {
                    var iterations = _a.iterations, expectedSelections = _a.expectedSelections, _b = _a.users, users = _b === void 0 ? testUsers : _b, _c = _a.title, title = _c === void 0 ? "Simulation ".concat(iterations) : _c;
                    var assignments = [];
                    var selections = [];
                    for (var i = 0; i < iterations; i++) {
                        if (assignments.length !== i) {
                            throw new Error("Invariant Violation: assignment not saved in history");
                        }
                        var selected = weighted_round_robin({ assignments: assignments, users: users }).selected;
                        selections.push(selected);
                        var assignment = {
                            id: i.toString(),
                            userId: selected || '',
                            key: 'test',
                            timestamp: i, // simply ensures increasing timestamps per assignment
                        };
                        // ensure that assignment order doesn't matter (e.g. weighted_round_robin sorts internally)
                        if (i % 2 === 0) {
                            assignments.push(assignment); // add to back
                        }
                        else {
                            assignments.unshift(assignment); // add to front
                        }
                    }
                    assert(objects_equivalent(selections, expectedSelections), title + '\n' + JSON.stringify({ expected: expectedSelections, got: selections }, null, 2), title);
                };
                run_assignment_simulation({ expectedSelections: [], iterations: 0 });
                run_assignment_simulation({ expectedSelections: [userIds[0]], iterations: 1 });
                run_assignment_simulation({ expectedSelections: [userIds[0], userIds[1]], iterations: 2 });
                run_assignment_simulation({ expectedSelections: [userIds[0], userIds[1], userIds[2]], iterations: 3 });
                run_assignment_simulation({ expectedSelections: [userIds[0], userIds[1], userIds[2], userIds[3]], iterations: 4 });
                run_assignment_simulation({ iterations: 5,
                    expectedSelections: [
                        userIds[0], userIds[1], userIds[2], userIds[3],
                        userIds[0],
                    ],
                });
                run_assignment_simulation({ iterations: 6, expectedSelections: [
                        userIds[0], userIds[1], userIds[2], userIds[3],
                        userIds[0], userIds[2],
                    ] });
                run_assignment_simulation({ iterations: 7, expectedSelections: [
                        userIds[0], userIds[1], userIds[2], userIds[3],
                        userIds[0], userIds[2], userIds[3],
                    ] });
                run_assignment_simulation({ iterations: 8, expectedSelections: [
                        userIds[0], userIds[1], userIds[2], userIds[3],
                        userIds[0], userIds[2], userIds[3],
                        userIds[0],
                    ] });
                run_assignment_simulation({ iterations: 9,
                    expectedSelections: [
                        userIds[0], userIds[1], userIds[2], userIds[3],
                        userIds[0], userIds[2], userIds[3],
                        userIds[0], userIds[3],
                    ],
                });
                run_assignment_simulation({ iterations: 10,
                    expectedSelections: [
                        userIds[0], userIds[1], userIds[2], userIds[3],
                        userIds[0], userIds[2], userIds[3],
                        userIds[0], userIds[3],
                        userIds[0],
                    ],
                });
                run_assignment_simulation({ iterations: 11,
                    expectedSelections: [
                        userIds[0], userIds[1], userIds[2], userIds[3],
                        userIds[0], userIds[2], userIds[3],
                        userIds[0], userIds[3],
                        userIds[0],
                        userIds[0],
                    ],
                });
                run_assignment_simulation({ iterations: 12,
                    expectedSelections: [
                        userIds[0], userIds[1], userIds[2], userIds[3],
                        userIds[0], userIds[2], userIds[3],
                        userIds[0], userIds[3],
                        userIds[0],
                        userIds[0],
                        userIds[0],
                    ],
                });
                run_assignment_simulation({ iterations: 13,
                    expectedSelections: [
                        userIds[0], userIds[1], userIds[2], userIds[3],
                        userIds[0], userIds[2], userIds[3],
                        userIds[0], userIds[3],
                        userIds[0],
                        userIds[0],
                        userIds[0], userIds[1],
                    ],
                });
                run_assignment_simulation({ iterations: 14,
                    expectedSelections: [
                        userIds[0], userIds[1], userIds[2], userIds[3],
                        userIds[0], userIds[2], userIds[3],
                        userIds[0], userIds[3],
                        userIds[0],
                        userIds[0],
                        userIds[0], userIds[1], userIds[2],
                    ],
                });
                run_assignment_simulation({ iterations: 15,
                    expectedSelections: [
                        userIds[0], userIds[1], userIds[2], userIds[3],
                        userIds[0], userIds[2], userIds[3],
                        userIds[0], userIds[3],
                        userIds[0],
                        userIds[0],
                        userIds[0], userIds[1], userIds[2], userIds[3],
                    ],
                });
                return [2 /*return*/];
        }
    });
}); };
var enduser_access_tags_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var matchTag, dontMatchTag, ticketTitle, matchEnduser, matchMultiTagEnduser, dontMatchEnduser, matchTicket, dontMatchTicket;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("enduser_access_tags_tests");
                matchTag = 'Access';
                dontMatchTag = 'No Access';
                ticketTitle = 'ticket';
                return [4 /*yield*/, sdk.api.endusers.createOne({ accessTags: [matchTag] })];
            case 1:
                matchEnduser = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ accessTags: [matchTag, dontMatchTag] })];
            case 2:
                matchMultiTagEnduser = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ accessTags: [dontMatchTag] })];
            case 3:
                dontMatchEnduser = _a.sent();
                return [4 /*yield*/, sdk.api.tickets.createOne({ enduserId: matchEnduser.id, title: ticketTitle })];
            case 4:
                matchTicket = _a.sent();
                return [4 /*yield*/, sdk.api.tickets.createOne({ enduserId: dontMatchEnduser.id, title: ticketTitle })
                    // start with disabled setting an no tags on non-admin
                ];
            case 5:
                dontMatchTicket = _a.sent();
                // start with disabled setting an no tags on non-admin
                return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { tags: [] }, { replaceObjectFields: true })];
            case 6:
                // start with disabled setting an no tags on non-admin
                _a.sent();
                return [4 /*yield*/, sdk.api.organizations.updateOne(sdkNonAdmin.userInfo.businessId, {
                        settings: { endusers: { enableAccessTags: false } }
                    })];
            case 7:
                _a.sent();
                return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)]; // ensure enableAccessTags setting stored correctly on jwt
            case 8:
                _a.sent(); // ensure enableAccessTags setting stored correctly on jwt
                return [4 /*yield*/, async_test("Setting disabled, no tags, list", sdkNonAdmin.api.endusers.getSome, { onResult: function (r) { return r.length === 0; } })];
            case 9:
                _a.sent();
                return [4 /*yield*/, async_test("Setting disabled, matchEnduser", function () { return sdkNonAdmin.api.endusers.getOne(matchEnduser.id); }, handleAnyError)];
            case 10:
                _a.sent();
                return [4 /*yield*/, async_test("Setting disabled, dontMatchEnduser", function () { return sdkNonAdmin.api.endusers.getOne(dontMatchEnduser.id); }, handleAnyError)];
            case 11:
                _a.sent();
                return [4 /*yield*/, async_test("Setting disabled, no tags, tickets", sdkNonAdmin.api.tickets.getSome, { onResult: function (r) { return r.length === 0; } })];
            case 12:
                _a.sent();
                return [4 /*yield*/, async_test("Setting disabled, no tags, tickets search", function () { return sdkNonAdmin.api.tickets.getSome({ search: { query: ticketTitle } }); }, { onResult: function (r) { return r.length === 0; } })];
            case 13:
                _a.sent();
                return [4 /*yield*/, async_test("Setting disabled, matchEnduser ticket", function () { return sdkNonAdmin.api.tickets.getOne(matchTicket.id); }, handleAnyError)];
            case 14:
                _a.sent();
                return [4 /*yield*/, async_test("Setting disabled, dontMatchEnduser ticket", function () { return sdkNonAdmin.api.tickets.getOne(dontMatchTicket.id); }, handleAnyError)];
            case 15:
                _a.sent();
                return [4 /*yield*/, async_test("tickets filter enduser valid", function () { return sdkNonAdmin.api.tickets.getSome({ filter: { enduserId: matchEnduser.id } }); }, {
                        onResult: function (r) { return r.length === 0; }
                    })];
            case 16:
                _a.sent();
                return [4 /*yield*/, async_test("tickets filter enduser invalid", function () { return sdkNonAdmin.api.tickets.getSome({ filter: { enduserId: dontMatchEnduser.id } }); }, {
                        onResult: function (r) { return r.length === 0; }
                    })
                    // enable setting, disable tags
                ];
            case 17:
                _a.sent();
                // enable setting, disable tags
                return [4 /*yield*/, sdk.api.organizations.updateOne(sdkNonAdmin.userInfo.businessId, {
                        settings: { endusers: { enableAccessTags: true } }
                    })];
            case 18:
                // enable setting, disable tags
                _a.sent();
                return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)]; // ensure enableAccessTags setting stored correctly on jwt
            case 19:
                _a.sent(); // ensure enableAccessTags setting stored correctly on jwt
                return [4 /*yield*/, async_test("enable setting, disable tags", sdkNonAdmin.api.endusers.getSome, { onResult: function (r) { return r.length === 0; } })];
            case 20:
                _a.sent();
                return [4 /*yield*/, async_test("enable setting, matchEnduser", function () { return sdkNonAdmin.api.endusers.getOne(matchEnduser.id); }, handleAnyError)];
            case 21:
                _a.sent();
                return [4 /*yield*/, async_test("enable setting, dontMatchEnduser", function () { return sdkNonAdmin.api.endusers.getOne(dontMatchEnduser.id); }, handleAnyError)];
            case 22:
                _a.sent();
                return [4 /*yield*/, async_test("enable setting, no tags, tickets", sdkNonAdmin.api.tickets.getSome, { onResult: function (r) { return r.length === 0; } })];
            case 23:
                _a.sent();
                return [4 /*yield*/, async_test("enable setting, no tags, tickets search", function () { return sdkNonAdmin.api.tickets.getSome({ search: { query: ticketTitle } }); }, { onResult: function (r) { return r.length === 0; } })];
            case 24:
                _a.sent();
                return [4 /*yield*/, async_test("enable setting, matchEnduser ticket", function () { return sdkNonAdmin.api.tickets.getOne(matchTicket.id); }, handleAnyError)];
            case 25:
                _a.sent();
                return [4 /*yield*/, async_test("enable setting, dontMatchEnduser ticket", function () { return sdkNonAdmin.api.tickets.getOne(dontMatchTicket.id); }, handleAnyError)];
            case 26:
                _a.sent();
                return [4 /*yield*/, async_test("tickets filter enduser valid", function () { return sdkNonAdmin.api.tickets.getSome({ filter: { enduserId: matchEnduser.id } }); }, {
                        onResult: function (r) { return r.length === 0; }
                    })];
            case 27:
                _a.sent();
                return [4 /*yield*/, async_test("tickets filter enduser invalid", function () { return sdkNonAdmin.api.tickets.getSome({ filter: { enduserId: dontMatchEnduser.id } }); }, {
                        onResult: function (r) { return r.length === 0; }
                    })
                    // disable setting, enable tags
                ];
            case 28:
                _a.sent();
                // disable setting, enable tags
                return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { tags: [matchTag] }, { replaceObjectFields: true })];
            case 29:
                // disable setting, enable tags
                _a.sent();
                return [4 /*yield*/, sdk.api.organizations.updateOne(sdkNonAdmin.userInfo.businessId, {
                        settings: { endusers: { enableAccessTags: false } }
                    })];
            case 30:
                _a.sent();
                return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)]; // ensure enableAccessTags setting stored correctly on jwt
            case 31:
                _a.sent(); // ensure enableAccessTags setting stored correctly on jwt
                return [4 /*yield*/, async_test("disable setting, enable tags", sdkNonAdmin.api.endusers.getSome, { onResult: function (r) { return r.length === 0; } })];
            case 32:
                _a.sent();
                return [4 /*yield*/, async_test("disable setting, matchEnduser", function () { return sdkNonAdmin.api.endusers.getOne(matchEnduser.id); }, handleAnyError)];
            case 33:
                _a.sent();
                return [4 /*yield*/, async_test("disable setting, dontMatchEnduser", function () { return sdkNonAdmin.api.endusers.getOne(dontMatchEnduser.id); }, handleAnyError)];
            case 34:
                _a.sent();
                return [4 /*yield*/, async_test("disable setting, enable tags, tickets", sdkNonAdmin.api.tickets.getSome, { onResult: function (r) { return r.length === 0; } })];
            case 35:
                _a.sent();
                return [4 /*yield*/, async_test("disable setting, no tags, tickets search", function () { return sdkNonAdmin.api.tickets.getSome({ search: { query: ticketTitle } }); }, { onResult: function (r) { return r.length === 0; } })];
            case 36:
                _a.sent();
                return [4 /*yield*/, async_test("disable setting, matchEnduser ticket", function () { return sdkNonAdmin.api.tickets.getOne(matchTicket.id); }, handleAnyError)];
            case 37:
                _a.sent();
                return [4 /*yield*/, async_test("disable setting, dontMatchEnduser ticket", function () { return sdkNonAdmin.api.tickets.getOne(dontMatchTicket.id); }, handleAnyError)];
            case 38:
                _a.sent();
                return [4 /*yield*/, async_test("tickets filter enduser valid", function () { return sdkNonAdmin.api.tickets.getSome({ filter: { enduserId: matchEnduser.id } }); }, {
                        onResult: function (r) { return r.length === 0; }
                    })];
            case 39:
                _a.sent();
                return [4 /*yield*/, async_test("tickets filter enduser invalid", function () { return sdkNonAdmin.api.tickets.getSome({ filter: { enduserId: dontMatchEnduser.id } }); }, {
                        onResult: function (r) { return r.length === 0; }
                    })
                    // enabled setting AND tags (keeps tags enabled)
                ];
            case 40:
                _a.sent();
                // enabled setting AND tags (keeps tags enabled)
                return [4 /*yield*/, sdk.api.organizations.updateOne(sdkNonAdmin.userInfo.businessId, {
                        settings: { endusers: { enableAccessTags: true } }
                    })];
            case 41:
                // enabled setting AND tags (keeps tags enabled)
                _a.sent();
                return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)]; // ensure enableAccessTags setting stored correctly on jwt
            case 42:
                _a.sent(); // ensure enableAccessTags setting stored correctly on jwt
                return [4 /*yield*/, async_test("Access by tag with setting works", sdkNonAdmin.api.endusers.getSome, {
                        onResult: function (r) { return r.length === 2 && !r.find(function (e) { return e.id === dontMatchEnduser.id; }); }
                    })];
            case 43:
                _a.sent();
                return [4 /*yield*/, async_test("access matchEnduser", function () { return sdkNonAdmin.api.endusers.getOne(matchEnduser.id); }, passOnAnyResult)];
            case 44:
                _a.sent();
                return [4 /*yield*/, async_test("access dontMatchEnduser bad", function () { return sdkNonAdmin.api.endusers.getOne(dontMatchEnduser.id); }, handleAnyError)];
            case 45:
                _a.sent();
                return [4 /*yield*/, async_test("access setting, tickets", sdkNonAdmin.api.tickets.getSome, {
                        onResult: function (r) { return r.length === 1 && !r.find(function (t) { return t.id === dontMatchTicket.id; }); }
                    })];
            case 46:
                _a.sent();
                return [4 /*yield*/, async_test("access setting tickets search", function () { return sdkNonAdmin.api.tickets.getSome({ search: { query: ticketTitle } }); }, { onResult: function (r) { return r.length === 1; } })];
            case 47:
                _a.sent();
                return [4 /*yield*/, async_test("access, matchEnduser ticket", function () { return sdkNonAdmin.api.tickets.getOne(matchTicket.id); }, passOnAnyResult)];
            case 48:
                _a.sent();
                return [4 /*yield*/, async_test("access, dontMatchEnduser ticket", function () { return sdkNonAdmin.api.tickets.getOne(dontMatchTicket.id); }, handleAnyError)];
            case 49:
                _a.sent();
                return [4 /*yield*/, async_test("tickets filter enduser valid", function () { return sdkNonAdmin.api.tickets.getSome({ filter: { enduserId: matchEnduser.id } }); }, {
                        onResult: function (r) { return r.length === 1; }
                    })];
            case 50:
                _a.sent();
                return [4 /*yield*/, async_test("tickets filter enduser invalid", function () { return sdkNonAdmin.api.tickets.getSome({ filter: { enduserId: dontMatchEnduser.id } }); }, {
                        onResult: function (r) { return r.length === 0; }
                    })];
            case 51:
                _a.sent();
                return [4 /*yield*/, async_test("Non-admin can't update tags", function () { return sdkNonAdmin.api.users.updateOne(sdkNonAdmin.userInfo.id, { tags: ['new tag'] }); }, handleAnyError)];
            case 52:
                _a.sent();
                return [4 /*yield*/, async_test("Non-admin can't update tags (with other updates)", function () { return sdkNonAdmin.api.users.updateOne(sdkNonAdmin.userInfo.id, { tags: ['new tag'], bio: '' }); }, handleAnyError)];
            case 53:
                _a.sent();
                return [4 /*yield*/, async_test("Non-admin can update other fields", function () { return sdkNonAdmin.api.users.updateOne(sdkNonAdmin.userInfo.id, { bio: '' }); }, passOnAnyResult)
                    // cleanup
                ];
            case 54:
                _a.sent();
                // cleanup
                return [4 /*yield*/, sdk.api.organizations.updateOne(sdkNonAdmin.userInfo.businessId, {
                        settings: { endusers: { enableAccessTags: false } }
                    })];
            case 55:
                // cleanup
                _a.sent();
                return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { tags: [] }, { replaceObjectFields: true })];
            case 56:
                _a.sent();
                return [4 /*yield*/, sdkNonAdmin.refresh_session()];
            case 57:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(matchEnduser.id),
                        sdk.api.endusers.deleteOne(matchMultiTagEnduser.id),
                        sdk.api.endusers.deleteOne(dontMatchEnduser.id),
                    ])];
            case 58:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var unique_strings_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("unique_strings test");
                return [4 /*yield*/, sdk.api.endusers.createOne({ assignedTo: ['1', '2', '2', '1', '3'], tags: ['1', '2', '2', '1', '3'] })];
            case 1:
                e = _a.sent();
                return [4 /*yield*/, async_test("Duplicate care team assignments are prevented", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a, _b;
                            return ((_a = e.assignedTo) === null || _a === void 0 ? void 0 : _a.length) === 3 && e.assignedTo.includes('1') && e.assignedTo.includes('2') && e.assignedTo.includes('3')
                                && ((_b = e.tags) === null || _b === void 0 ? void 0 : _b.length) === 3 && e.tags.includes('1') && e.tags.includes('2') && e.tags.includes('3');
                        }
                    })
                    // attempt to push duplicates of each
                ];
            case 2:
                _a.sent();
                // attempt to push duplicates of each
                return [4 /*yield*/, sdk.api.endusers.updateOne(e.id, { assignedTo: ['1', '2', '3'], tags: ['1', '2', '3'] }, { replaceObjectFields: false })];
            case 3:
                // attempt to push duplicates of each
                _a.sent();
                return [4 /*yield*/, async_test("Duplicate care team assignments are prevented (update)", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) {
                            var _a, _b;
                            return ((_a = e.assignedTo) === null || _a === void 0 ? void 0 : _a.length) === 3 && e.assignedTo.includes('1') && e.assignedTo.includes('2') && e.assignedTo.includes('3')
                                && ((_b = e.tags) === null || _b === void 0 ? void 0 : _b.length) === 3 && e.tags.includes('1') && e.tags.includes('2') && e.tags.includes('3');
                        }
                    })
                    // validate setting empty is allowed
                ];
            case 4:
                _a.sent();
                // validate setting empty is allowed
                return [4 /*yield*/, async_test("Setting empty is still allowed", function () { return sdk.api.endusers.updateOne(e.id, { assignedTo: [] }, { replaceObjectFields: true }); }, passOnAnyResult)];
            case 5:
                // validate setting empty is allowed
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(e.id),
                    ])];
            case 6: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var marketing_email_unsubscribe_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("marketing_email_unsubscribe_tests");
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'test@tellescope.com' })];
            case 1:
                e = _a.sent();
                return [4 /*yield*/, async_test("Non-marketing email good", function () { return sdk.api.emails.createOne({ logOnly: true, subject: '', enduserId: e.id, textContent: '', HTMLContent: '' }); }, passOnAnyResult)];
            case 2:
                _a.sent();
                return [4 /*yield*/, async_test("Marketing email good when subscribed", function () { return sdk.api.emails.createOne({ logOnly: true, isMarketing: true, subject: '', enduserId: e.id, textContent: '', HTMLContent: '' }); }, passOnAnyResult)
                    // attempt to push duplicates of each
                ];
            case 3:
                _a.sent();
                // attempt to push duplicates of each
                return [4 /*yield*/, sdk.GET('/v1/unsubscribe', { enduserId: e.id })];
            case 4:
                // attempt to push duplicates of each
                _a.sent();
                return [4 /*yield*/, async_test("GET /v1/unsubscribe works", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) { return e.unsubscribedFromMarketing === true; } })];
            case 5:
                _a.sent();
                return [4 /*yield*/, async_test("Non-marketing email good", function () { return sdk.api.emails.createOne({ logOnly: true, subject: '', enduserId: e.id, textContent: '', HTMLContent: '' }); }, passOnAnyResult)];
            case 6:
                _a.sent();
                return [4 /*yield*/, async_test("Marketing email bad when unsubscribed", function () { return sdk.api.emails.createOne({ logOnly: true, isMarketing: true, subject: '', enduserId: e.id, textContent: '', HTMLContent: '' }); }, handleAnyError)];
            case 7:
                _a.sent();
                return [4 /*yield*/, async_test("Marketing email bad when unsubscribed (bulk)", function () { return sdk.api.emails.createSome([{ logOnly: true, isMarketing: true, subject: '', enduserId: e.id, textContent: '', HTMLContent: '' }]); }, handleAnyError)];
            case 8:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(e.id),
                    ])];
            case 9: return [2 /*return*/, _a.sent()];
        }
    });
}); };
export var form_conditional_logic_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var responses, i, run_conditional_form_test;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        log_header("Form Conditional Logic Tests");
        responses = [
            {
                fieldId: "0",
                answer: { type: 'string', value: 'hello' },
                fieldTitle: '',
            },
            {
                fieldId: "0list",
                answer: { type: 'multiple_choice', value: ['hello'] },
                fieldTitle: '',
            },
            {
                fieldId: "1",
                answer: { type: 'string', value: '' },
                fieldTitle: '',
            },
            {
                fieldId: "2",
                answer: { type: 'multiple_choice', value: [''] },
                fieldTitle: '',
            },
            {
                fieldId: "3",
                answer: { type: 'number', value: 73 },
                fieldTitle: '',
                computedValueKey: 'Height',
            },
            {
                fieldId: "4",
                answer: { type: 'number', value: 190 },
                fieldTitle: '',
                computedValueKey: 'Weight',
            },
        ];
        i = 0;
        run_conditional_form_test = function (conditions, expected, title) {
            if (title === void 0) { title = "Test ".concat(++i); }
            assert(responses_satisfy_conditions(responses, conditions) === expected, "Failed condition:\n".concat(JSON.stringify(conditions, null, 2)), title);
        };
        run_conditional_form_test({ $and: [{ condition: { '0': { $contains: 'hel' } } }] }, true);
        run_conditional_form_test({ $and: [{ condition: { '0': { $contains: 'hello' } } }] }, true);
        run_conditional_form_test({ $and: [{ condition: { '0': { $contains: 'hllo' } } }] }, false);
        run_conditional_form_test({ $and: [{ condition: { '0list': { $contains: 'hel' } } }] }, true);
        run_conditional_form_test({ $and: [{ condition: { '0list': { $contains: 'hello' } } }] }, true);
        run_conditional_form_test({ $and: [{ condition: { '0list': { $contains: 'hllo' } } }] }, false);
        run_conditional_form_test({ $and: [{ condition: { '1': '' } }] }, true);
        run_conditional_form_test({ $and: [{ condition: { '1': { $exists: true } } }] }, false);
        run_conditional_form_test({ $and: [{ condition: { '1': { $exists: false } } }] }, true);
        run_conditional_form_test({ $and: [{ condition: { '2': '' } }] }, true);
        run_conditional_form_test({ $and: [{ condition: { '2': { $exists: true } } }] }, true);
        run_conditional_form_test({ $and: [{ condition: { '2': { $exists: false } } }] }, false);
        run_conditional_form_test({ $and: [{ condition: { '3': { $gt: 72 } } }] }, true);
        run_conditional_form_test({ $and: [{ condition: { '3': { $gt: 73 } } }] }, false);
        run_conditional_form_test({ $and: [{ condition: { '3': { $gt: 74 } } }] }, false);
        run_conditional_form_test({ $and: [{ condition: { '3': { $lt: 72 } } }] }, false);
        run_conditional_form_test({ $and: [{ condition: { '3': { $lt: 73 } } }] }, false);
        run_conditional_form_test({ $and: [{ condition: { '3': { $lt: 74 } } }] }, true);
        run_conditional_form_test({ $and: [{ condition: (_a = {}, _a[FORM_LOGIC_CALCULATED_FIELDS[0]] = { $exists: true }, _a) }] }, true);
        run_conditional_form_test({ $and: [{ condition: (_b = {}, _b[FORM_LOGIC_CALCULATED_FIELDS[0]] = { $gt: 25 }, _b) }] }, true);
        run_conditional_form_test({ $and: [{ condition: (_c = {}, _c[FORM_LOGIC_CALCULATED_FIELDS[0]] = { $lt: 25 }, _c) }] }, false);
        return [2 /*return*/];
    });
}); };
export var ticket_reminder_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var toDelete, dueDateInMS, title, LEEWAY, withLeeway, tToUpdate, tToRemind;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Ticket Reminder Tests");
                toDelete = [];
                dueDateInMS = Date.now() + 1000 * 60 * 60 * 24;
                title = 't';
                LEEWAY = 200;
                withLeeway = function (source, target) { return (source !== undefined && ((source - LEEWAY) < target || (source + LEEWAY) > target)); };
                return [4 /*yield*/, async_test("No reminders", function () { return sdk.api.tickets.createOne({ title: title }); }, { onResult: function (t) { toDelete.push(t); return t.nextReminderInMS === -1; } })];
            case 1:
                _a.sent();
                return [4 /*yield*/, async_test("Empty reminders", function () { return sdk.api.tickets.createOne({ title: title, reminders: [] }); }, { onResult: function (t) { toDelete.push(t); return t.nextReminderInMS === -1; } })];
            case 2:
                _a.sent();
                return [4 /*yield*/, async_test("No due date", function () { return sdk.api.tickets.createOne({ title: title, reminders: [{ msBeforeDueDate: 0, didRemind: true }] }); }, { onResult: function (t) { toDelete.push(t); return t.nextReminderInMS === -1; } })];
            case 3:
                _a.sent();
                return [4 /*yield*/, async_test("One reminder", function () { return sdk.api.tickets.createOne({ title: title, dueDateInMS: dueDateInMS, reminders: [{ msBeforeDueDate: 0, didRemind: true }] }); }, { onResult: function (t) { toDelete.push(t); return withLeeway(t.dueDateInMS, dueDateInMS - Date.now()); } })];
            case 4:
                _a.sent();
                return [4 /*yield*/, sdk.api.tickets.createOne({ title: title, reminders: [{ msBeforeDueDate: 0, didRemind: true }] })];
            case 5:
                tToUpdate = _a.sent();
                toDelete.push(tToUpdate);
                assert(tToUpdate.nextReminderInMS === -1, 'bad cache', 'update ticket starts with no nextReminderInMS');
                return [4 /*yield*/, sdk.api.tickets.updateOne(tToUpdate.id, { dueDateInMS: dueDateInMS })];
            case 6:
                _a.sent();
                return [4 /*yield*/, async_test("Setting due date sets nextReminderInMS", function () { return pollForResults(function () { return sdk.api.tickets.getOne(tToUpdate.id); }, function (t) { return withLeeway(t.dueDateInMS, dueDateInMS - Date.now()); }, 25, 10); }, passOnAnyResult)];
            case 7:
                _a.sent();
                return [4 /*yield*/, sdk.api.tickets.updateOne(tToUpdate.id, { dueDateInMS: '' })];
            case 8:
                _a.sent();
                return [4 /*yield*/, async_test("Unsetting due date sets nextReminderInMS", function () { return pollForResults(function () { return sdk.api.tickets.getOne(tToUpdate.id); }, function (t) { return t.nextReminderInMS === -1; }, 25, 10); }, passOnAnyResult)];
            case 9:
                _a.sent();
                return [4 /*yield*/, sdk.api.tickets.updateOne(tToUpdate.id, { dueDateInMS: dueDateInMS, reminders: [
                            { msBeforeDueDate: 0 },
                            { msBeforeDueDate: 1000 },
                            { msBeforeDueDate: 7000 },
                            { msBeforeDueDate: 5000 },
                            { msBeforeDueDate: 9000, didRemind: false },
                        ] })];
            case 10:
                _a.sent();
                return [4 /*yield*/, async_test("Correct reminder picked when multiple due date sets nextReminderInMS", function () { return pollForResults(function () { return sdk.api.tickets.getOne(tToUpdate.id); }, function (t) { return withLeeway(t.dueDateInMS, dueDateInMS - Date.now() - 7000); }, 25, 10); }, passOnAnyResult)
                    // test actual reminders without setting owner to avoid email notifications
                ];
            case 11:
                _a.sent();
                return [4 /*yield*/, sdk.api.tickets.createOne({
                        title: title,
                        dueDateInMS: Date.now(),
                        reminders: [
                            { msBeforeDueDate: 0 },
                            { msBeforeDueDate: -8000 }, // should then remind after
                        ]
                    })];
            case 12:
                tToRemind = _a.sent();
                toDelete.push(tToRemind);
                return [4 /*yield*/, async_test("Reminder processed right away", function () { return pollForResults(function () { return sdk.api.tickets.getOne(tToRemind.id); }, function (t) {
                        var _a, _b, _c, _d;
                        return (((_b = (_a = t.reminders) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.didRemind) === true
                            && t.nextReminderInMS !== -1
                            && ((_d = (_c = t.reminders) === null || _c === void 0 ? void 0 : _c.filter(function (r) { return r.didRemind; })) === null || _d === void 0 ? void 0 : _d.length) === 1);
                    }, 100, 100); }, passOnAnyResult)];
            case 13:
                _a.sent();
                return [4 /*yield*/, async_test("Delayed reminder not processed yet", function () { return sdk.api.tickets.getOne(tToRemind.id); }, {
                        onResult: (function (t) {
                            var _a, _b, _c, _d;
                            return (((_b = (_a = t.reminders) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.didRemind) === true
                                && t.nextReminderInMS !== -1
                                && ((_d = (_c = t.reminders) === null || _c === void 0 ? void 0 : _c.filter(function (r) { return r.didRemind; })) === null || _d === void 0 ? void 0 : _d.length) === 1);
                        })
                    })];
            case 14:
                _a.sent();
                return [4 /*yield*/, async_test("Reminder processed after delay", function () { return pollForResults(function () { return sdk.api.tickets.getOne(tToRemind.id); }, function (t) {
                        var _a, _b, _c, _d, _f;
                        return (((_b = (_a = t.reminders) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.didRemind) === true
                            && t.nextReminderInMS === -1
                            && ((_d = (_c = t.reminders) === null || _c === void 0 ? void 0 : _c[1]) === null || _d === void 0 ? void 0 : _d.didRemind) === true
                            && ((_f = t.reminders) === null || _f === void 0 ? void 0 : _f.length) === 2);
                    }, 100, 100); }, passOnAnyResult)
                    // cleanup
                ];
            case 15:
                _a.sent();
                // cleanup
                return [4 /*yield*/, Promise.all(toDelete.map(function (t) { return sdk.api.tickets.deleteOne(t.id); }))];
            case 16:
                // cleanup
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var bulk_read_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var numEndusers, endusers, _i, endusers_1, e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Bulk Read (ID-lookup) Tests");
                numEndusers = 101;
                return [4 /*yield*/, sdk.api.endusers.createSome(Array.from(Array(numEndusers).keys()).map(function () { return 0; }).map(function () { return ({}); }))];
            case 1:
                endusers = (_a.sent()).created;
                return [4 /*yield*/, async_test("bulk id lookup isn't limited to 100 (default for backend)", function () { return sdk.api.endusers.getByIds({ ids: endusers.map(function (e) { return e.id; }) }); }, { onResult: function (result) { return (result.matches.length === numEndusers
                            && result.matches.filter(function (e) { return endusers.find(function (_e) { return _e.id === e.id; }); }).length === result.matches.length); } })];
            case 2:
                _a.sent();
                return [4 /*yield*/, async_test("bulk id lookup limited to 1000 (success)", function () { return sdk.api.endusers.getByIds({ ids: Array.from(Array(1000).keys()).map(function () { return endusers[0].id; }) }); }, passOnAnyResult)];
            case 3:
                _a.sent();
                return [4 /*yield*/, async_test("bulk id lookup limited to 1000", function () { return sdk.api.endusers.getByIds({ ids: Array.from(Array(1001).keys()).map(function () { return endusers[0].id; }) }); }, {
                        shouldError: true,
                        onError: function (e) { return e.message === 'Error parsing field ids: Arrays should not contain more than 1000 elements'; }
                    })
                    // cleanup
                ];
            case 4:
                _a.sent();
                _i = 0, endusers_1 = endusers;
                _a.label = 5;
            case 5:
                if (!(_i < endusers_1.length)) return [3 /*break*/, 8];
                e = endusers_1[_i];
                return [4 /*yield*/, sdk.api.endusers.deleteOne(e.id)];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 5];
            case 8: return [2 /*return*/];
        }
    });
}); };
var test_send_with_template = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, enduser, template;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                log_header("test_send_with_template");
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.createOne({ email: 'sebass192@gmail.com' }),
                        sdk.api.templates.createOne({ message: 'Text Message', subject: "test_send_with_template", title: 'test_send_with_template', html: "HTML Message" }),
                    ])];
            case 1:
                _a = _b.sent(), enduser = _a[0], template = _a[1];
                return [4 /*yield*/, async_test("send with template", function () { return sdk.api.emails.send_with_template({
                        enduserId: enduser.id, templateId: template.id, senderId: sdk.userInfo.id,
                    }); }, { onResult: function (_a) {
                            var email = _a.email;
                            return !!email.id && email.enduserId === enduser.id && email.templateId === template.id;
                        } })];
            case 2:
                _b.sent();
                return [4 /*yield*/, wait(undefined, 3000)];
            case 3:
                _b.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(enduser.id),
                        sdk.api.templates.deleteOne(template.id),
                    ])];
            case 4:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
var delete_user_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var existing, u, authToken, createdUserSDK, enduser, enduserAuthToken, enduserSDK;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                log_header("Delete user tests");
                return [4 /*yield*/, sdk.api.users.getSome({ filter: { email: 'deleteme@tellescope.com' } })];
            case 1:
                existing = _b.sent();
                if (!(((_a = existing[0]) === null || _a === void 0 ? void 0 : _a.email) === 'deleteme@tellescope.com')) return [3 /*break*/, 3];
                return [4 /*yield*/, sdk.api.users.deleteOne(existing[0].id)];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3: return [4 /*yield*/, sdk.api.users.createOne({ email: 'deleteme@tellescope.com', verifiedEmail: true })];
            case 4:
                u = _b.sent();
                return [4 /*yield*/, sdk.api.users.generate_auth_token({ id: u.id })];
            case 5:
                authToken = (_b.sent()).authToken;
                createdUserSDK = new Session({ host: host, authToken: authToken });
                return [4 /*yield*/, async_test("Authenticated", createdUserSDK.test_authenticated, passOnAnyResult)];
            case 6:
                _b.sent();
                return [4 /*yield*/, sdk.api.users.deleteOne(u.id)];
            case 7:
                _b.sent();
                return [4 /*yield*/, wait(undefined, 250)];
            case 8:
                _b.sent();
                return [4 /*yield*/, async_test("De-authenticated after deletion", createdUserSDK.test_authenticated, handleAnyError)];
            case 9:
                _b.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 10:
                enduser = _b.sent();
                return [4 /*yield*/, sdk.api.endusers.generate_auth_token({ id: enduser.id })];
            case 11:
                enduserAuthToken = (_b.sent()).authToken;
                enduserSDK = new EnduserSession({ host: host, businessId: businessId, authToken: enduserAuthToken });
                return [4 /*yield*/, async_test("Enduser Authenticated", function () { return enduserSDK.api.endusers.getSome(); }, passOnAnyResult)];
            case 12:
                _b.sent();
                return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id)];
            case 13:
                _b.sent();
                return [4 /*yield*/, wait(undefined, 250)];
            case 14:
                _b.sent();
                return [4 /*yield*/, async_test("Enduser De-authenticated after deletion", function () { return enduserSDK.api.endusers.getSome(); }, handleAnyError)];
            case 15:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
var sdkMfaApiKeyUserId = '6525a43e1e75f0350d62afc4';
var lockout_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var nonAdminId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Lockout tests");
                return [4 /*yield*/, async_test("API Key is authenticated", sdkMfaApiKey.test_authenticated, passOnAnyResult)];
            case 1:
                _a.sent();
                return [4 /*yield*/, async_test("API Key lock to future date", function () { return sdk.api.users.updateOne(sdkMfaApiKeyUserId, { lockedOutUntil: 0 }); }, passOnAnyResult)];
            case 2:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 250)];
            case 3:
                _a.sent();
                return [4 /*yield*/, async_test("API Key is de-authenticated when locked", sdkMfaApiKey.test_authenticated, handleAnyError)];
            case 4:
                _a.sent();
                return [4 /*yield*/, async_test("API Key unlock to -1", function () { return sdk.api.users.updateOne(sdkMfaApiKeyUserId, { lockedOutUntil: -1 }); }, passOnAnyResult)];
            case 5:
                _a.sent();
                return [4 /*yield*/, async_test("API Key is authenticated", sdkMfaApiKey.test_authenticated, passOnAnyResult)];
            case 6:
                _a.sent();
                nonAdminId = sdkNonAdmin.userInfo.id;
                return [4 /*yield*/, async_test("users cannot update own lock status", function () { return sdk.api.users.updateOne(sdk.userInfo.id, { lockedOutUntil: -1 }); }, handleAnyError)];
            case 7:
                _a.sent();
                return [4 /*yield*/, async_test("non-admin can't lock out others", function () { return sdkNonAdmin.api.users.updateOne(sdk.userInfo.id, { lockedOutUntil: Date.now() }); }, handleAnyError)];
            case 8:
                _a.sent();
                return [4 /*yield*/, async_test("non-admin is authenticated", sdkNonAdmin.test_authenticated, passOnAnyResult)];
            case 9:
                _a.sent();
                return [4 /*yield*/, async_test("admin unlock to -1", function () { return sdk.api.users.updateOne(nonAdminId, { lockedOutUntil: -1 }); }, passOnAnyResult)];
            case 10:
                _a.sent();
                return [4 /*yield*/, async_test("non-admin is authenticated (-1)", sdkNonAdmin.test_authenticated, passOnAnyResult)];
            case 11:
                _a.sent();
                return [4 /*yield*/, async_test("admin lock to past date", function () { return sdk.api.users.updateOne(nonAdminId, { lockedOutUntil: Date.now() - 1000 }); }, passOnAnyResult)];
            case 12:
                _a.sent();
                return [4 /*yield*/, async_test("non-admin is authenticated (past date)", sdkNonAdmin.test_authenticated, passOnAnyResult)];
            case 13:
                _a.sent();
                return [4 /*yield*/, async_test("admin lock to 0 (indefinite)", function () { return sdk.api.users.updateOne(nonAdminId, { lockedOutUntil: 0 }); }, passOnAnyResult)];
            case 14:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 250)];
            case 15:
                _a.sent();
                return [4 /*yield*/, async_test("non-admin is de-authenticated when locked to 0", sdkNonAdmin.test_authenticated, handleAnyError)];
            case 16:
                _a.sent();
                return [4 /*yield*/, async_test("non-admin can't authenciate when locked to 0", function () { return sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword); }, handleAnyError)];
            case 17:
                _a.sent();
                return [4 /*yield*/, async_test("admin unlock to -1", function () { return sdk.api.users.updateOne(nonAdminId, { lockedOutUntil: -1 }); }, passOnAnyResult)];
            case 18:
                _a.sent();
                return [4 /*yield*/, async_test("non-admin can re authenciate when locked to 0", function () { return sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword); }, passOnAnyResult)];
            case 19:
                _a.sent();
                return [4 /*yield*/, async_test("non-admin is authenticated", sdkNonAdmin.test_authenticated, passOnAnyResult)];
            case 20:
                _a.sent();
                return [4 /*yield*/, async_test("admin lock to future date", function () { return sdk.api.users.updateOne(nonAdminId, { lockedOutUntil: Date.now() + 10000 }); }, passOnAnyResult)];
            case 21:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 250)];
            case 22:
                _a.sent();
                return [4 /*yield*/, async_test("non-admin is de-authenticated when locked to future date", sdkNonAdmin.test_authenticated, handleAnyError)];
            case 23:
                _a.sent();
                return [4 /*yield*/, async_test("non-admin can't authenciate when locked to future date", function () { return sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword); }, handleAnyError)];
            case 24:
                _a.sent();
                return [4 /*yield*/, async_test("admin unlock to -1", function () { return sdk.api.users.updateOne(nonAdminId, { lockedOutUntil: -1 }); }, passOnAnyResult)];
            case 25:
                _a.sent();
                return [4 /*yield*/, async_test("non-admin can re authenciate when locked to future date", function () { return sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword); }, passOnAnyResult)];
            case 26:
                _a.sent();
                return [4 /*yield*/, async_test("non-admin is authenticated", sdkNonAdmin.test_authenticated, passOnAnyResult)];
            case 27:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var sync_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var from, e, t, e2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Data Sync");
                from = new Date();
                return [4 /*yield*/, async_test("No new records, admin", function () { return sdk.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.length === 0;
                        } })];
            case 1:
                _a.sent();
                return [4 /*yield*/, async_test("No new records, non-admin", function () { return sdkNonAdmin.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.length === 0;
                        } })];
            case 2:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 3:
                e = _a.sent();
                return [4 /*yield*/, wait(undefined, 100)];
            case 4:
                _a.sent();
                return [4 /*yield*/, async_test("Enduser create, admin", function () { return sdk.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return (results.length === 1
                                && results[0].modelName === 'endusers'
                                && results[0].recordId === e.id
                                && results[0].data.includes(e.id)
                                && JSON.parse(results[0].data) // tests no error throwing
                            );
                        } })];
            case 5:
                _a.sent();
                return [4 /*yield*/, async_test("Enduser create, non-admin", function () { return sdkNonAdmin.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.length === 0;
                        } })];
            case 6:
                _a.sent();
                return [4 /*yield*/, async_test("Enduser create, sub organization", function () { return sdkSub.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.length === 0;
                        } })];
            case 7:
                _a.sent();
                return [4 /*yield*/, async_test("Other organization", function () { return sdkOther.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.filter(function (e) { return e.modelName === 'endusers' && e.data !== 'deleted'; }).length === 0;
                        } })];
            case 8:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.updateOne(e.id, { fname: "UPDATE_TEST" })];
            case 9:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 100)];
            case 10:
                _a.sent();
                return [4 /*yield*/, async_test("Enduser update, admin", function () { return sdk.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return (results.length === 1
                                && results[0].modelName === 'endusers'
                                && results[0].recordId === e.id
                                && results[0].data.includes("UPDATE_TEST"));
                        } })];
            case 11:
                _a.sent();
                return [4 /*yield*/, async_test("Enduser update, non-admin", function () { return sdkNonAdmin.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.length === 0;
                        } })];
            case 12:
                _a.sent();
                return [4 /*yield*/, async_test("Enduser update, sub organization", function () { return sdkSub.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.length === 0;
                        } })];
            case 13:
                _a.sent();
                return [4 /*yield*/, async_test("Other organization", function () { return sdkOther.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.filter(function (e) { return e.modelName === 'endusers' && e.data !== 'deleted'; }).length === 0;
                        } })];
            case 14:
                _a.sent();
                return [4 /*yield*/, sdk.api.tickets.createOne({ title: 'access test' })];
            case 15:
                t = _a.sent();
                return [4 /*yield*/, wait(undefined, 100)];
            case 16:
                _a.sent();
                return [4 /*yield*/, async_test("Non-admin can't access ticket", function () { return sdkNonAdmin.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.length === 0;
                        } })
                    // creates a user notification which increments count/index
                ];
            case 17:
                _a.sent();
                // creates a user notification which increments count/index
                sdk.api.tickets.updateOne(t.id, { owner: sdkNonAdmin.userInfo.id });
                return [4 /*yield*/, wait(undefined, 100)];
            case 18:
                _a.sent();
                return [4 /*yield*/, async_test("Non-admin can access tickets on assignment", function () { return sdkNonAdmin.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.length === 2;
                        } })];
            case 19:
                _a.sent();
                return [4 /*yield*/, async_test("Sub organization still 0", function () { return sdkSub.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.length === 0;
                        } })];
            case 20:
                _a.sent();
                return [4 /*yield*/, async_test("Other organization still 0", function () { return sdkOther.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.filter(function (e) { return e.modelName === 'endusers' && e.data !== 'deleted'; }).length === 0;
                        } })];
            case 21:
                _a.sent();
                sdk.api.tickets.updateOne(t.id, { owner: '' });
                return [4 /*yield*/, wait(undefined, 100)];
            case 22:
                _a.sent();
                return [4 /*yield*/, async_test("Non-admin can't access tickets on unassignment", function () { return sdkNonAdmin.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.length === 1;
                        } })];
            case 23:
                _a.sent();
                return [4 /*yield*/, async_test("Sub organization still 0", function () { return sdkSub.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.length === 0;
                        } })];
            case 24:
                _a.sent();
                return [4 /*yield*/, async_test("Other organization still 0", function () { return sdkOther.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.filter(function (e) { return e.modelName === 'endusers' && e.data !== 'deleted'; }).length === 0;
                        } })];
            case 25:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.updateOne(e.id, { assignedTo: [sdkNonAdmin.userInfo.id] }, { replaceObjectFields: true })];
            case 26:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 100)];
            case 27:
                _a.sent();
                return [4 /*yield*/, async_test("Enduser update non-admin assignment, can access", function () { return sdkNonAdmin.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.length === 2;
                        } })];
            case 28:
                _a.sent();
                return [4 /*yield*/, async_test("Sub organization still 0", function () { return sdkSub.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.length === 0;
                        } })];
            case 29:
                _a.sent();
                return [4 /*yield*/, async_test("Other organization still 0", function () { return sdkOther.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.filter(function (e) { return e.modelName === 'endusers' && e.data !== 'deleted'; }).length === 0;
                        } })];
            case 30:
                _a.sent();
                sdk.api.tickets.updateOne(t.id, { owner: '', enduserId: e.id });
                return [4 /*yield*/, wait(undefined, 100)];
            case 31:
                _a.sent();
                return [4 /*yield*/, async_test("Non-admin can access ticket (and enduser) after enduser assignment", function () { return sdkNonAdmin.sync({ from: from }); }, {
                        onResult: function (_a) {
                            var results = _a.results;
                            return (results.length === 3
                                && results.filter(function (r) { return r.modelName === 'tickets' && r.recordId === t.id; }).length === 1
                                && results.filter(function (r) { return r.modelName === 'endusers' && r.recordId === e.id; }).length === 1);
                        }
                    })];
            case 32:
                _a.sent();
                return [4 /*yield*/, async_test("Sub organization still 0", function () { return sdkSub.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.length === 0;
                        } })];
            case 33:
                _a.sent();
                return [4 /*yield*/, async_test("Other organization still 0", function () { return sdkOther.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.filter(function (e) { return e.modelName === 'endusers' && e.data !== 'deleted'; }).length === 0;
                        } })];
            case 34:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.updateOne(e.id, { assignedTo: [] }, { replaceObjectFields: true })];
            case 35:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 100)];
            case 36:
                _a.sent();
                return [4 /*yield*/, async_test("Enduser update non-admin assignment, revoked access to enduser and ticket", function () { return sdkNonAdmin.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            // still has user notification
                            return results.length === 1 &&
                                results.filter(function (r) { return r.modelName === 'user_notifications'; }).length === 1;
                        }
                    })];
            case 37:
                _a.sent();
                return [4 /*yield*/, async_test("Sub organization still 0", function () { return sdkSub.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.length === 0;
                        } })];
            case 38:
                _a.sent();
                return [4 /*yield*/, async_test("Other organization still 0", function () { return sdkOther.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.filter(function (e) { return e.modelName === 'endusers' && e.data !== 'deleted'; }).length === 0;
                        } })
                    // enduser, ticket, and ticket assignment user_notification created
                ];
            case 39:
                _a.sent();
                // enduser, ticket, and ticket assignment user_notification created
                return [4 /*yield*/, sdk.api.endusers.deleteOne(e.id)];
            case 40:
                // enduser, ticket, and ticket assignment user_notification created
                _a.sent();
                return [4 /*yield*/, wait(undefined, 100)];
            case 41:
                _a.sent();
                return [4 /*yield*/, async_test("Enduser delete, admin", function () { return sdk.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return (results.length === 3
                                && results[0].modelName === 'endusers'
                                && results[0].recordId === e.id
                                && results[0].data === 'deleted');
                        } })];
            case 42:
                _a.sent();
                return [4 /*yield*/, async_test("Enduser delete, non-admin", function () { return sdkNonAdmin.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            // still includes user notification
                            return results.length === 1
                                && results.filter(function (r) { return r.modelName === 'user_notifications'; }).length === 1;
                        }
                    })];
            case 43:
                _a.sent();
                return [4 /*yield*/, async_test("Enduser delete, sub organization", function () { return sdkSub.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.length === 0;
                        } })];
            case 44:
                _a.sent();
                return [4 /*yield*/, async_test("Other organization", function () { return sdkOther.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.filter(function (e) { return e.modelName === 'endusers' && e.data !== 'deleted'; }).length === 0;
                        } })
                    // bulk create test coverage
                ];
            case 45:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createSome([{}])];
            case 46:
                e2 = (_a.sent()).created[0];
                return [4 /*yield*/, wait(undefined, 100)];
            case 47:
                _a.sent();
                return [4 /*yield*/, async_test("Bulk Enduser create, admin", function () { return sdk.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return (results.length === 4
                                && results[0].modelName === 'endusers'
                                && results[0].recordId === e2.id
                                && results[0].data.includes(e2.id)
                                && JSON.parse(results[0].data) // tests no error throwing
                            );
                        } })];
            case 48:
                _a.sent();
                return [4 /*yield*/, async_test("Bulk Enduser create, non-admin", function () { return sdkNonAdmin.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.length === 1;
                        } })];
            case 49:
                _a.sent();
                return [4 /*yield*/, async_test("Bulk Enduser create, sub organization", function () { return sdkSub.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.length === 0;
                        } })];
            case 50:
                _a.sent();
                return [4 /*yield*/, async_test("Other organization", function () { return sdkOther.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.filter(function (e) { return e.modelName === 'endusers' && e.data !== 'deleted'; }).length === 0;
                        } })];
            case 51:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.deleteOne(e2.id)];
            case 52:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 100)];
            case 53:
                _a.sent();
                return [4 /*yield*/, async_test("Bulk Enduser delete, admin", function () { return sdk.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return (results.length === 4
                                && results[0].modelName === 'endusers'
                                && results[0].recordId === e2.id
                                && results[0].data === 'deleted');
                        } })];
            case 54:
                _a.sent();
                return [4 /*yield*/, async_test("Bulk Enduser delete, non-admin", function () { return sdkNonAdmin.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            // still includes user notification
                            return results.length === 1
                                && results.filter(function (r) { return r.modelName === 'user_notifications'; }).length === 1;
                        }
                    })];
            case 55:
                _a.sent();
                return [4 /*yield*/, async_test("Bulk Enduser delete, sub organization", function () { return sdkSub.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.length === 0;
                        } })];
            case 56:
                _a.sent();
                return [4 /*yield*/, async_test("Other organization", function () { return sdkOther.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.filter(function (e) { return e.modelName === 'endusers' && e.data !== 'deleted'; }).length === 0;
                        } })];
            case 57:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var sync_tests_with_access_tags = function () { return __awaiter(void 0, void 0, void 0, function () {
    var matchTag, from, e, t;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Data Sync with Access Tags");
                matchTag = 'Access';
                return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { tags: [matchTag] }, { replaceObjectFields: true })];
            case 1:
                _a.sent();
                return [4 /*yield*/, sdk.api.organizations.updateOne(sdkNonAdmin.userInfo.businessId, {
                        settings: { endusers: { enableAccessTags: true } }
                    })];
            case 2:
                _a.sent();
                return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)]; // ensure enableAccessTags setting stored correctly on jwt
            case 3:
                _a.sent(); // ensure enableAccessTags setting stored correctly on jwt
                return [4 /*yield*/, wait(undefined, 1000)];
            case 4:
                _a.sent();
                from = new Date();
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 5:
                e = _a.sent();
                return [4 /*yield*/, sdk.api.tickets.createOne({ title: 'access test', enduserId: e.id })];
            case 6:
                t = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.updateOne(e.id, { accessTags: [matchTag] }, { replaceObjectFields: true })];
            case 7:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 100)];
            case 8:
                _a.sent();
                return [4 /*yield*/, async_test("Access tags non-admin assignment, granted access to enduser and ticket", function () { return sdkNonAdmin.sync({ from: from }); }, {
                        onResult: function (_a) {
                            var results = _a.results;
                            return (results.length === 2
                                && results.filter(function (r) { return r.modelName === 'tickets' && r.recordId === t.id; }).length === 1
                                && results.filter(function (r) { return r.modelName === 'endusers' && r.recordId === e.id; }).length === 1);
                        }
                    })];
            case 9:
                _a.sent();
                return [4 /*yield*/, async_test("Sub organization still 0", function () { return sdkSub.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.length === 0;
                        } })];
            case 10:
                _a.sent();
                return [4 /*yield*/, async_test("Other organization still 0", function () { return sdkOther.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.filter(function (e) { return e.modelName === 'endusers' && e.data !== 'deleted'; }).length === 0;
                        } })];
            case 11:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.updateOne(e.id, { accessTags: [] }, { replaceObjectFields: true })];
            case 12:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 100)];
            case 13:
                _a.sent();
                return [4 /*yield*/, async_test("Removed access tags non-admin, revoked access to enduser and ticket", function () { return sdkNonAdmin.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.length === 0;
                        } })];
            case 14:
                _a.sent();
                return [4 /*yield*/, async_test("Sub organization still 0", function () { return sdkSub.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.length === 0;
                        } })];
            case 15:
                _a.sent();
                return [4 /*yield*/, async_test("Other organization still 0", function () { return sdkOther.sync({ from: from }); }, { onResult: function (_a) {
                            var results = _a.results;
                            return results.filter(function (e) { return e.modelName === 'endusers' && e.data !== 'deleted'; }).length === 0;
                        } })];
            case 16:
                _a.sent();
                return [4 /*yield*/, sdk.api.organizations.updateOne(sdkNonAdmin.userInfo.businessId, {
                        settings: { endusers: { enableAccessTags: false } }
                    })];
            case 17:
                _a.sent();
                return [4 /*yield*/, sdk.api.users.updateOne(sdkNonAdmin.userInfo.id, { tags: [] }, { replaceObjectFields: true })];
            case 18:
                _a.sent();
                return [4 /*yield*/, sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword)]; // ensure enableAccessTags setting stored correctly on jwt 
            case 19:
                _a.sent(); // ensure enableAccessTags setting stored correctly on jwt 
                return [4 /*yield*/, sdk.api.endusers.deleteOne(e.id)];
            case 20:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 1000)]; // ensure delete does not appear in next sync, sdkNonAdmin connected
            case 21:
                _a.sent(); // ensure delete does not appear in next sync, sdkNonAdmin connected
                return [2 /*return*/];
        }
    });
}); };
// to cover potential vulernabilities with enduser public register endpoint
var register_as_enduser_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var enduser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Register as Enduser");
                return [4 /*yield*/, async_test("Enduser register", function () { return enduserSDK.register({ email: 'test@tellescope.com', password: 'testpassWord12345!' }); }, passOnAnyResult)];
            case 1:
                _a.sent();
                return [4 /*yield*/, async_test("Enduser register (rate limited)", function () { return enduserSDK.register({ email: 'test@tellescope.com', password: 'testpassWord12345!' }); }, { shouldError: true, onError: function (e) { return e.message === "Too many requests"; } })];
            case 2:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 1000)];
            case 3:
                _a.sent();
                return [4 /*yield*/, async_test("Enduser duplicate register (same response, no ability to enumerate contacts)", function () { return enduserSDK.register({ email: 'test@tellescope.com', password: 'testpassWord12345!' }); }, passOnAnyResult)];
            case 4:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne({ email: 'test@tellescope.com' })];
            case 5:
                enduser = _a.sent();
                if (!enduser) return [3 /*break*/, 7];
                return [4 /*yield*/, sdk.api.endusers.deleteOne(enduser.id)];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); };
var close_reasons_no_duplicates_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var tNone, tDuplicates, updated;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                log_header("Close reasons no duplicates");
                return [4 /*yield*/, sdk.api.tickets.createOne({ title: '1' })];
            case 1:
                tNone = _c.sent();
                return [4 /*yield*/, sdk.api.tickets.createOne({ title: '1', 'closeReasons': ["1", "2", "1"] })];
            case 2:
                tDuplicates = _c.sent();
                assert(((_a = tDuplicates.closeReasons) === null || _a === void 0 ? void 0 : _a.length) === 2, 'closeReasons not unique on create', 'closeReasons are unique on create');
                return [4 /*yield*/, sdk.api.tickets.updateOne(tDuplicates.id, { closeReasons: ['1', '2', '3'] })];
            case 3:
                updated = _c.sent();
                assert(((_b = updated.closeReasons) === null || _b === void 0 ? void 0 : _b.length) === 3, 'closeReasons not unique on update', 'closeReasons are unique on update');
                return [4 /*yield*/, async_test("Filters duplicates before validating length too long", function () { return sdk.api.tickets.updateOne(tDuplicates.id, {
                        closeReasons: '1,'.repeat(1500).split(','),
                    }); }, passOnAnyResult)];
            case 4:
                _c.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.tickets.deleteOne(tNone.id),
                        sdk.api.tickets.deleteOne(tDuplicates.id),
                    ])];
            case 5:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
var vital_trigger_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var runTriggerTest;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Vital Update Trigger");
                runTriggerTest = function (_a) {
                    var _configurations = _a.configurations, _triggers = _a.triggers, shouldTrigger = _a.shouldTrigger, otherEnduserShouldTrigger = _a.otherEnduserShouldTrigger, vitals = _a.vitals, title = _a.title, _enduserConfigurations = _a.enduserConfigurations;
                    return __awaiter(void 0, void 0, void 0, function () {
                        var e, e2, configurations, enduserConfigurations, _b, triggers;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, sdk.api.endusers.createOne({ weight: { unit: 'LB', value: 180 } })];
                                case 1:
                                    e = _c.sent();
                                    return [4 /*yield*/, sdk.api.endusers.createOne({ weight: { unit: 'LB', value: 180 } })];
                                case 2:
                                    e2 = _c.sent();
                                    return [4 /*yield*/, sdk.api.vital_configurations.createSome(_configurations.map(function (c, i) { return (__assign({ title: "configuration ".concat(i) }, c)); }))];
                                case 3:
                                    configurations = (_c.sent()).created;
                                    if (!(_enduserConfigurations === null || _enduserConfigurations === void 0 ? void 0 : _enduserConfigurations.length)) return [3 /*break*/, 5];
                                    return [4 /*yield*/, sdk.api.vital_configurations.createSome(_enduserConfigurations.map(function (c, i) { return (__assign({ title: "enduser configuration ".concat(i), enduserId: e.id, originalConfigurationId: configurations[i].id }, c)); }))];
                                case 4:
                                    _b = (_c.sent()).created;
                                    return [3 /*break*/, 6];
                                case 5:
                                    _b = [];
                                    _c.label = 6;
                                case 6:
                                    enduserConfigurations = (_b);
                                    return [4 /*yield*/, sdk.api.automation_triggers.createSome(_triggers.map(function (t, i) { return ({
                                            title: "trigger ".concat(i),
                                            status: 'Active',
                                            event: {
                                                type: "Vital Update",
                                                info: {
                                                    classifications: t.classifications,
                                                    configurationIds: configurations.filter(function (_, i) { return t.configurationIndexes.includes(i); }).map(function (c) { return c.id; }),
                                                }
                                            },
                                            action: {
                                                type: 'Add Tags',
                                                info: { tags: ['Triggered'] },
                                            },
                                        }); }))];
                                case 7:
                                    triggers = (_c.sent()).created;
                                    return [4 /*yield*/, sdk.api.enduser_observations.createSome(vitals.map(function (v) { return (__assign(__assign({}, v), { category: 'vital-signs', enduserId: e.id, status: 'registered' })); }))];
                                case 8:
                                    _c.sent();
                                    return [4 /*yield*/, async_test(title, function () { return pollForResults(function () { return sdk.api.endusers.getOne(e.id); }, function (e) {
                                            var _a;
                                            // console.log(title, e.tags, (!!e.tags?.includes("Triggered")) === shouldTrigger)
                                            return (!!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes("Triggered"))) === shouldTrigger;
                                        }, 50, 10, shouldTrigger); }, passOnAnyResult)];
                                case 9:
                                    _c.sent();
                                    if (!enduserConfigurations.length) return [3 /*break*/, 11];
                                    return [4 /*yield*/, async_test(title + ' other enduser', function () { return pollForResults(function () { return sdk.api.endusers.getOne(e2.id); }, function (e) {
                                            var _a;
                                            // console.log(title, e.tags, (!!e.tags?.includes("Triggered")) === shouldTrigger)
                                            return (!!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes("Triggered"))) === otherEnduserShouldTrigger;
                                        }, 50, 10, otherEnduserShouldTrigger); }, passOnAnyResult)];
                                case 10:
                                    _c.sent();
                                    _c.label = 11;
                                case 11: return [4 /*yield*/, Promise.all(__spreadArray(__spreadArray(__spreadArray([
                                        sdk.api.endusers.deleteOne(e.id),
                                        sdk.api.endusers.deleteOne(e2.id)
                                    ], configurations.map(function (c) { return sdk.api.vital_configurations.deleteOne(c.id); }), true), enduserConfigurations.map(function (c) { return sdk.api.vital_configurations.deleteOne(c.id); }), true), triggers.map(function (t) { return sdk.api.automation_triggers.deleteOne(t.id); }), true))];
                                case 12:
                                    _c.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                return [4 /*yield*/, runTriggerTest({
                        title: "Basic Passing Test (dontTrigger)",
                        shouldTrigger: false,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 2 }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                measurement: { unit: 'LB', value: 1 },
                                timestamp: new Date(),
                                dontTrigger: true,
                            }]
                    })];
            case 1:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Enduser Specific trigger",
                        shouldTrigger: true,
                        otherEnduserShouldTrigger: false,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 0 }, trendIntervalInMS: 0 },],
                            }],
                        enduserConfigurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 2 }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                measurement: { unit: 'LB', value: 1 },
                                timestamp: new Date(),
                            }]
                    })];
            case 2:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Enduser Specific trigger (both)",
                        shouldTrigger: true,
                        otherEnduserShouldTrigger: true,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 2 }, trendIntervalInMS: 0 },],
                            }],
                        enduserConfigurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 2 }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                measurement: { unit: 'LB', value: 1 },
                                timestamp: new Date(),
                            }]
                    })];
            case 3:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Enduser Specific dont trigger",
                        shouldTrigger: false,
                        otherEnduserShouldTrigger: true,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 2 }, trendIntervalInMS: 0 },],
                            }],
                        enduserConfigurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 0 }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                measurement: { unit: 'LB', value: 1 },
                                timestamp: new Date(),
                            }]
                    })];
            case 4:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Enduser Specific dont trigger (both)",
                        shouldTrigger: false,
                        otherEnduserShouldTrigger: false,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 0 }, trendIntervalInMS: 0 },],
                            }],
                        enduserConfigurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 0 }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                measurement: { unit: 'LB', value: 1 },
                                timestamp: new Date(),
                            }]
                    })];
            case 5:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Any Meal Passing (Unset)",
                        shouldTrigger: true,
                        configurations: [{
                                unit: 'mg/dL',
                                // no meal status
                                // mealStatus: 'Before', 
                                ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                measurement: { unit: 'mg/dL', value: 100 },
                                timestamp: new Date(),
                            }]
                    })];
            case 6:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Any Meal Passing (Unset) [Before]",
                        shouldTrigger: true,
                        configurations: [{
                                unit: 'mg/dL',
                                ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                beforeMeal: true,
                                measurement: { unit: 'mg/dL', value: 100 },
                                timestamp: new Date(),
                            }]
                    })];
            case 7:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Any Meal Passing (Unset) [After]",
                        shouldTrigger: true,
                        configurations: [{
                                unit: 'mg/dL',
                                ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                beforeMeal: false,
                                measurement: { unit: 'mg/dL', value: 100 },
                                timestamp: new Date(),
                            }]
                    })];
            case 8:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Any Meal Passing",
                        shouldTrigger: true,
                        configurations: [{
                                unit: 'mg/dL',
                                mealStatus: 'Any',
                                ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                measurement: { unit: 'mg/dL', value: 100 },
                                timestamp: new Date(),
                            }]
                    })];
            case 9:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Before Meal Passing",
                        shouldTrigger: true,
                        configurations: [{
                                unit: 'mg/dL',
                                mealStatus: 'Before',
                                ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                beforeMeal: true,
                                measurement: { unit: 'mg/dL', value: 100 },
                                timestamp: new Date(),
                            }]
                    })];
            case 10:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Before Meal Failing (omitted)",
                        shouldTrigger: false,
                        configurations: [{
                                unit: 'mg/dL',
                                mealStatus: 'Before',
                                ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                measurement: { unit: 'mg/dL', value: 100 },
                                timestamp: new Date(),
                            }]
                    })];
            case 11:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Before Meal Failing",
                        shouldTrigger: false,
                        configurations: [{
                                unit: 'mg/dL',
                                mealStatus: 'Before',
                                ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                beforeMeal: false,
                                measurement: { unit: 'mg/dL', value: 100 },
                                timestamp: new Date(),
                            }]
                    })];
            case 12:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "After Meal Passing",
                        shouldTrigger: true,
                        configurations: [{
                                unit: 'mg/dL',
                                mealStatus: 'After',
                                ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                beforeMeal: false,
                                measurement: { unit: 'mg/dL', value: 100 },
                                timestamp: new Date(),
                            }]
                    })];
            case 13:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "After Meal Failing (omitted)",
                        shouldTrigger: false,
                        configurations: [{
                                unit: 'mg/dL',
                                mealStatus: 'After',
                                ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                measurement: { unit: 'mg/dL', value: 100 },
                                timestamp: new Date(),
                            }]
                    })];
            case 14:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "After Meal Failing",
                        shouldTrigger: false,
                        configurations: [{
                                unit: 'mg/dL',
                                mealStatus: 'After',
                                ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                beforeMeal: true,
                                measurement: { unit: 'mg/dL', value: 100 },
                                timestamp: new Date(),
                            }]
                    })];
            case 15:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Before meal trend passing",
                        shouldTrigger: true,
                        configurations: [{
                                mealStatus: 'Before',
                                unit: 'mg/dL',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 1 }, trendIntervalInMS: 1000 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [
                            { beforeMeal: true, measurement: { unit: 'mg/dL', value: 1 }, timestamp: new Date() },
                            { beforeMeal: true, measurement: { unit: 'mg/dL', value: 1 }, timestamp: new Date(new Date().getTime() - 999) },
                        ]
                    })];
            case 16:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Before meal trend failing, undefined",
                        shouldTrigger: false,
                        configurations: [{
                                mealStatus: 'Before',
                                unit: 'mg/dL',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 1 }, trendIntervalInMS: 1000 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [
                            { measurement: { unit: 'mg/dL', value: 1 }, timestamp: new Date() },
                            { measurement: { unit: 'mg/dL', value: 1 }, timestamp: new Date(new Date().getTime() - 999) },
                        ]
                    })];
            case 17:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Before meal trend failing",
                        shouldTrigger: false,
                        configurations: [{
                                mealStatus: 'Before',
                                unit: 'mg/dL',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 1 }, trendIntervalInMS: 1000 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [
                            { beforeMeal: false, measurement: { unit: 'mg/dL', value: 1 }, timestamp: new Date() },
                            { beforeMeal: false, measurement: { unit: 'mg/dL', value: 1 }, timestamp: new Date(new Date().getTime() - 999) },
                        ]
                    })];
            case 18:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "After meal trend passing",
                        shouldTrigger: true,
                        configurations: [{
                                mealStatus: 'After',
                                unit: 'mg/dL',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 1 }, trendIntervalInMS: 1000 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [
                            { beforeMeal: false, measurement: { unit: 'mg/dL', value: 1 }, timestamp: new Date() },
                            { beforeMeal: false, measurement: { unit: 'mg/dL', value: 1 }, timestamp: new Date(new Date().getTime() - 999) },
                        ]
                    })];
            case 19:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "After meal trend failing, undefined",
                        shouldTrigger: false,
                        configurations: [{
                                mealStatus: 'After',
                                unit: 'mg/dL',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 1 }, trendIntervalInMS: 1000 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [
                            { measurement: { unit: 'mg/dL', value: 1 }, timestamp: new Date() },
                            { measurement: { unit: 'mg/dL', value: 1 }, timestamp: new Date(new Date().getTime() - 999) },
                        ]
                    })];
            case 20:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "After meal trend failing",
                        shouldTrigger: false,
                        configurations: [{
                                mealStatus: 'After',
                                unit: 'mg/dL',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 1 }, trendIntervalInMS: 1000 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [
                            { beforeMeal: true, measurement: { unit: 'mg/dL', value: 1 }, timestamp: new Date() },
                            { beforeMeal: true, measurement: { unit: 'mg/dL', value: 1 }, timestamp: new Date(new Date().getTime() - 999) },
                        ]
                    })];
            case 21:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Weight Trend from Profile (positive, not enough)",
                        shouldTrigger: false,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, deviationFromProfileWeight: true, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                measurement: { unit: 'LB', value: 180 },
                                timestamp: new Date(),
                            }]
                    })];
            case 22:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Weight Trend from Profile (negative, not enough)",
                        shouldTrigger: false,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: -1 }, deviationFromProfileWeight: true, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                measurement: { unit: 'LB', value: 175 },
                                timestamp: new Date(),
                            }]
                    })];
            case 23:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Weight Trend from Profile",
                        shouldTrigger: true,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, deviationFromProfileWeight: true, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                measurement: { unit: 'LB', value: 182 },
                                timestamp: new Date(),
                            }]
                    })];
            case 24:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Weight Trend from Profile (negative)",
                        shouldTrigger: true,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: -1 }, deviationFromProfileWeight: true, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                measurement: { unit: 'LB', value: 178 },
                                timestamp: new Date(),
                            }]
                    })];
            case 25:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Basic Passing Test (Less Than Sucess)",
                        shouldTrigger: true,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 2 }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                measurement: { unit: 'LB', value: 1 },
                                timestamp: new Date(),
                            }]
                    })];
            case 26:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Less Than Fail",
                        shouldTrigger: false,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 1 }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                measurement: { unit: 'LB', value: 1 },
                                timestamp: new Date(),
                            }]
                    })];
            case 27:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Greater Than Success",
                        shouldTrigger: true,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 0 }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                measurement: { unit: 'LB', value: 1 },
                                timestamp: new Date(),
                            }]
                    })];
            case 28:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Greater Than Fail",
                        shouldTrigger: false,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 0 }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                measurement: { unit: 'LB', value: 0 },
                                timestamp: new Date(),
                            }]
                    })];
            case 29:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Between Low Bound",
                        shouldTrigger: true,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Between', value: { lower: 0, upper: 1 } }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                measurement: { unit: 'LB', value: 0 },
                                timestamp: new Date(),
                            }]
                    })];
            case 30:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Between Upper Bound",
                        shouldTrigger: true,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Between', value: { lower: 0, upper: 1 } }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                measurement: { unit: 'LB', value: 1 },
                                timestamp: new Date(),
                            }]
                    })];
            case 31:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Between Middle",
                        shouldTrigger: true,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Between', value: { lower: 0, upper: 2 } }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                measurement: { unit: 'LB', value: 1 },
                                timestamp: new Date(),
                            }]
                    })];
            case 32:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Between Below Low Bound",
                        shouldTrigger: false,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Between', value: { lower: 0, upper: 1 } }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                measurement: { unit: 'LB', value: -1 },
                                timestamp: new Date(),
                            }]
                    })];
            case 33:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Between Above Upper Bound",
                        shouldTrigger: false,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Between', value: { lower: 0, upper: 1 } }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                measurement: { unit: 'LB', value: 2 },
                                timestamp: new Date(),
                            }]
                    })];
            case 34:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Mismatch Unit",
                        shouldTrigger: false,
                        configurations: [{
                                unit: 'DIFFERENT',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 200 }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                measurement: { unit: 'LB', value: 1 },
                                timestamp: new Date(),
                            }]
                    })];
            case 35:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Mismatch Classification",
                        shouldTrigger: false,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 200 }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['High'], configurationIndexes: [0] }],
                        vitals: [{
                                measurement: { unit: 'LB', value: 1 },
                                timestamp: new Date(),
                            }]
                    })];
            case 36:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Multiple Configurations, first considered works",
                        shouldTrigger: true,
                        configurations: [{
                                unit: 'LB',
                                ranges: [
                                    { classification: 'High', comparison: { type: 'Less Than', value: 100 }, trendIntervalInMS: 0 },
                                    { classification: 'Target', comparison: { type: 'Less Than', value: 200 }, trendIntervalInMS: 0 },
                                ],
                            }],
                        triggers: [{ classifications: ['High'], configurationIndexes: [0, 1] }],
                        vitals: [{
                                measurement: { unit: 'LB', value: 1 },
                                timestamp: new Date(),
                            }]
                    })];
            case 37:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Multiple Configurations, first considered fails",
                        shouldTrigger: false,
                        configurations: [{
                                unit: 'LB',
                                ranges: [
                                    { classification: 'Target', comparison: { type: 'Less Than', value: 200 }, trendIntervalInMS: 0 },
                                    { classification: 'High', comparison: { type: 'Less Than', value: 100 }, trendIntervalInMS: 0 },
                                ],
                            }],
                        triggers: [{ classifications: ['High'], configurationIndexes: [0, 1] }],
                        vitals: [{
                                measurement: { unit: 'LB', value: 1 },
                                timestamp: new Date(),
                            }]
                    })];
            case 38:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Multiple Configurations (Comparisons)",
                        shouldTrigger: true,
                        configurations: [{
                                unit: 'LB',
                                ranges: [
                                    { classification: 'Target', comparison: { type: 'Less Than', value: 0 }, trendIntervalInMS: 0 },
                                    { classification: 'High', comparison: { type: 'Less Than', value: 100 }, trendIntervalInMS: 0 },
                                ],
                            }],
                        triggers: [{ classifications: ['High'], configurationIndexes: [0, 1] }],
                        vitals: [{
                                measurement: { unit: 'LB', value: 1 },
                                timestamp: new Date(),
                            }]
                    })];
            case 39:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Multiple vitals, 0 passes",
                        shouldTrigger: false,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 200 }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [
                            { measurement: { unit: 'LB', value: 500 }, timestamp: new Date() },
                            { measurement: { unit: 'LB', value: 1000 }, timestamp: new Date(Date.now() - 100) },
                            { measurement: { unit: 'LB', value: 250 }, timestamp: new Date(Date.now() - 250) },
                        ]
                    })];
            case 40:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Multiple vitals, 1 passes",
                        shouldTrigger: true,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 200 }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [
                            { measurement: { unit: 'LB', value: 500 }, timestamp: new Date() },
                            { measurement: { unit: 'LB', value: 1 }, timestamp: new Date(Date.now() - 100) },
                            { measurement: { unit: 'LB', value: 250 }, timestamp: new Date(Date.now() - 250) },
                        ]
                    })];
            case 41:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "Multiple vitals, multiple pass",
                        shouldTrigger: true,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 200 }, trendIntervalInMS: 0 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [
                            { measurement: { unit: 'LB', value: 1 }, timestamp: new Date() },
                            { measurement: { unit: 'LB', value: 2 }, timestamp: new Date(Date.now() - 100) },
                            { measurement: { unit: 'LB', value: 3 }, timestamp: new Date(Date.now() - 250) },
                        ]
                    })
                    // trend tests
                ];
            case 42:
                _a.sent();
                // trend tests
                return [4 /*yield*/, runTriggerTest({
                        title: "Singleton trend should not work",
                        shouldTrigger: false,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 200 }, trendIntervalInMS: 1000 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [{
                                measurement: { unit: 'LB', value: 1 },
                                timestamp: new Date(),
                            }]
                    })];
            case 43:
                // trend tests
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "2-point trend passing",
                        shouldTrigger: true,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 1 }, trendIntervalInMS: 1000 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [
                            { measurement: { unit: 'LB', value: 1 }, timestamp: new Date() },
                            { measurement: { unit: 'LB', value: 1 }, timestamp: new Date(new Date().getTime() - 999) },
                        ]
                    })];
            case 44:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "2-point trend passing (negative)",
                        shouldTrigger: true,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: -1 }, trendIntervalInMS: 1000 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [
                            { measurement: { unit: 'LB', value: 1 }, timestamp: new Date() },
                            { measurement: { unit: 'LB', value: 10 }, timestamp: new Date(new Date().getTime() - 999) },
                        ]
                    })];
            case 45:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "2-point trend failing (negative)",
                        shouldTrigger: false,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: -1 }, trendIntervalInMS: 1000 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [
                            { measurement: { unit: 'LB', value: 1 }, timestamp: new Date() },
                            { measurement: { unit: 'LB', value: 2 }, timestamp: new Date(new Date().getTime() - 999) },
                        ]
                    })];
            case 46:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "2-point trend failing for difference too small",
                        shouldTrigger: false,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 1 }, trendIntervalInMS: 1000 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [
                            { measurement: { unit: 'LB', value: 1 }, timestamp: new Date() },
                            { measurement: { unit: 'LB', value: 0 }, timestamp: new Date(new Date().getTime() - 999) },
                        ]
                    })];
            case 47:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "2-point trend failing for point out of time range",
                        shouldTrigger: false,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 5 }, trendIntervalInMS: 1000 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [
                            { measurement: { unit: 'LB', value: 1 }, timestamp: new Date() },
                            { measurement: { unit: 'LB', value: 0 }, timestamp: new Date(new Date().getTime() - 1001) },
                        ]
                    })];
            case 48:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "3-point trend passing (1 point of out range)",
                        shouldTrigger: true,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 2 }, trendIntervalInMS: 1000 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [
                            { measurement: { unit: 'LB', value: 2 }, timestamp: new Date() },
                            { measurement: { unit: 'LB', value: 1 }, timestamp: new Date(new Date().getTime() - 100) },
                            { measurement: { unit: 'LB', value: 0 }, timestamp: new Date(new Date().getTime() - 1001) },
                        ]
                    })];
            case 49:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "3-point trend passing (1 point wrong unit)",
                        shouldTrigger: true,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 2 }, trendIntervalInMS: 1000 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [
                            { measurement: { unit: 'LB', value: 2 }, timestamp: new Date() },
                            { measurement: { unit: 'LB', value: 1 }, timestamp: new Date(new Date().getTime() - 100) },
                            { measurement: { unit: 'OTHER', value: 0 }, timestamp: new Date(new Date().getTime() - 200) },
                        ]
                    })];
            case 50:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "3-point trend failing (1 point of out range)",
                        shouldTrigger: false,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 2 }, trendIntervalInMS: 1000 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [
                            { measurement: { unit: 'LB', value: 2 }, timestamp: new Date() },
                            { measurement: { unit: 'LB', value: 0 }, timestamp: new Date(new Date().getTime() - 100) },
                            { measurement: { unit: 'LB', value: 1 }, timestamp: new Date(new Date().getTime() - 1001) },
                        ]
                    })];
            case 51:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "3-point trend failing (1 point wrong unit)",
                        shouldTrigger: false,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Less Than', value: 2 }, trendIntervalInMS: 1000 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [
                            { measurement: { unit: 'LB', value: 2 }, timestamp: new Date() },
                            { measurement: { unit: 'LB', value: 0 }, timestamp: new Date(new Date().getTime() - 100) },
                            { measurement: { unit: 'OTHER', value: 1 }, timestamp: new Date(new Date().getTime() - 200) },
                        ]
                    })];
            case 52:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "multiple trend passing",
                        shouldTrigger: true,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 1000 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [
                            { measurement: { unit: 'LB', value: 3 }, timestamp: new Date() },
                            { measurement: { unit: 'LB', value: 2 }, timestamp: new Date(new Date().getTime() - 100) },
                            { measurement: { unit: 'LB', value: 1 }, timestamp: new Date(new Date().getTime() - 200) },
                        ]
                    })];
            case 53:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "multiple trend failing (not enough)",
                        shouldTrigger: false,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 1000 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [
                            { measurement: { unit: 'LB', value: 2 }, timestamp: new Date() },
                            { measurement: { unit: 'LB', value: 2 }, timestamp: new Date(new Date().getTime() - 100) },
                            { measurement: { unit: 'LB', value: 1 }, timestamp: new Date(new Date().getTime() - 200) },
                        ]
                    })];
            case 54:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "multiple trend failing (wrong order)",
                        shouldTrigger: false,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 1000 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [
                            { measurement: { unit: 'LB', value: 1 }, timestamp: new Date() },
                            { measurement: { unit: 'LB', value: 2 }, timestamp: new Date(new Date().getTime() - 100) },
                            { measurement: { unit: 'LB', value: 3 }, timestamp: new Date(new Date().getTime() - 200) },
                        ]
                    })];
            case 55:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "multiple trend failing (not enough, and wrong order)",
                        shouldTrigger: false,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 1000 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [
                            { measurement: { unit: 'LB', value: 1 }, timestamp: new Date() },
                            { measurement: { unit: 'LB', value: 2 }, timestamp: new Date(new Date().getTime() - 100) },
                            { measurement: { unit: 'LB', value: 2 }, timestamp: new Date(new Date().getTime() - 200) },
                        ]
                    })];
            case 56:
                _a.sent();
                return [4 /*yield*/, runTriggerTest({
                        title: "multiple trend failing (lots)",
                        shouldTrigger: false,
                        configurations: [{
                                unit: 'LB',
                                ranges: [{ classification: 'Target', comparison: { type: 'Greater Than', value: 1 }, trendIntervalInMS: 1000 },],
                            }],
                        triggers: [{ classifications: ['Target'], configurationIndexes: [0] }],
                        vitals: [
                            { measurement: { unit: 'LB', value: 1 }, timestamp: new Date() },
                            { measurement: { unit: 'LB', value: 2 }, timestamp: new Date(new Date().getTime() - 100) },
                            { measurement: { unit: 'LB', value: 2 }, timestamp: new Date(new Date().getTime() - 200) },
                            { measurement: { unit: 'LB', value: 1 }, timestamp: new Date(new Date().getTime() - 300) },
                            { measurement: { unit: 'LB', value: 1 }, timestamp: new Date(new Date().getTime() - 400) },
                            { measurement: { unit: 'LB', value: 2 }, timestamp: new Date(new Date().getTime() - 500) },
                            { measurement: { unit: 'LB', value: 1 }, timestamp: new Date(new Date().getTime() - 600) },
                        ]
                    })];
            case 57:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var superadmin_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Superadmin Tests");
                return [4 /*yield*/, async_test("switch tenant is limited", function () { return sdk.change_tenant({ all: true }); }, handleAnyError)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var mdb_filter_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var enduser, otherEnduser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("MongoDB Filter Tests");
                return [4 /*yield*/, sdk.api.endusers.createOne({
                        fname: 'Test',
                        lname: 'Testson',
                        tags: ["tag1", "tag2"],
                        fields: { custom: 1, nested: { custom: 2 } },
                    })];
            case 1:
                enduser = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({
                        fname: 'Other',
                        lname: 'Enduser',
                        tags: ["tag1", "tag2"],
                        fields: { custom: 1, nested: { custom: 2 } },
                    })];
            case 2:
                otherEnduser = _a.sent();
                return [4 /*yield*/, async_test("$and", function () { return sdk.api.endusers.getOne('', { $and: [{ fname: 'Test' }, { lname: 'Testson' }, { 'fields.custom': 1 }, { 'fields.nested.custom': 2 }] }); }, { onResult: function (e) { return e.id === enduser.id; } })];
            case 3:
                _a.sent();
                return [4 /*yield*/, async_test("$and (list)", function () { return sdk.api.endusers.getSome({ mdbFilter: { $and: [{ fname: 'Test' }, { lname: 'Testson' }, { 'fields.custom': 1 }, { 'fields.nested.custom': 2 }] } }); }, { onResult: function (e) { return e.length === 1 && e[0].id === enduser.id; } })];
            case 4:
                _a.sent();
                return [4 /*yield*/, async_test("$and no match", function () { return sdk.api.endusers.getOne('', { $and: [{ fname: 'Not Test' }, { lname: 'Testson' }] }); }, handleAnyError)];
            case 5:
                _a.sent();
                return [4 /*yield*/, async_test("$and no match (list)", function () { return sdk.api.endusers.getSome({ mdbFilter: { $and: [{ fname: 'Not Test' }, { lname: 'Testson' }] } }); }, { onResult: function (e) { return e.length === 0; } })];
            case 6:
                _a.sent();
                return [4 /*yield*/, async_test("bad query", function () { return sdk.api.endusers.getOne('', { $bad: 'query' }); }, { shouldError: true, onError: function (e) { return e.message === "unknown top level operator: $bad. If you have a field name that starts with a '$' symbol, consider using $getField or $setField."; } })];
            case 7:
                _a.sent();
                return [4 /*yield*/, async_test("bad query (list)", function () { return sdk.api.endusers.getSome({ mdbFilter: { $bad: 'query' } }); }, { shouldError: true, onError: function (e) { return e.message === "unknown top level operator: $bad. If you have a field name that starts with a '$' symbol, consider using $getField or $setField."; } })];
            case 8:
                _a.sent();
                return [2 /*return*/, Promise.all([
                        sdk.api.endusers.deleteOne(enduser.id),
                        sdk.api.endusers.deleteOne(otherEnduser.id),
                    ])];
        }
    });
}); };
var uniqueness_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var email, externalId, dateOfBirth, form, _a, eExternalId, other, eExternalIdOnUpdate, enduserNoCreator, e, e2, _b, e3, e4, eUpdate;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                log_header("Uniqueness Tests");
                email = "test@tellescope.com";
                externalId = "12345";
                dateOfBirth = "12-20-1997";
                return [4 /*yield*/, sdk.api.forms.createOne({ title: 'test form for duplication', allowPublicURL: true })];
            case 1:
                form = _c.sent();
                return [4 /*yield*/, sdk.api.form_fields.createOne({ formId: form.id, title: 'title', type: 'string', previousFields: [{ type: 'root', info: {} }] })];
            case 2:
                _c.sent();
                return [4 /*yield*/, sdk.api.endusers.createSome([{ email: email, externalId: externalId }, {}])];
            case 3:
                _a = (_c.sent()).created, eExternalId = _a[0], other = _a[1];
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 4:
                eExternalIdOnUpdate = _c.sent();
                return [4 /*yield*/, enduserSDK.api.form_responses.session_for_public_form({ businessId: form.businessId, formId: form.id, skipMatch: true, dateOfBirth: dateOfBirth })];
            case 5:
                _c.sent();
                return [4 /*yield*/, sdk.api.endusers.getOne({ dateOfBirth: dateOfBirth })];
            case 6:
                enduserNoCreator = _c.sent();
                assert(enduserNoCreator.creator === null, 'creator null from public form', 'creator null from public form');
                return [4 /*yield*/, async_test("Cannot create with duplicate externalId", function () { return sdk.api.endusers.createOne({ email: 'notaconflict2@tellescope.com', phone: "+15555555555", externalId: externalId }); }, { shouldError: true, onError: function (e) { return e.message === UniquenessViolationMessage; } })];
            case 7:
                _c.sent();
                return [4 /*yield*/, async_test("Cannot update to set duplicate externalId", function () { return sdk.api.endusers.updateOne(eExternalIdOnUpdate.id, { email: email, phone: "+15555555555", externalId: externalId }, { replaceObjectFields: true }); }, { shouldError: true, onError: function (e) { return e.message === UniquenessViolationMessage; } })];
            case 8:
                _c.sent();
                return [4 /*yield*/, async_test("Cannot update to set duplicate externalId", function () { return sdk.api.endusers.updateOne(enduserNoCreator.id, { email: email, phone: "+15555555555", externalId: externalId }, { replaceObjectFields: true }); }, { shouldError: true, onError: function (e) { return e.message === UniquenessViolationMessage; } })];
            case 9:
                _c.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(eExternalId.id),
                        sdk.api.endusers.deleteOne(other.id),
                        sdk.api.endusers.deleteOne(eExternalIdOnUpdate.id),
                        sdk.api.endusers.deleteOne(enduserNoCreator.id),
                        sdk.api.forms.deleteOne(form.id),
                    ])
                    // tests for _overrideUnique: true
                ];
            case 10:
                _c.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ fname: "1", email: email, _overrideUnique: true })];
            case 11:
                e = _c.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ fname: "2", email: email, _overrideUnique: true })];
            case 12:
                e2 = _c.sent();
                return [4 /*yield*/, sdk.api.endusers.createSome([{ fname: "3", email: email }, { fname: "4", email: email }], { _overrideUnique: true })];
            case 13:
                _b = (_c.sent()).created, e3 = _b[0], e4 = _b[1];
                return [4 /*yield*/, sdk.api.endusers.createOne({ fname: "5", })];
            case 14:
                eUpdate = _c.sent();
                return [4 /*yield*/, sdk.api.endusers.updateOne(eUpdate.id, { email: email }, {}, true)];
            case 15:
                _c.sent();
                return [4 /*yield*/, async_test("Duplicates allowed via _overrideUnique: true", function () { return sdk.api.endusers.getSome({ filter: { email: email } }); }, { onResult: function (v) { return v.length === 5; } })];
            case 16:
                _c.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(e.id),
                        sdk.api.endusers.deleteOne(e2.id),
                        sdk.api.endusers.deleteOne(e3.id),
                        sdk.api.endusers.deleteOne(e4.id),
                        sdk.api.endusers.deleteOne(eUpdate.id),
                    ])];
            case 17:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
var input_modifier_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Input Modifiers");
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 1:
                e = _a.sent();
                return [4 /*yield*/, async_test("Regular string", function () { return sdk.api.form_responses.createOne({
                        enduserId: e.id,
                        formId: PLACEHOLDER_ID,
                        formTitle: "input modifiers",
                        responses: [{
                                fieldTitle: '',
                                fieldId: '',
                                answer: { type: 'string', value: 'hello' }
                            }]
                    }); }, { onResult: function (r) { var _a; return ((_a = r.responses) === null || _a === void 0 ? void 0 : _a[0].answer.value) === 'hello'; } })];
            case 2:
                _a.sent();
                return [4 /*yield*/, async_test("Number coerce to string", function () { return sdk.api.form_responses.createOne({
                        enduserId: e.id,
                        formId: PLACEHOLDER_ID,
                        formTitle: "input modifiers",
                        responses: [{
                                fieldTitle: '',
                                fieldId: '',
                                answer: { type: 'string', value: 55 }
                            }]
                    }); }, { onResult: function (r) { var _a; return ((_a = r.responses) === null || _a === void 0 ? void 0 : _a[0].answer.value) === '55'; } })];
            case 3:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(e.id),
                    ])];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var calendar_event_care_team_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var e, userId, ev1, ev2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Calendar Event Care Team Test");
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 1:
                e = _a.sent();
                userId = sdk.userInfo.id;
                return [4 /*yield*/, sdk.api.calendar_events.createOne({
                        title: 'test', durationInMinutes: 60, startTimeInMS: Date.now(),
                        attendees: [{ type: 'enduser', id: e.id }, { type: 'user', id: userId }],
                    })];
            case 2:
                ev1 = _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.createOne({
                        title: 'test', durationInMinutes: 60, startTimeInMS: Date.now(),
                        attendees: [{ type: 'enduser', id: e.id }],
                    })];
            case 3:
                ev2 = _a.sent();
                return [4 /*yield*/, async_test("User assigned on event create", function () { return pollForResults(function () { return sdk.api.endusers.getOne(e.id); }, function (e) { var _a; return !!((_a = e.assignedTo) === null || _a === void 0 ? void 0 : _a.includes(userId)); }, 50, 10); }, passOnAnyResult)];
            case 4:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.updateOne(e.id, { assignedTo: [] }, { replaceObjectFields: true })];
            case 5:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.updateOne(ev2.id, { attendees: [{ type: 'user', id: userId }] })];
            case 6:
                _a.sent();
                return [4 /*yield*/, async_test("User assigned on add to event", function () { return pollForResults(function () { return sdk.api.endusers.getOne(e.id); }, function (e) { var _a; return !!((_a = e.assignedTo) === null || _a === void 0 ? void 0 : _a.includes(userId)); }, 50, 10); }, passOnAnyResult)];
            case 7:
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.updateOne(e.id, { assignedTo: [] }, { replaceObjectFields: true })];
            case 8:
                _a.sent();
                return [4 /*yield*/, sdk.api.calendar_events.updateOne(ev2.id, { title: "Updated title" })];
            case 9:
                _a.sent();
                return [4 /*yield*/, async_test("User not assinged on non-attendee event change", function () { return pollForResults(function () { return sdk.api.endusers.getOne(e.id); }, function (e) { var _a; return !((_a = e.assignedTo) === null || _a === void 0 ? void 0 : _a.includes(userId)); }, 1000, 1); }, passOnAnyResult)];
            case 10:
                _a.sent();
                return [2 /*return*/, Promise.all([
                        sdk.api.endusers.deleteOne(e.id),
                        sdk.api.calendar_events.deleteOne(ev1.id),
                        sdk.api.calendar_events.deleteOne(ev2.id),
                    ])];
        }
    });
}); };
var ticket_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var organization, e, userId, t, tOnwerOnUpdate, queue;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Ticket No Care Team Setting Tests");
                return [4 /*yield*/, sdk.api.organizations.getSome()];
            case 1:
                organization = (_a.sent()).find(function (o) { return o.id === sdk.userInfo.businessId; });
                if (!organization) {
                    throw new Error("Organization not found");
                }
                // set behavior for these tests
                return [4 /*yield*/, sdk.api.organizations.updateOne(organization.id, {
                        settings: { tickets: { dontAddToCareTeamOnTicketAssignment: true } }
                    })];
            case 2:
                // set behavior for these tests
                _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({})];
            case 3:
                e = _a.sent();
                userId = sdk.userInfo.id;
                return [4 /*yield*/, sdk.api.tickets.createOne({ title: 'test', enduserId: e.id, owner: userId, tags: '' })];
            case 4:
                t = _a.sent();
                return [4 /*yield*/, async_test("Ticket tags coerced to empty array", function () { return sdk.api.tickets.getOne(t.id); }, { onResult: function (t) { return Array.isArray(t.tags) && t.tags.length === 0; } })];
            case 5:
                _a.sent();
                return [4 /*yield*/, sdk.api.tickets.createOne({ title: 'test', enduserId: e.id, owner: userId })];
            case 6:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 1000)];
            case 7:
                _a.sent();
                return [4 /*yield*/, async_test("Not on care team after ticket create", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) { var _a; return !((_a = e.assignedTo) === null || _a === void 0 ? void 0 : _a.includes(userId)); } })];
            case 8:
                _a.sent();
                return [4 /*yield*/, sdk.api.tickets.createOne({ title: 'test', enduserId: e.id })];
            case 9:
                tOnwerOnUpdate = _a.sent();
                return [4 /*yield*/, sdk.api.tickets.updateOne(tOnwerOnUpdate.id, { owner: userId })];
            case 10:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 1000)];
            case 11:
                _a.sent();
                return [4 /*yield*/, async_test("Not on care team after ticket owner set", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) { var _a; return !((_a = e.assignedTo) === null || _a === void 0 ? void 0 : _a.includes(userId)); } })];
            case 12:
                _a.sent();
                return [4 /*yield*/, sdk.api.ticket_queues.createOne({ title: "Assignment Testing", userIds: [userId] })];
            case 13:
                queue = _a.sent();
                return [4 /*yield*/, sdk.api.tickets.createOne({ title: 'test', enduserId: e.id, queueId: queue.id })];
            case 14:
                _a.sent();
                return [4 /*yield*/, sdk.api.tickets.assign_from_queue({ overrideRestrictions: true, queueId: queue.id, userId: userId })];
            case 15:
                _a.sent();
                return [4 /*yield*/, wait(undefined, 1000)];
            case 16:
                _a.sent();
                return [4 /*yield*/, async_test("Not on care team after ticket pulled from queue", function () { return sdk.api.endusers.getOne(e.id); }, { onResult: function (e) { var _a; return !((_a = e.assignedTo) === null || _a === void 0 ? void 0 : _a.includes(userId)); } })
                    // reset behavior to default for other tests
                ];
            case 17:
                _a.sent();
                // reset behavior to default for other tests
                return [4 /*yield*/, sdk.api.organizations.updateOne(organization.id, {
                        settings: { tickets: { dontAddToCareTeamOnTicketAssignment: false } }
                    })];
            case 18:
                // reset behavior to default for other tests
                _a.sent();
                return [2 /*return*/, Promise.all([
                        sdk.api.endusers.deleteOne(e.id),
                        sdk.api.ticket_queues.deleteOne(queue.id),
                    ])];
        }
    });
}); };
var fromEmailOverride_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var enduser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("fromEmailOvrride");
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'test@tellescope.com' })];
            case 1:
                enduser = _a.sent();
                return [4 /*yield*/, async_test("fromEmailOverride missing", function () { return sdk.api.emails.createOne({
                        logOnly: true,
                        subject: 'test',
                        enduserId: enduser.id,
                        textContent: '',
                    }); }, passOnAnyResult)];
            case 2:
                _a.sent();
                return [4 /*yield*/, async_test("fromEmailOverride missing bulk", function () { return sdk.api.emails.createSome([{
                            logOnly: true,
                            subject: 'test',
                            enduserId: enduser.id,
                            textContent: '',
                        }]); }, passOnAnyResult)];
            case 3:
                _a.sent();
                return [4 /*yield*/, async_test("fromEmailOverride My Email", function () { return sdk.api.emails.createOne({
                        logOnly: true,
                        subject: 'test',
                        enduserId: enduser.id,
                        textContent: '',
                        fromEmailOverride: "My Email"
                    }); }, passOnAnyResult)];
            case 4:
                _a.sent();
                return [4 /*yield*/, async_test("fromEmailOverride My Email (bulk)", function () { return sdk.api.emails.createSome([{
                            logOnly: true,
                            subject: 'test',
                            enduserId: enduser.id,
                            textContent: '',
                            fromEmailOverride: "My Email"
                        }]); }, passOnAnyResult)];
            case 5:
                _a.sent();
                return [4 /*yield*/, async_test("fromEmailOverride test@", function () { return sdk.api.emails.createOne({
                        logOnly: true,
                        subject: 'test',
                        enduserId: enduser.id,
                        textContent: '',
                        fromEmailOverride: "test@tellescope.com"
                    }); }, passOnAnyResult)];
            case 6:
                _a.sent();
                return [4 /*yield*/, async_test("fromEmailOverride test@ bulk", function () { return sdk.api.emails.createSome([{
                            logOnly: true,
                            subject: 'test',
                            enduserId: enduser.id,
                            textContent: '',
                            fromEmailOverride: "test@tellescope.com"
                        }]); }, passOnAnyResult)];
            case 7:
                _a.sent();
                return [4 /*yield*/, async_test("fromEmailOverride fail@", function () { return sdk.api.emails.createOne({
                        logOnly: true,
                        subject: 'test',
                        enduserId: enduser.id,
                        textContent: '',
                        fromEmailOverride: "fail@tellescope.com"
                    }); }, handleAnyError)];
            case 8:
                _a.sent();
                return [4 /*yield*/, async_test("fromEmailOverride fail@ bulk", function () { return sdk.api.emails.createSome([{
                            logOnly: true,
                            subject: 'test',
                            enduserId: enduser.id,
                            textContent: '',
                            fromEmailOverride: "fail@tellescope.com"
                        }]); }, handleAnyError)];
            case 9:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(enduser.id)
                    ])];
            case 10: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var date_parsing_tests = function () {
    log_header("Date Parsing Tests");
    assert(YYYY_MM_DD_to_MM_DD_YYYY('') === '', 'YYYY_MM_DD_to_MM_DD_YYYY fails', 'YYYY_MM_DD_to_MM_DD_YYYY empty string');
    assert(YYYY_MM_DD_to_MM_DD_YYYY(undefined) === '', 'YYYY_MM_DD_to_MM_DD_YYYY fails', 'YYYY_MM_DD_to_MM_DD_YYYY undefined');
    assert(YYYY_MM_DD_to_MM_DD_YYYY(null) === '', 'YYYY_MM_DD_to_MM_DD_YYYY fails', 'YYYY_MM_DD_to_MM_DD_YYYY null');
    assert(YYYY_MM_DD_to_MM_DD_YYYY('2024-07-09') === '07-09-2024', 'YYYY_MM_DD_to_MM_DD_YYYY fails', 'YYYY_MM_DD_to_MM_DD_YYYY');
};
var test_form_response_search = function () { return __awaiter(void 0, void 0, void 0, function () {
    var f, e, fr;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Form Response Search Tests");
                return [4 /*yield*/, sdk.api.forms.createOne({ title: 'KEYWORD for search', allowPublicURL: true })];
            case 1:
                f = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ email: 'test@tellescope.com' })];
            case 2:
                e = _a.sent();
                return [4 /*yield*/, sdk.api.form_responses.prepare_form_response({
                        enduserId: e.id,
                        formId: f.id,
                    })];
            case 3:
                fr = _a.sent();
                return [4 /*yield*/, sdk.api.form_responses.submit_form_response({
                        accessCode: fr.accessCode,
                        responses: [
                            {
                                fieldId: '',
                                fieldTitle: 'unsearchable',
                                answer: {
                                    type: 'string',
                                    value: 'unsearchable',
                                }
                            }
                        ],
                    })];
            case 4:
                _a.sent();
                return [4 /*yield*/, async_test("Search for searchable title", function () { return sdk.api.form_responses.getSome({ search: { query: 'KEYWORD' } }); }, { onResult: function (r) { return r.length === 1; } })];
            case 5:
                _a.sent();
                return [4 /*yield*/, async_test("Search for searchable title (case sensitivity)", function () { return sdk.api.form_responses.getSome({ search: { query: 'kEYWORD' } }); }, { onResult: function (r) { return r.length === 0; } })];
            case 6:
                _a.sent();
                return [4 /*yield*/, async_test("Search for email", function () { return sdk.api.form_responses.getSome({ search: { query: 'test@tellescope.com' } }); }, { onResult: function (r) { return r.length === 1; } })];
            case 7:
                _a.sent();
                return [4 /*yield*/, async_test("Search for unsearchable field", function () { return sdk.api.form_responses.getSome({ search: { query: 'unsearchable' } }); }, { onResult: function (r) { return r.length === 0; } })];
            case 8:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.forms.deleteOne(f.id),
                        sdk.api.endusers.deleteOne(e.id),
                    ])];
            case 9: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var get_templated_message_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var enduser, related;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("Get Templated Message Tests");
                return [4 /*yield*/, sdk.api.endusers.createOne({ fname: "Main", fields: { CustomField: "Enduser" } })];
            case 1:
                enduser = _a.sent();
                return [4 /*yield*/, sdk.api.endusers.createOne({ lname: "Related", fields: { OtherCustomField: "Contact" } })];
            case 2:
                related = _a.sent();
                return [4 /*yield*/, async_test("Fields are templated correctly for enduser and relatedcontact", function () { return sdk.api.templates.get_templated_message({
                        enduserId: enduser.id,
                        relatedContactId: related.id,
                        channel: 'Chat',
                        message: "Hello {name}{{enduser.fname}}{{enduser.lname}}{{enduser.CustomField}}{{enduser.OtherCustomField}}{{relatedcontact.fname}}{{relatedcontact.lname}}{{relatedcontact.OtherCustomField}} goodbye",
                        userId: sdk.userInfo.id,
                    }); }, { onResult: function (r) { return r.plaintext === "Hello MainMainEnduserRelatedContact goodbye"; }
                    })];
            case 3:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(enduser.id),
                        sdk.api.endusers.deleteOne(related.id),
                    ])];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var file_source_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var f;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log_header("File Source Tests");
                return [4 /*yield*/, sdk.api.files.prepare_file_upload({
                        name: 'test',
                        type: 'application/pdf',
                        size: 100,
                        source: 'test'
                    })];
            case 1:
                f = (_a.sent()).file;
                return [4 /*yield*/, async_test("No filter returns value", function () { return sdk.api.files.getSome({}); }, { onResult: function (r) { return r.length === 1 && r[0].id === f.id; } })];
            case 2:
                _a.sent();
                return [4 /*yield*/, async_test("Filter by source returns value", function () { return sdk.api.files.getSome({ filter: { source: 'test' } }); }, { onResult: function (r) { return r.length === 1 && r[0].id === f.id; } })];
            case 3:
                _a.sent();
                return [4 /*yield*/, async_test("Filter by differnt source returns no value", function () { return sdk.api.files.getSome({ filter: { source: 'other' } }); }, { onResult: function (r) { return r.length === 0; } })];
            case 4:
                _a.sent();
                return [4 /*yield*/, sdk.api.files.deleteOne(f.id)];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var updatedAt_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var e, original, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                log_header("UpdatedAt Tests");
                return [4 /*yield*/, sdk.api.endusers.createOne({ fname: 'Test', lname: 'Testson' })];
            case 1:
                e = _b.sent();
                _a = Date.bind;
                return [4 /*yield*/, sdk.api.endusers.getOne(e.id)];
            case 2:
                original = new (_a.apply(Date, [void 0, (_b.sent()).updatedAt]))() // may slightly differ from what's returned on creation
                ;
                return [4 /*yield*/, wait(undefined, 500)];
            case 3:
                _b.sent();
                return [4 /*yield*/, async_test("updatedAt doesn't change with a non-log update", function () { return sdk.api.endusers.updateOne(e.id, { recentViewers: [{ at: new Date(), id: sdk.userInfo.id }] }, { replaceObjectFields: true }); }, {
                        onResult: function (e) {
                            var updatedAt = new Date(e.updatedAt);
                            console.log('updatedAt', updatedAt, 'original', original);
                            return updatedAt.getTime() === original.getTime();
                        }
                    })];
            case 4:
                _b.sent();
                return [4 /*yield*/, async_test('get to verify that updatedAt is not changed', function () { return sdk.api.endusers.getOne(e.id); }, {
                        onResult: function (e) {
                            var updatedAt = new Date(e.updatedAt);
                            return updatedAt.getTime() === original.getTime();
                        }
                    })];
            case 5:
                _b.sent();
                return [4 /*yield*/, async_test("updatedAt changes with a log update", function () { return sdk.api.endusers.updateOne(e.id, { fname: 'Test2' }, { replaceObjectFields: true }); }, {
                        onResult: function (e) {
                            var updatedAt = new Date(e.updatedAt);
                            return updatedAt.getTime() > original.getTime();
                        }
                    })];
            case 6:
                _b.sent();
                return [4 /*yield*/, async_test('get to verify that updatedAt is changed', function () { return sdk.api.endusers.getOne(e.id); }, {
                        onResult: function (e) {
                            var updatedAt = new Date(e.updatedAt);
                            return updatedAt.getTime() > original.getTime();
                        }
                    })];
            case 7:
                _b.sent();
                return [4 /*yield*/, Promise.all([
                        sdk.api.endusers.deleteOne(e.id),
                    ])];
            case 8:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var fields, err_1, n, _a, _b, _c, _i, returnValidation, t, _d, _f, _g, _h, err_2;
    var _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                log_header("API");
                return [4 /*yield*/, async_test("email-image tracking endpoint is live", function () { return axios.get('http://localhost:8080/email-image/'); }, { onResult: function (result) { return result.data === TRACK_OPEN_IMAGE.toString('utf-8'); } })];
            case 1:
                _l.sent();
                _l.label = 2;
            case 2:
                _l.trys.push([2, 72, , 73]);
                form_conditional_logic_tests();
                return [4 /*yield*/, test_weighted_round_robin()];
            case 3:
                _l.sent();
                return [4 /*yield*/, validate_schema()];
            case 4:
                _l.sent();
                fields = get_flattened_fields([
                    { otherField: '', insurance: { payerName: '' }, },
                    { insurance: { payerName: '' }, },
                    { insurance: {}, insuranceSecondary: {}, },
                    { insurance: {}, insuranceSecondary: { memberId: '' }, },
                ]);
                assert(objects_equivalent(fields, ['otherField', 'insurance.payerName', 'insuranceSecondary.memberId']), 'flattened object fields fail', 'flattened object fields');
                return [4 /*yield*/, Promise.all([
                        sdk.authenticate(email, password),
                        sdkSub.authenticate(subUserEmail, password),
                        sdkOtherSub.authenticate(otherSubUserEmail, password),
                        sdkSubSub.authenticate(subSubUserEmail, password),
                        sdkNonAdmin.authenticate(nonAdminEmail, nonAdminPassword),
                    ])];
            case 5:
                _l.sent();
                return [4 /*yield*/, async_test('Nested error message', function () { return sdk.api.endusers.createOne({ bookingNotes: [{ note: 'optional note' }] }); }, { shouldError: true, onError: function (e) { return e.message === 'Value not provided for required field: bookingNotes.bookingPageId'; } })];
            case 6:
                _l.sent();
                return [4 /*yield*/, async_test('Nested error message', function () { return sdk.api.endusers.createOne({ weight: { unit: undefined, value: 10 } }); }, { shouldError: true, onError: function (e) { return e.message === 'Value not provided for required field: weight.unit'; } })
                    // await async_test(
                    //   'Nested error message?',
                    //   () => sdk.api.form_responses.createOne({ 
                    //       enduserId: PLACEHOLDER_ID,
                    //       formId: PLACEHOLDER_ID,
                    //       formTitle: 'test',
                    //       responses: [
                    //         {
                    //           'fieldId': '113', 
                    //           'fieldTitle': 'Thanks! Could you share a few more details about your insurance plan with us, please?',
                    //           answer: {
                    //             type: "Table Input",
                    //             value: [
                    //               []
                    //             ]
                    //           }
                    //         },
                    //       ]
                    //   }),
                    //   passOnAnyResult
                    // )
                ];
            case 7:
                _l.sent();
                // await async_test(
                //   'Nested error message?',
                //   () => sdk.api.form_responses.createOne({ 
                //       enduserId: PLACEHOLDER_ID,
                //       formId: PLACEHOLDER_ID,
                //       formTitle: 'test',
                //       responses: [
                //         {
                //           'fieldId': '113', 
                //           'fieldTitle': 'Thanks! Could you share a few more details about your insurance plan with us, please?',
                //           answer: {
                //             type: "Table Input",
                //             value: [
                //               []
                //             ]
                //           }
                //         },
                //       ]
                //   }),
                //   passOnAnyResult
                // )
                return [4 /*yield*/, async_test("Uniqueness violation redacts sensitive existing record details", function () { return sdk.api.users.createOne({ email: email }); }, {
                        shouldError: true,
                        onError: function (e) {
                            var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l, _m, _o;
                            return (e.message === "Uniqueness Violation"
                                && Object.keys((_b = (_a = e.info) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.conflictingFields).length === 1
                                && ((_d = (_c = e.info) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.conflictingFields.email) === email
                                && Object.keys((_g = (_f = e.info) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.existingRecord).length === 2 // only _id and businessId should be exposed
                                && ((_k = (_j = (_h = e.info) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.existingRecord) === null || _k === void 0 ? void 0 : _k._id)
                                && ((_o = (_m = (_l = e.info) === null || _l === void 0 ? void 0 : _l[0]) === null || _m === void 0 ? void 0 : _m.existingRecord) === null || _o === void 0 ? void 0 : _o.businessId));
                        }
                    })
                    // console.log(JSON.stringify(await sdk.bulk_load({ load: [{ model: 'users' }]}), null, 2))
                ];
            case 8:
                // await async_test(
                //   'Nested error message?',
                //   () => sdk.api.form_responses.createOne({ 
                //       enduserId: PLACEHOLDER_ID,
                //       formId: PLACEHOLDER_ID,
                //       formTitle: 'test',
                //       responses: [
                //         {
                //           'fieldId': '113', 
                //           'fieldTitle': 'Thanks! Could you share a few more details about your insurance plan with us, please?',
                //           answer: {
                //             type: "Table Input",
                //             value: [
                //               []
                //             ]
                //           }
                //         },
                //       ]
                //   }),
                //   passOnAnyResult
                // )
                _l.sent();
                // console.log(JSON.stringify(await sdk.bulk_load({ load: [{ model: 'users' }]}), null, 2))
                return [4 /*yield*/, async_test("email validation error message", 
                    // @ts-ignore
                    function () { return sdk.api.endusers.createOne({ email: 'not-an-email' }); }, { shouldError: true, onError: function (e) { return e.message === 'Error parsing field email: Invalid email: not-an-email'; } })];
            case 9:
                // console.log(JSON.stringify(await sdk.bulk_load({ load: [{ model: 'users' }]}), null, 2))
                _l.sent();
                return [4 /*yield*/, async_test("count exists", 
                    // @ts-ignore
                    function () { return sdk.api.endusers.getSome({ returnCount: true }); }, { onResult: function (result) { return typeof result.count === 'number'; } })];
            case 10:
                _l.sent();
                return [4 /*yield*/, async_test("push_to_EHR allows missing addedResponses", function () { return sdk.api.form_responses.push_to_EHR({ id: PLACEHOLDER_ID }); }, { shouldError: true, onError: function (e) { return (e === null || e === void 0 ? void 0 : e.message) === 'Could not find a record for the given id'; } })];
            case 11:
                _l.sent();
                return [4 /*yield*/, async_test("Support phone numbers from Gambia", function () { return sdk.api.endusers.createOne({ phone: "+2201231234" }); }, { onResult: (function (e) { return !!sdk.api.endusers.deleteOne(e.id); }) })];
            case 12:
                _l.sent();
                return [4 /*yield*/, mfa_tests()];
            case 13:
                _l.sent();
                return [4 /*yield*/, setup_tests()];
            case 14:
                _l.sent();
                return [4 /*yield*/, multi_tenant_tests()]; // should come right after setup tests
            case 15:
                _l.sent(); // should come right after setup tests
                return [4 /*yield*/, sync_tests_with_access_tags()]; // should come directly after setup to avoid extra sync values
            case 16:
                _l.sent(); // should come directly after setup to avoid extra sync values
                return [4 /*yield*/, sync_tests()]; // should come directly after setup to avoid extra sync values
            case 17:
                _l.sent(); // should come directly after setup to avoid extra sync values
                return [4 /*yield*/, updatedAt_tests()];
            case 18:
                _l.sent();
                return [4 /*yield*/, automation_trigger_tests()];
            case 19:
                _l.sent();
                return [4 /*yield*/, file_source_tests()];
            case 20:
                _l.sent();
                return [4 /*yield*/, get_templated_message_tests()];
            case 21:
                _l.sent();
                return [4 /*yield*/, enduser_access_tags_tests()];
            case 22:
                _l.sent();
                return [4 /*yield*/, enduserAccessTests()];
            case 23:
                _l.sent();
                return [4 /*yield*/, test_form_response_search()];
            case 24:
                _l.sent();
                return [4 /*yield*/, date_parsing_tests()];
            case 25:
                _l.sent();
                return [4 /*yield*/, fromEmailOverride_tests()];
            case 26:
                _l.sent();
                return [4 /*yield*/, ticket_tests()];
            case 27:
                _l.sent();
                return [4 /*yield*/, uniqueness_tests()];
            case 28:
                _l.sent();
                return [4 /*yield*/, enduser_orders_tests()];
            case 29:
                _l.sent();
                return [4 /*yield*/, calendar_event_care_team_tests()];
            case 30:
                _l.sent();
                return [4 /*yield*/, merge_enduser_tests()];
            case 31:
                _l.sent();
                return [4 /*yield*/, input_modifier_tests()];
            case 32:
                _l.sent();
                return [4 /*yield*/, formsort_tests()];
            case 33:
                _l.sent();
                return [4 /*yield*/, switch_to_related_contacts_tests()];
            case 34:
                _l.sent();
                return [4 /*yield*/, redaction_tests()];
            case 35:
                _l.sent();
                return [4 /*yield*/, self_serve_appointment_booking_tests()];
            case 36:
                _l.sent();
                return [4 /*yield*/, no_chained_triggers_tests()];
            case 37:
                _l.sent();
                return [4 /*yield*/, rate_limit_tests()];
            case 38:
                _l.sent();
                return [4 /*yield*/, mdb_filter_tests()];
            case 39:
                _l.sent();
                return [4 /*yield*/, test_ticket_automation_assignment_and_optimization()];
            case 40:
                _l.sent();
                return [4 /*yield*/, superadmin_tests()];
            case 41:
                _l.sent();
                return [4 /*yield*/, ticket_queue_tests()];
            case 42:
                _l.sent();
                return [4 /*yield*/, vital_trigger_tests()];
            case 43:
                _l.sent();
                return [4 /*yield*/, close_reasons_no_duplicates_tests()];
            case 44:
                _l.sent();
                return [4 /*yield*/, register_as_enduser_tests()];
            case 45:
                _l.sent();
                return [4 /*yield*/, lockout_tests()];
            case 46:
                _l.sent();
                return [4 /*yield*/, delete_user_tests()
                    // await test_send_with_template()
                ];
            case 47:
                _l.sent();
                // await test_send_with_template()
                return [4 /*yield*/, bulk_read_tests()];
            case 48:
                // await test_send_with_template()
                _l.sent();
                return [4 /*yield*/, ticket_reminder_tests()];
            case 49:
                _l.sent();
                return [4 /*yield*/, marketing_email_unsubscribe_tests()];
            case 50:
                _l.sent();
                return [4 /*yield*/, unique_strings_tests()];
            case 51:
                _l.sent();
                return [4 /*yield*/, alternate_phones_tests()];
            case 52:
                _l.sent();
                return [4 /*yield*/, field_equals_trigger_tests()];
            case 53:
                _l.sent();
                return [4 /*yield*/, role_based_access_tests()];
            case 54:
                _l.sent();
                return [4 /*yield*/, enduser_session_tests()];
            case 55:
                _l.sent();
                return [4 /*yield*/, nextReminderInMS_tests()];
            case 56:
                _l.sent();
                return [4 /*yield*/, search_tests()];
            case 57:
                _l.sent();
                return [4 /*yield*/, wait_for_trigger_tests()];
            case 58:
                _l.sent();
                return [4 /*yield*/, pdf_generation()];
            case 59:
                _l.sent();
                return [4 /*yield*/, remove_from_journey_on_incoming_comms_tests().catch(console.error)]; // timing is unreliable, uncomment if changing logic
            case 60:
                _l.sent(); // timing is unreliable, uncomment if changing logic
                return [4 /*yield*/, auto_reply_tests()];
            case 61:
                _l.sent();
                return [4 /*yield*/, sub_organization_enduser_tests()];
            case 62:
                _l.sent();
                return [4 /*yield*/, sub_organization_tests()];
            case 63:
                _l.sent();
                return [4 /*yield*/, filter_by_date_tests()];
            case 64:
                _l.sent();
                return [4 /*yield*/, generate_user_auth_tests()];
            case 65:
                _l.sent();
                return [4 /*yield*/, generateEnduserAuthTests()];
            case 66:
                _l.sent();
                return [4 /*yield*/, public_form_tests()];
            case 67:
                _l.sent();
                return [4 /*yield*/, badInputTests()];
            case 68:
                _l.sent();
                return [4 /*yield*/, filterTests()];
            case 69:
                _l.sent();
                return [4 /*yield*/, updatesTests()];
            case 70:
                _l.sent();
                return [4 /*yield*/, threadKeyTests()];
            case 71:
                _l.sent();
                return [3 /*break*/, 73];
            case 72:
                err_1 = _l.sent();
                console.error("Failed during custom test");
                if (err_1.message && err_1.info) {
                    console.error(err_1.message, JSON.stringify(err_1.info, null, 2));
                }
                else {
                    console.error(err_1);
                }
                process.exit(1);
                return [3 /*break*/, 73];
            case 73:
                _a = schema;
                _b = [];
                for (_c in _a)
                    _b.push(_c);
                _i = 0;
                _l.label = 74;
            case 74:
                if (!(_i < _b.length)) return [3 /*break*/, 77];
                _c = _b[_i];
                if (!(_c in _a)) return [3 /*break*/, 76];
                n = _c;
                returnValidation = (_k = (_j = schema[n].customActions) === null || _j === void 0 ? void 0 : _j.create) === null || _k === void 0 ? void 0 : _k.returns;
                return [4 /*yield*/, run_generated_tests({
                        queries: sdk.api[n],
                        model: schema[n],
                        name: n,
                        returns: {
                            create: returnValidation // ModelFields<ClientModel>,
                        }
                    })];
            case 75:
                _l.sent();
                _l.label = 76;
            case 76:
                _i++;
                return [3 /*break*/, 74];
            case 77:
                _d = tests;
                _f = [];
                for (_g in _d)
                    _f.push(_g);
                _h = 0;
                _l.label = 78;
            case 78:
                if (!(_h < _f.length)) return [3 /*break*/, 83];
                _g = _f[_h];
                if (!(_g in _d)) return [3 /*break*/, 82];
                t = _g;
                _l.label = 79;
            case 79:
                _l.trys.push([79, 81, , 82]);
                return [4 /*yield*/, tests[t]()];
            case 80:
                _l.sent();
                return [3 /*break*/, 82];
            case 81:
                err_2 = _l.sent();
                console.error("Error running test:");
                console.error(err_2);
                process.exit(1);
                return [3 /*break*/, 82];
            case 82:
                _h++;
                return [3 /*break*/, 78];
            case 83:
                process.exit();
                return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=tests.js.map