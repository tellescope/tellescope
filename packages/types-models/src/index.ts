import { CUD, Indexable, UserIdentity } from "@tellescope/types-utilities"

export interface SearchOptions {
  query: string,
}

export type AccessType = "All" | "Default" | "Assigned" | null
export type AccessAction = "create" | "read" | "update" | "delete"
export type AccessResources = ModelName
  | 'apiKeys'
  | "automations"
  | "automationSteps"
  | "automationUsers"
  | "enduserNotes"
  | "engagement"
  | "files"
  | "forms"
  | "formResponses"
  | "journeys"
  | "meetings"
  | "notifications"
  | "reminders"
  | "sms"
  | "teamChat"
  | "taskTemplates"
  | "templates"
  | "organization"
  | "orgStatistics"
  | "users"
export type AccessForResource = {
  [K in AccessAction]: AccessType
}
export type AccessPermissions = {
  [K in AccessResources]: AccessForResource
}

export type Filters = { _exists: boolean, _gt: number, _gte: number, _lt: number, _lte: number, _all: any[] } 
export type ExistsFilter = { _exists: boolean }
export type FilterType = Filters
export type FilterKey = keyof Filters
export const FilterKeys = ['_exists', '_gt', '_gte', '_lt', '_lte', '_all'] as const
export type ReadFilter<T> = { [K in keyof T]?: T[K] | Partial<FilterType> }

export type FlowchartUI = {
  x: number,
  y: number,
}

export type OrganizationLimit = 'endusersLimit'
  | 'smsLimit'
  | 'emailsLimit'
  | 'tasksLimit'
  | 'formsLimit'
  | 'orgUsersLimit'
  | 'automationsLimit'
  | 'automationStepsLimit'
  | 'journeysLimit'
  | 'journeyStatesLimit'
  | 'templatesLimit'
  | 'apiKeysLimit'

export type OrganizationLimits = {
  [K in OrganizationLimit]?: number;
}

export type PortalSettings = {
  
}

export interface Organization_readonly extends ClientRecord {
  subscriptionExpiresAt: Date;
  subscriptionPeriod: number;
  lastSync?: number;
} 
export interface Organization_required {}
export interface Organization_updatesDisabled {
  name: string;
  subdomain: string;
}
export interface Organization extends Organization_readonly, Organization_required, Organization_updatesDisabled {
  roles?: string[];
  skills?: string[];
  logoVersion?: number; // missing if no logo set
  faviconVersion?: number;
  themeColor?: string;
  customPortalURL?: string,
  portalSettings?: PortalSettings,
  enduserDisplayName?: string,
}
export type OrganizationTheme = {
  name: string,
  businessId: string,
  subdomain: string,
  themeColor?: string
  logoURL?: string,
  customPortalURL?: string,
  faviconURL?: string,
  portalSettings?: PortalSettings,
}


// Standard database models
export interface RecordInfo {
  businessId: string;
  updatedAt: Date;
  creator: string; // can technically be null in some cases (e.g. enduser creates self), todo: allow as part of type
}

export interface ClientRecord extends RecordInfo { id: string }
  
export interface Session {
  type: "user" | "enduser",
  businessId: string,
  iat: number,
  exp: number,
  allowedPaths?: string[],
}
  
export type SessionType = "user" | "enduser"
export interface EnduserSession extends Session, Enduser {
  type: "enduser",
}

export interface UserSession extends Session, User, OrganizationLimits { // User joined with organization, access, and other details
  type: "user";
  subscriptionExpiresAt: Date;
  subscriptionPeriod: number;
  access: AccessPermissions;
  orgName: string;
  verifiedEmail: boolean;
  wasAutomated: boolean;
  enduserDisplayName?: string,
}

export type StateCredentialInfo = {
  state: string,
  expiresAt?: Date,
}


export type WeeklyAvailability = {
  dayOfWeekStartingSundayIndexedByZero: number,
  startTimeInMinutes: number,
  endTimeInMinutes: number,
}
export type NotificationPreference = {
  email?: boolean 
}
export type AccountType = "Business"// | "joining org"
export interface User_readonly extends ClientRecord {
  organization?: string 
  username?: string;
  orgEmail?: string;
  lastActive?: Date;
  lastLogout?: Date;
}
export interface User_required {  
  email: string;
}
export interface User_updatesDisabled { 
  verifiedEmail: boolean,
}
export interface User extends User_required, User_readonly, User_updatesDisabled {
  externalId?: string,
  phone?: string;
  fname?: string;
  lname?: string;
  suffixes?: string[],
  accountType?: AccountType;
  roles?: string[];
  avatar?: string,
  fields?: CustomFields;
  acknowledgedIntegrations?: Date,
  notificationPreferences?: {
    [index: string]: NotificationPreference,
  },
  credentialedStates?: StateCredentialInfo[],
  timezone?: Timezone,
  weeklyAvailabilities?: WeeklyAvailability[],
}

export type Preference = 'email' | 'sms' | 'call' | 'chat'
export type CustomField  = string | number | object | {
  value: string | object;
  title?: string;
  description?: string;
}
export type CustomFields = Indexable<boolean | null | string | CustomField>;

export interface Enduser_readonly extends UserActivityInfo, ClientRecord {
  lastCommunication?: Date;
  recentMessagePreview?: string;
  hashedPassword: string;
} 
export interface Enduser_required {}
export interface Enduser_updatesDisabled {}
export interface Enduser extends Enduser_readonly, Enduser_required, Enduser_updatesDisabled {
  externalId?: string;
  email? : string;
  emailConsent? : boolean;
  phone? : string;
  phoneConsent? : boolean;
  fname? : string;
  lname? : string;
  dateOfBirth?: Date;
  journeys?: Indexable<string>;
  tags? : string[];
  unredactedTags? : string[];
  fields? : CustomFields;
  unredactedFields? : CustomFields;
  preference? : Preference;
  assignedTo? : string[];
  avatar?: string,
  unread?: boolean,
  termsSigned?: Date,
  termsVersion?: string,
  state?: string,
}

export interface EnduserStatusUpdate_readonly extends ClientRecord {} 
export interface EnduserStatusUpdate_required {
  enduserId: string,
  journeyId: string,
  status: string,
}
export interface EnduserStatusUpdate_updatesDisabled {}
export interface EnduserStatusUpdate extends EnduserStatusUpdate_readonly, EnduserStatusUpdate_required, EnduserStatusUpdate_updatesDisabled {}

export interface APIKey_readonly extends ClientRecord { 
  hashedKey: string, // stored as hash
}
export interface APIKey_required {}
export interface APIKey_updatesDisabled {}
export interface APIKey extends APIKey_readonly, APIKey_required, APIKey_updatesDisabled {}

export interface EngagementEvent_readonly extends ClientRecord {}
export interface EngagementEvent_required {
  enduserId: string,
  type: string,
  significance: number,
}
export interface EngagementEvent_updatesDisabled {
  enduserId: string,  
}
export interface EngagementEvent extends EngagementEvent_readonly, EngagementEvent_required, EngagementEvent_updatesDisabled {  
  timestamp: Date,
  fields? : CustomFields;
}

export type JourneyStatePriority = "Disengaged" | "N/A" | "Engaged"

export interface JourneyState { // info needed to create a state
  name: string;
  priority: JourneyStatePriority; // may still include High/Medium/Low as old states
  requiresFollowup?: boolean; // missing => false
  description?: string;
}

export interface Journey_readonly extends ClientRecord {}
export interface Journey_updatesDisabled {}
export interface Journey_required {
  title: string;
}
export interface Journey extends Journey_readonly, Journey_required, Journey_updatesDisabled {
  defaultState: string;
  states: JourneyState[];
  description?: string;
}

export interface Task_readonly extends ClientRecord {}
export interface Task_required {
  text: string;
}
export interface Task_updatesDisabled {}
export interface Task extends Task_required, Task_readonly, Task_updatesDisabled { 
  completed?: boolean;
  description?: string;
  dueDate?: Date;
  assignedTo?: string;
  enduserId?: string;
  subscribers?: string[];
  subscriberRoles?: string[];
}

export interface TextCommunication {
  automationStepId?: string, 
  templateId?: string,
}

export type EmailEncoding = '' | 'base64'

export interface Email_readonly extends ClientRecord {
  delivered: boolean; 
  threadId: string; 
  source: string; // email address of sender
  linkOpens?: { [index: number]: Date };
  openedAt?: Date;
  textEncoding?: EmailEncoding,
  htmlEncoding?: EmailEncoding,
  s3id: string | null,
}
export interface Email_required {
  enduserId: string | null;
  subject: string; 
  textContent: string; 
}
export interface Email_updatesDisabled {
  HTMLContent?: string;
  messageId?: string;
  inbound?: boolean;
  logOnly?: boolean,
  timestamp?: Date,
  userId: string; // not actually required on create
}
export interface Email extends Email_required, Email_readonly, Email_updatesDisabled, TextCommunication {
  replyTo?: string | null;  
  via?: string,
  readBy?: { [index: string] : Date };
  // sentAt: string, // only outgoing
}

export interface SMSMessage_readonly extends ClientRecord {
  delivered: boolean, 
  internalMessageId?: string,
  linkOpens?: { [index: number]: Date };
}
export interface SMSMessage_required {
  enduserId: string, 
  message: string, 
}
export interface SMSMessage_updatesDisabled {
  inbound: boolean, 
  newThread: boolean, 
  logOnly?: boolean,
}
export interface SMSMessage extends SMSMessage_readonly, SMSMessage_required, SMSMessage_updatesDisabled, TextCommunication {
  userId?: string, // defaults to self, but should allow future options to send as other user
  readBy?: { [index: string] : Date };
  // usingPublicNumber?: boolean, // flagged on outgoing messages from public number
  // sentAt: string, // only outgoing
}
export type ChatRoomType = 'internal' | 'external'

export interface ChatRoom_readonly extends ClientRecord {
  recentMessage?: string,
  recentSender?: string,
  recentMessageSentAt?: number,
  numMessages: number,
}
export type ChatRoomUserInfo = {
  unreadCount: number
}
export interface ChatRoom_required {}
export interface ChatRoom_updatesDisabled {}
export interface ChatRoom extends ChatRoom_readonly, ChatRoom_required, ChatRoom_updatesDisabled {
  description?: string;
  type?: ChatRoomType; 
  userIds?: string[];
  title?: string
  topic?: string;
  topicId?: string;
  enduserIds?: string[];
  ticketId?: string; // for connecting with a related ticket
  endedAt?: Date;
  tags?: string[];
  infoForUser?: {
    [index: string]: ChatRoomUserInfo,
  }
}

export type ChatAttachmentType = 'image' | 'video' | 'file'  
export type ChatAttachment = {
  type: ChatAttachmentType,
  secureName: string,
}

export type GenericAttachment = {
  type: string,
  fileId: string,
  displayName: string,
  secureName: string,
}

export interface ChatMessage_readonly extends ClientRecord {
  senderId: string | null;
  linkOpens?: { [index: number]: Date };
}
export interface ChatMessage_required {
  roomId: string; 
  message: string;
}
export interface ChatMessage_updatesDisabled {
  roomId: string; 
  replyId?: string | null; // to support threaded replies to a specific root message
}
export interface ChatMessage extends ChatMessage_readonly, ChatMessage_required, ChatMessage_updatesDisabled, TextCommunication {
  html?: string,
  readBy?: { [index: string] : Date };
  attachments?: ChatAttachment[]
}

export type MessageTemplateType = 'enduser' | 'team'  // default to 'enduser'
export type MessageTemplateMode = 'html' | 'richtext'
export interface MessageTemplate_readonly extends ClientRecord {}
export interface MessageTemplate_required {
  title: string;
  subject: string;
  message: string;
}
export interface MessageTemplate_updatesDisabled {}
export interface MessageTemplate extends MessageTemplate_readonly, MessageTemplate_required, MessageTemplate_updatesDisabled {
  html: string;
  type?: MessageTemplateType;
  editorState?: string
  mode?: MessageTemplateMode,
}

export interface File_readonly extends ClientRecord {
  secureName: string,
  publicRead?: boolean, // set on prepare_file_upload and cannot be changed without messing up assumptions in access
}
export interface File_required {
  name: string;
  type: string;
  size: number;
}
export interface File_updatesDisabled {}
export interface File extends File_readonly, File_required, File_updatesDisabled {
  enduserId?: string;
}

export interface Ticket_readonly extends ClientRecord {}
export interface Ticket_required {
  title: string;
}
export interface Ticket_updatesDisabled {}
export interface Ticket extends Ticket_readonly, Ticket_required, Ticket_updatesDisabled {
  enduserId?: string;
  closedAt?: Date;
  closedForReason?: string;
  closeReasons?: string[];
  automationStepId?: string;
  dueDateInMS?: number;
  message?: string;
  type?: string;
  owner?: string;
  skillsRequired?: string[];
  chatRoomId?: string;
}

export type AttendeeInfo = {
  ExternalUserId: string,
  AttendeeId: string,
  JoinToken: string,
}
export type Attendee = UserIdentity & { info: AttendeeInfo }
export type MeetingStatus = 'scheduled' | 'live' | 'ended'
export type MeetingInfo = {
  MeetingId: string,
  ExternalMeetingId: string,
  MediaPlacement: object,
}
export interface Meeting_readonly extends ClientRecord {
  calendarEventId?: string,
}
export interface Meeting_required {}
export interface Meeting_updatesDisabled {}
export interface Meeting extends Meeting_readonly, Meeting_required, Meeting_updatesDisabled {
  attendees: Attendee[],
  meetingInfo: { Meeting: MeetingInfo },
  status: MeetingStatus,
  publicRead?: boolean,
  endedAt?: Date,
}

export interface Note_readonly extends ClientRecord {}
export interface Note_required {
  enduserId: string,
}
export interface Note_updatesDisabled {}
export interface Note extends Note_readonly, Note_required, Note_updatesDisabled {
  text?: string,
  title?: string,
  type?: string,
  ticketId?: string,
  fields?: Indexable<string | CustomField>,
}

export type FormFieldLiteralType = 'string' | 'stringLong' | 'number' | 'email' | 'phone' | 'date' | 'rating'
export type FormFieldComplexType = "multiple_choice" | "file" | "signature" | 'ranking'
export type FormFieldType = FormFieldLiteralType | FormFieldComplexType

export type FormFieldOptions = {
  choices: string[];
  from?: number,
  to?: number,
  radio?: boolean; // absent indicates not radio
  other?: boolean; // include an 'other' option
}
export type MultipleChoiceOptions = Pick<FormFieldOptions, 'choices' | 'radio' | 'other'>

export type PreviousFormFieldType = 'root' | 'after' | 'previousEquals'
export type PreviousFormFieldBuilder <T extends PreviousFormFieldType, V> = { type: T, info: V }

export type PreviousFormFieldAfterInfo = { fieldId: string }
export type PreviousFormFieldEqualsInfo = { fieldId: string, equals: string }
export type PreviousFormFieldAfter = PreviousFormFieldBuilder<'after', PreviousFormFieldAfterInfo>
export type PreviousFormFieldEquals = PreviousFormFieldBuilder<'previousEquals', PreviousFormFieldEqualsInfo>
export type PreviousFormFieldRoot = PreviousFormFieldBuilder<'root', {}>
export type PreviousFormField = (
    PreviousFormFieldRoot
  | PreviousFormFieldAfter
  | PreviousFormFieldEquals
)


export interface FormField_readonly extends ClientRecord {}
export interface FormField_required {
  formId: string,
  title: string,
  type: FormFieldType,
  previousFields: PreviousFormField[], // previous will always be known on create, rather than next 
}
export interface FormField_updatesDisabled {}
export interface FormField extends FormField_readonly, FormField_required, FormField_updatesDisabled {
  isOptional  ?: boolean,
  description ?: string,
  options     ?: FormFieldOptions,
  intakeField ?: string | null,
  flowchartUI?: FlowchartUI,
}

export type FormType = 'note' | 'enduserFacing'
export interface Form_readonly extends ClientRecord {
  numFields: number,
}
export interface Form_required {
  title: string,
  // fields: FormField[], 
}
export interface Form_updatesDisabled {}
export interface Form extends Form_readonly, Form_required, Form_updatesDisabled {
  customSubject?: string,
  customGreeting?: string,
  customSignature?: string,
  allowPublicURL?: boolean,
  intakePhone?: 'required' | 'optional',
  thanksMessage?: string,
  type?: FormType
}


export type OAuth2AuthenticationFields = {
  access_token: string,
  refresh_token: string,
  scope: string,
  token_type: 'Bearer',
  expiry_date: number,
  state?: string,
  email?: string,
}
export type IntegrationAuthentication = (
  {
    type: 'oauth2',
    info: OAuth2AuthenticationFields,
  }
)

export interface Integration_readonly extends ClientRecord {
  lastSync?: number,
  lastSyncId?: string,
}
export interface Integration_required {}
export interface Integration_updatesDisabled {}
export interface Integration extends Integration_readonly, Integration_required, Integration_updatesDisabled {
  title: string,
  authentication: IntegrationAuthentication,
}

export type BuildDatabaseRecordField <K extends string, V> = { type: K, value: V }
export type DatabaseRecordFieldsInfo = {
  string: BuildDatabaseRecordField<'string', string>
  'string-long': BuildDatabaseRecordField<'string-long', string>,
  'number': BuildDatabaseRecordField<'number', number>,
}
export type DatabaseRecordFieldType = keyof DatabaseRecordFieldsInfo

export type DatabaseRecordValues = {
  [K in DatabaseRecordFieldType] : {
    type: K,
    value: DatabaseRecordFieldsInfo[K]['value'],
  }
}
export type DatabaseRecordValue = DatabaseRecordValues[DatabaseRecordFieldType]

export type DatabaseRecordFields = {
  [K in DatabaseRecordFieldType] : {
    type: K,
    label: string,
  }
}
export type DatabaseRecordField = DatabaseRecordFields[DatabaseRecordFieldType]

export type OrganizationAccess = {
  create: boolean,
  read: boolean,
  update: boolean,
  delete: boolean,
}

export interface Database_readonly extends ClientRecord {
  numRecords: number,
}
export interface Database_required {
  title: string,
  fields: DatabaseRecordField[],
}
export interface Database_updatesDisabled {}
export interface Database extends Database_readonly, Database_required, Database_updatesDisabled {
  // organizationRead?: boolean,
}

export interface DatabaseRecord_readonly extends ClientRecord {}
export interface DatabaseRecord_required {
  databaseId: string,
  values: DatabaseRecordValue[],
}
export interface DatabaseRecord_updatesDisabled {}
export interface DatabaseRecord extends DatabaseRecord_readonly, DatabaseRecord_required, DatabaseRecord_updatesDisabled {
  
}

export type FormResponseValueAnswerBuilder <TYPE extends FormFieldType, VALUE extends number | object | string> = {
  type: TYPE,
  value?: VALUE,
}

export type FormResponseAnswerEmail = FormResponseValueAnswerBuilder<'email', string>
export type FormResponseAnswerNumber = FormResponseValueAnswerBuilder<'number', number>
export type FormResponseAnswerPhone = FormResponseValueAnswerBuilder<'phone', string>
export type FormResponseAnswerString = FormResponseValueAnswerBuilder<'string', string>
export type FormResponseAnswerStringLong = FormResponseValueAnswerBuilder<'stringLong', string>
export type FormResponseAnswerDate = FormResponseValueAnswerBuilder<'date', Date>
export type FormResponseAnswerRating = FormResponseValueAnswerBuilder<'rating', number>

export type FormResponseAnswerSignatureValue = {
  fullName: string,
  signed: boolean,
}
export type FormResponseAnswerSignature = FormResponseValueAnswerBuilder<'signature', FormResponseAnswerSignatureValue>

export type FormResponseAnswerMultipleChoiceValue = string[]
export type FormResponseAnswerMultipleChoice = FormResponseValueAnswerBuilder<'multiple_choice', FormResponseAnswerMultipleChoiceValue>
export type FormResponseAnswerRanking = FormResponseValueAnswerBuilder<'ranking', FormResponseAnswerMultipleChoiceValue>

export type FormResponseAnswerFileValue = {
  secureName: string,
  name: string,
}
export type FormResponseAnswerFile = FormResponseValueAnswerBuilder<'file', FormResponseAnswerFileValue>

export type FormResponseValueAnswer = (
    FormResponseAnswerEmail
  | FormResponseAnswerNumber
  | FormResponseAnswerPhone
  | FormResponseAnswerString
  | FormResponseAnswerStringLong
  | FormResponseAnswerSignature
  | FormResponseAnswerMultipleChoice
  | FormResponseAnswerFile
  | FormResponseAnswerDate
  | FormResponseAnswerRating
  | FormResponseAnswerRanking
)

export type FormResponseValue = {
  fieldId: string,
  fieldTitle: string,
  fieldDescription?: string,
  answer: FormResponseValueAnswer,
}

export type AnswerForType = {
  'email': FormResponseAnswerEmail['value'],
  'number': FormResponseAnswerNumber['value'],
  'phone': FormResponseAnswerPhone['value'],
  'string': FormResponseAnswerString['value'],
  'stringLong': FormResponseAnswerStringLong['value'],
  'signature': FormResponseAnswerSignature['value'],
  'multiple_choice': FormResponseAnswerMultipleChoice['value'],
  'file': FormResponseAnswerFile['value'],
  'date': FormResponseAnswerDate['value'],
  'rating': FormResponseAnswerRating['value'],
  'ranking': FormResponseAnswerRanking['value'],
}

export interface FormResponse_readonly extends ClientRecord {
  openedAt?: Date,
}
export interface FormResponse_required {
  formId: string,
  enduserId: string,
  formTitle: string,
  responses: FormResponseValue[],
  publicSubmit?: boolean,
  submittedBy?: string,
  submittedAt?: Date,
  accessCode?: string,
  userEmail?: string,
}
export interface FormResponse_updatesDisabled {
  submissionExpiresAt?: number,
  automationStepId?: string, 
}
export interface FormResponse extends FormResponse_readonly, FormResponse_required, FormResponse_updatesDisabled {
  draftSavedAt?: Date,
}

export interface WebHook_readonly extends ClientRecord {}
export interface WebHook_required {}
export interface WebHook_updatesDisabled {}
export interface WebHook extends WebHook_readonly, WebHook_required, WebHook_updatesDisabled {
  url: string,
  secret: string,
  subscriptions: WebhookSubscriptionsType
}

export type AvailabilityBlock = {
  userId: string,
  startTimeInMS: number,
  durationInMinutes: number,
}

export type CalendarEventReminderNotificationInfo = { 
  templateId?: string,
}
type BuildCalendarEventReminderInfo <T, I> = { type: T, info: I, msBeforeStartTime: number, didRemind?: boolean }
export type CalendarEventReminderInfoForType = {
  "webhook": BuildCalendarEventReminderInfo<'webhook', {}>,
  "add-to-journey": BuildCalendarEventReminderInfo<'add-to-journey', { journeyId: string }>,
  "user-notification": BuildCalendarEventReminderInfo<'user-notification', CalendarEventReminderNotificationInfo>,
  "enduser-notification": BuildCalendarEventReminderInfo<'enduser-notification', CalendarEventReminderNotificationInfo>,
}
export type CalendarEventReminderType = keyof CalendarEventReminderInfoForType
export type CalendarEventReminder = CalendarEventReminderInfoForType[CalendarEventReminderType]

export type EnduserTaskForEvent = {
  id: string,
  enduserId: string,
}
export type EnduserFormResponseForEvent = {
  formId: string,
  enduserId: string,
  accessCode: string,
}

export interface CalendarEvent_readonly extends ClientRecord { 
  meetingId?: string 
  meetingStatus?: MeetingStatus,
  references?: RelatedRecord[]
}
export interface CalendarEvent_required {
  title: string,
  startTimeInMS: number,
  durationInMinutes: number,
}
export interface CalendarEvent_updatesDisabled {}
export interface CalendarEvent extends CalendarEvent_readonly, CalendarEvent_required, CalendarEvent_updatesDisabled {
  attendees: UserIdentity[],
  enableVideoCall?: boolean,
  type?: string,
  publicRead?: boolean,
  chatRoomId?: string,
  description?: string,
  fields?: Indexable<string | CustomField>,
  reminders?: CalendarEventReminder[],
  image?: string,
  numRSVPs?: number,
  source?: string,
  templateId?: string,
  carePlanId?: string,
  enduserTasks?: EnduserTaskForEvent[],
  enduserFormResponses?: EnduserFormResponseForEvent[],
  sharedContentIds?: string[],
  location?: string,
  locationNotes?: string,
  phone?: string,
  attachments?: GenericAttachment[]
  wasSelfScheduled?: boolean,
}

export interface CalendarEventTemplate_readonly extends ClientRecord { }
export interface CalendarEventTemplate_required {}
export interface CalendarEventTemplate_updatesDisabled {}
export interface CalendarEventTemplate extends CalendarEventTemplate_readonly, CalendarEventTemplate_required, CalendarEventTemplate_updatesDisabled {
  title: string,
  durationInMinutes: number,
  type?: string,
  enableVideoCall?: boolean,
  enableSelfScheduling?: boolean,
  restrictedByState?: boolean,
  publicRead?: boolean,
  description?: string,
  reminders?: CalendarEventReminder[],
  image?: string,
}

export interface CalendarEventRSVP_readonly extends ClientRecord {
  creatorType: SessionType;
}
export interface CalendarEventRSVP_required {
  eventId: string,
}
export interface CalendarEventRSVP_updatesDisabled {}
export interface CalendarEventRSVP extends CalendarEventRSVP_readonly, CalendarEventRSVP_required, CalendarEventRSVP_updatesDisabled {
  displayName: string,
  avatar?: string,
  status?: string,
}

export type WebhookRecord = {
  id: string,
  [index: string]: any,
}

export type WebhookUpdates = {
  recordBeforeUpdate: WebhookRecord, 
  update: Partial<WebhookRecord>,
}[]
export interface WebhookCall {  
  model: WebhookSupportedModel,
  message: string,
  type: CUD,
  event?: CalendarEvent & { id: string },
  records: WebhookRecord[],
  updates?: WebhookUpdates,
  relatedRecords: { [index: string]: WebhookRecord },
  timestamp: string,
  integrity: string,
}

export type AutomationEventType = 
    'onJourneyStart'
  | 'afterAction'
  | "formResponse"
  | "formUnsubmitted"
  | "ticketCompleted"

interface AutomationEventBuilder <T extends AutomationEventType, V extends object> {
  type: T,
  info: V,
}

export type SendFormChannel = "Email" | "SMS"

export interface AutomationForJourney { journeyId: string }
export interface WithJourneyId { journeyId: string }
export interface AutomationForJourneyState { state: string }
export interface AutomationForJourneyAndState extends AutomationForJourney, AutomationForJourneyState {}
export interface AutomationForAutomation { automationId: string }

export interface AutomationForForm { formId: string }
export interface WithFormId { formId: string }
export interface WithAutomationStepId { automationStepId: string }
export interface AutomationForTemplate { templateId: string }
export interface AutomationForSender { senderId: string }
export interface AutomationForFormRequest extends AutomationForForm, AutomationForSender { channel?: SendFormChannel }
export interface AutomationForMessage extends AutomationForTemplate, AutomationForSender {}
export interface AutomationForWebhook { message: string }

export type FormResponseAutomationEvent = AutomationEventBuilder<'formResponse', {
  automationStepId: string, 
}> 
export type UnitOfTime = "Seconds" | "Minutes" | "Hours" | "Days"

export type FormSubmitCancellationConditionInfo = { automationStepId: string }
export type CancelCondition = { type: 'formResponse', info: FormSubmitCancellationConditionInfo }

export type AfterActionEventInfo = {
  automationStepId: string,
  delayInMS: number, // the real delay (much easier for DB queries)
  delay: number, // for displaying in editor
  unit: UnitOfTime, // for displaying in editor
  cancelConditions?: CancelCondition[]
}
export type TicketCompletedEventInfo = {
  automationStepId: string,
  closedForReason?: string, // null for default option
}
export interface FormUnsubmittedEventInfo extends AfterActionEventInfo {}
export type AfterActionAutomationEvent = AutomationEventBuilder<'afterAction', AfterActionEventInfo> 
export type FormUnsubmittedEvent = AutomationEventBuilder<'formUnsubmitted', FormUnsubmittedEventInfo> 
export type OnJourneyStartAutomationEvent = AutomationEventBuilder<'onJourneyStart', {}> 
export type TicketCompletedAutomationEvent = AutomationEventBuilder<'ticketCompleted', TicketCompletedEventInfo>

export type AutomationEvent = 
  FormResponseAutomationEvent
  | AfterActionAutomationEvent
  | OnJourneyStartAutomationEvent
  | FormUnsubmittedEvent
  | TicketCompletedAutomationEvent

export type AutomationEventForType = {
  'onJourneyStart': OnJourneyStartAutomationEvent
  'afterAction': AfterActionAutomationEvent 
  "formResponse":  FormResponseAutomationEvent
  'formUnsubmitted': FormUnsubmittedEvent
  'ticketCompleted': TicketCompletedAutomationEvent
}

export type SetEnduserStatusInfo = { status: string }

interface AutomationActionBuilder <T extends AutomationActionType, V extends object> {
  type: T,
  info: V,
}

export type CreateTicketAssignmentStrategyType = 'care-team-random'
export type CreateTicketAssignmentStrategy = {
  type: CreateTicketAssignmentStrategyType,
  info: object
}
export type CreateTicketActionInfo = {
  title: string,
  assignmentStrategy: CreateTicketAssignmentStrategy, // add or options with new types for CreateTicketAssignmentStrategy
  defaultAssignee: string,
  closeReasons?: string[],
}

export type SendEmailAutomationAction = AutomationActionBuilder<'sendEmail', AutomationForMessage>
export type SendSMSAutomationAction = AutomationActionBuilder<'sendSMS', AutomationForMessage>
export type SendFormAutomationAction = AutomationActionBuilder<'sendForm', AutomationForFormRequest>
export type SetEnduserStatusAutomationAction = AutomationActionBuilder<'setEnduserStatus', SetEnduserStatusInfo>
export type CreateTicketAutomationAction = AutomationActionBuilder<'createTicket', CreateTicketActionInfo>
export type SendWebhookAutomationAction = AutomationActionBuilder<'sendWebhook', AutomationForWebhook>

export type AutomationConditionType = 'atJourneyState' // deprecated
export type AutomationConditionBuilder <T extends AutomationConditionType, V extends object>  = {
  type: T,
  info: V,
}
export type AtJourneyStateAutomationCondition = AutomationConditionBuilder<'atJourneyState', AutomationForJourneyAndState>
export type AutomationCondition = AtJourneyStateAutomationCondition

export type AutomationActionForType = {
  "sendEmail" : SendEmailAutomationAction,
  "sendSMS": SendSMSAutomationAction,
  "sendForm": SendFormAutomationAction,
  "createTicket": CreateTicketAutomationAction,
  'sendWebhook': SendWebhookAutomationAction
  'setEnduserStatus': SetEnduserStatusAutomationAction
}
export type AutomationActionType = keyof AutomationActionForType
export type AutomationAction = AutomationActionForType[AutomationActionType]

export interface AutomationStep_readonly extends ClientRecord {}
export interface AutomationStep_required {
  events: AutomationEvent[],
  conditions?: AutomationCondition[],
  action: AutomationAction,
}
export interface AutomationStep_updatesDisabled {}
export interface AutomationStep extends AutomationStep_readonly, AutomationStep_required, AutomationStep_updatesDisabled {
  journeyId: string,
  flowchartUI?: FlowchartUI,
}

export type RelatedRecord = { type: string, id: string, creator?: string }
export interface UserNotification_readonly extends ClientRecord {}
export interface UserNotification_required {
  userId: string,
  type: string,
  message: string,
}
export interface UserNotification_updatesDisabled {}
export interface UserNotification extends UserNotification_readonly, UserNotification_required, UserNotification_updatesDisabled {
  read?: boolean,
  relatedRecords?: RelatedRecord[],
}

export type ObservationValue = {
  value: number,
  unit: string,
}
// see https://build.fhir.org/valueset-observation-status.html
export type ObservationStatusCode = (
    'registered'  
  | 'preliminary' 
  | 'final' // recording is done
  | 'amended' 
  | 'corrected' 
  | 'cancelled' 
  | 'entered-in-error' 
  | 'unknown'
)
export type ObservationCategory = 'vital-signs'

export interface EnduserObservation_readonly extends ClientRecord {}
export interface EnduserObservation_required {
  status: ObservationStatusCode,
  category: ObservationCategory,
  enduserId: string,
  measurement: ObservationValue,
}
export interface EnduserObservation_updatesDisabled {}
export interface EnduserObservation extends EnduserObservation_readonly, EnduserObservation_required, EnduserObservation_updatesDisabled {
  recordedAt?: Date,
  code?: string,
  type?: string,
  source?: string, // who generated this (e.g. self-reported vs lab work)
  notes?: string,
}

export type BlockType = 'h1' | 'h2' | 'html' | 'image' | 'youtube' | 'pdf'
export type ContentBlockBuilder <BLOCK extends BlockType, INFO extends object> = {
  type: BLOCK,
  info: INFO,
}

export type BlockContentText = { text: string }
export type BlockContentMedia = {
  link: string,
  name?: string,
  height?: number,
  width?: number,
}
export type BlockContentH1 = ContentBlockBuilder<'h1', BlockContentText>
export type BlockContentH2 = ContentBlockBuilder<'h2', BlockContentText>
export type BlockContentHTML = ContentBlockBuilder<'html', { html: string }>
export type BlockContentImage = ContentBlockBuilder<'image', BlockContentMedia>
export type BlockContentPDF = ContentBlockBuilder<'pdf', BlockContentMedia>
export type BlockContentYoutube = ContentBlockBuilder<'youtube', BlockContentMedia>

export type Block = (
    BlockContentYoutube
  | BlockContentPDF
  | BlockContentImage
  | BlockContentHTML
  | BlockContentH1
  | BlockContentH2
)

export type ManagedContentRecordType = 'Article' | 'PDF' | 'Video'
export type ManagedContentRecordAssignmentType = 'All' | "By Tags" | 'Manual'
export interface ManagedContentRecord_readonly extends ClientRecord {}
export interface ManagedContentRecord_required {
  title: string,
  textContent: string,
  htmlContent: string,
}
export interface ManagedContentRecord_updatesDisabled {
  type?: ManagedContentRecordType,
}
export interface ManagedContentRecord extends ManagedContentRecord_readonly, ManagedContentRecord_required, ManagedContentRecord_updatesDisabled {
  headerPhoto?: string,
  publicRead?: boolean,
  slug?: string,
  description?: string,
  blocks?: Block[],
  tags?: string[],
  files?: string[],
  category?: string,
  editorState?: string
  mode?: MessageTemplateMode,
  attachments?: ChatAttachment[]
  assignmentType?: ManagedContentRecordAssignmentType,
}

export interface ManagedContentRecordAssignment_readonly extends ClientRecord {}
export interface ManagedContentRecordAssignment_required {
  contentId: string,
  enduserId: string,
}
export interface ManagedContentRecordAssignment_updatesDisabled {}
export interface ManagedContentRecordAssignment extends ManagedContentRecordAssignment_readonly, ManagedContentRecordAssignment_required, ManagedContentRecordAssignment_updatesDisabled {}

export type PortalPage = "Home" | "Care Plan" | "Documents" | "Education" | "Community" | "Communications" | "Appointment Booking"

type BuildPortalBlockInfo <T, I> = { type: T, info: I }

export type CareTeamMemberPortalCustomizationInfo = {
  title: string, 
  role?: string, // for matching to care team role for a specific team member
}
export type PortalBlockForType = {
  careTeam: BuildPortalBlockInfo<'careTeam', { 
    title: string,
    // members: CareTeamMemberPortalCustomizationInfo[],
  }>,
  carePlan: BuildPortalBlockInfo<'carePlan', {}>,
  education: BuildPortalBlockInfo<'education', {}>,
  text: BuildPortalBlockInfo<'text', { text: string }>
}
export type PortalBlockType = keyof PortalBlockForType
export type PortalBlock = PortalBlockForType[PortalBlockType]

export interface PortalCustomization_readonly extends ClientRecord { }
export interface PortalCustomization_required {
  page: PortalPage,
}
export interface PortalCustomization_updatesDisabled {}
export interface PortalCustomization extends PortalCustomization_readonly, PortalCustomization_required, PortalCustomization_updatesDisabled {
  blocks: PortalBlock[],
  title?: string,
  disabled?: boolean,
  mobileBottomNavigationPosition?: number,
}
export const MOBILE_BOTTOM_NAVIGATION_DISABLED_POSITION = 1000
export const DEFAULT_PATIENT_PORTAL_BOTTOM_NAVIGATION_POSITIONS: { [K in PortalPage]: number } = {
  'Home': 0,
  Communications: 1,
  Documents: 2,
  Education: 3,
  Community: 4,
  "Care Plan": MOBILE_BOTTOM_NAVIGATION_DISABLED_POSITION,
  "Appointment Booking": MOBILE_BOTTOM_NAVIGATION_DISABLED_POSITION,
}

export interface Forum_readonly extends ClientRecord {}
export interface Forum_required {
  title: string,
}
export interface Forum_updatesDisabled {}
export interface Forum extends Forum_readonly, Forum_required, Forum_updatesDisabled {
  slug?: string,
  description?: string,
  publicRead?: boolean,
}

export interface ForumPost_readonly extends ClientRecord {
}
export interface ForumPost_required {
  forumId: string,
  title: string,
  textContent: string,
  htmlContent: string,
  editorState?: string
}
export interface ForumPost_updatesDisabled { // allow setting on create
  numLikes: number,
  numComments: number,
}
export interface ForumPost extends ForumPost_readonly, ForumPost_required, ForumPost_updatesDisabled {
  postedBy: UserIdentity,
  slug?: string,
  description?: string,
}

export interface PostLike_readonly extends ClientRecord {}
export interface PostLike_required {
  forumId: string,
  postId: string,
}
export interface PostLike_updatesDisabled {}
export interface PostLike extends PostLike_readonly, PostLike_required, PostLike_updatesDisabled {}

export interface PostComment_readonly extends ClientRecord {
}
export interface PostComment_required {
  forumId: string,
  postId: string,
  textContent: string,
  htmlContent: string,
  editorState?: string
}
export interface PostComment_updatesDisabled { // allow setting on create
  numLikes?: number,
  numReplies?: number,
}
export interface PostComment extends PostComment_readonly, PostComment_required, PostComment_updatesDisabled {
  postedBy: UserIdentity,
  threadId?: string,
  replyTo?: string,
  attachments?: string[],
}

export interface CommentLike_readonly extends ClientRecord {}
export interface CommentLike_required {
  forumId: string,
  postId: string,
  commentId: string,
}
export interface CommentLike_updatesDisabled {}
export interface CommentLike extends CommentLike_readonly, CommentLike_required, CommentLike_updatesDisabled {}

export type AutomatedActionStatus = 'active' | 'finished' | 'cancelled' | 'error'
export interface AutomatedAction_readonly extends ClientRecord {}
export interface AutomatedAction_required {
  enduserId: string,
  automationStepId: string,
  journeyId: string,
  event: AutomationEvent,
  action: AutomationAction,
  status: AutomatedActionStatus,
  // cancelConditions: CancelCondition[] // already included as part of the event
  processAfter: number,
  errorMessage?: string,
}
export interface AutomatedAction_updatesDisabled {}
export interface AutomatedAction extends AutomatedAction_readonly, AutomatedAction_required, AutomatedAction_updatesDisabled {

}

export interface UserLog_readonly extends ClientRecord {
  userId: string,
  resource: string,
  resourceId: string,
  action: CUD,
}
export interface UserLog_required {}
export interface UserLog_updatesDisabled {}
export interface UserLog extends UserLog_readonly, UserLog_required, UserLog_updatesDisabled {}

export interface EnduserTask_readonly extends ClientRecord {}
export interface EnduserTask_required {
  title: string,
}
export interface EnduserTask_updatesDisabled {}
export interface EnduserTask extends EnduserTask_readonly, EnduserTask_required, EnduserTask_updatesDisabled {
  enduserId: string,
  description?: string
  completedAt?: Date;
}


export interface CarePlan_readonly extends ClientRecord {}
export interface CarePlan_required {
  title: string,
}
export interface CarePlan_updatesDisabled {}
export interface CarePlan extends CarePlan_readonly, CarePlan_required, CarePlan_updatesDisabled {
  enduserId: string,
  description?: string
  eventIds?: string[],
}

export type ModelForName_required = {
  endusers: Enduser_required;
  engagement_events: EngagementEvent_required;
  journeys: Journey_required;
  api_keys: APIKey_required;
  tasks: Task_required;
  emails: Email_required;
  sms_messages: SMSMessage_required;
  chat_rooms: ChatRoom_required;
  chats: ChatMessage_required;
  users: User_required;
  templates: MessageTemplate_required;
  files: File_required;
  tickets: Ticket_required;
  meetings: Meeting_required;
  notes: Note_required;
  forms: Form_required,
  form_fields: FormField_required;
  form_responses: FormResponse_required,
  calendar_events: CalendarEvent_required,
  calendar_event_templates: CalendarEventTemplate_required,
  calendar_event_RSVPs: CalendarEventRSVP_required,
  automation_steps: AutomationStep_required,
  automated_actions: AutomatedAction_required,
  webhooks: WebHook_required;
  user_logs: UserLog_required;
  user_notifications: UserNotification_required;
  enduser_status_updates: EnduserStatusUpdate_required;
  enduser_observations: EnduserObservation_required;
  managed_content_records: ManagedContentRecord_required;
  managed_content_record_assignments: ManagedContentRecordAssignment_required;
  forums: Forum_required;
  forum_posts: ForumPost_required;
  post_likes: PostLike_required;
  comment_likes: CommentLike_required;
  post_comments: PostComment_required;
  organizations: Organization_required;
  integrations: Organization_required;
  databases: Database_required;
  database_records: DatabaseRecord_required;
  portal_customizations: PortalCustomization_required;
  enduser_tasks: EnduserTask_required;
  care_plans: CarePlan_required;
}
export type ClientModel_required = ModelForName_required[keyof ModelForName_required]

export interface ModelForName_readonly {
  endusers: Enduser_readonly;
  engagement_events: EngagementEvent_readonly;
  journeys: Journey_readonly;
  api_keys: APIKey_readonly;
  tasks: Task_readonly;
  emails: Email_readonly;
  sms_messages: SMSMessage_readonly;
  chat_rooms: ChatRoom_readonly;
  chats: ChatMessage_readonly;
  users: User_readonly;
  templates: MessageTemplate_readonly;
  files: File_readonly;
  tickets: Ticket_readonly;
  meetings: Meeting_readonly;
  notes: Note_readonly;
  forms: Form_readonly;
  form_fields: FormField_readonly;
  form_responses: FormResponse_readonly;
  calendar_events: CalendarEvent_readonly,
  calendar_event_templates: CalendarEventTemplate_readonly,
  calendar_event_RSVPs: CalendarEventRSVP_readonly,
  automation_steps: AutomationStep_readonly,
  automated_actions: AutomatedAction_readonly,
  webhooks: WebHook_readonly;
  user_logs: UserLog_readonly;
  user_notifications: UserNotification_readonly;
  enduser_status_updates: EnduserStatusUpdate_readonly;
  enduser_observations: EnduserObservation_readonly;
  managed_content_records: ManagedContentRecord_readonly;
  managed_content_record_assignments: ManagedContentRecordAssignment_readonly;
  forums: Forum_readonly;
  forum_posts: ForumPost_readonly;
  post_likes: PostLike_readonly;
  comment_likes: CommentLike_readonly;
  post_comments: PostComment_readonly;
  organizations: Organization_readonly;
  integrations: Integration_readonly;
  databases: Database_readonly;
  database_records: DatabaseRecord_readonly;
  portal_customizations: PortalCustomization_readonly;
  enduser_tasks: EnduserTask_readonly;
  care_plans: CarePlan_readonly;
}
export type ClientModel_readonly = ModelForName_readonly[keyof ModelForName_readonly]

export interface ModelForName_updatesDisabled {
  endusers: Enduser_updatesDisabled;
  engagement_events: EngagementEvent_updatesDisabled;
  journeys: Journey_updatesDisabled;
  api_keys: APIKey_updatesDisabled;
  tasks: Task_updatesDisabled;
  emails: Email_updatesDisabled;
  sms_messages: SMSMessage_updatesDisabled;
  chat_rooms: ChatRoom_updatesDisabled;
  chats: ChatMessage_updatesDisabled;
  users: User_updatesDisabled;
  templates: MessageTemplate_updatesDisabled;
  files: File_updatesDisabled;
  tickets: Ticket_updatesDisabled;
  meetings: Meeting_updatesDisabled;
  notes: Note_updatesDisabled;
  forms: Form_updatesDisabled;
  form_fields: FormField_updatesDisabled;
  form_responses: FormResponse_updatesDisabled;
  calendar_events: CalendarEvent_updatesDisabled,
  calendar_event_templates: CalendarEventTemplate_updatesDisabled,
  calendar_event_RSVPs: CalendarEventRSVP_updatesDisabled,
  automation_steps: AutomationStep_updatesDisabled,
  automated_actions: AutomatedAction_updatesDisabled, 
  webhooks: WebHook_updatesDisabled;
  user_logs: UserLog_updatesDisabled;
  user_notifications: UserNotification_updatesDisabled;
  enduser_status_updates: EnduserStatusUpdate_updatesDisabled;
  enduser_observations: EnduserObservation_updatesDisabled;
  managed_content_records: ManagedContentRecord_updatesDisabled;
  managed_content_record_assignments: ManagedContentRecordAssignment_updatesDisabled;
  forums: Forum_updatesDisabled;
  forum_posts: ForumPost_updatesDisabled;
  post_likes: PostLike_updatesDisabled;
  comment_likes: CommentLike_updatesDisabled;
  post_comments: PostComment_updatesDisabled;
  organizations: Organization_updatesDisabled;
  integrations: Integration_updatesDisabled;
  databases: Database_updatesDisabled;
  database_records: DatabaseRecord_updatesDisabled;
  portal_customizations: PortalCustomization_updatesDisabled;
  enduser_tasks: EnduserTask_updatesDisabled;
  care_plans: CarePlan_updatesDisabled;
}
export type ClientModel_updatesDisabled = ModelForName_updatesDisabled[keyof ModelForName_updatesDisabled]

export interface ModelForName extends ModelForName_required, ModelForName_readonly {
  endusers: Enduser;
  engagement_events: EngagementEvent;
  journeys: Journey;
  api_keys: APIKey;
  tasks: Task;
  emails: Email;
  sms_messages: SMSMessage;
  chat_rooms: ChatRoom;
  chats: ChatMessage;
  users: User;
  templates: MessageTemplate;
  files: File;
  tickets: Ticket;
  meetings: Meeting;
  notes: Note;
  forms: Form;
  form_fields: FormField;
  form_responses: FormResponse;
  calendar_events: CalendarEvent,
  calendar_event_templates: CalendarEventTemplate,
  calendar_event_RSVPs: CalendarEventRSVP,
  automation_steps: AutomationStep,
  automated_actions: AutomatedAction,
  webhooks: WebHook;
  user_logs: UserLog;
  user_notifications: UserNotification;
  enduser_status_updates: EnduserStatusUpdate;
  enduser_observations: EnduserObservation;
  managed_content_records: ManagedContentRecord;
  managed_content_record_assignments: ManagedContentRecordAssignment;
  forums: Forum;
  forum_posts: ForumPost;
  post_likes: PostLike;
  comment_likes: CommentLike;
  post_comments: PostComment;
  organizations: Organization;
  integrations: Integration;
  databases: Database;
  database_records: DatabaseRecord;
  portal_customizations: PortalCustomization;
  enduser_tasks: EnduserTask;
  care_plans: CarePlan;
}
export type ModelName = keyof ModelForName
export type Model = ModelForName[keyof ModelForName]

export type ConfiguredSessionInfo = { username: string, orgEmail: string, fname: string, lname: string }
export type ConfiguredSession = UserSession & ConfiguredSessionInfo

export interface UserActivityInfo {
  lastActive: string | Date, 
  lastLogout: string | Date,
}
export type UserActivityStatus = 'Active' | 'Away' | 'Unavailable'

export const modelNameChecker: { [K in ModelName] : true } = {
  endusers: true,
  enduser_status_updates: true,
  engagement_events: true,
  journeys: true,
  api_keys: true,
  tasks: true,
  emails: true,
  sms_messages: true,
  chat_rooms: true,
  chats: true,
  users: true,
  templates: true,
  files: true, 
  tickets: true,
  meetings: true, 
  notes: true, 
  forms: true,
  form_fields: true,
  form_responses: true,
  calendar_events: true,
  calendar_event_templates: true,
  calendar_event_RSVPs: true,
  automation_steps: true,
  automated_actions: true,
  webhooks: true, 
  user_logs: true,
  user_notifications: true,
  enduser_observations: true,
  managed_content_records: true,
  managed_content_record_assignments: true,
  forums: true,
  forum_posts: true,
  post_likes: true,
  comment_likes: true,
  post_comments: true,
  organizations: true,
  integrations: true,
  databases: true,
  database_records: true,
  portal_customizations: true,
  care_plans: true,
  enduser_tasks: true,
}


const WEBHOOK_MODELS: Partial<typeof modelNameChecker> = { ...modelNameChecker,  }
delete WEBHOOK_MODELS['api_keys']
delete WEBHOOK_MODELS['integrations']

export { WEBHOOK_MODELS }

export type WebhookSupportedModel = keyof typeof WEBHOOK_MODELS
export type CUDSubscription = {
  [K in CUD]?: boolean
}
export type WebhookSubscriptionsType = { [K in WebhookSupportedModel]?: CUDSubscription }
export const is_webhook_supported_model = (m: ModelName): m is WebhookSupportedModel => (
  WEBHOOK_MODELS[m] !== undefined
)

export const isModelName = (s: string): s is ModelName => modelNameChecker[s as ModelName]


// https://gist.github.com/aviflax/a4093965be1cd008f172/ 
export const TIMEZONE_MAP = {
  "Africa/Abidjan": "+00:00",
  "Africa/Accra": "+00:00",
  "Africa/Addis_Ababa": "+03:00",
  "Africa/Algiers": "+01:00",
  "Africa/Asmara": "+03:00",
  "Africa/Asmera": "+03:00",
  "Africa/Bamako": "+00:00",
  "Africa/Bangui": "+01:00",
  "Africa/Banjul": "+00:00",
  "Africa/Blantyre": "+02:00",
  "Africa/Brazzaville": "+01:00",
  "Africa/Bujumbura": "+02:00",
  "Africa/Cairo": "+02:00",
  "Africa/Casablanca": "+00:00",
  "Africa/Ceuta": "+01:00",
  "Africa/Conakry": "+00:00",
  "Africa/Dakar": "+00:00",
  "Africa/Dar_es_Salaam": "+03:00",
  "Africa/Djibouti": "+03:00",
  "Africa/Douala": "+01:00",
  "Africa/El_Aaiun": "+00:00",
  "Africa/Freetown": "+00:00",
  "Africa/Gaborone": "+02:00",
  "Africa/Harare": "+02:00",
  "Africa/Johannesburg": "+02:00",
  "Africa/Juba": "+03:00",
  "Africa/Kampala": "+03:00",
  "Africa/Khartoum": "+03:00",
  "Africa/Kigali": "+02:00",
  "Africa/Kinshasa": "+01:00",
  "Africa/Lagos": "+01:00",
  "Africa/Libreville": "+01:00",
  "Africa/Lome": "+00:00",
  "Africa/Luanda": "+01:00",
  "Africa/Lubumbashi": "+02:00",
  "Africa/Lusaka": "+02:00",
  "Africa/Malabo": "+01:00",
  "Africa/Maputo": "+02:00",
  "Africa/Maseru": "+02:00",
  "Africa/Mbabane": "+02:00",
  "Africa/Mogadishu": "+03:00",
  "Africa/Monrovia": "+00:00",
  "Africa/Nairobi": "+03:00",
  "Africa/Ndjamena": "+01:00",
  "Africa/Niamey": "+01:00",
  "Africa/Nouakchott": "+00:00",
  "Africa/Ouagadougou": "+00:00",
  "Africa/Porto-Novo": "+01:00",
  "Africa/Sao_Tome": "+00:00",
  "Africa/Timbuktu": "+00:00",
  "Africa/Tripoli": "+02:00",
  "Africa/Tunis": "+01:00",
  "Africa/Windhoek": "+01:00",
  "America/Adak": "-10:00",
  "America/Anchorage": "-09:00",
  "America/Anguilla": "-04:00",
  "America/Antigua": "-04:00",
  "America/Araguaina": "-03:00",
  "America/Argentina/Buenos_Aires": "-03:00",
  "America/Argentina/Catamarca": "-03:00",
  "America/Argentina/ComodRivadavia": "-03:00",
  "America/Argentina/Cordoba": "-03:00",
  "America/Argentina/Jujuy": "-03:00",
  "America/Argentina/La_Rioja": "-03:00",
  "America/Argentina/Mendoza": "-03:00",
  "America/Argentina/Rio_Gallegos": "-03:00",
  "America/Argentina/Salta": "-03:00",
  "America/Argentina/San_Juan": "-03:00",
  "America/Argentina/San_Luis": "-03:00",
  "America/Argentina/Tucuman": "-03:00",
  "America/Argentina/Ushuaia": "-03:00",
  "America/Aruba": "-04:00",
  "America/Asuncion": "-04:00",
  "America/Atikokan": "-05:00",
  "America/Atka": "-10:00",
  "America/Bahia": "-03:00",
  "America/Bahia_Banderas": "-06:00",
  "America/Barbados": "-04:00",
  "America/Belem": "-03:00",
  "America/Belize": "-06:00",
  "America/Blanc-Sablon": "-04:00",
  "America/Boa_Vista": "-04:00",
  "America/Bogota": "-05:00",
  "America/Boise": "-07:00",
  "America/Buenos_Aires": "-03:00",
  "America/Cambridge_Bay": "-07:00",
  "America/Campo_Grande": "-04:00",
  "America/Cancun": "-06:00",
  "America/Caracas": "-04:30",
  "America/Catamarca": "-03:00",
  "America/Cayenne": "-03:00",
  "America/Cayman": "-05:00",
  "America/Chicago": "-06:00",
  "America/Chihuahua": "-07:00",
  "America/Coral_Harbour": "-05:00",
  "America/Cordoba": "-03:00",
  "America/Costa_Rica": "-06:00",
  "America/Creston": "-07:00",
  "America/Cuiaba": "-04:00",
  "America/Curacao": "-04:00",
  "America/Danmarkshavn": "+00:00",
  "America/Dawson": "-08:00",
  "America/Dawson_Creek": "-07:00",
  "America/Denver": "-07:00",
  "America/Detroit": "-05:00",
  "America/Dominica": "-04:00",
  "America/Edmonton": "-07:00",
  "America/Eirunepe": "-05:00",
  "America/El_Salvador": "-06:00",
  "America/Ensenada": "-08:00",
  "America/Fort_Wayne": "-05:00",
  "America/Fortaleza": "-03:00",
  "America/Glace_Bay": "-04:00",
  "America/Godthab": "-03:00",
  "America/Goose_Bay": "-04:00",
  "America/Grand_Turk": "-05:00",
  "America/Grenada": "-04:00",
  "America/Guadeloupe": "-04:00",
  "America/Guatemala": "-06:00",
  "America/Guayaquil": "-05:00",
  "America/Guyana": "-04:00",
  "America/Halifax": "-04:00",
  "America/Havana": "-05:00",
  "America/Hermosillo": "-07:00",
  "America/Indiana/Indianapolis": "-05:00",
  "America/Indiana/Knox": "-06:00",
  "America/Indiana/Marengo": "-05:00",
  "America/Indiana/Petersburg": "-05:00",
  "America/Indiana/Tell_City": "-06:00",
  "America/Indiana/Valparaiso": "-06:00",
  "America/Indiana/Vevay": "-05:00",
  "America/Indiana/Vincennes": "-05:00",
  "America/Indiana/Winamac": "-05:00",
  "America/Indianapolis": "-05:00",
  "America/Inuvik": "-07:00",
  "America/Iqaluit": "-05:00",
  "America/Jamaica": "-05:00",
  "America/Jujuy": "-03:00",
  "America/Juneau": "-09:00",
  "America/Kentucky/Louisville": "-05:00",
  "America/Kentucky/Monticello": "-05:00",
  "America/Knox_IN": "-06:00",
  "America/Kralendijk": "-04:00",
  "America/La_Paz": "-04:00",
  "America/Lima": "-05:00",
  "America/Los_Angeles": "-08:00",
  "America/Louisville": "-05:00",
  "America/Lower_Princes": "-04:00",
  "America/Maceio": "-03:00",
  "America/Managua": "-06:00",
  "America/Manaus": "-04:00",
  "America/Marigot": "-04:00",
  "America/Martinique": "-04:00",
  "America/Matamoros": "-06:00",
  "America/Mazatlan": "-07:00",
  "America/Mendoza": "-03:00",
  "America/Menominee": "-06:00",
  "America/Merida": "-06:00",
  "America/Metlakatla": "-08:00",
  "America/Mexico_City": "-06:00",
  "America/Miquelon": "-03:00",
  "America/Moncton": "-04:00",
  "America/Monterrey": "-06:00",
  "America/Montevideo": "-03:00",
  "America/Montreal": "-05:00",
  "America/Montserrat": "-04:00",
  "America/Nassau": "-05:00",
  "America/New_York": "-05:00",
  "America/Nipigon": "-05:00",
  "America/Nome": "-09:00",
  "America/Noronha": "-02:00",
  "America/North_Dakota/Beulah": "-06:00",
  "America/North_Dakota/Center": "-06:00",
  "America/North_Dakota/New_Salem": "-06:00",
  "America/Ojinaga": "-07:00",
  "America/Panama": "-05:00",
  "America/Pangnirtung": "-05:00",
  "America/Paramaribo": "-03:00",
  "America/Phoenix": "-07:00",
  "America/Port_of_Spain": "-04:00",
  "America/Port-au-Prince": "-05:00",
  "America/Porto_Acre": "-05:00",
  "America/Porto_Velho": "-04:00",
  "America/Puerto_Rico": "-04:00",
  "America/Rainy_River": "-06:00",
  "America/Rankin_Inlet": "-06:00",
  "America/Recife": "-03:00",
  "America/Regina": "-06:00",
  "America/Resolute": "-06:00",
  "America/Rio_Branco": "-05:00",
  "America/Rosario": "-03:00",
  "America/Santa_Isabel": "-08:00",
  "America/Santarem": "-03:00",
  "America/Santiago": "-03:00",
  "America/Santo_Domingo": "-04:00",
  "America/Sao_Paulo": "-03:00",
  "America/Scoresbysund": "-01:00",
  "America/Shiprock": "-07:00",
  "America/Sitka": "-09:00",
  "America/St_Barthelemy": "-04:00",
  "America/St_Johns": "-03:30",
  "America/St_Kitts": "-04:00",
  "America/St_Lucia": "-04:00",
  "America/St_Thomas": "-04:00",
  "America/St_Vincent": "-04:00",
  "America/Swift_Current": "-06:00",
  "America/Tegucigalpa": "-06:00",
  "America/Thule": "-04:00",
  "America/Thunder_Bay": "-05:00",
  "America/Tijuana": "-08:00",
  "America/Toronto": "-05:00",
  "America/Tortola": "-04:00",
  "America/Vancouver": "-08:00",
  "America/Virgin": "-04:00",
  "America/Whitehorse": "-08:00",
  "America/Winnipeg": "-06:00",
  "America/Yakutat": "-09:00",
  "America/Yellowknife": "-07:00",
  "Antarctica/Casey": "+11:00",
  "Antarctica/Davis": "+05:00",
  "Antarctica/DumontDUrville": "+10:00",
  "Antarctica/Macquarie": "+11:00",
  "Antarctica/Mawson": "+05:00",
  "Antarctica/McMurdo": "+12:00",
  "Antarctica/Palmer": "-04:00",
  "Antarctica/Rothera": "-03:00",
  "Antarctica/South_Pole": "+12:00",
  "Antarctica/Syowa": "+03:00",
  "Antarctica/Troll": "+00:00",
  "Antarctica/Vostok": "+06:00",
  "Arctic/Longyearbyen": "+01:00",
  "Asia/Aden": "+03:00",
  "Asia/Almaty": "+06:00",
  "Asia/Amman": "+02:00",
  "Asia/Anadyr": "+12:00",
  "Asia/Aqtau": "+05:00",
  "Asia/Aqtobe": "+05:00",
  "Asia/Ashgabat": "+05:00",
  "Asia/Ashkhabad": "+05:00",
  "Asia/Baghdad": "+03:00",
  "Asia/Bahrain": "+03:00",
  "Asia/Baku": "+04:00",
  "Asia/Bangkok": "+07:00",
  "Asia/Beirut": "+02:00",
  "Asia/Bishkek": "+06:00",
  "Asia/Brunei": "+08:00",
  "Asia/Calcutta": "+05:30",
  "Asia/Choibalsan": "+08:00",
  "Asia/Chongqing": "+08:00",
  "Asia/Chungking": "+08:00",
  "Asia/Colombo": "+05:30",
  "Asia/Dacca": "+06:00",
  "Asia/Damascus": "+02:00",
  "Asia/Dhaka": "+06:00",
  "Asia/Dili": "+09:00",
  "Asia/Dubai": "+04:00",
  "Asia/Dushanbe": "+05:00",
  "Asia/Gaza": "+02:00",
  "Asia/Harbin": "+08:00",
  "Asia/Hebron": "+02:00",
  "Asia/Ho_Chi_Minh": "+07:00",
  "Asia/Hong_Kong": "+08:00",
  "Asia/Hovd": "+07:00",
  "Asia/Irkutsk": "+08:00",
  "Asia/Istanbul": "+02:00",
  "Asia/Jakarta": "+07:00",
  "Asia/Jayapura": "+09:00",
  "Asia/Jerusalem": "+02:00",
  "Asia/Kabul": "+04:30",
  "Asia/Kamchatka": "+12:00",
  "Asia/Karachi": "+05:00",
  "Asia/Kashgar": "+08:00",
  "Asia/Kathmandu": "+05:45",
  "Asia/Katmandu": "+05:45",
  "Asia/Khandyga": "+09:00",
  "Asia/Kolkata": "+05:30",
  "Asia/Krasnoyarsk": "+07:00",
  "Asia/Kuala_Lumpur": "+08:00",
  "Asia/Kuching": "+08:00",
  "Asia/Kuwait": "+03:00",
  "Asia/Macao": "+08:00",
  "Asia/Macau": "+08:00",
  "Asia/Magadan": "+10:00",
  "Asia/Makassar": "+08:00",
  "Asia/Manila": "+08:00",
  "Asia/Muscat": "+04:00",
  "Asia/Nicosia": "+02:00",
  "Asia/Novokuznetsk": "+07:00",
  "Asia/Novosibirsk": "+06:00",
  "Asia/Omsk": "+06:00",
  "Asia/Oral": "+05:00",
  "Asia/Phnom_Penh": "+07:00",
  "Asia/Pontianak": "+07:00",
  "Asia/Pyongyang": "+09:00",
  "Asia/Qatar": "+03:00",
  "Asia/Qyzylorda": "+06:00",
  "Asia/Rangoon": "+06:30",
  "Asia/Riyadh": "+03:00",
  "Asia/Saigon": "+07:00",
  "Asia/Sakhalin": "+11:00",
  "Asia/Samarkand": "+05:00",
  "Asia/Seoul": "+09:00",
  "Asia/Shanghai": "+08:00",
  "Asia/Singapore": "+08:00",
  "Asia/Taipei": "+08:00",
  "Asia/Tashkent": "+05:00",
  "Asia/Tbilisi": "+04:00",
  "Asia/Tehran": "+03:30",
  "Asia/Tel_Aviv": "+02:00",
  "Asia/Thimbu": "+06:00",
  "Asia/Thimphu": "+06:00",
  "Asia/Tokyo": "+09:00",
  "Asia/Ujung_Pandang": "+08:00",
  "Asia/Ulaanbaatar": "+08:00",
  "Asia/Ulan_Bator": "+08:00",
  "Asia/Urumqi": "+08:00",
  "Asia/Ust-Nera": "+10:00",
  "Asia/Vientiane": "+07:00",
  "Asia/Vladivostok": "+10:00",
  "Asia/Yakutsk": "+09:00",
  "Asia/Yekaterinburg": "+05:00",
  "Asia/Yerevan": "+04:00",
  "Atlantic/Azores": "-01:00",
  "Atlantic/Bermuda": "-04:00",
  "Atlantic/Canary": "+00:00",
  "Atlantic/Cape_Verde": "-01:00",
  "Atlantic/Faeroe": "+00:00",
  "Atlantic/Faroe": "+00:00",
  "Atlantic/Jan_Mayen": "+01:00",
  "Atlantic/Madeira": "+00:00",
  "Atlantic/Reykjavik": "+00:00",
  "Atlantic/South_Georgia": "-02:00",
  "Atlantic/St_Helena": "+00:00",
  "Atlantic/Stanley": "-03:00",
  "Australia/ACT": "+10:00",
  "Australia/Adelaide": "+09:30",
  "Australia/Brisbane": "+10:00",
  "Australia/Broken_Hill": "+09:30",
  "Australia/Canberra": "+10:00",
  "Australia/Currie": "+10:00",
  "Australia/Darwin": "+09:30",
  "Australia/Eucla": "+08:45",
  "Australia/Hobart": "+10:00",
  "Australia/LHI": "+10:30",
  "Australia/Lindeman": "+10:00",
  "Australia/Lord_Howe": "+10:30",
  "Australia/Melbourne": "+10:00",
  "Australia/North": "+09:30",
  "Australia/NSW": "+10:00",
  "Australia/Perth": "+08:00",
  "Australia/Queensland": "+10:00",
  "Australia/South": "+09:30",
  "Australia/Sydney": "+10:00",
  "Australia/Tasmania": "+10:00",
  "Australia/Victoria": "+10:00",
  "Australia/West": "+08:00",
  "Australia/Yancowinna": "+09:30",
  "Brazil/Acre": "-05:00",
  "Brazil/DeNoronha": "-02:00",
  "Brazil/East": "-03:00",
  "Brazil/West": "-04:00",
  "Canada/Atlantic": "-04:00",
  "Canada/Central": "-06:00",
  "Canada/Eastern": "-05:00",
  "Canada/East-Saskatchewan": "-06:00",
  "Canada/Mountain": "-07:00",
  "Canada/Newfoundland": "-03:30",
  "Canada/Pacific": "-08:00",
  "Canada/Saskatchewan": "-06:00",
  "Canada/Yukon": "-08:00",
  "Chile/Continental": "-03:00",
  "Chile/EasterIsland": "-05:00",
  "Cuba": "-05:00",
  "Egypt": "+02:00",
  "Eire": "+00:00",
  "Etc/GMT": "+00:00",
  "Etc/GMT+0": "+00:00",
  "Etc/UCT": "+00:00",
  "Etc/Universal": "+00:00",
  "Etc/UTC": "+00:00",
  "Etc/Zulu": "+00:00",
  "Europe/Amsterdam": "+01:00",
  "Europe/Andorra": "+01:00",
  "Europe/Athens": "+02:00",
  "Europe/Belfast": "+00:00",
  "Europe/Belgrade": "+01:00",
  "Europe/Berlin": "+01:00",
  "Europe/Bratislava": "+01:00",
  "Europe/Brussels": "+01:00",
  "Europe/Bucharest": "+02:00",
  "Europe/Budapest": "+01:00",
  "Europe/Busingen": "+01:00",
  "Europe/Chisinau": "+02:00",
  "Europe/Copenhagen": "+01:00",
  "Europe/Dublin": "+00:00",
  "Europe/Gibraltar": "+01:00",
  "Europe/Guernsey": "+00:00",
  "Europe/Helsinki": "+02:00",
  "Europe/Isle_of_Man": "+00:00",
  "Europe/Istanbul": "+02:00",
  "Europe/Jersey": "+00:00",
  "Europe/Kaliningrad": "+02:00",
  "Europe/Kiev": "+02:00",
  "Europe/Lisbon": "+00:00",
  "Europe/Ljubljana": "+01:00",
  "Europe/London": "+00:00",
  "Europe/Luxembourg": "+01:00",
  "Europe/Madrid": "+01:00",
  "Europe/Malta": "+01:00",
  "Europe/Mariehamn": "+02:00",
  "Europe/Minsk": "+03:00",
  "Europe/Monaco": "+01:00",
  "Europe/Moscow": "+03:00",
  "Europe/Nicosia": "+02:00",
  "Europe/Oslo": "+01:00",
  "Europe/Paris": "+01:00",
  "Europe/Podgorica": "+01:00",
  "Europe/Prague": "+01:00",
  "Europe/Riga": "+02:00",
  "Europe/Rome": "+01:00",
  "Europe/Samara": "+04:00",
  "Europe/San_Marino": "+01:00",
  "Europe/Sarajevo": "+01:00",
  "Europe/Simferopol": "+03:00",
  "Europe/Skopje": "+01:00",
  "Europe/Sofia": "+02:00",
  "Europe/Stockholm": "+01:00",
  "Europe/Tallinn": "+02:00",
  "Europe/Tirane": "+01:00",
  "Europe/Tiraspol": "+02:00",
  "Europe/Uzhgorod": "+02:00",
  "Europe/Vaduz": "+01:00",
  "Europe/Vatican": "+01:00",
  "Europe/Vienna": "+01:00",
  "Europe/Vilnius": "+02:00",
  "Europe/Volgograd": "+03:00",
  "Europe/Warsaw": "+01:00",
  "Europe/Zagreb": "+01:00",
  "Europe/Zaporozhye": "+02:00",
  "Europe/Zurich": "+01:00",
  "GB": "+00:00",
  "GB-Eire": "+00:00",
  "GMT": "+00:00",
  "GMT+0": "+00:00",
  "GMT0": "+00:00",
  "GMT-0": "+00:00",
  "Greenwich": "+00:00",
  "Hongkong": "+08:00",
  "Iceland": "+00:00",
  "Indian/Antananarivo": "+03:00",
  "Indian/Chagos": "+06:00",
  "Indian/Christmas": "+07:00",
  "Indian/Cocos": "+06:30",
  "Indian/Comoro": "+03:00",
  "Indian/Kerguelen": "+05:00",
  "Indian/Mahe": "+04:00",
  "Indian/Maldives": "+05:00",
  "Indian/Mauritius": "+04:00",
  "Indian/Mayotte": "+03:00",
  "Indian/Reunion": "+04:00",
  "Iran": "+03:30",
  "Israel": "+02:00",
  "Jamaica": "-05:00",
  "Japan": "+09:00",
  "Kwajalein": "+12:00",
  "Libya": "+02:00",
  "Mexico/BajaNorte": "-08:00",
  "Mexico/BajaSur": "-07:00",
  "Mexico/General": "-06:00",
  "Navajo": "-07:00",
  "NZ": "+12:00",
  "NZ-CHAT": "+12:45",
  "Pacific/Apia": "+13:00",
  "Pacific/Auckland": "+12:00",
  "Pacific/Chatham": "+12:45",
  "Pacific/Chuuk": "+10:00",
  "Pacific/Easter": "-06:00",
  "Pacific/Efate": "+11:00",
  "Pacific/Enderbury": "+13:00",
  "Pacific/Fakaofo": "+13:00",
  "Pacific/Fiji": "+12:00",
  "Pacific/Funafuti": "+12:00",
  "Pacific/Galapagos": "-06:00",
  "Pacific/Gambier": "-09:00",
  "Pacific/Guadalcanal": "+11:00",
  "Pacific/Guam": "+10:00",
  "Pacific/Honolulu": "-10:00",
  "Pacific/Johnston": "-10:00",
  "Pacific/Kiritimati": "+14:00",
  "Pacific/Kosrae": "+11:00",
  "Pacific/Kwajalein": "+12:00",
  "Pacific/Majuro": "+12:00",
  "Pacific/Marquesas": "-09:30",
  "Pacific/Midway": "-11:00",
  "Pacific/Nauru": "+12:00",
  "Pacific/Niue": "-11:00",
  "Pacific/Norfolk": "+11:30",
  "Pacific/Noumea": "+11:00",
  "Pacific/Pago_Pago": "-11:00",
  "Pacific/Palau": "+09:00",
  "Pacific/Pitcairn": "-08:00",
  "Pacific/Pohnpei": "+11:00",
  "Pacific/Ponape": "+11:00",
  "Pacific/Port_Moresby": "+10:00",
  "Pacific/Rarotonga": "-10:00",
  "Pacific/Saipan": "+10:00",
  "Pacific/Samoa": "-11:00",
  "Pacific/Tahiti": "-10:00",
  "Pacific/Tarawa": "+12:00",
  "Pacific/Tongatapu": "+13:00",
  "Pacific/Truk": "+10:00",
  "Pacific/Wake": "+12:00",
  "Pacific/Wallis": "+12:00",
  "Pacific/Yap": "+10:00",
  "Poland": "+01:00",
  "Portugal": "+00:00",
  "PRC": "+08:00",
  "ROC": "+08:00",
  "ROK": "+09:00",
  "Singapore": "+08:00",
  "Turkey": "+02:00",
  "UCT": "+00:00",
  "Universal": "+00:00",
  "US/Alaska": "-09:00",
  "US/Aleutian": "-10:00",
  "US/Arizona": "-07:00",
  "US/Central": "-06:00",
  "US/Eastern": "-05:00",
  "US/East-Indiana": "-05:00",
  "US/Hawaii": "-10:00",
  "US/Indiana-Starke": "-06:00",
  "US/Michigan": "-05:00",
  "US/Mountain": "-07:00",
  "US/Pacific": "-08:00",
  "US/Samoa": "-11:00",
  "UTC": "+00:00",
  "W-SU": "+03:00",
  "Zulu": "+00:00"
} as const
export type Timezone = keyof typeof TIMEZONE_MAP

export const TIMEZONES = Object.keys(TIMEZONE_MAP) as Timezone[]

export const TIMEZONES_USA: Timezone[] = [
  "America/Anchorage",
  "America/Boise",
  "America/Chicago",
  "America/Denver",
  "America/Detroit",
  "America/Indiana/Indianapolis",
  "America/Indiana/Knox",
  "America/Indiana/Marengo",
  "America/Indiana/Petersburg",
  "America/Indiana/Tell_City",
  "America/Indiana/Valparaiso",
  "America/Indiana/Vevay",
  "America/Indiana/Vincennes",
  "America/Indiana/Winamac",
  "America/Indianapolis",
  "America/Juneau",
  "America/Kentucky/Louisville",
  "America/Kentucky/Monticello",
  "America/Knox_IN",
  "America/Los_Angeles",
  "America/Louisville",
  "America/New_York",
  "America/North_Dakota/Beulah",
  "America/North_Dakota/Center",
  "America/North_Dakota/New_Salem",
  "America/Phoenix",
  "America/Puerto_Rico",
]