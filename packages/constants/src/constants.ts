import {
  Operation,
} from "@tellescope/types-utilities"
import {
  AccessAction, AccessForResource, AccessPermissions, AccessType, Enduser, EnduserRelationship, FormFieldType,
} from "@tellescope/types-models"

export type EnduserField = keyof Pick<Enduser, 'email' | 'phone' | 'fname' | 'lname' | 'dateOfBirth' | 'height' | 'weight'>

export const ALL_ENDUSER_FIELDS_TO_DISPLAY_NAME = {
  'fname': 'First Name',
  'lname': 'Last Name',
  'email': 'Email',
  'phone': 'Phone Number',
  'dateOfBirth': 'Date of Birth',
  'height': 'Height (inches)',
  'weight': 'Weight (pounds)',
  'gender': "Gender",
  'tags': "Tags",
  journeys: "Journeys",
  'addressLineOne': "Address",
  'addressLineTwo': "Address Line Two",
  'city': "City",
  'state': "State",
  'zipCode': "ZIP Code",
  landline: "Landline",
  timezone: "Timezone",
  mname: "Middle Name",
  externalId: "External ID",
  relationships: "Relationships",
} satisfies { [K in keyof Enduser]?: string }

export const READONLY_ENDUSER_FIELDS_TO_DISPLAY_NAME = {
  recentFormSubmittedAt: "Recent Form Submitted At",
  recentEventBookedAt: "Recent Event Booked At", 
  recentOutboundCallAt: "Recent Outbound Call Made At",
  recentInboundCallAt: "Recent Inbound Call Made At",
  recentOutboundChatAt: "Recent Outbound Chat Sent At",
  recentInboundChatAt: "Recent Inbound Chat Sent At",
  recentOutboundSMSAt: "Recent Outbound SMS Sent At",
  recentInboundSMSAt: "Recent Inbound SMS Sent At",
  recentOutboundEmailAt: "Recent Outbound Email Sent At",
  recentInboundEmailAt: "Recent Inbound Email Sent At",
} satisfies { [K in keyof Enduser]?: string }

export const ENDUSER_FIELD_TYPES = { 
  'email': 'email',
  'phone': 'phone',
  'fname': 'string',
  'lname': 'string',
  'dateOfBirth': 'dateString',
  'height': 'number',
  'weight': 'number',
  'Address': 'Address'
}  as { [K in EnduserField] : FormFieldType}

export const PRIMARY_HEX = "#1564bf"
export const SECONDARY_HEX = "#1c4378"
export const ERROR_HEX = "#bf2c15"
export const WARNING_HEX = "#bfab15"

export const ADMIN_ROLE = "Admin"

export const BUSINESS_TYPE = "Business"
export const CREATOR_ONLY_ACCESS = 'creatorOnly'
export const DEFAULT_OPERATIONS: { [K in Operation]: { title?: string, description?: string, sideEffects?: [] }} = {
  create: {}, 
  createMany: {}, 
  update: {}, 
  read: {}, 
  readMany: {}, 
  delete: {}
}

export const ACCESS_ACTION_FOR_OPERATION: { [K in Operation]: AccessAction} = {
  create: 'create', 
  createMany: 'create',
  update: 'update', 
  read:   'read', 
  readMany: 'read', 
  delete: 'delete'
}

export const PLACEHOLDER_ID = "60398bb15da8abef87ef41f5"

export const USER_SESSION_TYPE = 'user'
export const ENDUSER_SESSION_TYPE = 'enduser'

export const SECONDS_IN_ONE_YEAR = 31560000

export const UNSEARCHABLE_FIELDS = ['_id', 'id', 'creator', 'createdAt', 'updatedAt', 'businessId', 'externalId', 'enduserId']

export const QUESTION_GROUP_VALUE_PLACEHOLDER = "_question_group"

export const MM_DD_YYYY_REGEX = /[0-1][0-9]-[0-3][0-9]-[1-2][0-9][0-9][0-9]/

export const GOOGLE_INTEGRATIONS_TITLE = "Google"
export const DR_CHRONO_INTEGRATIONS_TITLE = "Dr. Chrono"
export const DR_CHRONO_REDIRECT_URI_ENDING = "/dr-chrono-oauth2-verify"
export const SQUARE_INTEGRATIONS_TITLE = "Square"
export const SQUARE_REDIRECT_URI_ENDING = "/square-oauth2-verify"
export const DIALPAD_INTEGRATIONS_TITLE = "DialPad"
export const DIALPAD_REDIRECT_URI_ENDING = "/dialpad-oauth2-verify"
export const OUTLOOK_INTEGRATIONS_TITLE = "Outlook"
export const OUTLOOK_REDIRECT_URI_ENDING = "/outlook-oauth2-verify"
export const ZOHO_TITLE = "Zoho"
export const ZOHO_URI_ENDING = "/zoho-oauth2-verify"
export const ZOOM_TITLE = "Zoom"
export const ZOOM_URI_ENDING = "/zoom-oauth2-verify"
export const OPENAI_TITLE = "OpenAI"
export const HEALTHIE_TITLE = "Healthie"
export const ITERABLE_TITLE = "Iterable"
export const MEDPLUM_TITLE = "Medplum"
export const PHASE_ZERO_TITLE = "Phase Zero"
export const PHOTON_TITLE = "Photon Health"
export const ELATION_TITLE = "Elation"
export const ZUS_TITLE = "Zus"
export const ZENDESK_INTEGRATIONS_TITLE = "Zendesk"
export const ZENDESK_REDIRECT_URI_ENDING = "/zendesk-oauth2-verify"
export const FULLSCRIPT_INTEGRATIONS_TITLE = "Fullscript"
export const FULLSCRIPT_REDIRECT_URI_ENDING = "/fullscript-oauth2-verify"

export const ORGANIZATION_WIDE_INTEGRATIONS = [OPENAI_TITLE]

export const ONE_MINUTE_IN_MS = 1000 * 60
export const ONE_HOUR_IN_MS   = 60 * ONE_MINUTE_IN_MS // 1hr
export const ONE_DAY_IN_MS    = 24 * ONE_HOUR_IN_MS
export const ONE_WEEK_IN_MS   = ONE_DAY_IN_MS * 7

export const EMAIL_SYNC_FREQUENCY_IN_MS = ONE_HOUR_IN_MS

export const UNIQUENESS_VIOLATION = 'Uniqueness Violation'

export const ALL_ACCESS: AccessType      = "All"
export const ASSIGNED_ACCESS: AccessType = "Assigned"
export const DEFAULT_ACCESS: AccessType  = "Default"
export const NO_ACCESS: AccessType       = null

export const FULL_ACCESS: AccessForResource = {   
  create: ALL_ACCESS,
  read:   ALL_ACCESS,
  update: ALL_ACCESS,
  delete: ALL_ACCESS,
}
export const ASSIGNED_AND_DEFAULT_ACCESS: AccessForResource = {
  create: ASSIGNED_ACCESS, // allow for creating self-assigned objects
  read:   ASSIGNED_ACCESS,
  update: ASSIGNED_ACCESS,
  delete: NO_ACCESS,
}
export const ASSIGNED_AND_DEFAULT_ACCESS_ALL_CREATE: AccessForResource = {
  create: ALL_ACCESS, // allow for creating self-assigned objects
  read:   ASSIGNED_ACCESS,
  update: ASSIGNED_ACCESS,
  delete: NO_ACCESS,
}
export const DEFAULT_ONLY_ACCESS: AccessForResource = {   
  create: DEFAULT_ACCESS,
  read:   DEFAULT_ACCESS,
  update: DEFAULT_ACCESS,
  delete: NO_ACCESS,
}
export const INACCESSIBLE: AccessForResource = {
  create: NO_ACCESS,
  read:   NO_ACCESS,
  update: NO_ACCESS,
  delete: NO_ACCESS,
}
export const READ_ONLY_ALL: AccessForResource = {
  create: NO_ACCESS,
  read:   ALL_ACCESS,
  update: NO_ACCESS,
  delete: NO_ACCESS,
}
export const READ_ONLY_ASSIGNED: AccessForResource = {
  create: NO_ACCESS,
  read:   ASSIGNED_ACCESS,
  update: NO_ACCESS,
  delete: NO_ACCESS,
}
export const READ_ONLY_DEFAULT: AccessForResource = {
  create: NO_ACCESS,
  read:   DEFAULT_ACCESS,
  update: NO_ACCESS,
  delete: NO_ACCESS,
}

export const PROVIDER_PERMISSIONS: AccessPermissions = {
  enduser_custom_types: READ_ONLY_ALL,
  superbill_providers: READ_ONLY_ALL,
  superbills: ASSIGNED_AND_DEFAULT_ACCESS,
  enduser_medications: ASSIGNED_AND_DEFAULT_ACCESS,
  automation_triggers: READ_ONLY_ALL,
  availability_blocks: READ_ONLY_ALL,
  analytics_frames: READ_ONLY_ALL,
  api_keys: INACCESSIBLE,
  apiKeys: INACCESSIBLE, // backwards compatibility with legacy webapp usage
  automation_steps: INACCESSIBLE,
  automated_actions: ASSIGNED_AND_DEFAULT_ACCESS,
  chats: FULL_ACCESS, // access is later filtered by chat rooms
  chat_rooms:  ASSIGNED_AND_DEFAULT_ACCESS,
  emails: ASSIGNED_AND_DEFAULT_ACCESS,
  endusers: DEFAULT_ONLY_ACCESS, // equivalent to assigned access, but more efficient in this case
  enduser_status_updates: ASSIGNED_AND_DEFAULT_ACCESS,
  engagement_events: ASSIGNED_AND_DEFAULT_ACCESS,
  files: ASSIGNED_AND_DEFAULT_ACCESS, 
  forms: READ_ONLY_ALL,
  form_fields: READ_ONLY_ALL,
  form_responses: ASSIGNED_AND_DEFAULT_ACCESS, 
  journeys: READ_ONLY_ALL,
  meetings: ASSIGNED_AND_DEFAULT_ACCESS,
  sms_messages: ASSIGNED_AND_DEFAULT_ACCESS,
  tickets: ASSIGNED_AND_DEFAULT_ACCESS,
  templates: READ_ONLY_ALL,
  organizations: READ_ONLY_ALL,
  appointment_booking_pages: INACCESSIBLE,
  appointment_locations: READ_ONLY_ALL,
  phone_calls: ASSIGNED_AND_DEFAULT_ACCESS,
  enduser_profile_views: READ_ONLY_ALL,
  phone_trees: READ_ONLY_ALL,
  configurations: READ_ONLY_ALL,
  users: {
    ...READ_ONLY_ALL,
    update: 'Default', // allow updating self, separate restriction exists to prevent updating other users if non-admin
  },
  notes: ASSIGNED_AND_DEFAULT_ACCESS,
  webhooks: INACCESSIBLE,
  calendar_events: {
    ...ASSIGNED_AND_DEFAULT_ACCESS,
    delete: ASSIGNED_ACCESS,
  },
  calendar_event_templates: {
    ...ASSIGNED_AND_DEFAULT_ACCESS,
    create: NO_ACCESS,
  },
  calendar_event_RSVPs: {
    ...ASSIGNED_AND_DEFAULT_ACCESS,
    delete: ASSIGNED_ACCESS,
  },
  user_logs: INACCESSIBLE,
  user_notifications: {
    ...ASSIGNED_AND_DEFAULT_ACCESS,
    delete: ASSIGNED_ACCESS,
  },
  enduser_observations: ASSIGNED_AND_DEFAULT_ACCESS,
  forum_posts: ASSIGNED_AND_DEFAULT_ACCESS,
  forums: ASSIGNED_AND_DEFAULT_ACCESS,
  managed_content_records: ASSIGNED_AND_DEFAULT_ACCESS,
  managed_content_record_assignments: {
    ...ASSIGNED_AND_DEFAULT_ACCESS,
    delete: ASSIGNED_ACCESS,
  },
  post_comments: ASSIGNED_AND_DEFAULT_ACCESS,
  post_likes: ASSIGNED_AND_DEFAULT_ACCESS,
  comment_likes: ASSIGNED_AND_DEFAULT_ACCESS,
  integrations: FULL_ACCESS, // controlled by creator only
  databases: {
    read: ALL_ACCESS,
    create: NO_ACCESS,
    delete: NO_ACCESS,
    update: NO_ACCESS
  },
  database_records: {
    read: DEFAULT_ACCESS,
    create: NO_ACCESS,
    delete: NO_ACCESS,
    update: NO_ACCESS
  },
  portal_customizations: INACCESSIBLE,
  care_plans: ASSIGNED_AND_DEFAULT_ACCESS,
  enduser_tasks: ASSIGNED_AND_DEFAULT_ACCESS,
  role_based_access_permissions: READ_ONLY_ALL, // also controlled by adminOnly in schema
  products: READ_ONLY_ALL,
  purchases: ASSIGNED_AND_DEFAULT_ACCESS,
  purchase_credits: {
    ...ASSIGNED_AND_DEFAULT_ACCESS,
    delete: NO_ACCESS,
  },
  background_errors: INACCESSIBLE,
  enduser_views: READ_ONLY_ALL,
  referral_providers: READ_ONLY_ALL,
  table_views: READ_ONLY_ALL,
  email_sync_denials: {
    read: ALL_ACCESS,
    create: ALL_ACCESS,
    delete: NO_ACCESS,
    update: DEFAULT_ACCESS
  },
  ticket_threads: ASSIGNED_AND_DEFAULT_ACCESS_ALL_CREATE,
  ticket_thread_comments: ASSIGNED_AND_DEFAULT_ACCESS_ALL_CREATE,
}

export const ADMIN_PERMISSIONS: AccessPermissions = {
  phone_trees: FULL_ACCESS,
  configurations: FULL_ACCESS,
  referral_providers: FULL_ACCESS,
  superbill_providers: FULL_ACCESS,
  superbills: FULL_ACCESS,
  automation_triggers: FULL_ACCESS,
  background_errors: FULL_ACCESS,
  enduser_views: FULL_ACCESS,
  availability_blocks: FULL_ACCESS,
  analytics_frames: FULL_ACCESS,
  appointment_locations: FULL_ACCESS,
  api_keys: FULL_ACCESS,
  appointment_booking_pages: FULL_ACCESS,
  apiKeys: FULL_ACCESS, // backwards compatibility with legacy webapp usage
  automated_actions: FULL_ACCESS,
  chat_rooms: FULL_ACCESS,
  emails: FULL_ACCESS,
  endusers: FULL_ACCESS,
  enduser_status_updates: FULL_ACCESS,
  engagement_events: FULL_ACCESS,
  files: FULL_ACCESS, 
  forms: FULL_ACCESS,
  form_fields: FULL_ACCESS,
  form_responses: FULL_ACCESS, 
  journeys: FULL_ACCESS,
  meetings: FULL_ACCESS,
  chats: FULL_ACCESS,
  sms_messages: FULL_ACCESS,
  tickets: FULL_ACCESS,
  templates: FULL_ACCESS,
  users: FULL_ACCESS, // create and delete adminOnly
  notes: FULL_ACCESS,
  webhooks: FULL_ACCESS,
  calendar_events: FULL_ACCESS,
  calendar_event_templates: FULL_ACCESS,
  calendar_event_RSVPs: FULL_ACCESS,
  automation_steps: FULL_ACCESS,
  user_logs: {
    ...FULL_ACCESS,
    delete: null,
  },
  user_notifications: FULL_ACCESS,
  enduser_observations: FULL_ACCESS,
  forum_posts: FULL_ACCESS,
  forums: FULL_ACCESS,
  managed_content_records: FULL_ACCESS,
  post_comments: FULL_ACCESS,
  post_likes: FULL_ACCESS,
  comment_likes: FULL_ACCESS,
  organizations: FULL_ACCESS,
  integrations: FULL_ACCESS,
  databases: FULL_ACCESS,
  database_records: FULL_ACCESS,
  portal_customizations: FULL_ACCESS,
  care_plans: FULL_ACCESS,
  enduser_tasks: FULL_ACCESS,
  managed_content_record_assignments: FULL_ACCESS,
  role_based_access_permissions: FULL_ACCESS,
  products: FULL_ACCESS,
  purchase_credits: FULL_ACCESS,
  purchases: FULL_ACCESS,
  phone_calls: FULL_ACCESS,
  enduser_profile_views: FULL_ACCESS,
  enduser_medications: FULL_ACCESS,
  enduser_custom_types: FULL_ACCESS,
  table_views: FULL_ACCESS,
  email_sync_denials: FULL_ACCESS,
  ticket_threads: FULL_ACCESS,
  ticket_thread_comments: FULL_ACCESS,
}

export const PORTAL_DEFAULT_LANDING_TITLE = "Your Portal"
export const PORTAL_DEFAULT_LOGIN_TITLE = "Welcome back!"
export const PORTAL_DEFAULT_LOGIN_DESCRIPTION = "Log in to your account."
export const PORTAL_DEFAULT_REGISTER_TITLE = "Getting Started"
export const PORTAL_DEFAULT_REGISTER_DESCRIPTION = "Let's create your account."

export const CPT_CODES: { code: number, label: string }[] = [
  { code: 76641, label: 'ULTRASOUND BREAST COMPLETE' },
  { code: 76642, label: 'ULTRASOUND BREAST LIMITED' },
  { code: 99202, label: "Video call, new patient, up to 20 mins" },
  { code: 99203, label: "Video call, new patient, longer than 20 mins" },
  { code: 99211, label: "Video call, established patient" },
  { code: 99441, label: "Phone call (up to 10 mins) with patient" },
  { code: 99442, label: "Phone call (11-20 mins) with patient" },
  { code: 99421, label: "Async digital evaluation 5-10 mins" },
]

export const HELPDESK_TICKET_CLOSE_REASONS = [
  "Resolved",
  "Transferred",
  "Not needed",
  "Unresponsive",
]

export const AUTOMATED_ACTION_CANCEL_REASONS = [
  'Removed by User',
  'Restarted in Journey',
  'Form Submission',
  'Incoming Communication',
  'Removed by Automation',
] as const

export const RELATIONSHIP_TYPES = [
  'Caregiver',
  // 'Caretaker',
  'Care Recipient',
  'Parent',
  'Child',
  'Sibling',
  'Spouse',
  'Grandparent',
  'Grandchild',
  'Relates To'
] satisfies EnduserRelationship['type'][]

export const get_inverse_relationship_type = (type: EnduserRelationship['type']): EnduserRelationship['type'] => (
  type === 'Child'
    ? 'Parent'
: type === 'Parent'
    ? 'Child'
: type === 'Sibling'
    ? 'Sibling'
: type === 'Spouse'
    ? 'Spouse'
: type === 'Care Recipient'
    ? 'Caregiver'
: type === 'Caregiver'
    ? 'Care Recipient'
// : type === 'Caretaker'
//     ? 'Care Recipient'
: type === 'Grandparent'
    ? 'Grandchild'
: type === 'Grandchild'
    ? 'Grandparent'
    : 'Relates To'
)