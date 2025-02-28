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
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useCallback, useContext, useEffect, createContext, useRef } from 'react';
import { createDispatchHook, createSelectorHook, Provider } from 'react-redux';
import { createSlice, configureStore, createAction } from '@reduxjs/toolkit';
import { LoadingStatus, UNLOADED, } from "@tellescope/types-utilities";
import { useEnduserSession, useResolvedSession, useSession, } from "./index";
import { value_is_loaded } from './loading';
import { matches_organization, object_is_empty, objects_equivalent } from '@tellescope/utilities';
var RESET_CACHE_TYPE = "cache/reset";
export var resetStateAction = createAction(RESET_CACHE_TYPE);
export var TellescopeStoreContext = React.createContext(null);
export var createTellescopeSelector = function () { return createSelectorHook(TellescopeStoreContext); };
var FetchContext = createContext({});
export var WithFetchContext = function (_a) {
    var children = _a.children;
    var lookupRef = React.useRef({});
    var lastIdRef = React.useRef({});
    var lastDateRef = React.useRef({});
    var reset = function () { return lookupRef.current = {}; };
    return (_jsx(FetchContext.Provider, __assign({ value: {
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
// doesn't throw
export var toLoadedData = function (p) { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = { status: LoadingStatus.Loaded };
                return [4 /*yield*/, p()];
            case 1: return [2 /*return*/, (_a.value = _b.sent(), _a)];
            case 2:
                err_1 = _b.sent();
                return [2 /*return*/, { status: LoadingStatus.Error, value: err_1 }];
            case 3: return [2 /*return*/];
        }
    });
}); };
// default add to start
export var add_elements_to_array = function (a, elements, options) {
    if (a.status !== LoadingStatus.Loaded)
        return { status: LoadingStatus.Loaded, value: elements };
    // original / default behavior
    if (!(options === null || options === void 0 ? void 0 : options.replaceIfMatch)) {
        var newValues_1 = elements.filter(function (e) { return a.value.find(function (v) { return v.id === e.id; }) === undefined; });
        return {
            status: LoadingStatus.Loaded,
            value: (options === null || options === void 0 ? void 0 : options.addTo) === 'end' ? __spreadArray(__spreadArray([], a.value, true), newValues_1, true) : __spreadArray(__spreadArray([], newValues_1, true), a.value, true)
        };
    }
    var newValues = elements.filter(function (e) { return a.value.find(function (v) { return v.id === e.id; }) === undefined; });
    var existingOrUpdatedValues = a.value.map(function (a) { var _a; return (_a = elements.find(function (e) { return e.id === a.id; })) !== null && _a !== void 0 ? _a : a; } // return a match, deferring to the new element, or keep existing when no match
    );
    return {
        status: LoadingStatus.Loaded,
        value: (options === null || options === void 0 ? void 0 : options.addTo) === 'end' ? __spreadArray(__spreadArray([], existingOrUpdatedValues, true), newValues, true) : __spreadArray(__spreadArray([], newValues, true), existingOrUpdatedValues, true)
    };
};
export var update_elements_in_array = function (a, updates) {
    if (a.status !== LoadingStatus.Loaded)
        return a;
    return { status: LoadingStatus.Loaded, value: a.value.map(function (e) { return !!updates[e.id] ? __assign(__assign({}, e), updates[e.id]) : e; }) };
};
export var replace_elements_in_array = function (a, updated) {
    if (a.status !== LoadingStatus.Loaded)
        return a;
    return { status: LoadingStatus.Loaded, value: a.value.map(function (e) { return !!updated[e.id] ? updated[e.id] : e; }) };
};
export var remove_elements_in_array = function (a, ids) {
    if (a.status !== LoadingStatus.Loaded)
        return a;
    return { status: LoadingStatus.Loaded, value: a.value.filter(function (v) { return !ids.includes(v.id); }) };
};
export var createSliceForList = function (name) { return createSlice({
    name: name,
    initialState: UNLOADED,
    reducers: {
        set: function (_, action) { return action.payload.value; },
        setFetching: function (s) { return s.status === LoadingStatus.Unloaded ? { status: LoadingStatus.Fetching, value: undefined } : s; },
        add: function (state, action) { return add_elements_to_array(state, [action.payload.value], action.payload.options); },
        addSome: function (state, action) { return add_elements_to_array(state, action.payload.value, action.payload.options); },
        update: function (state, action) {
            var _a;
            var _b;
            return update_elements_in_array(state, (_a = {},
                _a[action.payload.value.id] = __assign(__assign({}, action.payload.value.updates), { updatedAt: (_b = action.payload.updatedAt) !== null && _b !== void 0 ? _b : new Date().toString() }),
                _a));
        },
        replace: function (state, action) {
            var _a;
            return replace_elements_in_array(state, (_a = {}, _a[action.payload.value.id] = action.payload.value.updated, _a));
        },
        updateSome: function (state, action) { return update_elements_in_array(state, action.payload.value); },
        modifyElements: function (state, action) {
            if (state.status !== LoadingStatus.Loaded)
                return state;
            for (var i = 0; i < state.value.length; i++) {
                var element = state.value[i];
                if (action.payload.value.filter(element)) {
                    state.value[i] = action.payload.value.modifier(element);
                }
            }
            return state;
        },
        remove: function (s, a) { return remove_elements_in_array(s, [a.payload.value.id]); },
        removeSome: function (s, a) { return remove_elements_in_array(s, a.payload.value.ids); },
    },
    extraReducers: function (builder) {
        builder.addCase(resetStateAction, function () {
            return UNLOADED;
        });
    },
}); };
// export type GCalEventTime = { dateTime: string, date: never } | { dateTime: never, date: string /* YYYY-MM-DD */  }
// export type GCalEvent = {
//   id: string,
//   summary: string,
//   start: GCalEventTime,
//   end: GCalEventTime,
// }
var appointmentBookingPagesSlice = createSliceForList('appointment_booking_pages');
var appointmentLocationsSlice = createSliceForList('appointment_locations');
var chatRoomsSlice = createSliceForList('chat_rooms');
var calendarEventsSlice = createSliceForList('calendar_events');
var calendarEventTemplatesSlice = createSliceForList('calendar_event_templates');
var chatsSlice = createSliceForList('chats');
var chatRoomDisplayInfoslice = createSliceForList('chat-room-display-info');
var engagementEventsSlice = createSliceForList('engagement_events');
var emailsSlice = createSliceForList('email');
var smsMessagesSlice = createSliceForList('sms_messages');
var userNotifcationsSlice = createSliceForList('user_notifications');
var endusersSlice = createSliceForList('endusers');
var ticketsSlice = createSliceForList('tickets');
var meetingsSlice = createSliceForList('meetings');
var filesSlice = createSliceForList('files');
var notesSlice = createSliceForList('notes');
var templatesSlice = createSliceForList('templates');
var formsSlice = createSliceForList('forms');
var formsFieldsSlice = createSliceForList('form_fields');
var formResponsesSlice = createSliceForList('form_response');
var journeysSlice = createSliceForList('journeys');
var usersSlice = createSliceForList('users');
var automationStepsSlice = createSliceForList('automations_steps');
var usersDisplaySlice = createSliceForList('users');
var integrationsSlice = createSliceForList('integrations');
var databasesSlice = createSliceForList('databases');
var databaseRecordsSlice = createSliceForList('database_records');
var portalCustomizationsSlice = createSliceForList('portal_customizations');
var carePlansSlice = createSliceForList('care_plans');
var enduserTasksSlice = createSliceForList('enduser_tasks');
var productsSlice = createSliceForList('products');
var purchasesSlice = createSliceForList('purchases');
var purchaseCreditsSlice = createSliceForList('purchase_credits');
var phoneCallsSlice = createSliceForList('phone_calls');
var analyticsFramesSlice = createSliceForList('analytics_frames');
var enduserViewsSlice = createSliceForList('enduser_views');
var backgroundErrorsSlice = createSliceForList('background_errors');
var automationTriggersSlice = createSliceForList('automation_triggers');
var superbillsSlice = createSliceForList('superbills');
var superbillProvidersSlice = createSliceForList('superbill_providers');
var enduserProfileViewsSlice = createSliceForList('enduser_profile_views');
var phoneTreesSlice = createSliceForList('phone_trees');
var tableViewsSlice = createSliceForList('table_views');
var emailSyncDenialsSlice = createSliceForList('email_sync_denials');
var automatedActionsSlice = createSliceForList('automated_actions');
var groupMMSConversationsSlice = createSliceForList('group_mms_conversations');
var blockedPhonesSlice = createSliceForList('blocked_phones');
var prescriptionRoutesSlice = createSliceForList('prescription_routes');
var enduserProblemsSlice = createSliceForList('enduser_problems');
var enduserObservationsSlice = createSliceForList('enduser_observations');
var forumsSlice = createSliceForList('forums');
var forumPostsSlice = createSliceForList('forum_posts');
var managedContentRecoredsSlice = createSliceForList('managed_content_records');
var managedContentRecoredAssignmentsSlice = createSliceForList('managed_content_record_assignments');
var postCommentsSlice = createSliceForList('post_comments');
var postLikesSlice = createSliceForList('post_likes');
var commentLikesSlice = createSliceForList('comment_likes');
var organizationsSlice = createSliceForList('organizations');
var availabilityBlocksSlice = createSliceForList('availability_blocks');
var enduserMedicationsSlice = createSliceForList('enduser_medications');
var enduserCustomTypesSlice = createSliceForList('enduser_custom_types');
var ticketThreadsSlice = createSliceForList('ticket_threads');
var ticketThreadCommentsSlice = createSliceForList('ticket_thread_comments');
var configurationsSlice = createSliceForList('configurations');
var ticketQueuesSlice = createSliceForList('ticket_queues');
var callHoldQueuesSlice = createSliceForList('call_hold_queues');
var enduserOrdersSlice = createSliceForList('enduser_orders');
var enduserEncountersSlice = createSliceForList('enduser_encounters');
var vitalConfigurationsSlice = createSliceForList('vital_configurations');
var flowchartNotesSlice = createSliceForList('flowchart_notes');
var webhookLogsSlice = createSliceForList('webhook_logs');
var formGroupsSlice = createSliceForList('form_groups');
var portalBrandingsSlice = createSliceForList('portal_brandings');
var messageTemplateSnippetsSlice = createSliceForList('message_template_snippets');
var faxLogsSlice = createSliceForList('fax_logs');
var suggestedContactsSlice = createSliceForList('suggested_contacts');
var diagnosisCodesSlice = createSliceForList('diagnosis_codes');
var allergyCodesSlice = createSliceForList('allergy_codes');
var integrationLogsSlice = createSliceForList('integration_logs');
var enduserEligibilityResultsSlice = createSliceForList('enduser_eligibility_results');
var agentRecordsSlice = createSliceForList('agent_records');
var waitlistsSlice = createSliceForList('waitlists');
var roleBasedAccessPermissionsSlice = createSliceForList('role_based_access_permissions');
var calendarEventRSVPsSlice = createSliceForList('calendar_event_rsvps');
var userLogsSlice = createSliceForList('user_logs');
export var sharedConfig = {
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
var _store = configureStore(sharedConfig);
export var useResetState = function () {
    var dispatch = useTellescopeDispatch();
    var resetContext = React.useContext(FetchContext).reset;
    return function () {
        resetContext(); // resets fetch cache context
        dispatch({ type: RESET_CACHE_TYPE }); // resets Redux state
    };
    // _store.dispatch({ type: RESET_CACHE_TYPE })
};
var useTypedSelector = createTellescopeSelector();
var useTellescopeDispatch = createDispatchHook(TellescopeStoreContext);
export var UserProvider = function (props) { return (_jsx(WithFetchContext, { children: _jsx(WithDataSync, { children: _jsx(Provider, __assign({ store: _store, context: TellescopeStoreContext }, { children: props.children })) }) })); };
export var ExtendedUserProvider = function (props) { return (_jsx(WithFetchContext, { children: _jsx(Provider, __assign({ context: TellescopeStoreContext, store: props.store }, { children: props.children })) })); };
export var EnduserProvider = function (props) { return (_jsx(WithFetchContext, { children: _jsx(Provider, __assign({ store: _store, context: TellescopeStoreContext }, { children: props.children })) })); };
export var ExtendedEnduserProvider = function (props) { return (_jsx(WithFetchContext, { children: _jsx(Provider, __assign({ store: props.store, context: TellescopeStoreContext }, { children: props.children })) })); };
export var INACTIVE_SYNC_INTERVAL_IN_MS = 30000;
export var DEFAULT_SYNC_INTERVAL_IN_MS = 15000;
export var MEDIUM_SYNC_INTERAVL = 10000;
export var FAST_SYNC_INTERVAL = 5000;
export var lastActiveForSync = { at: new Date(0), hasFocus: true };
export var lastDataSync = { current: { numResults: 0, at: new Date(0), from: new Date(0), latency: 0, duration: 0 } };
export var useDataSync____internal = function () {
    var session = useSession();
    var lastFetch = React.useRef(new Date());
    var loadTimings = React.useRef({});
    var loaded = React.useRef({});
    var deleted = React.useRef({});
    var handlers = React.useRef({});
    useEffect(function () {
        var _a;
        try {
            // not compatible with React Native
            if (typeof window === 'undefined') {
                return;
            }
            if (((_a = global === null || global === void 0 ? void 0 : global.navigator) === null || _a === void 0 ? void 0 : _a.product) === 'ReactNative') {
                return;
            }
            var onMouseMove_1 = function () { lastActiveForSync.at = new Date(); };
            window.addEventListener('mousemove', onMouseMove_1);
            var onFocus_1 = function () { lastActiveForSync.hasFocus = true; };
            window.addEventListener('focus', onFocus_1);
            var onBlur_1 = function () { lastActiveForSync.hasFocus = false; };
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
    useEffect(function () {
        if (!session.authToken)
            return;
        var i = setInterval(function () {
            var isActive = lastActiveForSync.hasFocus && lastActiveForSync.at.getTime() > (Date.now() - 1000 * 15);
            var pollDurationInMS = Math.min.apply(Math, __spreadArray([isActive ? DEFAULT_SYNC_INTERVAL_IN_MS : INACTIVE_SYNC_INTERVAL_IN_MS], Object.values(loadTimings.current).filter(function (v) { return v > 999; }), false));
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
                lastDataSync.current = {
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
    var getLoaded = useCallback(function (modelName) { return loaded.current[modelName] || []; }, []);
    var getDeleted = useCallback(function (modelName) { return deleted.current[modelName] || []; }, []);
    var popLoaded = useCallback(function (modelName) {
        var toReturn = loaded.current[modelName] || [];
        loaded.current[modelName] = [];
        return toReturn;
    }, []);
    var popDeleted = useCallback(function (modelName) {
        var toReturn = deleted.current[modelName] || [];
        deleted.current[modelName] = [];
        return toReturn;
    }, []);
    var setLoadTiming = useCallback(function (key, loadTimeInMS) {
        loadTimings.current[key] = loadTimeInMS;
    }, []);
    var setHandler = useCallback(function (key, handler) {
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
    var removeHandler = useCallback(function (key, handler) {
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
var SyncContext = React.createContext({});
export var WithDataSync = function (_a) {
    var children = _a.children;
    return (_jsx(SyncContext.Provider, __assign({ value: useDataSync____internal() }, { children: children })));
};
export var useSyncContext = function () { return useContext(SyncContext); };
var DEFAULT_FETCH_LIMIT = 500;
var BULK_READ_DEFAULT_LIMIT = 1000; // 1000 is max
var DONE_LOADING_TOKEN = 'doneLoading';
export var useListStateHook = function (modelName, state, session, slice, apiCalls, options) {
    var _a, _b, _c, _d;
    var _e = (_a = useSyncContext()) !== null && _a !== void 0 ? _a : {}, setHandler = _e.setHandler, popDeleted = _e.popDeleted, popLoaded = _e.popLoaded, removeHandler = _e.removeHandler;
    var loadQuery = apiCalls.loadQuery, findOne = apiCalls.findOne, findByIds = apiCalls.findByIds, addOne = apiCalls.addOne, addSome = apiCalls.addSome, updateOne = apiCalls.updateOne, deleteOne = apiCalls.deleteOne;
    if ((options === null || options === void 0 ? void 0 : options.refetchInMS) !== undefined && options.refetchInMS < 5000) {
        throw new Error("refetchInMS must be greater than 5000");
    }
    var batchRef = useRef({
        fetching: false,
        ids: [],
        nextBatch: [],
    });
    var dispatch = useTellescopeDispatch();
    var _f = useContext(FetchContext), didFetch = _f.didFetch, setFetched = _f.setFetched, getLastId = _f.getLastId, setLastId = _f.setLastId, getLastDate = _f.getLastDate, setLastDate = _f.setLastDate;
    var now = new Date();
    var recentlyCreatedFetch = useRef(getLastDate("".concat(modelName, "-recentlyCreatedFetch")) || now);
    if (now.getTime() === recentlyCreatedFetch.current.getTime()) {
        setLastDate("".concat(modelName, "-recentlyCreatedFetch"), now);
    }
    var addLocalElement = useCallback(function (e, o) {
        var _a;
        dispatch(slice.actions.add({ value: e, options: o }));
        (_a = options === null || options === void 0 ? void 0 : options.onAdd) === null || _a === void 0 ? void 0 : _a.call(options, [e]);
        return e;
    }, [dispatch, options, slice]);
    var addLocalElements = useCallback(function (es, o) {
        var _a;
        dispatch(slice.actions.addSome({ value: es, options: o }));
        (_a = options === null || options === void 0 ? void 0 : options.onAdd) === null || _a === void 0 ? void 0 : _a.call(options, es);
        return es;
    }, [dispatch, options, slice]);
    var createElement = useCallback(function (e, options) { return __awaiter(void 0, void 0, void 0, function () {
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
    var createElements = useCallback(function (es, options) { return __awaiter(void 0, void 0, void 0, function () {
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
    var updateLocalElement = useCallback(function (id, updates) {
        var _a;
        dispatch(slice.actions.update({ value: { id: id, updates: updates } }));
        (_a = options === null || options === void 0 ? void 0 : options.onUpdate) === null || _a === void 0 ? void 0 : _a.call(options, [__assign({ id: id }, updates)]);
    }, [dispatch, options, slice]);
    var updateLocalElements = useCallback(function (updates) {
        var _a;
        dispatch(slice.actions.updateSome({ value: updates }));
        var updated = [];
        for (var id in updates) {
            updated.push(__assign({ id: id }, updates[id]));
        }
        (_a = options === null || options === void 0 ? void 0 : options.onUpdate) === null || _a === void 0 ? void 0 : _a.call(options, updated);
    }, [dispatch, options, slice]);
    var modifyLocalElements = useCallback(function (filter, modifier) {
        dispatch(slice.actions.modifyElements({ value: { filter: filter, modifier: modifier } }));
    }, [dispatch, options, slice]);
    var replaceLocalElement = useCallback(function (id, updated) {
        var _a;
        dispatch(slice.actions.replace({ value: { id: id, updated: updated } }));
        (_a = options === null || options === void 0 ? void 0 : options.onUpdate) === null || _a === void 0 ? void 0 : _a.call(options, [__assign(__assign({}, updated), { id: id })]);
        return updated;
    }, [dispatch, options, slice]);
    var updateElement = useCallback(function (id, e, o) { return __awaiter(void 0, void 0, void 0, function () {
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
    var removeLocalElement = useCallback(function (id) {
        var _a;
        dispatch(slice.actions.remove({ value: { id: id } }));
        (_a = options === null || options === void 0 ? void 0 : options.onDelete) === null || _a === void 0 ? void 0 : _a.call(options, [id]);
    }, [dispatch, options, slice]);
    var removeLocalElements = useCallback(function (ids) {
        var _a;
        dispatch(slice.actions.removeSome({ value: { ids: ids } }));
        (_a = options === null || options === void 0 ? void 0 : options.onDelete) === null || _a === void 0 ? void 0 : _a.call(options, ids);
    }, [dispatch, options, slice]);
    var removeElement = useCallback(function (id) { return __awaiter(void 0, void 0, void 0, function () {
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
    useEffect(function () {
        // context not provided
        if (!setHandler)
            return;
        var handler = function () {
            if (state.status !== LoadingStatus.Loaded)
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
    var findById = useCallback(function (id, options) {
        if (!id)
            return undefined;
        var value = (state.status === LoadingStatus.Loaded
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
                    var existingUnchanged = value_is_loaded(state) && state.value.find(function (v) { return v.id === id && objects_equivalent(v, found); });
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
    useEffect(function () {
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
    var findByFilter = useCallback(function (filter, options) {
        var _a;
        var loadFilter = options === null || options === void 0 ? void 0 : options.loadFilter;
        var queryKey = modelName + JSON.stringify((_a = options === null || options === void 0 ? void 0 : options.loadFilter) !== null && _a !== void 0 ? _a : {});
        var value = (state.status === LoadingStatus.Loaded
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
                var existingUnchanged = value_is_loaded(state) && state.value.find(function (v) { return filter(v) && objects_equivalent(v, found); });
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
    var searchLocalElements = useCallback(function (query) {
        var matches = [];
        if (state.status !== LoadingStatus.Loaded)
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
    var filtered = useCallback(function (filter) {
        if (value_is_loaded(state)) {
            return {
                status: state.status,
                value: state.value.filter(filter)
            };
        }
        return state;
    }, [state]);
    var cantRead = (session.type === 'user' && !((_d = (_c = (_b = session === null || session === void 0 ? void 0 : session.userInfo) === null || _b === void 0 ? void 0 : _b.access) === null || _c === void 0 ? void 0 : _c[modelName]) === null || _d === void 0 ? void 0 : _d.read));
    var load = useCallback(function (force, loadOptions) {
        var _a, _b, _c;
        if (cantRead)
            return;
        var _loadFilter = (_a = loadOptions === null || loadOptions === void 0 ? void 0 : loadOptions.loadFilter) !== null && _a !== void 0 ? _a : options === null || options === void 0 ? void 0 : options.loadFilter;
        var loadFilter = (_loadFilter && object_is_empty(_loadFilter)) ? undefined : _loadFilter;
        var sort = (_b = loadOptions === null || loadOptions === void 0 ? void 0 : loadOptions.sort) !== null && _b !== void 0 ? _b : options === null || options === void 0 ? void 0 : options.sort;
        var sortBy = (_c = loadOptions === null || loadOptions === void 0 ? void 0 : loadOptions.sortBy) !== null && _c !== void 0 ? _c : options === null || options === void 0 ? void 0 : options.sortBy;
        if (!loadQuery)
            return;
        if ((options === null || options === void 0 ? void 0 : options.dontFetch) && !force)
            return;
        var fetchKey = (loadFilter || sort || sortBy) ? JSON.stringify(__assign(__assign({}, loadFilter), { sort: sort, sortBy: sortBy })) + modelName : modelName;
        if (didFetch(fetchKey, force, options === null || options === void 0 ? void 0 : options.refetchInMS))
            return;
        setFetched(fetchKey, true);
        var limit = (options === null || options === void 0 ? void 0 : options.limit) || DEFAULT_FETCH_LIMIT;
        toLoadedData(function () { return loadQuery({ filter: loadFilter, limit: limit, sort: sort, sortBy: sortBy }); }).then(function (es) {
            var _a, _b;
            if (es.status === LoadingStatus.Loaded) {
                if (es.value.length < limit && !loadFilter) {
                    setFetched('id' + modelName + DONE_LOADING_TOKEN, true);
                }
                if (es.value.length) { // don't store oldest record from a filter, may skip some pages
                    setLastId(modelName + (loadFilter ? JSON.stringify(loadFilter) : ''), (_b = (_a = es.value[es.value.length - 1]) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.toString());
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
    var reload = useCallback(function (options) { return load(true, __assign(__assign({}, options), { reloading: true })); }, [load]);
    useEffect(function () {
        load(false);
    }, [load]);
    useEffect(function () {
        var _a;
        if (didFetch(modelName + 'socket'))
            return;
        setFetched(modelName + 'socket', true, false);
        session.handle_events((_a = {},
            // create, update, and delete must go in this order 
            // e.g. to ensure delete events are processed last, so deleted records don't appear as created
            _a["created-".concat(modelName)] = addLocalElements,
            _a["updated-".concat(modelName)] = function (es) {
                var idToUpdates = {};
                for (var _i = 0, es_1 = es; _i < es_1.length; _i++) {
                    var _a = es_1[_i];
                    var id = _a.id, e = __rest(_a, ["id"]);
                    idToUpdates[id] = e;
                }
                updateLocalElements(idToUpdates);
            },
            _a["deleted-".concat(modelName)] = removeLocalElements,
            _a));
        return function () {
            setFetched(modelName + 'socket', false, false);
            session.removeListenersForEvent("created-".concat(modelName));
            session.removeListenersForEvent("updated-".concat(modelName));
            session.removeListenersForEvent("deleted-".concat(modelName));
        };
    }, [session, addLocalElement, updateLocalElements, removeLocalElements, modelName, didFetch]);
    var doneLoading = useCallback(function (key) {
        if (key === void 0) { key = "id"; }
        return (didFetch(key + modelName + DONE_LOADING_TOKEN));
    }, [didFetch, modelName]);
    var loadMore = useCallback(function (loadOptions) { return __awaiter(void 0, void 0, void 0, function () {
        var filter, lastId, key, limit;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            filter = (_a = loadOptions === null || loadOptions === void 0 ? void 0 : loadOptions.filter) !== null && _a !== void 0 ? _a : options === null || options === void 0 ? void 0 : options.loadFilter;
            lastId = getLastId(modelName + (filter ? JSON.stringify(filter) : ""));
            if (!lastId)
                return [2 /*return*/];
            if (!loadQuery)
                return [2 /*return*/];
            if (didFetch(modelName + 'lastId' + lastId))
                return [2 /*return*/];
            setFetched(modelName + 'lastId' + lastId, true);
            key = (_b = loadOptions === null || loadOptions === void 0 ? void 0 : loadOptions.key) !== null && _b !== void 0 ? _b : 'id';
            if (key !== 'id')
                console.warn("Unrecognized key provided");
            limit = (_d = (_c = loadOptions === null || loadOptions === void 0 ? void 0 : loadOptions.limit) !== null && _c !== void 0 ? _c : options === null || options === void 0 ? void 0 : options.limit) !== null && _d !== void 0 ? _d : DEFAULT_FETCH_LIMIT;
            return [2 /*return*/, toLoadedData(function () { return loadQuery({
                    // lastId: !options?.filter ? oldestRecord?.id?.toString() : undefined,  // don't provide a lastId when there's a filter, filter could include that on its own
                    lastId: lastId,
                    limit: limit,
                    filter: filter,
                }); }).then(function (es) {
                    var _a, _b;
                    if (es.status === LoadingStatus.Loaded) {
                        if (es.value.length < limit) {
                            setFetched(key + modelName + DONE_LOADING_TOKEN, true);
                        }
                        var newLastId = (_b = (_a = es.value[es.value.length - 1]) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.toString();
                        if (newLastId) {
                            setLastId(modelName + (filter ? JSON.stringify(filter) : ""), newLastId);
                        }
                        dispatch(slice.actions.addSome({ value: es.value, options: { replaceIfMatch: true, addTo: 'end' } }));
                    }
                    else if (es.status === LoadingStatus.Error) {
                        console.error('error loading more', es.value);
                    }
                })];
        });
    }); }, [getLastId, modelName, loadQuery, didFetch, setFetched]);
    var loadRecentlyCreated = React.useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
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
            recentlyCreatedFetch: recentlyCreatedFetch.current,
        }
    ];
};
export var useChatRoomDisplayInfo = function (roomId, options) {
    var _a;
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    var state = useTypedSelector(function (s) { return s.chatRoomDisplayInfo; });
    var lookup = useListStateHook('chat-room-display-info', state, session, chatRoomDisplayInfoslice, {
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
    return (value_is_loaded(lookup)
        ? [{ status: LoadingStatus.Loaded, value: (_a = lookup.value.find(function (v) { return v.id === roomId; })) !== null && _a !== void 0 ? _a : {} }]
        : [{ status: lookup.status, value: {} }]);
};
export var useUserAndEnduserDisplayInfo = function () {
    var usersLoading = useUsers()[0];
    var endusersLoading = useEndusers()[0];
    var displayInfo = {};
    if (value_is_loaded(usersLoading)) {
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
    if (value_is_loaded(endusersLoading)) {
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
export var useEnduserEligibilityResults = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('enduser_eligibility_results', useTypedSelector(function (s) { return s.enduser_eligibility_results; }), session, enduserEligibilityResultsSlice, {
        loadQuery: session.api.enduser_eligibility_results.getSome,
        findOne: session.api.enduser_eligibility_results.getOne,
        findByIds: session.api.enduser_eligibility_results.getByIds,
        addOne: session.api.enduser_eligibility_results.createOne,
        addSome: session.api.enduser_eligibility_results.createSome,
        deleteOne: session.api.enduser_eligibility_results.deleteOne,
        updateOne: session.api.enduser_eligibility_results.updateOne,
    }, __assign({}, options));
};
export var useAgentRecords = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('agent_records', useTypedSelector(function (s) { return s.agent_records; }), session, agentRecordsSlice, {
        loadQuery: session.api.agent_records.getSome,
        findOne: session.api.agent_records.getOne,
        findByIds: session.api.agent_records.getByIds,
        addOne: session.api.agent_records.createOne,
        addSome: session.api.agent_records.createSome,
        deleteOne: session.api.agent_records.deleteOne,
        updateOne: session.api.agent_records.updateOne,
    }, __assign({}, options));
};
export var useSuggestedContacts = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('suggested_contacts', useTypedSelector(function (s) { return s.suggested_contacts; }), session, suggestedContactsSlice, {
        loadQuery: session.api.suggested_contacts.getSome,
        findOne: session.api.suggested_contacts.getOne,
        findByIds: session.api.suggested_contacts.getByIds,
        addOne: session.api.suggested_contacts.createOne,
        addSome: session.api.suggested_contacts.createSome,
        deleteOne: session.api.suggested_contacts.deleteOne,
        updateOne: session.api.suggested_contacts.updateOne,
    }, __assign({}, options));
};
export var useFaxLogs = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('fax_logs', useTypedSelector(function (s) { return s.fax_logs; }), session, faxLogsSlice, {
        loadQuery: session.api.fax_logs.getSome,
        findOne: session.api.fax_logs.getOne,
        findByIds: session.api.fax_logs.getByIds,
        addOne: session.api.fax_logs.createOne,
        addSome: session.api.fax_logs.createSome,
        deleteOne: session.api.fax_logs.deleteOne,
        updateOne: session.api.fax_logs.updateOne,
    }, __assign({}, options));
};
export var useMessageTemplateSnippets = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('message_template_snippets', useTypedSelector(function (s) { return s.message_template_snippets; }), session, messageTemplateSnippetsSlice, {
        loadQuery: session.api.message_template_snippets.getSome,
        findOne: session.api.message_template_snippets.getOne,
        findByIds: session.api.message_template_snippets.getByIds,
        addOne: session.api.message_template_snippets.createOne,
        addSome: session.api.message_template_snippets.createSome,
        deleteOne: session.api.message_template_snippets.deleteOne,
        updateOne: session.api.message_template_snippets.updateOne,
    }, __assign({}, options));
};
export var usePortalBrandings = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('portal_brandings', useTypedSelector(function (s) { return s.portal_brandings; }), session, portalBrandingsSlice, {
        loadQuery: session.api.portal_brandings.getSome,
        findOne: session.api.portal_brandings.getOne,
        findByIds: session.api.portal_brandings.getByIds,
        addOne: session.api.portal_brandings.createOne,
        addSome: session.api.portal_brandings.createSome,
        deleteOne: session.api.portal_brandings.deleteOne,
        updateOne: session.api.portal_brandings.updateOne,
    }, __assign({}, options));
};
export var useAllergyCodes = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('allergy_codes', useTypedSelector(function (s) { return s.allergy_codes; }), session, allergyCodesSlice, {
        loadQuery: session.api.allergy_codes.getSome,
        findOne: session.api.allergy_codes.getOne,
        findByIds: session.api.allergy_codes.getByIds,
        addOne: session.api.allergy_codes.createOne,
        addSome: session.api.allergy_codes.createSome,
        deleteOne: session.api.allergy_codes.deleteOne,
        updateOne: session.api.allergy_codes.updateOne,
    }, __assign({}, options));
};
export var useDiagnosisCodes = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('diagnosis_codes', useTypedSelector(function (s) { return s.diagnosis_codes; }), session, diagnosisCodesSlice, {
        loadQuery: session.api.diagnosis_codes.getSome,
        findOne: session.api.diagnosis_codes.getOne,
        findByIds: session.api.diagnosis_codes.getByIds,
        addOne: session.api.diagnosis_codes.createOne,
        addSome: session.api.diagnosis_codes.createSome,
        deleteOne: session.api.diagnosis_codes.deleteOne,
        updateOne: session.api.diagnosis_codes.updateOne,
    }, __assign({}, options));
};
export var useEnduserProblems = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('enduser_problems', useTypedSelector(function (s) { return s.enduser_problems; }), session, enduserProblemsSlice, {
        loadQuery: session.api.enduser_problems.getSome,
        findOne: session.api.enduser_problems.getOne,
        findByIds: session.api.enduser_problems.getByIds,
        addOne: session.api.enduser_problems.createOne,
        addSome: session.api.enduser_problems.createSome,
        deleteOne: session.api.enduser_problems.deleteOne,
        updateOne: session.api.enduser_problems.updateOne,
    }, __assign({}, options));
};
export var useEnduserMedications = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('enduser_medications', useTypedSelector(function (s) { return s.enduser_medications; }), session, enduserMedicationsSlice, {
        loadQuery: session.api.enduser_medications.getSome,
        findOne: session.api.enduser_medications.getOne,
        findByIds: session.api.enduser_medications.getByIds,
        addOne: session.api.enduser_medications.createOne,
        addSome: session.api.enduser_medications.createSome,
        deleteOne: session.api.enduser_medications.deleteOne,
        updateOne: session.api.enduser_medications.updateOne,
    }, __assign({}, options));
};
export var useEnduserOrders = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('enduser_orders', useTypedSelector(function (s) { return s.enduser_orders; }), session, enduserOrdersSlice, {
        loadQuery: session.api.enduser_orders.getSome,
        findOne: session.api.enduser_orders.getOne,
        findByIds: session.api.enduser_orders.getByIds,
        addOne: session.api.enduser_orders.createOne,
        addSome: session.api.enduser_orders.createSome,
        deleteOne: session.api.enduser_orders.deleteOne,
        updateOne: session.api.enduser_orders.updateOne,
    }, __assign({}, options));
};
export var useIntegrationLogs = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('integration_logs', useTypedSelector(function (s) { return s.integration_logs; }), session, integrationLogsSlice, {
        loadQuery: session.api.integration_logs.getSome,
        findOne: session.api.integration_logs.getOne,
        findByIds: session.api.integration_logs.getByIds,
        addOne: session.api.integration_logs.createOne,
        addSome: session.api.integration_logs.createSome,
        deleteOne: session.api.integration_logs.deleteOne,
        updateOne: session.api.integration_logs.updateOne,
    }, __assign({}, options));
};
export var useWebhookLogs = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('webhook_logs', useTypedSelector(function (s) { return s.webhook_logs; }), session, webhookLogsSlice, {
        loadQuery: session.api.webhook_logs.getSome,
        findOne: session.api.webhook_logs.getOne,
        findByIds: session.api.webhook_logs.getByIds,
        addOne: session.api.webhook_logs.createOne,
        addSome: session.api.webhook_logs.createSome,
        deleteOne: session.api.webhook_logs.deleteOne,
        updateOne: session.api.webhook_logs.updateOne,
    }, __assign({}, options));
};
export var useFormGroups = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('form_groups', useTypedSelector(function (s) { return s.form_groups; }), session, formGroupsSlice, {
        loadQuery: session.api.form_groups.getSome,
        findOne: session.api.form_groups.getOne,
        findByIds: session.api.form_groups.getByIds,
        addOne: session.api.form_groups.createOne,
        addSome: session.api.form_groups.createSome,
        deleteOne: session.api.form_groups.deleteOne,
        updateOne: session.api.form_groups.updateOne,
    }, __assign({}, options));
};
export var useFlowchartNotes = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('flowchart_notes', useTypedSelector(function (s) { return s.flowchart_notes; }), session, flowchartNotesSlice, {
        loadQuery: session.api.flowchart_notes.getSome,
        findOne: session.api.flowchart_notes.getOne,
        findByIds: session.api.flowchart_notes.getByIds,
        addOne: session.api.flowchart_notes.createOne,
        addSome: session.api.flowchart_notes.createSome,
        deleteOne: session.api.flowchart_notes.deleteOne,
        updateOne: session.api.flowchart_notes.updateOne,
    }, __assign({}, options));
};
export var useEnduserEncounters = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('enduser_encounters', useTypedSelector(function (s) { return s.enduser_encounters; }), session, enduserEncountersSlice, {
        loadQuery: session.api.enduser_encounters.getSome,
        findOne: session.api.enduser_encounters.getOne,
        findByIds: session.api.enduser_encounters.getByIds,
        addOne: session.api.enduser_encounters.createOne,
        addSome: session.api.enduser_encounters.createSome,
        deleteOne: session.api.enduser_encounters.deleteOne,
        updateOne: session.api.enduser_encounters.updateOne,
    }, __assign({}, options));
};
export var useVitalConfigurations = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('vital_configurations', useTypedSelector(function (s) { return s.vital_configurations; }), session, vitalConfigurationsSlice, {
        loadQuery: session.api.vital_configurations.getSome,
        findOne: session.api.vital_configurations.getOne,
        findByIds: session.api.vital_configurations.getByIds,
        addOne: session.api.vital_configurations.createOne,
        addSome: session.api.vital_configurations.createSome,
        deleteOne: session.api.vital_configurations.deleteOne,
        updateOne: session.api.vital_configurations.updateOne,
    }, __assign({}, options));
};
export var useCalendarEvents = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('calendar_events', useTypedSelector(function (s) { return s.calendar_events; }), session, calendarEventsSlice, {
        loadQuery: session.api.calendar_events.getSome,
        findOne: session.api.calendar_events.getOne,
        findByIds: session.api.calendar_events.getByIds,
        addOne: session.api.calendar_events.createOne,
        addSome: session.api.calendar_events.createSome,
        deleteOne: session.api.calendar_events.deleteOne,
        updateOne: session.api.calendar_events.updateOne,
    }, __assign({}, options));
};
export var useEngagementEvents = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('engagement_events', useTypedSelector(function (s) { return s.engagement_events; }), session, engagementEventsSlice, {
        loadQuery: session.api.engagement_events.getSome,
        findOne: session.api.engagement_events.getOne,
        findByIds: session.api.engagement_events.getByIds,
        addOne: session.api.engagement_events.createOne,
        addSome: session.api.engagement_events.createSome,
        deleteOne: session.api.engagement_events.deleteOne,
        updateOne: session.api.engagement_events.updateOne,
    }, __assign({}, options));
};
export var useGroupMMSConversations = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('group_mms_conversations', useTypedSelector(function (s) { return s.group_mms_conversations; }), session, groupMMSConversationsSlice, {
        loadQuery: session.api.group_mms_conversations.getSome,
        findOne: session.api.group_mms_conversations.getOne,
        findByIds: session.api.group_mms_conversations.getByIds,
        addOne: session.api.group_mms_conversations.createOne,
        addSome: session.api.group_mms_conversations.createSome,
        deleteOne: session.api.group_mms_conversations.deleteOne,
        updateOne: session.api.group_mms_conversations.updateOne,
    }, __assign({}, options));
};
export var useEnduserProfileViews = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('enduser_profile_views', useTypedSelector(function (s) { return s.enduser_profile_views; }), session, enduserProfileViewsSlice, {
        loadQuery: session.api.enduser_profile_views.getSome,
        findOne: session.api.enduser_profile_views.getOne,
        findByIds: session.api.enduser_profile_views.getByIds,
        addOne: session.api.enduser_profile_views.createOne,
        addSome: session.api.enduser_profile_views.createSome,
        deleteOne: session.api.enduser_profile_views.deleteOne,
        updateOne: session.api.enduser_profile_views.updateOne,
    }, __assign({}, options));
};
export var useCallHoldQueues = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('call_hold_queues', useTypedSelector(function (s) { return s.call_hold_queues; }), session, callHoldQueuesSlice, {
        loadQuery: session.api.call_hold_queues.getSome,
        findOne: session.api.call_hold_queues.getOne,
        findByIds: session.api.call_hold_queues.getByIds,
        addOne: session.api.call_hold_queues.createOne,
        addSome: session.api.call_hold_queues.createSome,
        deleteOne: session.api.call_hold_queues.deleteOne,
        updateOne: session.api.call_hold_queues.updateOne,
    }, __assign({}, options));
};
export var useTicketQueues = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('ticket_queues', useTypedSelector(function (s) { return s.ticket_queues; }), session, ticketQueuesSlice, {
        loadQuery: session.api.ticket_queues.getSome,
        findOne: session.api.ticket_queues.getOne,
        findByIds: session.api.ticket_queues.getByIds,
        addOne: session.api.ticket_queues.createOne,
        addSome: session.api.ticket_queues.createSome,
        deleteOne: session.api.ticket_queues.deleteOne,
        updateOne: session.api.ticket_queues.updateOne,
    }, __assign({}, options));
};
export var useConfigurations = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('configurations', useTypedSelector(function (s) { return s.configurations; }), session, configurationsSlice, {
        loadQuery: session.api.configurations.getSome,
        findOne: session.api.configurations.getOne,
        findByIds: session.api.configurations.getByIds,
        addOne: session.api.configurations.createOne,
        addSome: session.api.configurations.createSome,
        deleteOne: session.api.configurations.deleteOne,
        updateOne: session.api.configurations.updateOne,
    }, __assign({}, options));
};
export var usePhoneTrees = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('phone_trees', useTypedSelector(function (s) { return s.phone_trees; }), session, phoneTreesSlice, {
        loadQuery: session.api.phone_trees.getSome,
        findOne: session.api.phone_trees.getOne,
        findByIds: session.api.phone_trees.getByIds,
        addOne: session.api.phone_trees.createOne,
        addSome: session.api.phone_trees.createSome,
        deleteOne: session.api.phone_trees.deleteOne,
        updateOne: session.api.phone_trees.updateOne,
    }, __assign({}, options));
};
export var useAutomationTriggers = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('automation_triggers', useTypedSelector(function (s) { return s.automation_triggers; }), session, automationTriggersSlice, {
        loadQuery: session.api.automation_triggers.getSome,
        findOne: session.api.automation_triggers.getOne,
        findByIds: session.api.automation_triggers.getByIds,
        addOne: session.api.automation_triggers.createOne,
        addSome: session.api.automation_triggers.createSome,
        deleteOne: session.api.automation_triggers.deleteOne,
        updateOne: session.api.automation_triggers.updateOne,
    }, __assign({}, options));
};
export var useAutomatedActions = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('automated_actions', useTypedSelector(function (s) { return s.automated_actions; }), session, automatedActionsSlice, {
        loadQuery: session.api.automated_actions.getSome,
        findOne: session.api.automated_actions.getOne,
        findByIds: session.api.automated_actions.getByIds,
        addOne: session.api.automated_actions.createOne,
        addSome: session.api.automated_actions.createSome,
        deleteOne: session.api.automated_actions.deleteOne,
        updateOne: session.api.automated_actions.updateOne,
    }, __assign({}, options));
};
export var useEmails = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession(); // endusers cannot send emails for now
    return useListStateHook('emails', useTypedSelector(function (s) { return s.emails; }), session, emailsSlice, {
        loadQuery: session.api.emails.getSome,
        findOne: session.api.emails.getOne,
        findByIds: session.api.emails.getByIds,
        addOne: session.api.emails.createOne,
        addSome: session.api.emails.createSome,
        deleteOne: session.api.emails.deleteOne,
        updateOne: session.api.emails.updateOne,
    }, __assign({}, options));
};
export var useSmsMessages = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession(); // endusers cannot send sms messages for now
    return useListStateHook('sms_messages', useTypedSelector(function (s) { return s.sms_messages; }), session, smsMessagesSlice, {
        loadQuery: session.api.sms_messages.getSome,
        findOne: session.api.sms_messages.getOne,
        findByIds: session.api.sms_messages.getByIds,
        addOne: session.api.sms_messages.createOne,
        addSome: session.api.sms_messages.createSome,
        deleteOne: session.api.sms_messages.deleteOne,
        updateOne: session.api.sms_messages.updateOne,
    }, __assign({}, options));
};
export var useNotifications = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession(); // endusers do not have notifications
    return useListStateHook('user_notifications', useTypedSelector(function (s) { return s.user_notifications; }), session, userNotifcationsSlice, {
        loadQuery: session.api.user_notifications.getSome,
        findOne: session.api.user_notifications.getOne,
        findByIds: session.api.user_notifications.getByIds,
        addOne: session.api.user_notifications.createOne,
        addSome: session.api.user_notifications.createSome,
        deleteOne: session.api.user_notifications.deleteOne,
        updateOne: session.api.user_notifications.updateOne,
    }, __assign({}, options));
};
export var useUserLogs = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('user_logs', useTypedSelector(function (s) { return s.user_logs; }), session, userLogsSlice, {
        loadQuery: session.api.user_logs.getSome,
        findOne: session.api.user_logs.getOne,
        findByIds: session.api.user_logs.getByIds,
        addOne: session.api.user_logs.createOne,
        addSome: session.api.user_logs.createSome,
        deleteOne: session.api.user_logs.deleteOne,
        updateOne: session.api.user_logs.updateOne,
    }, __assign({}, options));
};
export var useAnalyticsFrames = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('analytics_frames', useTypedSelector(function (s) { return s.analytics_frames; }), session, analyticsFramesSlice, {
        loadQuery: session.api.analytics_frames.getSome,
        findOne: session.api.analytics_frames.getOne,
        findByIds: session.api.analytics_frames.getByIds,
        addOne: session.api.analytics_frames.createOne,
        addSome: session.api.analytics_frames.createSome,
        deleteOne: session.api.analytics_frames.deleteOne,
        updateOne: session.api.analytics_frames.updateOne,
    }, __assign({}, options));
};
export var useEnduserCustomTypes = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('enduser_custom_types', useTypedSelector(function (s) { return s.enduser_custom_types; }), session, enduserCustomTypesSlice, {
        loadQuery: session.api.enduser_custom_types.getSome,
        findOne: session.api.enduser_custom_types.getOne,
        findByIds: session.api.enduser_custom_types.getByIds,
        addOne: session.api.enduser_custom_types.createOne,
        addSome: session.api.enduser_custom_types.createSome,
        deleteOne: session.api.enduser_custom_types.deleteOne,
        updateOne: session.api.enduser_custom_types.updateOne,
    }, __assign({}, options));
};
export var useChatRooms = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
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
    return useListStateHook('chat_rooms', rooms, session, chatRoomsSlice, {
        loadQuery: session.api.chat_rooms.getSome,
        findOne: session.api.chat_rooms.getOne,
        findByIds: session.api.chat_rooms.getByIds,
        addOne: session.api.chat_rooms.createOne,
        addSome: session.api.chat_rooms.createSome,
        deleteOne: session.api.chat_rooms.deleteOne,
        updateOne: session.api.chat_rooms.updateOne,
    }, __assign({}, options));
};
export var useChats = function (roomId, options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    var state = useTypedSelector(function (s) { return s.chats; });
    var _a = useChatRooms(), _ = _a[0], updateLocalChatRoom = _a[1].updateLocalElement;
    // don't rely on socket update for new messages
    var onAdd = useCallback(function (ms) {
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
    var toReturn = useListStateHook('chats', state, session, chatsSlice, {
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
export var useEndusers = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('endusers', useTypedSelector(function (s) { return s.endusers; }), session, endusersSlice, {
        loadQuery: session.api.endusers.getSome,
        findOne: session.api.endusers.getOne,
        findByIds: session.api.endusers.getByIds,
        addOne: session.api.endusers.createOne,
        addSome: session.api.endusers.createSome,
        deleteOne: session.api.endusers.deleteOne,
        updateOne: session.api.endusers.updateOne,
    }, __assign({}, options));
};
export var useTickets = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('tickets', useTypedSelector(function (s) { return s.tickets; }), session, ticketsSlice, {
        loadQuery: session.api.tickets.getSome,
        findOne: session.api.tickets.getOne,
        findByIds: session.api.tickets.getByIds,
        addOne: session.api.tickets.createOne,
        addSome: session.api.tickets.createSome,
        deleteOne: session.api.tickets.deleteOne,
        updateOne: session.api.tickets.updateOne,
    }, __assign({}, options));
};
export var useMeetings = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('meetings', useTypedSelector(function (s) { return s.meetings; }), session, meetingsSlice, {
        loadQuery: session.api.meetings.my_meetings,
        findOne: session.api.meetings.getOne,
        findByIds: session.api.meetings.getByIds,
        addOne: session.api.meetings.createOne,
        addSome: session.api.meetings.createSome,
        deleteOne: session.api.meetings.deleteOne,
        updateOne: session.api.meetings.updateOne,
    }, __assign({}, options));
};
export var useFiles = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('files', useTypedSelector(function (s) { return s.files; }), session, filesSlice, {
        loadQuery: session.api.files.getSome,
        findOne: session.api.files.getOne,
        findByIds: session.api.files.getByIds,
        deleteOne: session.api.files.deleteOne,
        updateOne: session.api.files.updateOne,
    }, __assign({}, options));
};
export var useJourneys = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('journeys', useTypedSelector(function (s) { return s.journeys; }), session, journeysSlice, {
        loadQuery: session.api.journeys.getSome,
        findOne: session.api.journeys.getOne,
        findByIds: session.api.journeys.getByIds,
        addOne: session.api.journeys.createOne,
        addSome: session.api.journeys.createSome,
        deleteOne: session.api.journeys.deleteOne,
        updateOne: session.api.journeys.updateOne,
    }, __assign({}, options));
};
export var useUsers = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('users', useTypedSelector(function (s) { return s.users; }), session, usersSlice, {
        loadQuery: session.api.users.getSome,
        findOne: session.api.users.getOne,
        findByIds: session.api.users.getByIds,
        addOne: session.api.users.createOne,
        addSome: session.api.users.createSome,
        deleteOne: session.api.users.deleteOne,
        updateOne: session.api.users.updateOne,
    }, __assign({}, options));
};
export var useAutomationSteps = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('automation_steps', useTypedSelector(function (s) { return s.automation_steps; }), session, automationStepsSlice, {
        loadQuery: session.api.automation_steps.getSome,
        findOne: session.api.automation_steps.getOne,
        findByIds: session.api.automation_steps.getByIds,
        addOne: session.api.automation_steps.createOne,
        addSome: session.api.automation_steps.createSome,
        deleteOne: session.api.automation_steps.deleteOne,
        updateOne: session.api.automation_steps.updateOne,
    }, __assign({}, options));
};
export var useNotes = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('notes', useTypedSelector(function (s) { return s.notes; }), session, notesSlice, {
        loadQuery: session.api.notes.getSome,
        findOne: session.api.notes.getOne,
        findByIds: session.api.notes.getByIds,
        addOne: session.api.notes.createOne,
        addSome: session.api.notes.createSome,
        deleteOne: session.api.notes.deleteOne,
        updateOne: session.api.notes.updateOne,
    }, __assign({}, options));
};
export var useAvailabilityBlocks = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('availability_blocks', useTypedSelector(function (s) { return s.availability_blocks; }), session, availabilityBlocksSlice, {
        loadQuery: session.api.availability_blocks.getSome,
        findOne: session.api.availability_blocks.getOne,
        findByIds: session.api.availability_blocks.getByIds,
        addOne: session.api.availability_blocks.createOne,
        addSome: session.api.availability_blocks.createSome,
        deleteOne: session.api.availability_blocks.deleteOne,
        updateOne: session.api.availability_blocks.updateOne,
    }, __assign({}, options));
};
export var useTemplates = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('templates', useTypedSelector(function (s) { return s.templates; }), session, templatesSlice, {
        loadQuery: session.api.templates.getSome,
        findOne: session.api.templates.getOne,
        findByIds: session.api.templates.getByIds,
        addOne: session.api.templates.createOne,
        addSome: session.api.templates.createSome,
        deleteOne: session.api.templates.deleteOne,
        updateOne: session.api.templates.updateOne,
    }, __assign({}, options));
};
export var useForms = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('forms', useTypedSelector(function (s) { return s.forms; }), session, formsSlice, {
        loadQuery: session.api.forms.getSome,
        findOne: session.api.forms.getOne,
        findByIds: session.api.forms.getByIds,
        addOne: session.api.forms.createOne,
        addSome: session.api.forms.createSome,
        deleteOne: session.api.forms.deleteOne,
        updateOne: session.api.forms.updateOne,
    }, __assign({}, options));
};
export var useFormFields = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('form_fields', useTypedSelector(function (s) { return s.form_fields; }), session, formsFieldsSlice, {
        loadQuery: session.api.form_fields.getSome,
        findOne: session.api.form_fields.getOne,
        findByIds: session.api.form_fields.getByIds,
        addOne: session.api.form_fields.createOne,
        addSome: session.api.form_fields.createSome,
        deleteOne: session.api.form_fields.deleteOne,
        updateOne: session.api.form_fields.updateOne,
    }, __assign({}, options));
};
export var useFormResponses = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('form_responses', useTypedSelector(function (s) { return s.form_responses; }), session, formResponsesSlice, {
        loadQuery: session.api.form_responses.getSome,
        findOne: session.api.form_responses.getOne,
        findByIds: session.api.form_responses.getByIds,
        addOne: session.api.form_responses.createOne,
        addSome: session.api.form_responses.createSome,
        deleteOne: session.api.form_responses.deleteOne,
        updateOne: session.api.form_responses.updateOne,
    }, __assign({}, options));
};
/** @deprecated */
export var useUserDisplayInfo = function (options) {
    if (options === void 0) { options = {}; }
    var session = useEnduserSession();
    var state = useTypedSelector(function (s) { return s.users_display; });
    return useListStateHook('users', state, session, usersDisplaySlice, {
        loadQuery: session.api.users.display_info,
    }, __assign({}, options));
};
export var useEnduserObservations = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('enduser_observations', useTypedSelector(function (s) { return s.enduser_observations; }), session, enduserObservationsSlice, {
        loadQuery: session.api.enduser_observations.getSome,
        findOne: session.api.enduser_observations.getOne,
        findByIds: session.api.enduser_observations.getByIds,
        addOne: session.api.enduser_observations.createOne,
        addSome: session.api.enduser_observations.createSome,
        deleteOne: session.api.enduser_observations.deleteOne,
        updateOne: session.api.enduser_observations.updateOne,
    }, __assign({}, options));
};
export var useManagedContentRecords = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('managed_content_records', useTypedSelector(function (s) { return s.managed_content_records; }), session, managedContentRecoredsSlice, {
        loadQuery: session.api.managed_content_records.getSome,
        findOne: session.api.managed_content_records.getOne,
        findByIds: session.api.managed_content_records.getByIds,
        addOne: session.api.managed_content_records.createOne,
        addSome: session.api.managed_content_records.createSome,
        deleteOne: session.api.managed_content_records.deleteOne,
        updateOne: session.api.managed_content_records.updateOne,
    }, __assign({}, options));
};
export var useManagedContentRecordAssignments = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('managed_content_record_assignments', useTypedSelector(function (s) { return s.managed_content_record_assignments; }), session, managedContentRecoredAssignmentsSlice, {
        loadQuery: session.api.managed_content_record_assignments.getSome,
        findOne: session.api.managed_content_record_assignments.getOne,
        findByIds: session.api.managed_content_record_assignments.getByIds,
        addOne: session.api.managed_content_record_assignments.createOne,
        addSome: session.api.managed_content_record_assignments.createSome,
        deleteOne: session.api.managed_content_record_assignments.deleteOne,
        updateOne: session.api.managed_content_record_assignments.updateOne,
    }, __assign({}, options));
};
export var useAssignedManagedContentRecords = function () {
    var session = useEnduserSession();
    var _a = useManagedContentRecords(), filtered = _a[1].filtered;
    var eventsLoading = useCalendarEvents()[0];
    var assignmentsLoading = useManagedContentRecordAssignments()[0];
    if (!value_is_loaded(assignmentsLoading))
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
            || (value_is_loaded(eventsLoading)
                && !!eventsLoading.value.find(function (e) { var _a; return (_a = e.sharedContentIds) === null || _a === void 0 ? void 0 : _a.includes(r.id); }));
    });
    return recordsLoading;
};
export var useForums = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('forums', useTypedSelector(function (s) { return s.forums; }), session, forumsSlice, {
        loadQuery: session.api.forums.getSome,
        findOne: session.api.forums.getOne,
        findByIds: session.api.forums.getByIds,
        addOne: session.api.forums.createOne,
        addSome: session.api.forums.createSome,
        deleteOne: session.api.forums.deleteOne,
        updateOne: session.api.forums.updateOne,
    }, __assign({}, options));
};
export var useForumPosts = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('forum_posts', useTypedSelector(function (s) { return s.forum_posts; }), session, forumPostsSlice, {
        loadQuery: session.api.forum_posts.getSome,
        findOne: session.api.forum_posts.getOne,
        findByIds: session.api.forum_posts.getByIds,
        addOne: session.api.forum_posts.createOne,
        addSome: session.api.forum_posts.createSome,
        deleteOne: session.api.forum_posts.deleteOne,
        updateOne: session.api.forum_posts.updateOne,
    }, __assign({}, options));
};
export var usePostComments = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('post_comments', useTypedSelector(function (s) { return s.post_comments; }), session, postCommentsSlice, {
        loadQuery: session.api.post_comments.getSome,
        findOne: session.api.post_comments.getOne,
        findByIds: session.api.post_comments.getByIds,
        addOne: session.api.post_comments.createOne,
        addSome: session.api.post_comments.createSome,
        deleteOne: session.api.post_comments.deleteOne,
        updateOne: session.api.post_comments.updateOne,
    }, __assign({}, options));
};
export var usePostLikes = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('post_likes', useTypedSelector(function (s) { return s.post_likes; }), session, postLikesSlice, {
        loadQuery: session.api.post_likes.getSome,
        findOne: session.api.post_likes.getOne,
        findByIds: session.api.post_likes.getByIds,
        addOne: session.api.post_likes.createOne,
        addSome: session.api.post_likes.createSome,
        deleteOne: session.api.post_likes.deleteOne,
        updateOne: session.api.post_likes.updateOne,
    }, __assign({}, options));
};
export var useCommentLikes = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('comment_likes', useTypedSelector(function (s) { return s.comment_likes; }), session, commentLikesSlice, {
        loadQuery: session.api.comment_likes.getSome,
        findOne: session.api.comment_likes.getOne,
        findByIds: session.api.comment_likes.getByIds,
        addOne: session.api.comment_likes.createOne,
        addSome: session.api.comment_likes.createSome,
        deleteOne: session.api.comment_likes.deleteOne,
        updateOne: session.api.comment_likes.updateOne,
    }, __assign({}, options));
};
export var useCalendarEventRSVPs = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('calendar_event_RSVPs', useTypedSelector(function (s) { return s.calendar_event_RSVPs; }), session, calendarEventRSVPsSlice, {
        loadQuery: session.api.calendar_event_RSVPs.getSome,
        findOne: session.api.calendar_event_RSVPs.getOne,
        findByIds: session.api.calendar_event_RSVPs.getByIds,
        addOne: session.api.calendar_event_RSVPs.createOne,
        addSome: session.api.calendar_event_RSVPs.createSome,
        deleteOne: session.api.calendar_event_RSVPs.deleteOne,
        updateOne: session.api.calendar_event_RSVPs.updateOne,
    }, __assign({}, options));
};
export var useRoleBasedAccessPermissions = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('role_based_access_permissions', useTypedSelector(function (s) { return s.role_based_access_permissions; }), session, roleBasedAccessPermissionsSlice, {
        loadQuery: session.api.role_based_access_permissions.getSome,
        findOne: session.api.role_based_access_permissions.getOne,
        findByIds: session.api.role_based_access_permissions.getByIds,
        addOne: session.api.role_based_access_permissions.createOne,
        addSome: session.api.role_based_access_permissions.createSome,
        deleteOne: session.api.role_based_access_permissions.deleteOne,
        updateOne: session.api.role_based_access_permissions.updateOne,
    }, __assign({}, options));
};
export var useTicketThreads = function (options) {
    var _a;
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('ticket_threads', useTypedSelector(function (s) { return s.ticket_threads; }), session, ticketThreadsSlice, {
        loadQuery: session.api.ticket_threads.getSome,
        findOne: session.api.ticket_threads.getOne,
        findByIds: session.api.ticket_threads.getByIds,
        addOne: session.api.ticket_threads.createOne,
        addSome: session.api.ticket_threads.createSome,
        deleteOne: session.api.ticket_threads.deleteOne,
        updateOne: session.api.ticket_threads.updateOne,
    }, __assign(__assign({}, options), { dontFetch: (_a = options.dontFetch) !== null && _a !== void 0 ? _a : !session.userInfo.ticketThreadsEnabled }));
};
export var useTicketThreadComments = function (options) {
    var _a;
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('ticket_thread_comments', useTypedSelector(function (s) { return s.ticket_thread_comments; }), session, ticketThreadCommentsSlice, {
        loadQuery: session.api.ticket_thread_comments.getSome,
        findOne: session.api.ticket_thread_comments.getOne,
        findByIds: session.api.ticket_thread_comments.getByIds,
        addOne: session.api.ticket_thread_comments.createOne,
        addSome: session.api.ticket_thread_comments.createSome,
        deleteOne: session.api.ticket_thread_comments.deleteOne,
        updateOne: session.api.ticket_thread_comments.updateOne,
    }, __assign(__assign({}, options), { dontFetch: (_a = options.dontFetch) !== null && _a !== void 0 ? _a : !session.userInfo.ticketThreadsEnabled }));
};
export var useSuperbills = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('superbills', useTypedSelector(function (s) { return s.superbills; }), session, superbillsSlice, {
        loadQuery: session.api.superbills.getSome,
        findOne: session.api.superbills.getOne,
        findByIds: session.api.superbills.getByIds,
        addOne: session.api.superbills.createOne,
        addSome: session.api.superbills.createSome,
        deleteOne: session.api.superbills.deleteOne,
        updateOne: session.api.superbills.updateOne,
    }, __assign({}, options));
};
export var useSuperbillProviders = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('superbill_providers', useTypedSelector(function (s) { return s.superbill_providers; }), session, superbillProvidersSlice, {
        loadQuery: session.api.superbill_providers.getSome,
        findOne: session.api.superbill_providers.getOne,
        findByIds: session.api.superbill_providers.getByIds,
        addOne: session.api.superbill_providers.createOne,
        addSome: session.api.superbill_providers.createSome,
        deleteOne: session.api.superbill_providers.deleteOne,
        updateOne: session.api.superbill_providers.updateOne,
    }, __assign({}, options));
};
export var useTableViews = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('table_views', useTypedSelector(function (s) { return s.table_views; }), session, tableViewsSlice, {
        loadQuery: session.api.table_views.getSome,
        findOne: session.api.table_views.getOne,
        findByIds: session.api.table_views.getByIds,
        addOne: session.api.table_views.createOne,
        addSome: session.api.table_views.createSome,
        deleteOne: session.api.table_views.deleteOne,
        updateOne: session.api.table_views.updateOne,
    }, __assign({}, options));
};
export var useEmailSyncDenials = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('email_sync_denials', useTypedSelector(function (s) { return s.email_sync_denials; }), session, emailSyncDenialsSlice, {
        loadQuery: session.api.email_sync_denials.getSome,
        findOne: session.api.email_sync_denials.getOne,
        findByIds: session.api.email_sync_denials.getByIds,
        addOne: session.api.email_sync_denials.createOne,
        addSome: session.api.email_sync_denials.createSome,
        deleteOne: session.api.email_sync_denials.deleteOne,
        updateOne: session.api.email_sync_denials.updateOne,
    }, __assign({}, options));
};
export var usePhoneCalls = function (options) {
    var _a;
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('phone_calls', useTypedSelector(function (s) { return s.phone_calls; }), session, phoneCallsSlice, {
        loadQuery: session.api.phone_calls.getSome,
        findOne: session.api.phone_calls.getOne,
        findByIds: session.api.phone_calls.getByIds,
        addOne: session.api.phone_calls.createOne,
        addSome: session.api.phone_calls.createSome,
        deleteOne: session.api.phone_calls.deleteOne,
        updateOne: session.api.phone_calls.updateOne,
    }, __assign(__assign({}, options), { dontFetch: (_a = options.dontFetch) !== null && _a !== void 0 ? _a : !(session.userInfo.orgTwilioNumber || session.userInfo.twilioNumber) }));
};
export var useOrganizations = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('organizations', useTypedSelector(function (s) { return s.organizations; }), session, organizationsSlice, {
        loadQuery: session.api.organizations.getSome,
        findOne: session.api.organizations.getOne,
        findByIds: session.api.organizations.getByIds,
        // addOne: session.api.organizations.createOne,
        // addSome: session.api.organizations.createSome,
        deleteOne: session.api.organizations.deleteOne,
        updateOne: session.api.organizations.updateOne,
    }, __assign({}, options));
};
export var useOrganization = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    var _a = useOrganizations(options), organizationsLoading = _a[0], actions = _a[1];
    return [
        {
            status: organizationsLoading.status,
            value: (value_is_loaded(organizationsLoading)
                ? organizationsLoading.value.find(function (o) { return matches_organization(session.userInfo, o); })
                : undefined)
        },
        actions,
    ];
};
export var useIntegrations = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('integrations', useTypedSelector(function (s) { return s.integrations; }), session, integrationsSlice, {
        loadQuery: session.api.integrations.getSome,
        findOne: session.api.integrations.getOne,
        findByIds: session.api.integrations.getByIds,
        addOne: session.api.integrations.createOne,
        addSome: session.api.integrations.createSome,
        deleteOne: session.api.integrations.deleteOne,
        updateOne: session.api.integrations.updateOne,
    }, __assign({}, options));
};
export var usePortalCustomizations = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('portal_customizations', useTypedSelector(function (s) { return s.portal_customizations; }), session, portalCustomizationsSlice, {
        loadQuery: session.api.portal_customizations.getSome,
        findOne: session.api.portal_customizations.getOne,
        findByIds: session.api.portal_customizations.getByIds,
        addOne: session.api.portal_customizations.createOne,
        addSome: session.api.portal_customizations.createSome,
        deleteOne: session.api.portal_customizations.deleteOne,
        updateOne: session.api.portal_customizations.updateOne,
    }, __assign({}, options));
};
export var useCarePlans = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('care_plans', useTypedSelector(function (s) { return s.care_plans; }), session, carePlansSlice, {
        loadQuery: session.api.care_plans.getSome,
        findOne: session.api.care_plans.getOne,
        findByIds: session.api.care_plans.getByIds,
        addOne: session.api.care_plans.createOne,
        addSome: session.api.care_plans.createSome,
        deleteOne: session.api.care_plans.deleteOne,
        updateOne: session.api.care_plans.updateOne,
    }, __assign({}, options));
};
export var useEnduserTasks = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('enduser_tasks', useTypedSelector(function (s) { return s.enduser_tasks; }), session, enduserTasksSlice, {
        loadQuery: session.api.enduser_tasks.getSome,
        findOne: session.api.enduser_tasks.getOne,
        findByIds: session.api.enduser_tasks.getByIds,
        addOne: session.api.enduser_tasks.createOne,
        addSome: session.api.enduser_tasks.createSome,
        deleteOne: session.api.enduser_tasks.deleteOne,
        updateOne: session.api.enduser_tasks.updateOne,
    }, __assign({}, options));
};
export var useCalendarEventTemplates = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('calendar_event_templates', useTypedSelector(function (s) { return s.calendar_event_templates; }), session, calendarEventTemplatesSlice, {
        loadQuery: session.api.calendar_event_templates.getSome,
        findOne: session.api.calendar_event_templates.getOne,
        findByIds: session.api.calendar_event_templates.getByIds,
        addOne: session.api.calendar_event_templates.createOne,
        addSome: session.api.calendar_event_templates.createSome,
        deleteOne: session.api.calendar_event_templates.deleteOne,
        updateOne: session.api.calendar_event_templates.updateOne,
    }, __assign({}, options));
};
export var useAppointmentBookingPages = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession(); // enduser should be able to load for self-scheduling
    return useListStateHook('appointment_booking_pages', useTypedSelector(function (s) { return s.appointment_booking_pages; }), session, appointmentBookingPagesSlice, {
        loadQuery: session.api.appointment_booking_pages.getSome,
        findOne: session.api.appointment_booking_pages.getOne,
        findByIds: session.api.appointment_booking_pages.getByIds,
        addOne: session.api.appointment_booking_pages.createOne,
        addSome: session.api.appointment_booking_pages.createSome,
        deleteOne: session.api.appointment_booking_pages.deleteOne,
        updateOne: session.api.appointment_booking_pages.updateOne,
    }, __assign({}, options));
};
export var useEnduserViews = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('enduser_views', useTypedSelector(function (s) { return s.enduser_views; }), session, enduserViewsSlice, {
        loadQuery: session.api.enduser_views.getSome,
        findOne: session.api.enduser_views.getOne,
        findByIds: session.api.enduser_views.getByIds,
        addOne: session.api.enduser_views.createOne,
        addSome: session.api.enduser_views.createSome,
        deleteOne: session.api.enduser_views.deleteOne,
        updateOne: session.api.enduser_views.updateOne,
    }, __assign({}, options));
};
export var useBackgroundErrors = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('background_errors', useTypedSelector(function (s) { return s.background_errors; }), session, backgroundErrorsSlice, {
        loadQuery: session.api.background_errors.getSome,
        findOne: session.api.background_errors.getOne,
        findByIds: session.api.background_errors.getByIds,
        addOne: session.api.background_errors.createOne,
        addSome: session.api.background_errors.createSome,
        deleteOne: session.api.background_errors.deleteOne,
        updateOne: session.api.background_errors.updateOne,
    }, __assign({}, options));
};
export var useAppointmentLocations = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('appointment_locations', useTypedSelector(function (s) { return s.appointment_locations; }), session, appointmentLocationsSlice, {
        loadQuery: session.api.appointment_locations.getSome,
        findOne: session.api.appointment_locations.getOne,
        findByIds: session.api.appointment_locations.getByIds,
        addOne: session.api.appointment_locations.createOne,
        addSome: session.api.appointment_locations.createSome,
        deleteOne: session.api.appointment_locations.deleteOne,
        updateOne: session.api.appointment_locations.updateOne,
    }, __assign({}, options));
};
export var useDatabases = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('databases', useTypedSelector(function (s) { return s.databases; }), session, databasesSlice, {
        loadQuery: session.api.databases.getSome,
        findOne: session.api.databases.getOne,
        findByIds: session.api.databases.getByIds,
        addOne: session.api.databases.createOne,
        addSome: session.api.databases.createSome,
        deleteOne: session.api.databases.deleteOne,
        updateOne: session.api.databases.updateOne,
    }, __assign({}, options));
};
export var useDatabaseRecords = function (options) {
    var _a;
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('database_records', useTypedSelector(function (s) { return s.database_records; }), session, databaseRecordsSlice, {
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
export var useProducts = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('products', useTypedSelector(function (s) { return s.products; }), session, productsSlice, {
        loadQuery: session.api.products.getSome,
        findOne: session.api.products.getOne,
        findByIds: session.api.products.getByIds,
        addOne: session.api.products.createOne,
        addSome: session.api.products.createSome,
        deleteOne: session.api.products.deleteOne,
        updateOne: session.api.products.updateOne,
    }, __assign({}, options));
};
export var usePurchases = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('purchases', useTypedSelector(function (s) { return s.purchases; }), session, purchasesSlice, {
        loadQuery: session.api.purchases.getSome,
        findOne: session.api.purchases.getOne,
        findByIds: session.api.purchases.getByIds,
        addOne: session.api.purchases.createOne,
        addSome: session.api.purchases.createSome,
        deleteOne: session.api.purchases.deleteOne,
        updateOne: session.api.purchases.updateOne,
    }, __assign({}, options));
};
export var usePurchaseCredits = function (options) {
    if (options === void 0) { options = {}; }
    var session = useResolvedSession();
    return useListStateHook('purchase_credits', useTypedSelector(function (s) { return s.purchase_credits; }), session, purchaseCreditsSlice, {
        loadQuery: session.api.purchase_credits.getSome,
        findOne: session.api.purchase_credits.getOne,
        findByIds: session.api.purchase_credits.getByIds,
        addOne: session.api.purchase_credits.createOne,
        addSome: session.api.purchase_credits.createSome,
        deleteOne: session.api.purchase_credits.deleteOne,
        updateOne: session.api.purchase_credits.updateOne,
    }, __assign({}, options));
};
export var useBlockedPhones = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('blocked_phones', useTypedSelector(function (s) { return s.blocked_phones; }), session, blockedPhonesSlice, {
        loadQuery: session.api.blocked_phones.getSome,
        findOne: session.api.blocked_phones.getOne,
        findByIds: session.api.blocked_phones.getByIds,
        addOne: session.api.blocked_phones.createOne,
        addSome: session.api.blocked_phones.createSome,
        deleteOne: session.api.blocked_phones.deleteOne,
        updateOne: session.api.blocked_phones.updateOne,
    }, __assign({}, options));
};
export var usePrescriptionRoutes = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('prescription_routes', useTypedSelector(function (s) { return s.prescription_routes; }), session, prescriptionRoutesSlice, {
        loadQuery: session.api.prescription_routes.getSome,
        findOne: session.api.prescription_routes.getOne,
        findByIds: session.api.prescription_routes.getByIds,
        addOne: session.api.prescription_routes.createOne,
        addSome: session.api.prescription_routes.createSome,
        deleteOne: session.api.prescription_routes.deleteOne,
        updateOne: session.api.prescription_routes.updateOne,
    }, __assign({}, options));
};
export var useCalendarEventsForUser = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    var loadedRef = useRef({});
    var fetchEvents = React.useCallback(function (calledOptions) { return __awaiter(void 0, void 0, void 0, function () {
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
    var _a = useCalendarEvents(), eventsLoading = _a[0], _b = _a[1], addLocalElements = _b.addLocalElements, filtered = _b.filtered;
    var loadEvents = useCallback(function (options) {
        var key = JSON.stringify(options !== null && options !== void 0 ? options : {});
        if (loadedRef.current[key])
            return;
        loadedRef.current[key] = Date.now();
        fetchEvents(options)
            .then(function (es) { return addLocalElements(es, { replaceIfMatch: true }); })
            .catch(console.error);
    }, [session, loadedRef, fetchEvents, addLocalElements]);
    return [eventsLoading, { loadEvents: loadEvents, filtered: filtered }];
};
export var useWaitlists = function (options) {
    if (options === void 0) { options = {}; }
    var session = useSession();
    return useListStateHook('waitlists', useTypedSelector(function (s) { return s.waitlists; }), session, waitlistsSlice, {
        loadQuery: session.api.waitlists.getSome,
        findOne: session.api.waitlists.getOne,
        findByIds: session.api.waitlists.getByIds,
        addOne: session.api.waitlists.createOne,
        addSome: session.api.waitlists.createSome,
        deleteOne: session.api.waitlists.deleteOne,
        updateOne: session.api.waitlists.updateOne,
    }, __assign({}, options));
};
//# sourceMappingURL=state.js.map