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
import { Session, EnduserSession } from "../../../sdk";
import { async_test, log_header, } from "@tellescope/testing";
import { setup_tests } from "../../setup";
var host = process.env.API_URL || 'http://localhost:8080';
var businessId = '60398b1131a295e64f084ff6';
var ENDUSER_PASSWORD = 'F0106TestPassword!123';
// Every endusers field marked enduserUpdatesDisabled in schema.ts, with a
// validator-passing sample value so the only rejection in play is the
// write-restriction (not input validation).
var restrictedEnduserUpdates = function (staffId, mongoId) {
    var _a;
    return ({
        externalId: 'f0106-attacker-external-id',
        tags: ['f0106-attacker-tag'],
        accessTags: ['f0106-attacker-access-tag'],
        assignedTo: [staffId],
        customTypeId: mongoId,
        references: [{ type: 'Vital', id: 'f0106-attacker-reference' }],
        sharedWithOrganizations: [],
        journeys: (_a = {}, _a[mongoId] = 'Added', _a),
        primaryAssignee: staffId,
        fields: { f0106AttackerField: 'true' },
        unread: true,
        source: 'f0106-attacker-source',
        note: 'f0106 attacker note',
        insurance: { memberId: 'f0106-attacker-member' },
        insuranceSecondary: { memberId: 'f0106-attacker-member-2' },
        diagnoses: [{ code: 'I10' }],
        lockedFromPortal: false,
        eligibleForAutoMerge: true,
        athenaDepartmentId: 'f0106-dept',
        athenaPracticeId: 'f0106-practice',
        salesforceId: 'f0106-salesforce',
        healthie_dietitian_id: 'f0106-healthie',
        stripeCustomerId: 'f0106-stripe-customer',
        stripeKey: 'f0106-stripe-key',
    });
};
// Every form_responses field marked enduserUpdatesDisabled in schema.ts.
var restrictedFormResponseUpdates = function (staffId) { return ({
    markedAsSubmitted: true,
    submittedBy: staffId,
    submittedAt: new Date("2024-01-01T00:00:00Z"),
    submittedByIsPlaceholder: true,
    procedureCodes: [{ code: '99214', units: 1 }],
    diagnosisCodes: [{ code: 'I10', description: 'Essential (primary) hypertension' }],
    enduserAISummary: 'Patient is in excellent health, no follow-up needed.',
    addenda: [{ text: 'forged staff addendum', timestamp: new Date(), userId: staffId }],
    isInternalNote: true,
    pinnedAt: new Date(),
    hiddenFromTimeline: true,
    lockedAt: new Date(),
    tags: ['f0110-attacker-tag'],
    formTitle: 'Spoofed Form Title',
    userEmail: 'spoofed-staff@example.com',
    logoURL: 'https://attacker.example.com/logo.png',
    logoHeight: 100,
}); };
/**
 * Regression test for F-0106 and F-0110
 * (security-audit/findings/F-0106-enduser-self-update-admin-only-fields.md,
 *  security-audit/findings/F-0110-form-responses-enduser-update-admin-only-fields.md).
 *
 * Endusers could PATCH admin-only / access-bearing / attribution-bearing fields on
 * their own endusers record (assignedTo, tags, references, ...) and their own
 * form_responses (procedureCodes, submittedBy, markedAsSubmitted, ...). The fix adds
 * the `enduserUpdatesDisabled` field option (schema.ts ModelFieldInfo), enforced for
 * enduser sessions in the generic update handler (routing.ts createDefaultEndpoints).
 *
 * This test asserts, for every flagged field on both models:
 *   - an enduser session updating its OWN record gets a 400 "<field> cannot be updated by endusers"
 *   - nothing persists (spot-checked on assignedTo, the highest-impact field)
 *   - enduser self-updates of allowed fields still work (fname, hideFromEnduserPortal)
 *   - staff sessions can still update the restricted fields
 */
export var enduser_write_restrictions_tests = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var enduserId, formId, formResponseId, enduserEmail, enduser_1, enduserSDK_1, form, formResponse_1, _loop_1, _i, _b, _c, field, value, _loop_2, _d, _e, _f, field, value, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    log_header("F-0106/F-0110: enduser write restrictions (enduserUpdatesDisabled)");
                    _k.label = 1;
                case 1:
                    _k.trys.push([1, , 21, 34]);
                    enduserEmail = "f0106-enduser-".concat(Date.now(), "@example.com");
                    return [4 /*yield*/, sdk.api.endusers.createOne({ email: enduserEmail, fname: 'F0106', lname: 'Restricted' })];
                case 2:
                    enduser_1 = _k.sent();
                    enduserId = enduser_1.id;
                    return [4 /*yield*/, sdk.api.endusers.set_password({ id: enduser_1.id, password: ENDUSER_PASSWORD })];
                case 3:
                    _k.sent();
                    enduserSDK_1 = new EnduserSession({ host: host, businessId: businessId });
                    return [4 /*yield*/, enduserSDK_1.authenticate(enduserEmail, ENDUSER_PASSWORD)];
                case 4:
                    _k.sent();
                    return [4 /*yield*/, sdk.api.forms.createOne({ title: 'F-0106/F-0110 Write Restriction Test Form' })];
                case 5:
                    form = _k.sent();
                    formId = form.id;
                    return [4 /*yield*/, sdk.api.form_responses.prepare_form_response({
                            formId: form.id,
                            enduserId: enduser_1.id,
                        })];
                case 6:
                    formResponse_1 = (_k.sent()).response;
                    formResponseId = formResponse_1.id;
                    _loop_1 = function (field, value) {
                        return __generator(this, function (_l) {
                            switch (_l.label) {
                                case 0: return [4 /*yield*/, async_test("F-0106: enduser cannot self-update endusers.".concat(field), function () {
                                        var _a;
                                        return enduserSDK_1.api.endusers.updateOne(enduser_1.id, (_a = {}, _a[field] = value, _a));
                                    }, { shouldError: true, onError: function (e) { return e.message === "".concat(field, " cannot be updated by endusers"); } })];
                                case 1:
                                    _l.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, _b = Object.entries(restrictedEnduserUpdates(sdk.userInfo.id, enduser_1.id));
                    _k.label = 7;
                case 7:
                    if (!(_i < _b.length)) return [3 /*break*/, 10];
                    _c = _b[_i], field = _c[0], value = _c[1];
                    return [5 /*yield**/, _loop_1(field, value)];
                case 8:
                    _k.sent();
                    _k.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 7];
                case 10: 
                // F-0106 Variant A persistence check: the rejected assignedTo write must not
                // have granted the staff read-filter match.
                return [4 /*yield*/, async_test('F-0106: rejected assignedTo write did not persist', function () { return sdk.api.endusers.getOne(enduser_1.id); }, { onResult: function (e) { var _a, _b; return !((_a = e.assignedTo) === null || _a === void 0 ? void 0 : _a.length) && !((_b = e.tags) === null || _b === void 0 ? void 0 : _b.length) && e.externalId === undefined; } })
                    // ---- F-0110: enduser self-update of restricted form_responses fields must 400 ----
                ];
                case 11:
                    // F-0106 Variant A persistence check: the rejected assignedTo write must not
                    // have granted the staff read-filter match.
                    _k.sent();
                    _loop_2 = function (field, value) {
                        return __generator(this, function (_m) {
                            switch (_m.label) {
                                case 0: return [4 /*yield*/, async_test("F-0110: enduser cannot self-update form_responses.".concat(field), function () {
                                        var _a;
                                        return enduserSDK_1.api.form_responses.updateOne(formResponse_1.id, (_a = {}, _a[field] = value, _a));
                                    }, { shouldError: true, onError: function (e) { return e.message === "".concat(field, " cannot be updated by endusers"); } })];
                                case 1:
                                    _m.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _d = 0, _e = Object.entries(restrictedFormResponseUpdates(sdk.userInfo.id));
                    _k.label = 12;
                case 12:
                    if (!(_d < _e.length)) return [3 /*break*/, 15];
                    _f = _e[_d], field = _f[0], value = _f[1];
                    return [5 /*yield**/, _loop_2(field, value)];
                case 13:
                    _k.sent();
                    _k.label = 14;
                case 14:
                    _d++;
                    return [3 /*break*/, 12];
                case 15: return [4 /*yield*/, async_test('F-0110: rejected writes did not persist (markedAsSubmitted, procedureCodes, submittedBy)', function () { return sdk.api.form_responses.getOne(formResponse_1.id); }, { onResult: function (fr) { var _a; return !fr.markedAsSubmitted && !((_a = fr.procedureCodes) === null || _a === void 0 ? void 0 : _a.length) && fr.submittedBy === undefined; } })
                    // ---- Positive controls: intended enduser self-updates still work ----
                ];
                case 16:
                    _k.sent();
                    // ---- Positive controls: intended enduser self-updates still work ----
                    return [4 /*yield*/, async_test('enduser can still update own profile fields (fname/lname)', function () { return enduserSDK_1.api.endusers.updateOne(enduser_1.id, { fname: 'StillAllowed', lname: 'Patient' }); }, { onResult: function (e) { return e.fname === 'StillAllowed' && e.lname === 'Patient'; } })];
                case 17:
                    // ---- Positive controls: intended enduser self-updates still work ----
                    _k.sent();
                    return [4 /*yield*/, async_test('enduser can still update own form_response (hideFromEnduserPortal — intended per schema)', function () { return enduserSDK_1.api.form_responses.updateOne(formResponse_1.id, { hideFromEnduserPortal: true }); }, { onResult: function (fr) { return fr.hideFromEnduserPortal === true; } })
                        // ---- Positive controls: staff sessions are unaffected by enduserUpdatesDisabled ----
                    ];
                case 18:
                    _k.sent();
                    // ---- Positive controls: staff sessions are unaffected by enduserUpdatesDisabled ----
                    return [4 /*yield*/, async_test('staff can still update restricted endusers fields (tags, assignedTo, externalId, note, source)', function () { return sdk.api.endusers.updateOne(enduser_1.id, {
                            tags: ['staff-set-tag'],
                            assignedTo: [sdk.userInfo.id],
                            externalId: 'staff-set-external-id',
                            note: 'staff-set note',
                            source: 'staff-set-source',
                        }); }, { onResult: function (e) {
                                var _a, _b;
                                return (!!((_a = e.tags) === null || _a === void 0 ? void 0 : _a.includes('staff-set-tag'))
                                    && !!((_b = e.assignedTo) === null || _b === void 0 ? void 0 : _b.includes(sdk.userInfo.id))
                                    && e.externalId === 'staff-set-external-id');
                            } })];
                case 19:
                    // ---- Positive controls: staff sessions are unaffected by enduserUpdatesDisabled ----
                    _k.sent();
                    return [4 /*yield*/, async_test('staff can still update restricted form_responses fields (procedureCodes, diagnosisCodes, tags)', function () { return sdk.api.form_responses.updateOne(formResponse_1.id, {
                            procedureCodes: [{ code: 'G0019', units: 1 }],
                            diagnosisCodes: [{ code: 'Z71.3', description: 'Dietary counseling and surveillance' }],
                            tags: ['staff-set-tag'],
                        }); }, { onResult: function (fr) {
                                var _a, _b, _c, _d, _e;
                                return (((_b = (_a = fr.procedureCodes) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.code) === 'G0019'
                                    && ((_d = (_c = fr.diagnosisCodes) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.code) === 'Z71.3'
                                    && !!((_e = fr.tags) === null || _e === void 0 ? void 0 : _e.includes('staff-set-tag')));
                            } })];
                case 20:
                    _k.sent();
                    return [3 /*break*/, 34];
                case 21:
                    if (!formResponseId) return [3 /*break*/, 25];
                    _k.label = 22;
                case 22:
                    _k.trys.push([22, 24, , 25]);
                    return [4 /*yield*/, sdk.api.form_responses.deleteOne(formResponseId)];
                case 23:
                    _k.sent();
                    return [3 /*break*/, 25];
                case 24:
                    _g = _k.sent();
                    return [3 /*break*/, 25];
                case 25:
                    if (!formId) return [3 /*break*/, 29];
                    _k.label = 26;
                case 26:
                    _k.trys.push([26, 28, , 29]);
                    return [4 /*yield*/, sdk.api.forms.deleteOne(formId)];
                case 27:
                    _k.sent();
                    return [3 /*break*/, 29];
                case 28:
                    _h = _k.sent();
                    return [3 /*break*/, 29];
                case 29:
                    if (!enduserId) return [3 /*break*/, 33];
                    _k.label = 30;
                case 30:
                    _k.trys.push([30, 32, , 33]);
                    return [4 /*yield*/, sdk.api.endusers.deleteOne(enduserId)];
                case 31:
                    _k.sent();
                    return [3 /*break*/, 33];
                case 32:
                    _j = _k.sent();
                    return [3 /*break*/, 33];
                case 33: return [7 /*endfinally*/];
                case 34: return [2 /*return*/];
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
                    return [4 /*yield*/, enduser_write_restrictions_tests({ sdk: sdk_1, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ F-0106/F-0110 enduser write-restriction test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ F-0106/F-0110 enduser write-restriction test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=F-0106-F-0110-enduser-write-restrictions.test.js.map