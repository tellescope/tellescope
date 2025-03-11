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
import { schema, } from "@tellescope/schema";
import { url_safe_path } from "@tellescope/utilities";
import { Session as SessionManager } from "./session";
export * from "./public";
export * from "./enduser";
export var load_all_pages = function (load, o) { return __awaiter(void 0, void 0, void 0, function () {
    var toReturn, maxPages, i, loaded;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                toReturn = [];
                maxPages = (_a = o === null || o === void 0 ? void 0 : o.maxPages) !== null && _a !== void 0 ? _a : 100000;
                i = 0;
                _c.label = 1;
            case 1:
                if (!true) return [3 /*break*/, 3];
                if (i++ > maxPages)
                    return [3 /*break*/, 3];
                return [4 /*yield*/, load(__assign(__assign({}, o), { limit: 1000, lastId: (_b = toReturn[toReturn.length - 1]) === null || _b === void 0 ? void 0 : _b.id }))];
            case 2:
                loaded = _c.sent();
                toReturn.push.apply(toReturn, loaded);
                if (loaded.length < 1000)
                    return [3 /*break*/, 3];
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/, toReturn];
        }
    });
}); };
export var reload_record = function (r, reload, onLoad) { return __awaiter(void 0, void 0, void 0, function () {
    var loaded, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, reload(r.id)];
            case 1:
                loaded = _a.sent();
                onLoad(loaded);
                return [2 /*return*/, loaded];
            case 2:
                err_1 = _a.sent();
                return [2 /*return*/, r]; // just return the existing record and fail gracefully
            case 3: return [2 /*return*/];
        }
    });
}); };
export var defaultQueries = function (s, n) {
    var safeName = url_safe_path(n);
    var singularName = (safeName).substring(0, safeName.length - 1);
    return {
        createOne: function (o) { return s._POST("/v1/".concat(singularName), o); },
        createSome: function (os, o) { return s._POST("/v1/".concat(safeName), __assign({ create: os }, o)); },
        getOne: function (argument, mdbFilter) { return ((typeof argument === 'string' && argument !== '')
            ? s._GET("/v1/".concat(singularName, "/").concat(argument))
            : s._GET("/v1/".concat(singularName), { filter: argument, mdbFilter: mdbFilter })); },
        getSome: function (o) { return s._GET("/v1/".concat(safeName), o); },
        getByIds: function (o) { return s._POST("/v1/".concat(safeName, "/bulk-read"), o); },
        updateOne: function (id, updates, options, _overrideUnique) { return s._PATCH("/v1/".concat(singularName, "/").concat(id), { updates: updates, options: options, _overrideUnique: _overrideUnique }); },
        deleteOne: function (id) { return s._DELETE("/v1/".concat(singularName, "/").concat(id)); },
    };
};
var loadDefaultQueries = function (s) { return ({
    agent_records: defaultQueries(s, 'agent_records'),
    form_groups: defaultQueries(s, 'form_groups'),
    automation_triggers: defaultQueries(s, 'automation_triggers'),
    availability_blocks: defaultQueries(s, 'availability_blocks'),
    analytics_frames: defaultQueries(s, 'analytics_frames'),
    appointment_booking_pages: defaultQueries(s, 'appointment_booking_pages'),
    appointment_locations: defaultQueries(s, 'appointment_locations'),
    portal_customizations: defaultQueries(s, 'portal_customizations'),
    endusers: defaultQueries(s, 'endusers'),
    enduser_status_updates: defaultQueries(s, 'enduser_status_updates'),
    engagement_events: defaultQueries(s, 'engagement_events'),
    journeys: defaultQueries(s, 'journeys'),
    api_keys: defaultQueries(s, 'api_keys'),
    emails: defaultQueries(s, 'emails'),
    sms_messages: defaultQueries(s, 'sms_messages'),
    chat_rooms: defaultQueries(s, 'chat_rooms'),
    chats: defaultQueries(s, 'chats'),
    users: defaultQueries(s, 'users'),
    templates: defaultQueries(s, 'templates'),
    files: defaultQueries(s, 'files'),
    tickets: defaultQueries(s, 'tickets'),
    meetings: defaultQueries(s, 'meetings'),
    notes: defaultQueries(s, 'notes'),
    forms: defaultQueries(s, 'forms'),
    form_fields: defaultQueries(s, 'form_fields'),
    form_responses: defaultQueries(s, 'form_responses'),
    calendar_events: defaultQueries(s, 'calendar_events'),
    calendar_event_templates: defaultQueries(s, 'calendar_event_templates'),
    calendar_event_RSVPs: defaultQueries(s, 'calendar_event_RSVPs'),
    automation_steps: defaultQueries(s, 'automation_steps'),
    automated_actions: defaultQueries(s, 'automated_actions'),
    webhooks: defaultQueries(s, 'webhooks'),
    user_logs: defaultQueries(s, 'user_logs'),
    user_notifications: defaultQueries(s, 'user_notifications'),
    enduser_observations: defaultQueries(s, 'enduser_observations'),
    forum_posts: defaultQueries(s, 'forum_posts'),
    forums: defaultQueries(s, 'forums'),
    managed_content_records: defaultQueries(s, 'managed_content_records'),
    managed_content_record_assignments: defaultQueries(s, 'managed_content_record_assignments'),
    post_comments: defaultQueries(s, 'post_comments'),
    post_likes: defaultQueries(s, 'post_likes'),
    comment_likes: defaultQueries(s, 'comment_likes'),
    organizations: defaultQueries(s, 'organizations'),
    integrations: defaultQueries(s, 'integrations'),
    databases: defaultQueries(s, 'databases'),
    database_records: defaultQueries(s, 'database_records'),
    care_plans: defaultQueries(s, 'care_plans'),
    enduser_tasks: defaultQueries(s, 'enduser_tasks'),
    role_based_access_permissions: defaultQueries(s, 'role_based_access_permissions'),
    products: defaultQueries(s, 'products'),
    purchase_credits: defaultQueries(s, 'purchase_credits'),
    purchases: defaultQueries(s, 'purchases'),
    phone_calls: defaultQueries(s, 'phone_calls'),
    background_errors: defaultQueries(s, 'background_errors'),
    enduser_views: defaultQueries(s, 'enduser_views'),
    superbill_providers: defaultQueries(s, 'superbill_providers'),
    superbills: defaultQueries(s, 'superbills'),
    enduser_profile_views: defaultQueries(s, 'enduser_profile_views'),
    enduser_medications: defaultQueries(s, 'enduser_medications'),
    phone_trees: defaultQueries(s, 'phone_trees'),
    enduser_custom_types: defaultQueries(s, 'enduser_custom_types'),
    table_views: defaultQueries(s, 'table_views'),
    email_sync_denials: defaultQueries(s, 'email_sync_denials'),
    ticket_threads: defaultQueries(s, 'ticket_threads'),
    ticket_thread_comments: defaultQueries(s, 'ticket_thread_comments'),
    configurations: defaultQueries(s, 'configurations'),
    ticket_queues: defaultQueries(s, 'ticket_queues'),
    group_mms_conversations: defaultQueries(s, 'group_mms_conversations'),
    enduser_orders: defaultQueries(s, 'enduser_orders'),
    enduser_encounters: defaultQueries(s, 'enduser_encounters'),
    vital_configurations: defaultQueries(s, 'vital_configurations'),
    blocked_phones: defaultQueries(s, 'blocked_phones'),
    prescription_routes: defaultQueries(s, 'prescription_routes'),
    enduser_problems: defaultQueries(s, 'enduser_problems'),
    flowchart_notes: defaultQueries(s, 'flowchart_notes'),
    webhook_logs: defaultQueries(s, 'webhook_logs'),
    portal_brandings: defaultQueries(s, 'portal_brandings'),
    message_template_snippets: defaultQueries(s, 'message_template_snippets'),
    fax_logs: defaultQueries(s, 'fax_logs'),
    call_hold_queues: defaultQueries(s, 'call_hold_queues'),
    suggested_contacts: defaultQueries(s, 'suggested_contacts'),
    diagnosis_codes: defaultQueries(s, 'diagnosis_codes'),
    allergy_codes: defaultQueries(s, 'allergy_codes'),
    integration_logs: defaultQueries(s, 'integration_logs'),
    enduser_eligibility_results: defaultQueries(s, 'enduser_eligibility_results'),
    waitlists: defaultQueries(s, 'waitlists'),
}); };
var Session = /** @class */ (function (_super) {
    __extends(Session, _super);
    function Session(o) {
        var _this = _super.call(this, __assign(__assign({}, o), { cacheKey: (o === null || o === void 0 ? void 0 : o.cacheKey) || "tellescope_user", type: 'user' })) || this;
        _this.type = 'user';
        _this.bulk_load = function (args) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.refresh_session_if_expiring_soon()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.POST("/v1/bulk-actions/read", args, true)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        _this._POST = function (endpoint, args, authenticated, o) {
            if (authenticated === void 0) { authenticated = true; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.refresh_session_if_expiring_soon()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.POST(endpoint, args, authenticated, o)];
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
        _this.handle_new_session = function (_a) { return __awaiter(_this, void 0, void 0, function () {
            var authToken = _a.authToken, userInfo = __rest(_a, ["authToken"]);
            return __generator(this, function (_b) {
                this.clearState(userInfo.id === this.userInfo.id); // true to keep existing socket for same user
                this.sessionStart = Date.now();
                this.setAuthToken(authToken);
                this.setUserInfo(userInfo);
                if (!this.socket)
                    this.authenticate_socket();
                return [2 /*return*/, __assign({ authToken: authToken }, userInfo)];
            });
        }); };
        _this.change_tenant = function (args) { return __awaiter(_this, void 0, void 0, function () {
            var _a, user, authToken;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.GET('/v1/switch-tenant', args)];
                    case 1:
                        _a = _b.sent(), user = _a.user, authToken = _a.authToken;
                        this.handle_new_session(__assign(__assign({}, user), { authToken: authToken }));
                        return [2 /*return*/, { user: user, authToken: authToken }];
                }
            });
        }); };
        _this.refresh_session = function (args) { return __awaiter(_this, void 0, void 0, function () {
            var _a, user, authToken;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.POST('/v1/refresh-session', args)];
                    case 1:
                        _a = _b.sent(), user = _a.user, authToken = _a.authToken;
                        this.handle_new_session(__assign(__assign({}, user), { authToken: authToken }));
                        return [2 /*return*/, { user: user, authToken: authToken }];
                }
            });
        }); };
        _this.refresh_session_if_expiring_soon = function () { return __awaiter(_this, void 0, void 0, function () {
            var elapsedSessionMS;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.authToken)
                            return [2 /*return*/];
                        elapsedSessionMS = Date.now() - (this.sessionStart || Date.now());
                        if (!(this.AUTO_REFRESH_MS < elapsedSessionMS)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.refresh_session()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/];
                }
            });
        }); };
        /* using new api */
        _this.authenticate = function (email, password, o) { return __awaiter(_this, void 0, void 0, function () {
            var _a, authToken, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.api.users.login(__assign({ email: email, password: password }, o))];
                    case 1:
                        _a = _b.sent(), authToken = _a.authToken, user = _a.user;
                        return [2 /*return*/, this.handle_new_session(__assign({ authToken: authToken }, user))];
                }
            });
        }); };
        /* using old api */
        // authenticate = async (email: string, password: string, o?: { expirationInSeconds?: number }) => (
        //   this.handle_new_session(
        //     await this.POST<
        //       {email: string, password: string, expirationInSeconds?: number }, 
        //       UserSession & { authToken: string }
        //     >('/submit-login', { email, password, ...o })
        //   )
        // ) 
        _this.logout = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.clearState();
                        return [4 /*yield*/, this.POST('/logout-api').catch(console.error)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.prepare_and_upload_file = function (details, file) { return __awaiter(_this, void 0, void 0, function () {
            var name, size, type, enduserId, publicRead, publicName, source, isCalledOut, externalId, _a, presignedUpload, createdFile;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        name = details.name, size = details.size, type = details.type, enduserId = details.enduserId, publicRead = details.publicRead, publicName = details.publicName, source = details.source, isCalledOut = details.isCalledOut, externalId = details.externalId;
                        return [4 /*yield*/, this.api.files.prepare_file_upload({ name: name, size: size, type: type, enduserId: enduserId, publicRead: publicRead, publicName: publicName, source: source, isCalledOut: isCalledOut, externalId: externalId })];
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
        _this.reset_db = function () { return _this.POST('/reset-demo'); };
        _this.test_online = function () { return _this.GET('/v1'); };
        _this.test_authenticated = function () { return _this.GET('/v1/test-authenticated'); };
        _this.sync = function (a) { return _this.GET('/v1/data-sync', a); };
        if (o === null || o === void 0 ? void 0 : o.userInfo)
            _this.userInfo = o.userInfo;
        var queries = loadDefaultQueries(_this);
        // removed
        // queries.journeys.update_state = ({id, name, updates}) => this._PATCH(`/v1/journey/${id}/state/${name}`, { updates })
        queries.journeys.delete_states = function (_a) {
            var id = _a.id, states = _a.states;
            return _this._DELETE("/v1/journey/".concat(id, "/states"), { states: states });
        };
        queries.journeys.handle_incoming_communication = function (a) { return (_this._POST("/v1".concat(schema.journeys.customActions.handle_incoming_communication.path), a)); };
        queries.journeys.get_journey_statistics = function (a) { return _this._GET("/v1".concat(schema.journeys.customActions.get_journey_statistics.path), a); };
        queries.enduser_orders.get_available_tests = function (a) { return _this._GET("/v1".concat(schema.enduser_orders.customActions.get_available_tests.path), a); };
        queries.enduser_orders.create_lab_order = function (a) { return _this._POST("/v1".concat(schema.enduser_orders.customActions.create_lab_order.path), a); };
        queries.enduser_orders.create_go_go_meds_order = function (a) { return _this._POST("/v1".concat(schema.enduser_orders.customActions.create_go_go_meds_order.path), a); };
        queries.enduser_orders.create_smart_meter_order = function (a) { return _this._POST("/v1".concat(schema.enduser_orders.customActions.create_smart_meter_order.path), a); };
        queries.endusers.set_password = function (args) { return _this._POST("/v1/set-enduser-password", args); };
        queries.endusers.add_to_healthie_course = function (a) { return _this._POST("/v1".concat(schema.endusers.customActions.add_to_healthie_course.path), a); };
        queries.endusers.add_to_journey = function (a) { return _this._POST("/v1".concat(schema.endusers.customActions.add_to_journey.path), a); };
        queries.endusers.remove_from_journey = function (a) { return _this._POST("/v1".concat(schema.endusers.customActions.remove_from_journey.path), a); };
        queries.endusers.is_authenticated = function (_a) {
            var id = _a.id, authToken = _a.authToken;
            return _this._GET("/v1/enduser-is-authenticated", { id: id, authToken: authToken });
        };
        queries.endusers.generate_auth_token = function (args) { return _this._GET("/v1/generate-enduser-auth-token", args); };
        queries.endusers.merge = function (a) { return _this._POST("/v1".concat(schema.endusers.customActions.merge.path), a); };
        queries.endusers.push = function (a) { return _this._POST("/v1".concat(schema.endusers.customActions.push.path), a); };
        queries.endusers.bulk_update = function (a) { return _this._PATCH("/v1".concat(schema.endusers.customActions.bulk_update.path), a); };
        queries.endusers.bulk_assignment = function (a) { return _this._PATCH("/v1".concat(schema.endusers.customActions.bulk_assignment.path), a); };
        queries.endusers.get_report = function (a) { return _this._GET("/v1/".concat(schema.endusers.customActions.get_report.path), a); };
        queries.endusers.related_contacts_report = function (a) { return _this._GET("/v1/".concat(schema.endusers.customActions.related_contacts_report.path), a); };
        queries.endusers.get_engagement_statistics = function (a) { return _this._GET("/v1/".concat(schema.endusers.customActions.get_engagement_statistics.path), a); };
        queries.endusers.get_engagement_statistics_by_userId = function (a) { return _this._GET("/v1/".concat(schema.endusers.customActions.get_engagement_statistics_by_userId.path), a); };
        queries.endusers.sync_zendesk = function (a) { return _this._POST("/v1".concat(schema.endusers.customActions.sync_zendesk.path), a); };
        queries.endusers.get_journeys_report = function (a) { return _this._POST("/v1".concat(schema.endusers.customActions.get_journeys_report.path), a); };
        queries.endusers.check_eligibility = function (a) { return _this._POST("/v1".concat(schema.endusers.customActions.check_eligibility.path), a); };
        queries.endusers.dosespot = function (a) { return _this._POST("/v1".concat(schema.endusers.customActions.dosespot.path), a); };
        queries.endusers.customer_io_sync = function (a) { return _this._POST("/v1".concat(schema.endusers.customActions.customer_io_sync.path), a); };
        queries.users.display_names = function () { return _this._GET("/v1/user-display-names"); };
        queries.users.begin_sso = function (a) { return _this._POST("/v1/".concat(schema.users.publicActions.begin_sso.path), a); };
        queries.users.complete_sso = function (a) { return _this._POST("/v1/".concat(schema.users.publicActions.complete_sso.path), a); };
        queries.users.register = function (args) { return _this._POST("/v1".concat(schema.users.publicActions.register.path), args); };
        queries.users.login = function (args) { return _this._POST("/v1".concat(schema.users.publicActions.login.path), args); };
        queries.users.login_with_google = function (args) { return _this._POST("/v1".concat(schema.users.publicActions.login_with_google.path), args); };
        queries.users.request_password_reset = function (args) { return _this._POST("/v1".concat(schema.users.publicActions.request_password_reset.path), args); };
        queries.users.submit_email_verification = function (args) { return _this._POST("/v1".concat(schema.users.publicActions.submit_email_verification.path), args); };
        queries.users.reset_password = function (args) { return _this._POST("/v1".concat(schema.users.publicActions.reset_password.path), args); };
        queries.users.generate_auth_token = function (args) { return _this._GET("/v1/".concat(schema.users.customActions.generate_auth_token.path), args); };
        queries.users.send_invitation_to_existing = function (args) { return _this._POST("/v1/".concat(schema.users.customActions.send_invitation_to_existing.path), args); };
        queries.users.invite_user = function (a) { return _this._POST("/v1/".concat(schema.users.customActions.invite_user.path), a); };
        queries.users.configure_inbox = function (a) { return _this._POST("/v1/".concat(schema.users.customActions.configure_inbox.path), a); };
        queries.users.consent = function (a) { return _this._PATCH("/v1/".concat(schema.users.customActions.consent.path), a); };
        queries.users.get_engagement_report = function (a) { return _this._GET("/v1/".concat(schema.users.customActions.get_engagement_report.path), a); };
        queries.users.get_users_for_groups = function (a) { return _this._GET("/v1/".concat(schema.users.customActions.get_users_for_groups.path), a); };
        queries.users.configure_MFA = function (a) { return _this._POST("/v1/".concat(schema.users.customActions.configure_MFA.path), a); };
        queries.users.generate_MFA_challenge = function (a) { return _this._POST("/v1/".concat(schema.users.customActions.generate_MFA_challenge.path), a); };
        queries.users.submit_MFA_challenge = function (a) { return _this._POST("/v1/".concat(schema.users.customActions.submit_MFA_challenge.path), a); };
        /** @deprecated */ //  keep here as well for backwards compatibility
        queries.organizations.invite_user = function (a) { return _this._POST("/v1/".concat(schema.users.customActions.invite_user.path), a); };
        queries.forms.get_form_statistics = function (args) { return _this._GET("/v1".concat(schema.forms.customActions.get_form_statistics.path), args); };
        queries.form_fields.load_choices_from_database = function (args) { return _this._GET("/v1".concat(schema.form_fields.customActions.load_choices_from_database.path), args); };
        queries.form_fields.booking_info = function (args) { return _this._GET("/v1".concat(schema.form_fields.customActions.booking_info.path), args); };
        queries.form_responses.prepare_form_response = function (args) { return _this._POST("/v1".concat(schema.form_responses.customActions.prepare_form_response.path), args); };
        queries.form_responses.submit_form_response = function (args) { return _this._PATCH("/v1".concat(schema.form_responses.customActions.submit_form_response.path), args); };
        queries.form_responses.save_field_response = function (args) { return _this._PATCH("/v1".concat(schema.form_responses.customActions.save_field_response.path), args); };
        queries.form_responses.info_for_access_code = function (args) { return _this._GET("/v1".concat(schema.form_responses.customActions.info_for_access_code.path), args); };
        queries.form_responses.stripe_details = function (args) { return _this._GET("/v1".concat(schema.form_responses.customActions.stripe_details.path), args); };
        queries.form_responses.chargebee_details = function (args) { return _this._GET("/v1".concat(schema.form_responses.customActions.chargebee_details.path), args); };
        queries.form_responses.push_to_EHR = function (args) { return _this._POST("/v1".concat(schema.form_responses.customActions.push_to_EHR.path), args); };
        queries.form_responses.get_report = function (a) { return _this._POST("/v1/".concat(schema.form_responses.customActions.get_report.path), a); };
        queries.form_responses.get_enduser_statistics = function (a) { return _this._POST("/v1/".concat(schema.form_responses.customActions.get_enduser_statistics.path), a); };
        queries.form_responses.get_enduser_statistics_by_submitter = function (a) { return _this._POST("/v1/".concat(schema.form_responses.customActions.get_enduser_statistics_by_submitter.path), a); };
        queries.form_responses.get_related_forms_report = function (a) { return _this._POST("/v1/".concat(schema.form_responses.customActions.get_related_forms_report.path), a); };
        queries.form_responses.get_distribution_report = function (a) { return _this._POST("/v1/".concat(schema.form_responses.customActions.get_distribution_report.path), a); };
        // need arraybuffer response type, see tests.ts
        // queries.form_responses.generate_pdf = (args) => (
        //   this._GET(`/v1${schema.form_responses.customActions.generate_pdf.path}`, args)
        // )
        queries.files.prepare_file_upload = function (args) { return _this._POST("/v1/prepare-file-upload", args); };
        queries.files.confirm_file_upload = function (a) { return _this._POST("/v1".concat(schema.files.customActions.confirm_file_upload.path), a); };
        queries.files.send_fax = function (a) { return _this._POST("/v1".concat(schema.files.customActions.send_fax.path), a); };
        queries.files.file_download_URL = function (a) { return _this._GET('/v1/file-download-URL', a); };
        queries.files.run_ocr = function (a) { return _this._POST("/v1".concat(schema.files.customActions.run_ocr.path), a); };
        queries.chat_rooms.join_room = function (a) { return _this._POST('/v1/join-chat-room', a); };
        queries.chat_rooms.display_info = function (a) { return _this._GET("/v1".concat(schema.chat_rooms.customActions.display_info.path), a); };
        queries.chat_rooms.mark_read = function (a) { return _this._POST("/v1".concat(schema.chat_rooms.customActions.mark_read.path), a); };
        queries.chat_rooms.send_healthie_chat = function (a) { return _this._POST("/v1".concat(schema.chat_rooms.customActions.send_healthie_chat.path), a); };
        queries.meetings.start_meeting = function (a) { return _this._POST('/v1/start-meeting', a); };
        queries.meetings.end_meeting = function (a) { return _this._POST('/v1/end-meeting', a); };
        queries.meetings.add_attendees_to_meeting = function (a) { return _this._POST('/v1/add-attendees-to-meeting', a); };
        queries.meetings.attendee_info = function (a) { return _this._GET('/v1/attendee-info', a); };
        queries.meetings.my_meetings = function () { return _this._GET('/v1/my-meetings'); };
        queries.meetings.send_invite = function (a) { return _this._POST("/v1".concat(schema.meetings.customActions.send_invite.path), a); };
        queries.meetings.start_meeting_for_event = function (a) { return _this._POST("/v1".concat(schema.meetings.customActions.start_meeting_for_event.path), a); };
        queries.meetings.join_meeting_for_event = function (a) { return _this._POST("/v1".concat(schema.meetings.customActions.join_meeting_for_event.path), a); };
        queries.webhooks.configure = function (a) { return _this._POST('/v1/configure-webhooks', a); };
        queries.webhooks.update = function (a) { return _this._PATCH('/v1/update-webhooks', a); };
        queries.webhooks.send_automation_webhook = function (a) { return _this._POST("/v1".concat(schema.webhooks.customActions.send_automation_webhook.path), a); };
        queries.webhooks.get_configuration = function (a) { return _this._GET("/v1".concat(schema.webhooks.customActions.get_configuration.path), a); };
        queries.user_notifications.send_user_email_notification = function (a) { return _this._POST("/v1".concat(schema.user_notifications.customActions.send_user_email_notification.path), a); },
            queries.user_notifications.bulk_update = function (a) { return _this._POST("/v1".concat(schema.user_notifications.customActions.bulk_update.path), a); },
            queries.post_likes.create = function (args) { return _this._POST("/v1".concat(schema.post_likes.customActions.create.path), args); };
        queries.post_likes.unlike_post = function (args) { return _this._POST("/v1".concat(schema.post_likes.customActions.unlike_post.path), args); };
        queries.organizations.get_theme = function (a) { return _this._GET("/v1/".concat(schema.organizations.publicActions.get_theme.path), a); };
        queries.organizations.create_suborganization = function (a) { return _this._POST("/v1/".concat(schema.organizations.customActions.create_suborganization.path), a); };
        queries.organizations.create_and_join = function (a) { return _this._POST("/v1".concat(schema.organizations.customActions.create_and_join.path), a); };
        queries.organizations.add_athena_subscription = function (a) { return _this._POST("/v1".concat(schema.organizations.customActions.add_athena_subscription.path), a); };
        queries.organizations.sync_athena_subscription = function (a) { return _this._POST("/v1".concat(schema.organizations.customActions.sync_athena_subscription.path), a); };
        queries.organizations.sync_note_to_canvas = function (a) { return _this._POST("/v1".concat(schema.organizations.customActions.sync_note_to_canvas.path), a); };
        queries.organizations.link_twilio = function (a) { return _this._POST("/v1".concat(schema.organizations.customActions.link_twilio.path), a); };
        queries.organizations.load_twilio_embed = function (a) { return _this._GET("/v1".concat(schema.organizations.customActions.load_twilio_embed.path), a); };
        queries.integrations.update_zoom = function (args) { return _this._POST("/v1".concat(schema.integrations.customActions.update_zoom.path), args); };
        queries.integrations.load_payers = function (args) { return _this._GET("/v1".concat(schema.integrations.customActions.load_payers.path), args); };
        queries.integrations.proxy_read = function (args) { return _this._GET("/v1".concat(schema.integrations.customActions.proxy_read.path), args); };
        queries.integrations.generate_google_auth_url = function (a) { return _this._POST("/v1/".concat(schema.integrations.customActions.generate_google_auth_url.path), a); };
        queries.integrations.disconnect_google_integration = function (a) { return _this._POST("/v1/".concat(schema.integrations.customActions.disconnect_google_integration.path), a); };
        queries.integrations.refresh_oauth2_session = function (a) { return _this._POST("/v1/".concat(schema.integrations.customActions.refresh_oauth2_session.path), a); };
        queries.integrations.generate_oauth2_auth_url = function (a) { return _this._POST("/v1/".concat(schema.integrations.customActions.generate_oauth2_auth_url.path), a); };
        queries.integrations.disconnect_oauth2_integration = function (a) { return _this._POST("/v1/".concat(schema.integrations.customActions.disconnect_oauth2_integration.path), a); };
        queries.integrations.connect_stripe = function (a) { return _this._POST("/v1/".concat(schema.integrations.customActions.connect_stripe.path), a); };
        queries.integrations.add_api_key_integration = function (a) { return _this._POST("/v1/".concat(schema.integrations.customActions.add_api_key_integration.path), a); };
        queries.integrations.remove_api_key_integration = function (a) { return _this._DELETE("/v1/".concat(schema.integrations.customActions.remove_api_key_integration.path), a); };
        queries.integrations.sync_ehr = function (a) { return _this._POST("/v1/".concat(schema.integrations.customActions.sync_ehr.path), a); };
        queries.integrations.daily_sync = function (a) { return _this._POST("/v1".concat(schema.integrations.customActions.daily_sync.path), a); };
        queries.integrations.connect_photon = function (a) { return _this._POST("/v1/".concat(schema.integrations.customActions.connect_photon.path), a); };
        queries.integrations.disconnect_photon = function (a) { return _this._POST("/v1/".concat(schema.integrations.customActions.disconnect_photon.path), a); };
        queries.integrations.connect_elation = function (a) { return _this._POST("/v1".concat(schema.integrations.customActions.connect_elation.path), a); };
        queries.integrations.disconnect_elation = function (a) { return _this._POST("/v1".concat(schema.integrations.customActions.disconnect_elation.path), a); };
        queries.integrations.connect_zendesk = function (a) { return _this._POST("/v1".concat(schema.integrations.customActions.connect_zendesk.path), a); };
        queries.integrations.disconnect_zendesk = function (a) { return _this._POST("/v1".concat(schema.integrations.customActions.disconnect_zendesk.path), a); };
        queries.emails.sync_integrations = function (a) { return _this._POST("/v1/".concat(schema.emails.customActions.sync_integrations.path), a); };
        queries.emails.deliver_via_outlook = function (a) { return _this._POST("/v1/".concat(schema.emails.customActions.deliver_via_outlook.path), a); };
        queries.emails.deliver_via_iterable = function (a) { return _this._POST("/v1/".concat(schema.emails.customActions.deliver_via_iterable.path), a); };
        queries.emails.send_with_template = function (a) { return _this._POST("/v1/".concat(schema.emails.customActions.send_with_template.path), a); };
        queries.emails.get_template_report = function (a) { return _this._GET("/v1/".concat(schema.emails.customActions.get_template_report.path), a); };
        queries.calendar_events.session_for_start_link = function (a) { return _this._GET("/v1".concat(schema.calendar_events.publicActions.session_for_start_link.path), a); };
        queries.calendar_events.get_events_for_user = function (a) { return _this._GET("/v1/".concat(schema.calendar_events.customActions.get_events_for_user.path), a); };
        queries.calendar_events.load_events = function (a) { return _this._GET("/v1/".concat(schema.calendar_events.customActions.load_events.path), a); };
        queries.calendar_events.generate_meeting_link = function (a) { return _this._POST("/v1/".concat(schema.calendar_events.customActions.generate_meeting_link.path), a); };
        queries.calendar_events.generate_zoom_meeting = function (a) { return _this._POST("/v1/".concat(schema.calendar_events.customActions.generate_zoom_meeting.path), a); };
        queries.calendar_events.change_zoom_host = function (a) { return _this._POST("/v1/".concat(schema.calendar_events.customActions.change_zoom_host.path), a); };
        queries.calendar_events.get_report = function (a) { return _this._POST("/v1".concat(schema.calendar_events.customActions.get_report.path), a); };
        queries.calendar_events.get_enduser_report = function (a) { return _this._POST("/v1".concat(schema.calendar_events.customActions.get_enduser_report.path), a); };
        queries.calendar_events.get_appointment_availability = function (a) { return _this._GET("/v1".concat(schema.calendar_events.customActions.get_appointment_availability.path), a); };
        queries.calendar_events.push = function (a) { return _this._POST("/v1".concat(schema.calendar_events.customActions.push.path), a); };
        // this returns an array buffer, avoid using for copy + paste
        queries.calendar_events.download_ics_file = function (a) { return _this._GET("/v1".concat(schema.calendar_events.customActions.download_ics_file.path), a, true, { responseType: 'arraybuffer' }); };
        // 
        queries.phone_calls.get_report = function (a) { return _this._GET("/v1/".concat(schema.phone_calls.customActions.get_report.path), a); };
        queries.phone_calls.authenticate_calling = function (a) { return _this._POST("/v1".concat(schema.phone_calls.customActions.authenticate_calling.path), a); };
        queries.phone_calls.upgrade_to_conference = function (a) { return _this._POST("/v1".concat(schema.phone_calls.customActions.upgrade_to_conference.path), a); };
        queries.phone_calls.add_conference_attendees = function (a) { return _this._POST("/v1".concat(schema.phone_calls.customActions.add_conference_attendees.path), a); };
        queries.phone_calls.remove_conference_attendees = function (a) { return _this._POST("/v1".concat(schema.phone_calls.customActions.remove_conference_attendees.path), a); };
        queries.phone_calls.end_conference = function (a) { return _this._POST("/v1".concat(schema.phone_calls.customActions.end_conference.path), a); };
        queries.phone_calls.cancel_recording = function (a) { return _this._POST("/v1".concat(schema.phone_calls.customActions.cancel_recording.path), a); };
        queries.phone_calls.delete_recordings = function (a) { return _this._POST("/v1".concat(schema.phone_calls.customActions.delete_recordings.path), a); };
        queries.phone_calls.get_number_report = function (a) { return _this._GET("/v1".concat(schema.phone_calls.customActions.get_number_report.path), a); };
        queries.templates.get_templated_message = function (a) { return _this._POST("/v1/".concat(schema.templates.customActions.get_templated_message.path), a); };
        queries.templates.get_suggested_reply = function (a) { return _this._POST("/v1/".concat(schema.templates.customActions.get_suggested_reply.path), a); };
        queries.templates.create_embedding = function (a) { return _this._POST("/v1/".concat(schema.templates.customActions.create_embedding.path), a); };
        queries.templates.embedding_search = function (a) { return _this._POST("/v1/".concat(schema.templates.customActions.embedding_search.path), a); };
        queries.analytics_frames.get_result_for_query = function (a) { return _this._GET("/v1".concat(schema.analytics_frames.customActions.get_result_for_query.path), a); };
        queries.analytics_frames.get_custom_report = function (a) { return _this._GET("/v1".concat(schema.analytics_frames.customActions.get_custom_report.path), a); };
        queries.availability_blocks.update_order = function (a) { return _this._POST("/v1/".concat(schema.availability_blocks.customActions.update_order.path), a); };
        queries.availability_blocks.handle_autoreply = function (a) { return _this._POST("/v1/".concat(schema.availability_blocks.customActions.handle_autoreply.path), a); };
        queries.managed_content_records.load_unauthenticated = function (a) { return _this._GET("/v1/".concat(schema.managed_content_records.publicActions.load_unauthenticated.path), a); };
        queries.managed_content_records.generate_embedding = function (a) { return _this._POST("/v1/".concat(schema.managed_content_records.customActions.generate_embedding.path), a); };
        queries.managed_content_records.search = function (a) { return _this._POST("/v1/".concat(schema.managed_content_records.customActions.search.path), a); };
        queries.managed_content_records.update_indexes = function (a) { return _this._PATCH("/v1/".concat(schema.managed_content_records.customActions.update_indexes.path), a); };
        queries.automation_triggers.trigger_events = function (a) { return _this._POST("/v1/".concat(schema.automation_triggers.customActions.trigger_events.path), a); };
        queries.ticket_queues.update_indexes = function (a) { return _this._PATCH("/v1/".concat(schema.ticket_queues.customActions.update_indexes.path), a); };
        queries.tickets.update_indexes = function (a) { return _this._PATCH("/v1/".concat(schema.tickets.customActions.update_indexes.path), a); };
        queries.tickets.assign_from_queue = function (a) { return _this._PATCH("/v1/".concat(schema.tickets.customActions.assign_from_queue.path), a); };
        queries.tickets.get_report = function (a) { return _this._POST("/v1/".concat(schema.tickets.customActions.get_report.path), a); };
        queries.tickets.get_distribution_report = function (a) { return _this._POST("/v1/".concat(schema.tickets.customActions.get_distribution_report.path), a); };
        queries.tickets.close_ticket = function (a) { return _this._POST("/v1/".concat(schema.tickets.customActions.close_ticket.path), a); };
        queries.appointment_booking_pages.generate_access_token = function (a) { return _this._POST("/v1/".concat(schema.appointment_booking_pages.customActions.generate_access_token.path), a); };
        queries.sms_messages.send_message_to_number = function (a) { return _this._POST("/v1/".concat(schema.sms_messages.customActions.send_message_to_number.path), a); };
        queries.sms_messages.get_number_report = function (a) { return _this._GET("/v1/".concat(schema.sms_messages.customActions.get_number_report.path), a); };
        queries.sms_messages.get_template_report = function (a) { return _this._GET("/v1/".concat(schema.sms_messages.customActions.get_template_report.path), a); };
        queries.sms_messages.send_with_template = function (a) { return _this._POST("/v1/".concat(schema.sms_messages.customActions.send_with_template.path), a); };
        queries.purchases.charge_card_on_file = function (a) { return _this._POST("/v1/".concat(schema.purchases.customActions.charge_card_on_file.path), a); };
        queries.products.prepare_stripe_checkout = function (args) { return _this._POST("/v1".concat(schema.products.customActions.prepare_stripe_checkout.path), args); };
        queries.group_mms_conversations.start_conversation = function (args) { return _this._POST("/v1".concat(schema.group_mms_conversations.customActions.start_conversation.path), args); };
        queries.group_mms_conversations.send_message = function (args) { return _this._POST("/v1".concat(schema.group_mms_conversations.customActions.send_message.path), args); };
        queries.enduser_encounters.create_candid_encounter = function (args) { return _this._POST("/v1".concat(schema.enduser_encounters.customActions.create_candid_encounter.path), args); };
        queries.call_hold_queues.answer_call = function (args) { return _this._POST("/v1".concat(schema.call_hold_queues.customActions.answer_call.path), args); };
        queries.call_hold_queues.get_details = function (args) { return _this._GET("/v1".concat(schema.call_hold_queues.customActions.get_details.path), args); };
        queries.enduser_observations.load = function (args) { return _this._GET("/v1".concat(schema.enduser_observations.customActions.load.path), args); };
        queries.enduser_observations.acknowledge = function (args) { return _this._POST("/v1".concat(schema.enduser_observations.customActions.acknowledge.path), args); };
        queries.enduser_eligibility_results.develop_health_run_benefit_verification = function (args) { return _this._POST("/v1".concat(schema.enduser_eligibility_results.customActions.develop_health_run_benefit_verification.path), args); };
        queries.agent_records.submit_support_ticket = function (args) { return _this._POST("/v1".concat(schema.agent_records.customActions.submit_support_ticket.path), args); };
        queries.waitlists.grant_access_from_waitlist = function (args) { return _this._POST("/v1".concat(schema.waitlists.customActions.grant_access_from_waitlist.path), args); };
        _this.api = queries;
        return _this;
    }
    return Session;
}(SessionManager));
export { Session };
//# sourceMappingURL=sdk.js.map