"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOGO_MEDS_TITLE = exports.CANDID_TITLE = exports.MFAX_TITLE = exports.CANVAS_TITLE = exports.OPEN_LOOP_TITLE = exports.ZUS_TITLE = exports.ELATION_TITLE = exports.VITAL_TITLE = exports.PHOTON_TITLE = exports.PHASE_ZERO_TITLE = exports.MEDPLUM_TITLE = exports.ITERABLE_TITLE = exports.HEALTHIE_TITLE = exports.OPENAI_TITLE = exports.ZOOM_URI_ENDING = exports.ZOOM_TITLE = exports.ZOHO_URI_ENDING = exports.ZOHO_TITLE = exports.MICROSOFT_OIDC_URI_ENDING = exports.OUTLOOK_REDIRECT_URI_ENDING = exports.MICROSOFT_INTEGRATIONS_TITLE = exports.OUTLOOK_INTEGRATIONS_TITLE = exports.DIALPAD_REDIRECT_URI_ENDING = exports.DIALPAD_INTEGRATIONS_TITLE = exports.SQUARE_REDIRECT_URI_ENDING = exports.SQUARE_INTEGRATIONS_TITLE = exports.DR_CHRONO_REDIRECT_URI_ENDING = exports.DR_CHRONO_INTEGRATIONS_TITLE = exports.SMART_METER_TITLE = exports.PAGER_DUTY_TITLE = exports.GOOGLE_INTEGRATIONS_TITLE = exports.MM_DD_YYYY_REGEX = exports.QUESTION_GROUP_VALUE_PLACEHOLDER = exports.UNSEARCHABLE_FIELDS = exports.SECONDS_IN_ONE_YEAR = exports.ENDUSER_SESSION_TYPE = exports.USER_SESSION_TYPE = exports.PLACEHOLDER_ID = exports.ACCESS_ACTION_FOR_OPERATION = exports.DEFAULT_OPERATIONS = exports.CREATOR_ONLY_ACCESS = exports.BUSINESS_TYPE = exports.ADMIN_ROLE = exports.WARNING_HEX = exports.ERROR_HEX = exports.SECONDARY_HEX = exports.PRIMARY_HEX = exports.ENDUSER_FIELD_TYPES = exports.READONLY_ENDUSER_FIELDS_TO_DISPLAY_NAME = exports.ALL_ENDUSER_FIELDS_TO_DISPLAY_NAME = void 0;
exports.INSURANCE_RELATIONSHIPS_CANVAS_MAPPING = exports.INSURANCE_RELATIONSHIPS_ALPHABETICAL = exports.INSURANCE_RELATIONSHIPS = exports.INSURANCE_RELATIONSHIPS_TO_CODE = exports.get_inverse_relationship_type = exports.RELATIONSHIP_TYPES = exports.AUTOMATED_ACTION_CANCEL_REASONS = exports.HELPDESK_TICKET_CLOSE_REASONS = exports.CPT_CODES = exports.PORTAL_DEFAULT_REGISTER_DESCRIPTION = exports.PORTAL_DEFAULT_REGISTER_TITLE = exports.PORTAL_DEFAULT_LOGIN_DESCRIPTION = exports.PORTAL_DEFAULT_LOGIN_TITLE = exports.PORTAL_DEFAULT_LANDING_TITLE = exports.ADMIN_PERMISSIONS = exports.PROVIDER_PERMISSIONS = exports.READ_ONLY_DEFAULT = exports.READ_ONLY_ASSIGNED = exports.READ_ONLY_ALL = exports.INACCESSIBLE = exports.DEFAULT_ONLY_ACCESS = exports.ASSIGNED_AND_DEFAULT_ACCESS_ALL_CREATE = exports.ASSIGNED_AND_DEFAULT_ACCESS = exports.FULL_ACCESS = exports.NO_ACCESS = exports.DEFAULT_ACCESS = exports.ASSIGNED_ACCESS = exports.ALL_ACCESS = exports.UNIQUENESS_VIOLATION = exports.EMAIL_SYNC_FREQUENCY_IN_MS = exports.ONE_WEEK_IN_MS = exports.ONE_DAY_IN_MS = exports.ONE_HOUR_IN_MS = exports.ONE_MINUTE_IN_MS = exports.ORGANIZATION_WIDE_INTEGRATIONS = exports.CUSTOMER_IO_TITLE = exports.CHARGEBEE_TITLE = exports.KENDRA_TITLE = exports.DEVELOP_HEALTH_TITLE = exports.EMOTII_TITLE = exports.STRIPE_TITLE = exports.FULLSCRIPT_REDIRECT_URI_ENDING = exports.FULLSCRIPT_INTEGRATIONS_TITLE = exports.ZENDESK_REDIRECT_URI_ENDING = exports.ZENDESK_INTEGRATIONS_TITLE = exports.ACTIVE_CAMPAIGN_TITLE = exports.DOCSUMO_TITLE = exports.DOSESPOT_TITLE = exports.SUPERDIAL_TITLE = exports.ATHENA_TITLE = void 0;
exports.ATHENA_DOCUMENT_TYPES_TO_DISPLAY = exports.TELLESCOPE_PORTAL_SOURCE = exports.USER_PERSONAL_EMAIL_OVERRIDE = exports.PORTAL_PAGES_HIDDEN_BY_DEFAULT = exports.DOCUMENT_TYPE_CODINGS = exports.DOCUMENT_REFERENCE_CODINGS = exports.BUILT_IN_BOOLEANS_FOR_SET_FIELDS = exports.BUILT_INS_FOR_SET_FIELDS = exports.CURRENT_POLICY_VERION = exports.DAYS_OF_WEEK_STARTING_SUNDAY = exports.CANDID_MODIFIERS = exports.WEIGHT_UNITS = exports.VITAL_UNITS = exports.VITAL_UNITS_INFO = exports.VITAL_RANGE_CLASSIFICATIONS = exports.TELLESCOPE_GENDERS = exports.INSURANCE_RELATIONSHIPS_CANVAS = void 0;
exports.ALL_ENDUSER_FIELDS_TO_DISPLAY_NAME = {
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
exports.READONLY_ENDUSER_FIELDS_TO_DISPLAY_NAME = {
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
exports.ENDUSER_FIELD_TYPES = {
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
exports.PRIMARY_HEX = "#1564bf";
exports.SECONDARY_HEX = "#1c4378";
exports.ERROR_HEX = "#bf2c15";
exports.WARNING_HEX = "#bfab15";
exports.ADMIN_ROLE = "Admin";
exports.BUSINESS_TYPE = "Business";
exports.CREATOR_ONLY_ACCESS = 'creatorOnly';
exports.DEFAULT_OPERATIONS = {
    create: {},
    createMany: {},
    update: {},
    read: {},
    readMany: {},
    delete: {}
};
exports.ACCESS_ACTION_FOR_OPERATION = {
    create: 'create',
    createMany: 'create',
    update: 'update',
    read: 'read',
    readMany: 'read',
    delete: 'delete'
};
exports.PLACEHOLDER_ID = "60398bb15da8abef87ef41f5";
exports.USER_SESSION_TYPE = 'user';
exports.ENDUSER_SESSION_TYPE = 'enduser';
exports.SECONDS_IN_ONE_YEAR = 31560000;
exports.UNSEARCHABLE_FIELDS = ['_id', 'id', 'creator', 'createdAt', 'updatedAt', 'businessId', 'enduserId', 'organizationIds', 'sharedWithOrganizations'];
exports.QUESTION_GROUP_VALUE_PLACEHOLDER = "_question_group";
exports.MM_DD_YYYY_REGEX = /[0-1][0-9]-[0-3][0-9]-[1-2][0-9][0-9][0-9]/;
exports.GOOGLE_INTEGRATIONS_TITLE = "Google";
exports.PAGER_DUTY_TITLE = "Pager Duty";
exports.SMART_METER_TITLE = "Smart Meter";
exports.DR_CHRONO_INTEGRATIONS_TITLE = "Dr. Chrono";
exports.DR_CHRONO_REDIRECT_URI_ENDING = "/dr-chrono-oauth2-verify";
exports.SQUARE_INTEGRATIONS_TITLE = "Square";
exports.SQUARE_REDIRECT_URI_ENDING = "/square-oauth2-verify";
exports.DIALPAD_INTEGRATIONS_TITLE = "DialPad";
exports.DIALPAD_REDIRECT_URI_ENDING = "/dialpad-oauth2-verify";
exports.OUTLOOK_INTEGRATIONS_TITLE = "Outlook";
exports.MICROSOFT_INTEGRATIONS_TITLE = "Microsoft";
exports.OUTLOOK_REDIRECT_URI_ENDING = "/outlook-oauth2-verify";
exports.MICROSOFT_OIDC_URI_ENDING = "/microsoft-oidc-verify";
exports.ZOHO_TITLE = "Zoho";
exports.ZOHO_URI_ENDING = "/zoho-oauth2-verify";
exports.ZOOM_TITLE = "Zoom";
exports.ZOOM_URI_ENDING = "/zoom-oauth2-verify";
exports.OPENAI_TITLE = "OpenAI";
exports.HEALTHIE_TITLE = "Healthie";
exports.ITERABLE_TITLE = "Iterable";
exports.MEDPLUM_TITLE = "Medplum";
exports.PHASE_ZERO_TITLE = "Phase Zero";
exports.PHOTON_TITLE = "Photon Health";
exports.VITAL_TITLE = "Vital";
exports.ELATION_TITLE = "Elation";
exports.ZUS_TITLE = "Zus";
exports.OPEN_LOOP_TITLE = "OpenLoop";
exports.CANVAS_TITLE = "Canvas";
exports.MFAX_TITLE = "mFax";
exports.CANDID_TITLE = "Candid";
exports.GOGO_MEDS_TITLE = "GoGoMeds";
exports.ATHENA_TITLE = "athenahealth";
exports.SUPERDIAL_TITLE = "SuperDial";
exports.DOSESPOT_TITLE = "DoseSpot";
exports.DOCSUMO_TITLE = "Docsumo";
exports.ACTIVE_CAMPAIGN_TITLE = "ActiveCampaign";
exports.ZENDESK_INTEGRATIONS_TITLE = "Zendesk";
exports.ZENDESK_REDIRECT_URI_ENDING = "/zendesk-oauth2-verify";
exports.FULLSCRIPT_INTEGRATIONS_TITLE = "Fullscript";
exports.FULLSCRIPT_REDIRECT_URI_ENDING = "/fullscript-oauth2-verify";
exports.STRIPE_TITLE = "Stripe";
exports.EMOTII_TITLE = "Emotii";
exports.DEVELOP_HEALTH_TITLE = "Develop Health";
exports.KENDRA_TITLE = "Kendra";
exports.CHARGEBEE_TITLE = "Chargebee";
exports.CUSTOMER_IO_TITLE = "Customer IO";
exports.ORGANIZATION_WIDE_INTEGRATIONS = [
    exports.OPENAI_TITLE,
    exports.ATHENA_TITLE,
    exports.DOSESPOT_TITLE,
    exports.DOCSUMO_TITLE,
    exports.ZUS_TITLE,
    exports.ELATION_TITLE,
    exports.HEALTHIE_TITLE,
    exports.CANVAS_TITLE,
    exports.MEDPLUM_TITLE,
    exports.PAGER_DUTY_TITLE,
    exports.SMART_METER_TITLE,
    // ITERABLE_TITLE, // we now support multiple Iterable connections
    exports.CANDID_TITLE,
    exports.GOGO_MEDS_TITLE,
    exports.PHOTON_TITLE,
    exports.MFAX_TITLE,
    exports.MEDPLUM_TITLE,
    exports.ACTIVE_CAMPAIGN_TITLE,
    exports.EMOTII_TITLE,
    exports.DEVELOP_HEALTH_TITLE,
    exports.CUSTOMER_IO_TITLE,
    exports.SUPERDIAL_TITLE,
];
exports.ONE_MINUTE_IN_MS = 1000 * 60;
exports.ONE_HOUR_IN_MS = 60 * exports.ONE_MINUTE_IN_MS; // 1hr
exports.ONE_DAY_IN_MS = 24 * exports.ONE_HOUR_IN_MS;
exports.ONE_WEEK_IN_MS = exports.ONE_DAY_IN_MS * 7;
exports.EMAIL_SYNC_FREQUENCY_IN_MS = exports.ONE_HOUR_IN_MS;
exports.UNIQUENESS_VIOLATION = 'Uniqueness Violation';
exports.ALL_ACCESS = "All";
exports.ASSIGNED_ACCESS = "Assigned";
exports.DEFAULT_ACCESS = "Default";
exports.NO_ACCESS = null;
exports.FULL_ACCESS = {
    create: exports.ALL_ACCESS,
    read: exports.ALL_ACCESS,
    update: exports.ALL_ACCESS,
    delete: exports.ALL_ACCESS,
};
exports.ASSIGNED_AND_DEFAULT_ACCESS = {
    create: exports.ASSIGNED_ACCESS,
    read: exports.ASSIGNED_ACCESS,
    update: exports.ASSIGNED_ACCESS,
    delete: exports.NO_ACCESS,
};
exports.ASSIGNED_AND_DEFAULT_ACCESS_ALL_CREATE = {
    create: exports.ALL_ACCESS,
    read: exports.ASSIGNED_ACCESS,
    update: exports.ASSIGNED_ACCESS,
    delete: exports.NO_ACCESS,
};
exports.DEFAULT_ONLY_ACCESS = {
    create: exports.DEFAULT_ACCESS,
    read: exports.DEFAULT_ACCESS,
    update: exports.DEFAULT_ACCESS,
    delete: exports.NO_ACCESS,
};
exports.INACCESSIBLE = {
    create: exports.NO_ACCESS,
    read: exports.NO_ACCESS,
    update: exports.NO_ACCESS,
    delete: exports.NO_ACCESS,
};
exports.READ_ONLY_ALL = {
    create: exports.NO_ACCESS,
    read: exports.ALL_ACCESS,
    update: exports.NO_ACCESS,
    delete: exports.NO_ACCESS,
};
exports.READ_ONLY_ASSIGNED = {
    create: exports.NO_ACCESS,
    read: exports.ASSIGNED_ACCESS,
    update: exports.NO_ACCESS,
    delete: exports.NO_ACCESS,
};
exports.READ_ONLY_DEFAULT = {
    create: exports.NO_ACCESS,
    read: exports.DEFAULT_ACCESS,
    update: exports.NO_ACCESS,
    delete: exports.NO_ACCESS,
};
exports.PROVIDER_PERMISSIONS = {
    waitlists: exports.READ_ONLY_ALL,
    agent_records: exports.READ_ONLY_ALL,
    integration_logs: exports.READ_ONLY_ALL,
    allergy_codes: exports.READ_ONLY_ALL,
    diagnosis_codes: exports.READ_ONLY_ALL,
    suggested_contacts: exports.READ_ONLY_ALL,
    portal_brandings: exports.INACCESSIBLE,
    webhook_logs: exports.INACCESSIBLE,
    call_hold_queues: {
        create: exports.NO_ACCESS,
        read: exports.DEFAULT_ACCESS,
        update: exports.NO_ACCESS,
        delete: exports.NO_ACCESS,
    },
    ticket_queues: {
        create: exports.NO_ACCESS,
        read: exports.DEFAULT_ACCESS,
        update: exports.NO_ACCESS,
        delete: exports.NO_ACCESS,
    },
    group_mms_conversations: {
        create: exports.ALL_ACCESS,
        read: exports.ASSIGNED_ACCESS,
        update: exports.ASSIGNED_ACCESS,
        delete: exports.NO_ACCESS,
    },
    enduser_encounters: {
        create: exports.ALL_ACCESS,
        read: exports.ASSIGNED_ACCESS,
        update: exports.ASSIGNED_ACCESS,
        delete: exports.NO_ACCESS,
    },
    enduser_orders: {
        create: exports.ALL_ACCESS,
        read: exports.ASSIGNED_ACCESS,
        update: exports.ASSIGNED_ACCESS,
        delete: exports.NO_ACCESS,
    },
    blocked_phones: {
        create: exports.ALL_ACCESS,
        read: exports.DEFAULT_ACCESS,
        update: exports.DEFAULT_ACCESS,
        delete: exports.DEFAULT_ACCESS,
    },
    vital_configurations: {
        create: exports.ALL_ACCESS,
        read: exports.ALL_ACCESS,
        update: exports.ASSIGNED_ACCESS,
        delete: exports.NO_ACCESS,
    },
    message_template_snippets: exports.READ_ONLY_ALL,
    enduser_custom_types: exports.READ_ONLY_ALL,
    superbill_providers: exports.READ_ONLY_ALL,
    superbills: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    enduser_medications: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    automation_triggers: exports.READ_ONLY_ALL,
    availability_blocks: exports.READ_ONLY_ALL,
    analytics_frames: exports.READ_ONLY_ALL,
    api_keys: exports.INACCESSIBLE,
    apiKeys: exports.INACCESSIBLE,
    automation_steps: exports.INACCESSIBLE,
    automated_actions: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    chats: exports.FULL_ACCESS,
    chat_rooms: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    emails: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    endusers: exports.DEFAULT_ONLY_ACCESS,
    enduser_status_updates: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    enduser_eligibility_results: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    engagement_events: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    files: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    forms: exports.READ_ONLY_ALL,
    form_groups: exports.READ_ONLY_ALL,
    form_fields: exports.READ_ONLY_ALL,
    form_responses: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    journeys: exports.READ_ONLY_ALL,
    meetings: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    sms_messages: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    tickets: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    templates: exports.READ_ONLY_ALL,
    organizations: exports.READ_ONLY_ALL,
    appointment_booking_pages: exports.INACCESSIBLE,
    appointment_locations: exports.READ_ONLY_ALL,
    phone_calls: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    enduser_profile_views: exports.READ_ONLY_ALL,
    phone_trees: exports.READ_ONLY_ALL,
    configurations: exports.READ_ONLY_ALL,
    users: __assign(__assign({}, exports.READ_ONLY_ALL), { update: 'Default' }),
    notes: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    webhooks: exports.INACCESSIBLE,
    calendar_events: __assign(__assign({}, exports.ASSIGNED_AND_DEFAULT_ACCESS), { delete: exports.ASSIGNED_ACCESS }),
    calendar_event_templates: __assign(__assign({}, exports.ASSIGNED_AND_DEFAULT_ACCESS), { create: exports.NO_ACCESS }),
    calendar_event_RSVPs: __assign(__assign({}, exports.ASSIGNED_AND_DEFAULT_ACCESS), { delete: exports.ASSIGNED_ACCESS }),
    user_logs: exports.INACCESSIBLE,
    user_notifications: __assign(__assign({}, exports.ASSIGNED_AND_DEFAULT_ACCESS), { delete: exports.ASSIGNED_ACCESS }),
    fax_logs: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    enduser_observations: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    enduser_problems: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    forum_posts: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    forums: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    managed_content_records: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    managed_content_record_assignments: __assign(__assign({}, exports.ASSIGNED_AND_DEFAULT_ACCESS), { delete: exports.ASSIGNED_ACCESS }),
    post_comments: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    post_likes: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    comment_likes: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    integrations: exports.FULL_ACCESS,
    databases: {
        read: exports.ALL_ACCESS,
        create: exports.NO_ACCESS,
        delete: exports.NO_ACCESS,
        update: exports.NO_ACCESS
    },
    database_records: {
        read: exports.DEFAULT_ACCESS,
        create: exports.NO_ACCESS,
        delete: exports.NO_ACCESS,
        update: exports.NO_ACCESS
    },
    portal_customizations: exports.INACCESSIBLE,
    care_plans: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    enduser_tasks: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    role_based_access_permissions: exports.READ_ONLY_ALL,
    products: exports.READ_ONLY_ALL,
    purchases: exports.ASSIGNED_AND_DEFAULT_ACCESS,
    purchase_credits: __assign(__assign({}, exports.ASSIGNED_AND_DEFAULT_ACCESS), { delete: exports.NO_ACCESS }),
    background_errors: exports.INACCESSIBLE,
    enduser_views: exports.READ_ONLY_ALL,
    table_views: exports.READ_ONLY_ALL,
    prescription_routes: exports.READ_ONLY_ALL,
    email_sync_denials: {
        read: exports.ALL_ACCESS,
        create: exports.ALL_ACCESS,
        delete: exports.NO_ACCESS,
        update: exports.DEFAULT_ACCESS
    },
    ticket_threads: exports.ASSIGNED_AND_DEFAULT_ACCESS_ALL_CREATE,
    ticket_thread_comments: exports.ASSIGNED_AND_DEFAULT_ACCESS_ALL_CREATE,
    flowchart_notes: {
        read: exports.ALL_ACCESS,
        create: exports.ALL_ACCESS,
        update: exports.ASSIGNED_ACCESS,
        delete: exports.NO_ACCESS,
    },
};
exports.ADMIN_PERMISSIONS = {
    waitlists: exports.FULL_ACCESS,
    integration_logs: exports.READ_ONLY_ALL,
    agent_records: exports.FULL_ACCESS,
    enduser_eligibility_results: exports.FULL_ACCESS,
    allergy_codes: exports.FULL_ACCESS,
    diagnosis_codes: exports.FULL_ACCESS,
    suggested_contacts: exports.FULL_ACCESS,
    call_hold_queues: exports.FULL_ACCESS,
    fax_logs: exports.FULL_ACCESS,
    message_template_snippets: exports.FULL_ACCESS,
    portal_brandings: exports.FULL_ACCESS,
    webhook_logs: exports.READ_ONLY_ALL,
    form_groups: exports.FULL_ACCESS,
    flowchart_notes: exports.FULL_ACCESS,
    enduser_problems: exports.FULL_ACCESS,
    prescription_routes: exports.FULL_ACCESS,
    blocked_phones: exports.FULL_ACCESS,
    vital_configurations: exports.FULL_ACCESS,
    enduser_encounters: exports.FULL_ACCESS,
    enduser_orders: exports.FULL_ACCESS,
    group_mms_conversations: exports.FULL_ACCESS,
    ticket_queues: exports.FULL_ACCESS,
    phone_trees: exports.FULL_ACCESS,
    configurations: exports.FULL_ACCESS,
    superbill_providers: exports.FULL_ACCESS,
    superbills: exports.FULL_ACCESS,
    automation_triggers: exports.FULL_ACCESS,
    background_errors: exports.FULL_ACCESS,
    enduser_views: exports.FULL_ACCESS,
    availability_blocks: exports.FULL_ACCESS,
    analytics_frames: exports.FULL_ACCESS,
    appointment_locations: exports.FULL_ACCESS,
    api_keys: exports.FULL_ACCESS,
    appointment_booking_pages: exports.FULL_ACCESS,
    apiKeys: exports.FULL_ACCESS,
    automated_actions: exports.FULL_ACCESS,
    chat_rooms: exports.FULL_ACCESS,
    emails: exports.FULL_ACCESS,
    endusers: exports.FULL_ACCESS,
    enduser_status_updates: exports.FULL_ACCESS,
    engagement_events: exports.FULL_ACCESS,
    files: exports.FULL_ACCESS,
    forms: exports.FULL_ACCESS,
    form_fields: exports.FULL_ACCESS,
    form_responses: exports.FULL_ACCESS,
    journeys: exports.FULL_ACCESS,
    meetings: exports.FULL_ACCESS,
    chats: exports.FULL_ACCESS,
    sms_messages: exports.FULL_ACCESS,
    tickets: exports.FULL_ACCESS,
    templates: exports.FULL_ACCESS,
    users: exports.FULL_ACCESS,
    notes: exports.FULL_ACCESS,
    webhooks: exports.FULL_ACCESS,
    calendar_events: exports.FULL_ACCESS,
    calendar_event_templates: exports.FULL_ACCESS,
    calendar_event_RSVPs: exports.FULL_ACCESS,
    automation_steps: exports.FULL_ACCESS,
    user_logs: __assign(__assign({}, exports.FULL_ACCESS), { delete: null }),
    user_notifications: exports.FULL_ACCESS,
    enduser_observations: exports.FULL_ACCESS,
    forum_posts: exports.FULL_ACCESS,
    forums: exports.FULL_ACCESS,
    managed_content_records: exports.FULL_ACCESS,
    post_comments: exports.FULL_ACCESS,
    post_likes: exports.FULL_ACCESS,
    comment_likes: exports.FULL_ACCESS,
    organizations: exports.FULL_ACCESS,
    integrations: exports.FULL_ACCESS,
    databases: exports.FULL_ACCESS,
    database_records: exports.FULL_ACCESS,
    portal_customizations: exports.FULL_ACCESS,
    care_plans: exports.FULL_ACCESS,
    enduser_tasks: exports.FULL_ACCESS,
    managed_content_record_assignments: exports.FULL_ACCESS,
    role_based_access_permissions: exports.FULL_ACCESS,
    products: exports.FULL_ACCESS,
    purchase_credits: exports.FULL_ACCESS,
    purchases: exports.FULL_ACCESS,
    phone_calls: exports.FULL_ACCESS,
    enduser_profile_views: exports.FULL_ACCESS,
    enduser_medications: exports.FULL_ACCESS,
    enduser_custom_types: exports.FULL_ACCESS,
    table_views: exports.FULL_ACCESS,
    email_sync_denials: exports.FULL_ACCESS,
    ticket_threads: exports.FULL_ACCESS,
    ticket_thread_comments: exports.FULL_ACCESS,
};
exports.PORTAL_DEFAULT_LANDING_TITLE = "Your Portal";
exports.PORTAL_DEFAULT_LOGIN_TITLE = "Welcome back!";
exports.PORTAL_DEFAULT_LOGIN_DESCRIPTION = "Log in to your account.";
exports.PORTAL_DEFAULT_REGISTER_TITLE = "Getting Started";
exports.PORTAL_DEFAULT_REGISTER_DESCRIPTION = "Let's create your account.";
exports.CPT_CODES = [
    { code: "76641", label: 'ULTRASOUND BREAST COMPLETE' },
    { code: "76642", label: 'ULTRASOUND BREAST LIMITED' },
    { code: "99202", label: "Video call, new patient, up to 20 mins" },
    { code: "99203", label: "Video call, new patient, longer than 20 mins" },
    { code: "99211", label: "Video call, established patient" },
    { code: "99441", label: "Phone call (up to 10 mins) with patient" },
    { code: "99442", label: "Phone call (11-20 mins) with patient" },
    { code: "99421", label: "Async digital evaluation 5-10 mins" },
];
exports.HELPDESK_TICKET_CLOSE_REASONS = [
    "Resolved",
    "Transferred",
    "Not needed",
    "Unresponsive",
];
exports.AUTOMATED_ACTION_CANCEL_REASONS = [
    'Removed by User',
    'Restarted in Journey',
    'Form Submission',
    'Incoming Communication',
    'Removed by Automation',
];
exports.RELATIONSHIP_TYPES = [
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
var get_inverse_relationship_type = function (type) { return (type === 'Child'
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
exports.get_inverse_relationship_type = get_inverse_relationship_type;
// maps to HIPAA Individual Relationship Codes (source https://med.noridianmedicare.com/web/jea/topics/claim-submission/patient-relationship-codes)
exports.INSURANCE_RELATIONSHIPS_TO_CODE = {
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
exports.INSURANCE_RELATIONSHIPS = Object.keys(exports.INSURANCE_RELATIONSHIPS_TO_CODE);
exports.INSURANCE_RELATIONSHIPS_ALPHABETICAL = exports.INSURANCE_RELATIONSHIPS.sort(function (v1, v2) { return v1.localeCompare(v2); });
exports.INSURANCE_RELATIONSHIPS_CANVAS_MAPPING = {
    'Child': 'child',
    Spouse: 'spouse',
    "Other Relationship": 'other',
    Self: "self",
    "Injured Plaintiff": 'injured'
};
exports.INSURANCE_RELATIONSHIPS_CANVAS = Object.keys(exports.INSURANCE_RELATIONSHIPS_CANVAS_MAPPING);
exports.TELLESCOPE_GENDERS = ["Female", "Male", 'Other', 'Unknown'];
exports.VITAL_RANGE_CLASSIFICATIONS = ['Target', 'High', 'Low', 'Very High', 'Very Low', 'Critical High', 'Critical Low'];
exports.VITAL_UNITS_INFO = {
    "DBP": { label: "Diastolic Blood Pressure" },
    "BPM": { label: "Heart Rate BPM" },
    "LB": { label: "Weight in Pounds" },
    "O2 Sat%": { label: "Blood Oxygen Saturation %" },
    "SBP": { label: "Systolic Blood Pressure" },
    "mg/dL": { label: "Blood Glucose (mg/dL)" },
    "A1C": { label: "A1C" },
};
exports.VITAL_UNITS = Object.keys(exports.VITAL_UNITS_INFO);
exports.WEIGHT_UNITS = ['LB'];
exports.CANDID_MODIFIERS = [
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
exports.DAYS_OF_WEEK_STARTING_SUNDAY = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
exports.CURRENT_POLICY_VERION = "v2.0";
exports.BUILT_INS_FOR_SET_FIELDS = [
    'defaultFromPhone',
    'defaultFromEmail',
];
exports.BUILT_IN_BOOLEANS_FOR_SET_FIELDS = [
    "useDefaultFromPhoneInAutomations",
    "useDefaultFromEmailInAutomations",
    'lockedFromPortal',
];
exports.DOCUMENT_REFERENCE_CODINGS = [
    {
        "system": "http://schemas.canvasmedical.com/fhir/document-reference-category",
        "code": "patientadministrativedocument"
    },
    {
        "system": "http://schemas.canvasmedical.com/fhir/document-reference-category",
        "code": "uncategorizedclinicaldocument"
    },
];
exports.DOCUMENT_TYPE_CODINGS = [
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
];
exports.PORTAL_PAGES_HIDDEN_BY_DEFAULT = [
    "Orders", "Vitals",
];
exports.USER_PERSONAL_EMAIL_OVERRIDE = "personal@tellescope.com";
exports.TELLESCOPE_PORTAL_SOURCE = "Tellescope Portal";
exports.ATHENA_DOCUMENT_TYPES_TO_DISPLAY = {
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
    encounterdocument: {
        display: "Encounter Document",
        subclasses: [
            "IMAGEDOC",
            "PATIENTHISTORY",
            "PROCEDUREDOC",
            "PROGRESSNOTE",
        ],
        sources: [],
    },
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
};
//# sourceMappingURL=constants.js.map