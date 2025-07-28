import {
  Operation,
} from "@tellescope/types-utilities"
import {
  AccessAction, AccessForResource, AccessPermissions, AccessType, Enduser, EnduserRelationship, FormFieldType, InsuranceRelationship, TellescopeGender,
} from "@tellescope/types-models"

export type EnduserField = keyof Pick<Enduser, 'email' | 'phone' | 'fname' | 'lname' | 'dateOfBirth' | 'height' | 'weight'>

export const ALL_ENDUSER_FIELDS_TO_DISPLAY_NAME = {
  'id': "ID",
  'assignedTo': "Care Team",
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
  source: "Source",
  relationships: "Relationships",
  accessTags: "Access Tags",
  unsubscribedFromMarketing: "Unsubscribed From Marketing",
  unsubscribedFromPhones: "Unsubscribed From Phone Numbers",
  athenaDepartmentId: "athenahealth Department ID",
  termsVersion: "Terms Version",
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
  'email': ['email'],
  'phone': ['phone'],
  'fname': ['string'],
  'lname': ['string'],
  'dateOfBirth': ['dateString'],
  'height': ['number'],
  'weight': ['number'],
  'Address': ['Address'],
  'Insurance': ['Insurance'],
  'termsVersion': ['Hidden Value'],
  'genderIdentity': ['string', 'multiple_choice', 'Select'],
  'pronouns': ['string', 'multiple_choice', 'Select'],
  'timezone': ['Timezone'],
}  as { [K in EnduserField | 'Insurance'] : FormFieldType[]}

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

export const UNSEARCHABLE_FIELDS = ['_id', 'id', 'creator', 'createdAt', 'updatedAt', 'businessId', 'enduserId', 'organizationIds', 'sharedWithOrganizations']

export const QUESTION_GROUP_VALUE_PLACEHOLDER = "_question_group"

export const MM_DD_YYYY_REGEX = /[0-1][0-9]-[0-3][0-9]-[1-2][0-9][0-9][0-9]/

export const GOOGLE_INTEGRATIONS_TITLE = "Google"
export const PAGER_DUTY_TITLE = "Pager Duty"
export const SMART_METER_TITLE = "Smart Meter"
export const DR_CHRONO_INTEGRATIONS_TITLE = "Dr. Chrono"
export const DR_CHRONO_REDIRECT_URI_ENDING = "/dr-chrono-oauth2-verify"
export const SQUARE_INTEGRATIONS_TITLE = "Square"
export const SQUARE_REDIRECT_URI_ENDING = "/square-oauth2-verify"
export const DIALPAD_INTEGRATIONS_TITLE = "DialPad"
export const DIALPAD_REDIRECT_URI_ENDING = "/dialpad-oauth2-verify"
export const OUTLOOK_INTEGRATIONS_TITLE = "Outlook"
export const MICROSOFT_INTEGRATIONS_TITLE = "Microsoft"
export const OUTLOOK_REDIRECT_URI_ENDING = "/outlook-oauth2-verify"
export const MICROSOFT_OIDC_URI_ENDING = "/microsoft-oidc-verify"
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
export const VITAL_TITLE = "Vital"
export const ELATION_TITLE = "Elation"
export const ZUS_TITLE = "Zus"
export const OPEN_LOOP_TITLE = "OpenLoop"
export const CANVAS_TITLE = "Canvas"
export const MFAX_TITLE = "mFax"
export const CANDID_TITLE = "Candid"
export const GOGO_MEDS_TITLE = "GoGoMeds"
export const ATHENA_TITLE = "athenahealth"
export const SUPERDIAL_TITLE = "SuperDial"
export const DOSESPOT_TITLE = "DoseSpot"
export const DOCSUMO_TITLE = "Docsumo"
export const ACTIVE_CAMPAIGN_TITLE = "ActiveCampaign"
export const ZENDESK_INTEGRATIONS_TITLE = "Zendesk"
export const ZENDESK_REDIRECT_URI_ENDING = "/zendesk-oauth2-verify"
export const FULLSCRIPT_INTEGRATIONS_TITLE = "Fullscript"
export const FULLSCRIPT_REDIRECT_URI_ENDING = "/fullscript-oauth2-verify"
export const STRIPE_TITLE = "Stripe"
export const EMOTII_TITLE = "Emotii"
export const DEVELOP_HEALTH_TITLE = "Develop Health"
export const KENDRA_TITLE = "Kendra"
export const CHARGEBEE_TITLE = "Chargebee"
export const CUSTOMER_IO_TITLE = "Customer IO"
export const PUPPETEER_TITLE = "Puppeteer"

// stored in Organization.hasIntegrations
// must also be in ORGANIZATION_WIDE_INTEGRATIONS
export const GENERIC_INTEGRATIONS = [PUPPETEER_TITLE]

export const ORGANIZATION_WIDE_INTEGRATIONS = [
  OPENAI_TITLE, 
  ATHENA_TITLE, 
  DOSESPOT_TITLE, 
  DOCSUMO_TITLE, 
  ZUS_TITLE, 
  ELATION_TITLE, 
  HEALTHIE_TITLE,
  CANVAS_TITLE,
  MEDPLUM_TITLE,
  PAGER_DUTY_TITLE,
  SMART_METER_TITLE,
  // ITERABLE_TITLE, // we now support multiple Iterable connections
  CANDID_TITLE,
  GOGO_MEDS_TITLE,
  PHOTON_TITLE,
  MFAX_TITLE,
  MEDPLUM_TITLE,
  ACTIVE_CAMPAIGN_TITLE,
  EMOTII_TITLE,
  DEVELOP_HEALTH_TITLE,
  CUSTOMER_IO_TITLE,
  SUPERDIAL_TITLE,
  PUPPETEER_TITLE,
]

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
  ai_conversations: ASSIGNED_AND_DEFAULT_ACCESS,
  waitlists: READ_ONLY_ALL,
  agent_records: READ_ONLY_ALL,
  integration_logs: READ_ONLY_ALL,
  allergy_codes: READ_ONLY_ALL,
  diagnosis_codes: READ_ONLY_ALL,
  suggested_contacts: READ_ONLY_ALL,
  portal_brandings: INACCESSIBLE,
  webhook_logs: INACCESSIBLE,
  call_hold_queues: {
    create: NO_ACCESS, // allow for creating self-assigned objects
    read:   DEFAULT_ACCESS, // only by inclusion in userIds should it be accessible by default
    update: NO_ACCESS,
    delete: NO_ACCESS,
  },
  ticket_queues: {
    create: NO_ACCESS, // allow for creating self-assigned objects
    read:   DEFAULT_ACCESS, // only by inclusion in userIds should it be accessible by default
    update: NO_ACCESS,
    delete: NO_ACCESS,
  },
  group_mms_conversations: {
    create: ALL_ACCESS, // allow for creating self-assigned objects
    read:   ASSIGNED_ACCESS, // only by inclusion in userIds should it be accessible by default
    update: ASSIGNED_ACCESS,
    delete: NO_ACCESS,
  },
  enduser_encounters: {
    create: ALL_ACCESS, // allow for creating self-assigned objects
    read:   ASSIGNED_ACCESS, 
    update: ASSIGNED_ACCESS,
    delete: NO_ACCESS,
  },
  enduser_orders: {
    create: ALL_ACCESS, // allow for creating self-assigned objects
    read:   ASSIGNED_ACCESS, 
    update: ASSIGNED_ACCESS,
    delete: NO_ACCESS,
  },
  blocked_phones: {
    create: ALL_ACCESS, // allow for creating self-assigned objects
    read:   DEFAULT_ACCESS, 
    update: DEFAULT_ACCESS,
    delete: DEFAULT_ACCESS,
  },
  vital_configurations: {
    create: ALL_ACCESS, // allow for creating self-assigned objects
    read:   ALL_ACCESS, // need to be able to read global settings to create enduser-specific settings 
    update: ASSIGNED_ACCESS, // only allows updating enduser-specific settings when they can access the enduser, but not global settings
    delete: NO_ACCESS,
  },
  message_template_snippets: READ_ONLY_ALL,
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
  enduser_eligibility_results: ASSIGNED_AND_DEFAULT_ACCESS,
  engagement_events: ASSIGNED_AND_DEFAULT_ACCESS,
  files: ASSIGNED_AND_DEFAULT_ACCESS, 
  forms: READ_ONLY_ALL,
  form_groups: READ_ONLY_ALL,
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
  fax_logs: ASSIGNED_AND_DEFAULT_ACCESS,
  enduser_observations: ASSIGNED_AND_DEFAULT_ACCESS,
  enduser_problems: ASSIGNED_AND_DEFAULT_ACCESS,
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
  table_views: READ_ONLY_ALL,
  prescription_routes: READ_ONLY_ALL,
  email_sync_denials: {
    read: ALL_ACCESS,
    create: ALL_ACCESS,
    delete: NO_ACCESS,
    update: DEFAULT_ACCESS
  },
  ticket_threads: ASSIGNED_AND_DEFAULT_ACCESS_ALL_CREATE,
  ticket_thread_comments: ASSIGNED_AND_DEFAULT_ACCESS_ALL_CREATE,
  flowchart_notes: {
    read: ALL_ACCESS,
    create: ALL_ACCESS,
    update: ASSIGNED_ACCESS, // only update ones they created
    delete: NO_ACCESS,
  },
}

export const ADMIN_PERMISSIONS: AccessPermissions = {
  ai_conversations: FULL_ACCESS,
  waitlists: FULL_ACCESS,
  integration_logs: READ_ONLY_ALL,
  agent_records: FULL_ACCESS,
  enduser_eligibility_results: FULL_ACCESS,
  allergy_codes: FULL_ACCESS,
  diagnosis_codes: FULL_ACCESS,
  suggested_contacts: FULL_ACCESS,
  call_hold_queues: FULL_ACCESS,
  fax_logs: FULL_ACCESS,
  message_template_snippets: FULL_ACCESS,
  portal_brandings: FULL_ACCESS,
  webhook_logs: READ_ONLY_ALL,
  form_groups: FULL_ACCESS,
  flowchart_notes: FULL_ACCESS,
  enduser_problems: FULL_ACCESS,
  prescription_routes: FULL_ACCESS,
  blocked_phones: FULL_ACCESS,
  vital_configurations: FULL_ACCESS,
  enduser_encounters: FULL_ACCESS,
  enduser_orders: FULL_ACCESS,
  group_mms_conversations: FULL_ACCESS,
  ticket_queues: FULL_ACCESS,
  phone_trees: FULL_ACCESS,
  configurations: FULL_ACCESS,
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

export const CPT_CODES: { code: string, label: string }[] = [
  { code: "76641", label: 'ULTRASOUND BREAST COMPLETE' },
  { code: "76642", label: 'ULTRASOUND BREAST LIMITED' },
  { code: "99202", label: "Video call, new patient, up to 20 mins" },
  { code: "99203", label: "Video call, new patient, longer than 20 mins" },
  { code: "99211", label: "Video call, established patient" },
  { code: "99441", label: "Phone call (up to 10 mins) with patient" },
  { code: "99442", label: "Phone call (11-20 mins) with patient" },
  { code: "99421", label: "Async digital evaluation 5-10 mins" },
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
  "Partner",
  'Grandparent',
  'Grandchild',
  'Power of Attorney',
  'Power of Attorney For',
  'Emergency Contact',
  'Emergency Contact For',
  "Care Partner",
  'Relates To',
  "Referring Provider",
  "Referred Patient",
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
: type === 'Partner'
    ? 'Partner'
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
: type === 'Power of Attorney'
    ? 'Power of Attorney For'
: type === 'Power of Attorney For'
    ? 'Power of Attorney'
: type === 'Emergency Contact'
    ? 'Emergency Contact For'
: type === 'Emergency Contact For'
    ? 'Emergency Contact'
: type === 'Referring Provider'
    ? 'Referred Patient'
: type === 'Referred Patient'
    ? 'Referring Provider'
: type === 'Care Partner'
    ? 'Care Partner'
    : 'Relates To'
)

// maps to HIPAA Individual Relationship Codes (source https://med.noridianmedicare.com/web/jea/topics/claim-submission/patient-relationship-codes)
export const INSURANCE_RELATIONSHIPS_TO_CODE: { [K in InsuranceRelationship]: number | string } = {
  Spouse: "01",
  "Grandfather or Grandmother": "04",
  "Grandson or Grandaughter": "05",
  "Nephew or Niece": "07",
  "Foster Child": 10,
  "Ward of the Court": 15,
  "Stepson or Stepdaughter": 17,
  "Self": 18,
  "Child": 19,
  "Employee": 20,
  "Unknown": 21,
  "Handicapped/Dependent": 22,
  "Sponsored Dependent": 23,
  "Dependent of Minor Dependent": 24,
  "Significant Other": 29,
  Mother: 32,
  Father: 33,
  "Emancipated Minor"	: 36,
  "Organ Donor": 39,
  "Cadaver Donor": 40,
  "Injured Plaintiff": 41,
  "Child Where Insured Has No Financial Responsibility": 43,
  "Life Partner": 53,
  "Other Relationship": "G8",
}

export const INSURANCE_RELATIONSHIPS = Object.keys(INSURANCE_RELATIONSHIPS_TO_CODE) as InsuranceRelationship[]
export const INSURANCE_RELATIONSHIPS_ALPHABETICAL = INSURANCE_RELATIONSHIPS.sort((v1, v2) => v1.localeCompare(v2))

export const INSURANCE_RELATIONSHIPS_CANVAS_MAPPING: { [K in InsuranceRelationship]?: string } = {
  'Child': 'child',
  Spouse: 'spouse',
  "Other Relationship": 'other',
  Self: "self",
  "Injured Plaintiff": 'injured'
}
export const INSURANCE_RELATIONSHIPS_CANVAS = Object.keys(INSURANCE_RELATIONSHIPS_CANVAS_MAPPING) as InsuranceRelationship[]

export const TELLESCOPE_GENDERS: TellescopeGender[] = ["Female", "Male", 'Other', 'Unknown']

export const VITAL_RANGE_CLASSIFICATIONS = ['Target','High','Low','Very High','Very Low','Critical High','Critical Low']
export const VITAL_UNITS_INFO: Record<string, { label: string }> = {
  "DBP": { label: "Diastolic Blood Pressure" },
  "BPM": { label: "Heart Rate BPM" },
  "LB": { label: "Weight in Pounds" },
  "O2 Sat%": { label: "Blood Oxygen Saturation %" },
  "SBP": { label: "Systolic Blood Pressure" },
  "mg/dL": { label: "Blood Glucose (mg/dL)" },
  "A1C": { label: "A1C" },
}
export const VITAL_UNITS = Object.keys(VITAL_UNITS_INFO)

export const WEIGHT_UNITS = ['LB']

export const CANDID_MODIFIERS = [
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "32",
  "33",
  "47",
  "50",
  "51",
  "52",
  "53",
  "54",
  "55",
  "56",
  "57",
  "58",
  "59",
  "62",
  "63",
  "66",
  "74",
  "76",
  "77",
  "78",
  "79",
  "80",
  "81",
  "82",
  "90",
  "91",
  "92",
  "93",
  "95",
  "96",
  "97",
  "99",
  "A1",
  "A2",
  "A3",
  "A4",
  "A5",
  "A6",
  "A7",
  "A8",
  "A9",
  "AA",
  "AB",
  "AD",
  "AE",
  "AF",
  "AG",
  "AH",
  "AI",
  "AJ",
  "AK",
  "AM",
  "AO",
  "AP",
  "AQ",
  "AR",
  "AS",
  "AT",
  "AZ",
  "BA",
  "BL",
  "BO",
  "BP",
  "BR",
  "BU",
  "CA",
  "CB",
  "CC",
  "CD",
  "CE",
  "CF",
  "CG",
  "CH",
  "CI",
  "CJ",
  "CK",
  "CL",
  "CM",
  "CN",
  "CR",
  "CS",
  "CT",
  "CO",
  "CQ",
  "E1",
  "E2",
  "E3",
  "E4",
  "EA",
  "EB",
  "EC",
  "ED",
  "EE",
  "EJ",
  "EM",
  "EP",
  "ER",
  "ET",
  "EX",
  "EY",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "FA",
  "FB",
  "FC",
  "FP",
  "FQ",
  "FR",
  "FS",
  "FT",
  "FX",
  "FY",
  "G0",
  "G1",
  "G2",
  "G3",
  "G4",
  "G5",
  "G6",
  "G7",
  "G8",
  "G9",
  "GA",
  "GB",
  "GC",
  "GE",
  "GF",
  "GG",
  "GH",
  "GJ",
  "GK",
  "GL",
  "GM",
  "GN",
  "GO",
  "GP",
  "GQ",
  "GR",
  "GS",
  "GT",
  "GU",
  "GV",
  "GW",
  "GX",
  "GY",
  "GZ",
  "HA",
  "HB",
  "HC",
  "HD",
  "HE",
  "HF",
  "HG",
  "HH",
  "HI",
  "HJ",
  "HK",
  "HL",
  "HM",
  "HN",
  "HO",
  "HP",
  "HQ",
  "HR",
  "HS",
  "HT",
  "HU",
  "HV",
  "HW",
  "HX",
  "HY",
  "HZ",
  "J1",
  "J2",
  "J3",
  "J4",
  "J5",
  "JA",
  "JB",
  "JC",
  "JD",
  "JE",
  "JG",
  "JW",
  "JZ",
  "K0",
  "K1",
  "K2",
  "K3",
  "K4",
  "KA",
  "KB",
  "KC",
  "KD",
  "KE",
  "KF",
  "KG",
  "KH",
  "KI",
  "KJ",
  "KK",
  "KL",
  "KM",
  "KN",
  "KO",
  "KP",
  "KQ",
  "KR",
  "KS",
  "KT",
  "KU",
  "KV",
  "KW",
  "KX",
  "KY",
  "KZ",
  "LC",
  "LD",
  "LL",
  "LM",
  "LR",
  "LS",
  "LT",
  "LU",
  "M2",
  "MA",
  "MB",
  "MC",
  "MD",
  "ME",
  "MF",
  "MG",
  "MH",
  "MS",
  "N1",
  "N2",
  "N3",
  "NB",
  "NR",
  "NU",
  "P1",
  "P2",
  "P3",
  "P4",
  "P5",
  "P6",
  "PA",
  "PB",
  "PC",
  "PD",
  "PI",
  "PL",
  "PM",
  "PN",
  "PO",
  "PS",
  "PT",
  "Q0",
  "Q1",
  "Q2",
  "Q3",
  "Q4",
  "Q5",
  "Q6",
  "Q7",
  "Q8",
  "Q9",
  "QA",
  "QB",
  "QC",
  "QD",
  "QE",
  "QF",
  "QG",
  "QH",
  "QJ",
  "QK",
  "QL",
  "QM",
  "QN",
  "QP",
  "QQ",
  "QR",
  "QS",
  "QT",
  "QW",
  "QX",
  "QY",
  "QZ",
  "RA",
  "RB",
  "RC",
  "RD",
  "RE",
  "RI",
  "RR",
  "RT",
  "SA",
  "SB",
  "SC",
  "SD",
  "SE",
  "SF",
  "SG",
  "SH",
  "SJ",
  "SL",
  "SM",
  "SN",
  "SQ",
  "SS",
  "ST",
  "SU",
  "SV",
  "SW",
  "SY",
  "T1",
  "T2",
  "T3",
  "T4",
  "T5",
  "T6",
  "T7",
  "T8",
  "T9",
  "TA",
  "TB",
  "TC",
  "TD",
  "TE",
  "TF",
  "TG",
  "TH",
  "TJ",
  "TK",
  "TL",
  "TM",
  "TN",
  "TP",
  "TQ",
  "TR",
  "TS",
  "TT",
  "TU",
  "TV",
  "TW",
  "U1",
  "U2",
  "U3",
  "U4",
  "U5",
  "U6",
  "U7",
  "U8",
  "U9",
  "UA",
  "UB",
  "UC",
  "UD",
  "UE",
  "UF",
  "UG",
  "UH",
  "UJ",
]

export const DAYS_OF_WEEK_STARTING_SUNDAY = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday", 
  "Friday", 
  "Saturday",
]

export const CURRENT_POLICY_VERION = "v2.0"

export const BUILT_INS_FOR_SET_FIELDS: (keyof Enduser)[] = [
  'defaultFromPhone',
  'defaultFromEmail',
]
export const BUILT_IN_BOOLEANS_FOR_SET_FIELDS: (keyof Enduser)[] = [
  "useDefaultFromPhoneInAutomations",
  "useDefaultFromEmailInAutomations",
  'lockedFromPortal',
]

export const DOCUMENT_REFERENCE_CODINGS = [
  {
    "system": "http://schemas.canvasmedical.com/fhir/document-reference-category",
    "code": "patientadministrativedocument"
  },
  {
    "system": "http://schemas.canvasmedical.com/fhir/document-reference-category",
    "code": "uncategorizedclinicaldocument"
  },
]

export const DOCUMENT_TYPE_CODINGS = [
  // read-only can't be posted to Canvas API
  // { system: "http://loinc.org", code: "51852-2", display: "Letters (read-only)" },
  // { system: "http://loinc.org", code: "34895-3", display: "Educational Material (read-only)" },
  // { system: "http://loinc.org", code: "94093-2", display: "Invoices/Itemized Bill (read-only)" },
  { system: "http://loinc.org", code: "53243-2", display: "Advance Beneficiary Notice" },
  { system: "http://loinc.org", code: "42348-3", display: "Advance Directive / Living Will" },
  { system: "http://loinc.org", code: "91983-7", display: "Care Management" },
  { system: "http://loinc.org", code: "53245-7", display: "CDL (Commercial Driver License)" },
  { system: "http://loinc.org", code: "96335-5", display: "Emergency Department Report" },
  { system: "http://loinc.org", code: "11503-0", display: "External Medical Records" },
  { system: "http://loinc.org", code: "75503-3", display: "Home Care Report" },
  { system: "http://loinc.org", code: "34105-7", display: "Hospital Discharge Summary" },
  { system: "http://loinc.org", code: "47039-3", display: "Hospital History & Physical" },
  { system: "http://loinc.org", code: "64290-0", display: "Insurance Card" },
  { system: "http://loinc.org", code: "52034-6", display: "Insurer Prior Authorization" },
  { system: "http://loinc.org", code: "34113-1", display: "Nursing Home" },
  { system: "http://loinc.org", code: "11504-8", display: "Operative Report" },
  { system: "http://loinc.org", code: "80570-5", display: "Patient Agreement" },
  { system: "http://loinc.org", code: "64285-0", display: "Patient Clinical Intake Form" },
  { system: "http://loinc.org", code: "51848-0", display: "Physical Exams" },
  { system: "http://loinc.org", code: "46209-3", display: "POLST (Provider Order for Life Sustaining-Treatment)" },
  { system: "http://loinc.org", code: "64298-3", display: "Power of Attorney" },
  { system: "http://loinc.org", code: "57833-6", display: "Prescription Refill Request" },
  { system: "http://loinc.org", code: "34823-5", display: "Rehabilitation Report" },
  { system: "http://loinc.org", code: "101904-1", display: "Release of Information Request" },
  { system: "http://loinc.org", code: "34109-9", display: "Uncategorized Clinical Document" },
  { system: "http://loinc.org", code: "51851-4", display: "Uncategorized Administrative Document" },
  { system: "http://loinc.org", code: "52070-0", display: "Worker's Compensation Documents" },
]

export const PORTAL_PAGES_HIDDEN_BY_DEFAULT = [
  "Orders", "Vitals",
]

export const USER_PERSONAL_EMAIL_OVERRIDE = "personal@tellescope.com"

export const TELLESCOPE_PORTAL_SOURCE = "Tellescope Portal"

export type AthenaDocumentType = (
  "admin"
| "clinicaldocument"
// | "encounterdocument"
| "imagingresult"
| "labresult"
| "medicalrecord"
// | "signedorder"
// | "patientcase"
| "phonemessage"
| "physicianauth"
// | "prescription"
)
export const ATHENA_DOCUMENT_TYPES_TO_DISPLAY: { [key in AthenaDocumentType]: { display: string, subclasses: string[], sources: string[] } } = {
  admin: { 
    display: "Admin", 
    subclasses: [
      "ADMIN",
      "BILLING",
      "CONSENT",
      "HIPAA",
      "INSURANCEAPPROVAL",
      "INSURANCECARD",
      "INSURANCEDENIAL",
      "LEGAL",
      "MEDICALRECORDREQ",
      "MUDUNNINGLETTER",
      "REFERRAL",
      "SIGNEDFORMSLETTERS",
      "VACCINATIONRECORD",
    ],
    sources: [],
  },
  clinicaldocument: { 
    display: "Clinical Document", 
    subclasses: [
      "CLINICALDOCUMENT",
      "ADMISSIONDISCHARGE",
      "CONSULTNOTE",
      "MENTALHEALTH",
      "OPERATIVENOTE",
      "URGENTCARE",
    ],
    sources: [],
  },
  // encounterdocument: { 
  //   display: "Encounter Document", 
  //   subclasses: [
  //     "IMAGEDOC",
  //     "PATIENTHISTORY",
  //     "PROCEDUREDOC",
  //     "PROGRESSNOTE",
  //   ],
  //   sources: [],
  // },
  imagingresult: { display: "Imaging Result", subclasses: [], sources: [] },
  labresult: { display: "Lab Result", subclasses: [], sources: [] },
  medicalrecord: { 
    display: "Medical Record", 
    subclasses: [
      "CHARTTOABSTRACT",
      "COUMADIN",
      "GROWTHCHART",
      "HISTORICAL",
      "PATIENTDIARY",
      "VACCINATION",
    ],
    sources: [],
  },
  // signedorder: { display: "Signed Order", subclasses: [], sources: [] },
  // patientcase: { // unimplemented for now -- requires an ordering provider id as well as sources, which is overcomplicated
  //   display: "Patient Case", 
  //   subclasses: [

  //   ], 
  //   sources: [
  //     "PATIENT",
  //     "CAREGIVER",
  //     "PARTNER",
  //     "PHARMACY",
  //     "LAB",
  //     "PCP",
  //     "SPECIALIST",
  //     "STAFF",
  //     "HOSPITAL",
  //     "OTHER",
  //     "PORTAL",
  //     "Live Operator",
  //   ],
  // },
  phonemessage: { display: "Phone Message", subclasses: [], sources: [] },
  physicianauth: { 
    display: "Physician Auth", 
    subclasses: [
      "PHYSICIANAUTH",
      "CAREPLANOVERSIGHT",
    ], 
    sources: [],
  },
  // prescription: { display: "Prescription", subclasses: [], sources: [] },
}
