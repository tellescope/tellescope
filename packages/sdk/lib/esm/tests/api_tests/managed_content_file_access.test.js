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
import * as buffer from 'buffer';
import { Session, EnduserSession } from "../../sdk";
import { async_test, log_header, } from "@tellescope/testing";
import { setup_tests } from "../setup";
var host = process.env.API_URL || 'http://localhost:8080';
var businessId = '60398b1131a295e64f084ff6';
/**
 * Tests for file_download_URL enduser access via managed content fallback.
 *
 * Verifies the backend fallback logic that allows endusers to access files
 * attached to managed content records they have access to, even when the
 * file itself does not have enduserId set or publicRead: true.
 */
export var managed_content_file_access_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        var contentRecordIds, assignmentIds, fileIds, testEnduserId, otherEnduserId, enduserSDK, otherEnduserSDK, uploadFile, testEnduser, otherEnduser, fileForAll_1, contentAll, fileForIndividual_1, contentIndividual, fileNoContent_1, fileWithEnduser_1, filePublic_1, _i, assignmentIds_1, assignmentId, _b, contentRecordIds_1, recordId, _c, fileIds_1, fileId, error_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    log_header("Managed Content File Access Tests");
                    contentRecordIds = [];
                    assignmentIds = [];
                    fileIds = [];
                    uploadFile = function (name, opts) {
                        if (opts === void 0) { opts = {}; }
                        return __awaiter(void 0, void 0, void 0, function () {
                            var buff, _a, presignedUpload, file;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        buff = buffer.Buffer.from("test file content for ".concat(name));
                                        return [4 /*yield*/, sdk.api.files.prepare_file_upload(__assign({ name: name, type: 'text/plain', size: buff.byteLength }, opts))];
                                    case 1:
                                        _a = _b.sent(), presignedUpload = _a.presignedUpload, file = _a.file;
                                        return [4 /*yield*/, sdk.UPLOAD(presignedUpload, buff)];
                                    case 2:
                                        _b.sent();
                                        return [4 /*yield*/, sdk.api.files.confirm_file_upload({ id: file.id })];
                                    case 3:
                                        _b.sent();
                                        fileIds.push(file.id);
                                        return [2 /*return*/, file];
                                }
                            });
                        });
                    };
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, , 21, 41]);
                    console.log("Setting up test data...");
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            email: "mcr_file_access_test_".concat(Date.now(), "@test.tellescope.com"),
                        })];
                case 2:
                    testEnduser = _d.sent();
                    testEnduserId = testEnduser.id;
                    return [4 /*yield*/, sdk.api.endusers.set_password({ id: testEnduser.id, password: 'TestPassword123!' })];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, sdk.api.endusers.createOne({
                            email: "mcr_file_access_other_".concat(Date.now(), "@test.tellescope.com"),
                        })];
                case 4:
                    otherEnduser = _d.sent();
                    otherEnduserId = otherEnduser.id;
                    return [4 /*yield*/, sdk.api.endusers.set_password({ id: otherEnduser.id, password: 'TestPassword123!' })];
                case 5:
                    _d.sent();
                    enduserSDK = new EnduserSession({ host: host, businessId: businessId });
                    return [4 /*yield*/, enduserSDK.authenticate(testEnduser.email, 'TestPassword123!')];
                case 6:
                    _d.sent();
                    otherEnduserSDK = new EnduserSession({ host: host, businessId: businessId });
                    return [4 /*yield*/, otherEnduserSDK.authenticate(otherEnduser.email, 'TestPassword123!')
                        // ===== Test 1: File attached to assignmentType: 'All' content - enduser CAN access =====
                    ];
                case 7:
                    _d.sent();
                    return [4 /*yield*/, uploadFile('mcr-file-all.txt')];
                case 8:
                    fileForAll_1 = _d.sent();
                    return [4 /*yield*/, sdk.api.managed_content_records.createOne({
                            title: 'MCR File Access - All',
                            htmlContent: '<p>All</p>',
                            textContent: 'All',
                            assignmentType: 'All',
                            attachments: [{ secureName: fileForAll_1.secureName, type: 'file', name: fileForAll_1.name }],
                        })];
                case 9:
                    contentAll = _d.sent();
                    contentRecordIds.push(contentAll.id);
                    return [4 /*yield*/, async_test('staff-uploaded file in assignmentType:All content - enduser CAN access', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, enduserSDK.api.files.file_download_URL({ secureName: fileForAll_1.secureName })];
                                    case 1:
                                        result = _a.sent();
                                        return [2 /*return*/, !!(result === null || result === void 0 ? void 0 : result.downloadURL)];
                                }
                            });
                        }); }, { onResult: function (r) { return r === true; } })
                        // ===== Test 2: File attached to Individual content for enduser A - enduser B CANNOT access =====
                    ];
                case 10:
                    _d.sent();
                    return [4 /*yield*/, uploadFile('mcr-file-individual.txt')];
                case 11:
                    fileForIndividual_1 = _d.sent();
                    return [4 /*yield*/, sdk.api.managed_content_records.createOne({
                            title: 'MCR File Access - Individual',
                            htmlContent: '<p>Individual</p>',
                            textContent: 'Individual',
                            enduserId: testEnduser.id,
                            attachments: [{ secureName: fileForIndividual_1.secureName, type: 'file', name: fileForIndividual_1.name }],
                        })];
                case 12:
                    contentIndividual = _d.sent();
                    contentRecordIds.push(contentIndividual.id);
                    return [4 /*yield*/, async_test('file attached to Individual content - assigned enduser CAN access', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, enduserSDK.api.files.file_download_URL({ secureName: fileForIndividual_1.secureName })];
                                    case 1:
                                        result = _a.sent();
                                        return [2 /*return*/, !!(result === null || result === void 0 ? void 0 : result.downloadURL)];
                                }
                            });
                        }); }, { onResult: function (r) { return r === true; } })];
                case 13:
                    _d.sent();
                    return [4 /*yield*/, async_test('file attached to Individual content - unassigned enduser CANNOT access', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var err_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, otherEnduserSDK.api.files.file_download_URL({ secureName: fileForIndividual_1.secureName })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/, false];
                                    case 2:
                                        err_1 = _a.sent();
                                        return [2 /*return*/, true];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }, { onResult: function (r) { return r === true; } })
                        // ===== Test 3: File not attached to any managed content - enduser CANNOT access =====
                    ];
                case 14:
                    _d.sent();
                    return [4 /*yield*/, uploadFile('mcr-file-no-content.txt')];
                case 15:
                    fileNoContent_1 = _d.sent();
                    return [4 /*yield*/, async_test('file not attached to any managed content - enduser CANNOT access', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var err_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, enduserSDK.api.files.file_download_URL({ secureName: fileNoContent_1.secureName })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/, false];
                                    case 2:
                                        err_2 = _a.sent();
                                        return [2 /*return*/, true];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }, { onResult: function (r) { return r === true; } })
                        // ===== Test 4: File with enduserId set - existing behavior preserved =====
                    ];
                case 16:
                    _d.sent();
                    return [4 /*yield*/, uploadFile('mcr-file-with-enduser.txt', { enduserId: testEnduser.id })];
                case 17:
                    fileWithEnduser_1 = _d.sent();
                    return [4 /*yield*/, async_test('file with enduserId set - enduser CAN access (no fallback needed)', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, enduserSDK.api.files.file_download_URL({ secureName: fileWithEnduser_1.secureName })];
                                    case 1:
                                        result = _a.sent();
                                        return [2 /*return*/, !!(result === null || result === void 0 ? void 0 : result.downloadURL)];
                                }
                            });
                        }); }, { onResult: function (r) { return r === true; } })
                        // ===== Test 5: File with publicRead: true - existing behavior preserved =====
                    ];
                case 18:
                    _d.sent();
                    return [4 /*yield*/, uploadFile('mcr-file-public.txt', { publicRead: true })];
                case 19:
                    filePublic_1 = _d.sent();
                    return [4 /*yield*/, async_test('file with publicRead - enduser CAN access', function () { return __awaiter(void 0, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, enduserSDK.api.files.file_download_URL({ secureName: filePublic_1.secureName })];
                                    case 1:
                                        result = _a.sent();
                                        return [2 /*return*/, !!(result === null || result === void 0 ? void 0 : result.downloadURL)];
                                }
                            });
                        }); }, { onResult: function (r) { return r === true; } })];
                case 20:
                    _d.sent();
                    console.log("All Managed Content File Access tests passed!");
                    return [3 /*break*/, 41];
                case 21:
                    console.log("Cleaning up test data...");
                    _d.label = 22;
                case 22:
                    _d.trys.push([22, 39, , 40]);
                    _i = 0, assignmentIds_1 = assignmentIds;
                    _d.label = 23;
                case 23:
                    if (!(_i < assignmentIds_1.length)) return [3 /*break*/, 26];
                    assignmentId = assignmentIds_1[_i];
                    return [4 /*yield*/, sdk.api.managed_content_record_assignments.deleteOne(assignmentId).catch(function () { })];
                case 24:
                    _d.sent();
                    _d.label = 25;
                case 25:
                    _i++;
                    return [3 /*break*/, 23];
                case 26:
                    _b = 0, contentRecordIds_1 = contentRecordIds;
                    _d.label = 27;
                case 27:
                    if (!(_b < contentRecordIds_1.length)) return [3 /*break*/, 30];
                    recordId = contentRecordIds_1[_b];
                    return [4 /*yield*/, sdk.api.managed_content_records.deleteOne(recordId).catch(function () { })];
                case 28:
                    _d.sent();
                    _d.label = 29;
                case 29:
                    _b++;
                    return [3 /*break*/, 27];
                case 30:
                    _c = 0, fileIds_1 = fileIds;
                    _d.label = 31;
                case 31:
                    if (!(_c < fileIds_1.length)) return [3 /*break*/, 34];
                    fileId = fileIds_1[_c];
                    return [4 /*yield*/, sdk.api.files.deleteOne(fileId).catch(function () { })];
                case 32:
                    _d.sent();
                    _d.label = 33;
                case 33:
                    _c++;
                    return [3 /*break*/, 31];
                case 34:
                    if (!testEnduserId) return [3 /*break*/, 36];
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(testEnduserId).catch(function () { })];
                case 35:
                    _d.sent();
                    _d.label = 36;
                case 36:
                    if (!otherEnduserId) return [3 /*break*/, 38];
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(otherEnduserId).catch(function () { })];
                case 37:
                    _d.sent();
                    _d.label = 38;
                case 38:
                    console.log("Cleanup completed");
                    return [3 /*break*/, 40];
                case 39:
                    error_1 = _d.sent();
                    console.error('Cleanup error:', error_1);
                    return [3 /*break*/, 40];
                case 40: return [7 /*endfinally*/];
                case 41: return [2 /*return*/];
            }
        });
    });
};
if (require.main === module) {
    console.log("Using API URL: ".concat(host));
    var sdk_1 = new Session({ host: host });
    var sdkNonAdmin_1 = new Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setup_tests(sdk_1, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, managed_content_file_access_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("Managed content file access test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("Managed content file access test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=managed_content_file_access.test.js.map