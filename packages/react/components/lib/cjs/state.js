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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCallHoldQueues = exports.useEnduserProfileViews = exports.useGroupMMSConversations = exports.useEngagementEvents = exports.useCalendarEvents = exports.useVitalConfigurations = exports.useEnduserEncounters = exports.useFlowchartNotes = exports.useFormGroups = exports.useWebhookLogs = exports.useIntegrationLogs = exports.useEnduserOrders = exports.useEnduserMedications = exports.useEnduserProblems = exports.useDiagnosisCodes = exports.useAllergyCodes = exports.usePortalBrandings = exports.useMessageTemplateSnippets = exports.useFaxLogs = exports.useSuggestedContacts = exports.useAgentRecords = exports.useEnduserEligibilityResults = exports.useUserAndEnduserDisplayInfo = exports.useChatRoomDisplayInfo = exports.useListStateHook = exports.useSyncContext = exports.WithDataSync = exports.useDataSync____internal = exports.lastDataSync = exports.lastActiveForSync = exports.FAST_SYNC_INTERVAL = exports.MEDIUM_SYNC_INTERAVL = exports.DEFAULT_SYNC_INTERVAL_IN_MS = exports.INACTIVE_SYNC_INTERVAL_IN_MS = exports.ExtendedEnduserProvider = exports.EnduserProvider = exports.ExtendedUserProvider = exports.UserProvider = exports.useResetState = exports.sharedConfig = exports.createSliceForList = exports.remove_elements_in_array = exports.replace_elements_in_array = exports.update_elements_in_array = exports.add_elements_to_array = exports.toLoadedData = exports.WithFetchContext = exports.createTellescopeSelector = exports.TellescopeStoreContext = exports.resetStateAction = void 0;
exports.useCarePlans = exports.usePortalCustomizations = exports.useIntegrations = exports.useOrganization = exports.useOrganizations = exports.usePhoneCalls = exports.useEmailSyncDenials = exports.useTableViews = exports.useSuperbillProviders = exports.useSuperbills = exports.useTicketThreadComments = exports.useTicketThreads = exports.useRoleBasedAccessPermissions = exports.useCalendarEventRSVPs = exports.useCommentLikes = exports.usePostLikes = exports.usePostComments = exports.useForumPosts = exports.useForums = exports.useAssignedManagedContentRecords = exports.useManagedContentRecordAssignments = exports.useManagedContentRecords = exports.useEnduserObservations = exports.useUserDisplayInfo = exports.useFormResponses = exports.useFormFields = exports.useForms = exports.useTemplates = exports.useAvailabilityBlocks = exports.useNotes = exports.useAutomationSteps = exports.useUsers = exports.useJourneys = exports.useFiles = exports.useMeetings = exports.useTickets = exports.useEndusers = exports.useChats = exports.useChatRooms = exports.useEnduserCustomTypes = exports.useAnalyticsFrames = exports.useUserLogs = exports.useNotifications = exports.useSmsMessages = exports.useEmails = exports.useAutomatedActions = exports.useAutomationTriggers = exports.usePhoneTrees = exports.useConfigurations = exports.useTicketQueues = void 0;
exports.useWaitlists = exports.useCalendarEventsForUser = exports.usePrescriptionRoutes = exports.useBlockedPhones = exports.usePurchaseCredits = exports.usePurchases = exports.useProducts = exports.useDatabaseRecords = exports.useDatabases = exports.useAppointmentLocations = exports.useBackgroundErrors = exports.useEnduserViews = exports.useAppointmentBookingPages = exports.useCalendarEventTemplates = exports.useEnduserTasks = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var react_redux_1 = require("react-redux");
var toolkit_1 = require("@reduxjs/toolkit");
var types_utilities_1 = require("@tellescope/types-utilities");
var index_1 = require("./index");
var loading_1 = require("./loading");
var utilities_1 = require("@tellescope/utilities");
var RESET_CACHE_TYPE = "cache/reset";
exports.resetStateAction = (0, toolkit_1.createAction)(RESET_CACHE_TYPE);
exports.TellescopeStoreContext = react_1.default.createContext(null);
var createTellescopeSelector = function () { return (0, react_redux_1.createSelectorHook)(exports.TellescopeStoreContext); };
exports.createTellescopeSelector = createTellescopeSelector;
var FetchContext = (0, react_1.createContext)({});
var WithFetchContext = function (_a) {
    var children = _a.children;
    var lookupRef = react_1.default.useRef({});
    var lastIdRef = react_1.default.useRef({});
    var lastDateRef = react_1.default.useRef({});
    var reset = function () { return lookupRef.current = {}; };
    return ((0, jsx_runtime_1.jsx)(FetchContext.Provider, __assign({ value: {
            didFetch: function (s, force, refetchInMS) {
                var _a;
                if (refetchInMS === void 0) { refetchInMS = 5000; }
                var _b = (_a = lookupRef.current[s]) !== null && _a !== void 0 ? _a : {}, status = _b.status, lastFetch = _b.lastFetch;
                if (lastFetch + refetchInMS >= Date.now())
                    return true; // prevent more frequent reloads
                if (force)
                    return false; // trigger fetch when forced
                return status; // return true status
            },
            setFetched: function (s, b, timestamp) {
                var _a;
                if (timestamp === void 0) { timestamp = true; }
                lookupRef.current[s] = (_a = lookupRef.current[s]) !== null && _a !== void 0 ? _a : {};
                lookupRef.current[s].status = b;
                lookupRef.current[s].lastFetch = timestamp ? Date.now() : 0;
            },
            reset: reset,
            getLastId: function (m) { var _a; return (_a = lastIdRef.current) === null || _a === void 0 ? void 0 : _a[m]; },
            setLastId: function (m, id) { return lastIdRef.current[m] = id; },
            getLastDate: function (m) { var _a; return (_a = lastDateRef.current) === null || _a === void 0 ? void 0 : _a[m]; },
            setLastDate: function (m, d) { return lastDateRef.current[m] = d; },
        } }, { children: children })));
};
exports.WithFetchContext = WithFetchContext;
// doesn't throw
var toLoadedData = function (p, o) { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = { status: types_utilities_1.LoadingStatus.Loaded };
                return [4 /*yield*/, p()];
            case 1: return [2 /*return*/, (_a.value = _b.sent(), _a)];
            case 2:
                err_1 = _b.sent();
                if (o === null || o === void 0 ? void 0 : o.valueOnError) {
                    return [2 /*return*/, { status: types_utilities_1.LoadingStatus.Loaded, value: o.valueOnError }];
                }
                return [2 /*return*/, { status: types_utilities_1.LoadingStatus.Error, value: err_1 }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.toLoadedData = toLoadedData;
// default add to start
var add_elements_to_array = function (a, elements, options) {
    if (a.status !== types_utilities_1.LoadingStatus.Loaded)
        return { status: types_utilities_1.LoadingStatus.Loaded, value: elements };
    // original / default behavior
    if (!(options === null || options === void 0 ? void 0 : options.replaceIfMatch)) {
        var newValues_1 = elements.filter(function (e) { return a.value.find(function (v) { return v.id === e.id; }) === undefined; });
        return {
            status: types_utilities_1.LoadingStatus.Loaded,
            value: (options === null || options === void 0 ? void 0 : options.addTo) === 'end' ? __spreadArray(__spreadArray([], a.value, true), newValues_1, true) : __spreadArray(__spreadArray([], newValues_1, true), a.value, true)
        };
    }
    var newValues = elements.filter(function (e) { return a.value.find(function (v) { return v.id === e.id; }) === undefined; });
    var existingOrUpdatedValues = a.value.map(function (a) { var _a; return (_a = elements.find(function (e) { return e.id === a.id; })) !== null && _a !== void 0 ? _a : a; } // return a match, deferring to the new element, or keep existing when no match
    );
    return {
        status: types_utilities_1.LoadingStatus.Loaded,
        value: (options === null || options === void 0 ? void 0 : options.addTo) === 'end' ? __spreadArray(__spreadArray([], existingOrUpdatedValues, true), newValues, true) : __spreadArray(__spreadArray([], newValues, true), existingOrUpdatedValues, true)
    };
};
exports.add_elements_to_array = add_elements_to_array;
var update_elements_in_array = function (a, updates) {
    if (a.status !== types_utilities_1.LoadingStatus.Loaded)
        return a;
    return { status: types_utilities_1.LoadingStatus.Loaded, value: a.value.map(function (e) { return !!updates[e.id] ? __assign(__assign({}, e), updates[e.id]) : e; }) };
};
exports.update_elements_in_array = update_elements_in_array;
var replace_elements_in_array = function (a, updated) {
    if (a.status !== types_utilities_1.LoadingStatus.Loaded)
        return a;
    return { status: types_utilities_1.LoadingStatus.Loaded, value: a.value.map(function (e) { return !!updated[e.id] ? updated[e.id] : e; }) };
};
exports.replace_elements_in_array = replace_elements_in_array;
var remove_elements_in_array = function (a, ids) {
    if (a.status !== types_utilities_1.LoadingStatus.Loaded)
        return a;
    return { status: types_utilities_1.LoadingStatus.Loaded, value: a.value.filter(function (v) { return !ids.includes(v.id); }) };
};
exports.remove_elements_in_array = remove_elements_in_array;
var createSliceForList = function (name) { return (0, toolkit_1.createSlice)({
    name: name,
    initialState: types_utilities_1.UNLOADED,
    reducers: {
        set: function (_, action) { return action.payload.value; },
        setFetching: function (s) { return s.status === types_utilities_1.LoadingStatus.Unloaded ? { status: types_utilities_1.LoadingStatus.Fetching, value: undefined } : s; },
        add: function (state, action) { return (0, exports.add_elements_to_array)(state, [action.payload.value], action.payload.options); },
        addSome: function (state, action) { return (0, exports.add_elements_to_array)(state, action.payload.value, action.payload.options); },
        update: function (state, action) {
            var _a;
            var _b;
            return (0, exports.update_elements_in_array)(state, (_a = {},
                _a[action.payload.value.id] = __assign(__assign({}, action.payload.value.updates), { updatedAt: (_b = action.payload.updatedAt) !== null && _b !== void 0 ? _b : new Date().toString() }),
                _a));
        },
        replace: function (state, action) {
            var _a;
            return (0, exports.replace_elements_in_array)(state, (_a = {}, _a[action.payload.value.id] = action.payload.value.updated, _a));
        },
        updateSome: function (state, action) { return (0, exports.update_elements_in_array)(state, action.payload.value); },
        modifyElements: function (state, action) {
            if (state.status !== types_utilities_1.LoadingStatus.Loaded)
                return state;
            for (var i = 0; i < state.value.length; i++) {
                var element = state.value[i];
                if (action.payload.value.filter(element)) {
                    state.value[i] = action.payload.value.modifier(element);
                }
            }
            return state;
        },
        remove: function (s, a) { return (0, exports.remove_elements_in_array)(s, [a.payload.value.id]); },
        removeSome: function (s, a) { return (0, exports.remove_elements_in_array)(s, a.payload.value.ids); },
    },
    extraReducers: function (builder) {
        builder.addCase(exports.resetStateAction, function () {
            return types_utilities_1.UNLOADED;
        });
    },
}); };
exports.createSliceForList = createSliceForList;
// export type GCalEventTime = { dateTime: string, date: never } | { dateTime: never, date: string /* YYYY-MM-DD */  }
// export type GCalEvent = {
//   id: string,
//   summary: string,
//   start: GCalEventTime,
//   end: GCalEventTime,
// }
var appointmentBookingPagesSlice = (0, exports.createSliceForList)('appointment_booking_pages');
var appointmentLocationsSlice = (0, exports.createSliceForList)('appointment_locations');
var chatRoomsSlice = (0, exports.createSliceForList)('chat_rooms');
var calendarEventsSlice = (0, exports.createSliceForList)('calendar_events');
var calendarEventTemplatesSlice = (0, exports.createSliceForList)('calendar_event_templates');
var chatsSlice = (0, exports.createSliceForList)('chats');
var chatRoomDisplayInfoslice = (0, exports.createSliceForList)('chat-room-display-info');
var engagementEventsSlice = (0, exports.createSliceForList)('engagement_events');
var emailsSlice = (0, exports.createSliceForList)('email');
var smsMessagesSlice = (0, exports.createSliceForList)('sms_messages');
var userNotifcationsSlice = (0, exports.createSliceForList)('user_notifications');
var endusersSlice = (0, exports.createSliceForList)('endusers');
var ticketsSlice = (0, exports.createSliceForList)('tickets');
var meetingsSlice = (0, exports.createSliceForList)('meetings');
var filesSlice = (0, exports.createSliceForList)('files');
var notesSlice = (0, exports.createSliceForList)('notes');
var templatesSlice = (0, exports.createSliceForList)('templates');
var formsSlice = (0, exports.createSliceForList)('forms');
var formsFieldsSlice = (0, exports.createSliceForList)('form_fields');
var formResponsesSlice = (0, exports.createSliceForList)('form_response');
var journeysSlice = (0, exports.createSliceForList)('journeys');
var usersSlice = (0, exports.createSliceForList)('users');
var automationStepsSlice = (0, exports.createSliceForList)('automations_steps');
var usersDisplaySlice = (0, exports.createSliceForList)('users');
var integrationsSlice = (0, exports.createSliceForList)('integrations');
var databasesSlice = (0, exports.createSliceForList)('databases');
var databaseRecordsSlice = (0, exports.createSliceForList)('database_records');
var portalCustomizationsSlice = (0, exports.createSliceForList)('portal_customizations');
var carePlansSlice = (0, exports.createSliceForList)('care_plans');
var enduserTasksSlice = (0, exports.createSliceForList)('enduser_tasks');
var productsSlice = (0, exports.createSliceForList)('products');
var purchasesSlice = (0, exports.createSliceForList)('purchases');
var purchaseCreditsSlice = (0, exports.createSliceForList)('purchase_credits');
var phoneCallsSlice = (0, exports.createSliceForList)('phone_calls');
var analyticsFramesSlice = (0, exports.createSliceForList)('analytics_frames');
var enduserViewsSlice = (0, exports.createSliceForList)('enduser_views');
var backgroundErrorsSlice = (0, exports.createSliceForList)('background_errors');
var automationTriggersSlice = (0, exports.createSliceForList)('automation_triggers');
var superbillsSlice = (0, exports.createSliceForList)('superbills');
var superbillProvidersSlice = (0, exports.createSliceForList)('superbill_providers');
var enduserProfileViewsSlice = (0, exports.createSliceForList)('enduser_profile_views');
var phoneTreesSlice = (0, exports.createSliceForList)('phone_trees');
var tableViewsSlice = (0, exports.createSliceForList)('table_views');
var emailSyncDenialsSlice = (0, exports.createSliceForList)('email_sync_denials');
var automatedActionsSlice = (0, exports.createSliceForList)('automated_actions');
var groupMMSConversationsSlice = (0, exports.createSliceForList)('group_mms_conversations');
var blockedPhonesSlice = (0, exports.createSliceForList)('blocked_phones');
var prescriptionRoutesSlice = (0, exports.createSliceForList)('prescription_routes');
var enduserProblemsSlice = (0, exports.createSliceForList)('enduser_problems');
var enduserObservationsSlice = (0, exports.createSliceForList)('enduser_observations');
var forumsSlice = (0, exports.createSliceForList)('forums');
var forumPostsSlice = (0, exports.createSliceForList)('forum_posts');
var managedContentRecoredsSlice = (0, exports.createSliceForList)('managed_content_records');
var managedContentRecoredAssignmentsSlice = (0, exports.createSliceForList)('managed_content_record_assignments');
var postCommentsSlice = (0, exports.createSliceForList)('post_comments');
var postLikesSlice = (0, exports.createSliceForList)('post_likes');
var commentLikesSlice = (0, exports.createSliceForList)('comment_likes');
var organizationsSlice = (0, exports.createSliceForList)('organizations');
var availabilityBlocksSlice = (0, exports.createSliceForList)('availability_blocks');
var enduserMedicationsSlice = (0, exports.createSliceForList)('enduser_medications');
var enduserCustomTypesSlice = (0, exports.createSliceForList)('enduser_custom_types');
var ticketThreadsSlice = (0, exports.createSliceForList)('ticket_threads');
var ticketThreadCommentsSlice = (0, exports.createSliceForList)('ticket_thread_comments');
var configurationsSlice = (0, exports.createSliceForList)('configurations');
var ticketQueuesSlice = (0, exports.createSliceForList)('ticket_queues');
var callHoldQueuesSlice = (0, exports.createSliceForList)('call_hold_queues');
var enduserOrdersSlice = (0, exports.createSliceForList)('enduser_orders');
var enduserEncountersSlice = (0, exports.createSliceForList)('enduser_encounters');
var vitalConfigurationsSlice = (0, exports.createSliceForList)('vital_configurations');
var flowchartNotesSlice = (0, exports.createSliceForList)('flowchart_notes');
var webhookLogsSlice = (0, exports.createSliceForList)('webhook_logs');
var formGroupsSlice = (0, exports.createSliceForList)('form_groups');
var portalBrandingsSlice = (0, exports.createSliceForList)('portal_brandings');
var messageTemplateSnippetsSlice = (0, exports.createSliceForList)('message_template_snippets');
var faxLogsSlice = (0, exports.createSliceForList)('fax_logs');
var suggestedContactsSlice = (0, exports.createSliceForList)('suggested_contacts');
var diagnosisCodesSlice = (0, exports.createSliceForList)('diagnosis_codes');
var allergyCodesSlice = (0, exports.createSliceForList)('allergy_codes');
var integrationLogsSlice = (0, exports.createSliceForList)('integration_logs');
var enduserEligibilityResultsSlice = (0, exports.createSliceForList)('enduser_eligibility_results');
var agentRecordsSlice = (0, exports.createSliceForList)('agent_records');
var waitlistsSlice = (0, exports.createSliceForList)('waitlists');
var roleBasedAccessPermissionsSlice = (0, exports.createSliceForList)('role_based_access_permissions');
var calendarEventRSVPsSlice = (0, exports.createSliceForList)('calendar_event_rsvps');
var userLogsSlice = (0, exports.createSliceForList)('user_logs');
exports.sharedConfig = {
    reducer: {
        agent_records: agentRecordsSlice.reducer,
        enduser_eligibility_results: enduserEligibilityResultsSlice.reducer,
        integration_logs: integrationLogsSlice.reducer,
        ticket_queues: ticketQueuesSlice.reducer,
        automation_triggers: automationTriggersSlice.reducer,
        automated_actions: automatedActionsSlice.reducer,
        enduser_views: enduserViewsSlice.reducer,
        background_errors: backgroundErrorsSlice.reducer,
        availability_blocks: availabilityBlocksSlice.reducer,
        chat_rooms: chatRoomsSlice.reducer,
        chats: chatsSlice.reducer,
        chatRoomDisplayInfo: chatRoomDisplayInfoslice.reducer,
        calendar_events: calendarEventsSlice.reducer,
        calendar_event_templates: calendarEventTemplatesSlice.reducer,
        configurations: configurationsSlice.reducer,
        engagement_events: engagementEventsSlice.reducer,
        emails: emailsSlice.reducer,
        sms_messages: smsMessagesSlice.reducer,
        user_notifications: userNotifcationsSlice.reducer,
        endusers: endusersSlice.reducer,
        tickets: ticketsSlice.reducer,
        meetings: meetingsSlice.reducer,
        files: filesSlice.reducer,
        notes: notesSlice.reducer,
        templates: templatesSlice.reducer,
        forms: formsSlice.reducer,
        form_fields: formsFieldsSlice.reducer,
        form_responses: formResponsesSlice.reducer,
        journeys: journeysSlice.reducer,
        users: usersSlice.reducer,
        users_display: usersDisplaySlice.reducer,
        automation_steps: automationStepsSlice.reducer,
        enduser_observations: enduserObservationsSlice.reducer,
        forum_posts: forumPostsSlice.reducer,
        forums: forumsSlice.reducer,
        managed_content_records: managedContentRecoredsSlice.reducer,
        managed_content_record_assignments: managedContentRecoredAssignmentsSlice.reducer,
        post_comments: postCommentsSlice.reducer,
        post_likes: postLikesSlice.reducer,
        comment_likes: commentLikesSlice.reducer,
        integrations: integrationsSlice.reducer,
        organizations: organizationsSlice.reducer,
        calendar_event_RSVPs: calendarEventRSVPsSlice.reducer,
        databases: databasesSlice.reducer,
        database_records: databaseRecordsSlice.reducer,
        portal_customizations: portalCustomizationsSlice.reducer,
        enduser_tasks: enduserTasksSlice.reducer,
        care_plans: carePlansSlice.reducer,
        role_based_access_permissions: roleBasedAccessPermissionsSlice.reducer,
        appointment_booking_pages: appointmentBookingPagesSlice.reducer,
        appointment_locations: appointmentLocationsSlice.reducer,
        products: productsSlice.reducer,
        purchases: purchasesSlice.reducer,
        purchase_credits: purchaseCreditsSlice.reducer,
        phone_calls: phoneCallsSlice.reducer,
        phone_trees: phoneTreesSlice.reducer,
        analytics_frames: analyticsFramesSlice.reducer,
        superbills: superbillsSlice.reducer,
        superbill_providers: superbillProvidersSlice.reducer,
        enduser_profile_views: enduserProfileViewsSlice.reducer,
        enduser_medications: enduserMedicationsSlice.reducer,
        enduser_custom_types: enduserCustomTypesSlice.reducer,
        user_logs: userLogsSlice.reducer,
        table_views: tableViewsSlice.reducer,
        email_sync_denials: emailSyncDenialsSlice.reducer,
        ticket_threads: ticketThreadsSlice.reducer,
        ticket_thread_comments: ticketThreadCommentsSlice.reducer,
        group_mms_conversations: groupMMSConversationsSlice.reducer,
        enduser_orders: enduserOrdersSlice.reducer,
        enduser_encounters: enduserEncountersSlice.reducer,
        vital_configurations: vitalConfigurationsSlice.reducer,
        blocked_phones: blockedPhonesSlice.reducer,
        prescription_routes: prescriptionRoutesSlice.reducer,
        enduser_problems: enduserProblemsSlice.reducer,
        flowchart_notes: flowchartNotesSlice.reducer,
        webhook_logs: webhookLogsSlice.reducer,
        form_groups: formGroupsSlice.reducer,
        portal_brandings: portalBrandingsSlice.reducer,
        message_template_snippets: messageTemplateSnippetsSlice.reducer,
        fax_logs: faxLogsSlice.reducer,
        call_hold_queues: callHoldQueuesSlice.reducer,
        suggested_contacts: suggestedContactsSlice.reducer,
        diagnosis_codes: diagnosisCodesSlice.reducer,
        allergy_codes: allergyCodesSlice.reducer,
        waitlists: waitlistsSlice.reducer,
    },
};
var _store = (0, toolkit_1.configureStore)(exports.sharedConfig);
var useResetState = function () {
    var dispatch = useTellescopeDispatch();
    var resetContext = react_1.default.useContext(FetchContext).reset;
    return function () {
        resetContext(); // resets fetch cache context
        dispatch({ type: RESET_CACHE_TYPE }); // resets Redux state
    };
    // _store.dispatch({ type: RESET_CACHE_TYPE })
};
exports.useResetState = useResetState;
var useTypedSelector = (0, exports.createTellescopeSelector)();
var useTellescopeDispatch = (0, react_redux_1.createDispatchHook)(exports.TellescopeStoreContext);
var UserProvider = function (props) { return ((0, jsx_runtime_1.jsx)(exports.WithFetchContext, { children: (0, jsx_runtime_1.jsx)(exports.WithDataSync, { children: (0, jsx_runtime_1.jsx)(react_redux_1.Provider, __assign({ store: _store, context: exports.TellescopeStoreContext }, { children: props.children })) }) })); };
exports.UserProvider = UserProvider;
var ExtendedUserProvider = function (props) { return ((0, jsx_runtime_1.jsx)(exports.WithFetchContext, { children: (0, jsx_runtime_1.jsx)(react_redux_1.Provider, __assign({ context: exports.TellescopeStoreContext, store: props.store }, { children: props.children })) })); };
exports.ExtendedUserProvider = ExtendedUserProvider;
var EnduserProvider = function (props) { return ((0, jsx_runtime_1.jsx)(exports.WithFetchContext, { children: (0, jsx_runtime_1.jsx)(react_redux_1.Provider, __assign({ store: _store, context: exports.TellescopeStoreContext }, { children: props.children })) })); };
exports.EnduserProvider = EnduserProvider;
var ExtendedEnduserProvider = function (props) { return ((0, jsx_runtime_1.jsx)(exports.WithFetchContext, { children: (0, jsx_runtime_1.jsx)(react_redux_1.Provider, __assign({ store: props.store, context: exports.TellescopeStoreContext }, { children: props.children })) })); };
exports.ExtendedEnduserProvider = ExtendedEnduserProvider;
exports.INACTIVE_SYNC_INTERVAL_IN_MS = 30000;
exports.DEFAULT_SYNC_INTERVAL_IN_MS = 15000;
exports.MEDIUM_SYNC_INTERAVL = 10000;
exports.FAST_SYNC_INTERVAL = 5000;
exports.lastActiveForSync = { at: new Date(0), hasFocus: true };
exports.lastDataSync = { current: { numResults: 0, at: new Date(0), from: new Date(0), latency: 0, duration: 0 } };
var useDataSync____internal = function () {
    var session = (0, index_1.useSession)();
    var lastFetch = react_1.default.useRef(new Date());
    var loadTimings = react_1.default.useRef({});
    var loaded = react_1.default.useRef({});
    var deleted = react_1.default.useRef({});
    var handlers = react_1.default.useRef({});
    (0, react_1.useEffect)(function () {
        var _a;
        try {
            // not compatible with React Native
            if (typeof window === 'undefined') {
                return;
            }
            if (((_a = global === null || global === void 0 ? void 0 : global.navigator) === null || _a === void 0 ? void 0 : _a.product) === 'ReactNative') {
                return;
            }
            var onMouseMove_1 = function () { exports.lastActiveForSync.at = new Date(); };
            window.addEventListener('mousemove', onMouseMove_1);
            var onFocus_1 = function () { exports.lastActiveForSync.hasFocus = true; };
            window.addEventListener('focus', onFocus_1);
            var onBlur_1 = function () { exports.lastActiveForSync.hasFocus = false; };
            window.addEventListener('blur', onBlur_1);
            return function () {
                window.removeEventListener('mousemove', onMouseMove_1);
                window.removeEventListener('focus', onFocus_1);
                window.removeEventListener('blur', onBlur_1);
            };
        }
        catch (err) {
            console.error(err);
        }
    }, []);
    (0, react_1.useEffect)(function () {
        if (!session.authToken)
            return;
        var i = setInterval(function () {
            var isActive = exports.lastActiveForSync.hasFocus && exports.lastActiveForSync.at.getTime() > (Date.now() - 1000 * 15);
            var pollDurationInMS = Math.min.apply(Math, __spreadArray([isActive ? exports.DEFAULT_SYNC_INTERVAL_IN_MS : exports.INACTIVE_SYNC_INTERVAL_IN_MS], Object.values(loadTimings.current).filter(function (v) { return v > 999; }), false));
            var handleLoadedData = function () {
                for (var _i = 0, _a = Object.values(handlers.current); _i < _a.length; _i++) {
                    var handler = _a[_i];
                    try {
                        handler === null || handler === void 0 ? void 0 : handler();
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
            };
            if (lastFetch.current.getTime() + pollDurationInMS > Date.now()) {
                return;
            }
            // ensure we don't miss updates due to latency
            var from = new Date(lastFetch.current.getTime() - 1000); // large leeway could result in same data being fetched twice, but helps ensure nothing is dropped
            lastFetch.current = new Date(); // update before syncing, not after it returns
            session
                .sync({ from: from })
                .then(function (_a) {
                var results = _a.results;
                exports.lastDataSync.current = {
                    numResults: results.length, at: lastFetch.current,
                    from: from,
                    latency: Date.now() - lastFetch.current.getTime(),
                    duration: pollDurationInMS,
                };
                for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
                    var r = results_1[_i];
                    if (r.data === 'deleted') {
                        if (!deleted.current[r.modelName]) {
                            deleted.current[r.modelName] = [];
                        }
                        deleted.current[r.modelName].push(r.recordId);
                    }
                    else {
                        if (!loaded.current[r.modelName]) {
                            loaded.current[r.modelName] = [];
                        }
                        try {
                            loaded.current[r.modelName].push(JSON.parse(r.data));
                        }
                        catch (err) {
                            console.error(err);
                        }
                    }
                }
            })
                .then(handleLoadedData)
                .catch(function (err) {
                console.error('Sync error', err);
                lastFetch.current = from; // don't skip this interval yet
            });
        }, 1000);
        return function () { clearInterval(i); };
    }, [session]);
    var getLoaded = (0, react_1.useCallback)(function (modelName) { return loaded.current[modelName] || []; }, []);
    var getDeleted = (0, react_1.useCallback)(function (modelName) { return deleted.current[modelName] || []; }, []);
    var popLoaded = (0, react_1.useCallback)(function (modelName) {
        var toReturn = loaded.current[modelName] || [];
        loaded.current[modelName] = [];
        return toReturn;
    }, []);
    var popDeleted = (0, react_1.useCallback)(function (modelName) {
        var toReturn = deleted.current[modelName] || [];
        deleted.current[modelName] = [];
        return toReturn;
    }, []);
    var setLoadTiming = (0, react_1.useCallback)(function (key, loadTimeInMS) {
        loadTimings.current[key] = loadTimeInMS;
    }, []);
    var setHandler = (0, react_1.useCallback)(function (key, handler) {
        // call handler when initially set in case results were loaded when there was no handler
        if (!handlers.current[key] && handler) {
            try {
                // console.log("handle on add", key)
                handler === null || handler === void 0 ? void 0 : handler();
            }
            catch (err) {
                console.error(err);
            }
        }
        // console.log('setting handler', key)
        handlers.current[key] = handler;
    }, []);
    var removeHandler = (0, react_1.useCallback)(function (key, handler) {
        if (handlers.current[key] !== handler)
            return; // if a handler was overwritten, don't remove it
        // console.log('removing handler', key)
        delete handlers.current[key];
    }, []);
    return {
        setLoadTiming: setLoadTiming,
        setHandler: setHandler,
        removeHandler: removeHandler,
        getLoaded: getLoaded,
        getDeleted: getDeleted,
        popLoaded: popLoaded,
        popDeleted: popDeleted,
    };
};
exports.useDataSync____internal = useDataSync____internal;
var SyncContext = react_1.default.createContext({});
var WithDataSync = function (_a) {
    var children = _a.children;
    return ((0, jsx_runtime_1.jsx)(SyncContext.Provider, __assign({ value: (0, exports.useDataSync____internal)() }, { children: children })));
};
exports.WithDataSync = WithDataSync;
var useSyncContext = function () { return (0, react_1.useContext)(SyncContext); };
exports.useSyncContext = useSyncContext;
var DEFAULT_FETCH_LIMIT = 500;
var BULK_READ_DEFAULT_LIMIT = 1000; // 1000 is max
var DONE_LOADING_TOKEN = 'doneLoading';
var useListStateHook = function (modelName, state, session, slice, apiCalls, options) {
    var _a, _b, _c, _d;
    var _e = (_a = (0, exports.useSyncContext)()) !== null && _a !== void 0 ? _a : {}, setHandler = _e.setHandler, popDeleted = _e.popDeleted, popLoaded = _e.popLoaded, removeHandler = _e.removeHandler;
    var loadQuery = apiCalls.loadQuery, findOne = apiCalls.findOne, findByIds = apiCalls.findByIds, addOne = apiCalls.addOne, addSome = apiCalls.addSome, updateOne = apiCalls.updateOne, deleteOne = apiCalls.deleteOne;
    if ((options === null || options === void 0 ? void 0 : options.refetchInMS) !== undefined && options.refetchInMS < 5000) {
        throw new Error("refetchInMS must be greater than 5000");
    }
    var batchRef = (0, react_1.useRef)({
        fetching: false,
        ids: [],
        nextBatch: [],
    });
    var dispatch = useTellescopeDispatch();
    var _f = (0, react_1.useContext)(FetchContext), didFetch = _f.didFetch, setFetched = _f.setFetched, getLastId = _f.getLastId, setLastId = _f.setLastId, getLastDate = _f.getLastDate, setLastDate = _f.setLastDate;
    var now = new Date();
    var recentlyCreatedFetch = (0, react_1.useRef)(getLastDate("".concat(modelName, "-recentlyCreatedFetch")) || now);
    if (now.getTime() === recentlyCreatedFetch.current.getTime()) {
        setLastDate("".concat(modelName, "-recentlyCreatedFetch"), now);
    }
    var recentlyUpdatedFetch = (0, react_1.useRef)(getLastDate("".concat(modelName, "-recentlyUpdatedFetch")) || now);
    if (now.getTime() === recentlyUpdatedFetch.current.getTime()) {
        setLastDate("".concat(modelName, "-recentlyUpdatedFetch"), now);
    }
    var addLocalElement = (0, react_1.useCallback)(function (e, o) {
        var _a;
        dispatch(slice.actions.add({ value: e, options: o }));
        (_a = options === null || options === void 0 ? void 0 : options.onAdd) === null || _a === void 0 ? void 0 : _a.call(options, [e]);
        return e;
    }, [dispatch, options, slice]);
    var addLocalElements = (0, react_1.useCallback)(function (es, o) {
        var _a;
        dispatch(slice.actions.addSome({ value: es, options: o }));
        (_a = options === null || options === void 0 ? void 0 : options.onAdd) === null || _a === void 0 ? void 0 : _a.call(options, es);
        return es;
    }, [dispatch, options, slice]);
    var createElement = (0, react_1.useCallback)(function (e, options) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!addOne)
                        throw new Error("Add element by API is not supported");
                    _a = addLocalElement;
                    return [4 /*yield*/, addOne(e)];
                case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent(), options])];
            }
        });
    }); }, [addLocalElement, addOne]);
    var createElements = (0, react_1.useCallback)(function (es, options) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, created, errors;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!addSome)
                        throw new Error("Add elements by API is not supported");
                    return [4 /*yield*/, addSome(es)];
                case 1:
                    _a = _b.sent(), created = _a.created, errors = _a.errors;
                    if (errors.length) {
                        console.error(errors);
                    }
                    return [2 /*return*/, addLocalElements(created, options)];
            }
        });
    }); }, [addLocalElements, addSome]);
    var updateLocalElement = (0, react_1.useCallback)(function (id, updates) {
        var _a;
        dispatch(slice.actions.update({ value: { id: id, updates: updates } }));
        (_a = options === null || options === void 0 ? void 0 : options.onUpdate) === null || _a === void 0 ? void 0 : _a.call(options, [__assign({ id: id }, updates)]);
    }, [dispatch, options, slice]);
    var updateLocalElements = (0, react_1.useCallback)(function (updates) {
        var _a;
        dispatch(slice.actions.updateSome({ value: updates }));
        var updated = [];
        for (var id in updates) {
            updated.push(__assign({ id: id }, updates[id]));
        }
        (_a = options === null || options === void 0 ? void 0 : options.onUpdate) === null || _a === void 0 ? void 0 : _a.call(options, updated);
    }, [dispatch, options, slice]);
    var modifyLocalElements = (0, react_1.useCallback)(function (filter, modifier) {
        dispatch(slice.actions.modifyElements({ value: { filter: filter, modifier: modifier } }));
    }, [dispatch, options, slice]);
    var replaceLocalElement = (0, react_1.useCallback)(function (id, updated) {
        var _a;
        dispatch(slice.actions.replace({ value: { id: id, updated: updated } }));
        (_a = options === null || options === void 0 ? void 0 : options.onUpdate) === null || _a === void 0 ? void 0 : _a.call(options, [__assign(__assign({}, updated), { id: id })]);
        return updated;
    }, [dispatch, options, slice]);
    var updateElement = (0, react_1.useCallback)(function (id, e, o) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!updateOne)
                        throw new Error("Update element by API is not supported");
                    _a = replaceLocalElement;
                    _b = [id];
                    return [4 /*yield*/, updateOne(id, e, o)];
                case 1: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent()]))]; // API returns updated model, avoids needing to merge object fields client-side, so just replace
            }
        });
    }); }, [replaceLocalElement, updateOne]);
    var removeLocalElement = (0, react_1.useCallback)(function (id) {
        var _a;
        dispatch(slice.actions.remove({ value: { id: id } }));
        (_a = options === null || options === void 0 ? void 0 : options.onDelete) === null || _a === void 0 ? void 0 : _a.call(options, [id]);
    }, [dispatch, options, slice]);
    var removeLocalElements = (0, react_1.useCallback)(function (ids) {
        var _a;
        dispatch(slice.actions.removeSome({ value: { ids: ids } }));
        (_a = options === null || options === void 0 ? void 0 : options.onDelete) === null || _a === void 0 ? void 0 : _a.call(options, ids);
    }, [dispatch, options, slice]);
    var removeElement = (0, react_1.useCallback)(function (id) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!deleteOne)
                        throw new Error("Add element by API is not supported");
                    return [4 /*yield*/, deleteOne(id)];
                case 1:
                    _a.sent();
                    removeLocalElement(id);
                    return [2 /*return*/];
            }
        });
    }); }, [removeLocalElement, deleteOne]);
    (0, react_1.useEffect)(function () {
        // context not provided
        if (!setHandler)
            return;
        var handler = function () {
            if (state.status !== types_utilities_1.LoadingStatus.Loaded)
                return;
            var deleted = popDeleted(modelName);
            var loaded = popLoaded(modelName);
            if (deleted === null || deleted === void 0 ? void 0 : deleted.length) {
                removeLocalElements(deleted);
            }
            if (loaded === null || loaded === void 0 ? void 0 : loaded.length) {
                addLocalElements(loaded, { replaceIfMatch: true });
            }
        };
        setHandler(modelName, handler);
        return function () { removeHandler(modelName, handler); };
    }, [modelName, state.status, setHandler, removeHandler, addLocalElements, removeLocalElements, popDeleted, popLoaded]);
    var findById = (0, react_1.useCallback)(function (id, options) {
        if (!id)
            return undefined;
        var value = (state.status === types_utilities_1.LoadingStatus.Loaded
            ? state.value.find(function (v) { return v.id.toString() === id.toString(); })
            : undefined);
        if (didFetch('recordNotFound' + modelName + id)
            && !value // if value is added after an initial failure to find, or an error happened on refresh, make sure we don't return null
        ) {
            return null;
        }
        // prevent frequent refetches 
        if (value && (options === null || options === void 0 ? void 0 : options.reload) && didFetch('findById' + modelName + id, true))
            return value;
        if ((options === null || options === void 0 ? void 0 : options.reload) || (value === undefined && !didFetch('findById' + modelName + id))) {
            setFetched('findById' + modelName + id, true); // prevent multiple API calls
            if (options === null || options === void 0 ? void 0 : options.batch) {
                // ensure duplicate ids are not provided
                if (!batchRef.current.nextBatch.includes(id.toString()) && !batchRef.current.ids.includes(id.toString())) {
                    if (batchRef.current.fetching) {
                        batchRef.current.nextBatch.push(id.toString()); // fetch in next batch if currently fetching
                    }
                    else {
                        batchRef.current.ids.push(id.toString());
                    }
                }
            }
            else {
                findOne === null || findOne === void 0 ? void 0 : findOne(id.toString()).then(function (found) {
                    // prevent unnecessary re-renders by calling addLocalElement, when the exact value already exists
                    var existingUnchanged = (0, loading_1.value_is_loaded)(state) && state.value.find(function (v) { return v.id === id && (0, utilities_1.objects_equivalent)(v, found); });
                    if (existingUnchanged)
                        return;
                    addLocalElement(found, { replaceIfMatch: true });
                }).catch(function (e) {
                    setFetched('recordNotFound' + modelName + id, true); // mark record not found for id
                    console.error(e);
                });
            }
        }
        return value;
    }, [addLocalElement, findOne, state, modelName, setFetched, didFetch]);
    (0, react_1.useEffect)(function () {
        if (!findByIds)
            return;
        var i = window.setInterval(function () {
            var _a;
            if (batchRef.current.fetching)
                return; // already fetching
            if (batchRef.current.ids.length === 0)
                return;
            // can only load max of 1000, ensure other ids are included in nextBatch
            if (batchRef.current.ids.length > BULK_READ_DEFAULT_LIMIT) {
                (_a = batchRef.current.nextBatch).unshift.apply(_a, batchRef.current.ids.slice(BULK_READ_DEFAULT_LIMIT));
            }
            batchRef.current.fetching = true;
            findByIds({
                ids: batchRef.current.ids.slice(0, BULK_READ_DEFAULT_LIMIT), // ensure limited to 1000 entries
            })
                .then(function (_a) {
                var _b;
                var matches = _a.matches;
                if (matches.length) {
                    addLocalElements(matches, { replaceIfMatch: true });
                    (_b = options === null || options === void 0 ? void 0 : options.onBulkRead) === null || _b === void 0 ? void 0 : _b.call(options, matches);
                }
            })
                .catch(function (err) {
                console.error(err);
            })
                .finally(function () {
                // ensure we make progress to prevent looping on an error
                batchRef.current.ids = batchRef.current.nextBatch;
                batchRef.current.nextBatch = [];
                // allow next fetch
                batchRef.current.fetching = false;
            });
        }, 333);
        return function () { clearInterval(i); };
    }, [findByIds, addLocalElements, options === null || options === void 0 ? void 0 : options.onBulkRead]);
    var findByFilter = (0, react_1.useCallback)(function (filter, options) {
        var _a;
        var loadFilter = options === null || options === void 0 ? void 0 : options.loadFilter;
        var queryKey = modelName + JSON.stringify((_a = options === null || options === void 0 ? void 0 : options.loadFilter) !== null && _a !== void 0 ? _a : {});
        var value = (state.status === types_utilities_1.LoadingStatus.Loaded
            ? state.value.find(filter)
            : undefined);
        // if value is added after an initial failure to find, make sure we return it in instead of null
        if (didFetch('recordNotFound' + queryKey)) { // return null if record not found for id
            return value || null;
        }
        // prevent frequent refetches 
        if (value && (options === null || options === void 0 ? void 0 : options.reload) && didFetch('findOne' + queryKey, true))
            return value;
        if (loadFilter && ((options === null || options === void 0 ? void 0 : options.reload) || (value === undefined && !didFetch('findOne' + queryKey)))) {
            setFetched('findOne' + queryKey, true); // prevent multiple API calls
            findOne === null || findOne === void 0 ? void 0 : findOne(loadFilter).then(function (found) {
                // prevent unnecessary re-renders by calling addLocalElement, when the exact value already exists
                var existingUnchanged = (0, loading_1.value_is_loaded)(state) && state.value.find(function (v) { return filter(v) && (0, utilities_1.objects_equivalent)(v, found); });
                if (existingUnchanged)
                    return;
                addLocalElement(found, { replaceIfMatch: true });
            }).catch(function (e) {
                setFetched('recordNotFound' + queryKey, true); // mark record not found for id
                console.error(e);
            });
        }
        return value;
    }, [addLocalElement, findOne, state, modelName, setFetched, didFetch]);
    // make consistent with search function in Webapp search.tsx
    var searchLocalElements = (0, react_1.useCallback)(function (query) {
        var matches = [];
        if (state.status !== types_utilities_1.LoadingStatus.Loaded)
            return matches;
        var queryLC = query.toLowerCase();
        for (var _i = 0, _a = state.value; _i < _a.length; _i++) {
            var element = _a[_i];
            // todo: recursive search matches on array / object fields
            for (var field in element) {
                if (['createdAt', 'updatedAt', 'businessId', 'creator'].includes(field))
                    continue;
                var value = element[field];
                if (field === 'id') {
                    if (value.toString().toLowerCase() === queryLC) {
                        matches.push(element);
                    }
                }
                else if (typeof value === 'string' && value.toLowerCase().includes(queryLC)) {
                    matches.push(element);
                    break;
                }
            }
        }
        return matches;
    }, [state]);
    var filtered = (0, react_1.useCallback)(function (filter) {
        if ((0, loading_1.value_is_loaded)(state)) {
            return {
                status: state.status,
                value: state.value.filter(filter)
            };
        }
        return state;
    }, [state]);
    var cantRead = (session.type === 'user' && !((_d = (_c = (_b = session === null || session === void 0 ? void 0 : session.userInfo) === null || _b === void 0 ? void 0 : _b.access) === null || _c === void 0 ? void 0 : _c[modelName]) === null || _d === void 0 ? void 0 : _d.read));
    var load = (0, react_1.useCallback)(function (force, loadOptions) {
        var _a, _b, _c, _d;
        if (cantRead)
            return;
        var _loadFilter = (_a = loadOptions === null || loadOptions === void 0 ? void 0 : loadOptions.loadFilter) !== null && _a !== void 0 ? _a : options === null || options === void 0 ? void 0 : options.loadFilter;
        var loadFilter = (_loadFilter && (0, utilities_1.object_is_empty)(_loadFilter)) ? undefined : _loadFilter;
        var sort = (_b = loadOptions === null || loadOptions === void 0 ? void 0 : loadOptions.sort) !== null && _b !== void 0 ? _b : options === null || options === void 0 ? void 0 : options.sort;
        var sortBy = (_c = loadOptions === null || loadOptions === void 0 ? void 0 : loadOptions.sortBy) !== null && _c !== void 0 ? _c : options === null || options === void 0 ? void 0 : options.sortBy;
        var _mdbFilter = (loadOptions === null || loadOptions === void 0 ? void 0 : loadOptions.mdbFilter) || (options === null || options === void 0 ? void 0 : options.mdbFilter);
        var mdbFilter = (_mdbFilter && ((_d = _mdbFilter === null || _mdbFilter === void 0 ? void 0 : _mdbFilter.$and) === null || _d === void 0 ? void 0 : _d.length)) ? _mdbFilter : undefined;
        if (!loadQuery)
            return;
        if ((options === null || options === void 0 ? void 0 : options.dontFetch) && !force)
            return;
        var fetchKey = (mdbFilter || loadFilter || sort || sortBy) ? JSON.stringify(__assign(__assign(__assign({}, mdbFilter), loadFilter), { sort: sort, sortBy: sortBy })) + modelName : modelName;
        if (didFetch(fetchKey, force, options === null || options === void 0 ? void 0 : options.refetchInMS))
            return;
        setFetched(fetchKey, true);
        var limit = (options === null || options === void 0 ? void 0 : options.limit) || DEFAULT_FETCH_LIMIT;
        (0, exports.toLoadedData)(function () { return loadQuery({ mdbFilter: mdbFilter, filter: loadFilter, limit: limit, sort: sort, sortBy: sortBy }); }, { valueOnError: mdbFilter ? [] : undefined }).then(function (es) {
            var _a, _b;
            if (es.status === types_utilities_1.LoadingStatus.Loaded) {
                if (es.value.length < limit && !loadFilter && !mdbFilter) {
                    setFetched('id' + modelName + DONE_LOADING_TOKEN, true);
                }
                else if (es.value.length < limit) {
                    setFetched(fetchKey + DONE_LOADING_TOKEN, true);
                }
                if (es.value.length) { // don't store oldest record from a filter, may skip some pages
                    setLastId(fetchKey, (_b = (_a = es.value[es.value.length - 1]) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.toString());
                    var createdAt = es.value[es.value.length - 1].createdAt;
                    if (typeof createdAt === 'string' || createdAt instanceof Date) {
                        setLastDate(modelName, new Date(createdAt));
                    }
                }
                dispatch(slice.actions.addSome({ value: es.value, options: { replaceIfMatch: true } }));
            }
            else {
                // don't overwrite previously loaded data when an error occurs on reload
                if (loadOptions === null || loadOptions === void 0 ? void 0 : loadOptions.reloading) {
                    return console.error(es);
                }
                dispatch(slice.actions.set({ value: es }));
            }
        });
    }, [cantRead, setFetched, didFetch, modelName, options, loadQuery, options === null || options === void 0 ? void 0 : options.dontFetch, dispatch]);
    var getOldestLoadedId = function () { return getLastId(modelName); };
    var setOldestLoadedId = function (id) { return setLastId(modelName, id); };
    var setOldestLoadedDate = function (d) { return setLastDate(modelName, d); };
    var getOldestLoadedDate = function () { return getLastDate(modelName); };
    var reload = (0, react_1.useCallback)(function (options) { return load(true, __assign(__assign({}, options), { reloading: true })); }, [load]);
    (0, react_1.useEffect)(function () {
        if (options === null || options === void 0 ? void 0 : options.unbounceMS) {
            var i_1 = setTimeout(function () { return load(false); }, options.unbounceMS);
            return function () { clearTimeout(i_1); };
        }
        load(false);
    }, [load, options === null || options === void 0 ? void 0 : options.unbounceMS]);
    var doneLoading = (0, react_1.useCallback)(function (key) {
        var _a;
        if (key === void 0) { key = "id"; }
        var unfileteredCase = didFetch(key + modelName + DONE_LOADING_TOKEN);
        if (unfileteredCase)
            return true;
        var sort = options === null || options === void 0 ? void 0 : options.sort;
        var sortBy = options === null || options === void 0 ? void 0 : options.sortBy;
        var _filter = options === null || options === void 0 ? void 0 : options.loadFilter;
        var filter = (_filter && (0, utilities_1.object_is_empty)(_filter)) ? undefined : _filter;
        var _mdbFilter = options === null || options === void 0 ? void 0 : options.mdbFilter;
        var mdbFilter = (_mdbFilter && ((_a = _mdbFilter === null || _mdbFilter === void 0 ? void 0 : _mdbFilter.$and) === null || _a === void 0 ? void 0 : _a.length)) ? _mdbFilter : undefined;
        var filterKey = ((mdbFilter || filter || sort || sortBy)
            ? JSON.stringify(__assign(__assign(__assign({}, mdbFilter), filter), { sort: sort, sortBy: sortBy })) + modelName
            : modelName);
        if (didFetch(filterKey + DONE_LOADING_TOKEN))
            return true;
        return false;
    }, [didFetch, modelName, options === null || options === void 0 ? void 0 : options.loadFilter, options === null || options === void 0 ? void 0 : options.mdbFilter, options === null || options === void 0 ? void 0 : options.sort, options === null || options === void 0 ? void 0 : options.sortBy]);
    var loadMore = (0, react_1.useCallback)(function (loadOptions) { return __awaiter(void 0, void 0, void 0, function () {
        var sort, sortBy, _filter, filter, _mdbFilter, mdbFilter, mdbFilterIsActive, filterKey, lastId, key, limit;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            sort = options === null || options === void 0 ? void 0 : options.sort;
            sortBy = options === null || options === void 0 ? void 0 : options.sortBy;
            _filter = (_a = loadOptions === null || loadOptions === void 0 ? void 0 : loadOptions.filter) !== null && _a !== void 0 ? _a : options === null || options === void 0 ? void 0 : options.loadFilter;
            filter = (_filter && (0, utilities_1.object_is_empty)(_filter)) ? undefined : _filter;
            _mdbFilter = (loadOptions === null || loadOptions === void 0 ? void 0 : loadOptions.mdbFilter) || (options === null || options === void 0 ? void 0 : options.mdbFilter);
            mdbFilter = (_mdbFilter && ((_b = _mdbFilter === null || _mdbFilter === void 0 ? void 0 : _mdbFilter.$and) === null || _b === void 0 ? void 0 : _b.length)) ? _mdbFilter : undefined;
            mdbFilterIsActive = (mdbFilter && ((_c = mdbFilter === null || mdbFilter === void 0 ? void 0 : mdbFilter.$and) === null || _c === void 0 ? void 0 : _c.length));
            filterKey = ((mdbFilter || filter || sort || sortBy)
                ? JSON.stringify(__assign(__assign(__assign({}, mdbFilter), filter), { sort: sort, sortBy: sortBy })) + modelName
                : modelName);
            lastId = getLastId(filterKey);
            if (!lastId)
                return [2 /*return*/];
            if (!loadQuery)
                return [2 /*return*/];
            if (didFetch(filterKey + 'lastId' + lastId))
                return [2 /*return*/];
            setFetched(filterKey + 'lastId' + lastId, true);
            key = (_d = loadOptions === null || loadOptions === void 0 ? void 0 : loadOptions.key) !== null && _d !== void 0 ? _d : 'id';
            if (key !== 'id')
                console.warn("Unrecognized key provided");
            limit = (_f = (_e = loadOptions === null || loadOptions === void 0 ? void 0 : loadOptions.limit) !== null && _e !== void 0 ? _e : options === null || options === void 0 ? void 0 : options.limit) !== null && _f !== void 0 ? _f : DEFAULT_FETCH_LIMIT;
            return [2 /*return*/, (0, exports.toLoadedData)(function () { return loadQuery({
                    // lastId: !options?.filter ? oldestRecord?.id?.toString() : undefined,  // don't provide a lastId when there's a filter, filter could include that on its own
                    lastId: lastId,
                    limit: limit,
                    filter: filter,
                    mdbFilter: mdbFilterIsActive ? mdbFilter : undefined,
                }); }).then(function (es) {
                    var _a, _b;
                    if (es.status === types_utilities_1.LoadingStatus.Loaded) {
                        if (es.value.length < limit && !mdbFilter && (!filter || (0, utilities_1.object_is_empty)(filter))) {
                            setFetched(key + modelName + DONE_LOADING_TOKEN, true);
                        }
                        else if (es.value.length < limit) {
                            setFetched(filterKey + DONE_LOADING_TOKEN, true);
                        }
                        var newLastId = (_b = (_a = es.value[es.value.length - 1]) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.toString();
                        if (newLastId) {
                            setLastId(filterKey, newLastId);
                        }
                        dispatch(slice.actions.addSome({ value: es.value, options: { replaceIfMatch: true, addTo: 'end' } }));
                    }
                    else if (es.status === types_utilities_1.LoadingStatus.Error) {
                        console.error('error loading more', es.value);
                    }
                })];
        });
    }); }, [getLastId, modelName, loadQuery, didFetch, setFetched, options === null || options === void 0 ? void 0 : options.mdbFilter, options === null || options === void 0 ? void 0 : options.loadFilter, options === null || options === void 0 ? void 0 : options.sort, options === null || options === void 0 ? void 0 : options.sortBy, options === null || options === void 0 ? void 0 : options.limit, dispatch]);
    var loadRecentlyCreated = react_1.default.useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var from, created, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!loadQuery)
                        return [2 /*return*/, []];
                    from = recentlyCreatedFetch.current;
                    if (from.getTime() + 1000 > Date.now())
                        return [2 /*return*/, []]; // throttle by 1 sec
                    recentlyCreatedFetch.current = new Date();
                    setLastDate("".concat(modelName, "-recentlyCreatedFetch"), recentlyCreatedFetch.current);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, loadQuery({ from: from })];
                case 2:
                    created = _a.sent();
                    if (created.length === 0)
                        return [2 /*return*/, []];
                    return [2 /*return*/, addLocalElements(created, { replaceIfMatch: true })];
                case 3:
                    err_2 = _a.sent();
                    console.error(err_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, []];
            }
        });
    }); }, [session.api, modelName, addLocalElements, loadQuery, setLastDate]);
    var loadRecentlyUpdated = react_1.default.useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var fromUpdated, created, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!loadQuery)
                        return [2 /*return*/, []];
                    fromUpdated = recentlyUpdatedFetch.current;
                    if (fromUpdated.getTime() + 1000 > Date.now())
                        return [2 /*return*/, []]; // throttle by 1 sec
                    recentlyUpdatedFetch.current = new Date();
                    setLastDate("".concat(modelName, "-recentlyUpdatedFetch"), recentlyUpdatedFetch.current);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, loadQuery({ fromUpdated: fromUpdated })];
                case 2:
                    created = _a.sent();
                    if (created.length === 0)
                        return [2 /*return*/, []];
                    return [2 /*return*/, addLocalElements(created, { replaceIfMatch: true })];
                case 3:
                    err_3 = _a.sent();
                    console.error(err_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, []];
            }
        });
    }); }, [session.api, modelName, addLocalElements, loadQuery, setLastDate]);
    return [
        state,
        {
            addLocalElement: addLocalElement,
            addLocalElements: addLocalElements,
            replaceLocalElement: replaceLocalElement,
            modifyLocalElements: modifyLocalElements,
            searchLocalElements: searchLocalElements,
            createElement: createElement,
            createElements: createElements,
            updateElement: updateElement,
            updateLocalElement: updateLocalElement,
            updateLocalElements: updateLocalElements,
            findByFilter: findByFilter,
            findById: findById,
            removeElement: removeElement,
            removeLocalElements: removeLocalElements,
            reload: reload,
            loadMore: loadMore,
            doneLoading: doneLoading,
            filtered: filtered,
            getOldestLoadedDate: getOldestLoadedDate,
            setOldestLoadedDate: setOldestLoadedDate,
            setOldestLoadedId: setOldestLoadedId,
            getOldestLoadedId: getOldestLoadedId,
            loadRecentlyCreated: loadRecentlyCreated,
            loadRecentlyUpdated: loadRecentlyUpdated,
            recentlyCreatedFetch: recentlyCreatedFetch.current,
        }
    ];
};
exports.useListStateHook = useListStateHook;
var useChatRoomDisplayInfo = function (roomId, options) {
    var _a;
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    var state = useTypedSelector(function (s) { return s.chatRoomDisplayInfo; });
    var lookup = (0, exports.useListStateHook)('chat-room-display-info', state, session, chatRoomDisplayInfoslice, {
        loadQuery: function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, id, display_info;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, session.api.chat_rooms.display_info({ id: roomId })];
                    case 1:
                        _a = _b.sent(), id = _a.id, display_info = _a.display_info;
                        return [2 /*return*/, [__assign({ id: id }, display_info)]];
                }
            });
        }); }
    }, __assign({}, options))[0];
    return ((0, loading_1.value_is_loaded)(lookup)
        ? [{ status: types_utilities_1.LoadingStatus.Loaded, value: (_a = lookup.value.find(function (v) { return v.id === roomId; })) !== null && _a !== void 0 ? _a : {} }]
        : [{ status: lookup.status, value: {} }]);
};
exports.useChatRoomDisplayInfo = useChatRoomDisplayInfo;
var useUserAndEnduserDisplayInfo = function () {
    var usersLoading = (0, exports.useUsers)()[0];
    var endusersLoading = (0, exports.useEndusers)()[0];
    var displayInfo = {};
    if ((0, loading_1.value_is_loaded)(usersLoading)) {
        for (var _i = 0, _a = usersLoading.value; _i < _a.length; _i++) {
            var u = _a[_i];
            displayInfo[u.id] = {
                id: u.id,
                avatar: u.avatar,
                fname: u.fname,
                lname: u.lname,
                createdAt: u.createdAt,
                lastActive: new Date(u.lastActive || 0),
                lastLogout: new Date(u.lastLogout || 0),
            };
        }
    }
    if ((0, loading_1.value_is_loaded)(endusersLoading)) {
        for (var _b = 0, _c = endusersLoading.value; _b < _c.length; _b++) {
            var u = _c[_b];
            displayInfo[u.id] = {
                id: u.id,
                avatar: u.avatar,
                fname: u.fname,
                lname: u.lname,
                createdAt: u.createdAt,
                lastActive: new Date(u.lastActive || 0),
                lastLogout: new Date(u.lastLogout || 0),
            };
        }
    }
    return displayInfo;
};
exports.useUserAndEnduserDisplayInfo = useUserAndEnduserDisplayInfo;
var useEnduserEligibilityResults = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('enduser_eligibility_results', useTypedSelector(function (s) { return s.enduser_eligibility_results; }), session, enduserEligibilityResultsSlice, {
        loadQuery: session.api.enduser_eligibility_results.getSome,
        findOne: session.api.enduser_eligibility_results.getOne,
        findByIds: session.api.enduser_eligibility_results.getByIds,
        addOne: session.api.enduser_eligibility_results.createOne,
        addSome: session.api.enduser_eligibility_results.createSome,
        deleteOne: session.api.enduser_eligibility_results.deleteOne,
        updateOne: session.api.enduser_eligibility_results.updateOne,
    }, __assign({}, options));
};
exports.useEnduserEligibilityResults = useEnduserEligibilityResults;
var useAgentRecords = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('agent_records', useTypedSelector(function (s) { return s.agent_records; }), session, agentRecordsSlice, {
        loadQuery: session.api.agent_records.getSome,
        findOne: session.api.agent_records.getOne,
        findByIds: session.api.agent_records.getByIds,
        addOne: session.api.agent_records.createOne,
        addSome: session.api.agent_records.createSome,
        deleteOne: session.api.agent_records.deleteOne,
        updateOne: session.api.agent_records.updateOne,
    }, __assign({}, options));
};
exports.useAgentRecords = useAgentRecords;
var useSuggestedContacts = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('suggested_contacts', useTypedSelector(function (s) { return s.suggested_contacts; }), session, suggestedContactsSlice, {
        loadQuery: session.api.suggested_contacts.getSome,
        findOne: session.api.suggested_contacts.getOne,
        findByIds: session.api.suggested_contacts.getByIds,
        addOne: session.api.suggested_contacts.createOne,
        addSome: session.api.suggested_contacts.createSome,
        deleteOne: session.api.suggested_contacts.deleteOne,
        updateOne: session.api.suggested_contacts.updateOne,
    }, __assign({}, options));
};
exports.useSuggestedContacts = useSuggestedContacts;
var useFaxLogs = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('fax_logs', useTypedSelector(function (s) { return s.fax_logs; }), session, faxLogsSlice, {
        loadQuery: session.api.fax_logs.getSome,
        findOne: session.api.fax_logs.getOne,
        findByIds: session.api.fax_logs.getByIds,
        addOne: session.api.fax_logs.createOne,
        addSome: session.api.fax_logs.createSome,
        deleteOne: session.api.fax_logs.deleteOne,
        updateOne: session.api.fax_logs.updateOne,
    }, __assign({}, options));
};
exports.useFaxLogs = useFaxLogs;
var useMessageTemplateSnippets = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('message_template_snippets', useTypedSelector(function (s) { return s.message_template_snippets; }), session, messageTemplateSnippetsSlice, {
        loadQuery: session.api.message_template_snippets.getSome,
        findOne: session.api.message_template_snippets.getOne,
        findByIds: session.api.message_template_snippets.getByIds,
        addOne: session.api.message_template_snippets.createOne,
        addSome: session.api.message_template_snippets.createSome,
        deleteOne: session.api.message_template_snippets.deleteOne,
        updateOne: session.api.message_template_snippets.updateOne,
    }, __assign({}, options));
};
exports.useMessageTemplateSnippets = useMessageTemplateSnippets;
var usePortalBrandings = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('portal_brandings', useTypedSelector(function (s) { return s.portal_brandings; }), session, portalBrandingsSlice, {
        loadQuery: session.api.portal_brandings.getSome,
        findOne: session.api.portal_brandings.getOne,
        findByIds: session.api.portal_brandings.getByIds,
        addOne: session.api.portal_brandings.createOne,
        addSome: session.api.portal_brandings.createSome,
        deleteOne: session.api.portal_brandings.deleteOne,
        updateOne: session.api.portal_brandings.updateOne,
    }, __assign({}, options));
};
exports.usePortalBrandings = usePortalBrandings;
var useAllergyCodes = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('allergy_codes', useTypedSelector(function (s) { return s.allergy_codes; }), session, allergyCodesSlice, {
        loadQuery: session.api.allergy_codes.getSome,
        findOne: session.api.allergy_codes.getOne,
        findByIds: session.api.allergy_codes.getByIds,
        addOne: session.api.allergy_codes.createOne,
        addSome: session.api.allergy_codes.createSome,
        deleteOne: session.api.allergy_codes.deleteOne,
        updateOne: session.api.allergy_codes.updateOne,
    }, __assign({}, options));
};
exports.useAllergyCodes = useAllergyCodes;
var useDiagnosisCodes = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('diagnosis_codes', useTypedSelector(function (s) { return s.diagnosis_codes; }), session, diagnosisCodesSlice, {
        loadQuery: session.api.diagnosis_codes.getSome,
        findOne: session.api.diagnosis_codes.getOne,
        findByIds: session.api.diagnosis_codes.getByIds,
        addOne: session.api.diagnosis_codes.createOne,
        addSome: session.api.diagnosis_codes.createSome,
        deleteOne: session.api.diagnosis_codes.deleteOne,
        updateOne: session.api.diagnosis_codes.updateOne,
    }, __assign({}, options));
};
exports.useDiagnosisCodes = useDiagnosisCodes;
var useEnduserProblems = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('enduser_problems', useTypedSelector(function (s) { return s.enduser_problems; }), session, enduserProblemsSlice, {
        loadQuery: session.api.enduser_problems.getSome,
        findOne: session.api.enduser_problems.getOne,
        findByIds: session.api.enduser_problems.getByIds,
        addOne: session.api.enduser_problems.createOne,
        addSome: session.api.enduser_problems.createSome,
        deleteOne: session.api.enduser_problems.deleteOne,
        updateOne: session.api.enduser_problems.updateOne,
    }, __assign({}, options));
};
exports.useEnduserProblems = useEnduserProblems;
var useEnduserMedications = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('enduser_medications', useTypedSelector(function (s) { return s.enduser_medications; }), session, enduserMedicationsSlice, {
        loadQuery: session.api.enduser_medications.getSome,
        findOne: session.api.enduser_medications.getOne,
        findByIds: session.api.enduser_medications.getByIds,
        addOne: session.api.enduser_medications.createOne,
        addSome: session.api.enduser_medications.createSome,
        deleteOne: session.api.enduser_medications.deleteOne,
        updateOne: session.api.enduser_medications.updateOne,
    }, __assign({}, options));
};
exports.useEnduserMedications = useEnduserMedications;
var useEnduserOrders = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('enduser_orders', useTypedSelector(function (s) { return s.enduser_orders; }), session, enduserOrdersSlice, {
        loadQuery: session.api.enduser_orders.getSome,
        findOne: session.api.enduser_orders.getOne,
        findByIds: session.api.enduser_orders.getByIds,
        addOne: session.api.enduser_orders.createOne,
        addSome: session.api.enduser_orders.createSome,
        deleteOne: session.api.enduser_orders.deleteOne,
        updateOne: session.api.enduser_orders.updateOne,
    }, __assign({}, options));
};
exports.useEnduserOrders = useEnduserOrders;
var useIntegrationLogs = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('integration_logs', useTypedSelector(function (s) { return s.integration_logs; }), session, integrationLogsSlice, {
        loadQuery: session.api.integration_logs.getSome,
        findOne: session.api.integration_logs.getOne,
        findByIds: session.api.integration_logs.getByIds,
        addOne: session.api.integration_logs.createOne,
        addSome: session.api.integration_logs.createSome,
        deleteOne: session.api.integration_logs.deleteOne,
        updateOne: session.api.integration_logs.updateOne,
    }, __assign({}, options));
};
exports.useIntegrationLogs = useIntegrationLogs;
var useWebhookLogs = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('webhook_logs', useTypedSelector(function (s) { return s.webhook_logs; }), session, webhookLogsSlice, {
        loadQuery: session.api.webhook_logs.getSome,
        findOne: session.api.webhook_logs.getOne,
        findByIds: session.api.webhook_logs.getByIds,
        addOne: session.api.webhook_logs.createOne,
        addSome: session.api.webhook_logs.createSome,
        deleteOne: session.api.webhook_logs.deleteOne,
        updateOne: session.api.webhook_logs.updateOne,
    }, __assign({}, options));
};
exports.useWebhookLogs = useWebhookLogs;
var useFormGroups = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('form_groups', useTypedSelector(function (s) { return s.form_groups; }), session, formGroupsSlice, {
        loadQuery: session.api.form_groups.getSome,
        findOne: session.api.form_groups.getOne,
        findByIds: session.api.form_groups.getByIds,
        addOne: session.api.form_groups.createOne,
        addSome: session.api.form_groups.createSome,
        deleteOne: session.api.form_groups.deleteOne,
        updateOne: session.api.form_groups.updateOne,
    }, __assign({}, options));
};
exports.useFormGroups = useFormGroups;
var useFlowchartNotes = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('flowchart_notes', useTypedSelector(function (s) { return s.flowchart_notes; }), session, flowchartNotesSlice, {
        loadQuery: session.api.flowchart_notes.getSome,
        findOne: session.api.flowchart_notes.getOne,
        findByIds: session.api.flowchart_notes.getByIds,
        addOne: session.api.flowchart_notes.createOne,
        addSome: session.api.flowchart_notes.createSome,
        deleteOne: session.api.flowchart_notes.deleteOne,
        updateOne: session.api.flowchart_notes.updateOne,
    }, __assign({}, options));
};
exports.useFlowchartNotes = useFlowchartNotes;
var useEnduserEncounters = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('enduser_encounters', useTypedSelector(function (s) { return s.enduser_encounters; }), session, enduserEncountersSlice, {
        loadQuery: session.api.enduser_encounters.getSome,
        findOne: session.api.enduser_encounters.getOne,
        findByIds: session.api.enduser_encounters.getByIds,
        addOne: session.api.enduser_encounters.createOne,
        addSome: session.api.enduser_encounters.createSome,
        deleteOne: session.api.enduser_encounters.deleteOne,
        updateOne: session.api.enduser_encounters.updateOne,
    }, __assign({}, options));
};
exports.useEnduserEncounters = useEnduserEncounters;
var useVitalConfigurations = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('vital_configurations', useTypedSelector(function (s) { return s.vital_configurations; }), session, vitalConfigurationsSlice, {
        loadQuery: session.api.vital_configurations.getSome,
        findOne: session.api.vital_configurations.getOne,
        findByIds: session.api.vital_configurations.getByIds,
        addOne: session.api.vital_configurations.createOne,
        addSome: session.api.vital_configurations.createSome,
        deleteOne: session.api.vital_configurations.deleteOne,
        updateOne: session.api.vital_configurations.updateOne,
    }, __assign({}, options));
};
exports.useVitalConfigurations = useVitalConfigurations;
var useCalendarEvents = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('calendar_events', useTypedSelector(function (s) { return s.calendar_events; }), session, calendarEventsSlice, {
        loadQuery: session.api.calendar_events.getSome,
        findOne: session.api.calendar_events.getOne,
        findByIds: session.api.calendar_events.getByIds,
        addOne: session.api.calendar_events.createOne,
        addSome: session.api.calendar_events.createSome,
        deleteOne: session.api.calendar_events.deleteOne,
        updateOne: session.api.calendar_events.updateOne,
    }, __assign({}, options));
};
exports.useCalendarEvents = useCalendarEvents;
var useEngagementEvents = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('engagement_events', useTypedSelector(function (s) { return s.engagement_events; }), session, engagementEventsSlice, {
        loadQuery: session.api.engagement_events.getSome,
        findOne: session.api.engagement_events.getOne,
        findByIds: session.api.engagement_events.getByIds,
        addOne: session.api.engagement_events.createOne,
        addSome: session.api.engagement_events.createSome,
        deleteOne: session.api.engagement_events.deleteOne,
        updateOne: session.api.engagement_events.updateOne,
    }, __assign({}, options));
};
exports.useEngagementEvents = useEngagementEvents;
var useGroupMMSConversations = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('group_mms_conversations', useTypedSelector(function (s) { return s.group_mms_conversations; }), session, groupMMSConversationsSlice, {
        loadQuery: session.api.group_mms_conversations.getSome,
        findOne: session.api.group_mms_conversations.getOne,
        findByIds: session.api.group_mms_conversations.getByIds,
        addOne: session.api.group_mms_conversations.createOne,
        addSome: session.api.group_mms_conversations.createSome,
        deleteOne: session.api.group_mms_conversations.deleteOne,
        updateOne: session.api.group_mms_conversations.updateOne,
    }, __assign({}, options));
};
exports.useGroupMMSConversations = useGroupMMSConversations;
var useEnduserProfileViews = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('enduser_profile_views', useTypedSelector(function (s) { return s.enduser_profile_views; }), session, enduserProfileViewsSlice, {
        loadQuery: session.api.enduser_profile_views.getSome,
        findOne: session.api.enduser_profile_views.getOne,
        findByIds: session.api.enduser_profile_views.getByIds,
        addOne: session.api.enduser_profile_views.createOne,
        addSome: session.api.enduser_profile_views.createSome,
        deleteOne: session.api.enduser_profile_views.deleteOne,
        updateOne: session.api.enduser_profile_views.updateOne,
    }, __assign({}, options));
};
exports.useEnduserProfileViews = useEnduserProfileViews;
var useCallHoldQueues = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('call_hold_queues', useTypedSelector(function (s) { return s.call_hold_queues; }), session, callHoldQueuesSlice, {
        loadQuery: session.api.call_hold_queues.getSome,
        findOne: session.api.call_hold_queues.getOne,
        findByIds: session.api.call_hold_queues.getByIds,
        addOne: session.api.call_hold_queues.createOne,
        addSome: session.api.call_hold_queues.createSome,
        deleteOne: session.api.call_hold_queues.deleteOne,
        updateOne: session.api.call_hold_queues.updateOne,
    }, __assign({}, options));
};
exports.useCallHoldQueues = useCallHoldQueues;
var useTicketQueues = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('ticket_queues', useTypedSelector(function (s) { return s.ticket_queues; }), session, ticketQueuesSlice, {
        loadQuery: session.api.ticket_queues.getSome,
        findOne: session.api.ticket_queues.getOne,
        findByIds: session.api.ticket_queues.getByIds,
        addOne: session.api.ticket_queues.createOne,
        addSome: session.api.ticket_queues.createSome,
        deleteOne: session.api.ticket_queues.deleteOne,
        updateOne: session.api.ticket_queues.updateOne,
    }, __assign({}, options));
};
exports.useTicketQueues = useTicketQueues;
var useConfigurations = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('configurations', useTypedSelector(function (s) { return s.configurations; }), session, configurationsSlice, {
        loadQuery: session.api.configurations.getSome,
        findOne: session.api.configurations.getOne,
        findByIds: session.api.configurations.getByIds,
        addOne: session.api.configurations.createOne,
        addSome: session.api.configurations.createSome,
        deleteOne: session.api.configurations.deleteOne,
        updateOne: session.api.configurations.updateOne,
    }, __assign({}, options));
};
exports.useConfigurations = useConfigurations;
var usePhoneTrees = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('phone_trees', useTypedSelector(function (s) { return s.phone_trees; }), session, phoneTreesSlice, {
        loadQuery: session.api.phone_trees.getSome,
        findOne: session.api.phone_trees.getOne,
        findByIds: session.api.phone_trees.getByIds,
        addOne: session.api.phone_trees.createOne,
        addSome: session.api.phone_trees.createSome,
        deleteOne: session.api.phone_trees.deleteOne,
        updateOne: session.api.phone_trees.updateOne,
    }, __assign({}, options));
};
exports.usePhoneTrees = usePhoneTrees;
var useAutomationTriggers = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('automation_triggers', useTypedSelector(function (s) { return s.automation_triggers; }), session, automationTriggersSlice, {
        loadQuery: session.api.automation_triggers.getSome,
        findOne: session.api.automation_triggers.getOne,
        findByIds: session.api.automation_triggers.getByIds,
        addOne: session.api.automation_triggers.createOne,
        addSome: session.api.automation_triggers.createSome,
        deleteOne: session.api.automation_triggers.deleteOne,
        updateOne: session.api.automation_triggers.updateOne,
    }, __assign({}, options));
};
exports.useAutomationTriggers = useAutomationTriggers;
var useAutomatedActions = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('automated_actions', useTypedSelector(function (s) { return s.automated_actions; }), session, automatedActionsSlice, {
        loadQuery: session.api.automated_actions.getSome,
        findOne: session.api.automated_actions.getOne,
        findByIds: session.api.automated_actions.getByIds,
        addOne: session.api.automated_actions.createOne,
        addSome: session.api.automated_actions.createSome,
        deleteOne: session.api.automated_actions.deleteOne,
        updateOne: session.api.automated_actions.updateOne,
    }, __assign({}, options));
};
exports.useAutomatedActions = useAutomatedActions;
var useEmails = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)(); // endusers cannot send emails for now
    return (0, exports.useListStateHook)('emails', useTypedSelector(function (s) { return s.emails; }), session, emailsSlice, {
        loadQuery: session.api.emails.getSome,
        findOne: session.api.emails.getOne,
        findByIds: session.api.emails.getByIds,
        addOne: session.api.emails.createOne,
        addSome: session.api.emails.createSome,
        deleteOne: session.api.emails.deleteOne,
        updateOne: session.api.emails.updateOne,
    }, __assign({}, options));
};
exports.useEmails = useEmails;
var useSmsMessages = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)(); // endusers cannot send sms messages for now
    return (0, exports.useListStateHook)('sms_messages', useTypedSelector(function (s) { return s.sms_messages; }), session, smsMessagesSlice, {
        loadQuery: session.api.sms_messages.getSome,
        findOne: session.api.sms_messages.getOne,
        findByIds: session.api.sms_messages.getByIds,
        addOne: session.api.sms_messages.createOne,
        addSome: session.api.sms_messages.createSome,
        deleteOne: session.api.sms_messages.deleteOne,
        updateOne: session.api.sms_messages.updateOne,
    }, __assign({}, options));
};
exports.useSmsMessages = useSmsMessages;
var useNotifications = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)(); // endusers do not have notifications
    return (0, exports.useListStateHook)('user_notifications', useTypedSelector(function (s) { return s.user_notifications; }), session, userNotifcationsSlice, {
        loadQuery: session.api.user_notifications.getSome,
        findOne: session.api.user_notifications.getOne,
        findByIds: session.api.user_notifications.getByIds,
        addOne: session.api.user_notifications.createOne,
        addSome: session.api.user_notifications.createSome,
        deleteOne: session.api.user_notifications.deleteOne,
        updateOne: session.api.user_notifications.updateOne,
    }, __assign({}, options));
};
exports.useNotifications = useNotifications;
var useUserLogs = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('user_logs', useTypedSelector(function (s) { return s.user_logs; }), session, userLogsSlice, {
        loadQuery: session.api.user_logs.getSome,
        findOne: session.api.user_logs.getOne,
        findByIds: session.api.user_logs.getByIds,
        addOne: session.api.user_logs.createOne,
        addSome: session.api.user_logs.createSome,
        deleteOne: session.api.user_logs.deleteOne,
        updateOne: session.api.user_logs.updateOne,
    }, __assign({}, options));
};
exports.useUserLogs = useUserLogs;
var useAnalyticsFrames = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('analytics_frames', useTypedSelector(function (s) { return s.analytics_frames; }), session, analyticsFramesSlice, {
        loadQuery: session.api.analytics_frames.getSome,
        findOne: session.api.analytics_frames.getOne,
        findByIds: session.api.analytics_frames.getByIds,
        addOne: session.api.analytics_frames.createOne,
        addSome: session.api.analytics_frames.createSome,
        deleteOne: session.api.analytics_frames.deleteOne,
        updateOne: session.api.analytics_frames.updateOne,
    }, __assign({}, options));
};
exports.useAnalyticsFrames = useAnalyticsFrames;
var useEnduserCustomTypes = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('enduser_custom_types', useTypedSelector(function (s) { return s.enduser_custom_types; }), session, enduserCustomTypesSlice, {
        loadQuery: session.api.enduser_custom_types.getSome,
        findOne: session.api.enduser_custom_types.getOne,
        findByIds: session.api.enduser_custom_types.getByIds,
        addOne: session.api.enduser_custom_types.createOne,
        addSome: session.api.enduser_custom_types.createSome,
        deleteOne: session.api.enduser_custom_types.deleteOne,
        updateOne: session.api.enduser_custom_types.updateOne,
    }, __assign({}, options));
};
exports.useEnduserCustomTypes = useEnduserCustomTypes;
var useChatRooms = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    // const dispatch = useTellescopeDispatch()
    var rooms = useTypedSelector(function (s) { return s.chat_rooms; });
    // const onUpdate = useCallback((updated: ({ id: string | number } & Partial<ChatRoom>)[]) => {
    //   for (const u of updated) {
    //     // fetch updated display info if enduserIds or userIds have changed
    //     if (!(value_is_loaded(rooms) && rooms.value.find(v => v.id === u.id && v.updatedAt === u.updatedAt))) {
    //       session.api.chat_rooms.display_info({ id: u.id })
    //       .then(({ id, display_info }) => {
    //         dispatch(chatRoomDisplayInfoslice.actions.update({ value: { id, updates: display_info }}))
    //       })
    //       .catch(e => console.error('Error fetching chatRoomDisplayInfo in useChatRooms onUpdate', e))
    //     }
    //   }
    // }, [session, dispatch])
    return (0, exports.useListStateHook)('chat_rooms', rooms, session, chatRoomsSlice, {
        loadQuery: session.api.chat_rooms.getSome,
        findOne: session.api.chat_rooms.getOne,
        findByIds: session.api.chat_rooms.getByIds,
        addOne: session.api.chat_rooms.createOne,
        addSome: session.api.chat_rooms.createSome,
        deleteOne: session.api.chat_rooms.deleteOne,
        updateOne: session.api.chat_rooms.updateOne,
    }, __assign({}, options));
};
exports.useChatRooms = useChatRooms;
var useChats = function (roomId, options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    var state = useTypedSelector(function (s) { return s.chats; });
    var _a = (0, exports.useChatRooms)(), _ = _a[0], updateLocalChatRoom = _a[1].updateLocalElement;
    // don't rely on socket update for new messages
    var onAdd = (0, react_1.useCallback)(function (ms) {
        var _a;
        if (ms.length === 0)
            return;
        var newest = ms[0];
        updateLocalChatRoom(newest.roomId, {
            recentMessage: newest.message,
            recentSender: (_a = newest.senderId) !== null && _a !== void 0 ? _a : '',
            recentMessageSentAt: Date.now(),
        });
    }, [updateLocalChatRoom]);
    var toReturn = (0, exports.useListStateHook)('chats', state, session, chatsSlice, {
        loadQuery: session.api.chats.getSome,
        findOne: session.api.chats.getOne,
        findByIds: session.api.chats.getByIds,
        addOne: session.api.chats.createOne,
        addSome: session.api.chats.createSome,
        deleteOne: session.api.chats.deleteOne,
        updateOne: session.api.chats.updateOne,
    }, __assign(__assign({}, options), { loadFilter: __assign(__assign({}, options.loadFilter), { roomId: roomId }), 
        // returnFilter: v => (options.returnFilter ?? (v => true))(v) && v.roomId === roomId,
        onAdd: onAdd }));
    if (roomId) {
        return [toReturn[1].filtered(function (c) { return c.roomId === roomId; }), toReturn[1]];
    }
    return toReturn;
};
exports.useChats = useChats;
var useEndusers = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('endusers', useTypedSelector(function (s) { return s.endusers; }), session, endusersSlice, {
        loadQuery: session.api.endusers.getSome,
        findOne: session.api.endusers.getOne,
        findByIds: session.api.endusers.getByIds,
        addOne: session.api.endusers.createOne,
        addSome: session.api.endusers.createSome,
        deleteOne: session.api.endusers.deleteOne,
        updateOne: session.api.endusers.updateOne,
    }, __assign({}, options));
};
exports.useEndusers = useEndusers;
var useTickets = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('tickets', useTypedSelector(function (s) { return s.tickets; }), session, ticketsSlice, {
        loadQuery: session.api.tickets.getSome,
        findOne: session.api.tickets.getOne,
        findByIds: session.api.tickets.getByIds,
        addOne: session.api.tickets.createOne,
        addSome: session.api.tickets.createSome,
        deleteOne: session.api.tickets.deleteOne,
        updateOne: session.api.tickets.updateOne,
    }, __assign({}, options));
};
exports.useTickets = useTickets;
var useMeetings = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('meetings', useTypedSelector(function (s) { return s.meetings; }), session, meetingsSlice, {
        loadQuery: session.api.meetings.my_meetings,
        findOne: session.api.meetings.getOne,
        findByIds: session.api.meetings.getByIds,
        addOne: session.api.meetings.createOne,
        addSome: session.api.meetings.createSome,
        deleteOne: session.api.meetings.deleteOne,
        updateOne: session.api.meetings.updateOne,
    }, __assign({}, options));
};
exports.useMeetings = useMeetings;
var useFiles = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('files', useTypedSelector(function (s) { return s.files; }), session, filesSlice, {
        loadQuery: session.api.files.getSome,
        findOne: session.api.files.getOne,
        findByIds: session.api.files.getByIds,
        deleteOne: session.api.files.deleteOne,
        updateOne: session.api.files.updateOne,
    }, __assign({}, options));
};
exports.useFiles = useFiles;
var useJourneys = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('journeys', useTypedSelector(function (s) { return s.journeys; }), session, journeysSlice, {
        loadQuery: session.api.journeys.getSome,
        findOne: session.api.journeys.getOne,
        findByIds: session.api.journeys.getByIds,
        addOne: session.api.journeys.createOne,
        addSome: session.api.journeys.createSome,
        deleteOne: session.api.journeys.deleteOne,
        updateOne: session.api.journeys.updateOne,
    }, __assign({}, options));
};
exports.useJourneys = useJourneys;
var useUsers = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('users', useTypedSelector(function (s) { return s.users; }), session, usersSlice, {
        loadQuery: session.api.users.getSome,
        findOne: session.api.users.getOne,
        findByIds: session.api.users.getByIds,
        addOne: session.api.users.createOne,
        addSome: session.api.users.createSome,
        deleteOne: session.api.users.deleteOne,
        updateOne: session.api.users.updateOne,
    }, __assign({}, options));
};
exports.useUsers = useUsers;
var useAutomationSteps = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('automation_steps', useTypedSelector(function (s) { return s.automation_steps; }), session, automationStepsSlice, {
        loadQuery: session.api.automation_steps.getSome,
        findOne: session.api.automation_steps.getOne,
        findByIds: session.api.automation_steps.getByIds,
        addOne: session.api.automation_steps.createOne,
        addSome: session.api.automation_steps.createSome,
        deleteOne: session.api.automation_steps.deleteOne,
        updateOne: session.api.automation_steps.updateOne,
    }, __assign({}, options));
};
exports.useAutomationSteps = useAutomationSteps;
var useNotes = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('notes', useTypedSelector(function (s) { return s.notes; }), session, notesSlice, {
        loadQuery: session.api.notes.getSome,
        findOne: session.api.notes.getOne,
        findByIds: session.api.notes.getByIds,
        addOne: session.api.notes.createOne,
        addSome: session.api.notes.createSome,
        deleteOne: session.api.notes.deleteOne,
        updateOne: session.api.notes.updateOne,
    }, __assign({}, options));
};
exports.useNotes = useNotes;
var useAvailabilityBlocks = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('availability_blocks', useTypedSelector(function (s) { return s.availability_blocks; }), session, availabilityBlocksSlice, {
        loadQuery: session.api.availability_blocks.getSome,
        findOne: session.api.availability_blocks.getOne,
        findByIds: session.api.availability_blocks.getByIds,
        addOne: session.api.availability_blocks.createOne,
        addSome: session.api.availability_blocks.createSome,
        deleteOne: session.api.availability_blocks.deleteOne,
        updateOne: session.api.availability_blocks.updateOne,
    }, __assign({}, options));
};
exports.useAvailabilityBlocks = useAvailabilityBlocks;
var useTemplates = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('templates', useTypedSelector(function (s) { return s.templates; }), session, templatesSlice, {
        loadQuery: session.api.templates.getSome,
        findOne: session.api.templates.getOne,
        findByIds: session.api.templates.getByIds,
        addOne: session.api.templates.createOne,
        addSome: session.api.templates.createSome,
        deleteOne: session.api.templates.deleteOne,
        updateOne: session.api.templates.updateOne,
    }, __assign({}, options));
};
exports.useTemplates = useTemplates;
var useForms = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('forms', useTypedSelector(function (s) { return s.forms; }), session, formsSlice, {
        loadQuery: session.api.forms.getSome,
        findOne: session.api.forms.getOne,
        findByIds: session.api.forms.getByIds,
        addOne: session.api.forms.createOne,
        addSome: session.api.forms.createSome,
        deleteOne: session.api.forms.deleteOne,
        updateOne: session.api.forms.updateOne,
    }, __assign({}, options));
};
exports.useForms = useForms;
var useFormFields = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('form_fields', useTypedSelector(function (s) { return s.form_fields; }), session, formsFieldsSlice, {
        loadQuery: session.api.form_fields.getSome,
        findOne: session.api.form_fields.getOne,
        findByIds: session.api.form_fields.getByIds,
        addOne: session.api.form_fields.createOne,
        addSome: session.api.form_fields.createSome,
        deleteOne: session.api.form_fields.deleteOne,
        updateOne: session.api.form_fields.updateOne,
    }, __assign({}, options));
};
exports.useFormFields = useFormFields;
var useFormResponses = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('form_responses', useTypedSelector(function (s) { return s.form_responses; }), session, formResponsesSlice, {
        loadQuery: session.api.form_responses.getSome,
        findOne: session.api.form_responses.getOne,
        findByIds: session.api.form_responses.getByIds,
        addOne: session.api.form_responses.createOne,
        addSome: session.api.form_responses.createSome,
        deleteOne: session.api.form_responses.deleteOne,
        updateOne: session.api.form_responses.updateOne,
    }, __assign({}, options));
};
exports.useFormResponses = useFormResponses;
/** @deprecated */
var useUserDisplayInfo = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useEnduserSession)();
    var state = useTypedSelector(function (s) { return s.users_display; });
    return (0, exports.useListStateHook)('users', state, session, usersDisplaySlice, {
        loadQuery: session.api.users.display_info,
    }, __assign({}, options));
};
exports.useUserDisplayInfo = useUserDisplayInfo;
var useEnduserObservations = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('enduser_observations', useTypedSelector(function (s) { return s.enduser_observations; }), session, enduserObservationsSlice, {
        loadQuery: session.api.enduser_observations.getSome,
        findOne: session.api.enduser_observations.getOne,
        findByIds: session.api.enduser_observations.getByIds,
        addOne: session.api.enduser_observations.createOne,
        addSome: session.api.enduser_observations.createSome,
        deleteOne: session.api.enduser_observations.deleteOne,
        updateOne: session.api.enduser_observations.updateOne,
    }, __assign({}, options));
};
exports.useEnduserObservations = useEnduserObservations;
var useManagedContentRecords = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('managed_content_records', useTypedSelector(function (s) { return s.managed_content_records; }), session, managedContentRecoredsSlice, {
        loadQuery: session.api.managed_content_records.getSome,
        findOne: session.api.managed_content_records.getOne,
        findByIds: session.api.managed_content_records.getByIds,
        addOne: session.api.managed_content_records.createOne,
        addSome: session.api.managed_content_records.createSome,
        deleteOne: session.api.managed_content_records.deleteOne,
        updateOne: session.api.managed_content_records.updateOne,
    }, __assign({}, options));
};
exports.useManagedContentRecords = useManagedContentRecords;
var useManagedContentRecordAssignments = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('managed_content_record_assignments', useTypedSelector(function (s) { return s.managed_content_record_assignments; }), session, managedContentRecoredAssignmentsSlice, {
        loadQuery: session.api.managed_content_record_assignments.getSome,
        findOne: session.api.managed_content_record_assignments.getOne,
        findByIds: session.api.managed_content_record_assignments.getByIds,
        addOne: session.api.managed_content_record_assignments.createOne,
        addSome: session.api.managed_content_record_assignments.createSome,
        deleteOne: session.api.managed_content_record_assignments.deleteOne,
        updateOne: session.api.managed_content_record_assignments.updateOne,
    }, __assign({}, options));
};
exports.useManagedContentRecordAssignments = useManagedContentRecordAssignments;
var useAssignedManagedContentRecords = function () {
    var session = (0, index_1.useEnduserSession)();
    var _a = (0, exports.useManagedContentRecords)(), filtered = _a[1].filtered;
    var eventsLoading = (0, exports.useCalendarEvents)()[0];
    var assignmentsLoading = (0, exports.useManagedContentRecordAssignments)()[0];
    if (!(0, loading_1.value_is_loaded)(assignmentsLoading))
        return {
            status: assignmentsLoading.status,
            value: undefined
        };
    var recordsLoading = filtered(function (r) {
        var _a;
        return r.assignmentType === 'All'
            || r.enduserId === session.userInfo.id
            || !!assignmentsLoading.value.find(function (e) { return e.contentId === r.id; })
            || (r.assignmentType === 'By Tags'
                && ((_a = r.tags) === null || _a === void 0 ? void 0 : _a.length)
                && !!r.tags.find(function (t) { var _a; return (_a = session.userInfo.tags) === null || _a === void 0 ? void 0 : _a.includes(t); }))
            || ((0, loading_1.value_is_loaded)(eventsLoading)
                && !!eventsLoading.value.find(function (e) { var _a; return (_a = e.sharedContentIds) === null || _a === void 0 ? void 0 : _a.includes(r.id); }));
    });
    return recordsLoading;
};
exports.useAssignedManagedContentRecords = useAssignedManagedContentRecords;
var useForums = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('forums', useTypedSelector(function (s) { return s.forums; }), session, forumsSlice, {
        loadQuery: session.api.forums.getSome,
        findOne: session.api.forums.getOne,
        findByIds: session.api.forums.getByIds,
        addOne: session.api.forums.createOne,
        addSome: session.api.forums.createSome,
        deleteOne: session.api.forums.deleteOne,
        updateOne: session.api.forums.updateOne,
    }, __assign({}, options));
};
exports.useForums = useForums;
var useForumPosts = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('forum_posts', useTypedSelector(function (s) { return s.forum_posts; }), session, forumPostsSlice, {
        loadQuery: session.api.forum_posts.getSome,
        findOne: session.api.forum_posts.getOne,
        findByIds: session.api.forum_posts.getByIds,
        addOne: session.api.forum_posts.createOne,
        addSome: session.api.forum_posts.createSome,
        deleteOne: session.api.forum_posts.deleteOne,
        updateOne: session.api.forum_posts.updateOne,
    }, __assign({}, options));
};
exports.useForumPosts = useForumPosts;
var usePostComments = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('post_comments', useTypedSelector(function (s) { return s.post_comments; }), session, postCommentsSlice, {
        loadQuery: session.api.post_comments.getSome,
        findOne: session.api.post_comments.getOne,
        findByIds: session.api.post_comments.getByIds,
        addOne: session.api.post_comments.createOne,
        addSome: session.api.post_comments.createSome,
        deleteOne: session.api.post_comments.deleteOne,
        updateOne: session.api.post_comments.updateOne,
    }, __assign({}, options));
};
exports.usePostComments = usePostComments;
var usePostLikes = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('post_likes', useTypedSelector(function (s) { return s.post_likes; }), session, postLikesSlice, {
        loadQuery: session.api.post_likes.getSome,
        findOne: session.api.post_likes.getOne,
        findByIds: session.api.post_likes.getByIds,
        addOne: session.api.post_likes.createOne,
        addSome: session.api.post_likes.createSome,
        deleteOne: session.api.post_likes.deleteOne,
        updateOne: session.api.post_likes.updateOne,
    }, __assign({}, options));
};
exports.usePostLikes = usePostLikes;
var useCommentLikes = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('comment_likes', useTypedSelector(function (s) { return s.comment_likes; }), session, commentLikesSlice, {
        loadQuery: session.api.comment_likes.getSome,
        findOne: session.api.comment_likes.getOne,
        findByIds: session.api.comment_likes.getByIds,
        addOne: session.api.comment_likes.createOne,
        addSome: session.api.comment_likes.createSome,
        deleteOne: session.api.comment_likes.deleteOne,
        updateOne: session.api.comment_likes.updateOne,
    }, __assign({}, options));
};
exports.useCommentLikes = useCommentLikes;
var useCalendarEventRSVPs = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('calendar_event_RSVPs', useTypedSelector(function (s) { return s.calendar_event_RSVPs; }), session, calendarEventRSVPsSlice, {
        loadQuery: session.api.calendar_event_RSVPs.getSome,
        findOne: session.api.calendar_event_RSVPs.getOne,
        findByIds: session.api.calendar_event_RSVPs.getByIds,
        addOne: session.api.calendar_event_RSVPs.createOne,
        addSome: session.api.calendar_event_RSVPs.createSome,
        deleteOne: session.api.calendar_event_RSVPs.deleteOne,
        updateOne: session.api.calendar_event_RSVPs.updateOne,
    }, __assign({}, options));
};
exports.useCalendarEventRSVPs = useCalendarEventRSVPs;
var useRoleBasedAccessPermissions = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('role_based_access_permissions', useTypedSelector(function (s) { return s.role_based_access_permissions; }), session, roleBasedAccessPermissionsSlice, {
        loadQuery: session.api.role_based_access_permissions.getSome,
        findOne: session.api.role_based_access_permissions.getOne,
        findByIds: session.api.role_based_access_permissions.getByIds,
        addOne: session.api.role_based_access_permissions.createOne,
        addSome: session.api.role_based_access_permissions.createSome,
        deleteOne: session.api.role_based_access_permissions.deleteOne,
        updateOne: session.api.role_based_access_permissions.updateOne,
    }, __assign({}, options));
};
exports.useRoleBasedAccessPermissions = useRoleBasedAccessPermissions;
var useTicketThreads = function (options) {
    var _a;
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('ticket_threads', useTypedSelector(function (s) { return s.ticket_threads; }), session, ticketThreadsSlice, {
        loadQuery: session.api.ticket_threads.getSome,
        findOne: session.api.ticket_threads.getOne,
        findByIds: session.api.ticket_threads.getByIds,
        addOne: session.api.ticket_threads.createOne,
        addSome: session.api.ticket_threads.createSome,
        deleteOne: session.api.ticket_threads.deleteOne,
        updateOne: session.api.ticket_threads.updateOne,
    }, __assign(__assign({}, options), { dontFetch: (_a = options.dontFetch) !== null && _a !== void 0 ? _a : !session.userInfo.ticketThreadsEnabled }));
};
exports.useTicketThreads = useTicketThreads;
var useTicketThreadComments = function (options) {
    var _a;
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('ticket_thread_comments', useTypedSelector(function (s) { return s.ticket_thread_comments; }), session, ticketThreadCommentsSlice, {
        loadQuery: session.api.ticket_thread_comments.getSome,
        findOne: session.api.ticket_thread_comments.getOne,
        findByIds: session.api.ticket_thread_comments.getByIds,
        addOne: session.api.ticket_thread_comments.createOne,
        addSome: session.api.ticket_thread_comments.createSome,
        deleteOne: session.api.ticket_thread_comments.deleteOne,
        updateOne: session.api.ticket_thread_comments.updateOne,
    }, __assign(__assign({}, options), { dontFetch: (_a = options.dontFetch) !== null && _a !== void 0 ? _a : !session.userInfo.ticketThreadsEnabled }));
};
exports.useTicketThreadComments = useTicketThreadComments;
var useSuperbills = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('superbills', useTypedSelector(function (s) { return s.superbills; }), session, superbillsSlice, {
        loadQuery: session.api.superbills.getSome,
        findOne: session.api.superbills.getOne,
        findByIds: session.api.superbills.getByIds,
        addOne: session.api.superbills.createOne,
        addSome: session.api.superbills.createSome,
        deleteOne: session.api.superbills.deleteOne,
        updateOne: session.api.superbills.updateOne,
    }, __assign({}, options));
};
exports.useSuperbills = useSuperbills;
var useSuperbillProviders = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('superbill_providers', useTypedSelector(function (s) { return s.superbill_providers; }), session, superbillProvidersSlice, {
        loadQuery: session.api.superbill_providers.getSome,
        findOne: session.api.superbill_providers.getOne,
        findByIds: session.api.superbill_providers.getByIds,
        addOne: session.api.superbill_providers.createOne,
        addSome: session.api.superbill_providers.createSome,
        deleteOne: session.api.superbill_providers.deleteOne,
        updateOne: session.api.superbill_providers.updateOne,
    }, __assign({}, options));
};
exports.useSuperbillProviders = useSuperbillProviders;
var useTableViews = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('table_views', useTypedSelector(function (s) { return s.table_views; }), session, tableViewsSlice, {
        loadQuery: session.api.table_views.getSome,
        findOne: session.api.table_views.getOne,
        findByIds: session.api.table_views.getByIds,
        addOne: session.api.table_views.createOne,
        addSome: session.api.table_views.createSome,
        deleteOne: session.api.table_views.deleteOne,
        updateOne: session.api.table_views.updateOne,
    }, __assign({}, options));
};
exports.useTableViews = useTableViews;
var useEmailSyncDenials = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('email_sync_denials', useTypedSelector(function (s) { return s.email_sync_denials; }), session, emailSyncDenialsSlice, {
        loadQuery: session.api.email_sync_denials.getSome,
        findOne: session.api.email_sync_denials.getOne,
        findByIds: session.api.email_sync_denials.getByIds,
        addOne: session.api.email_sync_denials.createOne,
        addSome: session.api.email_sync_denials.createSome,
        deleteOne: session.api.email_sync_denials.deleteOne,
        updateOne: session.api.email_sync_denials.updateOne,
    }, __assign({}, options));
};
exports.useEmailSyncDenials = useEmailSyncDenials;
var usePhoneCalls = function (options) {
    var _a;
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('phone_calls', useTypedSelector(function (s) { return s.phone_calls; }), session, phoneCallsSlice, {
        loadQuery: session.api.phone_calls.getSome,
        findOne: session.api.phone_calls.getOne,
        findByIds: session.api.phone_calls.getByIds,
        addOne: session.api.phone_calls.createOne,
        addSome: session.api.phone_calls.createSome,
        deleteOne: session.api.phone_calls.deleteOne,
        updateOne: session.api.phone_calls.updateOne,
    }, __assign(__assign({}, options), { dontFetch: (_a = options.dontFetch) !== null && _a !== void 0 ? _a : !(session.userInfo.orgTwilioNumber || session.userInfo.twilioNumber) }));
};
exports.usePhoneCalls = usePhoneCalls;
var useOrganizations = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('organizations', useTypedSelector(function (s) { return s.organizations; }), session, organizationsSlice, {
        loadQuery: session.api.organizations.getSome,
        findOne: session.api.organizations.getOne,
        findByIds: session.api.organizations.getByIds,
        // addOne: session.api.organizations.createOne,
        // addSome: session.api.organizations.createSome,
        deleteOne: session.api.organizations.deleteOne,
        updateOne: session.api.organizations.updateOne,
    }, __assign({}, options));
};
exports.useOrganizations = useOrganizations;
var useOrganization = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    var _a = (0, exports.useOrganizations)(options), organizationsLoading = _a[0], actions = _a[1];
    return [
        {
            status: organizationsLoading.status,
            value: ((0, loading_1.value_is_loaded)(organizationsLoading)
                ? organizationsLoading.value.find(function (o) { return (0, utilities_1.matches_organization)(session.userInfo, o); })
                : undefined)
        },
        actions,
    ];
};
exports.useOrganization = useOrganization;
var useIntegrations = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('integrations', useTypedSelector(function (s) { return s.integrations; }), session, integrationsSlice, {
        loadQuery: session.api.integrations.getSome,
        findOne: session.api.integrations.getOne,
        findByIds: session.api.integrations.getByIds,
        addOne: session.api.integrations.createOne,
        addSome: session.api.integrations.createSome,
        deleteOne: session.api.integrations.deleteOne,
        updateOne: session.api.integrations.updateOne,
    }, __assign({}, options));
};
exports.useIntegrations = useIntegrations;
var usePortalCustomizations = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('portal_customizations', useTypedSelector(function (s) { return s.portal_customizations; }), session, portalCustomizationsSlice, {
        loadQuery: session.api.portal_customizations.getSome,
        findOne: session.api.portal_customizations.getOne,
        findByIds: session.api.portal_customizations.getByIds,
        addOne: session.api.portal_customizations.createOne,
        addSome: session.api.portal_customizations.createSome,
        deleteOne: session.api.portal_customizations.deleteOne,
        updateOne: session.api.portal_customizations.updateOne,
    }, __assign({}, options));
};
exports.usePortalCustomizations = usePortalCustomizations;
var useCarePlans = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('care_plans', useTypedSelector(function (s) { return s.care_plans; }), session, carePlansSlice, {
        loadQuery: session.api.care_plans.getSome,
        findOne: session.api.care_plans.getOne,
        findByIds: session.api.care_plans.getByIds,
        addOne: session.api.care_plans.createOne,
        addSome: session.api.care_plans.createSome,
        deleteOne: session.api.care_plans.deleteOne,
        updateOne: session.api.care_plans.updateOne,
    }, __assign({}, options));
};
exports.useCarePlans = useCarePlans;
var useEnduserTasks = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('enduser_tasks', useTypedSelector(function (s) { return s.enduser_tasks; }), session, enduserTasksSlice, {
        loadQuery: session.api.enduser_tasks.getSome,
        findOne: session.api.enduser_tasks.getOne,
        findByIds: session.api.enduser_tasks.getByIds,
        addOne: session.api.enduser_tasks.createOne,
        addSome: session.api.enduser_tasks.createSome,
        deleteOne: session.api.enduser_tasks.deleteOne,
        updateOne: session.api.enduser_tasks.updateOne,
    }, __assign({}, options));
};
exports.useEnduserTasks = useEnduserTasks;
var useCalendarEventTemplates = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('calendar_event_templates', useTypedSelector(function (s) { return s.calendar_event_templates; }), session, calendarEventTemplatesSlice, {
        loadQuery: session.api.calendar_event_templates.getSome,
        findOne: session.api.calendar_event_templates.getOne,
        findByIds: session.api.calendar_event_templates.getByIds,
        addOne: session.api.calendar_event_templates.createOne,
        addSome: session.api.calendar_event_templates.createSome,
        deleteOne: session.api.calendar_event_templates.deleteOne,
        updateOne: session.api.calendar_event_templates.updateOne,
    }, __assign({}, options));
};
exports.useCalendarEventTemplates = useCalendarEventTemplates;
var useAppointmentBookingPages = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)(); // enduser should be able to load for self-scheduling
    return (0, exports.useListStateHook)('appointment_booking_pages', useTypedSelector(function (s) { return s.appointment_booking_pages; }), session, appointmentBookingPagesSlice, {
        loadQuery: session.api.appointment_booking_pages.getSome,
        findOne: session.api.appointment_booking_pages.getOne,
        findByIds: session.api.appointment_booking_pages.getByIds,
        addOne: session.api.appointment_booking_pages.createOne,
        addSome: session.api.appointment_booking_pages.createSome,
        deleteOne: session.api.appointment_booking_pages.deleteOne,
        updateOne: session.api.appointment_booking_pages.updateOne,
    }, __assign({}, options));
};
exports.useAppointmentBookingPages = useAppointmentBookingPages;
var useEnduserViews = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('enduser_views', useTypedSelector(function (s) { return s.enduser_views; }), session, enduserViewsSlice, {
        loadQuery: session.api.enduser_views.getSome,
        findOne: session.api.enduser_views.getOne,
        findByIds: session.api.enduser_views.getByIds,
        addOne: session.api.enduser_views.createOne,
        addSome: session.api.enduser_views.createSome,
        deleteOne: session.api.enduser_views.deleteOne,
        updateOne: session.api.enduser_views.updateOne,
    }, __assign({}, options));
};
exports.useEnduserViews = useEnduserViews;
var useBackgroundErrors = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('background_errors', useTypedSelector(function (s) { return s.background_errors; }), session, backgroundErrorsSlice, {
        loadQuery: session.api.background_errors.getSome,
        findOne: session.api.background_errors.getOne,
        findByIds: session.api.background_errors.getByIds,
        addOne: session.api.background_errors.createOne,
        addSome: session.api.background_errors.createSome,
        deleteOne: session.api.background_errors.deleteOne,
        updateOne: session.api.background_errors.updateOne,
    }, __assign({}, options));
};
exports.useBackgroundErrors = useBackgroundErrors;
var useAppointmentLocations = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('appointment_locations', useTypedSelector(function (s) { return s.appointment_locations; }), session, appointmentLocationsSlice, {
        loadQuery: session.api.appointment_locations.getSome,
        findOne: session.api.appointment_locations.getOne,
        findByIds: session.api.appointment_locations.getByIds,
        addOne: session.api.appointment_locations.createOne,
        addSome: session.api.appointment_locations.createSome,
        deleteOne: session.api.appointment_locations.deleteOne,
        updateOne: session.api.appointment_locations.updateOne,
    }, __assign({}, options));
};
exports.useAppointmentLocations = useAppointmentLocations;
var useDatabases = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('databases', useTypedSelector(function (s) { return s.databases; }), session, databasesSlice, {
        loadQuery: session.api.databases.getSome,
        findOne: session.api.databases.getOne,
        findByIds: session.api.databases.getByIds,
        addOne: session.api.databases.createOne,
        addSome: session.api.databases.createSome,
        deleteOne: session.api.databases.deleteOne,
        updateOne: session.api.databases.updateOne,
    }, __assign({}, options));
};
exports.useDatabases = useDatabases;
var useDatabaseRecords = function (options) {
    var _a;
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('database_records', useTypedSelector(function (s) { return s.database_records; }), session, databaseRecordsSlice, {
        loadQuery: (((_a = options.loadFilter) === null || _a === void 0 ? void 0 : _a.databaseId)
            ? session.api.database_records.getSome
            : undefined),
        findOne: session.api.database_records.getOne,
        findByIds: session.api.database_records.getByIds,
        addOne: session.api.database_records.createOne,
        addSome: session.api.database_records.createSome,
        deleteOne: session.api.database_records.deleteOne,
        updateOne: session.api.database_records.updateOne,
    }, __assign({}, options));
};
exports.useDatabaseRecords = useDatabaseRecords;
var useProducts = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('products', useTypedSelector(function (s) { return s.products; }), session, productsSlice, {
        loadQuery: session.api.products.getSome,
        findOne: session.api.products.getOne,
        findByIds: session.api.products.getByIds,
        addOne: session.api.products.createOne,
        addSome: session.api.products.createSome,
        deleteOne: session.api.products.deleteOne,
        updateOne: session.api.products.updateOne,
    }, __assign({}, options));
};
exports.useProducts = useProducts;
var usePurchases = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('purchases', useTypedSelector(function (s) { return s.purchases; }), session, purchasesSlice, {
        loadQuery: session.api.purchases.getSome,
        findOne: session.api.purchases.getOne,
        findByIds: session.api.purchases.getByIds,
        addOne: session.api.purchases.createOne,
        addSome: session.api.purchases.createSome,
        deleteOne: session.api.purchases.deleteOne,
        updateOne: session.api.purchases.updateOne,
    }, __assign({}, options));
};
exports.usePurchases = usePurchases;
var usePurchaseCredits = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useResolvedSession)();
    return (0, exports.useListStateHook)('purchase_credits', useTypedSelector(function (s) { return s.purchase_credits; }), session, purchaseCreditsSlice, {
        loadQuery: session.api.purchase_credits.getSome,
        findOne: session.api.purchase_credits.getOne,
        findByIds: session.api.purchase_credits.getByIds,
        addOne: session.api.purchase_credits.createOne,
        addSome: session.api.purchase_credits.createSome,
        deleteOne: session.api.purchase_credits.deleteOne,
        updateOne: session.api.purchase_credits.updateOne,
    }, __assign({}, options));
};
exports.usePurchaseCredits = usePurchaseCredits;
var useBlockedPhones = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('blocked_phones', useTypedSelector(function (s) { return s.blocked_phones; }), session, blockedPhonesSlice, {
        loadQuery: session.api.blocked_phones.getSome,
        findOne: session.api.blocked_phones.getOne,
        findByIds: session.api.blocked_phones.getByIds,
        addOne: session.api.blocked_phones.createOne,
        addSome: session.api.blocked_phones.createSome,
        deleteOne: session.api.blocked_phones.deleteOne,
        updateOne: session.api.blocked_phones.updateOne,
    }, __assign({}, options));
};
exports.useBlockedPhones = useBlockedPhones;
var usePrescriptionRoutes = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('prescription_routes', useTypedSelector(function (s) { return s.prescription_routes; }), session, prescriptionRoutesSlice, {
        loadQuery: session.api.prescription_routes.getSome,
        findOne: session.api.prescription_routes.getOne,
        findByIds: session.api.prescription_routes.getByIds,
        addOne: session.api.prescription_routes.createOne,
        addSome: session.api.prescription_routes.createSome,
        deleteOne: session.api.prescription_routes.deleteOne,
        updateOne: session.api.prescription_routes.updateOne,
    }, __assign({}, options));
};
exports.usePrescriptionRoutes = usePrescriptionRoutes;
var useCalendarEventsForUser = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    var loadedRef = (0, react_1.useRef)({});
    var fetchEvents = react_1.default.useCallback(function (calledOptions) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, session.api.calendar_events.get_events_for_user({
                        userId: (_b = (_a = calledOptions === null || calledOptions === void 0 ? void 0 : calledOptions.userId) !== null && _a !== void 0 ? _a : options === null || options === void 0 ? void 0 : options.userId) !== null && _b !== void 0 ? _b : session.userInfo.id,
                        userIds: calledOptions === null || calledOptions === void 0 ? void 0 : calledOptions.userIds,
                        limit: (_c = calledOptions === null || calledOptions === void 0 ? void 0 : calledOptions.limit) !== null && _c !== void 0 ? _c : options === null || options === void 0 ? void 0 : options.limit,
                        from: (_e = (_d = calledOptions === null || calledOptions === void 0 ? void 0 : calledOptions.from) !== null && _d !== void 0 ? _d : options === null || options === void 0 ? void 0 : options.from) !== null && _e !== void 0 ? _e : new Date(),
                    })];
                case 1: return [2 /*return*/, (_f.sent()).events.filter(function (e) { return e.title !== '[Tellescope Event Placeholder]'; })];
            }
        });
    }); }, [options, session]);
    var _a = (0, exports.useCalendarEvents)(), eventsLoading = _a[0], _b = _a[1], addLocalElements = _b.addLocalElements, filtered = _b.filtered;
    var loadEvents = (0, react_1.useCallback)(function (options) { return __awaiter(void 0, void 0, void 0, function () {
        var key, load, i, from, _loop_1, state_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    key = JSON.stringify(options !== null && options !== void 0 ? options : {});
                    if (loadedRef.current[key])
                        return [2 /*return*/];
                    loadedRef.current[key] = Date.now();
                    load = function (from) { return (console.log('Loading events from', from, 'to', options === null || options === void 0 ? void 0 : options.to),
                        fetchEvents(__assign(__assign({}, options), { from: from }))
                            .then(function (es) { return addLocalElements(es, { replaceIfMatch: true }); })
                            .catch(console.error)); };
                    i = 0;
                    from = options === null || options === void 0 ? void 0 : options.from;
                    _loop_1 = function () {
                        var loaded, to;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    i++;
                                    return [4 /*yield*/, load(from)];
                                case 1:
                                    loaded = _b.sent();
                                    to = options === null || options === void 0 ? void 0 : options.to;
                                    if (!to) {
                                        return [2 /*return*/, "break"];
                                    }
                                    if (!loaded) {
                                        return [2 /*return*/, "break"];
                                    }
                                    if (loaded.length === 0) {
                                        return [2 /*return*/, "break"];
                                    }
                                    if (loaded.find(function (e) { return new Date(e.startTimeInMS).getTime() > to.getTime(); })) {
                                        return [2 /*return*/, "break"];
                                    }
                                    // else continue to loop (up to 10 times) until we find events after the to date
                                    from = new Date(Math.max.apply(Math, loaded.map(function (e) { return e.startTimeInMS; })));
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 1;
                case 1:
                    if (!(i < 10)) return [3 /*break*/, 3];
                    return [5 /*yield**/, _loop_1()];
                case 2:
                    state_1 = _a.sent();
                    if (state_1 === "break")
                        return [3 /*break*/, 3];
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [session, loadedRef, fetchEvents, addLocalElements]);
    return [eventsLoading, { loadEvents: loadEvents, filtered: filtered }];
};
exports.useCalendarEventsForUser = useCalendarEventsForUser;
var useWaitlists = function (options) {
    if (options === void 0) { options = {}; }
    var session = (0, index_1.useSession)();
    return (0, exports.useListStateHook)('waitlists', useTypedSelector(function (s) { return s.waitlists; }), session, waitlistsSlice, {
        loadQuery: session.api.waitlists.getSome,
        findOne: session.api.waitlists.getOne,
        findByIds: session.api.waitlists.getByIds,
        addOne: session.api.waitlists.createOne,
        addSome: session.api.waitlists.createSome,
        deleteOne: session.api.waitlists.deleteOne,
        updateOne: session.api.waitlists.updateOne,
    }, __assign({}, options));
};
exports.useWaitlists = useWaitlists;
//# sourceMappingURL=state.js.map