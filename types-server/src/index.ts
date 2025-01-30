import {
  ModelForName,
  ModelForName_required,
  RecordInfo,
  EnduserEngagementTimestamps,
  ModelName,
} from "@tellescope/types-models"

export type ObjectId = import('mongodb').ObjectId

export type ToServerModel<T> = Omit<T, 'id'> & { _id: ObjectId }
export type ToServerModels<T> = {
  [K in keyof T]: ToServerModel<T[K]>
}
export type ServerModelForName = ToServerModels<ModelForName>
export type ServerModelForName_required = ToServerModels<ModelForName_required>

export type EnduserMedication = ServerModelForName['enduser_medications']
export type AvailabilityBlock = ServerModelForName['availability_blocks']
export type AppointmentBookingPage = ServerModelForName['appointment_booking_pages']
export type APIKey = ServerModelForName['api_keys']
export type ChatMessage = ServerModelForName['chats']
export type ChatRoom = ServerModelForName['chat_rooms']
export type Enduser = ServerModelForName['endusers']
export type EnduserObservation = ServerModelForName['enduser_observations']
export type EnduserStatusUpdate = ServerModelForName['enduser_status_updates']
export type Email = ServerModelForName['emails']
export type EngagementEvent = ServerModelForName['engagement_events']
export type EngagementEvent_required = ServerModelForName_required['engagement_events']
export type File = ServerModelForName['files']
export type Journey = ServerModelForName['journeys']
export type ManagedContentRecord = ServerModelForName['managed_content_records']
export type ManagedContentRecordAssignment = ServerModelForName['managed_content_record_assignments']
export type MessageTemplate = ServerModelForName['templates']
export type SMSMessage = ServerModelForName['sms_messages']
export type Ticket = ServerModelForName['tickets']
export type User = ServerModelForName['users']
export type Meeting = ServerModelForName['meetings']
export type Note = ServerModelForName['notes']
export type Form = ServerModelForName['forms']
export type FormField = ServerModelForName['form_fields']
export type FormResponse = ServerModelForName['form_responses']
export type CalendarEvent = ServerModelForName['calendar_events']
export type CalendarEventTemplate = ServerModelForName['calendar_event_templates']
export type CalendarEventRSVP = ServerModelForName['calendar_event_RSVPs']
export type AutomationStep = ServerModelForName['automation_steps']
export type AutomatedAction = ServerModelForName['automated_actions']
export type UserLog = ServerModelForName['user_logs']
export type UserNotification = ServerModelForName['user_notifications']
export type WebHook = ServerModelForName['webhooks']
export type Integration = ServerModelForName['integrations']
export type Database = ServerModelForName['databases']
export type DatabaseRecord = ServerModelForName['database_records']
export type PortalCustomization = ServerModelForName['portal_customizations']
export type EnduserTask = ServerModelForName['enduser_tasks']
export type CarePlan = ServerModelForName['care_plans']
export type RoleBasedAccessPermission = ServerModelForName['role_based_access_permissions']
export type AppointmentLocation = ServerModelForName['appointment_locations']
export type Product = ServerModelForName['products']
export type Purchase = ServerModelForName['purchases']
export type PurchaseCredit = ServerModelForName['purchase_credits']
export type PhoneCall = ServerModelForName['phone_calls']
export type AnalyticsFrame = ServerModelForName['analytics_frames']
export type EnduserView = ServerModelForName['enduser_views']
export type BackgroundError = ServerModelForName['background_errors']
export type AutomationTrigger = ServerModelForName['automation_triggers']
export type Superbill = ServerModelForName['superbills']
export type SuperbillProvider = ServerModelForName['superbill_providers']
export type EnduserProfileView = ServerModelForName['enduser_profile_views']
export type PhoneTree = ServerModelForName['phone_trees']
export type EnduserCustomType = ServerModelForName['enduser_custom_types']
export type TableView = ServerModelForName['table_views']
export type EmailSyncDenial = ServerModelForName['email_sync_denials']
export type TicketThread = ServerModelForName['ticket_threads']
export type TicketThreadComment = ServerModelForName['ticket_thread_comments']
export type Configuration = ServerModelForName['configurations']
export type TicketQueue = ServerModelForName['ticket_queues']
export type GroupMMSConversation = ServerModelForName['group_mms_conversations']
export type EnduserOrder = ServerModelForName['enduser_orders']
export type EnduserEncounter = ServerModelForName['enduser_encounters']
export type VitalConfiguration = ServerModelForName['vital_configurations']
export type BlockedPhone = ServerModelForName['blocked_phones']
export type PrescriptionRoute = ServerModelForName['prescription_routes']
export type EnduserProblem = ServerModelForName['enduser_problems']
export type FlowchartNote = ServerModelForName['flowchart_notes']
export type WebhookLog = ServerModelForName['webhook_logs']
export type FormGroup = ServerModelForName['form_groups']
export type PortalBranding = ServerModelForName['portal_brandings']
export type MessageTemplateSnippet = ServerModelForName['message_template_snippets']
export type FaxLog = ServerModelForName['fax_logs']
export type CallHoldQueue = ServerModelForName['call_hold_queues']
export type SuggestedContact = ServerModelForName['suggested_contacts']
export type DiagnosisCode = ServerModelForName['diagnosis_codes']
export type AllergyCode = ServerModelForName['allergy_codes']
export type IntegrationLog = ServerModelForName['integration_logs']
export type EnduserEligibilityResult = ServerModelForName['enduser_eligibility_results']
export type AgentRecord = ServerModelForName['agent_records']

export type Forum = ServerModelForName['forums']
export type ForumPost = ServerModelForName['forum_posts']
export type PostComment = ServerModelForName['post_comments']
export type PostLike = ServerModelForName['post_likes']
export type CommentLike = ServerModelForName['comment_likes']

export type Organization = ServerModelForName['organizations']

export type DatabaseModel = ServerModelForName[keyof ModelForName]
export type InternalDatabaseRecord = ToServerModel<RecordInfo>
export { ModelName } from "@tellescope/types-models"

export type ClientType <T> = Omit<T, '_id'> & { id: string }

export interface CustomUpdateOptions {
  replaceObjectFields?: boolean,
}

export interface InternalBusinessRecord {
  _id: ObjectId,
  businessId: string,
}


export interface StripeCustomIntegration extends InternalBusinessRecord {
  publicKey: string,
  secretKey: string,
}


export interface IgnoreWebhookFlag extends InternalBusinessRecord, EnduserEngagementTimestamps {
  type: string,
  externalId: string,
  ignoreUntil: number,
}

export interface DrChronoConfig extends InternalBusinessRecord, EnduserEngagementTimestamps {
  clientId: string,
  clientSecret: string,
  webhookSecret: string,
  name: string,
}

export interface ZoomConfig extends InternalBusinessRecord, EnduserEngagementTimestamps {
  clientId: string,
  clientSecret: string,
  name?: string,
}

export interface ZendeskConfig extends InternalBusinessRecord {
  subdomain: string,
  clientId: string,
  clientSecret: string,
  adminAPIKey: string,
  apiKeyEmail: string,
  priorityGroups?: string[],
}

export interface ZohoConfig extends InternalBusinessRecord, EnduserEngagementTimestamps {
  secret: string,
}

export interface SalesforceConfig extends InternalBusinessRecord, EnduserEngagementTimestamps {
  url: string,
  clientId: string,
  clientSecret: string,
  username: string,
  password: string,
  secret: string,
}

export interface OIDCSession {
  userId: string,
  sessionId: string,
}

export interface TwilioConfig extends InternalBusinessRecord, EnduserEngagementTimestamps {
  accountSid: string,
  authToken: string,
  apiKeyId: string,
  apiKeySecret: string,
  twimlAppId: string,
  name: string,
  twilioIosSid: string,
  twilioAndroidSid: string,
}

export interface OutstandingFormsTracker extends InternalBusinessRecord {
  enduserId: string,
  automationStepId: string,
  unsubmittedFormCount: number,
  journeyId: string, // to handle efficient delete when removed from journey
}

export interface DeletedEnduser extends InternalBusinessRecord, EnduserEngagementTimestamps {
  enduserId: string,
  updatedAt: Date,
}

export interface AppointmentBookingToken extends InternalBusinessRecord, EnduserEngagementTimestamps {
  token: string,
  expiresAt: Date,
  bookingPageId?: string,
}

export interface ThrottledEvent extends InternalBusinessRecord, EnduserEngagementTimestamps {
  businessId: string,
  throttleId: string,
  deleteAfter: Date,
}

export interface AccessToken extends InternalBusinessRecord {
  type: 'passwordReset',
  tokenHash: string,
  userId: string,
  expire24HoursAfter: Date,
  // fields: object,
}

export interface DelayedEvent extends InternalBusinessRecord {
  type: 'sessionTimeout' | 'sync' | 'daily-sync' | 'delayed-message' | 'delayed-journey' | 'athena-sync' | 'trigger',
  triggerAt: number,
  fields: Record<string, any>,
  userId?: string,
}
export interface SessionTimeoutEvent extends DelayedEvent {
  type: 'sessionTimeout'
  fields: {
    authToken: string,
  }
}

export interface ElectronicSignature extends InternalBusinessRecord {
  ip: string,
  termsVersion: '1.0',
  description: string,
  htmlDescription: string,
  accessCode: string,
  signatureText: string,
  enduserId: string,
  formResponseId: string,
  responsesHash: string,
  pdfSecureName?: string,
  url?: string,
}

export interface GmailWebhookLog extends InternalBusinessRecord {
  type: string, 
  to: string,
  from: string,
  headers?: any[],
  existingMessageId?: string,
  messageData: { emailAddress: string, }
}

export interface MFACode extends InternalBusinessRecord {
  hashedCode: string,
  userId: string,
  expiresAt?: Date, // will not expire by TTL index if left blank
}

export interface CustomAggregation extends InternalBusinessRecord {
  key: string,
  modelName: ModelName,
  filter: string, // json stringified
  aggregation: string, // json stringified
  cacheDurationInSeconds?: number,
}
export interface ConferenceFlags extends InternalBusinessRecord {
  conferenceId: string,
}

export interface MicrosoftSSOConfiguration extends InternalBusinessRecord {
  clientId: string,
  clientSecret: string,
  authorizationURL: string,
  tokenURL: string,
  authorityURL: string,
}