"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resource_access_tags_tests = void 0;
require('source-map-support').install();
var sdk_1 = require("../../sdk");
var testing_1 = require("@tellescope/testing");
var constants_1 = require("@tellescope/constants");
var setup_1 = require("../setup");
var host = process.env.API_URL || 'http://localhost:8080';
var RAND = function () { return Math.random().toString(36).slice(2, 10); };
var TAG_A = 'resource-access-tag-A';
var TAG_B = 'resource-access-tag-B';
/**
 * Tests for settings.users.enableResourceAccessTags (the `erat` session flag).
 *
 * When the org setting is enabled, org-level configuration resources carrying `accessTags`
 * become visible only to non-admin (Default/Assigned) users whose own tags intersect the
 * record's accessTags. This mirrors the existing enduser accessTags behavior, generalized
 * to the 9 RESOURCE_ACCESS_TAG_MODELS.
 *
 * The model is ADDITIVE: a record only becomes tag-gated once an admin sets accessTags on it.
 * Records without accessTags keep their existing rules (Default == creator-only). Admins and
 * All-access users are unaffected.
 *
 * Per the throwaway-user testing guidance, this test creates throwaway users rather than
 * mutating existing user roles. Tokens are minted via generate_auth_token AFTER the org
 * setting is enabled, so the `erat` flag lands in their sessions.
 */
var resource_access_tags_tests = function (_a) {
    var sdk = _a.sdk;
    return __awaiter(void 0, void 0, void 0, function () {
        var DEFAULT_RW, ALL_RW, RESOURCE_MODELS, createdUserIds, createdRoleIds, createdByModel, _i, RESOURCE_MODELS_1, m, helperTemplateId // calendar_event_template used as a booking-page dependency
        , orgId, defaultPermissions, allPermissions, _b, RESOURCE_MODELS_2, m, defaultRole, allRole, rbapDefault, rbapAll, mkUser, _c, sdkWithTag_1, withTagUser, sdkWithoutTag, sdkAllAccess, helperTemplate, createRecord, recordsByModel, _d, RESOURCE_MODELS_3, model, taggedId, untaggedId, visibleIds, _loop_1, _e, RESOURCE_MODELS_4, model, withTagUserId_1, _f, reAuthToken, reAuthUser, sdkWithTagOff, templatesTaggedId_1, offVisible_1, _g, RESOURCE_MODELS_5, model, _h, _j, id, _k, createdRoleIds_1, id, _l, createdUserIds_1, id;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    (0, testing_1.log_header)("Resource Access Tags Tests");
                    DEFAULT_RW = { create: 'Default', read: 'Default', update: 'Default', delete: 'Default' };
                    ALL_RW = { create: 'All', read: 'All', update: 'All', delete: 'All' };
                    RESOURCE_MODELS = [
                        'templates', 'forms', 'journeys', 'automation_triggers', 'calendar_event_templates',
                        'appointment_booking_pages', 'table_views', 'files', 'managed_content_records',
                    ];
                    createdUserIds = [];
                    createdRoleIds = [];
                    createdByModel = {};
                    for (_i = 0, RESOURCE_MODELS_1 = RESOURCE_MODELS; _i < RESOURCE_MODELS_1.length; _i++) {
                        m = RESOURCE_MODELS_1[_i];
                        createdByModel[m] = [];
                    }
                    orgId = sdk.userInfo.businessId;
                    _m.label = 1;
                case 1:
                    _m.trys.push([1, , 25, 42]);
                    // ── 1. Enable the org setting ───────────────────────────────────────────────
                    // Explicitly disable enduser access tags (eat) so that the tag-edit-restriction
                    // assertions below prove the `erat` flag alone enforces the protection (otherwise
                    // a residual `eat` could mask the gap). Settings deep-merge, so this is targeted.
                    return [4 /*yield*/, sdk.api.organizations.updateOne(orgId, {
                            settings: { users: { enableResourceAccessTags: true }, endusers: { enableAccessTags: false } },
                        })
                        // ── 2. Roles: Default read for a tag-gated user, All read for a control user ──
                    ];
                case 2:
                    // ── 1. Enable the org setting ───────────────────────────────────────────────
                    // Explicitly disable enduser access tags (eat) so that the tag-edit-restriction
                    // assertions below prove the `erat` flag alone enforces the protection (otherwise
                    // a residual `eat` could mask the gap). Settings deep-merge, so this is targeted.
                    _m.sent();
                    defaultPermissions = __assign({}, constants_1.PROVIDER_PERMISSIONS);
                    allPermissions = __assign({}, constants_1.PROVIDER_PERMISSIONS);
                    for (_b = 0, RESOURCE_MODELS_2 = RESOURCE_MODELS; _b < RESOURCE_MODELS_2.length; _b++) {
                        m = RESOURCE_MODELS_2[_b];
                        defaultPermissions[m] = __assign({}, DEFAULT_RW);
                        allPermissions[m] = __assign({}, ALL_RW);
                    }
                    defaultRole = "resource-access-tags-default-".concat(RAND());
                    allRole = "resource-access-tags-all-".concat(RAND());
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.createOne({ role: defaultRole, permissions: defaultPermissions })];
                case 3:
                    rbapDefault = _m.sent();
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.createOne({ role: allRole, permissions: allPermissions })];
                case 4:
                    rbapAll = _m.sent();
                    createdRoleIds.push(rbapDefault.id, rbapAll.id);
                    mkUser = function (tags, roles) { return __awaiter(void 0, void 0, void 0, function () {
                        var user, _a, authToken, sessionUser, session;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, sdk.api.users.createOne({
                                        email: "resource-access-tags-".concat(RAND(), "@tellescope.example"),
                                        fname: 'Resource', lname: 'AccessTags',
                                        notificationEmailsDisabled: true, verifiedEmail: true,
                                        tags: tags,
                                        roles: roles,
                                    })];
                                case 1:
                                    user = _b.sent();
                                    createdUserIds.push(user.id);
                                    return [4 /*yield*/, sdk.api.users.generate_auth_token({ id: user.id })];
                                case 2:
                                    _a = _b.sent(), authToken = _a.authToken, sessionUser = _a.user;
                                    session = new sdk_1.Session({ host: host });
                                    session.setAuthToken(authToken);
                                    session.setUserInfo(sessionUser);
                                    return [2 /*return*/, { session: session, sessionUser: sessionUser }];
                            }
                        });
                    }); };
                    return [4 /*yield*/, mkUser([TAG_A], [defaultRole])]; // Default access, carries the gating tag
                case 5:
                    _c = _m.sent() // Default access, carries the gating tag
                    , sdkWithTag_1 = _c.session, withTagUser = _c.sessionUser;
                    return [4 /*yield*/, mkUser([TAG_B], [defaultRole])]; // Default access, lacks the gating tag
                case 6:
                    sdkWithoutTag = (_m.sent()) // Default access, lacks the gating tag
                    .session;
                    return [4 /*yield*/, mkUser([TAG_B], [allRole])
                        // sanity check: erat made it into the gated sessions
                    ]; // All access, lacks the tag (should still see everything)
                case 7:
                    sdkAllAccess = (_m.sent()) // All access, lacks the tag (should still see everything)
                    .session;
                    // sanity check: erat made it into the gated sessions
                    (0, testing_1.assert)(!!withTagUser.erat, 'erat flag missing on tagged user session', 'erat flag present on tagged user session');
                    return [4 /*yield*/, sdk.api.calendar_event_templates.createOne({ title: "RAT helper ".concat(RAND()), durationInMinutes: 30 })];
                case 8:
                    helperTemplate = _m.sent();
                    helperTemplateId = helperTemplate.id;
                    createdByModel['calendar_event_templates'].push(helperTemplate.id);
                    createRecord = function (model, accessTags) { return __awaiter(void 0, void 0, void 0, function () {
                        var tags, id, _a, r, r, r, r, r, r, r, file, r;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    tags = accessTags ? { accessTags: accessTags } : {};
                                    _a = model;
                                    switch (_a) {
                                        case 'templates': return [3 /*break*/, 1];
                                        case 'forms': return [3 /*break*/, 3];
                                        case 'journeys': return [3 /*break*/, 5];
                                        case 'automation_triggers': return [3 /*break*/, 7];
                                        case 'calendar_event_templates': return [3 /*break*/, 9];
                                        case 'appointment_booking_pages': return [3 /*break*/, 11];
                                        case 'table_views': return [3 /*break*/, 13];
                                        case 'files': return [3 /*break*/, 15];
                                        case 'managed_content_records': return [3 /*break*/, 19];
                                    }
                                    return [3 /*break*/, 21];
                                case 1: return [4 /*yield*/, sdk.api.templates.createOne(__assign({ title: "RAT tmpl ".concat(RAND()), subject: 's', html: '<p>x</p>', message: 'm' }, tags))];
                                case 2:
                                    r = _b.sent();
                                    id = r.id;
                                    return [3 /*break*/, 22];
                                case 3: return [4 /*yield*/, sdk.api.forms.createOne(__assign({ title: "RAT form ".concat(RAND()) }, tags))];
                                case 4:
                                    r = _b.sent();
                                    id = r.id;
                                    return [3 /*break*/, 22];
                                case 5: return [4 /*yield*/, sdk.api.journeys.createOne(__assign({ title: "RAT jrn ".concat(RAND()) }, tags))];
                                case 6:
                                    r = _b.sent();
                                    id = r.id;
                                    return [3 /*break*/, 22];
                                case 7: return [4 /*yield*/, sdk.api.automation_triggers.createOne(__assign({ title: "RAT trg ".concat(RAND()), status: 'Active', event: { type: 'Appointment Completed', info: {} }, action: { type: 'Add Tags', info: { tags: ['x'] } } }, tags))];
                                case 8:
                                    r = _b.sent();
                                    id = r.id;
                                    return [3 /*break*/, 22];
                                case 9: return [4 /*yield*/, sdk.api.calendar_event_templates.createOne(__assign({ title: "RAT cet ".concat(RAND()), durationInMinutes: 30 }, tags))];
                                case 10:
                                    r = _b.sent();
                                    id = r.id;
                                    return [3 /*break*/, 22];
                                case 11: return [4 /*yield*/, sdk.api.appointment_booking_pages.createOne(__assign({ title: "RAT bp ".concat(RAND()), calendarEventTemplateIds: [helperTemplateId], locationIds: [] }, tags))];
                                case 12:
                                    r = _b.sent();
                                    id = r.id;
                                    return [3 /*break*/, 22];
                                case 13: return [4 /*yield*/, sdk.api.table_views.createOne(__assign({ title: "RAT view ".concat(RAND()), page: 'Ticket', columns: [] }, tags))];
                                case 14:
                                    r = _b.sent();
                                    id = r.id;
                                    return [3 /*break*/, 22];
                                case 15: return [4 /*yield*/, sdk.api.files.prepare_file_upload({ name: "RAT file ".concat(RAND()), type: 'text/plain', size: 1 })];
                                case 16:
                                    file = (_b.sent()).file;
                                    if (!accessTags) return [3 /*break*/, 18];
                                    return [4 /*yield*/, sdk.api.files.updateOne(file.id, { accessTags: accessTags })];
                                case 17:
                                    _b.sent();
                                    _b.label = 18;
                                case 18:
                                    id = file.id;
                                    return [3 /*break*/, 22];
                                case 19: return [4 /*yield*/, sdk.api.managed_content_records.createOne(__assign({ title: "RAT content ".concat(RAND()), textContent: 't' }, tags))];
                                case 20:
                                    r = _b.sent();
                                    id = r.id;
                                    return [3 /*break*/, 22];
                                case 21: throw new Error("unhandled model ".concat(model));
                                case 22:
                                    createdByModel[model].push(id);
                                    return [2 /*return*/, id];
                            }
                        });
                    }); };
                    recordsByModel = {};
                    _d = 0, RESOURCE_MODELS_3 = RESOURCE_MODELS;
                    _m.label = 9;
                case 9:
                    if (!(_d < RESOURCE_MODELS_3.length)) return [3 /*break*/, 13];
                    model = RESOURCE_MODELS_3[_d];
                    return [4 /*yield*/, createRecord(model, [TAG_A])];
                case 10:
                    taggedId = _m.sent();
                    return [4 /*yield*/, createRecord(model)];
                case 11:
                    untaggedId = _m.sent();
                    recordsByModel[model] = { taggedId: taggedId, untaggedId: untaggedId };
                    _m.label = 12;
                case 12:
                    _d++;
                    return [3 /*break*/, 9];
                case 13:
                    visibleIds = function (session, model, ids) { return __awaiter(void 0, void 0, void 0, function () {
                        var records;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, session.api[model].getSome({ ids: ids, limit: 100 })];
                                case 1:
                                    records = _a.sent();
                                    return [2 /*return*/, new Set(records.map(function (r) { return r.id; }))];
                            }
                        });
                    }); };
                    _loop_1 = function (model) {
                        var _o, taggedId, untaggedId, ids, withTag, withoutTag, admin, allAccess;
                        return __generator(this, function (_p) {
                            switch (_p.label) {
                                case 0:
                                    _o = recordsByModel[model], taggedId = _o.taggedId, untaggedId = _o.untaggedId;
                                    ids = [taggedId, untaggedId];
                                    return [4 /*yield*/, visibleIds(sdkWithTag_1, model, ids)];
                                case 1:
                                    withTag = _p.sent();
                                    return [4 /*yield*/, visibleIds(sdkWithoutTag, model, ids)];
                                case 2:
                                    withoutTag = _p.sent();
                                    return [4 /*yield*/, visibleIds(sdk, model, ids)];
                                case 3:
                                    admin = _p.sent();
                                    return [4 /*yield*/, visibleIds(sdkAllAccess, model, ids)];
                                case 4:
                                    allAccess = _p.sent();
                                    return [4 /*yield*/, (0, testing_1.async_test)("".concat(model, ": user WITH matching tag CAN read the tagged record"), function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, withTag.has(taggedId)];
                                        }); }); }, { onResult: function (r) { return r === true; } })];
                                case 5:
                                    _p.sent();
                                    return [4 /*yield*/, (0, testing_1.async_test)("".concat(model, ": user WITHOUT matching tag CANNOT read the tagged record"), function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, withoutTag.has(taggedId)];
                                        }); }); }, { onResult: function (r) { return r === false; } })];
                                case 6:
                                    _p.sent();
                                    return [4 /*yield*/, (0, testing_1.async_test)("".concat(model, ": untagged admin record NOT visible to tagged user (additive model)"), function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, withTag.has(untaggedId)];
                                        }); }); }, { onResult: function (r) { return r === false; } })];
                                case 7:
                                    _p.sent();
                                    return [4 /*yield*/, (0, testing_1.async_test)("".concat(model, ": untagged admin record NOT visible to untagged user (additive model)"), function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, withoutTag.has(untaggedId)];
                                        }); }); }, { onResult: function (r) { return r === false; } })];
                                case 8:
                                    _p.sent();
                                    return [4 /*yield*/, (0, testing_1.async_test)("".concat(model, ": admin sees both records (gating does not apply)"), function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, admin.has(taggedId) && admin.has(untaggedId)];
                                        }); }); }, { onResult: function (r) { return r === true; } })];
                                case 9:
                                    _p.sent();
                                    return [4 /*yield*/, (0, testing_1.async_test)("".concat(model, ": All-access user sees both records (gating does not apply)"), function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, allAccess.has(taggedId) && allAccess.has(untaggedId)];
                                        }); }); }, { onResult: function (r) { return r === true; } })];
                                case 10:
                                    _p.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _e = 0, RESOURCE_MODELS_4 = RESOURCE_MODELS;
                    _m.label = 14;
                case 14:
                    if (!(_e < RESOURCE_MODELS_4.length)) return [3 /*break*/, 17];
                    model = RESOURCE_MODELS_4[_e];
                    return [5 /*yield**/, _loop_1(model)];
                case 15:
                    _m.sent();
                    _m.label = 16;
                case 16:
                    _e++;
                    return [3 /*break*/, 14];
                case 17:
                    // ── 5b. Tag-edit restriction: a non-admin cannot edit tags to self-escalate ──
                    // With erat ON and eat OFF, the users.tags edit guard must still fire — proving
                    // resource access tags (not just enduser access tags) trigger the protection.
                    (0, testing_1.log_header)("Resource Access Tags: tag-edit blocked");
                    withTagUserId_1 = createdUserIds[0];
                    return [4 /*yield*/, (0, testing_1.async_test)("non-admin can't update own tags (erat enabled)", function () { return sdkWithTag_1.api.users.updateOne(withTagUserId_1, { tags: ['escalate'] }); }, testing_1.handleAnyError)];
                case 18:
                    _m.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("non-admin can't update own tags alongside other fields (erat enabled)", function () { return sdkWithTag_1.api.users.updateOne(withTagUserId_1, { tags: ['escalate'], bio: '' }); }, testing_1.handleAnyError)];
                case 19:
                    _m.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("non-admin can still update non-tag fields (control)", function () { return sdkWithTag_1.api.users.updateOne(withTagUserId_1, { bio: '' }); }, { shouldError: false, onResult: function () { return true; } })
                        // ── 6. Org-setting-OFF control: disabling the flag gates the whole feature ────
                    ];
                case 20:
                    _m.sent();
                    // ── 6. Org-setting-OFF control: disabling the flag gates the whole feature ────
                    (0, testing_1.log_header)("Resource Access Tags: org-setting-OFF control");
                    return [4 /*yield*/, sdk.api.organizations.updateOne(orgId, {
                            settings: { users: { enableResourceAccessTags: false } },
                        })
                        // re-mint the tagged user's token so the (now-disabled) setting is reflected in the session
                    ];
                case 21:
                    _m.sent();
                    return [4 /*yield*/, sdk.api.users.generate_auth_token({ id: createdUserIds[0] })];
                case 22:
                    _f = _m.sent(), reAuthToken = _f.authToken, reAuthUser = _f.user;
                    sdkWithTagOff = new sdk_1.Session({ host: host });
                    sdkWithTagOff.setAuthToken(reAuthToken);
                    sdkWithTagOff.setUserInfo(reAuthUser);
                    (0, testing_1.assert)(!reAuthUser.erat, 'erat flag should be absent after disabling setting', 'erat flag absent after disabling setting');
                    templatesTaggedId_1 = recordsByModel['templates'].taggedId;
                    return [4 /*yield*/, visibleIds(sdkWithTagOff, 'templates', [templatesTaggedId_1])];
                case 23:
                    offVisible_1 = _m.sent();
                    return [4 /*yield*/, (0, testing_1.async_test)("templates: tagged record NOT visible to tagged user once setting is OFF", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, offVisible_1.has(templatesTaggedId_1)];
                        }); }); }, { onResult: function (r) { return r === false; } })];
                case 24:
                    _m.sent();
                    console.log("\n" + "=".repeat(60));
                    console.log("Resource Access Tags Tests Complete");
                    console.log("=".repeat(60));
                    return [3 /*break*/, 42];
                case 25:
                    _g = 0, RESOURCE_MODELS_5 = RESOURCE_MODELS;
                    _m.label = 26;
                case 26:
                    if (!(_g < RESOURCE_MODELS_5.length)) return [3 /*break*/, 31];
                    model = RESOURCE_MODELS_5[_g];
                    _h = 0, _j = createdByModel[model];
                    _m.label = 27;
                case 27:
                    if (!(_h < _j.length)) return [3 /*break*/, 30];
                    id = _j[_h];
                    return [4 /*yield*/, sdk.api[model].deleteOne(id).catch(function () { })];
                case 28:
                    _m.sent();
                    _m.label = 29;
                case 29:
                    _h++;
                    return [3 /*break*/, 27];
                case 30:
                    _g++;
                    return [3 /*break*/, 26];
                case 31:
                    _k = 0, createdRoleIds_1 = createdRoleIds;
                    _m.label = 32;
                case 32:
                    if (!(_k < createdRoleIds_1.length)) return [3 /*break*/, 35];
                    id = createdRoleIds_1[_k];
                    return [4 /*yield*/, sdk.api.role_based_access_permissions.deleteOne(id).catch(function () { })];
                case 33:
                    _m.sent();
                    _m.label = 34;
                case 34:
                    _k++;
                    return [3 /*break*/, 32];
                case 35:
                    _l = 0, createdUserIds_1 = createdUserIds;
                    _m.label = 36;
                case 36:
                    if (!(_l < createdUserIds_1.length)) return [3 /*break*/, 39];
                    id = createdUserIds_1[_l];
                    return [4 /*yield*/, sdk.api.users.deleteOne(id).catch(function () { })];
                case 37:
                    _m.sent();
                    _m.label = 38;
                case 38:
                    _l++;
                    return [3 /*break*/, 36];
                case 39: 
                // reset the org setting
                return [4 /*yield*/, sdk.api.organizations.updateOne(orgId, {
                        settings: { users: { enableResourceAccessTags: false } },
                    }).catch(function () { })];
                case 40:
                    // reset the org setting
                    _m.sent();
                    return [4 /*yield*/, (0, testing_1.wait)(undefined, 250)];
                case 41:
                    _m.sent();
                    return [7 /*endfinally*/];
                case 42: return [2 /*return*/];
            }
        });
    });
};
exports.resource_access_tags_tests = resource_access_tags_tests;
// Allow running this test file independently
if (require.main === module) {
    console.log("\uD83C\uDF10 Using API URL: ".concat(host));
    var sdk_2 = new sdk_1.Session({ host: host });
    var sdkNonAdmin_1 = new sdk_1.Session({ host: host });
    var runTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, setup_1.setup_tests)(sdk_2, sdkNonAdmin_1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, exports.resource_access_tags_tests)({ sdk: sdk_2, sdkNonAdmin: sdkNonAdmin_1 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    runTests()
        .then(function () {
        console.log("✅ Resource access tags test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Resource access tags test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=resource_access_tags.test.js.map