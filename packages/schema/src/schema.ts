import {
  ServerModelForName,
  DatabaseModel,
  DatabaseRecord,
  ObjectId,
  ModelName,
  User,
} from "@tellescope/types-server"
import {
  ErrorInfo,
  Indexable,
  Operation,
  JSONType,
  CRUD,
  HTTPMethod,
  UserIdentity,
  SessionType,
} from "@tellescope/types-utilities"
import {
  WEBHOOK_MODELS,

  EnduserSession,
  ChatRoom,
  UserSession,
  MeetingStatus,
  WebhookSubscriptionsType,
  Attendee,
  ChatRoomType,
  MessageTemplateType,
  FormResponseValue,
  MeetingInfo,
  PreviousFormField,
  OrganizationTheme,
  WithLinkOpenTrackingIds,
  CommunicationsChannel,
  AppointmentTerm,
  JourneyContext,
  AnalyticsQuery,
  AnalyticsQueryResult,
  DateRange,
  BaseAvailabilityBlock,
  IndexUpdate,
  Timezone,
  UserCallRoutingBehavior,
  ExternalChatGPTMessage,
  EnduserRelationship,
  StripeCheckoutInfo,
  StripeCountryCode,
  JourneyStatistics,
  FormStatistics,
  CustomFields,
  TicketsReport,
  EndusersReportQueries,
  EndusersReport,
  Report,
  ReportQueries,
  FormResponsesReportQueries,
  PhoneCallsReportQueries,
} from "@tellescope/types-models"

import {
  AppointmentBookingPage as AppointmentBookingPageClient,
  UserDisplayInfo,
  Enduser,
  Journey,
  FormResponse,
  FormField,
  Form,
  Meeting,
  Email,
  File,
  CalendarEvent,
  Organization,
  User as UserClient,
  AppointmentLocation,
  CalendarEventTemplate,
  Product,
  ManagedContentRecord,
  EnduserMedication,
  DatabaseRecord as DatabaseRecordClient,
} from "@tellescope/types-client"

import {
  ValidatorDefinition,

  booleanValidator,
  dateValidator,
  emailValidator,
  fieldsValidator,
  journeysValidator,
  journeyStatesValidator,
  phoneValidator,
  nameValidator,
  nonNegNumberValidator,
  mongoIdValidator,
  mongoIdStringRequired as mongoIdStringValidator,
  listOfMongoIdStringValidator,
  preferenceValidator,
  objectAnyFieldsAnyValuesValidator,
  stringValidator,
  stringValidator100,
  listOfStringsValidator,
  emailEncodingValidator,
  numberToDateValidator,
  SMSMessageValidator,
  chatRoomTypeValidator,
  idStringToDateValidator,
  subdomainValidator,
  messageTemplateTypeValidator,
  stringValidator250,
  stringValidator5000,
  listOfDisplayNameInfo,
  fileTypeValidator,
  fileSizeValidator,
  meetingStatusValidator,
  listOfAttendeesValidator,
  meetingInfoValidator,
  listOfUserIndentitiesValidator,
  meetingsListValidator,
  urlValidator,
  WebhookSubscriptionValidator,
  attendeeValidator,
  meetingDisplayInfoValidator,
  intakePhoneValidator,
  formResponsesValidator,
  stringValidator25000,
  automationActionValidator,
  automationEventValidator,
  automatedActionStatusValidator,
  listOfStringsValidatorEmptyOk,
  listOfChatAttachmentsValidator,
  listOfCalendarEventRemindersValidator,
  messageTemplateModeValidator,
  listOfAutomationConditionsValidator,
  chatRoomUserInfoValidator,
  CUDStringValidator,
  listOfRelatedRecordsValidator,
  cancelConditionsValidator,
  notificationPreferencesValidator,
  FHIRObservationCategoryValidator,
  FHIRObservationStatusCodeValidator,
  FHIRObservationValueValidator,
  userIdentityValidator,
  formFieldTypeValidator,
  previousFormFieldsValidator,
  numberValidator,
  organizationThemeValidator,
  managedContentRecordTypeValidator,
  passwordValidator,
  flowchartUIValidator,
  integrationAuthenticationsValidator,
  listOfMongoIdStringValidatorEmptyOk,
  formFieldOptionsValidator,
  blocksValidator,
  sessionTypeValidator,
  portalSettingsValidator,
  emailValidatorEmptyOkay,
  phoneValidatorOptional,
  stringValidator1000,
  databaseFieldsValidator,
  databaseRecordValuesValidator,
  automationEventsValidator,
  portalPageValidator,
  portalBlocksValidator,
  enduserFormResponsesForEventValidator,
  enduserTasksForEventValidator,
  stateCredentialsValidator,
  stateValidator,
  weeklyAvailabilitiesValidator,
  timezoneValidator,
  formTypeValidator,
  managedContentRecordAssignmentTypeValidator,
  listOfGenericAttachmentsValidator,
  accessPermissionsValidator,
  organizationLimitsValidator,
  organizationSettingsValidator,
  communicationsChannelValidator,
  genericUnitWithQuantityValidator,
  stringValidator25000EmptyOkay,
  slugValidator,
  stringValidator5000EmptyOkay,
  loginFlowResultValidator,
  LoginFlowResult,
  sharedWithOrganizationIdsValidator,
  stringValidator1000Optional,
  tellescopeGenderValidator,
  appointmentTermsValidator,
  paymentProcessorValidator,
  purchaseCreditValueValidator,
  costValidator,
  integrationTitleValidator,
  IntegrationsTitleType,
  journeyContextValidator,
  stringValidator100000EmptyOkay,
  analyticsQueryValidator,
  dateRangeValidator,
  calendarEventPortalSettingsValidator,
  dateOptionalOrEmptyStringValidator,
  baseAvailabilityBlocksValidator,
  availabilityEntitiesValidator,
  indexUpdatesValidator,
  dateRangeOptionalValidator,
  booleanValidatorOptional,
  automationTriggerActionValidator,
  automationTriggerEventValidator,
  automatioNTriggerStatusValidator,
  exactMatchValidator,
  listOfMongoIdStringValidatorOptionalOrEmptyOk,
  listOfStringsValidatorOptionalOrEmptyOk,
  stringValidatorOptionalEmptyOkay,
  analyticsQueryResultsValidator,
  stringValidatorOptional,
  addressValidator,
  superbillPatientInfoValidator,
  superbillProviderInfoValidator,
  superbillLineItemsValidator,
  billingCodeValidatorOptional,
  analyticsFrameTypeValidator,
  videoIntegrationTypesValidator,
  scheduledJourneysValidator,
  formScoringValidator,
  embeddingTypeValidator,
  listValidator,
  userCallRoutingBehaviorValidator,
  userUIRestrictionsValidator,
  externalChatGPTMessagesValidator,
  enduserProfileViewBlocksValidator,
  intakeDateOfBirthValidator,
  objectValidator,
  mongoIdStringRequired,
  objectAnyFieldsValidator,
  insurancesValidator,
  phoneTreeNodesValidator,
  phoneTreeEnduserConditionValidator,
  orValidator,
  optionalAnyObjectValidator,
  listValidatorOptionalOrEmptyOk,
  formCustomizationValidator,
  buildInFieldsValidator,
  customEnduserFieldsValidatorOptionalOrEmpty,
  ticketActionsValidator,
  addressOptionalValidator,
  formResponseValidator,
  numberValidatorOptional,
  languageValidator,
  relatedRecordValidator,
  mongoIdStringOptional,
  tableViewColumnsValidator,
  formFieldCalloutConditionsValidator,
  endusersReportQueriesValidator,
  formResponsesReportQueriesValidator,
  phoneCallsReportQueriesValidator,
} from "@tellescope/validation"

import {
  CREATOR_ONLY_ACCESS,
  DEFAULT_OPERATIONS,
  PLACEHOLDER_ID,
  ENDUSER_SESSION_TYPE,
  USER_SESSION_TYPE,
} from "@tellescope/constants"

export type RelationshipConstraintOptions<T> = {
  updates?: Partial<T>
  original?: T,
}
export type RelationshipConstraint<T> = {
  explanation: string; // human readable, for documentation purposes
  evaluate: (
    v: T, 
    dependencies: Indexable<Partial<DatabaseModel>>, 
    session: UserSession | EnduserSession, 
    method: 'create' | 'update',
    options: RelationshipConstraintOptions<T>,
  ) => string | void;
}

export type DependencyAccessConstraint <T> = { type: 'dependency', foreignModel: ModelName, foreignField: string, accessField: keyof T  }
export type FilterAccessConstraint <T> = { type: 'filter', field: keyof T | `${(keyof T) & string}.${string}` }

export type AccessConstraint <T> = { type: 'creatorOnly' } 
  | FilterAccessConstraint<T>
  | DependencyAccessConstraint<T>

export type UniqueArrayConstraint <T> = { array: keyof T, itemKey?: string }
export type AndConstraint <T> = (keyof T)[]
export type UniqueConstraint<T> = (keyof T & string | AndConstraint<T> | UniqueArrayConstraint<T>)

export type Constraint <T> = {
  unique: UniqueConstraint<T>[];
  globalUnique?: (keyof T)[];
  relationship: (RelationshipConstraint<Partial<T>>)[];
  access?: AccessConstraint<T>[];
}

export type Initializer <T, R> = (a: T, s: UserSession | EnduserSession) => R

export type EndpointOptions = {
  // parameters used for endpoint that aren't stored in the model
  parameters?: { [index: string]: ValidatorDefinition<any> }, 
}

export type DependencyDeletionAction = 'delete' | 'unset' | 'setNull' | 'nop'
export type DependecyRelationship = 'foreignKey' | 'value'

export type Dependency <T=DatabaseRecord> = {
  dependsOn: ModelName[], // list of => OR, multiple dependency records => AND
  dependencyField: string,
  relationship: DependecyRelationship,
  onDependencyDelete: DependencyDeletionAction,
  getDependentValues?: (t: T) => JSONType[], // for accessing the values of a Dependency 
  filterByDependency?: (foreignValue: JSONType, foreignModel?: DatabaseModel) => { // for filtering against a Dependency
    field: string,
    value: JSONType | 'any',
  },
}

export type RedactionReason = (
  'enduser' // endusers can't access this field
)

export type ModelFieldInfo <T, R> = {
  validator: ValidatorDefinition<R>,
  readonly?:  boolean,
  required?:  boolean,
  updatesDisabled?: boolean,
  examples?:  JSONType[],
  initializer?: Initializer<Partial<T>, R>, // should include the required fields of T, not just partial
  dependencies?: Dependency<Partial<T>>[],
  redactions?: RedactionReason[],
}

export type ModelFields<T> = {
  [K in keyof T]: ModelFieldInfo<T, T[K]>
}
export type extractFields<Type> = Type extends ModelFields<infer X> ? X : never

type ActionInfo = {
  name?: string,
  description?: string,
  notes?: string[],
  warnings?: string[],
  adminOnly?: boolean,
  rootAdminOnly?: boolean,
  creatorOnly?: boolean,
}

export type CustomAction <P=any, R=any> = {
  op: Operation | 'custom',
  access: CRUD,
  // parameters: InputValidation<P>,
  parameters: ModelFields<P>,
  returns: R extends Array<any> ? ModelFieldInfo<any, R> : ModelFields<R>,
  path?: string,
  method?: HTTPMethod,
  enduserOnly?: boolean,
} & ActionInfo

export type EnduserAction = {
  field?: string,
} & ActionInfo

type CustomActionsForModel = {
  [K in ModelName]: { [index: string]: CustomAction }
}

type ReadFilter <T> = { [K in keyof T]?: { required: boolean } }


// m is the original model (or undefined, if create)
// allows for easier event handling based on specific updates (by comparing args to pre-update model)
export type SideEffectHandler <T, O=any> = (args: Partial<T>[], m: (Partial<T> | undefined)[] | undefined, n: (Partial<T> & { _id: ObjectId })[], s: UserSession | EnduserSession, o: O) => Promise<ErrorInfo[]>;

type SideEffect = {
  name: string;
  description: string;
}

export type Model<T, N extends ModelName> = {
  info: { 
    name?: string, 
    description?: string, 
    sideEffects?: { [K in Operation]?: SideEffect[] }
  },
  fields: ModelFields<T>,
  constraints: Constraint<T>,
  defaultActions: { [k in Operation]?: ActionInfo },
  enduserActions?: { [index: string]: EnduserAction },
  customActions: CustomActionsForModel[N],
  readFilter?: ReadFilter<T>,
  options?: {
    create?: EndpointOptions,
  }
}
export type extractModelType<Type> = Type extends Model<infer T, infer N> ? T : never

export type Schema = {
  [N in keyof ServerModelForName]: Model<ServerModelForName[N], ModelName>
}

const sideEffects = {
  handleJourneyStateChange: {
    name: "handleJourneyStateChange",
    description: "Handles change in an enduser's journey"
  },
  sendEmails: {
    name: "sendEmails",
    description: "Sends emails if logOnly is not true"
  },
  sendSMSMessages: {
    name: "sendSMSMessages",
    description: "Sends emails if logOnly is not true"
  },
  updateChatroomCache: {
    name: "updateChatroomCache",
    description: "Updates the chatroom with a preview of the recent message and sender"
  },
  updateEnduserStatus: {
    name: "updateEnduserStatus",
    description: "Updates the journeys[journeyId] field in an enduser to reflect a new status update"
  },
  updatePostCommentCount: {
    name: "updatePostCommentCount",
    description: "Updates the comment count of a post"
  },
  handleTicketClosed: {
    name: "handleTicketClosed",
    description: "Handles automated actions based on a closed ticket",
  },
  incrementFieldCount: {
    name: "incrementFieldCount",
    description: "Increments numFields in a form when a new field is created",
  },
  decrementFieldCount: {
    name: "decrementFieldCount",
    description: "Decrements numFields in a form when a field is deleted",
  },
}
export type SideEffectNames = keyof typeof sideEffects

const BOOLEAN_EXAMPLES = [true, false]

const BuiltInFields = { 
  _id: {
    validator: mongoIdValidator, 
    readonly: true,
  },
  businessId: {
    validator: mongoIdStringValidator, 
    readonly: true,
  },
  organizationIds: {
    validator: listOfMongoIdStringValidatorEmptyOk,
    dependencies: [
      {
        dependsOn: ['organizations' as ModelName],
        dependencyField: 'organizationIds',
        relationship: 'foreignKey' as const,
        onDependencyDelete: 'delete' as const,
      },
    ]
  },
  sharedWithOrganizations: {
    validator: sharedWithOrganizationIdsValidator,
  },
  creator: {
    validator: mongoIdStringValidator,
    readonly: true,
  },
  updatedAt: { 
    validator: dateValidator,
    readonly: true,
  },
}
export type BuiltInFields_T = typeof BuiltInFields 

export type AutoreplyInfo = {
  channel: CommunicationsChannel | "Phone",
  // messageId: string,
  enduserId: string,
  threadId?: string,
  userId?: string,
}

export type CustomActions = {
  availability_blocks: {
    update_order: CustomAction<{ indexUpdates: IndexUpdate[] }, { }>,
    handle_autoreply: CustomAction<AutoreplyInfo, { }>,
  },
  api_keys: {
    create: CustomAction<{}, { id: string, key: string}>,
  },
  templates: {
    get_templated_message: CustomAction<
      { 
        message: string, userId: string, enduserId: string,
        channel: CommunicationsChannel,
        html?: string, 
        subject?: string,
        automationStepId?: string,
        journeyContext?: JourneyContext,
      }, 
      { plaintext: string, subject: string, html: string } & WithLinkOpenTrackingIds
    >,
    get_suggested_reply: CustomAction<{ messages: ExternalChatGPTMessage[] }, { completion: string }>, 
    create_embedding: CustomAction<{ templateId: string }, { }>, 
    embedding_search: CustomAction<{ content: string }, { templateIds: string[] }>, 
  },
  files: {
    prepare_file_upload: CustomAction<{ 
      name: string, 
      size: number, 
      type: string, 
      enduserId?: string, 
      publicRead?: boolean,
      publicName?: string,
      source?: string,
    }, 
      { presignedUpload: object, file: File }
    >,
    file_download_URL: CustomAction<{ secureName: string }, { downloadURL: string, name: string }>,
  },
  form_fields: {
    load_choices_from_database: CustomAction<{ fieldId: string, lastId?: string, limit?: number, }, { choices: DatabaseRecordClient[] }>,
  },
  forms: {
    get_form_statistics: CustomAction<{ formId: string, range?: DateRange }, { statistics: FormStatistics }>,
  },
  form_responses: {
    prepare_form_response: CustomAction<
      { 
        formId: string, enduserId: string, automationStepId?: string, expireAt?: Date, sharedVia?: CommunicationsChannel 
        isInternalNote?: boolean, title?: string,
        rootResponseId?: string,
        parentResponseId?: string,
      }, 
      { accessCode: string, url: string, response: FormResponse,  }>
    ,
    submit_form_response: CustomAction<
      { 
        accessCode: string, responses: FormResponseValue[], 
        automationStepId?: string, customerId?: string, productIds?: string[],
      }, 
      { formResponse: FormResponse }
    >,
    save_field_response: CustomAction<{ accessCode: string, response: FormResponseValue }, { }>,
    info_for_access_code: CustomAction<{ accessCode: string }, {
      form: Form, 
      fields: FormField[], 
      response: FormResponse, 
    }>,
    stripe_details: CustomAction<
      { fieldId: string }, 
      { customerId: string, clientSecret: string, publishableKey: string, stripeAccount: string, businessName: string }
    >,
    generate_pdf: CustomAction<
      { id: string }, 
      {  }
    >,
    push_to_EHR: CustomAction<
      { id: string }, 
      {  }
    >,
    get_report: CustomAction<{ 
      queries: FormResponsesReportQueries, 
      formIds?: string[],
      submittedAtRange?: DateRange, 
      range?: DateRange, 
      enduserFilter?: Record<string, any>,
      submittedOnly?: boolean,
    }, 
    { report: Report }
  >,
  },
  journeys: {
    // update_state: CustomAction<{ updates: Partial<JourneyState>, id: string, name: string }, { updated: Journey }>,
    delete_states: CustomAction<{ id: string, states: string[] }, { updated: Journey }>,
    handle_incoming_communication: CustomAction<{ enduserId: string, channel?: string, messageId?: string, }, { }>,
    get_journey_statistics: CustomAction<{ journeyId: string }, { statistics: JourneyStatistics }>,
  },
  endusers: {
    set_password: CustomAction<{ id: string, password: string }, { }>,
    is_authenticated: CustomAction<
      { id?: string, authToken: string }, 
      { isAuthenticated: true, enduser: Enduser } | { isAuthenticated: false, enduser: null }
    >,
    refresh_session: CustomAction<{}, { enduser: Enduser, authToken: string }>,
    generate_auth_token: CustomAction<{ id?: string, phone?: string, email?: string, externalId?: string, durationInSeconds?: number }, { authToken: string, enduser: Enduser }>,
    logout: CustomAction<{ }, { }>,
    current_session_info: CustomAction<{ }, { enduser: Enduser }>,
    add_to_journey: CustomAction<{ enduserIds: string[], journeyId: string, automationStepId?: string, journeyContext?: JourneyContext, throttle?: boolean }, { }>, 
    remove_from_journey: CustomAction<{ enduserIds: string[], journeyId: string }, { }>, 
    merge: CustomAction<{ sourceEnduserId: string, destinationEnduserId: string, }, { }>, 
    push: CustomAction<{ enduserId: string }, { }>,
    bulk_update: CustomAction<
      { ids: string[], fields?: CustomFields, pushTags?: string[], replaceTags?: string[] }, 
      { updated: Enduser[] }
    >,
    get_report: CustomAction<{ queries: EndusersReportQueries, activeSince?: Date, }, { report: EndusersReport }>,
  },
  users: {
    display_info: CustomAction<{ }, { fname: string, lname: string, id: string }[]>,
    refresh_session: CustomAction<{}, { user: UserSession, authToken: string }>,
    generate_auth_token: CustomAction<{ id?: string, phone?: string, email?: string, externalId?: string, durationInSeconds?: number }, { 
      authToken: string, 
      enduser?: Enduser,
      user?: User,
    }>,
    send_invitation_to_existing: CustomAction<{ userId: string }, { }>,
    invite_user: CustomAction<
      { email: string, fname: string, lname: string, internalDisplayName?: string, organizationId: string, role?: string, tags?: string[] }, 
      { created: UserClient }
    >
    configure_inbox: CustomAction<{ username: string, fname: string, lname: string }, { user: User, authToken: string }>,
  },
  chat_rooms: {
    join_room: CustomAction<{ id: string }, { room: ChatRoom }>,
    display_info: CustomAction<{ id: string }, { id: string, display_info: { [index: string]: UserDisplayInfo } }>,
    mark_read: CustomAction<{ id: string }, { updated: ChatRoom }>,
  },
  meetings: {
    start_meeting: CustomAction<{ attendees?: UserIdentity[], publicRead?: boolean }, { id: string, meeting: { Meeting: MeetingInfo }, host: Attendee }>, 
    send_invite: CustomAction<{ meetingId: string, enduserId: string }, { }>, 
    end_meeting: CustomAction<{ id: string }, { }>, 
    add_attendees_to_meeting: CustomAction<{ id: string, attendees: UserIdentity[] }, { }>, 
    my_meetings: CustomAction<{}, { id: string, updatedAt: string, status: MeetingStatus }[]>
    attendee_info: CustomAction<{ id: string }, { attendee: Attendee, others: UserIdentity[] }>,
    start_meeting_for_event: CustomAction<{ calendarEventId: string }, { id: string, meeting: { Meeting: MeetingInfo }, host: Attendee }>, 
    join_meeting_for_event: CustomAction<{ calendarEventId: string }, { id: string, meeting: { Meeting: MeetingInfo }, attendee: Attendee }>, 
    read: CustomAction<{ id: string }, Meeting>,
  },
  webhooks: {
    configure: CustomAction<{ url: string, secret: string, subscriptions?: WebhookSubscriptionsType }, { }>,
    update: CustomAction<{ url?: string, secret?: string, subscriptionUpdates?: WebhookSubscriptionsType }, { }>,
    get_configuration: CustomAction<{ }, { url?: string, subscriptions?: WebhookSubscriptionsType }>,
    send_automation_webhook: CustomAction<{ message: string }, { }>,
    send_calendar_event_reminder_webhook: CustomAction<{ id: string }, { }>,
  },
  user_notifications: {
    bulk_update: CustomAction<{ action: string }, { }>,
    send_user_email_notification: CustomAction<{ userId: string, message: string, subject?: string }, { }>,
  },
  post_likes: { 
    create: CustomAction<{ postId: string, forumId: string }, { }>,
    unlike_post: CustomAction<{ postId: string, forumId: string }, { }>,
  },
  integrations: {
    generate_google_auth_url: CustomAction<{ }, { authUrl: string, }>, 
    disconnect_google_integration: CustomAction<{}, {}>,
    generate_oauth2_auth_url: CustomAction<{ integration: IntegrationsTitleType }, { authUrl: string, }>, 
    add_api_key_integration: CustomAction<{ API_KEY: string, integration: string }, { }>, 
    remove_api_key_integration: CustomAction<{ integration: string }, { }>, 
    disconnect_oauth2_integration: CustomAction<{ integration: IntegrationsTitleType }, {}>,
    refresh_oauth2_session: CustomAction<{ title: string }, { access_token: string, expiry_date: number }>, 
    connect_stripe: CustomAction<{ accountId?: string, countryCode?: StripeCountryCode }, { accountId: string, accountLinkUrl: string }>, 
    sync_ehr: CustomAction<{ }, { }>,
    daily_sync: CustomAction<{ }, { }>,
    connect_photon: CustomAction<{ 
      organizationId: string, 
      clientId: string, 
      clientSecret: string,
      environment?: string
    }, { updatedOrganization: Organization }>, 
    disconnect_photon: CustomAction<{  }, { }>, 
    connect_elation: CustomAction<{ 
      clientId: string, 
      clientSecret: string,
      environment?: string
    }, {  }>, 
    disconnect_elation: CustomAction<{  }, { }>, 
  },
  emails: {
    sync_integrations: CustomAction<{ enduserEmail: string, allUsers?: boolean }, { newEmails: Email[] }>,
    deliver_via_outlook: CustomAction<{ message: string, senderId: string, cc?: string[], replyId?: string }, { 
      id: string, 
      conversationId: string,
      timestamp: string,
    }>, 
  },
  calendar_events: {
    get_events_for_user: CustomAction<{ userId: string, from: Date, to?: Date, limit?: number }, { events: CalendarEvent[] }>, 
    generate_meeting_link: CustomAction<{ eventId: string, enduserId: string }, { link: string }>, 
    get_appointment_availability: CustomAction<{ 
      from: Date, calendarEventTemplateId: string, to?: Date, restrictedByState?: boolean, limit?: number, locationId?: string,
      businessId?: string, // for accessing while unauthenticated
      userId?: string, 
      userIds?: string[],
    }, { 
      availabilityBlocks: BaseAvailabilityBlock[],
    }>,
    book_appointment: CustomAction<{ 
      userId: string, startTime: Date, calendarEventTemplateId: string, 
      token?: string,
      locationId?: string,
      bookingPageId?: string,
      rescheduledCalendarEventId?: string,
      agreedToTerms?: AppointmentTerm[],
      timezone?: Timezone,
      fields?: Record<any, any>
      customerId?: string,
    }, { 
      createdEvent: CalendarEvent,
    }>,
    stripe_details: CustomAction<{ }, { stripe?: StripeCheckoutInfo }>,
    generate_zoom_meeting: CustomAction<{ calendarEventId: string, userId: string }, { updatedEvent: CalendarEvent }>, 
    change_zoom_host: CustomAction<{ calendarEventId: string, userId: string }, { updatedEvent: CalendarEvent }>, 
    download_ics_file: CustomAction<{ calendarEventId: string, attendeeId?: string, attendeeType?: SessionType }, { }>,
  },
  organizations: {
    create_and_join: CustomAction<{ name: string, subdomain: string }, { authToken: string, user: User, organization: Organization }>, 
    create_suborganization: CustomAction<{ name: string, subdomain: string }, { created: Organization }>, 
  },
  phone_calls: {
    authenticate_calling: CustomAction<{ os?: "ios" | "android", type?: UserCallRoutingBehavior }, { accessToken: string, identity: string }>, 
    get_report: CustomAction<{ 
      queries: PhoneCallsReportQueries,
      range?: DateRange, 
      enduserFilter?: Record<string, any>,
    }, { report: Report }>,
  },
  analytics_frames: {
    get_result_for_query: CustomAction<{ 
      query: AnalyticsQuery,
      createdRange?: DateRange,
      updatedRange?: DateRange,
    }, AnalyticsQueryResult>, 
  },
  managed_content_records: {
    generate_embedding: CustomAction<{ id: string }, { updated: ManagedContentRecord }>, 
    search: CustomAction<{ query: string, type?: "enduser" | "internal" }, { record: ManagedContentRecord, matches: ManagedContentRecord[], response: string }>, 
    update_indexes: CustomAction<{ updates: { id: string, index: number }[] }, {}>,
  },
  automation_triggers: {
    trigger_events: CustomAction<{ triggers: { enduserId: string, automationTriggerId: string }[] }, { }>, 
  },
  tickets: {
    update_indexes: CustomAction<{ updates: { id: string, index: number }[] }, {}>,
    get_report: CustomAction<{ title?: string, userId?: string, range?: DateRange }, { report: TicketsReport }>,
  },
  appointment_booking_pages: {
    generate_access_token: CustomAction<{ expiresAt: Date, bookingPageId?: string }, { token: string }>,
  },
  sms_messages: {
    send_message_to_number: CustomAction<{ message: string, to: string }, { enduser: Enduser }>,
  },
  products: {
    prepare_stripe_checkout: CustomAction<
      { productIds: string[] }, 
      { customerId: string, clientSecret: string, publishableKey: string, stripeAccount: string, businessName: string }
    >,
  }
} 

export type PublicActions = {
  endusers: {
    login: CustomAction<
      { id?: string, email?: string, phone?: string, password: string, durationInSeconds: number, businessId: string, organizationIds?: string[] }, 
      { authToken: string }
    >,
    register: CustomAction<{ 
      emailConsent?: boolean, fname?: string, lname?: string, email: string, password: string,
      termsVersion?: string, termsSigned?: Date,
      businessId: string, organizationIds?: string[],
    }, {  }>,
    request_password_reset: CustomAction<{ email: string, businessId: string, organizationIds?: string[]  }, { }>,
    reset_password: CustomAction<{ resetToken: string, newPassword: string, businessId: string, organizationIds?: string[] }, { }>,
    begin_login_flow: CustomAction<{ email?: string, phone?: string, businessId: string, organizationIds?: string[] }, { result: LoginFlowResult, email?: string }>,
    unsubscribe: CustomAction<{ enduserId: string, unsubscribeFrom: string[] }, { }>,
  },
  users: {
    login: CustomAction<{ email: string, password: string, expirationInSeconds?: number }, { user: User, authToken: string }>,
    login_with_google: CustomAction<{ jwt: string }, { user: User, authToken: string }>,
    register: CustomAction<{ email: string, password: string, termsVersion: string, inviteCode?: string }, { }>,
    request_password_reset: CustomAction<{ email: string }, { }>,
    reset_password: CustomAction<{ resetToken: string, newPassword: string }, { }>,
    submit_email_verification: CustomAction<{ email: string, code: string }, { authToken: string, user: User }>,
  },
  organizations: {
    get_theme: CustomAction<{ businessId: string, organizationIds?: string[] }, { theme: OrganizationTheme }>,
  },
  forms: {
    public_form_details: CustomAction<{ formId: string }, { form: Form }>,
  },
  form_responses: {
    session_for_public_form: CustomAction<{ 
      fname?: string, 
      lname?: string, 
      email?: string, 
      phone?: string, 
      dateOfBirth?: string,
      formId: string, 
      businessId: string,
      publicIdentifier?: string,
      state?: string,
      // organizationIds?: string[]
    }, { accessCode: string, authToken: string, url: string, path: string }>,
  },
  calendar_events: {
    session_for_public_appointment_booking: CustomAction<{ 
      fname?: string, 
      lname?: string, 
      dateOfBirth?: string,
      email: string, 
      phone?: string, 
      state?: string,
      calendarEventTemplateId: string, 
      businessId: string,
      organizationIds?: string[]
    }, { 
      authToken: string,
      stripe?: StripeCheckoutInfo,
    }>,
    details_for_appointment_booking_page: CustomAction<
      { 
        appointmentBookingPageId: string, 
        businessId: string,
        userId?: string,
      }, 
      { 
        appointmentBookingPage: AppointmentBookingPageClient,
        locations: AppointmentLocation[],
        calendarEventTemplates: CalendarEventTemplate[],
        products: Product[],
        userDisplayName?: string,
        userAvatar?: string,
      }
    >,
  },
  sms_messages: {
    leave_message: CustomAction<{ businessId: string, fname: string, lname: string, phone: string, message: string }, { }>,
  },
  appointment_booking_pages: {
    validate_access_token: CustomAction<{ token: string, bookingPageId?: string }, { isValid: boolean }>,
  },
}

export type SchemaV1 = Schema & { 
  [K in keyof CustomActions]: { 
    customActions: CustomActions[K] 
  }
} & {
  [K in keyof PublicActions]: { 
    publicActions: PublicActions[K] 
  }
}

export const build_schema = <T extends Schema>(schema: T) => schema

export const schema: SchemaV1 = build_schema({
  endusers: {
    info: {
      description: "Used to represent patients or other endusers. See Users for managing your team member's accounts.",
      sideEffects: {
        create: [sideEffects.handleJourneyStateChange],
        update: [sideEffects.handleJourneyStateChange],
      }
    },
    constraints: {
      unique: ['email', 'externalId'],
      relationship: [
        // {
        //   explanation: 'One of email or phone is required',
        //   evaluate: ({ email, phone }, s, _, method) => {
        //     // while endusers can be created by Worker without email or phone number, relax this restriction on updates
        //     if (method === 'update') return

        //     if (!(email || phone))
        //       return 'One of email or phone is required'
        //     } 
        // },
        {
          explanation: 'Endusers can only access and modify their own profile',
          evaluate: ({ _id }, _, session) => {
            if (session.type === USER_SESSION_TYPE) return
            if (session.id !== _id?.toString()) return "Endusers may only update their own profile"
          } 
        }, {
          explanation: "Enduser organizationIds can only be updated by users",
          evaluate: ({ }, _, session, method, { updates }) => {
            if (method === 'create') return // create already admin restricted
            if (session.type === 'user') return
            if (!updates?.organizationIds) return

            return "Enduser organizationIds can only be updated by users"
          }
        }
      ],
      access: [ // for non-admins, limit access to endusers the user is assigned to, by default
        { type: 'filter', field: 'assignedTo' }, 
      ]
    },
    defaultActions: DEFAULT_OPERATIONS,
    enduserActions: { 
      read: {}, readMany: {},
      logout: {}, refresh_session: {}, update: {}, current_session_info: {},  
      add_to_journey: {}, remove_from_journey: {}, begin_login_flow: {}, set_password: {}, /* restricted in handler to prevent updates when password is already set */
      unsubscribe: {},
    },
    fields: {
      ...BuiltInFields,   
      externalId: {
        validator: stringValidator250,
        examples: ['addfed3e-ddea-415b-b52b-df820c944dbb'],
      },
      email: { 
        validator: emailValidatorEmptyOkay,
        examples: ['test@tellescope.com'],
        redactions: ['enduser'],
      },
      alternateEmails: { validator: listValidatorOptionalOrEmptyOk(emailValidator) },
      emailConsent: { 
        validator: booleanValidator,
        examples: BOOLEAN_EXAMPLES,
        initializer: e => !!e.email, // set by default on create when provided
        redactions: ['enduser'],
      },
      phone: { 
        validator: phoneValidatorOptional,
        examples: ['+14155555555'],
        redactions: ['enduser'],
      },
      landline: { 
        validator: phoneValidatorOptional,
        examples: ['+14155555555'],
        redactions: ['enduser'],
      },
      phoneConsent: { 
        validator: booleanValidator,
        examples: BOOLEAN_EXAMPLES,
        initializer: e => !!e.phone, // set by default on create when provided
        redactions: ['enduser'],
      },
      hashedPassword: {
        validator: stringValidator100,
        readonly: true,
        redactions: ['enduser'], // todo: add more redactions
      },
      fname: { 
        validator: nameValidator,
        redactions: ['enduser'],
      },
      mname: { validator: nameValidator, redactions: ['enduser'], },
      lname: { 
        validator: nameValidator,
        redactions: ['enduser'],
      },
      dateOfBirth: { 
        validator: stringValidator250,
        redactions: ['enduser'],
      },
      journeys: { 
        validator: journeysValidator,
        redactions: ['enduser'],
        dependencies: [
          {
            dependsOn: ['journeys'],
            dependencyField: '_id',
            relationship: 'foreignKey',
            onDependencyDelete: 'unset',
            getDependentValues: t => Object.keys(t.journeys ?? {}),
            filterByDependency: journeyId => ({
              field: `journeys.${journeyId}`,
              value: 'any',
            }),
          },
        ]
      },
      scheduledJourneys: { validator: scheduledJourneysValidator },
      tags: { 
        redactions: ['enduser'],
        validator: listOfStringsValidatorEmptyOk,
      },
      unredactedTags: {
        validator: listOfStringsValidatorEmptyOk,
      },
      fields: {
        redactions: ['enduser'],
        validator: fieldsValidator,
      },
      unredactedFields: {
        validator: fieldsValidator,
      },
      preference: { 
        redactions: ['enduser'],
        validator: preferenceValidator,
      },
      assignedTo: { 
        redactions: ['enduser'],
        validator: listOfStringsValidatorEmptyOk,
      },
      unread: { 
        redactions: ['enduser'],
        validator: booleanValidator,
      },
      lastActive: { 
        validator: dateValidator,
      },
      lastLogout: { validator: dateValidator },
      termsSigned: { validator: dateValidator },
      termsVersion: { validator: stringValidator100 },
      lastCommunication: { 
        redactions: ['enduser'],
        validator: dateValidator,
      },
      avatar: {
        validator: stringValidator1000,
        dependencies: [
          {
            dependsOn: ['files'],
            dependencyField: 'secureName',
            relationship: 'foreignKey',
            onDependencyDelete: 'unset',
          },
        ]
      },
      gender: { validator: tellescopeGenderValidator },
      height: { validator: genericUnitWithQuantityValidator },
      weight: { validator: genericUnitWithQuantityValidator },
      source: { validator: stringValidator1000Optional },
      addressLineOne: { validator: stringValidator5000EmptyOkay },
      addressLineTwo: { validator: stringValidator5000EmptyOkay },
      city: { validator: stringValidator5000EmptyOkay },
      state: { validator: stateValidator },
      zipCode: { validator: stringValidator25000EmptyOkay },
      timezone: { validator: timezoneValidator },
      humanReadableId: { validator: stringValidator100 },
      displayName: { validator: stringValidator250 }, // intentionally not redacted for other endusers
      unsubscribedFromPortalChatNotifications: { validator: booleanValidator },
      triggeredEvents: { validator: objectAnyFieldsValidator(numberValidator) },
      customTypeId: { validator: mongoIdStringValidator },
      language: { validator: languageValidator },
      relationships: {
        validator: listValidatorOptionalOrEmptyOk(objectValidator<EnduserRelationship>({
          id: mongoIdStringRequired,
          type: stringValidator100,
        }))
      },
      markedReadAt: { validator: dateOptionalOrEmptyStringValidator },
      markedUnreadAt: { validator: dateOptionalOrEmptyStringValidator },
      note: { validator: stringValidator25000EmptyOkay },
      // recentMessagePreview: { 
      //   validator: stringValidator,
      // },
    }, 
    customActions: {
      add_to_journey: {
        op: "custom", access: 'update', method: "post",
        name: 'Add to journey',
        path: '/add-endusers-to-journey',
        description: "Adds (or restarts) endusers in a journey",
        parameters: { 
          enduserIds: { validator: listOfMongoIdStringValidator, required: true },
          journeyId: { validator: mongoIdStringValidator, required: true },
          automationStepId: { validator: mongoIdStringValidator },
          journeyContext: { validator: journeyContextValidator },
          throttle: { validator: booleanValidatorOptional },
        },
        returns: { } 
      },
      remove_from_journey: {
        op: "custom", access: 'update', method: "post",
        name: 'Remove from Journey',
        path: '/remove-endusers-from-journey',
        description: "Removes enduser(s) from in a journey",
        parameters: { 
          enduserIds: { validator: listOfMongoIdStringValidator, required: true },
          journeyId: { validator: mongoIdStringValidator, required: true },
        },
        returns: { } 
      },
      set_password: {
        op: "custom", access: 'update', method: "post",
        name: 'Set enduser password',
        path: '/set-enduser-password',
        description: "Sets (or resets) an enduser's password. Minimum length 8 characters. When called by enduser, can only be used to set initial password.",
        parameters: { 
          id: { validator: mongoIdStringValidator, required: true },
          password: { validator: stringValidator100, required: true },
        },
        returns: { } //authToken: { validator: stringValidator5000 } },
      },
      is_authenticated: {
        op: "custom", access: 'read', method: "get",
        name: 'Check enduser authentication',
        path: '/enduser-is-authenticated',
        description: "Checks the validity of an enduser's authToken",
        parameters: { 
          id: { validator: mongoIdStringValidator },
          authToken: { validator: stringValidator5000, required: true },
        },
        returns: { 
          isAuthenticated: { validator: booleanValidator, required: true }, 
          enduser: { validator: 'enduser' }, 
        } as any // todo: add enduser eventually, when validator defined
      },
      refresh_session: {
        op: "custom", access: 'update', method: "post",
        name: 'Refresh enduser authentication',
        path: '/refresh-enduser-session',
        description: "When called by an authenticated enduser, generates a new session",
        parameters: { },
        enduserOnly: true,
        returns: { 
          authToken: { validator: stringValidator, required: true }, 
          enduser: { validator: 'enduser', required: true }, 
        } as any // todo: add enduser eventually, when validator defined
      },
      generate_auth_token: {
        op: "custom", access: 'create', method: "get",
        name: 'Generate authToken',
        path: '/generate-enduser-auth-token',
        description: "Generates an authToken for use by an enduser. Useful for integrating a 3rd-party authentication process or creating a session for an enduser without a set password in Tellescope.",
        parameters: { 
          id: { validator: mongoIdStringValidator }, 
          externalId: { validator: stringValidator250 },
          email: { validator: emailValidator }, 
          phone: { validator: phoneValidator },
          durationInSeconds: { validator: nonNegNumberValidator },
        },
        returns: { 
          authToken: { validator: stringValidator100, required: true },
          enduser: { validator: 'enduser' as any, required: true },
        },
      },
      logout: {
        op: "custom", access: 'update', method: "post",
        name: 'Logout enduser',
        path: '/logout-enduser',
        description: "Logs out an enduser",
        parameters: {},
        returns: {},
      },
      current_session_info: {
        op: "custom", access: 'read', method: "get",
        name: 'Get session info',
        path: '/enduser-session-info',
        description: "When called by an authenticated enduser, returns their session details",
        parameters: { },
        enduserOnly: true,
        returns: { 
          enduser: { validator: 'enduser', required: true }, 
        } as any // todo: add enduser eventually, when validator defined
      },
      merge: {
        op: "custom", access: 'update', method: "post",
        name: 'Merge profiles',
        path: '/endusers/merge',
        description: "Migrates data from a source enduser to a target enduser, and then deletes the source enduser",
        parameters: {
          sourceEnduserId: { validator: mongoIdStringValidator, required: true },
          destinationEnduserId: { validator: mongoIdStringValidator, required: true },
        },
        returns: {},
      },
      push: {
        op: "custom", access: 'update', method: "post",
        name: 'Push',
        path: '/endusers/push',
        description: "Pushes (upserts) using some integrations, like Photon Health",
        parameters: {
          enduserId: { validator: mongoIdStringValidator, required: true },
        },
        returns: {},
      },
      bulk_update: {
        op: "custom", access: 'update', method: "patch",
        name: 'Bulk Updates',
        path: '/endusers/bulk-update',
        description: "Updates custom fields across a batch of endusers at once",
        parameters: {
          ids: { validator: listOfMongoIdStringValidator, required: true },
          fields: { validator: fieldsValidator },
          pushTags: { validator: listOfStringsValidator },
          replaceTags: { validator: listOfStringsValidator },
        },
        returns: {
          updated: { validator: 'endusers' as any },
        },
      },
      get_report: {
        op: "custom", access: 'read', method: "get",
        name: 'Report',
        path: '/endusers/report',
        description: "Builds a report",
        parameters: {
          queries: { validator: endusersReportQueriesValidator, required: true },
          activeSince: { validator: dateValidator, },
        },
        returns: {
          report: { validator: objectAnyFieldsAnyValuesValidator as any, required: true }
        },
      },
    },
    publicActions: {
      begin_login_flow: {
        op: "custom", access: 'read', method: "post",
        name: 'Begin enduser login flow',
        path: '/begin-enduser-login-flow',
        description: "Starts the login process for an enduser, supporting passwordless options",
        enduserOnly: true, // implemented as authenticate in enduser sdk only
        parameters: { 
          businessId: { validator: mongoIdStringValidator, required: true, },
          organizationIds: { validator: listOfMongoIdStringValidatorEmptyOk },
          phone: { validator: phoneValidator },
          email: { validator: emailValidator },
        },
        returns: { 
          result: { validator: loginFlowResultValidator, required: true },
          email: { validator: emailValidator },
        },
      },
      login: {
        op: "custom", access: 'read', method: "post",
        name: 'Login enduser',
        path: '/login-enduser',
        description: "Generates an authentication token for access to enduser-facing endpoints",
        enduserOnly: true, // implemented as authenticate in enduser sdk only
        parameters: { 
          businessId: { validator: mongoIdStringValidator, required: true, },
          organizationIds: { validator: listOfMongoIdStringValidatorEmptyOk },
          id: { validator: mongoIdStringValidator },
          phone: { validator: phoneValidator },
          email: { validator: emailValidator },
          password: { validator: stringValidator100, required: true }, // required until optional challenge token available
          durationInSeconds: { validator: nonNegNumberValidator },
        },
        returns: { authToken: { validator: stringValidator5000 } },
      },
      register: {
        op: "custom", access: 'create', method: "post",
        name: 'Register as Enduser',
        path: '/register-as-enduser',
        description: "Allows and enduser to register directly with an email and password",
        parameters: { 
          businessId: { validator: mongoIdStringValidator, required: true, },
          organizationIds: { validator: listOfMongoIdStringValidatorEmptyOk },
          email: { validator: emailValidator, required: true }, 
          password: { validator: stringValidator100, required: true },
          fname: { validator: nameValidator },
          lname: { validator: nameValidator },
          emailConsent: { validator: booleanValidator },
          termsSigned: { validator: dateValidator },
          termsVersion: { validator: stringValidator100 },
        },
        returns: { } //authToken: { validator: stringValidator5000 } },
      },
      request_password_reset: {
        op: "custom", access: 'update', method: "post",
        name: 'Request Password Reset',
        path: '/request-enduser-password-reset',
        description: "Sends a password reset email",
        parameters: { 
          email: { validator: emailValidator, required: true },
          businessId: { validator: mongoIdStringValidator, required: true, },
          organizationIds: { validator: listOfMongoIdStringValidatorEmptyOk },
        },
        returns: { },
      },
      reset_password: {
        op: "custom", access: 'update', method: "post",
        name: 'Reset Password',
        path: '/reset-enduser-password',
        description: "For a code generated by request-enduser-password-reset, sets a new password",
        parameters: { 
          resetToken: { validator: stringValidator250, required: true },
          newPassword: { validator: passwordValidator, required: true },
          businessId: { validator: mongoIdStringValidator, required: true, },
          organizationIds: { validator: listOfMongoIdStringValidatorEmptyOk },
        },
        returns: { },
      }, 
      unsubscribe: {
        op: "custom", access: 'update', method: "post",
        name: 'Unsubscribe Enduser',
        path: '/unsubscribe-enduser',
        description: "Unsubscribes an enduser from one or more types of notifications",
        parameters: { 
          enduserId: { validator: mongoIdStringValidator, required: true },
          unsubscribeFrom: { validator: listOfStringsValidator, required: true },
        },
        returns: { },
      }, 
    },
  },
  enduser_status_updates: {
    info: {
      sideEffects: { create: [sideEffects.updateEnduserStatus], createMany: [sideEffects.updateEnduserStatus] },
    },
    fields: {
      ...BuiltInFields,
      journeyId: { 
        validator: mongoIdStringValidator,
        examples: [PLACEHOLDER_ID],
        required: true,
        dependencies: [{
          dependsOn: ['journeys'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      enduserId: { 
        validator: mongoIdStringValidator,
        examples: [PLACEHOLDER_ID],
        required: true,
        dependencies: [{
          dependsOn: ['endusers'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      status: { 
        required: true,
        validator: stringValidator250, 
        examples: ["Status"]
      }
    },
    constraints: { unique: [], relationship: [], access: [] },
    defaultActions: { create: {}, createMany: {}, read: {}, readMany: {}, delete: {} },
    customActions: {},
  },
  api_keys: {
    info: {},
    fields: {
      ...BuiltInFields,
      hashedKey: {
        validator: stringValidator,
        readonly: true,
      },
    },
    constraints: { unique: [], relationship: [], access: [{ type: CREATOR_ONLY_ACCESS }] },
    defaultActions: { read: {}, readMany: {}, delete: {} },
    customActions: {
      create: {
        op: 'create', access: 'create',
        name: 'Generate ApiKey',
        description: "Generates and returns a new ApiKey. The returned key is not stored in Tellescope and cannot be retrieved later.",
        parameters: {},
        returns: { 
          id: {
            validator: mongoIdStringValidator,
          },
          key: {
            validator: stringValidator, 
          }
        }
      }
    }
  },
  integrations: {
    info: {},
    constraints: { 
      unique: [['title', 'creator']], relationship: [], access: [{ type: CREATOR_ONLY_ACCESS }] 
    },
    defaultActions: DEFAULT_OPERATIONS,
    fields: {
      ...BuiltInFields,
      title: {
        validator: stringValidator100,
        required: true,
        examples: ["Integration Title"]
      },
      authentication: {
        validator: integrationAuthenticationsValidator,
        required: true,
        examples: [
          {
            type: 'oauth2',
            info: { }
          }
        ]
      },
      lastSync: { validator: nonNegNumberValidator },
      emailDisabled: { validator: booleanValidator },
      syncUnrecognizedSenders: { validator: booleanValidator },
      calendars: { validator: listOfStringsValidatorOptionalOrEmptyOk },
      environment: { validator: stringValidator100 },
    },
    customActions: {
      generate_google_auth_url: {
        op: 'custom', access: 'create', method: 'post',
        path: '/generate-google-auth-url',
        name: 'Generates a link to create a Google integration with Tellescope',
        description: "", parameters: {},
        returns: { authUrl: { validator: stringValidator, required: true }, }
      },
      disconnect_google_integration: {
        op: 'custom', access: 'create', method: 'post',
        path: '/generate-square-auth-url',
        name: 'Generates a link to create a Square integration with Tellescope',
        description: "", parameters: {},
        returns: { authUrl: { validator: stringValidator, required: true }, }
      },
      generate_oauth2_auth_url: {
        op: 'custom', access: 'delete', method: 'post',
        path: '/generate-oauth2-auth-url',
        description: "", 
        parameters: { integration: { validator: integrationTitleValidator,  }},
        returns: { 
          authUrl: { validator: stringValidator, required: true },  
          state: { validator: stringValidator, required: true },  
        }
      },
      disconnect_oauth2_integration: {
        op: 'custom', access: 'delete', method: 'post',
        path: '/disconnect-oauth2-integration',
        name: 'Disconnects an integration with Square',
        refresh_oauth2_sessiondescription: "", 
        parameters: { integration: { validator: integrationTitleValidator }},
        returns: {}
      },
      refresh_oauth2_session: {
        op: 'custom', access: 'create', method: 'post',
        path: '/refresh-oauth2-session',
        name: 'Uses a refresh_token to refresh a session and return the result',
        description: "",
        parameters: { title: { validator: stringValidator100, required: true }},
        returns: { 
          access_token: { validator: stringValidator100, required: true },
          expiry_date: { validator: numberValidator, required: true },
        },
      },
      connect_stripe: {
        op: 'custom', access: 'create', method: 'post',
        path: '/connect-stripe',
        name: 'Begin Stripe integration via Connect',
        description: "", 
        parameters: {
          accountId: { validator: stringValidator100 },
          countryCode: { validator: exactMatchValidator<StripeCountryCode>(['US', 'GB']) }
        },
        returns: { 
          accountLinkUrl: { validator: stringValidator, required: true },
          accountId: { validator: stringValidator, required: true },
        }
      },
      connect_photon: {
        op: 'custom', access: 'create', method: 'post',
        path: '/integrations/connect-photon',
        name: 'Connect Photon Health',
        description: "", 
        parameters: {
          organizationId: { validator: stringValidator100, required: true },
          clientId: { validator: stringValidator100, required: true },
          clientSecret: { validator: stringValidator100, required: true },
          environment: { validator: stringValidator },
        },
        returns: { 
          updatedOrganization: { validator: 'organization' as any, required: true },
        }
      },
      disconnect_photon: {
        op: 'custom', access: 'create', method: 'post', adminOnly: true,
        path: '/integrations/disconnect-photon',
        name: 'Disconnect Photon Health',
        description: "", 
        parameters: {},
        returns: { }
      },
      connect_elation: {
        op: 'custom', access: 'create', method: 'post',
        path: '/integrations/connect-elation',
        name: 'Connect Elation',
        description: "", 
        parameters: {
          clientId: { validator: stringValidator100, required: true },
          clientSecret: { validator: stringValidator100, required: true },
          environment: { validator: stringValidator },
        },
        returns: { }
      },
      disconnect_elation: {
        op: 'custom', access: 'create', method: 'post', adminOnly: true,
        path: '/integrations/disconnect-elation',
        name: 'Disconnect Elation',
        description: "", 
        parameters: {},
        returns: { }
      },
      add_api_key_integration: {
        op: 'custom', access: 'create', method: 'post',
        path: '/integrations/add-api-key',
        name: 'Add an API-Key based integration',
        description: "", 
        parameters: {
          API_KEY: { validator: stringValidator, required: true },
          integration: { validator: stringValidator, required: true },
        },
        returns: { }
      },
      remove_api_key_integration: {
        op: 'custom', access: 'delete', method: 'delete',
        path: '/integrations/remove-api-key',
        name: 'Remove an API-Key based integration',
        description: "", 
        parameters: {
          integration: { validator: stringValidator, required: true },
        },
        returns: { }
      },
      sync_ehr: {
        op: 'custom', access: 'create', method: 'post',
        path: '/integrations/sync-ehr',
        name: 'Syncs EHR data which is not supported by webhooks (e.g. Dr. Chrono lab results)',
        description: "", 
        parameters: { },
        returns: { }
      },
      daily_sync: {
        op: 'custom', access: 'create', method: 'post',
        path: '/integrations/daily-sync',
        name: 'Syncs background tasks (like subscribing to Gmail notifications) once per 24hours',
        description: "", 
        parameters: { },
        returns: { }
      },
    }
  },
  engagement_events: {
    info: {},
    fields: {
      ...BuiltInFields,
      enduserId: {
        validator: mongoIdStringValidator,
        required: true,
        updatesDisabled: true,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['endusers'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      type: {
        validator: stringValidator100,
        required: true,
        examples: ['Test']
      },
      significance: {
        validator: nonNegNumberValidator,
        required: true,
        examples: [1]
      },
      timestamp: {
        validator: dateValidator,
        initializer: () => new Date(),
      },
      fields: {
        validator: fieldsValidator,
      }
    },
    constraints: { unique: [], relationship: [] },
    defaultActions: DEFAULT_OPERATIONS,
    enduserActions: { create: {}, createMany: {}, read: {}, readMany: {} }, // can only read their own
    customActions: {},
  },
  journeys: {
    info: {},
    fields: {
      ...BuiltInFields,
      title: {
        validator: stringValidator100,
        required: true,
        examples: ['Test']
      },
      defaultState: {
        validator: stringValidator100,
        initializer: j => (j.defaultState || j.states?.[0]?.name || 'New'),
      },
      description: {
        validator: stringValidator100,
      },
      states: {
        validator: journeyStatesValidator,
        initializer: j => j.defaultState 
                        ? [{ name: j.defaultState, priority: "N/A" }]
                        : [{ name: 'New', priority: "N/A" }]
      },
      onIncomingEnduserCommunication: { 
        validator: exactMatchValidator<'Remove' | ''>(['Remove', '']) 
      },
    },
    constraints: { 
      unique: ['title', { array: 'states', itemKey: 'name' }], 
      relationship: [{
        explanation: 'states must include defaultState',
        evaluate: ({ defaultState, states }) => {
          if (!(defaultState && states)) return

          if (states.find(s => s.name === defaultState) === undefined) {
            return "defaultState does not exist in states"
          }
        }
      }] 
    },
    defaultActions: {
      ...DEFAULT_OPERATIONS,
      create: {
        warnings: [
          "To update state names, use Update State to ensure that updates propagate to endusers",
        ],
      },
    },
    customActions: {
      // update_state: {
      //   op: 'custom', access: 'update', method: "patch",
      //   name: 'Update State',
      //   path: '/journey/:id/state/:name',
      //   description: "Updates a state in a journey. Endusers and automations are updated automatically.",
      //   parameters: { 
      //     id: { validator: mongoIdStringValidator },
      //     name: { validator: stringValidator100 },
      //     updates: { validator: journeyStateUpdateValidator, required: true },
      //   },
      //   returns: { 
      //     updated: { validator: 'journey' as any }
      //   },
      // },
      delete_states: {
        op: 'custom', access: 'update', method: "delete",
        name: 'Delete States',
        path: '/journey/:id/states',
        description: "Deletes states in a journey. Endusers and automations are updated automatically.",
        parameters: { 
          id: { validator: mongoIdStringValidator, required: true },
          states: { validator: listOfStringsValidator, required: true },
        },
        returns: { updated: 'journey' as any },
      },
      handle_incoming_communication: {
        op: 'custom', access: 'update', method: "post",
        name: 'Handle Incoming Communication',
        path: '/journeys/handle-incoming-communication',
        description: "Handles removing endusers from relevant journeys and provides other automation on an incoming communication",
        parameters: { 
          enduserId: { validator: mongoIdStringValidator, required: true },
          channel: { validator: stringValidator },
          messageId: { validator: mongoIdStringOptional },
        },
        returns: { },
      },
      get_journey_statistics: {
        op: 'custom', access: 'read', method: "get",
        name: 'Handle Incoming Communication',
        path: '/journeys/statistics',
        description: "Gets statistics for a journey",
        parameters: { 
          journeyId: { validator: mongoIdStringValidator, required: true },
        },
        returns: { 
          // todo: document shape with validator
          statistics: { validator: objectAnyFieldsAnyValuesValidator as any } 
        },
      },
    },
  },
  emails: {
    info: {
      sideEffects: { create: [sideEffects.sendEmails] },
    },
    defaultActions: { 
      create: {
        description: "Sends or logs an email"
      }, createMany: {
        description: "Sends or logs multiple emails"
      },
      update: {}, read: {}, readMany: {}, delete: {} 
    },
    constraints: {
      unique: [], 
      relationship: [
        {
          explanation: "Email and email consent must be set for enduser",
          evaluate: ({ enduserId, logOnly }, deps, _, method) => {
            if (logOnly === true) return
            if (method === 'update') return

            const e = deps[enduserId ?? ''] as Enduser
            if (!e) return // not in cache, permit by default, likely during an update
            if (!e?.email) return "Missing email"
            // if (!e?.emailConsent) return "Missing email consent"
          }
        }
      ],
      access: [
        { type: 'filter', field: 'userId' }, 
      ]
    },
    fields: {
      ...BuiltInFields,   
      logOnly: {
        validator: booleanValidator,
        examples: [true],
        initializer: () => false,
      },
      enduserId: {
        validator: mongoIdStringValidator,
        required: true,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['endusers'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      userId: {
        validator: mongoIdStringValidator,
        examples: [PLACEHOLDER_ID],
        updatesDisabled: true, 
        initializer: (a, s) => (s as UserSession).id,
      },
      subject: {
        validator: stringValidator,
        required: true,
        examples: ["Email Subject"],
      },
      textContent: {
        validator: stringValidator100000EmptyOkay,
        required: true,
        examples: ["Hi there, this is Sebastian"],
      },
      HTMLContent: {
        validator: stringValidator100000EmptyOkay,
      },
      timestamp: {
        validator: dateValidator,
        initializer: () => new Date(),
      },
      delivered: {
        validator: booleanValidator,
        readonly: true,
        initializer: s => !!s.logOnly
      },
      replyTo: {
        validator: stringValidator,
        initializer: () => null,
      },
      threadId: {
        validator: stringValidator,
        initializer: s => s.replyTo ?? '',
        readonly: true,
      },
      source: {
        validator: emailValidator,
        readonly: true,
      },
      openedAt: {
        validator: dateValidator,
        readonly: true,
      },
      linkOpens: {
        validator: numberToDateValidator,
        readonly: true,
        examples: [{ 0: new Date() }]
      },
      messageId: {
        validator: stringValidator,
        readonly: true,
      },
      inbound: {
        validator: booleanValidator,
        initializer: () => false,
      },
      textEncoding: {
        validator: emailEncodingValidator,
        readonly: true,
      },
      htmlEncoding: {
        validator: emailEncodingValidator,
        readonly: true,
      },
      s3id: {
        validator: stringValidator250,
        readonly: true,
      },
      readBy: { validator: idStringToDateValidator },
      hiddenBy: { validator: idStringToDateValidator },
      templateId: { validator: mongoIdStringValidator },
      automationStepId: { validator: mongoIdStringValidator },
      linkOpenTrackingIds: {
        validator: listOfStringsValidatorEmptyOk,
        initializer: () => [],
      },
      journeyContext: { validator: journeyContextValidator },
      sendAt: { validator: dateOptionalOrEmptyStringValidator },
      pinnedAt: { validator: dateOptionalOrEmptyStringValidator },
      isDraft: { validator: booleanValidator },
      cc: { validator: listOfStringsValidatorEmptyOk },
      fromEmailOverride: { validator: stringValidator100 },
      ticketIds: { validator: listOfStringsValidatorEmptyOk },
      alternateToAddress: { validator: emailValidator },
      suggestedReply: { validator: stringValidator5000EmptyOkay },
      tags: { validator: listOfStringsValidatorOptionalOrEmptyOk },
    }, 
    customActions: {
      sync_integrations: {
        op: "custom", access: 'read', method: "post",
        name: 'Sync Integrations',
        path: '/sync-email-integrations',
        description: "Syncs email with external integrations (like Gmail) and returns any newly created messages",
        parameters: { 
          enduserEmail: { validator: emailValidator, required: true },
          allUsers: { validator: booleanValidator },
        },
        returns: { 
          newEmails: { validator: 'emails' as any, required: true },
        } 
      },
      deliver_via_outlook: {
        op: "custom", access: 'create', method: "post", 
        warnings: [
          "Use Create Email instead, unless you want to avoid logging the message in Tellescope"
        ],
        name: 'Send Outlook Mail',
        path: '/deliver-email-via-outlook',
        description: "Sends an email via Outlook integration without creating a record in Tellescope",
        parameters: { 
          senderId: { validator: stringValidator, required: true },
          message: { validator: stringValidator100000EmptyOkay, required: true },
          replyId: { validator: stringValidator1000Optional },
          cc: { validator: listOfStringsValidatorOptionalOrEmptyOk },
        },
        returns: { 
          id: { validator: mongoIdStringValidator, required: true },
          conversationId: { validator: mongoIdStringValidator, required: true },
          timestamp: { validator: stringValidator100, required: true},
        } 
      },
    },
  },
  sms_messages: {
    info: {
      sideEffects: { create: [sideEffects.sendSMSMessages] },
    },
    publicActions: {
      leave_message: {
        op: "custom", access: 'create', method: "post",
        name: 'Leave Message',
        path: '/sms-messages/leave-message',
        description: "Leaves an SMS message submitted from a website page",
        parameters: { 
          businessId: { validator: mongoIdStringRequired, required: true },
          fname: { validator: nameValidator, required: true },
          lname: { validator: nameValidator, required: true },
          phone: { validator: phoneValidator, required: true },
          message: { validator: stringValidator5000, required: true },
        },
        returns: { },
      },
    },
    customActions: {
      send_message_to_number: {
        op: "custom", access: 'create', method: "post",
        name: 'Send Message to Number',
        path: '/sms-messages/send-message-to-number',
        description: "Sends an SMS to the provided phone number, upserting an enduser if no match by phone",
        warnings: [
          'message must be under 1200 characters',
        ],
        parameters: { 
          message: { validator: stringValidator5000, required: true },
          to: { validator: phoneValidator, required: true }
        },
        returns: { enduser: { validator: 'enduser' as any, required: true } },
      },
    },
    defaultActions: { 
      create: {
        description: "Sends or logs an SMS message"
      }, createMany: {
        description: "Sends or logs multiple SMS message"
      }, 
      update: {}, read: {}, readMany: {}, delete: {} 
    },
    enduserActions: { leave_message: {} },
    constraints: {
      unique: [],
      relationship: [
        {
          explanation: "Message must be non-empty",
          evaluate: ({ message }, deps, _) => {
            if (message === undefined) return "message must not be blank"
          }
        },
        {
          explanation: "Phone number and phone consent must be set for enduser",
          evaluate: ({ enduserId, logOnly }, deps, _) => {
            if (logOnly === true) return

            const e = deps[enduserId ?? ''] as Enduser
            if (!e) return // not in cache, permit by default, likely during an update
            if (!e.phone) return "Missing phone"
            // if (!e.phoneConsent) return "Missing phone consent"
          }
        },
      ],
      access: [
        { type: 'filter', field: 'userId' }, 
      ]
    },
    fields: {
      ...BuiltInFields,   
      logOnly: {
        validator: booleanValidator,
        examples: [true],
        initializer: () => false,
      },
      message: {
        validator: SMSMessageValidator,
        required: true,
        examples: ["Test message"],
        // updates should be allowed for drafts / unsent messages
        // updatesDisabled: true
      },
      linkOpens: {
        validator: numberToDateValidator,
        readonly: true,
        examples: [{ 0: new Date() }]
      },
      enduserId: {
        validator: mongoIdStringValidator,
        required: true,
        examples: [PLACEHOLDER_ID],
        updatesDisabled: true,
        dependencies: [{
          dependsOn: ['endusers'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      userId: {
        validator: mongoIdStringValidator,
        initializer: (a, s) => s.id,
        updatesDisabled: true,
        dependencies: [{
          dependsOn: ['users'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'setNull',
        }]
      },
      inbound: {
        validator: booleanValidator,
        initializer: () => false,
        readOnly: true,
      },
      newThread: {
        validator: booleanValidator,
        updatesDisabled: true,
      },
      delivered: {
        validator: booleanValidator,
        readonly:  true,
        initializer: s => !!s.logOnly
      },
      internalMessageId: {
        validator: stringValidator250,
        readonly:  true,
      },
      readBy: { validator: idStringToDateValidator },
      hiddenBy: { validator: idStringToDateValidator },
      templateId: { validator: mongoIdStringValidator },
      automationStepId: { validator: mongoIdStringValidator },
      linkOpenTrackingIds: {
        validator: listOfStringsValidatorEmptyOk,
        initializer: () => [],
      },
      journeyContext: { validator: journeyContextValidator },
      sendAt: { validator: dateOptionalOrEmptyStringValidator },
      pinnedAt: { validator: dateOptionalOrEmptyStringValidator },
      isDraft: { validator: booleanValidator },
      timestamp: { validator: dateValidator },
      ticketIds: { validator: listOfStringsValidatorEmptyOk },
      suggestedReply: { validator: stringValidator5000EmptyOkay },
      phoneNumber: { validator: stringValidatorOptionalEmptyOkay },
      enduserPhoneNumber: { validator: phoneValidator },
      tags: { validator: listOfStringsValidatorOptionalOrEmptyOk },
    }, 
  },
  chat_rooms: {
    info: {},
    constraints: { 
      unique: [{ array: 'userIds' }, { array: 'enduserIds' }], 
      relationship: [],
      access: [
        { type: 'filter', field: 'userIds' }, 
        { type: 'filter', field: 'enduserIds' },
      ]
    },
    fields: {
      ...BuiltInFields,
      title: {
        validator: stringValidator100,
      },
      numMessages: {
        validator: nonNegNumberValidator,
        initializer: () => 0,
      },
      recentMessageSentAt: {
        validator: nonNegNumberValidator,
      },
      type: {
        validator: chatRoomTypeValidator,
        initializer: () => 'internal' as ChatRoomType
      },
      topic: {
        validator: stringValidator5000, // long to support MP use case / custom topics
      },
      topicId: {
        validator: stringValidator100,
      },
      description: {
        validator: stringValidator250,
      },
      userIds: {
        validator: listOfMongoIdStringValidatorEmptyOk,
        examples: [[PLACEHOLDER_ID]], 
        // required: true, // no longer required
        // add pull dependency for user deletion?
      },
      enduserIds: {
        validator: listOfMongoIdStringValidatorEmptyOk,
        // add pull dependency for enduser deletion?
      },
      recentMessage: {
        validator: stringValidator,
        initializer: () => '',
        readonly: true,
      },
      recentSender: {
        validator: mongoIdStringValidator,
        initializer: () => '',
        readonly: true,
      },
      ticketId: {
        validator: mongoIdStringValidator,
      },
      endedAt: {
        validator: dateValidator,
      },
      tags: {
        validator: listOfStringsValidatorEmptyOk,
      },
      infoForUser: { // todo: access-permissions allow updates for self only (when non-admin)
        validator: chatRoomUserInfoValidator,
      },
      aboutEnduserId: { 
        validator: mongoIdStringValidator,
        dependencies: [{
          dependsOn: ['endusers'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      pinnedAt: { validator: dateOptionalOrEmptyStringValidator },
      fields: { validator: fieldsValidator },
      suggestedReply: { validator: stringValidator5000EmptyOkay },
    },
    defaultActions: DEFAULT_OPERATIONS,
    enduserActions: { create: {}, read: {}, readMany: {}, display_info: {}, mark_read: {} },
    customActions: {
      join_room: {
        op: "custom", access: 'update', method: "post",
        name: 'Join chat room',
        path: '/join-chat-room',
        description: "Allows a user to join a chat room with no other users, for use in accepting support chats.",
        parameters: { id: { validator: mongoIdStringValidator, required: true } },
        returns: { 
          room: { validator:  'Room' }, 
        } as any // add room eventually, when validator defined
      },
      mark_read: {
        op: "custom", access: 'update', method: "post",
        name: 'Mark Read',
        path: '/mark-chat-room-read',
        description: "Marks the conversation read by the authenticated user",
        parameters: { id: { validator: mongoIdStringValidator, required: true } },
        returns: { 
          updated: { validator:  'Room' }, 
        } as any // add room eventually, when validator defined
      },
      display_info: {
        op: "custom", access: 'read', method: "get",
        name: 'Attendee display info',
        path: '/chat-room-display-info',
        description: "Returns an object which maps userIds/enduserIds to display information. Includes the roomId as the 'id' field.",
        parameters: { id: { validator: mongoIdStringValidator, required: true } },
        returns: { 
          display_info: { validator: meetingDisplayInfoValidator, required: true },
          id: { validator: mongoIdStringValidator },
        } 
      },
    },
  },
  chats: {
    info: {
      name: 'ChatMessages',
      description: "Messages between users in a given Chat Room",
      sideEffects: {
        create: [sideEffects.updateChatroomCache]
      }
    },
    constraints: { 
      unique: [], 
      relationship: [],
      access: [{ type: 'dependency', foreignModel: 'chat_rooms', foreignField: '_id', accessField: 'roomId' }]
    },
    defaultActions: { create: {}, update: {}, read: {}, readMany: {}, delete: {} }, // avoid createMany for now
    readFilter: {
      // roomId: { required: true },
    },
    enduserActions: { create: {}, read: {}, readMany: {} },
    customActions: {},
    fields: {
      ...BuiltInFields,
      roomId: {
        validator: mongoIdStringValidator,
        required: true,
        updatesDisabled: true,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['chat_rooms'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      linkOpens: {
        validator: numberToDateValidator,
        readonly: true,
        examples: [{ 0: new Date() }]
      },
      senderId: { 
        validator: mongoIdStringValidator,
        // if changing readonly to false, need to update side effect for track_chats_timestamp
        // readonly: true, // create a separate endpoint for storing enduser chats
        initializer: (a, s) => s.id,
        examples: [PLACEHOLDER_ID],
        dependencies: [{ // can be userId or enduserId
          dependsOn: ['users', 'endusers'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'setNull',
        }]
      },
      message: {
        validator: stringValidator5000,
        required: true,
        examples: ["Message"]
      },
      html: { validator: stringValidator5000 }, 
      replyId: {
        validator: mongoIdStringValidator,
        updatesDisabled: true,
        dependencies: [{
          dependsOn: ['chats'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'setNull',
        }]
      },
      readBy: { validator: idStringToDateValidator },
      hiddenBy: { validator: idStringToDateValidator },
      attachments: {
        validator: listOfChatAttachmentsValidator,
      },
      templateId: { validator: mongoIdStringValidator },
      automationStepId: { validator: mongoIdStringValidator },
      linkOpenTrackingIds: {
        validator: listOfStringsValidatorEmptyOk,
        initializer: () => [],
      },
      timestamp: { validator: dateValidator },
      ticketIds: { validator: listOfStringsValidatorEmptyOk },
      tags: { validator: listOfStringsValidatorOptionalOrEmptyOk },
    },
  },
  users: {
    info: {
      description: "Used to represent your team member accounts. See Endusers for representing patients and other types of stakeholders.",
    },
    constraints: { 
      unique: ['username'],
      globalUnique: ['email', 'phone'],
      relationship: [
        {
          explanation: "Only admin users can set the admin role",
          evaluate: ({ _id }, deps, session, type, { updates }) => {
            if (_id && _id.toString() === session.id) return
            if ((session as UserSession)?.roles?.includes('Admin')) return

            if (updates?.roles?.includes("Admin")) return "Only Admin users can assign the Admin role"
          }
        },
        {
          explanation: "Only admin users can update others' profiles",
          evaluate: ({ _id }, _, session) => {
            if (_id && _id.toString() === session.id) return
            if ((session as UserSession)?.roles?.includes('Admin')) return

            return "Only admin users can update others' profiles"
          }
        }, {
          explanation: "Only admin users can update user roles",
          evaluate: ({ roles }, _, session, method, { updates }) => {
            if ((session as UserSession)?.roles?.includes('Admin')) return // admin can do this
            if (method === 'create') return // create already admin restricted
            if (!updates?.roles) return // roles not provided

            return "Only admin users can update others' profiles"
          }
        }, {
          explanation: "User organizationIds are readonly",
          evaluate: ({ }, _, session, method, { updates }) => {
            if (method === 'create') return // only concerned with updates
            if (!updates?.organizationIds) return

            return "User organizationIds are readonly"
          }
        }
      ],
    },
    defaultActions: { 
      create: { adminOnly: true }, createMany: { adminOnly: true }, delete: { adminOnly: true },
      read: {}, readMany: {}, update: { description: "Users can only be updated by self or an organization admin"} 
    },
    enduserActions: { display_info: {}, read: {}, readMany: {} },
    customActions: {
      invite_user: { // must stay in users now, not organizations, so that create access permission is enforced
        op: "custom", access: 'create', method: "post", 
        adminOnly: true,
        name: 'Invite User',
        path: '/invite-user-to-organization',
        description: "Invites a user to register for the given (sub)-organization",
        parameters: { 
          email: { validator: emailValidator, required: true },
          fname: { validator: nameValidator, required: true },
          lname: { validator: nameValidator, required: true },
          internalDisplayName: { validator: stringValidatorOptionalEmptyOkay },
          organizationId: { validator: mongoIdStringValidator, required: true },
          role: { validator: stringValidator },
          tags: { validator: listOfStringsValidatorOptionalOrEmptyOk },
        },
        returns: { 
          created: { validator: 'user' as any, required: true },
        } 
      },
      send_invitation_to_existing: { // access should stay create to allow people who can create users to send invites
        op: "custom", access: 'create', method: "post",
        name: 'Invite user to join organization',
        path: '/invite-existing-user-to-organization',
        adminOnly: true,
        description: "Invites a user to join the current (sub)organization",
        parameters: { userId: { validator: mongoIdStringValidator, required: true } },
        returns: { },
      },
      generate_auth_token: {
        op: "custom", access: 'create', method: "get",
        name: 'Generate authToken (Admin Only)',
        path: '/generate-auth-token',
        description: "Generates an authToken for a user or enduser. Useful for integrating a 3rd-party authentication process.",
        parameters: { 
          id: { validator: mongoIdStringValidator }, 
          externalId: { validator: stringValidator250 },
          email: { validator: emailValidator }, 
          phone: { validator: phoneValidator },
          durationInSeconds: { validator: nonNegNumberValidator },
        },
        returns: { 
          authToken: { validator: stringValidator100, required: true },
          enduser: { validator: 'enduser' as any, required: false },
          user: { validator: 'user' as any, required: false },
        },
      },
      display_info: {
        op: "custom", access: 'read', method: "get",
        name: 'User Display Info',
        path: '/user-display-info',
        description: "Gets display info for users, accessible by endusers",
        parameters: {},
        returns: { 
          validator: listOfDisplayNameInfo
        },
      },
      refresh_session: {
        op: "custom", access: 'update', method: "post",
        name: 'Refresh enduser authentication',
        path: '/refresh-session',
        description: "When called by an authenticated user, generates a new session",
        parameters: { },
        returns: { 
          authToken: { validator: stringValidator, required: true }, 
          enduser: { validator:  'user' }, 
        } as any // add enduser eventually, when validator defined
      },
      configure_inbox: {
        op: "custom", access: 'update', method: "post",
        name: 'Configure Inbox',
        path: '/users/configure-inbox',
        description: "Configured inbox to support built-in email server",
        parameters: { 
          username: { validator: subdomainValidator, required: true },
          fname: { validator: nameValidator, required: true },
          lname: { validator: nameValidator, required: true },
        },
        returns: { 
          authToken: { validator: stringValidator, required: true },
          user: { validator: 'user' as any, required: true },
        },
      },
    },
    publicActions: {
      register: {
        op: "custom", access: 'create', method: "post",
        name: 'Register',
        path: '/users/register',
        description: "Registers a new account",
        parameters: { 
          email: { validator: emailValidator, required: true },
          password: { validator: stringValidator100, required: true },
          termsVersion: { validator: stringValidator100, required: true },
          inviteCode: { validator: stringValidator1000 },
        },
        returns: { },
      },
      login: {
        op: "custom", access: 'update', method: "post",
        name: 'Login',
        path: '/users/login',
        description: "Login with email and password",
        parameters: { 
          email: { validator: emailValidator, required: true },
          password: { validator: stringValidator100, required: true },
          expirationInSeconds: { validator: numberValidator }
        },
        returns: { 
          authToken: { validator: stringValidator, required: true },
          user: { validator: 'user' as any, required: true },
        },
      },
      login_with_google: {
        op: "custom", access: 'update', method: "post",
        name: 'Login with Google',
        path: '/users/login-google',
        description: "Login with Google",
        parameters: { 
          jwt: { validator: stringValidator25000, required: true },
        },
        returns: { 
          authToken: { validator: stringValidator, required: true },
          user: { validator: 'user' as any, required: true },
        },
      },
      request_password_reset: {
        op: "custom", access: 'update', method: "post",
        name: 'Request Password Reset',
        path: '/request-password-reset',
        description: "Sends a password reset email",
        parameters: { 
          email: { validator: emailValidator, required: true }
        },
        returns: { },
      },
      reset_password: {
        op: "custom", access: 'update', method: "post",
        name: 'Reset Password',
        path: '/reset-password',
        description: "For a code generated by request-password-reset, sets a new password",
        parameters: { 
          resetToken: { validator: stringValidator250, required: true },
          newPassword: { validator: passwordValidator, required: true },
        },
        returns: { },
      }, 
      submit_email_verification: {
        op: "custom", access: 'update', method: "post",
        name: 'Submit Email Verification',
        path: '/users/submit-email-verification',
        description: "Verifies a user's email address",
        parameters: { 
          email: { validator: emailValidator, required: true },
          code: { validator: stringValidator1000, required: true },
        },
        returns: { 
          authToken: { validator: stringValidator, required: true },
          user: { validator: 'user' as any, required: true },
        },
      },
    },
    fields: {
      ...BuiltInFields, 
      email: {
        validator: emailValidator,
        required: true,
        examples: ['test@tellescope.com'],
        redactions: ['enduser'],
      },
      phone: {
        validator: phoneValidator,
        redactions: ['enduser'],
      },
      fields: {
        validator: fieldsValidator,
        redactions: ['enduser'],
      },
      unredactedFields: {
        validator: fieldsValidator,
      },
      username: {
        validator: subdomainValidator,
        readonly: true, // able to set once, then not change (for now, due to email configuration)
        redactions: ['enduser'],
      },
      externalId: {
        validator: stringValidator250,
      },
      fname: { validator: nameValidator, },
      lname: { validator: nameValidator, },
      displayName: { validator: stringValidatorOptionalEmptyOkay }, // enduser-facing
      internalDisplayName: { validator: stringValidator100, redactions: ['enduser'] }, // internal-facing
      suffixes: { validator: listOfStringsValidatorEmptyOk },
      organization: {
        validator: mongoIdStringValidator,
        updatesDisabled: true,
      },
      orgEmail: {
        validator: emailValidator,
        readonly: true,  // able to set once, then not change (for now, due to email configuration)
      },
      accountType: {
        validator: stringValidator,
        readonly: true,
      },
      roles: {
        validator: listOfStringsValidator,
        redactions: ['enduser'],
      },
      acknowledgedIntegrations: { validator: dateValidator },
      disableIncomingPhoneCalls: { validator: booleanValidator },
      skills: {
        validator: listOfStringsValidatorEmptyOk,
      },
      verifiedEmail: {
        updatesDisabled: true, // allow it to be set on creation by admin via API to streamline SSO support
        validator: booleanValidator,
      },
      hashedPassword: {
        validator: stringValidator,
        readonly: true, // update via separate password reset function
        redactions: ['enduser'],
      },
      notificationPreferences: {
        validator: notificationPreferencesValidator,
        redactions: ['enduser'],
      },
      notificationEmailsDisabled: { validator: booleanValidator },
      avatar: {
        validator: stringValidator1000,
        dependencies: [
          {
            dependsOn: ['files'],
            dependencyField: 'secureName',
            relationship: 'foreignKey',
            onDependencyDelete: 'unset',
          },
        ]
      },
      credentialedStates: {
        validator: stateCredentialsValidator,
      },
      timezone: { validator: timezoneValidator },
      weeklyAvailabilities: { validator: weeklyAvailabilitiesValidator },
      autoReplyEnabled: { validator: booleanValidatorOptional },
      pushNotificationIosTokens: { validator: listOfStringsValidatorEmptyOk },
      callRouting: { validator: userCallRoutingBehaviorValidator },
      tags: { validator: listOfStringsValidatorOptionalOrEmptyOk }, 
      emailSignature: { validator: stringValidator1000 },
      disableTicketAutoAssignment: { validator: booleanValidator },
      ticketAssignmentPriority: { validator: nonNegNumberValidator },
      specialties: { validator: listOfStringsValidatorOptionalOrEmptyOk }, 
      bio: { validator: stringValidator25000EmptyOkay }, 
      TIN: { validator: stringValidatorOptionalEmptyOkay },
      NPI: { validator: stringValidatorOptionalEmptyOkay },
      DEA: { validator: stringValidatorOptionalEmptyOkay },
    }
  },
  templates: {
    info: {},
    constraints: { 
      unique: ['title'],
      relationship: [],
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {
      get_templated_message: {
        op: "custom", access: 'read', method: "post",
        name: 'Get templated message',
        path: '/templated-message',
        description: "Returns a message with template values replaced. Uses POST to support large bodies.",
        parameters: { 
          message: { validator: stringValidator100000EmptyOkay, required: true },
          userId: { validator: mongoIdStringValidator, required: true },
          enduserId: { validator: mongoIdStringValidator, required: true },
          html: { validator: stringValidator100000EmptyOkay },
          subject: { validator: stringValidatorOptionalEmptyOkay },
          channel: { validator: communicationsChannelValidator },
          automationStepId: { validator: mongoIdStringValidator },
          journeyContext: { validator: journeyContextValidator },
        },
        returns: { 
          plaintext: { validator: stringValidator25000, required: true },
          html: { validator: stringValidator25000, required: true },
          subject: { validator: stringValidator },
          linkOpenTrackingIds: { validator: listOfStringsValidatorEmptyOk, required: true },
        },
      },
      get_suggested_reply: {
        op: "custom", access: 'read', method: "post",
        name: 'Get suggested reply',
        path: '/templates/suggested-reply',
        description: "Returns an AI-generated suggested reply to a conversation.",
        parameters: { 
          messages: { validator: externalChatGPTMessagesValidator, required: true },
        },
        returns: { 
          completion: { validator: stringValidator, required: true }
        },
      },
      create_embedding: {
        op: "custom", access: 'update', method: "post",
        name: 'Generate Embedding',
        path: '/templates/create-embedding',
        description: "Generates an embedding for AI search",
        parameters: { 
          templateId: { validator: mongoIdStringValidator, required: true }
        },
        returns: { },
      },
      embedding_search: {
        op: "custom", access: 'read', method: "post",
        name: 'Embedding Search',
        path: '/templates/embedding-search',
        description: "Performs an AI search",
        parameters: { 
          content: { validator: stringValidator25000, required: true },
        },
        returns: { 
          templateIds: { validator: listOfMongoIdStringValidator, required: true },
        },
      },
    },
    fields: {
      ...BuiltInFields, 
      title: {
        validator: stringValidator100,
        required: true,
        examples: ["Template Name"],
      },
      subject: {
        validator: stringValidator250,
        required: true,
        examples: ["Template Subject"],
      },
      message: {
        validator: stringValidator100000EmptyOkay,
        required: true,
        examples: ["This is the template message......"],
      },
      html: {
        validator: stringValidator100000EmptyOkay,
        examples: ["This is the template message......"],
      },
      editorState: {
        validator: stringValidator25000,
        examples: ["This is the template message......"],
      },
      type: {
        validator: messageTemplateTypeValidator,
        initializer: () => 'enduser' as MessageTemplateType
      },
      mode: {
        validator: messageTemplateModeValidator,
      },
    },
  },
  files: {
    info: {},
    constraints: { unique: [], relationship: [] },
    defaultActions: { read: {}, readMany: {}, update: {}, delete: {} },
    enduserActions: { prepare_file_upload: {}, file_download_URL: {}, read: {}, readMany: {}, delete: {}, update: { } /* allow to hide from client side */ },
    fields: {
      ...BuiltInFields, 
      name: {
        validator: stringValidator250,
        required: true,
      },
      size: {
        validator: fileSizeValidator,
        required: true,
      },
      type: {
        validator: fileTypeValidator,
        required: true
      },
      enduserId: { // deleted as side effect of enduser delete
        validator: mongoIdStringValidator,
      },
      secureName: {
        validator: stringValidator250,
        readonly: true,
      },
      hideFromEnduserPortal: { validator: booleanValidator }, // enduser self-hide
      pushedToClientPortal: { validator: booleanValidator }, // user push
      hiddenFromEnduser: { validator: booleanValidator }, // user hide
    },
    customActions: {
      prepare_file_upload: {
        op: "custom", access: 'create', method: "post",
        name: 'Prepare File Upload',
        path: '/prepare-file-upload',
        description: "Generates an upload link for a file, storing metadata as a File record.",
        parameters: { 
          name: {
            validator: stringValidator250,
            required: true,
          },
          size: {
            validator: fileSizeValidator,
            required: true,
          },
          type: {
            validator: fileTypeValidator,
            required: true
          },
          publicRead: { validator: booleanValidator },
          publicName: { validator: stringValidator5000 },
          enduserId: { 
            validator: mongoIdStringValidator ,
            dependencies: [{
              dependsOn: ['endusers'],
              dependencyField: '_id',
              relationship: 'foreignKey',
              onDependencyDelete: 'setNull',
            }]
          },
          source: { validator: stringValidator100 },
        },
        returns: { 
          presignedUpload: {
            validator: objectAnyFieldsAnyValuesValidator,
          },
          file: {
            validator: 'file' as any, // todo: add file validator
          },
        },
      },
      file_download_URL: {
        op: "custom", access: 'read', method: "get",
        name: 'Generate File Download',
        path: '/file-download-URL',
        description: "Generates a temporary download link for a file (which expires in no more than 7 days).",
        parameters: { 
          secureName: { validator: stringValidator250, required: true },
        },
        returns: { 
          downloadURL: { validator: stringValidator250, required: true },
          name: { validator: stringValidator100, required: true },
        },
      },
    },
  },
  tickets: {
    info: {
      sideEffects: {
        update: [sideEffects.handleTicketClosed],
      }
    },
    constraints: {
      unique: [], 
      relationship: [
        {
          explanation: 'When created by an enduser, enduserId must match their id',
          evaluate: ({ enduserId },_,session) => {
          if (session.type === ENDUSER_SESSION_TYPE && session.id !== enduserId)
            return "enduserId does not match creator id for enduser session"
          } 
        },
      ],
      access: [
        { type: 'filter', field: 'owner' }, 
      ]
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {
      update_indexes: {
        op: "custom", access: 'update', method: "patch",
        name: 'Update Indexes',
        path: '/tickets/update-indexes',
        description: "Updates indexes for a number of tickets to adjust the default sorting",
        parameters: { 
          updates: { validator: indexUpdatesValidator, required: true },
        },
        returns: {},
      },
      get_report: {
        op: "custom", access: 'read', method: "get",
        name: 'Get Report',
        path: '/tickets/report',
        description: "Gets aggregate data for building a report on tickets",
        parameters: { 
          userId: { validator: mongoIdStringOptional },
          title: { validator: stringValidator25000 },
          range: { validator: dateRangeOptionalValidator },
        },
        returns: {
          report: { validator: objectAnyFieldsAnyValuesValidator as any, required: true }
        },
      },
    },
    enduserActions: { create: {}, read: {}, readMany: {} },
    fields: {
      ...BuiltInFields, 
      title: {
        validator: stringValidator1000,
        required: true,
        examples: ["Ticket Name"],
      },
      enduserId: {
        validator: mongoIdStringValidator,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['endusers'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      automationStepId: {
        validator: mongoIdStringValidator,
      },
      closedForReason: { validator: stringValidator },
      closeReasons: { validator: listOfStringsValidatorEmptyOk },
      closedBy: { validator: mongoIdStringValidator },
      chatRoomId: {
        validator: mongoIdStringValidator,
      },
      dueDateInMS: {
        validator: nonNegNumberValidator,
      },
      closedAt: {
        validator: dateValidator,
      },
      owner: {
        validator: mongoIdStringValidator,
      },
      message: {
        validator: stringValidator5000,
        examples: ["Message"],
      },
      type: {
        validator: stringValidator100,
      },
      skillsRequired: {
        validator: listOfStringsValidator,
      },
      priority: { validator: numberValidator },
      stage: { validator: stringValidator100 },
      blockerDescription: { validator: stringValidator5000EmptyOkay },
      index: { validator: numberValidator },
      carePlanId: { validator: mongoIdStringValidator },
      journeyId: { validator: mongoIdStringValidator },
      purchaseId: { validator: mongoIdStringValidator },
      hiddenFromTickets: { validator: booleanValidator },
      htmlDescription: { validator: stringValidatorOptional },
      formResponseIds: { validator: listOfStringsValidatorEmptyOk },
      actions: { validator: ticketActionsValidator },
      remindAt: { validator: dateOptionalOrEmptyStringValidator },
      reminderSilencedAt: { validator: dateOptionalOrEmptyStringValidator },
      relatedRecords: { validator: listValidatorOptionalOrEmptyOk(relatedRecordValidator) },
      attachments: { validator: listOfChatAttachmentsValidator },
    }
  },
  meetings: {
    info: {},
    constraints: {
      unique: [], 
      relationship: [],
      access: [
        { type: 'filter', field: 'attendees.id' }, 
      ]
    },
    defaultActions: { 
      readMany: {
        ...DEFAULT_OPERATIONS['readMany'],
        adminOnly: true,
      }
    },
    enduserActions: { my_meetings: {}, join_meeting_for_event: {}, read: {} },
    customActions: {
      read: {
        op: "read", access: 'read', method: "get",
        description: "Get a meeting",
        parameters: { 
          id: { validator: mongoIdStringValidator },
        },
        returns: 'meeting' as any,
      },
      start_meeting: {
        op: "custom", access: 'create', method: "post",
        name: 'Start Meeting',
        path: '/start-meeting',
        description: "Generates an video meeting room",
        parameters: { 
          attendees: { validator: listOfUserIndentitiesValidator },
          publicRead: { validator: booleanValidator },
        },
        returns: { 
          id: { validator: mongoIdStringValidator, required: true },
          meeting: { validator: meetingInfoValidator, required: true },
          host: { validator: attendeeValidator, required: true },
        },
      },
      send_invite: { 
        op: "custom", access: 'update', method: "post",
        name: "Send Meeting Invite",
        path: '/send-meeting-invite',
        description: "Sends a meeting invite via email to the given enduser",
        parameters: { 
          meetingId: { validator: mongoIdStringValidator, required: true },
          enduserId: { validator: mongoIdStringValidator, required: true },
        },
        returns: { },
      },
      end_meeting: { 
        op: "custom", access: 'update', method: "post",
        name: "End Meeting",
        path: '/end-meeting',
        description: "Ends a video meeting",
        parameters: { id: { validator: mongoIdStringValidator, required: true } },
        returns: { },
      },
      add_attendees_to_meeting: { 
        op: "custom", access: 'update', method: "post",
        name: 'Add Attendees to Meeting',
        path: '/add-attendees-to-meeting',
        description: "Adds other attendees to a meeting",
        parameters: { 
          id: { validator: mongoIdStringValidator, required: true },
          attendees: { validator: listOfUserIndentitiesValidator, required: true },
        },
        returns: { },
      },
      attendee_info: {
        op: "custom", access: 'read', method: "get",
        name: 'Get attendee info for meeting',
        path: '/attendee-info',
        description: "Gets meeting info for the current user, and details about other attendees",
        parameters: { 
          id: { validator: mongoIdStringValidator, required: true },
        },
        returns: { 
          attendee: { validator: attendeeValidator, required: true },
          others: { validator: listOfUserIndentitiesValidator, required: true },
        },
      },
      my_meetings: {
        op: "custom", access: 'read', method: "get",
        name: 'Get list of meetings',
        path: '/my-meetings',
        description: "Gets meetings for the current user.",
        parameters: {},
        returns: { validator: meetingsListValidator, required: true },
      },
      start_meeting_for_event: {
        op: "custom", access: 'create', method: "post",
        name: 'Start Scheduled Meeting',
        path: '/start-meeting-for-event',
        description: "Generates an video meeting room",
        parameters: { 
          calendarEventId: { validator: mongoIdStringValidator, required: true },
        },
        returns: { 
          id: { validator: mongoIdStringValidator, required: true },
          meeting: { validator: meetingInfoValidator, required: true },
          host: { validator: attendeeValidator, required: true },
        },
      },
      join_meeting_for_event: {
        op: "custom", access: 'update', method: "post",
        name: 'Join Scheduled Meeting',
        path: '/join-meeting-for-event',
        description: "Generates an video meeting room",
        parameters: { 
          calendarEventId: { validator: mongoIdStringValidator, required: true },
        },
        returns: { 
          id: { validator: mongoIdStringValidator, required: true },
          meeting: { validator: meetingInfoValidator, required: true },
          attendee: { validator: attendeeValidator, required: true },
        },
      },
    },
    fields: {
      ...BuiltInFields, 
      // all fields are updatable by custom endpoints only
      status: {
        validator: meetingStatusValidator,
        readonly: true,
        initializer: () => 'scheduled' as MeetingStatus,
      },
      attendees: {
        validator: listOfAttendeesValidator,
        readonly: true,
      },
      meetingInfo: {
        validator: meetingInfoValidator,
        readonly: true
      },
      publicRead: { validator: booleanValidator }, 
      endedAt: { validator: dateValidator },
    }
  },
  notes: {
    info: {},
    constraints: {
      unique: [], 
      relationship: [],
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: {},
    fields: {
      ...BuiltInFields, 
      enduserId: {
        validator: mongoIdStringValidator,
        required: true,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['endusers'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      ticketId: {
        validator: mongoIdStringValidator,
      },
      text: {
        validator: stringValidator5000,
        examples: ["Text"],
      },
      title: {
        validator: stringValidator250,
        examples: ["Text"],
      },
      fields: {
        validator: fieldsValidator,
      },
      pinnedAt: { validator: dateOptionalOrEmptyStringValidator },
      tags: { validator: listOfStringsValidatorOptionalOrEmptyOk },
    }
  },
  forms: {
    info: {},
    constraints: {
      unique: [], 
      relationship: [],
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {
      get_form_statistics: {
        op: "custom", access: 'read', method: "get",
        name: 'Form Statistics',
        path: '/forms/statistics',
        description: "Gets response statistics for a given form",
        parameters: { 
          formId: { validator: mongoIdStringOptional, required: true },
          range: { validator: dateRangeOptionalValidator },
        },
        returns: { 
          // todo: document shape with validator
          statistics: { validator: objectAnyFieldsAnyValuesValidator as any } 
        },
      },
    },
    enduserActions: {},
    publicActions: {
      public_form_details: {
        op: "custom", access: 'read', method: "get",
        path: '/forms/public-details',
        name: 'Get details for public form',
        description: "Gets details for public form, e.g. whether to require date of birth",
        parameters: { 
          formId: { validator: mongoIdStringValidator, required: true },
        },
        returns: {
          form: { validator: 'form' as any, required: true },
        },
      },
    },
    fields: {
      ...BuiltInFields, 
      title: {
        validator: stringValidator250,
        required: true,
        examples: ["Text"],
      },
      numFields: { 
        validator: nonNegNumberValidator,
        initializer: () => 0,
        examples: [0],
      },
      displayTitle: { validator: stringValidator1000 },
      description: { validator: stringValidator5000EmptyOkay },
      customGreeting: { validator: stringValidator5000 },
      customSignature: { validator: stringValidator5000 },
      customSubject: { validator: stringValidator5000 },
      allowPublicURL: { validator: booleanValidator },
      intakePhone: { validator: intakePhoneValidator },
      intakeEmailRequired: { validator: booleanValidator },
      intakeEmailHidden: { validator: booleanValidator },
      intakeDateOfBirth: { validator: intakeDateOfBirthValidator },
      intakeState: { validator: intakeDateOfBirthValidator },
      thanksMessage: { validator: stringValidator5000EmptyOkay },
      htmlThanksMessage: { validator: stringValidator5000EmptyOkay },
      type: { validator: formTypeValidator },
      scoring: { validator: formScoringValidator },
      externalId: { validator: stringValidator100 },
      ga4measurementId: { validator: stringValidator100 },
      backgroundColor: { validator: stringValidator100 },
      productIds: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk },
      submitRedirectURL: { validator: stringValidator5000 },
      customization: { validator: formCustomizationValidator },
      publicFormIdRedirect: { validator: mongoIdStringOptional },
      disabled: { validator: booleanValidatorOptional },
      disableAutomaticIntegrationPush: { validator: booleanValidatorOptional },
    }
  },
  form_fields: {
    info: {
      sideEffects: {
        create: [sideEffects.incrementFieldCount],
        delete: [sideEffects.decrementFieldCount],
      }
    },
    constraints: {
      unique: [], 
      relationship: [],
      access: [{ type: 'dependency', foreignModel: 'forms', foreignField: '_id', accessField: 'formId' }]
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {
      load_choices_from_database: {
        op: "custom", access: 'read', method: "get",
        path: '/form-fields/load-choices-from-database',
        name: 'Load Choices From Database',
        description: "Loads choices for a Database Select field type in a form",
        parameters: { 
          fieldId: { validator: mongoIdStringValidator, required: true },
          limit: { validator: nonNegNumberValidator, required: false },
          lastId: { validator: mongoIdStringValidator, required: false },
        },
        returns: {
          choices: { validator: 'database_records' as any, required: true }
        },
      },
    },
    enduserActions: { read: {}, readMany: {}, load_choices_from_database: {} },
    fields: {
      ...BuiltInFields, 
      formId: {
        validator: mongoIdStringValidator,
        required: true,
        dependencies: [
          {
            dependsOn: ['forms'],
            dependencyField: '_id',
            relationship: 'foreignKey',
            onDependencyDelete: 'delete',
          },
        ],
        examples: [PLACEHOLDER_ID],
      }, 
      title: {
        validator: stringValidator250,
        required: true,
        examples: ["Text"],
      }, 
      headerText: { validator: stringValidator250 },
      type: {
        validator: formFieldTypeValidator,
        examples: ['number'],
      },
      previousFields: {  // can't be required - nextField may not exist yet on creation
        validator: previousFormFieldsValidator,
        examples: [[{ type: 'root', info: { } } as PreviousFormField]]
      },
      flowchartUI: { validator: flowchartUIValidator },
      options: { validator: formFieldOptionsValidator },
      description: { validator: stringValidator5000EmptyOkay }, 
      htmlDescription: { validator: stringValidator5000EmptyOkay }, 
      intakeField: { validator: stringValidator5000EmptyOkay }, // todo: ensure built-ins are ignored
      isOptional: { validator: booleanValidator },
      isInGroup: { validator: booleanValidator },
      externalId: { validator: stringValidator100 },
      sharedWithEnduser: { validator: booleanValidator },
      calloutConditions: { validator: formFieldCalloutConditionsValidator },
      prepopulateFromFields: { validator: booleanValidator },
      prepopulateFromDatabase: {
        validator: objectValidator<FormField['prepopulateFromDatabase']>({
          databaseId: mongoIdStringOptional, 
          field: stringValidatorOptionalEmptyOkay,
        }, { isOptional: true, emptyOk: true })
      },
    }
  },
  form_responses: {
    info: {},
    constraints: {
      unique: [], 
      relationship: [],
    },
    fields: {
      ...BuiltInFields, 
      formId: {
        validator: stringValidator100, // allow other external id types here too, not just mongoid
        required: true,
        dependencies: [
          {
            dependsOn: ['forms'],
            dependencyField: '_id',
            relationship: 'foreignKey',
            onDependencyDelete: 'setNull',
          },
        ],
        examples: [PLACEHOLDER_ID],
      }, 
      enduserId: {
        validator: mongoIdStringValidator,
        dependencies: [{
          dependsOn: ['endusers'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      submissionExpiresAt: { 
        validator: nonNegNumberValidator,
        updatesDisabled: true,
      },
      openedAt: {
        validator: dateValidator,
        readOnly: true,
      },
      publicSubmit: { validator: booleanValidator },
      submittedBy: { validator: stringValidator250 },
      accessCode: { validator: stringValidator250 },
      userEmail: { validator: emailValidator },
      submittedAt: { validator: dateValidator },
      formTitle: { validator: stringValidator250 },  
      responses: { validator: formResponsesValidator },
      draftSavedAt: { validator: dateValidator },
      hideFromEnduserPortal: { validator: booleanValidator },
      sharedVia: { validator: communicationsChannelValidator },
      isInternalNote: { validator: booleanValidator },
      pinnedAt: { validator: dateOptionalOrEmptyStringValidator },
      publicIdentifier: { validator: stringValidator250 },
      source: { validator: stringValidator250 },
      externalId: { validator: stringValidator250 },
      rootResponseId: { validator: mongoIdStringValidator },
      parentResponseId: { validator: mongoIdStringValidator },
      tags: { validator: listOfStringsValidatorOptionalOrEmptyOk },
    },
    defaultActions: DEFAULT_OPERATIONS,
    enduserActions: { 
      prepare_form_response: {}, info_for_access_code: {}, submit_form_response: {}, stripe_details: {},
      read: {}, readMany: {}, save_field_response: {},
      update: { } /* allows for hiding from client portal, storing partial responses while submitting form */ 
    },
    customActions: { 
      prepare_form_response: {
        op: "custom", access: 'create', method: "post",
        path: '/prepare-form-response',
        name: 'Prepare Form Response',
        description: "Generates an access code that allows an enduser to submit a form response.",
        parameters: { 
          formId: { validator: mongoIdStringValidator, required: true },
          enduserId: { validator: mongoIdStringValidator, required: true },
          automationStepId: { validator: mongoIdStringValidator },
          expireAt: { validator: dateValidator },
          sharedVia: { validator: communicationsChannelValidator },
          isInternalNote: { validator: booleanValidator },
          title: { validator: stringValidator },
          parentResponseId: { validator: mongoIdStringValidator },
          rootResponseId: { validator: mongoIdStringValidator },
        },
        returns: {
          accessCode: { validator: stringValidator250, required: true },
          url: { validator: stringValidator250, required: true },
          response: { validator: 'form_response' as any, required: true }
        },
      },
      generate_pdf: {
        op: "custom", access: 'read', method: "get",
        name: 'Generate PDF',
        path: '/form-responses/generate-pdf',
        description: "Get a PDF document generated for a given form response",
        parameters: { 
          id: { validator: mongoIdStringValidator, required: true },
        },
        returns: {},
      },
      push_to_EHR: {
        op: "custom", access: 'update', method: "post",
        name: 'Push to EHR',
        path: '/form-responses/push-to-ehr',
        description: "Pushes to an external EHR (e.g. Healthie)",
        parameters: { 
          id: { validator: mongoIdStringValidator, required: true },
        },
        returns: { },
      },
      save_field_response: {
        op: "custom", access: 'update', method: "patch",
        name: 'Save Field Response',
        path: '/save-field-response',
        description: "With an accessCode, includes the answer to an individual field in a partial form response.",
        parameters: { 
          accessCode: { validator: stringValidator250, required: true },
          response: { validator: formResponseValidator, required: true },
        },
        returns: {
          formResponse: 'form response' as any,
        },
      },
      submit_form_response: {
        op: "custom", access: 'update', method: "patch",
        name: 'Submit Form Response',
        path: '/submit-form-response',
        description: "With an accessCode, stores responses to a form.",
        parameters: { 
          accessCode: { validator: stringValidator250, required: true },
          responses: { validator: formResponsesValidator, required: true },
          automationStepId: { validator: mongoIdStringValidator },
          customerId: { validator: stringValidator },
          productIds: { validator: listOfStringsValidatorOptionalOrEmptyOk },
        },
        returns: {
          formResponse: 'form response' as any,
        },
      },
      info_for_access_code: {
        op: "custom", access: 'read', method: "get",
        name: 'Info for Access Code',
        path: '/form-info-for-access-code',
        description: "With an accessCode, retrieves the relevant info for submitting a form",
        parameters: { 
          accessCode: { validator: stringValidator250, required: true },
        },
        returns: {
          form: 'form' as any,
          fields: 'form fields' as any,
          response: 'form response' as any,
        },
      },
      stripe_details: {
        op: "custom", access: 'read', method: "get",
        name: 'Stripe details for form field',
        path: '/form-responses/stripe-details',
        description: "Gets the relevant information for a Stripe field",
        parameters: { 
          fieldId: { validator: mongoIdStringValidator, required: true },
        },
        returns: {
          clientSecret: { validator: stringValidator, required: true },
          customerId: { validator: stringValidator, required: true },
          publishableKey: { validator: stringValidator, required: true },
          stripeAccount: { validator: stringValidator, required: true },
          businessName: { validator: stringValidator, required: true },
        },
      },
      get_report: {
        op: "custom", access: 'read', method: "get",
        name: 'Report',
        path: '/form-responses/report',
        description: "Builds a report",
        parameters: {
          queries: { validator: formResponsesReportQueriesValidator, required: true },
          formIds: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk },
          submittedAtRange: { validator: dateRangeOptionalValidator },
          range: { validator: dateRangeOptionalValidator },
          enduserFilter: { validator: objectAnyFieldsAnyValuesValidator },
          submittedOnly: { validator: booleanValidatorOptional },
        },
        returns: {
          report: { validator: objectAnyFieldsAnyValuesValidator as any, required: true }
        },
      },
    },
    publicActions: {
      session_for_public_form: {
        op: "custom", access: 'create', method: "post",
        path: '/session-for-public-form',
        name: 'Generate Session for Public Form',
        description: "Generates a session for filling out a public form.",
        parameters: { 
          formId: { validator: mongoIdStringValidator, required: true },
          businessId: { validator: mongoIdStringValidator, required: true },
          email: { validator: emailValidator },
          dateOfBirth: { validator: stringValidator100 },
          phone: { validator: phoneValidator },
          fname: { validator: nameValidator },
          lname: { validator: nameValidator },
          publicIdentifier: { validator: stringValidator },
          state: { validator: stateValidator },
        },
        returns: {
          accessCode: { validator: stringValidator250, required: true },
          authToken: { validator: stringValidator250, required: true },
          url: { validator: stringValidator250, required: true },
          path: { validator: stringValidator250, required: true },
        },
      },
    },
  },
  webhooks: {
    info: {
      description: `Allows you to subscribe to Webhooks when models in Tellescope are created, updated, and deleted.
        Each webhook is a POST request to the given URL, of the form <pre>{ 
          model: string, 
          type: 'create' | 'update' | 'delete', 
          records: object[], 
          timestamp: string, 
          integrity: string, 
          relatedRecords: { [id: string]: object } 
}</pre>
        This includes the name of the model, the type of operation performed, and an array of the new, updated, or deleted model(s).

        The integrity field is a sha256 hash of (record ids concatenated from index 0 to the end, with the timestamp and then secret appended)
        For example hook: { records: [{ id: '1', ... }, { id: '4', ... }], timestamp: "1029358" } with secret set as "secret",
        integrity = sha256('141029358secret')
        Each time you handle a webhook, you should verify the integrity field is correct to ensure that the request is actually coming from Tellescope. 

        For performance, a relatedRecords object is provided as a cache. This object maps some ids referenced in the webhook records to the corresponding models in Tellescope. 
        For a given webhook, relatedRecords may be empty, or may not include all related ids. In such cases, you'll need to query against the Tellescope API for an up-to-date reference.

        Currently supported models for Webhooks: ${Object.keys(WEBHOOK_MODELS).join(', ')}

        You can handle webhooks from automations in Tellescope, which have a simpler format: <pre>{ 
        type: 'automation'
        message: string,
          timestamp: string, 
          integrity: string, 
}</pre>
        In this case, integrity is a simple sha256 hash of message + timestamp + secret

        You can also handle calendar event reminders as webhooks, which have the format: <pre>{ 
          type: 'calendar_event_reminder'
          event: CalendarEvent,
          timestamp: string, 
          integrity: string, 
}</pre>
        In this case, integrity is a simple sha256 hash of event.id + timestamp + secret
      `
    },
    constraints: {
      unique: [], 
      relationship: [],
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {
      configure: {
        op: "custom", access: 'create', method: "post",
        name: 'Configure Webhooks (Admin Only)',
        path: '/configure-webhooks',
        description: "DEPRECATED: Sets the URL, secret, and initial subscriptions for your organization. Your secret must exceed 15 characters and should be generated randomly.",
        parameters: { 
          url: { validator: urlValidator, required: true },
          secret: { validator: stringValidator5000, required: true },
          subscriptions: { validator: WebhookSubscriptionValidator },
        },
        returns: {},
      },
      get_configuration: {
        op: "custom", access: 'read', method: "get",
        name: 'Get current configuration info',
        path: '/webhook-configuration',
        description: "DEPRECATED: Returns current webhook configuration",
        parameters: { },
        returns: {
          subscriptions: { validator: WebhookSubscriptionValidator },
          url: { validator: stringValidator5000 },
        },
      },
      update: {
        op: "custom", access: 'update', method: "patch",
        name: 'Update Webhooks (Admin Only)',
        path: '/update-webhooks',
        description: "DEPRECATED: Modifies only subscriptions to models included in subscriptionUpdates. To remove subscriptions for a given model, set all values to false.",
        parameters: { 
          url: { validator: urlValidator },
          secret: { validator: stringValidator5000 },
          subscriptionUpdates: { validator: WebhookSubscriptionValidator },
        },
        returns: {},
      },
      send_automation_webhook: {
        op: "custom", access: 'create', method: "post",
        name: 'Send Automation Webhook',
        path: '/send-automation-webhook',
        description: "Sends a webhook with the automations format, useful for testing automation integrations",
        parameters: { 
          message: { validator: stringValidator5000, required: true },
        },
        returns: {},
      },
      send_calendar_event_reminder_webhook: {
        op: "custom", access: 'create', method: "post",
        name: 'Send Calendar Event Reminder Webhook',
        path: '/send-calendar-event-reminder-webhook',
        description: "Sends a webhook with the calendar reminder format, useful for testing integrations",
        parameters: { 
          id: { validator: mongoIdStringValidator, required: true },
        },
        returns: {},
      },
    },
    enduserActions: {},
    fields: {
      ...BuiltInFields, 
      secret: {
        validator: stringValidator250,
        examples: ["Text"],
      },
      url: {
        validator: urlValidator,
        examples: ["Text"],
      },
      subscriptions: {
        validator: WebhookSubscriptionValidator,
      },
    }
  },
  calendar_events: {
    info: {},
    constraints: {
      unique: [], 
      access: [
        { type: 'filter', field: 'attendees.id' }, 
      ],
      relationship: [{
        explanation: 'enduser cannot update public events',
        evaluate: (r, t, s) => {
          if (s.type === 'user') return
          if (r.publicRead) return "Enduser cannot create or update public events"
        }
      }] 
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {
      get_events_for_user: {
        op: "custom", access: 'read', method: "get",
        name: 'Get Events for User (Including Integrations)',
        path: '/events-for-user',
        description: "Combines internal and external events, formatted as a Tellescope events",
        parameters: { 
          userId: { validator: mongoIdStringValidator, required: true },
          from: { validator: dateValidator, required: true },
          to: { validator: dateValidator },
          limit: { validator: nonNegNumberValidator },
        },
        returns: { 
          events: { validator: 'calendar_events' as any, required: true }
        },
      },
      generate_meeting_link: {
        op: "custom", access: 'read', method: "post",
        name: 'Generate Meeting Link',
        path: '/generate-meeting-link',
        description: "Generates a link to join a scheduled meeting for an enduser",
        parameters: { 
          eventId: { validator: mongoIdStringValidator, required: true },
          enduserId:  { validator: mongoIdStringValidator, required: true },
        },
        returns: { 
          link: { validator: stringValidator1000, required: true }
        },
      }, 
      get_appointment_availability: {
        op: "custom", access: 'read', method: "get",
        name: 'Get Appointment Availability for a Calendar Event Type',
        path: '/calendar-availability',
        description: "Gets availability blocks for different users based on their internal and external calendars",
        warnings: [
          "The limit parameter indicates the number of future calendar event conflicts to look up when determining availability. This defaults to a high value (500) and should only be reduced with caution."
        ],
        parameters: {  
          calendarEventTemplateId: { validator: mongoIdStringValidator, required: true },
          from: { validator: dateValidator, required: true },
          locationId: { validator: mongoIdStringValidator },
          restrictedByState: { validator: booleanValidator },
          to: { validator: dateValidator },
          limit: { validator: nonNegNumberValidator },
          businessId: { validator: mongoIdStringValidator }, // required for unauthenticated access
          userId: { validator: mongoIdStringValidator }, // required for unauthenticated access
          userIds: { validator: listOfMongoIdStringValidatorEmptyOk }, // required for unauthenticated access
        },
        returns: { 
          availabilityBlocks: { validator: baseAvailabilityBlocksValidator, required: true }
        },
      },
      book_appointment: {
        op: "custom", access: 'create', method: "post",
        name: 'Book Appointment',
        path: '/book-appointment',
        description: "Books an appointment with a given user if available",
        parameters: {  
          calendarEventTemplateId: { validator: mongoIdStringValidator, required: true }, 
          userId: { validator: mongoIdStringValidator, required: true },
          startTime: { validator: dateValidator, required: true },
          locationId: { validator: mongoIdStringValidator },
          rescheduledCalendarEventId: { validator: mongoIdStringValidator },
          bookingPageId: { validator: mongoIdStringValidator },
          agreedToTerms: { validator: appointmentTermsValidator },
          timezone: { validator: timezoneValidator },
          fields: { validator: objectAnyFieldsAnyValuesValidator },
          token: { validator: stringValidator },
          customerId: { validator: stringValidator100 },
        },
        returns: { 
          createdEvent: { validator: 'calenar_event' as any },
        },
      },
      stripe_details: {
        op: "custom", access: 'read', method: "get",
        name: 'Get Stripe Details',
        path: '/scheduling/stripe-details',
        description: "Gets Stripe checkout details for an appointment booking flor",
        parameters: { },
        returns: { 
          stripe: { 
            validator: objectValidator<StripeCheckoutInfo>({
              customerId: stringValidator1000, 
              clientSecret: stringValidator1000, 
              publishableKey: stringValidator1000, 
              stripeAccount: stringValidator1000, 
              businessName: stringValidator1000,
            })
          }
        },
      },
      generate_zoom_meeting: {
        op: "custom", access: 'create', method: "post",
        name: 'Generate Zoom Meeting',
        path: '/generate-zoom-meeting',
        description: "Generates a Zoom meeting for including in a Calendar Event",
        parameters: { 
          calendarEventId: { validator: stringValidator, required: true },
          userId: { validator: stringValidator, required: true },
        },
        returns: { 
          updatedEvent: { validator: 'calendar_event' as any, required: true },
        },
      },
      change_zoom_host: {
        op: "custom", access: 'update', method: "post",
        name: 'Update Zoom Meeting Host',
        path: '/change-zoom-host',
        description: "Updates the host for an existing Zoom meeting",
        parameters: { 
          calendarEventId: { validator: stringValidator, required: true },
          userId: { validator: stringValidator, required: true },
        },
        returns: { 
          updatedEvent: { validator: 'calendar_event' as any, required: true },
        },
      },
      download_ics_file: {
        op: "custom", access: 'read', method: "get",
        name: 'Download ICS file',
        path: '/calendar-events/download-ics-file',
        description: "A URL which triggers the download of an ICS file for a given event",
        parameters: { 
          calendarEventId: { validator: mongoIdStringValidator, required: true },
          attendeeId: { validator: stringValidator },
          attendeeType: { validator: sessionTypeValidator },
        },
        returns: { },
      },
    },
    publicActions: {
      session_for_public_appointment_booking: {
        op: "custom", access: 'create', method: "post",
        path: '/session-for-public-appointment-booking',
        name: 'Generate Session for Public Appointment Booking',
        description: "Generates a session for booking an appointment",
        parameters: { 
          email: { validator: emailValidator, required: true },
          calendarEventTemplateId: { validator: mongoIdStringValidator, required: true },
          businessId: { validator: mongoIdStringValidator, required: true }, // organizationIds can be pulled from the corresponding appointment
          dateOfBirth: { validator: stringValidator },
          phone: { validator: phoneValidator },
          fname: { validator: nameValidator },
          lname: { validator: nameValidator },
          state: { validator: stateValidator },
          organizationIds: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk },
        },
        returns: {
          authToken: { validator: stringValidator250, required: true },
          stripe: { 
            validator: objectValidator<StripeCheckoutInfo>({
              customerId: stringValidator1000, 
              clientSecret: stringValidator1000, 
              publishableKey: stringValidator1000, 
              stripeAccount: stringValidator1000, 
              businessName: stringValidator1000,
            })
          }
        },
      },
      details_for_appointment_booking_page: {
        op: "custom", access: 'read', method: "get",
        path: '/details-for-appointment-booking-page',
        name: 'Gets Appointment Booking Details',
        description: "Gets details related to booking an appointment",
        parameters: { 
          appointmentBookingPageId: { validator: mongoIdStringValidator, required: true },
          businessId: { validator: mongoIdStringValidator, required: true }, // organizationIds can be pulled from the corresponding appointment
          userId: { validator: mongoIdStringValidator }, 
        },
        returns: {
          appointmentBookingPage: { validator: 'appointment_booking_page' as any, required: true },
          calendarEventTemplates: { validator: 'calendar_event_templates' as any, required: true },
          locations: { validator: 'appointment_locations' as any, required: true },
          products: { validator: 'products' as any, required: true },
          userDisplayName: { validator: stringValidator },
          userAvatar: { validator: stringValidator }
        },
      }
    },
    enduserActions: { 
      read: {}, readMany: {}, update: {}, // for cancelling
      get_appointment_availability: {}, book_appointment: {}, stripe_details: {},
      session_for_public_appointment_booking: {}, download_ics_file: {},
    },
    fields: {
      ...BuiltInFields, 
      title: {
        validator: stringValidator250,
        required: true,
        examples: ["Text"],
      }, 
      startTimeInMS: { 
        validator: nonNegNumberValidator,
        examples: [100],
        required: true,
      }, 
      durationInMinutes: { 
        validator: nonNegNumberValidator,
        examples: [100],
        required: true,
      },
      locationId: { validator: mongoIdStringValidator },
      type: { validator: stringValidator100 },
      description: { validator: stringValidator5000 },
      agreedToTerms: { validator: appointmentTermsValidator },
      meetingId: { validator: mongoIdStringValidator, readonly: true },
      bookingPageId: { validator: mongoIdStringValidator }, // allows rescheduling via booking page
      meetingStatus: { validator: meetingStatusValidator },
      attachments: { validator: listOfGenericAttachmentsValidator },
      cancelledAt: { validator: dateOptionalOrEmptyStringValidator },
      rescheduledAt: { validator: dateOptionalOrEmptyStringValidator },
      noShowedAt: { validator: dateOptionalOrEmptyStringValidator },
      rescheduledTo: { validator: mongoIdStringValidator },
      chatRoomId: { 
        validator: mongoIdStringValidator,
        dependencies: [{
          dependsOn: ['chat_rooms'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'setNull',
        }]
      },
      carePlanId: { 
        validator: mongoIdStringValidator,
        dependencies: [{
          dependsOn: ['care_plans'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'setNull',
        }]
      },
      attendees: { 
        validator: listOfUserIndentitiesValidator,
        initializer: () => [],
      }, 
      reminders: {
        validator: listOfCalendarEventRemindersValidator,
        initializer: () => [],
      },
      templateId: { 
        validator: mongoIdStringValidator,
        dependencies: [{
          dependsOn: ['calendar_event_templates'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'nop',
        }]
      }, 
      publicRead: { validator: booleanValidator }, 
      wasSelfScheduled: { validator: booleanValidator }, 
      enableVideoCall: { validator: booleanValidator }, 
      fields: { validator: fieldsValidator }, 
      numRSVPs: { validator: nonNegNumberValidator },
      image: { validator: stringValidator5000 },
      sharedContentIds: { validator: listOfMongoIdStringValidatorEmptyOk },
      enduserFormResponses: { validator: enduserFormResponsesForEventValidator },
      enduserTasks: { validator: enduserTasksForEventValidator },
      color: { validator: stringValidator1000 },
      location: { validator: stringValidator1000 },
      locationURL: { validator: stringValidator1000 },
      locationNotes: { validator: stringValidator5000 },
      phone: { validator: stringValidator100 }, // leave more generous than phone validator in favor of lower friction
      portalSettings: { validator: calendarEventPortalSettingsValidator },
      externalId: { validator: stringValidator },
      source: { validator: stringValidator },
      videoIntegration: { validator: videoIntegrationTypesValidator },
      videoURL: { validator: stringValidator },
      timezone: { validator: timezoneValidator},
      copiedFrom: { validator: mongoIdStringValidator },
      internalNotes: { validator: stringValidator5000EmptyOkay },
      hiddenFromPortal: { validator: booleanValidatorOptional },
      // isAllDay: { validator: booleanValidator },
    }
  },
  calendar_event_templates: {
    info: {},
    constraints: {
      unique: ['title'], 
      relationship: [],
      access: []
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: { read: {}, readMany: {} },
    fields: {
      ...BuiltInFields, 
      title: {
        validator: stringValidator250,
        required: true,
        examples: ["Text"],
      }, 
      durationInMinutes: { 
        validator: nonNegNumberValidator,
        examples: [100],
        required: true,
      },
      portalSettings: { validator: calendarEventPortalSettingsValidator },
      productIds: { validator: listOfMongoIdStringValidatorEmptyOk },
      type: { validator: stringValidator100 },
      description: { validator: stringValidator5000 },
      reminders: {
        validator: listOfCalendarEventRemindersValidator,
        initializer: () => [],
      },
      publicRead: { validator: booleanValidator }, 
      enableVideoCall: { validator: booleanValidator }, 
      enableSelfScheduling: { validator: booleanValidator }, 
      restrictedByState: { validator: booleanValidator }, 
      image: { validator: stringValidator5000 },
      confirmationEmailDisabled: { validator: booleanValidatorOptional },
      confirmationSMSDisabled: { validator: booleanValidatorOptional },
      // confirmationSenderId: { validator: mongoIdStringValidator },
      carePlanForms: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk },
      carePlanContent: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk },
      carePlanFiles: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk },
      carePlanTasks: { validator: listOfStringsValidatorOptionalOrEmptyOk },
      videoIntegration: { validator: videoIntegrationTypesValidator },
      color: { validator: stringValidator1000 },
    }
  },
  calendar_event_RSVPs: {
    info: {},
    constraints: {
      unique: [
        ['eventId', 'creator'], // one per eventId-creator combo
      ], 
      relationship: [],
    },
    customActions: {},
    defaultActions: { ...DEFAULT_OPERATIONS, update: { creatorOnly: true }, delete: { creatorOnly: true } },
    enduserActions: { create: {}, read: {}, readMany: {}, update: { }, delete: { } },
    fields: {
      ...BuiltInFields, 
      eventId: { 
        validator: mongoIdStringValidator,
        required: true,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['calendar_events'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      displayName: { 
        validator: stringValidator,
        initializer: (_, s) => s.fname ?? '',
      },
      avatar: { 
        validator: stringValidator1000,
        initializer: (_, s) => s.avatar ?? '',
      },
      status: { validator: stringValidator },
      creatorType: { 
        readonly: true,
        validator: sessionTypeValidator, 
        initializer: (_, s) => s.type,
      }
    }
  },
  automation_steps: {
    info: {},
    constraints: {
      unique: [], 
      relationship: [
        {
          explanation: 'Event, action, and conditions cannot all be shared by an existing event automation (no duplicates)',
          evaluate: () => {} // implemented in routing.ts
        },
      ],
      access: []
    },
    defaultActions: {
      ...DEFAULT_OPERATIONS,
      // this is not validated, but this is too useful for copying journey to disable
      // createMany: undefined, // need to validate parent node is same journey before enabling
    },
    customActions: { },
    enduserActions: { },
    fields: {
      ...BuiltInFields, 
      journeyId: { 
        validator: mongoIdStringValidator,
        examples: [PLACEHOLDER_ID],
        required: true,
        dependencies: [{
          dependsOn: ['journeys'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      events: { 
        validator: automationEventsValidator,
        examples: [
          // [],
          [
            {
              type: "onJourneyStart",
              info: {}, 
            }
          ], 
        ],
        required: true,
      },
      action: { 
        validator: automationActionValidator,
        required: true,
        examples: [{
          type: "sendEmail",
          info: { 
            senderId: PLACEHOLDER_ID,
            templateId: PLACEHOLDER_ID,
          }, 
        }]
      },
      conditions: { validator: listOfAutomationConditionsValidator },
      flowchartUI: { validator: flowchartUIValidator },
      continueOnError: { validator: booleanValidator },
      enduserConditions: { validator: optionalAnyObjectValidator },
    }
  },
  automated_actions: {
    info: {},
    constraints: {
      unique: [], 
      relationship: [],
      access: []
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: { },
    enduserActions: { },
    fields: {
      ...BuiltInFields, 
      cancelConditions: {
        validator: cancelConditionsValidator,
      },
      automationStepId: { 
        validator: mongoIdStringValidator,
        required: true,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['automation_steps'], 
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'nop', // worth keeping as a log of some automated action, even if the automation itself is no longer active
        }]
      },
      enduserId: { 
        validator: mongoIdStringValidator,
        required: true,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['endusers'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      journeyId: { 
        validator: mongoIdStringValidator,
        required: true,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['journeys'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'nop', // worth keeping as a log of some automated action, even if the automation itself is no longer active
        }]
      },
      event: { 
        validator: automationEventValidator,
        examples: [{
          type: "onJourneyStart",
          info: {}, 
        }],
        required: true,
      },
      action: { 
        validator: automationActionValidator,
        required: true,
        examples: [{
          type: "sendEmail",
          info: { 
            senderId: PLACEHOLDER_ID,
            templateId: PLACEHOLDER_ID,
          }, 
        }]
      },
      status: { 
        validator: automatedActionStatusValidator, 
        required: true,  
        examples: ['active']
      },
      processAfter: {
        validator: nonNegNumberValidator,
        required: true,
        examples: [Date.now()],
      }
    }
  },
  user_logs: {
    info: {},
    constraints: {
      unique: [], 
      relationship: [],
      access: []
    },
    defaultActions: { read: {}, readMany: {} },
    customActions: { },
    enduserActions: { },
    fields: {
      ...BuiltInFields, 
      userId: { 
        validator: mongoIdStringValidator,
        required: true,
        examples: [PLACEHOLDER_ID],
        // dependencies: [{
        //   dependsOn: ['users'], 
        //   dependencyField: '_id',
        //   relationship: 'foreignKey',
        //   onDependencyDelete: 'delete',
        // }]
      },
      resource: { 
        validator: stringValidator100,
        required: true,
        examples: [PLACEHOLDER_ID],
      },
      resourceId: { 
        validator: mongoIdStringValidator,
        required: true,
        examples: [PLACEHOLDER_ID],
      },
      action: { 
        validator: CUDStringValidator,
        required: true,
        examples: [PLACEHOLDER_ID],
      },
    }
  },
  user_notifications: {
    info: {},
    constraints: {
      unique: [], 
      relationship: [],
      access: [
        { type: 'filter', field: 'userId' }, 
      ]
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: { 
      send_user_email_notification: {
        op: "custom", access: 'create', method: "post",
        name: 'Send Team Email Notification',
        path: '/send-user-email-notification',
        description: "Sends an email notification to a team member (user)",
        parameters: { 
          userId: { validator: mongoIdStringValidator, required: true },
          message: { validator: stringValidator5000, required: true },
          subject: { validator: stringValidator250 },
        },
        returns: {},
      },
      bulk_update: {
        op: "custom", access: 'create', method: "post",
        name: 'Bulk update (read or delete)',
        path: '/notifications/bulk-update',
        description: "Marks all as read, or deletes all notifications",
        parameters: { 
          action: { validator: stringValidator250 },
        },
        returns: {},
      },
    },
    enduserActions: { },
    fields: {
      ...BuiltInFields, 
      userId: { 
        validator: mongoIdStringValidator,
        required: true,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['users'], 
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      type: { validator: stringValidator100, required: true, examples: ['type'] },
      message: { validator: stringValidator5000, required: true, examples: ['message'] },
      read: { validator: booleanValidator },
      relatedRecords: { validator: listOfRelatedRecordsValidator },
    }
  },
  enduser_observations: {
    info: {},
    constraints: {
      unique: [], 
      relationship: [],
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: { },
    enduserActions: { create: {}, createMany: {}, read: {}, readMany: {} },
    fields: {
      ...BuiltInFields, 
      category: {
        required: true,
        validator: FHIRObservationCategoryValidator,
        examples: ['vital-signs'],
      },
      status: {
        required: true,
        validator: FHIRObservationStatusCodeValidator,
        examples: ['final'],
      },
      measurement: {
        required: true,
        validator: FHIRObservationValueValidator,
        examples: [{
          unit: 'mmol',
          value: 8,
        }],
      },
      enduserId: {
        required: true,
        validator: mongoIdStringValidator,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['endusers'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      code: { validator: stringValidator },
      source: { validator: stringValidator },
      type: { validator: stringValidator },
      notes: { validator: stringValidator },
      recordedAt: { validator: dateValidator },
    }
  },
  managed_content_records: {
    info: {},
    constraints: {
      unique: [], 
      relationship: [],
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: { 
      update_indexes: {
        op: "custom", access: 'update', method: "patch",
        name: 'Update Indexes',
        path: '/managed-content-records/update-indexes',
        description: "Updates indexes for a number of managed content records to adjust the default sorting",
        parameters: { 
          updates: { validator: indexUpdatesValidator, required: true },
        },
        returns: {},
      },
      generate_embedding: {
        op: 'custom', access: 'delete', method: 'post',
        path: '/managed-content-records/generate-embedding',
        description: "", 
        parameters: { id: { validator: mongoIdStringValidator, required: true } },
        returns: { 
          updated: { validator: 'managed_content_record' as any },
        }
      },
      search: {
        op: 'custom', access: 'read', method: 'post',
        path: '/managed-content-records/search',
        name: "Search content using AI integration",
        description: "", 
        parameters: { 
          query: { validator: stringValidator, required: true },
          type: { validator: exactMatchValidator<"enduser" | "internal">(['enduser', 'internal']) },
        },
        returns: { 
          record: { validator: 'managed_content_record' as any, required: true },
          matches: { validator: 'managed_content_records' as any, required: true },
          response: { validator: stringValidator, required: true, }
        }
      },
    },
    enduserActions: { 
      create: {}, createMany: {}, read: {}, readMany: {},
      search: {},
    },
    fields: {
      ...BuiltInFields, 
      slug: { validator: stringValidator250 },
      title: {
        validator: stringValidator100,
        required: true,
        examples: ["Template Name"],
      },
      category: {
        validator: stringValidator100,
      },
      description: {
        validator: stringValidator5000,
        examples: ["Template Subject"],
      },
      textContent: {
        validator: stringValidator25000,
        required: true,
        examples: ["This is the template message......"],
      },
      htmlContent: {
        validator: stringValidator25000,
        examples: ["This is the template message......"],
      },
      editorState: {
        validator: stringValidator25000,
        examples: ["This is the template message......"],
      },
      type: {
        validator: managedContentRecordTypeValidator,
        updatesDisabled: true,
      },
      enduserId: { 
        validator: mongoIdStringValidator,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['endusers'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete', // if enduserId exist (should only be for Individual), clean up as dependency of enduser
        }]
      },
      assignmentType: { validator: managedContentRecordAssignmentTypeValidator },
      attachments: {
        validator: listOfChatAttachmentsValidator,
      },
      blocks: { validator: blocksValidator },
      headerPhoto: { validator: stringValidator250 },
      publicRead: { validator: booleanValidator },
      mode: { validator: messageTemplateModeValidator, },
      files: { validator: listOfStringsValidatorEmptyOk },
      tags: { validator: listOfStringsValidatorEmptyOk },
      embeddingType: { validator: embeddingTypeValidator },
      embedding: { validator: listValidator(numberValidator) },
      forInternalUse: { validator: booleanValidator },
    }
  },
  managed_content_record_assignments: {
    info: {},
    constraints: {
      unique: [
        ['contentId', 'enduserId'], 
      ], 
      relationship: [],
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: { },
    enduserActions: { read: {}, readMany: {} },
    fields: {
      ...BuiltInFields, 
      contentId: {
        validator: mongoIdStringValidator,
        required: true,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['managed_content_records'], 
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      enduserId: {
        validator: mongoIdStringValidator,
        required: true,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['endusers'], 
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
    }
  },
  forums: {
    info: {},
    constraints: {
      unique: ['title'], 
      relationship: [],
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: { },
    enduserActions: { read: {}, readMany: {} },
    fields: {
      ...BuiltInFields, 
      title: {
        validator: stringValidator100,
        required: true,
        examples: ["Template Name"],
      },
      description: {
        validator: stringValidator5000,
        examples: ["Template Subject"],
      },
      publicRead: { validator: booleanValidator },
      slug: { validator: stringValidator250 },
    },
  },
  forum_posts: {
    info: {},
    constraints: {
      unique: [], 
      relationship: [],
      access: [{ type: 'dependency', foreignModel: 'forums', foreignField: '_id', accessField: 'forumId' }]
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: { },
    enduserActions: { create: {}, read: {}, readMany: {}, update: { creatorOnly: true }, delete: { creatorOnly: true } },
    fields: {
      ...BuiltInFields, 
      forumId: {
        validator: mongoIdStringValidator,
        required: true,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['forums'], 
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      postedBy: {
        validator: userIdentityValidator,
        initializer: (_, s) => ({ type: s.type, id: s.id })
      },
      numComments: { 
        validator: nonNegNumberValidator,
        initializer: () => 0,
        updatesDisabled: true,
      },
      numLikes: { 
        validator: nonNegNumberValidator,
        updatesDisabled: true,
        initializer: () => 0,
      },
      title: {
        validator: stringValidator5000,
        required: true,
        examples: ["This is the template message......"],
      },
      textContent: {
        validator: stringValidator25000,
        required: true,
        examples: ["This is the template message......"],
      },
      htmlContent: {
        validator: stringValidator25000,
        examples: ["This is the template message......"],
      },
      editorState: {
        validator: stringValidator25000,
        examples: ["This is the template message......"],
      },
      slug: { validator: stringValidator250 },
      attachments: {
        validator: listOfChatAttachmentsValidator,
      },
    },
  },
  post_comments: {
    info: {
      sideEffects: {
        create: [sideEffects.updatePostCommentCount],
        update: [sideEffects.updatePostCommentCount],
      }
    },
    constraints: {
      unique: [], 
      relationship: [],
      access: [{ type: 'dependency', foreignModel: 'forums', foreignField: '_id', accessField: 'forumId' }]
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: { },
    enduserActions: { create: {}, read: {}, readMany: {}, delete: { creatorOnly: true } },
    fields: {
      ...BuiltInFields, 
      forumId: {
        validator: mongoIdStringValidator,
        required: true,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['forums'], 
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      postId: {
        validator: mongoIdStringValidator,
        required: true,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['forum_posts'], 
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      threadId: {
        validator: mongoIdStringValidator,
        examples: [PLACEHOLDER_ID],
        initializer: s => s.replyTo ?? '',
        dependencies: [{
          dependsOn: ['post_comments'], 
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'nop',
        }]
      },
      replyTo: {
        validator: mongoIdStringValidator,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['post_comments'], 
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'nop',
        }]
      },
      postedBy: {
        validator: userIdentityValidator,
        initializer: (_, s) => ({ type: s.type, id: s.id }),
      },
      attachments: { validator: listOfStringsValidator },
      textContent: {
        validator: stringValidator25000,
        required: true,
        examples: ["This is the template message......"],
      },
      htmlContent: {
        validator: stringValidator25000,
        examples: ["This is the template message......"],
      },
      editorState: {
        validator: stringValidator25000,
        examples: ["This is the template message......"],
      },
      numLikes: { validator: nonNegNumberValidator, updatesDisabled: true },
      numReplies: { validator: nonNegNumberValidator, updatesDisabled: true },
    },
  },
  post_likes: {
    info: {},
    constraints: {
      unique: [], 
      relationship: [],
      access: [{ type: 'dependency', foreignModel: 'forums', foreignField: '_id', accessField: 'forumId' }]
    },
    defaultActions: { read: {}, readMany: {}, delete: {} }, // create is custom
    enduserActions: { create: {}, unlike_post: {}, readMany: {} },
    customActions: { 
      create: {
        op: "custom", access: 'create', method: "post",
        name: 'Like Forum Post',
        path: '/post-like', // follows default format
        description: "Likes a post",
        parameters: { 
          postId: { validator: mongoIdStringValidator, required: true },
          forumId: { validator: mongoIdStringValidator, required: true },
        },
        returns: { } //authToken: { validator: stringValidator5000 } },
      },
      unlike_post: {
        op: "custom", access: 'update', method: "post",
        name: 'Unlike Forum Post',
        path: '/unlike-forum-post',
        description: "Removes a like for a given forum post",
        parameters: { 
          postId: { validator: mongoIdStringValidator, required: true },
          forumId: { validator: mongoIdStringValidator, required: true },
        },
        returns: { } //authToken: { validator: stringValidator5000 } },
      },
    },
    fields: {
      ...BuiltInFields, 
      // creator: {
      //   ...BuiltInFields.creator,
      //   dependencies: [{
      //       dependsOn: ['endusers'], 
      //       dependencyField: '_id',
      //       relationship: 'foreignKey',
      //       onDependencyDelete: 'delete',
      //     },
      //     {
      //       dependsOn: ['users'], 
      //       dependencyField: '_id',
      //       relationship: 'foreignKey',
      //       onDependencyDelete: 'delete',
      //     }
      //   ],
      // },
      forumId: {
        validator: mongoIdStringValidator,
        required: true,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['forums'], 
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      postId: {
        validator: mongoIdStringValidator,
        required: true,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['forum_posts'], 
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
    },
  },
  comment_likes: {
    info: {},
    constraints: {
      unique: [
        ['commentId', 'creator'], // one per eventId-creator combo
      ], 
      relationship: [],
      access: [{ type: 'dependency', foreignModel: 'forums', foreignField: '_id', accessField: 'forumId' }]
    },
    customActions: {},
    defaultActions: { create: {}, read: {}, readMany: {}, delete: { creatorOnly: true } },
    enduserActions: { create: {}, read: {}, readMany: {}, delete: { } },
    fields: {
      ...BuiltInFields, 
      forumId: {
        validator: mongoIdStringValidator,
        required: true,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['forums'], 
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      postId: {
        validator: mongoIdStringValidator,
        required: true,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['forum_posts'], 
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      commentId: {
        validator: mongoIdStringValidator,
        required: true,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['post_comments'], 
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
    }
  },
  organizations: {
    info: {},
    constraints: {
      unique: [], 
      globalUnique: ['subdomain'], // must be unique across all organizations in tellescope
      relationship: [
        {
          explanation: 'Only organization owner can update owner',
          evaluate: (updated, lookup, session, type, options) => {
            if (type !== 'update') return // not updating
            if (!options.updates?.owner) return // not changing owner
            if (!options.original) return // original not provided to check previous owner (bug)

            const original = options.original

            if (original.owner) {
              if (original.owner !== session.id) {
                return "Only owner can change ownership"
              }
            } else if (original.creator !== session.id) {
              return "Only creator can set initial owner"
            }
          }
        },
      ],
    },
    defaultActions: { read: { }, readMany: { }, update: { }, 
    /* in API, deleting root organization is explicitly blocked, but this allows for deleting sub organizations */
      delete: {}  
    },
    customActions: { 
      create_suborganization: {
        op: "custom", access: 'create', method: "post", 
        adminOnly: true,
        name: 'Create Sub Organization',
        path: '/sub-organization', 
        description: "Creates a sub organization",
        parameters: { 
          name: { validator: stringValidator250, required: true },
          subdomain: { validator: slugValidator, required: true },
        },
        returns: { 
          created: { validator: 'organization' as any, required: true },
        } 
      },
      create_and_join: {
        op: "custom", access: 'create', method: "post", 
        adminOnly: true,
        name: 'Create and Join Organization',
        path: '/organizations/create-and-join', 
        description: "Creates and joins a new organization",
        parameters: { 
          name: { validator: stringValidator250, required: true },
          subdomain: { validator: slugValidator, required: true },
        },
        returns: { 
          authToken: { validator: stringValidator, required: true },
          organization: { validator: 'organization' as any, required: true },
          user: { validator: 'user' as any, required: true },
        } 
      },
    },
    enduserActions: { },
    publicActions: {
      get_theme: {
        op: "custom", access: 'read', method: "get",
        name: 'Get Organization Theme',
        path: '/organization-theme', // follows default format
        description: "Gets theme information for an organization",
        parameters: { 
          businessId: { validator: mongoIdStringValidator },
          organizationIds: { validator: listOfMongoIdStringValidatorEmptyOk },
        },
        returns: { 
          theme: { validator: organizationThemeValidator, required: true },
        } 
      },
    },
    fields: {
      ...BuiltInFields, 
      name: {
        validator: stringValidator100,
        required: true,
        examples: ["Template Name"],
      },
      subdomain: {
        validator: slugValidator,
        required: true,
        examples: ["subdomain"],
      },
      limits: { 
        validator: organizationLimitsValidator,
        readonly: true, // to be set by Tellescope super admin only
      },
      owner: { validator: mongoIdStringValidator },
      parentOrganizationId: { validator: mongoIdStringValidator },
      subscriptionExpiresAt: { validator: dateValidator },
      subscriptionPeriod: { validator: numberValidator },
      logoVersion: { validator: numberValidator },
      faviconVersion: { validator: numberValidator },
      roles: { validator: listOfStringsValidatorEmptyOk },
      skills: { validator: listOfStringsValidator },
      themeColor: { validator: stringValidator100 },
      themeColorSecondary: { validator: stringValidator100 },
      enduserDisplayName: { validator: stringValidator100 },
      customPortalURL: { validator: stringValidator250 },
      portalSettings: { validator: portalSettingsValidator },
      settings: { validator: organizationSettingsValidator },
      timezone: { validator: timezoneValidator },
      forwardAllIncomingEmailsTo: { validator: emailValidator },
    },
  },
  databases: {
    info: {},
    constraints: {
      unique: ['title'], 
      relationship: [],
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: { },
    enduserActions: { },
    fields: {
      ...BuiltInFields, 
      title: {
        validator: stringValidator100,
        required: true,
        examples: ["Template Name"],
      },
      fields: {
        required: true,
        validator: databaseFieldsValidator,
      },
      numRecords: {
        readonly: true,
        validator: nonNegNumberValidator,
        initializer: () => 0,
      },
      // organizationRead: { validator: booleanValidator },
    },
  },
  database_records: {
    info: {},
    constraints: {
      unique: [], 
      relationship: [],
      access: [{ type: 'dependency', foreignModel: 'databases', foreignField: '_id', accessField: 'databaseId' }]
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: { },
    enduserActions: { },
    fields: {
      ...BuiltInFields, 
      databaseId: {
        validator: mongoIdStringValidator,
        required: true,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['databases'], 
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      }, 
      values: {
        required: true,
        validator: databaseRecordValuesValidator,
      },
    },
  }, 
  portal_customizations: {
    info: {},
    constraints: {
      unique: [
        'page' // prevents duplicate customizations for the same page (may need to combine with a version number / draft status later to allow drafting)
      ], 
      relationship: [
        {
          explanation: 'Home page cannot be disabled',
          evaluate: ({ page, disabled  }) => {
            if (page === 'Home' && disabled)
              return 'Home page cannot be disabled'
            } 
        },
      ],
      access: []
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: { },
    enduserActions: { readMany: {} },
    fields: {
      ...BuiltInFields, 
      title: {
        validator: stringValidator1000,
        examples: ['Example Title']
      },
      page: {
        validator: portalPageValidator,
        required: true,
        examples: ['Home']
      },
      blocks: {
        required: true,
        examples: [[]],
        validator: portalBlocksValidator,
      },
      disabled: { validator: booleanValidator },
      mobileBottomNavigationPosition: { validator: nonNegNumberValidator },
      headerImageURL: { validator: stringValidator1000 },
    },
  }, 
  enduser_tasks: {
    info: {},
    constraints: {
      unique: [], 
      relationship: [],
      access: []
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: { },
    enduserActions: { update: {}, read: {}, readMany: {} },
    fields: {
      ...BuiltInFields, 
      title: {
        validator: stringValidator1000,
        required: true,
        examples: ['Example Title']
      },
      enduserId: { 
        validator: mongoIdStringValidator,
        examples: [PLACEHOLDER_ID],
        required: true,
        dependencies: [{
          dependsOn: ['endusers'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      completedAt: { validator: dateValidator },
      description: { validator: stringValidator1000 },
    },
  },
  care_plans: {
    info: {},
    constraints: {
      unique: [
        ['enduserId', 'title']
      ], 
      relationship: [],
      access: []
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: { },
    enduserActions: { read: {}, readMany: {} },
    fields: {
      ...BuiltInFields, 
      title: {
        validator: stringValidator1000,
        required: true,
        examples: ['Example Title']
      },
      enduserId: { 
        validator: mongoIdStringValidator,
        examples: [PLACEHOLDER_ID],
        required: true,
        dependencies: [{
          dependsOn: ['endusers'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      description: {
        validator: stringValidator1000,
      },
      eventIds: {
        validator: listOfMongoIdStringValidatorEmptyOk,
      }
    },
  }, 
  role_based_access_permissions: {
    info: {},
    constraints: {
      unique: ['role'], 
      relationship: [
        {
          explanation: "role can't be 'Admin'",
          evaluate: ({ role }, deps, _) => {
            if (role === 'Admin') return "role must not be 'Admin'"
          }
        },
      ],
    },
    defaultActions: { 
      read: {}, readMany: {},
      create: { rootAdminOnly: true }, createMany: { rootAdminOnly: true }, update: { rootAdminOnly: true }, delete: { rootAdminOnly: true },
    },
    customActions: {},
    enduserActions: {},
    fields: {
      ...BuiltInFields, 
      role: {
        validator: stringValidator250,
        required: true,
        examples: ["Role"],
      },
      permissions: {
        validator: accessPermissionsValidator,
        required: true,
        examples: [
          { 
            endusers: {
              create: null,
              read: null,
              delete: null,
              update: null,
            }
          },
        ]
      },
      uiRestrictions: { validator: userUIRestrictionsValidator },
    }
  },
  appointment_booking_pages: {
    info: {},
    constraints: {
      unique: ['title'], 
      relationship: [],
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {
      generate_access_token: {
        op: "custom", access: 'create', method: "post", 
        name: 'Generate Access Token',
        path: '/appointment-booking-pages/generate-access-token', 
        description: "Generates a 1-time access token for booking an appointment",
        parameters: { 
          expiresAt: { validator: dateValidator, required: true },
          bookingPageId: { validator: mongoIdStringValidator },
        },
        returns: { 
          token: { validator: stringValidator, required: true },
        } 
      },
    },
    publicActions: {
      validate_access_token: {
        op: "custom", access: 'read', method: "get", 
        name: 'Validate Access Token',
        path: '/appointment-booking-pages/validate-access-token',
        description: "Validates an appointment booking token",
        parameters: { 
          token: { validator: stringValidator, required: true },
          bookingPageId: { validator: mongoIdStringValidator },
        },
        returns: { 
          isValid: { validator: booleanValidator, required: true }, 
        } 
      },
    },
    enduserActions: {
      read: {}, readMany: {}, validate_access_token: {},
    },
    fields: {
      ...BuiltInFields, 
      title: {
        validator: stringValidator100,
        required: true,
        examples: ["Appointment Booking Title"]
      },
      calendarEventTemplateIds: {
        validator: listOfMongoIdStringValidator,
        required: true,
        examples: [[PLACEHOLDER_ID]]
      },
      locationIds: {
        validator: listOfMongoIdStringValidatorEmptyOk,
        required: true,
        examples: [[PLACEHOLDER_ID]]
      },
      terms: { validator: appointmentTermsValidator },
      endDate: { validator: dateValidator },
      startDate: { validator: dateValidator },
      backgroundColor: { validator: stringValidator100 },
      primaryColor: { validator: stringValidator100 },
      secondaryColor: { validator: stringValidator100 },
      intakeTitle: { validator: stringValidator1000 }, 
      intakeDescription: { validator: stringValidator1000 }, 
      thankYouRedirectURL: { validator: stringValidator1000 },
      thankYouTitle: { validator: stringValidator1000 },
      thankYouDescription: { validator: stringValidator1000 }, 
      thankYouHeaderImageURL: { validator: stringValidator1000 },
      thankYouMainImageURL: { validator: stringValidator1000 },
      ga4measurementId: { validator: stringValidator100 },
      hiddenFromPortal: { validator: booleanValidator },
      hoursBeforeBookingAllowed: { validator: numberValidatorOptional },
      limitedToCareTeam: { validator: booleanValidator },
      limitedByState: { validator: booleanValidator },

      // defer to template
      // productIds: { validator: listOfStringsValidator },
    }
  },
  appointment_locations: {
    info: {},
    constraints: {
      unique: ['title'], 
      relationship: [],
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: { read: {}, readMany: {} },
    fields: {
      ...BuiltInFields, 
      title: {
        validator: stringValidator100,
        required: true,
        examples: ["Appointment Booking Title"]
      },
      address: { validator: stringValidator1000 },
      zipCode: { validator: stringValidator1000 },
      phone: { validator: stringValidator }, // phoneValidator assumes cell phone and strips formatting, this should not
      state: { validator: stateValidator },
      timezone: { validator: timezoneValidator },
    }
  },
  products: {
    info: {},
    constraints: {
      unique: ['title'], 
      relationship: [],
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {
      prepare_stripe_checkout: {
        op: "custom", access: 'create', method: "post", 
        name: 'Prepare Stripe Checkout',
        path: '/products/prepare-stripe-checkout',
        description: "Prepares a Stripe checkout process",
        parameters: { 
          productIds: { validator: listOfMongoIdStringValidator, required: true },
        },
        returns: {
          clientSecret: { validator: stringValidator, required: true },
          customerId: { validator: stringValidator, required: true },
          publishableKey: { validator: stringValidator, required: true },
          stripeAccount: { validator: stringValidator, required: true },
          businessName: { validator: stringValidator, required: true },
        },
      }, 
    },
    enduserActions: {
      prepare_stripe_checkout: {}, read: {}, readMany: {}, 
    },
    fields: {
      ...BuiltInFields, 
      title: {
        validator: stringValidator100,
        required: true,
        examples: ["Product Title"]
      },
      cost: {
        validator: costValidator,
        required: true,
        examples: [{ amount: 500, currency: 'USD' }],
      }, 
      processor: {
        validator: paymentProcessorValidator,
        examples: ['Stripe'],
      },
      description: { validator: stringValidator5000EmptyOkay },
      htmlDescription: { validator: stringValidator25000EmptyOkay },
      cptCode: { validator: billingCodeValidatorOptional },
      image: { validator: stringValidator100000EmptyOkay },
      showInPortal: { validator: booleanValidator },
      categories: { validator: listOfStringsValidatorEmptyOk },
      maxCheckoutCount: { validator: numberValidatorOptional }
    }
  },
  purchases: {
    info: {},
    constraints: { unique: [], relationship: [] },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: { read: {}, readMany: {} },
    fields: {
      ...BuiltInFields, 
      productId: {
        validator: mongoIdStringValidator,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['products'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'nop',
        }]
      },
      productIds: { validator: listOfStringsValidatorOptionalOrEmptyOk }, 
      enduserId: { 
        validator: mongoIdStringValidator,
        examples: [PLACEHOLDER_ID],
        required: true,
        dependencies: [{
          dependsOn: ['endusers'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      title: {
        validator: stringValidator100,
        required: true,
        examples: ["Product Title"]
      },
      cost: {
        validator: costValidator,
        required: true,
        examples: [{ amount: 500, currency: 'USD' }],
      }, 
      processor: {
        validator: paymentProcessorValidator,
        required: true,
        examples: ['Stripe'],
      },
      // for timestamp of old/imported data processed before Tellescope
      processedAt: { validator: dateOptionalOrEmptyStringValidator },
      description: { validator: stringValidator5000EmptyOkay },
      refundedAmount: { validator: nonNegNumberValidator },
      source: { validator: stringValidatorOptional },
      externalId: { validator: stringValidator },
      cptCode: { validator: billingCodeValidatorOptional },
    }
  },
  purchase_credits: {
    info: {},
    constraints: { unique: [], relationship: [], },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: {},
    fields: {
      ...BuiltInFields, 
      enduserId: { 
        validator: mongoIdStringValidator,
        examples: [PLACEHOLDER_ID],
        required: true,
        dependencies: [{
          dependsOn: ['endusers'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      title: {
        validator: stringValidator100,
        required: true,
        examples: ["Purchase Credit"]
      },
      value: {
        validator: purchaseCreditValueValidator,
        required: true,
        examples: [{
          type: "Credit",
          info: { amount: 100, currency: "USD" },
        }]
      },
      usedAt: { validator: dateOptionalOrEmptyStringValidator, },
      description: { validator: stringValidator5000EmptyOkay },
    }
  },
  phone_calls: {
    info: {},
    constraints: {
      unique: [], 
      relationship: [],
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: { 
      authenticate_calling: {
        op: "custom", access: 'create', method: "post", 
        name: 'Start Phone Call',
        path: '/authenticate-twilio-phone-call',
        description: "Generates an access token for creating / receiving calls via Twilio",
        parameters: { 
          os: { validator: exactMatchValidator<'ios' | 'android'>(['ios', 'android']) },
          type: { validator: userCallRoutingBehaviorValidator },
        },
        returns: { 
          accessToken: { validator: stringValidator, required: true },
          identity: { validator: stringValidator, required: true },
        } 
      },
      get_report: {
        op: "custom", access: 'read', method: "get",
        name: 'Report',
        path: '/phone-calls/report',
        description: "Builds a report",
        parameters: {
          queries: { validator: phoneCallsReportQueriesValidator, required: true },
          range: { validator: dateRangeOptionalValidator },
          enduserFilter: { validator: objectAnyFieldsAnyValuesValidator },
        },
        returns: {
          report: { validator: objectAnyFieldsAnyValuesValidator as any, required: true }
        },
      },
      // can be done in front-end
      // send_digits: {
      //   op: "custom", access: 'create', method: "post", 
      //   name: 'Send Digits',
      //   path: '/phone-calls/send-digits',
      //   description: "Sends digits, e.g. 1234#, for an active phone call",
      //   parameters: { 
      //     callId: { validator: stringValidator, required: true },
      //     digits: { validator: stringValidator100, required: true },
      //   },
      //   returns: { } 
      // },
    },
    enduserActions: { },
    fields: {
      ...BuiltInFields, 
      enduserId: { 
        validator: mongoIdStringValidator,
        examples: [PLACEHOLDER_ID],
        required: true,
        dependencies: [{
          dependsOn: ['endusers'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      inbound: { validator: booleanValidator, readonly: true, required: true },
      externalId: { validator: stringValidator100, readonly: true, },
      to: { validator: stringValidator100, readonly: true, },
      from: { validator: stringValidator100, readonly: true, },
      isVoicemail: { validator: booleanValidator, readonly: true },
      recordingURI: { validator: stringValidator1000, readonly: true, },
      recordingId: { validator: stringValidator100, readonly: true, },
      transcriptionId: { validator: stringValidator100, readonly: true, },
      recordingDurationInSeconds: { validator: nonNegNumberValidator, readonly: true, },

      transcription: { validator: stringValidator25000 },
      note: { validator: stringValidator5000EmptyOkay },
      unread: { validator: booleanValidator },

      userId: { validator: mongoIdStringValidator },
      pinnedAt: { validator: dateOptionalOrEmptyStringValidator },
      readBy: { validator: idStringToDateValidator },
      hiddenBy: { validator: idStringToDateValidator },
      ticketIds: { validator: listOfStringsValidatorEmptyOk },
      tags: { validator: listOfStringsValidatorOptionalOrEmptyOk },
    },
  },
  analytics_frames: {
    info: {},
    constraints: {
      unique: [],
      relationship: [
        {
          explanation: 'Title is required when parentFrame is undefined',
          evaluate: ({ title, parentFrame }, _, session) => {
            if (!(title || parentFrame)) return "Title is required"
          } 
        },
      ],
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: { 
      get_result_for_query: {
        op: "custom", access: 'create', method: "get", 
        name: 'Get analytics for query',
        path: '/result-for-analytics-query',
        description: "Returns a computed result for an analytics query",
        parameters: { 
          query: { validator: analyticsQueryValidator, required: true },
          createdRange: { validator: dateRangeValidator },
          updatedRange: { validator: dateRangeValidator },
        },
        returns: { 
          count: { validator: nonNegNumberValidator },
          percentage: { validator: nonNegNumberValidator },
          values: { validator: analyticsQueryResultsValidator },
        } 
      },
    },
    enduserActions: { },
    fields: {
      ...BuiltInFields, 
      title: {
        validator: stringValidator100,
        examples: ["Example Title"]
      },
      query: {
        validator: analyticsQueryValidator,
        required: true,
        examples: [{
          resource: "Endusers", 
          info: {
            method: 'Total', 
            parameters: {},
          },
          filter: {},
        }],
      },
      createdRange: { validator: dateRangeValidator },
      updatedRange: { validator: dateRangeValidator },
      parentFrame: {
        validator: mongoIdStringValidator,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['analytics_frames'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      type: { validator: analyticsFrameTypeValidator }
    },
  },
  availability_blocks: {
    info: {},
    constraints: {
      unique: [],
      relationship: [],
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: { 
      update_order: {
        op: "custom", access: 'update', method: "post", 
        name: 'Update order of availability blocks',
        path: '/update-order-of-availability-blocks',
        description: "Returns a computed result for an analytics query",
        parameters: { 
          indexUpdates: { validator: indexUpdatesValidator, required: true }
        },
        returns: { } 
      },
      handle_autoreply: {
        op: "custom", access: 'update', method: "post", 
        adminOnly: true,
        name: 'Handle Autoreply',
        path: '/handle-out-of-office-autoreply',
        description: "Handles autoreply during out-of-office periods, throttled to one message per hour",
        parameters: { 
          channel: { validator: communicationsChannelValidator, required: true },
          // messageId: { validator: mongoIdStringValidator, required: true },
          enduserId: { validator: mongoIdStringValidator, required: true },
          threadId: { validator: mongoIdStringValidator },
          userId: { validator: mongoIdStringValidator },
        },
        returns: { } 
      },
    },
    enduserActions: { },
    fields: {
      ...BuiltInFields,  
      entity: { validator: availabilityEntitiesValidator, required: true, examples: ['organization'] },
      entityId: { 
        validator: mongoIdStringValidator,   
        required: true,
        examples: [PLACEHOLDER_ID],
        dependencies: [
          // causes bad error on create
          // {
          //   dependsOn: ['organizations'],
          //   dependencyField: '_id',
          //   relationship: 'foreignKey',
          //   onDependencyDelete: 'delete',
          // },
          // {
          //   dependsOn: ['users'],
          //   dependencyField: '_id',
          //   relationship: 'foreignKey',
          //   onDependencyDelete: 'delete',
          // },
        ]
      },
      index: { validator: nonNegNumberValidator, required: true, examples: [30] },
      dayOfWeekStartingSundayIndexedByZero: { validator: nonNegNumberValidator, required: true, examples: [30] },
      startTimeInMinutes: { validator: nonNegNumberValidator, required: true, examples: [30] },
      endTimeInMinutes: { validator: nonNegNumberValidator, required: true, examples: [30] },
      active: { validator: dateRangeOptionalValidator },
    },
  },
  enduser_views: {
    info: {},
    constraints: { unique: ['title'], relationship: [], },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: {},
    fields: {
      ...BuiltInFields, 
      title: {
        validator: stringValidator100,
        required: true,
        examples: ["Custom View"]
      },
      fields: {
        validator: listOfStringsValidator,
      },
      filter: { validator: objectAnyFieldsAnyValuesValidator },
      defaultForRole: { validator: stringValidator100 },
      hideProfileLink: { validator: booleanValidator },
      customTypeId: { validator: mongoIdStringValidator },
      style: { validator: objectAnyFieldsAnyValuesValidator as any },
    }
  },
  enduser_profile_views: {
    info: {},
    constraints: { unique: ['title'], relationship: [], },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: {},
    fields: {
      ...BuiltInFields, 
      title: {
        validator: stringValidator100,
        required: true,
        examples: ["Custom Profile View"]
      },
      blocks: {
        validator: enduserProfileViewBlocksValidator,
        required: true,
        examples: [
          [{
            type: 'Field Group',
            info: {
              fields: ['email'],
              title: 'title'
            }
          }]
        ]
      },
    }
  },
  background_errors: {
    info: {},
    constraints: { unique: [], relationship: [], },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: {},
    fields: {
      ...BuiltInFields, 
      title: {
        validator: stringValidator100,
        required: true,
        examples: ["Automation Error"]
      },
      message: {
        validator: stringValidator25000,
        required: true,
        examples: ["Details relating to an automation error"]
      },
      acknowledgedAt: { validator: dateOptionalOrEmptyStringValidator },
      journeyId: { validator: mongoIdStringValidator },
      enduserId: { validator: mongoIdStringValidator },
    }
  },
  automation_triggers: {
    info: {},
    // making title unique causes issues in journey copy when creating copy of waitForTrigger action
    constraints: { unique: [], relationship: [], },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {
      trigger_events: {
        op: "custom", access: 'create', method: "post", 
        adminOnly: true,
        name: 'Trigger Event',
        path: '/automation-triggers/trigger-events',
        description: "Triggers a list of events for endusers",
        parameters: { 
          triggers: {
            validator: listValidator(objectValidator<{ enduserId: string, automationTriggerId: string }>({
              automationTriggerId: mongoIdStringRequired,
              enduserId: mongoIdStringRequired,
            })),
            required: true,
          }
        },
        returns: { } 
      },
    },
    enduserActions: {},
    fields: {
      ...BuiltInFields, 
      title: {
        validator: stringValidator100,
        required: true,
        examples: ["Automation Trigger"]
      },
      event: {
        validator: automationTriggerEventValidator,
        required: true,
        examples: [
          {
            type: "Form Submitted", 
            info: {
              formId: PLACEHOLDER_ID
            }
          }
        ]
      },
      action: {
        validator: automationTriggerActionValidator,
        required: true,
        examples: [
          {
            type: "Add To Journey", 
            info: {
              journeyId: PLACEHOLDER_ID
            }
          }
        ]
      },
      status: { 
        validator: automatioNTriggerStatusValidator,
        required: true,
        examples: ["Active"]
      },
      enduserCondition: { 
        validator: orValidator({
          optional: optionalAnyObjectValidator,
          included: objectAnyFieldsAnyValuesValidator,
        }, { isOptional: true })
      },
      journeyId: { 
        validator: mongoIdStringValidator,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['journeys'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      oncePerEnduser: { validator: booleanValidator },
      // automationStepId: { 
      //   validator: mongoIdStringValidator,
      //   examples: [PLACEHOLDER_ID],
      //   dependencies: [{
      //     dependsOn: ['automation_steps'],
      //     dependencyField: '_id',
      //     relationship: 'foreignKey',
      //     onDependencyDelete: 'delete',
      //   }]
      // },
      triggerNextAt: { validator: dateValidator },
    }
  },
  superbill_providers: {
    info: {},
    constraints: { unique: [], relationship: [], },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: {},
    fields: {
      ...BuiltInFields, 
      address: {
        validator: addressValidator,
        required: true,
        examples: [{
          city: 'city',
          state: 'CA',
          lineOne: 'address line one',
          zipCode: '12345',
        }]
      },
      email: { 
        validator: emailValidator,
        required: true,
        examples: ['example@tellescope.com']
      },
      phone: {
        validator: stringValidator,
        required: true,
        examples: ['415-415-4155'],
      },
      officeName: {
        validator: stringValidator,
        required: true,
        examples: ['office name'],
      },
      taxId: {
        validator: stringValidator,
        required: true,
        examples: ['XX-XXXXXXX'],
      },
      providerName: {
        validator: stringValidator,
        required: true,
        examples: ['provider name'],
      },
      placeOfServiceCode: {
        validator: stringValidator,
        required: true,
        examples: ['17'],
      },
      providerLicense: {
        validator: stringValidator,
        required: true,
        examples: ['17'],
      },
      providerNPI: {
        validator: stringValidator,
        required: true,
        examples: ['17'],
      },
    }
  },
  superbills: {
    info: {},
    constraints: { unique: [], relationship: [], },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: {},
    fields: {
      ...BuiltInFields, 
      enduserId: { 
        validator: mongoIdStringValidator,
        examples: [PLACEHOLDER_ID],
        required: true,
        dependencies: [{
          dependsOn: ['endusers'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      appointmentDate: { 
        validator: dateValidator,
        required: true,
        examples: [new Date()]
      },
      patient: {
        validator: superbillPatientInfoValidator,
        required: true,
        examples: [] // too lazy
      },
      provider: {
        validator: superbillProviderInfoValidator,
        required: true,
        examples: [] // too lazy
      },
      lineItems: {
        validator: superbillLineItemsValidator,
        required: true,
        examples: [] // too lazy
      }
    }
  },
  referral_providers: {
    info: {},
    constraints: { unique: [], relationship: [], },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: {
      read: {}, readMany: {},
    },
    fields: {
      ...BuiltInFields, 
      fname: { 
        validator: stringValidator,
        // required: true,
        examples: ['Name'],
      },
      lname: { 
        validator: stringValidator,
        // required: true,
        examples: ['Name'],
      },
      organizationName: { 
        validator: stringValidator,
        required: true,
        examples: ['Name'],
      },
      clinicName: { 
        validator: stringValidator,
        examples: ['Name'],
      },
      types: {
        validator: listOfStringsValidatorEmptyOk,
        examples: [['Type']]
      },
      acceptedInsurance: { validator: insurancesValidator },
      address: { validator: addressOptionalValidator },
      email: { validator: emailValidator },
      phone: { validator: phoneValidator },
      phoneExtension: { validator: stringValidator100 },
      notes: { validator: stringValidator25000 },
      website: { validator: stringValidator1000 },
      bookingLink: { validator: stringValidator1000 },
      uninsuredDescription: { validator: stringValidator1000 },
      description: { validator: stringValidator1000 },
      services: { validator: listOfStringsValidatorOptionalOrEmptyOk },
      locations: { validator: listOfStringsValidatorOptionalOrEmptyOk },
      languages: { validator: listOfStringsValidatorOptionalOrEmptyOk },
      eligibilityCriteria: { validator: listOfStringsValidatorOptionalOrEmptyOk },
      activeRelationshipStatus: { validator: stringValidator100 },
      acceptingReferralsStatus: { validator: stringValidator100 },
      inPersonServiceStatusStatus: { validator: stringValidator100 },
      virtualServiceStatusStatus: { validator: stringValidator100 },
    }
  },
  enduser_medications: {
    info: {},
    constraints: { unique: [], relationship: [], },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: {
      read: {}, readMany: {},
    },
    fields: {
      ...BuiltInFields, 
      enduserId: {
        validator: mongoIdStringValidator,
        required: true,
        examples: [PLACEHOLDER_ID],
        updatesDisabled: true,
        dependencies: [{
          dependsOn: ['endusers'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      title: { 
        required: true,
        validator: stringValidator,
        examples: ['Medication Name'],
      },
      calendarEventId: { validator: mongoIdStringValidator },
      prescribedBy: { validator: mongoIdStringValidator },
      prescribedAt: { validator: dateOptionalOrEmptyStringValidator },
      startedTakingAt: { validator: dateOptionalOrEmptyStringValidator },
      stoppedTakingAt: { validator: dateOptionalOrEmptyStringValidator },
      rxNormCode: { validator: stringValidator },
      dispensing: {
        validator: objectValidator<EnduserMedication['dispensing']>({ 
          quantity: numberValidator,
          unit: stringValidator,
        }), 
      },
      dosage: {
        validator: objectValidator<EnduserMedication['dosage']>({ 
          value: stringValidator, 
          unit: stringValidator,
          frequency: stringValidator,
        }), 
      },
      source: { validator: stringValidator1000Optional },
      externalId: { validator: stringValidator250 },  
      notes: { validator: stringValidator },  
    }
  },
  phone_trees: {
    info: {},
    constraints: { unique: [], relationship: [], },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: {
      read: {}, readMany: {},
    },
    fields: {
      ...BuiltInFields, 
      number: { 
        required: true,
        validator: stringValidator,
        examples: ['+15555555555'],
      },
      isActive: { 
        required: true,
        validator: booleanValidator,
        examples: [true],
      },
      nodes: {
        required: true,
        validator: phoneTreeNodesValidator,
        examples: [
          [
          //   {
          //   id: "10293u0f913ikf0foeq",
          //   action: {
          //     type: 'Dial Users',
          //     info: {
          //       userIds: [PLACEHOLDER_ID],
          //     },
          //   },
          //   events: [{
          //     type: 'Start',
          //     parentId: "10293u0f913ikf0foeq",
          //     info: {},
          //   }]
          // }
        ],
        ]
      },
      testEnduserIds: { validator: listOfStringsValidatorOptionalOrEmptyOk },
      enduserCondition: { validator: phoneTreeEnduserConditionValidator },
    }
  },
  enduser_custom_types: {
    info: {},
    constraints: { unique: [], relationship: [], },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: {
      read: {}, readMany: {},
    },
    fields: {
      ...BuiltInFields, 
      title: {
        validator: stringValidator,
        required: true,
        examples: ["Title"]
      },
      builtinFields: {
        validator: buildInFieldsValidator,
      },
      customFields: {
        validator: customEnduserFieldsValidatorOptionalOrEmpty,
      }
    }
  },
  table_views: {
    info: {},
    constraints: { unique: [], relationship: [], },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: {},
    fields: {
      ...BuiltInFields, 
      title: {
        validator: stringValidator,
        required: true,
        examples: ["Title"]
      },
      page: {
        validator: stringValidator,
        required: true,
        examples: ["Title"]
      },
      columns: {
        validator: tableViewColumnsValidator,
        required: true,
        examples: [[]],
      },
      defaultForRoles: { validator: listOfStringsValidatorOptionalOrEmptyOk },
      defaultForUserIds: { validator: listOfStringsValidatorOptionalOrEmptyOk },
      filter: { validator: objectAnyFieldsAnyValuesValidator },
    }
  },
  email_sync_denials: {
    info: {},
    constraints: { unique: ['email'], relationship: [], },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: {},
    fields: {
      ...BuiltInFields, 
      email: {
        validator: emailValidator,
        required: true,
        examples: ["test@test.com"]
      },
    }
  },
})

// export type SchemaType = typeof schema
// export type SchemaV1 = SchemaType// & Schema