import {
  ServerModelForName,
  DatabaseModel,
  DatabaseRecord,
  ObjectId,
  ModelName,
  User,
  VitalConfiguration,
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
import * as Utilities from "@tellescope/utilities" // suppresses error on BuiltInFields
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
  ListOfStringsWithQualifier,
  GoGoMedsPet,
  InsuranceType,
  SmartMeterOrderLineItem,
  PhoneCallsReport,
  AthenaSubscription,
  TellescopeGender,
  LabeledField,
  HealthieSendChatAutomationAction,
  TwilioQueue,
  SendWebhookAutomationAction,
  Addendum,
  GroupCancellation,
  FormResponseFollowup,
  DevelopHealthRunBenefitVerificationBaseArguments,
  WeeklyAvailability,
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
  EnduserObservation as EnduserObservationClient,
  AppointmentLocation,
  CalendarEventTemplate,
  Product,
  ManagedContentRecord,
  EnduserMedication,
  DatabaseRecord as DatabaseRecordClient,
  Ticket,
  GroupMMSConversation,
  EnduserOrder,
  EnduserEncounter,
  Purchase,
  Integration,
  TicketQueue,
  SMSMessage,
  EnduserEligibilityResult,
  Waitlist,
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
  listValidatorEmptyOk,
  phonePlaybackValidatorOptional,
  ticketSnoozesValidator,
  listOfStringsWithQualifierValidator,
  listOfStringsWithQualifierValidatorOptional,
  stringValidator100000OptionalEmptyOkay,
  mmsMessagesValidator,
  groupMMSUserStatesValidator,
  sortingFieldsValidator,
  listOfUniqueStringsValidatorEmptyOk,
  ticketReminderValidator,
  insuranceOptionalValidator,
  listOfStringsValidatorUniqueOptionalOrEmptyOkay,
  diagnosesValidator,
  stateValidatorOptional,
  canvasCodingValidator,
  vitalConfigurationRangesValidator,
  smartMeterLinesValidator,
  formFieldFeedbackValidator,
  phonePlaybackValidator,
  enduserProfileWebhooksValidator,
  fieldsSyncValidator,
  athenaSubscriptionTypeValidator,
  athenaSubscriptionsValidator,
  dateValidatorOptional,
  listQueryQualifiersValidator,
  stringValidator5000OptionalEmptyOkay,
  labeledFieldsValidator,
  fieldMappingsValidator,
  analyticsFrameGroupingCategoriesValidator,
  customDashboardViewValidator,
  bookingRestrictionsByTemplateValidator,
  listOfNumbersValidatorUniqueOptionalOrEmptyOkay,
  enduserDiagnosisValidator,
  canvasCodingValidatorOptional,
  calendarEventAttendeesValidator,
  developHealthDrugsValidator,
  developHealthDiagnosesValidator,
  developHealthMockResultValidator,
  positiveNumberValidator,
  listOfStringsWithQualifierValidatorOptionalValuesEmptyOkay,
} from "@tellescope/validation"

import {
  CREATOR_ONLY_ACCESS,
  DEFAULT_OPERATIONS,
  PLACEHOLDER_ID,
  ENDUSER_SESSION_TYPE,
  USER_SESSION_TYPE,
  CANDID_TITLE,
  DEVELOP_HEALTH_TITLE,
} from "@tellescope/constants"

export const get_next_reminder_timestamp_for_ticket = ({ dueDateInMS, reminders, closedAt } : Pick<Ticket, 'dueDateInMS' | 'reminders' | 'closedAt'>): number => {
  if (!dueDateInMS) return -1
  if (closedAt) return -1

  const pending = reminders?.filter(r => !r.didRemind)
  if (!pending?.length) return -1

  const maxMsBeforeStartTime = Math.max(...pending.map(p => p.msBeforeDueDate))

  return dueDateInMS - maxMsBeforeStartTime 
}

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

export type UniqueArrayConstraint <T> = { array: keyof T, itemKey?: string, compareToOtherRecords?: boolean, }
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
  | 'all' // no one (including admins) can access to this field
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

export const UNIQUE_LIST_FIELDS = ['assignedTo', 'tags', 'closeReasons']

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

export type VitalLabTest = {
  "id": string,
  "name": "Lipids Panel",
  "description": "Cholesterol test",
  "sample_type": "dried blood spot",
  "method": "testkit" | "walk_in_test" | "at_home_phlebotomy",
  "price": number, // usd
  status: "active" | "pending_approval" | "inactive",
  "is_active": true, // deprecated in favor of status
  "lab"?: {
    "slug": "USSL",
    "name": "US Specialty Lab",
    "first_line_address": "123 Main St",
    "city": "New York",
    "zipcode": "10001"
  },
  "markers"?: [
    {
      id: number,
      "name": "Thyroid Stimulating Hormone",
      "slug": "tsh",
      "description": "",
      aoe?: {
        questions: {
          id: number, 
          required?: boolean,
          code: string,
          value: string, // question label
          constraint?: string, // tooltip for text restrictions
          type: 'choice' | 'multiple_choice' | 'numeric' | 'text',
          answers?: { // included in choice / multiple_choice
            id: string,
            code: string,
            value: string,
          }[]
        }[]
      }
    },
  ],
  
}
export type VitalAOEAnswer = {
  marker_id: number,
  question_id: number,
  answer: string,
}

type BookingInfoEnduserFields = {
  state?: string,
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
    embedding_search: CustomAction<{ content: string }, { templateIds: string[], message?: string }>, 
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
      externalId?: string,
      isCalledOut?: boolean,
      hiddenFromEnduser?: boolean,
    }, 
      { presignedUpload: object, file: File }
    >,
    file_download_URL: CustomAction<{ secureName: string, preferInBrowser?: boolean, }, { downloadURL: string, name: string }>,
    run_ocr: CustomAction<{ id: string, type: string }, { file: File }>,
    confirm_file_upload: CustomAction<{ id: string }, { }>,
    send_fax: CustomAction<{ id: string, recipientFaxNumber: string }, { }>,
  },
  form_fields: {
    load_choices_from_database: CustomAction<{ fieldId: string, lastId?: string, limit?: number, databaseId?: string }, { choices: DatabaseRecordClient[] }>,
    booking_info: CustomAction<{ bookingPageId: string, enduserId?: string, enduserFields?: BookingInfoEnduserFields }, { bookingURL: string, warningMessage?: string, entropy: string, }>,
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
        carePlanId?: string,
        context?: string,
        calendarEventId?: string,
        groupId?: string,
        groupInstance?: string,
        groupPosition?: number,
      }, 
      { accessCode: string, url: string, response: FormResponse, fullURL: string }>
    ,
    submit_form_response: CustomAction<
      { 
        accessCode: string, responses: FormResponseValue[], 
        automationStepId?: string, customerId?: string, productIds?: string[],
        utm?: LabeledField[],
      }, 
      { formResponse: FormResponse, nextFormGroupPublicURL?: string }
    >,
    save_field_response: CustomAction<{ formResponseId?: string, accessCode?: string, response?: FormResponseValue, responses?: FormResponseValue[] }, { }>,
    info_for_access_code: CustomAction<{ accessCode: string }, {
      form: Form, 
      fields: FormField[], 
      response: FormResponse, 
    }>,
    stripe_details: CustomAction<
      { fieldId: string }, 
      { customerId: string, clientSecret: string, publishableKey: string, stripeAccount: string, businessName: string, answerText?: string, isCheckout?: boolean }
    >,
    chargebee_details: CustomAction<{ fieldId: string }, { url: string }>,
    generate_pdf: CustomAction<
      { id: string }, 
      {  }
    >,
    push_to_EHR: CustomAction<
      { 
        id: string,
        addedResponses?: FormResponseValue[],
      }, 
      {  }
    >,
    get_report: CustomAction<{ 
      queries: FormResponsesReportQueries, 
      formIds?: string[],
      submittedAtRange?: DateRange, 
      range?: DateRange, 
      enduserFilter?: Record<string, any>,
      submittedOnly?: boolean,
      includeIds?: boolean,
    }, 
    { report: Report }
    >,
    get_enduser_statistics: CustomAction<{ 
      enduserFields?: { field: string, value: string }[],
      endusersFilter?: any,
      formIds?: string[],
      range?: DateRange, 
      customTypeId?: string,
      groupBy?: string,
      includeCalendarEventTemplateIds?: string[],
    }, { count: number, grouped?: { _id: string, count: number }[] }>,
    get_enduser_statistics_by_submitter: CustomAction<{ 
      enduserFields?: { field: string, value: string }[],
      endusersFilter?: any,
      formIds?: string[],
      range?: DateRange, 
      customTypeId?: string,
      includeCalendarEventTemplateIds?: string[],
    }, { count: number, grouped: { _id: string, count: number }[] }>,
    get_related_forms_report: CustomAction<{ 
      formIds?: string[],
      submittedAtRange?: DateRange, 
      childSubmittedAtRange?: DateRange, 
      answers?: string[],
      groupBy?: string,
      enduserFilter?: any,
    }, 
    { report: Report }
    >,
    get_distribution_report: CustomAction<{ 
        formIds: string[],
        submittedAtRange?: DateRange, 
      }, 
      { report: Report }
    >,
  },
  journeys: {
    // update_state: CustomAction<{ updates: Partial<JourneyState>, id: string, name: string }, { updated: Journey }>,
    delete_states: CustomAction<{ id: string, states: string[] }, { updated: Journey }>,
    handle_incoming_communication: CustomAction<{ enduserId: string, channel?: string, messageId?: string, destination?: string }, { }>,
    get_journey_statistics: CustomAction<{ journeyId: string }, { statistics: JourneyStatistics }>,
  },
  endusers: {
    add_to_healthie_course: CustomAction<{ id: string, courseId: string }, { }>,
    check_eligibility: CustomAction<{ 
      id: string, integration?: string, clearinghouse?: string, insuranceType?: InsuranceType, reCheck?: boolean,
    }, { enduser: Enduser }>,
    set_password: CustomAction<{ id: string, password: string }, { }>,
    is_authenticated: CustomAction<
      { id?: string, authToken: string }, 
      { isAuthenticated: true, enduser: Enduser } | { isAuthenticated: false, enduser: null }
    >,
    refresh_session: CustomAction<{ invalidatePreviousToken?: boolean }, { enduser: Enduser, authToken: string }>,
    generate_auth_token: CustomAction<{ id?: string, phone?: string, email?: string, externalId?: string, durationInSeconds?: number }, { authToken: string, enduser: Enduser }>,
    logout: CustomAction<{ }, { }>,
    current_session_info: CustomAction<{ }, { enduser: Enduser }>,
    add_to_journey: CustomAction<{ enduserIds: string[], journeyId: string, startAt?: Date, automationStepId?: string, journeyContext?: JourneyContext, throttle?: boolean, source?: string }, { }>, 
    remove_from_journey: CustomAction<{ enduserIds: string[], journeyId: string }, { }>, 
    merge: CustomAction<{ sourceEnduserId: string, destinationEnduserId: string, }, { }>, 
    push: CustomAction<{ enduserId: string, destinations?: string[], externalIds?: string[] }, { fullscriptRedirectURL?: string, vital_user_id?: string }>,
    bulk_update: CustomAction<
      { ids: string[], state?: string, fields?: CustomFields, pushTags?: string[], replaceTags?: string[], updateAccessTags?: boolean, customTypeId?: string }, 
      { updated: Enduser[] }
    >,
    bulk_assignment: CustomAction<
      { 
        existingAssignment?: ListOfStringsWithQualifier, 
        field?: string, existingFieldValue?: string, 
        removeIds?: string[],
        addIds?: string[],
        customTypeId?: string,
      }, 
      { updated: Enduser[] }
    >,
    related_contacts_report: CustomAction<{ minimumRelationshipsCount: number }, { report: { enduserId: string, count: number }[] }>,
    get_report: CustomAction<{ 
      queries: EndusersReportQueries, 
      customTypeId?: string, 
      activeSince?: Date,
      fields?: { field: string, value: string }[],
      range?: DateRange, 
      // mmddyyyyRangeField?: string,
    }, { report: EndusersReport }>,
    get_engagement_statistics: CustomAction<{ 
      enduserFields?: { field: string, value: string }[],
      endusersFilter?: any,
      formIds?: string[],
      range?: DateRange, 
      customTypeId?: string,
      groupBy?: string,
      includeLinkClicks?: boolean,
    }, { count: number, grouped?: { _id: string, count: number }[] }>,
    get_engagement_statistics_by_userId: CustomAction<{ 
      enduserFields?: { field: string, value: string }[],
      endusersFilter?: any,
      formIds?: string[],
      range?: DateRange, 
      customTypeId?: string,
      includeLinkClicks?: boolean,
    }, { count: number, grouped: { _id: string, count: number }[] }>,
    sync_zendesk: CustomAction<{ enduserId: string }, { }>,
    get_journeys_report: CustomAction<{ }, { report: Record<string, any> }>,
    dosespot: CustomAction<{ enduserId: string }, { link: string }>,
    customer_io_sync: CustomAction<{ enduserIds: string[], event?: string, trackProperties?: string[]  }, { }>,
    rename_stored_custom_fields: CustomAction<{ existingName: string, newName: string }, { }>,
  },
  users: {
    display_info: CustomAction<{ }, { fname: string, lname: string, id: string }[]>,
    refresh_session: CustomAction<{ invalidatePreviousToken?: boolean }, { user: UserSession, authToken: string }>,
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
    configure_MFA: CustomAction<{  }, { recoveryCodes: string[], authToken: string, user: UserSession }>,
    generate_MFA_challenge: CustomAction<{ method: string }, { }>,
    submit_MFA_challenge: CustomAction<{ code: string }, { authToken: string, user: UserSession }>,
    get_engagement_report: CustomAction<{ range?: DateRange, excludeAutomated?: boolean }, { report: Record<string, any> }>,
    consent: CustomAction<{ termsVersion: string, }, { user: User, authToken: string }>,
    get_users_for_groups: CustomAction<{ groups: string[] }, { userIds: string[] }>,
  },
  chat_rooms: {
    join_room: CustomAction<{ id: string }, { room: ChatRoom }>,
    display_info: CustomAction<{ id: string }, { id: string, display_info: { [index: string]: UserDisplayInfo } }>,
    mark_read: CustomAction<{ id: string }, { updated: ChatRoom }>,
    send_healthie_chat: CustomAction<HealthieSendChatAutomationAction['info'] & { enduserId: string, journeyId?: string }, { room: ChatRoom }>,
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
    send_automation_webhook: CustomAction<{ message: string, enduserId: string, automationStepId: string, action: SendWebhookAutomationAction, context?: JourneyContext }, { }>,
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
    load_payers: CustomAction<{ integration?: string, query?: string, offset?: number, limit?: number, next_page_token?: string }, { next_page_token?: string, choices: { name: string, id: string } [] }>,
    generate_google_auth_url: CustomAction<{ calendarOnly?: boolean }, { authUrl: string, }>, 
    disconnect_google_integration: CustomAction<{}, {}>,
    generate_oauth2_auth_url: CustomAction<{ integration: IntegrationsTitleType }, { authUrl: string, state: string }>, 
    add_api_key_integration: CustomAction<{ API_KEY: string, integration: string, externalId?: string, webhooksSecret?: string, environment?: string, fields?: Record<string, string>, scope?: string }, { integration: Integration }>, 
    remove_api_key_integration: CustomAction<{ integration: string, externalId?: string }, { }>, 
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
    }, { integration: Integration }>, 
    disconnect_elation: CustomAction<{  }, { }>, 
    connect_zendesk: CustomAction<{ 
      subdomain: string,
      clientId: string,
      clientSecret: string,
      adminAPIKey: string,
      apiKeyEmail: string,
    }, {  }>, 
    disconnect_zendesk: CustomAction<{}, {}>,
    update_zoom: CustomAction<{ clientId?: string, clientSecret?: string }, { }>,
    proxy_read: CustomAction<{ integration: string, type: string, id?: string, query?: string }, { data: any }>,
  },
  emails: {
    sync_integrations: CustomAction<{ enduserEmail: string, allUsers?: boolean }, { newEmails: Email[] }>,
    deliver_via_outlook: CustomAction<{ message: string, senderId: string, cc?: string[], replyId?: string }, { 
      id: string, 
      conversationId: string,
      timestamp: string,
    }>, 
    deliver_via_iterable: CustomAction<{ recipientEmail: string, campaignId: string }, {}>,
    send_with_template: CustomAction<{ enduserId: string, senderId: string, templateId: string }, { email: Email }>,
    get_template_report: CustomAction<{ range?: DateRange }, { report: Report }>,
  },
  calendar_events: {
    push: CustomAction<{ calendarEventId: string, destinations?: string[] }, { event?: CalendarEvent }>,
    get_events_for_user: CustomAction<{ userId: string, from: Date, userIds?: string[], to?: Date, limit?: number }, { events: CalendarEvent[] }>, 
    load_events: CustomAction<{ userIds: string[], from: Date, to: Date, limit?: number, external?: boolean }, { events: CalendarEvent[] }>, 
    generate_meeting_link: CustomAction<{ eventId: string, enduserId: string }, { link: string }>, 
    get_appointment_availability: CustomAction<{ 
      from: Date, calendarEventTemplateId: string, to?: Date, restrictedByState?: boolean, limit?: number, locationId?: string,
      businessId?: string, // for accessing while unauthenticated
      userId?: string, 
      userIds?: string[],
      multi?: boolean,
      intervalInMinutes?: number,
      state?: string,
    }, { 
      availabilityBlocks: BaseAvailabilityBlock[],
    }>,
    book_appointment: CustomAction<{ 
      userId: string, startTime: Date, calendarEventTemplateId: string, 
      otherUserIds?: string[],
      token?: string,
      locationId?: string,
      bookingPageId?: string,
      rescheduledCalendarEventId?: string,
      agreedToTerms?: AppointmentTerm[],
      timezone?: Timezone,
      fields?: Record<any, any>
      customerId?: string,
      intervalInMinutes?: number,
      holdUntil?: Date,
      holdFormResponseId?: string,
      reason?: string,
      scheduledBy?: string,
    }, { 
      createdEvent: CalendarEvent,
    }>,
    stripe_details: CustomAction<{ }, { stripe?: StripeCheckoutInfo }>,
    generate_zoom_meeting: CustomAction<{ calendarEventId?: string, userId: string, startTimeInMS?: number, durationInMinutes?: number }, { updatedEvent: CalendarEvent }>, 
    change_zoom_host: CustomAction<{ calendarEventId: string, userId: string }, { updatedEvent: CalendarEvent }>, 
    download_ics_file: CustomAction<{ calendarEventId: string, attendeeId?: string, attendeeType?: SessionType, excludeAttendee?: boolean }, { }>,
    get_report: CustomAction<{ range?: DateRange, groupBy?: string, templateIds?: string[] }, { report: Report }>,
    get_enduser_report: CustomAction<{ range?: DateRange, groupBy?: string, countDuplicates?: boolean, templateIds?: string[], enduserGroupBy?: string, enduserFields: Record<string, any> }, { report: Report }>,
  },
  organizations: {
    create_and_join: CustomAction<{ name: string, subdomain: string }, { authToken: string, user: User, organization: Organization }>, 
    create_suborganization: CustomAction<{ name: string, subdomain: string }, { created: Organization }>, 
    add_athena_subscription: CustomAction<{ startAt?: Date, type: AthenaSubscription['type'], frequency: number, daily?: boolean }, { organization: Organization }>, 
    sync_athena_subscription: CustomAction<{ type: AthenaSubscription['type'], backgroundTaskId?: string, enduserId?: string }, { }>, 
    sync_note_to_canvas: CustomAction<{ enduserId: string, note: string }, { canvasId: string }>, 
    link_twilio: CustomAction<{ }, { organization: Organization }>, 
    load_twilio_embed: CustomAction<{ type?: string }, { id: string, token: string }>, 
  },
  phone_calls: {
    authenticate_calling: CustomAction<{ os?: "ios" | "android", type?: UserCallRoutingBehavior }, { accessToken: string, identity: string }>, 
    get_report: CustomAction<{ 
      queries: PhoneCallsReportQueries,
      range?: DateRange, 
      enduserFilter?: Record<string, any>,
    }, { report: Report }>,
    get_number_report: CustomAction<{ range?: DateRange }, { report: PhoneCallsReport }>,
    upgrade_to_conference: CustomAction<{ id: string }, { }>,
    add_conference_attendees: CustomAction<{ conferenceId: string, enduserId?: string, byClientId?: string[], byPhone?: string[] }, { }>,
    remove_conference_attendees: CustomAction<{ conferenceId: string, byClientId?: string[], byPhone?: string[] }, { }>,
    end_conference: CustomAction<{ id: string }, { }>,
    cancel_recording: CustomAction<{ enduserId: string }, { }>,
    delete_recordings: CustomAction<{ callIds: string[] }, { }>,
  },
  call_hold_queues: {
    answer_call: CustomAction<{ queueId: string }, { }>, 
    get_details: CustomAction<{ }, { queues: TwilioQueue[] }>, 
  }
  analytics_frames: {
    get_result_for_query: CustomAction<{ 
      query: AnalyticsQuery,
      createdRange?: DateRange,
      createdAvailabilities?: WeeklyAvailability[],
      updatedRange?: DateRange,
      groupByCareTeam?: boolean,
    }, AnalyticsQueryResult>, 
    get_custom_report: CustomAction<{ key: string, lastId?: string, limit?: number }, { report: any }>, 
  },
  managed_content_records: {
    generate_embedding: CustomAction<{ id: string }, { updated: ManagedContentRecord }>, 
    search: CustomAction<{ query: string, type?: "enduser" | "internal" }, { record: ManagedContentRecord, matches: ManagedContentRecord[], response: string }>, 
    update_indexes: CustomAction<{ updates: { id: string, index: number }[] }, {}>,
  },
  automation_triggers: {
    trigger_events: CustomAction<{ triggers: { enduserId: string, automationTriggerId: string, journeyContext?: JourneyContext }[] }, { }>, 
  },
  tickets: {
    close_ticket: CustomAction<{ ticketId: string, closedForReason?: string }, { updated: Ticket, generated?: Ticket }>,
    update_indexes: CustomAction<{ updates: { id: string, index: number }[] }, {}>,
    get_report: CustomAction<{ rangeField?: string, title?: string, titles?: string[], userId?: string, range?: DateRange, groupByOwnerAndTitle?: boolean }, { report: TicketsReport }>,
    get_distribution_report: CustomAction<{  range?: DateRange }, { report: Report[keyof Report] }>,
    assign_from_queue: CustomAction<{ userId?: string, ticketId?: string, queueId?: string, overrideRestrictions?: boolean, }, { ticket: Ticket, queue: TicketQueue, enduser: Enduser }>,
  },
  ticket_queues: {
    update_indexes: CustomAction<{ updates: { id: string, index: number }[] }, {}>,
  },
  appointment_booking_pages: {
    generate_access_token: CustomAction<{ expiresAt: Date, bookingPageId?: string }, { token: string }>,
  },
  enduser_observations: {
    load: CustomAction<{ 
      from: Date, to: Date, 
      enduserId?: string,
      careTeam?: string[],
      unreviewed?: boolean,
    }, { observations: EnduserObservationClient[] }>,
    acknowledge: CustomAction<{ ids: string[] }, { }>,
  },
  sms_messages: {
    send_message_to_number: CustomAction<{ message: string, to: string }, { enduser: Enduser }>,
    get_number_report: CustomAction<{ range?: DateRange }, { report: PhoneCallsReport }>,
    get_template_report: CustomAction<{ range?: DateRange }, { report: Report }>,
    send_with_template: CustomAction<{ enduserId: string, senderId: string, templateId: string, fromNumber?: string }, { sms: SMSMessage }>,
  },
  products: {
    prepare_stripe_checkout: CustomAction<
      { productIds: string[] }, 
      { customerId: string, clientSecret: string, publishableKey: string, stripeAccount: string, businessName: string }
    >,
    get_stripe_portal_session: CustomAction<{ 
      stripeKey?: string,
      stripeCustomerId?: string,
      return_url: string 
    }, { url: string }>
  },
  purchases: {
    charge_card_on_file: CustomAction<
      { enduserId: string, productIds?: string[], cost?: Purchase['cost'], stripeKey?: string }, 
      { }
    >,
  },
  group_mms_conversations: {
    start_conversation: CustomAction<{ 
      message: string,
      sender: string,
      enduserIds: string[],
      userIds: string[],
      phoneNumber: string,
      title: string,
    }, { conversation: GroupMMSConversation }>,
    send_message: CustomAction<{ 
      conversationId: string,
      message: string,
      sender: string,
    }, { conversation: GroupMMSConversation }>,
  },
  enduser_orders: {
    get_available_tests: CustomAction<{ zipCode?: string, teamId?: string }, { tests: VitalLabTest[] }>,
    create_smart_meter_order: CustomAction<{ enduserId: string, lines: SmartMeterOrderLineItem[], shipping?: string }, { order: EnduserOrder }>,
    create_lab_order: CustomAction<{ 
      enduserId: string,
      labTestId: string,
      physicianUserId?: string,
      teamId?: string, // for picking from multiple vital integrations
      activateBy?: string,
      aoe_answers?: VitalAOEAnswer[]
    }, { order: EnduserOrder }>,
    cancel_order: CustomAction<{ orderId: string }, { order?: EnduserOrder }>,
    create_go_go_meds_order: CustomAction<{ 
      enduserId: string,
      PrescriptionImage: string,
      title?: string,
    } & GoGoMedsPet, { order: EnduserOrder }>,
  },
  enduser_encounters: {
    create_candid_encounter: CustomAction<{ encounterId: string }, { encounter: EnduserEncounter }>,
  },
  enduser_eligibility_results: {
    develop_health_run_benefit_verification: CustomAction<DevelopHealthRunBenefitVerificationBaseArguments & { 
      enduserId: string,
      providerUserId: string,
      insuranceType?: string,
    }, { 
      result: EnduserEligibilityResult,
    }>, 
  },
  agent_records: {
    submit_support_ticket: CustomAction<{ priority: string, message: string }, { }>,
  },
  waitlists: {
    grant_access_from_waitlist: CustomAction<{ id: string, count: number }, { waitlist: Waitlist }>,
  },
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
    begin_login_flow: CustomAction<{ email?: string, phone?: string, redir?: string, businessId: string, organizationIds?: string[] }, { result: LoginFlowResult, email?: string }>,
    unsubscribe: CustomAction<{ enduserId: string, unsubscribeFrom: string[] }, { }>,
    get_otp_methods: CustomAction<{ token: string }, { methods: string[] }>,
    send_otp: CustomAction<{ token: string, method: string }, { }>,
    verify_otp: CustomAction<{ token: string, code: string }, { authToken: string, enduser: Enduser }>,
  },
  users: {
    begin_sso: CustomAction<{ provider: string, configurationId?: string }, { url: string }>,
    complete_sso: CustomAction<{ token: string }, { authToken: string, user: User }>,
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
      gender?: TellescopeGender,
      formId: string, 
      businessId: string,
      publicIdentifier?: string,
      state?: string,
      customTypeId?: string,
      skipMatch?: boolean,
      enduserId?: string,
      groupId?: string,
      // organizationIds?: string[]
    }, { accessCode: string, authToken: string, url: string, path: string, enduserId: string }>,
    // portalURL defined when needing to redirect to portal (e.g. for Form Group)
  },
  calendar_events: {
    session_for_join_link: CustomAction<{ token: string }, { authToken: string, eventId: string }>,
    session_for_start_link: CustomAction<{ token: string }, { authToken: string, eventId: string }>,
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
        restrictedByState?: boolean,
        userTags?: string[],
        userFilterTags?: string[],
      }, 
      { 
        appointmentBookingPage: AppointmentBookingPageClient,
        locations: AppointmentLocation[],
        calendarEventTemplates: CalendarEventTemplate[],
        products: Product[],
        userDisplayName?: string,
        userAvatar?: string,
        users?: UserClient[],
      }
    >,
  },
  sms_messages: {
    leave_message: CustomAction<{ businessId: string, fname: string, lname: string, phone: string, message: string }, { }>,
  },
  appointment_booking_pages: {
    validate_access_token: CustomAction<{ token: string, bookingPageId?: string }, { isValid: boolean }>,
  },
  managed_content_records: {
    load_unauthenticated: CustomAction<{ id: string }, { record: ManagedContentRecord }>, 
  }
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
      unique: [
        'email', 
        'externalId', 
        // 'devices.id' as any, { array: 'devices', itemKey: 'id', compareToOtherRecords: true }
      ],
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
      healthie_dietitian_id: { validator: stringValidator100 },
      mergedIds: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk, readonly: true, redactions: ['enduser'] },
      externalId: {
        validator: stringValidator250,
        examples: ['addfed3e-ddea-415b-b52b-df820c944dbb'],
      },
      email: { 
        validator: emailValidatorEmptyOkay,
        examples: ['test@tellescope.com'],
        redactions: ['enduser'],
      },
      unsubscribedFromMarketing: { validator: booleanValidator },
      alternateEmails: { validator: listValidatorOptionalOrEmptyOk(emailValidator), redactions: ['enduser'] },
      alternatePhones: { validator: listOfStringsValidatorEmptyOk, redactions: ['enduser'] },
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
        redactions: ['all'], // todo: add more redactions
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
      suffix: { 
        validator: stringValidator100,
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
        validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay,
      },
      accessTags: { 
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
        validator: listOfUniqueStringsValidatorEmptyOk,
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
      gender: { validator: tellescopeGenderValidator, redactions: ['enduser'] },
      height: { validator: genericUnitWithQuantityValidator, redactions: ['enduser'] },
      weight: { validator: genericUnitWithQuantityValidator, redactions: ['enduser'] },
      source: { validator: stringValidator1000Optional },
      addressLineOne: { validator: stringValidator5000EmptyOkay, redactions: ['enduser'] },
      addressLineTwo: { validator: stringValidator5000EmptyOkay, redactions: ['enduser'] },
      city: { validator: stringValidator5000EmptyOkay, redactions: ['enduser'] },
      state: { validator: stateValidator, redactions: ['enduser'] },
      zipCode: { validator: stringValidator25000EmptyOkay, redactions: ['enduser'] },
      zipPlusFour: { validator: stringValidator100, redactions: ['enduser'] },
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
      note: { validator: stringValidator25000EmptyOkay, redactions: ['enduser'] },
      insurance: { validator: insuranceOptionalValidator, redactions: ['enduser'] },
      insuranceSecondary: { validator: insuranceOptionalValidator, redactions: ['enduser'] },
      bookingNotes: {
        validator: listValidatorOptionalOrEmptyOk(objectValidator<{ bookingPageId: string, note: string }>({
          bookingPageId: mongoIdStringRequired,
          note: stringValidator5000EmptyOkay,
        })),
        redactions: ['enduser'],
      },
      devices: {
        validator: listValidatorOptionalOrEmptyOk(objectValidator<{ title: string, id: string, disabled?: boolean }>({
          title: stringValidatorOptional,
          id: stringValidatorOptional,
          disabled: booleanValidatorOptional,
        })),
        redactions: ['enduser'],
      },
      references: { validator: listOfRelatedRecordsValidator, updatesDisabled: true, redactions: ['enduser'] },
      athenaDepartmentId: { validator: stringValidator100, redactions: ['enduser'] },
      athenaPracticeId: { validator: stringValidator100, redactions: ['enduser'] },
      salesforceId: { validator: stringValidator100, redactions: ['enduser'] },
      vitalTriggersDisabled: { validator: booleanValidator },
      defaultFromPhone: { validator: phoneValidator, redactions: ['enduser'] },
      defaultFromEmail: { validator: emailValidator, redactions: ['enduser'] },
      useDefaultFromEmailInAutomations: { validator: booleanValidator },
      useDefaultFromPhoneInAutomations: { validator: booleanValidator },
      stripeCustomerId: { validator: stringValidator100, redactions: ['enduser'] },
      stripeKey: { validator: stringValidator250, redactions: ['enduser'] },
      diagnoses: {
        validator: listValidatorOptionalOrEmptyOk(enduserDiagnosisValidator),
        redactions: ['enduser']
      },
      unsubscribedFromPhones: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay, redactions: ['enduser'] },
      lockedFromPortal: { validator: booleanValidator },
      // recentMessagePreview: { 
      //   validator: stringValidator,
      // },
    }, 
    customActions: {
      rename_stored_custom_fields: {
        op: "custom", access: 'update', method: "patch",
        name: 'Rename Custom Field',
        path: '/endusers/rename-stored-custom-field',
        description: "Rename a stored custom field for every Enduser",
        parameters: { 
          existingName: { validator: stringValidator, required: true },
          newName: { validator: stringValidator, required: true },
        },
        returns: {},
      }, 
      customer_io_sync: {
        op: "custom", access: 'update', method: "post",
        name: 'Identify or Track via customer.io',
        path: '/customer-io/sync',
        description: "Identify or Track via customer.io",
        parameters: { 
          enduserIds: { validator: listOfMongoIdStringValidator, required: true },
          event: { validator: stringValidator },
          trackProperties: { validator: listOfStringsValidatorOptionalOrEmptyOk },
        },
        returns: {

        },
      }, 
      add_to_healthie_course: {
        op: "custom", access: 'update', method: "post",
        name: 'Add to Healthie Course (Program)',
        path: '/endusers/add-to-healthie-course',
        description: "Proxy for updateCourse mutation to add Enduser to Healthie Course",
        parameters: { 
          id: { validator: mongoIdStringValidator, required: true },
          courseId: { validator: stringValidator100, required: true },
        },
        returns: {},
      }, 
      check_eligibility: {
        op: "custom", access: 'update', method: "post",
        name: 'Check Eligibility',
        path: '/endusers/check-eligibility',
        description: "Checks insurance eligibility via Candid or Canvas integration",
        parameters: { 
          id: { validator: mongoIdStringValidator, required: true },
          integration: { validator: stringValidator },
          clearinghouse: { validator: stringValidator },
          insuranceType: { validator: exactMatchValidator<InsuranceType>(['Primary', 'Secondary']) },
          reCheck: { validator: booleanValidatorOptional },
        },
        returns: { 
          enduser: { validator: 'enduser' as any },
        } 
      },
      add_to_journey: {
        op: "custom", access: 'update', method: "post",
        name: 'Add to journey',
        path: '/add-endusers-to-journey',
        description: "Adds (or restarts) endusers in a journey",
        warnings: ["The maximum number of enduserIds per call is 1000 (the default size limit of all array fields)"],
        parameters: { 
          enduserIds: { validator: listOfMongoIdStringValidator, required: true },
          journeyId: { validator: mongoIdStringValidator, required: true },
          automationStepId: { validator: mongoIdStringValidator },
          journeyContext: { validator: journeyContextValidator },
          throttle: { validator: booleanValidatorOptional },
          source: { validator: stringValidatorOptional },
          startAt: { validator: dateValidatorOptional },
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
        parameters: { 
          invalidatePreviousToken: { validator: booleanValidator }, 
        },
        enduserOnly: true,
        returns: { 
          authToken: { validator: stringValidator, required: true }, 
          enduser: { validator: 'enduser', required: true }, 
        } as any // todo: add enduser eventually, when validator defined
      },
      generate_auth_token: {
        op: "custom", access: 'read', method: "get",
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
          destinations: { validator: listOfStringsValidatorOptionalOrEmptyOk, },
          externalIds: { validator: listOfStringsValidatorOptionalOrEmptyOk, },
        },
        returns: {
          fullscriptRedirectURL: { validator: stringValidator },
          vital_user_id: { validator: stringValidator },
        },
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
          customTypeId: { validator: stringValidator },
          updateAccessTags: { validator: booleanValidator },
          state: { validator: stateValidator },
        },
        returns: {
          updated: { validator: 'endusers' as any },
        },
      },
      bulk_assignment: {
        op: "custom", access: 'update', method: "patch",
        name: 'Bulk Assignment',
        path: '/endusers/bulk-assignment',
        description: "Add, remove, or replace care team members for endusers based on current assignment or custom field value",
        warnings: [
          'ids added by addIds are included before ids in removeIds are removed',
        ],
        parameters: {
          customTypeId: { validator: mongoIdStringValidator },
          addIds: { validator: listOfMongoIdStringValidator },
          removeIds: { validator: listOfMongoIdStringValidator },
          field: { validator: stringValidator },
          existingFieldValue: { validator: stringValidator },
          existingAssignment: { validator: listOfStringsWithQualifierValidatorOptional },
        },
        returns: {
          updated: { validator: 'endusers' as any },
        },
      },
      related_contacts_report: {
        op: "custom", access: 'read', method: "get",
        name: 'Related Contacts Report',
        path: '/endusers/related-contacts-report',
        description: "Builds a report about related contacts",
        parameters: {
          minimumRelationshipsCount: { validator: numberValidator },
        },
        returns: {
          report: { validator: listValidator(objectValidator<{ enduserId: string, count: number }>({ enduserId: stringValidator, count: numberValidator })), required: true }
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
          customTypeId: { validator: stringValidator100 }, // don't limit to objectId, allow 'All' to not filter, otherwise filter by default to patients
          range: { validator: dateRangeOptionalValidator },
          // mmddyyyyRangeField: { validator: stringValidator },
          fields: { 
            validator: listValidatorEmptyOk(objectValidator<{ field: string, value: string }>({ field: stringValidator, value: stringValidator })) 
          }
        },
        returns: {
          report: { validator: objectAnyFieldsAnyValuesValidator as any, required: true }
        },
      },
      get_engagement_statistics: {
        op: "custom", access: 'read', method: "get",
        name: 'Get Engagement Statistics',
        path: '/endusers/engagement',
        description: "Gets the number of active endusers over a period of time (only includes chats if enduserId is set). Uses default entity only by default",
        parameters: {
          formIds: { validator: listOfStringsValidatorOptionalOrEmptyOk },
          range: { validator: dateRangeOptionalValidator },
          customTypeId: { validator: mongoIdStringOptional },
          enduserFields: { 
            validator: listValidatorEmptyOk(objectValidator<{ field: string, value: string }>({ field: stringValidator, value: stringValidator })) 
          },
          endusersFilter: { validator: objectAnyFieldsAnyValuesValidator },
          groupBy: { validator: stringValidator },
          includeLinkClicks: { validator: booleanValidator },
        },
        returns: {
          count: { validator: numberValidator, required: true },
          grouped: { validator: objectAnyFieldsAnyValuesValidator as any, },
        },
      },
      get_engagement_statistics_by_userId: {
        op: "custom", access: 'read', method: "get",
        name: 'Get Engagement Statistics',
        path: '/endusers/engagement-by-userid',
        description: "Gets the number of active endusers over a period of time (only includes chats if enduserId is set). Uses default entity only by default. Groups by userId as submitter of form responses or recipient of messages.",
        parameters: {
          formIds: { validator: listOfStringsValidatorOptionalOrEmptyOk },
          range: { validator: dateRangeOptionalValidator },
          customTypeId: { validator: mongoIdStringOptional },
          enduserFields: { 
            validator: listValidatorEmptyOk(objectValidator<{ field: string, value: string }>({ field: stringValidator, value: stringValidator })) 
          },
          endusersFilter: { validator: objectAnyFieldsAnyValuesValidator },
          includeLinkClicks: { validator: booleanValidator },
        },
        returns: {
          count: { validator: numberValidator, required: true },
          grouped: { validator: objectAnyFieldsAnyValuesValidator as any, },
        },
      },
      sync_zendesk: {
        op: 'custom', access: 'read', method: 'post',
        path: '/endusers/sync-zendesk',
        name: 'Sync historical Zendesk tickets for a given enduser',
        description: "", 
        parameters: { enduserId: { validator: mongoIdStringValidator, required: true } },
        returns: { }
      },
      get_journeys_report: {
        op: 'custom', access: 'read', method: 'post', 
        path: '/endusers/journeys-report',
        name: 'Get journeys report',
        description: "", 
        parameters: { journeyId: { validator: mongoIdStringValidator } },
        returns: { 
          report: { validator: objectAnyFieldsAnyValuesValidator, required: true }
        }
      },
      dosespot: {
        op: 'custom', access: 'read', method: 'post', 
        path: '/endusers/dosespot',
        name: 'Open in DoseSpot',
        description: "Upserts patient to DoseSpot and opens a deep-link in DoseSpot", 
        parameters: { enduserId: { validator: mongoIdStringValidator } },
        returns: { link: { validator: stringValidator } }
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
          redir: { validator: stringValidator },
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
      get_otp_methods: {
        op: "custom", access: 'read', method: "get",
        name: 'Get OTP Methods',
        path: '/endusers/otp-methods',
        description: "Gets a list of possible OTP methods (e.g. email or sms) to refresh a given enduser session token",
        parameters: { 
          token: { validator: stringValidator, required: true },
        },
        returns: { 
          methods: { validator: listOfStringsValidator, required: true },
        },
      }, 
      send_otp: {
        op: "custom", access: 'create', method: "post",
        name: 'Send OTP Code',
        path: '/endusers/send-otp-code',
        description: "Sends a otp code for a given method (e.g. email or sms)",
        parameters: { 
          token: { validator: stringValidator, required: true },
          method: { validator: stringValidator, required: true },
        },
        returns: { },
      }, 
      verify_otp: {
        op: "custom", access: 'create', method: "post",
        name: 'Verify Code',
        path: '/endusers/verify-otp-code',
        description: "For a valid OTP code, returns an enduser session",
        parameters: { 
          token: { validator: stringValidator, required: true },
          code: { validator: stringValidator, required: true },
        },
        returns: { 
          authToken: { validator: stringValidator, required: true },
          enduser: { validator: 'enduser' as any, required: true },
        },
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
      unique: [], relationship: [], access: [{ type: CREATOR_ONLY_ACCESS }] 
    },
    defaultActions: DEFAULT_OPERATIONS,
    enduserActions: { proxy_read: {} },
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
      createEndusersForUnrecognizedSenders: { validator: booleanValidator },
      calendars: { validator: listOfStringsValidatorOptionalOrEmptyOk },
      environment: { validator: stringValidator100 },
      webhooksSecret: { validator: stringValidator },
      shouldCreateNotifications: { validator: booleanValidator },
      disableEnduserAutoSync: { validator: booleanValidator },
      disableTicketAutoSync: { validator: booleanValidator },
      redactExternalEvents: { validator: booleanValidator },
      syncEnduserFiles: { validator: booleanValidator },
      pushCalendarDetails: { validator: booleanValidator },
      defaultAttendeeId: { validator: mongoIdStringValidator },
      sendEmailOnSync: { validator: booleanValidator },
      enduserFieldMapping: { validator: fieldMappingsValidator },
      default_dietitian_id: { validator: stringValidator100 },
      dontPushCalendarEvent: { validator: booleanValidator },
      dontPullCalendarEvent: { validator: booleanValidator },
      pushAddedTags: { validator: booleanValidator },
      pushRemovedTags: { validator: booleanValidator },
    },
    customActions: {
      update_zoom: {
        adminOnly: true,
        op: 'custom', access: 'create', method: 'post',
        path: '/integrations/zoom-configuration',
        name: 'Creates (include clientId, clientSecret) or removes a Zoom configuration',
        description: "", 
        parameters: {
          clientId: { validator: stringValidator },
          clientSecret: { validator: stringValidator },
        },
        returns: { }
      },
      proxy_read: {
        op: 'custom', access: 'read', method: 'get',
        path: '/integrations/proxy-read',
        name: 'Proxies a request for a given integration and returns the result',
        description: "", 
        parameters: {
          integration: { validator: stringValidator, required: true },
          type: { validator: stringValidator, required: true },
          id: { validator: stringValidator },
          query: { validator: stringValidator },
        },
        returns: { 
          data: { validator: optionalAnyObjectValidator, required: true },
        }
      },
      generate_google_auth_url: {
        op: 'custom', access: 'create', method: 'post',
        path: '/generate-google-auth-url',
        name: 'Generates a link to create a Google integration with Tellescope',
        description: "", 
        parameters: {
          calendarOnly: { validator: booleanValidatorOptional },
        },
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
        op: 'custom', access: 'create', method: 'post',
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
        description: "", 
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
        returns: { integration: { validator: 'integration' as any, required: true } }
      },
      disconnect_elation: {
        op: 'custom', access: 'create', method: 'post', adminOnly: true,
        path: '/integrations/disconnect-elation',
        name: 'Disconnect Elation',
        description: "", 
        parameters: {},
        returns: { }
      },
      connect_zendesk: {
        op: 'custom', access: 'create', method: 'post', adminOnly: true,
        path: '/integrations/configure-zendesk',
        name: 'Configure Zendesk',
        description: "", 
        parameters: {
          adminAPIKey: { validator: stringValidator, required: true },
          apiKeyEmail: { validator: emailValidator, required: true },
          clientId: { validator: stringValidator, required: true },
          clientSecret: { validator: stringValidator, required: true },
          subdomain: { validator: stringValidator, required: true },
        },
        returns: { }
      },
      disconnect_zendesk: {
        op: 'custom', access: 'create', method: 'post', adminOnly: true,
        path: '/integrations/remove-zendesk-configuration',
        name: 'Remove Zendesk Configuration',
        description: "", 
        parameters: { },
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
          environment: { validator: stringValidator },
          externalId: { validator: stringValidator },
          webhooksSecret: { validator: stringValidator },
          fields: { validator: objectAnyFieldsAnyValuesValidator as any },
          scope: { validator: stringValidator },
        },
        returns: { integration: { validator: 'integration' as any } }
      },
      remove_api_key_integration: {
        op: 'custom', access: 'delete', method: 'delete',
        path: '/integrations/remove-api-key',
        name: 'Remove an API-Key based integration',
        description: "", 
        parameters: {
          integration: { validator: stringValidator, required: true },
          externalId: { validator: stringValidator },
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
      load_payers: {
        op: "custom", access: 'read', method: "get",
        path: '/integrations/load-payers',
        name: 'Load Payers',
        description: "Loads insurer options for Insurance question type, pulling from integrations like Canvas/Candid",
        parameters: { 
          integration: { validator: stringValidator },
          offset: { validator: nonNegNumberValidator },
          limit: { validator: nonNegNumberValidator },
          query: { validator: stringValidator },
          next_page_token: { validator: stringValidator },
        },
        returns: {
          choices: { 
            validator: listValidator(objectValidator<{ name: string, id: string }>({ name: stringValidator, id: stringValidator})),
            required: true,
          },
          next_page_token: { validator: stringValidator }
        },
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
      archivedAt: { validator: dateOptionalOrEmptyStringValidator },
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
        validator: stringValidator1000,
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
      tags: { validator: listOfStringsValidatorOptionalOrEmptyOk },
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
          destination: { validator: stringValidator },
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
          evaluate: ({ enduserId, logOnly, isMarketing, alternateToAddress }, deps, _, method) => {
            const e = deps[enduserId ?? ''] as Enduser

            // include before logOnly return for test-coverage purposes
            if (isMarketing && e.unsubscribedFromMarketing) return "Unsubscribed from marketing"

            if (logOnly === true) return
            if (method === 'update') return

            if (!e) return // not in cache, permit by default, likely during an update
            if (!e?.email && !alternateToAddress) return "Missing email"
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
      markedUnreadForAll: { validator: booleanValidator },
      inboxStatus: { validator: stringValidator100 },
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
      hiddenForAll: { validator: booleanValidator },
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
      batchId: { validator: stringValidator250 }, 
      isMarketing: { validator: booleanValidator },
      assignedTo: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
      canvasId: { validator: stringValidator100 },
      discussionRoomId: { validator: mongoIdStringValidator },
      journeyId: { validator: mongoIdStringValidator },
      calendarEventId: { validator: mongoIdStringValidator },
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
      deliver_via_iterable: {
        op: "custom", access: 'create', method: "post", 
        name: 'Send Email via Iterable',
        path: '/emails/deliver-via-iterable',
        description: "Sends an email via Iterable",
        parameters: { 
          recipientEmail: { validator: emailValidator, required: true },
          campaignId: { validator: stringValidator, required: true },
        },
        returns: { } 
      },
      send_with_template: {
        op: "custom", access: 'create', method: "post", 
        name: 'Send Email via Template',
        path: '/emails/send-with-template',
        description: "Sends an email for a specific template on behalf of a user (senderId is user.id)",
        parameters: { 
          enduserId: { validator: mongoIdStringValidator, required: true },
          senderId: { validator: mongoIdStringValidator, required: true },
          templateId: { validator: mongoIdStringValidator, required: true },
        },
        returns: { email: { validator: 'email' as any } } 
      },
      get_template_report: {
        op: "custom", access: 'read', method: "get",
        name: 'Template Report',
        path: '/emails/template-report',
        description: "Builds a report showing Email details by template",
        parameters: {
          range: { validator: dateRangeOptionalValidator },
        },
        returns: {
          report: { validator: objectAnyFieldsAnyValuesValidator as any, required: true }
        },
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
      send_with_template: {
        op: "custom", access: 'create', method: "post", 
        name: 'Send SMS via Template',
        path: '/sms-messages/send-with-template',
        description: "Sends an sms for a specific template on behalf of a user (senderId is user.id)",
        parameters: { 
          enduserId: { validator: mongoIdStringValidator, required: true },
          senderId: { validator: mongoIdStringValidator, required: true },
          templateId: { validator: mongoIdStringValidator, required: true },
          fromNumber: { validator: phoneValidator },
        },
        returns: { sms: { validator: 'sms_message' as any } } 
      },
      get_number_report: {
        op: "custom", access: 'read', method: "get",
        name: 'Number Report',
        path: '/sms-messages/number-report',
        description: "Builds a report showing sms details by organization and user phone numbers",
        parameters: {
          range: { validator: dateRangeOptionalValidator },
        },
        returns: {
          report: { validator: objectAnyFieldsAnyValuesValidator as any, required: true }
        },
      },
      get_template_report: {
        op: "custom", access: 'read', method: "get",
        name: 'Template Report',
        path: '/sms-messages/template-report',
        description: "Builds a report showing sms details by template",
        parameters: {
          range: { validator: dateRangeOptionalValidator },
        },
        returns: {
          report: { validator: objectAnyFieldsAnyValuesValidator as any, required: true }
        },
      },
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
          evaluate: ({ enduserPhoneNumber, enduserId, logOnly }, deps, _) => {
            if (logOnly === true) return

            const e = deps[enduserId ?? ''] as Enduser
            if (!e) return // not in cache, permit by default, likely during an update
            if (!e.phone && !enduserPhoneNumber) return "Missing phone"
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
      autoResolveToFrom: { validator: booleanValidator },
      markedUnreadForAll: { validator: booleanValidator },
      inboxStatus: { validator: stringValidator100 },
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
        // allow updates to support moving across profiles
        // updatesDisabled: true
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
      hiddenForAll: { validator: booleanValidator },
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
      batchId: { validator: stringValidator250 }, 
      assignedTo: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
      canvasId: { validator: stringValidator100 },
      discussionRoomId: { validator: mongoIdStringValidator },
      journeyId: { validator: mongoIdStringValidator },
      calendarEventId: { validator: mongoIdStringValidator },
      mediaURLs: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
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
      markedUnreadForAll: { validator: booleanValidator },
      inboxStatus: { validator: stringValidator100 },
      journeyId: { validator: mongoIdStringValidator },
      assignedTo: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
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
      discussionRoomId: { validator: mongoIdStringValidator },
      identifier: { validator: stringValidator100 },
      externalId: { validator: stringValidator100 },
      source: { validator: stringValidator100 },
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
      send_healthie_chat: {
        op: "custom", access: 'create', method: "post",
        name: 'Send Healthie Chat',
        path: '/chat-rooms/send-healthie-chat',
        description: "Marks the conversation read by the authenticated user",
        parameters: { 
          identifier: { validator: stringValidator100, required: true },
          templateId: { validator: mongoIdStringRequired, required: true },
          includeCareTeam: { validator: booleanValidator, required: true },
          enduserId: { validator: mongoIdStringRequired, required: true },
          journeyId: { validator: mongoIdStringRequired },
        },
        returns: { 
          room: { validator:  'Room' }, 
        } as any // add room eventually, when validator defined
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
      journeyId: { validator: mongoIdStringValidator },
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
      userId: {
        validator: mongoIdStringValidator,
        // don't use initializer to avoid setting userId by Admin API caller
        // initializer: (a, s) => s.type === 'user' ? s.id : undefined,
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
      hiddenForAll: { validator: booleanValidator },
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
      enduserId: { 
        validator: mongoIdStringOptional, 
        initializer: (_, s) => s.type === 'enduser' ? s.id : undefined
      },
      mentions: { validator: listOfMongoIdStringValidatorEmptyOk },
      canvasId: { validator: stringValidator100 },
      quote: { validator: listValidatorOptionalOrEmptyOk(stringValidator5000OptionalEmptyOkay) },
      sendAt: { validator: dateOptionalOrEmptyStringValidator },
      isDraft: { validator: booleanValidator },
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
        // unnecessary now do to other restrictions, should just be controlled by users.update access permission
        // remove to allow non-admin to update other users' availabilities, for example
        // {
        //   explanation: "Only admin users can update others' profiles",
        //   evaluate: ({ _id }, _, session) => {
        //     if (_id && _id.toString() === session.id) return
        //     if ((session as UserSession)?.roles?.includes('Admin')) return

        //     return "Only admin users can update others' profiles"
        //   }
        // }, 
        {
          explanation: "Only admin users can update tags when accessTags is enabled",
          evaluate: ({ _id }, _, session, method, { updates } ) => {
            if (session.type === 'user' && !session.eat) return // accessTags is not enabled
            if ((session as UserSession)?.roles?.includes('Admin')) return
            if (method === 'create') return
            if (!updates?.tags) return

            return "Only admin users can update tags when accessTags is enabled"
          }
        }, 
        {
          explanation: "Only admin users can update user email",
          evaluate: ({ roles }, _, session, method, { updates }) => {
            if ((session as UserSession)?.roles?.includes('Admin')) return // admin can do this
            if (method === 'create') return // create already admin restricted
            if (!updates?.email) return // roles not provided (empty array is blocked by validator)

            return "Only admin users can update user email"
          }
        }, 
        {
          explanation: "Only admin users can update user roles",
          evaluate: ({ roles }, _, session, method, { updates }) => {
            if ((session as UserSession)?.roles?.includes('Admin')) return // admin can do this
            if (method === 'create') return // create already admin restricted
            if (!updates?.roles) return // roles not provided (empty array is blocked by validator)

            return "Only admin users can update user roles"
          }
        }, 
        {
          explanation: "Only admin users can update user lockouts",
          evaluate: ({ _id }, _, session, method, { updates }) => {
            if (updates?.lockedOutUntil !== undefined && session.id === _id?.toString()) {
              return "Users cannot update own lock status"
            }
            if ((session as UserSession)?.roles?.includes('Admin')) return // admin can do this
            if (method === 'create') return // create already admin restricted
            if (updates?.lockedOutUntil === undefined) return // not provided

            return "Only admin users can update user lockouts"
          }
        }, 
        {
          explanation: "Only admin users can update doseSpotUserId",
          evaluate: ({ roles }, _, session, method, { updates }) => {
            if ((session as UserSession)?.roles?.includes('Admin')) return // admin can do this
            if (method === 'create') return // create already admin restricted
            if (!updates?.doseSpotUserId) return // doseSpotUserId not provided

            return "Only admin users can update doseSpotUserId"
          }
        }, 
        {
          explanation: "Only admin users can update requireSSO",
          evaluate: ({ roles }, _, session, method, { updates }) => {
            if ((session as UserSession)?.roles?.includes('Admin')) return // admin can do this
            if (method === 'create') return // create already admin restricted
            if (!updates?.requireSSO) return // requireSSO not provided

            return "Only admin users can update requireSSO"
          }
        }, 
        {
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
        name: 'Refresh user authentication',
        path: '/refresh-session',
        description: "When called by an authenticated user, generates a new session",
        parameters: { 
          invalidatePreviousToken: { validator: booleanValidator }, 
        },
        returns: { 
          authToken: { validator: stringValidator, required: true }, 
          user: { validator:  'user' }, 
        } as any // add enduser eventually, when validator defined
      },
      configure_MFA: {
        op: "custom", access: 'update', method: "post",
        name: 'Configure MFA',
        path: '/users/configure-mfa',
        description: "Configures MFA",
        parameters: { },
        returns: { 
          recoveryCodes: { validator: listOfStringsValidator, required: true },
          authToken: { validator: stringValidator, required: true }, 
          user: { validator: 'user' as any, required: true }, 
        } 
      },
      generate_MFA_challenge: {
        op: "custom", access: 'update', method: "post",
        name: 'Generate MFA Challenge',
        path: '/users/generate-mfa-challenge',
        description: "Begins the MFA verification process, e.g. by sending an email with a code",
        parameters: { 
          method: { validator: stringValidator100, required: true },
        },
        returns: { } 
      },
      submit_MFA_challenge: {
        op: "custom", access: 'update', method: "post",
        name: 'Submit MFA Challenge',
        path: '/users/submit-mfa-challenge',
        description: "Completes the MFA verification process and generates a new auth token",
        parameters: { 
          code: { validator: stringValidator100, required: true },
        },
        returns: { 
          authToken: { validator: stringValidator, required: true }, 
          user: { validator: 'user' as any, required: true }, 
        } 
      },
      get_engagement_report: {
        op: "custom", access: 'read', method: "get",
        name: 'Get Engagement Report',
        path: '/users/get-engagement-report',
        description: "Gets a report on engagement by care team",
        parameters: {
          range: { validator: dateRangeOptionalValidator },
          excludeAutomated: { validator: booleanValidator },
        },
        returns: { 
          report: { validator: objectAnyFieldsAnyValuesValidator, required: true },
        } 
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
      consent: {
        op: "custom", access: 'update', method: "patch",
        name: 'Consent to ToS / Privacy Policy',
        path: '/users/consent',
        description: "Stores consents",
        parameters: { 
          termsVersion: { validator: stringValidator, required: true }
        },
        returns: { 
          authToken: { validator: stringValidator, required: true },
          user: { validator: 'user' as any, required: true },
        },
      },
      get_users_for_groups: {
        op: "custom", access: 'read', method: "get",
        name: 'Get userIds for Group',
        path: '/users/group',
        description: "Loads all user ids for a given group",
        parameters: { 
          groups: { validator: listOfStringsValidator, required: true }
        },
        returns: { 
          userIds: { validator: listOfMongoIdStringValidator, required: true },
        },
      },
    },
    publicActions: {
      begin_sso: {
        op: "custom", access: 'read', method: "post",
        name: 'Begin SSO',
        path: '/users/begin-sso',
        description: "Begins an SSO login process for a specific user",
        parameters: { 
          provider: { validator: stringValidator, required: true },
          configurationId: { validator: mongoIdStringValidator }
        },
        returns: { 
          url: { validator: stringValidator, required: true },
        },
      },
      complete_sso: {
        op: "custom", access: 'read', method: "post",
        name: 'Complete SSO',
        path: '/users/complete-SSO',
        description: "For a valid token generated by SSO, authenticate",
        parameters: { 
          token: { validator: stringValidator, required: true },
        },
        returns: { 
          authToken: { validator: stringValidator, required: true },
          user: { validator: 'user' as any, required: true },
        },
      },
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
      defaultLocationId: { validator: mongoIdStringValidator },
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
        validator: listOfStringsValidator, // important that this doesn't allow empty roles (would grant default permissions which may be higher)
        // unredacted March 1, 2024 -- useful for filtering scheduling and/or care team display for enduser by role
        // redactions: ['enduser'],
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
      hashedPass: {
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
      tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, 
      emailSignature: { validator: stringValidator1000 },
      disableTicketAutoAssignment: { validator: booleanValidator },
      ticketAssignmentPriority: { validator: nonNegNumberValidator },
      specialties: { validator: listOfStringsValidatorOptionalOrEmptyOk }, 
      bio: { validator: stringValidator25000EmptyOkay }, 
      TIN: { validator: stringValidatorOptionalEmptyOkay },
      NPI: { validator: stringValidatorOptionalEmptyOkay },
      DEA: { validator: stringValidatorOptionalEmptyOkay },
      voicemailPlayback: { validator: phonePlaybackValidatorOptional },
      lockedOutUntil: { validator: numberValidator },
      iOSBadgeCount: { validator: nonNegNumberValidator },
      availableFromNumbers: { validator: listOfStringsValidatorEmptyOk },
      availableFromEmails: { validator: listOfStringsValidatorEmptyOk },
      doseSpotUserId: { validator: stringValidator100 },
      url: { validator: stringValidator1000 },
      templateFields: {
        validator: listValidatorOptionalOrEmptyOk(objectValidator<LabeledField>({
          field: stringValidator100,
          value: stringValidator5000,
        }))
      },
      canvasId: { validator: stringValidator100 },
      medplumId: { validator: stringValidator100 },
      dashboardView: { validator: customDashboardViewValidator },
      hideFromCalendarView: { validator: booleanValidator },
      requireSSO: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
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
          message: { validator: stringValidator },
        },
      },
    },
    fields: {
      ...BuiltInFields, 
      archivedAt: { validator: dateOptionalOrEmptyStringValidator },
      mmsAttachmentURLs: { validator: listOfUniqueStringsValidatorEmptyOk }, 
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
      isMarketing: { validator: booleanValidator },
      hideFromCompose: { validator: booleanValidator },
      forChannels: { validator: listOfStringsValidatorEmptyOk }, 
      forRoles: { validator: listOfStringsValidatorEmptyOk }, 
      forEntityTypes: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, 
      tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, 
    },
  },
  files: {
    info: {},
    constraints: { unique: [], relationship: [] },
    defaultActions: { read: {}, readMany: {}, update: {}, delete: {} },
    enduserActions: { prepare_file_upload: {}, confirm_file_upload: {}, file_download_URL: {}, read: {}, readMany: {}, delete: {}, update: { } /* allow to hide from client side */ },
    fields: {
      ...BuiltInFields, 
      tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, 
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
      isCalledOut: { validator: booleanValidator },
      externalId: {
        validator: stringValidator250,
        examples: ['addfed3e-ddea-415b-b52b-df820c944dbb'],
      },
      publicRead: { validator: booleanValidator, readonly: true },
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
          isCalledOut: { validator: booleanValidator },
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
          externalId: { validator: stringValidator100 },
          hiddenFromEnduser: { validator: booleanValidator },
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
          preferInBrowser: { validator: booleanValidator },
        },
        returns: { 
          downloadURL: { validator: stringValidator250, required: true },
          name: { validator: stringValidator100, required: true },
        },
      },
      run_ocr: {
        op: "custom", access: 'read', method: "post",
        name: 'Run OCR (Docsumo)',
        path: '/files/ocr',
        description: "Runs optical character recognition on a document (currently Docsumo when integrated)",
        parameters: { 
          id: { validator: mongoIdStringRequired, required: true },
          type: { validator: stringValidator100, required: true },
        },
        returns: { 
          file: { validator: 'file' as any, required: true },
        },
      },
      confirm_file_upload: {
        op: "custom", access: 'create', method: "post",
        name: 'Confirm File Upload',
        path: '/files/confirm-upload',
        description: "Triggers file create side effects / webhooks to be called after client-side upload is complete",
        parameters: { 
          id: { validator: mongoIdStringRequired, required: true },
        },
        returns: { },
      },
      send_fax: {
        op: "custom", access: 'create', method: "post",
        name: 'Send Fax (via mFax integration)',
        path: '/files/send-fax',
        description: "Sends a fax via mFax to the destination number",
        parameters: { 
          id: { validator: mongoIdStringRequired, required: true },
          recipientFaxNumber: { validator: phoneValidator, required: true },
        },
        returns: { },
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
      assign_from_queue: {
        op: "custom", access: 'update', method: "patch",
        name: 'Assign From Queue',
        path: '/tickets/assign-from-queue',
        description: "Takes a specific ticket (or next available) from a queue and assigns to the caller of this endpoint",
        parameters: { 
          userId: { validator: mongoIdStringValidator },
          ticketId: { validator: mongoIdStringValidator },
          queueId: { validator: mongoIdStringValidator },
          overrideRestrictions: { validator: booleanValidator },
        },
        returns: {
          ticket: { validator: 'ticket' as any, required: true },
          queue: { validator: 'ticket_queue' as any, required: true },
          enduser: { validator: 'enduser' as any, required: true },
        },
      },
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
        op: "custom", access: 'read', method: "all",
        name: 'Get Report',
        path: '/tickets/report',
        description: "Gets aggregate data for building a report on tickets",
        parameters: { 
          userId: { validator: mongoIdStringOptional },
          title: { validator: stringValidator25000 },
          titles: { validator: listOfStringsValidatorEmptyOk },
          range: { validator: dateRangeOptionalValidator },
          rangeField: { validator: stringValidator },
          groupByOwnerAndTitle: { validator: booleanValidator },
        },
        returns: {
          report: { validator: objectAnyFieldsAnyValuesValidator as any, required: true }
        },
      },
      get_distribution_report: {
        op: "custom", access: 'read', method: "all",
        name: 'Get Report',
        path: '/tickets/distribution-report',
        description: "Gets aggregate data for a report on ticket distributions",
        parameters: { 
          range: { validator: dateRangeOptionalValidator },
        },
        returns: {
          report: { validator: objectAnyFieldsAnyValuesValidator as any, required: true }
        },
      },
      close_ticket: {
        op: "custom", access: 'read', method: "post",
        name: 'Close Ticket',
        path: '/tickets/close',
        description: "Closes a ticket and returns any resulting tickets for a current journey",
        parameters: { 
          ticketId: { validator: mongoIdStringValidator },
          closedForReason: { validator: stringValidator },
        },
        returns: {
          updated: { validator: 'ticket' as any, required: true },
          generated: { validator: 'ticket' as any },
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
      closeReasons: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
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
      htmlDescription: { validator: stringValidator100000OptionalEmptyOkay }, // keep consistent with createTicket action
      formResponseIds: { validator: listOfStringsValidatorEmptyOk },
      actions: { validator: ticketActionsValidator },
      closeOnFinishedActions: { validator: booleanValidator },
      remindAt: { validator: dateOptionalOrEmptyStringValidator },
      reminderSilencedAt: { validator: dateOptionalOrEmptyStringValidator },
      relatedRecords: { validator: listValidatorOptionalOrEmptyOk(relatedRecordValidator) },
      attachments: { validator: listOfChatAttachmentsValidator },
      snoozes: { validator: ticketSnoozesValidator },
      requireConfirmation: { validator: booleanValidator },
      queueId: { validator: mongoIdStringValidator }, // required for worker to be able to add ticket to queue
      reminders: { validator: listValidatorEmptyOk(ticketReminderValidator) }, // expose at least for testing
      nextReminderInMS: {
        validator: numberValidator,
        readonly: true,
        initializer: get_next_reminder_timestamp_for_ticket,
      },
      references: { validator: listOfRelatedRecordsValidator, readonly: true },
      calendarEventId: { validator: mongoIdStringValidator },
      observationId: { validator: mongoIdStringValidator },
      phoneCallId: { validator: mongoIdStringValidator },
      smsId: { validator: mongoIdStringValidator },
      emailId: { validator: mongoIdStringValidator },
      orderId: { validator: mongoIdStringValidator },
      tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
      restrictByState: { validator: stateValidator },
      restrictByTags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
      restrictByTagsQualifier: { validator: listQueryQualifiersValidator },
      archiveReason: { validator: stringValidator },
      contextFormIds: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk },
      contextEnduserFields: { validator: listOfUniqueStringsValidatorEmptyOk },
      isTodo: { validator: booleanValidator },
      databaseRecordId: { validator: mongoIdStringValidator },
      databaseRecordCreator: { validator: mongoIdStringValidator },
      triggerFileId: { validator: mongoIdStringValidator },
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
      hiddenFromTimeline: { validator: booleanValidator },
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
      discussionRoomId: { validator: mongoIdStringValidator },
      source: { validator: stringValidator },
      externalId: { validator: stringValidator },
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
    enduserActions: { read: {}, readMany: {} },
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
      archivedAt: { validator: dateOptionalOrEmptyStringValidator },
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
      intakeGender: { validator: intakeDateOfBirthValidator },
      intakeGenderIsSex: { validator: booleanValidator },
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
      customTypeIds: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk },
      lockResponsesOnSubmission: { validator: booleanValidatorOptional },
      tags: { validator: listOfStringsValidatorOptionalOrEmptyOk },
      language: { validator: stringValidator },
      isNonVisitElationNote: { validator: booleanValidator },
      elationVisitNotePractitionerIds: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
      elationVisitNoteType: { validator: stringValidator100 },
      publicShowLanguage: { validator: booleanValidator },
      publicShowDownload: { validator: booleanValidator },
      canvasId: { validator: stringValidator100 },
      canvasQuestionId: { validator: stringValidator100 },
      syncToOLH: { validator: booleanValidator }, 
      syncWithResponsesFromFormIds: { validator: listOfUniqueStringsValidatorEmptyOk },
      scoresSync: {
        validator: listValidatorOptionalOrEmptyOk(objectValidator<{ score: string, externalId: string }>({ 
          score: stringValidator100,
          externalId: stringValidator100,
        }))
      },
      hideAfterUnsubmittedInMS: { validator: numberValidator },
      hideFromCompose: { validator: booleanValidator },
      enduserFieldsToAppendForSync: { validator: listOfUniqueStringsValidatorEmptyOk },
      allowPortalSubmission: { validator: booleanValidator },
      canvasNoteCoding: { validator: canvasCodingValidatorOptional },
      syncToCanvasAsDataImport: { validator: booleanValidator },
      matchCareTeamTagsForCanvasPractitionerResolution: { validator: listOfStringsWithQualifierValidatorOptionalValuesEmptyOkay },
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
          databaseId: { validator: mongoIdStringValidator, required: false },
        },
        returns: {
          choices: { validator: 'database_records' as any, required: true }
        },
      },
      booking_info: {
        op: "custom", access: 'read', method: "get",
        path: '/form-fields/booking-info',
        name: 'Load Appointment Booking Info',
        description: "Loads necessary information for rendering an Appointment Booking field",
        parameters: { 
          enduserId: { validator: mongoIdStringValidator },
          bookingPageId: { validator: mongoIdStringValidator, required: true },
          enduserFields: {
            validator: objectValidator<BookingInfoEnduserFields>({
              state: stateValidatorOptional,
            }, { isOptional: true, emptyOk: true })
          }
        },
        returns: {
          warningMessage: { validator: stringValidator },
          bookingURL: { validator: stringValidator, required: true },
          entropy: { validator: stringValidator, required: true },
        },
      },
    },
    enduserActions: { read: {}, readMany: {}, load_choices_from_database: {}, booking_info: {} },
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
        validator: stringValidatorOptionalEmptyOkay,
        required: true,
        examples: ["Text"],
        initializer: () => '',
      }, 
      headerText: { validator: stringValidator250 },
      placeholder: { validator: stringValidatorOptional },
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
      description: { validator: stringValidator25000EmptyOkay }, 
      htmlDescription: { validator: stringValidator25000EmptyOkay }, 
      intakeField: { validator: stringValidator5000EmptyOkay }, // todo: ensure built-ins are ignored
      isOptional: { validator: booleanValidator },
      fullZIP: { validator: booleanValidator },
      isInGroup: { validator: booleanValidator },
      externalId: { validator: stringValidator100 },
      sharedWithEnduser: { validator: booleanValidator },
      calloutConditions: { validator: formFieldCalloutConditionsValidator },
      highlightOnTimeline: { validator: booleanValidator },
      prepopulateFromFields: { validator: booleanValidator },
      prepopulateFromDatabase: {
        validator: objectValidator<FormField['prepopulateFromDatabase']>({
          databaseId: mongoIdStringOptional, 
          field: stringValidatorOptionalEmptyOkay,
          overwrite: booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true })
      },
      disabledWhenPrepopulated: { validator: booleanValidator },
      feedback: { validator: listValidatorOptionalOrEmptyOk(formFieldFeedbackValidator) },
      titleFontSize: { validator: nonNegNumberValidator },
      groupShowCondition: { validator: objectAnyFieldsAnyValuesValidator },
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
      discussionRoomId: { validator: mongoIdStringValidator },
      hiddenFromTimeline: { validator: booleanValidator },
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
      },
      publicSubmit: { validator: booleanValidator },
      submittedBy: { validator: stringValidator250 },
      submittedByIsPlaceholder: { validator: booleanValidator },
      accessCode: { validator: stringValidator250 },
      userEmail: { validator: emailValidator },
      submittedAt: { validator: dateValidator },
      formTitle: { validator: stringValidator250 },  
      responses: { validator: formResponsesValidator },
      draftSavedAt: { validator: dateValidator },
      draftSavedBy: { validator: mongoIdStringValidator },
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
      carePlanId: { validator: mongoIdStringValidator },
      context: { validator: stringValidator1000 },
      calendarEventId: { validator: mongoIdStringValidator },
      references: { validator: listOfRelatedRecordsValidator, readonly: true },
      groupId: { validator: mongoIdStringValidator },
      instanceId: { validator: stringValidator100 },
      groupPosition: { validator: nonNegNumberValidator },
      hideAfterUnsubmittedInMS: { validator: numberValidator },
      addenda: { 
        validator: listValidatorOptionalOrEmptyOk(objectValidator<Addendum>({ 
          text: stringValidator25000EmptyOkay,
          timestamp: dateValidator,
          userId: mongoIdStringRequired,
        }))
      },
      followups: { 
        validator: listValidatorOptionalOrEmptyOk(objectValidator<FormResponseFollowup>({ 
          formId: mongoIdStringRequired,
          formResponseId: mongoIdStringOptional,
          completedAt: dateValidatorOptional,
        }))
      },
      canvasEncounterId: { validator: stringValidator100 },
      pushedToPortalAt: { validator: dateValidatorOptional },
    },
    defaultActions: DEFAULT_OPERATIONS,
    enduserActions: { 
      prepare_form_response: {}, info_for_access_code: {}, submit_form_response: {}, stripe_details: {}, chargebee_details: {},
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
          carePlanId: { validator: mongoIdStringValidator },
          calendarEventId: { validator: mongoIdStringValidator },
          context: { validator: stringValidator1000 },
          groupId: { validator: mongoIdStringValidator },
          instanceId: { validator: stringValidator100 },
          groupPosition: { validator: nonNegNumberValidator },
        },
        returns: {
          accessCode: { validator: stringValidator250, required: true },
          url: { validator: stringValidator250, required: true },
          response: { validator: 'form_response' as any, required: true },
          fullURL: { validator: stringValidator250, required: true },
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
          addedResponses: { validator: formResponsesValidator }
        },
        returns: { },
      },
      save_field_response: {
        op: "custom", access: 'update', method: "patch",
        name: 'Save Field Response',
        path: '/save-field-response',
        description: "With an accessCode, includes the answer to an individual field in a partial form response.",
        parameters: { 
          formResponseId: { validator: mongoIdStringValidator },
          accessCode: { validator: stringValidator250 },
          response: { validator: formResponseValidator },
          responses: { validator: listValidatorOptionalOrEmptyOk(formResponseValidator) },
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
          utm: { validator: labeledFieldsValidator },
        },
        returns: {
          formResponse: 'form response' as any,
          nextFormGroupPublicURL: { validator: stringValidator },
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
          isCheckout: { validator: booleanValidator },
        },
      },
      chargebee_details: {
        op: "custom", access: 'read', method: "get",
        name: 'Chargebee details for form field',
        path: '/form-responses/chargebee-details',
        description: "Gets the relevant information for a Chargebee field",
        parameters: { 
          fieldId: { validator: mongoIdStringValidator, required: true },
        },
        returns: {
          url: { validator: stringValidator, required: true },
        },
      },
      get_report: {
        op: "custom", access: 'read', method: "all", // backwards compatible for GET but supports post for larger data posting
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
          includeIds: { validator: booleanValidator },
        },
        returns: {
          report: { validator: objectAnyFieldsAnyValuesValidator as any, required: true }
        },
      },
      get_related_forms_report: {
        op: "custom", access: 'read', method: "all", // backwards compatible for GET but supports post for larger data posting
        name: 'Related Forms Report',
        path: '/form-responses/related-forms-report',
        description: "Builds a report on related forms (parent-child)",
        parameters: {
          formIds: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk },
          submittedAtRange: { validator: dateRangeOptionalValidator },
          childSubmittedAtRange: { validator: dateRangeOptionalValidator },
          answers: { validator: listOfStringsValidatorOptionalOrEmptyOk },
          groupBy: { validator: stringValidator },
          enduserFilter: { validator: objectAnyFieldsAnyValuesValidator },
        },
        returns: {
          report: { validator: objectAnyFieldsAnyValuesValidator as any, required: true }
        },
      },
      get_enduser_statistics: {
        op: "custom", access: 'read', method: "all",
        name: 'Get Enduser Statistics',
        path: '/form-responses/enduser-statistics',
        description: "Get statistics on the number of *unique* endusers who have submitted forms",
        parameters: {
          formIds: { validator: listOfStringsValidatorOptionalOrEmptyOk },
          range: { validator: dateRangeOptionalValidator },
          customTypeId: { validator: mongoIdStringOptional },
          enduserFields: { 
            validator: listValidatorEmptyOk(objectValidator<{ field: string, value: string }>({ field: stringValidator, value: stringValidator })) 
          },
          endusersFilter: { validator: objectAnyFieldsAnyValuesValidator },
          groupBy: { validator: stringValidator },
          includeCalendarEventTemplateIds: { validator: listOfStringsValidatorOptionalOrEmptyOk },
        },
        returns: {
          count: { validator: numberValidator, required: true },
          grouped: { validator: objectAnyFieldsAnyValuesValidator as any, },
        },
      },
      get_enduser_statistics_by_submitter: {
        op: "custom", access: 'read', method: "all",
        name: 'Get Enduser Statistics By Submitter',
        path: '/form-responses/enduser-statistics-by-submitter',
        description: "Get statistics on the number of *unique* endusers who have submitted forms, grouped by form submitter ID",
        parameters: {
          formIds: { validator: listOfStringsValidatorOptionalOrEmptyOk },
          range: { validator: dateRangeOptionalValidator },
          customTypeId: { validator: mongoIdStringOptional },
          enduserFields: { 
            validator: listValidatorEmptyOk(objectValidator<{ field: string, value: string }>({ field: stringValidator, value: stringValidator })) 
          },
          endusersFilter: { validator: objectAnyFieldsAnyValuesValidator },
          includeCalendarEventTemplateIds: { validator: listOfStringsValidatorOptionalOrEmptyOk },
        },
        returns: {
          count: { validator: numberValidator, required: true },
          grouped: { validator: objectAnyFieldsAnyValuesValidator as any, },
        },
      },
      get_distribution_report: {
        op: "custom", access: 'read', method: "all",
        name: 'Get Distribution of Answers for Forms',
        path: '/form-responses/distribution-report',
        description: "Get statistics on the number of *unique* endusers who have submitted forms, grouped by form submitter ID",
        parameters: {
          formIds: { validator: listOfStringsValidatorOptionalOrEmptyOk, required: true },
          submittedAtRange: { validator: dateRangeOptionalValidator, required: true },
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
          enduserId: { validator: mongoIdStringValidator },
          email: { validator: emailValidator },
          dateOfBirth: { validator: stringValidator100 },
          phone: { validator: phoneValidator },
          fname: { validator: nameValidator },
          lname: { validator: nameValidator },
          gender: { validator: tellescopeGenderValidator },
          publicIdentifier: { validator: stringValidator },
          state: { validator: stateValidator },
          customTypeId: { validator: stringValidator },
          skipMatch: { validator: booleanValidator },
          groupId: { validator: mongoIdStringValidator },
        },
        returns: {
          accessCode: { validator: stringValidator250, required: true },
          authToken: { validator: stringValidator250, required: true },
          url: { validator: stringValidator250, required: true },
          path: { validator: stringValidator250, required: true },
          enduserId: { validator: mongoIdStringValidator, required: true },
        },
      },
    },
  },
  webhooks: {
    info: {
      description: `Allows you to subscribe to Webhooks when models in Tellescope are created, updated, and deleted.

        To avoid echo (receiving webhooks when updating records with an API Key), pass the use { dontSendWebhook: true } in the "options" parameter to the update request

        Each webhook is a POST request to the given URL, of the form <pre>{ 
          model: string, 
          type: 'create' | 'update' | 'delete', 
          records: object[], 
          timestamp: string, 
          integrity: string, 
          relatedRecords: { [id: string]: object } 
}</pre>
        This includes the name of the model, the type of operation performed, and an array of the new, updated, or deleted model(s).

        <strong>Each 'create' webhook may include more than one record (e.g. when records are created as part of a bulk POST) </strong>

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
          enduserId: string, 
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
        description: "Sets the URL, secret, and initial subscriptions for your organization. Your secret must exceed 15 characters and should be generated randomly. This endpoint ensures duplicate webhook records aren't created.",
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
          enduserId: { validator: mongoIdStringValidator }, // can make required after initial updates to ensure worker uses this
          automationStepId: { validator: mongoIdStringValidator }, // can make required after initial updates to ensure worker uses this
          action: { validator: optionalAnyObjectValidator as any },
          context: { validator: journeyContextValidator },
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
      unique: ['startLinkToken'], 
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
          userIds: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk },
          to: { validator: dateValidator },
          limit: { validator: nonNegNumberValidator },
        },
        returns: { 
          events: { validator: 'calendar_events' as any, required: true }
        },
      },
      load_events: {
        op: "custom", access: 'read', method: "get",
        name: 'Load Events',
        path: '/calendar-events/load-events',
        description: "For loading Tellescope events across multiple users for a given time period",
        parameters: { 
          userIds: { validator: listOfStringsValidator, required: true },
          from: { validator: dateValidator, required: true },
          to: { validator: dateValidator, required: true },
          limit: { validator: nonNegNumberValidator },
          external: { validator: booleanValidator },
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
          "businessId is currently required when not authenticating as an Enduser (e.g. API key or unauthenticated requests)",
          "The limit parameter indicates the number of future calendar event conflicts to look up when determining availability. This defaults to a high value (500) and should only be reduced with caution.",
          "If restrictedByState, and authenticated as an enduser, state will be pulled from the enduser automatically. If state is not defined, will result in a 400 error",
          "If restrictedByState, and authenticated as a user (e.g. by API Key), you can provide state as a parameter",
        ],
        parameters: {  
          calendarEventTemplateId: { validator: mongoIdStringValidator, required: true },
          from: { validator: dateValidator, required: true },
          locationId: { validator: mongoIdStringValidator },
          restrictedByState: { validator: booleanValidator },
          state: { validator: stateValidator },
          multi: { validator: booleanValidator },
          to: { validator: dateValidator },
          limit: { validator: nonNegNumberValidator },
          businessId: { validator: mongoIdStringValidator }, // required for unauthenticated access
          userId: { validator: mongoIdStringValidator }, // required for unauthenticated access
          userIds: { validator: listOfMongoIdStringValidatorEmptyOk }, // required for unauthenticated access
          intervalInMinutes: { validator: nonNegNumberValidator },
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
          otherUserIds: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk },
          startTime: { validator: dateValidator, required: true },
          locationId: { validator: mongoIdStringValidator },
          rescheduledCalendarEventId: { validator: mongoIdStringValidator },
          bookingPageId: { validator: mongoIdStringValidator },
          agreedToTerms: { validator: appointmentTermsValidator },
          timezone: { validator: timezoneValidator },
          fields: { validator: objectAnyFieldsAnyValuesValidator },
          token: { validator: stringValidator },
          customerId: { validator: stringValidator100 },
          intervalInMinutes: { validator: nonNegNumberValidator },
          holdUntil: { validator: dateValidator },
          holdFormResponseId: { validator: mongoIdStringValidator },
          reason: { validator: stringValidator5000 },
          scheduledBy: { validator: mongoIdStringValidator },
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
          userId: { validator: stringValidator, required: true },
          calendarEventId: { validator: stringValidator },
          startTimeInMS: { validator: nonNegNumberValidator },
          durationInMinutes: { validator: nonNegNumberValidator },
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
          excludeAttendee: { validator: booleanValidator },
        },
        returns: { },
      },
      get_report: {
        op: "custom", access: 'read', method: "all",
        name: 'Report',
        path: '/calendar-events/report',
        description: "Builds a report",
        parameters: {
          range: { validator: dateRangeOptionalValidator },
          templateIds: { validator: listOfStringsValidatorOptionalOrEmptyOk },
          groupBy: { validator: stringValidator },
        },
        returns: {
          report: { validator: objectAnyFieldsAnyValuesValidator as any, required: true }
        },
      },
      get_enduser_report: {
        op: "custom", access: 'read', method: "all",
        name: 'Report',
        path: '/calendar-events/enduser-report',
        description: "Builds a report",
        parameters: {
          range: { validator: dateRangeOptionalValidator },
          templateIds: { validator: listOfStringsValidatorOptionalOrEmptyOk },
          groupBy: { validator: stringValidator },
          enduserGroupBy: { validator: stringValidator },
          countDuplicates: { validator: booleanValidatorOptional },
          enduserFields: { validator: objectAnyFieldsAnyValuesValidator },
        },
        returns: {
          report: { validator: objectAnyFieldsAnyValuesValidator as any, required: true }
        },
      },
      push: {
        op: "custom", access: 'create', method: "post",
        name: 'Push to external EHRs',
        path: '/calendar-events/push',
        description: "Syncs to an external EHR (e.g. Canvas)",
        parameters: {
          calendarEventId: { validator: mongoIdStringValidator, required: true },
          destinations: { validator: listOfStringsValidatorOptionalOrEmptyOk }
        },
        returns: {
          event: { validator: 'calendar_event' as any, required: true },
        },
      },
    },
    publicActions: {
      session_for_join_link: {
        op: "custom", access: 'read', method: "get",
        path: '/calendar-events/session-join-link',
        name: 'Gets Start Link Info (enduser only)',
        description: "Gets session and event details for a join link",
        parameters: { 
          token: { validator: stringValidator, required: true }
        },
        returns: {
          authToken: { validator: stringValidator250, required: true },
          eventId: { validator: mongoIdStringValidator, required: true },
        },
      },
      session_for_start_link: {
        op: "custom", access: 'read', method: "get",
        path: '/calendar-events/session-link',
        name: 'Gets Start Link Info (user only)',
        description: "Gets session and event details for a start link",
        parameters: { 
          token: { validator: stringValidator, required: true }
        },
        returns: {
          authToken: { validator: stringValidator250, required: true },
          eventId: { validator: mongoIdStringValidator, required: true },
        },
      },
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
          userTags: { validator: listOfStringsValidatorOptionalOrEmptyOk },
          userFilterTags: { validator: listOfStringsValidatorOptionalOrEmptyOk },
        },
        returns: {
          appointmentBookingPage: { validator: 'appointment_booking_page' as any, required: true },
          calendarEventTemplates: { validator: 'calendar_event_templates' as any, required: true },
          locations: { validator: 'appointment_locations' as any, required: true },
          products: { validator: 'products' as any, required: true },
          userDisplayName: { validator: stringValidator },
          userAvatar: { validator: stringValidator },
          users: { validator: "users" as any },
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
      actualDuration: { validator: nonNegNumberValidator },
      dontSyncToCanvas: { validator: booleanValidator },
      title: {
        validator: stringValidator250,
        required: true,
        examples: ["Text"],
      }, 
      displayTitle: { validator: stringValidator250 },
      displayDescription: { validator: stringValidator5000 },
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
      locationIds: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk },
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
      carePlanNote: { validator: stringValidator5000EmptyOkay },
      attendees: { 
        validator: calendarEventAttendeesValidator,
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
      videoHostUserId: { validator: mongoIdStringValidator },
      videoURL: { validator: stringValidator },
      videoStartURL: { validator: stringValidator },
      externalVideoURL: { validator: stringValidator },
      timezone: { validator: timezoneValidator},
      copiedFrom: { validator: mongoIdStringValidator },
      internalNotes: { validator: stringValidator5000EmptyOkay },
      hiddenFromPortal: { validator: booleanValidatorOptional },
      enduserAttendeeLimit: { validator: numberValidator },
      bufferEndMinutes: { validator: numberValidator },
      bufferStartMinutes: { validator: numberValidator },
      canvasCoding: { validator: canvasCodingValidator },
      canvasReasonCoding: { validator: canvasCodingValidator },
      canvasLocationId: { validator: stringValidator100 },
      references: { validator: listOfRelatedRecordsValidator, readonly: true },
      completedAt: { validator: dateValidatorOptional },
      tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
      cancelledGroupAttendees: {
        validator: listValidatorOptionalOrEmptyOk(objectValidator<GroupCancellation>({
          id: mongoIdStringRequired,
          at: dateValidator,
        }))
      },
      useUserURL: { validator: booleanValidator },
      instructions: { validator: stringValidator5000EmptyOkay },
      reason: { validator: stringValidator5000 },
      scheduledBy: { validator: mongoIdStringValidator },
      // isAllDay: { validator: booleanValidator },
      statusChangeSource: {
        validator: objectValidator<CalendarEvent['statusChangeSource']>({
          source: stringValidator100,
          identifier: stringValidator100,
          byEnduserExternal: booleanValidatorOptional,
        }),
      },
      cancelReason: { validator: stringValidator5000 },
      dontAutoSyncPatientToHealthie: { validator: booleanValidator },
      dontBlockAvailability: { validator: booleanValidator },
      previousStartTimes: { validator: listOfNumbersValidatorUniqueOptionalOrEmptyOkay },
      requirePortalCancelReason: { validator: booleanValidator },
      startLinkToken: { validator: stringValidator250 },
      canvasEncounterId: { validator: stringValidator100 },
      allowGroupReschedule: { validator: booleanValidator },
      joinedVideoCall: { 
        validator: listValidatorOptionalOrEmptyOk(objectValidator<{ id: string, at: Date }>({
          id: mongoIdStringRequired, 
          at: dateValidator,
        }))
      }
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
      dontSyncToCanvas: { validator: booleanValidator },
      archivedAt: { validator: dateOptionalOrEmptyStringValidator },
      allowGroupReschedule: { validator: booleanValidator },
      dontAutoSyncPatientToHealthie: { validator: booleanValidator },
      title: {
        validator: stringValidator250,
        required: true,
        examples: ["Text"],
      }, 
      displayTitle: { validator: stringValidator250 },
      displayDescription: { validator: stringValidator5000 },
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
      generateZoomLinkWhenBooked: { validator: booleanValidator },
      color: { validator: stringValidator1000 },
      apiOnly: { validator: booleanValidator },
      enduserAttendeeLimit: { validator: numberValidator },
      bufferEndMinutes: { validator: numberValidator },
      bufferStartMinutes: { validator: numberValidator },
      canvasCoding: { validator: canvasCodingValidator },
      canvasReasonCoding: { validator: canvasCodingValidator },
      tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
      matchToHealthieTemplate: { validator: booleanValidator },
      useUserURL: { validator: booleanValidator },
      instructions: { validator: stringValidator5000EmptyOkay },
      requiresEnduser: { validator: booleanValidator },
      requirePortalCancelReason: { validator: booleanValidator },
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
      continueOnError: { validator: booleanValidator }, // currently unused, keep in action instead
      enduserConditions: { validator: optionalAnyObjectValidator },
      tags: { validator: listOfStringsValidatorOptionalOrEmptyOk },
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
      enduserId: { validator: mongoIdStringValidator },
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
    defaultActions: {
      ...DEFAULT_OPERATIONS,
      create: {
        warnings: [
          `"timestamp" is the datetime displayed in the Tellescope UI for Vitals, and defaults to the submission datetime with a precision of milliseconds. A "createdAt" timestamp is tracked automatically with a precision of seconds. "recordedAt" can be used to store another datetime but is not required and not exposed in our UI.`,
        ],
      },
      createMany: {
        warnings: [
          `"timestamp" is the datetime displayed in the Tellescope UI for Vitals, and defaults to the submission datetime with a precision of milliseconds. A "createdAt" timestamp is tracked automatically with a precision of seconds. "recordedAt" can be used to store another datetime but is not required and not exposed in our UI.`,
        ],
      }
    },
    customActions: { 
      load: {
        op: "custom", access: 'read', method: "get",
        name: 'Load Enduser Observations (Vitals)',
        path: '/enduser-observations/load',
        description: "Loads all observations between a given time period for an Enduser, including id, timestamp, measurement, and source",
        parameters: { 
          from: { validator: dateValidator, required: true },
          to: { validator: dateValidator, required: true },
          enduserId: { validator: mongoIdStringValidator },
          careTeam: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk },
          unreviewed: { validator: booleanValidator },
        },
        returns: {
          observations: { validator: 'enduser_observations' as any, required: true },
        },
      },
      acknowledge: {
        op: "custom", access: 'update', method: "post",
        name: 'Acknowledge Observations (Vitals)',
        path: '/enduser-observations/acknowledge',
        description: "Bulk acknowledge (mark reviewed) EnduserObservations",
        parameters: { 
          ids: { validator: listOfMongoIdStringValidator, required: true },
        },
        returns: { },
      },
    },
    enduserActions: { create: {}, createMany: {}, read: {}, readMany: {}, load: {} },
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
      reviewedAt: { validator: dateValidatorOptional },
      timestamp: { validator: dateValidator, initializer: () => new Date() },
      statusChangedBy: { validator: mongoIdStringValidator },
      beforeMeal: { validator: booleanValidator },
      dontTrigger: { validator: booleanValidator },
      references: { validator: listOfRelatedRecordsValidator, readonly: true },
      showWithPlotsByUnit: { validator: listOfStringsValidatorOptionalOrEmptyOk },
      invalidationReason: { validator: stringValidatorOptionalEmptyOkay },
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
    publicActions: {
      load_unauthenticated: {
        op: 'custom', access: 'read', method: 'get',
        path: '/managed-content-records/load-unauthenticated',
        name: "For accessing content which is available without authentication",
        description: "", 
        parameters: { 
          id: { validator: mongoIdStringValidator, required: true },
        },
        returns: { 
          record: { validator: 'managed_content_record' as any, required: true },
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
        validator: stringValidator1000,
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
      allowUnauthenticatedAccess: { validator: booleanValidator },
      portalIndex: { validator: numberValidator },
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
        {
          explanation: 'Subscription date and period cannot be updated',
          evaluate: (updated, lookup, session, type, options) => {
            if (type !== 'update') return // not updating
            if (!(options.updates?.subscriptionExpiresAt || options.updates?.subscriptionPeriod || options.updates?.allowCreateSuborganizations || options.updates?.customPortalURLs || options.updates?.subdomains)) return // not changing

            if (session.type === 'enduser') return "User only"
            if (!session.isa) return "Not allowed"
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
      add_athena_subscription: {
        op: "custom", access: 'create', method: "post", 
        adminOnly: true,
        name: 'Add Athena Subscription',
        path: '/organizations/athena-subscription', 
        description: "Creates an Athena subscription",
        parameters: { 
          startAt: { validator: dateValidator },
          type: { validator: athenaSubscriptionTypeValidator, required: true },
          frequency: { validator: nonNegNumberValidator, required: true }, 
        },
        returns: { 
          organization: { validator: 'organization' as any },
        } 
      },
      sync_athena_subscription: {
        op: "custom", access: 'create', method: "post", 
        adminOnly: true,
        name: 'Sync Athena Subscription',
        path: '/organizations/sync-athena-subscription', 
        description: "Syncs an Athena subscription",
        parameters: { 
          type: { validator: athenaSubscriptionTypeValidator, required: true },
          backgroundTaskId: { validator: mongoIdStringOptional, },
          enduserId: { validator: mongoIdStringOptional, },
        },
        returns: { } 
      },
      sync_note_to_canvas: { // dictate by organization read, since notes can come from any model (e.g. sms, email, chat, etc.)
        op: "custom", access: 'read', method: "post", 
        adminOnly: true,
        name: 'Push Canvas Note',
        path: '/organizations/sync-note-to-canvas', 
        description: "Syncs a text note to canvas using questionnaire details in canvasMessageSync",
        parameters: { 
          enduserId: { validator: mongoIdStringValidator, required: true },
          note: { validator: stringValidator25000, required: true },
        },
        returns: { 
          canvasId: { validator: stringValidator100, required: true }
        } 
      },
      link_twilio: { 
        op: "custom", access: 'update', method: "post", 
        adminOnly: true, 
        name: 'Link Twilio',
        path: '/organizations/link-twilio', 
        description: "Links to an existing Twilio sub-account configuration or creates a new one",
        parameters: { },
        returns: { 
          organization: { validator: 'organization' as any, required: true },
        } 
      },
      load_twilio_embed: { 
        op: "custom", access: 'read', method: "get", 
        adminOnly: true, 
        name: 'Get Twilio Embed',
        path: '/organizations/twilio-embed', 
        description: "Gets detail to load an embedded Twilio UI in Tellescope",
        parameters: { 
          type: { validator: stringValidator },
        },
        returns: { 
          id: { validator: stringValidator, required: true },
          token: { validator: stringValidator, required: true },
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
      customPortalURLs: { validator: listOfStringsValidator },
      subdomains: { validator: listOfStringsValidator },
      portalSettings: { validator: portalSettingsValidator },
      settings: { validator: organizationSettingsValidator },
      timezone: { validator: timezoneValidator },
      forwardAllIncomingEmailsTo: { validator: emailValidator },
      zendeskSettings: {
        validator: objectValidator<Organization['zendeskSettings']>({
          priorityGroups: listOfStringsValidatorOptionalOrEmptyOk,
          resolutionFieldId: stringValidatorOptionalEmptyOkay,
          resolutionFieldOptions: listOfStringsValidatorOptionalOrEmptyOk,
        })
      },
      hasTicketQueues: { validator: booleanValidator },
      customAutoreplyMessage: { validator: stringValidator1000 },
      altVitalTeamIds: { validator: listValidatorEmptyOk(objectValidator<{ teamId: string, label: string }>({
        teamId: stringValidator100,
        label: stringValidator100,
      })) },
      billingOrganizationName: { validator: stringValidator },
      billingOrganizationNPI: { validator: stringValidator },
      billingOrganizationTaxId: { validator: stringValidator },
      billingOrganizationAddress: { validator: addressValidator },
      videoCallBackgroundImage: { validator: stringValidator },
      sendToVoicemailOOO: { validator: booleanValidator },
      forwardingOOONumber: { validator: phoneValidator },
      onCallUserIds: { validator: listOfUniqueStringsValidatorEmptyOk },
      outOfOfficeVoicemail: { validator: phonePlaybackValidator },
      enduserProfileWebhooks: { validator: enduserProfileWebhooksValidator },
      showCommunity: { validator: booleanValidator },
      phoneLabels: { 
        validator: listValidatorOptionalOrEmptyOk(objectValidator<{ label: string, number: string }>({
          label: stringValidator100,
          number: stringValidator100,
        }))
      },
      athenaFieldsSync: { validator: fieldsSyncValidator },
      athenaDepartments: { 
        validator: listValidatorOptionalOrEmptyOk(objectValidator<{ id: string, timezone: Timezone }>({
          id: stringValidator100,
          timezone: timezoneValidator,
        }))
      },
      fieldsToAdminNote: { validator: listOfStringsValidatorOptionalOrEmptyOk },
      canvasMessageSync: {
        validator: objectValidator<{ id: string, questionId: string }>({
          id: stringValidator100,
          questionId: stringValidator100,
        })
      },
      canvasSyncEmailConsent: { validator: booleanValidator },
      enforceMFA: { validator: booleanValidator },
      replyToEnduserTransactionalEmails: { validator: emailValidator },
      customTermsOfService: { validator: stringValidator },
      customPrivacyPolicy: { validator: stringValidator },
      requireCustomTermsOnMagicLink: { validator: booleanValidator },
      allowCreateSuborganizations: { validator: booleanValidator },
      answersSyncToPortal: { 
        validator: listValidatorOptionalOrEmptyOk(objectValidator<{ id: string, questions: string[] }>({
          id: stringValidator100,
          questions: listValidatorEmptyOk(stringValidator1000),
        }))
      },
      externalFormIdsToSync: { validator: listOfStringsValidatorOptionalOrEmptyOk },
      analyticsIframes: { 
        validator: listValidatorOptionalOrEmptyOk(objectValidator<{ iframeURL: string, title: string }>({
          title: stringValidator1000,
          iframeURL: stringValidator1000,
        }))
      },
      defaultDoseSpotPharmacies: { 
        validator: listValidatorOptionalOrEmptyOk(objectValidator<{ id: string, name: string }>({
          id: stringValidator100,
          name: stringValidator,
        }))
      },
      groups: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
      canvasURL: { validator: stringValidator },
      observationInvalidationReasons: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
      customNotificationTypes: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
      customerIOFields: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
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
      visibleForRoles: { validator: listOfStringsValidatorOptionalOrEmptyOk }
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
        // no longer unique, to support custom iframe pages
        // 'page' // prevents duplicate customizations for the same page (may need to combine with a version number / draft status later to allow drafting)
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
        validator: stringValidator100,
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
      iframeURL: { validator: stringValidator1000 },
      iconURL: { validator: stringValidator1000 },
      activeIconURL: { validator: stringValidator1000 },
      showStripePortalLink: { validator: booleanValidator },
      hideCancellatation: { validator: booleanValidator },
      hiddenEventTitles: { validator: listOfStringsValidatorEmptyOk },
      hiddenFormIds: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk },
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
        // ['enduserId', 'title']
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
      },
      journeyId: { validator: mongoIdStringValidator },
      completedAt: { validator: dateOptionalOrEmptyStringValidator },
      htmlDescription: { validator: stringValidator100000EmptyOkay },
      hideRemainingTicketsProgress: { validator: booleanValidator },
      highlightedEnduserFields: { validator: listOfStringsValidatorOptionalOrEmptyOk },
      closeAutomaticallyByTicket: { validator: booleanValidator },
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
      archivedAt: { validator: dateOptionalOrEmptyStringValidator },
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
      limitedByTagsPortal: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
      topLogo: { validator: stringValidator },
      requireLocationSelection: { validator: booleanValidator },
      fontFace: { validator: stringValidator },
      fontFamily: { validator: stringValidator5000EmptyOkay },
      fontURL: { validator: stringValidator },
      collectReason: { validator: exactMatchValidator<Required<AppointmentBookingPageClient>['collectReason']>(['Do Not Collect', 'Optional', 'Required'])},
      restrictionsByTemplate: { validator: bookingRestrictionsByTemplateValidator },
      publicMulti: { validator: booleanValidator },
      publicUserTags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
      publicUserFilterTags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
      appointmentSlotsMaxHeight: { validator: numberValidatorOptional },
      includeRelatedContactTypes: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
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
      city: { validator: stringValidator },
      zipCode: { validator: stringValidator1000 },
      phone: { validator: stringValidator }, // phoneValidator assumes cell phone and strips formatting, this should not
      state: { validator: stateValidator },
      timezone: { validator: timezoneValidator },
      canvasLocationId: { validator: stringValidator1000 },
      healthieContactType: { validator: stringValidator100 },
      healthieLocationId: { validator: stringValidator100 },
      healthieUseZoom: { validator: booleanValidator },
      instructions: { validator: stringValidator5000EmptyOkay },
      tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
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
      get_stripe_portal_session: {
        op: "custom", access: 'read', method: "get", 
        name: 'Get Stripe Portal Session (Enduser Only)',
        path: '/products/stripe-portal-session',
        description: "Prepares a Stripe checkout process",
        parameters: { 
          stripeKey: { validator: stringValidator250, },
          stripeCustomerId: { validator: stringValidator100, },
          return_url: { validator: stringValidator, required: true },
        },
        returns: {
          url: { validator: stringValidator, required: true },
        },
      }, 
    },
    enduserActions: {
      read: {}, readMany: {}, 
      prepare_stripe_checkout: {}, 
      get_stripe_portal_session: {},
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
      maxCheckoutCount: { validator: numberValidatorOptional },
      stripeProductId: { validator: stringValidator100 },
      stripeSubscriptionId: { validator: stringValidator100 },
    }
  },
  purchases: {
    info: {},
    constraints: { unique: [], relationship: [] },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {
      charge_card_on_file: {
        op: "custom", access: 'create', method: "post", 
        name: 'Charge Stripe Card on File',
        path: '/purchases/charge-card',
        description: "Charges an existing card on file (if saved), otherwise throws an error",
        parameters: { 
          enduserId: { validator: mongoIdStringValidator, required: true },
          productIds: { validator: listOfMongoIdStringValidatorEmptyOk },
          cost: { validator: costValidator },
          stripeKey: { validator: stringValidator },
        },
        returns: {

        },
      }, 
    },
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
      notes: { validator: stringValidator5000EmptyOkay },
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
    info: {
      description: (
`"to" and "from" represent phone numbers. To represent the caller and callee, set userId and enduserId.

{ "isVoicemail": true } indicates that an inbound call was not answered, but not necessarily that a full voicemail was left
If a voicemail is left, it is indicated by recordingURI, transcription, or recordingDurationInSeconds        
`
      )
    },
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
      get_number_report: {
        op: "custom", access: 'read', method: "get",
        name: 'Number Report',
        path: '/phone-calls/number-report',
        description: "Builds a report showing call details by organization and user phone numbers",
        parameters: {
          range: { validator: dateRangeOptionalValidator },
        },
        returns: {
          report: { validator: objectAnyFieldsAnyValuesValidator as any, required: true }
        },
      },
      upgrade_to_conference: {
        op: "custom", access: 'update', method: "post",
        name: 'Upgrade to Conference',
        path: '/phone-calls/upgrade-to-conference',
        description: "Upgrades a live inbound call to a conference call",
        parameters: {
          id: { validator: stringValidator100, required: true },
        },
        returns: {},
      },
      add_conference_attendees: {
        op: "custom", access: 'update', method: "post",
        name: 'Remove Conference Attendees',
        path: '/phone-calls/add-conference-attendees',
        description: "Adds attendees to conference call",
        parameters: {
          conferenceId: { validator: stringValidator100, required: true },
          enduserId: { validator: mongoIdStringValidator },
          byClientId: { validator: listOfStringsValidatorOptionalOrEmptyOk },
          byPhone: { validator: listOfStringsValidatorOptionalOrEmptyOk },
        },
        returns: {},
      },
      remove_conference_attendees: {
        op: "custom", access: 'update', method: "post",
        name: 'Remove Conference Attendees',
        path: '/phone-calls/remove-conference-attendees',
        description: "Removes attendees from a conference call",
        parameters: {
          conferenceId: { validator: stringValidator100, required: true },
          byClientId: { validator: listOfStringsValidatorOptionalOrEmptyOk },
          byPhone: { validator: listOfStringsValidatorOptionalOrEmptyOk },
        },
        returns: {},
      },
      end_conference: {
        op: "custom", access: 'update', method: "post",
        name: 'End Conference',
        path: '/phone-calls/end-conference',
        description: "Ends an active conference call for all participants",
        parameters: {
          id: { validator: stringValidator100, required: true },
        },
        returns: {},
      },
      cancel_recording: {
        op: "custom", access: 'update', method: "post",
        name: 'End Conference',
        path: '/phone-calls/cancel-recording',
        description: "Stops recording an active phone call",
        parameters: {
          enduserId: { validator: mongoIdStringValidator, required: true },
        },
        returns: {},
      },
      delete_recordings: {
        op: "custom", access: 'delete', method: "post",
        name: 'Delete Recordings',
        path: '/phone-calls/delete-recordings',
        description: "Deletes all call recordings in Twilio from a certain date",
        parameters: {
          callIds: { validator: listOfMongoIdStringValidator, required: true },
        },
        returns: {},
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
      markedUnreadForAll: { validator: booleanValidator },
      inboxStatus: { validator: stringValidator100 },
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
      inbound: { validator: booleanValidator, required: true, examples: [true] },
      externalId: { validator: stringValidator100 },
      to: { validator: stringValidator100 },
      from: { validator: stringValidator100 },
      isVoicemail: { validator: booleanValidator },
      recordingURI: { validator: stringValidator1000 },
      recordingId: { validator: stringValidator100 },
      transcriptionId: { validator: stringValidator100 },
      recordingDurationInSeconds: { validator: nonNegNumberValidator },

      transcription: { validator: stringValidator25000 },
      note: { validator: stringValidator5000EmptyOkay },
      unread: { validator: booleanValidator },

      userId: { validator: mongoIdStringValidator },
      ticketId: { validator: mongoIdStringValidator },
      pinnedAt: { validator: dateOptionalOrEmptyStringValidator },
      readBy: { validator: idStringToDateValidator },
      hiddenBy: { validator: idStringToDateValidator },
      hiddenForAll: { validator: booleanValidator },
      ticketIds: { validator: listOfStringsValidatorEmptyOk },
      tags: { validator: listOfStringsValidatorOptionalOrEmptyOk },
      assignedTo: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },

      callDurationInSeconds: { validator: numberValidator },
      timestamp: { validator: dateValidator },
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
        op: "custom", access: 'read', method: "get", 
        name: 'Get analytics for query',
        path: '/result-for-analytics-query',
        description: "Returns a computed result for an analytics query",
        parameters: { 
          query: { validator: analyticsQueryValidator, required: true },
          createdRange: { validator: dateRangeValidator },
          createdAvailabilities: { validator: weeklyAvailabilitiesValidator },
          updatedRange: { validator: dateRangeValidator },
          groupByCareTeam: { validator: booleanValidator },
        },
        returns: { 
          count: { validator: nonNegNumberValidator },
          percentage: { validator: stringValidator },
          values: { validator: analyticsQueryResultsValidator },
        } 
      },
      get_custom_report: {
        op: "custom", access: 'read', method: "get", 
        name: 'Get custom report',
        path: '/analytics/custom-report',
        description: "For customized analytics reporting, pre-configured by the Tellescope team for a given organization",
        parameters: { 
          key: { validator: stringValidator, required: true },
          lastId: { validator: stringValidator },
          limit: { validator: numberValidator },
        },
        returns: { report: { validator: objectAnyFieldsAnyValuesValidator, required: true } }
      },
    },
    enduserActions: { },
    fields: {
      ...BuiltInFields, 
      createdAvailabilities: { validator: weeklyAvailabilitiesValidator },
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
      type: { validator: analyticsFrameTypeValidator },
      groupMin: { validator: nonNegNumberValidator },
      groupMax: { validator: nonNegNumberValidator },
      groupByCareTeam: { validator: booleanValidator },
      displayType: { validator: stringValidator100 },
      analyticsFrameGroupingCategory: { validator: analyticsFrameGroupingCategoriesValidator },
      truncationLength: { validator: nonNegNumberValidator },
      showEllipsis: { validator: booleanValidator },
      orderedLabels: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
      overrideGlobalRange: { validator: booleanValidator },
      visibleForRoles: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
      visibleForUserIds: { validator: listOfMongoIdStringValidatorOptionalOrEmptyOk },
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
      defaultForUserIds: { validator: listOfStringsValidatorOptionalOrEmptyOk },
      hideFromRoles: { validator: listOfStringsValidatorEmptyOk },
      hideProfileLink: { validator: booleanValidator },
      customTypeId: { validator: mongoIdStringValidator },
      style: { validator: objectAnyFieldsAnyValuesValidator as any },
      sort: { validator: sortingFieldsValidator },
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
      showCompose: { validator: booleanValidator },
      defaultForRoles: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
      hiddenFromRoles: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
      defaultForUserIds: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
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
            validator: listValidator(objectValidator<{ enduserId: string, automationTriggerId: string, journeyContext?: JourneyContext }>({
              automationTriggerId: mongoIdStringRequired,
              enduserId: mongoIdStringRequired,
              journeyContext: optionalAnyObjectValidator,
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
      tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, 
      availabilityTimezone: { validator: timezoneValidator },
      weeklyAvailabilities: { validator: weeklyAvailabilitiesValidator },
      archivedAt: { validator: dateOptionalOrEmptyStringValidator },
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
      fdbCode: { validator: stringValidator },
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
          quantity: stringValidator,
          frequency: stringValidator,
          frequencyDescriptor: stringValidatorOptional,
          description: stringValidatorOptional,
        }), 
      },
      source: { validator: stringValidator1000Optional },
      externalId: { validator: stringValidator250 },  
      notes: { validator: stringValidator },  
      references: { validator: listOfRelatedRecordsValidator, readonly: true },
      orderStatus: { validator: stringValidator1000 },
      pharmacyName: { validator: stringValidator1000 },
      prescriberName: { validator: stringValidator1000 },
      reasonForTaking: { validator: stringValidator },
      directions: { validator: stringValidator },
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
      bypassOOO: { validator: booleanValidator },
      defaultEntityType: { validator: stringValidator100 },
      tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, 
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
  ticket_threads: {
    info: {
      description: 'For Zendesk integration'
    },
    constraints: { unique: [], relationship: [], },
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
      source: { validator: stringValidator100, }, 
      externalId: { validator: stringValidator100, },
      subject: { validator: stringValidator1000 },
      pinnedAt: { validator: dateOptionalOrEmptyStringValidator },
      group: { validator: stringValidator250 },
      assignedTo: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
      references: { validator: listOfRelatedRecordsValidator, readonly: true },
      tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, 
    }
  },
  ticket_thread_comments: {
    info: {
      description: 'For Zendesk integration'
    },
    constraints: { 
      unique: [], relationship: [], 
      access: [{ type: 'dependency', foreignModel: 'ticket_threads', foreignField: '_id', accessField: 'ticketThreadId' }]
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: {},
    fields: {
      ...BuiltInFields, 
      markedUnreadForAll: { validator: booleanValidator },
      inboxStatus: { validator: stringValidator100 },
      externalId: { validator: stringValidator100, },
      source: { validator: stringValidator100, },
      ticketThreadId: { 
        validator: mongoIdStringValidator, required: true, examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['ticket_threads'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      externalThreadId: { validator: stringValidator100, },
      public: { validator: booleanValidator, required: true, examples: [true] },
      plaintext: { validator: stringValidator25000EmptyOkay },
      html: { validator: stringValidator25000EmptyOkay },
      type: { validator: stringValidator100, },
      attachments: { validator: listOfChatAttachmentsValidator },
      enduserId: { validator: mongoIdStringValidator },
      userId: { validator: mongoIdStringValidator },
      inbound: { validator: booleanValidator },
      readBy: { validator: idStringToDateValidator },
      hiddenBy: { validator: idStringToDateValidator },
      hiddenForAll: { validator: booleanValidator },
      ticketIds: { validator: listOfStringsValidatorEmptyOk },
      group: { validator: stringValidator250 },
      references: { validator: listOfRelatedRecordsValidator, readonly: true },
      userDisplayName: { validator: stringValidator250 },
      tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, 
    }
  },
  configurations: {
    info: {},
    constraints: { unique: [], relationship: [], access: [] },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: {},
    fields: {
      ...BuiltInFields, 
      type: { validator: stringValidator250, examples: ['string'] },
      value: { validator: stringValidator100000OptionalEmptyOkay, examples: ['string'] },
    },
  },
  ticket_queues: {
    info: {},
    constraints: { 
      unique: ['title'], relationship: [], 
      access: [
        { type: 'filter', field: 'userIds' }, 
      ]  
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {
      update_indexes: {
        op: "custom", access: 'update', method: "patch",
        name: 'Update Indexes',
        path: '/ticket-queues/update-indexes',
        description: "Updates indexes for a number of ticket queues to adjust the default sorting",
        parameters: { 
          updates: { validator: indexUpdatesValidator, required: true },
        },
        returns: {},
      },
    },
    enduserActions: {},
    fields: {
      ...BuiltInFields, 
      title: { validator: stringValidator, required: true, examples: ['Title']},
      userIds: { validator: listOfMongoIdStringValidatorEmptyOk, required: true, examples: [[PLACEHOLDER_ID]] },
      type: { validator: stringValidator100 },
      defaultFromNumber: { validator: stringValidatorOptional },
      enduserFields: { validator: listOfStringsValidatorOptionalOrEmptyOk },
      preventPull: { validator: listOfMongoIdStringValidatorEmptyOk },
      overdueReminderUserId: { validator: mongoIdStringValidator },
    },
  },
  group_mms_conversations: {
    info: {},
    constraints: { 
      unique: [], relationship: [], 
      access: [
        { type: 'filter', field: 'userIds' }, 
      ]
    },
    defaultActions: { read: {}, readMany: {}, update: {}, delete: {} },
    customActions: {
      start_conversation: {
        op: "custom", access: 'create', method: "post", 
        name: 'Start Conversation',
        path: '/group-mms-conversations/start-conversation',
        description: "Creates a new conversation and sends the initial message",
        parameters: { 
          message: { validator: stringValidator, required: true },
          sender: { validator: mongoIdStringRequired, required: true },
          enduserIds: { validator: listOfMongoIdStringValidator, required: true },
          userIds: { validator: listOfMongoIdStringValidator, required: true },
          phoneNumber: { validator: phoneValidator, required: true },
          title: { validator: stringValidator, required: true },
        },
        returns: { 
          conversation: { validator: 'group_mms_conversations' as any },
        } 
      },
      send_message: {
        op: "custom", access: 'create', method: "post", 
        name: 'Send Message',
        path: '/group-mms-conversations/send-message',
        description: "Sends a new message in an existing conversation",
        parameters: { 
          message: { validator: stringValidator, required: true },
          sender: { validator: mongoIdStringRequired, required: true },
          conversationId: { validator: mongoIdStringRequired, required: true },
        },
        returns: { 
          conversation: { validator: 'group_mms_conversations' as any },
        } 
      },
    },
    enduserActions: {},
    fields: {
      ...BuiltInFields, 
      markedUnreadForAll: { validator: booleanValidator },
      inboxStatus: { validator: stringValidator100 },
      userIds: { validator: listOfMongoIdStringValidatorEmptyOk, required: true, examples: [[PLACEHOLDER_ID]] },
      enduserIds: { validator: listOfMongoIdStringValidatorEmptyOk, required: true, examples: [[PLACEHOLDER_ID]] },
      externalId: { validator: stringValidator, readonly: true }, 
      phoneNumber: { validator: stringValidator, readonly: true }, 
      destinations: { validator: listOfStringsValidator, readonly: true }, 
      title: { validator: stringValidator, readonly: true }, 
      messages: { validator: mmsMessagesValidator, readonly: true },
      userStates: { validator: groupMMSUserStatesValidator },
      tags: { validator: listOfStringsValidatorEmptyOk },
      suggestedReply: { validator: stringValidator5000EmptyOkay },
      hiddenBy: { validator: idStringToDateValidator },
      hiddenForAll: { validator: booleanValidator },
      assignedTo: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
      pinnedAt: { validator: dateOptionalOrEmptyStringValidator },
    },
  },
  enduser_encounters: {
    info: {
      description: 'Encounters, currently for use with Candid integration only'
    },
    constraints: { 
      unique: [], relationship: [], 
      access: [{ type: 'filter', field: 'providerUserId' }]
    },
    defaultActions: { create: {}, read: {}, readMany: {}, delete: {} },
    customActions: {
      create_candid_encounter: {
        op: "custom", access: 'create', method: "post",
        name: 'Create Encounter With Candid',
        path: '/enduser-encounters/create-candid-encounter',
        description: "Creates an Encounter in Candid",
        parameters: { 
          encounterId: { validator: mongoIdStringValidator, required: true },
        },
        returns: { 
          encounter: { validator: 'enduser_encounter' as any, required: true },
        } 
      },
    },
    enduserActions: {},
    fields: {
      ...BuiltInFields, 
      externalId: { validator: stringValidator100, examples: ['externalId'], readonly: true },
      title: { validator: stringValidator, examples: ['Title'], required: true },
      integration: { validator: exactMatchValidator<typeof CANDID_TITLE>([CANDID_TITLE]), examples: [CANDID_TITLE], readonly: true },
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
      providerUserId: { validator: mongoIdStringValidator, required: true, examples: [PLACEHOLDER_ID] },
      authorizedRelease: { validator: booleanValidator, required: true, examples: [true] },
      dateOfService: { validator: stringValidator, required: true, examples: ['MM-DD-YYYY'] },
      diagnoses: { validator: diagnosesValidator, required: true, examples: [[{ type: 'LOI', code: "CODE_HERE" }]]},
      placeOfServiceCode: { validator: stringValidator, required: true, examples: ['02', '11'] },
      billingProviderAddress: { validator: addressValidator },
      serviceFacilityAddress: { validator: addressValidator },
    }
  },
  enduser_orders: {
    info: {
      description: 'Lab, medication, and device orders'
    },
    constraints: { 
      unique: [], relationship: [], 
      access: [{ type: 'filter', field: 'userId' }]
    },
    defaultActions: DEFAULT_OPERATIONS,
    enduserActions: { create: {}, /* for importing historical labs in portal */ read: {}, readMany: {} },
    customActions: {
      get_available_tests: {
        op: "custom", access: 'read', method: "get",
        name: 'Get Available Tests',
        path: '/enduser-orders/get-available-tests',
        description: "Gets available tests (Vital). If zipCode is provided, filters by availability.",
        parameters: { 
          zipCode: { validator: stringValidator }, 
          teamId: { validator: stringValidator } 
        },
        returns: { 
          tests: { validator: listValidatorOptionalOrEmptyOk(objectAnyFieldsAnyValuesValidator) as any, required: true },
        } 
      },
      create_smart_meter_order: {
        op: "custom", access: 'create', method: "post",
        name: 'Place Smart Meter Order',
        path: '/enduser-orders/create-smart-meter-order',
        description: "Creates a Smart Meter Order",
        parameters: { 
          enduserId: { validator: mongoIdStringValidator, required: true },
          lines: { validator: smartMeterLinesValidator, required: true },
          shipping: { validator: stringValidator },
        },
        returns: { 
          order: { validator: 'enduser_order' as any, required: true },
        } 
      },
      create_lab_order: {
        op: "custom", access: 'create', method: "post",
        name: 'Create Lab Order (Vital)',
        path: '/enduser-orders/create-lab-order',
        description: "Creates a lab order via Vital",
        parameters: { 
          enduserId: { validator: mongoIdStringValidator, required: true },
          labTestId: { validator: stringValidator, required: true },
          physicianUserId: { validator: mongoIdStringValidator },
          teamId: { validator: stringValidator },
          activateBy: { validator: stringValidator },
          aoe_answers: {
            validator: listValidatorOptionalOrEmptyOk(objectValidator<VitalAOEAnswer>({
              marker_id: numberValidator,
              question_id: numberValidator,
              answer: stringValidator,
            })),
          }
        },
        returns: { 
          order: { validator: 'enduser_order' as any, required: true },
        } 
      },
      cancel_order: {
        op: "custom", access: 'create', method: "post",
        name: 'Cancel Order',
        path: '/enduser-orders/cancel-lab-order',
        description: "Cancels a lab order via Junction (formerly Vital)",
        parameters: { 
          orderId: { validator: mongoIdStringValidator, required: true },
        },
        returns: { 
          order: { validator: 'enduser_order' as any },
        } 
      },
      create_go_go_meds_order: {
        op: "custom", access: 'create', method: "post",
        name: 'Create Prescription Vet Order (GoGoMeds)',
        path: '/enduser-orders/create-gogomeds-order',
        description: "Creates a vet order via GoGoMeds",
        parameters: { 
          enduserId: { validator: mongoIdStringValidator, required: true },
          PrescriptionImage: { validator: stringValidator, required: true },
          title: { validator: stringValidator },
          PetName: { validator: stringValidator, required: true },
          PetTypeId: { validator: numberValidator, required: true },
          OtherPetType: { validator: stringValidator },
          PetWeight: { validator: stringValidator },
          AllergyText: { validator: stringValidator },
          CurrentMedications: { validator: stringValidator },
          Gender: { validator: stringValidator as any, required: true },
          MedicalConditionText: { validator: stringValidator },
        },
        returns: { 
          order: { validator: 'enduser_order' as any, required: true },
        } 
      },
    },
    fields: {
      ...BuiltInFields, 
      externalId: { validator: stringValidator100, examples: ['externalId'], required: true },
      source: { validator: stringValidator100, examples: ['source'], required: true },
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
      userId: { validator: mongoIdStringValidator },
      title: { validator: stringValidator, required: true, examples: ['title'] },
      status: { validator: stringValidator, required: true, examples: ['status'] },
      description: { validator: stringValidator1000 },
      frequency: { validator: stringValidator100 },
      items: { validator: listValidatorOptionalOrEmptyOk(objectValidator<{ title: string, tracking?: string }>({
        title: stringValidator,
        tracking: stringValidatorOptional,
      }))},
      tracking: { validator: stringValidatorOptional },
    }
  },
  vital_configurations: {
    info: {},
    constraints: { 
      unique: [], relationship: [], 
      access: []  
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: {},
    fields: {
      ...BuiltInFields, 
      title: { validator: stringValidator, required: true, examples: ['Title'] },
      unit: { validator: stringValidator100, required: true, examples: ['lb'] },
      ranges: { 
        validator: vitalConfigurationRangesValidator, 
        required: true, 
        examples: [
          [{
            classification: "High",
            comparison: {
              type: 'Less Than',
              value: 5,
            }
          }]
        ] 
      },
      mealStatus: { validator: exactMatchValidator<Required<VitalConfiguration>['mealStatus']>(['Any', 'Before', 'After']) },
      originalConfigurationId: { validator: mongoIdStringValidator },
      enduserId: { validator: mongoIdStringValidator },
    },
  },
  blocked_phones: {
    info: {},
    constraints: { 
      unique: ['phone'], relationship: [], 
      access: []  
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: {},
    fields: {
      ...BuiltInFields, 
      phone: { validator: stringValidator, required: true, examples: ['+15555555555'] },
    },
  },
  prescription_routes: {
    info: {},
    constraints: { 
      unique: [['state', 'templateIds', 'pharmacyId']], relationship: [], 
      access: []  
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: {},
    fields: {
      ...BuiltInFields, 
      title: { validator: stringValidator, required: true, examples: ['Title'] },
      state: { validator: stateValidator, required: true, examples: ['CA'] }, 
      templateIds: { validator: listOfStringsValidator, required: true, examples: [['tmp_01GZMD9Q71W7T44812351V9QZN']] },
      pharmacyId: { validator: stringValidator },
      pharmacyLabel: { validator: stringValidator },
      tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, 
    },
  },
  enduser_problems: {
    info: {
      description: 'Problems'
    },
    constraints: { 
      unique: [], relationship: [], 
      access: []
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: {},
    fields: {
      ...BuiltInFields, 
      externalId: { validator: stringValidator100, examples: ['externalId'] },
      source: { validator: stringValidator100, examples: ['source'] },
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
      title: { validator: stringValidator, required: true, examples: ['title'] },
      code: { validator: stringValidator100 },
      codeset: { validator: stringValidator100 },
      references: { validator: listOfRelatedRecordsValidator, updatesDisabled: true },
    }
  },
  flowchart_notes: {
    info: {
      description: ''
    },
    constraints: { 
      unique: [], relationship: [], 
      access: []
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: {},
    fields: {
      ...BuiltInFields, 
      flowchartId: { validator: stringValidator100, required: true, examples: ['externalId'] },
      note: { validator: stringValidator5000, required: true, examples: ['Note'] },
      flowchartUI: { validator: flowchartUIValidator },
    }
  },
  webhook_logs: {
    info: { description: '' },
    constraints: { unique: [], relationship: [], access: [] },
    defaultActions: { readMany: { } },
    customActions: {},
    enduserActions: {},
    fields: {
      ...BuiltInFields,
      payload: { validator: objectAnyFieldsAnyValuesValidator },
      response: { validator: objectAnyFieldsAnyValuesValidator },
      responseCode: { validator: numberValidator },
      url: { validator: stringValidator },
    }
  },
  form_groups: {
    info: { description: '' },
    constraints: { unique: ['title'], relationship: [], access: [] },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: { read: {}, readMany: {} },
    fields: {
      ...BuiltInFields,
      title: { validator: stringValidator, required: true, examples: ['Title'] },
      formIds: { validator: listOfMongoIdStringValidator, required: true, examples: [[PLACEHOLDER_ID]] },
    }
  },
  portal_brandings: {
    info: { description: '' },
    constraints: { unique: [], relationship: [], access: [] },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: {},
    fields: {
      ...BuiltInFields,
      title: { validator: stringValidator, required: true, examples: ['Title'] },
      enduserField: { validator: stringValidator, required: true, examples: ['Title'] },
      enduserValue: { validator: stringValidator, required: true, examples: ['Title'] },
      primary: { validator: stringValidator },
      secondary: { validator: stringValidator },
      logoURL: { validator: stringValidator },
      subdomain: { validator: stringValidator },
      customPortalURL: { validator: stringValidator },
    }
  },
  message_template_snippets: {
    info: { description: '' },
    constraints: { unique: ['key'], relationship: [], access: [] },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: {},
    fields: {
      ...BuiltInFields,
      key: { validator: stringValidator, required: true, examples: ['Unique Key'] },
      value: { validator: stringValidator, required: true, examples: ['Value'] },
    }
  },
  fax_logs: {
    info: { description: '' },
    constraints: { unique: [], relationship: [], access: [] },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: {},
    fields: {
      ...BuiltInFields,
      title: { validator: stringValidator100, required: true, examples: ['Title'] },
      externalId: { validator: stringValidator100, required: true, examples: ['external-uuid'] },
      source: { validator: stringValidator100, required: true, examples: ['mFax'] },
      fileId: { validator: mongoIdStringValidator, required: true, examples: [PLACEHOLDER_ID] },
      from: { validator: stringValidator100, required: true, examples: ['+15555555555'] },
      to: { validator: stringValidator100, required: true, examples: ['+15555555555'] },
      inbound: { validator: booleanValidator, required: true, examples: [true] },
      enduserId: { validator: mongoIdStringValidator },
      userId: { validator: mongoIdStringValidator },
      errorMessage: { validator: stringValidator },
      tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay }, 
    }
  },
  call_hold_queues: {
    info: {},
    constraints: { 
      unique: ['title'], relationship: [], 
      access: [
        { type: 'filter', field: 'userIds' }, 
      ]  
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {
      answer_call: {
        op: "custom", access: 'read', method: "post",
        name: 'Answer Queued Call',
        path: '/call-hold-queues/answer',
        description: "Answers the next call in a hold queue, if available",
        parameters: { 
          queueId: { validator: mongoIdStringValidator, required: true },
        },
        returns: {} 
      },
      get_details: {
        op: "custom", access: 'read', method: "get",
        name: 'Get Queue Details',
        path: '/call-hold-queues/details',
        description: "Gets current details / stats about queue",
        parameters: { },
        returns: {
          queues: {
            validator: listValidatorEmptyOk(objectValidator<TwilioQueue>({
              averageWaitTime: numberValidator,
              currentSize: numberValidator,
              friendlyName: stringValidator,
            }))
          }
        }
      },
    },
    enduserActions: {},
    fields: {
      ...BuiltInFields, 
      title: { validator: stringValidator, required: true, examples: ['Title']},
      userIds: { validator: listOfMongoIdStringValidatorEmptyOk, required: true, examples: [[PLACEHOLDER_ID]] },
    },
  },
  suggested_contacts: {
    info: { description: '' },
    constraints: { unique: [], relationship: [], access: [] },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: {},
    fields: {
      ...BuiltInFields,
      title: { validator: stringValidator, required: true, examples: ['Title'] },
      phone: { validator: phoneValidator, examples: ["+15555555555"] },
      email: { validator: emailValidator, examples: ['test@tellescope.com'] },
    }
  },
  diagnosis_codes: {
    info: { description: '' },
    constraints: { unique: [], relationship: [], access: [] },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: { read: {}, readMany: {} },
    fields: {
      ...BuiltInFields,
      code: { validator: stringValidator, required: true, examples: ['A000'] },
      display: { validator: stringValidator, required: true, examples: ["Cholera due to Vibrio cholerae 01, biovar cholerae"] },
      system: { validator: stringValidator, required: true, examples: ['http://hl7.org/fhir/sid/icd-10-cm'] },
    }
  },
  allergy_codes: {
    info: { description: '' },
    constraints: { unique: [], relationship: [], access: [] },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    enduserActions: { read: {}, readMany: {} },
    fields: {
      ...BuiltInFields,
      code: { validator: stringValidator, required: true, examples: ['6-2754'] },
      display: { validator: stringValidator, required: true, examples: ["minocycline HCl"] },
      system: { validator: stringValidator, required: true, examples: ['http://www.fdbhealth.com/'] },
    }
  },
  integration_logs: {
    info: { description: 'Read Only' },
    constraints: { unique: [], relationship: [], access: [] },
    defaultActions: { read: {}, readMany: {} },
    customActions: {},
    enduserActions: {},
    fields: {
      ...BuiltInFields,
      integration: { validator: stringValidator, readonly: true, examples: ['Canvas'] },
      status: { validator: exactMatchValidator(['Success', 'Error']), readonly: true, examples: ['Error'] },
      type: { validator: stringValidator, readonly: true, examples: ['Patient Create'] },
      payload: { validator: stringValidator, readonly: true, examples: ['{}'] },
      response: { validator: stringValidator, readonly: true, examples: ['{}'] },
      url: { validator: stringValidator, readonly: true, examples: ['https://www.tellescope.com'] },
    }
  },
  enduser_eligibility_results: {
    info: {},
    constraints: { unique: [['externalId', 'source']], relationship: [], },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {
      develop_health_run_benefit_verification: {
        op: "custom", access: 'create', method: "post",
        name: 'Run Benefit Verification (Develop Health)',
        path: '/enduser-eligibility-results/develop-health/run-benefit-verification',
        description: "Runs a medication benefit verification for an enduser",
        parameters: { 
          enduserId: { validator: mongoIdStringValidator, required: true },
          providerUserId: { validator: mongoIdStringValidator, required: true },
          insuranceType: { validator: stringValidator100, examples: ["Primary", "Secondary"] }, // Primary or Secondary
          diagnoses: { 
            validator: developHealthDiagnosesValidator,
            required: true,
          },
          drug_history: {
            validator: objectValidator<{ currently_taking_drugs: { name: string }[], previously_taken_drugs: { name: string }[] }>({
              currently_taking_drugs: listValidatorOptionalOrEmptyOk(objectValidator<{ name: string }>({ name: stringValidator })),
              previously_taken_drugs: listValidatorOptionalOrEmptyOk(objectValidator<{ name: string }>({ name: stringValidator })),
            }),
            required: true,
          }, 
          drugs: { // can't be empty
            validator: developHealthDrugsValidator,
            required: true,
          },
          use_patient_plan_fund_source_check: { validator: booleanValidator },
          mock_result: { validator: developHealthMockResultValidator },
        },
        returns: {
          result: { validator: 'enduser_eligibility_result' as any, required: true },
        }
      }
    },
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
      title: { validator: stringValidator, required: true, examples: ["Drug Name (20mg, x8)"] },
      type: { validator: stringValidator250, required: true, examples: ["Prescription"] },
      externalId: { validator: stringValidator250, required: true, examples: [PLACEHOLDER_ID] },
      source: { validator: stringValidator250, required: true, examples: [DEVELOP_HEALTH_TITLE] },
      status: { validator: stringValidator250, required: true, examples: ["Pending"] },
    }
  },
  agent_records: {
    info: { description: '' },
    constraints: { unique: [], relationship: [], access: [] },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {
      submit_support_ticket: {
        op: "custom", access: 'create', method: "post",
        name: 'Submit Support Ticket',
        path: '/agent-records/submit-ticket',
        description: "Submits a support ticket to Tellescope",
        parameters: { 
          priority: { validator: stringValidator, required: true },
          message: { validator: stringValidator25000, required: true },
        },
        returns: {}
      },
    },
    fields: {
      ...BuiltInFields,
      type: { validator: stringValidator, required: true, examples: ['Article'] },
      title: { validator: stringValidator, required: true, examples: ['Article Title'] },
      description: { validator: stringValidator, required: true, examples: ["Article Description"] },
      url: { validator: stringValidator1000 },
      content: { validator: stringValidator100000OptionalEmptyOkay, examples: ["Article Content"] },
      source: { validator: stringValidator100 },
      externalId: { validator: stringValidator100 },
      pages: { validator: listOfStringsValidatorOptionalOrEmptyOk },
      embedding: { validator: listValidator(numberValidator) },
    }
  },
  waitlists: {
    info: { description: '' },
    constraints: { unique: [], relationship: [], access: [] },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {
      grant_access_from_waitlist: {
        op: "custom", access: 'update', method: "post",
        name: 'Remove from Waitlist',
        path: '/waitlists/grant-access',
        description: "Removes count from waitlist and adds to corresponding Journey",
        parameters: { 
          id: { validator: mongoIdStringRequired, required: true },
          count: { validator: positiveNumberValidator, required: true },
        },
        returns: {
          waitlist: { validator: 'waitlist' as any, required: true },
        },
      },
    },
    fields: {
      ...BuiltInFields,
      title: { validator: stringValidator, required: true, examples: ['Title'] },
      journeyId: { validator: mongoIdStringValidator, required: true, examples: [PLACEHOLDER_ID] },
      enduserIds: { validator: listOfMongoIdStringValidatorEmptyOk, required: true, examples: [[PLACEHOLDER_ID]] },
      tags: { validator: listOfStringsValidatorUniqueOptionalOrEmptyOkay },
    }
  },
  
})

// export type SchemaType = typeof schema
// export type SchemaV1 = SchemaType// & Schema