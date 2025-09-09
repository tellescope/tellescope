import * as models from "@tellescope/types-models"

export interface WithId { id: string | number }

type ToClientModel<T> = T & { id: string, createdAt: Date }
type ToClientModels<T> = {
  [K in keyof T]: ToClientModel<T[K]>
}

export type ClientModelForName_required = ToClientModels<models.ModelForName_required>
export type ClientModelForName_readonly = ToClientModels<models.ModelForName_readonly>
export type ClientModelForName_updatesDisabled = ToClientModels<models.ModelForName_updatesDisabled>
export type ClientModelForName = ToClientModels<models.ModelForName>

export type AppointmentBookingPage = ClientModelForName['appointment_booking_pages']
export type AppointmentLocation = ClientModelForName['appointment_locations']
export type CalendarEvent = ClientModelForName['calendar_events']
export type CalendarEventTemplate = ClientModelForName['calendar_event_templates']
export type CalendarEventRSVP = ClientModelForName['calendar_event_RSVPs']
export type Enduser = ClientModelForName['endusers']
export type EnduserObservation = ClientModelForName['enduser_observations']
export type EnduserStatusUpdate = ClientModelForName['enduser_status_updates']
export type EngagementEvent = ClientModelForName['engagement_events']
export type ChatRoom = ClientModelForName['chat_rooms']
export type ChatMessage = ClientModelForName['chats']
export type Email = ClientModelForName['emails']
export type File = ClientModelForName['files']
export type Form = ClientModelForName['forms']
export type FormField = ClientModelForName['form_fields']
export type FormResponse = ClientModelForName['form_responses']
export type Journey = ClientModelForName['journeys']
export type ManagedContentRecord = ClientModelForName['managed_content_records']
export type ManagedContentRecordAssignment = ClientModelForName['managed_content_record_assignments']
export type SMSMessage = ClientModelForName['sms_messages']
export type Template = ClientModelForName['templates']
export type MessageTemplate = ClientModelForName['templates']
export type Ticket = ClientModelForName['tickets']
export type Meeting = ClientModelForName['meetings']
export type Note = ClientModelForName['notes']
export type AutomationStep = ClientModelForName['automation_steps']
export type AutomatedAction = ClientModelForName['automated_actions']
export type User = ClientModelForName['users']
export type UserLog = ClientModelForName['user_logs']
export type UserNotification = ClientModelForName['user_notifications']
export type Organization = ClientModelForName['organizations']
export type Integration = ClientModelForName['integrations']
export type Database = ClientModelForName['databases']
export type DatabaseRecord = ClientModelForName['database_records']
export type PortalCustomization = ClientModelForName['portal_customizations']
export type EnduserTask = ClientModelForName['enduser_tasks']
export type CarePlan = ClientModelForName['care_plans']
export type RoleBasedAccessPermission = ClientModelForName['role_based_access_permissions']
export type Product = ClientModelForName['products']
export type Purchase = ClientModelForName['purchases']
export type PurchaseCredit = ClientModelForName['purchase_credits']
export type PhoneCall = ClientModelForName['phone_calls']
export type AnalyticsFrame = ClientModelForName['analytics_frames']
export type AvailabilityBlock = ClientModelForName['availability_blocks']
export type EnduserView = ClientModelForName['enduser_views']
export type BackgroundError = ClientModelForName['background_errors']
export type AutomationTrigger = ClientModelForName['automation_triggers']
export type Superbill = ClientModelForName['superbills']
export type SuperbillProvider = ClientModelForName['superbill_providers']
export type EnduserProfileView = ClientModelForName['enduser_profile_views']
export type EnduserMedication = ClientModelForName['enduser_medications']
export type EnduserCustomType = ClientModelForName['enduser_custom_types']
export type PhoneTree = ClientModelForName['phone_trees']
export type TableView = ClientModelForName['table_views']
export type EmailSyncDenial = ClientModelForName['email_sync_denials']
export type TicketThread = ClientModelForName['ticket_threads']
export type TicketThreadComment = ClientModelForName['ticket_thread_comments']
export type Configuration = ClientModelForName['configurations']
export type TicketQueue = ClientModelForName['ticket_queues']
export type GroupMMSConversation = ClientModelForName['group_mms_conversations']
export type EnduserOrder = ClientModelForName['enduser_orders']
export type EnduserEncounter = ClientModelForName['enduser_encounters']
export type VitalConfiguration = ClientModelForName['vital_configurations']
export type BlockedPhone = ClientModelForName['blocked_phones']
export type PrescriptionRoute = ClientModelForName['prescription_routes']
export type EnduserProblem = ClientModelForName['enduser_problems']
export type FlowchartNote = ClientModelForName['flowchart_notes']
export type WebhookLog = ClientModelForName['webhook_logs']
export type FormGroup = ClientModelForName['form_groups']
export type PortalBranding = ClientModelForName['portal_brandings']
export type MessageTemplateSnippet = ClientModelForName['message_template_snippets']
export type FaxLog = ClientModelForName['fax_logs']
export type CallHoldQueue = ClientModelForName['call_hold_queues']
export type SuggestedContact = ClientModelForName['suggested_contacts']
export type DiagnosisCode = ClientModelForName['diagnosis_codes']
export type AllergyCode = ClientModelForName['allergy_codes']
export type IntegrationLog = ClientModelForName['integration_logs']
export type EnduserEligibilityResult = ClientModelForName['enduser_eligibility_results']
export type AgentRecord = ClientModelForName['agent_records']
export type Waitlist = ClientModelForName['waitlists']
export type AIConversation = ClientModelForName['ai_conversations']
export type InboxThread = ClientModelForName['inbox_threads']

export type Forum = ClientModelForName['forums']
export type ForumPost = ClientModelForName['forum_posts']
export type PostComment = ClientModelForName['post_comments']
export type PostLike = ClientModelForName['post_likes']
export type CommentLike = ClientModelForName['comment_likes']

export interface UserDisplayInfo extends models.UserActivityInfo { 
  id: string,
  createdAt: Date,
  email?: string,
  avatar?: string,
  fname?: string, 
  lname?: string,
}

export type CreateFields <N extends keyof ClientModelForName, T=ClientModelForName[N]> = (
  Omit<ClientModelForName_required[N] & Partial<T>, keyof ClientModelForName_readonly[N]>
)

export type ProjectedObservation = (
  Pick<EnduserObservation, 'id' | 'measurement' | 'timestamp' | 'source' | 'createdAt' | 'classifications' | 'status' | 'beforeMeal' | 'showWithPlotsByUnit' | 'invalidationReason' | 'type' | 'timestampIsEstimated' | 'medStatus' | 'excludeFromVitalCountLookback'>
& Partial<Pick<EnduserObservation, 'enduserId' | 'reviewedBy' | 'reviewedAt'>>
)