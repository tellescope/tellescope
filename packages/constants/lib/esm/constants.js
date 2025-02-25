var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
export var ALL_ENDUSER_FIELDS_TO_DISPLAY_NAME = {
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
    relationships: "Relationships",
    accessTags: "Access Tags",
    unsubscribedFromMarketing: "Unsubscribed From Marketing",
    unsubscribedFromPhones: "Unsubscribed From Phone Numbers",
    athenaDepartmentId: "athenahealth Department ID"
};
export var READONLY_ENDUSER_FIELDS_TO_DISPLAY_NAME = {
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
};
export var ENDUSER_FIELD_TYPES = {
    'email': 'email',
    'phone': 'phone',
    'fname': 'string',
    'lname': 'string',
    'dateOfBirth': 'dateString',
    'height': 'number',
    'weight': 'number',
    'Address': 'Address',
    'Insurance': "Insurance",
};
export var PRIMARY_HEX = "#1564bf";
export var SECONDARY_HEX = "#1c4378";
export var ERROR_HEX = "#bf2c15";
export var WARNING_HEX = "#bfab15";
export var ADMIN_ROLE = "Admin";
export var BUSINESS_TYPE = "Business";
export var CREATOR_ONLY_ACCESS = 'creatorOnly';
export var DEFAULT_OPERATIONS = {
    create: {},
    createMany: {},
    update: {},
    read: {},
    readMany: {},
    delete: {}
};
export var ACCESS_ACTION_FOR_OPERATION = {
    create: 'create',
    createMany: 'create',
    update: 'update',
    read: 'read',
    readMany: 'read',
    delete: 'delete'
};
export var PLACEHOLDER_ID = "60398bb15da8abef87ef41f5";
export var USER_SESSION_TYPE = 'user';
export var ENDUSER_SESSION_TYPE = 'enduser';
export var SECONDS_IN_ONE_YEAR = 31560000;
export var UNSEARCHABLE_FIELDS = ['_id', 'id', 'creator', 'createdAt', 'updatedAt', 'businessId', 'enduserId', 'organizationIds', 'sharedWithOrganizations'];
export var QUESTION_GROUP_VALUE_PLACEHOLDER = "_question_group";
export var MM_DD_YYYY_REGEX = /[0-1][0-9]-[0-3][0-9]-[1-2][0-9][0-9][0-9]/;
export var GOOGLE_INTEGRATIONS_TITLE = "Google";
export var PAGER_DUTY_TITLE = "Pager Duty";
export var SMART_METER_TITLE = "Smart Meter";
export var DR_CHRONO_INTEGRATIONS_TITLE = "Dr. Chrono";
export var DR_CHRONO_REDIRECT_URI_ENDING = "/dr-chrono-oauth2-verify";
export var SQUARE_INTEGRATIONS_TITLE = "Square";
export var SQUARE_REDIRECT_URI_ENDING = "/square-oauth2-verify";
export var DIALPAD_INTEGRATIONS_TITLE = "DialPad";
export var DIALPAD_REDIRECT_URI_ENDING = "/dialpad-oauth2-verify";
export var OUTLOOK_INTEGRATIONS_TITLE = "Outlook";
export var MICROSOFT_INTEGRATIONS_TITLE = "Microsoft";
export var OUTLOOK_REDIRECT_URI_ENDING = "/outlook-oauth2-verify";
export var MICROSOFT_OIDC_URI_ENDING = "/microsoft-oidc-verify";
export var ZOHO_TITLE = "Zoho";
export var ZOHO_URI_ENDING = "/zoho-oauth2-verify";
export var ZOOM_TITLE = "Zoom";
export var ZOOM_URI_ENDING = "/zoom-oauth2-verify";
export var OPENAI_TITLE = "OpenAI";
export var HEALTHIE_TITLE = "Healthie";
export var ITERABLE_TITLE = "Iterable";
export var MEDPLUM_TITLE = "Medplum";
export var PHASE_ZERO_TITLE = "Phase Zero";
export var PHOTON_TITLE = "Photon Health";
export var VITAL_TITLE = "Vital";
export var ELATION_TITLE = "Elation";
export var ZUS_TITLE = "Zus";
export var OPEN_LOOP_TITLE = "OpenLoop";
export var CANVAS_TITLE = "Canvas";
export var MFAX_TITLE = "mFax";
export var CANDID_TITLE = "Candid";
export var GOGO_MEDS_TITLE = "GoGoMeds";
export var ATHENA_TITLE = "athenahealth";
export var DOSESPOT_TITLE = "DoseSpot";
export var DOCSUMO_TITLE = "Docsumo";
export var ACTIVE_CAMPAIGN_TITLE = "ActiveCampaign";
export var ZENDESK_INTEGRATIONS_TITLE = "Zendesk";
export var ZENDESK_REDIRECT_URI_ENDING = "/zendesk-oauth2-verify";
export var FULLSCRIPT_INTEGRATIONS_TITLE = "Fullscript";
export var FULLSCRIPT_REDIRECT_URI_ENDING = "/fullscript-oauth2-verify";
export var STRIPE_TITLE = "Stripe";
export var EMOTII_TITLE = "Emotii";
export var DEVELOP_HEALTH_TITLE = "Develop Health";
export var KENDRA_TITLE = "Kendra";
export var CHARGEBEE_TITLE = "Chargebee";
export var ORGANIZATION_WIDE_INTEGRATIONS = [
    OPENAI_TITLE,
    ATHENA_TITLE,
    DOSESPOT_TITLE,
    DOCSUMO_TITLE,
    ZUS_TITLE,
    ELATION_TITLE,
    HEALTHIE_TITLE,
    CANVAS_TITLE,
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
];
export var ONE_MINUTE_IN_MS = 1000 * 60;
export var ONE_HOUR_IN_MS = 60 * ONE_MINUTE_IN_MS; // 1hr
export var ONE_DAY_IN_MS = 24 * ONE_HOUR_IN_MS;
export var ONE_WEEK_IN_MS = ONE_DAY_IN_MS * 7;
export var EMAIL_SYNC_FREQUENCY_IN_MS = ONE_HOUR_IN_MS;
export var UNIQUENESS_VIOLATION = 'Uniqueness Violation';
export var ALL_ACCESS = "All";
export var ASSIGNED_ACCESS = "Assigned";
export var DEFAULT_ACCESS = "Default";
export var NO_ACCESS = null;
export var FULL_ACCESS = {
    create: ALL_ACCESS,
    read: ALL_ACCESS,
    update: ALL_ACCESS,
    delete: ALL_ACCESS,
};
export var ASSIGNED_AND_DEFAULT_ACCESS = {
    create: ASSIGNED_ACCESS,
    read: ASSIGNED_ACCESS,
    update: ASSIGNED_ACCESS,
    delete: NO_ACCESS,
};
export var ASSIGNED_AND_DEFAULT_ACCESS_ALL_CREATE = {
    create: ALL_ACCESS,
    read: ASSIGNED_ACCESS,
    update: ASSIGNED_ACCESS,
    delete: NO_ACCESS,
};
export var DEFAULT_ONLY_ACCESS = {
    create: DEFAULT_ACCESS,
    read: DEFAULT_ACCESS,
    update: DEFAULT_ACCESS,
    delete: NO_ACCESS,
};
export var INACCESSIBLE = {
    create: NO_ACCESS,
    read: NO_ACCESS,
    update: NO_ACCESS,
    delete: NO_ACCESS,
};
export var READ_ONLY_ALL = {
    create: NO_ACCESS,
    read: ALL_ACCESS,
    update: NO_ACCESS,
    delete: NO_ACCESS,
};
export var READ_ONLY_ASSIGNED = {
    create: NO_ACCESS,
    read: ASSIGNED_ACCESS,
    update: NO_ACCESS,
    delete: NO_ACCESS,
};
export var READ_ONLY_DEFAULT = {
    create: NO_ACCESS,
    read: DEFAULT_ACCESS,
    update: NO_ACCESS,
    delete: NO_ACCESS,
};
export var PROVIDER_PERMISSIONS = {
    agent_records: READ_ONLY_ALL,
    integration_logs: READ_ONLY_ALL,
    allergy_codes: READ_ONLY_ALL,
    diagnosis_codes: READ_ONLY_ALL,
    suggested_contacts: READ_ONLY_ALL,
    portal_brandings: INACCESSIBLE,
    webhook_logs: INACCESSIBLE,
    call_hold_queues: {
        create: NO_ACCESS,
        read: DEFAULT_ACCESS,
        update: NO_ACCESS,
        delete: NO_ACCESS,
    },
    ticket_queues: {
        create: NO_ACCESS,
        read: DEFAULT_ACCESS,
        update: NO_ACCESS,
        delete: NO_ACCESS,
    },
    group_mms_conversations: {
        create: ALL_ACCESS,
        read: ASSIGNED_ACCESS,
        update: ASSIGNED_ACCESS,
        delete: NO_ACCESS,
    },
    enduser_encounters: {
        create: ALL_ACCESS,
        read: ASSIGNED_ACCESS,
        update: ASSIGNED_ACCESS,
        delete: NO_ACCESS,
    },
    enduser_orders: {
        create: ALL_ACCESS,
        read: ASSIGNED_ACCESS,
        update: ASSIGNED_ACCESS,
        delete: NO_ACCESS,
    },
    blocked_phones: {
        create: ALL_ACCESS,
        read: DEFAULT_ACCESS,
        update: DEFAULT_ACCESS,
        delete: DEFAULT_ACCESS,
    },
    vital_configurations: {
        create: ALL_ACCESS,
        read: ALL_ACCESS,
        update: ASSIGNED_ACCESS,
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
    apiKeys: INACCESSIBLE,
    automation_steps: INACCESSIBLE,
    automated_actions: ASSIGNED_AND_DEFAULT_ACCESS,
    chats: FULL_ACCESS,
    chat_rooms: ASSIGNED_AND_DEFAULT_ACCESS,
    emails: ASSIGNED_AND_DEFAULT_ACCESS,
    endusers: DEFAULT_ONLY_ACCESS,
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
    users: __assign(__assign({}, READ_ONLY_ALL), { update: 'Default' }),
    notes: ASSIGNED_AND_DEFAULT_ACCESS,
    webhooks: INACCESSIBLE,
    calendar_events: __assign(__assign({}, ASSIGNED_AND_DEFAULT_ACCESS), { delete: ASSIGNED_ACCESS }),
    calendar_event_templates: __assign(__assign({}, ASSIGNED_AND_DEFAULT_ACCESS), { create: NO_ACCESS }),
    calendar_event_RSVPs: __assign(__assign({}, ASSIGNED_AND_DEFAULT_ACCESS), { delete: ASSIGNED_ACCESS }),
    user_logs: INACCESSIBLE,
    user_notifications: __assign(__assign({}, ASSIGNED_AND_DEFAULT_ACCESS), { delete: ASSIGNED_ACCESS }),
    fax_logs: ASSIGNED_AND_DEFAULT_ACCESS,
    enduser_observations: ASSIGNED_AND_DEFAULT_ACCESS,
    enduser_problems: ASSIGNED_AND_DEFAULT_ACCESS,
    forum_posts: ASSIGNED_AND_DEFAULT_ACCESS,
    forums: ASSIGNED_AND_DEFAULT_ACCESS,
    managed_content_records: ASSIGNED_AND_DEFAULT_ACCESS,
    managed_content_record_assignments: __assign(__assign({}, ASSIGNED_AND_DEFAULT_ACCESS), { delete: ASSIGNED_ACCESS }),
    post_comments: ASSIGNED_AND_DEFAULT_ACCESS,
    post_likes: ASSIGNED_AND_DEFAULT_ACCESS,
    comment_likes: ASSIGNED_AND_DEFAULT_ACCESS,
    integrations: FULL_ACCESS,
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
    role_based_access_permissions: READ_ONLY_ALL,
    products: READ_ONLY_ALL,
    purchases: ASSIGNED_AND_DEFAULT_ACCESS,
    purchase_credits: __assign(__assign({}, ASSIGNED_AND_DEFAULT_ACCESS), { delete: NO_ACCESS }),
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
        update: ASSIGNED_ACCESS,
        delete: NO_ACCESS,
    },
};
export var ADMIN_PERMISSIONS = {
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
    apiKeys: FULL_ACCESS,
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
    users: FULL_ACCESS,
    notes: FULL_ACCESS,
    webhooks: FULL_ACCESS,
    calendar_events: FULL_ACCESS,
    calendar_event_templates: FULL_ACCESS,
    calendar_event_RSVPs: FULL_ACCESS,
    automation_steps: FULL_ACCESS,
    user_logs: __assign(__assign({}, FULL_ACCESS), { delete: null }),
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
};
export var PORTAL_DEFAULT_LANDING_TITLE = "Your Portal";
export var PORTAL_DEFAULT_LOGIN_TITLE = "Welcome back!";
export var PORTAL_DEFAULT_LOGIN_DESCRIPTION = "Log in to your account.";
export var PORTAL_DEFAULT_REGISTER_TITLE = "Getting Started";
export var PORTAL_DEFAULT_REGISTER_DESCRIPTION = "Let's create your account.";
export var CPT_CODES = [
    { code: "76641", label: 'ULTRASOUND BREAST COMPLETE' },
    { code: "76642", label: 'ULTRASOUND BREAST LIMITED' },
    { code: "99202", label: "Video call, new patient, up to 20 mins" },
    { code: "99203", label: "Video call, new patient, longer than 20 mins" },
    { code: "99211", label: "Video call, established patient" },
    { code: "99441", label: "Phone call (up to 10 mins) with patient" },
    { code: "99442", label: "Phone call (11-20 mins) with patient" },
    { code: "99421", label: "Async digital evaluation 5-10 mins" },
];
export var HELPDESK_TICKET_CLOSE_REASONS = [
    "Resolved",
    "Transferred",
    "Not needed",
    "Unresponsive",
];
export var AUTOMATED_ACTION_CANCEL_REASONS = [
    'Removed by User',
    'Restarted in Journey',
    'Form Submission',
    'Incoming Communication',
    'Removed by Automation',
];
export var RELATIONSHIP_TYPES = [
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
];
export var get_inverse_relationship_type = function (type) { return (type === 'Child'
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
                                                                : 'Relates To'); };
// maps to HIPAA Individual Relationship Codes (source https://med.noridianmedicare.com/web/jea/topics/claim-submission/patient-relationship-codes)
export var INSURANCE_RELATIONSHIPS_TO_CODE = {
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
    "Emancipated Minor": 36,
    "Organ Donor": 39,
    "Cadaver Donor": 40,
    "Injured Plaintiff": 41,
    "Child Where Insured Has No Financial Responsibility": 43,
    "Life Partner": 53,
    "Other Relationship": "G8",
};
export var INSURANCE_RELATIONSHIPS = Object.keys(INSURANCE_RELATIONSHIPS_TO_CODE);
export var INSURANCE_RELATIONSHIPS_ALPHABETICAL = INSURANCE_RELATIONSHIPS.sort(function (v1, v2) { return v1.localeCompare(v2); });
export var INSURANCE_RELATIONSHIPS_CANVAS_MAPPING = {
    'Child': 'child',
    Spouse: 'spouse',
    "Other Relationship": 'other',
    Self: "self",
    "Injured Plaintiff": 'injured'
};
export var INSURANCE_RELATIONSHIPS_CANVAS = Object.keys(INSURANCE_RELATIONSHIPS_CANVAS_MAPPING);
export var TELLESCOPE_GENDERS = ["Female", "Male", 'Other', 'Unknown'];
export var VITAL_RANGE_CLASSIFICATIONS = ['Target', 'High', 'Low', 'Very High', 'Very Low', 'Critical High', 'Critical Low'];
export var VITAL_UNITS_INFO = {
    "DBP": { label: "Diastolic Blood Pressure" },
    "BPM": { label: "Heart Rate BPM" },
    "LB": { label: "Weight in Pounds" },
    "O2 Sat%": { label: "Blood Oxygen Saturation %" },
    "SBP": { label: "Systolic Blood Pressure" },
    "mg/dL": { label: "Blood Glucose (mg/dL)" },
    "A1C": { label: "A1C" },
};
export var VITAL_UNITS = Object.keys(VITAL_UNITS_INFO);
export var WEIGHT_UNITS = ['LB'];
export var CANDID_MODIFIERS = [
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
];
export var DAYS_OF_WEEK_STARTING_SUNDAY = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
export var CURRENT_POLICY_VERION = "v2.0";
export var BUILT_INS_FOR_SET_FIELDS = [
    'defaultFromPhone',
    'defaultFromEmail',
];
export var BUILT_IN_BOOLEANS_FOR_SET_FIELDS = [
    "useDefaultFromPhoneInAutomations",
    "useDefaultFromEmailInAutomations",
    'lockedFromPortal',
];
export var DOCUMENT_REFERENCE_CODINGS = [
    {
        "system": "http://schemas.canvasmedical.com/fhir/document-reference-category",
        "code": "patientadministrativedocument"
    },
    {
        "system": "http://schemas.canvasmedical.com/fhir/document-reference-category",
        "code": "uncategorizedclinicaldocument"
    },
];
export var PORTAL_PAGES_HIDDEN_BY_DEFAULT = [
    "Orders", "Vitals",
];
export var USER_PERSONAL_EMAIL_OVERRIDE = "personal@tellescope.com";
//# sourceMappingURL=constants.js.map