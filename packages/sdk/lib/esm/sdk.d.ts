import { CustomActions, extractFields, PublicActions } from "@tellescope/schema";
import { UserSession, ReadFilter, WebhookSubscriptionsType, Attendee, SearchOptions, AccessPermissions, OrganizationLimits, SortBy, AnalyticsQuery, UserUIRestrictions, ModelName, CustomDashboardView, DataSyncRecord } from "@tellescope/types-models";
import { ClientModelForName, ClientModelForName_readonly, ClientModelForName_required, ClientModelForName_updatesDisabled, ChatRoom, Enduser, Meeting, CreateFields, User } from "@tellescope/types-client";
import { CustomUpdateOptions, SortOption, UserIdentity, FileDetails, ReactNativeFile, SessionType } from "@tellescope/types-utilities";
import { Session as SessionManager, SessionOptions } from "./session";
export * from "./public";
export * from "./enduser";
export declare const load_all_pages: <T extends {
    id: string;
}>(load: LoadFunction<T>, o?: (LoadFunctionArguments<T> & {
    maxPages?: number | undefined;
}) | undefined) => Promise<T[]>;
export interface LoadFunctionArguments<T> {
    lastId?: string;
    limit?: number;
    sort?: SortOption;
    sortBy?: SortBy;
    from?: Date | number;
    to?: Date;
    fromToField?: string;
    fromUpdated?: Date;
    toUpdated?: Date;
    threadKey?: string;
    filter?: ReadFilter<T>;
    analyticsQuery?: AnalyticsQuery;
    search?: SearchOptions;
    ids?: string[];
    returnCount?: boolean;
    mdbFilter?: any;
}
export type LoadFunction<T> = (o?: LoadFunctionArguments<T>) => Promise<T[]>;
export interface APIQuery<N extends keyof ClientModelForName, T = ClientModelForName[N], CREATE = CreateFields<N>, UPDATE = Omit<Partial<T>, keyof (ClientModelForName_readonly[N] & ClientModelForName_updatesDisabled[N])> & {
    organizationIds?: string[];
    sharedWithOrganizations?: string[][];
}> {
    createOne: (t: CREATE & {
        sharedWithOrganizations?: string[][];
        _overrideUnique?: boolean;
    }) => Promise<T>;
    createSome: (ts: CREATE[], o?: {
        _overrideUnique?: boolean;
    }) => Promise<{
        created: T[];
        errors: object[];
    }>;
    getOne: (argument: string | ReadFilter<T>, mdbFilter?: any) => Promise<T>;
    getSome: LoadFunction<T>;
    getByIds: ({ ids }: {
        ids: string[];
    }) => Promise<{
        matches: T[];
    }>;
    updateOne: (id: string, updates: UPDATE, options?: CustomUpdateOptions, _overrideUnique?: boolean) => Promise<T>;
    deleteOne: (id: string) => Promise<void>;
}
export declare const reload_record: <N extends keyof import("@tellescope/types-models").ModelForName>(r: {
    inbox_threads: import("@tellescope/types-models").InboxThread & {
        id: string;
        createdAt: Date;
    };
    ai_conversations: import("@tellescope/types-models").AIConversation & {
        id: string;
        createdAt: Date;
    };
    waitlists: import("@tellescope/types-models").Waitlist & {
        id: string;
        createdAt: Date;
    };
    agent_records: import("@tellescope/types-models").AgentRecord & {
        id: string;
        createdAt: Date;
    };
    enduser_eligibility_results: import("@tellescope/types-models").EnduserEligibilityResult & {
        id: string;
        createdAt: Date;
    };
    integration_logs: import("@tellescope/types-models").IntegrationLog & {
        id: string;
        createdAt: Date;
    };
    allergy_codes: import("@tellescope/types-models").AllergyCode & {
        id: string;
        createdAt: Date;
    };
    diagnosis_codes: import("@tellescope/types-models").DiagnosisCode & {
        id: string;
        createdAt: Date;
    };
    suggested_contacts: import("@tellescope/types-models").SuggestedContact & {
        id: string;
        createdAt: Date;
    };
    call_hold_queues: import("@tellescope/types-models").CallHoldQueue & {
        id: string;
        createdAt: Date;
    };
    fax_logs: import("@tellescope/types-models").FaxLog & {
        id: string;
        createdAt: Date;
    };
    message_template_snippets: import("@tellescope/types-models").MessageTemplateSnippet & {
        id: string;
        createdAt: Date;
    };
    portal_brandings: import("@tellescope/types-models").PortalBranding & {
        id: string;
        createdAt: Date;
    };
    form_groups: import("@tellescope/types-models").FormGroup & {
        id: string;
        createdAt: Date;
    };
    webhook_logs: import("@tellescope/types-models").WebhookLog & {
        id: string;
        createdAt: Date;
    };
    flowchart_notes: import("@tellescope/types-models").FlowchartNote & {
        id: string;
        createdAt: Date;
    };
    enduser_problems: import("@tellescope/types-models").EnduserProblem & {
        id: string;
        createdAt: Date;
    };
    prescription_routes: import("@tellescope/types-models").PrescriptionRoute & {
        id: string;
        createdAt: Date;
    };
    blocked_phones: import("@tellescope/types-models").BlockedPhone & {
        id: string;
        createdAt: Date;
    };
    vital_configurations: import("@tellescope/types-models").VitalConfiguration & {
        id: string;
        createdAt: Date;
    };
    enduser_encounters: import("@tellescope/types-models").EnduserEncounter & {
        id: string;
        createdAt: Date;
    };
    enduser_orders: import("@tellescope/types-models").EnduserOrder & {
        id: string;
        createdAt: Date;
    };
    group_mms_conversations: import("@tellescope/types-models").GroupMMSConversation & {
        id: string;
        createdAt: Date;
    };
    ticket_queues: import("@tellescope/types-models").TicketQueue & {
        id: string;
        createdAt: Date;
    };
    configurations: import("@tellescope/types-models").Configuration & {
        id: string;
        createdAt: Date;
    };
    ticket_threads: import("@tellescope/types-models").TicketThread & {
        id: string;
        createdAt: Date;
    };
    ticket_thread_comments: import("@tellescope/types-models").TicketThreadComment & {
        id: string;
        createdAt: Date;
    };
    enduser_custom_types: import("@tellescope/types-models").EnduserCustomType & {
        id: string;
        createdAt: Date;
    };
    phone_trees: import("@tellescope/types-models").PhoneTree & {
        id: string;
        createdAt: Date;
    };
    enduser_medications: import("@tellescope/types-models").EnduserMedication & {
        id: string;
        createdAt: Date;
    };
    superbill_providers: import("@tellescope/types-models").SuperbillProvider & {
        id: string;
        createdAt: Date;
    };
    superbills: import("@tellescope/types-models").Superbill & {
        id: string;
        createdAt: Date;
    };
    automation_triggers: import("@tellescope/types-models").AutomationTrigger & {
        id: string;
        createdAt: Date;
    };
    background_errors: import("@tellescope/types-models").BackgroundError & {
        id: string;
        createdAt: Date;
    };
    enduser_views: import("@tellescope/types-models").EnduserView & {
        id: string;
        createdAt: Date;
    };
    availability_blocks: import("@tellescope/types-models").AvailabilityBlock & {
        id: string;
        createdAt: Date;
    };
    analytics_frames: import("@tellescope/types-models").AnalyticsFrame & {
        id: string;
        createdAt: Date;
    };
    endusers: import("@tellescope/types-models").Enduser & {
        id: string;
        createdAt: Date;
    };
    engagement_events: import("@tellescope/types-models").EngagementEvent & {
        id: string;
        createdAt: Date;
    };
    journeys: import("@tellescope/types-models").Journey & {
        id: string;
        createdAt: Date;
    };
    api_keys: import("@tellescope/types-models").APIKey & {
        id: string;
        createdAt: Date;
    };
    emails: import("@tellescope/types-models").Email & {
        id: string;
        createdAt: Date;
    };
    sms_messages: import("@tellescope/types-models").SMSMessage & {
        id: string;
        createdAt: Date;
    };
    chat_rooms: import("@tellescope/types-models").ChatRoom & {
        id: string;
        createdAt: Date;
    };
    chats: import("@tellescope/types-models").ChatMessage & {
        id: string;
        createdAt: Date;
    };
    users: import("@tellescope/types-models").User & {
        id: string;
        createdAt: Date;
    };
    templates: import("@tellescope/types-models").MessageTemplate & {
        id: string;
        createdAt: Date;
    };
    files: import("@tellescope/types-models").File & {
        id: string;
        createdAt: Date;
    };
    tickets: import("@tellescope/types-models").Ticket & {
        id: string;
        createdAt: Date;
    };
    meetings: import("@tellescope/types-models").Meeting & {
        id: string;
        createdAt: Date;
    };
    notes: import("@tellescope/types-models").Note & {
        id: string;
        createdAt: Date;
    };
    forms: import("@tellescope/types-models").Form & {
        id: string;
        createdAt: Date;
    };
    form_fields: import("@tellescope/types-models").FormField & {
        id: string;
        createdAt: Date;
    };
    form_responses: import("@tellescope/types-models").FormResponse & {
        id: string;
        createdAt: Date;
    };
    calendar_events: import("@tellescope/types-models").CalendarEvent & {
        id: string;
        createdAt: Date;
    };
    calendar_event_templates: import("@tellescope/types-models").CalendarEventTemplate & {
        id: string;
        createdAt: Date;
    };
    calendar_event_RSVPs: import("@tellescope/types-models").CalendarEventRSVP & {
        id: string;
        createdAt: Date;
    };
    automation_steps: import("@tellescope/types-models").AutomationStep & {
        id: string;
        createdAt: Date;
    };
    automated_actions: import("@tellescope/types-models").AutomatedAction & {
        id: string;
        createdAt: Date;
    };
    webhooks: import("@tellescope/types-models").WebHook & {
        id: string;
        createdAt: Date;
    };
    user_logs: import("@tellescope/types-models").UserLog & {
        id: string;
        createdAt: Date;
    };
    user_notifications: import("@tellescope/types-models").UserNotification & {
        id: string;
        createdAt: Date;
    };
    enduser_status_updates: import("@tellescope/types-models").EnduserStatusUpdate & {
        id: string;
        createdAt: Date;
    };
    enduser_observations: import("@tellescope/types-models").EnduserObservation & {
        id: string;
        createdAt: Date;
    };
    managed_content_records: import("@tellescope/types-models").ManagedContentRecord & {
        id: string;
        createdAt: Date;
    };
    managed_content_record_assignments: import("@tellescope/types-models").ManagedContentRecordAssignment & {
        id: string;
        createdAt: Date;
    };
    forums: import("@tellescope/types-models").Forum & {
        id: string;
        createdAt: Date;
    };
    forum_posts: import("@tellescope/types-models").ForumPost & {
        id: string;
        createdAt: Date;
    };
    post_likes: import("@tellescope/types-models").PostLike & {
        id: string;
        createdAt: Date;
    };
    comment_likes: import("@tellescope/types-models").CommentLike & {
        id: string;
        createdAt: Date;
    };
    post_comments: import("@tellescope/types-models").PostComment & {
        id: string;
        createdAt: Date;
    };
    organizations: import("@tellescope/types-models").Organization & {
        id: string;
        createdAt: Date;
    };
    integrations: import("@tellescope/types-models").Integration & {
        id: string;
        createdAt: Date;
    };
    databases: import("@tellescope/types-models").Database & {
        id: string;
        createdAt: Date;
    };
    database_records: import("@tellescope/types-models").DatabaseRecord & {
        id: string;
        createdAt: Date;
    };
    portal_customizations: import("@tellescope/types-models").PortalCustomization & {
        id: string;
        createdAt: Date;
    };
    enduser_tasks: import("@tellescope/types-models").EnduserTask & {
        id: string;
        createdAt: Date;
    };
    care_plans: import("@tellescope/types-models").CarePlan & {
        id: string;
        createdAt: Date;
    };
    role_based_access_permissions: import("@tellescope/types-models").RoleBasedAccessPermission & {
        id: string;
        createdAt: Date;
    };
    appointment_booking_pages: import("@tellescope/types-models").AppointmentBookingPage & {
        id: string;
        createdAt: Date;
    };
    appointment_locations: import("@tellescope/types-models").AppointmentLocation & {
        id: string;
        createdAt: Date;
    };
    products: import("@tellescope/types-models").Product & {
        id: string;
        createdAt: Date;
    };
    purchases: import("@tellescope/types-models").Purchase & {
        id: string;
        createdAt: Date;
    };
    purchase_credits: import("@tellescope/types-models").PurchaseCredit & {
        id: string;
        createdAt: Date;
    };
    phone_calls: import("@tellescope/types-models").PhoneCall & {
        id: string;
        createdAt: Date;
    };
    enduser_profile_views: import("@tellescope/types-models").EnduserProfileView & {
        id: string;
        createdAt: Date;
    };
    table_views: import("@tellescope/types-models").TableView & {
        id: string;
        createdAt: Date;
    };
    email_sync_denials: import("@tellescope/types-models").EmailSyncDenial & {
        id: string;
        createdAt: Date;
    };
}[N], reload: (argument: string | ReadFilter<{
    inbox_threads: import("@tellescope/types-models").InboxThread & {
        id: string;
        createdAt: Date;
    };
    ai_conversations: import("@tellescope/types-models").AIConversation & {
        id: string;
        createdAt: Date;
    };
    waitlists: import("@tellescope/types-models").Waitlist & {
        id: string;
        createdAt: Date;
    };
    agent_records: import("@tellescope/types-models").AgentRecord & {
        id: string;
        createdAt: Date;
    };
    enduser_eligibility_results: import("@tellescope/types-models").EnduserEligibilityResult & {
        id: string;
        createdAt: Date;
    };
    integration_logs: import("@tellescope/types-models").IntegrationLog & {
        id: string;
        createdAt: Date;
    };
    allergy_codes: import("@tellescope/types-models").AllergyCode & {
        id: string;
        createdAt: Date;
    };
    diagnosis_codes: import("@tellescope/types-models").DiagnosisCode & {
        id: string;
        createdAt: Date;
    };
    suggested_contacts: import("@tellescope/types-models").SuggestedContact & {
        id: string;
        createdAt: Date;
    };
    call_hold_queues: import("@tellescope/types-models").CallHoldQueue & {
        id: string;
        createdAt: Date;
    };
    fax_logs: import("@tellescope/types-models").FaxLog & {
        id: string;
        createdAt: Date;
    };
    message_template_snippets: import("@tellescope/types-models").MessageTemplateSnippet & {
        id: string;
        createdAt: Date;
    };
    portal_brandings: import("@tellescope/types-models").PortalBranding & {
        id: string;
        createdAt: Date;
    };
    form_groups: import("@tellescope/types-models").FormGroup & {
        id: string;
        createdAt: Date;
    };
    webhook_logs: import("@tellescope/types-models").WebhookLog & {
        id: string;
        createdAt: Date;
    };
    flowchart_notes: import("@tellescope/types-models").FlowchartNote & {
        id: string;
        createdAt: Date;
    };
    enduser_problems: import("@tellescope/types-models").EnduserProblem & {
        id: string;
        createdAt: Date;
    };
    prescription_routes: import("@tellescope/types-models").PrescriptionRoute & {
        id: string;
        createdAt: Date;
    };
    blocked_phones: import("@tellescope/types-models").BlockedPhone & {
        id: string;
        createdAt: Date;
    };
    vital_configurations: import("@tellescope/types-models").VitalConfiguration & {
        id: string;
        createdAt: Date;
    };
    enduser_encounters: import("@tellescope/types-models").EnduserEncounter & {
        id: string;
        createdAt: Date;
    };
    enduser_orders: import("@tellescope/types-models").EnduserOrder & {
        id: string;
        createdAt: Date;
    };
    group_mms_conversations: import("@tellescope/types-models").GroupMMSConversation & {
        id: string;
        createdAt: Date;
    };
    ticket_queues: import("@tellescope/types-models").TicketQueue & {
        id: string;
        createdAt: Date;
    };
    configurations: import("@tellescope/types-models").Configuration & {
        id: string;
        createdAt: Date;
    };
    ticket_threads: import("@tellescope/types-models").TicketThread & {
        id: string;
        createdAt: Date;
    };
    ticket_thread_comments: import("@tellescope/types-models").TicketThreadComment & {
        id: string;
        createdAt: Date;
    };
    enduser_custom_types: import("@tellescope/types-models").EnduserCustomType & {
        id: string;
        createdAt: Date;
    };
    phone_trees: import("@tellescope/types-models").PhoneTree & {
        id: string;
        createdAt: Date;
    };
    enduser_medications: import("@tellescope/types-models").EnduserMedication & {
        id: string;
        createdAt: Date;
    };
    superbill_providers: import("@tellescope/types-models").SuperbillProvider & {
        id: string;
        createdAt: Date;
    };
    superbills: import("@tellescope/types-models").Superbill & {
        id: string;
        createdAt: Date;
    };
    automation_triggers: import("@tellescope/types-models").AutomationTrigger & {
        id: string;
        createdAt: Date;
    };
    background_errors: import("@tellescope/types-models").BackgroundError & {
        id: string;
        createdAt: Date;
    };
    enduser_views: import("@tellescope/types-models").EnduserView & {
        id: string;
        createdAt: Date;
    };
    availability_blocks: import("@tellescope/types-models").AvailabilityBlock & {
        id: string;
        createdAt: Date;
    };
    analytics_frames: import("@tellescope/types-models").AnalyticsFrame & {
        id: string;
        createdAt: Date;
    };
    endusers: import("@tellescope/types-models").Enduser & {
        id: string;
        createdAt: Date;
    };
    engagement_events: import("@tellescope/types-models").EngagementEvent & {
        id: string;
        createdAt: Date;
    };
    journeys: import("@tellescope/types-models").Journey & {
        id: string;
        createdAt: Date;
    };
    api_keys: import("@tellescope/types-models").APIKey & {
        id: string;
        createdAt: Date;
    };
    emails: import("@tellescope/types-models").Email & {
        id: string;
        createdAt: Date;
    };
    sms_messages: import("@tellescope/types-models").SMSMessage & {
        id: string;
        createdAt: Date;
    };
    chat_rooms: import("@tellescope/types-models").ChatRoom & {
        id: string;
        createdAt: Date;
    };
    chats: import("@tellescope/types-models").ChatMessage & {
        id: string;
        createdAt: Date;
    };
    users: import("@tellescope/types-models").User & {
        id: string;
        createdAt: Date;
    };
    templates: import("@tellescope/types-models").MessageTemplate & {
        id: string;
        createdAt: Date;
    };
    files: import("@tellescope/types-models").File & {
        id: string;
        createdAt: Date;
    };
    tickets: import("@tellescope/types-models").Ticket & {
        id: string;
        createdAt: Date;
    };
    meetings: import("@tellescope/types-models").Meeting & {
        id: string;
        createdAt: Date;
    };
    notes: import("@tellescope/types-models").Note & {
        id: string;
        createdAt: Date;
    };
    forms: import("@tellescope/types-models").Form & {
        id: string;
        createdAt: Date;
    };
    form_fields: import("@tellescope/types-models").FormField & {
        id: string;
        createdAt: Date;
    };
    form_responses: import("@tellescope/types-models").FormResponse & {
        id: string;
        createdAt: Date;
    };
    calendar_events: import("@tellescope/types-models").CalendarEvent & {
        id: string;
        createdAt: Date;
    };
    calendar_event_templates: import("@tellescope/types-models").CalendarEventTemplate & {
        id: string;
        createdAt: Date;
    };
    calendar_event_RSVPs: import("@tellescope/types-models").CalendarEventRSVP & {
        id: string;
        createdAt: Date;
    };
    automation_steps: import("@tellescope/types-models").AutomationStep & {
        id: string;
        createdAt: Date;
    };
    automated_actions: import("@tellescope/types-models").AutomatedAction & {
        id: string;
        createdAt: Date;
    };
    webhooks: import("@tellescope/types-models").WebHook & {
        id: string;
        createdAt: Date;
    };
    user_logs: import("@tellescope/types-models").UserLog & {
        id: string;
        createdAt: Date;
    };
    user_notifications: import("@tellescope/types-models").UserNotification & {
        id: string;
        createdAt: Date;
    };
    enduser_status_updates: import("@tellescope/types-models").EnduserStatusUpdate & {
        id: string;
        createdAt: Date;
    };
    enduser_observations: import("@tellescope/types-models").EnduserObservation & {
        id: string;
        createdAt: Date;
    };
    managed_content_records: import("@tellescope/types-models").ManagedContentRecord & {
        id: string;
        createdAt: Date;
    };
    managed_content_record_assignments: import("@tellescope/types-models").ManagedContentRecordAssignment & {
        id: string;
        createdAt: Date;
    };
    forums: import("@tellescope/types-models").Forum & {
        id: string;
        createdAt: Date;
    };
    forum_posts: import("@tellescope/types-models").ForumPost & {
        id: string;
        createdAt: Date;
    };
    post_likes: import("@tellescope/types-models").PostLike & {
        id: string;
        createdAt: Date;
    };
    comment_likes: import("@tellescope/types-models").CommentLike & {
        id: string;
        createdAt: Date;
    };
    post_comments: import("@tellescope/types-models").PostComment & {
        id: string;
        createdAt: Date;
    };
    organizations: import("@tellescope/types-models").Organization & {
        id: string;
        createdAt: Date;
    };
    integrations: import("@tellescope/types-models").Integration & {
        id: string;
        createdAt: Date;
    };
    databases: import("@tellescope/types-models").Database & {
        id: string;
        createdAt: Date;
    };
    database_records: import("@tellescope/types-models").DatabaseRecord & {
        id: string;
        createdAt: Date;
    };
    portal_customizations: import("@tellescope/types-models").PortalCustomization & {
        id: string;
        createdAt: Date;
    };
    enduser_tasks: import("@tellescope/types-models").EnduserTask & {
        id: string;
        createdAt: Date;
    };
    care_plans: import("@tellescope/types-models").CarePlan & {
        id: string;
        createdAt: Date;
    };
    role_based_access_permissions: import("@tellescope/types-models").RoleBasedAccessPermission & {
        id: string;
        createdAt: Date;
    };
    appointment_booking_pages: import("@tellescope/types-models").AppointmentBookingPage & {
        id: string;
        createdAt: Date;
    };
    appointment_locations: import("@tellescope/types-models").AppointmentLocation & {
        id: string;
        createdAt: Date;
    };
    products: import("@tellescope/types-models").Product & {
        id: string;
        createdAt: Date;
    };
    purchases: import("@tellescope/types-models").Purchase & {
        id: string;
        createdAt: Date;
    };
    purchase_credits: import("@tellescope/types-models").PurchaseCredit & {
        id: string;
        createdAt: Date;
    };
    phone_calls: import("@tellescope/types-models").PhoneCall & {
        id: string;
        createdAt: Date;
    };
    enduser_profile_views: import("@tellescope/types-models").EnduserProfileView & {
        id: string;
        createdAt: Date;
    };
    table_views: import("@tellescope/types-models").TableView & {
        id: string;
        createdAt: Date;
    };
    email_sync_denials: import("@tellescope/types-models").EmailSyncDenial & {
        id: string;
        createdAt: Date;
    };
}[N]>, mdbFilter?: any) => Promise<{
    inbox_threads: import("@tellescope/types-models").InboxThread & {
        id: string;
        createdAt: Date;
    };
    ai_conversations: import("@tellescope/types-models").AIConversation & {
        id: string;
        createdAt: Date;
    };
    waitlists: import("@tellescope/types-models").Waitlist & {
        id: string;
        createdAt: Date;
    };
    agent_records: import("@tellescope/types-models").AgentRecord & {
        id: string;
        createdAt: Date;
    };
    enduser_eligibility_results: import("@tellescope/types-models").EnduserEligibilityResult & {
        id: string;
        createdAt: Date;
    };
    integration_logs: import("@tellescope/types-models").IntegrationLog & {
        id: string;
        createdAt: Date;
    };
    allergy_codes: import("@tellescope/types-models").AllergyCode & {
        id: string;
        createdAt: Date;
    };
    diagnosis_codes: import("@tellescope/types-models").DiagnosisCode & {
        id: string;
        createdAt: Date;
    };
    suggested_contacts: import("@tellescope/types-models").SuggestedContact & {
        id: string;
        createdAt: Date;
    };
    call_hold_queues: import("@tellescope/types-models").CallHoldQueue & {
        id: string;
        createdAt: Date;
    };
    fax_logs: import("@tellescope/types-models").FaxLog & {
        id: string;
        createdAt: Date;
    };
    message_template_snippets: import("@tellescope/types-models").MessageTemplateSnippet & {
        id: string;
        createdAt: Date;
    };
    portal_brandings: import("@tellescope/types-models").PortalBranding & {
        id: string;
        createdAt: Date;
    };
    form_groups: import("@tellescope/types-models").FormGroup & {
        id: string;
        createdAt: Date;
    };
    webhook_logs: import("@tellescope/types-models").WebhookLog & {
        id: string;
        createdAt: Date;
    };
    flowchart_notes: import("@tellescope/types-models").FlowchartNote & {
        id: string;
        createdAt: Date;
    };
    enduser_problems: import("@tellescope/types-models").EnduserProblem & {
        id: string;
        createdAt: Date;
    };
    prescription_routes: import("@tellescope/types-models").PrescriptionRoute & {
        id: string;
        createdAt: Date;
    };
    blocked_phones: import("@tellescope/types-models").BlockedPhone & {
        id: string;
        createdAt: Date;
    };
    vital_configurations: import("@tellescope/types-models").VitalConfiguration & {
        id: string;
        createdAt: Date;
    };
    enduser_encounters: import("@tellescope/types-models").EnduserEncounter & {
        id: string;
        createdAt: Date;
    };
    enduser_orders: import("@tellescope/types-models").EnduserOrder & {
        id: string;
        createdAt: Date;
    };
    group_mms_conversations: import("@tellescope/types-models").GroupMMSConversation & {
        id: string;
        createdAt: Date;
    };
    ticket_queues: import("@tellescope/types-models").TicketQueue & {
        id: string;
        createdAt: Date;
    };
    configurations: import("@tellescope/types-models").Configuration & {
        id: string;
        createdAt: Date;
    };
    ticket_threads: import("@tellescope/types-models").TicketThread & {
        id: string;
        createdAt: Date;
    };
    ticket_thread_comments: import("@tellescope/types-models").TicketThreadComment & {
        id: string;
        createdAt: Date;
    };
    enduser_custom_types: import("@tellescope/types-models").EnduserCustomType & {
        id: string;
        createdAt: Date;
    };
    phone_trees: import("@tellescope/types-models").PhoneTree & {
        id: string;
        createdAt: Date;
    };
    enduser_medications: import("@tellescope/types-models").EnduserMedication & {
        id: string;
        createdAt: Date;
    };
    superbill_providers: import("@tellescope/types-models").SuperbillProvider & {
        id: string;
        createdAt: Date;
    };
    superbills: import("@tellescope/types-models").Superbill & {
        id: string;
        createdAt: Date;
    };
    automation_triggers: import("@tellescope/types-models").AutomationTrigger & {
        id: string;
        createdAt: Date;
    };
    background_errors: import("@tellescope/types-models").BackgroundError & {
        id: string;
        createdAt: Date;
    };
    enduser_views: import("@tellescope/types-models").EnduserView & {
        id: string;
        createdAt: Date;
    };
    availability_blocks: import("@tellescope/types-models").AvailabilityBlock & {
        id: string;
        createdAt: Date;
    };
    analytics_frames: import("@tellescope/types-models").AnalyticsFrame & {
        id: string;
        createdAt: Date;
    };
    endusers: import("@tellescope/types-models").Enduser & {
        id: string;
        createdAt: Date;
    };
    engagement_events: import("@tellescope/types-models").EngagementEvent & {
        id: string;
        createdAt: Date;
    };
    journeys: import("@tellescope/types-models").Journey & {
        id: string;
        createdAt: Date;
    };
    api_keys: import("@tellescope/types-models").APIKey & {
        id: string;
        createdAt: Date;
    };
    emails: import("@tellescope/types-models").Email & {
        id: string;
        createdAt: Date;
    };
    sms_messages: import("@tellescope/types-models").SMSMessage & {
        id: string;
        createdAt: Date;
    };
    chat_rooms: import("@tellescope/types-models").ChatRoom & {
        id: string;
        createdAt: Date;
    };
    chats: import("@tellescope/types-models").ChatMessage & {
        id: string;
        createdAt: Date;
    };
    users: import("@tellescope/types-models").User & {
        id: string;
        createdAt: Date;
    };
    templates: import("@tellescope/types-models").MessageTemplate & {
        id: string;
        createdAt: Date;
    };
    files: import("@tellescope/types-models").File & {
        id: string;
        createdAt: Date;
    };
    tickets: import("@tellescope/types-models").Ticket & {
        id: string;
        createdAt: Date;
    };
    meetings: import("@tellescope/types-models").Meeting & {
        id: string;
        createdAt: Date;
    };
    notes: import("@tellescope/types-models").Note & {
        id: string;
        createdAt: Date;
    };
    forms: import("@tellescope/types-models").Form & {
        id: string;
        createdAt: Date;
    };
    form_fields: import("@tellescope/types-models").FormField & {
        id: string;
        createdAt: Date;
    };
    form_responses: import("@tellescope/types-models").FormResponse & {
        id: string;
        createdAt: Date;
    };
    calendar_events: import("@tellescope/types-models").CalendarEvent & {
        id: string;
        createdAt: Date;
    };
    calendar_event_templates: import("@tellescope/types-models").CalendarEventTemplate & {
        id: string;
        createdAt: Date;
    };
    calendar_event_RSVPs: import("@tellescope/types-models").CalendarEventRSVP & {
        id: string;
        createdAt: Date;
    };
    automation_steps: import("@tellescope/types-models").AutomationStep & {
        id: string;
        createdAt: Date;
    };
    automated_actions: import("@tellescope/types-models").AutomatedAction & {
        id: string;
        createdAt: Date;
    };
    webhooks: import("@tellescope/types-models").WebHook & {
        id: string;
        createdAt: Date;
    };
    user_logs: import("@tellescope/types-models").UserLog & {
        id: string;
        createdAt: Date;
    };
    user_notifications: import("@tellescope/types-models").UserNotification & {
        id: string;
        createdAt: Date;
    };
    enduser_status_updates: import("@tellescope/types-models").EnduserStatusUpdate & {
        id: string;
        createdAt: Date;
    };
    enduser_observations: import("@tellescope/types-models").EnduserObservation & {
        id: string;
        createdAt: Date;
    };
    managed_content_records: import("@tellescope/types-models").ManagedContentRecord & {
        id: string;
        createdAt: Date;
    };
    managed_content_record_assignments: import("@tellescope/types-models").ManagedContentRecordAssignment & {
        id: string;
        createdAt: Date;
    };
    forums: import("@tellescope/types-models").Forum & {
        id: string;
        createdAt: Date;
    };
    forum_posts: import("@tellescope/types-models").ForumPost & {
        id: string;
        createdAt: Date;
    };
    post_likes: import("@tellescope/types-models").PostLike & {
        id: string;
        createdAt: Date;
    };
    comment_likes: import("@tellescope/types-models").CommentLike & {
        id: string;
        createdAt: Date;
    };
    post_comments: import("@tellescope/types-models").PostComment & {
        id: string;
        createdAt: Date;
    };
    organizations: import("@tellescope/types-models").Organization & {
        id: string;
        createdAt: Date;
    };
    integrations: import("@tellescope/types-models").Integration & {
        id: string;
        createdAt: Date;
    };
    databases: import("@tellescope/types-models").Database & {
        id: string;
        createdAt: Date;
    };
    database_records: import("@tellescope/types-models").DatabaseRecord & {
        id: string;
        createdAt: Date;
    };
    portal_customizations: import("@tellescope/types-models").PortalCustomization & {
        id: string;
        createdAt: Date;
    };
    enduser_tasks: import("@tellescope/types-models").EnduserTask & {
        id: string;
        createdAt: Date;
    };
    care_plans: import("@tellescope/types-models").CarePlan & {
        id: string;
        createdAt: Date;
    };
    role_based_access_permissions: import("@tellescope/types-models").RoleBasedAccessPermission & {
        id: string;
        createdAt: Date;
    };
    appointment_booking_pages: import("@tellescope/types-models").AppointmentBookingPage & {
        id: string;
        createdAt: Date;
    };
    appointment_locations: import("@tellescope/types-models").AppointmentLocation & {
        id: string;
        createdAt: Date;
    };
    products: import("@tellescope/types-models").Product & {
        id: string;
        createdAt: Date;
    };
    purchases: import("@tellescope/types-models").Purchase & {
        id: string;
        createdAt: Date;
    };
    purchase_credits: import("@tellescope/types-models").PurchaseCredit & {
        id: string;
        createdAt: Date;
    };
    phone_calls: import("@tellescope/types-models").PhoneCall & {
        id: string;
        createdAt: Date;
    };
    enduser_profile_views: import("@tellescope/types-models").EnduserProfileView & {
        id: string;
        createdAt: Date;
    };
    table_views: import("@tellescope/types-models").TableView & {
        id: string;
        createdAt: Date;
    };
    email_sync_denials: import("@tellescope/types-models").EmailSyncDenial & {
        id: string;
        createdAt: Date;
    };
}[N]>, onLoad: (loaded: {
    inbox_threads: import("@tellescope/types-models").InboxThread & {
        id: string;
        createdAt: Date;
    };
    ai_conversations: import("@tellescope/types-models").AIConversation & {
        id: string;
        createdAt: Date;
    };
    waitlists: import("@tellescope/types-models").Waitlist & {
        id: string;
        createdAt: Date;
    };
    agent_records: import("@tellescope/types-models").AgentRecord & {
        id: string;
        createdAt: Date;
    };
    enduser_eligibility_results: import("@tellescope/types-models").EnduserEligibilityResult & {
        id: string;
        createdAt: Date;
    };
    integration_logs: import("@tellescope/types-models").IntegrationLog & {
        id: string;
        createdAt: Date;
    };
    allergy_codes: import("@tellescope/types-models").AllergyCode & {
        id: string;
        createdAt: Date;
    };
    diagnosis_codes: import("@tellescope/types-models").DiagnosisCode & {
        id: string;
        createdAt: Date;
    };
    suggested_contacts: import("@tellescope/types-models").SuggestedContact & {
        id: string;
        createdAt: Date;
    };
    call_hold_queues: import("@tellescope/types-models").CallHoldQueue & {
        id: string;
        createdAt: Date;
    };
    fax_logs: import("@tellescope/types-models").FaxLog & {
        id: string;
        createdAt: Date;
    };
    message_template_snippets: import("@tellescope/types-models").MessageTemplateSnippet & {
        id: string;
        createdAt: Date;
    };
    portal_brandings: import("@tellescope/types-models").PortalBranding & {
        id: string;
        createdAt: Date;
    };
    form_groups: import("@tellescope/types-models").FormGroup & {
        id: string;
        createdAt: Date;
    };
    webhook_logs: import("@tellescope/types-models").WebhookLog & {
        id: string;
        createdAt: Date;
    };
    flowchart_notes: import("@tellescope/types-models").FlowchartNote & {
        id: string;
        createdAt: Date;
    };
    enduser_problems: import("@tellescope/types-models").EnduserProblem & {
        id: string;
        createdAt: Date;
    };
    prescription_routes: import("@tellescope/types-models").PrescriptionRoute & {
        id: string;
        createdAt: Date;
    };
    blocked_phones: import("@tellescope/types-models").BlockedPhone & {
        id: string;
        createdAt: Date;
    };
    vital_configurations: import("@tellescope/types-models").VitalConfiguration & {
        id: string;
        createdAt: Date;
    };
    enduser_encounters: import("@tellescope/types-models").EnduserEncounter & {
        id: string;
        createdAt: Date;
    };
    enduser_orders: import("@tellescope/types-models").EnduserOrder & {
        id: string;
        createdAt: Date;
    };
    group_mms_conversations: import("@tellescope/types-models").GroupMMSConversation & {
        id: string;
        createdAt: Date;
    };
    ticket_queues: import("@tellescope/types-models").TicketQueue & {
        id: string;
        createdAt: Date;
    };
    configurations: import("@tellescope/types-models").Configuration & {
        id: string;
        createdAt: Date;
    };
    ticket_threads: import("@tellescope/types-models").TicketThread & {
        id: string;
        createdAt: Date;
    };
    ticket_thread_comments: import("@tellescope/types-models").TicketThreadComment & {
        id: string;
        createdAt: Date;
    };
    enduser_custom_types: import("@tellescope/types-models").EnduserCustomType & {
        id: string;
        createdAt: Date;
    };
    phone_trees: import("@tellescope/types-models").PhoneTree & {
        id: string;
        createdAt: Date;
    };
    enduser_medications: import("@tellescope/types-models").EnduserMedication & {
        id: string;
        createdAt: Date;
    };
    superbill_providers: import("@tellescope/types-models").SuperbillProvider & {
        id: string;
        createdAt: Date;
    };
    superbills: import("@tellescope/types-models").Superbill & {
        id: string;
        createdAt: Date;
    };
    automation_triggers: import("@tellescope/types-models").AutomationTrigger & {
        id: string;
        createdAt: Date;
    };
    background_errors: import("@tellescope/types-models").BackgroundError & {
        id: string;
        createdAt: Date;
    };
    enduser_views: import("@tellescope/types-models").EnduserView & {
        id: string;
        createdAt: Date;
    };
    availability_blocks: import("@tellescope/types-models").AvailabilityBlock & {
        id: string;
        createdAt: Date;
    };
    analytics_frames: import("@tellescope/types-models").AnalyticsFrame & {
        id: string;
        createdAt: Date;
    };
    endusers: import("@tellescope/types-models").Enduser & {
        id: string;
        createdAt: Date;
    };
    engagement_events: import("@tellescope/types-models").EngagementEvent & {
        id: string;
        createdAt: Date;
    };
    journeys: import("@tellescope/types-models").Journey & {
        id: string;
        createdAt: Date;
    };
    api_keys: import("@tellescope/types-models").APIKey & {
        id: string;
        createdAt: Date;
    };
    emails: import("@tellescope/types-models").Email & {
        id: string;
        createdAt: Date;
    };
    sms_messages: import("@tellescope/types-models").SMSMessage & {
        id: string;
        createdAt: Date;
    };
    chat_rooms: import("@tellescope/types-models").ChatRoom & {
        id: string;
        createdAt: Date;
    };
    chats: import("@tellescope/types-models").ChatMessage & {
        id: string;
        createdAt: Date;
    };
    users: import("@tellescope/types-models").User & {
        id: string;
        createdAt: Date;
    };
    templates: import("@tellescope/types-models").MessageTemplate & {
        id: string;
        createdAt: Date;
    };
    files: import("@tellescope/types-models").File & {
        id: string;
        createdAt: Date;
    };
    tickets: import("@tellescope/types-models").Ticket & {
        id: string;
        createdAt: Date;
    };
    meetings: import("@tellescope/types-models").Meeting & {
        id: string;
        createdAt: Date;
    };
    notes: import("@tellescope/types-models").Note & {
        id: string;
        createdAt: Date;
    };
    forms: import("@tellescope/types-models").Form & {
        id: string;
        createdAt: Date;
    };
    form_fields: import("@tellescope/types-models").FormField & {
        id: string;
        createdAt: Date;
    };
    form_responses: import("@tellescope/types-models").FormResponse & {
        id: string;
        createdAt: Date;
    };
    calendar_events: import("@tellescope/types-models").CalendarEvent & {
        id: string;
        createdAt: Date;
    };
    calendar_event_templates: import("@tellescope/types-models").CalendarEventTemplate & {
        id: string;
        createdAt: Date;
    };
    calendar_event_RSVPs: import("@tellescope/types-models").CalendarEventRSVP & {
        id: string;
        createdAt: Date;
    };
    automation_steps: import("@tellescope/types-models").AutomationStep & {
        id: string;
        createdAt: Date;
    };
    automated_actions: import("@tellescope/types-models").AutomatedAction & {
        id: string;
        createdAt: Date;
    };
    webhooks: import("@tellescope/types-models").WebHook & {
        id: string;
        createdAt: Date;
    };
    user_logs: import("@tellescope/types-models").UserLog & {
        id: string;
        createdAt: Date;
    };
    user_notifications: import("@tellescope/types-models").UserNotification & {
        id: string;
        createdAt: Date;
    };
    enduser_status_updates: import("@tellescope/types-models").EnduserStatusUpdate & {
        id: string;
        createdAt: Date;
    };
    enduser_observations: import("@tellescope/types-models").EnduserObservation & {
        id: string;
        createdAt: Date;
    };
    managed_content_records: import("@tellescope/types-models").ManagedContentRecord & {
        id: string;
        createdAt: Date;
    };
    managed_content_record_assignments: import("@tellescope/types-models").ManagedContentRecordAssignment & {
        id: string;
        createdAt: Date;
    };
    forums: import("@tellescope/types-models").Forum & {
        id: string;
        createdAt: Date;
    };
    forum_posts: import("@tellescope/types-models").ForumPost & {
        id: string;
        createdAt: Date;
    };
    post_likes: import("@tellescope/types-models").PostLike & {
        id: string;
        createdAt: Date;
    };
    comment_likes: import("@tellescope/types-models").CommentLike & {
        id: string;
        createdAt: Date;
    };
    post_comments: import("@tellescope/types-models").PostComment & {
        id: string;
        createdAt: Date;
    };
    organizations: import("@tellescope/types-models").Organization & {
        id: string;
        createdAt: Date;
    };
    integrations: import("@tellescope/types-models").Integration & {
        id: string;
        createdAt: Date;
    };
    databases: import("@tellescope/types-models").Database & {
        id: string;
        createdAt: Date;
    };
    database_records: import("@tellescope/types-models").DatabaseRecord & {
        id: string;
        createdAt: Date;
    };
    portal_customizations: import("@tellescope/types-models").PortalCustomization & {
        id: string;
        createdAt: Date;
    };
    enduser_tasks: import("@tellescope/types-models").EnduserTask & {
        id: string;
        createdAt: Date;
    };
    care_plans: import("@tellescope/types-models").CarePlan & {
        id: string;
        createdAt: Date;
    };
    role_based_access_permissions: import("@tellescope/types-models").RoleBasedAccessPermission & {
        id: string;
        createdAt: Date;
    };
    appointment_booking_pages: import("@tellescope/types-models").AppointmentBookingPage & {
        id: string;
        createdAt: Date;
    };
    appointment_locations: import("@tellescope/types-models").AppointmentLocation & {
        id: string;
        createdAt: Date;
    };
    products: import("@tellescope/types-models").Product & {
        id: string;
        createdAt: Date;
    };
    purchases: import("@tellescope/types-models").Purchase & {
        id: string;
        createdAt: Date;
    };
    purchase_credits: import("@tellescope/types-models").PurchaseCredit & {
        id: string;
        createdAt: Date;
    };
    phone_calls: import("@tellescope/types-models").PhoneCall & {
        id: string;
        createdAt: Date;
    };
    enduser_profile_views: import("@tellescope/types-models").EnduserProfileView & {
        id: string;
        createdAt: Date;
    };
    table_views: import("@tellescope/types-models").TableView & {
        id: string;
        createdAt: Date;
    };
    email_sync_denials: import("@tellescope/types-models").EmailSyncDenial & {
        id: string;
        createdAt: Date;
    };
}[N]) => void) => Promise<{
    inbox_threads: import("@tellescope/types-models").InboxThread & {
        id: string;
        createdAt: Date;
    };
    ai_conversations: import("@tellescope/types-models").AIConversation & {
        id: string;
        createdAt: Date;
    };
    waitlists: import("@tellescope/types-models").Waitlist & {
        id: string;
        createdAt: Date;
    };
    agent_records: import("@tellescope/types-models").AgentRecord & {
        id: string;
        createdAt: Date;
    };
    enduser_eligibility_results: import("@tellescope/types-models").EnduserEligibilityResult & {
        id: string;
        createdAt: Date;
    };
    integration_logs: import("@tellescope/types-models").IntegrationLog & {
        id: string;
        createdAt: Date;
    };
    allergy_codes: import("@tellescope/types-models").AllergyCode & {
        id: string;
        createdAt: Date;
    };
    diagnosis_codes: import("@tellescope/types-models").DiagnosisCode & {
        id: string;
        createdAt: Date;
    };
    suggested_contacts: import("@tellescope/types-models").SuggestedContact & {
        id: string;
        createdAt: Date;
    };
    call_hold_queues: import("@tellescope/types-models").CallHoldQueue & {
        id: string;
        createdAt: Date;
    };
    fax_logs: import("@tellescope/types-models").FaxLog & {
        id: string;
        createdAt: Date;
    };
    message_template_snippets: import("@tellescope/types-models").MessageTemplateSnippet & {
        id: string;
        createdAt: Date;
    };
    portal_brandings: import("@tellescope/types-models").PortalBranding & {
        id: string;
        createdAt: Date;
    };
    form_groups: import("@tellescope/types-models").FormGroup & {
        id: string;
        createdAt: Date;
    };
    webhook_logs: import("@tellescope/types-models").WebhookLog & {
        id: string;
        createdAt: Date;
    };
    flowchart_notes: import("@tellescope/types-models").FlowchartNote & {
        id: string;
        createdAt: Date;
    };
    enduser_problems: import("@tellescope/types-models").EnduserProblem & {
        id: string;
        createdAt: Date;
    };
    prescription_routes: import("@tellescope/types-models").PrescriptionRoute & {
        id: string;
        createdAt: Date;
    };
    blocked_phones: import("@tellescope/types-models").BlockedPhone & {
        id: string;
        createdAt: Date;
    };
    vital_configurations: import("@tellescope/types-models").VitalConfiguration & {
        id: string;
        createdAt: Date;
    };
    enduser_encounters: import("@tellescope/types-models").EnduserEncounter & {
        id: string;
        createdAt: Date;
    };
    enduser_orders: import("@tellescope/types-models").EnduserOrder & {
        id: string;
        createdAt: Date;
    };
    group_mms_conversations: import("@tellescope/types-models").GroupMMSConversation & {
        id: string;
        createdAt: Date;
    };
    ticket_queues: import("@tellescope/types-models").TicketQueue & {
        id: string;
        createdAt: Date;
    };
    configurations: import("@tellescope/types-models").Configuration & {
        id: string;
        createdAt: Date;
    };
    ticket_threads: import("@tellescope/types-models").TicketThread & {
        id: string;
        createdAt: Date;
    };
    ticket_thread_comments: import("@tellescope/types-models").TicketThreadComment & {
        id: string;
        createdAt: Date;
    };
    enduser_custom_types: import("@tellescope/types-models").EnduserCustomType & {
        id: string;
        createdAt: Date;
    };
    phone_trees: import("@tellescope/types-models").PhoneTree & {
        id: string;
        createdAt: Date;
    };
    enduser_medications: import("@tellescope/types-models").EnduserMedication & {
        id: string;
        createdAt: Date;
    };
    superbill_providers: import("@tellescope/types-models").SuperbillProvider & {
        id: string;
        createdAt: Date;
    };
    superbills: import("@tellescope/types-models").Superbill & {
        id: string;
        createdAt: Date;
    };
    automation_triggers: import("@tellescope/types-models").AutomationTrigger & {
        id: string;
        createdAt: Date;
    };
    background_errors: import("@tellescope/types-models").BackgroundError & {
        id: string;
        createdAt: Date;
    };
    enduser_views: import("@tellescope/types-models").EnduserView & {
        id: string;
        createdAt: Date;
    };
    availability_blocks: import("@tellescope/types-models").AvailabilityBlock & {
        id: string;
        createdAt: Date;
    };
    analytics_frames: import("@tellescope/types-models").AnalyticsFrame & {
        id: string;
        createdAt: Date;
    };
    endusers: import("@tellescope/types-models").Enduser & {
        id: string;
        createdAt: Date;
    };
    engagement_events: import("@tellescope/types-models").EngagementEvent & {
        id: string;
        createdAt: Date;
    };
    journeys: import("@tellescope/types-models").Journey & {
        id: string;
        createdAt: Date;
    };
    api_keys: import("@tellescope/types-models").APIKey & {
        id: string;
        createdAt: Date;
    };
    emails: import("@tellescope/types-models").Email & {
        id: string;
        createdAt: Date;
    };
    sms_messages: import("@tellescope/types-models").SMSMessage & {
        id: string;
        createdAt: Date;
    };
    chat_rooms: import("@tellescope/types-models").ChatRoom & {
        id: string;
        createdAt: Date;
    };
    chats: import("@tellescope/types-models").ChatMessage & {
        id: string;
        createdAt: Date;
    };
    users: import("@tellescope/types-models").User & {
        id: string;
        createdAt: Date;
    };
    templates: import("@tellescope/types-models").MessageTemplate & {
        id: string;
        createdAt: Date;
    };
    files: import("@tellescope/types-models").File & {
        id: string;
        createdAt: Date;
    };
    tickets: import("@tellescope/types-models").Ticket & {
        id: string;
        createdAt: Date;
    };
    meetings: import("@tellescope/types-models").Meeting & {
        id: string;
        createdAt: Date;
    };
    notes: import("@tellescope/types-models").Note & {
        id: string;
        createdAt: Date;
    };
    forms: import("@tellescope/types-models").Form & {
        id: string;
        createdAt: Date;
    };
    form_fields: import("@tellescope/types-models").FormField & {
        id: string;
        createdAt: Date;
    };
    form_responses: import("@tellescope/types-models").FormResponse & {
        id: string;
        createdAt: Date;
    };
    calendar_events: import("@tellescope/types-models").CalendarEvent & {
        id: string;
        createdAt: Date;
    };
    calendar_event_templates: import("@tellescope/types-models").CalendarEventTemplate & {
        id: string;
        createdAt: Date;
    };
    calendar_event_RSVPs: import("@tellescope/types-models").CalendarEventRSVP & {
        id: string;
        createdAt: Date;
    };
    automation_steps: import("@tellescope/types-models").AutomationStep & {
        id: string;
        createdAt: Date;
    };
    automated_actions: import("@tellescope/types-models").AutomatedAction & {
        id: string;
        createdAt: Date;
    };
    webhooks: import("@tellescope/types-models").WebHook & {
        id: string;
        createdAt: Date;
    };
    user_logs: import("@tellescope/types-models").UserLog & {
        id: string;
        createdAt: Date;
    };
    user_notifications: import("@tellescope/types-models").UserNotification & {
        id: string;
        createdAt: Date;
    };
    enduser_status_updates: import("@tellescope/types-models").EnduserStatusUpdate & {
        id: string;
        createdAt: Date;
    };
    enduser_observations: import("@tellescope/types-models").EnduserObservation & {
        id: string;
        createdAt: Date;
    };
    managed_content_records: import("@tellescope/types-models").ManagedContentRecord & {
        id: string;
        createdAt: Date;
    };
    managed_content_record_assignments: import("@tellescope/types-models").ManagedContentRecordAssignment & {
        id: string;
        createdAt: Date;
    };
    forums: import("@tellescope/types-models").Forum & {
        id: string;
        createdAt: Date;
    };
    forum_posts: import("@tellescope/types-models").ForumPost & {
        id: string;
        createdAt: Date;
    };
    post_likes: import("@tellescope/types-models").PostLike & {
        id: string;
        createdAt: Date;
    };
    comment_likes: import("@tellescope/types-models").CommentLike & {
        id: string;
        createdAt: Date;
    };
    post_comments: import("@tellescope/types-models").PostComment & {
        id: string;
        createdAt: Date;
    };
    organizations: import("@tellescope/types-models").Organization & {
        id: string;
        createdAt: Date;
    };
    integrations: import("@tellescope/types-models").Integration & {
        id: string;
        createdAt: Date;
    };
    databases: import("@tellescope/types-models").Database & {
        id: string;
        createdAt: Date;
    };
    database_records: import("@tellescope/types-models").DatabaseRecord & {
        id: string;
        createdAt: Date;
    };
    portal_customizations: import("@tellescope/types-models").PortalCustomization & {
        id: string;
        createdAt: Date;
    };
    enduser_tasks: import("@tellescope/types-models").EnduserTask & {
        id: string;
        createdAt: Date;
    };
    care_plans: import("@tellescope/types-models").CarePlan & {
        id: string;
        createdAt: Date;
    };
    role_based_access_permissions: import("@tellescope/types-models").RoleBasedAccessPermission & {
        id: string;
        createdAt: Date;
    };
    appointment_booking_pages: import("@tellescope/types-models").AppointmentBookingPage & {
        id: string;
        createdAt: Date;
    };
    appointment_locations: import("@tellescope/types-models").AppointmentLocation & {
        id: string;
        createdAt: Date;
    };
    products: import("@tellescope/types-models").Product & {
        id: string;
        createdAt: Date;
    };
    purchases: import("@tellescope/types-models").Purchase & {
        id: string;
        createdAt: Date;
    };
    purchase_credits: import("@tellescope/types-models").PurchaseCredit & {
        id: string;
        createdAt: Date;
    };
    phone_calls: import("@tellescope/types-models").PhoneCall & {
        id: string;
        createdAt: Date;
    };
    enduser_profile_views: import("@tellescope/types-models").EnduserProfileView & {
        id: string;
        createdAt: Date;
    };
    table_views: import("@tellescope/types-models").TableView & {
        id: string;
        createdAt: Date;
    };
    email_sync_denials: import("@tellescope/types-models").EmailSyncDenial & {
        id: string;
        createdAt: Date;
    };
}[N]>;
export declare const defaultQueries: <N extends keyof import("@tellescope/types-models").ModelForName>(s: Session, n: keyof ClientModelForName_required) => APIQuery<N, {
    inbox_threads: import("@tellescope/types-models").InboxThread & {
        id: string;
        createdAt: Date;
    };
    ai_conversations: import("@tellescope/types-models").AIConversation & {
        id: string;
        createdAt: Date;
    };
    waitlists: import("@tellescope/types-models").Waitlist & {
        id: string;
        createdAt: Date;
    };
    agent_records: import("@tellescope/types-models").AgentRecord & {
        id: string;
        createdAt: Date;
    };
    enduser_eligibility_results: import("@tellescope/types-models").EnduserEligibilityResult & {
        id: string;
        createdAt: Date;
    };
    integration_logs: import("@tellescope/types-models").IntegrationLog & {
        id: string;
        createdAt: Date;
    };
    allergy_codes: import("@tellescope/types-models").AllergyCode & {
        id: string;
        createdAt: Date;
    };
    diagnosis_codes: import("@tellescope/types-models").DiagnosisCode & {
        id: string;
        createdAt: Date;
    };
    suggested_contacts: import("@tellescope/types-models").SuggestedContact & {
        id: string;
        createdAt: Date;
    };
    call_hold_queues: import("@tellescope/types-models").CallHoldQueue & {
        id: string;
        createdAt: Date;
    };
    fax_logs: import("@tellescope/types-models").FaxLog & {
        id: string;
        createdAt: Date;
    };
    message_template_snippets: import("@tellescope/types-models").MessageTemplateSnippet & {
        id: string;
        createdAt: Date;
    };
    portal_brandings: import("@tellescope/types-models").PortalBranding & {
        id: string;
        createdAt: Date;
    };
    form_groups: import("@tellescope/types-models").FormGroup & {
        id: string;
        createdAt: Date;
    };
    webhook_logs: import("@tellescope/types-models").WebhookLog & {
        id: string;
        createdAt: Date;
    };
    flowchart_notes: import("@tellescope/types-models").FlowchartNote & {
        id: string;
        createdAt: Date;
    };
    enduser_problems: import("@tellescope/types-models").EnduserProblem & {
        id: string;
        createdAt: Date;
    };
    prescription_routes: import("@tellescope/types-models").PrescriptionRoute & {
        id: string;
        createdAt: Date;
    };
    blocked_phones: import("@tellescope/types-models").BlockedPhone & {
        id: string;
        createdAt: Date;
    };
    vital_configurations: import("@tellescope/types-models").VitalConfiguration & {
        id: string;
        createdAt: Date;
    };
    enduser_encounters: import("@tellescope/types-models").EnduserEncounter & {
        id: string;
        createdAt: Date;
    };
    enduser_orders: import("@tellescope/types-models").EnduserOrder & {
        id: string;
        createdAt: Date;
    };
    group_mms_conversations: import("@tellescope/types-models").GroupMMSConversation & {
        id: string;
        createdAt: Date;
    };
    ticket_queues: import("@tellescope/types-models").TicketQueue & {
        id: string;
        createdAt: Date;
    };
    configurations: import("@tellescope/types-models").Configuration & {
        id: string;
        createdAt: Date;
    };
    ticket_threads: import("@tellescope/types-models").TicketThread & {
        id: string;
        createdAt: Date;
    };
    ticket_thread_comments: import("@tellescope/types-models").TicketThreadComment & {
        id: string;
        createdAt: Date;
    };
    enduser_custom_types: import("@tellescope/types-models").EnduserCustomType & {
        id: string;
        createdAt: Date;
    };
    phone_trees: import("@tellescope/types-models").PhoneTree & {
        id: string;
        createdAt: Date;
    };
    enduser_medications: import("@tellescope/types-models").EnduserMedication & {
        id: string;
        createdAt: Date;
    };
    superbill_providers: import("@tellescope/types-models").SuperbillProvider & {
        id: string;
        createdAt: Date;
    };
    superbills: import("@tellescope/types-models").Superbill & {
        id: string;
        createdAt: Date;
    };
    automation_triggers: import("@tellescope/types-models").AutomationTrigger & {
        id: string;
        createdAt: Date;
    };
    background_errors: import("@tellescope/types-models").BackgroundError & {
        id: string;
        createdAt: Date;
    };
    enduser_views: import("@tellescope/types-models").EnduserView & {
        id: string;
        createdAt: Date;
    };
    availability_blocks: import("@tellescope/types-models").AvailabilityBlock & {
        id: string;
        createdAt: Date;
    };
    analytics_frames: import("@tellescope/types-models").AnalyticsFrame & {
        id: string;
        createdAt: Date;
    };
    endusers: import("@tellescope/types-models").Enduser & {
        id: string;
        createdAt: Date;
    };
    engagement_events: import("@tellescope/types-models").EngagementEvent & {
        id: string;
        createdAt: Date;
    };
    journeys: import("@tellescope/types-models").Journey & {
        id: string;
        createdAt: Date;
    };
    api_keys: import("@tellescope/types-models").APIKey & {
        id: string;
        createdAt: Date;
    };
    emails: import("@tellescope/types-models").Email & {
        id: string;
        createdAt: Date;
    };
    sms_messages: import("@tellescope/types-models").SMSMessage & {
        id: string;
        createdAt: Date;
    };
    chat_rooms: import("@tellescope/types-models").ChatRoom & {
        id: string;
        createdAt: Date;
    };
    chats: import("@tellescope/types-models").ChatMessage & {
        id: string;
        createdAt: Date;
    };
    users: import("@tellescope/types-models").User & {
        id: string;
        createdAt: Date;
    };
    templates: import("@tellescope/types-models").MessageTemplate & {
        id: string;
        createdAt: Date;
    };
    files: import("@tellescope/types-models").File & {
        id: string;
        createdAt: Date;
    };
    tickets: import("@tellescope/types-models").Ticket & {
        id: string;
        createdAt: Date;
    };
    meetings: import("@tellescope/types-models").Meeting & {
        id: string;
        createdAt: Date;
    };
    notes: import("@tellescope/types-models").Note & {
        id: string;
        createdAt: Date;
    };
    forms: import("@tellescope/types-models").Form & {
        id: string;
        createdAt: Date;
    };
    form_fields: import("@tellescope/types-models").FormField & {
        id: string;
        createdAt: Date;
    };
    form_responses: import("@tellescope/types-models").FormResponse & {
        id: string;
        createdAt: Date;
    };
    calendar_events: import("@tellescope/types-models").CalendarEvent & {
        id: string;
        createdAt: Date;
    };
    calendar_event_templates: import("@tellescope/types-models").CalendarEventTemplate & {
        id: string;
        createdAt: Date;
    };
    calendar_event_RSVPs: import("@tellescope/types-models").CalendarEventRSVP & {
        id: string;
        createdAt: Date;
    };
    automation_steps: import("@tellescope/types-models").AutomationStep & {
        id: string;
        createdAt: Date;
    };
    automated_actions: import("@tellescope/types-models").AutomatedAction & {
        id: string;
        createdAt: Date;
    };
    webhooks: import("@tellescope/types-models").WebHook & {
        id: string;
        createdAt: Date;
    };
    user_logs: import("@tellescope/types-models").UserLog & {
        id: string;
        createdAt: Date;
    };
    user_notifications: import("@tellescope/types-models").UserNotification & {
        id: string;
        createdAt: Date;
    };
    enduser_status_updates: import("@tellescope/types-models").EnduserStatusUpdate & {
        id: string;
        createdAt: Date;
    };
    enduser_observations: import("@tellescope/types-models").EnduserObservation & {
        id: string;
        createdAt: Date;
    };
    managed_content_records: import("@tellescope/types-models").ManagedContentRecord & {
        id: string;
        createdAt: Date;
    };
    managed_content_record_assignments: import("@tellescope/types-models").ManagedContentRecordAssignment & {
        id: string;
        createdAt: Date;
    };
    forums: import("@tellescope/types-models").Forum & {
        id: string;
        createdAt: Date;
    };
    forum_posts: import("@tellescope/types-models").ForumPost & {
        id: string;
        createdAt: Date;
    };
    post_likes: import("@tellescope/types-models").PostLike & {
        id: string;
        createdAt: Date;
    };
    comment_likes: import("@tellescope/types-models").CommentLike & {
        id: string;
        createdAt: Date;
    };
    post_comments: import("@tellescope/types-models").PostComment & {
        id: string;
        createdAt: Date;
    };
    organizations: import("@tellescope/types-models").Organization & {
        id: string;
        createdAt: Date;
    };
    integrations: import("@tellescope/types-models").Integration & {
        id: string;
        createdAt: Date;
    };
    databases: import("@tellescope/types-models").Database & {
        id: string;
        createdAt: Date;
    };
    database_records: import("@tellescope/types-models").DatabaseRecord & {
        id: string;
        createdAt: Date;
    };
    portal_customizations: import("@tellescope/types-models").PortalCustomization & {
        id: string;
        createdAt: Date;
    };
    enduser_tasks: import("@tellescope/types-models").EnduserTask & {
        id: string;
        createdAt: Date;
    };
    care_plans: import("@tellescope/types-models").CarePlan & {
        id: string;
        createdAt: Date;
    };
    role_based_access_permissions: import("@tellescope/types-models").RoleBasedAccessPermission & {
        id: string;
        createdAt: Date;
    };
    appointment_booking_pages: import("@tellescope/types-models").AppointmentBookingPage & {
        id: string;
        createdAt: Date;
    };
    appointment_locations: import("@tellescope/types-models").AppointmentLocation & {
        id: string;
        createdAt: Date;
    };
    products: import("@tellescope/types-models").Product & {
        id: string;
        createdAt: Date;
    };
    purchases: import("@tellescope/types-models").Purchase & {
        id: string;
        createdAt: Date;
    };
    purchase_credits: import("@tellescope/types-models").PurchaseCredit & {
        id: string;
        createdAt: Date;
    };
    phone_calls: import("@tellescope/types-models").PhoneCall & {
        id: string;
        createdAt: Date;
    };
    enduser_profile_views: import("@tellescope/types-models").EnduserProfileView & {
        id: string;
        createdAt: Date;
    };
    table_views: import("@tellescope/types-models").TableView & {
        id: string;
        createdAt: Date;
    };
    email_sync_denials: import("@tellescope/types-models").EmailSyncDenial & {
        id: string;
        createdAt: Date;
    };
}[N], CreateFields<N, {
    inbox_threads: import("@tellescope/types-models").InboxThread & {
        id: string;
        createdAt: Date;
    };
    ai_conversations: import("@tellescope/types-models").AIConversation & {
        id: string;
        createdAt: Date;
    };
    waitlists: import("@tellescope/types-models").Waitlist & {
        id: string;
        createdAt: Date;
    };
    agent_records: import("@tellescope/types-models").AgentRecord & {
        id: string;
        createdAt: Date;
    };
    enduser_eligibility_results: import("@tellescope/types-models").EnduserEligibilityResult & {
        id: string;
        createdAt: Date;
    };
    integration_logs: import("@tellescope/types-models").IntegrationLog & {
        id: string;
        createdAt: Date;
    };
    allergy_codes: import("@tellescope/types-models").AllergyCode & {
        id: string;
        createdAt: Date;
    };
    diagnosis_codes: import("@tellescope/types-models").DiagnosisCode & {
        id: string;
        createdAt: Date;
    };
    suggested_contacts: import("@tellescope/types-models").SuggestedContact & {
        id: string;
        createdAt: Date;
    };
    call_hold_queues: import("@tellescope/types-models").CallHoldQueue & {
        id: string;
        createdAt: Date;
    };
    fax_logs: import("@tellescope/types-models").FaxLog & {
        id: string;
        createdAt: Date;
    };
    message_template_snippets: import("@tellescope/types-models").MessageTemplateSnippet & {
        id: string;
        createdAt: Date;
    };
    portal_brandings: import("@tellescope/types-models").PortalBranding & {
        id: string;
        createdAt: Date;
    };
    form_groups: import("@tellescope/types-models").FormGroup & {
        id: string;
        createdAt: Date;
    };
    webhook_logs: import("@tellescope/types-models").WebhookLog & {
        id: string;
        createdAt: Date;
    };
    flowchart_notes: import("@tellescope/types-models").FlowchartNote & {
        id: string;
        createdAt: Date;
    };
    enduser_problems: import("@tellescope/types-models").EnduserProblem & {
        id: string;
        createdAt: Date;
    };
    prescription_routes: import("@tellescope/types-models").PrescriptionRoute & {
        id: string;
        createdAt: Date;
    };
    blocked_phones: import("@tellescope/types-models").BlockedPhone & {
        id: string;
        createdAt: Date;
    };
    vital_configurations: import("@tellescope/types-models").VitalConfiguration & {
        id: string;
        createdAt: Date;
    };
    enduser_encounters: import("@tellescope/types-models").EnduserEncounter & {
        id: string;
        createdAt: Date;
    };
    enduser_orders: import("@tellescope/types-models").EnduserOrder & {
        id: string;
        createdAt: Date;
    };
    group_mms_conversations: import("@tellescope/types-models").GroupMMSConversation & {
        id: string;
        createdAt: Date;
    };
    ticket_queues: import("@tellescope/types-models").TicketQueue & {
        id: string;
        createdAt: Date;
    };
    configurations: import("@tellescope/types-models").Configuration & {
        id: string;
        createdAt: Date;
    };
    ticket_threads: import("@tellescope/types-models").TicketThread & {
        id: string;
        createdAt: Date;
    };
    ticket_thread_comments: import("@tellescope/types-models").TicketThreadComment & {
        id: string;
        createdAt: Date;
    };
    enduser_custom_types: import("@tellescope/types-models").EnduserCustomType & {
        id: string;
        createdAt: Date;
    };
    phone_trees: import("@tellescope/types-models").PhoneTree & {
        id: string;
        createdAt: Date;
    };
    enduser_medications: import("@tellescope/types-models").EnduserMedication & {
        id: string;
        createdAt: Date;
    };
    superbill_providers: import("@tellescope/types-models").SuperbillProvider & {
        id: string;
        createdAt: Date;
    };
    superbills: import("@tellescope/types-models").Superbill & {
        id: string;
        createdAt: Date;
    };
    automation_triggers: import("@tellescope/types-models").AutomationTrigger & {
        id: string;
        createdAt: Date;
    };
    background_errors: import("@tellescope/types-models").BackgroundError & {
        id: string;
        createdAt: Date;
    };
    enduser_views: import("@tellescope/types-models").EnduserView & {
        id: string;
        createdAt: Date;
    };
    availability_blocks: import("@tellescope/types-models").AvailabilityBlock & {
        id: string;
        createdAt: Date;
    };
    analytics_frames: import("@tellescope/types-models").AnalyticsFrame & {
        id: string;
        createdAt: Date;
    };
    endusers: import("@tellescope/types-models").Enduser & {
        id: string;
        createdAt: Date;
    };
    engagement_events: import("@tellescope/types-models").EngagementEvent & {
        id: string;
        createdAt: Date;
    };
    journeys: import("@tellescope/types-models").Journey & {
        id: string;
        createdAt: Date;
    };
    api_keys: import("@tellescope/types-models").APIKey & {
        id: string;
        createdAt: Date;
    };
    emails: import("@tellescope/types-models").Email & {
        id: string;
        createdAt: Date;
    };
    sms_messages: import("@tellescope/types-models").SMSMessage & {
        id: string;
        createdAt: Date;
    };
    chat_rooms: import("@tellescope/types-models").ChatRoom & {
        id: string;
        createdAt: Date;
    };
    chats: import("@tellescope/types-models").ChatMessage & {
        id: string;
        createdAt: Date;
    };
    users: import("@tellescope/types-models").User & {
        id: string;
        createdAt: Date;
    };
    templates: import("@tellescope/types-models").MessageTemplate & {
        id: string;
        createdAt: Date;
    };
    files: import("@tellescope/types-models").File & {
        id: string;
        createdAt: Date;
    };
    tickets: import("@tellescope/types-models").Ticket & {
        id: string;
        createdAt: Date;
    };
    meetings: import("@tellescope/types-models").Meeting & {
        id: string;
        createdAt: Date;
    };
    notes: import("@tellescope/types-models").Note & {
        id: string;
        createdAt: Date;
    };
    forms: import("@tellescope/types-models").Form & {
        id: string;
        createdAt: Date;
    };
    form_fields: import("@tellescope/types-models").FormField & {
        id: string;
        createdAt: Date;
    };
    form_responses: import("@tellescope/types-models").FormResponse & {
        id: string;
        createdAt: Date;
    };
    calendar_events: import("@tellescope/types-models").CalendarEvent & {
        id: string;
        createdAt: Date;
    };
    calendar_event_templates: import("@tellescope/types-models").CalendarEventTemplate & {
        id: string;
        createdAt: Date;
    };
    calendar_event_RSVPs: import("@tellescope/types-models").CalendarEventRSVP & {
        id: string;
        createdAt: Date;
    };
    automation_steps: import("@tellescope/types-models").AutomationStep & {
        id: string;
        createdAt: Date;
    };
    automated_actions: import("@tellescope/types-models").AutomatedAction & {
        id: string;
        createdAt: Date;
    };
    webhooks: import("@tellescope/types-models").WebHook & {
        id: string;
        createdAt: Date;
    };
    user_logs: import("@tellescope/types-models").UserLog & {
        id: string;
        createdAt: Date;
    };
    user_notifications: import("@tellescope/types-models").UserNotification & {
        id: string;
        createdAt: Date;
    };
    enduser_status_updates: import("@tellescope/types-models").EnduserStatusUpdate & {
        id: string;
        createdAt: Date;
    };
    enduser_observations: import("@tellescope/types-models").EnduserObservation & {
        id: string;
        createdAt: Date;
    };
    managed_content_records: import("@tellescope/types-models").ManagedContentRecord & {
        id: string;
        createdAt: Date;
    };
    managed_content_record_assignments: import("@tellescope/types-models").ManagedContentRecordAssignment & {
        id: string;
        createdAt: Date;
    };
    forums: import("@tellescope/types-models").Forum & {
        id: string;
        createdAt: Date;
    };
    forum_posts: import("@tellescope/types-models").ForumPost & {
        id: string;
        createdAt: Date;
    };
    post_likes: import("@tellescope/types-models").PostLike & {
        id: string;
        createdAt: Date;
    };
    comment_likes: import("@tellescope/types-models").CommentLike & {
        id: string;
        createdAt: Date;
    };
    post_comments: import("@tellescope/types-models").PostComment & {
        id: string;
        createdAt: Date;
    };
    organizations: import("@tellescope/types-models").Organization & {
        id: string;
        createdAt: Date;
    };
    integrations: import("@tellescope/types-models").Integration & {
        id: string;
        createdAt: Date;
    };
    databases: import("@tellescope/types-models").Database & {
        id: string;
        createdAt: Date;
    };
    database_records: import("@tellescope/types-models").DatabaseRecord & {
        id: string;
        createdAt: Date;
    };
    portal_customizations: import("@tellescope/types-models").PortalCustomization & {
        id: string;
        createdAt: Date;
    };
    enduser_tasks: import("@tellescope/types-models").EnduserTask & {
        id: string;
        createdAt: Date;
    };
    care_plans: import("@tellescope/types-models").CarePlan & {
        id: string;
        createdAt: Date;
    };
    role_based_access_permissions: import("@tellescope/types-models").RoleBasedAccessPermission & {
        id: string;
        createdAt: Date;
    };
    appointment_booking_pages: import("@tellescope/types-models").AppointmentBookingPage & {
        id: string;
        createdAt: Date;
    };
    appointment_locations: import("@tellescope/types-models").AppointmentLocation & {
        id: string;
        createdAt: Date;
    };
    products: import("@tellescope/types-models").Product & {
        id: string;
        createdAt: Date;
    };
    purchases: import("@tellescope/types-models").Purchase & {
        id: string;
        createdAt: Date;
    };
    purchase_credits: import("@tellescope/types-models").PurchaseCredit & {
        id: string;
        createdAt: Date;
    };
    phone_calls: import("@tellescope/types-models").PhoneCall & {
        id: string;
        createdAt: Date;
    };
    enduser_profile_views: import("@tellescope/types-models").EnduserProfileView & {
        id: string;
        createdAt: Date;
    };
    table_views: import("@tellescope/types-models").TableView & {
        id: string;
        createdAt: Date;
    };
    email_sync_denials: import("@tellescope/types-models").EmailSyncDenial & {
        id: string;
        createdAt: Date;
    };
}[N]>, Omit<Partial<{
    inbox_threads: import("@tellescope/types-models").InboxThread & {
        id: string;
        createdAt: Date;
    };
    ai_conversations: import("@tellescope/types-models").AIConversation & {
        id: string;
        createdAt: Date;
    };
    waitlists: import("@tellescope/types-models").Waitlist & {
        id: string;
        createdAt: Date;
    };
    agent_records: import("@tellescope/types-models").AgentRecord & {
        id: string;
        createdAt: Date;
    };
    enduser_eligibility_results: import("@tellescope/types-models").EnduserEligibilityResult & {
        id: string;
        createdAt: Date;
    };
    integration_logs: import("@tellescope/types-models").IntegrationLog & {
        id: string;
        createdAt: Date;
    };
    allergy_codes: import("@tellescope/types-models").AllergyCode & {
        id: string;
        createdAt: Date;
    };
    diagnosis_codes: import("@tellescope/types-models").DiagnosisCode & {
        id: string;
        createdAt: Date;
    };
    suggested_contacts: import("@tellescope/types-models").SuggestedContact & {
        id: string;
        createdAt: Date;
    };
    call_hold_queues: import("@tellescope/types-models").CallHoldQueue & {
        id: string;
        createdAt: Date;
    };
    fax_logs: import("@tellescope/types-models").FaxLog & {
        id: string;
        createdAt: Date;
    };
    message_template_snippets: import("@tellescope/types-models").MessageTemplateSnippet & {
        id: string;
        createdAt: Date;
    };
    portal_brandings: import("@tellescope/types-models").PortalBranding & {
        id: string;
        createdAt: Date;
    };
    form_groups: import("@tellescope/types-models").FormGroup & {
        id: string;
        createdAt: Date;
    };
    webhook_logs: import("@tellescope/types-models").WebhookLog & {
        id: string;
        createdAt: Date;
    };
    flowchart_notes: import("@tellescope/types-models").FlowchartNote & {
        id: string;
        createdAt: Date;
    };
    enduser_problems: import("@tellescope/types-models").EnduserProblem & {
        id: string;
        createdAt: Date;
    };
    prescription_routes: import("@tellescope/types-models").PrescriptionRoute & {
        id: string;
        createdAt: Date;
    };
    blocked_phones: import("@tellescope/types-models").BlockedPhone & {
        id: string;
        createdAt: Date;
    };
    vital_configurations: import("@tellescope/types-models").VitalConfiguration & {
        id: string;
        createdAt: Date;
    };
    enduser_encounters: import("@tellescope/types-models").EnduserEncounter & {
        id: string;
        createdAt: Date;
    };
    enduser_orders: import("@tellescope/types-models").EnduserOrder & {
        id: string;
        createdAt: Date;
    };
    group_mms_conversations: import("@tellescope/types-models").GroupMMSConversation & {
        id: string;
        createdAt: Date;
    };
    ticket_queues: import("@tellescope/types-models").TicketQueue & {
        id: string;
        createdAt: Date;
    };
    configurations: import("@tellescope/types-models").Configuration & {
        id: string;
        createdAt: Date;
    };
    ticket_threads: import("@tellescope/types-models").TicketThread & {
        id: string;
        createdAt: Date;
    };
    ticket_thread_comments: import("@tellescope/types-models").TicketThreadComment & {
        id: string;
        createdAt: Date;
    };
    enduser_custom_types: import("@tellescope/types-models").EnduserCustomType & {
        id: string;
        createdAt: Date;
    };
    phone_trees: import("@tellescope/types-models").PhoneTree & {
        id: string;
        createdAt: Date;
    };
    enduser_medications: import("@tellescope/types-models").EnduserMedication & {
        id: string;
        createdAt: Date;
    };
    superbill_providers: import("@tellescope/types-models").SuperbillProvider & {
        id: string;
        createdAt: Date;
    };
    superbills: import("@tellescope/types-models").Superbill & {
        id: string;
        createdAt: Date;
    };
    automation_triggers: import("@tellescope/types-models").AutomationTrigger & {
        id: string;
        createdAt: Date;
    };
    background_errors: import("@tellescope/types-models").BackgroundError & {
        id: string;
        createdAt: Date;
    };
    enduser_views: import("@tellescope/types-models").EnduserView & {
        id: string;
        createdAt: Date;
    };
    availability_blocks: import("@tellescope/types-models").AvailabilityBlock & {
        id: string;
        createdAt: Date;
    };
    analytics_frames: import("@tellescope/types-models").AnalyticsFrame & {
        id: string;
        createdAt: Date;
    };
    endusers: import("@tellescope/types-models").Enduser & {
        id: string;
        createdAt: Date;
    };
    engagement_events: import("@tellescope/types-models").EngagementEvent & {
        id: string;
        createdAt: Date;
    };
    journeys: import("@tellescope/types-models").Journey & {
        id: string;
        createdAt: Date;
    };
    api_keys: import("@tellescope/types-models").APIKey & {
        id: string;
        createdAt: Date;
    };
    emails: import("@tellescope/types-models").Email & {
        id: string;
        createdAt: Date;
    };
    sms_messages: import("@tellescope/types-models").SMSMessage & {
        id: string;
        createdAt: Date;
    };
    chat_rooms: import("@tellescope/types-models").ChatRoom & {
        id: string;
        createdAt: Date;
    };
    chats: import("@tellescope/types-models").ChatMessage & {
        id: string;
        createdAt: Date;
    };
    users: import("@tellescope/types-models").User & {
        id: string;
        createdAt: Date;
    };
    templates: import("@tellescope/types-models").MessageTemplate & {
        id: string;
        createdAt: Date;
    };
    files: import("@tellescope/types-models").File & {
        id: string;
        createdAt: Date;
    };
    tickets: import("@tellescope/types-models").Ticket & {
        id: string;
        createdAt: Date;
    };
    meetings: import("@tellescope/types-models").Meeting & {
        id: string;
        createdAt: Date;
    };
    notes: import("@tellescope/types-models").Note & {
        id: string;
        createdAt: Date;
    };
    forms: import("@tellescope/types-models").Form & {
        id: string;
        createdAt: Date;
    };
    form_fields: import("@tellescope/types-models").FormField & {
        id: string;
        createdAt: Date;
    };
    form_responses: import("@tellescope/types-models").FormResponse & {
        id: string;
        createdAt: Date;
    };
    calendar_events: import("@tellescope/types-models").CalendarEvent & {
        id: string;
        createdAt: Date;
    };
    calendar_event_templates: import("@tellescope/types-models").CalendarEventTemplate & {
        id: string;
        createdAt: Date;
    };
    calendar_event_RSVPs: import("@tellescope/types-models").CalendarEventRSVP & {
        id: string;
        createdAt: Date;
    };
    automation_steps: import("@tellescope/types-models").AutomationStep & {
        id: string;
        createdAt: Date;
    };
    automated_actions: import("@tellescope/types-models").AutomatedAction & {
        id: string;
        createdAt: Date;
    };
    webhooks: import("@tellescope/types-models").WebHook & {
        id: string;
        createdAt: Date;
    };
    user_logs: import("@tellescope/types-models").UserLog & {
        id: string;
        createdAt: Date;
    };
    user_notifications: import("@tellescope/types-models").UserNotification & {
        id: string;
        createdAt: Date;
    };
    enduser_status_updates: import("@tellescope/types-models").EnduserStatusUpdate & {
        id: string;
        createdAt: Date;
    };
    enduser_observations: import("@tellescope/types-models").EnduserObservation & {
        id: string;
        createdAt: Date;
    };
    managed_content_records: import("@tellescope/types-models").ManagedContentRecord & {
        id: string;
        createdAt: Date;
    };
    managed_content_record_assignments: import("@tellescope/types-models").ManagedContentRecordAssignment & {
        id: string;
        createdAt: Date;
    };
    forums: import("@tellescope/types-models").Forum & {
        id: string;
        createdAt: Date;
    };
    forum_posts: import("@tellescope/types-models").ForumPost & {
        id: string;
        createdAt: Date;
    };
    post_likes: import("@tellescope/types-models").PostLike & {
        id: string;
        createdAt: Date;
    };
    comment_likes: import("@tellescope/types-models").CommentLike & {
        id: string;
        createdAt: Date;
    };
    post_comments: import("@tellescope/types-models").PostComment & {
        id: string;
        createdAt: Date;
    };
    organizations: import("@tellescope/types-models").Organization & {
        id: string;
        createdAt: Date;
    };
    integrations: import("@tellescope/types-models").Integration & {
        id: string;
        createdAt: Date;
    };
    databases: import("@tellescope/types-models").Database & {
        id: string;
        createdAt: Date;
    };
    database_records: import("@tellescope/types-models").DatabaseRecord & {
        id: string;
        createdAt: Date;
    };
    portal_customizations: import("@tellescope/types-models").PortalCustomization & {
        id: string;
        createdAt: Date;
    };
    enduser_tasks: import("@tellescope/types-models").EnduserTask & {
        id: string;
        createdAt: Date;
    };
    care_plans: import("@tellescope/types-models").CarePlan & {
        id: string;
        createdAt: Date;
    };
    role_based_access_permissions: import("@tellescope/types-models").RoleBasedAccessPermission & {
        id: string;
        createdAt: Date;
    };
    appointment_booking_pages: import("@tellescope/types-models").AppointmentBookingPage & {
        id: string;
        createdAt: Date;
    };
    appointment_locations: import("@tellescope/types-models").AppointmentLocation & {
        id: string;
        createdAt: Date;
    };
    products: import("@tellescope/types-models").Product & {
        id: string;
        createdAt: Date;
    };
    purchases: import("@tellescope/types-models").Purchase & {
        id: string;
        createdAt: Date;
    };
    purchase_credits: import("@tellescope/types-models").PurchaseCredit & {
        id: string;
        createdAt: Date;
    };
    phone_calls: import("@tellescope/types-models").PhoneCall & {
        id: string;
        createdAt: Date;
    };
    enduser_profile_views: import("@tellescope/types-models").EnduserProfileView & {
        id: string;
        createdAt: Date;
    };
    table_views: import("@tellescope/types-models").TableView & {
        id: string;
        createdAt: Date;
    };
    email_sync_denials: import("@tellescope/types-models").EmailSyncDenial & {
        id: string;
        createdAt: Date;
    };
}[N]>, keyof {
    inbox_threads: import("@tellescope/types-models").InboxThread_readonly & {
        id: string;
        createdAt: Date;
    };
    ai_conversations: import("@tellescope/types-models").AIConversation_readonly & {
        id: string;
        createdAt: Date;
    };
    waitlists: import("@tellescope/types-models").Waitlist_readonly & {
        id: string;
        createdAt: Date;
    };
    agent_records: import("@tellescope/types-models").AgentRecord_readonly & {
        id: string;
        createdAt: Date;
    };
    enduser_eligibility_results: import("@tellescope/types-models").EnduserEligibilityResult_readonly & {
        id: string;
        createdAt: Date;
    };
    integration_logs: import("@tellescope/types-models").IntegrationLog_readonly & {
        id: string;
        createdAt: Date;
    };
    allergy_codes: import("@tellescope/types-models").AllergyCode_readonly & {
        id: string;
        createdAt: Date;
    };
    diagnosis_codes: import("@tellescope/types-models").DiagnosisCode_readonly & {
        id: string;
        createdAt: Date;
    };
    suggested_contacts: import("@tellescope/types-models").SuggestedContact_readonly & {
        id: string;
        createdAt: Date;
    };
    call_hold_queues: import("@tellescope/types-models").CallHoldQueue_readonly & {
        id: string;
        createdAt: Date;
    };
    fax_logs: import("@tellescope/types-models").FaxLog_readonly & {
        id: string;
        createdAt: Date;
    };
    message_template_snippets: import("@tellescope/types-models").MessageTemplateSnippet_readonly & {
        id: string;
        createdAt: Date;
    };
    portal_brandings: import("@tellescope/types-models").PortalBranding_readonly & {
        id: string;
        createdAt: Date;
    };
    form_groups: import("@tellescope/types-models").FormGroup_readonly & {
        id: string;
        createdAt: Date;
    };
    webhook_logs: import("@tellescope/types-models").WebhookLog_readonly & {
        id: string;
        createdAt: Date;
    };
    flowchart_notes: import("@tellescope/types-models").FlowchartNote_readonly & {
        id: string;
        createdAt: Date;
    };
    enduser_problems: import("@tellescope/types-models").EnduserProblem_readonly & {
        id: string;
        createdAt: Date;
    };
    prescription_routes: import("@tellescope/types-models").PrescriptionRoute_readonly & {
        id: string;
        createdAt: Date;
    };
    blocked_phones: import("@tellescope/types-models").BlockedPhone_readonly & {
        id: string;
        createdAt: Date;
    };
    vital_configurations: import("@tellescope/types-models").VitalConfiguration_readonly & {
        id: string;
        createdAt: Date;
    };
    enduser_encounters: import("@tellescope/types-models").EnduserEncounter_readonly & {
        id: string;
        createdAt: Date;
    };
    enduser_orders: import("@tellescope/types-models").EnduserOrder_readonly & {
        id: string;
        createdAt: Date;
    };
    group_mms_conversations: import("@tellescope/types-models").GroupMMSConversation_readonly & {
        id: string;
        createdAt: Date;
    };
    ticket_queues: import("@tellescope/types-models").TicketQueue_readonly & {
        id: string;
        createdAt: Date;
    };
    configurations: import("@tellescope/types-models").Configuration_readonly & {
        id: string;
        createdAt: Date;
    };
    ticket_threads: import("@tellescope/types-models").TicketThread_readonly & {
        id: string;
        createdAt: Date;
    };
    ticket_thread_comments: import("@tellescope/types-models").TicketThreadComment_readonly & {
        id: string;
        createdAt: Date;
    };
    enduser_custom_types: import("@tellescope/types-models").EnduserCustomType_readonly & {
        id: string;
        createdAt: Date;
    };
    phone_trees: import("@tellescope/types-models").PhoneTree_readonly & {
        id: string;
        createdAt: Date;
    };
    enduser_medications: import("@tellescope/types-models").EnduserMedication_readonly & {
        id: string;
        createdAt: Date;
    };
    superbill_providers: import("@tellescope/types-models").SuperbillProvider_readonly & {
        id: string;
        createdAt: Date;
    };
    superbills: import("@tellescope/types-models").Superbill_readonly & {
        id: string;
        createdAt: Date;
    };
    automation_triggers: import("@tellescope/types-models").AutomationTrigger_readonly & {
        id: string;
        createdAt: Date;
    };
    background_errors: import("@tellescope/types-models").BackgroundError_readonly & {
        id: string;
        createdAt: Date;
    };
    enduser_views: import("@tellescope/types-models").EnduserView_readonly & {
        id: string;
        createdAt: Date;
    };
    availability_blocks: import("@tellescope/types-models").AvailabilityBlock_readonly & {
        id: string;
        createdAt: Date;
    };
    analytics_frames: import("@tellescope/types-models").AnalyticsFrame_readonly & {
        id: string;
        createdAt: Date;
    };
    endusers: import("@tellescope/types-models").Enduser_readonly & {
        id: string;
        createdAt: Date;
    };
    engagement_events: import("@tellescope/types-models").EngagementEvent_readonly & {
        id: string;
        createdAt: Date;
    };
    journeys: import("@tellescope/types-models").Journey_readonly & {
        id: string;
        createdAt: Date;
    };
    api_keys: import("@tellescope/types-models").APIKey_readonly & {
        id: string;
        createdAt: Date;
    };
    emails: import("@tellescope/types-models").Email_readonly & {
        id: string;
        createdAt: Date;
    };
    sms_messages: import("@tellescope/types-models").SMSMessage_readonly & {
        id: string;
        createdAt: Date;
    };
    chat_rooms: import("@tellescope/types-models").ChatRoom_readonly & {
        id: string;
        createdAt: Date;
    };
    chats: import("@tellescope/types-models").ChatMessage_readonly & {
        id: string;
        createdAt: Date;
    };
    users: import("@tellescope/types-models").User_readonly & {
        id: string;
        createdAt: Date;
    };
    templates: import("@tellescope/types-models").MessageTemplate_readonly & {
        id: string;
        createdAt: Date;
    };
    files: import("@tellescope/types-models").File_readonly & {
        id: string;
        createdAt: Date;
    };
    tickets: import("@tellescope/types-models").Ticket_readonly & {
        id: string;
        createdAt: Date;
    };
    meetings: import("@tellescope/types-models").Meeting_readonly & {
        id: string;
        createdAt: Date;
    };
    notes: import("@tellescope/types-models").Note_readonly & {
        id: string;
        createdAt: Date;
    };
    forms: import("@tellescope/types-models").Form_readonly & {
        id: string;
        createdAt: Date;
    };
    form_fields: import("@tellescope/types-models").FormField_readonly & {
        id: string;
        createdAt: Date;
    };
    form_responses: import("@tellescope/types-models").FormResponse_readonly & {
        id: string;
        createdAt: Date;
    };
    calendar_events: import("@tellescope/types-models").CalendarEvent_readonly & {
        id: string;
        createdAt: Date;
    };
    calendar_event_templates: import("@tellescope/types-models").CalendarEventTemplate_readonly & {
        id: string;
        createdAt: Date;
    };
    calendar_event_RSVPs: import("@tellescope/types-models").CalendarEventRSVP_readonly & {
        id: string;
        createdAt: Date;
    };
    automation_steps: import("@tellescope/types-models").AutomationStep_readonly & {
        id: string;
        createdAt: Date;
    };
    automated_actions: import("@tellescope/types-models").AutomatedAction_readonly & {
        id: string;
        createdAt: Date;
    };
    webhooks: import("@tellescope/types-models").WebHook_readonly & {
        id: string;
        createdAt: Date;
    };
    user_logs: import("@tellescope/types-models").UserLog_readonly & {
        id: string;
        createdAt: Date;
    };
    user_notifications: import("@tellescope/types-models").UserNotification_readonly & {
        id: string;
        createdAt: Date;
    };
    enduser_status_updates: import("@tellescope/types-models").EnduserStatusUpdate_readonly & {
        id: string;
        createdAt: Date;
    };
    enduser_observations: import("@tellescope/types-models").EnduserObservation_readonly & {
        id: string;
        createdAt: Date;
    };
    managed_content_records: import("@tellescope/types-models").ManagedContentRecord_readonly & {
        id: string;
        createdAt: Date;
    };
    managed_content_record_assignments: import("@tellescope/types-models").ManagedContentRecordAssignment_readonly & {
        id: string;
        createdAt: Date;
    };
    forums: import("@tellescope/types-models").Forum_readonly & {
        id: string;
        createdAt: Date;
    };
    forum_posts: import("@tellescope/types-models").ForumPost_readonly & {
        id: string;
        createdAt: Date;
    };
    post_likes: import("@tellescope/types-models").PostLike_readonly & {
        id: string;
        createdAt: Date;
    };
    comment_likes: import("@tellescope/types-models").CommentLike_readonly & {
        id: string;
        createdAt: Date;
    };
    post_comments: import("@tellescope/types-models").PostComment_readonly & {
        id: string;
        createdAt: Date;
    };
    organizations: import("@tellescope/types-models").Organization_readonly & {
        id: string;
        createdAt: Date;
    };
    integrations: import("@tellescope/types-models").Integration_readonly & {
        id: string;
        createdAt: Date;
    };
    databases: import("@tellescope/types-models").Database_readonly & {
        id: string;
        createdAt: Date;
    };
    database_records: import("@tellescope/types-models").DatabaseRecord_readonly & {
        id: string;
        createdAt: Date;
    };
    portal_customizations: import("@tellescope/types-models").PortalCustomization_readonly & {
        id: string;
        createdAt: Date;
    };
    enduser_tasks: import("@tellescope/types-models").EnduserTask_readonly & {
        id: string;
        createdAt: Date;
    };
    care_plans: import("@tellescope/types-models").CarePlan_readonly & {
        id: string;
        createdAt: Date;
    };
    role_based_access_permissions: import("@tellescope/types-models").RoleBasedAccessPermission_readonly & {
        id: string;
        createdAt: Date;
    };
    appointment_booking_pages: import("@tellescope/types-models").AppointmentBookingPage_readonly & {
        id: string;
        createdAt: Date;
    };
    appointment_locations: import("@tellescope/types-models").AppointmentLocation_readonly & {
        id: string;
        createdAt: Date;
    };
    products: import("@tellescope/types-models").Product_readonly & {
        id: string;
        createdAt: Date;
    };
    purchases: import("@tellescope/types-models").Purchase_readonly & {
        id: string;
        createdAt: Date;
    };
    purchase_credits: import("@tellescope/types-models").PurchaseCredit_readonly & {
        id: string;
        createdAt: Date;
    };
    phone_calls: import("@tellescope/types-models").PhoneCall_readonly & {
        id: string;
        createdAt: Date;
    };
    enduser_profile_views: import("@tellescope/types-models").EnduserProfileView_readonly & {
        id: string;
        createdAt: Date;
    };
    table_views: import("@tellescope/types-models").TableView_readonly & {
        id: string;
        createdAt: Date;
    };
    email_sync_denials: import("@tellescope/types-models").EmailSyncDenial_readonly & {
        id: string;
        createdAt: Date;
    };
}[N] | keyof {
    inbox_threads: import("@tellescope/types-models").InboxThread_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    ai_conversations: import("@tellescope/types-models").AIConversation_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    waitlists: import("@tellescope/types-models").Waitlist_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    agent_records: import("@tellescope/types-models").AgentRecord_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    enduser_eligibility_results: import("@tellescope/types-models").EnduserEligibilityResult_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    integration_logs: import("@tellescope/types-models").IntegrationLog_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    allergy_codes: import("@tellescope/types-models").AllergyCode_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    diagnosis_codes: import("@tellescope/types-models").DiagnosisCode_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    suggested_contacts: import("@tellescope/types-models").SuggestedContact_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    call_hold_queues: import("@tellescope/types-models").CallHoldQueue_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    fax_logs: import("@tellescope/types-models").FaxLog_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    message_template_snippets: import("@tellescope/types-models").MessageTemplateSnippet_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    portal_brandings: import("@tellescope/types-models").PortalBranding_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    form_groups: import("@tellescope/types-models").FormGroup_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    webhook_logs: import("@tellescope/types-models").WebhookLog_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    flowchart_notes: import("@tellescope/types-models").FlowchartNote_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    enduser_problems: import("@tellescope/types-models").EnduserProblem_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    prescription_routes: import("@tellescope/types-models").PrescriptionRoute_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    blocked_phones: import("@tellescope/types-models").BlockedPhone_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    vital_configurations: import("@tellescope/types-models").VitalConfiguration_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    enduser_encounters: import("@tellescope/types-models").EnduserEncounter_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    enduser_orders: import("@tellescope/types-models").EnduserOrder_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    group_mms_conversations: import("@tellescope/types-models").GroupMMSConversation_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    ticket_queues: import("@tellescope/types-models").TicketQueue_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    configurations: import("@tellescope/types-models").Configuration_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    ticket_threads: import("@tellescope/types-models").TicketThread_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    ticket_thread_comments: import("@tellescope/types-models").TicketThreadComment_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    enduser_custom_types: import("@tellescope/types-models").EnduserCustomType_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    phone_trees: import("@tellescope/types-models").PhoneTree_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    enduser_medications: import("@tellescope/types-models").EnduserMedication_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    superbill_providers: import("@tellescope/types-models").SuperbillProvider_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    superbills: import("@tellescope/types-models").Superbill_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    automation_triggers: import("@tellescope/types-models").AutomationTrigger_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    background_errors: import("@tellescope/types-models").BackgroundError_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    enduser_views: import("@tellescope/types-models").EnduserView_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    availability_blocks: import("@tellescope/types-models").AvailabilityBlock_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    analytics_frames: import("@tellescope/types-models").AnalyticsFrame_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    endusers: import("@tellescope/types-models").Enduser_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    engagement_events: import("@tellescope/types-models").EngagementEvent_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    journeys: import("@tellescope/types-models").Journey_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    api_keys: import("@tellescope/types-models").APIKey_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    emails: import("@tellescope/types-models").Email_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    sms_messages: import("@tellescope/types-models").SMSMessage_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    chat_rooms: import("@tellescope/types-models").ChatRoom_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    chats: import("@tellescope/types-models").ChatMessage_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    users: import("@tellescope/types-models").User_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    templates: import("@tellescope/types-models").MessageTemplate_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    files: import("@tellescope/types-models").File_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    tickets: import("@tellescope/types-models").Ticket_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    meetings: import("@tellescope/types-models").Meeting_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    notes: import("@tellescope/types-models").Note_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    forms: import("@tellescope/types-models").Form_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    form_fields: import("@tellescope/types-models").FormField_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    form_responses: import("@tellescope/types-models").FormResponse_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    calendar_events: import("@tellescope/types-models").CalendarEvent_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    calendar_event_templates: import("@tellescope/types-models").CalendarEventTemplate_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    calendar_event_RSVPs: import("@tellescope/types-models").CalendarEventRSVP_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    automation_steps: import("@tellescope/types-models").AutomationStep_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    automated_actions: import("@tellescope/types-models").AutomatedAction_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    webhooks: import("@tellescope/types-models").WebHook_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    user_logs: import("@tellescope/types-models").UserLog_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    user_notifications: import("@tellescope/types-models").UserNotification_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    enduser_status_updates: import("@tellescope/types-models").EnduserStatusUpdate_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    enduser_observations: import("@tellescope/types-models").EnduserObservation_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    managed_content_records: import("@tellescope/types-models").ManagedContentRecord_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    managed_content_record_assignments: import("@tellescope/types-models").ManagedContentRecordAssignment_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    forums: import("@tellescope/types-models").Forum_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    forum_posts: import("@tellescope/types-models").ForumPost_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    post_likes: import("@tellescope/types-models").PostLike_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    comment_likes: import("@tellescope/types-models").CommentLike_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    post_comments: import("@tellescope/types-models").PostComment_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    organizations: import("@tellescope/types-models").Organization_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    integrations: import("@tellescope/types-models").Integration_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    databases: import("@tellescope/types-models").Database_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    database_records: import("@tellescope/types-models").DatabaseRecord_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    portal_customizations: import("@tellescope/types-models").PortalCustomization_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    enduser_tasks: import("@tellescope/types-models").EnduserTask_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    care_plans: import("@tellescope/types-models").CarePlan_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    role_based_access_permissions: import("@tellescope/types-models").RoleBasedAccessPermission_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    appointment_booking_pages: import("@tellescope/types-models").AppointmentBookingPage_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    appointment_locations: import("@tellescope/types-models").AppointmentLocation_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    products: import("@tellescope/types-models").Product_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    purchases: import("@tellescope/types-models").Purchase_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    purchase_credits: import("@tellescope/types-models").PurchaseCredit_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    phone_calls: import("@tellescope/types-models").PhoneCall_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    enduser_profile_views: import("@tellescope/types-models").EnduserProfileView_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    table_views: import("@tellescope/types-models").TableView_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
    email_sync_denials: import("@tellescope/types-models").EmailSyncDenial_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
}[N]> & {
    organizationIds?: string[] | undefined;
    sharedWithOrganizations?: string[][] | undefined;
}>;
type Queries = {
    [K in keyof ClientModelForName]: APIQuery<K>;
} & {
    inbox_threads: {
        build_threads: (args: extractFields<CustomActions['inbox_threads']['build_threads']['parameters']>) => (Promise<extractFields<CustomActions['inbox_threads']['build_threads']['returns']>>);
        load_threads: (args: extractFields<CustomActions['inbox_threads']['load_threads']['parameters']>) => (Promise<extractFields<CustomActions['inbox_threads']['load_threads']['returns']>>);
    };
    availability_blocks: {
        update_order: (args: extractFields<CustomActions['availability_blocks']['update_order']['parameters']>) => (Promise<extractFields<CustomActions['availability_blocks']['update_order']['returns']>>);
        handle_autoreply: (args: extractFields<CustomActions['availability_blocks']['handle_autoreply']['parameters']>) => (Promise<extractFields<CustomActions['availability_blocks']['handle_autoreply']['returns']>>);
    };
    journeys: {
        delete_states: (args: extractFields<CustomActions['journeys']['delete_states']['parameters']>) => Promise<extractFields<CustomActions['journeys']['delete_states']['returns']>>;
        handle_incoming_communication: (args: extractFields<CustomActions['journeys']['handle_incoming_communication']['parameters']>) => (Promise<extractFields<CustomActions['journeys']['handle_incoming_communication']['returns']>>);
        get_journey_statistics: (args: extractFields<CustomActions['journeys']['get_journey_statistics']['parameters']>) => (Promise<extractFields<CustomActions['journeys']['get_journey_statistics']['returns']>>);
    };
    enduser_orders: {
        get_available_tests: (args: extractFields<CustomActions['enduser_orders']['get_available_tests']['parameters']>) => (Promise<extractFields<CustomActions['enduser_orders']['get_available_tests']['returns']>>);
        create_lab_order: (args: extractFields<CustomActions['enduser_orders']['create_lab_order']['parameters']>) => (Promise<extractFields<CustomActions['enduser_orders']['create_lab_order']['returns']>>);
        cancel_order: (args: extractFields<CustomActions['enduser_orders']['cancel_order']['parameters']>) => (Promise<extractFields<CustomActions['enduser_orders']['cancel_order']['returns']>>);
        create_go_go_meds_order: (args: extractFields<CustomActions['enduser_orders']['create_go_go_meds_order']['parameters']>) => (Promise<extractFields<CustomActions['enduser_orders']['create_go_go_meds_order']['returns']>>);
        create_smart_meter_order: (args: extractFields<CustomActions['enduser_orders']['create_smart_meter_order']['parameters']>) => (Promise<extractFields<CustomActions['enduser_orders']['create_smart_meter_order']['returns']>>);
    };
    enduser_encounters: {
        create_candid_encounter: (args: extractFields<CustomActions['enduser_encounters']['create_candid_encounter']['parameters']>) => (Promise<extractFields<CustomActions['enduser_encounters']['create_candid_encounter']['returns']>>);
    };
    purchases: {
        charge_card_on_file: (args: extractFields<CustomActions['purchases']['charge_card_on_file']['parameters']>) => (Promise<extractFields<CustomActions['purchases']['charge_card_on_file']['returns']>>);
    };
    forms: {
        get_form_statistics: (args: extractFields<CustomActions['forms']['get_form_statistics']['parameters']>) => (Promise<extractFields<CustomActions['forms']['get_form_statistics']['returns']>>);
    };
    phone_trees: {
        start_outbound_call: (args: extractFields<CustomActions['phone_trees']['start_outbound_call']['parameters']>) => (Promise<extractFields<CustomActions['phone_trees']['start_outbound_call']['returns']>>);
    };
    call_hold_queues: {
        answer_call: (args: extractFields<CustomActions['call_hold_queues']['answer_call']['parameters']>) => (Promise<extractFields<CustomActions['call_hold_queues']['answer_call']['returns']>>);
        get_details: (args: extractFields<CustomActions['call_hold_queues']['get_details']['parameters']>) => (Promise<extractFields<CustomActions['call_hold_queues']['get_details']['returns']>>);
    };
    enduser_observations: {
        load: (args: extractFields<CustomActions['enduser_observations']['load']['parameters']>) => (Promise<extractFields<CustomActions['enduser_observations']['load']['returns']>>);
        acknowledge: (args: extractFields<CustomActions['enduser_observations']['acknowledge']['parameters']>) => (Promise<extractFields<CustomActions['enduser_observations']['acknowledge']['returns']>>);
    };
    endusers: {
        customer_io_sync: (args: extractFields<CustomActions['endusers']['customer_io_sync']['parameters']>) => (Promise<extractFields<CustomActions['endusers']['customer_io_sync']['returns']>>);
        rename_stored_custom_fields: (args: extractFields<CustomActions['endusers']['rename_stored_custom_fields']['parameters']>) => (Promise<extractFields<CustomActions['endusers']['rename_stored_custom_fields']['returns']>>);
        add_to_healthie_course: (args: extractFields<CustomActions['endusers']['add_to_healthie_course']['parameters']>) => (Promise<extractFields<CustomActions['endusers']['add_to_healthie_course']['returns']>>);
        dosespot: (args: extractFields<CustomActions['endusers']['dosespot']['parameters']>) => (Promise<extractFields<CustomActions['endusers']['dosespot']['returns']>>);
        check_eligibility: (args: extractFields<CustomActions['endusers']['check_eligibility']['parameters']>) => (Promise<extractFields<CustomActions['endusers']['check_eligibility']['returns']>>);
        set_password: (args: {
            id: string;
            password: string;
        }) => Promise<void>;
        is_authenticated: (args: {
            id?: string;
            authToken: string;
        }) => Promise<{
            isAuthenticated: boolean;
            enduser: Enduser;
        }>;
        generate_auth_token: (args: extractFields<CustomActions['endusers']['generate_auth_token']['parameters']>) => (Promise<extractFields<CustomActions['endusers']['generate_auth_token']['returns']>>);
        add_to_journey: (args: extractFields<CustomActions['endusers']['add_to_journey']['parameters']>) => (Promise<extractFields<CustomActions['endusers']['add_to_journey']['returns']>>);
        remove_from_journey: (args: extractFields<CustomActions['endusers']['remove_from_journey']['parameters']>) => (Promise<extractFields<CustomActions['endusers']['remove_from_journey']['returns']>>);
        merge: (args: extractFields<CustomActions['endusers']['merge']['parameters']>) => (Promise<extractFields<CustomActions['endusers']['merge']['returns']>>);
        push: (args: extractFields<CustomActions['endusers']['push']['parameters']>) => (Promise<extractFields<CustomActions['endusers']['push']['returns']>>);
        bulk_update: (args: extractFields<CustomActions['endusers']['bulk_update']['parameters']>) => (Promise<extractFields<CustomActions['endusers']['bulk_update']['returns']>>);
        bulk_assignment: (args: extractFields<CustomActions['endusers']['bulk_assignment']['parameters']>) => (Promise<extractFields<CustomActions['endusers']['bulk_assignment']['returns']>>);
        related_contacts_report: (args: extractFields<CustomActions['endusers']['related_contacts_report']['parameters']>) => (Promise<extractFields<CustomActions['endusers']['related_contacts_report']['returns']>>);
        get_report: (args: extractFields<CustomActions['endusers']['get_report']['parameters']>) => (Promise<extractFields<CustomActions['endusers']['get_report']['returns']>>);
        get_engagement_statistics: (args: extractFields<CustomActions['endusers']['get_engagement_statistics']['parameters']>) => (Promise<extractFields<CustomActions['endusers']['get_engagement_statistics']['returns']>>);
        get_engagement_statistics_by_userId: (args: extractFields<CustomActions['endusers']['get_engagement_statistics_by_userId']['parameters']>) => (Promise<extractFields<CustomActions['endusers']['get_engagement_statistics_by_userId']['returns']>>);
        sync_zendesk: (args: extractFields<CustomActions['endusers']['sync_zendesk']['parameters']>) => (Promise<extractFields<CustomActions['endusers']['sync_zendesk']['returns']>>);
        get_journeys_report: (args: extractFields<CustomActions['endusers']['get_journeys_report']['parameters']>) => (Promise<extractFields<CustomActions['endusers']['get_journeys_report']['returns']>>);
        load_inbox_data: (args: extractFields<CustomActions['endusers']['load_inbox_data']['parameters']>) => (Promise<extractFields<CustomActions['endusers']['load_inbox_data']['returns']>>);
    };
    users: {
        begin_sso: (args: extractFields<PublicActions['users']['begin_sso']['parameters']>) => (Promise<extractFields<PublicActions['users']['begin_sso']['returns']>>);
        complete_sso: (args: extractFields<PublicActions['users']['complete_sso']['parameters']>) => (Promise<extractFields<PublicActions['users']['complete_sso']['returns']>>);
        display_names: () => Promise<{
            fname: string;
            lname: string;
            id: string;
        }[]>;
        submit_email_verification: (args: extractFields<PublicActions['users']['submit_email_verification']['parameters']>) => (Promise<extractFields<PublicActions['users']['submit_email_verification']['returns']>>);
        register: (args: extractFields<PublicActions['users']['register']['parameters']>) => (Promise<extractFields<PublicActions['users']['register']['returns']>>);
        login: (args: extractFields<PublicActions['users']['login']['parameters']>) => (Promise<extractFields<PublicActions['users']['login']['returns']>>);
        login_with_google: (args: extractFields<PublicActions['users']['login_with_google']['parameters']>) => (Promise<extractFields<PublicActions['users']['login_with_google']['returns']>>);
        request_password_reset: (args: extractFields<PublicActions['users']['request_password_reset']['parameters']>) => Promise<extractFields<PublicActions['users']['request_password_reset']['returns']>>;
        reset_password: (args: extractFields<PublicActions['users']['reset_password']['parameters']>) => Promise<extractFields<PublicActions['users']['reset_password']['returns']>>;
        generate_auth_token: (args?: extractFields<CustomActions['users']['generate_auth_token']['parameters']>) => (Promise<extractFields<CustomActions['users']['generate_auth_token']['returns']>>);
        send_invitation_to_existing: (args: extractFields<CustomActions['users']['send_invitation_to_existing']['parameters']>) => (Promise<extractFields<CustomActions['users']['send_invitation_to_existing']['returns']>>);
        invite_user: (args: extractFields<CustomActions['users']['invite_user']['parameters']>) => (Promise<extractFields<CustomActions['users']['invite_user']['returns']>>);
        configure_inbox: (args: extractFields<CustomActions['users']['configure_inbox']['parameters']>) => (Promise<extractFields<CustomActions['users']['configure_inbox']['returns']>>);
        consent: (args: extractFields<CustomActions['users']['consent']['parameters']>) => (Promise<extractFields<CustomActions['users']['consent']['returns']>>);
        configure_MFA: (args: extractFields<CustomActions['users']['configure_MFA']['parameters']>) => (Promise<extractFields<CustomActions['users']['configure_MFA']['returns']>>);
        generate_MFA_challenge: (args: extractFields<CustomActions['users']['generate_MFA_challenge']['parameters']>) => (Promise<extractFields<CustomActions['users']['generate_MFA_challenge']['returns']>>);
        submit_MFA_challenge: (args: extractFields<CustomActions['users']['submit_MFA_challenge']['parameters']>) => (Promise<extractFields<CustomActions['users']['submit_MFA_challenge']['returns']>>);
        get_engagement_report: (args: extractFields<CustomActions['users']['get_engagement_report']['parameters']>) => (Promise<extractFields<CustomActions['users']['get_engagement_report']['returns']>>);
        get_users_for_groups: (args: extractFields<CustomActions['users']['get_users_for_groups']['parameters']>) => (Promise<extractFields<CustomActions['users']['get_users_for_groups']['returns']>>);
        play_phone_message: (args: extractFields<CustomActions['users']['play_phone_message']['parameters']>) => (Promise<extractFields<CustomActions['users']['play_phone_message']['returns']>>);
    };
    files: {
        prepare_file_upload: (args: extractFields<CustomActions['files']['prepare_file_upload']['parameters']>) => (Promise<extractFields<CustomActions['files']['prepare_file_upload']['returns']>>);
        confirm_file_upload: (args: extractFields<CustomActions['files']['confirm_file_upload']['parameters']>) => (Promise<extractFields<CustomActions['files']['confirm_file_upload']['returns']>>);
        send_fax: (args: extractFields<CustomActions['files']['send_fax']['parameters']>) => (Promise<extractFields<CustomActions['files']['send_fax']['returns']>>);
        file_download_URL: (args: extractFields<CustomActions['files']['file_download_URL']['parameters']>) => (Promise<extractFields<CustomActions['files']['file_download_URL']['returns']>>);
        run_ocr: (args: extractFields<CustomActions['files']['run_ocr']['parameters']>) => (Promise<extractFields<CustomActions['files']['run_ocr']['returns']>>);
        push: (args: extractFields<CustomActions['files']['push']['parameters']>) => (Promise<extractFields<CustomActions['files']['push']['returns']>>);
    };
    form_fields: {
        load_choices_from_database: (args: extractFields<CustomActions['form_fields']['load_choices_from_database']['parameters']>) => (Promise<extractFields<CustomActions['form_fields']['load_choices_from_database']['returns']>>);
        booking_info: (args: extractFields<CustomActions['form_fields']['booking_info']['parameters']>) => (Promise<extractFields<CustomActions['form_fields']['booking_info']['returns']>>);
    };
    form_responses: {
        submit_form_response: (args: extractFields<CustomActions['form_responses']['submit_form_response']['parameters']>) => (Promise<extractFields<CustomActions['form_responses']['submit_form_response']['returns']>>);
        save_field_response: (args: extractFields<CustomActions['form_responses']['save_field_response']['parameters']>) => (Promise<extractFields<CustomActions['form_responses']['save_field_response']['returns']>>);
        prepare_form_response: (args: extractFields<CustomActions['form_responses']['prepare_form_response']['parameters']>) => (Promise<extractFields<CustomActions['form_responses']['prepare_form_response']['returns']>>);
        info_for_access_code: (args: extractFields<CustomActions['form_responses']['info_for_access_code']['parameters']>) => (Promise<extractFields<CustomActions['form_responses']['info_for_access_code']['returns']>>);
        stripe_details: (args: extractFields<CustomActions['form_responses']['stripe_details']['parameters']>) => (Promise<extractFields<CustomActions['form_responses']['stripe_details']['returns']>>);
        chargebee_details: (args: extractFields<CustomActions['form_responses']['chargebee_details']['parameters']>) => (Promise<extractFields<CustomActions['form_responses']['chargebee_details']['returns']>>);
        generate_pdf: (args: extractFields<CustomActions['form_responses']['generate_pdf']['parameters']>) => (Promise<extractFields<CustomActions['form_responses']['generate_pdf']['returns']>>);
        push_to_EHR: (args: extractFields<CustomActions['form_responses']['push_to_EHR']['parameters']>) => (Promise<extractFields<CustomActions['form_responses']['push_to_EHR']['returns']>>);
        create_canvas_note: (args: extractFields<CustomActions['form_responses']['create_canvas_note']['parameters']>) => (Promise<extractFields<CustomActions['form_responses']['create_canvas_note']['returns']>>);
        get_report: (args: extractFields<CustomActions['form_responses']['get_report']['parameters']>) => (Promise<extractFields<CustomActions['form_responses']['get_report']['returns']>>);
        get_related_forms_report: (args: extractFields<CustomActions['form_responses']['get_related_forms_report']['parameters']>) => (Promise<extractFields<CustomActions['form_responses']['get_related_forms_report']['returns']>>);
        get_report_as_post: (args: extractFields<CustomActions['form_responses']['get_report']['parameters']>) => (Promise<extractFields<CustomActions['form_responses']['get_report']['returns']>>);
        get_enduser_statistics: (args: extractFields<CustomActions['form_responses']['get_enduser_statistics']['parameters']>) => (Promise<extractFields<CustomActions['form_responses']['get_enduser_statistics']['returns']>>);
        get_enduser_statistics_by_submitter: (args: extractFields<CustomActions['form_responses']['get_enduser_statistics_by_submitter']['parameters']>) => (Promise<extractFields<CustomActions['form_responses']['get_enduser_statistics_by_submitter']['returns']>>);
        get_distribution_report: (args: extractFields<CustomActions['form_responses']['get_distribution_report']['parameters']>) => (Promise<extractFields<CustomActions['form_responses']['get_distribution_report']['returns']>>);
    };
    meetings: {
        start_meeting: (args?: extractFields<CustomActions['meetings']['start_meeting']['parameters']>) => (Promise<extractFields<CustomActions['meetings']['start_meeting']['returns']>>);
        end_meeting: (args: {
            id: string;
        }) => Promise<void>;
        add_attendees_to_meeting: (args: {
            id: string;
            attendees: UserIdentity[];
        }) => Promise<void>;
        my_meetings: () => Promise<Meeting[]>;
        attendee_info: (args: {
            id: string;
        }) => Promise<{
            attendee: Attendee;
            others: UserIdentity[];
        }>;
        send_invite: (args: extractFields<CustomActions['meetings']['send_invite']['parameters']>) => (Promise<extractFields<CustomActions['meetings']['send_invite']['returns']>>);
        start_meeting_for_event: (args?: extractFields<CustomActions['meetings']['start_meeting_for_event']['parameters']>) => (Promise<extractFields<CustomActions['meetings']['start_meeting_for_event']['returns']>>);
        join_meeting_for_event: (args?: extractFields<CustomActions['meetings']['join_meeting_for_event']['parameters']>) => (Promise<extractFields<CustomActions['meetings']['join_meeting_for_event']['returns']>>);
    };
    chat_rooms: {
        join_room: (args: {
            id: string;
        }) => Promise<{
            room: ChatRoom;
        }>;
        mark_read: (args: extractFields<CustomActions['chat_rooms']['mark_read']['parameters']>) => (Promise<extractFields<CustomActions['chat_rooms']['mark_read']['returns']>>);
        send_healthie_chat: (args: extractFields<CustomActions['chat_rooms']['send_healthie_chat']['parameters']>) => (Promise<extractFields<CustomActions['chat_rooms']['send_healthie_chat']['returns']>>);
        display_info: (args: extractFields<CustomActions['chat_rooms']['display_info']['parameters']>) => Promise<extractFields<CustomActions['chat_rooms']['display_info']['returns']>>;
    };
    webhooks: {
        configure: (args: {
            url: string;
            secret: string;
            subscriptions?: WebhookSubscriptionsType;
        }) => Promise<void>;
        update: (args: {
            url?: string;
            secret?: string;
            subscriptionUpdates?: WebhookSubscriptionsType;
        }) => Promise<void>;
        send_automation_webhook: (args: extractFields<CustomActions['webhooks']['send_automation_webhook']['parameters']>) => Promise<extractFields<CustomActions['webhooks']['send_automation_webhook']['returns']>>;
        get_configuration: (args: extractFields<CustomActions['webhooks']['get_configuration']['parameters']>) => Promise<extractFields<CustomActions['webhooks']['get_configuration']['returns']>>;
    };
    user_notifications: {
        send_user_email_notification: (args: extractFields<CustomActions['user_notifications']['send_user_email_notification']['parameters']>) => Promise<extractFields<CustomActions['user_notifications']['send_user_email_notification']['returns']>>;
        bulk_update: ((args: extractFields<CustomActions['user_notifications']['bulk_update']['parameters']>) => Promise<extractFields<CustomActions['user_notifications']['bulk_update']['returns']>>);
    };
    post_likes: {
        create: (args: extractFields<CustomActions['post_likes']['create']['parameters']>) => (Promise<extractFields<CustomActions['post_likes']['create']['returns']>>);
        unlike_post: (args: extractFields<CustomActions['post_likes']['unlike_post']['parameters']>) => (Promise<extractFields<CustomActions['post_likes']['unlike_post']['returns']>>);
    };
    organizations: {
        load_twilio_embed: (args: extractFields<CustomActions['organizations']['load_twilio_embed']['parameters']>) => (Promise<extractFields<CustomActions['organizations']['load_twilio_embed']['returns']>>);
        link_twilio: (args: extractFields<CustomActions['organizations']['link_twilio']['parameters']>) => (Promise<extractFields<CustomActions['organizations']['link_twilio']['returns']>>);
        sync_note_to_canvas: (args: extractFields<CustomActions['organizations']['sync_note_to_canvas']['parameters']>) => (Promise<extractFields<CustomActions['organizations']['sync_note_to_canvas']['returns']>>);
        add_athena_subscription: (args: extractFields<CustomActions['organizations']['add_athena_subscription']['parameters']>) => (Promise<extractFields<CustomActions['organizations']['add_athena_subscription']['returns']>>);
        sync_athena_subscription: (args: extractFields<CustomActions['organizations']['sync_athena_subscription']['parameters']>) => (Promise<extractFields<CustomActions['organizations']['sync_athena_subscription']['returns']>>);
        get_theme: (args: extractFields<PublicActions['organizations']['get_theme']['parameters']>) => (Promise<extractFields<PublicActions['organizations']['get_theme']['returns']>>);
        create_suborganization: (args: extractFields<CustomActions['organizations']['create_suborganization']['parameters']>) => (Promise<extractFields<CustomActions['organizations']['create_suborganization']['returns']>>);
        create_and_join: (args: extractFields<CustomActions['organizations']['create_and_join']['parameters']>) => (Promise<extractFields<CustomActions['organizations']['create_and_join']['returns']>>);
        /** @deprecated */ invite_user: (args: extractFields<CustomActions['users']['invite_user']['parameters']>) => (Promise<extractFields<CustomActions['users']['invite_user']['returns']>>);
    };
    integrations: {
        update_zoom: (args: extractFields<CustomActions['integrations']['update_zoom']['parameters']>) => (Promise<extractFields<CustomActions['integrations']['update_zoom']['returns']>>);
        proxy_read: (args: extractFields<CustomActions['integrations']['proxy_read']['parameters']>) => (Promise<extractFields<CustomActions['integrations']['proxy_read']['returns']>>);
        proxy_write: (args: extractFields<CustomActions['integrations']['proxy_write']['parameters']>) => (Promise<extractFields<CustomActions['integrations']['proxy_write']['returns']>>);
        load_payers: (args: extractFields<CustomActions['integrations']['load_payers']['parameters']>) => (Promise<extractFields<CustomActions['integrations']['load_payers']['returns']>>);
        generate_google_auth_url: (args: extractFields<CustomActions['integrations']['generate_google_auth_url']['parameters']>) => (Promise<extractFields<CustomActions['integrations']['generate_google_auth_url']['returns']>>);
        disconnect_google_integration: (args: extractFields<CustomActions['integrations']['disconnect_google_integration']['parameters']>) => (Promise<extractFields<CustomActions['integrations']['disconnect_google_integration']['returns']>>);
        generate_oauth2_auth_url: (args: extractFields<CustomActions['integrations']['generate_oauth2_auth_url']['parameters']>) => (Promise<extractFields<CustomActions['integrations']['generate_oauth2_auth_url']['returns']>>);
        disconnect_oauth2_integration: (args: extractFields<CustomActions['integrations']['disconnect_oauth2_integration']['parameters']>) => (Promise<extractFields<CustomActions['integrations']['disconnect_oauth2_integration']['returns']>>);
        refresh_oauth2_session: (args: extractFields<CustomActions['integrations']['refresh_oauth2_session']['parameters']>) => (Promise<extractFields<CustomActions['integrations']['refresh_oauth2_session']['returns']>>);
        connect_stripe: (args: extractFields<CustomActions['integrations']['connect_stripe']['parameters']>) => (Promise<extractFields<CustomActions['integrations']['connect_stripe']['returns']>>);
        add_api_key_integration: (args: extractFields<CustomActions['integrations']['add_api_key_integration']['parameters']>) => (Promise<extractFields<CustomActions['integrations']['add_api_key_integration']['returns']>>);
        remove_api_key_integration: (args: extractFields<CustomActions['integrations']['remove_api_key_integration']['parameters']>) => (Promise<extractFields<CustomActions['integrations']['remove_api_key_integration']['returns']>>);
        sync_ehr: (args: extractFields<CustomActions['integrations']['sync_ehr']['parameters']>) => (Promise<extractFields<CustomActions['integrations']['sync_ehr']['returns']>>);
        daily_sync: (args: extractFields<CustomActions['integrations']['daily_sync']['parameters']>) => (Promise<extractFields<CustomActions['integrations']['daily_sync']['returns']>>);
        connect_photon: (args: extractFields<CustomActions['integrations']['connect_photon']['parameters']>) => (Promise<extractFields<CustomActions['integrations']['connect_photon']['returns']>>);
        disconnect_photon: (args: extractFields<CustomActions['integrations']['disconnect_photon']['parameters']>) => (Promise<extractFields<CustomActions['integrations']['disconnect_photon']['returns']>>);
        connect_elation: (args: extractFields<CustomActions['integrations']['connect_elation']['parameters']>) => (Promise<extractFields<CustomActions['integrations']['connect_elation']['returns']>>);
        disconnect_elation: (args: extractFields<CustomActions['integrations']['disconnect_elation']['parameters']>) => (Promise<extractFields<CustomActions['integrations']['disconnect_elation']['returns']>>);
        connect_zendesk: (args: extractFields<CustomActions['integrations']['connect_zendesk']['parameters']>) => (Promise<extractFields<CustomActions['integrations']['connect_zendesk']['returns']>>);
        disconnect_zendesk: (args: extractFields<CustomActions['integrations']['disconnect_zendesk']['parameters']>) => (Promise<extractFields<CustomActions['integrations']['disconnect_zendesk']['returns']>>);
    };
    phone_calls: {
        authenticate_calling: (args: extractFields<CustomActions['phone_calls']['authenticate_calling']['parameters']>) => (Promise<extractFields<CustomActions['phone_calls']['authenticate_calling']['returns']>>);
        get_report: (args: extractFields<CustomActions['phone_calls']['get_report']['parameters']>) => (Promise<extractFields<CustomActions['phone_calls']['get_report']['returns']>>);
        upgrade_to_conference: (args: extractFields<CustomActions['phone_calls']['upgrade_to_conference']['parameters']>) => (Promise<extractFields<CustomActions['phone_calls']['upgrade_to_conference']['returns']>>);
        add_conference_attendees: (args: extractFields<CustomActions['phone_calls']['add_conference_attendees']['parameters']>) => (Promise<extractFields<CustomActions['phone_calls']['add_conference_attendees']['returns']>>);
        remove_conference_attendees: (args: extractFields<CustomActions['phone_calls']['remove_conference_attendees']['parameters']>) => (Promise<extractFields<CustomActions['phone_calls']['remove_conference_attendees']['returns']>>);
        end_conference: (args: extractFields<CustomActions['phone_calls']['end_conference']['parameters']>) => (Promise<extractFields<CustomActions['phone_calls']['end_conference']['returns']>>);
        cancel_recording: (args: extractFields<CustomActions['phone_calls']['cancel_recording']['parameters']>) => (Promise<extractFields<CustomActions['phone_calls']['cancel_recording']['returns']>>);
        delete_recordings: (args: extractFields<CustomActions['phone_calls']['delete_recordings']['parameters']>) => (Promise<extractFields<CustomActions['phone_calls']['delete_recordings']['returns']>>);
        get_number_report: (args: extractFields<CustomActions['phone_calls']['get_number_report']['parameters']>) => (Promise<extractFields<CustomActions['phone_calls']['get_number_report']['returns']>>);
    };
    sms_messages: {
        send_message_as_user_notification: (args: extractFields<CustomActions['sms_messages']['send_message_as_user_notification']['parameters']>) => (Promise<extractFields<CustomActions['sms_messages']['send_message_as_user_notification']['returns']>>);
        send_with_template: (args: extractFields<CustomActions['sms_messages']['send_with_template']['parameters']>) => (Promise<extractFields<CustomActions['sms_messages']['send_with_template']['returns']>>);
        send_message_to_number: (args: extractFields<CustomActions['sms_messages']['send_message_to_number']['parameters']>) => (Promise<extractFields<CustomActions['sms_messages']['send_message_to_number']['returns']>>);
        get_number_report: (args: extractFields<CustomActions['sms_messages']['get_number_report']['parameters']>) => (Promise<extractFields<CustomActions['sms_messages']['get_number_report']['returns']>>);
        get_template_report: (args: extractFields<CustomActions['sms_messages']['get_template_report']['parameters']>) => (Promise<extractFields<CustomActions['sms_messages']['get_template_report']['returns']>>);
    };
    templates: {
        get_templated_message: (args: extractFields<CustomActions['templates']['get_templated_message']['parameters']>) => (Promise<extractFields<CustomActions['templates']['get_templated_message']['returns']>>);
        get_suggested_reply: (args: extractFields<CustomActions['templates']['get_suggested_reply']['parameters']>) => (Promise<extractFields<CustomActions['templates']['get_suggested_reply']['returns']>>);
        create_embedding: (args: extractFields<CustomActions['templates']['create_embedding']['parameters']>) => (Promise<extractFields<CustomActions['templates']['create_embedding']['returns']>>);
        embedding_search: (args: extractFields<CustomActions['templates']['embedding_search']['parameters']>) => (Promise<extractFields<CustomActions['templates']['embedding_search']['returns']>>);
    };
    analytics_frames: {
        get_result_for_query: (args: extractFields<CustomActions['analytics_frames']['get_result_for_query']['parameters']>) => (Promise<extractFields<CustomActions['analytics_frames']['get_result_for_query']['returns']>>);
        get_custom_report: (args: extractFields<CustomActions['analytics_frames']['get_custom_report']['parameters']>) => (Promise<extractFields<CustomActions['analytics_frames']['get_custom_report']['returns']>>);
        custom_aggregation: (args: extractFields<CustomActions['analytics_frames']['custom_aggregation']['parameters']>) => (Promise<extractFields<CustomActions['analytics_frames']['custom_aggregation']['returns']>>);
        update_indexes: (args: extractFields<CustomActions['analytics_frames']['update_indexes']['parameters']>) => (Promise<extractFields<CustomActions['analytics_frames']['update_indexes']['returns']>>);
    };
    emails: {
        sync_integrations: (args: extractFields<CustomActions['emails']['sync_integrations']['parameters']>) => (Promise<extractFields<CustomActions['emails']['sync_integrations']['returns']>>);
        deliver_via_outlook: (args: extractFields<CustomActions['emails']['deliver_via_outlook']['parameters']>) => (Promise<extractFields<CustomActions['emails']['deliver_via_outlook']['returns']>>);
        deliver_via_iterable: (args: extractFields<CustomActions['emails']['deliver_via_iterable']['parameters']>) => (Promise<extractFields<CustomActions['emails']['deliver_via_iterable']['returns']>>);
        send_with_template: (args: extractFields<CustomActions['emails']['send_with_template']['parameters']>) => (Promise<extractFields<CustomActions['emails']['send_with_template']['returns']>>);
        get_template_report: (args: extractFields<CustomActions['emails']['get_template_report']['parameters']>) => (Promise<extractFields<CustomActions['emails']['get_template_report']['returns']>>);
    };
    calendar_events: {
        session_for_start_link: (args: extractFields<PublicActions['calendar_events']['session_for_start_link']['parameters']>) => (Promise<extractFields<PublicActions['calendar_events']['session_for_start_link']['returns']>>);
        push: (args: extractFields<CustomActions['calendar_events']['push']['parameters']>) => (Promise<extractFields<CustomActions['calendar_events']['push']['returns']>>);
        download_ics_file: (args: extractFields<CustomActions['calendar_events']['download_ics_file']['parameters']>) => (Promise<extractFields<CustomActions['calendar_events']['download_ics_file']['returns']>>);
        get_events_for_user: (args: extractFields<CustomActions['calendar_events']['get_events_for_user']['parameters']>) => (Promise<extractFields<CustomActions['calendar_events']['get_events_for_user']['returns']>>);
        load_events: (args: extractFields<CustomActions['calendar_events']['load_events']['parameters']>) => (Promise<extractFields<CustomActions['calendar_events']['load_events']['returns']>>);
        generate_zoom_meeting: (args: extractFields<CustomActions['calendar_events']['generate_zoom_meeting']['parameters']>) => (Promise<extractFields<CustomActions['calendar_events']['generate_zoom_meeting']['returns']>>);
        change_zoom_host: (args: extractFields<CustomActions['calendar_events']['change_zoom_host']['parameters']>) => (Promise<extractFields<CustomActions['calendar_events']['change_zoom_host']['returns']>>);
        generate_meeting_link: (args: extractFields<CustomActions['calendar_events']['generate_meeting_link']['parameters']>) => (Promise<extractFields<CustomActions['calendar_events']['generate_meeting_link']['returns']>>);
        get_report: (args: extractFields<CustomActions['calendar_events']['get_report']['parameters']>) => (Promise<extractFields<CustomActions['calendar_events']['get_report']['returns']>>);
        get_enduser_report: (args: extractFields<CustomActions['calendar_events']['get_enduser_report']['parameters']>) => (Promise<extractFields<CustomActions['calendar_events']['get_enduser_report']['returns']>>);
        get_status_report: (args: extractFields<CustomActions['calendar_events']['get_status_report']['parameters']>) => (Promise<extractFields<CustomActions['calendar_events']['get_status_report']['returns']>>);
        get_appointment_availability: (args: extractFields<CustomActions['calendar_events']['get_appointment_availability']['parameters']>) => (Promise<extractFields<CustomActions['calendar_events']['get_appointment_availability']['returns']>>);
    };
    managed_content_records: {
        load_unauthenticated: (args: extractFields<PublicActions['managed_content_records']['load_unauthenticated']['parameters']>) => (Promise<extractFields<PublicActions['managed_content_records']['load_unauthenticated']['returns']>>);
        generate_embedding: (args: extractFields<CustomActions['managed_content_records']['generate_embedding']['parameters']>) => (Promise<extractFields<CustomActions['managed_content_records']['generate_embedding']['returns']>>);
        search: (args: extractFields<CustomActions['managed_content_records']['search']['parameters']>) => (Promise<extractFields<CustomActions['managed_content_records']['search']['returns']>>);
        update_indexes: (args: extractFields<CustomActions['managed_content_records']['update_indexes']['parameters']>) => (Promise<extractFields<CustomActions['managed_content_records']['update_indexes']['returns']>>);
    };
    automation_triggers: {
        trigger_events: (args: extractFields<CustomActions['automation_triggers']['trigger_events']['parameters']>) => (Promise<extractFields<CustomActions['automation_triggers']['trigger_events']['returns']>>);
    };
    ticket_queues: {
        update_indexes: (args: extractFields<CustomActions['ticket_queues']['update_indexes']['parameters']>) => (Promise<extractFields<CustomActions['ticket_queues']['update_indexes']['returns']>>);
    };
    tickets: {
        bulk_assign: (args: extractFields<CustomActions['tickets']['bulk_assign']['parameters']>) => (Promise<extractFields<CustomActions['tickets']['bulk_assign']['returns']>>);
        bulk_delete: (args: extractFields<CustomActions['tickets']['bulk_delete']['parameters']>) => (Promise<extractFields<CustomActions['tickets']['bulk_delete']['returns']>>);
        update_indexes: (args: extractFields<CustomActions['tickets']['update_indexes']['parameters']>) => (Promise<extractFields<CustomActions['tickets']['update_indexes']['returns']>>);
        assign_from_queue: (args: extractFields<CustomActions['tickets']['assign_from_queue']['parameters']>) => (Promise<extractFields<CustomActions['tickets']['assign_from_queue']['returns']>>);
        get_report: (args: extractFields<CustomActions['tickets']['get_report']['parameters']>) => (Promise<extractFields<CustomActions['tickets']['get_report']['returns']>>);
        get_distribution_report: (args: extractFields<CustomActions['tickets']['get_distribution_report']['parameters']>) => (Promise<extractFields<CustomActions['tickets']['get_distribution_report']['returns']>>);
        close_ticket: (args: extractFields<CustomActions['tickets']['close_ticket']['parameters']>) => (Promise<extractFields<CustomActions['tickets']['close_ticket']['returns']>>);
    };
    appointment_booking_pages: {
        generate_access_token: (args: extractFields<CustomActions['appointment_booking_pages']['generate_access_token']['parameters']>) => (Promise<extractFields<CustomActions['appointment_booking_pages']['generate_access_token']['returns']>>);
    };
    products: {
        prepare_stripe_checkout: (args: extractFields<CustomActions['products']['prepare_stripe_checkout']['parameters']>) => (Promise<extractFields<CustomActions['products']['prepare_stripe_checkout']['returns']>>);
    };
    group_mms_conversations: {
        start_conversation: (args: extractFields<CustomActions['group_mms_conversations']['start_conversation']['parameters']>) => (Promise<extractFields<CustomActions['group_mms_conversations']['start_conversation']['returns']>>);
        send_message: (args: extractFields<CustomActions['group_mms_conversations']['send_message']['parameters']>) => (Promise<extractFields<CustomActions['group_mms_conversations']['send_message']['returns']>>);
    };
    enduser_eligibility_results: {
        develop_health_run_benefit_verification: (args: extractFields<CustomActions['enduser_eligibility_results']['develop_health_run_benefit_verification']['parameters']>) => (Promise<extractFields<CustomActions['enduser_eligibility_results']['develop_health_run_benefit_verification']['returns']>>);
    };
    agent_records: {
        submit_support_ticket: (args: extractFields<CustomActions['agent_records']['submit_support_ticket']['parameters']>) => (Promise<extractFields<CustomActions['agent_records']['submit_support_ticket']['returns']>>);
    };
    waitlists: {
        grant_access_from_waitlist: (args: extractFields<CustomActions['waitlists']['grant_access_from_waitlist']['parameters']>) => (Promise<extractFields<CustomActions['waitlists']['grant_access_from_waitlist']['returns']>>);
    };
    background_errors: {
        mark_read: (args: extractFields<CustomActions['background_errors']['mark_read']['parameters']>) => (Promise<extractFields<CustomActions['background_errors']['mark_read']['returns']>>);
    };
    ai_conversations: {
        send_message: (args: extractFields<CustomActions['ai_conversations']['send_message']['parameters']>) => (Promise<extractFields<CustomActions['ai_conversations']['send_message']['returns']>>);
        generate_ai_decision: (args: extractFields<CustomActions['ai_conversations']['generate_ai_decision']['parameters']>) => (Promise<extractFields<CustomActions['ai_conversations']['generate_ai_decision']['returns']>>);
    };
};
type UserInfo = User & {
    type: 'user';
    orgTwilioNumber?: string;
    dashboardView?: CustomDashboardView;
    ticketThreadsEnabled?: boolean;
    enduserDisplayName?: string;
    access: AccessPermissions;
    orgName?: string;
    limits?: OrganizationLimits;
    uiRestrictions?: UserUIRestrictions;
    requiresMFA?: boolean;
    hasTicketQueues?: boolean;
};
export type BulkLoadOptions = {
    lastId?: string;
    limit?: number;
    from?: Date;
    filter?: Record<string, any>;
    includeFields?: string[];
};
export declare class Session extends SessionManager {
    api: Queries;
    userInfo: UserInfo;
    type: SessionType;
    constructor(o?: SessionOptions & {
        userInfo?: UserInfo;
    });
    bulk_load: (args: {
        load: {
            model: ModelName;
            options?: BulkLoadOptions;
        }[];
    }) => Promise<{
        results: (null | {
            records: any[];
        })[];
    }>;
    _POST: <A, R = void>(endpoint: string, args?: A | undefined, authenticated?: boolean, o?: {
        withCredentials?: boolean;
    }) => Promise<R>;
    _GET: <A, R = void>(endpoint: string, params?: A | undefined, authenticated?: boolean, options?: {
        responseType?: 'arraybuffer';
    }) => Promise<R>;
    _PATCH: <A, R = void>(endpoint: string, params?: A | undefined, authenticated?: boolean) => Promise<R>;
    _DELETE: <A, R = void>(endpoint: string, args?: A | undefined, authenticated?: boolean) => Promise<R>;
    handle_new_session: ({ authToken, ...userInfo }: UserSession & {
        authToken: string;
    }) => Promise<{
        type: "user";
        source?: "api_key" | undefined;
        id: string;
        email: string;
        businessId: string;
        organizationIds: string[];
        organization: string;
        phone?: string | undefined;
        username?: string | undefined;
        orgEmail?: string | undefined;
        fname?: string | undefined;
        roles?: string[] | undefined;
        lname?: string | undefined;
        displayName?: string | undefined;
        avatar?: string | undefined;
        twilioNumber?: string | undefined;
        enduserDisplayName?: string | undefined;
        subscriptionExpiresAt: Date;
        subscriptionPeriod: number;
        access: AccessPermissions;
        orgName: string;
        orgTwilioNumber: string;
        defaultTwilioNumber?: string | undefined;
        ticketThreadsEnabled?: boolean | undefined;
        fromEmail?: string | undefined;
        verifiedEmail: boolean;
        wasAutomated: boolean;
        limits?: OrganizationLimits | undefined;
        uiRestrictions?: UserUIRestrictions | undefined;
        dashboardView?: CustomDashboardView | undefined;
        hasTicketQueues?: boolean | undefined;
        eat?: boolean | undefined;
        lockedOutUntil?: number | undefined;
        duration?: number | undefined;
        doseSpotUserId?: string | undefined;
        availablePhoneNumbers: string[];
        availableFromEmails: string[];
        isa?: boolean | undefined;
        iat: number;
        exp: number;
        allowedPaths?: string[] | undefined;
        requiresMFA?: boolean | undefined;
        inbox_threads?: number | undefined;
        ai_conversations?: number | undefined;
        waitlists?: number | undefined;
        agent_records?: number | undefined;
        enduser_eligibility_results?: number | undefined;
        integration_logs?: number | undefined;
        allergy_codes?: number | undefined;
        diagnosis_codes?: number | undefined;
        suggested_contacts?: number | undefined;
        call_hold_queues?: number | undefined;
        fax_logs?: number | undefined;
        message_template_snippets?: number | undefined;
        portal_brandings?: number | undefined;
        form_groups?: number | undefined;
        webhook_logs?: number | undefined;
        flowchart_notes?: number | undefined;
        enduser_problems?: number | undefined;
        prescription_routes?: number | undefined;
        blocked_phones?: number | undefined;
        vital_configurations?: number | undefined;
        enduser_encounters?: number | undefined;
        enduser_orders?: number | undefined;
        group_mms_conversations?: number | undefined;
        ticket_queues?: number | undefined;
        configurations?: number | undefined;
        ticket_threads?: number | undefined;
        ticket_thread_comments?: number | undefined;
        enduser_custom_types?: number | undefined;
        phone_trees?: number | undefined;
        enduser_medications?: number | undefined;
        superbill_providers?: number | undefined;
        superbills?: number | undefined;
        automation_triggers?: number | undefined;
        background_errors?: number | undefined;
        enduser_views?: number | undefined;
        availability_blocks?: number | undefined;
        analytics_frames?: number | undefined;
        endusers?: number | undefined;
        engagement_events?: number | undefined;
        journeys?: number | undefined;
        api_keys?: number | undefined;
        emails?: number | undefined;
        sms_messages?: number | undefined;
        chat_rooms?: number | undefined;
        chats?: number | undefined;
        users?: number | undefined;
        templates?: number | undefined;
        files?: number | undefined;
        tickets?: number | undefined;
        meetings?: number | undefined;
        notes?: number | undefined;
        forms?: number | undefined;
        form_fields?: number | undefined;
        form_responses?: number | undefined;
        calendar_events?: number | undefined;
        calendar_event_templates?: number | undefined;
        calendar_event_RSVPs?: number | undefined;
        automation_steps?: number | undefined;
        automated_actions?: number | undefined;
        webhooks?: number | undefined;
        user_logs?: number | undefined;
        user_notifications?: number | undefined;
        enduser_status_updates?: number | undefined;
        enduser_observations?: number | undefined;
        managed_content_records?: number | undefined;
        managed_content_record_assignments?: number | undefined;
        forums?: number | undefined;
        forum_posts?: number | undefined;
        post_likes?: number | undefined;
        comment_likes?: number | undefined;
        post_comments?: number | undefined;
        organizations?: number | undefined;
        integrations?: number | undefined;
        databases?: number | undefined;
        database_records?: number | undefined;
        portal_customizations?: number | undefined;
        enduser_tasks?: number | undefined;
        care_plans?: number | undefined;
        role_based_access_permissions?: number | undefined;
        appointment_booking_pages?: number | undefined;
        appointment_locations?: number | undefined;
        products?: number | undefined;
        purchases?: number | undefined;
        purchase_credits?: number | undefined;
        phone_calls?: number | undefined;
        enduser_profile_views?: number | undefined;
        table_views?: number | undefined;
        email_sync_denials?: number | undefined;
        authToken: string;
    }>;
    change_tenant: (args?: {
        all?: boolean;
        businessId?: string;
    }) => Promise<{
        user: UserSession;
        authToken: string;
    }>;
    refresh_session: (args?: {
        invalidatePreviousToken?: boolean;
    }) => Promise<{
        user: UserSession;
        authToken: string;
    }>;
    refresh_session_if_expiring_soon: () => Promise<{
        user: UserSession;
        authToken: string;
    } | undefined>;
    authenticate: (email: string, password: string, o?: {
        expirationInSeconds?: number;
    }) => Promise<{
        type: "user";
        source?: "api_key" | undefined;
        id: string;
        email: string;
        businessId: string;
        organizationIds: string[];
        organization: string;
        phone?: string | undefined;
        username?: string | undefined;
        orgEmail?: string | undefined;
        fname?: string | undefined;
        roles?: string[] | undefined;
        lname?: string | undefined;
        displayName?: string | undefined;
        avatar?: string | undefined;
        twilioNumber?: string | undefined;
        enduserDisplayName?: string | undefined;
        subscriptionExpiresAt: Date;
        subscriptionPeriod: number;
        access: AccessPermissions;
        orgName: string;
        orgTwilioNumber: string;
        defaultTwilioNumber?: string | undefined;
        ticketThreadsEnabled?: boolean | undefined;
        fromEmail?: string | undefined;
        verifiedEmail: boolean;
        wasAutomated: boolean;
        limits?: OrganizationLimits | undefined;
        uiRestrictions?: UserUIRestrictions | undefined;
        dashboardView?: CustomDashboardView | undefined;
        hasTicketQueues?: boolean | undefined;
        eat?: boolean | undefined;
        lockedOutUntil?: number | undefined;
        duration?: number | undefined;
        doseSpotUserId?: string | undefined;
        availablePhoneNumbers: string[];
        availableFromEmails: string[];
        isa?: boolean | undefined;
        iat: number;
        exp: number;
        allowedPaths?: string[] | undefined;
        requiresMFA?: boolean | undefined;
        inbox_threads?: number | undefined;
        ai_conversations?: number | undefined;
        waitlists?: number | undefined;
        agent_records?: number | undefined;
        enduser_eligibility_results?: number | undefined;
        integration_logs?: number | undefined;
        allergy_codes?: number | undefined;
        diagnosis_codes?: number | undefined;
        suggested_contacts?: number | undefined;
        call_hold_queues?: number | undefined;
        fax_logs?: number | undefined;
        message_template_snippets?: number | undefined;
        portal_brandings?: number | undefined;
        form_groups?: number | undefined;
        webhook_logs?: number | undefined;
        flowchart_notes?: number | undefined;
        enduser_problems?: number | undefined;
        prescription_routes?: number | undefined;
        blocked_phones?: number | undefined;
        vital_configurations?: number | undefined;
        enduser_encounters?: number | undefined;
        enduser_orders?: number | undefined;
        group_mms_conversations?: number | undefined;
        ticket_queues?: number | undefined;
        configurations?: number | undefined;
        ticket_threads?: number | undefined;
        ticket_thread_comments?: number | undefined;
        enduser_custom_types?: number | undefined;
        phone_trees?: number | undefined;
        enduser_medications?: number | undefined;
        superbill_providers?: number | undefined;
        superbills?: number | undefined;
        automation_triggers?: number | undefined;
        background_errors?: number | undefined;
        enduser_views?: number | undefined;
        availability_blocks?: number | undefined;
        analytics_frames?: number | undefined;
        endusers?: number | undefined;
        engagement_events?: number | undefined;
        journeys?: number | undefined;
        api_keys?: number | undefined;
        emails?: number | undefined;
        sms_messages?: number | undefined;
        chat_rooms?: number | undefined;
        chats?: number | undefined;
        users?: number | undefined;
        templates?: number | undefined;
        files?: number | undefined;
        tickets?: number | undefined;
        meetings?: number | undefined;
        notes?: number | undefined;
        forms?: number | undefined;
        form_fields?: number | undefined;
        form_responses?: number | undefined;
        calendar_events?: number | undefined;
        calendar_event_templates?: number | undefined;
        calendar_event_RSVPs?: number | undefined;
        automation_steps?: number | undefined;
        automated_actions?: number | undefined;
        webhooks?: number | undefined;
        user_logs?: number | undefined;
        user_notifications?: number | undefined;
        enduser_status_updates?: number | undefined;
        enduser_observations?: number | undefined;
        managed_content_records?: number | undefined;
        managed_content_record_assignments?: number | undefined;
        forums?: number | undefined;
        forum_posts?: number | undefined;
        post_likes?: number | undefined;
        comment_likes?: number | undefined;
        post_comments?: number | undefined;
        organizations?: number | undefined;
        integrations?: number | undefined;
        databases?: number | undefined;
        database_records?: number | undefined;
        portal_customizations?: number | undefined;
        enduser_tasks?: number | undefined;
        care_plans?: number | undefined;
        role_based_access_permissions?: number | undefined;
        appointment_booking_pages?: number | undefined;
        appointment_locations?: number | undefined;
        products?: number | undefined;
        purchases?: number | undefined;
        purchase_credits?: number | undefined;
        phone_calls?: number | undefined;
        enduser_profile_views?: number | undefined;
        table_views?: number | undefined;
        email_sync_denials?: number | undefined;
        authToken: string;
    }>;
    logout: () => Promise<void>;
    prepare_and_upload_file: (details: FileDetails & {
        publicRead?: boolean | undefined;
        publicName?: string | undefined;
        isCalledOut?: boolean | undefined;
        externalId?: string | undefined;
        source?: string | undefined;
    }, file: Blob | Buffer | ReactNativeFile) => Promise<import("@tellescope/types-models").File & {
        id: string;
        createdAt: Date;
    }>;
    reset_db: () => Promise<void>;
    test_online: () => Promise<string>;
    test_authenticated: () => Promise<string>;
    sync: (a: {
        from: Date;
    }) => Promise<{
        results: Pick<DataSyncRecord, 'modelName' | 'recordId' | 'data'>[];
    }>;
}
export { SessionOptions };
//# sourceMappingURL=sdk.d.ts.map