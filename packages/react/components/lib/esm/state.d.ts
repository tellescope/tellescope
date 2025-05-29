import React from 'react';
import { ReactReduxContextValue } from 'react-redux';
import { Action, EnhancedStore, PayloadAction, Slice } from '@reduxjs/toolkit';
import { APIError, Indexable, LoadingStatus, LoadedData, CustomUpdateOptions, SortOption } from "@tellescope/types-utilities";
import { UserDisplayInfo } from "@tellescope/types-client";
import { LoadFunction, Session, EnduserSession } from '@tellescope/sdk';
import { ReadFilter, SortBy } from '@tellescope/types-models';
export declare const resetStateAction: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"cache/reset">;
export declare const TellescopeStoreContext: React.Context<ReactReduxContextValue<import("@reduxjs/toolkit").ThunkDispatch<{
    agent_records: LoadedData<(import("@tellescope/types-models").AgentRecord & {
        id: string;
        createdAt: Date;
    })[]>;
    enduser_eligibility_results: LoadedData<(import("@tellescope/types-models").EnduserEligibilityResult & {
        id: string;
        createdAt: Date;
    })[]>;
    integration_logs: LoadedData<(import("@tellescope/types-models").IntegrationLog & {
        id: string;
        createdAt: Date;
    })[]>;
    ticket_queues: LoadedData<(import("@tellescope/types-models").TicketQueue & {
        id: string;
        createdAt: Date;
    })[]>;
    automation_triggers: LoadedData<(import("@tellescope/types-models").AutomationTrigger & {
        id: string;
        createdAt: Date;
    })[]>;
    automated_actions: LoadedData<(import("@tellescope/types-models").AutomatedAction & {
        id: string;
        createdAt: Date;
    })[]>;
    enduser_views: LoadedData<(import("@tellescope/types-models").EnduserView & {
        id: string;
        createdAt: Date;
    })[]>;
    background_errors: LoadedData<(import("@tellescope/types-models").BackgroundError & {
        id: string;
        createdAt: Date;
    })[]>;
    availability_blocks: LoadedData<(import("@tellescope/types-models").AvailabilityBlock & {
        id: string;
        createdAt: Date;
    })[]>;
    chat_rooms: LoadedData<(import("@tellescope/types-models").ChatRoom & {
        id: string;
        createdAt: Date;
    })[]>;
    chats: LoadedData<(import("@tellescope/types-models").ChatMessage & {
        id: string;
        createdAt: Date;
    })[]>;
    chatRoomDisplayInfo: LoadedData<ChatRoomDisplayInfo[]>;
    calendar_events: LoadedData<(import("@tellescope/types-models").CalendarEvent & {
        id: string;
        createdAt: Date;
    })[]>;
    calendar_event_templates: LoadedData<(import("@tellescope/types-models").CalendarEventTemplate & {
        id: string;
        createdAt: Date;
    })[]>;
    configurations: LoadedData<(import("@tellescope/types-models").Configuration & {
        id: string;
        createdAt: Date;
    })[]>;
    engagement_events: LoadedData<(import("@tellescope/types-models").EngagementEvent & {
        id: string;
        createdAt: Date;
    })[]>;
    emails: LoadedData<(import("@tellescope/types-models").Email & {
        id: string;
        createdAt: Date;
    })[]>;
    sms_messages: LoadedData<(import("@tellescope/types-models").SMSMessage & {
        id: string;
        createdAt: Date;
    })[]>;
    user_notifications: LoadedData<(import("@tellescope/types-models").UserNotification & {
        id: string;
        createdAt: Date;
    })[]>;
    endusers: LoadedData<(import("@tellescope/types-models").Enduser & {
        id: string;
        createdAt: Date;
    })[]>;
    tickets: LoadedData<(import("@tellescope/types-models").Ticket & {
        id: string;
        createdAt: Date;
    })[]>;
    meetings: LoadedData<(import("@tellescope/types-models").Meeting & {
        id: string;
        createdAt: Date;
    })[]>;
    files: LoadedData<(import("@tellescope/types-models").File & {
        id: string;
        createdAt: Date;
    })[]>;
    notes: LoadedData<(import("@tellescope/types-models").Note & {
        id: string;
        createdAt: Date;
    })[]>;
    templates: LoadedData<(import("@tellescope/types-models").MessageTemplate & {
        id: string;
        createdAt: Date;
    })[]>;
    forms: LoadedData<(import("@tellescope/types-models").Form & {
        id: string;
        createdAt: Date;
    })[]>;
    form_fields: LoadedData<(import("@tellescope/types-models").FormField & {
        id: string;
        createdAt: Date;
    })[]>;
    form_responses: LoadedData<(import("@tellescope/types-models").FormResponse & {
        id: string;
        createdAt: Date;
    })[]>;
    journeys: LoadedData<(import("@tellescope/types-models").Journey & {
        id: string;
        createdAt: Date;
    })[]>;
    users: LoadedData<(import("@tellescope/types-models").User & {
        id: string;
        createdAt: Date;
    })[]>;
    users_display: LoadedData<UserDisplayInfo[]>;
    automation_steps: LoadedData<(import("@tellescope/types-models").AutomationStep & {
        id: string;
        createdAt: Date;
    })[]>;
    enduser_observations: LoadedData<(import("@tellescope/types-models").EnduserObservation & {
        id: string;
        createdAt: Date;
    })[]>;
    forum_posts: LoadedData<(import("@tellescope/types-models").ForumPost & {
        id: string;
        createdAt: Date;
    })[]>;
    forums: LoadedData<(import("@tellescope/types-models").Forum & {
        id: string;
        createdAt: Date;
    })[]>;
    managed_content_records: LoadedData<(import("@tellescope/types-models").ManagedContentRecord & {
        id: string;
        createdAt: Date;
    })[]>;
    managed_content_record_assignments: LoadedData<(import("@tellescope/types-models").ManagedContentRecordAssignment & {
        id: string;
        createdAt: Date;
    })[]>;
    post_comments: LoadedData<(import("@tellescope/types-models").PostComment & {
        id: string;
        createdAt: Date;
    })[]>;
    post_likes: LoadedData<(import("@tellescope/types-models").PostLike & {
        id: string;
        createdAt: Date;
    })[]>;
    comment_likes: LoadedData<(import("@tellescope/types-models").CommentLike & {
        id: string;
        createdAt: Date;
    })[]>;
    integrations: LoadedData<(import("@tellescope/types-models").Integration & {
        id: string;
        createdAt: Date;
    })[]>;
    organizations: LoadedData<(import("@tellescope/types-models").Organization & {
        id: string;
        createdAt: Date;
    })[]>;
    calendar_event_RSVPs: LoadedData<(import("@tellescope/types-models").CalendarEventRSVP & {
        id: string;
        createdAt: Date;
    })[]>;
    databases: LoadedData<(import("@tellescope/types-models").Database & {
        id: string;
        createdAt: Date;
    })[]>;
    database_records: LoadedData<(import("@tellescope/types-models").DatabaseRecord & {
        id: string;
        createdAt: Date;
    })[]>;
    portal_customizations: LoadedData<(import("@tellescope/types-models").PortalCustomization & {
        id: string;
        createdAt: Date;
    })[]>;
    enduser_tasks: LoadedData<(import("@tellescope/types-models").EnduserTask & {
        id: string;
        createdAt: Date;
    })[]>;
    care_plans: LoadedData<(import("@tellescope/types-models").CarePlan & {
        id: string;
        createdAt: Date;
    })[]>;
    role_based_access_permissions: LoadedData<(import("@tellescope/types-models").RoleBasedAccessPermission & {
        id: string;
        createdAt: Date;
    })[]>;
    appointment_booking_pages: LoadedData<(import("@tellescope/types-models").AppointmentBookingPage & {
        id: string;
        createdAt: Date;
    })[]>;
    appointment_locations: LoadedData<(import("@tellescope/types-models").AppointmentLocation & {
        id: string;
        createdAt: Date;
    })[]>;
    products: LoadedData<(import("@tellescope/types-models").Product & {
        id: string;
        createdAt: Date;
    })[]>;
    purchases: LoadedData<(import("@tellescope/types-models").Purchase & {
        id: string;
        createdAt: Date;
    })[]>;
    purchase_credits: LoadedData<(import("@tellescope/types-models").PurchaseCredit & {
        id: string;
        createdAt: Date;
    })[]>;
    phone_calls: LoadedData<(import("@tellescope/types-models").PhoneCall & {
        id: string;
        createdAt: Date;
    })[]>;
    phone_trees: LoadedData<(import("@tellescope/types-models").PhoneTree & {
        id: string;
        createdAt: Date;
    })[]>;
    analytics_frames: LoadedData<(import("@tellescope/types-models").AnalyticsFrame & {
        id: string;
        createdAt: Date;
    })[]>;
    superbills: LoadedData<(import("@tellescope/types-models").Superbill & {
        id: string;
        createdAt: Date;
    })[]>;
    superbill_providers: LoadedData<(import("@tellescope/types-models").SuperbillProvider & {
        id: string;
        createdAt: Date;
    })[]>;
    enduser_profile_views: LoadedData<(import("@tellescope/types-models").EnduserProfileView & {
        id: string;
        createdAt: Date;
    })[]>;
    enduser_medications: LoadedData<(import("@tellescope/types-models").EnduserMedication & {
        id: string;
        createdAt: Date;
    })[]>;
    enduser_custom_types: LoadedData<(import("@tellescope/types-models").EnduserCustomType & {
        id: string;
        createdAt: Date;
    })[]>;
    user_logs: LoadedData<(import("@tellescope/types-models").UserLog & {
        id: string;
        createdAt: Date;
    })[]>;
    table_views: LoadedData<(import("@tellescope/types-models").TableView & {
        id: string;
        createdAt: Date;
    })[]>;
    email_sync_denials: LoadedData<(import("@tellescope/types-models").EmailSyncDenial & {
        id: string;
        createdAt: Date;
    })[]>;
    ticket_threads: LoadedData<(import("@tellescope/types-models").TicketThread & {
        id: string;
        createdAt: Date;
    })[]>;
    ticket_thread_comments: LoadedData<(import("@tellescope/types-models").TicketThreadComment & {
        id: string;
        createdAt: Date;
    })[]>;
    group_mms_conversations: LoadedData<(import("@tellescope/types-models").GroupMMSConversation & {
        id: string;
        createdAt: Date;
    })[]>;
    enduser_orders: LoadedData<(import("@tellescope/types-models").EnduserOrder & {
        id: string;
        createdAt: Date;
    })[]>;
    enduser_encounters: LoadedData<(import("@tellescope/types-models").EnduserEncounter & {
        id: string;
        createdAt: Date;
    })[]>;
    vital_configurations: LoadedData<(import("@tellescope/types-models").VitalConfiguration & {
        id: string;
        createdAt: Date;
    })[]>;
    blocked_phones: LoadedData<(import("@tellescope/types-models").BlockedPhone & {
        id: string;
        createdAt: Date;
    })[]>;
    prescription_routes: LoadedData<(import("@tellescope/types-models").PrescriptionRoute & {
        id: string;
        createdAt: Date;
    })[]>;
    enduser_problems: LoadedData<(import("@tellescope/types-models").EnduserProblem & {
        id: string;
        createdAt: Date;
    })[]>;
    flowchart_notes: LoadedData<(import("@tellescope/types-models").FlowchartNote & {
        id: string;
        createdAt: Date;
    })[]>;
    webhook_logs: LoadedData<(import("@tellescope/types-models").WebhookLog & {
        id: string;
        createdAt: Date;
    })[]>;
    form_groups: LoadedData<(import("@tellescope/types-models").FormGroup & {
        id: string;
        createdAt: Date;
    })[]>;
    portal_brandings: LoadedData<(import("@tellescope/types-models").PortalBranding & {
        id: string;
        createdAt: Date;
    })[]>;
    message_template_snippets: LoadedData<(import("@tellescope/types-models").MessageTemplateSnippet & {
        id: string;
        createdAt: Date;
    })[]>;
    fax_logs: LoadedData<(import("@tellescope/types-models").FaxLog & {
        id: string;
        createdAt: Date;
    })[]>;
    call_hold_queues: LoadedData<(import("@tellescope/types-models").TicketQueue & {
        id: string;
        createdAt: Date;
    })[]>;
    suggested_contacts: LoadedData<(import("@tellescope/types-models").SuggestedContact & {
        id: string;
        createdAt: Date;
    })[]>;
    diagnosis_codes: LoadedData<(import("@tellescope/types-models").DiagnosisCode & {
        id: string;
        createdAt: Date;
    })[]>;
    allergy_codes: LoadedData<(import("@tellescope/types-models").AllergyCode & {
        id: string;
        createdAt: Date;
    })[]>;
    waitlists: LoadedData<(import("@tellescope/types-models").Waitlist & {
        id: string;
        createdAt: Date;
    })[]>;
}, undefined, import("redux").AnyAction> & import("redux").Dispatch<import("redux").AnyAction>, import("redux").AnyAction>>;
export declare const createTellescopeSelector: () => <Selected extends unknown>(selector: (state: import("@reduxjs/toolkit").ThunkDispatch<{
    agent_records: LoadedData<(import("@tellescope/types-models").AgentRecord & {
        id: string;
        createdAt: Date;
    })[]>;
    enduser_eligibility_results: LoadedData<(import("@tellescope/types-models").EnduserEligibilityResult & {
        id: string;
        createdAt: Date;
    })[]>;
    integration_logs: LoadedData<(import("@tellescope/types-models").IntegrationLog & {
        id: string;
        createdAt: Date;
    })[]>;
    ticket_queues: LoadedData<(import("@tellescope/types-models").TicketQueue & {
        id: string;
        createdAt: Date;
    })[]>;
    automation_triggers: LoadedData<(import("@tellescope/types-models").AutomationTrigger & {
        id: string;
        createdAt: Date;
    })[]>;
    automated_actions: LoadedData<(import("@tellescope/types-models").AutomatedAction & {
        id: string;
        createdAt: Date;
    })[]>;
    enduser_views: LoadedData<(import("@tellescope/types-models").EnduserView & {
        id: string;
        createdAt: Date;
    })[]>;
    background_errors: LoadedData<(import("@tellescope/types-models").BackgroundError & {
        id: string;
        createdAt: Date;
    })[]>;
    availability_blocks: LoadedData<(import("@tellescope/types-models").AvailabilityBlock & {
        id: string;
        createdAt: Date;
    })[]>;
    chat_rooms: LoadedData<(import("@tellescope/types-models").ChatRoom & {
        id: string;
        createdAt: Date;
    })[]>;
    chats: LoadedData<(import("@tellescope/types-models").ChatMessage & {
        id: string;
        createdAt: Date;
    })[]>;
    chatRoomDisplayInfo: LoadedData<ChatRoomDisplayInfo[]>;
    calendar_events: LoadedData<(import("@tellescope/types-models").CalendarEvent & {
        id: string;
        createdAt: Date;
    })[]>;
    calendar_event_templates: LoadedData<(import("@tellescope/types-models").CalendarEventTemplate & {
        id: string;
        createdAt: Date;
    })[]>;
    configurations: LoadedData<(import("@tellescope/types-models").Configuration & {
        id: string;
        createdAt: Date;
    })[]>;
    engagement_events: LoadedData<(import("@tellescope/types-models").EngagementEvent & {
        id: string;
        createdAt: Date;
    })[]>;
    emails: LoadedData<(import("@tellescope/types-models").Email & {
        id: string;
        createdAt: Date;
    })[]>;
    sms_messages: LoadedData<(import("@tellescope/types-models").SMSMessage & {
        id: string;
        createdAt: Date;
    })[]>;
    user_notifications: LoadedData<(import("@tellescope/types-models").UserNotification & {
        id: string;
        createdAt: Date;
    })[]>;
    endusers: LoadedData<(import("@tellescope/types-models").Enduser & {
        id: string;
        createdAt: Date;
    })[]>;
    tickets: LoadedData<(import("@tellescope/types-models").Ticket & {
        id: string;
        createdAt: Date;
    })[]>;
    meetings: LoadedData<(import("@tellescope/types-models").Meeting & {
        id: string;
        createdAt: Date;
    })[]>;
    files: LoadedData<(import("@tellescope/types-models").File & {
        id: string;
        createdAt: Date;
    })[]>;
    notes: LoadedData<(import("@tellescope/types-models").Note & {
        id: string;
        createdAt: Date;
    })[]>;
    templates: LoadedData<(import("@tellescope/types-models").MessageTemplate & {
        id: string;
        createdAt: Date;
    })[]>;
    forms: LoadedData<(import("@tellescope/types-models").Form & {
        id: string;
        createdAt: Date;
    })[]>;
    form_fields: LoadedData<(import("@tellescope/types-models").FormField & {
        id: string;
        createdAt: Date;
    })[]>;
    form_responses: LoadedData<(import("@tellescope/types-models").FormResponse & {
        id: string;
        createdAt: Date;
    })[]>;
    journeys: LoadedData<(import("@tellescope/types-models").Journey & {
        id: string;
        createdAt: Date;
    })[]>;
    users: LoadedData<(import("@tellescope/types-models").User & {
        id: string;
        createdAt: Date;
    })[]>;
    users_display: LoadedData<UserDisplayInfo[]>;
    automation_steps: LoadedData<(import("@tellescope/types-models").AutomationStep & {
        id: string;
        createdAt: Date;
    })[]>;
    enduser_observations: LoadedData<(import("@tellescope/types-models").EnduserObservation & {
        id: string;
        createdAt: Date;
    })[]>;
    forum_posts: LoadedData<(import("@tellescope/types-models").ForumPost & {
        id: string;
        createdAt: Date;
    })[]>;
    forums: LoadedData<(import("@tellescope/types-models").Forum & {
        id: string;
        createdAt: Date;
    })[]>;
    managed_content_records: LoadedData<(import("@tellescope/types-models").ManagedContentRecord & {
        id: string;
        createdAt: Date;
    })[]>;
    managed_content_record_assignments: LoadedData<(import("@tellescope/types-models").ManagedContentRecordAssignment & {
        id: string;
        createdAt: Date;
    })[]>;
    post_comments: LoadedData<(import("@tellescope/types-models").PostComment & {
        id: string;
        createdAt: Date;
    })[]>;
    post_likes: LoadedData<(import("@tellescope/types-models").PostLike & {
        id: string;
        createdAt: Date;
    })[]>;
    comment_likes: LoadedData<(import("@tellescope/types-models").CommentLike & {
        id: string;
        createdAt: Date;
    })[]>;
    integrations: LoadedData<(import("@tellescope/types-models").Integration & {
        id: string;
        createdAt: Date;
    })[]>;
    organizations: LoadedData<(import("@tellescope/types-models").Organization & {
        id: string;
        createdAt: Date;
    })[]>;
    calendar_event_RSVPs: LoadedData<(import("@tellescope/types-models").CalendarEventRSVP & {
        id: string;
        createdAt: Date;
    })[]>;
    databases: LoadedData<(import("@tellescope/types-models").Database & {
        id: string;
        createdAt: Date;
    })[]>;
    database_records: LoadedData<(import("@tellescope/types-models").DatabaseRecord & {
        id: string;
        createdAt: Date;
    })[]>;
    portal_customizations: LoadedData<(import("@tellescope/types-models").PortalCustomization & {
        id: string;
        createdAt: Date;
    })[]>;
    enduser_tasks: LoadedData<(import("@tellescope/types-models").EnduserTask & {
        id: string;
        createdAt: Date;
    })[]>;
    care_plans: LoadedData<(import("@tellescope/types-models").CarePlan & {
        id: string;
        createdAt: Date;
    })[]>;
    role_based_access_permissions: LoadedData<(import("@tellescope/types-models").RoleBasedAccessPermission & {
        id: string;
        createdAt: Date;
    })[]>;
    appointment_booking_pages: LoadedData<(import("@tellescope/types-models").AppointmentBookingPage & {
        id: string;
        createdAt: Date;
    })[]>;
    appointment_locations: LoadedData<(import("@tellescope/types-models").AppointmentLocation & {
        id: string;
        createdAt: Date;
    })[]>;
    products: LoadedData<(import("@tellescope/types-models").Product & {
        id: string;
        createdAt: Date;
    })[]>;
    purchases: LoadedData<(import("@tellescope/types-models").Purchase & {
        id: string;
        createdAt: Date;
    })[]>;
    purchase_credits: LoadedData<(import("@tellescope/types-models").PurchaseCredit & {
        id: string;
        createdAt: Date;
    })[]>;
    phone_calls: LoadedData<(import("@tellescope/types-models").PhoneCall & {
        id: string;
        createdAt: Date;
    })[]>;
    phone_trees: LoadedData<(import("@tellescope/types-models").PhoneTree & {
        id: string;
        createdAt: Date;
    })[]>;
    analytics_frames: LoadedData<(import("@tellescope/types-models").AnalyticsFrame & {
        id: string;
        createdAt: Date;
    })[]>;
    superbills: LoadedData<(import("@tellescope/types-models").Superbill & {
        id: string;
        createdAt: Date;
    })[]>;
    superbill_providers: LoadedData<(import("@tellescope/types-models").SuperbillProvider & {
        id: string;
        createdAt: Date;
    })[]>;
    enduser_profile_views: LoadedData<(import("@tellescope/types-models").EnduserProfileView & {
        id: string;
        createdAt: Date;
    })[]>;
    enduser_medications: LoadedData<(import("@tellescope/types-models").EnduserMedication & {
        id: string;
        createdAt: Date;
    })[]>;
    enduser_custom_types: LoadedData<(import("@tellescope/types-models").EnduserCustomType & {
        id: string;
        createdAt: Date;
    })[]>;
    user_logs: LoadedData<(import("@tellescope/types-models").UserLog & {
        id: string;
        createdAt: Date;
    })[]>;
    table_views: LoadedData<(import("@tellescope/types-models").TableView & {
        id: string;
        createdAt: Date;
    })[]>;
    email_sync_denials: LoadedData<(import("@tellescope/types-models").EmailSyncDenial & {
        id: string;
        createdAt: Date;
    })[]>;
    ticket_threads: LoadedData<(import("@tellescope/types-models").TicketThread & {
        id: string;
        createdAt: Date;
    })[]>;
    ticket_thread_comments: LoadedData<(import("@tellescope/types-models").TicketThreadComment & {
        id: string;
        createdAt: Date;
    })[]>;
    group_mms_conversations: LoadedData<(import("@tellescope/types-models").GroupMMSConversation & {
        id: string;
        createdAt: Date;
    })[]>;
    enduser_orders: LoadedData<(import("@tellescope/types-models").EnduserOrder & {
        id: string;
        createdAt: Date;
    })[]>;
    enduser_encounters: LoadedData<(import("@tellescope/types-models").EnduserEncounter & {
        id: string;
        createdAt: Date;
    })[]>;
    vital_configurations: LoadedData<(import("@tellescope/types-models").VitalConfiguration & {
        id: string;
        createdAt: Date;
    })[]>;
    blocked_phones: LoadedData<(import("@tellescope/types-models").BlockedPhone & {
        id: string;
        createdAt: Date;
    })[]>;
    prescription_routes: LoadedData<(import("@tellescope/types-models").PrescriptionRoute & {
        id: string;
        createdAt: Date;
    })[]>;
    enduser_problems: LoadedData<(import("@tellescope/types-models").EnduserProblem & {
        id: string;
        createdAt: Date;
    })[]>;
    flowchart_notes: LoadedData<(import("@tellescope/types-models").FlowchartNote & {
        id: string;
        createdAt: Date;
    })[]>;
    webhook_logs: LoadedData<(import("@tellescope/types-models").WebhookLog & {
        id: string;
        createdAt: Date;
    })[]>;
    form_groups: LoadedData<(import("@tellescope/types-models").FormGroup & {
        id: string;
        createdAt: Date;
    })[]>;
    portal_brandings: LoadedData<(import("@tellescope/types-models").PortalBranding & {
        id: string;
        createdAt: Date;
    })[]>;
    message_template_snippets: LoadedData<(import("@tellescope/types-models").MessageTemplateSnippet & {
        id: string;
        createdAt: Date;
    })[]>;
    fax_logs: LoadedData<(import("@tellescope/types-models").FaxLog & {
        id: string;
        createdAt: Date;
    })[]>;
    call_hold_queues: LoadedData<(import("@tellescope/types-models").TicketQueue & {
        id: string;
        createdAt: Date;
    })[]>;
    suggested_contacts: LoadedData<(import("@tellescope/types-models").SuggestedContact & {
        id: string;
        createdAt: Date;
    })[]>;
    diagnosis_codes: LoadedData<(import("@tellescope/types-models").DiagnosisCode & {
        id: string;
        createdAt: Date;
    })[]>;
    allergy_codes: LoadedData<(import("@tellescope/types-models").AllergyCode & {
        id: string;
        createdAt: Date;
    })[]>;
    waitlists: LoadedData<(import("@tellescope/types-models").Waitlist & {
        id: string;
        createdAt: Date;
    })[]>;
}, undefined, import("redux").AnyAction> & import("redux").Dispatch<import("redux").AnyAction>) => Selected, equalityFn?: ((previous: Selected, next: Selected) => boolean) | undefined) => Selected;
type WithId = {
    id: string | number;
};
export declare const WithFetchContext: ({ children }: {
    children: React.ReactNode;
}) => JSX.Element;
export declare const toLoadedData: <T>(p: () => Promise<T>, o?: {
    valueOnError?: T | undefined;
} | undefined) => Promise<{
    status: LoadingStatus.Loaded;
    value: T;
} | {
    status: LoadingStatus.Error;
    value: APIError;
}>;
export declare const add_elements_to_array: <T extends WithId>(a: LoadedData<T[]>, elements: T[], options?: AddOptions) => {
    status: LoadingStatus;
    value: T[];
};
export declare const update_elements_in_array: <T extends WithId>(a: LoadedData<T[]>, updates: {
    [id: string]: Partial<T>;
}) => {
    status: LoadingStatus.Unloaded;
    value: undefined;
} | {
    status: LoadingStatus.Fetching;
    value: undefined;
} | {
    status: LoadingStatus.Error;
    value: APIError;
} | {
    status: LoadingStatus;
    value: T[];
};
export declare const replace_elements_in_array: <T extends WithId>(a: LoadedData<T[]>, updated: {
    [id: string]: Partial<T>;
}) => {
    status: LoadingStatus.Unloaded;
    value: undefined;
} | {
    status: LoadingStatus.Fetching;
    value: undefined;
} | {
    status: LoadingStatus.Error;
    value: APIError;
} | {
    status: LoadingStatus;
    value: Partial<T>[];
};
export declare const remove_elements_in_array: <T extends WithId>(a: LoadedData<T[]>, ids: (string | number)[]) => {
    status: LoadingStatus.Unloaded;
    value: undefined;
} | {
    status: LoadingStatus.Fetching;
    value: undefined;
} | {
    status: LoadingStatus.Error;
    value: APIError;
} | {
    status: LoadingStatus;
    value: T[];
};
type PayloadActionWithOptions<DATA, OPTIONS = {}> = PayloadAction<{
    value: DATA;
    options?: OPTIONS;
}>;
interface ListReducers<T> {
    set: (state: LoadedData<T[]>, action: PayloadActionWithOptions<LoadedData<T[]>>) => void;
    setFetching: (state: LoadedData<T[]>) => void;
    add: (state: LoadedData<T[]>, action: PayloadActionWithOptions<T, AddOptions>) => void;
    addSome: (state: LoadedData<T[]>, action: PayloadActionWithOptions<T[], AddOptions>) => void;
    update: (state: LoadedData<T[]>, action: PayloadActionWithOptions<{
        id: string;
        updates: Partial<T>;
    }>) => void;
    updateSome: (state: LoadedData<T[]>, action: PayloadActionWithOptions<{
        [id: string]: Partial<T>;
    }>) => void;
    modifyElements: (state: LoadedData<T[]>, action: PayloadActionWithOptions<{
        filter: (e: T) => boolean;
        modifier: (e: T) => T;
    }>) => void;
    replace: (state: LoadedData<T[]>, action: PayloadActionWithOptions<{
        id: string;
        updated: T;
    }>) => void;
    remove: (state: LoadedData<T[]>, action: PayloadActionWithOptions<{
        id: string;
    }>) => void;
    removeSome: (state: LoadedData<T[]>, action: PayloadActionWithOptions<{
        ids: string[];
    }>) => void;
    [index: string]: any;
}
export declare const createSliceForList: <T extends {
    id: string | number;
}, N extends string>(name: N) => Slice<LoadedData<T[]>, ListReducers<T>, N>;
export type ChatRoomDisplayInfo = {
    id: string;
} & {
    [index: string]: UserDisplayInfo;
};
export declare const sharedConfig: {
    reducer: {
        agent_records: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").AgentRecord & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        enduser_eligibility_results: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").EnduserEligibilityResult & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        integration_logs: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").IntegrationLog & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        ticket_queues: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").TicketQueue & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        automation_triggers: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").AutomationTrigger & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        automated_actions: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").AutomatedAction & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        enduser_views: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").EnduserView & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        background_errors: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").BackgroundError & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        availability_blocks: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").AvailabilityBlock & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        chat_rooms: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").ChatRoom & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        chats: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").ChatMessage & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        chatRoomDisplayInfo: import("redux").Reducer<LoadedData<ChatRoomDisplayInfo[]>, import("redux").AnyAction>;
        calendar_events: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").CalendarEvent & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        calendar_event_templates: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").CalendarEventTemplate & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        configurations: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").Configuration & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        engagement_events: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").EngagementEvent & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        emails: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").Email & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        sms_messages: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").SMSMessage & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        user_notifications: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").UserNotification & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        endusers: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").Enduser & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        tickets: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").Ticket & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        meetings: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").Meeting & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        files: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").File & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        notes: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").Note & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        templates: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").MessageTemplate & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        forms: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").Form & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        form_fields: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").FormField & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        form_responses: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").FormResponse & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        journeys: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").Journey & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        users: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").User & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        users_display: import("redux").Reducer<LoadedData<UserDisplayInfo[]>, import("redux").AnyAction>;
        automation_steps: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").AutomationStep & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        enduser_observations: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").EnduserObservation & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        forum_posts: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").ForumPost & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        forums: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").Forum & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        managed_content_records: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").ManagedContentRecord & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        managed_content_record_assignments: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").ManagedContentRecordAssignment & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        post_comments: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").PostComment & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        post_likes: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").PostLike & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        comment_likes: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").CommentLike & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        integrations: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").Integration & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        organizations: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").Organization & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        calendar_event_RSVPs: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").CalendarEventRSVP & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        databases: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").Database & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        database_records: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").DatabaseRecord & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        portal_customizations: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").PortalCustomization & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        enduser_tasks: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").EnduserTask & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        care_plans: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").CarePlan & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        role_based_access_permissions: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").RoleBasedAccessPermission & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        appointment_booking_pages: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").AppointmentBookingPage & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        appointment_locations: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").AppointmentLocation & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        products: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").Product & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        purchases: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").Purchase & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        purchase_credits: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").PurchaseCredit & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        phone_calls: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").PhoneCall & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        phone_trees: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").PhoneTree & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        analytics_frames: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").AnalyticsFrame & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        superbills: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").Superbill & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        superbill_providers: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").SuperbillProvider & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        enduser_profile_views: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").EnduserProfileView & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        enduser_medications: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").EnduserMedication & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        enduser_custom_types: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").EnduserCustomType & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        user_logs: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").UserLog & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        table_views: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").TableView & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        email_sync_denials: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").EmailSyncDenial & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        ticket_threads: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").TicketThread & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        ticket_thread_comments: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").TicketThreadComment & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        group_mms_conversations: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").GroupMMSConversation & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        enduser_orders: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").EnduserOrder & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        enduser_encounters: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").EnduserEncounter & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        vital_configurations: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").VitalConfiguration & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        blocked_phones: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").BlockedPhone & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        prescription_routes: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").PrescriptionRoute & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        enduser_problems: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").EnduserProblem & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        flowchart_notes: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").FlowchartNote & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        webhook_logs: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").WebhookLog & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        form_groups: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").FormGroup & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        portal_brandings: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").PortalBranding & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        message_template_snippets: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").MessageTemplateSnippet & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        fax_logs: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").FaxLog & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        call_hold_queues: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").TicketQueue & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        suggested_contacts: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").SuggestedContact & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        diagnosis_codes: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").DiagnosisCode & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        allergy_codes: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").AllergyCode & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
        waitlists: import("redux").Reducer<LoadedData<(import("@tellescope/types-models").Waitlist & {
            id: string;
            createdAt: Date;
        })[]>, import("redux").AnyAction>;
    };
};
export declare const useResetState: () => () => void;
export declare const UserProvider: (props: {
    children: React.ReactNode;
}) => JSX.Element;
export declare const ExtendedUserProvider: <A, B extends Action<any>>(props: {
    children: React.ReactNode;
    store: import("@reduxjs/toolkit/dist/configureStore").ToolkitStore<A, B, readonly import("redux").Middleware<{}, A, import("redux").Dispatch<import("redux").AnyAction>>[]>;
}) => JSX.Element;
export declare const EnduserProvider: (props: {
    children: React.ReactNode;
}) => JSX.Element;
export declare const ExtendedEnduserProvider: <A, B extends Action<any>>(props: {
    children: React.ReactNode;
    store: import("@reduxjs/toolkit/dist/configureStore").ToolkitStore<A, B, readonly import("redux").Middleware<{}, A, import("redux").Dispatch<import("redux").AnyAction>>[]>;
}) => JSX.Element;
export type AddOptions = {
    addTo?: 'start' | 'end';
    replaceIfMatch?: boolean;
};
export interface LoadMoreOptions<T> {
    key?: string;
    limit?: number;
    filter?: ReadFilter<T> | undefined;
    mdbFilter?: Record<string, any>;
}
export interface LoadMoreFunctions<T> {
    loadMore: (options?: LoadMoreOptions<T>) => Promise<void>;
    doneLoading: (id?: string) => boolean;
}
export declare const INACTIVE_SYNC_INTERVAL_IN_MS = 30000;
export declare const DEFAULT_SYNC_INTERVAL_IN_MS = 15000;
export declare const MEDIUM_SYNC_INTERAVL = 10000;
export declare const FAST_SYNC_INTERVAL = 5000;
export declare const lastActiveForSync: {
    at: Date;
    hasFocus: boolean;
};
export declare const lastDataSync: {
    current: {
        numResults: number;
        at: Date;
        from: Date;
        latency: number;
        duration: number;
    };
};
export declare const useDataSync____internal: () => {
    setLoadTiming: (key: string, loadTimeInMS: number) => void;
    setHandler: (key: string, handler: undefined | (() => void)) => void;
    removeHandler: (key: string, handler: () => void) => void;
    getLoaded: <T extends string>(modelName: T) => ((import("@tellescope/types-models").Form & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").FormField & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Enduser & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").User & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").FormResponse & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AgentRecord & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserEligibilityResult & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").IntegrationLog & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").TicketQueue & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AutomationTrigger & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AutomatedAction & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserView & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").BackgroundError & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AvailabilityBlock & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").ChatRoom & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").ChatMessage & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").CalendarEvent & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").CalendarEventTemplate & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Configuration & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EngagementEvent & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Email & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").SMSMessage & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").UserNotification & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Ticket & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Meeting & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").File & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Note & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").MessageTemplate & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Journey & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AutomationStep & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserObservation & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").ForumPost & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Forum & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").ManagedContentRecord & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").ManagedContentRecordAssignment & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PostComment & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PostLike & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").CommentLike & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Integration & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Organization & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").CalendarEventRSVP & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Database & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").DatabaseRecord & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PortalCustomization & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserTask & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").CarePlan & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").RoleBasedAccessPermission & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AppointmentBookingPage & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AppointmentLocation & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Product & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Purchase & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PurchaseCredit & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PhoneCall & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PhoneTree & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AnalyticsFrame & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Superbill & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").SuperbillProvider & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserProfileView & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserMedication & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserCustomType & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").UserLog & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").TableView & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EmailSyncDenial & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").TicketThread & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").TicketThreadComment & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").GroupMMSConversation & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserOrder & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserEncounter & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").VitalConfiguration & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").BlockedPhone & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PrescriptionRoute & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserProblem & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").FlowchartNote & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").WebhookLog & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").FormGroup & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PortalBranding & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").MessageTemplateSnippet & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").FaxLog & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").SuggestedContact & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").DiagnosisCode & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AllergyCode & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Waitlist & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").CallHoldQueue & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").WebHook & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").APIKey & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserStatusUpdate & {
        id: string;
        createdAt: Date;
    }))[];
    getDeleted: <T_1 extends string>(modelName: T_1) => string[];
    popLoaded: <T_2 extends string>(modelName: T_2) => ((import("@tellescope/types-models").Form & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").FormField & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Enduser & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").User & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").FormResponse & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AgentRecord & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserEligibilityResult & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").IntegrationLog & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").TicketQueue & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AutomationTrigger & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AutomatedAction & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserView & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").BackgroundError & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AvailabilityBlock & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").ChatRoom & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").ChatMessage & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").CalendarEvent & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").CalendarEventTemplate & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Configuration & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EngagementEvent & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Email & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").SMSMessage & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").UserNotification & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Ticket & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Meeting & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").File & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Note & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").MessageTemplate & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Journey & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AutomationStep & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserObservation & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").ForumPost & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Forum & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").ManagedContentRecord & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").ManagedContentRecordAssignment & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PostComment & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PostLike & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").CommentLike & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Integration & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Organization & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").CalendarEventRSVP & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Database & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").DatabaseRecord & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PortalCustomization & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserTask & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").CarePlan & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").RoleBasedAccessPermission & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AppointmentBookingPage & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AppointmentLocation & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Product & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Purchase & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PurchaseCredit & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PhoneCall & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PhoneTree & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AnalyticsFrame & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Superbill & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").SuperbillProvider & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserProfileView & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserMedication & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserCustomType & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").UserLog & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").TableView & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EmailSyncDenial & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").TicketThread & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").TicketThreadComment & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").GroupMMSConversation & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserOrder & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserEncounter & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").VitalConfiguration & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").BlockedPhone & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PrescriptionRoute & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserProblem & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").FlowchartNote & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").WebhookLog & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").FormGroup & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PortalBranding & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").MessageTemplateSnippet & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").FaxLog & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").SuggestedContact & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").DiagnosisCode & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AllergyCode & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Waitlist & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").CallHoldQueue & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").WebHook & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").APIKey & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserStatusUpdate & {
        id: string;
        createdAt: Date;
    }))[];
    popDeleted: <T_3 extends string>(modelName: T_3) => string[];
};
export declare const WithDataSync: ({ children }: {
    children: React.ReactNode;
}) => JSX.Element;
export declare const useSyncContext: () => {
    setLoadTiming: (key: string, loadTimeInMS: number) => void;
    setHandler: (key: string, handler: undefined | (() => void)) => void;
    removeHandler: (key: string, handler: () => void) => void;
    getLoaded: <T extends string>(modelName: T) => ((import("@tellescope/types-models").Form & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").FormField & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Enduser & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").User & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").FormResponse & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AgentRecord & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserEligibilityResult & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").IntegrationLog & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").TicketQueue & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AutomationTrigger & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AutomatedAction & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserView & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").BackgroundError & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AvailabilityBlock & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").ChatRoom & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").ChatMessage & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").CalendarEvent & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").CalendarEventTemplate & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Configuration & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EngagementEvent & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Email & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").SMSMessage & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").UserNotification & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Ticket & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Meeting & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").File & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Note & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").MessageTemplate & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Journey & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AutomationStep & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserObservation & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").ForumPost & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Forum & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").ManagedContentRecord & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").ManagedContentRecordAssignment & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PostComment & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PostLike & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").CommentLike & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Integration & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Organization & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").CalendarEventRSVP & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Database & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").DatabaseRecord & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PortalCustomization & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserTask & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").CarePlan & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").RoleBasedAccessPermission & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AppointmentBookingPage & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AppointmentLocation & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Product & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Purchase & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PurchaseCredit & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PhoneCall & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PhoneTree & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AnalyticsFrame & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Superbill & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").SuperbillProvider & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserProfileView & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserMedication & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserCustomType & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").UserLog & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").TableView & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EmailSyncDenial & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").TicketThread & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").TicketThreadComment & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").GroupMMSConversation & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserOrder & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserEncounter & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").VitalConfiguration & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").BlockedPhone & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PrescriptionRoute & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserProblem & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").FlowchartNote & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").WebhookLog & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").FormGroup & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PortalBranding & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").MessageTemplateSnippet & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").FaxLog & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").SuggestedContact & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").DiagnosisCode & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AllergyCode & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Waitlist & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").CallHoldQueue & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").WebHook & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").APIKey & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserStatusUpdate & {
        id: string;
        createdAt: Date;
    }))[];
    getDeleted: <T_1 extends string>(modelName: T_1) => string[];
    popLoaded: <T_2 extends string>(modelName: T_2) => ((import("@tellescope/types-models").Form & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").FormField & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Enduser & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").User & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").FormResponse & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AgentRecord & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserEligibilityResult & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").IntegrationLog & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").TicketQueue & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AutomationTrigger & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AutomatedAction & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserView & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").BackgroundError & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AvailabilityBlock & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").ChatRoom & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").ChatMessage & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").CalendarEvent & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").CalendarEventTemplate & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Configuration & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EngagementEvent & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Email & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").SMSMessage & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").UserNotification & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Ticket & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Meeting & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").File & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Note & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").MessageTemplate & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Journey & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AutomationStep & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserObservation & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").ForumPost & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Forum & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").ManagedContentRecord & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").ManagedContentRecordAssignment & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PostComment & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PostLike & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").CommentLike & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Integration & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Organization & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").CalendarEventRSVP & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Database & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").DatabaseRecord & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PortalCustomization & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserTask & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").CarePlan & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").RoleBasedAccessPermission & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AppointmentBookingPage & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AppointmentLocation & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Product & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Purchase & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PurchaseCredit & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PhoneCall & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PhoneTree & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AnalyticsFrame & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Superbill & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").SuperbillProvider & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserProfileView & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserMedication & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserCustomType & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").UserLog & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").TableView & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EmailSyncDenial & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").TicketThread & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").TicketThreadComment & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").GroupMMSConversation & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserOrder & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserEncounter & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").VitalConfiguration & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").BlockedPhone & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PrescriptionRoute & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserProblem & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").FlowchartNote & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").WebhookLog & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").FormGroup & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").PortalBranding & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").MessageTemplateSnippet & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").FaxLog & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").SuggestedContact & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").DiagnosisCode & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").AllergyCode & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").Waitlist & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").CallHoldQueue & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").WebHook & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").APIKey & {
        id: string;
        createdAt: Date;
    }) | (import("@tellescope/types-models").EnduserStatusUpdate & {
        id: string;
        createdAt: Date;
    }))[];
    popDeleted: <T_3 extends string>(modelName: T_3) => string[];
};
export type UpdateElement<T> = (id: string, e: Partial<T>, o?: CustomUpdateOptions) => Promise<T>;
export interface ListUpdateMethods<T, ADD> extends LoadMoreFunctions<T> {
    addLocalElement: (e: T, o?: AddOptions) => T;
    addLocalElements: (e: T[], o?: AddOptions) => T[];
    replaceLocalElement: (id: string, e: T) => T;
    createElement: (e: ADD, o?: AddOptions) => Promise<T>;
    createElements: (e: ADD[], o?: AddOptions) => Promise<T[]>;
    findById: (id: string | number, options?: {
        reload?: boolean;
        batch?: boolean;
    }) => T | undefined | null;
    findByFilter: (match: (potential: T) => boolean, options?: {
        loadFilter?: ReadFilter<T>;
        reload?: boolean;
    }) => T | undefined | null;
    searchLocalElements: (query: string) => T[];
    updateElement: UpdateElement<T>;
    updateLocalElement: (id: string, e: Partial<T>) => void;
    updateLocalElements: (updates: {
        [id: string]: Partial<T>;
    }) => void;
    modifyLocalElements: (filter: (e: T) => boolean, modifier: (e: T) => T) => void;
    removeElement: (id: string) => Promise<void>;
    removeLocalElements: (ids: string[]) => void;
    reload: (loadOptions?: Pick<HookOptions<T>, 'loadFilter'>) => void;
    filtered: (filter: (value: T) => boolean) => LoadedData<T[]>;
    getOldestLoadedDate: () => Date | undefined;
    setOldestLoadedDate: (d: Date) => void;
    getOldestLoadedId: () => string | undefined;
    setOldestLoadedId: (id: string) => void;
    loadRecentlyCreated: () => Promise<T[]>;
    loadRecentlyUpdated: () => Promise<T[]>;
    recentlyCreatedFetch: Date;
}
export type ListStateReturnType<T extends {
    id: string | number;
}, ADD = Partial<T>> = [LoadedData<T[]>, ListUpdateMethods<T, ADD>];
export declare const useListStateHook: <T extends {
    id: string | number;
}, ADD extends Partial<T>>(modelName: string, state: LoadedData<T[]>, session: Session | EnduserSession, slice: Slice<any, ListReducers<T>, string>, apiCalls: {
    loadQuery?: LoadFunction<T> | undefined;
    findOne?: ((idOrFilter: string | ReadFilter<T>) => Promise<T>) | undefined;
    findByIds?: (({ ids }: {
        ids: string[];
    }) => Promise<{
        matches: T[];
    }>) | undefined;
    addOne?: ((value: ADD) => Promise<T>) | undefined;
    addSome?: ((values: ADD[]) => Promise<{
        created: T[];
        errors: any[];
    }>) | undefined;
    updateOne?: ((id: string, updates: Partial<T>, o?: CustomUpdateOptions) => Promise<T>) | undefined;
    deleteOne?: ((id: string) => Promise<void>) | undefined;
}, options?: ({
    onAdd?: ((n: T[]) => void) | undefined;
    onUpdate?: ((n: ({
        id: string;
    } & Partial<T>)[]) => void) | undefined;
    onDelete?: ((id: string[]) => void) | undefined;
} & HookOptions<T>) | undefined) => ListStateReturnType<T, ADD>;
export type HookOptions<T> = {
    sort?: SortOption;
    sortBy?: SortBy;
    limit?: number;
    loadFilter?: ReadFilter<T>;
    mdbFilter?: Record<string, any>;
    refetchInMS?: number;
    dontFetch?: boolean;
    addTo?: AddOptions['addTo'];
    onBulkRead?: (matches: T[]) => void;
    unbounceMS?: number;
};
export declare const useChatRoomDisplayInfo: (roomId: string, options?: HookOptions<ChatRoomDisplayInfo>) => [LoadedData<{
    [index: string]: UserDisplayInfo;
}>];
export declare const useUserAndEnduserDisplayInfo: () => Indexable<UserDisplayInfo>;
export declare const useEnduserEligibilityResults: (options?: HookOptions<import("@tellescope/types-models").EnduserEligibilityResult & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").EnduserEligibilityResult & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"enduser_eligibility_results", import("@tellescope/types-models").EnduserEligibilityResult & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useAgentRecords: (options?: HookOptions<import("@tellescope/types-models").AgentRecord & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").AgentRecord & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"agent_records", import("@tellescope/types-models").AgentRecord & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useSuggestedContacts: (options?: HookOptions<import("@tellescope/types-models").SuggestedContact & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").SuggestedContact & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"suggested_contacts", import("@tellescope/types-models").SuggestedContact & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useFaxLogs: (options?: HookOptions<import("@tellescope/types-models").FaxLog & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").FaxLog & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"fax_logs", import("@tellescope/types-models").FaxLog & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useMessageTemplateSnippets: (options?: HookOptions<import("@tellescope/types-models").MessageTemplateSnippet & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").MessageTemplateSnippet & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"message_template_snippets", import("@tellescope/types-models").MessageTemplateSnippet & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const usePortalBrandings: (options?: HookOptions<import("@tellescope/types-models").PortalBranding & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").PortalBranding & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"portal_brandings", import("@tellescope/types-models").PortalBranding & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useAllergyCodes: (options?: HookOptions<import("@tellescope/types-models").AllergyCode & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").AllergyCode & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"allergy_codes", import("@tellescope/types-models").AllergyCode & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useDiagnosisCodes: (options?: HookOptions<import("@tellescope/types-models").DiagnosisCode & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").DiagnosisCode & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"diagnosis_codes", import("@tellescope/types-models").DiagnosisCode & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useEnduserProblems: (options?: HookOptions<import("@tellescope/types-models").EnduserProblem & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").EnduserProblem & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"enduser_problems", import("@tellescope/types-models").EnduserProblem & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useEnduserMedications: (options?: HookOptions<import("@tellescope/types-models").EnduserMedication & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").EnduserMedication & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"enduser_medications", import("@tellescope/types-models").EnduserMedication & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useEnduserOrders: (options?: HookOptions<import("@tellescope/types-models").EnduserOrder & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").EnduserOrder & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"enduser_orders", import("@tellescope/types-models").EnduserOrder & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useIntegrationLogs: (options?: HookOptions<import("@tellescope/types-models").IntegrationLog & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").IntegrationLog & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"integration_logs", import("@tellescope/types-models").IntegrationLog & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useWebhookLogs: (options?: HookOptions<import("@tellescope/types-models").WebhookLog & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").WebhookLog & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"webhook_logs", import("@tellescope/types-models").WebhookLog & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useFormGroups: (options?: HookOptions<import("@tellescope/types-models").FormGroup & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").FormGroup & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"form_groups", import("@tellescope/types-models").FormGroup & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useFlowchartNotes: (options?: HookOptions<import("@tellescope/types-models").FlowchartNote & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").FlowchartNote & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"flowchart_notes", import("@tellescope/types-models").FlowchartNote & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useEnduserEncounters: (options?: HookOptions<import("@tellescope/types-models").EnduserEncounter & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").EnduserEncounter & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"enduser_encounters", import("@tellescope/types-models").EnduserEncounter & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useVitalConfigurations: (options?: HookOptions<import("@tellescope/types-models").VitalConfiguration & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").VitalConfiguration & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"vital_configurations", import("@tellescope/types-models").VitalConfiguration & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useCalendarEvents: (options?: HookOptions<import("@tellescope/types-models").CalendarEvent & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").CalendarEvent & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"calendar_events", import("@tellescope/types-models").CalendarEvent & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useEngagementEvents: (options?: HookOptions<import("@tellescope/types-models").EngagementEvent & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").EngagementEvent & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"engagement_events", import("@tellescope/types-models").EngagementEvent & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useGroupMMSConversations: (options?: HookOptions<import("@tellescope/types-models").GroupMMSConversation & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").GroupMMSConversation & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"group_mms_conversations", import("@tellescope/types-models").GroupMMSConversation & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useEnduserProfileViews: (options?: HookOptions<import("@tellescope/types-models").EnduserProfileView & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").EnduserProfileView & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"enduser_profile_views", import("@tellescope/types-models").EnduserProfileView & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useCallHoldQueues: (options?: HookOptions<import("@tellescope/types-models").CallHoldQueue & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").CallHoldQueue & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"call_hold_queues", import("@tellescope/types-models").CallHoldQueue & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useTicketQueues: (options?: HookOptions<import("@tellescope/types-models").TicketQueue & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").TicketQueue & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"ticket_queues", import("@tellescope/types-models").TicketQueue & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useConfigurations: (options?: HookOptions<import("@tellescope/types-models").Configuration & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").Configuration & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"configurations", import("@tellescope/types-models").Configuration & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const usePhoneTrees: (options?: HookOptions<import("@tellescope/types-models").PhoneTree & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").PhoneTree & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"phone_trees", import("@tellescope/types-models").PhoneTree & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useAutomationTriggers: (options?: HookOptions<import("@tellescope/types-models").AutomationTrigger & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").AutomationTrigger & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"automation_triggers", import("@tellescope/types-models").AutomationTrigger & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useAutomatedActions: (options?: HookOptions<import("@tellescope/types-models").AutomatedAction & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").AutomatedAction & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"automated_actions", import("@tellescope/types-models").AutomatedAction & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useEmails: (options?: HookOptions<import("@tellescope/types-models").Email & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").Email & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"emails", import("@tellescope/types-models").Email & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useSmsMessages: (options?: HookOptions<import("@tellescope/types-models").SMSMessage & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").SMSMessage & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"sms_messages", import("@tellescope/types-models").SMSMessage & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useNotifications: (options?: HookOptions<import("@tellescope/types-models").UserNotification & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").UserNotification & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"user_notifications", import("@tellescope/types-models").UserNotification & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useUserLogs: (options?: HookOptions<import("@tellescope/types-models").UserLog & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").UserLog & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"user_logs", import("@tellescope/types-models").UserLog & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useAnalyticsFrames: (options?: HookOptions<import("@tellescope/types-models").AnalyticsFrame & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").AnalyticsFrame & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"analytics_frames", import("@tellescope/types-models").AnalyticsFrame & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useEnduserCustomTypes: (options?: HookOptions<import("@tellescope/types-models").EnduserCustomType & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").EnduserCustomType & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"enduser_custom_types", import("@tellescope/types-models").EnduserCustomType & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useChatRooms: (options?: HookOptions<import("@tellescope/types-models").ChatRoom & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").ChatRoom & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"chat_rooms", import("@tellescope/types-models").ChatRoom & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useChats: (roomId?: string, options?: HookOptions<import("@tellescope/types-models").ChatMessage & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").ChatMessage & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"chats", import("@tellescope/types-models").ChatMessage & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useEndusers: (options?: HookOptions<import("@tellescope/types-models").Enduser & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").Enduser & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"endusers", import("@tellescope/types-models").Enduser & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useTickets: (options?: HookOptions<import("@tellescope/types-models").Ticket & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").Ticket & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"tickets", import("@tellescope/types-models").Ticket & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useMeetings: (options?: HookOptions<import("@tellescope/types-models").Meeting & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").Meeting & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"meetings", import("@tellescope/types-models").Meeting & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useFiles: (options?: HookOptions<import("@tellescope/types-models").File & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").File & {
    id: string;
    createdAt: Date;
}, Partial<import("@tellescope/types-models").File & {
    id: string;
    createdAt: Date;
}>>;
export declare const useJourneys: (options?: HookOptions<import("@tellescope/types-models").Journey & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").Journey & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"journeys", import("@tellescope/types-models").Journey & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useUsers: (options?: HookOptions<import("@tellescope/types-models").User & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").User & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"users", import("@tellescope/types-models").User & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useAutomationSteps: (options?: HookOptions<import("@tellescope/types-models").AutomationStep & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").AutomationStep & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"automation_steps", import("@tellescope/types-models").AutomationStep & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useNotes: (options?: HookOptions<import("@tellescope/types-models").Note & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").Note & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"notes", import("@tellescope/types-models").Note & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useAvailabilityBlocks: (options?: HookOptions<import("@tellescope/types-models").AvailabilityBlock & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").AvailabilityBlock & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"availability_blocks", import("@tellescope/types-models").AvailabilityBlock & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useTemplates: (options?: HookOptions<import("@tellescope/types-models").MessageTemplate & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").MessageTemplate & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"templates", import("@tellescope/types-models").MessageTemplate & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useForms: (options?: HookOptions<import("@tellescope/types-models").Form & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").Form & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"forms", import("@tellescope/types-models").Form & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useFormFields: (options?: HookOptions<import("@tellescope/types-models").FormField & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").FormField & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"form_fields", import("@tellescope/types-models").FormField & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useFormResponses: (options?: HookOptions<import("@tellescope/types-models").FormResponse & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").FormResponse & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"form_responses", import("@tellescope/types-models").FormResponse & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
/** @deprecated */
export declare const useUserDisplayInfo: (options?: HookOptions<UserDisplayInfo>) => ListStateReturnType<UserDisplayInfo, Partial<UserDisplayInfo>>;
export declare const useEnduserObservations: (options?: HookOptions<import("@tellescope/types-models").EnduserObservation & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").EnduserObservation & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"enduser_observations", import("@tellescope/types-models").EnduserObservation & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useManagedContentRecords: (options?: HookOptions<import("@tellescope/types-models").ManagedContentRecord & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").ManagedContentRecord & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"managed_content_records", import("@tellescope/types-models").ManagedContentRecord & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useManagedContentRecordAssignments: (options?: HookOptions<import("@tellescope/types-models").ManagedContentRecordAssignment & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").ManagedContentRecordAssignment & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"managed_content_record_assignments", import("@tellescope/types-models").ManagedContentRecordAssignment & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useAssignedManagedContentRecords: () => LoadedData<(import("@tellescope/types-models").ManagedContentRecord & {
    id: string;
    createdAt: Date;
})[]>;
export declare const useForums: (options?: HookOptions<import("@tellescope/types-models").Forum & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").Forum & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"forums", import("@tellescope/types-models").Forum & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useForumPosts: (options?: HookOptions<import("@tellescope/types-models").ForumPost & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").ForumPost & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"forum_posts", import("@tellescope/types-models").ForumPost & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const usePostComments: (options?: HookOptions<import("@tellescope/types-models").PostComment & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").PostComment & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"post_comments", import("@tellescope/types-models").PostComment & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const usePostLikes: (options?: HookOptions<import("@tellescope/types-models").PostLike & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").PostLike & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"post_likes", import("@tellescope/types-models").PostLike & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useCommentLikes: (options?: HookOptions<import("@tellescope/types-models").CommentLike & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").CommentLike & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"comment_likes", import("@tellescope/types-models").CommentLike & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useCalendarEventRSVPs: (options?: HookOptions<import("@tellescope/types-models").CalendarEventRSVP & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").CalendarEventRSVP & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"calendar_event_RSVPs", import("@tellescope/types-models").CalendarEventRSVP & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useRoleBasedAccessPermissions: (options?: HookOptions<import("@tellescope/types-models").Organization & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").RoleBasedAccessPermission & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"role_based_access_permissions", import("@tellescope/types-models").RoleBasedAccessPermission & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useTicketThreads: (options?: HookOptions<import("@tellescope/types-models").TicketThread & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").TicketThread & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"ticket_threads", import("@tellescope/types-models").TicketThread & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useTicketThreadComments: (options?: HookOptions<import("@tellescope/types-models").TicketThreadComment & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").TicketThreadComment & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"ticket_thread_comments", import("@tellescope/types-models").TicketThreadComment & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useSuperbills: (options?: HookOptions<import("@tellescope/types-models").Superbill & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").Superbill & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"superbills", import("@tellescope/types-models").Superbill & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useSuperbillProviders: (options?: HookOptions<import("@tellescope/types-models").SuperbillProvider & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").SuperbillProvider & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"superbill_providers", import("@tellescope/types-models").SuperbillProvider & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useTableViews: (options?: HookOptions<import("@tellescope/types-models").TableView & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").TableView & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"table_views", import("@tellescope/types-models").TableView & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useEmailSyncDenials: (options?: HookOptions<import("@tellescope/types-models").EmailSyncDenial & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").EmailSyncDenial & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"email_sync_denials", import("@tellescope/types-models").EmailSyncDenial & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const usePhoneCalls: (options?: HookOptions<import("@tellescope/types-models").PhoneCall & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").PhoneCall & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"phone_calls", import("@tellescope/types-models").PhoneCall & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useOrganizations: (options?: HookOptions<import("@tellescope/types-models").Organization & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").Organization & {
    id: string;
    createdAt: Date;
}, Partial<import("@tellescope/types-models").Organization & {
    id: string;
    createdAt: Date;
}>>;
export declare const useOrganization: (options?: HookOptions<import("@tellescope/types-models").Organization & {
    id: string;
    createdAt: Date;
}>) => readonly [LoadedData<import("@tellescope/types-models").Organization & {
    id: string;
    createdAt: Date;
}>, ListUpdateMethods<import("@tellescope/types-models").Organization & {
    id: string;
    createdAt: Date;
}, Partial<import("@tellescope/types-models").Organization & {
    id: string;
    createdAt: Date;
}>>];
export declare const useIntegrations: (options?: HookOptions<import("@tellescope/types-models").Integration & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").Integration & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"integrations", import("@tellescope/types-models").Integration & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const usePortalCustomizations: (options?: HookOptions<import("@tellescope/types-models").PortalCustomization & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").PortalCustomization & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"portal_customizations", import("@tellescope/types-models").PortalCustomization & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useCarePlans: (options?: HookOptions<import("@tellescope/types-models").CarePlan & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").CarePlan & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"care_plans", import("@tellescope/types-models").CarePlan & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useEnduserTasks: (options?: HookOptions<import("@tellescope/types-models").EnduserTask & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").EnduserTask & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"enduser_tasks", import("@tellescope/types-models").EnduserTask & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useCalendarEventTemplates: (options?: HookOptions<import("@tellescope/types-models").CalendarEventTemplate & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").CalendarEventTemplate & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"calendar_event_templates", import("@tellescope/types-models").CalendarEventTemplate & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useAppointmentBookingPages: (options?: HookOptions<import("@tellescope/types-models").AppointmentBookingPage & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").AppointmentBookingPage & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"appointment_booking_pages", import("@tellescope/types-models").AppointmentBookingPage & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useEnduserViews: (options?: HookOptions<import("@tellescope/types-models").EnduserView & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").EnduserView & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"enduser_views", import("@tellescope/types-models").EnduserView & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useBackgroundErrors: (options?: HookOptions<import("@tellescope/types-models").BackgroundError & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").BackgroundError & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"background_errors", import("@tellescope/types-models").BackgroundError & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useAppointmentLocations: (options?: HookOptions<import("@tellescope/types-models").AppointmentLocation & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").AppointmentLocation & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"appointment_locations", import("@tellescope/types-models").AppointmentLocation & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useDatabases: (options?: HookOptions<import("@tellescope/types-models").Database & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").Database & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"databases", import("@tellescope/types-models").Database & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useDatabaseRecords: (options?: HookOptions<import("@tellescope/types-models").DatabaseRecord & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").DatabaseRecord & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"database_records", import("@tellescope/types-models").DatabaseRecord & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useProducts: (options?: HookOptions<import("@tellescope/types-models").Product & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").Product & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"products", import("@tellescope/types-models").Product & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const usePurchases: (options?: HookOptions<import("@tellescope/types-models").Purchase & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").Purchase & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"purchases", import("@tellescope/types-models").Purchase & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const usePurchaseCredits: (options?: HookOptions<import("@tellescope/types-models").PurchaseCredit & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").PurchaseCredit & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"purchase_credits", import("@tellescope/types-models").PurchaseCredit & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const useBlockedPhones: (options?: HookOptions<import("@tellescope/types-models").BlockedPhone & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").BlockedPhone & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"blocked_phones", import("@tellescope/types-models").BlockedPhone & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export declare const usePrescriptionRoutes: (options?: HookOptions<import("@tellescope/types-models").PrescriptionRoute & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").PrescriptionRoute & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"prescription_routes", import("@tellescope/types-models").PrescriptionRoute & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
interface LoadEventOptions {
    userId?: string;
    userIds?: string[];
    from?: Date;
    limit?: number;
}
export declare const useCalendarEventsForUser: (options?: HookOptions<import("@tellescope/types-models").CalendarEvent & {
    id: string;
    createdAt: Date;
}> & LoadEventOptions) => readonly [LoadedData<(import("@tellescope/types-models").CalendarEvent & {
    id: string;
    createdAt: Date;
})[]>, {
    readonly loadEvents: (options?: LoadEventOptions & {
        to?: Date;
    }) => Promise<void>;
    readonly filtered: (filter: (value: import("@tellescope/types-models").CalendarEvent & {
        id: string;
        createdAt: Date;
    }) => boolean) => LoadedData<(import("@tellescope/types-models").CalendarEvent & {
        id: string;
        createdAt: Date;
    })[]>;
}];
export declare const useWaitlists: (options?: HookOptions<import("@tellescope/types-models").Waitlist & {
    id: string;
    createdAt: Date;
}>) => ListStateReturnType<import("@tellescope/types-models").Waitlist & {
    id: string;
    createdAt: Date;
}, import("@tellescope/types-client").CreateFields<"waitlists", import("@tellescope/types-models").Waitlist & {
    id: string;
    createdAt: Date;
}> & {
    sharedWithOrganizations?: string[][] | undefined;
    _overrideUnique?: boolean | undefined;
}>;
export {};
//# sourceMappingURL=state.d.ts.map