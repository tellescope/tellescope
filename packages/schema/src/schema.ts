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
} from "@tellescope/types-utilities"
import {
  WEBHOOK_MODELS,

  EnduserSession,
  ChatRoom,
  JourneyState,
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
  AvailabilityBlock,
} from "@tellescope/types-models"

import {
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
  accountTypeValidator,
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
  availabilityBlocksValidator,
  weeklyAvailabilitiesValidator,
  timezoneValidator,
  formTypeValidator,
  managedContentRecordAssignmentTypeValidator,
  listOfGenericAttachmentsValidator,
} from "@tellescope/validation"

import {
  CREATOR_ONLY_ACCESS,
  DEFAULT_OPERATIONS,
  PLACEHOLDER_ID,
  ENDUSER_SESSION_TYPE,
  USER_SESSION_TYPE,
} from "@tellescope/constants"
import { response } from "express"

export type RelationshipConstraintOptions<T> = {
  updates?: Partial<T>
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

export type CustomActions = {
  api_keys: {
    create: CustomAction<{}, { id: string, key: string}>,
  },
  files: {
    prepare_file_upload: CustomAction<{ 
      name: string, 
      size: number, 
      type: string, 
      enduserId?: string, 
      publicRead?: boolean,
      publicName?: string,
    }, 
      { presignedUpload: object, file: File }
    >,
    file_download_URL: CustomAction<{ secureName: string }, { downloadURL: string }>,
  },
  form_responses: {
    prepare_form_response: CustomAction<{ formId: string, enduserId: string, automationStepId?: string, expireAt?: Date }, 
      { accessCode: string, url: string, response: FormResponse,  }>
    ,
    submit_form_response: CustomAction<{ accessCode: string, responses: FormResponseValue[], automationStepId?: string  }, { formResponse: FormResponse }>,
    info_for_access_code: CustomAction<{ accessCode: string }, {
      form: Form, 
      fields: FormField[], 
      response: FormResponse, 
    }>,
  },
  journeys: {
    // update_state: CustomAction<{ updates: Partial<JourneyState>, id: string, name: string }, { updated: Journey }>,
    delete_states: CustomAction<{ id: string, states: string[] }, { updated: Journey }>,
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
    add_to_journey: CustomAction<{ enduserIds: string[], journeyId: string }, { }>, 
  },
  users: {
    display_info: CustomAction<{ }, { fname: string, lname: string, id: string }[]>,
    refresh_session: CustomAction<{}, { user: UserSession, authToken: string }>,
    generate_auth_token: CustomAction<{ id?: string, phone?: string, email?: string, externalId?: string, durationInSeconds?: number }, { 
      authToken: string, 
      enduser?: Enduser,
      user?: User,
    }>,
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
    send_user_email_notification: CustomAction<{ userId: string, message: string, subject?: string }, { }>,
  },
  post_likes: { 
    create: CustomAction<{ postId: string, forumId: string }, { }>,
    unlike_post: CustomAction<{ postId: string, forumId: string }, { }>,
  },
  integrations: {
    generate_google_auth_url: CustomAction<{ }, { authUrl: string, }>, 
    disconnect_google_integration: CustomAction<{}, {}>,
    refresh_oauth2_session: CustomAction<{ title: string }, { access_token: string, expiry_date: number }>, 
  },
  emails: {
    sync_integrations: CustomAction<{ enduserEmail: string }, { newEmails: Email[] }>, 
  },
  calendar_events: {
    get_events_for_user: CustomAction<{ userId: string, from: Date, to?: Date, limit?: number }, { events: CalendarEvent[] }>, 
    generate_meeting_link: CustomAction<{ eventId: string, enduserId: string }, { link: string }>, 
    get_appointment_availability: CustomAction<{ 
      from: Date, calendarEventTemplateId: string, to?: Date, restrictedByState?: boolean, limit?: number,
    }, { 
      availabilityBlocks: AvailabilityBlock[],
    }>,
    book_appointment: CustomAction<{ 
      userId: string, startTime: Date, calendarEventTemplateId: string,
    }, { 
      createdEvent: CalendarEvent,
    }>,
  },
} 

export type PublicActions = {
  endusers: {
    login: CustomAction<
      { id?: string, email?: string, phone?: string, password: string, durationInSeconds: number }, 
      { authToken: string }
    >,
    register: CustomAction<{ 
      emailConsent?: boolean, fname?: string, lname?: string, email: string, password: string,
      termsVersion?: string, termsSigned?: Date,
    }, {  }>,
    request_password_reset: CustomAction<{ email: string, businessId: string }, { }>,
    reset_password: CustomAction<{ resetToken: string, newPassword: string, businessId: string }, { }>,
  },
  users: {
    request_password_reset: CustomAction<{ email: string }, { }>,
    reset_password: CustomAction<{ resetToken: string, newPassword: string }, { }>,
  },
  organizations: {
    get_theme: CustomAction<{ businessId: string }, { theme: OrganizationTheme }>,
  },
  form_responses: {
    session_for_public_form: CustomAction<{ 
      fname?: string, 
      lname?: string, 
      email: string, 
      phone?: string, 
      formId: string, 
      businessId: string 
    }, { accessCode: string, authToken: string, url: string, path: string }>,
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
      unique: ['email', 'phone', 'externalId'],
      relationship: [
        {
          explanation: 'One of email or phone is required',
          evaluate: ({ email, phone }, s, _, method) => {
            // while endusers can be created by Worker without email or phone number, relax this restriction on updates
            if (method === 'update') return

            if (!(email || phone))
              return 'One of email or phone is required'
            } 
        },
        {
          explanation: 'Endusers can only access and modify their own profile',
          evaluate: ({ _id }, _, session) => {
            if (session.type === USER_SESSION_TYPE) return
            if (session.id !== _id?.toString()) return "Endusers may only update their own profile"
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
      add_to_journey: {},
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
      },
      lname: { 
        validator: nameValidator,
      },
      dateOfBirth: { 
        validator: dateValidator,
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
      state: { validator: stateValidator },
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
        },
        returns: { } 
      },
      set_password: {
        op: "custom", access: 'update', method: "post",
        name: 'Set enduser password',
        path: '/set-enduser-password',
        description: "Sets (or resets) an enduser's password. Minimum length 8 characters.",
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
    },
    publicActions: {
      login: {
        op: "custom", access: 'read', method: "post",
        name: 'Login enduser',
        path: '/login-enduser',
        description: "Generates an authentication token for access to enduser-facing endpoints",
        enduserOnly: true, // implemented as authenticate in enduser sdk only
        parameters: { 
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
          businessId: { validator: mongoIdStringValidator, required: true },
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
          businessId: { validator: mongoIdStringValidator, required: true },
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
    constraints: { unique: [], relationship: [], access: [{ type: CREATOR_ONLY_ACCESS }] },
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
    },
    customActions: {
      generate_google_auth_url: {
        op: 'custom', access: 'create', method: 'post',
        path: '/generate-google-auth-url',
        name: 'Generates a link to create a Google integration with Tellescope',
        description: "",
        parameters: {},
        returns: { 
          authUrl: {
            validator: stringValidator, 
            required: true
          },
        }
      },
      disconnect_google_integration: {
        op: 'custom', access: 'delete', method: 'post',
        path: '/disconnect-google-integration',
        name: 'Disconnects an integration with Google',
        description: "",
        parameters: {},
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
      }
    },
  },
  tasks: {
    info: {},
    fields: {
      ...BuiltInFields,   
        text: {
          validator: stringValidator,
          required: true,
          examples: ["Task1", "Task2"]
        },
        completed: {
          validator: booleanValidator,
          examples: BOOLEAN_EXAMPLES,
        },
        description: {
          validator: stringValidator,
        },
        dueDate: {
          validator: dateValidator,
        },
        assignedTo: {
         validator: mongoIdStringValidator,
          dependencies: [{
            dependsOn: ['users'],
            dependencyField: '_id',
            relationship: 'foreignKey',
            onDependencyDelete: 'unset',
          }]
        },
        enduserId: {
          validator: mongoIdStringValidator,
          dependencies: [{
            dependsOn: ['endusers'],
            dependencyField: '_id',
            relationship: 'foreignKey',
            onDependencyDelete: 'unset',
          }]
        },
        subscribers: {
          validator: listOfMongoIdStringValidator,
        },
        subscriberRoles: {
          validator: listOfStringsValidator,
        },
    }, 
    constraints: {
      unique: [], relationship: [],
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
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
        validator: stringValidator25000,
        required: true,
        examples: ["Hi there, this is Sebastian"],
      },
      HTMLContent: {
        validator: stringValidator25000,
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
      readBy: {
        validator: idStringToDateValidator,
      },
      templateId: { validator: mongoIdStringValidator },
      automationStepId: { validator: mongoIdStringValidator },
    }, 
    customActions: {
      sync_integrations: {
        op: "custom", access: 'read', method: "post",
        name: 'Attendee display info',
        path: '/sync-email-integrations',
        description: "Syncs email with external integrations (like Gmail) and returns any newly created messages",
        parameters: { enduserEmail: { validator: emailValidator, required: true } },
        returns: { 
          newEmails: { validator: 'emails' as any, required: true },
        } 
      },
    },
  },
  sms_messages: {
    info: {
      sideEffects: { create: [sideEffects.sendSMSMessages] },
    },
    defaultActions: { 
      create: {
        description: "Sends or logs an SMS message"
      }, createMany: {
        description: "Sends or logs multiple SMS message"
      }, 
      update: {}, read: {}, readMany: {}, delete: {} 
    },
    constraints: {
      unique: [],
      relationship: [
        {
          explanation: "Phone number and phone consent must be set for enduser",
          evaluate: ({ enduserId, logOnly }, deps, _) => {
            if (logOnly === true) return

            const e = deps[enduserId ?? ''] as Enduser
            if (!e) return // not in cache, permit by default, likely during an update
            if (!e.phone) return "Missing phone"
            // if (!e.phoneConsent) return "Missing phone consent"
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
      message: {
        validator: SMSMessageValidator,
        required: true,
        updatesDisabled: true,
        examples: ["Test message"],
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
      readBy: {
        validator: idStringToDateValidator,
      },
      templateId: { validator: mongoIdStringValidator },
      automationStepId: { validator: mongoIdStringValidator },
    }, 
    customActions: {},
  },
  chat_rooms: {
    info: {},
    constraints: { 
      unique: [{ array: 'userIds' }, { array: 'enduserIds' }], 
      relationship: [],
      access: [
        { type: 'filter', field: 'userIds' }, 
        { type: 'filter', field: 'enduserIds' }
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
      }
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
    defaultActions: { create: {}, read: {}, readMany: {}, delete: {} }, // avoid createMany for now
    readFilter: {
      roomId: { required: true },
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
        readonly: true, // create a separate endpoint for storing enduser chats
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
        validator: stringValidator,
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
      readBy: {
        validator: idStringToDateValidator,
      },
      attachments: {
        validator: listOfChatAttachmentsValidator,
      },
      templateId: { validator: mongoIdStringValidator },
      automationStepId: { validator: mongoIdStringValidator },
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
        }
      ],
    },
    defaultActions: { 
      create: { adminOnly: true }, createMany: { adminOnly: true }, delete: { adminOnly: true },
      read: {}, readMany: {}, update: { description: "Users can only be updated by self or an organization admin"} 
    },
    enduserActions: { display_info: {}, read: {}, readMany: {} },
    customActions: {
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
    },
    publicActions: {
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
      username: {
        validator: subdomainValidator,
        readonly: true, // able to set once, then not change (for now, due to email configuration)
        redactions: ['enduser'],
      },
      externalId: {
        validator: stringValidator250,
      },
      fname: {
        validator: nameValidator,
      },
      lname: {
        validator: nameValidator,
      },
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
        validator: accountTypeValidator,
      },
      roles: {
        validator: listOfStringsValidator,
        redactions: ['enduser'],
      },
      acknowledgedIntegrations: { validator: dateValidator },
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
    }
  },
  templates: {
    info: {},
    constraints: { 
      unique: ['title'],
      relationship: [],
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
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
        validator: stringValidator25000,
        required: true,
        examples: ["This is the template message......"],
      },
      html: {
        validator: stringValidator25000,
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
    }
  },
  files: {
    info: {},
    constraints: { unique: [], relationship: [] },
    defaultActions: { read: {}, readMany: {}, update: {}, delete: {} },
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
    },
    enduserActions: { prepare_file_upload: {}, file_download_URL: {}, read: {}, readMany: {}, delete: {} },
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
    customActions: {},
    enduserActions: { create: {}, read: {}, readMany: {} },
    fields: {
      ...BuiltInFields, 
      title: {
        validator: stringValidator100,
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
          onDependencyDelete: 'setNull',
        }]
      },
      automationStepId: {
        validator: mongoIdStringValidator,
      },
      closedForReason: {
        validator: stringValidator,
      },
      closeReasons: {
        validator: listOfStringsValidatorEmptyOk,
      },
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
      }
    }
  },
  forms: {
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
      customGreeting: { validator: stringValidator5000 },
      customSignature: { validator: stringValidator5000 },
      customSubject: { validator: stringValidator5000 },
      allowPublicURL: { validator: booleanValidator },
      intakePhone: { validator: intakePhoneValidator },
      thanksMessage: { validator: stringValidator5000 },
      type: { validator: formTypeValidator },
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
    customActions: {},
    enduserActions: { read: {}, readMany: {} },
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
      description: { validator: stringValidator250 }, 
      intakeField: { validator: stringValidator }, // todo: ensure built-ins are ignored
      isOptional: { validator: booleanValidator },
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
        validator: mongoIdStringValidator,
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
    },
    defaultActions: DEFAULT_OPERATIONS,
    enduserActions: { prepare_form_response: {}, info_for_access_code: {}, submit_form_response: {}, read: {}, readMany: {} },
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
        },
        returns: {
          accessCode: { validator: stringValidator250, required: true },
          url: { validator: stringValidator250, required: true },
          response: { validator: 'form_response' as any, required: true }
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
    },
    publicActions: {
      session_for_public_form: {
        op: "custom", access: 'create', method: "post",
        path: '/session-for-public-form',
        name: 'Generate Session for Public Form',
        description: "Generates a session for filling out a public form.",
        parameters: { 
          email: { validator: emailValidator, required: true },
          formId: { validator: mongoIdStringValidator, required: true },
          businessId: { validator: mongoIdStringValidator, required: true },
          phone: { validator: phoneValidator },
          fname: { validator: nameValidator },
          lname: { validator: nameValidator },
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
    defaultActions: {},
    customActions: {
      configure: {
        op: "custom", access: 'create', method: "post",
        name: 'Configure Webhooks (Admin Only)',
        path: '/configure-webhooks',
        description: "Sets the URL, secret, and initial subscriptions for your organization. Only one webhooks configuration per organization is allowed at this time. Your secret must exceed 15 characters and should be generated randomly.",
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
        description: "Returns current webhook configuration",
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
        description: "Modifies only subscriptions to models included in subscriptionUpdates. To remove subscriptions for a given model, set all values to false.",
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
      relationship: [],
      access: [
        { type: 'filter', field: 'attendees.id' }, 
      ]
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
        parameters: {  
          calendarEventTemplateId: { validator: mongoIdStringValidator, required: true },
          from: { validator: dateValidator, required: true },
          restrictedByState: { validator: booleanValidator },
          to: { validator: dateValidator },
          limit: { validator: nonNegNumberValidator },
        },
        returns: { 
          availabilityBlocks: { validator: availabilityBlocksValidator, required: true }
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
        },
        returns: { 
          createdEvent: { validator: 'calenar_event' as any },
        },
      },
    },
    enduserActions: { read: {}, readMany: {}, get_appointment_availability: {}, book_appointment: {} },
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
      type: { validator: stringValidator100 },
      description: { validator: stringValidator5000 },
      meetingId: { validator: mongoIdStringValidator, readonly: true },
      meetingStatus: { validator: meetingStatusValidator },
      attachments: { validator: listOfGenericAttachmentsValidator },
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
      location: { validator: stringValidator1000 },
      locationNotes: { validator: stringValidator5000 },
      phone: { validator: stringValidator100 }, // leave more generous than phone validator in favor of lower friction
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
    defaultActions: DEFAULT_OPERATIONS,
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
      }
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
    customActions: { },
    enduserActions: { create: {}, createMany: {}, read: {}, readMany: {} },
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
      unique: ['name'], 
      relationship: [],
    },
    defaultActions: { read: { }, update: { adminOnly: true } },
    customActions: { },
    enduserActions: { },
    publicActions: {
      get_theme: {
        op: "custom", access: 'read', method: "get",
        name: 'Get Organization Theme',
        path: '/organization-theme', // follows default format
        description: "Gets theme information for an organization",
        parameters: { 
          businessId: { validator: mongoIdStringValidator },
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
        validator: stringValidator100,
        required: true,
        examples: ["subdomain"],
      },
      subscriptionExpiresAt: { validator: dateValidator },
      subscriptionPeriod: { validator: numberValidator },
      logoVersion: { validator: numberValidator },
      faviconVersion: { validator: numberValidator },
      roles: { validator: listOfStringsValidatorEmptyOk },
      skills: { validator: listOfStringsValidator },
      themeColor: { validator: stringValidator100 },
      enduserDisplayName: { validator: stringValidator100 },
      customPortalURL: { validator: stringValidator250 },
      portalSettings: { validator: portalSettingsValidator },
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
          explanation: 'One of email or phone is required',
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
    },
  }, 
  enduser_tasks: {
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
})

// export type SchemaType = typeof schema
// export type SchemaV1 = SchemaType// & Schema