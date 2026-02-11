import { Session, SessionOptions } from "./session";
import { APIQuery } from "./sdk";
import { FileDetails, ReactNativeFile, S3PresignedPost, SessionType, UserIdentity } from "@tellescope/types-utilities";
import { Attendee } from "@tellescope/types-models";
import { ClientModelForName_required, Enduser, File, Meeting, UserDisplayInfo } from "@tellescope/types-client";
import { CustomActions, extractFields, PublicActions } from '@tellescope/schema';
export interface EnduserSessionOptions extends SessionOptions {
    enduser?: Enduser;
    businessId: string;
}
type EnduserAccessibleModels = ('endusers' | 'appointment_booking_pages' | 'users' | 'form_responses' | "chat_rooms" | 'chats' | 'files' | 'form_fields' | 'tickets' | 'calendar_events' | 'calendar_event_templates' | 'engagement_events' | "enduser_observations" | "forum_posts" | "forums" | "managed_content_records" | "managed_content_record_assignments" | "post_comments" | "post_likes" | "comment_likes" | 'meetings' | 'portal_customizations' | "calendar_event_RSVPs" | "care_plans" | "enduser_tasks" | 'integrations' | 'products' | 'purchases' | 'purchase_credits' | 'appointment_locations' | 'enduser_medications' | 'ticket_threads' | 'ticket_thread_comments' | 'enduser_orders' | 'enduser_problems' | 'diagnosis_codes' | 'allergy_codes' | 'forms' | 'enduser_eligibility_results');
export declare const defaultQueries: <N extends keyof import("@tellescope/types-models").ModelForName>(s: EnduserSession, n: keyof ClientModelForName_required) => APIQuery<N, {
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
    organization_payments: import("@tellescope/types-models").OrganizationPayment & {
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
    ticket_templates: import("@tellescope/types-models").TicketTemplate & {
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
    time_tracks: import("@tellescope/types-models").TimeTrack & {
        id: string;
        createdAt: Date;
    };
}[N], import("@tellescope/types-client").CreateFields<N, {
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
    organization_payments: import("@tellescope/types-models").OrganizationPayment & {
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
    ticket_templates: import("@tellescope/types-models").TicketTemplate & {
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
    time_tracks: import("@tellescope/types-models").TimeTrack & {
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
    organization_payments: import("@tellescope/types-models").OrganizationPayment & {
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
    ticket_templates: import("@tellescope/types-models").TicketTemplate & {
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
    time_tracks: import("@tellescope/types-models").TimeTrack & {
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
    organization_payments: import("@tellescope/types-models").OrganizationPayment_readonly & {
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
    ticket_templates: import("@tellescope/types-models").TicketTemplate_readonly & {
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
    time_tracks: import("@tellescope/types-models").TimeTrack_readonly & {
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
    organization_payments: import("@tellescope/types-models").OrganizationPayment_updatesDisabled & {
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
    ticket_templates: import("@tellescope/types-models").TicketTemplate_updatesDisabled & {
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
    time_tracks: import("@tellescope/types-models").TimeTrack_updatesDisabled & {
        id: string;
        createdAt: Date;
    };
}[N]> & {
    organizationIds?: string[] | undefined;
    sharedWithOrganizations?: string[][] | undefined;
}>;
type EnduserQueries = {
    [K in EnduserAccessibleModels]: APIQuery<K>;
} & {
    endusers: {
        logout: () => Promise<void>;
        current_session_info: () => Promise<extractFields<CustomActions['endusers']['current_session_info']['returns']>>;
        add_to_journey: (args: extractFields<CustomActions['endusers']['add_to_journey']['parameters']>) => (Promise<extractFields<CustomActions['endusers']['add_to_journey']['returns']>>);
        set_password: (args: extractFields<CustomActions['endusers']['set_password']['parameters']>) => (Promise<extractFields<CustomActions['endusers']['set_password']['returns']>>);
        unsubscribe: (args: extractFields<PublicActions['endusers']['unsubscribe']['parameters']>) => (Promise<extractFields<PublicActions['endusers']['unsubscribe']['returns']>>);
        get_otp_methods: (args: extractFields<PublicActions['endusers']['get_otp_methods']['parameters']>) => (Promise<extractFields<PublicActions['endusers']['get_otp_methods']['returns']>>);
        send_otp: (args: extractFields<PublicActions['endusers']['send_otp']['parameters']>) => (Promise<extractFields<PublicActions['endusers']['send_otp']['returns']>>);
        verify_otp: (args: extractFields<PublicActions['endusers']['verify_otp']['parameters']>) => (Promise<extractFields<PublicActions['endusers']['verify_otp']['returns']>>);
    };
    users: {
        display_info: () => Promise<UserDisplayInfo[]>;
    };
    files: {
        prepare_file_upload: (args: FileDetails & {
            externalId?: string;
            publicRead?: boolean;
            publicName?: string;
        }) => Promise<{
            presignedUpload: S3PresignedPost;
            file: File;
        }>;
        file_download_URL: (args: extractFields<CustomActions['files']['file_download_URL']['parameters']>) => Promise<extractFields<CustomActions['files']['file_download_URL']['returns']>>;
        confirm_file_upload: (args: extractFields<CustomActions['files']['confirm_file_upload']['parameters']>) => Promise<extractFields<CustomActions['files']['confirm_file_upload']['returns']>>;
    };
    form_fields: {
        load_choices_from_database: (args: extractFields<CustomActions['form_fields']['load_choices_from_database']['parameters']>) => (Promise<extractFields<CustomActions['form_fields']['load_choices_from_database']['returns']>>);
        booking_info: (args: extractFields<CustomActions['form_fields']['booking_info']['parameters']>) => (Promise<extractFields<CustomActions['form_fields']['booking_info']['returns']>>);
    };
    form_responses: {
        save_field_response: (args: extractFields<CustomActions['form_responses']['save_field_response']['parameters']>) => (Promise<extractFields<CustomActions['form_responses']['save_field_response']['returns']>>);
        submit_form_response: (args: extractFields<CustomActions['form_responses']['submit_form_response']['parameters']>) => (Promise<extractFields<CustomActions['form_responses']['submit_form_response']['returns']>>);
        prepare_form_response: (args: extractFields<CustomActions['form_responses']['prepare_form_response']['parameters']>) => (Promise<extractFields<CustomActions['form_responses']['prepare_form_response']['returns']>>);
        session_for_public_form: (args: extractFields<PublicActions['form_responses']['session_for_public_form']['parameters']>) => (Promise<extractFields<PublicActions['form_responses']['session_for_public_form']['returns']>>);
        info_for_access_code: (args: extractFields<CustomActions['form_responses']['info_for_access_code']['parameters']>) => (Promise<extractFields<CustomActions['form_responses']['info_for_access_code']['returns']>>);
        stripe_details: (args: extractFields<CustomActions['form_responses']['stripe_details']['parameters']>) => (Promise<extractFields<CustomActions['form_responses']['stripe_details']['returns']>>);
        chargebee_details: (args: extractFields<CustomActions['form_responses']['chargebee_details']['parameters']>) => (Promise<extractFields<CustomActions['form_responses']['chargebee_details']['returns']>>);
    };
    meetings: {
        attendee_info: (args: {
            id: string;
        }) => Promise<{
            attendee: Attendee;
            others: UserIdentity[];
        }>;
        my_meetings: () => Promise<Meeting[]>;
        join_meeting_for_event: (args?: extractFields<CustomActions['meetings']['join_meeting_for_event']['parameters']>) => (Promise<extractFields<CustomActions['meetings']['join_meeting_for_event']['returns']>>);
    };
    chat_rooms: {
        display_info: (args: extractFields<CustomActions['chat_rooms']['display_info']['parameters']>) => (Promise<extractFields<CustomActions['chat_rooms']['display_info']['returns']>>);
        mark_read: (args: extractFields<CustomActions['chat_rooms']['mark_read']['parameters']>) => (Promise<extractFields<CustomActions['chat_rooms']['mark_read']['returns']>>);
    };
    post_likes: {
        create: (args: extractFields<CustomActions['post_likes']['create']['parameters']>) => (Promise<extractFields<CustomActions['post_likes']['create']['returns']>>);
        unlike_post: (args: extractFields<CustomActions['post_likes']['unlike_post']['parameters']>) => (Promise<extractFields<CustomActions['post_likes']['unlike_post']['returns']>>);
    };
    organizations: {
        get_theme: (args: extractFields<PublicActions['organizations']['get_theme']['parameters']>) => (Promise<extractFields<PublicActions['organizations']['get_theme']['returns']>>);
    };
    sms_messages: {
        leave_message: (args: extractFields<PublicActions['sms_messages']['leave_message']['parameters']>) => (Promise<extractFields<PublicActions['sms_messages']['leave_message']['returns']>>);
    };
    calendar_events: {
        get_appointment_availability: (args: extractFields<CustomActions['calendar_events']['get_appointment_availability']['parameters']>) => (Promise<extractFields<CustomActions['calendar_events']['get_appointment_availability']['returns']>>);
        book_appointment: (args: extractFields<CustomActions['calendar_events']['book_appointment']['parameters']>) => (Promise<extractFields<CustomActions['calendar_events']['book_appointment']['returns']>>);
        stripe_details: (args: extractFields<CustomActions['calendar_events']['stripe_details']['parameters']>) => (Promise<extractFields<CustomActions['calendar_events']['stripe_details']['returns']>>);
        session_for_public_appointment_booking: (args: extractFields<PublicActions['calendar_events']['session_for_public_appointment_booking']['parameters']>) => (Promise<extractFields<PublicActions['calendar_events']['session_for_public_appointment_booking']['returns']>>);
        session_for_join_link: (args: extractFields<PublicActions['calendar_events']['session_for_join_link']['parameters']>) => (Promise<extractFields<PublicActions['calendar_events']['session_for_join_link']['returns']>>);
        details_for_appointment_booking_page: (args: extractFields<PublicActions['calendar_events']['details_for_appointment_booking_page']['parameters']>) => (Promise<extractFields<PublicActions['calendar_events']['details_for_appointment_booking_page']['returns']>>);
        download_ics_file: (args: extractFields<CustomActions['calendar_events']['download_ics_file']['parameters']>) => (Promise<extractFields<CustomActions['calendar_events']['download_ics_file']['returns']>>);
    };
    managed_content_records: {
        search: (args: extractFields<CustomActions['managed_content_records']['search']['parameters']>) => (Promise<extractFields<CustomActions['managed_content_records']['search']['returns']>>);
    };
    forms: {
        public_form_details: (args: extractFields<PublicActions['forms']['public_form_details']['parameters']>) => (Promise<extractFields<PublicActions['forms']['public_form_details']['returns']>>);
    };
    appointment_booking_pages: {
        validate_access_token: (args: extractFields<PublicActions['appointment_booking_pages']['validate_access_token']['parameters']>) => (Promise<extractFields<PublicActions['appointment_booking_pages']['validate_access_token']['returns']>>);
    };
    products: {
        prepare_stripe_checkout: (args: extractFields<CustomActions['products']['prepare_stripe_checkout']['parameters']>) => (Promise<extractFields<CustomActions['products']['prepare_stripe_checkout']['returns']>>);
        get_stripe_portal_session: (args: extractFields<CustomActions['products']['get_stripe_portal_session']['parameters']>) => (Promise<extractFields<CustomActions['products']['get_stripe_portal_session']['returns']>>);
    };
    integrations: {
        proxy_read: (args: extractFields<CustomActions['integrations']['proxy_read']['parameters']>) => (Promise<extractFields<CustomActions['integrations']['proxy_read']['returns']>>);
        proxy_write: (args: extractFields<CustomActions['integrations']['proxy_write']['parameters']>) => (Promise<extractFields<CustomActions['integrations']['proxy_write']['returns']>>);
    };
    enduser_observations: {
        load: (args: extractFields<CustomActions['enduser_observations']['load']['parameters']>) => (Promise<extractFields<CustomActions['enduser_observations']['load']['returns']>>);
    };
};
export type PublicAppointmentBookingInfo = extractFields<PublicActions['calendar_events']['details_for_appointment_booking_page']['returns']>;
export declare class EnduserSession extends Session {
    userInfo: Enduser & {
        passwordIsUnset?: boolean;
        denySocket?: boolean;
    };
    api: EnduserQueries;
    businessId: string;
    type: SessionType;
    constructor(o: EnduserSessionOptions);
    _POST: <A, R = void>(endpoint: string, args?: A | undefined, authenticated?: boolean) => Promise<R>;
    _GET: <A, R = void>(endpoint: string, params?: A | undefined, authenticated?: boolean, options?: {
        responseType?: 'arraybuffer';
    }) => Promise<R>;
    _PATCH: <A, R = void>(endpoint: string, params?: A | undefined, authenticated?: boolean) => Promise<R>;
    _DELETE: <A, R = void>(endpoint: string, args?: A | undefined, authenticated?: boolean) => Promise<R>;
    prepare_and_upload_file: (details: FileDetails & {
        publicRead?: boolean | undefined;
        publicName?: string | undefined;
        source?: string | undefined;
        externalId?: string | undefined;
    }, file: Blob | Buffer | ReactNativeFile) => Promise<import("@tellescope/types-models").File & {
        id: string;
        createdAt: Date;
    }>;
    handle_new_session: ({ authToken, enduser }: {
        authToken: string;
        enduser: Enduser;
    }) => Promise<{
        authToken: string;
        enduser: import("@tellescope/types-models").Enduser & {
            id: string;
            createdAt: Date;
        };
    }>;
    authenticate: (email: string, password: string, o?: {
        durationInSeconds?: number;
    }) => Promise<{
        authToken: string;
        enduser: import("@tellescope/types-models").Enduser & {
            id: string;
            createdAt: Date;
        };
    }>;
    begin_login_flow: (a: Omit<extractFields<PublicActions['endusers']['begin_login_flow']['parameters']>, 'businessId' | 'organizationIds'>) => Promise<{
        result: "continue-with-password" | "sent-email" | "sent-sms" | "requires-dob";
        email?: string | undefined;
        otpToken?: string | undefined;
    }>;
    register: (args: Omit<extractFields<PublicActions['endusers']['register']['parameters']>, 'businessId'> & {
        businessId?: string;
    }) => Promise<{}>;
    request_password_reset: (args: extractFields<PublicActions['endusers']['request_password_reset']['parameters']>) => Promise<{}>;
    reset_password: (args: extractFields<PublicActions['endusers']['reset_password']['parameters']>) => Promise<{}>;
    refresh_session: (args?: {
        invalidatePreviousToken?: boolean;
    }) => Promise<{
        authToken: string;
        enduser: import("@tellescope/types-models").Enduser & {
            id: string;
            createdAt: Date;
        };
    }>;
    refresh_session_if_expiring_soon: () => Promise<{
        authToken: string;
        enduser: import("@tellescope/types-models").Enduser & {
            id: string;
            createdAt: Date;
        };
    } | undefined>;
    logout: () => Promise<void>;
    test_authenticated: () => Promise<string>;
}
export {};
//# sourceMappingURL=enduser.d.ts.map