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
/**
 * Helper: Create a form with auto-merge enabled and intake fields
 */
var createAutoMergeForm = function (sdk, autoMergeOnSubmission) {
    if (autoMergeOnSubmission === void 0) { autoMergeOnSubmission = true; }
    return __awaiter(void 0, void 0, void 0, function () {
        var form, fnameField, lnameField, emailField, phoneField, dobField, fields;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sdk.api.forms.createOne({
                        title: 'Auto Merge Test Form',
                        allowPublicURL: true,
                        autoMergeOnSubmission: autoMergeOnSubmission,
                    })
                    // Add intake fields - must create sequentially due to previousFields dependencies
                ];
                case 1:
                    form = _a.sent();
                    return [4 /*yield*/, sdk.api.form_fields.createOne({
                            formId: form.id,
                            title: 'First Name',
                            type: 'string',
                            intakeField: 'fname',
                            previousFields: [{ type: 'root', info: {} }]
                        })];
                case 2:
                    fnameField = _a.sent();
                    return [4 /*yield*/, sdk.api.form_fields.createOne({
                            formId: form.id,
                            title: 'Last Name',
                            type: 'string',
                            intakeField: 'lname',
                            previousFields: [{ type: 'after', info: { fieldId: fnameField.id } }]
                        })];
                case 3:
                    lnameField = _a.sent();
                    return [4 /*yield*/, sdk.api.form_fields.createOne({
                            formId: form.id,
                            title: 'Email',
                            type: 'email',
                            intakeField: 'email',
                            previousFields: [{ type: 'after', info: { fieldId: lnameField.id } }]
                        })];
                case 4:
                    emailField = _a.sent();
                    return [4 /*yield*/, sdk.api.form_fields.createOne({
                            formId: form.id,
                            title: 'Phone',
                            type: 'phone',
                            intakeField: 'phone',
                            previousFields: [{ type: 'after', info: { fieldId: emailField.id } }]
                        })];
                case 5:
                    phoneField = _a.sent();
                    return [4 /*yield*/, sdk.api.form_fields.createOne({
                            formId: form.id,
                            title: 'Date of Birth',
                            type: 'dateString',
                            intakeField: 'dateOfBirth',
                            previousFields: [{ type: 'after', info: { fieldId: phoneField.id } }]
                        })];
                case 6:
                    dobField = _a.sent();
                    fields = [fnameField, lnameField, emailField, phoneField, dobField];
                    return [2 /*return*/, { form: form, fields: fields }];
            }
        });
    });
};
/**
 * Helper: Submit a public form with skipMatch and get the created enduser ID
 */
var submitPublicFormWithSkipMatch = function (form, fields, values) { return __awaiter(void 0, void 0, void 0, function () {
    var enduserSDK, _a, authToken, accessCode, enduserId, authedSDK, responses, fnameField, lnameField, emailField, phoneField, dobField;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                enduserSDK = new EnduserSession({ host: host, businessId: form.businessId });
                return [4 /*yield*/, enduserSDK.api.form_responses.session_for_public_form({
                        formId: form.id,
                        businessId: form.businessId,
                        skipMatch: true,
                    })];
            case 1:
                _a = _b.sent(), authToken = _a.authToken, accessCode = _a.accessCode, enduserId = _a.enduserId;
                authedSDK = new EnduserSession({ host: host, businessId: form.businessId, authToken: authToken });
                responses = [];
                fnameField = fields.find(function (f) { return f.intakeField === 'fname'; });
                lnameField = fields.find(function (f) { return f.intakeField === 'lname'; });
                emailField = fields.find(function (f) { return f.intakeField === 'email'; });
                phoneField = fields.find(function (f) { return f.intakeField === 'phone'; });
                dobField = fields.find(function (f) { return f.intakeField === 'dateOfBirth'; });
                if (values.fname && fnameField) {
                    responses.push({ fieldId: fnameField.id, fieldTitle: fnameField.title, answer: { type: 'string', value: values.fname } });
                }
                if (values.lname && lnameField) {
                    responses.push({ fieldId: lnameField.id, fieldTitle: lnameField.title, answer: { type: 'string', value: values.lname } });
                }
                if (values.email && emailField) {
                    responses.push({ fieldId: emailField.id, fieldTitle: emailField.title, answer: { type: 'email', value: values.email } });
                }
                if (values.phone && phoneField) {
                    responses.push({ fieldId: phoneField.id, fieldTitle: phoneField.title, answer: { type: 'phone', value: values.phone } });
                }
                if (values.dateOfBirth && dobField) {
                    responses.push({ fieldId: dobField.id, fieldTitle: dobField.title, answer: { type: 'dateString', value: values.dateOfBirth } });
                }
                return [4 /*yield*/, authedSDK.api.form_responses.submit_form_response({
                        accessCode: accessCode,
                        responses: responses,
                    })];
            case 2:
                _b.sent();
                return [2 /*return*/, { enduserId: enduserId, accessCode: accessCode, authedSDK: authedSDK }];
        }
    });
}); };
/**
 * Helper: Check if enduser has been deleted (immediate check, no polling)
 * Since auto-merge is now synchronous, we don't need to poll
 */
var isEnduserDeleted = function (sdk, enduserId) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, sdk.api.endusers.getOne(enduserId)];
            case 1:
                _b.sent();
                return [2 /*return*/, false]; // Still exists
            case 2:
                _a = _b.sent();
                return [2 /*return*/, true]; // Deleted
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * Main test function that can be called independently or as part of the test suite
 */
export var auto_merge_form_submission_tests = function (_a) {
    var sdk = _a.sdk, sdkNonAdmin = _a.sdkNonAdmin;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_header("Auto-Merge Form Submission Tests");
                    // Test 1: Happy Path - Merge by Email Match
                    return [4 /*yield*/, async_test("Auto-merge: Merge occurs when matching by email", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var testEmail, destination, _a, form, fields, sourceId, sourceDeleted, updatedDestination, formResponses;
                            var _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        testEmail = "automerge.email.".concat(Date.now(), "@test.com");
                                        return [4 /*yield*/, sdk.api.endusers.createOne({
                                                fname: 'John',
                                                lname: 'Doe',
                                                email: testEmail
                                            })];
                                    case 1:
                                        destination = _c.sent();
                                        return [4 /*yield*/, createAutoMergeForm(sdk, true)];
                                    case 2:
                                        _a = _c.sent(), form = _a.form, fields = _a.fields;
                                        return [4 /*yield*/, submitPublicFormWithSkipMatch(form, fields, {
                                                fname: 'John',
                                                lname: 'Doe',
                                                email: testEmail,
                                            })
                                            // Merge is synchronous - source should be deleted immediately after submission
                                        ];
                                    case 3:
                                        sourceId = (_c.sent()).enduserId;
                                        return [4 /*yield*/, isEnduserDeleted(sdk, sourceId)];
                                    case 4:
                                        sourceDeleted = _c.sent();
                                        return [4 /*yield*/, sdk.api.endusers.getOne(destination.id)];
                                    case 5:
                                        updatedDestination = _c.sent();
                                        return [4 /*yield*/, sdk.api.form_responses.getSome({ filter: { enduserId: destination.id } })
                                            // Cleanup
                                        ];
                                    case 6:
                                        formResponses = _c.sent();
                                        // Cleanup
                                        return [4 /*yield*/, sdk.api.forms.deleteOne(form.id)];
                                    case 7:
                                        // Cleanup
                                        _c.sent();
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(destination.id)];
                                    case 8:
                                        _c.sent();
                                        return [2 /*return*/, sourceDeleted
                                                && ((_b = updatedDestination.mergedIds) === null || _b === void 0 ? void 0 : _b.includes(sourceId))
                                                && formResponses.length === 1];
                                }
                            });
                        }); }, { expectedResult: true })
                        // Test 2: Happy Path - Merge by Phone Match
                    ];
                case 1:
                    // Test 1: Happy Path - Merge by Email Match
                    _b.sent();
                    // Test 2: Happy Path - Merge by Phone Match
                    return [4 /*yield*/, async_test("Auto-merge: Merge occurs when matching by phone", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var testPhone, destination, _a, form, fields, sourceId, sourceDeleted, updatedDestination;
                            var _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        testPhone = '+15555551234';
                                        return [4 /*yield*/, sdk.api.endusers.createOne({
                                                fname: 'Jane',
                                                lname: 'Smith',
                                                phone: testPhone
                                            })];
                                    case 1:
                                        destination = _c.sent();
                                        return [4 /*yield*/, createAutoMergeForm(sdk, true)];
                                    case 2:
                                        _a = _c.sent(), form = _a.form, fields = _a.fields;
                                        return [4 /*yield*/, submitPublicFormWithSkipMatch(form, fields, {
                                                fname: 'Jane',
                                                lname: 'Smith',
                                                phone: testPhone,
                                            })
                                            // Merge is synchronous - source should be deleted immediately after submission
                                        ];
                                    case 3:
                                        sourceId = (_c.sent()).enduserId;
                                        return [4 /*yield*/, isEnduserDeleted(sdk, sourceId)];
                                    case 4:
                                        sourceDeleted = _c.sent();
                                        return [4 /*yield*/, sdk.api.endusers.getOne(destination.id)
                                            // Cleanup
                                        ];
                                    case 5:
                                        updatedDestination = _c.sent();
                                        // Cleanup
                                        return [4 /*yield*/, sdk.api.forms.deleteOne(form.id)];
                                    case 6:
                                        // Cleanup
                                        _c.sent();
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(destination.id)];
                                    case 7:
                                        _c.sent();
                                        return [2 /*return*/, sourceDeleted && ((_b = updatedDestination.mergedIds) === null || _b === void 0 ? void 0 : _b.includes(sourceId))];
                                }
                            });
                        }); }, { expectedResult: true })
                        // Test 3: Happy Path - Merge by DateOfBirth Match
                    ];
                case 2:
                    // Test 2: Happy Path - Merge by Phone Match
                    _b.sent();
                    // Test 3: Happy Path - Merge by DateOfBirth Match
                    return [4 /*yield*/, async_test("Auto-merge: Merge occurs when matching by dateOfBirth", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var testDOB, destination, _a, form, fields, sourceId, sourceDeleted, updatedDestination;
                            var _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        testDOB = '1990-05-15';
                                        return [4 /*yield*/, sdk.api.endusers.createOne({
                                                fname: 'Bob',
                                                lname: 'Johnson',
                                                dateOfBirth: testDOB
                                            })];
                                    case 1:
                                        destination = _c.sent();
                                        return [4 /*yield*/, createAutoMergeForm(sdk, true)];
                                    case 2:
                                        _a = _c.sent(), form = _a.form, fields = _a.fields;
                                        return [4 /*yield*/, submitPublicFormWithSkipMatch(form, fields, {
                                                fname: 'Bob',
                                                lname: 'Johnson',
                                                dateOfBirth: testDOB,
                                            })
                                            // Merge is synchronous - source should be deleted immediately after submission
                                        ];
                                    case 3:
                                        sourceId = (_c.sent()).enduserId;
                                        return [4 /*yield*/, isEnduserDeleted(sdk, sourceId)];
                                    case 4:
                                        sourceDeleted = _c.sent();
                                        return [4 /*yield*/, sdk.api.endusers.getOne(destination.id)
                                            // Cleanup
                                        ];
                                    case 5:
                                        updatedDestination = _c.sent();
                                        // Cleanup
                                        return [4 /*yield*/, sdk.api.forms.deleteOne(form.id)];
                                    case 6:
                                        // Cleanup
                                        _c.sent();
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(destination.id)];
                                    case 7:
                                        _c.sent();
                                        return [2 /*return*/, sourceDeleted && ((_b = updatedDestination.mergedIds) === null || _b === void 0 ? void 0 : _b.includes(sourceId))];
                                }
                            });
                        }); }, { expectedResult: true })
                        // Test 4: No Merge - Multiple Matches
                    ];
                case 3:
                    // Test 3: Happy Path - Merge by DateOfBirth Match
                    _b.sent();
                    // Test 4: No Merge - Multiple Matches
                    return [4 /*yield*/, async_test("Auto-merge: No merge when multiple matches found", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var testDOB, destination1, destination2, _a, form, fields, sourceId, sourceDeleted, dest1, dest2;
                            var _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        testDOB = '1975-01-15';
                                        return [4 /*yield*/, sdk.api.endusers.createOne({
                                                fname: 'Multi',
                                                lname: 'Match',
                                                dateOfBirth: testDOB
                                            })];
                                    case 1:
                                        destination1 = _d.sent();
                                        return [4 /*yield*/, sdk.api.endusers.createOne({
                                                fname: 'Multi',
                                                lname: 'Match',
                                                dateOfBirth: testDOB
                                            })];
                                    case 2:
                                        destination2 = _d.sent();
                                        return [4 /*yield*/, createAutoMergeForm(sdk, true)];
                                    case 3:
                                        _a = _d.sent(), form = _a.form, fields = _a.fields;
                                        return [4 /*yield*/, submitPublicFormWithSkipMatch(form, fields, {
                                                fname: 'Multi',
                                                lname: 'Match',
                                                dateOfBirth: testDOB,
                                            })
                                            // Merge is synchronous - no need to wait, source should still exist
                                        ];
                                    case 4:
                                        sourceId = (_d.sent()).enduserId;
                                        return [4 /*yield*/, isEnduserDeleted(sdk, sourceId)];
                                    case 5:
                                        sourceDeleted = _d.sent();
                                        return [4 /*yield*/, sdk.api.endusers.getOne(destination1.id)];
                                    case 6:
                                        dest1 = _d.sent();
                                        return [4 /*yield*/, sdk.api.endusers.getOne(destination2.id)
                                            // Cleanup
                                        ];
                                    case 7:
                                        dest2 = _d.sent();
                                        // Cleanup
                                        return [4 /*yield*/, sdk.api.forms.deleteOne(form.id)];
                                    case 8:
                                        // Cleanup
                                        _d.sent();
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(destination1.id)];
                                    case 9:
                                        _d.sent();
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(destination2.id)];
                                    case 10:
                                        _d.sent();
                                        if (!!sourceDeleted) return [3 /*break*/, 12];
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(sourceId)];
                                    case 11:
                                        _d.sent();
                                        _d.label = 12;
                                    case 12: return [2 /*return*/, !sourceDeleted // Source should NOT be deleted
                                            && !((_b = dest1.mergedIds) === null || _b === void 0 ? void 0 : _b.includes(sourceId))
                                            && !((_c = dest2.mergedIds) === null || _c === void 0 ? void 0 : _c.includes(sourceId))];
                                }
                            });
                        }); }, { expectedResult: true })
                        // Test 5: No Merge - autoMergeOnSubmission Disabled
                    ];
                case 4:
                    // Test 4: No Merge - Multiple Matches
                    _b.sent();
                    // Test 5: No Merge - autoMergeOnSubmission Disabled
                    return [4 /*yield*/, async_test("Auto-merge: No merge when autoMergeOnSubmission is disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var testEmail, destination, _a, form, fields, sourceId, sourceDeleted;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        testEmail = "automerge.disabled.".concat(Date.now(), "@test.com");
                                        return [4 /*yield*/, sdk.api.endusers.createOne({
                                                fname: 'Disabled',
                                                lname: 'Test',
                                                email: testEmail
                                            })];
                                    case 1:
                                        destination = _b.sent();
                                        return [4 /*yield*/, createAutoMergeForm(sdk, false)]; // Disabled
                                    case 2:
                                        _a = _b.sent() // Disabled
                                        , form = _a.form, fields = _a.fields;
                                        return [4 /*yield*/, submitPublicFormWithSkipMatch(form, fields, {
                                                fname: 'Disabled',
                                                lname: 'Test',
                                                email: testEmail,
                                            })
                                            // Merge is synchronous - no need to wait, source should still exist
                                        ];
                                    case 3:
                                        sourceId = (_b.sent()).enduserId;
                                        return [4 /*yield*/, isEnduserDeleted(sdk, sourceId)
                                            // Cleanup
                                        ];
                                    case 4:
                                        sourceDeleted = _b.sent();
                                        // Cleanup
                                        return [4 /*yield*/, sdk.api.forms.deleteOne(form.id)];
                                    case 5:
                                        // Cleanup
                                        _b.sent();
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(destination.id)];
                                    case 6:
                                        _b.sent();
                                        if (!!sourceDeleted) return [3 /*break*/, 8];
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(sourceId)];
                                    case 7:
                                        _b.sent();
                                        _b.label = 8;
                                    case 8: return [2 /*return*/, !sourceDeleted]; // Source should NOT be deleted
                                }
                            });
                        }); }, { expectedResult: true })
                        // Test 6: No Merge - No Matching Enduser
                    ];
                case 5:
                    // Test 5: No Merge - autoMergeOnSubmission Disabled
                    _b.sent();
                    // Test 6: No Merge - No Matching Enduser
                    return [4 /*yield*/, async_test("Auto-merge: No merge when no matching enduser exists", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a, form, fields, sourceId, sourceDeleted;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, createAutoMergeForm(sdk, true)];
                                    case 1:
                                        _a = _b.sent(), form = _a.form, fields = _a.fields;
                                        return [4 /*yield*/, submitPublicFormWithSkipMatch(form, fields, {
                                                fname: 'NoMatch',
                                                lname: 'Person',
                                                email: "nomatch.".concat(Date.now(), "@test.com"),
                                            })
                                            // Merge is synchronous - no need to wait, source should still exist (no match found)
                                        ];
                                    case 2:
                                        sourceId = (_b.sent()).enduserId;
                                        return [4 /*yield*/, isEnduserDeleted(sdk, sourceId)
                                            // Cleanup
                                        ];
                                    case 3:
                                        sourceDeleted = _b.sent();
                                        // Cleanup
                                        return [4 /*yield*/, sdk.api.forms.deleteOne(form.id)];
                                    case 4:
                                        // Cleanup
                                        _b.sent();
                                        if (!!sourceDeleted) return [3 /*break*/, 6];
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(sourceId)];
                                    case 5:
                                        _b.sent();
                                        _b.label = 6;
                                    case 6: return [2 /*return*/, !sourceDeleted]; // Source should NOT be deleted
                                }
                            });
                        }); }, { expectedResult: true })
                        // Test 7: Case Sensitive Matching - No Merge When Case Differs
                    ];
                case 6:
                    // Test 6: No Merge - No Matching Enduser
                    _b.sent();
                    // Test 7: Case Sensitive Matching - No Merge When Case Differs
                    return [4 /*yield*/, async_test("Auto-merge: No merge when case differs (case-sensitive matching)", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var testEmail, destination, _a, form, fields, sourceId, sourceDeleted, updatedDestination;
                            var _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        testEmail = "automerge.case.".concat(Date.now(), "@test.com");
                                        return [4 /*yield*/, sdk.api.endusers.createOne({
                                                fname: 'Case',
                                                lname: 'Test',
                                                email: testEmail
                                            })];
                                    case 1:
                                        destination = _c.sent();
                                        return [4 /*yield*/, createAutoMergeForm(sdk, true)
                                            // Submit with different case - should NOT match due to case-sensitive matching
                                        ];
                                    case 2:
                                        _a = _c.sent(), form = _a.form, fields = _a.fields;
                                        return [4 /*yield*/, submitPublicFormWithSkipMatch(form, fields, {
                                                fname: 'CASE',
                                                lname: 'TEST',
                                                email: testEmail.toUpperCase(), // Different case
                                            })
                                            // Merge is case-sensitive - source should still exist (no match found)
                                        ];
                                    case 3:
                                        sourceId = (_c.sent()).enduserId;
                                        return [4 /*yield*/, isEnduserDeleted(sdk, sourceId)];
                                    case 4:
                                        sourceDeleted = _c.sent();
                                        return [4 /*yield*/, sdk.api.endusers.getOne(destination.id)
                                            // Cleanup
                                        ];
                                    case 5:
                                        updatedDestination = _c.sent();
                                        // Cleanup
                                        return [4 /*yield*/, sdk.api.forms.deleteOne(form.id)];
                                    case 6:
                                        // Cleanup
                                        _c.sent();
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(destination.id)];
                                    case 7:
                                        _c.sent();
                                        if (!!sourceDeleted) return [3 /*break*/, 9];
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(sourceId)];
                                    case 8:
                                        _c.sent();
                                        _c.label = 9;
                                    case 9: return [2 /*return*/, !sourceDeleted // Source should NOT be deleted (no merge)
                                            && !((_b = updatedDestination.mergedIds) === null || _b === void 0 ? void 0 : _b.includes(sourceId))];
                                }
                            });
                        }); }, { expectedResult: true })
                        // Test 8: eligibleForAutoMerge Flag Verification
                    ];
                case 7:
                    // Test 7: Case Sensitive Matching - No Merge When Case Differs
                    _b.sent();
                    // Test 8: eligibleForAutoMerge Flag Verification
                    return [4 /*yield*/, async_test("Auto-merge: eligibleForAutoMerge flag is set correctly", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a, formEnabled, fieldsEnabled, enduserSDKEnabled, enabledEnduserId, enabledEnduser, _b, formDisabled, fieldsDisabled, enduserSDKDisabled, disabledEnduserId, disabledEnduser;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, createAutoMergeForm(sdk, true)];
                                    case 1:
                                        _a = _c.sent(), formEnabled = _a.form, fieldsEnabled = _a.fields;
                                        enduserSDKEnabled = new EnduserSession({ host: host, businessId: formEnabled.businessId });
                                        return [4 /*yield*/, enduserSDKEnabled.api.form_responses.session_for_public_form({
                                                formId: formEnabled.id,
                                                businessId: formEnabled.businessId,
                                                skipMatch: true,
                                            })];
                                    case 2:
                                        enabledEnduserId = (_c.sent()).enduserId;
                                        return [4 /*yield*/, sdk.api.endusers.getOne(enabledEnduserId)
                                            // Form with autoMergeOnSubmission: false
                                        ];
                                    case 3:
                                        enabledEnduser = _c.sent();
                                        return [4 /*yield*/, createAutoMergeForm(sdk, false)];
                                    case 4:
                                        _b = _c.sent(), formDisabled = _b.form, fieldsDisabled = _b.fields;
                                        enduserSDKDisabled = new EnduserSession({ host: host, businessId: formDisabled.businessId });
                                        return [4 /*yield*/, enduserSDKDisabled.api.form_responses.session_for_public_form({
                                                formId: formDisabled.id,
                                                businessId: formDisabled.businessId,
                                                skipMatch: true,
                                            })];
                                    case 5:
                                        disabledEnduserId = (_c.sent()).enduserId;
                                        return [4 /*yield*/, sdk.api.endusers.getOne(disabledEnduserId)
                                            // Cleanup
                                        ];
                                    case 6:
                                        disabledEnduser = _c.sent();
                                        // Cleanup
                                        return [4 /*yield*/, sdk.api.forms.deleteOne(formEnabled.id)];
                                    case 7:
                                        // Cleanup
                                        _c.sent();
                                        return [4 /*yield*/, sdk.api.forms.deleteOne(formDisabled.id)];
                                    case 8:
                                        _c.sent();
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(enabledEnduserId)];
                                    case 9:
                                        _c.sent();
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(disabledEnduserId)];
                                    case 10:
                                        _c.sent();
                                        return [2 /*return*/, enabledEnduser.eligibleForAutoMerge === true
                                                && disabledEnduser.eligibleForAutoMerge !== true];
                                }
                            });
                        }); }, { expectedResult: true })
                        // Test 9: Files Transfer on Merge
                    ];
                case 8:
                    // Test 8: eligibleForAutoMerge Flag Verification
                    _b.sent();
                    // Test 9: Files Transfer on Merge
                    return [4 /*yield*/, async_test("Auto-merge: Files are transferred to destination enduser", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var testEmail, destination, _a, form, fields, enduserSDK, _b, authToken, accessCode, sourceId, buff, _c, presignedUpload, file, authedSDK, fnameField, lnameField, emailField, sourceDeleted, updatedFile;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        testEmail = "automerge.files.".concat(Date.now(), "@test.com");
                                        return [4 /*yield*/, sdk.api.endusers.createOne({
                                                fname: 'Files',
                                                lname: 'Test',
                                                email: testEmail
                                            })];
                                    case 1:
                                        destination = _d.sent();
                                        return [4 /*yield*/, createAutoMergeForm(sdk, true)
                                            // Create public session to get source enduser
                                        ];
                                    case 2:
                                        _a = _d.sent(), form = _a.form, fields = _a.fields;
                                        enduserSDK = new EnduserSession({ host: host, businessId: form.businessId });
                                        return [4 /*yield*/, enduserSDK.api.form_responses.session_for_public_form({
                                                formId: form.id,
                                                businessId: form.businessId,
                                                skipMatch: true,
                                            })
                                            // Create a file for the source enduser using prepare_file_upload + UPLOAD
                                        ];
                                    case 3:
                                        _b = _d.sent(), authToken = _b.authToken, accessCode = _b.accessCode, sourceId = _b.enduserId;
                                        buff = buffer.Buffer.from('test file data for auto-merge');
                                        return [4 /*yield*/, sdk.api.files.prepare_file_upload({
                                                name: 'test-file.txt',
                                                type: 'text/plain',
                                                size: buff.byteLength,
                                                enduserId: sourceId,
                                            })];
                                    case 4:
                                        _c = _d.sent(), presignedUpload = _c.presignedUpload, file = _c.file;
                                        return [4 /*yield*/, sdk.UPLOAD(presignedUpload, buff)
                                            // Now submit the form to trigger merge
                                        ];
                                    case 5:
                                        _d.sent();
                                        authedSDK = new EnduserSession({ host: host, businessId: form.businessId, authToken: authToken });
                                        fnameField = fields.find(function (f) { return f.intakeField === 'fname'; });
                                        lnameField = fields.find(function (f) { return f.intakeField === 'lname'; });
                                        emailField = fields.find(function (f) { return f.intakeField === 'email'; });
                                        return [4 /*yield*/, authedSDK.api.form_responses.submit_form_response({
                                                accessCode: accessCode,
                                                responses: [
                                                    { fieldId: fnameField.id, fieldTitle: fnameField.title, answer: { type: 'string', value: 'Files' } },
                                                    { fieldId: lnameField.id, fieldTitle: lnameField.title, answer: { type: 'string', value: 'Test' } },
                                                    { fieldId: emailField.id, fieldTitle: emailField.title, answer: { type: 'email', value: testEmail } },
                                                ],
                                            })
                                            // Merge is synchronous - source should be deleted immediately after submission
                                        ];
                                    case 6:
                                        _d.sent();
                                        return [4 /*yield*/, isEnduserDeleted(sdk, sourceId)];
                                    case 7:
                                        sourceDeleted = _d.sent();
                                        return [4 /*yield*/, sdk.api.files.getOne(file.id)
                                            // Cleanup
                                        ];
                                    case 8:
                                        updatedFile = _d.sent();
                                        // Cleanup
                                        return [4 /*yield*/, sdk.api.forms.deleteOne(form.id)];
                                    case 9:
                                        // Cleanup
                                        _d.sent();
                                        return [4 /*yield*/, sdk.api.files.deleteOne(file.id)];
                                    case 10:
                                        _d.sent();
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(destination.id)];
                                    case 11:
                                        _d.sent();
                                        return [2 /*return*/, sourceDeleted && updatedFile.enduserId === destination.id];
                                }
                            });
                        }); }, { expectedResult: true })
                        // Test 10: Calendar Events Transfer on Merge
                    ];
                case 9:
                    // Test 9: Files Transfer on Merge
                    _b.sent();
                    // Test 10: Calendar Events Transfer on Merge
                    return [4 /*yield*/, async_test("Auto-merge: Calendar events are transferred to destination enduser", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var testEmail, destination, _a, form, fields, enduserSDK, _b, authToken, accessCode, sourceId, event, authedSDK, fnameField, lnameField, emailField, sourceDeleted, updatedEvent;
                            var _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        testEmail = "automerge.events.".concat(Date.now(), "@test.com");
                                        return [4 /*yield*/, sdk.api.endusers.createOne({
                                                fname: 'Events',
                                                lname: 'Test',
                                                email: testEmail
                                            })];
                                    case 1:
                                        destination = _d.sent();
                                        return [4 /*yield*/, createAutoMergeForm(sdk, true)
                                            // Create public session to get source enduser
                                        ];
                                    case 2:
                                        _a = _d.sent(), form = _a.form, fields = _a.fields;
                                        enduserSDK = new EnduserSession({ host: host, businessId: form.businessId });
                                        return [4 /*yield*/, enduserSDK.api.form_responses.session_for_public_form({
                                                formId: form.id,
                                                businessId: form.businessId,
                                                skipMatch: true,
                                            })
                                            // Create a calendar event with source enduser as attendee
                                        ];
                                    case 3:
                                        _b = _d.sent(), authToken = _b.authToken, accessCode = _b.accessCode, sourceId = _b.enduserId;
                                        return [4 /*yield*/, sdk.api.calendar_events.createOne({
                                                title: 'Test Event',
                                                startTimeInMS: Date.now() + 86400000,
                                                durationInMinutes: 30,
                                                attendees: [{ id: sourceId, type: 'enduser' }],
                                            })
                                            // Now submit the form to trigger merge
                                        ];
                                    case 4:
                                        event = _d.sent();
                                        authedSDK = new EnduserSession({ host: host, businessId: form.businessId, authToken: authToken });
                                        fnameField = fields.find(function (f) { return f.intakeField === 'fname'; });
                                        lnameField = fields.find(function (f) { return f.intakeField === 'lname'; });
                                        emailField = fields.find(function (f) { return f.intakeField === 'email'; });
                                        return [4 /*yield*/, authedSDK.api.form_responses.submit_form_response({
                                                accessCode: accessCode,
                                                responses: [
                                                    { fieldId: fnameField.id, fieldTitle: fnameField.title, answer: { type: 'string', value: 'Events' } },
                                                    { fieldId: lnameField.id, fieldTitle: lnameField.title, answer: { type: 'string', value: 'Test' } },
                                                    { fieldId: emailField.id, fieldTitle: emailField.title, answer: { type: 'email', value: testEmail } },
                                                ],
                                            })
                                            // Merge is synchronous - source should be deleted immediately after submission
                                        ];
                                    case 5:
                                        _d.sent();
                                        return [4 /*yield*/, isEnduserDeleted(sdk, sourceId)];
                                    case 6:
                                        sourceDeleted = _d.sent();
                                        return [4 /*yield*/, sdk.api.calendar_events.getOne(event.id)
                                            // Cleanup
                                        ];
                                    case 7:
                                        updatedEvent = _d.sent();
                                        // Cleanup
                                        return [4 /*yield*/, sdk.api.forms.deleteOne(form.id)];
                                    case 8:
                                        // Cleanup
                                        _d.sent();
                                        return [4 /*yield*/, sdk.api.calendar_events.deleteOne(event.id)];
                                    case 9:
                                        _d.sent();
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(destination.id)];
                                    case 10:
                                        _d.sent();
                                        return [2 /*return*/, sourceDeleted && ((_c = updatedEvent.attendees) === null || _c === void 0 ? void 0 : _c.some(function (a) { return a.id === destination.id; }))];
                                }
                            });
                        }); }, { expectedResult: true })
                        // Test 11: Form response enduserId is updated to destination (placeholder is updated before submission completes)
                    ];
                case 10:
                    // Test 10: Calendar Events Transfer on Merge
                    _b.sent();
                    // Test 11: Form response enduserId is updated to destination (placeholder is updated before submission completes)
                    return [4 /*yield*/, async_test("Auto-merge: Form response enduserId is updated to destination", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var testEmail, destination, _a, form, fields, _b, sourceId, accessCode, sourceDeleted, formResponses, createdFormResponse;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        testEmail = "automerge.directfr.".concat(Date.now(), "@test.com");
                                        return [4 /*yield*/, sdk.api.endusers.createOne({
                                                fname: 'Direct',
                                                lname: 'Response',
                                                email: testEmail
                                            })];
                                    case 1:
                                        destination = _c.sent();
                                        return [4 /*yield*/, createAutoMergeForm(sdk, true)];
                                    case 2:
                                        _a = _c.sent(), form = _a.form, fields = _a.fields;
                                        return [4 /*yield*/, submitPublicFormWithSkipMatch(form, fields, {
                                                fname: 'Direct',
                                                lname: 'Response',
                                                email: testEmail,
                                            })
                                            // Merge is synchronous - verify form response was created with destination ID
                                        ];
                                    case 3:
                                        _b = _c.sent(), sourceId = _b.enduserId, accessCode = _b.accessCode;
                                        return [4 /*yield*/, isEnduserDeleted(sdk, sourceId)
                                            // Get form responses by accessCode to find the one we created
                                        ];
                                    case 4:
                                        sourceDeleted = _c.sent();
                                        return [4 /*yield*/, sdk.api.form_responses.getSome({ filter: { accessCode: accessCode } })];
                                    case 5:
                                        formResponses = _c.sent();
                                        createdFormResponse = formResponses[0];
                                        // Cleanup
                                        return [4 /*yield*/, sdk.api.forms.deleteOne(form.id)];
                                    case 6:
                                        // Cleanup
                                        _c.sent();
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(destination.id)
                                            // The form response should have been created directly with destination enduser ID
                                            // (not transferred after creation)
                                        ];
                                    case 7:
                                        _c.sent();
                                        // The form response should have been created directly with destination enduser ID
                                        // (not transferred after creation)
                                        return [2 /*return*/, sourceDeleted
                                                && createdFormResponse !== undefined
                                                && createdFormResponse.enduserId === destination.id];
                                }
                            });
                        }); }, { expectedResult: true })
                        // Test 12: Intake fields update destination enduser directly
                    ];
                case 11:
                    // Test 11: Form response enduserId is updated to destination (placeholder is updated before submission completes)
                    _b.sent();
                    // Test 12: Intake fields update destination enduser directly
                    return [4 /*yield*/, async_test("Auto-merge: Intake fields update destination enduser directly", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var testEmail, destination, _a, form, fields, newPhone, newDOB, sourceId, sourceDeleted, updatedDestination;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        testEmail = "automerge.intake.".concat(Date.now(), "@test.com");
                                        return [4 /*yield*/, sdk.api.endusers.createOne({
                                                fname: 'Intake',
                                                lname: 'Test',
                                                email: testEmail,
                                                // No phone or DOB set initially
                                            })];
                                    case 1:
                                        destination = _b.sent();
                                        return [4 /*yield*/, createAutoMergeForm(sdk, true)];
                                    case 2:
                                        _a = _b.sent(), form = _a.form, fields = _a.fields;
                                        newPhone = '+15555559876';
                                        newDOB = '1985-03-20';
                                        return [4 /*yield*/, submitPublicFormWithSkipMatch(form, fields, {
                                                fname: 'Intake',
                                                lname: 'Test',
                                                email: testEmail,
                                                phone: newPhone,
                                                dateOfBirth: newDOB,
                                            })
                                            // Merge is synchronous - verify intake fields updated destination directly
                                        ];
                                    case 3:
                                        sourceId = (_b.sent()).enduserId;
                                        return [4 /*yield*/, isEnduserDeleted(sdk, sourceId)];
                                    case 4:
                                        sourceDeleted = _b.sent();
                                        return [4 /*yield*/, sdk.api.endusers.getOne(destination.id)
                                            // Cleanup
                                        ];
                                    case 5:
                                        updatedDestination = _b.sent();
                                        // Cleanup
                                        return [4 /*yield*/, sdk.api.forms.deleteOne(form.id)];
                                    case 6:
                                        // Cleanup
                                        _b.sent();
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(destination.id)
                                            // Intake fields should have been applied to the destination enduser
                                        ];
                                    case 7:
                                        _b.sent();
                                        // Intake fields should have been applied to the destination enduser
                                        return [2 /*return*/, sourceDeleted
                                                && updatedDestination.phone === newPhone
                                                && updatedDestination.dateOfBirth === newDOB];
                                }
                            });
                        }); }, { expectedResult: true })
                        // Test 13: eligibleForAutoMerge is unset after submission (no merge case)
                    ];
                case 12:
                    // Test 12: Intake fields update destination enduser directly
                    _b.sent();
                    // Test 13: eligibleForAutoMerge is unset after submission (no merge case)
                    return [4 /*yield*/, async_test("Auto-merge: eligibleForAutoMerge is unset after submission when no merge occurs", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a, form, fields, sourceId, updatedEnduser;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, createAutoMergeForm(sdk, true)
                                        // Submit form - no match exists, so no merge will happen
                                    ];
                                    case 1:
                                        _a = _b.sent(), form = _a.form, fields = _a.fields;
                                        return [4 /*yield*/, submitPublicFormWithSkipMatch(form, fields, {
                                                fname: 'Unset',
                                                lname: 'Flag',
                                                email: "unset.flag.".concat(Date.now(), "@test.com"),
                                            })
                                            // Verify enduser still exists and eligibleForAutoMerge is unset
                                        ];
                                    case 2:
                                        sourceId = (_b.sent()).enduserId;
                                        return [4 /*yield*/, sdk.api.endusers.getOne(sourceId)
                                            // Cleanup
                                        ];
                                    case 3:
                                        updatedEnduser = _b.sent();
                                        // Cleanup
                                        return [4 /*yield*/, sdk.api.forms.deleteOne(form.id)];
                                    case 4:
                                        // Cleanup
                                        _b.sent();
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(sourceId)
                                            // eligibleForAutoMerge should be unset (undefined/falsy) after submission
                                        ];
                                    case 5:
                                        _b.sent();
                                        // eligibleForAutoMerge should be unset (undefined/falsy) after submission
                                        return [2 /*return*/, updatedEnduser.eligibleForAutoMerge !== true];
                                }
                            });
                        }); }, { expectedResult: true })
                        // ============================================
                        // BACKWARDS COMPATIBILITY & EDGE CASE TESTS
                        // ============================================
                        // Test 14: No merge when source enduser has multiple form responses
                    ];
                case 13:
                    // Test 13: eligibleForAutoMerge is unset after submission (no merge case)
                    _b.sent();
                    // ============================================
                    // BACKWARDS COMPATIBILITY & EDGE CASE TESTS
                    // ============================================
                    // Test 14: No merge when source enduser has multiple form responses
                    return [4 /*yield*/, async_test("Auto-merge: No merge when source enduser already has multiple form responses", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var testEmail, destination, _a, form1, fields1, _b, form2, fields2, enduserSDK1, session1, sourceId, authedSDK1, fnameField1, lnameField1, emailField1, enduserSDK2, session2, sourceId2, authedSDK2, fnameField2, lnameField2, emailField2, sourceStillExists;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        testEmail = "automerge.multiresponse.".concat(Date.now(), "@test.com");
                                        return [4 /*yield*/, sdk.api.endusers.createOne({
                                                fname: 'Multi',
                                                lname: 'Response',
                                                email: testEmail
                                            })];
                                    case 1:
                                        destination = _c.sent();
                                        return [4 /*yield*/, createAutoMergeForm(sdk, true)];
                                    case 2:
                                        _a = _c.sent(), form1 = _a.form, fields1 = _a.fields;
                                        return [4 /*yield*/, createAutoMergeForm(sdk, true)
                                            // Create first public session and submit (this creates first form response)
                                        ];
                                    case 3:
                                        _b = _c.sent(), form2 = _b.form, fields2 = _b.fields;
                                        enduserSDK1 = new EnduserSession({ host: host, businessId: form1.businessId });
                                        return [4 /*yield*/, enduserSDK1.api.form_responses.session_for_public_form({
                                                formId: form1.id,
                                                businessId: form1.businessId,
                                                skipMatch: true,
                                            })];
                                    case 4:
                                        session1 = _c.sent();
                                        sourceId = session1.enduserId;
                                        authedSDK1 = new EnduserSession({ host: host, businessId: form1.businessId, authToken: session1.authToken });
                                        fnameField1 = fields1.find(function (f) { return f.intakeField === 'fname'; });
                                        lnameField1 = fields1.find(function (f) { return f.intakeField === 'lname'; });
                                        emailField1 = fields1.find(function (f) { return f.intakeField === 'email'; });
                                        return [4 /*yield*/, authedSDK1.api.form_responses.submit_form_response({
                                                accessCode: session1.accessCode,
                                                responses: [
                                                    { fieldId: fnameField1.id, fieldTitle: fnameField1.title, answer: { type: 'string', value: 'Different' } },
                                                    { fieldId: lnameField1.id, fieldTitle: lnameField1.title, answer: { type: 'string', value: 'Person' } },
                                                    { fieldId: emailField1.id, fieldTitle: emailField1.title, answer: { type: 'email', value: "different.".concat(Date.now(), "@test.com") } },
                                                ],
                                            })
                                            // Now create a second form response for the SAME source enduser via admin SDK
                                        ];
                                    case 5:
                                        _c.sent();
                                        // Now create a second form response for the SAME source enduser via admin SDK
                                        return [4 /*yield*/, sdk.api.form_responses.createOne({
                                                formId: form2.id,
                                                formTitle: 'Auto Merge Test Form',
                                                enduserId: sourceId,
                                            })
                                            // Re-set eligibleForAutoMerge manually to simulate another attempt
                                        ];
                                    case 6:
                                        // Now create a second form response for the SAME source enduser via admin SDK
                                        _c.sent();
                                        // Re-set eligibleForAutoMerge manually to simulate another attempt
                                        return [4 /*yield*/, sdk.api.endusers.updateOne(sourceId, { eligibleForAutoMerge: true })
                                            // Create another public session that would match - but source now has 2+ form responses
                                        ];
                                    case 7:
                                        // Re-set eligibleForAutoMerge manually to simulate another attempt
                                        _c.sent();
                                        enduserSDK2 = new EnduserSession({ host: host, businessId: form2.businessId });
                                        return [4 /*yield*/, enduserSDK2.api.form_responses.session_for_public_form({
                                                formId: form2.id,
                                                businessId: form2.businessId,
                                                skipMatch: true,
                                            })];
                                    case 8:
                                        session2 = _c.sent();
                                        sourceId2 = session2.enduserId;
                                        // Manually add another form response to sourceId2 to trigger the >1 check
                                        return [4 /*yield*/, sdk.api.form_responses.createOne({
                                                formId: form1.id,
                                                formTitle: 'Auto Merge Test Form',
                                                enduserId: sourceId2,
                                            })
                                            // Submit with matching data - should NOT merge because source has >1 form responses
                                        ];
                                    case 9:
                                        // Manually add another form response to sourceId2 to trigger the >1 check
                                        _c.sent();
                                        authedSDK2 = new EnduserSession({ host: host, businessId: form2.businessId, authToken: session2.authToken });
                                        fnameField2 = fields2.find(function (f) { return f.intakeField === 'fname'; });
                                        lnameField2 = fields2.find(function (f) { return f.intakeField === 'lname'; });
                                        emailField2 = fields2.find(function (f) { return f.intakeField === 'email'; });
                                        return [4 /*yield*/, authedSDK2.api.form_responses.submit_form_response({
                                                accessCode: session2.accessCode,
                                                responses: [
                                                    { fieldId: fnameField2.id, fieldTitle: fnameField2.title, answer: { type: 'string', value: 'Multi' } },
                                                    { fieldId: lnameField2.id, fieldTitle: lnameField2.title, answer: { type: 'string', value: 'Response' } },
                                                    { fieldId: emailField2.id, fieldTitle: emailField2.title, answer: { type: 'email', value: testEmail } },
                                                ],
                                            })
                                            // Source should NOT be deleted because it had multiple form responses
                                        ];
                                    case 10:
                                        _c.sent();
                                        return [4 /*yield*/, isEnduserDeleted(sdk, sourceId2)];
                                    case 11:
                                        sourceStillExists = !(_c.sent());
                                        // Cleanup
                                        return [4 /*yield*/, sdk.api.forms.deleteOne(form1.id)];
                                    case 12:
                                        // Cleanup
                                        _c.sent();
                                        return [4 /*yield*/, sdk.api.forms.deleteOne(form2.id)];
                                    case 13:
                                        _c.sent();
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(destination.id)];
                                    case 14:
                                        _c.sent();
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(sourceId)];
                                    case 15:
                                        _c.sent();
                                        if (!sourceStillExists) return [3 /*break*/, 17];
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(sourceId2)];
                                    case 16:
                                        _c.sent();
                                        _c.label = 17;
                                    case 17: return [2 /*return*/, sourceStillExists];
                                }
                            });
                        }); }, { expectedResult: true })
                        // Test 15: Backwards compat - skipMatch=false does NOT set eligibleForAutoMerge
                    ];
                case 14:
                    // ============================================
                    // BACKWARDS COMPATIBILITY & EDGE CASE TESTS
                    // ============================================
                    // Test 14: No merge when source enduser has multiple form responses
                    _b.sent();
                    // Test 15: Backwards compat - skipMatch=false does NOT set eligibleForAutoMerge
                    return [4 /*yield*/, async_test("Backwards compat: skipMatch=false does not set eligibleForAutoMerge even with autoMergeOnSubmission=true", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a, form, fields, testPhone, enduserSDK, enduserId, enduser;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, createAutoMergeForm(sdk, true)];
                                    case 1:
                                        _a = _b.sent(), form = _a.form, fields = _a.fields;
                                        testPhone = "+1555555".concat(Date.now().toString().slice(-4));
                                        enduserSDK = new EnduserSession({ host: host, businessId: form.businessId });
                                        return [4 /*yield*/, enduserSDK.api.form_responses.session_for_public_form({
                                                formId: form.id,
                                                businessId: form.businessId,
                                                phone: testPhone, // Phone is required when skipMatch is not set
                                                // skipMatch is NOT set (defaults to false)
                                            })];
                                    case 2:
                                        enduserId = (_b.sent()).enduserId;
                                        return [4 /*yield*/, sdk.api.endusers.getOne(enduserId)
                                            // Cleanup
                                        ];
                                    case 3:
                                        enduser = _b.sent();
                                        // Cleanup
                                        return [4 /*yield*/, sdk.api.forms.deleteOne(form.id)];
                                    case 4:
                                        // Cleanup
                                        _b.sent();
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(enduserId)
                                            // eligibleForAutoMerge should NOT be set when skipMatch is false
                                        ];
                                    case 5:
                                        _b.sent();
                                        // eligibleForAutoMerge should NOT be set when skipMatch is false
                                        return [2 /*return*/, enduser.eligibleForAutoMerge !== true];
                                }
                            });
                        }); }, { expectedResult: true })
                        // Test 16: Backwards compat - Private form submission doesn't trigger auto-merge
                    ];
                case 15:
                    // Test 15: Backwards compat - skipMatch=false does NOT set eligibleForAutoMerge
                    _b.sent();
                    // Test 16: Backwards compat - Private form submission doesn't trigger auto-merge
                    return [4 /*yield*/, async_test("Backwards compat: Private form submission does not trigger auto-merge", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var testEmail, destination, source, _a, form, fields, fnameField, lnameField, emailField, sourceStillExists;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        testEmail = "backcompat.private.".concat(Date.now(), "@test.com");
                                        return [4 /*yield*/, sdk.api.endusers.createOne({
                                                fname: 'Private',
                                                lname: 'Test',
                                                email: testEmail
                                            })
                                            // Create source enduser with eligibleForAutoMerge manually set
                                        ];
                                    case 1:
                                        destination = _b.sent();
                                        return [4 /*yield*/, sdk.api.endusers.createOne({
                                                fname: 'Private',
                                                lname: 'Test',
                                                email: testEmail + '.source',
                                                eligibleForAutoMerge: true, // Manually set to test that private submission ignores it
                                            })];
                                    case 2:
                                        source = _b.sent();
                                        return [4 /*yield*/, createAutoMergeForm(sdk, true)
                                            // Create form response via admin SDK (private/non-public submission)
                                        ];
                                    case 3:
                                        _a = _b.sent(), form = _a.form, fields = _a.fields;
                                        fnameField = fields.find(function (f) { return f.intakeField === 'fname'; });
                                        lnameField = fields.find(function (f) { return f.intakeField === 'lname'; });
                                        emailField = fields.find(function (f) { return f.intakeField === 'email'; });
                                        return [4 /*yield*/, sdk.api.form_responses.createOne({
                                                formId: form.id,
                                                formTitle: form.title,
                                                enduserId: source.id,
                                                responses: [
                                                    { fieldId: fnameField.id, fieldTitle: fnameField.title, answer: { type: 'string', value: 'Private' } },
                                                    { fieldId: lnameField.id, fieldTitle: lnameField.title, answer: { type: 'string', value: 'Test' } },
                                                    { fieldId: emailField.id, fieldTitle: emailField.title, answer: { type: 'email', value: testEmail } },
                                                ],
                                            })
                                            // Source should NOT be deleted because this was a private submission (not publicSubmit)
                                        ];
                                    case 4:
                                        _b.sent();
                                        return [4 /*yield*/, isEnduserDeleted(sdk, source.id)];
                                    case 5:
                                        sourceStillExists = !(_b.sent());
                                        // Cleanup
                                        return [4 /*yield*/, sdk.api.forms.deleteOne(form.id)];
                                    case 6:
                                        // Cleanup
                                        _b.sent();
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(destination.id)];
                                    case 7:
                                        _b.sent();
                                        if (!sourceStillExists) return [3 /*break*/, 9];
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(source.id)];
                                    case 8:
                                        _b.sent();
                                        _b.label = 9;
                                    case 9: return [2 /*return*/, sourceStillExists];
                                }
                            });
                        }); }, { expectedResult: true })
                        // Test 17: OR logic - matches on email even when phone differs
                    ];
                case 16:
                    // Test 16: Backwards compat - Private form submission doesn't trigger auto-merge
                    _b.sent();
                    // Test 17: OR logic - matches on email even when phone differs
                    return [4 /*yield*/, async_test("Auto-merge: Merge occurs when email matches even if phone differs (OR logic)", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var testEmail, destination, _a, form, fields, sourceId, sourceDeleted, updatedDestination;
                            var _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        testEmail = "automerge.orlogic.".concat(Date.now(), "@test.com");
                                        return [4 /*yield*/, sdk.api.endusers.createOne({
                                                fname: 'OrLogic',
                                                lname: 'Test',
                                                email: testEmail,
                                                phone: '+15555550001', // Different phone
                                            })];
                                    case 1:
                                        destination = _c.sent();
                                        return [4 /*yield*/, createAutoMergeForm(sdk, true)
                                            // Submit with matching email but DIFFERENT phone
                                        ];
                                    case 2:
                                        _a = _c.sent(), form = _a.form, fields = _a.fields;
                                        return [4 /*yield*/, submitPublicFormWithSkipMatch(form, fields, {
                                                fname: 'OrLogic',
                                                lname: 'Test',
                                                email: testEmail,
                                                phone: '+15555550002', // Different phone than destination
                                            })
                                            // Should merge because email matches (OR logic, not AND)
                                        ];
                                    case 3:
                                        sourceId = (_c.sent()).enduserId;
                                        return [4 /*yield*/, isEnduserDeleted(sdk, sourceId)];
                                    case 4:
                                        sourceDeleted = _c.sent();
                                        return [4 /*yield*/, sdk.api.endusers.getOne(destination.id)
                                            // Cleanup
                                        ];
                                    case 5:
                                        updatedDestination = _c.sent();
                                        // Cleanup
                                        return [4 /*yield*/, sdk.api.forms.deleteOne(form.id)];
                                    case 6:
                                        // Cleanup
                                        _c.sent();
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(destination.id)];
                                    case 7:
                                        _c.sent();
                                        return [2 /*return*/, sourceDeleted && ((_b = updatedDestination.mergedIds) === null || _b === void 0 ? void 0 : _b.includes(sourceId))];
                                }
                            });
                        }); }, { expectedResult: true })
                        // Test 18: Partial name mismatch - fname matches but lname differs
                    ];
                case 17:
                    // Test 17: OR logic - matches on email even when phone differs
                    _b.sent();
                    // Test 18: Partial name mismatch - fname matches but lname differs
                    return [4 /*yield*/, async_test("Auto-merge: No merge when fname matches but lname differs", function () { return __awaiter(void 0, void 0, void 0, function () {
                            var testEmail, destination, _a, form, fields, sourceId, sourceDeleted;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        testEmail = "automerge.partial.".concat(Date.now(), "@test.com");
                                        return [4 /*yield*/, sdk.api.endusers.createOne({
                                                fname: 'Partial',
                                                lname: 'Match',
                                                email: testEmail
                                            })];
                                    case 1:
                                        destination = _b.sent();
                                        return [4 /*yield*/, createAutoMergeForm(sdk, true)
                                            // Submit with same fname but DIFFERENT lname
                                        ];
                                    case 2:
                                        _a = _b.sent(), form = _a.form, fields = _a.fields;
                                        return [4 /*yield*/, submitPublicFormWithSkipMatch(form, fields, {
                                                fname: 'Partial',
                                                lname: 'Different',
                                                email: testEmail, // Same email
                                            })
                                            // Should NOT merge because lname differs
                                        ];
                                    case 3:
                                        sourceId = (_b.sent()).enduserId;
                                        return [4 /*yield*/, isEnduserDeleted(sdk, sourceId)
                                            // Cleanup
                                        ];
                                    case 4:
                                        sourceDeleted = _b.sent();
                                        // Cleanup
                                        return [4 /*yield*/, sdk.api.forms.deleteOne(form.id)];
                                    case 5:
                                        // Cleanup
                                        _b.sent();
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(destination.id)];
                                    case 6:
                                        _b.sent();
                                        if (!!sourceDeleted) return [3 /*break*/, 8];
                                        return [4 /*yield*/, sdk.api.endusers.deleteOne(sourceId)];
                                    case 7:
                                        _b.sent();
                                        _b.label = 8;
                                    case 8: return [2 /*return*/, !sourceDeleted]; // Source should NOT be deleted
                                }
                            });
                        }); }, { expectedResult: true })];
                case 18:
                    // Test 18: Partial name mismatch - fname matches but lname differs
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
};
// Allow running this test file independently
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
                    return [4 /*yield*/, auto_merge_form_submission_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("Auto-merge form submission test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("Auto-merge form submission test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=auto_merge_form_submission.test.js.map