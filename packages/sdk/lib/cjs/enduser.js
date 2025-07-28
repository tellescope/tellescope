"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.EnduserSession = exports.defaultQueries = void 0;
var session_1 = require("./session");
var utilities_1 = require("@tellescope/utilities");
var schema_1 = require("@tellescope/schema");
var defaultQueries = function (s, n) {
    var safeName = (0, utilities_1.url_safe_path)(n);
    var singularName = (safeName).substring(0, safeName.length - 1);
    return {
        createOne: function (o) { return s._POST("/v1/".concat(singularName), o); },
        createSome: function (os) { return s._POST("/v1/".concat(safeName), { create: os }); },
        getOne: function (argument) { return typeof argument === 'string' ? s._GET("/v1/".concat(singularName, "/").concat(argument))
            : s._GET("/v1/".concat(singularName), { filter: argument }); },
        getSome: function (o) { return s._GET("/v1/".concat(safeName), o); },
        getByIds: function (o) { return s._POST("/v1/".concat(safeName, "/bulk-read"), o); },
        updateOne: function (id, updates, options) { return s._PATCH("/v1/".concat(singularName, "/").concat(id), { updates: updates, options: options }); },
        deleteOne: function (id) { return s._DELETE("/v1/".concat(singularName, "/").concat(id)); },
    };
};
exports.defaultQueries = defaultQueries;
var loadDefaultQueries = function (s) { return ({
    appointment_booking_pages: (0, exports.defaultQueries)(s, 'appointment_booking_pages'),
    chat_rooms: (0, exports.defaultQueries)(s, 'chat_rooms'),
    chats: (0, exports.defaultQueries)(s, 'chats'),
    endusers: (0, exports.defaultQueries)(s, 'endusers'),
    calendar_events: (0, exports.defaultQueries)(s, 'calendar_events'),
    calendar_event_templates: (0, exports.defaultQueries)(s, 'calendar_event_templates'),
    engagement_events: (0, exports.defaultQueries)(s, 'engagement_events'),
    files: (0, exports.defaultQueries)(s, 'files'),
    tickets: (0, exports.defaultQueries)(s, 'tickets'),
    form_fields: (0, exports.defaultQueries)(s, 'form_fields'),
    form_responses: (0, exports.defaultQueries)(s, 'form_responses'),
    enduser_observations: (0, exports.defaultQueries)(s, 'enduser_observations'),
    forum_posts: (0, exports.defaultQueries)(s, 'forum_posts'),
    forums: (0, exports.defaultQueries)(s, 'forums'),
    managed_content_records: (0, exports.defaultQueries)(s, 'managed_content_records'),
    managed_content_record_assignments: (0, exports.defaultQueries)(s, 'managed_content_record_assignments'),
    post_comments: (0, exports.defaultQueries)(s, 'post_comments'),
    post_likes: (0, exports.defaultQueries)(s, 'post_likes'),
    comment_likes: (0, exports.defaultQueries)(s, 'comment_likes'),
    users: (0, exports.defaultQueries)(s, 'users'),
    meetings: (0, exports.defaultQueries)(s, 'meetings'),
    integrations: (0, exports.defaultQueries)(s, 'integrations'),
    calendar_event_RSVPs: (0, exports.defaultQueries)(s, 'calendar_event_RSVPs'),
    portal_customizations: (0, exports.defaultQueries)(s, 'portal_customizations'),
    care_plans: (0, exports.defaultQueries)(s, 'care_plans'),
    enduser_tasks: (0, exports.defaultQueries)(s, 'enduser_tasks'),
    products: (0, exports.defaultQueries)(s, 'products'),
    purchase_credits: (0, exports.defaultQueries)(s, 'purchase_credits'),
    purchases: (0, exports.defaultQueries)(s, 'purchases'),
    appointment_locations: (0, exports.defaultQueries)(s, 'appointment_locations'),
    enduser_medications: (0, exports.defaultQueries)(s, 'enduser_medications'),
    ticket_threads: (0, exports.defaultQueries)(s, 'ticket_threads'),
    ticket_thread_comments: (0, exports.defaultQueries)(s, 'ticket_thread_comments'),
    enduser_orders: (0, exports.defaultQueries)(s, 'enduser_orders'),
    enduser_problems: (0, exports.defaultQueries)(s, 'enduser_problems'),
    diagnosis_codes: (0, exports.defaultQueries)(s, 'diagnosis_codes'),
    allergy_codes: (0, exports.defaultQueries)(s, 'allergy_codes'),
    forms: (0, exports.defaultQueries)(s, 'forms'),
    enduser_eligibility_results: (0, exports.defaultQueries)(s, 'enduser_eligibility_results'),
}); };
var EnduserSession = /** @class */ (function (_super) {
    __extends(EnduserSession, _super);
    function EnduserSession(o) {
        var _this = _super.call(this, __assign(__assign({}, o), { cacheKey: (o === null || o === void 0 ? void 0 : o.cacheKey) || "tellescope_enduser", type: 'enduser' })) || this;
        _this.type = 'enduser';
        _this._POST = function (endpoint, args, authenticated) {
            if (authenticated === void 0) { authenticated = true; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.refresh_session_if_expiring_soon()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.POST(endpoint, args, authenticated)];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        _this._GET = function (endpoint, params, authenticated, options) {
            if (authenticated === void 0) { authenticated = true; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.refresh_session_if_expiring_soon()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.GET(endpoint, params, authenticated, options)];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        _this._PATCH = function (endpoint, params, authenticated) {
            if (authenticated === void 0) { authenticated = true; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.refresh_session_if_expiring_soon()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.PATCH(endpoint, params, authenticated)];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        _this._DELETE = function (endpoint, args, authenticated) {
            if (authenticated === void 0) { authenticated = true; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.refresh_session_if_expiring_soon()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.DELETE(endpoint, args, authenticated)];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        _this.prepare_and_upload_file = function (details, file) { return __awaiter(_this, void 0, void 0, function () {
            var name, size, type, enduserId, publicName, publicRead, source, externalId, _a, presignedUpload, createdFile;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        name = details.name, size = details.size, type = details.type, enduserId = details.enduserId, publicName = details.publicName, publicRead = details.publicRead, source = details.source, externalId = details.externalId;
                        return [4 /*yield*/, this.api.files.prepare_file_upload({ externalId: externalId, name: name, size: size, type: type, enduserId: enduserId, publicRead: publicRead, publicName: publicName, source: source })];
                    case 1:
                        _a = _b.sent(), presignedUpload = _a.presignedUpload, createdFile = _a.file;
                        return [4 /*yield*/, this.UPLOAD(presignedUpload, file)];
                    case 2:
                        _b.sent();
                        this.api.files.confirm_file_upload({ id: createdFile.id }).catch(console.error);
                        return [2 /*return*/, createdFile];
                }
            });
        }); };
        _this.handle_new_session = function (_a) {
            var authToken = _a.authToken, enduser = _a.enduser;
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    this.clearState(enduser.id === this.userInfo.id); // true to keep existing socket for same user
                    this.sessionStart = Date.now();
                    this.setAuthToken(authToken);
                    this.setUserInfo(enduser);
                    return [2 /*return*/, { authToken: authToken, enduser: enduser }];
                });
            });
        };
        _this.authenticate = function (email, password, o) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.handle_new_session;
                        return [4 /*yield*/, this.POST('/v1/login-enduser', __assign({ email: email, password: password, businessId: this.businessId, organizationIds: this.organizationIds }, o))];
                    case 1: return [2 /*return*/, _a.apply(this, [_b.sent()])];
                }
            });
        }); };
        _this.begin_login_flow = function (a) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.POST("/v1/".concat(schema_1.schema.endusers.publicActions.begin_login_flow.path), __assign(__assign({}, a), { businessId: this.businessId, organizationIds: this.organizationIds }))];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        _this.register = function (args) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (this.POST("/v1".concat(schema_1.schema.endusers.publicActions.register.path), __assign(__assign({}, args), { businessId: this.businessId, organizationIds: this.organizationIds })))];
            });
        }); };
        _this.request_password_reset = function (args) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (this.POST("/v1".concat(schema_1.schema.endusers.publicActions.request_password_reset.path), __assign(__assign({}, args), { businessId: this.businessId, organizationIds: this.organizationIds })))];
            });
        }); };
        _this.reset_password = function (args) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (this.POST("/v1".concat(schema_1.schema.endusers.publicActions.reset_password.path), __assign(__assign({}, args), { businessId: this.businessId, organizationIds: this.organizationIds })))];
            });
        }); };
        _this.refresh_session = function (args) { return __awaiter(_this, void 0, void 0, function () {
            var _a, enduser, authToken;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.POST('/v1/refresh-enduser-session', args)];
                    case 1:
                        _a = _b.sent(), enduser = _a.enduser, authToken = _a.authToken;
                        return [2 /*return*/, this.handle_new_session({ authToken: authToken, enduser: enduser })];
                }
            });
        }); };
        _this.refresh_session_if_expiring_soon = function () { return __awaiter(_this, void 0, void 0, function () {
            var elapsedSessionMS;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        elapsedSessionMS = Date.now() - (this.sessionStart || Date.now());
                        if (!(this.AUTO_REFRESH_MS < elapsedSessionMS)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.refresh_session()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/];
                }
            });
        }); };
        _this.logout = function () {
            _this.clearState();
            return _this.api.endusers.logout();
        };
        _this.test_authenticated = function () { return _this.GET('/v1/test-authenticated'); };
        if (o === null || o === void 0 ? void 0 : o.enduser)
            _this.userInfo = o.enduser;
        _this.businessId = o === null || o === void 0 ? void 0 : o.businessId;
        _this.api = loadDefaultQueries(_this);
        _this.api.calendar_events.get_appointment_availability = function (a) { return _this._GET("/v1".concat(schema_1.schema.calendar_events.customActions.get_appointment_availability.path), a); };
        _this.api.calendar_events.book_appointment = function (a) { return _this._POST("/v1".concat(schema_1.schema.calendar_events.customActions.book_appointment.path), a); };
        _this.api.calendar_events.session_for_public_appointment_booking = function (a) { return _this._POST("/v1".concat(schema_1.schema.calendar_events.publicActions.session_for_public_appointment_booking.path), a); };
        _this.api.calendar_events.details_for_appointment_booking_page = function (a) { return _this._GET("/v1".concat(schema_1.schema.calendar_events.publicActions.details_for_appointment_booking_page.path), a); };
        _this.api.calendar_events.session_for_join_link = function (a) { return _this._GET("/v1".concat(schema_1.schema.calendar_events.publicActions.session_for_join_link.path), a); };
        _this.api.calendar_events.stripe_details = function (a) { return _this._GET("/v1".concat(schema_1.schema.calendar_events.customActions.stripe_details.path), a); };
        _this.api.calendar_events.download_ics_file = function (a) { return _this._GET("/v1".concat(schema_1.schema.calendar_events.customActions.download_ics_file.path), a, true, { responseType: 'arraybuffer' }); };
        _this.api.chat_rooms.display_info = function (a) { return _this._GET("/v1".concat(schema_1.schema.chat_rooms.customActions.display_info.path), a); };
        _this.api.chat_rooms.mark_read = function (a) { return _this._POST("/v1".concat(schema_1.schema.chat_rooms.customActions.mark_read.path), a); };
        _this.api.endusers.logout = function () { return _this._POST('/v1/logout-enduser'); };
        _this.api.endusers.unsubscribe = function (a) { return _this._POST("/v1".concat(schema_1.schema.endusers.publicActions.unsubscribe.path), a); };
        _this.api.endusers.get_otp_methods = function (a) { return _this._GET("/v1".concat(schema_1.schema.endusers.publicActions.get_otp_methods.path), a); };
        _this.api.endusers.send_otp = function (a) { return _this._POST("/v1".concat(schema_1.schema.endusers.publicActions.send_otp.path), a); };
        _this.api.endusers.verify_otp = function (a) { return _this._POST("/v1".concat(schema_1.schema.endusers.publicActions.verify_otp.path), a); };
        _this.api.endusers.current_session_info = function () { return _this._GET("/v1".concat(schema_1.schema.endusers.customActions.current_session_info.path)); };
        _this.api.endusers.add_to_journey = function (a) { return _this._POST("/v1".concat(schema_1.schema.endusers.customActions.add_to_journey.path), a); };
        _this.api.endusers.set_password = function (a) { return _this._POST("/v1".concat(schema_1.schema.endusers.customActions.set_password.path), a); };
        _this.api.users.display_info = function () { return _this._GET("/v1/user-display-info"); },
            _this.api.meetings.attendee_info = function (a) { return _this._GET('/v1/attendee-info', a); };
        _this.api.meetings.my_meetings = function () { return _this._GET('/v1/my-meetings'); };
        _this.api.meetings.join_meeting_for_event = function (a) { return _this._POST("/v1".concat(schema_1.schema.meetings.customActions.join_meeting_for_event.path), a); };
        _this.api.organizations = {
            get_theme: function (a) { return _this._GET("/v1/".concat(schema_1.schema.organizations.publicActions.get_theme.path), a); }
        };
        _this.api.form_fields.load_choices_from_database = function (args) { return _this._GET("/v1".concat(schema_1.schema.form_fields.customActions.load_choices_from_database.path), args); };
        _this.api.form_fields.booking_info = function (args) { return _this._GET("/v1".concat(schema_1.schema.form_fields.customActions.booking_info.path), args); };
        // this.api.form_fields.load_payers = args => this._GET(`/v1${schema.form_fields.customActions.load_payers.path}`, args)
        _this.api.form_responses.prepare_form_response = function (args) { return _this._POST("/v1".concat(schema_1.schema.form_responses.customActions.prepare_form_response.path), args); };
        _this.api.form_responses.session_for_public_form = function (args) { return _this._POST("/v1".concat(schema_1.schema.form_responses.publicActions.session_for_public_form.path), args); };
        _this.api.form_responses.submit_form_response = function (args) { return _this._PATCH("/v1".concat(schema_1.schema.form_responses.customActions.submit_form_response.path), args); };
        _this.api.form_responses.save_field_response = function (args) { return _this._PATCH("/v1".concat(schema_1.schema.form_responses.customActions.save_field_response.path), args); };
        _this.api.form_responses.info_for_access_code = function (args) { return _this._GET("/v1".concat(schema_1.schema.form_responses.customActions.info_for_access_code.path), args); };
        _this.api.form_responses.stripe_details = function (args) { return _this._GET("/v1".concat(schema_1.schema.form_responses.customActions.stripe_details.path), args); };
        _this.api.form_responses.chargebee_details = function (args) { return _this._GET("/v1".concat(schema_1.schema.form_responses.customActions.chargebee_details.path), args); };
        // files have defaultQueries
        _this.api.files.prepare_file_upload = function (a) { return _this._POST("/v1/prepare-file-upload", a); };
        _this.api.files.confirm_file_upload = function (args) { return _this._POST("/v1".concat(schema_1.schema.files.customActions.confirm_file_upload.path), args); };
        _this.api.files.file_download_URL = function (a) { return _this._GET('/v1/file-download-URL', a); };
        _this.api.post_likes.createOne = function (args) { return _this._POST("/v1".concat(schema_1.schema.post_likes.customActions.create.path), args); };
        _this.api.post_likes.unlike_post = function (args) { return _this._POST("/v1".concat(schema_1.schema.post_likes.customActions.unlike_post.path), args); };
        _this.api.managed_content_records.search = function (args) { return _this._POST("/v1".concat(schema_1.schema.managed_content_records.customActions.search.path), args); };
        _this.api.forms.public_form_details = function (args) { return _this._GET("/v1".concat(schema_1.schema.forms.publicActions.public_form_details.path), args); };
        _this.api.sms_messages = {
            leave_message: function (args) { return _this._POST("/v1".concat(schema_1.schema.sms_messages.publicActions.leave_message.path), args); }
        };
        _this.api.appointment_booking_pages.validate_access_token = function (args) { return _this._GET("/v1".concat(schema_1.schema.appointment_booking_pages.publicActions.validate_access_token.path), args); };
        _this.api.products.prepare_stripe_checkout = function (args) { return _this._POST("/v1".concat(schema_1.schema.products.customActions.prepare_stripe_checkout.path), args); };
        _this.api.products.get_stripe_portal_session = function (args) { return _this._GET("/v1".concat(schema_1.schema.products.customActions.get_stripe_portal_session.path), args); };
        _this.api.integrations.proxy_read = function (args) { return _this._GET("/v1".concat(schema_1.schema.integrations.customActions.proxy_read.path), args); };
        _this.api.enduser_observations.load = function (args) { return _this._GET("/v1".concat(schema_1.schema.enduser_observations.customActions.load.path), args); };
        return _this;
        // if (this.authToken) this.refresh_session()
    }
    return EnduserSession;
}(session_1.Session));
exports.EnduserSession = EnduserSession;
//# sourceMappingURL=enduser.js.map